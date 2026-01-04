// ==UserScript==
// @name               Crack Forclass 3
// @namespace          https://www.forclass.tk/script?3
// @version            1.4.4
// @icon               https://houtar.coding.net/p/crackForclass/d/crackForclass/git/raw/master/icon.png
// @description        这同样适用于 Forclass,Sunclass,271BAY,Zhizhiniao
// @author             Houtarchat
// @match              *://*.forclass.net/Student/Dajx*
// @match              *://*.271bay.com/Student/Dajx*
// @match              *://web.zhizhiniao.com/Student/Dati*
// @contributionURL    https://www.houtarchat.ml/donate.html
// @contributionAmount 5 RMB
// @license            GNU General Public License
// @run-at             document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/408289/Crack%20Forclass%203.user.js
// @updateURL https://update.greasyfork.org/scripts/408289/Crack%20Forclass%203.meta.js
// ==/UserScript==

var _this = void 0;

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { console.warn("Cannot instantiate an arrow function"); } }

(function () {
  var _this2 = this;

  _newArrowCheck(this, _this);

  /* jslint browser: true */

  /* global unsafeWindow */
  unsafeWindow.g_debugmode = true;

  if (unsafeWindow.getRequestParamValue('type') === '5' && window.confirm('补救&批阅？')) {
    unsafeWindow.addToQueue('UploadAttachmentPaperAnswer2', {
      aidx: unsafeWindow.getRequestParamValue('aidx'),
      session: unsafeWindow.getSession(),
      page: 1,
      studentAnswer: "<style type=\"text/css\">#so360{white-space:nowrap}#so360 form{margin:0;padding:0}#so360_keyword{width:307px;height:24px;line-height:24px;font:14px arial;padding:2px 5px;margin-right:5px;border:2px solid #3eaf0e;outline:0;vertical-align:middle}#so360_submit{width:70px;height:32px;line-height:32px;border:0;color:#fff;background:#3fb30e;font-weight:700;font:bold 14px arial;padding:0;cursor:pointer;vertical-align:middle}.g-hd-logo{background-image:url(https://p.ssl.qhimg.com/t010e288a56a0b005e9.png);display:inline-block;height:22px;vertical-align:top;width:100px}.poweredby{margin-top:10px;margin-left:100px}</style><div id=\"so360\"><form action=\"http://www.so.com/s\" target=\"_blank\" id=\"so360form\"><input type=\"text\" autocomplete=\"off\" name=\"q\" id=\"so360_keyword\"> <input type=\"submit\" id=\"so360_submit\" value=\"\u641C \u7D22\"> <input type=\"hidden\" name=\"ie\" value=\"utf-8\"></form><div class=\"poweredby\">Powered by <a class=\"g-hd-logo\" href=\"https://www.so.com/\"></a> & <a href=\"https://space.bilibili.com/253498468\" target=\"_blank\">Houtarchat</a></div></div>",
      studentAnswerURL: '',
      size: ''
    }, function () {
      var _this3 = this;

      _newArrowCheck(this, _this2);

      unsafeWindow.http('GetStudentAnsweredPaper', {
        session: unsafeWindow.getSession(),
        page: 1,
        paidx: unsafeWindow.getRequestParamValue('paidx'),
        aidx: unsafeWindow.getRequestParamValue('aidx')
      }, function (response) {
        var _this4 = this;

        _newArrowCheck(this, _this3);

        return unsafeWindow.addToQueue('SetAssignmentPaperAnswer', {
          session: JSON.parse(unsafeWindow.sessionStorage.account).session,
          paIdx: response[0].PAIdx,
          score: '100',
          comment: '',
          page: 0
        }, function () {
          _newArrowCheck(this, _this4);

          return null;
        }.bind(this), '', true);
      }.bind(this), '');
    }.bind(this), '', true);
    return;
  }

  switch (window.prompt('是否为您打开？\n输入0取消，\n输入1打开答题页面，\n输入2打开批阅页面')) {
    case '1':
      window.open(location.protocol + "//" + location.host + "/Student/Dati" + location.search + location.hash);
      break;

    case '2':
      window.open(location.protocol + "//" + location.host + "/Student/Pgzy" + location.search + location.hash);
      break;

    default:
      break;
  }

  window.onload = function () {
    _newArrowCheck(this, _this2);

    $('.qoption input,.qoption textarea').unbind('cut copy paste');
  }.bind(this);
}).bind(void 0)();