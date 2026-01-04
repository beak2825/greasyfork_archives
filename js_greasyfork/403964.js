// ==UserScript==
// @name        INNIST LIST Cover on threads Preview
// @namespace   innist_list_cover
// @include     https://innist.forumvi.com/f3*-act-rpg-slg*
// @include     https://innist.forumvi.com/f4*-jav*
// @include     https://innist.forumvi.com/f5*-eroge*
// @include     https://innist.forumvi.com/f7*-pc-games*
// @include     https://innist.forumvi.com/f6-cgs*
// @include     https://innist.forumvi.com/f5p*-eroge
// @include     https://innist.forumvi.com/f3p*-act-rpg-slg
// @include     https://innist.forumvi.com/f4p*-jav
// @include     https://innist.forumvi.com/f6p*-cgs
// @include     https://innist.forumvi.com/f7p*-pc-games
// @include     https://innist.forumvi.com/search*
// @version     1.0.3
// @description Previews covers in innist forum when hovering over the respective hyperlinks. Puts images on the table and zooms when mouseover the image. CTRL+SPACE TO ACTIVATE.
// @grant       GM_setValue
// @grant       GM_getValue
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @license     http://creativecommons.org/licenses/by-nc-sa/4.0/
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/403964/INNIST%20LIST%20Cover%20on%20threads%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/403964/INNIST%20LIST%20Cover%20on%20threads%20Preview.meta.js
// ==/UserScript==

// For analyzing what kind of page
var pageURL = document.URL;
var deactivatedColor = 'rosybrown';
//debug
unsafeWindow.dvar = "TEST";


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
        $('#popoverstatus').css('color', 'wheat');
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
        $('#popoverstatus').css('color', 'white');
        $('#popoverstatus').text("CTRL+Space to activate");
        // Don't remove new cell so the mini-images can be seen even with it deactivated
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
 //     this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) * 0.4) + $(window).scrollLeft()) + "px");
    // Display image on right hand side
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) * 0.6) + $(window).scrollLeft()) + "px");

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
$('#popoverstatus').css('top', '20%');
$('#popoverstatus').css('right', '2%');
$('#popoverstatus').css('border-style', 'solid');
$('#popoverstatus').css('border-color', deactivatedColor);
$('#popoverstatus').css('background-color', deactivatedColor);
$('#popoverstatus').css('color', "white");
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

$('dd a').mouseover(function () {
  if(!mActive) {
      console.log("NOT ACTIVATED, returning");
      return;
  }
  unsafeWindow.dvar = $(this)
  $(this).css('font-weight', 'bold'); // Bolds hovered links
  var pagelink = 'https://innist.forumvi.com/' + $(this).attr('href');
  var mImageCell = $(this).closest("dl")[0].children[0];
  var mStyle = "text-align:center; vertical-align:middle; max-width:150px;  max-height:150px;"

  // If image link pre-cached
  if (GM_getValue(pagelink)){
       var retrievedLink = GM_getValue(pagelink);
      //console.log("REPLACED");
     //  Put image if not any
      if(mImageCell.childElementCount == 0) {
          var img = document.createElement('img');
          img.style = mStyle;
          img.src = retrievedLink;
          img.onmouseover = mouseOverImage;
          img.onmouseleave = mouseLeaveImage;
          mImageCell.appendChild(img);
      }
  } // Else get image src from link
  else{
  $.ajax({
     url: pagelink,
     dataType: 'text',
     success: function (data) {

       //  console.log("OK");
       var imagelink = $('<div>').html(data)[0].getElementsByClassName('postbody')[0].getElementsByTagName('img')[0].src;
       console.log("link " + imagelink)

       unsafeWindow.dvar = data
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
       console.log("(" + pagelink + ", "+ imagelink + ") successfully cached.") // for testing purposes
     }
   });
   }
});
//Put an extra td for the image
var trs = document.querySelectorAll('.row dl');

trs.forEach(function(mTr) {
    var newItem = document.createElement("dd");
    newItem.className = "tdsOff";
    mTr.insertBefore(newItem, mTr.firstChild)
});

