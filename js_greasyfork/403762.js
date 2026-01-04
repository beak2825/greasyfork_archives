// ==UserScript==
// @name         Spring4u Content Center
// @namespace       [url=mailto:wt@qkzy.net]mailto:wt@qkzy.net[/url]
// @require        http://ajax.aspnetcdn.com/ajax/jQuery/jQuery-1.7.2.js
// @version      0.5
// @description  Beautify Spring4u Content
// @author       AozoraWings
// @run-at       document-end
// @match        http://spring4u.info/viewthread.php?tid=*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/403762/Spring4u%20Content%20Center.user.js
// @updateURL https://update.greasyfork.org/scripts/403762/Spring4u%20Content%20Center.meta.js
// ==/UserScript==

(function() {
    'use strict';
        function splitContent (text) { // 有些章节整个都集中在一起，没有分段，这个函数用于简易分段
        if (text.indexOf('。') == -1) {
            return [text];
        }

        var hasMark = false,
            lines = [],
            charCotainer = [];

        text.split('').forEach(function(c) {
            charCotainer.push(c);

            if (c == '“') {
                hasMark = true;
            } else if (c == '”') {
                hasMark = false;
            } else if (c == '。' && !hasMark) {
                lines.push(charCotainer.join(''));
                charCotainer = [];
            }
        });

        return lines;
    }
    var regPos = /^\d+(\.\d+)?$/;
    var wdth_save=regPos.test(GM_getValue('set_long') ) === true ?GM_getValue('set_long'):700;
    var box_status=GM_getValue('set_box') === true ?true:false;

    window.addEventListener('load', (event) => {
        var content_num=$("body > center > form:nth-child(5) > div").size();
        for(var i=2 ;i <= content_num ;i++)
        {
       $("body > center > form:nth-child(5) > div:nth-child("+i+") > table > tbody > tr:nth-child(2) > td:nth-child(2) > table").css("width",wdth_save+"px");
       $("body > center > form:nth-child(5) > div:nth-child("+i+") > table > tbody > tr:nth-child(2) > td:nth-child(2) > table").css("margin","auto");
            if(i === 2)
            {
       $("body > center > form:nth-child(5) > div:nth-child("+i+") > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td > span:nth-child(5)").css("font-size","22px");
            }
            else{
       $("body > center > form:nth-child(5) > div:nth-child("+i+") > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td > span").css("font-size","22px");
            }
       $("body > center > form:nth-child(5) > div:nth-child("+i+") > table > tbody > tr:nth-child(2) > td:nth-child(2) > table").css("top","0");
       $("body > center > form:nth-child(5) > div:nth-child("+i+") > table > tbody > tr:nth-child(2) > td:nth-child(2) > table").css("left","0");
       $("body > center > form:nth-child(5) > div:nth-child("+i+") > table > tbody > tr:nth-child(2) > td:nth-child(2) > table").css("bottom","0");
       $("body > center > form:nth-child(5) > div:nth-child("+i+") > table > tbody > tr:nth-child(2) > td:nth-child(2) > table").css("right","0");
        }
        if(box_status === true)
        {
       var content=$("body > center > form:nth-child(5) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td > span:nth-child(5)");
                        var $p = content.find('p'),
                $newP;
            if ($p.length == 0 ) {
                $newP = content;
            } else if ($p.length == 1) {
                $newP = $p;
            }

            if ($newP) {
                $newP.replaceWith('<p>' + splitContent($newP.html()).join('</p>\n<p>') + '</p>');
            }
       $("body > center > form:nth-child(5) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td").css("font-size","22px");
        }
            var table_dom = document.createElement("table");
            table_dom.setAttribute("border","0");
            var td_dom = document.createElement("td");
            var td2_dom = document.createElement("td");
            var td3_dom = document.createElement("td");
            var td4_dom = document.createElement("td");
            var tr_dom = document.createElement("tr");
            var tr1_dom = document.createElement("tr");
                var range_dom_div = document.createElement("div");
                var show_num = document.createElement("p");
                var range_dom = document.createElement("INPUT");
            var check_box = document.createElement("INPUT");
            var check_box_html = document.createElement("p");
            check_box.setAttribute("type","checkbox");
            check_box.setAttribute("id","check_box");
            range_dom.setAttribute("type","range");
            range_dom.setAttribute("id","range_add");
            range_dom.setAttribute("min","500");
            range_dom.setAttribute("max","2000");
            show_num.setAttribute("id","show_num_wd");
            check_box_html.innerHTML="是否開啓强制換行（將以中文結尾符號進行强制段落分割）";
            show_num.innerHTML="页面宽度 当前设置为："+wdth_save+"px";
            $("body > table").append(range_dom_div);
             $("body > table>div").append(table_dom);
             $("body > table>div>table").append(tr_dom);
             $("body > table > div > table > tbody").append(tr1_dom);
             $("body > table > div > table > tbody > tr").append(td_dom);
            $("body > table > div > table > tbody > tr:nth-child(1)>td:nth-child(1)").append(range_dom);
            $("body > table > div > table > tbody > tr:nth-child(1)").append(td4_dom);
             $("body > table > div > table > tbody > tr").append(td2_dom);
            $("body > table > div > table > tbody > tr:nth-child(2)").append(td3_dom);
           // $("body > table>div").append(range_dom);
                    var watch_wd = $("#range_add");
            watch_wd.val(wdth_save);
            $("body > table > div > table > tbody > tr:nth-child(2) > td:nth-child(1)").append(show_num);
           $("#range_add").css("text-align","center");
                var set_save = document.createElement("a");
            set_save.setAttribute("href","javascript:void(0)");
            set_save.setAttribute("id","save_set");
            set_save.innerHTML="点击此保存设置";
            $("body > table > div > table > tbody > tr:nth-child(1)>td:nth-child(2)").css("width","200px");
            $("body > table > div > table > tbody > tr:nth-child(1)>td:nth-child(2)").append(check_box);
            $("body > table > div > table > tbody > tr:nth-child(1)>td:nth-child(2)").append(check_box_html);
            $("body > table > div > table > tbody > tr:nth-child(1)>td:nth-child(3)").append(set_save);
            var watch_box = $("#check_box");
            watch_box[0].checked=box_status;
            $("#save_set").hide();
                var save_click=$("#save_set");
     $("#range_add").css("width","300px");
     $("#range_add").css("margin","auto");
     $("#range_add").css("top","0");
     $("#range_add").css("left","0");
     $("#range_add").css("bottom","0");
     $("#range_add").css("right","0");
            watch_wd.bind('change', function(e) {
                $("#show_num_wd").html("页面宽度 已修改为："+ watch_wd[0].value +"(未提交)");
       $("body > center > form:nth-child(5) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2) > table").css("width", watch_wd[0].value+"px");
            $("#save_set").show();
            });
            watch_box.bind('change', function(e) {
            $("#save_set").show();
            });
                    save_click.bind('click', function(e) {
                        GM_setValue('set_long', watch_wd[0].value);
                        GM_setValue('set_box', watch_box[0].checked);
                $("#show_num_wd").html("页面宽度 已修改为："+ watch_wd[0].value);
            $("#save_set").hide();
            });
            });
})();