// ==UserScript==
// @name         SteamGifts: ProtonDB info
// @description  Add game info from ProtonDB to the games on SteamGifts.
// @author       Xeloses
// @version      1.0.0.5
// @copyright    Copyright (C) 2021-2022, by Xeloses
// @license      GPL-3.0 (https://www.gnu.org/licenses/gpl-3.0.html)
// @namespace    Xeloses.SG.ProtonDB.GameInfo
// @website      https://github.com/Xeloses/sg-protondb-info
// @icon         https://www.google.com/s2/favicons?sz=32&domain=steamgifts.com
// @match        https://steamgifts.com/*
// @match        https://www.steamgifts.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      www.protondb.com
// @connect      store.steampowered.com
// @noframes
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/457074/SteamGifts%3A%20ProtonDB%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/457074/SteamGifts%3A%20ProtonDB%20info.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(!location.hostname.endsWith('steamgifts.com')) return;

    /*
     * @const URLs & WebAPI endpoint templatess.
     */
    const URL = {
        API: {
            ProtonDB: 'https://www.protondb.com/api/v1/reports/summaries/{%appid%}.json',
            Steam: {
                Game: 'https://store.steampowered.com/api/appdetails?appids={%appid%}',
                Package: 'https://store.steampowered.com/api/packagedetails?packageids={%appid%}'
            }
        },
        GamePage: {
            ProtonDB: 'https://www.protondb.com/app/{%appid%}'
        }
    }

    /*
     * @const ProtonDB game tiers.
     */
    const ProtonDB_Tier = [
        /* 0 */ { name: 'unknown', displayName: 'Unknown', comment: 'ProtonDB does not have reports about this game.', icon: 'fa-question-circle', color: '#777' },
        /* 1 */ { name: 'platinum', displayName: 'Platinum', comment: 'Game works perfectly out of the box.', icon: 'fa-thumbs-up', color: '#def' },
        /* 2 */ { name: 'gold', displayName: 'Gold', comment: 'Game works good. May require little tweaks.', icon: 'fa-star', color: '#fd5' },
        /* 3 */ { name: 'silver', displayName: 'Silver', comment: 'Game works with minor issues, but generally is playable.', icon: 'fa-star-half-o', color: '#ddd' },
        /* 4 */ { name: 'bronze', displayName: 'Bronze', comment: 'Game works, but has issues preventing from playing comfortably.', icon: 'fa-star-o', color: '#fa5' },
        /* 5 */ { name: 'borked', displayName: 'Borked', comment: 'Game won’t start or is crucially unplayable.', icon: 'fa-thumbs-down', color: '#f99' },
        /* 6 */ { name: 'pending', displayName: 'Pending', comment: 'ProtonDB awaiting further reports before giving a rating.', icon: 'fa-hourglass-end', color: '#b5b5b5' },
        /* 7 */ { name: 'native', displayName: 'Native', comment: 'Game runs natively on Linux!', icon: 'fa-check-circle-o', color: '#1e1' }
    ];

    /*
     * @const SteamGifts pages to be processed by script with CSS selectors for those pages.
     */
    const SG = {
        /* Pages matching full address (without domain) */
        Pages: {
            '/': '.giveaway__row-outer-wrap', // SG homepage
            '/giveaways': '.giveaway__row-outer-wrap', // SG homepage
            '/giveaways/search': '.giveaway__row-outer-wrap', // Giveaways search
            '/search/giveaways': '.giveaway__row-outer-wrap', // Giveaways search
            '/giveaways/entered': '.table__row-outer-wrap' // Entered giveaways
        },
        /* Pages matching beginning part of address (without domain) */
        PagesMask: {
            '/giveaway/': '.featured__outer-wrap' // Giveaway page
        },
        /* Pages matching address by RegExp (without domain) */
        PagesRegex: {
            '^\\/user\\/[^\\/]+$': '.giveaway__row-outer-wrap', // User' giveaways
            '^\\/group\\/[\\w]{5}\\/[^\\/]+$': '.giveaway__row-outer-wrap' // Group' giveaways
        }
    };

    /*
     * @const Cache lifetime.
     */
    const cache_lifetime = 7 /* days */ * 86400000;

    /*
     * @var Flag indicates games list was updated.
     */
    let updated = false;

    /*
     * @var Requests counter.
     */
    const count_requests = {
            protondb: 0,
            steam: 0
        };

    /*
     * @class     XelLog
     * @classdesc Console API wrapper.
     *
     * @property {String} app
     * @property {String} version
     * @property {String} ns
     * @property {String} author
     * @method log({String} message)
     * @method info({String} message)
     * @method warn({String} message)
     * @method error({String} message)
     */
    class XelLog{constructor(){let d=GM_info.script;this.author=d.author;this.app=d.name;this.ns=d.namespace;this.version=d.version;this.h='color:#c5c;font-weight:bold;';this.t='color:#ddd;font-weight:normal;';}log(s){console.log('%c['+this.app+']%c '+s,this.h,this.t)}info(s){console.info('%c['+this.app+']%c '+s,this.h,this.t+'font-style:italic;')}warn(s){console.warn('%c['+this.app+']%c '+s,this.h,this.t)}error(s){console.error('%c['+this.app+']%c '+s,this.h,this.t)}}
    const LOG = new XelLog();

    /*
     * @class     XelUserscriptStorage
     * @classdesc Userscript storage API wrapper.
     *
     * @method has({String} name)
     * @method get({String} name)
     * @method add({String} name, {Mixed} value)
     * @method set({String} name, {Mixed} value)
     * @method empty()
     * @method clear()
     * @method load()
     * @method save()
     * @method on({String} event, {Function} callback)
     */
    class XelUserscriptStorage
    {
        constructor(name){ if(!name || !name.trim().length) throw new Error('XelUserscriptStorage error: could not create object instance with empty "name".'); this.name = name.trim(); this._e = {}; this._d = null; this.load(); }
        load(){ try{ let data = JSON.parse(GM_getValue(this.name, [])); this._d = new Map( data ? data : [] ); }catch(e){ this._d = new Map(); } this._trigger('load'); return this; }
        save(){ if(this._d) GM_setValue(this.name, JSON.stringify(Array.from(this._d))); this._trigger('save'); return this; }
        has(name){ return this._d.has(name); }
        get(name){ return this._d.has(name) ? this._d.get(name) : null; }
        add(name,value){ return this.set(name,value); }
        set(name,value){ this._d.set(name,value); return this; }
        clear(){ this._d = new Map(); return this.save(); }
        count(){ return (this._d) ? this._d.size : 0; }
        empty(){ return this.count() > 0; }
        on(name, callback){ if(!this._e[name]) this._e[name] = []; this._e[name].push(callback); return this; }
        _trigger(name, data){ if(!this._e[name] || !this._e[name].length) return;this._e[name].forEach(callback => callback(data));return this; }
    }
    const CACHE = new XelUserscriptStorage('cache'),
          PackagesData = new XelUserscriptStorage('packages');

    /**
     * Fetch implementation for Usescripts.
     */
    function _fetch(url, options = null){ const defaults = { method: 'GET', response_type: 'json', anonymous: true, nocache: true, console_errors: false }, $xhr = (typeof GM.xmlhttpRequest !== 'undefined') ? GM.xmlhttpRequest : GM_xmlhttpRequest; options = options ? {...defaults, ...options} : defaults; return new Promise((resolve,reject) => { $xhr({ method: options.method, url: url, anonymous: options.anonymous, nocache: options.nocache, responseType: options.response_type, onload:function(response){ if(response.status && response.status == 200) { if(response.response && response.response.length) resolve(response.response); else if(response.responseText && response.responseText.length){ if(options.response_type == 'json') try{ resolve(JSON.parse(response.responseText)); }catch(err){ reject(err); }else resolve(response.responseText); }else reject(new Error(response.statusText));}else reject(new Error((response.status ? response.status + ' ' : '') + response.statusText)); }, onerror:function(response){ reject(new Error((response.status ? response.status + ' ' : '') + response.statusText)); }})}).catch(err => { if(options.console_errors) console.error('[Error] Fetch failed on "' + url + "\".\n" + err.message); }); }

    /**
     * Sleep (delay) implementation.
     */
    async function _sleep(t){ return new Promise(f => setTimeout(f, t+1)); }

    /**
     * Returns index for specified tier.
     *
     * @param  {String}  tier
     * @return {Integer}
     */
    function tierIndex(tier)
    {
        for(let i = 0; i < ProtonDB_Tier.length; i++) if(ProtonDB_Tier[i].name == tier) return i;
    }

    /**
     * Wait for page loading/processing.
     *
     * @param  {String}  sel  CSS selector of element to wait for
     * @return {Promise}      empty Promise
     */
    async function waitPageLoading(sel)
    {
        while(true)
        {
            if(document.querySelector(sel)) break;
            await _sleep(330);
        }
    }

    /**
     * Inject CSS.
     *
     * @return {Void}
     */
    function injectCSS()
    {
        let css = `.protondb_info > .fa, .protondb_info > span {color: inherit !important; font-weight: bold;}
                   .protondb_info:not(.protondb_tier_unknown) > .fa, .protondb_info:not(.protondb_tier_unknown) > span {text-shadow: 1px 0 1px #555, 0 1px 1px #555, -1px 0 1px #555, 0 -1px 1px #555;}
                   .protondb_info > span {display: inline-block; margin: 0 5px 0 3px;}
                   .protondb_info .protondb_tooltip {display: none; position: absolute; margin: 20px 0 0 -3px; padding: 5px 10px; line-height: 1rem; color: #eee; background: rgba(1,1,1,.8); border: solid 1px #555; border-radius: 5px; white-space: pre-line; text-shadow: none; z-index: 990;}
                   .giveaway__row-inner-wrap:not(.is-faded) .protondb_info:hover .protondb_tooltip, .table__row-inner-wrap .protondb_info:hover .protondb_tooltip, .featured__container .protondb_info:hover .protondb_tooltip {display: block;}
                   .protondb_tooltip * {display: block;}
                   .protondb_tooltip span {font-weight: bold; border-bottom: dotted 1px;}
                   .protondb_tooltip dl {margin: 5px 10px; font-family: sans-serif;}
                   .protondb_tooltip dt {float: left; clear: left; margin-right: 5px;}
                   .protondb_tooltip dd {font-weight: bold;}
                   .protondb_tooltip p {font-weight: bold;}
                   .protondb_tooltip small {margin-top: 5px; font-size: .75rem; font-style: italic;}
                   .giveaway__row-outer-wrap .giveaway__links a {margin-right: 10px;} /* initial SG style fix */
                   .featured__container .protondb_info {float: left; order: -999; margin-right: 5px; border: dashed 1px #555;}
                   .featured__container .protondb_tooltip {margin: 30px 0 0 -10px;}
                   .table__row-outer-wrap .protondb_info {margin-right: 7px; line-height: 1.2rem;}
                   .table__row-outer-wrap .protondb_tooltip {margin: 3px 0 0 -2px;}
                   [data-darkreader-scheme="dark"] .protondb_info .protondb_tooltip {background: rgba(1,1,1,.85);} /* DarkReader compatibility */
                   [data-darkreader-scheme="dark"] .protondb_info > * {text-shadow: none !important;} /* DarkReader compatibility */`;

        for(const tier in ProtonDB_Tier)
        {
            const sel = `.protondb_tier_${ProtonDB_Tier[tier].name}`;
            if(ProtonDB_Tier[tier].color) css += `\n${sel}{color: ${ProtonDB_Tier[tier].color};}\n${sel} .protondb_tier_color {color: ${ProtonDB_Tier[tier].color} !important;}`;
        }

        const el = document.createElement('STYLE');
        el.type = 'text/css';
        el.id = GM_info.script.namespace.toLowerCase().replace('.','-');
        el.innerText = css.replace(/[\s]{2,}/g,' ');
        document.head.appendChild(el);
    }

    /**
     * Render game info.
     *
     * @param  {String}     id      AppID of the game
     * @param  {String}     species Type of product, can be "app" (for single game) or "sub" (for package)
     * @param  {Object}     data    Object: { tier: {String}, score: {?Float}, count: {?Integer} }
     * @param  {DomElement} game
     * @return {Void}
     */
    function renderGameInfo(id, species, data, game)
    {
        const el = document.createElement('A');

        if(species == 'sub' && PackagesData.has(id)) id = PackagesData.get(id);

        const tooltip = `<div class="protondb_tooltip">
                           <span>ProtonDB report:</span>
                           <dl>
                             <dt>Game tier:</dt><dd class="protondb_tier_color">${ProtonDB_Tier[data.tier].name}</dd>
                             ${data.recent ? '<dt>Recent tier:</dt><dd class="protondb_tier_' + ProtonDB_Tier[data.recent].name + '">' + ProtonDB_Tier[data.recent].name + '</dd>' : ''}
                             ${data.preTier ? '<dt>Provisional tier:</dt><dd class="protondb_tier_' + ProtonDB_Tier[data.preTier].name + '">' + ProtonDB_Tier[data.preTier].name + '</dd>' : ''}
                             ${data.score ? '<dt>Score:</dt><dd>' + Math.round(parseFloat(data.score) * 100) + '%</dd>' : ''}
                           </dl>
                           <p class="protondb_tier_color">${ProtonDB_Tier[data.tier].comment}</p>
                           ${(data.count ? '<small>Based on ' + data.count + ' player report(s).</small>' : '')}
                       </div>`;

        el.href = URL.GamePage.ProtonDB.replace('{%appid%}', id);
        el.target = '_blank';
        el.rel = 'nofollow noopener';
        el.classList.add('protondb_info', `protondb_tier_${ProtonDB_Tier[data.tier].name}`);

        el.innerHTML = `${tooltip.replace(/[\s]{2,}/g,' ')}<i class="fa fa-linux"></i><span>${ProtonDB_Tier[data.tier].displayName}</span>${ProtonDB_Tier[data.tier].icon ? '<i class="fa ' + ProtonDB_Tier[data.tier].icon + '"></i>' : ''}`;

        if(game.classList.contains('featured__outer-wrap')) el.classList.add('featured__column');

        game.querySelector('.giveaway__links > a:last-of-type, .featured__columns > .featured__column:first-of-type')?.insertAdjacentElement('afterend', el) ||
        game.querySelector('.table__column--width-fill > p:last-of-type > *:first-child')?.insertAdjacentElement('beforebegin', el);
    }

    /**
     * Store game in the cache.
     *
     * @param  {String}  id    AppID of the game
     * @param  {Object}  data
     * @return {Object}
     */
    function _cache(id, data)
    {
        data.t = Date.now();
        CACHE.add(id, data);
        updated = true;
        return data;
    }

    /**
     * Get game tier from ProtonDB and/or Steam WebAPI.
     *
     * @param  {String}  id  AppID of the game
     * @return {Promise}
     */
    async function loadGameInfo(id)
    {
        await _sleep(330); // wait 330ms (0.33s) to prevent spamming requests

        let data = null,
            r = await _fetch(URL.API.ProtonDB.replace('{%appid%}', id));

        count_requests.protondb++;

        if(!r || !r.tier)
        {
            r = await _fetch(URL.API.Steam.Game.replace('{%appid%}', id));
            count_requests.steam++;
            data = { tier: (r && r[id] && r[id].success && r[id].data.platforms && r[id].data.platforms.linux) ? tierIndex('native') : tierIndex('unknown') } ;
        }
        else
        {
            data = {
                tier: tierIndex(r.tier),
                preTier: tierIndex(r.provisionalTier),
                score: r.score,
                count: r.total
            };

            if(r.trendingTier && r.trendingTier != r.tier && r.trendingTier != 'pending') data.recent = tierIndex(r.trendingTier);
            if(r.provisionalTier && r.tier == 'pending') data.preTier = tierIndex(r.provisionalTier);
        }

        return _cache(id, data);
    }

    /**
     * Get package info from Steam WebAPI.
     *
     * @param  {String}  id  SubID of the package
     * @return {Promise}
     */
    async function loadPackageInfo(id)
    {
        let data = null;

        if(PackagesData.has(id))
        {
            const gid = PackagesData.get(id);
            if(CACHE.has(gid)) return CACHE.get(gid);

            data = await loadGameInfo(gid);
        }
        else
        {
            await _sleep(330); // wait 330ms (0.33s) to prevent spamming requests

            const r = await _fetch(URL.API.Steam.Package.replace('{%appid%}', id));
            count_requests.steam++;

            if(!r || !r[id] || !r[id].success)
            {
                data = { tier: tierIndex('unknown') };
            }
            else if(r[id].data.platforms && r[id].data.platforms.linux)
            {
                data = { tier: tierIndex('native') };
            }
            else
            {
                const ids = r[id].data.apps.map(item => item.id),
                      gid = Math.min(...ids); // get lowest AppID in package -> it should be base game

                PackagesData.add(id, gid).save();

                if(CACHE.has(gid)) return CACHE.get(gid);

                data = await loadGameInfo(gid);
            }
        }

        return _cache(id, data);
    }

    /**
     * Process single game.
     *
     * @param  {DomElement} el
     * @return {Promise}
     */
    async function processGame(el)
    {
        const a = el.querySelector('a[href^="https://store.steampowered.com/"], a[href^="http://store.steampowered.com/"], a[style*="akamaihd.net/steam/apps/"]');
        if(!a) return;

        let [_, species, id] = (a.href.includes('/giveaway/') ? a.style.backgroundImage : a.href).match(/\/(apps?|subs?)\/([\d]+)/i),
            data = null;
        species = species.substr(0,3);

        if(CACHE.has(id))
        {
            data = CACHE.get(id);
            if((Date.now() - data.t) > cache_lifetime) data = null;
        }

        if(!data) data = ( species == 'app' ? await loadGameInfo(id) : await loadPackageInfo(id));

        el.dataset.appid = id;
        renderGameInfo(id, species, data, el);
    }

    /**
     * Process list of games.
     *
     * @param  {String}  sel  CSS selector
     * @return {Promise}
     */
    async function processList(sel)
    {
        await waitPageLoading(`${sel} a[href^="https://store.steampowered.com/"], ${sel} a[href^="http://store.steampowered.com/"], ${sel} a[style*="akamaihd.net/steam/apps/"]`);

        for(const game of document.querySelectorAll(sel))
        {
            await processGame(game);
        }

        if(updated) CACHE.save();
        LOG.info(`Job completed. Requests to ProtonDB: ${count_requests.protondb}, to Steam: ${count_requests.steam} (games in the cache: ${CACHE.count()}).`);
    }

    /**
     * Main entry point.
     *
     * @param  {String}  sel  CSS selector
     * @return {Void}
     */
    function process(sel)
    {
        injectCSS();
        LOG.info(`App loaded (version: ${LOG.version})`);
        processList(sel);
    }

    /*
     * Main section.
     */
    for(const page in SG.Pages) if(location.pathname == page) return process(SG.Pages[page]);
    for(const page in SG.PagesMask) if(location.pathname.startsWith(page)) return process(SG.PagesMask[page]);
    for(const page in SG.PagesRegex) if((new RegExp(page)).test(location.pathname)) return process(SG.PagesRegex[page]);
})();
