// ==UserScript==
// @name        Installability
// @description Every web page is an installable app! Generate or repair a Web Manifest for any web page.
// @namespace   Itsnotlupus Industries
// @match       https://*/*
// @version     1.8
// @noframes
// @author      itsnotlupus
// @license     MIT
// @require     https://greasyfork.org/scripts/468394-itsnotlupus-tiny-utilities/code/utils.js
// @grant       GM_xmlhttpRequest
// @grant       GM_addElement
// @grant       GM_getValue
// @grant       GM_setValue
// @connect     *
// @downloadURL https://update.greasyfork.org/scripts/472541/Installability.user.js
// @updateURL https://update.greasyfork.org/scripts/472541/Installability.meta.js
// ==/UserScript==

/* jshint esversion:11 */
/* eslint curly: 0 no-return-assign: 0, no-loop-func: 0 */
/* global $, $$, crel, log, logGroup, withLogs, fetchJSON, observeDOM */

/**
 * Wishlist:
 * - too many rules. can't deploy a worker, etc.
 *   - how far could a userscript go in emulating an offline worker tho?
 *     - fetch/xhr can be intercepted.
 *     - image loading could be polyfilled too.
 *     - page navigation is iffier. if the first page doesn't load, the userscript won't either.
 *     - but if we can get pasted that, network-first offline policy would probably cause the least damage (https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching)
 *     - [...new Set([...$$`[href],[src]`].map(a=>a.href??a.src).filter(url=>url.startsWith(location.origin)).map(url=>url.split('#')[0]))] // things one might precache in an install event handler
 *   - maskable icons (which involves finding the smallest rect that captures all non-transparent pixels, and shrinking them to fit within safe area.)
 * - take the silliness further:
 *   - detecting main site navigation entrypoints and generating shortcuts would kinda kick ass.
 *   - look for more weird PWA features, and see if there's a generic way to leverage them.
 */

// Bits of code that might be useful later:

// 1. holding a user's hand to get installed. in case the script ever exposes a more visible mean to install an app, I guess.
//early:
//  const installer = await new Promise(r => addEventListener('beforeinstallprompt', r));
//later:
//  installer.prompt();
//  const { outcome } = await installer.userChoice;
//  const installed = await new Promise(r => addEventListener('appinstalled', r);

// a default app icon to use if no suitable icons are found in the site
const FALLBACK_ICON = 'data:image/svg+xml;base64,'+btoa`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><defs><linearGradient id="a" x1="-44" x2="-4" y1="-24" y2="-24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#009467"/><stop offset="1" stop-color="#87d770"/></linearGradient></defs><rect width="40" height="40" x="-44" y="-44" fill="url(#a)" rx="20" transform="matrix(0 -1 -1 0 0 0)"/><path d="M4 23.5v.5a20 20 0 1 0 40 0v-.5a20 20 0 0 1-40 0z" opacity=".1"/><path fill="#fff" d="M24.5 23a1.5 1.5 0 0 0 0 3 1.5 1.5 0 0 0 0-3z"/><g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round"><path d="M33.5 27.5s3-1 3-3c0-3.5-9.2-5-12.5-5-7-.1-12.3 1.4-12.5 4s3 3 3 3"/><path d="M30.5 17.5s1.1-3.8-.6-4.7c-3-1.7-8.9 5.7-10.5 8.4-3.7 6-5 11.4-2.8 12.9 2.2 1.4 3.9-.6 3.9-.6"/><path d="M21.5 14.5s-2.2-2.4-3.8-1.4c-3 1.8.3 10.5 2 13.4 3.3 6.2 7.3 10 9.6 8.8 5.2-2-.8-12.8-.8-12.8"/></g></svg>`;

// keep cached bits of manifests on any given site for 24 hours before fetching/generating new ones.
const CACHE_MANIFEST_EXPIRATION = 24*3600*1000; 

/** cache the result of work() into GM storage for a day. */
async function cacheInto(key, work) {
  const cached = GM_getValue(key);
  if (cached && cached.expires > Date.now()) return cached.data;
  const data = await work();
  if (data != null) GM_setValue(key, { expires: Date.now() + CACHE_MANIFEST_EXPIRATION, data });
  return data;
}

/** Resolve a relative URL into an absolute URL */
const resolveURL = (url, base=location.href) => url && new URL(url, base).toString();

/**
 * load an image without CSP restrictions.
 */
function getImage(src) {1
  return new Promise((resolve) => {
    const img = GM_addElement('img', {
      src: resolveURL(src),
      crossOrigin: "anonymous"
    });
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.remove();
  });
}

/** test if the URL given loads correctly (not 404, etc.) */
function workingURL(src) {
  return new Promise(resolve => {
    const url = resolveURL(src);
    GM_xmlhttpRequest({
      url,
      method: "HEAD",
      onload(res) {
        resolve(res.status<300);
      },
      onerror() {
        resolve(false);
      }
    });
  });
}

function cachedWorkingURL(src) {
  return cacheInto('working-url:'+src, () => workingURL(src));
}

/** fetch an arbitrary URL using current browser cookies. no restrictions. */
function grabURL(src) {
  return new Promise(resolve => {
    const url = resolveURL(src);
    GM_xmlhttpRequest({
      url,
      responseType: 'blob',
      async onload(res) {
        resolve(res.response);
      },
      onerror() {
        log("Couldn't grab URL " + src);
        resolve(null);
      }
    });
  });
}

/**
 * Grab an image and its mime-type regardless of browser sandbox limitations.
 */
async function getUntaintedImage(src) {
  const blob = await grabURL(src);
  const blobURL = URL.createObjectURL(blob);
  const img = await getImage(blobURL);
  if (!img) return null;
  URL.revokeObjectURL(blobURL);
  return {
    src: resolveURL(src),
    img,
    width: img.naturalWidth,
    height: img.naturalHeight,
    type: blob.type
  };
}

function makeBigPNG({ img }) {
  // scale to at least 512x512, but keep the pixels if there are more.
  const width = Math.max(512, img.width);
  const height = Math.max(512, img.height);
  const canvas = crel('canvas', { width, height });
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);
  const url = canvas.toDataURL({ type: "image/png" });
  return {
    src: url,
    width,
    height,
    type: "image/png"
  };
}

function guessAppName() {
  // Remember how there's this universal way to get a web site's name? Yeah, me neither.
  const goodNames = [
    // plausible places to find one
    $`meta[name="application-name"]`?.content,
    $`meta[name="apple-mobile-web-app-title"]`?.content,
    $`meta[name="al:android:app_name"]`?.content,
    $`meta[name="al:ios:app_name"]`?.content,
    $`meta[property="og:site_name"]`?.content,
    $`meta[property="og:title"]`?.content,
  ].filter(v=>!!v).sort((a,b)=>a.length-b.length); // short names first.
  const badNames = [
    // various bad ideas
    $`link[rel="search]"`?.title.replace(/ search/i,''),
    document.title,
    $`h1`?.textContent,
    [...location.hostname.replace(/^www\./,'')].map((c,i)=>i?c:c.toUpperCase()).join('') // capitalized domain name. If everything else fails, there's at least this.
  ].filter(v=>!!v);
  const short_name = goodNames[0] ?? badNames[0];
  //const app_name = goodNames.at(-1) ?? badNames[0];
  return short_name;
}

function guessAppDescription() {
  const descriptions = [
    $`meta[property="og:description"]`?.content,
    $`meta[name="description"]`?.content,
    $`meta[name="description"]`?.getAttribute("value"),
    $`meta[name="twitter:description"]`?.content,
  ].filter(v=>!!v);
  return descriptions[0];
}

function guessAppColors() {
  const colors = [
    $`meta[name="theme-color"]`?.content,
    getComputedStyle(document.body).backgroundColor
  ].filter(v=>!!v);
  return {
    theme_color: colors[0],
    background_color: colors.at(-1)
  };
}

async function gatherAppIcons() {
  // focus on caching only the bits with network requests
  return cacheInto("images:"+location.origin, async () => {
     const iconURLs = [
      ...Array.from($$`link[rel*="icon"]`).filter(link=>link.rel!="mask-icon").map(link=>link.href),
      resolveURL($`meta[itemprop="image"]`?.content),
    ].filter(v=>!!v);
    // fetch all the icons, so we know what we're working with.
    const images = (await Promise.all(iconURLs.map(getUntaintedImage))).filter(v=>!!v);
    if (!images.length) {
      const fallback = await getUntaintedImage("/favicon.ico"); // last resort. well known location for tiny site icons.
      if (fallback) images.unshift(fallback);
    }
    if (!images.length) {
      images.unshift(await getUntaintedImage(FALLBACK_ICON));
      verb = 'generated with a fallback icon';
    }
    const icons = images.map(img => ({
      src: img.src,
      sizes: `${img.width}x${img.height}`,
      type: img.type
    }));
    await fixAppIcons(icons);
    verb = '';
    return icons;
  });
}

function getIconMaxSize(icon) {
  // "any" is technically infinite, but 512x512 is close enough
  const sizes = icon.sizes.split(/\s+/).map(size=>size=='any'?[512,512]:size.split(/x/i).map(v=>+v)).sort((a,b)=>b[0]-a[0]);
  return sizes[0]; // [ width, height ]
}

function appIconsValid(icons) {
  return icons.some(icon => {
    const [ width, height ] = getIconMaxSize(icon);
    return width >= 512 && height >= 512 && icon.type == 'image/png';
  });
}

async function fixAppIcons(icons) {
  icons.sort((a,b)=>getIconMaxSize(b)[0] - getIconMaxSize(a)[0]); // largest image first. suboptimal
  // grab the biggest one.
  const biggestImage = icons[0];
  const [ width, height ] = getIconMaxSize(biggestImage);
  if (width < 512 || height < 512 || biggestImage.type !== 'image/png') {
    log(`We may not have a valid icon yet, scaling an image of type ${biggestImage.type} and size (${width}x${height}) into a big enough PNG.`);
    // welp, we're gonna scale it.
    const img = await makeBigPNG(await getUntaintedImage(biggestImage.src));
    icons.unshift({
      src: img.src,
      sizes: `${img.width}x${img.height}`,
      type: img.type
    });
  }
  return icons;
}

async function guessRelatedApplications() {

  // 1. "app links", a weird decade old half-baked half-supported spec that has the data we'd need for this.
  // seen on threads.net, and probably not much elsewhere. but hey, we can parse synchronously and cheaply.
  const apps = [];
  const android_id = $`meta[property="al:android:package"]`?.content
  if (android_id) {
    const url = `https://play.google.com/store/apps/details?id=${android_id}`;
    if (await cachedWorkingURL(url)) {
      apps.push({
        platform: "play", // XXX "chromeos_play"?
        id: android_id,
        url
      });
    }
  }
  const ios_id = $`meta[property="al:ios:app_store_id"]`?.content;
  if (ios_id) {
    const app_name = $`meta[property="al:ios:app-name"]`?.content ?? 'app';
    const url = `https://apps.apple.com/app/${app_name}/${ios_id}`;
    if (await cachedWorkingURL(url)) {
      apps.push({
        platform: "itunes",
        id: ios_id,
        url
      });
    }
  }
  // theoretically, there could be more here, like windows app and stuff.
  // see https://developers.facebook.com/docs/applinks/metadata-reference

  // 2. .well-known/assetlinks.json
  // see https://github.com/google/digitalassetlinks/blob/master/well-known/details.md
  const assetLinksJson = await cacheInto("assetLinksJson:"+location.origin, async () => {
    try {
      return await fetchJSON(resolveURL("/.well-known/assetlinks.json"));
    } catch {
      return [];
    }
  });
  if (Array.isArray(assetLinksJson)) {
    await Promise.all(assetLinksJson.filter(i=>i.relation.includes("delegate_permission/common.handle_all_urls")).map(async ({target}) => {
      switch (target.namespace) {
        case "android_app": {
          const url = `https://play.google.com/store/apps/details?id=${target.package_name}`
          if (await cachedWorkingURL(url)) {
            apps.push({
              platform: "play",
              id: target.package_name,
              url
            });
          }
          break;
        }
        case "ios_app": { // the definition of unbridled optimism
          const url = `https://apps.apple.com/app/app/${target.id}`;
          if (await cachedWorkingURL(url)) {
            if (target.appid) apps.push({
              platform: "itunes",
              id: target.appid,
              url
            });
          }
          break;
        }
      }
    }));
  }
  // dedup apps right quick
  const urls = new Set;
  for (let i=apps.length-1;i>=0;i--) {
    if (urls.has(apps[i].url)) {
      apps.splice(i,1);
    } else {
      urls.add(apps[i].url);
    }
  }

  return apps.length ? apps : undefined;
}

/** modify manifest in place, turn all known relative URLs into absolute URLs */
function fixManifestURLs(manifest, manifestURL) {

  // a map of URLs in the manifest structure
  const URL_IN_MANIFEST = {
    file_handlers: [ { action: true } ],
    icons: [ { src: true } ],
    protocol_handlers: [ { url: true } ],
    scope: true,
    screenshots: [ { src: true } ],
    serviceworker: { url: true },
    share_target: { action: true },
    shortcuts: [ {
      url: true,
      icons: [ { src: true } ]
    } ],
    start_url: true
  };
  // How to use a map to traverse a manifest
  function recurse(obj, schema, transform) {
    if (Array.isArray(schema)) return obj.forEach(item => recurse(item, schema[0], transform));
    Object.keys(schema).forEach(key => { switch (true) {
      case !obj[key]: return;
      case typeof obj[key] == 'object': recurse(obj[key], schema[key], transform); break;
      default: obj[key] = transform(obj[key]);
    }});
  }

  recurse(manifest, URL_IN_MANIFEST, url => resolveURL(url, manifestURL));
}

async function repairManifest() {
  let fixed = 0;
  const manifestURL = $`link[rel="manifest"]`.href;
  const manifest = await cacheInto("site_manifest:" + location.origin, async () => {
    verb = '';
    return JSON.parse(await (await grabURL(manifestURL)).text());
  });
  // since we're loading the manifest from a data: URL, get rid of all relative URLs
  fixManifestURLs(manifest, manifestURL);
  // fix: missing short_name
  if (!manifest.short_name) {
    log("Missing short_name field.");
    manifest.short_name = manifest.name || guessAppName();
    fixed++;
  }
  // fix: missing name
  if (!manifest.name) {
    log("Missing name field.");
    manifest.name = manifest.short_name || guessAppName();
    fixed++;
  }
  // fix: missing or insufficient icons
  if (!manifest.icons) {
    log("Missing icons field.");
    manifest.icons = await gatherAppIcons();
    fixed++;
  } else if (!appIconsValid(manifest.icons)) {
    log("Invalid icons field.");
    await fixAppIcons(manifest.icons);
    fixed++;
  }
  // fix: missing start_url
  if (!manifest.start_url) {
    log("Missing start_url field.");
    manifest.start_url = location.origin;
    fixed++;
  }
  // fix: invalid display value (typically "browser")
  if (!["standalone", "fullscreen", "minimal-ui"].includes(manifest.display)) {
    log("Missing or invalid display field.");
    manifest.display = "minimal-ui";
    fixed++;
  }
  if (manifest.prefer_related_applications) {
    log("Obsolete prefer_related_applications field found.");
    delete manifest.prefer_related_applications;
    fixed++;
  }
  if (manifest.launch_handler) {
    if (manifest.launch_handler.route_to) {
      log("Obsolete launch_handler.route_to field found, renaming to client_mode");
      manifest.launch_handler.client_mode = manifest.launch_handler.route_to;
      delete manifest.launch_handler.route_to;
      fixed++;
    }
    if (manifest.launch_handler.navigate_existing_client) {
      log ("Obsolete launch_handler.navigate_existing_client field found.");
      delete manifest.launch_handler.navigate_existing_client;
      fixed++;
    }
  }
  if (fixed) {
    $$`link[rel="manifest"]`.forEach(link=>link.remove());
    verb += `repaired ${fixed} issue${fixed>1?'s':''}`;
    return manifest;
  }
  // nothing to do, let the original manifest stand.nothing.
  verb += 'validated';
  return null;
}

// return an array of CSP sources acceptable for a manifest URL and usable by this script. may be empty.
async function inspectCSP() {
  const CSP_HEADER = 'Content-Security-Policy';
  const parseCSP = csp => csp?csp.split(';').map(line=>line.trim().split(/\s+/)).reduce((o,a)=>(a.length>1&&(o[a[0]]=a.slice(1)),o),{}):{};
  function checkCSP(csp, sources = []) {
    if (!Object.keys(csp).length) return sources;
    const allowedSources = csp['manifest-src'] ?? csp['default-src'];
    if (!allowedSources) return sources;
    return sources.filter(source=>allowedSources.includes(source));
  }

  const cspHeader = parseCSP((await fetch('', {method:'HEAD'})).headers.get(CSP_HEADER));
  const cspMeta = parseCSP($(`meta[http-equiv="${CSP_HEADER}"]`)?.content);
  const sources = checkCSP(cspMeta, checkCSP(cspHeader, ["data:", "blob:"]));
  if (sources.length) {
    // log("Acceptable manifest sources are ", sources);
  } else {
    log("CSP rules will probably prevent us from setting a manifest.");
  }
  return sources;
}

async function generateManifest(sources) {

  const short_name = guessAppName();
  const description = guessAppDescription();
  const { theme_color, background_color } = guessAppColors();

  const icons = await gatherAppIcons();

  const related_applications = await guessRelatedApplications();

  verb += 'generated';
  // There it is, our glorious Web Manifest.
  return {
    name: short_name,
    short_name,
    description,
    start_url: location.href,
    scope: resolveURL("/"),
    display: "standalone",
    display_override: [ "window-controls-overlay" ],
    theme_color,
    background_color,
    icons,
    related_applications
  };
}

let adjective;
let verb = 'grabbed from cache and ';

async function getManifest(sources) {
  const start = Date.now();
  let manifest;
  let wasGenerated = false;

  if ($`link[rel="manifest"]`) {
    adjective = 'Site';
    manifest = await repairManifest();
  } else {
    adjective = 'Custom';
    manifest = await generateManifest();
    wasGenerated = true;
  }

  if (manifest) {
    // Use GM_addElement to inject the manifest.
    // It doesn't succeed in bypassing Content Security Policy rules today, but maybe userscript extensions will make this work someday.
    // (Note: TamperMonkey Beta has a setting to disable CSP altogether in their Advanced Settings.)
    let manifestLink;
    if (sources.includes('data:')) {
      manifestLink = 'data:application/manifest+json;charset=utf-8,'+encodeURIComponent(JSON.stringify(manifest));
    } else {
      const blob = new Blob([JSON.stringify(manifest)], {type: 'application/manifest+json;charset=utf-8'});
      manifestLink = URL.createObjectURL(blob);
      // NOTE: no good way to revoke that URL. stick to page lifetime.
    }

    GM_addElement('link', {
      rel: "manifest",
      href: manifestLink
    });
    // This sets the color of the app title bar on desktop.
    if (!$`meta[name="theme-color"]`) GM_addElement('meta', {
      name: "theme-color",
      content: manifest.theme_color
    });
  }
  // summarize what we did.
  logGroup(`${adjective} manifest ${verb} in ${Date.now()-start}ms.`,
    manifest ?
      JSON.stringify(manifest,null,2).replace(/"data:.{70,}?"/g, url=>`"${url.slice(0,35)}…[${url.length-45}_more_bytes]…${url.slice(-10,-1)}"`)
      : $`link[rel="manifest"]`?.href ?? ''
  );
  return [manifest, wasGenerated];
}

// make a custom title bar from whatever header-like content we can find.
function customTitleBarJustAddWater(manifest) {

  let outerDisconnect;
  function findAndAdjustTitleBar(query) {
    if (query.matches) {

      let header = null;
      let disconnect;

      // 1. find a header. make it fit roughly as a titelbar, and make it draggable.
      function findHeader() {
        if (header && document.body.contains(header)) return;
        const nodes = [...$$`body *`];
        // header nodes are mostly top-most level nodes that cover the width of the page, are flush against the top of the page, and not too tall.
        // (all broad generalizations are faulty, etc.)
        const header_nodes = nodes.filter(n=> {
          const { width, height, top } = n.getBoundingClientRect();
          return document.body.clientWidth - width < 2 && top < 5 && height > 10 && height < 200;
        }).filter((n,i,a)=>a.every(p=>p==n||!p.contains(n)));
        if (!header_nodes.length) return;
        // ok, plausible header found. Yer a titlebar, Header!
        header = header_nodes[0];
        Object.assign(header.style, {
          // fixed or sticky position would be great here, but it's too likely to break pages that weren't expecting it.
          // settle for trying not to be drawn under native titlebar elements.
          WebkitAppRegion: 'drag',
          appRegion: 'drag',
          paddingLeft: 'env(titlebar-area-x, 0)',
          paddingRight: 'calc(100% - env(titlebar-area-width, 100%))',
          minHeight: 'env(titlebar-area-height, initial)',
          backgroundColor: manifest.theme_color
        });
        // 2. look for interactive elements within the header. make those not draggable.
        function findInteractiveHeaderElements() {
          // this won't catch clickable divs.
          $$('a,input,button,select,label,textarea', header).forEach(n=>Object.assign(n.style, {
            WebkitAppRegion: 'no-drag',
            appRegion: 'no-drag'
          }));
        }

        try { disconnect?.(); } catch (e) { log(e) }
        findInteractiveHeaderElements();
        disconnect = observeDOM(findInteractiveHeaderElements, header);
      }

      try { outerDisconnect?.(); } catch(e) { log(e) }
      findHeader();
      outerDisconnect = observeDOM(findHeader);
    } else {
      try { outerDisconnect?.(); } catch(e) { log(e) }
    }
  }

  const query = matchMedia('(display-mode: window-controls-overlay)');
  findAndAdjustTitleBar(query);
  query.addListener(e => findAndAdjustTitleBar(e));
}

async function main() {
  const sources = await inspectCSP();
  const [manifest, wasGenerated] = await getManifest(sources);
  // if there was a site manifest, then trust that someone knew what they were doing, and don't try weird shenanigans.
  if (wasGenerated) {
    // but if we instead foisted installability upon an unuspecting web page...
    await customTitleBarJustAddWater(manifest);
  }
}

main();