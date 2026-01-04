// ==UserScript==
// @name        pcrock vip视频
// @description  vip视频播放
// @author       pcrock
// @match        *://*.v.qq.com/x/*
// @match        *://*.v.youku.com/v_show/*
// @match        *://*.iqiyi.com/*
// @match        *://*.mgtv.com/*
// @exclude      *://www.iqiyi.com/
// @exclude      *://www.mgtv.com/
// @grant        none
// @namespace    https://pcrock.gitee.io/
// @version 0.0.1.20230312174813
// @downloadURL https://update.greasyfork.org/scripts/31867/pcrock%20vip%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/31867/pcrock%20vip%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    let apiList = [
        {"name":"诺讯","url":"https://www.nxflv.com/?url="},
        {"name":"无M1","url":"http://www.82190555.com/index.php?url="},
        {"name":"无M2","url":"https://www.administratorw.com/admin.php?url="},
        {"name":"盘古","url":"https://go.yh0523.cn/y.cy?url="},
        {"name":"冰豆","url":"https://api.qianqi.net/vip/?url="},
        {"name":"云01","url":"https://jx.yparse.com/index.php?url="},
        {"name":"云02","url":"https://jx.ppflv.com/?url="},
        {"name":"解析","url":"https://api.jiexi.la/?url="},
        {"name":"夜幕","url":"https://www.yemu.xyz/?url="},
        {"name":"973","url":"https://jx.973973.xyz/?url="},
        {"name":"OK","url":"https://okjx.cc/?url="},
        {"name":"H8","url":"https://www.h8jx.com/jiexi.php?url="},
        {"name":"JY","url":"https://jx.playerjy.com/?url="},
        {"name":"1907","url":"https://z1.m1907.top/?jx="},
        {"name":"LELE","url":"https://lecurl.cn/?url="},
        {"name":"M3u8","url":"https://jx.m3u8.tv/jiexi/?url="},
        {"name":"虾米","url":"https://jx.xmflv.com/?url="},
        {"name":"8090","url":"https://www.8090.la/api/?url="},
        {"name":"蓝光","url":"http://jx.sujx.top/jiexi.php/?url="},
/*
        {"name":"解析06","url":"https://jx.jxbdzyw.com/m3u8/?url="},
        {"name":"解析10","url":"https://vip.bljiex.cc/?v="},
        {"name":"解析12","url":"https://jx.blbo.cc:4433/?url="},
*/
    ]
    let dom = document.createElement("ruby");
    dom.style.position = "fixed";
    dom.style.color = "#234";
    dom.style.top = "5%";
    dom.style.zIndex = "9999";
    document.body.appendChild(dom);
    let apiListDoma = "";
    for (const key in apiList) {
        let domDv = document.createElement("div");
        domDv.innerText = apiList[key].name
        domDv.addEventListener("click",function(){
            toNext(apiList[key].url)
        })
        dom.appendChild(domDv)
    }
     function toNext(api){
        let videoUrl = location.href;
         console.log(api)
         location.href =(api)+(location.href)  //当前页面        新建页面：window.open({api}+{videoUrl},'_blank');
    }
})();