// ==UserScript==
// @name               Crack Forclass
// @namespace          https://www.forclass.tk/script
// @version            3.7.4
// @icon               https://houtar.coding.net/p/crackForclass/d/crackForclass/git/raw/master/icon.png
// @description        这同样适用于 Forclass,Sunclass,271BAY,Zhizhiniao
// @author             Houtarchat
// @match              *://*.forclass.net/Student/Dati*
// @match              *://*.271bay.com/Student/Dati*
// @match              *://web.zhizhiniao.com/Student/Dati*
// @contributionURL    https://www.houtarchat.ml/donate.html
// @contributionAmount 5 RMB
// @license            GNU General Public License
// @run-at             document-idle
// @downloadURL https://update.greasyfork.org/scripts/405731/Crack%20Forclass.user.js
// @updateURL https://update.greasyfork.org/scripts/405731/Crack%20Forclass.meta.js
// ==/UserScript==

var _this = void 0;

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { console.warn("Cannot instantiate an arrow function"); } }

(function () {
  var _this2 = this;

  _newArrowCheck(this, _this);

  /* jslint browser: true */

  /* global unsafeWindow */
  Pace.on("done", function () {
    var _this3 = this;

    _newArrowCheck(this, _this2);

    unsafeWindow.g_debugmode = true;

    unsafeWindow.tick = function () {
      _newArrowCheck(this, _this3);

      return null;
    }.bind(this);

    unsafeWindow.polling4Submit = function () {
      _newArrowCheck(this, _this3);

      return null;
    }.bind(this);

    unsafeWindow.$('.qoption input,.qoption textarea').unbind('cut copy paste');
    $('#paperoperation > div.el-dati-funcs.el-upload-submit > div.el-dati-submit-td').addClass('el-dati-submit-td');
  }.bind(this));

  if (unsafeWindow.getRequestParamValue('type') === '5') {
    var oneClickCompletionReviewButton = document.createElement('input');

    oneClickCompletionReviewButton.onclick = function () {
      var _this4 = this;

      _newArrowCheck(this, _this2);

      return unsafeWindow.addToQueue('UploadAttachmentPaperAnswer2', {
        aidx: unsafeWindow.getRequestParamValue('aidx'),
        session: unsafeWindow.getSession(),
        page: 1,
        studentAnswerURL: '',
        size: '',
        studentAnswer: "<style type=\"text/css\">#so360{white-space:nowrap}#so360 form{margin:0;padding:0}#so360_keyword{width:307px;height:24px;line-height:24px;font:14px arial;padding:2px 5px;margin-right:5px;border:2px solid #3eaf0e;outline:0;vertical-align:middle}#so360_submit{width:70px;height:32px;line-height:32px;border:0;color:#fff;background:#3fb30e;font-weight:700;font:bold 14px arial;padding:0;cursor:pointer;vertical-align:middle}.g-hd-logo{background-image:url(https://p.ssl.qhimg.com/t010e288a56a0b005e9.png);display:inline-block;height:22px;vertical-align:top;width:100px}.poweredby{margin-top:10px;margin-left:100px}</style><div id=\"so360\"><form action=\"http://www.so.com/s\" target=\"_blank\" id=\"so360form\"><input type=\"text\" autocomplete=\"off\" name=\"q\" id=\"so360_keyword\"> <input type=\"submit\" id=\"so360_submit\" value=\"\u641C \u7D22\"> <input type=\"hidden\" name=\"ie\" value=\"utf-8\"></form><div class=\"poweredby\">Powered by <a class=\"g-hd-logo\" href=\"https://www.so.com/\"></a> & <a href=\"https://space.bilibili.com/253498468\" target=\"_blank\">Houtarchat</a></div></div>"
      }, function () {
        var _this5 = this;

        _newArrowCheck(this, _this4);

        unsafeWindow.http('GetStudentAnsweredPaper', {
          session: unsafeWindow.getSession(),
          page: 1,
          paidx: unsafeWindow.getRequestParamValue('paidx'),
          aidx: unsafeWindow.getRequestParamValue('aidx')
        }, function (response) {
          var _this6 = this;

          _newArrowCheck(this, _this5);

          return unsafeWindow.addToQueue('SetAssignmentPaperAnswer', {
            session: JSON.parse(unsafeWindow.sessionStorage.account).session,
            paIdx: response[0]['PAIdx'],
            score: '100',
            comment: '',
            page: 0
          }, function () {
            _newArrowCheck(this, _this6);

            return null;
          }.bind(this), '', true);
        }.bind(this), '');
      }.bind(this), '', true);
    }.bind(this);

    oneClickCompletionReviewButton.type = 'button';
    oneClickCompletionReviewButton.value = '一键完成&批阅';
    $('.el-dati-attach-require').append(oneClickCompletionReviewButton);
  } else {
    var htTime = document.createElement('input');
    htTime.id = 'HT-Time';
    htTime.value = 'HH:mm:ss';
    var modificationTimeButton = document.createElement('input');

    modificationTimeButton.onclick = function () {
      var _$$val$split;

      _newArrowCheck(this, _this2);

      return _$$val$split = $('#HT-Time').val().split(':'), unsafeWindow.sessionStorage.hour = _$$val$split[0], unsafeWindow.sessionStorage.minute = _$$val$split[1], unsafeWindow.sessionStorage.second = _$$val$split[2], _$$val$split;
    }.bind(this);

    modificationTimeButton.type = 'button';
    modificationTimeButton.value = '修改答题所用时间';
    var openAnswerPageByFrameButton = document.createElement('input');

    openAnswerPageByFrameButton.onclick = function () {
      var _this7 = this;

      _newArrowCheck(this, _this2);

      var out = unsafeWindow.document.createElement('div'),
          bar = unsafeWindow.document.createElement('div'),
          title = unsafeWindow.document.createElement('div'),
          rtbtns = unsafeWindow.document.createElement('div'),
          closeE = unsafeWindow.document.createElement('div'),
          body = unsafeWindow.document.createElement('iframe');
      out.setAttribute('class', 'dlg-out');
      out.setAttribute('style', 'z-index:3000;left:362.5px;top:140.5px;display:block');
      $('#main').append(out);
      bar.setAttribute('class', 'dlg-bar');
      out.appendChild(bar);
      title.setAttribute('class', 'dlg-title');
      title.innerText = 'Houtarchat';
      bar.appendChild(title);
      rtbtns.setAttribute('class', 'dlg-rtbtns-out');
      bar.appendChild(rtbtns);
      closeE.setAttribute('class', 'dlg-close-e');
      closeE.setAttribute('style', 'text-align:center;width:34px;height:39px;display:inline-block;cursor:pointer;vertical-align:top;cursor:pointer;font-size:21px;font-weight:700');
      closeE.innerText = '×';
      $(closeE).click(function () {
        _newArrowCheck(this, _this7);

        return $(out).remove();
      }.bind(this));
      rtbtns.appendChild(closeE);
      body.setAttribute('class', 'dlg-body');
      body.setAttribute('src', unsafeWindow.location.protocol + "//" + unsafeWindow.location.host + "/Student/Dajx" + location.search.replace('state', '') + location.hash);
      body.setAttribute('style', 'height:250px;width:450px;left:0;overflow:scroll;');
      body.setAttribute('scrolling', 'yes');
      out.appendChild(body);

      closeE.onclick = function () {
        _newArrowCheck(this, _this7);

        out.style.display = 'none';
      }.bind(this);

      body.onload = function () {
        _newArrowCheck(this, _this7);

        var contentDocument = unsafeWindow.document.querySelector('#main > div:nth-child(10) > iframe').contentDocument;
        var style = contentDocument.createElement('style');
        style.innerText = '*{max-width:520px!important;}';
        contentDocument.querySelector('head').appendChild(style);
        contentDocument.querySelector("body").setAttribute('style', 'width: 1040px;');
        contentDocument.querySelector("#main > div.el-main.el-w1200").setAttribute('style', 'width:520px');
        contentDocument.querySelector('#main > div.el-main.el-w1200 > div > div.el-stu-out.el-stu-content').setAttribute('style', 'width:520px');
        contentDocument.querySelector('#main > div.el-main.el-w1200 > div > div.el-stu-out.el-stu-content > div').setAttribute('style', 'width:520px');
        contentDocument.querySelector('#main > div.el-main.el-w1200 > div > div.el-stu-out.el-stu-content > div.el-main-right.el-stu-manual-r > div > div').setAttribute('style', 'width:520px');
        contentDocument.querySelector('#header').remove();
        contentDocument.querySelector('#footer').remove();
        contentDocument.querySelector('#main > div.el-main.el-w1200 > div > div.totop').remove();
        contentDocument.querySelector('#main > div.el-main.el-w1200 > div > div.el-stu-out.el-stu-content > div.el-main-left.el-main-left-thin').remove();
      }.bind(this);
    }.bind(this);

    openAnswerPageByFrameButton.type = 'button';
    openAnswerPageByFrameButton.value = '打开frame答案';
    var openAnswerPageByNewPageButton = document.createElement('input');

    openAnswerPageByNewPageButton.onclick = function () {
      _newArrowCheck(this, _this2);

      return window.open(unsafeWindow.location.protocol + "//" + unsafeWindow.location.host + "/Student/Dajx" + location.search.replace('state', '') + location.hash);
    }.bind(this);

    openAnswerPageByNewPageButton.type = 'button';
    openAnswerPageByNewPageButton.value = '新页面打开答案';
    $('.paperDesc').append(htTime, modificationTimeButton, '<br>', openAnswerPageByFrameButton, openAnswerPageByNewPageButton);
  }
}).bind(void 0)();