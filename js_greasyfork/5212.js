// ==UserScript==
// @name        VNDB Cover Preview
// @namespace   https://twitter.com/Kuroonehalf
// @namespace   https://kuroonehalf.com
// @include     https://vndb.org*
// @include     https://vndb.org/v*
// @include     https://vndb.org/g*
// @include     https://vndb.org/p*
// @include     https://vndb.org/u*
// @include     https://vndb.org/s*
// @include     https://vndb.org/r*
// @include     https://vndb.org/c*
// @include     https://vndb.org/t*
// @version     2.0.2
// @description Previews covers in vndb.org searches when hovering over the respective hyperlinks.
// @grant       GM_setValue
// @grant       GM_getValue
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js 
// @license     http://creativecommons.org/licenses/by-nc-sa/4.0/
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/5212/VNDB%20Cover%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/5212/VNDB%20Cover%20Preview.meta.js
// ==/UserScript==

// For testing what kind of page we're on
var TagLinkTest = /^https:\/\/vndb.org\/g\/links/;
var UserLinkTest = /^https:\/\/vndb.org\/u[0-9]+/;
var VNLinkTest = /^https:\/\/vndb.org\/v[0-9]+/;
var CharacterLinkTest = /^https:\/\/vndb.org\/c[0-9]+/;
var pageURL = document.URL;

// Disable tooltips on links
$('[title]').mouseover( function() {
    var $this = $(this);
    $this.data('title',$this.attr('title'));
    $this.removeAttr('title');
});

// Image positioning function
jQuery.fn.center = function (leftoffset, topoffset) {
    // Vertical displacement. Puts the image next to the link, and keeps it in bounds
    this.css("top", Math.max($(window).scrollTop(), Math.min($(window).height() + $(window).scrollTop() - $(this).outerHeight() , topoffset - $(this).outerHeight()/2 + $(window).scrollTop() ) ));
    // Horizontal displacement
    // On some pages place the cover to the left of the link
    if (pageURL.search(TagLinkTest) != -1 || pageURL.search(UserLinkTest) != -1 || pageURL.search(VNLinkTest) != -1)
      this.css("left", leftoffset + $(window).scrollLeft() - $(this).outerWidth() - 25);
    // On others display on the right
    else
      this.css("left", Math.max(0, $(window).width() * 0.6 + $(window).scrollLeft() - $(this).outerWidth()/2 ));
    
    $('#popover img').css('display','block');
    return this;
};

// Add box where the image will sit
$('body').append('<div ID="popover"></div>');
$('#popover').css('position', 'absolute');
$('#popover').css('z-index', '10');
$('#popover').css('box-shadow','0px 0px 5px black');


$('tr a').mouseover(function () {
  $(this).css('font-weight', 'bold'); // Bolds hovered links

  var leftoffset = this.getBoundingClientRect().left;
  var topoffset =  this.getBoundingClientRect().top;
  var VNnumber = $(this).attr('href');
  var pagelink = 'https://vndb.org' + VNnumber;
  
  if (GM_getValue(pagelink)){
       var retrievedLink = GM_getValue(pagelink);
    
       // Replace image being displayed with new one hovered
       $('#popover').empty();
       $('#popover').append('<img src="' + retrievedLink + '"></img>');
       $('#popover img').load(function() {  
         $('#popover').center(leftoffset, topoffset);  
       });  
       //console.log(pagelink + " has been found and retrieved from the cache."); // for debug purposes
  }
  else{
  $.ajax({
     url: pagelink,
     dataType: 'text',
     success: function (data) {
       // Convert the HTML string into a document object
       var parser = new DOMParser();
       let dataDOC = parser.parseFromString(data, 'text/html');
       var imagelink;
       // Grab character image
       if (pagelink.search(CharacterLinkTest) != -1)
           imagelink = dataDOC.querySelector(".charimg img").src;
       // Grab visual novel cover
       else
           imagelink = dataDOC.querySelector(".vnimg img").src
       // clear what's inside #popover and put the new image in there
       $('#popover').empty();
       $('#popover').append('<img src="' + imagelink + '"></img>');
       $('#popover img').load(function() {  
         $('#popover').center();  
       }); 
       // cache info
       GM_setValue(pagelink, imagelink);
       //console.log("(" + pagelink + ", "+ imagelink + ") successfully cached.") // for testing purposes
     }
   });
   }
});
 
// Clear image on unhover
$('tr a').mouseleave(function(){
  $('#popover').empty();  
});