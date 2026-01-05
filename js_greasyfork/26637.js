// ==UserScript==
// @name        BYRBT Info Clone
// @author      freshcottage
// @description 一键复制已有种子的信息，自动增加集数
// @namespace   freshcottage_byr
// @include     http://bt.byr.cn/torrents.php*
// @include     http://bt.byr.cn/upload.php?type=*
// @include     http://bt.byr.cn/details.php*
// @icon        http://bt.byr.cn/favicon.ico
// @run-at      document-end
// @grant       none
// @version     20170610
// @downloadURL https://update.greasyfork.org/scripts/26637/BYRBT%20Info%20Clone.user.js
// @updateURL https://update.greasyfork.org/scripts/26637/BYRBT%20Info%20Clone.meta.js
// ==/UserScript==

(function($) {

    //------------------------------config------------------------------

    var CloneButtonPosition = 0; //克隆按钮位置（0-10）
    var TitleOfCloneButton = ""; //克隆按钮标题栏文字(中英文)
    var ColorOfSingularLines = "#E5E5E5"; //设置种子列表单数行颜色

    //种子列表自己发布的种子用户名突出显示
    var SetUserNameOutstanding = true; //是否设置种子列表用户名突出显示[true,false]
    var UserNameColor = "red"; //字体颜色[red,#8D078B,...]
    var UserNameWeight = "bold"; //字体加粗[normal,bold,900,...]
    var UserNameFontStyle = "italic"; //字体风格[italic,normal,oblique,...]
    var UserNameFontSize = "1.2em"; //字体大小[18px,1.2em,...]

    var SetAnonymous = false; //设置匿名[true,false]
    //-------------------------------end--------------------------------

    // 为种子列表添加克隆按钮
    if ($('table.torrents').length) {
        $('table.torrents td.colhead:eq(' + CloneButtonPosition + ')').after('<td class="colhead">' + TitleOfCloneButton + '</td>');
        var secocat = $('input:hidden[name=secocat]').val() || 0;
        var usrid = $('table#info_block td.bottom span.medium span.nowrap a:first').attr('href').substring(19);
        $('table.torrents>tbody>tr').each(function() {
            var tr = $(this);
            if (tr.find('table.torrentname').length) {
                if (tr.find('td:last span.nowrap a:first').length) {
                    var seedid = tr.find('td:last span.nowrap a:first').attr('href').substring(19);
                    if (SetUserNameOutstanding && seedid == usrid) {
                        tr.find('td:last span.nowrap a:first b').css({
                            "color": UserNameColor,
                            "font-weight": UserNameWeight,
                            "font-style": UserNameFontStyle,
                            "font-size": UserNameFontSize
                        });
                    }
                }
                var cat = tr.find('a[href^="?cat="]').attr('href').match(/cat=(\d+)/)[1];
                var id = tr.find('table.torrentname td:nth-child(1) a').attr('href').match(/id=(\d+)/)[1];
                tr.find('td:eq(' + CloneButtonPosition + ')').after('<td class="rowfollow"><a title="点击克隆种子信息" target="_blank" href="/upload.php?type=' + cat + '#clone_' + id + '#' + secocat + '"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH3AUIEBkrj+YiQwAAAxtJREFUSMellc1rXGUUxn/nPee8d2aaJpOYmqSV1lTciOJGKJSCCK7dFXQhuHMvdeXSpXtxmb+gS0Eh0p0gUsVWEZWkMeAHCcHGNGYmc+9xMZ/pJM4U7+rycu95zvN7zr1HADbfucL/vVbXtk49l9HiEiUgDUCmqBmBtBAp/0vERu6fBrkVotdCSJOqSwBRbQp89Nujzr1moWMkVte2hgIS1bsHzavv71y8TiSbVB+A5u79G3N/3L1w2O68t+BVO1WJEHkI7IZ0BfuVEvDS/tLL/PXsqxDl5OqiVOcW0N/vvb5bxvq81yvNipZHO1J1PpSoboekgYAAkszJrl37kwIQxd1oa902Ll5fqZ57geb58zR3719a3vzsA4n2HWBvwCIANSUXDpVO4SBhZpCU48Yi7fnLtJvzHFii2r5zIbWOZhHdOwFbVfGckWoyokgJcwMBs0R2JbvhriBDBjbsH0yVnB1i4hCBKOZGiGCquDs5Z9ysO+NxQqDnwJRcZJjCAZJwM44R1AzPjheOuTP6GZ2CyKGawkHqOuhItzHPTs4+wDYuEIFaIucpHaSEuoEIZkNE5j1EfeyPO0jFlA5EEXdEZODAs6PuINKPYFxAngARvUBNuxnkIpN8Qsj2BIiih0it+9F5dqR3dmbIOTsxpYPK7QSinB3c6Iw8NubAiwxlZyqBjnUFzIaIKndKYSyDAEJFyPUalFMgUgVLQPQQdUMu3WghPDZFUkXE963v1m/6U8uI5e6pCPQfjpE/oAhE0Prmc/6WOtRmKIpMzpmOOyJQRffN4T5Q+6T189ezrY1vr4lIAmK/XV5taX1Z5xY5bck90gYbV15jeeUZZptz5HqNoEOUZfQ33WgGf0LcojxuBMhSPZXrDw7f0nP2cTEzV4jlIdgBV2Ph4QMu/XRIufcVB6q0frlLHB18Kcl26Ld12tLfO6rYOaqKRqpuWuKGwNg/XICaCg0DGxr8VczWCLYROXu5f/rGCkmETgRfbP/D2g/71O3k+NYMXlmq8ebzM7y4WIyKnGjizOvHty8PRuzMYRKwdHqnq2tb/AtfUe1KQr9mZwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNi0wOS0xN1QxNToxNzo0NyswODowMIu/JeMAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTItMDUtMDhUMTY6MjU6NDMrMDg6MDCbVEygAAAATXRFWHRzb2Z0d2FyZQBJbWFnZU1hZ2ljayA3LjAuMS02IFExNiB4ODZfNjQgMjAxNi0wOS0xNyBodHRwOi8vd3d3LmltYWdlbWFnaWNrLm9yZ93ZpU4AAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADUxMo+NU4EAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANTEyHHwD3AAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxMzM2NDY1NTQzfWYZJAAAABJ0RVh0VGh1bWI6OlNpemUAMTYuOUtCML+chwAAAF90RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2hvbWUvd3d3cm9vdC9zaXRlL3d3dy5lYXN5aWNvbi5uZXQvY2RuLWltZy5lYXN5aWNvbi5jbi9zcmMvMTA2NjIvMTA2NjI1NC5wbme2gbXWAAAAAElFTkSuQmCC"></a></td>');
            }
        });
        return;
    }
    // 在表单中添加一行，用于本脚本和用户交互
    $('#compose>table tr:eq(1)').after('<tr><td class="rowhead nowrap">种子信息克隆</td><td style="text-align:left"><input type="text" class="clone_skip" style="text-align:start;width:140px;" id="clone_from"><button style="width:60px;" id="clone_btn">克隆</button>&nbsp;&nbsp;&nbsp;&nbsp;<span id="clone_info">要克隆的种子编号或者链接</span></td></tr><tr hidden="true" id="seedfilename"><td class="rowhead nowrap">种子文件名</td><td style="text-align:left"><input type="text" class="clone_skip" style="text-align:start;width:650px;" id="uploadseedname"></td></tr>');

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

    function leapyear(year) {
        return (((year % 400 === 0) || (year % 100 !== 0)) && (year % 4 === 0));
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


    // 需要单独填写或者不需要填写的input
    $('input[name=small_descr]').addClass('clone_skip');
    $('input[name=url]').addClass('clone_skip');
    $('input[name=dburl]').addClass('clone_skip');

    // 点击克隆按钮
    $('#clone_btn').click(function() {
        // 获取要克隆的种子编号
        var from = $('#clone_from').val().trim();
        var info = $('#clone_info');
        var match = from.match(/id=(\d+)/);
        if (match !== null) {
            from = match[1];
        }
        if (/^\d+$/.test(from)) {
            // 如果输入了有效的编号，开始读取对应的种子页面
            info.text('正在读取');
            $.get('details.php?id=' + from + '&hit=1', function(resp) {
                info.text('正在分析');
                var title = resp.match(/<title[^>]*>[\s\S]*<\/title>/gi)[0];
                var body = resp.match(/<body[^>]*>[\s\S]*<\/body>/gi)[0];
                var page = $(body); // 构造 jQuery 对象
                var match = title.match(/种子详情 &quot;(.*)&quot; - Powered/);
                if (!match) {
                    info.text('失败，可能由于种子不存在或者网络问题');
                    return;
                }

                // 利用种子标题中的信息填写表单
                title = $('<textarea />').html(title).text(); // 处理HTML entity
                // 将标题中的字段拆开
                var fields = title.match(/\[[^\]]*\]/g);

                if (fields[0].match(/\d{4}-\d{2}-\d{2}/)) {
                    var dayofmonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    var year = fields[0].substring(1, 5);
                    var month = fields[0].substring(6, 8);
                    var day = fields[0].substring(9, 11);
                    if (leapyear(parseInt(year))) {
                        dayofmonths[1] += 1;
                    }
                    var monthadd = parseInt((parseInt(day) + 7) / dayofmonths[parseInt(month) - 1]);
                    day = numatostring2((parseInt(day) + 7) % dayofmonths[parseInt(month) - 1]);
                    var yearadd = 0;
                    if ((parseInt(month) + monthadd) > 12) {
                        yearadd = 1;
                        month = numatostring2((parseInt(month) + monthadd) % 12);
                    }
                    year = parseInt(year) + yearadd;
                    fields[0] = year + "-" + month + "-" + day;
                }

                for (var i = 0; i < fields.length; ++i) {
                    fields[i] = fields[i].replace(/^\[|\]$/g, '');
                    var tv_name = fields[i].match(/[\s\.][ES][P]{0,1}\d{2}[-\w]*\d{0,2}[\s\.]/);
                    if (tv_name) {
                        var tv_season = tvseasonhandle(tv_name[0]);
                        fields[i] = fields[i].replace(/[\s\.][ES][P]{0,1}\d{2}[-\w]*\d{0,2}[\s\.]/, tv_season);
                        fields[i + 1] = tvseasonhandle(fields[i + 1]);
                    }
                }
                var type = location.href.substring(33);
                if (type == "404") {
                    var aaa = fields[4].match(/\d+/g);
                    var bbb = fields[4].match(/\D+/g);
                    if (aaa && aaa.length == 1) {
                        fields[4] = numatostring2(parseInt(aaa[0]) + 1);
                        if (bbb)
                            fields[4] = fields[4] + " ";
                    }
                    if (aaa && aaa.length == 2) {
                        if (bbb && bbb[0] == "/") {
                            aaa[0] = numatostring2(parseInt(aaa[0]) + 1);
                            aaa[1] = numatostring2(parseInt(aaa[1]) + 1);
                            fields[4] = aaa[0] + bbb[0] + aaa[1];
                            if (bbb && bbb.length > 1)
                                fields[4] = fields[4] + " ";
                        } else {
                            aaa[0] = numatostring2(parseInt(aaa[1]) + 1);
                            fields[4] = aaa[0];
                        }

                    }
                }
                var next = 0;
                var check_array = true; // 是否需要检查字段取值
                var input_count = $('#compose :text:not(.clone_skip)').length;
                if (input_count == fields.length - 1) {
                    fields.shift(); // 处理二级标题带来的多余字段
                }
                if (input_count == fields.length) {
                    // 如果标题中的字段数和需要填写的字段数一致，则不进行字段取值检查
                    check_array = false;
                }
                $('#compose :text').each(function() {
                    if (next >= fields.length)
                        return;
                    var nextValue = fields[next];
                    var input = $(this);

                    // 判断是否可以填入
                    var fill = true;
                    if (input.hasClass('clone_skip'))
                        fill = false;
                    if (check_array && input.attr('onfocus')) {
                        match = input.attr('onfocus').match(/showselect\("([^"]+)"\)/);
                        if (match) {
                            var arr = eval(match[1] + '_array');
                            if (arr) {
                                if (arr.indexOf(nextValue) < 0) {
                                    fill = false;
                                }
                            }
                        }
                    }
                    if (fill) {
                        input.val(nextValue);
                        ++next;
                    }
                });
                // 填写副标题
                $('input[name=small_descr]').val(page.find('#outer>table tr:eq(1) li').text());
                // 二级类型
                var second_type = page.find('td#outer>table tr:eq(2) td:eq(1)').text();
                if (second_type) {
                    var second_type_match = second_type.match(/二级类型：([\S]+$)/);
                    if (second_type_match) {
                        second_type = second_type_match[1].trim();
                        $("select[name='second_type'] option").each(function() {
                            if ($(this).text() === second_type) {
                                $(this).attr('selected', 'selected');
                            }
                        });
                    }
                }
                // 填写描述
                var descr = page.find('#kdescr');
                // 还原图片链接
                descr.find('img').each(function() {
                    var img = $(this);
                    img.removeAttr('onload');
                    img.removeAttr('pagespeed_url_hash');
                    var src = img.attr('src');
                    src = src.replace(/images\/(\d+x\d+x|x)(.*)\.pagespeed\.ic.*/g, "images/$2");
                    img.attr('src', src);
                });
                descr.find('.byrbt_info_clone').remove();
                CKEDITOR.instances.descr.setData(descr.html());
                // 填写IMDb链接
                var imdb_link = "";
                if (page.find('.imdbRatingPlugin').length) {
                    imdb_link = 'http://www.imdb.com/title/' + page.find('.imdbRatingPlugin').data('title') + '/';
                }
                if (!imdb_link) {
                    var imdb_match = descr.text().match(/(http[\S]{0,2}\/\/www\.imdb\.com\/title\/tt\d+\/?)/);
                    if (imdb_match) {
                        imdb_link = imdb_match[1];
                    }
                }
                $('input[name=url]').val(imdb_link);
                // 填写豆瓣链接
                var douban_link = page.find('.rowhead:contains("豆瓣信息")').next().find('a[href*="://movie.douban.com/subject/"]').text();
                if (!douban_link) {
                    var douban_match = descr.text().match(/(http[\S]{0,2}\/\/movie\.douban\.com\/subject\/\d+\/?)/);
                    if (douban_match) {
                        douban_link = douban_match[1];
                    }
                }
                $('input[name=dburl]').val(douban_link);
                // 设置匿名
                $('input[name=uplver]').prop('checked', SetAnonymous);
                info.text('克隆完成');
            });

        } else {
            alert('请输入有效的种子编号或者链接');
        }
        return false;
    });

    $(document).ready(function() {
        $("input#torrent").bind("change", seedname_copy);
        var match = location.href.match(/#clone_(\d+)#(\d+)/);
        if (match) {
            history.pushState("", document.title, window.location.pathname + window.location.search);
            $('#clone_from').val(match[1]);
            if (match[2])
                $('select[name=second_type]').val(match[2]);
            $('#clone_btn').click();
        }
    });

})(jQuery);