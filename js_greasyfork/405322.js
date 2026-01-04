// ==UserScript==
// @name         SCNU选课系统改善
// @version      0.1
// @description  自动加载选课列表，改善外观效果
// @author       LittleboyHarry
// @grant        none
// @namespace    https://greasyfork.org/users/457866
// @author       You
// @match        https://jwxt.scnu.edu.cn/xsxk/zzxkyzb_cxZzxkYzbIndex.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405322/SCNU%E9%80%89%E8%AF%BE%E7%B3%BB%E7%BB%9F%E6%94%B9%E5%96%84.user.js
// @updateURL https://update.greasyfork.org/scripts/405322/SCNU%E9%80%89%E8%AF%BE%E7%B3%BB%E7%BB%9F%E6%94%B9%E5%96%84.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    document.querySelector("#searchBox > div > div.row.search-filter > div > div > div > div > span > button.btn.btn-primary.btn-sm").click()

    let loadMore = true
    const endSignDiv = document.querySelector("#endsign")
    const loadMoreBtn = document.querySelector("#more > font > a")

    loadMoreBtn.addEventListener('click',()=>{ loadMore = true })

    setInterval(()=>{
        if(loadMore){
            if(endSignDiv.style.display=="none") loadMoreBtn.click()
            else loadMore = false
        }
    },600)

    const styleNode = document.createElement('style')
    styleNode.appendChild(document.createTextNode(`
#contentBox>.tjxk_list>.panel-info {position: relative;}
.panel-body.table-responsive {
position: absolute;
    z-index: 4;
background: white;
    left: 0px;
    right: 0px;
    bottom: 120%;
    border-radius: 4px;
border: 2px solid #eee;
box-shadow: 0 -2px 4px grey;
}
.panel.panel-info:first-of-type>.panel-body {
    top: 120%;
    bottom: unset;
}
`))

    document.body.appendChild(styleNode)
})();