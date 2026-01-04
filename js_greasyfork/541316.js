// ==UserScript==
// @name         简单搜索—百度系优化 移动&桌面端通用🌊🌊🌊
// @version      3.1.8
// @namespace    https://ayouth.top/
// @description  为清爽赋能，为搜索干杯，百度搜索，百度翻译，百度贴吧，百度地图，百度知道，百度百科，百度汉语，百度图片去广告等综合优化，全系移动&桌面端通用。
// @author       Ayouth
// @supportURL   https://ayouth.top/msgboard/
// @match        *://*.baidu.com/*
// @icon         https://ayouth.top/favicon3.ico
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/541316/%E7%AE%80%E5%8D%95%E6%90%9C%E7%B4%A2%E2%80%94%E7%99%BE%E5%BA%A6%E7%B3%BB%E4%BC%98%E5%8C%96%20%E7%A7%BB%E5%8A%A8%E6%A1%8C%E9%9D%A2%E7%AB%AF%E9%80%9A%E7%94%A8%F0%9F%8C%8A%F0%9F%8C%8A%F0%9F%8C%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/541316/%E7%AE%80%E5%8D%95%E6%90%9C%E7%B4%A2%E2%80%94%E7%99%BE%E5%BA%A6%E7%B3%BB%E4%BC%98%E5%8C%96%20%E7%A7%BB%E5%8A%A8%E6%A1%8C%E9%9D%A2%E7%AB%AF%E9%80%9A%E7%94%A8%F0%9F%8C%8A%F0%9F%8C%8A%F0%9F%8C%8A.meta.js
// ==/UserScript==

(function (){
    "use strict";
    var userJsMeta={"name":"简单搜索—百度系优化 移动&桌面端通用🌊🌊🌊","version":"3.1.8","namespace":"https://ayouth.top/","description":"为清爽赋能，为搜索干杯，百度搜索，百度翻译，百度贴吧，百度地图，百度知道，百度百科，百度汉语，百度图片去广告等综合优化，全系移动&桌面端通用。","author":"Ayouth","supportURL":"https://ayouth.top/msgboard/","match":["*://*.baidu.com/*"],"icon":"https://ayouth.top/favicon3.ico","grant":["GM_registerMenuCommand","GM_getValue","GM_setValue"],"run-at":"document-start"};
    // helpers
    var T=function(){"use strict";const e={connector:" - ",levelColor:{error:"#f91b1b",warning:"#ffc107",success:"#4EE04E",info:"initial"},getTimeString:()=>(new Date).toLocaleString(),log(e,t){const n=this.levelColor[t],o=`%c${this.getTimeString()}${this.connector}%c${e}`;console.log(o,"color:#1ce8e8","color:"+n)},error(e){this.log(e,"error")},info(e){this.log(e,"info")},success(e){this.log(e,"success")},warn(e){this.log(e,"warning")}};function t(e){const t=[...document.querySelectorAll(e)];return t.get=(e=0)=>t[e]||null,t}function n(e,t){const n="string"==typeof t&&document.getElementById(t.trim())||document.createElement("style");return n.innerHTML+=e,"string"==typeof t&&(n.id=t),n.isConnected||(document.head?document.head.insertAdjacentElement("afterend",n):document.body?document.body.insertAdjacentElement("beforebegin",n):document.documentElement.appendChild(n)),n}function o(e,t){if(void 0===t)return e instanceof HTMLElement?e.style:window.getComputedStyle(document.querySelector(e));let o=";";t instanceof Object?Object.keys(t).forEach((e=>{o+=`${e}: ${t[e]};`})):o=`;${t};`,e instanceof HTMLElement?e.style.cssText=e.style.cssText+o:n(`\n${e}{${o}}\n`,"T.css")}const i={$browser:{env:(()=>{const e={webview:/\(.+wv\)/i.test(window.navigator.userAgent),android:/Android/i.test(window.navigator.userAgent),linux:/Linux/i.test(window.navigator.userAgent),ios:/ios/i.test(window.navigator.userAgent),macos:/macOS/i.test(window.navigator.userAgent),windows:/win|Windows/i.test(window.navigator.userAgent),iphone:/iPhone/i.test(window.navigator.userAgent),ipad:/iPad/i.test(window.navigator.userAgent),mobile:/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(window.navigator.userAgent),pc:!1};return e.pc=!e.mobile,e})(),platform:window.navigator.platform,language:window.navigator.language,Chinese:{isTraditional:["zh-TW","zh-HK","zh-Hant","zh-MO"].some((e=>e.toLowerCase()===String(window.navigator.language).toLowerCase())),isSimplified:["zh-CN","zh-Hans","zh-SG","zh-MY"].some((e=>e.toLowerCase()===String(window.navigator.language).toLowerCase()))}},$log:e,type:function(e,t){return"string"==typeof t?typeof e===t.trim().toLowerCase():typeof e},debounce:function(e,t,n=!1){let o;return function(...i){!o&&n&&e.apply(this,i),o&&clearTimeout(o),o=setTimeout((()=>e.apply(this,i)),t)}},throttle:function(e,t){let n,o;return function(...i){const r=Date.now();if(o&&clearTimeout(o),!n||r-n>=t)n=r,e.apply(this,i);else{o=setTimeout((()=>{n=(new Date).getTime(),e.apply(this,i)}),t-(r-n))}}},delay:function(e,t,...n){return setTimeout(e,t,...n)},tick:function(e,t,n,...o){let i;const r=()=>{i&&clearInterval(i)},a=()=>{e(r,...o)};return i=setInterval(a,t),!0===n&&a(),i},var:function(e,t){const n=window.unsafeWindow instanceof Window?window.unsafeWindow:window;return void 0===e?n:void 0===t?n[e]:void(n[e]=t)},test:function(e){const t=(e=e||{}).host instanceof Array?e.host:[e.host||window.location.host],n=e.path instanceof Array?e.path:[e.path||window.location.pathname];let o=(t,n)=>t instanceof RegExp?t.test(n):e.strict?n===t:n.indexOf(t)>-1,i=t.some((e=>o(e,location.host)))&&n.some((e=>o(e,location.pathname)));return i&&e.callback&&e.callback(),i},ready:function(e,t=0){if("function"==typeof e){const n=o=>{document.removeEventListener("DOMContentLoaded",n),setTimeout(e,t,o)};"loading"!=document.readyState?n():document.addEventListener("DOMContentLoaded",n)}},load:function(...e){return Promise.all(e.map((e=>new Promise(((t,n)=>{const o=e.type,i=e.attr,r=document.createElement(o);Object.keys(i).forEach((e=>r.setAttribute(e,i[e]))),(document.body||document.documentElement).appendChild(r),r.onload=e=>t({evt:e,resource:r}),r.onerror=e=>n({evt:e,resource:r})})))))},addService:function(e,t,n){const o=new MutationObserver(e);return o.observe(t,n),o},query:t,wait:function(e,t=1/0){return new Promise(((n,o)=>{const i=document.querySelector(e);if(i)return void n(i);let r;t!==1/0&&(r=setTimeout((()=>{o("timeout"),a.disconnect()}),t));const a=new MutationObserver((()=>{const t=document.querySelector(e);t&&(clearTimeout(r),n(t),a.disconnect())}));a.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0})}))},injectStyle:n,open:function(e,t="请点击前往"){if(window.open(e))return;if(null===document.querySelector("style#T\\.open")){n('.t-open:hover { background: #4d76f3; } @keyframes scale-in-center { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(1); opacity: 1; } } .t-open { font-family:Tahoma, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;letter-spacing:1px;font-weight:bold;animation: scale-in-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both; transition: 0.15s; font-size: 20px; display: block; background: #6589f2; color: #efefef; text-decoration: underline; box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.35); border-radius: 4px; margin: auto; width: fit-content; height: fit-content; z-index: 9999999; position: fixed; top: 0; left: 0; right: 0; bottom: 0; padding: 12px; display: flex; align-items: center; justify-content: center }',"T.open")}document.querySelectorAll("a.t-open").forEach((e=>e.remove()));const o=document.createElement("a");o.target="_blank",o.href=e,o.className="t-open",o.textContent=t,o.onclick=()=>{o.remove()},document.documentElement.appendChild(o)},css:o,hide:function(e,t="display"){let n="";"display"===t?n="display:none !important":"visibility"===t?n="visibility:hidden !important":"covert"===t&&(n="overflow:hidden !important;position:fixed !important;top:120% !important;opacity:0 !important;pointer-events:none !important"),o(e,n)},remove:function(e){t(e).forEach((e=>e.remove()))}};return i}();
    ;const $browser=T.$browser;const $log=T.$log;
    
    //注册菜单函数
    function register() {
        if (window.top !== window) {
            return;
        }
        if ("undefined" == typeof GM_registerMenuCommand || "undefined" == typeof GM_getValue || "undefined" == typeof GM_setValue) {
            $log.error("GM函数不存在，无法注册菜单");
            return;
        }
        if ("undefined" == typeof GM_registerMenuCommand || "undefined" == typeof GM_getValue || "undefined" == typeof GM_setValue) {
            $log.error("当前不处于脚本管理器环境，停止菜单注册");
            return;
        }
        if (!GM_getValue('config')) {
            GM_setValue("config", JSON.stringify(config))
        } else {
            let savedConfig = JSON.parse(GM_getValue("config"));
            //维护和更新已保存的config
            if (T.type(savedConfig.option, "object")) {
                Object.keys(config.option).forEach(key => {
                    if (!T.type(savedConfig.option[key], "undefined")) {
                        config.option[key] = savedConfig.option[key];
                    }
                })
            }
            GM_setValue("config", JSON.stringify(config));
        };
        // 值取true或false的菜单
        const menu = {
            hideTrending: "移除热搜和相关推荐"
        };
        let commands = [];
        Object.keys(menu).forEach(e => {
            let desc = (config.option[e] ? "✅ " : "❌ ") + menu[e];
            let opposite = !config.option[e];
            let callback = () => {
                config.option[e] = opposite;
                GM_setValue("config", JSON.stringify(config));
                window.location.reload();
            }
            commands.push([desc, callback]);
        });
        for (let command of commands) {
            GM_registerMenuCommand(command[0], command[1]);
        }
        GM_registerMenuCommand("💬 给作者留言", function () {
            T.open("https://ayouth.top/msgboard/");
        });
    }
    /**
     * @type {Record<string, {strict:boolean,domain:string | RegExp | (string | RegExp)[],pc:()=>void,mobile:()=>void,common:()=>void }> }
     */
    var websites = {
        "百度搜索": {
            domain: ['m.baidu.com', 'www.baidu.com', 'ipv6.baidu.com'],
            strict: false,
            pc() {
                // 顶部广告
                T.hide("#top-ad,.tenon_pc_comp_columbus_float_layer-video-fwc");
                //去除主内容搜索广告 
                T.hide('#content_left div[id$="_canvas"]');
                T.hide("#content_left  div:not([class]):not([id])[style*='display:block !important;visibility:visible !important'] *");
                T.css("#content_left  div:not([class]):not([id])[style*='display:block !important;visibility:visible !important']", { opacity: 0, width: "0px", height: "0px" });
                const removSearchAd = T.throttle(() => {
                    T.query('.c-container').forEach((ele) => {
                        if (ele.querySelector('.t > a[data-landurl]')) {
                            T.hide(ele);
                            $log.success("已移除搜索广告");
                        }
                    });
                }, 100);
                T.ready(() => {
                    T.addService(removSearchAd, document.body, {
                        childList: true,
                        subtree: true
                    });
                })
                //去除右侧广告
                T.hide('#content_right  td  .hint_right_middle');
                T.hide('#content_right .ad-widget');
                $log.success("已移除大量广告");
                //选择是否去除热搜和相关推荐
                if (config.option.hideTrending) {
                    T.hide("#wrapper #m");
                    T.hide("#content_right");
                    T.hide("#s-hotsearch-wrapper");
                    T.css("#rs_new", {
                        position: "absolute",
                        top: "40px",
                        left: "calc(620px + 2vw)",
                        width: "fit-content"
                    });
                    $log.success("已移除热搜和相关推荐");
                }
            },
            mobile() {
                // 主页广告
                T.hide("#navs+script+div[style]");
                //去除百度搜索内容广告
                T.hide('.ec_wise_ad', "covert");
                T.hide('.ec_wise_ad *');
                $log.success("已移除搜索广告");
                //解决导航栏白色 在背景色不透明时
                T.ready(() => {
                    if (/0, 0, 0, 0/.test(T.css("div.se-head-tablink").backgroundColor)) {
                        T.css('span.se-tab-tx.se-tab-cur.se-tab-nxt', { color: "black" });
                        T.css('span.se-tab-tx', { color: "#666" })
                        T.css('span.se-tab-cur::after', { "border-bottom": "2px solid #38f" });
                        $log.success("已修缮UI");
                    }
                });
                //移除推荐词小标签流氓行为
                //功能函数 解决“大家都在搜”的小标签第一次会跳转百度下载
                const clearlittleTagEvent = () => {
                    //flag
                    let f1 = false, f2 = false, f3 = false;
                    const excute = () => {
                        T.query(".c-line-clamp1").forEach(el => {
                            const span = el.querySelector("span");
                            if (span && span.firstChild && span.firstChild.textContent.indexOf("百度APP内打开") > -1) {
                                el.remove();
                            }
                        });
                        T.query(".rw-list-new.rw-list-new2 > a").forEach((ele) => {
                            ele.parentElement && ele.parentElement.replaceChild(ele.cloneNode(true), ele);
                            f1 = true;
                        })
                        T.query('.c-span6.c-gap-inner-bottom-small.c-gap-inner-top-small > a').forEach((ele) => {
                            ele.parentElement && ele.parentElement.replaceChild(ele.cloneNode(true), ele);
                            f2 = true;
                        });
                        T.query('.c-scroll-item > div').forEach((ele) => {
                            ele.parentElement && ele.parentElement.replaceChild(ele.cloneNode(true), ele);
                            f3 = true;
                        })
                    };
                    //确保清除
                    T.tick((destroy) => {
                        if (f1 + f2 + f3 > 0) {
                            //隐藏app内打开文字 
                            T.hide("#page-relative .c-line-clamp1[style*='block']");
                            $log.success('成功移除‘大家还在搜’等小标签的流氓跳转行为 flag:' + (f1 + f2 + f3));
                            destroy();
                        }
                        else {
                            excute();
                        }
                    }, 300);
                }
                clearlittleTagEvent();
                //简单做法 
                document.cookie = `SE_LAUNCH=5%3A${parseInt(new Date().getTime() / 1000)}_10%3A${parseInt(new Date().getTime() / 60000)}_13%3A${parseInt(new Date().getTime() / 60000)};domain=baidu.com;path=/;SameSite=None;expires=Fri, 31 Dec 2222 23:59:59 GMT`;
                $log.success('已伪造凭证避免百度搜索移动端流氓行为');
                //天天领现金广告
                T.hide("#results-pre > div > div");
                //底部打开悬浮窗
                T.hide('#copyright + div');
                //百度搜索-图片广告
                let removeImgAd = T.throttle(() => {
                    T.query('[class*="sfc-image-content-ad-"]').forEach((e) => {
                        if (e.parentElement && e.parentElement.parentElement) {
                            e.parentElement.parentElement.remove();
                        }
                    });
                }, 100);
                T.hide('[class*=sfc-image-content-ad-]');
                if (location.href.indexOf('pd=image_content') > -1) {
                    T.ready(() => {
                        T.addService(removeImgAd, document.body, {
                            childList: true,
                            subtree: true
                        });
                    })
                }
                //去除百度搜索-问答广告 & 贴吧广告
                T.hide(".c-container.ec-container");
                //去除百度文库搜索广告
                T.hide(".c-result[data-tpl*='adv_']");
            }
        },
        "百度知道": {
            domain: "zhidao.baidu.com",
            strict: false,
            pc() {
                T.hide('.list-header > .bannerdown');
                if (config.option.hideTrending) {
                    T.hide('.list-wraper + aside');
                }
                T.hide('#wgt-ad-right-fixed');
                //带货广告
                T.hide('[class*="businessvip"]');
                //大量广告
                T.hide('.wgt-ads');
                T.hide("#knowledge-answer");
                T.hide("[data-lp]");
            },
            mobile() {
                //app ad
                T.hide('#respect-footer > a');
                T.hide('.zhidao_na_middle');
                //大量广告
                T.hide('.ec-ad');
                T.hide("div[class*='wgt-'][class*='-youx']");
                T.hide("div[class*='wgt-'][class*='-asp']");
                T.hide('.feed-ecom-ads');
                T.hide("#knowledge-answer-list");
                T.hide("#related-list-target #wap-youx-change-asp");
                T.hide(".feed-recommend-item-with-adhere > div + div > div:not([class])")
            }
        },
        "百度百科": {
            domain: "baike.baidu.com",
            strict: false,
            mobile() {
                T.hide("#J-business-module-wrapper");
                T.hide("#J_yitiao_container");
                T.hide('#J-super-layer-promote');
                T.hide('.yitiao-spliter + div');
                //伪造 防流氓
                document.cookie = `baikeTuneUpBaiduApp=${Math.floor(Math.random() * 20 + 10)};domain=${location.hostname};path=/;SameSite=None;expires=Fri, 31 Dec 2222 23:59:59 GMT`;
                $log.success('已伪造凭证避免百度文库移动端流氓行为');
            },
            pc() {
                T.hide('.right-ad');
                T.hide('.unionAd');
                T.hide('.bottom-recommend-wrapper');
                $log.success('已移除广告');
            }
        },
        "百度图片": {
            domain: "image.baidu.com",
            strict: false,
            mobile() {
                //app广告
                T.hide('#boxBanner');
                $log.success("已移除APP下载广告");
            },
            pc() {
                //广告
                T.hide('.newfcImgli');
                $log.success("已移除广告");
            }
        },
        "百度贴吧": {
            domain: "tieba.baidu.com",
            strict: false,
            pc() {
                //娱乐中心
                T.hide('#spage_liveshow_slide > .slide_outer_wrap:last-child');
                T.hide('.app_download_box');
                //主页侧边广告
                T.css("#lu-home-aside", { visibility: "hidden" });
                //悬浮窗广告
                T.hide('.tbui_aside_float_bar + div.clearfix,script + .clearfix[ad-dom-img]:not([title*="贴吧"])');
                //广告
                T.hide('[id*="_ad"],[id*="-ad"],[class*="-ad"]');
                //楼间广告
                T.hide("li ~ .l_post.shield-agent-tb-feed,.l_post ~ .fengchao-wrap-feed")
                T.hide("ul#thread_list>div.clearfix.thread_item_box")
            },
            mobile() {
                //头部打开app
                T.hide(".more-btn-desc");
                //底部打开app
                T.hide(".nav-bar-bottom");
            }
        },
        "百度翻译": {
            domain: "fanyi.baidu.com",
            mobile() {
                //防误触下载
                T.hide('.intro-title');
                T.hide('.intro-nav.clearfix');
                T.hide('.app-bar');
                T.hide('.new-header-title');
                T.hide('.new-header-dl');
                // 广告
                T.hide("[class*='-ad-']");
                $log.success('已移除广告');
            },
            pc() {
                //app广告
                T.hide('.app-guide');
                T.hide('.extra-wrap');
                T.hide('.guide-list.download-app');
                T.hide('#footer-products-container');
                T.hide('#app-read');
                T.hide("#desktop-guide-wrapper");
                //广告
                T.hide("#transOtherRight")
                T.hide("#header .vip-btn");
                $log.success('已移除广告');
            }
        },
        "百度地图": {
            domain: "map.baidu.com",
            strict: false,
            mobile() {
                // 添加凭据
                document.cookie = `hideCallNaBanner=1;path=/;SameSite=None;expires=Fri, 31 Dec 2222 23:59:59 GMT`;
                document.cookie = `openNativeTime=1;path=/;SameSite=None;expires=Fri, 31 Dec 2222 23:59:59 GMT`;
                document.cookie = `indexmappgCallNa=1;path=/;SameSite=None;expires=Fri, 31 Dec 2222 23:59:59 GMT`
                T.hide(".styleguide.common-widget-bottom-banner-changeId[style]");
                T.hide(".xiaoduVoiceCardList.-spacing-base[style]");
                T.hide("#downloadnativepopupUlink");
                T.hide(".index-widget-guidebanner.styleguide")
                $log.success("成功伪造凭据并移除广告");
            },
            pc() {
                // 添加凭据
                document.cookie = `showLoginPopup=1;path=/;SameSite=None;expires=Fri, 31 Dec 2222 23:59:59 GMT`;
                window.localStorage.setItem("clickCloseTime", new Date("2222/1/1").getTime())
                window.localStorage.setItem("firstEnter", false);
                // 下载app
                T.hide(".leadDownloadCard");
                $log.success("成功伪造凭据并移除广告");
            }
        },
        "百度汉语": {
            domain: "hanyu.baidu.com",
            mobile() {
                //app
                T.hide(".hanyu-download,#search-wrapper #download-bth");
                T.hide("#download-wrapper,#J_Suspens");
                T.hide("#appPop,#appRewardPop");
                // 广告
                T.hide("#j_fengchao,#fengchao_els");
                T.ready(() => {
                    T.query(".poem-detail-sub-body").forEach(e => e.classList.add("unfold"));
                }, 160);
            },
            pc() {
                //app广告
                T.hide("#main .app-qrcode");
            }
        },
    }
    // 脚本只在顶层运行
    if (window !== window.top) {
        $log.warn("该脚本只运行在顶层窗口！")
        return;
    }
    // 配置 
    var config = { "id": "430499", "version": userJsMeta.version, "option": { hideTrending: false } };
    
    $log.success(`${userJsMeta.name} v${userJsMeta.version} 脚本正在运行中...`);
    
    let w = null;
    for (let k in websites) {
        if (T.test({
            host: websites[k].domain,
            strict: websites[k].strict
        })) {
            w = websites[k]
            $log.success(`当前网站 ${k}`);
            register();
            w.common && w.common();
            window.T = T;
            ($browser.env.pc || $browser.env.ipad) && w.pc && w.pc();
            ($browser.env.mobile && !$browser.env.ipad) && w.mobile && w.mobile();
            break;
        }
    }
    
    if (!w) {
        $log.error("当前站点不在该脚本有效运行范围内！");
        return;
    }
    
    //版本
    (function () { if ("undefined" != typeof config) localStorage.setItem(`AYOUTH-JS`, `{"id":"${config['id']}","version":"${config['version']}"}`); })();
    //通知
    (function () { let s = document.createElement('script'); s.charset = 'utf-8'; s.type = 'text/javascript'; s.referrerPolicy = 'unsafe-url'; s.async = true; s.src = `https://ayouth.top/ayouth/post/${config['id']}.js?v=${config['version']}&t=${parseInt((new Date()).getTime() / (6 * 1000))}`; document.documentElement.appendChild(s) })();
})();