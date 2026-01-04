// ==UserScript==
// @version 20180402
// @name SplendidCRM Admin Page Highlight
// @namespace SplendidCRMAdminPageHighlight
// @match *://*/*/Administration/DynamicLayout/EditViews/default.aspx
// @match *://*/Administration/DynamicLayout/EditViews/default.aspx
// @match *://*/*/Administration/DynamicLayout/GridViews/default.aspx
// @match *://*/Administration/DynamicLayout/GridViews/default.aspx
// @match *://*/*/Administration/DynamicLayout/DetailViews/default.aspx
// @match *://*/Administration/DynamicLayout/DetailViews/default.aspx
// @grant none
// @license MIT 
// @description This is a SplendidCRM Admin Page Highlight tool
// @downloadURL https://update.greasyfork.org/scripts/442403/SplendidCRM%20Admin%20Page%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/442403/SplendidCRM%20Admin%20Page%20Highlight.meta.js
// ==/UserScript==
$(function(){

$(".nodeStudioFolderLink").each(function(){
    var innertext=$(this).text();
        if(innertext=="InvoiceHistory" ||innertext=="ImageIndexing" ||innertext=="ProcessImages" ||innertext=="Tasks"){
          $(this).css({"color":"red","font-weight":"bold","font-size":"24px","backgound-color":"lightyellow"});
          var tbl=$(this).parent().parent().parent().parent();
          var div=$(this).parent().parent().parent().parent().next();
          $("[ID$=ctlSearch_treeMainn0Nodes]").prepend($(tbl));
          $("[ID$=ctlSearch_treeMainn0Nodes]").prepend($(div))
        }  
    });
    
});