// ==UserScript==
// @name         屏蔽DogeDoge、Baidu、Bing、Google包含Csdn的搜索结果
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       https://github.com/yizhitangtongxue
// @include      https://www.dogedoge.com/results?*
// @include      https://cn.bing.com/search?*
// @include      https://www.baidu.com/s?*
// @include      https://www.google.com/search?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411966/%E5%B1%8F%E8%94%BDDogeDoge%E3%80%81Baidu%E3%80%81Bing%E3%80%81Google%E5%8C%85%E5%90%ABCsdn%E7%9A%84%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/411966/%E5%B1%8F%E8%94%BDDogeDoge%E3%80%81Baidu%E3%80%81Bing%E3%80%81Google%E5%8C%85%E5%90%ABCsdn%E7%9A%84%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

(function () {
    let domain = document.domain

    if (domain.indexOf("doge") != -1) {

        let elements = document.querySelectorAll(".result.results_links_deep.highlight_d.result--url-above-snippet")

        elements.forEach(function (item) {
            let itemDomain = item.getAttribute("data-domain")
            if (itemDomain.indexOf("csdn") != -1) {
                item.style.display = "none"
            }
        })
    }

    if (domain.indexOf("bing") != -1) {
        let elements = document.querySelectorAll(".b_algo")
        console.log(elements)
        elements.forEach(function (item) {

            let itemDomain = item.getElementsByTagName("cite")[0].innerHTML

            if (itemDomain.indexOf("csdn") != -1) {
                item.style.display = "none"
            }
        })
    }

    if (domain.indexOf("baidu") != -1) {
        processingBaidu()
    }
    if (domain.indexOf("google") != -1 || domain.indexOf("bing") != -1) {

        let elements = document.querySelectorAll(".g")
        elements.forEach(function (item) {
            let itemDomain = item.getElementsByTagName("cite")[0].innerHTML

            if (itemDomain.indexOf("csdn") != -1) {
                item.style.display = "none"
            }
        })

    }

})();

function log(parameter) {
    console.log(parameter)
}

function processingBaidu() {
    let left = document.getElementById("content_left")
    let getHeight = left.offsetHeight

    setInterval(function(){
                let elements = document.querySelectorAll(".c-container");

        elements.forEach(function (item) {

            let content = item.querySelector(".f13 a:first-child")
            if (content !== null) {
                let contentText = content.text
                if (contentText.indexOf("csdn") != -1 || contentText.indexOf("CSDN") != -1) {

                    item.style.display = "none"

                }
            }

        });
    })
}
