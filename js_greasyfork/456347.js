// ==UserScript==
// @name         Dramaday.net - better user experience
// @namespace    http://tampermonkey.net/
// @version      2024.2.5
// @description  Mark favorite and remove bad movie/serie, show latest Episode number, click ot title to search details on MyDramaList.com
// @author       Radim
// @match        https://dramaday.net/*
// @match        https://dramaday.me/*
// @match        https://dramaday.net/page/*
// @match        https://dramaday.me/page/*
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456347/Dramadaynet%20-%20better%20user%20experience.user.js
// @updateURL https://update.greasyfork.org/scripts/456347/Dramadaynet%20-%20better%20user%20experience.meta.js
// ==/UserScript==
//this.$ = this.jQuery = jQuery.noConflict(true);

const filter = {  /* https://www.base64encode.org/ or https://base64.alanreed.org/ */
   "bad": [
      "TG92ZSBpcyBmb3IgU3Vja2Vycw==",
      "U3VtbWVyIFN0cmlrZQ==",
      "VGhlIFdpdGNoIFN0b3JlIFJlb3BlbnM="
   ],
   "fav": [
      "Reborn Rich"
   ],
   "seen": [
      /* { title_url: "https://dramaday.me/tale-of-the-nine-tailed-1938/", last: "6" } */
   ]
};

const addMy_CSS = "#h1link { text-docoration: none !important; color: blue !important; } #h1link:hover { text-decoration: underline !important; text-decoration-color: red !important; -webkit-text-decoration-color: red !important; } /* preciarkni text */ .strike{position:relative; display:inline-block; opacity:0.33;} .strike::before{content:''; border-bottom:5px solid rgba(204,48,48,0.6); width:100%; position:absolute; right:0; top:45%;}"
                + "#box_version { position:fixed; right:110px; top:0px; width:148px; color:#f7f7f7; background:#0080ff; text-align:center; padding:4px; font-size:0.8rem; border-radius: 0px 0px 7px 7px; text-shadow: 1px 1px 3px #000; box-shadow: rgba(99, 99, 99, 0.7) 0px 2px 8px 0px; z-index:9998; }";

//var addMy_CSS_Src = GM_getResourceText("addMy_CSS");
//GM_addStyle(addMy_CSS_Src);
GM_addStyle(addMy_CSS);

/* https://violentmonkey.github.io/api/gm/ */

let fi = GM_getValue("filter", JSON.stringify(filter));
let f = JSON.parse(fi);
//alert(  fi );
//alert( f.bad + '\n\n' + f.bad.length );
//alert( f.fav + '\n\n' + f.fav.length );
//alert( f.seen + '\n\n' + f.seen.length );

function addCirleBtn(el, url)  {
  el.css("position","relative");
  var add = "<span class='add_title' url='"+url+"' style='position:absolute; left:-22px; top:2px; background: #40C940; border-radius: 50%; color: #ffffff; display: inline-block; font-weight: bold;  line-height: 20px; margin-right: 5px; text-align: center; width: 20px; cursor:pointer;'>+</span>";
  el.append(add);

  var rem = "<span class='rem_title' style='position:absolute; right:-25px; top:2px; background: #C64050; border-radius: 50%; color: #ffffff; display: inline-block; font-weight: bold;  line-height: 20px; margin-left: 5px; text-align: center; width: 20px; cursor:pointer;'>-</span>";
  el.append(rem);
}

(function() {
  'use strict';

  jQuery(document).ready(function($) {
    var s = "Fav: <span id='fav_n' style='color: #40C940;'>"+f.fav.length+"</span> <span style='display: inline-block; height: 10px; width: 46px;'></span> Bad: <span id='bad_n' style='color: #C64050; display: inline-block; width: 46px;'>"+f.bad.length+"</span> Seen: <span id='bad_n' style='color: #ffff00;'>"+(f.seen?f.seen.length:"-")+"</span><br><input <input type='text' style='width: 250px;' id='ep_title' value=''><br><input id='fav_btn' style='background-color:#407940;' type='button' value='Add to fav'> <input id='bad_btn' style='background-color:#C64050;' type='button' value='Remove'> <input id='rst_btn' style='background-color:#999999;' type='button' value='Reset'> <input id='rst_all_btn' style='background-color:#ffff00;' type='button' value='RST'>";
    $("body").append('<div style="color: #f7f7f7; background: linear-gradient(#8E588E, #533658, #8E588E); border-radius: 7px; font-weight: bold; display: block; position: fixed; top: 140px; left: 10px; width: 300px; padding: 7px;">'+s+'</div>')

    let script_version = "0.0.1";
    // https://wiki.greasespot.net/GM.info
    // https://www.tampermonkey.net/documentation.php?locale=en#api:GM_info
    script_version = GM_info.script.version;
    $("body").append('<div id="box_version">Script ver.<a href="chrome-extension://mfdhdgbonjidekjkjmjaneanmdmpmidf/options.html#nav=dashboard" target="_blank"><strong>'+script_version+'</strong></a></div>');

    $('#fav_btn').click(function(e) {
      var t = $("#ep_title").val().trim();
      if( t.length > 1 ) {
        if( !f.fav.includes( t ) ) {
           $('header[class="article__header"] h3[class="article__title entry-title"] a:contains("'+t+'")').css( "border-bottom", "4px solid #33ff33" );
           f.fav.push( t );
           //alert( f.fav + '\n\n' + f.fav.length );
           GM_setValue("filter", JSON.stringify( f ));
           $('#fav_n').text(f.fav.length);
        }
      }
    });

    $('#bad_btn').click(function(e) {
      var t = $("#ep_title").val().trim();
      if( t.length > 1 ) {
        if( !f.bad.includes( btoa(t) ) ) {
           $('header[class="article__header"] h3[class="article__title entry-title"] a:contains("'+t+'")').css( "border-bottom", "2px solid red" );
           f.bad.push( btoa(t) );
           //alert( f.bad + '\n\n' + f.bad.length );
           GM_setValue("filter", JSON.stringify( f ));
           $('#bad_n').text(f.bad.length);
        }
      }
    });

    $('#rst_btn').click(function(e) {
      var t = $("#ep_title").val().trim();
      if( t.length > 1 ) {
        $('header[class="article__header"] h3[class="article__title entry-title"] a:contains("'+t+'")').css( "border-bottom", "none" );
        if( f.bad.includes( btoa(t) ) ) {
           f.bad.splice(f.bad.indexOf(btoa(t)), 1);
           GM_setValue("filter", JSON.stringify( f ));
           $('#bad_n').text(f.bad.length);
        } else if( f.fav.includes( t ) ) {
           f.fav.splice(f.fav.indexOf(t), 1);
           GM_setValue("filter", JSON.stringify( f ));
           $('#fav_n').text(f.fav.length);
        }
      }
    });

    $('#rst_all_btn').click(function(e) {
      GM_deleteValue("filter");
/*
      fi = GM_getValue("filter", JSON.stringify(filter));
      f = JSON.parse(fi);

      $('#fav_n').text(f.fav.length);
      $('#bad_n').text(f.bad.length);
*/
      window.location.reload();
    });

    var h1 = $("h1.entry-title").text().trim();
    //alert( h1 );
    $("h1.entry-title").html( '<a href="https://mydramalist.com/search?q='+ h1.replaceAll(' ', '+') +'" target="_blank">'+ h1 +'</a>' );
    $("h1.entry-title").attr('id', 'h1link');

    /* get last Episode No. */
    var lastROW = $("table[id^='supsystic-table-']").find("tr").last();
    $(lastROW).attr('id', 'latest_episode');
    var allTD = $(lastROW).find("td");
    var ep = $(allTD).first().text().trim();
    //alert( ep );
    var t = $(allTD).eq(1).text();
    var hasWEB_DL = t.indexOf("1080p WEB-DL");
    if( hasWEB_DL == -1)
      hasWEB_DL = t.indexOf("1080p Friday");
    //alert( hasWEB_DL );
    var p = $("div.vc_col-sm-9 div.wpb_wrapper p");
    var s = $(p).html();

    /* Air time re-counting: -7 hours for Bratislava */
    var kst = " KST";
    var pos1 = false;
    if (typeof s === 'string' || s instanceof String)
      pos1 = s.indexOf(kst);
    if( pos1 !== false ) {
      //alert( s.charAt(pos1 - 3) ); //char ":"
      var minutes = s.substring(pos1-3, pos1);

      var a2 = s.charAt(pos1 - 4);
      var a1 = s.charAt(pos1 - 5);
      if(a1>=1 && a1<=9) {
        a2 = parseInt(a1)*10 + parseInt(a2);
      }

      // HERE EDIT YOUR TIME ZONE DIFF
      var tmDiff = -7; //Korea vs. Slovakia in hours

      var ho = a2 + tmDiff;
      var co = "YellowGreen";
      if(ho < 0) {
        ho += 24;
        co = "Coral";
      }

      var myLocalTime = "<span style='background-color:"+co+"; padding-left:3px; padding-right:4px; color:white; font-weight:bold;'>"+ho+minutes+"</span> ";
      //alert(myLocalTime);
      pos1 = pos1 - 5;
      s = s.substring(0, pos1) + myLocalTime + s.substring(pos1);
    }

    $(p).html( s + '<br>Go to latest episode: <a href="#latest_episode">EP'+ ep +'</a> ( <strong>'+(hasWEB_DL !== -1?"WEB DL / HQ":"no yet")+'</strong> )' );

    /* sidebar, vpravo */
    var side = $("div[class='textwidget'] p a");
    //alert( side.length );

    /* mark fav, hide bad/common */
    var title = $('header[class="article__header"] h3[class="article__title entry-title"] a');
    //alert( title.text() );
    var i = 1;
    $(title).each(function( index ) {
      var s = $( this ).text();

      /* special Unicode chars title cleanup */
      var s1 = s.replace(/’/ig, "'");
      s1 = s1.replace(/–/ig, "-");
      if(s !== s1) $( this ).text( s1 );
      s = s1;
/*
      var p = s.indexOf("Under the Queen");
      if( p != -1 ) {
        alert( s.charCodeAt( "Under the Queen".length ) );
      }
*/
      if( f.bad.includes(btoa(s)) ) {
         $( this ).css( "border-bottom", "2px solid red" );
         $( this ).parents('article').css('opacity','0.1');

         var u = $( this ).attr('href');
         $(side).each(function( index ) {
           if( $( this ).attr('href') == u ) {
             $( this ).addClass( "strike" );
           }
         });

      } else if( f.fav.includes(s) ) {
        $( this ).css( "border-bottom", "4px solid #33ff33" );

        var u = $( this ).attr("href");
        //var parts = u.split('/');
        //u = parts.pop() || parts.pop();  // handle potential trailing slash

        //var url = u + " table[id^='supsystic-table-'] tr";
        var url = u + " table tr";
        //alert( url );
        var par = $( this ).parents('header.article__header');
        //alert(par.length);
        $(par).css("position","relative");
        var ep_result = 'ep_result'+i;
        /* https://rgbacolorpicker.com/hex-to-rgba */
        $(par).append('<div id="'+ep_result+'" style="position:absolute; right:0px; top:0px; background-color: rgba(64, 201, 64, 0.6); color: #ffffff; font-weight: bold; height: 80px; line-height: 80px; text-align: center; width: 80px; font-size:18pt; cursor: cell; z-index:9999">--</div>');

        /* load latest episode No. */
        //alert( ep_result );
        $( "#"+ep_result ).load( url, function() {
          //alert( "feed have been loaded" );
          //alert( url + "\n\n" + $( this ).attr("id") + "\n\n" + $( this ).text().length + "\n\n" + $( this ).html() );
          var r = $( this ).find("tr").last();
          //alert( $(r).html() );
          var ep = $(r).find("td").first().text().trim();
          if( ep == "" ) {
            ep = $( this ).find("tr").eq( -2 ).find("td").first().text().trim();
          }
          //alert( ep );
          $( this ).html( ep );

          /* mark: green (if already seen), OR red (if unseen) */
          //alert(url); //...contains more than only URL
          $( this ).attr("url", url.split(' ')[0]);

          var found = false;
          for(var j = 0; j < f.seen.length; j++) {
            if( url.indexOf(f.seen[j].title_url) == 0 ) {
              //alert("found");
              $( this ).attr("title", "Last seen episode: " + f.seen[j].last);
              if(ep == f.seen[j].last)
                found = true;
              break;
            }
          }
          $( this ).css("border",found ? "#40C940 dotted 3px" : "#F54159 solid 4px");
        });

        $( "#"+ep_result ).click(function(e) {
          e.preventDefault();

          var ep  = $(this).text();
          var url = $(this).attr("url");
          //alert(ep + "\n" + url);

          var found = false;
          for(var k = 0; k < f.seen.length; k++) {
            if( url == f.seen[k].title_url ) {

              $( this ).attr("title", "Last seen episode: " + f.seen[k].last);
              f.seen[k].last = ep;
              found = true;
              break;
            }
          }

          if(!found) f.seen.push( { title_url: url, last: "0" } );
          $( this ).css("border",found ? "#40C940 dotted 3px" : "#F54159 solid 4px");
          GM_setValue("filter", JSON.stringify( f ));
        });
      }

      addCirleBtn( $( this ), $( this ).attr("href") );
      i++;
    });

    $('.add_title').click(function(e) {
      e.preventDefault();

      var t = $(this).parent().text().slice(0, -2);
      //alert( t );
      if( !f.fav.includes( t ) ) {
         $('header[class="article__header"] h3[class="article__title entry-title"] a:contains("'+t+'")').css( "border-bottom", "4px solid #33ff33" );
         f.fav.push( t );

         /* insert init value */
         //alert( $(this).attr("url") );
         f.seen.push( { title_url: $(this).attr("url"), last: "0" } );

         GM_setValue("filter", JSON.stringify( f ));
         $('#fav_n').text(f.fav.length);
      }
    });

    $('.rem_title').click(function(e) {
      e.preventDefault();

      var t = $(this).parent().text().slice(0, -2);
      if( !f.bad.includes( btoa(t) ) ) {
         $('header[class="article__header"] h3[class="article__title entry-title"] a:contains("'+t+'")').css( "border-bottom", "2px solid red" );
         f.bad.push( btoa(t) );
         GM_setValue("filter", JSON.stringify( f ));
         $('#bad_n').text(f.bad.length);
      }
    });
  });
})();
