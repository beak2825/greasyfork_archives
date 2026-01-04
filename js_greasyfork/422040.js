"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// ==UserScript==
// @name               IG-Owned
// @namespace          IG-Owned
// @version            1.1.4
// @description        indiegala 检测游戏是否已拥有
// @author             HCLonely
// @license            MIT
// @iconURL            https://auto-task-test.hclonely.com/img/favicon.ico
// @homepage           https://github.com/HCLonely/IG-Helper/
// @supportURL         https://github.com/HCLonely/IG-Helper/issues/
// @include            *://keylol.com/*
// @include            *://*.indiegala.com/*
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_addStyle
// @grant              GM_getResourceText
// @grant              GM_listValues
// @grant              GM_xmlhttpRequest
// @grant              GM_registerMenuCommand
// @grant              GM_cookie
// @grant              unsafeWindow
// @grant              window.open
// @require            https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @require            https://cdn.jsdelivr.net/npm/jquery.easing@1.4.1/jquery.easing.min.js
// @require            https://cdn.jsdelivr.net/npm/regenerator-runtime@0.13.7/runtime.min.js
// @require            https://cdn.jsdelivr.net/npm/sweetalert2@9
// @require            https://cdn.jsdelivr.net/npm/promise-polyfill@8.1.3/dist/polyfill.min.js
// @require            https://greasyfork.org/scripts/418102-tm-request/code/TM_request.js?version=902218
// @require            https://greasyfork.org/scripts/426803-gistsync/code/gistSync.js?version=957824
// @require            https://cdn.jsdelivr.net/npm/overhang@1.0.8/dist/overhang.min.js
// @resource           overhang https://cdn.jsdelivr.net/npm/overhang@1.0.8/dist/overhang.min.css
// @connect            indiegala.com
// @connect            api.github.com
// @run-at             document-end
// @downloadURL https://update.greasyfork.org/scripts/422040/IG-Owned.user.js
// @updateURL https://update.greasyfork.org/scripts/422040/IG-Owned.meta.js
// ==/UserScript==

/* global syncIgLib */
(function () {
  if (/^https?:\/\/www\.indiegala\.com\/(library|showcase)/.test(window.location.href)) {
    var _GM_getValue;

    var games = _toConsumableArray($.makeArray($('a.library-showcase-title,a.main-list-item-clicker')).map(function (e) {
      var _$$attr, _$$attr$match, _$$attr$match$;

      return (_$$attr = $(e).attr('href')) === null || _$$attr === void 0 ? void 0 : (_$$attr$match = _$$attr.match(/https:\/\/.*?\.indiegala\.com\/(.*)/)) === null || _$$attr$match === void 0 ? void 0 : (_$$attr$match$ = _$$attr$match[1]) === null || _$$attr$match$ === void 0 ? void 0 : _$$attr$match$.toLowerCase();
    })).filter(function (e) {
      return e;
    });

    var allGames = ((_GM_getValue = GM_getValue('IG-Owned')) === null || _GM_getValue === void 0 ? void 0 : _GM_getValue.games) || [];
    GM_setValue('IG-Owned', {
      time: new Date().getTime(),
      games: _toConsumableArray(new Set([].concat(_toConsumableArray(allGames), _toConsumableArray(games)))).filter(function (e) {
        return e;
      })
    });
  }

  if (window.location.hostname.includes('.indiegala.com')) {
    if ($('i.fa-download:visible').length > 0) {
      var _GM_getValue2;

      var _allGames = ((_GM_getValue2 = GM_getValue('IG-Owned')) === null || _GM_getValue2 === void 0 ? void 0 : _GM_getValue2.games) || [];

      GM_setValue('IG-Owned', {
        time: new Date().getTime(),
        games: _toConsumableArray(new Set([].concat(_toConsumableArray(_allGames), [window.location.pathname.replace('/', '')]))).filter(function (e) {
          return e;
        })
      });
    }
  }

  var loadTimes = 0;
  var observer = new MutationObserver(checkIgOwned);
  observer.observe(document.documentElement, {
    attributes: false,
    characterData: false,
    childList: true,
    subtree: true
  });

  function checkIgOwned() {
    var _GM_getValue3;

    var first = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    loadTimes++;

    if (loadTimes > 1000) {
      observer.disconnect();
      return;
    }

    var allGames = (((_GM_getValue3 = GM_getValue('IG-Owned')) === null || _GM_getValue3 === void 0 ? void 0 : _GM_getValue3.games) || []).filter(function (e) {
      return e;
    });
    var igLink = $('a[href*=".indiegala.com"]:not(".ig-checked")');
    if (igLink.length === 0) return;
    if (first === true) syncIgLib(false, false);

    var _iterator = _createForOfIteratorHelper($.makeArray(igLink)),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var el = _step.value;
        var $this = $(el).addClass('ig-checked');
        var href = $this.attr('href');
        console.log(new URL(href).hostname.split('.')[0].toLowerCase());

        if (/^https?:\/\/.+?\.indiegala\.com/.test(href) && (allGames.includes(new URL(href).pathname.replace(/\//g, '').toLowerCase()) || allGames.includes(new URL(href).hostname.split('.')[0].toLowerCase()))) {
          var itemContDiv = $this.parents('.item-cont');

          if (window.location.hostname === 'www.indiegala.com' && itemContDiv.length > 0) {
            itemContDiv.addClass('ig-owned');
          } else {
            $this.addClass('ig-owned');
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  unsafeWindow.syncIgLib = /*#__PURE__*/function () {
    var _syncIgLib = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var _GM_getValue4;

      var notice,
          update,
          allGames,
          cookies,
          _yield$getGames,
          _yield$getGames2,
          pages,
          games,
          i,
          _yield$getGames3,
          _yield$getGames4,
          _games,
          _args = arguments;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              notice = _args.length > 0 && _args[0] !== undefined ? _args[0] : false;
              update = _args.length > 1 && _args[1] !== undefined ? _args[1] : false;

              if (GM_getValue('IG-Verified')) {
                _context.next = 5;
                break;
              }

              if (notice) {
                Swal.fire({
                  title: '请先完成验证！',
                  icon: 'error',
                  html: '<a href="https://www.indiegala.com/library" target="_blank">前往验证</a>',
                  showCancelButton: true,
                  confirmButtonText: '老子完成验证了',
                  cancelButtonText: '关闭'
                }).then(function (_ref) {
                  var value = _ref.value;

                  if (value) {
                    GM_setValue('IG-Verified', true);
                  }
                });
              } else if (!GM_getValue('IG-Ignore')) {
                Swal.fire({
                  title: '[IG-Owned]提醒',
                  icon: 'error',
                  html: '获取IG游戏库失败，请<a href="https://www.indiegala.com/library" target="_blank">前往验证</a>',
                  showCancelButton: true,
                  showDenyButton: true,
                  confirmButtonText: '老子完成验证了',
                  cancelButtonText: '关闭',
                  denyButtonText: '不再提醒'
                }).then(function (_ref2) {
                  var value = _ref2.value,
                      isDenied = _ref2.isDenied;

                  if (isDenied) {
                    GM_setValue('IG-Ignore', true);
                    return;
                  }

                  if (value) {
                    GM_setValue('IG-Verified', true);
                  }
                });
              }

              return _context.abrupt("return", []);

            case 5:
              allGames = ((_GM_getValue4 = GM_getValue('IG-Owned')) === null || _GM_getValue4 === void 0 ? void 0 : _GM_getValue4.games) || [];
              _context.next = 8;
              return getCookies();

            case 8:
              cookies = _context.sent;
              _context.next = 11;
              return getGames(1, notice, cookies);

            case 11:
              _yield$getGames = _context.sent;
              _yield$getGames2 = _slicedToArray(_yield$getGames, 2);
              pages = _yield$getGames2[0];
              games = _yield$getGames2[1];

              if (!(pages === 0)) {
                _context.next = 17;
                break;
              }

              return _context.abrupt("return");

            case 17:
              allGames = [].concat(_toConsumableArray(allGames), _toConsumableArray(games));

              if (!(pages > 1 && update)) {
                _context.next = 30;
                break;
              }

              i = 2;

            case 20:
              if (!(i <= pages)) {
                _context.next = 30;
                break;
              }

              _context.next = 23;
              return getGames(i, notice, cookies);

            case 23:
              _yield$getGames3 = _context.sent;
              _yield$getGames4 = _slicedToArray(_yield$getGames3, 2);
              _games = _yield$getGames4[1];
              allGames = [].concat(_toConsumableArray(allGames), _toConsumableArray(_games));

            case 27:
              i++;
              _context.next = 20;
              break;

            case 30:
              allGames = _toConsumableArray(new Set(allGames));
              GM_setValue('IG-Owned', {
                time: new Date().getTime(),
                games: allGames.filter(function (e) {
                  return e;
                })
              });

              if (notice) {
                Swal.fire({
                  title: '同步完成！',
                  icon: 'success'
                });
              }

              return _context.abrupt("return", allGames);

            case 34:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function syncIgLib() {
      return _syncIgLib.apply(this, arguments);
    }

    return syncIgLib;
  }();

  function getGames(page, notice, cookies) {
    if (notice) {
      Swal.fire({
        title: '正在同步第' + page + '页...',
        icon: 'info'
      });
    }

    return TM_request({
      url: 'https://www.indiegala.com/library/showcase/' + page,
      method: 'GET',
      timeout: 30000,
      retry: 3,
      headers: {
        cookie: cookies
      }
    }).then(function (response) {
      if (new URL(response.finalUrl).pathname === '/login') {
        if (notice) {
          Swal.fire({
            title: '请先登录！',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: '登录',
            cancelButtonText: '关闭'
          }).then(function (_ref3) {
            var value = _ref3.value;

            if (value) {
              window.open('https://www.indiegala.com/login', '_blank');
            }
          });
        } else {
          $('body').overhang({
            type: 'error',
            message: 'IG登录凭证已过期，请重新登录<a href="https://www.indiegala.com/login" target="_blank">https://www.indiegala.com/login</a>',
            html: true,
            closeConfirm: true
          });
        }

        return [0, []];
      }

      if (response.status === 200) {
        if (response.responseText.includes('Profile locked')) {
          if (notice) {
            Swal.fire({
              title: '请先完成验证！',
              icon: 'error',
              html: '<a href="https://www.indiegala.com/library" target="_blank">前往验证</a>',
              showCancelButton: true,
              confirmButtonText: '老子完成验证了',
              cancelButtonText: '关闭'
            }).then(function (_ref4) {
              var value = _ref4.value;

              if (value) {
                GM_setValue('IG-Verified', true);
              }
            });
          }

          GM_setValue('IG-Verified', false);
          return [0, []];
        }

        GM_setValue('IG-Verified', true);
        var html = $(response.responseText);
        var pages = 1;

        if (page === 1) {
          var _html$find$attr, _html$find$attr$match;

          var lastPageNum = parseInt((_html$find$attr = html.find('a.profile-private-page-library-pagination-item[href*="library/showcase"]:has(.fa-angle-double-right)').attr('href')) === null || _html$find$attr === void 0 ? void 0 : (_html$find$attr$match = _html$find$attr.match(/[\d]+/)) === null || _html$find$attr$match === void 0 ? void 0 : _html$find$attr$match[0]);

          if (!isNaN(lastPageNum)) {
            pages = lastPageNum;
          }
        }

        var _games2 = _toConsumableArray($.makeArray(html.find('a.library-showcase-title')).map(function (e) {
          var _$$attr2, _$$attr2$match, _$$attr2$match$;

          return (_$$attr2 = $(e).attr('href')) === null || _$$attr2 === void 0 ? void 0 : (_$$attr2$match = _$$attr2.match(/https:\/\/.*?\.indiegala\.com\/(.*)/)) === null || _$$attr2$match === void 0 ? void 0 : (_$$attr2$match$ = _$$attr2$match[1]) === null || _$$attr2$match$ === void 0 ? void 0 : _$$attr2$match$.toLowerCase();
        })).filter(function (e) {
          return e;
        });

        return [pages, _games2];
      } else {
        console.error(response);

        if (notice) {
          Swal.fire({
            title: '获取游戏库数据失败！',
            text: response.status,
            icon: 'error'
          });
        }
      }
    })["catch"](function (error) {
      console.error(error);

      if (notice) {
        Swal.fire({
          title: '获取游戏库数据失败！',
          icon: 'error'
        });
      }

      return [0, []];
    });
  }

  function getCookies() {
    return new Promise(function (resolve, reject) {
      GM_cookie.list({
        url: 'https://www.indiegala.com/library/showcase/1'
      }, function (cookies, error) {
        if (!error) {
          resolve(cookies.map(function (c) {
            return "".concat(c.name, "=").concat(c.value);
          }).join(';'));
        } else {
          reject(error);
        }
      });
    });
  }

  GM_registerMenuCommand('同步游戏库', function () {
    syncIgLib(true, true);
  });
  GM_addStyle('.ig-owned{color:#ffffff !important;background:#5c8a00 !important;}');
  GM_addStyle(GM_getResourceText('overhang'));

  if (!GM_getValue('IG-Owned')) {
    Swal.fire({
      title: '首次使用IG游戏库检测请先同步！',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '同步',
      cancelButtonText: '关闭'
    }).then(function (_ref5) {
      var value = _ref5.value;

      if (value) {
        syncIgLib(true, true);
      }
    });
    return;
  }

  checkIgOwned(true); // syncIgLib(false, false)
})();
