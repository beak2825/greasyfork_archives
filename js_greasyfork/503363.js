// ==UserScript==
// @name 아카라이브 깡계 확인 수정본
// @namespace Null
// @version 5.18
// @description 아카라이브 깡계 확인 스크립트
// @match https://arca.live/b/*/*
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/503363/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EA%B9%A1%EA%B3%84%20%ED%99%95%EC%9D%B8%20%EC%88%98%EC%A0%95%EB%B3%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/503363/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EA%B9%A1%EA%B3%84%20%ED%99%95%EC%9D%B8%20%EC%88%98%EC%A0%95%EB%B3%B8.meta.js
// ==/UserScript==


const usernameElement = document.querySelector('.username.d-none.d-sm-inline');
const usernameText = usernameElement.textContent.trim(); // 공백 제거

let dataFilterValues = {};

var numOfRequests = 0;
var numOfStyle = 0;

function setLinkStyle(link, post, comment) {
    // console.log('P :' + post + ' C : ' + comment);

    if (post === 0 && comment === 0) {
        link.style.fontWeight = 'bold';
        link.style.color = 'red';
        // link.style.textDecoration = 'line-through';
        link.textContent += ' [삭제된 계정]';
    } else {
        link.style.color = ((post <= 10 && comment <= 10) || comment <= 5) ? 'red' :
        ((post <= 10 && comment > 10) || comment <= 10) ? 'orange' :
        ((post < 15 && comment > 14 ) || comment <= 14) ? 'lightgreen' : '';

        if (post < 15 || comment < 15) {
            link.textContent += ` [최근 글: ${post < 15 ? post : '🆗'} 댓글: ${comment < 15 ? comment : '🆗'}]`;
        }
    }
    numOfStyle++;
}

async function fetchDataAndSetStyle(link) {
    const targetURL = link.href;
    const dataFilterValue = link.getAttribute('data-filter').trim();
    numOfRequests++;

    if (usernameText !== dataFilterValue && !dataFilterValues[dataFilterValue]) {
        dataFilterValues[dataFilterValue] = { post: 0, comment: 0 };
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: targetURL,
                onload: function (response) {
                    const htmlData = response.responseText;
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(htmlData, 'text/html');

                    console.log(dataFilterValue); // DEBUG

                    if (doc.querySelectorAll('.error-code').length >= 1) {
                    } else {
                        const cardBlockElement = doc.querySelector('.card-block');
                        const childNodes = cardBlockElement.childNodes;
                        let postCount = 0;
                        let commentCount = 0;
                        let flag = 0;

                        for (const node of childNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.className === "clearfix") {
                                    flag += 1;
                                }
                                if (node.className === "user-recent" && flag === 0) {
                                    postCount += 1;
                                } else if (node.className === "user-recent" && flag === 1) {
                                    commentCount += 1;
                                }
                            }
                        }
                        dataFilterValues[dataFilterValue] = { post: postCount, comment: commentCount };
                    }
                    resolve();
                }
            });
        });
    }
}

(async () => {
    console.time('Execution Time');
    const promises = [];
    console.log("Data Sorting..."); // DEBUG
    document.querySelectorAll('.info-row .user-info a').forEach(link => {
        promises.push(fetchDataAndSetStyle(link));
    });

    await Promise.all(promises);

    console.log("Labeling..."); // DEBUG

    document.querySelectorAll('.info-row .user-info a').forEach(secondLink => {
        const secondDataFilterValue = secondLink.getAttribute('data-filter').trim();
        if (dataFilterValues[secondDataFilterValue]) {
            const { post, comment } = dataFilterValues[secondDataFilterValue];
            setLinkStyle(secondLink, post, comment);
        }
    });

    console.timeEnd('Execution Time');
    console.log('Req : ' + numOfRequests + ' Sty : ' + numOfStyle);
    console.log(dataFilterValues);

})();
