// ==UserScript==
// @name      快速修改任天堂账户区域
// @namespace 
// @author    Alan
// @version    1.2.0
// @description  方便用户快速切换任天堂的区域，今夜我们不止是墨西哥人！
// @require        http://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @include        https://accounts.nintendo.com/profile/edit
// @grant          none

// @downloadURL https://update.greasyfork.org/scripts/371694/%E5%BF%AB%E9%80%9F%E4%BF%AE%E6%94%B9%E4%BB%BB%E5%A4%A9%E5%A0%82%E8%B4%A6%E6%88%B7%E5%8C%BA%E5%9F%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/371694/%E5%BF%AB%E9%80%9F%E4%BF%AE%E6%94%B9%E4%BB%BB%E5%A4%A9%E5%A0%82%E8%B4%A6%E6%88%B7%E5%8C%BA%E5%9F%9F.meta.js
// ==/UserScript==
(function () {
  'use strict';
  var buttonType = {
    "display":"block",
    "margin-bottom":"10px"
  };
  var buttonGroup = '<div style="position: fixed;top:200px;right: 30px;"><button class="btn-change-place" data-id="161" data-country="307" >南非</button><button class="btn-change-place" data-id="102" data-country="181" >墨西哥</button><button class="btn-change-place" data-id="153" data-country="270">美国</button><button class="btn-change-place" data-id="75" data-country="148">日本</button><button class="btn-change-place" data-id="110" data-country="201">挪威</button></div>'
  $("body").append(buttonGroup);
  $(".btn-change-place").css(buttonType);
  $(".btn-change-place").on("click",function(){
    $("select[name='country_id']").val($(this).data("id"));
    // $("select[name='country_id']").trigger("change");
    // $("select[name='country_id']").change();
       $("select[name='timezone_id']").html("");
       $("select[name='timezone_id']").append("<option select value='"+$(this).data("country")+"'>自动选择地区</option>");
  });
})();