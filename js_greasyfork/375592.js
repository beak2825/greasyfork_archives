// ==UserScript==
// @name         志愿北京服务时长统计
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  一个同时组内成员服务时长的小工具
// @author       Rika
// @match        https://www.bv2008.cn/app/org/member.php
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375592/%E5%BF%97%E6%84%BF%E5%8C%97%E4%BA%AC%E6%9C%8D%E5%8A%A1%E6%97%B6%E9%95%BF%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/375592/%E5%BF%97%E6%84%BF%E5%8C%97%E4%BA%AC%E6%9C%8D%E5%8A%A1%E6%97%B6%E9%95%BF%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var peoples = {};
    var num_pages = Number.parseInt($('.ptpage')[0].innerHTML);
    window.peoples = peoples;
    window.query_all = query_all;
    window.queryAllAsync = queryAllAsync;
    var action_button_obsolete = $('<button id="query-all" class="but2"><del>已弃用</del></button>');
    var action_button = $('<button id="query-all" class="but2">查询所有人员志愿工时</button>');
    var progress_bar = $('<progress id="prb" max="' + num_pages + '" value="0"></progress>');
    var download_link = $('<a href="#" download="data.csv">下载csv数据</a>');

    action_button_obsolete.click(window.query_all);
    action_button.click(window.queryAllAsync);
    progress_bar.insertAfter('#search_form');
    action_button.insertAfter('#search_form');
    //action_button_obsolete.insertAfter('#search_form');

    async function sleep(time) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, time)
        })
    }

    async function queryAllAsync() {//爬虫主函数
        for (let i = 1; i <= num_pages; i++) {
            const page_html = await $.get('/app/org/member.php?&p=' + i)
            await sleep(1000)//爬取名单中每页的延时
            progress_bar[0].value++;
            const page_doc = $.parseHTML(page_html),
                page_p = $('[href^="/app/sys/view.vol.php?uid="]', page_doc)
            progress_bar[0].max += page_p.length
            for (let j = 0; j < page_p.length; j++) {
                await sleep(1000);//爬取每个人个人信息的延时
                const uid = page_p[j].href.split('?uid=')[1],
                    name = page_p[j].innerText,
                    personal_activities = [];
                peoples[uid] = [name, personal_activities]
                const person_detail_html = await $.get('/app/sys/view.vol.php?type=hour&uid=' + uid)
                progress_bar[0].value++
                const detail_page = $.parseHTML(person_detail_html),
                    detail_pages_num = Number.parseInt($('.ptpage', detail_page)[0].innerText)
                progress_bar[0].max += detail_pages_num
                for (let k = 1; k <= detail_pages_num; k++) {
                    await sleep(1000);//爬取每个人志愿活动中每页面的延时
                    const detail_one_page_html = k > 1 ? await $.get('/app/sys/view.vol.php?type=hour&uid=' + uid + '&p=' + k)
                        : person_detail_html
                    progress_bar[0].value++
                    const one_page = $.parseHTML(detail_one_page_html),
                        trs = $('tr', one_page)
                    progress_bar[0].max += trs.length - 1
                    for (let l = 1; l < trs.length; l++) {
                        progress_bar[0].value++;
                        const _tr = trs
                        if ($(_tr[l]).find('td:nth-child(4)')[0].innerText === '已生效')
                            peoples[uid][1].push([$(_tr[l]).find('td:nth-child(2)')[0].innerText,
                                $(_tr[l]).find('td:nth-child(5)')[0].innerText])
                        progress_change()
                    }
                }
            }
        }
    }

//obsolete
    function query_all() {
        for (var i = 1; i <= num_pages; i++) {
            $.get('/app/org/member.php?&p=' + i)
                .then(function (body, code, res) {
                    if (code === 'success') {
                        progress_bar[0].value++;
                        var _html = $.parseHTML(body);
                        var _p = $('[href^="/app/sys/view.vol.php?uid="]', _html);
                        progress_bar[0].max += _p.length;
                        for (var j = 0; j < _p.length; j++) {
                            setTimeout(function (j) {
                                return (function () {
                                    var _uid = _p[j].href.split('?uid=')[1];
                                    var _name = _p[j].innerText;//todo
                                    var personal_activities = [];
                                    peoples[_uid] = [_name, personal_activities];
                                    $.get('/app/sys/view.vol.php?type=hour&uid=' + _uid)
                                        .then(function (body, code, res) {
                                            progress_bar[0].value++;
                                            if (code === 'success') {
                                                var _html = $.parseHTML(body);
                                                var _pages = Number.parseInt($('.ptpage', _html)[0].innerText);
                                                progress_bar[0].max += _pages;
                                                for (var k = 1; k <= _pages; k++) {
                                                    $.get('/app/sys/view.vol.php?type=hour&uid=' + _uid + '&p=' + k)
                                                        .then(function (body, code, res) {
                                                            progress_bar[0].value++;
                                                            if (code === 'success') {
                                                                var _html = $.parseHTML(body);
                                                                var _tr = $('tr', _html);
                                                                progress_bar[0].max += _tr.length - 1;
                                                                for (var l = 1; l < _tr.length; l++) {
                                                                    progress_bar[0].value++;
                                                                    if ($(_tr[l]).find('td:nth-child(4)')[0].innerText === '已生效')
                                                                        peoples[_uid][1].push([$(_tr[l]).find('td:nth-child(2)')[0].innerText,
                                                                            $(_tr[l]).find('td:nth-child(5)')[0].innerText]);
                                                                    progress_change()
                                                                }
                                                            } else {
                                                                console.log(res.statusText)
                                                            }
                                                        })
                                                }
                                            } else {
                                                console.log(res.statusText)
                                            }
                                        })
                                })
                            }(j), j * 10 * 1000);

                        }
                    } else {
                        console.log(res.statusText)
                    }
                })
        }

    }

    function progress_change() {
        if ($('#prb')[0].value < $('#prb')[0].max) return;
        var rs_str = 'data:text/csv;charset=utf-8,\ufeff';
        for (var p in window.peoples) {
            if (!window.peoples.hasOwnProperty(p)) continue;
            var _ = '';
            for (var t in window.peoples[p][1]) {
                if (!window.peoples[p][1].hasOwnProperty(t)) continue;
                _ += window.peoples[p][0] + ',' + window.peoples[p][1][t][0] + ',' + window.peoples[p][1][t][1] + '\n';
            }
            rs_str += encodeURIComponent(_);
        }
        download_link[0].href = rs_str;
        download_link.insertAfter('#prb');
    }

    // Your code here...
})();
