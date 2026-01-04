// ==UserScript==
// @name         Stream IMDB
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the Streaming world! This script will add few buttons on IMDB page from where on you can stream the movie if it is in the database.
// @author       4L00
// @match        https://www.imdb.com/title/*
// @match        https://m.imdb.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400140/Stream%20IMDB.user.js
// @updateURL https://update.greasyfork.org/scripts/400140/Stream%20IMDB.meta.js
// ==/UserScript==
	function insertBefore(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode);
}
(function() {

    var loc = window.location.href;
    var lst = loc.split("/");
    var tt = lst[4];
    var sa = document.getElementsByTagName("title")[0].innerText;
    console.log(sa);

    var btn1 = document.createElement("BUTTON");
    btn1.id ='vidsrcme';
    btn1.innerHTML = "▶️ Stream Online #1";
    btn1.style.margin = '0px 20px 20px';
    btn1.classList.add('bt');
    btn1.classList.add('large');
    btn1.classList.add('primary');

    var btn2 = document.createElement("BUTTON");
    btn2.id ='gdriveplayer';
    btn2.innerHTML = "▶️ Stream Online #2";
    btn2.style.margin = '0px 0px 20px';
    btn2.classList.add('bt');
    btn2.classList.add('large');
    btn2.classList.add('primary');

    var btn3 = document.createElement("BUTTON");
    btn3.id ='yotube';
    btn3.innerHTML = "▶️ Trailer on YouTube";
    btn3.style.margin = '0px 20px 20px';
    btn3.classList.add('bt');
    btn3.classList.add('secondary');

    var x = document.getElementsByClassName('pro_title_link_with_separator')[0];
    insertBefore(btn1, x);

    var y = document.getElementsByClassName('pro_title_link_with_separator')[0];
    insertBefore(btn2, y);

    var z = document.getElementsByClassName('pro_title_link_with_separator')[0];
    insertBefore(btn3, z);


    document.getElementById("vidsrcme").addEventListener("click", function(){
  window.open("https://vidsrc.me/embed/" + tt + "/");
});

   document.getElementById("gdriveplayer").addEventListener("click", function(){
  window.open("https://database.gdriveplayer.us/player.php?imdb=" + tt);
});

   document.getElementById("yotube").addEventListener("click", function(){
  window.open("https://www.youtube.com/results?search_query=" + sa);
});
})();
