// ==UserScript==
// @name         百度網盤自動轉存
// @name:zh-CN   百度网盘自动转存
// @namespace    moe.jixun.baidu.auto.save
// @version      0.4
// @description  自動轉存當前文件至上次轉存路徑。
// @author       Jixun
// @include      http://pan.baidu.com/share/link*
// @include      https://pan.baidu.com/share/link*
// @include      http://pan.baidu.com/s/*
// @include      https://pan.baidu.com/s/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/19864/%E7%99%BE%E5%BA%A6%E7%B6%B2%E7%9B%A4%E8%87%AA%E5%8B%95%E8%BD%89%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/19864/%E7%99%BE%E5%BA%A6%E7%B6%B2%E7%9B%A4%E8%87%AA%E5%8B%95%E8%BD%89%E5%AD%98.meta.js
// ==/UserScript==

(function(yunData, require) {
  'use strict';

  var errors = {
    0: '成功',
    5: '自己的文件',
    12: '已经保存过了',
    111: '另一保存任务进行中',
    '-33': '需要会员 (?)',
    120: '需要会员 (?)',
    130: '需要超级会员 (?)'
  };

  (function (tip, c) {
    function getRecentPath() {
      var key = window.yunData.MYNAME.replace(/@/g, "") + "_transfer_save_path";
      var _recent_path = localStorage.getItem(key);
      if (!_recent_path) _recent_path = '/';
      else _recent_path = _recent_path.replace(/\?\d+/, '');

      return _recent_path;
    }

    var $ = require("base:widget/libs/jquery-1.12.4.js");
    function doAutoSave (count) {
      if (count <= 0) {
        tip.hide();
        tip.show({
          mode: 'error',
          msg: '转存失败：请检查网络连接。',
          hasClose: true,
          autoClose: false,
          vipType: 'svip'
        });
        return;
      }
      const path = getRecentPath();

      $.ajax({
        type: 'POST',
        url: '/share/transfer?shareid=' + yunData.SHARE_ID + '&from=' + yunData.SHARE_UK,
        data: {
          filelist: JSON.stringify(yunData.FILEINFO.map(function(f){ return f.path; })),
          path: path
        },
        dataType: 'json',
        success: function (data) {
          var raw = typeof data == 'string' ? $.parseJSON(data) : data;
          var err = data.errno;

          var errMsg = '';
          if (err in errors) {
            errMsg += errors[err] + ' (' + err + ')';
          } else {
            errMsg += '未知状态 (' + err + ')';
          }

          var msg = '保存至: ' + path + ', 状态: ' + errMsg;
          document.title = errMsg + ' - ' + document.title;

          tip.hide();
          tip.show({
            mode: err === 0 ? 'success' : 'caution',
            msg: msg,
            hasClose: true,
            autoClose: false,
            vipType: 'svip'
          });
        },
        error: function (error) {
          console.warn('网络连接失败，进行重试…');
          setTimeout(doAutoSave, 500, count - 1);
        }
      });
    }
    doAutoSave(5);

    tip.show({
      mode: 'loading',
      msg: "正在转存文件，请稍后...",
      hasClose: false,
      autoClose: false
    });
  })(
    /*tip: */require("system-core:system/uiService/tip/tip.js")
  );
})(window.yunData, window.require);
