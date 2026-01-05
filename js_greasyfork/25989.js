// ==UserScript==
// @name         HDChina Info Clone
// @namespace    name_hdchina
// @author       sx742055963
// @description  hdchina PT种子信息克隆
// @grant        none
// @include      https://hdchina.org/torrents.php*
// @include      https://hdchina.org/upload.php*
// @icon         https://hdchina.org/pic/default_avatar.png
// @version      20170610
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/25989/HDChina%20Info%20Clone.user.js
// @updateURL https://update.greasyfork.org/scripts/25989/HDChina%20Info%20Clone.meta.js
// ==/UserScript==

(function($) {
    //------------------------------config------------------------------
    var SetAnonymous = false; //设置匿名[true,false]
    //-------------------------------end--------------------------------

    if ($('table.torrent_list').length) {
        $('table.torrent_list tr:first th:eq(1)').before('<th></th>');
        $('table.torrent_list tr:gt(0)').each(function() {
            var trseed = $(this);
            if (trseed.find('td.t_cat').length) {
                var seedid = trseed.find('td:eq(1) table td:eq(1) a:first').attr("href").match(/id=(\d+)/)[1];
                var share_rule = trseed.find('td:eq(1) table td:eq(3) img').attr("src").match(/share_rule_(\d+)/)[1];
                trseed.find('td:eq(1)').before('<td align="center"><a title="点击克隆种子信息" target="_blank" href="/upload.php#clone_' + seedid + "#rule_" + share_rule + '"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH3AUIEBkrj+YiQwAAAxtJREFUSMellc1rXGUUxn/nPee8d2aaJpOYmqSV1lTciOJGKJSCCK7dFXQhuHMvdeXSpXtxmb+gS0Eh0p0gUsVWEZWkMeAHCcHGNGYmc+9xMZ/pJM4U7+rycu95zvN7zr1HADbfucL/vVbXtk49l9HiEiUgDUCmqBmBtBAp/0vERu6fBrkVotdCSJOqSwBRbQp89Nujzr1moWMkVte2hgIS1bsHzavv71y8TiSbVB+A5u79G3N/3L1w2O68t+BVO1WJEHkI7IZ0BfuVEvDS/tLL/PXsqxDl5OqiVOcW0N/vvb5bxvq81yvNipZHO1J1PpSoboekgYAAkszJrl37kwIQxd1oa902Ll5fqZ57geb58zR3719a3vzsA4n2HWBvwCIANSUXDpVO4SBhZpCU48Yi7fnLtJvzHFii2r5zIbWOZhHdOwFbVfGckWoyokgJcwMBs0R2JbvhriBDBjbsH0yVnB1i4hCBKOZGiGCquDs5Z9ysO+NxQqDnwJRcZJjCAZJwM44R1AzPjheOuTP6GZ2CyKGawkHqOuhItzHPTs4+wDYuEIFaIucpHaSEuoEIZkNE5j1EfeyPO0jFlA5EEXdEZODAs6PuINKPYFxAngARvUBNuxnkIpN8Qsj2BIiih0it+9F5dqR3dmbIOTsxpYPK7QSinB3c6Iw8NubAiwxlZyqBjnUFzIaIKndKYSyDAEJFyPUalFMgUgVLQPQQdUMu3WghPDZFUkXE963v1m/6U8uI5e6pCPQfjpE/oAhE0Prmc/6WOtRmKIpMzpmOOyJQRffN4T5Q+6T189ezrY1vr4lIAmK/XV5taX1Z5xY5bck90gYbV15jeeUZZptz5HqNoEOUZfQ33WgGf0LcojxuBMhSPZXrDw7f0nP2cTEzV4jlIdgBV2Ph4QMu/XRIufcVB6q0frlLHB18Kcl26Ld12tLfO6rYOaqKRqpuWuKGwNg/XICaCg0DGxr8VczWCLYROXu5f/rGCkmETgRfbP/D2g/71O3k+NYMXlmq8ebzM7y4WIyKnGjizOvHty8PRuzMYRKwdHqnq2tb/AtfUe1KQr9mZwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNi0wOS0xN1QxNToxNzo0NyswODowMIu/JeMAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTItMDUtMDhUMTY6MjU6NDMrMDg6MDCbVEygAAAATXRFWHRzb2Z0d2FyZQBJbWFnZU1hZ2ljayA3LjAuMS02IFExNiB4ODZfNjQgMjAxNi0wOS0xNyBodHRwOi8vd3d3LmltYWdlbWFnaWNrLm9yZ93ZpU4AAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADUxMo+NU4EAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANTEyHHwD3AAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxMzM2NDY1NTQzfWYZJAAAABJ0RVh0VGh1bWI6OlNpemUAMTYuOUtCML+chwAAAF90RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2hvbWUvd3d3cm9vdC9zaXRlL3d3dy5lYXN5aWNvbi5uZXQvY2RuLWltZy5lYXN5aWNvbi5jbi9zcmMvMTA2NjIvMTA2NjI1NC5wbme2gbXWAAAAAElFTkSuQmCC"></a></td>');
            }
        });
    }
    if ($('form#compose').length) {
        $('table.normal_tab tr:first').after('<tr><td class="rowhead">种子链接：</td><td class="rowfollow" valign="top"><input class="ptitle" type="text" id="clone_from" placeholder="请输入种子链接..." onkeypress="if(event.keyCode==13){clone_btn.click();}"/><input class="btn_replay" type="button" id="clone_btn" value=" 克   隆 ">&nbsp;&nbsp;&nbsp;&nbsp;<span>[克隆状态：</span><span id="clone_info">请输入要克隆的种子编号或者链接</span><span>]</span></td></tr><tr hidden="true" id="seedfilename"><td class="rowhead">种子文件名：</td><td class="rowfollow" valign="top"><input class="ptitle" type="text" id="uploadseedname"></td></tr>');
    }
    // 自动处理并复制种子文件名
    function seedname_copy() {
        $("tr#seedfilename").show();
        var uploadseedname = $("input#torrent").val().replace(/.*\\([^\.\\]+)/g, "$1");
        uploadseedname = uploadseedname.replace(/(\.torrent$)/, "");
        uploadseedname = uploadseedname.replace(/(^\[\S+?\][\.]{0,1})/, "");
        uploadseedname = uploadseedname.replace(/(\.mkv$)|(\.mp4$)|(\.rmvb$)|(\.ts$)|(\.avi$)|(\.iso$)/i, "");
        uploadseedname = uploadseedname.replace(/(^\s*)|(\s*$)/g, "");
        uploadseedname = uploadseedname.replace(/([\s])/g, ".");
        $("input#uploadseedname").val(uploadseedname);
        $("input#uploadseedname").select();
    }

    function numatostring2(num) {
        return (num < 10) ? ("0" + num) : (num.toString());
    }

    function tvseasonhandle(str) {
        var aaatv = str.match(/\d+/g);
        var bbbtv = str.match(/\D+/g);
        if (aaatv && aaatv.length == 1) {
            str = numatostring2(parseInt(aaatv[0]) + 1);
            if (bbbtv) {
                str = bbbtv[0] + str;
                if (bbbtv && bbbtv.length > 1)
                    str = str + bbbtv[1];
            }

        }
        if (aaatv && aaatv.length == 2) {
            if (bbbtv && bbbtv.length >= 2 && bbbtv[1] == "E") {
                aaatv[1] = numatostring2(parseInt(aaatv[1]) + 1);
            } else {
                var temp = parseInt(aaatv[1]) - parseInt(aaatv[0]);
                aaatv[0] = numatostring2(parseInt(aaatv[1]) + 1);
                aaatv[1] = numatostring2(parseInt(aaatv[0]) + temp);
            }
            if (bbbtv && bbbtv.length == 1)
                str = aaatv[0] + bbbtv[0] + aaatv[1];
            else if (bbbtv && bbbtv.length == 2)
                str = bbbtv[0] + aaatv[0] + bbbtv[1] + aaatv[1];
            else if (bbbtv && bbbtv.length == 3)
                str = bbbtv[0] + aaatv[0] + bbbtv[1] + aaatv[1] + bbbtv[2];
        }
        return str;
    }
    $('#clone_btn').click(function() {
        var seedfrom = $('#clone_from').val().trim().match(/(\d+)/)[1];
        var info = $('#clone_info');
        if (/\d+/.test(seedfrom)) {
            info.text('正在读取...');
            $.get('https://hdchina.org/details.php?id=' + seedfrom + '&hit=1', function(resp) {
                info.text('正在分析...');
                var title = resp.match(/<title>[\s\S]*<\/title>/gi)[0];
                var body = resp.match(/<body[^>]*>[\s\S]*<\/body>/gi)[0];
                var page = $(body);
                var info_div = page.find('div.details_box');

                var match = title.match(/quot;([\s\S]*)&quot/);
                if (!match) {
                    info.text('失败，可能由于种子不存在或者网络问题');
                    return;
                }
                //标题
                title = match[1];
                var tv_name = title.match(/[\s\.][ES][P]{0,1}\d{2}[-\w]*\d{0,2}[\s\.]/);
                if (tv_name) {
                    var tv_season = tvseasonhandle(tv_name[0]);
                    title = title.replace(/[\s\.][ES][P]{0,1}\d{2}[-\w]*\d{0,2}[\s\.]/, tv_season);
                }
                $('input#name').val(title);
                // 副标题
                var sub_title = info_div.find('table.movie_details tr:eq(0) h3').text();
                var sub_name = sub_title.match(/\d{2}[-\w]*\d{0,2}/);
                if (sub_name) {
                    var sub_name1 = tvseasonhandle(sub_name[0]);
                    sub_title = sub_title.replace(/\d{2}[-\w]*\d{0,2}/, sub_name1);
                }
                $("input[name='small_descr']").val(sub_title);
                // 参数
                var seed_type = info_div.find('table.movie_details tr:eq(1) li.right.bspace').text();
                if (seed_type) {
                    var fillarea1 = ["type", "standard_sel"];
                    var fillarea2 = ["medium_sel", "codec_sel", "audiocodec_sel", "team_sel"];
                    var regx = "";
                    var i = 0;
                    for (i = 0; i < fillarea1.length; i++) {
                        $("select[name='" + fillarea1[i] + "'] option").each(function() {
                            var option_str = $(this).text().replace(/(&amp;)/ig, "&").replace(/\(/ig, "\\(").replace(/\)/ig, "\\)");
                            regx = new RegExp(option_str, 'i');
                            if (regx.test(seed_type)) {
                                $(this).attr('selected', 'selected');
                                seed_type = seed_type.replace(regx, "");
                                return false;
                            }
                        });
                    }
                    for (i = 0; i < fillarea2.length; i++) {
                        $("select[name='" + fillarea2[i] + "'] option").each(function() {
                            regx = new RegExp($(this).text(), 'i');
                            if (regx.test(seed_type)) {
                                $(this).attr('selected', 'selected');
                                seed_type = seed_type.replace(regx, "");
                                return false;
                            }
                        });
                    }
                }
                // 海报
                var img_src_poster = info_div.find('table.movie_details tr:eq(1) img:first').attr("src");
                if (!(img_src_poster.match(/http[\S]{0,2}\/\//))) {
                    img_src_poster = "https://hdchina.club/" + img_src_poster;
                }
                $("input#cover").val(img_src_poster);
                // 简介
                var descr = info_div.find('div#kdescr');
                descr.find('fieldset').remove();
                if (descr.find('img:first').length) {
                    var img_src = descr.find('img:first').attr("src");
                    if (img_src.match(/http[\S]{0,2}\/\//)) {
                        img_src = "[img]" + img_src + "[/img]";
                    } else {
                        img_src = "[img]https://hdchina.club/" + img_src + "[/img]";
                    }
                    descr.find('img').remove();
                    $('textarea#descr').html(img_src + descr.text());
                } else {
                    $('textarea#descr').html(descr.text());
                }
                // IMDB
                var imdb_link = "";
                if (info_div.find('div#kimdb a:first').length) {
                    imdb_link = info_div.find('div#kimdb a:first').attr("href");
                }
                if (!imdb_link.match(/www\.imdb\.com/)) {
                    var imdb_match = descr.text().match(/(http[\S]{0,2}\/\/www\.imdb\.com\/title\/tt\d+\/?)/);
                    if (imdb_match) {
                        imdb_link = imdb_match[1];
                    }
                }
                $("input.p_imdb").val(imdb_link);
                info.text('克隆完成');
            });
        } else {
            info.text('请输入要克隆的种子编号或者链接');
        }
    });

    $(document).ready(function() {
        $("input#torrent").bind("change", seedname_copy);
        var match = location.href.match(/#clone_(\d+)/);
        var match1 = location.href.match(/#rule_(\d+)/);
        if (match) {
            $('#clone_from').val(match[1]);
            $('select#share_rule option[value=' + match1[1] + ']').attr("selected", true);
            history.pushState("", document.title, window.location.pathname);
            $('#clone_btn').click();
        } else {
            $("select#share_rule option[value='255']").attr("selected", true);
        }
    });

})(jQuery);