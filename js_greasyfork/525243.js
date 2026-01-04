// ==UserScript==
// @name         rplayPreviewScan
// @namespace    http://tampermonkey.net/
// @version      0.0.2 2025-03-05
// @description  알플레이 콘텐츠 및 다시보기 페이지에서 프리뷰 파일이 있는지 스캔합니다. 
// @author       hehaho
// @match        https://rplay.live/creatorhome/*
// @match        https://rplay.live/c/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rplay.live
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525243/rplayPreviewScan.user.js
// @updateURL https://update.greasyfork.org/scripts/525243/rplayPreviewScan.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const rplayUrlPreview = {};
function getUserData() {
    const { AccountModule: data } = JSON.parse(localStorage.getItem("vuex") || `{}`);
    if (!data.token) {
        console.log('login을 하지 않음.');
        return {};
    }
    const { userInfo: { oid }, token } = data;
    return { oid, token };
}
async function getContentData(contentId, userData) {
    const url = `https://api.rplay-cdn.com/content?contentOid=${contentId}&status=published&withComments=false&withContentMetadata=false&requestCanView=true&includeWatchHistory=true&lang=ko&requestorOid=${userData.oid}&loginType=plax`;
    const data = await (await fetch(url)).json();
    return data;
}
function displayPreviewLink(contents, idx, url) {
    //있다면
    //console.log(rplayUrlPreview[url]);
    if(rplayUrlPreview[url]!=="nothing") {
        contents[idx].insertAdjacentHTML('beforeend', `<div class="font-bold" style="font-size:150%;color:Magenta"><a href="${rplayUrlPreview[url]}" target="_blank">프리뷰 있다</a></div>`);
    } else {
        contents[idx].insertAdjacentHTML('beforeend', `<div class="font-bold" style="font-size:100%;color:white">프리뷰 없다</div>`);
    }
}
//콘텐츠마다 프리뷰파일이 있는지 확인해 있다면 링크를 거는 기능
async function searchContent() {
    const userData = getUserData();
    const contents = document.querySelectorAll('.w-full.grid-cols-1 > .relative');
    const urls = Array.from(contents).map((val) => { return val.querySelector('a').href })
    // 모든 url의 프리뷰 파일이 있는지 확인함.
    for(let x in urls) {
        const url = urls[x];
        if (rplayUrlPreview[url] == undefined) {
            // 숫자와 영문으로 10글자 이상인것이 콘텐트 아이디
            const contentId = url.match(/[\w]{10,}/)[0];
            const data = await getContentData(contentId, userData);
            rplayUrlPreview[url] = data.previewFile;
            if(data.previewFile == undefined)
                rplayUrlPreview[url] = "nothing";
            // 처음 콘텐츠 로드했을 때는 프리뷰파일 유무 화면에 표시
            displayPreviewLink(contents, x, url);
        }
    }
    setTimeout(searchContent, 500);
}
setTimeout(searchContent, 500);
    // Your code here...
})();