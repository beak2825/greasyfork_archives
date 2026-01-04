// ==UserScript==
// @license MIT
// @name        SAIA_TRACK_RACE
// @namespace   SAIA_TRACK_AND_RACE
// @include     https://www.saia.com/track*
// @grant       BPTS.com
// @version     1198
// @author      Paul
// @description HemaSourceSAIATrackTrace
// @downloadURL https://update.greasyfork.org/scripts/502244/SAIA_TRACK_RACE.user.js
// @updateURL https://update.greasyfork.org/scripts/502244/SAIA_TRACK_RACE.meta.js
// ==/UserScript==

// 10/27/2021 Paul.  Collapsible sub-panels need cookie access.
$(function () {
    setInterval(function () {
        appendHTMLDocTextbox();
        //console.log("这条信息会每隔1秒显示一次");
    }, 1000);

    function appendHTMLDocTextbox() {
        if ($("#htmlDoc").length > 0) {
        }
        else {
            var htmlDoc = '<p><h4 style="color:#444;">HTML Doc</h4></p><input id="htmlDoc" class="form-control ng-dirty ng-valid ng-touched" style="margin-top:16px;background-color:lightslategrey;color:white;" maxlength="600" rows="4" type="text"></input>';
            $("#trackingNumbers").after(htmlDoc);

            $("button[type=submit]").click(function () {
              //alert('Track clicked');
              //alert("btn Track clicked.");
              setTimeout(function () {
                  // 这里是你想要延迟执行的代码
                  appendHTMLDocTextbox();
                  if ($("#trackingResults").length > 0) {
                      $("#htmlDoc").val($("#trackingResults").parent().html());
                      $("#htmlDoc").focus();
                      $("#htmlDoc").select();
                      document.execCommand('copy');
                      alert("HTML already copied to your clipboard.");
                  }
              }, 2000);
          });
        }
    }

});

