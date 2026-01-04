// ==UserScript==
// @name         图标替换辅助工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  辅助图标替换
// @author       jiezi19971225
// @include      http://localhost*
// @include      https://localhost*
// @match        http://*.xiaoman.cn/*
// @match        https://*.xiaoman.cn/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.9.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js
// @run-at       document-idle
// @grant        GM_addStyle
// @encoding        utf-8
// @downloadURL https://update.greasyfork.org/scripts/427245/%E5%9B%BE%E6%A0%87%E6%9B%BF%E6%8D%A2%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/427245/%E5%9B%BE%E6%A0%87%E6%9B%BF%E6%8D%A2%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function toggleStyle(style, initActive) {
    var styleEle = GM_addStyle(style);
    var styleActive = !!initActive;
    if (!styleActive) {
      styleEle.remove();
    }
    return function (state) {
      if (state === undefined) {
        styleActive = !styleActive;
      } else {
        styleActive = !!state;
      }
      if (!styleActive) {
        styleEle.remove();
      } else {
        $("head").append(styleEle);
      }
    };
  }

  GM_addStyle(`
.icon-replace-helper-iconname{
  width:40px;
  word-break:break-all;
  text-align:left;
  z-index:9;
  display:block;
  position:absolute;
  color: red !important;
  bottom:-28px;
  left: 0;
  font-size:12px;
  line-height:12px;
}
   `);

  var toggleHighLightIconfontStyle = toggleStyle(
    `
.m-icon {
outline:1px solid red !important;
}
    `,
    true
  );

  var toggleHighLightAmumuIconStyle = toggleStyle(
    `
.mm-icon {
outline:1px solid blue !important;
}
    `,
    true
  );

  var showNameFlag = true;

  GM_addStyle(`
.icon-replace-helper-controller{
padding:10px;
z-index:10000;
cursor:move;
width:200px;
position:absolute;
right:50px;
top:200px;
background:#eee;
border-radius:4px;
border:1px solid #ccc;
font-size:16px;
}
.icon-replace-helper-controller-header{
color: #0099CC;
}
.icon-replace-helper-controller-checkbox{
display:block;
}
.icon-replace-helper-tip{
position:absolute;
background:#9FC;
border-color:#F60;
z-index:9999;
opacity: 0.8;
}
    `);

  function addControler() {
    var controller = $(`<div class="icon-replace-helper-controller">
        <div class="icon-replace-helper-controller-header">图标替换助手</div>
        <div class="icon-replace-helper-controller-checkbox">
        <input type="checkbox" name="iconfont" id="iconfont-checkbox" checked/>
        高亮iconfont图标(红色边框)
        </div>
        <div class="icon-replace-helper-controller-checkbox">
        <input type="checkbox" name="amumu" id="amumu-checkbox" checked/>
        高亮amumu图标(蓝色边框)
        </div>
        <div class="icon-replace-helper-controller-checkbox">
        <input type="checkbox" name="iconname" id="iconname-checkbox" checked/>
        显示图标名称
        </div>
        </div>`);
    $("body").append(controller);
    $(controller).draggable();
    $("#iconfont-checkbox").change(function () {
      toggleHighLightIconfontStyle();
    });
    $("#amumu-checkbox").change(function () {
      toggleHighLightAmumuIconStyle();
    });
    $("#iconname-checkbox").change(function () {
      toggleShowName();
    });
  }

  function showName() {
    $(".icon-replace-helper-iconname,.icon-replace-helper-tip").remove();

    $(".m-icon,.mm-icon").each(function () {
      var classList = $(this).attr("class");
      var iconNameReg =
        /\sicon-([-A-Za-z0-9]*)|^icon-([-A-Za-z0-9]*)|\smm-icon-([-A-Za-z0-9]*)|^mm-icon-([-A-Za-z0-9]*)/;
      var result = classList.match(iconNameReg);
      if (Array.isArray(result)) {
        var iconName = result[1] || result[2] || result[3] || result[4];

        var iconNameEle = $(
          `<span class="icon-replace-helper-iconname">${iconName}</span>`
        );
        $(this).hover(function (element) {
          var tip = $(`<div class='icon-replace-helper-tip'>${iconName}</div>`);
          $("body").append(tip);
          tip.css({ top: element.pageY + "px", left: element.pageX + "px" });
          $(this).mousemove(function (e) {
            tip.css({ top: e.pageY + 10 + "px", left: e.pageX - 10 + "px" });
          });
        });
        if (showNameFlag) {
          var parentNode = $(this);
          if (classList.includes("mm-icon")) {
            parentNode = parentNode.parent();
          }
          var position = parentNode.css("position");
          if (position === "static") {
            parentNode.css({ position: "relative" });
          }
          parentNode.append(iconNameEle);
        }
      }
    });
  }

  function toggleShowName() {
    showNameFlag = !showNameFlag;
  }

  setInterval(showName, 2000);

  addControler();
})();
