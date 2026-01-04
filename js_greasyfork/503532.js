// ==UserScript==
// @name        watch sdarot.tv without ads
// @namespace   Violentmonkey Scripts
// @license     MIT
// @match       *://sdarot.*/*
// @match       *://sdarot.tv/*
// @match       *://sdarot.cc/*
// @grant       none
// @version     1.1
// @author      -
// @description just click on the episode UWU
// @downloadURL https://update.greasyfork.org/scripts/503532/watch%20sdarottv%20without%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/503532/watch%20sdarottv%20without%20ads.meta.js
// ==/UserScript==

const asyncRetry = async (func, { retries = 0 }) => {
  let count = -1;
  const wrap = async (remaining) => {
    try {
      return func(++count);
    } catch (err) {
      if (!remaining) throw err;
      return wrap(remaining - 1);
    }
  };

  return wrap(retries);
};

class StealCache {
    static cacheKey = 'stealcache';

    static get(entry) {
      const steal = JSON.parse(localStorage.getItem(StealCache.cacheKey) ?? '{}');
      return steal[entry];
    }

    static put(entry, data) {
      const steal = JSON.parse(localStorage.getItem(StealCache.cacheKey) ?? '{}');
      steal[entry] = data;
      localStorage.setItem(StealCache.cacheKey, JSON.stringify(steal));
    }

    static clear() {
      localStorage.setItem(StealCache.cacheKey, '');
    }
};

const cachedAccess = ({ entry, postId, stream }) => {
  let cached;

  if (stream) {
    StealCache.put(postId, { entry, stream });
  }
  else if (!(cached ??= StealCache.get(postId))) {
    return;
  }

  return cached ?? { entry, stream };
}

const getPostName = (postId) => {
  const body = new FormData();
  body.append('action', 'wpse_296903_call_meta');
  body.append('post_id', postId);
  body.append('meta_key', 'download');

  return fetch('/wp-admin/admin-ajax.php', { method: 'POST', body })
    .then((data) => data.text())
    .then((data) => data.match(/^http[s]?:\/\/[^\/]+\/([^\/]+)/))
    .then(([ , name ]) => name);
}


const stealSingle = async ({ entry, postId }, format = false) => {
    const pirateFqdn = [ 'https://theinfo.pk', 'https://w1tech.xyz', 'https://theiq.pk' ];
    const emitScheme = (url) => url.startsWith('//') ? 'https:' + url : url;

    const getVideo = (fqdn, postName) =>
        fetch(`https://cors2.nyaku.xyz/?${fqdn}/bisp-dynamic-survey-registration-2023-online/`, { method: 'POST', body: new URLSearchParams('abc=' + postName) })
            .then((data) => data.text())
            .then((data) => data.match(/(?<=<div id="output").*?src="([^"]*)".*?(?=<\/div>)/s))
            .then(([ , stream ]) => stream); // ok.ru, yt-dlp supported

    const formatEpisode = ({ series, season, episode }) =>
      `${series}${season ? `-s${season.toString().padStart(2, '0')}` : ''}-ep-${episode.toString().padStart(2, '0')}`;

    if (!entry)
      entry = await getPostName(postId);
    else if (format)
      entry = formatEpisode(entry);

    return asyncRetry(
      (currentTry) => getVideo(pirateFqdn[currentTry], entry).then((stream) => cachedAccess({ entry, postId, stream: emitScheme(stream) })),
      { retries: pirateFqdn.length }
    );
}


let openVideo = window.open;
window.open = () => { };

window.showEpisode = async (postId, episodeName) => {
  const cached = cachedAccess({ postId });
  if (cached?.stream) {
    openVideo(cached.stream);
    return;
  }

  const { entry, stream } = await stealSingle({ postId });
  openVideo(stream);
}