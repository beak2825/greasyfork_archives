// ==UserScript==
// @name       32P Bad Cover
// @namespace  proton_32p_bad_cover
// @version    0.45
// @description  Lets you know if a cover isn't on an allowed host, and opens a whatimg window to auto-upload it.
// @include        http*://*32pag.es/torrents.php*
// @include        http*://*32pag.es/torrents.php?id=*
// @include        http*://*32pag.es/torrents.php?action=editgroup&groupid=*
// @include        http*://whatimg.com/*
// @update         August 12 2015
// @author         techietrash, adapted for 32P by Proton
// @copyright      (CC BY-NC 3.0) 2013, Creative Commons Attribution-NonCommercial 3.0 Unported
// @downloadURL https://update.greasyfork.org/scripts/12180/32P%20Bad%20Cover.user.js
// @updateURL https://update.greasyfork.org/scripts/12180/32P%20Bad%20Cover.meta.js
// ==/UserScript==

var run_on_torrent_list_pages = true;
var script_delay = 2000;
var goodhosts = [ //If you want more hosts to be "good", add them to this list as a RE matching their domain
    /32pag\.es/,
    /whatimg\.com/, 
    /imgur\.com/,
//  Hosting services that aren't approved yet below
    /photobucket\.com/,
    /postimg\.org/,
    /ultraimg\.com/,
    /dropbox\.com/
];


function select_url_tab() {
    console.log('selecting tab…');
    document.getElementById('countrytabs').children[1].children[0].click();
    console.log('calling fill_url');
    window.setTimeout(fill_url, script_delay);
}
function fill_url() {
    console.log('…filling url…');
    document.getElementsByName('userfile[]')[0].value = window.location.hash.substr(1);
    
    console.log('calling submit_form');
    window.setTimeout(submit_form, 500);
}
function submit_form() {
    console.log('…submitting…');
    document.getElementById('upload_form').submit();
}

if (window.location.host.match(/whatimg\.com/) && window.location.hash != "") {
// var url = window.location.hash;
    if (document.getElementById('countrytabs') != null) {
        console.log('calling select_url_tab');
        window.setTimeout(select_url_tab, script_delay);

        // document.getElementById('countrytabs').children[1].children[0].click();
        // document.getElementsByName('userfile[]')[0].value = url;
        // document.getElementsByName('userfile[]')[0].value = window.location.hash.substr(1);
        // document.getElementById('upload_form').submit();
    }
} else if (window.location.search.match(/^\?id/)) {
    //Torrent description page
    var cover = document.getElementsByTagName("img")[0].src;
    var decoded = decodeURIComponent(cover); // decode image URI
    var imgurl = decoded.replace(/^(https\:\/\/32pag\.es\/image\.php\?c=1&i=)/gi, ""); // remove image proxy
    var good = false;
    for (var i=0; i<goodhosts.length; i++) {
        if (imgurl.match(goodhosts[i])) {
            good = true;
            i = goodhosts.length;
        }
    }

    //
    
    
    if (!good) {
        var coverElem = document.getElementsByTagName("img")[0];
        coverElem.style.border = ".3em outset red";
        
        var link = document.createElement("a");
        link.innerHTML = "WhatIMG & Edit it";
        link.target = "_new"; //target feels so bad :(
        link.href=  "https://whatimg.com/#"+imgurl;
        link.addEventListener('click', function() {
           // alert(imgurl);
           var tid = /id=([^&]+)/.exec(window.location.href)[1];
           window.location.href = window.location.protocol + '//' + window.location.host + '/torrents.php?action=editgroup&groupid=' + tid + "#whatimg";
        }, false);
        //Put it in
        coverElem.parentNode.parentNode.insertBefore(link, coverElem.parentNode);

    }
} else if (window.location.hash == "#whatimg") { //Torrent edit page
    var inputs = document.getElementsByTagName('input');
    
    for(var i = 0; i < inputs.length; i++ ) {
        if(inputs[i].getAttribute('name') == 'summary') {
            inputs[i].value = 'Image host changed to WhatIMG';
        } else if (inputs[i].getAttribute('name') == 'image') {
            inputs[i].value = '';
        }
    }    
} else if (run_on_torrent_list_pages === true && window.location.pathname.match(/torrents\.php/) && !window.location.search.match(/action/)) {
    // adds borders to small images on torrent list
    var bad_hosts_found = false;
    var images = document.querySelectorAll(".group_image img");
    Array.prototype.forEach.call(images, function(elem, index){
      var cover = elem.src;
      var decoded = decodeURIComponent(cover); // decode image URI
      var imgurl = decoded.replace(/^(https\:\/\/32pag\.es\/image\.php\?c=1&i=)/gi, ""); // remove image proxy
      var good = false;
      for (var i=0; i<goodhosts.length; i++) {
          if (imgurl.match(goodhosts[i])) {
              good = true;
              i = goodhosts.length;
          }
      } 
      if (!good) {
        bad_hosts_found = true;
        var name = "", parent;
        if (elem.parentNode.parentNode.parentNode.className.match(/group/)){
            name = elem.parentNode.nextSibling.nextSibling.children[0].text+ " : ";
            // elem.parentNode.parentNode.parentNode.style = "border-left: .6em outset red;";
        } else if (elem.parentNode.parentNode.parentNode.className.match(/torrent/)){
            name = elem.parentNode.nextSibling.nextSibling.children[1].text + " : ";
            // elem.parentNode.parentNode.parentNode.style = "border-left: .6em outset red;";
        }
        console.log("Disallowed Image Host!\n " + name + imgurl);
        elem.style.border = ".3em outset red";
      }
    });
    if (bad_hosts_found === false) {
        console.log("All images are on allowed hosts!")
    }
}
