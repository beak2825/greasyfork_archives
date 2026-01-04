// ==UserScript==
// @name        wolai 自动登录脚本
// @namespace   Violentmonkey Scripts
// @match       https://www.wolai.com/
// @match       https://www.wolai.com/login
// @require     https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant       GM_getValue
// @version     1.3
// @author      jasongwq
// @description 2020/11/26 下午7:23:49
// @downloadURL https://update.greasyfork.org/scripts/416706/wolai%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/416706/wolai%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function() {
    'use strict';
  
    //请在数据中设置!!用户的我来首页,用于用户登录后自动跳转,例如var userHomeUrl='https://www.wolai.com/xxx'
    var userHomeUrl = GM_getValue("userHomeUrl")
    //请在数据中设置!!用户的登录参数,可通过开启Chrome Debug Tool,并在Network页面勾选Preserver log选项后点击wolai的登录,查找login请求,在请求参数中拷贝
    //例如var userInfo = '{"phoneNumber":"xxx","loginType":"password","countryCode":"+86","password":"xxx"}';
    var userInfo = GM_getValue("userInfo")
    
    var loginUrl = 'https://api.wolai.com/v1/authentication/auth/login';
    $.ajax({
      type: 'POST',
      url: loginUrl,
      contentType: 'application/json;charset=UTF-8',
      data: JSON.stringify(userInfo),
      success: function(data) {
        // redirect to user home
        location.href = userHomeUrl;
      },
      headers: {
        Accept: "application/json, text/plain, */*"
      },
      crossDomain: true,
      xhrFields: {
             withCredentials: true
        },
    });
})();