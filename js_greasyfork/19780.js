// ==UserScript==
// @name        osc_tweets_never_miss
// @namespace   http://www.oschina.net/
// @description osc首页动弹提醒
// @include     http://www.oschina.net/
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19780/osc_tweets_never_miss.user.js
// @updateURL https://update.greasyfork.org/scripts/19780/osc_tweets_never_miss.meta.js
// ==/UserScript==
function notifyTweets(title, body, icon)
{
  // Let's check if the browser supports notifications
  var options =
  {
    body: body,
    icon: icon
  };
  if (!('Notification' in window))
  {
    alert('当前浏览器不支持桌面通知！！');
  } 
  else if (Notification.permission === 'granted')
  {
    // If it's okay let's create a notification
    createNotify(title, options);
  } 
  else if (Notification.permission !== 'denied')
  {
    Notification.requestPermission(function (permission)
    {
      // If the user is okay, let's create a notification
      if (permission === 'granted')
      {
        createNotify(title, options);
      }
    });
  }
}
function createNotify(title, options)
{
  var notification = new Notification(title, options);
  notification.onclick = function (event)
  {
    event.preventDefault();
    notification.close();
  };
}
$(document).on('DOMNodeInserted', '.TopTweets li', function (e)
{
  var user = $(e.target).find('.user a').text();
  var body = $(e.target).find('.log').text();
  var icon = $(e.target).find('.SmallPortrait').attr('src');
  notifyTweets(user, body, icon);
});
