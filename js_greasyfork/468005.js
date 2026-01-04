// ==UserScript==
// @name         MkvDrama.org - better user experience
// @namespace    http://tampermonkey.net/
// @version      2023.9.2
// @description  Mark favorite and remove bad movie/serie, show latest Episode number, click ot title to search details
// @author       Radim
// @match        https://mkvdrama.org/*
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468005/MkvDramaorg%20-%20better%20user%20experience.user.js
// @updateURL https://update.greasyfork.org/scripts/468005/MkvDramaorg%20-%20better%20user%20experience.meta.js
// ==/UserScript==
/* eslint-disable */

//this.$ = this.jQuery = jQuery.noConflict(true);

/* OR
  https://stackoverflow.com/questions/56532267/using-or-operator-in-xpath-expression

  Convert colors: #hex to RGBA
  https://martech.zone/rgb-hex-converter/
*/

const filter = {  /* https://www.base64encode.org/ or https://base64.alanreed.org/ */
   "bad": [
      "/tale-of-the-nine-tailed-1938/",
      "/dr-romantic-season-3/",
      "/happiness-battle/"
   ],
   "fav": [
      "/beauty-of-resilience/",
      "/wanrus-journey/",
      "/gen-z/",
      "/back-from-the-brink/",
      "/hi-producer/"
   ],
   "seen": [
      /* { title_url: "/beauty-of-resilience/", last: "6" } */
   ]
};

const addMy_CSS = "#h1link { text-docoration: none !important; color: blue !important; } #h1link:hover { text-decoration: underline !important; text-decoration-color: red !important; -webkit-text-decoration-color: red !important; } /* preciarkni text */ .strike{position:relative; display:inline-block; opacity:0.33;} .strike::before{content:''; border-bottom:5px solid rgba(204,48,48,0.6); width:100%; position:absolute; right:0; top:45%;}"
                + "#box_version { position:fixed; right:270px; top:0px; width:148px; color:#f7f7f7; background:#0080ff; text-align:center; padding:4px; font-size:0.8rem; border-radius: 0px 0px 7px 7px; text-shadow: 1px 1px 3px #000; box-shadow: rgba(99, 99, 99, 0.7) 0px 2px 8px 0px; }"
                + ".add_title { background: rgba(64, 201, 64, 0.33); } .add_title:hover { background: rgba(64, 201, 64, 1); } .rem_title { background: rgba(198, 64, 80, 0.33); } .rem_title:hover { background: rgba(198, 64, 80, 1); }";
GM_addStyle(addMy_CSS);

let fi = GM_getValue("filter", JSON.stringify(filter));
let f = JSON.parse(fi);
//alert(  fi );
//alert( f.bad + '\n\n' + f.bad.length );
//alert( f.fav + '\n\n' + f.fav.length );
//alert( f.seen + '\n\n' + f.seen.length );

function addCirleBtn(el, both = true)  {
  el.css("position","relative");
//  var add = "<span class='add_title' style='position:absolute; right: 0px; top:0px; background: #40C940; border-radius: 50%; color: #ffffff; display: inline-block; font-weight: bold; line-height: 16px; margin-left: 0px; text-align: center; width: 16px; cursor:pointer;'>+</span>";
  if(both) {
    var add = "<span class='add_title' style='position:absolute; left: 50%; top:0px; border-radius: 50%; color: #ffffff; display: inline-block; font-weight: bold; line-height: 16px; width: 16px; cursor:pointer; margin-left:-18px;'>+</span>";
    el.append(add);
  }
  var rem = "<span class='rem_title' style='position:absolute; right: 50%; top:0px; border-radius: 50%; color: #ffffff; display: inline-block; font-weight: bold; line-height: 16px; width: 16px; cursor:pointer; margin-right:-18px;'>-</span>";
  el.append(rem);
}

(function() {
  'use strict';

  jQuery(document).ready(function($) {
    var h1 = $("h1.entry-title").text().trim();
    $("h1.entry-title").html( '<a href="https://mydramalist.com/search?q='+ h1.replaceAll(' ', '+') +'" target="_blank">'+ h1 +'</a>' );
    $("h1.entry-title").attr('id', 'h1link');

    let script_version = "0.0.1";
    // https://wiki.greasespot.net/GM.info
    // https://www.tampermonkey.net/documentation.php?locale=en#api:GM_info
    script_version = GM_info.script.version;
    $("body").append('<div id="box_version">Script ver.<a href="chrome-extension://mfdhdgbonjidekjkjmjaneanmdmpmidf/options.html#nav=dashboard" target="_blank"><strong>'+script_version+'</strong></a></div>');

    var dramas = $('div[class="excstf"] article[class="bs"]');
    //alert( dramas.length );
    $(dramas).each(function( index ) {
      var a = $( this ).find("a");
      var url = $( a ).attr("href").split(".org")[1];
      //alert( url );

      var head = $( a ).find("div[class='tt'] b");
      if( f.bad.includes( url ) ) {
        $( this ).css( 'opacity','0.1');
      } else if( f.fav.includes( url ) ) {
        $( head ).css( "background-color", "#ffff00" );
        addCirleBtn( $(head), false );
      } else {
        addCirleBtn( $(head) );
      }
    });

    $('.add_title').click(function(e) {
      e.preventDefault();

      var drama = $(this).parents("article");

      var a = $( drama ).find("a");
      var url = $( a ).attr("href").split(".org")[1];
      //alert( url );

      if( !f.fav.includes( url ) ) {
         var head = $( a ).find("div[class='tt'] b");
         $( head ).css( "background-color", "#ffff00" );

         /* remove '+' and '-' buttons */
         $( head ).find(".add_title").remove();
         $( head ).find(".rem_title").remove();

         f.fav.push( url );
         GM_setValue("filter", JSON.stringify( f ));
      }
    });

    $('.rem_title').click(function(e) {
      e.preventDefault();

      var drama = $(this).parents("article");

      var a = $( drama ).find("a");
      var url = $( a ).attr("href").split(".org")[1];
      //alert( url );

      if( !f.bad.includes( url ) ) {
         $( drama ).css( 'opacity','0.1');

         f.bad.push( url );
         GM_setValue("filter", JSON.stringify( f ));
      }
    });

  });
})();
