// ==UserScript==
// @name         Spoiler Blocker
// @namespace    https://github.com/tark1998/spoiler-blocker/tree/main
// @version      2025-06-05
// @description  Block the spoiler from the title
// @author       You
// @match        https://*.fmkorea.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/538470/Spoiler%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/538470/Spoiler%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function hilight_keyword(el,reg,color){
        el.innerHTML = el.innerHTML.replace(reg,"\<span style='background-color: "+color+";'\>$1\</span\>")
    }

    const colorCookie = document.cookie.match(/night_mode=[^;]+/);
    const color = colorCookie && colorCookie[0][11]=="Y" ? "yellow" : "red"
    const reg = /(?<!(?:ㄴ|노))(스포|ㅅㅍ)(?!(?:츠|x|X|아님|없음))/;
    const imgUrl = "https://arca.live/static/assets/images/spoiler-alert.png?t=07184c06fc58e18ac8bbb2f2d8a223d934cd5a72";

    document.querySelectorAll('li.li.li_best2_pop0 > div > h3, li[class="clear"] > div > h3, table.bd_lst > tbody > tr > td > a:not(.replyNum)').forEach(
        (el)=>{hilight_keyword(el,reg,color);}
    )

    var title = document.querySelector(".np_18px_span");
    if (title.innerHTML.match(reg).length){
        hilight_keyword(title,reg,color);
        var img = document.createElement("img");
        img.classList.add("auto_insert");
        img.style.maxWidth="100%";
        img.src = imgUrl;
        document.querySelector(".document_address").insertAdjacentElement("afterend",img);
    }

})();
