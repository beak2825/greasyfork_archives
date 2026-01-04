// ==UserScript==
// @name        VNDB LIST Cover on table Preview
// @namespace   vndb_list_cover
// @include     https://vndb.org/i*
// @include     https://vndb.org/v/*
// @include     https://vndb.org/v*
// @include     https://vndb.org/g*
// @include     https://vndb.org/p*
// @include     https://vndb.org/u*
// @include     https://vndb.org/s*
// @include     https://vndb.org/r*
// @include     https://vndb.org/c*
// @include     https://vndb.org/t*
// @version     1.0.11
// @description Previews covers in vndb.org searches when hovering over the respective hyperlinks. Puts images on the table and zooms when mouseover the image.
// @grant       GM_setValue
// @grant       GM_getValue
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @license     http://creativecommons.org/licenses/by-nc-sa/4.0/
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/390066/VNDB%20LIST%20Cover%20on%20table%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/390066/VNDB%20LIST%20Cover%20on%20table%20Preview.meta.js
// ==/UserScript==

// For analyzing what kind of page
var TagLinkTest = /^https:\/\/vndb.org\/g\/links/;
var UserLinkTest = /^https:\/\/vndb.org\/u[0-9]+/;
var VNLinkTest = /^https:\/\/vndb.org\/v[0-9]+/;
var CharacterLinkTest = /^https:\/\/vndb.org\/c[0-9]+/;
var ReleaseLinkTest = /^https:\/\/vndb.org\/r[0-9]+/;
var pageURL = document.URL;
var deactivatedColor = 'rosybrown';


var styles = `
    .tdsOff {
        width: 0px;
    }
    .tdsOn {
        width: 150px;
    }
`
var styleSheet = document.createElement("style")
styleSheet.type = "text/css"
styleSheet.innerText = styles
document.head.appendChild(styleSheet)

var mActive = false;
var keysDown = {};
window.onkeydown = function(e) {
  if(keysDown[e.key] == true) return;
  keysDown[e.key] = true;

  if (keysDown["Control"] && keysDown[" "]) {
    mActive = !mActive;
    if(mActive) {
        console.log("ACTIVATED ajax query");
        $('#popoverstatus').css('visibility', 'visible');
        $('#popoverstatus').css('border-color', 'darkgreen');
        $('#popoverstatus').css('background-color', 'darkgreen');
        $('#popoverstatus').text("Mouseover active");
        // Remove width 0 to properly display character images
        var mTds = $('.tdsOff');
        mTds.removeClass('tdsOff');
        mTds.addClass('tdsOn');
    } else {
        console.log("DE-ACTIVATED ajax query");
        $('#popoverstatus').css('visibility', 'visible');
        $('#popoverstatus').css('border-color', deactivatedColor);
        $('#popoverstatus').css('background-color', deactivatedColor);
        $('#popoverstatus').text("CTRL+Space to activate");
    }
  }

}
window.onkeyup = function(e) {
  keysDown[e.key] = false;
}

// Centering function
jQuery.fn.center = function () {
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
    // Display image on left hand side
    if (pageURL.search(TagLinkTest) != -1 || pageURL.search(UserLinkTest) != -1 || pageURL.search(VNLinkTest) != -1){
      this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) * 0.4) + $(window).scrollLeft()) + "px");
    }
    // Display image on right hand side
    else{
      this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) * 0.6) + $(window).scrollLeft()) + "px");
    }
    $('#popover img').css('display','block');
    return this;
};

// Add box where the image will sit
$('body').append('<div ID="popover"></div>');
$('#popover').css('position', 'absolute');
$('#popover').css('z-index', '10');
$('#popover').css('box-shadow','0px 0px 5px black');

// Status box
$('body').append('<div ID="popoverstatus"></div>');
$('#popoverstatus').css('z-index', '10');
$('#popoverstatus').css('box-shadow','0px 0px 5px black');
$('#popoverstatus').css('position', 'fixed');
$('#popoverstatus').css('top', '2%');
$('#popoverstatus').css('right', '2%');
$('#popoverstatus').css('border-style', 'solid');
$('#popoverstatus').css('border-color', deactivatedColor);
$('#popoverstatus').css('background-color', deactivatedColor);
$('#popoverstatus').css('border-radius', '6px');
$('#popoverstatus').css('visibility', 'visible');
$('#popoverstatus').css('margin-left', '-5px');
$('#popoverstatus').css('border-width', '5px');
$('#popoverstatus').append("CTRL+Space to activate");

function mouseOverImage(ev) {
    //console.log("popup img");
    $('#popover').empty();
    $('#popover').append('<img src="' + ev.target.src + '"></img>');
    $('#popover img').load(function() {
        $('#popover').center();
    });
}

function mouseLeaveImage(ev) {
    $('#popover').empty();
}

$('.tc_title a, .tc2 a, td.tc4 a, td.tc1 a').mouseover(function () {
    //console.log(this);
  if(!mActive) {
      console.log("NOT ACTIVATED, returning");
      return;
  }

  $(this).css('font-weight', 'bold'); // Bolds hovered links
  var VNnumber = $(this).attr('href');
  var pagelink = 'https://vndb.org' + VNnumber;
  var mImageCell = $(this).closest('tr')[0].cells[0];
  var mStyle = "text-align:center; vertical-align:middle; max-width:150px;  max-height:150px;"

  if (GM_getValue(pagelink)){
       var retrievedLink = GM_getValue(pagelink);
       console.log("REPLACED_IMAGE_loaded");
      if(mImageCell.childElementCount == 0) {
          var img = document.createElement('img');
          img.style = mStyle;
          img.src = retrievedLink;
          img.onmouseover = mouseOverImage;
          img.onmouseleave = mouseLeaveImage;
          mImageCell.appendChild(img);
      }
  }
  else{
  $.ajax({
     url: pagelink,
     dataType: 'text',
     success: function (data) {

       //  console.log("OK");
       // Grab character image
       var imagelink = null;
       if (pagelink.search(CharacterLinkTest) != -1){
           imagelink = $('<div>').html(data)[0].getElementsByClassName('charimg')[0].getElementsByTagName('img')[0].src;
       } else
       if (pagelink.search(ReleaseLinkTest) != -1){
           console.log("RELEASED LINK");
           var realLink = $('<div>').html(data)[0].getElementsByClassName('release')[0].getElementsByTagName('table')[0].getElementsByTagName('a')[0].href;
           callSecondAjaxForReleasepages(realLink, mImageCell, mStyle, pagelink);
           return; // Return execution as second ajax will take care of it.
       }
       // Grab visual novel cover
       else{
           imagelink = $('<div>').html(data)[0].getElementsByClassName('vnimg')[0].getElementsByTagName('img')[0].src;
       }

       if(mImageCell.childElementCount == 0) {
          var img = document.createElement('img');
          img.style = mStyle;
          img.src = imagelink;
          img.onmouseover = mouseOverImage;
           img.onmouseleave = mouseLeaveImage;
          mImageCell.appendChild(img);
          mImageCell.style = "style : 150px";
      }
       // cache info
       GM_setValue(pagelink, imagelink);
       //console.log("(" + pagelink + ", "+ imagelink + ") successfully cached.") // for testing purposes
     }
   });
   }
});
//Put an extra td for the image
var trs = document.querySelectorAll('table.releases tr, div.vnbrowse tr, div.charb tr, div.staffroles tr');

trs.forEach(function(mTr) {
    mTr.insertCell(0);
    mTr.cells[0].className = "tdsOff";
});

// Ajax for release page
function callSecondAjaxForReleasepages(pagelink, mImageCell, mStyle, originalPageLink) {
  $.ajax({
     url: pagelink,
     dataType: 'text',
     success: function (data) {

       //  console.log("OK");
       // Grab character image
       var imagelink = null;
       if (pagelink.search(CharacterLinkTest) != -1){
           imagelink = $('<div>').html(data)[0].getElementsByClassName('charimg')[0].getElementsByTagName('img')[0].src;
       } else
       if (pagelink.search(ReleaseLinkTest) != -1){
           console.log("RELEASED LINK -- something is wrong here");
           //var realLink = $('<div>').html(data)[0].getElementsByClassName('release')[0].getElementsByTagName('table')[0].getElementsByTagName('a')[0].href;
       }
       // Grab visual novel cover
       else{
           imagelink = $('<div>').html(data)[0].getElementsByClassName('vnimg')[0].getElementsByTagName('img')[0].src;
       }

       if(mImageCell.childElementCount == 0) {
          var img = document.createElement('img');
          img.style = mStyle;
          img.src = imagelink;
          img.onmouseover = mouseOverImage;
           img.onmouseleave = mouseLeaveImage;
          mImageCell.appendChild(img);
          mImageCell.style = "style : 150px";
      }
       // cache info
       GM_setValue(pagelink, imagelink); // Caches image for the novel
       GM_setValue(originalPageLink, imagelink); // Cache the novel image for the release
       //console.log("(" + pagelink + ", "+ imagelink + ") successfully cached.") // for testing purposes
     }
   });
}

// New vn page fix
$('ul.prodvns li a').mouseover(function () {
  if(!mActive) {
      console.log("NOT ACTIVATED, returning");
      return;
  }
  console.log("prodvns LI");
  unsafeWindow.dvar = $(this)

  $(this).css('font-weight', 'bold'); // Bolds hovered links
  var VNnumber = $(this).attr('href');
  var pagelink = 'https://vndb.org' + VNnumber;
  var mImageCell = $(this).closest('li')[0];
  var mStyle = "text-align:center; vertical-align:middle; max-width:150px;  max-height:150px;"

  if (GM_getValue(pagelink)){
       var retrievedLink = GM_getValue(pagelink);
      //console.log("SAVED_IMAGE_loaded");
      //  Put image if not any, no image = 3 -- 4 in the new releases page
      //console.log(mImageCell.childElementCount);
      if(mImageCell.childElementCount == 4 || mImageCell.childElementCount == 3) {
          var img = document.createElement('img');
          img.style = mStyle;
          img.src = retrievedLink;
          img.onmouseover = mouseOverImage;
          img.onmouseleave = mouseLeaveImage;
          mImageCell.insertBefore(img, mImageCell.firstChild);
      }
  }
  else{
  $.ajax({
     url: pagelink,
     dataType: 'text',
     success: function (data) {

       //  console.log("OK");
       // Grab character image
       var imagelink = null;
       if (pagelink.search(CharacterLinkTest) != -1){
           imagelink = $('<div>').html(data)[0].getElementsByClassName('charimg')[0].getElementsByTagName('img')[0].src;
       }
       // Grab visual novel cover
       else{
           imagelink = $('<div>').html(data)[0].getElementsByClassName('vnimg')[0].getElementsByTagName('img')[0].src;
       }

       // If no image, put it there
       if(mImageCell.childElementCount == 3) {
          var img = document.createElement('img');
          img.style = mStyle;
          img.src = imagelink;
          img.onmouseover = mouseOverImage;
          img.onmouseleave = mouseLeaveImage;
          mImageCell.insertBefore(img, mImageCell.firstChild);
          mImageCell.style = "style : 150px";
      }
       // cache info
       GM_setValue(pagelink, imagelink);
       //console.log("(" + pagelink + ", "+ imagelink + ") successfully cached.") // for testing purposes
     }
   });
   }
});
/*
var td = trs[0].cells[0];
td.textContent = "Cover image";
*/
/* too many ajax, doing only when over mouse

// Put image
td = trs[2].cells[0];
var img = document.createElement('img');
img.src = "https://s2.vndb.org/cv/56/23956.jpg";
td.appendChild(img);

//get href
trs[2].querySelector('a').href;

// Clear image on unhover
$('img').mouseleave(function(){
  $('#popover').empty();
});
*/