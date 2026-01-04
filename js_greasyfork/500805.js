// ==UserScript==
// @name         luogu 插件集合
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  非常好的 luogu 插件集合
// @author       konyakest
// @license      MIT
// @match        https://www.luogu.com.cn/*
// @match        https://www.luogu.com/*
// @match        https://api.loj.ac/
// @icon         https://fecdn.luogu.com.cn/luogu/logo.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/500805/luogu%20%E6%8F%92%E4%BB%B6%E9%9B%86%E5%90%88.user.js
// @updateURL https://update.greasyfork.org/scripts/500805/luogu%20%E6%8F%92%E4%BB%B6%E9%9B%86%E5%90%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.href;
    async function user_detail(){
        var button = document.createElement('button');
        button.textContent = '复制Md';
        button.style.position = "absolute";
        button.style.top = "100px";button.style.right = "100px";
        window.addEventListener('scroll', function() {
            var scrollY = window.scrollY;
            button.style.top = (100 + scrollY) + 'px';
        });
        button.classList.add('button-lgcm');
        button.addEventListener('click', async function() {
            var introduction = _feInstance.currentData.user.introduction;
            await navigator.clipboard.writeText(introduction);
            alert('复制成功');
        });
        document.body.appendChild(button);
    }
    async function blog(){
            var button = document.createElement('button');
            button.textContent = '复制Md';
            button.style.position = "absolute";
            button.style.top = "100px";button.style.right = "100px";
            window.addEventListener('scroll', function() {
                var scrollY = window.scrollY;
                button.style.top = (100 + scrollY) + 'px';
            });
            button.classList.add('button-lgcm');
            button.addEventListener('click', async function() {
                fetch('/api/blog/detail/' + BlogGlobals.blogID).then(res => res.json()).then(res => navigator.clipboard.writeText(res.data.Content));
                alert('复制成功');
            });
            document.body.appendChild(button);
        };
    async function contest_detail(){
        var button = document.createElement('button');
        button.textContent = '复制Md';
        button.style.position = "absolute";
        button.style.top = "100px";button.style.right = "100px";
        window.addEventListener('scroll', function() {
            var scrollY = window.scrollY;
            button.style.top = (100 + scrollY) + 'px';
        });
        button.classList.add('button-lgcm');
        button.addEventListener('click', async function() {
            var introduction = _feInstance.currentData.contest.description;
            await navigator.clipboard.writeText(introduction);
            alert('复制成功');
        });
        document.body.appendChild(button);
    };
    async function training_detail(){
        var button = document.createElement('button');
        button.textContent = '复制Md';
        button.style.position = "absolute";
        button.style.top = "100px";button.style.right = "100px";
        window.addEventListener('scroll', function() {
            var scrollY = window.scrollY;
            button.style.top = (100 + scrollY) + 'px';
        });
        button.classList.add('button-lgcm');
        button.addEventListener('click', async function() {
            var introduction = _feInstance.currentData.training.description;
            await navigator.clipboard.writeText(introduction);
            alert('复制成功');
        });
        document.body.appendChild(button);
    };
    var style = document.createElement('style');
    style.textContent = `
        .button-lgcm {
            outline:none !important;
            cursor: pointer;
            line-height: 1.25;
            position: relative;
            display: block;
            margin-left: -.0625rem;
            padding: .5rem .75rem;
            color: #fff !important;
            border: .0625rem solid #dee2e6;
            font-size: 15px;
            font-weight: unset;
            display: flex;
            min-width: 36px;
            height: 36px;
            margin: 0 3px;
            border-radius: 100px!important;
            align-items: center;
            justify-content: center;
            transition:all .3s;
            background-color: #5e72e4;
        }
        .button-lgcm:hover {
            box-shadow: 0 7px 14px rgba(50,50,93,.1), 0 3px 6px rgba(0,0,0,.08);
            transform: translateY(-1px);
        }
        `;
    document.head.appendChild(style);
    if (url.includes('blog') && !url.includes('Admin') && !url.includes('admin')) {
        var parsedUrl = new URL(url);
        if (url.includes('org')) {
            var path = parsedUrl.pathname.split('/');
            if (path.length >= 2 && path[1] != '') {
                window.addEventListener('load', blog);
            }
        } else {
            var path = parsedUrl.pathname.split('/');
            if (path.length >= 4) {
                console.log('a');
                window.addEventListener('load', blog);
            }
        }
    }
    if (url.includes('user') && !url.includes('notification')) {
        window.addEventListener('load', user_detail);
    }
    if (url.includes('contest') && !url.includes('list') && !url.includes('edit') && !url.includes('contestId')) {
        window.addEventListener('load', contest_detail);
    }
    if (url.includes('training') && !url.includes('edit') && !url.includes('list')) {
        window.addEventListener('load', training_detail);
    }
})();

(function () {
  'use strict';
  const url = window.location.href;
  async function clickBotton_blog() {
    var x = document.querySelector("#lentille-context").text
    var y = JSON.parse(x)
    var z = y.data.article.content
    navigator.clipboard.writeText(z);
  };
  if (url.includes("article")) {
    document.onkeydown = function (e) {
      if (e.keyCode == 67 && e.ctrlKey && e.altKey) {
        clickBotton_blog();
        alert("复制成功！");
      }
    }
  }
  // Your code here...
})();

(function() {
    'use strict';

    function remove(){
        var xpath = "/html/body/div/div[2]/main/div/section[1]/div[1]/a[2]";

        var iterator = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);

        var element;
        while (element = iterator.iterateNext()) {
            if (element) {
                element.parentNode.removeChild(element);
            }
        }
    }

    window.addEventListener("load", () => {
        remove();
    });
})();

/*
- 浏览记录
- 显示代码长度
- 简要题面
- 首页暂存内容
- 卷题情况
- 测试用例
- 显示今日AC
*/

const PASTEID = "1vvwrtao"/*请自行设置，如"eyb488k7"*/;
const TRAINING_ID = 551473/*请自行设置，如100，**必须是团队作业题单，且您必须有题单的编辑权限***/;

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

(function(){
    'use strict';
    const ob = new MutationObserver(() => {
        const t = document.querySelector(".introduction.marked");
        if (t !== null && t.style.display === "none") {
            t.style.display = 'block';
            for (let i = 0; i < t.parentElement.children.length; i++) {
                if (t.parentElement.children[i].innerText === '系统维护，该内容暂不可见。') {
                    t.parentElement.children[i].remove();
                }
            }
        }
    });
    ob.observe(document.documentElement, {childList: true, subtree: true});
})();

'use strict';
(function(){
	const featureDict = new Map([
		['lgbot1RemoveAd', '屏蔽广告'],
		['lgbot1Removeback', '移除网页出错跳转'],
		['lgbot1AddMessageLink', '私信界面 Ctrl+Click 打开用户主页'],
		['lgbot1RemoveCover', '移除主页遮盖'],
		['lgbot1AddProblemsColor', '显示题目颜色']
	]);
	const problemDifficultyToColor = [[191,191,191],[254,76,97],[243,156,17],[255,193,22],[82,196,26],[52,152,219],[157,61,207],[14,29,105]];
	function addSettingButton(){//增加插件设置
		const navElement = document.querySelector('nav.lfe-body');
		if(!navElement){
			console.log("未找到侧边导航栏");
			console.log(document);
			return;
		}
		const settingElement = document.createElement('a');//外壳，链接功能
		settingElement.setAttribute('data-v-0640126c', '');
		settingElement.setAttribute('data-v-639bc19b', '');
		settingElement.setAttribute('data-v-33633d7e', '');
		settingElement.className = 'color-none';
		settingElement.style.color = 'inherit';
		const settingText = document.createElement('span');
		settingText.setAttribute('data-v-639bc19b', '');
		settingText.className = 'text';
		settingText.textContent = '插件设置';
		settingElement.appendChild(settingText);
		navElement.appendChild(settingElement);
		settingElement.addEventListener('click', () => {//点击后进入临时页面
			function initializeSettings(){
				for(let i of featureDict.keys()){
					if(localStorage.getItem(i) === null){
						localStorage.setItem(i, 'true');
					}
				}
			}
			initializeSettings();
			const pageContent = `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>luogu_bot1 功能设置</title>
					<style>
						body { font-family: Arial, sans-serif; }
						#featureBox {
							position: fixed;
							top: 20%;
							left: 50%;
							transform: translate(-50%, -50%);
							background-color: white;
							border: 1px solid #ccc;
							padding: 20px;
							z-index: 10001;
						}
					</style>
				</head>
				<body>
					<div id="featureBox">
						<h3>选择插件功能</h3>
						${Array.from(featureDict).map(([key, description]) => `
							<div>
								<label><input type="checkbox" id="${key}">${description}</label>
							</div>
						`).join('')}
						<button id="selectAll">全选</button>
						<button id="saveFeatures">保存</button>
					</div>
					<script>
						document.addEventListener('DOMContentLoaded', () => {//加载设置
							${Array.from(featureDict.keys()).map(key => `
								const ${key} = localStorage.getItem('${key}') === 'true';
								document.getElementById('${key}').checked = ${key};
							`).join('')}
						});
						document.getElementById('saveFeatures').addEventListener('click', () => {//保存设置
							${Array.from(featureDict.keys()).map(key => `
								const ${key} = document.getElementById('${key}').checked;
								localStorage.setItem('${key}', String(${key}));
							`).join('')}
							alert('功能已保存');
						});
						document.getElementById('selectAll').addEventListener('click', () => {//全选
							${Array.from(featureDict.keys()).map(key => `
								document.getElementById('${key}').checked = true;
							`).join('')}
						});
					</script>
				</body>
				</html>
			`;
			const newWindow = window.open();
			newWindow.document.write(pageContent);
			newWindow.document.close();
		});
	}
	function removeAd(){//屏蔽广告
		const adElement = document.querySelector('div[data-v-0a593618][data-v-1143714b]');
		if(adElement) {
			adElement.remove();
			console.log('广告已被删除');
		}
		else console.log('没有找到广告');
	}
	function removeBack(){//移除网页跳转
		function disableRedirect(){
			window.history.go = function() {// 根据实际测试，洛谷使用的是 history.go
				console.log("luogu_bot1：已为您屏蔽 history.go()");
			};
		}
		function checkError(){
			if(document.title === '错误 - 洛谷 | 计算机科学教育新生态'){
				disableRedirect();
				return true;
			}
			return false;
		}
		const observer = new MutationObserver((mutations, obs) => {
			checkError();
		});
		const config = {
			childList: true,
			subtree: true,
		};
		observer.observe(document, config);// 监视 title 变化
		if(document.readyState === 'complete' || document.readyState === 'interactive'){
			checkError();
		}
	}
	async function getUidByUsername(username){// 获取 uid
		const apiUrl = `https://www.luogu.com.cn/api/user/search?keyword=${username}`;
		return await fetch(apiUrl)
		.then(response => response.json())
		.then(data => {
            if(data.users && data.users.length > 0){
        		return data.users[0].uid;
			}
		})
		.catch(error => {
			console.error('Error fetching user data:', error);
		});
	}
	async function processItem(item) { // 添加 eventListener
		item.parentElement.parentElement.addEventListener('click', (event) => {
			if(event.ctrlKey){
				getUidByUsername(item.textContent.trim())
				.then(uid => {
					const userLink = `/user/${uid}`;
					if(userLink){
						window.open(userLink, '_blank');
					}
				})
			}
		});
    }
	function addMessageLink(){ // Ctrl+Click 触发，动态修改网页
		let items = document.querySelectorAll('span[data-v-5b9e5f50] > span[slot="trigger"]');
		console.log("asdf");
		console.log(items);
		for(let i of items){
			processItem(i);
		}
		const callback = async function(mutationsList, observer) {
			for (const mutation of mutationsList) {
				if (mutation.type === 'childList') {
					for (const addedNode of mutation.addedNodes) {
						if (addedNode.nodeType === Node.ELEMENT_NODE) {
							const newItems = addedNode.querySelectorAll('span[data-v-5b9e5f50] > span[slot="trigger"]');
							for (const newItem of newItems) {
								processItem(newItem);
							}
						}
					}
				}
			}
		};
		const observer = new MutationObserver(callback);
		observer.observe(document, { childList: true, subtree: true });
	}
	function removeCover(){
		let profile = document.querySelector(".introduction.marked");
		if(profile && profile.style.display === "none"){
			profile.style.display = "block";
			for(let i=0;i<profile.parentElement.children.length;++i){
				if(profile.parentElement.children[i].innerText === "系统维护，该内容暂不可见。"){
					profile.parentElement.children[i].remove();
				}
			}
		}
	}
	function alwaysRemoveCover(){
		const observer = new MutationObserver(() => removeCover());
		observer.observe(document,{
			childList: true,
			subtree: true
		});
		removeCover();
	}
	const problemToColorMap = new Map();
	class FetchRateLimiter{
		constructor(limit) { // limit 以毫秒为单位，表示相邻两次 fetch 操作间的最小间隔
			this.limit = limit;
			this.queue = [];
			this.queuePrior = [];
			this.active = false;
			this.requestCache = new Map();
		}
		process() {
			this.active = 1;
			let resolve, reject, url;
			if(this.queuePrior.length > 0){
				({resolve, reject, url} = this.queuePrior.shift());
			}
			else if(this.queue.length > 0){
				({resolve, reject, url} = this.queue.shift());
			}
			else{
				this.active = 0;
				return;
			}
			console.log(url);
			fetch(url)
			.then(resolve)
			.catch(reject);
			setTimeout(this.process.bind(this), this.limit);
		}
		push(url, prior) {
			if(this.requestCache.has(url)) return this.requestCache.get(url);
			const request = new Promise((resolve, reject) => {
				if(prior) this.queuePrior.push({url, resolve, reject});
				else this.queue.push({url, resolve, reject});
				if(!this.active) this.process();
			})
			.then((response) => {
				return response.text();
			});
			this.requestCache.set(url,request);
			return request;
		}
	}
	const limiter = new FetchRateLimiter(300);
	async function getProblemColor(problemid, prior=false){
		if(window.location.href.startsWith('https://www.luogu.com.cn/record')){
			const resultList = _feInstance.currentData.records.result;
			if(!resultList.lgbot1Visited){
				for(const item of resultList){
					problemToColorMap.set(item.problem.pid,`rgb(${problemDifficultyToColor[item.problem.difficulty].join(',')})`);
				}
				resultList.lgbot1Visited = true;
			}
		}
		if(/^https:\/\/www\.luogu\.com\.cn\/user\/\d+#practice$/.test(window.location.href)) {
			let problemList = _feInstance.currentData.submittedProblems;
			if(!problemList.lgbot1Visited){
				for(const item of problemList){
					problemToColorMap.set(item.pid,`rgb(${problemDifficultyToColor[item.difficulty].join(',')})`);
				}
				problemList.lgbot1Visited = true;
			}
			problemList = _feInstance.currentData.passedProblems;
			if(!problemList.lgbot1Visited){
				for(const item of problemList){
					problemToColorMap.set(item.pid,`rgb(${problemDifficultyToColor[item.difficulty].join(',')})`);
				}
				problemList.lgbot1Visited = true;
			}
		}
		if(problemToColorMap.has(problemid)) return problemToColorMap.get(problemid);
		const url = '/problem/'+problemid;
		let data;
		try{
			data = await limiter.push(url, prior);
		} catch (error) {
			debugger;
			console.error('Error fetching user data:', error);
			console.log(problemid);
			return;
		}
		const parser = new DOMParser();
		const doc = parser.parseFromString(data, 'text/html');
		let scriptText = doc.querySelector("script").textContent;
		scriptText = scriptText.match(/window\._feInjection = JSON\.parse\(decodeURIComponent\("(.+)"\)\);/);
		if(!scriptText) return;
		scriptText = scriptText[1];
		const _feInjection = JSON.parse(decodeURIComponent(scriptText));
		const problemDifficulty = _feInjection.currentData.problem.difficulty;
		problemToColorMap.set(problemid,`rgb(${problemDifficultyToColor[problemDifficulty].join(',')})`);
		return problemToColorMap.get(problemid);
	}
	function isProblemId(problemid){
		if(problemid.startsWith('AT_')) return true;
		if(!/[a-zA-Z]/.test(problemid)) return false;
		if(!/[0-9]/.test(problemid)) return false;
		return true;
	}
	async function addProblemColor(item){
		let problemid = item.href.split('/').pop();
		let prior = false;
		if(problemid.includes('?forum=')){
			debugger;
			problemid = problemid.split('=').pop();
			prior = true;
		}
		problemid = problemid.split('?')[0];
		problemid = problemid.split('=').pop();
		if(!isProblemId(problemid)) return;
		if(item.innerText.startsWith(problemid)){
			const spanItem = item.children[0];
			if(spanItem && spanItem.matches('span.pid') && spanItem.innerText === problemid){
				const color = await getProblemColor(problemid, prior);
				spanItem.style.color = color;
				spanItem.style.fontWeight = 'bold';
			}
			else{
				const color = await getProblemColor(problemid, prior);
				const content = item.innerHTML;
				item.innerHTML = content.replace(problemid,`<b style="color: ${color};">${problemid}</b>`);
			}
		}
	}
	async function addProblemsColor(){
		const observer = new MutationObserver(async (mutationsList) => {
			for (const mutation of mutationsList) {
				if (mutation.type === 'childList') {
					for (const addedNode of mutation.addedNodes) {
						if (addedNode.nodeType === Node.ELEMENT_NODE) {
							const newItems = addedNode.querySelectorAll('a[href]');
							if(addedNode.matches('a[href]')) addProblemColor(addedNode);
							for (const newItem of newItems) {
								addProblemColor(newItem);
							}
						}
					}
				}
				else if(mutation.type === 'characterData') {
					if(mutation.target.parentElement.matches('span.pid')){
						mutation.target.parentElement.style.color = await getProblemColor(mutation.target.textContent);
						mutation.target.parentElement.style.fontWeight = 'bold';
					}
				}
			}
		});
		observer.observe(document, {
			childList: true,
			subtree: true,
			characterData: true,
		});
		const nodelist = document.querySelectorAll('a[href]');
		for(const i of nodelist){
			addProblemColor(i);
		}
	}
	setTimeout(addSettingButton, 500);
	if(localStorage.getItem('lgbot1RemoveAd') === 'true'){
		setTimeout(removeAd, 500);
	}
	if(localStorage.getItem('lgbot1Removeback') === 'true'){
		removeBack();
	}
	if(localStorage.getItem('lgbot1AddMessageLink') === 'true'){
		if(window.location.href.startsWith('https://www.luogu.com.cn/chat')){
			setTimeout(addMessageLink,500);
		}
	}
	if(localStorage.getItem('lgbot1RemoveCover') === 'true'){
		setTimeout(alwaysRemoveCover, 500);
	}
	if(localStorage.getItem('lgbot1AddProblemsColor') === 'true'){
		setTimeout(addProblemsColor, 500);
	}
    var html = '<button id="clearbenben">清除犇犇</button>'
    var TNode = document.createElement('div');
	TNode.className = 'lg-article';
    TNode.id = 're_log';
	TNode.innerHTML = html;
    document.querySelector('div.lg-index-benben > div:nth-child(3)').insertAdjacentElement('afterend', TNode);
    document.getElementById('clearbenben').addEventListener('click', function() {
        switchMode('my');
        function load() {
            console.log('page ' + feedPage);
            $.get("/feed/" + feedMode + "?page=" + feedPage, function (resp) {
                $feed.append(resp);
                $("#feed-more").children("a").text("点击查看更多...")
                $("[name=feed-delete]").click(function () {
                    $.post("/api/feed/delete/" + $(this).attr('data-feed-id'), function () {
                        switchMode('all');
                    })
                }); feedPage++;
                if (resp.indexOf('没有更多动态了') != -1) {var l =  $('#feed > li > div.am-comment-main > header > div > a:nth-child(2)');
function f(i) {
$ .post("/api/feed/delete/"+ $(l[i]).attr('data-feed-id'), function() {
console.log(i);
if(i<l.length-1)setTimeout(`f(${i+1})`,200);
})
}
f(0);
}
                else setTimeout(load, 200);
            });
        }
        setTimeout(load, 1000);
    });
})();

document.querySelector(".operation").children.forEach(x=>x.style.zIndex=9999);