// ==UserScript==
// @name         添加一个按钮-雨夜
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to a specific element that shows an alert on click.
// @match        *://aidp.bytedance.com/*/task-v2/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516350/%E6%B7%BB%E5%8A%A0%E4%B8%80%E4%B8%AA%E6%8C%89%E9%92%AE-%E9%9B%A8%E5%A4%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/516350/%E6%B7%BB%E5%8A%A0%E4%B8%80%E4%B8%AA%E6%8C%89%E9%92%AE-%E9%9B%A8%E5%A4%9C.meta.js
// ==/UserScript==

let buttonAdded = false;
function setNativeValue(element, value) {
  const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
  if (valueSetter && valueSetter !== prototypeValueSetter) {
  	prototypeValueSetter.call(element, value);
  } else {
    valueSetter.call(element, value);
  }
}

function addButtonWhenElementAppears() {
    if (!buttonAdded) {
        const targetElement = document.querySelector("#frame-content > div:nth-child(2) > div > div > div > div > div > div > div.operation-zone_VyLMO0GE > div > div > div.info-zone_BfFZz_V2 > div.operation-zone_Od84tQh4 > div")
        if (targetElement) {
            const button = document.createElement('button');
            button.className = 'arco-btn arco-btn-primary arco-btn-size-default arco-btn-shape-square arco-btn-status-warning';
            button.textContent = '查询';
            button.addEventListener('click', function() {
                // 检查指定的元素是否为空
                const elementToCheck = document.querySelector("#conbination-wrap > div > div > div > div > div > div:nth-child(3) > div > div:nth-child(2) > div > div:nth-child(1) > div > div > div > div:nth-child(1) > div > div:nth-child(1) > div > div.arco-form-item-wrapper > div > div > div > div > div > div > div:nth-child(2) > div.arco-upload-list.arco-upload-list-type-picture-card");
                if (elementToCheck && elementToCheck.innerHTML.trim() !== "") {// 如果不为空，弹出提示
                    //alert("目标元素不为空，请检查！");
                    // 获取数据
                    //var value = GM_getValue('京东企业');
                    //const 局_填入企业 = document.querySelector("#conbination-wrap > div > div > div > div > div > div:nth-child(3) > div > div:nth-child(2) > div > div:nth-child(1) > div > div > div > div:nth-child(2) > div > div:nth-child(1) > div > div.arco-form-item-wrapper > div > div > div > textarea")
                    //setNativeValue(局_填入企业,"你好");
                    //局_填入企业.dispatchEvent(new Event('input', { bubbles: true }))
                    //var 局_地址 = GM_getValue('京东地址');
                    // 点击非个人
                    //var 局_非个人 = document.querySelector("#conbination-wrap > div > div > div > div > div > div:nth-child(3) > div > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(1) > div > div.arco-form-item-wrapper > div.arco-form-item-control-wrapper > div > div > div > label:nth-child(1) > span.arco-icon-hover.arco-radio-icon-hover.arco-radio-mask-wrapper > div")
                    //局_非个人.click();
                }else {

                    // 获取关键词
                    const 局_关键词 = document.querySelector("#conbination-wrap > div > div > div > div > div > div:nth-child(3) > div > div:nth-child(1) > div > div > div > div:nth-child(2) > span").innerText
                    // 获取队列id
                    const currentUrl = window.location.href;
                    if (currentUrl.includes('7418154343435833097')) {
                        alert('xm');
                    } else if (currentUrl.includes('7418154897743826725')) {
                        alert('ss');
                    } else if (currentUrl.includes('7392549816423583503')) {
                        alert('JF');
                    } else if (currentUrl.includes('7392549997684346659')) {
                        //alert('CW');
                        window.open("https://search.jd.com/Search?keyword="+ 局_关键词 +"&enc=utf-8");
                        //window.open("https://mobile.yangkeduo.com/search_result.html?search_key="+ 局_关键词 +"&search_type=mall&source=index&options=3&search_met_track=manual&refer_page_el_sn=367081&refer_page_name=search_result&refer_page_id=10015_1729300818254_ysacw44nda&refer_page_sn=10015");
                    } else if (currentUrl.includes('7392550115145666339')) {
                        //alert('JM');
                        window.open("https://search.jd.com/Search?keyword="+ 局_关键词 +"&enc=utf-8");
                    } else if (currentUrl.includes('7396956032038260495')) {
                        alert('BS');
                    }
                }});
            targetElement.appendChild(button);
            buttonAdded = true;
            // 找到目标元素后，断开观察器连接
            observer.disconnect();
        }
    }
}

const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        addButtonWhenElementAppears();
    });
});

// 开始观察整个文档
observer.observe(document, { childList: true, subtree: true });
