// ==UserScript==
// @name              解除网页右键限制
// @author            wangzijian0@vip.qq.com
// @description       解除网页禁止复制、剪切、文本选择、右键菜单的限制，不一定支持所有网页，但如果你有能解决部分无法处理的网页方案可以发送邮件到：wangzijian0@vip.qq.com
// @version           1.0.0.20250403
// @icon              data:image/png;base64,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
// @match             *://*/*
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_deleteValue
// @grant             GM_registerMenuCommand
// @grant             GM_addStyle
// @run-at            document-start
// @namespace         https://greasyfork.org/users/1453515
// @license           MIT

// @downloadURL https://update.greasyfork.org/scripts/531684/%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E5%8F%B3%E9%94%AE%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/531684/%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E5%8F%B3%E9%94%AE%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 域名规则列表
  var rules = {
    default_rule: {
      name: "default",
      hook_eventNames: "contextmenu|select|selectstart|copy|cut|dragstart",
      unhook_eventNames: "mousedown|mouseup|keydown|keyup",
      dom0: true,
      hook_addEventListener: true,
      hook_preventDefault: true,
      hook_set_returnValue: true,
      add_css: true
    }
  };

  // 要处理的 event 列表
  var hook_eventNames, unhook_eventNames, eventNames;
  // 储存名称
  var storageName = getRandStr('qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM', parseInt(Math.random() * 12 + 8));
  // 储存被 Hook 的函数
  var EventTarget_addEventListener = EventTarget.prototype.addEventListener;
  var document_addEventListener = document.addEventListener;
  var Event_preventDefault = Event.prototype.preventDefault;

  // 悬浮框相关变量
  var rwl_userData = null;
  var hostname = window.location.hostname;
  var btn_node = null;
  var rule = null;
  var list = [];
  var hasFrame = false;

  // 初始化设置
  var settingData = {
    "version": 0.1,
    "positionTop": "0",
    "positionLeft": "0",
    "positionRight": "auto",
    "addBtn": true,
    "data": [
      "example.com",
    ],
    "enabledSites": []  // 存储已启用的网站
  };

  // 加载用户设置
  rwl_userData = GM_getValue("rwl_userData");
  if (!rwl_userData) {
    rwl_userData = JSON.parse(JSON.stringify(settingData));
    GM_setValue("rwl_userData", rwl_userData);
  } else {
    for (let key in settingData) {
      if (!rwl_userData.hasOwnProperty(key)) {
        rwl_userData[key] = settingData[key];
      }
    }
    GM_setValue("rwl_userData", rwl_userData);
  }

  // 检查当前域名是否在黑名单中
  function isInBlacklist() {
    if (!rwl_userData || !rwl_userData.data) return false;
    return rwl_userData.data.some(domain => {
      // 支持通配符匹配，如 *.example.com
      if (domain.startsWith('*.')) {
        const baseDomain = domain.substring(2);
        return hostname === baseDomain || hostname.endsWith('.' + baseDomain);
      }
      return hostname === domain;
    });
  }

  // 检查当前域名是否在已启用列表中
  function isSiteEnabled() {
    if (!rwl_userData || !rwl_userData.enabledSites) return false;
    return rwl_userData.enabledSites.some(domain => {
      // 支持通配符匹配，如 *.example.com
      if (domain.startsWith('*.')) {
        const baseDomain = domain.substring(2);
        return hostname === baseDomain || hostname.endsWith('.' + baseDomain);
      }
      return hostname === domain;
    });
  }

  // 添加悬浮框
  addBtn();
  btn_node = document.getElementById("black_node");

  var timer = setInterval(function() {
    if (document.getElementById("black_node")) {
      clearInterval(timer);
      rwlStart();
    } else {
      addBtn();
    }
  }, 500);

  // 注册菜单命令
  GM_registerMenuCommand("复制限制解除 设置", setMenu);

  function rwlStart() {
    console.log("脚本: 复制限制解除 --- 开始执行");
    
    // 初始化时根据当前网站状态设置复选框
    if (btn_node) {
      btn_node.checked = isSiteEnabled();
    }
    
    // 检查黑名单 - 不再阻止设置功能
    if (isInBlacklist()) {
      console.log("当前域名在黑名单中，脚本不生效");
      if (btn_node) btn_node.checked = false;
    } else if (isSiteEnabled()) {
      // 如果在已启用列表中，自动勾选并初始化
      init();
    }
    
    addDragEven();
    setBtnClick();
  }

  function addBtn() {
    var node = document.createElement("remove-web-limits");
    node.id = "rwl-float";
    node.className = "rwl-exempt";

    var screenClientHeight = document.documentElement.clientHeight;
    var tempHeight;
    if (rwl_userData.positionTop > screenClientHeight) {
      tempHeight = screenClientHeight - 40;
    } else {
      tempHeight = rwl_userData.positionTop;
    }
    window.onresize = function() {
      var screenClientHeight = document.documentElement.clientHeight;
      var tempHeight;

      if (rwl_userData.positionTop > screenClientHeight) {
        tempHeight = screenClientHeight - 40;
      } else {
        tempHeight = rwl_userData.positionTop;
      }

      node.style.top = tempHeight + "px";
    };

    tempHeight = tempHeight < 0 ? 0 : tempHeight;
    node.style.cssText = "position:fixed;top:" + tempHeight + "px;left:" + rwl_userData.positionLeft + "px;right:" + rwl_userData.positionRight + "px;";
    node.innerHTML = '<button type="button" id="rwl-setbtn">⚙️</button> <span style="cursor:move; font-size:12px;">限制解除</span> <input type="checkbox" name="" id="black_node" >';
    if (window.self === window.top) {
      if (document.querySelector("body")) {
        document.body.appendChild(node);
      } else {
        document.documentElement.appendChild(node);
      }
    }
    
    node.addEventListener("mouseover", function() {
      node.classList.add("rwl-active");
    });
    node.addEventListener("mouseleave", function() {
      node.classList.remove("rwl-active");
    });

    var checkbox = node.querySelector("#black_node");
    checkbox.checked = isSiteEnabled();
    checkbox.addEventListener("change", function() {
      toggleScript(this.checked);
    });

    var style = document.createElement("style");
    style.type = "text/css";

    var styleInner = `
      #rwl-float {
        position: fixed;
        transform: translate(-90%, 0);
        width: none;
        height: 36px;
        font-size: 14px;
        font-weight: 500;
        font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        color: #333;
        background: rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(12px) saturate(180%);
        -webkit-backdrop-filter: blur(12px) saturate(180%);
        z-index: 2147483647;
        margin: 0;
        opacity: 0.9;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        overflow: hidden;
        user-select: none;
        text-align: center;
        white-space: nowrap;
        line-height: 36px;
        padding: 0 16px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 0 18px 18px 0;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      #rwl-float input[type='checkbox'] {
        margin: 0;
        padding: 0;
        width: 16px;
        height: 16px;
        vertical-align: middle;
        position: relative;
        cursor: pointer;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: #fff;
        transition: all 0.2s ease;
      }

      #rwl-float input[type='checkbox']:checked {
        background: #4285f4;
        border-color: #4285f4;
      }

      #rwl-float input[type='checkbox']:checked::after {
        content: '';
        position: absolute;
        top: 2px;
        left: 5px;
        width: 4px;
        height: 8px;
        border: solid #fff;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }

      #rwl-float.rwl-active {
        transform: translate(0, 0);
        opacity: 1;
        background: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(16px) saturate(200%);
        -webkit-backdrop-filter: blur(16px) saturate(200%);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      }

      #rwl-float label {
        margin: 0;
        padding: 0;
        font-weight: 500;
      }

      #rwl-float #rwl-setbtn {
        margin: 0;
        padding: 0;
        width: 20px;
        height: 20px;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        background: transparent;
        color: #5f6368;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
      }

      #rwl-float #rwl-setbtn:hover {
        background: rgba(66, 133, 244, 0.1);
        color: #4285f4;
      }

      #rwl-float span {
        cursor: move;
        font-weight: 500;
        color: #5f6368;
      }

      #rwl-float:hover span {
        color: #202124;
      }
    `;

    if (!rwl_userData.addBtn) {
      var styleTemp = "#rwl-float{display:none}";
      style.innerHTML = styleInner + styleTemp;
    } else {
      style.innerHTML = styleInner;
    }
    if (document.querySelector("#rwl-float")) {
      document.querySelector("#rwl-float").appendChild(style);
    } else {
      GM_addStyle(styleInner);
    }
  }

  function setBtnClick() {
    document.querySelector("#rwl-setbtn").addEventListener("click", setMenu);
  }

  function setMenu() {
    var oldEditBox = document.querySelector("#rwl-setMenu");
    if (oldEditBox) {
      oldEditBox.parentNode.removeChild(oldEditBox);
      return;
    }
    var userSetting = GM_getValue("rwl_userData");
    var btnchecked = userSetting.addBtn ? 'checked' : '';

    var odom = document.createElement("div");
    odom.id = "rwl-setMenu";
    odom.style.cssText = "position: fixed;" +
      "top: 10px;" +
      "left: 10px;" +
      "padding: 20px;" +
      "background: rgba(255,255,255,0.8);" +
      "backdrop-filter: blur(10px);" +
      "border-radius: 8px;" +
      "box-shadow: 0 4px 12px rgba(0,0,0,0.15);" +
      "z-index: 999999;" +
      "border: 1px solid rgba(0,0,0,0.1);";

    GM_addStyle(`
      #rwl-setMenuSave,
      #rwl-reset,
      #rwl-setMenuClose {
        margin: 0 5px;
        padding: 5px 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background: rgba(255,255,255,0.8);
        color: #000;
        transition:0.2s;
      }
      #rwl-reset {
        border: 1px solid #666;
      }
      #rwl-reset:hover {
        background: rgba(0,0,0,0.2);
      }
      #rwl-setMenuSave {
        border: 1px solid green;
        background: rgba(76,175,80,0.8);
        color: white;
      }
      #rwl-setMenuSave:hover {
        background: rgba(76,175,80,1);
      }
      #rwl-setMenuClose {
        border: 1px solid red;
        background: rgba(244,67,54,0.8);
        color: white;
      }
      #rwl-setMenuClose:hover {
        background: rgba(244,67,54,1);
      }
      #rwl-setMenu {
        text-align:left;
        font-size:14px;
        z-index:999999;
        top: 10px !important;
        left: 10px !important;
        margin: 10px;
      }
      #rwl-setMenu p {
        margin:10px auto;
      }
      #rwl-setMenu input[type=text],
      #rwl-setMenu textarea,
      #rwl-setMenu select {
        padding:5px;
        border-radius:4px;
        border:1px solid #ccc;
        background:rgba(255,255,255,0.8);
      }
      #rwl-setMenu textarea {
        width:100%;
        min-height:200px;
        margin-top:10px;
      }
      .rwl-switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 24px;
        vertical-align: middle;
        margin-left: 10px;
      }
      .rwl-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      .rwl-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 24px;
      }
      .rwl-slider:before {
        position: absolute;
        content: '';
        height: 16px;
        width: 16px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
      }
      input:checked + .rwl-slider {
        background-color: #4285f4;
      }
      input:checked + .rwl-slider:before {
        transform: translateX(26px);
      }
    `);

    var innerH = "" +
      "<p>悬浮框垂直位置 <input id='positiontop' type='text' value=" + userSetting.positionTop + " style='width: 25px;'> 像素" +
      "<label style='display:inline-flex;align-items:center;justify-content:flex-end;width:180px;'>悬浮框开关" +
      "<label class='rwl-switch'>" +
      "<input id='btnchecked' type='checkbox' " + btnchecked + ">" +
      "<span class='rwl-slider'></span>" +
      "</label>" +
      "</label></p>" +
      "<p>黑名单列表(每行一个域名，支持通配符如 *.example.com)</p>" +
      "<textarea wrap='off' cols='45' rows='10' style='overflow:auto;border-radius:4px;'>" + userSetting.data.join('\n') + "</textarea>" +
      "<p>已启用网站列表(自动记录)</p>" +
      "<textarea wrap='off' cols='45' rows='5' style='overflow:auto;border-radius:4px;' readonly>" + userSetting.enabledSites.join('\n') + "</textarea>" +
      "<br>" +
      "<div style='text-align: right; margin-top: 10px;'>" +
      "<button id='rwl-reset'>清空设置</button>" +
      "<button id='rwl-setMenuSave'>保存</button>" +
      "<button id='rwl-setMenuClose' title='若无法关闭 请刷新界面' >关闭</button>" +
      "</div>" +
      "";
    odom.innerHTML = innerH;
    document.body.appendChild(odom);

    document.querySelector("#rwl-setMenuSave").addEventListener("click", saveSetting);
    document.querySelector("#rwl-setMenuClose").addEventListener("click", closeMenu);
    document.querySelector("#rwl-reset").addEventListener("click", rwlReset);
  }

  function saveSetting() {
    var positionTop = document.querySelector("#rwl-setMenu #positiontop").value;
    var addBtnChecked = document.querySelector("#rwl-setMenu #btnchecked").checked;
    var codevalue = document.querySelector("#rwl-setMenu textarea").value;
    if (codevalue) {
      var userSetting = GM_getValue("rwl_userData");

      userSetting.addBtn = addBtnChecked;
      userSetting.data = codevalue.split('\n').filter(item => item.trim() !== '');
      userSetting.positionTop = parseInt(positionTop);

      GM_setValue("rwl_userData", userSetting);
      
      setTimeout(function() {
        window.location.reload();
      }, 300);
    } else {
      alert("输入为空");
    }
    closeMenu();
  }

  function rwlReset() {
    GM_deleteValue("rwl_userData");
    window.location.reload();
  }

  function closeMenu() {
    var oldEditBox = document.querySelector("#rwl-setMenu");
    if (oldEditBox) {
      oldEditBox.parentNode.removeChild(oldEditBox);
      return;
    }
  }

  function addDragEven() {
    setTimeout(function() {
      try {
        dragBtn();
      } catch (e) {
        console.error("dragBtn函数 报错");
      }
    }, 1000);
  }

  function dragBtn() {
    var rwl_node = document.querySelector("#rwl-float");
    rwl_node.addEventListener("mousedown", function(event) {
      rwl_node.style.transition = "null";
      var disX = event.clientX - rwl_node.offsetLeft;
      var disY = event.clientY - rwl_node.offsetTop;

      var move = function(event) {
        rwl_node.style.left = event.clientX - disX + "px";
        rwl_node.style.top = event.clientY - disY + "px";
      };

      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", function() {
        rwl_node.style.transition = "0.3s";
        document.removeEventListener("mousemove", move);
        rwl_node.style.right = rwl_userData.positionRight = "auto";
        rwl_node.style.left = rwl_userData.positionLeft = 0;
        rwl_userData.positionTop = rwl_node.offsetTop;
        GM_setValue("rwl_userData", rwl_userData);
      });
    });
  }

  function toggleScript(bool) {
    var userData = GM_getValue("rwl_userData");
    if (!userData) {
      userData = JSON.parse(JSON.stringify(settingData));
      GM_setValue("rwl_userData", userData);
    }

    // 添加或移除当前网站到启用列表
    var currentSite = window.location.hostname;
    if (bool) {
      if (!userData.enabledSites.includes(currentSite)) {
        userData.enabledSites.push(currentSite);
        // 确保没有重复
        userData.enabledSites = [...new Set(userData.enabledSites)];
      }
    } else {
      userData.enabledSites = userData.enabledSites.filter(site => site !== currentSite);
    }
    
    GM_setValue("rwl_userData", userData);
    
    if (bool) {
      init();
    } else {
      setTimeout(() => location.reload(), 350);
    }
  }

  function init() {
    // 获取最新设置
    rwl_userData = GM_getValue("rwl_userData");
    
    // 检查是否应该启用
    var shouldEnable = isSiteEnabled();
    
    if (btn_node) {
        btn_node.checked = shouldEnable;
    }
    
    // 如果不在黑名单且应该启用，则执行解除限制的逻辑
    if (!isInBlacklist() && shouldEnable) {
        rule = rules.default_rule;
        hook_eventNames = rule.hook_eventNames.split("|");
        unhook_eventNames = rule.unhook_eventNames.split("|");
        eventNames = hook_eventNames.concat(unhook_eventNames);

        if (rule.dom0) {
            setInterval(clearLoop, 10 * 1000);
            setTimeout(clearLoop, 1500);
            window.addEventListener('load', clearLoop, true);
            clearLoop();
        }

        if (rule.hook_addEventListener) {
            EventTarget.prototype.addEventListener = addEventListener;
            document.addEventListener = addEventListener;

            if (hasFrame) {
                for (let i = 0; i < hasFrame.length; i++) {
                    hasFrame[i].contentWindow.document.addEventListener = addEventListener;
                }
            }
        }

        if (rule.hook_preventDefault) {
            Event.prototype.preventDefault = function() {
                if (hook_eventNames.indexOf(this.type) < 0) {
                    Event_preventDefault.apply(this, arguments);
                }
            };

            if (hasFrame) {
                for (let i = 0; i < hasFrame.length; i++) {
                    hasFrame[i].contentWindow.Event.prototype.preventDefault = function() {
                        if (hook_eventNames.indexOf(this.type) < 0) {
                            Event_preventDefault.apply(this, arguments);
                        }
                    };
                }
            }
        }

        if (rule.hook_set_returnValue) {
            Event.prototype.__defineSetter__('returnValue', function() {
                if (this.returnValue !== true && hook_eventNames.indexOf(this.type) >= 0) {
                    this.returnValue = true;
                }
            });
        }

        if (rule.add_css) {
            GM_addStyle('html, :not([class*="rwl-exempt"]) {-webkit-user-select:text!important; -moz-user-select:text!important;} :not([class*="rwl-exempt"]) ::selection {color:#fff; background:#3390FF!important;}');
        }
    }
  }

  // Hook addEventListener proc
  function addEventListener(type, func, useCapture) {
    var _addEventListener = this === document ? document_addEventListener : EventTarget_addEventListener;
    if(hook_eventNames.indexOf(type) >= 0) {
      _addEventListener.apply(this, [type, returnTrue, useCapture]);
    } else if(this && unhook_eventNames.indexOf(type) >= 0) {
      var funcsName = storageName + type + (useCapture ? 't' : 'f');

      if(this[funcsName] === undefined) {
        this[funcsName] = [];
        _addEventListener.apply(this, [type, useCapture ? unhook_t : unhook_f, useCapture]);
      }

      this[funcsName].push(func);
    } else {
      _addEventListener.apply(this, arguments);
    }
  }

  // 清理循环
  function clearLoop() {
    var elements = getElements();

    for(var i in elements) {
      for(var j in eventNames) {
        var name = 'on' + eventNames[j];
        if(elements[i][name] !== null && elements[i][name] !== onxxx) {
          if(unhook_eventNames.indexOf(eventNames[j]) >= 0) {
            elements[i][storageName + name] = elements[i][name];
            elements[i][name] = onxxx;
          } else {
            elements[i][name] = null;
          }
        }
      }
    }
  }

  // 返回true的函数
  function returnTrue(e) {
    return true;
  }
  function unhook_t(e) {
    return unhook(e, this, storageName + e.type + 't');
  }
  function unhook_f(e) {
    return unhook(e, this, storageName + e.type + 'f');
  }
  function unhook(e, self, funcsName) {
    var list = self[funcsName];
    for(var i in list) {
      list[i](e);
    }

    e.returnValue = true;
    return true;
  }
  function onxxx(e) {
    var name = storageName + 'on' + e.type;
    this[name](e);

    e.returnValue = true;
    return true;
  }

  // 获取随机字符串
  function getRandStr(chs, len) {
    var str = '';

    while(len--) {
      str += chs[parseInt(Math.random() * chs.length)];
    }

    return str;
  }

  // 获取所有元素 包括document
  function getElements() {
    var elements = Array.prototype.slice.call(document.getElementsByTagName('*'));
    elements.push(document);

    var frames = document.querySelectorAll("frame");
    if (frames) {
      hasFrame = frames;
      var frames_element;
      for (let i = 0; i < frames.length; i++) {
        frames_element = Array.prototype.slice.call(frames[i].contentWindow.document.querySelectorAll("*"));
        elements.push(frames[i].contentWindow.document);
        elements = elements.concat(frames_element);
      }
    }
    return elements;
  }
})();
