// ==UserScript==
// @name                oneClickDeleteInstagramPost
// @name:en             oneClickDeleteInstagramPost
// @name:ja             oneClickDeleteInstagramPost ワンクリックで削除 Post
// @name:zh-CN          oneClickDeleteInstagramPost 一键删除 Instagram 帖子
// @name:zh-TW          oneClickDeleteInstagramPost 一鍵刪除 Instagram 帖子
// @namespace           https://github.com/catscarlet/oneClickDeleteInstagramPost
// @description         Add [Delete] button on the post in Personal Page on Instagram. Directly delete post without confirm.
// @description:en      Add a [Delete] button to the Personal Page on Instagram. Directly delete post without confirm.
// @description:ja      Instagramの個人ページの投稿に[削除]ボタンを追加してください。 確認なしで投稿を直接削除します。
// @description:zh-CN   在 Instagram 的个人页面的图片上添加 [Delete] 按钮，点击直接删除图片，不再有确认提示框
// @description:zh-TW   在 Instagram 的個人頁面的圖片上添加 [Delete] 按鈕，點擊直接刪除图片，不再有確認提示框
// @version             1.1.1
// @author              catscarlet
// @license             MIT License
// @match               *://www.instagram.com/*
// @require             https://cdn.jsdelivr.net/npm/bignumber.js@2.4.0/bignumber.min.js
// @run-at              document-end
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/373339/oneClickDeleteInstagramPost.user.js
// @updateURL https://update.greasyfork.org/scripts/373339/oneClickDeleteInstagramPost.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let safe_lock = 1; //Set this to 0 to unlock the 'Delete this' button.
    let show_alt = 0; //Hide alt by default. Set this to 1 to show alt of images.

    const InstagramConvert = {
        charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
        decode: url => {
            let result = BigInt(0);
            let power = BigInt(1);

            for (let i = url.length - 1; i >= 0; i--) {
                const char = url[i];
                const index = InstagramConvert.charset.indexOf(char);
                result += BigInt(index) * power;
                power *= BigInt(64);
            }
            return result.toString();
        },
    };

    let old_path = '';
    let new_path = '';
    let temp_lock = 0;

    historyPushStateMonitor(window.history);
    historyOnpushstate();

    history.onpushstate = function(e) {
        goPendingUrl();
    };

    window.onpopstate = function(event) {
        goPendingUrl();
    };

    function historyPushStateMonitor(history) {
        let pushState = history.pushState;
        history.pushState = function(state) {
            old_path = location.pathname.toString();

            if (typeof history.onpushstate == 'function') {
                history.onpushstate({state: state});
            }

            return pushState.apply(history, arguments);
        };
    }

    function goPendingUrl() {
        new_path = location.pathname.toString();

        if (old_path == new_path) {
            setTimeout(goPendingUrl, 1000);
        } else {
            historyOnpushstate();
        }
    }

    function historyOnpushstate() {
        pending();
    }

    function pending() {
        let article = document.querySelectorAll('.xg7h5cd.x1n2onr6');
        if (!article.length) {
            setTimeout(pending, 500);
        } else {
            ob();
            getPost();
        }
    }

    function ob() {
        let articles = document.querySelector('.xg7h5cd.x1n2onr6').children[0].children[0];

        let observerOptions = {
            childList: true,
            attributes: false,
            subtree: true,
        };

        let observer = new MutationObserver(getPost);

        observer.observe(articles, observerOptions);
    }

    function getPost() {
        let articles = document.querySelector('.xg7h5cd.x1n2onr6').children[0].children[0];
        let own_it = pageOwnerCheck();

        for (let articlesline of articles.children) {
            for (let post of articlesline.children) {
                let link = post.children[0];
                if (!link) {
                    return false;
                }
                if (link.hasAttribute('alte')) {
                    continue;
                }

                let url = link.href;
                let urlSegment = GetUrlSegmentByUrl(url);
                if (!urlSegment) {
                    continue;
                }
                let block = link.children[0];
                let img = block.children[0].children[0];
                let alt = img.alt;

                let btn_div = document.createElement('div');
                btn_div.style.height  = '2rem';
                let media_id = getMediaIdByUrlSegment(urlSegment);

                let btn = document.createElement('button');
                btn.innerHTML = 'delete this: ' + media_id;
                btn.style.backgroundColor  = 'darksalmon';
                btn.onclick = function() {
                    deleteByMediaId(media_id, btn, post);
                };

                post.classList.add('oneClickDeleteInstagramPost_post');

                btn_div.className = 'btn_div';

                if (own_it) {
                    if (safe_lock) {
                        btn.disabled = true;
                        btn.title = 'Safe_lock is ON! You need to edit the script and change the "safe_lock" to 0 in order to delete your post without confirm.';
                    }
                    btn_div.appendChild(btn);
                    post.appendChild(btn_div);
                }

                let alt_div = document.createElement('div');
                alt_div.className = 'alt_div';
                alt_div.style.height  = '1rem';
                let alt_div_style = 'word-break: break-word;';
                if (!show_alt) {
                    alt_div_style += 'display: none;';
                }
                alt_div.innerHTML = '<span style="' + alt_div_style + '">' + alt + '</span>';
                post.appendChild(alt_div);

                let post_style = 'height: calc(' + post.offsetHeight + 'px - 3rem); margin-bottom: 3rem;';
                post.style = post_style;

                link.setAttribute('alte', 1);
            }
        }
    };

    function GetUrlSegmentByUrl(url) {
        let regexp = /https:\/\/www.instagram.com\/(\S+)\/p\/(\?taken-by=\S+)?/;
        let result = url.match(regexp);
        if (result) {
            return result[1];
        } else {
            return false;
        }
    }

    function getMediaIdByUrlSegment(urlSegment) {
        let id = InstagramConvert.decode(urlSegment);

        return id;
    }

    function deleteByMediaId(media_id, btn, post) {
        btn.innerHTML = 'deleting';
        btn.style.backgroundColor  = 'yellow';
        btn.onclick = false;
        btn.disabled = true;

        let url = 'https://www.instagram.com/api/v1/web/create/' + media_id + '/delete/';

        let xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', url, true);
        xmlhttp.setRequestHeader('X-CSRFToken', window._sharedData.config.csrf_token);
        xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlhttp.send(null);

        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    let rst = JSON.parse(xmlhttp.response);
                    if (rst.did_delete) {
                        post.style.visibility = 'hidden';
                    } else {
                        btn.innerHTML = 'Failed';
                    }
                } else {
                    btn.innerHTML = 'Failed';
                }
            }
        };
    }

    function pageOwnerCheck() {
        let not_own_it = 0;
        let match_regex = /https:\/\/www.instagram.com\/([^\/]+)\/$/;
        let href = location.href;

        let array1 = match_regex.exec(href);
        if (array1 !== null) {
            if (array1[1] == 'explore') {
                not_own_it++;
            }
        }

        if (document.getElementsByClassName('fx7hk').length && document.getElementsByClassName('fx7hk')[0].childElementCount == 2) {
            not_own_it += 2;
        }

        return !not_own_it;
    };
})();
