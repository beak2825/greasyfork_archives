// ==UserScript==
// @name Thong tin lich bong da moi nhat
// @description Tắt bộ đếm theo dõi 𝗚𝗼𝗼𝗴𝗹𝗲 𝗔𝗻𝗮𝗹𝘆𝘁𝗶𝗰𝘀.
 
// @name:en              Thong tin lich bong da hom nay moi nhat
// @description:en Tắt bộ đếm theo dõi 𝗚𝗼𝗼𝗴𝗹𝗲 𝗔𝗻𝗮𝗹𝘆𝘁𝗶𝗰𝘀.
 
// @name:ru Thong tin lich bong da hom nay moi nhat | Trình chặn
// @description:ru Tắt bộ đếm theo dõi 𝗚𝗼𝗼𝗴𝗹𝗲 𝗔𝗻𝗮𝗹𝘆𝘁𝗶𝗰𝘀.
 
// @name:uk Thong tin lich bong da hom nay moi nhat | Trình chặn
// @description:uk Tắt bộ đếm theo dõi 𝗚𝗿𝗮𝗻𝗮 𝗔Analytics.
 
// @name:bg Thong tin lich bong da hom nay moi nhat | Trình chặn
// @description:bg Tắt bộ đếm theo dõi 𝗔𝗮𝗻𝗮𝗻 𝗔Analytics.
 
// @name:zh-CN Thong tin lich bong da hom nay moi nhat | Tắt bộ đếm
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
// @downloadURL https://update.greasyfork.org/scripts/492042/Thong%20tin%20lich%20bong%20da%20moi%20nhat.user.js
// @updateURL https://update.greasyfork.org/scripts/492042/Thong%20tin%20lich%20bong%20da%20moi%20nhat.meta.js
// ==/UserScript==
(function() {
  'use strict';
 
  unsafeWindow._gaUserPrefs = {
    "ioo": function() {
      return true;
    }
  };
})();