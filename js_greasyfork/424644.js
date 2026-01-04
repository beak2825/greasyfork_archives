"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// ==UserScript==
// @name            miaochuan
// @namespace       moe.cangku.mengzonefire
// @version         1.6.7
// @description     用于提取和生成dupan秒传链接
// @author          mengzonefire
// @license         MIT
// @supportURL      https://github.com/mengzonefire/dupan-rapid-extract/issues
// @contributionURL https://afdian.net/@mengzonefire
// @match           *://pan.baidu.com/disk/home*
// @match           *://yun.baidu.com/disk/home*
// @resource sweetalert2Css https://cdn.jsdelivr.net/npm/sweetalert2@8/dist/sweetalert2.min.css
// @require         https://cdn.jsdelivr.net/npm/sweetalert2@8/dist/sweetalert2.min.js
// @require         https://cdn.jsdelivr.net/npm/js-base64
// @require         https://cdn.staticfile.org/spark-md5/3.0.0/spark-md5.min.js
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_setClipboard
// @grant           GM_xmlhttpRequest
// @grant           GM_info
// @grant           GM_getResourceText
// @grant           GM_addStyle
// @run-at          document-start
// @connect         *
// @downloadURL https://update.greasyfork.org/scripts/424644/miaochuan.user.js
// @updateURL https://update.greasyfork.org/scripts/424644/miaochuan.meta.js
// ==/UserScript==
!function () {
  'use strict';

  var meta_url = 'http://pcs.baidu.com/rest/2.0/pcs/file?app_id=778750&method=meta&path=';
  var info_url = 'https://pan.baidu.com/rest/2.0/xpan/nas?method=uinfo';
  var api_url = 'http://pan.baidu.com/rest/2.0/xpan/multimedia?method=listall&order=name&limit=10000';
  var pcs_url = 'https://pcs.baidu.com/rest/2.0/pcs/file';
  var create_url = 'https://pan.baidu.com/api/create?bdstoken=';
  var precreate_url = 'https://pan.baidu.com/api/precreate';
  var bdstoken_url = 'https://pan.baidu.com/api/gettemplatevariable';
  var appid_list = ['266719', '265486', '250528', '778750', '498065', '309847']; //使用'250528', '265486', '266719', 下载50M以上的文件会报403, 黑号情况下部分文件也会报403

  var bad_md5 = ['fcadf26fc508b8039bee8f0901d9c58e', '2d9a55b7d5fe70e74ce8c3b2be8f8e43', 'b912d5b77babf959865100bf1d0c2a19'];
  var css_url = {
    'Minimal': 'https://cdn.jsdelivr.net/npm/sweetalert2@8/dist/sweetalert2.min.css',
    'Dark': 'https://cdn.jsdelivr.net/npm/@sweetalert2/theme-dark@4/dark.css',
    'WordPress Admin': 'https://cdn.jsdelivr.net/npm/@sweetalert2/theme-wordpress-admin@4/wordpress-admin.css',
    'Material UI': 'https://cdn.jsdelivr.net/npm/@sweetalert2/theme-material-ui@4/material-ui.css',
    'Bulma': 'https://cdn.jsdelivr.net/npm/@sweetalert2/theme-bulma@4/bulma.css',
    'Bootstrap 4': 'https://cdn.jsdelivr.net/npm/@sweetalert2/theme-bootstrap-4@4/bootstrap-4.css'
  };
  var css_checkbox = "input[type='checkbox'],\n    input[type='radio'] {\n      --active: #275EFE;\n      --active-inner: #fff;\n      --focus: 2px rgba(39, 94, 254, .3);\n      --border: #BBC1E1;\n      --border-hover: #275EFE;\n      --background: #fff;\n      --disabled: #F6F8FF;\n      --disabled-inner: #E1E6F9;\n      -webkit-appearance: none;\n      -moz-appearance: none;\n      height: 21px;\n      outline: none;\n      display: inline-block;\n      vertical-align: top;\n      position: relative;\n      margin: 0;\n      cursor: pointer;\n      border: 1px solid var(--bc, var(--border));\n      background: var(--b, var(--background));\n      -webkit-transition: background .3s, border-color .3s, box-shadow .2s;\n      transition: background .3s, border-color .3s, box-shadow .2s;\n    }\n    input[type='checkbox']:after,\n    input[type='radio']:after {\n      content: '';\n      display: block;\n      left: 0;\n      top: 0;\n      position: absolute;\n      -webkit-transition: opacity var(--d-o, 0.2s), -webkit-transform var(--d-t, 0.3s) var(--d-t-e, ease);\n      transition: opacity var(--d-o, 0.2s), -webkit-transform var(--d-t, 0.3s) var(--d-t-e, ease);\n      transition: transform var(--d-t, 0.3s) var(--d-t-e, ease), opacity var(--d-o, 0.2s);\n      transition: transform var(--d-t, 0.3s) var(--d-t-e, ease), opacity var(--d-o, 0.2s), -webkit-transform var(--d-t, 0.3s) var(--d-t-e, ease);\n    }\n    input[type='checkbox']:checked,\n    input[type='radio']:checked {\n      --b: var(--active);\n      --bc: var(--active);\n      --d-o: .3s;\n      --d-t: .6s;\n      --d-t-e: cubic-bezier(.2, .85, .32, 1.2);\n    }\n    input[type='checkbox']:disabled,\n    input[type='radio']:disabled {\n      --b: var(--disabled);\n      cursor: not-allowed;\n      opacity: .9;\n    }\n    input[type='checkbox']:disabled:checked,\n    input[type='radio']:disabled:checked {\n      --b: var(--disabled-inner);\n      --bc: var(--border);\n    }\n    input[type='checkbox']:disabled + label,\n    input[type='radio']:disabled + label {\n      cursor: not-allowed;\n    }\n    input[type='checkbox']:hover:not(:checked):not(:disabled),\n    input[type='radio']:hover:not(:checked):not(:disabled) {\n      --bc: var(--border-hover);\n    }\n    input[type='checkbox']:focus,\n    input[type='radio']:focus {\n      box-shadow: 0 0 0 var(--focus);\n    }\n    input[type='checkbox']:not(.switch),\n    input[type='radio']:not(.switch) {\n      width: 21px;\n    }\n    input[type='checkbox']:not(.switch):after,\n    input[type='radio']:not(.switch):after {\n      opacity: var(--o, 0);\n    }\n    input[type='checkbox']:not(.switch):checked,\n    input[type='radio']:not(.switch):checked {\n      --o: 1;\n    }\n    input[type='checkbox'] + label,\n    input[type='radio'] + label {\n      font-size: 18px;\n      line-height: 21px;\n      display: inline-block;\n      vertical-align: top;\n      cursor: pointer;\n      margin-left: 4px;\n    }\n  \n    input[type='checkbox']:not(.switch) {\n      border-radius: 7px;\n    }\n    input[type='checkbox']:not(.switch):after {\n      width: 5px;\n      height: 9px;\n      border: 2px solid var(--active-inner);\n      border-top: 0;\n      border-left: 0;\n      left: 7px;\n      top: 4px;\n      -webkit-transform: rotate(var(--r, 20deg));\n              transform: rotate(var(--r, 20deg));\n    }\n    input[type='checkbox']:not(.switch):checked {\n      --r: 43deg;\n    }\n    input[type='checkbox'].switch {\n      width: 38px;\n      border-radius: 11px;\n    }\n    input[type='checkbox'].switch:after {\n      left: 2px;\n      top: 2px;\n      border-radius: 50%;\n      width: 15px;\n      height: 15px;\n      background: var(--ab, var(--border));\n      -webkit-transform: translateX(var(--x, 0));\n              transform: translateX(var(--x, 0));\n    }\n    input[type='checkbox'].switch:checked {\n      --ab: var(--active-inner);\n      --x: 17px;\n    }\n    input[type='checkbox'].switch:disabled:not(:checked):after {\n      opacity: .6;\n    }";
  var failed = 0,
      vip_type = 0,
      interval = 0,
      check_mode = false,
      interval_mode = false,
      file_info_list = [],
      gen_success_list = [],
      dir,
      file_num,
      gen_num,
      gen_prog,
      codeInfo,
      recursive,
      bdcode,
      xmlhttpRequest,
      select_list,
      fix_dl,
      bdstoken;
  var myStyle = "style=\"width: 100%;height: 34px;display: block;line-height: 34px;text-align: center;\"";
  var myBtnStyle = "style=\"height: 26px;line-height: 26px;vertical-align: middle;\"";
  var html_btn = "<a class=\"g-button g-button-blue\" id=\"bdlink_btn\" title=\"\u79D2\u4F20\u94FE\u63A5\" style=\"display: inline-block;\"\">\n    <span class=\"g-button-right\"><em class=\"icon icon-disk\" title=\"\u79D2\u4F20\u94FE\u63A5\u63D0\u53D6\"></em><span class=\"text\" style=\"width: auto;\">\u79D2\u4F20\u94FE\u63A5</span></span></a>";
  var html_btn_gen = "<a class=\"g-button\" id=\"gen-bdlink-button\"><span class=\"g-button-right\"><em class=\"icon icon-share\"></em><span class=\"text\" style=\"width: auto;\">\u751F\u6210\u79D2\u4F20</span></span></a>";
  var html_fix_dl = "<a class=\"g-button\" id=\"fix-dl-button\"><span class=\"g-button-right\"><em class=\"icon icon-grid\"></em><span class=\"text\" style=\"width: auto;\">\u4FEE\u590D\u4E0B\u8F7D</span></span></a>";
  var html_check_md5 = "<p ".concat(myStyle, ">\u6D4B\u8BD5\u79D2\u4F20, \u53EF\u9632\u6B62\u79D2\u4F20\u5931\u6548<a class=\"g-button g-button-blue\" id=\"check_md5_btn\" ").concat(myBtnStyle, "><span class=\"g-button-right\" ").concat(myBtnStyle, "><span class=\"text\" style=\"width: auto;\">\u6D4B\u8BD5</span></span></a></p>");
  var html_document = "<p ".concat(myStyle, ">\u751F\u6210\u8FC7\u7A0B\u4E2D\u9047\u5230\u95EE\u9898\u53EF\u53C2\u8003<a class=\"g-button g-button-blue\" ").concat(myBtnStyle, " href=\"https://shimo.im/docs/TZ1JJuEjOM0wnFDH\" rel=\"noopener noreferrer\" target=\"_blank\"><span class=\"g-button-right\" ").concat(myBtnStyle, "><span class=\"text\" style=\"width: auto;\">\u5206\u4EAB\u6559\u7A0B</span></span></a></p>");
  var html_donate = "<p id=\"bdcode_donate\" ".concat(myStyle, ">\u82E5\u559C\u6B22\u8BE5\u811A\u672C, \u53EF\u524D\u5F80 <a href=\"https://afdian.net/@mengzonefire\" rel=\"noopener noreferrer\" target=\"_blank\">\u8D5E\u52A9\u9875</a> \u652F\u6301\u4F5C\u8005\n    <a class=\"g-button\" id=\"kill_donate\" ").concat(myBtnStyle, "><span class=\"g-button-right\" ").concat(myBtnStyle, "><span class=\"text\" style=\"width: auto;\">\u4E0D\u518D\u663E\u793A</span></span></a></p>");
  var html_feedback = "<p id=\"bdcode_feedback\" ".concat(myStyle, ">\u82E5\u6709\u4EFB\u4F55\u7591\u95EE, \u53EF\u524D\u5F80 <a href=\"https://greasyfork.org/zh-CN/scripts/397324\" rel=\"noopener noreferrer\" target=\"_blank\">\u811A\u672C\u9875</a> \u53CD\u9988\n    <a class=\"g-button\" id=\"kill_feedback\" ").concat(myBtnStyle, "><span class=\"g-button-right\" ").concat(myBtnStyle, "><span class=\"text\" style=\"width: auto;\">\u4E0D\u518D\u663E\u793A</span></span></a></p>");
  var csd_hint_html = '<p>弹出跨域访问窗口时,请选择"总是允许"或"总是允许全部"</p><img style="max-width: 100%; height: auto" src="https://pic.rmb.bdstatic.com/bjh/763ff5014cca49237cb3ede92b5b7ac5.png">';
  var fix_dl_checkbox = '<input id="fix_dl_checkbox" type="checkbox" value="1"><label for="fix_dl_checkbox">修复下载</label><p>修复无法下载的文件, 勾选并重新转存即可修复</p><p>(默认覆盖文件, 请先尝试直接转存, 若不能下载再勾选)</p>';
  var checkbox_par = {
    input: 'checkbox',
    inputValue: GM_getValue('with_path'),
    inputPlaceholder: '导出文件夹目录结构'
  };

  var show_prog = function show_prog(r) {
    gen_prog.textContent = "".concat(parseInt(r.loaded / r.total * 100), "%");
  };

  if (Base64.extendString) {
    Base64.extendString();
  }

  function randomStringTransform(string) {
    if (typeof string !== 'string') return false;
    var tempString = [];

    var _iterator = _createForOfIteratorHelper(string),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var i = _step.value;

        if (!Math.round(Math.random())) {
          tempString.push(i.toLowerCase());
        } else {
          tempString.push(i.toUpperCase());
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return tempString.join('');
  }

  function add_file_list(file_list) {
    var dir_list = [];
    file_list.forEach(function (item) {
      if (item.isdir) {
        dir_list.push(item.path);
      } else {
        file_info_list.push({
          'path': item.path,
          'size': item.size
        });
      }
    });

    if (dir_list.length) {
      Swal.fire({
        type: 'info',
        title: '选择中包含文件夹, 是否递归生成?',
        text: '若选是, 将同时生成各级子文件夹下的文件',
        allowOutsideClick: false,
        focusCancel: true,
        showCancelButton: true,
        reverseButtons: true,
        showCloseButton: true,
        confirmButtonText: '是',
        cancelButtonText: '否'
      }).then(function (result) {
        if (result.value) {
          recursive = true;
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          recursive = false;
        } else {
          return;
        }

        add_dir_list(dir_list);
      });
    } else {
      Gen_bdlink();
    }
  }

  function add_dir_list(dir_list) {
    var dir_id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    if (dir_id >= dir_list.length) {
      Gen_bdlink();
      return;
    }

    var path = dir_list[dir_id];
    var list_dir_par = {
      url: api_url + "&path=".concat(encodeURIComponent(path), "&recursion=").concat(recursive ? 1 : 0),
      type: 'GET',
      responseType: 'json',
      onload: function onload(r) {
        if (parseInt(r.status / 100) === 2) {
          if (!r.response.errno) {
            r.response.list.forEach(function (item) {
              item.isdir || file_info_list.push({
                'path': item.path,
                'size': item.size
              });
            });
          } else {
            file_info_list.push({
              'path': path,
              'errno': 810
            });
          }
        } else {
          file_info_list.push({
            'path': path,
            'errno': r.status
          });
        }

        add_dir_list(dir_list, dir_id + 1);
      },
      onerror: function onerror(r) {
        file_info_list.push({
          'path': path,
          'errno': 514
        });
        add_dir_list(dir_list, dir_id + 1);
      }
    };
    GM_xmlhttpRequest(list_dir_par);
  }

  function gen_bd_link_event() {
    if (!GM_getValue('gen_no_first')) {
      Swal.fire({
        title: '首次使用请注意',
        showCloseButton: true,
        allowOutsideClick: false,
        html: csd_hint_html
      }).then(function (result) {
        if (result.value) {
          GM_setValue('gen_no_first', true);
          select_list = getSelectedFileList();
          add_file_list(select_list);
        }
      });
      return;
    }

    if (GM_getValue('unfinish')) {
      Swal.fire({
        title: '检测到未完成的秒传任务',
        text: '是否继续进行？',
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(function (result) {
        if (result.value) {
          var unfinish_info = GM_getValue('unfinish');
          file_info_list = unfinish_info.file_info_list;
          Gen_bdlink(unfinish_info.file_id);
        } else {
          GM_deleteValue('unfinish');
          select_list = getSelectedFileList();
          add_file_list(select_list);
        }
      });
    } else {
      select_list = getSelectedFileList();
      add_file_list(select_list);
    }
  }

  function fix_dl_event() {
    select_list = getSelectedFileList();

    if (!GM_getValue('fix_no_first')) {
      Swal.fire({
        title: '首次使用请注意',
        showCloseButton: true,
        allowOutsideClick: false,
        html: csd_hint_html
      }).then(function (result) {
        if (result.value) {
          GM_setValue('fix_no_first', true);
          get_bdstoken();
        }
      });
      return;
    } else {
      get_bdstoken();
    }
  }

  function fix_dl_begain() {
    Swal.fire({
      title: "\u6587\u4EF6\u4FEE\u590D\u4E2D",
      showconfirmButton: false,
      showCancelButton: false,
      allowOutsideClick: false,
      onBeforeOpen: function onBeforeOpen() {
        Swal.showLoading();
      }
    });
  }

  function get_bdstoken() {
    if (bdstoken) {
      fix_dl_begain();
      try_get_true_md5(0);
      return;
    }

    $.ajax({
      url: bdstoken_url,
      type: 'POST',
      dataType: 'json',
      data: {
        fields: JSON.stringify(["bdstoken"])
      }
    }).success(function (r) {
      if (!r.errno) {
        bdstoken = r.result.bdstoken;
        fix_dl_begain();
        try_get_true_md5(0);
      } else {
        alert('获取bdstoken失败, 请尝试重新登录');
      }
    }).fail(function (r) {
      alert('获取bdstoken失败, 请尝试刷新页面');
    });
  }

  function try_get_true_md5(file_id) {
    if (file_id >= select_list.length) {
      fix_dl_precreate(0);
    } else if (!select_list[file_id].isdir) {
      var file_info = {};
      file_info_list.push(file_info);
      file_info.path = select_list[file_id].path;
      var get_md5_par = {
        url: meta_url + encodeURIComponent(file_info.path),
        type: 'GET',
        responseType: 'json',
        onload: function onload(r) {
          var mate_info = r.response.list[0];
          file_info.size = mate_info.size;

          if (mate_info.block_list.length === 1) {
            file_info.md5 = mate_info.block_list[0];
          } else if (mate_info.md5.match(/[\da-f]{32}/i)) {
            file_info.md5 = mate_info.md5;
          } else {
            file_info.errno = 888;
          }

          try_get_true_md5(file_id + 1);
        }
      };
      GM_xmlhttpRequest(get_md5_par);
    } else {
      try_get_true_md5(file_id + 1);
    }
  }

  function fix_dl_finish() {
    var fix_failed = 0;
    var failed_info = '';
    file_info_list.forEach(function (item) {
      if (item.hasOwnProperty('errno')) {
        fix_failed++;
        failed_info += "<p>\u6587\u4EF6\uFF1A".concat(item.path, "</p><p>\u5931\u8D25\u539F\u56E0\uFF1A").concat(checkErrno(item.errno, item.size), "(#").concat(item.errno, ")</p>");
      }
    });
    Swal.fire({
      title: "\u4FEE\u590D\u5B8C\u6BD5 \u5171".concat(file_info_list.length, "\u4E2A, \u5931\u8D25").concat(fix_failed, "\u4E2A!"),
      confirmButtonText: '确定',
      showCloseButton: true,
      showCancelButton: false,
      allowOutsideClick: false,
      html: file_info_list.length == fix_failed ? failed_info : '<p>已生成可正常下载的新文件</p>' + (failed_info ? '<p><br></p>' + failed_info : ''),
      onBeforeOpen: function onBeforeOpen() {
        Add_content(document.createElement('div'));
      }
    }).then(function (result) {
      file_info_list = [];

      require('system-core:system/baseService/message/message.js').trigger('system-refresh');
    });
  }

  function fix_dl_precreate(file_id) {
    if (file_id >= file_info_list.length) {
      fix_dl_finish();
      return;
    } else if (file_info_list[file_id].errno) {
      fix_dl_precreate(file_id + 1);
      return;
    }

    var file_info = file_info_list[file_id];
    $.ajax({
      url: precreate_url,
      type: 'POST',
      dataType: 'json',
      data: {
        block_list: JSON.stringify([file_info.md5]),
        path: file_info.path,
        size: file_info.size,
        mode: 1,
        isdir: 0,
        autoinit: 1
      }
    }).success(function (r) {
      if (r.errno == 0) {
        if (r.block_list.length) {
          file_info.errno = 888;
          fix_dl_precreate(file_id + 1);
        } else if (r.uploadid) {
          file_info.uploadid = r.uploadid;
          fix_dl_create(file_id);
        }
      } else {
        file_info.errno = 999;
        fix_dl_precreate(file_id + 1);
      }
    }).fail(function (r) {
      file_info.errno = 114;
      fix_dl_precreate(file_id + 1);
    });
  }

  function fix_dl_create(file_id) {
    var file_info = file_info_list[file_id];
    $.ajax({
      url: create_url + bdstoken,
      type: 'POST',
      dataType: 'json',
      data: {
        block_list: JSON.stringify([randomStringTransform(file_info.md5)]),
        uploadid: file_info.uploadid,
        path: file_info.path,
        size: file_info.size,
        mode: 1,
        rtype: 2,
        isdir: 0,
        a: 'commit',
        sequence: 1,
        autoinit: 1
      }
    }).success(function (r) {
      if (r.errno) {
        file_info.errno = 888;
      }
    }).fail(function (r) {
      file_info.errno = 114;
    }).always(function () {
      setTimeout(function () {
        fix_dl_precreate(file_id + 1);
      }, 2000);
    });
  }

  function initButtonEvent() {
    $(document).on('click', '#gen-bdlink-button', gen_bd_link_event);
    $(document).on('click', '#fix-dl-button', fix_dl_event);
  }

  function getSelectedFileList() {
    return unsafeWindow.require('system-core:context/context.js').instanceForSystem.list.getSelected();
  }

  ;

  function initButtonHome() {
    var loop_count = 0;
    var loop = setInterval(function () {
      var html_tag = $('div.tcuLAu');
      if (!html_tag.length) return false;
      loop_count++;

      if (loop_count > 40) {
        html_tag.append(html_btn);
      } else if (!$('#h5Input0').length) return false;else html_tag.append(html_btn);

      var loop2 = setInterval(function () {
        var btn_tag = $('#bdlink_btn');
        if (!btn_tag.length) return false;
        btn_tag.click(function () {
          GetInfo();
        });
        clearInterval(loop2);
      }, 50);
      clearInterval(loop);
    }, 50);
  }

  function initButtonGen() {
    var listTools = getSystemContext().Broker.getButtonBroker('listTools');

    if (listTools && listTools.$box) {
      $(listTools.$box).children('div').after(html_btn_gen + html_fix_dl);
      initButtonEvent();
    } else {
      setTimeout(initButtonGen, 500);
    }
  }

  ;

  function getSystemContext() {
    return unsafeWindow.require('system-core:context/context.js').instanceForSystem;
  }

  ;

  function Gen_bdlink() {
    var file_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    if (file_info_list.length > 10 && vip_type === 2 && !interval_mode) {
      Set_interval(file_id);
      return;
    }

    Swal.fire({
      title: '秒传生成中',
      showCloseButton: true,
      allowOutsideClick: false,
      html: '<p>正在生成第 <gen_num></gen_num> 个</p><p><gen_prog></gen_prog></p>',
      onBeforeOpen: function onBeforeOpen() {
        Swal.showLoading();
        var content = Swal.getContent();

        if (content) {
          gen_num = content.querySelector('gen_num');
          gen_prog = content.querySelector('gen_prog');
          myGenerater(file_id);
        }
      }
    }).then(function (result) {
      if (result.dismiss && xmlhttpRequest) {
        xmlhttpRequest.abort();
        GM_deleteValue('unfinish');
        interval_mode = false;
        file_info_list = [];
      }
    });
  }

  function Set_interval(file_id) {
    var test_par = /\d+/;
    interval = GM_getValue('interval') || 15;
    Swal.fire({
      title: '批量生成注意',
      text: '检测到超会账号且生成的文件较多, 会因为生成过快导致接口被限制(#403), 请输入生成间隔(1-30秒,推荐15)防止上述情况',
      input: 'text',
      inputValue: interval,
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: '确定',
      inputValidator: function inputValidator(value) {
        if (!value) {
          return '不能为空';
        }

        if (!test_par.test(value)) {
          return '输入格式不正确, 请输入数字';
        }

        if (Number(value) > 30 || Number(value) < 1) {
          return '输入应在1-30之间';
        }
      }
    }).then(function (result) {
      interval = Number(result.value);
      GM_setValue('interval', interval);
      interval_mode = true;
      Gen_bdlink(file_id);
    });
  }

  var show_prog = function show_prog(r) {
    gen_prog.textContent = "".concat(parseInt(r.loaded / r.total * 100), "%");
  };

  function test_bdlink() {
    if (!GM_getValue('show_test_warning')) {
      Swal.fire({
        title: '注意',
        text: '测试秒传会转存并覆盖文件,若在生成期间修改过同名文件,为避免修改的文件丢失,请不要使用此功能!',
        input: 'checkbox',
        inputPlaceholder: '不再显示',
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonText: '确定',
        cancelButtonText: '返回'
      }).then(function (result) {
        GM_setValue('show_test_warning', result.value);

        if (!result.dismiss) {
          codeInfo = gen_success_list;
          check_mode = true;
          Process();
        } else {
          gen_success_list = [];
          myGenerater(file_info_list.length);
        }
      });
    } else {
      codeInfo = gen_success_list;
      check_mode = true;
      Process();
    }
  }

  function myGenerater(file_id) {
    var appid_id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var failed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    GM_setValue('unfinish', {
      'file_info_list': file_info_list,
      'file_id': file_id
    });

    if (file_id >= file_info_list.length) {
      bdcode = '';
      var failed_info = '';
      var gen_failed = 0;
      file_info_list.forEach(function (item) {
        if (item.hasOwnProperty('errno')) {
          gen_failed++;
          failed_info += "<p>\u6587\u4EF6\uFF1A".concat(item.path, "</p><p>\u5931\u8D25\u539F\u56E0\uFF1A").concat(checkErrno(item.errno, item.size), "(#").concat(item.errno, ")</p>");
        } else {
          gen_success_list.push(item);
          bdcode += "".concat(item.md5, "#").concat(item.md5s, "#").concat(item.size, "#").concat(item.path, "\n");
        }
      });
      bdcode = bdcode.trim();

      if (failed_info) {
        failed_info = '<p>失败文件列表:</p>' + failed_info;
      }

      Swal.fire(_objectSpread(_objectSpread({
        title: "\u751F\u6210\u5B8C\u6BD5 \u5171".concat(file_info_list.length, "\u4E2A, \u5931\u8D25").concat(gen_failed, "\u4E2A!"),
        confirmButtonText: '复制秒传代码',
        cancelButtonText: '取消',
        showCloseButton: true,
        showCancelButton: !bdcode,
        showConfirmButton: bdcode,
        allowOutsideClick: false,
        html: bdcode ? html_check_md5 + html_document + (failed_info && '<p><br></p>' + failed_info) : html_document + '<p><br></p>' + failed_info
      }, bdcode && checkbox_par), {}, {
        onBeforeOpen: function onBeforeOpen() {
          var loop = setInterval(function () {
            var html_tag = $('#check_md5_btn');
            if (!html_tag.length) return false;
            $('#check_md5_btn').click(function () {
              test_bdlink();
            });
            clearInterval(loop);
          }, 50);
          Add_content(document.createElement('div'));
        }
      })).then(function (result) {
        if (!result.dismiss) {
          if (!result.value) {
            bdcode = bdcode.replace(/(\/.+\/)|(\/)/g, '');
          }

          checkbox_par.inputValue = result.value;
          GM_setValue('with_path', result.value);
          GM_setClipboard(bdcode);
        }

        file_info_list = [];
        gen_success_list = [];
        GM_deleteValue('unfinish');
        interval_mode = false;
      });
      return;
    }

    var file_info = file_info_list[file_id];

    if (file_info.hasOwnProperty('errno')) {
      myGenerater(file_id + 1);
      return;
    }

    if (file_info.size > 21474836480) {
      file_info.errno = 3939;
      myGenerater(file_id + 1);
      return;
    }

    var path = file_info.path;
    gen_num.textContent = (file_id + 1).toString() + ' / ' + file_info_list.length.toString();
    gen_prog.textContent = '0%';
    var dl_size = file_info.size < 262144 ? file_info.size - 1 : 262143;

    if (!failed) {
      appid_id = file_info.size < 50000000 ? 0 : 3;
    }

    var get_dl_par = {
      url: pcs_url + "?app_id=".concat(appid_list[appid_id], "&method=download&path=").concat(encodeURIComponent(path)),
      type: 'GET',
      headers: {
        'Range': "bytes=0-".concat(dl_size)
      },
      responseType: 'arraybuffer',
      onprogress: show_prog,
      ontimeout: function ontimeout(r) {
        myGenerater(file_id);
        console.log('timeout !!!');
      },
      onerror: function onerror(r) {
        file_info.errno = 514;
        myGenerater(file_id + 1);
      },
      onload: function onload(r) {
        if (parseInt(r.status / 100) === 2) {
          var responseHeaders = r.responseHeaders;
          var file_md5 = responseHeaders.match(/content-md5: ([\da-f]{32})/i);

          if (file_md5) {
            file_md5 = file_md5[1].toLowerCase();
          } else {
            try_get_md5(file_id, r.response);
            return;
          } //bad_md5内的三个md5是和谐文件返回的, 第一个是txt格式的"温馨提示.txt", 第二个是视频格式的（俗称5s）,第三个为新发现的8s视频文件


          if (bad_md5.indexOf(file_md5) !== -1 || r.finalUrl.indexOf('issuecdn.baidupcs.com') !== -1) {
            file_info.errno = 1919;
          } else {
            var spark = new SparkMD5.ArrayBuffer();
            spark.append(r.response);
            var slice_md5 = spark.end();
            file_info.md5 = file_md5;
            file_info.md5s = slice_md5;
          }

          gen_prog.textContent = '100%';
          setTimeout(function () {
            myGenerater(file_id + 1);
          }, interval_mode ? interval * 1000 : 1000);
        } else {
          console.log("return #403, appid: ".concat(appid_list[appid_id]));

          if (r.status == 403 && appid_id < appid_list.length - 1) {
            myGenerater(file_id, appid_id + 1, true);
          } else {
            file_info.errno = r.status;
            myGenerater(file_id + 1);
          }
        }
      }
    };
    xmlhttpRequest = GM_xmlhttpRequest(get_dl_par);
  }

  function try_get_md5(file_id, file_date) {
    var file_info = file_info_list[file_id];
    var get_dl_par = {
      url: meta_url + encodeURIComponent(file_info.path),
      type: 'GET',
      onload: function onload(r) {
        var file_md5 = r.responseText.match(/"block_list":\["([\da-f]{32})"\]/i) || r.responseText.match(/md5":"([\da-f]{32})"/i);

        if (file_md5) {
          file_info.md5 = file_md5[1].toLowerCase();
          var spark = new SparkMD5.ArrayBuffer();
          spark.append(file_date);
          file_info.md5s = spark.end();
        } else {
          file_info.errno = 996;
        }

        myGenerater(file_id + 1);
      }
    };
    GM_xmlhttpRequest(get_dl_par);
  }
  /**
   * 一个简单的类似于 NodeJS Buffer 的实现.
   * 用于解析游侠度娘提取码。
   * @param {SimpleBuffer}
   */


  function SimpleBuffer(str) {
    this.fromString(str);
  }

  SimpleBuffer.toStdHex = function toStdHex(n) {
    return ('0' + n.toString(16)).slice(-2);
  };

  SimpleBuffer.prototype.fromString = function fromString(str) {
    var len = str.length;
    this.buf = new Uint8Array(len);

    for (var i = 0; i < len; i++) {
      this.buf[i] = str.charCodeAt(i);
    }
  };

  SimpleBuffer.prototype.readUnicode = function readUnicode(index, size) {
    if (size & 1) {
      size++;
    }

    var bufText = Array.prototype.slice.call(this.buf, index, index + size).map(SimpleBuffer.toStdHex);
    var buf = [''];

    for (var i = 0; i < size; i += 2) {
      buf.push(bufText[i + 1] + bufText[i]);
    }

    return JSON.parse('"' + buf.join("\\u") + '"');
  };

  SimpleBuffer.prototype.readNumber = function readNumber(index, size) {
    var ret = 0;

    for (var i = index + size; i > index;) {
      ret = this.buf[--i] + ret * 256;
    }

    return ret;
  };

  SimpleBuffer.prototype.readUInt = function readUInt(index) {
    return this.readNumber(index, 4);
  };

  SimpleBuffer.prototype.readULong = function readULong(index) {
    return this.readNumber(index, 8);
  };

  SimpleBuffer.prototype.readHex = function readHex(index, size) {
    return Array.prototype.slice.call(this.buf, index, index + size).map(SimpleBuffer.toStdHex).join('');
  };

  function DuParser() {}

  DuParser.parse = function generalDuCodeParse(szUrl) {
    var r;

    if (szUrl.indexOf('bdpan') === 0) {
      r = DuParser.parseDu_v1(szUrl);
      r.ver = 'PanDL';
    } else if (szUrl.indexOf('BDLINK') === 0) {
      r = DuParser.parseDu_v2(szUrl);
      r.ver = '游侠 v1';
    } else if (szUrl.indexOf('BaiduPCS-Go') === 0) {
      r = DuParser.parseDu_v3(szUrl);
      r.ver = 'PCS-Go';
    } else {
      r = DuParser.parseDu_v4(szUrl);
      r.ver = '梦姬标准';
    }

    return r;
  };

  DuParser.parseDu_v1 = function parseDu_v1(szUrl) {
    return szUrl.replace(/\s*bdpan:\/\//g, ' ').trim().split(' ').map(function (z) {
      return z.trim().fromBase64().match(/([\s\S]+)\|([\d]{1,20})\|([\dA-Fa-f]{32})\|([\dA-Fa-f]{32})/);
    }).filter(function (z) {
      return z;
    }).map(function (info) {
      return {
        md5: info[3],
        md5s: info[4],
        size: info[2],
        path: info[1]
      };
    });
  };

  DuParser.parseDu_v2 = function parseDu_v2(szUrl) {
    var raw = atob(szUrl.slice(6).replace(/\s/g, ''));

    if (raw.slice(0, 5) !== 'BDFS\x00') {
      return null;
    }

    var buf = new SimpleBuffer(raw);
    var ptr = 9;
    var arrFiles = [];
    var fileInfo, nameSize;
    var total = buf.readUInt(5);
    var i;

    for (i = 0; i < total; i++) {
      // 大小 (8 bytes)
      // MD5 + MD5S (0x20)
      // nameSize (4 bytes)
      // Name (unicode)
      fileInfo = {};
      fileInfo.size = buf.readULong(ptr + 0);
      fileInfo.md5 = buf.readHex(ptr + 8, 0x10);
      fileInfo.md5s = buf.readHex(ptr + 0x18, 0x10);
      nameSize = buf.readUInt(ptr + 0x28) << 1;
      fileInfo.nameSize = nameSize;
      ptr += 0x2C;
      fileInfo.path = buf.readUnicode(ptr, nameSize);
      arrFiles.push(fileInfo);
      ptr += nameSize;
    }

    return arrFiles;
  };

  DuParser.parseDu_v3 = function parseDu_v3(szUrl) {
    return szUrl.split('\n').map(function (z) {
      // unsigned long long: 0~18446744073709551615
      return z.trim().match(/-length=([\d]{1,20}) -md5=([\dA-Fa-f]{32}) -slicemd5=([\dA-Fa-f]{32})[\s\S]+"([\s\S]+)"/);
    }).filter(function (z) {
      return z;
    }).map(function (info) {
      return {
        md5: info[2],
        md5s: info[3],
        size: info[1],
        path: info[4]
      };
    });
  };

  DuParser.parseDu_v4 = function parseDu_v4(szUrl) {
    return szUrl.split('\n').map(function (z) {
      // unsigned long long: 0~18446744073709551615
      return z.trim().match(/([\dA-Fa-f]{32})#([\dA-Fa-f]{32})#([\d]{1,20})#([\s\S]+)/);
    }).filter(function (z) {
      return z;
    }).map(function (info) {
      return {
        md5: info[1],
        md5s: info[2],
        size: info[3],
        path: info[4]
      };
    });
  };

  function saveFile(i, try_flag) {
    if (i >= codeInfo.length) {
      Swal.fire(_objectSpread(_objectSpread({
        title: "".concat(check_mode ? '测试' : '转存', "\u5B8C\u6BD5 \u5171").concat(codeInfo.length, "\u4E2A \u5931\u8D25").concat(failed, "\u4E2A!"),
        confirmButtonText: check_mode ? '复制秒传代码' : '确定',
        showCloseButton: true
      }, check_mode && checkbox_par), {}, {
        onBeforeOpen: function onBeforeOpen() {
          var content = Swal.getContent();
          codeInfo.forEach(function (item) {
            if (item.errno) {
              var file_name = item.path;

              if (item.errno === 2 && item.size > 21474836480) {
                item.errno = 3939;
              }

              var errText = checkErrno(item.errno, item.size);
              var str1 = "\u6587\u4EF6\uFF1A".concat(file_name);
              var str2 = "\u5931\u8D25\u539F\u56E0\uFF1A".concat(errText, "(#").concat(item.errno, ")");
              var ele1 = document.createElement('p');
              var ele2 = document.createElement('p');
              var text1 = document.createTextNode(str1);
              var text2 = document.createTextNode(str2);
              ele1.appendChild(text1);
              ele2.appendChild(text2);
              content.appendChild(ele1);
              content.appendChild(ele2);
            }
          });
          Add_content(document.createElement('div'));

          var _dir = (dir || '').replace(/\/$/, '');

          if (_dir) {
            if (_dir.charAt(0) !== '/') {
              _dir = '/' + _dir;
            }

            var cBtn = Swal.getConfirmButton();
            var btn = cBtn.cloneNode();
            btn.textContent = '打开目录';
            btn.style.backgroundColor = '#ecae3c';

            btn.onclick = function () {
              location.href = "".concat(location.origin, "/disk/home?#/all?vmode=list&path=").concat(encodeURIComponent(_dir));
              Swal.close();
            };

            cBtn.before(btn);
          }
        }
      })).then(function (result) {
        if (check_mode) {
          if (!result.dismiss) {
            if (!result.value) {
              bdcode = bdcode.replace(/\/.+\//g, '');
            }

            checkbox_par.inputValue = result.value;
            GM_setValue('with_path', result.value);
            GM_setClipboard(bdcode);
          }

          file_info_list = [];
          gen_success_list = [];
          GM_deleteValue('unfinish');
          interval_mode = false;
          check_mode = false;
        }

        require('system-core:system/baseService/message/message.js').trigger('system-refresh');
      });
      failed = 0;
      return;
    }

    var file = codeInfo[i];
    file_num.textContent = (i + 1).toString() + ' / ' + codeInfo.length.toString();

    switch (try_flag) {
      case 0:
        if (fix_dl) {
          file.md5 = randomStringTransform(file.md5);
        } else {
          file.md5 = file.md5.toUpperCase();
        }

        break;

      case 1:
        if (fix_dl) {
          file.md5 = file.md5.toUpperCase();
        } else {
          file.md5 = file.md5.toLowerCase();
        }

        break;

      case 2:
        if (fix_dl) {
          file.md5 = file.md5.toLowerCase();
        } else {
          file.md5 = randomStringTransform(file.md5);
        }

    }

    $.ajax({
      url: "/api/rapidupload".concat(check_mode || fix_dl ? '?rtype=3' : ''),
      type: 'POST',
      data: {
        path: dir + file.path,
        'content-md5': file.md5,
        'slice-md5': file.md5s.toLowerCase(),
        'content-length': file.size
      }
    }).success(function (r) {
      if (file.path.match(/["\\\:*?<>|]/)) {
        codeInfo[i].errno = 2333;
      } else {
        codeInfo[i].errno = r.errno;
      }
    }).fail(function (r) {
      codeInfo[i].errno = 114;
    }).always(function () {
      if (codeInfo[i].errno === 404 && try_flag < 2) {
        saveFile(i, try_flag + 1);
        return;
      } else if (codeInfo[i].errno) {
        failed++;
      }

      saveFile(i + 1, 0);
    });
  }

  function checkErrno(errno) {
    var file_size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    switch (errno) {
      case -7:
        return '保存路径存在非法字符';

      case -8:
        return '路径下存在同名文件';

      case 400:
        return '请求错误(请尝试使用最新版Chrome浏览器)';

      case 403:
        return '文件获取失败(生成过于频繁导致接口被限,请稍后再试)';

      case 404:
        return '文件不存在(秒传无效)';

      case 2:
        return '转存失败(尝试重新登录网盘账号)';

      case 3939:
        return "\u79D2\u4F20\u4E0D\u652F\u6301\u5927\u4E8E20G\u7684\u6587\u4EF6,\u6587\u4EF6\u5927\u5C0F:".concat((file_size / Math.pow(1024, 3)).toFixed(2), "G");
      //文件大于20G时访问秒传接口实际会返回#2

      case 2333:
        return '链接内的文件路径错误(不能含有以下字符"\\:*?<>|)';
      //文件路径错误时接口实际也是返回#2

      case -10:
        return '网盘容量已满';

      case 114:
        return '接口调用失败(请重试)';

      case 514:
        return '接口调用失败(请重试/弹出跨域访问窗口时,请选择"总是允许"或"总是允许全部域名")';

      case 1919:
        return '文件已被和谐';

      case 810:
        return '文件列表获取失败(请重试)';

      case 996:
        return 'md5获取失败(请参考分享教程)';

      case 888:
        return '该文件不支持修复';

      case 999:
        return 'uploadid获取失败';

      default:
        return '未知错误';
    }
  }

  function GetInfo() {
    var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    Swal.fire({
      title: '请输入秒传',
      input: 'textarea',
      inputValue: str,
      showCancelButton: true,
      inputPlaceholder: '[支持PanDL/梦姬标准/游侠/PCS-Go][支持批量]\n[输入setting进入设置页]',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      onBeforeOpen: function onBeforeOpen() {
        Add_content2();
      },
      inputValidator: function inputValidator(value) {
        if (!value) {
          return '链接不能为空';
        }

        if (value === 'setting') {
          return;
        }

        codeInfo = DuParser.parse(value);

        if (!codeInfo.length) {
          return '未识别到正确的链接';
        }

        fix_dl = document.getElementById('fix_dl_checkbox').checked;
      }
    }).then(function (result) {
      if (!result.dismiss) {
        if (result.value === 'setting') {
          setting();
        } else {
          Process();
        }
      }
    });
  }

  function Process() {
    if (check_mode) {
      dir = '';
      save_alert();
    } else {
      dir = GM_getValue('last_dir');

      if (!dir) {
        dir = '';
      }

      Swal.fire({
        title: '请输入保存路径',
        input: 'text',
        inputPlaceholder: '格式示例：/GTA5/, 默认保存在根目录',
        inputValue: dir,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: function inputValidator(value) {
          if (value.match(/["\\\:*?<>|]/)) {
            return '路径中不能含有以下字符"\\:*?<>|, 格式示例：/GTA5/';
          }
        }
      }).then(function (result) {
        if (!result.dismiss) {
          dir = result.value;
          GM_setValue('last_dir', dir);

          if (dir.charAt(dir.length - 1) !== '/') {
            dir = dir + '/';
          }

          save_alert();
        }
      });
    }
  }

  function save_alert() {
    Swal.fire({
      title: "\u6587\u4EF6".concat(check_mode ? '测试' : '提取', "\u4E2D"),
      html: "\u6B63\u5728".concat(check_mode ? '测试' : '转存', "\u7B2C <file_num></file_num> \u4E2A"),
      allowOutsideClick: false,
      onBeforeOpen: function onBeforeOpen() {
        Swal.showLoading();
        var content = Swal.getContent();

        if (content) {
          file_num = content.querySelector('file_num');
          saveFile(0, 0);
        }
      }
    });
  }

  function GetInfo_url() {
    var bdlink = location.href.match(/[\?#]bdlink=([\da-zA-Z/\+]+)&?/);

    if (bdlink) {
      bdlink = bdlink[1].fromBase64();
    }

    return bdlink;
  }

  function Add_content2() {
    var content = document.createElement('div');
    content.innerHTML += fix_dl_checkbox;
    Swal.getContent().appendChild(content);
  }

  function Add_content(content) {
    var hasAdd = false;

    if (!GM_getValue('kill_feedback_1.6.1')) {
      hasAdd = true;
      content.innerHTML += "<p><br></p>";
      content.innerHTML += html_feedback;
      var loop = setInterval(function () {
        var html_tag = $('#kill_feedback');
        if (!html_tag.length) return false;
        $('#kill_feedback').click(function () {
          GM_setValue('kill_feedback_1.6.1', true);
          $('#bdcode_feedback').remove();
        });
        clearInterval(loop);
      }, 50);
    }

    if (!GM_getValue('kill_donate_1.6.1')) {
      if (!hasAdd) {
        content.innerHTML += "<p><br></p>";
      }

      content.innerHTML += html_donate;

      var _loop = setInterval(function () {
        var html_tag = $('#kill_donate');
        if (!html_tag.length) return false;
        $('#kill_donate').click(function () {
          GM_setValue('kill_donate_1.6.1', true);
          $('#bdcode_donate').remove();
        });
        clearInterval(_loop);
      }, 50);
    }

    Swal.getContent().appendChild(content);
  }

  function checkVipType() {
    var info_par = {
      url: info_url,
      type: 'GET',
      responseType: 'json',
      onload: function onload(r) {
        if (r.response.hasOwnProperty('vip_type')) {
          vip_type = r.response.vip_type;
        }
      }
    };
    GM_xmlhttpRequest(info_par);
  }

  var injectStyle = function injectStyle() {
    GM_addStyle(css_checkbox);
    var style = GM_getResourceText('sweetalert2Css'); // 暴力猴直接粘贴脚本代码时可能不会将resource中的数据下载缓存，fallback到下载css代码

    var themes = GM_getValue('Themes') || 'Minimal';
    console.log(themes);
    var css_code = GM_getValue(themes);

    if (css_code) {
      GM_addStyle(css_code);
      return;
    }

    if (style && themes === 'Minimal') {
      GM_setValue(themes, style);
      GM_addStyle(style);
      return;
    }

    GM_xmlhttpRequest({
      url: css_url[themes],
      type: 'GET',
      responseType: 'text',
      onload: function onload(r) {
        style = r.response;

        if (style.length < 100) {
          alert('秒传链接提取:\n外部资源加载错误, 脚本无法运行, 请尝试刷新页面');
          return;
        }

        GM_setValue(themes, style);
        GM_addStyle(style);
      },
      onerror: function onerror(r) {
        alert('秒传链接提取:\n外部资源加载失败, 脚本无法运行, 请检查网络或尝试更换DNS');
      }
    });
  };

  var showUpdateInfo = function showUpdateInfo() {
    if (!GM_getValue('1.6.7_no_first')) {
      Swal.fire({
        title: "\u79D2\u4F20\u94FE\u63A5\u63D0\u53D6 1.6.7 \u66F4\u65B0\u5185\u5BB9(21.3.30):",
        html: update_info,
        heightAuto: false,
        scrollbarPadding: false,
        showCloseButton: true,
        allowOutsideClick: false,
        confirmButtonText: '确定'
      }).then(function (result) {
        GM_setValue('1.6.7_no_first', true);
      });
    }
  };

  function myInit() {
    injectStyle();
    var bdlink = GetInfo_url();
    window.addEventListener('DOMContentLoaded', function () {
      bdlink ? GetInfo(bdlink) : showUpdateInfo();
      initButtonHome();
      initButtonGen();
      checkVipType();
    });
  }

  function setting() {
    Swal.fire({
      title: '秒传链接提取 设置页',
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      allowOutsideClick: false,
      input: 'select',
      inputValue: GM_getValue('Themes') || 'Minimal',
      inputOptions: {
        'Minimal': 'Minimal 白色主题(默认)',
        'Bulma': 'Bulma 白色简约',
        'Bootstrap 4': 'Bootstrap4 白色简约',
        'Material UI': 'MaterialUI 白色主题',
        'Dark': 'Dark 黑色主题',
        'WordPress Admin': 'WordPressAdmin 灰色主题'
      }
    }).then(function (result) {
      if (!result.dismiss) {
        GM_setValue('Themes', result.value);
        Swal.fire({
          title: '设置成功 刷新页面生效',
          showCloseButton: true,
          allowOutsideClick: false,
          html: csd_hint_html
        });
      }
    });
  }

  var update_info = "<div class=\"panel-body\" style=\"height: 250px; overflow-y:scroll\">\n        <div style=\"border: 1px  #000000; width: 100%; margin: 0 auto;\"><span>\n\n        <p>\u4FEE\u590D\u90E8\u5206\u79D2\u4F20\u8F6C\u5B58\u65F6\u63D0\u793A \"\u6587\u4EF6\u4E0D\u5B58\u5728(\u79D2\u4F20\u65E0\u6548)\"</p>\n\n        <p><br></p>\n\n        <p>\u82E5\u51FA\u73B0\u4EFB\u4F55\u95EE\u9898\u8BF7\u524D\u5F80<a href=\"https://greasyfork.org/zh-CN/scripts/397324\" rel=\"noopener noreferrer\" target=\"_blank\">greasyfork\u9875</a>\u53CD\u9988</p>\n\n        <p><br></p>\n\n        <p>1.6.1 \u66F4\u65B0\u5185\u5BB9(21.3.29)</p>\n\n        <p>\u65B0\u589E <span style=\"color: red;\">\u76F4\u63A5\u4FEE\u590D\u4E0B\u8F7D</span> \u7684\u529F\u80FD, \u9009\u4E2D\u7F51\u76D8\u5185\u6587\u4EF6, \u518D\u70B9\u51FB\u4E0A\u65B9 <span style=\"color: red;\">\u4FEE\u590D\u4E0B\u8F7D</span> \u6309\u94AE\u5373\u53EF\u751F\u6210\u53EF\u6B63\u5E38\u4E0B\u8F7D\u7684\u65B0\u6587\u4EF6</p>\n        \n        <img src=\"https://pic.rmb.bdstatic.com/bjh/5e05f7c1f772451b8efce938280bcaee.png\"/>\n\n        <p><br></p>\n\n        <p>1.5.7 \u66F4\u65B0\u5185\u5BB9(21.3.9)</p>\n\n        <p>\u4FEE\u590D\u90E8\u5206\u6587\u4EF6\u8F6C\u5B58\u540E <span style=\"color: red;\">\u65E0\u6CD5\u4E0B\u8F7D</span> \u7684\u95EE\u9898, \u53EF\u5C1D\u8BD5 <span style=\"color: red;\">\u91CD\u65B0\u8F6C\u5B58</span> \u4E4B\u524D\u65E0\u6CD5\u4E0B\u8F7D\u6587\u4EF6. \u4E14\u8F6C\u5B58\u65B0\u589E\u4E86 <span style=\"color: red;\">\u4FEE\u590D\u4E0B\u8F7D</span> \u529F\u80FD</p>\n\n        <p><br></p>\n\n        <p>1.5.4 \u66F4\u65B0\u5185\u5BB9(21.2.11)</p>\n\n        <p>\u9762\u5411\u5206\u4EAB\u8005\u7684 <a href=\"https://shimo.im/docs/TZ1JJuEjOM0wnFDH\" rel=\"noopener noreferrer\" target=\"_blank\">\u5206\u4EAB\u6559\u7A0B</a> \u7684\u9632\u548C\u8C10\u65B9\u6CD5\u66F4\u65B0:</p>\n\n        <p>\u7ECF\u6D4B\u8BD5, \u539F\u6559\u7A0B\u7684 \"\u56FA\u5B9E\u538B\u7F29+\u52A0\u5BC6\u6587\u4EF6\u540D\" \u5DF2\u65E0\u6CD5\u518D\u9632\u548C\u8C10(\u5728\u5EA6\u76D8\u79FB\u52A8\u7AEF\u4F9D\u65E7\u53EF\u4EE5\u5728\u7EBF\u89E3\u538B), \u76EE\u524D\u6709\u6548\u7684\u9632\u548C\u8C10\u65B9\u6CD5\u8BF7\u53C2\u8003\u6559\u7A0B\u5185\u7684 <span style=\"color: red;\">\"\u53CC\u5C42\u538B\u7F29\"</span></p>\n\n        <p><br></p>\n        \n        <p>1.4.3 \u66F4\u65B0\u5185\u5BB9(21.2.6):</p>\n\n        <p>\u4FEE\u590D\u4E86\u751F\u6210\u79D2\u4F20\u65F6, \u79D2\u4F20\u6709\u6548, \u4ECD\u63D0\u793A\"md5\u83B7\u53D6\u5931\u8D25(#996)\"\u7684\u95EE\u9898</p>\n\n        <p><br></p>\n        \n        <p>1.4.9 \u66F4\u65B0\u5185\u5BB9(21.1.28):</p>\n        \n        <p>1. \u91CD\u65B0\u517C\u5BB9\u4E86\u66B4\u529B\u7334\u63D2\u4EF6, \u611F\u8C22Trendymen\u63D0\u4F9B\u7684\u4EE3\u7801</p>\n\n        <p>2. \u65B0\u589E\u66F4\u6362\u4E3B\u9898\u7684\u529F\u80FD, \u5728\u79D2\u4F20\u8F93\u5165\u6846\u4E2D\u8F93\u5165setting\u8FDB\u5165\u8BBE\u7F6E\u9875, \u66F4\u6362\u4E3A\u5176\u4ED6\u4E3B\u9898, \u5373\u53EF\u907F\u514D\u5F39\u7A97\u65F6\u7684\u80CC\u666F\u53D8\u6697</p>\n\n        <p>3. \u4FEE\u6539\u4E86\u90E8\u5206\u4EE3\u7801\u903B\u8F91, \u79D2\u4F20\u6309\u94AE\u4E0D\u4F1A\u518D\u51FA\u73B0\u5728\u6700\u5DE6\u8FB9\u4E86</p>\n\n        <p><br></p>\n\n        <p>1.4.6 \u66F4\u65B0\u5185\u5BB9(21.1.14):</p>\n\n        <p>\u672C\u6B21\u66F4\u65B0\u9488\u5BF9\u751F\u6210\u529F\u80FD\u505A\u4E86\u4F18\u5316:</p>\n\n        <p>1. \u4F7F\u7528\u8D85\u4F1A\u8D26\u53F7\u8FDB\u884C10\u4E2A\u4EE5\u4E0A\u7684\u6279\u91CF\u79D2\u4F20\u751F\u6210\u65F6, \u4F1A\u5F39\u7A97\u63D0\u793A\u8BBE\u7F6E\u751F\u6210\u95F4\u9694, \u9632\u6B62\u751F\u6210\u8FC7\u5FEB\u5BFC\u81F4\u63A5\u53E3\u88AB\u9650\u5236(#403)</p>\n\n        <p>2. \u4E3A\u79D2\u4F20\u5206\u4EAB\u8005\u63D0\u4F9B\u4E86\u4E00\u4EFD<a href=\"https://shimo.im/docs/TZ1JJuEjOM0wnFDH\" rel=\"noopener noreferrer\" target=\"_blank\">\u5206\u4EAB\u6559\u7A0B</a>\u7528\u4E8E\u53C2\u8003</p>\n\n        <p><br></p>\n\n        <p>1.4.5 \u66F4\u65B0\u5185\u5BB9(21.1.12):</p>\n\n        <p>\u4FEE\u590D\u4E861.4.0\u540E\u53EF\u80FD\u51FA\u73B0\u7684\u79D2\u4F20\u6309\u94AE\u65E0\u6548\u3001\u663E\u793A\u591A\u4E2A\u79D2\u4F20\u6309\u94AE\u7684\u95EE\u9898</p>\n\n        <p><br></p>\n\n        <p>1.3.7 \u66F4\u65B0\u5185\u5BB9(21.1.3):</p>\n\n        <p>\u4FEE\u590D\u4E86\u4F1A\u5458\u8D26\u53F7\u751F\u621050M\u4EE5\u4E0B\u6587\u4EF6\u65F6\u63D0\u793A \"md5\u83B7\u53D6\u5931\u8D25\" \u7684\u95EE\u9898</p>\n\n        <p><br></p>\n\n        <p>1.3.3 \u66F4\u65B0\u5185\u5BB9(20.12.1):</p>\n\n        <p>\u79D2\u4F20\u751F\u6210\u5B8C\u6210\u540E\u70B9\u51FB\u590D\u5236\u6309\u94AE\u4E4B\u524D\u90FD\u53EF\u4EE5\u7EE7\u7EED\u4EFB\u52A1,\u9632\u6B62\u8BEF\u64CD\u4F5C\u5173\u95ED\u9875\u9762\u5BFC\u81F4\u751F\u6210\u7ED3\u679C\u4E22\u5931</p>\n\n        <p>\u4FEE\u6539\u4EE3\u7801\u6267\u884C\u987A\u5E8F\u9632\u6B62\u79D2\u4F20\u6309\u94AE\u51FA\u73B0\u5728\u6700\u5DE6\u7AEF</p>\n\n        <p>\u4FEE\u590D\u4E86\u8DE8\u57DF\u63D0\u793A\u4E2D\u5931\u6548\u7684\u8BF4\u660E\u56FE\u7247</p>\n\n        <p><br></p>\n\n        <p>1.2.9 \u66F4\u65B0\u5185\u5BB9(20.11.11):</p>\n        \n        <p>\u751F\u6210\u79D2\u4F20\u7684\u5F39\u7A97\u6DFB\u52A0\u4E86\u5173\u95ED\u6309\u94AE</p>\n        \n        <p>\u5220\u9664\u4E86\u5168\u90E8\u751F\u6210\u5931\u8D25\u65F6\u7684\u590D\u5236\u548C\u6D4B\u8BD5\u6309\u94AE</p>\n\n        <p>\u79D2\u4F20\u751F\u6210\u540E\u52A0\u4E86\u4E00\u4E2A\u5BFC\u51FA\u6587\u4EF6\u8DEF\u5F84\u7684\u9009\u9879(\u9ED8\u8BA4\u4E0D\u5BFC\u51FA)</p>\n\n        <p>\u5728\u8F93\u5165\u4FDD\u5B58\u8DEF\u5F84\u7684\u5F39\u7A97\u6DFB\u52A0\u4E86\u6821\u9A8C, \u9632\u6B62\u8F93\u5165\u9519\u8BEF\u8DEF\u5F84</p>\n\n        <p><br></p>\n\n        <p>1.2.5 \u66F4\u65B0\u5185\u5BB9(20.11.4):</p>\n        \n        <p>\u4F18\u5316\u6309\u94AE\u6837\u5F0F, \u6DFB\u52A0\u4E86md5\u83B7\u53D6\u5931\u8D25\u7684\u62A5\u9519</p>\n\n        <p>\u4FEE\u590D\u4ECEpan.baidu.com\u8FDB\u5165\u540E\u4E0D\u663E\u793A\u751F\u6210\u6309\u94AE\u7684\u95EE\u9898</p>\n        \n        <p><br></p>\n        \n        <p>1.2.4 \u66F4\u65B0\u5185\u5BB9(20.11.2):</p>\n        \n        <p>\u65B0\u589E\u751F\u6210\u79D2\u4F20:</p>\n        \n        <p>\u9009\u62E9\u6587\u4EF6\u6216\u6587\u4EF6\u5939\u540E\u70B9\u51FB \"\u751F\u6210\u79D2\u4F20\" \u5373\u53EF\u5F00\u59CB\u751F\u6210</p>\n        \n        <p><br></p>\n        \n        <p>\u7EE7\u7EED\u672A\u5B8C\u6210\u4EFB\u52A1:</p>\n        \n        <p>\u82E5\u751F\u6210\u79D2\u4F20\u671F\u95F4\u5173\u95ED\u4E86\u7F51\u9875, \u518D\u6B21\u70B9\u51FB \"\u751F\u6210\u79D2\u4F20\" \u5373\u53EF\u7EE7\u7EED\u4EFB\u52A1</p>\n        \n        <p><br></p>\n        \n        <p>\u6D4B\u8BD5\u79D2\u4F20\u529F\u80FD:</p>\n        \n        <p>\u751F\u6210\u5B8C\u6210\u540E, \u70B9\u51FB\"\u6D4B\u8BD5\"\u6309\u94AE, \u4F1A\u81EA\u52A8\u8F6C\u5B58\u5E76\u8986\u76D6\u6587\u4EF6(\u6587\u4EF6\u5185\u5BB9\u4E0D\u53D8), \u4EE5\u68C0\u6D4B\u79D2\u4F20\u6709\u6548\u6027, \u4EE5\u53CA\u4FEE\u590Dmd5\u9519\u8BEF\u9632\u6B62\u79D2\u4F20\u5931\u6548</p>\n        \n        </span></div></div>";
  myInit();
}();
