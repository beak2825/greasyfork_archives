// ==UserScript==
// @include https://quizlet.com/*
// @name         Quizlet Learn for Languages
// @description  Optimized for learning Chinese. Gives "learn" functionality similar to Pleco. Single hand navigation.
// @version 0.0.1.20210704205534
// @namespace https://greasyfork.org/users/790368
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js 
// @downloadURL https://update.greasyfork.org/scripts/428911/Quizlet%20Learn%20for%20Languages.user.js
// @updateURL https://update.greasyfork.org/scripts/428911/Quizlet%20Learn%20for%20Languages.meta.js
// ==/UserScript==


// Navigation Controls:
// "incorrect" -- LEFT ARROW 
// "correct" -- RIGHT ARROW
// "listen" -- SHIFT
// "flip card" -- ALT
// "open Google Translate" -- ? (question mark)

// TODO: 
// ** Change interval function into a js mutationObserver

document.onkeydown = function(e) {
    switch(e.which) {
        case 18: // left
        $(".a17kns5:contains('Study again')")[0].click();
        break;
        
        case 93: // context menu
        $(".a17kns5:contains('Study again')")[0].click();
        break;

        case 39: // right
        $(".a17kns5:contains('Got it')")[0].click();
        break;
        
        case 16: // shift
        $(".AssemblyButtonBase--small").click();
        break;
        
        case 191: // alt
        $(".bc3udft").click();
        break;
        
        case 37: // forward slash
        $("#myID > span > a")[0].click();
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
};

document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
});


setInterval(function() {
   if ($('.FormattedText').length) {
      console.log("Exists!");
      $('.FormattedText').css("font-size", "50px");
      $('.c1sj1twu').css("justify-content", "center");
      if ($('#myID').length != 1) {
        var myText = $('.FormattedText > div').html();
        var myList = [];
        for (var i = 0; i < myText.length; i++) {
          myList.push(myText.charAt(i))
        };
        console.log(myList);
        var seperatedText = myList.join('%0A');
        console.log(seperatedText);
        $( ".l1b4ycqi" ).html( "<button id='myID' style='background-color:transparent;border-width:1px;'><span><a href='https://translate.google.com/?sl=zh-CN&tl=en&text=" + seperatedText + "&op=translate' target='blank' style='color:#7b89c991;'>TRANSLATE</a></span></button>" );
      }
      // if ($(".h10q3o7a").length) {
      //   $(".h10q3o7a").remove();
      // };

      clearInterval(checkExist);
   }
}, 1000); // check every 1000ms


