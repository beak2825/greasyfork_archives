// ==UserScript==
// @name         WMP播放器
// @namespace    https://qinlili.bid/
// @version      0.2
// @description  拉起PotPlayer播放原WMP控件视频
// @author       琴梨梨
// @match        *://*/*
// @grant        none
// @run-at       document-body
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/441125/WMP%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/441125/WMP%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(!window.ActiveXObject){
        const getUrl=obj=>{
            let url;
            [].forEach.call(obj.getElementsByTagName("param"),param=>{
                if(param.getAttribute("name")=="url"){
                    url=param.getAttribute("value")
                }
            })
            return url;
        }
        var observer = new MutationObserver(function(){
            if(document.getElementsByTagName("object").length){
                [].forEach.call(document.getElementsByTagName("object"),obj=>{
                    if(obj.getElementsByTagName("embed")[0].getAttribute("type")=="application/x-mplayer2"){
                        let embed=obj.getElementsByTagName("embed")[0];
                        let videoUrl=embed.getAttribute("url")||getUrl(obj)
                        console.log("获取视频地址成功！"+videoUrl);
                        let videoCover=document.createElement("img");
                        videoCover.style="object-fit:contain"
                        videoCover.src="https://pic3.zhimg.com/80/v2-5804288d666a3443ea8d01828ad3782a.png"
                        videoCover.height=embed.height;
                        videoCover.width=embed.width;
                        videoCover.addEventListener("click",()=>{
                            let success=false;
                            const processFocus=()=>{
                                success=true;
                                console.log("拉起PotPlayer成功")
                                window.removeEventListener('blur', processFocus);
                            }
                            window.addEventListener('blur', processFocus);
                            location.href="potplayer://"+videoUrl;
                            setTimeout(()=>{
                                if(!success){
                                    console.log("拉起PotPlayer失败")
                                    window.removeEventListener('blur', processFocus);
                                    location.href="https://t1.daumcdn.net/potplayer/PotPlayer/Version/Latest/PotPlayerSetup64.exe"
                                }
                            },500)
                        })
                        obj.removeChild(embed);
                        obj.appendChild(videoCover)
                    }
                })
            }
        });
        observer.observe(document.documentElement, { childList: true });
    }
})();