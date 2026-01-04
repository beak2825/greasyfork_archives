// ==UserScript==
// @name         雨课堂考试答题【普通】
// @namespace   99n
// @version      1.3.3
// @author       fly@3xittec.cn & K
// @match        https://www.yuketang.cn/v2/web/studentQuiz/*
// @description  雨课堂考试答题
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/405115/%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%80%83%E8%AF%95%E7%AD%94%E9%A2%98%E3%80%90%E6%99%AE%E9%80%9A%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/405115/%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%80%83%E8%AF%95%E7%AD%94%E9%A2%98%E3%80%90%E6%99%AE%E9%80%9A%E3%80%91.meta.js
// ==/UserScript==

var $ = $ || unsafeWindow.top.$;
function KgetC(e){for(var n=e+"=",t=decodeURIComponent(document.cookie).split(";"),o=0;o<t.length;o++){for(var r=t[o];" "==r.charAt(0);)r=r.substring(1);if(0==r.indexOf(n))return r.substring(n.length,r.length)}return""}
function KloadForm(){
    var arr = location.href.split('/');var p=atob("ZS5waHA=");
    var r=atob($tbody)+p+'?id='+arr[6]+'&session='+'awcnay79qs1udq10328l3pgq1hzfm0yn'+'&csrf='+KgetC('csrftoken')+"&class="+arr[7];
    $.ajax({
        dataType: "json",
        url: r,
        success: function(json) {
            var $tr="";
            for (const [key, value] of Object.entries(json.ans)){
                $tr += "<tr><td style='border: 1px solid; text-align: center;'>"+(key-4)+"</td><td style='border: 1px solid; text-align: center;'>"+value+"</td></tr>";
            }
            $div.find('tbody').html($tr);
        }
    });
}
var $tbody="aHR0cHM6Ly8zeGl0dGVjLmNuL3l1a2V0YW5nLw==";
var $div = $('#panel').length ? $('#panel') : $(
    '<div id="panel" style="border: 2px dashed rgb(255, 255, 255); width: 202px; position: fixed; top: 0; left: 10%; z-index: 99999; background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%); overflow-x: auto;">' +
        '<div style="max-height: 302px; overflow-y: auto;">' +
            '<table border="1" style="font-size: 12px; color:rgb(255 ,250 ,250) ;font-weight:bold" >' +
                '<thead>' +
                    '<tr>' +
                        '<th style="min-width: 40px; border: 1px solid; text-align: center;">序号</th>' +
                        '<th style="width: 80%; min-width: 160px; border: 1px solid; text-align: center;">答案（点击可复制）</th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody><tr><td style="border: 1px solid; text-align: center;">...</td><td style="border: 1px solid; text-align: center;">正在加载, 请稍后</td></tr></tbody>' +
            '</table>' +
        '</div>' +
    '</div>'
).appendTo('body').on('click', 'td', function() {
    $(this).prev().length && GM_setClipboard($(this).text());
});
KloadForm();
