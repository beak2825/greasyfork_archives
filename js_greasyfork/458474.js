// ==UserScript==
// @name         移除广告、好用网站收藏
// @namespace    http://tampermonkey.net/
// @version      1.90.2
// @description  进入网站【http://0000.com】看到收藏菜单.移除百度推广广告，影视广告，跳过知乎等的中间页
// @author       Godow
// @match        *://*/*
// @run-at       document-body
// @icon         https://goduck.cc/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458474/%E7%A7%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E3%80%81%E5%A5%BD%E7%94%A8%E7%BD%91%E7%AB%99%E6%94%B6%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/458474/%E7%A7%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E3%80%81%E5%A5%BD%E7%94%A8%E7%BD%91%E7%AB%99%E6%94%B6%E8%97%8F.meta.js
// ==/UserScript==
 
 
// 我的主页，常用网站收藏
const myHome = () => {
    document.querySelectorAll("body *").forEach(i => i.remove());
    document.title = "Own List";
    const catas = {
        "影视": {
            "影视工厂": "//www.ysgcapp.com/",
            "BL解析": "//svip.bljiex.cc",
            "茶杯狐影视": "//cupfox.app/",
            "欧乐影院": "//olevod.me/",
            "新视觉影院": "//www.dh6080.com/",
        },
        "图片": {
            "高清图库": "//unsplash.com",
            "壁纸": "//bz.zzzmh.cn",
            "照片转卡通": "//www.toonme.com",
            "图片智能擦除": "//magicstudio.com/magiceraser",
            "图片消除背景": "//www.remove.bg/zh",
            "在线鼠标作图": "//weavesilk.com/",
            "改图鸭": "//www.gaituya.com/manhua/",
        },
        "程序": {
            "UI元素": "//uiverse.io/",
            "喵影视TV": "http://www.miaotvs.cn/",
        },
        "学习": {
            "英语练习": "//elllo.org",
        },
        "游戏": {
            "红白机游戏": "//www.yikm.net/",
        },
        "信息": {
            "inShort": "https://inshorts.com/en/read",
            "short pedia": "https://www.shortpedia.com/en-in",
            "CNN": "https://edition.cnn.com",
            "latestly": "https://www.latestly.com",
            "mint": "https://www.livemint.com",
        }
    };

    Object.keys(catas).forEach(cataName => {
        const div = document.createElement("div");
        const title = document.createTextNode(cataName);
        div.appendChild(title);
        div.style = "background-color: gray; color: white; padding: 6px;"
        document.body.appendChild(div);
        Object.keys(catas[cataName]).forEach(i => {
            let a = document.createElement('a');
            a.href = catas[cataName][i];
            a.appendChild(document.createTextNode(i));
            a.style = "margin: 20px 50px;display: inline-block";
            document.body.appendChild(a);
        })
    })
}
 
 
// 跳过中间页
const jumpMidPage = () => {
    if (/^\?target\=http/.test(location.search)) {
        const targetUrl = decodeURIComponent(location.search).match(/(?<=\?target\=)http.+/)?.[0];
        if (targetUrl) {
            location.href = targetUrl;
        }
    }
}
 
const baidu = () => {
    // 去除百度推广广告
    const rmBdAds = (ads) => {
        ads.forEach(ad => {
            let ele = ad;
            while(ele?.parentNode?.id !== 'content_left') {
                ele = ele?.parentNode;
                if (!ele) {
                    break;
                }
            }
            ele?.remove();
        })
    };
    const ads1 = Array.from(document.querySelectorAll("a"))?.filter(i => i.text === '广告');
    const ads2 = document.querySelectorAll("span[data-tuiguang]");
    rmBdAds(ads1);
    rmBdAds(ads2);
}


const fixedEle = () => {
    // 固定页面指定元素到右上角，尺寸300px
    let fixedEleMark = new URLSearchParams(location.search).get("fixed");
    if (!fixedEleMark) return;
    if (fixedEleMark[0] === '$') {
        // 使用$代替#
        fixedEleMark = fixedEleMark.split('')
        fixedEleMark[0] = '#';
        fixedEleMark = fixedEleMark.join('');
    }
    const fixedEle = document.querySelector(fixedEleMark) || document.querySelector('#' + fixedEleMark);
    if (fixedEle) {
        fixedEle.style.zIndex = "1000";
        fixedEle.style.position = "fixed";
        fixedEle.style.left = "calc(100vw - 300px)";
        fixedEle.style.top = "0";
        fixedEle.style.width = "300px";
        fixedEle.style.height = "300px";
    }
}

// 允许页面复制csdn
const enableCopy = () => {
    'use strict';

    //优化登陆后复制
    if (document.querySelector('code')?.css) {
        document.querySelector('code')?.css({'user-select':'unset'});
    }

    if (document.querySelector('#content_views pre')?.css) {
        document.querySelector('#content_views pre')?.css({'user-select':'unset'});
    }


    //移除“登陆后复制”按钮
    document.querySelector('.hljs-button')?.remove();
    //移除readmore按钮，并显示全文
    document.querySelector('.hide-article-box')?.remove();
    if (document.querySelector('.article_content')?.css) {
        document.querySelector('.article_content')?.css({'height':'initial'});
    }


    //去除复制后的copyright小尾巴
    document.querySelectorAll('*').forEach(item=>{
        item.oncopy = function(e) {
            e.stopPropagation();
        }
    })
}

(function() {
    'use strict';
 
    jumpMidPage();
 
 
    const host = document.location.host;
    let fn;
    switch(host) {
        case '0000.com':
        case 'www.0000.com':
            fn = myHome;
            break;
        // BL解析
        case 'svip.bljiex.cc':
            fn = () => document.querySelectorAll('#section~*')?.forEach(i => i.remove());
            break;
        // 影视工厂
        case host.match(/^www.ysgc.*/)?.input:
            fn = () => {
                document.querySelectorAll('a[id*="_ad_"],#HMRichBox,#mhbottom_ad_box,#fulerbox,#hm_cpm_show,#fix_bottom_dom,div[id*="ad"]')?.forEach(i => i.remove());
                // document.querySelector(".col-lg-wide-75 > .myui-panel").style = "display: none";
                // document.querySelector("#JrJpeB").remove();
                document.querySelector("#HMimageleft")?.remove();
                document.querySelector("#HMimageright")?.remove();


            };
            break;
        case 'www.baidu.com':
            fn = baidu;
            break
        default:
            fn = () => {
                // 允许页面复制
                enableCopy();

                // 删除谷歌推广广告
                document.querySelectorAll(".adsbygoogle,#ad_unit,[id*=google_ads]")?.forEach(i => i.remove());
                // 删除百度推广广告
                document.querySelectorAll("iframe").forEach(i => i?.src?.includes("baidu.com") && i.remove());

                // 底部弹窗广告
                document.querySelector("#HMRichBox")?.remove();
                document.querySelector("#adv_wrap_hh")?.remove();

            }
            break;
    }
 
    if (fn) {
        // 每隔interval毫秒调用一次，共调用count次
        const timerFn = (interval, count) => {
            const timer = setInterval(() => {
                fn();
                if((--count) < 0) {
                    clearInterval(timer);
                }
            }, interval)
        }
        timerFn(100, 10);
        timerFn(1000, 2);
    }

    setTimeout(fixedEle, 2e3);
})();