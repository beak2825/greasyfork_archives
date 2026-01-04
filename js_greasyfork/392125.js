// ==UserScript==
// @name         一键上传
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  批发网一键上传
// @author       Wang Hai Xu
// @match        http*://gz.17zwd.com/item.htm?GID=*
// @match        http*://router.publish.taobao.com/router/publish.htm*
// @match        http*://item.publish.taobao.com/sell/publish.htm*
// @match        http*://login.taobao.com/member/login*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       doc-start
// @downloadURL https://update.greasyfork.org/scripts/392125/%E4%B8%80%E9%94%AE%E4%B8%8A%E4%BC%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/392125/%E4%B8%80%E9%94%AE%E4%B8%8A%E4%BC%A0.meta.js
// ==/UserScript==

(function () {
  'use strict';
  var win = unsafeWindow;
  var doc = unsafeWindow.document;
  var getCatIdEventName = 'pushlish_helper_event_getCatId';

  // 链接参数转json
  var getQuery = function (href) {
    if (!href) href = location.href;
    var search = href.split('?')[1];
    var argArr = search.split('&');
    var len = argArr.length;
    var args = {};
    for (var i = 0; i < len; i++) {
      var item = argArr[i];
      if (item.indexOf('=')) {
        var keyValueArr = item.split('=');
        args[keyValueArr[0]] = keyValueArr[1];
      }
    }
    return args;
  }
  var arg = getQuery();

  var isVVIC = location.href.indexOf('www.vvic.com/item/') === -1 ? false : true;
  var isTaobaoSelectCategory = location.href.indexOf('router.publish.taobao.com') === -1 ? false : true;
  var is17zwd = location.href.indexOf('gz.17zwd.com/item') === -1 ? false : true;
  var isTaobaoPublish = location.href.indexOf('item.publish.taobao.com/sell/publish') === -1 ? false : true;
  var isTaobaoLogin = location.href.indexOf('login.taobao.com/member/login') === -1 ? false : true;

  var event = {
    selectCategory: {
      key: 'pushlish_helper_event_select_cat_',
      fn: null,
      iframeDomId: 'taobao_select_category_iframe_',
    }
  };

  // 弹窗 - 选择商品类目
  (function taobaoSelectCategoryFn() {
    if (isTaobaoSelectCategory) {
      // 作为弹窗嵌入批发网
      if (arg.mode === 'iframe') {
        // 隐藏垃圾元素
        var style = document.createElement('style');
        style.innerText = "#header{display: none !important}";
        style.innerText += "#seller-nav{display: none !important}";
        style.innerText += "#struct-notice{display: none !important}";
        style.innerText += "#footer{display: none !important}";
        style.innerText += "#body{width: 1190px !important; height: 600px !important; overflow: hidden !important;}";

        document.querySelector('head').appendChild(style);
      }
    }
  })();

  // 弹窗 - 选择类目结果
  (function taobaoPublishFn() {
    if (isTaobaoPublish) {
      if (arg.mode == 'iframe') {
        GM_setValue((event.selectCategory.key + arg.iframeId), arg.catId);
      }
    }
  })();

  // 弹窗 - 淘宝登录
  (function isTaobaoLoginFn() {
    if (isTaobaoLogin) {
      var args = getQuery(decodeURIComponent(arg.redirectURL));
      if (args.mode === 'iframe') {
        GM_setValue((event.selectCategory.key + arg.iframeId), 'needLogin');
      }
    }
  })();

  function load(urls, cb) {
    var r = [].concat(urls);
    var url = r.shift();
    if (!url) {
      if (cb) cb();
      return true;
    }

    var ss = url.split('?');
    var ss1 = ss[0];
    var t = ss1.split('.');
    var type = t[t.length - 1];

    var dom;
    if (type === 'css') {
      dom = doc.createElement('link');
      dom.rel = 'stylesheet';
      dom.href = url;
    } else if (type === 'js') {
      dom = doc.createElement('script');
      dom.src = url;
    }
    dom.onload = function () {
      load(r, cb);
    }
    doc.querySelector('head').appendChild(dom);
  }

  load([
    'https://cdn.bootcss.com/jquery-toast-plugin/1.3.2/jquery.toast.min.css',
    'https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js',
    'https://unpkg.com/axios/dist/axios.min.js',
    'https://cdn.bootcss.com/lodash.js/4.17.15/lodash.min.js',
    'https://cdn.bootcss.com/jquery-toast-plugin/1.3.2/jquery.toast.min.js',
  ], function () {
    $(function () {
      var $ = win.$;

      (function is17zwdFn() {
        if (is17zwd) {
          var gid = String(arg.GID).replace('#', '');
          // 选择商品类目弹窗
          function iframe() {
            var pid = +new Date();
            event.selectCategory.key = 'pushlish_helper_event_select_cat_' + pid;

            var iframeWrap = doc.createElement('div');
            iframeWrap.style.position = 'fixed';
            iframeWrap.style.top = 0;
            iframeWrap.style.left = 0;
            iframeWrap.style.zIndex = 999999999;
            iframeWrap.style.width = '100%';
            iframeWrap.style.height = '100%';
            iframeWrap.style.minHeight = '600px';
            iframeWrap.style.minWidth = '1230px';
            iframeWrap.style.overflow = 'hidden';
            iframeWrap.style.display = 'block';
            iframeWrap.id = event.selectCategory.iframeDomId + pid;

            function hide() {
              doc.querySelector('body').removeChild(iframeWrap);
              // 关闭弹窗
              clearInterval(event.selectCategory.fn);
              GM_setValue(event.selectCategory.key, '');
            }

            var mark = doc.createElement('div');
            mark.style.position = 'absolute';
            mark.style.top = 0;
            mark.style.left = 0;
            mark.style.zIndex = 10;
            mark.style.width = '100%';
            mark.style.height = '100%';
            mark.style.backgroundColor = 'rgba(0,0,0,0.6)';
            mark.addEventListener('click', function () {
              hide();
            });

            iframeWrap.appendChild(mark);

            var main = doc.createElement('div');
            main.style.position = 'absolute';
            main.style.top = '50%';
            main.style.left = '50%';
            main.style.zIndex = 101;
            main.style.width = '1230px';
            main.style.height = '600px';
            main.style.marginTop = '-300px';
            main.style.marginLeft = '-595px';
            main.style.backgroundColor = '#fff';
            main.style.padding = '20px';
            main.style.overflow = 'hidden';

            var iframe = doc.createElement('iframe');
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.src = '//router.publish.taobao.com/router/publish.htm?mode=iframe&iframeId=' + pid;

            main.appendChild(iframe);

            iframeWrap.appendChild(main);

            doc.querySelector('body').appendChild(iframeWrap);

            event.selectCategory.fn = setInterval(function () {
              var eventSelectedVal = GM_getValue(event.selectCategory.key);
              if (eventSelectedVal) {
                hide();
                if (eventSelectedVal === 'needLogin') {
                  if (win.confirm('请先登录淘宝后再重试')) {
                    // win.open('//login.taobao.com/member/login.jhtml', '_blank');
                  }
                  return false;
                }

                win.successCallback = function (data) {
                  console.log('successCallback: ', data);
                }

                // 已选择
                $.ajax({
                  type: "get",
                  url: 'http://127.0.0.1:9420/pulish.gif?s=17zwd&catId=' + eventSelectedVal + '&gid=' + gid,
                  dataType: "jsonp",
                  jsonp: "callback",
                  jsonpCallback: 'successCallback',
                  success: function (data) {
                    console.log('成功~~~')
                    $.toast({
                      heading: '一键上传',
                      text: '操作成功：已上传到仓库',
                      icon: 'success',
                      position: 'bottom-right',
                      loader: true,        // Change it to false to disable loader
                      loaderBg: '#9EC600'  // To change the background
                    });
                  },
                  error: function (err) {
                    $.toast({
                      heading: '一键上传',
                      text: '操作失败：请联系管理员',
                      icon: 'error',
                      position: 'bottom-right',
                      loader: true,        // Change it to false to disable loader
                      loaderBg: '#9EC600'  // To change the background
                    });
                    console.log('失败~~', err);
                  }
                });
              }
            }, 300);

            return {
              hide: hide,
            }
          }

          // 添加按钮
          var btn = $('<div id="mp-btn-upload">上传到仓库</div>');
          btn.css({
            "display": "block",
            "margin": "0",
            "height": "38px",
            "line-height": "38px",
            "font-size": "14px",
            "cursor": "pointer",
            "text-align": "center",
            "border": "1px solid #F56C6C",
            "background-color": "#f56c6c",
            "color": "#ffffff",
            "float": "left",
            "margin-right": "10px",
            "width": "120px",
            "margin-top": "20px",
            "user-select": "none",
          });

          btn.hover(function () {
            btn.css("background-color", "#ffffff").css("color", "#f56c6c");
          }, function () {
            btn.css("background-color", "#f56c6c").css("color", "#ffffff");
          });

          btn.click(function () {
            iframe();
          });

          $('div.goods-page-image-container').append(btn);
        }
      })();

    });
  });
})();