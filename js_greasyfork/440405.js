// ==UserScript==
// @name         自動掛服學
// @namespace    Anong0u0
// @version      0.2
// @description  嘗試征服世界！
// @author       Anong0u0
// @include      http://elearning.taipei/elearn/course/view.php?*
// @include      http://elearning.taipei/elearn/mod/scorm/player.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=elearning.taipei
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440405/%E8%87%AA%E5%8B%95%E6%8E%9B%E6%9C%8D%E5%AD%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/440405/%E8%87%AA%E5%8B%95%E6%8E%9B%E6%9C%8D%E5%AD%B8.meta.js
// ==/UserScript==


// =====================
// 每次進入頁面掛多久退出儲存一次? 預設10分鐘 (單位:毫秒)
const 掛機時間 = 10*60*1000;

// 總共需要掛多久? 預設3小時 (單位:分鐘)
const 總時數 = 3*60;
// =====================



function delay(ms = 0){return new Promise((r)=>{setTimeout(r, ms)})}

(async function() {

    switch(document.location.pathname)
    {
        case "/elearn/course/view.php":
            getTime();
            GM_setValue("api",String(getTime).split("'")[1]);
            GM_xmlhttpRequest({
                method: "GET",
                url: GM_getValue("api"),
                onload: ((res)=>
                {
                    var logTime = res.responseText.split(':').map(parseFloat);
                    console.log(logTime[0]*60+logTime[1]);
                    if(logTime[0]*60+logTime[1]<總時數)
                        document.querySelector(".activityinstance > a").click();
                })
            });
            break;
        case "/elearn/mod/scorm/player.php":
            while(!document.querySelector("iframe")) await delay(100);
            var div = document.createElement("div");
            div.innerHTML = `<br><p id="nowTime"></p><br><p id="totalTime"></p>`;
            document.querySelector("#scorm_content").append(div);
            GM_xmlhttpRequest({
                method: "GET",
                url: GM_getValue("api"),
                onload: ((res)=>
                {document.querySelector("p#totalTime").innerText = `總時數:${res.responseText}`;})
            });
            document.querySelector("iframe").remove();
            document.querySelector("#scorm_navpanel").remove();
            document.querySelector("button#scorm_toc_toggle_btn").click();
            var exit_time = new Date().getTime() + 掛機時間,
                nowTime = document.querySelector("p#nowTime"),
                passTime=0;
            setInterval(()=>
            {
                nowTime.innerText=`目前已掛:${++passTime}秒`;
                if(new Date().getTime()>exit_time)
                    document.querySelector("input[title='離開課程']").click()
            },1000)
            break;
    }
})();