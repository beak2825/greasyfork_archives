// ==UserScript==
// @name         工单全量工具批量处理
// @namespace    https://www.zhihu.com/people/yin-xiao-bo-11
// @version      0.1
// @description  可访问性优化
// @author       Veg
// @include    http://zticket.in.zhihu.com/contents*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368013/%E5%B7%A5%E5%8D%95%E5%85%A8%E9%87%8F%E5%B7%A5%E5%85%B7%E6%89%B9%E9%87%8F%E5%A4%84%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/368013/%E5%B7%A5%E5%8D%95%E5%85%A8%E9%87%8F%E5%B7%A5%E5%85%B7%E6%89%B9%E9%87%8F%E5%A4%84%E7%90%86.meta.js
// ==/UserScript==
(function () {
  setTimeout(function () {
    proc(document);
    amo(proc);
  }, 10);
  function proc(d) {
    //给时间信息增加焦点
    var time = d.querySelectorAll('td');
    for (var i = 0; i < time.length; i++) {
      var timeText = time[i].innerText;
      var year = timeText.substring(0, 4);
      var parent = time[i].parentNode;
      if (year == '2011' || year == '2012' || year == '2013' || year == '2014' || year == '2015' || year == '2016' || year == '2017' || year == '2018') {
        var span = document.createElement('span');
        span.setAttribute('tabindex', '0');
        span.setAttribute('role', 'link');
        span.className = "spanFocus";
        span.addEventListener("keydown", function (k) {
          if (k.keyCode == 13 || k.keyCode == 32) {
            this.click();
          }
        }, null);
        if (parent.tagName == "SPAN")
          break;
        parent.insertBefore(span, time[i]);
        span.appendChild(time[i]);
      }
    }
//自动展开详细信息
    (function () {
      setTimeout(function () {
        var trs = document.querySelector('tr.ant-table-expanded-row-level-1');
        if (trs == null) {
          var zk = document.querySelectorAll('span.spanFocus');
          for (var i = 0; i < zk.length; i++) {
            zk[i].click();
          }
        }
      }, 100);
    })();

    var url = window.location.href;
    var tokens = url.substring(49);
    var type = tokens.split('&');
    if (type[0] == 'question' || type[0] == 'answer' || type[0] == 'comment' || type[0] == 'article' || type[0] == 'pin') {
      (function () {
        setTimeout(function () {
          var btn = document.querySelector('button[type="submit"]');
          var parent = btn.parentNode;
          var action = document.querySelector('button.button-batchAction');
          if (action == null) {
            //插入删除理由输入框
            var input = document.createElement('input');
            input.className = 'reasonText';
            input.type = 'text';
            input.placeholder = '请输入删除理由';
            input.value = localStorage.getItem('actionReason');
            input.setAttribute('style', 'background:#FF00FF;');
            parent.appendChild(input);
            //插入批量删除按钮
            var button = document.createElement('button');
            button.className = 'button-batchAction';
            button.innerHTML = '批量删除';
            button.setAttribute('style', 'background:#FF00FF;');
            button.addEventListener('click', batchDelete, null);
            parent.appendChild(button);
          }
        }, 10);
      })();
      //批量处理的选择复选框
      var tr = document.querySelectorAll('tr.ant-table-row-level-0');
      for (var i = 0; i < tr.length; i++) {
        var tag = tr[i].querySelector('div.ant-tag-has-color');
        if (tag == null) {
          var td = tr[i].querySelectorAll('td');
          for (var j = 0; j < td.length; j++) {
            var parent = td[1].parentNode;
            var span = document.createElement('span');
            span.setAttribute('tabindex', '0');
            span.setAttribute("role", "checkbox");
            span.className = 'contentId';
            span.setAttribute('aria-checked', 'false');
            span.setAttribute('style', 'background: #FFA500;');
            span.addEventListener('click', function (k) {
              k.stopPropagation();
              if (this.classList.contains("itemSelected")) {
                this.classList.remove("itemSelected");
                this.setAttribute("aria-checked", "false");
                this.setAttribute('style', 'background: #FFA500;');
              } else {
                this.classList.add("itemSelected");
                this.setAttribute("aria-checked", "true");
                this.setAttribute('style', 'background: #FF69B4;');
              }
            }, null);
            if (parent.tagName == 'SPAN')
              break;
            parent.insertBefore(span, td[1]);
            span.appendChild(td[1]);
          }
        }
      }
    }

  }
  function amo(processFunction) {
    var mcallback = function (records) {
      records.forEach(function (record) {
        if (record.type == 'childList' && record.addedNodes.length > 0) {
          var newNodes = record.addedNodes;
          for (var i = 0, len = newNodes.length; i < len; i++) {
            if (newNodes[i].nodeType == 1) {
              processFunction(newNodes[i]);
            }
          }
        }
      });
    };
    var mo = new MutationObserver(mcallback);
    mo.observe(document.body, {
      'childList': true,
      'subtree': true
    });
  }
})();
document.addEventListener("keydown", function (k) {
  var t = k.target;
  if (t.classList.contains('contentId')) {
    if (k.keyCode == 32 || k.keyCode == 13) {
      t.click();
    }
  }
  var content = document.querySelectorAll('span.contentId');
  for (var i = 0; i < content.length; i++) {
//全选
    if (k.shiftKey && k.keyCode == 81) {
      content[i].classList.add("itemSelected");
      content[i].setAttribute('aria-checked', 'true');
      content[i].setAttribute('style', 'background: #FF69B4;');
    }
//取消全选
    if (k.shiftKey && k.keyCode == 65) {
      content[i].classList.remove("itemSelected");
      content[i].setAttribute('aria-checked', 'false');
      content[i].setAttribute('style', 'background: #FFA500;');
    }
  }
//聚焦到第一个操作按钮
  if (k.altKey && k.keyCode == 83) {
    document.querySelector('button.ant-dropdown-trigger').focus();
  }
}, null);
//批量处理函数
function batchDelete() {
  var url = window.location.href;
  var tokens = url.substring(49);
  var types = tokens.split('&');
  var type = types[0];
  var reason = document.querySelector('input.reasonText').value;
  localStorage.setItem('actionReason', reason);
  var content = document.querySelectorAll('[aria-checked="true"]');
  for (var i = 0; i < content.length; i++) {
    var id = content[i].innerText;
    var url = 'http://zticket.in.zhihu.com/api/content';
    //问题
    if (type == 'question') {
      var x = '{"object_id":' + id + ',"object_type":"question","action_info":"{\\"action\\":\\"remove\\",\\"recover\\":0,\\"reason\\":' + reason + '}"}';
    }
    //回答
    else if (type == 'answer') {
      var x = '{"object_id":' + id + ',"object_type":"answer","action_info":"{\\"action\\":\\"remove\\",\\"recover\\":0,\\"reason\\":' + reason + '}"}';
    }
    //评论
    else if (type == 'comment') {
      var x = '{"object_id":"' + id + '","object_type":"comment","action_info":"{\\"action\\":\\"remove\\",\\"recover\\":0,\\"reason\\":' + reason + '}"}';
    }
    //文章
    else if (type == 'article') {
      var x = '{"object_id":"' + id + '","object_type":"article","action_info":"{\\"action\\":\\"remove\\",\\"recover\\":0,\\"reason\\":' + reason + '}"}';
    }
    //想法
    else if (type == 'pin') {
      var x = '{"object_id":"' + id + '","object_type":"pin","action_info":"{\\"action\\":\\"remove\\",\\"recover\\":0,\\"reason\\":' + reason + '}"}';
    }
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", url, false);
    xmlhttp.setRequestHeader('Accept', 'application/json');
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.send(x);
    window.location.reload();
  }
}