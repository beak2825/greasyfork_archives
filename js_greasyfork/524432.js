// ==UserScript==
// @name         Arcalive gallery view
// @namespace    http://tampermonkey.net/
// @version      1.05
// @description  arcalive 게시글의 이미지를 미리보여줍니다.
// @author       You
// @include      /^https:\/\/arca\.live\/b\/([a-z]*)?([?&][a-z]=.*)*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arca.live
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524432/Arcalive%20gallery%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/524432/Arcalive%20gallery%20view.meta.js
// ==/UserScript==
//'use strict';
//

/* 파라미터 */
const IS_STRICT_SQUARE_IMAGE_MODE = false; // true로 바꾸면 이미지사이즈가 300x300박스를 초과하지않게됨.
const REMOVE_SIDE_BAR_MODE = false; // true시, 우측의 인기글 사이드바가 사라짐.


/* 사이트의 셀렉터 변경될 경우 수정하기 */
const TABLE_IMAGE_SELECTOR = ".article-content tbody img";
const VIDEO_SELECTOR = ".article-content video";
const IMAGE_SELECTOR = ".article-content img";
const ATTACH_TARGET_SELECTOR = "a.vrow.column .vcol.col-title";

const ARTICLE_CONTAINER_SELECTOR = ''
const ARTICLES_SELECTOR = ".vrow:not(.notice)";
const ARTICLES_WITHOUT_NOTICE_SELECTOR = ".article-list a.vrow.column";
const RATE_IN_ARTICLE_SELECTOR = ".vcol.col-rate"

/* 수정할 일 없음 */
const IMAGE_WIDTH_SMALL = 150;
const IMAGE_WIDTH_NORMAL = 200;
const IMAGE_WIDTH_LARGE = 300;
const IMAGE_WIDTH = IMAGE_WIDTH_LARGE;

const SENSITIVE_WARN_IMG = false; // 민감성 포스팅 이미지를 비우선으로할지말지 표시유무
const FETCH_DELAY = 60; // 바꿀필요없음. 50이하로쓰면 봇감지될가능성높음0
const WIDTH_THRESHOLD = 1800; // 안쓰이는 변수 ( 적용할지말지고민하다 그냥 안씀 ) 당시의도 : px단위. 이 px보다 커야 이미지미리보기가 발생한다


async function start() {
    const $table = document.querySelector("body > div.root-container > div.content-wrapper.clearfix > article > div > div.article-list > div.list-table.table");
    $table.style.display = 'flex';
    $table.style.flexWrap = 'wrap';
    $table.style.gap = '5px';

    extendContentWrapper();
    if (REMOVE_SIDE_BAR_MODE) removeRightSidebar();

    const vrows = document.querySelectorAll(ARTICLES_SELECTOR);
    vrows.forEach(vrow=>vrowToGallery(vrow));

    const vrowsPromiseArray = Array.from(vrows).map((vrow, i) => imageFetchAndAttach(vrow, (i+1) * FETCH_DELAY));
    const articles = document.querySelectorAll(ARTICLES_WITHOUT_NOTICE_SELECTOR);
    articles.forEach((article) => {
        article.style = "height: auto !important";
    });


    Promise.all(vrowsPromiseArray);
}

addEventListener("load", setTimeout(start, 0));

function vrowToGallery($vrow){
    const $title = $vrow.querySelector('.vcol.col-title');
    const $rate = $vrow.querySelector(RATE_IN_ARTICLE_SELECTOR);
    const $newRate = document.createElement('span');
    $newRate.style.fontWeight='bold';
    $newRate.style.padding='0 2px';
    $newRate.innerText = $rate.textContent;
    $title.append($newRate);
    $vrow.replaceChildren($title);
}

async function imageFetchAndAttach(vrow, delay) {
    // 이미지 페칭해서 붙임.
    await new Promise((r) => setTimeout(r, delay));

    const response = await fetch(vrow.href);
    const text = await response.text();
    const html = new DOMParser().parseFromString(text, "text/html");

    const tableImage = html.querySelector(TABLE_IMAGE_SELECTOR);
    const video = html.querySelector(VIDEO_SELECTOR);
    let image;

    if(tableImage) {
        image = tableImage;
    } else if (video && video.width >300) {
        image = new Image();
        image.src = video.poster;
    } else {
        const imageCandidates = html.querySelectorAll(IMAGE_SELECTOR);
        image = Array.from(imageCandidates).find(image=>SENSITIVE_WARN_IMG || !(image.width===1000 && image.height===667)) ?? new Image(300, 300);
    }

    fitImageSizeAndAlter(image);

    const target = vrow.querySelector(ATTACH_TARGET_SELECTOR);
    if (target) {
        target.style.width = `${IMAGE_WIDTH}px`;
        target.before(image);
    }

    vrow.style.display='flex';
    vrow.style.flexDirection='column';
    vrow.style.justifyContent = 'space-between';
    vrow.style.width=`${IMAGE_WIDTH}px`
}

function fitImageSizeAndAlter(image) {
    const aspectRatio = image.height / image.width;
    image.style.display = 'block';
    image.style.width = `${IMAGE_WIDTH}px`;
    image.style.height = `${aspectRatio * IMAGE_WIDTH}px`;

    if(IS_STRICT_SQUARE_IMAGE_MODE){
        image.style.display = 'block';
        image.style.objectFit = 'contain';
        image.style.height = `${IMAGE_WIDTH}px`;
    }
}

function removeRightSidebar() {
    document.querySelector(".right-sidebar").style.display = "none";
}

function extendContentWrapper() {
    const contentWrapper = document.querySelector(".content-wrapper.clearfix");
    contentWrapper.style = "margin:0 5rem 0;max-width:100%";
    const containerBoard = document.querySelector(".containe-fluid.board-article");
    containerBoard.style = "margin:0";
}
