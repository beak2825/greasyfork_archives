// ==UserScript==
// @name         LinkKF MediaSession + TMDB + 시즌제목 + 디버그 강화
// @namespace    http://tampermonkey.net/
// @version      1.88
// @description  TMDB 시리즈/시즌/에피소드 정보 기반 MediaSession 설정, 디버그 로그 강화
// @match        *://*/*
// @icon         https://cdn.jsdelivr.net/gh/756751uosmaqy/vjplayer@main/iconkf.jpg
// @grant        none
// @author       루션
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542539/LinkKF%20MediaSession%20%2B%20TMDB%20%2B%20%EC%8B%9C%EC%A6%8C%EC%A0%9C%EB%AA%A9%20%2B%20%EB%94%94%EB%B2%84%EA%B7%B8%20%EA%B0%95%ED%99%94.user.js
// @updateURL https://update.greasyfork.org/scripts/542539/LinkKF%20MediaSession%20%2B%20TMDB%20%2B%20%EC%8B%9C%EC%A6%8C%EC%A0%9C%EB%AA%A9%20%2B%20%EB%94%94%EB%B2%84%EA%B7%B8%20%EA%B0%95%ED%99%94.meta.js
// ==/UserScript==

(function() {
    'use strict';

  const hostOk = location.hostname.includes('linkkf');
  const pathOk = location.pathname.startsWith('/watch/');
  if (!hostOk || !pathOk) return; // @match        *://*/*

    const TMDB_KEY = localStorage.getItem("tmdb-api-v3") || "여기에_직접_API_KEY_입력"; //localStorage.setItem('tmdb-api-v3','키값')
    const LANG = "ko-KR";
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    function debugLog(...args) { console.log("[LinkKF Debug]", ...args); }

    const seriesTMDBIdMap = {
        "Lets Play 퀘스트 투성이의 마이 라이프": "293010",
        "지옥선생 누베": "259544",
        "악식영애와 광혈공작": "274814",
        "샤바케 Shabake": "278059",
        "산다 Sanda": "258901",
        "만지지 마세요 코테사시 군": "283880",
        "캣츠 아이 CatsEye": "286691",
        "란마 ½   2기- Ranma ½ (2024)": "259140",
        "닌자와 극도": "285070",
        "믿었던 동료들에게 던전 오지에서 살해당할 뻔했지만 기프트 『무한 뽑기』로 레벨 9999의 동료들을 손에 넣어 전 파티 멤버와 세계에 복수& 『참교육!』합니다!": "278635",
    };
    const seriesSeasonMap = {
        "결혼반지 이야기 2기": 1,
        "터무니없는 스킬로 이세계 방랑 밥 2기": 1,
        "란마 ½   2기- Ranma ½ (2024)": 1,
    };
    const seriesPosterMap = {
        "나의 히어로 아카데미아 8기 - 나의 히어로 아카데미아 FINAL SEASON": "60H3CpA6PRMG5IEnoZRq4yjOkfo",
        "불멸의 그대에게 3기": "oyvcZF0NGkprPeaGajuMUJrgv2g",
        "스파이 패밀리 3기": "vDGB41PATBLb5GaXTfG1weZ03Xr",
    };
    const seriesEpisodeMap = {
        "결혼반지 이야기 2기": 13,
        "터무니없는 스킬로 이세계 방랑 밥 2기": 13,
        "란마 ½   2기- Ranma ½ (2024)": 13,
    };
    const titleDisplayMap = { "청춘 돼지는 산타클로스의 꿈을 꾸지 않는다": 2 };
    const onePieceSeasonMap = [
        { start: 1, end: 61, season: 1 }, { start: 62, end: 77, season: 2 }, { start: 78, end: 91, season: 3 },
        { start: 92, end: 130, season: 4 }, { start: 131, end: 143, season: 5 }, { start: 144, end: 195, season: 6 },
        { start: 196, end: 228, season: 7 }, { start: 229, end: 263, season: 8 }, { start: 264, end: 336, season: 9 },
        { start: 337, end: 381, season: 10 }, { start: 382, end: 407, season: 11 }, { start: 408, end: 421, season: 12 },
        { start: 422, end: 522, season: 13 }, { start: 523, end: 580, season: 14 }, { start: 581, end: 642, season: 15 },
        { start: 643, end: 692, season: 16 }, { start: 693, end: 748, season: 17 }, { start: 749, end: 803, season: 18 },
        { start: 804, end: 877, season: 19 }, { start: 878, end: 891, season: 20 }, { start: 892, end: 1088, season: 21 },
        { start: 1089, end: 9999, season: 22 },
];
    const seasonPosterMap = ["원피스", "블리치"];
    const excludeWords = ["BD","무삭제","자막판","OVA","극장판","무삭제판","Part","PART"];
    const excludeEpisodeWords = [
    /^제\s*\d+\s*화$/i,       // 제1화, 제2화 ...
    /^에피소드\s*\d+$/i       // 에피소드 1, 에피소드 2 ...
];

    function cleanTitleForSearch(title) {
        let cleaned = title;
        excludeWords.forEach(word => { cleaned = cleaned.replace(new RegExp("\\b" + word + "\\b", "gi"), ""); });
        return cleaned.replace(/\s+/g," ").trim();
    }

    const tmdbCache = {};
    async function getTMDBData(seriesId) {
        if (tmdbCache[seriesId]) return tmdbCache[seriesId];
        try {
            const res = await fetch(`https://api.themoviedb.org/3/tv/${seriesId}?api_key=${TMDB_KEY}&language=${LANG}`);
            const data = await res.json();
            tmdbCache[seriesId] = data;
            return data;
        } catch(e) { debugLog("TMDB fetch 실패:", e); return null; }
    }

    async function getEpisodeTitle(seriesId, seasonNum, episodeNum) {
        try {
            const res = await fetch(`https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNum}/episode/${episodeNum}?api_key=${TMDB_KEY}&language=${LANG}`);
            const epData = await res.json();
            return epData.name || "";
        } catch(e) { debugLog("에피소드 fetch 실패:", e); return ""; }
    }

async function getPosterUrl(tmdbId, seriesTitle) {
    if (seriesPosterMap[seriesTitle]) {
        return `https://image.tmdb.org/t/p/w300/${seriesPosterMap[seriesTitle]}.jpg`;
    }

    if (!tmdbId) return null;

    try {
        const res = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_KEY}&append_to_response=images&include_image_language=ko,xx,en,jp`);
        const data = await res.json();
        const posters = data.images?.posters || [];
        debugLog("TMDB posters:", posters.map(p => ({file_path: p.file_path, lang: p.iso_639_1})));

        let selected;

        // 1. 한국어 포스터
        const koPosters = posters.filter(p => p.iso_639_1 === "ko");
        if (koPosters.length) selected = koPosters[Math.floor(Math.random() * koPosters.length)];
        // 2. 언어 없는(xx) 포스터
        else {
            const xxPosters = posters.filter(p => !p.iso_639_1 || p.iso_639_1 === "xx");
            if (xxPosters.length) selected = xxPosters[Math.floor(Math.random() * xxPosters.length)];
        }
        // 3. 그 외 전체
        if (!selected && posters.length) selected = posters[Math.floor(Math.random() * posters.length)];

        if (!selected) return null;

        const path = selected.file_path.startsWith("/") ? selected.file_path : `/${selected.file_path}`;
        return `https://image.tmdb.org/t/p/w300${path}`;
    } catch(e) {
        debugLog("getPosterUrl fetch 실패:", e);
        return null;
    }
}

    function setMediaSession(title, artist, posterUrl) {
        if (!('mediaSession' in navigator)) return;
        navigator.mediaSession.metadata = new MediaMetadata({
            title: title,
            artist: artist + " | TMDB",
            album: "루션",
            artwork: posterUrl ? [{ src: posterUrl, sizes: "", type: "image/jpeg" }] : []
        });
    }

    function setPageTitle(title) { document.title = title; }

function parseWatchInfo() {
    var elem = document.querySelector(".player-tips-title");
    if (!elem) return null;

    // 시리즈명은 <a> 태그에서 추출
    var link = elem.querySelector("a");
    var seriesTitle = link ? link.textContent.trim() : null;

    var raw = elem.textContent.trim();
    debugLog("raw player-tips-title:", raw);

    // 화수 추출: Watch 뒤 숫자 연속만 가져오기
    var match = raw.match(/^Watch\s*(\d+)/i);
    var episode = match ? match[1] : null;

    // 화수 뒤에 숫자가 아닌 문자 제거 (episode는 숫자만)
    episode = episode ? episode.replace(/\D/g, "") : null;

    // 필요하면 seriesTitle에도 part/숫자 뒤 문자 제거 적용
    seriesTitle = seriesTitle.replace(/\b(part\d+|apws|[^\w\s])\b/gi, "").trim();

    return { episode, seriesTitle };
}

    async function searchTMDBSeries(query) {
        if (!TMDB_KEY) return null;
        try {
            const res = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&language=${LANG}`);
            const data = await res.json();
            if (data.results && data.results.length>0) {
                const found = data.results.find(r=>r.genre_ids?.includes(16)) || data.results[0];
                debugLog("[LinkKF Debug] TMDB 검색 성공:", found.name, "id:", found.id);
                return found;
            }
        } catch(e){ debugLog("TMDB 검색 오류:", e); }
        return null;
    }

    async function init() {
    const info = parseWatchInfo();
    if (!info) return debugLog("Watch 정보 없음");

    const seriesTitle = info.seriesTitle ? info.seriesTitle.trim() : "";
    const watchEp = info.episode;
    debugLog("초기 파싱값:", { seriesTitle, watchEp });

    // 검색어 정제 단계
    let searchQuery = cleanTitleForSearch(seriesTitle || "");
    debugLog("원본 검색용:", searchQuery);

    // 1단계: "숫자+기" 패턴 제거 (예: "8기")
    searchQuery = searchQuery.replace(/\d+\s*기/g, "").trim();
    // 2단계: 여백 정리
    searchQuery = searchQuery.replace(/\s+/g, " ").trim();
    // 3단계: "-" 뒤 부제 제거
    searchQuery = searchQuery.replace(/[-:：].*$/, "").trim();
    // 4단계: 최종 여백 정리
    searchQuery = searchQuery.replace(/\s+/g, " ").trim();

    debugLog("검색용 정제어:", searchQuery);

    // TMDB 매핑 우선 체크
    let tmdbData = {};
    const mappedTMDBId = seriesTMDBIdMap[seriesTitle];
    debugLog("매핑 확인:", { mappedTMDBId, matchedKey: mappedTMDBId ? seriesTitle : null });

    if (mappedTMDBId) {
        debugLog(`[LinkKF Debug] 매핑된 TMDB ID 적용: ${seriesTitle} → ${mappedTMDBId}`);
        const tvData = await getTMDBData(mappedTMDBId);
        debugLog("매핑된 TMDB 데이터:", tvData);
        tmdbData = {
            id: mappedTMDBId,
            name: tvData?.name || seriesTitle,
            number_of_seasons: seriesSeasonMap[seriesTitle] || tvData?.number_of_seasons || 1
        };
    } else {
        // 검색 시도 (단일 정제어만 사용)
        debugLog("TMDB 검색 시작 (정제어):", searchQuery);
        const searchResult = await searchTMDBSeries(searchQuery);
        debugLog("TMDB 검색 결과(raw):", searchResult);
        if (searchResult) {
            tmdbData = {
                id: searchResult.id,
                name: searchResult.name || seriesTitle,
                number_of_seasons: searchResult.number_of_seasons || 1
            };
            debugLog(`[LinkKF Debug] TMDB 검색 성공: ${seriesTitle} → ${searchResult.name} (id: ${searchResult.id}, number_of_seasons: ${tmdbData.number_of_seasons})`);
        } else {
            debugLog(`[LinkKF Debug] TMDB 검색 실패: ${seriesTitle}`);
            tmdbData = { id: null, name: seriesTitle, number_of_seasons: seriesSeasonMap[seriesTitle] || 1 };
        }
    }

    const tmdbId = tmdbData.id;
    debugLog("결정된 tmdbData:", tmdbData);

    // 시즌 번호 결정: 매핑시 우선시 또는 제목 내 'N기' 추출
    let seasonNum = seriesSeasonMap[seriesTitle] || 1;
    debugLog("초기 seasonNum(from seriesSeasonMap or default):", seasonNum);

    if (!seriesSeasonMap[seriesTitle]) {
        const matchSeason = seriesTitle.match(/(\d+)기/);
        if (matchSeason) {
            seasonNum = parseInt(matchSeason[1], 10);
            debugLog("제목에서 추출한 시즌번호:", seasonNum);
        } else {
            debugLog("제목에서 시즌번호를 찾지 못함");
        }
    } else {
        debugLog("seriesSeasonMap에 의해 고정된 시즌번호 사용:", seasonNum);
    }

    // 원피스 특수 매핑
    if (seriesTitle === "원피스" && watchEp) {
        const found = onePieceSeasonMap.find(r => watchEp >= r.start && watchEp <= r.end);
        if (found) {
            seasonNum = found.season;
            debugLog("원피스 매핑으로 시즌번호 보정:", seasonNum);
        }
    }

    // TMDB에서 number_of_seasons 정보가 있으면 우선 사용(매핑 케이스 포함)
    if (tmdbData.number_of_seasons && Number.isFinite(tmdbData.number_of_seasons)) {
        debugLog("TMDB의 number_of_seasons:", tmdbData.number_of_seasons);
    } else {
        debugLog("TMDB의 number_of_seasons 정보 없음 또는 비정상:", tmdbData.number_of_seasons);
    }

    const tmdbEpisodeNum = seriesEpisodeMap[seriesTitle] ? parseInt(seriesEpisodeMap[seriesTitle], 10) + (watchEp - 1) : watchEp;
    debugLog("계산된 tmdbEpisodeNum:", tmdbEpisodeNum);

    // 에피소드 제목 fetch (가능하면)
    let epTitle = "";
    if (tmdbId) {
        try {
            epTitle = await getEpisodeTitle(tmdbId, seasonNum, tmdbEpisodeNum);
            debugLog("TMDB에서 가져온 에피소드 제목(raw):", epTitle);
            if (epTitle && excludeEpisodeWords.some(r => r.test(epTitle.trim()))) {
                debugLog("에피소드 제목이 제외 규칙에 걸려 제거됨:", epTitle);
                epTitle = "";
            }
        } catch (e) {
            debugLog("에피소드 제목 fetch 중 오류:", e);
            epTitle = "";
        }
    } else {
        debugLog("tmdbId 없음으로 에피소드 제목 fetch 건너뜀");
    }

    const artist = `${String(tmdbEpisodeNum).padStart(2,"0")}화${epTitle ? ` - ${epTitle}` : ""}`;
    debugLog("artist 구성:", artist);

    // 시즌 제목(시즌 API) fetch — 디버그 강화
    let seasonTitleText = "";
    if (tmdbId && tmdbData.number_of_seasons > 1) {
        try {
            debugLog(`시즌 정보 요청: tv/${tmdbId}/season/${seasonNum}`);
            const resSeason = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}/season/${seasonNum}?api_key=${TMDB_KEY}&language=${LANG}`);
            const seasonData = await resSeason.json();
            debugLog("시즌 API 응답:", seasonData);
            if (seasonData && seasonData.name) {
                // "Season X" 같은 기본명은 제외
                if (!/^시즌 \d+$/i.test(seasonData.name)) seasonTitleText = seasonData.name;
                debugLog("선택된 seasonTitleText:", seasonTitleText);
            } else {
                debugLog("시즌 API에서 name 없음 혹은 응답 비정상");
            }
        } catch (e) {
            debugLog("시즌 fetch 실패:", e);
        }
    } else {
        debugLog("시즌 제목 fetch 조건 미충족 (tmdbId 또는 시즌수):", { tmdbId, number_of_seasons: tmdbData.number_of_seasons });
    }

    // TMDB의 시즌 수가 2개 이상이거나, 제목에서 추출한 시즌 번호가 2 이상이면 'N기' 표시
    const showSeasonNum = (tmdbData.number_of_seasons > 1 || seasonNum > 1);
    debugLog("showSeasonNum 판정 (number_of_seasons>1):", showSeasonNum, "tmdbData.number_of_seasons:", tmdbData.number_of_seasons);

    const seasonLabel = seasonTitleText || (showSeasonNum ? `${seasonNum}기` : "");
    debugLog("seasonLabel 결정:", seasonLabel, { seasonTitleText, seasonNum });

    const pref = titleDisplayMap[seriesTitle];
    debugLog("titleDisplayMap preference:", pref);

    let mediaTitle;
    if (pref === 1) {
        mediaTitle = seasonLabel ? `${tmdbData.name} ${seasonLabel}` : tmdbData.name;
    } else if (pref === 2) {
        mediaTitle = seasonTitleText ? seasonTitleText : (showSeasonNum ? `${tmdbData.name} ${seasonNum}기` : tmdbData.name);
    } else {
        mediaTitle = seasonLabel ? `${tmdbData.name} ${seasonLabel}` : tmdbData.name;
    }

    mediaTitle += ` | ${String(tmdbEpisodeNum).padStart(2,"0")}화`;

    debugLog("최종 mediaTitle 조합 전 상태:", { tmdbDataName: tmdbData.name, seasonTitleText, seasonNum, showSeasonNum, mediaTitle });

    // 포스터 URL 얻기 (디버그)
    debugLog("포스터 fetch 호출 시작:", { tmdbId, seriesTitle, seasonNum });
    const posterUrl = await getPosterUrl(tmdbId, seriesTitle, seasonNum).catch(e => {
        debugLog("posterUrl fetch 중 오류:", e);
        return null;
    });
    debugLog("결정된 posterUrl:", posterUrl);

    setMediaSession(mediaTitle, artist, posterUrl);
    setPageTitle(mediaTitle);

    debugLog("최종 처리:\n", JSON.stringify({ mediaTitle, artist, posterUrl, tmdbId, seasonNum, seasonTitleText, number_of_seasons: tmdbData.number_of_seasons }, null, 4));
}

    window.addEventListener("load", init);
})();
