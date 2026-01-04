// ==UserScript==
// @name         微信读书自动翻页
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  微信读书网页版自动翻页
// @author       bulan_zade
// @match        https://weread.qq.com/web/reader/*
// @icon         https://rescdn.qqmail.com/node/wr/wrpage/style/images/independent/favicon/favicon_16h.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439482/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/439482/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

async function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms))
}

// 模拟键盘事件
function fireKeyEvent(el, evtType, keyCode)
{
    let evtObj;
    if (document.createEvent)
    {
        if (window.KeyEvent)
        {//firefox 浏览器下模拟事件
            evtObj = document.createEvent('KeyEvents');
            evtObj.initKeyEvent(evtType, true, true, window, true, false, false, false, keyCode, 0);
        }
        else
        {//chrome 浏览器下模拟事件
            evtObj = document.createEvent('UIEvents');
            evtObj.initUIEvent(evtType, true, true, window, 1);

            delete evtObj.keyCode;
            if (typeof evtObj.keyCode === "undefined")
            {//为了模拟keycode
                Object.defineProperty(evtObj, "keyCode", { value: keyCode });
            }
            else
            {
                evtObj.key = String.fromCharCode(keyCode);
            }

            if (typeof evtObj.ctrlKey === 'undefined')
            {//为了模拟ctrl键
                Object.defineProperty(evtObj, "ctrlKey", { value: true });
            }
            else
            {
                evtObj.ctrlKey = true;
            }
        }
        el.dispatchEvent(evtObj);

    }
    else if (document.createEventObject)
    {//IE 浏览器下模拟事件
        evtObj = document.createEventObject();
        evtObj.keyCode = keyCode
        el.fireEvent('on' + evtType, evtObj);
    }
}

window.onload = function()
{
    let container = document.getElementsByClassName("readerControls")[0]
    let html = '<div class="readerControls_fontSize" id="autoScrollControl">\n' +
        '        <button title="自动滚动" id="autoScrollBtn" class="readerControls_item autoScroll" style="color:#5d646e;">滚动</button>\n' +
        '        <div class="fontSizeLabel left"><p style="color:#5d646e;">0</p></div>\n' +
        '        <div class="fontSizeSliderContainer">\n' +
        `             <input id="scrollSpeed" type="range" max="20" min="0" value="0"/>\n`+
        '        </div>\n' +
        '        <div class="fontSizeLabel right"><p style="color:#5d646e;margin-right:8px">20</p></div>\n' +
        '    </div>'

    container.insertAdjacentHTML('beforeend',html)
    let control = document.getElementById("autoScrollControl")
    let btn = document.getElementById("autoScrollBtn")
    let scrollSpeed = document.getElementById("scrollSpeed");
    let timer
    let controlDisplaying = false;
    let onBtnClick = false
    let atBottom = false

    scrollSpeed.onchange = function ()
    {
        if (scrollSpeed.value != 0)
        {
            clearInterval(timer)
            timer = setInterval(async() =>
            {
                console.log(document.documentElement.scrollHeight - document.documentElement.scrollTop === document.documentElement.clientHeight)
                if (!atBottom && document.documentElement.scrollHeight - document.documentElement.scrollTop === document.documentElement.clientHeight)
                {
                    atBottom = true
                    await sleep(2000)
                    fireKeyEvent(document, "keydown", 39)
                    await sleep(2000)
                    atBottom = false
                }
                else
                {
                    window.scrollBy(0, scrollSpeed.value)
                }
            }, 100)
            btn.innerText = "滚动中"
        }
        else
        {
            clearInterval(timer)
            btn.innerText = "滚动"
        }
    }

    // 显示滚动控制条
    btn.onclick = function()
    {
        onBtnClick = true
        btn.setAttribute("style", "display:none")
        control.className += " expand"
        controlDisplaying = true
    }

    // 点击空白区域时隐藏滚动控制条
    document.body.onclick = function()
    {
        if (controlDisplaying && !onBtnClick)
        {
            btn.removeAttribute("style")
            control.className = control.className.replace(" expand", "")
        }
        onBtnClick = false
    }
}

