// ==UserScript==
// @name         he_deploy_manager_toolbar
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  HE发布管理工具增强
// @author       dong.luo
// @include      /^http[s]*:\/\/deploymanager.happyelements.net
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425064/he_deploy_manager_toolbar.user.js
// @updateURL https://update.greasyfork.org/scripts/425064/he_deploy_manager_toolbar.meta.js
// ==/UserScript==


(function() {
  'use strict';

  // 配置
  var configs = {
    "options" : {
    }
  };

  //==========================================
  // var $ = window.jQuery;
  var $ = window.jQuery.noConflict(true);

  showTips();

  function showTips() {
    $("body").append("<div style='position: absolute; top:200px; left: 580px; color: #FF0000; font-size: 30px; font-weight: bold;'>" +
        "<span id='span_server_info'></span> 开Stage前：同步配置 Prod &gt; Stage <span id='span_vpc_info'></span>"+
        "</div>");
  }

  // 浏览器更新到某个版本后deploymanager字体会变很小，修复它
  function fixCss() {
    var fixCssCode = '.x-toolbar td, .x-toolbar span, .x-toolbar input, .x-toolbar div, .x-toolbar select, .x-toolbar label,' +
        '.x-grid3-row td, .x-grid3-summary-row td,' +
        '.x-grid3-hd-row td,' +
        '.x-fieldset legend,' +
        '.x-window-tl .x-window-header,' +
        '.ext-webkit .x-small-editor .x-form-field,' +
        '.x-btn button,' +
        '.x-tree-node{font-size: 12px;}';
    $("body").append('<style type="text/css">'+fixCssCode+'</style>');
  }
  fixCss();


  setInterval(function(){
    var currAppId = $("#ext-comp-1008").val();
    if(currAppId.indexOf("vpc") < 0 && currAppId.indexOf("botim") < 0) {
      $('#span_vpc_info').html("，非VPC网络");
    }else {
      $('#span_vpc_info').html("");
    }
    var serverName = "";
    switch (currAppId) {
      case "cloveren-vpc": serverName="台湾"; break;
      case "clover-vpc": serverName="国内"; break;
      case "h5clover-vpc": serverName="H5"; break;
      case "h5cloverPvp-vpc": serverName="H5-PVP"; break;
      case "h5cloverIdp-vpc": serverName="H5-独立服"; break;
      case "h5clover-botim": serverName="Botim"; break;
      case "h5cloverIdp-botim": serverName="Botim-独立服"; break;
    }
    if (serverName != "") {
      $("#span_server_info").html("【"+serverName+"】");
    }

  }, 1000);

})();