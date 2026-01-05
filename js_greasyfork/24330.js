// ==UserScript==
// @name         WHU Info Clone
// @namespace    FreshCottage_whu
// @author       FreshCottage
// @description  落樱PT种子信息克隆
// @grant        none
// @include      https://pt.whu.edu.cn/torrents*
// @include      https://pt.whu.edu.cn/upload*
// @icon         https://pt.whu.edu.cn/pic/logos/03.png
// @version      20161212
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/24330/WHU%20Info%20Clone.user.js
// @updateURL https://update.greasyfork.org/scripts/24330/WHU%20Info%20Clone.meta.js
// ==/UserScript==

(function($) {

    if ($('table#torrents').length) {
        $('table#torrents>tbody>tr').each(function() {
            var tr = $(this);
            var tdnum = tr.find('td.rowfollow').length;
            var td1 = tdnum - 4;
            var seedid = tr.find('td.torrent a:first').attr('href').match(/id=(\d+)/)[1];
            var tr_img = tr.find("td:eq(" + td1 + ")");
            var link = "https://pt.whu.edu.cn/upload.php#clone_" + seedid;
            tr_img.click(function() {
                window.open(link);
            });
        });
        return;
    }

    $('form#compose dl.table dt:first').before('<dt>引用种子链接</dt><dd class="first-child"><input type="text" style="width:320px;" id="clone_from" placeholder="请输入种子ID或链接..." onkeypress="if(event.keyCode==13){clone_btn.click();}"/><input type="button" id="clone_btn" style="size:100px;" value=" 克   隆 ">&nbsp;&nbsp;&nbsp;&nbsp;<span>[克隆状态：</span><span id="clone_info">请输入要克隆的种子编号或者链接</span><span>]</span></dd>');

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
    $('#clone_btn').click(function() {
        var seedfrom = $('#clone_from').val().trim();
        var info = $('#clone_info');
        var match = seedfrom.match(/(\d+)/);
        if (match !== null) {
            seedfrom = match[1];
            info.text('正在读取...');
            $.get('https://pt.whu.edu.cn/details.php?id=' + seedfrom, function(resp) {
                info.text('正在分析...');
                var title = resp.match(/<title>[\s\S]*<\/title>/gi)[0];
                var body = resp.match(/<body[^>]*>[\s\S]*<\/body>/gi)[0];
                var page = $(body);
                var descr = page.find('div#outer');
                // 标题匹配
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
                var sub_title = descr.find('dl#torrenttable dd:eq(1)').text();
                var sub_name = sub_title.match(/\d{1,2}[-\w]*\d{0,2}/);
                if (sub_name) {
                    var sub_name1 = tvseasonhandle(sub_name[0]);
                    sub_title = sub_title.replace(/\d{1,2}[-\w]*\d{0,2}/, sub_name1);
                }
                $("input[name='small_descr']").val(sub_title);
                // 类型
                var seed_type = descr.find('dl.minor-list.properties:first dd:eq(1)').text();
                $("select#browsecat option").each(function() {
                    if ($(this).text() === seed_type) {
                        $(this).attr('selected', 'selected');
                    }
                });
                var standard_sel = descr.find('dl.minor-list.properties:first dd:eq(2)').text();
                $("select[name='standard_sel'] option").each(function() {
                    if ($(this).text() === standard_sel) {
                        $(this).attr('selected', 'selected');
                    }
                });
                // 匿名发布
                $("input[name=uplver]").attr("checked", false);
                $("input[name=noshoutbox]").attr("checked", false);
                // 豆瓣链接
                var douban_link = "";
                descr.find('div').each(function() {
                    var div_temp = $(this);
                    if (div_temp.find('a').length == 1 && div_temp.find('img').length == 1 && div_temp.find('a').attr('href').match(/movie\.douban\.com/)) {
                        douban_link = div_temp.find('a').attr('href');
                    }
                });
                // IMDB链接
                var imdb_link = "";
                if (descr.find('div#ratings').length) {
                    var imdblink_t = descr.find('div#ratings span:first a:first').attr('href');
                    if (imdblink_t.match(/www\.imdb\.com/)) {
                        imdb_link = imdblink_t;
                    }
                }
                if (imdb_link || douban_link) {
                    if (douban_link) {
                        $("input[name='url_douban']").val(douban_link);
                    }
                    if (imdb_link) {
                        $("input[name='url']").val(imdb_link);
                    }
                    CKEDITOR.instances.descr.insertHtml("...");
                } else {
                    // 简介
                    var seed_descr = descr.find('div#kdescr');
                    if (seed_descr.find('img').length) {
                        var img_src = seed_descr.find('img:first').attr("data-ks-lazyload");
                        if (img_src.match(/http[\S]{0,2}\/\//)) {
                            img_src = "[img]" + img_src + "[/img]";
                        } else {
                            img_src = "[img]https://pt.whu.edu.cn/" + img_src + "[/img]";
                        }
                        CKEDITOR.instances.descr.insertHtml(img_src + seed_descr.html());
                    } else {
                        CKEDITOR.instances.descr.insertHtml(seed_descr.html());
                    }
                }
                info.text('克隆完成');
            });
        } else {
            info.text('请输入要克隆的种子编号或者链接');
        }
    });

    $(document).ready(function() {
        var match = location.href.match(/clone_(\d+)/);
        if (match) {
            var link = "https://pt.whu.edu.cn/details.php?id=" + match[1] + "&hit=1";
            $("input#clone_from").val(link);
            history.pushState("", document.title, window.location.pathname);
            $('#clone_btn').click();
        }
    });

})(jQuery);
