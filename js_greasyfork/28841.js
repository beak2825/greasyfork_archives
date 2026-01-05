// ==UserScript==
// @name         OURBITS Info Clone
// @namespace    XingXing_OURBITS
// @author       XingXing
// @description  OURBITS种子信息克隆
// @grant        GM_xmlhttpRequest
// @include      *ourbits.club/torrents*
// @include      *ourbits.club/upload*
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @icon         https://ourbits.club/bitbucket/37C58PIC7IT_1024.jpg
// @version      20181201
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/28841/OURBITS%20Info%20Clone.user.js
// @updateURL https://update.greasyfork.org/scripts/28841/OURBITS%20Info%20Clone.meta.js
// ==/UserScript==

// https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// https://ourbits.club/js/jquery-1.11.3.min.js
// 脚本预处理阶段
const jq = jQuery.noConflict();

const SetAnonymous = false; //设置匿名[true,false]

(function() {

    if (jq('table#torrenttable.torrents').length) {
        jq('table#torrenttable.torrents tr:first td.colhead:first').after('<td class="colhead">Clone</td>');
        jq('table.torrents tr:gt(0)').each(function() {
            let tr = jq(this);
            if (tr.find('table.torrentname').length) {
                let id = tr.find('table.torrentname a:first').attr('href').match(/id=(\d+)/)[1];
                tr.find('td:first').after('<td class="rowfollow"><a title="点击克隆种子信息" target="_blank" href="/upload.php#clone_' + id + '"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH3AUIEBkrj+YiQwAAAxtJREFUSMellc1rXGUUxn/nPee8d2aaJpOYmqSV1lTciOJGKJSCCK7dFXQhuHMvdeXSpXtxmb+gS0Eh0p0gUsVWEZWkMeAHCcHGNGYmc+9xMZ/pJM4U7+rycu95zvN7zr1HADbfucL/vVbXtk49l9HiEiUgDUCmqBmBtBAp/0vERu6fBrkVotdCSJOqSwBRbQp89Nujzr1moWMkVte2hgIS1bsHzavv71y8TiSbVB+A5u79G3N/3L1w2O68t+BVO1WJEHkI7IZ0BfuVEvDS/tLL/PXsqxDl5OqiVOcW0N/vvb5bxvq81yvNipZHO1J1PpSoboekgYAAkszJrl37kwIQxd1oa902Ll5fqZ57geb58zR3719a3vzsA4n2HWBvwCIANSUXDpVO4SBhZpCU48Yi7fnLtJvzHFii2r5zIbWOZhHdOwFbVfGckWoyokgJcwMBs0R2JbvhriBDBjbsH0yVnB1i4hCBKOZGiGCquDs5Z9ysO+NxQqDnwJRcZJjCAZJwM44R1AzPjheOuTP6GZ2CyKGawkHqOuhItzHPTs4+wDYuEIFaIucpHaSEuoEIZkNE5j1EfeyPO0jFlA5EEXdEZODAs6PuINKPYFxAngARvUBNuxnkIpN8Qsj2BIiih0it+9F5dqR3dmbIOTsxpYPK7QSinB3c6Iw8NubAiwxlZyqBjnUFzIaIKndKYSyDAEJFyPUalFMgUgVLQPQQdUMu3WghPDZFUkXE963v1m/6U8uI5e6pCPQfjpE/oAhE0Prmc/6WOtRmKIpMzpmOOyJQRffN4T5Q+6T189ezrY1vr4lIAmK/XV5taX1Z5xY5bck90gYbV15jeeUZZptz5HqNoEOUZfQ33WgGf0LcojxuBMhSPZXrDw7f0nP2cTEzV4jlIdgBV2Ph4QMu/XRIufcVB6q0frlLHB18Kcl26Ld12tLfO6rYOaqKRqpuWuKGwNg/XICaCg0DGxr8VczWCLYROXu5f/rGCkmETgRfbP/D2g/71O3k+NYMXlmq8ebzM7y4WIyKnGjizOvHty8PRuzMYRKwdHqnq2tb/AtfUe1KQr9mZwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNi0wOS0xN1QxNToxNzo0NyswODowMIu/JeMAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTItMDUtMDhUMTY6MjU6NDMrMDg6MDCbVEygAAAATXRFWHRzb2Z0d2FyZQBJbWFnZU1hZ2ljayA3LjAuMS02IFExNiB4ODZfNjQgMjAxNi0wOS0xNyBodHRwOi8vd3d3LmltYWdlbWFnaWNrLm9yZ93ZpU4AAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADUxMo+NU4EAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANTEyHHwD3AAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxMzM2NDY1NTQzfWYZJAAAABJ0RVh0VGh1bWI6OlNpemUAMTYuOUtCML+chwAAAF90RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2hvbWUvd3d3cm9vdC9zaXRlL3d3dy5lYXN5aWNvbi5uZXQvY2RuLWltZy5lYXN5aWNvbi5jbi9zcmMvMTA2NjIvMTA2NjI1NC5wbme2gbXWAAAAAElFTkSuQmCC"></a></td>');
            }
        });
        return;
    }

    jq('form#compose table tr:eq(1)').before('<td class="rowhead nowrap" valign="top" align="right">引用种子链接</td><td class="rowfollow" valign="top" align="left"><input type="text" style="width:320px;" id="clone_from" placeholder="请输入种子ID或链接..." onkeypress="if(event.keyCode==13){clone_btn.click();}"/><input type="button" id="clone_btn" style="size:100px;" value=" 克   隆 ">&nbsp;&nbsp;&nbsp;&nbsp;<span>[克隆状态：</span><span id="clone_info">请输入要克隆的种子编号或者链接</span><span>]</span></td>');

    function requestData(url, successHandle, timeoutHandle) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            timeout: 5000,
            onreadystatechange: successHandle,
            ontimeout: timeoutHandle,
        });
    }

    function requestJson(url, successHandle, timeoutHandle) {
        requestData(url, function(response) {
            if (response.readyState == 4) {
                successHandle(JSON.parse(response.responseText));
            }
        }, function(response) {
            timeoutHandle(response);
        });
    }

    jq("input#info").css('width', '580px');
    jq("input#info").after('<input type="button" id="query_btn" style="width:70px;" value=" 查   询 ">');
    jq("input#query_btn").click(function() {
        var query_input = jq("input#info").val().trim();
        var Search_From_API = function(url, callback) {
            requestJson(url, function(res, resj) {
                let search_html = callback(res, resj);
                if (search_html) {
                    jq('span#search_res').remove();
                    jq('#compose>table>tbody>tr:eq(8)>td.rowfollow>font').after(search_html).show();
                    jq("a.search_choose").click(function() {
                        jq('input#info').val(jq(this).attr("data-url"));
                        jq('span#search_res').remove();
                    });
                }
            }, function() {});
        };
        Search_From_API("https://api.douban.com/v2/movie/search?q=" + query_input, function(resj) {
            let search_html = "";
            if (resj.total !== 0) {
                search_html = '<span id="search_res"><hr><table style="width: 100%" align="center"><tr><td class="colhead" align="center">年代</td><td class="colhead" align="center">类别</td><td class="colhead" align="center">标题</td><td class="colhead" align="center">豆瓣链接</td><td class="colhead" align="center">行为</td></tr>';
                for (let i_douban = 0; i_douban < resj.subjects.length; i_douban++) {
                    let i_item = resj.subjects[i_douban];
                    search_html += "<tr><td class='rowfollow' align='center'>" + i_item.year + "</td><td class='rowfollow' align='center'>" + i_item.subtype + "</td><td class='rowfollow'>" + i_item.title + "</td><td class='rowfollow'><a href='" + i_item.alt + "' target='_blank'>" + i_item.alt + "</a></td><td class='rowfollow' align='center'><a href='javascript:void(0);' class='search_choose' data-url='" + i_item.alt + "'>选择</a></td></tr>";
                }
                search_html += "</table></span>";
            }
            return search_html;
        });
    });


    jq('#clone_btn').click(function() {
        // jq('#torrent').removeAttr('onchange');
        var seedfrom = jq('#clone_from').val().trim().match(/(\d+)/)[1];
        var info = jq('#clone_info');
        if (/\d+/.test(seedfrom)) {
            info.text('正在读取...');
            jq.get('//ourbits.club/details.php?id=' + seedfrom, function(resp) {
                info.text('正在分析...');
                var title = resp.match(/<title>[\s\S]*<\/title>/gi)[0];
                var body = resp.match(/<body[^>]*>[\s\S]*<\/body>/gi)[0];
                var page = jq(body);
                var seed_info = page.find('td#outer table');
                var seed_descr = seed_info.find('div#kdescr');

                //标题
                title = title.match(/quot;([\s\S]*)&quot/);
                if (title) {
                    jq('input#name').val(title[1]);
                }
                // 副标题
                var sub_title = "";
                if (page.find('td#outer table tr:eq(1) td:eq(1) a').length) {
                    sub_title = page.find('td#outer table:eq(1) tr:eq(1) td:eq(1)').text();
                } else {
                    sub_title = page.find('td#outer table tr:eq(1) td:eq(1)').text();
                }
                if (sub_title) {
                    jq("input[name='small_descr']").val(sub_title);
                }
                // 匿名发布
                jq("input[name=uplver]").attr("checked", SetAnonymous);

                // IMDB链接
                var imdb_or_douban_link = "";
                if (seed_info.find('div#imdbinfo').length) {
                    let imdblink_t = seed_info.find('div#imdbinfo a:first').attr('href');
                    if (imdblink_t.match(/www\.imdb\.com/)) {
                        imdb_or_douban_link = imdblink_t;
                    }
                }
                if (imdb_or_douban_link == "" && seed_info.find('div#doubaninfo').length) {
                    let doubanlink_t = seed_info.find('div#doubaninfo a:first').attr('href');
                    if (doubanlink_t.match(/movie\.douban\.com/)) {
                        imdb_or_douban_link = doubanlink_t;
                    }
                }
                if (imdb_or_douban_link == "") {
                    let imdb_match = seed_descr.text().match(/(http[\S]{0,2}\/\/www\.imdb\.com\/title\/tt\d+)/);
                    if (imdb_match) {
                        imdb_or_douban_link = imdb_match[1] + "/";
                    } else {
                        let douban_match = seed_descr.text().match(/(http[\S]{0,2}\/\/movie\.douban\.com\/subject\/\d+)/);
                        if (douban_match) {
                            imdb_or_douban_link = douban_match[1] + "/";
                        }
                    }
                }
                jq("input#info").val(imdb_or_douban_link);
                //
                jq("input[name=uplver]").attr("checked", true);
                // 简介
                if (seed_descr.find('div.codetop').length) {
                    seed_descr.find('div.codetop').remove();
                    seed_descr.find('div.codemain').remove();
                }
                if (seed_descr.find('fieldset').length) {
                    seed_descr.find('fieldset').remove();
                }
                if (seed_descr.find('img').length) {
                    var img_src = seed_descr.find('img:first').attr("src");
                    if (img_src.match(/http[\S]{0,2}\/\//)) {
                        img_src = "[img]" + img_src + "[/img]";
                    } else {
                        img_src = "[img]https://ourbits.club/" + img_src + "[/img]";
                    }
                    SmileIT(img_src + seed_descr.text(), 'upload', 'descr');
                } else {
                    SmileIT(seed_descr.text(), 'upload', 'descr');
                }
                // 视频参数
                var seed_type = seed_info.find('tr:eq(2) td:eq(1)').text();
                if (seed_type) {
                    var regx = "";
                    var fillarea_pre = ["类型: ", "媒介: ", "编码: ", "音频编码: ", "分辨率: ", "", "制作组: "];
                    var fillarea = ["type", "medium_sel", "codec_sel", "audiocodec_sel", "standard_sel", "processing_sel", "team_sel"];
                    for (var i = 0; i < fillarea.length; i++) {
                        jq("select[name='" + fillarea[i] + "'] option").each(function() {
                            var option_str = jq(this).text();
                            if (i === 0)
                                option_str = option_str.replace(/\/[\s\S]+/, "").trim();
                            regx = new RegExp(fillarea_pre[i] + option_str, 'i');
                            if (regx.test(seed_type)) {
                                jq(this).attr('selected', 'selected');
                                seed_type = seed_type.replace(regx, "");
                                return false;
                            }
                        });
                    }
                }
                info.text('克隆完成');
            });
        } else {
            info.text('请输入要克隆的种子编号或者链接');
        }
    });

    jq(document).ready(function() {
        let match = location.href.match(/#clone_(\d+)/);
        if (match) {
            history.pushState("", document.title, window.location.pathname + window.location.search);
            jq('#clone_from').val(match[1]);
            jq('#clone_btn').click();

        }
    });
})();