// ==UserScript==
// @name         阿里云盘字幕
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  让你的视频文件和字幕文件梦幻联动！
// @author       polygon
// @match        https://www.aliyundrive.com/drive*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @runat        document-end
// @downloadURL https://update.greasyfork.org/scripts/431503/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/431503/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==
!function(f){"object"==typeof exports&&"undefined"!=typeof module?module.exports=f():"function"==typeof define&&define.amd?define([],f):("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).languageEncoding=f()}(function(){return function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var p="function"==typeof require&&require;if(!f&&p)return p(i,!0);if(u)return u(i,!0);throw(p=new Error("Cannot find module '"+i+"'")).code="MODULE_NOT_FOUND",p}p=n[i]={exports:{}},e[i][0].call(p.exports,function(r){return o(e[i][1][r]||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}({1:[function(require,module,exports){const byteOrderMarks=require("../config/byteOrderMarkObject.js");module.exports=uInt8Start=>{for(const element of byteOrderMarks)if(element.regex.test(uInt8Start))return element.encoding;return null}},{"../config/byteOrderMarkObject.js":6}],2:[function(require,module,exports){module.exports=content=>{for(let b=0;b<content.length;b++)if("�"===content[b])return!1;return!0}},{}],3:[function(require,module,exports){const countAllMatches=require("./processing-content/countAllMatches.js"),calculateConfidenceScore=require("./processing-content/calculateConfidenceScore.js");module.exports=(data,fileInfo)=>{data.languageArr=countAllMatches(data,fileInfo.encoding),fileInfo.language=data.languageArr.reduce((acc,val)=>acc.count>val.count?acc:val).name,data.pos=data.languageArr.findIndex(elem=>elem.name===fileInfo.language),fileInfo.encoding||(fileInfo.encoding=data.languageArr[data.pos].encoding);var calculations=calculateConfidenceScore(data,fileInfo);return data.testFile?calculations:(fileInfo.confidence.encoding||(fileInfo.confidence.encoding=calculations),fileInfo.confidence.language=calculations,data.languageArr[data.pos].count||(fileInfo.language=null,fileInfo.confidence.language=null),fileInfo)}},{"./processing-content/calculateConfidenceScore.js":4,"./processing-content/countAllMatches.js":5}],4:[function(require,module,exports){module.exports=(surplus,fileInfo)=>{var confidenceRaise=new RegExp(/\d|\n|\s|\-|\.|\,|\:|\;|\?|\!|\<|\>|\[|\]|\{|\}|\&|\=|\|/,"g"),totalCharacters=surplus.content.replace(confidenceRaise,"").length;const langArr=surplus.languageArr;var pos=surplus.pos;const testFile=surplus.testFile;var secondLanguage=langArr.reduce((acc,val)=>acc.name!==fileInfo.language&&(val.name===fileInfo.language||acc.count>=val.count)?acc:val);const languageRatio=langArr[pos].count/(secondLanguage.count+langArr[pos].count),characterWordRatio=langArr[pos].count/totalCharacters;let lowerLimit=null,upperLimit=null;upperLimit="UTF-8"===fileInfo.encoding||"UTF-16LE"===fileInfo.encoding?(lowerLimit=langArr[pos].utfFrequency?.8*langArr[pos].utfFrequency.low:null,langArr[pos].utfFrequency?(langArr[pos].utfFrequency.low+langArr[pos].utfFrequency.high)/2:null):(lowerLimit=langArr[pos].isoFrequency?.8*langArr[pos].isoFrequency.low:null,langArr[pos].isoFrequency?(langArr[pos].isoFrequency.low+langArr[pos].isoFrequency.high)/2:null);let confidenceScore;return confidenceScore=lowerLimit&&upperLimit?characterWordRatio>=upperLimit?1:characterWordRatio>lowerLimit?(confidenceRaise=upperLimit-lowerLimit,surplus=characterWordRatio-lowerLimit,confidenceRaise=(1-languageRatio)*(surplus/confidenceRaise),Number((languageRatio+confidenceRaise).toFixed(2))):Number((languageRatio*(characterWordRatio/lowerLimit)).toFixed(2)):null,testFile?{name:testFile.substr(testFile.lastIndexOf("/")+1),path:testFile,encoding:fileInfo.encoding,language:fileInfo.language,languageConfidence:confidenceScore,ratio:Number(languageRatio.toFixed(2)),count:langArr[pos].count,totalCharacters:totalCharacters,characterWordRatio:characterWordRatio.toFixed(6),secondLanguage:{name:secondLanguage.name,count:secondLanguage.count}}:confidenceScore}},{}],5:[function(require,module,exports){const languageArr=require("../../config/languageObject.js");module.exports=(data,encoding)=>{const newLanguageArr=[];languageArr.forEach(obj=>{const updatedLangObj={};Object.keys(obj).forEach(key=>{"count"!==key?updatedLangObj[key]=obj[key]:updatedLangObj.count=0}),newLanguageArr.push(updatedLangObj)});const regex=encoding?"utfRegex":"isoRegex";return newLanguageArr.forEach(lang=>{var matches;!lang[regex]||(matches=data.content.match(lang[regex]))&&(lang.count=matches.length)}),newLanguageArr}},{"../../config/languageObject.js":7}],6:[function(require,module,exports){module.exports=[{encoding:"UTF-EBCDIC",regex:new RegExp("221 115 102 115")},{encoding:"GB-18030",regex:new RegExp("132 49 149 51")},{encoding:"UTF-32LE",regex:new RegExp("255 254 0 0")},{encoding:"UTF-32BE",regex:new RegExp("0 0 254 255")},{encoding:"UTF-8",regex:new RegExp("239 187 191")},{encoding:"UTF-7",regex:new RegExp("43 47 118")},{encoding:"UTF-1",regex:new RegExp("247 100 76")},{encoding:"SCSU",regex:new RegExp("14 254 255")},{encoding:"BOCU-1",regex:new RegExp("251 238 40")},{encoding:"UTF-16BE",regex:new RegExp("254 255")},{encoding:"UTF-16LE",regex:new RegExp("255 254")}]},{}],7:[function(require,module,exports){var sharedRegex={czech:new RegExp(/jsem|jsi/,"gi"),hungarian:new RegExp(/\snem\s/,"gi"),slovak:new RegExp(/poriadku|myslím|\ssme\s/,"gi"),slovenian:new RegExp(/\skaj\s|lahko|zdaj/,"gi"),albanian:new RegExp(/nuk/,"gi"),english:new RegExp(/ the /,"gi"),french:new RegExp(/c'est/,"gi"),portuguese:new RegExp(/ não /,"gi"),spanish:new RegExp(/estaba|\smuy\s|siempre|ahora/,"gi"),german:new RegExp(/\sdas\s/,"gi"),italian:new RegExp(/\sche\s/,"gi"),danish:new RegExp(/hvad|noget/,"gi"),norwegian:new RegExp(/deg/,"gi"),swedish:new RegExp(/ jag /,"gi"),dutch:new RegExp(/ het /,"gi"),finnish:new RegExp(/hän/,"gi"),"serbo-croatian":new RegExp(/ sam | kako /,"gi"),estonian:new RegExp(/\sseda\s|\spole\s|midagi/,"gi"),icelandic:new RegExp(/Það/,"gi"),"malay-indonesian":new RegExp(/tidak/,"gi"),turkish:new RegExp(/ bir /,"gi"),lithuanian:new RegExp(/taip|\stai\s/,"gi"),bengali:new RegExp(/এটা/,"gi"),hindi:new RegExp(/हैं/,"gi"),urdu:new RegExp(/ایک/,"gi"),vietnamese:new RegExp(/ không /,"gi")},sharedFrequency={polish:{low:.004355,high:.005102},czech:{low:.004433,high:.007324},hungarian:{low:.004994,high:.005183},romanian:{low:.003319,high:.00419},slovak:{low:.001736,high:.002557},slovenian:{low:.004111,high:.004959},albanian:{low:.003773,high:.007313},ukrainian:{low:.002933,high:.005389},english:{low:.004679,high:.00758},french:{low:.003016,high:.004825},portuguese:{low:.003406,high:.005032},spanish:{low:.002348,high:.002881},german:{low:.004044,high:.004391},italian:{low:.003889,high:.005175},danish:{low:.00363,high:.004189},norwegian:{low:.00241,high:.003918},swedish:{low:.004916,high:.007221},dutch:{low:.003501,high:.00415},finnish:{low:.003308,high:.005135},"serbo-croatian":{low:.002568,high:.005182},estonian:{low:.002892,high:.003963},icelandic:{low:.004366,high:.004366},"malay-indonesian":{low:.002825,high:.003932},greek:{low:.00344,high:.004862},turkish:{low:.002915,high:.004588},hebrew:{low:.003663,high:.004666},lithuanian:{low:.003277,high:.003768},bengali:{low:.003155,high:.005236},hindi:{low:.004159,high:.006478},urdu:{low:.004118,high:.005851},vietnamese:{low:.003387,high:.005191}};module.exports=[{name:"polish",count:0,utfRegex:new RegExp(/się/,"gi"),isoRegex:new RegExp(/siê/,"gi"),encoding:"CP1250",utfFrequency:sharedFrequency.polish,isoFrequency:sharedFrequency.polish},{name:"czech",count:0,utfRegex:sharedRegex.czech,isoRegex:sharedRegex.czech,encoding:"CP1250",utfFrequency:sharedFrequency.czech,isoFrequency:sharedFrequency.czech},{name:"hungarian",count:0,utfRegex:sharedRegex.hungarian,isoRegex:sharedRegex.hungarian,encoding:"CP1250",utfFrequency:sharedFrequency.hungarian,isoFrequency:sharedFrequency.hungarian},{name:"romanian",count:0,utfRegex:new RegExp(/sunt|eşti/,"gi"),isoRegex:new RegExp(/sunt|eºti/,"gi"),encoding:"CP1250",utfFrequency:sharedFrequency.romanian,isoFrequency:sharedFrequency.romanian},{name:"slovak",count:0,utfRegex:sharedRegex.slovak,isoRegex:sharedRegex.slovak,encoding:"CP1250",utfFrequency:sharedFrequency.slovak,isoFrequency:sharedFrequency.slovak},{name:"slovenian",count:0,utfRegex:sharedRegex.slovenian,isoRegex:sharedRegex.slovenian,encoding:"CP1250",utfFrequency:sharedFrequency.slovenian,isoFrequency:sharedFrequency.slovenian},{name:"albanian",count:0,utfRegex:sharedRegex.albanian,isoRegex:sharedRegex.albanian,encoding:"CP1250",utfFrequency:sharedFrequency.albanian,isoFrequency:sharedFrequency.albanian},{name:"russian",count:0,utfRegex:new RegExp(/что/,"gi"),isoRegex:new RegExp(/÷òî/,"gi"),encoding:"CP1251",utfFrequency:{low:.004965,high:.005341},isoFrequency:{low:.003884,high:.003986}},{name:"ukrainian",count:0,utfRegex:new RegExp(/він|але/,"gi"),isoRegex:new RegExp(/â³í|àëå/,"gi"),encoding:"CP1251",utfFrequency:sharedFrequency.ukrainian,isoFrequency:sharedFrequency.ukrainian},{name:"bulgarian",count:0,utfRegex:new RegExp(/това|какво/,"gi"),isoRegex:new RegExp(/òîâà|äîáðå|êaêâo/,"gi"),encoding:"CP1251",utfFrequency:{low:.005225,high:.005628},isoFrequency:{low:.002767,high:.004951}},{name:"english",count:0,utfRegex:sharedRegex.english,isoRegex:sharedRegex.english,encoding:"CP1252",utfFrequency:sharedFrequency.english,isoFrequency:sharedFrequency.english},{name:"french",count:0,utfRegex:sharedRegex.french,isoRegex:sharedRegex.french,encoding:"CP1252",utfFrequency:sharedFrequency.french,isoFrequency:sharedFrequency.french},{name:"portuguese",count:0,utfRegex:sharedRegex.portuguese,isoRegex:sharedRegex.portuguese,encoding:"CP1252",utfFrequency:sharedFrequency.portuguese,isoFrequency:sharedFrequency.portuguese},{name:"spanish",count:0,utfRegex:sharedRegex.spanish,isoRegex:sharedRegex.spanish,encoding:"CP1252",utfFrequency:sharedFrequency.spanish,isoFrequency:sharedFrequency.spanish},{name:"german",count:0,utfRegex:sharedRegex.german,isoRegex:sharedRegex.german,encoding:"CP1252",utfFrequency:sharedFrequency.german,isoFrequency:sharedFrequency.german},{name:"italian",count:0,utfRegex:sharedRegex.italian,isoRegex:sharedRegex.italian,encoding:"CP1252",utfFrequency:sharedFrequency.italian,isoFrequency:sharedFrequency.italian},{name:"danish",count:0,utfRegex:sharedRegex.danish,isoRegex:sharedRegex.danish,encoding:"CP1252",utfFrequency:sharedFrequency.danish,isoFrequency:sharedFrequency.danish},{name:"norwegian",count:0,utfRegex:sharedRegex.norwegian,isoRegex:sharedRegex.norwegian,encoding:"CP1252",utfFrequency:sharedFrequency.norwegian,isoFrequency:sharedFrequency.norwegian},{name:"swedish",count:0,utfRegex:sharedRegex.swedish,isoRegex:sharedRegex.swedish,encoding:"CP1252",utfFrequency:sharedFrequency.swedish,isoFrequency:sharedFrequency.swedish},{name:"dutch",count:0,utfRegex:sharedRegex.dutch,isoRegex:sharedRegex.dutch,encoding:"CP1252",utfFrequency:sharedFrequency.dutch,isoFrequency:sharedFrequency.dutch},{name:"finnish",count:0,utfRegex:sharedRegex.finnish,isoRegex:sharedRegex.finnish,encoding:"CP1252",utfFrequency:sharedFrequency.finnish,isoFrequency:sharedFrequency.finnish},{name:"serbo-croatian",count:0,utfRegex:sharedRegex["serbo-croatian"],isoRegex:sharedRegex["serbo-croatian"],encoding:"CP1252",utfFrequency:sharedFrequency["serbo-croatian"],isoFrequency:sharedFrequency["serbo-croatian"]},{name:"estonian",count:0,utfRegex:sharedRegex.estonian,isoRegex:sharedRegex.estonian,encoding:"CP1252",utfFrequency:sharedFrequency.estonian,isoFrequency:sharedFrequency.estonian},{name:"icelandic",count:0,utfRegex:sharedRegex.icelandic,isoRegex:sharedRegex.icelandic,encoding:"CP1252",utfFrequency:sharedFrequency.icelandic,isoFrequency:sharedFrequency.icelandic},{name:"malay-indonesian",count:0,utfRegex:sharedRegex["malay-indonesian"],isoRegex:sharedRegex["malay-indonesian"],encoding:"CP1252",utfFrequency:sharedFrequency["malay-indonesian"],isoFrequency:sharedFrequency["malay-indonesian"]},{name:"greek",count:0,utfRegex:new RegExp(/είναι/,"gi"),isoRegex:new RegExp(/åßíáé/,"gi"),encoding:"CP1253",utfFrequency:sharedFrequency.greek,isoFrequency:sharedFrequency.greek},{name:"turkish",count:0,utfRegex:sharedRegex.turkish,isoRegex:sharedRegex.turkish,encoding:"CP1254",utfFrequency:sharedFrequency.turkish,isoFrequency:sharedFrequency.turkish},{name:"hebrew",count:0,utfRegex:new RegExp(/אתה/,"gi"),isoRegex:new RegExp(/àúä/,"gi"),encoding:"CP1255",utfFrequency:sharedFrequency.hebrew,isoFrequency:sharedFrequency.hebrew},{name:"arabic",count:0,utfRegex:new RegExp(/هذا/,"gi"),isoRegex:new RegExp(/åðç/,"gi"),encoding:"CP1256",utfFrequency:{low:.003522,high:.004348},isoFrequency:{low:.003773,high:.005559}},{name:"farsi-persian",count:0,utfRegex:new RegExp(/اون/,"gi"),isoRegex:new RegExp(/çíä/,"gi"),encoding:"CP1256",utfFrequency:{low:.002761,high:.004856},isoFrequency:{low:.00301,high:.006646}},{name:"lithuanian",count:0,utfRegex:sharedRegex.lithuanian,isoRegex:sharedRegex.lithuanian,encoding:"CP1257",utfFrequency:sharedFrequency.lithuanian,isoFrequency:sharedFrequency.lithuanian},{name:"chinese-simplified",count:0,utfRegex:new RegExp(/么/,"gi"),isoRegex:new RegExp(/´ó|¶¯|Å®/,"gi"),encoding:"GB18030",utfFrequency:{low:.009567,high:.011502},isoFrequency:{low:.003137,high:.005009}},{name:"chinese-traditional",count:0,utfRegex:new RegExp(/們/,"gi"),isoRegex:new RegExp(/¦b/,"gi"),encoding:"BIG5",utfFrequency:{low:.012484,high:.014964},isoFrequency:{low:.005063,high:.005822}},{name:"japanese",count:0,utfRegex:new RegExp(/ど/,"gi"),isoRegex:new RegExp(/‚»/,"gi"),encoding:"Shift-JIS",utfFrequency:{low:.004257,high:.006585},isoFrequency:{low:.004286,high:.004653}},{name:"korean",count:0,utfRegex:new RegExp(/도/,"gi"),isoRegex:new RegExp(/àö¾î|å¾ß|¡¼­/,"gi"),encoding:"EUC-KR",utfFrequency:{low:.01091,high:.01367},isoFrequency:{low:.004118,high:.004961}},{name:"thai",count:0,utfRegex:new RegExp(/แฮร์รี่|พอตเตอร์/,"gi"),isoRegex:new RegExp(/áîãìãõè|¾íµàµíãì­/,"gi"),encoding:"TIS-620",utfFrequency:{low:.003194,high:.003468},isoFrequency:{low:.002091,high:.002303}},{name:"bengali",count:0,utfRegex:sharedRegex.bengali,isoRegex:sharedRegex.bengali,utfFrequency:sharedFrequency.bengali,isoFrequency:sharedFrequency.bengali},{name:"hindi",count:0,utfRegex:sharedRegex.hindi,isoRegex:sharedRegex.hindi,utfFrequency:sharedFrequency.hindi,isoFrequency:sharedFrequency.hindi},{name:"urdu",count:0,utfRegex:sharedRegex.urdu,isoRegex:sharedRegex.urdu,utfFrequency:sharedFrequency.urdu,isoFrequency:sharedFrequency.urdu},{name:"vietnamese",count:0,utfRegex:sharedRegex.vietnamese,isoRegex:sharedRegex.vietnamese,utfFrequency:sharedFrequency.vietnamese,isoFrequency:sharedFrequency.vietnamese}]},{}],8:[function(require,module,exports){const checkUTF=require("./components/checkUTF.js"),processContent=require("./components/processContent.js"),checkByteOrderMark=require("./components/checkByteOrderMark.js");module.exports=file=>new Promise((resolve,reject)=>{const fileInfo={encoding:null,language:null,confidence:{encoding:null,language:null}},data={},byteOrderMarkBuffer=new FileReader;byteOrderMarkBuffer.onload=()=>{var byteOrderMark=new Uint8Array(byteOrderMarkBuffer.result).slice(0,4).join(" "),byteOrderMark=checkByteOrderMark(byteOrderMark);if(byteOrderMark){fileInfo.encoding=byteOrderMark,fileInfo.confidence.encoding=1;const byteOrderMarkReader=new FileReader;byteOrderMarkReader.onload=()=>{data.content=byteOrderMarkReader.result,resolve(processContent(data,fileInfo))},byteOrderMarkReader.onerror=err=>{reject(err)},byteOrderMarkReader.readAsText(file,fileInfo.encoding)}else{const utfReader=new FileReader;utfReader.onload=()=>{var utfContent=utfReader.result,utf8=checkUTF(utfContent);if(utf8&&(fileInfo.encoding="UTF-8",fileInfo.confidence.encoding=1),utf8)data.content=utfContent,resolve(processContent(data,fileInfo));else{const isoReader=new FileReader;isoReader.onload=()=>{data.content=isoReader.result,resolve(processContent(data,fileInfo))},isoReader.readAsText(file,"ISO-8859-1")}},utfReader.onerror=err=>{reject(err)},utfReader.readAsText(file,"UTF-8")}},byteOrderMarkBuffer.onerror=err=>{reject(err)},byteOrderMarkBuffer.readAsArrayBuffer(file)})},{"./components/checkByteOrderMark.js":1,"./components/checkUTF.js":2,"./components/processContent.js":3}]},{},[8])(8)});

const notification = (function() {
    'use strict';
    GM_addStyle(`
        #notification {
            box-sizing: border-box;
            position: fixed;
            left: calc(50% - 365.65px / 2);
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            height: 50px;
            background-color: #ff7675;
            border-radius: 50px;
            padding: 0 0px 0px 20px;
            top: -50px;
            transition: top .5s ease-out;
            z-index: 9999999999;
        }
        #notification .content {
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 25px;
        }
        #notification .closeBox {
            margin: 0 10px;
            transform: rotate(90deg);
            cursor: pointer;
        }
        #notification .closeBox .progress {
            margin: 0 10px;
            cursor: pointer;
        }
        #notification .closeBox .progress .circle {
            stroke-dasharray: 100;
            animation: progressOffset 0s linear;
        }
        @keyframes progressOffset {
            from {
                stroke-dashoffset: 100;
            }
            to {
                stroke-dashoffset: 0;
            }
        }
    `)
    return {
        open(info, timeout, autoClose=true) {
            let eles = document.querySelectorAll('#notification')
            for (let i=0;i<eles.length;i++) {
                document.body.removeChild(eles[i])
            }
            this.box = document.createElement('div')
            this.box.setAttribute('id', 'notification')
            this.box.innerHTML = `
                <div class="content"></div>
                <svg class="closeBox" width="40" height="40">
                    <g class="close" style="stroke: white; stroke-width: 2; stroke-linecap: round;">
                        <line x1="13" y1="13" x2="27" y2="27"/>
                        <line x1="13" y1="27" x2="27" y2="13"/>
                    </g>
                    <g class="progress" fill="transparent" stroke-width="3">
                        <circle class="background" cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.15)"/>
                        <circle class="circle" cx="20" cy="20" r="16" stroke="rgba(255,255,255,1)"/>
                    </g>
                </svg>
                `
            document.body.appendChild(this.box)
            this.box.querySelector('.content').innerHTML = info
            let width = getComputedStyle(this.box).width
            this.box.style.left = `clac(50%-${width}/2)`
            this.box.querySelector('.closeBox .progress .circle').style['animation-duration'] = `${timeout}s`
            this.box.style.top = '100px'
            this.box.querySelector('.closeBox .progress').addEventListener('click', () => {
                console.log('you close...')
                this.close()
                console.log('you clear...')
            })
            if (autoClose) {
                setTimeout(() => {
                    console.log('timeout close...')
                    this.close()
                    console.log('timeout clear ...')
                }, timeout * 1000)
            }
        },
        close() {
            this.box.style['transition-duration'] = '.23s'
            this.box.style['transition-timing-function'] = 'eaer-out'
            this.box.style.top = '-50px'
            setTimeout(() => {
                try {
                    document.body.removeChild(this.box)
                } catch {
                    console.log('clear')
                }
            }, 1000)
        }
    }
})();

(function() {
    'use strict'
    // create new XMLHttpRequest
    const subtitleParser = {
        ass: {
            getItems(text) { return text.match(/Dialogue:.+/g) },
            getInfo(item) {
                let [from, to, content] = /Dialogue: 0,(.+?),(.+?),.*?,.*?,.*?,.*?,.*?,.*?,([^\n]+)/.exec(item).slice(1)
                return {
                    from: toSeconds(from),
                    to: toSeconds(to),
                    content: content.replace(/{[\s\S]*?}/g, '').replaceAll('\\N', '<br/>').replaceAll('\\h', " ")
                }
            },
        },
        ssa: {
            getItems(text) { return text.match(/Dialogue:.+/g) },
            getInfo(item) {
                let [from, to, content] = /Dialogue: Marked=\d*?,(.+?),(.+?),.*?,.*?,.*?,.*?,.*?,.*?,([^\n]+)/.exec(item).slice(1)
                return {
                    from: toSeconds(from),
                    to: toSeconds(to),
                    content: content.replace(/{[\s\S]*?}/g, '').replaceAll('\\N', '<br/>')
                }
            },
        },
        srt: {
            getItems(text) { return text.split(/(\r\n|\n)\1+/) },
            getInfo(item) {
                let lineArray = item.match(/(.+)/g)
                let [from, to] = lineArray[1].split(' --> ')
                return {
                    from: toSeconds(from),
                    to: toSeconds(to),
                    content: lineArray.slice(2).join('<br/>').replaceAll(/{[\s\S]*?}/g, '')
                }
            },
        },
    }
    let subtitleType
    let toSeconds = (timeStr) => {
        let timeArr = timeStr.replace(',', '.').split(':')
        let timeSec = 0
        for (let i = 0; i < timeArr.length; i++) {
            timeSec += 60 ** (timeArr.length - i - 1) * parseFloat(timeArr[i])
        }
        return timeSec
    }
    // read
    function read(blob) {
        return new Promise(function(resolve, reject) {
            let reader = new FileReader()
            reader.onload = function(e) {
                let text = reader.result
                // 可能错误编码方式
                if (text.indexOf("�") !== -1) {
                    console.log('ERROR in UTF-8')
                    console.log(`GBK ${fileInfo.name}`)
                    return reader.readAsText(blob, 'GBK')
                }
                // 可能错误编码方式
                if (text.indexOf("") !== -1) {
                    console.log('ERROR in UTF-8')
                    console.log(`ISO-8859-1 ${fileInfo.name}`)
                    languageEncoding(blob)
                        .then(info => reader.readAsText(blob, info.encoding))
                }
                resolve(reader)
            }
            reader.onerror = reject
            reader.readAsText(blob, 'UTF-8')
        })
    }
    // parse subtitle
    async function parseTextToArray(fileInfo) {
        if (Object.keys(fileInfo).includes("text")) return
        console.log('fetch ' + fileInfo.name)
        let reader = await fetch(fileInfo.url, {headers: {Referer: 'https://www.aliyundrive.com/'}})
            .then(e => e.blob())
            .then(blob => {
                console.log(`UTF-8 ${fileInfo.name}`)
                return read(blob)
            })
        let text = reader.result 
        let itemArray = subtitleParser[subtitleType].getItems(text)
        console.log(itemArray)
        let InfoArray = []
        itemArray.forEach((item) => {
            try {
                let info = subtitleParser[subtitleType].getInfo(item)
                InfoArray.push(info)
            }
            catch {
                console.log(`[ERROR] ${item}`)
            }
        })
        return InfoArray
    }

    // add subtitle to video
    let addSubtitle = (subtitles) => {
        console.log('add subtitle...')
        window.startTime = 0
        window.endTime = 0
        const fontsize = 4.23
        // 00:00
        let percentNode = document.querySelector("[class^=modal] [class^=progress-bar] [class^=current]")
        let totalTimeNode = document.querySelector("[class^=modal] [class^=progress-bar] span:last-child")
        // create a subtitle div
        const videoStageNode = document.querySelector("[class^=video-stage]")
        subtitleNode && subtitleNode.parentNode && subtitleNode.parentNode.removeChild(subtitleNode)
        subtitleNode = document.createElement('div')
        subtitleNode.setAttribute('id', 'subtitle')
        GM_addStyle(`
            #subtitle {
                position: absolute;
                display: flex;
                flex-direction: column-reverse;
                align-items: flex-end;
                color: white;
                width: 100%;
                height: 100%;
                bottom: 4vh;
                transition: bottom .2s linear;
                z-index: 9;
            }
            #subtitle .subtitleText {
                position: absolute;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                width: 100%;
                color: white;
                bottom: 0vh;
                text-shadow: 0 0 1px var(--basic_black);
                font-size: ${fontsize}vh;
                visibility: hidden;
            }
            @keyframes subtitle {
                from {
                    visibility: visible;
                }
                to {
                    visibility: visible;
                }
            }
        `)
        videoStageNode.appendChild(subtitleNode)
        console.log('add subtitleNode')
        // 观察变化
        let video = document.querySelector('video')
        const totalSec = video.duration
        console.log(`total time is ${totalSec}s`)
        let insertSubtitle = function (mutationsList, observer) {
            // 00:00:00 => 秒
            let timeSec = video.currentTime
            // 保护时间，防止重复
            if (timeSec > window.endTime || timeSec < window.startTime) {
                // 此时用户可能在拖动进度条，反之拖动后重叠，清空subtitleNode
                subtitleNode.innerHTML = ""
            } else {
                let pTags = subtitleNode.querySelectorAll('[animationend]')
                for (let i=0;i<pTags.length;i++) {
                    subtitleNode.removeChild(pTags[i])
                }
            }
            let existIndex = (index) => {
                if (subtitleNode.childNodes.length) {
                    for (let i=0; i<subtitleNode.childNodes.length; i++) {
                        if (subtitleNode.childNodes[i].getAttribute('index') == String(index)) {
                            return true
                        }
                    }
                }
                return false
            }
            let searchIndex = function (target, arr) {
                let indexes = []
                for (let index=0;index<arr.length;index++) {
                    let e = arr[index]
                    if (target >= e.from && target <= e.to) {
                        if (!existIndex(index)) {
                            indexes.push(index)
                        }
                    }
                }
                return indexes
            }
            searchIndex(timeSec, subtitles).forEach((index) => {
                let oneSubtitle = subtitles[index]
                let subtitleText = document.createElement('p')
                subtitleText.setAttribute('class', 'subtitleText')
                subtitleText.setAttribute('index', String(index))
                subtitleText.innerHTML = oneSubtitle.content
                let duration = oneSubtitle.to - oneSubtitle.from - (timeSec - oneSubtitle.from)
                subtitleText.addEventListener('animationend', function() {
                    subtitleText.setAttribute('animationend', '')
                })
                // 合适位置插入
                if (subtitleNode.childNodes.length) {
                    // debugger
                    let bottom = '0px'
                    let i = 0
                    while (true) {
                        if (subtitleNode.childNodes[i]) {
                            if (parseFloat(bottom.replace('px', '')) < parseFloat(subtitleNode.childNodes[i].style.bottom.replace('px', ''))) {
                                subtitleText.style.bottom = bottom
                                subtitleNode.insertBefore(subtitleText, subtitleNode.childNodes[i])
                                break
                            } else {
                                bottom = parseFloat(bottom.replace('px', '')) + parseFloat(getComputedStyle(subtitleNode.childNodes[i]).height.replace('px', '')) + 'px'
                                i ++
                                continue
                            }
                        } else {
                            // px -> vh 相对高度，调整窗口自适应
                            subtitleText.style.bottom = parseFloat(bottom.replace('px', '')) / parseFloat(window.innerHeight) * 100 + 'vh'
                            subtitleNode.appendChild(subtitleText)
                            break
                        }
                    }
                } else {
                    subtitleNode.appendChild(subtitleText)
                }
    
                subtitleText.style.animation = `subtitle ${duration}s linear`
                // 记录结束时间
                window.startTime = oneSubtitle.from
                window.endTime = oneSubtitle.to
                return true
            })
        }
        var config = { attributes: true, childList: true, subtree: true }
        var observer = new MutationObserver(insertSubtitle)
        observer.observe(percentNode, config)
        // 暂停播放事件
        let playBtnEvent = () => {
            subtitleNode.innerHTML = ""
            while (true) {
                if (!insertSubtitle(null, null)) {
                    break
                }
            }
            subtitleNode.childNodes.forEach((p) => {
                p.style.visibility = 'visible'
            })
        }
        window.addEventListener('keydown', () => {
            if (window.event.which == 32 | window.event.which == 39 | window.event.which == 37) {
                playBtnEvent()
            }
        })
        document.querySelector('[class^=video-player]').addEventListener('click', () => {
            playBtnEvent()
        }, false)
        return observer
    }
    // observer root
    const rootNode = document.querySelector('#root')
    // no root, exist
    if (!rootNode) { return }
    let obsArray = [], subtitleNode
    const callback = function (mutationList, observer) {
        // add subtitle
        subtitleNode = document.querySelector('#subtitle')
        if (subtitleNode) {subtitleNode.parentNode.removeChild(subtitleNode)}
        let Node = mutationList[0].addedNodes[0]
        if (!Node || !Node.getAttribute('class').includes('modal')) { return }
        // clear observer
        obsArray.forEach(obs => {
            console.log(obs)
            console.log('disconnect')
            obs.disconnect()
        })
        obsArray = []
        console.log('add a video modal')

        /////////////////////
        // 获取文件夹内文件
        let fileInfoList = null
        let params = JSON.parse(window.localStorage.token)
        let drive_id = params.default_drive_id
        let access_token = params.access_token
        let parent_file_id = window.location.pathname.split("/").slice(-1)[0]
        console.log(drive_id, access_token, parent_file_id)
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.aliyundrive.com/adrive/v3/file/list?jsonmask=next_marker,items(name,file_id,drive_id,url,file_extension)",
            data: JSON.stringify({
                drive_id: drive_id,
                parent_file_id: parent_file_id
            }),
            headers: {
                "authorization": `Bearer ${access_token}`,
            },
            responseType: "json",
            onload: function(res) {
                console.log(res.response)
                fileInfoList = res.response["items"]
            }
        })
        let id = setInterval(
            async function() {
                let modal = Node
                // find title name
                if (modal.querySelectorAll('[class^=filename] span').length == 0 || fileInfoList == null) return
                // 检查text是否加载完毕
                clearInterval(id)
                let filename = modal.querySelector('[class^=filename] span').innerText
                let title = filename.split('.').slice(0, -1).join('.')
                console.log(title)
                console.log(fileInfoList)
                // search the corresponding ass url
                let isInclude = (c1, c2) => {
                    return c1.match(new RegExp((c2.split('.').slice(0, -1).join('.') || c2).replace('(', '\\(').replace(')', '\\)'), 'i'))
                }
                // 先过滤出适配的字幕格式文件
                fileInfoList = fileInfoList.filter((fileInfo) => {
                    if (Object.keys(subtitleParser).includes(fileInfo.name.split('.').slice(-1)[0])) {
                        return true
                    }
                })
                let fileInfo = fileInfoList.filter((fileInfo) => {
                    if (!fileInfo.name.includes('.')) return false
                    if (fileInfo.name == filename) return false
                    // 你中有我，或我中有你
                    let flag = isInclude(fileInfo.name, title) || isInclude(title, fileInfo.name)
                    // S01E01样式匹配
                    const reg = /s\d+e\d+/i
                    let subtitleMatch = fileInfo.name.match(reg)
                    let videoMatch = title.match(reg)
                    if (!flag) {
                        flag =  subtitleMatch && videoMatch && subtitleMatch[0].toUpperCase() == videoMatch[0].toUpperCase()
                    }
                    // 单音频单字幕文件直接匹配，因为没得选
                    if (fileInfoList.length == 1) {
                        flag = true
                    }
                    return flag
                })
                console.log(fileInfo)
                // no file, exit
                if (!fileInfo.length) {console.log('subtitle exit...'); return}
                fileInfo = fileInfo[0]
                console.log(fileInfo)
                subtitleType = fileInfo.name.split('.').slice(-1)
                console.log(`[subtitleType] ${subtitleType}`)
                let subtitles = await parseTextToArray(fileInfo)
                obsArray.push(addSubtitle(subtitles))
                console.log(`${subtitles.length}条字幕添加成功`)
                notification.open(`${subtitles.length}条字幕添加成功`, 3)
                // 是否变更视频
                let obs = new MutationObserver((mutationList, obs) => {
                    let filenameNode = modal.querySelector('[class^=header] [class^=text]')
                    if (filenameNode && filenameNode.innerText !== filename) {
                        setTimeout(() => {
                            callback([{addedNodes: [modal]}], null)
                        }, 0)
                    }
                })
                obs.observe(modal, {subtree: true, childList: true})
                obsArray.push(obs)
                // 是否触发控制条
                let playerTool = document.querySelector('[class^=video-player]')
                let offsetSubtitle = (mutationList, obs) => {
                    // let subtitleNode = document.querySelector('#subtitle')
                    if (subtitleNode && mutationList[0].attributeName == 'class') {
                        if (mutationList[0].target.classList.length == 2 && document.fullscreenElement) {
                            subtitleNode.style['bottom'] = '13vh'
                        } else {
                            subtitleNode.style['bottom'] = '4vh'
                        }
                    }
                }
                obs = new MutationObserver(offsetSubtitle)
                obs.observe(playerTool, {attributes: true, childList: true})
                offsetSubtitle([{attributeName: 'class', target: playerTool}])
                obsArray.push(obs)
                document.onfullscreenchange = () => {
                    offsetSubtitle([{attributeName: 'class', target: playerTool}], obs)
                }
            }, 10)
    }
    const observer = new MutationObserver(callback)
    observer.observe(rootNode, {childList: true})
})();