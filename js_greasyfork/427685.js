// ==UserScript==
// @name         Zolo No Login
// @namespace    http://www.zolo.ca/
// @version      0.1
// @description  www.zolo.ca
// @author       Faulty
// @match        https://www.zolo.ca/*
// @icon         https://www.google.com/s2/favicons?domain=zolo.ca
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427685/Zolo%20No%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/427685/Zolo%20No%20Login.meta.js
// ==/UserScript==

const DEBUG = true;


(function() {
    'use strict';
  var tid1;

     hideWorker();
addCss('*{ box-sizing: border-box;} body { margin: 0; font-family: Arial; } .header { text-align: center; padding: 32px;}');
addCss('.row {display: -ms-flexbox; /* IE10 */ display: flex; -ms-flex-wrap: wrap; /* IE10 */ flex-wrap: wrap; padding: 0 4px;}');


addCss('.column {-ms-flex: 25%; /* IE10 */ flex: 25%; max-width: 25%; padding: 0 4px; } .column img {margin-top: 8px; vertical-align: middle; width: 100%;}');

addCss('@media screen and (max-width: 800px) {.column { -ms-flex: 50%; flex: 50%; max-width: 50%; } }');
addCss('@media screen and (max-width: 600px) { .column {-ms-flex: 100%; flex: 100%; max-width: 100%; }}');


// Get Images URL
//
  //Image Count

  var icount;
  var icount_list;
  let regex1 = /See (\d+) Photos/ig;
  var icount_text = $("meta[name='twitter:description']").attr('content');
  console.log(icount_text);

  icount_list = regex1.exec(icount_text)
  if ( icount_list )
  {
    icount = icount_list[1];
    console.log(icount);
  }

  if ( icount )
  {
    var f1 = $( '<section id="faulty1" class="lissting-location"><h1  class="address xs-text-2 sm-text-1 truncate heavy">Faulty Images</h1> <div id="row1" class="row"> <div id="col1" class="column"></div> </row>   </section>' );

   console.log( $('div.main-column').first() );
   console.log( $('div.main-column') );

   f1.insertBefore($('div.main-column').children('*').first());


   let regex2 = /^(.*?-)\d+?(.jpg.*)$/g;
   var iurl = $("meta[name='twitter:image0']").attr('content');
   var iurl_list = regex2.exec(iurl);

   var row1 = $('#row1');
   row1.children('*').last().add('<div>aaaaaaaaaaaaaaaaaa</div>');

   if ( iurl_list )
   {
     var r1 = 0;
     var url_prefix = iurl_list[1];
     var url_suffix = iurl_list[2];
     var i;
     for (i = icount; i > 0; i--) {

$('<div class="smaller" ><img src="'+ iurl_list[1] +  i + iurl_list[2] +'" style="width:100%"></div>').appendTo(row1.children('*').last());
       if ( i % 3 == 0 )
       {
         $('<div  class="column"></div>').appendTo(row1);
       }
     }
  }
}

$("div.smaller").each(function(i, obj){
console.log('smaller');
    console.log(obj);
    var clone;
    var position;
    clone = $(obj).clone();
    $(clone).addClass("clonedItem");
    position = $(obj).position();


    $(obj).hover(function(e){
console.log('smaller moooooooooooooooooooooooooooooooooo');
        $(".clonedItem").animate({
            height: "300px",
            width: "300px"
        }, 200, function(){$(this).remove();});

        $("div.image").css("z-index", 1);
        $(clone).css("top", position.top).css("left", position.left).css("z-index", 1000);
        $(clone).appendTo("#imageContainer").css("position", "absolute").animate({
            height: "650px",
            width: "650px"
        }, 200, function(){
                 $(clone).animate({
                    height: "65px",
                    width: "65px"
                 }, 200, function(){$(clone).remove();});

        }); // end animate callback

    }); // end mouseover

}); // end each




function hideWorker()
{
    mycode();
  tid1 = setTimeout(mycode, 2000);
  function mycode() {
 $('div.cover-reg-large').find("*").hide();
 $('div.cover-reg-large').remove();
 $('div.cover-reg-small').find("*").hide();
 $('div.cover-reg-small').remove();
}
  tid1 = setTimeout(mycode, 2000); // repeat myself
}



function addScript(url){
    var s = document.createElement('script');
    s.src = url;
    s.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(s);
}

//https://photos.zolo.ca/105-rybury-court-sherwood-park-E4241830-10-p.jpg?2021-05-04+11%3A53%3A03

function addCss(cssString) {
    var head = document.getElementsByTagName('head')[0];
    var newCss = document.createElement('style');
    newCss.type = "text/css";
    newCss.innerHTML = cssString;
    head.appendChild(newCss);
}


function log(msg){
  if(DEBUG){
    unsafeWindow.console && unsafeWindow.console.log(msg);
  }
}

function loadDependancies(boostrapFn) {

  addScript('jquery CDN url goes here..');

  var check = function(){
    log("waiting for dependancies to load: "+ typeof unsafeWindow.jQuery);
    if(typeof unsafeWindow.jQuery == 'undefined'){
      window.setTimeout(check, 500);
    }    else {
      jQuery = $ = unsafeWindow.jQuery;
      boostrapFn();
    }
  }
  check();
}
 })();
