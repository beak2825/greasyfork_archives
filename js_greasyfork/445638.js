// ==UserScript==
// @name         Hellorf Extend
// @namespace    使用图片编号在hellorf获取标题并生成excel表格
// @version      2.0
// @description  输入编号(多个编号以英文逗号","分割)
// @author       Yuzu
// @match        https://*.hellorf.com/*
// @icon         https://tse1-mm.cn.bing.net/th/id/R-C.f732f32bdda55fbe0757bbcd22e2645f?rik=JiXn9hkSYwD0Bw&riu=http%3a%2f%2fwx1.sinaimg.cn%2fbmiddle%2fbf4d90e8gy1ghc7tzufofj207v07d755.jpg
// @grant        none
// @connect      *
// @require      https://cdn.bootcdn.net/ajax/libs/clipboard.js/2.0.11/clipboard.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.core.min.js
// @license      Ookinayuzu



// @downloadURL https://update.greasyfork.org/scripts/445638/Hellorf%20Extend.user.js
// @updateURL https://update.greasyfork.org/scripts/445638/Hellorf%20Extend.meta.js
// ==/UserScript==

//类
class message {
    constructor(number, title) {
        this.number = number;
        this.title = title;
    }
}
window.hasZh= function(str){//判断字符串是否有中文
    for(var i = 0;i < str.length; i++)
    {
        if(str.charCodeAt(i) > 255){ //如果是汉字，则字符串长度加2
            return true;}
        return false;
    }
}

window.get_lastchild = function (n)
{
    var x=n.lastChild;
    while (x.nodeType!=1)
    {
        x=x.previousSibling;
    }
    return x;
}

window.myDisplayer= function() {
    'use strict';
    let num = document.getElementById("number").value;
    document.getElementById("num1").innerHTML = num;
}

window.getURL = function() {
    'use strict';
    let num = document.getElementById("number").value;
    var url = "https://www.hellorf.com/image/show/" + num;
    /*console.log(url);*/
    //myDisplayer(num);
    return url;
}

window.myDisplayer= function() {
    'use strict';
    let num = document.getElementById("number").value;
    document.getElementById("num1").innerHTML = num;
}
window.openFile = function(event) {//读取txt
    var input = event.target;
    window.XLSX = XLSX
    var reader = new FileReader();
    let files = event.target.files;
    let file = files[0];
    reader.readAsBinaryString(file);
    reader.onload = function(e) { //处理load事件。读取操作完成时触发。
        let data = e.target.result;
        let workbook = XLSX.read(data, {type: 'binary'}); //XLSX：/xlsx.core.min.js 通过XLSX.read(data, {type: type})方法读取excel 后面介绍
        console.log(workbook );
        let sheetNames = workbook.SheetNames; // 工作表名称集合
        let worksheet = workbook.Sheets[sheetNames[0]]; // 这里我们只读取第一张sheet
        let txt = XLSX.utils.sheet_to_txt(worksheet); //  读取workbook  这里可以自己写方法输出表格 这里建议使用XLSX.utils.工具类输出数据   这里以json格式输出数据 还有其他格式 代码后介绍
        console.log(txt);
        var a = txt;


        var num= a.replace(/[\u4e00-\u9fa5]|[a-zA-Z]/g, "");

        num = num.trim();
        num = num.replace(/[\s+\r+\n+]/g+",");
        num = num.replace(/[^0-9]/ig,",");

        num = num.replaceAll(",,,",",");




         //num= num.replace("xxx", ",");
        console.log(num);
        //console.log(arr1);
        var number = document.getElementById("number");
         number.value = num;
        if(typeof(callback) == "function") callback(json); //回调
        document.getElementById('readLocalFile').value = null; //读取后清空
    };
};


window.newChart = function(){
    // 获取输入的值（即input中的value值）
    //var id = document.getElementById("id").value;
    //console.log("new chart");
    var id=1;
    var num2 = document.getElementById("num1").value;
    //console.log(num2);
    var title2 = document.getElementsByClassName("col3").innerHTML;
    //console.log(title2);

    // 改变原本得到的数据格式为textNode格式
    id = document.createTextNode(id);
    num2 = document.createTextNode(num2);//console.log(num2);
    title2 = document.createTextNode(title2);
    //console.log(title2);

    // 创建tr（创建行）
    var tr = document.createElement("tr");
    // 创建td，并赋于class和值（创建单元格，并输入值）
    var td1 = document.createElement("td");
    td1.className = "col1";
    td1.appendChild(id);
    var td2 = document.createElement("td");
    td2.className = "col2";
    td2.innerText= num2;
    td2.appendChild(num2);
    var td3 = document.createElement("td");
    td3.className = "col3";td3.innerText= col3.innerHTML;
    td3.appendChild(title2);

    // 创建input，并设置按键反应（编辑、删除 按钮）


    // 获取table1
    var table = document.getElementById("table1");
    // 将tr加入table中
    table.appendChild(tr);
    // 将td依次加入tr中
    tr.appendChild(td1);
    // tr.appendChild(idTd);
    tr.appendChild(td2);
    tr.appendChild(td3);

}


//css
var mainDiv ='<style type="text/css"> html { font-family: sans-serif; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } body { margin: 10px; } ';
mainDiv += 'table { border-collapse: collapse; border-spacing: 0; margin:15px;width:90%;font-size:13px} .tableTitle{background-color:lightskyblue;font-weight: bold;} td, th { padding: 0; } .pure-table { border-collapse: collapse; border-spacing: 0; empty-cells: show; border: 1px solid #cbcbcb; } .pure-table caption { color: #000; font: italic 85%/1 arial, sans-serif; padding: 1em 0; text-align: center; } .pure-table td, .pure-table th { border-left: 1px solid #cbcbcb; border-width: 0 0 0 1px; font-size: inherit; margin: 0; overflow: visible; padding: 0.5em 1em; }';
mainDiv+=' .pure-table thead { background-color: #e0e0e0; color: #000; text-align: left; vertical-align: bottom; } .pure-table-bordered td { border-bottom: 1px solid #cbcbcb; } .pure-table-bordered tbody > tr:last-child > td { border-bottom-width: 0; }';
mainDiv += ' #col1{ font-weight: bold;} input#clip{margin : 15px;}input#btnClose { float: right; margin: 10px; padding: 3px 6px; }div#inputPlac2 { margin: 15px; width: 100%; align-items: center; } input#number {overflow:scroll;width: 80%;margin:10px} #keywords{margin: 10px 10px 10px 10px;width: 76%;}div#inputPlac{margin: 15px;width: 100%;align-items: center;} #main1 {overflow-x:auto;overflow-y:auto;right:10%;box-shadow: 1px 1px 20px #000000; z-index: 99999; text-align: left; border: 3px solid green; margin: 0px auto; width: 80%; height: 80%; position: fixed; top: 100px; background-color: white; align-items: center; justify-content: center; } ';
mainDiv += '.markdown-body .highlight pre, .markdown-body pre { padding: 16px; overflow: auto; font-size: 85%; line-height: 1.45; background-color: var(--color-canvas-subtle); border-radius: 6px; } * { box-sizing: border-box; } .btn { position: relative; display: inline-block; padding: 5px 16px; font-size: 14px; font-weight: 500; line-height: 20px; white-space: nowrap; vertical-align: middle; cursor: pointer; -webkit-user-select: none; user-select: none; border: 1px solid; border-radius: 6px; -webkit-appearance: none; appearance: none; } .ClipboardButton { position: relative; } .btn { color: var(--color-btn-text); background-color: var(--color-btn-bg); border-color: var(--color-btn-border); box-shadow: var(--color-btn-shadow),var(--color-btn-inset-shadow); transition: 80ms cubic-bezier(0.33, 1, 0.68, 1); transition-property: color,background-color,box-shadow,border-color; }';
mainDiv +='</style>';
//mainDiv += '$color-gray: #666; $color-black: #000; $stripe-height: 6px; $btn-color: $color-gray; $btn-background: #fff; $btn-color-hover: #fff; $btn-background-hover: $color-gray; $border-color: $color-gray; $border-color-hover: $color-black; @mixin reset-button { overflow: visible; margin: 0; padding: 0; border: 0; background: transparent; font: inherit; line-height: normal; cursor: pointer; -moz-user-select: text; &:-moz-focus-inner { padding: 0; border: 0; } } @keyframes stripe-slide { 0% { background-position: 0% 0; } 100% { background-position: 100% 0; } } body { width: 100%; height: 100vh; display: flex; justify-content: center; align-items: center; flex-direction: column; font-family: sans-serif; } .btn {@include reset-button; z-index:99999;display: block; text-decoration: none; text-transform: uppercase; padding: 16px 36px 22px; background-color: $btn-background; color: $btn-color; border: 2px solid $border-color; border-radius: 6px; margin-bottom: 16px; transition: all 0.5s ease; &--stripe { overflow: hidden; position: relative; &:after { content:""; display: block; height: $stripe-height; width: 100%; background-image: repeating-linear-gradient( 45deg, $border-color, $border-color 1px, ); -webkit-backface-visibility: hidden; backface-visibility: hidden; position: absolute; left: 0; bottom: 0; background-size: $stripe-height $stripe-height; } &:hover { background-color: $btn-background-hover; color: $btn-color-hover; border-color: $border-color-hover; &:after { background-image: repeating-linear-gradient( 45deg, $btn-color-hover, $btn-color-hover 1px, ); } } } }';


//html
mainDiv +='<div id ="main1"><div><input id="btnClose" class = "btn btn--stripe" type="button" value="X" onClick="custom_close()" />';
//输入框
mainDiv +='<div style="border:3px dot grey;margin:10px;height:70%;width:90%;border-style:double;"><div id = "inputPlac" class = "input">  <span>编号：</span> <input type="text" id="number" name="number" > ';
mainDiv +='<p id="p1"><input type="file" id="readLocalFile" class="fileBtn" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onchange="openFile(event)" multiple="false" style="display:inline-block"><input type ="button" class ="btn btn--stripe" id ="submit1" value="submit" style="display:inline-block"/></p>';
mainDiv +='</div>';
//输出结果
mainDiv +='</div><button class = "btn btn--stripe" style="margin:10px 10px 0px 15px;display:inline-block;"><a id="toExcel">导出excel</a></button><span id="loading"></span><span id="loading1"></span>';


mainDiv +='<table  class="pure-table pure-table-bordered" id="table1" cellspacing="0px" > <tr class="tableTitle" align="center"> <td class="col1">序号</td> <td class="col2">图片编号</td> <td class="col3">标题</td> </tr> </table></div></div></div>';




//console.log("1");//插入div至html
let div=document.createElement("div");
div.innerHTML = mainDiv;
document.body.append(div);



let script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.src = "https://cdn.bootcdn.net/ajax/libs/clipboard.js/2.0.11/clipboard.js";
document.documentElement.appendChild(script);
//var Clipboard;
(function(){
    var clipboard = new ClipboardJS('.copy');
    clipboard.on('success', function(e) {
        console.log(e);
    });

    clipboard.on('error', function(e) {
        console.log(e);
    });})();

window.custom_close = function (){
    'use strict';
    if(confirm("确定要关闭脚本吗？")){
        window.opener=null;
        window.open('','_self');
        //window.close();
        var a = document.getElementById("main1");
        a.remove("div");
    }
    else{
    }
}

let btn = document.getElementById("submit1");

var col3 = document.getElementsByClassName("col3");
btn.onclick = function(){
    //输入框是否是空的
    var loading1 = document.getElementById("loading1");
    var loading = document.getElementById("loading");

    var num = document.getElementById("number").value; //console.log("num ="+ num);
    if(num.length == 0){
        alert("输入框为空！");

    }else{
        //console.log(3);
        var numArray = num.split(",");//console.log(numArray);
        var i = 0;var url1;var xhr1=[];var urlArray = [];var j=1;
        for(i = 0; i < numArray.length; i++){
            console.log("正在获取第"+i+"个标题的信息");
            $("#loading").text ="正在获取第"+i+"个标题的信息";
            loading.innerHTML = "已获取了"+i+"个标题的信息";
            var c = numArray[i];
            xhr1[i]= new XMLHttpRequest();
            xhr1[i].onreadystatechange = () => {
                urlArray[i] = "https://www.hellorf.com/image/show/"+ numArray[i]
                var col3 = document.getElementsByClassName("col3");
                //console.log(numArray[i]);
                //numArray[i] = document.getElementById("number").value;
                url1 = "https://www.hellorf.com/image/show/"+ numArray[i];

                //console.log("c1="+numArray[i]);
                //console.log("urlArray="+urlArray[i]);
                if (xhr1[i].readyState !== 4) {
                    return;
                }
                if (xhr1[i].readyState == 4 && xhr1[i].status == 200) {
                    var numIndex = numArray.indexOf(numArray[i]);
                    //url1 = "https://www.hellorf.com/image/show/"+ numArray[numIndex];
                    //console.log("??url1="+url1);

                    //console.log(xhr1[i].response);
                    //console.log(xhr1[i].responseXML);
                    /*this.ResponseXML;*/

                    var demo = xhr1[i].responseXML;
                    var a = 1 ;
                    a = demo.getElementsByTagName("title");

                    var b = a[0].innerHTML;
                    var n = b.replace("站酷海洛_正版图片_视频_字体_音乐素材交易平台_站酷旗下品牌", "");
                    //var n = b.split("_");
                    //console.log(n);

                    if(n.length <= 0){
                        j=j-1;
                        console.log("编号"+numArray[i]+"不正确");

                        //numArray.splice(numArray.indexOf(c[i]),1);
                        //console.log("j="+j+"Numarray = "+numArray);
                        //continue;
                    }
                    else {
                        b.indexOf("_");
                        b = b.slice(0,b.indexOf("_"));//console.log(b);
                        //document.getElementById("num1").innerHTML = numArray[i];

                        //document.getElementById("title1").innerHTML = b;
                        //document.getElementsByClassName("col3").innerHTML = b;
                        //title2 = b;




                        // 获取输入的值（即input中的value值）
                        //var id = document.getElementById("id").value;



                        var id= j;
                        //console.log("j="+j);
                        var num2 = numArray[i];
                        //console.log("num2 = "+num2);
                        var title2 = b;
                        // console.log("num2 = "+ title2);


                        // 改变原本得到的数据格式为textNode格式
                        id = document.createTextNode(id);
                        //id.innerHTML= "${vs1.index+1}";
                        num2 = document.createTextNode(num2);
                        //console.log("c2+"+num2);
                        title2 = document.createTextNode(title2);
                        //console.log(title2);

                        // 创建tr（创建行）
                        var tr = document.createElement("tr");
                        // 创建td，并赋于class和值（创建单元格，并输入值）
                        var td1 = document.createElement("td");
                        td1.className = "col1";
                        td1.appendChild(id);

                        var td2 = document.createElement("td");
                        td2.className = "col2";
                        //td2.innerText= num2;
                        td2.appendChild(num2);

                        var td3 = document.createElement("td");
                        td3.className = "col3";
                        //td3.innerText= col3.innerHTML;
                        var x = col3;var autoId = "autoTitleId" + j;
                        var autoIdTarget = "#"+autoId;

                        td3.setAttribute('id', autoId);
                        td3.appendChild(title2);

                        var copyBtn = document.createElement("input");
                        //copyBtn.setAttribute('id', 'clip');
                        copyBtn.setAttribute('class', 'btn copy btn--stripe"');
                        copyBtn.setAttribute('type', 'button');
                        copyBtn.setAttribute('data-clipboard-action', 'copy');
                        copyBtn.setAttribute('data-clipboard-target', autoIdTarget);
                        copyBtn.setAttribute('value', 'Copy');
                        td3.appendChild(copyBtn);
                        //td3.appendChild(copyBtn);copyBtn.innerHTML='<input id = "clip" class = "btn copy" type = "button" data-clipboard-action="copy" data-clipboard-target=autoIdTarget value = "Copy"/>';

                        // 获取table1
                        var table = document.getElementById("table1");
                        // 将tr加入table中
                        table.appendChild(tr);
                        // 将td依次加入tr中
                        tr.appendChild(td1);
                        // tr.appendChild(idTd);
                        tr.appendChild(td2);
                        tr.appendChild(td3); j++;
                        return b;
                    }

                }else {
                    console.log('request error');
                }

            };

            urlArray[i] = "https://www.hellorf.com/image/show/"+ numArray[i];
            //console.log(url1)
            xhr1[i].open("GET", urlArray[i], false);
            /* 如果已指明，responseType 必须是空字符串或 "document"*/
            //xhr1[i].responseType = "document";

            /* overrideMimeType() 用来强制解析 response 为 XML*/
            xhr1[i].overrideMimeType("text/xml");
            xhr1[i].send();

        } //console.log("跳出循环");

    }

}
// var num = document.getElementById("number").value;

var element = document.getElementById("toExcel");
var toExcel = function(event) {//生成excel文件

    // 获得表格数据的html标签和文本d;
    //var html = "<html><head><meta charset='UTF-8'></head><body>"+document.getElementById("table1").outerHTML+"</body></html>";
    // 创建一个Blob对象，第一个参数是文件的数据，第二个参数是文件类型属性对象
    //var blob = new Blob([html],{type:"application/vnd.ms-excel"});
    //var a = event.target;
    // 利用URL的createObjectURL方法为元素a生成blobURL
    //a.href = URL.createObjectURL(blob);
    //console.log(a.href);
    //a.download = "chart";
    // 设置文件名
    window.XLSX = XLSX
    var table1 = document.querySelector("#table1");
    var sheet = XLSX.utils.table_to_book(table1);//将一个table对象转换成一个sheet对象
    XLSX.writeFile(sheet, 'chart.xlsx');
}
element.onclick = toExcel;





