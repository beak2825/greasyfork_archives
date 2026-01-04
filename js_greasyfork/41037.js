// ==UserScript==
// @name         再见了百家号搜索结果
// @namespace    http://tampermonkey.net/
// @home-url     https://greasyfork.org/zh-CN/scripts/41037
// @description  删除百度搜索结果的百家号的结果
// @version      1.2.3
// @include      http://www.baidu.com/*
// @include      https://www.baidu.com/*
// @author       依然菜刀
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/41037/%E5%86%8D%E8%A7%81%E4%BA%86%E7%99%BE%E5%AE%B6%E5%8F%B7%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/41037/%E5%86%8D%E8%A7%81%E4%BA%86%E7%99%BE%E5%AE%B6%E5%8F%B7%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==
(function () {
  String.prototype.endWith = function (s) {
    if (s == null || s === "" || this.length === 0 || s.length > this.length)
      return false;
    return this.substring(this.length - s.length) === s;
  };

  String.prototype.startWith = function (s) {
    if (s == null || s === "" || this.length === 0 || s.length > this.length)
      return false;
    return this.substr(0, s.length) === s;
  };

  var INS = ' -baijiahao';

  function addINS() {
    var kw = $("#kw").val();
    if (kw.trim().length > 0 && !kw.endWith(INS)) {
      $("#kw").val(kw + INS);
    }
  }

  function removeINS() {
    var kw = $("#kw").val();
    if (kw.endWith(INS)) {
      $("#kw").val(kw.substr(0, kw.length - INS.length));
    }
  }

  var sUrl = '/s?';

  function encode(param, url) {
    return encodeURIComponent(param);
  }

  function decode(param, url) {
    if (param.indexOf('+')) {
      param = param.replace('+', '%20');
    }
    return decodeURIComponent(param);
  }

  /**
   * 处理url，增加或者删除INS
   * @param url 原始url
   * @param toRemove 是否是移除，undefined表示添加
   * @returns {*}
   */
  function processUrlINS(url, toRemove) {
    var originUrl = url;
    var toAdd = !toRemove;
    var index = url.indexOf(sUrl);
    if (index === -1) {
      return url;
    }
    var prefix = url.substr(0, index + sUrl.length);
    url = url.substr(index + sUrl.length);
    var params = url.split('&');
    var newUrlArr = [];

    $.each(params, function (i, item) {
      var kv = item.split('=');
      if (kv[0] === 'wd' || kv[0] === 'word') {
        try {
          var v = decode(kv[1], originUrl);
          if (toAdd) {
            // 增加INS
            if (!v.endWith(INS)) {
              v = v + INS;
              kv[1] = encode(v, originUrl);
            }
          } else {
            // 移除INS，用于获取相关搜索
            if (v.endWith(INS)) {
              v = v.substr(0, v.length - INS.length);
              kv[1] = encode(v, originUrl);
            }
          }
        } catch (e) {
          console.error(e, item);
        }
      }
      newUrlArr.push(kv[0] + '=' + kv[1]);
    });
    return prefix + newUrlArr.join('&');
  }

  function delegateAjax() {
    var ajax = $.ajax;
    $.ajax = function (settings) {
      if (settings && settings.url && settings.url.startWith('/s?')) {
        settings.url = processUrlINS(settings.url);
      }
      return ajax.apply(this, arguments);
    };
  }

  delegateAjax();
  var hostname = window.location.hostname;
  // 移除百家号的搜索结果
  if (hostname === 'www.baidu.com') {
    process();
    tabsUrlProcess();
    // 相关搜索替换
    rsProcess();
    //document.addEventListener("DOMSubtreeModified", process);
    //document.addEventListener("DOMSubtreeModified", tabsUrlprocess);
    document.addEventListener("DOMSubtreeModified", rsProcess);
  }

  function tabsUrlProcess() {
    $(document).off('click').on('click', 'a', function () {
      this.href = processUrlINS(this.href);
    });
  }

  var rsHandler;
  function rsProcess(event) {
    if (rsHandler) {
      clearTimeout(rsHandler);
    }
    // 避免递归
    if (event && event.target === $("#rs")[0]) {
      return;
    }

    if (window.location.href.indexOf('/s?') === -1) {
      return;
    }

    rsHandler = setTimeout(function () {
      if ($.trim($("#kw").val()).length > 0 && $("#rs").length > 0) {
        var originUrl = processUrlINS(window.location.href, true);
        $.get(originUrl, function (html) {
          var $rs = $(html).find('#rs');
          if ($rs.length > 0) {
            $rs.find('a').each(function (i, item) {
              var href = $(this).attr('href');
              $(this).attr('href', processUrlINS(href));
            });
            $("#rs").html($rs.html());
          }
        });
      }
      rsHandler = undefined;
    }, 500);
  }

  function process() {
    $("#form").on('submit', function () {
      addINS();
    });
    $("#su").on('click', function () {
      addINS();
    });

    $("#kw").on('focus', function () {
      removeINS();
    }).on('blur', function () {
      addINS();
    });
  }
})();