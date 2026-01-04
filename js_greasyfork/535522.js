// ==UserScript==
// @name         天鳳牌理好形表示
// @name:zh      天凤牌理好形表示
// @name:zh-CN   天凤牌理好形表示
// @name:zh-TW   天鳳牌理好形表示
// @name:en      Tenhou-Pairi Kokei display
// @namespace    http://sigaer.com/
// @version      0.7.7
// @description  天鳳牌理で二向聴の好形率を表示する
// @description:zh  在天凤牌理中显示好形率
// @description:zh-CN  在天凤牌理中显示好形率
// @description:zh-TW  在天鳳牌理中顯示好形率
// @description:en  Display Kokei percentage of ii-shan-ten in Tenhou-Pairi
// @author       sigaer
// @match        http://tenhou.net/2/*
// @match        https://tenhou.net/2/*
// @include      http://tenhou.net/2/*
// @include      https://tenhou.net/2/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535522/%E5%A4%A9%E9%B3%B3%E7%89%8C%E7%90%86%E5%A5%BD%E5%BD%A2%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/535522/%E5%A4%A9%E9%B3%B3%E7%89%8C%E7%90%86%E5%A5%BD%E5%BD%A2%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==
(function () {
    "use strict";
    class MJ {
        static toArray(input) {
            const result = [];
            let head, tail;
            for (head = tail = 0; head < input.length; ++head) {
                if ("mpsz".indexOf(input[head]) === -1) {
                    continue;
                }
                for (; tail < head; ++tail) {
                    result.push(input[tail] + input[head]);
                }
                ++tail;
            }
            return result;
        }
        static toAka(input, force) {
            if (input[1] !== "m" && input[1] !== "p" && input[1] !== "s") {
                return input;
            }
            if (input[0] === "0" || input[0] === "5") {
                if (force === true) {
                    return "0" + input[1];
                } else if (force === false) {
                    return "5" + input[1];
                } else {
                    return "0" === input[0] ? "5" + input[1] : "0" + input[1];
                }
            }
            return input;
        }
        static normalize(source) {
            return source.map((x) => MJ.toAka(x, false)).sort(MJ.compareTile);
        }
        static compareTile(a, b) {
            if (a[1] !== b[1]) {
                return a[1] < b[1] ? -1 : 1;
            } else {
                let aNum = a.charCodeAt(0);
                let bNum = b.charCodeAt(0);
                if (aNum === 48) {
                    aNum = 53.5;
                }
                if (bNum === 48) {
                    bNum = 53.5;
                }
                return aNum - bNum;
            }
        }
        static sub(source, ...tiles) {
            const result = [...source];
            for (const tile of tiles) {
                const index = result.findIndex((x) => MJ.toAka(x, false) === MJ.toAka(tile, false));
                if (index != -1) {
                    result.splice(index, 1);
                    continue;
                }
            }
            return result;
        }
        static remains(source, tile) {
            let result = 4;
            source.forEach((x) => {
                if (MJ.toAka(x, false) === MJ.toAka(tile, false)) {
                    --result;
                }
            });
            return result;
        }
        static is13Orphans(source) {
            const orphanTiles = MJ.toArray("19m19p19s1234567z");
            if (source.length !== 14) {
                return false;
            }
            const subbed = MJ.sub(source, ...orphanTiles);
            return subbed.length === 1 && orphanTiles.indexOf(subbed[0]) !== -1;
        }
        static is7Pairs(source) {
            if (source.length !== 14) {
                return false;
            }
            const sorted = MJ.normalize(source);
            for (let i = 0; i < source.length - 1; ++i) {
                if (i % 2 === 0 && sorted[i] !== sorted[i + 1]) {
                    return false;
                }
                if (i % 2 === 1 && sorted[i] === sorted[i + 1]) {
                    return false;
                }
            }
            return true;
        }
        static splitSuits(source) {
            const result = {};
            for (const suit of "mpsz") {
                result[suit] = source.filter((x) => x[1] === suit);
            }
            return result;
        }
        static findSuitWithPair(suits) {
            let suitWithPair = null;
            for (const suit of "mpsz") {
                const lengthMod3 = suits[suit].length % 3;
                if (lengthMod3 === 2) {
                    if (!suitWithPair) {
                        suitWithPair = suit;
                    } else {
                        return null;
                    }
                } else if (lengthMod3 === 1) {
                    return null;
                }
            }
            return suitWithPair;
        }
        static _allMeldsLoop(inner, withPair) {
            if (inner.length === 0) {
                return true;
            }
            const tryComb = (comb, newWithPair = withPair) => {
                const subbed = MJ.sub(inner, ...comb);
                return subbed.length === inner.length - comb.length && MJ._allMeldsLoop(subbed, newWithPair);
            };
            if (withPair) {
                if (tryComb([inner[0], inner[0]], false)) {
                    return true;
                }
            }
            if (inner.length >= 3) {
                if (tryComb([inner[0], inner[0], inner[0]])) {
                    return true;
                }
                if (inner[0][0] < "8" && inner[0][1] !== "z") {
                    const addToTile = (t, a) => String.fromCharCode(t.charCodeAt(0) + a) + t[1];
                    if (tryComb([inner[0], addToTile(inner[0], 1), addToTile(inner[0], 2)])) {
                        return true;
                    }
                }
            }
            return false;
        }
        static allMelds(source, withPair) {
            if (source.length === 0) {
                return true;
            }
            withPair != null ? withPair : withPair = source.length % 3 === 2;
            if (withPair && source.length % 3 !== 2) {
                return false;
            }
            if (!withPair && source.length % 3 !== 0) {
                return false;
            }
            const sorted = MJ.normalize(source);
            return MJ._allMeldsLoop(sorted, withPair);
        }
        static isNormalWinHand(source) {
            if (source.length % 3 !== 2) {
                return false;
            }
            const suits = MJ.splitSuits(source);
            const suitWithPair = MJ.findSuitWithPair(suits);
            if (!suitWithPair) {
                return false;
            }
            for (const suitType of "mpsz") {
                if (!MJ.allMelds(suits[suitType], suitType === suitWithPair)) {
                    return false;
                }
            }
            return true;
        }
        static isWinHand(source) {
            return MJ.is13Orphans(source) || MJ.is7Pairs(source) || MJ.isNormalWinHand(source);
        }
        static findWaitingTiles(source, predicate = MJ.isWinHand) {
            if (source.length % 3 !== 1)
                return [];
            const allTiles = MJ.toArray("123456789m123456789p123456789s1234567z");
            return allTiles.filter((tile) => MJ.remains(source, tile) > 0 && predicate([...source, tile]));
        }
    }
    const _Hand = class {
        constructor(tiles, predicate = "standard") {
            if (typeof tiles === "string") {
                this.tiles = MJ.toArray(tiles);
            } else {
                this.tiles = tiles;
            }
            this.children = [];
            this.predicate = predicate;
        }
        get full() {
            return this.tiles.length % 3 === 2;
        }
        get predicateFn() {
            if (typeof this.predicate === "function") {
                return this.predicate;
            } else if (this.predicate in _Hand.predicates) {
                return _Hand.predicates[this.predicate];
            } else {
                throw new Error(`Unknown predicate "${this.predicate}"`);
            }
        }
        discard(tile) {
            const result = new _Hand(MJ.sub(this.tiles, tile), this.predicate);
            result.parent = { hand: this, type: "discard", tile, tileCount: -1 };
            return result;
        }
        draw(tile) {
            const result = new _Hand([...this.tiles, tile], this.predicate);
            result.parent = { hand: this, type: "draw", tile, tileCount: -1 };
            return result;
        }
        remains(tile) {
            const deck = [...this.tiles];
            for (let cur = this.parent; cur; cur = cur.hand.parent) {
                if (cur.type === "discard") {
                    deck.push(cur.tile);
                }
            }
            const result = MJ.remains(deck, tile);
            if (result < 0) {
                throw new Error(`tile "${tile}" has more than 4 tiles`);
            }
            return result;
        }
        isWinHand() {
            return this.predicateFn(this.tiles);
        }
        uniqueTiles(normalize = false) {
            const unique = (value, index, self) => self.indexOf(value) === index;
            let target = this.tiles;
            if (normalize) {
                target = MJ.normalize(target);
            }
            return target.filter(unique);
        }
        _xShantenPartial(childPredicate) {
            if (this.tiles.length % 3 !== 1) {
                return [];
            }
            this.children = [];
            for (const tile of _Hand.allTiles) {
                if (this.remains(tile) <= 0) {
                    continue;
                }
                const child = this.draw(tile);
                if (childPredicate.call(child)) {
                    this.children.push(child);
                }
            }
            return this.children;
        }
        _0ShantenPartial() {
            this.shanten = 0;
            return this._xShantenPartial(this.isWinHand);
        }
        _1ShantenPartial() {
            this.shanten = 1;
            return this._xShantenPartial(function () {
                return this._0ShantenFull().length !== 0;
            });
        }
        _2ShantenPartial() {
            this.shanten = 2;
            return this._xShantenPartial(function () {
                return this._1ShantenFull().length !== 0;
            });
        }

        _xShantenFull(childPredicate) {
            if (this.tiles.length % 3 !== 2) {
                return [];
            }
            this.children = [];
            for (const tile of this.uniqueTiles(true)) {
                const child = this.discard(tile);
                if (childPredicate.call(child)) {
                    this.children.push(child);
                }
            }
            return this.children;
        }
        _0ShantenFull() {
            this.shanten = 0;
            return this._xShantenFull(function () {
                return this._0ShantenPartial().length !== 0;
            });
        }
        _1ShantenFull() {
            this.shanten = 1;
            return this._xShantenFull(function () {
                return this._1ShantenPartial().length !== 0;
            });
        }

        _2ShantenFull() {
            this.shanten = 2;
            return this._xShantenFull(function () {
                return this._2ShantenPartial().length !== 0;
            });
        }
        markParentTileCount() {
            for (const child of this.children) {
                child.parent.tileCount = this.remains(child.parent.tile);
                child.markParentTileCount();
            }
        }
        mockShanten(shanten) {
            const lengthMod3 = this.tiles.length % 3;
            if (lengthMod3 === 0) {
                throw new Error(`Invalid tiles length ${shanten} to have shantens`);
            }
            this.shanten = shanten;
            if (shanten === 0) {
                const result = lengthMod3 === 2 ? this._0ShantenFull() : this._0ShantenPartial();
                this.markParentTileCount();
                return result;
            } else if (shanten === 1) {
                const result = lengthMod3 === 2 ? this._1ShantenFull() : this._1ShantenPartial();
                this.markParentTileCount();
                return result;
            } else if (shanten === 2) {
                const result = lengthMod3 === 2 ? this._2ShantenFull() : this._2ShantenPartial();
                this.markParentTileCount();
                return result;
            } else {
                return [];
            }
        }
    };
    let Hand = _Hand;
    Hand.allTiles = MJ.toArray("123456789m123456789p123456789s1234567z");
    Hand.predicates = {
        standard: MJ.isWinHand,
        normal: MJ.isNormalWinHand
    };
    function getTotalTileCounts(children) {
        return children.reduce((a, x) => a + x.parent.tileCount, 0);
    }
    // 计算听牌（0-shanten）状态下的好形率（好形牌数 / 总牌数）
    function computeTenpaiKoukeiRate(hand) {
        if (!hand.children || hand.children.length === 0) return 0;

        let total = 0;
        let koukei = 0;

        for (const tenpai of hand.children) {
            const count = tenpai.parent.tileCount;
            total += count;
            for (const t_tenpai of tenpai.children) {
                if (typeof count !== "number" || count <= 0) continue;


                // 判断是否是“好型”听牌：进入该听牌后仍有大于4张的有效进张
                const goodShape = t_tenpai.children && getTotalTileCounts(t_tenpai.children) > 4;
                // console.log(t_tenpai.parent, t_tenpai, t_tenpai.children, getTotalTileCounts(t_tenpai.children))
                // console.log(count)
                if (goodShape) {
                    koukei += count;
                    break
                }
            }
        }
        console.log(hand, total, koukei)
        return total > 0 ? koukei / total : 0;
    }

    // 对于某个1-shanten手牌（打某牌后进入），模拟所有摸牌，获取听牌路径中的好形率并平均
    function getExpectedMaxKoukeiRateForDiscard(hand) {
        hand.mockShanten(1);
        const rates = [];

        for (const child of hand.children) {
            // child 是 14 张牌，代表摸牌后的一向听手牌
            child._0ShantenFull();         // 强制生成所有听牌 discard 分支
            child.markParentTileCount();  // 初始化每个听牌节点的 tileCount


            const rate = computeTenpaiKoukeiRate(child);
            rates.push(rate);
        }

        if (rates.length === 0) return 0;
        // return rates.reduce((a, b) => a + b, 0) / rates.length;
        return Math.max(...rates);
    }




    const shantenToNumber = (text) => {
        text = text.trim();
        if (text.indexOf("\u8074\u724C") !== -1) {
            return 0;
        } else if (text.indexOf("\u548C\u4E86") !== -1) {
            return -1;
        } else {
            const index = text.indexOf("\u5411\u8074");
            if (index !== -1) {
                return Number.parseInt(text.substring(0, index));
            }
        }
        throw new Error(`"${text}" is not a valid shanten text`);
    };
    const getShantenInfo = () => {
        const tehaiElement = document.querySelector("#tehai");
        if (!tehaiElement) {
            throw new Error("Cannot find #tehai element");
        }
        let result = null;
        tehaiElement.childNodes.forEach((node) => {
            var _a;
            if (!result && node.nodeType === node.TEXT_NODE) {
                const text = (_a = node.textContent) != null ? _a : "";
                const pattern = /(\d向聴|聴牌|和了)/gm;
                const matches = text.match(pattern);
                if (matches) {
                    if (matches.length === 1) {
                        const shanten = shantenToNumber(matches[0]);
                        result = { standard: shanten, normal: shanten };
                    } else if (matches.length === 2) {
                        const standard = shantenToNumber(matches[0]);
                        const normal = shantenToNumber(matches[1]);
                        result = { standard, normal };
                    }
                }
            }
        });
        if (!result) {
            throw new Error("Cannot find shanten info");
        }
        return result;
    };
    const getTiles = () => {
        const pattern = /([0-9][mps]|[1-7]z).gif/;
        const tiles = [];
        document.querySelectorAll("div#tehai > a > img").forEach((element) => {
            const match = element.src.match(pattern);
            if (match) {
                tiles.push(match[1]);
            }
        });
        return tiles;
    };
    const getQueryType = () => {
        const elementM2A = document.querySelector("#m2 > a");
        if (!elementM2A) {
            throw new Error("Cannot get query type");
        }
        const content = elementM2A.innerHTML;
        if (content === "\u6A19\u6E96\u5F62") {
            return "normal";
        } else if (content === "\u4E00\u822C\u5F62") {
            return "standard";
        }
        throw new Error("Cannot get query type");
    };
    const parseTextareaContent = (content) => {
        const pattern = /([0-9]+[mps]|[1-7]+z)+/gm;
        const matches = content.match(pattern);
        const result = {
            hand: [],
            waitings: []
        };
        if (matches) {
            result.hand = MJ.toArray(matches[0]);
            if (content.indexOf("\u6253") !== -1) {
                for (let i = 1; i < matches.length; i += 2) {
                    result.waitings.push({ discard: matches[i], tiles: MJ.toArray(matches[i + 1]) });
                }
            } else {
                for (let i = 1; i < matches.length; ++i) {
                    result.waitings.push({ tiles: MJ.toArray(matches[i]) });
                }
            }
        }
        return result;
    };
    const getTextareaTiles = () => {
        var _a;
        const textarea = document.querySelector("div#m2 > textarea");
        if (!textarea) {
            throw new Error("Cannot get textarea element");
        }
        const content = (_a = textarea.textContent) != null ? _a : "";
        return parseTextareaContent(content);
    };
    const getUIInfo = () => {
        const shanten = getShantenInfo();
        const hand = getTiles().sort(MJ.compareTile);
        const waitingInfo = getTextareaTiles();
        const result = {
            shanten,
            ...waitingInfo,
            hand,
            query: {
                type: getQueryType(),
                autofill: hand.length !== waitingInfo.hand.length
            }
        };
        return result;
    };
    const style = ".shanten-tile {\n  position: relative;\n}\n.shanten-tile .popup {\n  display: none;\n  width: 300px;\n  background-color: #ddd;\n  color: #fff;\n  text-align: center;\n  border-radius: 6px;\n  padding: 8px 0;\n  position: absolute;\n  z-index: 1;\n  top: 125%;\n  left: 50%;\n  margin-left: -150px;\n}\n.shanten-tile .popup::before {\n  content: '';\n  position: absolute;\n  top: calc(0% - 10px);\n  left: 50%;\n  margin-left: -5px;\n  border-width: 5px;\n  border-style: solid;\n  border-color: transparent transparent #ddd transparent;\n}\n.shanten-tile .popup.show {\n  visibility: visible;\n}\n.shanten-tile .popup .popup-tile img:last-of-type {\n  margin-left: 5px;\n}\n.shanten-tile .popup table {\n  text-align: initial;\n  margin-left: auto;\n  margin-right: auto;\n}\n.shanten-tile:hover .popup {\n  display: block;\n}\n";
    const injectCss = () => {
        const styleSheet = document.createElement("style");
        styleSheet.setAttribute("type", "text/css");
        styleSheet.innerHTML = style;
        document.head.appendChild(styleSheet);
    };
    function getElement(arg1, arg2) {
        let targetDocument;
        let spec;
        if (arg2) {
            targetDocument = arg1;
            spec = arg2;
        } else {
            targetDocument = document;
            spec = arg1;
        }
        return getElementInner(targetDocument, spec);
    }
    function getElementInner(document2, spec) {
        if (typeof spec === "string") {
            return document2.createTextNode(spec);
        }
        const isHTMLElement = (x) => {
            return "tagName" in x;
        };
        if (isHTMLElement(spec)) {
            return spec;
        }
        const element = document2.createElement(spec["_tag"]);
        for (const key in spec) {
            if (key === "_tag") {
                continue;
            } else if (key === "_class") {
                element.className = spec[key];
            } else if (key === "_innerHTML") {
                element.innerHTML = spec[key];
            } else if (key === "_children") {
                const value = spec[key];
                const children = value.map((x) => getElementInner(document2, x));
                element.append(...children);
            } else {
                element.setAttribute(key, spec[key]);
            }
        }
        return element;
    }
    function getShantenTable(config) {
        config.rows.sort(compareRow);
        try {
            for (let row of config.rows) {
                console.log(row)
                let koukeiRate = row['tiles'].map(v => v['koukeiRate']).reduce((acc, x) => acc + x, 0) / row['tiles'].length
                row['koukeiRate'] = koukeiRate
            }
        } catch (e) {
            console.log(e)
        }
        console.log(config.rows)
        const table = getElement({
            _tag: "table",
            cellpadding: "2",
            cellspacing: "0",
            _children: [
                {
                    _tag: "tbody",
                    _children: config.rows.map(getShantenRow)
                }
            ]
        });
        if (config.showHand) {
            return getElement({
                _tag: "div",
                _class: "popup",
                _children: [{ _tag: "div", _class: "popup-tile", _children: config.hand.map(getShantenRowTile) }, table]
            });
        } else {
            return table;
        }
    }
    function compareRow(a, b) {
        const aNum = a.tiles.reduce((acc, x) => acc + x.count, 0);
        const bNum = b.tiles.reduce((acc, x) => acc + x.count, 0);
        if (aNum != bNum) {
            return bNum - aNum;
        } else {
            if (a.discard && b.discard) {
                return MJ.compareTile(a.discard, b.discard);
            } else {
                return 0;
            }
        }
    }
    function getShantenRow(config) {
        console.log("🚨 config.koukeiRate received in row:", config.koukeiRate);

        const tiles = splitRowTiles(config);
        const tdData = [];
        if (config.discard) {
            tdData.push(["\u6253"]);
            tdData.push([getShantenRowTile(config.discard)]);
        }
        tdData.push([config.tenpai ? "\u5F85\u3061[" : "\u6478["]);
        let koukeiTotalCount;
        let gukeiTotalCount;
        const hasKoukei = tiles.koukei.length > 0;
        const hasGukei = tiles.gukei.length > 0;
        if (hasKoukei || hasGukei) {
            if (hasKoukei) {
                tdData.push(tiles.koukei.map(getShantenRowTile));
                koukeiTotalCount = tiles.koukei.reduce((a, x) => a + x.count, 0);
                tdData.push([`\u597D\u5F62${koukeiTotalCount}\u679A`]);
            } else {
                koukeiTotalCount = 0;
                tdData.push([]);
                tdData.push([]);
            }
            tdData.push([hasKoukei && hasGukei ? "+" : ""]);
            if (hasGukei) {
                tdData.push(tiles.gukei.map(getShantenRowTile));
                gukeiTotalCount = tiles.gukei.reduce((a, x) => a + x.count, 0);
                tdData.push([`\u611A\u5F62${gukeiTotalCount}\u679A`]);
            } else {
                gukeiTotalCount = 0;
                tdData.push([]);
                tdData.push([]);
            }
            tdData.push(["="]);
        }
        const hasOther = tiles.other.length > 0;
        if (hasOther) {
            tdData.push(tiles.other.map(getShantenRowTile));
        }
        const totalCount = config.tiles.reduce((a, x) => a + x.count, 0);
        tdData.push([`${totalCount}\u679A`]);
        console.log(config.koukeiRate)
        if (typeof config.koukeiRate === "number") {
            tdData.push([`（期望好形率${Math.round(config.koukeiRate * 100)}%）`]);
        }

        if (koukeiTotalCount !== void 0) {
            const ratio = Math.round(100 * koukeiTotalCount / totalCount);
            tdData.push([`\uFF08\u597D\u5F62\u7387${ratio} %\uFF09`]);
        }
        tdData.push(["]"]);
        return getElement({
            _tag: "tr",
            _children: tdData.map((x) => ({
                _tag: "td",
                _children: x
            }))
        });
    }
    function splitRowTiles(config) {
        const koukei = [];
        const gukei = [];
        const other = [];
        for (const tile of config.tiles) {
            if (tile.type === "koukei") {
                koukei.push(tile);
            } else if (tile.type === "gukei") {
                gukei.push(tile);
            } else {
                other.push(tile);
            }
        }
        return { koukei, gukei, other };
    }
    function getShantenRowTile(config) {
        if (typeof config === "string") {
            return getElement({
                _tag: "img",
                src: `https://cdn.tenhou.net/2/a/${config}.gif`,
                border: "0",
                class: "D"
            });
        } else {
            const result = getElement({
                _tag: "span",
                _class: "shanten-tile",
                _children: [
                    {
                        _tag: "a",
                        href: config.url,
                        _children: [getShantenRowTile(config.tile)]
                    }
                ]
            });
            if (config.child) {
                const childTable = getShantenTable(config.child);
                result.appendChild(childTable);
            }
            return result;
        }
    }
    const isKoukei = (hand) => {
        for (const child of hand.children) {
            const waitingCount = getTotalTileCounts(child.children);
            if (waitingCount > 4) {
                return true;
            }
        }
        return false;
    };

    const getHandUrl = (hand) => {
        const queryType = hand.predicateFn === Hand.predicates.standard ? "q" : "p";
        const queryStr = hand.tiles.join("");
        return `https://tenhou.net/2/?${queryType}=${queryStr}`;
    };
    const getRowConfigFromHand = (hand) => {
        const tiles = [];

        for (const child of hand.children) {
            let tileType = null;
            let koukeiRate = null;

            if (hand.shanten === 1) {
                tileType = isKoukei(child) ? "koukei" : "gukei";
            } else if (hand.shanten === 2) {
                child._0ShantenFull();                     // ✅ 使用 Full
                child.markParentTileCount();              // ✅ 生成 tileCount
                koukeiRate = getExpectedMaxKoukeiRateForDiscard(child); // ✅ 正确值
                console.log("→ 最终期望好形率", koukeiRate);
            }

            const tileConfig = {
                type: tileType,
                tile: child.parent.tile,
                count: child.parent.tileCount,
                url: getHandUrl(child),
            };
            if (koukeiRate !== null) {
                tileConfig.koukeiRate = koukeiRate; // 注入好形率到config中，用于UI展示
                console.log("✔ 已写入 tileConfig.koukeiRate =", tileConfig.koukeiRate); // <- 这行务必打印
            }

            // 若处于 1-shanten 或 2-shanten，递归展示下一层听牌分析
            if (hand.shanten === 1) {
                const table = getTableConfigFromHand(child);
                table.showHand = true;
                tileConfig.child = table;
            }

            tiles.push(tileConfig);
            console.log(tiles)
        }

        return {
            discard: hand.parent?.tile,
            tiles,
            tenpai: hand.shanten === 0,
        };
    };
    const getTableConfigFromHand = (hand) => {
        const config = {
            hand: hand.tiles,
            showHand: false,
            rows: hand.children.map(getRowConfigFromHand)
        };
        return config;
    };
    const run = () => {
        let uiInfo;
        try {
            uiInfo = getUIInfo();
        } catch (e) {
            return;
        }
        const queryType = uiInfo.query.type;
        const currentShanten = uiInfo.shanten[queryType];
        if (currentShanten !== 1 && currentShanten !== 2) {
            return;
        }
        if (uiInfo.hand.length % 3 !== 2) {
            return;
        }
        const originalTable = document.querySelector("#m2 > table");
        if (!originalTable) {
            return;
        }
        injectCss();
        const hand = new Hand(uiInfo.hand, queryType);
        hand.mockShanten(currentShanten);
        const tableConfig = getTableConfigFromHand(hand);
        const table = getShantenTable(tableConfig);
        originalTable.after(table);
        originalTable.remove();
        if (currentShanten === 2) {
            const avgRate = getAverageExpectedKoukeiRate(hand);
            const avgDiv = document.createElement("div");
            avgDiv.style.marginTop = "10px";
            avgDiv.style.fontWeight = "bold";
            avgDiv.innerText = `所有切牌的期望好形率平均值：${(avgRate * 100).toFixed(1)}%`;
            table.after(avgDiv);
        }



    };
    run();
})();