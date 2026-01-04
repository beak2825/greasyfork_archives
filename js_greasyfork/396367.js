// ==UserScript==
// @name Inoreader Non-YT Feeds
// @name:en Inoreader Non-YT Feed
// @namespace Violentmonkey Scripts
// @match https://www.inoreader.com/*
// @grant none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @description Make YT Playlists with Inoreader
// @version 1.0
// @downloadURL https://update.greasyfork.org/scripts/396367/Inoreader%20Non-YT%20Feeds.user.js
// @updateURL https://update.greasyfork.org/scripts/396367/Inoreader%20Non-YT%20Feeds.meta.js
// ==/UserScript==

jQuery.noConflict();

jQuery( document ).ready(function() {
  $('.block_article_ad').css('opacity','0');
        $('#sinner_container').css('opacity','0');

  //console.log('asdfasdfasdfsdfdafdf');
    jQuery('#subscriptions_buttons').append(' <a id="new_pl" href="#" style="padding-left:14px">New PL (Enable CORS)</a>');
    jQuery('#subscriptions_buttons').append(' | <input id="pl_id" name="pl_id" type="text" value="">');
    jQuery('#subscriptions_buttons').append(' | <a id="yt_link" href="#">Add Videos</a>');
    jQuery('#subscriptions_buttons').append(' | <a id="scrape_link" href="#">Start Scrape</a>');
    jQuery('#subscriptions_buttons').append(' | <a id="stop_link" href="#">Stop</a>');
  jQuery('#subscriptions_buttons').css('height','74px');
  
  jQuery( '#scrape_link' ).click(function() {
    do_read();
    i=0;
    var intervalID = window.setInterval(myCallback, 3000);

    function myCallback() {
      i++;
      console.log('clicked '+i+' times');
      $(document).trigger($.Event("keydown", {keyCode: 74, which: 74}));
    }
    
    jQuery( '#stop_link' ).click(function() {
      clearInterval(intervalID);
    }); 
  });  
  
   
  
  jQuery("#new_pl").click(function(){
        pl_title = $('#sb_rp_heading').text();
    //alert(link_array);
        $.get( "https://djpanaflex.com/custom/yt/playlist.php?t="+pl_title, function( data ) {
          //$( ".result" ).html( data );
          //console.log( data );
          $( "#pl_id" ).val( data );
        });
  });
  
  //var $cards = $('#gameboard .card');
 
  
  //EXPAND THE FIRST ARTICLE
//$('.article_header_text:first a').trigger('mouseup');
  //$('.ar_showed').find('iframe').attr('src');

  jQuery("#yt_link").click(function(){
    //alert(link_array);
    my_playlist = $( "#pl_id" ).val();
    //var time = 3000;
    
    jQuery(link_array).each(function(index) {        
        var that = this;
        var t = setTimeout(function() { 
            
          $.get( "https://djpanaflex.com/custom/yt/insert.php?v="+that+"&p="+my_playlist, function( data ) {
          //$( ".result" ).html( data );
          //console.log( data );
        });
          
          
        }, 3000 * index);        
    });
  });

  
  /*
  
  jQuery("#yt_link").click(function(){
    //alert(link_array);
    my_playlist = $( "#pl_id" ).val();
    var time = 3000;
    
    jQuery(link_array).each(function(){
      vid_id = this
      //console.log(vid_id);
      setTimeout( function(){
        console.log(vid_id);
        $.get( "https://djpanaflex.com/custom/yt/dummy.php?v="+vid_id+"&v="+my_playlist, function( data ) {
          //$( ".result" ).html( data );
          console.log( data );
        });
        }, time,vid_id);
      time += 3000;
    });
  });
  */
});

function do_read(){
var targetNodes         = jQuery("#reader_pane");
var MutationObserver    = window.MutationObserver || window.WebKitMutationObserver;
var myObserver          = new MutationObserver (mutationHandler);
//var obsConfig           = { childList: true, characterData: true, attributes: true, subtree: true };
var obsConfig           = { childList: true, characterData: false, attributes: false, subtree: true };

//--- Add a target node to the observer. Can only add one node at a time.
targetNodes.each ( function () {
    myObserver.observe (this, obsConfig);
} );
}

var row_count = 0;
var link_array = [];
var site_array = ["360musichq.com",
                  "162.243.87.180",
                  "afrikanewmusic.blogspot.com",
                  "alpha-zgoory.blogspot.com",
                  "breishare.blogspot.com",
                  "caribbean-news.tv",
                  "caribbeanworldcharts.com",
                  "carazik.com",
                  "clip-mizik.com",
                  "controlurbano.net",
                  "elcorillord.com",
                  "elgobiernomusical.com",
                  "flowhot.bz",
                  "flowcosta.blogspot.com",
                  "globalzoukgalaxy.com",
                  "groovmotion.com",
                  "hit-lokal.com",
                  "hayltoncenah.blogspot.com",
                  "hypelifemagazine.com",
                  "jbhousemusic.blogspot.com",
                  "kalottlyrikal.net",
                  "lakallejerafm.com",
                  "lantillais.net",
                  "latindancemusic.net",
                  "loadedbaze.com",
                  "lokalvideoz.com",
                  "madinmusik.fr",
                  "malianteokings.com",
                  "masilia2007.fr",
                  "musicaboa.net",
                  "musicadope.net",
                  "musicadrena.blogspot.com",
                  "musicafresca.com",
                  "musiclife507.com",
                  "mysquaw.fr",
                  "naijaextra.com",
                  "playzoukantilles.com",
                  "promo809.com",
                  "rami-projet-com.over-blog.com",
                  "ratrillando.com",
                  "saborurbano.me",
                  "somuzay.squarespace.com",
                  "southindiescrew.com",
                  "streetdiamond.fr",
                  "sxmmusic.com",
                  "traphouselatino.net",
                  "tuaescolha.blogspot.com",
                  "warritatafo.com",
                  "web.olagist.com",
                  "webadubradio.fr",
                  "westintrap.fr",
                  "www.974reprezente.fr",
                  "www.angomais.net",
                  "www.bizouk.com",
                  "www.calemba2-muzik.com",
                  "www.cbmftv.com",
                  "www.curteboamusica.info",
                  "www.dancehallreggaeworld.com",
                  "www.dancehallusa.com",
                  "www.dcleakers.com",
                  "www.downayaad.com",
                  "www.ditoxproducoes.com",
                  "www.dream-sound.com",
                  "www.dropuptv.com",
                  "www.elbiberonmusic.com",
                  "www.flowitaliano.com",
                  "www.franceguyane.fr",
                  "www.hitxgh.com",
                  "www.iamspoonja.com",
                  "www.kiwol.com",
                  "www.lapotenciamusical.com",
                  "www.losdurosdelgenero.com",
                  "www.maiskizomba.com",
                  "www.matimbanews.com",
                  "www.maismusica.net",
                  "www.mimizik.com",
                  "www.musicafresca.com",
                  "www.naijavibes.com",
                  "www.ndwompa.com",
                  "www.newsmuzik.com",
                  "www.niggazwithenjaillement.com",
                  "www.panamaflowmusic.com",
                  "www.pullitup.fr",
                  "www.radiokwi.net",
                  "www.sakafetmatinik.fr",
                  "www.simonlirico.com",
                  "www.songo-9dades.net",
                  "www.swaggarightentertainment.com",
                  "www.sweet-vybz.com",
                  "www.undergroundlokal.com",
                  "www.urbanconnexion.net",
                  "www.vicente-news.com",
                  "www.waldedition.net",
                  "urbanislandz.com",
                  "www.lagosloaded.co",
                  "yardhype.com",
                  "zouklist.com"];

function mutationHandler (mutationRecords) {
  
        $('.block_article_ad').css('opacity','0');

  
    console.info ("mutationHandler:");
//console.log($('.ar_showed').find('iframe').attr('src'));
    mutationRecords.forEach ( function (mutation) {
      
      
      if (mutation.target.className == 'article_full_contents'){
              //console.log (mutation.target.className);
              //console.log (mutation.target.attributes.length);
             //console.log (mutation.attributeName);
      
      article_url = $('.ar_showed').find('.article_title_link').attr('href');
      article_title = $('.ar_showed').find('.article_title_link').text().replace(/(\r\n\t|\n|\r\t)/gm,"");
      if(article_url.includes("www.swaggarightentertainment.com")){
        article_url = $('.ar_showed').find('.underlink:first').attr('href');
      }
      encoded_url = encodeURIComponent(article_url);
      
      //console.log(article_url);
      /*
      $.get( "https://djpanaflex.com/custom/ytscrape/scrape_iframe.php?url="+encoded_url, function( data ) {
          //$( ".result" ).html( data );
          console.log( data );
          add_to_array(data);
        });
      
      function add_to_array(vid_id){
      var found = $.inArray(vid_id, link_array);
            //console.log(found);
            if (found >= 0) {
                // Element was found, remove it.
                //filters.splice(found, 1);
            } else {
                // Element was not found, add it.
                link_array.push(new_link);
            }
    }
        */
      //console.log($('.ar_showed').find('iframe').length);

        function add_to_array(vid_id,link_array){
      var found = $.inArray(vid_id, link_array);
            //console.log(found);
            if (found >= 0) {
                // Element was found.
                //link_array.sort(function(x,y){ return x == vid_id ? -1 : y == vid_id ? 1 : 0; });
                
            } else {
                // Element was not found, add it.
                link_array.push(vid_id);
              
            }
    }
        
        
      //site_array = ["warritatafo.com","www.lagosloaded.co","www.ndwompa.com"];
      
      if ($('.ar_showed').find('iframe').length){
          
        $('.ar_showed').find('iframe').each(function(){
          if ($(this).attr('src').includes('youtube')){
            //console.log($(this).attr('src').split('/')[4].split('?')[0]);
            new_link = $(this).attr('src').split('/')[4].split('?')[0];


          var found = $.inArray(new_link, link_array);
          //console.log(found);
          if (found >= 0) {
              // Element was found.
                //link_array.sort(function(x,y){ return x == new_link ? -1 : y == new_link ? 1 : 0; });
          } else {
              // Element was not found, add it.
              link_array.push(new_link);
          }
        }
        });



          
    } else{
      //console.log(site_array);
        link_addr = $('.ar_showed .article_title_link').attr('href');
        //link_text = $('.ar_showed .article_title_link').text().toUpperCase();
        link_text = $('.ar_showed .article_full_contents').text().toUpperCase();
      //console.log(link_text);
        var hostname = (new URL(link_addr)).hostname;
          console.log(hostname);
      //if (link_text.includes('VIDEO')){
        if (site_array.indexOf(hostname) > -1 || hostname.includes('skyrock')) {
          console.log('bingo');
          
          $.get( "https://djpanaflex.com/custom/ytscrape/scrape_iframe.php?url="+encoded_url, function( data ) {
          //$( ".result" ).html( data );
          console.log( data );
          //add_to_array(data,link_array);
          var found = $.inArray(data, link_array);
          //console.log(found);
          if (found >= 0) {
              // Element was found.
                //link_array.sort(function(x,y){ return x == data ? -1 : y == data ? 1 : 0; });
          } else {
              // Element was not found, add it.
              link_array.push(data);
            console.log(link_array);
          }
        });
          
        } else if (hostname == "www.youtube.com") {
          console.log('yt url');
          
          $.get( "https://djpanaflex.com/custom/yt/search.php?q="+article_title, function( data ) {
          //$( ".result" ).html( data );
          
            console.log( data );
            found_id = data.replace(/(\r\n\t|\n|\r\t)/gm,"");
          //add_to_array(data,link_array);
          var found = $.inArray(found_id, link_array);
          //console.log(found);
          if (found >= 0) {
              // Element was found.
                //link_array.sort(function(x,y){ return x == data ? -1 : y == data ? 1 : 0; });
          } else {
              // Element was not found, add it.
              link_array.push(found_id);
            console.log(link_array);
          }
        });
          
          
          
        } else {
            //Not in the array
        
    	var snippet = $('.article_content').text();

	if (snippet.includes('https://www.youtube.com/watch?v=')){
		console.log('text link');

		geturl = new RegExp(
		"(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))","g");

		yt_link_array = snippet.match(geturl);
      yt_matches = yt_link_array.filter(s => s.includes('youtube'));
      //console.log(yt_matches);
      $.each(yt_matches, function(){
        //console.log(this.split('?v=')[1]);
        vid_id_string = this.split('?v=')[1];
        var found = $.inArray(vid_id_string, link_array);
          //console.log(found);
          if (found >= 0) {
              // Element was found.
                //link_array.sort(function(x,y){ return x == vid_id_string ? -1 : y == vid_id_string ? 1 : 0; });
          } else {
              // Element was not found, add it.
              link_array.push(vid_id_string);
            console.log(link_array);
          }
        
        
        
      });
    }      
          
          
        }
      //}
      }
    }
    }
      );
        console.log(link_array);

}

/*
 * 
 * $.get( "ajax/test.html", function( data ) {
  $( ".result" ).html( data );
  alert( "Load was performed." );
});

*/