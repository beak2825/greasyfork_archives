// ==UserScript==
// @name         删除B豆
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Delete it.
// @author       4εv3Я$Ad_η£кØ
// @include      https://www.bilibili.com/video/*
// @include      https://space.bilibili.com/*/dynamic
// @include      https://t.bilibili.com/*
// @include      https://space.bilibili.com/*
// @icon           data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant         none
// @require      https://code.jquery.com/jquery-3.1.1.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437230/%E5%88%A0%E9%99%A4B%E8%B1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/437230/%E5%88%A0%E9%99%A4B%E8%B1%86.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('load', (event) => {
        //设定屏蔽表情名称
        const BeanPicName = ['[doge]','[脸红]','[[藏狐]]','[微笑]','[OK]','[星星眼]','[妙啊]','[辣眼睛]','[吃瓜]','[滑稽]','[呲牙]','[打call]','[歪嘴]','[调皮]','[嗑瓜子]','[笑哭]','[脱单doge]','[嘟嘟]','[哦呼]','[喜欢]','[酸了]','[嫌弃]','[大哭]','[害羞]','[疑惑]','[喜极而泣]','[奸笑]','[笑]','[偷笑]','[惊讶]','[[鼓掌]','[doge]','[尴尬]','[灵魂出窍]','[委屈]','[傲娇]','[疼]','[冷]','[生病]','[吓]','[吐]','[捂眼]','[嘘声]','[思考]','[再见]','[翻白眼]','[哈欠]','[奋斗]','[墨镜]','[难过]','[撇嘴]','[抓狂]','[生气]','[口罩]','[捂脸]','[阴险]','[囧]','[呆]','[抠鼻]','[大笑]','[惊喜]','[无语]','[点赞]']
       //设定定时，延迟1000ms重复执行
        setInterval(function(){var a = document.getElementsByTagName("img") //获取名为img的标签
        var i = 0
        while(1){ //无限循环
            if(BeanPicName.indexOf(a[i].alt)>=0){ //使用indexOf()函数与上面的表情名称比较
                a[i].setAttribute('class','del')} //一致的情况下就添加class=del
            i +=1
        }

                              },1000);
    });

    window.onload = () =>{
        const picStyle = "img.small {display:none;} img.del {display:none !important;}"; //设定css字符串
        const createElement = document.createElement('style'); //创建style标签
        createElement.innerText = picStyle; //将字符串插入到style标签中
        document.body.appendChild(createElement); //将style标签加入到网页源码中
    }
})();