// ==UserScript==
// @name        beehaw lemmy separate spacing of delete and edit buttons
// @namespace   english
// @description  beehaw lemmy- separate spacing of delete and edit buttons
// @include     http*://*beehaw.org*
// @version     1.4
// @run-at document-end
// @require       https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @license MIT
// @grant       GM_addStyle
// @include     http*://*lemmy.world*
// @include     http*://*vlemmy.net*
// @include     http*://*sh.itjust.works*
// @include     http*://*discuss.tchncs.de*
// @include     http*://*lemmy.fmhy.ml*
// @include     http*://*lemm.ee*
// @include     http*://*lemmy.ml*
// @include     http*://*feddit.de*
// @include     http*://*lemmy.one*
// @include     http*://*lemmynsfw.com*
// @include     http*://*lemmy.c// @include     
// @include     http*://*lemmy.blahaj.zone/a*
// @include     http*://*lemmygrad.ml*
// @include     http*://*lemmy.dbzer0.com*
// @include     http*://*programming.dev*
// @include     http*://*midwest.social*
// @include     http*://*lemmy.sdf.org*
// @include     http*://*aussie.zone*
// @include     http*://*feddit.uk*
// @include     http*://*startrek.website*
// @include     http*://*dormi.zone*
// @include     http*://*infosec.pub*
// @include     http*://*feddit.it*
// @include     http*://*feddit.nl*
// @include     http*://*pawb.social*
// @include     http*://*feddit.dk*
// @include     http*://*slrpnk.net*
// @include     http*://*mander.xyz*
// @include     http*://*lemmy.nz*
// @include     http*://*reddthat.com*
// @include     http*://*feddit.cl*
// @include     http*://*szmer.info*
// @include     http*://*lemmy.zip*
// @include     http*://*lemmy.pt*
// @include     http*://*dataterm.digital*
// @include     http*://*waveform.social*
// @include     http*://*pathofexile-discuss.com*
// @include     http*://*sub.wetshaving.social*
// @include     http*://*yiffit.net*
// @downloadURL https://update.greasyfork.org/scripts/470304/beehaw%20lemmy%20separate%20spacing%20of%20delete%20and%20edit%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/470304/beehaw%20lemmy%20separate%20spacing%20of%20delete%20and%20edit%20buttons.meta.js
// ==/UserScript==
 
 
 
// Main - redirect test 

//<button class="btn btn-link btn-animate text-muted" data-tippy-content="Delete" aria-label="Delete">


//var elements = $("body").find("[aria-controls='name1']");



 
function movedeletebutton(){
 
 var elements = $("body").find("[aria-label='Delete']");
 

elements.each(function() {
 $( this ).addClass( "movebuttonright" );
// get username URL and text, then remove username from URL and paste the instance name after username (not if instance is home-instance of kbin.social

//console.log( "@@@");
//console.log(homeinstance );

});
}  //end each username a href
 
 
 
 
 
 
//css color for added text - dark and light modes 
 
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML =   '      .movebuttonright{  margin-left: 3em;   }      ' ;
 
document.getElementsByTagName('head')[0].appendChild(style);
 
 
//  #content a.user-inline i{color: #c63434;}body.theme--dark #content a.user-inline i{color: #ffabc3  !important ;} 
 
  
$(window).on('resize', function(){
 movedeletebutton();
});

window.onload = function(){  
 movedeletebutton();
}  

window.addEventListener('resize', function(event) {
   movedeletebutton();
}, true);


$('.btn').click(function(e){
   movedeletebutton();
window.setTimeout( movedeletebutton, 1000 ); // 1 seconds
window.setTimeout( movedeletebutton, 5000 ); // 5 seconds
//end
}, true);



$(window).on('hashchange', function(e){
    // do something...
 movedeletebutton();
window.setTimeout( movedeletebutton, 1000 ); // 1 seconds
window.setTimeout( movedeletebutton, 5000 ); // 5 seconds
}); //end


