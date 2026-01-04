// ==UserScript==
// @name         Warera 戰場收益分析
// @namespace    https://app.warera.io/
// @version      1.0.9
// @description  使用官方 Public API 顯示各戰場有效每千傷害收益排名。
// @author       Guan
// @license      MIT
// @match        https://app.warera.io/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api2.warera.io
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/545701/Warera%20%E6%88%B0%E5%A0%B4%E6%94%B6%E7%9B%8A%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/545701/Warera%20%E6%88%B0%E5%A0%B4%E6%94%B6%E7%9B%8A%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==
/* jshint esversion: 11 */
/* eslint-env es2020 */

(function () {
    'use strict';
    if (window.__WARERA_YIELD_ONCE__) return;
    window.__WARERA_YIELD_ONCE__ = true;

    (function installEarlyLinkInterceptor() {
        const s = document.createElement('script');
        s.textContent = `
    (() => {
      function internalNav(href){
        try{
          const r = window?.next?.router;
          if (r && typeof r.push === 'function') { r.push(href); return; }
        }catch(e){}
        try{
          history.pushState({}, '', href);
          window.dispatchEvent(new PopStateEvent('popstate', { state: history.state }));
        }catch(e){}
      }

      document.addEventListener('click', (e) => {
        // 只攔我們面板產生的超連結
        const path = e.composedPath ? e.composedPath() : [];
        const target =
          (path.find?.(n => n && n.getAttribute && n.getAttribute('data-warera-link') === '1')) ||
          (e.target?.closest && e.target.closest('[data-warera-link="1"]'));
        if (!target) return;

        // 允許中鍵/修飾鍵開新分頁
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        e.preventDefault();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        e.stopPropagation();

        const href = target.getAttribute('href') || target.getAttribute('data-href');
        if (href) internalNav(href);
      }, true); // 捕獲階段，早於站方 listener
    })();
  `;
        (document.head || document.documentElement).appendChild(s);
        s.remove();
    })();

    console.info('[Warera Script] userscript injected');

    /** 常數與設定 */
    const DEFENDER_DISCONNECTED_PENALTY = -0.25; // 守方非首都且斷鏈 -25%（只扣守方）
    const DEFAULT_MONEY_PER_1K = 0;
    const RANK_LIMIT = 50;
    const DEFAULT_PLAYER_COUNTRY_ID = '6813b6d546e731854c7ac826'; // Taiwan
    const STORAGE_KEYS = {
        ENABLE_PERSONAL_BONUS: 'warera_enable_personal_bonus',
        PLAYER_COUNTRY_ID: 'warera_player_country_id',
        COL_SHOW_SIDES: 'warera_col_show_sides',
        COL_SHOW_ORIGIN: 'warera_col_show_origin',
        COL_SHOW_DEF: 'warera_col_show_def',
        COL_SHOW_ATK: 'warera_col_show_atk',
        COL_SHOW_POOL: 'warera_col_show_pool',
        COL_SHOW_DBG: 'warera_col_show_dbg',
    };

    /** API */
    const BATTLES_URL =
          'https://api2.warera.io/trpc/battle.getBattles?input=' +
          encodeURIComponent(JSON.stringify({ limit: 100 }));
    const REGIONS_URL = 'https://api2.warera.io/trpc/region.getRegionsObject';
    const COUNTRIES_URL = 'https://api2.warera.io/trpc/country.getAllCountries';

    /** 設定讀寫 */
    function loadConfig() {
        return {
            enablePersonalBonus: GM_getValue(STORAGE_KEYS.ENABLE_PERSONAL_BONUS, false),
            playerCountryId: GM_getValue(STORAGE_KEYS.PLAYER_COUNTRY_ID, DEFAULT_PLAYER_COUNTRY_ID),
            colShowSides: GM_getValue(STORAGE_KEYS.COL_SHOW_SIDES, true),
            colShowOrigin: GM_getValue(STORAGE_KEYS.COL_SHOW_ORIGIN, true),
            colShowDef: GM_getValue(STORAGE_KEYS.COL_SHOW_DEF, true),
            colShowAtk: GM_getValue(STORAGE_KEYS.COL_SHOW_ATK, true),
            colShowPool: GM_getValue(STORAGE_KEYS.COL_SHOW_POOL, true),
            colShowDbg: GM_getValue(STORAGE_KEYS.COL_SHOW_DBG, true),
        };
    }

    /** 請求（含錯誤輸出與 fetch 後援） */
    function getJson(url) {
        return new Promise((resolve, reject) => {
            try {
                if (typeof GM_xmlhttpRequest === 'function') {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url,
                        responseType: 'json',
                        onload: (res) => {
                            try {
                                const data = res.response ?? JSON.parse(res.responseText);
                                resolve(data);
                            } catch (e) {
                                console.error('[Warera Script] parse error for', url, e, res);
                                reject(e);
                            }
                        },
                        onerror: (e) => {
                            console.error('[Warera Script] GM_xhr error for', url, e);
                            reject(e);
                        }
                    });
                } else {
                    fetch(url, { credentials: 'omit' })
                        .then(r => r.json())
                        .then(resolve)
                        .catch(err => { console.error('[Warera Script] fetch error for', url, err); reject(err); });
                }
            } catch (err) {
                console.error('[Warera Script] getJson exception for', url, err);
                reject(err);
            }
        });
    }

    // 讀取是否連到首都（不同版本欄位名可能不同）
    function readLinkedToCapital(r) {
        const v =
              r?.isLinkedToCapital ??
              r?.linkedToCapital ??
              r?.isConnectedToCapital ??
              r?.connectedToCapital ??
              r?.isConnected ??
              r?.linked;
        return !!v;
    }

    // ---- 連線旗標：保留三態（true/false/undefined）
    function readSideLinkedFlagRaw(sideObj) {
        if (sideObj == null) return undefined;
        return (
            sideObj.isLinkedToCapital ??
            sideObj.linkedToCapital ??
            sideObj.isConnectedToCapital ??
            sideObj.connectedToCapital
        );
    }
    // 守方是否斷鏈：先以 battle 即時旗標為準，未知時回退 region（較慢、可能延遲）
    function computeDisconnected(battleSideDef, regionObj) {
        const flag = readSideLinkedFlagRaw(battleSideDef);
        if (flag === false) return true;
        if (flag === true) return false;
        const regionLikelyDisconnected =
              regionObj?.isCapital === false && regionObj?.isLinkedToCapital === false;
        return !!regionLikelyDisconnected;
    }

    // —— Debug 收集：battleId -> snapshot —— //
    const __DBG = new Map();
    let __DBG_OPEN_ID = null;

    /** 區域正規化 */
    function normalizeRegion(r) {
        const u =
              (r?.upgradesV2 && (r?.upgradesV2.upgrades ?? r?.upgradesV2)) ||
              r?.upgrades ||
              r?.regionUpgrades ||
              {};
        return {
            isCapital: !!(r?.isCapital || r?.capital),
            isLinkedToCapital: readLinkedToCapital(r),
            resistance: Number(r?.resistance ?? 0),
            upgrades: u,
            coreCountries: Array.isArray(r?.coreCountries) ? r.coreCountries : [],
            coreOf: Array.isArray(r?.coreOf) ? r?.coreOf : [],
            coreCountry: r?.coreCountry || r?.originalCountry || null,
        };
    }

    function __extractCountryIdMaybe(v) {
        if (!v) return null;
        if (typeof v === 'string') return v;
        if (typeof v === 'object') {
            if (typeof v._id === 'string') return v._id;
            if (typeof v.id === 'string') return v.id;
            if (typeof v.country === 'string') return v.country;
            if (v.country && typeof v.country._id === 'string') return v.country._id;
            if (v.owner && typeof v.owner._id === 'string') return v.owner._id;
        }
        return null;
    }

    // 從 regions 的 raw 物件讀出「原有國家」countryId（容錯加強版）
    function readOriginalCountryIdFromRegionRaw(r, countriesById) {
        if (!r || typeof r !== 'object') return null;

        // 1) 先嘗試常見鍵位（字串或物件都接）
        const directCandidates = [
            r.coreCountry, r.originalCountry,
            r.coreCountryId, r.originalCountryId,
            r.originalOwner, r.owner,
            r?.core?.country, r?.core, r?.origin, r?.original
        ];
        for (const v of directCandidates) {
            const id = __extractCountryIdMaybe(v);
            if (id) return id;
        }

        // 2) coreCountries 可能是陣列或物件 map
        const cc = r.coreCountries || r.cores || r.coreOf || r.isCoreFor;
        if (Array.isArray(cc)) {
            for (const it of cc) {
                const id = __extractCountryIdMaybe(it);
                if (id) return id;
            }
        } else if (cc && typeof cc === 'object') {
            const ks = Object.keys(cc);
            if (ks.length > 0) return ks[0];
        }

        // 3) 名稱/代碼反查
        const byName = r.coreCountryName || r.originalCountryName || r.countryName || null;
        const byCode = r.coreCountryCode || r.originalCountryCode || r.countryCode || null;
        if (countriesById && (byName || byCode)) {
            for (const [cid, cobj] of Object.entries(countriesById)) {
                if (byName && cobj?.name && String(cobj.name).toLowerCase() === String(byName).toLowerCase()) return cid;
                if (byCode && cobj?.code && String(cobj.code).toLowerCase() === String(byCode).toLowerCase()) return cid;
            }
        }

        return null;
    }

    /** 升級 meta 解析（含 status/enabled） */
    function parseUpgradeMetaFromApi(resp) {
        const d = resp?.result?.data ?? resp?.data ?? resp ?? {};
        // level
        const lvlCandidates = [
            d.level, d.value, d.lvl,
            d?.upgrade?.level, d?.upgrade?.currentLevel, d?.upgrade?.value
        ];
        let level = 0;
        for (const v of lvlCandidates) {
            const n = Number(v);
            if (Number.isFinite(n) && n >= 0) { level = n; break; }
        }
        // status/enabled
        const rawStatus = (d.status ?? d?.upgrade?.status ?? d?.state ?? null);
        const status = rawStatus ? String(rawStatus).toLowerCase() : undefined;
        const enabledCand = [
            d.enabled, d.isEnabled, d.active, d.isActive,
            d?.upgrade?.enabled, d?.upgrade?.isEnabled, d?.upgrade?.active, d?.upgrade?.isActive,
        ];
        let enabled;
        for (const v of enabledCand) { if (typeof v === 'boolean') { enabled = v; break; } }

        return {
            level,
            status,        // 'active' / 'disabled' / ...
            enabled,       // boolean | undefined
            disabledReason: d.disabledReason ?? d?.upgrade?.disabledReason ?? null,
            maintenanceUntil: d.maintenanceUntil ?? d?.upgrade?.maintenanceUntil ?? d?.expiresAt ?? null,
        };
    }

    // ==== 升級查詢：5 分鐘 TTL 快取（記憶體 + GM 持久）====
    const UPG_TTL_MS = 5 * 60 * 1000;
    const memUpgCache = new Map(); // key: `upg_${regionId}:${type}` -> { meta, ts }
    const upgKey = (regionId, type) => `upg_${regionId}:${type}`;

    async function fetchUpgradeMeta(regionId, type) {
        if (!regionId) return { level: 0 };
        const key = upgKey(regionId, type);
        const now = Date.now();

        const m = memUpgCache.get(key);
        if (m && now - m.ts < UPG_TTL_MS) return m.meta;

        try {
            const g = GM_getValue(key, null);
            if (g && typeof g === 'object' && now - g.ts < UPG_TTL_MS && g.meta) {
                memUpgCache.set(key, g);
                return g.meta;
            }
        } catch {}

        const url =
              'https://api2.warera.io/trpc/upgrade.getUpgradeByTypeAndEntity?input=' +
              encodeURIComponent(JSON.stringify({ upgradeType: String(type), regionId: String(regionId) }));
        try {
            const json = await getJson(url);
            const meta = parseUpgradeMetaFromApi(json);
            const rec = { meta, ts: now };
            memUpgCache.set(key, rec);
            try { GM_setValue(key, rec); } catch {}
            return meta;
        } catch (e) {
            console.warn('[Warera Script] upgrade API failed', type, regionId, e);
            return { level: 0 };
        }
    }

    /** 從 regions 物件兜出等級（舊版/後援） */
    function getUpgradeLevel(regionObj, key) {
        const keys = (Array.isArray(key) ? key : [key]).map(k => String(k).toLowerCase());
        const u = regionObj?.upgrades;

        const readLvl = (v) => {
            if (v == null) return 0;
            if (typeof v === 'number') return v;
            if (typeof v === 'string') return Number(v) || 0;
            if (typeof v === 'object') {
                const cand = [v.level, v.lvl, v.currentLevel, v.value];
                for (const c of cand) {
                    const n = Number(c);
                    if (!isNaN(n) && isFinite(n)) return n;
                }
            }
            return 0;
        };

        if (Array.isArray(u)) {
            let item = u.find(it => keys.includes(String(it?.type ?? it?.name ?? it?.key ?? '').toLowerCase()));
            if (!item) item = u.find(it => /bunker/i.test(String(it?.type ?? it?.name ?? it?.key ?? '')));
            return readLvl(item);
        }

        if (u && typeof u === 'object') {
            for (const k of keys) {
                const v1 = u?.[k]; if (v1 != null) return readLvl(v1);
                const v2 = u?.defense?.[k]; if (v2 != null) return readLvl(v2);
            }
            for (const [k, v] of Object.entries(u)) {
                if (/bunker/i.test(k)) return readLvl(v);
                if (v && typeof v === 'object') {
                    for (const [kk, vv] of Object.entries(v)) {
                        if (/bunker/i.test(kk)) return readLvl(vv);
                    }
                }
            }
        }
        return 0;
    }

    function levelToPct(level) {
        const table = [0, 5, 10, 15, 20, 25];
        let idx = Number(level);
        if (!isFinite(idx)) idx = 0;
        idx = Math.max(0, Math.min(5, Math.floor(idx)));
        return table[idx] / 100;
    }

    function isCoreForCountry(regionObj, countryId) {
        if (!countryId) return false;
        const a = regionObj?.coreCountries || regionObj?.cores || regionObj?.coreOf || regionObj?.isCoreFor;
        if (Array.isArray(a)) return a.includes(countryId);
        if (a && typeof a === 'object') return !!a[countryId];
        if (typeof regionObj?.coreCountryId === 'string') return regionObj.coreCountryId === countryId;
        return false;
    }

    // ---- Orders / MU HQ
    function readSidePolicyBonuses(sideObj, battleObj, role /* 'attacker' | 'defender' */) {
        // Orders (<= 15%)
        const orderCands = [
            sideObj?.ordersBonus, sideObj?.orderBonus,
            sideObj?.orders?.value, sideObj?.orders,
            battleObj?.[role + 'Orders'], battleObj?.[role + 'OrdersPct'],
            battleObj?.orders?.[role], battleObj?.orders?.[role]?.value,
            battleObj?.bonuses?.[role]?.orders, battleObj?.policies?.[role]?.orders
        ];
        let ordersPct = 0;
        for (const x of orderCands) {
            const n = Number(typeof x === 'object' ? x?.value : x);
            if (isFinite(n) && !isNaN(n) && n > 0) { ordersPct = Math.min(0.15, Math.max(0, n / 100)); break; }
        }

        // MU HQ (0~5 → 0/5/10/15/20/25%)
        const muLevelCands = [
            sideObj?.muHqLevel, sideObj?.hqLevel,
            sideObj?.mu?.hqLevel, sideObj?.mu?.hq?.level,
            sideObj?.militaryUnit?.hqLevel, sideObj?.militaryUnit?.hq?.level,
            battleObj?.[role]?.muHqLevel, battleObj?.[role]?.mu?.hqLevel, battleObj?.[role]?.mu?.hq?.level
        ];
        let muPct = 0;
        for (const lv of muLevelCands) {
            const n = Number(lv);
            if (isFinite(n) && !isNaN(n) && n >= 0) { muPct = levelToPct(n); break; }
        }
        return { ordersPct, muPct };
    }

    // ---- 起義判定與 % 讀取
    function isRevoltBattle(b) {
        return !!(
            b?.type === 'revolt' ||
            b?.type === 'resistance' ||
            b?.isRevolt === true ||
            b?.isResistance === true ||
            b?.attacker?.isRevolt === true ||
            b?.defender?.isRevolt === true
        );
    }
    function readResistancePct(battleObj, regionObj) {
        const cands = [
            battleObj?.revoltResistance,
            battleObj?.resistancePercent,
            battleObj?.resistancePct,
            battleObj?.resistance,
            battleObj?.attacker?.resistance,
            battleObj?.defender?.resistance,
            regionObj?.resistance
        ];
        for (const x of cands) {
            const n = Number(x);
            if (isFinite(n) && !isNaN(n) && n > 0) return n / 100;
        }
        return 0;
    }

    function personalBonusMultiplier(sideCountryId, opponentCountryId, playerCountry, enable) {
        if (!enable || !playerCountry) return 1.0;
        let mul = 1.0;
        const allies = Array.isArray(playerCountry.allies) ? playerCountry.allies : [];
        const enemy = playerCountry.enemy ?? null;
        if (sideCountryId && allies.includes(sideCountryId)) mul *= 1.10;
        if (opponentCountryId && enemy && enemy === opponentCountryId) mul *= 1.10;
        return mul;
    }

    function calcEffective(side, otherSide, playerCountry, enablePersonalBonus, isRevolt, ctx) {
        const m = Number(side.moneyPer1kDamages) || 0;
        if (m <= 0) return 0;

        let pct = 0;

        if (side.role === 'attacker') {
            if (isRevolt) pct += Number(ctx?.revoltResPct) || 0;
            pct += Number(ctx?.atkBasePct) || 0;
            pct += Number(ctx?.attackerOrdersPct) || 0;
            pct += Number(ctx?.attackerMuPct) || 0;
        } else {
            if (ctx?.disconnected) pct += DEFENDER_DISCONNECTED_PENALTY;
            if (ctx?.defIsCoreForDefender) pct += 0.15;
            pct += Number(ctx?.defBunkerPct) || 0;
            pct += Number(ctx?.defenderOrdersPct) || 0;
            pct += Number(ctx?.defenderMuPct) || 0;
        }

        // 個人化已拔除，這裡仍保留但預設 false -> 1.0
        const pMul = enablePersonalBonus ? personalBonusMultiplier(side.country, otherSide.country, playerCountry, true) : 1.0;

        const eff = m * (1 + pct) * pMul;
        return Number.isFinite(eff) && eff > 0 ? +eff : 0;
    }
    async function fetchAndRender() {
        let errorMsg = '';
        try {
            showLoading();

            const cfg = loadConfig();

            const [battlesResp, regionsResp, countriesResp] = await Promise.all([
                getJson(BATTLES_URL).catch(e => { errorMsg = 'battle.getBattles 失敗'; throw e; }),
                getJson(REGIONS_URL).catch(e => { errorMsg = errorMsg || 'region.getRegionsObject 失敗'; throw e; }),
                getJson(COUNTRIES_URL).catch(e => { errorMsg = errorMsg || 'country.getAllCountries 失敗'; throw e; })
            ]);

            const battles = battlesResp?.result?.data?.items;
            const regionsMap = regionsResp?.result?.data;
            const countries = countriesResp?.result?.data;

            if (!Array.isArray(battles)) errorMsg = errorMsg || 'battle.getBattles 回傳格式異常（items 缺失）';
            if (!regionsMap) errorMsg = errorMsg || 'region.getRegionsObject 回傳格式異常';

            const countriesById = {};
            if (Array.isArray(countries)) for (const c of countries) countriesById[c?._id] = c;

            const list = Array.isArray(battles)
            ? await buildAndSortCandidates(battles, regionsMap || {}, countriesById, cfg)
            : [];
            lastList = list;

            hideLoading();
            renderPanel(list, errorMsg || '');
        } catch (err) {
            console.error('[Warera Script] fetchAndRender error:', err);
            hideLoading();
            renderPanel([], errorMsg || '未知錯誤，詳見 Console。');
        }
    }

    /** 建表排序（延後且有條件查升級；能不用就不用打 upgrade API） */
    async function buildAndSortCandidates(battles, regionsMap, countriesById, cfg) {
        const list = [];
        const playerCountry = countriesById?.[cfg.playerCountryId] ?? null;

        const validBattles = (battles || []).filter(b => {
            if (!b?.isActive) return false;
            const atkPool = Number(b?.attacker?.moneyPool ?? 0);
            const defPool = Number(b?.defender?.moneyPool ?? 0);
            return atkPool > 0 || defPool > 0;
        });

        for (const b of validBattles) {
            const defRegionId = b?.defender?.region ?? b?.region ?? null;
            const atkOriginId = b?.attacker?.region ?? null;

            const defRegionRaw = regionsMap?.[defRegionId] ?? {};
            const atkOriginRegionRaw = regionsMap?.[atkOriginId] ?? {};

            const defRegion = normalizeRegion(defRegionRaw);
            const atkOriginRegion = normalizeRegion(atkOriginRegionRaw);

            // 區域名稱（容錯）
            const defRegionName = String(
                defRegionRaw?.name ??
                defRegionRaw?.regionName ??
                defRegionRaw?.title ??
                defRegionRaw?.displayName ??
                defRegionRaw?.slug ??
                defRegionId ?? ''
            );

            const originalCountryId = readOriginalCountryIdFromRegionRaw(defRegionRaw, countriesById);
            const originalCountryName = originalCountryId ? (countriesById?.[originalCountryId]?.name ?? '') : '';
            if (!originalCountryId) {
                console.debug('[Warera Script] 未解析到原有國家：', defRegionId, defRegionRaw);
                console.debug('[Warera Script] region raw keys:', defRegionId, Object.keys(defRegionRaw || {}));
            }
            const defenderCountryId = b?.defender?.country ?? null;
            const defenderCountryName = defenderCountryId ? (countriesById?.[defenderCountryId]?.name ?? '') : '';

            const attackerCountryName = b?.attacker?.country ? (countriesById?.[b.attacker.country]?.name ?? '') : '';

            const atkMoney = Number(b?.attacker?.moneyPer1kDamages ?? DEFAULT_MONEY_PER_1K);
            const defMoney = Number(b?.defender?.moneyPer1kDamages ?? DEFAULT_MONEY_PER_1K);

            const atkPool = Number(b?.attacker?.moneyPool ?? 0);
            const defPool = Number(b?.defender?.moneyPool ?? 0);

            const attackerSide = { role: 'attacker', moneyPer1kDamages: atkMoney, country: b?.attacker?.country };
            const defenderSide = { role: 'defender', moneyPer1kDamages: defMoney, country: b?.defender?.country };

            const revolt = isRevoltBattle(b);
            const revoltResPct = revolt ? readResistancePct(b, defRegion) : 0;

            const disconnected = computeDisconnected(b?.defender, defRegion);
            const defIsCoreForDefender = isCoreForCountry(defRegion, b?.defender?.country);

            // === Military Base（攻方%）— 有獎池就查 API，成功以 API 為準
            let atkBasePct = 0;
            let baseMetaApi = null;
            if (atkPool > 0 && atkMoney > 0) {
                // 先從快照抓等級
                const baseLvlSnap = getUpgradeLevel(atkOriginRegion, ['base','militaryBase']);

                try {
                    if (atkOriginId) baseMetaApi = await fetchUpgradeMeta(atkOriginId, 'base');
                } catch {}

                // 嘗試直接讀 battle 的即時數值（若有）
                const basePctRealtime = (b?.bonuses?.attacker?.basePct) ?? (b?.policies?.attacker?.basePct);
                if (basePctRealtime != null && !isNaN(Number(basePctRealtime))) {
                    const v = Number(basePctRealtime);
                    atkBasePct = v > 1 ? v / 100 : v;
                } else {
                    let baseLvl = Number(baseMetaApi?.level);
                    if (!Number.isFinite(baseLvl)) baseLvl = baseLvlSnap;
                    atkBasePct = levelToPct(baseLvl);
                }

                // Debug
                __DBG.set(b?._id, Object.assign(__DBG.get(b?._id) || {}, {
                    base: { api: baseMetaApi },
                }));
            }

            // === Bunker（守方%）— battle 即時值最高優先；否則查 API，失敗才退快照
            let defBunkerPct = 0;
            let bunkerMetaApi = null;
            if (defPool > 0 && defMoney > 0) {
                const bunkerPctRealtime =
                      (b?.bonuses?.defender?.bunkerPct) ?? (b?.policies?.defender?.bunkerPct);

                if (bunkerPctRealtime != null && !isNaN(Number(bunkerPctRealtime))) {
                    // 可能是 0.15 或 15（代表 15%），統一轉成倍率
                    const v = Number(bunkerPctRealtime);
                    defBunkerPct = v > 1 ? v / 100 : v;
                } else {
                    const bunkerLvlSnap = getUpgradeLevel(defRegion, ['bunker','bunkers','shelter']);
                    try { if (defRegionId) bunkerMetaApi = await fetchUpgradeMeta(defRegionId, 'bunker'); } catch {}
                    let bunkerDisabled = false;
                    let bunkerLvl = Number(bunkerMetaApi?.level);
                    if (!Number.isFinite(bunkerLvl)) bunkerLvl = bunkerLvlSnap;

                    if (typeof bunkerMetaApi?.enabled === 'boolean') bunkerDisabled = !bunkerMetaApi.enabled;
                    const statusStr = String(bunkerMetaApi?.status || '').toLowerCase();
                    if (statusStr === 'disabled') bunkerDisabled = true;

                    defBunkerPct = bunkerDisabled ? 0 : levelToPct(bunkerLvl);
                }

                // Debug
                __DBG.set(b?._id, Object.assign(__DBG.get(b?._id) || {}, { bunker: { api: bunkerMetaApi } }));
            }

            const { ordersPct: attackerOrdersPct, muPct: attackerMuPct } = readSidePolicyBonuses(b?.attacker, b, 'attacker');
            const { ordersPct: defenderOrdersPct, muPct: defenderMuPct } = readSidePolicyBonuses(b?.defender, b, 'defender');

            const ctx = {
                defIsCoreForDefender,
                atkBasePct,
                defBunkerPct,
                attackerOrdersPct,
                defenderOrdersPct,
                attackerMuPct,
                defenderMuPct,
                disconnected,
                revoltResPct
            };

            // 個人化倍率（用於 Debug 顯示）
            const pMulAtk = personalBonusMultiplier(attackerSide.country, defenderSide.country, playerCountry, cfg.enablePersonalBonus);
            const pMulDef = personalBonusMultiplier(defenderSide.country, attackerSide.country, playerCountry, cfg.enablePersonalBonus);

            let atkEff = 0, defEff = 0;
            if (atkPool > 0) atkEff = calcEffective(attackerSide, defenderSide, playerCountry, cfg.enablePersonalBonus, revolt, ctx);
            if (defPool > 0) defEff = calcEffective(defenderSide, attackerSide, playerCountry, cfg.enablePersonalBonus, revolt, ctx);

            const bestEff = Math.max(atkEff, defEff);
            const bestSide = atkEff >= defEff ? '攻方' : '守方';

            // —— 寫入 Debug Snapshot —— //
            __DBG.set(b?._id, {
                type: b?.type,
                regionId: defRegionId,
                disconnected,
                defIsCoreForDefender,
                revolt,
                revoltResPct,
                atkBasePct,
                defBunkerPct,
                bunker: { api: bunkerMetaApi },
                base: { api: baseMetaApi },
                attackerOrdersPct,
                defenderOrdersPct,
                attackerMuPct,
                defenderMuPct,
                pools: { atkPool, defPool },
                moneyPer1k: { atkMoney, defMoney },
                personalMul: { atk: pMulAtk, def: pMulDef },
                result: { atkEff, defEff }
            });

            // —— 列表資料 —— //
            list.push({
                battleId: b?._id,
                regionId: defRegionId,
                regionName: defRegionName,
                defenderCountryName,
                attackerCountryName,
                originalCountryName,
                atkEff, defEff, bestEff, bestSide,
                meta: {
                    atkMoney, defMoney, atkPool, defPool,
                    attackerCountry: b?.attacker?.country ?? null,
                    defenderCountry: defenderCountryId ?? null
                }
            });
        }

        list.sort((a, b) => b.bestEff - a.bestEff);
        return list;
    }
    function getScrollbarWidth() {
        const t = document.createElement('div');
        t.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:100px;height:100px;overflow:scroll;';
        document.body.appendChild(t);
        const w = t.offsetWidth - t.clientWidth;
        document.body.removeChild(t);
        // 有些瀏覽器是 overlay scrollbar 會回 0，給個保守值 16 當保底
        return (Number.isFinite(w) && w > 0) ? w : 16;
    }

    /** UI 面板 */
    function renderPanel(candidates, errorText) {
        // 舊面板清掉
        const old = document.getElementById('warera-yield-panel');
        if (old) old.remove();

        // Panel
        const panel = document.createElement('div');
        panel.id = 'warera-yield-panel';
        panel.style.cssText = [
            'position:fixed','top:12px','left:12px','z-index:999998',
            'background:rgba(0,0,0,0.88)','color:#fff',
            'font:13px/1.5 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial',
            'padding:12px','border:1px solid rgba(255,255,255,0.2)','border-radius:10px',
            'max-width:min(96vw, 1120px)',
            'max-height:80vh','overflow-y:auto','overflow-x:visible',
            '-webkit-overflow-scrolling:touch','touch-action:pan-y pinch-zoom',
            'box-shadow:0 6px 18px rgba(0,0,0,0.45)'
        ].join(';');
        function fmt3(n){ const x = Number(n); return Number.isFinite(x) ? x.toFixed(3) : '0.000'; }

        /* ===== 標題列：左「隱藏」＋「重新整理」 ===== */
        const header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;justify-content:flex-start;margin-bottom:8px;gap:8px;';

        /** 統一按鈕樣式的小工具 */
        function makeBtn(content, title, onClick, opts = {}) {
            const btn = document.createElement('button');
            if (opts.html) btn.innerHTML = content; else btn.textContent = content;
            btn.title = title || '';
            btn.onclick = onClick;
            btn.style.cssText = [
                'cursor:pointer',
                'display:inline-flex','align-items:center','justify-content:center',
                'height:36px',
                'padding:0 10px',
                'border-radius:8px',
                'border:1px solid #4b5563',
                'background:#1f2937','color:#fff',
                'line-height:1','font-size:14px',
                'appearance:none','-webkit-appearance:none',
                'box-sizing:border-box'
            ].join(';');

            // 純圖示鈕：做成正方形
            if (opts.square) {
                btn.style.width = '36px';
                btn.style.padding = '0';
                if (opts.iconSize) btn.style.fontSize = opts.iconSize;
            }

            return btn;
        }
        const hideBtn = makeBtn('隱藏', '隱藏面板（Shift+W 也可切換）', () => setPanelVisible(false));
        const refreshBtn = makeBtn(
            '⟳',
            '重新整理',
            async (e) => {
                e.preventDefault();
                e.stopPropagation();
                refreshBtn.disabled = true;
                const old = refreshBtn.textContent;
                refreshBtn.textContent = '…';
                try { await fetchAndRender(); }
                finally { refreshBtn.disabled = false; refreshBtn.textContent = old; }
            },
            { html: false, square: true, iconSize: '16px' }
        );

        const settingsBtn = makeBtn('⚙︎', '欄位顯示設定', () => toggleSettingsMenu(), {
            html: false, square: true, iconSize: '16px'
        });

        settingsBtn.style.marginLeft = 'auto';

        // 設定選單（懸浮）
        const settingsWrap = document.createElement('div');
        settingsWrap.id = 'warera-settings';
        settingsWrap.style.cssText =
            'position:absolute;top:48px;right:12px;left:auto;z-index:1000000;display:none;' +
            'background:#0b0f17;border:1px solid #334155;border-radius:8px;padding:8px;color:#fff;min-width:220px;';
        panel.appendChild(settingsWrap);

        function toggleSettingsMenu() {
            const visible = settingsWrap.style.display !== '' && settingsWrap.style.display !== 'block';
            settingsWrap.style.display = visible ? 'block' : 'none';
            if (visible) renderSettings();
        }

        function renderSettings() {
            const cfgLocal = loadConfig();
            settingsWrap.innerHTML = `
    <div style="font-weight:700;margin-bottom:6px;">欄位顯示</div>

    <label style="display:flex;align-items:center;gap:6px;margin:6px 0;">
      <input id="warera-opt-sides" type="checkbox" ${cfgLocal.colShowSides ? 'checked' : ''} />
      <span>防守方/進攻方</span>
    </label>

    <label style="display:flex;align-items:center;gap:6px;margin:6px 0;">
      <input id="warera-opt-origin" type="checkbox" ${cfgLocal.colShowOrigin ? 'checked' : ''} />
      <span>原始領國</span>
    </label>

    <label style="display:flex;align-items:center;gap:6px;margin:6px 0;">
      <input id="warera-opt-def" type="checkbox" ${cfgLocal.colShowDef ? 'checked' : ''} />
      <span>守方收益</span>
    </label>

    <label style="display:flex;align-items:center;gap:6px;margin:6px 0;">
      <input id="warera-opt-atk" type="checkbox" ${cfgLocal.colShowAtk ? 'checked' : ''} />
      <span>攻方收益</span>
    </label>

    <label style="display:flex;align-items:center;gap:6px;margin:6px 0;">
      <input id="warera-opt-pool" type="checkbox" ${cfgLocal.colShowPool ? 'checked' : ''} />
      <span>獎池剩餘(守/攻)</span>
    </label>

    <label style="display:flex;align-items:center;gap:6px;margin:6px 0;">
      <input id="warera-opt-dbg" type="checkbox" ${cfgLocal.colShowDbg ? 'checked' : ''} />
      <span>Debug 按鈕</span>
    </label>

    <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">
      <button id="warera-opt-selectall" style="padding:4px 8px;border:1px solid #4b5563;border-radius:6px;background:#111827;color:#fff;cursor:pointer">全選</button>
      <button id="warera-opt-clear" style="padding:4px 8px;border:1px solid #4b5563;border-radius:6px;background:#111827;color:#fff;cursor:pointer">清除</button>
      <span style="flex:1 1 auto"></span>
      <button id="warera-opt-apply" style="padding:4px 8px;border:1px solid #4b5563;border-radius:6px;background:#111827;color:#fff;cursor:pointer">套用</button>
      <button id="warera-opt-close" style="padding:4px 8px;border:1px solid #4b5563;border-radius:6px;background:#111827;color:#fff;cursor:pointer">關閉</button>
    </div>
  `;

            // 取得所有 checkbox 的 DOM
            const boxes = [
                'warera-opt-sides',
                'warera-opt-origin',
                'warera-opt-def',
                'warera-opt-atk',
                'warera-opt-pool',
                'warera-opt-dbg'
            ].map(id => document.getElementById(id));

            // 封裝：將所有核取方塊設為同一狀態
            const setAll = (val) => { boxes.forEach(b => { if (b) b.checked = !!val; }); };

            document.getElementById('warera-opt-selectall').onclick = () => setAll(true);
            document.getElementById('warera-opt-clear').onclick = () => setAll(false);

            document.getElementById('warera-opt-apply').onclick = async () => {
                try {
                    GM_setValue(STORAGE_KEYS.COL_SHOW_SIDES, !!document.getElementById('warera-opt-sides').checked);
                    GM_setValue(STORAGE_KEYS.COL_SHOW_ORIGIN, !!document.getElementById('warera-opt-origin').checked);
                    GM_setValue(STORAGE_KEYS.COL_SHOW_DEF, !!document.getElementById('warera-opt-def').checked);
                    GM_setValue(STORAGE_KEYS.COL_SHOW_ATK, !!document.getElementById('warera-opt-atk').checked);
                    GM_setValue(STORAGE_KEYS.COL_SHOW_POOL, !!document.getElementById('warera-opt-pool').checked);
                    GM_setValue(STORAGE_KEYS.COL_SHOW_DBG, !!document.getElementById('warera-opt-dbg').checked);
                } catch (e) {}
                settingsWrap.style.display = 'none';
                // 依新設定重新渲染（不重新打 API）
                renderPanel(lastList, '');
            };

            document.getElementById('warera-opt-close').onclick = () => { settingsWrap.style.display = 'none'; };
        }

        header.appendChild(hideBtn);
        header.appendChild(refreshBtn);
        header.appendChild(settingsBtn);
        panel.appendChild(header);

        /* ===== 內容容器 ===== */
        const content = document.createElement('div');
        content.id = 'warera-panel-body';

        // 錯誤訊息
        if (errorText) {
            const err = document.createElement('div');
            err.style.cssText = 'background:#7f1d1d;color:#fff;padding:8px;border-radius:6px;margin-bottom:8px;border:1px solid #f87171;';
            err.textContent = errorText;
            content.appendChild(err);
        }

        const hint = document.createElement('div');
        hint.textContent = '[Shift+W]顯示/隱藏';
        hint.style.cssText = 'opacity:0.85;margin-bottom:8px;';
        content.appendChild(hint);

        // === 表格 ===
        const scrollX = document.createElement('div');
        scrollX.style.cssText = [
            'overflow-x:auto',
            'overflow-y:hidden',
            '-webkit-overflow-scrolling:touch',
            'touch-action:pan-x pan-y pinch-zoom',
            'overscroll-behavior-x:contain',
            'margin-bottom:4px'
        ].join(';');

        const table = document.createElement('table');
        // 讓表格「撐開」而不是被壓縮在容器內
        table.style.cssText = [
            'border-collapse:collapse',
            'table-layout:auto',
            'width:max-content',
            'min-width:100%'
        ].join(';');

        const thead = document.createElement('thead');
        const cfg2 = loadConfig();
        const SBW = getScrollbarWidth();
        const SPACER = Math.max(16, Math.ceil(SBW)) + 8;
        const needRightGutter =
              cfg2.colShowDbg && (panel.scrollHeight > panel.clientHeight);

        scrollX.style.paddingRight = needRightGutter ? `${SPACER}px` : '0';
        scrollX.style.boxSizing   = needRightGutter ? 'content-box' : 'border-box';
        let columns = [
            { key: '#', label: '#', buildCell: (c, idx) => String(idx + 1) },
            { key: 'place', label: '戰場位置', buildCell: (c) => {
                const td = document.createElement('td');
                td.style.cssText = 'padding:6px 4px;max-width:280px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
                const goPath = `/battle/${c.battleId}`;
                const place = c.regionName || c.battleId;
                const linkLike = document.createElement('a');
                linkLike.textContent = place;
                linkLike.title = place;
                linkLike.href = goPath;
                linkLike.setAttribute('data-warera-link', '1');
                linkLike.style.cssText = 'color:#8bd3ff;text-decoration:none;cursor:pointer;';
                td.appendChild(linkLike);
                return td;
            }},
            { key: 'best', label: '建議陣營', buildCell: (c) => (c.bestSide === '攻方' ? '進攻方' : '防守方') },
        ];

        if (cfg2.colShowSides) {
            columns.push({
                key: 'sides',
                label: '防守方/進攻方',
                buildCell: (c) => `${c.defenderCountryName || ''}/${c.attackerCountryName || ''}`
            });
        }

        if (cfg2.colShowOrigin) {
            columns.push({
                key: 'origin',
                label: '原始領國',
                buildCell: (c) => c.originalCountryName || ''
            });
        }

        if (cfg2.colShowDef) {
            columns.push({ key: 'def', label: '守方收益', buildCell: (c) => c.defEff.toFixed(3) });
        }

        if (cfg2.colShowAtk) {
            columns.push({ key: 'atk', label: '攻方收益', buildCell: (c) => c.atkEff.toFixed(3) });
        }

        if (cfg2.colShowPool) {
            columns.push({
                key: 'pool',
                label: '獎池剩餘(守/攻)',
                buildCell: (c) => `${fmt3(c.meta.defPool)} / ${fmt3(c.meta.atkPool)}`
            });
        }

        if (cfg2.colShowDbg) {
            columns.push({
                key: 'dbg',
                label: 'Debug',
                buildCell: (c) => {
                    const td = document.createElement('td');
                    td.style.cssText = 'padding:6px 4px;white-space:nowrap;';
                    const btn = document.createElement('button');
                    btn.textContent = 'Debug';
                    btn.style.cssText =
                        'cursor:pointer;padding:2px 6px;border-radius:6px;border:1px solid #4b5563;background:#111827;color:#fff;';
                    btn.onclick = () => toggleDebugModal(c.battleId);
                    td.appendChild(btn);
                    return td;
                }
            });
        }

        // 表頭
        thead.innerHTML = `<tr style="text-align:left;border-bottom:1px solid rgba(255,255,255,0.2);">
  ${columns.map((col) =>
                `<th style="padding:6px 4px;white-space:nowrap;">${col.label}</th>`
               ).join('')}
</tr>`;
        table.appendChild(thead);

        // 表身
        const tbody = document.createElement('tbody');
        if (Array.isArray(candidates) && candidates.length > 0) {
            const topN = candidates.slice(0, RANK_LIMIT);
            topN.forEach((c, idx) => {
                const tr = document.createElement('tr');
                tr.style.cssText = (idx % 2 === 0) ? 'background:rgba(255,255,255,0.04);' : '';
                columns.forEach((col,j) => {
                    let td;
                    const built = col.buildCell ? col.buildCell(c, idx) : '';
                    if (built && built.nodeType === 1) {
                        td = built;
                    } else {
                        td = document.createElement('td');
                        td.textContent = String(built ?? '');
                        td.style.cssText = 'padding:6px 4px;white-space:nowrap;';
                    }
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
        } else {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = columns.length;
            td.style.cssText = 'padding:10px;opacity:0.85;';
            td.textContent = '沒有可領取的戰場（或 API 無資料）。';
            tr.appendChild(td);
            tbody.appendChild(tr);
        }

        table.appendChild(tbody);

        scrollX.appendChild(table);
        content.appendChild(scrollX);

        panel.appendChild(content);
        document.body.appendChild(panel);

        ensureToggleButton();
        setPanelVisible(getPanelVisible());

    }

    /** —— 建議打：xxx —— */
    let lastList = [];
    function pickThemeGreen() {
        var root = document.querySelector('#main-window') || document.body;
        var nodes = root ? root.querySelectorAll('*') : [];
        for (var i = 0; i < nodes.length; i++) {
            var el = nodes[i], t = (el.textContent || '').trim();
            if (!t || t.length > 12 || !/%$/.test(t)) continue;
            var c = window.getComputedStyle(el).color;
            var m = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/i.exec(c);
            if (!m) continue;
            var r = +m[1], g = +m[2], b = +m[3];
            if (g > r + 20 && g > b + 20 && g >= 100) return c;
        }
        return '#30D158';
    }
    function closestCommonAncestor(a, b, stopAt) {
        var s = new Set(), p = a;
        while (p) { s.add(p); if (p === stopAt) break; p = p.parentElement; }
        p = b;
        while (p) { if (s.has(p)) return p; if (p === stopAt) break; p = p.parentElement; }
        return null;
    }
    function upsertBattleHint(text) {
        var root = document.querySelector('#main-window') || document.body;

        var raw = String(text || '').trim();
        var sideFull =
            /(進攻方|攻方|攻)/.test(raw) ? '進攻方' :
        /(防守方|守方|守)/.test(raw) ? '防守方' :
        raw;

        var finalText = sideFull + '收益最高';

        var supBtns = Array.prototype.slice.call(
            root.querySelectorAll('button')
        ).filter(function (b) {
            return /support/i.test((b.textContent || '').replace(/\s+/g, ''));
        });

        if (supBtns.length >= 2) {
            var lca = closestCommonAncestor(supBtns[0], supBtns[1], root) || root;
            var cs = window.getComputedStyle(lca);
            if (!cs.position || cs.position === 'static') lca.style.position = 'relative';

            var r1 = supBtns[0].getBoundingClientRect();
            var r2 = supBtns[1].getBoundingClientRect();
            var rc = lca.getBoundingClientRect();
            var topPx = Math.max(r1.bottom, r2.bottom) - rc.top + 10;

            var holder = document.getElementById('warera-suggest-holder');
            if (!holder) { holder = document.createElement('div'); holder.id = 'warera-suggest-holder'; lca.appendChild(holder); }

            var isAtk = sideFull === '進攻方';
            holder.style.cssText =
                'position:absolute;left:10px;right:10px;top:' + topPx + 'px;' +
                'display:flex;justify-content:' + (isAtk ? 'flex-end' : 'flex-start') + ';' +
                'align-items:center;pointer-events:none;z-index:2;';
            holder.innerHTML =
                '<span style="pointer-events:none;font-weight:700;color:' + pickThemeGreen() +
                ';text-shadow:0 1px 2px rgba(0,0,0,.85);">' + finalText + '</span>';
            return;
        }

        var bars = root.querySelectorAll("div[style^='width'][style*='background-image']");
        if (!bars.length || !bars[0].parentElement || !bars[0].parentElement.parentElement) return;
        var parentFallback = bars[0].parentElement.parentElement;
        var csfb = window.getComputedStyle(parentFallback);
        if (!csfb.position || csfb.position === 'static') parentFallback.style.position = 'relative';

        var holderFb = document.getElementById('warera-suggest-holder') || document.createElement('div');
        holderFb.id = 'warera-suggest-holder';
        if (!holderFb.parentElement) parentFallback.appendChild(holderFb);

        var isAtkFb = sideFull === '進攻方';
        holderFb.style.cssText =
            'position:absolute;left:10px;right:10px;bottom:10px;' +
            'display:flex;justify-content:' + (isAtkFb ? 'flex-end' : 'flex-start') + ';' +
            'align-items:center;pointer-events:none;z-index:2;';
        holderFb.innerHTML =
            '<span style="pointer-events:none;font-weight:700;color:' + pickThemeGreen() +
            ';text-shadow:0 1px 2px rgba(0,0,0,.85);">' + finalText + '</span>';
    }
    function clearBattleHint() {
        const el = document.getElementById('warera-suggest-holder');
        if (el) el.remove();
    }
    function updateBattleHintFromList() {
        const m = location.pathname.match(/\/battle\/([0-9a-f]{24})/i);
        const id = m ? m[1] : null;
        if (!id) { clearBattleHint(); return; }
        const found = lastList.find(x => x.battleId === id);
        if (!found) { clearBattleHint(); return; }
        let suggest = (found.bestSide === '攻方') ? '進攻方' : '防守方';
        upsertBattleHint(suggest);
    }
    (function setupRouteWatch() {
        const fire = () => setTimeout(updateBattleHintFromList, 80);
        const origPush = history.pushState;
        const origReplace = history.replaceState;
        history.pushState = function(...args){ const r = origPush.apply(this,args); window.dispatchEvent(new Event('locationchange')); return r; };
        history.replaceState = function(...args){ const r = origReplace.apply(this,args); window.dispatchEvent(new Event('locationchange')); return r; };
        window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
        window.addEventListener('locationchange', fire);
        const root = document.getElementById('__next');
        if (root) new MutationObserver(fire).observe(root,{subtree:true,childList:true});
    })();

    /** 載入提示 */
    function showLoading() {
        let n = document.getElementById('warera-yield-loading');
        if (n) return;
        n = document.createElement('div');
        n.id = 'warera-yield-loading';
        n.style.cssText = [
            'position:fixed','top:12px','left:12px','z-index:999999',
            'background:rgba(17,24,39,0.9)','color:#fff','padding:8px 10px',
            'border-radius:8px','border:1px solid rgba(255,255,255,0.2)',
            'font:12px/1.4 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial'
        ].join(';');
        n.textContent = '載入中…';
        document.body.appendChild(n);
    }
    function hideLoading() {
        const n = document.getElementById('warera-yield-loading');
        if (n) n.remove();
    }

    // ===== Debug 視窗 =====
    function toggleDebugModal(battleId) {
        const cur = document.getElementById('warera-dbg');
        const curId = cur?.getAttribute('data-battle-id') || null;
        if (cur && (!battleId || battleId === curId)) {
            closeDebugModal();
            __DBG_OPEN_ID = null;
            return;
        }
        closeDebugModal();
        openDebugModal(battleId);
        __DBG_OPEN_ID = battleId;
    }
    function __dbgEscHandler(e) {
        if (e.key === 'Escape') closeDebugModal();
    }
    function openDebugModal(battleId) {
        const d = __DBG.get(battleId) || {};
        const pct = (x) => (Number(x) ? (Number(x) * 100).toFixed(1) + '%' : '0%');
        const row = (k, v) => `<tr><td style="padding:4px;border-bottom:1px solid #2c2c2c">${k}</td><td style="padding:4px;border-bottom:1px solid #2c2c2c">${v}</td></tr>`;
        const json = (obj) => `<pre style="white-space:pre-wrap;margin:0">${escapeHtml(JSON.stringify(obj, null, 2))}</pre>`;
        const html = `
      <div id="warera-dbg-mask" style="position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:1000000"></div>
      <div id="warera-dbg" style="position:fixed;inset:40px;z-index:1000001;background:#0b0f17;color:#fff;border:1px solid #334155;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.6);overflow:auto;padding:12px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <div style="font-weight:700">Debug – ${battleId}</div>
          <div>
            <button id="warera-dbg-copy" style="margin-right:8px;padding:4px 8px;border:1px solid #4b5563;border-radius:6px;background:#111827;color:#fff;cursor:pointer">Copy JSON</button>
            <button id="warera-dbg-close" style="padding:4px 8px;border:1px solid #4b5563;border-radius:6px;background:#111827;color:#fff;cursor:pointer">Close</button>
          </div>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          ${row('類型', escapeHtml(String(d?.type||'')))}
          ${row('區域ID', escapeHtml(String(d?.regionId||'')))}
          ${row('斷鏈(disconnected)', String(!!d?.disconnected))}
          ${row('核心+15%(def)', String(!!d?.defIsCoreForDefender))}
          ${row('起義?', String(!!d?.revolt))}
          ${row('Resistance%(攻)', pct(d?.revoltResPct))}
          ${row('基地%(攻)', pct(d?.atkBasePct))}
          ${row('地堡%(守)', pct(d?.defBunkerPct))}
          ${row('Bunker狀態', escapeHtml(String(d?.bunker?.api?.status ?? (d?.bunker?.api?.enabled === false ? 'disabled' : 'unknown'))))}
          ${row('Orders%(攻)', pct(d?.attackerOrdersPct))}
          ${row('Orders%(守)', pct(d?.defenderOrdersPct))}
          ${row('MU HQ%(攻)', pct(d?.attackerMuPct))}
          ${row('MU HQ%(守)', pct(d?.defenderMuPct))}
          ${row('Pools(守/攻)', `${Number(d?.pools?.defPool||0).toFixed(3)} / ${Number(d?.pools?.atkPool||0).toFixed(3)}`)}
          ${row('Money/1k(守/攻)', `${Number(d?.moneyPer1k?.defMoney||0).toFixed(3)} / ${Number(d?.moneyPer1k?.atkMoney||0).toFixed(3)}`)}
          ${row('PersonalMul(守/攻)', `${(d?.personalMul?.def||1).toFixed(3)} / ${(d?.personalMul?.atk||1).toFixed(3)}`)}
          ${row('Result def/atk', `${Number(d?.result?.defEff||0).toFixed(3)} / ${Number(d?.result?.atkEff||0).toFixed(3)}`)}
        </table>
        <div style="margin-top:10px;opacity:.8">完整 JSON：</div>
        <div style="margin-top:4px;border:1px solid #2c2c2c;border-radius:8px;padding:8px;background:#0f172a">${json(d)}</div>
      </div>`;
        closeDebugModal();
        const wrap = document.createElement('div');
        wrap.innerHTML = html;
        document.body.appendChild(wrap);
        document.getElementById('warera-dbg').setAttribute('data-battle-id', battleId);
        document.getElementById('warera-dbg-close').onclick = closeDebugModal;
        document.getElementById('warera-dbg-mask').onclick = closeDebugModal;
        document.getElementById('warera-dbg-copy').onclick = () => {
            try { navigator.clipboard.writeText(JSON.stringify(d, null, 2)); } catch(e) {}
        };
        document.addEventListener('keydown', __dbgEscHandler, { passive: true });
    }
    function closeDebugModal() {
        const m = document.getElementById('warera-dbg-mask');
        if (m && m.parentElement) m.parentElement.remove();
        __DBG_OPEN_ID = null;
        try { document.removeEventListener('keydown', __dbgEscHandler, { passive: true }); } catch {}
    }
    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
    }

    const TOGGLE_ID = 'warera-toggle-btn';
    const STORAGE_KEYS2 = { PANEL_VISIBLE: 'warera_panel_visible' };

    function getPanelVisible() {
        return GM_getValue(STORAGE_KEYS2.PANEL_VISIBLE, true);
    }
    function setPanelVisible(v) {
        GM_setValue(STORAGE_KEYS2.PANEL_VISIBLE, !!v);

        const panel = document.getElementById('warera-yield-panel');
        if (panel) panel.style.display = v ? '' : 'none';

        const b = document.getElementById(TOGGLE_ID);
        if (b) {
            b.style.display = v ? 'none' : '';
            b.textContent = '顯示';
            b.title = '顯示面板（Shift+W 也可切換）';
        }
    }

    function ensureToggleButton() {
        if (document.getElementById(TOGGLE_ID)) return;
        const btn = document.createElement('button');
        btn.id = TOGGLE_ID;
        btn.type = 'button';
        btn.textContent = getPanelVisible() ? '隱藏' : '顯示';
        btn.title = '切換面板顯示（Shift+W 也可切換）';
        btn.style.cssText = [
            'position:fixed','left:25px','top:25px','z-index:1000001',
            'display:inline-flex','align-items:center','justify-content:center',
            'height:36px','padding:0 10px','border-radius:8px',
            'background:#1f2937','color:#fff',
            'border:1px solid #4b5563','cursor:pointer',
            'box-shadow:0 4px 12px rgba(0,0,0,.35)','opacity:.9',
            'line-height:1','font-size:14px','box-sizing:border-box',
            'appearance:none','-webkit-appearance:none'
        ].join(';');
        btn.onclick = () => setPanelVisible(!getPanelVisible());
        document.body.appendChild(btn);
    }

    /** 主流程 */
    async function main() {
        window.addEventListener('beforeunload', () => console.log('[NAVDBG] beforeunload'));
        window.addEventListener('pagehide', () => console.log('[NAVDBG] pagehide'));

        await fetchAndRender();

        // 快捷鍵
        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (e.shiftKey && key === 'w') {
                setPanelVisible(!getPanelVisible());
            }
            if (e.shiftKey && key === 'd') {
                if (__DBG_OPEN_ID) toggleDebugModal(__DBG_OPEN_ID);
                else if (lastList && lastList[0]) toggleDebugModal(lastList[0].battleId);
            }
        }, { passive: true });
    }
    setTimeout(main, 300);
})();