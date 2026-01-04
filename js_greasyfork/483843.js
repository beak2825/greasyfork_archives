// ==UserScript==
// @name         powerful OI note
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  make note and blog easier
// @author       konyakest
// @license      MIT
// @match        https://www.luogu.com.cn/*
// @match        http://www.nfls.com.cn:*/*
// @match        https://vjudge.net/problem/*
// @match        https://vjudge.csgrandeur.cn/problem/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/483966/powerful%20OI%20note.user.js
// @updateURL https://update.greasyfork.org/scripts/483966/powerful%20OI%20note.meta.js
// ==/UserScript==

/*
使用方法：将下面的 PASTEID 改为自己的一个闲置剪切板。
**请保证你不会使用这个剪切板，防止数据丢失**
*/
const settings = {
    PASTEID : "u3mnkre6",
    FMT_FUNC : (startDate,endDate) => `${startDate} 到 ${endDate} 的总结${"\n\n"}Powered by [powerful OI note](https://greasyfork.org/zh-CN/scripts/483966-powerful-oi-note)${"\n\n"}`
};

const PASTEID = settings.PASTEID;
const FMT_FUNC = settings.FMT_FUNC;

const CURRENT_DATA = "CURRENT_DATA";

var has_built = false;
const today = getDate(new Date());

function todaySetValue(name,value,date=today){
    console.log(date);
    let tmp = GM_getValue(date);
    tmp[name] = value;
    GM_setValue(date,tmp);
}

function todayDelValue(name,date=today){
    let tmp = GM_getValue(date);
    delete tmp[name];
    GM_setValue(date,tmp);
}

function todayGetValue(name,date=today){
    return GM_getValue(date)[name];
}

async function changePaste(data){
    GM_setValue("changePaste",data);
}

async function doChangePaste(){
    let data = GM_getValue("changePaste");
    if(typeof data === 'undefined'){
        return false;
    }
    await fetch(`https://www.luogu.com.cn/paste/edit/${PASTEID}`, {
        "credentials": "include",
        "headers": {
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRF-TOKEN": document.querySelector("meta[name=csrf-token]").content,
            "Content-Type": "application/json",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
        },
        "body": JSON.stringify({"data":data}),
        "method": "POST",
        "mode": "cors"
    });
    GM_deleteValue("changePaste");
    return true;
}

async function inPaste(){
    let value = GM_getValue(CURRENT_DATA);
    if(!value){
        return;
    }
    let [problem,link] = value;
    if(await doChangePaste()){
        window.location.reload();
    }
    if(problem === ""){
        GM_deleteValue(CURRENT_DATA);
        return;
    }
    let div = document.querySelector(".actions");
    let button = div.childNodes[2].cloneNode(true);
    button.innerText=`保存为 ${problem} 的笔记`;
    div.appendChild(div.childNodes[1].cloneNode(true));
    div.appendChild(button);
    button.onclick = function(){
        if(unsafeWindow._feInjection.currentData.paste.data === ''){
            todayDelValue(`${problem}`);
        }
        else{
            [today,'all'].forEach(function(value){
                todaySetValue(`${problem}`,{
                    html: document.querySelector(".marked").innerHTML,
                    code: unsafeWindow._feInjection.currentData.paste.data,
                    link: link
                },value);
            });
        }
        alert("保存成功");
        GM_deleteValue(CURRENT_DATA,problem);
    };
}

const all_button={
    "luogu":()=>document.querySelector(".operation > span:nth-child(3)"),
    "nfls":()=>document.querySelector("a.small:nth-child(2)"),
    "vjudge":()=>document.querySelector(".col-xs-12")
};

const setSubNode = {
    "luogu":(tmp2,value)=>(tmp2.childNodes[0].childNodes[0].innerText = value),
    "nfls":(tmp2,value)=>(tmp2.innerText = value),
    "vjudge":(tmp2,value)=>(tmp2.childNodes[1].innerText = value)
}

async function inProblem(opt){
    let problem;
    if(opt === "luogu"){
        problem = window.location.href.split('/')[4];
    }
    else if(opt === "nfls"){
        problem = "nfls" + document.querySelector(".orange").href.split('/')[4];
    }
    else if(opt === "vjudge"){
        problem = window.location.href.split('/')[4] + " (vjudge)";
    }
    let value = todayGetValue(`${problem}`,'all');
    if(value) value = value.html;

    let tmp = all_button[opt]();
    let tmp2 = tmp.cloneNode(true);
    tmp.parentNode.appendChild(tmp2);
    setSubNode[opt](tmp2,value ? "查看/修改笔记" : "创建笔记");
    tmp2.onclick = async function(){
        GM_setValue(CURRENT_DATA,[problem,window.location.href]);
        if(value){
            await changePaste(todayGetValue(`${problem}`,'all').code);
        }
        else{
            await changePaste("",`${problem}`);
        }
        window.open(`https://www.luogu.com.cn/paste/${PASTEID}`);
    };
}


function download(text, filename) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function getDate(date){
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\//g, '-');
}

function loadDataByDate(start,end){
    start = new Date(start);
    end = new Date(end);
    let res = `# ${FMT_FUNC(getDate(start),getDate(end))}${"\n\n"}`;
    while(start <= end){
        res += `## ${getDate(start)}${"\n\n"}`;
        let tmp = GM_getValue(getDate(start));
        for(let i in tmp){
            res += `### [${i}](${tmp[i].link})${"\n\n"}`;
            res += tmp[i].code + "\n\n";
        }
        start.setDate(start.getDate()+1);
    }
    return res;
}

function registExport(){
    // 创建并添加div元素
    let div = document.createElement('div');
    div.id = 'datePickerDiv';
    div.style.display = 'none'; // 默认隐藏
    div.style.position = 'fixed'; // 固定位置
    div.style.top = '40%'; // 距离页面顶部10%的位置
    div.style.left = '40%'; // 距离页面左侧10%的位置
    div.style.width = '250px'; // 宽度为页面宽度的80%
    div.style.height = '20%'; // 高度为页面高度的80%
    div.style.zIndex = '1000'; // 设置z-index为1000，确保在页面其他元素之上
    div.style.backgroundColor = '#f9f9f9'; // 设置背景色为浅灰色
    div.style.border = '1px solid #ccc'; // 设置边框为灰色实线，宽度为1像素
    div.style.padding = '20px'; // 内边距为20像素
    div.innerHTML = `
        <h3>选择导出的时间</h3>
        <input type="date" id="datePicker1">
        <input type="date" id="datePicker2">
        <br>
        <button id="confirmButton">直接导出</button>
        <button id="gotoPasteButton">预览</button>
        <button id="cancelButton">取消</button>
    `;
    document.body.appendChild(div);

    // 添加事件监听器
    let datePickers = [document.getElementById('datePicker1'),document.getElementById('datePicker2')];
    let confirmButton = document.getElementById('confirmButton');
    let gotoPasteButton = document.getElementById("gotoPasteButton");
    let cancelButton = document.getElementById('cancelButton');

    confirmButton.addEventListener('click', function() {
        download(loadDataByDate(datePickers[0].value,datePickers[1].value),
            `${FMT_FUNC(datePickers[0].value,datePickers[1].value)}.md`);
        div.style.display = 'none'; // 隐藏div元素
    });

    cancelButton.addEventListener('click', function() {
        div.style.display = 'none'; // 隐藏div元素
    });

    gotoPasteButton.addEventListener('click',function() {
        changePaste(loadDataByDate(datePickers[0].value,datePickers[1].value));
        GM_setValue(CURRENT_DATA,["",""]);
        window.open(`https://www.luogu.com.cn/paste/${PASTEID}`);
    });

    // 监听键盘快捷键Ctrl+E，显示和隐藏div元素
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'e') { // 如果按下了Ctrl+E组合键
            datePickers[0].value = datePickers[1].value = today;
            if (div.style.display === 'none') { // 如果div元素当前是隐藏的
                div.style.display = 'block'; // 显示div元素
            } else { // 如果div元素当前是显示的
                div.style.display = 'none'; // 隐藏div元素
            }
            event.preventDefault(); // 阻止默认行为，避免打开或关闭网址等操作
        }
    });
}

function URLmatch(pat){
    return Boolean(window.location.href.match(pat));
}

function buildproblempaste() {
    if (has_built) return;
    has_built = true;
    if(!GM_getValue(today)) GM_setValue(today,{});
    if(!GM_getValue('all')) GM_setValue('all',{});
    registExport();
    let conditions = {
        "https://www.luogu.com.cn/problem/"                 :"luogu",
        "http://www.nfls.com.cn:(.*?)/contest/*/problem/*"  :"nfls",
        "http://www.nfls.com.cn:(.*?)/problem/*"            :"nfls",
        "https://vjudge.net/problem/"                       :"vjudge",
        "https://vjudge.csgrandeur.cn/problem"              :"vjudge",
    };
    for(let i in conditions){
        if(URLmatch(i)){
            inProblem(conditions[i]);
            break;
        }
    }
    if(URLmatch("https://www.luogu.com.cn/paste/"+PASTEID)){
        inPaste();
    }
}

window.addEventListener('load', buildproblempaste);
setTimeout(buildproblempaste, 500);
