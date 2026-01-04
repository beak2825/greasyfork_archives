// ==UserScript==
// @name           Premier.one – Enhanced [Ath]
// @name:ru        Premier.one – Улучшенный [Ath]
// @name:uk        Premier.one – Покращений [Ath]
// @name:be        Premier.one – Удасканалены [Ath]
// @name:bg        Premier.one – Подобрен [Ath]
// @name:tt        Premier.one – Яхшыртылган [Ath]
// @name:sl        Premier.one – Izboljšan [Ath]
// @name:sr        Premier.one – Poboljšan [Ath]
// @name:ka        Premier.one – გაუმჯობესებული [Ath]
// @description    Premier.one enhancements: fixed time range filtering, IMDB and Kinopoisk ratings in lists, better episode titles, expanded lists with direct links, extra filters etc.
// @description:ru Улучшения для Premier.one: исправление фильтрации по годам, рейтинги Кинопоиска и IMDB в списках, полные заголовки эпизодов, раскрытые списки с прямыми ссылками, дополнительные фильтры 
// @description:uk Покращення для Premier.one: виправлення фільтрації за роками, рейтинги Кінопоіска та IMDB у списках, повні назви епізодів, розгорнуті списки з прямими посиланнями, додаткові фильтри
// @description:be Удасканаленні для Premier.one: выпраўленне фільтрацыі па гадах, рэйтынгі Кінапоіска і IMDB у спісах, поўныя назвы эпізодаў, раскрытыя спісы з простымі спасылкамі, дадатковыя фільтры
// @description:bg Подобрения за Premier.one: коригиране на филтрирането по времеви диапазони, рейтинги на Кинопоиск и IMDB в списъците, по-добри заглавия на епизодите, разширени списъци с директни връзки, допълнителни филтри и т.н.
// @description:tt Premier.one өчен яхшыртулар: еллар буенча фильтрлауны төзәтү, Кинопоиск һәм IMDB рейтинглары исемлектә, эпизодларның яхшыртылган исемнәре, туры сылтамалар белән киңәйтелгән исемлекләр, өстәмә фильтрлар һ.б.
// @description:sl Izboljšave za Premier.one: popravki filtriranja po časovnih obdobjih, ocene IMDB in Kinopoisk v seznamih, boljši naslovi epizod, razširjeni seznami z neposrednimi povezavami, dodatni filtri itd.
// @description:sr Poboljšanja za Premier.one: ispravka filtriranja po godinama, rejtinzi Kinopoiska i IMDB u listama, bolji naslovi epizoda, proširene liste sa direktnim linkovima, dodatni filteri itd.
// @description:ka Premier.one-ის გაუმჯობესებები: დროის დიაპაზონის ფილტრაციის გასწორება, კინოპოისკისა და IMDB-ს რეიტინგები სიებში, უკეთესი ეპიზოდების სათაურები, გაფართოებული სიები პირდაპირი ბმულებით, დამატებითი ფილტრები და სხვა.
// @namespace      athari
// @author         Athari (https://github.com/Athari)
// @copyright      © Prokhorov ‘Athari’ Alexander, 2024–2025
// @license        MIT
// @homepageURL    https://github.com/Athari/AthariUserJS
// @supportURL     https://github.com/Athari/AthariUserJS/issues
// @version        1.1.4
// @icon           https://www.google.com/s2/favicons?sz=64&domain=premier.one
// @match          https://premier.one/*
// @match          https://rutube.ru/*
// @grant          unsafeWindow
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_getResourceText
// @grant          GM_getResourceURL
// @grant          GM_info
// @run-at         document-start
// @require        https://cdn.jsdelivr.net/npm/string@3.3.3/dist/string.min.js
// @require        https://cdn.jsdelivr.net/npm/@athari/monkeyutils@0.3.1/monkeyutils.u.min.js
// @resource       script-urlpattern https://cdn.jsdelivr.net/npm/urlpattern-polyfill/dist/urlpattern.js
// @tag            athari
// @downloadURL https://update.greasyfork.org/scripts/524043/Premierone%20%E2%80%93%20Enhanced%20%5BAth%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/524043/Premierone%20%E2%80%93%20Enhanced%20%5BAth%5D.meta.js
// ==/UserScript==

const { assignDeep, delay, waitFor, matchLocation, adjustUrlSearch, overrideFetch, setElementTagName, ress, scripts, els, opts, props } =
  //require("../@athari-monkeyutils/monkeyutils.u");
  athari.monkeyutils;

(async () => {
  'use strict'

  const premierHost = "premier.one";
  const res = ress(), script = scripts(res);
  const el = els(document, {
    fakeLinks: "div[to]",
    seasons: ".w-show-card-seasons-and-series__tabs", episodes: ".w-show-card-seasons-and-series__slide:not(.ath-linkified)",
    main: ".l-main", btnCancelNext: ".f-player-recommendation__cancel",
  });

  S.extendPrototype();
  Object.assign(globalThis, globalThis.URLPattern ? null : await script.urlpattern);

  const extraComplexFilters = [
    {
      nameForClient: "Советские Мультфильмы", nameForClientEn: "Soviet Cartoons", sendUrl: 'soviet-toons',
      values: [
        { inputFilter: 'countries', inputFilterValues: "SU" },
        { inputFilter: 'types', inputFilterValues: 'movie' },
        { inputFilter: 'genres', inputFilterValues: 'multfilmy' },
      ],
    },
    {
      nameForClient: "Советские Фильмы", nameForClientEn: "Soviet", sendUrl: 'soviet-films',
      values: [
        { inputFilter: 'countries', inputFilterValues: "SU" },
        { inputFilter: 'types', inputFilterValues: 'movie' },
      ],
    },
    {
      nameForClient: "Российские Мультфильмы", nameForClientEn: "Russian Cartoons", sendUrl: 'russia-toons',
      values: [
        { inputFilter: 'countries', inputFilterValues: "RU" },
        { inputFilter: 'types', inputFilterValues: 'movie' },
        { inputFilter: 'genres', inputFilterValues: 'multfilmy' },
      ],
    },
    /*{
      activeValue: true,
      nameForClient: "Пост-совковые Мультфильмы", nameForClientEn: "Post-USSR Cartoons", sendUrl: 'ex-ussr-toons',
      values: [
        { inputFilter: 'countries', inputFilterValues: "BY,KZ,PL,SK,UA,CZ,RU" },
        { inputFilter: 'types', inputFilterValues: 'movie' },
        { inputFilter: 'genres', inputFilterValues: 'multfilmy' },
      ],
    },*/
  ];

  const matchPremierApi = (url, pathname) =>
    matchLocation(premierHost, { pathname: pathname.replace(/\/api\//, "/{uma-}?api/") }, url);

  const matchPremierApiMap = (url, data, map) => {
    let murl;
    for (const [ pathname, proc ] of Object.entries(map))
      if ((murl = matchPremierApi(url, pathname)) != null)
        return proc(data, murl);
  };

  const fixSeoTitle = o => {
    const seoTitle = o.seoTemplate.seoTitle;
    const cleanTitle = seoTitle.includes("{{episode}}")
      ? "{{title_name}} s{{season}}e{{episode}}"
      : seoTitle.includes("{{season}}")
      ? "{{title_name}} s{{season}}"
      : seoTitle.includes("{{title_name}}")
      ? "{{title_name}}"
      : seoTitle;
    assignDeep(o, {
      seoTemplate: {
        seoH1: cleanTitle,
        seoTitle: cleanTitle,
      },
    });
  };

  const fixPlayerTitle = o => {
    if (o.season > 0 && o.episode > 0 && o.description.length < 100)
      o.title_for_player += `: ${o.description}`;
    return o;
  };

  const addRatingsToPosters = async (movies) => {
    const elPostersList = await waitFor(() => document.querySelector(`.e-poster-list:has(a[data-id='${movies.at(-1).objectId}'])`), 20000);
    if (elPostersList == null)
      return;
    for (let elPoster of elPostersList.children) {
      const movie = movies.filter(m => m.objectId == elPoster.dataset.id)[0];
      if (movie == null)
        continue;
      elPoster.querySelector(".e-rating")?.remove();
      const htmlRating = (rating, type) => rating[type] == 0 ? "" : /*html*/`
        <div class="e-rating e-rating--${type}">
          <div class="a-icon e-rating__icon"><i class="a-icons icon-mono--rating--${type}"></i></div>
          <span class="e-rating__value font-poster-badge-cc">${rating[type].toFixed(1)}</span>
        </div>`;
      elPoster.querySelector(".e-poster__play-icon").insertAdjacentHTML('afterEnd', /*html*/`
        <div class="ath-poster-ratings">
          ${htmlRating(movie.rating, 'kinopoisk')}
          ${htmlRating(movie.rating, 'imdb')}
        </div>`);
      elPoster.title =
        `${movie.name} (${movie.genres?.map(g => g.name).join(", ")}) ${movie.age_restriction}\n\n` +
        `${movie.description}\n\n` +
        `КП: ${movie.rating.kinopoisk.toFixed(1)}   IMDB: ${movie.rating.imdb.toFixed(1)}`;
    }
  };

  let trackInfo = {}, trackInfo2 = {};

  overrideFetch(unsafeWindow, {
    fakeResponse: ({ url }, output) =>
      matchPremierApiMap(url, null, {
        "/api/play/access/:videoId": (_, murl) =>
          output.json({ id: murl.videoId })
      }),
    modifyRequestUrl: ({ url }) =>
      matchPremierApiMap(url, null, {
        "/catalog/:version/tv": () =>
          adjustUrlSearch(url, { per_page: 100 }),
      }),
    //modifyRequestJson: ({ url }, json) => {},
    modifyResponseJson: ({ url }, json) =>
      matchPremierApiMap(url, json, {
        "/app/v:version/page/info": (json) =>
          (fixSeoTitle(json.result), json),
        /*"/app/v:version/show/:videoSlug/metainfo": (json) =>
          assignDeep(json, {
            result: {
              slogan: "Информация должна быть свободной!",
              accessibility: 'free',
              has_allow_download: true,
              restriction_notices: [],
            },
          }),*/
        "/catalog/v:version/filters": (json) => {
          const years = json.result.filter(f => f.typeFilter == 'select' && f.name == 'years')[0];
          if (years == null)
            return;
          const yearRangeSwap = 2000, yearRangeMin = 1930, yearRangeLength = 5;
          let iyear = 1;
          const getFilterYearValue = syear => ({
            nameValue: syear, title: syear, titleEn: syear, //sendUrl: syear,
            multiselect: true, otherParam: false, activeValue: true,
            numberValue: ++iyear,
          });
          years.values = [ years.values[0] ];
          for (let year = new Date().getFullYear(); year >= yearRangeSwap; year--)
            years.values.push(getFilterYearValue(`${year}`));
          for (let toYear = yearRangeSwap - 1; toYear > yearRangeMin; toYear -= yearRangeLength)
            years.values.push(getFilterYearValue(`${toYear - yearRangeLength + 1}-${toYear}`));
          return json;
        },
        "/catalog/v:version/complex-filters": (json) => {
          json.result = [
            ...extraComplexFilters,
            ...json.result.filter(f => !f.nameForClient.includes("20") && f.sendUrl != 'RU'),
          ];
          let ifilter = 0;
          for (let filter of json.result)
            Object.assign(filter, { number: ++ifilter, activeValue: true });
          return json;
        },
        "/catalog/:version/tv": (json) => {
          const movies = json.result?.items;
          if (movies != null)
            addRatingsToPosters(movies);
        },
        "/api/metainfo/tv/:videoSlug/video/{/*}?": (json) => {
          if (json.results?.[0]?.title_for_player != null)
            for (let r of json.results)
              fixPlayerTitle(r);
          return json;
        },
        "/api/view_history/": (json) => {
          if (json.results?.[0]?.video != null) {
            for (let r of json.results) {
              fixPlayerTitle(r.video);
              r.title_for_player = r.video.title_for_player;
            }
          }
          return json;
        },
        "/api/play/trackinfo/:trackId/": (json) => {
          trackInfo = structuredClone(json);
          console.debug("info1", { trackInfo: structuredClone(trackInfo), title: el.tag.title?.innerText });
          return fixPlayerTitle(json);
        },
        "/api/video/:videoId": (json) => {
          trackInfo2 = structuredClone(json);
          console.debug("info2", { trackInfo2: structuredClone(trackInfo2), title: el.tag.title?.innerText });
          return fixPlayerTitle(json);
        },
      })
  });

  (await el.wait.tag.head).insertAdjacentHTML('beforeEnd', /*html*/`
    <style>
      @media (min-width: 1600px) {
        .w-video-section__slide--horizontal {
          max-width: calc(20% - 1rem);
        }
      }
      .m-select__options-list--rows {
        display: flex;
        flex-flow: column wrap;
        max-height: 29rem !important;
      }
      .e-content-filters__list .m-select:nth-child(5) .m-select__dropdown { /* plots */
        width: auto !important;
        max-width: 50rem;
      }
      .m-select__option {
        padding: 0 !important;
        label {
          padding: .75rem 1rem;
        }
      }
      .m-section:not(.w-promo-slider) {
        .m-section__content {
          .m-slider {
            .m-slider__wrapper {
              display: flex;
              flex-flow: row wrap;
              transform: none !important;
            }
            .m-slider__button-prev,
            .m-slider__button-next {
              display: none;
            }
          }
        }
      }
      .ath-poster-ratings {
        position: absolute;
        inset: auto .5rem .5rem auto;
        display: flex;
        flex-flow: row;
        gap: .5rem;
        .e-rating {
          position: static !important;
          padding: 0 .25rem !important;
          .a-icon i {
            font-size: inherit;
            width: auto;
            height: auto;
          }
        }
      }
      a.ath-episode-link {
        position: absolute;
        inset: 0;
      }
    </style>`);

  const linkifyEpisodes = () => {
    let murl = null;
    for (let elFakeLink of el.all.fakeLinks) {
      elFakeLink.setAttribute('href', elFakeLink.getAttribute('to'));
      setElementTagName(elFakeLink, 'A');
    }
    if (el.seasons != null) {
      const propSeasons = props(el.seasons);
      const [ seasonsCount, currentSeason ] = [ propSeasons['--m-tabs-items-count'], propSeasons['--m-tabs-active-index'] ];
      if (seasonsCount > 0 && (murl = matchPremierApi(location, "/show/:videoSlug{/*}?")) != null) {
        for (let elEpisode of el.all.episodes) {
          const episodeIndex = +elEpisode.getAttribute('index') + 1;
          elEpisode.classList.add('ath-linkified');
          elEpisode.querySelector(".e-poster").insertAdjacentHTML('beforeEnd', /*html*/`
            <a class="ath-episode-link" href="/show/${murl.videoSlug}/season/${currentSeason}/episode/${episodeIndex}"></a>`);
        }
      }
    }
  };

  for (let ims = 0; ims += 100; await delay(100)) {
    if (ims % 1000 == 0) {
      linkifyEpisodes();
    }
    if (ims % 200 == 0) {
      el.main?.removeAttribute('inert');
      el.btnCancelNext?.click();
    }
  }
})();