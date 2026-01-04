// ==UserScript==
// @name        8°无码页面移除右键限制
// @description 8yml站点无码+右键存图解除限制
// @author      KUMA
// @version     1.0
// @match       *://8yml8yml.wixsite.com/88888888/r18s
// @require     http://code.jquery.com/jquery-3.3.1.min.js
// @grant       none
// @run-at      document-end
// @namespace https://greasyfork.org/users/299057
// @downloadURL https://update.greasyfork.org/scripts/386688/8%C2%B0%E6%97%A0%E7%A0%81%E9%A1%B5%E9%9D%A2%E7%A7%BB%E9%99%A4%E5%8F%B3%E9%94%AE%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/386688/8%C2%B0%E6%97%A0%E7%A0%81%E9%A1%B5%E9%9D%A2%E7%A7%BB%E9%99%A4%E5%8F%B3%E9%94%AE%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

$(document).ready(function(){
  document.addEventListener('contextmenu', function(e){
    e.stopPropagation();
    return true;
  }, true);
  $(document).delegate('div[data-key="gallery-wrapper-comp-jprcai2h"]', 'DOMNodeInserted', function(){
    $(this).find('#fullscreen-view img').each(function(){
      $(this).attr('src', $(this).attr('src').replace(/^([^:]+:\/\/[^/]+\/[^/]+\/[^/]+).*$/, '$1'));
    });
  });
});