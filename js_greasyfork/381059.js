// ==UserScript==
// @name         Bt磁力电驴迅雷双击复制
// @namespace    https://github.com/hahacium
// @version      0.5.1
// @description  识别任意BT网站的磁力链接、电驴链接、迅雷下载链接，双击当前页面即可快速复制[hahacium（GitHub）]
// @author       hahacium（GitHub）
// @include      *
// @downloadURL https://update.greasyfork.org/scripts/381059/Bt%E7%A3%81%E5%8A%9B%E7%94%B5%E9%A9%B4%E8%BF%85%E9%9B%B7%E5%8F%8C%E5%87%BB%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/381059/Bt%E7%A3%81%E5%8A%9B%E7%94%B5%E9%A9%B4%E8%BF%85%E9%9B%B7%E5%8F%8C%E5%87%BB%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
     'use strict';
      var cli=document.getElementsByTagName("a");
      var urlmag=/^magnet:\?xt=urn:btih:.*$/;
      var urled2k=/^ed2k:.*$/;
      var urlthunder=/^thunder:.*$/;
      var dbclick=function (){
        for(var i=0;i<cli.length;i++){
            var ok=cli[i].getAttribute("href");
            if(urlmag.test(ok)||urled2k.test(ok)||urlthunder.test(ok))
            {
                var input = document.createElement('input');
                input.setAttribute('value', ok);
                document.body.appendChild(input);
                input.select();
                if (document.execCommand("copy")) {
                    document.execCommand("copy");
                }
                input.style.cssText="display: none;";
                var div = document.createElement('div');
                div.style.cssText="width:0px;height:40px;color:#fff;background-color:#12709e;font-size:17px;text-align:center;transition:width .2s,height .2s,transform .2s;border-radius:5px;position:fixed;top:20%;right:0;display:flex;justify-content:center;align-items:center;";
                div.innerHTML='<span style="height:60%;overflow:hidden">复制成功</span>';
                document.body.appendChild(div);
                setTimeout( function(){
                    div.style.cssText+="width: 120px;";
                }, 10 );
                setTimeout( function(){
                    div.style.cssText+="width: 0px;";
                }, 1000 );
                break;
            }
        }
     }
    document.ondblclick=dbclick;
})();