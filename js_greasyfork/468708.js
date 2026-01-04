// ==UserScript==
// @name        beehaw lemmy add home-instance name to username 
// @namespace   english
// @description  beehaw lemmy  add home -instance name to username 
// @include     http*://*beehaw.org*
// @version     1.35
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
// @downloadURL https://update.greasyfork.org/scripts/468708/beehaw%20lemmy%20add%20home-instance%20name%20to%20username.user.js
// @updateURL https://update.greasyfork.org/scripts/468708/beehaw%20lemmy%20add%20home-instance%20name%20to%20username.meta.js
// ==/UserScript==
 
 
 
// Main - redirect test 
 
function usernamelabeladd(){
 
 
$( ".text-info" ).each(function() {
 $( this ).addClass( "foo" );
// get username URL and text, then remove username from URL and paste the instance name after username (not if instance is home-instance of kbin.social

var homeinstance = "x";

if( $(this).attr('href') ){
homeinstance = $(this).attr('href') ;    
}else{
return 1;
}

 
//console.log( "@@@");
//console.log(homeinstance );

var homeplace = "no";
if(   homeinstance.search("@")   == -1    ){
homeplace = "yes";
}
if(   $(this).hasClass("commentfrom77")  ){
homeplace = "no";
return 1;
}
 
var homeinstance2 =  homeinstance.replace(     /\/u.*?@/ , '');
 
if(  homeplace == "no"   ){ //show nothing if home-instance kbin 
 
//console.log(homeinstance2 );
$(this).find('span').append( " <i>- " +  homeinstance2  +"</i><!--34-->"); // <---------------------- vers hceck 
$(this).addClass("commentfrom77");
 
}
 
 
 
});
 
 
} //end each username a href
 
 
 
 
 
 
//css color for added text - dark and light modes 
 
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML =   '      .text-info  span i{color:#ffabc3   !important ;}      ' ;
 
document.getElementsByTagName('head')[0].appendChild(style);
 
 
//  #content a.user-inline i{color: #c63434;}body.theme--dark #content a.user-inline i{color: #ffabc3  !important ;} 
 
  
$(window).on('resize', function(){
 usernamelabeladd();
});

window.onload = function(){  
 usernamelabeladd();
}  

window.addEventListener('resize', function(event) {
   usernamelabeladd();
}, true);


$('.btn').click(function(e){
   usernamelabeladd();
window.setTimeout( usernamelabeladd, 1000 ); // 1 seconds
window.setTimeout( usernamelabeladd, 5000 ); // 5 seconds
//end
}, true);



$(window).on('hashchange', function(e){
    // do something...
 usernamelabeladd();
window.setTimeout( usernamelabeladd, 1000 ); // 1 seconds
window.setTimeout( usernamelabeladd, 5000 ); // 5 seconds
}); //end


