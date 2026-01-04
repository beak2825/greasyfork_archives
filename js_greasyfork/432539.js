// ==UserScript==
// @name         CHDBits 发种统计工具
// @namespace    http://tampermonkey.net/
// @description  统计过去一段时间里发布的种子.
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @license      MIT
// @version      2023.03.28.0
// @include      *://chdbits.co/userdetails.php?*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432539/CHDBits%20%E5%8F%91%E7%A7%8D%E7%BB%9F%E8%AE%A1%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/432539/CHDBits%20%E5%8F%91%E7%A7%8D%E7%BB%9F%E8%AE%A1%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function () {
    'use strict';
    // Your code here...
    var base_api_url = 'https://chdbits.co'

    var chdbits_style = '<style type="text/css">.chdbits-title{margin:5px;font-weight:700;font-size:1.2em;}.chdbits-subtitle{margin:5px 0 0 20px;font-weight:400;font-size:1.1em;}</style>';
    var tdhtml = $('<tr>'
        + '<td class="rowhead nowrap" valign="top" align="right">发种统计（BETA）</td>'
        + '<td class="rowfollow" valign="top" align="left">' + chdbits_style
        + '<input id="btn_ana_month3" type="button" value="统计最近三个月" align="left" /> '
        + '<input id="btn_ana_all" type="button" value="统计所有" align="left" />'
        + '<div id="ana_result"></div>'
        + '</td></tr>')
    $.getScript('https://cdn.staticfile.org/layer/3.1.1/layer.js', function () {
        var t = $("#outer .main .embedded").eq(0);
        var n = t.find('table>tbody').eq(0);
        tdhtml.insertAfter(n.children('tr')[13]);

        $('#btn_ana_all').on('click', function () {
            var m = $(this);
            var uid = getUrlParam('id');

            $.ajax({
                type: 'GET',
                url: '/getusertorrentlistajax.php?userid=' + uid + '&type=uploaded',
                dataType: 'html',
                beforeSend: function () {
                    layer.load(2);
                },
                async: true,
                success: function (res) {
                    layer.closeAll('loading');
                    var tr = $(res).children(3).children();
                    tr.splice(0,1)
                    tr=$(tr.get().reverse());

                    var regTitleAll = /全[\d ]+?[集期场]/;

                    var tr0=$($(tr[0]).prop("outerHTML"));
                    var postedDate0Str=$(tr0.children()[3]).find('span').attr("title");
                     if (postedDate0Str === undefined)
                            postedDate0Str = $(tr0.children()[3]).text();

                    var tmpDate = new Date(postedDate0Str);
                    var cursorDate = new Date(postedDate0Str);

                    var list = $('<ol style="margin:0;padding:0;"></ol>'), listAll = $('<ol style="margin:0;padding:0;"></ol>');

                    var chdDate = [], chdCnt = [], chdCntAll = [];
                    chdDate.push(cursorDate);

                    var cnt = 0, cntAll = 0;

                    tr.each(function (idx) {
                        var ar = $($(this).prop("outerHTML"));
                        var title = $(ar.children()[1]);
                        var title_link = $(ar.children()[1]).find('a').attr("href");
                        var postedDateStr = $(ar.children()[3]).find('span').attr("title");
                        if (postedDateStr === undefined)
                            postedDateStr = $(ar.children()[3]).text();

                        var postedDate = new Date(postedDateStr);

                        var subTitle = $(ar.children()[1]);
                        subTitle.children('a').remove();

                        if ((postedDate.getFullYear() == cursorDate.getFullYear() && postedDate.getMonth()+1 == cursorDate.getMonth()+1)) {
                            if (regTitleAll.test(title.text())) {
                                cntAll++;
                            }
                            else {
                                cnt++;
                            }
                        }
                        else {
                            cursorDate = DateAdd('m', 1, tmpDate);

                            chdDate.push(cursorDate);
                            chdCntAll.push(cntAll);
                            chdCnt.push(cnt);

                            cntAll = 0;
                            cnt = 0;

                            if (regTitleAll.test(title.text())) {
                                cntAll++;
                            }
                            else {
                                cnt++;
                            }
                        }
                    });

                    chdCntAll.push(cntAll);
                    chdCnt.push(cnt);

                    var result = $('<dl></dl>');

                    chdDate.reverse();
                    chdCntAll.reverse();
                    chdCnt.reverse();

                    chdDate.forEach((item, idx) => {
                        var L = $('<dt class="chdbits-title">' + (item.getFullYear()) + '年' + (item.getMonth() + 1) + '月</dt>');
                        L.append($('<dd class="chdbits-subtitle">全集: ' + chdCntAll[idx] + '</dd>'));
                        L.append($('<dd class="chdbits-subtitle">分集: ' + chdCnt[idx] + '</dd>'));

                        result.append(L);
                    });

                    $('#ana_result').html(result.prop("outerHTML"));
                },
                error: function (data) {
                    layer.closeAll('loading');
                    layer.msg("加载失败, 请告知开发人员.", { icon: 5, skin: 'layui-layer-lan' });
                }
            });//end of $.ajax
        });//end of onclick

        $('#btn_ana_month3').on('click', function () {
            var m = $(this);
            var uid = getUrlParam('id');

            $.ajax({
                type: 'GET',
                url: '/getusertorrentlistajax.php?userid=' + uid + '&type=uploaded',
                dataType: 'html',
                beforeSend: function () {
                    layer.load(2);
                },
                async: true,
                success: function (res) {
                    layer.closeAll('loading');
                    var tr = $(res).children(3).children();
                    var regTitleAll = /全[\d ]+?[集期场]/;
                    var nowDate = new Date();
                    var tmpDate = new Date();
                    var lastMonth = DateAdd('m', -1, tmpDate);
                    var last2Month = DateAdd('m', -1, tmpDate);

                    var list = $('<ol style="margin:0;padding:0;"></ol>'), listAll = $('<ol style="margin:0;padding:0;"></ol>');

                    var cnt = 0, cntAll = 0;
                    var cnt1 = 0, cntAll1 = 0;
                    var cnt2 = 0, cntAll2 = 0;
                    tr.each(function (idx) {
                        if (idx == 0) return true;

                        var ar = $($(this).prop("outerHTML"));
                        var title = $(ar.children()[1]);
                        var title_link = $(ar.children()[1]).find('a').attr("href");
                        var title_en_text = title.children('a').text()
                        title.children('a').remove();
                        title = title.text()
                        var postedDateStr = $(ar.children()[3]).find('span').attr("title");
                        if (postedDateStr === undefined)
                            postedDateStr = $(ar.children()[3]).text();

                        var postedDate = new Date(postedDateStr);

                        if (regTitleAll.test(title)) {
                            if ((postedDate.getFullYear() == nowDate.getFullYear() && postedDate.getMonth() == nowDate.getMonth())) {
                                listAll.append($('<li style="margin:5px 0 0 50px;list-style-type:decimal;"><a target="_blank" href="' + title_link + '">' + title + '<br />' + title_en_text + '</a></li>'));
                                cntAll++;
                            }
                            if ((postedDate.getFullYear() == lastMonth.getFullYear() && postedDate.getMonth() == lastMonth.getMonth())) {
                                cntAll1++;
                            }
                            if ((postedDate.getFullYear() == last2Month.getFullYear() && postedDate.getMonth() == last2Month.getMonth())) {
                                cntAll2++;
                            }
                        }
                        else {
                            if ((postedDate.getFullYear() == nowDate.getFullYear() && postedDate.getMonth() == nowDate.getMonth())) {
                                list.append($('<li style="margin:5px 0 0 50px;list-style-type:decimal;"><a target="_blank" href="' + title_link + '">' + title + '<br />' + title_en_text + '</a></li>'));

                                cnt++;
                            }
                            if ((postedDate.getFullYear() == lastMonth.getFullYear() && postedDate.getMonth() == lastMonth.getMonth())) {
                                cnt1++;
                            }
                            if ((postedDate.getFullYear() == last2Month.getFullYear() && postedDate.getMonth() == last2Month.getMonth())) {
                                cnt2++;
                            }
                        }
                    });

                    var result = $('<dl></dl>');
                    var L1 = $('<dt class="chdbits-title">' + (nowDate.getFullYear()) + '年' + (nowDate.getMonth() + 1) + '月</dt>');
                    L1.append($('<dd class="chdbits-subtitle">全集: ' + cntAll + '</dd>'));
                    L1.append(listAll.prop("outerHTML"));
                    L1.append($('<dd class="chdbits-subtitle">分集: ' + cnt + '</dd>'));
                    L1.append(list.prop("outerHTML"));

                    var L2 = $('<dt class="chdbits-title">' + (lastMonth.getFullYear()) + '年' + (lastMonth.getMonth() + 1) + '月</dt>');
                    L2.append($('<dd class="chdbits-subtitle">全集: ' + cntAll1 + '</dd>'));
                    L2.append($('<dd class="chdbits-subtitle">分集: ' + cnt1 + '</dd>'));

                    var L3 = $('<dt class="chdbits-title">' + (last2Month.getFullYear()) + '年' + (last2Month.getMonth() + 1) + '月</dt>');
                    L3.append($('<dd class="chdbits-subtitle">全集: ' + cntAll2 + '</dd>'));
                    L3.append($('<dd class="chdbits-subtitle">分集: ' + cnt2 + '</dd>'));

                    result.append(L3);
                    result.append(L2);
                    result.append(L1);

                    $('#ana_result').html(result.prop("outerHTML"));
                },
                error: function (data) {
                    layer.closeAll('loading');
                    layer.msg("加载失败, 请告知开发人员.", { icon: 5, skin: 'layui-layer-lan' });
                }
            });//end of $.ajax
        });//end of onclick
    });

    //获取url中的参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }

    function DateAdd(interval, number, date) {
        switch (interval.toLowerCase()) {
            case "y": return new Date(date.setFullYear(date.getFullYear() + number));
            case "m": return new Date(date.setMonth(date.getMonth() + number));
            case "d": return new Date(date.setDate(date.getDate() + number));
            case "w": return new Date(date.setDate(date.getDate() + 7 * number));
            case "h": return new Date(date.setHours(date.getHours() + number));
            case "n": return new Date(date.setMinutes(date.getMinutes() + number));
            case "s": return new Date(date.setSeconds(date.getSeconds() + number));
            case "l": return new Date(date.setMilliseconds(date.getMilliseconds() + number));
        }
    }
})();