// ==UserScript==
// @name        Anisongs
// @description Adds Anisongs to anime entries on AniList
// @namespace   Morimasa
// @license     GPL-3.0-or-later
// @require     https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js
// @include     https://anilist.co/*
// @connect     graphql.anilist.co
// @connect     api.animethemes.moe
// @version     2.0.2
// @author      Morimasa
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/374785/Anisongs.user.js
// @updateURL https://update.greasyfork.org/scripts/374785/Anisongs.meta.js
// ==/UserScript==

/*
*/


(function (localforage) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var localforage__default = /*#__PURE__*/_interopDefaultLegacy(localforage);

  function request(url, options = {}) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url,
        method: options.method || "GET",
        headers: options.headers || {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        responseType: options.responseType || "json",
        data: options.body || options.data,
        onload: res => resolve(res.response),
        onerror: reject
      });
    });
  }

  localforage__default["default"].config({
    name: 'Anisongs-v2'
  });
  var cache = Cache = {
    async set(key, value, expire_in = 86400000) {
      await localforage__default["default"].setItem(key, value);
      const expire_timestamp = +new Date() + expire_in;
      await localforage__default["default"].setItem(`${key}_expire`, expire_timestamp);
      return value;
    },

    async get(key) {
      const expire_timestamp = await localforage__default["default"].getItem(`${key}_expire`);
      const timestamp_now = +new Date();

      if (expire_timestamp > timestamp_now) {
        console.debug("Cache hit!");
        return localforage__default["default"].getItem(key);
      }

      console.debug("Cache expired!");
      await localforage__default["default"].removeItem(`${key}_expire`);
      await localforage__default["default"].removeItem(key);
      return null;
    }

  };

  var AnimeThemeType;
  (function (AnimeThemeType) {
      AnimeThemeType["OP"] = "OP";
      AnimeThemeType["ED"] = "ED";
  })(AnimeThemeType || (AnimeThemeType = {}));
  var VideoSource;
  (function (VideoSource) {
      VideoSource["WEB"] = "WEB";
      VideoSource["RAW"] = "RAW";
      VideoSource["BD"] = "BD";
      VideoSource["DVD"] = "DVD";
      VideoSource["VHS"] = "VHS";
      VideoSource["LD"] = "LD";
  })(VideoSource || (VideoSource = {}));
  async function getAnimeThemes(Anilist_id) {
      let cached = await cache.get(`animethemes${Anilist_id}`);
      if (cached != null) {
          return cached;
      }
      const include = ["animethemes.animethemeentries.videos", "animethemes.song", "animethemes.song.artists"].join(",");
      const url = `https://api.animethemes.moe/anime?filter[has]=resources&filter[site]=AniList&filter[external_id]=${Anilist_id}&include=${include}`;
      const res = (await request(url)).anime;
      await cache.set(`animethemes${Anilist_id}`, res[0]);
      return res[0];
  }
  function stringifyTheme(sequence, title, artists, episodes, group) {
      let artists_str = artists.map(e => `${e.name}`).join(", ");
      if (artists_str.length > 0) {
          artists_str = ` by ${artists_str}`;
      }
      let eps = episodes ? ` (${episodes.includes("-") ? "eps" : "ep"} ${episodes})` : "";
      let dub = group && group.includes("Dubbed") ? ` (${group})` : "";
      return `${sequence || 1}. "${title}"${artists_str}${eps}${dub}`;
  }
  function groupThemes(anime_themes) {
      const OP = anime_themes.filter(e => e.type == AnimeThemeType.OP).sort((a, b) => a.sequence - b.sequence);
      const ED = anime_themes.filter(e => e.type == AnimeThemeType.ED).sort((a, b) => a.sequence - b.sequence);
      console.log(OP);
      const parse = (theme) => {
          const song_title = theme.song.title;
          const artists = theme.song.artists;
          const sequence = theme.sequence;
          const episodes = theme.animethemeentries.map(e => e.episodes).join(", ");
          const url = theme.animethemeentries[0].videos[0].link;
          const group = theme.group;
          return { url, name: stringifyTheme(sequence, song_title, artists, episodes, group) };
      };
      return { OP: OP.map(parse), ED: ED.map(parse) };
  }

  const GLOBAL_APP = new Promise(resolve => {
      let search_interval = setInterval(() => {
          const app = document.getElementById("app");
          if (app) {
              clearInterval(search_interval);
              resolve(app.__vue__);
          }
      }, 100);
  });
  var AnilistStatus;
  (function (AnilistStatus) {
      AnilistStatus["Releasing"] = "Releasing";
      AnilistStatus["Finished"] = "Finished";
      AnilistStatus["Cancelled"] = "Cancelled";
  })(AnilistStatus || (AnilistStatus = {}));
  async function addRouterAfterHook(func) {
      (await GLOBAL_APP)._router.afterHooks.push(func);
  }
  async function getCurrentView() {
      return (await GLOBAL_APP)._router.history.current;
  }

  const css_class = "anisongs";
  GM_addStyle(`
  .${css_class} {
    width: 50vw;
  }
  .${css_class} .anisong-entry {
    background: rgb(var(--color-foreground));
    border-radius: 3px;
    padding: 8px 10px;
    font-size: 1.3rem;
    margin-bottom: 10px;
  }
  .${css_class} .has-video {
    cursor: pointer;
    color: rgb(var(--color-text));
  }
  .${css_class} .has-video:hover {
	  transition: .15s;
    color: rgb(var(--color-blue));
  }
  .${css_class} .anisong-entry video {
    cursor: auto;
    margin-top: 10px;
    width: 39em;
  }
`);

  class VideoElement {
    constructor(parent, url) {
      this.url = url;
      this.parent = parent;
      this.make();
    }

    toggle() {
      if (this.el.parentNode) {
        this.el.remove();
      } else {
        this.parent.append(this.el);
        this.el.children[0].autoplay = true; // autoplay
      }
    }

    make() {
      const box = document.createElement('div'),
            vid = document.createElement('video');
      vid.src = this.url;
      vid.controls = true;
      vid.preload = "none";
      vid.volume = 0.4;
      box.append(vid);
      this.el = box;
    }

  }

  function createRootElement() {
    const parent = document.querySelector('.overview');
    let root_element = document.createElement("div");
    root_element.style.display = "flex";
    root_element.style.columnGap = "30px";
    parent.append(root_element);
    return root_element;
  }

  function createGroupElement(text, target, pos) {
    let el = document.createElement('div');
    el.appendChild(document.createElement('h2'));
    el.children[0].innerText = text;
    el.classList = css_class;
    target.insertBefore(el, target.children[pos]);
    return el;
  }

  function insertSongs(songs, parent) {
    if (!songs || !songs.length) {
      const node = document.createElement('div');
      node.innerText = 'No songs to show (つ﹏<)･ﾟ｡';
      node.style.textAlign = "center";
      parent.appendChild(node);
      return;
    }

    songs.forEach(song => {
      const node = document.createElement('div');
      node.innerText = song.name;

      if (song.url) {
        const vid = new VideoElement(node, song.url);
        node.addEventListener("click", () => vid.toggle());
        node.classList.add("has-video");
      }

      node.classList.add("anisong-entry");
      parent.appendChild(node);
    });
  }

  async function addSongElements(themes, root_element) {
    let current_view = await getCurrentView();

    if (current_view.name != "MediaOverview" || current_view.params.type != "anime") {
      return;
    }

    const op = createGroupElement("Openings", root_element, 0);
    const ed = createGroupElement("Endings", root_element, 1);
    insertSongs(themes.OP, op);
    insertSongs(themes.ED, ed);
  }

  function cleanup(current_anime_id) {
    let el = document.getElementsByClassName("anisongs");

    if (el) {
      [...el].forEach(e => {
        if (e.dataset.anime != current_anime_id) {
          e.parentNode.remove();
          console.debug("cleanup started!");
        }
      });
    }
  }

  async function handleRoute(current, previous) {
    const anime_id = current.params.id;
    cleanup(anime_id);

    if (current.name != "MediaOverview" || current.params.type != "anime") {
      return;
    }

    let anime_themes = [];

    try {
      anime_themes = (await getAnimeThemes(anime_id)).animethemes;
    } catch {
      console.debug("Can't find any songs for this media");
      return;
    }

    anime_themes = groupThemes(anime_themes);
    let inject_interval = setInterval(async () => {
      console.debug("try to inject");
      const injected = createRootElement();

      if (injected) {
        clearInterval(inject_interval);
        injected.dataset.anime = anime_id;
        await addSongElements(anime_themes, injected);
      }
    }, 500);
  }

  (async () => {
    // start function for the first route check
    const current_view = await getCurrentView();
    handleRoute(current_view, null); // mount function into vue router

    addRouterAfterHook(handleRoute);
  })();

})(localforage);
