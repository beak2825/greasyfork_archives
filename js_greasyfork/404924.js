function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// ==UserScript==
// @name           游戏库检测-itch
// @name:en        Itch Game Library Check
// @namespace      itch-game-library-check
// @version        1.1.8
// @description    检测itch.io游戏是否已拥有。
// @description:en Check if the game of itch.io is already owned.
// @author         HCLonely
// @license        MIT
// @iconURL        https://itch.io/favicon.ico
// @homepage       https://github.com/HCLonely/Game-library-check
// @supportURL     https://github.com/HCLonely/Game-library-check/issues
// @include        *
// @exclude        *://itch.io/login
// @require        https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @require        https://cdn.jsdelivr.net/npm/components-jqueryui@1.12.1/ui/effect.min.js
// @require        https://cdn.jsdelivr.net/npm/regenerator-runtime@0.13.5/runtime.min.js
// @require        https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require        https://cdn.jsdelivr.net/npm/promise-polyfill@8.1.3/dist/polyfill.min.js
// @require        https://cdn.jsdelivr.net/npm/overhang@1.0.8/dist/overhang.min.js
// @require        https://greasyfork.org/scripts/418102-tm-request/code/TM_request.js?version=902218
// @require        https://greasyfork.org/scripts/426803-gistsync/code/gistSync.js?version=957824
// @resource       overhang https://cdn.jsdelivr.net/npm/overhang@1.0.8/dist/overhang.min.css
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @grant          GM_registerMenuCommand
// @grant          GM_getResourceText
// @grant          GM_openInTab
// @grant          unsafeWindow
// @connect        itch.io
// @connect        api.github.com
// @run-at         document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/404924/%E6%B8%B8%E6%88%8F%E5%BA%93%E6%A3%80%E6%B5%8B-itch.user.js
// @updateURL https://update.greasyfork.org/scripts/404924/%E6%B8%B8%E6%88%8F%E5%BA%93%E6%A3%80%E6%B5%8B-itch.meta.js
// ==/UserScript==
(function () {
  var whiteList = GM_getValue('whiteList') || [];
  var blackList = GM_getValue('blackList') || [];
  var url = window.location.href;
  var enable = true;
  var loadTimes = 0;

  if (whiteList.length > 0) {
    enable = false;

    var _iterator = _createForOfIteratorHelper(whiteList),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var e = _step.value;

        if (url.includes(e)) {
          enable = true;
          break;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  } else if (blackList.length > 0) {
    enable = true;

    var _iterator2 = _createForOfIteratorHelper(blackList),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _e = _step2.value;

        if (url.includes(_e)) {
          enable = false;
          break;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }

  if (!enable) return;

  if (getItchGameLibrary().length === 0) {
    Swal.fire({
      title: '游戏库检测脚本提醒',
      icon: 'warning',
      text: '没有检测到itch游戏库数据，是否立即获取？',
      showCancelButton: true,
      confirmButtonText: '获取',
      cancelButtonText: '取消'
    }).then(function (_ref) {
      var value = _ref.value;
      if (value) updateItchGameLibrary();
    });
  } else {
    checkItchGame();
  }

  var observer = new MutationObserver(function () {
    checkItchGame(false, true);
  });
  observer.observe(document.documentElement, {
    attributes: false,
    characterData: false,
    childList: true,
    subtree: true
  });

  function checkItchGame() {
    return _checkItchGame.apply(this, arguments);
  }

  function _checkItchGame() {
    _checkItchGame = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var first,
          again,
          itchGames,
          itchLink,
          _args2 = arguments;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              first = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : true;
              again = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : false;
              loadTimes++;

              if (!(loadTimes > 1000)) {
                _context2.next = 6;
                break;
              }

              observer.disconnect();
              return _context2.abrupt("return");

            case 6:
              itchGames = getItchGameLibrary();
              itchLink = again ? $('a[href*=".itch.io/"]:not(".itch-io-game-checked")') : $('a[href*=".itch.io/"]:not(".itch-io-game-link-owned")');

              if (!(itchLink.length === 0)) {
                _context2.next = 10;
                break;
              }

              return _context2.abrupt("return");

            case 10:
              if (first) updateItchGameLibrary(false);
              itchLink.map(function (i, e) {
                var _href$match;

                var $this = $(e);
                $this.addClass('itch-io-game-checked');
                var href = $this.attr('href');
                if (!/\/$/.test(href)) href += '/';
                var itchGameLink = (_href$match = href.match(/https?:\/\/(.*?\/.*?)\//i)) === null || _href$match === void 0 ? void 0 : _href$match[1];

                if (itchGameLink && itchGames.includes(itchGameLink)) {
                  $this.addClass('itch-io-game-link-owned');
                }

                return e;
              });

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _checkItchGame.apply(this, arguments);
  }

  function getItchGameLibrary() {
    return GM_getValue('itchGames') || [];
  }

  function updateItchGameLibrary() {
    var loop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var games = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    if (!loop && i !== 1) {
      GM_setValue('itchGames', _toConsumableArray(new Set([].concat(_toConsumableArray(getItchGameLibrary()), _toConsumableArray(games)))));
      checkItchGame(false);
      return;
    }

    return new Promise(function (resolve, reject) {
      if (loop) {
        Swal[i === 1 ? 'fire' : 'update']({
          title: '正在更新itch游戏库数据...',
          text: "\u7B2C ".concat(i, " \u9875"),
          icon: 'info'
        });
      }

      GM_xmlhttpRequest({
        method: 'GET',
        url: "https://itch.io/my-purchases?page=".concat(i, "&format=json"),
        timeout: 15000,
        nocache: true,
        responseType: 'json',
        onerror: reject,
        ontimeout: reject,
        onload: function onload(response) {
          response.status === 200 ? resolve(response) : reject(response);
        }
      });
    }).then( /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(response) {
        var _response$response, _response$response2;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!/https?:\/\/itch.io\/login/i.test(response.finalUrl)) {
                  _context.next = 5;
                  break;
                }

                if (loop) {
                  Swal.fire({
                    title: '获取itch游戏库数据失败！',
                    text: '请先登录',
                    icon: 'error',
                    showCancelButton: true,
                    confirmButtonText: '登录',
                    cancelButtonText: '取消'
                  }).then(function (_ref3) {
                    var value = _ref3.value;
                    if (value) GM_openInTab('https://itch.io/login', {
                      active: true,
                      insert: true,
                      setParent: true
                    });
                  });
                } else {
                  $('body').overhang({
                    type: 'error',
                    message: 'itch.io登录凭证已过期，请重新登录<a href="https://itch.io/login" target="_blank">https://itch.io/login</a>',
                    html: true,
                    closeConfirm: true
                  });
                }

                return _context.abrupt("return", false);

              case 5:
                if (!((_response$response = response.response) !== null && _response$response !== void 0 && _response$response.num_items)) {
                  _context.next = 21;
                  break;
                }

                // eslint-disable-line camelcase
                games = [].concat(_toConsumableArray(games), _toConsumableArray($.makeArray($("<div>".concat(response.response.content, "</div>")).find('a.thumb_link.game_link')).map(function (e, i) {
                  var _$$attr$match;

                  return (_$$attr$match = $(e).attr('href') // eslint-disable-line
                  .match(/https?:\/\/(.*?\/.*?)\//i)) === null || _$$attr$match === void 0 ? void 0 : _$$attr$match[1];
                })));

                if (!(response.response.num_items === 50)) {
                  _context.next = 13;
                  break;
                }

                _context.next = 10;
                return updateItchGameLibrary(loop, ++i, games);

              case 10:
                return _context.abrupt("return", _context.sent);

              case 13:
                if (!loop) {
                  _context.next = 16;
                  break;
                }

                GM_setValue('itchGames', _toConsumableArray(new Set(games)));
                return _context.abrupt("return", Swal.update({
                  icon: 'success',
                  title: 'itch游戏库数据更新完成',
                  text: ''
                }));

              case 16:
                GM_setValue('itchGames', _toConsumableArray(new Set([].concat(_toConsumableArray(getItchGameLibrary()), _toConsumableArray(games)))));
                checkItchGame(false);
                return _context.abrupt("return", true);

              case 21:
                if (!(((_response$response2 = response.response) === null || _response$response2 === void 0 ? void 0 : _response$response2.num_items) === 0)) {
                  _context.next = 24;
                  break;
                }

                // eslint-disable-line camelcase
                GM_setValue('itchGames', _toConsumableArray(new Set(games)));
                return _context.abrupt("return", Swal.update({
                  icon: 'success',
                  title: 'itch游戏库数据更新完成',
                  text: ''
                }));

              case 24:
                console.error(response);
                return _context.abrupt("return", Swal.update({
                  icon: 'error',
                  title: 'itch游戏库数据更新失败',
                  text: '详情请查看控制台'
                }));

              case 26:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }())["catch"](function (error) {
      console.error(error);
      return Swal.update({
        icon: 'error',
        title: 'itch游戏库数据更新失败',
        text: '详情请查看控制台'
      });
    });
  }

  function addWhiteList() {
    var whiteList = GM_getValue('whiteList') || [];
    Swal.fire({
      title: '添加白名单网站',
      input: 'textarea',
      inputValue: whiteList.join('\n'),
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消'
    }).then(function (_ref4) {
      var value = _ref4.value;
      if (value !== undefined) value ? GM_setValue('whiteList', value.split('\n')) : GM_setValue('whiteList', []);
    });
  }

  function addBlackList() {
    var blackList = GM_getValue('blackList') || [];
    Swal.fire({
      title: '添加黑名单网站',
      input: 'textarea',
      inputValue: blackList.join('\n'),
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消'
    }).then(function (_ref5) {
      var value = _ref5.value;
      if (value !== undefined) value ? GM_setValue('blackList', value.split('\n')) : GM_setValue('blackList', []);
    });
  }

  function setting() {
    Swal.fire({
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: '白名单网站',
      denyButtonText: '黑名单网站',
      cancelButtonText: '关闭'
    }).then(function (_ref6) {
      var isConfirmed = _ref6.isConfirmed,
          isDenied = _ref6.isDenied;

      if (isConfirmed) {
        addWhiteList();
      } else if (isDenied) {
        addBlackList();
      }
    });
  }

  GM_registerMenuCommand('更新itch游戏库', updateItchGameLibrary);
  GM_registerMenuCommand('设置', setting);
  GM_addStyle('.itch-io-game-link-owned{color:#ffffff !important;background:#5c8a00 !important}');
  GM_addStyle(GM_getResourceText('overhang'));
  unsafeWindow.checkItchGame = checkItchGame;
})();