// ==UserScript==
// @name        Wanikani Lesson Spoiler Removal
// @namespace   Mempo
// @description Hides the meaning below kanji and vocab on lesson pages
// @include     https://www.wanikani.com/lesson/session
// @version     4
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23485/Wanikani%20Lesson%20Spoiler%20Removal.user.js
// @updateURL https://update.greasyfork.org/scripts/23485/Wanikani%20Lesson%20Spoiler%20Removal.meta.js
// ==/UserScript==

(function() {
    'use strict';
    

    //HOVER EFFECT

    var css = '#main-info #meaning {visibility:hidden;} #main-info:hover #meaning {visibility:visible !important;}'; 
    $('head').append('<style type="text/css">'+css+'</style>');
    
    //CLICKING
    
    $( "body" ).click(function(e) {
        if($("#supplement-nav ul li.active").text()==="meaning" || $("#supplement-nav ul li.active").text()==="Meaning" ){
            $("#main-info #meaning").css('visibility', 'visible');
        }else{
            $("#main-info #meaning").css('visibility', 'hidden');
        }
  
    });
        
   
    
})();


/* JS solution - only in Chrome

(function() {
    'use strict';

    $.jStorage.listenKeyChange('l/currentLesson', function(){
  
        $("#main-info #meaning").html("");
        
   
    });
})();

*/
