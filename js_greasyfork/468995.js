// ==UserScript==
// @name         Class101 Subtitle Downloader
// @name:ko      클래스101 자막 다운로더
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Download vtt subtitle from class101.net
// @description:ko class101.net에서 vtt자막 다운로드
// @author       Ravenclaw5874
// @match        https://class101.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=class101.net
// @grant        GM_registerMenuCommand
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/468995/Class101%20Subtitle%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/468995/Class101%20Subtitle%20Downloader.meta.js
// ==/UserScript==

//현재 요소가 몇번째 자식인지 알려줌.
function getIndex(element, childs = element.parentNode.childNodes) {
    for (let i = 0; i < childs.length; i++) {
        if (childs[i] === element) {
            return i;
        }
    }
}

//Xpath로 요소 찾기 확장형
Node.prototype.xpath = function (xpath) {
    return document.evaluate(xpath, this, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function findFirstUniqueValue(arr) {
  // 객체를 사용하여 각 값의 빈도수를 카운트합니다.
  const frequency = arr.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});

  // 첫 번째로 빈도수가 1인 값을 반환합니다.
  for (let i = 0; i < arr.length; i++) {
    if (frequency[arr[i]] === 1) {
      return arr[i];
    }
  }

  // 유일한 값이 없는 경우 undefined를 반환합니다.
  return undefined;
}

//className을 포함하는 부모를 올라가면서 찾기
function findParentWithClassName(element, className, nth = 1) {
    let parent = element.parentElement;
    let count = 1;

    while (parent) {
        if (parent.classList.contains(className)) {
            // 원하는 className을 가진 부모를 찾았습니다.
            if (nth === count) { return parent; } // n번째 className 부모
            count++; // n번째 부모가 아님.
        }
        parent = parent.parentElement;
    }

    // 원하는 className을 가진 부모를 찾지 못했습니다.
    return null;
}

//파일 이름을 결정. "0101 안녕하세요"
function makeFilename() {
    const css_array = document.xpath("//p[text()='CHAPTER 1']").parentNode.parentNode.parentNode.className;
    const css_current = findFirstUniqueValue(Array.from(document.querySelectorAll(`div.${css_array} > button > div`)).map(e => e.className));

    const current = document.querySelector(`button > div.${css_current}`)
    const chapter = findParentWithClassName(current, css_array, 2);
    const chapter_name = chapter.querySelector("p").textContent;
    const chapters = chapter.parentNode.querySelectorAll(`:scope > div.${chapter.className}`);

    const mainIndex = getIndex(chapter, chapters).toString().padStart(2, '0');
    const subIndex = (getIndex(current.parentNode) + 1).toString().padStart(2, '0');
    const title = current.querySelector("div > div:nth-child(1) > div:nth-child(1) > span").innerText;

    const filename = `${mainIndex}${subIndex} ${title}`;

    return filename;
}

//자막 다운로드
async function downloadSubtitle() {
    const lang = document.documentElement.getAttribute('lang');
    const filename = makeFilename();
    const url = document.querySelector(`track[srclang=${lang}]`).src;

    try {
        const response = await fetch(url);

        if (response.status !== 200) {
            throw new Error(`Unable to download file. HTTP status: ${response.status}`);
        }
        const blob = await response.blob();

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}.vtt`;

        link.click()
    }
    catch (error) {
        console.error('error:', error.message);
    }
}

(function() {
    'use strict';
    // Your code here...
    const lang = document.documentElement.getAttribute('lang');
    const commandName = navigator.language === 'ko'? '자막 다운로드': 'Download Subtitle';
    GM_registerMenuCommand(commandName, downloadSubtitle)

})();