function updateClipboard(CopyData) {
    try {
        navigator.clipboard.writeText(CopyData).then(function() {
            console.log('navigator.clipboard - Copying to clipboard was successful!')
        })
    } catch {
        GM_setClipboard(CopyData)
        console.log('GM_setClipboard - Copying to clipboard was successful!')
    }
}

function MaxZIndexFromPoint(selector) {
    //console.log(selector, getAllElementsFromPoint(document.querySelector(selector)) + 1)
    return getAllElementsFromPoint(document.querySelector(selector))
}

function getMaxZIndex() {
    return Math.max(
        ...Array.from(document.querySelectorAll('body *'), el =>
            parseFloat(window.getComputedStyle(el).zIndex),
        ).filter(zIndex => !Number.isNaN(zIndex)),
        1,
    );
}

function getZIndex(el) {
    if (el && el !== document.body && el !== window && el !== document && el !== document.documentElement) {
        var z = window.document.defaultView.getComputedStyle(el).getPropertyValue('z-index');
        if (isNaN(z)) return getZIndex(el.parentNode);
    }
    return z;
};

function getPosition(element) {
    let rect = element.getBoundingClientRect()
    return {
        x: rect.x,
        y: rect.y
    };
}

function getAllElementsFromPoint(el) {
    let elements = [];
    let display = [];
    let zIndex = []
    let item = document.elementFromPoint(getPosition(el).x, getPosition(el).y)
    while (item && item !== document.body && item !== window && item !== document && item !== document.documentElement && el !== item) {
        //console.log(item)
        elements.push(item);
        display.push(item.style.display)
        if (!isNaN(getZIndex(item))) {
            let zI = getZIndex(item)
            console.log(zI)
            zIndex.push(zI)
        }
        item.style.display = "none";
        item = document.elementFromPoint(getPosition(el).x, getPosition(el).y);
    }
    // restore display property
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = display[i];
    }
    return Math.max(...zIndex, 1);
}

function getElementOffset(el) {
    let rect = el.getBoundingClientRect()
    return {
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        width: rect.width,
        height: rect.height,
    };
}

function getRelativeOffset(el) {
    return {
        top: el.offsetTop,
        bottom: el.offsetTop + el.offsetHeight,
        left: el.offsetLeft,
        right: el.offsetLeft + el.offsetWidth,
        width: el.offsetWidth,
        height: el.offsetHeight,
    };
}

function getNodeTextElementOffset(node) {
    let textNode = getTextNodesIn(node, false)
    let range = document.createRange();
    try {
        range.selectNode(textNode);
        let rect = range.getBoundingClientRect()
        return {
            top: rect.offsetTop,
            bottom: rect.offsetTop + rect.offsetHeight,
            left: rect.offsetLeft,
            right: rect.offsetLeft + rect.offsetWidth,
            width: rect.offsetWidth,
            height: rect.offsetHeight,
        }    
    } catch (error) {
        console.error(error)
        return {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: 0,
            height: 0,
        }   
    }    
}

function getTextNodesIn(node, includeWhitespaceNodes) {
    var textNodes = [], nonWhitespaceMatcher = /\S/;

    function getTextNodes(node) {
        if (node.nodeType == Node.TEXT_NODE) {
            if (includeWhitespaceNodes || nonWhitespaceMatcher.test(node.nodeValue)) {
                textNodes.push(node);
            }
        } else {
            for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                getTextNodes(node.childNodes[i]);
            }
        }
    }

    getTextNodes(node);
    //console.log(textNodes, textNodes?.length)
    return textNodes?.length ? textNodes.shift() : null;
}
function getDefaultFontSize() {
    const element = document.createElement('div');
    element.style.width = '1rem';
    element.style.display = 'none';
    document.body.append(element);

    const widthMatch = window
        .getComputedStyle(element)
        .getPropertyValue('width')
        .match(/\d+/);

    element.remove();

    if (!widthMatch || widthMatch.length < 1) {
        return null;
    }

    const result = Number(widthMatch[0]);
    return !isNaN(result) ? result : null;
}

//백그라운드 이미지 가져오기
function GetBackGroundUrl(Area) {
    let BackGroundUrl = ''
    try {
        let imgURL = window.document.defaultView.getComputedStyle(Area, null).getPropertyValue('background')
        BackGroundUrl = imgURL.replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '')
        return BackGroundUrl
    } catch (err) {
        console.log(err)
    }
}

//Match
function MatchRegex(Area, regex, attributeToSearch) {
    //console.log(Area, regex, attributeToSearch)
    const output = [];
    if (attributeToSearch) {
        for (let element of Area.querySelectorAll(`[${attributeToSearch}]`)) {
            //console.log(regex.test(element.getAttribute(attributeToSearch)), element)
            if (regex.test(element.getAttribute(attributeToSearch))) {
                //console.log(element)
                output.push(element);
            }
        }
    } else {
        for (let element of Area.querySelectorAll('*')) {
            for (let attribute of element.attributes) {
                if (regex.test(attribute.value)) {
                    //console.log(element)
                    output.push(element);
                }
            }
        }
    }
    return output;
}

// Not Match
function NotMatchRegex(Area, regex, attributeToSearch) {
    const output = [];
    if (attributeToSearch) {
        for (let element of Area.querySelectorAll(`[${attributeToSearch}]`)) {
            if (!regex.test(element.getAttribute(attributeToSearch))) {
                //console.log(element)
                output.push(element);
            }
        }
    } else {
        for (let element of Area.querySelectorAll('*')) {
            for (let attribute of element.attributes) {
                if (!regex.test(attribute.value)) {
                    //console.log(element)
                    output.push(element);
                }
            }
        }
    }
    return output;
}

function querySelectorAllRegex(Area, regex, attributeToSearch) {
    const output = [];
    if (attributeToSearch === 'href') {
        for (let element of Area.querySelectorAll('A')) {
            if (element.href && !regex.test(element.href)) {
                //console.log(element, regex)
                output.push(element);
            }
        }
    } else if (attributeToSearch) {
        for (let element of Area.querySelectorAll(`[${attributeToSearch}]`)) {
            if (!regex.test(element.getAttribute(attributeToSearch))) {
                console.log(element, regex)
                output.push(element);
            }
        }
    } else {
        for (let element of Area.querySelectorAll('*')) {
            for (let attribute of element.attributes) {
                if (!regex.test(attribute.value)) {
                    console.log(element)
                    output.push(element);
                }
            }
        }
    }
    return output;
}

function byteLengthOf(TitleText, maxByte) {
    //assuming the String is UCS-2(aka UTF-16) encoded
    let Result
    let CharByte = 0
    let LineByte = 0
    for (var i = 0, l = TitleText.length; i < l; i++) {
        var Code = TitleText.charCodeAt(i);
        if (Code < 0x0080) { //[0x0000, 0x007F]
            CharByte = 1
            LineByte += 1;
        } else if (Code < 0x0800) { //[0x0080, 0x07FF]
            CharByte = 2
            LineByte += 2;
        } else if (Code < 0xD800) { //[0x0800, 0xD7FF]
            CharByte = 3
            LineByte += 3;
        } else if (Code < 0xDC00) { //[0xD800, 0xDBFF]
            var lo = TitleText.charCodeAt(++i);
            if (i < l && lo >= 0xDC00 && lo <= 0xDFFF) { //followed by [0xDC00, 0xDFFF]
                CharByte = 4
                LineByte += 4;
            } else {
                CharByte = 0
                throw new Error("UCS-2 String malformed");
            }
        } else if (Code < 0xE000) { //[0xDC00, 0xDFFF]
            CharByte = 0
            throw new Error("UCS-2 String malformed");
        } else { //[0xE000, 0xFFFF]
            CharByte = 3
            LineByte += 3;
        }
        //console.log(TitleText[i], CharByte, LineByte)
        if (LineByte >= maxByte) {
            TitleText = TitleText.substr(0, i).replace(/(、|,)$/, '').trim()
            Result = TitleText + '…'
            break;
        }
    }
    return Result ? Result.trim() : TitleText
}

function byteLengthOfCheck(TitleText) {
    if (typeof TitleText === 'undefined') { return 0 }
    //assuming the String is UCS-2(aka UTF-16) encoded
    let LineByte = 0
    for (var i = 0, l = TitleText.length; i < l; i++) {
        var Code = TitleText.charCodeAt(i);
        if (Code < 0x0080) { //[0x0000, 0x007F]
            LineByte += 1;
        } else if (Code < 0x0800) { //[0x0080, 0x07FF]
            LineByte += 2;
        } else if (Code < 0xD800) { //[0x0800, 0xD7FF]
            LineByte += 3;
        } else if (Code < 0xDC00) { //[0xD800, 0xDBFF]
            var lo = TitleText.charCodeAt(++i);
            if (i < l && lo >= 0xDC00 && lo <= 0xDFFF) { //followed by [0xDC00, 0xDFFF]
                LineByte += 4;
            } else {
                throw new Error("UCS-2 String malformed");
            }
        } else if (Code < 0xE000) { //[0xDC00, 0xDFFF]
            throw new Error("UCS-2 String malformed");
        } else { //[0xE000, 0xFFFF]
            LineByte += 3;
        }
    }
    return LineByte
}

function SearchChar(Text, Char) {
    let result = ''
    let SearchEx = new RegExp(Char, 'g')
    if (Text.match(SearchEx)) {
        return Text.match(SearchEx).reverse()[0]
    } else return result
}

function getFlag(Text) {
    let Point = []
    let LastPoint = Text.length - 1
    for (let j = LastPoint; j > 0; j--) {
        let Code = Text.charCodeAt(j)
        if (Code > 65280 && Code < 65375 && Code != 65306) {
            console.log(j, Code, String.fromCodePoint(Code))
            Point.push(j + 1)
        }
    }
    return Point
}

//ingnore childNodes Text
function ingnoreChildNodesText(element) {
    let childNodes = element.childNodes;
    result = '';

    for (let i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType == 3) {
            result += childNodes[i].data;
        }
    }

    return result;
}

// innerText except A tag
function getDirectInnerText(element) {
    let childNodes = element.childNodes;
    let result = ''

    for (let i = 0; i < childNodes.length; i++) {
        //console.log('nodeType: ', childNodes[i], childNodes[i].nodeType, childNodes[i].tagName )
        if (childNodes[i].tagName === 'A' || childNodes[i].nodeType == 3) {
            result += childNodes[i].data ? childNodes[i].data : childNodes[i].textContent;
        }
    }

    return result;
}

//첫글자 대문자
function nameCorrection(str) {
    let strPerfect = str.replace(/\s+/g, " ").trim();
    let strSmall = strPerfect.toLowerCase();
    let arrSmall = strSmall.split(" ");
    let arrCapital = [];
    for (let x of arrSmall.values()) {
        arrCapital.push(x[0].toUpperCase() + x.slice(1));
    }

    return arrCapital.join(" ");
}

function capitalize(str) {
    //console.log('capitalize: ', str)
    let result = str[0].toUpperCase();

    for (let i = 1; i < str.length; i++) {
        if (str[i - 1] === ' ') {
            result += str[i].toUpperCase();
        } else {
            result += str[i];
        }
    }

    return result;
}

//파일명 사용불가 문자 전각문자로 변환
function FilenameConvert(text) {
    const ExcludeChar = /[<\/:>*?"|\\]/g
    let result = text.replace(ExcludeChar, function(elem) {
        return String.fromCharCode(parseInt(elem.charCodeAt(0)) + 65248)
    })
    return result
}

function getNumericMonth(monthAbbr) {
    monthAbbr = capitalize(monthAbbr)
    return (String(['January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ].indexOf(monthAbbr) + 1).padStart(2, '0'))
}

/**
 * 해당 함수는
 * php의 mb_convert_kana의 Javascript 버전이다.
 * 히라가나는 반각이 없음.
 */

function mbConvertKana(text, option) {
    let katahan, kanazen, hirazen, mojilength, i, re;
    katahan = ["ｶﾞ", "ｷﾞ", "ｸﾞ", "ｹﾞ", "ｺﾞ", "ｻﾞ", "ｼﾞ", "ｽﾞ", "ｾﾞ", "ｿﾞ", "ﾀﾞ", "ﾁﾞ", "ﾂﾞ", "ﾃﾞ", "ﾄﾞ", "ﾊﾞ", "ﾊﾟ", "ﾋﾞ", "ﾋﾟ", "ﾌﾞ", "ﾌﾟ", "ﾍﾞ", "ﾍﾟ", "ﾎﾞ", "ﾎﾟ", "ｳﾞ", "ｰ", "ｧ", "ｱ", "ｨ", "ｲ", "ｩ", "ｳ", "ｪ", "ｴ", "ｫ", "ｵ", "ｶ", "ｷ", "ｸ", "ｹ", "ｺ", "ｻ", "ｼ", "ｽ", "ｾ", "ｿ", "ﾀ", "ﾁ", "ｯ", "ﾂ", "ﾃ", "ﾄ", "ﾅ", "ﾆ", "ﾇ", "ﾈ", "ﾉ", "ﾊ", "ﾋ", "ﾌ", "ﾍ", "ﾎ", "ﾏ", "ﾐ", "ﾑ", "ﾒ", "ﾓ", "ｬ", "ﾔ", "ｭ", "ﾕ", "ｮ", "ﾖ", "ﾗ", "ﾘ", "ﾙ", "ﾚ", "ﾛ", "ﾜ", "ｦ", "ﾝ", "ｶ", "ｹ", "ﾜ", "ｲ", "ｴ", "ﾞ", "ﾟ"];
    kanazen = ["ガ", "ギ", "グ", "ゲ", "ゴ", "ザ", "ジ", "ズ", "ゼ", "ゾ", "ダ", "ヂ", "ヅ", "デ", "ド", "バ", "パ", "ビ", "ピ", "ブ", "プ", "ベ", "ペ", "ボ", "ポ", "ヴ", "ー", "ァ", "ア", "ィ", "イ", "ゥ", "ウ", "ェ", "エ", "ォ", "オ", "カ", "キ", "ク", "ケ", "コ", "サ", "シ", "ス", "セ", "ソ", "タ", "チ", "ッ", "ツ", "テ", "ト", "ナ", "ニ", "ヌ", "ネ", "ノ", "ハ", "ヒ", "フ", "ヘ", "ホ", "マ", "ミ", "ム", "メ", "モ", "ャ", "ヤ", "ュ", "ユ", "ョ", "ヨ", "ラ", "リ", "ル", "レ", "ロ", "ワ", "ヲ", "ン", "ヵ", "ヶ", "ヮ", "ヰ", "ヱ", "゛", "゜"];
    hirazen = ["が", "ぎ", "ぐ", "げ", "ご", "ざ", "じ", "ず", "ぜ", "ぞ", "だ", "ぢ", "づ", "で", "ど", "ば", "ぱ", "び", "ぴ", "ぶ", "ぷ", "べ", "ぺ", "ぼ", "ぽ", "ヴ", "ー", "ぁ", "あ", "ぃ", "い", "ぅ", "う", "ぇ", "え", "ぉ", "お", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ", "た", "ち", "っ", "つ", "て", "と", "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ", "ま", "み", "む", "め", "も", "ゃ", "や", "ゅ", "ゆ", "ょ", "よ", "ら", "り", "る", "れ", "ろ", "わ", "を", "ん", "か", "け", "ゎ", "ゐ", "ゑ", "゛", "゜"];
    mojilength = katahan.length;
    // r: 전각문자를 반각으로 변환
    // a: 전각영문자를 반각으로 변환
    if (option.match(/[ra]/)) {
        text = text.replace(/[Ａ-ｚ]/g, function(elem) {
            return String.fromCharCode(parseInt(elem.charCodeAt(0)) - 65248);
        });
    }
    // R: 반각문자를 전각으로 변환
    // A: 반각영문자를 전각으로 변환
    if (option.match(/[RA]/)) {
        text = text.replace(/[A-z]/g, function(elem) {
            return String.fromCharCode(parseInt(elem.charCodeAt(0)) + 65248);
        });
    }
    // n: 전각숫자를 반각으로 변환
    // a: 전각 영숫자를 반각으로 변환
    if (option.match(/[na]/)) {
        text = text.replace(/[０-９]/g, function(elem) {
            return String.fromCharCode(parseInt(elem.charCodeAt(0)) - 65248);
        });
    }
    // N: 반각숫자를 전각으로 변환
    // A: 반각영숫자를 전각으로 변환
    if (option.match(/[NA]/)) {
        text = text.replace(/[0-9]/g, function(elem) {
            return String.fromCharCode(parseInt(elem.charCodeAt(0)) + 65248);
        });
    }
    // s: 전각스페이스를 반각으로 변환
    if (option.match(/s/)) {
        text = text.replace(/　/g, " ");
    }
    // S: 반각스페이스를 전각으로 변환
    if (option.match(/S/)) {
        text = text.replace(/ /g, "　");
    }
    // k: 전각카타카나를 반각 카타카타로 변환
    if (option.match(/k/)) {
        for (i = 0; i < mojilength; i++) {
            re = new RegExp(kanazen[i], "g");
            text = text.replace(re, katahan[i]);
        }
    }
    // K: 반각카타카타를 전각카타카타로 변환
    // V: 탁점사용중인 문자를 글자로 변환
    if (option.match(/K/)) {
        if (!option.match(/V/)) {
            text = text.replace(/ﾞ/g, "゛");
            text = text.replace(/ﾟ/g, "゜");
        }
        for (i = 0; i < mojilength; i++) {
            re = new RegExp(katahan[i], "g");
            text = text.replace(re, kanazen[i]);
        }
    }
    // h: 전각히라가나를 반각카타카나로 변환
    if (option.match(/h/)) {
        for (i = 0; i < mojilength; i++) {
            re = new RegExp(hirazen[i], "g");
            text = text.replace(re, katahan[i]);
        }
    }
    // H: 반각카타카나를 전각히라가라로 변환
    // V: 탁점사용중인 문자를 글자로 변환
    if (option.match(/H/)) {
        if (!option.match(/V/)) {
            text = text.replace(/ﾞ/g, "゛");
            text = text.replace(/ﾟ/g, "゜");
        }
        for (i = 0; i < mojilength; i++) {
            re = new RegExp(katahan[i], "g");
            text = text.replace(re, hirazen[i]);
        }
    }
    // c: 전각카타카나를 전각히라가나로 변환
    if (option.match(/c/)) {
        for (i = 0; i < mojilength; i++) {
            re = new RegExp(kanazen[i], "g");
            text = text.replace(re, hirazen[i]);
        }
    }
    // C: 전각히라가나를 전각카타카나로 변환
    if (option.match(/C/)) {
        for (i = 0; i < mojilength; i++) {
            re = new RegExp(hirazen[i], "g");
            text = text.replace(re, kanazen[i]);
        }
    }
    return text;
}