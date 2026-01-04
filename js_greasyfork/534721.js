// ==UserScript==
// @name         NamuSlack_Hearthstone
// @name:ko      나무슬랙_하스스톤
// @namespace    http://tampermonkey.net/
// @version      0.1.1.2
// @description  편집해야 한다... vs ㅋㅋㅋㅋㅋㅋ (딸깍)
// @author       NamuSlack
// @match        https://namu.wiki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=namu.wiki
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/534721/NamuSlack_Hearthstone.user.js
// @updateURL https://update.greasyfork.org/scripts/534721/NamuSlack_Hearthstone.meta.js
// ==/UserScript==

const fetchTextContent = (url) => {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url,
            onload: function(response) {
                resolve(response.responseText); // 파일 내용 반환
            },
            onerror: function(error) {
                reject(error); // 에러 발생시
            }
        });
    });
}

//정규식을 github에 올려서 호출하고 있습니다. 역슬래시의 압박이 너무 심해서 유지보수가 어려워 이렇게 했습니다.
//I'm registering my regular expressions on github. Backslashes are too much of a burden and make maintenance difficult.
let regex = null;

const startEdit = () => {
    GM_setValue("editStep", "start");
    window.location.href = '/edit' + window.location.pathname.slice(2);
}

const removeMarkSyntaxForIncludeArg = (raw) => {
    return raw.replace(/\[\[.*?\|(.*?)\]\]/, "$1").replace(/\[\[(.*?)\]\]/, "$1").replace(/\[\* .*?]/, "").replace(/^\[\[.*?\|/, "");
}

const replaceMarkSyntaxForIncludeArg = (raw) => {
    return raw.replace(/'''(.*?)'''/g, "<b>$1</b>").replace(/''(.*?)''/g, "<i>$1</i>").replace("[br]", "<br>").replaceAll('[[]]','');
};

const exchangePattern = async () => {
    if (!window.location.pathname.startsWith('/w') && !window.location.pathname.startsWith('/edit')) {
        return;
    }

    //window.location.href = '/edit' + window.location.pathname.slice(2);
    const targetButton = document
    .evaluate("//button[normalize-space(text())='RAW 편집']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
    .singleNodeValue;

    if (targetButton) {
        targetButton.click(); // 클릭 이벤트 발생
    }

    const xpath = '//form//textarea[@name]';
    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    const textarea = result.singleNodeValue;

    if (textarea) {
        let count = 0;
        textarea.value = textarea.value.replace(regex,
                                                (match, ...args) => {
            let {className, rarity, cardKind, cardSet,
                   koreanName, illust, englishName,
                   cost, attack, healthName, health, species,
                   effect, koreanFlavorText, englishFlavorText,
                   goldLink, goldGain, diamondLink, diamondGain,
                   signatureLink, signatureGain}
            = args.at(-1);
            if ((koreanFlavorText && koreanFlavorText.includes('\n')) || (englishFlavorText && englishFlavorText.includes('\n'))) {
                return match;
            }
            count++;

            const shouldBeRemovedList =
                  [['한글명', koreanName],
                   ['영어명', englishName],
                   ['플레이버한', koreanFlavorText],
                   ['플레이버영', englishFlavorText]];
            let commentOutput = '';
            for (const [label, value] of shouldBeRemovedList) {
                if (!value) {
                    continue;
                }
                const transformed = removeMarkSyntaxForIncludeArg(value);
                if (transformed !== value) {
                    commentOutput += `##${label}: ${value}\n`;
                }
            }

            let macroArgs = [
             `${className === '공용' ? '중립' : className.replace(' ', '')}=`,
             `${rarity ? rarity : '없음'}=`,
             `${cardKind.endsWith("(토큰)") ? cardKind.substr(0, cardKind.length - 4) : cardKind}=`,
             `${'\n'}한글명=${removeMarkSyntaxForIncludeArg(koreanName)}`,
             `일러명=${illust}`,
             `영문명=${removeMarkSyntaxForIncludeArg(englishName)}`,
             `확장팩=${cardSet ? cardSet : '-'}`,
             `${'\n'}비용=${cost}`,
             attack ? `공격력=${attack}` : '',
             health ? `${healthName}=${health}`: '',
             ...(species && species !== '-' ? (species.split('[br]').map(o => `${o}=`)): []),
             `${'\n'}효과=${replaceMarkSyntaxForIncludeArg(effect)}`,
             koreanFlavorText ? `${'\n'}플레이버한=${removeMarkSyntaxForIncludeArg(koreanFlavorText)}` : '',
             englishFlavorText ? `${'\n'}플레이버영=${removeMarkSyntaxForIncludeArg(englishFlavorText)}` : '',
             `${'\n'}황금링크=${goldLink}`,
             `황금획득=${goldGain}`,
             signatureLink ? `${'\n'}간판링크=${signatureLink}` : '',
             signatureGain ? `간판획득=${signatureGain}` : '',
             diamondLink ? `${'\n'}다이아=` : '',
             diamondLink ? `다이아링크=${diamondLink}` : '',
             diamondGain ? `다이아획득=${diamondGain}` : '',
             koreanFlavorText === undefined || koreanFlavorText === null || !koreanFlavorText ? '\n수집불가= ' : ''
            ].filter(item => typeof item === 'string' && item.trim() !== '').map(o => o.replaceAll(',', '\\,')).join(', ').replace(/, \n/g, ',\n');
            const ret = `[include(틀:하스스톤/카드, ${macroArgs})]${'\n'}${commentOutput}`;
            return ret;
        });
        textarea.dispatchEvent(new Event('input', { bubbles: true })); // React 대응

        alert(`${count}개의 템플릿이 교체되었습니다!`);
        const previewButton = Array.from(document.querySelectorAll('button'))
        .find(btn => btn.textContent.trim() === '미리보기');
        if (previewButton) {
            previewButton.click(); // 클릭 이벤트 발생
        }

    }
}

/*const createTextListButton = () => {
    // 초기값
    const STORAGE_KEY = 'myTextList';
    const defaultList = ["예시 1", "예시 2"];

    // 저장된 리스트 가져오기
    const getList = () => GM_getValue(STORAGE_KEY, defaultList);
    const setList = (list) => GM_setValue(STORAGE_KEY, list);

    // 버튼 UI 생성
    const btn = document.createElement('button');
    btn.textContent = "📋 리스트";
    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        padding: '8px 12px',
        fontSize: '14px',
        background: '#333',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        zIndex: 9999,
        opacity: 0.6,
        transition: 'opacity 0.3s'
    });

    btn.addEventListener('mouseover', () =>{ btn.style.opacity = '1'});
    btn.addEventListener('mouseout', () => {btn.style.opacity = '0.6'});

    // 클릭 시 리스트 표시 및 추가 입력 받기
    btn.addEventListener('click', () => {
        const list = getList();
        const current = list.join('\n');
        const updated = prompt("리스트 (한 줄에 하나씩)", current);
        if (updated !== null) {
            const newList = updated.split('\n').map(x => x.trim()).filter(x => x);
            setList(newList);
            alert("✅ 저장 완료!\n\n" + newList.join('\n'));
        }
    });

    document.body.appendChild(btn);
}

const createButton = () => {
    const button = document.createElement('div');
    button.innerText = '▶';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.left = '20px';
    button.style.zIndex = '9999';
    button.style.width = '50px';
    button.style.height = '50px';
    button.style.backgroundColor = '#007bff';
    button.style.color = '#fff';
    button.style.borderRadius = '50%';
    button.style.display = 'flex';
    button.style.justifyContent = 'center';
    button.style.alignItems = 'center';
    button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    button.style.cursor = 'pointer';
    button.style.opacity = '0.6';
    button.style.transition = 'opacity 0.3s ease';

    // 호버 시 투명도 변화
    button.addEventListener('mouseover', () => {
        button.style.opacity = '1';
    });

    button.addEventListener('mouseout', () => {
        button.style.opacity = '0.6';
    });

    // 클릭 시 함수 실행
    button.addEventListener('click', exchangePattern);

    // 페이지에 버튼 추가
    document.body.appendChild(button);
}*/

function waitForXPath(xpath, callback, timeout = 10000) {
    const start = Date.now();

    const observer = new MutationObserver(() => {
        const result = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        );
        const node = result.singleNodeValue;

        if (node) {
            observer.disconnect();
            callback(node);
        } else if (Date.now() - start > timeout) {
            observer.disconnect();
            console.warn(`XPath 대기 시간 초과: ${xpath}`);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}


const createEditButton = () => {
    const previewButtonLi = document
    .evaluate("//button[normalize-space(text())='미리보기']/..", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
    .singleNodeValue;
    if (previewButtonLi === null){
        console.log("여기선 버튼이 없었습니다.");
        return;
    }
    const newEditButtonLi = previewButtonLi.cloneNode(true);
    previewButtonLi.insertAdjacentElement("afterend", newEditButtonLi);
    const newEditButton = newEditButtonLi.children[0];
    newEditButton.innerText = '하스스톤 템플릿 교체'
    newEditButton.onclick = exchangePattern;
}

(async function() {
    'use strict';

    regex = new RegExp(await fetchTextContent("https://raw.githack.com/CollectiveIntelli/NamuSlack/main/hearthstone.re"), 'gm');
    const runWhenEditPath = () => {
        if(window.location.pathname.startsWith("/edit/")) {
            console.log("edit 페이지에 있습니다.");
            waitForXPath("//button[normalize-space(text())='미리보기']/..", () => {console.log("버튼을 찾았습니다."); createEditButton();});
        }
    };

    // 최초 로딩
    runWhenEditPath();

    //pushState, replaceState 감지용 래핑
    const observeHistory = (type) => {
        const orig = history[type];
        return function(...args) {
            const result = orig.apply(this, args);
            window.dispatchEvent(new Event("locationchange"));
            return result;
        };
    };
    history.pushState = observeHistory("pushState");
    history.replaceState = observeHistory("replaceState");

    // popstate와 custom locationchange 이벤트 감지
    window.addEventListener("popstate", runWhenEditPath);
    window.addEventListener("locationchange", runWhenEditPath);

    //createTextListButton();
    //createButton();
    // 단축키 설정 (예: Ctrl + Shift + Y)
    /*document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'G') {
            e.preventDefault(); // 기본 동작 방지 (선택적)
            exchangePattern();
        }
    });*/
    // Your code here...
})();