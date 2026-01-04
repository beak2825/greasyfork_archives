// ==UserScript==
// @name         wolai Plus
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  略略略~
// @author       Liuser
// @include      https://www.wolai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418383/wolai%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/418383/wolai%20Plus.meta.js
// ==/UserScript==

(function () {

    let svgItem = ""// ==UserScript==
// @name         wolai Plus
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Liuser
// @include      https://www.wolai.com/*
// @grant        none
// ==/UserScript==

(function () {

    let svgItem = ""
    let svgItemChildPage = ""
    let config = {
        attributes: true
    };
    let mouseClick = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
    });
    let getElementAll = function () {
        svgItem = document.getElementsByClassName('_3skBI _1LKlS')[0].children[0]
        svgItemChildPage = document.getElementsByClassName('_2Q7F8 _2xbd4 vCtLm')[1]
    }
//     let callback = function (mutationsList) {
//         for (let mutation of mutationsList) {
//             if (mutation.type == 'attributes') {
//                 getElementAll()
//                 console.log('切换了页面')
//                 var observerNormal = new MutationObserver(callback);
//                 observerNormal.observe(svgItemChildPage, config);
//             }
//         }
//     };

    //let observer = new MutationObserver(callback);








    setTimeout(function () { //延迟5秒
        'use strict';
        getElementAll()
        //console.log(svgItemChildPage)
        document.onkeydown = function () {
            if ((window.event.altKey) && ((window.event.keyCode == 78))) {
                console.log('直接新建页面')
                svgItem.dispatchEvent(mouseClick)
            }
            if ((window.event.ctrlKey) && ((window.event.keyCode == 77))) {
                console.log('新建子页面')
                getElementAll()
                svgItemChildPage.dispatchEvent(mouseClick)

            }
        }
//         function tryGet(){
//             getElementAll()
//             if(svgItemChildPage==undefined){
//                 //获取页面失败
//                 setTimeout(()=>{tryGet()},5000)
//                 console.log('获取页面失败')
//         }else{
//             observer.observe(svgItemChildPage, config);
//         }
//         }
//         tryGet()

    }, 5 * 1000);

})();
    let svgItemChildPage = ""
    let config = {
        attributes: true
    };
    let mouseClick = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
    });
    let getElementAll = function () {
        svgItem = document.getElementsByClassName('_3skBI _1LKlS')[0].children[0]
        svgItemChildPage = document.getElementsByClassName('_2Q7F8 _2xbd4 vCtLm')[1]
    }
    var callback = function (mutationsList) {
        for (let mutation of mutationsList) {
            if (mutation.type == 'attributes') {
                getElementAll()
                console.log('切换了页面')
            }

        }
    };
    let observer = new MutationObserver(callback);
    setTimeout(function () { //延迟5秒
        getElementAll()
        'use strict';
        document.onkeydown = function () {
            if ((window.event.altKey) && ((window.event.keyCode == 78))) {
                console.log('直接新建页面')
                svgItem.dispatchEvent(mouseClick)
            }
            if ((window.event.ctrlKey) && ((window.event.keyCode == 77))) {
                console.log('新建子页面')
                svgItemChildPage.dispatchEvent(mouseClick)
            }
        }
        observer.observe(svgItemChildPage, config);
    }, 5 * 1000);

})();