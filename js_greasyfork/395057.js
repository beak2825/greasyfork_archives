// ==UserScript==
// @name         KissAnime Date Format Changer
// @namespace    https://greasyfork.org/en/users/236500
// @version      0.1
// @description  Change format of Episode date from MM/DD/YYYY to DD/MM/YYYY
// @author       as280093
// @match        https://kissanime.ru/Anime/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395057/KissAnime%20Date%20Format%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/395057/KissAnime%20Date%20Format%20Changer.meta.js
// ==/UserScript==

(function() {
 $('.listing tr').each(function() {
  var lasttd =  $(this).find('td:last-child').text();
  //console.log(lasttd);

var d = new Date(lasttd),
         month = '' + (d.getMonth() + 1),
         day = '' + d.getDate(),
         year = d.getFullYear();

     if (month.length < 2) month = '0' + month;
     if (day.length < 2) day = '0' + day;

     $(this).find('td:last-child').text( [day, month, year].join('/'));
});

})();