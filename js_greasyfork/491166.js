// ==UserScript==
// @name         数据库虚拟实验室取消粘贴限制
// @namespace    Null
// @version      2024-03-29
// @description  适用QIE数据库虚拟实验室
// @author       Charlie
// @match        http://10.253.9.45/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=9.45
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/491166/%E6%95%B0%E6%8D%AE%E5%BA%93%E8%99%9A%E6%8B%9F%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%8F%96%E6%B6%88%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/491166/%E6%95%B0%E6%8D%AE%E5%BA%93%E8%99%9A%E6%8B%9F%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%8F%96%E6%B6%88%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==


(function () {

    let intval
    window.addEventListener("load", function () {
        //     // alert("网页内容加载完毕")
        clearInterval(intval)
        intval = setInterval(() => {
           let frame = document.getElementById("main_frame")
            if (frame != null) {
                clearInterval(intval)
                // console.log(frame)
                console.log("load")
                observerFunc(frame)
            }

        }, 100);

    })


})()



function watchFrame(mutationsList, observer) {

    console.log("watchFrame")



    let interval = setInterval(() => {
        let str = document.getElementById("main_frame").contentWindow.location.href
        if (str.match(/http:\/\/10\.253\.9\.45\/vdb-web\/stu-mylab_answer.html/)) {
            clearInterval(interval)
            let frameInner = document.getElementById("main_frame").contentWindow
            console.log("frameInner")


            let frameInnerInterval = setInterval(() => {
                console.log(frameInner.document.getElementsByTagName("textarea"))
                if (frameInner.document.getElementsByTagName("textarea").length != 0) {

                    frameInner.document.getElementsByTagName("textarea")
                    clearInterval(frameInnerInterval)
                    let textarea = frameInner.document.getElementsByTagName("textarea")
                    for (let i = 0; i < textarea.length; i++) {
                        textarea[i].setAttribute("onpaste", true)
                        console.log(textarea[i])
                    }
                }
            }, 100);
        }
    }, 100);

}


function observerFunc(frame) {


    const observer = new MutationObserver(watchFrame);



    console.log("observer")

    observer.observe(frame, { attributes: true, subtree: true });


    // observer.disconnect()



}