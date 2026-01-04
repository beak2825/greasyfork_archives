// ==UserScript==
// @name         手机端豆瓣网页修改
// @namespace    移动端豆瓣页面修改
// @version      1.9
// @description  修改跳转 app 链接，去除部分跳转按钮
// @author       fukvqz
// @match        https://m.douban.com/group/*
// @match        https://m.douban.com/people/*
// @match        https://m.douban.com/note/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434922/%E6%89%8B%E6%9C%BA%E7%AB%AF%E8%B1%86%E7%93%A3%E7%BD%91%E9%A1%B5%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/434922/%E6%89%8B%E6%9C%BA%E7%AB%AF%E8%B1%86%E7%93%A3%E7%BD%91%E9%A1%B5%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';
    document.querySelector('.TalionNav-static .icon-wrap').removeAttribute('href');
    document.querySelector('.TalionNav-static .info').removeAttribute('href');
    document.querySelector('.TalionNav-static .btn').remove();
    if (window.location.href.indexOf('topic') > 0) {
        try { document.getElementById('tbl-next-up').remove(); } catch (e) { }
        document.querySelector('.more_topic + section').remove();
        document.querySelector('.note-content + div').remove();
        document.querySelectorAll('.more_topic')[1].nextElementSibling.remove();
        //document.querySelector('.TalionNav-static .icon-wrap').removeAttribute('href');
        //document.querySelector('.TalionNav-static .info').removeAttribute('href');
        //document.querySelector('.TalionNav-static .btn').remove();
        document.querySelector('.opreations').remove();
        document.querySelectorAll('.meta-text .extra-info').forEach((thcm) => { thcm.parentNode.removeAttribute('href'); });
        document.querySelectorAll('.meta-text').forEach((rppl) => { rppl.firstElementChild.href = rppl.firstElementChild.href.split('=')[3]; });
        document.querySelectorAll('.reply-meta').forEach((rppi) => { rppi.firstElementChild.href = rppi.firstElementChild.href.split('=')[3]; });
        var saa = document.querySelector('.show-all a');
        if (!(saa == null)) {
            if (document.querySelectorAll('.reply-item').length < saa.innerText.slice(4, -11)) {
                saa.href = '/to_pc/?url=' + window.location.href + '#sep';
                // saa.href = 'https://www.douban.com' + saa.href.split('=')[3];
                saa.innerText = saa.innerText.split(' ')[0];
            }
            else {
                document.querySelector('.show-all').remove();
            }
        }
        document.querySelectorAll("span[class='oia']").forEach((moia) => { moia.remove(); });
        try { document.querySelector('.oia-prompt-box .prompt .opt .cancel').click(); } catch (e) { }
        var owp = document.querySelectorAll('.oia-wrap');
        owp[0].remove();
        owp[2].remove();
        owp[1].firstElementChild.href = owp[1].firstElementChild.href.split('=')[3];
        document.querySelector('.oia-wrap .oia-btn').innerText = '查看小组更多内容';
        document.querySelectorAll('.join').forEach((jn) => {jn.remove();});
        document.querySelectorAll('.more_topic .topic-content .topic-item a').forEach((tpitm) => { tpitm.href = tpitm.href.split('=')[2].split('&')[0]; });
        document.querySelector('.download-app').remove();
        document.querySelectorAll('.show-more a').forEach((sm) => { sm.href = sm.href.split('=')[2].split('&')[0]; });
    }
    if (window.location.href.indexOf('people') > 0) {
        //document.querySelector('.TalionNav-static .icon-wrap').removeAttribute('href');
        //document.querySelector('.TalionNav-static .info').removeAttribute('href');
        //document.querySelector('.TalionNav-static .btn').remove();
        var style = document.createElement('style');
        style.innerHTML = '.load-more ~ .load-more {display: none;}';
        document.head.appendChild(style);
        document.querySelector('.download-app').remove();
    }
    if (window.location.href.indexOf('note') > 0) {
        //document.querySelector('.TalionNav-static .icon-wrap').removeAttribute('href');
        //document.querySelector('.TalionNav-static .info').removeAttribute('href');
        //document.querySelector('.TalionNav-static .btn').remove();
        try { document.querySelector('.oia-prompt-box .prompt .opt .cancel').click(); } catch (e) { }
        document.querySelector('.download-app').remove();
        document.querySelector('.note-content + div').remove();
        document.querySelector('.user-notes + div').remove();
        document.querySelector('.tohomepage + div').remove();
        document.querySelector('.opreations').remove();
    }
    if (window.location.href.indexOf('people') < 0 && window.location.href.indexOf('topic') < 0 && window.location.href.indexOf('note') < 0) {
        document.querySelectorAll("span[class='oia']").forEach((moia) => { moia.remove(); });
        //document.querySelector('.TalionNav-static .icon-wrap').removeAttribute('href');
        //document.querySelector('.TalionNav-static .info').removeAttribute('href');
        //document.querySelector('.TalionNav-static .btn').remove();
        var oiag = document.querySelector('.oia-wrap .oia-btn');
        oiag.href = 'https://www.douban.com' + oiag.href.split('=')[3] + '/discussion';
        oiag.innerText = '查看小组更多内容';
        document.querySelectorAll('.topic-item .item-containor').forEach((itcn) => { if (itcn.href.indexOf('to_app') > 0) { itcn.href = itcn.href.split('=')[2].split('&')[0]; } });
        document.querySelector('.download-app').remove();
        var style = document.createElement('style');
        style.innerHTML = '.btn-group {display: none;}';
        document.head.appendChild(style);
    }
})();
