// ==UserScript==
// @name          youtube2mp3
// @namespace     youtube2mp3
// @version       0.851
// @description   Convert to mp3 from Youtube clip, if you want to open in background tab - middle click.
// @match         http*://www.youtube.com/*
// @match         http://www.video2mp3.net/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require	  https://greasyfork.org/scripts/1930-simulate-click/code/Simulate_click.js?version=5025
// @require	  https://greasyfork.org/scripts/386-waituntilexists/code/waitUntilExists.js?version=5026
// @copyright     2014+, Magnus Fohlström.
// @downloadURL https://update.greasyfork.org/scripts/1931/youtube2mp3.user.js
// @updateURL https://update.greasyfork.org/scripts/1931/youtube2mp3.meta.js
// ==/UserScript==

//youtube2mp3 auto closes when download starts
$('#social-like, #social-share, #vine-plug, #news-plug').waitUntilExists(function(){ 
    console.log('self.close')
    setInterval(function(){ 
        self.close(); 
    }, 1000 );  
});  

//Auto Click on convert this youtube link and auto click when file is ready to download.
$('#do-download-video').waitUntilExists(function(){    
    setTimeout(function(){ 
        $('#do-download-video').simulate('click'); 
    }, 1000 );
});

function youtube2mp3() {
    
    if( $('#Firstyoutube2mp3').size() == 0 ) 
    {
        var youtube2mp3path_hq ='http://www.video2mp3.net/?url='+encodeURIComponent(document.URL)+"&hq=1";
        
        $(  '<a id="Firstyoutube2mp3" class="yt-uix-button yt-uix-button-default" href="'+youtube2mp3path_hq+'" target="_blank" data-link="" style="margin-left: 8px; height: 26px; border-radius: 10px; padding: 0 22px;">' +
          	'<span class="yt-uix-button-content" style="line-height: 25px; font-variant: small-caps; font-size: 12px; color: rgb(139, 106, 23);">MP3 HQ Download</span></a>'  )
          .insertAfter( "#watch7-subscription-container" );        
    }
    
}

$(document).ready(function(){ 
    
    var youtube2mp3timerId = setInterval(function() {
        youtube2mp3();
    }, 2500);
    
    console.log('youtube2mp3')
    
});
