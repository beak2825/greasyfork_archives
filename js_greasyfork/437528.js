// ==UserScript==
// @name        b站首页黑名单 屏蔽首页视频
// @description 屏蔽b站首页推荐中的指定up
// @namespace   https://github.com/kuzen
// @version     1.8.7
// @author      kuzen
// @icon        https://www.google.com/s2/favicons?domain=bilibili.com
// @run-at      document-start
// @include     *://www.bilibili.com/
// @include     *://www.bilibili.com/?*
// @license     MIT
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @grant       GM_log
// @grant       GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/437528/b%E7%AB%99%E9%A6%96%E9%A1%B5%E9%BB%91%E5%90%8D%E5%8D%95%20%E5%B1%8F%E8%94%BD%E9%A6%96%E9%A1%B5%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/437528/b%E7%AB%99%E9%A6%96%E9%A1%B5%E9%BB%91%E5%90%8D%E5%8D%95%20%E5%B1%8F%E8%94%BD%E9%A6%96%E9%A1%B5%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==
/* ==UserConfig==
blockList:
  uid:
    title: uid黑名单
    description: uid黑名单，注意若格式填写有问题则会影响脚本运行！格式为 ["xxx", "xxx"]
    default: s[]
 ==/UserConfig== */
(function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  // eslint-disable-next-line valid-jsdoc

  /**
   * refer to: https://github.com/ipcjs/bilibili-helper
   */
  function createElement(type, props, children) {
    var elem = null;

    if (type === 'text') {
      return document.createTextNode(props);
    } else {
      elem = document.createElement(type);
    }

    for (var n in props) {
      if (n === 'style') {
        // eslint-disable-next-line guard-for-in
        for (var x in props.style) {
          elem.style[x] = props.style[x];
        }
      } else if (n === 'className') {
        elem.className = props[n];
      } else if (n === 'event') {
        // eslint-disable-next-line guard-for-in
        for (var _x in props.event) {
          elem.addEventListener(_x, props.event[_x]);
        }
      } else {
        props[n] !== undefined && elem.setAttribute(n, props[n]);
      }
    }

    if (children) {
      if (typeof children === 'string') {
        elem.innerHTML = children;
      } else {
        for (var i = 0; i < children.length; i++) {
          if (children[i] != null) {
            elem.appendChild(children[i]);
          }
        }
      }
    }

    return elem;
  }

  function createBlockListWarp(addEvent) {
    return createElement('div', {
      className: 'brlb-block-setting'
    }, [createElement('div', {
      className: 'brlb-block-label'
    }, '屏蔽列表'), createElement('div', {
      className: 'brlb-block brlb-block-wrap'
    }, [createElement('div', {
      className: 'brlb-block-tablist'
    }, [createElement('div', {
      className: 'brlb-block-tabpanel',
      role: 'list'
    }, [createElement('div', {
      className: 'brlb-block-tabpanel-row input-row'
    }, [createElement('input', {
      type: 'text',
      className: 'brlb-block-string',
      placeholder: '添加屏蔽词，正则以 / 开头 / 结尾'
    }), createElement('div', {
      className: 'brlb-block-string-btn bui bui-button bui-button-gray',
      role: 'button',
      event: {
        click: addEvent
      }
    }, [createElement('span', {}, '添加')])])]), createElement('div', {
      className: '<div class="brlb-block-tabpanel-row active-1'
    }, [createElement('div', {
      className: 'brlb-block-tabpanel-row special-tabs bui bui-tabs'
    }, [createElement('div', {
      className: 'bui-tabs-wrap'
    }, [createElement('div', {
      className: 'bui-tabs-header'
    }, [createElement('div', {
      'className': 'bui-tabs-header-item bui-tabs-header-item-active',
      'data-brlb-Index': '0'
    }, '屏蔽用户uid'), createElement('div', {
      'className': 'bui-tabs-header-item',
      'data-index': '1'
    }, '正则屏蔽用户'), createElement('div', {
      'className': 'bui-tabs-header-item',
      'data-index': '2'
    }, '正则屏蔽视频')]), createElement('div', {
      className: 'bui-tabs-body'
    }, [createElement('div', {
      className: 'bui-tabs-body-item bui-tabs-body-item-active'
    }), createElement('div', {
      className: 'bui-tabs-body-item'
    }), createElement('div', {
      className: 'bui-tabs-body-item'
    })])])]), createElement('div', {
      className: 'brlb-block-tabpanel-row brlb-border'
    }, [createElement('div', {
      className: 'brlb-block-list-function'
    }, [createElement('div', {
      className: 'brlb-block-list-function-content'
    }, '内容'), createElement('div', {
      className: 'brlb-state-wrap'
    }, [createElement('div', {
      className: 'brlb-block-list-function-delete'
    }, '操作')])]), createElement('div', {
      className: 'brlb-block-list-wrap',
      style: {
        'height': '265px',
        'overflow-y': 'scroll',
        'overflow-x': 'hidden'
      }
    })])])])])]);
  }

  function createSettingWarp(closeEvent, clrEvent, addEvent) {
    var brlbBlockListWrap = createBlockListWarp(addEvent);
    return createElement('div', {
      id: 'brlb-settings',
      style: {
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(0,0,0,.7)',
        animationName: 'brlb-settings-bg',
        animationDuration: '.5s',
        zIndex: 10000,
        cursor: 'pointer'
      },
      event: {
        click: function click(event) {
          if (event.target === this) {
            document.body.style.overflow = '';
            this.remove();
          }
        }
      }
    }, [createElement('div', {
      style: {
        position: 'absolute',
        background: '#FFF',
        borderRadius: '10px',
        padding: '20px',
        top: '50%',
        left: '50%',
        // width: '600px',
        transform: 'translate(-50%,-50%)',
        cursor: 'default'
      }
    }, [createElement('h2', {}, [createElement('text', "".concat(GM_info.script.name, " v").concat(GM_info.script.version, " \u8BBE\u7F6E"))]), createElement('br'), createElement('br'), createElement('form', {
      id: 'brlb-settings-form' // event: {
      //     change: onSettingsFormChange
      // }

    }, [brlbBlockListWrap, createElement('a', {
      'href': 'javascript:',
      'data-sign': 'in',
      'event': {
        click: clrEvent
      }
    }, [createElement('text', '清空黑名单 (刷新生效)')]), createElement('text', ' '), createElement('br'), createElement('br'), createElement('div', {
      style: {
        whiteSpace: 'pre-wrap'
      }
    }, [createElement('a', {
      href: 'https://greasyfork.org/zh-CN/scripts/437528-bili-recommended-list-blocker',
      target: '_blank'
    }, [createElement('text', '脚本主页')]), createElement('text', '　'), createElement('a', {
      href: 'https://github.com/kuzen/Bili-Recommended-List-Blocker/blob/master/README.md',
      target: '_blank'
    }, [createElement('text', '帮助说明')])])])])]);
  }

  var css_248z$1 = "#brlb-settings{color:#6d757a;font-size:12px}#brlb-settings h1{color:#161a1e}#brlb-settings a{color:#00a1d6}#brlb-settings a:hover{color:#f25d8e}#brlb-settings input{margin-left:3px;margin-right:3px}#brlb-settings label{cursor:pointer;display:inline-block;width:100%}#brlb-settings label:after{background:#4285f4;content:\"\";display:block;height:1px;transition:width .3s;width:0}#brlb-settings label:hover:after{width:100%}form{margin:0}#brlb-settings input[type=radio]{-webkit-appearance:radio;-moz-appearance:radio;appearance:radio}#brlb-settings input[type=checkbox]{-webkit-appearance:checkbox;-moz-appearance:checkbox;appearance:checkbox}.brlb-block-line-delete{background:url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='16' height='16' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23fff' fill-opacity='.01' d='M0 0h48v48H0z'/%3E%3Cpath d='M9 10v34h30V10H9Z' stroke='%234a4a4a' stroke-width='4' stroke-linejoin='round'/%3E%3Cpath d='M20 20v13M28 20v13M4 10h40' stroke='%234a4a4a' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='m16 10 3.289-6h9.488L32 10H16Z' stroke='%234a4a4a' stroke-width='4' stroke-linejoin='round'/%3E%3C/svg%3E\") no-repeat 50%;background-position:50%;background-repeat:no-repeat;width:16px}.bui,.bui-tabs .bui-tabs-header{display:-webkit-box;display:-ms-flexbox;display:flex}.bui{-webkit-box-align:center;-ms-flex-align:center;-webkit-box-pack:center;-ms-flex-pack:center;align-items:center;justify-content:center;vertical-align:middle}.bui-tabs{-webkit-box-pack:start;-ms-flex-pack:start;justify-content:flex-start}.bui-tabs .bui-tabs-header{margin-bottom:8px}.bui-tabs .bui-tabs-header .bui-tabs-header-item{color:#212121;cursor:pointer;font-size:12px;margin-right:20px;text-align:center}.bui-tabs .bui-tabs-header .bui-tabs-header-item.bui-tabs-header-item-active{border-bottom:1px solid #00a1d6;color:#00a1d6}.bui-tabs .bui-tabs-body .bui-tabs-body-item{display:none}.bui-tabs .bui-tabs-body .bui-tabs-body-item.bui-tabs-body-item-active{display:block}.bui-button{background:0 0;border-radius:2px;-webkit-box-sizing:border-box;box-sizing:border-box;color:inherit;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;font-size:12px;height:24px;line-height:inherit;min-width:68px;outline:0;padding:0;text-align:inherit;-webkit-transform:translateZ(0);transform:translateZ(0);-webkit-transition:.2s;-o-transition:.2s;transition:.2s}.bui-button.bui-button-border,.bui-button.bui-button-transparent{border:1px solid hsla(0,0%,100%,.2);color:#fff}.bui-button.bui-button-border:hover,.bui-button.bui-button-transparent:hover{border-color:#00a1d6;color:#00a1d6}.bui-button,.bui-button.bui-button-border{cursor:pointer}.bui-button.bui-button-border.bui-button-disabled{background:0 0;border:1px solid hsla(0,0%,100%,.1);color:hsla(0,0%,100%,.2)}.bui-button.bui-button-border.bui-button-disabled:hover{background:0 0;color:hsla(0,0%,100%,.2)}.bui-button.bui-button-white{background-color:#fff;border:1px solid silver;color:#757575}.bui-button.bui-button-white:hover{border-color:#00a1d6;color:#00a1d6}.bui-button.bui-button-gray{background-color:#e5e9ef;color:#212121}.bui-button.bui-button-gray:hover{background-color:#00a1d6;color:#fff}.bui-button.bui-button-gray2{background-color:#f4f4f4;color:#505050}.bui-button.bui-button-gray2:hover{background-color:#f4f4f4;color:#222}.bui-button.bui-button-gray2.bui-button-disabled,.bui-button.bui-button-gray2.bui-button-disabled:hover{background-color:#f4f4f4;color:#ccd0d7}.bui-button.bui-button-gray3{color:#999}.bui-button.bui-button-blue,.bui-button.bui-button-gray3:hover{background-color:#00a1d6;color:#fff}.bui-button.bui-button-blue:hover{background-color:#00b5e5}.bui-button.bui-button-blue2{background-color:#fff;border:1px solid #00a1d6;color:#00a1d6}.bui-button.bui-button-blue2:hover{background-color:#00a1d6;color:#fff}.bui-button.bui-button-yellow{background-color:#f5b23d;color:#fff}.bui-button.bui-button-yellow:hover{background-color:#ffc154}.bui-button.bui-button-text{color:#00a1d6}.bui-button.bui-button-text:hover{color:#00b5e5}.bui-button.bui-button-disabled{background:#f5f7fa;border:0;color:silver;cursor:default}.bui-button.bui-button-disabled:hover{background:#f5f7fa;color:silver}.brlb-block-setting{padding-bottom:24px}.brlb-block-label{color:#18191c;font-size:12px;font-weight:700;vertical-align:middle}.brlb-block-tabpanel-row{zoom:1;font-size:0;line-height:20px;margin-bottom:4px}.input-row{display:-webkit-box;display:-ms-flexbox;display:flex}.brlb-block-tabpanel{height:auto;pointer-events:auto;position:relative;-webkit-transition:height .3s;transition:height .3s}.brlb-block-tabpanel.no-bottom{border-bottom:0;padding-bottom:0}.brlb-block-tablist{margin:0 16px;transform:translateX(0) translateY(0) translateZ(1px);transition-duration:0s;transition-property:transform;transition-timing-function:cubic-bezier(.165,.84,.44,1)}.brlb-block-wrap{-webkit-user-drag:none;-webkit-tap-highlight-color:transparent;border-bottom:1px solid #e3e5e7;flex:none;height:377px;touch-action:pan-x;user-select:none;width:360px}.brlb-block-string{background-color:#fff;border:1px solid #e3e5e7;border-radius:2px;-webkit-box-sizing:border-box;box-sizing:border-box;color:#18191c;display:inline-block;font-size:12px;height:20px;line-height:20px;margin-right:6px;padding:1px 10px 1px 5px;vertical-align:middle;width:75%}.bui-button-gray{-webkit-box-flex:1;background-color:#f1f2f3;color:#18191c;flex:1;min-width:-webkit-fit-content;min-width:-moz-fit-content;min-width:fit-content}.brlb-block-empty,.brlb-block-list-function{color:#9499a0;text-align:center}.brlb-block-list-function{-webkit-box-pack:justify;-ms-flex-pack:justify;display:-webkit-box;display:-ms-flexbox;display:flex;font-size:12px;justify-content:space-between;line-height:24px;padding:0 6px}.brlb-block-empty{display:none;height:100%;line-height:100px;width:100%}.brlb-block-line{-webkit-box-pack:justify;-ms-flex-pack:justify;background:#fff;color:#18191c;display:-webkit-box;display:-ms-flexbox;display:flex;font-size:100%;height:24px;justify-content:space-between;padding-left:5px;position:relative}.brlb-block-line>div{font-size:12px;height:24px;line-height:24px;text-overflow:ellipsis;white-space:nowrap}.brlb-block-line-content{display:inline-block;padding-left:4px;text-align:left;width:150px}.icon-general-del{-webkit-touch-callout:none;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-family:bilibili-new-iconfont!important;font-size:16px;font-style:normal;line-height:inherit;-webkit-transition:color .3s;transition:color .3s;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;vertical-align:top}.brlb-block-list-function-delete{padding-right:16px}.brlb-block-line-delete{padding-right:36px}";

  var Setting = /*#__PURE__*/function () {
    function Setting(blockList) {
      var _this = this;

      _classCallCheck(this, Setting);

      this.blockList = blockList;
      GM_addStyle(css_248z$1);
      this.listWrap = null;

      var btnWarpCallback = function btnWarpCallback(mutationsList, _observer) {
        setTimeout(function () {
          _this.addSettingBtn();
        }, 100);

        _this.btnWarpObserver.disconnect();
      };

      this.btnWarpObserver = new MutationObserver(btnWarpCallback);
      var targetNode = document.getElementById('i_cecream');
      var config = {
        attributes: false,
        childList: true,
        subtree: false
      };
      this.btnWarpObserver.observe(targetNode, config);
    } // TODO


    _createClass(Setting, [{
      key: "refreshList",
      value: function refreshList(key) {
        if (this.listWrap) {
          this.listWrap.innerHTML = '';
          this.addItems(key);
        }
      }
    }, {
      key: "addItems",
      value: function addItems(key, text) {
        var itemDom = createElement('div', {
          className: 'brlb-block-line'
        }, [createElement('div', {
          className: 'brlb-block-line-content'
        }), createElement('span', {
          className: 'brlb-block-line-delete'
        })]);

        if (this.listWrap) {
          if (text == null) {
            var _iterator = _createForOfIteratorHelper(this.blockList.list[key]),
                _step;

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var uid = _step.value;
                var item = itemDom.cloneNode(true);
                item.getElementsByClassName('brlb-block-line-content')[0].innerText = uid;
                this.listWrap.appendChild(item);
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          } else {
            var _item = itemDom.cloneNode(true);

            _item.getElementsByClassName('brlb-block-line-content')[0].innerText = text;
            this.listWrap.appendChild(_item);
          }
        }
      }
    }, {
      key: "addSettingBtn",
      value: function addSettingBtn() {
        var _this2 = this;

        var addBtnClick = function addBtnClick(event) {
          // TODO
          var uid = event.currentTarget.parentElement.getElementsByClassName('brlb-block-string')[0].value;

          if (uid.length > 0) {
            GM_log(uid);

            _this2.blockList.add('uid', uid);

            _this2.addItems('uid', uid);
          }
        };

        var closeEvent = function closeEvent(event) {
          if (event.target === _this2) {
            document.body.style.overflow = '';

            _this2.remove();
          }
        };

        var clrEvent = function clrEvent(event) {
          _this2.blockList.clr();
        };

        var settingsPanelWarp = createSettingWarp(closeEvent, clrEvent, addBtnClick);
        var settingBtn = createElement('button', {
          className: 'primary-btn brlb-setting-btn',
          style: {
            'padding': '0 4px',
            'height': '40px',
            'text-align': 'center',
            'font-size': '12px'
          },
          event: {
            click: function click() {
              document.body.appendChild(settingsPanelWarp);

              _this2.refreshList('uid');
            }
          }
        }, '屏蔽设置');
        var btnWrap = document.getElementsByClassName('palette-button-wrap')[0];
        var firstBtn = btnWrap.getElementsByClassName('primary-btn')[1];
        this.listWrap = settingsPanelWarp.getElementsByClassName('brlb-block-list-wrap')[0];

        this.listWrap.onclick = function (ev) {
          ev = ev || window.event;
          var target = ev.target;

          if (target.className.toLowerCase() === 'brlb-block-line-delete') {
            var uid = target.parentElement.firstChild.innerText;

            _this2.blockList.remove('uid', uid);

            ev.currentTarget.removeChild(target.parentElement);
          }
        };

        var tabsWrap = settingsPanelWarp.getElementsByClassName('bui-tabs-header')[0];

        tabsWrap.onclick = function (ev) {
          ev = ev || window.event;
          var target = ev.target;

          if (target.className.toLowerCase() === 'bui-tabs-header-item') {
            target.dataset.index;

            var _iterator2 = _createForOfIteratorHelper(ev.currentTarget.getElementsByClassName('bui-tabs-header-item')),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var tab = _step2.value;
                tab.classList.remove('bui-tabs-header-item-active');
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }

            target.classList.add('bui-tabs-header-item-active'); // TODO
            // if (index === '1')
          }
        };

        btnWrap.insertBefore(settingBtn, firstBtn);
      }
    }]);

    return Setting;
  }();

  var css_248z = ".brlb-block-btn .brlb-block-btn-icon,.brlb-block-btn-icon{color:#fff;height:22px;pointer-events:none;user-select:none;width:22px}.brlb-block-btn-icon{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='22' height='22' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23fff' fill-opacity='.01' d='M0 0h48v48H0z'/%3E%3Cpath clip-rule='evenodd' d='M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Z' stroke='%23f3f3f3' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='m15 15 18 18' stroke='%23f3f3f3' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")}.brlb-block-btn{align-items:center;background-color:rgba(33,33,33,.8);border-radius:6px;cursor:pointer;display:-webkit-flex;display:flex;height:28px;justify-content:center;position:absolute;right:8px;top:72px;transform:translateZ(0);width:28px;z-index:9}.brlb-block-btn .brlb-block-btn-tip{background-color:rgba(0,0,0,.8);border-radius:4px;bottom:-6px;color:#fff;font-size:12px;line-height:18px;padding:4px 8px;pointer-events:none;position:absolute;right:-10px;transform:translateY(100%);user-select:none;white-space:nowrap}.brlb-block .v-img.bili-video-card__cover{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' display='block' viewBox='0 0 678 381'%3E%3Cpath fill='%23182b9a' d='M0 0h678v381H0z'/%3E%3Cpath fill='%2316195c' d='M654 134h2v2l16-2v7l-3 1-1 2h10v237H0V163l10 5 14 4 4 3 6 2 3 6 2 1 1 20 13 1 3 1v2l7 1 1-6 4-5 5-2h7l8 3 5 2 1 3 6 1 2 3 2 18 2 1v13l2 8h2v2h2v2l4 2 7 4 3 3 11 4v1l-9-1-10-5 2 3v3l-3 1-1 2h-4v3l-10 3-2 2-5 2h-5v-2h4v-3h2l-1-6h-4l1-8-6 1-1 4-5 3h-3v2h12v2H76l4 5-10 2v3l22 1v3H82v2l-7 1 1 5-9 2v3h13l2 1-1 4h-7v-2h-8l-1 5h16l-1 2-8 1-2 4h7l18 2v-2h9v2l5-1 21 1 6 1v2l-8 2-18 1v2l15-1 3-1 16-1 3-1 1-4h-3l-1-4 6-1 1 1 1-2 32-1 16 3h9l2-4h7l1 4 16-2 2-1h11v5l3-2 16-2-4-17-1-2v-7l-5-1-3-1v-4l-7 3-5 1-2-4v-3h2v-3h2v-2l3-1 1-7h-6v2l-7 1v-9l5-4 6-3 3-1-4-2v-2l8-1-1-3h-12l-8 1v2l-6 4-7 2h-84l-5 1 1 1h13l4 1-1 3-7-1v2l-3 3-6-1v-2h-2l-4-10-2-11v-11h4l1 4 10 1v-4l9-4h5l3-9h2v11h3l1-4h2l1 4 4 2 1-8 5-1 3 10 9 2 1-8 4 2 4 9 5 2 65 1v-4h3l1-4h2l2-7h4l1-4-11 2v-7h2l2-5 6-4 11-2h7l4 2 4 2 3 9v4h-2v2h-6v8h-2l-1 8 1 3 4-2 20-2h26v-3h3v-4h2l1-3h2l2-8 4 1v5l-3 2-2 6-1 14 2 7v2h6v3h-35v-2l15-1-7-12-10 1v-2l-3 1h-14l1 9h-3v-9h-9l1 5 1 19 5 3 1 3 3 1v-2l5-1 2 3 3 2-3 4h-15l-4-1-3-10h-5l-1 4v8l2 2 3 7 4 2v4h3v-2l11-1 2-2h4l2-4 6-1 2-5 5-6 2-1 4-10h5v10l5 2 6 7 5 4 6 2v2l7-1-1-7v-16l2-8-4-1v-2h6l4 2 1-5h4v-9h-13l-7-1v3h-3l-1 6h-2l-1-3v-12l1 3h3l1-10h3v-9h-2v-7l2-2 14-1 10-1 1 12 2 7v6h-11v2h4l4 14h9l2 1v3h11v3h-12l4 7 1 20 2 11 1 1 3 15 6 4 5 1h23l3-3 10-1 1-1 31 1h19v-3l-27-2v-2h3v-4h-18l-3-4v-2h-2v-2h-3l-1-4 3-1 1-3h12l4 4h2v-6l2-1 1 3 22 1 2-2 10-3 21 1 5-5 5-3 5 1h4l2-5 13-1 1-5-19-1-8-2-16-1-2-2-10-1 4-2 26-1v-2l-5-1-2-1 1-4 9-3 2-3-12-1h-31l-9 1-1 4-4 3-2 5h3v3h-12v-3h-2l-2-8-11-4-6-2-6-3 1 4-38 1-5-1v-5h9l1 3 2 1 1-4 12-1 70-1h45v-3l5-2 3-5 4-3 5-1 2-6 5-2v-12l2-6h2l2 4 2 1v17h2l1-4 17-5h3v-11l1-3h-2v-3h2v-6l8-3h6v3h8l4-6-3 2h-4v-8h-11v-3l6-5h2v-2h2l2-5 3-1 2-4h5v-3l10-2v-5l3 1zM480 279z'/%3E%3Cpath fill='%233754c1' d='M453 64h5l3 3 11 1 5-1 3 8 3 8 1 5h4v3l-3 2-2 9h2v-3h3v6h2l1-5 4 2 2 7 5-5 2 1-5 6 7 1 1 6 15 1 5 1v-3l-12-1-2-5-2-2v-3h2v2l4-1 3 1 1 4h2v-5h9v2h-6v6h5l8 3 2 4 3 1-1-3h6l-1-6v-2l-1-5h15l6 2v3h7l1 4 10 1v-4h-6v-2h4l-1-4 7-1h10v-2l3-2 1-4h2l-2 7-1 2 9-3 1-2 6-1 3 1 12-3 6-1v2h-2v2h-2l-1 4-7 2-1 2h-5l-2 4-3 3v10l3-1v5l-4 1v-3l-5 2h-5v-3h-3l-1 4 4 1v3l16-1 4-3h3l1 6-4 1v6l-1 1h-5v-2h-3l-2 5-5 2v5h-3 4l5-2h3v-2h2v-2h6l-1 3-7 4h-5v2l5 2-1 7h11v8l7-2-2 5-2 2-8-1v-3l-13 3-1 6h-2v3h2l-1 14-20 6-1 3h-2l-1-4v-10l1-3-3-1-1-4h-2l-2 18-5 3-2 6-7 2-3 3-2 4-5 1v3l-45 1-70 1-12 1-1 3-3-1v-3l-8 1-1 4 42-1-1-4 7 3 6 2 11 4 2 3v6h2v3h12v-3h-3l2-6 4-2 1-4 9-2h31l13 1-4 6-8 2-1 3 7 2v2l-26 2 8 1v2l16 1 8 2 19 2v5l-1 1-13 1-2 5h-4l-6-1-5 4-4 4h-9l-12-1-10 3-2 2-22-1-2-3v7l-4-1-3-3h-12l-3 4 1 2 3 1-1 2 4 1 1 4 18 1v4h-3v2h16l11 1 1 2-1 2-3 1h-16l-31-1-1 1-10 1-3 3h-23l-9-3-3-3-3-15-2-6-1-6-1-20-3-4v-3h12v-3h-11v-3l-5-1-1 1h-5l-3-9-1-6h-4v-2h11l-3-13v-12l-6 2h-9l-9 1-1 1-1 7h2v9h-3v7l-1 3h-3v12h2l1-6h3v-3h17l3 1v9l-4 1-1 4-10-2v2l4 1v6l-1 2v23l-7 1v-2l-7-2-7-6-4-5-4-2v-10h-5l-3 10-5 5-5 7-7 3-1 2-5 2-1 1h-11v2h-3v-4l-5-2-4-8-1-1v-8l2-4h5l3 7v3h19l2-3-4-4h-5v2l-4-1-1-3-5-3-1-24h9v9h3l-1-9 17-1v2l10-2 7 11v2l-6 1h-9v2l19-1h11l5 1v-3h-6l-3-9 1-14 3-7 3-1-1-5-3-1v5l-5 6h-2v4h-3v3l-7 1h-19l-20 2-4 1-2-5 2-6h2v-8h6v-2h2l-4-13-8-2v-1l-12 1-9 3-4 6h-2v7l6-2h5l-1 4h-4l-2 7h-2l-1 4h-3v4h-65l-6-3-5-10-2-1-1 8-9-2-3-8v-2l-4 1-2 8-5-2v-4h-2l-1 4h-3v-11h-2l-3 9-10 3-4 1v4h-7l-3-1-1-4h-4l2 18 4 12v2h2v2l6 1 1-3h2v-2l4-1v2l3-1 1-2h-17l-2-1 1-2 5-1h84l9-3 4-2v-2l8-2h12l2 2-1 2-8 1v2l8 1-4 1-1 2-6 2-6 4-1 9 7-1v-2h6v7l-4 1v2h-2v3h-2l2 4v3l7-3 5-1v4l5 1 3 1 2 9 3 13v4l-7 2-9 1-3 1v-5l-11 1-9 2h-9l-1-4h-7v5h-11l-18-3h-30l-1 3-1-2-5 2v3h3l-1 5-3 1-16 1-3 1h-15v-2l2-1 16-1 8-1v-2l-32-1v-2h-9v2H82l-12-2 2-5 8-1-15-1 1-5h8v2h7l1-4-15-1v-3l8-3-1-4 1-1h7v-2h10v-3H72l-2-1v-3l8-3-2-4h13v-2H77v-2l5-3h3l1-5h6l-1 8h4l1 6h-2v3h-4v2l10-3 4-3 8-1v-3h4l1-3h3l-2-6 5 1 5 3h3l-8-4-3-3-8-5v-2h-2v-2h-2l-3-8v-10l1-3-3-1-2-18-3-3-4-1-2-3-10-3-2-1h-7l-5 1-2 4-3 7-7-1v-2l-16-1-1-1v-20l-3-1-2-3v-3l-8-2-2-2-16-5-7-4-1-4 14 3 2 4h8l1-5h3v-9l-4-2v-2l10 1 5 2 2-6 3-2 2-6 3-1 4 2-5 1-1 4h18l-1-4 2-2 4 2v2h2v2l2 1h3l3-1v-8l3-5 3-1 2-6 8-4h17l2 3 4 1v-4l5 1 3 1v7h3l1 10-1 4 1 1v6l6-3v15l5 5v1l-9 3-5 2h-3l-1 3h15l-3 2-3 1h-10v3h19l7-2 5-2h4v-2h2v-2h-4l2-4 1-1 19-2 1-4 3-3 3-5 1-5-6-2-2-1v3l-7 1 2-10h9v3l6-1 3-2 1-3h3v-3l2-1 15-2-3-2 5-2 1-6v-4h3v2l6 2 3 1 1-2 4 1-3 10-1 4h5l3-4h3l2-4h6l1 4 4 2v9l5 1 1 6 5 1 2 1v2h3v2l4 1v4h4v2l9 2h3v7h30l1 2 9 1h10l-2-4-3-3 1-3 10-3 11-1 1-1h7v7h-3l1 6 5-5 2-2 3-2-3-5h8v-2l13-1 3-6h11l5-5 4-1 1-7 10-5 2-4 4-1 19-1-4-2-1-2 2-1-5-1v-4l-4-1 12-1 2-4h3v-2l-4-1-2-16 1-11 4-2 1-3 3-1v-4l-5-1zm27 215z'/%3E%3Cpath fill='%231a2b90' d='M654 134h2v2l16-2v7l-3 1-1 2h10v237H507l-3-5v-3l-5-1-3-2v-2l-5-1-1-3h-2v-2l-4-2v-2l-4-1-1-4-5-2v-2h-15l-9-2-2-1v-2l-4-2-4-4v-2l-5-2v-3l-6-1-3-2v-2l-4-2v-2l-9-3-5-3v-2h-4l1 5-4 3h-2v-2l-5 4h-3v2h-2v4h-2l-1 4-2 3h-12l-4-1-5-6v-2h-3v-7l-5-2-2-4-5-1-6-5-6 1v7l-4 1v3h5l-1 5 7 1 1 4-10 5 11 3 1 5-2 1h-6v3l6 2 1 3-1 2h-13l-1 13-4 5h-3v-2l-4-1v-2l-5-2-7-3v-14l5-13h2l2-6h2v-4h2l-1-9-2-3 1-5h5l-3-9-8-2v-2l-12-1-4-2h3v-2l11-1 2-2h4l2-4 6-1 2-5 5-6 2-1 4-10h5v10l5 2 6 7 5 4 6 2v2l7-1-1-7v-16l2-8-4-1v-2h6l4 2 1-5h4v-9h-13l-7-1v3h-3l-1 6h-2l-1-3v-12l1 3h3l1-10h3v-9h-2v-7l2-2 14-1 10-1 1 12 2 7v6h-11v2h4l4 14h9l2 1v3h11v3h-12l4 7 1 20 2 11 1 1 3 15 6 4 5 1h23l3-3 10-1 1-1 31 1h19v-3l-27-2v-2h3v-4h-18l-3-4v-2h-2v-2h-3l-1-4 3-1 1-3h12l4 4h2v-6l2-1 1 3 22 1 2-2 10-3 21 1 5-5 5-3 5 1h4l2-5 13-1 1-5-19-1-8-2-16-1-2-2-10-1 4-2 26-1v-2l-5-1-2-1 1-4 9-3 2-3-12-1h-31l-9 1-1 4-4 3-2 5h3v3h-12v-3h-2l-2-8-11-4-6-2-6-3 1 4-38 1-5-1v-5h9l1 3 2 1 1-4 12-1 70-1h45v-3l5-2 3-5 4-3 5-1 2-6 5-2v-12l2-6h2l2 4 2 1v17h2l1-4 17-5h3v-11l1-3h-2v-3h2v-6l8-3h6v3h8l4-6-3 2h-4v-8h-11v-3l6-5h2v-2h2l2-5 3-1 2-4h5v-3l10-2v-5l3 1zM480 279z'/%3E%3Cpath fill='%232240bc' d='M302 10h2l-2 6 8-1-3 1v6l-6 2h-4l-2 5-4 3h-3v2l-7 2-1 4 9-3 4-1h5v-2h5l4-2 9 1v2l14 1v-2l10-1 3-1v-6l5-3 5-1 1-1h6v-2h-8v-2l8-1 1-4h15v3h6v3l-10 1v2l4-1 17 1 7-2 3-2 7 1 3 1v2h-5l1 7 3 1 5 15h2v8l-3 5h-6v10l7-3v4h-3l-1 3-4 2v6l7-1v4h2l1-4 4-4 2 2-1 4h2l-2 6-1 2 1 9v10h2v-3l6 1v2h15l1 3h2l-1 4-1 1-8 1v4h10v1l-6 2 5 2-1 2-19 1-4 1-2 4-5 3-4 1-2 7-6 3-4 4-10-1-2 6-1 1h-13v2l-7 1 3 5-5 3-5 5-2 1v-7h3v-7l-7 1-1 1-16 2-5 1v4l4 3v3l-12 1-7-1-3-2-28-1v-7l-6 1-7-2 1-3h-4v-4l-5-2h-6l1-3v2h3v-2l-7-2-1-6-5-1v-9l-5-2v-4l-7 2-1 2-3 1-3 4-5-1 1-6 2-6 1-2-4-1-1 3h-3l-1-2-6-1 1-3-3 1 1 6-5 5 3 3-19 2v3h-3l-1 4-5 3-4-1v-3h-9l-1 7-1 3 7-1v-3l6 2 2 1v5l-5 8h-2l-1 4-7 2-12 1-3 4h4v2h-2v2l-10 4-6 1h-17l-2-1v-3l13-2-12-1 1-4 7-1 5-3 4-1v-2l-4-2-1-1v-14l-2 2h-3l-2-9 1-2v-10h-3v-7l-4-1-4-1v4l-5-1-1-3-17 1-6 3h-2l-1 4-5 5-2 11h-1l-1-10-2-1 3-7 2-2h2v-4l4-3 1-4-4-1h10v-3h13l6 1-3-4 2-3 4-1 12 2-2 2h-5l-1 6h2v2h5l5 5 1 8 5 1 1-4h2l1-3-4-1-2-3-5-5v-1h5l2-9 5-3-1-3 6-2 3-3 2-5h7v-3l6-2 1-1 14-1 3 2v2l-4 1v2l-10 3-8 2-2 9 2-1 22-1 1-2-9 1h-9l-1-3 5-1 5-2v-4h11v-4h9l-1 2 9-2 5-2 4-1h3v-6l3-6-7-1v-3l4-1 1 2 3 1v-2h4v-4h2v2l4 1v-3l-3-1v-3h3v-2l4-2 7 1 4-1v-2h-5v-4l5-3 1-2h3l2-5 3-2h7l3-3h8v-4h10l1-3h5v-2h8v-6h3l1-5zm94 9zm-122 7zm4 0zm-12 4zm159 42zm-297 31z'/%3E%3Cpath fill='%231b298e' d='M564 0h114v106l-5 3-3 3h-2l1 5-4 2v3l-2 1 1 4-4 1v2h-6l2-9-1-3 2-1 1-9-4 2h-5l-1 4-5-1-1-1v-5l6-3 2-3h-3v-4l-5 1v-2h3l1-10-1-4h-2l-2 10-2 4-5 1-2-1-8 1-3-1-1 3h-4v-3l5-2 2-5 2-2-1-3h-7l-1 4h2v3h-2v2h-8l-4-1-5 2v2h-3v2l-3 1h-10v2h3v3l-2 1h-12l-2-2 1-1 10-1-2-5 4-1 1-4-13 3-16 1-2-2-15-1v-4l-7-2-7-3v-4h-4v-2l-4-2-3-3-1-2V57h2l-1-12-1-1V34l2-6h3l1-7 2-1v2h5l1-7 5-5 5-3 5-2 4-1v4l2-1h10V5h2l1-3z'/%3E%3Cpath fill='%23181637' d='M280 276h4v4h2v2h2l2 5 6 2v5l16 2v2l8 1 3 8v2h-5v5l2 3v9h-2v4h-2l-1 4-1 2h-2l-1 5-3 8-1 14 5 1 7 4v2l4 1v2l5-3 2-8 1-7h13v-5l-6-2v-3l8-1-1-4-12-3 3-3 7-3v-4l-7-1v-4l-4-1v-3l4-1v-7l7-2 6 6 4 1 5 5 2 1v7h3l5 6v2h16l3-6h2v-4h2v-2l5-3 3-1v2l5-4v-4h4v2l5 2 9 4 5 6 8 3v3l5 2 6 7 2 1v2l12 2 14 1v2l5 2 1 4 4 1 4 4v2h2l2 3 4 1 3 3 5 2 3 5v3H193v-3h2l2-5 4-5h2v-4h5v-2h2v-2h2v-2h2v-2l4-2 3-6 8-4 1-2h2l2-4 3-2h3v-2h2v-2l6-2v-2h3v-2l4-2 1-2h2v-2l5-2 5-3v-8l7 1v-2l-6-1 2-1-1-2-2-2v-5l-2-1v-2h-2v-4h2v-4h3l1-4 2-3z'/%3E%3Cpath fill='%23131549' d='M654 134h2v2l16-2v7l-3 1-1 2h10v237h-97v-3l7-2 8-1 20-1 8-1-4-1 1-5-6-2-10-1v-3l6-2h5l1-1 18-1 9-2v-3l8-1v-3l-4-1-1-2-12-1-3-1h-16v-2l-33 1-1 2h-18v-3h4v-2l3-3 13-1v-2l-16-1-24-3v-6h31v-2l-8-1v-3l-7-2v-2l7-1 3-2h46l1-4 2 1v-2l-7-3h-9l-3-2v-3l8-4 8-1-1-3h2l2-6 3-1v-2h2v-2h15v-2l-5-1 1-7 1-2 4-1h9l1-3h3l1-8 3-11 2-19 1-20-3-3v-5l-11 1-6 2-10-1v-3l-6 2v-2h-2v8l-4 2h-5v-3l-2 1-1 7-21 3-2-1 2-4 17-5h3v-11l1-3h-2v-3h2v-6l8-3h6v3h8l4-6-3 2h-4v-8h-11v-3l6-5h2v-2h2l2-5 3-1 2-4h5v-3l10-2v-5l3 1z'/%3E%3Cpath fill='%232747c1' d='M604 98h2l-2 7-1 2 9-3 1-2 6-1 3 1 12-3 6-1v2h-2v2h-2l-1 4-7 2-1 2h-5l-2 4-3 3v10l3-1v5l-4 1v-3l-5 2h-5v-3h-3l-1 4 4 1v3l16-1 4-3h3l1 6-4 1v6l-1 1h-5v-2h-3l-2 5-5 2-1 2-9 3-7 1-1 1h-8v2l-5 1-1 5h-2l-1 4h-5l-2 5-4 1-2 3h-2l-1 4-7 6-2 4-4-1 2-4 2-7-9 1-2 4-6 3-5 3-11 2h-10l-3-1h-28l-2-7-4-2-14 1-15-1h-6l2-4 5-2 1-2h2v-2h12l1 3 8-1h9v3h6l1-3h2v-8l4-1 1 4 10 2v2h-3v2h2v2h-2v3l20 2v-2l7-1 1-4 4-9v-8l-2-10-3-5-6-5-5-1h-8l-2 2v5l-6 2h-3l-2 4-4 2h-7v-2l-5 2h-4v-2l-9 2 2 16-8 1-2-1v-2h2v-12h-3l1-4 8-3h2v-4l-8 1-2-2h2v-3l7-2 1-3-9 1-7 2-1-6 4-4h4l1-1 9-1-1-4 4-7 9-1 5-3h2l-1-10h2v-3h3v6h2l1-5 4 2 2 7 5-5 2 1-5 6 7 1 1 6 15 1 5 1v-3l-12-1-2-5-2-2v-3h2v2l4-1 3 1 1 4h2v-5h9v2h-6v6h5l8 3 2 4 3 1-1-3h6l-1-6v-2l-1-5h15l6 2v3h7l1 4 10 1v-4h-6v-2h4l-1-4 7-1h10v-2l3-2z'/%3E%3Cpath fill='%23241855' d='M384 207h4l1 12 2 7v6h-11v2h4l4 14h9l2 1v3h11v3h-12l4 7 1 20 2 11 1 1 1 18 4 1 5 2 14 3 1 5 5 1 1 3 13 1 6-1 2 1h34v2l8 1v2l2-1 9-1 3-1h5v2l-16 2-1 6-11 1-6-1h-17l-5 1-1-3 2-1 24-1v-2h-14v-3h-24v4l8 5 5 2 1 3 8 3v1h-13l-9-2-2-1v-2l-4-2-4-4v-2l-5-2v-3l-6-1-3-2v-2l-4-2v-2l-9-3-5-3v-2h-4l1 5-4 3h-2v-2l-5 4h-3v2h-2v4h-2l-1 4-2 3h-12l-4-1-5-6v-2h-3v-7l-5-2-2-4-5-1-6-5-6 1v7l-4 1v3h5l-1 5 7 1 1 4-10 5 11 3 1 5-2 1h-6v3l6 2 1 3-1 2h-13l-1 13-4 5h-3v-2l-4-1v-2l-5-2-7-3v-14l5-13h2l2-6h2v-4h2l-1-9-2-3 1-5h5l-3-9-8-2v-2l-12-1-4-2h3v-2l11-1 2-2h4l2-4 6-1 2-5 5-6 2-1 4-10h5v10l5 2 6 7 5 4 6 2v2l7-1-1-7v-16l2-8-4-1v-2h6l4 2 1-5h4v-9h-13l-7-1v3h-3l-1 6h-2l-1-3v-12l1 3h3l1-10h3v-9h-2v-7l2-2 14-1z'/%3E%3Cpath fill='%23111b5d' d='M580 190h2l2 4 2 1v13l1 4 2 1 1-3 1 2 13-2h6v-7l3-1v3l9-2v-8l3 1 5-1v3h10l6-2h11l2 6 2 2-2 31-3 16-3 11-3 1-1 2-13 1-2 9 5 1v2h-15v2h-2v2l-3 2-3 6 1 3-9 1-6 3h-2v3l7 1 8 1 1 1 8 1v1h-5v2l-31-2-21-3 1-4h4l1-5 11-1-2-3 2-7 2-2h4v2h6v-2l6-3 1-10h-3v-2h-16v-2h-3v-2h-5v-2l2-1h22v4h7l4 1h13v-5l-10 1-3-1v-2h-3v2l-8-1-2-1v-2l-26 1-1 1h-7l-1-4h5v-2l26-1 1-4h2v-2l2-1 1-3h4v-3h-4v2l-10 1-6 2-10 1-6 2h-8v3l-17 2-4-1 1-4 9-3 2-3-12-1h-31l-9 1-1 4-4 3-2 5h3v3h-12v-3h-2l-2-8-11-4-6-2-6-3 1 4-38 1-5-1v-5h9l1 3 2 1 1-4 12-1 70-1h45v-3l5-2 3-5 4-3 5-1 2-6 5-2v-12z'/%3E%3Cpath fill='%232943b3' d='M240 239h12l2 2-1 2-8 1v2l8 1-4 1-1 2-6 2-6 4-1 9 7-1v-2h6v7l-4 1v2h-2v3h-2l2 4v3l7-3 5-1v4l5 1 3 1 2 9 3 13v4l-7 2-9 1-3 1v-5l-11 1-9 2h-9l-1-4h-7v5h-11l-18-3h-30l-1 3-1-2-6 1 3-6v-6l-1-1-10-1v-2h2v-2h2v-7l-4-1 1-8 4-3 1-7h-8l4-2v-7l17-2 1-1h15l4 1 2-3h2v3l2-2h19v-2h17v-4l11-4 4-2v-2z'/%3E%3Cpath fill='%23c59c3c' d='M564 0h35v2l5 1 1 9h3v3l6 1v2h2l1 8-2 7h-2l1 5v14l-2 1-2 9h-2v3h-2l-1 5-8 4-2 7-5 2-2 6h-23v3h-7v-6h-4v2l-7-2v-5h-4l-1-4-2-1-2-13-7-2 4 6v3h-3v-4h-2l-6-10-2-8V30h2v-4h2l1 6 1-6 1-10 6-1v6h2l1-5 5-1 1 3 2 1v-7l4-5h7V5h2l1-3z'/%3E%3Cpath fill='%233e54a2' d='M504 138h8l7 2 2 4 4 2 2 4 2 10v8l-4 8 2 1-3 1-1 3-7 1v2h-12l-8-2v-3h2v-2h-2v-2h3v-2l-8-1-2-1-1-3h-4v8h-2l-1 4-6-1v-3l-17 1-2-2-11-1v2h-2l-1 3-5 2-1 2h12l15 1 7-1 5 3 2 6h27l3 1h10l14-3 5-4h3l2-5 9-1 1 2-3 7-1 3h3l3-5 6-5 1-3 4-4h4l2-5h5l1-4 5-2h5v4l6-1 6 1-1 2h-2l-1 3h-2v3l-7 2-10 5-5-1v-3h-2v2l-3 3h-4l-1 3-3 1-3 5h-2v2l-3 1 17 2v3l-6 2v5h-3l-1 4-6 4-10 2h-15l-4 2h-25v-5l-26-1-3-2v-2l-10-2-2-5h-12v-3l-3 1 2-5h-10l-1-6-7 2-10 2-3 2v-4l-2-1-1-4-8 1-3-1-2 6-8 1-1-3 9-4 5-3h2v-4h-5l3-4h8v4h8v-4l5-3 15-2 6-3h9l5 2h8l-2-6v-10l4-2h5v2l5-2h4v2l8-1 5-5 8-2v-6z'/%3E%3Cpath fill='%231b2d90' d='M267 307h1v5l-4 3-7 2-1 1-8 1-6 2-4 8-5 4-9 1-1 5-8 7-10 5-3 1-1 3-6 2-1 3h-2v2h-13l-10-3h-9l-8 2-24-1-3 1-11-1 1-5 1-1 22-1v-2h-2v-2h4v-2h9v-2l-20-1-10 1-2 2 5 3v2h-18l-14-4-7-1v-2l2-1h11v2l10 1 1-5h-3l1-5 7 1v-10l-5 1-3 1-1-2h-4l-5 3-4-3-2 1-2 3-6 2H54l-3-1-1-2-2 1v-10l5 2h3v-2l24-2 2-2 7-1v-1h6v-2h9v2l5-1 21 1 6 1v2l-8 2-18 1v2l15-1 3-1 16-1 3-1 1-4h-3l-1-4 6-1 1 1 1-2 32-1 16 3h9l2-4h7l1 4 16-2 2-1h11v5l3-2 16-2z'/%3E%3Cpath fill='%231e42b7' d='M508 236h31l13 1-4 6-8 2-1 3 7 2v2l-26 2 8 1v2l16 1 8 2 19 2v5l-1 1-13 1-2 5h-4l-6-1-5 4-4 4h-9l-12-1-10 3-2 2-22-1-2-3v7l-4-1-3-3h-12l-3 4 1 2 3 1-1 2 4 1 1 4 18 1v4h-3v2h16l11 1 1 2-1 2-3 1h-16l-31-1-1 1-10 1-3 3h-23l-9-3-3-3-3-15-2-6-1-6v-20h1l1 20h28v-2h-16v-2h-2v-4h4v-2h25l1-3 13-2 1-3h22v-3h24v2l24 1v-2h8v-2l-27-1v-1h-41v-3l-54 1v-3l10-2 56-1-2-4v-4h-2l1-2 4 4v6h2v3h12v-3h-3l2-6 4-2 1-4zm-28 43z'/%3E%3Cpath fill='%2334448d' d='M654 134h2v2l16-2v7l-3 1-1 2h10v122h-2l-2 4-13 10-10 6-1 1-17 3v-2l7-6 3-6 5-2 3-12h2l1-8 3-11 2-19 1-20-3-3v-5l-11 1-6 2-10-1v-3l-6 2v-2h-2v8l-4 2h-5v-3l-2 1-1 7-21 3-2-1 2-4 17-5h3v-11l1-3h-2v-3h2v-6l8-3h6v3h8l4-6-3 2h-4v-8h-11v-3l6-5h2v-2h2l2-5 3-1 2-4h5v-3l10-2v-5l3 1z'/%3E%3Cpath fill='%23273388' d='M125 206h19v2l-14 3-5 6-1 4v14l2 11 3 10h2v2l6 1 1-3h2v-2l4-1v2l3-1 1-2h-17l-2-1 1-2 5-1h49l33 1v4h-17v2l-18 1-3 1v-3h-2l-2 4-4-1h-15l-1 1-16 2v6l-1 1 4 1v7l-4 3-1 8 3 1v7h-2v2h-2v2h10l2 2v6l-3 5v5h3l-1 5-3 1-16 1-3 1h-15v-2l2-1 16-1 8-1v-2l-32-1v-2h-9v2H82l-12-2 2-5 8-1-15-1 1-5h8v2h7l1-4-15-1v-3l8-3-1-4 1-1h7v-2h10v-3H72l-2-1v-3l8-3-2-4h13v-2H77v-2l5-3h3l1-5h6l-1 8h4l1 6h-2v3h-4v2l10-3 4-3 8-1v-3h4l1-3h3l-2-6 5 1 5 3h3l-8-4-3-3-8-5v-2h-2v-2h-2l-3-8v-10l8-16 6-4 5-2z'/%3E%3Cpath fill='%2345589e' d='M218 144h19l3 7 1 3 6 1v4h5v4l-5 3-1 2h2v2l5-2h6v2h5l4-2v7l-8 3-2 1h10l4-3 3 1 2 6-7 3-5 1h-9v2l5 1 15 3 4 3v3h8v1l-11 2-5 2-32-2v-3l-16-1-8-1-1-2-6-2-17-1v-4h8l2-4-1-6-1-4h-2l-1-4v-8h3l1-7 7-6 8-3z'/%3E%3Cpath fill='%23595e8b' d='M581 164h5v4l6-1 6 1-1 2h-2l-1 3h-2v3l-7 2-10 5-5-1v-3h-2v2l-3 3h-4l-1 3-3 1-3 5h-2v2l-3 1 17 2v3l-6 2v5h-3l-1 4-6 4-10 2h-15l-4 2h-25v-5l-26-1-3-2v-2l-10-2-2-5h-12l1-4 2-3 7-1v-1l-5-1v-2l6-3h12l1-2h5l2 2v4l-5 1v2h2v2h3l1-3 9-1h33l14-3 5-4h3l2-5 9-1 1 2-3 7-1 3h3l3-5 6-5 1-3 4-4h4l2-5h5l1-4z'/%3E%3Cpath fill='%232c46c1' d='m48 137 5 1v1l-5 1-1 4h18l-1-4 2-2 4 2v2h2v2l2 1h3l2-1-1 5-4 3-1 4h4l3 7v9l1 6-1 6h2l1 6h5v2l3 1v7l-9-2-2-1h-7l-5 1-2 4-3 7-7-1v-2l-16-1-1-1v-20l-3-1-2-3v-3l-8-2-2-2-16-5-7-4-1-4 14 3 2 4h8l1-5h3v-9l-4-2v-2l10 1 5 2 2-6 3-2 2-6z'/%3E%3Cpath fill='%2364677d' d='M564 0h35v2l5 1 1 9h3v3l6 1v2h2l1 8-2 7h-2l1 5v14l-2 1-2 9h-2v3h-2l-1 5-8 4-2 7-5 2-2 6h-23v3h-7v-6h-4v2l-7-2v-5h-4l-1-4-2-1-2-13-7-2 4 6v3h-3v-4h-2l-6-10-2-8V30h2v-4h2l1 6 1-6 1-10 6-1v6h2l1-3v4l-4 1v8l-3 1v6l-3 8 1 6 5 1v2h5l2 6 3 3h10v-2h4v2h2v3h8v3h-6l-2 5 3-1h7l1 1h13l8-4 2-4h2v-2l2-1v-6h2l1-5h-2l1-4-7-1-1-4 2-5h-2l-1-13 1-4-4-1-2-2v-8l-13-3h-8l-8 1-3-2h3V5h2l1-3z'/%3E%3Cpath fill='%23336bde' d='m455 232 7 3 6 2 8 3v2h2l2 8-8 1-48 1-10 1v3l10-1h44v3l12-1h32v1l22 1 2 1v2h-8v2h-18l-6-1v-2h-24v3l4 1h-16l-10-1-1 4-13 2-1 2h-25v2h-4v4h2v2l8-1h16v1h-8v2l-5 2-1-1-22-1-1-2v-18h-2l-3-4v-3h12v-3h-11v-3l-3-1v-3h7v-2l2-1h7l-1-7 8 2 37-1z'/%3E%3Cpath fill='%23f1d814' d='m631 159 10 1 8 3 13 5 12 8 4 3v87h-2l-2 4-13 10-10 6-1 1-17 3v-2l7-6 3-6 5-2 3-12h2l1-8 3-11 2-19 1-20-1-1-2-16-9-15-3-2v-2l-3-1v-3l-7-1z'/%3E%3Cpath fill='%2311164e' d='M155 212h2v11h3l1-4h2l1 4 4 2 1-8 5-1 3 10 9 2 1-8 4 2 4 9 5 2 8 1 46 2v1l-6 2-16 2v2l-6 4-7 2h-84l-5 1 1 1h13l4 1-1 3-7-1v2l-3 3-6-1v-2h-2l-4-10-2-11v-11h4l1 4 10 1v-4l9-4h5z'/%3E%3Cpath fill='%2375528d' d='M337 261h5v7h-2v-3h-3l-1 9-9 11-6 4 1 3h3l1 4-1 9 2-1 13-1v-6l6 3v4h9l-1 3h-8l8 4 5 5 1 3h2l2-4 7-3h5v-3h3v-2h4v12l-4 2-5-1-5 6-1 3h3l-2 4h-3l-3-3v-2h-3v-7l-5-2-2-4-5-1-6-5-6 1v7l-4 1v3h5l-1 5 7 1 1 4-10 5 11 3 1 5-2 1h-6v3l6 2 1 3-1 2h-13l-1 13-4 5h-3v-2l-4-1v-2l-5-2-7-3v-14l5-13h2l2-6h2v-4h2l-1-9-2-3 1-5h5l-3-9-8-2v-2l-12-1-4-2h3v-2l11-1 2-2h4l2-4 6-1 2-5 5-6 2-1z'/%3E%3Cpath fill='%23312887' d='M384 207h4l1 12 2 7v6h-11v2h4l4 14h9l2 1v3h11v3h-12l4 7 1 20 2 11 1 1v7l-2-1-3-15-1-23-6-2-5-1-3 1v2h4l1 18 1 4h2v2h3l1 6-4 2v2h2l2 3-1 6-3 3-11-2v-5l-4 1-2-2-5-2v-6h-5l-1-4 5-1-1-7v-16l2-8-4-1v-2h6l4 2 1-5h4v-9h-13l-7-1v3h-3l-1 6h-2l-1-3v-12l1 3h3l1-10h3v-9h-2v-7l2-2 14-1z'/%3E%3Cpath fill='%23172788' d='M59 360h33l15 3 8 4 9 1v3h28v-2h2v-2l6-1h22l-2 5-3 2-1 3h-2l-1 5H44v-6l-7-1-2-4h13l4 1v2h12v3l2-4 14-1v-3H43v-5l5-2z'/%3E%3Cpath fill='%23425272' d='M131 0h23l-1 7 12 2 1 4-1 3h2l2 3 1-1h8v11l-2 5-5 1-2 4-1 3-6 3-10 2h-11l-10-7-8-2-3-4v-2h-2l-2-6v-9l3-5 13-2-1-3z'/%3E%3Cpath fill='%230f1861' d='M569 310h47v2l3-1 2 9 3 1 1 4 2 1v7l-2 3 7-1 2 6h2v2h-20v-2l-33 1-1 2h-18v-3h4v-2l3-3 13-1v-2l-16-1-24-3v-6h31v-2l-8-1v-3l-7-2v-2l7-1z'/%3E%3Cpath fill='%234a589b' d='M542 4h3v4l5-1-3 5-1 7-3-1v-3l-5 1-1 5h-2v-6l-6 1v13l-2 4-1-1v-6h-2v4h-2l1 18 3 10 4 6v2h2v4l3-2-4-5v-2l7 1 2 4v10l3 1v4h4v5l5 1 2 1v-2h4v6h7v-3h23l1-6 6-3 2-7 4-2 3 1-1 2 3-1 2-3 4 1-1 5h2l-1 6-1 3h-2l-1 4-7 5h-2v2h-3v2l-3 1h-10v2h3v3l-2 1h-12l-2-2 1-1 10-1-2-5 4-1 1-4-13 3-16 1-2-2-15-1v-4l-7-2-7-3v-4h-4v-2l-4-2-3-3-1-2V57h2l-1-12-1-1V34l2-6h3l1-7 2-1v2h5l1-7 5-5 5-3 5-2z'/%3E%3Cpath fill='%234e77dc' d='M194 196h12l2 2v15l11-1 5 1 1 6h6v3h-6v7l9-3 3-2 11 1v2l8 1-1 4 2 1-1 1h-56l-6-3-5-10-2-1-1 8-9-2-3-8v-2l-4 1-2 8-5-2v-4h-2l-1 4h-3v-12l6-2 1-7h-4v-2h2v-2h12v2h4v2l10-1 6-2z'/%3E%3Cpath fill='%23515a82' d='m119 120 5 1 2 4 1 11-1 9 3-1-1 10-4 2-3-1-1 4-2 6h-11v-4l-19 1-7 1-1-1v-5l3-4 1-19 3-3h4v-5l6-4h17l5 2z'/%3E%3Cpath fill='%23515685' d='M86 260h6l-1 8h4l1 6h-2v3h-4l1 3h5l1 2h2v-2l9-1-2 4-3 1-4 8-17 2v1l9 2 9 1v4h-2v2l4-1v2h10v2h-3v5l19-1 16 1 1 4h3l-1 5-3 1-16 1-3 1h-15v-2l2-1 16-1 8-1v-2l-32-1v-2h-9v2H82l-12-2 2-5 8-1-15-1 1-5h8v2h7l1-4-15-1v-3l8-3-1-4 1-1h7v-2h10v-3H72l-2-1v-3l8-3-2-4h13v-2H77v-2l5-3h3z'/%3E%3Cpath fill='%234b5680' d='M218 144h19l3 7 1 3 6 1v4h5v4l-5 3-1 2h2v2l4 1-5 5h-9l-4 4h-2v5h-7l-4-4v-2h-8l-7-1-1-14-1-1v-7l4-7 8-3z'/%3E%3Cpath fill='%238e7e5e' d='M532 15h3v6h2l1-3v4l-4 1v8l-3 1v6l-3 8 1 6 5 1v2h5l2 6 3 3h10v-2h4v2h2v3h8v3h-6l-2 5 3-1h7l1 1h13l8-4 2-4h2v-2l2-1v-6h2l1-5h-2l1-4-7-1-1-4 2-5h-2l-1-13 3-5h2l1 5 2 1v3h4v9l3 3v7l-2 6h-2v11l-6 3-1 3h-2v6l-1 1-11 2-5 3h-14l1-6-7-1v2l4 1-4 1h-13l-1-4-2-1-2-13-7-2 4 6v3h-3v-4h-2l-6-10-2-8V30h2v-4h2l1 6 1-6 1-10z'/%3E%3Cpath fill='%23371261' d='M280 276h4v4h2v2h2l2 5 6 2v5l16 2v2l8 1 3 8v2h-5l-1 9-3 4h-5v-12l-4 1-1 3h-8l-6-1h-10l-8-2-4-4 7 1v-2l-6-1 2-1-1-2-2-2v-5l-2-1v-2h-2v-4h2v-4h3l1-4 2-3z'/%3E%3Cpath fill='%23152469' d='m356 215 4 1v5l-3 2-2 6-1 14 2 7v2h6v3h-35v-2l15-1-7-12-10 1v-2l-3 1h-14l1 9h-3v-9h-9l1 5v7l-1-2h-2v-2l-7-1 2 9-1 7-8 1v-8l-3-16-1-4 1-12 1-2h3l1-4h4l2 6 5 1 1 9 1 3 4-2 20-2h26v-3h3v-4h2l1-3h2z'/%3E%3Cpath fill='%234e72d5' d='m0 160 14 3 2 4h8l1-5 3-1h12l5 5 1 5 5 2-1 6h-2l-1 5 4 2 7 9 4 1v-4h2v-2h2l1-3h2v-5l11 1 3 3v4h5v2l3 1v7l-9-2-2-1h-7l-5 1-2 4-3 7-7-1v-2l-16-1-1-1v-20l-3-1-2-3v-3l-8-2-2-2-16-5-7-4z'/%3E%3Cpath fill='%2332438d' d='M453 64h5l3 3 11 1 5-1 3 8 3 8 1 5h4v3l-3 2-1 3-3 1-1 3h-2v3l-7 4-5 1h-16l-2-5-1-12 1-11 4-2 1-3 3-1v-4l-5-1z'/%3E%3Cpath fill='%232655c5' d='M177 254h2v3l2-2h19l3 2v5h2v-6l10 2 1 3 5 2 1 3-2 4h2v2h2v2h-2l-1 4-3 2-1-1-7-1-1-8-1 1-21-1v6l-7 2v2l10 4 1 4-3 2h-3l-1 6h5l-2 2h-11l-12-2v-3l4-2 6-1v-3h2v-2l-8-1-2-1v-6h11v-2h-6v-17h5z'/%3E%3Cpath fill='%2328245d' d='M337 261h5v7h-2v-3h-3l-1 9-9 11-6 4 1 3h3l1 4-1 9 2-1 13-1v-6l6 3v4h9l-1 3h-8l8 4 5 5 1 3h2l2-4 7-3h5v-3h3v-2h4v12l-4 2-5-1-5 6-1 3h3l-2 4h-3l-3-3v-2h-3v-7l-5-2-2-4-5-1-6-5-6 1v7l-4 1v3l-10 3-2 1-2-10-1-4 1-2h5l-3-9-8-2v-2l-12-1-4-2h3v-2l11-1 2-2h4l2-4 6-1 2-5 5-6 2-1z'/%3E%3Cpath fill='%232e2f56' d='m268 311 1 4-7 5h-4v2h-2l-2 4h-3v2h-3v2l-6 2v2h-2v2l-6 3-2 3h-2l-2 4-7 3-3 6-4 1v2h-2v2h-2v2h-2v2h-5v4l-5 5-3 5h-2v3h-20l1-5h2l1-4 4-4h3l1-4 3-2h4v-2l6-5h3l1-4 11-5 6-4 4-4 1-4 11-3 5-7 2-4 6-2 8-1 2-2 7-2z'/%3E%3Cpath fill='%231e3196' d='M208 234h54v5l-3 1v5l3 1 1 6 4 1 2 1-1 10h-2v2h2l1 4 3-3h3l-1 3-5 2-1 4h-2l-2-9h-3l1 7-2 1-1 3h4l-1 6-5-1-3-1v-4l-7 3-5 1-2-4v-3h2v-3h2v-2l3-1 1-7h-6v2l-7 1v-9l5-4 6-3 3-1-4-2v-2l8-1-1-3-4-2 1-1-41-2z'/%3E%3Cpath fill='%2320244e' d='m650 262 1 2-3 10-5 3-3 6-5 5h-2v2l10-3h5l1 3h4l1 3-6 1h-12l-12-1 1 3 9 1v2l-4 1 2 1 14 1 7 2v1l-5 1h-11l-1 4h-19v-3h2v-2l-7-3h-9l-3-2v-3l8-4 8-1-1-3h2l2-6 3-1v-2h2v-2h15v-2l-5-1 1-7 1-2 4-1h9z'/%3E%3Cpath fill='%23505fb5' d='M395 180h7v4l-6 3-4 3-5 1v3l7-1v3l-8 3-12 3h-4l-2 6h-7v1l-23 1-1 1-18 1-1 4h-12l-4-13-8-2v-1h12l14-1h11l-1 5 6 1v-3l28-2 2-3 5-1 1-3 11-2 3-5z'/%3E%3Cpath fill='%23e9d228' d='M125 206h19v2l-14 3-5 6-1 4v14l2 11 3 10h2v2l5 1 2 5-5 1-10-5-3-3-8-5v-2h-2v-2h-2l-3-8v-10l8-16 6-4 5-2z'/%3E%3Cpath fill='%232236b3' d='M88 361h8l13 3 6 3 9 1v3h28v-2h2v-2l6-1h22l-2 5-3 2-1 3h-2l-1 5h-21l-7-1-1-3h-11l-1 1h-16l-1-2h5l2-5h-10v5l2 1h-10l-8-1v-4l5-1v-2h-7l-4-5-2-1z'/%3E%3Cpath fill='%233850ab' d='M626 163h7l7 3v10h2v7l-8 1v9l-4 5v-3l-6 2v-2h-2v8l-4 2h-5v-3l-2 1-1 7-21 3-2-1 2-4 17-5h3v-11l1-3h-2v-3h2v-6l8-3h6v3h8l4-6-3 2h-4v-8h-11l3-2 5-1z'/%3E%3Cpath fill='%2378643b' d='m644 313 16 2 1 2-13 1h-11v2l-7 2v2l5-1h13l5 1v-2h11v4l-13 3 7 2v2l12 3 1 3-9 2h-4v3h-23l1-3h-2l-2-6-7 1 2-10-3-1v-10h20z'/%3E%3Cpath fill='%233a53a7' d='M300 64h9l3 3v7l-4 4 1 4 7 3 1 2-1 9-4 1 5 5v10l3 1-11 6-8-1-5-2 1-16 1-2h10l-3-7-4-2-1-6 3-3v-2h-5l-3-4v-7z'/%3E%3Cpath fill='%233047a4' d='M368 28h10l6 2 1 3-3 8v3l-7 1-3 3h-2v-4l-1 1v7l-1 4-10 2h-5l-3-5-5-5-1-1V36l1-1 15-1v-4h8z'/%3E%3Cpath fill='%233f7cd7' d='M508 236h31l13 1-4 6-8 2-1 3 7 2v2l-10 1h-24l-2-1v-2h-10l-6-2 1-5 3-1 1-4z'/%3E%3Cpath fill='%234d98f0' d='m455 232 7 3 6 2 8 3v2h2l2 8-8 1h-59l-1-8 2 1 1-6 13 1-2 1 1 4 10 1v-4l19 2-1-4-31-1v-1l32-1z'/%3E%3Cpath fill='%231d43b6' d='m388 207 4 1v2h2l2 5 5 4 5 1 2 8 3 2h9v-5h2l2 6 3 1-1 4-3-1v-3l-8 1-2 3-2-1 1 7-9 1v2h-7v2l-3 2h-5l-3-9-1-6h-4v-2h11l-3-13z'/%3E%3Cpath fill='%238a7647' d='M144 10h16l5 3 1 3v14l-1 3-7 2-2 6-9-1-5-1v-3h2v-4h-4v-2l-6-1v-7l4-2 1-4h2v-2h3z'/%3E%3Cpath fill='%231b1e4d' d='M658 347h14l6 1v21l-14 1-4-2-1-1h-8l-1 1h-6v-3l-4-1-1-4-2-2 5-3h2v-3l13-3z'/%3E%3Cpath fill='%23243da3' d='m583 183 2 1-1 5-1-3-4 1v2l3 1h-2l-2 18-5 3-2 6-7 2-3 3-2 4-5 1v3h-32l3-1v-2l3-1h14v-2h2v-2h3v-2h3v-3l-2-1 8-5 1-3h3v-5l7-2 2-7 2-3 4-1 2-6z'/%3E%3Cpath fill='%2336334c' d='M458 348h9l7 1v2l5 2 1 4 4 1 4 4v2h2l2 3 4 1 3 3 5 2 3 5v3h-24l-1-3-5-5v-3h-3v-2h-2l-2-6-4-2-2-1v-2l-4-1-2-2z'/%3E%3Cpath fill='%2363588b' d='M283 218h4l2 6 5 1 1 9 1 5h22v1h-10l1 9h-3v-9h-9l1 5v7l-1-2h-2v-2l-7-1 2 9-1 7-8 1v-8l-3-16-1-4 1-12 1-2h3z'/%3E%3Cpath fill='%235e5a6e' d='M542 4h3v4l5-1-3 5-1 7-3-1v-3l-5 1-1 5h-2v-6l-6 1v13l-2 4-1-1v-6h-2v4h-2l1 18 3 10 4 6v2h2l-1 4h-2l-7-1-4-7-2-18-4-1v-9l2-6h3l1-7 2-1v2h5l1-7 5-5 5-3 5-2zm-26 39z'/%3E%3Cpath fill='%23505e8f' d='M467 186h5l2 2v4l-5 1v2h2v2h3l1-3 9-1h36l-2 3 6 2-3 3-9 1-4-1-1 5h-6v2h-11v-2l2-1h11v-5l-9-2-7-2-2 4-18 2-1 1h-9l-1-2 2-1h6v-2h-11l-9 2 2-4 7-1v-1l-5-1v-2l6-3h12z'/%3E%3Cpath fill='%235c6187' d='M133 270h7l-3 16 3 1v7h-2v2h-2v2h8v3h-6v3h-3v-2h-4l1 2 12 2v1l-16 1h-11v-2h7v-2l-12-1 1-4 3-3 8-2h6v-2l-15-1v-2h5v-2l2-1 2-7h5l1-6h2z'/%3E%3Cpath fill='%235664a0' d='M177 254h2v4h3l1 10h2l2 4v4l-7 2v2l10 4 1 4-3 2h-3l-1 6h5l-2 2h-11l-12-2v-3l4-2 6-1v-3h2v-2l-8-1-2-1v-6h11v-2h-6v-17h5z'/%3E%3Cpath fill='%23100d61' d='m295 294 12 1 5 1v2l8 1 3 8v2h-5l-1 9-3 4h-5v-12l-4 1-1 3h-8l-7-2v-14z'/%3E%3Cpath fill='%234b5278' d='m632 161 10 3 1 3 6 5 9 15 1 5v10l-2-1v-5l-11 1-6 2-9-1 2-5 1-9 8-1v-7h-2l-1-10-6-2z'/%3E%3Cpath fill='%23273c78' d='M131 0h14l-1 4-2 1-1 5h-5l-2 6h-2v2h-2v4h2l1 10 5 1-1 3-5 1-1 3-8-2-3-4v-2h-2l-2-6v-9l3-5 13-2-1-3z'/%3E%3Cpath fill='%23d0b551' d='M103 132h10l8 2 1 5-3 1v8l-2 1-1 3h2v4h-5v-2l-6 2-1 3-6-2-4-5-1-11 1-4h3l1-4z'/%3E%3Cpath fill='%23827d6d' d='M96 125h17l7 4v2h2l2 4-1 6-1 5h3l2 6h-2v2h-4l-4 6-3 3-6 1v-3l-17-2-3-2v-2h2l-1-5h2l1-6 1-2v-7l2-7zm7 7-4 2v3h-3l-1 9 1 7 5 5 5 1 1-3 6-2v2h5v-4h-2l1-3 2-1v-8l3-1-1-5-10-2z'/%3E%3Cpath fill='%23401260' d='m306 360 1 3 5 1 7 4v2l4 1v2l2 1-1 7h-36v-5l8-8h2v-2l4-3h2v-2z'/%3E%3Cpath fill='%233a3e6e' d='M24 272h8l3 1v2h-3v3l10 1 1 1v5l-5 1v4h-4l-1 3 9 3v1H16l-2-4 6-1v-2l-14-1v-3l5-2h9v-3l8-1v-2l-7-1 3-1v-2l-3-1z'/%3E%3Cpath fill='%23619fe2' d='M322 239h3v2l10-2 7 11v2h-11l-5-1-1-3-1 4h-14v3h-3v-3h-9l-1-12h9v9h3l-1-9z'/%3E%3Cpath fill='%23212e80' d='M80 320h13v2h8v2l-13 2H76l1 2 7 2v3l-4 1H54l-3-1-1-2-2 1v-10l5 2h3v-2z'/%3E%3Cpath fill='%23193ba4' d='m476 240 4 2 1 2v6h2v3h12v-3h-3l1-5 1 3 16 2v2l10 1v1l8 1-2 2-25-1-5-1-82 1v-3l10-2 56-1-2-4v-4h-2z'/%3E%3Cpath fill='%233f4380' d='m512 43 4 1 3 18 3 5v2l7 1 1-2 5 1-4-6v-2l7 1 2 4v10l3 1v4h4v5l5 1 2 1v-2l4 1-1 3h-8l-3-2-9-2-1-4 3 1-1-5-6-1-12-2-6-1-2-4V57h2l-1-12zm4 0z'/%3E%3Cpath fill='%23422763' d='m340 297 6 3v4h9l-1 3h-8l8 4 5 5 1 3h2l2-4 7-3h5v-3h3v-2h4v12l-4 2-5-1-5 6-1 3h3l-2 4h-3l-3-3v-2h-3v-7l-5-2-2-4-5-1-6-5-4 1-2-4 2-3h2z'/%3E%3Cpath fill='%23614075' d='m332 336 13 3 1 5-2 1h-6v3l6 2 1 3-1 2h-13l-1 13-4 5h-3v-2l-4-1v-2h2l2-16 3-10 2-4h4z'/%3E%3Cpath fill='%23585869' d='M564 0h35v2l5 1 1 9h3v3l6 1v2h2l1 8-2-4h-7l-4-4v-2h-3l-1 3v-2l-3-1-2-4-2-1 1 5-1 1h-5l-1-6-3-3-1-3-7 1h-4V3l-8-2z'/%3E%3Cpath fill='%23161487' d='m242 251 10 1 3 9h3l2-9h2l-2 12-2 9-5 2-4 5-3 2h-4l-2-4v-3h2v-3h2v-2l3-1 1-7h-6v2l-7 1v-9l5-4z'/%3E%3Cpath fill='%23374281' d='m621 31 1 3h2v16l-3 16h-3v8h-4l-1 4v-2h-2v-5h-3l-2 3h-3l3-9h2v-3h2l1-9 3-1-1-19 3-1 2 10h2V32z'/%3E%3Cpath fill='%231c35ba' d='M0 90h10l1 5h2l1 6 6 1v-3l10 2 2 4h-6l-2 3 2 1h-2l4 4v2h7l3 4 1 3-4 4-1 2h-6v-6l-4-2v-2l-4-2-4-2v-2h-2v-3h2v-4l-8-1v-2H6l-2-6H0z'/%3E%3Cpath fill='%23796c61' d='m562 1 8 1 2 1v3l7-1 4-1 2 6 3 1v6l5-1v-5l3 1 2 4h6l4 5 7 1 1 5-1 3-4-1-3-2h-3v9l3 2v7h-2l-1-5-3-1 1-9h-4v-3l-3-1v-5l-4 3v-2l-4-1-2-2v-8l-13-3h-8l-8 1-3-2h3V5h2l1-3z'/%3E%3Cpath fill='%232e367d' d='M82 300h8l-2 5h10l5 2 1 5 5 1 1 1 12 1v1h-18v-2h-9v2H82l-12-2 2-5 8-1-15-1 1-5h8v2h7z'/%3E%3Cpath fill='%231b1e60' d='m383 240 4 3 1 5h9l2 1v3h11v3h-12l2 5-4-2v-2l-12 2-1 7-1 1-1 21-1 3h-3l-5-5 1-9h3l2-17 2-6v-2h3z'/%3E%3Cpath fill='%231d194a' d='m644 313 16 2 1 2-13 1h-11v2l-7 2v3h-2v4h19l3 3-2 2-8 2 12 1 2 4h-17v3l-2-1 1-2h-2l-2-6-7 1 2-10-3-1v-10h20z'/%3E%3Cpath fill='%232c459f' d='m307 32 9 1v2l14 1-6 9h-6l2 3 3 1-1 3-10 1-6 5-2-1V41l2-3h-2v-5zm28 1 3 2-8 1v-2z'/%3E%3Cpath fill='%235a6da3' d='M581 164h5v4l6-1 6 1-1 2h-2l-1 3h-2v3l-7 2-10 5-5-1v-3h-2v2l-3 3h-4l-1 3-3 1-1 2h-3l1-4 5-4 1-3 4-4h4l2-5h5l1-4z'/%3E%3Cpath fill='%2394895b' d='m457 79 8 1 1 2-5 1v3l13-1 2 2-1 10-3 6-5-1-2-1v-2l-10-1-2-2-2-12 4-4z'/%3E%3Cpath fill='%239d9056' d='m215 149 9 1 8 1 2 3-1 12-5 2-1 2h-9l-4-2-2-8 1-9z'/%3E%3Cpath fill='%2369696c' d='M220 147h13l2 2v3h2v3h-2l1 8 3 1v6l-4 2-2 4-2 1h-17l-3-5-1-6v-10l2-6 2-2zm-5 2-2 2-1 11 2 6 4 2h9l4-4h2l1-12-2-3-11-2z'/%3E%3Cpath fill='%232f55d7' d='m562 124 5 1 17 1 1-2v3l10 1v-2l11-1 1 3h-4l-1 4 4 1v2l-2 2 1 3-2 1-11-1-1-3 1-2h3v-3l-30 1-5 1v-6z'/%3E%3Cpath fill='%234a2c68' d='M383 312h5l2 8-1 10h-2l-1 4-2 3h-12l-4-1 1-4 2-3h-3l1-4 4-6 6 1 4-1z'/%3E%3Cpath fill='%23656659' d='M144 10h16l5 3 1 3v14l-1 3-7 2-2 6-9-1-5-1v-3h2v-4h-4v-2l-6-1v-7l4-2 1-4h2l-1 12 6-1 1 3h3v2h12v-2h2V15h-20z'/%3E%3Cpath fill='%23254ac1' d='M458 264h10l12 1v1l-7 1 3 2-6 1 1-3h-3v4l6 2-1 5-3 4h-6l-3-2v-2h-14l-7-2v-1l6-2 3-4 7-1z'/%3E%3Cpath fill='%234b83de' d='m455 232 7 3 6 2 8 3v2h2l2 8-8 1h-16l-1-12-31-1v-1l32-1z'/%3E%3Cpath fill='%232b2b54' d='M526 0h38l-5 5h-2v2l-12 1V4l-5 3-8 3-4 5h-2l-1 7h-5v-7h3v-5h-7V9l6-1 3-4z'/%3E%3Cpath fill='%232b4ebf' d='M240 239h12l2 2-1 2-8 1v2l8 1-4 1-1 2-6 2-8 4-3-1 1-2-5 1v-2l-8 2-2 1v-6l11-4 4-2v-2z'/%3E%3Cpath fill='%236573ae' d='M395 180h7v4l-6 3-4 3-5 1v3l7-1v3l-8 3-12 3h-4l-2 6h-4v-3h-7l-2-2 1-1h8l2-5 5-1 1-3 11-2 3-5z'/%3E%3Cpath fill='%23283fc5' d='m176 346 5 1 3 1v3h18l-1 4-6 2-1 3h-2v2h-13l-5-2-1-2v-6h-6l1-5z'/%3E%3Cpath fill='%23212c83' d='M640 367h3v2l8 1v2l4-2 12-1h11v8h-39l-3-1v-8z'/%3E%3Cpath fill='%232228a7' d='m282 211 11 1v2h3v5l-3 5h-4l-2-3v-3h-4l-1 4h-3l-1 14-1-2-9 3h-4l1-7h3l1-4h2l2-7h4l1-6z'/%3E%3Cpath fill='%233f4e9d' d='M228 274h3v3h3v2h-2v2l6 1v2h2v7h2l-2 4-6 2-9 1-1-3-3-1 3-1-2-7v-5h2v-4h3z'/%3E%3Cpath fill='%23191355' d='M262 234h2v3l9-3h4l2 6 3 16-1 8-6 1-1-1-1-10 1-1v-7l1-4-6 2-2 4h-3l-1 3-2-5-2-1-1-6h4z'/%3E%3Cpath fill='%234e59b4' d='M369 267h1l1 20-7 1v-2l-7-2-7-6-3-5h2v-3h14v2h6z'/%3E%3Cpath fill='%2366666d' d='M464 77h6l2 1v3l4 2 2 2v9l-3 10-4 1h-13l-6-5-4-1v-6l1-2 1-9 5-2-1 2h-2l1 9 2 6 10 2v2l7 2 3-11v-5l-5-1h-9v-3l4-2-4-2z'/%3E%3Cpath fill='%231c348d' d='M618 177h6v6l-8 2-1 4h-3v13l-1 1-1 7-21 3-2-1 2-4 17-5h3v-11l1-3h-2v-3h2v-6z'/%3E%3Cpath fill='%232d2f64' d='M30 260h3v4h5v4h-3l1 8-4-1h3v-2H24v4l4 1v2l-8 1v3l-4-1H5v-4l3-2h11v-2H8v-2l6-1 4 1 3-2h3v-5h2l1-4z'/%3E%3Cpath fill='%2311277f' d='m356 215 4 1v5l-3 2-2 6-1 14 2 7v2h6v3h-35v-2l15-1-4-7v-2l5-1 3 3v7l6 1 1-4-1-1v-15h-6v-3h3v-4h2l1-3h2z'/%3E%3Cpath fill='%2326339e' d='M384 207h4v10l-4 4-3-1-1-2-12 1-4 1v-2h-2v-7l2-2 14-1z'/%3E%3Cpath fill='%23445fb1' d='m205 256 10 2 1 3 5 2 1 3-2 4h2v2h2v2h-2l-1 4-3 2-1-1-7-1-1-6v-6l-4-2z'/%3E%3Cpath fill='%23142d7e' d='m612 225 16 2 6 1v4l-5 2h-9l1 12-5 3-3-1v-2h-2l-1-4h2v-2h2l-1-8-1-1z'/%3E%3Cpath fill='%234471d7' d='M603 191h5l1 2v10l-20 6-2 3v-12h4v-2l5-2v-4z'/%3E%3Cpath fill='%23645e83' d='m520 209 15 1v4l-7 1-4 4-3 1h-25v-5l15-1 1-3z'/%3E%3Cpath fill='%234530a2' d='m262 252 5 1 2 1-1 10h-2v2h2l1 4 3-3h3l-1 3-5 2-1 4h-2l-2-9h-3l1 7-2 1-1 3h4l-1 6-5-1-3-1v-4l-3-1 2-3 5-1 2-13z'/%3E%3Cpath fill='%23aa9655' d='M103 132h10l8 2 1 5-3 1v8l-2 1-1 3h2v4h-5v-2l-6 2-1 3-6-2-4-5v-3h2v3h2v-4l5 1 5 1v3l3-1 4-7-3-1-2-8-10-2v2h-3l1-3z'/%3E%3Cpath fill='%233c3b4b' d='m24 182 13 1 2 1v11h-1l-1-6-1 9-7-1-2-2-7-1-1-2v-6l5-1z'/%3E%3Cpath fill='%23333971' d='M585 265h15v2h3v10l-4 3h-3v2h-6v-2h2l-1-7-2 1v-2l-7-1 2-1z'/%3E%3Cpath fill='%2325254c' d='M672 336h6v12l-20-1-1 3h-5v-2l-4-1-1-3h11v-3l6-2h7z'/%3E%3Cpath fill='%23524f74' d='M668 146h10v4l-12 2v2l-3 1-1 2 2 1-8 5 2 3-6-1-10-3-1-2 9-3 6-4 8-5z'/%3E%3Cpath fill='%23615ca3' d='M363 240h17l3 1v9l-4 1-1 4-6-2-1-2-6-1v-2h-2v-4l-3-1h3z'/%3E%3Cpath fill='%238c7545' d='M658 347h14l6 1v7h-34v-3l13-3z'/%3E%3Cpath fill='%232d44cf' d='M304 216h11l1 5-1 1h-12l-1 4h-2l-1 6h17l4 2-20 2-4 1-2-5 2-6h2v-8h6z'/%3E%3Cpath fill='%233b4a90' d='m366 73 7 1 4 4v9l-2 3h-10v-2h-2V76z'/%3E%3Cpath fill='%233361ad' d='M508 236h31l13 1-4 6-7 1-1-4h-41v-2z'/%3E%3Cpath fill='%232c46a8' d='M152 52h5l2 4-7 3-5 3h-3v2h-13v-5l-1-2h9l2-4z'/%3E%3Cpath fill='%235b5162' d='m645 170 4 2 9 15 1 5v8h-1v-6l-13 2h-10v-9l2-2h4l4 6h8v-2h2l-1-5-4-4-3-6z'/%3E%3Cpath fill='%2359579d' d='m298 255 2 2v3h2v4l11-1 3 1 2-4 3-4h3v10l-4 5-2 2-4-2-1-2h-5v2l-4-1-1-3-5-3z'/%3E%3Cpath fill='%234c4f8a' d='M66 302h8v2h9l3 3 2 1v2l-5 2 1 1 9 1v2H82l-12-2 2-5 8-1-15-1z'/%3E%3Cpath fill='%23594e49' d='M624 287h11l-2 1v2l10-3h5l1 3h4l1 3-6 1h-12l-18-3v-3z'/%3E%3Cpath fill='%2308054f' d='m296 294 16 2v2l8 1 3 8v2h-6v-4l-10-3-9-2v-2h-2z'/%3E%3Cpath fill='%23694aa2' d='M379 307h4v12l-4 2-9-1h-7l1-5 7-3h5v-3h3z'/%3E%3Cpath fill='%232c2c63' d='M69 263h14l2 2-5 3h-3v2h12v2H76l4 5h-6l-2-2-4-2v-3h-2l1-5z'/%3E%3Cpath fill='%237e7668' d='M301 100h10l3 6v6l-2 1h-11l-1-1v-11z'/%3E%3Cpath fill='%238b815a' d='M300 64h6l3 2v9l-3 3h-8l-3-4v-7z'/%3E%3Cpath fill='%236a6883' d='M80 320h13v2h8v2l-13 2H69l-7-2 1-2z'/%3E%3Cpath fill='%23928165' d='M487 196h6l3 2 7 2v5h-15l-13-2-1-3 11-1z'/%3E%3Cpath fill='%23676478' d='M16 288h13l4 2v3l9 3v1H16l-2-4 6-1v-2h-4z'/%3E%3Cpath fill='%2343538a' d='M478 88h5v8l-2 1-1 3h-2v3l-3 1zm-30 11 5 1 5 4h17l-1 2-8 2h-16l-2-5z'/%3E%3Cpath fill='%23606580' d='M348 38h8l2 1v4l4 1-1 4h-4l-1 4h-4v-2l-4-1-2-3v-7z'/%3E%3Cpath fill='%235466a5' d='M460 267h7v3l7 3-1 5-3 4h-6l-4-4-1-10z'/%3E%3Cpath fill='%234b5ea5' d='M228 274h3v3h3v2h-2v2l3 1-1 9 4 1v1l-11-1 1-3h4v-2h-9l-1-1v-5h2v-4h3z'/%3E%3Cpath fill='%23838178' d='M545 185h2l-1 4-3 3-5 1v7l-2 1h-8l-1-4-3-1v-3l7-1 4-2 3-3z'/%3E%3Cpath fill='%232d2c94' d='m312 288 4 1 1 3 5 2 1 2v8h-2l-1-4-8-2v-2l-12-1-4-2h3v-2l11-1z'/%3E%3Cpath fill='%23545662' d='M651 358h13l14 2v8l-14-1-2-1v-2h6v-3h-18z'/%3E%3Cpath fill='%235d5a5e' d='M632 302h14l7 2v1l-5 1h-11l-1 4h-15v-3l5-1v-2z'/%3E%3Cpath fill='%23585674' d='M24 272h8l3 1v2h-3v5h3v6H24l-3-2v-3l7-1v-2l-7-1 3-1v-2l-3-1z'/%3E%3Cpath fill='%23381154' d='M282 200h10l-1 8-19 1v-5l5-3z'/%3E%3Cpath fill='%233a406b' d='M564 0h35v2l5 1 1 9h3v2l-4-1-1-3-3 1V9l-2-1 1-2-5-1-1-3h-13l-1 1h-9l-6-2z'/%3E%3Cpath fill='%232942c6' d='M468 339h17l5 1v4l-2 1h-22l-2-1v-4z'/%3E%3Cpath fill='%23bca9ba' d='m340 297 6 3v4h9l-1 3h-8l8 4 3 5-8-1-7-6-4 1-2-4 2-3h2z'/%3E%3Cpath fill='%23423673' d='m278 224 3 1-2 4 1 4v2h2l1 2h6l5-1 2-2v9l-1-1-4-1-6 1-2 2v9l-2 3-3-16-1-4z'/%3E%3Cpath fill='%237e7767' d='m644 313 16 2 1 2-13 1h-11v2l-11 1v-3h-2v-3h20z'/%3E%3Cpath fill='%23353281' d='M364 234h20l2 8-6-1h-10l-7-1v3l-3-1h2l1-7z'/%3E%3Cpath fill='%23636c87' d='m346 110 6 1 3 6-1 5-4 1-5-2-5-1v-8z'/%3E%3Cpath fill='%233f4b7d' d='M307 16h3v4h12v7l-21 1 1-3 5-1z'/%3E%3Cpath fill='%23210442' d='M280 276h4l1 7-5 3h-9v2l-5-1v-3h3l1-4 2-3z'/%3E%3Cpath fill='%23264ac4' d='M349 270h14l1 3-3 8h-8l-6-8h2z'/%3E%3Cpath fill='%233f4c8a' d='M330 60h8l2 1v11l-7-1-4-1v-2h-3l1-6z'/%3E%3Cpath fill='%23867a58' d='M233 160h1v7l-3 3h-2l1 6h-14l-1-1v-5h-3v-8l2 4v2l8 1 5 1 1-3 2-1 2-4z'/%3E%3Cpath fill='%234b6fd0' d='M304 256h17l-3 5-2 3h-14v-4h-2v-3z'/%3E%3Cpath fill='%233654a2' d='M596 184h6l-2 4h-3v2h-2l-1 7-3 1v2h-4v12l-2-4v-14h2v-2h4v-5z'/%3E%3Cpath fill='%236a6da8' d='m266 194 9 1 3 2-1 5-5 2-1-1-10-1-2-1v-5h7z'/%3E%3Cpath fill='%233f6ad5' d='M235 241h7v4l-5 2h-3v2l-15 5-2 1v-6l11-4 4-3z'/%3E%3Cpath fill='%23d6bb59' d='m565 9 2 4 1 13h-2v3l-6 1V16l2-5z'/%3E%3Cpath fill='%236492f2' d='M28 161h12l1 5-1 2-8 1v2h-6l-1-9z'/%3E%3Cpath fill='%23222564' d='m342 271 5 2 6 7 5 4 6 2v2h2l1 4h-2v-2l-5 1v-3h-5l-4-3v-2h-4v-3h-2z'/%3E%3Cpath fill='%231a1061' d='M373 208h5v2h3v2h-2v4l-16 1v-7l1-1z'/%3E%3Cpath fill='%23513773' d='M286 298h3l1 15h-10v-11h2v-2z'/%3E%3Cpath fill='%237a7586' d='M66 329h14l4 1v3l-4 1H55l1-3z'/%3E%3Cpath fill='%2357648c' d='M313 36h3v2h8v5h-8l-2 5-6-1-1-5 2-4h4z'/%3E%3Cpath fill='%23b7a05b' d='M600 48v3l-1 2h2l-1 5h-2l1 7h-3v2l-2 1-2 4-2-1 2-13 2-2v-5l2-2z'/%3E%3Cpath fill='%236d6679' d='M76 272h9l3 3 1 5h-9v2H70v-3l8-3z'/%3E%3Cpath fill='%235786e8' d='M360 244h3v4h2v2h6l1 3h-4l1 6-1 1-11 1v-3h7v-5l-7-1v-2h2z'/%3E%3Cpath fill='%23385ad2' d='m410 37 4 1 3 6h2v8l-3 5h-3l-3-12z'/%3E%3Cpath fill='%233a4e90' d='m368 29 10 1v12h-5v-2l-4-1-1-1z'/%3E%3Cpath fill='%232138ad' d='M455 324h25v4l-8 1h-14l-3-3z'/%3E%3Cpath fill='%236e7587' d='M133 270h7l-2 7-4 1v3h2v2h-11l1-4h3l1-6h2z'/%3E%3Cpath fill='%233774ee' d='M404 264h11l5 1v2h-2v2l5 1v1h-19z'/%3E%3Cpath fill='%2376675b' d='M635 323h13l4 3h-8l1 3h-17v-4z'/%3E%3Cpath fill='%23e2d134' d='m646 274 2 1-3 3v3l3 1-2 2 6-2 6-1-4 3-4 3-17 3v-2l7-6 3-6z'/%3E%3Cpath fill='%232339ab' d='M440 319h8v3h3v4h-14l-5-3v-3z'/%3E%3Cpath fill='%232a42c7' d='M216 326h14v6h-18l-1-4h5z'/%3E%3Cpath fill='%23533e78' d='m371 282 1 3 4 2 1 5h2v6h-7v-6h-5l-1-4 5-1z'/%3E%3Cpath fill='%234d4653' d='M652 337h10l5 1-3 2-6 1v3h-20v-3h16z'/%3E%3Cpath fill='%237d6968' d='M528 210h7v4l-10 2-2 2h-19v-1l12-2 6-4z'/%3E%3Cpath fill='%233663dc' d='M483 270h16v3h-3v2h-16l-7-2 4-2z'/%3E%3Cpath fill='%235f81ca' d='m339 259 9 2 3 3 1 6h-3v3l-5-1-2-1-1-10z'/%3E%3Cpath fill='%232f47a4' d='m356 215 4 1v5l-3 2-2 6-2 10h-1v-6h-6v-3h3v-4h2l1-3h2z'/%3E%3Cpath fill='%23233088' d='m209 99 7 2v6l-2 2h-9l1-2 3-1-8-1 1-4z'/%3E%3Cpath fill='%233f3d64' d='M608 295h17l9 2v2h-29l1-3z'/%3E%3Cpath fill='%23393d6e' d='m74 250 6 1-2 10h-9v-3h-4v-2l8-4z'/%3E%3Cpath fill='%23948c65' d='m457 79 8 1 1 2-5 1v3l-5 1v6h-2l-1 3-2-12 4-4z'/%3E%3Cpath fill='%23474a79' d='m512 43 4 1 3 18 3 6-5-1v-2l-4-1-1-7h2l-1-12zm4 0z'/%3E%3Cpath fill='%232a4ca8' d='M298 252h9v3h3v-3h13v4l-24 1z'/%3E%3Cpath fill='%23324290' d='M298 225h1v7h17l4 2-20 2-4 1-2-5 2-6z'/%3E%3Cpath fill='%23414451' d='M8 183h6v7H9l-1 4-6 1v-2H0v-3l5-1 2-5z'/%3E%3Cpath fill='%23273778' d='m165 8 3 1 2 4v3h9l4 9-2 3h-2l-1 3-1-2 1-11-8 1h-3v-3h-2z'/%3E%3Cpath fill='%23d9c44e' d='M216 156h9l1 1v7h-2v2l-3 2h-5l1-5 1-6z'/%3E%3Cpath fill='%23d1c24d' d='M464 86h4l1 6h-2l1 4-1 2h-6l-2-5v-5z'/%3E%3Cpath fill='%233d4da6' d='m374 76 5 1 2 6-1 10-2 3-5-2-6-3v-1l8-1 1-2 1-9-3-1z'/%3E%3Cpath fill='%239a8658' d='M528 43v3l1 6 5 1v2h5l2 7-3-1v-2l-10-2-1-2-3-1 1-10z'/%3E%3Cpath fill='%23a9924c' d='M540 15h3v2l-3 1-1 10v6h-3v7h-1v-5l-4 1v-5l2-1 1-8 4-1v-6z'/%3E%3Cpath fill='%234f96eb' d='M396 245h12l3 3v4h-12v-3l-3-1z'/%3E%3Cpath fill='%233553d6' d='M636 98h4v2h-2v2h-2l-1 4-7 2-1 2h-5v2h-4v-4l8-3 4-3h2v-2z'/%3E%3Cpath fill='%23aea164' d='M73 231h7l-1 3h-2l2 12-6-2-2-2v-9z'/%3E%3Cpath fill='%23291a25' d='M664 322h2v5l-4 4 6 2v2l-12-1 2-1v-2l-7-1-3-2 16-2z'/%3E%3Cpath fill='%23dbd14a' d='M660 210h1v29l-2 10h-2l-2 10-2 2 2-10 3-16z'/%3E%3Cpath fill='%23a7aa71' d='m455 232 7 3 2 3-1 8-3 2h-3l-1-12z'/%3E%3Cpath fill='%23302834' d='M628 329h19l3 3-2 2-10 3h-3v-4h2v-2l-9-1z'/%3E%3Cpath fill='%23544642' d='M653 322h11v4l-13 3-2 2-5-3v-2l6-1 3-1z'/%3E%3Cpath fill='%2378778f' d='M395 180h7v4l-6 3-3 2h-7l2-5z'/%3E%3Cpath fill='%23ac955e' d='m550 7 6 1 1 3-4 5-5 3-2 2-3-1 1-2 2 1v-7z'/%3E%3Cpath fill='%23976897' d='M330 327h13l1 4-6 3-7-1-1-1z'/%3E%3Cpath fill='%23204295' d='m338 243 5 1 2 4v5l1 2h-19v-2l15-1-4-7z'/%3E%3Cpath fill='%23c0b14d' d='M125 206h19v2l-14 3-3 2v-3l-8 1 3-2z'/%3E%3Cpath fill='%236e83ac' d='m205 256 10 2 1 4 4 2-1 2h-8l-1-3-5-2z'/%3E%3Cpath fill='%23233782' d='M646 196h11v5h-7v-3h-4l-1 5h-8v-2h2l1-3z'/%3E%3Cpath fill='%233d53a7' d='M344 92h7l1 1v8l-1 1h-7l-1-6z'/%3E%3Cpath fill='%23a38c53' d='M565 7h8l13 4v8l-4-1 1-3-4-1-1-4h-8l-2-1v4h-2z'/%3E%3Cpath fill='%23434988' d='M20 301h12v2h-2l2 5H18l-2-2 6-1-2-1z'/%3E%3Cpath fill='%2370789e' d='M164 293h14l5 2 6 1-2 2h-11l-12-2z'/%3E%3Cpath fill='%23b3a256' d='M458 86h6l-4 2 1 10h6l1-2 2 1-1 4h-4v-2l-10-1-1-5h2v-6z'/%3E%3Cpath fill='%230f329d' d='M414 253h34v2l-34 1z'/%3E%3Cpath fill='%231a34a4' d='m434 160 6 1v2l-6 1v2h-3l1 5-6-1-2-2 3-5z'/%3E%3Cpath fill='%2324368f' d='m624 193 8 1-2 4v-3l-6 2v-2h-2v8l-4 2h-5l1-2 3 1-1-2v-6h2v-2z'/%3E%3Cpath fill='%23e9c647' d='M100 136h8l1 4-2 2-1 4-5 1-1-1z'/%3E%3Cpath fill='%23396ee2' d='M192 263h13l4 2v3h-15z'/%3E%3Cpath fill='%23f0da0a' d='m642 163 9 2 8 4 1 4-5-1-6-2v-2h-6z'/%3E%3Cpath fill='%236c6e7b' d='M300 64h6l3 2v9l-3 3h-8l-3-4v-7zm0 3-4 1 1 7 1 1h8l2-2v-5h-3v-2z'/%3E%3Cpath fill='%23506de5' d='M273 215h5l-1 4h-4l-2 7h-2l-1 3h-2l1-10 3-3z'/%3E%3Cpath fill='%23866ad7' d='M379 307h2v7l-9 3h-7l1-3 5-2h5v-3h3z'/%3E%3Cpath fill='%2339478a' d='m508 201 12 1-2 4-3 2h-11v-2h3z'/%3E%3Cpath fill='%23695e49' d='m645 170 4 2 9 15 1 5v8h-1v-6h-5l1-10-4-4-3-6z'/%3E%3Cpath fill='%236f7482' d='M307 86h6l3 2v8h-6l-2-5z'/%3E%3Cpath fill='%23222d7b' d='M645 207h15l-1 4h-19v-2z'/%3E%3Cpath fill='%237b809f' d='M226 283h8v8l4 1v1l-11-1 1-3h4v-2h-8v-2h2z'/%3E%3Cpath fill='%23d1c856' d='m631 159 10 1 8 3 13 5 6 4-2 1-15-7-9-2-7-1z'/%3E%3Cpath fill='%23977b8d' d='M348 304h7l-1 3h-8l8 4 3 5-8-1-6-7 1-3z'/%3E%3Cpath fill='%2332302e' d='M648 267h2l-2 7-5 3-3 6-4 4-3-1 2-5 4-1 1-4-1-5 8 2v-5z'/%3E%3Cpath fill='%23385dd2' d='M242 262h6v7l-11 1v-5l5-1z'/%3E%3Cpath fill='%233e579d' d='m298 64 2 1-2 2h-3l2 9 4 2v2h-3l-1 2-6-2v-4h2l-1-8z'/%3E%3Cpath fill='%237f8390' d='M175 264h5l3 4v4h-10v-5h2z'/%3E%3Cpath fill='%230c147b' d='M226 262h4v11l-3 3h-2l-1-7z'/%3E%3Cpath fill='%23ccc25e' d='m128 254 1 2h2v2l5 1 2 5-5 1-10-5 1-2 4 1v-2z'/%3E%3Cpath fill='%23586599' d='M298 99h14l4 6v7h-2l-2-9-1-3-10 1-1 11h-2l-1-12z'/%3E%3Cpath fill='%238e8c76' d='M368 79h5l3 2v5l-9 2-1-8z'/%3E%3Cpath fill='%23677eb7' d='M304 277h9l1 5-4 2h-8z'/%3E%3Cpath fill='%23525a7d' d='m372 76 5 2v9l-2 3h-8l-2-4v-5l2 2 1 4 8-1v-5l-6-2 2-1z'/%3E%3Cpath fill='%236a7089' d='m333 62 7 1v9l-7-1z'/%3E%3Cpath fill='%234d75d3' d='M424 237h33v11l5-2-1 5h-5l-1-12-31-1z'/%3E%3Cpath fill='%231f1820' d='M75 229h5l1 5-1 2v8h-2l-1-2v-8h2v-2h-6l-1 1-1 9h-2v-8l1-4z'/%3E%3Cpath fill='%23372f1a' d='M104 228h2v12l2 8h2v2h2v2l4 2 7 4-1 2-11-6-4-5v-2h-2l-1-6z'/%3E%3Cpath fill='%23aaa269' d='m213 152 4 1-1 4h2v6l-2 5h-2l-2-8z'/%3E%3Cpath fill='%23222c69' d='M43 205h10l3 1v3l-4 1H42z'/%3E%3Cpath fill='%2327237b' d='M356 308h9l3 1v2h5l-2 2-6 2v-2l-9-2z'/%3E%3Cpath fill='%233e4271' d='m144 300 3 1v4l-3 1h-8l-5-2v-2h4v2h3v-3z'/%3E%3Cpath fill='%23404580' d='m67 325 9 1 1 3-19 2 1-3z'/%3E%3Cpath fill='%232f3766' d='M122 316h8l6 1v2l-8 2h-16v-1l12-1z'/%3E%3Cpath fill='%23282019' d='M676 266h2l-2 7-3 3h-5v2l-3 2-4-1 13-10z'/%3E%3Cpath fill='%23373657' d='m111 253 11 6 11 5 4 2-9-1-7-4-9-3z'/%3E%3Cpath fill='%23646261' d='M649 158h3v2h2v3l4 3-6-1-10-3-1-2z'/%3E%3Cpath fill='%2343519c' d='m165 106 9 1-1 5h-10v-2h2z'/%3E%3Cpath fill='%231b2b7c' d='M650 234h7v7l-11-1v-2h4z'/%3E%3Cpath fill='%2315328e' d='M626 158h2l1 2 4 2v1h-7v2l-5 2h-3v-2l6-5h2z'/%3E%3Cpath fill='%2366697a' d='M96 125h17l2 2-12 2v-3h-3v2h-2v2h-3z'/%3E%3Cpath fill='%23091659' d='m137 365 6 1 1 4h-16l2-2z'/%3E%3Cpath fill='%23626c79' d='M371 32h4l2 5v4l-6-1-1-7z'/%3E%3Cpath fill='%2359546f' d='M542 4h3v4l5-1-1 2-6 1V8l-3 1-1 2-7-1 4-3 5-2z'/%3E%3Cpath fill='%231d3794' d='M596 184h6l-2 4h-3v2l-6 1 1-5z'/%3E%3Cpath fill='%234752aa' d='M288 266h5l3 7v3l8 1v5h-2v-4h-6l-4-8-4-1z'/%3E%3Cpath fill='%23586296' d='M111 217v3l-4 7-4-1v-8l2 4h2v-3z'/%3E%3Cpath fill='%237b6e61' d='m647 351 2 1-1 2h30v1h-34v-3z'/%3E%3Cpath fill='%231b2a7f' d='M640 241h10v2h-2v3h-8z'/%3E%3Cpath fill='%23384696' d='m126 214 1 2-1 7 3 1v2l9 1v2h-7l-3-1-1-4h-4l2-9z'/%3E%3Cpath fill='%23e2b438' d='M561 32h2l1 4h2v6l-1 2-4-1z'/%3E%3Cpath fill='%234c4b3b' d='m658 166 5 1 3 1v2l5 2 4 2v2h3l-1 3-15-10-4-2z'/%3E%3Cpath fill='%239b9573' d='M598 61h4v5l-6 3-1 3-3-1 2-4h2v-2l2-1z'/%3E%3Cpath fill='%23c5af24' d='M74 232h2l1 10-3 1v-2h-2v-7z'/%3E%3Cpath fill='%234d455b' d='m648 288 1 2h4l1 3-6 1h-12v-2h10z'/%3E%3Cpath fill='%23231e43' d='M553 0h11l-5 5h-2v2h-3V2z'/%3E%3Cpath fill='%23311b33' d='M345 306h9l1 5-6-1z'/%3E%3Cpath fill='%23343598' d='m286 268 2 1-1 1v8l2 2 3 8-4-2v-4h-2l-1-2v-11z'/%3E%3Cpath fill='%235e70ac' d='M607 71h3v7h-6l1-4z'/%3E%3Cpath fill='%2371939e' d='M456 237h1v11l5-2-1 5h-5z'/%3E%3Cpath fill='%237e7b67' d='m334 63 5 1v6l-4-1-1-1z'/%3E%3Cpath fill='%2348497d' d='m124 204 20 1v1h-19l-1 3-1-4z'/%3E%3Cpath fill='%231f1e4d' d='M34 290h5l1 5-7-1-1-2h2z'/%3E%3Cpath fill='%23bdaf2d' d='m458 236 3 1v9h-3z'/%3E%3Cpath fill='%237b6958' d='m121 144 1 2h3l-1 2-3-1-1 5h-4l1-4h2z'/%3E%3Cpath fill='%235a6a8f' d='M141 208h2v2l-10 2-2 2-4-1 3-3z'/%3E%3Cpath fill='%23b0a574' d='M125 206h19v2l-6 1v-1h-13z'/%3E%3Cpath fill='%23505c73' d='M633 155h4v4l3 1-9-1z'/%3E%3Cpath fill='%23192c95' d='m203 92 7 1-1 3h-7z'/%3E%3Cpath fill='%23281b7d' d='m271 205 1 4-1 5h-2l-2 3v-7h2z'/%3E%3Cpath fill='%237c7256' d='m453 96 12 3v2l2 1-3 1-1-3h-9z'/%3E%3Cpath fill='%230f2975' d='m187 220 4 2 1 4h-2v2h-2z'/%3E%3Cpath fill='%23273ca0' d='m224 273 1 3 2 1h-3l-1 4-3-1 2-6z'/%3E%3Cpath fill='%2326283b' d='M652 202h7l2 2-1 4-2-4h-6z'/%3E%3Cpath fill='%23efd21a' d='M124 210h3v3h-3v2h-6v-2l6-1z'/%3E%3Cpath fill='%23243068' d='M188 362h4v2l-8 4 1-4z'/%3E%3Cpath fill='%232a2930' d='m127 248 4 5 1 4h3l-1 2-3-1v-2h-2l-2-4z'/%3E%3Cpath fill='%2379808a' d='M522 202h6v3l-6 1z'/%3E%3Cpath fill='%23212e68' d='m36 183 3 1v11h-1l-2-7z'/%3E%3Cpath fill='%23b7a741' d='M216 157h2v6l-2 5h-1v-8z'/%3E%3Cpath fill='%239a9065' d='M96 149h2v3l3 1 1 5-6-5z'/%3E%3Cpath fill='%23271a0a' d='M659 280h2l-1 3-8 4-2-1z'/%3E%3Cpath fill='%23dacf4c' d='m654 281 4 1-8 5-3-1z'/%3E%3Cpath fill='%23cdc139' d='m128 254 1 2h2l3 7h-2v-2h-4v-4z'/%3E%3Cpath fill='%23172592' d='M384 207h3v3l-6 1-3-2z'/%3E%3Cpath fill='%23ddd22a' d='m642 163 6 1-1 2h-2v2l-3-1z'/%3E%3Cpath fill='%23173e92' d='M356 252h6v3h-5z'/%3E%3Cpath fill='%23241c34' d='M458 232h5l1 5-6-4z'/%3E%3Cpath fill='%234f431e' d='M648 267h2l-2 7-2-1z'/%3E%3Cpath fill='%23e5d438' d='M676 264h2v2h-2l-2 4-1-3z'/%3E%3Cpath fill='%23adab76' d='M134 259h2l2 5-5 1 2-1z'/%3E%3Cpath fill='%23ddd04a' d='m668 173 5 2 1 2-5-1z'/%3E%3Cpath fill='%23120638' d='M351 307h3l1 4h-3z'/%3E%3Cpath fill='%23413415' d='m635 283 3 1-2 3-3-1z'/%3E%3Cpath fill='%234858b8' d='m355 217 1 3-2 3-2-1z'/%3E%3Cpath fill='%236f7399' d='M81 330h3v3l-4-1z'/%3E%3Cpath fill='%236b5c1d' d='m635 289 4 1-5 2-1-2z'/%3E%3Cpath fill='%235578e6' d='M25 162h3l-1 3h-2z'/%3E%3C/svg%3E\")}";

  var BiliBlocker = /*#__PURE__*/function () {
    function BiliBlocker(blockList) {
      _classCallCheck(this, BiliBlocker);

      this.blockList = blockList;
      this.setting = new Setting(this.blockList);
      this.history = {};
      GM_addStyle(css_248z);
    } // 添加屏蔽按钮


    _createClass(BiliBlocker, [{
      key: "addBlockBtn",
      value: function addBlockBtn(cardView) {
        if (cardView.getElementsByClassName('brlb-block-btn').length !== 0) {
          return;
        }

        var blockBtn = createElement('div', {
          className: 'brlb-block-btn',
          style: {
            display: 'none'
          }
        }, [createElement('svg', {
          className: 'brlb-block-btn-icon'
        })]);
        cardView.insertBefore(blockBtn, cardView.childNodes[1]);
      } // mouseEnter才显示按钮

    }, {
      key: "setCardViewEvent",
      value: function setCardViewEvent(cv) {
        cv.onmouseover = function (ev) {
          ev = ev || window.event;
          var target = ev.target;

          if (target.parentElement.className === 'v-img bili-video-card__cover' || target.className === 'v-img bili-video-card__cover') {
            var cardView = target.closest('.bili-video-card__wrap');
            var blockDiv = cardView.getElementsByClassName('brlb-block-btn')[0];
            blockDiv.setAttribute('style', '');
          }
        };

        cv.onmouseout = function (ev) {
          ev = ev || window.event;
          var target = ev.target;

          if (ev.toElement != null && ev.toElement.className === 'brlb-block-btn') {
            return false;
          }

          if (target.parentElement.className === 'v-img bili-video-card__cover' || target.className === 'v-img bili-video-card__cover') {
            var cardView = target.closest('.bili-video-card__wrap');
            var blockDiv = cardView.getElementsByClassName('brlb-block-btn')[0];
            blockDiv.setAttribute('style', 'display: none;');
          }
        };
      }
    }, {
      key: "setBlockBtnEvent",
      value: function setBlockBtnEvent(recommendContainer) {
        var _this = this;

        recommendContainer.onclick = function (ev) {
          ev = ev || window.event;
          var target = ev.target;

          if (target.className.toLowerCase() === 'brlb-block-btn') {
            var cardView = target.parentElement;
            var id = cardView.parentElement.dataset.brlbId;

            var uid = _this.getUid(cardView);

            if (uid != null) {
              if (cardView.parentElement.dataset.blocked === '1') {
                GM_log("".concat(uid, " \u53D6\u6D88\u5C4F\u853D"));

                _this.blockList.remove('uid', uid.toString());

                cardView = _this.unblockCardView(cardView, id);
                cardView.parentElement.dataset.blocked = '0';

                _this.addBlockBtn(cardView);

                _this.setCardViewEvent(cardView);
              } else {
                if (_this.blockList.add('uid', uid.toString()) === true) {
                  GM_log("".concat(uid, " \u5DF2\u5C4F\u853D"));
                  cardView = _this.blockCardView(cardView, uid);

                  _this.addBlockBtn(cardView);

                  _this.setCardViewEvent(cardView);
                }
              }
            }

            cardView.parentElement.dataset.brlbId = id;
          }
        };
      }
    }, {
      key: "blockCardView",
      value: function blockCardView(cardView, uid) {
        var newCardView = createElement('div', {
          'className': 'bili-video-card__wrap __scale-wrap brlb-block'
        }, []);
        newCardView.innerHTML = "\n      <div>\n        <div class=\"bili-video-card__image __scale-player-wrap\">\n            <div class=\"bili-video-card__image--wrap\">\n                <picture class=\"v-img bili-video-card__cover\"></picture>\n            </div>\n        </div>\n      </div>\n      <div class=\"bili-video-card__info __scale-disable\">\n        <div class=\"bili-video-card__info--right\">\n          <a target=\"_blank\">\n            <h3 class=\"bili-video-card__info--tit\" title=\"\u9ED1\u540D\u5355\u5185\u5BB9\">\u9ED1\u540D\u5355\u5185\u5BB9</h3>\n          </a>\n          <div class=\"bili-video-card__info--bottom\">\n            <a class=\"bili-video-card__info--owner\">\n              <svg class=\"bili-video-card__info--owner__up\">\n              <use xlink:href=\"#widget-up\"></use>\n              <span class=\"bili-video-card__info--author\">\u5DF2\u5C4F\u853D</span>\n            </a>\n          </div>\n        </div>\n      </div>\n      ";
        cardView.replaceWith(newCardView);
        newCardView.parentElement.dataset.blocked = '1';
        newCardView.parentElement.dataset.brlbUid = uid.toString();
        return newCardView;
      }
    }, {
      key: "unblockCardView",
      value: function unblockCardView(cardView, id) {
        // 再次点击取消屏蔽
        var cv = this.history[cardView.parentElement.parentElement.className][id];
        cardView.replaceWith(cv);
        cv.parentElement.dataset.blocked = '0';
        return cv;
      }
    }, {
      key: "getUid",
      value: function getUid(cardView) {
        if (cardView.getElementsByClassName('bili-video-card__info--ad-img').length > 0) return 0; // 广告

        if (cardView.parentElement.dataset.brlbUid !== undefined) return cardView.parentElement.dataset.brlbUid;
        var owner = cardView.getElementsByClassName('bili-video-card__info--owner');
        if (owner.length === 0) return -1; // 无法识别uid

        var hlink = owner[0].href;
        var uid = hlink.substr(hlink.lastIndexOf('/') + 1);
        return uid;
      }
    }, {
      key: "readMetadata",
      value: function readMetadata(cardView) {
        var metadata = {
          "isAd": false,
          "uid": 0,
          "username": "",
          "BV": "",
          "title": ""
        };

        if (cardView.getElementsByClassName('bili-video-card__info--ad-img').length > 0) {
          // 广告
          metadata.isAd = true;
          return metadata;
        }

        metadata.uid = this.getUid(cardView);
        var bvHref = cardView.getElementsByTagName('a')[0].href;
        metadata.BV = bvHref.substr(bvHref.lastIndexOf('/') + 1);
        metadata.username = cardView.getElementsByClassName('bili-video-card__info--author')[0].innerText;
        metadata.title = cardView.getElementsByClassName('bili-video-card__info--tit')[0].innerText;
        return metadata;
      } // 换一换

    }, {
      key: "rollObserver",
      value: function rollObserver(recommendContainer) {
        var _this2 = this;

        var rollCallback = function rollCallback(mutationsList, observer) {
          var recommendList = recommendContainer.getElementsByClassName('bili-video-card__wrap');
          _this2.history[recommendContainer.className] = Array.from(recommendList);

          _this2.run(recommendList);
        };

        var rollObse = new MutationObserver(rollCallback);
        var config = {
          attributes: false,
          childList: true,
          subtree: false
        };
        rollObse.observe(recommendContainer, config);
      }
    }, {
      key: "register",
      value: function register(container, id) {
        var cardViewList = container.getElementsByClassName('bili-video-card__wrap');
        this.history[id] = Array.from(cardViewList);
        this.run(cardViewList);
        this.setBlockBtnEvent(container);
      }
    }, {
      key: "run",
      value: function run(cardViewList) {
        var index = 0;

        var _iterator = _createForOfIteratorHelper(cardViewList),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var cardView = _step.value;
            // 普通视频
            var uid = this.getUid(cardView);

            if (uid === -1) {
              // 无法识别uid
              continue;
            } else if (uid === 0) {
              // 广告
              cardView = this.blockCardView(cardView, 0);
              this.addBlockBtn(cardView);
              this.setCardViewEvent(cardView);
            } else {
              // 普通视频
              if (uid != null && this.blockList.isContained('uid', uid) === true) {
                cardView = this.blockCardView(cardView, uid);
              }

              this.addBlockBtn(cardView);
              this.setCardViewEvent(cardView);
            }

            cardView.parentElement.dataset.brlbId = index.toString();
            index++;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }]);

    return BiliBlocker;
  }();

  var BlockList = /*#__PURE__*/function () {
    function BlockList() {
      var _this = this;

      _classCallCheck(this, BlockList);

      // 处理历史遗留问题（逃
      this.list = JSON.parse(GM_getValue('blockList') || null);

      if (this.list != null) {
        if (this.list instanceof Array) {
          this.list = {
            'uid': this.list,
            'username': [],
            'title': []
          };
        }

        Object.entries(this.list).forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              key = _ref2[0];
              _ref2[1];

          _this.list[key] = _this.list[key].sort();

          _this.removeDuplicates(key);

          GM_setValue("blockList.".concat(key), JSON.stringify(_this.list[key]));
        });
        GM_deleteValue("blockList");
      } // 新版本读取


      this.list = {
        'uid': [],
        'username': [],
        'title': []
      };
      Object.entries(this.list).forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            key = _ref4[0];
            _ref4[1];

        _this.list[key] = JSON.parse(GM_getValue("blockList.".concat(key)) || '[]');
        _this.list[key] = _this.list[key].sort();

        _this.removeDuplicates(key);
      });
      GM_log("\u9ED1\u540D\u5355\u5217\u8868\uFF1A".concat(JSON.stringify(this.list)));
    }

    _createClass(BlockList, [{
      key: "length",
      value: function length(key) {
        return this.list[key].length;
      }
    }, {
      key: "isContained",
      value: function isContained(key, item) {
        return this.list[key][this.search(key, item)] === item;
      }
    }, {
      key: "add",
      value: function add(key, item) {
        var index = this.search(key, item);

        if (this.list[key][index] !== item) {
          this.list[key].splice(index, 0, item);
          GM_setValue("blockList.".concat(key), JSON.stringify(this.list[key]));
          return true;
        }

        return false;
      }
    }, {
      key: "remove",
      value: function remove(key, item) {
        var index = this.search(key, item);

        if (this.list[key][index] === item) {
          this.list[key].splice(index, 1);
          GM_setValue("blockList.".concat(key), JSON.stringify(this.list[key]));
          return true;
        }

        return false;
      }
    }, {
      key: "clr",
      value: function clr() {
        GM_log("\u6E05\u7A7A\u9ED1\u540D\u5355");
        GM_setValue('blockList.uid', '[]');
        GM_setValue('blockList.username', '[]');
        GM_setValue('blockList.title', '[]');
        this.list = {
          'uid': [],
          'username': [],
          'title': []
        };
      }
    }, {
      key: "search",
      value: function search(key, target) {
        var n = this.list[key].length;
        var left = 0;
        var right = n - 1;
        var ans = n;

        while (left <= right) {
          var mid = (right - left >> 1) + left;

          if (target <= this.list[key][mid]) {
            ans = mid;
            right = mid - 1;
          } else {
            left = mid + 1;
          }
        }

        return ans;
      }
    }, {
      key: "removeDuplicates",
      value: function removeDuplicates(key) {
        var n = this.list[key].length;

        if (n === 0) {
          return 0;
        }

        var r = 1;
        var l = 1;

        while (r < n) {
          if (this.list[key][r] !== this.list[key][r - 1]) {
            this.list[key][l] = this.list[key][r];
            ++l;
          }

          ++r;
        }

        return l;
      }
    }]);

    return BlockList;
  }();

  window.addEventListener('DOMContentLoaded', function () {
    var blockList = new BlockList();
    var biliBlocker = new BiliBlocker(blockList);
    var isNewVer = document.querySelectorAll('div[class="bili-feed4"]').length;

    if (isNewVer === 1) {
      // 新版
      var recommendContainer = document.querySelectorAll('div[class="feed-recommend2"]')[0];
      biliBlocker.register(recommendContainer); // var index = 0;
      // var evaContainer = document.querySelectorAll('div[class="feed2-floors"]')[0];
      // const evaCallback = (mutationsList, observer) => {
      //   var timer = null;
      //   clearTimeout(timer);
      //   evaContainer = document.querySelectorAll('div[class="feed-floor"]');
      //   timer = setTimeout(() => {
      //     var i = 0;
      //     for (i = index; i < evaContainer.length; i++) {
      //       biliBlocker.register(evaContainer[i], evaContainer[i].id);
      //     }
      //     index = i;
      //     // evaObse.disconnect();
      //   }, 500);
      // };
      // const evaObse = new MutationObserver(evaCallback);
      // const config = {attributes: false, childList: true, subtree: true};
      // evaObse.observe(evaContainer, config);
      // 延迟一会，避免重复处理

      setTimeout(function () {
        biliBlocker.rollObserver(recommendContainer);
      }, 100);
    } else {
      // 旧版
      var _recommendContainer = document.querySelectorAll('div[class^="recommend-container__"]')[0];
      var evaContainer = document.querySelectorAll('div[class^="eva-extension-body"]')[0];
      biliBlocker.register(_recommendContainer, _recommendContainer.className);
      biliBlocker.register(evaContainer, evaContainer.className); // 延迟一会，避免重复处理

      setTimeout(function () {
        biliBlocker.rollObserver(_recommendContainer);
      }, 100);
    }
  }, false);

})();
