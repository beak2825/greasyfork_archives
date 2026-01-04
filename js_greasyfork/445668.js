// ==UserScript==
// @name         leetcode-example-output-checker
// @namespace    iilj
// @version      1.0.0
// @description  Check if "Run Code" result is correct when "Use Example Testcases" during LeetCode contests.
// @author       iilj
// @license      MIT
// @supportURL   https://github.com/iilj/leetcode-example-output-checker/issues
// @match        https://leetcode.com/contest/*/problems/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445668/leetcode-example-output-checker.user.js
// @updateURL https://update.greasyfork.org/scripts/445668/leetcode-example-output-checker.meta.js
// ==/UserScript==
var label_ac = "<span class=\"text-success\">&nbsp;&rarr;&nbsp;<span class=\"label label-success\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"\" data-original-title=\"Accepted\">AC</span><br></span>";

var label_wa = "<span class=\"text-danger\">&nbsp;&rarr;&nbsp;<span class=\"label label-warning\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"\" data-original-title=\"Wrong Answer\">WA</span><br></span>";

(() => {
    // サンプルの出力をかき集める
    console.log('[LEOC] contest problem page');
    const labels = document.querySelectorAll('div.question-content pre strong');
    // サンプル出力の個数を検出する
    const outputs = [];
    labels.forEach((strong) => {
        if (strong.textContent === null ||
            (strong.textContent.trim() !== 'Output:' && strong.textContent.trim() !== 'Output') ||
            strong.nextSibling === null ||
            strong.nextSibling.textContent === null) {
            return;
        }
        if (strong.textContent.trim() === 'Output:') {
            // 通常
            const output = strong.nextSibling.textContent.trim();
            outputs.push(output);
        }
        else {
            // [null, [0, 0], [], true, false] とかになっている．スペースを除去する．
            const output = strong.nextSibling.textContent.trim().split(' ').join('');
            outputs.push(output);
        }
    });
    console.log('[LEOC] outputs', outputs);
    window.addEventListener('load', () => {
        const onload = () => {
            // 提出結果 div が出るまで若干待つ
            const result_div = document.querySelector('div.submission-result-base');
            if (result_div === null) {
                console.warn('[LEOC] result_div not found. Retrying.');
                window.setTimeout(onload, 2000);
                return;
            }
            const observer = new MutationObserver(() => {
                var _a, _b;
                // 提出結果の更新が始まったときに走る
                /** DOMの変化が起こった時の処理 */
                console.log('[LEOC] observer callback triggered.');
                const answer_labels = result_div.querySelectorAll('h5');
                const yourAnswerPre = Array.from(answer_labels).reduce((prev, h5) => {
                    var _a;
                    if (((_a = h5.textContent) === null || _a === void 0 ? void 0 : _a.trim()) !== 'Your answer') {
                        return prev;
                    }
                    return h5.nextSibling;
                }, null);
                if (yourAnswerPre === null) {
                    console.warn('[LEOC] Answer <pre> not found.');
                    return;
                }
                const yourInputPre = Array.from(answer_labels).reduce((prev, h5) => {
                    var _a;
                    if (((_a = h5.textContent) === null || _a === void 0 ? void 0 : _a.trim()) !== 'Your input') {
                        return prev;
                    }
                    return h5.nextSibling;
                }, null);
                if (yourInputPre === null) {
                    console.warn('[LEOC] Input <pre> not found.');
                    return;
                }
                console.log(`[LEOC] answer status: ${(_b = (_a = yourAnswerPre.textContent) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : ''}`); // Pending
                const observer2 = new MutationObserver(() => {
                    var _a, _b, _c, _d;
                    // Pending から別の内容に切り替わったときに走る
                    console.log(`[LEOC] observer2 callback triggered. status: ${(_b = (_a = yourAnswerPre.textContent) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : ''}`);
                    // pre の中に span があり，各 span が行になっている．
                    // br は textContent では消えるので，span を走査して答えを集める
                    const answerSpans = Array.from(yourAnswerPre.querySelectorAll('span'));
                    console.log('[LEOC] answerSpans', answerSpans);
                    // 出力の個数が一致しないなら，やめる
                    if (outputs.length !== answerSpans.length)
                        return;
                    // 入力がサンプルと同一かどうか
                    if (((_c = yourInputPre.textContent) === null || _c === void 0 ? void 0 : _c.trim()) !== pageData.questionExampleTestcases.trim()) {
                        return;
                    }
                    console.log('[LEOC] Example testcase execution detected');
                    // 監視を停止する
                    observer2.disconnect();
                    // AC かどうか判定していく
                    for (let i = 0; i < answerSpans.length; ++i) {
                        const yourAnswer = (_d = answerSpans[i].textContent) === null || _d === void 0 ? void 0 : _d.trim();
                        const expectedAnswer = outputs[i];
                        console.log(`[LEOC] yourAnswer: ${yourAnswer !== null && yourAnswer !== void 0 ? yourAnswer : ''}, expected: ${expectedAnswer}`);
                        if (yourAnswer === expectedAnswer) {
                            answerSpans[i].insertAdjacentHTML('beforeend', label_ac);
                        }
                        else {
                            answerSpans[i].insertAdjacentHTML('beforeend', label_wa);
                        }
                    }
                });
                const config2 = {
                    attributes: true,
                    childList: true,
                    characterData: true,
                };
                observer2.observe(yourAnswerPre, config2);
            });
            const config = {
                attributes: true,
                childList: true,
                characterData: true,
            };
            console.log('[LEOC] result_div', result_div);
            observer.observe(result_div, config);
        };
        window.setTimeout(onload, 2000);
    });
})();
