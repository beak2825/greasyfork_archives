// ==UserScript==
// @name         JLCJLCJLCJLCJLC
// @namespace    http://tampermonkey.net/
// @version      2025-01-20
// @description  上立创整点LDO
// @author       You
// @match        https://www.szlcsc.com/huodong.html*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @license      GPLv3
// @require      https://scriptcat.org/lib/637/1.4.3/ajaxHooker.js#sha256=y1sWy1M/U5JP1tlAY5e80monDp27fF+GMRLsOiIrSUY=
// @downloadURL https://update.greasyfork.org/scripts/492123/JLCJLCJLCJLCJLC.user.js
// @updateURL https://update.greasyfork.org/scripts/492123/JLCJLCJLCJLCJLC.meta.js
// ==/UserScript==

(async function () {
    const style = `
#ext-root {
    position: fixed;
    top: 111px;
    right: 20px;
    width: 370px;
    max-height: 80vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: larger;
}`
    'use strict';
    const sleep = v => new Promise(r => setTimeout(r, v))
    const rootElem = document.createElement("div")
    rootElem.id = "ext-root"
    GM_addStyle(style)
    let coupons = [];
    let brands = [];
    let receive = 0
        , used = 0;
    let money = 0;

    let couponAjax = new Promise(r => {
        ajaxHooker.hook(request => {
            if (request.url.indexOf("/activity/coupon") != -1) {
                request.response = r
            }
        });
    })

    async function getCoupon() {
        for (let i = 0; i < coupons.length; i++) {
            if (!coupons[i].isReceive)
                await fetch("https://activity.szlcsc.com/getCoupon/"+coupons[i].uuid)
            span.innerText = baseText + `\n已抢${i + 1}张优惠券`
        }
        span.innerText = baseText + "\n抢完了"
        // localStorage.setItem("coupon_todo", JSON.stringify(coupons.filter(v => !v.root.classList.contains('used')).map(v => v.url)))
    }

    const couponResp = await couponAjax;
    let c = JSON.parse(couponResp.responseText).result.couponModelVOListMap
    c[2].forEach(coupon => {
        if (coupon.minOrderMoney - coupon.couponAmount == 1) {
            coupons.push(coupon)
            money += coupon.couponAmount
            if (coupon.isReceive)
                receive += 1;
            if (coupon.isUse)
                used += 1;
        }
    })
    console.log(coupons)
    console.log(JSON.stringify(brands))
    window.localStorage.setItem("coupon_list", JSON.stringify(brands))
    const span = document.createElement("span");
    const baseText = `共找到${coupons.length}张优惠券,已领${receive}张,已用${used}张,剩余总价${money}元`
    span.innerText = baseText
    rootElem.appendChild(span)
    const button = document.createElement("button")
    button.innerText = "开始领取&预览页面"
    button.onclick = async () => {
        button.onclick = undefined
        console.log("clicked")
        getCoupon()
        // no await
        const parser = new DOMParser();
        const newWindow = window.open("", "_blank").document.body
        newWindow.classList.add("page-brand")
        const brandCss = document.createElement("link")
        brandCss.rel = "stylesheet"
        brandCss.href = "https://static.szlcsc.com/ecp/public/css/page/list/brand/brand.02b0b6e2.css"
        const custonCSS = document.createElement("style")
        custonCSS.innerHTML = `
        body {
            padding-top: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .block-brand {
            width: 1200px;
        }
        `
        newWindow.appendChild(custonCSS)
        newWindow.appendChild(brandCss)
        for (let i = 0; i < coupons.length; i++) {
            const coupon = coupons[i]
            if (coupon.isUse) continue;
            await new Promise(r => {
                console.log(coupon.targetUrl)
                GM_xmlhttpRequest({
                    method: "GET",
                    url: coupon.targetUrl,
                    onload: function (response) {
                        const doc = parser.parseFromString(response.responseText, "text/html");
                        const blk = document.createElement("div")
                        blk.classList.add("block-brand")
                        const description = doc.querySelector("meta[name=description]").getAttribute("content")
                        const a = document.createElement("a")
                        a.href = coupon.targetUrl
                        a.target = "_blank"
                        a.innerText = description
                        blk.appendChild(a)
                        const brand_info = doc.querySelector(".brand-info")
                        blk.appendChild(brand_info)
                        const det_screen = doc.querySelector(".det-screen-wrapper")
                        try {
                            let i = response.responseText.indexOf("window.filterData = ")
                            let j = response.responseText.indexOf("};", i)
                            const text = response.responseText.slice(i + 19, j + 1)
                            let data = eval("(" + text + ")")
                            let cateList = det_screen.querySelector("#CategoryList")
                            cateList.parentElement.classList.add("det-screen-height")
                            cateList.style.height = 'auto'
                            cateList.innerHTML = ""
                            for (const cate of data.category_list) {
                                let elem = document.createElement("div")
                                elem.style.height = '18px';
                                let span = document.createElement("span")
                                span.innerText = cate.label
                                elem.appendChild(span)
                                cateList.appendChild(elem)
                            }

                            let standardList = det_screen.querySelector("#standardList")
                            standardList.parentElement.classList.add("det-screen-height")
                            standardList.style.height = 'auto'
                            standardList.innerHTML = ""
                            for (const cate of data.standard_list) {
                                let elem = document.createElement("div")
                                elem.style.height = '18px';
                                let span = document.createElement("span")
                                span.innerText = cate.label
                                elem.appendChild(span)
                                standardList.appendChild(elem)
                            }
                        } catch (e) {
                            console.error(e)
                        }
                        blk.appendChild(det_screen)
                        newWindow.appendChild(blk)
                        r()
                    },
                    onerror: (r) => console.error(r)
                });
            }
            );
        }
    }
    rootElem.appendChild(button)
    document.body.appendChild(rootElem)
})();