// ==UserScript==
// @name         BiOMA Linker
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  Identifica filmes/séries nos serviços de streaming e fornece links para TMDb, IMDb, TVDb e outros.
// @author       BiOMA
// @match        *://*.primevideo.com/*
// @match        *://*.netflix.com/*
// @match        *://*.play.hbomax.com/*
// @match        *://*.disneyplus.com/*
// @match        *://*.tv.apple.com/*
// @match        *://*.paramountplus.com/*
// @match        *://*.crunchyroll.com/*
// @match        *://*.globoplay.globo.com/*
// @match        *://*.kocowa.com/*
// @match        *://*.viki.com/*
// @match        *://*.mais.sbt.com.br/*
// @match        *://*.play.mercadolivre.com.br/*
// @match        *://*.iq.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @resource     googleFontsCSS https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap
// @resource     iconIMG https://predb.031034.xyz/favicon.ico
// @icon         https://predb.031034.xyz/favicon.ico
// @connect      finder.drmfusion.xyz
// @connect      api.themoviedb.org
// @connect      image.tmdb.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536542/BiOMA%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/536542/BiOMA%20Linker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.__BiOMA_Linker_Initialized) {
        console.warn('BiOMA Linker já inicializado. Ignorando múltiplas execuções.');
        return;
    }
    window.__BiOMA_Linker_Initialized = true;

    const CONFIG = {
        DEFAULT_LANG: 'pt-BR',
        DEFAULT_POS: {
            bottom: '20px',
            right: '20px',
            top: 'auto',
            left: 'auto'
        },
        CACHE_LIMIT: 100,
        CACHE_TTL: 7 * 24 * 60 * 60 * 1000,
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1500,
        SEARCH_TIMEOUT: 20000,
        DEBOUNCE_DELAY: 1500,
        RATE_LIMIT_REQUESTS: 15,
        RATE_LIMIT_WINDOW: 60000,
        CACHE_SAVE_DELAY: 2000,
        TMDB_API_BASE: 'https://api.themoviedb.org/3',
        TMDB_IMAGE_BASE: 'https://image.tmdb.org/t/p/w300',
        TMDB_WEB_BASE: 'https://www.themoviedb.org',
        IMDB_BASE: 'https://www.imdb.com/title',
        TVDB_API_BASE: 'https://api4.thetvdb.com/v4',
        TVDB_BASE: 'https://www.thetvdb.com/?tab=series&id',
    };

    function defaultCustomCodeVT() {
        return 'poetry run vt dl {{url}}';
    }

    function defaultCustomCodeUA() {
        return '-imdb {{imdb_id}} -tmdb {{mediaType}}/{{tmdb_id}} -tvdb {{tvdb_id}}';
    }

    class Logger {
        constructor() {
            this.isDebug = GM_getValue('debugMode', false);
        }
        updateDebugMode() {
            this.isDebug = GM_getValue('debugMode', false);
        }
        _log(level, message, data = null) {
            const timestamp = new Date().toLocaleTimeString('pt-BR', {
                hour12: false
            });
            let prefix = `[BiOMA Linker] ${timestamp}`;
            let logMethod;
            switch (level) {
                case 'warn':
                    logMethod = console.warn;
                    break;
                case 'error':
                    logMethod = console.error;
                    break;
                case 'debug':
                    if (!this.isDebug) return;
                    prefix += ` [DEBUG]`;
                    logMethod = console.log;
                    break;
                default:
                    logMethod = console.log;
            }
            if (data !== null && (typeof data === 'object' || Array.isArray(data))) {
                logMethod(`${prefix} ${message}`, JSON.parse(JSON.stringify(data)));
            } else if (data !== null) {
                logMethod(`${prefix} ${message}`, data);
            } else {
                logMethod(`${prefix} ${message}`);
            }
        }
        info(message, data) {
            this._log('info', message, data);
        }
        warn(message, data) {
            this._log('warn', message, data);
        }
        error(message, data) {
            this._log('error', message, data);
        }
        debug(category, message, data) {
            this._log('debug', `[${category.toUpperCase()}] ${message}`, data);
        }
    }

    const logger = new Logger();

    class Utils {
        static debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
        static async delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        static sanitizeInput(input) {
            if (typeof input !== 'string') return '';
            const div = document.createElement('div');
            div.textContent = input;
            return div.innerHTML;
        }
        static isValidUrl(url) {
            try {
                const parsed = new URL(url);
                return ['http:', 'https:'].includes(parsed.protocol);
            } catch {
                return false;
            }
        }
        static extractYear(text) {
            if (!text) return null;
            const yearMatch = text.match(/\b(19\d{2}|20\d{2})\b/) || text.match(/\((\d{4})\)/);
            return yearMatch ? (yearMatch[1] || yearMatch[0].replace(/\D/g, '')) : null;
        }
        static cleanTitle(title) {
            if (!title) return '';
            return title.replace(/\s*\(\d{4}\)\s*$/, '').replace(/\s*\b(19\d{2}|20\d{2})\b\s*$/, '').replace(/^(Assistindo:|Watch:|Ver:|Assistir:|Playing:)\s*/i, '').replace(/\s*[-—]?\s*(Season|Temporada)\s*\d+(\s*:\s*Episode\s*\d+)?/i, '').replace(/\s*[-—]?\s*S\d+E\d+/i, '').replace(/\s*[-—]?\s*T\d+E\d+/i, '').replace(/\s*\(Capa\)\s*$/, '').trim().replace(/\s+/g, ' ');
        }
        static normalizeTitle(title) {
            if (!title) return '';
            return title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
        }
        static titleSimilarity(title1, title2) {
            const norm1 = this.normalizeTitle(title1);
            const norm2 = this.normalizeTitle(title2);
            if (norm1 === norm2) return 1;
            if (norm1.includes(norm2) || norm2.includes(norm1)) return 0.8;
            const words1 = new Set(norm1.split(' ').filter(w => w.length > 2));
            const words2 = new Set(norm2.split(' ').filter(w => w.length > 2));
            if (words1.size === 0 || words2.size === 0) return 0;
            const intersection = new Set([...words1].filter(x => words2.has(x)));
            const union = new Set([...words1, ...words2]);
            return intersection.size / union.size;
        }
    }

    class EventBus {
        constructor() {
            this.events = new Map();
        }
        on(event, callback) {
            if (!this.events.has(event)) this.events.set(event, []);
            this.events.get(event).push(callback);
        }
        emit(event, data) {
            if (!this.events.has(event)) return;
            this.events.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    logger.error(`Erro no handler do evento ${event}:`, error);
                }
            });
        }
    }

    class TMDBService {
        constructor(apiKey, language, cache, rateLimiter) {
            this.apiKey = apiKey;
            this.language = language;
            this.cache = cache;
            this.rateLimiter = rateLimiter;
            this.baseUrl = CONFIG.TMDB_API_BASE;
        }
        async search(mediaInfo) {
            const cacheKey = this.generateCacheKey(mediaInfo);
            if (this.cache.isCacheEnabled()) {
                const cached = this.cache.get(cacheKey);
                if (cached) {
                    logger.info(`[CACHE] Cache hit: ${cacheKey}`);
                    return cached;
                }
            }
            if (!this.rateLimiter.canMakeRequest()) throw new Error(`Rate limit. Aguarde ${Math.ceil(this.rateLimiter.getRemainingTime() / 1000)}s.`);
            try {
                let result = await this.performSearch(mediaInfo);
                if ((!result || result.matchScore < 0.7) && mediaInfo.year) {
                    logger.info('Busca primária falhou ou score baixo. Tentando sem o ano...');
                    const noYearRes = await this.performSearch({
                        ...mediaInfo,
                        year: null
                    });
                    if (noYearRes && (!result || noYearRes.matchScore > result.matchScore)) result = noYearRes;
                }
                if ((!result || result.matchScore < 0.6) && GM_getValue('fuzzySearch', true)) {
                    logger.info('Ainda sem resultado satisfatório. Tentando busca ampla...');
                    const broadRes = await this.performBroadSearch(mediaInfo);
                    if (broadRes && (!result || broadRes.matchScore > result.matchScore)) result = broadRes;
                }
                if (result?.id && this.cache.isCacheEnabled()) this.cache.set(cacheKey, result);
                return result;
            } catch (error) {
                logger.error('Erro na busca principal do TMDb:', error);
                throw error;
            }
        }
        async performSearch(mediaInfo, attempt = 1) {
            const endpoint = this.determineEndpoint(mediaInfo);
            const params = new URLSearchParams({
                api_key: this.apiKey,
                language: this.language,
                query: mediaInfo.title
            });
            if (mediaInfo.year && endpoint !== 'multi') params.append(endpoint === 'movie' ? 'year' : 'first_air_date_year', mediaInfo.year);
            const url = `${this.baseUrl}/search/${endpoint}?${params}`;
            logger.debug('API', `Busca TMDb (tentativa ${attempt}): ${url}`);
            try {
                const resp = await this.makeRequest(url);
                const data = JSON.parse(resp.responseText);
                logger.debug('API', 'Resultados recebidos:', {
                    total: data.total_results,
                    preview: data.results?.slice(0, 3).map(r => ({
                        t: r.title || r.name,
                        y: (r.release_date || r.first_air_date || '').substring(0, 4)
                    }))
                });
                return data.results?.length ? this.selectBestResult(data.results, mediaInfo) : null;
            } catch (error) {
                if (attempt < CONFIG.RETRY_ATTEMPTS && error.message.includes('Timeout')) {
                    logger.warn(`Timeout na busca (tentativa ${attempt}), tentando novamente...`);
                    await Utils.delay(CONFIG.RETRY_DELAY * attempt);
                    return this.performSearch(mediaInfo, attempt + 1);
                }
                throw error;
            }
        }
        async performBroadSearch(mediaInfo) {
            const kws = mediaInfo.title.split(' ').filter(w => w.length > 2).slice(0, 5).join(' ');
            return kws && kws.length > 2 && Utils.normalizeTitle(kws) !== Utils.normalizeTitle(mediaInfo.title) ? this.performSearch({
                ...mediaInfo,
                title: kws,
                year: null,
                titleType: 'multi'
            }) : null;
        }
        determineEndpoint(mi) {
            if (mi.titleType === 'movie') return 'movie';
            if (mi.titleType === 'tv') return 'tv';
            return 'multi';
        }
        async fetchFullDetails(result, mi) {
            const type = result.media_type || mi.titleType || (result.first_air_date ? 'tv' : 'movie');
            const url = `${this.baseUrl}/${type}/${result.id}?api_key=${this.apiKey}&language=${this.language}&append_to_response=external_ids,credits,videos,images`;
            const resp = await this.makeRequest(url);
            return {
                ...result,
                ...JSON.parse(resp.responseText),
                media_type: type
            };
        }
        makeRequest(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url,
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': `BiOMA Linker/${GM_info.script.version}`
                    },
                    timeout: CONFIG.SEARCH_TIMEOUT,
                    onload: r => {
                        if (r.status >= 200 && r.status < 300) return resolve(r);
                        let msg = `API Err: ${r.status}-${r.statusText || ''}`;
                        let dt = r.responseText;
                        try {
                            dt = JSON.parse(dt)?.status_message || dt;
                        } catch (e) {}
                        if (r.status === 401) msg = 'API Err: 401-Chave inválida/Não autorizada.';
                        else if (r.status === 404) msg = 'API Err: 404-Recurso não encontrado.';
                        logger.error(msg, {
                            dt,
                            url
                        });
                        reject(new Error(`${msg} Detalhes: ${dt}`));
                    },
                    onerror: e => {
                        logger.error('Erro de rede/CORS TMDb:', {
                            msg: e.message,
                            url
                        });
                        reject(new Error(`Erro de rede/CORS: ${e.message || 'Verifique conexão.'}`));
                    },
                    ontimeout: () => {
                        logger.error('Timeout GM_xhr TMDb:', {
                            url
                        });
                        reject(new Error('Timeout TMDb (nativo).'));
                    }
                });
            });
        }
        selectBestResult(results, mi) {
            const valid = results.filter(i => (!i.media_type || ['movie', 'tv'].includes(i.media_type)) && (i.title || i.name)?.length);
            if (!valid.length) return null;
            const scored = valid.map(i => ({
                i,
                s: this.calculateMatchScore(i, mi)
            })).sort((a, b) => b.s - a.s);
            logger.debug('API', 'Resultados TMDb com score (top 5):', scored.slice(0, 5).map(r => ({
                t: r.i.title || r.i.name,
                y: (r.i.release_date || r.i.first_air_date || '').substring(0, 4),
                s: r.s.toFixed(2)
            })));
            const best = scored[0];
            return best.s >= 0.35 ? {
                ...best.i,
                matchScore: best.s
            } : null;
        }
        calculateMatchScore(item, mi) {
            const it = item.title || item.name;
            if (!it) return 0;
            const iy = (item.release_date || item.first_air_date || '').substring(0, 4);
            const ity = item.media_type || (item.first_air_date ? 'tv' : 'movie');
            let score = 0;
            const sim = Utils.titleSimilarity(it, mi.title);
            score += sim * 10;
            if (Utils.normalizeTitle(it) === Utils.normalizeTitle(mi.title)) score += 3;
            if (mi.year) {
                if (iy === mi.year) score += 3;
                else if (iy && Math.abs(parseInt(iy) - parseInt(mi.year)) <= 1) score += 1.5;
            } else if (iy) score += 0.5;
            if (mi.titleType && ity === mi.titleType) score += 2;
            else if (mi.titleType && ity && mi.titleType !== ity) score -= 2;
            if (item.popularity) score += Math.min(2, item.popularity / 50);
            if (sim < 0.2) score *= 0.2;
            else if (sim < 0.5) score *= 0.5;
            const oit = item.original_title || item.original_name;
            if (oit && Utils.normalizeTitle(oit) !== Utils.normalizeTitle(it)) {
                const os = Utils.titleSimilarity(oit, mi.title);
                if (os > sim) score += (os - sim) * 5;
            }
            return Math.max(0, score);
        }
        generateCacheKey(mi) {
            return `${Utils.normalizeTitle(mi.title)}-${mi.year || 'na'}-${mi.titleType || 'multi'}-${this.language}`.toLowerCase();
        }
        updateApiKey(k) {
            this.apiKey = k;
        }
        updateLanguage(l) {
            this.language = l;
        }
    }

    class RateLimiter {
        constructor(max = CONFIG.RATE_LIMIT_REQUESTS, window = CONFIG.RATE_LIMIT_WINDOW) {
            this.r = [];
            this.m = max;
            this.w = window;
        }
        canMakeRequest() {
            const n = Date.now();
            this.r = this.r.filter(t => n - t < this.w);
            if (this.r.length < this.m) {
                this.r.push(n);
                return true;
            }
            return false;
        }
        getRemainingTime() {
            return (this.r.length < this.m || this.r.length === 0) ? 0 : Math.max(0, this.w - (Date.now() - this.r[0]));
        }
    }

    class CacheManager {
        constructor(limit = CONFIG.CACHE_LIMIT, ttl = CONFIG.CACHE_TTL) {
            this.l = limit;
            this.t = ttl;
            this.c = new Map();
            this.saveTimer = null;
            this.dirty = false;
            this.loadFromStorage();
        }
        isCacheEnabled() {
            return GM_getValue('useCache', true);
        }
        loadFromStorage() {
            try {
                const s = GM_getValue('biomaApiCache_v2', {});
                const n = Date.now();
                Object.entries(s).forEach(([k, v]) => {
                    if (v?.timestamp && (n - v.timestamp < this.t)) this.c.set(k, v);
                });
                logger.info(`Cache carregado com ${this.c.size} itens.`);
            } catch (e) {
                logger.error('Erro ao carregar cache:', e);
                this.clear();
            }
        }
        get(k) {
            const i = this.c.get(k);
            if (!i) return null;
            if (Date.now() - i.timestamp > this.t) {
                this.c.delete(k);
                this.scheduleSave();
                logger.debug('CACHE', `Cache expirado: ${k}`);
                return null;
            }
            return i.data;
        }
        set(k, d) {
            this.c.set(k, {
                data: d,
                timestamp: Date.now()
            });
            if (this.c.size > this.l) {
                const fk = this.c.keys().next().value;
                this.c.delete(fk);
                logger.debug('CACHE', `Cache cheio, removido item mais antigo: ${fk}`);
            }
            this.scheduleSave();
        }
        scheduleSave() {
            this.dirty = true;
            if (this.saveTimer) clearTimeout(this.saveTimer);
            this.saveTimer = setTimeout(() => {
                if (this.dirty) {
                    this.saveToStorage();
                    this.dirty = false;
                }
            }, CONFIG.CACHE_SAVE_DELAY);
        }
        saveToStorage() {
            try {
                GM_setValue('biomaApiCache_v2', Object.fromEntries(this.c));
                logger.debug('CACHE', 'Cache salvo no armazenamento.');
            } catch (e) {
                logger.error('Erro ao salvar cache:', e);
            }
        }
        clear() {
            this.c.clear();
            GM_setValue('biomaApiCache_v2', {});
            logger.info('Cache limpo.');
        }
    }

    class TVDBService {
        constructor(apiKey) {
            this.apiKey = apiKey;
            this.token = GM_getValue('tvdb_token', null);
            this.tokenTimestamp = GM_getValue('tvdb_token_timestamp', 0);
            this.baseUrl = CONFIG.TVDB_API_BASE;
        }

        async _authenticate() {
            if (this.token && (Date.now() - this.tokenTimestamp < 28 * 24 * 60 * 60 * 1000)) {
                logger.debug('TVDB_API', 'Usando token do TVDb em cache.');
                return this.token;
            }

            if (!this.apiKey) {
                throw new Error('Chave API do TVDb não configurada.');
            }

            logger.info('[TVDB_API] Autenticando para obter novo token...');
            const response = await this._makeRequest(`${this.baseUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: JSON.stringify({
                    apikey: this.apiKey
                }),
            });

            const data = JSON.parse(response.responseText);
            if (data.data?.token) {
                this.token = data.data.token;
                this.tokenTimestamp = Date.now();
                GM_setValue('tvdb_token', this.token);
                GM_setValue('tvdb_token_timestamp', this.tokenTimestamp);
                logger.info('[TVDB_API] Token do TVDb obtido e salvo com sucesso.');
                return this.token;
            } else {
                throw new Error('Falha na autenticação com a API do TVDb.');
            }
        }

        async getMediaData(tvdbId, mediaType) {
            if (!this.apiKey || !tvdbId || !mediaType) {
                return null;
            }
            try {
                const token = await this._authenticate();
                const endpointType = mediaType === 'tv' ? 'series' : 'movies';
                const url = `${this.baseUrl}/${endpointType}/${tvdbId}/extended`;
                logger.debug('TVDB_API', `Buscando dados da mídia (${endpointType}): ${url}`);
                const response = await this._makeRequest(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = JSON.parse(response.responseText);
                return data.data;
            } catch (error) {
                logger.error('Erro ao buscar dados no TVDb:', error);
                if (error.status === 401) {
                    this.token = null;
                    GM_setValue('tvdb_token', null);
                }
                return null;
            }
        }

        async searchByImdbId(imdbId, title) {
            if (!this.apiKey || !imdbId) {
                return null;
            }
            try {
                const token = await this._authenticate();
                const url = `${this.baseUrl}/search?query=${encodeURIComponent(title)}&remote_id=${imdbId}`;
                logger.debug('TVDB_API', `Buscando por IMDb ID: ${url}`);
                const response = await this._makeRequest(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = JSON.parse(response.responseText);
                if (data.data && data.data.length > 0) {
                    logger.info('[TVDB_API] Encontrado TVDb ID via busca por IMDb ID.', data.data[0]);
                    return {
                        tvdb_id: data.data[0].tvdb_id,
                        slug: data.data[0].slug,
                        type: data.data[0].type
                    };
                }
                return null;
            } catch (error) {
                logger.error('Erro ao buscar no TVDb por IMDb ID:', error);
                if (error.status === 401) {
                    this.token = null;
                    GM_setValue('tvdb_token', null);
                }
                return null;
            }
        }

        _makeRequest(url, options) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    ...options,
                    url,
                    onload: res => {
                        if (res.status >= 200 && res.status < 300) {
                            resolve(res);
                        } else {
                            reject({
                                message: `Erro na API do TVDb: ${res.status}`,
                                status: res.status
                            });
                        }
                    },
                    onerror: err => reject(new Error('Erro de rede na API do TVDb.', err)),
                    ontimeout: () => reject(new Error('Timeout na API do TVDb.'))
                });
            });
        }
        updateApiKey(k) {
            this.apiKey = k;
            this.token = null;
        }
    }

    class SettingsManager {
        constructor() {
            this.defaults = {
                apiKey: '',
                language: CONFIG.DEFAULT_LANG,
                position: CONFIG.DEFAULT_POS,
                darkMode: true,
                autoExpand: false,
                debugMode: false,
                fuzzySearch: true,
                useCache: true,
                useFinder: true,
                tvdbApiKey: '',
                customCodeVT: defaultCustomCodeVT(),
                customCodeUA: defaultCustomCodeUA()
            };
            this.settings = this.load();
        }
        load() {
            const s = {};
            for (const [k, dV] of Object.entries(this.defaults)) {
                let v = GM_getValue(k, dV);
                if (k === 'position' && !this.isValidPosition(v)) {
                    logger.warn('Posição inválida, resetando.');
                    v = dV;
                    GM_setValue(k, v);
                }
                s[k] = v;
            }
            return s;
        }
        get(k) {
            return this.settings[k];
        }
        set(k, v) {
            this.settings[k] = v;
            GM_setValue(k, v);
        }
        getAll() {
            return {
                ...this.settings
            };
        }
        updateAll(nS) {
            Object.entries(nS).forEach(([k, v]) => {
                if (k in this.defaults) this.set(k, v);
            });
        }
        isValidPosition(p) {
            return typeof p === 'object' && p !== null && ['top', 'left', 'bottom', 'right'].every(prop => typeof p[prop] === 'string');
        }
        validateApiKey(k) {
            return /^[a-f0-9]{32}$/i.test(k);
        }
    }

    class UIManager {
        constructor(settings, eventBus) {
            this.settings = settings;
            this.eventBus = eventBus;
            this.isPopupVisible = settings.get('autoExpand');
            this.isDragging = false;
            this.isPermanentlyHidden = false;
            this.offsetX = 0;
            this.offsetY = 0;
            this.container = null;
            this.floatingButton = null;
            this.ICONS = {
                copy: `<svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`,
                link: `<svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 570 570" fill="white"><path d="M384 64C366.3 64 352 78.3 352 96C352 113.7 366.3 128 384 128L466.7 128L265.3 329.4C252.8 341.9 252.8 362.2 265.3 374.7C277.8 387.2 298.1 387.2 310.6 374.7L512 173.3L512 256C512 273.7 526.3 288 544 288C561.7 288 576 273.7 576 256L576 96C576 78.3 561.7 64 544 64L384 64zM144 160C99.8 160 64 195.8 64 240L64 496C64 540.2 99.8 576 144 576L400 576C444.2 576 480 540.2 480 496L480 416C480 398.3 465.7 384 448 384C430.3 384 416 398.3 416 416L416 496C416 504.8 408.8 512 400 512L144 512C135.2 512 128 504.8 128 496L128 240C128 231.2 135.2 224 144 224L224 224C241.7 224 256 209.7 256 192C256 174.3 241.7 160 224 160L144 160z"/></svg>`,
                check: `<svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="white"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>`,
                trash: `<svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="white"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>`,
                undo: `<svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 580" fill="white"><path d="M320 128C263.2 128 212.1 152.7 176.9 192L224 192C241.7 192 256 206.3 256 224C256 241.7 241.7 256 224 256L96 256C78.3 256 64 241.7 64 224L64 96C64 78.3 78.3 64 96 64C113.7 64 128 78.3 128 96L128 150.7C174.9 97.6 243.5 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C233 576 156.1 532.6 109.9 466.3C99.8 451.8 103.3 431.9 117.8 421.7C132.3 411.5 152.2 415.1 162.4 429.6C197.2 479.4 254.8 511.9 320 511.9C426 511.9 512 425.9 512 319.9C512 213.9 426 128 320 128z"/></svg>`,
                save: `<svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 560" fill="white"><path d="M160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 237.3C544 220.3 537.3 204 525.3 192L448 114.7C436 102.7 419.7 96 402.7 96L160 96zM192 192C192 174.3 206.3 160 224 160L384 160C401.7 160 416 174.3 416 192L416 256C416 273.7 401.7 288 384 288L224 288C206.3 288 192 273.7 192 256L192 192zM320 352C355.3 352 384 380.7 384 416C384 451.3 355.3 480 320 480C284.7 480 256 451.3 256 416C256 380.7 284.7 352 320 352z"/></svg>`,
                times: `<svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 560" fill="white"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg>`,
                key: `<svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="white"><path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/></svg>`,
            };
            this.init();
        }
        init() {
            this.addStyles();
            this.createElements();
            this.setupEventListeners();
            this.applySettings();
        }
        addStyles() {
            GM_addStyle(this.generateCSS());
        }
        generateCSS() {
            const darkMode = this.settings.get('darkMode');
            const position = this.settings.get('position');
            const theme = {
                bg: darkMode ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
                text: darkMode ? '#f1f5f9' : '#1e293b',
                border: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                primary: darkMode ? '#38bdf8' : '#0284c7',
                hover: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                shadow: darkMode ? '0 8px 20px rgba(0,0,0,0.5)' : '0 8px 20px rgba(0,0,0,0.15)'
            };
            return `
                #tmdb-helper-float-btn { position: fixed; bottom: 20px; right: 20px; z-index: 999998; width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #00A8E1 0%, #0F79AF 100%); box-shadow: 0 4px 20px rgba(0, 168, 225, 0.4); cursor: pointer; display: flex; align-items: center; justify-content: center; border: 3px solid rgba(255, 255, 255, 0.3); opacity: 0; transform: translateY(20px); pointer-events: none; transition: all 0.3s ease; }
                #tmdb-helper-float-btn.visible { opacity: 1; transform: translateY(0); pointer-events: auto; }
                #tmdb-helper-float-btn:hover { transform: translateY(0) scale(1.1); box-shadow: 0 6px 30px rgba(0, 168, 225, 0.6); }
                #tmdb-helper-float-btn img { width: 32px; height: 32px; filter: brightness(0) invert(1); }
                #tmdb-helper-container { font-size: 16px; font-family: 'Source Sans Pro', Arial, sans-serif !important; position:fixed; bottom:${position.bottom||'unset'}; right:${position.right||'unset'}; top:${position.top||'unset'}; left:${position.left||'unset'}; background-color:${theme.bg}; color:${theme.text}; border-radius:10px; z-index:2147483646; width:320px; box-shadow:${theme.shadow}; transition:all .3s ease; backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); border:${darkMode?'1px solid rgba(255,255,255,0.1)':'1px solid rgba(0,0,0,0.1)'}; display:flex; flex-direction:column; opacity: 1; transform: translateY(0); }
                #tmdb-helper-container.hidden { opacity: 0; transform: translateY(20px); pointer-events: none; }
                #tmdb-helper-container * { box-sizing:border-box; font-family: inherit !important; }
                #tmdb-helper-header { display:flex; justify-content:space-between; align-items:center; cursor:move; padding: 12px 16px; border-bottom:${darkMode?'1px solid rgba(255,255,255,0.1)':'1px solid rgba(0,0,0,0.1)'}; user-select:none; }
                #tmdb-helper-header.dragging { cursor:grabbing; }
                #tmdb-helper-title { margin:0; font-size:17px; font-weight:700; color:${theme.primary}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex-grow:1; }
                #tmdb-helper-content { padding: 0 16px 16px 16px; max-height:450px; overflow-y:auto; line-height:1.5; }
                #tmdb-helper-content::-webkit-scrollbar, .tmdb-textarea::-webkit-scrollbar { width:5px; }
                #tmdb-helper-content::-webkit-scrollbar-track, .tmdb-textarea::-webkit-scrollbar-track { background: transparent; }
                #tmdb-helper-content::-webkit-scrollbar-thumb, .tmdb-textarea::-webkit-scrollbar-thumb { background:${darkMode?'rgba(255,255,255,.2)':'rgba(0,0,0,.2)'}; border-radius:5px; }
                #tmdb-helper-content::-webkit-scrollbar-thumb:hover, .tmdb-textarea::-webkit-scrollbar-thumb:hover { background:${darkMode?'rgba(255,255,255,.3)':'rgba(0,0,0,.3)'}; }
                .tmdb-header-controls { display: flex; gap: 4px; margin-left: 10px; }
                .tmdb-control-btn { background: rgba(255, 255, 255, 0.1); border: none; color: ${theme.text}; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; line-height: 1; }
                .tmdb-control-btn:hover { background: rgba(255, 255, 255, 0.2); transform: scale(1.1); }
                #tmdb-helper-close-btn:hover { transform: rotate(90deg) scale(1.1); }
                .tmdb-btn { position:relative; padding:6px 8px; margin:0px; border:none; border-radius:6px; color:white; font-weight:600; cursor:pointer; font-size:12px; transition:all .2s ease; box-shadow:0 2px 4px rgba(0,0,0,.2); min-width:75px; text-align:center; display:inline-flex; align-items:center; justify-content:center; gap:5px; white-space:nowrap; flex-shrink:0; }
                .tmdb-btn:hover, .tmdb-btn:focus { opacity:1; outline:none; transform:translateY(-2px); box-shadow:0 4px 8px rgba(0,0,0,.3); }
                .tmdb-btn:active { transform:translateY(0); box-shadow:0 2px 3px rgba(0,0,0,.2); }
                .tmdb-btn-primary { background-color:#0369a1; background-image:linear-gradient(to bottom right,#0284c7,#0369a1); }
                .tmdb-btn-primary:hover .copy-icon { animation:pulse .5s ease-in-out; }
                .tmdb-btn-secondary { background-color:#7c3aed; background-image:linear-gradient(to bottom right,#8b5cf6,#7c3aed); }
                .tmdb-btn-secondary:hover .copy-icon { animation:pulse .5s ease-in-out; }
                .tmdb-btn-tertiary { background-color:#0d9488; background-image:linear-gradient(to bottom right,#14b8a6,#0d9488); }
                .tmdb-btn-tertiary:hover .copy-icon { animation:pulse .5s ease-in-out; }
                .tmdb-btn-copied { background-color:#059669; background-image:linear-gradient(to bottom right,#10b981,#059669); }
                .tmdb-btn-disabled { background: #5a657a !important; opacity: 0.6; cursor: not-allowed; pointer-events: none; }
                .tmdb-btn-disabled:hover { transform: none; box-shadow: 0 2px 4px rgba(0,0,0,.2); }
                .button-container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin: 10px 0; }
                .button-group { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
                .button-group.first-group { margin-top: 15px; }
                .button-group.second-group { margin-top: 6px; }
                .button-group.custom-code-group { margin-top: 6px; }
                .tmdb-media-image { max-width:100%; height:auto; margin:10px 0; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,.3); }
                .tmdb-ratings { display:flex; justify-content:space-around; margin:12px 0; background-color:${darkMode?'rgba(255,255,255,.05)':'rgba(0,0,0,.03)'}; padding:10px; border-radius:8px; }
                .tmdb-rating { text-align:center; } .tmdb-rating-value { font-weight:700; font-size:17px; }
                .tmdb-score-high { color:#4ade80; } .tmdb-score-medium { color:#fbbf24; } .tmdb-score-low { color:#f87171; }
                #tmdb-helper-settings { margin-top:10px; padding-top:10px; border-top:${darkMode?'1px solid rgba(255,255,255,.1)':'1px solid rgba(0,0,0,.1)'}; width:100%; }
                #tmdb-helper-settings h3 { font-size: 18px !important; font-weight: 700 !important; margin-top: 0 !important; margin-bottom: 12px !important; }
                #tmdb-helper-settings > div > label { font-weight: 600 !important; }
                .tmdb-input, .tmdb-select, .tmdb-textarea { width:100%; padding:8px; margin:6px 0; border-radius:6px; border:1px solid ${darkMode?'rgba(255,255,255,.2)':'rgba(0,0,0,.2)'}; background:${darkMode?'rgba(255,255,255,.05)':'#fff'}; color:${darkMode?'#f1f5f9':'#1e293b'}; font-family:inherit; }
                .tmdb-textarea { min-height: 100px; resize: vertical; }
                .tmdb-input:focus, .tmdb-select:focus, .tmdb-textarea:focus { outline:none; border-color:${theme.primary}; box-shadow:0 0 0 2px ${darkMode?'rgba(56,189,248,.3)':'rgba(2,132,199,.3)'}; }
                .tmdb-select { cursor:pointer; appearance:auto; }
                .tmdb-select option { background-color:${darkMode?'#1e293b':'#fff'}; color:${darkMode?'#f1f5f9':'#1e293b'};}
                .copy-icon { width: 14px !important; height: 14px !important; filter: drop-shadow(0 1px 1px rgba(0,0,0,0.3)); display: inline-block; vertical-align: -0.125em; line-height: 1; }
                @keyframes pulse { 0%{transform:scale(1)} 50%{transform:scale(1.3)} 100%{transform:scale(1)} }
                details summary { font-weight:600; color:${theme.primary}; padding:6px 10px; background-color:${darkMode?'rgba(255,255,255,.05)':'rgba(0,0,0,.03)'}; border-radius:6px; transition:all .2s ease; cursor:pointer; list-style:none; display:flex; align-items:center; }
                details summary::-webkit-details-marker {display:none;}
                details summary::before {content:'\\25B6';display:inline-block;width:1em;margin-right:.5em;transition:transform .2s ease;}
                details[open] summary::before {transform:rotate(90deg);}
                details summary:hover { background-color:${darkMode?'rgba(255,255,255,.1)':'rgba(0,0,0,.05)'}; }
                details p#tmdb-overview-text { padding: 10px; margin-top: 8px; background-color: ${darkMode ? 'rgba(255,255,255,.02)' : 'rgba(0,0,0,.01)'}; border-radius: 6px; cursor: pointer; user-select: text; transition: background-color 0.2s ease; }
                details p#tmdb-overview-text:hover { background-color: ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}; }
                .bioma-checkbox-label { display:flex; align-items:center; justify-content: space-between; margin:8px 0; cursor:pointer; font-size:14px; }
                #tmdb-helper-settings .bioma-checkbox-label input[type="checkbox"] { appearance: auto; -webkit-appearance: auto; width: 1em; height: 1em; opacity: 1; display: inline-block; margin-right:8px; cursor:pointer; transform:scale(1.1); accent-color:${theme.primary}; }
                .tooltip-container { position: relative; display: inline-flex; align-items: center; justify-content: center; }
                .tooltip-icon { cursor: help; margin-left: 6px; color: ${darkMode ? '#94a3b8' : '#64748b'}; pointer-events: none; }
                .bioma-error,.bioma-warning,.bioma-info { padding:10px; border-radius:6px; margin:10px 0; }
                .bioma-error { background-color:rgba(239,68,68,.1); border:1px solid rgba(239,68,68,.3); color:#ef4444; }
                .bioma-warning { background-color:rgba(245,158,11,.1); border:1px solid rgba(245,158,11,.3); color:#f59e0b; }
                .bioma-info { background-color:rgba(59,130,246,.1); border:1px solid rgba(59,130,246,.3); color:#3b82f6; font-size:13px; }
                .bioma-skeleton { animation:bioma-pulse 1.5s ease-in-out infinite; } @keyframes bioma-pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
                .bioma-skeleton-text { height:20px; background:${theme.hover}; border-radius:4px; margin:8px 0; }
                .bioma-skeleton-text.short { width:60%; }
                .bioma-notification { position:fixed; top:20px; left:50%; transform:translateX(-50%) translateY(-100px); background-color:${darkMode?'rgba(30,41,59,.95)':'rgba(226,232,240,.95)'}; color:${theme.text}; padding:12px 22px; border-radius:8px; z-index:2147483647; font-family: 'Source Sans Pro', Arial, sans-serif !important; font-weight:600; font-size: 16px; box-shadow:0 5px 15px rgba(0,0,0,.2); opacity:0; transition:all .3s cubic-bezier(.25,.8,.25,1); pointer-events:none; }
                .bioma-notification.show { opacity:1; transform:translateX(-50%) translateY(0); }
                .media-debug-info { font-size:11px; color:${darkMode?'#94a3b8':'#64748b'}; margin-top:8px; padding:8px; background-color:${darkMode?'rgba(255,255,255,.03)':'rgba(0,0,0,.02)'}; border-radius:4px; font-family:monospace; word-break:break-all; border:1px dashed ${theme.border}; }
                .sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border-width:0; }
                #bioma-dynamic-tooltip { position: fixed; background-color: #333; color: #fff; text-align: left; border-radius: 6px; padding: 8px 12px; z-index: 2147483647; font-size: 13px; line-height: 1.5; max-width: 280px; pointer-events: none; opacity: 0; transform: scale(0.95); transition: opacity 0.2s ease, transform 0.2s ease; }
                #bioma-dynamic-tooltip.visible { opacity: 1; transform: scale(1); }
            `;
        }
        createElements() {
            document.querySelectorAll('#tmdb-helper-container, #tmdb-helper-float-btn').forEach(el => el.remove());
            this.container = document.createElement('div');
            this.container.id = 'tmdb-helper-container';
            this.container.setAttribute('role', 'dialog');
            this.container.setAttribute('aria-label', 'Identificador de Mídia BiOMA');
            this.container.innerHTML = `
                <div id="tmdb-helper-header" title="Arraste para mover">
                    <h3 id="tmdb-helper-title">BiOMA Linker</h3>
                    <div class="tmdb-header-controls">
                        <button id="tmdb-helper-settings-btn" class="tmdb-control-btn" title="Configurações" aria-label="Abrir configurações">⚙️</button>
                        <button id="tmdb-helper-minimize-btn" class="tmdb-control-btn" title="Minimizar" aria-label="Minimizar">−</button>
                        <button id="tmdb-helper-close-btn" class="tmdb-control-btn" title="Fechar" aria-label="Fechar">×</button>
                    </div>
                </div>
                <div id="tmdb-helper-content"><div class="bioma-skeleton"><div class="bioma-skeleton-text"></div><div class="bioma-skeleton-text short"></div></div></div>`;
            this.floatingButton = document.createElement('button');
            this.floatingButton.id = 'tmdb-helper-float-btn';
            this.floatingButton.innerHTML = `<img src="${GM_getResourceURL('iconIMG')}" alt="BiOMA">`;
            document.body.appendChild(this.container);
            document.body.appendChild(this.floatingButton);
            this.hideCompletely();
        }
        setupEventListeners() {
            const get = (id) => document.getElementById(id);
            get('tmdb-helper-header')?.addEventListener('mousedown', (e) => {
                if (!e.target.closest('button')) this.startDragging(e);
            });
            get('tmdb-helper-settings-btn')?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.eventBus.emit('show-settings');
            });
            get('tmdb-helper-minimize-btn')?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleVisibility();
            });
            get('tmdb-helper-close-btn')?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.hidePermanently();
            });
            this.floatingButton?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleVisibility();
            });
            document.addEventListener('mousemove', (e) => this.drag(e));
            document.addEventListener('mouseup', () => this.stopDragging());
            this.container.addEventListener('keydown', (e) => this.handleKeyboard(e));
            this.container.addEventListener('wheel', (e) => {
                const content = e.target.closest('#tmdb-helper-content, .tmdb-textarea');
                if (content && content.scrollHeight > content.clientHeight) e.stopPropagation();
            });
            this.setupTooltipListeners();
        }
        setupTooltipListeners() {
            this.container.addEventListener('mouseenter', (e) => {
                const target = e.target.closest('.tooltip-container');
                if (target && target.dataset.tooltip) {
                    this.createTooltip(target, target.dataset.tooltip);
                }
            }, true);
            this.container.addEventListener('mouseleave', (e) => {
                const target = e.target.closest('.tooltip-container');
                if (target) {
                    this.removeTooltip();
                }
            }, true);
        }
        createTooltip(target, text) {
            const existingTooltip = document.getElementById('bioma-dynamic-tooltip');
            if (existingTooltip) {
                existingTooltip.remove();
            }
            const tooltip = document.createElement('div');
            tooltip.id = 'bioma-dynamic-tooltip';
            tooltip.textContent = text;
            document.body.appendChild(tooltip);
            const targetRect = target.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            let top = targetRect.top - tooltipRect.height - 8;
            let left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
            if (top < 0) {
                top = targetRect.bottom + 8;
            }
            if (left < 5) {
                left = 5;
            }
            if (left + tooltipRect.width > window.innerWidth) {
                left = window.innerWidth - tooltipRect.width - 5;
            }
            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;
            requestAnimationFrame(() => {
                tooltip.classList.add('visible');
            });
        }
        removeTooltip() {
            const tooltip = document.getElementById('bioma-dynamic-tooltip');
            if (tooltip) {
                tooltip.classList.remove('visible');
                tooltip.addEventListener('transitionend', () => tooltip.remove(), {
                    once: true
                });
            }
        }
        startDragging(e) {
            this.isDragging = true;
            this.container.style.transition = 'none';
            document.getElementById('tmdb-helper-header').classList.add('dragging');
            const r = this.container.getBoundingClientRect();
            this.offsetX = e.clientX - r.left;
            this.offsetY = e.clientY - r.top;
            this.container.style.cursor = 'grabbing';
            e.preventDefault();
        }
        drag(e) {
            if (!this.isDragging) return;
            let nX = e.clientX - this.offsetX;
            let nY = e.clientY - this.offsetY;
            nX = Math.max(0, Math.min(window.innerWidth - this.container.offsetWidth, nX));
            nY = Math.max(0, Math.min(window.innerHeight - this.container.offsetHeight, nY));
            this.container.style.left = `${nX}px`;
            this.container.style.top = `${nY}px`;
            this.container.style.right = 'auto';
            this.container.style.bottom = 'auto';
        }
        stopDragging() {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.container.style.transition = '';
            document.getElementById('tmdb-helper-header').classList.remove('dragging');
            this.container.style.cursor = '';
            const r = this.container.getBoundingClientRect();
            this.settings.set('position', {
                top: `${r.top}px`,
                left: `${r.left}px`,
                bottom: 'auto',
                right: 'auto'
            });
        }
        toggleVisibility() {
            if (this.isPopupVisible) {
                this.container.classList.add('hidden');
                setTimeout(() => this.floatingButton.classList.add('visible'), 250);
            } else {
                this.floatingButton.classList.remove('visible');
                setTimeout(() => this.container.classList.remove('hidden'), 50);
            }
            this.isPopupVisible = !this.isPopupVisible;
            this.settings.set('autoExpand', this.isPopupVisible);
        }
        hidePermanently() {
            this.container.classList.add('hidden');
            this.floatingButton.classList.remove('visible');
            this.isPermanentlyHidden = true;
            logger.info("Widget fechado pelo usuário para a página atual.");
        }
        resetVisibilityState() {
            this.isPermanentlyHidden = false;
        }
        show() {
            if (this.isPermanentlyHidden) return;
            this.isPopupVisible = this.settings.get('autoExpand');
            if (this.isPopupVisible) {
                this.container.classList.remove('hidden');
                this.floatingButton.classList.remove('visible');
            } else {
                this.container.classList.add('hidden');
                this.floatingButton.classList.add('visible');
            }
        }
        hideCompletely() {
            if (this.container) this.container.classList.add('hidden');
            if (this.floatingButton) this.floatingButton.classList.remove('visible');
        }
        handleKeyboard(e) {
            if (e.key === 'Escape' && this.container.contains(document.activeElement)) {
                if (this.isPopupVisible) this.toggleVisibility();
                e.preventDefault();
            }
        }
        updateContent(c) {
            const d = document.getElementById('tmdb-helper-content');
            if (d) d.innerHTML = c;
        }
        async loadImageAsDataURL(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    responseType: 'blob',
                    onload: (response) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(response.response);
                    },
                    onerror: reject,
                    ontimeout: reject
                });
            });
        }
        showLoading(m = 'Carregando...') {
            if (this.isPermanentlyHidden) return;
            this.show();
            this.updateContent(`<div class="bioma-skeleton" aria-label="Conteúdo carregando"><div class="bioma-skeleton-text"></div><div class="bioma-skeleton-text short"></div></div><p style="text-align:center;margin-top:10px;">${Utils.sanitizeInput(m)}</p>`);
        }
        showError(m, d = null) {
            if (this.isPermanentlyHidden) return;
            this.show();
            let c = `<div class="bioma-error" role="alert">${Utils.sanitizeInput(m)}</div>`;
            if (d) c += `<details><summary>Detalhes</summary><p>${Utils.sanitizeInput(d)}</p></details>`;
            this.updateContent(c);
        }
        showWarning(m) {
            if (this.isPermanentlyHidden) return;
            this.show();
            this.updateContent(`<div class="bioma-warning" role="alert">${Utils.sanitizeInput(m)}</div>`);
        }
        showInfo(m) {
            if (this.isPermanentlyHidden) return;
            this.show();
            this.updateContent(`<div class="bioma-info" role="status">${Utils.sanitizeInput(m)}</div>`);
        }
        showNotification(m, dur = 2500) {
            document.querySelectorAll('.bioma-notification').forEach(el => el.remove());
            const n = document.createElement('div');
            n.className = 'bioma-notification';
            n.setAttribute('role', 'status');
            n.setAttribute('aria-live', 'assertive');
            n.textContent = m;
            document.body.appendChild(n);
            n.offsetHeight;
            n.classList.add('show');
            setTimeout(() => {
                n.classList.remove('show');
                n.addEventListener('transitionend', () => n.remove(), {
                    once: true
                });
            }, dur);
        }
        async displayMediaResults(d) {
            if (this.isPermanentlyHidden) return;
            this.show();
            let finalPosterPath = d.posterPath;
            if (d.posterPath) {
                try {
                    finalPosterPath = await this.loadImageAsDataURL(d.posterPath);
                } catch (error) {
                    logger.error("Falha ao carregar imagem do poster via GM_xmlhttpRequest", error);
                    finalPosterPath = d.posterPath;
                }
            }
            const c = this.buildMediaHTML({
                ...d,
                finalPosterPath
            });
            this.updateContent(c);
            if (!this.isPopupVisible && this.settings.get('autoExpand')) {
                this.toggleVisibility();
            }
        }
        buildMediaHTML(d) {
            let h = '';
            if (d.finalPosterPath) h += `<img src="${Utils.sanitizeInput(d.finalPosterPath)}" alt="Pôster de ${Utils.sanitizeInput(d.title)}" class="tmdb-media-image">`;
            h += `<div class="media-header"><h3 style="font-size:18px;font-weight:700;margin:8px 0 4px 0;">${Utils.sanitizeInput(d.title)} ${d.year ? `<span style="font-weight:400;opacity:.8;">(${d.year})</span>` : ''}</h3></div>`;
            if (d.originalTitle && Utils.normalizeTitle(d.originalTitle) !== Utils.normalizeTitle(d.title)) {
                h += `<p style="margin:4px 0;font-size:14px;opacity:.8;">Título original: ${Utils.sanitizeInput(d.originalTitle)}</p>`;
            }
            h += `<p style="margin:4px 0 12px 0;"><span style="display:inline-block;padding:3px 8px;border-radius:4px;background-color:${this.settings.get('darkMode') ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.05)'};font-size:13px;font-weight:600;">${Utils.sanitizeInput(d.type)}</span></p>`;
            if (d.rating && d.rating > 0) {
                const rC = d.rating >= 7 ? 'tmdb-score-high' : (d.rating >= 5 ? 'tmdb-score-medium' : 'tmdb-score-low');
                h += `<div class="tmdb-ratings"><div class="tmdb-rating"><div style="font-weight:600;letter-spacing:.5px;font-size:.8em;opacity:.8;">TMDb</div><div class="tmdb-rating-value ${rC}">${d.rating.toFixed(1)}</div></div></div>`;
            }
            if (d.tvdbRating && d.tvdbRating > 0) {
                const rC = d.tvdbRating >= 7 ? 'tmdb-score-high' : (d.tvdbRating >= 5 ? 'tmdb-score-medium' : 'tmdb-score-low');
                h += `<div class="tmdb-rating"><div style="font-weight:600;letter-spacing:.5px;font-size:.8em;opacity:.8;">TVDb</div><div class="tmdb-rating-value ${rC}">${d.tvdbRating.toFixed(1)}</div></div>`;
            }
            if (d.overview) {
                h += `<details style="margin-top:16px;"><summary>Ver sinopse</summary><p id="tmdb-overview-text" title="Clique para copiar" role="textbox" aria-multiline="true" tabindex="0">${Utils.sanitizeInput(d.overview)}</p></details>`;
            }
            if (this.settings.get('debugMode') && d.debugInfo) {
                h += `<div class="media-debug-info" style="margin-top: 16px;"><strong>[Debug]</strong><br>
                    <b>Origem:</b> ${Utils.sanitizeInput(d.debugInfo.source || 'N/A')}<br>
                    <b>Título Det.:</b> ${Utils.sanitizeInput(d.debugInfo.title)}<br>
                    <b>Ano Det.:</b> ${d.debugInfo.detectedYear || 'N/A'}<br>
                    <b>Tipo Det.:</b> ${Utils.sanitizeInput(d.debugInfo.detectedType || 'N/A')} | <b>TMDb:</b> ${Utils.sanitizeInput(d.debugInfo.tmdbType || 'N/A')}<br>
                    <b>Score:</b> ${d.debugInfo.matchScore ? d.debugInfo.matchScore.toFixed(2) : 'N/A'}
                </div>`;
            }
            h += this.buildButtonsHTML(d);
            return h;
        }
        buildButtonsHTML(d) {
            const cB = (act, typ, val, lbl, iconContent, btnClass) => {
                const isDisabled = !val;
                const finalBtnClass = isDisabled ? 'tmdb-btn-disabled' : btnClass;
                const disabledAttr = isDisabled ? 'disabled' : '';
                const title = isDisabled ? `${typ.toUpperCase()} indisponível` : (act === 'copy' ? `Copiar ${typ.toUpperCase()} ID: ${val}` : `Abrir no ${typ.toUpperCase()}`);
                const dataAttr = act === 'copy' ? `data-type="${typ}" data-value="${val || ''}"` : `data-url="${val || ''}"`;
                return `<button class="tmdb-btn ${finalBtnClass}" data-action="${act}" ${dataAttr} title="${title}" ${disabledAttr}>${iconContent}${lbl}</button>`;
            };
            let h = '<div class="button-container" style="margin-top:15px;">';
            const tmdbCopyValue = d.tmdbId ? `${d.mediaType}/${d.tmdbId}` : null;
            h += cB('copy', 'tmdb', tmdbCopyValue, 'TMDb', this.ICONS.copy, 'tmdb-btn-primary');
            h += cB('copy', 'imdb', d.imdbId, 'IMDb', this.ICONS.copy, 'tmdb-btn-primary');
            h += cB('copy', 'tvdb', d.tvdbId, 'TVDb', this.ICONS.copy, 'tmdb-btn-primary');
            h += cB('open', 'tmdb', d.tmdbUrl, 'TMDb', this.ICONS.link, 'tmdb-btn-secondary');
            h += cB('open', 'imdb', d.imdbUrl, 'IMDb', this.ICONS.link, 'tmdb-btn-secondary');
            h += cB('open', 'tvdb', d.tvdbUrl, 'TVDb', this.ICONS.link, 'tmdb-btn-secondary');
            h += '</div>';
            h += `<div class="button-group custom-code-group">
                    <button class="tmdb-btn tmdb-btn-tertiary" title="Copiar código customizado VT" data-code-type="VT">${this.ICONS.copy}Código VT</button>
                    <button class="tmdb-btn tmdb-btn-tertiary" title="Copiar código customizado UA" data-code-type="UA">${this.ICONS.copy}Código UA</button>
                </div>`;
            return h;
        }
        showSettings(sH) {
            this.show();
            if (!this.isPopupVisible) this.toggleVisibility();
            this.updateContent(`<div id="tmdb-helper-settings">${sH}</div>`);
        }
        applySettings() {
            this.addStyles();
            this.applyPosition();
        }
        applyPosition() {
            const p = this.settings.get('position');
            if (this.container) Object.assign(this.container.style, p);
        }
        resetPosition() {
            const dP = CONFIG.DEFAULT_POS;
            this.settings.set('position', dP);
            this.applyPosition();
            this.showNotification('Posição resetada!');
        }
        destroy() {
            this.container?.remove();
            this.floatingButton?.remove();
            document.querySelectorAll('.bioma-notification').forEach(el => el.remove());
        }
    }

    class BiOMALinker {
        constructor() {
            this.eventBus = new EventBus();
            this.settings = new SettingsManager();
            this.cache = new CacheManager();
            this.rateLimiter = new RateLimiter();
            this.tmdbService = new TMDBService(this.settings.get('apiKey'), this.settings.get('language'), this.cache, this.rateLimiter);
            this.tvdbService = new TVDBService(this.settings.get('tvdbApiKey'));
            this.ui = new UIManager(this.settings, this.eventBus);
            this.state = {
                currentMedia: null,
                lastApiResult: null,
                currentURL: window.location.href,
                currentCanonicalURL: this._getCanonicalURL(window.location.href),
                searchInProgress: false,
                domObserver: null,
                netflixModalObserver: null
            };
            this.init();
        }
        init() {
            logger.info(`BiOMA Linker v${GM_info.script.version} inicializado.`);
            this.setupEventListeners();
            this.startPageMonitoring();
            if (this.isRelevantPage(this.state.currentURL)) {
                this.ui.show();
                this.processDetectedContent();
            } else {
                this.ui.hideCompletely();
            }
            if (!this.settings.get('apiKey')) {
                setTimeout(() => {
                    this.ui.showNotification('Chave API TMDb não configurada.', 5000);
                    this.showApiKeyPrompt();
                }, 1000);
            }
        }
        isRelevantPage(url) {
            try {
                const {
                    hostname,
                    pathname
                } = new URL(url);
                const checks = {
                    'primevideo.com': () => pathname.includes('/detail/'),
                    'netflix.com': () => pathname.startsWith('/title/') || url.includes('jbv='),
                    'hbomax.com': () => /^\/(movie|show|topical|mini-series|standalone)\//.test(pathname),
                    'disneyplus.com': () => pathname.includes('/browse/entity-'),
                    'tv.apple.com': () => pathname.includes('/movie/') || pathname.includes('/show/'),
                    'paramountplus.com': () => /^\/(movies\/video|shows|series)\//.test(pathname) && pathname.split('/').length > 3,
                    'crunchyroll.com': () => pathname.includes('/series/'),
                    'globoplay.globo.com': () => pathname.includes('/t/'),
                    'kocowa.com': () => pathname.includes('/season/'),
                    'viki.com': () => pathname.includes('/tv/') || pathname.includes('/movies/'),
                    'mais.sbt.com.br': () => /^\/(opera|serie|movie|program|show)\//.test(pathname),
                    'play.mercadolivre.com.br': () => pathname.startsWith('/assistir/'),
                    'iq.com': () => pathname.startsWith('/play/')
                };
                for (const domain in checks) {
                    if (hostname.includes(domain)) return checks[domain]();
                }
                return false;
            } catch (error) {
                logger.error('Erro ao verificar relevância da página:', error);
                return false;
            }
        }
        setupEventListeners() {
            this.eventBus.on('show-settings', () => this.showSettings());
            document.addEventListener('click', (e) => this.handleContentClick(e), true);
            setInterval(() => this.checkForURLChange(), 500);
            this.setupNetflixModalObserver();
        }

        startPageMonitoring() {
            this.state.domObserver = new MutationObserver(Utils.debounce(() => {
                if (!this.isRelevantPage(window.location.href) || this.state.searchInProgress) {
                    return;
                }
                const latestMediaInfo = this.getMediaInfoFromPage();
                if (this.hasMediaChanged(latestMediaInfo)) {
                    logger.debug('CORE', 'MutationObserver detectou mudança de mídia. Iniciando busca.');
                    this.processDetectedContent();
                }
            }, CONFIG.DEBOUNCE_DELAY));
            this.state.domObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        setupNetflixModalObserver() {
            if (!window.location.hostname.includes('netflix.com')) return;

            this.state.netflixModalObserver = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    mutation.removedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.classList.contains('previewModal--wrapper')) {
                            this.ui.hideCompletely();
                        }
                    });
                }
            });
        }

        _getCanonicalURL(url) {
            try {
                const urlObj = new URL(url);
                const {
                    hostname,
                    pathname
                } = urlObj;
                const rules = [{
                    host: 'primevideo.com',
                    regex: /(detail\/[A-Z0-9]+)/
                }, ];
                for (const rule of rules) {
                    if (hostname.includes(rule.host)) {
                        const match = pathname.match(rule.regex);
                        if (match && match[0]) return urlObj.origin + match[0];
                    }
                }
                return urlObj.origin + pathname;
            } catch (e) {
                return url;
            }
        }

        checkForURLChange() {
            if (window.location.href === this.state.currentURL) return;

            const oldUrl = this.state.currentURL;
            this.state.currentURL = window.location.href;
            logger.info(`Navegação detectada: ${oldUrl} -> ${this.state.currentURL}`);

            if (!this.isRelevantPage(this.state.currentURL)) {
                logger.info('Página deixou de ser relevante. Escondendo UI.');
                this.ui.hideCompletely();
                return;
            }

            const canonicalUrl = this._getCanonicalURL(window.location.href);
            if (canonicalUrl === this.state.currentCanonicalURL) return;

            this.handlePageChange();
        }

        getMediaInfoFromPage() {
            const hostname = window.location.hostname;
            const detectionStrategies = {
                'primevideo.com': this.detectPrimeVideo,
                'netflix.com': this.detectNetflix,
                'hbomax.com': this.detectHboMax,
                'disneyplus.com': this.detectDisneyPlus,
                'tv.apple.com': this.detectAppleTv,
                'paramountplus.com': this.detectParamountPlus,
                'crunchyroll.com': this.detectCrunchyroll,
                'globoplay.globo.com': this.detectGloboPlay,
                'kocowa.com': this.detectKocowa,
                'viki.com': this.detectViki,
                'mais.sbt.com.br': this.detectMaisSbt,
                'mercadolivre.com.br': this.detectMercadoLivre,
                'iq.com': this.detectIq
            };
            if (hostname.includes('netflix.com') && this.state.netflixModalObserver) {
                this.state.netflixModalObserver.disconnect();
                this.state.netflixModalObserver.observe(document.body, {
                    childList: true
                });
            }
            for (const key in detectionStrategies) {
                if (hostname.includes(key)) {
                    if (key === 'netflix.com' && this.state.netflixModalObserver) {
                        this.state.netflixModalObserver.observe(document.body, {
                            childList: true
                        });
                    }
                    return detectionStrategies[key].call(this);
                }
            }
            logger.warn(`Nenhuma função de detecção específica para ${hostname}`);
            return null;
        }

        handlePageChange() {
            logger.info(`Navegação canônica detectada: ${this.state.currentCanonicalURL} -> ${this._getCanonicalURL(window.location.href)}`);
            this.state.currentCanonicalURL = this._getCanonicalURL(this.state.currentURL);
            this.ui.resetVisibilityState();
            if (this.isRelevantPage(this.state.currentURL)) {
                this.processDetectedContent();
            } else {
                this.ui.hideCompletely();
            }
        }

        detectPrimeVideo() {
            const context = document.querySelector('.dv-node-dp-container, [data-automation-id="detail-page-container"], main');
            if (!context) {
                logger.debug('DETECTION', `[PrimeVideo] Contêiner principal não encontrado. Não é possível continuar a detecção.`);
                return null;
            }
            const titleEl = context.querySelector('h1[data-testid="title-art"], h1[data-automation-id="title"]');
            const yearEl = context.querySelector('[data-automation-id="release-year-badge"]');
            if (!titleEl) return null;
            let title = titleEl.textContent.trim() || titleEl.querySelector('img[alt]')?.alt;
            let titleType = null;
            const hasSeasonSelector = !!context.querySelector('input[id*="season-selector"], button[aria-label*="Season"], [data-testid="season-selector"]');
            const hasEpisodesList = !!context.querySelector('[id^="av-episode-"], [data-automation-id^="episode-"], [class*="episode-list"]');
            const hasEpisodeTitle = !!context.querySelector('h3[data-automation-id="ep-title"]');
            const hasSeasonText = /Season \d+|Temporada \d+/i.test(context.textContent);
            const episodeCountMatch = context.textContent.match(/(\d+)\s+(episodes|episódios)/i);
            const hasMultipleEpisodes = episodeCountMatch && parseInt(episodeCountMatch[1]) > 1;
            if (hasSeasonSelector || hasEpisodesList || hasEpisodeTitle || hasSeasonText || hasMultipleEpisodes) {
                titleType = 'tv';
                let reasons = [];
                if (hasSeasonSelector) reasons.push("seletor de temporada");
                if (hasEpisodesList) reasons.push("lista de episódios");
                if (hasEpisodeTitle) reasons.push("título de episódio");
                if (hasSeasonText) reasons.push("texto 'Temporada X'");
                if (hasMultipleEpisodes) reasons.push("contador de episódios");
                logger.debug('DETECTION', `[PrimeVideo] Tipo definido como 'tv' baseado em: ${reasons.join(', ')}.`);
            } else {
                titleType = 'movie';
                logger.debug('DETECTION', `[PrimeVideo] Nenhuma evidência de série encontrada no contexto. Tipo definido como 'movie'.`);
            }
            return {
                title: Utils.cleanTitle(title),
                year: yearEl ? Utils.extractYear(yearEl.textContent) : null,
                titleType
            };
        }

        detectNetflix() {
            const context = document.querySelector('.previewModal--wrapper') || document;
            let title = context.querySelector('.about-header strong, #about-section-pattern-title strong')?.textContent.trim() ||
                context.querySelector('img.previewModal--player-titleTreatment-logo[alt], img.title-logo[alt]')?.alt ||
                document.title.replace(/– Netflix|- Netflix/g, '').trim();
            if (!title) return null;
            const year = Utils.extractYear(context.querySelector('.videoMetadata--container .year, .year')?.textContent);
            let titleType = null;
            const metaText = Array.from(context.querySelectorAll('.previewModal--detailsMetadata-info .videoMetadata--container span, .previewModal--detailsMetadata-info .duration, .episodeSelector-season-name')).map(el => el.textContent.toLowerCase()).join(' ');
            const hasEpisodeSelector = !!context.querySelector('.episodeSelector');

            if (hasEpisodeSelector || /\b(season|temporada|episode|episódio|part|parte)\b/i.test(metaText)) {
                titleType = 'tv';
                logger.debug('DETECTION', `[Netflix] Tipo definido como 'tv' por keywords explícitas (temporada, episódio, etc.).`);
            } else if (/\d+\s*(h|m|min)\b/i.test(metaText)) {
                titleType = 'movie';
                logger.debug('DETECTION', `[Netflix] Tipo definido como 'movie' por indicação de duração (h, min).`);
            } else {
                logger.debug('DETECTION', `[Netflix] Nenhuma keyword explícita encontrada. Definido como 'null' para busca 'multi'.`);
            }
            return {
                title: Utils.cleanTitle(title),
                year,
                titleType
            };
        }

        detectHboMax() {
            let title = null;

            const selectors = [
                'main[aria-label]',
                'div[aria-label][aria-level="1"][role="heading"]',
                'div[aria-label][aria-level="1"]',
            ];

            document.querySelector(
                '.title, .details-title, .PlayerMetadata__title, h1, [data-testid="title"]'
            )

            for (const selector of selectors) {
                const el = document.querySelector(selector);
                if (el) {
                    title = el.alt || el.getAttribute('aria-label') || el.textContent;
                    if (title) {
                        if (el.hasAttribute('aria-label') && el.tagName !== 'IMG') {
                            const clone = el.cloneNode(true);
                            clone.querySelectorAll('[class], [data-testid], :not(h1, span)').forEach(child => child.remove());
                            title = clone.textContent.trim().split(/[\n,]/)[0] || title;
                        }

                        if (title) {
                            logger.debug('DETECTION', `[HBO Max] Título encontrado com o seletor: '${selector}'`);
                            break;
                        }
                    }
                }
            }

            if (!title) return null;

            const yearElement = document.querySelector('[data-testid="metadata_release_year"]');
            const url = window.location.href;
            let titleType = null;

            if (url.includes('/movie/') || url.includes('/standalone/')) {
                titleType = 'movie';
            } else if (url.includes('/show/') || url.includes('/mini-series/') || url.includes('/topical/')) {
                titleType = 'tv';
            }

            logger.debug('DETECTION', `[HBO Max] Tipo determinado pela URL (${url}). Definido como '${titleType}'.`);

            return {
                title: Utils.cleanTitle(title),
                year: yearElement ? Utils.extractYear(yearElement.textContent) : null,
                titleType
            };
        }

        detectDisneyPlus() {
            const titleElement = document.querySelector('[data-testid="details-title-treatment"] img, .title-wrapper h1');
            const yearElement = document.querySelector('[data-testid="details-tab-release-date"] p, .sc-dlnjPT.ebrabT:nth-of-type(1)');
            let title = titleElement?.alt || titleElement?.textContent.trim();
            if (!title) return null;
            const pathname = window.location.pathname;
            let titleType = null;
            if (pathname.includes('/movies/')) {
                titleType = 'movie';
            } else if (pathname.includes('/series/')) {
                titleType = 'tv';
            }
            logger.debug('DETECTION', `[Disney+] Tipo determinado pela URL (${pathname}). Definido como '${titleType}'.`);
            return {
                title: Utils.cleanTitle(title),
                year: yearElement ? Utils.extractYear(yearElement.textContent) : null,
                titleType
            };
        }

        detectAppleTv() {
            const pathname = window.location.pathname;
            let title = document.querySelector('.content-logo img[alt]')?.alt || document.querySelector('meta[name="apple:title"]')?.content;
            if (!title) return null;
            const yearElement = document.querySelector('.details .metadata-list span:first-of-type');
            const year = yearElement ? Utils.extractYear(yearElement.textContent) : null;
            let titleType = null;
            if (pathname.includes('/movie/')) {
                titleType = 'movie';
            } else if (pathname.includes('/show/')) {
                titleType = 'tv';
            }
            logger.debug('DETECTION', `[Apple TV+] Tipo determinado pela URL (${pathname}). Definido como '${titleType}'.`);
            return {
                title: Utils.cleanTitle(title),
                year: year,
                titleType
            };
        }

        detectParamountPlus() {
            const title = document.querySelector('h1 img')?.alt || document.querySelector('.hero__grid h1')?.textContent?.trim();
            if (!title) return null;
            const pathname = window.location.pathname;
            let titleType = null;
            if (pathname.includes('/movies/video/')) {
                titleType = 'movie';
            } else if (pathname.startsWith('/shows/') || pathname.startsWith('/series/')) {
                titleType = 'tv';
            }
            logger.debug('DETECTION', `[Paramount+] Tipo determinado pela URL (${pathname}). Definido como '${titleType}'.`);
            const yearElement = document.querySelector('.movie__air-year time, .showBadging div:last-of-type');
            return {
                title: Utils.cleanTitle(title),
                year: yearElement ? Utils.extractYear(yearElement.textContent) : null,
                titleType
            };
        }

        detectCrunchyroll() {
            const titleElement = document.querySelector('[data-t="series-hero-body"] h1, .show-title');
            const yearElement = document.querySelector('[data-t="meta-info"]');
            logger.debug('DETECTION', `[Crunchyroll] Site é exclusivamente para séries, tipo definido como 'tv'.`);
            return titleElement ? {
                title: Utils.cleanTitle(titleElement.textContent),
                year: yearElement ? Utils.extractYear(yearElement.textContent) : null,
                titleType: 'tv'
            } : null;
        }

        detectGloboPlay() {
            const title = document.querySelector('h1.media-cover__header-text')?.textContent;
            if (!title) return null;
            const year = Utils.extractYear(document.querySelector('#custom-description-item-release-year')?.textContent);
            const typeElement = document.querySelector('#custom-description-item-type');
            let titleType = null;
            if (typeElement) {
                const typeText = typeElement.textContent.toLowerCase();
                if (typeText.includes('série') || typeText.includes('novela')) {
                    titleType = 'tv';
                } else if (typeText.includes('filme')) {
                    titleType = 'movie';
                }
                logger.debug('DETECTION', `[GloboPlay] Tipo determinado pelo texto explícito: '${typeText}'. Definido como '${titleType}'.`);
            } else {
                logger.debug('DETECTION', `[GloboPlay] Elemento de tipo não encontrado. Definido como 'null'.`);
            }
            return {
                title: Utils.cleanTitle(title),
                year,
                titleType
            };
        }

        detectKocowa() {
            const title = document.querySelector('.banner-info img.banner-title-image[alt]')?.alt;
            if (!title) return null;
            const yearEl = Array.from(document.querySelectorAll('.meta-line-one .meta-line-item')).find(el => /^\s*\d{4}\s*$/.test(el.textContent));
            logger.debug('DETECTION', `[Kocowa] Site é exclusivamente para séries (seasons), tipo definido como 'tv'.`);
            return {
                title: Utils.cleanTitle(title),
                year: yearEl ? Utils.extractYear(yearEl.textContent) : null,
                titleType: 'tv'
            };
        }

        detectViki() {
            const pathname = window.location.pathname;
            let titleType = null;
            if (pathname.includes('/tv/')) {
                titleType = 'tv';
                logger.debug('DETECTION', `[Viki] Tipo determinado pela URL (${pathname}). Definido como 'tv'.`);
            } else if (pathname.includes('/movies/')) {
                titleType = 'movie';
                logger.debug('DETECTION', `[Viki] Tipo determinado pela URL (${pathname}). Definido como 'movie'.`);
            } else {
                logger.debug('DETECTION', `[Viki] URL não especifica tipo. Definido como 'null'.`);
            }
            const scriptEl = document.querySelector('script[type="application/ld+json"]');
            if (!scriptEl) return {
                title: null,
                year: null,
                titleType
            };
            try {
                const data = JSON.parse(scriptEl.textContent);
                return {
                    title: Utils.cleanTitle(data.name),
                    year: Utils.extractYear(data.datePublished),
                    titleType
                };
            } catch (e) {
                return null;
            }
        }

        detectMaisSbt() {
            const title = document.querySelector('img[fetchpriority="high"].object-contain')?.alt;
            if (!title) return null;
            const yearElement = Array.from(document.querySelectorAll('.mb-2.flex.w-fit.items-center.gap-2 div span')).find(span => /\d{4}/.test(span.textContent.trim()));
            const pathname = window.location.pathname;
            let titleType = null;
            if (pathname.includes('/serie/') || pathname.includes('/opera/')) {
                titleType = 'tv';
            } else if (pathname.includes('/movie/')) {
                titleType = 'movie';
            }
            logger.debug('DETECTION', `[Mais SBT] Tipo determinado pela URL (${pathname}). Definido como '${titleType}'.`);
            return {
                title: Utils.cleanTitle(title),
                year: yearElement ? Utils.extractYear(yearElement.textContent) : null,
                titleType
            };
        }

        detectMercadoLivre() {
            const titleElement = document.querySelector('h2.content-detail__title');
            if (!titleElement) return null;
            const title = titleElement.textContent;
            let titleType = null;
            const typeElement = document.querySelector('.content-subtitle__label:first-of-type');
            if (typeElement) {
                const typeText = typeElement.textContent.trim().toLowerCase();
                if (typeText === 'filme') {
                    titleType = 'movie';
                } else if (typeText === 'série') {
                    titleType = 'tv';
                }
                logger.debug('DETECTION', `[Mercado Livre] Tipo determinado por texto explícito: '${typeText}'. Definido como '${titleType}'.`);
            } else {
                logger.debug('DETECTION', `[Mercado Livre] Elemento de tipo não encontrado. Definido como 'null'.`);
            }
            const yearElement = document.querySelector('.content-subtitle__label:last-of-type');
            return {
                title: Utils.cleanTitle(title),
                year: yearElement ? Utils.extractYear(yearElement.textContent) : null,
                titleType
            };
        }

        detectIq() {
            const titleElement = document.querySelector('h1.focus-info-title, span.intl-album-title-word-wrap > span');
            const yearElement = document.querySelector('.focus-info-tag > span:nth-of-type(2)');
            let title = titleElement?.textContent.trim().match(/^(.+?)\s*\(/)?.[1] || titleElement?.textContent.trim();
            let titleType = null;
            logger.debug('DETECTION', `[IQ] Site não oferece tipo explícito. Definido como 'null' para busca 'multi'.`);
            return title ? {
                title: Utils.cleanTitle(title),
                year: yearElement ? Utils.extractYear(yearElement.textContent) : null,
                titleType
            } : null;
        }

        processDetectedContent() {
            if (this.state.searchInProgress) {
                logger.debug('CORE', 'Busca já em andamento, ignorando nova chamada.');
                return;
            }
            this.initiateSearch();
        }

        async initiateSearch() {
            this.state.searchInProgress = true;
            logger.debug('CORE', 'Trava de busca ATIVADA.');
            if (!this.settings.get('apiKey')) {
                this.showApiKeyPrompt();
                this.state.searchInProgress = false;
                return;
            }
            this.ui.showLoading('Analisando página...');
            let mediaInfo = null;
            for (let i = 0; i < 5; i++) {
                mediaInfo = this.getMediaInfoFromPage();
                if (mediaInfo && mediaInfo.title) {
                    break;
                }
                await Utils.delay(1000);
            }

            if (!mediaInfo || !mediaInfo.title) {
                this.ui.showInfo('Não foi possível identificar o conteúdo desta página.');
                this.state.searchInProgress = false;
                return;
            }
            this.state.currentMedia = mediaInfo;
            logger.info(`Nova mídia detectada: "${mediaInfo.title}" (${mediaInfo.year || 'N/A'}) [Tipo: ${mediaInfo.titleType || 'indefinido'}]`);
            if (this.settings.get('useFinder')) {
                this.ui.showLoading('Buscando via Finder API...');
                try {
                    const finderResult = await this.searchWithFinder(window.location.href);
                    this.state.lastApiResult = finderResult;
                    await this.ui.displayMediaResults(this.prepareMediaData(finderResult, mediaInfo));
                    this.state.searchInProgress = false;
                    return;
                } catch (finderError) {
                    logger.warn(finderError.message);
                }
            }
            await this.searchWithTMDb(mediaInfo);
            this.state.searchInProgress = false;
        }

        async searchWithFinder(pageUrl) {
            return new Promise((resolve, reject) => {
                const finderUrl = `https://finder.drmfusion.xyz/api/streaming?url=${encodeURIComponent(pageUrl)}&confidence=60&refresh=false&search_mode=fast`;
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: finderUrl,
                    headers: {
                        'accept': 'application/json'
                    },
                    timeout: 15000,
                    onload: async (response) => {
                        if (response.status >= 200 && response.status < 300) {
                            const finderData = JSON.parse(response.responseText);
                            let mediaType = finderData?.media_type;
                            if (mediaType === 'tv_show') mediaType = 'tv'; // Normaliza para 'tv'

                            if (finderData?.tmdb_id && mediaType) {
                                logger.info(`[FINDER API] Sucesso! TMDb ID: ${finderData.tmdb_id}, Tipo: ${mediaType}`);

                                const partialResult = {
                                    id: finderData.tmdb_id,
                                    media_type: mediaType,
                                    external_ids: {
                                        imdb_id: finderData.imdb_id,
                                        tvdb_id: finderData.tvdb_id
                                    },
                                    name: mediaType === 'tv' ? finderData.title : undefined,
                                    title: mediaType === 'movie' ? finderData.title : undefined,
                                    first_air_date: mediaType === 'tv' ? `${finderData.year}-01-01` : undefined,
                                    release_date: mediaType === 'movie' ? `${finderData.year}-01-01` : undefined,
                                    poster_path: finderData.poster_url ? finderData.poster_url.split('/').pop() : null
                                };

                                const tmdbDetails = await this.tmdbService.fetchFullDetails(partialResult, {});

                                const mergedExternalIds = { ...tmdbDetails.external_ids, ...partialResult.external_ids };

                                resolve({
                                    ...tmdbDetails,
                                    external_ids: mergedExternalIds,
                                    matchScore: 1.0,
                                    searchOrigin: 'Finder API'
                                });
                            } else {
                                reject(new Error('[FINDER API] Resposta não contém tmdb_id ou media_type.'));
                            }
                        } else {
                            reject(new Error(`[FINDER API] Resposta com erro ${response.status}.`));
                        }
                    },
                    onerror: (err) => reject(new Error('[FINDER API] Erro de rede.', err)),
                    ontimeout: () => reject(new Error('[FINDER API] Timeout.'))
                });
            });
        }

        async searchWithTMDb(mediaInfo) {
            this.ui.showLoading(`Buscando "${Utils.sanitizeInput(mediaInfo.title || 'mídia')}"...`);
            try {
                const result = await this.tmdbService.search(mediaInfo);
                if (result) {
                    const fullDetails = await this.tmdbService.fetchFullDetails(result, mediaInfo);

                    if (!fullDetails.external_ids?.tvdb_id && fullDetails.external_ids?.imdb_id) {
                        logger.info('[CORE] TMDb não retornou TVDb ID. Tentando buscar no TVDb via IMDb ID...');
                        const tvdbResult = await this.tvdbService.searchByImdbId(fullDetails.external_ids.imdb_id, fullDetails.title || fullDetails.name);
                        if (tvdbResult) {
                            fullDetails.external_ids.tvdb_id = tvdbResult.tvdb_id;
                            fullDetails.tvdb_slug = tvdbResult.slug;
                        }
                    }

                    this.state.lastApiResult = {
                        ...fullDetails,
                        searchOrigin: 'TMDb Search'
                    };
                    await this.ui.displayMediaResults(this.prepareMediaData(this.state.lastApiResult, mediaInfo));
                } else {
                    this.state.lastApiResult = null;
                    this.ui.showWarning(`Nenhum resultado para "${Utils.sanitizeInput(mediaInfo.title)}".`);
                }
            } catch (e) {
                logger.error('Erro em searchWithTMDb:', e);
                this.state.lastApiResult = null;
                if (e.message.includes('API Err: 401')) {
                    this.ui.showError('Chave API TMDb inválida.', 'Por favor, atualize nas configurações.');
                    this.showApiKeyPrompt();
                } else {
                    this.ui.showError('Erro ao buscar no TMDb.', e.message);
                }
            }
        }

        hasMediaChanged(newMediaInfo) {
            if (!newMediaInfo) return false;
            if (!this.state.currentMedia) return true;
            const oldTitle = Utils.normalizeTitle(this.state.currentMedia.title);
            const newTitle = Utils.normalizeTitle(newMediaInfo.title);
            return oldTitle !== newTitle || this.state.currentMedia.year !== newMediaInfo.year;
        }

        prepareMediaData(res, mI) {
            let isTV;
            if (res.media_type) {
                isTV = res.media_type === 'tv';
            } else {
                isTV = mI.titleType === 'tv' || 'first_air_date' in res;
            }
            const data = {
                title: isTV ? (res.name || res.title) : (res.title || res.name),
                originalTitle: isTV ? (res.original_name || res.name) : (res.original_title || res.title),
                year: (isTV ? (res.first_air_date || '') : (res.release_date || '')).substring(0, 4),
                posterPath: res.poster_path ? `${CONFIG.TMDB_IMAGE_BASE}${res.poster_path}` : null,
                overview: res.overview,
                rating: res.vote_average,
                type: isTV ? 'Série/TV' : 'Filme',
                tmdbId: res.id,
                imdbId: res.external_ids?.imdb_id,
                tvdbId: res.external_ids?.tvdb_id || null,
                tmdbUrl: `${CONFIG.TMDB_WEB_BASE}/${isTV ? 'tv' : 'movie'}/${res.id}?language=${this.settings.get('language')}`,
                imdbUrl: res.external_ids?.imdb_id ? `${CONFIG.IMDB_BASE}/${res.external_ids?.imdb_id}` : null,
                tvdbUrl: res.external_ids?.tvdb_id ? `https://www.thetvdb.com/dereferrer/${isTV ? 'series' : 'movie'}/${res.external_ids.tvdb_id}` : null,
                mediaType: isTV ? 'tv' : 'movie'
            };
            if (this.settings.get('debugMode')) {
                data.debugInfo = {
                    title: mI.title,
                    detectedYear: mI.year,
                    detectedType: mI.titleType,
                    tmdbType: res.media_type || (isTV ? 'tv' : 'movie'),
                    matchScore: res.matchScore,
                    source: res.searchOrigin || 'TMDb Search'
                };
            }
            return data;
        }

        handleContentClick(e) {
            const btn = e.target.closest('button[data-action]');
            if (btn && this.ui.container.contains(btn)) {
                e.preventDefault();
                e.stopPropagation();
                if (btn.dataset.action === 'copy' && btn.dataset.value) {
                    this.handleCopy(btn, btn.dataset.type, btn.dataset.value);
                } else if (btn.dataset.action === 'open' && Utils.isValidUrl(btn.dataset.url)) {
                    GM_openInTab(btn.dataset.url, {
                        active: true,
                        insert: true
                    });
                }
            }
            const oT = e.target.closest('#tmdb-overview-text');
            if (oT && this.ui.container.contains(oT)) {
                GM_setClipboard(oT.textContent, 'text');
                this.ui.showNotification('Sinopse copiada!');
            }
            const customCodeBtn = e.target.closest('[data-code-type]');
            if (customCodeBtn && this.ui.container.contains(customCodeBtn)) {
                e.preventDefault();
                e.stopPropagation();
                if (this.state.lastApiResult) {
                    const codeType = customCodeBtn.dataset.codeType;
                    const mediaData = this.prepareMediaData(this.state.lastApiResult, this.state.currentMedia || {});
                    const processedCode = this.handleCustomCode(mediaData, codeType);
                    this.handleCopy(customCodeBtn, `Código ${codeType}`, processedCode);
                } else {
                    this.ui.showNotification('Dados da mídia indisponíveis.', 3000);
                }
            }
        }

        handleCopy(btn, type, val) {
            GM_setClipboard(val, 'text');
            const originalHTML = btn.innerHTML;
            btn.classList.add('tmdb-btn-copied');
            btn.innerHTML = `${this.ui.ICONS.check}Copiado!`;
            this.ui.showNotification(`${type.replace(/_/g, ' ')} copiado!`);
            setTimeout(() => {
                btn.classList.remove('tmdb-btn-copied');
                btn.innerHTML = originalHTML;
            }, 1500);
        }

        handleCustomCode(mediaData, codeType) {
            if (!mediaData) return '';
            const {
                tmdbId,
                imdbId,
                tvdbId,
                title,
                year,
                mediaType
            } = mediaData;
            const url = window.location.href;
            const canonical_url = this._getCanonicalURL(url);
            let template = this.settings.get(codeType === 'VT' ? 'customCodeVT' : 'customCodeUA');

            const variables = {
                url,
                canonical_url,
                tmdb_id: tmdbId,
                imdb_id: imdbId,
                tvdb_id: tvdbId,
                title,
                year,
                mediaType
            };

            template = template.replace(/\{\{(\w+)\}\}/g, (match, key) => variables[key] || match);

            const conditionalRegex = /\s*(-[\w]+\s*\{\{\w+_id\}\})/g;
            template = template.replace(conditionalRegex, (match) => {
                const placeholder = match.match(/\{\{(\w+_id)\}\}/)[1];
                return variables[placeholder] ? match : '';
            });

            return template.trim().replace(/\s+/g, ' ');
        }

        showSettings() {
            const cS = this.settings.getAll();
            const createTooltip = (text) => {
                const sanitizedText = Utils.sanitizeInput(text).replace(/"/g, '&quot;');
                return `<div class="tooltip-container" data-tooltip="${sanitizedText}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tooltip-icon">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                        </div>`;
            };
            const sH = `<h3>Configurações</h3>
                <div>
                    <label for="tmdb-api-key-input" style="display: flex; align-items: center;">Chave API TMDb:
                        ${createTooltip('Obtenha sua chave API (v3 auth) em themoviedb.org/settings/api')}
                    </label>
                    <input type="text" id="tmdb-api-key-input" class="tmdb-input" value="${Utils.sanitizeInput(cS.apiKey)}" placeholder="Sua chave de 32 caracteres" required>
                </div>
                <div>
                    <label for="tvdb-api-key-input" style="display: flex; align-items: center;">Chave API TVDb (Opcional):
                        ${createTooltip('Chave API (v4) do TheTVDB para buscar notas de séries. Obtenha em thetvdb.com/dashboard/account/apikeys')}
                    </label>
                    <input type="text" id="tvdb-api-key-input" class="tmdb-input" value="${Utils.sanitizeInput(cS.tvdbApiKey)}" placeholder="Sua chave API do TVDb">
                </div>
                <label class="bioma-checkbox-label"><span><input type="checkbox" id="setting-dark-mode" ${cS.darkMode ? 'checked' : ''}> Modo escuro</span> ${createTooltip('Escolha seu lado da força.')}</label>
                <label class="bioma-checkbox-label"><span><input type="checkbox" id="setting-auto-expand" ${cS.autoExpand ? 'checked' : ''}> Expandir automaticamente</span> ${createTooltip('Abre a janela automaticamente ao detectar um novo conteúdo.')}</label>
                <label class="bioma-checkbox-label"><span><input type="checkbox" id="setting-debug-mode" ${cS.debugMode ? 'checked' : ''}> Modo debug</span> ${createTooltip('Exibe informações técnicas de depuração no widget e no console.')}</label>
                <label class="bioma-checkbox-label"><span><input type="checkbox" id="setting-fuzzy-search" ${cS.fuzzySearch ? 'checked' : ''}> Busca ampla</span> ${createTooltip('Tenta uma busca mais abrangente se a busca inicial falhar.')}</label>
                <label class="bioma-checkbox-label"><span><input type="checkbox" id="setting-use-cache" ${cS.useCache ? 'checked' : ''}> Ativar cache do TMDb</span> ${createTooltip('Armazena resultados de buscas para acelerar futuras visualizações da mesma mídia.')}</label>
                <label class="bioma-checkbox-label"><span><input type="checkbox" id="setting-use-finder" ${cS.useFinder ? 'checked' : ''}> Ativar busca via Finder</span> ${createTooltip('Usa a API do Finder (mais rápida, baseada em URL) como primeira tentativa.')}</label>
                <div>
                    <label for="setting-language" style="display: flex; align-items: center;">Idioma:
                        ${createTooltip('Define o idioma dos resultados, como título e sinopse.')}
                    </label>
                    <select id="setting-language" class="tmdb-select">
                        <option value="pt-BR" ${cS.language === 'pt-BR' ? 'selected' : ''}>Português (Brasil)</option>
                        ${['en-US', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP', 'ko-KR'].map(l => `<option value="${l}" ${cS.language === l ? 'selected' : ''}>${new Intl.DisplayNames(['pt-BR'], { type: 'language' }).of(l.split('-')[0])} (${l})</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label for="setting-custom-code-vt" style="display: flex; align-items: center;">Código Customizado (VT):
                        ${createTooltip('Placeholders: {{url}}, {{canonical_url}}, {{tmdb_id}}, {{imdb_id}}, {{tvdb_id}}, {{title}}, {{year}}, {{mediaType}}')}
                    </label>
                    <textarea id="setting-custom-code-vt" class="tmdb-textarea">${Utils.sanitizeInput(cS.customCodeVT)}</textarea>
                </div>
                <div>
                    <label for="setting-custom-code-ua" style="display: flex; align-items: center;">Código Customizado (UA):
                        ${createTooltip('Mesmos placeholders do custom code para VT. Remove tags (-imdb, -tvdb, etc) se o ID correspondente não for encontrado.')}
                    </label>
                    <textarea id="setting-custom-code-ua" class="tmdb-textarea">${Utils.sanitizeInput(cS.customCodeUA)}</textarea>
                </div>
                <div class="button-group first-group">
                    <button id="clear-cache" class="tmdb-btn tmdb-btn-primary">${this.ui.ICONS.trash}Limpar Cache</button>
                    <button id="reset-position" class="tmdb-btn tmdb-btn-primary">${this.ui.ICONS.undo}Resetar Posição</button>
                </div>
                <div class="button-group second-group">
                    <button id="save-settings" class="tmdb-btn tmdb-btn-secondary">${this.ui.ICONS.save}Salvar</button>
                    <button id="cancel-settings" class="tmdb-btn tmdb-btn-tertiary" type="button">${this.ui.ICONS.times}Cancelar</button>
                </div>
            `;
            this.ui.showSettings(sH);
            this.setupSettingsListeners();
        }

        setupSettingsListeners() {
            const e = id => document.getElementById(id);
            e('save-settings')?.addEventListener('click', () => this.saveSettings());
            e('cancel-settings')?.addEventListener('click', () => this.cancelSettings());
            e('clear-cache')?.addEventListener('click', () => this.clearCache());
            e('reset-position')?.addEventListener('click', () => this.ui.resetPosition());
            e('tmdb-api-key-input')?.addEventListener('keypress', ev => {
                if (ev.key === 'Enter') this.saveSettings();
            });
        }

        saveSettings() {
            const newApiKey = document.getElementById('tmdb-api-key-input').value.trim();
            const newTvdbApiKey = document.getElementById('tvdb-api-key-input').value.trim();
            if (!this.settings.validateApiKey(newApiKey)) {
                this.ui.showNotification('Chave API TMDb inválida (deve ter 32 caracteres).', 3000);
                return;
            }
            const newSettings = {
                apiKey: newApiKey,
                tvdbApiKey: newTvdbApiKey,
                darkMode: document.getElementById('setting-dark-mode').checked,
                autoExpand: document.getElementById('setting-auto-expand').checked,
                debugMode: document.getElementById('setting-debug-mode').checked,
                fuzzySearch: document.getElementById('setting-fuzzy-search').checked,
                useCache: document.getElementById('setting-use-cache').checked,
                useFinder: document.getElementById('setting-use-finder').checked,
                language: document.getElementById('setting-language').value,
                customCodeVT: document.getElementById('setting-custom-code-vt').value,
                customCodeUA: document.getElementById('setting-custom-code-ua').value
            };
            this.settings.updateAll(newSettings);
            logger.updateDebugMode();
            this.tmdbService.updateApiKey(newSettings.apiKey);
            this.tmdbService.updateLanguage(newSettings.language);
            this.tvdbService.updateApiKey(newSettings.tvdbApiKey);
            this.ui.applySettings();
            this.ui.showNotification('Configurações salvas!');
            this.state.searchInProgress = false;
            this.state.currentMedia = null;
            this.processDetectedContent();
        }

        cancelSettings() {
            this.settings.load();
            this.ui.applySettings();
            if (this.state.lastApiResult) {
                this.ui.displayMediaResults(this.prepareMediaData(this.state.lastApiResult, this.state.currentMedia || {}));
            } else {
                this.ui.updateContent('Mudanças descartadas.');
            }
            this.ui.showNotification('Mudanças descartadas.');
        }

        clearCache() {
            this.cache.clear();
            this.ui.showNotification('Cache da API limpo!');
        }
        showApiKeyPrompt() {
            const content = `<div class="bioma-warning"><h4 style="margin:0 0 8px 0;">Chave API TMDb Necessária</h4><p style="margin:0 0 10px 0;font-size:.9em;">Para usar o script, configure uma chave API (v3 auth) do TMDb.</p></div><button id="open-settings-prompt" class="tmdb-btn tmdb-btn-primary" style="width:100%;margin-top:10px;">${this.ui.ICONS.key}Configurar Chave</button>`;
            this.ui.showSettings(content);
            document.getElementById('open-settings-prompt')?.addEventListener('click', () => this.showSettings());
        }

        destroy() {
            logger.info('Destruindo BiOMA Linker...');
            if (this.state.domObserver) this.state.domObserver.disconnect();
            if (this.state.netflixModalObserver) this.state.netflixModalObserver.disconnect();
            this.ui.destroy();
            this.eventBus.events.clear();
            window.__BiOMA_Linker_Initialized = false;
        }
    }

    function main() {
        try {
            GM_addStyle(GM_getResourceText("googleFontsCSS"));
            if (window.self === window.top) {
                window.__BiOMALinkerInstance = new BiOMALinker();
            } else {
                logger.info('BiOMA Linker: Não executando em iframe.');
            }
        } catch (error) {
            console.error('Falha catastrófica ao iniciar BiOMA Linker:', error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();