// ==UserScript==
// @name         mokahr work time total
// @namespace    http://tampermonkey.net/
// @version      2024-04-99
// @description  主要功能：在core.mokahr.com/m/attendance?activeIndex=0 页面统计自己本周的加班时间；次要功能：mokahr全局去水印，在attendance页面增加会mokahr首页的链接。
// @author       Yearly
// @match        https://core.mokahr.com/*
// @match        https://core.mokahr.com/m/attendance*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mokahr.com
// @license      AGPL-v3.0
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/497018/mokahr%20work%20time%20total.user.js
// @updateURL https://update.greasyfork.org/scripts/497018/mokahr%20work%20time%20total.meta.js
// ==/UserScript==

GM_addStyle(
    '#watermarkContainer { display: none; }'
);

function timeDifference(startStr, endStr) {
    let [startHour, startMinute] = startStr.split(':').map(Number);
    let [endHour, endMinute] = endStr.split(':').map(Number);

    let startTotalMinutes = startHour * 60 + startMinute;
    let endTotalMinutes = endHour * 60 + endMinute;

    return endTotalMinutes - startTotalMinutes;
}

function timeTotal(){
    let todayDiv = document.querySelector('[class*="sd-Calendar-calendar-is-today"]').parentElement;

    let todayDivs = Array.from(document.querySelectorAll('[class*="sd-Calendar-calendar-is-today"]'));
    for (let div of todayDivs) {
        if ( div.getBoundingClientRect().x > 0) {
            todayDiv = div.parentElement;
            break;
        }
    }

    if(document.getElementById('myModal') !== null) {
        document.getElementById('myModal').style.display = 'null'
    }

    var overhoursTotal = 0;

    let i = 1;

    let TotalInfo="";

    let curDayDiv = todayDiv; //.previousSibling;    //curDayDiv.click();

    let checkInterval = setInterval(function() {

        let selenode = document.querySelector('[class*="sd-Calendar-calendar-selected-day"]');
        let loadnode = document.querySelector('[class*="sd-Loading-loading-"]');

        console.log("load" + selenode + loadnode);

        if (selenode != null && loadnode == null) {

            console.log("load done");

            curDayDiv = selenode.parentElement;

            if (curDayDiv.querySelector('[class*="restDayColor_"]') == null) {
                let curMon = document.querySelector('div[class^="sd-Spacing-spacing-inline"] div[class^="sd-Spacing-spacing-inline"]').textContent;
                let curDay = document.querySelector('[class*="sd-Calendar-calendar-selected-day"]').textContent;

                // 获取打卡时间
                let checkTimes = document.querySelectorAll('[class^="itemTimeBox"] [class^="sd-Spacing-spacing"] > [class^="timeLineTitleBold"]:first-child');
                let checkIn = checkTimes[0].textContent;
                let checkOut = checkTimes[checkTimes.length - 1].textContent;
                let overhours = (timeDifference(checkIn, checkOut)/60 - 9);
                let curInfo = curMon + curDay.padStart(2,'0') + "日, " + checkIn + "~" + checkOut+ "; "

                if (overhours < 0) {
                    overhours = 0;
                    curInfo += "暂无加时";
                } else {
                    curInfo += "加时: " + overhours.toFixed(3) + " h"
                }

                overhoursTotal += overhours;

                console.log(curInfo);

                TotalInfo = "<p style='margin-left:20px;'>" + curInfo + "</p>" + TotalInfo;

            } else {
                i = 8;
            }

            // click next
            curDayDiv = curDayDiv.previousSibling;
            if(curDayDiv) {
                curDayDiv.click();
            } else {
                i = 8;
            }


            if (++i > 7) {
                console.log("done-"+i);

                clearInterval(checkInterval);

                TotalInfo += "<p style='font-size:18px; font-weight:bold;'> 累计: " + overhoursTotal.toFixed(3) + "h </p>";

                let modalHtml = `<span class="close">✕</span>
                        <p style="font-size:18px; font-weight:bold;" >本周统计:</p>
                        ${TotalInfo}`;

                let modalCss = `
                <style>
                    #myModal {
                        display: none;
                        position: fixed;
                        z-index: 999;
                        top: 50%;
                        width: 400px;
                        padding: 15px;
                        overflow: auto;
                        background-color: #FFF;
                        border-radius: 8px;
                        box-shadow: 0 0 3px #1115;
                        font-size: 15px;
                        line-height:1.8;
                        font-family: Courier New", Courier, monospace;
                    }
                    .close {
                        float: right;
                        font-weight: bold;
                        text-decoration: none;
                        cursor:pointer;
                        line-height:0.7;
                    }
                </style>`;

                let modal = document.getElementById('myModal');
                if (modal == null) {
                    modal = document.createElement("div");
                    modal.id = 'myModal';
                }

                document.body.append(modal);

                modal.innerHTML = modalHtml + modalCss;
                modal.style.display = 'block';
                modal.style.left = (1-400/window.innerWidth)*50 + "%";
                let closeButton = document.querySelector('.close');
                closeButton.addEventListener('click', function() {
                    document.getElementById('myModal').style.display = 'none';
                });
            }
        }

    }, 500);
}

var addBtnTimer = setInterval(function(){
    let homelink = document.querySelector('a[href="/dashboard/home"]')
    if(!homelink) {
        const newHTML = `<span style="height:25px; display: inline-block;">🔹</span><a href="/dashboard/home" style="top:5px; font-weight:bold; font-size:16px; color:#06f; position:fixed; z-index:999;">首页</a>`
        let rootElement = document.querySelector("#root")
        rootElement.insertAdjacentHTML('afterbegin', newHTML);
    } else {
        clearInterval(addBtnTimer);
    }

    var targetDiv = document.querySelector('div[class^="sd-Spacing-spacing-inline"] div[class*="sd-Spacing-align-center"]');

    if (targetDiv && document.querySelector('div[class*="sd-Tabs-capsuleContainer"] > div[class*="sd-Tabs-capsuleActiveItem-"]').textContent=="日") {
        var mybutton = document.createElement('button');
        mybutton.textContent = '统计';
        mybutton.style="font-size:14px; margin:0px 10px 0px 15px; padding:5px; background-color:#FFF; cursor:pointer; border-radius:5px; box-shadow:0 0 2px #1115;";
        mybutton.onclick=timeTotal;
        targetDiv.appendChild(mybutton);
        clearInterval(addBtnTimer);
    } else {
        console.log('match div fail');
    }
}, 1000);

