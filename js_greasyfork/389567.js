// ==UserScript==
// @name         quizii组卷查重工具——试卷审核
// @namespace    http://jz.quizii.com/
// @version      0.4.3
// @description  查重流程：1. 先在“练习箱”页面选择需比对的试卷并“保持试卷”；2. 再在需排重的试卷编辑页面“重题审核”
// @author       JinJunwei
// @match        http://jz.quizii.com/*/paper/*/edit
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389567/quizii%E7%BB%84%E5%8D%B7%E6%9F%A5%E9%87%8D%E5%B7%A5%E5%85%B7%E2%80%94%E2%80%94%E8%AF%95%E5%8D%B7%E5%AE%A1%E6%A0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/389567/quizii%E7%BB%84%E5%8D%B7%E6%9F%A5%E9%87%8D%E5%B7%A5%E5%85%B7%E2%80%94%E2%80%94%E8%AF%95%E5%8D%B7%E5%AE%A1%E6%A0%B8.meta.js
// ==/UserScript==


// 悬浮按钮的容器
let referenceElement=(function (referenceElement){
    let newElement = document.createElement('div');
    newElement.innerHTML = '<div class="myInjectContainer" ></div>';
    newElement = newElement.firstChild
    // 定位
    newElement.style.top = referenceElement.offsetTop+ referenceElement.offsetHeight+"px";
    // 插入元素
    referenceElement.parentElement.insertBefore(newElement, referenceElement.nextElementSibling);
    return newElement;
})(document.querySelector('div#feedback_btn'));


// 悬浮按钮，修改习题
(function() {
    let newElement = document.createElement('div');
    newElement.innerHTML = '<div class="myInject" title="油猴脚本，先选择习题，再打开修改习题页面" >修改习题</div>';
    newElement = newElement.firstChild;
    referenceElement.appendChild(newElement); // 插入到页面
    // 功能脚本
    newElement.onclick = function(){
        //打开修改习题页面
        const qElement = document.querySelector("div.item.active");
        if(!qElement){
            alert('复制习题id失败，请先选中习题。');
            return;
        }
        //const qId =qElement.dataset.id; //添加题或更改题，这个字段需要刷新才是准确的。
        const qId = qElement.querySelector("q").id;
        // 需要考虑习题被聚类的情况，不能直接打开习题修改页面
        // const url = "http://121.42.229.71:8200/item/"+qId+"/typesetting";
        const url = "http://121.42.229.71:8200/items/search?id="+qId;
        openInNewTab(url);
    };
    function openInNewTab(url) {
        var win = window.open(url, '_blank');
        win.focus();
    }
})();



// 悬浮按钮，重题审核
(function() {
    let newElement = document.createElement('div');
    newElement.innerHTML = '<div class="myInject" title="油猴脚本，从本地数据库载入习题文本，需要先在‘练习箱’页面保存" >重题审核</div>';
    newElement = newElement.firstChild
    referenceElement.appendChild(newElement); // 插入到页面
    // 功能脚本, MathJax渲染完成后再运行
    newElement.onclick = ()=>{
        activeMap();
        newElement.innerText = "排重开始";
        MathJax.Hub.Queue(matchTotalPaper); // 排重 + 已审核
    };

    function activeMap(){
        if(document.querySelector("#map.active")){return;}
        document.querySelector("#map").nextElementSibling.click();
    }
    function matchTotalPaper(){
        const counterIndex = new CounterIndex();

        let paperTitle = document.querySelector("#paper_name_input").value; // 可以临时修改试卷名，而不保存
        if(!paperTitle){
            paperTitle = g_paper.name;
        }

        let prefix = ""
        if(paperTitle.split(/[_-]/).length>1){
            prefix = paperTitle.split(/[_-]/)[0];
        }else{
            prefix = paperTitle.substring(0,4);// 默认比对同章节号的习题，如1301
        }
        console.log("查重的试卷前缀为："+prefix);

        let callback = items=>console.log(items);

        // 按前缀读取数据库， 排重
        readAllStore(prefix, g_paper._id,
                     (data)=>counterIndex.extend(data),
                     ()=>{
            matchPaper(counterIndex);
            newElement.innerText = "排重完成";
            newElement.title="油猴脚本，点击习题，按共同字符数进行匹配，当前比对的习题数："+counterIndex._objectList.length
                         }
        );
    }
    function readAllStore(prefix, excludePaperId,onsuccessOfStore, oncompleteOfTransaction){
        // 不触发onupgradeneeded
        const openRequest = window.indexedDB.open("quizii"); // quizii组卷查重工具——试卷管理
        openRequest.onerror = function(event) {console.error(event);};
        openRequest.onsuccess = function (event) {
            const db = event.target.result;
            const names = [...db.objectStoreNames].filter(n=>n.startsWith(prefix) && !n.endsWith(excludePaperId));
            if(names.length===0){
                oncompleteOfTransaction();
                return;
            }
            const transaction = db.transaction(names);
            for(let storeName of names){
                transaction.objectStore(storeName).getAll().onsuccess = function(event) {
                    console.log("从表‘"+storeName+"’中读取了"+event.target.result.length+"条数据");
                    onsuccessOfStore(event.target.result);
                };
            }
            transaction.oncomplete = oncompleteOfTransaction;
        }
    }
    function matchPaper(counterIndex){
        // 检查 解答和考点 是否显示
        if(document.querySelector("div.item div.answer[style='display: block;']") || document.querySelector("div.item div.q_tags[style='display: block;']")) {
            alert("请隐藏解答和考点后重试");
            return;
        }

        console.log("开始处理页面，。。。");
        // 提取所有题目    // ct -> content; sn -> Serial Number
        let exerciseList = [...document.querySelectorAll("div.item")]
        .map(qItem=>{return{
            //"id": qItem.dataset.id,//添加题或更改题，这个字段需要刷新才是准确的。
            "id": qItem.querySelector("q").id,
            "ct":qItem.querySelector("q>ol>li").innerText.replace(/\s+/g,""),
            "pId":g_paper._id,
            "sn":qItem.querySelector("li").value,
            "pName":g_paper.name,
            "html":qItem.firstElementChild.outerHTML,
        };});
        // 将当前试卷合并到counterIndex
        counterIndex.extend(exerciseList);

        const resultList = [];
        exerciseList.forEach((q)=>{
            console.log("开始匹配id："+q.id);
            console.log(q.ct);

            let result = counterIndex.getSameId(q); // 先按id判重
            if (result){
                resultList.push([q, ...result]);
            }else{
                result = counterIndex.getNearDups(q,0.8,2); // 再按共同字符数判断
                if(result){
                    resultList.push([q, ...result]);
                }
            }

            console.log("匹配结果：");
            console.log(result?result.map(o=>o.similarity+", "+o.ct).join("\n"):"");
        });
        // 插入相似度标记
        const mapEls = document.querySelectorAll("#paper_map_wrap a")
        const qEls = document.querySelectorAll("div.paper_body div.item");
        resultList.forEach(qs=>{
            // 题号列表
            const el = mapEls[qs[0].sn-1];
            setOnMouseOver(el,qs);
            el.style.backgroundColor=getColor(qs[1].similarity);
            // 习题前
            insertSimilarityElement(qs,qEls[qs[0].sn-1]);
        });
        // 插入已审核标记
        markAllChecked(exerciseList,qEls);
    }
    function markAllChecked(qObjs,qEls){
        //quizii组卷查重工具——试卷管理
        const objectStoreName="已审核习题";// 数据表名
        const openRequest = indexedDB.open("quizii_已审核");
        openRequest.onerror = function(event) {console.error(event);}; // 打开数据库失败
        openRequest.onsuccess = function(event){
            // 批量保存数据
            const db = event.target.result;
            const transaction = db.transaction(objectStoreName);
            const itemStore = transaction.objectStore(objectStoreName);
            checkNext(0);
            function checkNext(i) {
                if (i<qObjs.length) {
                    const qObj = qObjs[i];
                    const getRequest = itemStore.get(qObj.id);
                    getRequest.onsuccess = function(event){
                        insertCheckedElement(qObj, event.target.result?event.target.result.pIds:"", qEls[qObj.sn-1]);
                        checkNext(i+1);
                    };
                } else { console.log('重置或新建了'+qObjs.length+"条数据到表："+objectStoreName);}
            }
        }
    }
    function insertCheckedElement(qObj,pIds, qItem){
        const qs =[qObj];
        if(pIds){qs.push(...pIds.split(";").map(p=>p.split("@")).map(p=>{return{id:qObj.id,pId:p[2],pName:p[1],sn:p[0]}}));}

        const newElement = createElement(qs);
        setOnMouseOver(newElement,qs);
        qItem.insertBefore(newElement,qItem.children[2]);
        function createElement(qObjs){
            let newElement = document.createElement('div');
            // item_drag.js会导致点击失效, 使用悬浮显示
            if(qObjs.length>1){
                newElement.innerHTML = '<span class="myInject-checkd" style="color:green" title="油猴脚本，停留1s显示已审核的习题">已</span>';
            }else {
                newElement.innerHTML = '<span class="myInject-checkd" style="color:red"  title="油猴脚本，停留1s显示未审核的习题">未</span>';
            }
            return newElement.firstChild;
        }
    }
    function insertSimilarityElement(qs,qItem){
        const newElement = createElement(qs);
        setOnMouseOver(newElement,qs);
        qItem.insertBefore(newElement,qItem.children[2]);
        function createElement(qObjs){
            let newElement = document.createElement('div');
            // item_drag.js会导致点击失效
            const maxSimilarity=qObjs[1].similarity;
            if(maxSimilarity>1){
                newElement.innerHTML = '<span class="myInject2" style="color:'+getColor(maxSimilarity)+'" title="油猴脚本，停留1s显示id重复的习题">重</span>';
            }else {
                newElement.innerHTML = '<span class="myInject2" style="color:'+getColor(maxSimilarity)+'"  title="油猴脚本，停留1s显示字符相似的习题">似</span>';
            }
            return newElement.firstChild;
        }
    }
    function getColor(similarity){
        if(similarity>1){ // id相同
            return "red";
        }else if(similarity>0.9){
            return "orange";
        }else if(similarity>0.7){
            return "yellow";
        }else{
            return "green";
        }
    }
    function setOnMouseOver(el, qObjs){
        // over 1 seconds
        let myTimeout;
        el.onmouseover=()=>{myTimeout = setTimeout(()=>{createModal(qObjs)}, 1000);};
        el.onmouseout=()=> clearTimeout(myTimeout);
    }
    function createModal(qObjs){
        // div.myModal
        let newElement = document.createElement('div');
        newElement.className = "myModal";
        document.body.appendChild(newElement);
        newElement.onclick=(event)=>{if(event.target===newElement){newElement.parentElement.removeChild(newElement);}};
        // div.myModal-content list
        newElement.innerHTML = '<div class="myModal-content">'+
                qObjs.map(qObj=>createExerciseElement(qObj)).join("")
                +'</div>';
        function createExerciseElement(qObj){
            if(qObj.html && !qObj.similarity){ // 第1个，当前题目
                return qObj.html;
            }
            const href = "../"+qObj.pId+"/edit#"+qObj.id;
            let html = '<a onclick="window.open(\''+href+'\',\'_blank\')" title="油猴脚本，点击查看试卷中的习题">'+qObj.pName+'</a>'
            const ind = html.indexOf(">")+1;
            if(qObj.hasOwnProperty("similarity")){
                html = html.slice(0,ind)+'&nbsp;相似度'+Math.round(qObj.similarity*100)+"%@"+ html.slice(ind);
            }else if(qObj.hasOwnProperty("sn")){
                html = html.slice(0,ind)+'&nbsp;第'+qObj.sn+"题%@"+ html.slice(ind)+"<br/>";
            }
            if(qObj.hasOwnProperty("html")){
                html = html+qObj.html;
            }
            return html;
        }
    }
    class Counter {
        // constructor
        constructor(myString) {
            const counts = {};
            myString.split('').map(ch=>ch.charCodeAt(0))
                .map(function(code) {
                counts[code] = (counts[code] || 0) + 1;
            });
            this.codes = Object.keys(counts).sort();
            this.nums = this.codes.map(code=>counts[code]);
            this.len=this.codes.length;
        }
        getCommon(counter2){
            let j=0, commons={};
            for(let i in this.codes){
                while(counter2.codes[j]<this.codes[i]){
                    if(++j>=counter2.len){
                        return commons;
                    }
                }
                if(counter2.codes[j]===this.codes[i]){
                    let commonChar = String.fromCharCode(this.codes[i]);
                    let commonNum = Math.min(counter2.nums[j],this.nums[i]);
                    commons[commonChar] = commonNum;
                }
            }
            return commons;
        }
    }
    class CounterIndex {
        // constructor
        constructor(objectList) {
            // objectList=[{id:"",content:""},...]
            this._objectList = [];
            this._idList = []; // pId-qId
            this._counterList = [];
            this._lenList = [];
            if(objectList){
                this.extend(objectList);
            }
        }
        extend(objectList){
            // objectList=[{id:"",ct:"","sn":""},...]
            console.assert("id" in objectList[0], "数据对象必须包含‘id’字段");
            console.assert("ct" in objectList[0], "数据对象必须包含‘ct’字段"); // content
            console.assert("pId" in objectList[0], "数据对象必须包含‘pId’字段"); // paper id
            console.assert("pName" in objectList[0], "数据对象必须包含‘pName’字段"); // paper name
            console.assert("sn" in objectList[0], "数据对象必须包含‘sn’字段"); // Serial Number
            console.assert("html" in objectList[0], "数据对象必须包含‘html’字段"); // outerHTML

            this._objectList.push(...objectList);
            this._idList.push(...objectList.map(a=>a.id));
            this._counterList.push(...objectList.map(a=>a.ct).map(s=>new Counter(s)));
            this._lenList.push(...objectList.map(a=>a.ct.length));
        }
        getSameId(qObj){
            //const o = this._objectList[this._idList.indexOf(id)];
            const r = this._objectList.find(q=>q.id===qObj.id && q.pId!==qObj.pId );
            if(!r){
                return null;
            }
            return [this._clone(r, 2)]; // 2 -> same id
        }
        getNearDups(qObj, threshold, minNum){
            const c1 = new Counter(qObj.ct);
            const l1 = qObj.ct.length;

            const lcs = this._counterList.map(
                (c2,i)=>[this._lcslen(c1,c2)/Math.max(l1,this._lenList[i]),i]
            );
            const result = []
            lcs.sort((a,b)=>b[0]-a[0]).forEach(([s,i])=>{
                const q = this._objectList[i];
                if(q.id===qObj.id && q.pId===qObj.pId){// 排除自身
                    return;
                }
                if((result.length>=minNum)&&(s<threshold)){// 过滤, 最少个数
                    return;
                }
                result.push(this._clone(q, s));
            });
            return result.length?result:null;
        }
        _lcslen(c1,c2){
            return Object.values(c1.getCommon(c2)).reduce((a, b) => a + b, 0)
        }
        _clone(obj,similarity) {
            const copy = {similarity:similarity};
            for (const attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
            }
            return copy;
        }
    }
})();



// 悬浮按钮，按id换题
(function() {
    let newElement = document.createElement('div');
    newElement.innerHTML = '<div class="myInject" title="油猴脚本，先选择习题，输入新题id，新题和旧题的子问题数必须相同" >按id换题</div>';
    newElement = newElement.firstChild;
    referenceElement.appendChild(newElement); // 插入到页面
    // 功能脚本
    newElement.onclick = function(){
        //按id换题，在手动换题时，有时候会遇到不显示收藏的习题的bug
        const oldItem = document.getElementById(PaperModel._item.item_id)
        const oldText = oldItem.firstElementChild.firstElementChild.value+". "+oldItem.innerText.substring(0,20);
        let newId = prompt(oldText.replace(/\n/g,"")+"\n请输入需要替换的习题id", "");
        if (/[\da-f]{24}/.test(newId)){ // 校验 id格式
            PaperModel._item.item_id = newId;
            let sub_qs_count = localStorage.getItem(newId);
            if(sub_qs_count){
                PaperModel._item.sub_q=PaperModel.get_sub_qs_by_new_item(sub_qs_count, PaperModel._item.q_score);
            }
            // 新题和旧题的子问题数必须相同
            PaperModel.save_item();
            setTimeout(window.location.reload.bind(window.location), 500);
        }else{
            alert(newId+"\n当前输入不是习题id格式！")

        }
    };
    function openInNewTab(url) {
        var win = window.open(url, '_blank');
        win.focus();
    }
})();



// 悬浮按钮，保留1,4,..
//危险屏蔽
(function() {
    let newElement = document.createElement('div');
    newElement.innerHTML = '<div class="myInject" title="油猴脚本，隔三保留习题1,4,7,..." >保留1,4,..</div>';
    newElement = newElement.firstChild
    // referenceElement.appendChild(newElement); // 插入到页面
    // 功能脚本
    newElement.onclick = function(){
        if(confirm("是否隔三保留习题，如1,4,7,10, ...")){
            // 保留习题1,4,7...
            // http://jz.quizii.com/math/static/js/edit.js?v=dbc8a39f3252c30e3ab63c654d8e1f05
            PaperModel.paper_parts[0]=PaperModel.paper_parts[0].filter((e,i)=>i%3===0);
            PaperModel.save_item();
            location.reload();
        }
    };
})();



// 悬浮按钮，重新排序,..
//危险屏蔽
(function() {
    let newElement = document.createElement('div');
    newElement.innerHTML = '<div class="myInject" title="油猴脚本，按题型与难度排序" >重新排序</div>';
    newElement = newElement.firstChild
    // referenceElement.appendChild(newElement); // 插入到页面
    // 功能脚本
    newElement.onclick = function(){
        //if(confirm("是否按题型和难度排序")){
            // 用于批量组卷后，按题型与难度排序
            sortByTypeAndDiff(PaperModel)
        //}
    };

    function sortByTypeAndDiff(paperModel, part_index) {
        // 批量组卷后，按题型与难度排序
        part_index = part_index?part_index:0;
        if(part_index>=paperModel.paper_parts.length){
            //刷新页面
            location.reload();
            return;
        }
        const part = paperModel.paper_parts[part_index];
        const arr = Array.from(Array(part.length).keys())
        .sort((a, b) => _sortByTypeAndDiff(part[a],part[b]));
        paperModel.update_part({'sort': arr}, part_index)
        // 下一个part
        setTimeout(()=>sortByTypeAndDiff(paperModel, part_index+1), 500)

        function _sortByTypeAndDiff(a,b){
            return 100*(a.data.type - b.data.type)+a.data.difficulty - b.data.difficulty;
        }
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
.myInject{
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
.myInject:hover{
border-color: #1bbc9b;
background-position: center -48px;
background-color: #1bbc9b;
color: #fff;
}
.myInject2 {
    width: 16px;
    height: 16px;
    display: inline-block;
    position: absolute;
    top: 42px;
    left: -20px;
    text-align: center;
}
.myInject-checkd {
    width: 16px;
    height: 16px;
    display: inline-block;
    position: absolute;
    top: 24px;
    left: -20px;
    text-align: center;
}
/* The Modal (background) */
.myModal {
  display: block; /* show by default */
  position: fixed; /* Stay in place */
  z-index: 1000; /* Sit on top */
  padding-top: 90px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  margin: auto;
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

/* Modal Content */
.myModal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 5px; /* Location of the box */
  border: 1px solid #888;
  width: 610px;
}`;
    document.getElementsByTagName('head')[0].appendChild(style);
})();