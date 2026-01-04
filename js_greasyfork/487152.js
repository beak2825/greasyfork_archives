// ==UserScript==
// @name jedipedia-file-reader-cnv-tree
// @version 4.0
// @namespace https://github.com/rendurok/jedipedia-file-reader-cnv-tree
// @description Improves the conversation tree display of the Jedipedia File Reader.
// @author rendurok
// @homepage https://github.com/rendurok/jedipedia-file-reader-cnv-tree#readme
// @license MIT
// @match https://swtor.jedipedia.net/reader
// @run-at document-idle
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/487152/jedipedia-file-reader-cnv-tree.user.js
// @updateURL https://update.greasyfork.org/scripts/487152/jedipedia-file-reader-cnv-tree.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 935:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.menuCSS = exports.cnvTreeCSS = void 0;
exports.cnvTreeCSS = `
ul{
  display:inline-block; float: left; clear: left;
  margin:1px 0 0 1px;
  padding:0;
}
ul:before{
  content:""; position: absolute; z-index: 1;
  top:.25em; right:auto; bottom:0; left: 1.75em; 
  margin: auto;
  border-right: solid #e9bd54 .1em;
  width: 0; height: auto;
}
ul:after{
  content: "-"; position: absolute; z-index: 3;
  top:0; left:-.5em;
  margin-left:.65em; margin-top:.3em ;padding:0;
  width:.8em; height: .8em; 
  text-align:center; line-height: .6em; font-size: 1em;
  background: rgb(1, 6, 10);
}
ul>li{
  display: block; position: relative; float: left; clear: both;
  right:auto;
  padding-left: 1em;
  width:auto;
}
ul>li>input{
  display:block; position: absolute; float: left; z-index: 4;
  margin:0 0 0 -1em; padding:0;
  width:1em; height: 2em;
  font-size: 1em;
  opacity: 0;
  cursor: pointer;
}
ul>li>input:checked~ul:before{
  display: none;
}
ul>li>input:checked~ul:after{
  content: "+"
}
ul>li>input:checked~ul *{
  display: none;
}
ul>li>span{
  display: block; position: relative; float: left; z-index: 3;
  margin-left:.25em; padding:.25em;
  background: rgb(1, 6, 10);
}
.cnv-childless:after{
  content: ""; display: block; position: absolute;
  left:-1em; top:0; bottom:0;
  margin: auto .25em auto .25em;
  border-top: solid #e9bd54 .1em;
  width: .75em; height: 0;
}

ul>li:last-child:before{
  content: ""; display: block; position: absolute; z-index: 2;
  top:1em; left:0; bottom:-.25em;
  width:.75em; height:auto;
  background: rgb(1, 6, 10)
}

.tree{
  position: relative;
  font-weight: 400;
  background: rgb(1, 6, 10);
  cursor: auto;
}
.tree:before{
  left:.5em;
  display: none
}
.tree:after{
  display: none;
}

.cnv-force-light{
  color: #43c4ef;
}
.cnv-force-dark{
  color: red;
}
.cnv-end{
  color: gray;
}
.cnv-util{
  color: #e9bd54;
}
.cnv-player{
  color: #ff62c1;
}
.cnv-npc{
  color: #00cc00;
}
.cnv-option{
  color: lightgray;
}
.cnv-generic{
  color: #e9bd54
}
.cnv-link{
  color: purple;
  cursor: pointer;
}
.cnv-cnd{
  color: #e173ff;
}

.cnv-node>span{
  padding-right: .25em
}

.cnv-reactions{
  padding-left: 3em;
  color: #c896ff;
}
.cnv-reactions>tbody>tr>td:first-child{
  padding-right: .5em
}

ul>li{
  background: transparent;
}
ul:after{
  border:solid #e9bd54 1px;
  border-radius: .1em;
  color: #e9bd54;
}
ul>li>span{	
  border-radius: .25em;
  border: 1px solid #e9bd54;
  color: white
}
.cnv-id{
  color: #e9bd54;
}

.cnv-highlight{
  background: purple;
}
`;
exports.menuCSS = `
#cnv-menu-collapser {
  -webkit-appearance: none;
  appearance: none;

  width: 1.5em;
  border: 2px solid #225c81;
  border-radius: 5px;
  padding: 3px;
  cursor: pointer;
}

#cnv-menu-collapser::before {
  display: grid;
  place-content: center;
  content: "v";
}

#cnv-menu-collapser:checked::before {
  content: ">";
}

#cnv-menu-collapser:checked~#cnv-menu {
  display:none
}

#cnv-menu {
  position: absolute; 
  z-index: 10;
  background: #01060a;
  border: 1px solid #225c81;
  padding: 4px;
}

#cnv-menu>form>fieldset {
  display: flex;
  column-gap: 10px;
}

#cnv-menu>form button {
  width: min-content;
}
`;


/***/ }),

/***/ 699:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIdNode = exports.getCurrentCnvTree = exports.getCurrentCnvContainer = exports.getCurrentPage = void 0;
function getCurrentPage() {
    const page = document.querySelector('#pages>div:not(.hidden):not(#page-0)');
    if (!page)
        throw new Error('current page not found');
    const pageId = page.id.split('-')[1];
    if (!pageId)
        throw new Error('page has no id');
    return [page, pageId];
}
exports.getCurrentPage = getCurrentPage;
function getCurrentCnvContainer() {
    const [page, id] = getCurrentPage();
    let container = document.querySelector(`#cnv-container-${id}`);
    if (!container) {
        container = page.querySelector('.dialogue.text');
        if (!container)
            throw new Error('cannot retrieve container');
        container.id = `cnv-container-${id}`;
    }
    return container;
}
exports.getCurrentCnvContainer = getCurrentCnvContainer;
function getCurrentCnvTree() {
    var _a;
    const container = (_a = getCurrentCnvContainer().children[0].shadowRoot) === null || _a === void 0 ? void 0 : _a.lastElementChild;
    if (!container)
        throw new Error('cannot retrieve cnv tree');
    return container;
}
exports.getCurrentCnvTree = getCurrentCnvTree;
function getIdNode(id) {
    return document.evaluate(`//span[text()='${id}']`, getCurrentCnvTree(), null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
exports.getIdNode = getIdNode;


/***/ }),

/***/ 485:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.extractCurrentPage = void 0;
const elementFinders_1 = __webpack_require__(699);
function extractTableRows(tableBody) {
    return Array.from(tableBody.children).flatMap((row) => {
        var _a, _b, _c;
        const cells = Array.from(row.children);
        if (!cells[0] || !cells[0].children.length) {
            console.warn('could not parse row:', row);
            return [];
        }
        const deepness = ((_a = cells[0].firstElementChild) === null || _a === void 0 ? void 0 : _a.tagName) === 'SPAN'
            ? cells[0].firstElementChild.innerText.length / 2
            : 0;
        return {
            name: cells[0].lastElementChild.innerText,
            type: (_b = cells[2]) === null || _b === void 0 ? void 0 : _b.innerText,
            value: (_c = cells[3]) === null || _c === void 0 ? void 0 : _c.innerText,
            deepness,
        };
    });
}
function parseTableData(rows) {
    const parsed = { children: new Map() };
    const parents = [parsed];
    rows === null || rows === void 0 ? void 0 : rows.forEach((row) => {
        const parsedRow = {
            type: row.type,
            value: row.value,
            children: new Map(),
        };
        parents[row.deepness].children.set(row.name, parsedRow);
        parents.splice(row.deepness + 1, Infinity, parsedRow);
    });
    return parsed;
}
function extractCurrentPage() {
    const tableBody = (0, elementFinders_1.getCurrentPage)()[0].querySelector('.nice tbody');
    if (!tableBody)
        throw new Error('no table found');
    return parseTableData(extractTableRows(tableBody));
}
exports.extractCurrentPage = extractCurrentPage;


/***/ }),

/***/ 93:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cnvReactionTypes = exports.cnvCndOperators = exports.cnvCndConstants = exports.classesRep = exports.classesImp = exports.cnvClassGenderConditions = exports.miscLUT = void 0;
exports.miscLUT = new Map([
    ['large📌︎', '150'],
    ['medium📌︎', '100'],
    ['small📌︎', '50'],
    ['very large📌︎', '200'],
    ['cnvForceRewardTypeDarkSide#', '-1'],
    ['cnvForceRewardTypeLightSide#', '1'],
]);
exports.cnvClassGenderConditions = new Map([
    ['qst.utility.class.is_jedi_knight🔗︎', 'knight'],
    ['qst.utility.class.is_jedi_wizard🔗︎', 'consular'],
    ['qst.utility.class.is_trooper🔗︎', 'trooper'],
    ['qst.utility.class.is_smuggler🔗︎', 'smuggler'],
    ['qst.utility.class.is_sith_warrior🔗︎', 'warrior'],
    ['qst.utility.class.is_sith_sorcerer🔗︎', 'inquisitor'],
    ['qst.utility.class.is_bounty_hunter🔗︎', 'hunter'],
    ['qst.utility.class.is_spy🔗︎', 'agent'],
    ['qst.utility.misc.is_male🔗︎', 'male'],
    ['qst.utility.misc.is_female🔗︎', 'female'],
]);
exports.classesImp = ['warrior', 'inquisitor', 'hunter', 'agent'];
exports.classesRep = ['knight', 'consular', 'trooper', 'smuggler'];
exports.cnvCndConstants = new Map([
    ['0', '0'],
    ['1', '1'],
    ['3', '!='],
    ['4', '>'],
    ['5', '>='],
    ['6', '<'],
    ['7', '<='],
    ['8', '&&'],
    ['9', '||'],
    ['10', '!'],
    ['11', '==b'],
    ['12', '==i'],
    ['16', 'INT'],
]);
exports.cnvCndOperators = new Set([
    '!=',
    '>',
    '>=',
    '<',
    '<=',
    '&&',
    '||',
    '!',
    '==b',
    '==i',
    'INT',
]);
exports.cnvReactionTypes = new Map([
    ['2529429825125611235', '<<1>> approves.'],
    ['4428691168655495967', '<<1>> approves.'],
    ['14821228092229219504', '<<1>> approves.'],
    ['6952303592491973947', '<<1>> approves.'],
    ['4024473132780195635', '<<1>> greatly approves.'],
    ['5206985715216554263', '<<1>> greatly approves.'],
    ['8469785202589780933', '<<1>> disapproves.'],
    ['299284575647572754', '<<1>> disapproves.'],
    ['5187367556094903237', '<<1>> disapproves.'],
    ['62151514369084861', '<<1>> disapproves.'],
    ['16117376427995824505', '<<1>> greatly disapproves.'],
    ['276188171376482809', '<<1>> greatly disapproves.'],
    ['18379443853700530656', '<<1>> is slightly amused.'],
    ['18386449193944520357', '<<1>> is amused.'],
    ['18135672826307600602', '<<1>> is greatly amused.'],
    ['4712536038622606709', "<<1>>'s curiosity has been piqued."],
    ['9162491183318824094', '<<1>> seems interested.'],
    ['14265667490659118239', '<<1>> seems unusually interested.'],
    [
        '14222379092349104707',
        '<<1>> is greatly impressed with your contributions to the war effort.',
    ],
    ['10555009052943508826', '<<1>> seems intrigued.'],
    ['1375975098520036588', '<<1>> will remember your cruelty.'],
    ['15753697458920712239', '<<1>> will remember your kindness.'],
    ['13073504586969816362', '<<1>> will remember your indifference.'],
    ['7123366858456175786', '<<1>> is not amused.'],
    ['14038846228872588336', '<<1>> will remember that you lied.'],
    ['15019702191772196139', '<<1>> is concerned.'],
    ['12515792969208002617', 'Your actions will be remembered.'],
    ['7536170676252376900', '<<1>> missed you.'],
    ['10733807968160703675', '<<1>> is grateful for your assistance.'],
    [
        '731132172051691124',
        "<<1>> will be impressed that you remembered his crew member's name.",
    ],
    [
        '8872094627826740207',
        '<<1>> is delighted that you remembered the little umbrella.',
    ],
    [
        '12370401895341451158',
        '<<1>> is disappointed that you forgot the little umbrella.',
    ],
    ['5688701387429825765', '<<1>> is impressed with your work.'],
    ['9441688060394386548', '<<1>> seems slightly nervous.'],
    ['7623025373871052085', '<<1>> is beside himself with joy'],
    ['1902560031372186073', "<<1>>'s dreams have been utterly crushed."],
    ['12778378224227247110', '<<1>> is filled with hope for a better future.'],
    [
        '9882447423740450154',
        "Your actions have strengthened Doctor Oggurobb's research efforts.",
    ],
    [
        '2048663252315855743',
        "Your actions have strengthened <<1>>'s underworld logistics operations.",
    ],
    [
        '7906311544398507385',
        "Your actions have strengthened <<1>>'s military operations.",
    ],
    [
        '1597428597807848311',
        "Your actions have strengthened <<1>>'s Force Enclave",
    ],
    [
        '6375289833410097548',
        'Making others more comfortable fills <<1>> with joy.',
    ],
    ['6466639328314987443', '<<1>> is impressed.'],
    ['1209330072373622019', '<<1>> appreciates your honesty.'],
    ['13570849312037490411', '<<1>> still suspects something.'],
    ['912395257889344204', '<<1>> will remember your decision.'],
    ['4818387085978752667', '<<1>> will remember that.'],
    ['13813900891945635348', '<<1>> appreciates that.'],
    ['6651887195147244257', '<<1>> will remember your heroism.'],
    [
        '15961334736246934324',
        "Your actions have greatly strengthened <<1>>'s Force Enclave",
    ],
    [
        '17153011325266128922',
        "Your actions have greatly strengthened <<1>>'s military operations.",
    ],
    [
        '8137563469903940684',
        "Your actions have greatly strengthened <<1>>'s underworld logistics operations.",
    ],
    [
        '15350902149788601737',
        "Your actions have greatly strengthened Doctor Oggurobb's research efforts.",
    ],
    [
        '5430790823310126796',
        "<<1>> is grateful for your aid to the planet's Resistance.",
    ],
    ['8837945222426390879', '<<1>> celebrates your combined victory.'],
    ['6358824285678689448', "<<1>> is extremely grateful for all you've done."],
    [
        '10024217739917204554',
        'Valkorion dismisses your choice. You have surrendered too much power to him.',
    ],
    ['16917167500524174583', '<<1>> is slightly disappointed.'],
    ['4404097217504307474', '<<1>> is disappointed.'],
    ['10863378276840609699', '<<1>> is greatly disappointed.'],
    [
        '6474274770997812768',
        'As a droid, HK-55 has no connection to the Force and feels no pull to either the light or dark side.',
    ],
    ['1025933574861755595', '<<1>> appears confused.'],
    ['9358589348251436234', '<<1>> seems to be getting worked up.'],
    ['18251273556395588854', '<<1>> is eager to help.'],
    [
        '3135183122377415159',
        'You have subtly undermined Jedi confidence in the Republic. <<1>> will be pleased.',
    ],
    [
        '17530150515421016027',
        'You have encouraged support of the Republic among the Jedi. <<1>> will be pleased.',
    ],
    [
        '15164519942144621173',
        'You have subtly acquired the Jedi farm data for the Empire. <<1>> will be pleased.',
    ],
    [
        '13383969765412786625',
        'You have preserved the Jedi farm data for the Republic. <<1>> will be pleased.',
    ],
    [
        '6044069001178078844',
        "Dismissing suggestions from the Empire's troops will lower morale. <<1>> will be pleased.",
    ],
    [
        '5354612718435523652',
        "Your support of the Empire's troops has boosted morale. <<1>> will be pleased.",
    ],
    [
        '6044072299712963477',
        "You've hidden your preservation of the Jedi farm data well. <<1>> will be pleased.",
    ],
    [
        '17050473681179373578',
        "Sabotaging the Empire's starfighters increased their losses in the Republic attack. <<1>> will be pleased.",
    ],
    [
        '16004148145617059954',
        "Augmenting the Empire's starfighters reduced their losses in the Republic attack. <<1>> will be pleased.",
    ],
    [
        '3135184221889043370',
        'The loss of the shuttles will lower Republic morale and aid the Empire. <<1>> will be pleased.',
    ],
    [
        '17530151614932644238',
        'The rescue of the shuttles will boost Republic morale. <<1>> will be pleased.',
    ],
]);


/***/ }),

/***/ 213:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCnvNodes = exports.getCnvNodeConditions = exports.getCnvNodeChildren = exports.getCnvNodeReactions = exports.getCnvNodeForce = exports.getCnvNodeSpeaker = exports.getCnvNodeIsPlayer = exports.getCnvNodeGeneric = exports.getCnvNodeText = exports.getCnvNodeId = void 0;
const lut_1 = __webpack_require__(93);
const conditions_1 = __webpack_require__(249);
const utils_1 = __webpack_require__(470);
function getCnvNodeId(cnvNodeRow) {
    var _a;
    const id = (_a = cnvNodeRow.children.get('cnvNodeNumber')) === null || _a === void 0 ? void 0 : _a.value;
    if (!id)
        throw new Error('cnv node row has no id');
    return id;
}
exports.getCnvNodeId = getCnvNodeId;
function getCnvNodeText(cnvNodeRow, id) {
    var _a, _b, _c;
    return (((_c = (_b = (_a = cnvNodeRow.children
        .get('locTextRetrieverMap')) === null || _a === void 0 ? void 0 : _a.children.get(id)) === null || _b === void 0 ? void 0 : _b.children.get('strLocalizedTextRetrieverStringID')) === null || _c === void 0 ? void 0 : _c.value) || '');
}
exports.getCnvNodeText = getCnvNodeText;
function getCnvNodeGeneric(cnvNodeRow) {
    var _a;
    return (_a = cnvNodeRow.children.get('cnvGenericNodeNumber')) === null || _a === void 0 ? void 0 : _a.value;
}
exports.getCnvNodeGeneric = getCnvNodeGeneric;
function getCnvNodeIsPlayer(cnvNodeRow) {
    var _a;
    return ((_a = cnvNodeRow.children.get('cnvIsPcNode')) === null || _a === void 0 ? void 0 : _a.value) === 'true';
}
exports.getCnvNodeIsPlayer = getCnvNodeIsPlayer;
function getCnvNodeSpeaker(cnvNodeRow) {
    var _a;
    return ((_a = cnvNodeRow.children.get('cnvSpeaker')) === null || _a === void 0 ? void 0 : _a.value) || '';
}
exports.getCnvNodeSpeaker = getCnvNodeSpeaker;
function getCnvNodeForce(cnvNodeRow) {
    var _a, _b;
    const forceTypeData = ((_a = cnvNodeRow.children.get('cnvRewardForceType')) === null || _a === void 0 ? void 0 : _a.value) || '';
    const forceAmountData = ((_b = cnvNodeRow.children.get('cnvRewardForceAmount')) === null || _b === void 0 ? void 0 : _b.value) || '';
    const forceAmountNumber = Number(lut_1.miscLUT.get(forceAmountData));
    const forceNumber = Number(lut_1.miscLUT.get(forceTypeData)) * forceAmountNumber;
    return forceAmountData || forceTypeData
        ? forceNumber ||
            `${forceTypeData || 'unknown'}~${forceAmountNumber || forceAmountData}`
        : 0;
}
exports.getCnvNodeForce = getCnvNodeForce;
function getCnvNodeReactions(cnvNodeRow) {
    var _a;
    const reactionsRow = cnvNodeRow.children.get('cnvNodeCompanionReactions');
    if (!reactionsRow)
        return [];
    return (((_a = (0, utils_1.parseArrayUnorder)(reactionsRow)) === null || _a === void 0 ? void 0 : _a.map((reaction) => {
        var _a, _b;
        const reactionType = String((_a = reaction.children.get('cnvNodeReactionType')) === null || _a === void 0 ? void 0 : _a.value).split(' = ')[0];
        return [
            String((_b = reaction.children.get('cnvNodeReactionCompanion')) === null || _b === void 0 ? void 0 : _b.value),
            lut_1.cnvReactionTypes.get(reactionType) || reactionType,
        ];
    })) || []);
}
exports.getCnvNodeReactions = getCnvNodeReactions;
function getCnvNodeChildren(cnvNodeRow) {
    const childrenRow = cnvNodeRow.children.get('cnvChildNodes');
    if (!childrenRow)
        return [];
    return (0, utils_1.parseToValues)((0, utils_1.parseArrayUnorder)(childrenRow));
}
exports.getCnvNodeChildren = getCnvNodeChildren;
function getCnvNodeConditions(cnvNodeRow) {
    var _a, _b, _c;
    const cndCompiledRow = cnvNodeRow.children.get('cnvConditionCompiled');
    const conditions = cndCompiledRow
        ? (0, utils_1.parseToValues)((0, utils_1.parseArrayUnorder)(cndCompiledRow))
        : [];
    const actionRow = cnvNodeRow.children.get('cnvActionExpressionCompiled');
    const actionExpression = actionRow
        ? (0, utils_1.parseToValues)((0, utils_1.parseArrayUnorder)(actionRow))
        : [];
    if (((_a = cnvNodeRow.children.get('cnvNodeConditionType')) === null || _a === void 0 ? void 0 : _a.value) ===
        'cnvConditionType_Conditional#') {
        const conditional = (_b = cnvNodeRow.children.get('cnvNodeRequiredConditional')) === null || _b === void 0 ? void 0 : _b.value;
        if (conditional) {
            const compiledLength = conditions.length;
            conditions.push(conditional);
            if (((_c = cnvNodeRow.children.get('cnvNodeIsConditionNegated')) === null || _c === void 0 ? void 0 : _c.value) === 'true') {
                conditions.push('(10)');
            }
            if (compiledLength) {
                conditions.push('(8)');
            }
        }
    }
    return {
        actionString: (0, conditions_1.readableCondition)(actionExpression),
        conditionString: (0, conditions_1.readableCondition)(conditions),
    };
}
exports.getCnvNodeConditions = getCnvNodeConditions;
function getCnvNodes(cnvData) {
    return new Map((0, utils_1.parseArrayUnorder)(cnvData).map((cnvNodeRow) => {
        const id = getCnvNodeId(cnvNodeRow);
        return [
            id,
            Object.assign(Object.assign({ id, children: getCnvNodeChildren(cnvNodeRow), parents: new Set(), text: getCnvNodeText(cnvNodeRow, id), force: getCnvNodeForce(cnvNodeRow), isPlayer: getCnvNodeIsPlayer(cnvNodeRow), speaker: getCnvNodeSpeaker(cnvNodeRow), generic: getCnvNodeGeneric(cnvNodeRow), reactions: getCnvNodeReactions(cnvNodeRow) }, getCnvNodeConditions(cnvNodeRow)), { conditionMatters: false }),
        ];
    }));
}
exports.getCnvNodes = getCnvNodes;


/***/ }),

/***/ 299:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseCurrentCnvTree = void 0;
const elementFinders_1 = __webpack_require__(699);
const cnvDataTable_1 = __webpack_require__(485);
const cnvNodes_1 = __webpack_require__(213);
const conditions_1 = __webpack_require__(249);
const utils_1 = __webpack_require__(470);
function transferChildren(nodeId, children, to) {
    let idx = to.findIndex((v) => v === nodeId);
    if (idx < 0 || !children.length || !to.length)
        return false;
    to.splice(idx, 1);
    children.forEach((childId) => {
        const childIdx = to.findIndex((id) => id === childId);
        if (childIdx < 0) {
            to.splice(idx, 0, childId);
            idx++;
        }
        else if (childIdx === idx) {
            idx++;
        }
        else if (childIdx > idx) {
            to.splice(childIdx, 1);
            to.splice(idx, 0, childId);
            idx++;
        }
    });
    return true;
}
function parseCnvTree(data) {
    var _a;
    const cnvNodeData = data.children.get('cnvTreeDialogNodes_Prototype');
    if (!cnvNodeData) {
        alert('no conversation found');
        throw new Error('no conversation data found');
    }
    const cnvNodes = (0, cnvNodes_1.getCnvNodes)(cnvNodeData);
    const cnvLinkData = data.children.get('cnvTreeLinkNodes_Prototype');
    const cnvLinks = new Map(cnvLinkData
        ? (0, utils_1.parseArrayUnorder)(cnvLinkData).map((row) => {
            var _a, _b;
            const source = (_a = row.children.get('cnvNodeNumber')) === null || _a === void 0 ? void 0 : _a.value;
            const target = (_b = row.children.get('cnvLinkTarget')) === null || _b === void 0 ? void 0 : _b.value;
            if (!source || !target) {
                console.warn('undefined link source or target');
                return ['-1', '-1'];
            }
            return [source, target];
        })
        : []);
    cnvNodes.forEach((node) => {
        node.children = node.children.map((childId) => {
            let id = childId;
            let child = cnvNodes.get(id);
            if (!child) {
                while (id && !child) {
                    id = cnvLinks.get(id) || '';
                    child = cnvNodes.get(id);
                }
                if (!child) {
                    console.warn(`node ${childId} not found`);
                    return 'unresolved';
                }
            }
            child.parents.add(node.id);
            return id;
        });
    });
    const rootNodeData = (_a = data.children
        .get('cnvTreeRootNode_Prototype')) === null || _a === void 0 ? void 0 : _a.children.get('cnvChildNodes');
    const topLevelNodeIds = rootNodeData
        ? (0, utils_1.parseToValues)((0, utils_1.parseArrayUnorder)(rootNodeData))
        : [];
    topLevelNodeIds.forEach((id) => { var _a; return (_a = cnvNodes.get(id)) === null || _a === void 0 ? void 0 : _a.parents.add('root'); });
    cnvNodes.forEach((cnvNode) => {
        if (!cnvNode.parents.size) {
            cnvNode.parents.add('root');
            if (!topLevelNodeIds.includes(cnvNode.id)) {
                topLevelNodeIds.splice(0, 0, cnvNode.id);
            }
        }
        if (!cnvNode.text &&
            !cnvNode.force &&
            !cnvNode.reactions.length &&
            cnvNode.children.length !== 0 &&
            !cnvNode.actionString &&
            (cnvNode.children.every((childId) => {
                const child = cnvNodes.get(childId);
                if (!child)
                    return false;
                return cnvNode.conditionString === child.conditionString;
            }) ||
                Array.from(cnvNode.parents).every((parentId) => {
                    const parent = cnvNodes.get(parentId);
                    if (!parent)
                        return false;
                    return (0, conditions_1.compareChildCnd)(parent.conditionString, cnvNode.conditionString).isSuperset;
                }))) {
            if (transferChildren(cnvNode.id, cnvNode.children, topLevelNodeIds)) {
                cnvNode.children.forEach((childId) => { var _a; return (_a = cnvNodes.get(childId)) === null || _a === void 0 ? void 0 : _a.parents.add('root'); });
            }
            cnvNode.children.forEach((childId) => {
                const childNode = cnvNodes.get(childId);
                if (!childNode)
                    return;
                childNode.parents.delete(cnvNode.id);
                cnvNode.parents.forEach((parentId) => {
                    childNode.parents.add(parentId);
                });
            });
            cnvNode.parents.forEach((parentId) => {
                const parentNode = cnvNodes.get(parentId);
                if (!parentNode)
                    return;
                transferChildren(cnvNode.id, cnvNode.children, parentNode.children);
            });
        }
    });
    cnvNodes.forEach((cnvNode) => {
        if (cnvNode.parents.has('root')) {
            cnvNode.conditionMatters = true;
            return;
        }
        cnvNode.parents.forEach((parentId) => {
            const parent = cnvNodes.get(parentId);
            if (!parent)
                return;
            const { isSuperset } = (0, conditions_1.compareChildCnd)(parent.conditionString, cnvNode.conditionString);
            if (!isSuperset) {
                cnvNode.conditionMatters = true;
            }
        });
    });
    return [cnvNodes, topLevelNodeIds];
}
function parseCurrentCnvTree() {
    var _a, _b, _c, _d;
    if (((_d = (((_c = (_b = (_a = (0, elementFinders_1.getCurrentPage)()[0]) === null || _a === void 0 ? void 0 : _a.children[2]) === null || _b === void 0 ? void 0 : _b.children[0]) === null || _c === void 0 ? void 0 : _c.children[1]))) === null || _d === void 0 ? void 0 : _d.innerText) !== 'cnvTree_Prototype') {
        if (!confirm('Base class does not appear to be cnvTree_Prototype, try parsing as one anyway? ' +
            'This will probably not work.')) {
            throw new Error('baseclass not cnvTree_Prototype');
        }
    }
    return parseCnvTree((0, cnvDataTable_1.extractCurrentPage)());
}
exports.parseCurrentCnvTree = parseCurrentCnvTree;


/***/ }),

/***/ 249:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.readableCondition = exports.compareChildCnd = void 0;
const lut_1 = __webpack_require__(93);
function prettyConditionString(str) {
    return (lut_1.cnvCndConstants.get(str) ||
        lut_1.cnvClassGenderConditions.get(str) ||
        str.replace(/🔗︎/g, '').split('.').at(-1) ||
        '???');
}
const conditions = new Map([
    ...Array.from(lut_1.cnvClassGenderConditions.values()).map((cg) => [cg, { operator: 'value', operands: [cg] }]),
    ['class_imp', { operator: '||', operands: lut_1.classesImp }],
    ['class_rep', { operator: '||', operands: lut_1.classesRep }],
]);
const cndCmpSame = { isSubset: true, isSuperset: true };
const cndCmpSubset = { isSubset: true, isSuperset: false };
const cndCmpSuperset = { isSubset: false, isSuperset: true };
const cndCmpFalse = { isSubset: false, isSuperset: false };
function compareChildCnd(parentStr, childStr) {
    if (parentStr === childStr)
        return cndCmpSame;
    const parent = conditions.get(parentStr);
    const child = conditions.get(childStr);
    if (!parent || !child)
        return cndCmpFalse;
    if (parent === child)
        return cndCmpSame;
    if ((child.operator === '&&' || child.operator === '||') &&
        child.operands.includes(parentStr)) {
        return child.operator === '||' ? cndCmpSuperset : cndCmpSubset;
    }
    if (parent.operator === '&&' || parent.operator === '||') {
        if (parent.operands.includes(childStr)) {
            return parent.operator === '||' ? cndCmpSubset : cndCmpSuperset;
        }
        if (parent.operator === child.operator) {
            if (child.operands.every((o) => parent.operands.includes(o))) {
                return parent.operator === '||' ? cndCmpSubset : cndCmpSuperset;
            }
            if (parent.operands.every((o) => child.operands.includes(o))) {
                return parent.operator === '||' ? cndCmpSuperset : cndCmpSubset;
            }
        }
    }
    return cndCmpFalse;
}
exports.compareChildCnd = compareChildCnd;
function createCondition(conditionStr, operator, operands) {
    if (!conditions.has(conditionStr)) {
        conditions.set(conditionStr, { operator, operands });
    }
    return conditionStr;
}
function conditionValue(value) {
    return createCondition(value, 'value', [value]);
}
function conditionNegate(conditionStr) {
    return createCondition(`!${conditionStr}`, '!', [conditionStr]);
}
function conditionInt(intString) {
    return createCondition(`INT(${intString})`, 'INT', [intString]);
}
function readableCndInner(conditionsRaw, idx) {
    var _a;
    const valueRaw = conditionsRaw.at(idx) || 'ERROR';
    const operator = lut_1.cnvCndConstants.get(((_a = valueRaw.match(/^.*\((\d+)\)$/)) === null || _a === void 0 ? void 0 : _a[1]) || '') || '';
    if (!lut_1.cnvCndOperators.has(operator)) {
        return [
            idx - 1,
            conditionValue(operator || prettyConditionString(valueRaw)),
        ];
    }
    const [operand1idx, operand2str] = readableCndInner(conditionsRaw, idx - 1);
    if (operator === '!') {
        return [operand1idx, conditionNegate(operand2str)];
    }
    if (operator === 'INT') {
        return [operand1idx, conditionInt(operand2str)];
    }
    const [returnIdx, operand1str] = readableCndInner(conditionsRaw, operand1idx);
    const operand1 = conditions.get(operand1str);
    const operand2 = conditions.get(operand2str);
    if (!operand1 || !operand2) {
        console.error('operand not found');
        return [-1, 'ERROR'];
    }
    if (operator === '&&' || operator === '==b') {
        if (operand1str === '1') {
            return [returnIdx, operand2str];
        }
        if (operand1str === '0') {
            return [returnIdx, conditionNegate(operand2str)];
        }
        if (operand2str === '1') {
            return [returnIdx, operand1str];
        }
        if (operand2str === '0') {
            return [returnIdx, conditionNegate(operand1str)];
        }
    }
    let operands = [operand1str, operand2str];
    if (operator === '&&' || operator === '||') {
        operands = [
            ...(operand1.operator === operator ? operand1.operands : [operand1str]),
            ...(operand2.operator === operator ? operand2.operands : [operand2str]),
        ];
        if (operator === '||') {
            if (operands.length === lut_1.classesImp.length &&
                lut_1.classesImp.every((c) => operands.includes(c))) {
                return [returnIdx, 'class_imp'];
            }
            if (operands.length === lut_1.classesRep.length &&
                lut_1.classesRep.every((c) => operands.includes(c))) {
                return [returnIdx, 'class_rep'];
            }
        }
    }
    return [
        returnIdx,
        createCondition('(' + operands.reduce((s, c) => `${s} ${operator} ${c}`) + ')', operator, operands),
    ];
}
function readableCondition(conditionArray) {
    if (!conditionArray.length)
        return '';
    const result = readableCndInner(conditionArray, conditionArray.length - 1)[1];
    return result === '1' ? '' : result;
}
exports.readableCondition = readableCondition;


/***/ }),

/***/ 379:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setGenericLines = exports.genericLines = void 0;
const elementFinders_1 = __webpack_require__(699);
const cnvDataTable_1 = __webpack_require__(485);
const lut_1 = __webpack_require__(93);
const cnvNodes_1 = __webpack_require__(213);
const utils_1 = __webpack_require__(470);
exports.genericLines = new Map();
function getCnvNodeConditionsBad(cnvNodeRow) {
    const conditionRow = cnvNodeRow.children.get('cnvConditionCompiled');
    if (!conditionRow)
        return [];
    return (0, utils_1.parseToValues)((0, utils_1.parseArrayUnorder)(conditionRow)).flatMap((v) => lut_1.cnvClassGenderConditions.get(v) || []);
}
function parseGenericLines(data, playerConditions) {
    const cnvNodeData = data.children.get('cnvTreeDialogNodes_Prototype');
    if (!cnvNodeData) {
        alert('no conversation nodes found');
        throw new Error('no conversation data found');
    }
    const cnvNodes = new Map((0, utils_1.parseArrayUnorder)(cnvNodeData).map((cnvNodeRow) => {
        const id = (0, cnvNodes_1.getCnvNodeId)(cnvNodeRow);
        return [
            id,
            {
                id,
                children: new Set((0, cnvNodes_1.getCnvNodeChildren)(cnvNodeRow)),
                parents: new Set(),
                text: (0, cnvNodes_1.getCnvNodeText)(cnvNodeRow, id),
                conditions: getCnvNodeConditionsBad(cnvNodeRow),
            },
        ];
    }));
    cnvNodes.forEach((node) => {
        Array.from(node.children).forEach((childId) => {
            const child = cnvNodes.get(childId);
            if (!child) {
                console.warn(`node ${childId} not found`);
                return;
            }
            child.parents.add(node.id);
        });
    });
    cnvNodes.forEach((cnvNode) => {
        if (!cnvNode.conditions.length)
            return;
        if (!cnvNode.conditions.every((cnd) => playerConditions.has(cnd))) {
            cnvNodes.delete(cnvNode.id);
            return;
        }
        cnvNode.parents.forEach((parentId) => {
            const parent = cnvNodes.get(parentId);
            if (!parent) {
                console.warn(`parent not found: ${parentId}`);
                return;
            }
            parent.text = cnvNode.text;
        });
    });
    return new Map(Array.from(cnvNodes.values()).flatMap(({ id, text }) => text ? [[id, text]] : []));
}
function setGenericLines(playerConditions) {
    var _a;
    const [page, _] = (0, elementFinders_1.getCurrentPage)();
    if (((_a = page.querySelector(':nth-child(2 of p) :first-child mark')) === null || _a === void 0 ? void 0 : _a.textContent) !==
        'cnv.misc.generic_lines') {
        if (!confirm('Current page is not cnv.misc.generic_lines, try opening anyway? ' +
            '(This will probably not work)')) {
            return;
        }
    }
    exports.genericLines = parseGenericLines((0, cnvDataTable_1.extractCurrentPage)(), playerConditions);
}
exports.setGenericLines = setGenericLines;


/***/ }),

/***/ 470:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseToValues = exports.parseArrayUnorder = exports.parseArray = void 0;
function parseArray(row) {
    const res = [];
    Array.from(row.children.entries() || []).forEach(([name, row]) => {
        res[Number(name)] = row;
    });
    return res;
}
exports.parseArray = parseArray;
function parseArrayUnorder(row) {
    return Array.from(row.children.values() || []);
}
exports.parseArrayUnorder = parseArrayUnorder;
function parseToValues(rows) {
    return rows.flatMap((r) => r.value || []);
}
exports.parseToValues = parseToValues;


/***/ }),

/***/ 54:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addNavbarButton = void 0;
function addNavbarButton(id, text, fn) {
    var _a;
    const existingButton = document.querySelector(`#${id}`);
    if (existingButton) {
        existingButton.onclick = fn;
        existingButton.textContent = text;
        return;
    }
    const newButton = document.createElement('button');
    newButton.appendChild(document.createTextNode('CNV'));
    newButton.id = id;
    newButton.onclick = fn;
    newButton.textContent = text;
    (_a = document.getElementById('navtop')) === null || _a === void 0 ? void 0 : _a.appendChild(newButton);
}
exports.addNavbarButton = addNavbarButton;


/***/ }),

/***/ 183:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.renderCurrentConversations = exports.renderConversations = void 0;
const cnvTreeStyles_1 = __webpack_require__(935);
const elementFinders_1 = __webpack_require__(699);
const cnvTree_1 = __webpack_require__(299);
const genericLines_1 = __webpack_require__(379);
const utils_1 = __webpack_require__(364);
function renderCnvNodeCheckbox(parent) {
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    parent.appendChild(checkbox);
}
function renderCnvNodeId(parent, id) {
    if (!id)
        return false;
    (0, utils_1.appendSpanWithText)(parent, id, 'cnv-id');
    return true;
}
function renderCnvNodeCondition(parent, condition) {
    (0, utils_1.appendSpanWithText)(parent, condition.replace('==i', '==').replace('==b', '=='), 'cnv-cnd');
}
function renderCnvNodeForce(parent, force) {
    if (!force)
        return false;
    const isDark = typeof force === 'number'
        ? force < 0
        : force.toLowerCase().includes('dark');
    (0, utils_1.appendSpanWithText)(parent, `${isDark || !Number(force) ? '' : '+'}${force}`, isDark ? 'cnv-force-dark' : 'cnv-force-light');
    return true;
}
function renderCnvNodeLine(parent, text, speaker, generic, isPlayer) {
    if (!text)
        return false;
    const textParts = text.split('\n');
    if (isPlayer && (textParts.length > 1 || generic)) {
        (0, utils_1.appendSpanWithText)(parent, `Option: ${textParts[1] || textParts[0]}`.replace('💬︎', ''), 'cnv-option');
    }
    (0, utils_1.appendSpanWithText)(parent, isPlayer ? 'Player' : (0, utils_1.getName)(speaker), `cnv-speaker ${isPlayer ? 'cnv-player' : 'cnv-npc'}`);
    (0, utils_1.appendSpanWithText)(parent, `- ${generic ? genericLines_1.genericLines.get(generic) || `generic ${generic}` : textParts[0]}`.replace('💬︎', ''), generic ? 'cnv-generic' : 'cnv-text');
    return true;
}
function renderCnvLink(parent, link) {
    if (!link)
        return false;
    (0, utils_1.appendSpanWithText)(parent, `Link to ${link}`, 'cnv-link');
    parent.onclick = () => (0, utils_1.jumpToId)(link);
    return true;
}
function createReactionRow(reactor, reaction) {
    const [parsedReactor, parsedReaction] = (0, utils_1.parseReaction)((0, utils_1.getName)(reactor), reaction);
    const trow = document.createElement('tr');
    const companionTd = document.createElement('td');
    companionTd.appendChild(document.createTextNode(parsedReactor));
    trow.appendChild(companionTd);
    const reactionTd = document.createElement('td');
    reactionTd.appendChild(document.createTextNode(parsedReaction));
    trow.appendChild(reactionTd);
    return trow;
}
function renderCnvNodeReactions(parent, reactions, actionString) {
    if (!reactions.length && !actionString)
        return false;
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    table.className = 'cnv-reactions';
    reactions.forEach(([reactor, reaction]) => {
        tbody.appendChild(createReactionRow(reactor, reaction));
    });
    if (actionString) {
        const trow = createReactionRow('SET VARIABLE', actionString.replace('==i', '=').replace('==b', '='));
        trow.classList.add('cnv-cnd');
        tbody.appendChild(trow);
    }
    table.appendChild(tbody);
    parent.appendChild(table);
    return true;
}
function createCnvNode({ id, text, force, speaker, isPlayer, generic, reactions, actionString, conditionString, conditionMatters, }, hasChildren) {
    const newElement = document.createElement('li');
    const span = document.createElement('span');
    if (hasChildren) {
        renderCnvNodeCheckbox(newElement);
    }
    else {
        span.classList.add('cnv-childless');
    }
    newElement.appendChild(span);
    const hasId = renderCnvNodeId(span, id);
    if (conditionMatters && conditionString) {
        renderCnvNodeCondition(span, conditionString);
        if (text) {
            span.appendChild(document.createElement('br'));
        }
    }
    if (hasId) {
        span.classList.add('cnv-node');
        renderCnvNodeForce(span, force);
        renderCnvNodeLine(span, text, speaker, generic, isPlayer);
        if (!hasChildren) {
            (0, utils_1.appendSpanWithText)(span, 'conversation end', 'cnv-end');
        }
    }
    else {
        span.classList.add('cnv-util');
        span.appendChild(document.createTextNode(text ? text : 'node'));
    }
    renderCnvNodeReactions(span, reactions, actionString);
    return newElement;
}
function renderChildList(parent) {
    const childList = document.createElement('ul');
    parent.appendChild(childList);
    return childList;
}
function createLinkNode(link) {
    const newElement = document.createElement('li');
    const span = document.createElement('span');
    span.classList.add('cnv-childless');
    newElement.appendChild(span);
    span.classList.add('cnv-util');
    renderCnvLink(span, link);
    return newElement;
}
function renderCnvNodes([cnvNodes, topLevelIds], listElement) {
    var _a, _b;
    const renderQueue = topLevelIds.map((id) => [
        id,
        listElement,
    ]);
    const timesLinked = new Map();
    const links = new Map();
    function renderLinkNode(toId, parentElement) {
        const linkElement = createLinkNode(toId);
        parentElement.appendChild(linkElement);
        timesLinked.set(toId, (timesLinked.get(toId) || 0) + 1);
        const link = links.get(toId);
        if (!link) {
            links.set(toId, { resolved: false, linkElement });
        }
        else if (!link.resolved) {
            link.linkElement = linkElement;
        }
    }
    function renderCnvNode(id, cnvNode, parentElement) {
        const link = links.get(id);
        if (link)
            link.resolved = true;
        const hasChildren = cnvNode.children.length > 0;
        const cnvNodeElement = createCnvNode(cnvNode, hasChildren);
        parentElement.appendChild(cnvNodeElement);
        if (hasChildren) {
            const childList = renderChildList(cnvNodeElement);
            cnvNode.children
                .slice(0)
                .reverse()
                .forEach((id) => renderQueue.push([id, childList]));
        }
    }
    function renderLoop() {
        var _a;
        while (true) {
            const nextNode = renderQueue.pop();
            if (!nextNode)
                break;
            const [id, parentElement] = nextNode;
            const cnvNode = cnvNodes.get(id);
            if (!((_a = links.get(id)) === null || _a === void 0 ? void 0 : _a.resolved) &&
                cnvNode &&
                cnvNode.parents.size - (timesLinked.get(id) || 0) === 1) {
                renderCnvNode(id, cnvNode, parentElement);
            }
            else {
                renderLinkNode(id, parentElement);
            }
        }
    }
    renderLoop();
    while (true) {
        const nextLink = Array.from(links).find(([_, { resolved }]) => !resolved);
        if (!nextLink)
            break;
        const [id, link] = nextLink;
        const cnvNode = cnvNodes.get(id);
        const parentElement = (_a = link.linkElement) === null || _a === void 0 ? void 0 : _a.parentElement;
        if (!cnvNode || !parentElement) {
            links.delete(id);
            continue;
        }
        (_b = link.linkElement) === null || _b === void 0 ? void 0 : _b.remove();
        link.resolved = true;
        renderCnvNode(id, cnvNode, parentElement);
        timesLinked.set(id, Infinity);
        renderLoop();
    }
}
function renderConversations(conversations, reverse) {
    const container = (0, elementFinders_1.getCurrentCnvContainer)();
    (0, utils_1.clearChildren)(container);
    const shadowContainer = document.createElement('div');
    container.appendChild(shadowContainer);
    const style = document.createElement('style');
    style.textContent = cnvTreeStyles_1.cnvTreeCSS;
    const shadow = shadowContainer.attachShadow({ mode: 'open' });
    shadow.appendChild(style);
    const conversationDiv = document.createElement('div');
    shadow.appendChild(conversationDiv);
    const tree = document.createElement('ul');
    tree.className = 'tree';
    conversationDiv.appendChild(tree);
    if (reverse)
        conversations[1].push(...conversations[1].splice(0, 1));
    renderCnvNodes(conversations, tree);
}
exports.renderConversations = renderConversations;
function renderCurrentConversations(e) {
    renderConversations((0, cnvTree_1.parseCurrentCnvTree)(), e.shiftKey);
}
exports.renderCurrentConversations = renderCurrentConversations;


/***/ }),

/***/ 594:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addMenu = void 0;
const cnvTreeStyles_1 = __webpack_require__(935);
const genericLines_1 = __webpack_require__(379);
const utils_1 = __webpack_require__(364);
function addMenu() {
    const navtop = document.querySelector('#navtop');
    if (!navtop)
        return;
    if (!document.querySelector('#navtop style')) {
        const menuStyle = document.createElement('style');
        menuStyle.textContent = cnvTreeStyles_1.menuCSS;
        navtop.appendChild(menuStyle);
    }
    if (!document.querySelector('#cnv-menu-collapser')) {
        const collapser = document.createElement('input');
        collapser.id = 'cnv-menu-collapser';
        collapser.type = 'checkbox';
        collapser.checked = true;
        navtop.appendChild(collapser);
    }
    let menuContainer = document.querySelector('#cnv-menu');
    if (!menuContainer) {
        menuContainer = document.createElement('div');
        menuContainer.id = 'cnv-menu';
        navtop.appendChild(menuContainer);
    }
    (0, utils_1.clearChildren)(menuContainer);
    const genericForm = document.createElement('form');
    const genericFieldset = document.createElement('fieldset');
    genericForm.appendChild(genericFieldset);
    menuContainer.appendChild(genericForm);
    const genericLegend = document.createElement('legend');
    genericLegend.appendChild(document.createTextNode('Open cnv.misc.generic_lines to parse the generic lines. ' +
        'They will persist until re-parse or -load.'));
    const classContainer = document.createElement('div');
    (0, utils_1.appendRadio)(classContainer, 'class', [
        'knight',
        'consular',
        'trooper',
        'smuggler',
        'warrior',
        'inquisitor',
        'hunter',
        'agent',
    ]);
    const genderContainer = document.createElement('div');
    (0, utils_1.appendRadio)(genderContainer, 'gender', ['male', 'female']);
    const genericButton = document.createElement('button');
    genericButton.appendChild(document.createTextNode('Parse Generics'));
    genericFieldset.appendChild(genericLegend);
    genericFieldset.appendChild(classContainer);
    genericFieldset.appendChild(genderContainer);
    genericFieldset.appendChild(genericButton);
    genericForm.onsubmit = (e) => {
        e.preventDefault();
        const target = e.target;
        (0, genericLines_1.setGenericLines)(new Set([target.class.value, target.gender.value]));
    };
}
exports.addMenu = addMenu;


/***/ }),

/***/ 364:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.appendRadio = exports.parseReaction = exports.appendSpanWithText = exports.jumpToId = exports.expandTo = exports.expandAll = exports.getName = exports.clearChildren = void 0;
const elementFinders_1 = __webpack_require__(699);
function clearChildren(element) {
    Array.from(element.children).forEach((c) => element.removeChild(c));
}
exports.clearChildren = clearChildren;
function getName(longString) {
    var _a;
    return (((_a = longString === null || longString === void 0 ? void 0 : longString.match(/^(?:.*\.)*([^🔗︎\.]+).*$/)) === null || _a === void 0 ? void 0 : _a[1]) ||
        longString ||
        'unknown');
}
exports.getName = getName;
function expandAll() {
    Array.from((0, elementFinders_1.getCurrentCnvTree)().getElementsByTagName('input')).forEach((input) => (input.checked = false));
}
exports.expandAll = expandAll;
function expandTo(node) {
    var _a;
    let listElement = node.parentElement;
    while (listElement && !listElement.offsetParent) {
        listElement = ((_a = listElement === null || listElement === void 0 ? void 0 : listElement.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) || null;
        const checkbox = listElement === null || listElement === void 0 ? void 0 : listElement.querySelector('input');
        if (checkbox)
            checkbox.checked = false;
        else
            return;
    }
}
exports.expandTo = expandTo;
function jumpToId(id) {
    var _a;
    const element = (_a = (0, elementFinders_1.getIdNode)(id)) === null || _a === void 0 ? void 0 : _a.parentElement;
    if (!element)
        return alert(`node ${id} not found`);
    expandTo(element);
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    element.classList.add('cnv-highlight');
    setTimeout(() => element.classList.remove('cnv-highlight'), 5000);
}
exports.jumpToId = jumpToId;
function appendSpanWithText(parent, text, className) {
    const newSpan = document.createElement('span');
    newSpan.appendChild(document.createTextNode(text));
    newSpan.className = className;
    parent.appendChild(newSpan);
    return newSpan;
}
exports.appendSpanWithText = appendSpanWithText;
function parseReaction(reactor, reaction) {
    const parsedReaction = reaction
        .replace('<<1>>', (_, offset) => (offset ? reactor : ''))
        .trim();
    return [reactor, parsedReaction];
}
exports.parseReaction = parseReaction;
function appendRadio(parent, name, values) {
    values.forEach((value) => {
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = name;
        input.id = value;
        input.value = value;
        const label = document.createElement('label');
        label.htmlFor = value;
        label.appendChild(document.createTextNode(value));
        parent.appendChild(input);
        parent.appendChild(label);
        parent.appendChild(document.createElement('br'));
    });
}
exports.appendRadio = appendRadio;


/***/ })

/******/ 	});
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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
const buttons_1 = __webpack_require__(54);
const cnvTree_1 = __webpack_require__(183);
const menu_1 = __webpack_require__(594);
(0, buttons_1.addNavbarButton)('cnv-parse-button', 'CNV', (e) => (0, cnvTree_1.renderCurrentConversations)(e));
(0, menu_1.addMenu)();

})();

/******/ })()
;