// ==UserScript==
// @name         图集岛VIP
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  图集岛免VIP
// @author       sellry
// @match        *://*.tujidao.com/*
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/439978/%E5%9B%BE%E9%9B%86%E5%B2%9BVIP.user.js
// @updateURL https://update.greasyfork.org/scripts/439978/%E5%9B%BE%E9%9B%86%E5%B2%9BVIP.meta.js
// ==/UserScript==

(function() {
    'use strict';
    [].forEach.call( document.querySelectorAll('div.hezi>ul>li'),imgLiTag=>{
        imgLiTag.querySelector('a').removeAttribute("href");
        imgLiTag.style.cursor='pointer';
        imgLiTag.addEventListener('click',function(){
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.photos({
                    photos:{
                        title: imgLiTag.querySelector('p.biaoti>a').innerText,
                        id: imgLiTag.id,
                        anim: 5,
                        start: 0,
                        data: Array(parseInt(imgLiTag.querySelector('span.shuliang').innerText.replace('P',''))).fill(0).map((item,num)=> {
                            const imgurl=`https:///tjg.gzhuibei.com/a/1/${imgLiTag.id}/${num+1}.jpg`
                            return {"alt": "","pid": num, "src": imgurl,"thumb": imgurl }
                        })
                    }
                });
            });
        });
    })
})();