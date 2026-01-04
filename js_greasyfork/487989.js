// ==UserScript==
// @name         luogu 插件集合
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  非常好的 luogu 插件集合
// @author       konyakest
// @license      MIT
// @match        https://www.luogu.com.cn/problem/*
// @match        https://www.luogu.com.cn/paste/*
// @match        https://www.luogu.com.cn/training/*
// @match        https://www.luogu.com.cn/
// @match        https://api.loj.ac/
// @icon         https://fecdn.luogu.com.cn/luogu/logo.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/487989/luogu%20%E6%8F%92%E4%BB%B6%E9%9B%86%E5%90%88.user.js
// @updateURL https://update.greasyfork.org/scripts/487989/luogu%20%E6%8F%92%E4%BB%B6%E9%9B%86%E5%90%88.meta.js
// ==/UserScript==

/*
- 浏览记录
- 显示代码长度
- 简要题面
- 首页暂存内容
- 卷题情况
- 测试用例
- 显示今日AC
*/

const PASTEID = undefined/*请自行设置，如"eyb488k7"*/;
const TRAINING_ID = undefined/*请自行设置，如100，**必须是团队作业题单，且您必须有题单的编辑权限***/;

function URLmatch(pat){
    return Boolean(window.location.href.match(pat));
}

async function 显示代码长度(){
    const ENABLE_CACHE = true;
    /*
    ENABLE_CACHE：是否使用缓存（缓存即将获取的结果存下来，下一次直接使用）
    根据代码长度判定颜色的方案可以自行修改 makeColoredTextBySize 中的内容，我相信这部分是可以直接看懂的(*´▽｀)ノノ
    */

    function getMid(lst){
        // console.log(lst);
        return (function(x){
            if(x<1024){
                return x+" B";
            }
            return (x/1024).toFixed(2)+" K";
        })(lst[Math.floor(lst.length/2)]);
    }

    function makeColoredText(color,text){
        return `
        <a data-v-0640126c="" data-v-beeebc6e=""
            colorscheme="default" class="color-default" data-v-b5709dda="">
                <span data-v-71731098="" data-v-beeebc6e="" class="lfe-caption"
                    style="background: ${color}; color: rgb(255, 255, 255);" data-v-0640126c="">${text}
                </span>
        </a>
        `
    }

    let colors = {
        red:     "rgb(254,76,97)",
        orange:  "rgb(243,156,17)",
        yellow:  "rgb(255,193,22)",
        green:   "rgb(82,196,26)",
        blue:    "rgb(52,152,219)",
        purple:  "rgb(157,61,207)",
        black:   "rgb(14,29,105)"
    };

    function makeColoredTextBySize(size,text){
        size = size.split(' ');
        size = Number(size[1]==="K"?size[0]*1024:size[0]);
        const K = 1024;
        if(size <= 1*K) return makeColoredText(colors.yellow,text);
        if(size <= 2*K) return makeColoredText(colors.green,text);
        if(size <= 3*K) return makeColoredText(colors.blue,text);
        if(size <= 4*K) return makeColoredText(colors.purple,text);
        return makeColoredText(colors.black,text);
    }

    async function sampleRecord(pid){
        if(ENABLE_CACHE){
            if(GM_getValue(pid)&&(GM_getValue(pid)!=="NaN K")){
                return GM_getValue(pid);
            }
        }
        let lst = [];
        try{
            let promiselst = [];
            for(let i=1;i<=5;i++){
                promiselst.push(
                    fetch(
                        `https://www.luogu.com.cn/record/list?pid=${pid}&status=12&_contentOnly=1&page=${i}`
                    )
                    .then(x=>x.json())
                    .then(x=>x.currentData.records.result)
                );
            }
            await Promise.all(promiselst).then(function(x){
                x.forEach(x=>x.forEach(x=>lst.push(x.sourceCodeLength)));
                lst.sort((a,b)=>a-b);
            });
        }catch(e){};
        // console.log(lst);
        lst.sort((a,b)=>a-b);
        let res = getMid(lst);
        if(ENABLE_CACHE){
            GM_setValue(pid,res);
        }
        return res;
    }

    if(window.location.href.split('/')[3] === "problem"){
        let field = document.querySelector(".color-inverse > div:nth-child(1)");
        let clone = field.cloneNode(true);
        field.parentNode.appendChild(clone);
        clone.children[0].innerHTML = "平均码长";
        clone.children[1].innerHTML = "正在获取中";
        let size = await sampleRecord(window.location.href.split('/')[4],clone.children[1]);
        clone.children[1].innerHTML = makeColoredTextBySize(size,size);
    }
    else if(window.location.href.match('#').length){
        let all = document.querySelector(".row-wrap");
        //all.childNodes.forEach(async function(x){
        for(let i=0;i<all.childNodes.length;i++){
            let x = all.childNodes[i];
            if(!x.innerHTML){
                continue;
            }
            let element = x.children[1];
            let a = document.createElement('a');
            let size = await sampleRecord(element.title);
            a.innerHTML = makeColoredTextBySize(size,size);
            element.appendChild(a);
         };
    }
}

async function 浏览记录(){
    const MAX_COUNT = 20;
    const DELAY = 20;//停留超过 20s 会被记录

    var has_built;

    function mySetTimeOut(func,tim){
        let a;
        a = setInterval(()=>{func();clearInterval(a);},tim);
    }

    function store(problem,title,link){
        let all = (GM_getValue("all") || []).slice(-MAX_COUNT);
        if(!all.some(x=>x.problem === problem)){
            all.push({problem:problem,title:title,link:link});
        }
        GM_setValue("all",all);
    }

    async function inPaste(){
        let value = GM_getValue("doit");
        if(!value){
            return;
        }
        GM_deleteValue("doit");
        let data = "";
        GM_getValue("all").forEach(x => {
            data += `- [${x.title}](${x.link})`
            data += "\n\n"
        });
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
        window.location.reload();
    }

    function buildstatisticsbutton() {
        if (has_built) return;
        let tmp = document.querySelector(".operation > span:nth-child(3)");
        let tmp2 = tmp.cloneNode(true);
        tmp2.childNodes[0].childNodes[0].innerText = "历史记录";
        tmp2.onclick = async function() {
            GM_setValue("doit",true);
            window.open(`https://www.luogu.com.cn/paste/${PASTEID}`);
        };
        tmp.parentNode.appendChild(tmp2);
        has_built = true;
    }

    window.addEventListener('load',function(){
        if(window.location.href.split('/')[3] === "paste"){
            inPaste();
            return;
        }
        let title = document.querySelector(".lfe-h1 > span:nth-child(1)")?
            document.querySelector(".lfe-h1 > span:nth-child(1)").title :
            document.querySelector(".lfe-h1").innerText;
        let problem = window.location.href.split('/')[4];
        mySetTimeOut(function(){store(problem,title,window.location.href);console.log("store!");},1000*DELAY);
    })

    window.addEventListener('load', buildstatisticsbutton);
    setTimeout(buildstatisticsbutton, 500);
}

async function 简要题面(){
    const keywords = [
        "题目大意","题意","题意简述","问题描述","题面","Description"
    ];

    async function getSolutions(){
        let problem = window.location.href.split('/')[4];
        let url = "https://www.luogu.com.cn/problem/solution/" + problem;
        let text = await fetch(url).then(x=>x.text());
        let data = text.split(`JSON.parse(decodeURIComponent("`)[1].split(`"`)[0];
        let res = [];
        JSON.parse(decodeURIComponent(data)).currentData.solutions.result.forEach(x => {
            res.push(x.content.split("\n"));
        });
        return res;
    }

    function getProblemDescr(text){
        let res = [];
        let pre;
        try{
            text.forEach(function(x){
                if(x.split(" ")[0] === pre){
                    throw "parse end!";
                }
                if(keywords.some(kwd=>x.match(kwd))&&!keywords.some(kwd=>x.split(" ")[0].match(kwd))){
                    pre=x.split(" ")[0];
                }
                if(pre){
                    res.push(x);
                }
            });
        }catch(e){
            if(e === "parse end!"){
                let str = "";
                res.forEach(x=>str+=`> ${x}\n`);
                return str;
            }
            throw e;
        }
        return "";
    }

    async function my_marked(code){
        if(code === "") return "";
        let tmp;
        await GM_xmlhttpRequest({
            method:'post',
            url:'http://www.nfls.com.cn:10611/api/markdown',
            data:"s="+encodeURIComponent(code),
            headers:{ "Content-Type": "application/x-www-form-urlencoded" },
            onload:res=>tmp=res.responseText
        });
        async function dfs(dep){
            await new Promise(resolve=>setTimeout(resolve,500));
            if(typeof tmp !== 'undefined'){
                return tmp;
            }
            dep === 8? tmp = '网络错误，请刷新重试': await dfs(dep+1);
        }
        await dfs(1);
        return new DOMParser().parseFromString(tmp,"text/html").all[3].innerHTML;
    }

    async function addElement(){
        let solutions = await getSolutions();
        // window.searchSolutionKeyword=function(s){
        //     return !!window.__solutions.some(x=>x.some(xx=>xx.match(s)));
        // };
        // setTimeout(_=>console.log(window.searchSolutionKeyword,window),2000);


        let tmp = document.querySelector(".operation > span:nth-child(3)");
        let tmp2 = tmp.cloneNode(true);
        tmp2.childNodes[0].childNodes[0].innerText = "搜索题解关键词";
        tmp2.onclick = function() {
            let value = prompt("请输入要找的关键词");
            if(value === '' || value === null){
                return;
            }
            if(!!solutions.some(x=>x.some(xx=>xx.match(value)))){
                alert(`恭喜！题解中有关键词"${value}"，快切了此题吧！`);
            }
            else{
                alert(`题解中并没有关键词"${value}"`);
            }
            // await addtrainingproblem(window.location.href.split('/')[4]);
            // window.open(`https://www.luogu.com.cn/training/${TRAINING_ID}#rank`);
        };
        tmp.parentNode.appendChild(tmp2);

        let html = await getSolutions().then(function(x){
            let res = "";
            x.forEach(function(x){
                x = getProblemDescr(x);
                if(x !== ""){
                    res+=x+"\n\n";
                }
            });
            return res;
        });
        await fetch("https://www.luogu.com.cn/paste/edit/"+PASTEID, {
            "headers": {
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": document.querySelector("meta[name=csrf-token]").content,
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({"data":html}),
            "method": "POST"
        });
        html = await my_marked(html);
        let nodes = [
            document.querySelector("h2.lfe-h2:nth-child(1)"),
            document.querySelector("div.marked:nth-child(2)")];
        let text = nodes[0].parentNode.insertBefore(nodes[1].cloneNode(true),nodes[0]);
        let title = nodes[0].parentNode.insertBefore(nodes[0].cloneNode(true),text);
        title.innerText = "简要题意";
        text.innerHTML = html;
        let index = 0;
        let show = function(){
            let cnt = 0;
            text.children.forEach(function(x){
                x.style.display = (cnt === index?"":"none");
                cnt ++;
            });
        };
        show();
        if(text.children.length === 0){
            text.innerHTML = "未找到简要题意";
            return;
        }
        let but1 = document.createElement("button");
        but1.innerText = "换一个";
        but1.onclick = function(){
            index = (index+1)%text.children.length;
            show();
        };
        if(text.children.length !== 1){
            title.appendChild(but1);
        }
        let but2 = document.createElement("button");
        but2.innerText = "更好的阅读体验";
        but2.onclick = function(){window.open("https://www.luogu.com.cn/paste/"+PASTEID);};
        title.appendChild(but2);
    }

    addElement();
}

async function 首页暂存内容(){
    function inMain(){
        let div = document.querySelector(".am-u-lg-3 > div:nth-child(3)");
        let inn = document.createElement("div");
        inn.innerHTML = "<h2>暂存内容</h2>";
        inn.style.marginTop = "40px";
        div.appendChild(inn);

        let but1=document.createElement("button");
        but1.innerText="编辑内容";
        but1.onclick = function(){window.open(GM_getValue("pasteid"));};
        let but2=document.createElement("button");
        but2.innerText="删除内容";
        but2.onclick = function(){GM_deleteValue("html");alert("删除成功");};

        inn.appendChild(but1);
        inn.appendChild(but2);

        let tmp = document.createElement("div");
        tmp.innerHTML = GM_getValue("html");
        tmp.style.marginTop = "20px";
        if(tmp.innerHTML === undefined){
            tmp.innerHTML = "";
        }
        inn.appendChild(tmp);
    }

    //paste

    function inPaste(){
        let div = document.querySelector(".actions");
        let button = div.childNodes[2].cloneNode(true);
        button.innerText="保存到首页";
        div.appendChild(div.childNodes[1].cloneNode(true));
        div.appendChild(button);
        button.onclick=function(){
            GM_setValue("pasteid",window.location.href);
            GM_setValue("html",document.querySelector(".marked").innerHTML);
            alert("保存成功");
        };
    }

    (function() {
        'use strict';
        if(window.location.href.split('/')[3] === "paste"){
            setTimeout(inPaste,10);
        }
        else{
            setTimeout(inMain,10);
        }
    })();
}

async function 卷题情况(){
    var has_built = false;

    function addtrainingproblem(proName) {
        return fetch(`https://www.luogu.com.cn/api/training/editProblems/${TRAINING_ID}`, {
            "headers": {
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": document.querySelector("meta[name=csrf-token]").content,
                "Content-Type": "application/json",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin"
            },
            "body": "{\"pids\":[\"" + proName + "\", \"P1001\"]}",
            "method": "POST",
        });
    }

    function buildstatisticsbutton() {
        if (has_built) return;
        let tmp = document.querySelector(".operation > span:nth-child(3)");
        let tmp2 = tmp.cloneNode(true);
        tmp2.childNodes[0].childNodes[0].innerText = "卷题情况";
        tmp2.onclick = async function() {
            await addtrainingproblem(window.location.href.split('/')[4]);
            window.open(`https://www.luogu.com.cn/training/${TRAINING_ID}#rank`);
        };
        tmp.parentNode.appendChild(tmp2);
        has_built = true;
    }

    window.addEventListener('load', buildstatisticsbutton);
    setTimeout(buildstatisticsbutton, 500);
}

async function 测试用例(){
    var has_built = false;

    async function _getLojProblem(keyword){
        return await fetch("https://api.loj.ac/api/problem/queryProblemSet", {
            "credentials": "include",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "keyword":keyword,"locale":"zh_CN","takeCount":1,
                "skipCount":0,"keywordMatchesId":true,"titleOnly":true
            }),
            "method": "POST",
        }).then((x)=>(x.json())).then(function(x){return x.result[0].meta.id;});
    }

    async function getLojProblem(keyword){
        let value;
        try{
            value = await _getLojProblem(keyword);
        }
        catch(e){
            console.log("error:",e);
            value = await _getLojProblem(keyword.split('」')[1]);
        }
        return value;
    }

    async function getLojSubmission(problem){
        return await fetch("https://api.loj.ac/api/submission/querySubmission", {
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({"problemDisplayId":problem,"locale":"zh_CN","takeCount":1,"status":"Accepted"}),
            "method": "POST"
        }).then((x)=>(x.json())).then((x)=>x.submissions[0].id);
    }

    function inLuogu(){
        if(has_built || document.querySelector(".tags-wrap").innerText.search("各省省选") === -1){
            return;
        }
        let tmp = document.querySelector(".operation > span:nth-child(3)");
        let tmp2 = tmp.cloneNode(true);
        tmp2.childNodes[0].childNodes[0].innerText = "测试用例";
        tmp2.onclick = function() {
            const p = document.querySelector(".lfe-h1 > span:nth-child(1)").title.split('[')[1].split(']');
            GM_setValue("title",`「${p[0]}」${p[1].trim()}`);
            window.open("https://api.loj.ac");
        };
        tmp.parentNode.appendChild(tmp2);
        has_built = true;
    }

    async function inLoj(){
        if(has_built){
            return;
        }
        has_built = true;
        try{
            const value = await getLojSubmission(await getLojProblem(GM_getValue("title")));
            if(isNaN(value)){
                throw "Cannot get submission!";
            }
            window.location.replace("https://loj.ac/s/" + value);
        }
        catch(err){
            alert("error: \n"+err);
        }
        finally{
            GM_deleteValue("title");
        }
    }

    function main(){
        window.location.href === "https://api.loj.ac/" ? setTimeout(inLoj,500) : inLuogu();
    }

    window.addEventListener('load', main);
    setTimeout(main, 500);
}

async function 显示今日AC(){
    const today = (
        (a)=>(new Date(a.getFullYear()+"/"+String(a.getMonth()+1)+"/"+String(a.getDate())))
    )(new Date()).getTime()/1000;

    async function dfsGetTodayAC(name,page){
        let ans = await fetch(`https://www.luogu.com.cn/record/list?user=${name}&status=12&page=${page}`)
            .then(x=>x.text())
            .then(x=>x.split("JSON.parse(decodeURIComponent(\"")[1])
            .then(x=>x.split("\"))")[0])
            .then(x=>JSON.parse(decodeURIComponent(x)))
            .then(x=>x.currentData.records.result)
            .then(x=>x.filter(xx=>xx.submitTime>=today));
        if(ans.length === 20){
            let res = await dfsGetTodayAC(name,page+1);
            res.forEach(x=>ans.push(x));
        }
        return ans;
    }

    console.log(today);

    let cards = [];
    while(document.querySelector(".row-wrap") === null || cards.length !== document.querySelector(".row-wrap").childElementCount){
        cards = [];
        let app = document.querySelector("#app");
        app.childNodes.forEach(function(x){if(x.className === "dropdown") cards.push(x);});
        if(!cards.length){
            app = document.querySelector("main.wrapped");
            app.childNodes.forEach(function(x){if(x.className === "dropdown") cards.push(x);});
            console.log("cards",cards);
        }
        console.log("cards",cards);
        await new Promise(resolve=>setTimeout(resolve,500));
    }


    cards.forEach(async function(x){
        let name = document.querySelector(
            `div.row:nth-child(${cards.indexOf(x)+1}) > span:nth-child(2) > `+
            `span:nth-child(1) > span:nth-child(1) > span:nth-child(1)`
        ).innerText;

        let ans = await dfsGetTodayAC(name,1);

        let p = document.createElement("p");
        p.innerText = "今日通过的题目：";
        console.log(x);
        x.children[0].children[1].appendChild(p);
        ans = ans.filter((item, index) => {
            const duplicateIndex = ans.findIndex(otherItem => otherItem.problem.pid === item.problem.pid);
            return duplicateIndex === index;
        });
        ans.forEach(function(xx){
            let a = document.createElement("a");
            a.innerText = xx.problem.pid + "  " + xx.problem.title;
            a.href = "https://www.luogu.com.cn/problem/" + xx.problem.pid;
            x.children[0].children[1].appendChild(a);
            x.children[0].children[1].appendChild(document.createElement("p"));
        })
        console.log(name,ans);
    });
}

if(URLmatch("https://www.luogu.com.cn/problem/*") || URLmatch("https://www.luogu.com.cn/paste/*") || URLmatch("https://www.luogu.com.cn/training/*")){
    try{
        浏览记录();
    }catch(e){};
}

if(URLmatch("https://www.luogu.com.cn/problem/*") || (URLmatch("https://www.luogu.com.cn/training/*")&&!URLmatch("rank"))){
    try{
        显示代码长度();
    }catch(e){};
}

if(URLmatch("https://www.luogu.com.cn/problem/*")){
    try{
        简要题面();
    }catch(e){console.log(e);};
}

if(window.location.href === "https://www.luogu.com.cn/"||URLmatch("https://www.luogu.com.cn/paste/*")){
    try{
        首页暂存内容();
    }catch(e){console.log(e);};
}

if(URLmatch("https://www.luogu.com.cn/problem/*")||!URLmatch("https://www.luogu.com.cn/problem/list")){
    try{
        卷题情况();
    }catch(e){console.log(e);};
}

if(URLmatch("https://www.luogu.com.cn/problem/*")||URLmatch("https://api.loj.ac/")){
    try{
        测试用例();
    }catch(e){console.log(e);};
}

let id = setInterval(function(){
    if(window.location.href.split('/')[3] === "training" && Boolean(window.location.href.split('/')[4].match("#rank"))){
        console.log("123");
        try{
            显示今日AC();
        }catch(e){console.log(e);};
        clearInterval(id);
    }
},1000);

document.querySelector(".operation").children.forEach(x=>x.style.zIndex=9999);
