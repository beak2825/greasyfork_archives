// ==UserScript==
// @name         智慧教育平台_教材下载
// @version      0.1.6
// @description  智慧教育平台（教材下载）
// @author       Codewyx
// @match        *basic.smartedu.cn/tchMaterial/detail*
// @match        *zxx.edu.cn/tchMaterial/detail*
// @icon         https://basic.smartedu.cn/favicon.ico
// @license      MIT
// @grant        none
// @namespace https://greasyfork.org/users/809727
// @downloadURL https://update.greasyfork.org/scripts/471666/%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0_%E6%95%99%E6%9D%90%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/471666/%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0_%E6%95%99%E6%9D%90%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {

    function extractString(str) {
        const regex = /\?file=(.*?)&headers/;
        const match = str.match(regex);
        if (match) {
            return match[1]; // 返回?file=和&headers之间的内容
        }
        return null; // 如果没有找到匹配的内容
    }
    window.onload = () => {

        var interval = setInterval(
            function () {
   const modalContents = document.querySelectorAll(".fish-modal-confirm-content");

        modalContents.forEach(modalContent => {
            if (modalContent.textContent.includes("需要登录才可以查看，是否登录？")) {
                modalContent.innerHTML="需要登录才可以查看，是否登录？<br/><p style=\"color:red\">登录后才可以使用插件下载课本！</p>"

            }})

                const src = document.getElementById("pdfPlayerFirefox").src;
                const url = new URL(src);
                result = extractString(url.search).replace(/-private/g, '');
                document.querySelector(".web-breadcrumb").innerHTML += `    <script>


    </script>
    <br>
    <label onclick="window.open('`+ result + `')" id="but_1" class="fish-radio-tag-wrapper fish-radio-tag-wrapper-checked"><span class="fish-radio-tag fish-radio-tag-checked"><span class="fish-radio-tag-inner"></span></span><span>获取教材直链</span></label>

 `;
                //  <a download="https://r2-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/`+getQueryString('contentId')+`.pkg/pdf.pdf" target="_blank"><label  id="but_2" class="fish-radio-tag-wrapper fish-radio-tag-wrapper-checked"><span class="fish-radio-tag fish-radio-tag-checked"><span class="fish-radio-tag-inner"></span></span><span>下载PDF</span></label></a>
                if (document.querySelector("#but_1") != null) {
                    clearInterval(interval);
                    return;
                }
            }, 1000);

    }
    //


})();