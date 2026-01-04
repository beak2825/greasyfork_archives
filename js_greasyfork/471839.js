// ==UserScript==
// @name          네이버 카페 베스트 게시판 바로가기 링크 추가
// @namespace     네이버 카페 베스트 게시판 바로가기 링크 추가
// @match         *://*cafe.naver.com/*
// @version       0.1
// @description   네이버 카페 좌측 하단에 베스트 게시판 바로가기 링크를 추가합니다.
// @icon          data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKUSURBVHgB7Zc9b9NQFIbfc+22aQTCCBWJzT+hLEgFIaW/oB0AQZamW5mg/yBdqRD0FxAWiMRAOpCFoUYCIrE0O0PCgFiQGjHko7Hv4dj5/mqckkRC8EiW7euj+77Hvvfca+Bfh3AOHn6/t2mYessgHSNoS5EGEcM/t9Ca956uZJPj+jIxATs/EjZz7QWDY9rXEvvUTIHAwbllgphLYfoMbSBRSNinrnesyLC6M1VyaPI7qouZTjvBdcL0G8pAorBja1U7AitL5CRXFbSzyBjKw6I6DT5BBy7uX32fD9N3KAN16EfEht24I5GXTCXb6EIZpnIH4klREiEJZcBjtama1wouootlLC9UhgdrPnhyJfsS0zJw5+tOTAzY/hiLLpVxKVKSgcYjxfdXso8xAWMNMJlWxKjg8vIJImZteAzDYSaZdu8cTMhYAyvGz/zFC7+2G0qDz+v1Ref5tUwRfys9ldD4GE8wwcYM0MR5+MdaujjaQC7OmD0pL1LexfVMUCkV5k9CVaNHrZv5GCDOyFRp1wZ57avqUzw5PwMuHXo3X8v44t2OKWzMz0ATXVlKtfUJq3M3gEjV6robMggZodbwiTFxguNNy4R629HSHxqPuqHAgIVpoyllVKNW9xxXppf00PcGpKYfYhYQ9yQlK/le/cabYL/QY0B2OhnMCA4+Lzuyh1x3b71Kts30B6pcvCCNNqYEuSJ4O+2Meq4GG/Q2pkfqLPGGXh/uWtqR/cYB/hDZORc96L1xcSP/C4zPD1JSLbZwTnHZuq73r3zDGFmI/NIp7sZmMCiOfFhxn/F/Rl/urhqe+UxCY2eF+aNcEQ7ctc4In46BFrn7tiK1IXM41p7XTCX5I/rmr3ZupJpvrfH/mYTfRefs0vcTSpcAAAAASUVORK5CYII=
// @author        mickey90427 <mickey90427@naver.com>
// @downloadURL https://update.greasyfork.org/scripts/471839/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%B9%B4%ED%8E%98%20%EB%B2%A0%EC%8A%A4%ED%8A%B8%20%EA%B2%8C%EC%8B%9C%ED%8C%90%20%EB%B0%94%EB%A1%9C%EA%B0%80%EA%B8%B0%20%EB%A7%81%ED%81%AC%20%EC%B6%94%EA%B0%80.user.js
// @updateURL https://update.greasyfork.org/scripts/471839/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%B9%B4%ED%8E%98%20%EB%B2%A0%EC%8A%A4%ED%8A%B8%20%EA%B2%8C%EC%8B%9C%ED%8C%90%20%EB%B0%94%EB%A1%9C%EA%B0%80%EA%B8%B0%20%EB%A7%81%ED%81%AC%20%EC%B6%94%EA%B0%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the Test button and add it to the bottom left corner of the page
    var testButton = document.createElement('button');
    testButton.innerHTML = '베스트 게시판 가기';
    testButton.style.position = 'fixed';
    testButton.style.bottom = '10px';
    testButton.style.left = '10px';
    testButton.style.zIndex = '9999'; // Set the z-index to 9999 to make sure it is always on top
    document.body.appendChild(testButton);

    // Add an event listener to the Test button to redirect to the BestArticleList page when clicked if the current URL does not contain ?iframe_url=/BestArticleList.nhn
    testButton.addEventListener('click', function() {
        if (!window.location.href.includes('?iframe_url=/BestArticleList.nhn')) {
            window.location.href = 'https://cafe.naver.com/' + window.g_sCafeUrlOnly + '?iframe_url=/BestArticleList.nhn';
        }
    });
})();