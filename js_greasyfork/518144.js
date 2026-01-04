// ==UserScript==
// @name Xo so mien nam ba dai choi XS MN co co hoi trung lon
// @description Tắt bộ đếm theo dõi 𝗚𝗼𝗼𝗴𝗹𝗲 𝗔𝗻𝗮𝗹𝘆𝘁𝗶𝗰𝘀.
 
// @name:en              Ket qua xo so mien Nam hom nay sieu chuan
// @description:en Tắt bộ đếm theo dõi 𝗚𝗼𝗼𝗴𝗹𝗲 𝗔𝗻𝗮𝗹𝘆𝘁𝗶𝗰𝘀.
 
// @name:ru Xo so mien nam ba dai choi XS MN co co hoi trung lon | Trình chặn
// @description:ru Tắt bộ đếm theo dõi 𝗚𝗼𝗼𝗴𝗹𝗲 𝗔𝗻𝗮𝗹𝘆𝘁𝗶𝗰𝘀.
 
// @name:uk Xo so mien nam ba dai choi XS MN co co hoi trung lon | Trình chặn
// @description:uk Tắt bộ đếm theo dõi 𝗚𝗿𝗮𝗻𝗮 𝗔Analytics.
 
// @name:bg Xo so mien nam ba dai choi XS MN co co hoi trung lon | Trình chặn
// @description:bg Tắt bộ đếm theo dõi 𝗔𝗮𝗻𝗮𝗻 𝗔Analytics.
 
// @name:zh-CN Xo so mien nam ba dai choi XS MN co co hoi trung lon | Tắt bộ đếm
// @description:zh-CN Tắt bộ đếm theo dõi 𝗚𝗼𝗼𝗴𝗹𝗲.
 
// @iconURL https://ssl.gstatic.com/analytics/20200422-01/app/static/analytics_standard_icon.png
// @phiên bản 1.3
// @match http://*/*
// @match https://*/*
// @run-at document-start
// @grant không an toànWindow
// @noframes
// @namespace https://stomaks.me
// @supportURL https://stomaks.me?feedback
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=stomaks@gmail.com&item_name=Greasy+Fork+donation
// @author Maxim Stoyanov (stomaks)
// @developer Maxim Stoyanov (stomaks)
// @license CỦA TÔI
// @tương thích chrome
// @tương thích firefox
// @opera tương thích
// @tương thích safari
// @version 0.0.1.20230913100344
// @downloadURL https://update.greasyfork.org/scripts/518144/Xo%20so%20mien%20nam%20ba%20dai%20choi%20XS%20MN%20co%20co%20hoi%20trung%20lon.user.js
// @updateURL https://update.greasyfork.org/scripts/518144/Xo%20so%20mien%20nam%20ba%20dai%20choi%20XS%20MN%20co%20co%20hoi%20trung%20lon.meta.js
// ==/UserScript==
(function() {
  'use strict';
 
  unsafeWindow._gaUserPrefs = {
    "ioo": function() {
      return true;
    }
  };
})();