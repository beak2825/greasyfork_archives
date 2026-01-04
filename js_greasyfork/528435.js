// ==UserScript==
// @name         FacebookControlPhoto
// @namespace    http://tampermonkey.net/
// @version      0.44
// @description  This script enable you to control viewing photos on facebook.
// @author       Faraj Almnfi
// @match        https://m.facebook.com/*
// @match        https://www.facebook.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @require      http://code.jquery.com/jquery-latest.min.js
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM_listValues
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528435/FacebookControlPhoto.user.js
// @updateURL https://update.greasyfork.org/scripts/528435/FacebookControlPhoto.meta.js
// ==/UserScript==
console.log("start");
var i=0;
$( window ).on( "scroll", function() {
 /// console.log("scrol");
  if (i>5){
    cmd();
  i=0;
 }
 i++;
} );
//setInterval(console.log(GM.getValue("yyy")), 3000);
function cmd() {

  // hiding visble image function

  $('img:visible').filter('img:not([treat=yes])').each(function() {

    //$(this).hide();


var list=GM_listValues();

var index=$(this).parent().parent().parent().parent().parent().index();
    if(index > 8){
        var text=$(this).parent().parent().parent().parent().parent().find('.f2.a').html();
      }else{
        var text=$(this).parent().parent().parent().parent().parent().parent().find('.f2.a').html();

      }



if ($(this).width() > 80)
    {
console.log('index'+index);

//$(this).parent().attr('aria-label', "May be an image of ‎text that says'plc,allen bradely, siemens'");
//$(this).attr('alt', "May be an image of ‎text that says 'plc,siemens,allen bradely'");

      if($.inArray(text,list)== -1){

     // console.log($.inArray(text,list));
$(this).hide();

//$(this).css({
 //       '-webkit-filter': 'blur(5px)',
//        'filter': 'blur(5px)'
 //   });
}else{ console.log(text);
      $(this).attr('treat', 'yes');
     }



    }

});



  //page title saving function

$('.f2.a').filter('span:not([titletreat=yes])').bind('touchstart', function() {

      timeout = setTimeout(function() {

          longtouch = true;

      }, 500);

   }).bind('touchend', function() {

       if (longtouch) {


         // It was a long touch.
         var list=GM_listValues();

  if($.inArray($(this).text(),list)== -1){

  var listnumer=list.length;
   if(confirm('تبي تخزن')==true){


  GM.setValue($(this).text(),listnumer);
}
  // $(this).attr('titletreat', 'yes');
//alert('saved');
    console.log('no');

//$(this).hide();

}else{ console.log('yes');}

       }

       longtouch = false;

       clearTimeout(timeout);

   }).attr('titletreat', 'yes');
 // $( "span:contains('Suggested for you')" ).parent().parent().parent().parent().parent().parent().css({"width": "10px"});
 // $( "span:contains('Follow')" ).parent().parent().parent().parent().parent().parent().css({"width": "10px"});
    ///css({"background-color": "yellow", "z-index": "999"});
}


// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "ready!" );
    cmd() ;
});

GM.setValue('صحيح البخاري ومسلم','0');
//GM.setValue('yhy','1');
console.log(GM_listValues());
//var list=GM_listValues();

//console.log(list[1]);