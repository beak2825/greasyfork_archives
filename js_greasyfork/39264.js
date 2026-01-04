// ==UserScript==
// @name     Барахолка foto.ru  
// @version  1.3
// @description Убирает баннеры на барахолке foto.ru . Взято  за основу у Maranchuk Sergey <slav0nic0@gmail.com>
// @author   любитель
// @include http*://club.foto.ru/secondhand2/*
// @require https://cdnjs.cloudflare.com/ajax/libs/zepto/1.2.0/zepto.min.js
// @namespace https://greasyfork.org/users/3786
// @downloadURL https://update.greasyfork.org/scripts/39264/%D0%91%D0%B0%D1%80%D0%B0%D1%85%D0%BE%D0%BB%D0%BA%D0%B0%20fotoru.user.js
// @updateURL https://update.greasyfork.org/scripts/39264/%D0%91%D0%B0%D1%80%D0%B0%D1%85%D0%BE%D0%BB%D0%BA%D0%B0%20fotoru.meta.js
// ==/UserScript==

$('.left-banner, .right-banner, .bannerbox').remove();
$('body > div > div').width('100%');