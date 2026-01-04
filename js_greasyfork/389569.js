// ==UserScript==
// @name         quizii组卷查重工具——试卷管理
// @namespace    http://jz.quizii.com/
// @version      0.4.4
// @description  查重流程：1. 在练习箱页面“保存试卷”； 2. 在试卷编辑页面“重题审核”
// @author       JinJunwei
// @match        http://jz.quizii.com/*/papers/mine*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389569/quizii%E7%BB%84%E5%8D%B7%E6%9F%A5%E9%87%8D%E5%B7%A5%E5%85%B7%E2%80%94%E2%80%94%E8%AF%95%E5%8D%B7%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/389569/quizii%E7%BB%84%E5%8D%B7%E6%9F%A5%E9%87%8D%E5%B7%A5%E5%85%B7%E2%80%94%E2%80%94%E8%AF%95%E5%8D%B7%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==

'use strict';

// 悬浮按钮的容器
let referenceElement=function (referenceElement){
    let newElement = document.createElement('div');
    newElement.innerHTML = '<div class="myInjectContainer" ></div>';
    newElement = newElement.firstChild
    // 定位
    newElement.style.top = referenceElement.offsetTop+ referenceElement.offsetHeight+"px";
    // 插入元素
    referenceElement.parentElement.insertBefore(newElement, referenceElement.nextElementSibling);
    return newElement;
}(document.querySelector('div#feedback_btn'));

// 悬浮按钮，接受试卷
(function() {
    let newElement = document.createElement('div');
    newElement.innerHTML = '<div class="tampermonker-like-feedback_btn"  title="油猴脚本，接受全部试卷">接受试卷</div>';
    newElement = newElement.firstChild
    referenceElement.appendChild(newElement); // 插入到页面
    // 功能脚本
    newElement.onclick = function(){
        //全部接收
        document.querySelectorAll("#sharing_list a:nth-child(1)").forEach(el=>el.click());
    };
})();


// 第2个悬浮按钮，保存试卷
(function() {
    let newElement = document.createElement('div');
    newElement.innerHTML = '<div class="tampermonker-like-feedback_btn"  title="油猴脚本，导出当前页的全部或选中试卷到本地浏览器数据库，用于组卷排重">保存试卷</div>';
    newElement = newElement.firstChild
    referenceElement.appendChild(newElement); // 插入到页面
    // 功能脚本
    newElement.onclick = async function(){
        // 导出当前页的全部或选中试卷到本地浏览器数据库
        // 选中的试卷id
        let papers = [...document.querySelectorAll("#paper_wrap tr.paper")].filter(el=>el.querySelector("input.paper_selected").checked);
        // 如果没有选中，则清空
        if(papers.length===0){
            if(confirm("是否清空保存到本地浏览器数据库的试卷习题内容")){
                indexedDB.deleteDatabase("quizii");
            }
            return;
        }
        // paper ids
        for(var paper of papers){
            const href = paper.querySelector("a.paper_name").href;
            console.log("load iframe of:"+ href);
            let iframeElement = openPaperInIframe(href, paper);
            await waitRemoved(iframeElement);
        };
    };

function openPaperInIframe(url,el){
    const ifrm = document.createElement('iframe');
    ifrm.setAttribute('width', el.clientWidth);

    //document.body.appendChild(ifrm); // to place at end of document

    el.parentNode.insertBefore(ifrm, el.nextElementSibling);

    // assign url
    ifrm.setAttribute('src',url);

    // 提取保存习题，并关闭iframe;
    const extractAndClose = ()=>extractAndSavePaper(ifrm.contentDocument,ifrm.contentWindow, ()=>ifrm.parentElement.removeChild(ifrm));
    // 自动开始下载
    ifrm.onload = ()=> ifrm.contentWindow.MathJax.Hub.Queue(extractAndClose);
    return ifrm;
}

function extractAndSavePaper(iframeDoc, iframeWin, callback){
    console.log("开始处理页面，。。。");
    //const paperTitle = iframeDoc.querySelector("div.paper_header #title").innerText;
    const g_paper = iframeWin.g_paper;
    const paperStoreName =  g_paper.name+"@"+g_paper._id;

    // 提取所有题目    // ct -> content; sn -> Serial Number
    let exerciseList = [...iframeDoc.querySelectorAll("div.item")]
        .map(qItem=>{return{
            "id": qItem.dataset.id,
            "ct":qItem.querySelector("q>ol>li").innerText.replace(/\s+/g,""),
            "pId":g_paper._id,
            "sn":qItem.querySelector("li").value,
            "pName":g_paper.name,
            "html":qItem.firstElementChild.outerHTML,
        };});

    openAndResetDB(iframeWin.indexedDB, paperStoreName)
        .onsuccess = (event)=>batchPutOrAdd(event.target.result, paperStoreName, exerciseList, callback);
}

// openAndResetDB(storeName).onsuccess = (event)=>?
function openAndResetDB(indexedDB, paperStoreName){
    //每次open都触发onupgradeneeded
    const openRequest = indexedDB.open("quizii", Date.now());
    openRequest.onerror = function(event) {
        console.error(event);
    };
    openRequest.onupgradeneeded = function(event) {
        // 新建数据库
        const db = event.target.result;

        const paperId = paperStoreName.substring(paperStoreName.lastIndexOf("@"));
        const oldStores = [...db.objectStoreNames].filter(n=>n.endsWith(paperId))
        // 先删除
        if(oldStores.length>0){
            console.log("清空了数据表："+oldStores.join("; "));
            oldStores.forEach(n=>db.deleteObjectStore(n))
        }
        // 再新建
        db.createObjectStore(paperStoreName, { keyPath: 'id' });
        console.log("新建了数据表："+paperStoreName);
    };
    return openRequest;
}
function batchPutOrAdd(db, paperStoreName, items, callback){
        const transaction = db.transaction(paperStoreName, "readwrite");
        const itemStore = transaction.objectStore(paperStoreName);
        putNext(0);
        if(callback){transaction.oncomplete = callback;}

        function putNext(i) {
            if (i<items.length) {
                itemStore.put(items[i]).onsuccess = ()=>putNext(i+1);
            } else { // complete
                console.log('重置或新建了'+items.length+"条数据到表："+paperStoreName);
            }
        }
}
function saveText(title, content){
    const link = document.createElement('a');
    link.download = (title + '.txt').replace(/[/\\?%*:|"<>\s]/g, '-');
    const blob = new Blob([content], { type: 'text/plain' });
    link.href = window.URL.createObjectURL(blob);
    link.click();
}

async function waitLoad(iframeDoc){
    console.log("正在等待载入试卷。。。");
    // 等待载入
    while(iframeDoc.readyState !== 'complete') {
        // console.log(document.querySelector(selector).innerHTML);
        await new Promise(r => setTimeout(r, 500));
    }
}
async function waitRemoved(iframeElement){
    console.log("正在等待载入试卷。。。");
    // 等待移除
    while(iframeElement.parentElement) {
        // console.log(document.querySelector(selector).innerHTML);
        await new Promise(r => setTimeout(r, 500));
    }
}
async function sleep(seconds){
    // sleep 10s
    console.log("等待"+seconds+"s");
    await new Promise(r => setTimeout(r, seconds*1000));
}

})();




// 第3个悬浮按钮，生成试卷
(function() {
    let newElement = document.createElement('div');
    newElement.innerHTML = '<div class="tampermonker-like-feedback_btn"  title="油猴脚本，批量生成试卷">生成试卷</div>';
    newElement = newElement.firstChild
    referenceElement.appendChild(newElement); // 插入到页面
    // 功能脚本
    newElement.onclick = function(){
        // 批量生成试卷
        let paperNameAndIdsList = prompt(`1. 输入 excel脚本 生成的结果，格式为：试卷名1,id,...id;...;
2. 输入 导出试卷 的内容，格式为：试卷id 试卷名 id ...`, "");
        if(paperNameAndIdsList.endsWith(" ;")){
            paperNameAndIdsList = paperNameAndIdsList.split(" ;")
                .map(s=>s.trim().split(" , ")).filter(a=>a.length>1);
        }else{
            paperNameAndIdsList = paperNameAndIdsList.split(/\s/g);
            // 按试卷名 重新分组，不包含试卷id
            const ids = paperNameAndIdsList.map(s=>/^[\da-f]{24}$/.test(s))
                .map((b,i)=>b?-2:i-1).filter(i=>i>-2);
            ids.push(paperNameAndIdsList.length);
            paperNameAndIdsList = ids.filter((_,i)=>i<ids.length-1).map((ind,i)=>paperNameAndIdsList.slice(ind+1,ids[i+1]));
        }
        batchGeneratePaper(paperNameAndIdsList);
    };
    // 生成试卷api
    function customGeneratePaper(callback,paper_name, ...idList){
        let item_list = idList.map(id=>{return {type:1001,subtype:1,difficulty:0,_id:id,"sources":[]}}).map(o=>JSON.stringify(o));
        let teaching_basic = {grade:3,textbook_ver:"",grade_cat: 0};
        qishi.http.post("/paper/generate",
                        {item_list:item_list,teaching_basic:JSON.stringify(teaching_basic),paper_name:paper_name},
                        function(data) {
            var id=data.tid;
            if(id){
                console.log("成功生成试卷："+qishi.util.make_url('/paper/'+id+'/edit'))
                callback();
            }else{
                console.log("试卷生成出错了:"+paper_name);
            }
        }
                       );
    }
    function batchGeneratePaper(paperNameAndIdsList){
        // 递归
        if (paperNameAndIdsList.length===0){alert("生成试卷完成。");return;}
        customGeneratePaper(
            ()=>setTimeout(()=>batchGeneratePaper(paperNameAndIdsList),5000),
            ...paperNameAndIdsList.shift()
        );
    }

})();


// 第4个悬浮按钮，导出试卷
(function() {
    let newElement = document.createElement('div');
    newElement.innerHTML = '<div class="tampermonker-like-feedback_btn"  title="油猴脚本，导出保存的试卷习题id">导出试卷</div>';
    newElement = newElement.firstChild
    referenceElement.appendChild(newElement); // 插入到页面
    // 功能脚本
    newElement.onclick = async function(){
        // 统一输出 试卷名和习题id，用于导入excel
        console.log("开始统一输出 试卷名和习题id，用于导入excel");
        const result=[]
        // 文件名 默认为 标签名，否则按时间命名
        const tagEl=document.querySelector("#select_tag > option[selected]");
        const filename = tagEl?tagEl.innerText:getDateFormat();
        readNameAndIdsFromDB((...arr)=>result.push(arr),
                             ()=>download(filename+".txt", result.map(arr=>arr.join("\t")).join("\n"))
                            );

    };

function readNameAndIdsFromDB(callback, callback2){
    const openRequest = indexedDB.open("quizii");
    openRequest.onerror = function(event) {
        console.error(event);
    };
    openRequest.onsuccess = (event)=>{
        const db = event.target.result;
        const dbNames = [...db.objectStoreNames];
        const transaction = db.transaction(dbNames, "readonly");
        dbNames.forEach(paperStoreName=>{
            const itemStore = transaction.objectStore(paperStoreName);
            itemStore.getAllKeys().onsuccess =(event)=>{
                callback(...paperStoreName.split("@").reverse(),...event.target.result)
            };
        });
        transaction.objectStore(dbNames[0])
            .getAllKeys()
            .onsuccess =callback2;
    }
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
function getDateFormat(){
    const d = new Date;
    return [d.getFullYear(), d.getMonth()+1,d.getDate(),
              d.getHours(),d.getMinutes(),d.getSeconds()].join('-');
}
})();


// 设置样式
(function (){
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `.myInjectContainer{
position: fixed;
top: 150px;
right: -1px;
width: 43px;
}
.tampermonker-like-feedback_btn{
width: 24px;
padding:9px;
border:1px solid #ccc;
border-top-left-radius: 4px;
border-bottom-left-radius: 4px;
background-color: #fff;
line-height: 16px;
font-size: 12px;
color: #666;
cursor: pointer;
z-index: 9999;
}
.tampermonker-like-feedback_btn:hover{
border-color: #1bbc9b;
background-position: center -48px;
background-color: #1bbc9b;
color: #fff;
}`;
    document.getElementsByTagName('head')[0].appendChild(style);
})();


// 悬浮按钮，导入已审
(function() {
    let newElement = document.createElement('div');
    newElement.innerHTML = '<div class="tampermonker-like-feedback_btn"  title="油猴脚本，导入已审核的习题-试卷列表">导入已审</div>';
    newElement = newElement.firstChild
    referenceElement.appendChild(newElement); // 插入到页面
    // 功能脚本
    newElement.onclick = loadLoadTxtFile;

    function loadLoadTxtFile() {
        const element = document.createElement('input');
        element.setAttribute('type', 'file' );
        element.setAttribute('multiple', 'multiple');
        element.setAttribute('downacceptload', 'text/plain');
        element.style.display = 'none';
        element.onchange=function(event) {
            const input = event.target;
            const reader = new FileReader();

            const texts =[]
            let ind =0;
            reader.onload =function(){
                // save ind result
                texts.push(reader.result);
                console.log("读取了文件："+input.files[ind].name);
                //  next ind
                ind = ind+1
                // read or end
                if(ind<input.files.length){
                    reader.readAsText(input.files[ind]);
                }else{
                    // 保存到indexedDB本地数据库
                    batchSaveToIndexedDB(
                        getEIdPIdsList(texts.join("\n"))
                    );
                }
            }
            reader.readAsText(input.files[ind]);
        };
   		element.onclick = function (){
            document.body.onfocus = function (){
                document.body.onfocus = null;
                // Cancel clicked
                setTimeout(()=>{
                    if(!element.files.length && confirm("是否清空保存到本地浏览器数据库的已审核习题id")){
                        indexedDB.deleteDatabase("quizii_已审核");
                        console.log("删除了数据表：quizii_已审核");
                    }
                }, 500);
             };
		};
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    function batchSaveToIndexedDB(items){
        console.log("请求打开 quizii_已审核 indexedDB ："+Date());
        const objectStoreName="已审核习题";// 数据表名
        // const openRequest = indexedDB.open("quizii_已审核", Date.now());//每次open都触发onupgradeneeded
        const openRequest = indexedDB.open("quizii_已审核");
        openRequest.onerror = function(event) {console.error(event);}; // 打开数据库失败
        // 新建数据表
        openRequest.onupgradeneeded = function(event) {
            console.log("开始更新 quizii_已审核 indexedDB ："+Date());
            // 新建数据库
            const db = event.target.result;
            if (db.objectStoreNames.contains(objectStoreName)) {
                // 先删除
                db.deleteObjectStore(objectStoreName);
                console.log("删除了数据表："+objectStoreName);
            }
            // 再新建
            db.createObjectStore(objectStoreName, { keyPath: 'id' });
            console.log("新建了数据表："+objectStoreName);
        };
        openRequest.onsuccess = function(event){
            // 批量保存数据
            const db = event.target.result;
            const transaction = db.transaction(objectStoreName, "readwrite");
            const itemStore = transaction.objectStore(objectStoreName);
            putNext(0);
            function putNext(i) {
                if (i<items.length) {
                    itemStore.put(items[i]).onsuccess = ()=>putNext(i+1);
                } else {
                    console.log('重置或新建了'+items.length+"条数据到表："+objectStoreName);
                    var countRequest = itemStore.count();
                    countRequest.onsuccess = function(event) {
                        alert('新增或覆盖了 '+items.length+" 道已审核的习题id到浏览器的本地数据库，共 "+event.target.result+ "条记录");
                    }
                }
            }
        }
    }

    function getEIdPIdsList(idsText){
        const m = new Map(); // "eID: sn@pName@pId;..."
        idsText.split("\n").forEach(p=>{
            const ids = p.split("\t");
            const pId = ids[1]+"@"+ids[0];
            for(let i=3;i<ids.length;i++){
                const eId = ids[i];
                if(m.has(eId)){
                    m.set(eId,m.get(eId)+";"+i+"@"+pId);
                }else{
                    m.set(eId,i+"@"+pId);
                }
            }
        });
        return [...m.entries()].map(arr=>{return{id:arr[0],pIds:arr[1]}});// map -> list
    }
})();
