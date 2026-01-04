// ==UserScript==
// @name         中国电信网上大学知识中心考试工具（切屏 和 复制）
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowNEFBOTAwQTE5NkFFNDExODk0QkRFMzgwMkFFMjQ5OSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyMTQ0QzZENEI0RkYxMUVBQUVGQUE5RkZCRTgwNUYxOCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyMTQ0QzZEM0I0RkYxMUVBQUVGQUE5RkZCRTgwNUYxOCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ1NDdCQURBNkIwMDExRTRBQUJEQUJGQUZFQUI3QzRFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQ1NDdCQURCNkIwMDExRTRBQUJEQUJGQUZFQUI3QzRFIi8+IDwvcmRmOkRlc2NyaXB0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
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  简单破解切屏监控 和 增加复制插件；当考试页面 "我要交卷" 变成 “（已破解）我要交卷” 时表示脚本已启用；复制：选择文字后会出现 “复制” 按钮， 点击 ‘复制’既复制选中的文本到粘贴板
// @author       zsa
// @match        https://kc.zhixueyun.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhixueyun.com
// @license      MIT
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/clipboard.js/2.0.11/clipboard.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/450816/%E4%B8%AD%E5%9B%BD%E7%94%B5%E4%BF%A1%E7%BD%91%E4%B8%8A%E5%A4%A7%E5%AD%A6%E7%9F%A5%E8%AF%86%E4%B8%AD%E5%BF%83%E8%80%83%E8%AF%95%E5%B7%A5%E5%85%B7%EF%BC%88%E5%88%87%E5%B1%8F%20%E5%92%8C%20%E5%A4%8D%E5%88%B6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/450816/%E4%B8%AD%E5%9B%BD%E7%94%B5%E4%BF%A1%E7%BD%91%E4%B8%8A%E5%A4%A7%E5%AD%A6%E7%9F%A5%E8%AF%86%E4%B8%AD%E5%BF%83%E8%80%83%E8%AF%95%E5%B7%A5%E5%85%B7%EF%BC%88%E5%88%87%E5%B1%8F%20%E5%92%8C%20%E5%A4%8D%E5%88%B6%EF%BC%89.meta.js
// ==/UserScript==


var $ =  unsafeWindow.jQuery || window.jQuery;
var Clipboard = window.ClipboardJS;

var getSelectedText = function () {
      if (window.getSelection)
          return window.getSelection().toString();
      if (document.getSelection)
          return document.getSelection().toString();
      if (document.selection)
          return document.selection.createRange().text;
      return "";
  };

var bindClipboardEvent = function (clipboard) {
      clipboard.on("success", function (e) {
          $("#_copy").html("复制成功");
          setTimeout(function () { return $("#_copy").fadeOut(1000); }, 1000);
          e.clearSelection();
      });
      clipboard.on("error", function (e) {
          $("#_copy").html("复制失败");
          setTimeout(function () { return $("#_copy").fadeOut(1000); }, 1000);
          e.clearSelection();
      });
  };

function unfreeze(){
  var sti = setInterval(()=>{
    if(document.body){
      clearInterval(sti);
      
      document.addEventListener("mouseup", function (e) {
          if($(e) == $("#_copy")){
            return;
          }
          $("#_copy").remove();
          var copyText = getSelectedText();
          if (!copyText)
              return "";
          var template = "\n            <div id=\"_copy\"\n            style=\"cursor:pointer;border-radius:5px;padding: 5px 10px;color: #FFF;background: red;position: absolute; z-index:1000;left:".concat(e.pageX + 30, "px;top:").concat(e.pageY, "px;\"\n            data-clipboard-text=\"").concat(copyText.replace(/"/g, "&quot;"), "\">\u590D\u5236</div>\n        ");
          $("body").append(template);
          $("#_copy").on("mousedown", function (event) { return event.stopPropagation(); });
          $("#_copy").on("mouseup", function (event) { return event.stopPropagation(); });
          var clipboard = new Clipboard("#_copy");
          bindClipboardEvent(clipboard);
      });
      
      var sti1 = setInterval(()=>{
        if($('a.w-half').length > 0){
          clearInterval(sti1);
          $('a.w-half').css({'background':'green'});
          $('a.w-half').prepend('<span>（已破解）</span>')
        }
     },100)
    }
  }, 100);
}


(function () {
  var url = window.location.hash;
  var urlStr = url.toString();
  
  // 进行页面判断 判断是在外面页面还是考试页面
  if (urlStr.match("/exam/exam/answer-paper/")) {
    unsafeWindow.onblur = null;
    Object.defineProperty(unsafeWindow, 'onblur', {
      set: function(v) {
        console.log('onblur',v)
      }
    });
    
    unfreeze();
  }
  
})();

