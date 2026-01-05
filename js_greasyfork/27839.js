// ==UserScript==
// @name                CNKI Helper
// @description         在CNKI Grid2008版搜索结果页直接下载PDF（http://epub.cnki.net/grid2008/index/ZKCALD.htm）。
// @author              Damn
// @namespace           incast.info
// @run-at              document-start
// @include             http://epub.cnki.net/grid2008/brief/brief.aspx*
// @match               http://epub.cnki.net/grid2008/brief/brief.aspx*
// @date                3/4/2017
// @version             1.0.6
// @downloadURL https://update.greasyfork.org/scripts/27839/CNKI%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/27839/CNKI%20Helper.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded',proceed());
var mo=new MutationObserver(function(){proceed();});
mo.observe(document,{'childList':true,'subtree':true});
function proceed(){
  if (document.body){
    [].forEach.call(document.querySelectorAll('a'), function(node) {
      if ((node.href.indexOf("download.aspx?filename")>0)*(node.href.indexOf("&dflag=pdfdown")<0)){
        node.href=node.href+"&dflag=pdfdown";
      }
    });
  }
}
