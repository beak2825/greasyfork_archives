// ==UserScript==
// @name        漫画猫阅读器
// @namespace   Violentmonkey Scripts
// @match       https://www.maofly.com/manga/*/*
// @grant       none
// @version     0.5
// @author      chemPolonium
// @description 漫画猫阅读器，重排页面，按键翻页，奇偶切换，单双页切换
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/447188/%E6%BC%AB%E7%94%BB%E7%8C%AB%E9%98%85%E8%AF%BB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/447188/%E6%BC%AB%E7%94%BB%E7%8C%AB%E9%98%85%E8%AF%BB%E5%99%A8.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
/* jshint multistr: true */

(function () {
    "use strict";

    let comicContainer = document.getElementsByClassName("container-fluid comic-detail p-0")[0];
    comicContainer.style.maxWidth = '100%';

    let comicList = document.getElementsByClassName("img-content")[0];
    comicList.style.display = 'grid';
    comicList.style.direction = 'rtl';

    let comicListChildren = comicList.children;

    let currentImageIndex = 0;

    let pageNumPerScreen = 2;

    let loadedPageNum = 1;

    function setstyle(target) {
        target.style = {};
        target.style.height = '100vh';
        target.style.width = '100%';
        target.style.objectFit = 'contain';
    }


    function moveImageIndex(x) {
        let newImageIndex = currentImageIndex + x;
        if (newImageIndex < comicList.children.length && newImageIndex >= 0) {
            currentImageIndex = newImageIndex;
        }
    }

    function getImage(imageIndex) {
        return comicListChildren[imageIndex];
    }

    function getCurrentImage() {
        return getImage(currentImageIndex);
    }

    function moveToCurrentImage() {
        getCurrentImage().scrollIntoView();
    }

    function onePageDown() {
        moveImageIndex(pageNumPerScreen);
        moveToCurrentImage();
    }

    function onePageUp() {
        moveImageIndex(-pageNumPerScreen);
        moveToCurrentImage();
    }

    function setSingleAlign(imageIndex) {
        if (pageNumPerScreen == 1) {
            comicListChildren[imageIndex].style.objectPosition = 'center';
        }
        if (pageNumPerScreen == 2) {
            comicListChildren[imageIndex].style.objectPosition = (imageIndex % 2 == 0) ? 'left' : 'right';
        }
    }

    function setAlign() {
        for (let imageIndex = 0; imageIndex < comicListChildren.length; imageIndex++) {
            setSingleAlign(imageIndex);
        }
    }

    function setPageNumPerScreen(pageNum) {
        comicList.style.gridTemplateColumns = 'repeat(' + String(pageNum) + ', 1fr)';
        moveToCurrentImage();
        pageNumPerScreen = pageNum;
        currentImageIndex -= (currentImageIndex % pageNum);
        setAlign();
    }

    setstyle(comicList.firstElementChild);

    moveToCurrentImage();

    setPageNumPerScreen(2);

    function createTitlePage() {
        let titlePage = document.createElement('p');
        titlePage.textContent = document.title;
        titlePage.style.fontSize = 'xx-large';
        titlePage.style.maxWidth = '30vw';
        titlePage.style.marginTop = '30%';
        titlePage.style.marginRight = '20%';
        titlePage.style.whiteSpace = 'normal';
        return titlePage;
    }

    let titlePage = createTitlePage();

    let parityChanged = false;

    function switchParity() {
        if (parityChanged) {
            comicListChildren[0].remove();
        } else {
            comicList.insertAdjacentElement('afterbegin', titlePage);
        }
        parityChanged = !parityChanged;
        setAlign();
        moveToCurrentImage();
    }

    document.addEventListener('keydown', (event) => {
        switch (event.code) {
            case 'ArrowRight':
                goNumPage('next');
                break;
            case 'ArrowLeft':
                goNumPage('pre');
                break;
            case 'KeyK':
                onePageUp();
                break;
            case 'KeyJ':
                onePageDown();
                break;
            case 'Semicolon':
                switchParity();
                break;
            case 'Digit1':
                setPageNumPerScreen(1);
                break;
            case 'Digit2':
                setPageNumPerScreen(2);
                break;
            default:
                console.log('key: ' + event.key + ' code: ' + event.code);
        }
    });

    let firstLoad = true;
    comicList.addEventListener('DOMNodeInserted', (event) => {
        setstyle(event.target);
        if (event.target.className != '') {
            loadedPageNum += 1;
        }
        if (parityChanged) {
            setSingleAlign(loadedPageNum);
        } else {
            setSingleAlign(loadedPageNum - 1);
        }
    });
})();
