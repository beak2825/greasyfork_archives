// ==UserScript==
// @name         TTHD Info Clone
// @namespace    XingXing_TTHD
// @author       XingXing
// @description  TTHD种子信息克隆
// @grant        none
// @include      http://tthd.org/torrents.php*
// @include      http://tthd.org/upload.php*
// @require      http://code.jquery.com/jquery-2.2.4.min.js
// @icon         http://tthd.org/pic/default_avatar.png
// @version      20161222
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/25927/TTHD%20Info%20Clone.user.js
// @updateURL https://update.greasyfork.org/scripts/25927/TTHD%20Info%20Clone.meta.js
// ==/UserScript==
var jq = jQuery.noConflict();
// http://code.jquery.com/jquery-2.2.4.min.js
(function() {

    jq('form#compose table tr:first').after('<td class="rowhead nowrap" valign="top" align="right">引用种子链接</td><td class="rowfollow" valign="top" align="left"><input type="text" style="width:320px;" id="clone_from" placeholder="请输入种子ID或链接..." onkeypress="if(event.keyCode==13){clone_btn.click();}"/><input type="button" id="clone_btn" style="size:100px;" value=" 克   隆 ">&nbsp;&nbsp;&nbsp;&nbsp;<span>[克隆状态：</span><span id="clone_info">请输入要克隆的种子编号或者链接</span><span>]</span></td>');

    function numatostring2(num) {
        var res = 0;
        res = num;
        if (res < 10)
            return "0" + res;
        return res.toString();
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
    jq('#clone_btn').click(function() {
		jq('#torrent').removeAttr('onchange');
        var seedfrom = jq('#clone_from').val().trim();
        var info = jq('#clone_info');
        var match = seedfrom.match(/(\d+)/);
        if (match !== null) {
            seedfrom = match[1];
            info.text('正在读取...');
            jq.get('http://tthd.org/details.php?id=' + seedfrom, function(resp) {
                info.text('正在分析...');
                var title = resp.match(/<title>[\s\S]*<\/title>/gi)[0];
                var body = resp.match(/<body[^>]*>[\s\S]*<\/body>/gi)[0];
                var page = jq(body);

                //标题
                var seedtitle_t = page.find("#outer h1#top").html();
                var seedtitle_1 = seedtitle_t.match(/([\s\S]*?)<b/);
                var seedtitle = seedtitle_t.replace(/(&nbsp;)|(^\s*)|(\s*$)/g, "");
                if (seedtitle_1) {
                    seedtitle = seedtitle_1[1].replace(/(&nbsp;)|(^\s*)|(\s*$)/g, "");
                }
                var tv_name = seedtitle.match(/[\s\.][ES][P]{0,1}\d{2}[-\w]*\d{0,2}[\s\.]/);
                if (tv_name) {
                    var tv_season = tvseasonhandle(tv_name[0]);
                    seedtitle = seedtitle.replace(/[\s\.][ES][P]{0,1}\d{2}[-\w]*\d{0,2}[\s\.]/, tv_season);
                }
                jq('input#name').val(seedtitle);
                // 副标题
                var sub_title = page.find('td#outer table tr:eq(2) td:eq(1)').text();
                var sub_name = sub_title.match(/\d{1,2}[-\w]*\d{0,2}/);
                if (sub_name) {
                    var sub_name1 = tvseasonhandle(sub_name[0]);
                    sub_title = sub_title.replace(/\d{1,2}[-\w]*\d{0,2}/, sub_name1);
                }
                jq("input[name='small_descr']").val(sub_title);
                // 类型
                var seed_type = page.find('td#outer table tr:eq(3) td:eq(1)').text();
                var fields = seed_type.match(/[:：][\s]+([\w\d]+[\s\d\w\.\/-]*)/g);
                for (var i = 0; i < fields.length; i++) {
                    fields[i] = fields[i].replace(/([:：][\s])|(^\s*)|(\s*$)/g, "");
                }
                var fillarea = new Array("browsecat", "source_sel", "medium_sel", "codec_sel", "audiocodec_sel", "standard_sel", "team_sel");
                var fillcheck = new Array(6, 1, 2, 1, 1, 0);
                while (fillarea.length > fields.length) {
                    fillarea.splice(fillcheck.shift(), 1);
                }
                for (i = 0; i < fillarea.length; i++) {
                    jq("select[name='" + fillarea[i] + "'] option").each(function() {
                        var title_reg = new RegExp(fields[i]);
                        if (jq(this).text().match(title_reg)) {
                            jq(this).attr('selected', 'selected');
                        }
                    });
                }
                // 匿名发布
                jq("input[name=uplver]").attr("checked", false);
                // 简介
                var seed_descr = page.find('div#kdescr');
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
                        img_src = "[img]http://tthd.org/" + img_src + "[/img]";
                    }
                    jq('#descr').val(img_src + seed_descr.text());
                } else {
                    jq('#descr').val(seed_descr.text());
                }
                // IMDB链接
                var imdb_match = seed_descr.text().match(/(http[\S]{0,2}\/\/www\.imdb\.com\/title\/tt\d+\/?)/);
                if (imdb_match) {
                    var imdb_link = imdb_match[1];
                    jq("input[name='url']").val(imdb_link);
                }
                info.text('克隆完成');
            });
        } else {
            info.text('请输入要克隆的种子编号或者链接');
        }
    });

})();
