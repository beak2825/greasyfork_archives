// ==UserScript==
// @name         NanYang Info Clone
// @namespace    name_ny
// @author       sx742055963
// @description  NanYnag PT种子信息克隆
// @grant        none
// @include      https://nanyangpt.com/torrents.php*
// @include      https://nanyangpt.com/upload.php*
// @version      20161211
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/25582/NanYang%20Info%20Clone.user.js
// @updateURL https://update.greasyfork.org/scripts/25582/NanYang%20Info%20Clone.meta.js
// ==/UserScript==

(function($) {

    if ($('table.torrents').length) {
        $('table.torrents tr:gt(0)').each(function() {
            var tr = $(this);
            var tdnum = tr.find('td').length;
            var td1 = tdnum - 6;
            var td2 = tdnum - 4;
            var td3 = tdnum - 5;
            var tr_img = tr.find("td:eq(" + td1 + ")");
            var seedid = tr.find("td:eq(" + td2 + ") a:first").attr("href");
            if (!seedid) {
                seedid = tr.find("td:eq(" + td3 + ") a:first").attr("href");
            }
            var link = "https://nanyangpt.com/upload.php#clone_" + seedid;
            tr_img.click(function() {
                window.open(link);
            });
        });
        return;
    }
    //AutoAdd处理部分内容
    function numatostring2(num) {
        var res = 0;
        res = num;
        if (res < 10)
            return "0" + res;
        return res.toString();
    }

    function leapyear(year) {
        if (((year % 400 === 0) || (year % 100 !== 0)) && (year % 4 === 0))
            return true;
        else
            return false;
    }

    function tvseasonhandle(str) {
        if (str.match(/\[\d+[Pp]\]/)) {
            return str;
        }
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
            else if (bbbtv && bbbtv.length == 3) {
                str = bbbtv[0] + aaatv[0] + bbbtv[1] + aaatv[1] + bbbtv[2];
            }

        }
        return str;
    }

    function autoadd() {
        var title = $("input#name").val();
        if (title) {
            clearInterval(dection);
            var fields = title.match(/\[[^\]]*\]/g);

            if (fields[0].match(/20\d{6}/)) {
                var dayofmonths = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
                var year = fields[0].substring(1, 5);
                var month = fields[0].substring(5, 7);
                var day = fields[0].substring(7, 9);
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
                fields[0] = "[" + year + month + day + "]";
            }

            var newtitle = "";
            for (var i = 0; i < fields.length; ++i) {
                var tv_name = fields[i].match(/[ES][P]{0,1}\d{2}[-\w]*\d{0,2}/);
                if (tv_name) {
                    var tv_season = tvseasonhandle(tv_name[0]);
                    fields[i] = fields[i].replace(/[ES][P]{0,1}\d{2}[-\w]*\d{0,2}/, tv_season);
                }
                newtitle = newtitle + fields[i];
            }
            $("input#name").val(newtitle);
            $("input[name='small_descr']").val("");
        }
    }
    var dection;

    function dellwith() {
        citetorrent();
        dection = setInterval(autoadd, 500);
    }

    $(document).ready(function() {
        var match = location.href.match(/id=(\d+)/);
        if (match) {
            var transurl = "https://nanyangpt.com/details.php?id=" + match[1];
            $("input#cite_site").val(transurl);
            history.pushState("", document.title, window.location.pathname);
            dellwith();
        }
    });

})(jQuery);
