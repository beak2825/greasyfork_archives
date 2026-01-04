// ==UserScript==
// @name         蓝奏云分享链接跳转
// @namespace    xiaolu
// @version      2025-02-28
// @description  本脚本可以自动解析文件(夹)的链接,功能：1.文件(夹)链接的跳转;2.文件(夹)链接的复制;3.对于含有密码的文件(夹)链接支持跳转后自动输入密码并打开
// @author       小陆
// @match        https://*.woozooo.com/*
// @match        https://*.lanzout.com/*password*
// @match        https://*.lanzouw.com/*password*
// @match        https://*.lanzoui.com/*password*
// @match        https://*.lanzoux.com/*password*
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528425/%E8%93%9D%E5%A5%8F%E4%BA%91%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/528425/%E8%93%9D%E5%A5%8F%E4%BA%91%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function () {
  let urlParams = new URLSearchParams(window.location.search);

  // 获取 password 参数
  let password_url = urlParams.get('password');

  // 判断参数是否存在
  if (password_url !== null) {
    function xiaozz() {
      console.log("密码参数存在:", password_url);
      $("#pwd").val(password_url);
      if ($('.passwddiv-center').length > 0) {down_p();}else{file();}
      return;
    };
    xiaozz();
  }

  var newurl = 0;
  var targetNode = $('#f_sha1')[0]; // jQuery对象转为DOM元素


  // 配置MutationObserver
  var config = { childList: true, subtree: true, characterData: true };

  // 创建MutationObserver实例
  var observer = new MutationObserver(function (mutationsList, observer) {
    mutationsList.forEach(function (mutation) {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        newurl++;
        $('#f_sha1 > div').remove();
        jiangcurl();
      }
    });
  });
  // 开始观察
  observer.observe(targetNode, config);

  function jiangcurl() {
    if (newurl == 1) {
      $('#Jump-link').remove(); $('#copyzt-link').remove();
      $("#f_sha1").after('<a href="#" id="Jump-link" target="_blank">跳转链接</a>');
      $("#f_sha1").after('<span id="copyzt-link" style="color: red;"></span>');
      //延迟执行
      setTimeout(function () {
        newurl = 0;
        var text = $("#f_sha1").html().replace(/<br\s*\/?>/gi, ' ').trim();
        var urlMatch = text.match(/https?:\/\/[^\s]+/);
        var passwordMatch = text.match(/密码:\s*(\S+)/);
        var url = urlMatch ? urlMatch[0] : "";
        var password = passwordMatch ? passwordMatch[1] : "";
        if (isPasswordEmpty(password)) {
          console.log("密码为空");
          url_password = url;
        } else {
          var url_password = url + '?password=' + password;
        }
        function isPasswordEmpty(password) {
          return !password || password.trim() === "";
        }
        if (url) {
          $('#Jump-link').attr('href', url_password);
          console.log(url_password);
        }
        $('#f_sha1').attr('title', '点击复制链接');
        $('#f_sha1').css('cursor', 'pointer');

      }, 500);
    }
  }
  $("#f_sha1").click(function () {
    // 处理点击事件
    var textToCopy = $("#f_sha1").text(); // 获取输入框的内容
    navigator.clipboard.writeText(textToCopy).then(function () {
      $("#copyzt-link").text("复制成功");
    }, function (err) {
      $("#copyzt-link").text("复制失败");
    })
  });



})();
