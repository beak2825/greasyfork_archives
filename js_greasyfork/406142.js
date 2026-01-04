// ==UserScript==
// @name         BYR BBS User Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在北邮人论坛中屏蔽黑名单用户的发言
// @author       MadDevil
// @match        *://bbs.byr.cn/*
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/406142/BYR%20BBS%20User%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/406142/BYR%20BBS%20User%20Blocker.meta.js
// ==/UserScript==


class Blocker {
    constructor() {
        this.username = document.getElementsByClassName('u-login-id')[0].getElementsByTagName('a')[0].innerText;
        this.blocked = new Set();
        this.orginal_page = null;
        this.get_blacklist();
    }


    update_page() {
        if (this.orginal_page === null) this.orginal_page = $('.b-content').html();
        else $('.b-content').html(this.orginal_page);
        let articles = $('.article');
        for (let i = 0; i < articles.length; ++i) {
            let article = $(articles[i]);
            let u_name = article.find('.a-u-name').text();
            let is_blocked = this.blocked.has(u_name);
            let bt_text = ["屏蔽此人", "取消屏蔽"][Number(is_blocked)];
            let button = $('<li><samp class="ico-pos-deny"></samp><a href="javascript:void(0)">' + bt_text + '</a></li>');
            $(article.find('.a-func').find('li')[4]).after(button);
            button.click(that => {
                if (is_blocked) this.del_user(u_name);
                else this.add_user(u_name);
            });
            article.find('.a-content')[0].style.display = ["none", "block"][Number(!is_blocked)];
            article.find('.a-content2')[0].style.display = ["none", "block"][Number(is_blocked)];
            if (is_blocked) article.find('.a-content2').find('p')[0].innerText = "此用户发言已被您屏蔽。"
        }

    }

    get_blacklist(page = 1) {
        $.ajax("/blacklist?p=" + page + "&_uid=" + this.username).done(res => {
            let doc = $(res), users = doc.find('.title_2');
            for (let i = 0; i < users.length; ++i)
                this.blocked.add(users[i].innerText);
            if(doc.find("[title=下一页]").length!==0) this.get_blacklist(page+1);
            else if (location.hash.search(/^#!article/) === 0) this.update_page();
        })

    }


    add_user(u_name) {
        $.ajax({
            "url": "/blacklist/ajax_add.json",
            "type": "POST",
            "data": {"id": u_name}
        }).done(res => {
            this.blocked.add(u_name);
            this.update_page();
        });
    }

    del_user(u_name) {
        $.ajax({
            "url": "/blacklist/ajax_delete.json",
            "type": "POST",
            "data": "f_" + u_name + "=on"
        }).done(res => {
            this.blocked.delete(u_name);
            this.update_page();
        });

    }
}

function wait_until(condition, handler) {
    function wrapper() {
        if (condition()) handler();
        else setTimeout(wrapper, 100);
    }

    wrapper();
}

var blocker = null;
$(document).ready(() => wait_until(() => document.getElementById('nforum_tips').style.display === 'none', () => blocker = new Blocker()));
window.addEventListener('hashchange', function (e) {
    if (blocker !== null) {
        blocker.orginal_page = null;
        if (location.hash.search(/^#!article/) === 0)
            wait_until(() => document.getElementById('nforum_tips').style.display === 'none', () => blocker.update_page());
    }
}, false);
