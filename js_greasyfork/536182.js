// ==UserScript==
// @name         UniCloud Write Operation Warning
// @namespace    http://tampermonkey.net/
// @version      2025-05-16 20:00
// @description  辅助工具，【生产|预发环境】权限中台、运营后台权限写操作提醒
// @license      ttme
// @author       ttme
// @match        https://privilege.woa.com
// @match        https://privilegepre.woa.com
// @match        https://uni.woa.com
// @match        https://uni-pre.woa.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=woa.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536212/UniCloud%20Write%20Operation%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/536212/UniCloud%20Write%20Operation%20Warning.meta.js
// ==/UserScript==

const isDebugger = true;
function log(...message){
    if (isDebugger){
        console.log(...message);
    }
}

function getElementByXpath(xpath, parentNode = null) {
    console.log("getElementByXpath", xpath, parentNode);
    return document.evaluate(
        xpath,
        parentNode || document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;
}

function getElementBySelector(selector, parentNode = null) {
    console.log("getElementBySelector", selector, parentNode);
    return (parentNode || document).querySelector(selector);
}

function findElement(callback, timeout = 10000, interval = 500) {
    const startTime = Date.now();
    return new Promise(function (resolve, reject) {
        const intervalHandler = setInterval(function () {
            const el = callback();
            if (el) {
                resolve(el);
                clearInterval(intervalHandler);
            }
            if (Date.now() - startTime >= timeout) {
                resolve(null);
                clearInterval(intervalHandler);
            }
        }, interval);
    });
}

async function findElementBySelector(selector, parentNode = null, timeout = 10000, interval = 500) {
    console.log("findElementBySelector", selector);
    const result = await findElement(() => getElementBySelector(selector, parentNode), timeout, interval);
    if (result) {
        return result;
    } else {
        console.error("Error: findElementBySelector failed", selector);
        return null;
    }
}

async function findElementByXpath(xpath, parentNode = null, timeout = 10000, interval = 500) {
    console.log("findElementByXpath", xpath);
    const result = await findElement(() => getElementByXpath(xpath, parentNode), timeout, interval);
    if (result) {
        return result;
    } else {
        console.error("Error: findElementBySelector failed", xpath);
        return null;
    }
}

function waitForElement(xpath, callback) {
    const observer = new MutationObserver((mutations, obs) => {
        const element = getElementByXpath(xpath);
        if (element) {
            callback(element);
            obs.disconnect();
        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });
}


async function addClickListener() {
    document.addEventListener('click', ()=>{
        waitForElement('//*/div[@class="ant-modal-content"]/div/div[text()="关联权限"]', (privilagePop) => {
            const roleName = getElementBySelector('.ant-modal-content .ant-form-item-control-input-content');
            if (roleName) {
                console.log('==========privilagePop', roleName.innerText);
            }

            privilagePop.innerHTML = '关联权限' + `
                <div style="
                    padding: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 50px;
                    color: #ff0000;
                    font-size: 18px;
                    font-weight: bold;
                    background: linear-gradient(90deg, #ffecd2, #fcb69f);
                    border: 1px solid #ffeeba;
                    border-radius: 25px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    margin-top: 10px;
                ">
                    <span style="margin-right: 10px;">⚠️</span>【生产环境|预发环境】请勿操作写数据！
                </div>
            `;
        });

        const editButton = getElementByXpath('//div[@class="ant-modal-title" and contains(text(), "编辑权限包")]')
        if (editButton){
            const permissionPackageName = getElementBySelector('.ant-modal-body .ant-formily-item-control .ant-input')
            if (!permissionPackageName.value.includes("测试")) {
                console.log('=======权限包名称', permissionPackageName.value)
                editButton.innerHTML = '编辑权限包' + `
    <div style="
        padding: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
        color: #ff0000;
        font-size: 18px;
        font-weight: bold;
        background: linear-gradient(90deg, #ffecd2, #fcb69f);
        border: 1px solid #ffeeba;
        border-radius: 25px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-top: 10px;
    ">
        <span style="margin-right: 10px;">⚠️</span>【生产环境|预发环境】请勿操作写数据！
    </div>
`
            }
        }
    })
}


(async function() {
    'use strict';
    console.log('=====云图 权限中台|运营后台 写操作警告=====');
    await addClickListener();
})();