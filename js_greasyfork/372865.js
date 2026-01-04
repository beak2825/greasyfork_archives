// ==UserScript==
// @name Aventics
// @description For easy basket copying 
// @author Ruslan Rakhmanov 
// @version 1.0
// @include https://www.aventics.com/INTERSHOP/web/WFS/*
// @namespace https://greasyfork.org/users/217439
// @downloadURL https://update.greasyfork.org/scripts/372865/Aventics.user.js
// @updateURL https://update.greasyfork.org/scripts/372865/Aventics.meta.js
// ==/UserScript==
// [1] Оборачиваем скрипт в замыкание, для кроссбраузерности (opera, ie)
(function (window, undefined) {  // [2] нормализуем window
    var w;
    if (typeof unsafeWindow != undefined) {
        w = unsafeWindow
    } else {
        w = window;
    }
    // В юзерскрипты можно вставлять практически любые javascript-библиотеки.
    // Код библиотеки копируется прямо в юзерскрипт.
    // При подключении библиотеки нужно передать w в качестве параметра окна window
    // Пример: подключение jquery.min.js
    // (function(a,b){function ci(a) ... a.jQuery=a.$=d})(w);

    // [3] не запускаем скрипт во фреймах
    // без этого условия скрипт будет запускаться несколько раз на странице с фреймами
    if (w.self != w.top) {
        return;
    }
    // [4] дополнительная проверка наряду с @include
    if (/https:\/\/www.aventics.com\/INTERSHOP\/web\/WFS/.test(w.location.href)) {
        //Ниже идёт непосредственно код скрипта 

      	s=document.getElementsByClassName('avts-cart-functionality');
				for (i=0;i<s.length;i++) {
					s[i].style.display="none";
				};      
      	s=document.getElementsByClassName('avts-global-footer');
				for (i=0;i<s.length;i++) {
					s[i].style.display="none";
				};
      	s=document.getElementsByClassName('alert-info');
				for (i=0;i<s.length;i++) {
					s[i].style.display="none";
				};
      	s=document.getElementsByClassName('col-lg-3');
				for (i=0;i<s.length;i++) {
					s[i].style.display="none";
				};
      	s=document.getElementsByClassName('col-lg-9');
				for (i=0;i<s.length;i++) {
					s[i].style.display="none";
				};
      	s=document.getElementsByClassName('col-sm-8');
				for (i=0;i<s.length;i++) {
					s[i].style.display="none";
				};
      	s=document.getElementsByClassName('avts-shop-header__logo');
				for (i=0;i<s.length;i++) {
					s[i].style.display="none";
				};
      	s=document.getElementsByClassName('avts-shop-header__checkout');
				for (i=0;i<s.length;i++) {
					s[i].style.display="none";
				};
      	s=document.getElementsByClassName('avts-shop-icon--info');
				for (i=0;i<s.length;i++) {
					s[i].style.display="none";
				};
      	s=document.getElementsByClassName('avts-shop__input-placeholder');
				for (i=0;i<s.length;i++) {
					s[i].style.display="none";
				};
      	s=document.getElementsByClassName('avts-shop-table__col--action-links');
				for (i=0;i<s.length;i++) {
					s[i].style.display="none";
				};      	
      	s=document.getElementsByClassName('avts-global-icon--calendar');
				for (i=0;i<s.length;i++) {
					s[i].style.display="none";
				};
        s=document.getElementsByClassName('input-group-addon');
				for (i=0;i<s.length;i++) {
					s[i].style.display="none";
				};
      	s=document.getElementsByClassName('avts-shop-table__error');
				for (i=0;i<s.length;i++) {
					s[i].style.display="inline";
				};
      	s=document.getElementsByClassName('form-control');
				for (i=0;i<s.length;i++) {
					s[i].style.display="none";
          div = document.createElement('div');
          textElem = document.createTextNode(s[i].value);
          s[i].parentNode.appendChild(textElem);
				};
    }
})(window);