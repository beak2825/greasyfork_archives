// ==UserScript==
// @name         CL115离线助手
// @namespace    1024.t66y
// @version      1.1
// @description  115离线助手 for 1024
// @author       1024
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @match       http://115.com/*
// @match       http://*.115.com/*
// @match       https://115.com/*
// @match       https://*.115.com/*
// @match       http://www.t66y.com/htm_data/2/*
// @match       http://www.t66y.com/htm_data/15/*
// @match       http://t66y.com/htm_data/2/*
// @match       http://t66y.com/htm_data/15/*
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_openInTab
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/18697/CL115%E7%A6%BB%E7%BA%BF%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/18697/CL115%E7%A6%BB%E7%BA%BF%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
var X_userID = '0'; //115用户ID
X_userID = GM_getValue('X_userID', '0'); //115用户ID缓存
//获取115ID
if (X_userID == '0') {
  if (location.host.indexOf('115.com') >= 0) {
    if (typeof (window.wrappedJSObject.user_id) != 'undefined') {
      X_userID = window.wrappedJSObject.user_id;
      GM_setValue('X_userID', X_userID);
      alert('115登陆成功！');
      return;
    }
  } else {
    alert('请先登录115账户！');
    GM_setValue('X_userID', '0');
    GM_openInTab('http://115.com');
    return;
  }
}
if (location.host.indexOf('115.com') >= 0) {
  //115到此结束
  return;
}
var fullUrl = 'http://115.com/?ct=offline&ac=space&_='; //115Key地址
//离线至115
function LXTo115(url)
{
  fullUrl += new Date().getTime();
  GM_xmlhttpRequest({
    method: 'GET',
    url: fullUrl,
    onload: function (responseDetails)
    {
      if (responseDetails.responseText.indexOf('html') >= 0) {
        alert('请先登录115账户！然后刷新页面即可！');
        GM_setValue('X_userID', '0');
        GM_openInTab('http://115.com');
        return;
      }
      var sign115 = JSON.parse(responseDetails.responseText).sign;
      var time115 = JSON.parse(responseDetails.responseText).time;
      downTo115(url, X_userID, sign115, time115);
    }
  });
}
//POST离线报文

function downTo115(url, X_userID, sign115, time115) {
  var lxURL = 'http://115.com/web/lixian/?ct=lixian&ac=add_task_url&' + 'sign=' + sign115 + '&time=' + time115 + '&uid=' + X_userID + '&url=' + encodeURIComponent(url);
  GM_xmlhttpRequest({
    method: 'GET',
    url: lxURL,
    onload: function (responseDetails) {
      var lxRs = JSON.parse(responseDetails.responseText); //离线结果
      if (lxRs.state) {
        $('body').prepend('<div style="font-size: 22px; position: fixed;background-color: #0f7884;padding: 10px;color: #0f0 !important;">离线下载成功！</div>');
        var ModifyURL = window.location.href;
        window.location.href = ModifyURL.split('#') [0] + '#DownloadOK';
        window.close();
        window.setTimeout(function () {
          window.opener = null;
          window.open('', '_self');
          window.close();  //默认离线成功后自动关闭当前页面，如不需要请注释掉此行！
        }, 100);
      } else {
        $('body').prepend('<div style="font-size: 22px; position: fixed;background-color: #0f7884;padding: 10px;color: #f00 !important;">离线下载失败！错误信息：' + lxRs.error_msg + '</div>');
      }
    }
  });
}
//1024

var thisURL = window.location.href; //当前页面完整url（通过判断是否包含magnet链接决定执行步骤）
if (thisURL.indexOf('#') >= 0) {
  if (thisURL.indexOf('magnet:') >= 0) {
    var maglink = thisURL.split('#') [1];
    LXTo115(maglink);
  }
} else {
  //将种子下载地址转换为磁力链接
  var magnet = 'magnet:?xt=urn:btih:' + $('a:contains(\'hash=\')').text().split('=') [1].slice(3);
  var newURL = window.location.href + '#' + magnet; //将磁链附加到地址中
  //写入一键下载功能
  $('body').prepend('<div style="font-size: 22px; position: fixed;background-color: #f9f9ec !important;padding: 5px;width: 100%;">' + '<a style="color: blue" href="javascript:window.location=\'' + newURL + '\';location.reload();">' + magnet + '</a></div>');
}
///* */