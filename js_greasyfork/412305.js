// ==UserScript==
// @name         Pirate Portal
// @version      1.5
// @description  Any show, any movie. Just a search and 2 clicks away.
// @author       Anonymous
// @match        https://soap2day.to/*
// @match        https://soap2day.im/*
// @match        https://soap2day.ac/*
// @match        https://soap2day.se/*
// @match        https://s2dfree.to/*
// @match        https://s2dfree.cc/*
// @match        https://s2dfree.de/*
// @match        https://s2dfree.is/*
// @match        https://s2dfree.in/*
// @match        https://s2dfree.nl/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.xmlHttpRequest
// @grant        GM.addValueChangeListener
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addValueChangeListener
// @namespace 0x1a4
// @downloadURL https://update.greasyfork.org/scripts/412305/Pirate%20Portal.user.js
// @updateURL https://update.greasyfork.org/scripts/412305/Pirate%20Portal.meta.js
// ==/UserScript==

if (!('GM' in globalThis)) {
   globalThis.GM = {
      getValue: GM_getValue,
      setValue: GM_setValue,
      xmlHttpRequest: GM_xmlhttpRequest,
      addValueChangeListener: GM_addValueChangeListener
   };
}

(() => {
   /**
    * @type {{
    *    (context: string | HTMLElement | Document, selector: string) => HTMLElement[];
    *    on <K extends keyof HTMLElementEventMap>(source: string | HTMLElement[], name: K, listener: (event: HTMLElementEventMap[K], target: HTMLElement) => void): void;
    *    xhr (source: string, callback: (response: string) => void): void;
    *    send (channel: string, ...data: any[]);
    *    receive (channel: string, callback: (...data: any[]) => void): void;
    * }}
    */
   const _$ = (context, selector) => {
      if (typeof context === 'string') {
         return [ ...document.createRange().createContextualFragment(context).querySelectorAll(selector) ];
      } else if (context instanceof Element || context instanceof Document) {
         return [ ...context.querySelectorAll(selector) ];
      } else {
         return [];
      }
   };

   Object.assign(_$, {
      on: (source, name, listener) => {
         document.addEventListener(name, (event) => {
            const subjects = typeof source === 'string' ? _$(document, source) : [ ...source ];
            let target = event.target;
            while (target.parentNode) {
               subjects.includes(target) && listener(event, target);
               target = target.parentNode;
            }
         });
      },
      xhr: (source, callback) => {
         GM.xmlHttpRequest({ url: source }).then((request) => {
            callback(request.response);
         });
      },
      send: (channel, ...data) => {
         GM.setValue('pp.message', encodeURIComponent(JSON.stringify({ channel, data, time: Date.now() })));
      },
      receive: (channel, callback) => {
         GM.addValueChangeListener('pp.message', (key, previous, next) => {
            const value = (next && JSON.parse(decodeURIComponent(next))) || {};
            value.channel === channel && callback(...value.data);
         });
      }
   });

   /**
    * @type {{
    *    api: API;
    *    continue: boolean;
    *    grid (): void;
    *    html: string;
    *    init (dummy: string, api: API): void;
    *    key (tile: HTMLElement): string;
    *    pause (name: string): void;
    *    play (link: string, init?: boolean): void;
    *    restore: boolean;
    *    resume (): void;
    *    series (seasons: any): void;
    *    storage: any;
    *    tab (name: string): void;
    *    task: number;
    *    template (page: string, template: string, _: any): string;
    *    wait: (name?: string): void;
    *    video: HTMLVideoElement;
    * }}
    */
   const pp = {
      api: null,
      continue: true,
      grid: () => {
         for (let grid of _$(document, 'grid')) {
            grid.style.gridTemplateRows = null;
            grid.style.gridTemplateColumns = null;
            const size = [ ...grid.children ].map((child) => child.getAttribute('size') || '1fr').join(' ');
            if (size) {
               const type = grid.getAttribute('type');
               if (type) {
                  switch (type.toLowerCase()) {
                     case 'rows':
                        grid.style.gridTemplateRows = size;
                        break;
                     case 'columns':
                        grid.style.gridTemplateColumns = size;
                        break;
                  }
               }
            }
         }
      },
      html: `
      <head>
         <title>Pirate Portal</title>
         <style>
            @import url('https://fonts.googleapis.com/css?family=Material+Icons+Sharp|Inconsolata|Teko');

            *:not(input)::selection {
               background-color: hsla(0, 0%, 0%, 0);
            }

            *[button] {
               color: hsla(0, 0%, 100%, 0.5);
            }

            *[button]:active:not([active]) {
               color: hsla(210, 100%, 50%, 1.0);
            }

            *[button]:hover {
               color: hsla(0, 0%, 100%, 1.0);
               cursor: pointer;
            }

            *[button][active] {
               color: hsla(0, 0%, 100%, 1.0);
               text-shadow: 0 0 5px #ffffff6f;
            }

            *[disabled] {
               display: none;
            }

            block {
               margin: auto;
               display: block;
            }

            body {
               margin: 0;
               font-family: 'Teko';
               background-color: #0d0d0d;
            }

            body[wait] {
               pointer-events: none;
               filter: brightness(70%);
            }

            grid {
               display: grid;
            }

            icon {
               display: inline-block;
               white-space: nowrap;
               font-family: 'Material Icons Sharp';
            }

            text {
               overflow: hidden;
               white-space: nowrap;
               text-overflow: ellipsis;
            }

            #header {
               height: 50px;
               position: fixed;
               width: 100%;
               background-color: #131313;
               z-index: 1;
            }

            #tabs {
               font-size: 25px;
            }

            #search {
               color: #efefef;
               border: 0;
               height: 30px;
               margin: 10px;
               font-size: 20px;
               font-family: 'Inconsolata';
               padding-left: 10px;
               background-color: #1b1b1b;
            }

            #content {
               padding-top: 50px;
               height: calc(100% - 50px);
            }

            #content > * {
               height: inherit;
            }

            #video {
               width: 100%;
               height: inherit;
            }

            #listings {
               padding: 20px;
            }

            .content:not([disabled]) {
               width: 100%;
               height: calc(100% - 50px);
               display: grid;
               grid-template-columns: repeat(8, 1fr);
            }

            .cover {
               margin: 10px;
               border: 1px solid #ffffff;
               background-size: cover;
               background-position: center;
            }

            .label {
               color: #7f7f7f;
               overflow: hidden;
               font-size: 19.5px;
               text-align: center;
               margin: 0 15px;
            }

            .tile {
               max-width: 181.2857px; /* this needs to be precise */
               justify-self: center;
               height: 100%;
               width: 100%;
            }

            .cover:hover {
               cursor: pointer;
               transform: scale(1.05);
            }

            .type {
               width: 100%;
               color: #3f3f3f;
               height: 20px;
               opacity: 0.8;
               text-align: center;
               background-color: #ffffff;
            }

            .episode {
               font-size: 20px;
            }

            .season {
               color: #ffffff;
               font-size: 40px;
            }

            .favorite {
               border: 1px solid #ffffff;
               box-shadow: 0 0 0px 2px #ffffff, 0 0 8px 2px #ffffff;
            }
         </style>
      </head>
      <body>
         <grid id="header" type="columns">
            <input id="search" placeholder="Search TV & Movies..." pp="search" size="400px">
            <grid id="tabs" type="columns">
               <block active button data-tab="default" pp="tab" size="0"></block>
               <block button class="tab" data-tab="featured" pp="tab">Featured</block>
               <block button class="tab" data-tab="results" pp="tab">Results</block>
               <block button class="tab" data-tab="listings" pp="tab">Listings</block>
               <block button class="tab" data-tab="player" pp="tab">Player</block>
               <block button class="tab" data-tab="favorites" pp="tab">Favorites</block>
            </grid>
         </grid>
         <block id="content">
            <block data-page="default" pp="page"></block>
            <block content disabled class="content page" data-page="featured" id="featured" pp="page"></block>
            <block content disabled class="content page" data-page="results" id="results" pp="page"></block>
            <block disabled class="page" data-page="listings" id="listings" pp="page"></block>
            <block disabled class="page" data-page="player" id="player" pp="page">
               <video autoplay controls id="video" pp="video"></video>
            </block>
            <block content disabled class="content page" data-page="favorites" id="favorites" pp="page"></block>
         </block>
         <template data-template="tile" pp="template">
            <grid class="tile" type="rows">
               <grid class="cover" data-link="\${_.link}" data-type="\${_.type}" pp="tile" style="background-image: url('\${_.cover}')" type="rows">
                  <block class="type" size="20px">\${{movie:'Movie',tv:'TV'}[_.type]}</block>
               </grid>
               <text class="label" size="35px" title="\${_.name}">\${_.name}</text>
            </grid>
         </template>
         <template data-template="season" pp="template">
            <block class="season">\${_.name}</block>
         </template>
         <template data-template="episode" pp="template">
            <block button class="episode" data-link="\${_.link}" pp="episode">\${_.name}</block>
         </template>
      </body>
      `,
      init: (dummy, storage, api) => {
         if (location.pathname === dummy) {
            pp.api = api;
            GM.getValue(`pp.storage:${storage}`).then((value) => {
               // persistence
               pp.storage = (value && JSON.parse(decodeURIComponent(value))) || {};
               window.addEventListener('beforeunload', () => {
                  pp.storage.paused = pp.video.paused;
                  pp.storage.volume = pp.video.volume;
                  pp.storage.currentTime = pp.video.currentTime;
                  GM.setValue(`pp.storage:${storage}`, encodeURIComponent(JSON.stringify(pp.storage)));
               });

               // the most important line
               _$(document, 'html')[0].innerHTML = pp.html.replace(/(\n        )/g, '\n').slice(1);

               // pre-script
               pp.api.pre();

               // restore previous session
               pp.tab(pp.storage.tab || 'featured');
               for (const result of pp.storage.results || []) pp.template('results', 'tile', result);
               for (const season of pp.storage.seasons || []) {
                  pp.template('listings', 'season', season);
                  for (const episode of season.episodes) {
                     pp.template('listings', 'episode', episode);
                  }
               }

               // restore selected episode
               if (pp.storage.episode) {
                  const episode = _$(document, `[pp="episode"][data-link="${pp.storage.episode}"]`)[0];
                  episode && episode.setAttribute('active', '');
               }

               // restore previous video
               pp.storage.video ? pp.play(pp.storage.video, true) : (pp.restore = false);

               // load favorites
               const favorites = pp.storage.favorites || {};
               for (const key in favorites) pp.template('favorites', 'tile', favorites[key]);

               // load featured content
               pp.api.featured((results) => {
                  for (const result of results) pp.template('featured', 'tile', result);
               });

               // post-script
               pp.api.post();
               pp.grid();

               // handle video events
               setTimeout(() => {
                  pp.video.addEventListener('canplay', () => {
                     if (pp.restore) {
                        pp.video.currentTime = pp.storage.currentTime || 0;
                        pp.video.volume = pp.storage.volume || 100;
                        pp.storage.paused && pp.video.pause();
                        pp.restore = false;
                     }
                  });
                  pp.video.addEventListener('ended', () => {
                     let target = _$(document, '[pp="episode"][active]')[0];
                     if (target) {
                        target = target.previousElementSibling;
                        while (target && target.getAttribute('pp') !== 'episode')
                           target = target.previousElementSibling;
                        target && target.click();
                     }
                  });
               });

               // favorites update loop
               setInterval(() => {
                  for (const tile of _$(document, '[pp="tile"]')) {
                     if (pp.key(tile) in (pp.storage.favorites || {})) {
                        tile.classList.contains('favorite') || tile.classList.add('favorite');
                     } else {
                        tile.classList.contains('favorite') && tile.classList.remove('favorite');
                     }
                  }
               }, 50);
            });
         } else if (location.pathname === '/') {
            location.href = location.origin + dummy;
         }
      },
      key: (tile) => {
         return `${encodeURIComponent(tile.dataset.type)}:${encodeURIComponent(tile.dataset.link)}`;
      },
      play: (link, init) => {
         pp.storage.video = link;
         init || pp.wait('player');
         pp.video.pause();
         pp.api.video(link, (source = `${location.origin}/pp.mp4`) => {
            pp.video.src = source;
            init || pp.wait();
            pp.video.play();
         });
      },
      restore: true,
      series: (seasons) => {
         for (const season of seasons) {
            pp.template('listings', 'season', season);
            for (const episode of season.episodes) {
               pp.template('listings', 'episode', episode);
            }
         }
      },
      storage: null,
      tab: (name) => {
         _$(document, `[pp="tab"][data-tab="${name}"]`)[0].click();
      },
      task: -1,
      template: (page, template, _) => {
         page = _$(document, `[pp="page"][data-page="${page}"]`)[0];
         template = _$(document, `[pp="template"][data-template="${template}"]`)[0];
         page.innerHTML += eval(`\`${template.innerHTML}\``);
         pp.grid();
         if (page.hasAttribute('content')) {
            page.style.gridTemplateRows = `repeat(${Math.ceil(page.children.length / 8)}, 280px)`;
         }
      },
      wait: (page) => {
         const search = _$(document, '[pp="search"]')[0];
         if (page) {
            document.body.setAttribute('wait', '');
            const target = _$(document, `[pp="page"][data-page="${page}"]`)[0];
            target[page === 'player' ? 'src' : 'innerHTML'] = '';
            _$(document, `[pp="tab"][data-tab="${page}"]`)[0].click();
            switch (page) {
               case 'results':
                  search.placeholder = 'Loading search results...';
                  break;
               case 'listings':
                  search.placeholder = 'Loading series listings...';
                  break;
               case 'player':
                  search.placeholder = 'Loading video content...';
                  break;
            }
         } else {
            document.body.removeAttribute('wait');
            search.placeholder = 'Search TV & Movies...';
         }
      },
      get video () {
         return _$(document, '[pp="video"]')[0];
      }
   };

   // header button logic
   _$.on('[pp="tab"]', 'click', (event, target) => {
      const active = _$(document, '[pp="tab"][active]')[0];
      if (active !== target) {
         pp.storage.tab = target.dataset.tab;
         _$(document, `[pp="page"][data-page="${active.dataset.tab}"]`)[0].setAttribute('disabled', '');
         active.removeAttribute('active');
         _$(document, `[pp="page"][data-page="${target.dataset.tab}"]`)[0].removeAttribute('disabled');
         target.setAttribute('active', '');
      }
   });

   // search bar keypress handler
   _$.on('[pp="search"]', 'keydown', (event, target) => {
      setTimeout(() => {
         if (event.key === 'Enter') {
            let task = ++pp.task;
            if (target.value) {
               pp.wait('results');
               pp.api.search(target.value, (results) => {
                  if (task === pp.task) {
                     pp.storage.results = results;
                     for (const result of results) pp.template('results', 'tile', result);
                     pp.wait();
                  }
               });
            }
         }
      });
   });

   // result left-click handler
   _$.on('[pp="tile"]', 'click', (event, target) => {
      switch (target.dataset.type) {
         case 'tv':
            pp.storage.episode = '';
            pp.wait('listings');
            pp.api.series(target.dataset.link, (seasons) => {
               pp.storage.seasons = seasons;
               pp.series(seasons);
               pp.wait();
            });
            break;
         case 'movie':
            pp.play(target.dataset.link);
            break;
      }
   });

   // result right-click handler
   _$.on('[pp="tile"]', 'contextmenu', (event, target) => {
      event.preventDefault();
      const key = pp.key(target);
      const favorites = pp.storage.favorites || (pp.storage.favorites = {});
      if (key in favorites) {
         const favorite = _$(document, `[pp="page"][data-page="favorites"] [data-link="${favorites[key].link}"]`)[0];
         favorite && favorite.parentElement.remove();
         delete favorites[key];
      } else {
         const favorite = {
            cover: target.style.backgroundImage.split('"')[1],
            name: target.nextElementSibling.title,
            link: target.dataset.link,
            type: target.dataset.type
         };
         pp.template('favorites', 'tile', favorite);
         favorites[key] = favorite;
      }
   });

   // episode click handler
   _$.on('block.episode', 'click', (event, target) => {
      pp.storage.episode = target.dataset.link;
      const current = _$(document, '[pp="episode"][active]')[0];
      current && current.removeAttribute('active');
      target.setAttribute('active', '');
      pp.play(target.dataset.link);
   });

   // initialize api
   const util = {};
   switch (location.hostname) {
      case 'soap2day.to':
      case 'soap2day.im':
      case 'soap2day.ac':
      case 'soap2day.se':
      case 's2dfree.to':
      case 's2dfree.cc':
      case 's2dfree.de':
      case 's2dfree.is':
      case 's2dfree.in':
      case 's2dfree.nl':
         if (!document.querySelector('#cf-content')) {
            util.content = (callback) => {
               return (response) => {
                  callback(
                     _$(response, 'div.thumbnail').slice(0, 48).map((result) => {
                        const anchor = _$(result, 'a')[1];
                        const image = _$(result, 'a > img')[0];
                        return {
                           cover: image.src,
                           link: anchor.href,
                           name: anchor.innerText,
                           type: image.src.split('/')[4]
                        };
                     })
                  );
               };
            };
            pp.init('/static/', 'soap2day', {
               featured: (callback) => {
                  _$.xhr(`${location.origin}/home/index.html`, util.content(callback));
               },
               post: () => {
                  document.body.innerHTML += `<iframe disabled id="background" src="${location.origin}"></iframe>`;
                  setInterval(() => {
                     _$(document, '#background')[0].src += '';
                  }, 10e3);
               },
               pre: () => {},
               search: (query, callback) => {
                  _$.xhr(`${location.origin}/search/keyword/${encodeURIComponent(query)}`, util.content(callback));
               },
               series: (link, callback) => {
                  _$.xhr(link, (response) => {
                     callback(
                        _$(response, 'div.alert-info-ex').map((season) => {
                           return {
                              name: `Season ${_$(season, 'h4')[0].innerText.slice(6).split(' ')[0]}`,
                              episodes: _$(season, 'div.myp1 > a').map((episode) => {
                                 return {
                                    link: episode.href,
                                    name: episode.innerText.replace(/.*?\./, '').replace(/\(([0-9]+)-([0-9]+)\)/, '')
                                 };
                              })
                           };
                        })
                     );
                  });
               },
               video: (link, callback) => {
                  _$.xhr(link, (response) => {
                     const param = _$(response, 'div#divU')[0].innerText;
                     _$.xhr('https://api.ipify.org', (extra) => {
                        const path = new URL(link).pathname;
                        fetch(`${location.origin}/home/index/Get${path.slice(1)[0].toUpperCase()}InfoAjax`, {
                           body: `pass=${_$(response, '#hId')[0].value}&param=${param}&extra=${extra}`,
                           headers: {
                              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                              'X-Requested-With': 'XMLHttpRequest'
                           },
                           referrer: `${origin}${path}`,
                           method: 'POST'
                        })
                           .then((data) => data.json())
                           .then((data) => callback(JSON.parse(data).val));
                     });
                  });
               }
            });
         }
         break;
      /* case 'streamonhd.me':
         if (window.self === window.top) {
            util.convert = (result) => {
               const image = _$(result, 'img')[0];
               const href = _$(result, 'a')[0].href;
               return {
                  cover: image.src,
                  link: href,
                  name: image.alt,
                  type: href.includes('/tvshows/') ? 'tv' : 'movie'
               };
            };
            util.content = (response) => {
               return _$(response, '#featured-titles .poster').slice(0, 24).map(util.convert);
            };
            pp.init('/wp-content/', 'streamonhd', {
               featured: (callback) => {
                  _$.xhr(`${location.origin}/movies/`, (response) => {
                     const movies = util.content(response);
                     _$.xhr(`${location.origin}/tvshows/`, (response) => {
                        callback([ ...movies, ...util.content(response) ]);
                     });
                  });
               },
               post: () => {},
               pre: () => {},
               search: (query, callback) => {
                  _$.xhr(`${location.origin}/?s=${encodeURIComponent(query)}`, (response) => {
                     callback(_$(response, '.result-item').slice(0, 48).map(util.convert));
                  });
               },
               series: (link, callback) => {
                  _$.xhr(link, (response) => {
                     callback(
                        _$(response, 'div.se-c')
                           .map((season) => {
                              return {
                                 name: `Season ${_$(season, 'span.title')[0].firstChild.textContent
                                    .trim()
                                    .split(' ')[1]}`,
                                 episodes: _$(season, 'a').map((episode) => {
                                    return {
                                       link: episode.href,
                                       name: episode.innerText
                                    };
                                 })
                              };
                           })
                           .reverse()
                     );
                  });
               },
               video: (link, callback) => {
                  const previous = _$(document, '#background')[0];
                  previous && previous.remove();
                  document.body.innerHTML += `<iframe disabled id="background" src="${link}"></iframe>`;
                  const frame = _$(document, '#background')[0];
                  const timer1 = setInterval(() => {
                     const deep = frame.contentDocument && _$(frame.contentDocument, 'iframe')[0];
                     if (deep) {
                        clearInterval(timer1);
                        const liason = new URL(deep.src).origin;
                        _$.receive(`locate.await@${liason}`, () => {
                           clearInterval(timer2);
                        });
                        _$.receive(`locate.response@${liason}`, (source) => {
                           callback(source);
                        });
                        const timer2 = setInterval(() => {
                           _$.send(`locate.query@${liason}`);
                        }, 500);
                     }
                  }, 100);
               }
            });
         }
         break; */
   }

   /* _$.receive(`locate.query@${location.origin}`, () => {
      _$.send(`locate.await@${location.origin}`);
      let over = 15000;
      const delay = 100;
      const timer = setInterval(() => {
         const video = _$(document, 'video')[0];
         if (video && video.src) {
            clearInterval(timer);
            _$.send(`locate.response@${location.origin}`, video.src);
         } else if ((over = over - delay) < 0) {
            clearInterval(timer);
            _$.send(`locate.response@${location.origin}`);
         }
      }, delay);
   }); */
})();

/**
 * @typedef {{
 *    featured (
 *       callback: (
 *          results: {
 *             cover: string
 *             link: string
 *             name: string
 *             type: string
 *          }[]
 *       ) => void
 *    ): void
 *    post (): void
 *    pre (): void
 *    search (
 *       query: string
 *       callback: (
 *          results: {
 *             cover: string
 *             link: string
 *             name: string
 *             type: string
 *          }[]
 *       ) => void
 *    ): void
 *    series (
 *       link: string
 *       callback: (
 *          seasons: {
 *             episodes: {
 *                link: string
 *                name: string
 *             }[]
 *             name: string
 *          }[]
 *       ) => void
 *    ): void
 *    video (
 *       link: string
 *       callback: (
 *          source: string
 *       ) => void
 *    ): void
 * }} API
 */
