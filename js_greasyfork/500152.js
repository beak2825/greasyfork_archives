// ==UserScript==
// @name         編集ページを直接開く
// @namespace    https://greasyfork.org/ja/users/1330985-vrav
// @version      1.0
// @description  Ctrl+Shift+クリックで編集画面を直接開く
// @author       vrav
// @license      public domain
// @match        http://sougouwiki.com/*
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/500152/%E7%B7%A8%E9%9B%86%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E7%9B%B4%E6%8E%A5%E9%96%8B%E3%81%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/500152/%E7%B7%A8%E9%9B%86%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E7%9B%B4%E6%8E%A5%E9%96%8B%E3%81%8F.meta.js
// ==/UserScript==

//  　　　　　　　　　　　　　<<　使い方　>>
//
//　Ctrl+Shiftを押しながらクリックしたリンクのメイン編集画面を開きます。
//
//　イメージ作品は　Iキー+クリック
//　配信作品は　Hキー+クリック
//  VR作品は　Vキー+クリック
//
//  連続でタブを開くことを想定しているので開いたタブにフォーカスは移りません。
//  開いたタブにフォーカスを当てたい場合は、active: false→active: trueに変更して下さい。
//
//  Ctrl+Shift+Alt+クリックでページ遷移を無効化し編集画面を開きます。
//  遷移前ページを編集したい場合に使用します。
//  [[A>B]]となっている場合は効果がありません(リダイレクト：と記載されているページに対応します)
//
//  当スクリプトの使用に関しては全て自己責任でお願いします。

(function () {
    'use strict';
    // リンクを探すセレクター
    const linkSelector = 'a[href^="https://seesaawiki.jp/w/sougouwiki/e/edit?id="]';
    // Ctrl+Shift+クリックされたときに実行されるコード
    window.addEventListener('click', function (event) {
        // altキーが押されている場合は動作しない
        if (event.ctrlKey && event.shiftKey && !event.altKey && event.button === 0 && event.target.tagName === 'A' && event.target.href.startsWith('http://sougouwiki.com/d/')) {
            event.preventDefault();
            const url = event.target.href;
            // HTMLコンテンツを取得する
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function (response) {
                    // 取得したHTMLコンテンツからリンクを探す
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const userAreaElement = doc.querySelector('.user-area');
                    // 誘導ページの場合
                    if (userAreaElement && userAreaElement.textContent.includes('リダイレクト：')) {
                        const linkElementA = doc.querySelector('a[href^="http://sougouwiki.com/d/"]');
                        if (linkElementA) {
                            // HTMLコンテンツを取得する
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: linkElementA.href,
                                onload: function (response) {
                                    const parser = new DOMParser();
                                    const doc = parser.parseFromString(response.responseText, 'text/html');
                                    const linkElementC = doc.querySelector(linkSelector);
                                    // リンクが見つかった場合、そのリンクを新しいタブで開く
                                    if (linkElementC) {
                                        GM_openInTab(linkElementC.href, {
                                            active: false
                                        });
                                    }
                                }
                            });
                        }
                    } else {
                        // 通常ページの場合
                        const linkElementB = doc.querySelector(linkSelector);
                        if (linkElementB) {
                            GM_openInTab(linkElementB.href, {
                                active: false
                            });
                        }
                    }
                }
            });
        }
    });
    // Hキー+クリックされたときに実行されるコード
    let hKeyPressed = false;
    document.addEventListener('keydown', function(event) {
        if (event.key === 'h' || event.key === 'H') {
            hKeyPressed = true;
        }
    });
    document.addEventListener('keyup', function(event) {
        if (event.key === 'h' || event.key === 'H') {
            hKeyPressed = false;
        }
    });
    window.addEventListener('click', function (event) {
        if (hKeyPressed && event.target.tagName === 'A' && event.target.href.startsWith('http://sougouwiki.com/d/')) {
            event.preventDefault();
            const url = event.target.href;
            // HTMLコンテンツを取得する
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function (response) {
                    // 取得したHTMLコンテンツからリンクを探す
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const userAreaElement = doc.querySelector('.user-area');
                    // 誘導ページの場合
                    if (userAreaElement && userAreaElement.textContent.includes('リダイレクト：')) {
                        const linkElementA = doc.querySelector('a[href^="http://sougouwiki.com/d/"]');
                        if (linkElementA) {
                            // HTMLコンテンツを取得する
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: linkElementA.href,
                                onload: function (response) {
                                    const parser = new DOMParser();
                                    const doc = parser.parseFromString(response.responseText, 'text/html');
                                    const linkElementC = doc.querySelector(linkSelector);
                                    if (linkElementC) {
                                        const id = linkElementC.href.split('=')[1];
                                        const tags = doc.querySelectorAll('h4[id^="content_"]');
                                        let tag;
                                        for (let i = 0; i < tags.length; i++) {
                                            if (tags[i].textContent.includes("配信作品") || tags[i].textContent.includes("アダルトサイト")) {
                                                tag = tags[i].id;
                                                break;
                                            }
                                        }
                                        // リンクが見つかった場合、そのリンクを新しいタブで開く
                                        if (tag) {
                                            GM_openInTab(linkElementC.href + '&part=' + tag, '_blank', {
                                                active: false
                                            });
                                        } else {
                                            // 見つからない場合はメインを開く
                                            GM_openInTab(linkElementC.href, {
                                                active: false
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    } else {
                        // 通常ページの場合
                        const linkElementB = doc.querySelector(linkSelector);
                        if (linkElementB) {
                            const id = linkElementB.href.split('=')[1];
                            const tags = doc.querySelectorAll('h4[id^="content_"]');
                            let tag;
                            for (let i = 0; i < tags.length; i++) {
                                if (tags[i].textContent.includes("配信作品") || tags[i].textContent.includes("アダルトサイト")) {
                                    tag = tags[i].id;
                                    break;
                                }
                            }
                            // リンクが見つかった場合、そのリンクを新しいタブで開く
                            if (tag) {
                                GM_openInTab(linkElementB.href + '&part=' + tag, '_blank', {
                                    active: false
                                });
                            } else {
                                // 見つからない場合はメインを開く
                                GM_openInTab(linkElementB.href, {
                                    active: false
                                });
                            }
                        }
                    }
                }
            });
        }
    });
    // Iキー+クリックされたときに実行されるコード
    let iKeyPressed = false;
    document.addEventListener('keydown', function(event) {
        if (event.key === 'i' || event.key === 'I') {
            iKeyPressed = true;
        }
    });
    document.addEventListener('keyup', function(event) {
        if (event.key === 'i' || event.key === 'I') {
            iKeyPressed = false;
        }
    });
    window.addEventListener('click', function (event) {
        if (iKeyPressed && event.target.tagName === 'A' && event.target.href.startsWith('http://sougouwiki.com/d/')) {
            event.preventDefault();
            const url = event.target.href;
            // HTMLコンテンツを取得する
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function (response) {
                    // 取得したHTMLコンテンツからリンクを探す
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const userAreaElement = doc.querySelector('.user-area');
                    // 誘導ページの場合
                    if (userAreaElement && userAreaElement.textContent.includes('リダイレクト：')) {
                        const linkElementA = doc.querySelector('a[href^="http://sougouwiki.com/d/"]');
                        if (linkElementA) {
                            // HTMLコンテンツを取得する
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: linkElementA.href,
                                onload: function (response) {
                                    const parser = new DOMParser();
                                    const doc = parser.parseFromString(response.responseText, 'text/html');
                                    const linkElementC = doc.querySelector(linkSelector);
                                    if (linkElementC) {
                                        const id = linkElementC.href.split('=')[1];
                                        const tags = doc.querySelectorAll('h4[id^="content_"]');
                                        let tag;
                                        for (let i = 0; i < tags.length; i++) {
                                            if (tags[i].textContent.includes("イメージ作品")) {
                                                tag = tags[i].id;
                                                break;
                                            }
                                        }
                                        // リンクが見つかった場合、そのリンクを新しいタブで開く
                                        if (tag) {
                                            GM_openInTab(linkElementC.href + '&part=' + tag, '_blank', {
                                                active: false
                                            });
                                        } else {
                                            // 見つからない場合はメインを開く
                                            GM_openInTab(linkElementC.href, {
                                                active: false
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    } else {
                        // 通常ページの場合
                        const linkElementB = doc.querySelector(linkSelector);
                        if (linkElementB) {
                            const id = linkElementB.href.split('=')[1];
                            const tags = doc.querySelectorAll('h4[id^="content_"]');
                            let tag;
                            for (let i = 0; i < tags.length; i++) {
                                if (tags[i].textContent.includes("イメージ作品")) {
                                    tag = tags[i].id;
                                    break;
                                }
                            }
                            // リンクが見つかった場合、そのリンクを新しいタブで開く
                            if (tag) {
                                GM_openInTab(linkElementB.href + '&part=' + tag, '_blank', {
                                    active: false
                                });
                            } else {
                                // 見つからない場合はメインを開く
                                GM_openInTab(linkElementB.href, {
                                    active: false
                                });
                            }
                        }
                    }
                }
            });
        }
    });
    // Vキー+クリックされたときに実行されるコード
    let vKeyPressed = false;
    document.addEventListener('keydown', function(event) {
        if (event.key === 'v' || event.key === 'V') {
            vKeyPressed = true;
        }
    });
    document.addEventListener('keyup', function(event) {
        if (event.key === 'v' || event.key === 'V') {
            vKeyPressed = false;
        }
    });
    window.addEventListener('click', function (event) {
        if (vKeyPressed && event.target.tagName === 'A' && event.target.href.startsWith('http://sougouwiki.com/d/')) {
            event.preventDefault();
            const url = event.target.href;
            // HTMLコンテンツを取得する
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function (response) {
                    // 取得したHTMLコンテンツからリンクを探す
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const userAreaElement = doc.querySelector('.user-area');
                    // 誘導ページの場合
                    if (userAreaElement && userAreaElement.textContent.includes('リダイレクト：')) {
                        const linkElementA = doc.querySelector('a[href^="http://sougouwiki.com/d/"]');
                        if (linkElementA) {
                            // HTMLコンテンツを取得する
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: linkElementA.href,
                                onload: function (response) {
                                    const parser = new DOMParser();
                                    const doc = parser.parseFromString(response.responseText, 'text/html');
                                    const linkElementC = doc.querySelector(linkSelector);
                                    if (linkElementC) {
                                        const id = linkElementC.href.split('=')[1];
                                        const tags = doc.querySelectorAll('h4[id^="content_"]');
                                        let tag;
                                        for (let i = 0; i < tags.length; i++) {
                                            if (tags[i].textContent.includes("VR作品")) {
                                                tag = tags[i].id;
                                                break;
                                            }
                                        }
                                        // リンクが見つかった場合、そのリンクを新しいタブで開く
                                        if (tag) {
                                            GM_openInTab(linkElementC.href + '&part=' + tag, '_blank', {
                                                active: false
                                            });
                                        } else {
                                            // 見つからない場合はメインを開く
                                            GM_openInTab(linkElementC.href, {
                                                active: false
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    } else {
                        // 通常ページの場合
                        const linkElementB = doc.querySelector(linkSelector);
                        if (linkElementB) {
                            const id = linkElementB.href.split('=')[1];
                            const tags = doc.querySelectorAll('h4[id^="content_"]');
                            let tag;
                            for (let i = 0; i < tags.length; i++) {
                                if (tags[i].textContent.includes("VR作品")) {
                                    tag = tags[i].id;
                                    break;
                                }
                            }
                            // リンクが見つかった場合、そのリンクを新しいタブで開く
                            if (tag) {
                                GM_openInTab(linkElementB.href + '&part=' + tag, '_blank', {
                                    active: false
                                });
                            } else {
                                // 見つからない場合はメインを開く
                                GM_openInTab(linkElementB.href, {
                                    active: false
                                });
                            }
                        }
                    }
                }
            });
        }
    });
    // Ctrl+Shift+Alt+クリックされたときに実行されるコード
    window.addEventListener('click', function (event) {
        if (event.ctrlKey && event.shiftKey && event.altKey && event.button === 0 && event.target.tagName === 'A' && event.target.href.startsWith('http://sougouwiki.com/d/')) {
            event.preventDefault();
            const url = event.target.href;
            // HTMLコンテンツを取得する
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function (response) {
                    // 取得したHTMLコンテンツからリンクを探す
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const linkElement = doc.querySelector(linkSelector);
                    // リンクが見つかった場合、そのリンクを新しいタブで開く
                    if (linkElement) {
                        window.open(linkElement.href, '_blank');
                    }
                }
            });
        }
    });
})();