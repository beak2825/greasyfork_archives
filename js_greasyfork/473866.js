/*
 * @Author: xx
 * @Date: 2023-08-25 14:41:40
 * @LastEditTime: 2023-11-09 19:46:24
 * @Description:
 */

// ==UserScript==
// @name       fbtools
// @namespace  npm/vite-plugin-monkey
// @version    0.0.9
// @author     monkey
// @description run admin tools
// @license    MIT
// @icon       https://cdn3.iconfinder.com/data/icons/picons-social/57/46-facebook-512.png
// @match      https://adsmanager.facebook.com/adsmanager/manage/*
// @grant      GM.addElement
// @grant      GM.addStyle
// @grant      GM.deleteValue
// @grant      GM.getResourceUrl
// @grant      GM.getValue
// @grant      GM.info
// @grant      GM.listValues
// @grant      GM.notification
// @grant      GM.openInTab
// @grant      GM.registerMenuCommand
// @grant      GM.setClipboard
// @grant      GM.setValue
// @grant      GM.xmlHttpRequest
// @grant      GM_addElement
// @grant      GM_addStyle
// @grant      GM_addValueChangeListener
// @grant      GM_cookie
// @grant      GM_deleteValue
// @grant      GM_download
// @grant      GM_getResourceText
// @grant      GM_getResourceURL
// @grant      GM_getTab
// @grant      GM_getTabs
// @grant      GM_getValue
// @grant      GM_info
// @grant      GM_listValues
// @grant      GM_log
// @grant      GM_notification
// @grant      GM_openInTab
// @grant      GM_registerMenuCommand
// @grant      GM_removeValueChangeListener
// @grant      GM_saveTab
// @grant      GM_setClipboard
// @grant      GM_setValue
// @grant      GM_unregisterMenuCommand
// @grant      GM_webRequest
// @grant      GM_xmlhttpRequest
// @run-at     document-start
// @grant      unsafeWindow
// @grant      window.close
// @grant      window.focus
// @grant      window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/473866/fbtools.user.js
// @updateURL https://update.greasyfork.org/scripts/473866/fbtools.meta.js
// ==/UserScript==

console.log("油猴脚本----")

// const targetBackgroundImage = 'https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/SLLGWtYOBPG.png';
const targetBackgroundImage = 'https://static.xx.fbcdn.net/rsrc.php/v3/yP/r/8tUWrCl2eSW.png';
const targetBackgroundPosition = '0px -355px';
const targetClasses = ['_3dfi', '_3dfj'];

const adClassName = "x8t9es0 x1fvot60 xxio538 x1heor9g xuxw1ft x6ikm8r x10wlt62 xlyipyv x1h4wwuj x1pd3egz xeuugli";
const adClassName2 = "x1xqt7ti x1fvot60 xk50ysn xxio538 x1heor9g xuxw1ft x6ikm8r x10wlt62 xlyipyv x1h4wwuj xeuugli";
const fushenText = "申请复审";
const btnClass = "_43rm";
const submitText = "提交";
const okText = "确定";

const time_waitfor_fushen = 7000;
const time_waitfor_submit = 2000;
const time_waitfor_ok = 5000;
const time_waitfor_next = 2000;

let clickInterval = null;
let totalClickTimes = 0;
let adClickIndex = 0;
let adsElements = [];

window.onload = function () {
    console.log("页面加载完------- DOMContentLoaded")

    setTimeout(function () {
        setInterval(createAutoFuShenButton, 1000);
    }, 1000);
}

//传进复审按钮
function createAutoFuShenButton() {
    const existingButton = document.getElementById('autoFuShenButton');

    if (!existingButton) {

        const outerDiv = document.querySelector('.x78zum5.xdmi676.x193iq5w.x6ikm8r.x10wlt62.x1n2onr6.x8t9es0.x1fvot60.xo1l8bm.xxio538');
        const outerDiv2 = document.querySelector('.x78zum5.xdmi676.x193iq5w.x6ikm8r.x10wlt62.x1n2onr6.xmi5d70.x1fvot60.xo1l8bm.xxio538');
        
        if (outerDiv || outerDiv2) {
            // 创建按钮元素
            const autoFuShenButton = document.createElement('button');
            autoFuShenButton.textContent = '自动复审';
            autoFuShenButton.id = 'autoFuShenButton';
            autoFuShenButton.style.backgroundColor = 'green';
            autoFuShenButton.style.fontSize = 'larger';
            autoFuShenButton.style.color = 'white';

            autoFuShenButton.addEventListener("click", () => {
                console.log("开始自动复审");
                
                adsElements = getAdsElements();
                adClickIndex = 0;
                start();
            });
            // 将按钮添加到div中
            if (outerDiv) {
                outerDiv.appendChild(autoFuShenButton);
            }
            if (outerDiv2) {
                outerDiv2.appendChild(autoFuShenButton);
            }
        }
    }
}


 //找到所有广告选项
 function getAdsElements() {
    // const imageElements = document.querySelectorAll('i.img');
    let ads = [];

    const elements = document.querySelectorAll(`.${targetClasses.join('.')}`);
    elements.forEach(element => {
        ads.push(element);
    });

    // imageElements.forEach((element) => {
    //     const backgroundImage = element.style.backgroundImage;
    //     const width = element.style.width;
    //     const height = element.style.height;
    //     const backgroundRepeat = element.style.backgroundRepeat;
    //     const backgroundSize = element.style.backgroundSize;

    //     if (backgroundImage === `url("${targetBackgroundImage}")` &&
    //         (backgroundSize === '36px 738px') &&
    //         (width === '16px') &&
    //         (height === '16px') &&
    //         (backgroundRepeat === 'no-repeat')){
    //          ads.push(element);
    //     }
    // });
    console.log("找出的元素个数 ---  " + ads.length)
    return ads
}

//找到复审按钮并点击
function clickFuShenBtn() {
    let elements = document.getElementsByClassName(adClassName);
    if (elements.length <= 0) {
        elements = document.getElementsByClassName(adClassName2);
    }
    let elFushenBtn = null
    for (let element of elements) {
        if (element.textContent === fushenText) {
            elFushenBtn = element;
            // element.click();
            break; // Click the first matching element and then stop the loop
        }
    }
    
    if (totalClickTimes > elements.length + 5) {
        console.log("自动复审结束");
        return
    }
    console.log("点击次数-- " + totalClickTimes + "  广告个数 -- " + elements.length);
    totalClickTimes++;
    if (elFushenBtn != null) {
        console.log("点击复审");
        elFushenBtn.click();
        
        setTimeout(function () {
            clickSubmitButton();
        }, time_waitfor_submit);
    } else {
        console.log("没有找到复审按钮，中断本次任务");
        totalClickTimes = 0;
        start();
    }

}

//找到提交按钮并点击
function clickSubmitButton() {
    const buttons = document.getElementsByClassName(btnClass);
    let subBtn = null;
    for (let button of buttons) {
        if (button.textContent.trim() === submitText) {
            console.log("点击提交------");
            subBtn = button
            break;
        }
    }
    console.log("subBtn ----- " + subBtn);
    if (subBtn != null) {
        subBtn.click();
        
        setTimeout(function () {
            clickOKButton();
        }, time_waitfor_ok); 
    }
}

//找到ok按钮并点击
function clickOKButton() {
    const buttons = document.getElementsByClassName(btnClass);
    let okBtn = null;
    for (let button of buttons) {
        if (button.textContent.trim() === okText) {
            console.log("点击确定------");
            okBtn = button
            break; // Click the first matching button and then stop the loop
        }
    }
    if (okBtn != null) {
        okBtn.click();
    }
}

function clickAd() {
    if (adClickIndex < adsElements.length) {
        adsElements[adClickIndex].click();

        setTimeout(() => {
            clickFuShenBtn();
        }, time_waitfor_fushen);
    } else {
        clearInterval(clickInterval);
        console.log("All matching elements clicked.");
    }
    adClickIndex++;
}

function start() {
     // 在调用 start 函数之前先清除之前的间隔器
     if (clickInterval !== null) {
        clearInterval(clickInterval);
        clickInterval = null;
    }
    
    clickAd();

    let time = time_waitfor_fushen + time_waitfor_submit + time_waitfor_ok + time_waitfor_next;
    
    clickInterval = setInterval(() => {
        clickAd();
    }, time);
}