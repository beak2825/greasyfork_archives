// ==UserScript==
// @name         直接獲得學習點數
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  行政院環保署環境教育終身學習網快速影片通過驗證
// @author       Yu
// @include        https://elearn.epa.gov.tw/DigitalLearning/WatchVideo.aspx?*
// @icon         https://www.google.com/s2/favicons?domain=gov.tw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426903/%E7%9B%B4%E6%8E%A5%E7%8D%B2%E5%BE%97%E5%AD%B8%E7%BF%92%E9%BB%9E%E6%95%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/426903/%E7%9B%B4%E6%8E%A5%E7%8D%B2%E5%BE%97%E5%AD%B8%E7%BF%92%E9%BB%9E%E6%95%B8.meta.js
// ==/UserScript==

(function() {
    setTimeout(()=>{
        $.ajax({
            type: "POST", url: 'DoCheckPoint.ashx',
            data: {
                "Vkey": JsCaptcha.Vkey, "Ps": 1023,
                "Duration": Math.round(player.getDuration()),
                "Elapsed": Math.round(player.getDuration()),
                "is_deliver_to_itaiwan": true
            },
            dataType: "json",
            success: this.DoCheckSuccess,
            error: function () { }
        });
    },1000)
})();