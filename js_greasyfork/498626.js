// ==UserScript==
// @name         石锤科技
// @namespace    http://tampermonkey.net/
// @version      8.2
// @description  空投
// @author        开启数字空投财富的发掘之旅
// @match        *://*.blockx.fun/*
// @match        *://*.sidequest.rcade.game/*
// @match        *://*.forge.gg/*
// @match        *://*.chat.nakame.social/*
// @match        *://*.space3.gg/*
// @match        *://*.liveart.io/*
// @match        *://*.starrynift.art/*
// @match        *://*.task.onenesslabs.io/*
// @match        *://*.www.baidu/*
// @match        *://*.xnet.xtremeverse.xyz/*
// @match        *://*.ai.gmnetwork.ai/*
// @match        *://*.renaissance.artela.network/*
// @match        https://www.baidu.com/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498626/%E7%9F%B3%E9%94%A4%E7%A7%91%E6%8A%80.user.js
// @updateURL https://update.greasyfork.org/scripts/498626/%E7%9F%B3%E9%94%A4%E7%A7%91%E6%8A%80.meta.js
// ==/UserScript==
function Arp(){
    for(let i = 1; i <= 30; i++) {
        try {
            let yes = `body > div:nth-child(11) > div > div > div.flex.flex-row.items-start.justify-center.w-full.text-white.sm\\:mt-0.mt-\\[52px\\] > div > div.sm\\:h-\\[756px\\].w-full.hidden.sm\\:flex.sm\\:flex-row.flex-col.items-center.justify-center.sm\\:gap-6.gap-10.mt-0.text-white.sm\\:pb-7 > div.w-\\[367px\\].sm\\:w-\\[714px\\].sm\\:bg-vincibg.bg-no-repeat.bg-vincibgMobile.sm\\:h-\\[700px\\].h-\\[81vh\\] > div > div.bg-\\[\\#0000c1\\].sm\\:bg-\\[\\#00000000\\].flex.flex-col.gap-2.justify-start.overflow-y-scroll.sm\\:pb-0.pb-6.h-\\[70vh\\].sm\\:h-\\[520px\\].rounded-b-3xl > div:nth-child(${i}) > div > div > div > div:nth-child(1) > button`;
            let selector = `body > div:nth-child(12) > div > div > div.flex.flex-row.items-start.justify-center.w-full.text-white.sm\\:mt-0.mt-\\[52px\\] > div > div.sm\\:h-\\[756px\\].w-full.hidden.sm\\:flex.sm\\:flex-row.flex-col.items-center.justify-center.sm\\:gap-6.gap-10.mt-0.text-white.sm\\:pb-7 > div.w-\\[367px\\].sm\\:w-\\[714px\\].sm\\:bg-vincibg.bg-no-repeat.bg-vincibgMobile.sm\\:h-\\[700px\\].h-\\[81vh\\] > div > div.bg-\\[\\#0000c1\\].sm\\:bg-\\[\\#00000000\\].flex.flex-col.gap-2.justify-start.overflow-y-scroll.sm\\:pb-0.pb-6.h-\\[70vh\\].sm\\:h-\\[520px\\].rounded-b-3xl > div:nth-child(${i}) > div > div > div > div:nth-child(1) > button`;
            let three =`body > div > div > div > div.flex.flex-row.items-start.justify-center.w-full.text-white.sm\\:mt-0.mt-\\[52px\\] > div > div.sm\\:h-\\[756px\\].w-full.hidden.sm\\:flex.sm\\:flex-row.flex-col.items-center.justify-center.sm\\:gap-6.gap-10.mt-0.text-white.sm\\:pb-7 > div.w-\\[367px\\].sm\\:w-\\[714px\\].sm\\:bg-vincibg.bg-no-repeat.bg-vincibgMobile.sm\\:h-\\[700px\\].h-\\[81vh\\] > div > div.bg-\\[\\#0000c1\\].sm\\:bg-\\[\\#00000000\\].flex.flex-col.gap-2.justify-start.overflow-y-scroll.sm\\:pb-0.pb-6.h-\\[70vh\\].sm\\:h-\\[520px\\].rounded-b-3xl > div > div > div > div > div:nth-child(${i}) > div > button`;
            safeClickWithTryCatch(selector);
            safeClickWithTryCatch(yes);
            safeClickWithTryCatch(three);
        } catch (error) {
        }
    }
}
function setInputValue(url,ele) {
    try {
        const inputElement = document.querySelector(ele);
        if (inputElement) {
            inputElement.value = url;
            return true;
        } else {
        }
    } catch (error) {
    }
}
function AuEight(){
    safeClickWithTryCatch("#__next > main > div > div.header.a8-header-desktop--container > div > div > div > div:nth-child(2) > div > div:nth-child(1) > button > span:nth-child(2)");
    const elementsToClick = [1, 2 ,3, 4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
    for (const index of elementsToClick) {
        const selector = `#daily-checkin-container > div.space-3-row.css-5rvl8y > div.space-3-col.space-3-col-24.overlay-container.css-5rvl8y > div > div:nth-child(1) > div > div:nth-child(${index}) > div > div > div > div.space-3-col.space-3-col-24.col-align-end.overlay-container.checkin-reward-card__contents--thumb-container.css-5rvl8y > div > div > div > img`;
        safeClickWithTryCatch(selector);
        const sv = `#daily-checkin-container > div.space-3-row.css-5rvl8y > div.space-3-col.space-3-col-24.overlay-container.css-5rvl8y > div > div:nth-child(1) > div > div:nth-child(${index}) > div > div > div > div.space-3-col.space-3-col-24.col-align-end.overlay-container.checkin-reward-card__contents--thumb-container.css-5rvl8y > div.sp3-swiper-container.sp3-swiper-pagination-inner > div.swiper.swiper-initialized.swiper-horizontal.streak-reward-thumbs-sw-inner.swiper-backface-hidden > div > div > div > img`
        safeClickWithTryCatch(sv);
    }
}
function Oneness(five) {
    setInterval(function() {
        safeClickWithTryCatch("#botList > div:nth-child(2) > div._header_1ht1h_22 > div._logo_1ht1h_26 > img");
        safeClickWithTryCatch("#botInfo > div._info_ifdm3_50 > button > span");},1000)
    safeClickWithTryCatch("#header_flex > div._header_left_xkzq7_188 > div._starry_menu_xkzq7_34 > div > div > div:nth-child(6) > div");
}
function Cookie(){
    safeClickWithTryCatch("body > div.ReactModalPortal > div > div > div > div > button > img");
    var btnspan = "#root > div > div > div.main > div.content > div > div.spin-container > div > button";
    safeClickWithTryCatch(btnspan);
    var spanTwo ="body > div.ReactModalPortal > div > div > div > div > button.spin-btn";
    safeClickWithTryCatch(spanTwo);
}
function LiveartclickImageElement() {
    safeClickWithTryCatch("body > div:nth-child(3) > div > div > div.bg-\\[\\#F5F5F5\\].p-5.sm\\:p-10 > div > div > div > div.relative.mt-8 > div.relative.flex.h-\\[620px\\].w-\\[335px\\].flex-col.items-center.rounded-2xl.bg-white.p-8.shadow-lg.sm\\:w-\\[480px\\].px-8.py-6.sm\\:px-16.sm\\:py-12 > div.mt-8.w-full.sm\\:mt-\\[75px\\] > button");
    var btn =document.querySelector("body > div:nth-child(3) > div > div > div.bg-\\[\\#F5F5F5\\].p-5.sm\\:p-10 > div > div > div > div.relative.h-\\[620px\\].w-\\[90vw\\].max-w-\\[335px\\].sm\\:max-w-\\[480px\\] > div:nth-child(3) > div > div > div.mt-4.flex.w-full.gap-6 > button:nth-child(1)")
    var result = checkTextContentTwo("body > div:nth-child(3) > div > div > div.bg-\\[\\#F5F5F5\\].p-5.sm\\:p-10 > div > div > div > div.relative.mt-8 > div.relative.flex.h-\\[620px\\].w-\\[335px\\].flex-col.items-center.rounded-2xl.bg-white.p-8.shadow-lg.sm\\:w-\\[480px\\].px-8.py-6.sm\\:px-16.sm\\:py-12 > div.mt-8.w-full.sm\\:mt-\\[75px\\] > button","Start")
    setInterval(function(){
        let selectors = [
            "body > div:nth-child(3) > div > div > div.bg-\\[\\#F5F5F5\\].p-5.sm\\:p-10 > div > div > div > div.relative.h-\\[620px\\].w-\\[90vw\\].max-w-\\[335px\\].sm\\:max-w-\\[480px\\] > div:nth-child(3) > div > div > div.mt-4.flex.w-full.gap-6 > button:nth-child(1)",
            "body > div:nth-child(3) > div > div > div.bg-\\[\\#F5F5F5\\].p-5.sm\\:p-10 > div > div > div > div.relative.h-\\[620px\\].w-\\[90vw\\].max-w-\\[335px\\].sm\\:max-w-\\[480px\\] > div:nth-child(3) > div > div > div.mt-4.flex.w-full.gap-6 > button:nth-child(2)"
        ];
        let randomIndex = Math.floor(Math.random() * selectors.length);
        let randomSelector = selectors[randomIndex];
        let button = document.querySelector(randomSelector);
        if (button) {
            setTimeout(function() {button.click();},2000)
        } else {
            console.error('未找到对应的按钮');
        }
    },500)
}
function Sun(){
    safeClickWithTryCatch("#bodyNode > div.Box-sc-1rsndmr-0.styles__WrapT-sc-1gtzf12-4.lkoHY.fUbung > div.Box-sc-1rsndmr-0.styles__ZoomContentWrap-sc-1gtzf12-6.lkoHY.bXWZCr > div > div.AirdropNavigatorComponent__NavigatorContainer-sc-14nwifn-1.jmhEKe > div.AirdropNavigatorComponent__NavigationListContainer-sc-14nwifn-3.YQTVy > div:nth-child(2)");
    var vit = "#bodyNode > div.Box-sc-1rsndmr-0.styles__WrapT-sc-1gtzf12-4.lkoHY.fUbung > div.Box-sc-1rsndmr-0.styles__ZoomContentWrap-sc-1gtzf12-6.lkoHY.foLijU > div > div.airdrop__AirDropContentContainer-sc-4wk6us-0.fSvvNx > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div > div > div > div.SocialFarming__RowFlex-sc-neia86-0.kpEsSO > div:nth-child(2)";
    var t =checkTextContentTwo(vit,"Verify");
    if(t){
        safeClickWithTryCatch(vit);
    }else if(t==null){
        let button = document.querySelector('.SocialFarming__FarmButton-sc-neia86-4.gbXUrC');
        if (button) {
            button.click();
        } else {
            console.error('未找到指定的按钮元素');
        }
    }
}
function clickImageBySrc(imageSrc) {
  try {
    const allImages = document.getElementsByTagName('img');
    for (let i = 0; i < allImages.length; i++) {
      if (allImages[i].src === imageSrc) {
        allImages[i].click();
        break;
      }
    }
  } catch (error) {
    console.error('出现错误:', error);
  }
}
function Game(){
    var forgeBtn ="#root > div > div.user__wrapper.bg-home > main > div.home-topcontent > header > div.home-rewards__head > div > button";
    safeClickWithTryCatch(forgeBtn)
}
function safeClickWithTryCatch(targetElement) {
    try {
        var element = document.querySelector(targetElement);
        if (element) {
            element.click();
            return true;
        } else {
            throw new Error(`未找到：${targetElement}`);
        }
    } catch (error) {
        return false;
    }
}
function img(url){
    var imgElement = document.querySelector(url);
    if (imgElement.complete) {
        imgElement.click();
    } else {
        imgElement.addEventListener('load', function() {
            imgElement.click();
        });
    }
}
function OverallMethodB(){
    var hostname = window.location.hostname;
    switch (hostname) {
        case 'www.baidu.com':
            Rpa();
            break;
        default:
            break;
    }
}
function LTwo(){
    var errClick = checkTextContentTwo("#__next > div.MuiSnackbar-root.MuiSnackbar-anchorOriginTopRight.css-3sz7wh > div > div > span","Network Error");
    if(errClick){
        location.reload();
    }
    safeClickWithTryCatch("#__next > div > div.style_content__q7cd_.undefined > div > div > div.style_content__D06FQ > div:nth-child(3) > div > div > div:nth-child(2) > div.style_operation__r5nr2 > div:nth-child(2) > span");
    for(let i = 1; i <= 8; i++) {
        (function(index) {
            try {
                var shu = document.querySelector(`#__next > div > div.style_content__q7cd_.undefined > div > div > div.style_content__D06FQ > div.style_container___05Wa > div > div.style_cardBox__rqfz0 > div.style_section__Q770k > div:nth-child(${index}) > div > span`);
                if(shu) {
                    shu.click();
                } else {
                }
            } catch (error) {
            }
        })(i);
    }
}
function Rpa() {
    const urls = [
        'https://liveart.io/quests/predict-art-price',
        'https://renaissance.artela.network/vision?R=2agshf',
        'https://forge.gg/home',
        'https://sidequest.rcade.game/quests',
        'https://space3.gg/a8-airdrop',
        'https://task.onenesslabs.io?code=pLWJs',
        'https://launchpad.gmnetwork.ai/mission',
        'https://xnet.xtremeverse.xyz/earn',
        'https://chat.nakame.social/onboarding'
    ];
    urls.forEach(url => {
        let newWindow = window.open(url, '_blank');
        if (newWindow) {
            newWindow.addEventListener('load', function() {
            });
        } else {
            setTimeout(() => {
                let newWindowRetry = window.open(url, '_blank');
                if (newWindowRetry) {
                    newWindowRetry.addEventListener('load', function() {
                    });
                } else {
                }
            }, 15000);
        }
    });
}
function checkTextContent(selector, expectedText) {
    try {
        var element = document.querySelector(selector);
        if (element.textContent.trim() === expectedText) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
    }
}
function checkTextContentTwo(selector, expectedText) {
    try {
        var element = document.querySelector(selector);
        if (element.textContent.trim() === expectedText) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
    }
}
(function() {
    var s = true;
    var One = true;
    var Two = true;
    var Three = true;
    var Four = true;
    var Sex = true;
    var five = true;
    var Seven = true;
    var eight = true;
    var a8Two = true;
    var tOne = 1000;
    var tTwo = 2000;
    var tThree = 3000;
    var tFour = 4000;
    var tFive = 5000;
    var url ="img[src='https://d1uoymq29mtp9f.cloudfront.net/web/img/chatIcons/twiter.png']";
    var xzval = "#layout > div._content_1gpq5_23 > div._chat_wrap_1fgi6_1 > div > div._right_content_1fgi6_240 > div > div._chat_top_1fgi6_310 > div > div:nth-child(1) > label > span > input";
    var gox ="#layout > div._content_1gpq5_23 > div._chat_wrap_1fgi6_1 > div > div._right_content_1fgi6_240 > div > div._select_count_1fgi6_623 > div._showmore_btns_1fgi6_904 > div:nth-child(1) > img";
    let confirmAnswer;
    if(window.location.hostname=='ai.gmnetwork.ai'){
        setInterval(function() {
            LTwo();
            var go = document.querySelector("#__next > div > div.style_content__q7cd_.undefined > div > div > div.style_content__D06FQ > div:nth-child(3) > div > div > div:nth-child(2) > div.style_operation__r5nr2 > div:nth-child(1) > span") ;
            if(go && Three){
                Three=false;
                go.click();
            }
        },5000)
    }
    if(window.location.hostname=='task.onenesslabs.io'){
        setTimeout(function() {
            setInterval(function() {
                var res = safeClickWithTryCatch("#app > div.flex.justify-between.max-w-\\[1920px\\].m-auto.max-md\\:flex-col > div.home-left-container.flex-1.max-xl\\:w-\\[100\\%\\].md\\:min-w-\\[800px\\].max-sm\\:pb-\\[calc\\(450\\/750\\*100vw\\)\\].md\\:overflow-scroll.md\\:h-\\[100vh\\] > div > div:nth-child(5) > div:nth-child(2) > div > div.flex.max-sm\\:items-center.mt-\\[3px\\].ml-\\[calc\\(32\\/1920\\*100vw\\)\\].max-sm\\:ml-\\[calc\\(32\\/750\\*100vw\\)\\] > button");
                if(res && Seven){
                    Seven=false;
                }
            },3000)
            setInterval(function() {
                safeClickWithTryCatch("#app > div.flex.justify-between.max-w-\\[1920px\\].m-auto.max-md\\:flex-col > div.home-left-container.flex-1.max-xl\\:w-\\[100\\%\\].md\\:min-w-\\[800px\\].max-sm\\:pb-\\[calc\\(450\\/750\\*100vw\\)\\].md\\:overflow-scroll.md\\:h-\\[100vh\\] > div > div:nth-child(5) > div:nth-child(2) > div > div.flex.max-sm\\:items-center.mt-\\[3px\\].ml-\\[calc\\(32\\/1920\\*100vw\\)\\].max-sm\\:ml-\\[calc\\(32\\/750\\*100vw\\)\\] > div > img");
            },1000)
        },10000);
    }
    if (window.location.host.includes('liveart.io') || window.location.host === 'launchpad.gmnetwork.ai') {
        window.onload = function() {
            setInterval(function() {
                var hostname = window.location.hostname;
                switch (hostname) {
                    case 'liveart.io':
                        var result = checkTextContentTwo("body > div:nth-child(3) > div > div > div.bg-\\[\\#F5F5F5\\].p-5.sm\\:p-10 > div > div > div > div.relative.mt-8 > div.relative.flex.h-\\[620px\\].w-\\[335px\\].flex-col.items-center.rounded-2xl.bg-white.p-8.shadow-lg.sm\\:w-\\[480px\\].px-8.py-6.sm\\:px-16.sm\\:py-12 > div.mt-8.w-full.sm\\:mt-\\[75px\\] > button","Start");
                        if(result){
                            LiveartclickImageElement();
                        }
                        break;
                }
            },tTwo)
        }
    }else{
        if(window.location.herf='https://starrynift.art/ai/reward'){
            setInterval(function() {
                if(five){
                    if(safeClickWithTryCatch("#layout > div._content_1gpq5_23 > div._aiReward_u89wy_1 > div:nth-child(2) > div > div._historyTitle_u89wy_12 > span")){
                        five=false;
                    }
                }
            }, 7000);
        }
        if(window.location.herf='https://chat.nakame.social/onboarding'){
            setInterval(function() {
                var a8_two = "#OnBoarding > div > div.left-body > div.menu-group > button.assigment-button > div.text-group";
                safeClickWithTryCatch(a8_two)
                if(a8Two){
                    var result= safeClickWithTryCatch("#OnBoarding > div > div.center-body > div.assignment-body > div.assignment-list > div:nth-child(1) > div.group-btn > button");
                    if(result){
                        a8Two=false;
                    }
                }
            },3000)
        }
        if(window.location.hostname!='task.onenesslabs.io'){
            window.onload = function() {
                setTimeout(function() {
                    var host = window.location.hostname;
                    switch (host) {
                        case 'www.baidu.com':
                            Rpa();
                            break;
                        default:
                            break;
                    }
                }, 2000);
                setInterval(function() {
                    var hostname = window.location.hostname;
                    switch (hostname) {
                        case 'space3.gg':
                            AuEight();
                            break;
                        case 'starrynift.art':
                            Oneness();
                            var dh = "#layout > div._content_1gpq5_23 > div._chat_wrap_1fgi6_1 > div > div._right_content_1fgi6_240 > div > div._chat_top_1fgi6_310 > div._questions_1fgi6_349 > div > div:nth-child(1)";
                            safeClickWithTryCatch(dh);
                            var alertVa = document.querySelector("div > div > div > div.ant-notification-notice-message > div > div");
                            try {
                                if (alertVa && alertVa.textContent.trim() === 'Oops! You are eligible for 5 votes per day') {
                                    var xxx = safeClickWithTryCatch("#layout > div._content_1gpq5_23 > div._chat_wrap_1fgi6_1 > div > div._right_content_1fgi6_240 > div > div._chat_bottom_1fgi6_541 > div._chat_menu_1fgi6_548 > img");
                                    if(xxx){
                                        setInterval(function() {
                                            // 选择图片元素
                                            var imgElement = document.querySelector("img[src='https://d1uoymq29mtp9f.cloudfront.net/web/img/chatIcons/share.png']");
                                            if (imgElement.complete) {
                                                imgElement.click();
                                                setTimeout(function() {
                                                    var xz = safeClickWithTryCatch(xzval);
                                                    if(xz&&s){
                                                        s=false;
                                                        setTimeout(function() {
                                                            img(url);
                                                            setTimeout(function() {
                                                                window.open('https://starrynift.art/ai/reward', '_self');
                                                            },2000)
                                                        }, 2000);
                                                    }
                                                }, 1000);
                                            }
                                        }, 1000);
                                    }
                                }
                            } catch (error) {
                                // 这里可以处理异常，例如打印错误信息，或者执行其他错误处理逻辑
                                console.error('An error occurred:', error);
                                // 可以在这里添加其他的错误处理代码，例如发送错误报告等
                            }

                            break;
                        case 'sidequest.rcade.game':
                            Cookie();
                            var strat= "#root > div > div > div.main > div.content > div > div.mission-list > div.mission.special > div.right-section > button > span";
                            var res= safeClickWithTryCatch(strat);
                            if(res){
                                setTimeout(function(){
                                    safeClickWithTryCatch("body > div:nth-child(8) > div > div > div > div > div:nth-child(3) > div > div > div.btn-container > button > span");
                                }, 20000);
                            }
                            //for (let i = 3; i <= 10; i++) {
                                //try {
                                    //let button = document.querySelector(`#root > div > div > div.main > div.content.undefined > div > div.mission-list > div:nth-child(${i}) > div.right-section > button > span`);
                                    //if (button && button.textContent ==='start') {
                                        //if (button) {
                                            //button.click();
                                            //setTimeout(function(){
                                               // safeClickWithTryCatch("body > div:nth-child(8) > div > div > div > div > div:nth-child(3) > div > div > div.btn-container > button > span");
                                            //}, 20000);
                                        //}
                                    //}
                                //} catch (error) {
                                   // console.error(`在查找第 ${i} 个按钮时出错: ${error}`);
                               // }
                           // }
                            break;
                        case 'renaissance.artela.network':
                            //Arp();
                            break;
                        case 'forge.gg':
                            Game();
                            break;
                        case 'xnet.xtremeverse.xyz':
                            Sun();
                            break;
                        default:
                            break;
                    }
                },tThree)
                setInterval(function(){
                    safeClickWithTryCatch("body > div:nth-child(8) > div > div > div > div > button > img");
                },30000)
                setInterval(function(){
                    if(eight){
                        for(let i = 1; i <= 30; i++) {
                            var input1 = setInputValue('https://x.com/Artela_Network/status/1808031132275073136',`body > div > div > div > div.flex.flex-row.items-start.justify-center.w-full.text-white.sm\\:mt-0.mt-\\[52px\\] > div > div.sm\\:h-\\[756px\\].w-full.hidden.sm\\:flex.sm\\:flex-row.flex-col.items-center.justify-center.sm\\:gap-6.gap-10.mt-0.text-white.sm\\:pb-7 > div.w-\\[367px\\].sm\\:w-\\[714px\\].sm\\:bg-vincibg.bg-no-repeat.bg-vincibgMobile.sm\\:h-\\[700px\\].h-\\[81vh\\] > div > div.bg-\\[\\#0000c1\\].sm\\:bg-\\[\\#00000000\\].flex.flex-col.gap-2.justify-start.overflow-y-scroll.sm\\:pb-0.pb-6.h-\\[70vh\\].sm\\:h-\\[520px\\].rounded-b-3xl > div:nth-child(${i}) > div > div > div > div.w-full > div > input`);
                            var input2 = setInputValue('https://x.com/Artela_Network/status/1808031132275073136',`body > div:nth-child(12) > div > div > div.flex.flex-row.items-start.justify-center.w-full.text-white.sm\\:mt-0.mt-\\[52px\\] > div > div.sm\\:h-\\[756px\\].w-full.hidden.sm\\:flex.sm\\:flex-row.flex-col.items-center.justify-center.sm\\:gap-6.gap-10.mt-0.text-white.sm\\:pb-7 > div.w-\\[367px\\].sm\\:w-\\[714px\\].sm\\:bg-vincibg.bg-no-repeat.bg-vincibgMobile.sm\\:h-\\[700px\\].h-\\[81vh\\] > div > div.bg-\\[\\#0000c1\\].sm\\:bg-\\[\\#00000000\\].flex.flex-col.gap-2.justify-start.overflow-y-scroll.sm\\:pb-0.pb-6.h-\\[70vh\\].sm\\:h-\\[520px\\].rounded-b-3xl > div:nth-child(${i}) > div > div > div > div.w-full > div > input`);
                            eight=false;
                        }
                    }
                },3000)
                setInterval(function() {
                    if(window.location.hostname=='xnet.xtremeverse.xyz'){
                        safeClickWithTryCatch("#bodyNode > div.Box-sc-1rsndmr-0.styles__WrapT-sc-1gtzf12-4.lkoHY.fUbung > div.Box-sc-1rsndmr-0.styles__ZoomContentWrap-sc-1gtzf12-6.lkoHY.bWAtEj > div > div.AirdropNavigatorComponent__NavigatorContainer-sc-14nwifn-1.jmhEKe > div.AirdropNavigatorComponent__NavigationListContainer-sc-14nwifn-3.YQTVy > div:nth-child(2) > div.AirdropNavigatorComponent__NavigationItemContent-sc-14nwifn-7.ffXwpB > div.AirdropNavigatorComponent__NavigationItemTitle-sc-14nwifn-8.ldGPLJ > span")
                        safeClickWithTryCatch("#bodyNode > div.Box-sc-1rsndmr-0.styles__WrapT-sc-1gtzf12-4.lkoHY.fUbung > div.Box-sc-1rsndmr-0.styles__ZoomContentWrap-sc-1gtzf12-6.lkoHY.foLijU > div > div.AirdropNavigatorComponent__NavigatorContainer-sc-14nwifn-1.jmhEKe > div.AirdropNavigatorComponent__NavigationListContainer-sc-14nwifn-3.YQTVy > div:nth-child(2) > div.AirdropNavigatorComponent__NavigationItemContent-sc-14nwifn-7.ffXwpB > div.AirdropNavigatorComponent__NavigationItemTitle-sc-14nwifn-8.ldGPLJ > span");
                        safeClickWithTryCatch("body > div.ReactModalPortal > div > div > div > div > button > img");
                    }
                    if(Seven){
                        var result = checkTextContentTwo("#app > div.flex.justify-between.max-w-\\[1920px\\].m-auto.max-md\\:flex-col > div.home-left-container.flex-1.max-xl\\:w-\\[100\\%\\].md\\:min-w-\\[800px\\].max-sm\\:pb-\\[calc\\(450\\/750\\*100vw\\)\\].md\\:overflow-scroll.md\\:h-\\[100vh\\] > div > div:nth-child(5) > div:nth-child(2) > div > div.flex.max-sm\\:items-center.mt-\\[3px\\].ml-\\[calc\\(32\\/1920\\*100vw\\)\\].max-sm\\:ml-\\[calc\\(32\\/750\\*100vw\\)\\] > button","Start");
                        if(result){
                            alert(result)
                            Seven=false;
                            return;
                        }
                    }
                    var cil = "#layout > div._content_1gpq5_23 > div._aiReward_u89wy_1 > div:nth-child(2) > div > div:nth-child(3) > div._rightWrap_1tttg_20 > div._buttonWrap_1tttg_48 > button > span";
                    safeClickWithTryCatch(cil);
                    var cil2 = "#layout > div._content_1gpq5_23 > div._aiReward_u89wy_1 > div:nth-child(2) > div > div:nth-child(2) > div._rightWrap_1tttg_20 > div._buttonWrap_1tttg_48 > button > span";
                    safeClickWithTryCatch(cil2);
                    var ss =document.querySelector("body > div > div > div > div.flex.flex-row.items-start.justify-center.w-full.text-white.sm\\:mt-0.mt-\\[52px\\] > div > div.sm\\:h-\\[756px\\].w-full.hidden.sm\\:flex.sm\\:flex-row.flex-col.items-center.justify-center.sm\\:gap-6.gap-10.mt-0.text-white.sm\\:pb-7 > div.w-\\[367px\\].sm\\:w-\\[714px\\].sm\\:bg-vincibg.bg-no-repeat.bg-vincibgMobile.sm\\:h-\\[700px\\].h-\\[81vh\\] > div > div.bg-\\[\\#0000c1\\].sm\\:bg-\\[\\#00000000\\].flex.flex-col.gap-2.justify-start.overflow-y-scroll.sm\\:pb-0.pb-6.h-\\[70vh\\].sm\\:h-\\[520px\\].rounded-b-3xl > div:nth-child(9) > div > div > div > div:nth-child(1) > button");
                    safeClickWithTryCatch(ss);
                    var now="#dialog-\\:r2\\: > div > div > div > div > div > div:nth-child(3) > div.CounterClipped__Wrapper-sc-w6vnyi-0.dHVLWw.singleCut > div > button > span";
                    safeClickWithTryCatch(now);
                    var paht = "body > div:nth-child(3) > div > div > div.bg-\\[\\#F5F5F5\\].p-5.sm\\:p-10 > div > div > div > div > div.relative.flex.h-\\[620px\\].w-\\[335px\\].flex-col.items-center.rounded-2xl.bg-white.p-8.shadow-lg.sm\\:w-\\[480px\\] > div.mt-4 > button.flex-grow.rounded-3xl.px-4.py-2.font-poppins.font-medium.w-full.border.border-black.bg-white.text-black";
                    safeClickWithTryCatch(paht);
                    safeClickWithTryCatch("#Path > polygon:nth-child(1)");
                }, tOne);
            }
        }
    }
})();