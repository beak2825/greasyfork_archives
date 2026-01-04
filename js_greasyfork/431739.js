// ==UserScript==
// @name         巴哈姆特之在C頁封鎖他人
// @description  在C頁的使用者名稱後面新增「封鎖此人」按鈕，以在不進對方小屋前提下封鎖該使用者。
// @namespace    nathan60107
// @version      1.1
// @author       nathan60107(貝果)
// @homepage     https://home.gamer.com.tw/homeindex.php?owner=nathan60107
// @match        *forum.gamer.com.tw/C*
// @icon         https://www.google.com/s2/favicons?domain=gamer.com.tw
// @grant        GM_xmlhttpRequest
// @connect      gamer.com.tw
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/431739/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E4%B9%8B%E5%9C%A8C%E9%A0%81%E5%B0%81%E9%8E%96%E4%BB%96%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/431739/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E4%B9%8B%E5%9C%A8C%E9%A0%81%E5%B0%81%E9%8E%96%E4%BB%96%E4%BA%BA.meta.js
// ==/UserScript==

(function() {
    document.block_button = function (uid){
        Dialogify.confirm(`確定封鎖${uid}?`, {
            ok: function(){
                document.block_user(uid);
            },
        });
    }

    document.block_user = function(uid){
        Dialogify.alert('處理中，請稍候')

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://ani.gamer.com.tw/ajax/getCSRFToken.php",
            cache: false,
            onload: token => {
                GM_xmlhttpRequest({
                    url: 'https://ani.gamer.com.tw/ajax/blackUser.php',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    },
                    data: `fid=${uid}&con=0&token=${token.response}`,
                    responseType: "json",
                    cache: false,
                    method: 'POST',
                    onload: function final(rdata) {
                        Dialogify.closeAll()
                        if (rdata.response.error) {
                            Dialogify.alert(rdata.response.msg)
                        } else {
                            Dialogify.alert("封鎖成功")
                        }
                    }
                })
            }
        });
    };

    for(let user of jQuery(".c-post__header__author")){
        let uid = jQuery(user).find(".userid")[0].innerText
        jQuery(user).append(`
<a class="floor tippy-gpbp" data-tooltipped="" data-original-title="封鎖此人" onclick="event.stopPropagation(); block_button('${uid}')">
    封鎖此人
</a>
`)
    }
})();