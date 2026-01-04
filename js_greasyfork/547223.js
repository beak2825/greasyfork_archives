// ==UserScript==
// @name          External links on Trakt
// @version       3.4.1
// @description   Adds more external links to Trakt.tv pages, including dub information for anime shows.
// @author        Journey Over
// @license       MIT
// @match         *://trakt.tv/*
// @require       https://cdn.jsdelivr.net/gh/StylusThemes/Userscripts@0171b6b6f24caea737beafbc2a8dacd220b729d8/libs/utils/utils.min.js
// @require       https://cdn.jsdelivr.net/gh/StylusThemes/Userscripts@644b86d55bf5816a4fa2a165bdb011ef7c22dfe1/libs/metadata/wikidata/wikidata.min.js
// @require       https://cdn.jsdelivr.net/gh/StylusThemes/Userscripts@644b86d55bf5816a4fa2a165bdb011ef7c22dfe1/libs/metadata/armhaglund/armhaglund.min.js
// @require       https://cdn.jsdelivr.net/gh/StylusThemes/Userscripts@644b86d55bf5816a4fa2a165bdb011ef7c22dfe1/libs/metadata/anilist/anilist.min.js
// @require       https://cdn.jsdelivr.net/npm/node-creation-observer@1.2.0/release/node-creation-observer-latest.min.js
// @require       https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @grant         GM_deleteValue
// @grant         GM_getValue
// @grant         GM_listValues
// @grant         GM_setValue
// @grant         GM_xmlhttpRequest
// @grant         GM_info
// @run-at        document-start
// @inject-into   content
// @icon          https://www.google.com/s2/favicons?sz=64&domain=trakt.tv
// @homepageURL   https://github.com/StylusThemes/Userscripts
// @namespace https://greasyfork.org/users/32214
// @downloadURL https://update.greasyfork.org/scripts/547223/External%20links%20on%20Trakt.user.js
// @updateURL https://update.greasyfork.org/scripts/547223/External%20links%20on%20Trakt.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const logger = Logger('External links on Trakt', { debug: false });

  const CONSTANTS = {
    CACHE_DURATION: 24 * 60 * 60 * 1000,
    SCRIPT_ID: GM_info.script.name.toLowerCase().replace(/\s/g, '-'),
    CONFIG_KEY: 'external-trakt-links-config',
    TITLE: `${GM_info.script.name} Settings`,
    DUB_LANGUAGE_KEY: 'Dub Language',
    METADATA_SITES: [
      { name: 'Rotten Tomatoes', desc: 'Provides a direct link to Rotten Tomatoes for the selected title.' },
      { name: 'Metacritic', desc: 'Provides a direct link to Metacritic for the selected title.' },
      { name: 'Letterboxd', desc: 'Provides a direct link to Letterboxd for the selected title.' },
      { name: 'TVmaze', desc: 'Provides a direct link to TVmaze for the selected title.' },
      { name: 'Mediux', desc: 'Provides a direct link to the Mediux Poster site for the selected title.' },
      { name: 'MyAnimeList', desc: 'Provides a direct link to MyAnimeList for the selected title.' },
      { name: 'AniDB', desc: 'Provides a direct link to AniDB for the selected title.' },
      { name: 'AniList', desc: 'Provides a direct link to AniList for the selected title.' },
      { name: 'Kitsu', desc: 'Provides a direct link to Kitsu for the selected title.' },
      { name: 'AniSearch', desc: 'Provides a direct link to AniSearch for the selected title.' },
      { name: 'LiveChart', desc: 'Provides a direct link to LiveChart for the selected title.' }
    ],
    STREAMING_SITES: [
      { name: 'BrocoFlix', desc: 'Provides a direct link to the BrocoFlix streaming page for the selected title.' },
      { name: 'Cineby', desc: 'Provides a direct link to the Cineby streaming page for the selected title.' },
      { name: 'Moviemaze', desc: 'Provides a direct link to the Moviemaze streaming page for the selected title.' },
      { name: 'P-Stream', desc: 'Provides a direct link to the P-Stream streaming page for the selected title.' },
      { name: 'Rive', desc: 'Provides a direct link to the Rive streaming page for the selected title.' },
      { name: 'Wovie', desc: 'Provides a direct link to the Wovie streaming page for the selected title.' },
      { name: 'XPrime', desc: 'Provides a direct link to the XPrime streaming page for the selected title.' }
    ],
    DUB_INFO: { name: 'Dub Information', desc: 'Show dub information for anime shows.' },
    DUB_LANGUAGES: [
      { name: 'English', value: 'ENGLISH' },
      { name: 'German', value: 'GERMAN' },
      { name: 'Italian', value: 'ITALIAN' },
      { name: 'Spanish', value: 'SPANISH' },
      { name: 'French', value: 'FRENCH' },
      { name: 'Korean', value: 'KOREAN' },
      { name: 'Portuguese', value: 'PORTUGUESE' },
      { name: 'Hebrew', value: 'HEBREW' },
      { name: 'Hungarian', value: 'HUNGARIAN' },
      { name: 'Chinese', value: 'CHINESE' },
      { name: 'Arabic', value: 'ARABIC' },
      { name: 'Filipino', value: 'FILIPINO' },
      { name: 'Catalan', value: 'CATALAN' },
      { name: 'Polish', value: 'POLISH' },
      { name: 'Norwegian', value: 'NORWEGIAN' }
    ],
    LINK_ORDER: [
      'Official Site', 'IMDb', 'TMDB', 'TVDB', 'Rotten Tomatoes', 'Metacritic',
      'Letterboxd', 'TVmaze', 'MyAnimeList', 'AniDB', 'AniList', 'Kitsu',
      'AniSearch', 'LiveChart', 'Fanart.tv', 'Mediux', 'BrocoFlix', 'Cineby',
      'Moviemaze', 'P-Stream', 'Rive', 'Wovie', 'XPrime', 'JustWatch',
      'Wikipedia', 'Twitter', 'Facebook', 'Instagram'
    ]
  };

  const DEFAULT_CONFIG = Object.fromEntries([
    ...CONSTANTS.METADATA_SITES.map(site => [site.name, true]),
    ...CONSTANTS.STREAMING_SITES.map(site => [site.name, true]),
    [CONSTANTS.DUB_INFO.name, true],
    [CONSTANTS.DUB_LANGUAGE_KEY, 'ENGLISH']
  ]);

  class TraktExternalLinks {
    constructor() {
      this.config = { ...DEFAULT_CONFIG };
      this.mediaInfo = null;
      this.wikidata = null;
      this.armhaglund = null;
      this.anilist = null;
    }

    async init() {
      await this.loadConfig();
      this.initializeAPIs();
      this.setupEventListeners();
    }

    async loadConfig() {
      const savedConfig = GM_getValue(CONSTANTS.CONFIG_KEY);
      if (savedConfig) {
        this.config = { ...DEFAULT_CONFIG, ...savedConfig };
      }
    }

    initializeAPIs() {
      this.wikidata = new Wikidata();
      this.armhaglund = new ArmHaglund();
      this.anilist = new AniList();
    }

    setupEventListeners() {
      NodeCreationObserver.onCreation('.sidebar .external', () => this.handleExternalLinks());
      NodeCreationObserver.onCreation('body', () => this.addSettingsMenu());
      NodeCreationObserver.onCreation('.text.readmore', () => this.handleCollectionLinks());
    }

    // Extract media information from URL path and existing external links
    getMediaInfo() {
      const pathParts = location.pathname.split('/');
      const type = pathParts[1] === 'movies' ? 'movie' : 'tv';

      const imdbHref = $('#external-link-imdb').attr('href') || '';
      const imdbId = imdbHref.match(/tt\d+/)?.[0] || null;

      const tmdbHref = $('#external-link-tmdb').attr('href') || '';
      const tmdbMatch = tmdbHref.match(/\/(movie|tv)\/(\d+)/);
      const tmdbId = tmdbMatch?.[2] || null;

      const slug = pathParts[2] || '';
      const title = slug
        .split('-')
        .slice(1)
        .join('-')
        .replace(/-\d{4}$/, '');

      const seasonIndex = pathParts.indexOf('seasons');
      const episodeIndex = pathParts.indexOf('episodes');
      const season = seasonIndex > 0 ? +pathParts[seasonIndex + 1] : null;
      const episode = episodeIndex > 0 ? +pathParts[episodeIndex + 1] : null;

      return {
        type,
        imdbId,
        tmdbId,
        title,
        season: season || '1',
        episode: episode || '1',
        isSeasonPage: !!season && !episode
      };
    }

    async handleExternalLinks() {
      try {
        await this.clearExpiredCache();
        this.mediaInfo = this.getMediaInfo();

        if (this.mediaInfo.imdbId) {
          await this.processWikidataLinks();
        }

        if (this.mediaInfo.tmdbId || this.mediaInfo.imdbId) {
          this.addCustomLinks();
        }

        this.sortLinks();

        if (this.mediaInfo.anilistId) {
          this.addDubInfo();
        }
      } catch (error) {
        logger.error(`Failed handling external links: ${error.message}`);
      }
    }

    // Sort links according to predefined order, keeping unknown links at the end
    sortLinks() {
      const container = $('.sidebar .external');
      const listItem = container.find('li').first();
      const links = listItem.children('a').detach();

      const getKey = element => {
        const $element = $(element);
        const key = $element.data('site') || $element.data('original-title') || $element.text().trim();
        return key.toLowerCase();
      };

      const orderMap = new Map(
        CONSTANTS.LINK_ORDER.map((name, index) => [name.toLowerCase(), index])
      );

      const sorted = links.toArray().sort((a, b) => {
        const aKey = getKey(a);
        const bKey = getKey(b);
        const aOrder = orderMap.get(aKey) ?? Infinity;
        const bOrder = orderMap.get(bKey) ?? Infinity;

        return aOrder - bOrder;
      });

      listItem.append(sorted);
    }

    createLink(name, url) {
      const id = `external-link-${name.toLowerCase().replace(/\s/g, '-')}`;

      if (document.getElementById(id)) return;

      const linkElement = `<a target="_blank" id="${id}" href="${url}" data-original-title="" title="">${name}</a>`;
      $('.sidebar .external li').append(linkElement);
      logger.debug(`Added link: ${name} -> ${url}`);
    }

    // Fetch Wikidata links with fallback to ArmHaglund for missing anime IDs
    async processWikidataLinks() {
      const cache = GM_getValue(this.mediaInfo.imdbId);

      if (this.isCacheValid(cache)) {
        this.addWikidataLinks(cache.links);
        this.mediaInfo.anilistId = cache.links.AniList?.value.match(/\/anime\/(\d+)/)?.[1];
        return;
      }

      try {
        let data = await this.wikidata.links(this.mediaInfo.imdbId, 'IMDb', this.mediaInfo.type);

        // ArmHaglund provides better anime ID coverage than Wikidata
        if (this.needsExtraIds(data.links)) {
          await this.fetchExtraIds(data);
        }

        const hasMeaningfulData = Object.keys(data.links).length > 0 || data.item;

        if (hasMeaningfulData) {
          GM_setValue(this.mediaInfo.imdbId, {
            links: data.links,
            item: data.item,
            time: Date.now()
          });

          this.addWikidataLinks(data.links);
          this.mediaInfo.anilistId = data.links.AniList?.value.match(/\/anime\/(\d+)/)?.[1];
          logger.debug(`Fetched new Wikidata links: ${JSON.stringify(data.links)}`);
        }
      } catch (error) {
        logger.error(`Failed fetching Wikidata links: ${error.message}`);
        // Don't create empty cache entries on failure
      }
    }

    // Check if we're missing key anime database links that ArmHaglund can provide
    needsExtraIds(links) {
      const required = ['MyAnimeList', 'AniDB', 'AniList', 'Kitsu', 'AniSearch', 'LiveChart'];
      return required.some(site => !links[site]);
    }

    async fetchExtraIds(data) {
      try {
        const extensionData = await this.armhaglund.fetchIds('imdb', this.mediaInfo.imdbId);
        if (extensionData) {
          this.mergeExtraIds(data.links, extensionData);
        }
      } catch (extensionError) {
        logger.debug(`Failed to fetch from Arm Haglund: ${extensionError.message}`);
      }
    }

    // Map ArmHaglund API response keys to Wikidata link format and URLs
    mergeExtraIds(links, extensionData) {
      const URL_MAPPINGS = {
        themoviedb: (id) => `https://www.themoviedb.org/${this.mediaInfo.type === 'movie' ? 'movie' : 'tv'}/${id}`,
        thetvdb: (id) => `https://thetvdb.com/dereferrer/${this.mediaInfo.type === 'movie' ? 'movie' : 'series'}/${id}`,
        imdb: (id) => `https://www.imdb.com/title/${id}`,
        myanimelist: (id) => `https://myanimelist.net/anime/${id}`,
        anidb: (id) => `https://anidb.net/anime/${id}`,
        anilist: (id) => `https://anilist.co/anime/${id}`,
        kitsu: (id) => `https://kitsu.app/anime/${id}`,
        anisearch: (id) => `https://www.anisearch.com/anime/${id}`,
        livechart: (id) => `https://www.livechart.me/anime/${id}`
      };

      const LINK_MAPPINGS = {
        themoviedb: 'TMDB',
        thetvdb: 'TVDB',
        imdb: 'IMDb',
        myanimelist: 'MyAnimeList',
        anidb: 'AniDB',
        anilist: 'AniList',
        kitsu: 'Kitsu',
        anisearch: 'AniSearch',
        livechart: 'LiveChart'
      };

      for (const [apiKey, linkKey] of Object.entries(LINK_MAPPINGS)) {
        if (!links[linkKey] && extensionData[apiKey]) {
          links[linkKey] = { value: URL_MAPPINGS[apiKey](extensionData[apiKey]) };
        }
      }
    }

    addWikidataLinks(links) {
      const animeSites = new Set(['MyAnimeList', 'AniDB', 'AniList', 'Kitsu', 'AniSearch', 'LiveChart']);

      for (const [site, link] of Object.entries(links)) {
        if (
          site !== 'Trakt' &&
          link?.value &&
          this.config[site] !== false &&
          !this.linkExists(site) &&
          // Don't show anime sites on season pages (they're show-level only for now)
          !(this.mediaInfo.isSeasonPage && animeSites.has(site))
        ) {
          this.createLink(site, link.value);
        }
      }
    }

    // Query AniList for dub information using voice actor language filtering
    async queryAnilist(id) {
      const query = `
        query($id: Int!, $type: MediaType, $page: Int = 1, $language: StaffLanguage){
          Media(id: $id, type: $type){
            characters(page: $page, sort: [ROLE], role: MAIN){
              edges {
                node{id}
                voiceActors(language: $language){language}
              }
            }
          }
        }
      `;

      const response = await this.anilist.query(query, {
        id: parseInt(id),
        type: 'ANIME',
        language: this.config[CONSTANTS.DUB_LANGUAGE_KEY]
      });
      return response.data.Media.characters.edges;
    }

    addDubInfo() {
      if (!this.config['Dub Information'] || !this.mediaInfo?.anilistId) return;
      if (!$('.sidebar .poster').length) return;

      const cacheKey = this.mediaInfo.imdbId;
      const selectedLanguage = this.config['Dub Language'];

      const cache = GM_getValue(cacheKey);
      if (cache?.dubStatus?.[selectedLanguage] !== undefined) {
        this.displayDubInfo(cache.dubStatus[selectedLanguage]);
        return;
      }

      this.queryAnilist(this.mediaInfo.anilistId)
        .then(edges => {
          // Check if any main characters have voice actors in the selected language
          const hasDub = edges.some(edge => edge.voiceActors?.length > 0);
          const updatedCache = {
            ...cache,
            dubStatus: {
              ...cache?.dubStatus,
              [selectedLanguage]: hasDub
            }
          };
          GM_setValue(cacheKey, updatedCache);
          this.displayDubInfo(hasDub);
        })
        .catch(error => {
          logger.error(`Failed fetching AniList dub info: ${error.message}`);
          // Cache the failure to avoid repeated API calls
          const cache = GM_getValue(cacheKey);
          const updatedCache = {
            ...cache,
            dubStatus: {
              ...cache?.dubStatus,
              [selectedLanguage]: false
            }
          };
          GM_setValue(cacheKey, updatedCache);
        });
    }

    displayDubInfo(hasDub) {
      if (!hasDub) return;

      const selectedLang = CONSTANTS.DUB_LANGUAGES.find(
        lang => lang.value === this.config['Dub Language']
      );
      const langName = selectedLang?.name || 'Dub';
      const container = $('.sidebar .btn-watch-now');

      if (!container.length || $('.dubbed-info').length) return;

      const dubbedInfoHtml = `
        <div class="dubbed-info" style="
          border: 1px solid #000;
          padding: 4px;
          margin: 5px 0;
          background: transparent;
          border-radius: 4px;
          text-align: center;
        ">${langName} Dub Exists</div>
      `;

      container.after(dubbedInfoHtml);
    }

    addCustomLinks() {
      const customLinks = [
        {
          name: 'Letterboxd',
          url: () => `https://letterboxd.com/tmdb/${this.mediaInfo.tmdbId}`,
          condition: () => this.mediaInfo.type === 'movie',
          requiredData: 'tmdbId'
        },
        {
          name: 'Mediux',
          url: () => {
            const path = this.mediaInfo.type === 'movie' ? 'movies' : 'shows';
            return `https://mediux.pro/${path}/${this.mediaInfo.tmdbId}`;
          },
          requiredData: 'tmdbId'
        },
        {
          name: 'BrocoFlix',
          url: () => `https://brocoflix.com/pages/info?id=${this.mediaInfo.tmdbId}&type=${this.mediaInfo.type}`,
          requiredData: 'tmdbId'
        },
        {
          name: 'Cineby',
          url: () => {
            const show = this.mediaInfo.type === 'tv' ? `/${this.mediaInfo.season}/${this.mediaInfo.episode}` : '';
            return `https://www.cineby.app/${this.mediaInfo.type}/${this.mediaInfo.tmdbId}${show}`;
          },
          requiredData: 'tmdbId'
        },
        {
          name: 'Moviemaze',
          url: () => {
            const show = this.mediaInfo.type === 'tv' ? `?season=${this.mediaInfo.season}&ep=${this.mediaInfo.episode}` : '';
            return `https://moviemaze.cc/watch/${this.mediaInfo.type}/${this.mediaInfo.tmdbId}${show}`;
          },
          requiredData: 'tmdbId'
        },
        {
          name: 'P-Stream',
          url: () => {
            const show = this.mediaInfo.type === 'tv' ? `/${this.mediaInfo.season}/${this.mediaInfo.episode}` : '';
            return `https://iframe.pstream.mov/embed/tmdb-${this.mediaInfo.type}-${this.mediaInfo.tmdbId}${show}`;
          },
          requiredData: 'tmdbId'
        },
        {
          name: 'Rive',
          url: () => {
            const show = this.mediaInfo.type === 'tv' ? `&season=${this.mediaInfo.season}&episode=${this.mediaInfo.episode}` : '';
            return `https://rivestream.org/watch?type=${this.mediaInfo.type}&id=${this.mediaInfo.tmdbId}${show}`;
          },
          requiredData: 'tmdbId'
        },
        {
          name: 'Wovie',
          url: () => {
            const show = this.mediaInfo.type === 'tv' ? `?season=${this.mediaInfo.season}&episode=${this.mediaInfo.episode}` : '';
            return `https://wovie.vercel.app/play/${this.mediaInfo.type}/${this.mediaInfo.tmdbId}/${this.mediaInfo.title}${show}`;
          },
          requiredData: 'tmdbId'
        },
        {
          name: 'XPrime',
          url: () => {
            const show = this.mediaInfo.type === 'tv' ? `/${this.mediaInfo.season}/${this.mediaInfo.episode}` : '';
            return `https://xprime.tv/watch/${this.mediaInfo.tmdbId}${show}`;
          },
          requiredData: 'tmdbId'
        }
      ];

      for (const linkConfig of customLinks) {
        const isEnabled = this.config[linkConfig.name] !== false;
        const hasRequiredData = this.mediaInfo[linkConfig.requiredData];
        const meetsCondition = !linkConfig.condition || linkConfig.condition();
        const doesNotExist = !this.linkExists(linkConfig.name);

        if (isEnabled && hasRequiredData && meetsCondition && doesNotExist) {
          this.createLink(linkConfig.name, linkConfig.url());
        }
      }
    }

    handleCollectionLinks() {
      if (!this.config.Mediux) return;

      const tmdbCollectionLinks = $('.text.readmore a[href*="themoviedb.org/collection/"]');

      for (const element of tmdbCollectionLinks) {
        const $tmdbLink = $(element);
        const tmdbUrl = $tmdbLink.attr('href');
        const collectionIdMatch = tmdbUrl.match(/collection\/(\d+)/);

        if (!collectionIdMatch) continue;

        const collectionId = collectionIdMatch[1];
        const mediuxUrl = `https://mediux.pro/collections/${collectionId}`;

        if ($tmdbLink.next(`a[href="${mediuxUrl}"]`).length) continue;

        const mediuxLink = `<p><a href="${mediuxUrl}" target="_blank" class="comment-link">Mediux Collection</a></p>`;
        $tmdbLink.after(mediuxLink);
      }
    }

    isCacheValid(cache) {
      if (!cache) return false;
      // Bypass cache in debug mode to test fresh data
      if (logger.debugEnabled) return false;
      return (Date.now() - cache.time) < CONSTANTS.CACHE_DURATION;
    }

    linkExists(site) {
      return $(`#external-link-${site.toLowerCase().replace(/\s/g, '-')}`).length > 0;
    }

    clearExpiredCache() {
      try {
        const values = GM_listValues();
        for (const value of values) {
          if (value === CONSTANTS.CONFIG_KEY) continue;
          const cache = GM_getValue(value);
          if (cache?.time && (Date.now() - cache.time) > CONSTANTS.CACHE_DURATION) {
            GM_deleteValue(value);
          }
        }
      } catch (error) {
        logger.error(`Failed to clear expired cache: ${error.message}`);
      }
    }

    addSettingsMenu() {
      const menuItem = `<li class="${CONSTANTS.SCRIPT_ID}"><a href="javascript:void(0)" aria-haspopup="dialog">EL Settings</a></li>`;
      $('div.user-wrapper ul.menu li.divider').last().after(menuItem);
      $(`.${CONSTANTS.SCRIPT_ID}`).click(() => this.openSettingsModal());
    }

    openSettingsModal() {
      const existingModal = $(`#${CONSTANTS.SCRIPT_ID}-config`);
      if (existingModal.length) existingModal.remove();

      const modalHTML = this.generateSettingsModalHTML();
      $(modalHTML).appendTo('body');
      this.addModalStyles();
      this.setupModalEventListeners();
      $('body').css('overflow', 'hidden');
    }

    addModalStyles() {
      const id = `${CONSTANTS.SCRIPT_ID}-config`;
      const styles = `#${id}.theme-dark{--bg:#0f1720;--panel:#0b1220;--muted:#98a0ab;--accent:#5eead4;--accent-2:#60a5fa;--surface:#0c1220;--glass:rgba(255,255,255,0.03);--border:rgba(255,255,255,0.03);--text:#e6f3ef;--text-2:#eaf8f0}#${id}.theme-light{--bg:#f6f9fb;--panel:#fff;--muted:#6b7280;--accent:#0ea5a4;--accent-2:#3b82f6;--surface:#fff;--glass:rgba(0,0,0,0.04);--border:rgba(10,20,30,0.04);--text:#061426;--text-2:#0b2130}#${id}{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:99999;background:linear-gradient(180deg,rgba(4,6,8,.72),rgba(4,6,8,.9));font-family:Inter,Roboto,Arial,sans-serif}#${id} .ext-panel{width:920px;max-width:96%;max-height:92vh;border-radius:12px;overflow:hidden;display:flex;flex-direction:column;border:1px solid var(--border)}#${id}.theme-dark .ext-panel{background:linear-gradient(180deg,var(--panel),#071018);color:var(--text);box-shadow:0 10px 30px rgba(2,6,23,0.7)}#${id}.theme-light .ext-panel{background:linear-gradient(180deg,var(--panel),#f7fbff);color:var(--text);box-shadow:0 6px 18px rgba(10,15,30,0.06)}#${id} .ext-panel-header{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:20px 22px;border-bottom:1px solid var(--border)}#${id} .ext-panel-header h2{margin:0;font-size:1.25rem;color:var(--text-2)}#${id} .ext-panel-header .subtitle{margin:4px 0 0;font-size:.9rem;color:var(--muted)}#${id} .btn-icon{background:none;border:none;font-size:1.1rem;cursor:pointer;padding:6px 8px;border-radius:6px;color:var(--text)}#${id} .btn-icon:hover{background:var(--glass)}#${id} .ext-panel-body{padding:16px 18px;flex:1;overflow:auto}#${id} .settings-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}#${id} .settings-column{padding:12px;border-radius:10px;background:linear-gradient(180deg,var(--glass),transparent);border:1px solid var(--border)}#${id} .settings-column h3{margin:0 0 12px;font-size:1rem;color:var(--text-2)}#${id} .site-list{display:flex;flex-direction:column;gap:8px}#${id} .site-row{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px;border-radius:8px;transition:background .12s,transform .06s;cursor:default}#${id} .site-row:hover{background:var(--glass);transform:translateY(-1px)}#${id} .site-info{display:flex;flex-direction:column;gap:2px;flex:1;max-width:70%}#${id} .site-name{font-weight:600;color:var(--text-2)}#${id} .site-desc{font-size:.82rem;color:var(--muted)}#${id} .toggle-checkbox{position:absolute;opacity:0;pointer-events:none}#${id} .toggle-switch{width:44px;height:26px;flex-shrink:0;display:inline-block;border-radius:20px;position:relative;transition:background .18s;cursor:pointer}#${id}.theme-dark .toggle-switch{background:rgba(255,255,255,0.06);box-shadow:inset 0 0 0 1px rgba(255,255,255,0.04)}#${id}.theme-light .toggle-switch{background:rgba(0,0,0,0.06);box-shadow:inset 0 0 0 1px rgba(0,0,0,0.04)}#${id} .toggle-switch::after{content:'';position:absolute;width:18px;height:18px;border-radius:50%;top:4px;left:4px;background:#fff;transition:all .18s;box-shadow:0 3px 6px rgba(2,6,23,0.6)}#${id} .toggle-checkbox:checked+.toggle-switch{background:linear-gradient(90deg,var(--accent),var(--accent-2))}#${id} .toggle-checkbox:checked+.toggle-switch::after{transform:translateX(18px);background:var(--surface)}#${id} .dubbed-panel{grid-column:1/-1;padding:16px;border-radius:10px;background:linear-gradient(180deg,var(--glass),transparent);border:1px solid var(--border)}#${id} .dubbed-section{display:flex;align-items:flex-start;gap:20px;margin-bottom:12px}#${id} .dubbed-toggle-wrapper{display:flex;align-items:center;gap:12px;min-width:220px}#${id} .dubbed-toggle-wrapper .toggle-switch{flex-shrink:0}#${id} .dubbed-toggle-label{display:flex;flex-direction:column;gap:2px;cursor:pointer}#${id} .dubbed-toggle-label .label-text{font-weight:600;font-size:.95rem;color:var(--text-2)}#${id} .dubbed-toggle-label .label-desc{font-size:.78rem;color:var(--muted)}#${id} .dubbed-lang-wrapper{display:flex;flex-direction:column;gap:6px;flex:1}#${id} .select-label{font-size:.85rem;font-weight:600;color:var(--text-2)}#${id} .select{padding:8px 10px;border-radius:8px;background:var(--surface);border:1px solid var(--border);color:var(--text);font-size:.95rem;cursor:pointer;outline:none}#${id}.theme-dark .select{background:#08111a}#${id}.theme-light .select{background:#f3f7fb}#${id} .ext-panel-footer{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:14px 18px;border-top:1px solid var(--border)}#${id} .footer-left{display:flex;gap:8px}#${id} .footer-right{display:flex;gap:8px}#${id} .btn{padding:10px 14px;border-radius:10px;background:transparent;border:1px solid var(--border);cursor:pointer;font-weight:600;font-size:.9rem;color:var(--text);transition:background .15s,transform .08s}#${id} .btn:hover{background:var(--glass);transform:translateY(-1px)}#${id} .btn.ghost{background:transparent}#${id} .btn.primary{background:linear-gradient(90deg,var(--accent),var(--accent-2));border:none}#${id}.theme-dark .btn.primary{color:#041014}#${id}.theme-light .btn.primary{color:#fff}@media (max-width:850px){#${id} .settings-grid{grid-template-columns:1fr}#${id} .site-info{max-width:58%}#${id} .dubbed-section{flex-direction:column;gap:12px}}`;
      $('<style>').prop('type', 'text/css').html(styles).appendTo('head');
    }

    generateSettingsModalHTML() {
      const isDark = $('body').hasClass('dark-knight');
      const themeClass = isDark ? 'theme-dark' : 'theme-light';

      return `
        <div id="${CONSTANTS.SCRIPT_ID}-config" class="${themeClass}">
          <div class="ext-panel">
            <div class="ext-panel-header">
              <div>
                <h2>${CONSTANTS.TITLE}</h2>
                <div class="subtitle">Configure external links and dub detection</div>
              </div>
              <button class="btn-icon close" aria-label="Close">&times;</button>
            </div>

            <div class="ext-panel-body">
              <div class="settings-grid">
                <div class="settings-column">
                  <h3>Metadata Sites</h3>
                  <div class="site-list">
                    ${CONSTANTS.METADATA_SITES.map(site => `
                      <div class="site-row" data-site-name="${site.name.toLowerCase()}">
                        <div class="site-info">
                          <div class="site-name">${site.name}</div>
                          <div class="site-desc">${site.desc}</div>
                        </div>
                        <input type="checkbox" class="toggle-checkbox" id="${site.name.toLowerCase().replace(/\s+/g, '_')}" ${this.config[site.name] ? 'checked' : ''}>
                        <label class="toggle-switch" for="${site.name.toLowerCase().replace(/\s+/g, '_')}"></label>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <div class="settings-column">
                  <h3>Streaming Sites</h3>
                  <div class="site-list">
                    ${CONSTANTS.STREAMING_SITES.map(site => `
                      <div class="site-row" data-site-name="${site.name.toLowerCase()}">
                        <div class="site-info">
                          <div class="site-name">${site.name}</div>
                          <div class="site-desc">${site.desc}</div>
                        </div>
                        <input type="checkbox" class="toggle-checkbox" id="${site.name.toLowerCase().replace(/\s+/g, '_')}" ${this.config[site.name] ? 'checked' : ''}>
                        <label class="toggle-switch" for="${site.name.toLowerCase().replace(/\s+/g, '_')}"></label>
                      </div>
                    `).join('')}
                  </div>
                </div>

                 <div class="dubbed-panel">
                   <div class="dubbed-section">
                     <div class="dubbed-toggle-wrapper">
                       <input type="checkbox" class="toggle-checkbox" id="dub_information" ${this.config[CONSTANTS.DUB_INFO.name] ? 'checked' : ''}>
                       <label class="toggle-switch" for="dub_information"></label>
                       <label class="dubbed-toggle-label" for="dub_information">
                         <span class="label-text">${CONSTANTS.DUB_INFO.name}</span>
                         <span class="label-desc">${CONSTANTS.DUB_INFO.desc}</span>
                       </label>
                     </div>
                     <div class="dubbed-lang-wrapper">
                       <label class="select-label" for="dub_language">Dub Language</label>
                       <select id="dub_language" class="select">
                         ${CONSTANTS.DUB_LANGUAGES.map(lang => `<option value="${lang.value}" ${this.config['Dub Language'] === lang.value ? 'selected' : ''}>${lang.name}</option>`).join('')}
                       </select>
                     </div>
                   </div>
                 </div>
              </div>
            </div>

            <div class="ext-panel-footer">
              <div class="footer-left">
                <button class="btn ghost" id="reset-defaults">Reset to Defaults</button>
                <button class="btn ghost" id="clear-cache">Clear Cache</button>
              </div>
              <div class="footer-right">
                <button class="btn primary" id="save-reload">Save & Reload</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    setupModalEventListeners() {
      const modalSelector = `#${CONSTANTS.SCRIPT_ID}-config`;
      const $modal = $(modalSelector);

      $modal.find('button.close').on('click', () => this.closeModal());

      $(document).on('keydown.extLinksSettings', (keyboardEvent) => {
        if (keyboardEvent.key === 'Escape') this.closeModal();
      });

      $modal.find('#reset-defaults').on('click', () => {
        if (!confirm('Reset all settings to defaults?')) return;
        this.config = { ...DEFAULT_CONFIG };
        this.refreshModalValues();
      });

      $modal.find('#clear-cache').on('click', () => {
        try {
          const values = GM_listValues();
          for (const value of values) {
            if (value !== CONSTANTS.CONFIG_KEY) {
              GM_deleteValue(value);
            }
          }
          alert('Cache cleared successfully.');
        } catch (error) {
          logger.error(`Failed to clear cache: ${error.message}`);
          alert('Failed to clear cache. Check console for details.');
        }
      });

      $modal.find('#save-reload').on('click', () => {
        try {
          this.saveSettingsFromModal();
          this.closeModal();
          window.location.reload();
        } catch (error) {
          logger.error(`Failed to save settings: ${error.message}`);
          alert('Failed to save settings. Check console for details.');
        }
      });
    }

    closeModal() {
      const modalSelector = `#${CONSTANTS.SCRIPT_ID}-config`;
      $(modalSelector).remove();
      $('body').css('overflow', '');
      $(document).off('keydown.extLinksSettings');
    }

    refreshModalValues() {
      const modalSelector = `#${CONSTANTS.SCRIPT_ID}-config`;
      const $modal = $(modalSelector);
      const allSites = [...CONSTANTS.METADATA_SITES, ...CONSTANTS.STREAMING_SITES, CONSTANTS.DUB_INFO];

      for (const site of allSites) {
        const checkboxId = site.name.toLowerCase().replace(/\s+/g, '_');
        $modal.find(`#${checkboxId}`).prop('checked', !!this.config[site.name]);
      }

      $modal.find('#dub_language').val(this.config['Dub Language']);
    }

    saveSettingsFromModal() {
      const modalSelector = `#${CONSTANTS.SCRIPT_ID}-config`;
      const $modal = $(modalSelector);
      const allSites = [...CONSTANTS.METADATA_SITES, ...CONSTANTS.STREAMING_SITES, CONSTANTS.DUB_INFO];

      for (const site of allSites) {
        const checkboxId = site.name.toLowerCase().replace(/\s+/g, '_');
        this.config[site.name] = $modal.find(`#${checkboxId}`).is(':checked');
      }

      this.config['Dub Language'] = $modal.find('#dub_language').val();
      GM_setValue(CONSTANTS.CONFIG_KEY, this.config);
      logger.debug('Settings saved', this.config);
    }
  }

  $(document).ready(async () => {
    const traktLinks = new TraktExternalLinks();
    await traktLinks.init();
  });
})();
