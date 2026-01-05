// ==UserScript==
// @name         Jvc 2.0.1
// @namespace    http://tampersdfsdfet/
// @version      0.2
// @description  JVC 2.0.1
// @author       Singles
// @include     http://*.jeuxvideo.com/*
// @include     http://*.forumjv.com/*
// @include     https://*.jeuxvideo.com/*
// @include     https://*.forumjv.com/*
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20963/Jvc%20201.user.js
// @updateURL https://update.greasyfork.org/scripts/20963/Jvc%20201.meta.js
// ==/UserScript==


$('.header-top').css('height',"2.5rem");
$('.global-menu').css('height',"2.5rem");
$('.global-web').css('height',"2.5rem");
$('.global-user').css('height',"2.5rem");


$('.global-menu').css('line-height',"2.5rem");
$('.global-web').css('line-height',"2.5rem");
$('.global-user').css('line-height',"2.5rem");

$('.nav-primary .nav-lvl1-item > .nav-link').css('line-height',"2.5rem");
$('.nav-primary .nav-lvl1-item > .nav-link').css('height',"2.5rem");

$('.nav-primary').css('height',"2.5rem");
$('.nav-primary').css('top',"-2.5rem");

$('.nav-lvl1 li:last-child').hide();
$('.forum-right-col').find('iframe').hide();
$('.forum-right-col').find('body').hide();
$('.header-top').css('height',"2.5rem");


$('.nav-platform .nav-lvl1').css('height',"2rem");
$('.nav-container').css('line-height',"2rem");

$('.nav-toggler').css('height',"0.7rem");
$('.nav-lvl2').css('margin-top', "-15px");

$('.header-sticky, .header-bottom').css('height',"2rem");
$('.header-sticky').css('line-height',"2rem");






var $mouseX = 0, $mouseY = 0;
var $xp = 0, $yp =0;

$(document).mousemove(function(e){
    $mouseX = e.pageX;
    $mouseY = e.pageY;    
});

var $loop = setInterval(function(){
// change 12 to alter damping higher is slower
$xp += (($mouseX - $xp)/12);
$yp += (($mouseY - $yp)/12);

 $("#preview").css('position',"absolute");
$("#preview").css({left:$xp+20 +'px', top:$yp +'px'});  
}, 30);
   $("body").append("<div id=\"preview\"> </div>")  
   
   
   var currentRequest = null;    

$('#page-topics #forum-main-col a').mouseenter(function (){
  
 $("#preview").show();
 $("#preview").html('<img src="http://image.noelshack.com/fichiers/2016/26/1466991982-squares-1.gif" />');
  
  currentRequest = $.ajax({
url:$(this).attr("href"),
    beforeSend : function()    {           
        if(currentRequest != null) {
            currentRequest.abort();
        }
    },
success: function(response) {
  
   $('#preview').html($(response).find(".bloc-message-forum:first"));
  $(this).removeAttr('title');
    
}
}
        );

}).mouseleave(function(){
  $("#preview").hide();
});







$('[title]').mouseover(function () {
        $this = $(this);
        $this.data('title', $this.attr('title'));
        // Using null here wouldn't work in IE, but empty string will work just fine.
        $this.attr('title', '');
    }).mouseout(function () {
        $this = $(this);
        $this.attr('title', $this.data('title'));
    });