// ==UserScript==
// @name v2ex屏蔽不想看到的节点
// @namespace https://www.v2ex.com
// @match https://www.v2ex.com/?tab=*
// @description  在v2ex首页屏蔽你不想看到的节点
// @author       apethink
// @version      0.0.1
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/387845/v2ex%E5%B1%8F%E8%94%BD%E4%B8%8D%E6%83%B3%E7%9C%8B%E5%88%B0%E7%9A%84%E8%8A%82%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/387845/v2ex%E5%B1%8F%E8%94%BD%E4%B8%8D%E6%83%B3%E7%9C%8B%E5%88%B0%E7%9A%84%E8%8A%82%E7%82%B9.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var nodeNames=['自言自语','无要点'];    //在这里填入节点名称
    document.querySelectorAll('.cell.item').forEach(function(e){
      var nodeName=e.querySelector('.node').innerHTML;
      if(nodeNames.indexOf(nodeName)!=-1){
        e.style.display='none';
      }
    });
})();
