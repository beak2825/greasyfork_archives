// ==UserScript==
// @name         NPU Info Clone
// @namespace    name_npu
// @author       sx742055963
// @description  NPU PT种子信息克隆
// @grant        none
// @include      http://npupt.com/torrents.php*
// @include      http://npupt.com/upload.php*
// @version      20161112
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/25050/NPU%20Info%20Clone.user.js
// @updateURL https://update.greasyfork.org/scripts/25050/NPU%20Info%20Clone.meta.js
// ==/UserScript==

(function($) {

    if ($('table#torrents_table').length) {
        $('table#torrents_table tr:gt(0)').each(function() {
            var tr = $(this);
            if (tr.find('td:first img').length) {
                var tr_img = tr.find('td:first img:first');
                var seedid = tr.find('td:eq(1) table.torrentname tr:first td:first a:first').attr("href");
                var link = "http://npupt.com/upload.php#clone_" + seedid;
                tr_img.click(function() {
                    window.open(link);
                });
            }
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

            var tv_name = title.match(/[\s\.][ES][P]{0,1}\d{2}[-\w]*\d{0,2}[\s\.]/);
            if (tv_name) {
                var tv_season = tvseasonhandle(tv_name[0]);
                title = title.replace(/[\s\.][ES][P]{0,1}\d{2}[-\w]*\d{0,2}[\s\.]/, tv_season);
                $("input#name").val(title);
            }
            var smalltitle = $("input[name='small_descr']").val();
            if (smalltitle) {
                smalltitle = tvseasonhandle(smalltitle);
                $("input[name='small_descr']").val(smalltitle);
            }
        }
    }
    var dection;

    function dellwith() {
        $('#transfer_btn').click();
        dection = setInterval(autoadd, 500);
    }

    $(document).ready(function() {
        // var match = location.href.match(/#clone_(\d+)/);
        var match = location.href.match(/id=(\d+)/);
        if (match) {
            var trans_url = "http://npupt.com/details.php?id=" + match[1];
            $("input[name='transferred_url']").val(trans_url);
            history.pushState("", document.title, window.location.pathname);
            dellwith();
        }
    });

})(jQuery);
