// ==UserScript==
// @name         MT Info Clone
// @namespace    name_mt
// @author       sx742055963
// @description  MT PT种子信息克隆
// @grant        none
// @include      http://pt.nwsuaf6.edu.cn/upload.php*
// @include      http://pt.nwsuaf6.edu.cn/torrents.php*
// @icon         http://pt.nwsuaf6.edu.cn/banner/banner.png
// @version      20170610
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/25581/MT%20Info%20Clone.user.js
// @updateURL https://update.greasyfork.org/scripts/25581/MT%20Info%20Clone.meta.js
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
    var UserNameFontStyle = "normal"; //字体风格[italic,normal,oblique,...]
    var UserNameFontSize = "1.2em"; //字体大小[18px,1.2em,...]

    var SetAnonymous = false; //设置匿名[true,false]
    //-------------------------------end--------------------------------

    if ($('table.torrents').length) {
        $('table.torrents td.colhead:eq(' + CloneButtonPosition + ')').after('<td class="colhead">' + TitleOfCloneButton + '</td>');
        var usrid = $('a.UltimateUser_Name').attr('href').match(/id=(\d+)/)[1];
        $('table.torrents tr:gt(0)').each(function() {
            var tr = $(this);
            if (tr.find('table.torrentname').length) {
                if (tr.find('td:last span.nowrap a:first').length) {
                    var seedid = tr.find('td:last span.nowrap a:first').attr('href').match(/id=(\d+)/)[1];
                    if (SetUserNameOutstanding && seedid == usrid) {
                        tr.find('td:last span.nowrap a:first b').css({
                            "color": UserNameColor,
                            "font-weight": UserNameWeight,
                            "font-style": UserNameFontStyle,
                            "font-size": UserNameFontSize
                        });
                    }
                }
                var id = tr.find('table.torrentname a:first').attr('href').match(/id=(\d+)/)[1];
                tr.find('td:eq(' + CloneButtonPosition + ')').after('<td class="rowfollow"><a title="点击克隆种子信息" target="_blank" href="/upload.php#clone_' + id + '"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH3AUIEBkrj+YiQwAAAxtJREFUSMellc1rXGUUxn/nPee8d2aaJpOYmqSV1lTciOJGKJSCCK7dFXQhuHMvdeXSpXtxmb+gS0Eh0p0gUsVWEZWkMeAHCcHGNGYmc+9xMZ/pJM4U7+rycu95zvN7zr1HADbfucL/vVbXtk49l9HiEiUgDUCmqBmBtBAp/0vERu6fBrkVotdCSJOqSwBRbQp89Nujzr1moWMkVte2hgIS1bsHzavv71y8TiSbVB+A5u79G3N/3L1w2O68t+BVO1WJEHkI7IZ0BfuVEvDS/tLL/PXsqxDl5OqiVOcW0N/vvb5bxvq81yvNipZHO1J1PpSoboekgYAAkszJrl37kwIQxd1oa902Ll5fqZ57geb58zR3719a3vzsA4n2HWBvwCIANSUXDpVO4SBhZpCU48Yi7fnLtJvzHFii2r5zIbWOZhHdOwFbVfGckWoyokgJcwMBs0R2JbvhriBDBjbsH0yVnB1i4hCBKOZGiGCquDs5Z9ysO+NxQqDnwJRcZJjCAZJwM44R1AzPjheOuTP6GZ2CyKGawkHqOuhItzHPTs4+wDYuEIFaIucpHaSEuoEIZkNE5j1EfeyPO0jFlA5EEXdEZODAs6PuINKPYFxAngARvUBNuxnkIpN8Qsj2BIiih0it+9F5dqR3dmbIOTsxpYPK7QSinB3c6Iw8NubAiwxlZyqBjnUFzIaIKndKYSyDAEJFyPUalFMgUgVLQPQQdUMu3WghPDZFUkXE963v1m/6U8uI5e6pCPQfjpE/oAhE0Prmc/6WOtRmKIpMzpmOOyJQRffN4T5Q+6T189ezrY1vr4lIAmK/XV5taX1Z5xY5bck90gYbV15jeeUZZptz5HqNoEOUZfQ33WgGf0LcojxuBMhSPZXrDw7f0nP2cTEzV4jlIdgBV2Ph4QMu/XRIufcVB6q0frlLHB18Kcl26Ld12tLfO6rYOaqKRqpuWuKGwNg/XICaCg0DGxr8VczWCLYROXu5f/rGCkmETgRfbP/D2g/71O3k+NYMXlmq8ebzM7y4WIyKnGjizOvHty8PRuzMYRKwdHqnq2tb/AtfUe1KQr9mZwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNi0wOS0xN1QxNToxNzo0NyswODowMIu/JeMAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTItMDUtMDhUMTY6MjU6NDMrMDg6MDCbVEygAAAATXRFWHRzb2Z0d2FyZQBJbWFnZU1hZ2ljayA3LjAuMS02IFExNiB4ODZfNjQgMjAxNi0wOS0xNyBodHRwOi8vd3d3LmltYWdlbWFnaWNrLm9yZ93ZpU4AAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADUxMo+NU4EAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANTEyHHwD3AAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxMzM2NDY1NTQzfWYZJAAAABJ0RVh0VGh1bWI6OlNpemUAMTYuOUtCML+chwAAAF90RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2hvbWUvd3d3cm9vdC9zaXRlL3d3dy5lYXN5aWNvbi5uZXQvY2RuLWltZy5lYXN5aWNvbi5jbi9zcmMvMTA2NjIvMTA2NjI1NC5wbme2gbXWAAAAAElFTkSuQmCC"></a></td>');
            }
        });
        return;
    }

    $("form#compose tr:eq(3)").after('<tr id="seedfilename" hidden="true"><td class="rowhead nowrap" valign="top" align="right">种子文件名称</td><td class="rowfollow" valign="top" align="left"><input type="text" style="width: 650px;" id="uploadseedname"/></td></tr>');

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

    function citeTorrent_new() {
        var seedLink = $("#cite_torrent").val();
        match = seedLink.match(/id=(\d+)/);
        if (match) {
            $("#cite_torrent").val(match[1]);
            citeTorrent();
        } else
            citeTorrent();
    }


    $(document).ready(function() {
        $("input#torrent").bind("change", seedname_copy);
        var match = location.href.match(/#clone_(\d+)/);
        if (match) {
            history.pushState("", document.title, window.location.pathname + window.location.search);
            $('#cite_torrent').val(match[1]);
            $('#cite_torrent_btn').click();
            $('input[name=uplver]').attr('checked', SetAnonymous);
        } else {
            $("#cite_torrent_btn").click(function() {
                citeTorrent_new();
            });
        }
    });
})(jQuery);