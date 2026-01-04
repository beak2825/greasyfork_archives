// ==UserScript==
// @name         arcaliveDualMode2
// @namespace    http://tampermonkey.net/
// @version      0.46
// @description  아카라이브 심야식당 게시글 목록을 둘로나눠, 좌우에 각각 보여줍니다.
// @author       Jayscript
// @match        https://arca.live/b/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arca.live
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446628/arcaliveDualMode2.user.js
// @updateURL https://update.greasyfork.org/scripts/446628/arcaliveDualMode2.meta.js
// ==/UserScript==
"use strict";

let originalMediaWidth = getOriginalMediaWidth2();
const originalContentWrapper = getContentWrapperCloned();
let changedContentWrapper;

let timer = null;


function arcaliveDualMode()
{
    if (window.innerWidth >100)
    {
        removeRightSidebar();
        extendContentWrapper();
        moveArticlesToRightPlane();
        restoreMediaSize2();
        changedContentWrapper = getContentWrapper();
        changedContentWrapper.after(originalContentWrapper);
        setDisplayOptionAsWidthSize();
    }

    addEventListener('resize', function() {	clearTimeout(timer); timer = setTimeout(setDisplayOptionAsWidthSize, 300); console.log('event');} );
}

function setDisplayOptionAsWidthSize()
{
    if (window.innerWidth > 1800)
    {
        originalContentWrapper.style.display = 'none';
        originalContentWrapper.querySelector('.right-sidebar').style.display ='none';
        changedContentWrapper.style.display = 'block';
        changedContentWrapper.querySelector('.right-sidebar').style.display ='none';
    }
    else
    {
        originalContentWrapper.style.display = 'block';
        let originalSidebar=originalContentWrapper.querySelector('.right-sidebar');
        originalSidebar.style.display='block';
        for (const el of originalSidebar.children){
            el.style.display='block';
        }
        // TODO: Display Sidebar As small size.
        changedContentWrapper.style.display = 'none';
        changedContentWrapper.querySelector('.right-sidebar').style.display ='none';
    }
}

function getOriginalMediaWidth() {
    let image=document.querySelector('.fr-view.article-content img');
    let video=document.querySelector('.fr-view.article-content video');
    let width =null;
    if (image){
        width = image.offsetWidth;
    }
    if (video){
        width = video.offsetWidth;
    }
    return width;
};
function getOriginalMediaWidth2() {
    let images=document.querySelectorAll('.fr-view.article-content img');
    let videos=document.querySelectorAll('.fr-view.article-content video');
    let widths = {'image':[],'video':[]};
    if (images){
        images.forEach((el)=>widths.image.push(el.offsetWidth));
    }
    if (videos){
        videos.forEach((el)=>widths.video.push(el.offsetWidth));
    }
    return widths;
};


function getContentWrapperCloned() {
    return getContentWrapper().cloneNode(true);
}
function getContentWrapper() {
    return document.querySelector('.content-wrapper.clearfix');
}

function removeRightSidebar()
{
    document.querySelector('.right-sidebar').style.display = 'none';
}

function extendContentWrapper()
{
    const contentWrapper = document.querySelector('.content-wrapper.clearfix');
    contentWrapper.style='margin:0 5rem 0;max-width:100%';
    const containerBoard = document.querySelector('.containe-fluid.board-article');
    containerBoard.style='margin:0';
}
function moveArticlesToRightPlane()
{
    cloneArticleListAndArrangeIt();
    moveHalfToRightPlane();
}

function cloneArticleListAndArrangeIt()
{
    let articleList = document.querySelector('.article-list');
    let articleList2 = articleList.cloneNode(true);
    articleList.after(articleList2);

    articleList.style='margin:5 0rem 0 0;float:left;width:49%;';
    articleList2.style='margin:5 0rem 0 0;float:right;width:49%;';

    articleList2.querySelector('.list-table').childNodes.forEach( el => el.tagName=='A' && el.remove() );
}
function moveHalfToRightPlane()
{
    let articleList = document.querySelector('.article-list');
    let articleList2 = document.querySelectorAll('.article-list')[1];
    let articleTable2 = articleList2.querySelector('.list-table');

    let articles=articleList.querySelectorAll('a.vrow:not(.notice)');
    let articles2=articleList2.querySelectorAll('a.vrow:not(.notice)');
    let noticesInArticles2=articleList2.querySelectorAll('a.vrow.notice');

    articles.forEach((el, i) => i>=articles.length/2 && articleTable2.append(el));
}

function restoreMediaSize()
{
    let images = document.querySelectorAll('.fr-view.article-content img');
    let videos = document.querySelectorAll('.fr-view.article-content video');
    images.forEach(function (el) { el.style.width = `${originalMediaWidth}px`;});
    videos.forEach(function (el) { el.style.width = `${originalMediaWidth}px`;});
    console.log(originalMediaWidth);
}
function restoreMediaSize2()
{
    let images = document.querySelectorAll('.fr-view.article-content img');
    let videos = document.querySelectorAll('.fr-view.article-content video');
    images.forEach(function (el, i) { el.style.width = `${originalMediaWidth.image[i]}px`;});
    videos.forEach(function (el, i) { el.style.width = `${originalMediaWidth.video[i]}px`;});
}

addEventListener('load',setTimeout(arcaliveDualMode,0));