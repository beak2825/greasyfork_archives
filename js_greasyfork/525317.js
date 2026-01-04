// ==UserScript==
// @name         m3u8
// @namespace    https://greasyfork.org/zh-CN/users/235730-jangj001
// @version      0.1
// @description  替换JS网页播放器
// @author       QQ:1073481777
// @include      *
// @grant        none
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525317/m3u8.user.js
// @updateURL https://update.greasyfork.org/scripts/525317/m3u8.meta.js
// ==/UserScript==

(function () {
    globalThis.geturl='';

    function inject(){
        var domStr = `<input type="submit" id="m3u8-jump" value="跳转下载" class="bgs_btn">`
        var div = document.createElement('div')
        div.innerHTML = domStr
        div.style.position = 'fixed'
        div.style.zIndex = '9999'
        div.style.bottom = '20px'
        div.style.right = '20px'
        div.style.textAlign = 'center'
        document.body.appendChild(div);

        var m3u8Jump = document.getElementById('m3u8-jump')
        m3u8Jump.addEventListener('click', function () {
            window.open('https://jx.wujinkk.com/dplayer/?url='+globalThis.geturl);
        })

    }


    var originXHR = window.XMLHttpRequest;
    var stop=false;
    var urls=[];
    function hookAjax() {
        var originOpen = originXHR.prototype.open;
        window.XMLHttpRequest = function () {
            var realXHR = new originXHR();
            realXHR.open = function (method, url) {
                if(!stop){
                    originOpen.call(realXHR, method, url)
                    console.log(url+'\n');
                    if(url.indexOf('.m3u8') > 0){
                        urls.push(url);
                        if(urls.length>0){
                            stop=true;
                            console.log(urls.length+'\n'+urls[urls.length-1]);
                            globalThis.geturl=urls[urls.length-1];

                        }

                    }
                }
            }
            return realXHR
        }
    }
    setInterval(hookAjax(),1000);
    console.log(globalThis.geturl);
    var set=setInterval(()=>{
        if (document.getElementById("m3u8-jump")==null){
            inject();
            console.log(globalThis.geturl);
        }
    },1000);
    setInterval(()=>{if (document.getElementById("m3u8-jump")){ clearInterval(set)}},1000);

})();
