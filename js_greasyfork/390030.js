// ==UserScript==
// @name         디플레이스 정각등록
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://www.dplace.co.kr/cs/event_view.asp?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390030/%EB%94%94%ED%94%8C%EB%A0%88%EC%9D%B4%EC%8A%A4%20%EC%A0%95%EA%B0%81%EB%93%B1%EB%A1%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/390030/%EB%94%94%ED%94%8C%EB%A0%88%EC%9D%B4%EC%8A%A4%20%EC%A0%95%EA%B0%81%EB%93%B1%EB%A1%9D.meta.js
// ==/UserScript==

function localtimer(){
    var local = setInterval(function() {
        var now = new Date();
        if(now.getMinutes()==59 && now.getSeconds()==58){
            Commnet_Submit();
            clearInterval(local);
        };
    }, 50);
}
localtimer();