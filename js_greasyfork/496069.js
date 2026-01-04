// ==UserScript==
// @name         LACXUEXITONG
// @namespace    http://tampermonkey.net/
// @version      2.1.0
// @description  一个由大学生开发的脚本
// @author       LAC
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @match        *://*.chaoxing.com/*
// @icon         http://pan-yz.chaoxing.com/favicon.ico
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_info
// @connect      mooc1-1.chaoxing.com
// @connect      mooc1.chaoxing.com
// @connect      mooc1-2.chaoxing.com
// @connect      stat2-ans.chaoxing.com
// @connect      14.29.190.187
// @connect      cx.icodef.com
// @connect      www.lanzouw.com
// @connect      develope-oss.lanzouc.com
// @license      GPL-3.0-or-later
// @require      https://cdnjs.cloudflare.com/ajax/libs/opentype.js/0.8.0/opentype.min.js
// @downloadURL https://update.greasyfork.org/scripts/496069/LACXUEXITONG.user.js
// @updateURL https://update.greasyfork.org/scripts/496069/LACXUEXITONG.meta.js
// ==/UserScript==


const _w = unsafeWindow,
    _d = _w.document,
    _l = _w.location,
    _t = _d.title,
    _u = _l.href

const searchParams = new URLSearchParams(new URL(_u).search);
const courseid = searchParams.get('courseid');
const clazzid = searchParams.get('clazzid');
const cpi = searchParams.get('cpi');
console.log(courseid, clazzid, cpi)
const c_t = searchParams.get('_t')
// 定义一个函数 toOld，用于跳转到指定的学习页面

const answerOption_table = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7, I: 8, J: 9, K: 10 }
getTime = () => {
    const currentDate = new Date(); // 创建一个表示当前日期和时间的 Date 对象
    const year = currentDate.getFullYear(); // 获取年份
    const month = currentDate.getMonth() + 1; // 月份从 0 开始，需要加1
    const day = currentDate.getDate(); // 获取日期
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const formattedTime = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
    return year + '-' + month + '-' + day + ' ' + formattedTime
}
function processTxt(txt) {
    // 去除所有种类的空白字符（包括空格、换行、制表符等）
    txt = txt.replace(/\s+/g, '');

    // 去除常见的非标准空格字符
    const nonStandardSpaces = ['\xa0', String.fromCharCode(160)];
    nonStandardSpaces.forEach(space => {
        txt = txt.replace(new RegExp(space, 'g'), '');
    });

    return txt;
}
const get_timu_tt = (TiMu) => {
    const TiMu_type = (() => {
        const type_txt = TiMu.querySelector('span.newZy_TItle').outerText
        return type_txt.substring(type_txt.indexOf("【") + 1, type_txt.indexOf("】"))
    })()
    const TiMu_question = (() => {
        const originalDiv = TiMu.querySelector('.clearfix.font-cxsecret.fontLabel');
        const clonedDiv = originalDiv.cloneNode(true);
        const spans = clonedDiv.querySelectorAll('span.newZy_TItle');
        spans.forEach(span => span.remove());
        const remainingText = clonedDiv.textContent.trim();
        if (_t === '做作业') {
            return translate(processTxt(remainingText))
        } else {
            return processTxt(remainingText)
        }
    })()
    return { type: TiMu_type, question: TiMu_question }
}
const getAnswer = (timu, timuType) => {
    function getKAnswer(timu) {
        const correctAnswers = Array.from(timu.querySelectorAll('div.correctAnswer.marTop16'))
        let sTxt = /.*第[一二三四五六七八九十]空：.*?\n\n/;
        let ssTxt = /\n.*第[一二三四五六七八九十]空：\s*/
        let sT = /\n\n/;
        return correctAnswers.map(correctAnswer => {
            let answer = correctAnswer.outerText;
            if (answer.match(ssTxt)) {
                answer = answer.replace(ssTxt, '')
            } else {
                answer = answer.replace(sTxt, '');
            }
            answer = answer.replace(sT, '\n');
            answer = answer.replace(/\n+\s*$/, '')
            return answer
        })
    }


    function getMAnswer(timu) {
        return [timu.querySelector('div.myAnswer.marTop16').outerText.trimLeft()]
    }

    // 选择题,判断题
    function getXAnswer(timu) {

        function getAnswerTxt(answer) {
            if (answer === '对' || answer === '错') {
                return answer;
            }
            const index = answerOption_table[answer];
            answer = answerTxts[index].outerText;
            answer = answer.slice(2);
            answer = processTxt(answer);
            return answer;
        }
        const answerAbcd = Array.from(processTxt(timu.querySelector('div.fl.answerCon').outerText))
        const answerTxts = timu.querySelectorAll('li.clearfix')
        return answerAbcd.map(answer => getAnswerTxt(answer))
    }


    if (['单选题', '多选题', '判断题'].includes(timuType)) {
        answerTxt = getXAnswer(timu)
    } else if (['填空题', '资料题'].includes(timuType)) {
        answerTxt = getKAnswer(timu)
    } else if (['其它', '论述题', '简答题'].includes(timuType)) {
        answerTxt = [timu.querySelector('div.correctAnswer.marTop6').outerText.trim()]
    } else if (['名词解释'].includes(timuType)) {
        answerTxt = getMAnswer(timu)
    }
    return answerTxt;
}
const PageData = async (document_xml) => {
    let getStr = (str, start, end) => {
        let res = str.substring(str.indexOf(start), str.indexOf(end)).replace(start, '');
        return res;
    },
        scripts = document_xml.getElementsByTagName('script'),
        param = null;
    for (let i = 0, l = scripts.length; i < l; i++) {
        if (scripts[i].innerHTML.indexOf('mArg = "";') != -1 && scripts[i].innerHTML.indexOf(
            '==UserScript==') == -1) {
            param = getStr(scripts[i].innerHTML, 'try{\n    mArg = ', ';\n}catch(e){');
        }
    }
    try { JSON.parse(param) } catch (e) { return [] }
    return await JSON.parse(param)
}
//获取文件信息
async function get_file_info(url) {
    let data
    const dat = await getData(url, 'xml')
    url = dat.getElementsByTagName('iframe')[0].src
    const name = dat.getElementsByTagName('iframe')[0].name
    function removeDomain(url) {
        // 创建一个新的URL对象
        const urlObj = new URL(url);
        // 返回路径和查询字符串
        return urlObj.pathname + urlObj.search;
    }
    const result = 'https://www.lanzouw.com/' + removeDomain(url);
    const bb = await getData(result, 'xml')
    const aa = bb.getElementsByTagName('script')[1].innerHTML
    const extractedVariables = ((jsString) => {
        const varRegex = /var\s+(\w+)\s*=\s*'([^']*)'/g; // 正则表达式匹配var声明
        let match;
        const variables = [];

        while ((match = varRegex.exec(jsString)) !== null) {
            variables.push(match[2]);
        }

        return variables;
    })(aa);
    const aihidcms = extractedVariables[1];
    const ciucjdsdc = extractedVariables[2];
    const ajaxdata = extractedVariables[5];
    const signValue = ((dataString) => {
        // 使用正则表达式匹配 'sign':
        const signRegex = /'sign':'([^']+)'/;
        const match = signRegex.exec(dataString);

        if (match && match[1]) {
            return match[1]; // 返回匹配到的值
        } else {
            return null; // 如果没有找到匹配，返回null
        }
    })(aa);
    data = await (async () => {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `https://www.lanzouw.com/ajaxm.php?file=${name}`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Referer": result
                },
                data: encodeURI('action=downprocess&signs=' + ajaxdata + `&sign=${signValue}=` + ciucjdsdc + '&websignkey=' + aihidcms + '&ves=1'),
                onload: function (response) {
                    resolve(JSON.parse(response.responseText))
                },
                onerror: function () {
                    console.log('error')
                }
            });
        });
    })()
    url = `${data.dom}/file/${data.url}`
    data = await getData(url, 'json')
    return data
}

async function getData(fileUrl, dataType = 'json', headers = {}) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: fileUrl,
            headers: headers,
            onload: function (response) {
                try {
                    if (dataType === 'json') {
                        const json = JSON.parse(response.responseText);
                        resolve(json);
                    }
                    if (dataType === 'text') {
                        resolve(response.responseText);
                    }
                    if (dataType === 'xml') {
                        resolve(response.responseXML);
                    }
                    if (dataType === 'other') {
                        resolve(response)
                    }
                } catch (e) {
                    console.error(response)
                    console.error('Failed to parse JSON:', e);
                    reject(e);
                }
            },
            onerror: function (error) {
                console.error('Failed to fetch:', error);
                reject(error);
            }
        });
    });
}
const urlType = await(async () => {
    //课程页面
    if (document.querySelector('li[opentype][dataname][pageheader]')) {
        top.activeAnswer = []
        let LacAnsweList = JSON.parse(GM_getValue('LacAnsweList', '[]'))
        let LacAllAnswer = JSON.parse(GM_getValue('LacAllAnswer', '{}'))
        console.log(LacAnsweList, LacAllAnswer)
        async function getEnc(enj_type) {
            let url,
                enc = new RegExp(`var ${enj_type}\\s*=\\s*['"]([a-z0-9]+)['"]`)
            if (enj_type == 'jobEnc') {
                url = `https://stat2-ans.chaoxing.com/study-data/index?courseid=${courseid}&clazzid=${clazzid}&cpi=${cpi}&ut=s&t=${c_t}`
            } else if (enj_type == 'enc') {
                url = `https://mooc2-ans.chaoxing.com/mooc2-ans/mycourse/studentcourse?courseid=${courseid}&clazzid=${clazzid}&cpi=${cpi}&ut=s&t=${c_t}`
            } else if (enj_type == 'openc') {
                url = `https://stat2-ans.chaoxing.com/stat2/chapter-exam/s/index?courseid=${courseid}&cpi=${cpi}&clazzid=${clazzid}&ut=s&`
                return (await getData(url, 'xml')).querySelector('input#openc').value
            }
            const data = await getData(url, 'xml')
            const scripts = data.getElementsByTagName('script')
            let match
            for (let i = 0, l = scripts.length; i < l; i++) {
                match = scripts[i].innerHTML.match(enc);
                if (match) {
                    return match[1]
                }
            }
        }
        const jobEnc = await getEnc('jobEnc');
        const enc = await getEnc('enc');
        const openc = await getEnc('openc');
        const content = ((title = '', contentWidth = 100, contentHeight = 100) => {
            const floatingContainer = document.createElement('div');
            floatingContainer.id = 'floatingContainer';
            document.body.appendChild(floatingContainer);
            floatingContainer.innerHTML = `
        <div id="resize">
            <div id='dragTop'></div>
        <div id='dragLeft'></div>
        </div>
        <div id="dragDiv" class='min'>
        <div id = 'headerElement' class='min'>
            <div id  = 'shapeBtn'>
                <svg xmlns="http://www.w3.org/2000/svg" id = 'minBtn' class='active' display="none"  height="35" viewBox="0 0 24 24" width="35"><path d="M0 0h24v24H0V0z" fill="none" ></path><path d="M18 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H6V6h12v12z"></path></svg>
                <svg xmlns="http://www.w3.org/2000/svg" id = 'maxBtn' display="none" height="35" " viewBox="0 0 24 24" width="35"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M19 13H5v-2h14v2z"></path></svg>
        
            </div>
        </div>
            <div id= 'content' class='min'>
                <div id='changeDivunfinishdivs' class='changediv'>点击跳转</div>
                <div id='changesettingAnswesDiv' class='changediv'>设置答案</div>
                <div id='changegetanswerDiv' class='changediv'>获取答案</div>
                <div id='unfinishdivs'></div>
                <div id ='settingAnswesDiv' style='display:none;'></div>
                <div id='getanswerDiv' style='display:none;position:relative'>
                    <button id='getanswerBtn' class="button" style="--clr: #00ad54;">
            <span class="button-decor"></span>
            <div class="button-content">
                <div class="button__icon">
                    <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" width="24">
                        <circle opacity="0.5" cx="25" cy="25" r="23" fill="url(#icon-payments-cat_svg__paint0_linear_1141_21101)"></circle>
                        <mask id="icon-payments-cat_svg__a" fill="#fff">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M34.42 15.93c.382-1.145-.706-2.234-1.851-1.852l-18.568 6.189c-1.186.395-1.362 2-.29 2.644l5.12 3.072a1.464 1.464 0 001.733-.167l5.394-4.854a1.464 1.464 0 011.958 2.177l-5.154 4.638a1.464 1.464 0 00-.276 1.841l3.101 5.17c.644 1.072 2.25.896 2.645-.29L34.42 15.93z">
                            </path>
                        </mask>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M34.42 15.93c.382-1.145-.706-2.234-1.851-1.852l-18.568 6.189c-1.186.395-1.362 2-.29 2.644l5.12 3.072a1.464 1.464 0 001.733-.167l5.394-4.854a1.464 1.464 0 011.958 2.177l-5.154 4.638a1.464 1.464 0 00-.276 1.841l3.101 5.17c.644 1.072 2.25.896 2.645-.29L34.42 15.93z" fill="#fff"></path>
                        <path d="M25.958 20.962l-1.47-1.632 1.47 1.632zm2.067.109l-1.632 1.469 1.632-1.469zm-.109 2.068l-1.469-1.633 1.47 1.633zm-5.154 4.638l-1.469-1.632 1.469 1.632zm-.276 1.841l-1.883 1.13 1.883-1.13zM34.42 15.93l-2.084-.695 2.084.695zm-19.725 6.42l18.568-6.189-1.39-4.167-18.567 6.19 1.389 4.166zm5.265 1.75l-5.12-3.072-2.26 3.766 5.12 3.072 2.26-3.766zm2.072 3.348l5.394-4.854-2.938-3.264-5.394 4.854 2.938 3.264zm5.394-4.854a.732.732 0 01-1.034-.054l3.265-2.938a3.66 3.66 0 00-5.17-.272l2.939 3.265zm-1.034-.054a.732.732 0 01.054-1.034l2.938 3.265a3.66 3.66 0 00.273-5.169l-3.265 2.938zm.054-1.034l-5.154 4.639 2.938 3.264 5.154-4.638-2.938-3.265zm1.023 12.152l-3.101-5.17-3.766 2.26 3.101 5.17 3.766-2.26zm4.867-18.423l-6.189 18.568 4.167 1.389 6.19-18.568-4.168-1.389zm-8.633 20.682c1.61 2.682 5.622 2.241 6.611-.725l-4.167-1.39a.732.732 0 011.322-.144l-3.766 2.26zm-6.003-8.05a3.66 3.66 0 004.332-.419l-2.938-3.264a.732.732 0 01.866-.084l-2.26 3.766zm3.592-1.722a3.66 3.66 0 00-.69 4.603l3.766-2.26c.18.301.122.687-.138.921l-2.938-3.264zm11.97-9.984a.732.732 0 01-.925-.926l4.166 1.389c.954-2.861-1.768-5.583-4.63-4.63l1.39 4.167zm-19.956 2.022c-2.967.99-3.407 5.003-.726 6.611l2.26-3.766a.732.732 0 01-.145 1.322l-1.39-4.167z" fill="#fff" mask="url(#icon-payments-cat_svg__a)"></path>
                        <defs>
                            <linearGradient id="icon-payments-cat_svg__paint0_linear_1141_21101" x1="25" y1="2" x2="25" y2="48" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#fff" stop-opacity="0.71"></stop>
                                <stop offset="1" stop-color="#fff" stop-opacity="0"></stop>
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <span class="button__text">开始获取答案</span>
            </div>
            <style>
            #getanswerBtn {
          text-decoration: none;
          line-height: 1;
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 10px 10px 20px rgba(0,0,0,.05);
          background-color: #fff;
          color: #121212;
          border: none;
          cursor: pointer;
          position: absolute;
            top: 20px;
            right: 149px;
        }
        
        .button-decor {
          position: absolute;
          inset: 0;
          background-color: var(--clr);
          transform: translateX(-100%);
          transition: transform .3s;
          z-index: 0;
        }
        
        .button-content {
          display: flex;
          align-items: center;
          font-weight: 600;
          position: relative;
          overflow: hidden;
        }
        
        .button__icon {
          width: 48px;
          height: 40px;
          background-color: var(--clr);
          display: grid;
          place-items: center;
        }
        
        .button__text {
          display: inline-block;
          transition: color .2s;
          padding: 2px 1.5rem 2px;
          padding-left: .75rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          max-width: 150px;
        }
        
        .button:hover .button__text {
          color: #fff;
        }
        
        .button:hover .button-decor {
          transform: translate(0);
        }</style>
        </button>
                </div>
            </div>
        <div id='dragBotton'></div>
        
        
        <style>
        .changediv{
        width: 50px;
        height: 25px;
        border: 1px solid #409eff;
        border-radius: 5px;
        }
        .changediv:hover{
            background-color: #409eff;
            color: white;
        }
        #changeDivunfinishdivs{
            margin-left: 10px;
        }
        #changesettingAnswesDiv{
            position: absolute;
            top: 0px;
            left: 70px;
        }
        #changegetanswerDiv{position: absolute;
            top: 1px;
            left: 130px;}
        #unfinishdiv{
            position: relative;
            width: 100%;
            height: 20px;
            margin: 10px;
        }
        #unfinshdivkid{
            position: absolute;
            top: 0;
            right: 20px;
            border: 1px solid #409eff;
            border-radius: 5px;
        }
        #unfinshdivkid:hover{
            background-color: #409eff;;
            color: white;
        }
        #unfinishp{
            top: 0;
            left: 5px;
            position: absolute;
            margin: 0;
        }
        #content {
            width: 100%;
            min-height: 100px;
            top: 40px;
            position: absolute;
            background-color: white;
            box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.5);
            border-radius: 0 0 15px 15px;
        }
        #content.min {
           display: none;
        }
        #floatingContainer {
            position: absolute;
            width: 0;
            height: 0;
            top: 0;
            left: 0;
        }
        
        #minBtn.active {
            display: block;
        }
        #maxBtn.active {
            display: block;
        }
        #headerElement {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 40px;
            background-color: white;
        }
        
        #headerElement.min{
            content: '';
            border-radius: 10px;
            box-shadow: 1px 2px 9px 8px rgb(0 0 0 / 26%);
        }
        
        #headerElement.max{
            border-radius: 10px 10px 0 0;
            box-shadow: 13px -7px 19px 0px rgb(0 0 0 / 26%);
        }
        #headerElement.max::after {
            content: '${title}';
            position: absolute;
            color: #3a8bff;
            font-size: 17px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        #resize {
            content: '';
            width: 100px;
            height: 100px;
            background-color: transparent;
            resize: both;
            overflow: hidden;
            position: relative;
            z-index: -1;
        }
        
        #resize::-webkit-resizer {
            background-color: transparent;
        }
        #dragBotton {
            width: 27px;
            position: absolute;
            border-radius: 50%;
            height: 27px;
            background-color: red;
            top: 8px;
            left: 10px;
            z-index: 11;
        }
        
        #dragDiv {
            box-sizing: border-box;
            padding-top: 30px;
        
            height: 0px;
            z-index: 10;
            position: absolute;
            border-radius: 15px;
            user-select: none;
        }
        #dragDiv.max {
            min-width:300px;
            width: ${contentWidth}px;
        }
        #dragDiv.min {
            width: 100px;
        }
        
        #dragTop,
        #dragLeft {
            width: 54px;
            height: 27px;
            position: absolute;
            z-index: 101;
            background-color: transparent;
        }
        
        #dragTop {
           bottom:27px;
           right:0px
        }
        
        #dragLeft {
           bottom:0px;
           right:27px
        }
        
        #shapeBtn {
            position: absolute;
            top: 5px;
            right: 6px;
            display: inline-block;
        }
        </style>
        `;
            const resize = document.getElementById('resize');
            const dragBotton = document.getElementById('dragBotton');
            const dragTop = document.getElementById('dragTop');
            const dragLeft = document.getElementById('dragLeft');
            const shapeBtn = document.getElementById('shapeBtn');
            const dragDiv = document.getElementById('dragDiv');
            const headerElement = document.getElementById('headerElement');
            const minBtn = document.getElementById('minBtn');
            const maxBtn = document.getElementById('maxBtn');
            const content = document.getElementById('content');
            resize.style.maxWidth = `${window.innerWidth - contentWidth + 37}px`;
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    dragDiv.style.left = `${entry.contentRect.width - 37}px`;
                    dragDiv.style.top = `${entry.contentRect.height - 35}px`;;
                }
            });
            resizeObserver.observe(resize);
            const mouseleave = () => {
                console.log('mouseleave');
                resize.style.zIndex = -1;
            }
            dragBotton.addEventListener('mouseenter', () => {
                if (content.classList.contains('min')) {
                    resize.style.maxHeight = `${window.innerHeight - 5}px`;
                    resize.style.maxWidth = `${window.innerWidth - 63}px`;
                } else {
                    resize.style.maxHeight = `${window.innerHeight - contentHeight + 35}px`;
                    resize.style.maxWidth = `${window.innerWidth - contentWidth + 37}px`;
                }
                resize.style.zIndex = 11;
                dragTop.addEventListener('mouseenter', mouseleave, { once: true });
                dragLeft.addEventListener('mouseenter', mouseleave, { once: true });
                resize.addEventListener('mouseleave', mouseleave, { once: true });
            })


            shapeBtn.addEventListener('click', () => {
                headerElement.classList.toggle('min');
                headerElement.classList.toggle('max');
                content.classList.toggle('min');
                content.classList.toggle('max');
                minBtn.classList.toggle('active');
                maxBtn.classList.toggle('active');
                dragDiv.classList.toggle('min');
                dragDiv.classList.toggle('max');
            })

            const changeDivunfinishdivs = content.querySelector('#changeDivunfinishdivs');
            const changesettingAnswesDiv = content.querySelector('#changesettingAnswesDiv');
            const settingAnswesDiv = content.querySelector('#settingAnswesDiv');
            const unfinishdivs = content.querySelector('#unfinishdivs');
            const changegetanswerDiv = content.querySelector('#changegetanswerDiv');
            const getanswerDiv = content.querySelector('#getanswerDiv');
            changeDivunfinishdivs.addEventListener('click', () => {
                unfinishdivs.style.display = 'block';
                settingAnswesDiv.style.display = 'none';
                getanswerDiv.style.display = 'none';
            })
            changesettingAnswesDiv.addEventListener('click', () => {
                unfinishdivs.style.display = 'none';
                settingAnswesDiv.style.display = 'block';
                getanswerDiv.style.display = 'none';
            })
            changegetanswerDiv.addEventListener('click', () => {
                unfinishdivs.style.display = 'none';
                settingAnswesDiv.style.display = 'none';
                getanswerDiv.style.display = 'block';
            })

            return content;
        })(title = 'LAC', contentWidth = 450)

        const settingAnswesDiv = content.querySelector('#settingAnswesDiv');
        settingAnswesDiv.innerHTML = `
                <style>
                .answerDiv{
                position: relative;
                height: 35px;
                margin: 10px;
                border: 1px solid #409eff;
                border-radius: 5px;
                font-size: 10px;
                padding: 0px;
                padding-left: 5px;
                color: red;
                }
                .answerDiv:hover{
                background-color: #72bbff;
                }
                .answerDiv.active{
                color: green;
                }
                p{
                margin: 0
                }
                .container input {
                        position: absolute;
                        opacity: 0;
                        cursor: pointer;
                        height: 0;
                        width: 0;
                    }

                    .container {
                        position: absolute;
                        top: 2px;
                        right: 40px;
                        display: block;
                        cursor: pointer;
                        font-size: 20px;
                        user-select: none;
                        z-index: 100;
                    }

                    /* Create a custom checkbox */
                    .checkmark {
                        position: relative;
                        top: 0;
                        left: 0;
                        height: 30px;
                        width: 30px;
                        background-color: red;
                        border-radius: 50%;
                        transition: .4s;
                    }

                    .checkmark:hover {
                        box-shadow: inset 17px 17px 16px #b3b3b3,
                            inset -17px -17px 16px #ffffff;
                    }

                    /* When the checkbox is checked, add a blue background */
                    .container input:checked~.checkmark {
                        box-shadow: none;
                        background-color: limegreen;
                        transform: rotateX(360deg);
                    }

                    .container input:checked~.checkmark:hover {
                        box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2);
                    }

                    /* Create the checkmark/indicator (hidden when not checked) */
                    .checkmark:after {
                        content: "";
                        position: absolute;
                        display: none;
                    }

                    /* Show the checkmark when checked */
                    .container input:checked~.checkmark:after {
                        display: block;
                    }

                    /* Style the checkmark/indicator */
                    .container .checkmark:after {
                        left: 11px;
                        top: 7px;
                        width: 0.25em;
                        height: 0.5em;
                        border: solid white;
                        border-width: 0 0.15em 0.15em 0;
                        box-shadow: 0.1em 0.1em 0em 0 rgba(0, 0, 0, 0.3);
                        transform: rotate(45deg);
                    }
                    .bin-button {
                    top: 1px;
                    right: 2px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background-color: rgb(255, 95, 95);
                    cursor: pointer;
                    border: 2px solid rgb(255, 201, 201);
                    transition-duration: 0.3s;
                    position: absolute;
                    overflow: hidden;
                }

                .bin-bottom {
                    width: 13px;
                    z-index: 2;
                }

                .bin-top {
                    width: 14px;
                    transform-origin: right;
                    transition-duration: 0.3s;
                    z-index: 2;
                }

                .bin-button:hover .bin-top {
                    transform: rotate(45deg);
                }

                .bin-button:hover {
                    background-color: rgb(255, 0, 0);
                }

                .bin-button:active {
                    transform: scale(0.9);
                }

                .garbage {
                    position: absolute;
                    width: 10px;
                    height: auto;
                    z-index: 1;
                    opacity: 0;
                    transition: all 0.3s;
                }

                .bin-button:hover .garbage {
                    animation: throw 0.4s linear;
                }

                @keyframes throw {
                    from {
                        transform: translate(-400%, -700%);
                        opacity: 0;
                    }

                    to {
                        transform: translate(0%, 0%);
                        opacity: 1;
                    }
                }
                </style>
                `
        async function downloadJSON(courseId) {
            // 将JSON对象转换为字符串
            console.log(courseId)
            const data = LacAllAnswer[courseId]
            const filename = `${courseId}.json`;
            const jsonString = JSON.stringify(data);
            // 创建文件Blob
            const blob = new Blob([jsonString], { type: 'application/json' });
            // 创建用于下载的虚拟a标签
            const a = document.createElement('a');
            // 创建下载URL
            a.href = URL.createObjectURL(blob);

            // 设置下载文件名
            a.download = filename;

            // 模拟点击以触发下载
            document.body.appendChild(a);
            a.click();
            // 移除a元素
            document.body.removeChild(a);
        }
        const createAnswerDiv = (answer_array) => {
            const courseId = answer_array.courseId
            const courseName = answer_array.courseName
            const time = answer_array.time
            const active = answer_array.active
            const answerDiv = document.createElement('div');
            answerDiv.classList.add('answerDiv')
            answerDiv.innerHTML = `
                    <p>课程名称：${courseName}</p>
                    <p>时间：${time}</p>
                    <label class="container">
                <input type="checkbox" checked="checked">
                <div class="checkmark"></div>
            </label>
            <button class="bin-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 39 7" class="bin-top">
                <line stroke-width="4" stroke="white" y2="5" x2="39" y1="5"></line>
                <line stroke-width="3" stroke="white" y2="1.5" x2="26.0357" y1="1.5" x1="12"></line>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 33 39" class="bin-bottom">
                <mask fill="white" id="path-1-inside-1_8_19">
                    <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
                </mask>
                <path mask="url(#path-1-inside-1_8_19)" fill="white"
                    d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z">
                </path>
                <path stroke-width="4" stroke="white" d="M12 6L12 29"></path>
                <path stroke-width="4" stroke="white" d="M21 6V29"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 89 80" class="garbage">
                <path fill="white"
                    d="M20.5 10.5L37.5 15.5L42.5 11.5L51.5 12.5L68.75 0L72 11.5L79.5 12.5H88.5L87 22L68.75 31.5L75.5066 25L86 26L87 35.5L77.5 48L70.5 49.5L80 50L77.5 71.5L63.5 58.5L53.5 68.5L65.5 70.5L45.5 73L35.5 79.5L28 67L16 63L12 51.5L0 48L16 25L22.5 17L20.5 10.5Z">
                </path>
            </svg>
        </button>
            <button class="downloadJSONBtn")">
                <svg class="svgIcon" viewBox="0 0 384 512" height="1em" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z">
                    </path>
                </svg>
                <span class="icon2"></span>
                <span class="tooltip">Download</span>
            </button>
            <style>
                .downloadJSONBtn {
                z-index: 100;
                    right: -317px;
                    top: -30px;
                    width: 30px;
                    height: 30px;
                    border: none;
                    border-radius: 50%;
                    background-color: rgb(27, 27, 27);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    position: relative;
                    transition-duration: .3s;
                    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.11);
                }
        
                .svgIcon {
                    fill: rgb(214, 178, 255);
                }
        
                .icon2 {
                    width: 18px;
                    height: 5px;
                    border-bottom: 2px solid rgb(182, 143, 255);
                    border-left: 2px solid rgb(182, 143, 255);
                    border-right: 2px solid rgb(182, 143, 255);
                }
        
                .tooltip {
                    position: absolute;
                    right: -105px;
                    opacity: 0;
                    background-color: rgb(12, 12, 12);
                    color: white;
                    padding: 5px 10px;
                    border-radius: 5px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition-duration: .2s;
                    pointer-events: none;
                    letter-spacing: 0.5px;
                }
        
                .tooltip::before {
                z-index: 101;
                    position: absolute;
                    content: "";
                    width: 10px;
                    height: 10px;
                    background-color: rgb(12, 12, 12);
                    background-size: 1000%;
                    background-position: center;
                    transform: rotate(45deg);
                    left: -5%;
                    transition-duration: .3s;
                }
        
                .downloadJSONBtn:hover .tooltip {
                    opacity: 1;
                    transition-duration: .3s;
                }
        
                .downloadJSONBtn:hover {
                    background-color: rgb(150, 94, 255);
                    transition-duration: .3s;
                }
        
                .downloadJSONBtn:hover .icon2 {
                    border-bottom: 2px solid rgb(235, 235, 235);
                    border-left: 2px solid rgb(235, 235, 235);
                    border-right: 2px solid rgb(235, 235, 235);
                }
        
                .downloadJSONBtn:hover .svgIcon {
                    fill: rgb(255, 255, 255);
                    animation: slide-in-top 0.6s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
                }
        
                @keyframes slide-in-top {
                    0% {
                        transform: translateY(-10px);
                        opacity: 0;
                    }
        
                    100% {
                        transform: translateY(0px);
                        opacity: 1;
                    }
                }
            </style>
                    `
            const downloadJSONBtn = answerDiv.querySelector('.downloadJSONBtn')
            downloadJSONBtn.addEventListener('click', () => {
                downloadJSON(courseId)
            })
            const checkbox = answerDiv.querySelector('input[type="checkbox"]')
            checkbox.checked = false
            checkbox.addEventListener('change', (event) => {
                answerDiv.classList.toggle('active');
                if (checkbox.checked) {
                    top.activeAnswer.push(courseId)
                    LacAnsweList[LacAnsweList.indexOf(answer_array)].active = true
                    GM_setValue('LacAnsweList', JSON.stringify(LacAnsweList))
                } else {
                    top.activeAnswer.splice(top.activeAnswer.indexOf(courseId), 1)
                    LacAnsweList[LacAnsweList.indexOf(answer_array)].active = false
                    GM_setValue('LacAnsweList', JSON.stringify(LacAnsweList))
                }
            });
            const binButton = answerDiv.querySelector('.bin-button')
            binButton.addEventListener('click', () => {
                top.activeAnswer.splice(top.activeAnswer.indexOf(courseId), 1)
                answerDiv.remove()
                LacAnsweList.splice(LacAnsweList.indexOf(answer_array), 1)
                GM_setValue('LacAnsweList', JSON.stringify(LacAnsweList))
                delete LacAllAnswer[courseId]
                GM_setValue('LacAllAnswer', JSON.stringify(LacAllAnswer))
            })
            if (active) {
                answerDiv.classList.add('active');
                checkbox.checked = true
                top.activeAnswer.push(courseId);
            }
            settingAnswesDiv.appendChild(answerDiv);
        }
        async function getAllAnswer() {
            let all_answers = {}
            let number_i = 0
            const get_answer_concent = async (jobid, knowledgeId, ktoken, enc) => {
                const connect_url = `https://mooc1.chaoxing.com/mooc-ans/api/work?api=1&workId=${jobid}&jobid=work-${jobid}&needRedirect=true&skipHeader=true&knowledgeid=${knowledgeId}&ktoken=${ktoken}&cpi=${cpi}&ut=s&clazzId=94010939&type=&enc=${enc}&utenc=undefined&mooc2=1&courseid=${courseid}`
                const timu_d = await getData(connect_url, 'xml')
                const timu_list = Array.from(timu_d.querySelectorAll('div.TiMu.newTiMu.ans-cc.singleQuesId'))
                timu_list.map(timu => {
                    const { type, question } = get_timu_tt(timu)
                    const answer = getAnswer(timu, type)
                    number_i += 1
                    console.log(number_i)
                    // top.all_answers[type][question] = answer
                    if (all_answers[type]) {
                        all_answers[type][question] = answer
                    } else {
                        all_answers[type] = {}
                        all_answers[type][question] = answer
                    }
                })
            }
            const get_answer_main = async (knowledgeId) => {
                const topframe_url = `https://mooc1.chaoxing.com/mooc-ans/mycourse/studentstudyAjax?courseId=${courseid}&clazzid=${clazzid}&chapterId=${knowledgeId}&cpi=${cpi}&verificationcode=false&mooc2=1&microTopicId=0`
                const topframe = await getData(topframe_url, 'xml')
                const work_li = topframe.querySelectorAll('ul.prev_ul.clearfix li')
                await Promise.all(Array.from({ length: work_li.length }).map(async (num) => {
                    const mainframe_url = `https://mooc1.chaoxing.com/mooc-ans/knowledge/cards?clazzid=${clazzid}&courseid=${courseid}&knowledgeid=${knowledgeId}&num=${num}&ut=s&cpi=${cpi}&v=20160407-3&mooc2=1&isMicroCourse=false`
                    const mainframe = await getData(mainframe_url, 'xml')
                    const pageData = await PageData(mainframe)
                    if (pageData.length === 0) { return }
                    const ktoken = pageData.defaults.ktoken
                    const work_array = pageData.attachments.map(attachment => {
                        if (attachment.jobid && attachment.jobid.indexOf('work') != -1) {
                            return [attachment.property.workid, attachment.enc]
                        }
                    }).filter(item => item !== undefined)
                    if (work_array.length === 0) { return }
                    await Promise.all(work_array.map(async (wa) => {
                        await get_answer_concent(wa[0], knowledgeId, ktoken, wa[1])
                    }))
                }))

            }
            const ChapterIArray = await (async () => {
                const url = `https://stat2-ans.chaoxing.com/stat2/chapter-exam/s/tests/data?clazzid=${clazzid}&courseid=${courseid}&cpi=${cpi}&ut=s&pEnc=&page=1&pageSize=16`
                const points = await getData(url);
                const totalPage_array = Array.from({ length: points.data.pageInfo.totalPage }, (_, index) => index + 1)
                const chapterId_array = await Promise.all(totalPage_array.map(async (page) => {
                    const url = `https://stat2-ans.chaoxing.com/stat2/chapter-exam/s/tests/data?clazzid=${clazzid}&courseid=${courseid}&cpi=${cpi}&ut=s&pEnc=&page=${page}&pageSize=16`
                    const points = await getData(url);
                    const small_chapterId_array = points.data.results.map((result) => {
                        if (result.statusStr && [3, 4].indexOf(result.status) !== -1) {
                            return result.chapterId
                        }
                    }).filter(item => item !== undefined)
                    return [...new Set(small_chapterId_array)].join(', ')
                    // result.statusStr && [3, 4].indexOf(result.status) === -1
                }))
                return [...new Set(chapterId_array.join(',').split(','))]
            })()
            await Promise.all(ChapterIArray.map(async (id) => {
                await get_answer_main(id)
            })).then(() => {
                console.log(all_answers)
                const time = getTime();
                LacAllAnswer[_t + time] = all_answers;
                GM_setValue('LacAllAnswer', JSON.stringify(LacAllAnswer));
                const answer_array = { courseId: _t + time, courseName: _t, time: time, active: false }
                LacAnsweList.push(answer_array)
                GM_setValue('LacAnsweList', JSON.stringify(LacAnsweList))
                console.log('保存成功')
                createAnswerDiv(answer_array)
            })
        }
        const getanswerbtn = content.querySelector('#getanswerBtn');
        getanswerbtn.addEventListener('click', async () => {
            getAllAnswer()
        })
        const createGotoButton = (txt) => {
            const button = document.createElement('button');
            button.classList.add('gotobutton');
            button.innerHTML = `
            ${txt}
            <svg fill="currentColor" viewBox="0 0 24 24" class="icon">
                <path clip-rule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                    fill-rule="evenodd"></path>
            </svg>
            <style>
                .gotobutton {
                    position: relative;
                    transition: all 0.3s ease-in-out;
                    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
                    padding-block: 0.5rem;
                    padding-inline: 1.25rem;
                    background-color: rgb(0 107 179);
                    border-radius: 9999px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #ffff;
                    gap: 10px;
                    font-weight: bold;
                    border: 3px solid #ffffff4d;
                    outline: none;
                    overflow: hidden;
                    font-size: 15px;
                }
        
                .icon {
                    width: 24px;
                    height: 24px;
                    transition: all 0.3s ease-in-out;
                }
        
                .gotobutton:hover {
                    transform: scale(1.05);
                    border-color: #fff9;
                }
        
                .gotobutton:hover .icon {
                    transform: translate(4px);
                }
        
                .gotobutton:hover::before {
                    animation: shine 1.5s ease-out infinite;
                }
        
                .gotobutton::before {
                    content: "";
                    position: absolute;
                    width: 100px;
                    height: 100%;
                    background-image: linear-gradient(120deg,
                            rgba(255, 255, 255, 0) 30%,
                            rgba(255, 255, 255, 0.8),
                            rgba(255, 255, 255, 0) 70%);
                    top: 0;
                    left: -100px;
                    opacity: 0.6;
                }
        
                @keyframes shine {
                    0% {
                        left: -100px;
                    }
        
                    60% {
                        left: 100%;
                    }
        
                    to {
                        left: 100%;
                    }
                }
            </style>
            `;
            return button;
        };
        const toOld = (courseid, knowledgeId, clazzid, enc) => {
            const mooc1Domain = "https://mooc1.chaoxing.com";
            const referUrl = mooc1Domain + "/mycourse/studentstudy?chapterId=" + knowledgeId + "&courseId=" + courseid + "&clazzid=" + clazzid + "&cpi=" + cpi + "&enc=" + enc + "&mooc2=1";
            const transferUrl = mooc1Domain + "/mycourse/transfer?moocId=" + courseid + "&clazzid=" + clazzid + "&ut=s&refer=" + encodeURIComponent(referUrl);
            top.location.href = transferUrl;
        }
        async function getUnFinishData(jobEnc) {
            let url
            let funcook = false;
            let firstUnFinishPoint = { index: '第一个未完成的任务点', txt: '所有任务已全部完成', task: null };
            let firstUnFinishVideo = { index: '第一个未完成的视频', txt: '所有视频已全部完成', task: null };
            let firstUnFinishWork = { index: '第一个未完成的作业', txt: '所有作业已全部完成', task: null };
            await (async () => {
                url = `https://stat2-ans.chaoxing.com/stat2/task/s/progress/detail?clazzid=${clazzid}&courseid=${courseid}&cpi=${cpi}&ut=s&pEnc=${jobEnc}&page=1&pageSize=16&status=2`
                console.log(url)
                let points = await getData(url);
                const totalPage = points.data.pageInfo.totalPage
                for (let result of points.data.results) {
                    for (let task of result.list) {
                        if ((!task.workScore || [3, 4].indexOf(task.workScore.status) === -1) && firstUnFinishPoint.txt === '所有任务已全部完成') {
                            firstUnFinishPoint.txt = result.combineName;
                            firstUnFinishPoint.task = task;
                        }
                        if (task.type == '视频') {
                            firstUnFinishVideo.txt = result.combineName;
                            firstUnFinishVideo.task = task;
                            funcook = true;
                            break;
                        }
                    } if (funcook) { break; }
                }
                if (!(totalPage == 1 || (firstUnFinishPoint !== '所有任务已全部完成' && firstUnFinishVideo !== '所有视频已全部完成'))) { return }
                for (let i = 2; i < totalPage + 1; i++) {
                    url = `https://stat2-ans.chaoxing.com/stat2/task/s/progress/detail?clazzid=${clazzid}&courseid=${courseid}&cpi=${cpi}&ut=s&pEnc=${jobEnc}&page=${i}&pageSize=16&status=2`
                    let points = await getData(url);
                    for (let result of points.data.results) {
                        for (let task of result.list) {
                            if ((!task.workScore || [3, 4].indexOf(task.workScore.status) === -1) && firstUnFinishPoint.txt === '所有任务已全部完成') {
                                firstUnFinishPoint.txt = result.combineName;
                                firstUnFinishPoint.task = task;
                            }
                            if (task.type == '视频') {
                                firstUnFinishVideo.txt = result.combineName;
                                firstUnFinishVideo.task = task;
                                funcook = true;
                                break;
                            }
                        } if (funcook) { break; }
                    } if (funcook) { break; }

                }

                return

            })()
            let totalPage = 1
            for (let i = 1; i < totalPage + 1; i++) {
                url = `https://stat2-ans.chaoxing.com/stat2/chapter-exam/s/tests/data?clazzid=${clazzid}&courseid=${courseid}&cpi=${cpi}&ut=s&pEnc=&page=${i}&pageSize=16`
                let points = await getData(url);
                totalPage = points.data.pageInfo.totalPage
                for (let result of points.data.results) {
                    if (result.statusStr && [3, 4].indexOf(result.status) === -1) {
                        firstUnFinishWork.txt = result.chapterName
                        firstUnFinishWork.task = result
                        return { firstUnFinishPoint, firstUnFinishVideo, firstUnFinishWork }
                    }
                }
            }
            return { firstUnFinishPoint, firstUnFinishVideo, firstUnFinishWork }
        }
        (async () => {
            // 调用函数并使用返回的悬浮窗元素
            const unfinishdivs = content.querySelector('#unfinishdivs');
            const unFinishData = await getUnFinishData(jobEnc);
            console.log(unFinishData)
            const firstUnFinishPoint = unFinishData.firstUnFinishPoint;
            const firstUnFinishVideo = unFinishData.firstUnFinishVideo;
            const firstUnFinishWork = unFinishData.firstUnFinishWork;
            const createUnfinish = (unfinish) => {
                let undiv = document.createElement('div');
                undiv.id = 'unfinishdiv';
                // <div id='unfinshdivkid'>${unfinish.txt}</a>
                undiv.innerHTML = `
                <p id='unfinishp'>${unfinish.index}</p>
                    `;
                const gotobutton = createGotoButton(unfinish.txt);
                gotobutton.style.height = '26px';
                gotobutton.style.right = '24px';
                gotobutton.style.position = 'absolute';
                gotobutton.style.fontSize = '11px';
                const svg = gotobutton.querySelector('svg');
                svg.style.width = '20px';
                svg.style.height = '20px';
                let chapterId
                if (unfinish.task) {
                    if (unfinish.task.knowledgeId) {
                        chapterId = unfinish.task.knowledgeId;
                    } else {
                        chapterId = unfinish.task.chapterId;
                    }
                    gotobutton.addEventListener('click', () => {
                        toOld(courseid, chapterId, clazzid, enc)
                    })
                }
                undiv.appendChild(gotobutton)
                unfinishdivs.appendChild(undiv);
            }
            createUnfinish(firstUnFinishPoint)
            createUnfinish(firstUnFinishVideo)
            createUnfinish(firstUnFinishWork)
        })()
        for (let i = 0; i < LacAnsweList.length; i++) {
            createAnswerDiv(LacAnsweList[i])
        }
        const fileInput = document.createElement('input');
        settingAnswesDiv.insertBefore(fileInput, settingAnswesDiv.firstChild)
        fileInput.type = 'file';
        fileInput.addEventListener('change', function (event) {
            const file = event.target.files[0];
            const name = file.name;
            const reader = new FileReader();
            reader.onload = function (e) {
                const time = getTime();
                LacAllAnswer[name + time] = JSON.parse(e.target.result);
                GM_setValue('LacAllAnswer', JSON.stringify(LacAllAnswer));
                const answer_array = { courseId: name + time, courseName: name, time: time, active: false }
                createAnswerDiv(answer_array)
                LacAnsweList.push(answer_array)
                GM_setValue('LacAnsweList', JSON.stringify(LacAnsweList))
            }
            reader.readAsText(file);
        });


        return 'classPage'
    }
    //学生学习页面
    if (_t === '学生学习页面') {
        const work_li = _d.querySelectorAll('ul.prev_ul.clearfix li')
        console.log('学生学习页面', work_li.length)
        if (!sessionStorage.length) {
            //拿到答案
            const all_answers = (() => {
                let all_answers = {}
                const LacAnsweList = JSON.parse(GM_getValue('LacAnsweList', '[]'))
                const LacAllAnswer = JSON.parse(GM_getValue('LacAllAnswer', '{}'))
                for (let i = 0; i < LacAnsweList.length; i++) {
                    if (LacAnsweList[i].active) {
                        all_answers[LacAnsweList[i].courseId] = (LacAllAnswer[LacAnsweList[i].courseId])
                    }
                }
                return all_answers
            })()
            sessionStorage.setItem('all_answers', JSON.stringify(all_answers))
            sessionStorage.setItem('main_coures_id', Object.keys(all_answers)[0])
        }
        return 'topframe';
    }

    //作业页面frame1
    if (_u.indexOf('https://mooc1.chaoxing.com/mooc-ans/knowledge/cards?') !== -1) {
        const PageData = await (async () => {
            let getStr = (str, start, end) => {
                let res = str.substring(str.indexOf(start), str.indexOf(end)).replace(start, '');
                return res;
            },
                scripts = _d.getElementsByTagName('script'),
                param = null;
            for (let i = 0, l = scripts.length; i < l; i++) {
                if (scripts[i].innerHTML.indexOf('mArg = "";') != -1 && scripts[i].innerHTML.indexOf(
                    '==UserScript==') == -1) {
                    param = getStr(scripts[i].innerHTML, 'try{\n    mArg = ', ';\n}catch(e){');
                }
            }
            return await JSON.parse(param)
        })()
        top.all_answers = JSON.parse(sessionStorage.getItem('all_answers'))
        top.main_coures_id = sessionStorage.getItem('main_coures_id')
        let totalpoints = [];
        PageData.attachments.forEach(attachment => {
            console.log(attachment.jobid);  // 打印 jobid
            if (attachment.jobid && attachment.jobid.indexOf('work') != -1) {
                totalpoints.push(attachment.jobid);  // 添加 jobid 到数组
            }
        })
        top.totalpoints = totalpoints.slice()
        top.coursename = PageData.coursename
        console.log('任务列表', totalpoints)
        console.log('mainfram', PageData)
        const nextPage = setInterval(() => {
            if (top.totalpoints.length == 0) {
                clearInterval(nextPage)
                top.document.getElementById('prevNextFocusNext').click()
                const n = setInterval(() => {
                    if (top.document.querySelector('div.maskDiv.jobFinishTip').style.display !== 'none') {
                        clearInterval(n)
                        top.document.querySelector('a.jb_btn.jb_btn_92.fr.fs14.nextChapter').click()
                    }
                }, 500)
            }
        }, 3000)
        return 'mainframe'
    }
    //作业页面frame2
    if (_u.indexOf('https://mooc1.chaoxing.com/mooc-ans/work/') !== -1) {

        const finishWork = async () => {
            //拿到新旧字符对照表解密字符
            const table = await (async () => {
                const truefont_url = 'https://www.lanzouw.com/iQ9tc1z4i40d'
                const truefont_base64Font = await get_file_info(truefont_url, 'json')
                const test_arrayBuffer = ((content) => {
                    const regex = /base64,(.*?)(?=')/;
                    const match = content.match(regex);
                    const base64Font = match ? match[1] : null;
                    const binaryString = window.atob(base64Font);
                    const length = binaryString.length;
                    const uint8Array = new Uint8Array(length);
                    for (let i = 0; i < length; i++) {
                        uint8Array[i] = binaryString.charCodeAt(i);
                    }
                    return uint8Array.buffer;
                })(_d.getElementById('cxSecretStyle').innerHTML)
                let test_font = await opentype.parse(test_arrayBuffer)
                let testfont_base64Font = {}
                const datas = test_font.glyphs.glyphs
                const length = Object.keys(datas).length
                for (let i = 1; i < length; i++) {
                    let data = datas[i]
                    let unicode = data.unicode
                    let commands = data.path.commands
                    let vk = ''
                    for (let j = 0; j < Object.keys(commands).length; j++) {
                        if (commands[j].x) {
                            vk = vk + commands[j].type + commands[j].x + commands[j].y
                        } else {
                            vk = vk + commands[j].type
                        }
                        testfont_base64Font[unicode] = vk
                    }
                }
                // 十进制数组转为 Unicode 字符串
                const decimalArrayToUnicode = decimalArray => decimalArray.map(decimal => String.fromCharCode(decimal))
                let table = {}
                for (let i = 0; i < Object.keys(testfont_base64Font).length; i++) {
                    const key = Object.keys(testfont_base64Font)[i]
                    const value = testfont_base64Font[key]
                    table[String.fromCharCode(key)] = decimalArrayToUnicode(truefont_base64Font[value])
                }
                return table
            })();
            let tablek = (Object.keys(table))
            const tablev = (tablek.map(key => table[key][0])).join('')
            tablek = (Object.keys(table)).join('')
            const translationMap = ((from, to) => {
                const map = {};
                for (let i = 0; i < from.length; i++) {
                    map[from[i]] = to[i];
                }
                return map;
            })(tablek, tablev)
            function translate(str) {
                return str.replace(/./g, char => translationMap[char] || char);
            }
            const invertedTable = (() => {
                let invertedTable = {};
                for (let key in table) {
                    table[key].forEach(value => {
                        if (!invertedTable[value]) {
                            invertedTable[value] = [];
                        }
                        invertedTable[value].push(key);
                    });
                }
                return invertedTable
            })()

            const TiMus = Array.from(_d.querySelectorAll('div.TiMu.newTiMu'))
            function judgeTxt(x, y) {
                y = processTxt(y)
                if (x.length === y.length) {
                    x = Array.from(x)
                    y = Array.from(y)
                    for (let i = 0; i < x.length; i++) {

                        if (x[i] !== y[i]) {
                            if (!invertedTable[x[i]]) {
                                if (tablev.indexOf(x[i]) !== -1) {
                                    if (table[tablek[tablev.indexOf(x[i])]].indexOf(y[i]) === -1) {
                                        return false
                                    }
                                } else {
                                    return false
                                }
                            } else {
                                if (invertedTable[x[i]].indexOf(y[i]) !== -1) {
                                    continue
                                } else if (tablev.indexOf(x[i]) !== -1) {
                                    if (table[tablek[tablev.indexOf(x[i])]].indexOf(y[i]) === -1) {
                                        return false
                                    }
                                } else {
                                    return false
                                }
                            }
                        }

                    }
                    return true
                }
                return false
            }
            function judgeInArray(x, arr) {
                for (let i = 0; i < arr.length; i++) {
                    if (judgeTxt(x, arr[i])) {
                        return true
                    }
                }
                return false
            }
            const finisTiMu = TiMu => {
                const timu_tt = get_timu_tt(TiMu)
                const TiMu_type = timu_tt.type
                const TiMu_question = timu_tt.question
                const answers = (() => {
                    for (let key in top.all_answers) {
                        const answers = top.all_answers[key][TiMu_type]
                        const answer = answers[TiMu_question]
                        if (!answer) {
                            for (const key in answers) {
                                if (judgeTxt(TiMu_question, key)) {
                                    return answers[key]
                                }
                            }
                        }
                        return answer
                    }
                })()
                console.log(TiMu_type, TiMu_question, answers)
                if (answers === undefined) {
                    console.log(TiMu_type, TiMu_question, all_answers[TiMu_type], table)
                }
                switch (TiMu_type) {
                    case "单选题":
                    case "多选题":
                    case "判断题":
                        const answer_lis = Array.from(TiMu.getElementsByTagName('li'))
                        answer_lis.forEach(li => {
                            let txt
                            if (TiMu_type === '判断题') {
                                txt = translate(processTxt(li.ariaLabel)).slice(0, -2)
                            } else {
                                txt = translate(processTxt(li.ariaLabel)).slice(1, -2)
                            }
                            let li_number = 0
                            let txt_number = 0
                            if (li.ariaChecked === 'true') {
                                li_number = 1
                            }
                            if (answers.indexOf(txt) !== -1 || judgeInArray(txt, answers)) {
                                txt_number = 1
                            }
                            if (li_number + txt_number === 1) {
                                console.log(txt)
                                li.click()
                            }

                        })
                        break;
                    case '简答题':
                    case '其它':
                    case '论述题':
                    case '名词解释':
                        let answer_div = TiMu.querySelector('div.clearfix ul.Zy_ulTk li div.edui-default  div.edui-editor.edui-default div.edui-editor-iframeholder.edui-default')
                        const aa = setInterval(() => {
                            if (!answer_div) {
                                answer_div = TiMu.querySelector('div.clearfix ul.Zy_ulTk li div.edui-default  div.edui-editor.edui-default div.edui-editor-iframeholder.edui-default')
                            } else {
                                const answer_frame_id = answer_div.querySelector('iframe').id
                                let numbers = answer_frame_id.match(/\d+/);
                                numbers = numbers[0]
                                answer_div.innerHTML = `<iframe id="ueditor_${numbers}" width="100%" height="100%" frameborder="0" src="javascript:void(function(){document.open();document.domain=&quot;chaoxing.com&quot;;document.write(&quot;<!DOCTYPE html><html xmlns='http://www.w3.org/1999/xhtml' class='view' ><head><style type='text/css'>.view{padding:0;word-wrap:break-word;cursor:text;height:90%;}body{margin:8px;font-family:sans-serif;font-size:16px;}p{margin:5px 0;}</style><link rel='stylesheet' type='text/css' href='/mooc-ans/mooc2/js/editor/themes/iframe.css?v=2023-1130-1704'/></head><body class='view' ></body><script type='text/javascript'  id='_initialScript'>setTimeout(function(){window.parent.UE.instants['ueditorInstant${numbers}']._setup(document);},0);var _tmpScript = document.getElementById('_initialScript');_tmpScript.parentNode.removeChild(_tmpScript);</script></html>&quot;);document.close();}())"></iframe>`
                                clearInterval(aa)
                            }
                        }, 200)
                        const textarea = TiMu.querySelector('textarea')
                        textarea.innerHTML = answers[0]
                        break;
                    case '填空题':
                    case '资料题':
                        const answer_divs = Array.from(TiMu.querySelectorAll('div.InpDIV'))
                        for (let i = 0; i < answer_divs.length; i++) {
                            const id = '#answerEditor' + answer_divs[i].id.slice(6)
                            const textarea = TiMu.querySelector(id)
                            answer_divs[i].innerHTML = answers[i]
                            textarea.value = answers[i]
                        }
                        break
                }
            }
            for (let i = 0; i < TiMus.length; i++) {
                finisTiMu(TiMus[i])
            }
            btnBlueSubmit();
            const submit = setInterval(() => {
                if (top.document.querySelector('div#workpop').style.display !== 'none') {
                    clearInterval(submit)
                    top.totalpoints.splice(top.totalpoints.indexOf(jobid), 1)
                    top.document.querySelector('a#popok').click()
                }
            }, 500)
        }
        const jobid = searchParams.get('jobid')
        while (!top.totalpoints) {
            pass
        }
        if (top.totalpoints.indexOf(jobid) === -1) {
            return 'finishworkframe'
        }
        if (_t === '做作业') {
            //完成作业
            if (_d.querySelector('div.fr.testTit_status').innerHTML.indexOf('作业未创建完成') !== -1) {
                top.totalpoints.splice(top.totalpoints.indexOf(jobid), 1)
                return 'finishworkframe'
            }
            finishWork()
            return 'unfinishworkframe'
        }
        const grade = (() => {
            let grade = 1000
            if (_d.querySelector('p.Finalresult span i')) {
                grade = parseFloat(_d.querySelector('p.Finalresult span i').innerHTML)
            } else if (_d.querySelector('div.dividerCon span.achievement i')) {
                grade = parseFloat(_d.querySelector('div.dividerCon span.achievement i').innerHTML)
            }
            return grade
        })()
        if (grade < 100) {
            //分数不够
            const errorIcon = _d.querySelectorAll('span.marking_cuo')
            const getParent = (element, tag, attribute, value) => {
                let parentElement = element;
                // 从子元素开始向上遍历
                while (parentElement !== null) {
                    if (parentElement.tagName.toLowerCase() === tag.toLowerCase() && parentElement.getAttribute(attribute) === value) {
                        return parentElement; // 如果找到匹配的父元素，则返回该父元素
                    }
                    parentElement = parentElement.parentElement; // 继续向上查找
                }

                return null; // 如果未找到匹配的父元素，则返回 null
            }
            if (errorIcon) {
                const errorTimus = (() => {
                    let errorTimu = new Set();
                    for (let i = 0; i < errorIcon.length; i++) {
                        errorTimu.add(getParent(errorIcon[i], 'div', 'class', 'TiMu newTiMu ans-cc singleQuesId'))
                    }
                    return errorTimu
                })()

                for (let errorTimu of errorTimus) {
                    const timu_tt = get_timu_tt(errorTimu)
                    const timuType = timu_tt.type
                    const timuTxt = timu_tt.question
                    const answerTxt = getAnswer(errorTimu, timuType)
                    console.log(answerTxt)
                    top.all_answers[top.main_coures_id][timuType][timuTxt] = answerTxt
                }
                let temp_answers = JSON.parse(GM_getValue('LacAllAnswer'))
                temp_answers[top.main_coures_id] = top.all_answers[top.main_coures_id]
                GM_setValue('LacAllAnswer', JSON.stringify(temp_answers))
                sessionStorage.all_answers = JSON.stringify(top.all_answers)
            }
            if (_d.querySelector('a.jb_btn_bg')) {
                redoTest()
            }
            top.totalpoints.splice(top.totalpoints.indexOf(jobid), 1)
            return 'finishworkframe'
        }
        return 'unfinishworkframe'
    }
    return 'other'
})()
console.log(urlType, _u)

