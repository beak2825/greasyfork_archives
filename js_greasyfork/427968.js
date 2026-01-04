// ==UserScript==
// @name        autoTweet
// @namespace   Twitter
// @include    https://twitter.com/home
// @include    https://twitter.com/home#monkey
// @include    https://twitter.com/intent/tweet*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @version     1
// @run-at document-end
// @grant       none
// @description Twitter Spam bot
// @downloadURL https://update.greasyfork.org/scripts/427968/autoTweet.user.js
// @updateURL https://update.greasyfork.org/scripts/427968/autoTweet.meta.js
// ==/UserScript==

var users 						= new Array();
var usersSubscribed 		= new Array();

var getUsersSwitch 		= 0;
var followUsersSwitch = 0;
var subscribe = 0;

//put your spam here or whatever code you wanna edit
var spamText = " " 

function randomText(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

if( window.location.href == "https://twitter.com/home" ){
  window.open('', '_self', '');
  window.close();
}

$(document).ready(function a(){

  if (window.location.href.indexOf("https://twitter.com/intent/tweet") > -1) {
      
    	$('[data-testid="tweetButton"]').click();
    	var cnt = 0;
    	setInterval( function a(){
        	if( cnt > 2 ){
          //window.open('', '_self', '');
          window.close();
          }
        cnt++;

   	 }, 1000);
    	
	}else if( window.location.href.indexOf("https://twitter.com/home#monkey") > -1) {
         
    //for some reason it needs to pause to wait for windows to close
    var windowsOpened = 0;
    setInterval( function a(){
     //alert(3);
      if( getUsersSwitch ){
         if( windowsOpened < 10 ){
            var completeText = spamText + ' ' + randomText( 5 );
            chldWnd = window.open("https://twitter.com/intent/tweet?url=" + completeText );//"&via="
            windowsOpened++;
         }else{
            windowsOpened++;
           if( windowsOpened > 15 ){
             windowsOpened = 0;
           }
         }
      }
			
    }, 1000);

    //var completeText = spamText + ' ' + randomText( 5 );
    //window.open("https://twitter.com/intent/tweet?url=" + completeText );//"&via="

	}else{
    	location.reload();
  	 setInterval( function a(){
     //	window.open('', '_self', '');
  		window.close();

    }, 2000);
  	
  }
});
  

$("body").append("<div id='ControlPanel'>auto Tik Tok Controls</dib>");
$("#ControlPanel").css("position","fixed");
$("#ControlPanel").css("top","100px");
$("#ControlPanel").css("right","100px");
$("#ControlPanel").css("background","grey");

$("#ControlPanel").append("<div id='getUsersDiv'>AutoTweet:</div>");
$("#getUsersDiv").append("<button  type='button' id='getUsersButton'>Off</button>");



	$("#getUsersButton" ).click(function a() {
		if( getUsersSwitch == 0 ){
      getUsersSwitch = 1;
      $("#getUsersButton").text("On");
    }else{
      getUsersSwitch = 0;
      $("#getUsersButton").text("Off");
    }
		
	});



$("#ControlPanel").append("<div id='subscribeToUsersDiv'>Subscribe to Users:</div>");
$("#subscribeToUsersDiv").append("<button  type='button' id='followUsersButton'>Off</button>");



	$("#followUsersButton" ).click(function a() {
		if( followUsersSwitch == 0 ){
      followUsersSwitch = 1;
      $("#followUsersButton").text("On");
    }else{
      followUsersSwitch = 0;
      $("#followUsersButton").text("Off");
    }
		
	});

