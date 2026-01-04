// ==UserScript==
// @name         LamuCity 특별추천 링크복원
// @version      0.2
// @description  라무시티 특별추천 게시판 링크를 복원합니다.
// @author       medAndro
// @match        https://lamu.city/bbs/board.php?bo_table=tr_mybox*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lamu.city
// @grant        none
// @namespace https://greasyfork.org/users/319515
// @downloadURL https://update.greasyfork.org/scripts/468276/LamuCity%20%ED%8A%B9%EB%B3%84%EC%B6%94%EC%B2%9C%20%EB%A7%81%ED%81%AC%EB%B3%B5%EC%9B%90.user.js
// @updateURL https://update.greasyfork.org/scripts/468276/LamuCity%20%ED%8A%B9%EB%B3%84%EC%B6%94%EC%B2%9C%20%EB%A7%81%ED%81%AC%EB%B3%B5%EC%9B%90.meta.js
// ==/UserScript==

// 요소 선택하기
var viewHeadElement = document.querySelector('.view-head');
var linkElement = document.querySelector('.view-head #tmp_link');
var linkaElement = document.querySelector('.view-head #tmp_link a');
var pwdElement = document.querySelector('.view-head #tmp_pwd');
var copyButton = document.querySelector('input[type="button"][value=" 복 사 "]');
var divElements = document.querySelectorAll('.media-content');
// 스타일 확인 및 요소 필터링
var targetElements = Array.from(divElements).filter(function(element) {
  var computedStyle = getComputedStyle(element);
  return computedStyle.border === '2px solid rgb(204, 204, 153)';
});

if(targetElements.length>0){
    var commentDiv = document.createElement('div');
    commentDiv.className = 'panel-heading';
    // 내부 내용 추가
    commentDiv.innerHTML = '<div class="font-12 text-muted">'+targetElements[0].innerHTML+' </div>';
    // 새로운 div 요소를 .view-head의 자식으로 추가
    viewHeadElement.appendChild(commentDiv);
    // 값 가져오기
    var linkVal = linkaElement ? linkaElement.href : '';
    var pwdVal = pwdElement ? pwdElement.textContent : '';

    function extractCodeFromLink(linkVal) {
        console.log(linkVal)
        var startIndex=""
        var endIndex=""
        var result = {
            code: "",
            flag: ""
        };
        if (linkVal.includes('we.tl/t-')) {
            startIndex = linkVal.indexOf('we.tl/t-') + 8;
            endIndex = linkVal.length;
            result.code = linkVal.substring(startIndex, endIndex);
            result.flag = "wetl";
        }else if(linkVal.includes('mega.nz/file/') && linkVal.length < 40){
            startIndex = linkVal.indexOf('nz/file/') + 8;
            endIndex = linkVal.length;
            result.code = linkVal.substring(startIndex, startIndex+8);
            result.flag = "megafile";

        }else if(linkVal.includes('mega.nz/folder/') && linkVal.length < 40){
            startIndex = linkVal.indexOf('nz/folder/') + 10;
            endIndex = linkVal.length;
            result.code = linkVal.substring(startIndex, startIndex+8);
            result.flag = "megafolder";

        }
        return result;
    }

    function getCodeWithPrefix(codeObj,point) {
        var wetlCode="";
        var megaCode="";
        var i, value;
        var textareaValues = Array.from(targetElements).map(function(element) {
            var textareaElement = element.querySelector('textarea');
            if (textareaElement) {
                return textareaElement.value;
            }
            return null;
        });
        var combinedString = textareaValues.filter(function(value) {
            return value !== '\n';
        }).join('');
        var pattern = /[a-zA-Z0-9\-+_]+/g;
        // 토큰 추출
        var tokens = combinedString.match(pattern);
        // 정규식 패턴


        if (codeObj.flag === "wetl" && codeObj.code.length > 10) {
            wetlCode = codeObj.code;
            wetlCode = wetlCode.substring(0, 10);
            return "https://we.tl/t-" + wetlCode;
        }else if(codeObj.flag === "wetl" && codeObj.code.length < 10){
            wetlCode = codeObj.code;
            for (i = 0; i < tokens.length; i++) {
                value = tokens[i];
                console.log(value);
                if(wetlCode.length + value.length == 10){
                    if(!point){
                        break;
                    }else{
                        point--;
                    }
                }
            }
            wetlCode = wetlCode+ value;
            return "https://we.tl/t-" + wetlCode;
        }else if(codeObj.flag === "wetl" && codeObj.code.length == 10){
            return "https://we.tl/t-" + codeObj.code;
        }else if(codeObj.flag === "megafile"){
            for (i = 0; i < tokens.length; i++) {
                value = tokens[i];
                console.log(value);
                if(value.length > 20){
                    if(!point){
                        break;
                    }else{
                        point--;
                    }
                }
            }
            return "https://mega.nz/file/" + codeObj.code+"#"+value;
        }else if(codeObj.flag === "megafolder"){
            for (i = 0; i < tokens.length; i++) {
                value = tokens[i];
                console.log(value);
                if(value.length > 20){
                    if(!point){
                        break;
                    }else{
                        point--;
                    }
                }
            }
            return "https://mega.nz/folder/" + codeObj.code+"#"+value;
        }
    }



    // 요소 제거하기
    if (extractCodeFromLink(linkVal).code.length > 1) {
        linkElement.innerHTML = '<strong><a href="'+getCodeWithPrefix(extractCodeFromLink(linkVal),0)+'" target="_blank" rel="noopener noreferrer"><u><font color="#0033cc">'+getCodeWithPrefix(extractCodeFromLink(linkVal),0)+'</font></u></a></strong>';
    }
    if (extractCodeFromLink(pwdVal).code.length > 1) {
        pwdElement.innerHTML = '<strong><a href="'+getCodeWithPrefix(extractCodeFromLink(pwdVal),1)+'" target="_blank" rel="noopener noreferrer"><u><font color="#0033cc">'+getCodeWithPrefix(extractCodeFromLink(pwdVal),1)+'</font></u></a></strong>';
        copyButton.remove();
    }}