"use strict";

// ==UserScript==
// @name         长毛象：显示被屏蔽的实例媒体文件
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  由于mastodon.social站长封禁了所有来自pawoo.net媒体文件，导致在mastodon.social看不到那边的媒体文件。这个脚本就是为了解决这个问题而生的。P.S. 头像问题无解，别想了。
// @author       https://mastodon.social/web/accounts/849118
// @include      https://mastodon.social*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400788/%E9%95%BF%E6%AF%9B%E8%B1%A1%EF%BC%9A%E6%98%BE%E7%A4%BA%E8%A2%AB%E5%B1%8F%E8%94%BD%E7%9A%84%E5%AE%9E%E4%BE%8B%E5%AA%92%E4%BD%93%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/400788/%E9%95%BF%E6%AF%9B%E8%B1%A1%EF%BC%9A%E6%98%BE%E7%A4%BA%E8%A2%AB%E5%B1%8F%E8%94%BD%E7%9A%84%E5%AE%9E%E4%BE%8B%E5%AA%92%E4%BD%93%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==

/**
 * 如果需要在mastodon.social之外的实例使用该脚本，请在// @include      https://mastodon.social* 下方再添加一个@include 网站名称请修改正你所在实例，别忘了最后有个星号。
 */
(function () {
  'use strict'; // 命名空间

  var ajax_interceptor_qoweifjqon = {
    settings: {
      ajaxInterceptor_switchOn: false,
      ajaxInterceptor_rules: []
    },
    originalXHR: window.XMLHttpRequest,
    myXHR: function myXHR() {
      var _this = this;

      var modifyResponse = function modifyResponse() {
        if (_this.responseText.trim()) {
          try {
            var parseObject = eval(_this.responseText); // 如果检测到当前请求是用户主页的「嘟文和回复」发出的，那么移除响应中的所有转嘟数据。
            // 比如：https://mastodon.social/api/v1/accounts/946408/statuses?exclude_replies=false&since_id=104012306590410838

            if (/api\/v1\/accounts\/\d*?\/statuses\?exclude_replies=false/.test(_this.responseURL)) {
              parseObject = parseObject.filter(function (item) {
                return !item.reblog;
              });
            }

            parseObject.forEach(function (toot) {
              if (toot.reblog) {
                // 先判断属性是否存在，因为有些接口不存在。
                if (toot.reblog.media_attachments && toot.reblog.media_attachments.length) {}

                toot.reblog.media_attachments.forEach(function (media) {
                  if (media.type === 'unknown') {
                    // mastodon会将封禁media的实例的type设置为unknown
                    // 手动修改
                    media.type = 'image';
                    media.preview_url = media.remote_url;
                    media.url = media.remote_url;
                  }
                });
              } else if (toot.media_attachments && toot.media_attachments.length) {
                toot.media_attachments.forEach(function (media) {
                  if (media.type === 'unknown') {
                    // mastodon会将封禁media的实例的type设置为unknown
                    // 手动修改
                    media.type = 'image';
                    media.preview_url = media.remote_url;
                    media.url = media.remote_url;
                  }
                });
              }
            });
            _this.responseText = JSON.stringify(parseObject);
          } catch (_) {
            console.log('error: parse filed: ', _); // 遇到解析不了的那也没办法。比如/context接口的参数无法解析，目测是里面包含html字符问题；
          }
        }
      };

      var xhr = new ajax_interceptor_qoweifjqon.originalXHR();

      var _loop = function _loop(attr) {
        if (attr === 'onreadystatechange') {
          xhr.onreadystatechange = function () {
            if (_this.readyState == 4) {
              modifyResponse();
            }

            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            _this.onreadystatechange && _this.onreadystatechange.apply(_this, args);
          };

          return 'continue';
        } else if (attr === 'onload') {
          xhr.onload = function () {
            modifyResponse();

            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }

            _this.onload && _this.onload.apply(_this, args);
          };

          return 'continue';
        } // 将函数原有内容全部拷贝到当前对象的属性上。


        if (typeof xhr[attr] === 'function') {
          _this[attr] = xhr[attr].bind(xhr);
        } else {
          // responseText和response不是writeable的，但拦截时需要修改它，所以修改就存储在this[`_${attr}`]上
          if (attr === 'responseText' || attr === 'response') {
            Object.defineProperty(_this, attr, {
              get: function get() {
                return _this['_'.concat(attr)] == undefined ? xhr[attr] : _this['_'.concat(attr)];
              },
              set: function set(val) {
                return _this['_'.concat(attr)] = val;
              },
              enumerable: true
            });
          } else {
            Object.defineProperty(_this, attr, {
              get: function get() {
                return xhr[attr];
              },
              set: function set(val) {
                return xhr[attr] = val;
              },
              enumerable: true
            });
          }
        }
      };

      for (var attr in xhr) {
        var _ret = _loop(attr);

        if (_ret === 'continue') continue;
      }
    }
  };
  window.XMLHttpRequest = ajax_interceptor_qoweifjqon.myXHR;
})();