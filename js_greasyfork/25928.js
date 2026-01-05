// ==UserScript==
// @name         ManTou Info Clone
// @namespace    XingXing_ManTou
// @author       XingXing
// @description  ManTou种子信息克隆
// @grant        none
// @include      https://tp.m-team.cc/torrents.php*
// @include      https://tp.m-team.cc/upload.php*
// @icon         https://tp.m-team.cc/logo.png
// @version      20180225
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/25928/ManTou%20Info%20Clone.user.js
// @updateURL https://update.greasyfork.org/scripts/25928/ManTou%20Info%20Clone.meta.js
// ==/UserScript==
(function($) {

    $('form#compose table tr:first').after('<tr><td class="rowhead nowrap" valign="top" align="right">引用种子链接</td><td class="rowfollow" valign="top" align="left"><input type="text" style="width:320px;" id="clone_from" placeholder="请输入种子ID或链接..." onkeypress="if(event.keyCode==13){clone_btn.click();}"/><input type="button" id="clone_btn" style="size:100px;" value=" 克   隆 ">&nbsp;&nbsp;&nbsp;&nbsp;<span>[克隆状态：</span><span id="clone_info">请输入要克隆的种子编号或者链接</span><span>]</span></td></tr><tr hidden="true" id="seedfilename"><td class="rowhead nowrap" valign="top" align="right">种子文件名</td><td class="rowfollow" valign="top" align="left"><input type="text" style="width:650px;" id="uploadseedname"></td></tr>');

    // 自动处理并复制种子文件名
    function seedname_copy() {
        $("tr#seedfilename").show();
        var uploadseedname = $("input#torrent").val().replace(/.*\\([^\.\\]+)/g, "$1");
        uploadseedname = uploadseedname.replace(/(\.torrent$)/, "");
        uploadseedname = uploadseedname.replace(/(^\[\S+?\][\.]{0,1})/, "");
        uploadseedname = uploadseedname.replace(/(\.mkv$)|(\.mp4$)|(\.rmvb$)|(\.ts$)|(\.avi$)|(\.iso$)/i, "");
        uploadseedname = uploadseedname.replace(/(^\s*)|(\s*$)/g, "");
        uploadseedname = uploadseedname.replace(/(\.)/g, " ");
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
        $('#torrent').removeAttr('onchange');
        var seedfrom = $('#clone_from').val().trim().match(/(\d+)/)[1];
        var info = $('#clone_info');
        if (/\d+/.test(seedfrom)) {
            info.text('正在读取...');
            $.get('https://tp.m-team.cc/details.php?id=' + seedfrom, function(resp) {
                info.text('正在分析...');
                var title = resp.match(/<title>[\s\S]*<\/title>/gi)[0];
                var body = resp.match(/<body[^>]*>[\s\S]*<\/body>/gi)[0];
                var page = $(body);
                var seed_info = page.find("td#outer table");
                //标题
                title = title.match(/quot;([\s\S]*)&quot/)[1];
                if (title) {
                    title = title.replace(/(^\s*)|(\s*$)/g, "");
                    var tv_name = title.match(/[\s\.][ES][P]{0,1}\d{2}[-\w]*\d{0,2}[\s\.]/);
                    if (tv_name) {
                        var tv_season = tvseasonhandle(tv_name[0]);
                        title = title.replace(/[\s\.][ES][P]{0,1}\d{2}[-\w]*\d{0,2}[\s\.]/, tv_season);
                    }
                    $('input#name').val(title);
                }
                // 副标题
                var sub_title = page.find("td#outer table tr:eq(1) td:eq(1)").text();
                if (sub_title) {
                    var sub_name = sub_title.match(/\d{1,2}[-\w]*\d{0,2}/);
                    if (sub_name) {
                        var sub_name1 = tvseasonhandle(sub_name[0]);
                        sub_title = sub_title.replace(/\d{1,2}[-\w]*\d{0,2}/, sub_name1);
                    }
                    $("input[name='small_descr']").val(sub_title);
                }

                var seed_type = "";
                if (seed_info.find('tr:eq(2) td:first').text().trim() === "Tag") {
                    seed_type = seed_info.find('tr:eq(3) td:eq(1)').text();
                    $("input#tags").val(seed_info.find('tr:eq(2) td:eq(1)').text().trim());
                } else {
                    seed_type = seed_info.find('tr:eq(2) td:eq(1)').text();
                }
                if (seed_type) {
                    var regx = "";
                    // 类型
                    $("select#browsecat option").each(function() {
                        var option_str = $(this).text().replace(/(&amp;)/ig, "&").replace(/\(/ig, "\\(").replace(/\)/ig, "\\)");
                        regx = new RegExp(option_str, 'i');
                        if (regx.test(seed_type)) {
                            $(this).attr('selected', 'selected');
                            seed_type = seed_type.replace(regx, "");
                            return false;
                        }
                    });
                    // 视频参数
                    var fillarea = ["codec_sel", "standard_sel", "processing_sel", "team_sel"];
                    for (var i = 0; i < fillarea.length; i++) {
                        $("select[name='" + fillarea[i] + "'] option").each(function() {
                            regx = new RegExp($(this).text(), 'i');
                            if (regx.test(seed_type)) {
                                $(this).attr('selected', 'selected');
                                seed_type = seed_type.replace(regx, "");
                                return false;
                            }
                        });
                    }
                }
                // 匿名发布
                $("input[name=uplver]").attr("checked", true);
                // 简介
                var seed_descr = seed_info.find('div#kdescr');
                if (seed_descr) {
                    if (seed_descr.find('div.codetop').length) {
                        seed_descr.find('div.codetop').remove();
                        seed_descr.find('div.codemain').remove();
                    }
                    if (seed_descr.find('fieldset').length) {
                        seed_descr.find('fieldset').remove();
                    }
                    if (seed_descr.find('img').length) {
                        var img_src = seed_descr.find('img:first').attr("src");
                        img_src = "[img]https://tp.m-team.cc/" + img_src + "[/img]";
                        $('#descr').val(img_src + seed_descr.text());
                    } else {
                        $('#descr').val(seed_descr.text());
                    }
                }
                // IMDB链接
                var imdb_link = "";
                if (seed_info.find('div#kimdb').length) {
                    var imdb_link_t = seed_info.find('div#kimdb a:first').attr('href');
                    if (imdb_link_t.match(/www\.imdb\.com/)) {
                        imdb_link = imdb_link_t;
                    }
                }
                if (!imdb_link.match(/www\.imdb\.com/)) {
                    var imdb_match = seed_descr.text().match(/(http[\S]{0,2}\/\/www\.imdb\.com\/title\/tt\d+\/?)/);
                    if (imdb_match) {
                        imdb_link = imdb_match[1];
                    }
                }
                $("td.rowfollow>input[name='url']").val(imdb_link);
                info.text('克隆完成');
            });
        } else {
            info.text('请输入要克隆的种子编号或者链接');
        }
    });
    $(document).ready(function() {
        $("input#torrent").bind("change", seedname_copy);
    });
})(jQuery);