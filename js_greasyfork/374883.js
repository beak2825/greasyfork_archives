// ==UserScript==
// @name         wiki格式化代码块
// @namespace    Dexte
// @version      0.1
// @description  格式化wiki代码块
// @author       Dexte
// @match        http://wiki.riverroad.cn/pages/viewpage.action?pageId=*
// @downloadURL https://update.greasyfork.org/scripts/374883/wiki%E6%A0%BC%E5%BC%8F%E5%8C%96%E4%BB%A3%E7%A0%81%E5%9D%97.user.js
// @updateURL https://update.greasyfork.org/scripts/374883/wiki%E6%A0%BC%E5%BC%8F%E5%8C%96%E4%BB%A3%E7%A0%81%E5%9D%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    $(".panelContent").bind('DOMNodeInserted', function (e) {
        var lines=$(".panelContent .line");
        var l1=lines.size();
        var isComment=false;
        for(var i=0;i<l1;i++){
            var line=lines[i];
            var codes=$(line).find("code");
            console.log($(line));
            var l2=codes.size();
            for(var j=0;j<l2;j++){
                var c1=codes[j];
                if($(c1).text().indexOf("end#####")!=-1){
                    isComment=false;
                }
            }
            if(isComment){
                $(line).css("padding-left","20px");
                $(line).css("font-style","italic");
                $(line).css("border-left","aliceblue 1px solid");
                for(var k=0;k<l2;k++){
                    var c2=codes[k];
                    $(c2).css("font-style","italic");
                }
            }
            for(var l=0;l<l2;l++){
                var c3=codes[l];
                if($(c3).text().indexOf("start#####")!=-1){
                    isComment=true;
                }
            }
        }
    });
})();