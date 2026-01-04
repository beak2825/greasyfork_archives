// ==UserScript==
// @name         阿里拍卖列表
// @namespace    http://tampermonkey.net/
// @version      2.1
// @license     MIT
// @description  try to take over the world!
// @author       You
// @match        https://zc-paimai.taobao.com/wow/pm/default/pc/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.6.3/jquery.min.js
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/460995/%E9%98%BF%E9%87%8C%E6%8B%8D%E5%8D%96%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/460995/%E9%98%BF%E9%87%8C%E6%8B%8D%E5%8D%96%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==


// 封装ajax
function addXMLRequestCallback(callback) {
    let oldSend, i;
    if (XMLHttpRequest.callbacks) {
        XMLHttpRequest.callbacks.push(callback);
    } else {
        XMLHttpRequest.callbacks = [callback];
        oldSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function () {
            for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
                XMLHttpRequest.callbacks[i](this);
            }
            try {
                oldSend.apply(this, arguments);
            } catch (e) {
                console.log(e);
            }
        }
    }
}

const $x = (xpath, context) => {
    const nodes = [];
    try {
        const doc = (context && context.ownerDocument) || window.document;
        const results = doc.evaluate(xpath, context || doc, null, XPathResult.ANY_TYPE, null);
        let node;
        while (node = results.iterateNext()) {
            nodes.push(node);
        }
    } catch (e) {
        throw e;
    }
    return nodes;
};

function dataFormat() {
    let date = new Date();
    return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
}

function sleep(n) {
    const start = new Date().getTime();
    while (true) {
        if (new Date().getTime() - start > n) {
            break;
        }
    }
}
function moreWindow(a,res){
    let text = a.querySelector("span").textContent
    var output = res.find(object => object.auctionTitle === text)

    // 类型
    let openUrl = a.href + "&pp=" + output.auctionExtraMap['hPurpose']
    // 面积
    let mjIdx = output.auctionBenefits.findIndex(s => s.indexOf("m²") > -1)

    if (mjIdx > 0) {
        let mj = output.auctionBenefits[mjIdx];
        mj = mj.replace("m²", "")
        openUrl += "&mj=" + mj
    } else {
        openUrl += "&mj=0"
    }
    // 市场价 评估价
    let pgj = output.appraisalPrice || output.auctionExtraMap.marketPrice
    if (!pgj) {
        openUrl += "&pgj=0"
    } else {
        openUrl += "&pgj=" + pgj
    }
    GM_openInTab(openUrl)
}

function newTab(res) {
    setTimeout(() => {
        // debugger
        let aList = $x("//div[@class='rax-view-v2 pc-search-list--area--DmjoOeu']/a")
        if (aList.length === 0) {
            return
        }
        for (let i = 0; i < aList.length; i++) {
            let number = i % 6;
            let b = aList[i].querySelector("span").innerText.indexOf("车位") > 0 || aList[i].querySelector("span").innerText.indexOf("车库") > 0;
            if(b){
                continue
            }
            setTimeout(()=>{
                moreWindow(aList[i],res)
            },number * 3000)
        }
        // console.log("本页完成抓取，共检索" + aList.length + "条,自动跳转下一条")
        // $("#guid-8322645760 > div > div:last-child").click()

    }, 2000)
}

(function () {
    'use strict';
    addXMLRequestCallback(xhr => {
        xhr.addEventListener("load", () => {
            if (xhr.responseURL.includes("h5/mtop.taobao.datafront.invoke.auctionwalle/1.0")) {

                if (xhr.readyState === 4 && xhr.status === 200) {
                    if (xhr.responseText.indexOf('9018433170') > 0) {
                        var resJson = JSON.parse(xhr.responseText).data.data.GQL_getPageModulesData[9018433170]
                        let list = resJson.items.schemeList;

                        if (confirm(JSON.stringify(list))) {
                            newTab(list)
                        }
                    }
                }
            }
        });
    });

})();