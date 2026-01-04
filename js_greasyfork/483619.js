// ==UserScript==
// @name        Next API
// @namespace   Violentmonkey Scripts
// @match      *://www.baidu.com/s*
// @match      *://www.baidu.com/*
// @match      http://www.baidu.com/*
// @match      https://www.baidu.com/*
// @match      *://*.bing.com/*
// @grant      GM_setClipboard
// @grant      GM_addStyle
// @grant      GM_getResourceText
// @require    https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @require    https://cdn.bootcdn.net/ajax/libs/showdown/2.1.0/showdown.min.js
// @require    https://cdn.bootcdn.net/ajax/libs/highlight.js/11.7.0/highlight.min.js
// @require    https://cdn.bootcss.com/toastr.js/latest/js/toastr.min.js
// @resource toastCss  https://cdn.bootcss.com/toastr.js/latest/css/toastr.min.css
// @grant       none
// @version     1.1.5.1
// @author      yang
// @description 2023/12/31 13:10:52 通过GPT辅助查询
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/483619/Next%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/483619/Next%20API.meta.js
// ==/UserScript==
console.log("加载脚本：" + GetNowDate());
window.onload = function (e) {

    creatBox();
    GM_addStyle(GM_getResourceText("toastCss"));
    // //存储访问密钥到缓存
    // let SNKey = localStorage.getItem("SNKey");
    // if (SNKey === null) {
    //     let result = window.prompt("请输入访问密钥！");
    //     if (result === null) {
    //         document.getElementById('gptAnswer').innerHTML = "取消访问...";
    //         return;
    //     } else {
    //         localStorage.setItem("SNKey", result);
    //     }
    // }
}

//全局变量 存储搜索关键字
var keyWord = "";


// if (window.location.href.indexOf("baidu.com\/s") > -1) {
//   var query = document.getElementById("kw").value;
//   console.log("用户输入的搜索词：" + query);
//   PostData(query);
// }

//绘画输出框
function creatBox() {
    let local = `
    <div id="panelTop" class="panelP panelS slide-out">
    <div class="searchC">
        <textarea class="text" id="story" name="story" rows="3" cols="33"
            placeholder="It was a dark and stormy night..."></textarea>
        <button class="btn" id='CusomBtn' onclick="">查询</button>
    </div>
    <div class="card">
        <article id="gptAnswer" class="markdown-body" style="height:350px;overflow-y: scroll;">请稍等一会...</article>
    </div>
</div>

<div class="footer">
    <button id="showHtml" class="showBtn"></button>
</div>
<style>
    .panelP {
        position: fixed;
        right: 20px;
        width: 300px;
        background-color: #f5f5f5;
        padding: 10px;
        /*     height: 500px; */
        position: fixed;
        bottom: 40px;
        overflow-y: overflow;
        z-index: 999;
    }

    .panelS {
        /*   width: 200px;
  height: 200px; */
        background-color: gray;
        transition: transform 0.3s ease, opacity 0.3s ease;
    }

    .slide-out {
        transform: translateX(200px);
        opacity: 0;
        /*pacity: 1;*/
    }

    .slide-in {
        transform: translateX(0);
        opacity: 1;
    }


    .footer {
        position: fixed;
        bottom: 20px;
        /* 根据需求调整到合适的位置 */
        right: 20px;
        /* 根据需求调整到合适的位置 */
        /*         width: 300px; */
        /* 根据需求调整大小 */
        /*         background-color: #f5f5f5; */
        padding: 10px;
        /*         border: 1px solid #ccc; */
    }

    pre .btn-pre-copy {
        text-align: right;
        display: block;
    }

    pre .btn-pre-copy:hover {
        cursor: pointer;
    }

    .card {
        border: 0.5px solid #ccc;
        /* 设置边框 */
        background-color: #fff;
        /* 设置背景颜色 */
        padding: 5px;
        /* 设置内部间距 */
        margin: 10px;
        /* 设置外部间距 */
        border-radius: 5px;
        /* 添加圆角效果 */
        max-height: 350px;
        overflow: hidden;
        overflow-y: scroll;

    }

    /*搜索框*/
    .searchC {
        position: relative;

    }

    .text {
        margin: 10px;
        max-height: 200px;
        width: 280px;
        border-radius: 5px;
        color: #9E9C9C;
        resize: vertical;
        overflow-y: scroll;
    }

    .btn {

        height: 50rpx;
        background: #7BA7AB;
        border-radius: 0 5px 5px 0;
        margin: 0px 10px;
        width: 280px;

        /*         position: absolute; */
    }

    .showBtn {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-image: url('https://pic.imgdb.cn/item/6314920616f2c2beb162b42a.gif');
        background-size: cover;
        background-size: cover;
        background-position: center;
    }
</style>
    `;
    let divE = document.createElement('div');
    //divE.classList.add("markdown-body");
    divE.innerHTML = local;

    let NewDom = document.getElementById("gptAnswer");

    // let content_right = "";
    // if (window.location.href.indexOf("baidu.com\/s") > -1) {
    //     content_right = document.getElementById('content_right');
    // }
    // if ((window.location.href.indexOf("bing.com") > -1)) {
    //     content_right = document.getElementById('b_context');
    // }
    if (NewDom === null && content_right !== null) {
        content_right.prepend(divE);
        //监听自定义事件
        document.getElementById("CusomBtn").addEventListener("click", jl(write, 1500));
        document.getElementById("showHtml").addEventListener("click", function (event) {
            // 执行你的搜索操作或其他逻辑
            //console.log("用户输入的搜索词：" + query);
            var panel = document.getElementById('panelTop'); // 选取id为panel的元素
            //panel.style.display = panel.style.display === 'none' ? 'block' : 'none';

            if (isSlidedIn) {
                panel.classList.remove('slide-in');
                panel.classList.add('slide-out');

            } else {
                panel.classList.remove('slide-out');
                panel.classList.add('slide-in');
                write();
            }

            isSlidedIn = !isSlidedIn;


        })
    }
}

var isSlidedIn = false;





// //监听回车搜索事件
// document.getElementById("kw").addEventListener("keydown", function(event) {
//   if (event.keyCode === 13) {
//     // 回车键被按下
//     //event.preventDefault(); // 阻止默认的提交行为
//     var query = document.getElementById("kw").value;
//     // 执行你的搜索操作或其他逻辑
//     console.log("用户输入的搜索词：" + query);
//     creatBox();
//     //执行获取
//     PostData(query);
//   }
// });

// if (window.location.href.indexOf("baidu.com\/s") > -1) {
//     // //监听回车搜索事件
//     document.getElementById("su").addEventListener("click", function (event) {
//         // var query = document.getElementById("kw").value;
//         //  // 执行你的搜索操作或其他逻辑
//         //  console.log("用户输入的搜索词：" + query);
//         //  creatBox();
//         //  //执行获取
//         //  PostData(query);
//         PostData(keyWord);
//     });
// }


//定时任务
setInterval(() => {
    creatBox();
    let key = "";
    if (window.location.href.indexOf("baidu.com\/s") > -1) {
        key = getUrlParam(window.location.href, 'wd');
    }
    if ((window.location.href.indexOf("bing.com") > -1)) {
        key = getUrlParam(window.location.href, 'q');
    }

    if (key !== keyWord) {
        keyWord = key;
        //执行获取
        //PostData(keyWord);

        document.getElementById("story").value = keyWord;
    }
});





// function CusomBtn() {
//     document.getElementById('gptAnswer').innerHTML = "请稍等一会儿...";
//     let key = document.getElementById("story").value;
//     PostData(key);
// }

//获取地址栏参数
function getUrlParam(url, param) {
    const reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)");
    const result = url.substring(url.indexOf('?') + 1).match(reg);
    if (result != null) {
        return decodeURIComponent(result[2]);
    }
    return null;
}

function containsProgrammingLanguage(str) {
    const programmingLanguages = ['C#', 'c#', 'Java', 'java', 'Python', 'JavaScript', 'js']; // 编程语言列表

    for (let i = 0; i < programmingLanguages.length; i++) {
        const language = programmingLanguages[i];
        if (str.includes(language)) {
            return true;
        }
    }

    return false;
}

// // 示例用法
// const string1 = '我喜欢编程，特别是C#和JavaScript';
// console.log(containsProgrammingLanguage(string1)); // 输出: true

// const string2 = '这个字符串没有编程语言的名称';
// console.log(containsProgrammingLanguage(string2)); // 输出: false

function PostData(query, isCheck = true) {

    let SNKey = localStorage.getItem("SNKey")
    if (SNKey === null) {
        let result = window.prompt("请输入访问密钥！");
        if (result === null) {
            document.getElementById('gptAnswer').innerHTML = "取消访问...";
            toastr.error("用户取消访问！");
            return;
        } else {
            localStorage.setItem("SNKey", result);
            SNKey = result;
        }
    }
    //isCheck && !containsProgrammingLanguage(query)
    if (isCheck) {
        console.log("过滤。。。。");
        document.getElementById('gptAnswer').innerHTML = "搜索无效。。。";
        return;
    }


    var obj = {
        "messages": [{
            "role": "system",
            "content": "\nYou are ChatGPT, a large language model trained by OpenAI.\nKnowledge cutoff: 2021-09\nCurrent model: gpt-3.5-turbo\nCurrent time: 2023/12/31 12:13:57\nLatex inline: $x^2$ \nLatex block: $$e=mc^2$$\n\n"
        },
        {
            "role": "user",
            "content": query
        }
        ],
        "stream": false,//是否使用流输出
        "model": "gpt-3.5-turbo",
        "temperature": 0.5,
        "presence_penalty": 0,
        "frequency_penalty": 0,
        "top_p": 1
    };
    var httpRequest = new XMLHttpRequest();
    var url = "https://api.nextapi.fun/v1/chat/completions";
    httpRequest.open("POST", url, true);
    httpRequest.setRequestHeader("Content-type", "application/json");
    httpRequest.setRequestHeader("Authorization", "Bearer " + SNKey);
    httpRequest.send(JSON.stringify(obj)); //发送请求 将json写入send中
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                //处理响应结果
                var result = httpRequest.responseText;
                //console.log(new Date());
                result = JSON.parse(result);
                //console.log(result)
                //console.log(result.choices[0].message.content);
                var message = result.choices[0].message.content;

                // var renderedHTML = marked.parse(message);
                // // console.log(renderedHTML);
                // creatBox();
                // var NewDom = document.getElementById("outputStory");
                // NewDom.innerHTML  = renderedHTML;
                creatBox();
                showAnserAndHighlightCodeStr(message);
                toastr.success("插件辅助查询到相关信息!", "成功");

            } else {
                //处理请求失败
                //alert('请求失败');
                toastr.error("请求失败。")
            }
        }
    };
}

//显示答案并高亮代码函数
function showAnserAndHighlightCodeStr(codeStr) {
    if (!codeStr) return
    rawAns = codeStr; //记录原文
    try {
        document.getElementById('gptAnswer').innerHTML = mdConverter(codeStr)
    } catch (ex) {
        console.error(ex)
    }
    highlightCodeStr() //高亮
    //添加代码复制按钮 start
    let preList = document.querySelectorAll("#gptAnswer pre")
    preList.forEach((pre) => {
        try {
            if (!pre.querySelector(".btn-pre-copy")) {
                //<span class=\"btn-pre-copy\" onclick='preCopy(this)'>复制代码</span>
                let copyBtn = document.createElement("span");
                copyBtn.setAttribute("class", "btn-pre-copy");
                copyBtn.addEventListener("click", (event) => {
                    let _this = event.target
                    //console.log(_this)
                    let pre = _this.parentNode;
                    //console.log(pre.innerText)
                    _this.innerText = '';
                    GM_setClipboard(pre.innerText, "text");
                    _this.innerText = '复制成功'
                    toastr.success("恭喜，操作成功了！", "成功")
                    setTimeout(() => {
                        _this.innerText = '复制代码'
                    }, 2000)
                })
                copyBtn.innerText = '复制代码'
                pre.insertBefore(copyBtn, pre.firstChild)
            }
        } catch (e) {
            console.log(e)
        }
    })
    //添加代码复制按钮 end
}


//高亮代码函数
function highlightCodeStr() {
    let gptAnswerDiv = document.querySelector("#gptAnswer");
    gptAnswerDiv.querySelectorAll('pre code').forEach((el) => {
        hljs.highlightElement(el);
    });
}

//转换Md格式为Html
function mdConverter(rawData) {
    let converter = new showdown.Converter();
    converter.setOption('tables',
        true); //启用表格选项。从showdown 1.2.0版开始，表支持已作为可选功能移入核心拓展，showdown.table.min.js扩展已被弃用
    converter.setOption('openLinksInNewWindow', true) //链接在新窗口打开
    converter.setOption('strikethrough', true) //删除线
    converter.setOption('emoji', true) //开启emoji

    /***
     * original: John Gruber 规范中的原始 Markdown 风格
     * vanilla：对决基础风味（v1.3.1 起）
     * github: GitHub 风格的 Markdown，或 GFM
     */
    showdown.setFlavor('github');

    try {
        return converter.makeHtml(rawData);
    } catch (ex) {
        console.error(ex)
    }
    return rawData;

}

//获取当前时间
function GetNowDate() {
    // 创建一个 Date 对象来表示当前时间
    var now = new Date();

    // 获取年份、月份、日期、小时、分钟和秒数
    var year = now.getFullYear();
    var month = ('0' + (now.getMonth() + 1)).slice(-2); // 月份从 0 开始，需要加 1
    var day = ('0' + now.getDate()).slice(-2);
    var hours = ('0' + now.getHours()).slice(-2);
    var minutes = ('0' + now.getMinutes()).slice(-2);
    var seconds = ('0' + now.getSeconds()).slice(-2);

    // 构建年月日时分秒的字符串格式
    var formattedDateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;

    // 输出结果
    return formattedDateTime;
}

//节流函数
function jl(fn, deplay) {
    let timer;
    return function () {
        let content = this;
        let ar = arguments;
        if (timer) {
            toastr.warning("手速过快！")
            return;
        }
        timer = setTimeout(function () {
            fn.apply(content, arguments);
            timer = null;
        }, deplay);
    }
}

var query = "";
function write() {
    console.log('已经成功实现节流');
    if (query === document.getElementById("story").value) {
        return;
    }
    query = document.getElementById("story").value;
    document.getElementById('gptAnswer').innerHTML = "请稍等一会儿...";

    if (query.length === 0) {
        toastr.warning("请输入自定义关键字/句！")
        return;
    }
    // 执行你的搜索操作或其他逻辑
    //console.log("自定义搜索词：" + query);
    creatBox();
    //执行获取
    PostData(query, false);
}


