// ==UserScript==
// @name            heliosman<汇联易中控增强插件>
// @namespace       https://github.com/swyrzsyf/heliosman
// @version         1.1
// @description     汇联易中控增强插件旨在帮助第三方系统与汇联易集成，将第三方系统集成所需信息快速、便捷的展示给集成开发者。汇联易中控增强插件仅仅处理当前登录账号有权限访问数据并基于汇联易开放接口处理并展示数据。插件运行过程中不收集任何数据。
// @author          在水一方
// @license         Apache License 2.0
// @homepage        https://github.com/swyrzsyf/heliosman
// @include         http://*.huilianyi.com/main/*
// @include         https://*.huilianyi.com/main/*
// @include         https://*.spendia.jp/main/*
// @icon            https://github.com/swyrzsyf/heliosman/blob/main/material/heliosman.png
// @run-at          document-idle
// @grant           GM_log
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_xmlhttpRequest
// @grant           GM_addStyle
// @grant           GM_setClipboard
// @grant           GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/428724/heliosman%3C%E6%B1%87%E8%81%94%E6%98%93%E4%B8%AD%E6%8E%A7%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6%3E.user.js
// @updateURL https://update.greasyfork.org/scripts/428724/heliosman%3C%E6%B1%87%E8%81%94%E6%98%93%E4%B8%AD%E6%8E%A7%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6%3E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clearValues(){
        //清理当前账号token
        GM_deleteValue("accountToken");
        GM_deleteValue("tenantId");
        GM_deleteValue("tenantName");
        GM_deleteValue("clientId");
        GM_deleteValue("clientSecret");
    }
    /**
     * 判断参数是否空值
     * @param  {[type]} value 待判断参数
     * @return {Boolean}       value为""、undefined、null、"null"、0、false时返回true，否则返回false
     */
    function empty(value){
      if(value == undefined){
        return true;
      }
      if(value === "undefined"){
        return true;
      }
      if(value == "null"){
        return true;
      }
      if(value === "null"){
        return true;
      }
      if(value === 0){
        return true;
      }
      if(value == false){
        return true;
      }
      if(value.length===0){
        return true;
      }
      return false;
    }

    function getWebToken(){
      let accountTokenInfo = localStorage.getItem("hly.token");
      let accountToken = JSON.parse(accountTokenInfo);
      return accountToken.token_type + " " + accountToken.access_token;
    }
    /**
     * 检查缓存Token和网站Token是否一致，不一致时清楚所有缓存数据
     */
    function checkAccountToken(){
      let accountToken = GM_getValue("accountToken");
      if(accountToken && accountToken!=getWebToken()){
        clearValues();
      }
    }

    function refreshAccountToken(){
        let token = getWebToken();
        GM_setValue("accountToken", token);
        return token;
    }

    /**
     * 刷新OPEN API秘钥信息
     */
    function refreshClientInfo(){
      checkAccountToken();
      let accountToken = GM_getValue("accountToken");
      let clientId = GM_getValue("clientId");
      if(!accountToken){
          accountToken = refreshAccountToken();
      }
      if(!empty(accountToken) && empty(clientId)){
        let origin = window.location.origin;
        let clientDetails = {
          "method": "GET",
          "url": origin + "/api/company/my/clientInfo?roleType=TENANT",
          "headers": {
            "Authorization": accountToken,
            "Content-Type": "application/json"
          },
          "onload": function(resp){
            let clientInfo = JSON.parse(resp.responseText);
            if(!empty(clientInfo.clientId)){
              GM_setValue("clientId", clientInfo.clientId);
              GM_setValue("clientSecret", clientInfo.clientSecret);
            }else{
              GM_setValue("clientId", clientInfo.message);
              GM_setValue("clientSecret", clientInfo.message);
            }
            let clientIdElement = document.getElementById("clientId");
            if(clientIdElement && clientIdElement.innerHTML.length==0){
              clientIdElement.innerHTML = clientInfo.clientId;
            }
            let clientSecretElement = document.getElementById("clientSecret");
            if(clientSecretElement && clientSecretElement.innerHTML.length==0){
              clientSecretElement.innerHTML = clientInfo.clientSecret;
            }
          }
        }
        GM_xmlhttpRequest(clientDetails);
      }
    }

    /**
     * 刷新租户信息
     */
    function refreshTenantInfo(){
      checkAccountToken();
      let accountToken = GM_getValue("accountToken");
      if(!accountToken){
          accountToken = refreshAccountToken();
      }
      if(accountToken){
          if(empty(GM_getValue("tenantId"))){
            let origin = window.location.origin;
            let tenantIdDetails = {
              "method": "GET",
              "url": origin + "/api/account",
              "headers": {
                "Authorization": accountToken,
                "Content-Type": "application/json"
              },
              "onload": function(resp){
                let accountInfo = JSON.parse(resp.responseText);
                let tenantId = accountInfo.tenantId;
                GM_setValue("tenantId", tenantId);
                let tenantIdElement = document.getElementById("tenantId");
                if(tenantIdElement && tenantIdElement.innerHTML.length==0){
                  tenantIdElement.innerHTML = tenantId;
                }
                let tenantNameDetails = {
                  "method": "GET",
                  "url": origin + "/api/tenant/getById?tenantId=" + tenantId,
                  "headers": {
                    "Authorization": accountToken,
                    "Content-Type": "application/json"
                  },
                  "onload": function(resp){
                    let tenantInfo = JSON.parse(resp.responseText);
                    let tenantName = tenantInfo.tenantName;
                    GM_setValue("tenantName", tenantName);
                    let tenantNameElement = document.getElementById("tenantName");
                    if(tenantNameElement && tenantNameElement.innerHTML.length==0){
                      tenantNameElement.innerHTML = tenantName;
                    }
                  }
                }
                GM_xmlhttpRequest(tenantNameDetails);
              }
            }
            GM_xmlhttpRequest(tenantIdDetails);
          }
      }
    }

    function getShowInfo(){
      refreshAccountToken();
      refreshTenantInfo();
      refreshClientInfo()
      let showInfo = {};
      showInfo.tenantId = GM_getValue("tenantId");
      showInfo.tenantName = GM_getValue("tenantName");
      showInfo.clientId = GM_getValue("clientId");
      showInfo.clientSecret = GM_getValue("clientSecret");
      if(showInfo.tenantId == "undefined"){
        showInfo.tenantId = "";
      }
      if(showInfo.tenantName == "undefined"){
        showInfo.tenantName = "";
      }
      if(showInfo.clientId == "undefined"){
        showInfo.clientId = "";
      }
      if(showInfo.clientSecret == "undefined"){
        showInfo.clientSecret = "";
      }
      return showInfo;
    }

    /**
     * 网站上面添加控制按钮
     */
    function initHeliosman(){
      let heliosmanCSS = "#heliosman{position:absolute;top:50%;right:-10px;width:80px;height:80px;border:0}.circle{position:absolute;top:50%;left:50%;background:#13a713;color:white;font-size:20px;width:56px;text-align:center;height:56px;line-height:56px;border-radius:50%;box-shadow:0 2px 8px 0 rgb(0 0 0 / 20%);transition:all .08s;user-select:none;-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;transform:translate3d(-50%,-50%,0)}.tooltip{display:inline-block;position:relative;border-bottom:1px dotted #666;text-align:left}.tooltip h3{margin:12px 0}.tooltip .left{min-width:500px;cursor:auto;white-space:nowrap;text-align:left;top:50%;right:100%;margin-right:5px;transform:translate(0,-50%);padding:10px;background-color:#fff;background-clip:padding-box;border-radius:4px;font-weight:normal;color:rgba(0,0,0,.65);font-size:13px;position:absolute;z-index:99999999;box-sizing:border-box;display:none;border:1px solid #bfbfbf;box-shadow:0 4px 8px 0 rgb(0 0 0 / 15%)}.tooltip:hover .left{display:block}.tooltip .left div{height:24px;line-height:24px;font-size:16px;font-weight:500}.tooltip .left ul li{height:24px;line-height:24px;font-size:14px;font-weight:200}.tooltip .left ul li span{height:24px;line-height:24px;font-size:14px;font-weight:400}.tooltip .left i{position:absolute;top:50%;left:100%;margin-top:-12px;width:12px;height:24px;overflow:hidden}.tooltip .left i::after{content:'';position:absolute;width:12px;height:12px;left:0;top:50%;transform:translate(-50%,-50%) rotate(-45deg);background-color:#fff;border:1px solid #bfbfbf}.tooltip .copy{position:absolute;right:10px;cursor:pointer;font-size:14px;font-weight:500}";
      GM_addStyle(heliosmanCSS);
      let heliosmanDiv = document.createElement("div");
      heliosmanDiv.setAttribute("id", "heliosman");
      heliosmanDiv.setAttribute("class", "tooltip");
      heliosmanDiv.innerHTML = '<div id="dragElement" class="circle">H</div><div class="left"><div>租户信息<span class="copy" id="tenantInfo">点击复制</span></div><ul><li><span>租户ID：</span><span id="tenantId"></span></li><li><span>租户名称：</span><span id="tenantName"></span></li></ul><div>OPENAPI 秘钥<span id="openapiInfo" class="copy">点击复制</span></div><ul><li><span>clientId：</span><span id="clientId"></span></li><li><span>clientSecret：</span><span id="clientSecret"></span></li></ul><i></i></div>';
      document.body.appendChild(heliosmanDiv);
      drag('dragElement', true);
      document.getElementById("tenantInfo").addEventListener("click", function(){
        GM_setClipboard(GM_getValue("tenantId")+"\n"+GM_getValue("tenantName"));
        let copyElement = document.getElementById("tenantInfo");
        copyElement.innerHTML = "已复制剪切板";
        copyElement.onmouseout = function(){
          this.innerHTML = "点击复制"
        }
      });
      document.getElementById("openapiInfo").addEventListener("click", function(){
        GM_setClipboard(GM_getValue("clientId")+"\n"+GM_getValue("clientSecret"));
        let copyElement = document.getElementById("openapiInfo");
        copyElement.innerHTML = "已复制剪切板";
        copyElement.onmouseout = function(){
          this.innerHTML = "点击复制"
        }
      });
      document.getElementById("heliosman").addEventListener("mouseenter", function(){
        checkAccountToken();
        let showInfo = getShowInfo();
        if(!empty(showInfo.tenantId)){
          document.getElementById("tenantId").innerHTML = showInfo.tenantId;
        }
        if(!empty(showInfo.tenantName)){
          document.getElementById("tenantName").innerHTML = showInfo.tenantName;
        }
        if(!empty(showInfo.clientId)){
          document.getElementById("clientId").innerHTML = showInfo.clientId;
        }
        if(!empty(showInfo.clientSecret)){
          document.getElementById("clientSecret").innerHTML = showInfo.clientSecret;
        }
      });
      document.getElementById("heliosman").addEventListener("mouseleave", function(){
        document.getElementById("tenantId").innerHTML = "";
        document.getElementById("tenantName").innerHTML = "";
        document.getElementById("clientId").innerHTML = "";
        document.getElementById("clientSecret").innerHTML = "";
      });
    }

    /**
     * 拖动元素
     * @param  {String} dragElementId     拖动元素ID
     * @param  {Boolean} dragParentElement 父元素是否一起移动
     * @return
     */
    function drag(dragElementId, dragParentElement){
      //定义需要监控事件
      let startEvent, moveEvent, endEvent;
      //获取需要拖动元素
      let dragElement = document.getElementById(dragElementId);
      let parentElement = dragElement.parentNode;
      dragElement.style.position = 'absolute';
      dragElement.style.cursor = 'move';
      if(dragParentElement){
        parentElement.style.position = 'absolute';
        parentElement.style.cursor = 'move';
      }
      //标记是拖曳还是点击
      let isClick = true;
      let disX, disY, left, top, starX, starY;
      //判断是否支持触摸事件
      if ('ontouchstart' in window){
        startEvent = 'touchstart';
        moveEvent = 'touchmove';
        endEvent = 'touchend';
      } else {
        startEvent = 'mousedown';
        moveEvent = 'mousemove';
        endEvent = 'mouseup';
      }
      dragElement.addEventListener(startEvent, start);

      /**
       * 手指或鼠标按下时执行操作
       */
      function start(e){
        //阻止页面的滚动，缩放
        e.preventDefault();
        //兼容IE浏览器
        let currentEvent = e || window.event;
        isClick = true;
        //手指或鼠标按下时的坐标
        starX = currentEvent.touches ? currentEvent.touches[0].clientX : currentEvent.clientX;
        starY = currentEvent.touches ? currentEvent.touches[0].clientY : currentEvent.clientY;
        //手指或鼠标相对于拖动元素左上角的位置
        if(dragParentElement){
          disX = starX - parentElement.offsetLeft;
          disY = starY - parentElement.offsetTop;
        }else{
          disX = starX - dragElement.offsetLeft;
          disY = starY - dragElement.offsetTop;
        }
        //按下之后才监听后续事件
        document.addEventListener(moveEvent, move);
        document.addEventListener(endEvent, end);
      }

      /**
       * 手指或鼠标移动时执行操作
       */
      function move(e){
        //兼容IE浏览器
        let currentEvent = e || window.event;
        //防止触摸不灵敏，拖动距离大于20像素就认为不是点击，小于20就认为是点击
        let currentX = currentEvent.touches ? currentEvent.touches[0].clientX : currentEvent.clientX;
        let currentY = currentEvent.touches ? currentEvent.touches[0].clientY : currentEvent.clientY;
        if(Math.abs(starX - currentX) > 20 || Math.abs(starY - currentY) > 20){
          isClick = false;
        }
        left = currentX - disX;
        top = currentY - disY;
        //限制拖拽的X范围，不能拖出屏幕
        if(left < 0){
          left = 0;
        }else if(left > (document.documentElement.clientWidth - dragElement.offsetWidth)){
          left = document.documentElement.clientWidth - dragElement.offsetWidth;
        }
        //限制拖拽的Y范围，不能拖出屏幕
        if(top < 0){
          top = 0;
        }else if(top > (document.documentElement.clientHeight - dragElement.offsetHeight)){
          top = document.documentElement.clientHeight - dragElement.offsetHeight;
        }
        if(dragParentElement){
          parentElement.style.left = left + 'px';
          parentElement.style.top = top + 'px';
        }else{
          dragElement.style.left = left + 'px';
          dragElement.style.top = top + 'px';
        }
      }

      /**
       * 手指或鼠标抬起时执行操作
       */
      function end(){
        document.removeEventListener(moveEvent, move);
        document.removeEventListener(endEvent, end);
      }
    }

    clearValues();
    window.onload = function() {
      refreshAccountToken();
      GM_addValueChangeListener("accountToken", function(name, old_value, new_value, remote) {
        GM_deleteValue("tenantId");
        GM_deleteValue("tenantName");
        GM_deleteValue("clientId");
        GM_deleteValue("clientSecret");
      });
      refreshTenantInfo();
      refreshClientInfo();
      setTimeout(function(){
        initHeliosman();
      }, 2000);
    };
})();
