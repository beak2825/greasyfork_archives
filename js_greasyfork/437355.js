// ==UserScript==
// @name         IMASBBS ID Blocker
// @namespace    https://github.com/sakuro/
// @version      1.0.7
// @description  IMASBBSのIDブロック機能を改良します。
// @author       sakuro
// @match        http://imasbbs.com/patio.cgi*
// @match        https://imasbbs.com/patio.cgi*
// @match        http://umabbs.com/patio.cgi*
// @match        https://umabbs.com/patio.cgi*
// @icon         https://www.google.com/s2/favicons?domain=imasbbs.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437356/IMASBBS%20ID%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/437356/IMASBBS%20ID%20Blocker.meta.js
// ==/UserScript==

// jshint esversion: 6
(function () {
    'use strict';

    // スレ番不明 (=トップページなど) の場合は動作させない。
    const thread = new URLSearchParams(location.search).get('read');
    if (!thread) {
        return;
    }

    class Blocker {
        constructor(posts) {
            this.load();
            this.posts = posts;
            this.posts.forEach((post) => {
                if (this.isBlocked(post.id)) {
                    post.hideComment()
                } else {
                    post.showComment();
                }
                post.button.addEventListener('click', () => this.isBlocked(post.id) ? this.unblock(post.id) : this.block(post.id));
            });
        }

        isBlocked(id) {
            return this.blocks.has(id);
        }

        update(change) {
            this.load();
            change(this.blocks);
            this.save();
        }

        block(id) {
            if (this.isBlocked(id)) {
                return;
            }
            this.update((blocks) => blocks.set(id, new Date()));
            this.posts.filter((post) => post.id === id).forEach((post) => post.hideComment());
        }

        unblock(id) {
            this.update((blocks) => blocks.delete(id));
            this.posts.filter((post) => post.id === id).forEach((post) => post.showComment());
        }

        save() {
            if (this.blocks.size === 0) {
                localStorage.removeItem('blocks');
            } else {
                const data = JSON.stringify([...this.blocks]);
                localStorage.setItem('blocks', data);
            }
        }

        load() {
            const data = localStorage.getItem('blocks');
            this.blocks = data ? new Map(JSON.parse(data).map((e) => [e[0], new Date(e[1])])) : new Map();
        }

        clear() {
            this.blocks = new Map();
            this.save();
            this.posts.forEach((post) => post.showComment());
        }
    }

    class Post {
        constructor(dom) {
            const idSpan = dom.querySelector('span');
            this.id = idSpan.textContent.replace('ID:', '');
            // com-res: 通常コメ、 com-top: 1つめのコメ、 com-ng: NGコメ
            this.comment = dom.querySelector('div.com-res, div.com-top, div.com-ng');

            this.button = document.createElement('button');
            this.button.setAttribute('type', 'button');
            dom.insertBefore(this.button, idSpan.nextSibling);
            const separator = document.createTextNode(' ')
            dom.insertBefore(separator, idSpan.nextSibling);
        }

        hideComment() {
            this.comment.style.display = 'none';
            this.button.textContent = '\u{267B}'; // Recycling Symbol
            this.button.title = this.comment.textContent;
        }

        showComment() {
            this.comment.style.display = 'block';
            this.button.textContent = '\u{1F6AE}'; // Wastebucket
            this.button.title = '';
        }
    }

    // 既存のNGボタンを削除
    // .xng-btn: OKボタン, .ng-btn: NGボタン
    document.querySelectorAll('input.xng-btn, input.ng-btn').forEach((e) => e.remove());

    const posts = [...document.querySelectorAll('.tr-art')].map((dom) => new Post(dom));
    const blocker = new Blocker(posts);

    // トップとボトムにNG全クリアボタンを追加
    document.querySelectorAll('.pager').forEach((pager) => {
        const separator = document.createTextNode('|')
        pager.appendChild(separator);
        const unblockAllButton = document.createElement('button');
        unblockAllButton.setAttribute('type', 'button');
        unblockAllButton.textContent = '全て \u{267B}';
        unblockAllButton.addEventListener('click', () => blocker.clear());
        pager.appendChild(unblockAllButton);
    });
})();