// ==UserScript==
// @name         quizii上传试卷工具——补完试卷
// @namespace    http://tampermonkey.net/
// @version      2.2.2
// @description  预传试卷框架后，逐题更新
// @author       jin junwei
// @match        http://121.42.229.71:8200/overlook?q=*
// @match        http://121.42.229.71:8100/typesetting/item/*
// @match        http://121.42.229.71:8100/input/upload
// @match        http://121.42.229.71:8100/input/review/*
// @match        http://192.168.0.145:8200/overlook?q=*
// @match        http://192.168.0.145:8100/typesetting/item/*
// @match        http://192.168.0.145:8100/input/upload
// @match        http://192.168.0.145:8100/input/review/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/399830/quizii%E4%B8%8A%E4%BC%A0%E8%AF%95%E5%8D%B7%E5%B7%A5%E5%85%B7%E2%80%94%E2%80%94%E8%A1%A5%E5%AE%8C%E8%AF%95%E5%8D%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/399830/quizii%E4%B8%8A%E4%BC%A0%E8%AF%95%E5%8D%B7%E5%B7%A5%E5%85%B7%E2%80%94%E2%80%94%E8%A1%A5%E5%AE%8C%E8%AF%95%E5%8D%B7.meta.js
// ==/UserScript==

'use strict';

// upload页面，保存表单
(function() {
    if( !/\/input\/upload/.test(location.href) ){ return; }
    // 按钮的容器
    let referenceElement=document.querySelector("body > div.container > div.content > div.clearfix > form")

    // 悬浮按钮，保存表单
    let newElement = document.createElement('div');
    newElement.innerHTML = '<div class="btn btn-success" style="float:right;margin:0 -2em  0 0" title="油猴脚本，保存表单到浏览器">保存</div>';
    newElement = newElement.firstChild
    referenceElement.appendChild(newElement); // 插入到页面
    // 功能脚本
    newElement.onclick = async function() {
        await GM_setValue("uploadFormObj",{
            priority:document.querySelector("#priority").value,
            source_type:document.querySelector("#source_type").value,
            source_id:document.querySelector("#source_id").value
        });
        console.log("保存upload表单到浏览器")
    }

    // 悬浮按钮，载入表单
    newElement = document.createElement('div');
    newElement.innerHTML = '<div class="btn btn-success" style="float:right;margin:0 -8em  0 0" title="油猴脚本，从浏览器载入表单">载入</div>';
    newElement = newElement.firstChild
    referenceElement.appendChild(newElement); // 插入到页面
    // 功能脚本
    newElement.onclick = async function() {
        let uploadFormObj = GM_getValue("uploadFormObj");
        if( !uploadFormObj ){ alert("请先保存upload表单到浏览器");return;}

        for( let elId in uploadFormObj ){
            document.getElementById(elId).value = uploadFormObj[elId];
        }
        console.log("从浏览器载入upload表单");
    }

})();

// review页面，保存表单
(function() {
    if( !/\/input\/review\//.test(location.href) ){ return; }

    // 按钮的容器
    let referenceElement=document.querySelector("form > div > div:nth-child(15) > div");

    // 悬浮按钮，保存表单
    let newElement = document.createElement('div');
    newElement.innerHTML = '<div class="btn btn-success" style="margin:0 0 0 2em" title="油猴脚本，保存表单到浏览器">保存</div>';
    newElement = newElement.firstChild
    referenceElement.appendChild(newElement); // 插入到页面
    // 功能脚本
    newElement.onclick = async function() {
        let reviewFormList = [];
        // 试卷类型
        reviewFormList.push(["doc_type",document.querySelector("#doc_type").querySelector('input[name="type"]:checked').value]);
        // 下拉框
        let selectIds =["edu", "grade", "semester", "year", "month", "province", "city", "county", "school", "edition", "book"];
        selectIds.forEach( id=>reviewFormList.push([id, document.getElementById(id).value]) );
        // "单元信息"
        reviewFormList.push(["unit_info", document.getElementById("unit_info").value]);

        await GM_setValue("reviewFormList",reviewFormList);
        console.log("保存review表单到浏览器")
    }

    // 悬浮按钮，载入表单
    newElement = document.createElement('div');
    newElement.innerHTML = '<div class="btn btn-success" style="margin:0 0 0 1em" title="油猴脚本，从浏览器载入表单">载入</div>';
    newElement = newElement.firstChild
    referenceElement.appendChild(newElement); // 插入到页面
    // 功能脚本
    newElement.onclick = async function() {
        let reviewFormList = GM_getValue("reviewFormList");
        if( !reviewFormList ){ alert("请先保存review表单到浏览器");return;}

        for( let [id, value] of reviewFormList ){
            // 试卷类型
            if( id === "doc_type" ){
                document.getElementById(id).querySelector('input[value="'+value+'"]').click();
                continue
            }
            // 等待
            await new Promise(r => setTimeout(r, 300));
            let el = document.getElementById(id);
            document.getElementById(id).value=value;
            console.log(id+", "+value);
            // 下拉框
            if( el.tagName==="SELECT" ){
                $('#'+id).change();
            }
        }
        console.log("从浏览器载入review表单");
    }

    function getElementPath(el){
        const names = [];
        while (el.parentNode){
            if( el.tagName==="BODY" ){
                names.unshift(el.tagName);
                break;
            }else if (el.id){
                names.unshift('#'+el.id);
                break;
            }else{
                if (el==el.ownerDocument.documentElement) names.unshift(el.tagName);
                else{
                    for (var c=1,e=el;e.previousElementSibling;e=e.previousElementSibling,c++);
                    names.unshift(el.tagName+":nth-child("+c+")");
                }
                el=el.parentNode;
            }
        }
        return names.join(" > ");
    }
})();


// http://121.42.229.71:8200/overlook?q=
(function() {
    if( !/\/overlook\?q=/.test(location.href) ){ return; }
    // 检查 id重题
    let qEls = [...document.querySelectorAll("q")];
    let qIds = qEls.map( qEl=>qEl.id );
    let j=-1
    for( let i in qIds ){
        j = qIds.indexOf(qIds[i], i+1);
        if( j>-1 ){
            alert("发现id相同的习题，进入聚类系统修改")
            qEls[j].parentElement.nextElementSibling.firstElementChild.click()
            return;
        }
    }
    if( !document.querySelector("#book-content").textContent.includes("【预传习题】") ){ return; }

    // 悬浮按钮的容器
    let referenceElement=function (referenceElement){
        let newElement = document.createElement('div');
        newElement.innerHTML = '<span></span>';
        newElement = newElement.firstChild
        // 插入元素
        referenceElement.parentElement.insertBefore(newElement, referenceElement.nextElementSibling);
        return newElement;
    }(document.querySelector('#item-status-stats'));

    // 预传习题数
    const total=qEls.length;
    const count = qEls.filter(qEl=>qEl.textContent.includes("【预传习题】")).length;
    // 悬浮按钮，导入补完试卷
    let newElement = document.createElement('div');
    newElement.innerHTML = '<div class="btn btn-success btn-sm"  title="油猴脚本，导入预测试卷对应的补完文件，*.quizii补完.json.txt">补完试卷 '+count+"/"+total+'</div>';
    newElement = newElement.firstChild
    referenceElement.appendChild(newElement); // 插入到页面
    // 功能脚本
    newElement.onclick = onclick;

    async function onclick() {
        async function waitTabFocus(){
            await new Promise(r => setTimeout(r, 2000));
            while(!document.hasFocus()) {
                await new Promise(r => setTimeout(r, 200));
            }
        }
        // 习题列表
        const exElementList = [...document.querySelectorAll("q")]

        // 逐题修改习题
        let isFirst=true
        for(let i=0; i<exElementList.length; i++){
            let exEl = exElementList[i]
            if(exEl.innerText.includes("【预传习题】")){
                let search = "?total="+exElementList.length+"&idx="+i+"&pId="+location.search.split("q=")[1].split("&")[0];
                if (isFirst){
                    search = search + "&load=true";
                    isFirst=false;
                }

                let href = exEl.parentElement.nextElementSibling.children[1].href+search;
                let iframeElement = openInNewTab(href);

                await waitTabFocus();
            }
        }
    }

    function openInNewTab(url) {
        var win = window.open(url, '_blank');
        win.focus();
    }
})();


// http://121.42.229.71:8100/typesetting/item/*
// 导入"*.quizii补完.json.txt"
(function() {
    if( !/\/typesetting\/item\//.test(location.href) ){return;}
    if( !location.search && Date.now()<GM_getValue("closeBefore", 0) ){ GM_setValue("closeBefore", 0); close(); return; }
    if( !location.search.startsWith("?total=") ){return;}

    if( document.getElementById("show-dups") ){
        insertButtonPreviewFirstSimilarity();
    }
    insertButtonSubmitAndClose()

    const idx = parseInt(location.search.split("idx=")[1].split("&")[0]);
    const total = parseInt(location.search.split("total=")[1].split("&")[0]);
    const pId = location.search.split("pId=")[1].split("&")[0];

    if(location.search.indexOf("load=true")>-1){
        const element = openFileInput(idx,total,pId);
        element.click();
        //document.body.removeChild(element);
        return
    }else{
        const exData = checkAndGetExData(idx, total, pId);
        updateEx(exData);
    }

    function checkAndGetExData(idx, total, pId){
        const paperData = JSON.parse(localStorage.getItem("paperData"));
        // check, todo
        if(paperData.pId!==pId){
            alert("试卷id不一致，请重新载入*.quizii补完.json.txt文件！");
            return;
        }
        if(paperData.exDataList.length!==total){
            alert("习题总数不一致，请检查习题数！");
            return;
        }
        console.log("读取了试卷习题数据，pId="+paperData.pId+"; 保存time="+Date(paperData.time))

        const exData = paperData['exDataList'][idx];
        return exData;
    }

    function getImageDict(question_html){
    }

    async function updateEx(exData) {
        while(!editor || !editor.edit.doc.body.innerText.includes("【预传习题】")) {
            await new Promise(r => setTimeout(r, 300));
        }
        const previewEl = document.querySelector("#preview");
        while(previewEl.disabled) {
            await new Promise(r => setTimeout(r, 200));
        }
        // await waitElementCreated(editor.edit.doc, "q");

        // 按顺序替换图片
        const imgEls = [...document.querySelectorAll("#q-preview img")];
        let exString = JSON.stringify(exData);
        let count = 0;
        exString=exString.replace(/【预传图片\-(\d+)\-?(\d+)?】\//g, (match, ind, width)=>{
            count += 1;
            let imgEl = imgEls[ind];
            if( width ){
                imgEl.style["width"]=width+"px";
                imgEl.width=width;
            }
            let imgHtml = JSON.stringify(imgEl.outerHTML);
            return imgHtml.substring(1, imgHtml.length-1);
        });
        if( imgEls.length!==count ){alert("图片个数不一致");return;}
        exData=JSON.parse(exString);


        // 解答题 题干
        const stemEl = editor.edit.doc.querySelector("q > div > stem")
        if(stemEl){stemEl.innerHTML = exData.stem;}

        const subqEls = [...editor.edit.doc.querySelectorAll("q subq")];
        if(subqEls.length!==exData.qs.length){alert("问题个数不一致！");return;}
        subqEls.forEach((subqEl,i)=>{
            const qData = exData.qs[i];

            // 选择题、填空题、子问题 题干
            const subStemEl =subqEl.querySelector("stem");
            if(subStemEl){subStemEl.innerHTML = qData.desc;}

            // 选择题，选项
            const subOptEls = [...subqEl.querySelectorAll("opt")];
            if(subOptEls.length!==qData.opts.length){alert("选项个数不一致！");return;}
            subOptEls.forEach((el,j)=>{
                // 清理多余的选项内容
                [...el.childNodes].slice(2).forEach(el=>el.remove())
                el.childNodes[1].innerHTML=qData.opts[j];
            });

            // 答案、解析
            aeditors[i].edit.doc.body.innerHTML = qData.ans;
            eeditors[i].edit.doc.body.innerHTML = qData.exp;
        });

        const btnEl = document.querySelector("#preview");
        // const btnEl = document.querySelector("#submit");
        while(btnEl.disabled) {
            await new Promise(r => setTimeout(r, 200));
        }
        btnEl.click();
        btnEl.disabled = true;

        // 完成后关闭页面
        console.log("等待保存完成，并且关闭页面")
        while(btnEl.disabled) {
            await new Promise(r => setTimeout(r, 200));
        }
        // close();
    }


    function insertButtonSubmitAndClose(){
        const liEl = document.createElement('li');
        const element = document.createElement('a');
        element.innerText="保存并关闭"
        liEl.appendChild(element)

        let paperEl = document.querySelector("#typesetting_pager > li:nth-child(2)")
        if (!paperEl){
            paperEl = document.querySelector("#typesetting_pager > li:nth-child(1)")
        }
        paperEl.parentElement.insertBefore(liEl, paperEl.nextElementSibling);

        element.onclick = async function (){
            const btnEl = document.querySelector("#submit");
            btnEl.click();
            GM_setValue("closeBefore", Date.now()+3000); // 载入新页面时关闭
            // 小标题的最后一题不会自动刷新页面
            setTimeout(close, 200);
        };

        return element
    }

    function insertButtonPreviewFirstSimilarity(){
        const liEl = document.createElement('li');
        const element = document.createElement('a');
        element.innerText="复制并预览首个相似题"
        liEl.appendChild(element)

        let paperEl = document.querySelector("#typesetting_pager > li:nth-child(2)")
        if (!paperEl){
            paperEl = document.querySelector("#typesetting_pager > li:nth-child(1)")
        }
        paperEl.parentElement.insertBefore(liEl, paperEl.nextElementSibling);

        element.onclick = previewFirstSimilarity;

        return element
    }

    async function waitElementCreated(parentEl, selector){
        let el;
        while(!(el=parentEl.querySelector(selector))) {
            // console.log(document.querySelector(selector).innerHTML);
            await new Promise(r => setTimeout(r, 100));
        }
        return el
    }

    function previewFirstSimilarity() {
        let qEl = document.querySelector("#q-dups q");
        if( !qEl ){
                alert("请点击左下角的Similarities按钮")
                return;
        }
        qEl = qEl.cloneNode(true)

        // mathjax unrender
        qEl.querySelectorAll(".MathJax").forEach(el=>el.remove());
        qEl.querySelectorAll("script")
                .forEach(el=>el.innerText = "\\( "+htmlEntities(el.innerText) +" \\)")

        editor.html(qEl.outerHTML);
        for (var i = 0; i < qnum; ++i) {
            let subqEl = qEl.querySelectorAll("subq")[i]
            if( subqEl.querySelector(".answer .dd") ){
                aeditors[i].html(subqEl.querySelector(".answer .dd").innerHTML);
            }
            if( subqEl.querySelector(".exp .dd") ){
                    eeditors[i].html(subqEl.querySelector(".exp .dd").innerHTML);
            }
        }

        qEl=undefined;
        document.querySelector("#preview").click()

    };
    function htmlEntities(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function openFileInput(idx, total, pId){
        const element = document.createElement('input');
        element.setAttribute('type', 'file' );
        element.setAttribute('accept', '.json.txt');
        //element.style.display = 'none';
        //document.body.appendChild(element);
        let paperEl = document.querySelector("#mathright > h4 > div.pull-right > span");
        if( !paperEl ){
            let parerName = prompt( "无法获取习题所在试卷的名称，请手动输入" );
            // 插入试卷名称
            paperEl=document.querySelector("#mathright > h4 > div.pull-right");
            paperEl.innerHTML='<span class="label label-success">'+parerName+'</span>';
            paperEl=paperEl.firstElementChild;
        }
        paperEl.parentElement.insertBefore(element, paperEl.nextElementSibling);

        const filename = paperEl.innerText + ".quizii补完.json.txt"
        GM_setClipboard(filename); // 复制文件名到粘贴板

        element.onchange = function (event) {
            if(filename !== event.target.files[0].name) {
                alert("文件名不匹配，请导入："+filename);
                return;
            }

            const reader = new FileReader();
            reader.readAsText(event.target.files[0]);
            reader.onload = function(event){
                // 习题列表
                console.log("读取了文件："+filename);
                const exDataList = JSON.parse(event.target.result);

                // 拆分解答题的子问题
                exDataList.filter(o=> o.type===1003 )
                    .forEach(splitSubq)
                console.log("拆分了解答题的子问题");

                // 保存到localStorage
                localStorage.setItem("paperData", JSON.stringify({pId:pId, time:Date.now(), exDataList:exDataList}));
                console.log("exDataList保存到了localStorage的paperData");

                // callback
                const exData = checkAndGetExData(idx, total, pId);
                updateEx(exData);
            }
        };

        return element
    }
    function splitSubq(exObj){
        // 拆分子问题（1）...（2）...
        let preQObj = exObj.qs[0];
        exObj.qs.length = 0;
        let i = 1;
        while(true){
            let separator = "（"+(i++)+"）";
            if(preQObj.desc.indexOf(separator)<0){
                if(exObj.qs.length === 0){exObj.qs.push(preQObj);}
                return exObj;
            }

            let qObj = {desc:"", ans:"", exp:"",opts:[],context:""};
            [preQObj.desc, qObj.desc] = splitOnce(preQObj.desc, separator);
            [preQObj.ans, qObj.ans] = splitOnce(preQObj.ans, separator);
            [preQObj.exp, qObj.exp] = splitOnce(preQObj.exp, separator);

            // 防止丢失不规范的内容
            if( exObj.qs.length === 0 ){
                if( qObj.exp.length ===0 ) {
                    qObj.exp = preQObj.exp
                }
                if( qObj.ans.length ===0 ) {
                    qObj.ans = preQObj.ans
                }
            }

            exObj.qs.push(qObj);
            preQObj = qObj
        }
    }
    function splitOnce(str, separator){
        let splitAt = str.indexOf(separator);
        if (splitAt===-1){return [str, ""];}

        return [str.substring(0,splitAt), str.substring(splitAt+separator.length)];
    }

})();
