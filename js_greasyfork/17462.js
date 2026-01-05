// ==UserScript==
// @name         Youtube Subtitles Edit
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  A script for changing the ugly ass youtube subtitles on CC. May make it so you can select your own subtitle look later on.
// @author       Dildoer the Cocknight
// @match        *youtube.com/watch*
// @match        *youtube.com/embed*
// @match        https://www.youtube.com/watch*
// @match        https://www.youtube.com/embed*
// @require     https://code.jquery.com/jquery-1.11.0.min.js
// @require     https://code.jquery.com/ui/1.11.4/jquery-ui.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17462/Youtube%20Subtitles%20Edit.user.js
// @updateURL https://update.greasyfork.org/scripts/17462/Youtube%20Subtitles%20Edit.meta.js
// ==/UserScript==
/* jshint -W097 */


//note - my website (therealnig.ga) got hijacked so the manual selector is no longer working! If you want to edit your subs you'll have to do it manually within the script below!

    //vars for my CSS stuff later, will set it so I can change these with a modal selector eventually
    var backgroundcolor = 'transparent'
    var textcolor = 'yellow'
    var fontsize = 150 //goes by Percent- 100% is the default!
    var fontfam = 'Special Elite'
    var textshadow = 'rgba(34, 34, 34, 0.498039) 0px 0px 4px, rgba(34, 34, 34, 0.498039) 0px 0px 4px, rgba(34, 34, 34, 0.498039) 0px 0px 4px, rgba(34, 34, 34, 0.498039) 0px 0px 4px'
 
    // Tells you that the script is working and it picked up the video.
console.log("Video detected - Youtube Subtitles Editor Enabled!")
   
//adds a spacer so we can add from google fonts
var spacer = fontfam.replace(/ /g, "+");
 
    //Gives JQUERYUI.css and a few aditional fonts, gonna add a selector in there later to choose from Google fonts
    $('head').append('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans|Orbitron|Oleo+Script|' + spacer + '|Permanent+Marker|,">');
    $('head').append('<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">');
    
 
    //initial css style for the subtitles; gotta change that shit later on
    $('head').append('<style> .captions-text { color:' + textcolor + '!important;  text-shadow:' + textshadow + '!important; font-family:' + fontfam + '!important; background-color:' + backgroundcolor + '!important; font-size:' + fontsize + '%!important; } </style>');
    //creates the menu option in jquery to open the modal for our subtitle customizer
    $('body').append('<div id="dialog" title="Subtitle Edit Menu" <div id="editcontent"> Background: <br> <input class="subBackground" value="transparent"> <br> Text color: <br> <input class="subColor" value="yellow"> </div></div>');
    $('#ytp-main-menu-id').append('<div class="ytp-menuitem" aria-haspopup="true" role="menuitem" tabindex="0"><div class="ytp-menuitem-label"><div><span>Subtitle Editor</span></div></div><button class="ytp-menuitem-content" id="opener">Edit</button></div>');
 

   
        //ui scripts...
       
  $(function() {
    $( "#dialog" ).dialog({
      autoOpen: false,
      show: {
        effect: "blind",
        duration: 500
      },
      hide: {
        effect: "explode",
        duration: 500
      }
    });
 
    $( "#opener" ).click(function() {
      $( "#dialog" ).dialog( "open" );
    });
  });
    