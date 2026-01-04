// ==UserScript==
// @name        exploding heads restyle add origin-sub names 
// @namespace   english
// @description  exploding heads restyle add origin-sub names  priv - testing 
// @version     1.2
// @run-at document-end
// @require       https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @license MIT
// @grant       GM_addStyle
// @include     http*://*exploding-heads.com*
// @downloadURL https://update.greasyfork.org/scripts/469112/exploding%20heads%20restyle%20add%20origin-sub%20names.user.js
// @updateURL https://update.greasyfork.org/scripts/469112/exploding%20heads%20restyle%20add%20origin-sub%20names.meta.js
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
style.innerHTML =   '      .text-info  span i{color:#ffabc3   !important ;} html,body,div,p{font-family:"STALKER1","PT Mono",Tahoma  !important ;}img{max-width:25px;height:auto;}html{font-size:115%;}     ' ;
 
document.getElementsByTagName('head')[0].appendChild(style);
 
 
  
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


