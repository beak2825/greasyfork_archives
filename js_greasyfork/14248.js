// ==UserScript==
// @name         sergey 5
// @version      1
// @author saqfish
// @include https://s3.amazonaws.com/mturk_bulk/*
// @grant        GM_log
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @namespace https://greasyfork.org/users/13769
// @description Sergey - $1 ones I forget the name...
// @downloadURL https://update.greasyfork.org/scripts/14248/sergey%205.user.js
// @updateURL https://update.greasyfork.org/scripts/14248/sergey%205.meta.js
// ==/UserScript==

$('table[border="1"]').hide();
$('table[border="1"]').eq(3).show();
$('table[border="1"]').eq(3).children().find('tr').each(function(p){
  var trr = $(this);
  var tdd  = document.createElement('td'); 
  tdd.onclick = function() {$(this).parent().children().eq(3).children().val("This is not trashy. It is genuine music");};
  tdd.innerHTML = "Not trasy. Genuine Music";
  trr.append(tdd);
     var tdd2  = document.createElement('td'); 
  tdd2.onclick = function() {$(this).parent().children().eq(3).children().val("This is not trashy. It is genuine gameplay");};
  tdd2.innerHTML = "Not trashy. Genuine game";
  trr.append(tdd2);
     var tdd3  = document.createElement('td'); 
  tdd3.onclick = function() {$(this).parent().children().eq(3).children().val("This is not trashy. It is a guenuine show");};
  tdd3.innerHTML = "Not trashy. Genuine show";
  trr.append(tdd3);
    
});
$('input[value="Not Trashy"]').prop('checked',true);
