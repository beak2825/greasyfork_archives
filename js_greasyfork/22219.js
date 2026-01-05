// ==UserScript==
// @name        VNDB Cover Preview + charaters
// @namespace   kyuuzoo
// @include     https://vndb.org/*
// @version     1.82
// @description Previews covers in vndb.org searches when hovering over the respective hyperlinks. Original script by https://twitter.com/Kuroonehalf 
// @grant       GM_setValue
// @grant       GM_getValue
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js 
// @license     http://creativecommons.org/licenses/by-nc-sa/4.0/
// @downloadURL https://update.greasyfork.org/scripts/22219/VNDB%20Cover%20Preview%20%2B%20charaters.user.js
// @updateURL https://update.greasyfork.org/scripts/22219/VNDB%20Cover%20Preview%20%2B%20charaters.meta.js
// ==/UserScript==
var TagLinkTest = /^https:\/\/vndb.org\/g\/links/;
var pageURL = document.URL;

// Link title suppression
$('[title]').each( function() {
    var $this = $(this);
    $this.data('title',$this.attr('title'));
    $this.removeAttr('title');
});
// Centering function
jQuery.fn.center = function () {
//     this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
//     if (pageURL.search(TagLinkTest) != -1){
//       this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) * 0.4) + $(window).scrollLeft()) + "px");
//     }
//     else{
//       this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) * 0.6) + $(window).scrollLeft()) + "px");
//     }
    $('#popover img').css('display','block');
    return this;
}

$('body').append('<div ID="popover"></div>');
$('#popover').css('position', 'fixed');
$('#popover').css('z-index', '10');
$('#popover').css('box-shadow','0px 0px 5px black');

$("a[href^='/v'],a[href^='/c'] ").mouseover(function () {
  $(this).css('font-weight', 'bold'); // Bolds previously hovered links.
  var oldHref = $(this).attr('href');
  var newHref = 'https://vndb.org' + oldHref;
  
  if (GM_getValue(newHref)){
       var retrievedLink = GM_getValue(newHref);
       $('#popover').empty();
       $('#popover').append('<img src="' + retrievedLink + '"></img>');
       $('#popover img').load(function() {  
         $('#popover').center();  
       });  
       console.log(newHref + " has been found and retrieved from the cache."); // for testing purposes
  }
  else{
  $.ajax({
     url: newHref,
     dataType: 'text',
     success: function (data) {
	     var divimg = $('<div>').html(data)[0].getElementsByClassName('vnimg')[0];
	     if (divimg == null)
	     {
		     var divimg = $('<div>').html(data)[0].getElementsByClassName('charimg')[0];
	     }
       var imagelink = divimg.getElementsByTagName('img')[0].src;
       // clear what's inside #popover and put the new image in there
       $('#popover').empty();
       $('#popover').append('<img src="' + imagelink + '"></img>');
       $('#popover img').load(function() {  
         $('#popover').center();  
       }); 
       // cache info
       GM_setValue(newHref, imagelink);
       console.log("(" + newHref + ", "+ imagelink + ") successfully cached.") // for testing purposes
     }
   });
   }
});
 
$("a[href^='/v'],a[href^='/c'] ").mouseleave(function(){
  $('#popover').empty();  
});
var tooltipSpan = document.getElementById('popover');
window.onmousemove = function (e) {
    var x = e.clientX,
        y = e.clientY;
	if ((((window.innerHeight )/2) - y) >= 0 )
	{
		tooltipSpan.style.top = (y + 20) + 'px';tooltipSpan.style.bottom = '';
	}
	else {
		tooltipSpan.style.bottom = (window.innerHeight - y + 20) + 'px';tooltipSpan.style.top = '';
	//console.log(x + " "+ y );
	}
	//console.log(window.innerHeight + " " + (((window.innerHeight )/2) - y));
    tooltipSpan.style.left = (x + 20) + 'px';
};
