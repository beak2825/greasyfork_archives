// ==UserScript==
// @name            Shanbay message assistant
// @namespace       http://userscripts.org/scripts/show/183146
// @description     Shanbay 短信助手
// @version         0.1.1
// @author          mozillazg
// @include         http://www.shanbay.com/*
// @downloadURL https://update.greasyfork.org/scripts/338/Shanbay%20message%20assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/338/Shanbay%20message%20assistant.meta.js
// ==/UserScript==

function userInfo (url, callback) {
  $.ajax({
    url: url,
    dataType: "html",
    success: function(data) {
      username = $("#profile .profile h2 small", data).text();
      username = username.replace('(', '').replace(')', '').trim();
      callback(username);
    }
  });
};

function htmlSendMsgLink (username) {
    return '<br /><a href="/17mail/compose/' + username +
           '/" class="no-hover" title="发短信">发短信</a>';
};

// 用户空间增加“发短信”链接
function addSendLinkOnHome () {
  var username = $("#profile .profile h2 small").text();
  username = username.replace('(', '').replace(')', '').trim();
  var sendLink = htmlSendMsgLink(username);
  // 在头像后增加“发短信”链接
  $("#profile img").parent().append(sendLink)
};

// 打卡记录页面
function addSendLinkOnCheckin (username) {
  var sendLink = htmlSendMsgLink(username);
  var checkins = $("#checkin .checkin");
  $.each(checkins, function (index, value) {
    $(".avatar", value).append(sendLink);
  });
}

// 新消息通知
function newMsgNotify () {
  var title = $("title");
  var sourceTitle = title.html().replace(/\[\d+条未读短信\] \| /, '');
  $.ajax({
    url: "http://www.shanbay.com/17mail/inbox/",
    dataType: "html",
    success: function(data) {
      var number = $(".messages tr td strong", data).length;
      if (number > 0) {
        title.html('[' + number + '条未读短信] | ' + sourceTitle);
      } else {
        title.html(sourceTitle);
      }
    }
  });
};

// run
(function () {
  var currentLink = $(location).attr('href');
  // 用户空间
  if (currentLink.match(/\/bdc\/review\/progress\/\d+/) || currentLink.match(/\/user\/list\/\d+/)) {
    addSendLinkOnHome();
  } else if (currentLink.match(/\/checkin\/user\/\d+/)) {
    // 打卡列表
    var url = $("#checkin .avatar a").attr('href');
    if (url) {
      userInfo(url, addSendLinkOnCheckin);
    }
  }
  newMsgNotify();
  window.setInterval(function() {
    newMsgNotify();
  }, 60000);
})();
