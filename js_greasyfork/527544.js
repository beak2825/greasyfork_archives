// ==UserScript==
// @name         DLマグネット(Tampermonkey専用)
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  表示している作品のマグネットを https://sukebei.nyaa.si/ から検索します。
// @author       あるぱか
// @match        https://www.dlsite.com/maniax/work/=/product_id/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dlsite.com
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527544/DL%E3%83%9E%E3%82%B0%E3%83%8D%E3%83%83%E3%83%88%28Tampermonkey%E5%B0%82%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527544/DL%E3%83%9E%E3%82%B0%E3%83%8D%E3%83%83%E3%83%88%28Tampermonkey%E5%B0%82%E7%94%A8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const idDL = location.pathname.match(/(?<=.+\/)\w+(?=\.html)/);

    GM.xmlHttpRequest({
        method: "GET",
        url: "https://sukebei.nyaa.si/?q=" + idDL,
        onload: function(response) {
            const responseXML = null;
            if (!response.responseXML) {
                responseXML = new DOMParser()
                    .parseFromString(response.responseText, "text/xml");
            };
            if (response.readyState == 4 && response.status == 200) {
                const resP = response.responseText.match(/(?<=<a href=")magnet:.+(?="><i class="fa fa-fw fa-magnet"><\/i><\/a>)/);
                const resD = response.responseText.match(/(?<=<td class="text-center" data-timestamp="\d+">)\d{4}-\d{2}-\d{2} \d{2}:\d{2}(?=<\/td>)/);
                const caE = document.querySelector("#work_outline > tbody")
                const c1 = document.createElement('tr');
                const c2 = document.createElement('th');
                const c3 = document.createElement('td');
                const inH = document.createElement('a');
                resP ? (
                    inH.href = resP,
                    inH.textContent = resD,
                    inH.style.fontSize = "15px",
                    c3.prepend(inH)

                ) : (
                    c3.prepend("見つかりませんでした")
                );
                c2.prepend("マグネット")
                c1.append(c2);
                c1.append(c3);
                caE.append(c1);
            } else {
                console.log(`Error: ${response.status}`);
            };
        }});
})();