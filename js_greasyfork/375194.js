// ==UserScript==
// @name          댓글 차단 I
// @author        리드(http://www.suyongso.com)
// @namespace     http://www.suyongso.com/
// @version       1.0R
// @include       *://www.ilbe.com/*
// @description   특정 닉네임의 댓글 삭제
// @require       http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/375194/%EB%8C%93%EA%B8%80%20%EC%B0%A8%EB%8B%A8%20I.user.js
// @updateURL https://update.greasyfork.org/scripts/375194/%EB%8C%93%EA%B8%80%20%EC%B0%A8%EB%8B%A8%20I.meta.js
// ==/UserScript==

var blockUserLists= [ 
  '짤게충신창병엠', 	
  '개천에미꾸라지', 	
  'BUSSE',
];

waitForKeyElements('div.commentList', asdfasdf); 

function asdfasdf(){
  for (const nmt of document.querySelectorAll(".author")) {
		for (const undi of blockUserLists) {
      if (nmt.textContent.includes(undi)) {
        nmt.style.display = 'none';
        nmt.parentElement.setAttribute("style", "height:1px;padding-bottom:0px;overflow:hidden;");
      }
    }
  }
  return;
}


// 이하 라이브러리 함수 모음


/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/

function waitForKeyElements(selectorTxt, /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
bWaitOnce, /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
iframeSelector /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
  var targetNodes,
  btargetsFound;
  if (typeof iframeSelector == 'undefined')
  targetNodes = $(selectorTxt);
   else
  targetNodes = $(iframeSelector).contents().find(selectorTxt);
  if (targetNodes && targetNodes.length > 0) {
    btargetsFound = true;
    /*--- Found target node(s).  Go through each and act if they
            are new.
        */
    targetNodes.each(function () {
      var jThis = $(this);
      var alreadyFound = jThis.data('alreadyFound') || false;
      if (!alreadyFound) {
        //--- Call the payload function.
        var cancelFound = actionFunction(jThis);
        if (cancelFound)
        btargetsFound = false;
         else
        jThis.data('alreadyFound', true);
      }
    });
  } 
  else {
    btargetsFound = false;
  } //--- Get the timer-control variable for this selector.

  var controlObj = waitForKeyElements.controlObj || {
  };
  var controlKey = selectorTxt.replace(/[^\w]/g, '_');
  var timeControl = controlObj[controlKey];
  //--- Now set or clear the timer as appropriate.
  if (btargetsFound && bWaitOnce && timeControl) {
    //--- The only condition where we need to clear the timer.
    clearInterval(timeControl);
    delete controlObj[controlKey]
  } 
  else {
    //--- Set a timer, if needed.
    if (!timeControl) {
      timeControl = setInterval(function () {
        waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector
        );
      }, 300
      );
      controlObj[controlKey] = timeControl;
    }
  }
  waitForKeyElements.controlObj = controlObj;
}
