// ==UserScript==
// @name        WWT - Shoutbox Smileys
// @namespace   Keka_Umans
// @description Adds customizable smileys to WWT shoutbox
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @include     *worldwidetorrents.eu/index.php
// @version     2.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24401/WWT%20-%20Shoutbox%20Smileys.user.js
// @updateURL https://update.greasyfork.org/scripts/24401/WWT%20-%20Shoutbox%20Smileys.meta.js
// ==/UserScript==
var Csmileys = ''; // leave this as is
/************************/
// Customizable Settings
/************************/
// hide WWT .gif banner in notice section
var showBanner = 'yes'; // yes shows banner/no hides it !NO CAPS!  default is yes
// show account/message links in shout header
// allows for tools to be added to shout bar
var accInfo = 'yes'; // yes=On/no=Off !NO CAPS!  default is On
// Icon color (if accInfo is set to yes)
// This controls the color of the icons in shout bar
var icoColor = '#FFF'; // hex code of any color you like   default is White
// New message color (if accInfo is set to yes)
// This controls the color of the new message indicator in shout bar
var msgColor = '#FFF'; // hex code of any color you like   default is White
// Defealt text color and bold for colorize/autocolorize button
var bbColor = '#000'; // hex code of any color you like   default is Black
var isBold = 'no'; // yes posts bold/no does not !NO CAPS!  default is no
// Smiley Set Switches
// All switches are 1=On 0=Off
var KS = 1; // Show KAT Smileys
var WS = 1; // Show WWT Smileys
var ES = 1; // Show Extra Smileys
var HS = 1; // Show Holiday Smileys

/************************/
// this is where you can
// add your own custom images
// use the template below - just fill in and uncomment (remove // from the line)
// copy/paste as needed
/************************/
// Csmileys += '    <img title="NAME" class="cusSmile" alt="NAME" src="https://URL.gif" />';



////////////////// DO NOT EDIT BELOW THIS LINE EXCEPT TO REMOVE A SMILEY /////////////////
var smileys = ''; // leave this as is
// KAT Smileys
if(KS==1){
  smileys += '    <img title="Biggrin" class="cusSmile" alt="biggrin" src="https://i.imgur.com/yrmrqBr.gif" />';
  smileys += '    <img title="Cry" class="cusSmile" alt="cry" src="https://i.imgur.com/31QyqdW.gif" />';
  smileys += '    <img title="Dizzy" class="cusSmile" alt="dizzy" src="https://i.imgur.com/Dab19mK.gif" />';
  smileys += '    <img title="Funk" class="cusSmile" alt="funk" src="https://i.imgur.com/OelvgkH.gif" />';
  smileys += '    <img title="Huffy" class="cusSmile" alt="huffy" src="https://i.imgur.com/e1xCAZp.gif" />';
  smileys += '    <img title="LOL" class="cusSmile" alt="lol" src="https://i.imgur.com/Y2IB7c1.gif" />';
  smileys += '    <img title="Lovliness" class="cusSmile" alt="lovliness" src="https://i.imgur.com/OUzdHNF.gif" />';
  smileys += '    <img title="Mad" class="cusSmile" alt="mad" src="https://i.imgur.com/zZuLIGb.gif" />';
  smileys += '    <img title="Sad" class="cusSmile" alt="sad" src="https://i.imgur.com/xarqUB1.gif" />';
  smileys += '    <img title="Shocked" class="cusSmile" alt="shocked" src="https://i.imgur.com/qi4A3nr.gif" />';
  smileys += '    <img title="Shy" class="cusSmile" alt="shy" src="https://i.imgur.com/xFFGTfU.gif" />';
  smileys += '    <img title="Sleepy" class="cusSmile" alt="sleepy" src="https://i.imgur.com/16gZbHY.gif" />';
  smileys += '    <img title="Smile" class="cusSmile" alt="smile" src="https://i.imgur.com/jDCmN5k.gif" />';
  smileys += '    <img title="Sweat" class="cusSmile" alt="sweat" src="https://i.imgur.com/gOXCcif.gif" />';
  smileys += '    <img title="Titter" class="cusSmile" alt="titter" src="https://i.imgur.com/3mUNmP8.gif" />';
  smileys += '    <img title="Tongue" class="cusSmile" alt="tongue" src="https://i.imgur.com/Au91JBC.gif" />';
  smileys += '    <img title="Pirate" class="cusSmile" alt="pirate" src="https://i.imgur.com/c0gTgBS.gif" />';
  smileys += '    <img title="Boo" class="cusSmile" alt="boo" src="https://i.imgur.com/Rl6QHXw.gif" />';
  smileys += '    <img title="Wink" class="cusSmile" alt="wink" src="https://i.imgur.com/ZoWgkuV.gif" />';
  smileys += '    <img title="Dull" class="cusSmile" alt="dull" src="https://i.imgur.com/5T7B0wl.gif" />';
  smileys += '    <img title="Chuckle" class="cusSmile" alt="chuckle" src="https://i.imgur.com/UQxpJbL.gif" />';
  smileys += '    <img title="Clap" class="cusSmile" alt="clap" src="https://i.imgur.com/vBzTQec.gif" />';
  smileys += '    <img title="Drunk" class="cusSmile" alt="drunk" src="https://i.imgur.com/6amPLB3.gif" />';
  smileys += '    <img title="Finger" class="cusSmile" alt="finger" src="https://i.imgur.com/Zcq1str.gif" />';
  smileys += '    <img title="Inlove" class="cusSmile" alt="inlove" src="https://i.imgur.com/DjKkEX7.gif" />';
  smileys += '    <img title="Nerd" class="cusSmile" alt="nerd" src="https://i.imgur.com/gu5gvMk.gif" />';
  smileys += '    <img title="No" class="cusSmile" alt="no" src="https://i.imgur.com/VKctnGI.gif" />';
  smileys += '    <img title="ROFL" class="cusSmile" alt="rofl" src="https://i.imgur.com/BRNDUiY.gif" />';
  smileys += '    <img title="Lipssealed" class="cusSmile" alt="lipssealed" src="https://i.imgur.com/S29lZ3e.gif" />';
  smileys += '    <img title="Smirk" class="cusSmile" alt="smirk" src="https://i.imgur.com/8Bzq4I8.gif" />';
  smileys += '    <img title="Think" class="cusSmile" alt="think" src="https://i.imgur.com/fLaLJRx.gif" />';
  smileys += '    <img title="Yes" class="cusSmile" alt="yes" src="https://i.imgur.com/1Mge3YI.gif" />';
  smileys += '    <img title="Wait" class="cusSmile" alt="wait" src="https://i.imgur.com/tkKjFsA.gif" />';
  smileys += '    <img title="Wave" class="cusSmile" alt="wave" src="https://i.imgur.com/vHrmADf.gif" />';
  smileys += '    <img title="Cool" class="cusSmile" alt="cool" src="https://i.imgur.com/bFSKaxa.gif" />';
  smileys += '    <img title="Evil" class="cusSmile" alt="evil" src="https://i.imgur.com/zX9yKQn.gif" />';
  smileys += '    <img title="Punch" class="cusSmile" alt="punch" src="https://i.imgur.com/jcSMOIz.gif" />';
  smileys += '    <img title="DOH!" class="cusSmile" alt="doh" src="https://i.imgur.com/LQqhK7F.gif" />';
  smileys += '    <img title="Yawn" class="cusSmile" alt="yawn" src="https://i.imgur.com/EItEozy.gif" />';
  smileys += '    <img title="TMI" class="cusSmile" alt="tmi" src="https://i.imgur.com/UHp9eQR.gif" />';
  smileys += '    <img title="Fubar" class="cusSmile" alt="fubar" src="https://i.imgur.com/2S7ahGT.gif" />';
  smileys += '    <img title="Rock" class="cusSmile" alt="rock" src="https://i.imgur.com/jNciQTr.gif" />';
  smileys += '    <img title="Bandit" class="cusSmile" alt="bandit" src="https://i.imgur.com/GS4Lctd.gif" />';
  smileys += '    <img title="Swear" class="cusSmile" alt="swear" src="https://i.imgur.com/Qef0xw8.gif" />';
  smileys += '    <img title="Facepalm" class="cusSmile" alt="facepalm" src="https://i.imgur.com/ky63riP.gif" />';
  smileys += '    <img title="Thumbup" class="cusSmile" alt="thumbup" src="https://i.imgur.com/xxtKctj.gif" />';
  smileys += '    <img title="Thumbdown" class="cusSmile" alt="thumbdown" src="https://i.imgur.com/bkv4kfO.gif" />';
  smileys += '    <img title="HeadWall" class="cusSmile" alt="headwall" src="https://i.imgur.com/QnhNsQD.gif" />';  
}
// WWT Smileys
if(WS==1){
  smileys += '    <img data-code=":brb" title="BRB" class="cusSmile" alt="brb" src="https://i.imgur.com/ZMJORZ3.gif" />';
  smileys += '    <img data-code=":cwl" title="Crying While Laughing" class="cusSmile" alt=":cwl" src="https://i.imgur.com/2oE7Tzm.gif" />';
  smileys += '    <img data-code=":love" title="Heart" class="cusSmile" alt=":love" src="https://i.imgur.com/ebsLKQ5.gif" />';
  smileys += '    <img data-code=":bandit" title="bandit" class="cusSmile" alt="bandit" src="https://i.imgur.com/C0VKxsk.gif" />';
  smileys += '    <img data-code=":brokenheart" title="brokenheart" class="cusSmile" alt="brokenheart" src="https://i.imgur.com/ekBiQPm.gif" />';
  smileys += '    <img data-code=":doh" title="doh" class="cusSmile" alt="doh" src="https://i.imgur.com/lEcKUVS.gif" />';
  smileys += '    <img data-code=":envy" title="envy" class="cusSmile" alt="envy" src="https://i.imgur.com/sQ0rGHJ.gif" />';
  smileys += '    <img data-code=":fubar" title="fubar" class="cusSmile" alt="fubar" src="https://i.imgur.com/l8fFTKB.gif" />';
  smileys += '    <img data-code=":headbang" title="headbang" class="cusSmile" alt="headbang" src="https://i.imgur.com/kpB9Kak.gif" />';
  smileys += '    <img data-code=":lipssealed" title="lipssealed" class="cusSmile" alt="lipssealed" src="https://i.imgur.com/ADpoLy9.gif" />';
  smileys += '    <img data-code=":smile" title="smile" class="cusSmile" alt="smile" src="https://i.imgur.com/Ysi2LMy.gif" />';
  smileys += '    <img data-code=":sad" title="sad" class="cusSmile" alt="sad" src="https://i.imgur.com/RF66uF3.gif" />';
  smileys += '    <img data-code=":wink" title="wink" class="cusSmile" alt="wink" src="https://i.imgur.com/sfnQ7xF.gif" />';
  smileys += '    <img data-code=":tongue" title="tongue" class="cusSmile" alt="tongue" src="https://i.imgur.com/6O58m4l.gif" />';
  smileys += '    <img data-code=":laugh" title="laugh" class="cusSmile" alt="laugh" src="https://i.imgur.com/sdvt3UE.gif" />';
  smileys += '    <img data-code=":dull" title="dull" class="cusSmile" alt="dull" src="https://i.imgur.com/xHzh5z8.gif" />';
  smileys += '    <img data-code=":surprised" title="surprised" class="cusSmile" alt="surprised" src="https://i.imgur.com/lLvTNAx.gif" />';
  smileys += '    <img data-code=":confused" title="confused" class="cusSmile" alt="confused" src="https://i.imgur.com/tR4rnAZ.gif" />';
  smileys += '    <img data-code=":nerd" title="nerd" class="cusSmile" alt="nerd" src="https://i.imgur.com/8vIFuHY.gif" />';
  smileys += '    <img data-code=":smirk" title="smirk" class="cusSmile" alt="smirk" src="https://i.imgur.com/1ogvf3K.gif" />';
  smileys += '    <img data-code=":cool" title="cool" class="cusSmile" alt="cool" src="https://i.imgur.com/fmvFhFU.gif" />';
  smileys += '    <img data-code=":facepalm" title="facepalm" class="cusSmile" alt="facepalm" src="https://i.imgur.com/JaHw9OR.gif" />';
  smileys += '    <img data-code=":cry" title="cry" class="cusSmile" alt="cry" src="https://i.imgur.com/lzb7GJ8.gif" />';
  smileys += '    <img data-code=":kiss" title="kiss" class="cusSmile" alt="kiss" src="https://i.imgur.com/gsi4E1N.gif" />';
  smileys += '    <img data-code=":finger" title="finger" class="cusSmile" alt="finger" src="https://i.imgur.com/dsypZnn.gif" />';
  smileys += '    <img data-code=":evil" title="evil" class="cusSmile" alt="evil" src="https://i.imgur.com/Znb6ePG.gif" />';
  smileys += '    <img data-code=":angry" title="angry" class="cusSmile" alt="angry" src="https://i.imgur.com/s9oymwF.gif" />';
  smileys += '    <img data-code=":inlove" title="inlove" class="cusSmile" alt="inlove" src="https://i.imgur.com/Jhmvtw0.gif" />';
  smileys += '    <img data-code=":blush" title="blush" class="cusSmile" alt="blush" src="https://i.imgur.com/oKA6Jdc.gif" />';
  smileys += '    <img data-code=":clap" title="clap" class="cusSmile" alt="clap" src="https://i.imgur.com/4xWo5SW.gif" />';
  smileys += '    <img data-code=":think" title="think" class="cusSmile" alt="think" src="https://i.imgur.com/9lBXdDC.gif" />';
  smileys += '    <img data-code=":yes" title="yes" class="cusSmile" alt="yes" src="https://i.imgur.com/Q75Tyor.gif" />';
  smileys += '    <img data-code=":no" title="no" class="cusSmile" alt="no" src="https://i.imgur.com/AHb96dA.gif" />';
  smileys += '    <img data-code=":hi" title="hi" class="cusSmile" alt="hi" src="https://i.imgur.com/MrQFrBn.gif" />';
  smileys += '    <img data-code=":drunk" title="drunk" class="cusSmile" alt="drunk" src="https://i.imgur.com/fDQdXt8.gif" />';
  smileys += '    <img data-code=":giggle" title="giggle" class="cusSmile" alt="giggle" src="https://i.imgur.com/sx4M2qz.gif" />';
  smileys += '    <img data-code=":punch" title="punch" class="cusSmile" alt="punch" src="https://i.imgur.com/wTLJTPx.gif" />';
  smileys += '    <img data-code=":wait" title="wait" class="cusSmile" alt="wait" src="https://i.imgur.com/QJXfg4V.gif" />';
  smileys += '    <img data-code=":swear" title="swear" class="cusSmile" alt="swear" src="https://i.imgur.com/3EiyVGe.gif" />';
  smileys += '    <img data-code=":sweat" title="sweat" class="cusSmile" alt="sweat" src="https://i.imgur.com/imxo4Qw.gif" />';
  smileys += '    <img data-code=":tmi" title="tmi" class="cusSmile" alt="tmi" src="https://i.imgur.com/AmHD24F.gif" />';
}
// Extra Smileys
if(ES==1){
  smileys += '    <img title="Smoking" class="cusSmile" alt="smoke" src="https://i.imgur.com/8NM4PSG.gif" />';
  smileys += '    <img title="Devil" class="cusSmile" alt="devil" src="https://i.imgur.com/6O0oZBV.gif" />';
  smileys += '    <img title="Mooning" class="cusSmile" alt="mooning" src="https://i.imgur.com/RP9b7FS.gif" />';
  smileys += '    <img title="Poop" class="cusSmile" alt="poop" src="https://i.imgur.com/az3Ks2S.gif" />';
  smileys += '    <img title="Squirrel" class="cusSmile" alt="squirrel" src="https://i.imgur.com/xCBvpyM.gif" />';
  smileys += '    <img title="Ninja" class="cusSmile" alt="ninja" src="https://i.imgur.com/qAcWv6r.gif" />';
  smileys += '    <img title="Beer" class="cusSmile" alt="beer" src="https://i.imgur.com/oEkVt3Q.gif" />';
  smileys += '    <img title="Drink" class="cusSmile" alt="drink" src="https://i.imgur.com/Ny8qrd5.gif" />';
  smileys += '    <img title="Coffee" class="cusSmile" alt="coffee" src="https://i.imgur.com/VXVdBNW.gif" />';
  smileys += '    <img title="Cake" class="cusSmile" alt="cake" src="https://i.imgur.com/Qe18IlM.gif" />';
  smileys += '    <img title="Pizza" class="cusSmile" alt="pizza" src="https://i.imgur.com/5Lbz27k.gif" />';
  smileys += '    <img title="Rain" class="cusSmile" alt="rain" src="https://i.imgur.com/jcir7SZ.gif" />';
  smileys += '    <img title="Mail" class="cusSmile" alt="mail" src="https://i.imgur.com/u6mnOPE.gif" />';
  smileys += '    <img title="Music" class="cusSmile" alt="music" src="https://i.imgur.com/jE9cvcV.gif" />';
  smileys += '    <img title="Phone" class="cusSmile" alt="phone" src="https://i.imgur.com/uG1L8TY.gif" />';
  smileys += '    <img title="Weed" class="cusSmile" alt="weed" src="https://i.imgur.com/hAKWhAc.gif" />';
}
// Holiday Smileys
if(HS==1){
// Halloween
  smileys += '    <img title="Pumpkin" class="cusSmile" alt="pumpkin" src="https://i.imgur.com/hIebJ9L.gif" />';
  smileys += '    <img title="Ghost" class="cusSmile" alt="ghost" src="https://i.imgur.com/k9hVp65.gif" />';
  smileys += '    <img title="Vampire" class="cusSmile" alt="vampire" src="https://i.imgur.com/HJIvULF.gif" />';
// Christmas
  smileys += '    <img title="Holiday Spirit" class="cusSmile" alt="holiday spirit" src="https://i.imgur.com/iIUWTtG.gif" />';
  smileys += '    <img title="Santa" class="cusSmile" alt="santa" src="https://i.imgur.com/RKEPzpK.gif" />';
  smileys += '    <img title="Xmas Tree" class="cusSmile" alt="xmas tree" src="https://i.imgur.com/y67jIX4.gif" />';
  smileys += '    <img title="Gift" class="cusSmile" alt="gift" src="https://i.imgur.com/uLQdktu.gif" />';
// other
  smileys += '    <img title="Clover" class="cusSmile" alt="clover" src="https://i.imgur.com/kVlnXlC.gif" />';
}
////////////////// DO NOT EDIT BELOW THIS LINE FOR ANY REASON /////////////////
////////////////// IF YOU BREAK THE SCRIPT, IT SUCKS TO BE YOU /////////////////
$(window).load(function(){
  var btnStyle = '2'; // leave this as is
// Main Element classes
  var WWTBanner = $('.myFrame-content > center:nth-child(1) > img:nth-child(1)');
  var userID = $("a[title|='My Account']");
  var shoutHeader = $('#main > center:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > h3:nth-child(7)');
  var shoutInput = $('.shoutbox_messageboxback');
  var shoutMsg = $('.shoutbox_msgbox');
  var shoutSubmit = $('#submit_shout');
  var headerMsg = $("a[title|='Messages']");
////////////////////////
// to hide WWT banner
////////////////////////
  if(showBanner === 'no'){WWTBanner.remove();}
////////////////////////
// Shout Toolbar
////////////////////////
// Adding Account infos
  if(accInfo === 'yes'){
    var uid = userID.attr('href'); // get user ID
    uid = uid.replace('/account-details.php?id=','');
// this is to get message count (needed for live count)
    function gmc() {
      'use strict';
      var msgCount = [];
      $.ajax({
        type: "GET",
// Thanks to PXgamer for the api
        url: "/api/mail/?id="+uid,
        async: false,
        success: function (data) {msgCount = data.unread;},
        error: function (data) {msgCount = 'E';},
        returnData: "json"
      });
      return msgCount;
    }
// get initial message count
    var msgCount = gmc();
      // Defining Buttons
    buttons = '&nbsp;&nbsp;<a class="profile" href="/account-details.php?id='+uid+'"><span style="color:'+icoColor+';" title="Your Account" class="glyphicon glyphicon-user"></span></a>&nbsp;';
    buttons += '<a class="account" href="/account.php"><span style="color:'+icoColor+';" title="Account Settings" class="glyphicon glyphicon-wrench"></span></a>&nbsp;';
    buttons += '<a class="torrents" href="/account.php?action=mytorrents"><span style="color:'+icoColor+';" title="Your Torrents" class="glyphicon glyphicon-download-alt"></span></a>&nbsp;';
    buttons += '<a id="KU-mail" href="/mailbox.php'+((msgCount!=0) ? '?inbox' : '')+'"><span style="color:'+icoColor+';" title="Your Messages" class="glyphicon glyphicon-envelope"></span><sup id="KU-count" style="font-weight:bold;color:'+msgColor+';margin-left:5px;">'+((msgCount!=0) ? '('+msgCount+')' : '')+'</sup></a>';
// Adding the buttons
    shoutHeader.html('<center><span style="float:left;">'+buttons+'</span><span style="position:relative;left:-65px;">Shoutbox</span></center>');
// this will keep the count updated
    function liveCount(){
      var newMsgCount = gmc();
      var mailBox = '/mailbox.php'+((newMsgCount!=0) ? '?inbox' : '')+'';
      headerMsg.find('span').remove(); // remove current span
// update top bar
      headerMsg.prop('href',''+mailBox+'');
      if(newMsgCount!=0){
        headerMsg.find("i").after('<span class="w3-badge w3-right w3-small w3-green">'+newMsgCount+'</span>');
      }
// update shout bar;
      $('#KU-mail').prop('href',''+mailBox+'');
      $('#KU-count').text(''+((newMsgCount!=0) ? '('+newMsgCount+')' : '')+'');
    }
    setInterval(liveCount, 90000); // 90 seconds
  }
////////////////////////
// Add Smileys
////////////////////////
// Adding smiley sets
  shoutInput.after('<tr><td id="cusSmileBox" style="vertical-align:top;">'+smileys+Csmileys+'</td></tr>');
// CSS for smileys
  $('.cusSmile').css({'cursor': 'pointer', 'max-height': '25px'});
////////////////////////
// Buttons
////////////////////////
  if(btnStyle==1){ // add colorize button
    $('#submit_shout').after('&nbsp;<button type="submit" class="w3-btn" style="background-color:'+bbColor+';" id="color_shout">Shout in Color</button>');
  }
  else{ // replace submit + add colorize button
    shoutSubmit.replaceWith('<input id="submit_shout" type="button" onclick="submit_shout();" value="Shout">');
    $('#submit_shout').after('&nbsp;<input style="background-color:'+bbColor+';" id="color_shout" value="Shout in Color" type="button" title="Wraps entire post in predefined color and submits">');
  }
////////////////////////
// BBCode Box
////////////////////////
// Defining Buttons
  var bbButtons = '<td id="BBCBox" colspan="2" style="text-align:center;border: solid #000;border-width: 0px 1px 1px 1px;">';
  bbButtons += '<h3 class="w3-card-4 w3-allerta w3-theme-l1"><center>BBCode Functions</center></h3><br />';
  if(btnStyle==1){ // default page style
    bbButtons += '<button type="submit" class="bbImg w3-btn w3-teal" title="Add an image">IMG</button>&nbsp;';
    bbButtons += '<button type="submit" class="bbUrl w3-btn w3-teal" title="Add a link">URL</button>&nbsp;';
    bbButtons += '<button type="submit" class="bbCol w3-btn" style="background-color:'+bbColor+';" title="Wraps selected text in predefined color">Color</button>&nbsp;';
    bbButtons += '<button type="submit" class="bbBold w3-btn w3-teal" title="Wraps selected text in bold">Bold</button>&nbsp;';
    bbButtons += '<button type="submit" class="bbItal w3-btn w3-teal" title="Wraps selected text in italics">Italic</button>';
  }
  else{ // custom style
    bbButtons += '<input class="bbImg" type="submit" value="IMG" title="Add an image" />&nbsp;';
    bbButtons += '<input class="bbUrl" type="submit" value="URL" title="Add a link" />&nbsp;';
    bbButtons += '<input class="bbCol" style="background-color:'+bbColor+';" type="submit" value="Color" title="Wraps selected text in predefined color" />&nbsp;';
    bbButtons += '<input class="bbBold" type="submit" value="Bold" title="Wraps selected text in bold" />&nbsp;';
    bbButtons += '<input class="bbItal" type="submit" value="Italic" title="Wraps selected text in italics" />';
  }
  bbButtons += '<br /><br /></td>';
  // Adding Buttons
  $('#cusSmileBox').after(bbButtons);

////////////////////////
// Click Events
////////////////////////
// Click for smiley
  $('.cusSmile').click(function(){
    var code = $(this).data('code');
    if(code){code = code;}
    else{code = '[img]'+ $(this).attr('src') +'[/img]';}
    shoutMsg.insertAtCaret(' '+code+'');
  });
// Click for AutoColorize
  $('#color_shout').click(function(){
    var text = shoutMsg.val();
    if(text!==''){
      if(isBold==='yes'){text = '[b]'+text+'[/b]';}
      shoutMsg.val('[color='+bbColor+']'+text+'[/color]');
      submit_shout();
    }
  });
////////////////////////
// fix for ff submits
////////////////////////
  if (navigator.userAgent.search("Firefox") >= 0) {
    shoutInput.keydown(function(e) {
      if(e.keyCode === 13 && !e.shiftKey) { // enter not shift+enter
        e.preventDefault();
        submit_shout();
      }
    });
// Shift+Enter submit
    shoutInput.keydown(function(e) {
      if(e.keyCode === 13 && e.shiftKey) {
        e.preventDefault();
        $('#color_shout').click();
      }
    });
  }
////////////////////////
// BBCode clicks
////////////////////////
// Click for IMG
  $('.bbImg').click(function(){
    r=prompt('PLEASE_ENTER_THE_FULL_URL_FOR_YOUR_IMAGE\n\rONLY .png, .jpg, .gif images');
    if(r!==null && r!==''){shoutMsg.insertAtCaret('[img]'+r+'[/img]');}
  });
// Click for URL
  $('.bbUrl').click(function(){
    l=prompt('PLEASE_ENTER_THE_FULL_URL');
    if(l!==null && l!==''){
      t=prompt('PLEASE_ENTER_THE_TITLE');
      if(t===null || t===''){shoutMsg.insertAtCaret('[url]'+l+'[/url]');}
      else{shoutMsg.insertAtCaret('[url='+l+']'+t+'[/url]');}
    }
  });
// Click for Color
  $('.bbCol').click(function(){
    var text = hasText();
    if(text!==null && text!==''){shoutMsg.insertAtCaret('[color='+bbColor+']'+text+'[/color]');}
  });
// Click for Bold
  $('.bbBold').click(function(){
    var text = hasText();
    if(text!==null && text!==''){shoutMsg.insertAtCaret('[b]'+text+'[/b]');}
  });
// Click for Italics
  $('.bbItal').click(function(){
    var text = hasText();
    if(text!==null && text!==''){shoutMsg.insertAtCaret('[i]'+text+'[/i]');}
  });
////////////////////////
// Insert Function
////////////////////////
  jQuery.fn.extend({
    insertAtCaret: function(myValue){
      return this.each(function(i) {
        if (document.selection) {
          //For browsers like Internet Explorer
          this.focus();
          var sel = document.selection.createRange();
          sel.text = myValue;
        }
        else if (this.selectionStart || this.selectionStart == '0') {
          //For browsers like Firefox and Webkit based
          var startPos = this.selectionStart;
          var endPos = this.selectionEnd;
          //var scrollTop = this.scrollTop;
          this.value = this.value.substring(0, startPos)+myValue+this.value.substring(endPos,this.value.length);
          this.focus();
          this.selectionStart = startPos + myValue.length;
          this.selectionEnd = startPos + myValue.length;
          //this.scrollTop = scrollTop;
        }
        else {
          this.value += myValue;
          this.focus();
        }
      });
    }
  });
}); // all done

// needed for getting selected text

function getSelectedText(){
  var textComponent = document.getElementById("shout_message");
  var startPos = textComponent.selectionStart;
  var endPos = textComponent.selectionEnd;
  return textComponent.value.substring(startPos, endPos);
}
// for prompt if no selected text
function hasText(){
  var text = getSelectedText();
  if(text === ''){text = prompt('PLEASE_ENTER_TEXT');}
  return text;
}