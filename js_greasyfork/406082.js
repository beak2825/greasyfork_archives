// ==UserScript==
// @name         知乎截图设置
// @namespace    zhjtsz
// @version      0.11
// @description  设置赞同以及字体大小
// @author       cyf0611
// @match        *://www.zhihu.com/question/*?1
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.js
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/406082/%E7%9F%A5%E4%B9%8E%E6%88%AA%E5%9B%BE%E8%AE%BE%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/406082/%E7%9F%A5%E4%B9%8E%E6%88%AA%E5%9B%BE%E8%AE%BE%E7%BD%AE.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function numFormat(num, type) {
        //type 1 逗号分隔符  2 转化万
        switch(type){
            case 1:
                return (num.toString().indexOf ('.') !== -1) ? num.toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
                break;
            case 2:
                return num > 10000 ? (Number(num)/10000).toFixed(1) + "万" : num;
                break;
        }
    }

    // add menu
    var formTree = '<style>.jtrow{margin:5px 0;}</style><form style="position:fixed;top:0;left:0;background-color:pink;z-index:100;padding:10px;font-size:16px!important;" id="settingForm"><b>默认开启编辑模式，可直接修改文字和图片</b><div class="jtrow">设置赞同数： <input type="number" id="agreeNum"></div> <div class="jtrow">设置评论数： <input type="number" id="discussNum"></div><div class="jtrow">字体放大比例： <input type="number" id="scaleNum" value=1.2></div><button type="button" id="settingBtn" class="Button SearchBar-askButton Button--primary Button--blue">修改</button></form>';
    $("#root").append(formTree);
    $("#settingBtn").on("click", function(){
        var agree_num = $("#agreeNum").val();
        var discuess_num = $("#discussNum").val();
        var scale_num = $("#scaleNum").val() - 0;

        if(agree_num) {
            var votersDom = $(".Voters").eq(0);
            votersDom.text(numFormat(agree_num, 1) + " 人赞同了该回答");
            $(".Button.VoteButton.VoteButton--up").eq(0).text("赞同 " + numFormat(agree_num, 2));
        }



        if(discuess_num) {
            $(".Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel").eq(0).text(numFormat(discuess_num, 1) + " 条评论")
        }

        if(scale_num) {
            $("body").css({"font-size":18*scale_num});
        }

    })
    //开启编辑模式
    $(".Card.AnswerCard").each(function(){
        $(this).attr("contentEditable", "true");
    })
})();