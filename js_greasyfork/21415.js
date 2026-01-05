// ==UserScript==
// @name        Multi Offline Panda Scan
// @namespace   DCI
// @version     0.11
// @description scans
// @author      DCI
// @match       https://dl.dropboxusercontent.com/u/353548/Test%20Pages/ajmal.html
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/21415/Multi%20Offline%20Panda%20Scan.user.js
// @updateURL https://update.greasyfork.org/scripts/21415/Multi%20Offline%20Panda%20Scan.meta.js
// ==/UserScript==

ScanDelay = 0.3

document.body.style.backgroundColor = "red";

setTimeout(function(){scanner1()},0000);

function scanner1(){
	groupId = "323KIQYDLQ77D5RGXU0PW7M41I3C4S";
    requester = "Procore";
	
  if (document.body.style.backgroundColor === "red"){
      document.body.style.backgroundColor = "white";
    } else {
        document.body.style.backgroundColor = "red";
    };

  GM_xmlhttpRequest({
  method: "GET",
  url: "https://www.mturk.com/mturk/preview?groupId=" + groupId,
  onload: function(response) {
      if (response.responseText.indexOf('There are no more available') !== -1 || response.responseText.indexOf('There are no HITs') !== -1){
          document.title = requester;
          setTimeout(function(){scanner2();},1000 * ScanDelay);
      } else if (response.responseText.indexOf('You have exceeded') !== -1){
           alert('PRE');
      } else if (response.responseText.indexOf('Want to work on this HIT') !== -1){
          document.title = "https://www.mturk.com/mturk/previewandaccept?groupId=" + groupId + "&prevRequester=thclosers";
          setTimeout(function(){scanner2()},3000);
      } else if (response.responseText.indexOf('browse HITs available to you') !== -1){
          document.title = "https://www.mturk.com/mturk/previewandaccept?groupId=" + groupId + "&prevRequester=thclosers";
          setTimeout(function(){scanner2()},3000);
      }              
       else{setTimeout(function(){scanner2()},3000);}
  }
});
}

function scanner2(){
	groupId = "3EGCY5R6XY0PS57S4R2H1KZW7LSAYC";
	requester = "MyLikes";
    
  if (document.body.style.backgroundColor === "red"){
      document.body.style.backgroundColor = "white";
    } else {
        document.body.style.backgroundColor = "red";
    };

  GM_xmlhttpRequest({
  method: "GET",
  url: "https://www.mturk.com/mturk/preview?groupId=" + groupId,
  onload: function(response) {
      if (response.responseText.indexOf('There are no more available') !== -1 || response.responseText.indexOf('There are no HITs') !== -1){
          document.title = requester;
          setTimeout(function(){scanner1();},1000 * ScanDelay);
      } else if (response.responseText.indexOf('You have exceeded') !== -1){
           alert('PRE');
      } else if (response.responseText.indexOf('Want to work on this HIT') !== -1){
          document.title = "https://www.mturk.com/mturk/previewandaccept?groupId=" + groupId + "&prevRequester=thclosers";
          setTimeout(function(){scanner1()},3000);
      } else if (response.responseText.indexOf('browse HITs available to you') !== -1){
          document.title = "https://www.mturk.com/mturk/previewandaccept?groupId=" + groupId + "&prevRequester=thclosers";
          setTimeout(function(){scanner1()},3000);
      }              
       else{setTimeout(function(){scanner1()},3000);}
  }
});
}
    
/*
SetTimer, HitScan, 0100 

HitScan:

{

SetTitleMatchMode, 2

IfWinExist, previewandaccept

{

SetTitleMatchMode, 2

WinGetTitle, Plink, previewandaccept

StringTrimRight, mod, Plink, 16

mod2 = %mod%&isPreviousIFrame=true&prevRequester=thclosers

;StringTrimLeft, mod3, mod2, 4

run palemoon.exe %mod2%,,hide

sleep 100

MouseGetPos,,, WinUMID
WinActivate, ahk_id %WinUMID%

sleep 10000

}

IfWinExist, A9isup

{

run palemoon.exe https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&searchWords=A9`%20validate&minReward=0.00&qualifiedFor=on&x=7&y=11,,hide

sleep 10000

}

IfWinExist, OpendoorIsUp

{

WinActivate, #shaddap

sleep 100

sendinput DCI Batch Spawning Sequence Initiated: Summoning Opendoor
sendinput {Enter}

sleep 500

run palemoon.exe https://www.mturk.com/mturk/previewandaccept?groupId=3RO2E92DZV28M4NX3D3A2S7WXZN4DK&prevRequester=thtabs,,hide

pause

}

}

return

esc::
pause
return
*/    
    
