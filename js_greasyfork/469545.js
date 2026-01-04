// ==UserScript==
// @name        HIT 课程筛选
// @namespace   Violentmonkey Scripts
// @match       http://jwes.hit.edu.cn/queryWsyyIndex*
// @match       http://jwes.hit.edu.cn/onBackMain
// @grant       none
// @version     1.02
// @author      bloodycrown
// @license MIT
// @supportURL  https://github.com/bloodycrownD/cousrs-classification/issues
// @namespace   https://github.com/bloodycrownD/cousrs-classification
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.js
// @description 这个脚本主要是为了筛选出自己所需要课程，以便于对照培养方案，找出缺少的学分。还可以查看gpa和总学分。
// @downloadURL https://update.greasyfork.org/scripts/469545/HIT%20%E8%AF%BE%E7%A8%8B%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/469545/HIT%20%E8%AF%BE%E7%A8%8B%E7%AD%9B%E9%80%89.meta.js
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
const jquery_1 = __importDefault(__webpack_require__(1));
// import "jquery-ui-dist/jquery-ui.min"
const Tabs_1 = __webpack_require__(2);
const DataList_1 = __webpack_require__(4);
const utils_1 = __webpack_require__(6);
// import { formdata } from "./test/test"
const SelectMenu_1 = __webpack_require__(7);
jquery_1.default.post("http://jwes.hit.edu.cn/cjcx/queryQmcj", { pageNo: 1, pageSize: 100, pageCount: 2 }, data => {
    const formdata = (0, utils_1.getFormData)(data);
    (0, jquery_1.default)("<div id='root'></div>")
        .appendTo(".Contentbox .pd10");
    // Tabs().appendTo("#root")
    (0, Tabs_1.Tabs)({
        heads: ['总览', '文化素质教育课', 'MOOC', "自定义"],
        contentsIDs: (0, utils_1.getContensIDs)('总览content', '素质content', 'MOOCcontent', '自定义content'),
        footInfoIDs: (0, utils_1.getContensIDs)('总览footInfo', '素质footInfo', 'MOOCfootInfo', "自定义footInfo")
    }).appendTo("#root");
    (0, DataList_1.DataList)({
        colHeads: [
            '学年学期',
            "开课院系",
            "课程代码",
            "课程名称",
            "课程性质",
            "课程类别",
            "学分",
            "是否考试课",
            "参与学分绩",
            "总成绩",
            "教学班排名"
        ],
        data: formdata,
    }).appendTo((0, utils_1.getIdSelector)('总览content'));
    function normalAlgorithm(score) {
        if (score <= 100 && score >= 90)
            return 4.0;
        if (score < 90 && score >= 80)
            return 3.0;
        if (score < 80 && score >= 70)
            return 2.0;
        if (score < 70 && score >= 60)
            return 1.0;
        return 0;
    }
    function peikingAlgorithm(score) {
        if (score <= 100 && score >= 90)
            return 4.0;
        if (score < 90 && score >= 85)
            return 3.7;
        if (score < 85 && score >= 82)
            return 3.3;
        if (score < 82 && score >= 78)
            return 3.0;
        if (score < 78 && score >= 75)
            return 2.7;
        if (score < 75 && score >= 72)
            return 2.3;
        if (score < 72 && score >= 68)
            return 2.0;
        if (score < 68 && score >= 64)
            return 1.5;
        if (score < 64 && score >= 60)
            return 1.0;
        return 0;
    }
    const totalScore = formdata.map(m => Number(m[6])).reduce((x, y) => x + y);
    const normalGPA = (formdata.map(m => Number(m[6]) * normalAlgorithm(Number(m[9]))).reduce((x, y) => x + y) / totalScore).toFixed(2);
    const peikingGPA = (formdata.map(m => Number(m[6]) * peikingAlgorithm(Number(m[9]))).reduce((x, y) => x + y) / totalScore).toFixed(2);
    // const creditScore = (formdata.filter(f=>f[7].trim() === '是').map(m =>Number(m[6]) * Number(m[9])).reduce((x, y) => x + y)/formdata.filter(f=>f[7].trim() === '是').map(m => Number(m[6])).reduce((x, y) => x + y)).toFixed(2)
    (0, jquery_1.default)((0, utils_1.getIdSelector)("总览footInfo")).html(`<p>总学分：${totalScore}&nbsp;&nbsp;&nbsp;(GPA) 标准算法：${normalGPA} | 北大4.0：${peikingGPA}</p>`);
    (0, DataList_1.DataList)({
        colHeads: [
            '学年学期',
            "开课院系",
            "课程代码",
            "课程名称",
            "课程性质",
            "课程类别",
            "学分",
            "是否考试课",
            "参与学分绩",
            "总成绩",
            "教学班排名"
        ],
        data: formdata.filter(f => f[5].includes('素质')),
    }).appendTo((0, utils_1.getIdSelector)("素质content"));
    (0, jquery_1.default)((0, utils_1.getIdSelector)("素质footInfo")).html(`<p>总学分：${formdata.filter(f => f[5].includes('素质')).map(m => Number(m[6])).reduce((x, y) => x + y)}</p>`);
    (0, DataList_1.DataList)({
        colHeads: [
            '学年学期',
            "开课院系",
            "课程代码",
            "课程名称",
            "课程性质",
            "课程类别",
            "学分",
            "是否考试课",
            "参与学分绩",
            "总成绩",
            "教学班排名"
        ],
        data: formdata.filter(f => f[5].includes('MOOC')),
    }).appendTo((0, utils_1.getIdSelector)("MOOCcontent"));
    (0, jquery_1.default)((0, utils_1.getIdSelector)("MOOCfootInfo")).html(`<p>总学分：${formdata.filter(f => f[5] === 'MOOC').map(m => Number(m[6])).reduce((x, y) => x + y)}</p>`);
    (0, DataList_1.DataList)({
        dataID: "customDataList",
        colHeads: ["", "", "课程代码", "课程名称", "", "", "", "", "", "总成绩", "教学班排名"],
        data: formdata,
        colHeadIds: (0, utils_1.getContensIDs)('学年学期', "开课院系", "课程代码", "课程名称", "课程性质", "课程类别", "学分", "是否考试课", "参与学分绩", "总成绩", "教学班排名")
    }).appendTo((0, utils_1.getIdSelector)("自定义content"));
    (0, jquery_1.default)((0, utils_1.getIdSelector)("自定义footInfo")).html(`<p>总学分：${formdata.map(m => Number(m[6])).reduce((x, y) => x + y)}</p>`);
    (0, SelectMenu_1.SelectMenu)({ items: [...new Set(formdata.map(m => m[0]))] }).appendTo((0, utils_1.getIdSelector)('学年学期'));
    (0, SelectMenu_1.SelectMenu)({ items: [...new Set(formdata.map(m => m[1]))] }).appendTo((0, utils_1.getIdSelector)("开课院系"));
    // SelectMenu({items:[...new Set(formdata.map(m=>m[2]))]}).appendTo(getIdSelector("课程代码",))
    // SelectMenu({items:[...new Set(formdata.map(m=>m[3]))]}).appendTo(getIdSelector("课程名称",))
    (0, SelectMenu_1.SelectMenu)({ items: [...new Set(formdata.map(m => m[4]))] }).appendTo((0, utils_1.getIdSelector)("课程性质"));
    (0, SelectMenu_1.SelectMenu)({ items: [...new Set(formdata.map(m => m[5]))] }).appendTo((0, utils_1.getIdSelector)("课程类别"));
    (0, SelectMenu_1.SelectMenu)({ items: [...new Set(formdata.map(m => m[6]))] }).appendTo((0, utils_1.getIdSelector)("学分"));
    (0, SelectMenu_1.SelectMenu)({ items: [...new Set(formdata.map(m => m[7]))] }).appendTo((0, utils_1.getIdSelector)("是否考试课"));
    (0, SelectMenu_1.SelectMenu)({ items: [...new Set(formdata.map(m => m[8]))] }).appendTo((0, utils_1.getIdSelector)("参与学分绩"));
    // SelectMenu({items:[...new Set(formdata.map(m=>m[9]))]}).appendTo(getIdSelector("总成绩",))
    // SelectMenu({items:[...new Set(formdata.map(m=>m[10]))]}).appendTo(getIdSelector("教学班排名"))
    (0, DataList_1.DataListCSS)();
    (0, Tabs_1.TabCSS)();
    (0, SelectMenu_1.SelectMenuEvent)(formdata);
    (0, jquery_1.default)(`#tabs > div .footInfo p`).css({
        padding: '10px',
        color: 'red'
    });
    (0, jquery_1.default)("#root").css({
        paddingTop: '20px',
        width: "100%"
    });
});


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = jQuery;

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Tabs = void 0;
const jquery_1 = __importDefault(__webpack_require__(1));
__exportStar(__webpack_require__(3), exports);
function Tabs({ heads = [], contentsIDs = [], footInfoIDs = [] }) {
    return (0, jquery_1.default)(`<div id="tabs">
                <ul class="tabUl">
                    ${heads.map(h => `<li class="tabLi">${h}</li>`).join('')}
                </ul>
                ${contentsIDs.map((val, index) => `<div >
                            <div id="${val}" class='content'></div>
                            <div id="${footInfoIDs[index]}" style="${footInfoIDs[index] ? "" : "display:none;"}" class='footInfo'></div>
                        </div>`).join('')}
            </div>`);
}
exports.Tabs = Tabs;


/***/ }),
/* 3 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TabCSS = void 0;
const jquery_1 = __importDefault(__webpack_require__(1));
class TabCSSOption {
    constructor() {
        this.width = '100%';
    }
}
function TabCSS(option = new TabCSSOption()) {
    (0, jquery_1.default)("#tabs > div:not(:nth-of-type(1))").css({
        display: "none"
    });
    (0, jquery_1.default)("#tabs .tabUl li").on("click", function () {
        const activeIndex = (0, jquery_1.default)("#tabs .tabUl li").index(this);
        (0, jquery_1.default)("#tabs > div").css({
            display: "none"
        });
        (0, jquery_1.default)("#tabs .tabUl li").css({
            borderBottom: "1px solid #e7ebf0",
            color: 'black'
        });
        (0, jquery_1.default)(`#tabs > div`).get(activeIndex).style.display = 'block';
        (0, jquery_1.default)("#tabs .tabUl li").get(activeIndex).style.borderBottom = "3px solid #1976d2";
        (0, jquery_1.default)("#tabs .tabUl li").get(activeIndex).style.color = "#1976d2";
    });
    (0, jquery_1.default)(`#tabs * `).css({
        padding: '0',
        margin: '0',
    });
    (0, jquery_1.default)(`#tabs `).css({
        border: '#e7ebf0 1px solid',
        paddingTop: '10px',
        width: `${option.width}`,
    });
    (0, jquery_1.default)(`#tabs .tabUl `).css({
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'row',
    });
    (0, jquery_1.default)(`#tabs .tabLi `).css({
        borderBottom: '1px solid #e7ebf0',
        paddingBottom: '10px',
        flexGrow: '1',
        textAlign: 'center',
    });
    (0, jquery_1.default)(`#tabs > div `).css({
        padding: '10px 0',
    });
    (0, jquery_1.default)(`#tabs > div .footInfo`).css({
        borderTop: '#e7ebf0 1px solid',
        margin: "20",
        border: '1px #999999 solid',
        marginTop: '12px',
        height: '40px',
        background: '#eeeeee'
    });
    (0, jquery_1.default)(`#tabs > div .content `).css({
        overflowY: 'scroll',
        height: "50vh"
    });
}
exports.TabCSS = TabCSS;


/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DataList = void 0;
const jquery_1 = __importDefault(__webpack_require__(1));
__exportStar(__webpack_require__(5), exports);
function DataList({ title = '', colHeads = [], data = [[]], name = 'default', colHeadIds = [], dataID }) {
    return (0, jquery_1.default)(`<table class="${name}Table">
       <!-- <caption class="${name}Caption">${title}</caption>-->
        <thead class='${name}Thead'>
            <tr class='${name}Tr'>
                ${colHeads.map((val, index) => `<th ${colHeadIds[index] ? `id="${colHeadIds[index]}"` : ""} class='${name}Th'>${val}</th>`).join('')}
            </tr>
        </thead>
        <tbody class='${name}Tbody' ${dataID ? `id='${dataID}'` : ""}>
            ${data.map(row => `<tr class='${name}Tr'>${row.map(rd => `<td class='${name}Td'>${rd}</td>`).join("")}</tr>`).join("")}
        </tbody>
    </table>`);
}
exports.DataList = DataList;


/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DataListCSS = void 0;
const jquery_1 = __importDefault(__webpack_require__(1));
class DataListCSSOption {
    constructor() {
        this.name = 'default';
    }
}
function DataListCSS(option = new DataListCSSOption()) {
    const { name } = option;
    (0, jquery_1.default)(`.${name}Table`).css({
        width: '100%',
        borderCollapse: 'collapse',
    });
    // $(`.${name}Caption`).css({
    //     fontSize: '2em',
    //     fontWeight: 'bold',
    //     margin: '1em 0'
    // })
    (0, jquery_1.default)(`.${name}Th,.${name}Td`).css({
        border: '1px solid #999',
        textAlign: ' center',
        // padding: '20px 0'
    });
    (0, jquery_1.default)(`.${name}Table .${name}Thead .${name}Tr`).css({
        backgroundColor: '#008c8c',
        color: '#fff'
    });
    (0, jquery_1.default)(`.${name}Table .${name}Tbody .${name}Tr:nth-child(odd)`).css({
        backgroundColor: '#eee'
    });
    (0, jquery_1.default)(`.${name}Table .${name}Tbody .${name}Tr .${name}Td:first-child`).css({
        color: '#f40'
    });
    // $(`.${name}Table tfoot .${name}Td`).css({
    //     textAlign: 'left',
    //     paddingLeft: `20px`
    // })   
    let tmpColor;
    (0, jquery_1.default)(`.${name}Table .${name}Tbody .${name}Tr`).off();
    (0, jquery_1.default)(`.${name}Table .${name}Tbody .${name}Tr`)
        .on("mouseenter", function () {
        tmpColor = (0, jquery_1.default)(this).css("backgroundColor");
        (0, jquery_1.default)(this).css({
            backgroundColor: "#CCC"
        });
    })
        .on("mouseleave", function () {
        (0, jquery_1.default)(this).css({
            backgroundColor: tmpColor
        });
    });
}
exports.DataListCSS = DataListCSS;


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIdSelector = exports.getContensIDs = exports.getUniqueId = exports.getFormData = void 0;
const trReg = /<tr.*?<\/tr>/igs;
const tdReg = /<td>(?<data>.*?)<\/td>/igs;
const tableReg = /<table width="100%"  cellpadding="0" cellspacing="0" style="border-collapse:collapse" class="bot_line">.*?<\/table>/igs;
function getFormData(html) {
    const htmltext = html.match(tableReg);
    const tmpTr = htmltext[0].match(trReg);
    const fromData = [];
    tmpTr?.slice(1).map(m => {
        const tmptd = m.matchAll(tdReg);
        const dataGroup = [];
        for (const iterator of tmptd) {
            dataGroup.push(iterator.groups?.data);
        }
        const finalGroup = dataGroup.slice(1, 10);
        finalGroup.push(dataGroup[11]);
        finalGroup.push(dataGroup[13]);
        fromData.push(finalGroup);
    });
    return fromData;
}
exports.getFormData = getFormData;
function getUniqueId(id) {
    let hash = 0;
    if (id.length === 0)
        return '0';
    for (let i = 0; i < id.length; i++) {
        const char = id.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return String(hash);
}
exports.getUniqueId = getUniqueId;
function getContensIDs(...ids) {
    return ids.map(m => getUniqueId(m));
}
exports.getContensIDs = getContensIDs;
function getIdSelector(id) {
    return `#${getUniqueId(id)}`;
}
exports.getIdSelector = getIdSelector;


/***/ }),
/* 7 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SelectMenu = void 0;
const jquery_1 = __importDefault(__webpack_require__(1));
__exportStar(__webpack_require__(8), exports);
class SelectMenuOption {
    constructor() {
        this.items = [];
        this.id = 'selectMenu';
    }
}
function SelectMenu(option = new SelectMenuOption()) {
    const { items } = option;
    return (0, jquery_1.default)(`<select name="selectMenu"  class="selectMenu">
                <option selected value='全部'>全部</option>
                ${items?.map(m => `<option value='${m}'>${m.trim() || "否"}</option>`)}
            </select>`);
}
exports.SelectMenu = SelectMenu;


/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SelectMenuEvent = void 0;
const jquery_1 = __importDefault(__webpack_require__(1));
const utils_1 = __webpack_require__(6);
const DataList_1 = __webpack_require__(4);
function SelectMenuEvent(formdata) {
    (0, jquery_1.default)(".selectMenu").on("change", function () {
        const selectVal = [];
        (0, jquery_1.default)(".selectMenu option:selected").each(function () {
            selectVal.push((0, jquery_1.default)(this).val());
        });
        const filtedData = formdata.filter(f => selectVal.every((val, index) => {
            if (val === "全部")
                return true;
            //数据的索引与表格位置不完全对应
            if (index > 1)
                return val.trim() === f[index + 2].trim();
            return val.trim() === f[index].trim();
        }));
        (0, jquery_1.default)("#customDataList").html(`${filtedData.map(row => `<tr class='defaultTr'>${row.map(rd => `<td class='defaultTd'>${rd}</td>`).join("")}</tr>`).join("")}`);
        const scores = filtedData.length ? filtedData.map(m => Number(m[6])).reduce((x, y) => x + y) : 0;
        // const dataFiltedByCredit = !filtedData||filtedData.filter(f=>f[7].trim() === '')
        // const creditScore = dataFiltedByCredit.length?dataFiltedByCredit.map(m =>Number(m[6]) * Number(m[9])).reduce((x, y) => x + y)
        (0, jquery_1.default)((0, utils_1.getIdSelector)("自定义footInfo")).html(`<p>${scores ? `总学分：${scores}` : ''}</p>`);
        (0, DataList_1.DataListCSS)();
        (0, jquery_1.default)(`#tabs > div .footInfo p`).css({
            padding: '10px',
            color: 'red'
        });
    });
}
exports.SelectMenuEvent = SelectMenuEvent;


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