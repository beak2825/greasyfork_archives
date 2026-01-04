// ==UserScript==
// @name         塵白方塊自動填入數字按鈕
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  auto
// @author       who care
// @match        https://cmdblockzqg.github.io/cbjq/
// @match        https://xyyx.cmdblock.top/
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541175/%E5%A1%B5%E7%99%BD%E6%96%B9%E5%A1%8A%E8%87%AA%E5%8B%95%E5%A1%AB%E5%85%A5%E6%95%B8%E5%AD%97%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/541175/%E5%A1%B5%E7%99%BD%E6%96%B9%E5%A1%8A%E8%87%AA%E5%8B%95%E5%A1%AB%E5%85%A5%E6%95%B8%E5%AD%97%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

var changeButtonHtml = '<input type="button" value="改數字" ' +
                       'style="position: fixed; top: 89px; left: 328px; z-index: 9999; ">';

jQuery('body').append(changeButtonHtml);

jQuery('body').on('click', 'input[type="button"][value="改數字"]', function() {
    const inputs = Array.from(document.querySelectorAll('p input[type="text"]'));

    const cubeInputs = inputs.slice(2);
    let oneCount = 0;

    for (let i = 0; i < cubeInputs.length; i++) {
        const input = cubeInputs[i];
        let value;

        if (i < 7) {
            value = '3';
        } else {
            value = '2';
            oneCount++;
            if (oneCount > 2) break;
        }

        input.value = value;
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
    }
});



