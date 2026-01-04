// ==UserScript==
// @name        base64 convert
// @namespace   http://tampermonkey.net/
// @version     1.1
// @description base64 convert, simple, easy.
// @license     https://opensource.org/license/mit/
// @author      zhenorzz
// @match       *://*/*
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/479431/base64%20convert.user.js
// @updateURL https://update.greasyfork.org/scripts/479431/base64%20convert.meta.js
// ==/UserScript==
(function() {
  'use strict';
  var icon = document.createElement('div');
  var word = '';
  icon.innerHTML = '<svg t="1699598999794" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="773" width="26" height="26"><path d="M904 1024H120c-66.168 0-120-53.832-120-120V120C0 53.832 53.832 0 120 0h784c66.168 0 120 53.832 120 120v784c0 66.168-53.832 120-120 120zM120 4C56.038 4 4 56.038 4 120v784c0 63.962 52.038 116 116 116h784c63.962 0 116-52.038 116-116V120c0-63.962-52.038-116-116-116H120z" fill="#D8DDE3" p-id="774"></path><path d="M299.998 732c-16.5 0-29.914-13.332-29.998-29.85l-1.184-236.814H192a30 30 0 0 1-21.212-51.214l213.334-213.336a30 30 0 0 1 42.424 0L639.88 414.124a30.004 30.004 0 0 1-21.212 51.214H542v5.446c0 16.568-13.432 30-30 30s-30-13.432-30-30v-35.446c0-16.568 13.432-30 30-30h34.242l-140.908-140.91-140.908 140.91h34.24c16.51 0 29.916 13.34 30 29.85L330 701.85c0.084 16.568-13.282 30.066-29.85 30.15h-0.152z" fill="#20263B" p-id="775"></path><path d="M618.668 834c-7.958 0-15.588-3.16-21.212-8.788L384.122 611.876a30.002 30.002 0 0 1 21.212-51.214H482v-4c0-16.568 13.432-30 30-30s30 13.432 30 30v34c0 16.568-13.432 30-30 30h-34.24l140.908 140.91 140.906-140.91h-34.24c-16.51 0-29.918-13.34-30-29.85L694 324.15c-0.082-16.568 13.282-30.068 29.85-30.15h0.154c16.498 0 29.914 13.332 29.996 29.85l1.184 236.814H832a30 30 0 0 1 21.212 51.214L639.88 825.212A29.984 29.984 0 0 1 618.668 834z" fill="#FF4B07" p-id="776"></path></svg>';
  icon.setAttribute('style', 'width:26px; height:26px; display:none; padding: 3px; background:#fff; border-radius:16px; box-shadow:4px 4px 8px #888; position:absolute; z-index:2147483647;');
  document.documentElement.appendChild(icon);
  document.addEventListener('mousedown', function(e) {
    if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon) || (e.target.parentNode.parentNode && e.target.parentNode
        .parentNode == icon)) { // 点击图标时阻止选中的文本消失
      e.preventDefault();
    }
  });
  // 选中变化事件
  document.addEventListener("selectionchange", function() {
    if (!window.getSelection().toString().trim()) {
      icon.style.display = 'none';
      // server.containerDestroy();
    }
  });
  // 显示、隐藏图标
  document.addEventListener('mouseup', function(e) {
    if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon) || (e.target.parentNode.parentNode && e.target.parentNode
        .parentNode == icon)) { // 点击了图标
      e.preventDefault();
      return;
    }
    var text = window.getSelection().toString().trim();
    var base64Rejex = /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i;
    var isBase64Valid = base64Rejex.test(text); // base64Data is the base64 string

    if (!isBase64Valid) {
        icon.style.display = 'none';
        for (let i = 0; i < server.rendered.length; i++) { // 点击了内容面板
          if (e.target == server.rendered[i]) return; // 不再创建图标
        }
      server.containerDestroy(); // 销毁内容面板
    } else if (text && icon.style.display == 'none') {
      icon.style.top = e.pageY + 12 + 'px';
      icon.style.left = e.pageX + 12 + 'px';
      icon.style.display = 'block';
    } else if (!text) {
      icon.style.display = 'none';
      for (let i = 0; i < server.rendered.length; i++) { // 点击了内容面板
        if (e.target == server.rendered[i]) return; // 不再创建图标
      }
      server.containerDestroy(); // 销毁内容面板
    }
  });
  // 图标点击事件
  icon.addEventListener('click', function(e) {
    var text = window.getSelection().toString().trim();
    if (text) {
      icon.style.display = 'none';
      server.containerDestroy(); // 销毁内容面板
      // 新建内容面板
      var container = server.container();
      container.style.top = e.pageY + 'px';
      if (e.pageX + 350 <= document.body.clientWidth) { // container 面板css最大宽度为250px
        container.style.left = e.pageX + 'px';
      }
      else container.style.left = document.body.clientWidth - 350 + 'px';
      document.body.appendChild(container);
      server.rendered.push(container);
      displaycontainer(decodeBase64(text), container);
    }
  });
   /**
   * Decode a string of base64 as text
   *
   * @param data The string of base64 encoded text
   * @returns The decoded text.
   */
  function decodeBase64(data) {
    if (typeof atob === "function") {
        return atob(data);
    } else if (typeof Buffer === "function") {
        return Buffer.from(data, "base64").toString("utf-8");
    } else {
        throw new Error("Failed to determine the platform specific decoder");
    }
  }
  function displaycontainer(text, element) {
    element.textContent = text;
    element.style.display = 'block'; // 显示结果
    var btn = document.createElement('button');
    btn.style.margin = '0 0 0 10px';
    btn.textContent = "copy";
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        // 创建一个文本域元素
        var textarea = document.createElement('textarea');
        // 设置文本域的内容为要复制的文本
        textarea.value = text;

        // 将文本域添加到文档中
        document.body.appendChild(textarea);

        // 选中文本域中的内容
        textarea.select();

        // 复制选中的内容
        document.execCommand('copy');

        // 从文档中移除文本域
        document.body.removeChild(textarea);
        icon.style.display = 'none';
        for (let i = 0; i < server.rendered.length; i++) { // 点击了内容面板
          if (e.target == server.rendered[i]) return; // 不再创建图标
        }
      server.containerDestroy(); // 销毁内容面板

      });
    element.appendChild(btn);
  }

  var server = {
    // 存放已经生成的内容面板（销毁的时候用）
    rendered: [],
    // 销毁已经生成的内容面板
    containerDestroy: function() {
      for (var i = this.rendered.length - 1; i >= 0; i--) {
        if (this.rendered[i] && this.rendered[i].parentNode) {
          this.rendered[i].parentNode.removeChild(this.rendered[i]);
        }
      }
    },
    // 生成结果面板 DOM （此时还未添加到页面）
    container: function() {
      var pre = document.createElement('pre');
      pre.setAttribute('style', 'display:none;' + 'position:absolute;' + 'font-size:13px;' + 'overflow:auto;' + 'background:#fff;' +
        'font-family:sans-serif,Arial;' + 'font-weight:normal;' + 'text-align:left;' + 'color:#000;' + 'padding:0.5em 1em;' +
        'line-height:1.5em;' + 'border-radius:5px;' + 'border:1px solid #ccc;' + 'box-shadow:4px 4px 8px #888;' + 'max-width:350px;' +
        'max-height:216px;' + 'z-index:2147483647;');
      return pre;
    }
  };
})();