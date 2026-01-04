// ==UserScript==
// @name				단축키 일부 비활성화 S
// @include				https://www.suyongso.com/*
// @description			S 단축키를 comment 제외 모두 비활성화
// @version				1.0R
// @run-at				document-start
// @grant				none
// @namespace https://greasyfork.org/users/226807
// @downloadURL https://update.greasyfork.org/scripts/375117/%EB%8B%A8%EC%B6%95%ED%82%A4%20%EC%9D%BC%EB%B6%80%20%EB%B9%84%ED%99%9C%EC%84%B1%ED%99%94%20S.user.js
// @updateURL https://update.greasyfork.org/scripts/375117/%EB%8B%A8%EC%B6%95%ED%82%A4%20%EC%9D%BC%EB%B6%80%20%EB%B9%84%ED%99%9C%EC%84%B1%ED%99%94%20S.meta.js
// ==/UserScript==


var shortcut={all_shortcuts:{},add:function(e,t,a){var r={type:"keydown",propagate:!1,disable_in_input:!0,target:document,keycode:!1};if(a)for(var n in r)"undefined"==typeof a[n]&&(a[n]=r[n]);else a=r;var s=a.target;"string"==typeof a.target&&(s=document.getElementById(a.target));e=e.toLowerCase();var o=function(r){if(r=r||window.event,a.disable_in_input){var n;if(r.target?n=r.target:r.srcElement&&(n=r.srcElement),3==n.nodeType&&(n=n.parentNode),"INPUT"==n.tagName||"TEXTAREA"==n.tagName)return}r.keyCode?code=r.keyCode:r.which&&(code=r.which);var s=String.fromCharCode(code).toLowerCase();188==code&&(s=","),190==code&&(s=".");var o=e.split("+"),d=0,c={"`":"~",1:"!",2:"@",3:"#",4:"$",5:"%",6:"^",7:"&",8:"*",9:"(",0:")","-":"_","=":"+",";":":","'":'"',",":"<",".":">","/":"?","\\":"|"},l={esc:27,escape:27,tab:9,space:32,"return":13,enter:13,backspace:8,scrolllock:145,scroll_lock:145,scroll:145,capslock:20,caps_lock:20,caps:20,numlock:144,num_lock:144,num:144,pause:19,"break":19,insert:45,home:36,"delete":46,end:35,pageup:33,page_up:33,pu:33,pagedown:34,page_down:34,pd:34,left:37,up:38,right:39,down:40,f1:112,f2:113,f3:114,f4:115,f5:116,f6:117,f7:118,f8:119,f9:120,f10:121,f11:122,f12:123},p={shift:{wanted:!1,pressed:!1},ctrl:{wanted:!1,pressed:!1},alt:{wanted:!1,pressed:!1},meta:{wanted:!1,pressed:!1}};r.ctrlKey&&(p.ctrl.pressed=!0),r.shiftKey&&(p.shift.pressed=!0),r.altKey&&(p.alt.pressed=!0),r.metaKey&&(p.meta.pressed=!0);for(var i=0;k=o[i],i<o.length;i++)"ctrl"==k||"control"==k?(d++,p.ctrl.wanted=!0):"shift"==k?(d++,p.shift.wanted=!0):"alt"==k?(d++,p.alt.wanted=!0):"meta"==k?(d++,p.meta.wanted=!0):k.length>1?l[k]==code&&d++:a.keycode?a.keycode==code&&d++:s==k?d++:c[s]&&r.shiftKey&&(s=c[s],s==k&&d++);return d!=o.length||p.ctrl.pressed!=p.ctrl.wanted||p.shift.pressed!=p.shift.wanted||p.alt.pressed!=p.alt.wanted||p.meta.pressed!=p.meta.wanted||(t(r),a.propagate)?void 0:(r.cancelBubble=!0,r.returnValue=!1,r.stopPropagation&&(r.stopPropagation(),r.preventDefault()),!1)};this.all_shortcuts[e]={callback:o,target:s,event:a.type},s.addEventListener?s.addEventListener(a.type,o,!1):s.attachEvent?s.attachEvent("on"+a.type,o):s["on"+a.type]=o},remove:function(e){e=e.toLowerCase();var t=this.all_shortcuts[e];if(delete this.all_shortcuts[e],t){var a=t.event,r=t.target,n=t.callback;r.detachEvent?r.detachEvent("on"+a,n):r.removeEventListener?r.removeEventListener(a,n,!1):r["on"+a]=!1}}};

checkForBadJavascripts ( [
    [false, /shortcut\.add/, function () {
        addJS_Node ( 
            shortcut.add("c", function(){ location.href = "#cmtPosition"; })
        );
    } ],
    
//    [true,  /nounnjit/,  null ]
] );

function checkForBadJavascripts (controlArray) {
    /*--- Note that this is a self-initializing function.  The controlArray
        parameter is only active for the FIRST call.  After that, it is an
        event listener.

        The control array row is  defines like so:
        [bSearchSrcAttr, identifyingRegex, callbackFunction]
        Where:
            bSearchSrcAttr      True to search the SRC attribute of a script tag 
										example: <script type="text/javascript" src="http://jsbin.com/evilExternalJS/js"></script> ==> true
                                false to search the TEXT content of a script tag.
										example: newParagraph.textContent    = "I was added by the old, evil init() function!"; ==> false
            identifyingRegex    A valid regular expression that should be unique
                                to that particular script tag.
            callbackFunction    An optional function to execute when the script is
                                found.  Use null if not needed.
    */
    if ( ! controlArray.length) return null;

    checkForBadJavascripts      = function (zEvent) {

        for (var J = controlArray.length - 1;  J >= 0;  --J) {
            var bSearchSrcAttr      = controlArray[J][0];
            var identifyingRegex    = controlArray[J][1];

            if (bSearchSrcAttr) {
                if (identifyingRegex.test (zEvent.target.src) ) {
                    stopBadJavascript (J);
                    return false;
                }
            }
            else {
                if (identifyingRegex.test (zEvent.target.textContent) ) {
                    stopBadJavascript (J);
                    return false;
                }
            }
        }

        function stopBadJavascript (controlIndex) {
            zEvent.stopPropagation ();
            zEvent.preventDefault ();

            var callbackFunction    = controlArray[J][2];
            if (typeof callbackFunction == "function")
                callbackFunction ();

            //--- Remove the node just to clear clutter from Firebug inspection.
            zEvent.target.parentNode.removeChild (zEvent.target);

            //--- Script is intercepted, remove it from the list.
            controlArray.splice (J, 1);
            if ( ! controlArray.length) {
                //--- All done, remove the listener.
                window.removeEventListener (
                    'beforescriptexecute', checkForBadJavascripts, true
                );
            }
        }
    }

    /*--- Use the "beforescriptexecute" event to monitor scipts as they are loaded.
        See https://developer.mozilla.org/en/DOM/element.onbeforescriptexecute
        Note that it does not work on acripts that are dynamically created.
    */
    window.addEventListener ('beforescriptexecute', checkForBadJavascripts, true);

    return checkForBadJavascripts;
}

function addJS_Node (text, s_URL, funcToRun) {
    var D                                   = document;
    var scriptNode                          = D.createElement ('script');
    scriptNode.type                         = "text/javascript";
    if (text)       scriptNode.textContent  = text;
    if (s_URL)      scriptNode.src          = s_URL;
    if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    //--- Don't error check here. if DOM not available, should throw error.
    targ.appendChild (scriptNode);
}

//alert("작테");