// ==UserScript==
// @name         아카라이브 깡계확인 및 핫딜챈 비율표시
// @namespace    http://kemomimi.com/
// @version      1.6.1
// @description  깡계확인 스크립트(글 5개나 댓글 5개 미만 표시) 및 핫딜챈 한정 핫딜챈 작성글 비율 표시
// @match        https://arca.live/b/*/*
// @grant        GM_xmlhttpRequest
// @connect      arca.live
// @grant   GM_getValue
// @grant   GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/470279/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EA%B9%A1%EA%B3%84%ED%99%95%EC%9D%B8%20%EB%B0%8F%20%ED%95%AB%EB%94%9C%EC%B1%88%20%EB%B9%84%EC%9C%A8%ED%91%9C%EC%8B%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/470279/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EA%B9%A1%EA%B3%84%ED%99%95%EC%9D%B8%20%EB%B0%8F%20%ED%95%AB%EB%94%9C%EC%B1%88%20%EB%B9%84%EC%9C%A8%ED%91%9C%EC%8B%9C.meta.js
// ==/UserScript==


// 화이트리스트 추가
function addItem(newItem) {
    let savedArray = JSON.parse(GM_getValue("whlteArray", "[]"));
    savedArray.push(newItem);
    GM_setValue("whlteArray", JSON.stringify(savedArray));
}

// 화이트리스트 삭제
function deleteItem(itemToDelete) {
    let savedArray = JSON.parse(GM_getValue("whlteArray", "[]"));
    let index = savedArray.indexOf(itemToDelete);
    if (index > -1) {
        savedArray.splice(index, 1);
        GM_setValue("whlteArray", JSON.stringify(savedArray));
    }
}

function removeUnsafe() {
    if (window.location.href.includes('/hotdeal/')) {
        const link = document.querySelector('table a');
        let href = link.getAttribute('href');
        let title = link.getAttribute('title');
        let text = link.textContent;
        href = href.replace('https://unsafelink.com/', '');

        const newLink = document.createElement('a');
        newLink.href = href;
        newLink.title = title;
        newLink.textContent = text;
        newLink.target = "_blank";
        newLink.className = "external";
        newLink.rel = "external nofollow noopener noreferrer";

        link.parentNode.replaceChild(newLink, link);

    }
}


const firstLink = document.querySelector('.article-head .info-row .user-info a');
const dataFilterValue = firstLink.getAttribute('data-filter');


var showFlag = true;
const button = document.createElement('button');
let savedArray = JSON.parse(GM_getValue("whlteArray", "[]"));
if (!savedArray.includes(dataFilterValue)) {
    button.textContent = '➕';
    button.title = "핫딜비율&깡계 표시 숨기기"
}else{
    button.textContent = '➖';
    button.title = "핫딜비율&깡계 표시하기"
    showFlag = false;
}
button.style.cursor = 'pointer';
button.style.backgroundColor = 'transparent';
button.style.border = 'none';


button.addEventListener('click', function() {
    let savedArray = JSON.parse(GM_getValue("whlteArray", "[]"));
    if (!savedArray.includes(dataFilterValue)) {
        addItem(dataFilterValue);
        button.textContent = '✅화이트리스트에 추가됨';
        setTimeout(() => location.reload(), 1000);
    } else {
        deleteItem(dataFilterValue);
        button.textContent = '✅화이트리스트에서 제거됨';
        setTimeout(() => location.reload(), 1000);
    }
});
const member = document.querySelector('.member-info');
if (!showFlag){
    member.appendChild(button);
}else if (firstLink && showFlag) {
    const targetURL = firstLink.href;
    // GET 요청 보내기
    GM_xmlhttpRequest({
        method: 'GET',
        url: targetURL,
        onload: function(response) {
            removeUnsafe();
            const htmlData = response.responseText;
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlData, 'text/html');
            if(doc.querySelectorAll('.error-code').length >=1){
                firstLink.style.fontSize = '17px';
                firstLink.style.fontWeight = 'bold';
                firstLink.style.color = 'red';
                firstLink.style.textDecoration = 'line-through';
                firstLink.textContent += ' (삭제된 계정)';
                member.appendChild(button);
            }else{
                const cardBlockElement = doc.querySelector('.card-block');
                const childNodes = cardBlockElement.childNodes;
                var post = 0
                var coment = 0
                var hotdeal = 0
                var washyourid = 0
                var flag = 0
                var channels = new Set() // 채널 이름을 저장할 Set

                for (const node of childNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if(node.className == "clearfix"){
                            flag+=1
                        }
                        if(node.className== "user-recent" && flag==0){
                            post+=1
                            const colTitleNodes = node.querySelectorAll('.col-title span');
                            colTitleNodes.forEach(span => {
                                const channelName = span.textContent.trim()
                                if(channelName.endsWith(' 채널')) {
                                    channels.add(channelName.slice(0, -3)) // '채널' 문자열 제거 후 Set에 추가
                                }
                                if(channelName === "핫딜 채널") {
                                    hotdeal += 1;
                                }
                                if(channelName === "세탁 채널") {
                                    washyourid += 1;
                                }
                            });
                        }else if(node.className== "user-recent" && flag==1){
                            coment+=1
                        }
                    }
                }
                var channelString = Array.from(channels).join(', ');
                firstLink.title = "활동 채널: " + channelString;

                if (window.location.href.includes('/hotdeal/')) {
                    const table = document.querySelector('.article-body table');

                    if (table) {
                        const newRow = table.insertRow(0);

                        const cell1 = newRow.insertCell(0);
                        cell1.textContent = '최근 활동챈';
                        cell1.className = 'displayName';

                        // 두 번째 셀을 생성하고 채널 목록을 추가합니다.
                        const cell2 = newRow.insertCell(1);
                        cell2.textContent = channelString;
                    } else {
                        console.log('테이블을 찾을 수 없습니다.');
                    }

                }

                if (window.location.href.includes('/hotdeal/')) {
                    // 핫딜챈
                    var hotdealRatio = ((hotdeal/post)*100).toFixed(0)
                    if(post<=5 || coment<=5){
                        firstLink.style.fontSize = '17px';
                        firstLink.style.fontWeight = 'bold';
                        firstLink.style.color = 'red';
                        firstLink.textContent += ' (핫딜챈 비율:'+hotdealRatio+'% 최근 글:'+post+' 댓글:'+coment+')';
                        member.appendChild(button);
                    }else if(washyourid>=1){
                        firstLink.style.fontSize = '17px';
                        firstLink.style.fontWeight = 'bold';
                        firstLink.style.color = 'red';
                        var washedHotdealRatio = ((hotdeal/(post-washyourid))*100).toFixed(0)
                        firstLink.textContent += ' (세탁챈 글:'+washyourid+' 핫딜챈 비율:'+washedHotdealRatio+'%)';
                        member.appendChild(button);
                    }else{
                        if (hotdealRatio >= 70){
                            firstLink.style.color = 'red';
                        }
                        if(hotdealRatio >= 90){
                            firstLink.style.fontWeight = 'bold';
                            firstLink.style.fontSize = '17px';
                        }
                        firstLink.textContent += ' (핫딜챈 비율: '+hotdealRatio+'%)';
                        member.appendChild(button);
                    }
                }
                else if(washyourid>=1){
                    firstLink.style.fontSize = '17px';
                    firstLink.style.fontWeight = 'bold';
                    firstLink.style.color = 'red';
                    firstLink.textContent += ' (세탁챈 글:'+washyourid+' 글:'+(post-washyourid)+' 댓글:'+coment+')';
                    member.appendChild(button);
                }
                else if(post<=5 || coment<=5){
                    firstLink.style.fontSize = '17px';
                    firstLink.style.fontWeight = 'bold';
                    firstLink.style.color = 'red';
                    firstLink.textContent += ' (최근 글:'+post+' 댓글:'+coment+')';
                    member.appendChild(button);
                }else{
                    //firstLink.textContent += ' (최근 글:'+post+' 댓글:'+coment+')';
                }
            }
        }
    });
} else {
    //console.log('링크를 찾을 수 없음');
}

