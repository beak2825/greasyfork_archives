// ==UserScript==
// @name         clean edge default new tab page
// @namespace    clean-edge-default-ntp
// @version      0.1
// @description  净化edge默认新标签页
// @author       doooreyn
// @match        https://ntp.msn.cn
// @downloadURL https://update.greasyfork.org/scripts/423225/clean%20edge%20default%20new%20tab%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/423225/clean%20edge%20default%20new%20tab%20page.meta.js
// ==/UserScript==
(function() {
    if (document.location.pathname == "/edge/ntp") {
        document.getElementById("museumCard").style.display = "none"
        document.getElementById("c_chl").style.display = "none"
        document.getElementById("c_srch").style.display = "none"
        document.getElementById("c_setting").style.display = "none"
        document.getElementById("c_welcome").style.display = "none"
    }    
})()
