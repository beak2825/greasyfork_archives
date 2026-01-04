// ==UserScript==
// @name         kibana url decode
// @version      0.1
// @description  5.4.1 버전의 discover와 dsahboard의 테이블 항목에서만 동작확인함. 추가/수정을 원하는 경우 checkElement 에서 변경이벤트를 감시할 객체와 실제 내용을 변경할 객체의 쿼리셀릭터를 변경하세요.
// @match        *://*/app/kibana
// @grant        none
// @namespace https://greasyfork.org/users/733401
// @downloadURL https://update.greasyfork.org/scripts/420989/kibana%20url%20decode.user.js
// @updateURL https://update.greasyfork.org/scripts/420989/kibana%20url%20decode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.setTimeout(function() {
        checkElement('table.table.agg-table-group', '.cell-hover span:not([class])');
        checkElement('div.discover-table > doc-table > div > table > tbody', 'td.discover-table-sourcefield > div > span > dl span');
    }, 5000);

})();

function checkElement(containerQuery, bodyQuery) {
    let targetList = document.querySelectorAll(containerQuery);
    if(targetList.length != 0) {
        attachObserver(containerQuery, bodyQuery);
    } else {
        window.setTimeout(checkElement.bind(containerQuery, bodyQuery), 2000);
    }
}

function attachObserver(containerQuery, bodyQuery) {
    decodeText(bodyQuery);

    var needRefresh = true;
    // 대상 node 선택
    let targetList = document.querySelectorAll(containerQuery);

    // 감시자 인스턴스 만들기
    let observer = new MutationObserver(function(mutations) {
        //mutations.forEach(function(mutation) {
        //    console.log(mutation.type);
        //});
        if(needRefresh) {
            needRefresh = false;
            decodeText(bodyQuery);
            window.setTimeout(function() {
                needRefresh = true;
            }, 1000);
        }
    });

    // 감시자의 설정:
    let config = { attributes: true, subtree: true, characterData: true };

    // 감시자 옵션 포함, 대상 노드에 전달
    targetList.forEach(target => observer.observe(target, config));
}

function decodeText(bodyQuery) {
    document.querySelectorAll(bodyQuery).forEach(e => {
        try {
            e.innerHTML = decodeURI(processText(e.innerHTML));
        }catch(error) {
            e.innerText = decodeURI(e.innerText);
        }

    });
    console.log('working url decode');
}

function processText(string) {
    let testary = string.split('%');
    let result = testary[0];
    let isFirst = true;

    for (let i = 1; i < testary.length; ++i) {
        let txt = '';
        if (testary[i].startsWith("<mark>")) {
            if (isFirst) {
                txt = "<mark>%" + testary[i].slice(6, testary[i].length - 7);
                isFirst = false;
            } else {
                if (testary[i].endsWith("</mark>")) {
                    txt = "%" + testary[i].slice(6, testary[i].length - 7);
                } else {
                    txt = "%" + testary[i].slice(6, testary[i].length);
                    isFirst = false;
                }
            }
        } else {
            txt = "%" + testary[i];
        }
        result += txt;
    }
    return result;
}