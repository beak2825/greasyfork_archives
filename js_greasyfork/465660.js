// ==UserScript==
// @name         BlueskyTranslateDeepL
// @namespace    https://nigauri.me/
// @version      0.6
// @description  Blueskyの「Translate...」をDeepLで開くようにする
// @author       nigauri
// @match        https://staging.bsky.app/*
// @match        https://bsky.app/*
// @icon         https://bsky.app/static/apple-touch-icon.png
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465660/BlueskyTranslateDeepL.user.js
// @updateURL https://update.greasyfork.org/scripts/465660/BlueskyTranslateDeepL.meta.js
// ==/UserScript==

const parentBlockCSSFeed = "div.css-175oi2r.r-18u37iz.r-1cvj4g8:visible";
const parentBlockCSSSearch = "div.css-175oi2r.r-5kkj8d.r-1sp51qo.r-ry3cjt:visible";
const parentBlockCSSPostThreadMain = "div.css-175oi2r.r-5kkj8d.r-1ss6j8a.r-1qortcd.r-vmopo1:visible";
const parentBlockCSSPostThreadOther1 = "div.css-175oi2r.r-5kkj8d.r-1hfyk0a:visible";
const parentBlockCSSPostThreadOther2 = "div.css-175oi2r.r-1hfyk0a.r-13yce4e:visible";

const postUrlLinkCSS = "a.css-1rynq56.r-19gegkz.r-1loqt21:visible";

const postTextCSSFeed = "div.css-175oi2r.r-1awozwy.r-18u37iz.r-1w6e6rj.r-iphfwy > div:visible";
const postTextCSSSearch = "div.css-175oi2r.r-1awozwy.r-18u37iz.r-1w6e6rj.r-xd6kpl > div:visible";
const postTextCSSPostThreadMain = "div.css-175oi2r.r-1awozwy.r-18u37iz.r-1w6e6rj.r-2yi16.r-1qfoi16.r-1mi0q7o.r-mk0yit > div:visible";
const postTextCSSPostThreadOther = "div.css-175oi2r.r-1awozwy.r-18u37iz.r-1w6e6rj.r-2yi16.r-xd6kpl.r-1qfoi16:visible";

const postDropdownPopupBGCSS = "div.css-175oi2r.r-kemksi.r-1p0dtai.r-1d2f490.r-5m1il8.r-u8s1d.r-zchlnj.r-ipm5af:visible";
const deeplURL = "https://www.deepl.com/ja/translator#en/ja/";

(function() {
    'use strict';

    let clickedPost = null;
    let parentBlockCSS = null;
    let postTextCSS = null;

    let postDropdownBtnObserver = new MutationObserver(function (MutationRecords, MutationObserver) {
        $("div[data-testid='postDropdownBtn']").each(function(i, elem) {
            let events = $._data($(elem).get(0), "events");
            if (events != null) {
                return true;
            }
            $(elem).on("click", function(){
                clickedPost = null;
                parentBlockCSS = null;
                postTextCSS = null;
                let isRP = false;
                if (0 < $(elem).closest(parentBlockCSSFeed).length) {
                    parentBlockCSS = parentBlockCSSFeed;
                    postTextCSS = postTextCSSFeed;
                } else if (0 < $(elem).closest(parentBlockCSSSearch).length) {
                    parentBlockCSS = parentBlockCSSSearch;
                    postTextCSS = postTextCSSSearch;
                } else if (0 < $(elem).closest(parentBlockCSSPostThreadMain).length) {
                    parentBlockCSS = parentBlockCSSPostThreadMain;
                    postTextCSS = postTextCSSPostThreadMain;
                    isRP = true;
                } else if (0 < $(elem).closest(parentBlockCSSPostThreadOther1).length) {
                    parentBlockCSS = parentBlockCSSPostThreadOther1;
                    postTextCSS = postTextCSSPostThreadOther;
                } else if (0 < $(elem).closest(parentBlockCSSPostThreadOther2).length) {
                    parentBlockCSS = parentBlockCSSPostThreadOther2;
                    postTextCSS = postTextCSSPostThreadOther;
                }
                let parentBlock = $(elem).closest(parentBlockCSS);
                let href = parentBlock.find(postUrlLinkCSS).attr("href");
                clickedPost = href;
                if (isRP && clickedPost != null) {
                    clickedPost = null;
                }
            });
        });
    });
    postDropdownBtnObserver.observe($("#root").get(0), {
        childList: true,
        subtree: true,
    });

    let postDropdownTranslateBtnObserver = new MutationObserver(function (MutationRecords, MutationObserver) {
        $("div[data-testid='postDropdownTranslateBtn']").each(function(i, elem) {
            $(elem).off("click");
            $(elem).on("click", function(){
                let parentBlock = null;
                if (clickedPost == null) {
                    parentBlock = $(parentBlockCSS);
                } else {
                    parentBlock = $(`a[href='${clickedPost}']:visible`).closest(parentBlockCSS);
                }
                let text = parentBlock.find(postTextCSS).text();
                window.open(deeplURL + encodeURI(text).replaceAll("/", "%5C%2F"));
                $(postDropdownPopupBGCSS).click();
                return false;
            });
        });
    });
    postDropdownTranslateBtnObserver.observe($("#root").get(0), {
        childList: true,
        subtree: true,
    });
})();