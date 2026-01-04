// ==UserScript==
// @name         Metamory网站汉化
// @namespace    metamory-zh
// @version      1.7
// @description  Metamory网站汉化脚本
// @author       Fallen_ice
// @match        https://metamory.cc/*
// @icon         https://metamory.cc/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545676/Metamory%E7%BD%91%E7%AB%99%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/545676/Metamory%E7%BD%91%E7%AB%99%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

// 精确匹配
var data = JSON.parse(
    '{"Public":"公开","In order of addition":"从新到旧","In order of addition (old)":"从旧到新","Leave shared album":"离开共享相册","Photo detail":"照片信息","...loading":"...加载中","Tagged users":"用户标签","No tagged users":"没有用户标签","Photo shared":"照片已分享","Home":"主页","DM":"私信","My photo":"我的照片","My album":"我的相册","Share album":"共享相册","Other":"其他","Help & Feedback":"帮助 & 反馈","Profile":"个人信息","Trash":"回收站","Setting":"设置","Storage":"库存：","Edit":"编辑","Complate":"完成","User ID":"用户ID","User name":"用户名","User introduction":"自我介绍","Collaboration with other services":"链接其他账号","WIP":"开发中","Reaction":"反应","No notifications":"没有通知","Notifications sent to you will appear here":"发送给您的通知将显示在此处","Notifications":"通知","Upload photo":"上传照片","Main":"主要","No DMs":"没有私信","Find your friends and send them a DM!":"找到您的朋友并向他们发送私信！","In order of created":"从新到旧","In order of created (old)":"从旧到新","Users in instance":"房间中的用户","Unregistered Metamory user":"未注册Metamory账号","Select user to tag":"选择用户标记","Name (A-Z)":"名称(A-Z)","Name (Z-A)":"名称(Z-A)","Loading...":"加载中...","Add a user who is not candidates":"添加非候选用户","Create new MyAlbum":"创建新相册","Choice photo append type":"选择照片附加类型","Public album":"公开相册","Public album(password lock)":"公开相册（密码）","Delete":"删除","No results match your search criteria":"没有符合搜索条件的结果","Entering an exact username or searching by user ID will help you find friends":"输入准确的用户名或按用户ID搜索将帮助您找到朋友","Are you sure you want to leave this page?":"确定要离开此页面吗？","Cancel":"取消","Leave page":"离开页面","Create album":"创建相册","In order of update":"最近更新","In order of update (old)":"最老更新","No photos":"没有照片","Album has no photos":"相册没有照片","Share your memories by adding photos to this album.":"在相册中添加照片，分享您的回忆。","Append photo":"添加照片","Comparison":"比较","Public(password lock)":"公开（密码）","Share link copied":"分享链接已复制","Edit album":"编辑相册","Delete album":"删除相册","共有範囲":"公开范围","誰に向けて共有するかを選択できます":"您可以选择与谁共享","Anyone who knows the link can view it":"知道链接的任何人都可以查看","Anyone who knows the link and password can view it":"知道链接和密码的人可以查看","Viewing password":"查看密码","Please enter alphanumeric characters":"请输入字母数字字符","Copied to clipboard":"已复制到剪贴板","Updated":"已更新","Empty trash":"回收站空","If you delete a photo, it will be stored in the trash for 30 days":"如果删除照片，它将在回收站中保存30天","Profile settings":"个人信息设置","You can set up account email address, passwords, etc":"您可以设置帐户电子邮件地址、密码等","Notification settings":"通知设置","Manage notifications sent by Metamory":"管理Metamory发送的通知","Photo sync tools":"照片同步工具","Photo sync tools can be downloaded and configured":"照片同步工具可以下载和配置","Language":"语言","Select display language":"选择显示语言","English":"简体中文","Change email address":"更改电子邮件地址","Change the email address associated with your account":"更改您账号绑定的电子邮件地址","Change password":"更改密码","Change the password associated with your account":"更改您账号设定的密码","Logout":"登出","Delete account":"删除账号","Device auto upload":"设备自动上传","When you take a photo with your device, it will be automatically uploaded to Metamory":"当您使用设备拍照时，照片将自动上传到Metamory","Download photo sync tool":"下载照片同步工具","Download the photo sync tool to automatically upload photos taken with your device to Metamory":"下载照片同步工具，将设备拍摄的照片自动上传到Metamory","Please refer to the tutorial below for instructions on installing, starting, and closing the photo sync tool":"有关安装、启动和关闭照片同步工具的说明，请参阅下面的教程","Photo Sync Tool Tutorial":"照片同步工具教程","Current email address":"当前电子邮件地址","Password must be at least 12 characters long":"密码长度至少为12个字符","Update password":"更新密码","Add reaction":"添加反应","Frequent used":"常用","Append":"添加","Download":"下载","Complately delete from trash":"清空回收站","Completely delete":"彻底删除","Restore to MyPhoto":"恢复照片","loading...":"加载中...","Restored from trash":"从回收站中恢复","Deleted from trash":"从回收站中彻底删除","Are you sure you want to log out?":"您确定要登出吗？","ログイン":"登录","アカウントを作成":"注册","Email":"电子邮件地址","パスワード":"密码","をお忘れですか？":"遗忘了？","パスワードをお忘れですか？":"遗忘密码？","パスワードをリセット":"密码重置","メールアドレスを入力":"输入电子邮件地址","コードを送信":"发送代码","サインインに戻る":"返回登录","サインイン中":"登录中","ユーザー名またはパスワードが違います":"电子邮件地址或密码错误","パスワード（確認）":"确认密码","パスワードは12文字以上である必要があります":"密码长度至少为12个字符","パスワードが一致しません":"密码不一致","Download as zip":"下载为ZIP","Stopped due to many identical server requests occurring at once":"由于同时出现多个相同的服务器请求而停止运行","Uploading photos":"照片上传中","Take photos in instances with other users or enable log file output":"在与其他用户的情况下拍摄照片或启用日志文件输出","Upload success":"上传成功","Deleted photo":"照片已删除","Please reload the page":"请重新加载此页面","The page has been updated. Please reload the page to see the latest information.":"该页面已更新。请重新加载页面以查看最新信息。","Reload":"重新加载","Retrieving user...":"检索用户中...","AAA":"BBB","AAA":"BBB"}'
);

// 正则表达式匹配规则
var regexReplacements = [
  { pattern: /(\d+)\s*photos?/gi, replace: "$1张照片" }, // 匹配数字+items
  { pattern: /(\d+)\s*selected?/gi, replace: "$1 已选择" },
  { pattern: /\bAdd users from\s/gi, replace: "添加用户通过" },
  { pattern: /\bseconds.\s/gi, replace: "秒。" },
  { pattern: /\bAre you sure you want to delete the selected\s/gi, replace: "你确定要删除选中的" },
  { pattern: /\bDo you want to delete\s/gi, replace: "你想要删除" },
];

// 替换函数
function replaceText() {
  var elements = document.getElementsByTagName("*");
  for (var i = 0; i < elements.length; i++) {
    var nodes = elements[i].childNodes;
    for (var j = 0; j < nodes.length; j++) {
      if (nodes[j].nodeType === Node.TEXT_NODE) {
        var originalText = nodes[j].nodeValue;
        var trimmedText = originalText.trim();

        // 先执行精确匹配
        for (var key in data) {
          if (trimmedText === key) {
            nodes[j].parentNode.setAttribute("title", originalText);
            nodes[j].nodeValue = data[key];
            originalText = data[key]; // 更新文本内容
            break; // 精确匹配只需执行一次
          }
        }

        // 执行正则表达式替换
        regexReplacements.forEach(function(rule) {
          var newText = originalText.replace(rule.pattern, rule.replace);
          if (newText !== originalText) {
            nodes[j].parentNode.setAttribute("data-original", originalText);
            nodes[j].nodeValue = newText;
            originalText = newText; // 更新当前文本
          }
        });
      }
    }
  }
}

// 剩余代码
(function () {
  "use strict";

  var observer = new MutationObserver(function (mutations) {
    for (var mutation of mutations) {
      if (mutation.type === "childList") {
        replaceText();
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();