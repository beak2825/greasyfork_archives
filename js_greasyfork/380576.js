// ==UserScript==
// @name          유저 차단 S 모바일
// @author        리드(http://www.suyongso.com)
// @version       2.02R
// @include       https://www.suyongso.com/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @description   포인트 없이도 여러 명을 차단하고 싶어? 차단된 유저가 작성한 댓글입니다 같은 똥마저도 보기 싫어? 이거 쓰면 원큐에 해결임ㅎ
// @run-at       document-end
// @grant       GM_addStyle
// @namespace https://greasyfork.org/users/226807
// @downloadURL https://update.greasyfork.org/scripts/380576/%EC%9C%A0%EC%A0%80%20%EC%B0%A8%EB%8B%A8%20S%20%EB%AA%A8%EB%B0%94%EC%9D%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/380576/%EC%9C%A0%EC%A0%80%20%EC%B0%A8%EB%8B%A8%20S%20%EB%AA%A8%EB%B0%94%EC%9D%BC.meta.js
// ==/UserScript==
/*- The @grant directive is needed to work around a design change
    introduced in GM 1.0.   It restores the sandbox.
*/


//1. 댓글(유저번호) 처음 출력됐을 때.
$('li a[class=member_25431489]').parent().parent().hide();//을지대간호학과김범수
   
// ajax가 로드되어 ul 부분이 변경될 때도 숨김 ==> 댓글 업데이트 시 다시 차단
waitForKeyElements("ul.fdb_lst_ul ", hideUsers);


//2. 글(유저닉네임)
var badDivs = $("div span:contains('을지대간호학과김범수')").parent().parent().parent();
badDivs.remove ();
//   badDivs = $("div span:contains('비와아스팔트')").parent().parent().parent();
//   badDivs.remove ();

//3. 댓글(유저번호) ajax 업데이트 때도 자동으로 제거.
function hideUsers() {
  $('li a[class=member_25431489]').parent().parent().hide();
  $('tr a[class=member_25431489]').parent().parent().parent().hide();
}





// ======================= 여기 밑에서부터는 건드릴 필요 없음 =====================

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
  }  //--- Get the timer-control variable for this selector.

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
console.log("test");