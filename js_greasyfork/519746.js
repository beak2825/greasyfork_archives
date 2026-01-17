// ==UserScript==
// @name         TMDB 한국 지원 강화
// @namespace    http://tampermonkey.net/
// @version      3.1.9
// @description  TMDB 영화/TV 시리즈 페이지에 한국어, 영어, 원어 제목 추가, 개별 클립보드 복사 기능, 한국 시청등급 및 제작국 표시
// @match        https://www.themoviedb.org/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @author       DongHaerang
// @license      CC BY-NC-SA 4.0
// @downloadURL https://update.greasyfork.org/scripts/519746/TMDB%20%ED%95%9C%EA%B5%AD%20%EC%A7%80%EC%9B%90%20%EA%B0%95%ED%99%94.user.js
// @updateURL https://update.greasyfork.org/scripts/519746/TMDB%20%ED%95%9C%EA%B5%AD%20%EC%A7%80%EC%9B%90%20%EA%B0%95%ED%99%94.meta.js
// ==/UserScript==

// 주의사항: 아래 YOUR_API_KEY 부분을 실제 TMDB API 키로 교체하는 것을 잊지 마세요.
const apiKey = "YOUR_API_KEY";

(function() {
    'use strict';

    GM_addStyle(`
        #tmdb-info-table {
            background-color: rgba(0, 0, 0, 0.3) !important;
        }
        /* [수정] 클립보드에 복사되는 링크는 노란색으로 지정 */
        .clickable-text[data-copyable="true"] {
            color: yellow !important;
            content: "□";
            margin-left: 0px;
            display: inline-block;
        }
        /* [수정] 외부 웹페이지로 연결되거나 기타 클릭 가능한 텍스트는 하늘색으로 지정 */
        .clickable-text, #external-links a {
            cursor: pointer;
            text-decoration: none;
            font-size: 12pt !important;
            color: lightskyblue !important;
        }
        #external-links a {
            margin-right: 0px;
        }
        .additional-titles {
            line-height: 1.4;
            margin-bottom: 10px;
            font-size: 12pt !important;
        }
        #additional-info {
            margin-top: 10px;
            clear: both;
            display: flex;
            align-items: center;
            width: 100%;
            font-size: 12pt !important;
        }
        #production-countries {
            margin-right: 20px;
            font-size: 12pt !important;
        }
        #external-links {
            font-size: 12pt !important;
        }
        .right-aligned-links {
            float: right;
            display: inline-block;
        }
    `);

    const copyToClipboard = (text, clickedText) => {
        // 파일 이름으로 사용될 수 없는 특수문자를 변환합니다.
        text = text.replace(/:/g, ';').replace(/\?/g, '？').replace(/\//g, '／');

        navigator.clipboard.writeText(text).then(() => {
            showTemporaryMessage(`${text} 클립보드에 복사됨`);
        });
    };

    const showTemporaryMessage = message => {
        const messageElement = document.createElement('div');
        Object.assign(messageElement.style, {
            position: 'fixed',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            zIndex: '9999'
        });
        messageElement.textContent = message;
        document.body.appendChild(messageElement);
        setTimeout(() => document.body.removeChild(messageElement), 1000);
    };

    // 스크립트 상단(apiKey 선언 아래 등)에 아래 두 줄을 추가합니다.
    const regionNamer = new Intl.DisplayNames(['ko'], { type: 'region' });
    const languageNamer = new Intl.DisplayNames(['ko'], { type: 'language' });

    // 국가 코드를 한글로 변환하는 함수 (현대화)
    const translateCountry = (countryCode) => {
        if (!countryCode) return '미기재';
        if (countryCode === 'AE') {
            return '아랍'; // 'KR' 코드는 '한국'으로 특별 처리
        }
        if (countryCode === 'KR') {
            return '한국'; // 'KR' 코드는 '한국'으로 특별 처리
        }
        if (countryCode === 'AU') {
            return '호주'; // 'AU' 코드는 '호주'로 특별 처리
        }
        if (countryCode === 'HK') {
            return '홍콩'; // 'HK' 코드는 '홍콩'으로 특별 처리
        }
        try {
            return regionNamer.of(countryCode);
        } catch (e) {
            return countryCode; // 유효하지 않은 코드일 경우 원래 코드를 반환
        }
    };

    const getIdAndType = () => {
        const [, type, id] = window.location.pathname.split('/');
        return { id: id?.split('-')[0], type };
    };

    const goToMainPage = () => {
        const currentUrl = window.location.href;
        let mainUrl;

        const tvMatch = currentUrl.match(/\/tv\/(\d+)/);
        const movieMatch = currentUrl.match(/\/movie\/(\d+)/);

        if (tvMatch) {
            mainUrl = `https://www.themoviedb.org/tv/${tvMatch[1]}`;
        } else if (movieMatch) {
            mainUrl = `https://www.themoviedb.org/movie/${movieMatch[1]}`;
        }

        if (mainUrl) {
            window.location.href = mainUrl;
        }
    };

    // 언어 코드를 한글로 변환하는 함수 (신규 생성)
    const translateLanguage = (langCode) => {
        if (!langCode) return '기타언어';
        if (langCode === 'cn') {
            return '광둥어'; // 'cn' 코드는 '광둥어'로 특별 처리
        }
        try {
            return languageNamer.of(langCode);
        } catch (e) {
            return langCode.toUpperCase();
        }
    };

    const getLanguagePrefix = async (id, type) => {
        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}`,
                    onload: response => response.status === 200 ? resolve(JSON.parse(response.responseText)) : reject(`API 요청 실패: ${response.status}`),
                    onerror: reject
                });
            });

            const originalLanguage = response.original_language;
            // languageMap 대신 새로 만든 translateLanguage 함수를 사용합니다.
            return translateLanguage(originalLanguage).charAt(0);
        } catch (error) {
            console.error('언어 정보 가져오기 실패:', error);
            return '기';
        }
    };

const displayTitles = async (koTitle, enTitle, originalTitle, type, id, koreanRating, originCountry, productionCountry, year, imdbId, wikidataId, tvdbId) => {
    const titleElement = document.querySelector('.title h2') || document.querySelector('.header .title h2');
    if (!titleElement) return;

    let alternativeTitlesData = []; // API 결과를 저장할 배열

    // TMDB API로 대체 제목 가져오기 (페이지 로드 시 한 번만)
    let koreanAltTitlesText = '';
    let englishAltTitlesText = '';
    let japaneseAltTitlesText = '';

    try {
        const response = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.themoviedb.org/3/${type}/${id}/alternative_titles?api_key=${apiKey}`,
                onload: res => res.status === 200 ? resolve(JSON.parse(res.responseText)) : reject(`API 요청 실패: ${res.status}`),
                onerror: reject
            });
        });
        alternativeTitlesData = type === 'movie' ? (response.titles || []) : (response.results || []);

        // 한국 대체 제목 찾기
        const koreanAltTitles = alternativeTitlesData.filter(title => title.iso_3166_1 === 'KR');
        koreanAltTitlesText = koreanAltTitles.length > 0
            ? ` ${koreanAltTitles.map(t => `<span class="clickable-text" data-copyable="true">[${t.title}]</span>`).join(', ')}`
            : '';

        // 영어 대체 제목 찾기
        const englishAltTitles = alternativeTitlesData.filter(title => title.iso_3166_1 === 'US' || title.iso_3166_1 === 'GB');
        englishAltTitlesText = englishAltTitles.length > 0
            ? ` ${englishAltTitles.map(t => `<span class="clickable-text" data-copyable="true">[${t.title}]</span>`).join(', ')}`
            : '';

        // 일본 대체 제목 찾기
        const japaneseAltTitles = alternativeTitlesData.filter(title => title.iso_3166_1 === 'JP');
        japaneseAltTitlesText = japaneseAltTitles.length > 0
            ? ` ${japaneseAltTitles.map(t => `<span class="clickable-text" data-copyable="true">[${t.title}]</span>`).join(', ')}`
            : '';

    } catch (error) {
        console.error('대체 제목 가져오기 실패:', error);
    }

    // 변수 정의
    const KoTitle = koTitle;
    const EnTitle = enTitle;
    const ChangedKoTitle = koTitle.replace(/:/g, ';').replace(/\?/g, '？');
    const ChangedEnTitle = enTitle.replace(/:/g, ';').replace(/\?/g, '？');
    const ChangedoriginalTitle = originalTitle.replace(/:/g, ';').replace(/\?/g, '？');

    const titleContainer = document.createElement('div');
    titleContainer.className = 'additional-titles';
    const titleColor = window.getComputedStyle(titleElement).color;
    const typeText = type === 'tv' ? 'TV' : 'MOVIE';

    const processedEnTitle = enTitle.replace(/ /g, '+').replace(/[^\w\s+-]/g, '');
    const osoSearchUrl = `https://www.opensubtitles.org/ko/search2/moviename-${encodeURIComponent(processedEnTitle)}+${year}/sublanguageid-kor`;

// [추가] TQ 링크 생성을 위한 헬퍼 변수
    const tqFirstCharMatch = enTitle.match(/[a-zA-Z0-9]/);
    const tqPathPrefix = tqFirstCharMatch ? tqFirstCharMatch[0].toLowerCase() : 'a'; // 기호 무시, 첫 영/숫자 사용 (없을 시 'a'로 대체)
    const tqSearchTerm = (enTitle + " " + year).toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/ +/g, '-'); // 소문자 변경, 기호 제거, 공백(1개 이상)을 하이픈(-)으로 대체
    const tqSearchTermTigole = (enTitle + " " + year + " tigole").toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/ +/g, '-');
    const encodedTqSearchTerm = encodeURIComponent(tqSearchTerm);
    const encodedTqSearchTermTigole = encodeURIComponent(tqSearchTermTigole);

titleContainer.innerHTML = `
        <table id="tmdb-info-table" style="width: 100%;">
            <tr>
                <td>
                    <div id="external-links">
                        ▷ <span class="clickable-text" data-copyable="true">${id}</span>
                        <span class="clickable-text" data-copyable="true">${typeText}</span>
                        <span class="clickable-text" data-copyable="true" data-action="copy-tmdb">+TMDB</span>
                        ▶ <a href="${window.location.pathname}?language=ko-KR">🇰🇷</a>
                        <a href="${window.location.pathname}?language=en-US">🇺🇸</a>
                        <a href="${window.location.pathname}?language=ja-JP">🇯🇵</a>
                        <a href="${window.location.pathname}?language=zh-CN">🇨🇳</a>
                        ▶ <a href="https://m.kinolights.com/search/contents?keyword=${encodeURIComponent(koTitle)}" target="_blank">키노</a>
                        <a href="https://www.justwatch.com/kr/%EA%B2%80%EC%83%89?providers_type=all&q=${encodeURIComponent(koTitle)}" target="_blank">JW</a>
                        <a href="https://www.kmdb.or.kr/db/search/totalSearch" target="_blank">KMDb</a>
                        ${imdbId ? `<a href="https://www.imdb.com/title/${imdbId}" target="_blank">IMDB</a>` : ''}
                        ${wikidataId ? `<a href="https://www.wikidata.org/wiki/${wikidataId}" target="_blank">Wikidata</a>` : ''}
                        ${tvdbId ? `<a href="https://www.thetvdb.com/dereferrer/series/${tvdbId}" target="_blank">TVDB</a>` : ''}
                        ▶ <a href="${osoSearchUrl}" target="_blank">OSo</a>
                        <a href="https://www.opensubtitles.com/en/ko/search-all/q-${imdbId ? `${imdbId}` : encodeURIComponent(enTitle)}/hearing_impaired-include/machine_translated-/trusted_sources-" target="_blank">OSc</a>
                        <a href="https://subdl.com/search/${encodeURIComponent(enTitle)}" target="_blank">SUBDL</a>
                        <a href="https://cineaste.co.kr/bbs/board.php?bo_table=psd_caption&sca=&mv_no=&sfl=wr_subject&stx=${encodeURIComponent(koTitle)}%20${year}&sop=and" target="_blank">씨네K</a>
                        <a href="https://cineaste.co.kr/bbs/board.php?bo_table=psd_dramacap&sca=&mv_no=&sfl=wr_subject&stx=${encodeURIComponent(koTitle)}%20${year}&sop=and" target="_blank">씨드K</a>
                        ▶ <a href="https://chapterdb.plex.tv/browse?Criteria.Title=${encodeURIComponent(enTitle)}" target="_blank">챕터</a>
                        ▶ <a href="https://www.k66google.com/search?q=${encodeURIComponent(koTitle)}" target="_blank">개망초</a>
                        ▶ <a href="https://www.google.com/search?q=${encodeURIComponent(koTitle)}+%EC%9C%84%ED%82%A4" target="_blank">위키</a><BR>
                        ${window.location.pathname.match(/\/season\/\d+$/) ? `▷ <span class="clickable-text episode-list">에피소드 목록</span>` : ''}
                        ▶ <a href="${window.location.pathname.match(/\/(tv|movie)\/\d+/)[0]}" class="clickable-text">메인</a>
                        ${type === 'movie' ? `<a href="${window.location.pathname.match(/\/(tv|movie)\/\d+/)[0]}/images/posters">🌄</a> / ` : ''}
                        ${window.location.pathname.startsWith('/tv/') ? `<span id="season-list"></span>` : ''}
                        ▶ <a href="https://www.google.com/search?q=${encodeURIComponent(koTitle)}+오프닝&tbm=vid" target="_blank">OST🔍️</a>
                        <a href="https://notube.net/kr" target="_blank">MP3📀</a>
                        <a href="https://loaderr.to/ko/" target="_blank">MP3💿</a>
                        ▶ <a href="https://www.criterion.com/search?q=${encodeURIComponent(enTitle)}" target="_blank">©️</a>
                        ▶ <a href="https://ext.to/browse/?q=${encodeURIComponent(enTitle)}%20${year}/1/" target="_blank">EXT</a>
                        <a href="https://ext.to/browse/?q=${encodeURIComponent(enTitle)}%20${year}%20tigole/1/" target="_blank">🌐</a>
                        <a href="https://1337x.to/search/${encodeURIComponent(enTitle)}%20${year}/1/" target="_blank">1337</a>
                        <a href="https://1337x.to/search/${encodeURIComponent(enTitle)}%20${year}%20tigole/1/" target="_blank">🌐</a>
                        <a href="https://bt4gprx.com/search?q=${encodeURIComponent(enTitle)}%20${year}" target="_blank">BT4G</a>
                        <a href="https://bt4gprx.com/search?q=${encodeURIComponent(enTitle)}%20${year}%20tigole" target="_blank">🌐</a>
                        <a href="https://torrentquest.com/${tqPathPrefix}/${encodedTqSearchTerm}" target="_blank">TQ</a>
                        <a href="https://torrentquest.com/${tqPathPrefix}/${encodedTqSearchTermTigole}" target="_blank">🌐</a>
                        <a href="https://nyaa.si/?f=0&c=0_0&q=${encodeURIComponent(originalTitle)}" target="_blank">Nyaa</a>
                        <a href="https://nyaa.si/?f=0&c=0_0&q=${encodeURIComponent(enTitle)}" target="_blank">🆎</a><BR>
                        ▶ <a href="https://www.netflix.com/search?q=${encodeURIComponent(koTitle)}" target="_blank">NF</a>
                        <a href="https://media.netflix.com/ko/search?countryCode=KR&term=${encodeURIComponent(koTitle)}" target="_blank">🌄</a>
                        <a href="https://laftel.net/search?keyword=${encodeURIComponent(koTitle)}" target="_blank">LF</a>
                        <a href="https://www.wavve.com/search?searchWord=${encodeURIComponent(koTitle)}" target="_blank">WV</a>
                        <a href="https://www.tving.com/search?keyword=${encodeURIComponent(koTitle)}" target="_blank">TV</a>
                        <a href="https://watcha.com/search?query=${encodeURIComponent(koTitle)}&domain=${type === 'tv' ? 'tv' : 'movie'}" target="_blank">WC</a>
                        <a href="https://pedia.watcha.com/ko-KR/search?query=${encodeURIComponent(koTitle)}">왓챠피디아</a>
                        <a href="https://anikids.ebs.co.kr/anikids/search?keyword=${encodeURIComponent(koTitle)}" target="_blank">애니키즈</a>
                        <a href="https://search.kbs.co.kr/program.html?keyword=${encodeURIComponent(koTitle)}" target="_blank">KBS</a>
                        <a href="https://search.imbc.com/Program?qt=${encodeURIComponent(koTitle)}" target="_blank">MBC</a>
                        <a href="https://w3.sbs.co.kr/search/main.do?collection=prog&query=${encodeURIComponent(koTitle)}" target="_blank">SBS</a>
                        <a href="https://allvod.sbs.co.kr/search" target="_blank">AllVOD</a>
                        <a href="https://moa-play.com/search?keyword=${encodeURIComponent(koTitle)}" target="_blank">MOA</a>
                        <a href="https://www.iq.com/search?query=${encodeURIComponent(koTitle)}" target="_blank">iQIYI</a>
                        ▶ <a href="https://www.google.com/search?q=${encodeURIComponent(koTitle)}%20site:primevideo.com&tbm=isch" target="_blank">AP🔍️</a>
                        ${type === 'tv' ? `<a href="https://www.google.com/search?q=${encodeURIComponent(koTitle)}+site%3Atv.apple.com" target="_blank">AT🔎</a>` : ''}
                        <a href="https://www.google.com/search?q=${encodeURIComponent(koTitle)}%20site:coupangplay.com&tbm=isch" target="_blank">CP🔍️</a>
                        <a href="https://www.google.com/search?q=${encodeURIComponent(koTitle)}%20site:disneyplus.com&tbm=isch" target="_blank">DP1🔍️</a>
                        <a href="https://www.google.com/search?q=${encodeURIComponent(koTitle)}+디즈니%2B&tbm=isch" target="_blank">DP2🔍️</a>
                        <a href="https://www.google.com/search?q=${encodeURIComponent(koTitle)}%20${year}&tbm=isch" target="_blank">GG🔍️</a><BR>
                        ▷ <span class="clickable-text" data-copyable="true">한제</span>:
                        <span class="clickable-text" data-copyable="true">${KoTitle}</span>
                        <span class="clickable-text" data-copyable="true">(${year})</span> /
                        <span class="clickable-text" data-copyable="true">영제</span>:
                        <span class="clickable-text" data-copyable="true">${EnTitle}</span>
                        <span class="clickable-text" data-copyable="true">(${year})</span> /
                        <span class="clickable-text" data-copyable="true">원제</span>:
                        <span class="clickable-text" data-copyable="true">${originalTitle}</span>
                        <span class="clickable-text" data-copyable="true">(${year})</span><BR>
                        ${koreanAltTitlesText ? `▷ <span class="clickable-text" data-copyable="true">한제 대체</span>: ${koreanAltTitlesText}<BR>` : ''}
                        ${englishAltTitlesText ? `▷ <span class="clickable-text" data-copyable="true">영제 대체</span>: ${englishAltTitlesText}<BR>` : ''}
                        ${japaneseAltTitlesText ? `▷ <span class="clickable-text" data-copyable="true">일제 대체</span>: ${japaneseAltTitlesText}<BR>` : ''}
                    </div>
                </td>
            </tr>
        </table>
    `;

    // 헬퍼 함수: 대체 제목 복사 이벤트 핸들러 생성
    const createAltTitleCopyHandler = (countryCodes) => () => {
        if (!alternativeTitlesData || alternativeTitlesData.length === 0) {
            console.error('대체 제목 데이터가 없습니다.');
            return;
        }
        const titles = alternativeTitlesData
            .filter(t => countryCodes.includes(t.iso_3166_1))
            .map(t => `[${t.title}]`)
            .join(' ');
        copyToClipboard(titles, '대체 제목');
    };

    // 이벤트 리스너 설정
    const elements = {
        '메인': () => goToMainPage(),
        [id]: () => copyToClipboard(id, id),
        [typeText]: async () => {
            const languagePrefix = await getLanguagePrefix(id, type);
            const country = translateCountry(productionCountry || originCountry);
            const ratingText = koreanRating ? ` =${koreanRating}` : '';
            const copyText = type === 'movie' ?
                `${ChangedKoTitle} (${year}) {tmdb-${id}} [A${languagePrefix} $${country}${ratingText}]` :
                `${ChangedKoTitle} (${year}) [A${languagePrefix} $${country}${ratingText}]`;
            copyToClipboard(copyText, typeText);
        },
        '+TMDB': async () => {
            const country = translateCountry(productionCountry || originCountry);
            const ratingText = koreanRating ? ` =${koreanRating}` : '';
            let copyText;

            // 조건 1: 한제, 영제, 원제가 모두 동일한 경우
            if (koTitle === enTitle && enTitle === originalTitle) {
                copyText = `${ChangedKoTitle} (${year}) {tmdb-${id}} [$${country}${ratingText}]`;
            }
            // 조건 2: 한제와 원제는 동일하지만, 영제는 다른 경우
            else if (koTitle !== enTitle && koTitle === originalTitle) {
                const languagePrefix = await getLanguagePrefix(id, type);
                copyText = `${ChangedKoTitle} (${year}) [${ChangedEnTitle}] {tmdb-${id}} [$${country}${ratingText}]`;
            }
            // 조건 3: 한제와 영제는 다르지만, 영제와 원제가 동일한 경우
            else if (koTitle !== enTitle && enTitle === originalTitle) {
                copyText = `${ChangedKoTitle} (${year}) [${ChangedoriginalTitle}] {tmdb-${id}} [$${country}${ratingText}]`;
            }
            // 조건 4: 한제와 영제는 동일하지만, 원제는 다른 경우
            else if (koTitle === enTitle && koTitle !== originalTitle) {
                copyText = `${ChangedKoTitle} (${year}) [${ChangedoriginalTitle}] {tmdb-${id}} [$${country}${ratingText}]`;
            }
            // 그 외의 모든 경우 (예: 한제, 영제, 원제가 모두 다른 경우) - 가장 기본적인 형식으로 처리
            else {
                copyText = `${ChangedKoTitle} (${year}) [${ChangedEnTitle}] [${ChangedoriginalTitle}] {tmdb-${id}} [$${country}${ratingText}]`;
            }

            copyToClipboard(copyText, '+TMDB');
        },
        '한제': () => copyToClipboard(`${KoTitle} (${year})`, '한제'),
        [KoTitle]: () => copyToClipboard(KoTitle, KoTitle),
        '영제': () => copyToClipboard(`[${EnTitle}]`, '영제'),
        [EnTitle]: () => copyToClipboard(EnTitle, EnTitle),
        '원제': () => copyToClipboard(`[${EnTitle}] [${originalTitle}]`, '원제'),
        [originalTitle]: () => copyToClipboard(originalTitle, originalTitle),
        '한제 대체': createAltTitleCopyHandler(['KR']),
        '영제 대체': createAltTitleCopyHandler(['US', 'GB']),
        '일제 대체': createAltTitleCopyHandler(['JP']),
    };

        titleContainer.querySelectorAll('.clickable-text').forEach(element => {
            const text = element.textContent;
            if (elements[text]) {
                element.addEventListener('click', elements[text]);
            } else if (text.match(/^\(\d{4}\)$/)) {
                element.addEventListener('click', () => {
                    const title = element.previousElementSibling.textContent;
                    copyToClipboard(`${title} ${text.slice(1, -1)}`, text);
                });
            } else if (text === 'TTT') {
                element.addEventListener('click', elements['TTT']);
            } else {
                // Alternative Titles에 대한 클릭 이벤트 처리
                element.addEventListener('click', () => {
                    copyToClipboard(`${text}`, text);
                });

                element.addEventListener('dblclick', () => {
                    const cleanText = text.replace(/^\[|\]$/g, '');
                    copyToClipboard(cleanText, text);
                });
            }
        });
        // 에피소드 목록 이벤트 리스너 추가
        titleContainer.querySelectorAll('.episode-list').forEach(element => {
        element.addEventListener('click', async () => {
            try {
                const pathParts = window.location.pathname.split('/');
                const tvId = pathParts[2];
                const seasonNumber = pathParts[4];
                // URL에서 언어 코드 추출 (예: /tv/1234-some-title/season/1?language=en-US)
                const urlParams = new URLSearchParams(window.location.search);
                let languageCode = urlParams.get('language'); // URL에서 language 파라미터 추출
                if (languageCode) {
                    languageCode = languageCode.split('-')[0]; // ko-KR -> ko
                } else {
                    languageCode = 'ko'; // 기본값: 한국어
                }

                if (!tvId || !seasonNumber) {
                  throw new Error('TV ID 또는 시즌 번호를 찾을 수 없습니다.');
                }

                // API 요청에 대한 응답 검증 함수
                const validateResponse = (response, type) => {
                  if (response.status !== 200) {
                    throw new Error(`${type} API 요청 실패: ${response.status}`);
                  }
                  const data = JSON.parse(response.responseText);
                  if (!data) {
                    throw new Error(`${type} 데이터가 비어있습니다.`);
                  }
                  return data;
                };

                const [tvInfo, seasonInfo] = await Promise.all([
                  new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                      method: "GET",
                      // language 파라미터를 API 요청에 추가
                      url: `https://api.themoviedb.org/3/tv/${tvId}?api_key=${apiKey}&language=${languageCode}`,
                      onload: response => {
                        try {
                          resolve(validateResponse(response, 'TV 정보'));
                        } catch (error) {
                          reject(error);
                        }
                      },
                      onerror: error => reject(new Error(`TV 정보 요청 실패: ${error}`))
                    });
                  }),
                  new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                      method: "GET",
                       // language 파라미터를 API 요청에 추가
                      url: `https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}?api_key=${apiKey}&language=${languageCode}`,
                      onload: response => {
                        try {
                          resolve(validateResponse(response, '시즌 정보'));
                        } catch (error) {
                          reject(error);
                        }
                      },
                      onerror: error => reject(new Error(`시즌 정보 요청 실패: ${error}`))
                    });
                  })
                ]);

                if (!tvInfo.first_air_date) {
                  throw new Error('첫 방영일 정보가 없습니다.');
                }

                const firstAirYear = new Date(tvInfo.first_air_date).getFullYear();

                if (!seasonInfo.episodes || !Array.isArray(seasonInfo.episodes) || seasonInfo.episodes.length === 0) {
                  throw new Error('에피소드 정보가 없습니다.');
                }

                const episodeList = seasonInfo.episodes.map(ep => {
                  if (!ep || typeof ep.episode_number === 'undefined') {
                    console.warn('잘못된 에피소드 데이터:', ep);
                    return null;
                  }

                  const formattedDate = ep.air_date || 'YYYY-MM-DD';
                  // 에피소드 제목 처리: 해당 언어에 제목이 없으면 'n화' 표시
                  const episodeTitle = ep.name || `${ep.episode_number}화`;

                  return `${tvInfo.name} (${firstAirYear}) s${seasonNumber.padStart(2, '0')}e${ep.episode_number.toString().padStart(2, '0')}_${formattedDate} ${episodeTitle}`;
                })
                .filter(Boolean)  // null 값 제거
                .join('\n');

                if (!episodeList) {
                  throw new Error('에피소드 목록을 생성할 수 없습니다.');
                }

                copyToClipboard(episodeList, '에피소드 목록');
                showTemporaryMessage('에피소드 목록이 클립보드에 복사되었습니다.');

              } catch (error) {
                console.error('에피소드 목록 생성 실패:', error);
                showTemporaryMessage(`에피소드 목록 생성 실패: ${error.message}`);
              }
          });
        });

        titleElement.parentNode.insertBefore(titleContainer, titleElement);
        // 시즌 목록 표시 로직
        if (type === 'tv') {
            try {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`,
                    onload: function(response) {
                        const tvData = JSON.parse(response.responseText);
                        const seasonList = document.getElementById('season-list');
                        const mainTvId = getMainTvId(); // 메인 TV ID 추출

                        if (seasonList && tvData.seasons) {
                            let seasonLinks = `<a href="/tv/${mainTvId}/images/posters" style="color: ${titleColor};">🌄</a> / `;

                            tvData.seasons.forEach(season => {
                                const seasonNum = season.season_number.toString().padStart(2, '0');
                                seasonLinks += `<a href="/tv/${mainTvId}/season/${season.season_number}" style="color: ${titleColor};">s${seasonNum}</a> <a href="/tv/${mainTvId}/season/${season.season_number}/images/posters" style="color: ${titleColor};">🌄</a> / `;
                            });

                            seasonList.innerHTML = seasonLinks.slice(0, -3);
                        }
                    },
                    onerror: function(error) {
                        console.error('시즌 정보 가져오기 실패:', error);
                    }
                });
            } catch (error) {
                console.error('시즌 목록 표시 오류:', error);
            }
        }
	};

    const getKoreanCertification = (data, type) => {
        const ratings = type === 'movie' ? data.release_dates?.results : data.content_ratings?.results;
        const koreanRating = ratings?.find(r => r.iso_3166_1 === 'KR')?.release_dates?.[0]?.certification ||
                            ratings?.find(r => r.iso_3166_1 === 'KR')?.rating;
        return koreanRating || '';
    };

    const getOriginCountry = (data) => {
        return data.origin_country?.[0] || data.production_countries?.[0]?.iso_3166_1 || null;
    };

    const getProductionCountry = (data) => {
        const originCountry = data.origin_country?.[0] || null;
        const productionCountries = data.production_countries || [];

        // 원작국과 동일한 제작국이 있는지 확인
        for (const country of productionCountries) {
            if (country.iso_3166_1 === originCountry) {
                return country.iso_3166_1;
            }
        }

        // 없으면 첫 번째 제작국 반환
        return productionCountries[0]?.iso_3166_1 || null;
    };

    const displayKoreanRating = rating => {
        if (!rating) return;

        const factsElement = document.querySelector('.facts');
        if (!factsElement) return;

        let koreanRatingElement = document.getElementById('korean-rating');
        if (!koreanRatingElement) {
            const currentPath = window.location.pathname;
            const type = currentPath.includes('/movie/') ? 'movie' : 'tv';
            const editUrl = currentPath +
                (type === 'movie' ? '/edit?active_nav_item=release_information' : '/edit?active_nav_item=content_ratings');

            koreanRatingElement = Object.assign(document.createElement('a'), {
                id: 'korean-rating',
                className: rating === '' ? 'unrated' : 'rated',
                href: editUrl,  // 일반적인 href 링크 사용
                style: `
                    font-size: 1em;
                    margin-right: 10px;
                    font-weight: bold;
                    text-decoration: none;
                    color: inherit;
                    cursor: pointer;
                `,
                textContent: rating
            });

            factsElement.insertBefore(koreanRatingElement, factsElement.firstChild);
        }
        koreanRatingElement.textContent = rating;
    };

    const displayAdditionalInfo = (originCountry, productionCountry, koTitle, enTitle, imdbId, wikidataId, tvdbId, year, originalLanguageCode) => {
        const factsElement = document.querySelector('.facts');
        let additionalInfoContainer = document.getElementById('additional-info');

        if (!additionalInfoContainer) {
            additionalInfoContainer = document.createElement('div');
            additionalInfoContainer.id = "additional-info";
            factsElement.parentNode.insertBefore(additionalInfoContainer, factsElement.nextSibling);

            const originCountryText = translateCountry(originCountry);
            const productionCountryText = translateCountry(productionCountry);
            const languageText = translateLanguage(originalLanguageCode);
            let searchLinks = '';

            if (imdbId) {
                const imdbIdNum = imdbId.replace('tt', '');
                searchLinks = `
                    ▶ <a href="https://www.opensubtitles.org/ko/search/sublanguageid-kor/imdbid-${imdbIdNum}" target="_blank">OSo</a>
                    <a href="https://www.opensubtitles.com/en/ko/search-all/q-tt${imdbIdNum}/hearing_impaired-include/machine_translated-/trusted_sources-" target="_blank">OSc</a>
                    <a href="https://subdl.com/search/${encodeURIComponent(enTitle)}%20${year}" target="_blank">SUBDL</a>
                    <a href="https://cineaste.co.kr/bbs/board.php?bo_table=psd_caption&sca=&mv_no=&sfl=wr_subject&stx=${encodeURIComponent(koTitle)}%20${year}&sop=and" target="_blank">씨네(한)</a>
                    <a href="https://cineaste.co.kr/bbs/board.php?bo_table=psd_caption&sca=&mv_no=&sfl=wr_subject&stx=${encodeURIComponent(enTitle)}%20${year}&sop=and" target="_blank">씨네(영)</a>
                    <a href="https://cineaste.co.kr/bbs/board.php?bo_table=psd_dramacap&sca=&mv_no=&sfl=wr_subject&stx=${encodeURIComponent(koTitle)}%20${year}&sop=and" target="_blank">씨드(한)</a>
                    <a href="https://cineaste.co.kr/bbs/board.php?bo_table=psd_dramacap&sca=&mv_no=&sfl=wr_subject&stx=${encodeURIComponent(enTitle)}%20${year}&sop=and" target="_blank">씨드(영)</a>
                `;
            } else {
                searchLinks = `
                    ▶ <a href="https://www.opensubtitles.org/ko/search2/moviename-${encodeURIComponent(enTitle)}%20${year}" target="_blank">OSo</a>
                    <a href="https://www.opensubtitles.com/en/ko/search-all/q-${encodeURIComponent(enTitle)}/hearing_impaired-include/machine_translated-/trusted_sources-" target="_blank">OSc</a>
                    <a href="https://subdl.com/search/${encodeURIComponent(enTitle)}%20${year}" target="_blank">SUBDL</a>
                    <a href="https://cineaste.co.kr/bbs/board.php?bo_table=psd_caption&sca=&mv_no=&sfl=wr_subject&stx=${encodeURIComponent(koTitle)}%20${year}&sop=and" target="_blank">씨네(한)</a>
                    <a href="https://cineaste.co.kr/bbs/board.php?bo_table=psd_caption&sca=&mv_no=&sfl=wr_subject&stx=${encodeURIComponent(enTitle)}%20${year}&sop=and" target="_blank">씨네(영)</a>
                    <a href="https://cineaste.co.kr/bbs/board.php?bo_table=psd_dramacap&sca=&mv_no=&sfl=wr_subject&stx=${encodeURIComponent(koTitle)}%20${year}&sop=and" target="_blank">씨드(한)</a>
                    <a href="https://cineaste.co.kr/bbs/board.php?bo_table=psd_dramacap&sca=&mv_no=&sfl=wr_subject&stx=${encodeURIComponent(enTitle)}%20${year}&sop=and" target="_blank">씨드(영)</a>
                `;
            }

            additionalInfoContainer.innerHTML = `
                <div id="external-links">
                    • 언어: ${languageText} / 원작국: ${originCountryText} / 제작국: ${productionCountryText}
                </div>
            `;

            const titleColor = window.getComputedStyle(document.querySelector('.title h2')).color;
            additionalInfoContainer.querySelectorAll('#external-links a').forEach(link => {
                link.style.color = titleColor;
                link.style.marginRight = "0px";
            });
        }
    };
    const getMainTvId = () => {
        const pathParts = window.location.pathname.split('/');
        return pathParts[2]; // TV ID 추출
    };
const fetchData = async () => {
        displayLanguageLinksForPersonPage();
        const { id, type } = getIdAndType();
        if (!id || (!type && !window.location.pathname.includes('/person/'))) return;

        try {
            const responseData = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    // 'alternative_titles'를 추가하여 API 호출을 한 번으로 통합합니다.
                    url: `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=ko-KR&append_to_response=external_ids,release_dates,content_ratings,translations,alternative_titles`,
                    onload: response => response.status === 200 ? resolve(JSON.parse(response.responseText)) : reject(`API 요청 실패: ${response.status}`),
                    onerror: reject
                });
            });

            // 응답의 translations 객체에서 영어 제목 정보를 찾습니다.
            const enTranslation = responseData.translations.translations.find(t => t.iso_639_1 === 'en');
            const enData = enTranslation ? enTranslation.data : {};

            // 단일 응답(responseData)을 기반으로 모든 변수를 할당합니다.
            const koTitle = responseData.title || responseData.name || '한국어 제목 미기재';
            const enTitle = enData.title || enData.name || responseData.original_title || responseData.original_name ||'영어 제목 미기재';
            const originalTitle = responseData.original_title || responseData.original_name || '원어 제목 미기재';
            const koreanRating = getKoreanCertification(responseData, type);
            const originCountry = getOriginCountry(responseData);
            const productionCountry = getProductionCountry(responseData);
            const imdbId = responseData.imdb_id || responseData.external_ids?.imdb_id;
            const wikidataId = responseData.external_ids?.wikidata_id;
            const tvdbId = responseData.external_ids?.tvdb_id;
            const year = new Date(responseData.release_date || responseData.first_air_date).getFullYear();
            const originalLanguageCode = responseData.original_language;
            // alternative_titles 데이터를 displayTitles 함수로 넘겨줍니다.
            const alternativeTitles = type === 'movie' ? (responseData.alternative_titles.titles || []) : (responseData.alternative_titles.results || []);
            displayTitles(koTitle, enTitle, originalTitle, type, id, koreanRating, originCountry, productionCountry, year, imdbId, wikidataId, tvdbId, alternativeTitles); // originalLanguageCode는 displayTitles에서 사용하지 않으므로 제거해도 무방합니다.
            displayKoreanRating(koreanRating);
            // 아래 한 줄을 다시 추가합니다.
            displayAdditionalInfo(originCountry, productionCountry, koTitle, enTitle, imdbId, wikidataId, tvdbId, year, originalLanguageCode);
        } catch (error) {
            console.error('TMDB API 요청 오류:', error);
        }
    };

    const displayLanguageLinksForPersonPage = () => {
        if (!window.location.pathname.includes('/person/')) return;
        if (document.getElementById('language-switch-person')) return;

        const header = document.querySelector('.header.large') || document.querySelector('.title') || document.querySelector('h2');
        // [추가] '위키' 링크에 사용할 인물 이름을 페이지 제목(h2 a 태그)에서 가져옵니다.
        const personNameElement = document.querySelector('.title h2 a');
        if (!header || !personNameElement) return;

        // [추가] 인물 이름 텍스트를 추출하고, 이를 이용해 구글 '위키' 검색 URL을 생성합니다.
        const personName = personNameElement.textContent.trim();
        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(personName)}+%EC%9C%84%ED%82%A4`;

        const langBar = document.createElement('div');
        langBar.id = 'language-switch-person';
        langBar.innerHTML = `
            <div style="margin-top: 5px; font-size: 12pt;">
                ▶ <a href="${window.location.pathname}?language=ko-KR">🇰🇷</a>
                <a href="${window.location.pathname}?language=en-US">🇺🇸</a>
                <a href="${window.location.pathname}?language=ja-JP">🇯🇵</a>
                <a href="${window.location.pathname}?language=zh-CN">🇨🇳</a>
                ▶ <a href="${googleSearchUrl}" target="_blank">위키</a>
            </div>
        `;
        header.parentNode.insertBefore(langBar, header.nextSibling);
    };

    const init = () => {
        fetchData();
    };

    window.addEventListener('load', init);

    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            init();
        }
    }).observe(document, {subtree: true, childList: true});

    let lastUrl = location.href;
    // 단축키 리스너 추가
    window.addEventListener('keydown', (event) => {
        // 현재 URL에 'images/posters'가 포함되어 있고, 눌린 키가 F5일 경우에만 동작
        if (event.key === 'F5' && window.location.pathname.includes('/images/posters')) {

            // Ctrl+F5: 브라우저 기본 동작(강력 새로고침)을 그대로 수행하도록 아무 처리도 하지 않음
            if (event.ctrlKey) {
                return;
            }

            // 이후의 모든 F5 관련 키 조합에 대해 브라우저의 기본 새로고침 동작을 차단
            event.preventDefault();

            const currentUrl = new URL(window.location.href);
            const baseUrl = window.location.pathname.split('/images/posters')[0];

            // Alt+F5: URL을 .../images/posters?image_language=ko 로 강제 변경
            if (event.altKey) {
                window.location.href = `${window.location.origin}${baseUrl}/images/posters?image_language=ko`;
                return;
            }

            // Shift+F5: URL을 .../images/posters?image_language=xx 로 강제 변경
            if (event.shiftKey) {
                window.location.href = `${window.location.origin}${baseUrl}/images/posters?image_language=xx`;
                return;
            }

            // F5 단독: 현재 URL 상태에 따라 순차적으로 동작
            const langParam = currentUrl.searchParams.get('image_language');

            if (currentUrl.pathname.endsWith('/images/posters') && langParam === null) {
                // 상태 1: URL이 /images/posters로 끝날 경우 -> ?image_language=xx 추가
                currentUrl.searchParams.set('image_language', 'xx');
                window.location.href = currentUrl.toString();
            } else if (langParam === 'xx') {
                // 상태 2: URL에 ?image_language=xx가 있을 경우 -> ?image_language=ko 로 변경
                currentUrl.searchParams.set('image_language', 'ko');
                window.location.href = currentUrl.toString();
            } else if (langParam === 'ko') {
                // 상태 3: URL에 ?image_language=ko가 있을 경우 -> 페이지 새로고침
                window.location.reload();
            }
        }
    });
})();