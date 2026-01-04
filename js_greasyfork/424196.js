// ==UserScript==
// @name         星花工具
// @namespace    https://taki.live/
// @version      0.4
// @description  星花工具!
// @author       taki
// @require      https://cdn.jsdelivr.net/npm/babel-standalone@6.18.2/babel.js
// @require      https://cdn.jsdelivr.net/npm/babel-polyfill@6.16.0/dist/polyfill.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @match        *://zc.dapengjiaoyu.cn
// @downloadURL https://update.greasyfork.org/scripts/424196/%E6%98%9F%E8%8A%B1%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/424196/%E6%98%9F%E8%8A%B1%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

/* jshint ignore:start */
var MultiString = function(f){
    return f.toString().split('\n').slice(1, -1).join('\n');
}
/* jshint ignore:end */

var inline_src = MultiString(function(){
    window.onload = function () {
        if(location.href.includes("zc.dapengjiaoyu.cn/#/login")){
           document.querySelector(".popup_container").remove();
        }
        $(document).on("click", "button:contains('查询')", function () {
            var userChatCode = document.querySelector("input").value;
            userChatCode.length && $.ajax({
                type: "post",
                url: "https://zc.dapengjiaoyu.cn/quantity/system/zc_user_flow/select_by_keyword",
                headers: {
                    'authorization': `bearer${localStorage.getItem("accessToken")}`
                },
                contentType: "application/json",
                data: JSON.stringify({
                    userChatCode: document.querySelector("input").value,
                    status: "Y",
                    categoryCode: "j5m484vz",
                    leaderId: "sj_1497"
                }),
                success: function (res) {
                    if (res.data.total > 0) {
                        var row = res.data.content[0];
                        var replaceObj = {
                            4: row.userChatCode,
                            5: row.classCode,
                            6: row.groupCode,
                            7: row.leaderUserName
                        };
                        Object.keys(replaceObj).forEach(i => $(`table tr:eq(1) td:nth-child(${i})`).html(replaceObj[i]));
                    }
                }
            });
        });
    }
});
/* jshint ignore:start */
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
/* jshint ignore:end */