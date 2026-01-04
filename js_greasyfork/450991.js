// ==UserScript==
// @name         中建一局先锋学堂知学云_挂机
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  挂机看知学云网课，已适配中建一局先锋学堂
// @author       kakasearch
// @match        https://cscec1b.zhixueyun.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cscec1b.zhixueyun.com
// @require      https://greasyfork.org/scripts/425166-elegant-alert-%E5%BA%93/code/elegant%20alert()%E5%BA%93.js?version=922763
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @antifeature  ads  我们会展示捐助页面，但您可以关闭它
// @license      GPLV3
// @downloadURL https://update.greasyfork.org/scripts/450991/%E4%B8%AD%E5%BB%BA%E4%B8%80%E5%B1%80%E5%85%88%E9%94%8B%E5%AD%A6%E5%A0%82%E7%9F%A5%E5%AD%A6%E4%BA%91_%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/450991/%E4%B8%AD%E5%BB%BA%E4%B8%80%E5%B1%80%E5%85%88%E9%94%8B%E5%AD%A6%E5%A0%82%E7%9F%A5%E5%AD%A6%E4%BA%91_%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    unsafeWindow.kaka_not_donate = function(){
        document.querySelector("#donatediv").innerHTML='<div style="text-align: center; margin: 10px;"><p>(ಥ﹏ಥ) 好吧</p><div>'
        GM_setValue("donate_count",new Date().getTime())
        setTimeout(function(){window.location.reload()},1500)
    }
    unsafeWindow.kaka_has_donate = function(){
        if(document.querySelector("#donatediv")){document.querySelector("#donatediv").innerHTML=  '<div style="text-align: center; margin: 10px;"><p>٩(^ᴗ^)۶ 公若不弃，某愿拜为义父</p><div>'}
        GM_setValue("donate_count",new Date().getTime()+ 1000*3600*24*365 )
        setTimeout(function(){window.location.reload()},1500)
    }
    setInterval(function(){
        if(/study\/errors/.test(window.location.href)){
            new ElegantAlertBox("准备关闭页面>__<")
            window.close()
        }
    },5000)
    if(!GM_getValue("doing")){
        //init
        GM_setValue("doing",{"name":"","time":1,"status":""})
    }
    if(!GM_getValue("donate_count")){
        //init
        GM_setValue("donate_count",new Date().getTime())
    }
    var donate_flag = true;
    if(GM_getValue("donate_count") && new Date().getTime()- GM_getValue("donate_count") > 1000*30*3600*24){
        //donate
        donate_flag = false ;
        var script = document.createElement('script');
        script.src = 'https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/layer.min.js'; // Layer.js CDN链接
        document.head.appendChild(script);
        script.onload = function() {
            layer.open({
                type: 1,
                title: '捐助页面',
                closeBtn:0,
                anim: 2,
                area: [Number(document.body.clientWidth/2)+"px",Number(document.body.clientHeight*0.9)+"px"],
                shadeClose: false,
                offset: 'auto', // 居中显示
                skin: 'layui-layer-demo', // 无背景色
                content: `
    <div id = "donatediv">
      <img src="https://greasyfork.org/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6ODY4NDIsInB1ciI6ImJsb2JfaWQifX0=--418d35c0003c67ad7cf985d685e9444fda96190a/jdd803evdr4tdkqp78jk2afo27z6.png?locale=zh-CN" style="max-width: 50%; display: block; margin: 0 auto;"/>
      <div style="text-align: center; margin: 10px;">
        <p style="text-align: center; margin: 10px;">如果脚本对你有帮助，可以捐助我一瓶快乐水</p>
        <p style="text-align: center; margin: 10px;">有了快乐水，我就可以写出更多对你有帮助的脚本</p>
        <button onclick="kaka_has_donate();" style="padding: 5px 10px; background-color: #50a82b; color: #fff; border: none; margin-left: 10px; border-radius: 5px;">我已捐助^_^</button>
        <button onclick="kaka_not_donate();" style="padding: 5px 10px; background-color: #dc3545; color: #fff; border: none; margin-left: 10px; border-radius: 5px;">我不想捐助</button>
      </div>
    </div>
  `,
            });
        }
    }

    function click_course(){
        //查找并点击需要学习的课程
        for(let i of document.querySelectorAll(".item[data-resource-id]")){
            let status = i.querySelector(".operation").innerText
            let name = i.querySelector(".name-des").innerText
            if(/(继续学习)|(开始学习)/.test(status)){
                GM_setValue("doing",{"name":name,"time":new Date().getTime(),"status":status})
                i.click()
                return true
            }
        }
        return false
    }
    if(donate_flag){
        if(/study\/subject\/detail/.test(window.location.href)){
            // 课程主页，在当前页面实现控制做哪些课程
            new ElegantAlertBox("初始化中，请等待>__<")
            setInterval(function(){
                let doing_item = GM_getValue("doing")
                let next_flag = false
                if(new Date().getTime()-doing_item.time>1000*20){
                    //超过20s没有更新状态视为过期
                    next_flag = true
                    new ElegantAlertBox("准备开始新的课程>__<")
                }else{
                    next_flag = false
                    new ElegantAlertBox("貌似有课程正在观看，检查中，请等待>__<")
                }

                if (next_flag){
                    if(click_course() ){
                        //有需要做的课程，已经点击
                        new ElegantAlertBox("已打开新的学习页面学习>__<")
                    }else{
                        new ElegantAlertBox("找不到需要学习的内容>__<")
                    }
                }
            },5000)
        }else if(/study\/course\/detail/.test(window.location.href)){
            //视频播放页，做完后给主页一个标志，结束标签页
            new ElegantAlertBox("检查中，请等待>__<")
            setInterval(function(){
                let name = document.querySelector("div.title-row > div")
                if(name){
                    name = name.innerText
                }else{return}
                GM_setValue("doing",{"name":name,"time":new Date().getTime(),"status":"学习中"})
                let state = document.querySelector("dl.focus > div.chapter-right > div.section-item.section-item11 > div:nth-child(3) > span")
                state = state?state.innerText:null
                if(state == "已完成"){
                    new ElegantAlertBox("准备播放下一个视频>__<")
                    let courses = document.querySelectorAll("dl")
                    for(let i of courses){
                        if(i.querySelector("div.chapter-right > div.section-item.section-item11 > div:nth-child(3) > span").innerText != "已完成"){
                            i.click()
                            return
                        }
                    }
                    new ElegantAlertBox("全部学习完>__<")
                    GM_setValue("doing",{"name":name,"time":new Date().getTime()-1000*30,"status":"已完成"})
                    GM_setValue(name,{"name":name,"time":new Date().getTime()-1000*30,"status":"已完成"})
                    window.close()
                }else{
                    new ElegantAlertBox("还没有学习完 >__<")
                    if(document.querySelector(".register-mask-layer") && 'display: none;' != document.querySelector(".register-mask-layer").getAttribute("style")){
                        document.querySelector("#D210registerMask").click()
                    }
                    document.querySelector("video").muted="muted"
                    document.querySelector("button.vjs-big-play-button").click() //开始播放的按钮
                }

            },5000)
        }
    }
})();