// ==UserScript==
// @name       m.mysmth.net cross link
// @description  add cross links between mobile, www2 and nForum views
// @include      https://*.mysmth.net/*
// @version 1.3.3
// @namespace https://greasyfork.org/users/5696
// @grant        none
// @require https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/5353/mmysmthnet%20cross%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/5353/mmysmthnet%20cross%20link.meta.js
// ==/UserScript==
function buildWww2BoardSearch(board) {
  return '<a href="https://www.mysmth.net/bbsbfind.php?board=' + board + '">搜索</a>';
}
function buildMobileArticleLink(board, tid) {
  return '<a href="https://m.mysmth.net/article/' + board + '/single/' + tid + '/0">手机版</a>';
}
function buildWww2ArticleDeleteLink(bid, tid) {
  return '<a href="https://www.mysmth.net/bbsdel.php?bid=' + bid + '&id=' + tid + '">www2</a>';
}
function buildMobileThreadLink(board, gid, start, page) {
  if (start !== null) {
    return '<a href="https://m.mysmth.net/article/' + board + '/' + gid + '/?s=' + start + '">手机版</a>';
  }
  page = (page !== null) ? '/?p=' + page : '';
  return '<a href="https://m.mysmth.net/article/' + board + '/' + gid + page + '">手机版</a>';
}
function buildNforumThreadLink(board, tid, page) {
  page = (page !== null && !isNaN(page)) ? '?p=' + page : '';
  return '<a href="https://www.mysmth.net/nForum/#!article/' + board + '/' + tid + page + '">nForum</a>';
}
function buildMobileThreadBoardLink(board, page) {
  page = (page !== null) ? '/?p=' + page : '';
  return '<a href="https://m.mysmth.net/board/' + board + page + '">手机版</a>';
}
function buildNforumThreadBoardLink(board, page) {
  page = (page !== null) ? '?p=' + page : '';
  return '<a href="https://www.mysmth.net/nForum/#!board/' + board + page + '">nForum</a>';
}

function buildGoForm() {
  $form = $('<form id="goform" action="/go" method="get" style="display: inline;"></form>');
  $form.append('<input name="name" type="text" size=10>');
  $form.append('<input type="submit" value="GO">');
  return $form;
}

function buildLoginForm(multiline) {
  $form = $('<form id="loginform" action="/user/login" method="post"></form>');
  $form.append('用户: <input id="userid" name="id" type="input">');
  $form.append((multiline)?'<br/>':'&nbsp;');
  $form.append('密码: <input id="passwd" name="passwd" type="password">');
  $form.append((multiline)?'<br/>':'&nbsp;');
  $form.append('<input class="loginbutton" id="TencentCaptcha" data-appid="2068091125" data-cbfn="captchaSuccess" type="button" value="刷新">');
  $form.append('<input name="ticket" id="ticket2" value="" type="hidden">');
  $form.append('<input name="randstr" id="randstr2" value="" type="hidden">');
  return $form;
}

function mobileLogin() {
  $(".loginbutton").off('click').attr("value", "正在登陆");
  $.ajax({
    url: "https://m.mysmth.net/user/login",
    method: "POST",
    data: $(this).parents('form').serialize(),
    complete: function() {  window.location.href = window.location.href+(window.location.href.includes("?")?"&":"?") + "reload="+Date.parse(new Date()); },
    error: function(xhr, status, error) { console.log(status); alert(error); },
    success: function(doc, status, xhr) { $(".loginbutton").attr("value", "提交成功 正在刷新"); }
  });
}

function patchMobile() {
  if(!$("#TencentCaptcha").length) {
  	var e = $(".sp.hl.f");
    if (e.length) {
      if (  e.text() == "您没有绑定手机号码，没有发表文章的权限"
         || e.text() == "您无权阅读此版面"
         ) {
        e.append(buildLoginForm(true));
        
        $(".loginbutton").click(mobileLogin);
        
        return
      }
    }
    if(!$(".menu.nav").children("a[href*='logout']").length) {
      $(".menu.nav").prepend(buildLoginForm(false));
      $(".loginbutton").click(mobileLogin);
    }
  }
  e = document.getElementsByClassName('menu nav') [0];
  if (e.children.length == 9) {
    var str = '';
    if (e.children[4].innerHTML.length > 2)
      str += e.children[4].outerHTML + '|';
    if (e.children[5].innerHTML.length > 2)
      str += e.children[5].outerHTML + '|';
    if (e.children[6].innerHTML.length > 2)
      str += e.children[6].outerHTML;
    if (str.length > 0)
      document.getElementsByClassName('sec nav') [0].innerHTML += '||' + str;
  }
  
  $(".menu.sp").append(e.outerHTML.replace('"TencentCaptcha"', '"TencentCaptcha2"'));
  $(".loginbutton").click(mobileLogin);
  
  $("form input[value='快速回复']").closest("div").remove();

  $(".menu.sp a[style]").replaceWith(buildGoForm());
  
  s = document.getElementsByTagName('script');
  for (var i = 1; i < s.length; i++) {
    s[i].parentNode.removeChild(s[i]);
  }

  var slist = document.getElementsByClassName('slist sec') [1];
  var linklist = {
    links: [],
    ptr: -1
  };

  var httpRequest = new XMLHttpRequest();
  httpRequest.responseType = 'document';
  httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === 4 && httpRequest.status === 200) {
      if(linklist.ptr < 0)
      {
        linklist.links = httpRequest.response.getElementsByClassName('nav sec') [0].children;
        linklist.ptr++;
      }
      else
      {
        var slist2 = httpRequest.response.getElementsByClassName('slist sec') [0];
        slist.parentNode.insertBefore(slist2, slist.nextSibling);
        slist = slist2;
      }

      if (linklist.ptr >= linklist.links.length)
      {
        return;
      }
      linklist.ptr++;
      var url = "https://m.mysmth.net" + linklist.links[linklist.ptr].getAttribute('href');
      httpRequest.open('GET', url, true);
      httpRequest.send();
    }
  };
  var url = "https://m.mysmth.net/hot";
  httpRequest.open('GET', url, true);
  httpRequest.send();
}
function patchMobileThreadBoard() {
  var match = /https?:\/\/m\.mysmth\.net\/board\/(\w+)(\/?\?p=(\d+))?/.exec(document.URL);
  var board = match[1];
  var page = match[3];
  var nav = document.getElementsByClassName('nav sec') [0];
  nav.innerHTML = nav.innerHTML + '||' + buildNforumThreadBoardLink(board, page) + '||' + buildWww2BoardSearch(board);
  //list
  list = document.getElementsByClassName('list sec') [0].children;
  for (var i = 0; i < list.length; i++) {
    li = list[i];
    t = li.children[0];
    a = li.children[1];
    d = a.textContent.substring(0, 10);
    var ta1 = t.childNodes[0];
    var ta2 = document.createElement('a');
    var ta3 = a.children[0];
    var ta4 = a.children[1];
    var span = document.createElement('span');
    ta1.title = li.textContent;
    if(d.match(/^\d{4}-\d{2}-\d{2}$/) && Date.now()-Date.parse(d) > 7*24*60*60*1000) {
      ta1.text = "(坟)"+ta1.text;
    }
    ta2.text = t.childNodes[1].textContent;
    ta2.href = ta1.href + '?p=' + Math.floor(parseInt(/\((\d+)\)/.exec(t.childNodes[1].textContent) [1]) / 10 + 1);
    t.replaceChild(ta2, t.childNodes[1]);
    t.appendChild(span);
    span.appendChild(ta3);
    span.appendChild(ta4);
    $(span).css("font-size", "x-small");
    $(span).find("a").css("margin-left", "5px");
    li.removeChild(a);
  }
}
function patchMobileThread() {
  var match = /https?:\/\/m\.mysmth\.net\/article\/(\w+)\/(\d+)(\?p=(\d+))?/.exec(document.URL);
  var board = match[1];
  var gid = match[2];
  var page = match[4];
  var start = 0;
  $('.nav.hl').each(function() {
    $(this).find("a[href*='/forward/']").each(function() {
      match = /\/\w+\/forward\/(\d+)/.exec($(this).attr("href"));
      start = match[1];
      $(this).append('|' + buildMobileArticleLink(board, start).replace('手机版', '单文'))
      $(this).append('|' + buildWww2ArticleDeleteLink(board, start).replace('www2', '删除'))
    });
  });
  $(".nav.sec").first().append('||' + buildNforumThreadLink(board, gid, page) + '||' + buildWww2BoardSearch(board));
}
function patchMobileArticle() {
  var match = /https?:\/\/m\.mysmth\.net\/article\/(\w+)\/(\d+)\?s=(\d+)/.exec(document.getElementsByClassName('sec nav') [0].childNodes[2].href);
  var board = match[1];
  var gid = match[2];
  var start = match[3];
  var nav = document.getElementsByClassName('nav sec') [0];
  nav.innerHTML = nav.innerHTML + '||' + buildNforumThreadLink(board, gid) + '||' + buildWww2BoardSearch(board);
}
function patchMobileArticleBoard() {
  var match = /https?:\/\/m\.mysmth\.net\/board\/(\w+)\/0(\?p=(\d+))?/.exec(document.URL);
  var board = match[1];
  var page = match[3];
  var nav = document.getElementsByClassName('nav sec') [0];
  nav.innerHTML = nav.innerHTML + '||' + buildNforumThreadBoardLink(board) + '||' + buildWww2BoardSearch(board);
}
function patchMobilePost() {
  var btns = document.getElementsByClassName('btn') [0].parentElement;
  var button = document.createElement('input');
  button.type = 'button';
  button.value = 'IMG';
  button.className = 'btn';
  button.onclick = function () {
    var textarea = document.getElementsByName('content') [0];
    var newvalue = textarea.value.substring(0, textarea.selectionStart);
    newvalue += '[img=';
    newvalue += textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
    newvalue += '][/img]'
    newvalue += textarea.value.substring(textarea.selectionEnd);
    textarea.value = newvalue;
  }
}
function patchWww2FindResult() {
  var match = /https?:\/\/www\.mysmth\.net\/bbsbfind\.php\?.*\bboard=(\w+)\b/.exec(document.URL);
  var board = match[1];
  var links = $("a[href*='bbscon']").each(function() {
    var id = /\bid=(\d+)/.exec($(this).attr("href"))[1]
    $(this).attr("href", "https://m.mysmth.net/article/"+board+"/single/"+id+"/0");
  });
}
function patchNforumThread() {
  var match = /https?:\/\/www\.mysmth\.net\/nForum\/#!article\/(\w+)\/(\d+)(\?p=(\d+))?/.exec(document.URL);
  var board = match[1];
  var gid = match[2];
  var page = match[4];
  var nav = document.getElementById('notice');
  nav.innerHTML += '&ensp;&ensp;【' + buildMobileThreadLink(board, gid, null, page).replace('href', 'onclick="javascript: window.location=this.href" href') + '】';
}
function patchNforumThreadBoard() {
  var match = /https?:\/\/www\.mysmth\.net\/nForum\/#!board\/(\w+)(\/?\?p=(\d+))?/.exec(document.URL);
  var board = match[1];
  var page = match[3];
  var nav = document.getElementById('notice');
  nav.innerHTML += '&ensp;&ensp;【' + buildMobileThreadBoardLink(board, page).replace('href', 'onclick="javascript: window.location=this.href" href') + '】';
}

if (document.URL.match(/^https?:\/\/m\.mysmth\.net\/\W?/)) {
  patchMobile();
}

  
if($(".menu.sp").text().includes("发生错误")) {
   // do nothing
} else if (document.URL.match(/https?:\/\/wap\.mysmth\.net\/index/)) {
  window.location.href = "https://m.mysmth.net/index";
} else if (document.URL.match(/https?:\/\/m\.mysmth\.net\/article\/\w+\/(\d+)/)) {
  patchMobileThread();
} else if (document.URL.match(/https?:\/\/m\.mysmth\.net\/board\/\w+\/0(\?p=(\d+))?/)) {
  patchMobileArticleBoard();
} else if (document.URL.match(/https?:\/\/m\.mysmth\.net\/board\/\w+(p=(\d+))?/)) {
  patchMobileThreadBoard();
} else if (document.URL.match(/https?:\/\/m\.mysmth\.net\/article\/\w+\/single\/(\d+)/)) {
  patchMobileArticle();
} else if (document.URL.match(/https?:\/\/m\.mysmth\.net\/article\/\w+\/post/)) {
  patchMobilePost();
} else if (document.URL.match(/https?:\/\/m\.mysmth\.net\/article\/\w+\/edit/)) {
  patchMobilePost();
} else if (document.URL.match(/https?:\/\/www\.mysmth\.net\/bbsbfind\.php\?.*\bboard=(\w+)\b/)) {
  patchWww2FindResult();
} else if (document.URL.match(/https?:\/\/www\.mysmth\.net\/nForum\/#!article\/(\w+)\/(\d+)/)) {
  patchNforumThread();
} else if (document.URL.match(/https?:\/\/www\.mysmth\.net\/nForum\/#!board\/(\w+)/)) {
  patchNforumThreadBoard();
}