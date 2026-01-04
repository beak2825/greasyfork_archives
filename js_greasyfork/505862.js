// ==UserScript==
// @name         jst自用
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  自用
// @author       You
// @match        https://www.erp321.com/epaas
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505862/jst%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/505862/jst%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const imgBoxStyle = `
        z-index = 1000;
        height:50%;
        width:25%;
        position: fixed; 
        left:40%;
        bottom:5%;
    `

    const previewImg = `
        max-width:100%;
        height:100%
    `

    const createImgBox = (data) => {
        let body = window.top.document.body
        let div = document.createElement('div')
        div.id = '_img_box'
        div.style = imgBoxStyle
        div.innerHTML = `
            <img  style="${previewImg}"  src="${data[0]}">
            `
        body.appendChild(div)

        const imgBox = body.querySelectorAll('#_img_box')
        if (imgBox.length > 1) {
            imgBox[0].remove()
        }

        imgBox[1].addEventListener('click', (e) => {
            imgBox[1].style.display = 'none'
        })

    };

    window.addEventListener('click', (e) => {
        const parEl = window.top.document.body
        const boxElArr = parEl.querySelectorAll('#imgBox')
        if (boxElArr.length) {
            parEl.removeChild(boxElArr[0])
        }
    })


        ; (function () {
            function ajaxEventTrigger(event) {
                var ajaxEvent = new CustomEvent(event, { detail: this });

                window.dispatchEvent(ajaxEvent);
            }


            var oldXHR = window.XMLHttpRequest;

            function newXHR() {
                var realXHR = new oldXHR();
                realXHR.addEventListener('readystatechange', function () { ajaxEventTrigger.call(this, 'ajaxReadyStateChange'); }, false);

                // console.log(realXHR, "------------")
                return realXHR;
            }

            window.XMLHttpRequest = newXHR;
        })();


    var xhr = new XMLHttpRequest()

    window.addEventListener('ajaxReadyStateChange', (e) => {
        const response = e.detail.response
        const skuPreImg = response.match(/\https.*?\.jpg/g)
        // 匹配款号
        // const matchSku = response.match(/\"30071"/g)

        let str = response.match(/"qty"(\S*)"r_qty"/)[1]
        // let strId = response.match(/"i_id"(\S*)"name"/)[1]
        // strId && strId.slice(1)
        str = str && str.charAt(1)
        if (str == 2) {
            console.log("there art two")
            // 页面给一个提示
            alert('There are two ')
        }

        skuPreImg && createImgBox(skuPreImg)

    })

    xhr.open('post' || 'get', '')
    xhr.send()
})();