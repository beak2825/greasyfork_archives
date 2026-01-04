// ==UserScript==
// @name         保利票务-滑动验证码自动加载
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  保利票务
// @author       KC
// @match        https://www.polyt.cn/*
// @include      https://www.polyt.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454612/%E4%BF%9D%E5%88%A9%E7%A5%A8%E5%8A%A1-%E6%BB%91%E5%8A%A8%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/454612/%E4%BF%9D%E5%88%A9%E7%A5%A8%E5%8A%A1-%E6%BB%91%E5%8A%A8%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==
var success = 0
var total = 10

function init_awsc() {
    var n = document.createElement('div');
    n.setAttribute("id", "nc");
    n.setAttribute("style", "top:0;left:0")

    document.body.appendChild(n)
    // document.getElementById("allow-copy_script").appendChild(n)
    window.AWSC.use("nc", function (state, module) {
        window.nc = module.init({
            appkey: "FFFF0N00000000009D3A", scene: "nc_login_h5", renderTo: "nc", success: function (data) {
                success++
                let httpRequest = new XMLHttpRequest();
                httpRequest.open('POST', 'http://localhost/save', true);
                httpRequest.setRequestHeader("Content-type", "application/json");
                httpRequest.send(JSON.stringify({
                    'sessionId': data.sessionId, 'sig': data.sig, 'token': data.token,
                }));
                if (success === total) {
                    window.location.reload()
                }
            }, fail: function (failCode) {
                window.location.reload()
                window.console && console.log(failCode)
            }, error: function (errorCode) {
                window.location.reload()
                window.console && console.log(errorCode)
            }
        });
    })
}

(function () {
    for (let i = 1; i <= total; i++) {
        init_awsc()
        setTimeout(function () {
            document.getElementById("nc_" + i + "_wrapper").setAttribute("style", "width:50px")
        }, 1000)
    }
})();