// ==UserScript==
// @namespace         https://github.com/tiansh
// @name              Zhihu Visitor
// @name:en           Zhihu Visitor
// @name:zh           知乎免登录
// @name:zh-CN        知乎免登录
// @description       知乎免登录查看回答全文
// @description:en    View zhihu.com answers without sign in
// @description:zh    知乎免登录查看回答全文并显示更多回答
// @description:zh-CN 知乎免登录查看回答全文并显示更多回答
// @include           *://www.zhihu.com/*
// @homepageURL       https://tiansh.github.io/us-else/zhihu_visitor/
// @supportURL        https://github.com/tiansh/us-else/issues/
// @version           3.3
// @grant             GM_addStyle
// @grant             GM_xmlhttpRequest
// @connect-src       www.zhihu.com
// @downloadURL https://update.greasyfork.org/scripts/368116/Zhihu%20Visitor.user.js
// @updateURL https://update.greasyfork.org/scripts/368116/Zhihu%20Visitor.meta.js
// ==/UserScript==

var mina = function () {

  // 这个脚本不对已经登录的做任何事情
  if (function isLogin() {
    return !document.querySelector('.js-signin-noauth');
  }()) return;

  // 基础工具

  // 判断一个元素是否匹配特定选择器
  var matches = (function () {
    var ep = Element.prototype, matches = ep.matches ||
      ep.mozMatchesSelector || ep.oMatchesSelector ||
      ep.webkitMatchesSelector || ep.msMatchesSelector;
    return function (element, selector) {
      try { return matches.call(element, [selector]); }
      catch (e) { return null; }
    };
  }());

  // 找满足条件的父元素
  var parent = function (element, selector) {
    while (element && !matches(element, selector)) {
      element = element.parentNode;
    }
    return element;
  };

  // 对象转请求参数
  var param = function (data) {
    return Object.keys(data).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
    }).join('&');
  };

  // 样式

  // 隐藏掉会员功能按钮
  GM_addStyle(function () { /*!CSS
    // 投票框的“赞同”“反对”等
    .zm-votebar .label, .zm-votebar .vote-arrow, .zm-votebar .down, .zm-comment-form { display: none; }
    .zm-votebar .count { top: 8px; }
    .zm-votebar .up { height: 40px; }
    .zm-votebar .up, .zm-votebar .down { cursor: auto; }
    html.no-touch .zm-votebar .up:hover, html.no-touch .zm-votebar .down:hover, .zm-votebar .up.pressed, .zm-votebar .down.pressed { color: #698ebf; background: #eff6fa; }
    .feed-item .zm-votebar { display: block; }
    .zm-votebar::after { content: " "; height: 40px; width: 38px; display: block; margin-top: -40px; position: relative; }
    // 回答下的按钮，感谢、没有帮助等
    .meta-item[name="thanks"], .meta-item[name="share"], .meta-item[name="favo"], .meta-item[name="nohelp"], .meta-item[name="report"], .zm-meta-panel > .zg-bull { display: none !important; }
    // 原生的显示全部按钮
    .toggle-expand { display: none !important; }
    // “更多”按钮按下时的样式
    .zu-button-more:active { background: #ddd; box-shadow: none; cursor: auto; }
    // 用户信息的私信与关注按钮，话题的关注按钮，问题的关注按钮
    .zh-profile-card.member .operation,
    .zh-profile-card.topic .operation,
    #zh-question-side-header-wrap .follow-button { display: none; }
    // 长答案
    .zh-summary + .zm-editable-content { display: block !important; }
  */ }.toString().replace(/\r\n|\r/g, '\n').replace(/\n\s*\/\/.*\n/g, '\n').replace(/(^.*\n)|(\n.*$)/g, ''));

  // 自动处理回答
  var fixAnswers = (function () {
    var handlers = [];
    var observe = function () {
      var fixed = [].slice.call(document.querySelectorAll([
        '.zm-item-answer + .zm-item-answer .zm-item-rich-text:not([zvhfs])',
        '.awesome-answer-list .zm-item-rich-text:not([zvhfs])'
      ].join(',')), 0);
      fixed.forEach(function (item) {
        item.setAttribute('zvhfs', '');
        handlers.forEach(function (f) { f(item); });
      });
    };
    var observer = new MutationObserver(observe);
    observer.observe(document.body, { 'childList': true, 'subtree': true });
    return function fixAnswers(callback) { handlers.push(callback); };
  }());

  // 全局处理点击事件
  var handleClick = (function () {
    var handlers = [];
    document.addEventListener('click', function (e) {
      if (e.which !== 1) return;
      var matched = false, target = e.target, callbacks = [];
      handlers.forEach(function (handler) {
        if (!matches(target, handler.selector)) return;
        matched = true; callbacks.push(handler.callback);
      });
      if (matched) { e.preventDefault(); e.stopPropagation(); }
      callbacks.forEach(function (f) { f(e); });
    }, true);
    return function handleClick(selector, callback) {
      handlers.push({ 'selector': selector, 'callback': callback });
    };
  }());

  // 显示回答的评论
  handleClick(['.zh-question-answer-wrapper:not(.autohide-false) .zm-item-answer[data-aid] .toggle-comment',
    '.awesome-answer-list .zm-item-answer[data-aid] .toggle-comment'].join(','),
  function showComment(e) {
    var ans = parent(e.target, '[data-aid]');
    // 避免显示多个评论
    if (ans.hasAttribute('data-cmtshown')) return;
    ans.setAttribute('data-cmtshown', '');
    // 显示评论
    var id = ans.getAttribute('data-aid');
    var metaPanel = ans.querySelector('.zm-meta-panel');
    metaPanel.className = 'zm-meta-panel goog-scrollfloater focusin';
    var commentBox = document.createElement('div');
    commentBox.innerHTML = '<div class="zm-comment-box" style=""><i class="icon icon-spike zm-comment-bubble"></i><div class="zm-comment-spinner">正在加载，请稍等 <i class="spinner-lightgray"></i></div></div>';
    commentBox = metaPanel.parentNode.insertBefore(commentBox.firstChild, metaPanel.nextSibling);
    GM_xmlhttpRequest({
      'method': 'GET',
      'url': location.protocol + '//www.zhihu.com/node/AnswerCommentBoxV2?params={%22answer_id%22%3A%22' + id + '%22%2C%22load_all%22%3Afalse}',
      'onload': function (resp) {
        commentBox.outerHTML = resp.responseText;
        var loadmore = ans.querySelector('.load-more');
        if (loadmore) {
          loadmore.href = ans.querySelector('.answer-date-link').href;
          loadmore.target = '_blank';
        }
      },
    });
  });

  // 显示回答时修复回答中的一些链接什么的
  fixAnswers(function fixImages(ans) {
    // 解决图片延迟加载问题
    var imgs = ans.querySelectorAll('img[data-actualsrc]');
    Array.prototype.forEach.call(imgs, function (img) {
      img.setAttribute('src', img.getAttribute('data-actualsrc'));
    });
  });

  // “添加评论”字样改成“0 条评论”
  fixAnswers(function fixAddComment(content) {
    var comment = parent(content, '.zm-item-answer').querySelector('.meta-item[name="addcomment"]').lastChild;
    var text = comment.textContent, re = text.replace('添加评论', '0 条评论');
    if (re !== text) comment.textContent = re;
  });

  // 显示更多回答
  handleClick('.zu-button-more', (function () {
    // 显示一条回答
    var show = function (ans) {
      var lastAnswer = document.querySelectorAll('.zm-item-answer');
      lastAnswer = lastAnswer[lastAnswer.length - 1];
      var ref = lastAnswer.nextSibling;
      var newAnswerWrap = document.createElement('div');
      newAnswerWrap.innerHTML = ans;
      var newAnswer = newAnswerWrap.firstChild;
      ref.parentNode.insertBefore(newAnswer, ref);
    };

    // 已经没有更多的回答了
    var nomore = function () {
      var button = document.querySelector('.zu-button-more');
      button.parentNode.removeChild(button);
    };

    // 处理显示更多回答的按钮
    return function showMoreButton(e) {
      var button = e.target;
      if (button.classList.contains('loading')) return;
      button.classList.add('loading');

      var offset = document.querySelectorAll('.zm-item-answer').length;
      var pagesize = 20;
      var url_token = Number(location.pathname.match(/\/(\d+)$/)[1]);
      var params = JSON.stringify({
        'url_token': url_token,
        'pagesize': pagesize,
        'offset': offset,
      });

      var _xsrf = document.querySelector('input[name="_xsrf"]').value;

      var data = {
        '_xsrf': _xsrf,
        'method': 'next',
        'params': params
      };

      GM_xmlhttpRequest({
        'method': 'POST',
        'url': location.protocol + '//www.zhihu.com/node/QuestionAnswerListV2',
        'headers': {
          'Referer': location.href,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        'data': param(data),
        'onload': function (response) {
          var resp = JSON.parse(response.responseText);
          resp.msg.forEach(show);
          if (resp.msg.length < 20) nomore();
          button.classList.remove('loading');
        },
        'onerror': function () {
          button.classList.remove('loading');
        }
      });
    };
  }()));

};

if (['complete', 'loaded', 'interactive'].indexOf(document.readyState) !== -1) mina();
else window.addEventListener('DOMContentLoaded', mina);
