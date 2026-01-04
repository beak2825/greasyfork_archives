
// ==UserScript==
// @name        AnilistBytes
// @match       https://anilist.co/*
// @match       https://animebytes.tv/*
// @run-at      document-end
// @version     1.9.9
// @author      notmarek
// @icon        https://anilistbytes.notmarek.com/AB.svg
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @description adds torrents from animebytes to the anime view. Make sure to change the passkey and username from null or click the new button in the animebytes footer.
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.xmlHttpRequest
// @namespace https://greasyfork.org/users/1095705
// @downloadURL https://update.greasyfork.org/scripts/468377/AnilistBytes.user.js
// @updateURL https://update.greasyfork.org/scripts/468377/AnilistBytes.meta.js
// ==/UserScript==

(function () {
'use strict';

var css_248z = "#footer_inner .footer_column{width:180px}.animebytes>p{display:grid;grid-auto-columns:1fr;grid-template-columns:1fr .5fr}h2.animebytes.stats{grid-column-gap:1rem;display:grid;grid-template-columns:1fr .5fr .5fr .5fr;text-align:center}";

let passkey = null; // You still can change this manually
let username = null; // Same here
let requestCache = new Map();
// Get passkey and username from local storage

if (unsafeWindow.location.href.match(/animebytes\.tv/))
  // check which site we are on to run the correct script
  animebytes();else anilist();
document.head.append(VM.m(VM.h("style", null, css_248z)));
async function animebytes() {
  passkey = await GM.getValue('passkey', null);
  username = await GM.getValue('username', null);
  const save = async e => {
    e.preventDefault();
    let passkey = document.querySelector("link[type='application/rss+xml']").href.match(/\/feed\/rss_torrents_all\/(.*)/)[1];
    let username = document.querySelector('.username').innerText;
    await GM.setValue('passkey', passkey);
    await GM.setValue('username', username);
    alert('Passkey and username set you can now go to anilist!');
    return false;
  };
  let element = VM.h("div", null, VM.h("h3", null, "AnilistBytes"), VM.h("ul", {
    class: "nobullet"
  }, VM.h("li", null, VM.h("a", {
    href: "#",
    onclick: save,
    id: "anilistbytes"
  }, !passkey && !username ? 'Set Passkey & Username' : 'Update Passkey & Username'))));
  document.querySelector('#footer_inner').appendChild(VM.m(element));
}
async function getMALId(id, type, isAdult = false) {
  let query = {
    query: 'query media($id: Int, $type: MediaType, $isAdult: Boolean) { Media(id: $id, type: $type, isAdult: $isAdult) { idMal }}',
    variables: {
      id,
      type,
      isAdult
    }
  };
  let res = await fetch('https://anilist.co/graphql', {
    body: JSON.stringify(query),
    headers: {
      'content-type': 'application/json',
      'x-csrf-token': unsafeWindow.al_token
    },
    method: 'POST'
  });
  return (await res.json()).data.Media.idMal;
}
async function anilist() {
  passkey = await GM.getValue('passkey', null);
  username = await GM.getValue('username', null);
  if (passkey === null || username === null) {
    alert('Make sure to press the button in the footer of animebytes or edit the script to set your passkey and username!');
  }

  // stolen from https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
  function formatBytes(a, b = 2) {
    if (!+a) return '0 Bytes';
    const c = 0 > b ? 0 : b,
      d = Math.floor(Math.log(a) / Math.log(1024));
    return `${parseFloat((a / Math.pow(1024, d)).toFixed(c))} ${['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'][d]}`;
  }
  const createTorrentEntry = (link, name, size, l, s, snatch, downMultipler) => {
    let st = VM.h(VM.Fragment, null, "\xA0|\xA0", VM.h("a", {
      style: "color:gray;",
      href: "",
      onclick: e => {
        unsafeWindow._addTo(link);
        e.target.innerText = 'Added!';
        return false;
      }
    }, "ST"));
    let flicon = VM.h("img", {
      src: "https://anilistbytes.notmarek.com/flicon.png",
      alt: "| Freeleech"
    });
    let sneedexicon = VM.h("img", {
      style: "margin-left: 5px;",
      src: "https://anilistbytes.notmarek.com/sndx.png",
      alt: "| Sneedex"
    });
    let anime = name.includes('| Freeleech') ? VM.h(VM.Fragment, null, name.replace('| Freeleech', ''), flicon) : VM.h(VM.Fragment, null, name);
    anime = sneedex.includes(link.match(/torrent\/(\d+)\/download/)[1]) ? VM.h(VM.Fragment, null, anime, sneedexicon) : VM.h(VM.Fragment, null, anime);
    return VM.h(VM.Fragment, null, VM.h("h2", null, VM.h("span", null, "[", VM.h("a", {
      href: link,
      style: "color:gray;"
    }, "\xA0DL"), unsafeWindow._addTo ? st : null, "\xA0]\xA0"), VM.h("span", null, anime)), VM.h("h2", {
      class: "animebytes stats"
    }, VM.h("span", null, formatBytes(size)), VM.h("span", null, String(snatch)), VM.h("span", null, String(s)), VM.h("span", null, String(l))));
  };

  // function to decode html entities in strings (e.g. &amp; -> &)
  const getDecodedString = str => {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  };

  // function using GM.xmlHttpRequest to make the xmlhttprequest closer to fetch
  const GM_get = async url => {
    return new Promise((resolve, reject) => {
      if (requestCache.has(url)) {
        console.log(`[AnilistBytes] Request to ${url} served from cache.`);
        resolve({
          json: async () => requestCache.get(url)
        });
        return;
      }
      GM.xmlHttpRequest({
        method: 'GET',
        url,
        headers: {
          Accept: 'application/json'
        },
        onload: res => {
          const result = JSON.parse(res.responseText);
          requestCache.set(url, result);
          resolve({
            json: async () => result
          });
        },
        onerror: err => {
          reject(err);
        },
        onabort: err => {
          reject(err);
        }
      });
    });
  };
  const cacheSneedex = async () => {
    let res = await GM_get('https://sneedex.moe/api/public/ab');
    let data = await res.json();
    data = data.map(e => e.permLinks.map(e => e.match(/torrentid=(\d+)/)[1])).flat();
    await GM.setValue('sneedexv2', data);
    return data;
  };
  let sneedex = await GM.getValue('sneedexv2', await cacheSneedex());
  const formats = {
    MANGA: 'Manga',
    NOVEL: 'Light Novel'
  };
  const createTorrentList = async (perfectMatch = true, title_type = 0, mal_id = null) => {
    // Cleanup exising elements
    try {
      document.querySelectorAll('.animebytes').forEach(e => e.remove());
    } catch (_unused) {
    }
    let type = unsafeWindow.location.pathname.match(/\/(anime|manga)\/[0-9]/);
    if (type === null) {
      return;
    }
    type = type[1];
    let vueMyBeloved;
    try {
      vueMyBeloved = document.getElementById('app').__vue__.$children.find(e => e.media);
    } catch (_unused2) {
      setTimeout(createTorrentList, 500);
      return;
    }
    const containerEl = document.querySelector('.content div.overview');
    if (containerEl) {
      var _vueMyBeloved$media$e, _vueMyBeloved$media$s, _vueMyBeloved$media$s2;
      const types = ['romaji', 'userPreferred', 'english', 'native'];
      let seriesName;
      try {
        seriesName = vueMyBeloved.media.title[types[title_type]].replaceAll(/[\]\[]/g, '');
      } catch (_unused3) {
        setTimeout(createTorrentList, 500);
        return;
      }
      const hentai = vueMyBeloved.media.isAdult;
      const epcount = (_vueMyBeloved$media$e = vueMyBeloved.media.episodes) != null ? _vueMyBeloved$media$e : 'manga';
      const seriesYear = (_vueMyBeloved$media$s = vueMyBeloved.media.seasonYear) != null ? _vueMyBeloved$media$s : (_vueMyBeloved$media$s2 = vueMyBeloved.media.startDate) == null ? void 0 : _vueMyBeloved$media$s2.year;
      let clonableEl = containerEl.querySelector('div .description-wrap');
      if (clonableEl === null) setTimeout(createTorrentList, 500);
      let endpoint = `https://animebytes.tv/scrape.php?torrent_pass=${passkey}&username=${username}&hentai=${Number(hentai)}&epcount=${epcount}&year=${seriesYear}&type=anime&searchstr=${encodeURIComponent(seriesName)}${type == 'manga' ? '&printedtype[' + formats[vueMyBeloved.media.format] + ']=1' : ''}`;
      if (!perfectMatch) endpoint = `https://animebytes.tv/scrape.php?torrent_pass=${passkey}&username=${username}&hentai=2&type=anime&searchstr=${encodeURIComponent(seriesName)}`;
      console.log(`[AnilistBytes] Using api endpoint: ${endpoint}`);
      let res = await GM_get(endpoint);
      if (!mal_id) {
        mal_id = await getMALId(vueMyBeloved.media.id, vueMyBeloved.media.type, vueMyBeloved.media.isAdult);
      }
      let ab_groups = (await res.json()).Groups;
      if (!ab_groups) {
        if (perfectMatch && title_type < 3) {
          console.log(`[AnilistBytes] Perfect match for ${types[title_type]} title failed, trying ${types[title_type + 1]} title`);
          return await createTorrentList(true, title_type + 1, mal_id);
        } else if (!perfectMatch && title_type < 3) {
          console.log(`[AnilistBytes] Imperfect match for ${types[title_type]} title failed, trying ${types[title_type + 1]} title`);
          return await createTorrentList(false, title_type + 1, mal_id);
        } else if (perfectMatch) {
          console.log(`[AnilistBytes] Perfect match for all titles failed, trying imperfect match.`);
          return await createTorrentList(false, 0);
        } else {
          console.log('[AnilistBytes] No match found giving up.');
          vueMyBeloved.$children.find(e => e.$options._componentTag == 'external-links')._props.links.push({
            color: '#ed106a',
            site: 'AnimeBytes [Search]',
            url: `https://animebytes.tv/torrents.php?searchstr=${encodeURIComponent(vueMyBeloved.media.title[types[1]].replaceAll(/[\]\[]/g, ''))}`,
            icon: 'https://anilistbytes.notmarek.com/AB.svg'
          });
          return;
        }
      }
      let data = null;
      for (let match of ab_groups) {
        if (!match.Links.MAL) {
          continue;
        }
        let mid = match.Links.MAL.match(/(\d+)/)[1];
        if (mid == mal_id) {
          data = match;
          break;
        }
      }
      console.log(data);
      if (!data && !perfectMatch) {
        data = ab_groups[0];
      } else if (!data) {
        return await createTorrentList(false, 0, mal_id);
      } else {
        perfectMatch = true;
      }
      vueMyBeloved.$children.find(e => e.$options._componentTag == 'external-links')._props.links.push({
        color: '#ed106a',
        site: 'AnimeBytes',
        url: `https://animebytes.tv/torrents.php?id=${data.ID}`,
        icon: 'https://anilistbytes.notmarek.com/AB.svg'
      });
      let entries = await Promise.all(data.Torrents.map(async torrent => {
        return await createTorrentEntry(torrent.Link, torrent.Property, torrent.Size, torrent.Leechers, torrent.Seeders, torrent.Snatched, torrent.RawDownMultiplier);
      }));
      let element = VM.h("div", {
        class: "animebytes"
      }, VM.h("h2", null, "AnilistBytes"), VM.h("p", {
        class: "description content-wrap"
      }, VM.h("h2", null, getDecodedString(data.FullName), "\xA0[", VM.h("a", {
        href: `https://animebytes.tv/torrents.php?id=${data.ID}`,
        style: "color: gray;",
        target: "_blank"
      }, "AB"), "]\xA0", perfectMatch ? null : VM.h("span", {
        style: "cursor: help; color: #ffaa00;",
        title: "Imperfect match means that the found anime may not be what you are looking for or that year/episode count/age rating simply don't match between anilist and AB."
      }, "(imperfect match)")), VM.h("h2", {
        class: "animebytes stats"
      }, VM.h("span", null, "Size"), VM.h("span", null, VM.h("img", {
        src: "https://anilistbytes.notmarek.com/snatched.svg",
        alt: "Snatches"
      })), VM.h("span", null, VM.h("img", {
        src: "https://anilistbytes.notmarek.com/seeders.svg",
        alt: "Seeders"
      })), VM.h("span", null, VM.h("img", {
        src: "https://anilistbytes.notmarek.com/leechers.svg",
        alt: "Leechers"
      }))), entries));
      containerEl.insertBefore(VM.m(element), clonableEl);
    } else {
      // check every 500ms if the page has loaded, so we can load our data
      setTimeout(() => createTorrentList(), 500);
    }
  };

  // hijack the window.history.pushState function to do shit for us on navigation
  (function (history) {
    var pushState = history.pushState;
    history.pushState = function (_state) {
      const res = pushState.apply(history, arguments);
      unsafeWindow.dispatchEvent(new Event('popstate'));
      return res;
    };
  })(unsafeWindow.history);
  unsafeWindow.addEventListener('popstate', () => {
    console.log(`[AnilistBytes] Soft navigated to ${unsafeWindow.location.pathname}`);
    setTimeout(createTorrentList, 500);
  });
  createTorrentList();
}

})();