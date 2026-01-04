// ==UserScript==
// @name         煎蛋屏蔽特定用户
// @namespace    jandan.net
// @description  按用户名屏蔽特定用户。
// @match       https://jandan.net/treehole*
// @match       https://jandan.net/top*
// @match       https://jandan.net/duan*
// @match       https://jandan.net/pic*
// @match       https://jandan.net/api/top*
// @require     https://scriptcat.org/lib/637/1.4.5/ajaxHooker.js#sha256=EGhGTDeet8zLCPnx8+72H15QYRfpTX4MbhyJ4lJZmyg=
// @grant       none
// @version     1.1
// @author      JuanWoo
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/534473/%E7%85%8E%E8%9B%8B%E5%B1%8F%E8%94%BD%E7%89%B9%E5%AE%9A%E7%94%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/534473/%E7%85%8E%E8%9B%8B%E5%B1%8F%E8%94%BD%E7%89%B9%E5%AE%9A%E7%94%A8%E6%88%B7.meta.js
// ==/UserScript==

/* globals ajaxHooker,$ */

const blockUsers = [""]; // 要屏蔽的用户名，格式：["a","b","c"]

const commentNodes = document.querySelectorAll("div[class^=comment-row]");
let author = "";
commentNodes.forEach((v) => {
    author = v.querySelector('span[class^=author-]').textContent;
    if (blockUsers.includes(author)) {
        v.remove();
    }
});

ajaxHooker.hook(request => {
    request.response = response => {
        if (response.finalUrl.indexOf('/api/top/')>0) {
            let res = JSON.parse(response.response).data;
            for (var i = 0; i < res.length; i++){
                if(blockUsers.includes(res[i].author)){
                    res.splice(i, 1);
                    i--;
                }
            }
            let modifiedResponse = JSON.parse(response.response);
            modifiedResponse.data = res;

            response.responseText = new Promise(resolve => {
                setTimeout(() => {
                    resolve(JSON.stringify(modifiedResponse));
                }, 50);
            });
        } else if (response.finalUrl.indexOf('api/tucao/list/')>0) {
            let res = JSON.parse(response.response);
            for (var j = 0; j < res.tucao.length; j++){
                if(blockUsers.includes(res.tucao[j].comment_author)){
                    res.tucao.splice(j, 1);
                    j--;
                }
            }
            for (var k = 0; k < res.hot_tucao.length; k++){
                if(blockUsers.includes(res.hot_tucao[k].comment_author)){
                    res.hot_tucao.splice(k, 1);
                    k--;
                }
            }
            let modifiedResponse = JSON.parse(response.response);
            modifiedResponse = res;

            response.responseText = new Promise(resolve => {
                setTimeout(() => {
                    resolve(JSON.stringify(modifiedResponse));
                }, 50);
            });
        }
    };
});