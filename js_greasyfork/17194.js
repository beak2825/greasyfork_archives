// ==UserScript==
// @namespace    https://greasyfork.org/zh-CN/users/30310-adan1
// @name         微软官方依然在提供Windows 7,8.1全套镜像（精简可读）
// @description  让原代码更好看
// @author       Adan1
// @icon         https://www.microsoft.com/favicon.ico
// @include      https://www.microsoft.com/en-us/software-download/techbench
// @include      https://www.microsoft.com/zh-cn/software-download/techbench
// @include      https://www.microsoft.com/ja-jp/software-download/techbench
// @include      https://www.microsoft.com/fr-fr/software-download/techbench
// @include      https://www.microsoft.com/*/software-download/techbench
// @grant        none
// @version      1.0
// @downloadURL https://update.greasyfork.org/scripts/17194/%E5%BE%AE%E8%BD%AF%E5%AE%98%E6%96%B9%E4%BE%9D%E7%84%B6%E5%9C%A8%E6%8F%90%E4%BE%9BWindows%207%2C81%E5%85%A8%E5%A5%97%E9%95%9C%E5%83%8F%EF%BC%88%E7%B2%BE%E7%AE%80%E5%8F%AF%E8%AF%BB%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/17194/%E5%BE%AE%E8%BD%AF%E5%AE%98%E6%96%B9%E4%BE%9D%E7%84%B6%E5%9C%A8%E6%8F%90%E4%BE%9BWindows%207%2C81%E5%85%A8%E5%A5%97%E9%95%9C%E5%83%8F%EF%BC%88%E7%B2%BE%E7%AE%80%E5%8F%AF%E8%AF%BB%EF%BC%89.meta.js
// ==/UserScript==

// 精简版
var slt = {
      '2': "Windows 7 Home Basic SP1 ",
      '4': "Windows 7 Professional SP1 ",
      '6': "Windows 7 Home Premium SP1 ",
      '8': "Windows 7 Ultimate SP1 ",
     '10': "Windows 7 Home Premium N SP1 ",
     '12': "Windows 7 Professional N SP1 ",
     '14': "Windows 7 Ultimate N SP1 ",
     '16': "Windows 7 Professional K SP1 ",
     '18': "Windows 7 Professional KN SP1 ",
     '20': "Windows 7 Home Premium K SP1 ",
     '22': "Windows 7 Home Premium KN SP1 ",
     '24': "Windows 7 Ultimate KN SP1 ",
     '26': "Windows 7 Ultimate K SP1 ",
     '28': "Windows 7 Starter SP1 ",
     '48': "Windows 8.1 Single Language ",
     '52': "Windows 8.1 ",
     '55': "Windows 8.1 N ",
     '61': "Windows 8.1 K ",
     '62': "Windows 8.1 KN ",
     '68': "Windows 8.1 Professional LE ",
     '69': "Windows 8.1 Professional LE K ",
     '70': "Windows 8.1 Professional LE KN ",
     '71': "Windows 8.1 Professional LE N ",
     '75': "Windows 10 Education (Academic) th1",
     '76': "Windows 10 Education KN (Academic) th1",
     '77': "Windows 10 Education N (Academic) th1",
     '78': "Windows 10 China Get Genuine Chinese Simplified th1",
     '79': "Windows 10 th1",
     '80': "Windows 10 KN th1",
     '81': "Windows 10 N th1",
     '82': "Windows 10 Single Language th1",
     '83': "Windows 7 Home Basic SP1 COEM ",
     '85': "Windows 7 Home Basic SP1 COEM GGK ",
     '86': "Windows 7 Home Premium N SP1 COEM ",
     '87': "Windows 7 Home Premium SP1 COEM ",
     '88': "Windows 7 Home Premium SP1 COEM GGK ",
     '89': "Windows 7 Home Premium K SP1 COEM ",
     '90': "Windows 7 Professional N SP1 COEM ",
     '91': "Windows 7 Professional SP1 COEM ",
     '92': "Windows 7 Starter SP1 COEM ",
     '93': "Windows 7 Ultimate K SP1 COEM ",
     '94': "Windows 7 Ultimate KN SP1 COEM ",
     '95': "Windows 7 Ultimate N SP1 COEM ",
     '96': "Windows 7 Ultimate SP1 COEM ",
     '97': "Windows 7 Home Premium KN SP1 COEM ",
     '98': "Windows 7 Professional KN SP1 COEM ",
     '99': "Windows 10 (1511 th2) ",
    '100': "Windows 10 Education (1511 th2) ",
    '101': "Windows 10 Education KN (1511 th2) ",
    '102': "Windows 10 Education N (1511 th2) ",
    '103': "Windows 10 China Get Genuine Chinese Simplified (1511 th2)",
    '104': "Windows 10 KN (1511 th2) ",
    '105': "Windows 10 N (1511 th2) ",
    '106': "Windows 10 Single Language (1511 th2) "
};
var eb = document.getElementById("product-edition"), ops = eb.options;
//var s = "Select edition"; s = ops[0].innerHTML;
for(var i=1; i<ops.length; /* i++ */){
    var op = ops[i];
    slt[op.value] = op.text; // 不用innerHTML预防部分语言页面的HTML转义
    ops[i] = null; // remove op and ops.length auto -1
}
//ops.length = 0; ops.add(new Option(s, '', true, true));
for(var op in slt){
    ops.add(new Option(slt[op], op));
}
eb.style.cssText = " background-color: blue;  color: yellow;  font-family: consolas; ";
document.getElementById("submit-product-edition").innerHTML += " (WZT)";
console.log("go to http://wzor.net/ or https://twitter.com/WZorNET or https://twitter.com/nummerok :D");
//alert(ops.length==55);



/* 可读版

var edititonbox = document.getElementById("product-edition");
edititonbox.innerHTML = [
    "<option value='' selected='selected'>Select edition</option>", 
    "<option value='2'>Windows 7 Home Basic SP1 </option>", 
    "<option value='4'>Windows 7 Professional SP1 </option>", 
    "<option value='6'>Windows 7 Home Premium SP1 </option>", 
    "<option value='8'>Windows 7 Ultimate SP1 </option>", 
    "<option value='10'>Windows 7 Home Premium N SP1 </option>", 
    "<option value='12'>Windows 7 Professional N SP1 </option>", 
    "<option value='14'>Windows 7 Ultimate N SP1 </option>", 
    "<option value='16'>Windows 7 Professional K SP1 </option>", 
    "<option value='18'>Windows 7 Professional KN SP1 </option>", 
    "<option value='20'>Windows 7 Home Premium K SP1 </option>", 
    "<option value='22'>Windows 7 Home Premium KN SP1 </option>", 
    "<option value='24'>Windows 7 Ultimate KN SP1 </option>", 
    "<option value='26'>Windows 7 Ultimate K SP1 </option>", 
    "<option value='28'>Windows 7 Starter SP1 </option>", 
    "<option value='48'>Windows 8.1 Single Language </option>", 
    "<option value='52'>Windows 8.1 </option>", 
    "<option value='55'>Windows 8.1 N </option>", 
    "<option value='61'>Windows 8.1 K </option>", 
    "<option value='62'>Windows 8.1 KN </option>", 
    "<option value='68'>Windows 8.1 Professional LE </option>", 
    "<option value='69'>Windows 8.1 Professional LE K </option>", 
    "<option value='70'>Windows 8.1 Professional LE KN </option>", 
    "<option value='71'>Windows 8.1 Professional LE N </option>", 
    "<option value='75'>Windows 10 Education (Academic) th1</option>", 
    "<option value='76'>Windows 10 Education KN (Academic) th1</option>", 
    "<option value='77'>Windows 10 Education N (Academic) th1</option>", 
    "<option value='78'>Windows 10 China Get Genuine Chinese Simplified th1</option>", 
    "<option value='79'>Windows 10 th1</option>", 
    "<option value='80'>Windows 10 KN th1</option>", 
    "<option value='81'>Windows 10 N th1</option>", 
    "<option value='82'>Windows 10 Single Language th1</option>", 
    "<option value='83'>Windows 7 Home Basic SP1 COEM </option>", 
    "<option value='85'>Windows 7 Home Basic SP1 COEM GGK </option>", 
    "<option value='86'>Windows 7 Home Premium N SP1 COEM </option>", 
    "<option value='87'>Windows 7 Home Premium SP1 COEM </option>", 
    "<option value='88'>Windows 7 Home Premium SP1 COEM GGK </option>", 
    "<option value='89'>Windows 7 Home Premium K SP1 COEM </option>", 
    "<option value='90'>Windows 7 Professional N SP1 COEM </option>", 
    "<option value='91'>Windows 7 Professional SP1 COEM </option>", 
    "<option value='92'>Windows 7 Starter SP1 COEM </option>", 
    "<option value='93'>Windows 7 Ultimate K SP1 COEM </option>", 
    "<option value='94'>Windows 7 Ultimate KN SP1 COEM </option>", 
    "<option value='95'>Windows 7 Ultimate N SP1 COEM </option>", 
    "<option value='96'>Windows 7 Ultimate SP1 COEM </option>", 
    "<option value='97'>Windows 7 Home Premium KN SP1 COEM </option>", 
    "<option value='98'>Windows 7 Professional KN SP1 COEM </option>", 
    "<option value='99'>Windows 10 (1511 th2) </option>", 
    "<option value='100'>Windows 10 Education (1511 th2) </option>", 
    "<option value='101'>Windows 10 Education KN (1511 th2) </option>", 
    "<option value='102'>Windows 10 Education N (1511 th2) </option>", 
    "<option value='103'>Windows 10 China Get Genuine Chinese Simplified (1511 th2)</option>", 
    "<option value='104'>Windows 10 KN (1511 th2) </option>", 
    "<option value='105'>Windows 10 N (1511 th2) </option>", 
    "<option value='106'>Windows 10 Single Language (1511 th2) </option>"
].join("");
edititonbox.style.backgroundColor = "blue";
edititonbox.style.color = "yellow";
edititonbox.style.fontFamily = "consolas";
document.getElementById("submit-product-edition").innerHTML = "Confir (WZT)";
console.log("go to http://wzor.net/ or https://twitter.com/WZorNET or https://twitter.com/nummerok :D");

*/



