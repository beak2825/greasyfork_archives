// ==UserScript==
// @name         慕课题目搜搜搜
// @namespace    http://tampermonkey.net/
// @version      1.5.4
// @description   超星慕课题库聚合查询小工具，【快捷查询】【高级搜索模式】【OCR识别】
// @author       Onion
// @match     https://www.icourse163.org/*
// @match     https://i.chaoxing.com/*
// @match     https://mooc2-ans.chaoxing.com/*
// @match     https://mooc1.chaoxing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=icourse163.org
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect    cx.icodef.com
// @connect    huawei-cdn.lyck6.cn
// @connect    tk.enncy.cn
// @connect    web.baimiaoapp.com
// @connect    lyck6.cn
// @connect    cx.gocos.cn
// @connect    api.muketool.com
// @connect    43.143.249.139
// @run-at       document-start
// @license      MPL2.0
// @downloadURL https://update.greasyfork.org/scripts/456832/%E6%85%95%E8%AF%BE%E9%A2%98%E7%9B%AE%E6%90%9C%E6%90%9C%E6%90%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/456832/%E6%85%95%E8%AF%BE%E9%A2%98%E7%9B%AE%E6%90%9C%E6%90%9C%E6%90%9C.meta.js
// ==/UserScript==
function mainTop() {

    'use strict';
    /////////全/////////局/////////变/////////量
    var ocrToken = new Object()
    var requestDst = new Array()
    var GM_abort = new Array()
    let ocrSumResults = ""
    let isCtrl=false
    let isAdvanced=false
    const document = unsafeWindow.document;
    const window = unsafeWindow

    //////////【配////////置////////区】//////////////
    var yzggToken = `ddMyyyPEhfHSzQBy`
    var enncyToken = ``
    ocrToken.cookie = ``
    ocrToken.xauthToken = ``
    ocrToken.xauthUuid = ``
    requestDst = [
        "cx.icodef.com",//yzgg
        "huawei-cdn.lyck6.cn",//万能1
        "lyck6.cn",//万能2
        "tk.enncy.cn",//enncy
        "cx.gocos.cn",//Ne-21
        "api.muketool.com",//山楂树1
        "api2.muketool.com",//山楂树2
        "43.143.249.139",//蛋炒饭
    ]
    //////【题/////////目/////////配////////置/////////区】//////
    let formedQues = ""
    let quesType = 0 //0:单选题 (必填) 1:多选题 2:判断题 (int)
    let quesWorkType = "zj" //zj:章节测验 zy:作业 ks:考试
    let quesOptions = new Array()
    let quesSrc = "https://mooc1.chaoxing.com/mycourse/studentstudy?chapterId=636516658&courseId=227751756&clazzid=61817745&cpi=169857532&enc=6431fbd689555ba100515caefc783235&mooc2=1&openc=0737a9a35dcb1f96af6ce927f5cdd739"
    quesOptions = [
        "发展生产力",
        "以经济建设为中心",
        "走向共同富裕",
        "全面建成小康社会"
    ]

    ///////////开///////////源///////////区////////////
    let namespaceURL = [
        "https://greasyfork.org/zh-CN/scripts/451356-%E4%B8%87%E8%83%BD-%E5%85%A8%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC",
        "https://afdian.net/a/enncy",
        "https://scriptcat.org/",
        "https://scriptcat.org/script-show-page/10",
        "https://scriptcat.org/script-show-page/639",
        "https://greasyfork.org/zh-CN/scripts/450614-%E5%85%A8%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC-%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A-%E6%99%BA%E6%85%A7%E6%A0%91-%E6%89%A7%E6%95%99%E4%BA%91-%E6%9B%B4%E6%96%B02022-11-09",
        "https://greasyfork.org/zh-CN/scripts/455607-%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%B0%8F%E5%8A%A9%E6%89%8B-%E7%AD%94%E9%A2%98%E4%B8%93%E7%89%88/code",

    ]
    ////////////外//////////部//////////资///////源//////区////////////
    /*
// @require    https://cdn.bootcdn.net/ajax/libs/react/18.2.0/umd/react.production.min.js
// @require    https://cdn.bootcdn.net/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js
// @require    https://unpkg.com/babel-standalone@6.26.0/babel.min.js
    @react
*/
    function importReact() {
        return new Promise((resolve) => {
            let scriptReact = document.createElement('script');
            scriptReact.setAttribute('type', 'text/javascript');
            scriptReact.src = "https://cdn.bootcdn.net/ajax/libs/react/18.2.0/umd/react.production.min.js";
            document.documentElement.appendChild(scriptReact);
            let scriptReactDom = document.createElement('script');
            scriptReactDom.setAttribute('type', 'text/javascript');
            scriptReactDom.src = "https://cdn.bootcdn.net/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js";
            document.documentElement.appendChild(scriptReactDom);
            resolve("import end")
        })
    }
    /*
    @react
    */
    /*
    babel

    let babelScript = document.createElement('script');
    babelScript.setAttribute('type', 'text/javascript');
    babelScript.src = "https://unpkg.com/babel-standalone@6.26.0/babel.min.js";
    document.documentElement.appendChild(babelScript);
    /*
    babel
    */

    ////////////////////////////////////////////////////////////////////////////


    if (window.location.href.indexOf(".") > -1) {
        addBothStyle()
    }
    if (window.location.href.indexOf("www.icourse163.org") > -1) {
        createBox()
            .then((divE) => {
            return appendBox(0, divE)
        }).then(() => {
            //do Sth
        }).then(() => {
            //babelJsxAndRun()
            //   createBoxReact()  页面重写了React和Babel原型,先暂时使用原生添加,后续再来解决React冲突
            initBox()
            addBoxEvent()
            addMoveEvent()
            appendQuesEvent()
            addSearchEvent()
            pic2WordsEvent()
            keyEvent()
        })
    }
    if (window.location.href.indexOf("i.chaoxing.com/base") > -1) {
        doItBoth()
    }
    if (window.location.href.indexOf("mooc1.chaoxing.com/mycourse/studentstudy") > -1) {
        doItBoth()
    }
    function doItBoth() {
        importReact().then(() => {
            sleep(30).then(() => {
                createBox()
                    .then((divE) => {
                    return appendBox(0, divE)
                }).then(() => {
                    //
                }).then(() => {
                    //babelJsxAndRun()
                    createBoxReact()
                    initBox()
                    addBoxEvent()
                    addMoveEvent()
                    appendQuesEvent()
                    addSearchEvent()
                    pic2WordsEvent()
                    keyEvent()
                })
            })
        })
    }
    function createBoxJsx() {
        return `
        ReactDOM.render(<div>
  <div id="gptInputBox">
    <textarea id="gptInput" type="text" defaultValue={""} />
    <button id="button_GPT">搜一下</button>
  </div>
  <div id="gptCueBox">
    <div id="gptAnswer" className="markdown-body">
      <div id="gptAnswer_inner">慕课题目搜搜搜v1.5.4已启动</div>
      <div id="loadingBox">
        加载中
        <span className="dot" />
      </div>
      <div id="loadingBoxImg">
        图片转文字中,请稍等
        <span className="dot" />
      </div>
    </div>
  </div>
  <div id="gptSettingBox">
    <div id="moveIt">
      <svg
        t={1671455942102}
        className="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id={2728}
        width={200}
        height={200}
      >
        <path
          d="M486.4 776.533333v-213.333333H247.466667v106.666667L85.333333 512l162.133334-162.133333V512h238.933333V247.466667H349.866667L512 85.333333l162.133333 162.133334h-132.266666V512h238.933333V349.866667L938.666667 512l-162.133334 162.133333v-106.666666h-238.933333v213.333333h132.266667L512 938.666667l-162.133333-162.133334h136.533333z"
          p-id={2729}
        />
      </svg>
    </div>
    <div id="spreadOrShrink">⇥</div>
  </div>
</div>, document.getElementById('gptDiv'))
`
    }
    function babelJsxAndRun() {
        let { code } = window.Babel.transform(createBoxJsx(), { presets: ['es2015', 'react'] });
        let functionReactJsx = new Function(code)
        functionReactJsx()
    }
    function createBoxReact() {
        return new Promise((resolve) => {
            ReactDOM.render( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
                id: "gptInputBox"
            }, /*#__PURE__*/React.createElement("textarea", {
                id: "gptInput",
                type: "text",
                defaultValue: ""
            }), /*#__PURE__*/React.createElement("button", {
                id: "button_GPT"
            }, "\u641C\u4E00\u4E0B")), /*#__PURE__*/React.createElement("div", {
                id: "gptCueBox"
            }, /*#__PURE__*/React.createElement("div", {
                id: "gptAnswer",
                className: "markdown-body"
            }, /*#__PURE__*/React.createElement("div", {
                id: "gptAnswer_inner"
            }, "\u6155\u8BFE\u9898\u76EE\u641C\u641C\u641Cv1.2.1\u5DF2\u542F\u52A8"), /*#__PURE__*/React.createElement("div", {
                id: "loadingBox"
            }, "\u52A0\u8F7D\u4E2D", /*#__PURE__*/React.createElement("span", {
                className: "dot"
            })), /*#__PURE__*/React.createElement("div", {
                id: "loadingBoxImg"
            }, "\u56FE\u7247\u8F6C\u6587\u5B57\u4E2D,\u8BF7\u7A0D\u7B49", /*#__PURE__*/React.createElement("span", {
                className: "dot"
            })))), /*#__PURE__*/React.createElement("div", {
                id: "gptSettingBox"
            }, /*#__PURE__*/React.createElement("div", {
                id: "moveIt"
            }, /*#__PURE__*/React.createElement("svg", {
                t: 1671455942102,
                className: "icon",
                viewBox: "0 0 1024 1024",
                version: "1.1",
                xmlns: "http://www.w3.org/2000/svg",
                "p-id": 2728,
                width: 200,
                height: 200
            }, /*#__PURE__*/React.createElement("path", {
                d: "M486.4 776.533333v-213.333333H247.466667v106.666667L85.333333 512l162.133334-162.133333V512h238.933333V247.466667H349.866667L512 85.333333l162.133333 162.133334h-132.266666V512h238.933333V349.866667L938.666667 512l-162.133334 162.133333v-106.666666h-238.933333v213.333333h132.266667L512 938.666667l-162.133333-162.133334h136.533333z",
                "p-id": 2729
            }))), /*#__PURE__*/React.createElement("div", {
                id: "spreadOrShrink"
            }, "\u21E5"))), document.getElementById('gptDiv'));
            //ReactDOM.render( /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Hello World")), document.getElementById('gptDiv'));
            resolve("createEnded")
        })
    }
    /*
                <div id="gptInputBox">
                   <textarea id="gptInput" type=text></textarea>
                   <button id="button_GPT">搜一下</button>
                </div>
                <div id=gptCueBox>
                    <div id="gptAnswer" class="markdown-body">
                        <div id="gptAnswer_inner">慕课题目搜搜搜v1.2.1已启动</div>
                        <div id="loadingBox">加载中<span class="dot"></span></div>
                        <div id="loadingBoxImg">图片转文字中,请稍等<span class="dot"></span></div>
                    </div>
                </div>
                <div id="gptSettingBox">
                    <div id="moveIt"><svg t="1671455942102" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="2728" width="200" height="200">
                            <path
                                d="M486.4 776.533333v-213.333333H247.466667v106.666667L85.333333 512l162.133334-162.133333V512h238.933333V247.466667H349.866667L512 85.333333l162.133333 162.133334h-132.266666V512h238.933333V349.866667L938.666667 512l-162.133334 162.133333v-106.666666h-238.933333v213.333333h132.266667L512 938.666667l-162.133333-162.133334h136.533333z"
                                p-id="2729"></path>
                        </svg></div>
                    <div id="spreadOrShrink">⇥</div>
                </div>
*/

    function createBox() {
        return new Promise((resolve) => {
            var divE = document.createElement('div');
            var divId = document.createAttribute("id"); //创建属性
            divId.value = 'gptDiv'; //设置属性值
            divE.setAttributeNode(divId); //给div添加属性
            divE.innerHTML = `
            <div id="gptInputBox">
            <textarea id="gptInput" type=text></textarea>
            <button id="button_GPT">搜一下</button>
         </div>
         <div id=gptCueBox>
             <div id="gptAnswer" class="markdown-body">
                 <div id="gptAnswer_inner">慕课题目搜搜搜v1.2.1已启动</div>
                 <div id="loadingBox">加载中<span class="dot"></span></div>
                 <div id="loadingBoxImg">图片转文字中,请稍等<span class="dot"></span></div>
             </div>
         </div>
         <div id="gptSettingBox">
             <div id="moveIt"><svg t="1671455942102" class="icon" viewBox="0 0 1024 1024" version="1.1"
                     xmlns="http://www.w3.org/2000/svg" p-id="2728" width="200" height="200">
                     <path
                         d="M486.4 776.533333v-213.333333H247.466667v106.666667L85.333333 512l162.133334-162.133333V512h238.933333V247.466667H349.866667L512 85.333333l162.133333 162.133334h-132.266666V512h238.933333V349.866667L938.666667 512l-162.133334 162.133333v-106.666666h-238.933333v213.333333h132.266667L512 938.666667l-162.133333-162.133334h136.533333z"
                         p-id="2729"></path>
                 </svg></div>
             <div id="spreadOrShrink">⇥</div>
         </div>`
            resolve(divE)
        })
    }
    async function pivElemAddEventAndValue(append_case) {
        var search_content
        if (append_case === 3) {
            search_content = document.getElementById('q').value
        }
        if (append_case === 2) {
            search_content = document.getElementById('kw').value
        }
        if (append_case === 1) {
            search_content = document.querySelector("#tsf > div:nth-child(1) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input:nth-child(3)").value
        }
        if (append_case === 0) {
            search_content = document.getElementsByClassName('b_searchbox')[0].value
        }
        document.getElementById("gptInput").value = search_content
        document.getElementById('button_GPT').addEventListener('click', () => {
            your_qus = document.getElementById("gptInput").value
            do_it()

        })
    }
    async function appendBox(append_case, divE) {
        return new Promise((resolve, reject) => {
            switch (append_case) {
                case 0: //bing
                    if (divE) {
                        document.body.prepend(divE)
                    }
                    break;
                case 1://google
                    if (document.getElementsByClassName('TQc1id ')[0]) {
                        document.getElementsByClassName('TQc1id ')[0].prepend(divE);
                    }
                    else {
                        document.getElementById("rcnt").appendChild(divE);
                    }
                    break;
                default:
                    if (divE) {
                        console.log(`啥情况${divE}`)
                    }
            }
            resolve("finished")
        })
    }
    function addBothStyle() {
        GM_addStyle(`
     b{
     font-weight: bold;
     }
     #moveIt{
     justify-content: right;
     display: flex;
     cursor: move;
}
 .icon{
     width: 100%;
     height: 100%;
}
 #gptSettingBox{
     display: flex;
     flex-direction: row;
     width: 8%;
}
 #spreadOrShrink{
     justify-content: space-evenly;
     display: flex;
     align-items: center;
     border: solid;
     border-top: none;
     border-bottom: none;
     caret-color: transparent;
}
 #gptAnswer{
     margin: 4px;
     border-top: solid;
     border-bottom: solid;
    height: fit-content;
    overflow-y: auto;
    align-items: center;
      text-align: center;
}
 #gptInput{
     width: 81%;
     border-radius: 4px;
     border: solid;
     resize: vertical;
}
 #gptInputBox{
     display: flex;
     justify-content: space-around;
}
 #button_GPT:hover{
     background:#ffffffcc;
}
 #gptDiv{
     border-radius: 8px;
     padding: 10px;
     margin-bottom: 9px;
     width:452px;
     translate:-20px;
     background:#ffffffcc;
     display: flex;
     flex-direction: row;
     position: fixed;
     top: 80px;
     border: solid;
     right: 51px;
     z-index: 9999;
     background: white;
     color: black;
     transition: all 0.5s ease 0s;
}
 #button_GPT{
}
 #button_GPT{
     background: transparent;
     border-radius: 3px;
}
 #gptCueBox{
      width: 68%;
}
 #gptAnswer_inner{

 }
/*dots*/
  .dot{
    height: 4px;
    width: 4px;
    display: inline-block;
    border-radius: 2px;
    animation: dotting 2.4s  infinite step-start;
}
  @keyframes dotting {
    25%{
        box-shadow: 4px 0 0 #71777D;
    }
    50%{
        box-shadow: 4px 0 0 #71777D ,14px 0 0 #71777D;
    }
    75%{
        box-shadow: 4px 0 0 #71777D ,14px 0 0 #71777D, 24px 0 0 #71777D;
    }
}
    `)
    }
    function addBoxEvent() {
        if (getCookie("isShrink") == "") {
            setCookie("isShrink", 0, 30)
        }
        else {
            document.getElementById('spreadOrShrink').addEventListener("click", () => {
                if (getCookie("isShrink") == 0) {
                    document.getElementById('gptInputBox').style.display = "none"
                    document.getElementById('gptCueBox').style.display = "none"
                    document.getElementById('gptDiv').style.width = "1.5vh"
                    document.getElementById('spreadOrShrink').innerHTML = "\u21e4"
                    setCookie("isShrink", 1, 30)
                }
                else {
                    document.getElementById('gptInputBox').style.display = "flex"
                    document.getElementById('gptCueBox').style.display = "block"
                    document.getElementById('gptDiv').style.width = "452px"
                    document.getElementById('spreadOrShrink').innerHTML = "\u21e5"
                    setCookie("isShrink", 0, 30)
                }
            })
        }
    }
    function controlBoxDisplay(id, way) {
        document.getElementById(`${id}`).style.display = `${way}`
    }
    function initBox() {
        if (getCookie("isShrink") == 0) {
            document.getElementById('gptInputBox').style.display = "flex"
            document.getElementById('gptCueBox').style.display = "block"
            document.getElementById('gptDiv').style.width = "452px"
            document.getElementById('spreadOrShrink').innerHTML = "\u21e5"
        }
        else {
            document.getElementById('gptInputBox').style.display = "none"
            document.getElementById('gptCueBox').style.display = "none"
            document.getElementById('gptDiv').style.width = "1.5vh"
            document.getElementById('spreadOrShrink').innerHTML = "\u21e4"
        }
        controlBoxDisplay("loadingBox", "none")//默认不展示
        controlBoxDisplay("loadingBoxImg", "none")//默认不展示
    }
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }
    //原生cookie函数
    function getCookieObject() {
        let cookieString = document.cookie;
        cookieString = cookieString.substring(0, cookieString.length - 1);
        let tempCookieArray = cookieString.split('; ');

        let cookieObject = {}; // 存放 cookie 键值对

        tempCookieArray.forEach(item => {
            let name = item.substring(0, item.indexOf('='));
            let value = item.substring(item.indexOf('=') + 1);
            value = decodeURIComponent(value); // 还原字符串
            cookieObject[name] = value; // 将键值插入中这个对象中
        });

        return cookieObject // 返回包含 cookie 键值对的对象
    }
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }
    function moveIt(controlEle, movedEle) {
        //var demo = document.getElementById(`${settings}`)
        var canitmove = false
        var x = 0,
            y = 0
        controlEle.onmousedown = function (e) {
            e.preventDefault()
            x = e.pageX - movedEle.offsetLeft
            y = e.pageY - movedEle.offsetTop
            canitmove = true
            document.getElementById("gptDiv").style.transition = "none"
            //  console.log(e.pageX)
        }
        controlEle.onmouseup = function (e) {
            e.preventDefault()
            x = e.pageX - movedEle.offsetLeft
            y = e.pageY - movedEle.offsetTop
            canitmove = false
            document.getElementById("gptDiv").style.transition = "all 0.5s ease 0s"
            //  console.log(movedEle.offsetLeft)
            console.log(e.pageX)
        }
        window.onmouseup = function () {
            canitmove = false
        }
        window.onmousemove = function (e) {

            if (canitmove) {
                movedEle.style.left = e.pageX - x + 'px'
                movedEle.style.top = e.pageY - y + 'px'
            }
        }
    }
    function addMoveEvent() {
        moveIt(document.getElementById('moveIt'), document.getElementById('gptDiv'))
    }

    //搜题部分
    function getRawQues(){
        return document.getElementById('gptInput').value.trim().replace(/(\s)|(\\n)/g, "")
    }
    function getQues() {
        if (getRawQues().match(/\[.+\]/g)) {
            return getRawQues().match(/(?<=\[).*?(?=\])/g)[0]
        }else{
            return getRawQues()
        }
    }
    function getFullQues() {
        if (getRawQues().match(/\[.+\]/g)) {
            formedQues = getRawQues().match(/(?<=\[).*?(?=\])/g)[0]
            quesOptions[0] = getRawQues().match(/(?<=\[).*?(?=\])/g)[1]
            quesOptions[1] = getRawQues().match(/(?<=\[).*?(?=\])/g)[2]
            quesOptions[2] = getRawQues().match(/(?<=\[).*?(?=\])/g)[3]
            quesOptions[3] = getRawQues().match(/(?<=\[).*?(?=\])/g)[4]
            return true
        }
    }
    function appendQuesEvent() {
        document.addEventListener("mouseup", () => {
            if (unsafeWindow.getSelection().toString().replace(/(\s)|(\\n)/g, "") !== "" && !isActive("gptInput")&&isCtrl) {
                document.getElementById('gptInput').value = unsafeWindow.getSelection().toString().replace(/(\s)|(\\n)/g, "")
            }
            else if(isAdvanced){
                document.getElementById('gptInput').value +=`[${unsafeWindow.getSelection().toString().replace(/(\s)|(\\n)/g, "")}]\n`
            }
        });
    }
    function getAllAnswer() {
        if (getQues() !== "") {
            controlBoxDisplay("loadingBox", "block")
            log(``)
            getAnswer(1)
                .then(() => {
                return getAnswer(0)
            })
                .then(() => {
                return getAnswer(3)
            })
                .then(() => {
                return getAnswer(4)
            })
                .then(() => {
                if (enncyToken !== "") {
                    return getAnswer(2)
                }
            })
                .then(() => {
                if (getFullQues()) {
                    getFullQues()
                    return getAnswer(5)
                }
            })
                .then(() => {
                controlBoxDisplay("loadingBox", "none")
                console.log("finished");
            })
                .catch((err) => {
                log(err)
            })
        }
        else {
            document.getElementById('gptAnswer_inner').innerHTML = `<div>搜索内容不能为空</div>`
        }
    }
    function getAnswer(chooseCase) {
        return new Promise((resolve) => {
            if (document.getElementById('gptInput').value !== "") {
                switch (chooseCase) {
                    case 0:
                        GM_abort[0] = GM_xmlhttpRequest({
                            method: "POST",
                            url: `https://${requestDst[0]}/wyn-nb`,
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                                Authorization: `${yzggToken}`,
                            },
                            data: `question=${getQues()}`,
                            onloadend: function (data) {
                                try {
                                    let parsedAnswer = JSON.parse(data.response).data
                                    resolve(data.response)
                                    if (parsedAnswer.match(/http.+/g)) {
                                        logAdd(`<br><b>一之哥哥</b>：<img src="${parsedAnswer}" alt="">`)
                                    }
                                    else if(parsedAnswer.match(/#+/g)){
                                        logAdd(`<br><b>一之哥哥(多选)</b>：<br>`)
                                        parsedAnswer.split("#").forEach((ele,index)=>{logAdd(`<b>${index+1}</b>：${ele}<br>`)})
                                    }
                                    else {
                                        logAdd(`<br><b>一之哥哥</b>：${parsedAnswer}<br>`)
                                    }
                                } catch (err) {
                                    logAdd(`<br><b>一之哥哥err</b>:${err}`)
                                }
                            },
                            onerror: function (err) {
                                throw new Error('Error while executing the code');
                            },
                            ontimeout: function (err) {
                                throw new Error('Error while executing the code');
                            }
                        })
                        break;
                    case 1:
                        GM_abort[1] = GM_xmlhttpRequest({
                            method: "POST",
                            url: `http://${requestDst[1]}/api/autoFreeAnswer`,
                            headers: {
                                "Content-Type": "application/json",
                            },
                            data: `{"question": "${getQues()}"}`,
                            onloadend: function (data) {
                                try {
                                    console.log(data.response)
                                    if (JSON.parse(data.response).code !== 200) {
                                        logAdd(`<b>【万能】全平台</b>：${JSON.parse(data.response).msg}<br>`)
                                    }
                                    else {
                                        let allAns = ""
                                        for (let i = 0; i <= 2; i++) {
                                            allAns += `<b>${i}</b>：${JSON.parse(data.response).data.list[i]}\n\n`
                                        }
                                        logAdd(`<b>【万能】全平台</b>：${allAns}<br>`)
                                    }
                                } catch (err) {
                                    logAdd(`<b>【万能】全平台</b>：点的太快了gg，再试一次；<br><b>错误信息</b>："${err}"<br>`)
                                }
                                resolve(data.response)
                            },
                            onerror: function (err) {
                                throw new Error('Error while executing the code');
                            },
                            ontimeout: function (err) {
                                throw new Error('Error while executing the code');
                            }
                        })
                        break;
                    case 2:
                        GM_abort[2] = GM_xmlhttpRequest({
                            method: "GET",
                            url: `https://${requestDst[3]}/query?title=${getQues()}&token=${enncyToken}`,
                            headers: {
                                "Content-Type": "application/json",
                            },
                            onloadend: function (data) {
                                try {
                                    logAdd(`<br><b>enncy题库</b>：${JSON.parse(data.response).data.answer}<br>`)
                                } catch (err) {
                                    logAdd(`<br><b>enncyERR</b>：${err}<br>`);
                                }
                                resolve(data.response)
                            },
                            onerror: function (err) {
                                throw new Error('Error while executing the code');
                            },
                            ontimeout: function (err) {
                                throw new Error('Error while executing the code');
                            }
                        })
                        break;
                    case 3:
                        GM_abort[3] = GM_xmlhttpRequest({
                            method: "POST",
                            url: `https://${requestDst[4]}/api/v1/cx?v=1.7.8`,
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                            },
                            data: `question=${getQues()}`,
                            onloadend: function (data) {
                                try {
                                    if (JSON.parse(data.response).data.answer == "") {
                                        logAdd(`<br><b>Ne-21题库</b>：${JSON.parse(data.response).msg}<br>`)
                                    }
                                    else {
                                        logAdd(`<br><b>Ne-21题库</b>：${JSON.parse(data.response).data.answer}<br>`)
                                    }
                                } catch (err) {
                                    logAdd(`<br><b>Ne-21题库ERR</b>：${err}<br>`);
                                }
                                resolve(data.response)
                            },
                            onerror: function (err) {
                                throw new Error('Error while executing the code');
                            },
                            ontimeout: function (err) {
                                throw new Error('Error while executing the code');
                            }
                        })
                        break;
                    case 4:
                        GM_abort[4] = GM_xmlhttpRequest({
                            method: "POST",
                            url: `http://${requestDst[5]}/v1/cx`,
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                            },
                            data: 'question=' + encodeURIComponent(getQues()) + '&script=v1cx',
                            onloadend: function (res) {
                                try {
                                    if (JSON.parse(res.response).code) {
                                        logAdd(`<br><b>山楂树题库</b>：${JSON.parse(res.response).data}<br>`)
                                    }
                                    else {
                                        logAdd(`<br><b>山楂树题库(failed)</b>：${JSON.parse(res.response).data}<br>`)
                                    }
                                } catch (err) {
                                    logAdd(`<br><b>山楂树题库ERR</b>：${err}<br>`);
                                }
                                resolve(res.response)
                            },
                            onerror: function (err) {
                                throw new Error('Error while executing the code');
                            },
                            ontimeout: function (err) {
                                throw new Error('Error while executing the code');
                            }
                        })
                        break;
                    case 5:
                        GM_abort[5] = GM_xmlhttpRequest({
                            method: "POST",
                            url: `http://${requestDst[7]}/answer?z=${quesWorkType}&t=${quesType}`,
                            headers: {
                                "Content-Type": "application/json",
                                "v": "1.4.3",
                                "referer": `${quesSrc}`
                            },
                            data: `
                            {
                                "question":"${formedQues}",
                                "options":[
                                    "${quesOptions[0]}",
                                    "${quesOptions[1]}",
                                    "${quesOptions[2]}",
                                    "${quesOptions[3]}"
                                ],
                                "type":"${quesType}",
                                "questionData":"",
                                "workType":"${quesWorkType}"
                            }
                            `,
                            onloadend: function (res) {
                                try {
                                    console.log(res.response)
                                    if (JSON.parse(res.response).code == 200) {
                                        logAdd(`<br><b>蛋炒饭</b>：${JSON.parse(res.response).data.answer[0]}<br>`)
                                    }
                                    else if (JSON.parse(res.response).code == -1) {
                                        logAdd(`<br><b>蛋炒饭</b>：${JSON.parse(res.response).msg}<br>`)
                                    }
                                } catch (err) {
                                    logAdd(`<br><b>蛋炒饭题库ERR</b>：${err}<br>`);
                                }
                                resolve(res.response)
                            },
                            onerror: function (err) {
                                throw new Error('Error while executing the code');
                            },
                            ontimeout: function (err) {
                                throw new Error('Error while executing the code');
                            }
                        })
                        break;
                    default:
                        GM_abort[5] = GM_xmlhttpRequest({
                            method: "POST",
                            url: "https://cx.icodef.com/wyn-nb",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                                Authorization: `${yzggToken}`,
                            },
                            data: `question=${getQues()}`,
                            onloadend: function (data) {
                                document.getElementById('gptAnswer').innerHTML = JSON.parse(data.response).data
                            },
                            onerror: function (err) {
                                throw new Error('Error while executing the code');
                            },
                            ontimeout: function (err) {
                                throw new Error('Error while executing the code');
                            }
                        })

                }
            }
            else {
                document.getElementById('gptAnswer_inner').innerHTML = `<div>搜索内容不能为空</div>`
            }
        })




    }
    function pic2WordsEvent() {
        document.getElementById('gptInput').addEventListener('paste', (e) => {
            pic2base64(e).then((base64data) => {
                if (base64data) {
                    if (!ocrToken.xauthToken || !ocrToken.xauthUuid || !ocrToken.cookie) {
                        log(`你妹有白描cookie（悲<br><a href="https://web.baimiaoapp.com/">点我去白描官网买</a>`)
                    }
                    else {
                        console.log(base64data.toString());
                        log(`尊贵的白描黄金VIP,欢迎`)
                        controlBoxDisplay("loadingBoxImg", "block")
                        sendOcrMode()
                            .then((sendOcrModeRes) => {
                            console.log(sendOcrModeRes);
                            return sendOcrData(JSON.parse(sendOcrModeRes).data.token, base64data)
                        })
                            .then((sendOcrDataRes) => {
                            // console.log(JSON.parse(sendOcrDataRes).data.jobStatusId);
                            return JSON.parse(sendOcrDataRes).data.jobStatusId
                        })
                            .then((jobStatusId) => {
                            console.log(jobStatusId);
                            sleep(2500).then(() => {
                                getOcrResults(jobStatusId)
                                    .then((finalRes) => {
                                    console.log(finalRes)
                                    if (JSON.parse(finalRes).code === 1) {
                                        for (let i = 0; i <= JSON.parse(finalRes).data.ydResp.data.lines.length - 1; i++) {
                                            ocrSumResults += JSON.parse(finalRes).data.ydResp.data.lines[i].text
                                        }
                                    }
                                    else {
                                        logAdd(`<br>emmm,网络有点卡,再试一次吧！`)
                                        return JSON.parse(finalRes).code
                                    }
                                }).then((statusCode) => {
                                    if (ocrSumResults == "" && statusCode !== 0) {
                                        logAdd(`<br>识别的内容居然是空的（惊`)
                                    }
                                    else { document.getElementById('gptInput').value = `${ocrSumResults.trim()}` }
                                }).then(() => {
                                    ocrSumResults = ""
                                }).then(() => {
                                    controlBoxDisplay("loadingBoxImg", "none")
                                })
                            })


                        })
                    }

                }
                else {
                    console.log("原来只是正常的复制而已（*~*)");
                }

            })
        })
    }
    function pic2base64(e) {
        return new Promise((resolve) => {
            e.stopPropagation();
            // e.preventDefault();
            // 阻止粘贴
            // 获取剪贴板信息
            var clipboardData = e.clipboardData || window.clipboardData;
            var items = clipboardData.items;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.kind == 'file') {
                    var pasteFile = item.getAsFile();
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        // 将结果显示在<textarea>中
                        resolve(event.target.result)
                        //  console.log(event.target.result);
                    }
                    // 将文件读取为BASE64格式字符串
                    reader.readAsDataURL(pasteFile);
                    break;
                }
                else {
                    resolve(0)
                }
            }
        })
    }
    const sleep = (time) => {
        return new Promise(resolve => setTimeout(resolve, time))
    }
    function getOcrResults(jobStatusId) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://web.baimiaoapp.com/api/ocr/image/xunfei/status?jobStatusId=${jobStatusId}`,
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    "x-auth-token": ocrToken.xauthToken,
                    "x-auth-uuid": ocrToken.xauthUuid,
                    "Cookie": ocrToken.cookie,
                    "Connection": "keep-alive",
                    "Accept": "*/*"
                },
                onloadend: function (data) {
                    try {
                        resolve(data.response)
                    } catch (err) {
                        logAdd(`err:${err}`)
                    }
                },
                onerror: function (err) {
                    logAdd(`err:${err}`)
                },
                ontimeout: function (err) {
                    logAdd(`err:${err}`)
                }
            })
        })

    }
    function sendOcrData(nextToken, base64data) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://web.baimiaoapp.com/api/ocr/image/xunfei",
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    "x-auth-token": ocrToken.xauthToken,
                    "x-auth-uuid": ocrToken.xauthUuid,
                    "Cookie": ocrToken.cookie,
                    "Connection": "keep-alive",
                    "Accept": "*/*"
                },
                data: `{"token":"${nextToken}","hash":"3f9c056379f0457c564290f6e15a9c232f1e5557","name":"image.png","size":13764,"dataUrl":"${base64data}","result":{},"status":"processing","isSuccess":false}`,
                onloadend: function (data) {
                    try {
                        resolve(data.response)
                    } catch (err) {
                        logAdd(`err:${err}`)
                    }
                },
                onerror: function (err) {
                    logAdd(`err:${err}`)
                },
                ontimeout: function (err) {
                    logAdd(`err:${err}`)
                }
            })
        })

    }
    function sendOcrMode() {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://web.baimiaoapp.com/api/perm/single",
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    "x-auth-token": ocrToken.xauthToken,
                    "x-auth-uuid": ocrToken.xauthUuid,
                    cookie: ocrToken.cookie
                },
                data: `{"mode": "single"}`,
                onloadend: function (data) {
                    try {
                        resolve(data.response)
                    } catch (err) {
                        logAdd(`err:${err}`)
                    }
                },
                onerror: function (err) {
                    logAdd(`err:${err}`)
                },
                ontimeout: function (err) {
                    logAdd(`err:${err}`)
                }
            })
        })

    }
    function addSearchEvent() {
        document.getElementById('button_GPT').addEventListener("click", () => {
            getAllAnswer()
        })
    }
    function keyEvent() {
        document.onkeydown = function (e) {
        //   console.log(e)
            var keyNum = window.event ? e.keyCode : e.which;
            if (13 == keyNum && e.ctrlKey) {
                console.log(isAdvanced)
                if (isActive("gptInput")) {
                    document.getElementById('button_GPT').click()
                }
                else {
                    console.log("失焦不执行")
                }
            }
            else if(e.ctrlKey){
                isCtrl=true
            }
            else{
                isCtrl=false
            }
        }
        document.addEventListener("keydown", (e)=>{
             var keyNum = window.event ? e.keyCode : e.which;
            if(65 == keyNum && e.altKey){
                isAdvanced=true
                console.log(isAdvanced)
            }
        });
        document.onkeyup= function (e) {
            isCtrl=false
            isAdvanced=false
        }

    }
    function isActive(id) {
        var myInput = document.getElementById(id);
        if (myInput == document.activeElement) {
            return 1
        } else {
            return 0
        }
    }
    function getBase64Size(base64) {//获取base64字符串的大小
        /*
            参考：https://www.jb51.net/article/172316.htm
            并优化后代码
        */
        if (base64) { // 获取base64图片byte大小
            base64 = base64.split(",")[1].split("=")[0];
            var strLength = base64.length;
            var fileLength = strLength - (strLength / 8) * 2;
            return Math.floor(fileLength); // 向下取整
        } else {
            return null
        }
    };
    function log(temp_1) {
        document.getElementById('gptAnswer_inner').innerHTML = temp_1
    }
    function logAdd(temp_1) {
        document.getElementById('gptAnswer_inner').innerHTML += temp_1
    }

}
(function () { window.onload = mainTop })()