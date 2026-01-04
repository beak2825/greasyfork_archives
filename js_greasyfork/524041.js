// ==UserScript==
// @name           Culture.ru – Unlocked [Ath]
// @name:ru        Culture.ru – Отпёртый [Ath]
// @name:uk        Culture.ru – Розблоковано [Ath]
// @name:be        Culture.ru – Адмыкнуты [Ath]
// @name:bg        Culture.ru – Отключен [Ath]
// @name:tt        Culture.ru – Açıq [Ath]
// @name:sl        Culture.ru – Odklenjeno [Ath]
// @name:sr        Culture.ru – Otključano [Ath]
// @name:ka        Culture.ru – განბლოკილი [Ath]
// @description    Fixes the bug causing the "Видеозапись недоступна для просмотра по решению правообладателя" error message.
// @description:ru Исправляет баг, приводящий к появлению сообщения "Видеозапись недоступна для просмотра по решению правообладателя".
// @description:uk Виправляє баг, що призводить до появи повідомлення "Видеозапись недоступна для просмотра по решению правообладателя".
// @description:be Іспраўляе баг, які прыводзіць да паўстання паведамлення "Видеозапись недоступна для просмотра по решению правообладателя".
// @description:bg Отстранява грешката, която води до появата на съобщение "Видеозапись недоступна для просмотра по решению правообладателя".
// @description:tt Хатаны төзәтә, ул "Видеозапись недоступна для просмотра по решению правообладателя" дигән хәбәр барлыкка килүгә китерә.
// @description:sl Odpravlja napako, ki povzroča pojav sporočila "Видеозапись недоступна для просмотра по решению правообладателя".
// @description:sr Ispravlja bag koji dovodi do pojavljivanja poruke "Видеозапись недоступна для просмотра по решению правообладателя".
// @description:ka ფიქსირებს ბაგს, რომელიც იწვევს "Видеозапись недоступна для просмотра по решению правообладателя" შეტყობინების გამოჩენას.
// @namespace      athari
// @author         Athari (https://github.com/Athari)
// @copyright      © Prokhorov ‘Athari’ Alexander, 2024–2025
// @license        MIT
// @homepageURL    https://github.com/Athari/AthariUserJS
// @supportURL     https://github.com/Athari/AthariUserJS/issues
// @version        1.0.4
// @icon           https://www.google.com/s2/favicons?sz=64&domain=culture.ru
// @match          https://*.culture.ru/*
// @grant          unsafeWindow
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_getResourceText
// @grant          GM_getResourceURL
// @grant          GM_info
// @run-at         document-start
// @require        https://cdn.jsdelivr.net/npm/string@3.3.3/dist/string.min.js
// @require        https://cdn.jsdelivr.net/npm/@athari/monkeyutils@0.2.2/monkeyutils.u.min.js
// @require        https://cdn.jsdelivr.net/npm/hls.js@1.5.18/dist/hls.light.min.js
// @require        https://cdn.jsdelivr.net/npm/plyr@3.7.8/dist/plyr.min.js
// @resource       script-urlpattern https://cdn.jsdelivr.net/npm/urlpattern-polyfill/dist/urlpattern.js
// @resource       css-plyr          https://cdn.jsdelivr.net/npm/plyr@3.7.8/dist/plyr.css
// @tag            athari
// @downloadURL https://update.greasyfork.org/scripts/524041/Cultureru%20%E2%80%93%20%D0%9E%D1%82%D0%BF%D1%91%D1%80%D1%82%D1%8B%D0%B9%20%5BAth%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/524041/Cultureru%20%E2%80%93%20%D0%9E%D1%82%D0%BF%D1%91%D1%80%D1%82%D1%8B%D0%B9%20%5BAth%5D.meta.js
// ==/UserScript==

(async () => {
  'use strict'

  // Test URL: https://www.culture.ru/live/movies/3183/zimnyaya-skazka

  const { waitForEvent, h, attempt, ress, scripts, els, opts } =
    athari.monkeyutils;

  const res = ress(), script = scripts(res);
  const el = els(document, {
    mainHeader: "main > div:has(h1)",
    footer: "footer",
    titleDivs: "div:has(> h1) div",
    lstVideos: "#ath-videos", videos: "#ath-videos video",
    lstImages: "#ath-images", images: "#ath-images img",
    lblPlyrAuto: ".plyr__menu__container [data-plyr='quality'][value='0'] span",
  });
  const opt = opts({
    hideOriginal: true, thumbHeight: 240,
  });
  const strs = {
    en: {
      opt: {
        hideOriginal: "Hide original media",
        thumbHeight: "Thumbnail height",
      },
    },
    ru: {
      opt: {
        hideOriginal: "Скрыть исходные материалы",
        thumbHeight: "Высота превьюшек",
      },
    },
    g: {
      videoErrorMessage: "Видеозапись недоступна для просмотра по решению правообладателя",
    }
  };
  const language = navigator.languages.filter(l => strs[l] != null)[0] ?? strs[navigator.language] ?? 'ru';
  const str = strs[language];

  S.extendPrototype();
  Object.assign(globalThis, globalThis.URLPattern ? null : await script.urlpattern);

  await waitForEvent(document, 'DOMContentLoaded');
  const data = unsafeWindow.__NEXT_DATA__;

  el.tag.head.insertAdjacentHTML('beforeEnd', /*html*/`
    <style>
      :root {
        color-scheme: dark;
        --ath-hide-original: ${+opt.hideOriginal};
        --ath-thumb-height: ${opt.thumbHeight}px;
      }
      body {
        container: if;
      }
      * {
        opacity: 1;
      }

      @container if style(--ath-hide-original: 1) {
        main > div:not(:has(h2)) .swiper-container-horizontal {
          display: none;
        }
      }

      #ath-main {
        display: flex;
        flex-flow: column;
        gap: 8px;
        padding: 8px;
        #ath-videos {
          display: flex;
          flex-flow: column;
          align-items: center;
          gap: 8px;
          video {
            min-width: 800px;
            min-height: 600px;
          }
        }
        #ath-images {
          display: flex;
          flex-flow: row wrap;
          justify-content: center;
          gap: 8px;
          .ath-image img {
            height: var(--ath-thumb-height);
            max-width: calc(var(--ath-thumb-height) * 2.5);
          }
        }
      }

      #ath-options {
        margin: 8px auto;
        display: flex;
        flex-flow: row wrap;
        gap: 8px 32px;
      }

      ${res.css.plyr.text}

      @media screen and (max-width: 480px) {
        .plyr .plyr__controls button:is([data-plyr=pip], [data-plyr=mute], [data-plyr=volume]) {
          display: none;
        }
      }
    </style>`);

  attempt("add options", () => {
    const inputs = [];
    const meta = (prop) => GM_info.script[`${prop}_i18n`]?.[language] ?? GM_info.script[prop];
    const formatAttrs = attrs => Object.entries(attrs).map(([k, v]) => `${k}="${h(v)}"`).join(" ");
    const tplInput = (id, attrs = { type: 'checkbox' }) => (
      inputs.push({ id, ...attrs }),
        /*html*/`<label>${
          attrs.type == 'checkbox'
            ? /*html*/`<input id="ath-${id}" ${opt[id] ? 'checked' : ""} ${formatAttrs(attrs)}> ${str.opt[id]}`
            : /*html*/`${str.opt[id]} <input id="ath-${id}" value="${h(opt[id])}" ${formatAttrs(attrs)}>`
        }</label>`);
    el.footer.insertAdjacentHTML('beforeBegin', /*html*/`
      <div id="ath-options">
        <label title="${h(meta('description'))}">${h(meta('name'))} ${GM_info.script.version}</label>
        ${tplInput('hideOriginal')}
        ${tplInput('thumbHeight', { type: 'range', min: 40, max: 400, step: 10, 'data-unit': " pixels" })}
      </div>`);
    for (let { id, type } of inputs) {
      const elInput = el.id[`ath-${id}`];
      elInput.onchange = () =>
        opt[id] = type == 'checkbox' ? elInput.checked : elInput.value;
      if (type == 'range') {
        elInput.insertAdjacentHTML('afterEnd', /*html*/`<output for="ath-${id}">`);
        const updateValue = () => elInput.nextElementSibling.value = ` ${elInput.value}${elInput.dataset.unit}`;
        elInput.oninput = updateValue;
        updateValue();
      }
    }
  });

  attempt("publish raw materials", () => {
    const getImageUrl = (id, name = null, transform = null) =>
        `https://${data.runtimeConfig.services.storage.main.host}/images/${id}/${transform ?? "_"}/${name ?? "thumb.jpg"}`;
    const getImageThumbUrl = (id, name = null) =>
        getImageUrl(id, name, `h_${opt.thumbHeight},c_fill,g_center`);
    const getPlaylistUrl = id =>
        `https://video-playlist.culture.ru:443${id}`;
    el.mainHeader.insertAdjacentHTML('afterEnd', /*html*/`
      <div id="ath-main">
        <div id="ath-videos"></div>
        <div id="ath-images"></div>
      </div>`);
    const { movie } = data.props.pageProps;
    for (let mat of movie.materials) {
      console.debug("material", mat.type, mat);
      const file = mat.files[0];
      switch (mat.type) {
        case 'video':
          el.lstVideos.insertAdjacentHTML('beforeEnd', /*html*/`
            <div class="ath-video">
              <video width="800" height="600" controls crossorigin playsinline disablepictureinpicture
                  data-src="${getPlaylistUrl(file.publicId)}"
                  poster="${getImageUrl(movie.thumbnailFile.publicId, null, "h_600,w_800,c_fill")}">
              </video>
            </div>`);
          break;
        case 'photo':
          el.lstImages.insertAdjacentHTML('beforeEnd', /*html*/`
            <a class="ath-image" href="${getImageUrl(file.publicId, file.originalName)}">
              <img src="${getImageThumbUrl(file.publicId, file.originalName)}">
            </a>`);
          break;
      }
    }
    for (let video of el.all.videos) {
      if (Hls.isSupported()) {
        const options = {
          controls: [
            'play-large', 'play', 'rewind', 'fast-forward',
            'current-time', 'progress', 'duration',
            'mute', 'volume', 'captions', 'settings', 'airplay', /*'download',*/ 'fullscreen',
          ],
          i18n: {
            qualityLabel: {
              0: "Auto",
            },
          },
          settings: [ /*'captions',*/ 'quality', 'speed', 'loop' ],
          speed: { selected: 1.0, options: [ 0.10, 0.75, 1.0, 1.2, 1.35, 1.5, 1.75, 2.0, 2.5, 3.0, 4.0 ] },
          quality: { default: 1080, options: [ 1080 ] },
          urls: { download: video.dataset.src },
          disableContextMenu: false,
          playsinline: true,
        };
        let player = null;
        const hls = new Hls();
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          attempt("init video player", () => {
            const qualities = [0].concat(hls.levels.map(l => l.height).reverse());
            player = new Plyr(video, {
              ...options,
              quality: {
                default: 0, options: qualities, forced: true,
                onChange: (v) => hls.currentLevel = v == 0 ? -1 : qualities.findIndex(l => l.height == v),
              },
              listeners: {
                play: () => hls.startLoad(),
                qualitychange: () => player.currentTime != 0 && hls.startLoad(),
              },
            });
            console.debug({ hls, player });
          });
        });
        hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) =>
          el.lblPlyrAuto.innerText = hls.autoLevelEnabled ? `Auto (${hls.levels[data.level].height}p)` : "Auto");
        hls.loadSource(video.dataset.src);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = video.dataset.src;
      }
    }
  });

  attempt("fuck up error message", () => {
    const elError = el.all.titleDivs.filter(d => d.innerText == strs.g.videoErrorMessage)[0];
    if (elError != null)
      elError.innerHTML = /*html*/`<s>${h(strs.g.videoErrorMessage)}</s> 😜`;
  });
})();