// ==UserScript==
// @icon         https://nd-static.bdstatic.com/v20-static/static/favicon.ico
// @name         百度云精简-修
// @namespace    semen.cc
// @version      0.3.0
// @description  删除“复制这段内容后打开百度网盘手机App，操作更方便哦，来自百度会员超级无敌永久svip”，精简部主页广告、邀请，视频添加倍速按钮
// @author       涛之雨-修改
// @require      https://cdn.bootcdn.net/ajax/libs/clipboard.js/2.0.6/clipboard.min.js
// @match        *://pan.baidu.com/disk/*
// @match        *://pan.baidu.com/wap/*
// @match        *://pan.baidu.com/mbox/*
// @match        *://pan.baidu.com/play/*
// @match        *://yun.baidu.com/disk/*
// @match        *://yun.baidu.com/mbox/*
// @match        *://yun.baidu.com/play/*
// @match        *://pan.baidu.com/s/*
// @match        *://yun.baidu.com/s/*
// @match        *://pan.baidu.com/share/*
// @match        *://yun.baidu.com/share/*
// @match        http://*/*
// @match        https://*/*
// @grant	     GM_addStyle
// @grant	     unsafeWindow
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/424991/%E7%99%BE%E5%BA%A6%E4%BA%91%E7%B2%BE%E7%AE%80-%E4%BF%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/424991/%E7%99%BE%E5%BA%A6%E4%BA%91%E7%B2%BE%E7%AE%80-%E4%BF%AE.meta.js
// ==/UserScript==
/**********************************************\
 * 小尾巴部分修改自https://greasyfork.org/zh-CN/scripts/374100
 * V 0.3.0
 * 添加 + 自动读取、提交提取码的功能（第一次运行需要授权，有引导界面）
 * V 0.2.9
 * 修复 + 因为图省事，通用匹配导致某些界面被屏蔽的bug
 * V 0.2.8
 * 修复 + 视频倍速播放自动恢复的暗装（涛之雨全网独家的方法，如有借鉴请说明出处）
 * V 0.2.7
 * 调整 + 转存后的布局
 * 修复 + 删除部分遗漏广告
 * 新增 + 对于文件分享界面，的去广告支持
 * V 0.2.6
 * 新增 + 对于分享页的适配（去广告）
 * 新增 + 视频播放页添加倍速按钮（仿原生，贼强）
 * 添加 + 遵循协议 GPL-3.0-only
 * TODO : 默认永久分享（可自定义1-365天和永久）
 * TODO : 自定义分享密码（或公开链接，无密码）
 * TODO : 自定义限制分享次数链接
 * V 0.2.5
 * 新增 + 对于“在线视频”界面的支持
 * TODO : 加上倍速播放按钮
 * V 0.2.4
 * 新增 + 对于“分享”界面的支持
 * V 0.2.3
 * 删除 - 百度文库相关代码，迁移到新项目
 * V 0.2.1
 * 新增 + 百度文库大量垃圾、广告删除
 * TODO : 正在研究非VIP会员免【广告全屏阅读】
 * V 0.1.7
 * 修复 + “个人分享”界面“复制这段内容...”移除失败的bug
 * 新增 + 删除主界面的部分垃圾（可以自行对比）
 * 新增 + 关闭4秒内主动弹出的【设备管理】、【新功能测试】、【在线文档】、【在线解压】、等等。。。窗口
\************************************************/
(function() {
    'use strict';
    GM_addStyle(`.phone-banner,
.button-badge,
.hx-right-bottom,
.title-wrap > .join-vip,
.title-wrap > .info,
.hx-bottom-wrapper,
.hx-recom-wrapper,
.app-btn,.hx-warp,
.relative-doc-ad-wrapper,
.qr-wrapper,
.cert-tip,
.side-doc-tool-wrapper,
.feedback-wrapper,
.popover-container,
.privilege-box,
.vip-pop-wrap,
.red-point,
.wp-side-options,
.module-header-wrapper > dl > dd[node-type='header-union'],
.yike-entrance,
.find-light-icon,
.newIcon,
.app-download,
.app-notice,
.icon-notice,
.icon-feedback,
.app-feedback,
.wp-disk-header__right-item,
.bz-doc-tool-dialog-fix,
.ex-wrapper,
.fixed-activity-bar,
.vip-card-wrap,
.btn-img-tips,
.rights-section,
a[title="举报"],
div[class^="ad-"],
.share-file__link-ad,
.vip-activity-content,
.video-title-right-open-mobile,
.tips{
display:none!important;
width:0!important;
overflow:hidden!important;
}

.after-trans-dialog .info-section {
    padding-top: 99px!important;
}

`);
    let t = " ", e = "text", o = "去除小尾巴失败o(╥﹏╥)o", a = "body", l = "copy",y=true,f=(a)=>{a.style.display="none";a.style.width=0;a.style.overflow="hidden"};
    document.querySelector(a).addEventListener(l, function(a) {
        try {
            let l = a.target.value;
            l = l.split(t).filter((t, e) => {
                if(!!t.match(/手机App|复制这段/))
                    y=false;
                return y
            }).join("").replace("提取码"," 提取码"),
                a.clipboardData.setData(e, l),
                a.preventDefault(),
                y=true;
        } catch (a) {
            console.log(o);
        }
    });

    function autoInputCode(callback){
        navigator.clipboard.readText().then(a =>{
            callback(true,a)
        }) .catch((v) => {
            callback(false,v)
        });
    }
    if(location.href.indexOf("baidu.com/disk/")>=0){
        let id=setInterval(()=>{
            document.querySelectorAll(".close-mask").forEach(a=>{a.click()});
            document.querySelectorAll(".dialog-close").forEach(a=>{a.click()});
            document.querySelectorAll(".wp-guide-dialog-close").forEach(a=>{a.click()});
            document.querySelectorAll(".guide-dialog-close").forEach(a=>{a.click()});
            document.querySelectorAll(".wp-disk-header__right-item").forEach((a)=>{if(a.href&&!!a.href.match(/buy|addnew/)){f(a);}});
        },1);
        setTimeout(()=>{clearInterval(id)},4000)
        window.addEventListener("mouseup",a=>{
            if(a.target.title!=="分享"){return;}
            let id2=setInterval(()=>{
                const x=document.querySelectorAll(".share-file__link-ad");
                if(!x){return;}
                x.forEach((a)=>{f(a);});
                //                 if(document.querySelector("#g-select-1 > button"))document.querySelector("#g-select-1 > button").innerHTML="永久有效";
                //                 if(document.querySelector(".is-selected"))document.querySelector(".is-selected").classList.remove("is-selected")
                //                 if(document.querySelector("#g-select-1 > button"))document.querySelector("#g-select-1 > button").click()
                //                 if(document.querySelector("#g-select-1 > div > div[data-value='0']"))document.querySelector("#g-select-1 > div > div[data-value='0']").click()//.classList.add("is-selected")
                setTimeout(()=>{clearInterval(id2)},100);
            },10);
        });
    }else if(location.href.indexOf("play/video")>=0){
        const w=unsafeWindow||window
        let id=setInterval(()=>{
            if(w.videojs&&w.videojs.players&&w.videojs.players.html5player){
                const Myplayback=w.videojs.extend(w.videojs.getComponent('PlaybackRateMenuButton'), {
                    handleClick: function() {
                        this.menu.el_.style.display = 'none';
                    },
                    playbackRates: function() {
                        return [0.5,1,1.5,2,2.7,4];
                    },
                    controlText_:" 播放速率，\n涛之雨解锁VIP"
                });
                w.videojs.registerComponent('Myplayback', Myplayback);
                clearInterval(id);
                w.videojs.players.html5player.controlBar.addChild('Myplayback', {}, 6);
                w.videojs.players.html5player.controlBar.removeChild('playbackRateMenu');
                let i=0;
                let cao=setInterval(()=>{
                    for(let k;k<1000;i++,k++)clearTimeout(i);//移除锁定
                    if(i>=99999)clearInterval(cao);
                },100);
            }
        },500);
        //setTimeout(()=>{clearInterval(id)},10000)
    }else if(location.href.indexOf("share/init")>=0 || location.href.indexOf("wap/init")>=0){
        const saveInfo=(a)=>{
            localStorage.setItem("taozhiyuPanConfig", JSON.stringify(a));
        };
        const getInfo=()=>{
            return JSON.parse(localStorage.getItem("taozhiyuPanConfig"));
        };
        let info=(getInfo()&&Object.keys(getInfo()).length>0)?getInfo():{"isfrist":true};
        if(info.isfrist){
            info.isfrist=false;
            saveInfo(info);
            var m=document.createElement("div");
            m.style="position: fixed;left: 0px;top: 0px;z-index: 50;background: rgb(0, 0, 0);opacity: 0.7;font-size: 30px;width: 100%;line-height: 2;display: flex;height: 100%;align-items: center;justify-content: center;flex-direction: column;color: wheat;flex-wrap: wrap;";
            m.id="taozhiyuMask";
            m.innerHTML='<p>为了便于自动获取提取码</p><p>请在弹出框内点击允许</p><p>否则仅能手动输入/粘贴</p><br><p style="font-size: 14px;line-height: 1;">该信息仅在第一次打开时出现，点击屏幕消失</p>';
            document.querySelector("body").append(m);
            m.onclick=()=>{
                m.remove();
            };
        }
        navigator.permissions.query({name: "clipboard-read"}).then(result => {
            if (result.state == "granted" || result.state == "prompt") {
                autoInputCode( (c,a)=>{
                    debugger;
                    if(c){
                        a = a.trim();
                        let b=a.match(/(?:密|提取|访问|訪問)[碼码]?\s*[:：]?\s*([a-z\d]{4})/);
                        if(!b)
                            b=a.match(/^([\w|\W|0-9]{4})$/)
                        if(!!b && document.querySelector("#accessCode") != null ){
                            console.log(b[1]);
                            document.querySelector("#accessCode").value=b[1];
                            document.querySelector("#submitBtn").click()
                        }else if(!!b && document.querySelector(".tipsBox input") != null){
                           console.log(b[1]);
                           document.querySelector(".tipsBox input").value=b[1];
                            var e1 = document.createEvent("Event");
                           e1.initEvent("input", true, true);
                            document.querySelector(".tipsBox input").dispatchEvent(e1);
                           var e = document.createEvent("Event");
                           e.initEvent("click", true, true);
                           document.querySelector(".extract-content>button").dispatchEvent(e);
                       }else{
                            console.log("未匹配到常见密码")
                        }
                    }else{
                        console.log("不让我读取剪贴板你就自己粘贴去\n\n╭(╯^╰)╮哼\n\n如果是误操作请到“chrome://settings/content/clipboard”允许脚本读取剪贴板");
                    }
                })
            }else{
                console.log("不让我读取剪贴板你就自己粘贴去\n\n╭(╯^╰)╮哼\n\n如果是误操作请到“chrome://settings/content/clipboard”允许脚本读取剪贴板");
            }
        })
    }
})();