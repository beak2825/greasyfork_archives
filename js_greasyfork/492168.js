// ==UserScript==
// @name         twivideo ad block
// @namespace    https://greasyfork.org/users/1286495
// @version      0.3
// @description  広告を回避と、1番下にスクロールした時に、動画を継ぎ足します。(もっと見るボタンと同じ役割)
// @author       You
// @match        https://twivideo.net/*
// @match        https://monsnode.com/*
// @icon         https://twivideo.net/templates/images/icon1.ico
// @grant        none
// @license MIT
// @icon        https://www.google.com/s2/favicons?domain=twivideo.net

// @downloadURL https://update.greasyfork.org/scripts/492168/twivideo%20ad%20block.user.js
// @updateURL https://update.greasyfork.org/scripts/492168/twivideo%20ad%20block.meta.js
// ==/UserScript==

(function() {


    function twivideo() {
        // Cookieを設定する関数
        function setCookie(name, value, days) {
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        }

        // Cookieを設定（ページ読み込み時）
        window.addEventListener('load', function() {
            setCookie('vRewardStatus', 'isUnlimited', 365);
        });

        // 新しい動画を取得する関数
        function getnewvideo() {
            var offset = document.querySelectorAll('.grids .art_li').length;
            var limit = 50; // 動画数は必要に応じて調整
            if (typeof view_lists === 'function') {
                view_lists(offset, limit);
            } else {
                console.warn("view_lists 関数が見つかりませんでした。");
            }
        }

        // スクロールの処理
        var scrolledToBottom = false;

        function scrollFunction() {
            var documentHeight = document.body.scrollHeight;
            var windowHeight = window.innerHeight;
            var scrollHeight = window.pageYOffset;

            if (documentHeight - windowHeight <= scrollHeight + 50) { // 少し余裕を持たせる
                if (!scrolledToBottom) {
                    console.log("ページの一番下にスクロールされました！");
                    getnewvideo();
                    scrolledToBottom = true;
                    setTimeout(() => {
                        scrolledToBottom = false;
                    }, 30000);
                }
            } else {
                scrolledToBottom = false;
            }
        }

        window.addEventListener("scroll", scrollFunction);
    }

    function monsnode() {
        // localStorageのキー名
        const STORAGE_KEY = "redirectList";

        // redirectリストをlocalStorageから取得（なければ空配列）
        function getRedirectList() {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) return [];
            try {
                return JSON.parse(data);
            } catch(e) {
                console.error("redirectListのJSONパースに失敗しました:", e);
                return [];
            }
        }

        function saveRedirectList(list) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        }

        function addRedirect(from, to) {
            if (typeof from !== "string" || typeof to !== "string") {
                console.error("addRedirect: 引数は両方とも文字列である必要があります");
                return;
            }
            const list = getRedirectList();

            // fromが既にあれば上書き、なければ追加
            const index = list.findIndex(item => item.from === from);
            if (index >= 0) {
                list[index].to = to;
            } else {
                list.push({from, to});
            }

            saveRedirectList(list);
            console.log(`redirectListに追加・更新しました: from=${from}, to=${to}`);
        }

        function findRedirect(url) {
          const list = getRedirectList();
          const item = list.find(entry => entry.from === url);
          return item ? item.to : null;  // 見つかればtoを返し、なければnull（None相当）を返す
        }


        document.querySelectorAll('img').forEach(img => {
          img.addEventListener('click', function(event) {
            let target = event.target;
            // 親要素を辿ってaタグを探す
            while (target && target !== document) {
              if (target.tagName === 'A') {
                console.log('クリックされたリンクURL:', target.href);

                const url = new URL(target.href);
                const v = url.searchParams.get("v");
                console.log(v);
                const redirectUrl = findRedirect(v);

                if (redirectUrl) {
                  event.preventDefault(); // ← ここでデフォルト動作キャンセル
                  window.location.href = redirectUrl;
                  return;
                }
                break;  // aタグは見つかったけどリダイレクト先がなければループを抜ける
              }
              target = target.parentNode;
            }
            console.log('クリックされた画像にリンクはありません');
          });
        });



        const cleanUrl = window.location.origin + window.location.pathname;

        if (cleanUrl === 'https://monsnode.com/twjn.php') {
          const videoLink = document.querySelector('a[href*="video.twimg.com"]');
          if (videoLink && videoLink.href) {
            //リストに追加
            const v = new URLSearchParams(window.location.search).get("v");
            addRedirect(v, videoLink.href);

            location.href = videoLink.href;
          }
        }

    }

    function main() {

        // ドメイン確認：twivideo.net のときのみ実行
        if (location.hostname === "twivideo.net") {
            twivideo();
        }

        if (location.hostname === 'monsnode.com') {
          monsnode();
        }

    }

    main();


})();