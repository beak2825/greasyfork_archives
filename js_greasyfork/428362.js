// ==UserScript==
// @name         百问不倒
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  百问不倒的自动完成脚本，由吴大师编写，最后请自己点提交
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @author       吴大师(wxj)
// @match        https://study.yjt.zj.gov.cn*
// @icon         https://zjjcmspublic.oss-cn-hangzhou-zwynet-d01-a.internet.cloud.zj.gov.cn/jcms_files/jcms1/web3417/site/picture/0/2104051430331385705.png
// @downloadURL https://update.greasyfork.org/scripts/428362/%E7%99%BE%E9%97%AE%E4%B8%8D%E5%80%92.user.js
// @updateURL https://update.greasyfork.org/scripts/428362/%E7%99%BE%E9%97%AE%E4%B8%8D%E5%80%92.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var jdata;
    XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
    var newSend = function(vData) {
        var xhr = this;
        this.realSend(vData);
        var onload = function( ) {
            if (vData.indexOf("paper_id=") >= 0 && xhr.responseText.indexOf("correct") > 0)
            {
                jdata=JSON.parse(xhr.responseText);
            }
        }
        xhr.addEventListener("load", onload, false);
    };
    XMLHttpRequest.prototype.send = newSend;
    setInterval(function(){
        if ($('.btmbar').length > 0 && $('.item.checked').length == 0){
            var tindex=Number($('.btmbar').html().substring(0,2).trim());
            tindex = tindex - 1
            var titems=$('.item ').length;
            var ret1 = "";
            var ku = ["A", "B", "C", "D", "E"];
            for (var i = 0; i < titems; i++) {
                var correct = Number(jdata.data[tindex].options[i].correct);
                if (correct == 1) {
                    ret1 = ret1 + ku[jdata.data[tindex].options[i].idx - 1];
                    if (tindex < 60) {
                        $('.item ')[i].click();
                    }
                }
            }
            if (ret1.length > 1 && tindex < 59){
                $('.next')[0].click();
            }
        }
        if ($('.btmbar').length > 0 && $('.am-modal-body').length > 0 && $('#niubi').length <= 0){
            var text1 = "<div id=\"niubi\" style=\"font-weight:bold;color:red;\">吴大师出品，必属精品！</div>"
            $('.am-modal-body').append(text1);
        }
    },500)
})();