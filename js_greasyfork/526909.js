// ==UserScript==
// @name         Kemonoリンクボタン追加
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  kemonoリンクボタンを追加！
// @author       あるぱか
// @match        https://*.fanbox.cc/*
// @match        https://*.fanbox.cc
// @match        https://fantia.jp/fanclubs/*
// @match        https://www.patreon.com/*
// @match        https://www.pixiv.net/*
// @icon         https://kemono.su/assets/favicon-CPB6l7kH.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526909/Kemono%E3%83%AA%E3%83%B3%E3%82%AF%E3%83%9C%E3%82%BF%E3%83%B3%E8%BF%BD%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/526909/Kemono%E3%83%AA%E3%83%B3%E3%82%AF%E3%83%9C%E3%82%BF%E3%83%B3%E8%BF%BD%E5%8A%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // URLの識別
    const destURL = regexUrl(window.location.hostname,/(?:[a-z-]+\.)?([a-z-]+\.[a-z-]+)/),
          regexPixiv = /^https:\/\/[is]\.pximg\.net\/(?:user-profile\/img\/.+|common\/images\/no_profile\.png)/;

    if (destURL === "fanbox.cc") {
        ovsStart("#root","fanbox",true,true,false);
    } else if (destURL === "fantia.jp") {
        fantiaAddKemono();
    } else if (destURL === "patreon.com") {
        patreonAddKemono();
    } else if (destURL === "pixiv.net"){
            ovsStart("body","pixiv",true,true,false);
    } else {
        console.log("どれにも該当しませんでした。");
    };


    function mbPc() {
        'use strict';

        const userAgent = navigator.userAgent.toLowerCase();
        const isMobile = /mobile|android|iphone|ipad|tablet/i.test(userAgent);

        if (isMobile) {
            return true
            // モバイル表示用の処理
        } else {
            return false
            // PC表示用の処理
        }
    };


    // Regexの関数
    function regexUrl (urlNow,urlRegex) {
        const urlMatch = urlNow.match(urlRegex);
        return urlMatch[1]
    };




    // 監視スタート
    function ovsStart (targetNode,destEle,childListCon,subtreeCon,attributesCon) {
        const observer = new MutationObserver((mutations) => {



            mutations.forEach((mutation) => {
                if (destEle === "fanbox") {
                    if (mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach((node) => {
                            // ノードが要素（Element）である場合のみ処理
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.className && node.className.startsWith('styled__Wrapper')) {
                                    const hasSnsIcons = node.querySelector('[class^="styled__UserSnsIcons"]');
                                    if (hasSnsIcons) {
                                        fanboxAddKemono (); // ボタン追加
                                    }
                                }
                            }
                        });
                    }
                } else if (destEle === "pixiv") {


                    if (mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach((node) => {
                            // ノードが要素（Element）である場合のみ処理
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                 // console.log(node);
                                if (node.tagName.toLowerCase() === 'img') {

                                    if (regexPixiv.test(node.src)){
                                        pixivAddKemono(false);
                                    }
                                } else if (node.querySelector("div > #landing-scroll-position")) {
                                    pixivAddKemono(true);
                                }

                            }

                        });
                    }


                }
            });

        });

        const config = {childList: childListCon,subtree: subtreeCon,attributes: attributesCon};
        observer.observe(document.querySelector(targetNode), config); // 監視を開始

    };





    function pixivAddKemono (seLs) {
        const pixivPcElm = document.querySelector('[class^="ExternalLinks_externalLinksContainer__"]'),
              pixivTabElm = document.querySelector('[class="social-links"]'),
              proEl = Array.from(document.querySelectorAll('div')).find(div => div.textContent.trim() === 'プロフィールを見る').parentElement.parentElement,
              pixivUrl = regexUrl(window.location.pathname,/\/users\/([\d]+)(?:\/?.*)/),
              mbPcCo = mbPc();

        if (pixivUrl) {
            const addPixivLink = (element,tboNe) => {
                if (!element) return;
                const link = document.createElement('a'),
                      img = document.createElement('img');
                img.src = 'https://kemono.su/assets/favicon-CPB6l7kH.ico';
                img.style.width = '26px';
                img.style.height = '26px';
                img.style.verticalAlign = 'baseline';

                link.style.width = '32px';
                link.style.height = '32px';
                link.style.margin = '0 4px'
                link.href = 'https://kemono.su/fanbox/user/' + pixivUrl;
                link.target = '_blank';
                link.rel = 'noopener referrer';
                link.appendChild(img);
                if (!mbPcCo) {
                    element.appendChild(link);
                } else if (mbPcCo) {
                    element.prepend(link);
                }
            };

            if (!seLs){
                if (!mbPcCo){
                    addPixivLink(pixivPcElm);
                } else if (mbPcCo) {
                    addPixivLink(proEl);
                }
            }

            addPixivLink(pixivTabElm);

        } else {
            console.log('マッチするユーザーIDが見つかりませんでした。');
        };

    };





    function fanboxAddKemono () {
        const fanboxUrl = regexUrl(window.location.href,/https:\/\/(?:www\.fanbox\.cc\/@)?([\w\d-]+)/);

        if (fanboxUrl) {
            const userId = fanboxUrl;
            const addFanboxLink = (element) => {
                if (!element) return;
                const link = document.createElement('a'),
                      img = document.createElement('img');
                img.src = 'https://kemono.su/assets/favicon-CPB6l7kH.ico';
                img.style.marginLeft = '4px';
                img.style.width = '26px';
                img.style.height = '26px';

                link.href = 'https://kemono.su/fanbox/user/' + userId;
                link.target = '_blank';
                link.rel = 'noopener referrer';
                link.appendChild(img);
                element.appendChild(link);
            };

            const elements = document.querySelectorAll('[class^="styled__UserSnsIcons"]');
            addFanboxLink(elements[0]);
            addFanboxLink(elements[1]);


        } else {
            console.log('マッチするユーザーIDが見つかりませんでした。');
        };
    };





    function fantiaAddKemono () {
        const anchor = document.querySelector("a.btn.btn-sm.btn-facebook"),
              span = anchor.querySelector("span"),
              icon = anchor.querySelector("i"),
              img = document.createElement("img"),
              fanboxUrl = regexUrl(window.location.pathname,/\/fanclubs\/(\d+)(?:\/.*)+/);


        if (anchor) {
            anchor.className = "btn btn-sm";
            anchor.href = "https://kemono.su/fantia/user/" + fanboxUrl;
            anchor.target = "_blank";
            anchor.style.backgroundColor = "#f80";

            span.textContent = "Kemono";
            span.style.color = "#fff";

            img.src = "https://kemono.su/assets/favicon-CPB6l7kH.ico";
            img.style.height = "12px";
            img.style.width = "12px";
            img.style.margin = "0 4px 0 0";
            icon.replaceWith(img);
        };
    };





    function patreonAddKemono () {
        const button = document.querySelector('button[data-tag="creator-become-a-patron-button"]');
        if (button) {
            const parentDiv = button.parentElement.parentElement;
            if (parentDiv) {

                const divEl = document.createElement('a'),
                      anchor = document.createElement('button'),
                      divText = document.createElement('div'),
                      fanboxUrl = regexUrl(window.location.pathname,/\/([^/]+)/);

                anchor.type = "button";
                anchor.textContent = 'Kemono';
                anchor.style.width = '100%';
                anchor.style.height = "40px";
                anchor.style.border = "1px solid transparent";
                anchor.style.borderRadius = "8px";
                anchor.style.backgroundColor = "#f80";
                anchor.style.color = "#fff"

                divEl.href ='https://kemono.su/patreon/user/' + fanboxUrl;

                divEl.appendChild(anchor);
                parentDiv.appendChild(divEl);

            };
        };
    };



})();