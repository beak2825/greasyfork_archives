// ==UserScript==
// @name         accessibility_百度贴吧快捷键
// @namespace    https://www.zhihu.com/people/yin-xiao-bo-11
// @version      0.1.1
// @description  可访问性优化
// @author       Veg
// @include    *://tieba.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36865/accessibility_%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/36865/accessibility_%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function () {
    setTimeout(function () {
        proc(document); amo(proc);
    }, 10);
    function proc(d) {
        var url = window.location.href;
        var tb = url.substring(22, 24);
        if (tb == '/p') {
            //删除举报
            var ccq = d.querySelectorAll('ul.p_mtail'); for (var i = 0, l = ccq.length; i < l; i++) { var qn = ccq[i].parentNode; var sc = qn.querySelector('ul.p_mtail'); qn.removeChild(sc); }
            //删除用户名前面那个没名字的链接
            var ccq = d.querySelectorAll('div.j_louzhubiaoshi'); for (var i = 0, l = ccq.length; i < l; i++) { var qn = ccq[i].parentNode; var sc = qn.querySelector('div.j_louzhubiaoshi'); qn.removeChild(sc); }
            //删除徽章
            var ccx = d.querySelectorAll('li.l_badge'); for (var i = 0, l = ccx.length; i < l; i++) { var qn = ccx[i].parentNode; var sc = qn.querySelector('li.l_badge'); qn.removeChild(sc); }
            //删除用户成就的图标
            var ccq = d.querySelectorAll('li.d_icons'); for (var i = 0, l = ccq.length; i < l; i++) { var qn = ccq[i].parentNode; var sc = qn.querySelector('li.d_icons'); qn.removeChild(sc); }
            //删除用户名下面那个没名字的链接
            var ccq = d.querySelectorAll('li.d_nameplate'); for (var i = 0, l = ccq.length; i < l; i++) { var qn = ccq[i].parentNode; var sc = qn.querySelector('li.d_nameplate'); qn.removeChild(sc); }
            //删除用户图标
            var ccq = d.querySelectorAll('li.icon'); for (var i = 0, l = ccq.length; i < l; i++) { var qn = ccq[i].parentNode; var sc = qn.querySelector('li.icon'); qn.removeChild(sc); }

            //删除...
            var ccq = d.querySelectorAll('a.save_face_card'); for (var i = 0, l = ccq.length; i < l; i++) { var qn = ccq[i].parentNode; var sc = qn.querySelector('a.save_face_card'); qn.removeChild(sc); }

            //删除贴吧超级会员
            var ccq = d.querySelectorAll('a.icon_tbworld'); for (var i = 0, l = ccq.length; i < l; i++) { var qn = ccq[i].parentNode; var sc = qn.querySelector('a.icon_tbworld'); qn.removeChild(sc); }
            //删除楼中楼里的用户头像
            var ccq = d.querySelectorAll('a.lzl_p_p'); for (var i = 0, l = ccq.length; i < l; i++) { var qn = ccq[i].parentNode; var sc = qn.querySelector('a.lzl_p_p'); qn.removeChild(sc); }
            //删除帖子楼层页面的广告
            var ccq = d.querySelectorAll('span.label_text'); for (var i = 0, l = ccq.length; i < l; i++) { var qns = ccq[i].parentNode.parentNode.parentNode; var qn = qns.parentNode; var sc = qn.querySelector('span.label_text').parentNode.parentNode.parentNode; qn.removeChild(sc); }
            //删除帖子楼层页面的推荐应用
            var ccq = d.querySelectorAll('div[id="encourage_entry"]'); for (var i = 0, l = ccq.length; i < l; i++) { var qn = ccq[i].parentNode; var sc = qn.querySelector('div[id="encourage_entry"]'); qn.removeChild(sc); }
            //删除帖子楼层页面的下载应用
            var ccq = d.querySelectorAll('div.app_download_box'); for (var i = 0, l = ccq.length; i < l; i++) { var qn = ccq[i].parentNode; var sc = qn.querySelector('div.app_download_box'); qn.removeChild(sc); }
            //删除帖子楼层页面的意见反馈
            var ccq = d.querySelectorAll('ul.tieba_notice_theme2'); for (var i = 0, l = ccq.length; i < l; i++) { var qn = ccq[i].parentNode; var sc = qn.querySelector('ul.tieba_notice_theme2'); qn.removeChild(sc); }
            //删除帖子楼层页面的发帖提示
            var ccq = d.querySelectorAll('div.poster_head'); for (var i = 0, l = ccq.length; i < l; i++) { var qn = ccq[i].parentNode; var sc = qn.querySelector('div.poster_head'); qn.removeChild(sc); }
            //
            var ccq = d.querySelectorAll('a[title]');
            for (var i = 0, l = ccq.length; i < l; i++) {
                ccq[i].removeAttribute('title', '*');
            }
        }
        //发表、收起回复
        var fb = d.querySelectorAll('span.lzl_panel_submit,span.lzl_link_fold');
        for (var i = 0, l = fb.length; i < l; i++) {
            fb[i].setAttribute('tabindex', '0');
            fb[i].setAttribute('role', 'button');
            fb[i].classList.add('clickButton');
            fb[i].addEventListener("keydown", function (k) {
                if (k.keyCode == 13 || k.keyCode == 32) { this.click(); }
            }, null);
        }
        //翻页
        var fyul = document.querySelectorAll('ul.l_posts_num,[id="frs_list_pager"]'); {
            for (var g = 0; g < fyul.length; g++) {
                var fy = fyul[g].querySelectorAll('a[href]');
                for (var i = 0; i < fy.length; i++) {
                    var name = fy[i].innerText;
                    if (name == '上一页' || name == '<上一页') {
                        fy[i].classList.add('focusUp');
                        fy[i].setAttribute('role', 'button');
                    }
                    if (name == '下一页' || name == '下一页>') {
                        fy[i].classList.add('focusDown');
                        fy[i].setAttribute('role', 'button');
                    }
                }
            }
        }


        //快捷键
        var timeline = document.querySelectorAll('div.j_l_post,div.t_con');
        for (var i = 0, l = timeline.length; i < l; i++) {
            timeline[i].setAttribute('focuss', i);
            var tabindex = timeline[i].getAttribute('tabindex');
            if (tabindex == null) {
                timeline[i].setAttribute('tabindex', '-1');
                timeline[i].addEventListener("keydown", feedShortcutKey, null);
            }
        }

        //贴吧首页
        if (tb == '/f') {
            //删除广告
            var ccq = d.querySelectorAll('span.label_text'); for (var i = 0, l = ccq.length; i < l; i++) { var qns = ccq[i].parentNode.parentNode.parentNode.parentNode; var qn = qns.parentNode; var sc = qn.querySelector('span.label_text').parentNode.parentNode.parentNode.parentNode; qn.removeChild(sc); }
            var ccq = d.querySelectorAll('.j_icon_slot');
            for (var i = 0, l = ccq.length; i < l; i++) {
                var qn = ccq[i].parentNode; var sc = qn.querySelector('.j_icon_slot');
                qn.removeChild(sc);
            }
            var ccq = d.querySelectorAll('a.icon_tbworld');
            for (var i = 0, l = ccq.length; i < l; i++) {
                var qn = ccq[i].parentNode; var sc = qn.querySelector('a.icon_tbworld');
                qn.removeChild(sc);
            }

            var h = d.querySelectorAll('div.t_con');
            for (var i = 0, l = h.length; i < l; i++) {
                var a = h[i].querySelectorAll('a[title]');
                for (var j = 0; j < a.length; j++) {
                    var qn = a[j].parentNode;
                    var hTwo = document.createElement("h2");
                    if (qn.tagName !== 'H2') {
                        if (a[j].classList.contains('j_thread_hidden') || a[j].classList.contains('frs-author-name') || a[j].classList.contains('j_icon_slot'))
                            continue;
                        qn.insertBefore(hTwo, a[j]);
                        hTwo.appendChild(a[j]);
                    }
                }
            }
            //删除 title
            var ccq = d.querySelectorAll('a[title]');
            for (var i = 0, l = ccq.length; i < l; i++) {
                if (ccq[i].classList.contains('j_thread_hidden'))
                    continue;
                ccq[i].removeAttribute('title', '*');
            }
        }

    }
    function amo(processFunction) {
        var mcallback = function (records) {
            records.forEach(function (record) {
                if (record.type == 'childList' && record.addedNodes.length > 0) {
                    var newNodes = record.addedNodes;
                    for (var i = 0, len = newNodes.length; i < len; i++) {
                        if (newNodes[i].nodeType == 1) {
                            processFunction(newNodes[i]);
                        }
                    }
                }
            });
        };
        var mo = new MutationObserver(mcallback);
        mo.observe(document.body, { 'childList': true, 'subtree': true });
    }
})();

function feedShortcutKey(k) {
    k.stopPropagation();
    var feed = document.querySelectorAll('div[focuss]');
    var focussValue = this.getAttribute('focuss'); var number = parseInt(focussValue);
    if (k.altKey && k.shiftKey && k.keyCode == 88) {
        if (focussValue !== null) {
            if (this.getAttribute('focuss') == '0')
                return false; feed[number - 1].focus();
        }
    }

    if (k.altKey && k.keyCode == 88) { if (focussValue !== null) { feed[number + 1].focus(); } }
    if (k.altKey && k.shiftKey && k.keyCode == 88) { if (focussValue !== null) { if (this.getAttribute('focuss') == '0') return false; feed[number - 1].focus(); } }
    if (k.altKey && k.keyCode == 50) {
        var fb = this.querySelectorAll('a.lzl_link_unfold,a.j_lzl_p');
        for (var i = 0; i < fb.length; i++) { fb[i].focus(); }
    }
    kjj(k);
}

document.body.addEventListener("keydown", function (k) {
    var content = document.querySelectorAll('div[focuss]');
    for (var i = 0, l = content.length; i < l; i++) {
        if (k.altKey && k.keyCode == 88) { content[0].focus(); }
        if (k.altKey && k.shiftKey && k.keyCode == 88) { content[l - 1].focus(); }
    }
    kjj(k);
}, null);
function kjj(k) {
    if (k.altKey && k.keyCode == 49) { document.querySelector('.edui-body-container').focus(); }
    if (k.altKey && k.keyCode == 51) { document.querySelector('a.focusUp').focus(); }
    if (k.altKey && k.keyCode == 52) { document.querySelector('a.focusDown').focus(); }
}


var audio = new Audio("http://veg.ink/music/sound.mp3");
audio.volume = 0.15;
audio.play();
