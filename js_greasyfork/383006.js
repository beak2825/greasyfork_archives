// ==UserScript==
// @name         番组计划主页中文标题
// @version      0.1.2.1
// @description  Bangumi番组计划中文标题
// @author       oscardoudou
// @include      *://bgm.tv/
// @include      *://bangumi.tv/
// @grant        none
// credit        ipcjs
// @namespace https://github.com/oscardoudou/
// @downloadURL https://update.greasyfork.org/scripts/383006/%E7%95%AA%E7%BB%84%E8%AE%A1%E5%88%92%E4%B8%BB%E9%A1%B5%E4%B8%AD%E6%96%87%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/383006/%E7%95%AA%E7%BB%84%E8%AE%A1%E5%88%92%E4%B8%BB%E9%A1%B5%E4%B8%AD%E6%96%87%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==


(function() {
    'use strict'
    const texts = document.querySelectorAll('.infoWrapper_tv .headerInner .l.textTip')
    const liNodeList = document.getElementById('prgSubjectList').querySelectorAll(".clearit")
    liNodeList.forEach((item,index) => {
        //anime
        if(item.getAttribute('subject_type') === "2"){
            var title_ch = item.children[3].getAttribute('data-subject-name-cn')
            //only replace original title when cn title availablt
           if(title_ch != ""){
            item.querySelectorAll("span")[1].innerHTML = title_ch
            texts[index].innerHTML = texts[index].getAttribute('data-subject-name-cn')
           }
        }
        //book
        if(item.getAttribute('subject_type') === "1"){
            //todo book w/o cn title check
            //detailview title replace
            title_ch = item.children[2].getAttribute('data-subject-name-cn')
            item.querySelectorAll("span")[1].innerHTML = title_ch
        }
        //potential category
    })
})();