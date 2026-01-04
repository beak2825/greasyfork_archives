// ==UserScript==
// @name   Scroll and prop
// @version  0.0.1
// @description Scrolls feed 
// @match https://www.fitocracy.com/home/*
// @match https://www.fitocracy.com/profile/*
// @namespace https://github.com/artm
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/1.4.14/jquery.scrollTo.min.js
// @grant  none
// @downloadURL https://update.greasyfork.org/scripts/35449/Scroll%20and%20prop.user.js
// @updateURL https://update.greasyfork.org/scripts/35449/Scroll%20and%20prop.meta.js
// ==/UserScript==

var qNum = 0;

createPropButton();

function createPropButton() {
  var button = $('<label for="autoprop">prop</label>')
  .appendTo('body')
  .css({position: "fixed"});
  
  $('<input id="autoprop" type="checkbox">')
  .appendTo('body')
  .button()
  .change(function(e) {
    if (this.checked) {
      scrollToUnpropped();
    } else {
      $(window)._scrollable().clearQueue().scrollTo("0%", 500);
      alert(qNum); 
      qNum = 0;  
    }
  });
  
  $(window)
  .resize(button, function(e) { keepCornered(e.data); })
  .resize();
}


function scrollToUnpropped(unpropped) {
    
  
 
  if (!unpropped || !unpropped.length)  {
    unpropped = $(".stream_item .give_prop").get();
      
  }
  var topUnpropped = unpropped.shift();
  if (topUnpropped && qNum < 50)  {  
    propAndContinue(topUnpropped, unpropped);
  } 
    else if (qNum == 50) {
    qNum=0;    
    alert('Please exit 50 propped')
  }
    
    else {
    scrollForMore();
  }
}

function propAndContinue(topUnpropped, unpropped) {
  
   
    $(window)
  ._scrollable()
  .scrollTo(topUnpropped, 1000, {
    offset: -60
  })
  .delay(250)
  .queue(function() {
    $(this).dequeue();
    $(topUnpropped).click();
    
    qNum += 1; 
  })
  .delay(250)
  .queue(function() {
    $(this).dequeue();
    scrollToUnpropped(unpropped);
  });
}

function scrollForMore() {
  $(window)
  ._scrollable()
  .scrollTo("100%", 500)
   // alert('test')
  .delay(1000)
  .queue(function() {
    $(this).dequeue();
    scrollToUnpropped();
  });
}



function keepCornered(widget) {
  widget.position({ 
    my: "right bottom", 
    at: "right-10 bottom-10", 
    of: window, 
    collision: "none" 
  });
}