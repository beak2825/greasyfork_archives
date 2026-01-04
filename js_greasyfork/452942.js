// ==UserScript==
// @name         UGATU SDO ANSWERS SCRIPT
// @namespace    https://t.me/+AzlTc2COncJmYzAy
// @version      2.2.3
// @description  Показ верных ответов на сайте СДО УГАТУ!
// @author       GuFFy_OwO
// @match        https://sdo.ugatu.su/*
// @icon         https://sdo.ugatu.su/pluginfile.php/1/theme_opentechnology/settings_setugatu_header_logoimage/1664187092/Z3_222.png
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452942/UGATU%20SDO%20ANSWERS%20SCRIPT.user.js
// @updateURL https://update.greasyfork.org/scripts/452942/UGATU%20SDO%20ANSWERS%20SCRIPT.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const getAnswersData_module_1 = __importDefault(__webpack_require__(1));
const getQuizPercent_module_1 = __importDefault(__webpack_require__(6));
const postQuizzesData_module_1 = __importDefault(__webpack_require__(7));
const responseFormPatch_module_1 = __importDefault(__webpack_require__(8));
const getCmId_util_1 = __importDefault(__webpack_require__(9));
const cmId = (0, getCmId_util_1.default)();
const responseForm = document.getElementById('responseform');
if (cmId && responseForm) {
    (0, responseFormPatch_module_1.default)(cmId, responseForm);
    (0, getAnswersData_module_1.default)(cmId, responseForm);
}
const quizAttemptSummaryTable = document.querySelector('.generaltable.quizattemptsummary');
if (cmId && quizAttemptSummaryTable) {
    (0, getQuizPercent_module_1.default)(cmId, quizAttemptSummaryTable);
    (0, postQuizzesData_module_1.default)();
}


/***/ }),
/* 1 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const getQuestionsData_util_1 = __importDefault(__webpack_require__(2));
const createAnswerTable_module_1 = __importDefault(__webpack_require__(5));
exports["default"] = (cmId, responseForm) => {
    const questionsData = (0, getQuestionsData_util_1.default)(responseForm);
    if (!questionsData)
        return;
    questionsData.forEach((questionData) => {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://vernibabki.ru/usatu-sdo-answers/api/v1/getAnswerData',
            data: JSON.stringify({
                cmId,
                question: questionData.question,
                answersOptions: questionData.answersOptions,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            onload: function (response) {
                if (response) {
                    if (response.status === 200) {
                        (0, createAnswerTable_module_1.default)(JSON.parse(response.responseText), questionData.questionParams);
                    }
                    console.log('Get Answer response =>', response);
                }
            },
        });
    });
};


/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const innerHtmlParser_util_1 = __importDefault(__webpack_require__(3));
const questionDataParsers_util_1 = __webpack_require__(4);
exports["default"] = (responseForm) => {
    return Array.from(responseForm.querySelectorAll('div > *[id^="question"]')).reduce((questionsData, questionBlockElement) => {
        var _a;
        const question = (_a = questionBlockElement.querySelector('.qtext')) === null || _a === void 0 ? void 0 : _a.innerHTML;
        if (!question)
            return questionsData;
        const choiceQuestion = (0, questionDataParsers_util_1.choiceQuestionParser)(questionBlockElement);
        const textQuestion = (0, questionDataParsers_util_1.textQuestionParser)(questionBlockElement);
        const matchQuestion = (0, questionDataParsers_util_1.matchQuestionParser)(questionBlockElement);
        const essayQuestion = (0, questionDataParsers_util_1.essayQuestionParser)(questionBlockElement);
        questionsData.push({
            question: (0, innerHtmlParser_util_1.default)(question),
            questionParams: {
                questionId: questionBlockElement.id.split('-')[1],
                questionNumber: questionBlockElement.id.split('-')[2],
            },
            answersOptions: [
                ...choiceQuestion.answersOptions,
                ...textQuestion.answersOptions,
                ...matchQuestion.answersOptions,
                ...essayQuestion.answersOptions,
            ].sort(),
            answers: [
                ...choiceQuestion.answers,
                ...textQuestion.answers,
                ...matchQuestion.answers,
                ...essayQuestion.answers,
            ].sort(),
        });
        return questionsData;
    }, []);
};


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = (innerHTML) => {
    return replaceHtmlEntities(innerHTML
        .replace(/<span class="answernumber">\w. <\/span>/g, '')
        .replace(/<img[^>]+src="([^">]+)".*>/g, '$1')
        .replace(/<\/?[^>]+(>|$)/g, ' ')
        .replace(/\/question\/questiontext\/\d+\/\d+\//g, '/question/questiontext/QUESTIONID/QUESTIONNUMBER/')
        .replace(/\/question\/answer\/\d+\/\d+\//g, '/question/answer/QUESTIONID/QUESTIONNUMBER/'))
        .replace(/\s\s+/g, ' ')
        .trim();
};
const translate_re = /&(nbsp|amp|quot|lt|gt);/g;
const translate = {
    nbsp: ' ',
    amp: '&',
    quot: '"',
    lt: '<',
    gt: '>',
};
const replaceHtmlEntities = (string) => {
    return string.replace(translate_re, (match, entity) => {
        return translate[entity];
    });
};


/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.essayQuestionParser = exports.matchQuestionParser = exports.textQuestionParser = exports.choiceQuestionParser = void 0;
const innerHtmlParser_util_1 = __importDefault(__webpack_require__(3));
const arrayToString = (array) => {
    return '[' + array.map((el) => `"${(0, innerHtmlParser_util_1.default)(el.innerHTML)}"`).join(', ') + ']';
};
const choiceQuestionParser = (questionBlockElement) => {
    return Array.from(questionBlockElement.querySelectorAll('.answer input[type="checkbox"], .answer input[type="radio"]')).reduce((result = { answersOptions: [], answers: [] }, item) => {
        if (!item.nextElementSibling)
            return result;
        const innerHTML = (0, innerHtmlParser_util_1.default)(item.nextElementSibling.innerHTML);
        result.answersOptions.push(innerHTML);
        if (item.checked)
            result.answers.push(innerHTML);
        return result;
    }, { answersOptions: [], answers: [] });
};
exports.choiceQuestionParser = choiceQuestionParser;
const textQuestionParser = (questionBlockElement) => {
    return Array.from(questionBlockElement.querySelectorAll('.answer input[type="text"]')).reduce((result = { answersOptions: [], answers: [] }, item) => {
        result.answers.push((0, innerHtmlParser_util_1.default)(item.value));
        return result;
    }, { answersOptions: [], answers: [] });
};
exports.textQuestionParser = textQuestionParser;
const matchQuestionParser = (questionBlockElement) => {
    return Array.from(questionBlockElement.querySelectorAll('.answer select')).reduce((result = { answersOptions: [], answers: [] }, item) => {
        if (!item.parentElement || !item.parentElement.previousElementSibling)
            return result;
        result.answersOptions.push(`${(0, innerHtmlParser_util_1.default)(item.parentElement.previousElementSibling.innerHTML)}: ${arrayToString(Array.from(item.options))}`);
        result.answers.push(`${(0, innerHtmlParser_util_1.default)(item.parentElement.previousElementSibling.innerHTML)}: ${(0, innerHtmlParser_util_1.default)(item.options[item.selectedIndex].innerHTML)}`);
        return result;
    }, { answersOptions: [], answers: [] });
};
exports.matchQuestionParser = matchQuestionParser;
const essayQuestionParser = (questionBlockElement) => {
    return Array.from(questionBlockElement.querySelectorAll('.answer textarea')).reduce((result = { answersOptions: [], answers: [] }, item) => {
        result.answers.push((0, innerHtmlParser_util_1.default)(item.value));
        return result;
    }, { answersOptions: [], answers: [] });
};
exports.essayQuestionParser = essayQuestionParser;


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = (answersData, { questionId, questionNumber }) => {
    const table = document.createElement('table');
    table.classList.add('styled-table');
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    const thPercent = document.createElement('th');
    thPercent.textContent = 'Процент';
    thPercent.style.color = 'white';
    const thUsage = document.createElement('th');
    thUsage.textContent = 'Количество использований';
    thUsage.style.color = 'white';
    const thLastUsage = document.createElement('th');
    thLastUsage.textContent = 'Дата последнего использования';
    thLastUsage.style.color = 'white';
    const thAnswer = document.createElement('th');
    thAnswer.textContent = 'Ответ';
    thAnswer.style.color = 'white';
    tr.appendChild(thPercent);
    tr.appendChild(thUsage);
    tr.appendChild(thLastUsage);
    tr.appendChild(thAnswer);
    thead.appendChild(tr);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    answersData.forEach((answerData) => {
        const tr = document.createElement('tr');
        const tdPercent = document.createElement('td');
        tdPercent.textContent = answerData.percent ? answerData.percent.toString() : 'Не известен';
        const tdUsage = document.createElement('td');
        tdUsage.textContent = answerData.count.toString();
        const tdLastUsage = document.createElement('td');
        tdLastUsage.textContent = new Date(answerData.updatedAt).toLocaleString('en-GB');
        const tdAnswers = document.createElement('td');
        tdAnswers.textContent = JSON.stringify(answerData._id.map((answer) => answer.replace('QUESTIONID', questionId).replace('QUESTIONNUMBER', questionNumber)));
        tr.appendChild(tdPercent);
        tr.appendChild(tdUsage);
        tr.appendChild(tdLastUsage);
        tr.appendChild(tdAnswers);
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    table.style.borderCollapse = 'collapse';
    table.style.margin = '25px auto';
    table.style.fontSize = '0.9em';
    table.style.fontFamily = 'sans-serif';
    table.style.minWidth = '400px';
    table.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.15)';
    thead.style.backgroundColor = '#009879';
    thead.style.color = '#009879';
    thead.style.textAlign = 'left';
    const ths = tr.querySelectorAll('th');
    const tds = tr.querySelectorAll('td');
    ths.forEach((th) => {
        th.style.padding = '12px 15px';
    });
    tds.forEach((td) => {
        td.style.padding = '12px 15px';
    });
    const trs = tbody.querySelectorAll('tr');
    trs.forEach((tr, index) => {
        if (index % 2 === 0) {
            tr.style.backgroundColor = '#f3f3f3';
        }
        tr.style.borderBottom = '1px solid #dddddd';
    });
    const lastRow = document.querySelector('tr:last-of-type');
    if (lastRow) {
        lastRow.style.borderBottom = '2px solid #009879';
    }
    const activeRow = document.querySelector('.active-row');
    if (activeRow) {
        activeRow.style.fontWeight = 'bold';
        activeRow.style.color = '#009879';
    }
    document.body.appendChild(table);
};


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = (cmId, quizAttemptSummaryTable) => {
    var _a;
    if (!localStorage.quizzesData)
        localStorage.quizzesData = JSON.stringify({});
    const quizzesData = JSON.parse(localStorage.quizzesData);
    const rateColumn = quizAttemptSummaryTable.querySelectorAll('td.cell.c2');
    const score = rateColumn[rateColumn.length - 1].innerHTML.replace(',', '.');
    const rateHeader = (_a = quizAttemptSummaryTable.querySelector('th.header.c2')) === null || _a === void 0 ? void 0 : _a.textContent;
    if (!rateHeader)
        return "Can't find rate header";
    const maxScoreRegexp = rateHeader.match(/\d+,\d+/);
    if (!maxScoreRegexp)
        return "Can't find max score";
    const maxScore = maxScoreRegexp[0].replace(',', '.');
    const percent = (parseFloat(score) / parseFloat(maxScore)) * 100;
    if (!Object.keys(quizzesData).includes(cmId)) {
        return "Can't find quiz data, maybe you haven't passed the quiz";
    }
    else if (score === '') {
        return "Can't find score, quiz is not finished";
    }
    else if (score === 'Еще не оценено') {
        quizzesData[cmId].percent = undefined;
    }
    else if (!isNaN(percent)) {
        quizzesData[cmId].percent = percent;
    }
    else {
        return "Can't parse score, table is broken";
    }
    localStorage.quizzesData = JSON.stringify(quizzesData);
};


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = () => {
    if (!localStorage.quizzesData)
        localStorage.quizzesData = JSON.stringify({});
    const quizzesData = JSON.parse(localStorage.quizzesData);
    Object.keys(quizzesData).forEach((cmId) => {
        if (quizzesData[cmId].percent === null)
            return `Quiz with cmId ${cmId} is not finished`;
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://vernibabki.ru/usatu-sdo-answers/api/v1/postQuizData',
            data: JSON.stringify({
                cmId,
                percent: quizzesData[cmId].percent,
                questionsData: quizzesData[cmId].questionsData,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            onload: function (response) {
                if (response && response.status !== 429) {
                    delete quizzesData[cmId];
                    localStorage.quizzesData = JSON.stringify(quizzesData);
                }
                console.log('Post Quiz Data response =>', response);
            },
        });
    });
};


/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const getQuestionsData_util_1 = __importDefault(__webpack_require__(2));
exports["default"] = (cmId, responseForm) => {
    responseForm.addEventListener('submit', () => {
        if (!localStorage.quizzesData)
            localStorage.quizzesData = JSON.stringify({});
        const quizzesData = JSON.parse(localStorage.quizzesData);
        if (!quizzesData[cmId]) {
            quizzesData[cmId] = {
                percent: null,
                questionsData: [],
            };
        }
        const quizData = quizzesData[cmId];
        const questionsData = (0, getQuestionsData_util_1.default)(responseForm);
        if (!questionsData)
            return "Can't get questions data";
        questionsData.forEach((questionData) => {
            const foundedQuestionData = quizData.questionsData.find((item) => item.question === questionData.question &&
                JSON.stringify(item.answersOptions) === JSON.stringify(questionData.answersOptions));
            if (foundedQuestionData) {
                foundedQuestionData.answers = questionData.answers;
            }
            else {
                quizData.questionsData.push(questionData);
            }
        });
        localStorage.quizzesData = JSON.stringify(quizzesData);
    });
};


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = () => {
    var _a;
    return (_a = Array.from(document.body.classList)
        .find((className) => className.includes('cmid-'))) === null || _a === void 0 ? void 0 : _a.split('-')[1];
};


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/************************************************************************/
/******/
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/
/******/ })()
;