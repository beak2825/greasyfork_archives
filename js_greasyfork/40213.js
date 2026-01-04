// ==UserScript==
// @name            快速复制Pixiv ID
// @name:en         Fast copy Pixiv ID
// @name:ja         急速にコピーPixiv ID
// @description     对图片或链接双击右键（或按Alt和右键）即可复制Pixiv作品ID
// @description:en  Double click the right button (or press Alt + right button) on the picture or link, and you can copy the Pixiv work ID.
// @description:ja  画像またはリンク上で右キー(または、alt及び右ボタン)をダブルクリックして、pixiv作品idをコピーすることができる。
// @version         1.25
// @namespace       https://github.com/VMatrices
// @author          VMatrices
// @include         *://www.pixiv.net/*
// @include         *://www.pixivision.net/*
// @include         *://saucenao.com/*
// @include         *://iqdb.org/*
// @icon            https://www.pixiv.net/favicon.ico
// @grant           GM_setClipboard
// @grant           GM_notification
// @downloadURL https://update.greasyfork.org/scripts/40213/%E5%BF%AB%E9%80%9F%E5%A4%8D%E5%88%B6Pixiv%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/40213/%E5%BF%AB%E9%80%9F%E5%A4%8D%E5%88%B6Pixiv%20ID.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var match_rules=[
        /([_=:;&\-\/\.\?\d\w]+?illust_id=(\d+)(?:&|$|))/i ,
        /(http(?:s|):\/\/[_\-\/\.\d\w]+?\/(\d{4,})_p\d{1,4}[_\-\/\.\d\w]*)/i
    ];
    var preTime=0,
        preElemnt=null,
        baseURL=document.URL.match(/(.+)\//)[1],
        isEdge=navigator.userAgent.indexOf("Edge")>0;

    window.addEventListener('contextmenu',function (event) {
        var el = event.target;
        if (el != null) {
            var nowTime=new Date().getTime();
            if((nowTime-preTime<500&&preElemnt==el)||event.altKey){
                var url,pid;
                var HTML=el.outerHTML;
                for(var i in match_rules){
                    var results=HTML.match(match_rules[i]);
                    if(results!=null&&results.length>1){
                        url=results[1];
                        pid=results[2];
                        break;
                    }
                }
                if(pid!=null){
                    if(url.indexOf("http")<0){
                        url=baseURL+url;
                    }
                    console.log("PID:",pid,"URL:",url);
                    var imgMatch=el.outerHTML.match(/http(?:s|):\/\/i\.pximg\.net\/\w\/[\w\d_]+?\/img-master\/img\/((?:\d+\/){6,}\d{3,}_p\d+)_\w+\d{3,}\.(?:jpg|png)/);
                    var img=imgMatch!=null?"https://i.pximg.net/c/250x250_80_a2/img-master/img/"+imgMatch[1]+"_square1200.jpg":"https://www.pixiv.net/favicon.ico";
                    GM_setClipboard(pid);
                    if(isEdge){
                        prompt('Pixiv illust ID: '+pid,pid);
                    } else GM_notification({
                        title:'Illust ID: '+pid,
                        text:'https://www.pixiv.net/member_illust.php?mode=medium&illust_id='+pid,
                        image:img,
                        timeout: 5000
                    });
                    event.preventDefault();
                    return false;
                }
            }
            preTime=nowTime;
            preElemnt=el;
        }
    });

})();