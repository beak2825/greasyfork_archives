// ==UserScript==
// @name         GetDYSKUID
// @namespace    supermeatboy@getdyskuid
// @version      0.4
// @description  show sku id for douyin
// @author       supermeatboy
// @match        https://haohuo.jinritemai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=haohuo.jinritemai.com
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485034/GetDYSKUID.user.js
// @updateURL https://update.greasyfork.org/scripts/485034/GetDYSKUID.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let oldfetch = fetch;
    let skuMetaMapping = {}
    let skuSpecNameToID = {}
    let maxRetry = 20
    let retryCount = 1
    var selectSkuList = {}

    let interceptor = {
       urls: ['/aweme/v2/shop/promotion/pack/h5'],
       originalXHR: window.XMLHttpRequest,
       myXHR: function () {

           let isScriptDispatched = false
           const modifyResponse = () => {
               if(isScriptDispatched) {
                   return
               }
               // console.info("trigger modifyResponse", xhr.responseType)
               let matchUrls = interceptor.urls.filter(url => xhr.responseURL.indexOf(url) > -1)
               let match = matchUrls.length > 0
               if (match) {
                   let data;
                   if (!xhr.responseType || xhr.responseType === "text") {
                       data = xhr.responseText;
                   } else if (xhr.responseType === "document") {
                       data = xhr.responseXML;
                   } else {
                       data = xhr.response;
                   }
                   // console.info("match", typeof data, data)
                   let result = JSON.parse(data)
                   if(result.promotion_h5 && result.promotion_h5.page_meta) {
                       let pageMeta = result.promotion_h5.page_meta
                       if(pageMeta.sku_meta && pageMeta.sku_meta.sku_mappings) {
                           skuMetaMapping = pageMeta.sku_meta.sku_mappings
                           console.info("hook skuMetaMapping", skuMetaMapping)
                       }
                       if(pageMeta.common_meta && pageMeta.common_meta.sku_spec_info) {
                           let skuSpecList = pageMeta.common_meta.sku_spec_info
                           for(let i=0; i<skuSpecList.length; i++) {
                               let specInfo = skuSpecList[i]
                               for(let j=0; j<specInfo.spec_ids.length;j++) {
                                   skuSpecNameToID[specInfo.spec_names[j]] = specInfo.spec_ids[j]
                               }
                           }
                           console.info("hook skuSpecToName", skuSpecNameToID)
                       }

                       // 延迟触发显示id
                       setTimeout(hookBottomButtonClick, 1000)
                   }
                   this.responseText = this.response = data
               }
               isScriptDispatched = true
           }
           const xhr = new interceptor.originalXHR
           for (let attr in xhr) {
               if (attr === 'onreadystatechange') {
                   xhr.onreadystatechange = (...args) => {
                       if (this.readyState === 4) {
                           modifyResponse()
                       }
                       this.onreadystatechange && this.onreadystatechange.apply(this, args)
                   }
                   continue
               } else if (attr === 'onload') {
                   xhr.onload = (...args) => {
                       modifyResponse()
                       this.onload && this.onload.apply(this, args)
                   }
                   continue
               }

               if (typeof xhr[attr] === 'function') {
                   this[attr] = xhr[attr].bind(xhr);
               } else {
                   // responseText和response不是writeable的，但拦截时需要修改它，所以修改就存储在this[`_${attr}`]上
                   if (attr === 'responseText' || attr === 'response') {
                       Object.defineProperty(this, attr, {
                           get: () => this[`_${attr}`] == undefined ? xhr[attr] : this[`_${attr}`],
                           set: (val) => this[`_${attr}`] = val,
                           enumerable: true
                       });
                   } else {
                       Object.defineProperty(this, attr, {
                           get: () => xhr[attr],
                           set: (val) => xhr[attr] = val,
                           enumerable: true
                       });
                   }
               }
           }
       }
   }


    window.XMLHttpRequest = interceptor.myXHR

    // Your code here...
    function buildShowNode() {
        let newDiv = document.createElement("div");
        newDiv.style.width = "100%"
        newDiv.style.fontSize = "12px"
        let newPre = document.createElement("pre");
        newPre.id = "supermeatboy_sku_map"
        newPre.innerText = "SKU ID: 待选择全部属性"
        newDiv.appendChild(newPre);
        return newDiv
    }
    function hookBottomButtonClick () {
        if(retryCount > maxRetry) {
            return
        }
        let doms = document.querySelectorAll(".footer__right-buttons__item")
        console.info("hook, bottom", doms)
        // 伺机重试
        if(!doms || doms.length == 0) {
            setTimeout(hookBottomButtonClick, 1000)
            retryCount ++
            return
        }
        for(let d of doms) {
            d.addEventListener("click", function() {
                setTimeout(updateSkuId, 500)
            })
        }
    }
    function updateSkuId() {
        if(retryCount > maxRetry) {
            return
        }
        let doms = document.querySelectorAll(".cart-sku>div>div:nth-child(2)>div")
        console.info("hook doms", doms)
        // 伺机重试
        if(!doms || doms.length == 0) {
            setTimeout(updateSkuId, 1000)
            retryCount ++
            return
        }
        let lastSku = doms[doms.length - 1]
        lastSku.parentNode.appendChild(buildShowNode());
        console.info("hook lastSku", lastSku)
        let skuLevelCount = 0
        let skuParentNode = null;
        for(let d of doms) {
            if(skuParentNode == null || d.parentNode != skuParentNode) {
                skuParentNode = d.parentNode
                skuLevelCount += 1
            }
            d.setAttribute("sku_level", skuLevelCount)
            d.addEventListener("click", (e) => {
                let skuDom = e.target
                // 找到所有带有item-highlight的文本
                setTimeout(() => {
                    let allSubDoms = skuParentNode.querySelectorAll("div")
                    let specKeyList = []
                    for(let i=0;i<allSubDoms.length;i++) {
                        let classStr = allSubDoms[i].getAttribute("class")
                        if(!classStr) {
                            continue
                        }
                        if(classStr.indexOf("item-highlight") > 0) {
                            let innerText = allSubDoms[i].innerText
                            let specId = skuSpecNameToID[innerText]
                            specKeyList.push(specId)
                            console.info("hook, highlight", innerText, specId)
                        }
                    }
                    console.info("hook, highlight list", specKeyList)
                    let skuID = skuMetaMapping[specKeyList.join("_")]
                    var skuMapNode = document.getElementById("supermeatboy_sku_map")
                    if(!skuID || skuID == undefined) {
                        skuMapNode.innerText = "SKU ID: 待选择全部属性"
                    } else {
                        skuMapNode.innerText = "SKU ID: " + skuID
                    }
                }, 100)

            });
        }
    }
    //
})();