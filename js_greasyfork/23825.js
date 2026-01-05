// ==UserScript==
// @name              清理百度搜索的广告或推广
// @name:en           Remove Baidu Search AD
// @compatible        chrome 49.0.2623.75 + TamperMonkey + 脚本 测试通过
// @author            过去终究是个回忆
// @namespace         https://greasyfork.org/users/49622
// @homepage          http://nopast.51vip.biz:10001/
// @description       清除百度搜索的推广和广告
// @version           1.2.1
// @include           http://www.baidu.com/*
// @include           https://www.baidu.com/*
// @grant             none
// @run-at            document-end
// @include-jquery    true
// @downloadURL https://update.greasyfork.org/scripts/23825/%E6%B8%85%E7%90%86%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%9A%84%E5%B9%BF%E5%91%8A%E6%88%96%E6%8E%A8%E5%B9%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/23825/%E6%B8%85%E7%90%86%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%9A%84%E5%B9%BF%E5%91%8A%E6%88%96%E6%8E%A8%E5%B9%BF.meta.js
// ==/UserScript==
(function (){
    var clearBaiduSearchAD;
    run();
    function run() {
        var finding = null;
        console.log("%c广告清理插件启动...", "color:#FFFFFF;background-color:#00aeef;padding:5px;border-radius:7px;line-height:30px;");
        clearBaiduSearchAD = setInterval(function () {
            if ($('[data-tuiguang*="推广"]').closest('div').length != 0) {
                $('[data-tuiguang*="推广"]').closest('div').empty();
            }
            try {
                find();
            } catch (error) {
            }
        }, 50);

        function find() {
            $(".c-container /deep/ .c-container").remove();
            $("#content_left>div").each(function (){
                if(!$(this).hasClass("result")) $(this).remove();
            });
            if (finding === null) {
                for (var i = 0; i < $('span').length; i++) {
                    if ($('span').eq(i).text()==="广告") {
                        finding = $('span').eq(i);
                    }
                }
            }
            if (finding.parent().attr('id') != "content_left") {
                finding = finding.parent();
            }
            else {
                finding.empty();
                finding=null;
            }
        }

        setTimeout(function () {
            clearInterval(clearBaiduSearchAD);
            console.log("%c清理完毕！", "color:#FFFFFF;background-color:red;padding:5px;border-radius:7px;line-height:30px;");
        }, 10000);
    }
    $('form').keyup(function(event){
        clearInterval(clearBaiduSearchAD);
        run();
    });
    $('form').submit(function(){
        clearInterval(clearBaiduSearchAD);
        run();
    });
    $('#page').click(function (){
        clearInterval(clearBaiduSearchAD);
        run();
    });
})();