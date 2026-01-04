// ==UserScript==
// @icon         https://tva1.sinaimg.cn/large/008i3skNgy1gssioj5f67g30400403yc.gif
// @name         百度云去广告，快捷键倍速，免VIP解锁倍速、画质！全网独家！
// @namespace    baiduwangpan.taozhiyu.gitee.io
// @version      0.5.0
// @description  删除“复制这段内容后打开百度网盘手机App，操作更方便哦，来自百度会员超级无敌永久svip”，精简部主页广告、邀请，视频添加倍速按钮
// @author       涛之雨
// @require      https://cdn.bootcdn.net/ajax/libs/clipboard.js/2.0.6/clipboard.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.slim.min.js
// @match        *://pan.baidu.com/disk/*
// @match        *://pan.baidu.com/mbox/*
// @match        *://pan.baidu.com/play/*
// @match        *://yun.baidu.com/disk/*
// @match        *://yun.baidu.com/mbox/*
// @match        *://yun.baidu.com/play/*
// @match        *://pan.baidu.com/s/*
// @match        *://yun.baidu.com/s/*
// @match        *://pan.baidu.com/share/*
// @match        *://yun.baidu.com/share/*
// @grant	     GM_addStyle
// @grant	     unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @home-url	 https://greasyfork.org/zh-CN/scripts/422814
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/432955/%E7%99%BE%E5%BA%A6%E4%BA%91%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%80%8D%E9%80%9F%EF%BC%8C%E5%85%8DVIP%E8%A7%A3%E9%94%81%E5%80%8D%E9%80%9F%E3%80%81%E7%94%BB%E8%B4%A8%EF%BC%81%E5%85%A8%E7%BD%91%E7%8B%AC%E5%AE%B6%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/432955/%E7%99%BE%E5%BA%A6%E4%BA%91%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%80%8D%E9%80%9F%EF%BC%8C%E5%85%8DVIP%E8%A7%A3%E9%94%81%E5%80%8D%E9%80%9F%E3%80%81%E7%94%BB%E8%B4%A8%EF%BC%81%E5%85%A8%E7%BD%91%E7%8B%AC%E5%AE%B6%EF%BC%81.meta.js
// ==/UserScript==
/**********************************************\
 * 移除小尾巴部分修改自https://greasyfork.org/zh-CN/scripts/374100
 * 自定义密码部分修改自https://greasyfork.org/zh-CN/scripts/423146
 * 速率、画质等部分修改自videojs官方文档https://videojs.com/
 * V 0.5.0
 * 删除大量垃圾代码（找到更优解决办法！）虽然不知道是谁举报的脚本，我都代表大家感谢你，没有你我也不会去进行这么大规模修改的！
 * [相关举报链接](https://greasyfork.org/zh-CN/reports/12664) 因此，直接改了个大版本号。
 * 支持[新版界面](https://pan.baidu.com/disk/main?from=oldversion#/index?category=all)的广告拦截、自定义密码、默认分享时长改为无限制
 * 随手改了个更酷炫的黑金LOGO
 * 修改对于旧界面的支持性，更加完善
 * 修正对于提取码的匹配，使之更加精准
 * 添加定时读取提取码功能，有权限且未获取到正确的提取码时每秒重新获取
 * V 0.4.6（未公开）
 * 修复部分广告弹窗拦截
 * 优化部分代码
 * V 0.4.5
 * 修复“画中画”逻辑错误
 * 修复转存文件时界面显示错误
 * V 0.4.4
 * 大版本更新！！！
 * 全！网！独！家！支持百度云【免VIP】解锁倍速和画质！
 * （注：因服务器限制非会员速度，因此非会员会卡顿）
 * 需要看源码的朋友自行格式化。。。
 * 因为太大，把对齐的空格都删掉了（1.69M=>684K）
 * V 0.3.4
 * 悄咪咪修复部分（感觉就只有大萝卜一个）人百度网盘LOGO显示异常的问题（换了个图标）
 * 修复百度云更新造成的脚本无法倍速播放视频（目前仅有百度云VIP方可使用。。。）
 * 修复速率调节快捷键的一个bug（目前仅有百度云VIP方可使用。。。）
 * 添加“画中画”功能（需要浏览器支持），画中画模式快捷键将会失效，全屏自动退出画中画模式
 * V 0.3.3
 * 植入自定义密码功能（修改自【https://greasyfork.org/zh-CN/scripts/423146】，感谢提供思路，已获得授权）
 * 优化上述脚本
 * 修改默认分享时间为【永久】
 * 新增对于“内测提醒”弹窗的关闭支持
 * 倍速貌似失效了？算了，有空再看吧
 * V 0.3.2
 * 紧急修复误伤压缩包查看的bug
 * V 0.3.1
 * 新增对于【压缩包】、【CAD】和【思维导图】文件打开引导的屏蔽。
 * 新增在播放界面，新增快捷键控制播放速度：
 * -- (shift键无论是否按下，)按数字【0】即可恢复正常速度（原速快捷键）
 * -- 按下数字【1-9】可以分别调整速度为【1.25,1.5,1.75,2,2.4,2.7,4,6,8】（倍速快捷键）
 * -- 按下【shift】后再按下数字【1-9】可以分别调整速度为【0.1,0.15,0.2,0.25,0.3,0.5,0.6,0.8,0.9】（慢速快捷键）
 * -- (shift键无论是否按下，)每次按下【-】，当前速率减小0.1
 * -- (shift键无论是否按下，)每次按下【=】，当前速率增加0.1
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
    const w = unsafeWindow || window;
    const killWords = /内测|解压|体验|设备|专(属|享)|助手/;
    const changeFavicon = link => {
        let $favicon = document.querySelector('link[rel="shortcut icon"]');
        let $favicon1 = document.querySelector('link[rel="icon"]');
        $favicon?$favicon.href = link:"";
        $favicon1?$favicon1.href = link:"";
        if(!($favicon||$favicon1)){
            $favicon = document.createElement("link");
            $favicon.rel = "icon";
            $favicon.href = link;
            document.head.appendChild($favicon);
        }
    };
    setTimeout(()=>{
        //修改logo
        changeFavicon("https://tva1.sinaimg.cn/large/008i3skNgy1gssioj5f67g30400403yc.gif");
    },100);
    let myvideojs;
    var $ = $ || window.$ || w.$;
    const saveInfo = (a) => {
        GM_setValue("BaiduYunBeautify", JSON.stringify(a));
    };
    //兼容之前的版本，迁移数据并移除
    const getInfo = () => {
        return JSON.parse(localStorage.getItem("taozhiyuPanConfig"));
    };
    let oldinfo = (getInfo() && !!getInfo().isfrist) ? getInfo().isfrist : true;
    localStorage.clear("taozhiyuPanConfig");
    let info = GM_getValue("BaiduYunBeautify") ? JSON.parse(GM_getValue("BaiduYunBeautify")) : {};
    if (Object.keys(info).length < 3) {
        !info.SetKey && (info.SetKey = true);
        !info.sharePwd && (info.sharePwd = "");
        !info.isFristAutoEnterKey && (info.isFristAutoEnterKey = oldinfo);
        !info.isOldSDK && (info.isOldSDK = false);
        saveInfo(info)
    }
    GM_addStyle(`.phone-banner,
.button-badge,
.wp-share-file__link-ad,
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
.web-header-ad-item,
.wp-disk-header__right-item.company-cert,
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
padding: 99px 0!important;
}
 
#SetKey{
display: inline-block;
color: #fff;
font-size: 16px;
height: 42px;
line-height: 38px;
margin: 0 25px;
vertical-align: middle;
position: relative;
padding: 0 2px;
cursor: pointer;
}
 
#SetKey:hover {
opacity: .8;
}
 
`);
    let t = " ",
        e = "text",
        o = "去除小尾巴失败o(╥﹏╥)o",
        a = "body",
        l = "copy",
        y = true,
        f = (a) => {
            a.style.display = "none";
            a.style.width = 0;
            a.style.overflow = "hidden";
        };
    document.querySelector(a).addEventListener(l, function(a) {
        try {
            let l = a.target.value;
            l = l.split(t).filter((t, e) => { if (!!t.match(/手机App|复制这段/)) y = false; return y }).join("").replace("提取码", " 提取码"), a.clipboardData.setData(e, l), a.preventDefault(), y = true;
        } catch (a) { console.log(o); }
    });
 
    function autoInputCode(callback) {
        navigator.clipboard.readText().then(a => {
            callback(true, a);
        }).catch((v) => {
            callback(false, v);
        });
    }
 
    function checkmodule(argument) {
        var moduleJson = {
            "(": ")",
            "[": "]",
            "{": "}",
            "\'": "\'",
            "\"": "\""
        };
        var testStr = argument;
        var tempSaveArray = testStr.replace(/\\./g, "").match(/['"\[\]\(\)\{\}]/g);
        if (tempSaveArray.length !== 0) {
            var isdan = false;
            var isshuang = false;
            for (var j = 0; j < tempSaveArray.length; j < 0 ? j = 0 : j++) {
                if (j > 0 && moduleJson[tempSaveArray[j - 1]] !== undefined && moduleJson[tempSaveArray[j - 1]] == tempSaveArray[j]) {
                    tempSaveArray.splice(j - 1, 2);
                    j -= 2;
                    isdan = false;
                    isshuang = false;
                    continue;
                }
                if (isdan || isshuang) {
                    var ischanged = false;
                    if (isdan) {
                        tempSaveArray.splice(j, 1);
                        if (tempSaveArray[j] === "\'") {
                            isdan = false;
                        }
                        ischanged = true;
                    }
                    if (isshuang) {
                        tempSaveArray.splice(j, 1);
                        if (tempSaveArray[j] === "\"") {
                            isshuang = false;
                        }
                        ischanged = true;
                    }
                    if (ischanged) {
                        j--;
                        continue;
                    }
                } else if (tempSaveArray[j] == "\"") {
                    isshuang = true;
                } else if (tempSaveArray[j] == "\'") {
                    isdan = true;
                }
            }
            if (tempSaveArray.length) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }
 
    function retmatchtimes(i, endchar) {
        var txt = "([^" + endchar + "]*" + endchar + "){" + String(i) + "}";
        return txt;
    }
 
    function getFullFunctions(argument, exp, endchar = "\\}") {
        var matchingtimes = 0;
        try {
            var ret = "";
            while (matchingtimes <= 1000) {
                matchingtimes++;
                var tmp = argument.match(new RegExp(exp + retmatchtimes(matchingtimes, endchar), "gm"));
                if (tmp === null) break;
                if (checkmodule(tmp[0])) {
                    ret = tmp[0];
                    break;
                }
            }
            return ret;
        } catch (e) {
            console.log(e);
            return "";
        }
    }
    if (location.href.indexOf("/share/my") < 0) {
        if (location.href.indexOf("disk/main") > 0) {
            w.taozhiyugetpass = a => {
                return info.sharePwd?info.sharePwd:a;
            };
            w.webpackJsonp.tao = w.webpackJsonp.push;
            w.webpackJsonp.push = (a) => {
                for (var x in a[1]) {
                    var e = a[1][x].toString();
                    if (e.indexOf("createShareLink") >= 0) {
                        var b = getFullFunctions(e, "createShareLink\\s*:\\s*function\\s*\\([^\\)]+\\)\\s*\\{"),
                            c = b.replace(/pwd\s*:\s*\w+/, a => a.replace(/\w+$/, a => `window.taozhiyugetpass(${a})`));
                        var d = e.match(/function\s*\(([^,]+),([^,]+),([^)]+)\)/);
                        e = e.replace(b, c);//植入自定义密码
                        e=e.replace(/expiredTime\s*:\s*\d/,"expiredTime:0");//默认无限时长
                        a[1][x] = new Function(d[1], d[2], d[3], e.substring(e.indexOf("{") + 1, e.length - 1));
                        break;
                    }
                }
                w.webpackJsonp.tao(a);
            };
        } else {
            w.require.async("function-widget-1:share/util/newShare/linkSetting.js", function(a) {
                a.a = a.makePrivatePassword;
                a.makePrivatePassword = function() {
                    return info.sharePwd ? info.sharePwd : this.a();
                };
            });
 
        }
        $(document).on("change", ".nd-input-share-pwd", function() {
            var value = this.value;
            if (value && !/[^\W_]{4}/.test(value)) {
                w.require && w.require("system-core:system/uiService/tip/tip.js").show({ mode: "failure", msg: "提取码不合规范，只能是四位字母数字组合" });
            } else {
                info.sharePwd = value;
                saveInfo(info);
            }
        });
        [".share-file__link-expired",".wp-share-file__link-expired"].forEach(x=>{
            $(document).on("DOMNodeInserted",x , ()=> {
                if ($(".nd-input-share-pwd").length == 0) {
                    setTimeout(() => {
                        var o= document.querySelector("#g-select-1");
                        if( o!==null){
                            o.querySelector(".g-select-inner").click();
                            var event = new CustomEvent("mousedown", { bubbles: 'true' });
                            o.querySelector('#g-select-1 [data-value="0"]').dispatchEvent(event);
                        }
                    }, 200);
                    var html = '<div style="margin:10px;"></div><div class="share-file__link-expired-title wp-share-file__link-expired-title">自定义分享密码</div>';
                    html += '<div class="wp-share-file__link-pwd share-file__link-pwd"><div class="wp-share-file__link-expired-label inline-block-v-middle share-file__link-pwd-label">提取码</div>';
                    html += '<input type="text" class="nd-input-share-pwd" value="' + (info.sharePwd ? info.sharePwd : "") + '" placeholder="为空则随机四位" style="margin-left: 16px; width: 120px; height: 32px; line-height: 28px; border: 1px solid #D4D7DE; border-radius: 8px; text-align: left; padding-left: 12px"></div>';
                    $(x).after(html);
                }
            });
        });
    }
    if (location.href.indexOf("baidu.com/disk") >= 0) {
        let id1 = true,
            id2 = true,
            id3 = true;
        let id = setInterval(() => {
            //内测
            if (id1 && document.querySelector(".wp-guide-dialog-content-title") && document.querySelector(".wp-guide-dialog-content-title").innerText.match(killWords)) {
                document.querySelector(".wp-guide-dialog-close").click();
                id1 = false;
            }
            //企业用户专享「客户极速下载券」
            if (id2 && document.querySelector(".nd-dialog-cert__header-title") && document.querySelector(".nd-dialog-cert__header-title").innerText.match(killWords)) {
                document.querySelector(".nd-dialog-cert__header-title").parentElement.parentElement.parentElement.parentElement.querySelector(".u-dialog__headerbtn").click();
                id1 = false;
            }
            //设备
            if (id3 && document.querySelector(".wp-aside-nav-bubble-title") && document.querySelector(".wp-aside-nav-bubble-title").innerText.match(killWords)) {
                document.querySelector(".wp-aside-nav-bubble-close").click();
                id1 = false;
            }
            if (!id1 && !id2 && !id3) clearInterval(id);
            // document.querySelectorAll(".pdf2word-tip-close-btn").forEach(a=>{a.click()});
            // document.querySelectorAll(".dialog-close").forEach(a=>{a.click()});
            // document.querySelectorAll(".close-mask").forEach(a=>{a.click()});
            // document.querySelectorAll(".common-dialog-close").forEach(a=>{a.click()});
            // document.querySelectorAll(".wp-guide-dialog-close").forEach(a=>{a.click()});
            // document.querySelectorAll(".wp-tip-close-btn").forEach(a=>{a.click()});
            // document.querySelectorAll(".guide-dialog-close").forEach(a=>{a.click()});
            // document.querySelectorAll(".wp-disk-header__right-item").forEach((a)=>{if(a.href&&!!a.href.match(/buy|addnew/)){f(a);}});
        }, 10);
        setTimeout(() => { clearInterval(id) }, 20000)
        window.addEventListener("mouseup", a => {
            if (a.target.title !== "分享") { return; }
            let id2 = setInterval(() => {
                const x = document.querySelectorAll(".share-file__link-ad");
                if (!x) { return; }
                x.forEach((a) => { f(a); });
                setTimeout(() => { clearInterval(id2) }, 100);
            }, 10);
        });
    } else if (location.href.indexOf("play/video") >= 0) {
        var alreadytoast = false;
        let isVIP = w.require("base:widget/vip/vip.js").getVipValue() > 0;
        let killedVIP = false;
        w.require.async("file-widget-1:videoPlay/HTML5Player/HTML5Player.js", (a) => {
            a.prototype.antiSpam = () => {};
        })
        var Myasync = setInterval(() => {
            w.require.async("file-widget-1:videoPlay/context.js", function(a) {
                var tmpContext = a.getContext();
                if (!tmpContext) { return }
                a.getContext().locals.set("is_svip", 1);
                a.getContext().locals.set("vip_level", "∞");
                if (tmpContext.useNewSDK !== undefined) {
                    tmpContext.useNewSDK = !info.isOldSDK;
                    a.setContext(tmpContext);
                    clearInterval(Myasync);
                }
            });
        }, 100);
        const getmyvideo = a => {
            if (!myvideojs) return false;
            if (!myvideojs.players) {
                if (myvideojs.getPlayers&&myvideojs.getPlayers()) {
                    if (!!myvideojs.getPlayers()[a]) return myvideojs.getPlayers()[a];
                    else return false;
                } else {
                    try {
                        if (!!myvideojs(a)) return myvideojs(a);
                        else return false;
                    } catch (e) { return false; }
                }
            } else {
                if (!!myvideojs.players[a]) return myvideojs.players[a];
                else return false;
            }
        }
 
 
        function loadscript(url) {
            var script = document.createElement("script");
            script.type = "text/javacript";
            script.src = url;
            document.body.appendChild(script);
        }
        !isVIP && w.require("system-core:system/uiService/tip/tip.js").show({ mode: "loading", msg: `等待广告加载结束` });
        let hasremoved=false,id = setInterval(() => {
            if (myvideojs = myvideojs || w.videoPlayer) {
                !isVIP &&!hasremoved&&(loadscript("https://pannss.bdstatic.com/m-static/base/thirdParty/videojs/_nomd5_nomod/video_20210315.js"),hasremoved=true);
                if (!!getmyvideo("html5player")) {
                    let vid = getmyvideo("html5player").tag || getmyvideo("html5player").tech_.el_;
                    clearInterval(id);
                    if (document.pictureInPictureEnabled) {
                        GM_addStyle(`
.video-functions-tips{
margin-top: -69px;
}`);
                        vid.disablePictureInPicture = false;
                        let li = document.createElement("li");
                        li.id = "ChangeSDK";
                        li.innerHTML = `<svg t="1620441372115" style="width: 26px;height: 24px;margin-top: -7px;" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1317" width="48" height="48"><path d="M641.28 884.736V784.64a10.624 10.624 0 0 1 11.008-10.624h231.552a11.008 11.008 0 0 0 11.008-11.008v-36.864a11.008 11.008 0 0 0-11.008-11.008H472.96a11.008 11.008 0 0 0-7.424 18.816l156.992 157.184a11.008 11.008 0 0 0 18.816-6.4z m59.264-464.64v99.84a10.624 10.624 0 0 1-11.008 11.008H461.504a11.008 11.008 0 0 0-11.008 11.008v36.48a11.008 11.008 0 0 0 11.008 11.008h408.128a10.624 10.624 0 0 0 7.872-18.432l-156.992-156.992a11.008 11.008 0 0 0-20.032 6.4z" p-id="1318" fill="#ffffff"></path><path d="M817.152 128H206.528a78.464 78.464 0 0 0-78.464 78.464v602.752a78.464 78.464 0 0 0 78.464 78.464h229.568v-53.76H237.248a54.912 54.912 0 0 1-54.912-54.912V235.904a54.912 54.912 0 0 1 54.912-54.912h546.304a55.36 55.36 0 0 1 54.912 54.912v156.672a9.024 9.024 0 0 0 9.024 9.024h39.232a9.024 9.024 0 0 0 9.024-9.024V206.144a78.464 78.464 0 0 0-78.912-78.464z" p-id="1319" fill="#ffffff"></path></svg><span style="margin-top: -4px;">切至${info.isOldSDK?"新":"旧"}版</span>`;
                        document.querySelector("ul.tips-ul.three-items").append(li)
                        document.querySelector("#ChangeSDK").onclick = () => {
                            info.isOldSDK = !info.isOldSDK;
                            saveInfo(info);
                            setTimeout(() => { location.reload() }, 1000)
                        }
 
 
                        li = document.createElement("li");
                        li.id = "PInP_tao";
                        li.innerHTML = '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1168" style="width: 26px;height: 24px;margin-top: -7px;"><path d="M782 273H242v478h179v0.31a40.338 40.338 0 0 1 4.339-0.305L426 751c22.091 0 40 17.909 40 40s-17.909 40-40 40c-1.693 0-3.362-0.105-5-0.31v0.31H222c-33.137 0-60-26.863-60-60V253c0-33.137 26.863-60 60-60h580c33.137 0 60 26.863 60 60v176c0 22.091-17.909 40-40 40s-40-17.909-40-40V273z m20 263c33.137 0 60 26.863 60 60v175c0 33.137-26.863 60-60 60H588c-33.137 0-60-26.863-60-60V596c0-33.137 26.863-60 60-60h214z m-20 80H608v135h174V616z" p-id="1169" fill="#ffffff"></path></svg><span style="margin-top: -4px;">画中画</span>';
                        document.querySelector("ul.tips-ul.three-items").append(li)
                        document.querySelector("#PInP_tao").onclick = () => {
                            var Observer;
                            if (!document.pictureInPictureElement) {
                                Observer = new MutationObserver(function(mutations, instance) {
                                    if (document.pictureInPictureElement) {
                                        if (getmyvideo("html5player").el_.classList.value.indexOf("vjs-fullscreen") >= 0) {
                                            // console.log("进入全屏，关闭画中画");
                                            document.exitPictureInPicture().catch(e => console.warn("不会吧不会吧，开启没失败，取消反而失败了？", e));
                                            Observer && (Observer.disconnect(), Observer = undefined);
                                        }
                                    } else Observer && (Observer.disconnect(), Observer = undefined);
                                });
 
                                Observer.observe(getmyvideo("html5player").el_, {
                                    attributes: true,
                                    attributeFilter: ["class"]
                                });
                                vid.requestPictureInPicture().catch(e => console.warn("画中画开启失败：", e));
                            } else {
                                document.exitPictureInPicture()
                                    .catch(e => console.warn("不会吧不会吧，开启没失败，取消反而失败了？", e));
                                Observer && (Observer.disconnect(), Observer = undefined);
                            }
                        }
                    } else console.log("很遗憾，不支持画中画功能");
 
                    if (info.isOldSDK) {
                        var createEl = myvideojs.createEl,
                            Menu = myvideojs.getComponent("Menu"),
                            PlaybackRateMenuItem = myvideojs.getComponent("PlaybackRateMenuItem");
 
 
                        function inheritsLoose(subClass, superClass) {
                            subClass.prototype = Object.create(superClass.prototype);
                            subClass.prototype.constructor = subClass;
                            subClass.__proto__ = superClass;
                        }
                        var PlaybackRateMenuButton = function (_MenuButton) {
                            inheritsLoose(PlaybackRateMenuButton, _MenuButton);
 
                            function PlaybackRateMenuButton(player, options) {
                                var _this;
 
                                _this = _MenuButton.call(this, player, options) || this;
 
                                _this.updateVisibility();
 
                                _this.updateLabel();
 
                                _this.on(player, 'loadstart', _this.updateVisibility);
 
                                _this.on(player, 'ratechange', _this.updateLabel);
 
                                return _this;
                            }
 
                            var _proto = PlaybackRateMenuButton.prototype;
 
                            _proto.createEl = function () {
                                var el = _MenuButton.prototype.createEl.call(this);
 
                                this.labelEl_ = createEl('div', {
                                    className: 'vjs-playback-rate-value',
                                    innerHTML: '1x'
                                });
                                el.appendChild(this.labelEl_);
                                return el;
                            };
 
                            _proto.dispose = function dispose() {
                                this.labelEl_ = null;
 
                                _MenuButton.prototype.dispose.call(this);
                            };
 
                            _proto.buildCSSClass = function buildCSSClass() {
                                return "vjs-playback-rate " + _MenuButton.prototype.buildCSSClass.call(this);
                            };
 
                            _proto.buildWrapperCSSClass = function buildWrapperCSSClass() {
                                return "vjs-playback-rate " + _MenuButton.prototype.buildWrapperCSSClass.call(this);
                            };
 
                            _proto.createMenu = function createMenu() {
                                var menu = new Menu(this.player());
                                var rates = this.playbackRates();
 
                                if (rates) {
                                    for (var i = rates.length - 1; i >= 0; i--) {
                                        menu.addChild(new PlaybackRateMenuItem(this.player(), {
                                            rate: rates[i]
                                        }));
                                    }
                                }
 
                                return menu;
                            };
 
                            _proto.updateARIAAttributes = function updateARIAAttributes() {
                                this.el().setAttribute('aria-valuenow', this.player().playbackRate());
                            };
 
                            _proto.handleClick = function handleClick(event) {
                                var currentRate = this.player().playbackRate();
                                var rates = this.playbackRates();
 
                                var newRate = rates[0];
 
                                for (var i = 0; i < rates.length; i++) {
                                    if (rates[i] > currentRate) {
                                        newRate = rates[i];
                                        break;
                                    }
                                }
 
                                this.player().playbackRate(newRate);
                            };
 
                            _proto.playbackRates = function playbackRates() {
                                return isVIP ? [0.5, 0.75, 1, 1.5, 2, 2.7, 4] : [0.5, 0.75, 1, 1.5, 2, 3];
                            };
 
                            _proto.playbackRateSupported = function playbackRateSupported() {
                                return this.player().tech_ && this.player().tech_.featuresPlaybackRate && this.playbackRates() && this.playbackRates().length > 0;
                            };
 
                            _proto.updateVisibility = function updateVisibility(event) {
                                if (this.playbackRateSupported()) {
                                    this.removeClass('vjs-hidden');
                                } else {
                                    this.addClass('vjs-hidden');
                                }
                            };
 
                            _proto.updateLabel = function updateLabel(event) {
                                if (this.playbackRateSupported()) {
                                    this.labelEl_.innerHTML = "X"+this.player().playbackRate();
                                }
                            };
 
                            return PlaybackRateMenuButton;
                        }(myvideojs.getComponent('MenuButton'));
 
                        PlaybackRateMenuButton.prototype.controlText_ = isVIP ? "只是为了添加快捷键才替换的官方按钮" : "播放速率，\n涛之雨独家解锁VIP\n非VIP服务器限速，因此最大速率为3倍，\n购买百度云会员解锁更高倍率（可以通过快捷键调整尝试改高）";
                        myvideojs.registerComponent('Myplayback', PlaybackRateMenuButton);
 
                        getmyvideo("html5player").controlBar.removeChild('playbackRateMenu');
                        if (!document.querySelector(".level-2,.level-1")) { //会员不用等待广告
                            var aid = setInterval(() => {
                                if (!getmyvideo("html5-werbung-player") || getmyvideo("html5-werbung-player").el_.classList.value.indexOf("vjs-paused") >= 0) {
                                    clearInterval(aid);
                                    getmyvideo("html5player").controlBar.addChild('Myplayback', {}, 6);
                                }
                            }, 500);
                        } else {
                            GM_addStyle(`
.video-js .vjs-playback-rate{
	line-height: 2em;
font-size: 1.4em;
}
.vjs-workinghover .vjs-menu-button-popup:hover .vjs-menu{
	margin-bottom: 0.67em!important;
}`);
                            getmyvideo("html5player").controlBar.addChild('Myplayback', {}, 6);
                        }
                    }
                    var SetKey = document.createElement("sapn");
                    SetKey.id = "SetKey";
                    SetKey.innerHTML = "快捷键已" + (info.SetKey === true ? "打开【√】" : "关闭【×】");
                    SetKey.title = ` * 在播放界面，新增快捷键控制播放速度：
* （shift键无论是否按下，）按数字【0】即可恢复正常速度（原速快捷键）
* 按下数字【1-9】可以分别调整速度为【1.25,1.5,1.75,2,2.4,2.7,4,6,8】（倍速快捷键）
* 按下【shift】后再按下数字【1-9】可以分别调整速度为【0.1,0.15,0.2,0.25,0.3,0.5,0.6,0.8,0.9】（慢速快捷键）
* （shift键无论是否按下，）每次按下【-】，当前速率减小0.1
* （shift键无论是否按下，）每次按下【=】，当前速率增加0.1`;
                    document.querySelector('dd[node-type="header-link"]').append(SetKey);
                    document.querySelector("#SetKey").onclick = (a) => {
                        info.SetKey = !info.SetKey;
                        a.target.innerHTML = "快捷键已" + (info.SetKey === true ? "打开【√】" : "关闭【×】");
                        saveInfo(info);
                    }
                    var safeTime = false;
                    document.onkeydown = function(e) {
                        if (safeTime || !info.SetKey) return;
                        safeTime = true;
                        var k = e.keyCode || e.which || e.charCode;
                        var p = getmyvideo("html5player").tech_.playbackRate();
                        if (k === 48) p = 1;
                        else if (k >= 49 && k <= 57) p = (!e.shiftKey ? [1.25, 1.5, 1.75, 2, 2.4, 2.7, 4, 6, 8] : [0.1, 0.15, 0.2, 0.25, 0.3, 0.5, 0.6, 0.8, 0.9])[k - 49];
                        else if (k === 189) p -= 0.1;
                        else if (k === 187) p += 0.1;
                        getmyvideo("html5player").tech_.setPlaybackRate(parseFloat(p.toFixed(2)));
                        setTimeout(() => { safeTime = false }, 50);
                    }
                    getmyvideo("html5player").el_.onmouseenter = a => {
                        let b = a.target;
                        b.classList.remove("vjs-user-inactive");
                        b.classList.add("vjs-user-active")
                    };
                    getmyvideo("html5player").el_.onmouseleave = a => {
                        let b = a.target;
                        b.classList.add("vjs-user-inactive");
                        b.classList.remove("vjs-user-active")
                    };
                    w.require("system-core:system/uiService/tip/tip.js").show({ vipType: "svip", mode: "success", msg: `涛之雨插件加载成功！敬请享受快捷键、画中画${isVIP?"":"、解锁倍速和高画质的快感！"}` });
                }
            }
        }, 500);
    } else if (location.href.indexOf("share/init") >= 0) {
        if (info.isFristAutoEnterKey) {
            info.isFristAutoEnterKey = false;
            saveInfo(info);
            var m = document.createElement("div");
            m.style = "position: fixed;left: 0px;top: 0px;z-index: 50;background: rgb(0, 0, 0);opacity: 0.7;font-size: 30px;width: 100%;line-height: 2;display: flex;height: 100%;align-items: center;justify-content: center;flex-direction: column;color: wheat;flex-wrap: wrap;";
            m.id = "taozhiyuMask";
            m.innerHTML = '<p>为了便于自动获取提取码</p><p>请在弹出框内点击允许</p><p>否则仅能手动输入/粘贴</p><br><p style="font-size: 14px;line-height: 1;">该信息仅在第一次打开时出现，点击屏幕消失</p>';
            document.querySelector("body").append(m);
            m.onclick = () => {
                m.remove();
            };
        }
        let autoCheck=setInterval(()=>{
            navigator.permissions.query({ name: "clipboard-read" }).then(result => {
                if (result.state == "granted" || result.state == "prompt") {
                    autoInputCode((c, a) => {
                        if (c) {
                            let b;
                            if(/^\s*[a-z\d]{4}\s*$/.test(a))b=a;
                            else b= a.match(/(?:密|提取|访问|訪問)[碼码]?\s*[:：]?\s*([a-z\d]{4})/);
                            if (!!b) {
                                b=typeof b==="string"?b:b[1];
                                b=b.replace(/\s*/g,"");
                                console.log("匹配到密码：", b);
                                clearInterval(autoCheck);
                                document.querySelector("#accessCode").value = b;
                                document.querySelector("#submitBtn").click()
                            } else {
                                console.log("未匹配到常见密码")
                            }
                        } else {
                            clearInterval(autoCheck);
                            console.log("不让我读取剪贴板你就自己粘贴去\n\n╭(╯^╰)╮哼\n\n如果是误操作请到“chrome://settings/content/clipboard”允许脚本读取剪贴板");
                        }
                    })
                } else {
                    clearInterval(autoCheck);
                    console.log("不让我读取剪贴板你就自己粘贴去\n\n╭(╯^╰)╮哼\n\n如果是误操作请到“chrome://settings/content/clipboard”允许脚本读取剪贴板");
                }
            });
        },1000);
    }
})();