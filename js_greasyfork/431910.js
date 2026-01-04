/* Update

ver 1.4
; 게시글 본문 및 댓글 폰트체, 굵기, 크기 변경 가능한 함수 삽입(주석 처리)
; 블랙리스트의 글, 댓글 일괄 비추 기능 추가. 일괄 비추 버튼 클릭시 작은 팝업창 생성됨. 2초 후 자동으로 사라짐. 클릭한 후 비추가 안 올라갔어도 서버에는 등록이 됐기 때문에 새로고침하면 화면상에도 갱신이 됨.
; '블랙 일괄 비추' 기능이 동작하지 않으면 크롬 브라우저 기준, '설정 - 팝업 및 리디렉션 - 팝업 전송 및 리디렉션 사용이 허용됨' 항목에서 'http://www.etoland.co.kr/*' 를 추가해주면 됨.
;블랙 비추와 반대 개념인, 블랙리스트 외 모두 추천 기능 추가. 해당 글에서 블랙리스트에 등록되어 있지 않은 유저가 작성한 글, 댓글 모두에 추천을 누름.
; 캡쳐3종 업데이트. 각 캡쳐버튼 클릭시 닉네임, 프사가 마킹된 캡쳐 이미지와 마킹되지 않은 원본 캡쳐이미지가 한 번에 저장됨.
; 위 캡쳐기능 통합으로 마킹버튼은 필요가 없을 것으로 판단되나 마킹 후 댓글 일부를 수동으로 캡쳐하는 게 필요한 유저가 있을지 몰라서 버튼 삭제는 보류.
; 기존에 메모 데이터가 있을 때, 새로 메모를 입력하지 않고 저장 버튼을 누르면 기존 메모가 지워졌는데, 기존에 메모가 있으면 해당 메모를 입력창에 기본값으로 입력되게 하여 추가 입력없이 저장 버튼을 눌러도 기존 메모가 지워지지 않게 수정.

※ 업데이트 검토 중인 사항
-텔레그램 전송
; 캡쳐버튼을 누르면 자신이 생성한 텔레그램 봇 채팅방으로 이미지를 전송. 덧붙여 캡쳐한 이미지의 해당 게시글 Url과 제목, 작성자 ID, 작성자 닉네임, 작성자 ip를 함께 전송하는 기능

- 과거 활동 이력
; '김재규'님이 만드신 엑셀의 웹버젼.

하지만 어디까지나 검토중인 사항이고, 실력의 한계로 영원히 불가능할 수 있음.
*/


  // ==UserScript==
  // @name         EtoLand Memo&Black
  // @namespace    http://tampermonkey.net/
  // @version      1.4
  // @description  Etoland memo and blacklist function
  // @author       etouser
  // @match          http://www.etoland.co.kr/bbs/board.php?bo_table=*
  // @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.2/html2canvas.min.js
  // @require      https://code.jquery.com/jquery-3.2.1.min.js
  // @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
  // @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/431910/EtoLand%20MemoBlack.user.js
// @updateURL https://update.greasyfork.org/scripts/431910/EtoLand%20MemoBlack.meta.js
  // ==/UserScript==

  (function() {
      'use strict';


      // 게시글 캡쳐 및 이미지 저장에 필요한 라이브러리 호출 및 적용
      GM_xmlhttpRequest({
          method : "GET",
          url : "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.2/html2canvas.min.js",
          onload : (ev) =>
          {
              let e = document.createElement('script');
              e.innerText = ev.responseText;
              document.head.appendChild(e);
          }
      });


      // 기본 제이쿼리 라이브러리 호출 및 적용
      //*
      GM_xmlhttpRequest({
          method : "GET",
          url : "https://code.jquery.com/jquery-3.2.1.min.js",
          onload : (ev) =>
          {
              let e = document.createElement('script');
              e.innerText = ev.responseText;
              document.head.appendChild(e);
          }
      });

      // 맨 아래로 가기 버튼 동작을 위한 위치 표시
      $('body').append('<div id="des_bottom"></div>');

      // 드랍다운메뉴 태그 삽입
      $('body').append(`<div class="toolMenu" style="width: 10%;text-align:center;position:fixed;right:2%;top:20%;z-index:10000;">
    <a href="#"><font size="7em" color="hotpink">▲</font></a>&nbsp;&nbsp;&nbsp;
    <a href="#des_bottom"><font size="7em" color="blueviolet">▼</font></a>
    <br>
  <button class="dropbtn">Dropdown</button>
  <div class="toolMenu-content">
    <br>
    <input type="button" id="captureMarkingBt" value="마 킹" onclick="" style="font-weight: bold;">
    <br>
    <input type="button" id="captureArticleBt" value="본문 📷" onclick="" style="font-weight: bold;">
    <br>
    <input type="button" id="captureCommentBt" value="댓글 📷" onclick="" style="font-weight: bold;">
    <br>
    <input type="button" id="captureAllBt" value="본문+댓글 📷" onclick="" style="font-weight: bold;">

    <br><hr color="black" width="90%"><br>

    <input type="button" id="blackDislikeBt" value="블랙 비추" onclick="" style="font-weight: bold;">
    <br>

    <input type="button" id="notBlacklikeBt" value="안블랙 추천" onclick="" style="font-weight: bold;">
    <br>

    <input type="button" id="blankCommentBt" value="빈 댓글" onclick="" style="font-weight: bold;">

    <br><!--
    <hr color="black" width="90%"><br>
    <input type="button" id="historyRecordBt" value="활동내역" onclick="" style="font-weight: bold;">
    <br>-->
  </div>
</div>`);

      // 블랙리스트 강조, 드랍다운 메뉴 스타일 설정
      $('head').append(`<style type="text/css">

@import url('https://fonts.googleapis.com/css2?family=Nanum+Gothic&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Nanum+Gothic&family=Nanum+Gothic+Coding&display=swap');
// *{font-weight:bold;font-family:'Nanum Gothic Coding','Nanum Gothic','Malgun Gothic';}

/* 블랙리스트 강조표시 (게시글 및 댓글 중 블랙리스트에 적용) */
td.blacked {
  background: rgb(138,196,247);
background: linear-gradient(90deg, rgba(138,196,247,1) 22%, rgba(245,178,136,0.9235135196300035) 56%, rgba(251,128,236,1) 100%);
}

/* 블랙리스트 강조표시 (게시글 및 댓글 중 블랙리스트에 적용)  */
td.blacked span {
  color: black;
  font-weight: bold;
}

/* 블랙리스트 강조표시 (게시판 글목록 중 블랙리스트에 적용)  */
tr.blacked {
  background: rgb(138,196,247);
background: linear-gradient(90deg, rgba(138,196,247,1) 22%, rgba(245,178,136,0.9235135196300035) 56%, rgba(251,128,236,1) 100%);
}

/* 블랙리스트 강조표시 (게시판 글목록 중 블랙리스트에 적용) */
tr.blacked * {
  color: black;
  font-weight: bold;
}

/* Dropdown Button */
.dropbtn {
  background-color: #04AA6D;
  color: white;
  padding: 10px;
  margin: 5px 0 0 0;
  font-size: 16px;
  border: none;
  margin: 0 auto;
  width: 80%;
}

/* The container <div> - needed to position the dropdown content */
.toolMenu {
  position: relative;
  display: inline-block;
}

/* Dropdown Content (Hidden by Default) */
.toolMenu-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  width: 100%;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

/* Links inside the dropdown */
/*.toolMenu-content a {*/
.toolMenu-content input {
  color: black;
  padding: 3px;
  width: 90%;
  text-decoration: none;
  display: block;
  font-weight: bold;
  font-size: 1em;
  margin: 0 auto;
  border-radius: 10px;
  /*border-color: orangered;*/
  border-color: #c14b76;
}

/* Change color of dropdown links on hover */
.toolMenu-content input:hover {background: #004FF9;  /* fallback for old browsers */
background: -webkit-linear-gradient(to right, #FFF94C, #004FF9);  /* Chrome 10-25, Safari 5.1-6 */
background: linear-gradient(to right, #FFF94C, #004FF9); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
font-weight: bold;color: white;transform: scale(1.2);}
/*.toolMenu-content a:hover {background-color: #f8f300;}*/

/* Show the dropdown menu on hover */
.toolMenu:hover .toolMenu-content {display: block;transform: scale(1.2);}

/* Change the background color of the dropdown button when the dropdown content is shown */
.toolMenu:hover .dropbtn {background-color: #3e8e41;}

</style>

`);


      // 게시글 본문, 댓글 폰트체, 폰트 굵기, 크기 바꾸는 함수
      function fontChn(){
          var dd = document.querySelectorAll('div[id^="view_"]');
          if (dd.length > 0){
              for (var i=0;i<dd.length;i++){
                dd[i].style.fontFamily = 'Nanum Gothic Coding';
                dd[i].style.fontWeight = 'bold'
                dd[i].style.fontSize = '150%'
                dd[i].style.lineHeight = '150%'
              };
          };
      };

      // 마킹버튼 함수 배당
      $("input#captureMarkingBt").click(function(){
        // 닉네임 마킹
        var nickList = document.querySelectorAll('span.member, span.cmt_name');
        Array.from(nickList).forEach((elem, index) => {
            elem.innerText = elem.innerText[0] + "****";
          });

        // 프로필 사진 마킹
        var ppp = document.querySelectorAll('img[src*="mw.basic.comment.image"]');
        Array.from(ppp).forEach((elem, index) => {
            elem.setAttribute('src','../skin/board/free.etoboard03/img/noimage.gif');
            // elem.style.visibility="hidden";
          });
        });


      $(document).ready(function(){

        // fontChn();

        // 캡쳐 이미지 파일 이름에 사용할 변수
        var timestamp = document.querySelector("span.mw_basic_view_datetime").innerText.slice(0,10);
        var writterId = document.querySelectorAll(".mw_basic_view_name > a")[1].getAttribute('onclick').split(',')[1].replace(/\s|'/g,"");
        var writterNick = document.querySelectorAll(".mw_basic_view_name > a")[1].getAttribute('onclick').split(',')[2].replace(/\s|'/g,"");
        var usrIp = /\d.+\d/.exec(document.querySelector('span.mw_basic_view_name').innerText);
        var articleTitle = document.querySelector(".mw_basic_view_subject").innerText;
        function fn_tail(){
          if (document.querySelector('span.member').innerText.includes('***')){
            var markingJudge = " (마킹).jpg";
          }else{
            var markingJudge = ".jpg";
          };
          return markingJudge;
        };


        // 블랙리스트 글, 작성글 일괄 비추 클릭을 위한 변수
        var memoList = JSON.parse(localStorage.getItem("MEMO_BLACK")); // 로컬스토리지 데이터 호출
        if (memoList == null){ //저장된 메모,블랙리스트가 없을 때
            var memoList = [{'userID':'0','memeo':'','black':false}];
            // memoList.push(saveItem);
            localStorage.setItem("MEMO_BLACK", JSON.stringify(memoList));
            var memoList = JSON.parse(localStorage.getItem("MEMO_BLACK"));
          };
        var blackin = memoList.map((v) => { // 블랙리스트 강조를 위한 참조데이터
          return v['userID']
          });



        // 본문캡쳐버튼 함수 배당
        $("input#captureArticleBt").click(function(){
          var dd = document.querySelectorAll('td.blacked, tr.blacked');
          // 블랙리스트 표시 제거
          for(var i=0;i<dd.length;i++){
            dd[i].setAttribute('class', 'pause');
            };

          //노모 캡쳐
          html2canvas(document.querySelector('table.view_table'),{scale: 2.5,allowTaint: true,useCORS: true}).then(canvas => {
            var base64ImageData=canvas.toDataURL("image/jpeg"),
            filename="Capture ("+timestamp+ ") ("+writterId+") (" + writterNick + ") (" + usrIp + ") "+articleTitle+" (본문 캡쳐).jpg",
            a=document.createElement("a");
            a.download=filename,a.href=base64ImageData,a.click()
            });
          
          // 유모 캡쳐를 위한 닉네임 마킹
          var nickList = document.querySelectorAll('span.member, span.cmt_name');
          var orgNick = $.map(nickList, function(val,i){
            return val.innerText;
          });
          Array.from(nickList).forEach((elem, index) => {
              elem.innerText = elem.innerText[0] + "****";
            });
          // 유모 캡쳐를 위한 프사 마킹
          var ppp = document.querySelectorAll('img[src*="mw.basic.comment.image"]');
          var ooo = $.map(ppp, function(val,i){
            return val.getAttribute('src');
          });
          Array.from(ppp).forEach((elem, index) => {
              elem.setAttribute('src','../skin/board/free.etoboard03/img/noimage.gif');
            });
          // 유모 캡쳐
          html2canvas(document.querySelector('table.view_table'),{scale: 2.5,allowTaint: true,useCORS: true}).then(canvas => {
            var base64ImageData=canvas.toDataURL("image/jpeg"),
            filename="Capture ("+timestamp+ ") ("+writterId+") (" + writterNick + ") (" + usrIp + ") "+articleTitle+" (본문 캡쳐) (마킹).jpg",
            a=document.createElement("a");
            a.download=filename,a.href=base64ImageData,a.click()
            });

          // 유모 제거
          Array.from(nickList).forEach((elem, index) => {
            elem.innerText = orgNick[index];
          });
          Array.from(ppp).forEach((elem, index) => {
            elem.setAttribute('src',ooo[index]);
          });
          // 블랙리스트 표시 복원
          for(var i=0;i<dd.length;i++){
            dd[i].setAttribute('class', 'blacked');
            };
          });



        // 댓글캡쳐버튼 함수 배당
        $("input#captureCommentBt").click(function(){
          var dd = document.querySelectorAll('td.blacked, tr.blacked');
          for(var i=0;i<dd.length;i++){
            dd[i].setAttribute('class', 'pause');
            };

          //노모 캡쳐
          html2canvas(document.querySelector('div#cocoment_main'),{scale: 2.5,allowTaint: true,useCORS: true}).then(canvas => {
            var base64ImageData=canvas.toDataURL("image/jpeg"),
            filename="Capture ("+timestamp+ ") ("+writterId+") (" + writterNick + ") (" + usrIp + ") "+articleTitle+" (댓글 캡쳐).jpg",
            a=document.createElement("a");
            a.download=filename,a.href=base64ImageData,a.click()
            });

          // 유모 캡쳐를 위한 닉네임 마킹
          var nickList = document.querySelectorAll('span.member, span.cmt_name');
          var orgNick = $.map(nickList, function(val,i){
            return val.innerText;
          });
          Array.from(nickList).forEach((elem, index) => {
              elem.innerText = elem.innerText[0] + "****";
            });
          // 유모 캡쳐를 위한 프사 마킹
          var ppp = document.querySelectorAll('img[src*="mw.basic.comment.image"]');
          var ooo = $.map(ppp, function(val,i){
            return val.getAttribute('src');
          });
          Array.from(ppp).forEach((elem, index) => {
              elem.setAttribute('src','../skin/board/free.etoboard03/img/noimage.gif');
              });

          //유모 캡쳐
          html2canvas(document.querySelector('div#cocoment_main'),{scale: 2.5,allowTaint: true,useCORS: true}).then(canvas => {
            var base64ImageData=canvas.toDataURL("image/jpeg"),
            filename="Capture ("+timestamp+ ") ("+writterId+") (" + writterNick + ") (" + usrIp + ") "+articleTitle+" (댓글 캡쳐) (마킹).jpg",
            a=document.createElement("a");
            a.download=filename,a.href=base64ImageData,a.click()
            });

          // 유모 제거
          Array.from(nickList).forEach((elem, index) => {
            elem.innerText = orgNick[index];
          });
          Array.from(ppp).forEach((elem, index) => {
            elem.setAttribute('src',ooo[index]);
          });
          // 블랙리스트 표시 복원
          for(var i=0;i<dd.length;i++){
            dd[i].setAttribute('class', 'blacked');
            };
          });

        // 본문+댓글캡쳐버튼 함수 배당
        $("input#captureAllBt").click(function(){
          var dd = document.querySelectorAll('td.blacked, tr.blacked');
          for(var i=0;i<dd.length;i++){
            dd[i].setAttribute('class', 'pause');
            };

          //노모 캡쳐
          html2canvas(document.querySelector('td#mw_basic'),{scale: 2.5,allowTaint: true,useCORS: true}).then(canvas => {
            var base64ImageData=canvas.toDataURL("image/jpeg"),
            filename="Capture ("+timestamp+ ") ("+writterId+") (" + writterNick + ") (" + usrIp + ") "+articleTitle+" (본문+댓글 캡쳐).jpg",
            a=document.createElement("a");
            a.download=filename,a.href=base64ImageData,a.click()
            });

          // 유모 캡쳐를 위한 닉네임 마킹
          var nickList = document.querySelectorAll('span.member, span.cmt_name');
          var orgNick = $.map(nickList, function(val,i){
            return val.innerText;
          });
          Array.from(nickList).forEach((elem, index) => {
              elem.innerText = elem.innerText[0] + "****";
            });
          // 유모 캡쳐를 위한 프사 마킹
          var ppp = document.querySelectorAll('img[src*="mw.basic.comment.image"]');
          var ooo = $.map(ppp, function(val,i){
            return val.getAttribute('src');
          });
          Array.from(ppp).forEach((elem, index) => {
              elem.setAttribute('src','../skin/board/free.etoboard03/img/noimage.gif');
              });

          //유모 캡쳐
          html2canvas(document.querySelector('td#mw_basic'),{scale: 2.5,allowTaint: true,useCORS: true}).then(canvas => {
            var base64ImageData=canvas.toDataURL("image/jpeg"),
            filename="Capture ("+timestamp+ ") ("+writterId+") (" + writterNick + ") (" + usrIp + ") "+articleTitle+" (본문+댓글 캡쳐) (마킹).jpg",
            a=document.createElement("a");
            a.download=filename,a.href=base64ImageData,a.click()
            });

          // 유모 제거
          Array.from(nickList).forEach((elem, index) => {
            elem.innerText = orgNick[index];
          });
          Array.from(ppp).forEach((elem, index) => {
            elem.setAttribute('src',ooo[index]);
          });
          // 블랙리스트 표시 복원
          for(var i=0;i<dd.length;i++){
            dd[i].setAttribute('class', 'blacked');
            };
          });



        // 블랙비추버튼 함수 배당
        $("input#blackDislikeBt").click(function(){
          var answer = 'nogood'
          var dislike = [];
          var like = [];
          var articleId = /\d{5,}/.exec(location.href)[0];

          $('a[href*=singo]').each(function(aa,bb){
              // 댓글란에 글쓴이가 댓글을 달면 해당섹션에선 아이디 정보를 얻을 수 없기 때문에  추천 비추천 선택을 할 수 없음. 그래서 맨 처음 아이디(글쓴이) 정보를 가져와 블랙리스트에 포함되어 있는지 여부를 알려주는 변수를 설정하는 것이 필요함.
              var wrElem = $($('a[href*=singo]')[0]).prevAll('span[class*=name]').find('a[onclick]'); //첫 아이디 정보 요소
              var wrId = /(?<=')(.+?(?='))/.exec(wrElem.attr('onclick'))[0]; // 글쓴이 아이디 추출
              // var qq = blackin.includes(wrId) ? true : false; // 글쓴이가 블랙리스트 여부인지 확인
              
              var commentId = /(\d{7}).+(\d{7})/.exec(bb.getAttribute('href'))[1]; // 댓글 넘버
              var cc, dd; // 아이디 객체를 담을 변수, 추출한 아이디를 담을 변수 

              try{ // 댓글란에 글쓴이가 댓글을 쓰면 아이디 정보를 구할 수 없어서 null 에러가 발생하기 때문에 try 처리해서 위에서 구한 글쓴이 아이디 정보를 적용.
                  var cc = $(bb).prevAll('span[class*=name]').find('a[onclick]');
                  var dd = /(?<=')(.+?(?='))/.exec(cc.attr('onclick'))[0];

                  if (blackin.includes(dd)){
                      dislike.push(commentId);
                  }else{
                      like.push(commentId);
                  };
              }catch{
                  if (blackin.includes(wrId)){
                      dislike.push(commentId);
                  }else{
                      like.push(commentId);
                  };
                };
              });

          console.log('like : ',like);
          console.log('dislike : ',dislike);

          if (answer == 'good'){
              for (var i=0;i<like.length;i++){
                  if (like[i] == articleId){
                      atcGoodUrl(answer);
                  }else{
                      cmtGoodUrl(like[i],answer);
                  };
              };
          }else{
              for (var i=0;i<dislike.length;i++){
                  if (dislike[i] == articleId){
                    console.log('작성자 글 - ', dislike[i]);
                      atcGoodUrl(answer);
                  }else{
                    console.log(dislike[i]," - ",answer);
                      cmtGoodUrl(dislike[i],answer);
                  };
                  setTimeout(function() {
                    console.log(i,"/",dislike.length);
                    }, 2000);
                  
                };
            };

          // 댓글 추천 비추천 URL
          function cmtGoodUrl(cmtid,good){
              var dd;
              $("script").each(function(index, value) {
                  if (value.text.indexOf("mw_comment_good") > 0) {
                      dd = /skin.+\d{6,}/.exec(value.text)[0];
                      };
                  });
              var result = 'http://www.etoland.co.kr/' + dd + '&wr_id=' + cmtid + '&good=' + good
              console.log(result);
              var child1;
              child1 = window.open(result,"_blank", "top=50,right=50,width=100,height=100");
              setTimeout(function() {
                  child1.close();
              }, 2000);
          };

          // 본문 추천 비추천 URL
          function atcGoodUrl(good){
              var dd;
              $("script").each(function(index, value) {
                  if (value.text.indexOf("mw_good_act") > 0) {
                      dd = /skin.+act.+\d{6,}/.exec(value.text)[0];
                      };
                  });
              var result = 'http://www.etoland.co.kr/' + dd + '&good=' + good
              var child;
              child = window.open(result,"_blank", "top=50,right=50,width=100,height=100");
              setTimeout(function() {
                  child.close();
              }, 2000);
          };
        });

        // 안블랙 추천 버튼 함수 배당
        $("input#notBlacklikeBt").click(function(){
          var answer = 'good'
          var dislike = [];
          var like = [];
          var articleId = /\d{5,}/.exec(location.href)[0];

          $('a[href*=singo]').each(function(aa,bb){
              // 댓글란에 글쓴이가 댓글을 달면 해당섹션에선 아이디 정보를 얻을 수 없기 때문에  추천 비추천 선택을 할 수 없음. 그래서 맨 처음 아이디(글쓴이) 정보를 가져와 블랙리스트에 포함되어 있는지 여부를 알려주는 변수를 설정하는 것이 필요함.
              var wrElem = $($('a[href*=singo]')[0]).prevAll('span[class*=name]').find('a[onclick]'); //첫 아이디 정보 요소
              var wrId = /(?<=')(.+?(?='))/.exec(wrElem.attr('onclick'))[0]; // 글쓴이 아이디 추출
              // var qq = blackin.includes(wrId) ? true : false; // 글쓴이가 블랙리스트 여부인지 확인
              
              var commentId = /(\d{7}).+(\d{7})/.exec(bb.getAttribute('href'))[1]; // 댓글 넘버
              var cc, dd; // 아이디 객체를 담을 변수, 추출한 아이디를 담을 변수 

              try{ // 댓글란에 글쓴이가 댓글을 쓰면 아이디 정보를 구할 수 없어서 null 에러가 발생하기 때문에 try 처리해서 위에서 구한 글쓴이 아이디 정보를 적용.
                  var cc = $(bb).prevAll('span[class*=name]').find('a[onclick]');
                  var dd = /(?<=')(.+?(?='))/.exec(cc.attr('onclick'))[0];

                  if (blackin.includes(dd)){
                      dislike.push(commentId);
                  }else{
                      like.push(commentId);
                  };
              }catch{
                  if (blackin.includes(wrId)){
                      dislike.push(commentId);
                  }else{
                      like.push(commentId);
                  };
                };
              });

          console.log('like : ',like);
          console.log('dislike : ',dislike);

          if (answer == 'good'){
              for (var i=0;i<like.length;i++){
                  if (like[i] == articleId){
                      atcGoodUrl(answer);
                  }else{
                      cmtGoodUrl(like[i],answer);
                  };
              };
          }else{
              for (var i=0;i<dislike.length;i++){
                  if (dislike[i] == articleId){
                    console.log('작성자 글 - ', dislike[i]);
                      atcGoodUrl(answer);
                  }else{
                    console.log(dislike[i]," - ",answer);
                      cmtGoodUrl(dislike[i],answer);
                  };
                  setTimeout(function() {
                    console.log(i,"/",dislike.length);
                    }, 2000);
                  
                };
            };

          // 댓글 추천 비추천 URL
          function cmtGoodUrl(cmtid,good){
              var dd;
              $("script").each(function(index, value) {
                  if (value.text.indexOf("mw_comment_good") > 0) {
                      dd = /skin.+\d{6,}/.exec(value.text)[0];
                      };
                  });
              var result = 'http://www.etoland.co.kr/' + dd + '&wr_id=' + cmtid + '&good=' + good
              console.log(result);
              var child1;
              child1 = window.open(result,"_blank", "top=50,right=50,width=100,height=100");
              setTimeout(function() {
                  child1.close();
              }, 2000);
          };

          // 본문 추천 비추천 URL
          function atcGoodUrl(good){
              var dd;
              $("script").each(function(index, value) {
                  if (value.text.indexOf("mw_good_act") > 0) {
                      dd = /skin.+act.+\d{6,}/.exec(value.text)[0];
                      };
                  });
              var result = 'http://www.etoland.co.kr/' + dd + '&good=' + good
              var child;
              child = window.open(result,"_blank", "top=50,right=50,width=100,height=100");
              setTimeout(function() {
                  child.close();
              }, 2000);
          };
        });

        // 빈댓글버튼 함수 배당
        $("input#blankCommentBt").click(function(){
          document.querySelector('.mw_basic_textarea.chk_area').value = "&nbsp";
          document.querySelector('button#btn_comment_submit').click();
            });

        // 활동내역버튼 함수 배당
        $("input#historyRecordBt").click(function(){
          document.querySelector('.mw_basic_textarea.chk_area').value = "&nbsp";
          document.querySelector('button#btn_comment_submit').click();
            });

        // 메모박스 버튼에 토글 기능 적용
        $("span.mw_basic_view_name .callMemoInputBox, span.mw_basic_comment_name .callMemoInputBox").click(function(){
            $(this).closest('td').find('.memoBox').toggle();
        });

        // 메모, 블랙리스트 체크 데이터 저장 기능 적용
        $(".memoBox input[name='saveBt']").click(function(){
            var memo = $(this).prevAll('.memo_input')[0].value;
            var bCheck = $(this).prev()[0].checked;
            var usrId = $(this).attr('usrid')
            console.log(memo);
            console.log(bCheck);
            console.log(usrId);
            var saveItem = {};

            saveItem['userID'] = usrId;
            saveItem['memo'] = memo;
            saveItem['black'] = bCheck

            var memoList = JSON.parse(localStorage.getItem("MEMO_BLACK"))

            if (memoList == null){ //저장된 메모,블랙리스트가 없을 때
                // var memoList = [{'userID':'0','memeo':'','black':false}];
                var memoList = [];
                memoList.push(saveItem);
                localStorage.setItem("MEMO_BLACK", JSON.stringify(memoList));
                var memoList = JSON.parse(localStorage.getItem("MEMO_BLACK"));
            }else{ // 저장된 메모, 블랙리스트가 있을 때
              var addSave = true; // 저장하는 아이디가 기존에 저장된 아이디인지 아닌지 여부 확인을 위한 변수.
              for (var i = 0; i < memoList.length; i++){
                if (saveItem['userID'] == memoList[i]['userID']){
                  memoList[i] = saveItem; //입력하려는 아이디가 기존에 있으면 변경된 내용으로 교체
                  localStorage.setItem("MEMO_BLACK", JSON.stringify(memoList));
                  addSave = false; // 기존에 저장된 아이디이기 때문에 기존 내용만 교체.
                  break;
                };
              };

              if(addSave){ // 새로 입력하는 아이디면 내용 추가
                memoList.push(saveItem);
                localStorage.setItem("MEMO_BLACK", JSON.stringify(memoList));
              };
            };
          }); //$(".memoBox input[name='saveBt']").click(function() 끝
        }); // $(document).ready(function() 끝


      // 이토랜드 코드
      (function() {

        var memoList = JSON.parse(localStorage.getItem("MEMO_BLACK")); // 로컬스토리지 데이터 호출

        if (memoList == null){ //저장된 메모,블랙리스트가 없을 때
            var memoList = [{'userID':'0','memeo':'','black':false}];
            // memoList.push(saveItem);
            localStorage.setItem("MEMO_BLACK", JSON.stringify(memoList));
            var memoList = JSON.parse(localStorage.getItem("MEMO_BLACK"));
          };

        var blackin = memoList.map((v) => { // 블랙리스트 강조를 위한 참조데이터
          return v['userID']
          });

        var ggg = "wr_id" // 게시글에 진입했을 때와 게시판 목록에 있을 때의 동작을 구분하기 위한 인수 / URL 내 'wr_id' 가 있으면 게시글을 클릭한 상태. 없으면 게시판 목록에 있는 상태.
        if(location.href.includes(ggg)){
          var article = document.querySelector('td#mw_basic');
          var list3 = article.querySelectorAll('span.mw_basic_view_name a[onclick^="show"], span.mw_basic_comment_name a[onclick^="show"]'); //게시글 내 닉네임 요소객체 리스트

          function addButton(jnode){ // 각 아이디 앞에 메모박스 토글 버튼 생성/메모표시 테이블/메모 및 블랙리스트 체크 입력부분 생성 함수
            var elem1 = jnode.querySelector('a[onclick^="show"]'); // 아이디 정보가 있는 a 태그 객체
            var usrAccount = jnode.getAttribute('onclick').split(',')[1].replace(/\s|'/g,""); // 실제 아이디 추출

            for(var i=0;i<memoList.length;i++){ // 메모리스트로 for문 진행
              if(usrAccount == memoList[i]['userID']){ // 유저 아이디와 메모리스트의 아이디가 일치하면,
                var memoInsert = memoList[i]['memo']; // 메모 추출
                var blackJudge = memoList[i]['black']; // 블랙리스트 여부 추출
                break;
              }else{
                var memoInsert = "" // 메모 추출
                var blackJudge = false // 블랙리스트 여부 추출
                };
              };

            // 메모토글버튼
            $(jnode).closest('span').prepend('<a href="javascript:;" class="callMemoInputBox"><font size=3; color="black">&nbsp📝&nbsp</font></a>');
            // 메모표시테이블/메모입력부 삽입 코드
            $(jnode).closest('span').parent().append('<table data-html2canvas-ignore style="display:none;border-spacing: 0;border-collapse: collapse;margin:5px 0 0 0;padding:0px;border:0px solid;width:100%;height: auto;background-color:yellow;" name="memoTable"><tbody><tr><td style="border:0px solid black;width:10%;background-color:#d5d5d5;color:black;font-weight:bold;font-size:0,8em;text-align:center;"> 메모 : </td><td name="memoOutput" style="border:0px solid black;background-color:#ffff00;color:#392f31;font-weight:bold;padding:0px 3px;padding:5px 10px">' + memoInsert + '</td></tr></tbody></table><div class="memoBox" style="display: none;" data-html2canvas-ignore><input type="text" class="memo_input" name="memo" value="" placeholder="메모 입력" style="width:50%;"><span style=" font: italic bold 1.5em/1em Georgia, serif ; color: #FF0000;">&nbsp; &nbsp; black list </span><input type="checkbox" name="chk_black" value="1" style="zoom:1.5; vertical-align:-15%;">&nbsp; <input type="button" name="saveBt" value="저장" usrid='+ usrAccount +'></div>');

            if (memoInsert.length > 0){ // 메모가 있으면 메모테이블 숨김 해제
              jnode.closest('span').parentElement.querySelector('table[name="memoTable"]').style.display = "";
              jnode.closest('span').parentElement.querySelector('input.memo_input').value = memoInsert;
              };

            if (blackJudge){ // 블랙리스트면 해당요소의 상위요소 배경색을 검정색으로 변경
              jnode.closest('span').parentElement.querySelector('input[name="chk_black"]').checked = "true";
              jnode.closest('span').parentElement.setAttribute("class","blacked");
              };

          };

          Array.from(list3).forEach((elem, index) => { // 메모박스 토글 버튼 추가
            addButton(elem);
            });

          // 게시판 목록에서 글작성자 아이디 리스트
          var articleList = document.querySelectorAll('td#mw_basic')[1];
          var list4 = document.querySelectorAll('nobr.mw_basic_list_name > a'); // 실제 아이디 추출을 위한 요소객체 리스트
          // 아이디 추출 / list4[0].getAttribute('onclick').split(',')[1].replace(/\s|'/g,"")

          Array.from(list4).forEach((elem, index) => { // 블랙리스트에 등록된 아이디가 작성한 게시글에 강조표시하는 코드
            var usrAccount = elem.getAttribute('onclick').split(',')[1].replace(/\s|'/g,""); // 실제 아이디 추출
            // console.log(usrAccount);
            if (blackin.includes(usrAccount)){ //블랙리스트와 아이디 비교
              // console.log(usrAccount);
              elem.closest('tr').setAttribute("class","blacked"); // 블랙리스트에 아이디가 포함되어 있으면 해당 게시글 배경색을 노란색으로 변경
              };
            });

          } else { // 게시글에 진입하지 않은, 게시판 목록에 있을 때, 블랙리스트가 작성한 글에 강조표시하는 코드 / 위와 동일
          var articleList = document.querySelectorAll('td#mw_basic')[1];
          var list4 = document.querySelectorAll('nobr.mw_basic_list_name > a'); // 실제 아이디 추출을 위한 요소객체 리스트

          Array.from(list4).forEach((elem, index) => { // 블랙리스트에 등록된 아이디가 작성한 게시글에 강조표시하는 코드
            var usrAccount = elem.getAttribute('onclick').split(',')[1].replace(/\s|'/g,""); // 실제 아이디 추출
            // console.log(usrAccount);
            if (blackin.includes(usrAccount)){ //블랙리스트와 아이디 비교
              // console.log(index);
              elem.closest('tr').setAttribute("class","blacked"); // 블랙리스트에 아이디가 포함되어 있으면 해당 게시글 배경색을 노란색으로 변경
              };
            });
          };
        })();
    })();