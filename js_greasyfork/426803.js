"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// ==UserScript==
// @name               gistSync
// @namespace          gistSync
// @version            1.0.3
// @description        使用gist进行数据同步
// @author             HCLonely
// @license            MIT
// @include            *://*/*
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_listValues
// @grant              GM_xmlhttpRequest
// @grant              GM_registerMenuCommand
// @require            https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
// @require            https://cdn.jsdelivr.net/npm/regenerator-runtime@0.13.7/runtime.min.js
// @require            https://cdn.jsdelivr.net/npm/sweetalert2@9
// @require            https://cdn.jsdelivr.net/npm/promise-polyfill@8.1.3/dist/polyfill.min.js
// @require            https://greasyfork.org/scripts/418102-tm-request/code/TM_request.js?version=902218
// @connect            api.github.com
// @run-at             document-end
// ==/UserScript==

/* global Swal,TM_request, GM_setValue, GM_getValue, GM_listValues */

/*
const { TOKEN, GIST_ID, FILE_NAME, AUTO_SYNC } = GM_getValue('gistConf') || { TOKEN: '', GIST_ID: '', FILE_NAME: '' }
if (TOKEN && GIST_ID && FILE_NAME && AUTO_SYNC){

}
*/
function setGistData(token, gistId, fileName, content) {
  var data = JSON.stringify({
    files: _defineProperty({}, fileName, {
      content: JSON.stringify(content)
    })
  });
  return TM_request({
    url: 'https://api.github.com/gists/' + gistId,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: 'token ' + token
    },
    data: data,
    responseType: 'json',
    method: 'POST',
    timeout: 30000,
    retry: 3
  }).then(function (response) {
    var _response$response, _response$response$fi, _response$response$fi2;

    if (response.status === 200 && ((_response$response = response.response) === null || _response$response === void 0 ? void 0 : (_response$response$fi = _response$response.files) === null || _response$response$fi === void 0 ? void 0 : (_response$response$fi2 = _response$response$fi[fileName]) === null || _response$response$fi2 === void 0 ? void 0 : _response$response$fi2.content) === JSON.stringify(content)) {
      return true;
    } else {
      console.error(response);
      return false;
    }
  })["catch"](function (error) {
    console.error(error);
    return false;
  });
}

function getGistData(token, gistId, fileName) {
  return TM_request({
    url: 'https://api.github.com/gists/' + gistId,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: 'token ' + token
    },
    responseType: 'json',
    method: 'GET',
    timeout: 30000,
    retry: 3
  }).then(function (response) {
    if (response.status === 200) {
      var _response$response2, _response$response2$f, _response$response2$f2;

      return JSON.parse(((_response$response2 = response.response) === null || _response$response2 === void 0 ? void 0 : (_response$response2$f = _response$response2.files) === null || _response$response2$f === void 0 ? void 0 : (_response$response2$f2 = _response$response2$f[fileName]) === null || _response$response2$f2 === void 0 ? void 0 : _response$response2$f2.content) || null);
    } else {
      console.error(response);
      return false;
    }
  })["catch"](function (error) {
    console.error(error);
    return false;
  });
}

function setting() {
  var _ref = GM_getValue('gistConf') || {
    TOKEN: '',
    GIST_ID: '',
    FILE_NAME: ''
  },
      TOKEN = _ref.TOKEN,
      GIST_ID = _ref.GIST_ID,
      FILE_NAME = _ref.FILE_NAME;

  Swal.fire({
    title: 'Gist 设置',
    html: '<p>Github Token<input id="github-token" class="swal2-input" placeholder="Github Token" value="' + TOKEN + '"></p>' + '<p>Gist ID<input id="gist-id" class="swal2-input" placeholder="Gist ID" value="' + GIST_ID + '"></p>' + '<p>文件名<input id="file-name" class="swal2-input" placeholder="文件名" value="' + FILE_NAME + '"></p>' + // '<p><input id="auto-sync" type="checkbox" ' + (AUTO_SYNC ? 'checked="checked"' : '') + '><span class="swal2-label">自动同步</span></p>' +
    '<p>' + '<button id="upload-data" type="button" class="swal2-confirm swal2-styled" aria-label="" style="display: inline-block;">同步到Gist</button>' + '<button id="download-data" type="button" class="swal2-confirm swal2-styled" aria-label="" style="display: inline-block;">从Gist同步</button>' + '</p>',
    focusConfirm: false,
    showLoaderOnConfirm: true,
    footer: '<a href="https://github.com/HCLonely/IG-Helper/blob/master/README.md" target-"_blank" class>帮助？</a>',
    preConfirm: function () {
      var _preConfirm = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var token, gistId, fileName;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                token = document.getElementById('github-token').value;
                gistId = document.getElementById('gist-id').value;
                fileName = document.getElementById('file-name').value; // const autoSync = document.getElementById('auto-sync').checked

                GM_setValue('gistConf', {
                  TOKEN: token,
                  GIST_ID: gistId,
                  FILE_NAME: fileName
                  /* , AUTO_SYNC: autoSync */

                });
                _context.next = 6;
                return getGistData(token, gistId, fileName);

              case 6:
                return _context.abrupt("return", _context.sent);

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function preConfirm() {
        return _preConfirm.apply(this, arguments);
      }

      return preConfirm;
    }(),
    allowOutsideClick: function allowOutsideClick() {
      return !Swal.isLoading();
    },
    confirmButtonText: '保存配置并测试',
    showCancelButton: true,
    cancelButtonText: '关闭'
  }).then(function (_ref2) {
    var value = _ref2.value;

    if (value) {
      Swal.fire({
        icon: 'success',
        title: '测试成功！'
      }).then(function () {
        setting();
      });
    } else if (value !== undefined) {
      Swal.fire({
        icon: 'error',
        title: '测试失败！'
      }).then(function () {
        setting();
      });
    }
  });
  $('#upload-data').click( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var _ref4, TOKEN, GIST_ID, FILE_NAME, data, names, _iterator, _step, name;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _ref4 = GM_getValue('gistConf') || {}, TOKEN = _ref4.TOKEN, GIST_ID = _ref4.GIST_ID, FILE_NAME = _ref4.FILE_NAME;

            if (TOKEN && GIST_ID && FILE_NAME) {
              _context2.next = 3;
              break;
            }

            return _context2.abrupt("return", Swal.fire({
              icon: 'error',
              title: '请先保存配置并测试！'
            }).then(function () {
              setting();
            }));

          case 3:
            Swal.fire({
              icon: 'info',
              title: '正在处理数据...'
            });
            data = {};
            names = GM_listValues();
            _iterator = _createForOfIteratorHelper(names);
            _context2.prev = 7;

            _iterator.s();

          case 9:
            if ((_step = _iterator.n()).done) {
              _context2.next = 16;
              break;
            }

            name = _step.value;

            if (!(name === 'gistConf')) {
              _context2.next = 13;
              break;
            }

            return _context2.abrupt("continue", 14);

          case 13:
            data[name] = GM_getValue(name);

          case 14:
            _context2.next = 9;
            break;

          case 16:
            _context2.next = 21;
            break;

          case 18:
            _context2.prev = 18;
            _context2.t0 = _context2["catch"](7);

            _iterator.e(_context2.t0);

          case 21:
            _context2.prev = 21;

            _iterator.f();

            return _context2.finish(21);

          case 24:
            Swal.update({
              icon: 'info',
              title: '正在上传数据...'
            });
            _context2.next = 27;
            return setGistData(TOKEN, GIST_ID, FILE_NAME, data);

          case 27:
            if (!_context2.sent) {
              _context2.next = 31;
              break;
            }

            Swal.fire({
              icon: 'success',
              title: '同步数据成功！'
            });
            _context2.next = 32;
            break;

          case 31:
            Swal.fire({
              icon: 'error',
              title: '同步数据失败，请在控制台查看错误信息！'
            });

          case 32:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[7, 18, 21, 24]]);
  })));
  $('#download-data').click( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var _ref6, TOKEN, GIST_ID, FILE_NAME, data, _i, _Object$entries, _Object$entries$_i, name, value;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _ref6 = GM_getValue('gistConf') || {}, TOKEN = _ref6.TOKEN, GIST_ID = _ref6.GIST_ID, FILE_NAME = _ref6.FILE_NAME;

            if (TOKEN && GIST_ID && FILE_NAME) {
              _context3.next = 3;
              break;
            }

            return _context3.abrupt("return", Swal.fire({
              icon: 'error',
              title: '请先保存配置并测试！'
            }).then(function () {
              setting();
            }));

          case 3:
            Swal.fire({
              icon: 'info',
              title: '正在下载数据...'
            });
            _context3.next = 6;
            return getGistData(TOKEN, GIST_ID, FILE_NAME);

          case 6:
            data = _context3.sent;

            if (data) {
              _context3.next = 9;
              break;
            }

            return _context3.abrupt("return", Swal.fire({
              icon: 'error',
              title: '没有检测到远程数据，请确认配置是否正确！'
            }).then(function () {
              setting();
            }));

          case 9:
            Swal.update({
              icon: 'info',
              title: '正在保存数据...'
            });

            for (_i = 0, _Object$entries = Object.entries(data); _i < _Object$entries.length; _i++) {
              _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), name = _Object$entries$_i[0], value = _Object$entries$_i[1];
              GM_setValue(name, value);
            }

            Swal.fire({
              icon: 'success',
              title: '同步数据成功！'
            });

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));
}

GM_registerMenuCommand('数据同步设置', setting);
