// ==UserScript==
// @name        Redirecting2Frontend
// @match       *://*/*
// @exclude     *://account*/*
// @exclude     *://message*/*
// @exclude     *://adsense.google.com/*
// @exclude     *://www.google.com/adsense/*
// @exclude     *://www.google.com/maps/*
// @license     MIT
// @grant       none
// @version     2.2
// @description This script links to the frontend of prominent services including YouTube, Twitter, Reddit, Imgur, Instagram, and TikTok. Updated from older script and reworked for newer frontends/frontend changes
// @run-at      document-start
// @namespace https://greasyfork.org/users/1401273
// @downloadURL https://update.greasyfork.org/scripts/518598/Redirecting2Frontend.user.js
// @updateURL https://update.greasyfork.org/scripts/518598/Redirecting2Frontend.meta.js
// ==/UserScript==

const hostname = window.location.hostname;
const hosts = {
"en.wikipedia.org": ["wiki.froth.zone", "wikiless.esmailelbob.xyz", "wikiless.northboot.xyz", "wl.vern.cc"],
  "i.imgur.com": ["rimgo.pussthecat.org", "rimgo.totaldarkness.net", "rimgo.vern.cc", "imgur.artemislena.eu", "rimgo.privacydev.net", "rimgo.bus-hit.me"],
  "i.stack.imgur.com": ["rimgo.pussthecat.org", "rimgo.totaldarkness.net", "rimgo.vern.cc", "imgur.artemislena.eu", "rimgo.privacydev.net", "rimgo.bus-hit.me"],//
  "imgur.com": ["rimgo.pussthecat.org", "rimgo.totaldarkness.net", "rimgo.vern.cc", "imgur.artemislena.eu", "rimgo.privacydev.net", "rimgo.bus-hit.me"],
  "m.youtube.com": ["inv.nadeko.net", "invidious.nerdvpn.de"],
  "medium.com": ["scribe.rip", "scribe.nixnet.services", "scribe.citizen4.eu", "scribe.bus-hit.me", "scribe.froth.zone", "scribe.rawbit.ninja"],
  "mobile.x.com": ["xcancel.com", "twstalker.com", "nitter.poast.org"],
  "music.youtube.com": ["hyperpipe.surge.sh", "hyperpipe.drgns.space", "hp.iqbalrifai.eu.org", "hyperpipe.projectsegfau.lt"],
  "odysee.com": ["lbry.projectsegfau.lt", "librarian.esmailelbob.xyz", "lbry.us.projectsegfau.lt", "lbry.ramondia.net"],
  "old.reddit.com": ["photon-reddit.com"],
  "stackoverflow.com": ["code.whatever.social", "ao.vern.cc", "overflow.adminforge.de", "ao.foss.wtf", "overflow.hostux.net"],
  "translate.google.com": ["tl.vern.cc", "translate.slipfox.xyz", "mozhi.aryak.me", "translate.projectsegfau.lt", "mozhi.gitro.xyz"],
  "www.goodreads.com": ["read.canine.tools", "biblioreads.ducks.party", "read.freedit.eu", "biblioreads.lunar.icu", "biblioreads.eu.org"],
  "www.imdb.com": ["ld.vern.cc", "libremdb.esmailelbob.xyz", "lmdb.tokhmi.xyz", "libremdb.iket.me", "libremdb.pussthecat.org"],
  "www.instagram.com": ["imginn.com"],
  "www.instructables.com": ["destructables.esmailelbob.xyz"],
//  "www.pinterest.com": ["bn.bloat.cat", "binternet.privacyredirect.com", "bn.opnxng.com", "binternet.4o1x5.dev"],
  "www.pixiv.net": ["pixivfe.drgns.space", "pixiv.perennialte.ch","pixivfe.thebunny.zone"],
  "www.quora.com": ["quetre.pussthecat.org", "quetre.gitro.xyz", "quetre.canine.tools", "quetre.r4fo.com"],
  "www.reddit.com": ["photon-reddit.com"],
  "www.reuters.com": ["neuters.de"],
  "www.snopes.com": ["sd.vern.cc", "suds.esmailelbob.xyz"],
  "www.tiktok.com": ["www.offtiktok.com", "tiktok.wpme.pl", "proxitok.belloworld.it"],
  "www.tumblr.com": ["pb.bloat.cat","priviblur.thebunny.zone"],
  "www.urbandictionary.com": ["rd.vern.cc"],
  "www.wolframalpha.com": ["wolfree.chickenkiller.com", "wolfree.crabdance.com", "wolfree.my.to", "wolfree.netlify.app", "wolfree.onrender.com", "wolfree.strangled.net"],
  "www.youtube-nocookie.com": ["inv.nadeko.net", "invidious.nerdvpn.de"],
  "x.com": ["xcancel.com", "twstalker.com", "nitter.poast.org"],
//  "web.archive.org": ["wayback-classic.net"],
//  "www.youtube.com": ["inv.nadeko.net", "invidious.nerdvpn.de"],
};

const replaceUrl = (url) => {
  const { host, pathname } = new URL(url);
  if (host === 'genius.com' && pathname.endsWith('-lyrics')) {
    const randomHost = ['dm.vern.cc', 'sing.whatever.social'][Math.floor(Math.random() * 0.5)];
    return url.replace(host, randomHost);
  } else if (host in hosts) {
    let replacement = hosts[host];
    if (Array.isArray(replacement)) {
      replacement = replacement[Math.floor(Math.random() * replacement.length)];
    }
    return url.replace(host, replacement);
  }
  return url;
};

try {
  const replacement = hosts[hostname];
  if (replacement) {
    const newUrl = replaceUrl(window.location.href);
    if (newUrl !== window.location.href) {
      window.location.replace(newUrl);
    }
  } else if (hostname === "genius.com" && window.location.pathname.endsWith("-lyrics")) {
    const randomHost = ["dm.vern.cc", "sing.whatever.social"][Math.floor(Math.random() * 0.5)];
    window.location.hostname = randomHost;
  } else if (hostname.endsWith('.bandcamp.com')) {
    const subdomain = hostname.slice(0, -'.bandcamp.com'.length);
    const path = window.location.pathname.split('/');
    if (path[1] === 'search') {
      const newUrl = `https://tent.bloatcat.tk/search.php?query=${path[2]}`;
      if (newUrl !== window.location.href) {
        window.location.replace(newUrl);
      }
    } else if (path[1] === 'img') {
      const newUrl = `https://tent.bloatcat.tk/image.php?file=${path[2]}`;
      if (newUrl !== window.location.href) {
        window.location.replace(newUrl);
      }
    } else if (path[1] === 'stream') {
      const [_, directory, format, file, token] = path;
      const newUrl = `https://tent.bloatcat.tk/audio.php?directory=${directory}&format=${format}&file=${file}&token=${token}`;
      if (newUrl !== window.location.href) {
        window.location.replace(newUrl);
      }
    } else {
      const newUrl = `https://tent.bloatcat.tk/release.php?artist=${subdomain}&type=${path[1]}&name=${path[2]}`;
      if (newUrl !== window.location.href) {
        window.location.replace(newUrl);
      }
    }
  }
} catch (error) {
  console.error(error.message);
}

window.addEventListener("load", function () {
  try {
    const iframes = document.querySelectorAll(`iframe[src*="${window.location.host}"]`);
    iframes.forEach(iframe => {
      const newIframe = document.createElement('iframe');
      const attributes = ['src', 'width', 'height', 'frameborder', 'allowfullscreen', 'allow', 'title'];
      attributes.forEach(attribute => {
        if (iframe.hasAttribute(attribute)) {
          newIframe.setAttribute(attribute, iframe.getAttribute(attribute));
        }
      });
      iframe.parentNode.replaceChild(newIframe, iframe);
    });
    const links = document.querySelectorAll("a");
    links.forEach(link => {
      const href = link.href;
      const newUrl = replaceUrl(href);
      if (newUrl !== href) {
        link.href = newUrl;
      }
    });
  } catch (error) {
    console.error(error.message);
  }
});