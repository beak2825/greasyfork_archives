// ==UserScript==
// @name         티비위키 MediaSession + TMDB API 검색 (기본 복원)
// @namespace    http://tampermonkey.net/
// @version      1.53
// @description  TMDB 실패 시 포스터 없음, Android 호환성 유지, 타이틀/아티스트 포맷 안정화
// @include      /^https:\/\/tvwiki\d+\.net\/.*/
// @icon         https://tvwiki3.net/favicon.ico
// @grant        none
// @author       Lusyeon
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541786/%ED%8B%B0%EB%B9%84%EC%9C%84%ED%82%A4%20MediaSession%20%2B%20TMDB%20API%20%EA%B2%80%EC%83%89%20%28%EA%B8%B0%EB%B3%B8%20%EB%B3%B5%EC%9B%90%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541786/%ED%8B%B0%EB%B9%84%EC%9C%84%ED%82%A4%20MediaSession%20%2B%20TMDB%20API%20%EA%B2%80%EC%83%89%20%28%EA%B8%B0%EB%B3%B8%20%EB%B3%B5%EC%9B%90%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (/\/(movie|kor_movie|ani_movie)/.test(location.pathname)) return;

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const Debug = !isMobile; // 모바일 CPU 절약

    const TMDB_V3 = localStorage.getItem('tmdb-api-v3') || ""; //localStorage.setItem('tmdb-api-v3','키값')
    const durationRoundingEnabled = 1;

    const tmdbMap = { '대탈출 : 더 스토리': '1507660' };
    const removeMap = {
        "*": ["|", "│", "‖", "다시보기", "무료", "최신", "보기"]
    };

    /** ===== 공통 유틸 ===== */
    function cleanText(t) {
        removeMap["*"].forEach(p => t = t.replaceAll(p, ""));
        return t.trim();
    }

    function waitForDom(selector, tries = 3, interval = 800) {
        return new Promise((resolve, reject) => {
            let count = 0;
            const timer = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(timer);
                    resolve(el);
                } else if (++count >= tries) {
                    clearInterval(timer);
                    reject("DOM timeout");
                }
            }, interval);
        });
    }

    /** ===== TMDB 요청 캐시 ===== */
    const cache = {
        series: new Map(),   // title → TMDB result
        detail: new Map(),   // id → detail json
        episode: new Map()   // `${id}_${season}_${ep}` → epName
    };

    async function searchTMDBSeries(q) {
        if (!TMDB_V3) return null;
        if (cache.series.has(q)) return cache.series.get(q);

        try {
            const res = await fetch(
                `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_V3}&language=ko-KR&query=${encodeURIComponent(q)}`
            );
            if (!res.ok) return null;
            const data = await res.json();
            const ret = data.total_results > 0 ? data.results[0] : null;
            cache.series.set(q, ret);
            return ret;
        } catch { return null; }
    }

    function parseTitleInfo(raw) {
        const m = raw.match(/^(.*?)\s*(\d+화)/);
        if (m) return {
            trigger: cleanText(m[1]),
            seasonNum: 1,
            episodeStr: m[2],
            episodeNum: parseInt(m[2].replace("화", ""), 10)
        };
        return { trigger: cleanText(raw), seasonNum: 1, episodeStr: null, episodeNum: null };
    }

    async function fetchEpisodeName(id, season, ep) {
        if (!TMDB_V3 || !id || !ep) return null;
        const key = `${id}_${season}_${ep}`;

        if (cache.episode.has(key)) return cache.episode.get(key);

        try {
            const res = await fetch(
                `https://api.themoviedb.org/3/tv/${id}/season/${season}/episode/${ep}?api_key=${TMDB_V3}&language=ko-KR`
            );
            if (!res.ok) return null;
            const j = await res.json();
            cache.episode.set(key, j.name || null);
            return j.name || null;
        } catch { return null; }
    }

    function pickRandomPoster(images) {
        if (!images || !images.length) return null;
        const posters = images.filter(p => p.file_path);
        if (!posters.length) return null;
        const r = posters[Math.floor(Math.random() * posters.length)];
        return `https://image.tmdb.org/t/p/w154${r.file_path}`;
    }

    /** ===== MediaSession 메인 ===== */
    let lastTitleApplied = ""; // 같은 제목 중복 업데이트 방지

    async function updateMediaSession() {
        const titleElem = document.querySelector("#bo_v_title .bo_v_tit");
        if (!titleElem) return;

        const rawTitle = cleanText(titleElem.textContent.trim());
        if (!rawTitle) return;

        if (lastTitleApplied === rawTitle) {
            Debug && console.log("[opt] 동일 제목 → MediaSession 스킵");
            return;
        }

        lastTitleApplied = rawTitle;

        const { trigger, seasonNum, episodeStr, episodeNum } = parseTitleInfo(rawTitle);

        let titleText = trigger;
        let artistText = episodeStr || "";
        let artworkUrl = null;
        let tmdbId = null;
        let episodeName = null;

        // 강제 매핑
        for (const [k, v] of Object.entries(tmdbMap)) {
            if (rawTitle.includes(k)) {
                tmdbId = v;
                break;
            }
        }

        // TMDB ID 검색
        if (!tmdbId) {
            const r = await searchTMDBSeries(trigger);
            tmdbId = r?.id;
        }

        // TMDB 상세
        if (tmdbId) {
            try {
                let detail = cache.detail.get(tmdbId);
                if (!detail) {
                    const res = await fetch(
                        `https://api.themoviedb.org/3/tv/${tmdbId}?language=ko-KR&api_key=${TMDB_V3}&append_to_response=images`
                    );
                    detail = await res.json();
                    cache.detail.set(tmdbId, detail);
                }

                titleText = detail.name || trigger;

                const posters = detail?.images?.posters || [];
                artworkUrl = pickRandomPoster(posters);

                episodeName = await fetchEpisodeName(tmdbId, seasonNum, episodeNum);

                const cleanName = episodeName ? episodeName.trim() : "";
                const meaningless =
                    !cleanName ||
                    /^에피소드\s*\d+$/i.test(cleanName) ||
                    cleanName === (episodeStr || "").trim();

                if (episodeStr && !meaningless) {
                    artistText = `${episodeStr} - ${cleanName} | TMDB`;
                } else if (episodeStr) {
                    artistText = `${episodeStr} | TMDB`;
                } else if (!meaningless) {
                    artistText = `${cleanName} | TMDB`;
                } else {
                    artistText = "TMDB";
                }

            } catch (e) {
                Debug && console.log("[opt] TMDB fetch 실패:", e);
                artworkUrl = null;
                artistText = episodeStr || "";
            }
        }

        applyMediaSession(titleText, artistText, artworkUrl, episodeStr);
    }

    function applyMediaSession(titleText, artistText, artworkUrl, episodeStr) {
        if (!('mediaSession' in navigator)) return;

        const artwork = artworkUrl ? [{ src: artworkUrl, type: "image/jpeg" }] : undefined;

        navigator.mediaSession.metadata = new MediaMetadata({
            title: titleText + (episodeStr ? ` | ${episodeStr}` : ""),
            artist: artistText,
            album: "루션",
            artwork
        });

        const video = document.querySelector("video");
        if (
            durationRoundingEnabled &&
            video &&
            !isNaN(video.duration) &&
            "setPositionState" in navigator.mediaSession
        ) {
            const rd = Math.ceil(video.duration / 600) * 600;
            navigator.mediaSession.setPositionState({
                duration: rd,
                playbackRate: video.playbackRate || 1.0,
                position: video.currentTime || 0
            });
        }

        if (Debug) console.log("[opt] MediaSession 적용됨");
    }

    /** ===== URL 변화 감지 (최적화) ===== */
    function observeUrlChanges() {
        let prev = location.href;

        const observer = new MutationObserver(() => {
            const now = location.href;
            if (now !== prev) {
                prev = now;
                lastTitleApplied = ""; // 새 페이지 → 다시 갱신 가능
                run();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    /** ===== MAIN ===== */
    async function run() {
        try {
            await waitForDom("#bo_v_title .bo_v_tit");
            updateMediaSession();
        } catch (e) {
            Debug && console.warn("[opt] DOM 대기 실패");
        }
    }

    window.addEventListener("load", run);
    observeUrlChanges();

})();
