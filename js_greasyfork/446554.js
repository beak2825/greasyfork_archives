// ==UserScript==
// @name         NTUNHS_CTE_Bot
// @name:zh-TW   北護教學評量腳本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  The NTUNHS CTE tool
// @description:zh-TW  輔助你填寫國立台北護理健康大學的教學評鑑問卷
// @author       You
// @match        https://system8.ntunhs.edu.tw/intranetasp/evaMain/stEval.asp
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.tw
// @grant        none
// @license MIT
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/446554/NTUNHS_CTE_Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/446554/NTUNHS_CTE_Bot.meta.js
// ==/UserScript==
/* globals $ */
(function() {
    'use strict';
    $(document).ready(function() {
            $("frame[name=left]").ready(function (){
            let btn = document.createElement("button");
            btn.onclick = function() {
                checkDefault();
            }
            btn.innerHTML = `填入預設值`;
            $("frame[name=left]").contents().find("body").append(btn);


            let ajaxBtn = document.createElement("button");
            ajaxBtn.onclick = function() {
                sendCTEAjax();
            }
            ajaxBtn.innerHTML = `一鍵填寫最佳問卷`;
            $("frame[name=left]").contents().find("body").append(ajaxBtn);
        });
    });



    // Your code here...
})();

function checkDefault() {
    let radioNameMap = [
        "rb1",
        "rb2",
        "rb3",
        "rb4",
        "rb5",
        "rb6",
        "rb7",
        "rb8",
        "rb9",
        "rb10",
        "rb11",
        "rb12",
        "rb13",
        "rbA"
    ]

    for(let i = 0 ; i < radioNameMap.length ; i++) {
        let radioName = radioNameMap[i];
        $("frame[name=right]").contents().find(`input:radio[name=${radioName}]`)
        .each(
            (key, element) => {
                let value = String($(element).val());
                if (value == "1" && radioName == "rbA") return $(element).prop("checked", true);
                if (value == "5") return $(element).prop("checked", true);
                else $(element).prop("checked");
            }
        )
    }
}

function sendCTEAjax() {
    let baseUrl = "https://system8.ntunhs.edu.tw/intranetasp/evaMain/";
    $("frame[name=left]").contents().find("a").each((index, element)=> {
        let courseRelativeUrl = $(element).attr("href");
        let fullUrl = baseUrl + courseRelativeUrl;
        $.ajax({
            url: "https://system8.ntunhs.edu.tw/intranetasp/evaMain/stEditCdo.asp",
            method: "POST",
            headers: {
                "Referer": fullUrl
            },
            data: $.param({
                "rb1": "5",
                "rb2": "5",
                "rb3": "5",
                "rb4": "5",
                "rb5": "5",
                "rb6": "5",
                "rb7": "5",
                "rb8": "5",
                "rb9": "5",
                "rb10": "5",
                "rb11": "5",
                "rb12": "5",
                "rb13": "5",
                "rbA": "1"
            })
        });
    });
}