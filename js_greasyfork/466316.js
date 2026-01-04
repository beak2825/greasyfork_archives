// ==UserScript==
// @name         Easy Cookie
// @namespace    https://gitee.com/dybeq/easy-cookie
// @version      1.2
// @description  shut up and take the cookie!!
// @author       QiuQiu
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=100.75
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.js
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/466316/Easy%20Cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/466316/Easy%20Cookie.meta.js
// ==/UserScript==

(function () {
    "use strict";

    /**
     * 生成按钮
     *
     * @param method
     * @returns
     */
    function generateButton(method){
      // 按钮
      let _button_copy = document.createElement("div");
      _button_copy.innerHTML = "copy cookie";
      _button_copy.style =
        "position:fixed;z-index:1000000000000;top:10px;left:600px;width:90px;height:36px;background:green;opacity:0.75;color:white;text-align:center;line-height:36px;cursor:pointer;";
      _button_copy.onclick = function() {
          method()
      }

      return _button_copy;
    }

    function generateInput(content){
      // 输入框
      let _input = document.createElement("input");
      _input.style =
        "position:fixed;z-index:1000000000000;top:10px;left:690px;width:200px;opacity:0.75;text-align:center;line-height:30px;";
      _input.setAttribute("id", "_plugin_input_niubi0660");
      _input.setAttribute("name", "cookie_name");
      _input.setAttribute("type", "text");
      _input.setAttribute("placeholder", "enter cookie name here...");
      _input.value = content;
      return _input;
    }

    /**
     * 初始化程序
     */
    function init() {
      // 获取缓存中的cookie
      let cookie_name = $.cookie('_plugin_cookie_name_cache')
      if (cookie_name == undefined) cookie_name = ''

      let _body = document.querySelector("body");
      let _button = generateButton(click)

      _body.appendChild(_button);
      _body.appendChild(generateInput(cookie_name));
    }

    /**
     * 复制到剪辑板
     *
     * @param cookie_name
     */
    function copyToClipboard(cookie_name) {
      let _cookie_content = $.cookie(cookie_name)
      if (_cookie_content == undefined) {
          alert('copy failed!');
          return
      }
      
      console.log(_cookie_content)

      const el = document.createElement('input');
      el.setAttribute('value', _cookie_content);
      document.body.appendChild(el);
      el.select();
      const flag = document.execCommand('copy');
      document.body.removeChild(el);

      flag && alert('copy done!');
    }

    /**
     * 缓存cookie_name
     */
    function toCache(content) {
      $.cookie('_plugin_cookie_name_cache', content)
    }

    /**
     * 点击事件
     */
    function click() {
      let cookie_name = $('#_plugin_input_niubi0660').val()

      copyToClipboard(cookie_name)
      toCache(cookie_name)
    }

    init();
  })();