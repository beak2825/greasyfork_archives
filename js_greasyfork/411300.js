// ==UserScript==
// @name         Litecoin_click_bot
// @namespace    ekaraman89@hotmail.com
// @version      1.0.0
// @description  Litecoin_click_bot icin otomatik trafik
// @author       ekaraman ekaraman89@hotmail.com
// @match        https://web.telegram.org/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411300/Litecoin_click_bot.user.js
// @updateURL https://update.greasyfork.org/scripts/411300/Litecoin_click_bot.meta.js
// ==/UserScript==

(function() {
var win;
getLink();

setInterval(function () {
     console.error('setInterval');
 var size = $($('.im_message_text')).size()-1;
 var lastMessage= $($('.im_message_text')[size]).text();

 if(lastMessage.indexOf('You earned')==0)
 {
  if(win!=undefined) win.close();
  getLink();
 }
 else if(lastMessage.indexOf('Sorry')==0)
 {
  if(win!=undefined) win.close();
  return;
 }
 else if(lastMessage.indexOf('You must stay on the site')==0 || lastMessage.indexOf('Please stay')==0 ){}
 else{
  getLink();
 }

}, 2000);

function getLink(){
 var lastMessage= $('.im_message_text :last').html();
 if(lastMessage=='/settings') location.reload();

 var list=[];
 $.each($('.reply_markup_button') , function( key, value ) {
  if(String(value).includes("dogeclick.com"))
  {
   list.push(value);
  }
 });
 var count = list.length;
    if(count>0) var link =$(list[count-1]).prop('href').split('visit%2F')[1];

 navigateToLink(link);

}

function navigateToLink(link){
 if(localStorage.getItem("lastLink") === link) return;
  if(win!=undefined) win.close();
  win =window.open(
   'http://dogeclick.com/visit/'+link,
   '_blank'
 );
 localStorage.setItem("lastLink", link);
}
})();