// ==UserScript==
// @name         Leap Motion Controller Support
// @namespace    https://levelkro.com
// @version      0.46.1
// @description  Control web page with your Leap Motion Controller
// @author       levelKro (https://levelkro.com)
// @include      http://*/*
// @include      https://*/*
// @exclude      *github.*
// @exclude      *yahoo.*
// @exclude      *asus.*
// @noframes
// @run-at document-idle
// @grant window.close
// @grant window.focus
// @connect self
// @connect localhost
// @connect 127.0.0.1
// @license      MIT
// @copyright 2018, levelKro (https://levelkro.com) (https://openuserjs.org/users/levelKro)
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/389624/Leap%20Motion%20Controller%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/389624/Leap%20Motion%20Controller%20Support.meta.js
// ==/UserScript==

/*

Leap Motion Controller Support

Source from;
- JSonViewer in Leap Motion SDK 4.0.0

Modified by;
- Mathieu <levelKro> Légaré <levelkro@yahoo.ca>

Excluded sites
- Please read https://www.reddit.com/r/mturk/comments/ao3mkf/limited_runtime_host_permissions_might_break_some/

Know issues
- GitHub and Yahoo have a content policy and block script.
- Tou.tv scrolling freeze

Uses
- Hand grab
  - Move : Scrolling page (open hand and close it for reset center of move)
  - Open (5 fingers) : reset hold time
- 2,3 or 4 fingers (open hand and keep fingers you want open for enable center of move)
  - move left : back in history
  - move right : next in history
  - move up : go to top of page
  - move down : refresh page
  - move up-left :
  - move up-right :
  - move down-left :
  - move down-right :

Version History
0.46
 - Added 4 actions (up+left/up+right/down+left/down+right)
 - Minors design fix
 - Fix hands reports
 - Clean codes
 - First real stable release

*/
// Customs variables
var LMDebug=false;// Enable debug messages (warning; slow motion)
var LMScrollY=5;// Scroll jump effect (horizontal)
var LMScrollX=1;// Scroll jump effect (vertical)
var LMHold=150;// Holding time in ms for repeat/other command
// Static variables, don't touch
var handCount=0;
var handLeft=false;
var handRight=false;
var handLeftGrab=false;
var handRightGrab=false;
var handLeftHeight=0;
var handRightHeight=0;
var handLeftWidth=0;
var handRightWidth=0;
var scrollStartY=0;
var scrollStartX=0;
var handLeftStartY=0;
var handRightStartY=0;
var handLeftStartX=0;
var handRightStartX=0;
var fingersCount=0;
var fingersInc=0;
var fingersStartX=0;
var fingersStartY=0;
var fingersHeight=0;
var fingersWidth=0;
var fingersWait=LMHold;
var LMws;
var focusListener;
var blurListener;
var LMtimeout;
var drawUse='<div class="LMindicator Use">&nsbp;</div>';
var drawOk='<div class="LMindicator Ok">&nsbp;</div>';
var drawWarn='<div class="LMindicator Warn">&nsbp;</div>';
var drawError='<div class="LMindicator Error">&nsbp;</div>';
var toInput = '<style>';
toInput+=' .LMindicator {line-height:0 !important;font-size:1px !important;border-radius:4px !important;border:1px solid #666 !important;overflow:hidden !important;width:8px !important;height:8px !important;display:inline-block !important;}';
toInput+=' .LMindicator.Ok {background-color:#6ce20b !important;} .LMindicator.Warn {background-color:#eded10 !important;} .LMindicator.Use {background-color:#24a2e5 !important;} .LMindicator.Error {background-color:#ef1c46 !important;}';
toInput+=' .LMwidget {cursor:not-allowed !important;position:fixed !important;top:0 !important;left:0 !important;border:none !important;border-radius:0 0 5px 0 !important; padding:3px 5px !important; float:left !important; display:inline-block !important; z-index:9999 !important; background-color:#333 !important;box-shadow:1px 1px 15px #333 !important; font-size:12px !important; font-family:Arial !important; color:#eee !important; line-height:0.8 !important;}';
toInput+=' .LMhand {font-size:12px !important; font-family:Arial !important; color:#ddd !important;} .LMhand sup {font-size:8px !important;vertical-align: super !important;position:inherit !important;}';
toInput+=' .LMlogo {background-color:#333 !important;font-family:Arial !important; color:#eee !important;} .LMlogo span {color:#d8ea64 !important;}';
toInput+=' .LMsep {color:#666 !important;text-shadow:1px 1px 15px #333 !important;line-height: 0 !important;font-size: 13px !important;margin: -2px 0 !important;padding: 0 !important;} .LMdebug {font-size:12px !important;color:#222 !important; display:block !important; min-width:250px; min-height:300px; max-height:650px; padding:5px !important; background-color:#fff !important; border:1px solid #000;overflow:auto;}';
toInput+='</style>';
toInput+='<div class="LMwidget" title="Leap Motion Controller : Activities monitor">';
toInput+='<span class="LMlogo">Leap <span>Motion</span> </span><span id="LMState">'+drawWarn+'</span> ';
toInput+='<b class="LMsep"> | </b>';
toInput+='<span class="LMhand"> left <span id="LMStateLeft">'+drawError+'</span></span>';
toInput+='<span class="LMhand"> right <span id="LMStateRight">'+drawError+'</span></span>';
toInput+='<span class="LMhand"> fingers <span id="LMStateFingers">'+drawError+'<sup>0</sup></span></span>';
if(LMDebug) toInput+='<div id="LMMain" style="visibility:hidden;">Output:<div id="LMJSon" class="LMdebug"></div></div>';
toInput+='</div>';
// Support both the WebSocket and MozWebSocket objects
if ((typeof(WebSocket) == 'undefined') &&
    (typeof(MozWebSocket) != 'undefined')) {
    WebSocket = MozWebSocket;
}
(function(){startLM();})(); // Run baby, RUN!
function startLM(){
    console.log("[LM] Leap Motion Controller Support loaded");
    if(window.self !== window.top){
        // Is framed, or not at the top, stop script
        if(LMDebug) console.log("[LM] Frame detected, stop execution.");
        LMws.close();
        LMws = null;
        if(LMDebug) console.log("[LM] Turn off plugin");
        window.removeEventListener("focus", focusListener);
        window.removeEventListener("blur", blurListener);
        return;
    }
    else{
        console.log("[LM] Starting ...");
        var newHTML = document.createElement ('div');
        newHTML.innerHTML = toInput;
        document.body.appendChild (newHTML);
        document.getElementById("LMStateLeft").innerHTML=drawError;
        document.getElementById("LMStateRight").innerHTML=drawError;
        document.getElementById("LMStateFingers").innerHTML=drawError+"<sup>0</sup>";
        // Create the socket with event handlers
        // Create and open the socket
        if(LMDebug) console.log("[LM] Connecting to Leap Motion Web Socket Service");
        LMws = new WebSocket("ws://localhost:6437/v7.json");
        // On successful connection
        LMws.onopen = function(event) {
            document.getElementById("LMState").innerHTML=drawWarn;
            LMws.send(JSON.stringify({focused: true})); // claim focus
            focusListener = window.addEventListener('focus', function(e) {
                               LMws.send(JSON.stringify({focused: true})); // claim focus
                         });
            blurListener = window.addEventListener('blur', function(e) {
                              LMws.send(JSON.stringify({focused: false})); // relinquish focus
                         });
            if(LMDebug) document.getElementById("LMMain").style.visibility = "visible";
            if(LMDebug) console.log("[LM] Connected to Leap Motion Web Socket Service");
            console.log("[LM] Connected to device");
        };
        // On message received
        LMws.onmessage = function(event) {
            var obj = JSON.parse(event.data);
			if(LMDebug) var str = JSON.stringify(obj, undefined, 2);
            if(obj.hasOwnProperty("hands")){
                // Hands count detection
                if (obj["hands"].length==2){
                    if(handCount!=2) {
                        document.getElementById("LMStateLeft").innerHTML=drawOk;
                        document.getElementById("LMStateRight").innerHTML=drawOk;
                        document.getElementById("LMStateFingers").innerHTML=drawWarn+"<sup>"+fingersCount+"</sup>";
                        handCount=2;
                    }
                } else if (obj["hands"].length==1){
                    if(handCount!=1) {
                        if(handLeft) document.getElementById("LMStateLeft").innerHTML=drawOk;
                        else document.getElementById("LMStateLeft").innerHTML=drawError;
                        if(handRight) document.getElementById("LMStateRight").innerHTML=drawOk;
                        else document.getElementById("LMStateRight").innerHTML=drawError;
                        document.getElementById("LMStateFingers").innerHTML=drawWarn+"<sup>"+fingersCount+"</sup>";
                        handCount=1;
                    }
                }
                else {
                    if(handCount!=0) {
                        handCount=0;
                        fingersCount=0;
                        handLeft=false;
                        handRight=false;
                        document.getElementById("LMStateLeft").innerHTML=drawError;
                        document.getElementById("LMStateRight").innerHTML=drawError;
                        document.getElementById("LMStateFingers").innerHTML=drawError+"<sup>0</sup>";
                    }
                }

                // Hands Grips detection
                if(handCount>=1) {
                    handLeft=false;
                    handRight=false;
                    obj["hands"].forEach(function(hand) {
                        if(hand["type"]=="left") {
                            document.getElementById("LMStateLeft").innerHTML=drawOk;
                            handLeft=true;
                            if(hand["grabStrength"]>=0.8 && !handLeftGrab) {
                                handLeftGrab=true;
                                handLeftStartY=hand["palmPosition"][1];
                                handLeftStartX=hand["palmPosition"][0];
                                scrollStartY=window.scrollY;
                                scrollStartX=window.scrollX;
                            }
                            else if(hand["grabStrength"]<=0.8 && handLeftGrab) {
                                handLeftGrab=false;
                            }
                            handLeftHeight=hand["palmPosition"][1];
                            handLeftWidth=hand["palmPosition"][0];
                        }
                        else if(hand["type"]=="right") {
                            document.getElementById("LMStateRight").innerHTML=drawOk;
                            handRight=true;
                            if(hand["grabStrength"]>=0.8 && !handRightGrab) {
                                handRightGrab=true;
                                handRightStartY=hand["palmPosition"][1];
                                handRightStartX=hand["palmPosition"][0];
                                scrollStartY=window.scrollY;
                                scrollStartX=window.scrollX;
                            }
                            else if(hand["grabStrength"]<=0.8 && handRightGrab) {
                                handRightGrab=false;
                            }
                            handRightHeight=hand["palmPosition"][1];
                            handRightWidth=hand["palmPosition"][0];
                        }
                    });
                    fingersInc=0;
                    obj["pointables"].forEach(function(finger) {
                        if(finger['extended']==true) fingersInc++;
                    });
                    var finger = obj["pointables"][0];
                    if(fingersCount!=fingersInc) {
                        fingersCount=fingersInc;
                        fingersStartX=finger["dipPosition"][0];
                        fingersStartY=finger["dipPosition"][1];
                        if(fingersInc==5) {
                            fingersWait=LMHold;
                            document.getElementById("LMStateFingers").innerHTML=drawUse+"<sup>"+fingersInc+"</sup>";
                        }
                    }
                    fingersWidth=finger["dipPosition"][0];
                    fingersHeight=finger["dipPosition"][1];

                }
                else {
                    handLeftGrab=false;
                    handRightGrab=false;
                    handLeft=false;
                    handRight=false;
                    fingersCount=0;
                }
                if (!document.hidden) {
                    // Hands actions
                    if(handCount==2){
                    }
                    else if(handLeft){
                        // Left hand actions
                        if(handLeftGrab){
                            // Scrolling page
                            var LYscroll=Math.floor(-1*LMScrollY)*Math.floor(handLeftStartY - handLeftHeight);
                            var LYnewScroll=Math.floor(scrollStartY + LYscroll);
                            var LXscroll=LMScrollX*Math.floor(handLeftStartX - handLeftWidth);
                            var LXnewScroll=Math.floor(scrollStartX + LXscroll);
                            if(LXnewScroll<=0) LXnewScroll=0;
                            if(LYnewScroll<=0) LYnewScroll=0;
                            window.scrollTo(LXnewScroll, LYnewScroll);
                            document.getElementById("LMStateLeft").innerHTML=drawUse;
                        }
                    }
                    else if(handRight){
                        // Right hand actions
                        if(handRightGrab){
                            // Scrolling page
                            var RYscroll=Math.floor(-1*LMScrollY)*Math.floor(handRightStartY - handRightHeight);
                            var RYnewScroll=Math.floor(scrollStartY + RYscroll);
                            var RXscroll=LMScrollX*Math.floor(handRightStartX - handRightWidth);
                            var RXnewScroll=Math.floor(scrollStartX + RXscroll);
                            if(RXnewScroll<=0) RXnewScroll=0;
                            if(RYnewScroll<=0) RYnewScroll=0;
                            window.scrollTo(RXnewScroll, RYnewScroll);
                            document.getElementById("LMStateRight").innerHTML=drawUse;
                        }
                    }
                   if(fingersCount>=1){
                        // Fingers actions
                        document.getElementById("LMStateFingers").innerHTML=drawOk+"<sup>"+fingersCount+"</sup>";
                        if(fingersCount<=4 && fingersCount>=2){
                            fingersWait--; // Security wait for "flood"
                            // Action by move position
                            document.getElementById("LMStateFingers").innerHTML=drawUse+"<sup>"+fingersCount+"</sup>";
                            if(fingersWait<=0){
                                fingersWait=1;
                                var FYmove=Math.floor(fingersStartY - fingersHeight);
                                var FXmove=Math.floor(fingersStartX - fingersWidth);
                                if(FYmove<=-100 && FXmove>=50) {
                                    return; // Up+Left :
                                }
                                else if(FYmove<=-100 && FXmove<=-50) {
                                    fingersWait=LMHold;
                                    return; // Up+Right :
                                }
                                else if(FYmove>=100 && FXmove>=50) {
                                    fingersWait=LMHold;
                                    return; // Down+Left :
                                }
                                else if(FYmove>=100 && FXmove<=-50) {
                                    fingersWait=LMHold;
                                    return; //Down+Right :
                                }
                                else if(FYmove<=-100) {
                                    window.scrollTo(0, 0); // Up : Go to top
                                    fingersWait=LMHold;
                                }
                                else if(FYmove>=100) {
                                    window.location.reload(); // Down : Refresh action
                                    fingersWait=LMHold;
                                }
                                else if(FXmove>=50) {
                                    window.history.go(-1); // Left : Back
                                    fingersWait=LMHold;
                                }
                                else if(FXmove<=-50) {
                                    window.history.go(+1); // Right: Next
                                    fingersWait=LMHold;
                                }
                            }
                        }
                    }
                    else {
                        // No fingers found
                        document.getElementById("LMStateFingers").innerHTML=drawError+"<sup>0</sup>";
                        fingersWait=LMHold;
                        fingersCount=0;
                    }
                }
            }
            if(obj.hasOwnProperty("timestamp")){
                if(handCount>=1) document.getElementById("LMState").innerHTML=drawUse;
                else if(obj.hasOwnProperty("hands")) document.getElementById("LMState").innerHTML=drawOk;
                else document.getElementById("LMState").innerHTML=drawWarn;
                if(LMDebug) document.getElementById("LMJSon").innerHTML = '<pre>' + str + '</pre>';
            }
            else if(obj.hasOwnProperty("serviceVersion")){
                document.getElementById("LMState").innerHTML=drawOk;
                if(LMDebug) console.log("[LM] Using Leap Motion software version : "+obj["serviceVersion"]+" with Web Socket Service version : "+obj["version"]);
            }
            else if(obj.hasOwnProperty("event")){
                document.getElementById("LMState").innerHTML=drawOk;
                if(!obj['event']['state']['streaming']) {
                    document.getElementById("LMState").innerHTML=drawWarn;
                    console.log("[LM] Device on pause, enable the device for use it");
                }
            }
            else{
                if(LMDebug) console.log("[LM] Bad answer from Leap Motion Web Socket Service: "+str);
                document.getElementById("LMState").innerHTML=drawError;
            }
            // Catch the pause of device
            window.clearTimeout(LMtimeout);
            LMtimeout=window.setTimeout(function(){document.getElementById("LMState").innerHTML=drawWarn;console.log("[LM] Device on pause, enable the device for use it");}, 100);
        };
        // On socket close
        LMws.onclose = function(event) {
            LMws = null;
            window.removeEventListener("focus", focusListener);
            window.removeEventListener("blur", blurListener);
            if(LMDebug) document.getElementById("LMMain").style.visibility = "hidden";
            document.getElementById("LMState").innerHTML=drawError;
            if(LMDebug) console.log("[LM] Deconnected from Leap Motion Web Socket Service");
        }
        // On socket error
        LMws.onerror = function(event) {
            var obj = JSON.parse(event.data);
            var str = JSON.stringify(obj, undefined, 2);
            document.getElementById("LMState").innerHTML=drawWarn;
            document.getElementById("LMStateLeft").innerHTML=drawError;
            document.getElementById("LMStateRight").innerHTML=drawError;
            document.getElementById("LMStateFingers").innerHTML=drawError+"<sup>0</sup>";
            console.log("[LM] Error: "+str);
        };
    }
}