// ==UserScript==
// @name        theCrag - AddRoutesHotKeys
// @namespace   theCrag.com
// @author      NickyHochmuth
// @description adds hotKeys to theCrag add multible route page: alt+down or alt+up  will jump to the next/previous route block into the route name field
// @icon        https://www.google.com/s2/favicons?domain=thecrag.com
// @include     https://www.thecrag.com/CIDS/cgi-bin/cids.cgi?routes=*
// @require     https://greasyfork.org/scripts/8984-jquery-hotkeys-plugin/code/jQuery%20Hotkeys%20Plugin.js?version=44373
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/429733/theCrag%20-%20AddRoutesHotKeys.user.js
// @updateURL https://update.greasyfork.org/scripts/429733/theCrag%20-%20AddRoutesHotKeys.meta.js
// ==/UserScript==



function prevRoute(evt) {
  var $focused = jQuery(document.activeElement).closest('div.update-element');
  
  var $nextRouteName = $focused.prevAll().each(function (index) {
    var $inputNames = $(this).find("input[name^='D\:Name\-new']");
    if ($inputNames.length == 1) {
      $inputNames.eq(0).focus();
      return false;  
    }
    
  });
}

function nextRoute(evt) {
  var $focused = jQuery(document.activeElement).closest('div.update-element');
  var $nextRouteName = $focused.nextAll().each(function (index) {
    var $inputNames = $(this).find("input[name^='D\:Name\-new']");
    if ($inputNames.length == 1) {
      $inputNames.eq(0).focus();
      return false;  
    }
    
  });
}

$(document).ready(function () {
  
  jQuery('input, textarea, select').bind('keydown', 'alt+up', prevRoute);
  jQuery('input, textarea, select').bind('keydown', 'alt+down', nextRoute);

});