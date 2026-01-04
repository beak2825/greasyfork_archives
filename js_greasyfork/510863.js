// ==UserScript==
// @name         洛谷记录侦测练习情况
// @version      0.3
// @description  通过查看记录统计练习情况
// @match        https://www.luogu.com.cn/record*
// @match        https://www.luogu.com.cn$
// @author       MlkMathew
// @license      MIT
// @grant        none
// @namespace    https://greasyfork.org/users/1068192
// @downloadURL https://update.greasyfork.org/scripts/510863/%E6%B4%9B%E8%B0%B7%E8%AE%B0%E5%BD%95%E4%BE%A6%E6%B5%8B%E7%BB%83%E4%B9%A0%E6%83%85%E5%86%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/510863/%E6%B4%9B%E8%B0%B7%E8%AE%B0%E5%BD%95%E4%BE%A6%E6%B5%8B%E7%BB%83%E4%B9%A0%E6%83%85%E5%86%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function query_diff(dif){
        let res=localStorage.getItem(dif);
        if(!res){
            return 0;
        }
        return Number(res);
    }
    function work(x){
        if((x.pid[0]=='U'||x.pid[0]=='T')&&'0'<=x.pid[1]&&x.pid[1]<='9'){
            return ;
        }
        if(!localStorage.getItem(x.pid)){
            let now=query_diff(x.difficulty);
            localStorage.setItem(x.pid,true);
            localStorage.setItem(x.difficulty,now+1);
            if(!now){
                let arr=[x.pid];
                localStorage.setItem(x.difficulty.toString()+"problems",JSON.stringify(arr));
            }
            else{
                let arr=JSON.parse(localStorage.getItem(x.difficulty.toString()+"problems"));
                arr[now]=x.pid;
                localStorage.setItem(x.difficulty.toString()+"problems",JSON.stringify(arr));
            }
        }
    }
    var col=["#bfbfbf","#fe4c61","#f39c11","#ffc116","#52c41a","#3498db","#9d3dcf","#0e1d69"];
    function display(){
        let box=document.createElement("div");
        box.className="lg-article";
        let fat=document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right");
        fat.children[0].insertAdjacentElement("beforebegin",box);
        {
            const res=[];
            for(let i=0;i<=7;i++)
            {
                res[i]=query_diff(i);
            }
            let table=document.createElement("table");
            table.style=
            "border-collapse:separate;"+
            "font-family:inherit;"+
            "font-size:1.4rem;"+
            "letter-spacing:0px;"+
            "white-space:pre-wrap;";
            box.appendChild(table);
            let thead=document.createElement("thead");
            {
                let tr=document.createElement("tr");
                let th=document.createElement("th");
                th.textContent="练习情况(已爬取的数据)";
                th.style="background:rgb(228,240,245);"
                th.colSpan="2";
                tr.appendChild(th);
                thead.appendChild(tr);
            }
            table.appendChild(thead);
            let tbody=document.createElement("tbody");
            table.appendChild(tbody);
            {
                let tr=document.createElement("tr");
                {
                    let td=document.createElement("td");
                    let problemcolor=document.createElement("span");
                    problemcolor.textContent="  暂无评定  ";
                    problemcolor.style="color:rgb(255,255,255);background:rgb(191,191,191);border-radius:5px;";
                    td.appendChild(problemcolor);
                    tr.appendChild(td);
                }
                let problemcount=document.createElement("td");
                problemcount.textContent=res[0].toString()+"题";
                tr.appendChild(problemcount);
                tr.style="border-spacing:10px;";
                tbody.appendChild(tr);
            }
            {
                let tr=document.createElement("tr");
                {
                    let td=document.createElement("td");
                    let problemcolor=document.createElement("span");
                    problemcolor.textContent="  入门  ";
                    problemcolor.style="color:rgb(255,255,255);background:rgb(254,76,97);border-radius:5px;";
                    td.appendChild(problemcolor);
                    tr.appendChild(td);
                }
                let problemcount=document.createElement("td");
                problemcount.textContent=res[1].toString()+"题";
                tr.appendChild(problemcount);
                tr.style="border-spacing:10px;";
                tbody.appendChild(tr);
            }
            {
                let tr=document.createElement("tr");
                {
                    let td=document.createElement("td");
                    let problemcolor=document.createElement("span");
                    problemcolor.textContent="  普及−  ";
                    problemcolor.style="color:rgb(255,255,255);background:rgb(243,156,17);border-radius:5px;";
                    td.appendChild(problemcolor);
                    tr.appendChild(td);
                }
                let problemcount=document.createElement("td");
                problemcount.textContent=res[2].toString()+"题";
                tr.appendChild(problemcount);
                tr.style="border-spacing:10px;";
                tbody.appendChild(tr);
            }
            {
                let tr=document.createElement("tr");
                {
                    let td=document.createElement("td");
                    let problemcolor=document.createElement("span");
                    problemcolor.textContent="  普及/提高−  ";
                    problemcolor.style="color:rgb(255,255,255);background:rgb(255,193,22);border-radius:5px;";
                    td.appendChild(problemcolor);
                    tr.appendChild(td);
                }
                let problemcount=document.createElement("td");
                problemcount.textContent=res[3].toString()+"题";
                tr.appendChild(problemcount);
                tr.style="border-spacing:10px;";
                tbody.appendChild(tr);
            }
            {
                let tr=document.createElement("tr");
                {
                    let td=document.createElement("td");
                    let problemcolor=document.createElement("span");
                    problemcolor.textContent="  普及+/提高  ";
                    problemcolor.style="color:rgb(255,255,255);background:rgb(82,196,26);border-radius:5px;";
                    td.appendChild(problemcolor);
                    tr.appendChild(td);
                }
                let problemcount=document.createElement("td");
                problemcount.textContent=res[4].toString()+"题";
                tr.appendChild(problemcount);
                tr.style="border-spacing:10px;";
                tbody.appendChild(tr);
            }
            {
                let tr=document.createElement("tr");
                {
                    let td=document.createElement("td");
                    let problemcolor=document.createElement("span");
                    problemcolor.textContent="  提高+/省选−  ";
                    problemcolor.style="color:rgb(255,255,255);background:rgb(52,152,219);border-radius:5px;";
                    td.appendChild(problemcolor);
                    tr.appendChild(td);
                }
                let problemcount=document.createElement("td");
                problemcount.textContent=res[5].toString()+"题";
                tr.appendChild(problemcount);
                tr.style="border-spacing:10px;";
                tbody.appendChild(tr);
            }
            {
                let tr=document.createElement("tr");
                {
                    let td=document.createElement("td");
                    let problemcolor=document.createElement("span");
                    problemcolor.textContent="  省选/NOI−  ";
                    problemcolor.style="color:rgb(255,255,255);background:rgb(157,61,207);border-radius:5px;";
                    td.appendChild(problemcolor);
                    tr.appendChild(td);
                }
                let problemcount=document.createElement("td");
                problemcount.textContent=res[6].toString()+"题";
                tr.appendChild(problemcount);
                tr.style="border-spacing:10px;";
                tbody.appendChild(tr);
            }
            {
                let tr=document.createElement("tr");
                {
                    let td=document.createElement("td");
                    let problemcolor=document.createElement("span");
                    problemcolor.textContent="  NOI/NOI+/CTSC  ";
                    problemcolor.style="color:rgb(255,255,255);background:rgb(14,29,105);border-radius:5px;";
                    td.appendChild(problemcolor);
                    tr.appendChild(td);
                }
                let problemcount=document.createElement("td");
                problemcount.textContent=res[7].toString()+"题";
                tr.appendChild(problemcount);
                tr.style="border-spacing:10px;";
                tbody.appendChild(tr);
            }
            let tall=document.createElement("table");
            box.appendChild(tall);
            {
                let tr=document.createElement("tr");
                {
                    let td=document.createElement("td");
                    let problemcolor=document.createElement("span");
                    problemcolor.textContent="  通过总数  ";
                    problemcolor.style="background:rgb(228,240,245);border-radius:5px;";
                    td.appendChild(problemcolor);
                    tr.appendChild(td);
                }
                let problemcount=document.createElement("td");
                let sum=0;
                for(let i=0;i<=7;i++)
                {
                    sum+=res[i];
                }
                problemcount.textContent=sum.toString()+"题";
                tr.appendChild(problemcount);
                tr.style="border-spacing:10px;";
                tr.colSpan="2";
                tbody.appendChild(tr);
            }
            {
                let button=document.createElement("button");
                button.textContent="清空数据";
                button.style=
                "color:rgb(255,255,255);border-width:2px;background:rgb(14,144,210);"
                +"border-color:rgb(14,140,200);border-radius:5px;box-shadow:none;";
                box.appendChild(button);
                function click(){
                    if(confirm("确定要清空所有数据？")){
                        localStorage.clear();
                    }
                }
                button.onclick=click;
            }
            box.appendChild(document.createElement("p"));
            {
                let button=document.createElement("button");
                button.textContent="爬取数据";
                button.style=
                "color:rgb(255,255,255);border-width:2px;background:rgb(14,144,210);"
                +"border-color:rgb(14,140,200);border-radius:5px;box-shadow:none;";
                box.appendChild(button);
                function click(){
                    if(!confirm("确定要一页页记录爬取数据？(可以关闭浏览器停下，但是下次进入记录界面会继续，不要手贱输太多)")){
                        return ;
                    }
                    let num=Number(prompt("输入执行页码数","10"));
                    var uid=window._feInjection.currentUser.uid;
                    localStorage.setItem("fetch_pages",num.toString());
                    location.href="https://www.luogu.com.cn/record/list?user="+uid.toString()+"&status=12&page=1";
                }
                button.onclick=click;
            }
            box.appendChild(document.createElement("p"));
            {
                let button=document.createElement("button");
                button.textContent="生成柱状图(复制到剪贴板)";
                button.style=
                "color:rgb(255,255,255);border-width:2px;background:rgb(14,144,210);"
                +"border-color:rgb(14,140,200);border-radius:5px;box-shadow:none;";
                box.appendChild(button);
                let tip=document.createElement("dialog");
                let tip_txt=document.createElement("p");
                tip_txt.textContent="已复制到剪贴板";
                tip.style="width:150px;height:50px;text-align:center;border-width:0px;";
                tip.appendChild(tip_txt);
                button.appendChild(tip);
                function click(){
                    let maxv=res[0];
                    for(let i=1;i<=7;i++)
                    {
                        if(maxv<res[i]){
                            maxv=res[i];
                        }
                    }
                    let latex=
                    "$$"+
                    "\\def{\\cR}{FE4C61} \\def{\\cO}{F39C11} \\def{\\cY}{FFC116} \\def{\\cG}{52C41A} \\def{\\cB}{3498DB} \\def{\\cP}{9D3DCF} \\def{\\cD}{0E1D69} \\def{\\cE}{BFBFBF} \\def{\\s}{35pt} \\def{\\w}{\\kern{5pt}}"+
                    "\\newcommand{\\a}[1]{&\\textcolor{A9A9A9}{\\kern{-5pt}\\underline{#1\\kern{242pt}}\\kern{8pt}}\\\\[\\s]}"+
                    "\\newcommand{\\b}[2]{\\fcolorbox{black}{#2}{\\raisebox{#1pt}{\\kern{10pt}}}\\raisebox{#1pt}{\\scriptsize\\kern{-17pt}\\raisebox{4.5pt}{#1题}}}"+
                    "\\newcommand{\\c}[0]{\\kern{-10pt}\\large\\textbf{练习情况统计表}}"+
                    "\\newcommand{\\t}[2]{\\fcolorbox{black}{#2}{\\color{white}\\textbf{#1}}}"+
                    "\\newcommand{\\main}[9]{"+
                    "\\boxed{\\kern{8pt}\\begin{gathered}\\\\[-6pt]\\c\\\\[10pt]"+
                    "\\begin{aligned}\\a{500}\\a{450}\\a{350}\\a{300}\\a{250}\\a{200}\\a{150}\\a{100}\\a{\\w50}\\a{\\w\\w 0}\\end{aligned} \\\\[-64pt] \\\\[-#1pt]"+
                    "\\begin{matrix}"+
                    " & \\b{#2}{\\cE}& \\b{#3}{\\cR} & \\b{#4}{\\cO} & \\b{#5}{\\cY} & \\b{#6}{\\cG} & \\b{#7}{\\cB} & \\b{#8}{\\cP} & \\b{#9}{\\cD} & \\\\[5pt]"+
                    "\\kern{-6pt}\\text{项目} & \\t{灰}{\\cE} & \\t{红}{\\cR} & \\t{橙}{\\cO} & \\t{黄}{\\cY}&\\t{绿}{\\cG}&\\t{蓝}{\\cB}&\\t{紫}{\\cP} & \\t{黑}{\\cD} & \\kern{8pt} \\\\"+
                    "\\end{matrix}"+
                    "\\end{gathered}}}"+
                    "\\main{"+
                    maxv.toString()+
                    "}{"+
                    res[0].toString()+
                    "}{"+
                    res[1].toString()+
                    "}{"+
                    res[2].toString()+
                    "}{"+
                    res[3].toString()+
                    "}{"+
                    res[4].toString()+
                    "}{"+
                    res[5].toString()+
                    "}{"+
                    res[6].toString()+
                    "}{"+
                    res[7].toString()+
                    "}$$";
                    navigator.clipboard.writeText(latex);
                    tip.setAttribute("open","");
                    setTimeout(()=>{
                        tip.removeAttribute("open");
                    },"1000");
                }
                button.onclick=click;
            }
            box.appendChild(document.createElement("p"));
            {
                let button=document.createElement("button");
                button.textContent="生成具体练习情况(简陋版)(复制到剪贴板)";
                button.style=
                "color:rgb(255,255,255);border-width:2px;background:rgb(14,144,210);"
                +"border-color:rgb(14,140,200);border-radius:5px;box-shadow:none;";
                box.appendChild(button);
                let tip=document.createElement("dialog");
                let tip_txt=document.createElement("p");
                tip_txt.textContent="已复制到剪贴板";
                tip.style="width:150px;height:50px;text-align:center;border-width:0px;";
                tip.appendChild(tip_txt);
                button.appendChild(tip);
                function click(){
                    let txt="";
                    let fir=true;
                    for(let i=0;i<=7;i++)
                    {
                        if(query_diff(i)){
                            if(!fir){
                                txt+="\n---\n";
                            }
                            fir=false;
                            let arr=JSON.parse(localStorage.getItem(i.toString()+"problems"));
                            arr.sort();
                            for(let j=0;j<arr.length;j++)
                            {
                                txt+=arr[j]+"\n";
                            }
                        }
                    }
                    navigator.clipboard.writeText(txt);
                    tip.setAttribute("open","");
                    setTimeout(()=>{
                        tip.removeAttribute("open");
                    },"1000");
                }
                button.onclick=click;
            }
            box.appendChild(document.createElement("p"));
            {
                let button=document.createElement("button");
                button.textContent="生成具体练习情况(复制到剪贴板)";
                button.style=
                "color:rgb(255,255,255);border-width:2px;background:rgb(14,144,210);"
                +"border-color:rgb(14,140,200);border-radius:5px;box-shadow:none;";
                box.appendChild(button);
                let tip=document.createElement("dialog");
                let tip_txt=document.createElement("p");
                tip_txt.textContent="已复制到剪贴板";
                tip.style="width:150px;height:50px;text-align:center;border-width:0px;";
                tip.appendChild(tip_txt);
                button.appendChild(tip);
                function click(){
                    let txt="";
                    let fir=true;
                    for(let i=0;i<=7;i++)
                    {
                        if(query_diff(i)){
                            if(!fir){
                                txt+="\n---\n";
                            }
                            fir=false;
                            let arr=JSON.parse(localStorage.getItem(i.toString()+"problems"));
                            arr.sort();
                            for(let j=0;j<arr.length;j++)
                            {
                                let nam="";
                                for(let k=0;k<arr[j].length;k++)
                                {
                                    if(arr[j][k]=='_'){
                                        nam+='\\';
                                    }
                                    if(k&&arr[j][k-1]=='A'&&arr[j][k]=='T'){
                                        nam+='\\!';
                                    }
                                    if(k&&arr[j][k-1]=='U'&&arr[j][k]=='V'){
                                        nam+='\\!';
                                    }
                                    if(k&&arr[j][k-1]=='V'&&arr[j][k]=='A'){
                                        nam+='\\!';
                                    }
                                    nam+=arr[j][k];
                                    if(k&&arr[j][k-1]=='V'&&arr[j][k]=='A'){
                                        nam+='\\!';
                                    }
                                }
                                if(j){
                                    txt+="$\\text{  }$"
                                }
                                txt+="[$\\color{"+col[i]+"}\\small\\text{"+nam+"}$](https://www.luogu.com.cn/problem/"+arr[j]+")\n";
                            }
                        }
                    }
                    navigator.clipboard.writeText(txt);
                    tip.setAttribute("open","");
                    setTimeout(()=>{
                        tip.removeAttribute("open");
                    },"1000");
                }
                button.onclick=click;
            }
        }
    }
    if(window.location.href.match("https://www.luogu.com.cn/record")){
        var rec=window._feInjection.currentData.records.result;
        var uid=window._feInjection.currentUser.uid;
        for(let i=0;i<rec.length;i++)
        {
            if(rec[i].status==12&&rec[i].user.uid==uid){
                work(rec[i].problem);
            }
        }
        let fet=localStorage.getItem("fetch_pages");
        if(fet){
            let num=Number(fet);
            let now=0;
            let web=location.href;
            let nxt="";
            for(let i=0;i+5<=web.length;i++)
            {
                if(web.substr(i,5)=="page="){
                    nxt+="page=";
                    let ext="";
                    for(let j=i+5;j<web.length;j++)
                    {
                        if('0'<=web[j]&&web[j]<='9'){
                            now=now*10+(web[j]-'0');
                        }
                        else{
                            ext=web.substr(j,web.length-j);
                            break;
                        }
                    }
                    nxt+=(now+1).toString();
                    nxt+=ext;
                    break;
                }
                nxt+=web[i];
            }
            if(now){
                if(now==num){
                    localStorage.removeItem("fetch_pages");
                }
                else{
                    location.href=nxt;
                }
            }
        }
    }
    else{
        display();
    }
})();