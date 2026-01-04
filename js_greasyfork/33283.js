// ==UserScript==
// @name         bb-helper
// @namespace    https://github.com/twose/bb
// @homepageURL  https://github.com/twose/bb
// @supportURL   https://github.com/twose/bb/issues
// @version      1.1.0
// @description  BB平台答题助手
// @author       twosee
// @license      MIT License
//
// @include      http://bb.cust.edu.cn*
// @downloadURL https://update.greasyfork.org/scripts/33283/bb-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/33283/bb-helper.meta.js
// ==/UserScript==

var error_tip = function() {
  if (top.confirm('脚本运行失败辣,你确定你是在答题界面吗？\n点击确定跳转到BB平台入口\n(请先通过CUSTED或门户登录BB平台)。')) {
    top.location.href = 'http://bb.cust.edu.cn/webapps/portal/frameset.jsp';
  }
};

var helper = function() {
  try {
    top.removeEle = function(e) {
      if (e) {
        e.parentNode.removeChild(e);
        return '';
      }
    };
    top.mf = top.frames[1];
    top.doc = top.mf.document;
    var tp = top.doc.getElementById('topbar');
    if (tp) {
      tp.style.display = 'none';
    }

    top.mf.Element.prototype.getText = function() {
      return (typeof this.textContent === 'string') ? this.textContent : this.innerText;
    };

    var tss = top.doc.getElementsByTagName('twosee');
    for (var x = tss.length; x >= 0; x--) {
      top.removeEle(tss[x]);
    }

    top.mf.f = top.mf.r = {};
    var f = top.doc.getElementsByClassName('noLabelField'), i = f.length;
    for (x = 0; x < i; x++) {
      top.mf.r[x] = {};
      top.mf.f[x] = f[x];
      top.mf.r[x].content = (top.mf.r[x].tit = f[x].getElementsByClassName(
          'vtbegenerated inlineVtbegenerated')[0].getText()).substr(0, 15) +
          f[x].getElementsByTagName('table')[0].getText().replace(/\s/g, '');
      var btn_l = '<button  class="button-4" style="margin-left:10px;"  onclick="top.search(';
      f[x].innerHTML =
          '<twosee style="display:block;position:relative;top:6px;">' +
          '<button class="button-4"  onclick="top.search(' + x + ')">搜标题</button>' +
          btn_l + x + ',1)">精准搜索</button>' +
          btn_l + x + ',2)">括号搜索①</button>' +
          btn_l + x + ',3)">括号搜索②</button>' +
          '</twosee>' + f[x].innerHTML;
    }
    top.mark = function(id) {
      var name = 'vtbegenerated inlineVtbegenerated';
      for (var x in top.mf.f) {
        if (f[x].getElementsByClassName) {
          top.mf.f[x].getElementsByClassName(name)[0].style = {};
        }
      }
      var eles = top.mf.f[id].getElementsByClassName(name)[0].style;
      eles.color = 'red';
      eles.fontSize = '18px';
      eles.fontWeight = 'bolder';
    };
    top.search = function(id, j) {
      var f = top.document.getElementsByTagName('frameset')[0];
      f.rows = '35%,*';
      top.mark(id);
      var f0 = top.document.getElementsByTagName('frame')[0];
      f0.style.borderBottom = '1px solid #000';
      var st = '', tit = top.mf.r[id].tit, content = top.mf.r[id].content;
      /*search text*/
      if (j === 2) {
        st = tit.match(/\S{0,20}(\(|（).*(）|\))\S{0,20}/)[0];
      } else if (j === 3) {
        st = tit.match(/\S{0,12}(\(|（).*(）|\))\S{0,12}/g).join('');
      } else {
        st = ((j) ? content : tit.replace(/\(|\)|\s|（|）/g, ''));
      }
      f0.src = 'https://www.baidu.com/s?wd=' + encodeURIComponent(st.replace(/\s+/, ' '));
    };
    top.result = (top.doc.getElementById('top_saveAllAnswersButton')) ?
        '脚本运行成功辣\n岂不美滋滋\nO(∩_∩)O~~' :
        '你没有在答题页面运行这个脚本喔╮(╯▽╰)╭';
    console.log('%c' + top.result,
        'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;font-size:64px;color:#00bbee;-webkit-text-fill-color:#00bbee;-webkit-text-stroke: 1px #00bbee;');
  }
  catch (e) {
    error_tip();
  }
};

var arguments = arguments || {callee: ''};
var is_tms = arguments.callee && arguments.callee.toString().match(/tms_/);

!function() {
  if (document.getElementById('top_saveAllAnswersButton')) {
    helper();
    return true;
  } else {
    var frms = top.window.frames;
    if (frms.length > 0) {
      for (var i = 0; i < frms.length; i++) {
        if (frms[i].location.href.match(/webapps\/assessment\/take/)) {
          helper();
          return true;
        }
      }
    }
  }
  if (!is_tms) {
    error_tip();
  }
}();