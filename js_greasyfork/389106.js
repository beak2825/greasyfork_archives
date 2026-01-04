// ==UserScript==
// @name        ekşi sözlük sol frame ve ekşi şeyler bölümünü gizleme
// @author      Hasan KÖROĞLU
// @namespace   hasankoroglu.com
// @description Arif'in Manchester'a attığı golü ararken başka konulara dalmamak için sol frame'i ve ekşi şeyler başlıklarını gizlemeyi sağlıyor.
// @include     https://eksisozluk.com/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/389106/ek%C5%9Fi%20s%C3%B6zl%C3%BCk%20sol%20frame%20ve%20ek%C5%9Fi%20%C5%9Feyler%20b%C3%B6l%C3%BCm%C3%BCn%C3%BC%20gizleme.user.js
// @updateURL https://update.greasyfork.org/scripts/389106/ek%C5%9Fi%20s%C3%B6zl%C3%BCk%20sol%20frame%20ve%20ek%C5%9Fi%20%C5%9Feyler%20b%C3%B6l%C3%BCm%C3%BCn%C3%BC%20gizleme.meta.js
// ==/UserScript==

document.getElementById('index-section').style.display = 'none';
document.getElementById('aside').style.display = 'none';