// ==UserScript==
// @name         在线音频编辑器增强插件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  支持c键打开导出片段对话框；x键快速导出片段；增加了菜单”名称“，可以设置导出片段的文件命名
// @author       Wilson
// @match        http://tool.mkblog.cn/audiomass/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mkblog.cn
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.min.js
// @require      https://greasyfork.org/scripts/412875-waituntil/code/WaitUntil.js?version=856255
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462255/%E5%9C%A8%E7%BA%BF%E9%9F%B3%E9%A2%91%E7%BC%96%E8%BE%91%E5%99%A8%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/462255/%E5%9C%A8%E7%BA%BF%E9%9F%B3%E9%A2%91%E7%BC%96%E8%BE%91%E5%99%A8%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var defNames = JSON.parse(localStorage.getItem("_dfnames")) || [];
    var names = JSON.parse(JSON.stringify(defNames));
    $(function(){
        $(".pk_hdr").append('<div class="pk_btn pk_noselect"><button id="menuName">名称</button></div>');
        $("#menuName").on("click", function(){
            var def = names.length > 0 ? names.join(" ") : (defNames >0 ? defNames.join(" ") : "1 3 4 5 6 7 8 9 10 11 12 13 14 15");
            var ret = prompt("请输入您导出片段的文件名，def前缀为设置默认值", def);
            if(ret) {
                var isDef = ret.indexOf("def") !== -1;
                ret = ret.replace("def", "").replace(/^\s+|\s+$/g, "");
                names = ret.split(/\s+/);
                if(isDef) {
                    localStorage.setItem("_dfnames", JSON.stringify(names));
                }
            }
        });

        var count = 0;
        $(document).keyup(function(e) {
            if (e.keyCode == 88 || e.keyCode == 67) {
                $("button[data-id='dl']").click();
                WaitUntil(function(){return $(".pk_txt").length>0}, function(){
                    if(names.length == 0 && defNames.length > 0) names = JSON.parse(JSON.stringify(defNames));
                    var name = names.length > 0 ? names.shift() : count++;
                    $(".pk_txt").val(name + ".mp3");
                    $("#k5").prop("checked", true);
                });
                if(e.keyCode == 88) {
                    setTimeout(function(){
                        $(".pk_modal_a_accpt").click();
                    }, 150);
                }
            }
        });
    });

})();