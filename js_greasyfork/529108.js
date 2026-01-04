// ==UserScript==
// @namespace       无
// @license         无
// @name            B站合集倒序
// @description     为B站视频合集页面添加倒序播放功能，附带开关按钮及容错处理
// @version         1.0
// @author          YourName
// @match           *://*.bilibili.com/video/*
// @exclude         *://api.bilibili.com/*
// @exclude         *://api.*.bilibili.com/*
// @exclude         *://*.bilibili.com/api/*
// @exclude         *://member.bilibili.com/studio/bs-editor/*
// @exclude         *://t.bilibili.com/h5/dynamic/specification
// @exclude         *://bbq.bilibili.com/*
// @exclude         *://message.bilibili.com/pages/nav/header_sync
// @exclude         *://s1.hdslb.com/bfs/seed/jinkela/short/cols/iframe.html
// @exclude         *://open-live.bilibili.com/*
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/529108/B%E7%AB%99%E5%90%88%E9%9B%86%E5%80%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/529108/B%E7%AB%99%E5%90%88%E9%9B%86%E5%80%92%E5%BA%8F.meta.js
// ==/UserScript==

(() => {
  (function (root, Msg) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = Msg;
    } else if (typeof define === 'function' && define.amd) {
      define([], function () {
        return Msg(root);
      });
    } else {
      root.Qmsg = Msg(root);
    }
  })(window, function (global) {
    'use strict';

    // assign 兼容处理
    if (typeof Object.assign != 'function') {
      Object.assign = function (target) {
        if (target == null) {
          throw new TypeError('Cannot convert undefined or null to object');
        }

        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
          var source = arguments[index];
          if (source != null) {
            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }
        }
        return target;
      };
    }

    // 'classList' 兼容处理，add，remove不支持传入多个cls参数
    if (!('classList' in document.documentElement)) {
      Object.defineProperty(HTMLElement.prototype, 'classList', {
        get: function () {
          var self = this;

          function update(fn) {
            return function (value) {
              var classes = self.className.split(/\s+/g),
                index = classes.indexOf(value);
              fn(classes, index, value);
              self.className = classes.join(' ');
            };
          }

          return {
            add: update(function (classes, index, value) {
              if (!~index) classes.push(value);
            }),

            remove: update(function (classes, index) {
              if (~index) classes.splice(index, 1);
            }),

            toggle: update(function (classes, index, value) {
              if (~index) classes.splice(index, 1);
              else classes.push(value);
            }),

            contains: function (value) {
              return !!~self.className.split(/\s+/g).indexOf(value);
            },

            item: function (i) {
              return self.className.split(/\s+/g)[i] || null;
            },
          };
        },
      });
    }

    /**
     * 声明插件名称
     */
    var PLUGIN_NAME = 'qmsg';

    /**
     * 命名空间 用于css和事件
     */
    var NAMESPACE = (global && global.QMSG_GLOBALS && global.QMSG_GLOBALS.NAMESPACE) || PLUGIN_NAME;

    /**
     * 状态 & 动画
     * 显示中，显示完成，关闭中
     */
    var STATES = {
      opening: 'MessageMoveIn',
      done: '',
      closing: 'MessageMoveOut',
    };

    /**
     * 全局默认配置
     * 可在引入js之前通过QMSG_GLOBALS.DEFAULTS进行配置
     * position {String} 位置，仅支持'center','right','left',默认'center'
     * type {String} 类型，支持'info','warning','success','error','loading'
     * showClose {Boolean} 是否显示关闭图标，默认为false不显示
     * timeout {Number} 多久后自动关闭，单位ms,默认2500
     * autoClose {Boolean} 是否自动关闭，默认true,注意在type为loading的时候自动关闭为false
     * content {String} 提示的内容
     * onClose {Function} 关闭的回调函数
     */
    var DEFAULTS = Object.assign(
      {
        position: 'center',
        type: 'info',
        showClose: false,
        timeout: 2500,
        animation: true,
        autoClose: true,
        content: '',
        onClose: null,
        maxNums: 5,
        html: false,
      },
      global && global.QMSG_GLOBALS && global.QMSG_GLOBALS.DEFAULTS,
    );

    /**
     * 设置icon html代码
     */
    var ICONS = {
      info: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M512 64q190.016 4.992 316.512 131.488T960 512q-4.992 190.016-131.488 316.512T512 960q-190.016-4.992-316.512-131.488T64 512q4.992-190.016 131.488-316.512T512 64zm67.008 275.008q26.016 0 43.008-15.488t16.992-41.504-16.992-41.504-42.496-15.488-42.496 15.488-16.992 41.504 16.992 41.504 42.016 15.488zm12 360q0-6.016.992-16T592 664l-52.992 60.992q-8 8.992-16.512 14.016T508 742.016q-8.992-4-8-14.016l88-276.992q4.992-28-8.992-48t-44.992-24q-35.008.992-76.512 29.504t-72.512 72.512v15.008q-.992 10.016 0 19.008l52.992-60.992q8-8.992 16.512-14.016T468 437.024q10.016 4.992 7.008 16l-87.008 276q-7.008 24.992 7.008 44.512T444 800.032q50.016-.992 84-28.992t63.008-72z" fill="#909399"/></svg>',
      warning:
        '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M512 64C264.64 64 64 264.64 64 512c0 247.424 200.64 448 448 448 247.488 0 448-200.576 448-448 0-247.36-200.512-448-448-448zm0 704c-26.432 0-48-21.504-48-48s21.568-48 48-48c26.624 0 48 21.504 48 48s-21.376 48-48 48zm48-240c0 26.56-21.376 48-48 48-26.432 0-48-21.44-48-48V304c0-26.56 21.568-48 48-48 26.624 0 48 21.44 48 48v224z" fill="#E6A23C"/></svg>',
      error:
        '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M512 64C264.58 64 64 264.58 64 512s200.58 448 448 448 448-200.57 448-448S759.42 64 512 64zm158.39 561.14a32 32 0 1 1-45.25 45.26L512 557.26 398.86 670.4a32 32 0 0 1-45.25-45.26L466.75 512 353.61 398.86a32 32 0 0 1 45.25-45.25L512 466.74l113.14-113.13a32 32 0 0 1 45.25 45.25L557.25 512z" fill="#F56C6C"/></svg>',
      success:
        '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M512 64q190.016 4.992 316.512 131.488T960 512q-4.992 190.016-131.488 316.512T512 960q-190.016-4.992-316.512-131.488T64 512q4.992-190.016 131.488-316.512T512 64zm-56 536l-99.008-99.008q-12-11.008-27.488-11.008t-27.008 11.488-11.488 26.496 11.008 27.008l127.008 127.008q11.008 11.008 27.008 11.008t27.008-11.008l263.008-263.008q15.008-15.008 9.504-36.512t-27.008-27.008-36.512 9.504z" fill="#67C23A"/></svg>',
      loading:
        '<svg class="animate-turn" width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" fill-opacity=".01" d="M0 0h48v48H0z"/><path d="M4 24c0 11.046 8.954 20 20 20s20-8.954 20-20S35.046 4 24 4" stroke="#409eff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M36 24c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12" stroke="#409eff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      close:
        '<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" fill="white" fill-opacity="0.01"/><path d="M14 14L34 34" stroke="#909399" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 34L34 14" stroke="#909399" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    };

    /**
     * 是否支持动画属性
     * @type {Boolean}
     */
    var CAN_ANIMATION = (function () {
      var style = document.createElement('div').style;
      return (
        style.animationName !== undefined ||
        style.WebkitAnimationName !== undefined ||
        style.MozAnimationName !== undefined ||
        style.msAnimationName !== undefined ||
        style.OAnimationName !== undefined
      );
    })();

    /**
     * 生成带插件名的名称
     * @param {...String}
     * @returns {String}
     */
    function namespacify() {
      var res = NAMESPACE;
      for (var i = 0; i < arguments.length; ++i) {
        res += '-' + arguments[i];
      }
      return res;
    }

    /**
     * 每条消息的构造函数
     * @param {Objetc} opts 配置参数，参考DEFAULTS
     */
    function Msg(opts) {
      var oMsg = this;
      oMsg.settings = Object.assign({}, DEFAULTS, opts || {});
      oMsg.id = Qmsg.instanceCount;
      var timeout = oMsg.settings.timeout;
      timeout = timeout && parseInt(timeout) >= 0 ? parseInt(timeout) : DEFAULTS.timeout;
      oMsg.timeout = timeout;
      oMsg.settings.timeout = timeout;
      oMsg.timer = null;
      var $elem = document.createElement('div');
      var $svg = ICONS[oMsg.settings.type || 'info'];
      var contentClassName = namespacify('content-' + oMsg.settings.type || 'info');
      contentClassName += oMsg.settings.showClose ? ' ' + namespacify('content-with-close') : '';
      var content = oMsg.settings.content || '';
      var $closeSvg = ICONS['close'];
      var $closeIcon = oMsg.settings.showClose ? '<i class="qmsg-icon qmsg-icon-close">' + $closeSvg + '</i>' : '';
      var $span = document.createElement('span');
      if (oMsg.settings.html) {
        $span.innerHTML = content;
      } else {
        $span.innerText = content;
      }
      $elem.innerHTML =
        '<div class="qmsg-content">\
              <div class="' +
        contentClassName +
        '">\
                  <i class="qmsg-icon">' +
        $svg +
        '</i>' +
        $span.outerHTML +
        $closeIcon +
        '</div>\
      </div>';

      $elem.classList.add(namespacify('item'));
      $elem.style.textAlign = oMsg.settings.position;
      var $wrapper = document.querySelector('.' + NAMESPACE);
      if (!$wrapper) {
        $wrapper = document.createElement('div');
        // $wrapper.classList.add(NAMESPACE, namespacify('wrapper'), namespacify('is-initialized'));
        $wrapper.classList.add(NAMESPACE);
        $wrapper.classList.add(namespacify('wrapper'));
        $wrapper.classList.add(namespacify('is-initialized'));
        document.body.appendChild($wrapper);
      }
      $wrapper.appendChild($elem);
      oMsg.$wrapper = $wrapper;
      oMsg.$elem = $elem;
      setState(oMsg, 'opening');
      if (oMsg.settings.showClose) {
        // 关闭按钮绑定点击事件
        $elem.querySelector('.qmsg-icon-close').addEventListener(
          'click',
          function () {
            oMsg.close();
          }.bind($elem),
        );
      }
      $elem.addEventListener(
        'animationend',
        function (e) {
          // 监听动画完成
          var target = e.target,
            animationName = e.animationName;
          if (animationName === STATES['closing']) {
            clearInterval(this.timer);
            this.destroy();
          }
          target.style.animationName = '';
        }.bind(oMsg),
      );
      if (oMsg.settings.autoClose) {
        // 自动关闭
        var intvMs = 10; // 定时器频率
        oMsg.timer = setInterval(
          function () {
            this.timeout -= intvMs;
            if (this.timeout <= 0) {
              clearInterval(this.timer);
              this.close();
            }
          }.bind(oMsg),
          intvMs,
        );
        oMsg.$elem.addEventListener(
          'mouseover',
          function () {
            clearInterval(this.timer);
          }.bind(oMsg),
        );
        oMsg.$elem.addEventListener(
          'mouseout',
          function () {
            if (this.state !== 'closing') {
              // 状态为关闭则不重启定时器
              this.timer = setInterval(
                function () {
                  this.timeout -= intvMs;
                  if (this.timeout <= 0) {
                    clearInterval(this.timer);
                    this.close();
                  }
                }.bind(oMsg),
                intvMs,
              );
            }
          }.bind(oMsg),
        );
      }
    }

    function setState(inst, state) {
      if (!state || !STATES[state]) return;
      inst.state = state;
      inst.$elem.style.animationName = STATES[state];
    }

    /**
     * 直接销毁元素，不会触发关闭回调函数
     */
    Msg.prototype.destroy = function () {
      this.$elem.parentNode && this.$elem.parentNode.removeChild(this.$elem);
      clearInterval(this.timer);
      Qmsg.remove(this.id);
    };
    /**
     * 关闭，支持动画则会触发动画事件
     */
    Msg.prototype.close = function () {
      setState(this, 'closing');
      if (!CAN_ANIMATION) {
        // 不支持动画
        this.destroy();
      } else {
        Qmsg.remove(this.id);
      }
      var callback = this.settings.onClose;
      if (callback && callback instanceof Function) {
        callback.call(this);
      }
    };

    /**
     * 设置消息数量统计
     * @private
     */
    function setMsgCount(oMsg) {
      var countClassName = namespacify('count');
      var $content = oMsg.$elem.querySelector('[class^="qmsg-content-"]'),
        $count = $content.querySelector('.' + countClassName);
      if (!$count) {
        $count = document.createElement('span');
        $count.classList.add(countClassName);
        $content.appendChild($count);
      }
      $count.innerHTML = oMsg.count;
      $count.style.animationName = '';
      $count.style.animationName = 'MessageShake';
      oMsg.timeout = oMsg.settings.timeout || DEFAULTS.timeout;
    }

    /**
     * 合并参数为配置信息，用于创建Msg实例
     * @param {String} txt 文本内容
     * @param {Object} config 配置
     * @private
     */
    function mergeArgs(txt, config) {
      var opts = Object.assign({}, DEFAULTS);
      if (arguments.length === 0) {
        return opts;
      }
      if (txt instanceof Object) {
        return Object.assign(opts, txt);
      } else {
        opts.content = txt.toString();
      }
      if (config instanceof Object) {
        return Object.assign(opts, config);
      }
      return opts;
    }

    /**
     * 通过配置信息 来判断是否为同一条消息,并返回消息实例
     * @param {Object} params 配置项
     * @private
     */
    function judgeReMsg(params) {
      params = params || {};
      var opt = JSON.stringify(params);
      var oInx = -1;
      var oMsg;
      for (var i in this.oMsgs) {
        var oMsgItem = this.oMsgs[i];
        if (oMsgItem.config === opt) {
          oInx = i;
          oMsg = oMsgItem.inst;
          break;
        }
      }
      if (oInx < 0) {
        this.instanceCount++;
        var oItem = {};
        oItem.id = this.instanceCount;
        oItem.config = opt;
        oMsg = new Msg(params);
        oMsg.id = this.instanceCount;
        oMsg.count = '';
        oItem.inst = oMsg;
        this.oMsgs[this.instanceCount] = oItem;
        var len = this.oMsgs.length;
        var maxNums = this.maxNums;
        /**
         * 关闭多余的消息
         */
        if (len > maxNums) {
          var oIndex = 0;
          var oMsgs = this.oMsgs;
          for (oIndex; oIndex < len - maxNums; oIndex++) {
            oMsgs[oIndex] && oMsgs[oIndex].inst.settings.autoClose && oMsgs[oIndex].inst.close();
          }
        }
      } else {
        oMsg.count = !oMsg.count ? 2 : oMsg.count >= 99 ? oMsg.count : oMsg.count + 1;
        setMsgCount(oMsg);
      }
      oMsg.$elem.setAttribute('data-count', oMsg.count);
      return oMsg;
    }

    var Qmsg = {
      version: '0.0.1',
      instanceCount: 0,
      oMsgs: [],
      maxNums: DEFAULTS.maxNums || 5,
      config: function (cfg) {
        DEFAULTS = cfg && cfg instanceof Object ? Object.assign(DEFAULTS, cfg) : DEFAULTS;
        this.maxNums = DEFAULTS.maxNums && DEFAULTS.maxNums > 0 ? parseInt(DEFAULTS.maxNums) : 3;
      },
      info: function (txt, config) {
        var params = mergeArgs(txt, config);
        params.type = 'info';
        return judgeReMsg.call(this, params);
      },
      warning: function (txt, config) {
        var params = mergeArgs(txt, config);
        params.type = 'warning';
        return judgeReMsg.call(this, params);
      },
      success: function (txt, config) {
        var params = mergeArgs(txt, config);
        params.type = 'success';
        return judgeReMsg.call(this, params);
      },
      error: function (txt, config) {
        var params = mergeArgs(txt, config);
        params.type = 'error';
        return judgeReMsg.call(this, params);
      },
      loading: function (txt, config) {
        var params = mergeArgs(txt, config);
        params.type = 'loading';
        params.autoClose = false;
        return judgeReMsg.call(this, params);
      },
      remove: function (id) {
        this.oMsgs[id] && delete this.oMsgs[id];
      },
      closeAll: function () {
        for (var i in this.oMsgs) {
          this.oMsgs[i] && this.oMsgs[i].inst.close();
        }
      },
    };

    return Qmsg;
  });

  GM_addStyle(`.qmsg.qmsg-wrapper {
    position: fixed;
    top: calc(50vh - (53px));
    left: 0;
    z-index: 1010;
    width: 100%;
    pointer-events: none;
    color: rgba(0, 0, 0, 0.55);
    font-size: 13px;
    font-variant: tabular-nums;
    font-feature-settings: 'tnum';
  }
  .qmsg .qmsg-item {
    padding: 8px;
    text-align: center;
    animation-duration: 0.3s;
  }
  .qmsg .qmsg-item .qmsg-content {
    text-align: left;
    position: relative;
    display: inline-block;
    padding: 10px 12px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    pointer-events: all;
    max-width: 80%;
    min-width: 80px;
  }
  .qmsg .qmsg-item .qmsg-content [class^='qmsg-content-'] {
    display: flex;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .qmsg .qmsg-item .qmsg-content [class^='qmsg-content-'] .qmsg-icon {
    display: inline-block;
    height: 16px;
  }
  .qmsg .qmsg-item .qmsg-content [class^='qmsg-content-'] .qmsg-icon:first-child {
    margin-right: 8px;
  }
  .qmsg .qmsg-item .qmsg-content [class^='qmsg-content-'] .qmsg-icon-close {
    cursor: pointer;
    color: rgba(0, 0, 0, 0.45);
    transition: color 0.3s;
    margin-left: 6px;
  }
  .qmsg .qmsg-item .qmsg-content [class^='qmsg-content-'] .qmsg-icon-close:hover > svg path {
    stroke: #555;
  }
  .qmsg .qmsg-item .qmsg-content [class^='qmsg-content-'] .qmsg-count {
    display: inline-block;
    position: absolute;
    left: -8px;
    top: -8px;
    color: #fff;
    font-size: 12px;
    text-align: center;
    height: 16px;
    line-height: 16px;
    border-radius: 3px;
    min-width: 16px;
    animation-duration: 0.3s;
  }
  .qmsg .qmsg-item .qmsg-content-info {
    color: #909399;
  }
  .qmsg .qmsg-item .qmsg-content-info .qmsg-count {
    background-color: #909399;
  }
  .qmsg .qmsg-item .qmsg-content-warning {
    color: #e6a23c;
  }
  .qmsg .qmsg-item .qmsg-content-warning .qmsg-count {
    background-color: #e6a23c;
  }
  .qmsg .qmsg-item .qmsg-content-error {
    color: #f56c6c;
  }
  .qmsg .qmsg-item .qmsg-content-error .qmsg-count {
    background-color: #f56c6c;
  }
  .qmsg .qmsg-item .qmsg-content-success {
    color: #67c23a;
  }
  .qmsg .qmsg-item .qmsg-content-success .qmsg-count {
    background-color: #67c23a;
  }
  .qmsg .qmsg-item .qmsg-content-loading {
    color: #409eff;
  }
  .qmsg .qmsg-item .qmsg-content-loading .qmsg-count {
    background-color: #409eff;
  }
  .qmsg .animate-turn {
    animation: MessageTurn 1s linear infinite;
  }
  @keyframes MessageTurn {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(90deg);
    }
    50% {
      transform: rotate(180deg);
    }
    75% {
      transform: rotate(270deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes MessageMoveOut {
    0% {
      max-height: 150px;
      padding: 8px;
      opacity: 1;
    }
    to {
      max-height: 0;
      padding: 0;
      opacity: 0;
    }
  }
  @keyframes MessageMoveIn {
    0% {
      transform: translateY(-100%);
      transform-origin: 0 0;
      opacity: 0;
    }
    to {
      transform: translateY(0);
      transform-origin: 0 0;
      opacity: 1;
    }
  }
  @keyframes MessageShake {
    0%,
    100% {
      transform: translateX(0px);
      opacity: 1;
    }
    25%,
    75% {
      transform: translateX(-4px);
      opacity: 0.75;
    }
    50% {
      transform: translateX(4px);
      opacity: 0.25;
    }
  }`);

  GM_addStyle(`#zaizai-div .video-sections-head_second-line {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin: 12px 16px 0;
        color: var(--text3);
        color: var(--text3);
        padding-bottom: 12px;
        font-size: 14px;
        line-height: 16px;
        gap: 10px 20px;
    }

    #zaizai-div .border-bottom-line {
        height: 1px;
        background: var(--line_regular);
        margin: 0 15px;
    }

    #zaizai-div .switch-button {
        margin: 0;
        display: inline-block;
        position: relative;
        width: 30px;
        height: 20px;
        border: 1px solid #ccc;
        outline: none;
        border-radius: 10px;
        box-sizing: border-box;
        background: #ccc;
        cursor: pointer;
        transition: border-color .2s, background-color .2s;
        vertical-align: middle;
    }

    #zaizai-div .switch-button.on:after {
        left: 11px;
    }

    #zaizai-div .switch-button:after {
        content: "";
        position: absolute;
        top: 1px;
        left: 1px;
        border-radius: 100%;
        width: 16px;
        height: 16px;
        background-color: #fff;
        transition: all .2s;
    }

    #zaizai-div .switch-button.on {
        border: 1px solid var(--brand_blue);
        background-color: var(--brand_blue);
    }

    #zaizai-div .txt {
        margin-right: 4px;
        vertical-align: middle;
    }

    #zaizai-div .scroll-to-the-current-playback{
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: var(--brand_blue);
      color: var(--brand_blue);
      width: 100%;
      height: 24px;
      border-radius: 2px;
      border: 1px solid var(--brand_blue);
      border: 1px solid var(--brand_blue);
    }
    `);

  const console = (() => {
    const _console = window.console;
    return {
      log: (...args) => {
        _console.log(
          `%c ZAIZAI `,
          'padding: 2px 1px; border-radius: 3px; color: #fff; background: #42c02e; font-weight: bold;',
          ...args,
        );
      },
    };
  })();

  // 全局变量
  const local = useReactiveLocalStorage({
    // 开启倒序播放
    startreverseorder: false,
  });

  let Video = null;
  let videoSections = null;
  let keyupCodeFn = {};

  function useReactiveLocalStorage(obj) {
  let data = {};
  let zaizaiStore = window.localStorage.getItem('zaizai-store');
  if (zaizaiStore) {
    zaizaiStore = JSON.parse(zaizaiStore);
    for (const key in obj) {
      // 删除判断 defaultreverseorder 和 addsectionslistheigth 的逻辑
      if (key!== 'defaultreverseorder' && key!== 'addsectionslistheigth') {
        data[key] = zaizaiStore[key] || obj[key];
      }
    }
  } else {
    // 删除 defaultreverseorder 和 addsectionslistheigth 的初始化
    data = {
      startreverseorder: false
    };
  }

  let handler = {
    set(target, key, value) {
      let res = Reflect.set(target, key, value);
      try {
        window.localStorage.setItem(`zaizai-store`, JSON.stringify(data));
      } catch (error) {
        console.log('存储失败，请检查浏览器设置', error);
      }
      return res;
    },
    get(target, key) {
      let ret = Reflect.get(target, key);
      return typeof ret === 'object' ? new Proxy(ret, handler) : ret;
    },
  };
  data = new Proxy(data, handler);
  return data;
}

  function waitTime(callback, options = { time: 500, isSetup: false }) {
    let timeout = null;
    return new Promise((resolve) => {
      if (options.isSetup) {
        let res = callback();
        resolve(res);
      }
      timeout = setInterval(() => {
        let res = callback();
        if (res) {
          clearInterval(timeout);
          resolve(res);
        }
      }, options.time);
    });
  }

  async function selectVideo() {
    await waitTime(
      () => {
        let video = document.querySelector('video');
        if (video) {
          console.log('成功找到视频元素:', video);
          Video = video;
          return true;
        }
           console.log('未找到视频元素，继续查找...');
      },
      {
        isSetup: true,
      },
    );
  }

  // 查找多个元素，返回第一个找到的元素
  function selectShowEl(arr) {
    for (const element of arr) {
      const el = document.querySelector(element);
      if (el) return el;
    }
  }



  // 判断是否开启了 循环播放
  async function getisReverseorder() {
    const playerloop_checkbox = await waitTime(
      () => {
        let checkbo = selectShowEl([
          '.bui-switch-input[aria-label="洗脑循环"]',
          '.bui-switch-input[aria-label="单集循环"]',
        ]);
        if (checkbo) {
          return checkbo;
        }
      },
      { isSetup: true },
    );

    return playerloop_checkbox;
  }

  // 如果视频洗脑循环，打开后关闭倒叙播放
  async function bindWatch() {
    const playerloop_checkbox = await getisReverseorder();
    if (playerloop_checkbox) {
      playerloop_checkbox.addEventListener('change', () => {
        if (playerloop_checkbox.checked) {
          local.startreverseorder = false;
          document.querySelector('#startreverseorder').classList.remove('on');
          Video.removeEventListener('ended', VideoOnEnded);
        }
      });
    }
  }

  // 添加功能按钮
  async function VideoOnPlay() {
  if (!document.querySelector('#zaizai-div')) {
    const div = document.createElement('div');
    div.id = 'zaizai-div';
    let isstartreverseorder = await getisReverseorder();
    let isplayerloop = isstartreverseorder?.checked;

    if (isplayerloop) {
      // 删除默认开启倒序播放相关逻辑
      local.startreverseorder = false;
    }

    // 修改 div.innerHTML，删除默认开启倒序播放和增高合集列表相关内容
    div.innerHTML = `
      <div class="video-sections-head">
        <div class="border-bottom-line"></div>
        <div class="video-sections-head_second-line">
          <div>
            <span class="txt">倒序播放</span>
            <span id="startreverseorder" class="switch-button ${local.startreverseorder ? 'on' : ''}"></span>
          </div>
        </div>
      </div>
    `;

    videoSections.appendChild(div);
    console.log(videoSections);


    // 倒序播放
    let startreverseorder = document.querySelector('#startreverseorder');
     async function switchReverseoOnClick() {
      const playerloop_checkbox = await getisReverseorder();
      if (playerloop_checkbox.checked) {
        Qmsg && Qmsg.warning('请关闭"洗脑循环"后再开启倒序播放');
        return;
      }
      local.startreverseorder = !local.startreverseorder;
      if (local.startreverseorder) {
        startreverseorder.classList.add('on');
        Video.addEventListener('ended', VideoOnEnded);
      } else {
        startreverseorder.classList.remove('on');
        Video.removeEventListener('ended', VideoOnEnded);
      }
    }
    startreverseorder.addEventListener('click', switchReverseoOnClick);

  }
 }

async function getCurrentcard() {
    const episodecards = await waitTime(
        () => {
            // 修改选择器为 .video-pod__item
            let els = document.querySelectorAll('.video-pod__item');
            if (els.length) {
                return els;
            }
            // 如果还有其他可能的列表结构，可以继续添加选择逻辑
            return null;
        },
        {
            isSetup: true,
        },
    );

    if (!episodecards || episodecards.length === 0) {
        console.log('未找到播放项元素');
        return null;
    }

    let i = 0;
    for (const element of episodecards) {
        // 检查元素是否有 active 类名，并且.playing-gif 元素是否显示
        let curicon = element.querySelector('.playing-gif');
        if (curicon && curicon.style.display!== 'none' ) {
            break;
        }

        i++;
    }

    if (i === episodecards.length) {
        console.log('未找到当前播放项');
        return null;
    }

    // 顺序上一个
    let previous = i - 1 < 0? episodecards.length - 1 : i - 1;
    // 顺序下一个
    let next = i + 1 >= episodecards.length? 0 : i + 1;
    const result = {
        elements: episodecards,
        current: i,
        currentEl: episodecards[i],
        next,
        nextEl: episodecards[next],
        previous,
        previousEl: episodecards[previous],
    };
     console.log('找到列表');
    console.log(result);

    return result;
}

  async function VideoOnEnded() {
    /* let curpage = document.querySelector('.cur-page').textContent
            curpage = curpage.match(/\d+/g).at(-1)
            curpage = parseInt(curpage) */
    const { previousEl } = await getCurrentcard();
    previousEl.querySelector('.simple-base-item').click();
  }

  function keyup_key_g() {
    document.querySelector(`.bpx-player-ctrl-btn[aria-label="网页全屏"]`).click();
  }
  keyupCodeFn['g'] = keyup_key_g;

  function keyup_key_h() {
    document.querySelector(`.bpx-player-ctrl-btn[aria-label="画中画"]`).click();
  }
  keyupCodeFn['h'] = keyup_key_h;

async function main(i = 0) {

  await waitTime(() => {
    let progress = document.querySelector('.bpx-player-progress-schedule-current');
    if (progress) {
      let transform = progress.style.transform.replace('scaleX(', '').replace(')', '');
      if (transform > 0) {
        videoSections = selectShowEl(['.base-video-sections-v1', '.video-pod.video-pod']);
        if (videoSections) {
          return true;
        }
        return false;
      }
    }
  });

  if (!videoSections && i < 10) {
    return main(i++);
  }

  await selectVideo();
    console.log('=====');
    console.log(Video);
  Video.addEventListener('play', VideoOnPlay);
  // 删除默认开启倒序播放相关事件绑定
  if (local.startreverseorder) {
    Video.addEventListener('ended', VideoOnEnded);
  }

  // 删除增高合集列表调用
  await VideoOnPlay();
  await bindWatch();

  window.addEventListener('keyup', (e) => {
    console.log('keyup', e);

    keyupCodeFn[e.key] && keyupCodeFn[e.key]();
  });



  setTimeout(() => {
    if (!document.querySelector('#zaizai-div') && i < 10) {
      i++;
      return main(i + 1);
    } else {
    }
  }, 500);
}

  window.onload = async () => {

    /* try {
      await new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/gh/yaohaixiao/message.js/message.min.js';
        script.onload = () => {
          resolve();
        };
        document.body.appendChild(script);
      });
    } catch (e) {
    } */

    main().catch((err) => {
      console.log(err);
    });
  };
})();