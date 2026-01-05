// ==UserScript==
// @name        SlideShow
// @namespace   
// @description Automatically presses the "next" button on image gallaries.
// @include     *
// @include     http://code.jquery.com/jquery-2.1.4.min.js
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11298/SlideShow.user.js
// @updateURL https://update.greasyfork.org/scripts/11298/SlideShow.meta.js
// ==/UserScript==

/* OPTIONS */

/* When the image is off the screen, when to move down.
0-1 = Never
3/4 = 3 Quarters of the way through
2/3 = 2 Thirds of the way through
2 = Half way through
3 = Third of the way through
4 = Quarter of the way through

etc.
*/
var whenToMoveDown = 2;

/* In milliseconds (1 second * 1000), how long the animation is for the screen to move auto scroll to the image.
For no animation, set it to 0
*/
var moveDownAnimationTime = 1000;

/* In pixels, how much space there is between the top of the screen and image. Default is 50. */
var spaceAboveImage = 50;

/* END OPTIONS */

var windowHeight;
var slide = false;
var timer;
var timer2;
var timehalf;
var height;
var heightNum;
var mainImage;
$(window).load(function(){
  var cookieExsist = checkCookie();
  $( 'body' ).prepend('<div id="slidecontainer" style="margin: 0 auto; position: fixed; width: 100%; overflow: auto; top: 0; background-color: #fff; border-bottom: 5px solid #A00000; z-index: 100000;"><div id="slidecontrols" style="min-width: 300px; width: 30%; margin: 0 auto;"></div></div>');
  $( '#slidecontrols' ).html('<input id="slidetime" value="10"/><div id="slidelabel">(seconds)</div><button id="slide">Start</button>');
  $( '#slidetime' ).css({'width': '60%', 'float': 'left', 
                         'padding': '0 3px',
                         'font-size': '13px',
                         'background-color': '#383838',
                         'color': '#fff',
                         'height':'28px',
                         'margin': '2px 0',
                         'text-align': 'center'
                        });
  $( '#slidelabel' ).css({'float': 'left',
                          'padding': '0 3px',
                          'font-size': '13px',
                          'color': '#000',
                          'height': '28px',
                          'line-height': '30px',
                          'margin': '2px 0'
                         });
  $( '#slide' ).css({'width': '14%', 'float': 'right', 
                     'padding': '0 3px',
                     'font-size': '13px',
                     'background-color': '#D0D0D0',
                     'color': '#585858',
                     'height':'28px',
                     'margin': '2px 0',
                     'text-align': 'center',
                     'border-radius': '5px',
                     'border': '1px solid blue',
                     'font-weight': 'normal',
                     'cursor': 'pointer'
                    });
  height = $( '#slidecontainer' ).css( "height" );
  heightNum = $( '#slidecontainer' ).height();
  windowHeight = $( window ).height();
  $( 'body' ).css({'margin-top': height});
  if(cookieExsist)
  {
    var slidetime = getCookie('slideactive');
    slide = true;
    $( '#slide' ).text('Stop');
    var sts = slidetime / 1000;
    $( '#slidetime' ).val(sts);
    $( '#slidetime' ).attr("disabled", true);
    timer = setInterval(function(){nextPage();},slidetime);
    timehalf = slidetime / whenToMoveDown;
    scroll();
  }
  
  
  $( '#slide' ).click(function(){
    if(!slide)
    {
      slide = true;
      $( '#slide' ).text('Stop');
      var slidetime = $('#slidetime').val();
      slidetime = slidetime * 1000;
      if(!$.isNumeric(slidetime) || slidetime == '')
      {
          slidetime = 10000;
      }
      timehalf = slidetime / 2;
      timer = setInterval(function(){nextPage();},slidetime);
      setCookie('slideactive',slidetime,1);
      $( '#slidetime' ).attr("disabled", true);
      scroll();
    }
    else
    {
      stopSlide();
    }
    
    
  });    
});

function stopSlide()
{
  slide = false;
  $( '#slide' ).text('Start');
  clearInterval(timer);
  $( '#slidetime' ).removeAttr("disabled");
  setCookie('slideactive','',0);
  clearTimeout(timer2);
}

function scroll()
{
  var offset = 0;
  var imageHeight = 0;
  $('img').each(function(){
    if($( this ).width() >= 400 || $( this ).height() >= 400)
    {
      offset = $( this ).offset().top;
      imageHeight = $( this ).height();
      mainImage = $( this );
      return false;
    }
  });
  var offset2 = offset - (heightNum + spaceAboveImage);
  $('html, body').animate({ scrollTop: offset2 }, 500);
  var contentheight = offset + imageHeight;
  var downvalue = contentheight - windowHeight;
  if(downvalue+20 >= offset2)
  {
    downvalue +=  20;
    timer2 = setTimeout(function(){$('html, body').animate({ scrollTop: downvalue }, moveDownAnimationTime);}, timehalf);
  }
}

function nextPage()
{
  var URL = $(location).attr('href');
  var URL2 = $(location).attr('href');
  var found = false;
  $('a').each(function(){
    var t = $(this).text();
    if (t.toLowerCase().indexOf("next") >= 0)
      {
        $(this).click();
        found = true;
      }
  });
  if(URL != URL2 || found == true)
  {
   scroll();
  }
  else
  {
    $('body').trigger({
      type: 'keydown',
      which: 39
    });
    URL2 = $(location).attr('href');
    if(URL == URL2)
    {
      console.log(mainImage);
      mainImage.click();
      URL2 = $(location).attr('href');
      setTimeout(function(){
        if(URL == URL2)
        {
          alert("Couldn't find a next button! :(");
          stopSlide();
        }
        else
        {
          scroll();
        }
      },100);
    }
    else
    {
      scroll();
    }
  }
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires+"; path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function checkCookie() {
    var active=getCookie("slideactive");
    if (active!="") {
        return true;
    }else{
        return false;
    }
}