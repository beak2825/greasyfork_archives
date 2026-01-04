// ==UserScript==
// @name         IMDb VidSrc Player & VPN Killswitch
// @description  Embeds a VidSrc player into IMDb. Works with all Movies, TV Series, and TV Episode listings. It also has a killswitch that will automatically close the player when your ISP changes to the one you want to monitor for. No media content is hosted by this script; it merely accesses a public search index.
// @namespace    https://www.imdb.com/
// @icon         https://vidsrc.net/template/vidsrc-ico.png
// @version      1.2.3
// @author       develgeek
// @license      MIT
// @match        https://*.imdb.com/title/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528676/IMDb%20VidSrc%20Player%20%20VPN%20Killswitch.user.js
// @updateURL https://update.greasyfork.org/scripts/528676/IMDb%20VidSrc%20Player%20%20VPN%20Killswitch.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class IpInspector {
        static URL = 'https://get.geojs.io/v1/ip/geo.json';

        async getIsp() {
            const response = await fetch(IpInspector.URL);
            const parsed = await response.json();
            const isp = parsed.organization_name ?? '';
            console.debug('ip=%s, isp=%s', parsed.ip, isp);
            return isp.trim();
        }
    }

    class IpWatcher {
        static CHECK_INTERVAL_SECS = 5;
        static STORAGE_KEY = 'vidsrc_watch_isp';

        constructor(inspector) {
            this.inspector = inspector;
        }

        watch(handler) {
            this.intervalId = window.setInterval(() => {
                const watchIsp = this.watchIsp;
                if (!watchIsp) return;
                this.ispMatches()
                    .then(({isp, matches}) => {
                        if (isp !== watchIsp) {
                            handler(isp, matches);
                        }
                    })
            }, IpWatcher.CHECK_INTERVAL_SECS * 1000);
        }

        stopWatching() {
            if (this.intervalId) window.clearInterval(this.intervalId);
        }

        async ispMatches() {
            const isp = await this.inspector.getIsp();
            if (!isp) throw new Error('No ISP found');
            return {
                isp,
                matches: isp.toLowerCase().includes(this.watchIsp?.toLowerCase())
            };
        }

        get watchIsp() {
            return window.localStorage.getItem(IpWatcher.STORAGE_KEY);
        }

        set watchIsp(isp) {
            window.localStorage.setItem(IpWatcher.STORAGE_KEY, isp.trim());
        }
    }

    class ListingParser {
        constructor(document) {
            this.document = document;
        }

        isSeries() {
            // Examples: TV Series, TV Mini Series
            return this.document.title.match(/TV ([a-z]+ )?Series/i) !== null;
        }

        isEpisode() {
            return this.document.title.includes('TV Episode');
        }

        get seasonEpisode() {
            const container = this.document.querySelector('[data-testid="hero-subnav-bar-season-episode-numbers-section"]');
            const match = container?.textContent.trim().match(/S(\d+)\.E(\d+)/);
            return match ? {
                season: match[1],
                episode: match[2],
            } : null;
        }

        /**
         * The Series Title ID differs from the page's Title ID on episode pages only.
         */
        get seriesTitleId() {
            const link = this.document.querySelector('[data-testid="hero-title-block__series-link"]');
            return link ? this.parseTitleId(link.getAttribute('href')) : null;
        }

        get titleId() {
            this.titleIdCached ??= this.parseTitleId(this.document.location.pathname);
            return this.titleIdCached;
        }

        parseTitleId(url) {
            return url.match(/\/title\/(tt\d+)\//)?.[1];
        }
    }

    class UrlBuilder {
        static BASE_URL = 'https://vidsrc.net/embed';

        constructor(parser) {
            this.parser = parser;
        }

        get url() {
            const isSeries = this.parser.isSeries();
            const isEpisode = this.parser.isEpisode();
            if (!isSeries && !isEpisode) {
                return this.movieUrl;
            }
            return isEpisode
                ? this.episodeUrl
                : this.seriesUrl;
        }

        get movieUrl() {
            return `${UrlBuilder.BASE_URL}/movie/${this.parser.titleId}`;
        }

        get seriesUrl() {
            return `${UrlBuilder.BASE_URL}/tv/${this.parser.titleId}`;
        }

        get episodeUrl() {
            const seasonEpisode = this.parser.seasonEpisode;
            const seriesId = this.parser.seriesTitleId;
            if (!seasonEpisode || !seriesId) return null;
            const {season, episode} = seasonEpisode;
            return `${UrlBuilder.BASE_URL}/tv/${seriesId}/${season}/${episode}`;
        }
    }

    const ipWatcher = new IpWatcher(new IpInspector());

    class PlayerBuilder {
        styles = () => (`
            <style>
                #vidsrc {
                    position: fixed;
                    bottom: 10px;
                    right: 10px;
                    z-index: 9999;
                    background: linear-gradient(120deg, #185494, #EE1D23, #FAAF18, #FFFFFF);
                    border-radius: 6px;
                    filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
                    font-family: Roboto, Helvetica, sans-serif;
                }
                #vidsrc .container {
                    padding: 10px;
                    display: flex;
                    flex-direction: column;
                    width: 700px;
                    height: 450px;
                    border: 2px solid rgb(255 255 255 / 20%);
                    border-radius: 6px;
                }
                #vidsrc .current-isp {
                    margin-right: 1em;
                }
                #vidsrc input.watch-isp {
                    width: 115px;
                    border-color: transparent;
                    border-bottom: 1px solid rgb(255 255 255 / 40%);
                    background: transparent;
                    margin-left: 0.25em;
                }
                #vidsrc input.watch-isp:focus {
                    outline: none;
                }
                #vidsrc input.watch-isp::placeholder {
                    font-style: italic;
                    color: rgb(0, 0, 0, 0.7);
                }
                #vidsrc .close-btn {
                    display: block;
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                }
                #vidsrc .controls {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.5em;
                }
                #vidsrc .player {
                    flex-grow: 1;
                }
            </style>
        `);

        container = () => {
            const parent = document.createElement('div');
            parent.id = 'vidsrc';

            const container = document.createElement('div');
            container.className = 'container';

            parent.appendChild(container);
            return [parent, container];
        };

        controls = (parentContainer) => {
            const ispSpan = document.createElement('span');
            ispSpan.className = 'current-isp'

            const ipInputLabel = document.createElement('label');
            ipInputLabel.textContent = 'Monitor For ISP:';
            const ipInput = document.createElement('input');
            ipInput.className = 'watch-isp';
            ipInput.placeholder = 'ISP contains...';
            ipInput.value = ipWatcher.watchIsp;
            ipInput.onchange = (event) => {
                ipWatcher.watchIsp = event.target.value;
            };
            ipInputLabel.appendChild(ipInput);

            const closeBtn = document.createElement('button');
            closeBtn.className = 'close-btn'
            closeBtn.innerText = '✖️';

            const container = document.createElement('div');
            container.className = 'controls';

            container.appendChild(ispSpan);
            container.appendChild(ipInputLabel);
            container.appendChild(closeBtn);
            closeBtn.addEventListener('click', () => parentContainer.remove());

            return [ispSpan, container];
        };

        player = (url) => {
            const player = document.createElement('iframe');
            player.className = 'player';
            player.src = url;
            player.referrerPolicy = 'no-referrer';
            player.allowFullscreen = true;
            return player;
        };

        make(url) {
            const [parent, container] = this.container();
            const [ispSpan, controls] = this.controls(container);
            container.appendChild(controls);

            const player = this.player(url);
            console.debug('built player, url=%s', url);

            return {
                styles: this.styles(),
                parent,
                setCurrentIsp: (isp) => {
                    ispSpan.textContent = `Current ISP: ${isp}`;
                },
                show: () => {
                    container.appendChild(player);
                },
                remove: () => {
                    player.remove();
                },
            };
        }
    }

    const urlBuilder = new UrlBuilder(
        new ListingParser(document)
    );

    const player = new PlayerBuilder().make(urlBuilder.url);
    document.head.insertAdjacentHTML('beforeend', player.styles);
    document.body.appendChild(player.parent);

    // Show the player if the entered ISP doesn't match the current ISP.
    ipWatcher.ispMatches().then(({isp, matches}) => {
        player.setCurrentIsp(isp);
        if (matches || !ipWatcher.watchIsp) return;
        player.show();
        ipWatcher.watch((isp, matches) => {
            player.setCurrentIsp(isp);
            if (matches) {
                player.remove();
                ipWatcher.stopWatching();
                console.info('ISP matches, killed player');
            }
        });
    })
})();