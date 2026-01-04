// ==UserScript==
// @name JVC Live
// @description Charger les nouveaux messages en direct sur JVC
// @author Singles
// @match http://www.jeuxvideo.com/*
// @match http://www.forumjv.com/*
// @run-at document-end
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version 1.1.4
// @grant none
// @noframes
// @namespace https://greasyfork.org/users/785403
// @downloadURL https://update.greasyfork.org/scripts/428217/JVC%20Live.user.js
// @updateURL https://update.greasyfork.org/scripts/428217/JVC%20Live.meta.js
// ==/UserScript==

var TL = new TopicLive();
TL.initStatic();

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
        $this.attr('title', '');
    }).mouseout(function () {
        $this = $(this);
        $this.attr('title', $this.data('title'));
    });

