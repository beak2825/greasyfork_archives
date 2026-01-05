// ==UserScript==
// @name        YouTube Disabler Prank (Prank) 
// @namespace   http://www.diamonddownload.weebly.com
// @version     1.2
// @description Changes *most* thumbnails, titles, channel names, link, etc.
// @include     *.youtube.*/*
// @copyright   2014+, RGSoftware
// @author      R.F Geraci
// @run-at      document-body
// @icon64      http://icons.iconarchive.com/icons/treetog/junior/64/tool-box-icon.png
// @grant       GM_notification
// @downloadURL https://update.greasyfork.org/scripts/3888/YouTube%20Disabler%20Prank%20%28Prank%29.user.js
// @updateURL https://update.greasyfork.org/scripts/3888/YouTube%20Disabler%20Prank%20%28Prank%29.meta.js
// ==/UserScript==

var RUN_SCRIPT_TOGGLE = true;


//============" IT WOULD MAKE SENSE TO RENAME THE SCRIPT AND DESCRIPTION ^^WITH THE ABOVE^^ FOR IT TO BLEND IN "============


var imageURL, NewTitle, NewTitle2, Interval, ThumbnailClassName, Titles1ClassName,
    NewVideoDescription, VideoDescriptionClassName, WorkOnlyOnChannelName,
    WorkOnlyOnLoginName, LoginNameCheckClassName, InitalDelay, RedirectionLink,
    OriginalThumbnailLinkClassName, VideoChannelNameClassName, NewVideoChannelName, 
    ModuleHeaderTextClassName, NewModuleHeaderText, NewModuleHeaderLinkClassName,
    NewModuleHeaderLinkClassName1, ShowPrankMessage_Title, ShowPrankMessage_Text,
    ShowPrankMessage_IconURL, ShowPrankMessage, VideoResultsThumbnailClassName,
    VideoResultsChannelNameClassName, RemoveHoverCard, AutoRedirectVideoURL,
    ChannelBannerClassName, MiscTitlesClassName, MiscChannelNames;

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=Custom Settings-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

WorkOnlyOnLoginName = "";                                                                                        //leave blank to execute on all logins | Case In-sensitive
imageURL = "http://www.sportingtribune.com/wp-content/uploads/2013/02/fat-man-at-computer.jpg";                  // Leave blank to not change
NewTitle = "Fat Man Army";                                                                                       // Leave blank to not change
NewVideoDescription = "Pies for all";                                                                            // Leave blank to not change
Interval = 10;                                                                                                   // In Milliseconds
InitalDelay = 0;                                                                                                 // In Seconds                                                                                                         
RedirectionLink = "http://www.sportingtribune.com/wp-content/uploads/2013/02/fat-man-at-computer.jpg"; 		 // Leave blank to not change
NewVideoChannelName = "PieMaker22";                                                                              // Leave blank to not change
NewModuleHeaderText = "Fat Man Studios";                                                                         // Leave blank to not change
ShowPrankMessage_Title =   "Fat Man For All!";                                                                   // Title of prank message
ShowPrankMessage_Text =  "Ha, this is payback!";                                                                 // Text of prank message
ShowPrankMessage_IconURL =  "http://www.sportingtribune.com/wp-content/uploads/2013/02/fat-man-at-computer.jpg"; // Icon of prank message
ShowPrankMessage = false;                                                                                        // Toggle ON/OFF prank message
RemoveHoverCard = true;                                                                                          // Toggle ON/OFF native hover "channel" card
AutoRedirectVideoURL = true;                                                                                     // If video url is loaded it will redirect it too, 'redirectionLink' must be not be blank!
//----------------------------------------------------------------------------------------------------

ThumbnailClassName = 'yt-thumb-clip';
Titles1ClassName = 'yt-uix-sessionlink yt-uix-tile-link  spf-link  yt-ui-ellipsis yt-ui-ellipsis-2';
VideoDescriptionClassName = 'yt-lockup-description yt-ui-ellipsis yt-ui-ellipsis-2';
LoginNameCheckClassName = 'yt-masthead-picker-name';
OriginalThumbnailLinkClassName = 'ux-thumb-wrap yt-uix-sessionlink yt-fluid-thumb-link contains-addto  spf-link ';
VideoChannelNameClassName = 'g-hovercard yt-uix-sessionlink yt-user-name  spf-link ';
ModuleHeaderTextClassName = 'branded-page-module-title-text';
NewModuleHeaderLinkClassName1 = 'yt-uix-sessionlink branded-page-module-title-link spf-nolink g-hovercard';
VideoResultsThumbnailClassName = 'video-thumb';
VideoResultsChannelNameClassName = ' yt-uix-sessionlink     spf-link  g-hovercard';
ChannelBannerClassName = 'hd-banner-image';
MiscTitlesClassName = 'yt-uix-sessionlink yt-uix-tile-link  yt-ui-ellipsis yt-ui-ellipsis-2';
MiscChannelNames = 'g-hovercard yt-uix-sessionlink yt-user-name'; 
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

function prank(){
    
    
    var titles1, vidDesc, OrgiThumbLink, ChanNames, thumbs, ModHeadText, ModHeadLink,
        VidResThumb, VidResChanName, ChanBanner, MiscTitles, MiscChanNames;
    
    var o, i, x, d, a, u, b, f, q, g, t;
    
    titles1 = document.getElementsByClassName(Titles1ClassName);
    vidDesc = document.getElementsByClassName(VideoDescriptionClassName);
    OrgiThumbLink = document.getElementsByClassName(OriginalThumbnailLinkClassName); 
    ChanNames = document.getElementsByClassName(VideoChannelNameClassName);
    thumbs = document.getElementsByClassName(ThumbnailClassName);
    ModHeadText = document.getElementsByClassName(ModuleHeaderTextClassName);
    ModHeadLink = document.getElementsByClassName(NewModuleHeaderLinkClassName1);
    VidResThumb = document.getElementsByClassName(VideoResultsThumbnailClassName);
    VidResChanName = document.getElementsByClassName(VideoResultsChannelNameClassName);
    ChanBanner = document.getElementsByClassName(ChannelBannerClassName)[0];
    MiscTitles = document.getElementsByClassName(MiscTitlesClassName);
    MiscChanNames = document.getElementsByClassName(MiscChannelNames);
    
    for (o = 0; o < thumbs.length; o++){
        if (imageURL != ""){
            thumbs[o].childNodes[1].src = imageURL;
        }
      
    }
    
    for (i = 0; i < titles1.length; i++){
        if (NewTitle != ""){titles1[i].innerHTML = NewTitle;}
        if (NewTitle != ""){titles1[i].title = NewTitle;}
        if (RedirectionLink != ""){titles1[i].href = RedirectionLink;}
    }
    
    for (x = 0; x < vidDesc.length; x++){
        if (NewVideoDescription != ""){vidDesc[x].innerHTML = NewVideoDescription;}
    }
    
    for (d = 0; d < OrgiThumbLink.length; d++){
        if (RedirectionLink != ""){OrgiThumbLink[d].href = RedirectionLink;}
    }  
    
    for (a = 0; a < ChanNames.length; a++){
        if (NewVideoChannelName != ""){ChanNames[a].innerHTML = NewVideoChannelName;}
        if (RedirectionLink != ""){ChanNames[a].href = RedirectionLink;}
        if (RemoveHoverCard){ChanNames[a].className = "";}
    }
    
    for (u = 0; u < ModHeadText.length; u++){
        if (NewModuleHeaderText != ""){ModHeadText[u].innerHTML = NewModuleHeaderText;}
        
    } 
    
    for (b = 0; b < ModHeadLink.length; b++){
        if (RedirectionLink != ""){ModHeadLink[b].href = RedirectionLink;}
        
    } 
    
    for (f = 0; f <  VidResThumb.length; f++){
        if (imageURL != ""){VidResThumb[f].childNodes[0].src = imageURL;}
        if (RedirectionLink != ""){VidResThumb[f].parentNode.href = RedirectionLink;}
    } 
    
     for (q = 0; q <  VidResChanName.length; q++){
        if (NewVideoChannelName != ""){VidResChanName[q].innerHTML = NewVideoChannelName;}
        if (RedirectionLink != ""){VidResChanName[q].href = RedirectionLink;}
        if (RemoveHoverCard){VidResChanName[q].className = "";}
    }
    
    for (g = 0; g <  MiscTitles.length; g++){
        if (NewTitle != ""){MiscTitles[g].innerHTML = NewTitle;}
        if (RedirectionLink != ""){MiscTitles[g].href = RedirectionLink;}
         if (NewTitle != ""){MiscTitles[g].title = NewTitle;}  
    }
    
    for (t = 0; t <  MiscChanNames.length; t++){
        if (NewVideoChannelName != ""){MiscChanNames[t].innerHTML = NewVideoChannelName;}
        if (RedirectionLink != ""){MiscChanNames[t].href = RedirectionLink;} 
        if (RemoveHoverCard){MiscChanNames[t].className = "";}
    }
    
    ChanBanner.style.backgroundImage = "url("+RedirectionLink+")";
    ChanBanner.style.backgroundSize = "50%";
    ChanBanner.style.backgroundPosition = "center -250px";
}


function checkLogin(){
    if (WorkOnlyOnLoginName != ""){
        var channelName = document.getElementsByClassName(LoginNameCheckClassName)[0].innerHTML;
        if (channelName.toLowerCase() == WorkOnlyOnLoginName.toLowerCase()){
            window.setInterval(prank, Interval);
            if (ShowPrankMessage){GM_notification(ShowPrankMessage_Text,ShowPrankMessage_Title, ShowPrankMessage_IconURL);}
            if (RedirectionLink != "" && AutoRedirectVideoURL){
        if (window.location.href.indexOf("youtube") > -1 && window.location.href.indexOf("watch?v=") > -1){window.location.href = RedirectionLink;}
        }
        }
    }else{
        window.setInterval(prank, Interval);
        if (ShowPrankMessage){GM_notification(ShowPrankMessage_Text,ShowPrankMessage_Title, ShowPrankMessage_IconURL);}
        if (RedirectionLink != "" && AutoRedirectVideoURL){
        if (window.location.href.indexOf("youtube") > -1 && window.location.href.indexOf("watch?v=") > -1){window.location.href = RedirectionLink;}
        }
    }
}

if (RUN_SCRIPT_TOGGLE){
window.setTimeout(checkLogin, InitalDelay * 1000);
}
