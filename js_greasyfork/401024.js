// ==UserScript==
// @name            HTMLMI:MJJ上班划水摸鱼 LOC增强体验专属神器
// @name:en         HTMLMI:MJJ上班划水摸鱼 LOC增强体验专属神器
// @name:zh         HTMLMI:MJJ上班划水摸鱼 LOC增强体验专属神器
// @name:ja         HTMLMI:MJJ上班划水摸鱼 LOC增强体验专属神器
// @description     自定义工作环境、自定义工作模式、自定义背景、显示头像开关，显示签名开关 去除DIY空间样式
// @description:en  自定义工作环境、自定义工作模式、自定义背景、显示头像开关，显示签名开关 去除DIY空间样式
// @description:ja  自定义工作环境、自定义工作模式、自定义背景、显示头像开关，显示签名开关 去除DIY空间样式
// @icon            https://ae03.alicdn.com/kf/H89545e8e9881422ea4079294a70ddce8J.png
// @author          htmlmi.com
// @license         GPL-3.0-only
// @create          2020-04-15
// @run-at          document-start
// @version         1.3
// @include         *://hostloc.com/*
// @include         *://www.hostloc.com/*
// @exclude         *://www.hostloc.com/search.php*
// @namespace       4370142@qq.com
// @supportURL      https://www.hostloc.com/thread-675435-1-1.html
// @home-url        https://greasyfork.org/zh-TW/scripts/14178
// @home-url2       https://github.com/langren1353/GM_script
// @homepageURL     https://greasyfork.org/zh-TW/scripts/14178
// @copyright       2015-2020, AC
// @lastmodified    2020-04-15
// @feedback-url    https://www.hostloc.com/thread-675435-1-1.html
// @note            2020.04-15 第一版面试 欢迎MJJ使用

// @grant           GM_getValue
// @grant           GM.getValue
// @grant           GM_setValue
// @grant           GM.setValue
// @grant           GM_addStyle
// @grant           GM_xmlhttpRequest
// @grant           GM_getResourceText
// @grant           GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/401024/HTMLMI%3AMJJ%E4%B8%8A%E7%8F%AD%E5%88%92%E6%B0%B4%E6%91%B8%E9%B1%BC%20LOC%E5%A2%9E%E5%BC%BA%E4%BD%93%E9%AA%8C%E4%B8%93%E5%B1%9E%E7%A5%9E%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/401024/HTMLMI%3AMJJ%E4%B8%8A%E7%8F%AD%E5%88%92%E6%B0%B4%E6%91%B8%E9%B1%BC%20LOC%E5%A2%9E%E5%BC%BA%E4%BD%93%E9%AA%8C%E4%B8%93%E5%B1%9E%E7%A5%9E%E5%99%A8.meta.js
// ==/UserScript==

!function () {
    let isdebug = false;
    let isLocalDebug = isdebug || false;
    let debug = isdebug ? console.log.bind(console) : function () {};
    let acCssLoadFlag = false;

    let inExtMode = typeof(isExtension) != "undefined";
    let inGMMode = typeof(GM_info.scriptHandler) != "undefined"; // = "Greasemonkey" || "Tampermonkey" || "ViolentMonkey"
    // 新版本的GreaseMonkey是带有scriptHandler，但是没有GM_getResourceText；旧版本不带scriptHandler，但是有GM_getResourceText
    let isNewGM = typeof(GM_info.scriptHandler) != "undefined" && GM_info.scriptHandler.toLowerCase() == "greasemonkey";
    let useCNLan = true; // 暂定，之后需要逻辑处理
    debug("程序开始");
    if (inExtMode == true && inGMMode == true) {
        console.log("扩展模式-脚本不启用");
        return;
    }
    if (typeof(GM) == "undefined") {
        // 这个是ViolentMonkey的支持选项
        GM = {};
        GM.setValue = GM_setValue;
        GM.getValue = GM_getValue;
    }
    (function () {
        debug("程序执行");
        let needDisplayNewFun = true; // 本次更新是否有新功能需要展示
        if (window.NodeList && !NodeList.prototype.forEach) {
            NodeList.prototype.forEach = function (callback, thisArg) {
                thisArg = thisArg || window;
                for (var i = 0; i < this.length; i++) {
                    callback.call(thisArg, this[i], i, this);
                }
            };
        }
        let ACConfig = {};
        /*存在对未初始化变量的初始化赋值-无需担心迭代兼容问题*/
        let DefaultConfig = {
            isHtmlmi: true,
            isDeleteAD:true,
            sDiy:true,
            isAcgbg:true,
            isRightDisplayEnable:true,
            isCounterEnable:true,
            isSimple:true,
            isWord:true,
            oldVersion: "",
            lastSaveTime: new Date().getTime(),
        };
        let CONST = {
            hasNewFuncNeedDisplay: true,
            sortIndex: 1,
            isGoogleImageUrl: false,
            AdsStyleMode: ACConfig.AdsStyleMode_Baidu,
            keySite: "baidu",
            StyleManger: function () {},
            curHosts: [],
        };
        let curSite = {
            SiteTypeID: 1,
        };
        let SiteType = {
            OTHERS: 8
        };
        /**初始化所有的设置**/
        Promise.all([GM.getValue("Config")]).then(function (data) {
            if (data[0] != null) {
                try{
                    ACConfig = JSON.parse(data[0]);
                }catch (e) {
                    ACConfig = data[0];
                }
            } else {
                ACConfig = DefaultConfig;
            }
            for(var key in DefaultConfig){
                if(typeof(ACConfig[key]) == "undefined"){
                    ACConfig[key] = DefaultConfig[key];
                }
            }
            if(ACConfig.isUserStyleEnable == false && (new Date().getTime() - ACConfig.lastSaveTime > 2592000000)){ // 大约30天时间
                // 如果用户取消了设置，并且长时间(3天)没有进行过处理，那么直接将数据置空 -> 用于刷新数据
                console.log("ac-baidu css reset for time");
                ACConfig.lastSaveTime = new Date().getTime();
                ACConfig.UserStyleText = DefaultConfig.UserStyleText;
            }
            callback();
        }).catch(function (except) {
            console.log(except);
        });
        function Reg_Get(HTML, reg) {
            let RegE = new RegExp(reg);
            try {
                return RegE.exec(HTML)[1];
            } catch (e) {
                return "";
            }
        }
        function getElementByXpath(e, t, r) {
            r = r || document, t = t || r;
            try {
                return r.evaluate(e, t, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            } catch (t) {
                return void console.error("无效的xpath");
            }
        }
        function getAllElementsByXpath(e, t, r) {
            return r = r || document, t = t || r, r.evaluate(e, t, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        }
        function getAllElements(e, t, r, n, o) {
            var i, s = [];
            if (!e) return s;
            if (r = r || document, n = n || window, o = o || void 0, t = t || r, "string" == typeof e) i = 0 === e.search(/^css;/i) ? function getAllElementsByCSS(e, t) {
                return (t || document).querySelectorAll(e);
            }(e.slice(4), t) : getAllElementsByXpath(e, t, r); else {
                if (!(i = e(r, n, o))) return s;
                if (i.nodeType) return s[0] = i, s;
            }
            return function makeArray(e) {
                var t, r, n, o = [];
                if (e.pop) {
                    for (t = 0, r = e.length; t < r; t++) (n = e[t]) && (n.nodeType ? o.push(n) : o = o.concat(makeArray(n)));
                    return a()(o);
                }
                if (e.item) {
                    for (t = e.length; t; ) o[--t] = e[t];
                    return o;
                }
                if (e.iterateNext) {
                    for (t = e.snapshotLength; t; ) o[--t] = e.snapshotItem(t);
                    return o;
                }
            }(i);
        }
        function callback() {
            if (ACConfig.oldVersion == GM_info.script.version) {
                CONST.hasNewFuncNeedDisplay = false;
            } else {
                CONST.hasNewFuncNeedDisplay = needDisplayNewFun;
            }
            !function () {
                let BaiduVersion = " V" + GM_info.script.version;
                let insertLocked = false;
                if(GM_getResourceText){
                    let config = GM_getResourceText("SiteConfigRules");
                    eval(config);
                }
                try {
                    if (curSite.SiteTypeID != SiteType.OTHERS) {
                        RAFFunction(function(){
                            rapidDeal(); // 定期调用，避免有时候DOM插入没有执行导致的问题
                        }, 800);
                    }
                } catch (e) {
                    console.log(e);
                }

                function MainCallback(e) {
                    if (e.target != null && typeof(e.target.className) == "string" && e.target.className.toUpperCase().indexOf("AC-") == 0) {
                        return;
                    } //屏蔽掉因为增加css导致的触发insert动作
                    rapidDeal();
                }

                //去论坛所有广告






                function AutoRefresh() {
                    if (!ACConfig.isHtmlmi) {
                        AC_addStyle("body {background:#fff; }", "AC-Htmlmi");
                      }else {
                     if (!ACConfig.isDeleteAD) {
                          }else {
                        AC_addStyle(".a_h, .a_mu, .a_c, .a_p, .a_f, .a_t {display: none;}.a_pt, .a_pb { display: none;}", "AC-DeleteAD");
                     };
                          //自定LOGOO
					 if (!ACConfig.isLogo) {
                          }else {
						AC_addStyle("#hd h2 img { display: none;} div.hdc.cl h2 a{width: 250px;  height: 70px; background: url(https://htmlmi.gitee.io/loc/logo/htmlmi.png) no-repeat;display: inline-flex;}", "AC-Htmlmi");
						if (!ACConfig.isGithub) {
                          }else {
                        AC_addStyle("div.hdc.cl h2 a{background: url(https://htmlmi.gitee.io/loc/logo/github.png) no-repeat;}", "AC-Github");
						};
						if (!ACConfig.isGitee) {
                          }else {
                        AC_addStyle("div.hdc.cl h2 a{background: url(https://htmlmi.gitee.io/loc/logo/gitee.png) no-repeat;}", "AC-Gitee");
						};
						if (!ACConfig.isDing) {
                          }else {
                        AC_addStyle("div.hdc.cl h2 a{background: url(https://htmlmi.gitee.io/loc/logo/ding.png) no-repeat;}", "AC-Ding");
						};
						if (!ACConfig.isJD) {
                          }else {
                        AC_addStyle("div.hdc.cl h2 a{background: url(https://htmlmi.gitee.io/loc/logo/jd.png) no-repeat;}", "AC-JD");
						};
						if (!ACConfig.isPdd) {
                          }else {
                        AC_addStyle("div.hdc.cl h2 a{background: url(https://htmlmi.gitee.io/loc/logo/pdd.png) no-repeat;}", "AC-Pdd");
						};
                     };

                     if (!ACConfig.isAvatar) {
                         AC_addStyle(".pls .avatar {  margin: 10px 25px;}.pls .avatar img {padding: 0px;width: 110px;height: 110px; border-radius: 50%;}", "AC-Avatar");
                          }else {
                        AC_addStyle(".pls .avatar {  margin: 20px 5px; margin-top: -42px;}.pls .avatar img { padding: 0px;    width: 25px;    height: 25px;    border-radius: 50%;}.pls .pi {    padding-left: 35px;}", "AC-Avatar");
                     };
                     if (!ACConfig.isDiy) {
                          }else {
                              for(var stylesheet of document.styleSheets){
                                  if(stylesheet.ownerNode.id ==='diy_style'){
                                      for(var i=stylesheet.cssRules.length-1;i>=0 ;i--){
                                          stylesheet.deleteRule(i);
                                      }
                                      break;
                                  }
                              }
                     };
                     if (!ACConfig.isSimple) {
                          }else {
                        AC_addStyle("a#post_reply {background: url(https://www.hostloc.com/forum.php?mod=attachment&aid=MTM0MjI4fGY5M2U2ZDBhfDE1ODY5ODQ2MjZ8MzgyMDB8NjY0NTE2&noupdate=yes) no-repeat;width: 78px;  height: 35px;}a#newspecial { background: url(https://www.hostloc.com/forum.php?mod=attachment&aid=MTM0MjI3fGI4MWY2ODQ4fDE1ODY5ODQ2MjZ8MzgyMDB8NjY0NTE2&noupdate=yes) no-repeat; width: 78px; height: 35px;}#nv li.a { background: #005AB4;} #nv { background: #2B7ACD;}.pls {background: #fff;}.pls span img {display: none;}.pbg2{background: #eee;}.pbr2{background: #ccc;}.tshare.cl { display: none;}", "AC-Simple");
                     };
                     if (!ACConfig.isAcgbg) {
                          }else {
                        AC_addStyle(".pgs a img { display: none;}div#postlist { background: url(https://htmlmi.gitee.io/loc/images/mask.png) no-repeat,url(https://www.htmlmi.com/loc.php) no-repeat;    background-position-x: right;}", "AC-Acgbg");
                     };
                     if (!ACConfig.isBackground) {
                         AC_addStyle("body {background:#fff; }", "AC-Background");
                          }else {
                       if (!ACConfig.isWord) {
                          }else {
                        AC_addStyle("body {background: url(https://s1.ax1x.com/2020/04/15/J9bEq0.png) no-repeat top center;background-size: cover;   background-attachment: fixed;}#toptb{ border-bottom: 0px;background: #ffffff00;margin-bottom: 190px;}.wp { background: #fff;}", "AC-Word");
                     };
                     if (!ACConfig.isExcel) {
                          }else {
                        AC_addStyle("body {background: url(https://ae02.alicdn.com/kf/Hcb53d6f1f095460990290a19e0e0edf4a.png) no-repeat top center;background-size: cover;   background-attachment: fixed;}#toptb{ border-bottom: 0px;background: #ffffff00;margin-bottom: 190px;}.wp { background: #fff;}", "AC-Word");
                     };
                    if (!ACConfig.isPPT) {
                          }else {
                        AC_addStyle("body {background: url(https://ae04.alicdn.com/kf/H28b05979f79c488ab5ed0fb7e33942925.png) no-repeat top center;background-size: cover;   background-attachment: fixed;}#toptb{ border-bottom: 0px;background: #ffffff00;margin-bottom: 190px;}.wp { background: #fff;}", "AC-Word");
                     };
                    if (!ACConfig.isAdobePS) {
                          }else {
                        AC_addStyle("body {background: url(https://ae01.alicdn.com/kf/H9b6f3c926b7c4f21b4558725f5b9eefbI.png) no-repeat top center;background-size: cover;   background-attachment: fixed;}#toptb{ border-bottom: 0px;background: #ffffff00;margin-bottom: 110px;}.wp { background: #fff;}", "AC-Word");
                     };
                     };
                    };
                    if (!ACConfig.isRightDisplayEnable) {
                        AC_addStyle(".pls .avatar img { display: none;}",
                            "AC-RightRemove");
                     };
                    if (!ACConfig.isCounterEnable) {
                        AC_addStyle(".sign {display: none;}", "AC-Sign");
                    }




                    /*"自定义"按钮效果*/
                    AC_addStyle(".newFuncHighLight{color:red;font-weight: 100;background-color: yellow;font-weight: 600;}#sp-ac-container label{display:inline;}#u{width:319px}#u #myuser{display:inline}#myuser,#myuser .myuserconfig{padding:0;margin:0}#myuser{display:inline-block;}#myuser .myuserconfig{display:inline-block;line-height:1;background:#2866bd;color:#fff;font-weight:700;text-align:center;padding:6px;border:2px solid #E5E5E5;border-radius: 30px;}#myuser .myuserconfig{box-shadow:0 0 10px 3px rgba(0,0,0,.1)}#myuser .myuserconfig:hover{background:#2970d4 !important;color:#fff;cursor:pointer;border:2px solid #73A6F8;}",
                        "AC-MENU_Btn");
                    /*自定义页面内容效果*/
                    AC_addStyle('body[baidu]  #sp-ac-container .container-label:not([class*="baidu"])>label,\n' +
                        'display:none;\n' +
                        '}#sp-ac-container labelHide{cursor:pointer;margin-left:8%;color:blue}#sp-ac-container .linkhref,#sp-ac-container labelHide:hover{color:red}#sp-ac-container .linkhref:hover{font-weight:bold}#sp-ac-container label.menu-box-small{max-width:16px;max-height:16px;cursor:pointer;display:inline-block}.AC-CounterT{background:#FD9999}body > #sp-ac-container{position:fixed;top:3.9vw;right:8.8vw}#sp-ac-container{z-index:999999;text-align:left;background-color:white}#sp-ac-container *{font-size:13px;color:black;float:none}#sp-ac-main-head{position:relative;top:0;left:0}#sp-ac-span-info{position:absolute;right:1px;top:0;font-size:10px;line-height:10px;background:none;font-style:italic;color:#5a5a5a;text-shadow:white 0px 1px 1px}#sp-ac-container input{vertical-align:middle;display:inline-block;outline:none;height:auto;padding:0px;margin-bottom:0px;margin-top:0px}#sp-ac-container input[type="number"]{width:50px;text-align:left}#sp-ac-container input[type="checkbox"]{border:1px solid #B4B4B4;padding:1px;margin:3px;width:13px;height:13px;background:none;cursor:pointer;visibility:visible;position:static}#sp-ac-container input[type="button"]{border:1px solid #ccc;cursor:pointer;background:none;width:auto;height:auto}#sp-ac-container li{list-style:none;margin:3px 0;border:none;float:none;cursor:default;}#sp-ac-container fieldset{border:2px groove #ccc;-moz-border-radius:3px;border-radius:3px;padding:4px 9px 6px 9px;margin:2px;display:block;width:auto;height:auto}#sp-ac-container legend{line-height:20px;margin-bottom:0px}#sp-ac-container fieldset > ul{padding:0;margin:0}#sp-ac-container ul#sp-ac-a_useiframe-extend{padding-left:40px}#sp-ac-rect{position:relative;top:0;left:0;float:right;height:10px;width:10px;padding:0;margin:0;-moz-border-radius:3px;border-radius:3px;border:1px solid white;-webkit-box-shadow:inset 0 5px 0 rgba(255,255,255,0.3),0 0 3px rgba(0,0,0,0.8);-moz-box-shadow:inset 0 5px 0 rgba(255,255,255,0.3),0 0 3px rgba(0,0,0,0.8);box-shadow:inset 0 5px 0 rgba(255,255,255,0.3),0 0 3px rgba(0,0,0,0.8);opacity:0.8}#sp-ac-dot,#sp-ac-cur-mode{position:absolute;z-index:9999;width:5px;height:5px;padding:0;-moz-border-radius:3px;border-radius:3px;border:1px solid white;opacity:1;-webkit-box-shadow:inset 0 -2px 1px rgba(0,0,0,0.3),inset 0 2px 1px rgba(255,255,255,0.3),0px 1px 2px rgba(0,0,0,0.9);-moz-box-shadow:inset 0 -2px 1px rgba(0,0,0,0.3),inset 0 2px 1px rgba(255,255,255,0.3),0px 1px 2px rgba(0,0,0,0.9);box-shadow:inset 0 -2px 1px rgba(0,0,0,0.3),inset 0 2px 1px rgba(255,255,255,0.3),0px 1px 2px rgba(0,0,0,0.9)}#sp-ac-dot{right:-3px;top:-3px}#sp-ac-cur-mode{left:-3px;top:-3px;width:6px;height:6px}#sp-ac-content{padding:0;margin:0px;-moz-border-radius:3px;border-radius:3px;border:1px solid #A0A0A0;-webkit-box-shadow:-2px 2px 5px rgba(0,0,0,0.3);-moz-box-shadow:-2px 2px 5px rgba(0,0,0,0.3);box-shadow:-2px 2px 5px rgba(0,0,0,0.3)}#sp-ac-main{padding:5px;border:1px solid white;-moz-border-radius:3px;border-radius:3px;background-color:#F2F2F7;background:-moz-linear-gradient(top,#FCFCFC,#F2F2F7 100%);background:-webkit-gradient(linear,0 0,0 100%,from(#FCFCFC),to(#F2F2F7));background: url(https://ae04.alicdn.com/kf/H69d807ece951402b9e44ef561b42ef2cd.png) no-repeat;}#sp-ac-foot{position:relative;left:0;right:0;min-height:20px}#sp-ac-savebutton{position:absolute;top:0;right:2px}#sp-ac-container .endbutton{margin-top:8px}#sp-ac-container .sp-ac-spanbutton{border:1px solid #ccc;-moz-border-radius:3px;border-radius:3px;padding:2px 3px;cursor:pointer;background-color:#F9F9F9;-webkit-box-shadow:inset 0 10px 5px white;-moz-box-shadow:inset 0 10px 5px white;box-shadow:inset 0 10px 5px white}#sp-ac-container .sp-ac-spanbutton:hover{background-color:#DDD}label[class="newFunc"]{color:blue}',
                        "AC-MENU_Page");
                }


                AutoRefresh();
                function rapidDeal() {
                            InsertSettingMenu();
                            ShowSetting();

                }

                function AutoLoadCustomCSS(){ // 按键触发reload
                    var cssValue = document.querySelector("#sp-ac-userstyleTEXT").value;
                    AC_addStyle(cssValue, "AC-userStyle", "head", true); // 用户自定义的样式表
                }





                function ACtoggleSettingDisplay(e) {
                    e.stopPropagation();
                    // 显示？隐藏设置界面
                    if(document.querySelector(".iframe-father iframe") == null){
                        document.querySelector(".iframe-father").insertAdjacentHTML("beforeend", "<iframe src='' frameborder='0' scrolling='0' style='height: 20px;max-width: 108px;padding-left:5px;box-sizing: border-box;margin-bottom: -5px;display:unset !important;'></iframe>");
                    }
                    setTimeout(function () {
                        if (document.querySelector("#sp-ac-content").style.display == 'block') {
                            document.querySelector("#sp-ac-content").style.display = 'none';
                        } else {
                            ACConfig.oldVersion = GM_info.script.version;
                            GM.setValue("Config", JSON.stringify(ACConfig));
                            document.querySelector(".ac-newversionDisplay").style.display = 'none';
                            document.querySelector("#sp-ac-content").style.display = 'block';
                        }
                    }, 100);
                    return false;
                }







                function ShowSetting() {
                    if (curSite.SiteTypeID == SiteType.OTHERS) return;
                    // 如果不存在的话，那么自己创建一个-copy from superPreload
                    if (document.body != null && document.querySelector("#sp-ac-container") == null) {
                        let Container = document.createElement('div');
                        Container.id = "sp-ac-container";
                        if(useCNLan){
                            Container.innerHTML =
                                "    <div id='sp-ac-content' style='display: none;'>\n" +
                                "        <div id='sp-ac-main'>\n" +
                                "        <fieldset id='sp-ac-autopager-field' style='display:block;'>\n" +

                                "            <legend class='iframe-father' title='LOC增加体验神器'><a class='linkhref' href='https://www.htmlmi.com/' target='_blank'>HTMLMI迷-分享 互助 共赢" + BaiduVersion + "</a></legend>\n" +
                                "            <ul class='setting-main'>\n" +
                                "                <li><label title='启用高端自定义'><input id='sp-ac-htmlmi' name='sp-ac-a_htmlmi' type='checkbox' " + (ACConfig.isHtmlmi ? 'checked' : '') + ">主程序-功能开关 </label>\n" +
                                "                    <label><input title='自动移除已经屏蔽的域名' id='sp-ac-ad' type='checkbox' " + (ACConfig.isDeleteAD ? 'checked' : '') + ">关闭广告</label>" +
                                "                    <label><input title='自动移除已经屏蔽的域名' id='sp-ac-avatar' type='checkbox' " + (ACConfig.isAvatar ? 'checked' : '') + ">小头像</label>" +

                                "                </li>\n" +
                                "                <li><label title='屏蔽DIY个人空间'><input id='sp-ac-diy' name='sp-ac-a_diy' type='checkbox' " + (ACConfig.isDiy ? 'checked' : '') + ">屏蔽DIY个人空间</label>\n" +
                                "                <li><a class='linkhref'><input id='sp-ac-background' name='sp-ac-a_force_office' type='checkbox' " + (ACConfig.isBackground ? 'checked' : '') + ">开启办公伪装模式 安全 舒适 无痛苦</a>" +
                                "                <label></label></li>\n" +
                                "                <li>" +
                                /****-自定义背景-*****/
                                "                   <labelMain class='container-label baidu'>" +
                                "                       <label title='办公划水-Word' style='margin-left:10px'><input id='sp-ac-word' name='sp-ac-a_force_office' type='radio' " + (ACConfig.isWord ? 'checked' : '') + ">办公划水-Word</label>" +
                                "                       <label title='办公划水-Excel'><input id='sp-ac-excel' name='sp-ac-a_force_office' type='radio' " + (ACConfig.isExcel ? 'checked' : '') + ">办公划水-Excel</label>" +
                                "                       <label title='办公划水-PPT'><input id='sp-ac-ppt' name='sp-ac-a_force_office' type='radio' " + (ACConfig.isPPT ? 'checked' : '') + ">办公划水-PPT</label>" +
                                "                       </br><label title='办公划水-PS' style='margin-left:10px'><input id='sp-ac-ps' name='sp-ac-a_force_office' type='radio' " + (ACConfig.isAdobePS ? 'checked' : '') + ">办公划水-PS</label>" +
                                "                       <label title=''><input name='sp-ac-a_force_office' type='radio' " + (ACConfig.AdsStyleMode_Baidu == 4 ? 'checked' : '') + ">待添加</vlabel>" +
                                "                       <label title=''><input name='sp-ac-a_force_office' type='radio' " + (ACConfig.AdsStyleMode_Baidu == 5 ? 'checked' : '') + ">待添加</label>" +
                                "                   <BR/></labelMain>" +
                                "                <li><label><input title='自定义划水背景' id='sp-ac-favicon' name='sp-ac-a_force' type='checkbox' " + (ACConfig.isFaviconEnable ? 'checked' : '') + ">自定义划水背景（下版本更新）</label></li>\n" +
                                "                <li><label><label>背景地址：</label><input id='sp-ac-faviconUrl' name='sp-ac-a_force' value='" + ACConfig.defaultFaviconUrl + "' style='width:55%;margin-top:-0.3em;' type='input' " + (ACConfig.isFaviconEnable ? '' : 'disabled=true') + "></label></li>\n" +
                                /****-高级自定义-*****/
                                "                </li>\n" +
                                "                <BR/><li><a class='linkhref'><input id='sp-ac-logo' name='sp-ac-a_force_logo' type='checkbox' " + (ACConfig.isLogo ? 'checked' : '') + ">开启自定义LOGO</a>" +
                                "                   <BR/><label><input id='sp-ac-github' name='sp-ac-a_force_logo' type='radio' " + (ACConfig.isGithub ? 'checked' : '') + ">Github</label>" +
                                "                       <label><input id='sp-ac-gitee' name='sp-ac-a_force_logo' type='radio' " + (ACConfig.isGitee ? 'checked' : '') + ">Gitee</label>" +
                                "                       <label><input id='sp-ac-ding' name='sp-ac-a_force_logo' type='radio' " + (ACConfig.isDing ? 'checked' : '') + ">钉钉</label>" +
                                "                       <label'><input id='sp-ac-jd' name='sp-ac-a_force_logo' type='radio' " + (ACConfig.isJD ? 'checked' : '') + ">京东</label>" +
                                "                       <label'><input id='sp-ac-pdd' name='sp-ac-a_force_logo' type='radio' " + (ACConfig.isPdd ? 'checked' : '') + ">拼多多</label>" +
                                "                <BR/></li>\n" +
                                "                <BR/><li><a class='linkhref'>高级自定义设置</a></li>" +
                                "                <li><label><input title='开启帖内二次元背景' id='sp-ac-acg' type='checkbox' " + (ACConfig.isAcgbg ? 'checked' : '') + ">帖内二次元背景 </label> <label><input title='头像开关' id='sp-ac-right' type='checkbox' " + (ACConfig.isRightDisplayEnable ? 'checked' : '') + ">头像开关 </label><label><input title='签名开关' id='sp-ac-counter' name='sp-ac-a_force' type='checkbox' " + (ACConfig.isCounterEnable ? 'checked' : '') + ">签名开关 </label><label><input title='精简模式' id='sp-ac-simple' name='sp-ac-a_simple' type='checkbox' " + (ACConfig.isSimple ? 'checked' : '') + ">精简模式</label></li>\n" +
                                "                <li><label><input title='AC-自定义样式' id='sp-ac-userstyle' name='sp-ac-a_force' type='checkbox' " + (ACConfig.isUserStyleEnable ? 'checked' : '') + ">自定义样式（下版本更新）</label></li>\n" +
                                "                <li><textarea  id='sp-ac-userstyleTEXT' name='sp-ac-a_force' value='这个是用户自定义样式' style='width:85%;height: 66px;margin-left:30px;' type='input'>" + ACConfig.UserStyleText + "</textarea></label></li>\n" +
                                "                <li><a class='linkhref' target='_blank' href='https://www.hostloc.com/thread-675435-1-1.html' >提建议,定制需求,自定义样式,点我反馈问题</a></li>" +
                                "            </ul>" +

                                "            <ul class='setting-second' style='display:none'>" +
                                "            </ul>"+

                                "            <span id='sp-ac-cancelbutton' class='sp-ac-spanbutton endbutton' title='取消' style='position: relative;float: left;'>取消</span>\n" +
                                "            <span id='sp-ac-savebutton' class='sp-ac-spanbutton endbutton' title='保存设置' style='position: relative;float: right;'>保存</span>\n" +

                                "        </fieldset>\n" +
                                "        </div>\n" +
                                "    </div>";
                        }
                        try {
                            document.body.appendChild(Container);
                        } catch (e) {
                            console.log(e);
                        }
                        try {
                            document.querySelector("#sp-ac-savebutton").addEventListener("click", function () {
                                // 点击之后的保存功能
                                let imgurl = document.querySelector("#sp-ac-faviconUrl").value.trim();
                                imgurl = (imgurl == "https://ae03.alicdn.com/kf/H89545e8e9881422ea4079294a70ddce8J.png") ? "" : imgurl;
                                imgurl = (imgurl == "" || imgurl == null) ? "https://ae03.alicdn.com/kf/H89545e8e9881422ea4079294a70ddce8J.png" : imgurl;
                                ACConfig.isFaviconEnable = document.querySelector("#sp-ac-favicon").checked;
                                ACConfig.defaultFaviconUrl = imgurl;
                                ACConfig.isRightDisplayEnable = document.querySelector("#sp-ac-right").checked;
                                ACConfig.isHtmlmi = document.querySelector("#sp-ac-htmlmi").checked;
                                ACConfig.isDeleteAD = document.querySelector("#sp-ac-ad").checked;
                                ACConfig.isAvatar = document.querySelector("#sp-ac-avatar").checked;
                                ACConfig.isDiy = document.querySelector("#sp-ac-diy").checked;
                                ACConfig.isAcgbg = document.querySelector("#sp-ac-acg").checked;
                                ACConfig.isCounterEnable = document.querySelector("#sp-ac-counter").checked;
                                ACConfig.isSimple = document.querySelector("#sp-ac-simple").checked;
                                ACConfig.isUserStyleEnable = document.querySelector("#sp-ac-userstyle").checked;
                                ACConfig.isBackground = document.querySelector("#sp-ac-background").checked;
                                ACConfig.isWord = document.querySelector("#sp-ac-word").checked;
                                ACConfig.isExcel = document.querySelector("#sp-ac-excel").checked;
                                ACConfig.isLogo = document.querySelector("#sp-ac-logo").checked;
                                ACConfig.isGithub = document.querySelector("#sp-ac-github").checked;
                                ACConfig.isGitee = document.querySelector("#sp-ac-gitee").checked;
                                ACConfig.isDing = document.querySelector("#sp-ac-ding").checked;
                                ACConfig.isJD = document.querySelector("#sp-ac-jd").checked;
                                ACConfig.isPdd = document.querySelector("#sp-ac-pdd").checked;
                                ACConfig.isPPT = document.querySelector("#sp-ac-ppt").checked;
                                ACConfig.isAdobePS = document.querySelector("#sp-ac-ps").checked;
                                if(ACConfig.isUserStyleEnable){
                                    ACConfig.UserStyleText = document.querySelector("#sp-ac-userstyleTEXT").value.trim();
                                }
                                ACConfig.lastSaveTime = new Date().getTime();
                                GM.setValue("Config", JSON.stringify(ACConfig));
                                setTimeout(function () {
                                    window.location.reload();
                                }, 400);
                            }, false);
                            initBlockPage();
                            document.querySelector("#sp-ac-blockdiybutton").addEventListener("click", function () {
                                document.querySelector(".setting-main").style = "display:none;";
                                document.querySelector(".setting-second").style = "";
                            });

                            document.querySelector(".menu-box-container").addEventListener("click", function (e) {
                                let cur = e.srcElement || e.target;
                                if (typeof(cur.dataset.color) != "undefined") {
                                    document.querySelector(".sp-ac-menuhuyanColor").value = cur.dataset.color;
                                    CONST.StyleManger.loadHuYanStyle(cur.dataset.color);
                                }
                                e.stopPropagation();
                            });
                            document.querySelector(".sp-ac-menuhuyanColor").addEventListener("input", function (e) {
                                CONST.StyleManger.loadHuYanStyle(document.querySelector(".sp-ac-menuhuyanColor").value);
                                e.stopPropagation();
                            });
                            document.querySelectorAll("labelHide").forEach(function (per) {
                                per.addEventListener("click", function (e) {
                                    let cur = e.srcElement || e.target;
                                    let className = cur.parentNode.className.replace("container-label ", "");
                                    AC_addStyle(".XX>label,.XX>br{display:unset !important;}.XX>labelhide{display:none !important;}".replace(/XX/gm, className),
                                        "AC-ShowHideItem-" + className, "body");
                                    e.stopPropagation();
                                });
                            });
                            if(ACConfig.isUserStyleEnable){
                                document.querySelector("#sp-ac-userstyleTEXT").addEventListener("paste", AutoLoadCustomCSS);
                                document.querySelector("#sp-ac-userstyleTEXT").addEventListener("keyup", AutoLoadCustomCSS);
                                document.querySelector("#sp-ac-userstyleTEXT").addEventListener("change", AutoLoadCustomCSS);
                            }
                        } catch (e) {
                        }
                    }
                    let allNodes = document.querySelectorAll(".AC-faviconT, .AC-CounterT");
                    for (let i = 0; i < allNodes.length; i++) {
                        if (allNodes[i].getAttribute('acClick') == null) {
                            allNodes[i].setAttribute('acClick', '1');
                            try {
                                allNodes[i].addEventListener('click', function (e) {
                                    return ACtoggleSettingDisplay(e);
                                }, true);
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    }
                    try {
                        document.querySelector("body>#sp-ac-container").addEventListener('click', function (e) {
                            e.stopPropagation(); // 阻止点击自身的时候关闭
                        }, false);
                        document.querySelector("body").addEventListener('click', function (e) {
                            safeRemove(function(){
                                document.querySelector("#sp-ac-content").style.display = 'none';
                            });
                        }, false);
                        document.querySelector("#sp-ac-cancelbutton").addEventListener('click', function (e) {
                            safeRemove(function(){
                                document.querySelector("#sp-ac-content").style.display = 'none';
                                e.stopPropagation();
                            });
                        }, false);
                    } catch (e) {
                    }
                }

                function InsertSettingMenu() {
                    if ((curSite.SiteTypeID != SiteType.OTHERS) &&  document.querySelector("#myuser") == null) {
                        try {
                            let parent = document.querySelector("#um > p:nth-child(3)");
                            let userAdiv = document.createElement("div");
                            userAdiv.id = "myuser";
                            if(useCNLan){
                                userAdiv.innerHTML = "<input type='submit' class='myuserconfig' value='自定义'/><span class='ac-newversionDisplay' style='background-color: red;float: left;height: 8px;width: 8px;border-radius: 4px;display:" + (CONST.hasNewFuncNeedDisplay ? "unset" : "none") + "'>&nbsp;</span>";
                            }
                            parent.insertBefore(userAdiv, parent.childNodes[0]);
                            document.querySelector("#myuser .myuserconfig").addEventListener("click", function (e) {
                                return ACtoggleSettingDisplay(e);
                            }, true);
                        } catch (e) {
                        }
                    }
                }
            }();

            // 读取个人设置信息
            function RAFFunction(callback, period){
                // 一秒60次，对应1秒1000ms
                let needCount = period / 1000 * 60;
                let times = 0;
                let hasFinish = false;
                function step(){
                    if(!hasFinish) requestAnimationFrame(step);
                    if(times == 0){
                        times = needCount;
                        hasFinish = callback(); // 只有返回true才会终止，不返回也会继续
                    }
                    times--;
                }
                requestAnimationFrame(step);
            }


            function AC_addStyle(css, className, addToTarget, isReload, initType) { // 添加CSS代码，不考虑文本载入时间，只执行一次-无论成功与否，带有className
                RAFFunction(function() {
                    let addTo = document.querySelector(addToTarget);
                    if (typeof(addToTarget) == "undefined")
                        addTo = (document.head || document.body || document.documentElement || document);
                    isReload = isReload || false; // 默认是非加载型
                    initType = initType || "text/css";
                    // 如果没有目标节点(则直接加) || 有目标节点且找到了节点(进行新增)
                    if (typeof(addToTarget) == "undefined" || (typeof(addToTarget) != "undefined" && document.querySelector(addToTarget) != null)) {
                        let cssNode = document.createElement("style");
                        if (className != null) cssNode.className = className;
                        cssNode.setAttribute("type", initType);
                        cssNode.innerHTML = css;
                        try {
                            addTo.appendChild(cssNode);
                        } catch (e) {
                            console.log(e.message);
                        }
                        return true;
                    }
                }, 20);
            }
            //失去焦点关闭设置窗口
            function safeRemove(cssSelector_OR_NEWfunction) {
                if (typeof(cssSelector_OR_NEWfunction) == "string") {
                    try {
                        let removeNodes = document.querySelectorAll(cssSelector_OR_NEWfunction);
                        for (let i = 0; i < removeNodes.length; i++)
                            removeNodes[i].remove();
                    } catch (e) {
                    }
                } else if (typeof(cssSelector_OR_NEWfunction) == "function") {
                    try {
                        cssSelector_OR_NEWfunction();
                    } catch (e) {
                    }
                } else {
                    console.log("未知命令：" + cssSelector);
                }
            }
            function FSBaidu() {
                debug("初始化FSBAIDU");
            }
        }
    })();
}();
