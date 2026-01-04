// ==UserScript==
// @name          유저 차단＆새로고침 버튼 S II
// @author        언니(http://www.suyongso.com)
// @namespace https://greasyfork.org/users/226807
// @version       3.31T
// @include       https://suyong.so/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @description   특정 member값을 가진 li,tr 삭제 + 각 ajax request시 재실행, 댓글 새로고침 버튼 추가
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/380577/%EC%9C%A0%EC%A0%80%20%EC%B0%A8%EB%8B%A8%EF%BC%86%EC%83%88%EB%A1%9C%EA%B3%A0%EC%B9%A8%20%EB%B2%84%ED%8A%BC%20S%20II.user.js
// @updateURL https://update.greasyfork.org/scripts/380577/%EC%9C%A0%EC%A0%80%20%EC%B0%A8%EB%8B%A8%EF%BC%86%EC%83%88%EB%A1%9C%EA%B3%A0%EC%B9%A8%20%EB%B2%84%ED%8A%BC%20S%20II.meta.js
// ==/UserScript==
/*- The @grant directive is needed to work around a design change
    introduced in GM 1.0.   It restores the sandbox. */


/*

목-차

0. 함수 모음: 순서대로 글목록, 댓글목록, 실시간알림 차단
1. 페이지가 로드 완료되면 숨김 $(document).ready(function() 
2. 댓글목록이 업데이트될 시 숨김 waitForKeyElements("ul.fdb_lst_ul ", hideUsers);
3. (미완성) 글목록이 업데이트될 시 숨김 waitForKeyElements("table#docList.bd_lst.bd_tb_lst.bd_tb", hideUsersDocs);
4. 실시간 댓글 알림 뜰 시 특정 유저일 경우 숨김 waitForKeyElements( '[id^=ttwNotification]' , hideUsersRealTimeCommentAlert); 

*/
var testv=0;



// 0. 함수 모음: 순서대로 글목록, 댓글목록, 실시간알림 차단


// =========================↓닉네임 입력 시작 부분↓=========================
// =========================↓닉네임 입력 시작 부분↓=========================
// =========================↓닉네임 입력 시작 부분↓=========================
// =========================↓닉네임 입력 시작 부분↓=========================
// =========================↓닉네임 입력 시작 부분↓=========================

function hideTables(){   // 글목록에서 유저를 차단하기.

   $('tr a[class=member_28508059]').parent().parent().parent().hide(); //애기라둥이는... 
   $('tr a[class=member_28505583]').parent().parent().parent().hide(); //우리용진이괴롭히지마
   //$('tr a[class=member_25431489]').parent().parent().parent().hide(); //수은등,조현병,시민재창조,추가반찬셀프,...
  
}

function hideLists(){  // 댓글목록에서 유저를 차단하기.

  $('li a[class=member_28508059]').parent().parent().remove(); //애기라둥이는...
  $('li a[class=member_28505583]').parent().parent().remove(); //우리용진이괴롭히지마
//  $('li a[class=member_25431489]').parent().parent().remove(); //수은등,조현병,시민재창조,추가반찬셀프,...
}
function hideRealTimeAlerts(){  // 실시간 댓글 알림에서 유저를 차단하기.

  $('div[style*=\'28508059\']').parent().hide(); // 애기라둥이는...
  $('div[style*=\'28505583\']').parent().hide(); // 우리용진이괴롭히지마
//  $('div[style*=\'25431489\']').parent().hide(); // 수은등,조현병,시민재창조,추가반찬셀프,...
  
}

// =========================↑닉네임 입력 끝!↑=========================
// =========================↑닉네임 입력 끝!↑=========================
// =========================↑닉네임 입력 끝!↑=========================
// =========================↑닉네임 입력 끝!↑=========================
// =========================↑닉네임 입력 끝!↑=========================






// 1. 페이지가 로드 완료되면 숨김: 글목록, 댓글목록
$(document).ready(function () {
  console.log("글목록 mutation 감지");
  hideTables();
  hideLists();
  //   $('li a[class=member_14362952]').parent().parent().hide();
  //   $('tr a[class=member_14362952]').parent().parent().parent().hide(); //느금비%EF%BB%BF빔소, 느금비﻿빔소
});



// 글목록 실시간 observe
// 대상 node 선택
var asdasDocs = document.getElementsByClassName('bd_lst_wrp')[0];

//now create our observer and get our target element
var gamshiDocs = new MutationObserver(fnHandlerDocs),
        elTarget = asdasDocs,
        objConfig = {
            childList: true,
            subtree : true,
            attributes: false, 
            characterData : false
        };

//then actually do some observing
gamshiDocs.observe(elTarget, objConfig);

function fnHandlerDocs () {
  	console.log('유저 차단 스크립트: 글목록 실시간 observe');
    hideTables();
}
// 글목록 실시간 observe 끝!





// 2. 댓글목록이 업데이트될 시 숨김: 댓글목록

// 댓글목록 실시간 observe
// 대상 node 선택
var asdas = document.getElementById('cmtPosition');

//now create our observer and get our target element
var gamshi = new MutationObserver(fnHandler),
        elTarget = asdas,
        objConfig = {
            childList: true,
            subtree : true,
            attributes: false, 
            characterData : false
        };

//then actually do some observing
gamshi.observe(elTarget, objConfig);

function fnHandler () {
    hideUsers();
  	console.log('유저 차단 스크립트: 댓글목록 실시간 observe');
  	//asdas.innerHTML += "<h1 style=\"color:blue;text-align: right;\">댓글 새로고침</h1>";
}
// 댓글목록 실시간 observe 끝!


//waitForKeyElements('div.cmt_wrt_btm', hideUsers);
//waitForKeyElements('ul.fdb_lst_ul ', hideUsers);
function hideUsers() {  
  hideLists();
  //alert(testv);
  //   $('li a[class=member_14362952]').parent().parent().hide();
  //   $('tr a[class=member_14362952]').parent().parent().parent().hide(); //느금비%EF%BB%BF빔소, 느금비﻿빔소 느금﻿﻿비빔소  
}
function authorCommentColorBlue(){
  // 코멘트 작성자의 닉네임을 강조하기
  var authorNick = document.querySelector("div.rd_hd.clear div.side a").text;
  
}



//asdas.addEventListener("DOMNodeInserted", function (event) {
//  // ...
//  testv++;
//  alert(testv);
//}, false);


// 3. 글목록이 업데이트될 시 숨김: 글목록
waitForKeyElements('table#docList.bd_lst.bd_tb_lst.bd_tb', hideUsersDocs);
function hideUsersDocs()
{
  setTimeout(hUD, 2000); //Two seconds will elapse and Code will execute.  
//  alert("DEBUG: hideUserDocs 완료");
}
// hUD: focus 딱 한 번만 실행, 글목록
function hUD() {
// hUD 함수는 글목록(테이블)이 새로 ajax 들어왔을 때, 현재 윈도 focus를 단 한 번!만 지우게 함
// 다른 탭이나 다른 앱을 구경하고 있다가 다시 파이어폭스로 돌아오면, window.focus가 되어 숨김동작 실행
// 그냥 $(window).focus(~~~~)로 하면 무한루프가 되어버려 성능에 지장을 줄 수 있다. $(window).one('focus',~~~)는 이걸 단 한 번!만 실행되게 하는 것.

//   $(window).blur(function() {
//         hideTables();
//   });

  $(window).one('focus', function(){ 
    setTimeout( 
      function()
      {
        hideTables();        
        //         alert("DEBUG: setTimeout 완료");
      } 
      ,500);
  });   
  window.addEventListener('focus', function() {
    setTimeout( 
      function()
      {
        hideTables();        
        //         alert("DEBUG: setTimeout 완료");
      } 
      ,500);
    
  });
  $(window).one('focus', function(){ 
    setTimeout( 
      function()
      {
        hideTables();        
        //         alert("DEBUG: setTimeout 완료");
      } 
      ,5000);

  });
}



/* ===========수용소 3.0에서 안 씀===========
// 4. 실시간 댓글 알림 뜰 시 특정 유저일 경우 숨김
waitForKeyElements('[id^=ttwNotification]', hideUsersRealTimeCommentAlert); 
function hideUsersRealTimeCommentAlert() { 
  // 와일드카드 등은 http://stackoverflow.com/questions/5376431/wildcards-in-jquery-selectors , http://rosshawkins.net/archive/2011/10/14/jquery-wildcard-selectors-some-simple-examples.aspx 참고
  //  와일드카드 예시: console.log($('[id*=ander]'));
  hideRealTimeAlerts();
//   $('div[style*=\'12788411\']').parent().hide(); // 개인(테스트용)
}


//// 5. ~~~님! XX개의 알림이 있습니다.에서 유저 숨김
//waitForKeyElements('div.listscroll', hideAlarmList); 
//function hideAlarmList() { 
//  alert('asdf');
//}
  ===========수용소 3.0에서 안 씀===========
*/



window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
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



// 이하는 쓰레기(릴리즈할 때는 지울 것!)

// 문서가 다 로드되면 숨김
// $(window).load(function(){
//       $('li a[class=member_9908761]').parent().parent().remove();
//       $('tr a[class=member_9908761]').parent().parent().parent().remove();
//       $('li a[class=member_2749929]').parent().parent().remove();
//       $('tr a[class=member_2749929]').parent().parent().parent().remove();
//       alert("DEBUG: 스크립트 실행 끝!");
// })


// $("body").prepend ( `
//     <div id="gmSomeID">
//         <p>Some paragraph</p>
//         <p>Some paragraph</p>
//         <p>Some paragraph</p>
//         <p>Some paragraph</p>
//         <p>Some paragraph</p>
//         <p>Some paragraph</p>
//         <p>Some paragraph</p>
//         <p>Some paragraph</p>
//         <p>Some paragraph</p>
//         <p>Some paragraph</p>
//         <p>Some paragraph</p>
//         <p>Some paragraph</p>
//         <p>Some paragraph</p>
//         etc.
//     </div>
// ` );

//   setTimeout(function()
//                     {
    
//     $("table#docList.bd_lst.bd_tb_lst.bd_tb").prepend ( `
//     <div id="gmSomeID">
//         <p>Some paragraph</p>
//         <p>Some paragraph</p>
//         <p>Some paragraph</p>
//         <p>Some paragraph</p>
//         <p>Some paragraph</p>
//         <p>Some paragraph</p>
//         <p>Some paragraph</p>
//         <p>Some paragraph</p>
//         <p>Some paragraph</p>
//         <p>Some paragraph</p>
//         <p>Some paragraph</p>
//         <p>Some paragraph</p>
//         <p>Some paragraph</p>
//         etc.
//     </div>
// ` );
//   }, 2000);  

// 정상 작동 테스트
 console.log("실시간 유저 차단 스크립트 작동 완료");