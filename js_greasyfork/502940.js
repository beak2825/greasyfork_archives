// ==UserScript==
// @name         Namu Hot Now beta
// @name:ko      나무위키 실검 알려주는 스크립트 베타
// @namespace    https://arca.live/b/namuhotnow
// @version      0.9.7.1
// @description  이게 왜 실검?
// @author       KEMOMIMI
// @match        https://namu.wiki/*
// @match        https://arca.live/*
// @connect      arca.live
// @icon         https://www.google.com/s2/favicons?sz=64&domain=namu.wiki
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/502940/Namu%20Hot%20Now%20beta.user.js
// @updateURL https://update.greasyfork.org/scripts/502940/Namu%20Hot%20Now%20beta.meta.js
// ==/UserScript==

var linkElements = [];
var pairs = [];
var splittedPairs = [];
var previousSpansContent = "";
var storedElements = [];

function findLinkByPartialMatch(keyword) {
    // 1. splittedPairs에서 정확히 일치하는 항목 찾기
    for (let i = 0; i < splittedPairs.length; i++) {
        let pair = splittedPairs[i];
        let text = pair.text;
        // 정확히 일치하는 경우
        if (text.toLowerCase() === keyword.toLowerCase()) {
            return [pair.link, pair.badges];
        }
    }
    // 2. 정확히 일치하는 항목이 없으면 pairs에서 부분 일치 찾기
    for (let i = 0; i < pairs.length; i++) {
        let pair = pairs[i];
        let text = pair.text;
        const regex = /<\/b>|<b[^>]*>/g;
        var modifiedText = text.replace(regex, '');
        if (modifiedText.toLowerCase().includes(keyword.toLowerCase())) {
            return [pair.link, pair.badges];
        }
    }
    // 3. 일치하는 항목이 없는 경우
    return [null, null];
}

function getSpansContent() {
    var spansContent = [];
    var spans = Array.from(document.querySelectorAll('#app ul>li>a>span')).slice(0, 10);
    spans.forEach(function(span) {
        spansContent.push(span.textContent);
    });
    return spansContent.join('').trim();
}

function removeLinkElements() {
    for (var i = 0; i < linkElements.length; i++) {
        var linkElement = linkElements[i];
        linkElement.parentNode.removeChild(linkElement);
    }
    linkElements = [];
}
function checkMobileHotkewordOpened(){
    const aTags = Array.from(document.querySelector('a[title="아무 문서로 이동"]').parentElement.querySelectorAll('a'));
    if (aTags.length > 10) {
        return true
    }else{
        return false
    }
}
function checkMobileHotkeword(){
    var chk = setInterval(function() {
        var svgTags = Array.from(document.querySelector('a[title="아무 문서로 이동"]').parentElement.querySelectorAll('svg'));
        if (svgTags.length<5) {
            var whyHotElements = document.querySelectorAll('.whyHot');
            whyHotElements.forEach(function(element) {

                element.remove();
            });
            const elementsWithParentClass = document.querySelectorAll('.namuHotParentClass');
            elementsWithParentClass.forEach(parentElement => {
                const childAElement = parentElement.querySelector('a');
                if (childAElement) {
                    parentElement.parentNode.insertBefore(childAElement, parentElement.nextSibling);
                    parentElement.remove();
                }
            });
        }else if (svgTags.length>=5){
            const elementsWithParentClass = document.querySelectorAll('.namuHotParentClass');
            let count = 0;
            elementsWithParentClass.forEach(parentElement => {
                const childAnchorElements = parentElement.querySelectorAll('a');
                childAnchorElements.forEach(anchorElement => {
                    if (anchorElement.getAttribute('href') === '#') {
                        count++;
                    }
                });
            });

            if (count == 0) {
                const elementsWithParentClass = document.querySelectorAll('.namuHotParentClass');
                elementsWithParentClass.forEach(function(element) {
                    element.remove();
                });
            }
            if (elementsWithParentClass.length == 0) {
                if (checkMobileHotkewordOpened()) {
                    clearInterval(chk);
                    refreshLink(2);
                }
            }
        }
    }, 100);


}


// 랜덤 x-device-token 받기
async function getUniqueId() {
    const UNIQUE_ID_KEY = 'unique_random_id';
    let uniqueId = await GM.getValue(UNIQUE_ID_KEY, null);
    if (!uniqueId) {
        uniqueId = generateRandomString(64);
        await GM.setValue(UNIQUE_ID_KEY, uniqueId);
    }
    return uniqueId;
}

function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}


async function fetchArcaData(before = null, limit = 50) {
    try {
        // 이전에 생성한 고유 ID 가져오기
        const deviceToken = await getUniqueId();

        // URL 생성 (before 파라미터가 있으면 추가)
        let url = `https://arca.live/api/app/list/channel/namuhotnow?limit=${limit}`;
        if (before) {
            url += `&before=${before}&offset=1`;
        }

        // Promise로 GM_xmlhttpRequest 래핑
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                nocache: true,
                headers: {
                    "User-Agent": "net.umanle.arca.android.playstore/0.9.83",
                    "Accept-Encoding": "gzip",
                    "x-device-token": deviceToken
                },
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        //console.log("데이터 불러오기 성공:", data);
                        resolve(data);
                    } else {
                        console.error("API 요청 오류:", response.status);
                        reject(new Error(`API 요청 오류: ${response.status}`));
                    }
                },
                onerror: function(error) {
                    console.error("API 요청 실패:", error);
                    reject(error);
                }
            });
        });
    } catch (error) {
        console.error("API 요청 실패:", error);
        throw error;
    }
}



//실검챈에서 게시물 링크를 수집하여 pairs에 저장하는 함수
async function updatePairs(page) {
    try {
        pairs = [];

        // 첫 번째 API 요청 (초기 데이터)
        const apiData = await fetchArcaData();

        if (!apiData || !apiData.articles || apiData.articles.length === 0) {
            throw new Error('API 데이터가 유효하지 않습니다');
        }

        // 첫 번째 API 응답 데이터를 pairs에 추가
        apiData.articles.forEach(article => {
            const badgesText = article.categoryDisplayName || '이왜실?';
            const link = '/b/namuhotnow/' + article.id;
            const text = article.title;

            pairs.push({
                text: text,
                link: link,
                badges: badgesText
            });
        });

        // 두 번째 API 요청을 위한 마지막 항목의 createdAt 추출
        const lastArticle = apiData.articles[apiData.articles.length - 1];
        const lastCreatedAt = lastArticle.createdAt;

        // 두 번째 API 요청 (추가 데이터)
        const moreApiData = await fetchArcaData(lastCreatedAt);

        // 두 번째 API 응답이 있으면 pairs에 추가
        if (moreApiData && moreApiData.articles && moreApiData.articles.length > 0) {
            moreApiData.articles.forEach(article => {
                const badgesText = article.categoryDisplayName || '이왜실?';
                const link = '/b/namuhotnow/' + article.id;
                const text = article.title;

                // 중복 제거를 위한 검사 (선택적)
                const isDuplicate = pairs.some(pair => pair.link === link);
                if (!isDuplicate) {
                    pairs.push({
                        text: text,
                        link: link,
                        badges: badgesText
                    });
                }
            });
        }

        // 수동 연결 항목 추가
        pairs.push({
            text: "나무위키 실검 알려주는 채널, 실검챈",
            link: "/b/namuhotnow/112775488",
            badges: "❗️공지"
        });

        // 이모지 표시 설정에 따른 처리
        const emojiDisplay = await GM.getValue('emojiDisplay', true);
        if (!emojiDisplay) {
            pairs.forEach(pair => {
                let index = 0;
                for (let i = 0; i < pair.badges.length; i++) {
                    if (/[가-힣a-zA-Z]/.test(pair.badges[i])) {
                        index = i;
                        break;
                    }
                }
                pair.badges = pair.badges.substring(index);
            });
        }
        //console.log(pairs);
        console.log(`총 ${pairs.length}개의 게시물을 불러왔습니다.`);
    } catch (error) {
        console.error('Error in updatePairs:', error);
        throw error;
    }
}

function makeSplittedPairs(){
    pairs.forEach(function(pair) {
        var text = pair.text;
        var pattern = /.+\)\s.+/;
        var content = text;

        // "카테고리) " 형태의 접두사가 있는지 확인
        if (pattern.test(text)) {
            pattern = /^(.+)\)\s(.+)$/;
            const match = text.match(pattern);
            content = match[2]; // 접두사를 제외한 실제 내용 부분
        }

        // 콤마로 분할하고 각 항목의 앞뒤 공백 제거
        var splitItems = content.split(',').map(item => item.trim());

        // 분할된 각 항목에 대해 새 객체를 생성하여 splittedPairs에 추가
        splitItems.forEach(function(item) {
            splittedPairs.push({
                text: item,
                link: pair.link,
                badges: pair.badges
            });
        });
    });

}

async function refreshLink(type) {
    try {
        await updatePairs(2);
    } catch (error) {
        console.error("업데이트 중 오류:", error);
    }
    makeSplittedPairs();


    if(type == 0){
        var realtimeList = Array.from(document.querySelectorAll('#app ul>li>a>span')).slice(0, 10);
        realtimeList.forEach(function(titleElement) {
            var [resultLink, resultBadges] = findLinkByPartialMatch(titleElement.innerText.trim());
            if (resultLink != null){
                var linkElement = document.createElement('a');
                linkElement.href = 'https://arca.live' + resultLink;
                linkElement.textContent = resultBadges;
                linkElement.display = 'flex';
                linkElement.width = '40%';
                linkElement.target="_blank";
                linkElement.style.margin = "auto 5px";
                linkElement.setAttribute('data-v-userxcript', '');
                linkElement.className = 'namuHotBtnStyle';
                const parentLiTag = titleElement ? titleElement.parentElement.parentElement : null;
                parentLiTag.querySelector('a').style.width = "60%";
                parentLiTag.appendChild(linkElement);
                linkElements.push(linkElement);
            }
        });
    }else if(type == 1){
        makeArcaHotKeywordSide();

    }else if(type == 2){
        var namuHotParentClass = document.querySelectorAll('.namuHotParentClass');
        if (!namuHotParentClass[0]) {
            const aTags = Array.from(document.querySelector('a[title="아무 문서로 이동"]').parentElement.querySelectorAll('a'));
            const mobileList = aTags.length > 10 ? aTags.slice(-10) : aTags;
            mobileList.forEach(function(element) {
                var [resultLink, resultBadges] = findLinkByPartialMatch(element.innerText.trim());
                var newParent = document.createElement('span');
                newParent.classList.add('namuHotParentClass');

                if (resultLink != null){

                    var linkElement = document.createElement('a');
                    linkElement.href = 'https://arca.live' + resultLink;
                    linkElement.textContent = resultBadges;
                    linkElement.width = '20px';
                    linkElement.target="_blank";
                    linkElement.title = resultBadges;
                    linkElement.className = 'namuHotBtnStyle whyHot';
                    linkElement.setAttribute('data-v-userxcript', '');
                    linkElement.style.margin = "auto 5px";
                    element.style.width = "70%";

                    var beforePseudoElement = window.getComputedStyle(element, ':before');
                    element.parentNode.insertBefore(newParent, element);
                    newParent.appendChild(element);
                    newParent.appendChild(linkElement);
                    newParent.style.display = 'flex';
                    linkElements.push(linkElement);
                }else{
                    element.parentNode.insertBefore(newParent, element);
                    newParent.appendChild(element);
                    element.style.width = "100%";
                    newParent.style.display = 'flex';
                }
            });
            checkMobileHotkeword();
        }
    }
}

function makeArcaHotKeywordSide(){
    // 사이드바(aside 태그) 찾기
    const sidebar = document.querySelector('aside');

    if (!sidebar) {
        console.error('사이드바를 찾을 수 없습니다.');
        return;
    }

    // 실시간 검색어 섹션 생성
    const searchSection = document.createElement('div');
    searchSection.className = 'sidebar-item';
    searchSection.innerHTML = `
        <div class="item-title">
            <a href="/b/namuhotnow">실시간 검색어</a>
        </div>
        <div class="link-list">
            <!-- 검색어 항목들이 여기에 추가됩니다 -->
        </div>
    `;
    // 실검 스크립트 제공 메시지 추가
    const poweredByMsg = document.createElement('div');
    poweredByMsg.style.textAlign = 'right';
    poweredByMsg.style.fontSize = '0.8em';
    poweredByMsg.style.color = '#777';
    poweredByMsg.style.padding = '5px 10px';
    poweredByMsg.textContent = 'by. 실검챈 스크립트';
    searchSection.appendChild(poweredByMsg);


    // aside 내의 마지막 .sidebar-item 찾기
    const sidebarItems = sidebar.querySelectorAll('.sidebar-item');
    if (sidebarItems.length > 0) {
        // 마지막 .sidebar-item 가져오기
        const lastSidebarItem = sidebarItems[sidebarItems.length - 1];

        // insertAdjacentElement를 사용하여 마지막 .sidebar-item 바로 다음에 삽입
        lastSidebarItem.insertAdjacentElement('afterend', searchSection);
    } else {
        sidebar.insertBefore(searchSection, sidebar.firstChild);
    }

    // 링크 리스트 컨테이너 참조
    const linkList = searchSection.querySelector('.link-list');

    // 나무위키 실시간 검색어 API에서 데이터 가져오기
    fetch('https://search.namu.wiki/api/ranking', {
        cache: 'no-store'
    })
        .then(response => response.json())
        .then(data => {
        // 상위 10개 검색어만 처리
        data.slice(0, 10).forEach((searchTerm, index) => {
            // 실검챈에서 해당 검색어에 대한 링크와 배지 찾기
            const [resultLink, resultBadges] = findLinkByPartialMatch(searchTerm.trim());

            // HTML 생성 (resultLink가 없으면 기본값 사용)
            const finalLink = resultLink || `/b/namuhotnow?q=${encodeURIComponent(searchTerm)}`;
            const finalBadges = resultBadges || (index + 1);

            const searchItemDiv = document.createElement('div');
            searchItemDiv.style.padding = '.15rem .5rem .15rem 0';
            searchItemDiv.style.userSelect = 'auto';

            if (resultLink !== null && resultBadges !== null) {
                searchItemDiv.innerHTML = `
            <span class="leaf-info float-right" title="[${resultBadges}] ${searchTerm} 왜 실검?" style="margin:0; user-select: auto;">
                <time style="user-select: auto;">
                    <a href="${finalLink}" target="blank" style="font-size: 1em; padding-Right: 0; user-select: auto;">${resultBadges}</a>
                </time>
            </span>
            <a href="//namu.wiki/Go?q=${encodeURIComponent(searchTerm)}" target="_blank" title="${searchTerm}" style="padding:.15rem 1.5rem .15rem 0; user-select: auto;">${searchTerm}</a>
        `;
            } else {
                // span 요소 없이 검색어 링크만 생성
                searchItemDiv.innerHTML = `
            <a href="//namu.wiki/Go?q=${encodeURIComponent(searchTerm)}" target="_blank" title="${searchTerm}" style="padding:.15rem 1.5rem .15rem 0; user-select: auto;">${searchTerm}</a>
        `;
            }

            // 생성한 요소를 링크 리스트에 추가
            linkList.appendChild(searchItemDiv);
        });
    })
        .catch(error => {
        console.error('실시간 검색어 데이터를 가져오는 중 오류 발생:', error);
    });
}


function isPC() {
    if ((window.innerWidth || document.documentElement.clientWidth) >= 1024) {
        return true;
    } else {
        return false;
    }
}

function appendStyle() {
    var style = document.createElement('style');
    var css = `
${[...Array(10)].map((_, i) => `
.namuHotParentClass:nth-of-type(${i + 1}) > a:nth-child(1):before {
    content: "${i + 1}." !important;
}`).join('')}
    .whyHot {
      align-items: center;
      border: 1px solid transparent;
      border-radius: var(--nav-bar-child-radius-var);
      display: flex;
      padding: var(--search-box-suggest-item-gutter-y-var) var(--search-box-suggest-item-gutter-x-var);
      text-decoration: none;
      word-break: break-all;
    }
    .namuHotBtnStyle[data-v-userxcript] {
      display: inline-flex;
      font-size: 0.8rem;
      justify-content: center;
      overflow: hidden;
      padding: 0.2rem 0.4rem;
      text-decoration: none;
      transition: background-color 0.1s ease-in, box-shadow 0.1s linear;
      white-space: nowrap;
      border-color: #e0e0e0;
      border-radius: 3px;
      height: 1.6rem;
      min-width: 2.4rem;
      color: black;
    }

    .namuHotBtnStyle[data-v-userxcript]:hover,
    .namuHotBtnStyle[data-v-userxcript]:active {
      background-color: #f2f2f2;
    }

    .namuHotBtnStyle[data-v-userxcript]:focus-visible {
      --focus-outline-color: var(--brand-bright-color-2, #e3e3e3);
      box-shadow: 0 0 0 0.2rem var(--focus-outline-color);
    }

    .namuHotBtnStyle[data-v-userxcript] svg {
      height: 0.8rem;
      fill: currentColor;
    }

    .theseed-dark-mode .namuHotBtnStyle[data-v-userxcript] {
      background-color: #282829;
      border-color: #484848;
      color: var(--dark-text-color, var(--text-color, #e0e0e0));
    }

    .theseed-dark-mode .namuHotBtnStyle[data-v-userxcript]:hover {
      background-color: #555;
    }

    .theseed-dark-mode .namuHotBtnStyle[data-v-userxcript]:active {
      background-color: #515151;
    }

    .theseed-dark-mode .namuHotBtnStyle[data-v-userxcript]:focus-visible {
      --focus-outline-color: #4e4e4e;
    }
`;
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
}

function checkPopularSearchText() {
    const itemTitles = document.querySelectorAll('.item-title');
    for (let title of itemTitles) {
        if (title.textContent.trim() === "인기검색어") {
            return true;
        }
    }
    return false;
}

(async () => {
    'use strict';
    if (window.location.href.includes('namu.wiki')) {
        appendStyle();
        if(isPC()){
            setInterval(function() {
                var content = getSpansContent();
                if (content.length > 0 && previousSpansContent !== getSpansContent()) {
                    previousSpansContent = getSpansContent();
                    removeLinkElements();
                    refreshLink(0);
                }
            }, 100);
        }else{
            var interNamuMobile = setInterval(function() {
                if (checkMobileHotkewordOpened()) {
                    clearInterval(interNamuMobile);
                    refreshLink(2);
                }
            }, 50);
        }
    }

    if (/arca.live\/b\/namuhotnow\/[0-9]+/.test(window.location.host + window.location.pathname)) {
        const spanElement = document.querySelector('span.badge.badge-success.category-badge');
        var isNotice = false
        var isBanComment = false
        var banCategory = ""
        if (spanElement) {
            const textContent = spanElement.textContent.trim();
            if (textContent.includes("공지")) {
                isNotice = true;
            }
            if (textContent.includes("인방")) {
                isBanComment = true;
                banCategory = "인방"
            }
            if (textContent.includes("정치")) {
                isBanComment = true;
                banCategory = "정치"
            }

        }
        if(isBanComment && await GM.getValue('streamingCommentDisplay', true)){
            const commentForm = document.getElementById('commentForm');
            if (commentForm) {
                commentForm.style.display = 'none';

                const toggleButton = document.createElement('button');
                toggleButton.textContent = '❗️'+banCategory+'탭 댓글쓰기❗️';
                toggleButton.style.marginBottom = '1.75em';
                toggleButton.style.marginRight = '.75em';
                toggleButton.style.float = 'right';
                toggleButton.className = 'btn btn-arca btn-arca-article-write';

                toggleButton.addEventListener('click', function() {
                    toggleButton.style.display = 'none';
                    commentForm.style.display = 'block';
                });
                commentForm.parentNode.insertBefore(toggleButton, commentForm);

                const replyLinks = document.querySelectorAll('.reply-link');
                replyLinks.forEach(link => {
                    link.innerHTML = `<span class="icon ion-reply"></span> 답글(`+banCategory+`)`;
                    const icon = link.querySelector('.ion-reply');
                    icon.style.color = '#F9312E';
                    icon.style.fill = '#F9312E';
                });
            }
        }

        if(!isNotice){
            const titleElement = document.querySelector('.title-row > .title');
            const titleOriginalText = titleElement.lastChild.data.trim();
            var pattern = /.+\)\s.+/;
            var prefix = "";
            var suffix = titleOriginalText;

            if (pattern.test(titleOriginalText)) {
                pattern = /^(.+)\)\s(.+)$/;
                const match = titleOriginalText.match(pattern);
                prefix = match[1]+") "; // "괄호부분) "
                suffix = match[2]; // "실검 키워드"
            }

            titleElement.removeChild(titleElement.lastChild);
            titleElement.appendChild(document.createTextNode("\n"));
            titleElement.appendChild(document.createTextNode(prefix));
            suffix.split(', ').forEach((title, idx, array) => {
                var linkElement = document.createElement('a');
                linkElement.href = 'https://namu.wiki/Go?q=' + encodeURIComponent(title);
                linkElement.textContent = title;
                linkElement.target="_blank"
                const element = document.querySelector('.containe-fluid.board-article');
                if (element) {
                    const bgColor = window.getComputedStyle(element).backgroundColor;
                    const rgbValues = bgColor.match(/\d+/g);

                    if (rgbValues && rgbValues.length >= 3) {
                        const allAbove200 = rgbValues.slice(0, 3).every(value => Number(value) > 200);
                        if (allAbove200){
                            linkElement.style.color = '#144c75'; // 진한 남색
                        }else{
                            linkElement.style.color = '#a8cfed'; // 연한 하늘색
                        }
                    } else {
                        console.log('RGB 값을 확인할 수 없습니다.');
                    }
                } else {
                    console.log('해당 클래스를 가진 요소를 찾을 수 없습니다.');
                }

                linkElement.style.cursor = 'pointer';
                titleElement.appendChild(linkElement);
                if (idx + 1 < array.length) {
                    titleElement.appendChild(document.createTextNode(", "));
                }
            });
        }
    }
    if (window.location.href.includes('arca.live')&& await GM.getValue('showArcaHotNow', true)) {
        var intervalId = setInterval(function() {
            var firstLinkLista = document.querySelector('aside .link-list a');
            if (firstLinkLista && firstLinkLista.innerHTML !== "&nbsp;") {
                clearInterval(intervalId);
                refreshLink(1);
            }
        }, 50);
    }
    if(window.location.href.includes('arca.live/b/namuhotnow') && await GM.getValue('rankDisplay', true)){
        fetch('https://search.namu.wiki/api/ranking')
            .then(response => response.json())
            .then(data => {
            const rankings = {};
            const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '️5️⃣', '6️⃣', '️7️⃣', '️8️⃣', '9️⃣', '🔟'];

            data.slice(0, 10).forEach((item, index) => {
                const emoji = emojis[index];
                const trimmedItem = item.trim();
                rankings[trimmedItem] = emoji;
            });

            // 테스트 항목 추가
            // rankings["La"] = "⭐";
            // rankings["실검"] = "⭐";

            const keywords = Object.keys(rankings).sort((a, b) => b.length - a.length);

            // ❗️공지가 포함된 .table 요소들 필터링
            const filteredTables = Array.from(document.querySelectorAll('.col-title')).filter(table => {
                const badgesEl = table.querySelector('.badges');
                return !badgesEl || !badgesEl.textContent.includes('❗️공지');
            });

            const titleElements = filteredTables.flatMap(table =>
                                                         Array.from(table.querySelectorAll('.title'))
                                                        );

            titleElements.forEach(element => {
                let text = element.innerHTML;
                // DOMParser를 사용하여 HTML 텍스트에서 순수 텍스트만 추출하는 함수
                keywords.forEach(keyword => {
                    // title 요소를 임시 div에 복사하여 작업
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = text;

                    // innerText로 순수 텍스트 추출
                    const pureText = tempDiv.innerText;

                    // 정확한 매칭 시도 (대소문자 구분)
                    let keywordIndex = pureText.indexOf(keyword);

                    // 정확한 매칭 실패시 대소문자 구분없이 매칭 시도
                    if (keywordIndex === -1) {
                        const lowerPureText = pureText.toLowerCase();
                        const lowerKeyword = keyword.toLowerCase();
                        keywordIndex = lowerPureText.indexOf(lowerKeyword);
                    }

                    if (keywordIndex !== -1) {
                        // 원본 HTML 구조는 유지한 채로 텍스트 노드만 수정
                        const textNodes = [];
                        const walker = document.createTreeWalker(
                            tempDiv, // root node
                            NodeFilter.SHOW_TEXT // 텍스트 노드만 선택
                        );

                        let node;
                        while (node = walker.nextNode()) {
                            textNodes.push(node);
                        }

                        let currentPosition = 0;
                        for (let textNode of textNodes) {
                            const nodeLength = textNode.textContent.length;
                            if (currentPosition <= keywordIndex &&
                                keywordIndex < currentPosition + nodeLength) {
                                const offset = keywordIndex - currentPosition;

                                // span 컨테이너를 사용하여 HTML 요소 생성
                                const container = document.createElement('span');
                                container.innerHTML =
                                    textNode.textContent.slice(0, offset) +
                                    `${rankings[keyword]}` +
                                    textNode.textContent.slice(offset + keyword.length);

                                // 기존 텍스트 노드를 새로운 HTML 구조로 교체
                                while (container.firstChild) {
                                    textNode.parentNode.insertBefore(container.firstChild, textNode);
                                }
                                textNode.parentNode.removeChild(textNode);
                                break;
                            }
                            currentPosition += nodeLength;
                        }

                        text = tempDiv.innerHTML;
                    }
                });
                element.innerHTML = text;
            });
            titleElements.forEach(element => {
                let html = element.innerHTML;

                // rankings 객체를 순회하면서 이모지에 해당하는 키워드 매칭
                Object.entries(rankings).forEach(([keyword, emoji]) => {
                    const regex = new RegExp(emoji, 'g');
                    html = html.replace(regex, `${emoji}<b><u>${keyword}</u></b>`);
                });

                element.innerHTML = html;
            });
        })
            .catch(error => console.error('Error:', error));
    }
    if(window.location.href.includes('arca.live/b/namuhotnow') && await GM.getValue('viewWholeTitle', true)){
        document.querySelectorAll('.table .title').forEach(function(element) {
            element.style.overflow = 'visible';
            element.style.whiteSpace = 'normal';
            element.style.textOverflow = 'clip';

            var vrow = element.closest('.vrow.column');
            if (vrow) {
                // vrow 스타일 설정
                Object.assign(vrow.style, {
                    height: 'auto',
                    minHeight: 'fit-content',
                    boxSizing: 'border-box'
                });

                // vrow-inner 스타일 설정
                const vrowInner = vrow.querySelector('.vrow-inner');
                if (vrowInner) {
                    Object.assign(vrowInner.style, {
                        height: 'auto',
                        width: '100%'
                    });
                }
            }
        });
    }



    if(window.location.href.includes('arca.live/b/namuhotnow/98121715')){
        const settingTitle = document.createElement('h4');
        settingTitle.textContent = '<스크립트 설정>';
        let EMOJI_STORAGE_KEY = 'emojiDisplay';
        let RANK_STORAGE_KEY = 'rankDisplay';
        let STREAMING_COMMENT_STORAGE_KEY = 'streamingCommentDisplay';
        let VIEW_WHOLE_TITLE_STORAGE_KEY = 'viewWholeTitle';
        let SHOW_ARCA_HOT_NOW_STORAGE_KEY = 'showArcaHotNow';
        const articleContent = document.querySelector('.article-content');
        const isEmojiDisplayed = await GM.getValue(EMOJI_STORAGE_KEY, true);
        const isRankDisplayed = await GM.getValue(RANK_STORAGE_KEY, true);
        const isBanCommentDisplayed = await GM.getValue(STREAMING_COMMENT_STORAGE_KEY, true);
        const isWholeTitleDisplayed = await GM.getValue(VIEW_WHOLE_TITLE_STORAGE_KEY, true);
        const isArcaHotNowDisplayed = await GM.getValue(SHOW_ARCA_HOT_NOW_STORAGE_KEY, true);

        // 이모지 표시 체크박스
        const emojiCheckbox = document.createElement('input');
        emojiCheckbox.type = 'checkbox';
        emojiCheckbox.checked = isEmojiDisplayed;
        const emojiLabel = document.createElement('label');
        emojiLabel.textContent = '이모지 표시: ';
        emojiLabel.appendChild(emojiCheckbox);
        emojiLabel.style.marginRight = '10px'; // 오른쪽 여백 추가

        // 랭킹 표시 체크박스
        const rankCheckbox = document.createElement('input');
        rankCheckbox.type = 'checkbox';
        rankCheckbox.checked = isRankDisplayed;
        const rankLabel = document.createElement('label');
        rankLabel.textContent = '실검챈에서 순위표시: ';
        rankLabel.appendChild(rankCheckbox);
        rankLabel.style.marginRight = '10px'; // 오른쪽 여백 추가

        // 인방정치탭 댓글 보호 체크박스
        const streamingCheckbox = document.createElement('input');
        streamingCheckbox.type = 'checkbox';
        streamingCheckbox.checked = isBanCommentDisplayed;
        const streamingLabel = document.createElement('label');
        streamingLabel.textContent = '인방/정치탭 댓글 보호: ';
        streamingLabel.appendChild(streamingCheckbox);
        streamingLabel.style.marginRight = '10px'; // 오른쪽 여백 추가

        // 글제목 줄이지 않기 체크박스
        const wholeTitleCheckbox = document.createElement('input');
        wholeTitleCheckbox.type = 'checkbox';
        wholeTitleCheckbox.checked = isWholeTitleDisplayed;
        const wholeTitleLabel = document.createElement('label');
        wholeTitleLabel.textContent = '글제목 줄이지 않기: ';
        wholeTitleLabel.appendChild(wholeTitleCheckbox);
        wholeTitleLabel.style.marginRight = '10px'; // 오른쪽 여백 추가

        // 아카 실검 사이드바 체크박스
        const arcaHotCheckbox = document.createElement('input');
        arcaHotCheckbox.type = 'checkbox';
        arcaHotCheckbox.checked = isArcaHotNowDisplayed;
        const arcaHotLabel = document.createElement('label');
        arcaHotLabel.textContent = '아카 실검 사이드바 표시: ';
        arcaHotLabel.appendChild(arcaHotCheckbox);

        // 설정 요소들을 DOM에 추가
        articleContent.parentNode.insertBefore(settingTitle, articleContent);
        articleContent.parentNode.insertBefore(emojiLabel, articleContent);
        articleContent.parentNode.insertBefore(rankLabel, articleContent);
        articleContent.parentNode.insertBefore(streamingLabel, articleContent);
        articleContent.parentNode.insertBefore(wholeTitleLabel, articleContent);
        articleContent.parentNode.insertBefore(arcaHotLabel, articleContent);

        // 이벤트 리스너 추가
        emojiCheckbox.addEventListener('change', async () => {
            await GM.setValue(EMOJI_STORAGE_KEY, emojiCheckbox.checked);
        });

        rankCheckbox.addEventListener('change', async () => {
            await GM.setValue(RANK_STORAGE_KEY, rankCheckbox.checked);
        });

        streamingCheckbox.addEventListener('change', async () => {
            await GM.setValue(STREAMING_COMMENT_STORAGE_KEY, streamingCheckbox.checked);
        });

        wholeTitleCheckbox.addEventListener('change', async () => {
            await GM.setValue(VIEW_WHOLE_TITLE_STORAGE_KEY, wholeTitleCheckbox.checked);
        });
        arcaHotCheckbox.addEventListener('change', async () => {
            await GM.setValue(SHOW_ARCA_HOT_NOW_STORAGE_KEY, arcaHotCheckbox.checked);
        });
    }
})();