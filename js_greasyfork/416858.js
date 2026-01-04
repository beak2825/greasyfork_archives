"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// ==UserScript==
// @name               Steam愿望单重置
// @namespace          steam-wishlist-reset
// @version            1.0.8
// @description        清空Steam愿望单 & 恢复Steam愿望单
// @author             HCLonely
// @license            MIT
// @iconURL            https://auto-task-test.hclonely.com/img/favicon.ico
// @homepage           https://github.com/HCLonely/steam-wishlist-reset
// @supportURL         https://github.com/HCLonely/steam-wishlist-reset/issues
// @include            *://store.steampowered.com/wishlist/profiles/*
// @include            *://store.steampowered.com/wishlist/id/*
// @require            https://cdn.jsdelivr.net/npm/sweetalert2@10.10.2/dist/sweetalert2.all.min.js
// @require            https://cdn.jsdelivr.net/npm/regenerator-runtime@0.13.5/runtime.min.js
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_deleteValue
// @grant              GM_addStyle
// @grant              GM_xmlhttpRequest
// @grant              GM_registerMenuCommand
// @run-at             document-end
// @downloadURL https://update.greasyfork.org/scripts/416858/Steam%E6%84%BF%E6%9C%9B%E5%8D%95%E9%87%8D%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/416858/Steam%E6%84%BF%E6%9C%9B%E5%8D%95%E9%87%8D%E7%BD%AE.meta.js
// ==/UserScript==

/* global Swal,g_sessionID,g_AccountID,Blob,FileReader */
(function () {
  GM_addStyle('#swal2-title{color:#000!important;}#swal2-content a{color:#2f89bc!important;}');

  function clearWishlist() {
    return _clearWishlist.apply(this, arguments);
  }

  function _clearWishlist() {
    _clearWishlist = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var limit, wishlistGames, _GM_setValue, list, time, len, i;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              limit = GM_getValue('limit') || 0;
              _context2.next = 3;
              return getWishlistFromServer();

            case 3:
              wishlistGames = _context2.sent;
              wishlistGames.splice(0, limit);

              if (!((wishlistGames === null || wishlistGames === void 0 ? void 0 : wishlistGames.length) > 0)) {
                _context2.next = 22;
                break;
              }

              list = ((_GM_setValue = GM_setValue('list')) === null || _GM_setValue === void 0 ? void 0 : _GM_setValue.length) > 0 ? GM_setValue('list') : [];
              time = new Date().getTime();
              list.push(time);
              GM_setValue(time, wishlistGames);
              GM_setValue('list', list);
              len = wishlistGames.length;
              i = 0;

            case 13:
              if (!(i < len)) {
                _context2.next = 19;
                break;
              }

              _context2.next = 16;
              return removeFromWishlist(wishlistGames[i], i, len);

            case 16:
              i++;
              _context2.next = 13;
              break;

            case 19:
              Swal.fire({
                icon: 'success',
                title: '愿望单清空完成（忽略所有错误）',
                confirmButtonText: '保存愿望单数据到本地',
                showCancelButton: true,
                cancelButtonText: '关闭'
              }).then(function (_ref2) {
                var value = _ref2.value;

                if (value) {
                  createAndDownloadFile('wishlists.json', JSON.stringify(wishlistGames));
                }
              });
              _context2.next = 23;
              break;

            case 22:
              Swal.fire({
                icon: 'warning',
                title: '愿望单为空！'
              });

            case 23:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _clearWishlist.apply(this, arguments);
  }

  function removeFromWishlist(gameId, i, len) {
    return new Promise(function (resolve) {
      Swal[i === 0 ? 'fire' : 'update']({
        title: '正在移除愿望单游戏',
        text: gameId + ' (' + (i + 1) + '/' + len + ')'
      });
      GM_xmlhttpRequest({
        url: 'https://store.steampowered.com/api/removefromwishlist',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: "sessionid=".concat(g_sessionID, "&appid=").concat(gameId),
        responseType: 'json',
        onload: function onload(response) {
          console.log(response);
          resolve();
        },
        ontimeout: resolve,
        onerror: resolve,
        onabort: resolve
      });
    });
  }

  function recoverWishlist(_x) {
    return _recoverWishlist.apply(this, arguments);
  }

  function _recoverWishlist() {
    _recoverWishlist = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(games) {
      var oldWishlist, newWishlist, failedGames, len, i, _newWishlist;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (games) {
                _context3.next = 10;
                break;
              }

              _context3.next = 3;
              return getWishlistFromLocal();

            case 3:
              oldWishlist = _context3.sent;

              if (!(oldWishlist === 'cancel')) {
                _context3.next = 6;
                break;
              }

              return _context3.abrupt("return");

            case 6:
              _context3.next = 8;
              return getWishlistFromServer();

            case 8:
              newWishlist = _context3.sent;
              games = oldWishlist === null || oldWishlist === void 0 ? void 0 : oldWishlist.filter(function (item) {
                return !(newWishlist !== null && newWishlist !== void 0 && newWishlist.includes(item));
              });

            case 10:
              if (!games) {
                _context3.next = 30;
                break;
              }

              failedGames = [];
              len = games.length;
              i = 0;

            case 14:
              if (!(i < len)) {
                _context3.next = 22;
                break;
              }

              _context3.next = 17;
              return addToWishlist(games[i], i, len);

            case 17:
              if (_context3.sent) {
                _context3.next = 19;
                break;
              }

              failedGames.push(games[i]);

            case 19:
              i++;
              _context3.next = 14;
              break;

            case 22:
              _context3.next = 24;
              return getWishlistFromServer();

            case 24:
              _newWishlist = _context3.sent;

              if (_newWishlist) {
                failedGames = games.filter(function (item) {
                  return !_newWishlist.includes(item);
                });
              }

              console.log('恢复失败的游戏：', failedGames);
              Swal.fire({
                icon: 'success',
                title: failedGames.length > 0 ? '愿望单恢复完成，恢复失败的游戏：' : '所有愿望单游戏恢复完成！',
                html: failedGames.length > 0 ? JSON.stringify(failedGames).replace(/[\d]+/g, function (gameId) {
                  return "<a href=https://store.steampowered.com/app/".concat(gameId, " target=\"_blank\">").concat(gameId, "</a>");
                }) : '',
                showConfirmButton: failedGames.length > 0,
                confirmButtonText: '重新恢复失败的游戏',
                showCancelButton: true,
                cancelButtonText: '关闭'
              }).then(function (_ref3) {
                var value = _ref3.value;

                if (value) {
                  recoverWishlist(failedGames);
                }
              });
              _context3.next = 31;
              break;

            case 30:
              Swal.fire({
                icon: 'error',
                title: '没有读取到游戏列表'
              });

            case 31:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _recoverWishlist.apply(this, arguments);
  }

  function addToWishlist(gameId, i, len) {
    return new Promise(function (resolve) {
      Swal[i === 0 ? 'fire' : 'update']({
        title: '正在恢复愿望单游戏',
        text: gameId + ' (' + (i + 1) + '/' + len + ')'
      });
      GM_xmlhttpRequest({
        url: 'https://store.steampowered.com/api/addtowishlist',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: "sessionid=".concat(g_sessionID, "&appid=").concat(gameId),
        responseType: 'json',
        onload: function onload(response) {
          var _response$response;

          console.log(response);

          if (response.status === 200 && ((_response$response = response.response) === null || _response$response === void 0 ? void 0 : _response$response.success) === true) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        ontimeout: function ontimeout() {
          resolve(false);
        },
        onerror: function onerror() {
          resolve(false);
        },
        onabort: function onabort() {
          resolve(false);
        }
      });
    });
  }

  function exportWishlist() {
    return _exportWishlist.apply(this, arguments);
  }

  function _exportWishlist() {
    _exportWishlist = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      var wishlists;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return getWishlistFromServer();

            case 2:
              wishlists = _context4.sent;
              createAndDownloadFile('wishlists.json', JSON.stringify(wishlists));

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _exportWishlist.apply(this, arguments);
  }

  function createAndDownloadFile(fileName, content) {
    var aTag = document.createElement('a');
    var blob = new Blob([content]);
    aTag.download = fileName;
    aTag.href = URL.createObjectURL(blob);
    aTag.click();
    URL.revokeObjectURL(blob);
  }

  function getWishlistFromServer() {
    return new Promise(function (resolve) {
      Swal.fire({
        title: '正在获取愿望单列表',
        text: '请耐心等待...'
      });
      GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://store.steampowered.com/dynamicstore/userdata/?id=' + g_AccountID + '&cc=CN&v=70',
        nocache: true,
        responseType: 'json',
        onload: function () {
          var _onload = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(response) {
            var _response$response2;

            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (response.status === 200 && response !== null && response !== void 0 && (_response$response2 = response.response) !== null && _response$response2 !== void 0 && _response$response2.rgWishlist) {
                      Swal.fire({
                        icon: 'success',
                        title: '获取愿望单列表成功！'
                      });
                      resolve(response.response.rgWishlist);
                    } else {
                      Swal.fire({
                        icon: 'error',
                        title: '获取愿望单列表失败！'
                      });
                      resolve(false);
                    }

                  case 1:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          function onload(_x2) {
            return _onload.apply(this, arguments);
          }

          return onload;
        }(),
        ontimeout: function ontimeout(e) {
          console.log(e);
          Swal.fire({
            icon: 'error',
            title: '获取愿望单列表失败！'
          });
          resolve(false);
        },
        onerror: function onerror(e) {
          console.log(e);
          Swal.fire({
            icon: 'error',
            title: '获取愿望单列表失败！'
          });
          resolve(false);
        },
        onabort: function onabort(e) {
          console.log(e);
          Swal.fire({
            icon: 'error',
            title: '获取愿望单列表失败！'
          });
          resolve(false);
        }
      });
    });
  }

  function getWishlistFromLocal() {
    return _getWishlistFromLocal.apply(this, arguments);
  }

  function _getWishlistFromLocal() {
    _getWishlistFromLocal = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
      var games, type, list, listId, _yield$Swal$fire, file;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return Swal.fire({
                confirmButtonText: '从缓存中读取',
                showDenyButton: true,
                denyButtonText: '从文件中读取'
              }).then(function (result) {
                if (result.isConfirmed) {
                  return 'cache';
                }

                if (result.isDenied) {
                  return 'file';
                }

                return false;
              });

            case 2:
              type = _context5.sent;

              if (!(type === 'cache')) {
                _context5.next = 10;
                break;
              }

              Swal.fire({
                title: '正在读取愿望单列表',
                text: '请稍等...'
              });
              list = GM_getValue('list');
              listId = list ? list[list.length - 1] : null;
              games = listId ? GM_getValue(listId) : null;
              _context5.next = 23;
              break;

            case 10:
              if (!(type === 'file')) {
                _context5.next = 22;
                break;
              }

              _context5.next = 13;
              return Swal.fire({
                title: '请选择要读取的文件',
                input: 'file',
                inputAttributes: {
                  accept: 'application/json',
                  'aria-label': '上传你的愿望单列表'
                }
              });

            case 13:
              _yield$Swal$fire = _context5.sent;
              file = _yield$Swal$fire.value;

              if (!file) {
                _context5.next = 20;
                break;
              }

              Swal.fire({
                title: '正在读取愿望单列表',
                text: '如果长时间没反应，请打开控制台查看报错'
              });
              _context5.next = 19;
              return new Promise(function (resolve) {
                var reader = new FileReader();

                reader.onload = function (e) {
                  resolve(JSON.parse(e.target.result));
                };

                reader.onerror = function (e) {
                  resolve(false);
                };

                reader.readAsText(file);
              });

            case 19:
              games = _context5.sent;

            case 20:
              _context5.next = 23;
              break;

            case 22:
              games = 'cancel';

            case 23:
              return _context5.abrupt("return", games);

            case 24:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));
    return _getWishlistFromLocal.apply(this, arguments);
  }

  function setting() {
    Swal.fire({
      title: '请输入要保留的游戏数量',
      input: 'text',
      inputLabel: '由于忽略了错误，实际保留的游戏数量可能比你设置的要多几个！',
      inputValue: GM_getValue('limit') || 0,
      showCancelButton: true,
      inputValidator: function inputValidator(value) {
        if (!/^[\d]+$/.test(value)) {
          return '请输入正确的数字！';
        }
      }
    }).then(function (_ref) {
      var value = _ref.value;

      if (/^[\d]+$/.test(value)) {
        GM_setValue('limit', parseInt(value));
        Swal.fire({
          title: '保存成功',
          icon: 'success'
        });
      } else if (value) {
        Swal.fire({
          title: '请输入正确的数字！',
          icon: 'error'
        });
      }
    });
  }

  GM_registerMenuCommand('清空愿望单', clearWishlist);
  GM_registerMenuCommand('恢复愿望单', function () {
    recoverWishlist();
  });
  GM_registerMenuCommand('导出愿望单', exportWishlist);
  GM_registerMenuCommand('保留的游戏数量', setting);
})();
