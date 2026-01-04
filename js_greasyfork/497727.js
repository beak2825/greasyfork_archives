// ==UserScript==
// @name            azota focus bypass
// @name:vi         thoat man hinh azota
// @namespace       github.com/zr0x8
// @version         1.1
// @description     block focus detection
// @description:vi  chan phat hien thoat man hinh
// @author          0x8
// @match           https://azota.vn/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/497727/azota%20focus%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/497727/azota%20focus%20bypass.meta.js
// ==/UserScript==

//code might be buggy, havent tested much
(function() {
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(data) {
        try {
            if (JSON.parse(data).name === "exit_full_screen") return;
        } catch (e) {}
        originalSend.call(this, data);
    };
})();

(function() {
    console.clear();
    console.log("sucessfully executed");
})();