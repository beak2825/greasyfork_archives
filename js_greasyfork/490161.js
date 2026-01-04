// ==UserScript==
// @name         HHanClub发种统计工具
// @namespace    http://tampermonkey.net/
// @description  统计过去一段时间里发布的种子.
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @license      MIT
// @version      2024.03.26.1
// @include      *://hhanclub.top/userdetails.php?*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490161/HHanClub%E5%8F%91%E7%A7%8D%E7%BB%9F%E8%AE%A1%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/490161/HHanClub%E5%8F%91%E7%A7%8D%E7%BB%9F%E8%AE%A1%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function () {
    'use strict';
    // Your code here...
    var base_api_url = 'https://hhanclub.top'

    var ana_style = '<style type="text/css">.ana-content{font-weight:700;font-size:1.2em;border:none;margin:0;}.ana-content td{padding:5px 10px;border:none;}</style>';
    var tdhtml = $('<div>'+ ana_style
                   + '<button id="btn_ana_month3" style="background:#f29d38;border:none;border-radius:5px;color:#f1f3f5;padding:5px 10px;font-weight:700;font-size:14px;">数量统计(最近三个月)</button>'
                   + '<div id="ana_result"></div></div>')
    $.getScript('https://cdn.staticfile.org/layer/3.1.1/layer.js', function () {
        var t = $("#torrents-table");
        t.before(tdhtml)
        tdhtml.insertBefore(t.children[0]);

        $('#btn_ana_month3').on('click', function () {
            $('#ana_result').text('正在统计, 请稍等.');

            var uid = getUrlParam('id');
            var action = getUrlParam('action');
            var type = '';
            switch(action){
                case '1':
                    type = 'uploaded';
                    break;
                case '2':
                    type = 'seeding';
                    break;
                case '3':
                    type = 'leeching';
                    break;
                case '4':
                    type = 'completed';
                    break;
                case '5':
                    type = 'incomplete';
                    break;
                default:
                    type = 'uploaded';
                    break;
            }
            var hasNextPage = true;
            var currentPage = 0;

            var regTitleAll = /全[\d ]+?[集期场]/;
            var nowDate = new Date();
            var tmpDate = new Date();
            var lastMonth = DateAdd('m', -1, tmpDate);
            var last2Month = DateAdd('m', -1, tmpDate);

            var list = $('<ol style="margin:0;padding:0;"></ol>'), listAll = $('<ol style="margin:0;padding:0;"></ol>');

            var cnt = 0, cntAll = 0;
            var cnt1 = 0, cntAll1 = 0;
            var cnt2 = 0, cntAll2 = 0;
            while(hasNextPage){
                $.ajax({
                    type: 'GET',
                    url: '/getusertorrentlistajax.php?type='+ type +'&ajax=1&page=' + currentPage + '&userid='+uid,
                    dataType: 'json',
                    async: false,
                    success: function (res) {
                        var data = res.data;
                        hasNextPage = (parseInt(currentPage) < parseInt(res.page_num) - 1)
                        if(hasNextPage){
                            currentPage = currentPage + 1;
                        }

                        data.forEach(function(item, idx){
                            var torrent_id = item['torrent']
                            var title = item['small_descr'];
                            var title_en = item['torrentname'];
                            var postedDate = new Date(item['added']);

                            if (regTitleAll.test(title)) {
                                if ((postedDate.getFullYear() == nowDate.getFullYear() && postedDate.getMonth() == nowDate.getMonth())) {
                                    //listAll.append($('<li style="margin:5px 0 0 50px;list-style-type:decimal;"><a target="_blank" href="https://hhanclub.top/details.php?id=' + torrent_id + '">' + title + '<br />' + title_en + '</a></li>'));
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
                                    //list.append($('<li style="margin:5px 0 0 50px;list-style-type:decimal;"><a target="_blank" href="https://hhanclub.top/details.php?id=' + torrent_id + '">' + title + '<br />' + title_en + '</a></li>'));
                                    cnt++;
                                }
                                if ((postedDate.getFullYear() == lastMonth.getFullYear() && postedDate.getMonth() == lastMonth.getMonth())) {
                                    cnt1++;
                                }
                                if ((postedDate.getFullYear() == last2Month.getFullYear() && postedDate.getMonth() == last2Month.getMonth())) {
                                    cnt2++;
                                }
                            }
                        });//end of forEach
                    },
                    error: function (data) {
                        hasNextPage = false;
                        layer.msg("加载失败, 请告知开发人员.", { icon: 5, skin: 'layui-layer-lan' });
                    }
                });//end of $.ajax
            };//end of while

            var result = $('<table class="ana-content"></table>');
            var L1 = $('<tr><td>' + (nowDate.getFullYear()) + '年' + (nowDate.getMonth() + 1) + '月</td><td>全集: ' + cntAll + '</td><td>分集: ' + cnt + '</td></tr>');
            //L1.append(listAll.prop("outerHTML"));
            //L1.append(list.prop("outerHTML"));

            var L2 = $('<tr><td>' + (lastMonth.getFullYear()) + '年' + (lastMonth.getMonth() + 1) + '月</td><td>全集: ' + cntAll1 + '</td><td>分集: ' + cnt1 + '</td></tr>');
            var L3 = $('<tr><td>' + (last2Month.getFullYear()) + '年' + (last2Month.getMonth() + 1) + '月</td><td>全集: ' + cntAll2 + '</td><td>分集: ' + cnt2 + '</td></tr>');

            result.append(L1);
            result.append(L2);
            result.append(L3);

            $('#ana_result').html(result.prop("outerHTML"));

            layer.closeAll('loading')
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