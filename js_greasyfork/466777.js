// ==UserScript==
// @name         1234漫画助手
// @namespace    https://sfkgroup.github.io/
// @version      0.4
// @description  Tool for read comic
// @author       SFKgroup
// @match        https://www.ymh1234.com/comic/*/*
// @grant        GM_log
// @icon         https://sfkgroup.github.io/images/favicon.ico
// @license      LGPL
// @downloadURL https://update.greasyfork.org/scripts/466777/1234%E6%BC%AB%E7%94%BB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/466777/1234%E6%BC%AB%E7%94%BB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function createNode(head,num) {
        var container = document.createDocumentFragment();
        var e_0 = document.createElement("div");
        e_0.setAttribute("class", "picNav");
        var e_1 = document.createElement("a");
        e_1.setAttribute("href", "https://www.ymh1234.com/comic/"+head+'/'+(num-1)+'.html');
        e_1.setAttribute("class", "prev");
        e_1.appendChild(document.createTextNode("上一章"));
        e_0.appendChild(e_1);
        var e_2 = document.createElement("a");
        e_2.setAttribute("href", "https://www.ymh1234.com/comic/"+head+'/'+(num+1)+'.html');
        e_2.setAttribute("class", "next");
        e_2.appendChild(document.createTextNode("下一章"));
        e_0.appendChild(e_2);
        container.appendChild(e_0);
        return container;
    }
    var path_name=window.location.pathname.replace('.html','').replace('/comic/','').split('/')
    var head = 'https://images.wszwhg.net/'
    //GM_log(chapterImages);
    //GM_log(chapterPath);
    //GM_log(path_name)
    let k
    let element = document.querySelector("#images")
    if (element && chapterImages && chapterPath){
        for (k=0;k<element.children.length;k++)
        {
            element.children[k].remove()
        }
        for (k=0;k<chapterImages.length;k++)
        {
            let url = head+chapterPath+chapterImages[k]
            let img = document.createElement("img")
            img.src = url
            element.appendChild(img)
        }
        element.appendChild(createNode(path_name[0],parseInt(path_name[1])))
        document.querySelector("body > div.picNav").remove()
        document.querySelector("body > div.iFloat").remove()
        document.querySelector("body > div.picNav").remove()
        document.querySelector("body > div.notice").remove()
        document.querySelector("#images > p").remove()
        document.querySelector("#qTcms_picID").remove()
    }
})();