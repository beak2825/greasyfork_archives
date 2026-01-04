// ==UserScript==
// @name        Privacy Frontend Redirect
// @match       *://*/*
// @exclude     *://account*/*
// @exclude     *://message*/*
// @exclude     *://adsense.google.com/*
// @exclude     *://www.google.com/adsense/*
// @exclude     *://www.google.com/maps/*
// @grant       none
// @version     4.2.10
// @author      NoUser
// @description This script redirects to privacy friendly front-ends of popular services, such as YouTube, Twitter, Reddit, Imgur, Instagram, TikTok, etc. Additionally, it replaces iframes and outgoing links to non frontend services with their privacy-friendly counterparts. The purpose of this script is to protect the user's privacy by avoiding the collection of personal data by these services.
// @run-at      document-start
// @namespace   https://greasyfork.org/en/scripts/458875-privacy-frontend-redirect
// @homepage    https://greasyfork.org/en/scripts/458875-privacy-frontend-redirect
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/458875/Privacy%20Frontend%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/458875/Privacy%20Frontend%20Redirect.meta.js
// ==/UserScript==

const hostname = window.location.hostname;
const hosts = {
  "www.youtube.com": ["invidious.privacydev.net", "vid.puffyan.us", "inv.vern.cc", "invidious.kavin.rocks", "invidious.tiekoetter.com", "inv.riverside.rocks", "iv.ggtyler.dev", "invidious.nerdvpn.de"],
  "www.youtube-nocookie.com": ["invidious.privacydev.net", "vid.puffyan.us", "inv.vern.cc", "invidious.kavin.rocks", "invidious.tiekoetter.com", "inv.riverside.rocks", "iv.ggtyler.dev", "invidious.nerdvpn.de"],
  "m.youtube.com": ["invidious.privacydev.net", "vid.puffyan.us", "inv.vern.cc", "invidious.kavin.rocks", "invidious.tiekoetter.com", "inv.riverside.rocks", "iv.ggtyler.dev", "invidious.nerdvpn.de"],
  "music.youtube.com": ["hyperpipe.surge.sh", "hyperpipe.esmailelbob.xyz", "music.adminforge.de"],
  "twitter.com": ["nitter.sneed.network", "canada.unofficialbird.com", "nitter.privacytools.io", "nitter.foss.wtf", "nitter.privacy.com.de", "nitter.1d4.us", "nitter.poast.org", "twitter.censors.us"],
  "mobile.twitter.com": ["nitter.sneed.network", "canada.unofficialbird.com", "nitter.privacytools.io", "nitter.foss.wtf", "nitter.privacy.com.de", "nitter.1d4.us", "nitter.poast.org", "twitter.censors.us"],
  "www.reddit.com": ["libreddit.eu.org", "libreddit.spike.codes", "lr.odyssey346.dev", "rd.funami.tech", "libreddit.dcs0.hu", "lr.vern.cc"],
  "old.reddit.com": ["libreddit.eu.org", "libreddit.spike.codes", "lr.odyssey346.dev", "rd.funami.tech", "libreddit.dcs0.hu", "lr.vern.cc"],
  "imgur.com": ["rimgo.pussthecat.org", "rimgo.totaldarkness.net", "rimgo.vern.cc", "imgur.artemislena.eu", "rimgo.privacydev.net", "rimgo.bus-hit.me"],
  "i.imgur.com": ["rimgo.pussthecat.org", "rimgo.totaldarkness.net", "rimgo.vern.cc", "imgur.artemislena.eu", "rimgo.privacydev.net", "rimgo.bus-hit.me"],
  "i.stack.imgur.com": ["rimgo.pussthecat.org", "rimgo.totaldarkness.net", "rimgo.vern.cc", "imgur.artemislena.eu", "rimgo.privacydev.net", "rimgo.bus-hit.me"],
  "www.instagram.com": ["bibliogram.froth.zone", "ig.tokhmi.xyz"],
  "www.tiktok.com": ["proxitok.pussthecat.org", "tok.habedieeh.re", "tok.artemislena.eu", "proxitok.privacydev.net"],
  "www.imdb.com": ["ld.vern.cc", "libremdb.esmailelbob.xyz", "lmdb.tokhmi.xyz", "libremdb.iket.me", "libremdb.pussthecat.org"],
  "translate.google.com": ["simplytranslate.esmailelbob.xyz", "simplytranslate.manerakai.com", "translate.bus-hit.me", "translate.northboot.xyz", "translate.tiekoetter.com", "tl.vern.cc", "translate.slipfox.xyz"],
  "medium.com": ["scribe.rip", "scribe.nixnet.services", "scribe.citizen4.eu", "scribe.bus-hit.me", "scribe.froth.zone", "scribe.rawbit.ninja"],
  "www.urbandictionary.com": ["rd.vern.cc", "ruraldictionary.esmailelbob.xyz"],
  "stackoverflow.com": ["code.whatever.social", "ao.vern.cc", "overflow.smnz.de", "anonymousoverflow.esmailelbob.xyz", "overflow.adminforge.de", "ao.foss.wtf", "overflow.hostux.net"],
  "www.goodreads.com": ["biblioreads.ml", "bl.vern.cc", "biblioreads.esmailelbob.xyz"],
  "www.snopes.com": ["sd.vern.cc", "suds.esmailelbob.xyz"],
  "www.xvideos.com": ["porninvidious.esmailelbob.xyz"],
//  "www.google.com": ["whoogle.hostux.net", "wg.vern.cc", "whoogle.privacydev.net", "whoogle.dcs0.hu", "search.sethforprivacy.com"],
  "en.wikipedia.org": ["wiki.froth.zone", "wikiless.esmailelbob.xyz", "wikiless.northboot.xyz", "wl.vern.cc"],
  "de.wikipedia.org": ["wiki.adminforge.de"],
  "www.instructables.com": ["destructables.esmailelbob.xyz"],
  "www.reuters.com": ["neuters.de", "neuters.esmailelbob.xyz"],
  "scratch.mit.edu": ["scratchgui.esmailelbob.xyz", "scratch.machinelearningforkids.co.uk"],
  "odysee.com": ["lbry.projectsegfau.lt", "librarian.esmailelbob.xyz"],
  "yiffer.xyz": ["yiffest.programmerpony.com"],
  "www.wolframalpha.com": ["wolfree.chickenkiller.com", "wolfree.crabdance.com", "wolfree.gitlab.io", "wolfree.ignorelist.com", "wolfree.jumpingcrab.com", "wolfree.my.to", "wolfree.netlify.app", "wolfree.onrender.com", "wolfree.pages.dev", "wolfree.privatedns.org", "wolfree.strangled.net"],
  "quizlet.com": ["requiz.net"],
//  "amazon.com": ["simpleamazon.esmailelbob.xyz", "amazon.simple-web.org"],
//  "github.com": ["gh.odyssey346.dev", "gh.riverside.rocks", "gh.vern.cc", "gh.akisblack.dev", "gh.phreedom.club"],
//  "akkoma.social": ["bdx.town"],
//  "tankerkoenig.de": ["petrolpricesv2.netlify.app"],
//
//  Valid alternatives where end user loses nothing, not frontends
//
//  "www.speedtest.net": ["openspeedtest.com"]
//  "music.apple.com": ["cider.sh"],
//  "www.noisli.com": ["noizee.esmailelbob.xyz"],
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