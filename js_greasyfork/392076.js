// ==UserScript==
// @name     Google Images direct link fix
// @description	Adds a direct button link for the image.
// @version  1.7.4b
// @grant    none
// @include  https://www.google.tld/*tbm=isch*
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @namespace https://greasyfork.org/users/11231
// @downloadURL https://update.greasyfork.org/scripts/392076/Google%20Images%20direct%20link%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/392076/Google%20Images%20direct%20link%20fix.meta.js
// ==/UserScript==

var tempo1;
var tempo2 = '';
var i = 1;
let btnViewCl = $( 'span:contains("Visit")' ).parents().attr('class');
let btnViewCSS = ' #btnView { \
align-items:center; \
-moz-border-radius:36px; \
box-sizing:border-box; \
color:#f1f3f4; \
display:-webkit-inline-box; \
display:-webkit-inline-flex; \
display:-ms-inline-flexbox; \
display:inline-flex; \
font-size:14px; \
height:36px; \
max-width:100%; \
padding:5px 10px 5px 5px; \
align-self: center; \
margin-top: 6px; \
white-space: nowrap; \
}'
$( '<style>' ).text(  btnViewCSS ).appendTo( document.head );


let btnView = '<a id="btnView" class="'+btnViewCl+'" role="link"  rel="noopener" href="" jsaction="focus:kvVbVb; mousedown:kvVbVb; touchstart:kvVbVb;" rlhc="1"><div class="dJcyOc"><span class="pM4Snf">View image</span></div></a>';

$(window).on("load", function() {
	$(window).click(function(e) {
		if ($(e.target).prop("tagName") == 'IMG') { 
    i = 1;  
		Checker();
		} 
	});
  
      $(document).unbind("keypress.key37");
      $(document).unbind("keypress.key39");
  
      document.onkeydown = function(e) {
        switch (e.keyCode) {
          case 37: //alert('left');
            Checker();
            break;
          case 39: //alert('right');
            Checker();
            break;
        }
      }
    Checker();      
});

async function Checker() {
tempo1 = '';
tempo2 = '';  
setTimeout(function(){ 
tempo1 = $( 'c-wiz:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1) > img:nth-child(1)' ).attr('src');  
  if ( tempo1.indexOf(".jpg") >= 0  ||  tempo2.indexOf(".jpeg") >= 0 || tempo1.indexOf(".png") >= 0 || tempo1.indexOf(".gif") >= 0 ) { 
    $( '#btnView' ).remove();
    i = 1;
    $( 'div:nth-child(2) > c-wiz:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > a:nth-child(2)' ).before(btnView);
    $( '#btnView' ).attr('href', tempo1)
    $( '[viewBox="0 0 24 24"]>polygon' ).css('fill', 'white');
  }
  else { 
    $( '#btnView' ).remove();
    i++;
    tempo2 = $( 'div:nth-child(2) > c-wiz:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1) > img:nth-child(1)' ).attr('src');
    if ( tempo2.indexOf(".jpg") >= 0  || tempo2.indexOf(".jpeg") >= 0 || tempo2.indexOf(".png") >= 0 || tempo2.indexOf(".gif") >= 0 ) { 
    	$( 'div:nth-child(2) > c-wiz:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > a:nth-child(2)' ).before(btnView);
    	$( '#btnView' ).attr('href', tempo2)
      $( '[viewBox="0 0 24 24"]>polygon' ).css('fill', 'white');
    }
		else {
      $( '[viewBox="0 0 24 24"]>polygon' ).css('fill', 'red');
    	$( 'svg[viewBox="0 0 24 24"]' ).parent().attr('title', 'Image not provided, yet?');
      Checker(); 
    }
    
  }
  
 
}, 300);
}
