// ==UserScript==
// @name        Hide bookmarked images in 'ppixiv for Pixiv'
// @namespace   https://greasyfork.org/en/users/938672-alban-thouvignon
// @description Adds a button to hide bookmarked images in 'ppixiv for Pixiv'
// @match       *://*.pixiv.net/*
// @version     3.5
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/451495/Hide%20bookmarked%20images%20in%20%27ppixiv%20for%20Pixiv%27.user.js
// @updateURL https://update.greasyfork.org/scripts/451495/Hide%20bookmarked%20images%20in%20%27ppixiv%20for%20Pixiv%27.meta.js
// ==/UserScript==

// Thanks to the author of ppixiv for his amazing work https://greasyfork.org/en/users/196998-ppixiv
// My code below is NOT optimized and only for my personnal enjoyment

// link to homemade album logo https://imgur.com/a/ju03rOD

/*jshint esversion: 6 */
let nIntervId;

function wait() {
    console.log("HBM - Waiting for thumbnails to load");
    let thumbnails = document.querySelectorAll(".thumbnails")[0];
    if(thumbnails !== undefined) {
        console.log("HBM - thumbnails are loaded");
        clearInterval(nIntervId);
        try {

            if (document.querySelectorAll('.btnBookmark').length >= 1) {
                return;
            }
            let artistMenu = document.querySelectorAll(".box-button-row");
            artistMenu.forEach(artistMenu_elem => {
                if (artistMenu_elem.classList.length > 1) {
                    return;
                }
                artistMenu_elem.insertAdjacentHTML("beforeend", '\
<a class="box-link btnBookmark">\
    <div class="label-box">\
        <span hidden="" class="icon"></span>\
        <span class="label">Bookmark visibility</span>\
        <vv-container class="widget-box"></vv-container>\
    </div>\
    <span hidden="" class="explanation"></span>\
</a>\
                ');
            });

            document.body.insertAdjacentHTML("beforeend", '\
<div class="vertical-list widget popup-menu-box dropdown-box menuBookmark" hidden data-widget="Widget">\
    <a class="box-link hideBookmark">\
        <div class="label-box">\
            <span class="icon">\
                <img src="https://imgur.com/D0YEKdu.png" style="\
                    height: 1em;\
                    padding-right: 1ex;\
                    filter: invert(100%);\
                ">\
            </span>\
            <span class="label">Hide bookmarked</span>\
            <vv-container class="widget-box"></vv-container>\
        </div>\
    </a>\
    <a class="box-link blackBookmark">\
        <div class="label-box">\
            <span class="icon">\
                <img src="https://imgur.com/0RDfK2Q.png" style="\
                    height: 1em;\
                    padding-right: 1ex;\
                    filter: invert(100%);\
                ">\
            </span>\
            <span class="label">Blacken bookmarked</span>\
            <vv-container class="widget-box"></vv-container>\
        </div>\
    </a>\
    <a class="box-link hideNotBookmark">\
        <div class="label-box">\
            <span class="icon">\
                <img src="https://imgur.com/IqBdofy.png" style="\
                    height: 1em;\
                    padding-right: 1ex;\
                    filter: invert(100%);\
                ">\
            </span>\
            <span class="label">Hide not bookmarked (Won\'t load more pages)</span>\
            <vv-container class="widget-box"></vv-container>\
        </div>\
    </a>\
    <a class="box-link blackNotBookmark">\
        <div class="label-box">\
            <span class="icon">\
                <img src="https://imgur.com/sXzsgZO.png" style="\
                    height: 1em;\
                    padding-right: 1ex;\
                    filter: invert(100%);\
                ">\
            </span>\
            <span class="label">Blacken not bookmarked</span>\
            <vv-container class="widget-box"></vv-container>\
        </div>\
    </a>\
    <a class="box-link showHidden">\
        <div class="label-box">\
            <span class="icon">\
                <img src="https://imgur.com/Ykf0PW9.png" style="\
                    height: 1em;\
                    padding-right: 1ex;\
                    filter: invert(100%);\
                ">\
            </span>\
            <span class="label">Show hidden back</span>\
            <vv-container class="widget-box"></vv-container>\
        </div>\
    </a>\
    <a class="box-link showBlackened">\
        <div class="label-box">\
            <span class="icon">\
                <img src="https://imgur.com/RN22Mc2.png" style="\
                    height: 1em;\
                    padding-right: 1ex;\
                    filter: invert(100%);\
                ">\
            </span>\
            <span class="label">Show Blackened back</span>\
            <vv-container class="widget-box"></vv-container>\
        </div>\
    </a>\
    <a class="box-link showAll">\
        <div class="label-box">\
            <span class="icon">\
                <img src="https://i.imgur.com/GfeWCLK.png" style="\
                    height: 1em;\
                    padding-right: 1ex;\
                    filter: invert(100%);\
                ">\
            </span>\
            <span class="label">Show everything back</span>\
            <vv-container class="widget-box"></vv-container>\
        </div>\
    </a>\
</div>\
            ');


            const btnBookmark = document.querySelectorAll('.btnBookmark');
            const menuBookmark = document.querySelectorAll('.menuBookmark');
            const hideBookmark = document.querySelectorAll('.hideBookmark');
            const blackBookmark = document.querySelectorAll('.blackBookmark');
            const hideNotBookmark = document.querySelectorAll('.hideNotBookmark');
            const blackNotBookmark = document.querySelectorAll('.blackNotBookmark');
            const showHidden = document.querySelectorAll('.showHidden');
            const showBlackened = document.querySelectorAll('.showBlackened');
            const showAll = document.querySelectorAll('.showAll');


            btnBookmark.forEach((btnBookmark_elem, btnBookmark_index) => {
                btnBookmark_elem.addEventListener("click", function() {
                    let left = btnBookmark_elem.offsetLeft;
                    let top = btnBookmark_elem.offsetTop + btnBookmark_elem.offsetHeight + 8;
                    menuBookmark[btnBookmark_index].style.left = left + "px";
                    menuBookmark[btnBookmark_index].style.top = top + "px";
                    menuBookmark[btnBookmark_index].hidden = !menuBookmark[btnBookmark_index].hidden;
                });

                hideBookmark[btnBookmark_index].addEventListener("click", function() {
                    let bookmarked = document.querySelectorAll(".heart.button-bookmark.public.bookmarked");
                    let hearted = Array.prototype.filter.call(bookmarked, function(item) {
                        if (!item.hidden) {
                            let thumbnail = item.parentNode.parentNode.parentNode;
                            thumbnail.hidden = true;
                            return thumbnail;
                        }
                    });
                    console.log("HBM - hidden :", hearted.length);
                    btnBookmark[btnBookmark_index].setAttribute('data-popup', "Show/Hide bookmarked " + hearted.length + " image(s) hidden");
                    menuBookmark[btnBookmark_index].hidden = !menuBookmark[btnBookmark_index].hidden;
                });
                blackBookmark[btnBookmark_index].addEventListener("click", function() {
                    let bookmarked = document.querySelectorAll(".heart.button-bookmark.public.bookmarked");
                    let hearted = Array.prototype.filter.call(bookmarked, function(item) {
                        if (!item.hidden) {
                            let thumbnail = item.parentNode.parentNode.parentNode;
                            thumbnail.style.visibility = "hidden";
                            return thumbnail;
                        }
                    });
                    console.log("HBM - blackened :", hearted.length);
                    btnBookmark[btnBookmark_index].setAttribute('data-popup', "Show/Hide bookmarked " + hearted.length + " image(s) blackened");
                    menuBookmark[btnBookmark_index].hidden = !menuBookmark[btnBookmark_index].hidden;
                });

                hideNotBookmark[btnBookmark_index].addEventListener("click", function() {
                    let notBookmarked = document.querySelectorAll(".heart.button-bookmark.public.bookmarked");
                    let notHearted = Array.prototype.filter.call(notBookmarked, function(item) {
                        if (item.hidden) {
                            let thumbnail = item.parentNode.parentNode.parentNode;
                            thumbnail.hidden = true;
                            return thumbnail;
                        }
                    });
                    console.log("HBM - hidden :", notHearted.length);
                    btnBookmark[btnBookmark_index].setAttribute('data-popup', "Show/Hide bookmarked " + notHearted.length + " image(s) hidden");
                    menuBookmark[btnBookmark_index].hidden = !menuBookmark[btnBookmark_index].hidden;
                });
                blackNotBookmark[btnBookmark_index].addEventListener("click", function() {
                    let notBookmarked = document.querySelectorAll(".heart.button-bookmark.public.bookmarked");
                    let notHearted = Array.prototype.filter.call(notBookmarked, function(item) {
                        if (item.hidden) {
                            let thumbnail = item.parentNode.parentNode.parentNode;
                            thumbnail.style.visibility = "hidden";
                            return thumbnail;
                        }
                    });
                    console.log("HBM - blackened :", notHearted.length);
                    btnBookmark[btnBookmark_index].setAttribute('data-popup', "Show/Hide bookmarked " + notHearted.length + " image(s) blackened");
                    menuBookmark[btnBookmark_index].hidden = !menuBookmark[btnBookmark_index].hidden;
                });

                showHidden[btnBookmark_index].addEventListener("click", function() {
                    let bookmarked = document.querySelectorAll(".heart.button-bookmark.public.bookmarked");
                    let everyThumbnail = Array.prototype.filter.call(bookmarked, function(item) {
                        let thumbnail = item.parentNode.parentNode.parentNode;
                        thumbnail.hidden = false;
                        return thumbnail;
                    });
                    btnBookmark[btnBookmark_index].setAttribute('data-popup', "Show/Hide bookmarked");
                    menuBookmark[btnBookmark_index].hidden = !menuBookmark[btnBookmark_index].hidden;
                });
                showBlackened[btnBookmark_index].addEventListener("click", function() {
                    let bookmarked = document.querySelectorAll(".heart.button-bookmark.public.bookmarked");
                    let everyThumbnail = Array.prototype.filter.call(bookmarked, function(item) {
                        let thumbnail = item.parentNode.parentNode.parentNode;
                        thumbnail.style.visibility = "";
                        return thumbnail;
                    });
                    btnBookmark[btnBookmark_index].setAttribute('data-popup', "Show/Hide bookmarked");
                    menuBookmark[btnBookmark_index].hidden = !menuBookmark[btnBookmark_index].hidden;
                });

                showAll[btnBookmark_index].addEventListener("click", function() {
                    let bookmarked = document.querySelectorAll(".heart.button-bookmark.public.bookmarked");
                    let everyThumbnail = Array.prototype.filter.call(bookmarked, function(item) {
                        let thumbnail = item.parentNode.parentNode.parentNode;
                        thumbnail.hidden = false;
                        thumbnail.style.visibility = "";
                        return thumbnail;
                    });
                    btnBookmark[btnBookmark_index].setAttribute('data-popup', "Show/Hide bookmarked");
                    menuBookmark[btnBookmark_index].hidden = !menuBookmark[btnBookmark_index].hidden;
                });
            });

        } catch (e) {
            //console.error(e);
        }
    }
}

//check button load every 100ms
nIntervId = setInterval(wait, 100);

let previousUrl = '';
const observer = new MutationObserver(function(mutations) {
  if (window.location.href !== previousUrl) {
      previousUrl = window.location.href;
      // console.log(`HBM - URL changed from ${previousUrl} to ${window.location.href}`);
      console.log("HBM - URL has changed");
      wait();
    }
});
const config = {subtree: true, childList: true};

// start listening to changes
observer.observe(document, config);

