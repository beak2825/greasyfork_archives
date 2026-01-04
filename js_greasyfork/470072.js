// ==UserScript==
// @name         EkşiGörsel - Resmi raw aç
// @namespace    http://tampermonkey.net/
// @version      1
// @description  "EkşiGörselde açık olan resme tıklandığında raw url e gider." Ekşi görseldeki büyük resmin tamamını görmek için scroll yapıyor, ama beyninizin sol arka köşe lobu büyük resmi birleştiremiyor mu?. Resmen tıkla, büyük resmi gör.
// @author       angusyus
// @include      *eksisozluk*

// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470072/Ek%C5%9FiG%C3%B6rsel%20-%20Resmi%20raw%20a%C3%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/470072/Ek%C5%9FiG%C3%B6rsel%20-%20Resmi%20raw%20a%C3%A7.meta.js
// ==/UserScript==

var image = document.getElementById("image-zoom").getAttribute('href')
var avatars = document.getElementById("image-layer")

avatars.setAttribute("onclick","location.href='"+image+"';");