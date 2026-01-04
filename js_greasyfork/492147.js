// ==UserScript==
// @name        AnimeHay
// @namespace   https://greasyfork.org/en/scripts/492147-animehay
// @match       *://animehay.*/thong-tin-phim/*
// @match       *://animehay.*/xem-phim/*
// @match       *://hhtq3d*.*/*/
// @match       *://hhtq3d*.*/watch/*/
// @grant       GM_getValue
// @grant       GM_setValue
// @version     1.7
// @author      HVD
// @icon        https://i.imgur.com/EiOLZtO.png
// @description Tự động lưu và khôi phục lịch sử xem phim khi AnimeHay đổi tên miền mới
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492147/AnimeHay.user.js
// @updateURL https://update.greasyfork.org/scripts/492147/AnimeHay.meta.js
// ==/UserScript==

function waitForElements(selector, observeElement) {
    return new Promise((resolve, reject) => {

      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) return resolve(elements);

      observeElement = document.querySelector(observeElement) || document.body;
      const observer = new MutationObserver(() => {
        const elements = observeElement.querySelectorAll(selector);
        if (elements.length > 0) {
          observer.disconnect();
          resolve(elements);
        }
      });

      observer.observe(observeElement, {
        childList: true,
        subtree: true,
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Elements not found: ${selector}`));
      }, 10000);  // Timeout after 10 seconds
    });
}

const getValue = (key) => JSON.parse(GM_getValue(key, '{}'));
const setValue = (key, value) => GM_setValue(key, JSON.stringify(value));

class AnimeHay {
    constructor() {
        this.keyName = 'AnimeHay';
        this.maxHistory = 20;
        this.pathName = location.pathname;
        this.watchedMovies = getValue(this.keyName);
    }

    save(watchedMovies) {
        setValue(this.keyName, watchedMovies);
    }

    markViewed(watchedEps, name) {
        if (watchedEps.size === 0) return;

        if (watchedEps.size > this.maxHistory) watchedEps.delete([...watchedEps][0]);

        const epList = document.querySelectorAll('.list-item-episode a');
        for (const ep of watchedEps) {
            for (const item of epList) {
                const href = item.getAttribute('href');
                if (href.includes(ep)) {
                    item.style.backgroundColor = 'rgb(25 81 75)';
                    break;
                }
            }
        }
    }

    handleMovieInfoPage() {
        const name = this.pathName.replace(/\/thong-tin-phim\/|\-(\d+).html/g, '');
        const watchedEps = new Set(this.watchedMovies[name] ?? []);
        this.markViewed(watchedEps, name);
    }

    handleWatchMoviePage() {
        const [name, episode] = this.pathName.replace(/\/xem-phim\/|\.html/g, '').split('-tap-');
        const watchedEps = new Set(this.watchedMovies[name] ?? []);
        this.markViewed(watchedEps, name);

        if (watchedEps.has(episode)) return;

        watchedEps.add(episode);
        this.watchedMovies[name] = [...watchedEps];
        setValue(this.keyName, this.watchedMovies);
    }

    init() {
        if (this.pathName.includes('/thong-tin-phim/')) {
            this.handleMovieInfoPage();
        } else if (this.pathName.includes('/xem-phim/')) {
            this.handleWatchMoviePage();
        }
    }
}

class HHTQ {
    constructor() {
        this.keyName = 'HHTQ';
        this.maxHistory = 20;
        this.pathName = location.pathname;
        this.watchedMovies = getValue(this.keyName);
    }

    markViewed(watchedEps, name) {
        if (watchedEps.size === 0) return;

        if (watchedEps.size > this.maxHistory) watchedEps.delete([...watchedEps][0]);

        waitForElements('.halim-list-eps > li span', '#halim-list-server').then(epList => {
            for (const ep of watchedEps) {
                for (const item of epList) {
                    if (item.innerText == ep) {
                        item.style.backgroundColor = 'rgb(25 81 75)';
                        break;
                    }
                }
            }
            document.querySelector('#halim-list-server ul li span.active').style.backgroundColor = '';
        });

    }

    handleMovieInfoPage() {
        const name = this.pathName.replace(/^\/|\/$/g, '');
        const watchedEps = new Set(this.watchedMovies[name] ?? []);
        this.markViewed(watchedEps, name);
    }

    handleWatchMoviePage() {
        const [, name, episode] = this.pathName.match(/\/watch\/([^/]+)-eps-(\d+)-server-\d+\//);
        const watchedEps = new Set(this.watchedMovies[name] ?? []);
        this.markViewed(watchedEps, name);

        if (watchedEps.has(episode)) return;

        watchedEps.add(episode);
        this.watchedMovies[name] = [...watchedEps];
        setValue(this.keyName, this.watchedMovies);
    }

    init() {
        if (/^\/[^/]+\/$/.test(this.pathName)) {
            this.handleMovieInfoPage();
        } else if (this.pathName.includes('/watch/')) {

            if (!window._jwplayer) {
                const self = this;
                window._jwplayer = unsafeWindow.jwplayer;
                unsafeWindow.jwplayer = function(id) {
                  if (self.pathName != location.pathname) {
                    self.pathName = location.pathname;
                    self.handleWatchMoviePage();
                  }
                  return window._jwplayer(id);
                };
            }

            this.handleWatchMoviePage();
        }
    }
}

if (location.hostname.includes('animehay')) (new AnimeHay()).init();
else (new HHTQ()).init();

