// ==UserScript==
// @name         hipda-德高望重
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  过滤小号以及低分用户
// @author       屋大维
// @license      MIT
// @match        https://www.hi-pda.com/forum/*
// @match        https://www.4d4y.com/forum/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @icon         https://www.iconninja.com/files/976/19/674/mature-avatar-man-grandfather-male-person-old-icon.png
// @downloadURL https://update.greasyfork.org/scripts/444997/hipda-%E5%BE%B7%E9%AB%98%E6%9C%9B%E9%87%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/444997/hipda-%E5%BE%B7%E9%AB%98%E6%9C%9B%E9%87%8D.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // CONST
    const BLOCK = false; // 淘宝小号用户/低分用户无论如何都会高亮，设置为true之后会屏蔽，按alt+P重新显示
    const TOGGLE_KEY = 'alt+P';
    // Your code here...
    // helpers
    function isTBUser(user) {
        // 账号注册于2003年，发帖量低于500 或者 在线时长低于200小时
        return user.registerDate > new Date("2003-01-01") &&
            user.registerDate < new Date("2004-01-01") &&
            (user.postNumber < 500 || user.onlineHours < 200);
    }

    function isLowCredit(user) {
        // 默认-8，即不过滤
        return user.credit < -8;
    }

    function badGuyClassifier(user) {
        // 符合两个条件之一就是坏人
        return isTBUser(user) || isLowCredit(user);
    }

    function getKeys(e) { // keycode 转换
        var codetable = {
            '96': 'Numpad 0',
            '97': 'Numpad 1',
            '98': 'Numpad 2',
            '99': 'Numpad 3',
            '100': 'Numpad 4',
            '101': 'Numpad 5',
            '102': 'Numpad 6',
            '103': 'Numpad 7',
            '104': 'Numpad 8',
            '105': 'Numpad 9',
            '106': 'Numpad *',
            '107': 'Numpad +',
            '108': 'Numpad Enter',
            '109': 'Numpad -',
            '110': 'Numpad .',
            '111': 'Numpad /',
            '112': 'F1',
            '113': 'F2',
            '114': 'F3',
            '115': 'F4',
            '116': 'F5',
            '117': 'F6',
            '118': 'F7',
            '119': 'F8',
            '120': 'F9',
            '121': 'F10',
            '122': 'F11',
            '123': 'F12',
            '8': 'BackSpace',
            '9': 'Tab',
            '12': 'Clear',
            '13': 'Enter',
            '16': 'Shift',
            '17': 'Ctrl',
            '18': 'Alt',
            '20': 'Cape Lock',
            '27': 'Esc',
            '32': 'Spacebar',
            '33': 'Page Up',
            '34': 'Page Down',
            '35': 'End',
            '36': 'Home',
            '37': '←',
            '38': '↑',
            '39': '→',
            '40': '↓',
            '45': 'Insert',
            '46': 'Delete',
            '144': 'Num Lock',
            '186': ';:',
            '187': '=+',
            '188': ',<',
            '189': '-_',
            '190': '.>',
            '191': '/?',
            '192': '`~',
            '219': '[{',
            '220': '\|',
            '221': ']}',
            '222': '"'
        };
        var Keys = '';
        e.shiftKey && (e.keyCode != 16) && (Keys += 'shift+');
        e.ctrlKey && (e.keyCode != 17) && (Keys += 'ctrl+');
        e.altKey && (e.keyCode != 18) && (Keys += 'alt+');
        return Keys + (codetable[e.keyCode] || String.fromCharCode(e.keyCode) || '');
    };

    function addHotKey(codes, func) { // 监视并执行快捷键对应的函数
        document.addEventListener('keydown', function(e) {
            if ((e.target.tagName != 'INPUT') && (e.target.tagName != 'TEXTAREA') && getKeys(e) == codes) {
                func();
                e.preventDefault();
                e.stopPropagation();
            }
        }, false);
    };


    // classes
    class User {
        constructor(td) {
            // <td class="postauthor" rowspan="2">
            this.td = td;
        }
        get uid() {
            // integer
            return parseInt(this.td.find("div.postinfo > a").first().attr("href").split("uid=")[1]);
        }
        get userName() {
            // string
            return this.td.find("div.postinfo > a").first().text();
        }
        get postNumber() {
            // integer
            return parseInt($(this.td).find("dl.profile > dd:nth-child(4)").text());
        }
        get credit() {
            // integer
            return parseInt($(this.td).find("dl.profile > dd:nth-child(6)").text());
        }
        get registerDate() {
            // Date
            return new Date($(this.td).find("dl.profile > dd:nth-child(8)").text().trim());
        }
        get onlineHours() {
            // integer
            // not sure why I cannot get data out directly.. use regex to extract it out
            let text = $(this.td).find("div.popuserinfo > dl.s_clear").text();
            return parseInt(text.match(/在线时间(.*) 小时/)[1]);
        }
        to_json() {
            return {
                uid: this.uid,
                userName: this.userName,
                postNumber: this.postNumber,
                credit: this.credit,
                registerDate: this.registerDate,
                onlineHours: this.onlineHours
            };
        }
    }

    class HpThread {
        constructor() {}

        getThreadTid() {
            return location.href.match(/tid=(\d+)/) ? parseInt(location.href.match(/tid=(\d+)/)[1]) : -999;
        }

        getUserUid() {
            return parseInt($("cite > a").attr("href").split("uid=")[1]);
        }

        getThreadTitle() {
            let l = $('#nav').text().split(" » ");
            return l[l.length - 1];
        }

        getHpPosts() {
            let threadTid = this.getThreadTid();
            let threadTitle = this.getThreadTitle();
            let divs = $('#postlist > div').get();
            return divs.map(d => new HpPost(threadTid, threadTitle, d));
        }
    }

    class HpPost {
        constructor(threadTid, threadTitle, postDiv) {
            this.threadTid = threadTid;
            this.threadTitle = threadTitle;
            this._post_div = postDiv;
            this.hidden = false;
        }

        getUser() {
            return new User($(this._post_div).find("td.postauthor"));
        }

        isBadGuy() {
            return badGuyClassifier(this.getUser());
        }

        isMainPost() {
            return this.getPostPid() === new HpPost(this.threadTid, this.threadTitle, $('#postlist > div').first().get()).getPostPid();
        }

        hidePost() {
            $(this._post_div).hide();
            this.hidden = true;
        }

        showPost() {
            $(this._post_div).show();
            this.hidden = false;
        }

        highlightPost() {
            $(this._post_div).css("background-color", "rgba(255, 255, 0, 0.1)");
        }
        getPostPid() {
            return parseInt($(this._post_div).attr("id").split("_")[1]);
        }
        toggleDisplay() {
            console.log("ccc");
            if (this.hidden) {
                this.showPost();
                return;
            }
            if (this.isBadGuy() && !this.isMainPost()) {
                this.hidePost();
            }
        }
        register() {
            addHotKey(TOGGLE_KEY, this.toggleDisplay.bind(this));
            if (this.isBadGuy()) {
                this.highlightPost();
            }
            if (BLOCK) {
                this.toggleDisplay();
            }
        }
    }


    function main() {
        // get a thread object
        var THIS_THREAD = new HpThread();
        var hp_posts = THIS_THREAD.getHpPosts();
        for (let i = 0; i < hp_posts.length; i++) {
            let hp_post = hp_posts[i];
            try {
                hp_post.register();
            } catch (e) {
                // deleted post, simply pass it
                console.log("unable to parse the post, pass");
            }

        }
    }

    main();


})();