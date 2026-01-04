// ==UserScript==
// @name         Oracle JDK 免登录下载
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  无需登录即可下载Oracle JDK。若点击无反应，请刷新页面
// @author       You
// @match        https://www.oracle.com/java/technologies/downloads/
// @icon         https://www.oracle.com/a/tech/img/rc10-java-badge-3.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436555/Oracle%20JDK%20%E5%85%8D%E7%99%BB%E5%BD%95%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/436555/Oracle%20JDK%20%E5%85%8D%E7%99%BB%E5%BD%95%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

function init(func){
    var links = document.querySelectorAll(".cb133-download")
    for (let item of links ){
        let a =item.children[0]
        let href = a.attributes[1].value.replace("otn","otn-pub")
        a.attributes[1].value = href
        a.href='#license-lightbox'
        let name = a.innerHTML
        a.className='license-link icn-download'
        if(typeof func == 'function'){
          func(item,href,name);
        }
    }
}

(function() {
    'use strict';

    let intervalId = setInterval(function(){
        if(document.querySelectorAll(".cb133-download") != null){
            console.log("--------",document.querySelectorAll(".cb133-download"))
            clearInterval(intervalId)
            init((item,href,name)=>{
                $(item).click(()=>{
                    setTimeout(()=>{
                        let downloadBtn1 = document.querySelector(".download-file.icn-lock");
                        let downloadBtn2 = document.querySelector(".download-file.icn-download");
                        let downloadBtn = downloadBtn1==null?downloadBtn2:downloadBtn1;
                        if(downloadBtn==null){
                            return;
                        }
                        downloadBtn.href = href
                        console.log(downloadBtn,href)
                        downloadBtn.innerHTML="Download "+name
                        downloadBtn.className='download-file icn-download';
                        //downloadBtn.parentNode.className='obttn bttn-disabled';
                        let licenseBtn = document.querySelectorAll("input[name='licenseAccept']")[1];
                        $(licenseBtn).click(()=>{
                            setTimeout(init,300)
                        })
                    },600)
                })
            });

        }
    },600)



})();