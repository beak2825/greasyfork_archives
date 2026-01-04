// ==UserScript==
// @name         입법예고의견 자동화
// @namespace    https://greasyfork.org/ko/scripts/527618-%EC%9E%85%EB%B2%95%EC%98%88%EA%B3%A0%EC%9D%98%EA%B2%AC-%EC%9E%90%EB%8F%99%ED%99%94
// @version      v1.0
// @description  국회입법예고 의견을 보다 쉽게 입력이 가능합니다
// @license      MIT
// @author       nancy
// @match        https://pal.assembly.go.kr/napal/lgsltpa/*
// @match        https://vforkorea.com/assem/*
// @icon         https://vforkorea.com/favicon.ico
// @grant        none
// @require    http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/527618/%EC%9E%85%EB%B2%95%EC%98%88%EA%B3%A0%EC%9D%98%EA%B2%AC%20%EC%9E%90%EB%8F%99%ED%99%94.user.js
// @updateURL https://update.greasyfork.org/scripts/527618/%EC%9E%85%EB%B2%95%EC%98%88%EA%B3%A0%EC%9D%98%EA%B2%AC%20%EC%9E%90%EB%8F%99%ED%99%94.meta.js
// ==/UserScript==

//vforkorea alt+a로 선택영역 링크열기
//제안이유 스킵하기, 스페이스,엔터로 넘기기,3초후 자동넘기기
//제목,내용 자동입력, 보안입력감시, 보안문자입력 후 스페이스,엔터 입력시 확인클릭
//`또는 alt+a 입력시 찬성,반대 토글
//창 비활성화일 때 이미 등록시 3초후 종료
//청원목록 3초 후 자동종료
//*연속링크열기 후 보안문자 최초입력시 마지막링크 문자입력
//*연속링크열기 후 보안문자 최초입력후 alt+s or '\' or '입력'버튼 눌러 보안문자 자동입력
//*ctrl+tab 또는 ctrl+shift+tab를 눌러 탭을 이동하면서 같은 입력으로 연속등록가능
//크롬,엣지설치 확장 개발자모드로 변경,vforkorea 팝업허용
//디시이용자 스크립트 참조함

(function() {

	'use strict';

	var yes_title = '찬성합니다' //제목 찬성 입력값
	var yes_content = '해당 법안을 강력히 찬성합니다' //내용 찬성 입력값(10자이상추천)

	var no_title = '반대합니다' //제목 반대 입력값
	var no_content = '해당 법안을 강력히 반대합니다' //내용 반대 입력값(10자이상추천)

	var lgsltpaOngoing_skip = true // 제안이유 스킵 true, false
	var delay1 =3000 //제안이유 클릭 대기시간 밀리초(ms)
	var delay2 =3000 //의견목록 탭종료 대기시간 밀리초(ms), 오류가능성 높음
	var monitor = true // 보안문자 입력 감시하기 예 true, 아니오 false
	var link_open_delay = 1500 //vkorea 링크 열기 딜레이

	//console.log("청원자동화");
	if (document.URL.search("lgsltpaOngoing") != -1){
		//console.log('제안이유');
		if (lgsltpaOngoing_skip)window.location.href = document.URL.replace("lgsltpaOngoing/view","lgsltpaOpn/forInsert")
		else setTimeout(function (){$(".btn_opnReg")[0].click()},delay1)//3초 후 클릭
	}else if (document.URL.search("forInsert") != -1){
		//console.log('의견등록');
		if ($("#txt_sj").length == 0){
			setTimeout(function (){window.close();},3000) //비활성화 이미 등록시 3초 후 종료
		}else{
			//$("#reLoad")[0].click()//보안문제 리로드
			$( "h4:contains('의견 작성')" ).text($(".legislation-heading > h3").text())
			$( "h4:contains('보안문자 확인')" ).remove()
			$("#txt_sj")[0].style.height="30px"//제목
			$("#txt_cn")[0].style.height="30px"//내용


			$("#txt_sj")[0].value=no_title //제목
			$("#txt_cn")[0].value=no_content //내용

			var catpcha = $("#catpchaAnswer")[0]
			catpcha.focus() //보안입력 포커스
			if(catpcha.value.length==5) catpcha.value = '';

			if (monitor == true) monitor_catpcha()

			var str =  '<a href="#" class="btn_reg" id="btn_opnInput">입력</a>'
			$("#btn_opnReg")[0].insertAdjacentHTML("beforebegin", str);
			$("#btn_opnInput").click(function() {$("#catpchaAnswer")[0].value = '11111';sendform()});
		}
	}else if (document.URL.search("forUpdate") != -1){//수정
			$( "h4:contains('의견 작성')" ).text($(".legislation-heading > h3").text())
			$("#txt_sj")[0].style.height="30px"//제목
			$("#txt_cn")[0].style.height="30px"//내용
			$("#txt_cn").focus() 
	}else if (document.URL.search(/list.do/i) != -1){
		//console.log("의견 목록")
		setTimeout(function() {window.close();}, delay2);//3초후 종료
	}

	if (document.URL.search(/vforkorea.com/i) != -1)
		document.addEventListener('keydown', onkeydown, false);//키입력 감시
	else
		document.addEventListener('keydown', onkeydown2, false);//키입력 감시

	function monitor_catpcha()
	{//보안문자 입력 감시
		let lastUpdateTime = 0
		let cancelTimer
		//console.log('보안입력 감시')
		cancelTimer  = requestAnimationFrame(animationPerSecond)

		function animationPerSecond(timestamp) {
			const actionTime = new Date()
			let l
			if (actionTime - lastUpdateTime > 500 ) {//500ms 주기 감시
				l = $("#catpchaAnswer")[0].value.length
				if(l==5){
					sendform()
					cancelAnimationFrame(cancelTimer )
					return
				}
				lastUpdateTime = actionTime
			}
			requestAnimationFrame(animationPerSecond)
		}
	}

	function sendform()
	{
		trimAllInputText();
		if (!validate()) {
			return false;
		}
		$(".loading_bar").show();
		checkWebFilter($("#frm"));
	}

	function getSelectedContentLinks2(sel)
	{
		var range = sel.getRangeAt(0);
		var URLtoOpen = [];
		var selectionContents = range.cloneContents();
		var div = document.createElement("div");
		div.appendChild(selectionContents);
		var urllist=div.getElementsByTagName('a');
		console.log(urllist);
		for (var i in urllist)
		{
			//console.log(urllist[i].href);
			if (urllist[i].href != undefined && urllist[i].href.match(/pal.assembly.go.kr.+lgsltpaOngoing/i))
				if (URLtoOpen.indexOf(urllist[i].href) == -1)
					URLtoOpen.push(urllist[i].href);
		}
		//console.log(URLtoOpen);
		return URLtoOpen
	}

	function isSelected(sel) { return !sel.isCollapsed; }

	function onkeydown(event)
	{//vkorea 선택영역 링크열기
		var sel = event.view.getSelection();
		if ((event.keyCode == 192) || event.altKey && event.keyCode == 65  ){ /* ` or alt+a*/
			if (isSelected(sel)) { 
				let links = getSelectedContentLinks2(sel);
				if (links.length != 0 ){
					//document.title = '[' + links.length + ']개 열기' 
					//console.log(links);
					for (let j in links){
						setTimeout(function (x,y){
							document.title = '[' + x+'/'+y + ']개 열기' 
							const vlink = document.createElement("a");
							vlink.target = "_blank";
							vlink.href = links[j]
							document.body.appendChild(vlink);
							vlink.click();
							vlink.remove();
						},link_open_delay*j,Number(j)+1, links.length)//1.5초 간격열기
					}
				}
			}
		}
	}	
	
	function onkeydown2(event)
	{
		if (event.keyCode == 32 || event.keyCode == 13){ /* space or enter */
			if (document.URL.search("lgsltpaOngoing") != -1)
				$(".btn_opnReg")[0].click()
			else if (document.URL.search(/orInsert|forUpdate/i) != -1)
				sendform()
			else if (document.URL.search(/list.do/) != -1)
				window.close();
		}else if ((event.keyCode == 192) || event.altKey && event.keyCode == 65  ){ /* ` or alt+a*/
			if ( $("#txt_sj")[0].value.indexOf("반대") != -1 ){
				$("#txt_sj")[0].value=yes_title //제목
				$("#txt_cn")[0].value=yes_content //내용
				document.title = '찬성합니다.'
			}else{
				$("#txt_sj")[0].value=no_title //제목
				$("#txt_cn")[0].value=no_content //내용
				document.title = '반대합니다.'
			}
			if (document.URL.search("forUpdate") != -1)
				$("#catpchaAnswer")[0].focus() //보안문제 포커스
		}else if(event.altKey && event.keyCode == 83  ||  event.keyCode == 220){ / '\' or alt+s*/
			catpcha = $("#catpchaAnswer")[0]
			catpcha.value = '11111';
			sendform()
		}
	}

})();