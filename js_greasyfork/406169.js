// ==UserScript==
// @author         lubitel1997
// @name           AddFrameToWikimapia
// @version        1.0.0
// @date           2020-06-27
// @description    Встраивание iframe сайта для облегчения поиска информации о домах
// @include        http://wikimapia.org/*
// @include        http://*wikimapia.org/*
// @include        http://wikimapia.org:81/*
// @include        http://*wikimapia.org:81/*
// @namespace      WikimapiaScriptsAdd
// @downloadURL https://update.greasyfork.org/scripts/406169/AddFrameToWikimapia.user.js
// @updateURL https://update.greasyfork.org/scripts/406169/AddFrameToWikimapia.meta.js
// ==/UserScript==
setInterval(function() {
  var str = document.getElementsByClassName('edit-form-description')[0].innerHTML;
if(str.indexOf('prawdom.ru') == -1) {
    var query = document.getElementById('street_name').value + ', ' + document.getElementById('building_number').value;
     query.replace(' ', '%20');
     var makediv = document.getElementsByClassName('edit-form-description')[0];
     makediv.innerHTML =makediv.innerHTML + '<iframe src="http://prawdom.ru/p_main.php?d=searh.php&q='+query+'" width= "570px" height= "300px"></iframe>';
     console.log(makediv.innerHTML); }
}, 1000);
