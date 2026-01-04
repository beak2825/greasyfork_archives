// ==UserScript==
// @name         fmkoreaPlus
// @name:ko      펨코 플러스
// @namespace    https://www.fmkorea.com/
// @version      0.0.114
// @description  add function to fmkorea
// @author       초연
// @match        https://www.fmkorea.com/
// @match        https://www.fmkorea.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fmkorea.com
// @grant        none
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/485181/fmkoreaPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/485181/fmkoreaPlus.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var text = "아이디 들어가는 자리"
    console.log("펨코 플러스?")
    // Your code here...
    //////////////////////////////////////////////
    setInterval(() => {
        // 확인된 클래스를 담을 배열 초기화
        var foundClasses = [];
        var classNames = [];
        var foundfindParent = [];
        var foundAuthor = [];

        // 모든 요소 선택
        var allElements = document.querySelectorAll('*');

        // 각 요소의 클래스 검사
        allElements.forEach(function (element) {
            var classNames = element.classList;

            // 특정 문자열을 포함하는 클래스가 있는지 확인
            if (classNames && Array.from(classNames).some(className => className.includes('member'))) {
                // 배열에 클래스 추가
                foundClasses.push(classNames);
            }
        });
        allElements.forEach(function (element) {
            var classNames = element.classList;

            // 특정 문자열을 포함하는 클래스가 있는지 확인
            if (classNames && Array.from(classNames).some(className => className.includes('findParent'))) {
                // 배열에 클래스 추가
                foundfindParent.push(classNames);
            }
        });

        allElements.forEach(function (element) {
            var classNames = element.classList;

            // 특정 문자열을 포함하는 클래스가 있는지 확인
            if (classNames && Array.from(classNames).some(className => className.includes('author'))) {
                // 배열에 클래스 추가
                //console.log("aaaaa" + classNames);
                foundAuthor.push(classNames);
            }
        });

        // 확인된 클래스 배열 출력
        //console.log('확인된 클래스 배열:', foundClasses[2]);
        for (var i = 0; i < foundClasses.length; i++) {
            //console.log('확인된 클래스 배열:', foundClasses[i].value);
            classNames.push(foundClasses[i].value);
            //console.log(document.getElementsByClassName(classNames[i])[0].innerText);
            //console.log(document.getElementsByClassName(classNames[i])[0].id);

            //console.log(document.getElementsByClassName(classNames[i])[0].innerHTML);
            //document.getElementsByClassName(classNames[i])[0].innerText = "" // 기본 감지
            //document.getElementsByClassName(classNames[i])[i].innerText = "" // 기본 감지 2
        }





        for (var i = 0; i < foundfindParent.length; i++) {
            //console.log('확인된 클래스 배열:', foundClasses[i].value);
            //console.log(foundfindParent[i]);
            //console.log(document.getElementsByClassName(foundfindParent[i])[0].innerText);
            //console.log(document.getElementsByClassName(foundfindParent[i])[0].id);

            //console.log(document.getElementsByClassName(foundfindParent[i])[0].innerHTML);
            document.getElementsByClassName(foundfindParent[i])[0].innerText = text // 대댓글 감지        //  1차 대댓글 감지
            document.getElementsByClassName(foundfindParent[i])[i].innerText = text // 대댓글 감지 2     // 연속된 대댓글 감지
            //document.getElementsByClassName(foundfindParent[0])[i].innerText = text // 대댓글 감지 3
        }

        for (var i = 0; i < foundAuthor.length; i++) {
            //console.log('확인된 클래스 배열:', foundClasses[i].value);
            //console.log(foundfindParent[i]);
            //console.log(document.getElementsByClassName(foundAuthor[i])[i].innerText);

            //console.log(document.getElementsByClassName(foundfindParent[i])[0].innerHTML);
            //document.getElementsByClassName(foundAuthor[i])[i].innerText = text // 글 목록의 닉네임 감지       //temp
        }





        // 모든 span.author 요소 선택
        var allAuthorSpans = document.querySelectorAll('span.author');
        var allSpan = [];
        // 각 span.author 요소에 대해 검사
        allAuthorSpans.forEach(function (authorSpan) {
            // 해당 span 요소의 하위 요소가 없는지 확인
            if (authorSpan.childElementCount === 0) {
                console.log('클래스가 "author"이고 하위 요소가 없는 span 요소를 찾았습니다:', authorSpan);
                allSpan.push(authorSpan);
                // 원하는 동작 수행
            }
        });
        for (var i = 0; i < allSpan.length; i++) {
            //console.log('확인된 클래스 배열:', foundClasses[i].value);
            //console.log(foundfindParent[i]);
            //console.log(document.getElementsByClassName(foundAuthor[i])[i].innerText);

            //console.log(document.getElementsByClassName(foundfindParent[i])[0].innerHTML);
            allSpan[i].innerText = text // 글 목록의 닉네임 감지 2      //temp
        }








        var aaaa = [];
        // 대댓글 감지 안 되서 다시 한번 더
        var allElements = document.querySelectorAll('[class^="member"]');






        // comment_으로 시작하는 어떤 숫자든지 선택
        var xpathExpression = '//*[starts-with(@id, "comment_")]/div[1]/a';
        var xpathExpression2 = '//*[starts-with(@id, "comment_")]/div[1]/a[1]';

        var matchingElements = document.evaluate(xpathExpression, document, null, XPathResult.ANY_TYPE, null);

        var matchingElements2 = document.evaluate(xpathExpression2, document, null, XPathResult.ANY_TYPE, null);

        // 결과를 배열로 변환
        var elementsArray = [];
        var elementsArray2 = [];
        var element = matchingElements.iterateNext();
        var element2 = matchingElements2.iterateNext();
        while (element) {
            elementsArray.push(element);
            element = matchingElements.iterateNext();
        }
        while (element2) {
            elementsArray2.push(element2);
            element2 = matchingElements2.iterateNext();
        }
        // 이제 배열을 반복하여 각 요소에 접근

        /** 
                for (var i = 0; i < elementsArray2.length; i++) {
                    console.log('매칭된 요소:', elementsArray2[i]);
        
                    // element가 null이 아닌 경우에만 innerText를 설정
                    if (elementsArray2[i]) {
        
                        elementsArray2[i].innerText = "★ BEST";
                        // 원하는 동작 수행
        
                    }
        
        
                }
                */
        for (var i = 0; i < elementsArray.length; i++) {
            //console.log('매칭된 요소:', elementsArray[i]);

            // element가 null이 아닌 경우에만 innerText를 설정
            if (elementsArray[i]) {
                if (elementsArray[i].innerText == "★ BEST") {
                    elementsArray[i].innerText = "★ BEST";
                }
                else {
                    elementsArray[i].innerText = text;
                }

                // 원하는 동작 수행

            } if (elementsArray2[i]) {

                // elementsArray2[i].innerText = "★ BEST";
                // 원하는 동작 수행

            }


        }
        var element = document.querySelector('.icon-hit[onclick="moveToBest(); return false;"]');
        if (element) {
            element.innerText = "★ BEST";
        }
        // 모든 <a> 태그 선택
        var allAnchorTags = document.querySelectorAll('a');
        allAnchorTags.forEach(function (anchorTag) {
            // onclick 속성 값이 "return false;"을 가지는지 확인
            if (anchorTag.getAttribute('onclick') === 'return false;') {
                console.log('onclick 속성 값이 "return false;"을 가진 <a> 태그를 찾았습니다:', anchorTag);
                anchorTag.innerText = text
                // 원하는 동작 수행
            }
        });
        // 각 <a> 태그에 대해 검사
        allAnchorTags.forEach(function (anchorTag) {
            // 클래스 이름이 "icon-hit"이면서 onclick 속성 값에 findComment과 숫자가 들어가 있는지 확인
            if (anchorTag.classList.contains('icon-hit') /*&& /findComment\(\d+\)/.test(anchorTag.getAttribute('onclick'))*/) {
                anchorTag.innerText = "★ BEST"
                // 원하는 동작 수행
            }
        });



        // 글 목록에서 갤로그 바로가기 가능하게 만들기
        var allElements = document.querySelectorAll('[class^="author"]');
        allElements.forEach(function (span) {
            span.addEventListener("click", function () {
                window.location.href = "#popup_menu_area"
            })

        }, 500)


    })();
})();