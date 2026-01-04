// ==UserScript==
// @name         中正開課表格優化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  由於中正大學的開課系統在對時間上過於麻煩，用JavaScript生成課表，用於對照時間
// @author       楊長茂(409220055)
// @match        https://kiki.ccu.edu.tw/~ccmisp06/Course/*
// @exclude      https://kiki.ccu.edu.tw/~ccmisp06/Course/
// @exclude      https://kiki.ccu.edu.tw/~ccmisp06/Course/index.html
// @exclude      https://kiki.ccu.edu.tw/~ccmisp06/Course/*_e.html
// @grant        none
// @icon         https://raw.githubusercontent.com/Jeffreymaomao/figure/main/fig3.jpg
// @downloadURL https://update.greasyfork.org/scripts/450788/%E4%B8%AD%E6%AD%A3%E9%96%8B%E8%AA%B2%E8%A1%A8%E6%A0%BC%E5%84%AA%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/450788/%E4%B8%AD%E6%AD%A3%E9%96%8B%E8%AA%B2%E8%A1%A8%E6%A0%BC%E5%84%AA%E5%8C%96.meta.js
// ==/UserScript==


// 更改表格內部的邊緣弧度--------------------------------------------
function adjust_border_radius(radius){
    const box = document.querySelectorAll('td,th');
    for (const element of box) {
        element.style.borderRadius = radius;
    }
}
// 在原有的 object 之後，新增 n 行空白-------------------------------
function newline(n,object){
    for(var i=0;i<n-1; i++){
        object.insertAdjacentHTML('beforeend', '<br>');
    }
}
// 自動調整課表時間的高度--------------------------------------------
function adjust_table_height(){
    var H1 = document.getElementById("R1");
    var H2 = document.getElementById("R2");
    var H3 = document.getElementById("R3");
    var H4 = document.getElementById("R4");
    var H5 = document.getElementById("R5");
    document.getElementById("b1").style.height= "120px";
    document.getElementById("b2").style.height= "120px";
    document.getElementById("b3").style.height= "120px";
    document.getElementById("b4").style.height= "120px";
    document.getElementById("b5").style.height= "120px";
    document.getElementById("b1").style.height= H1.offsetHeight +"px";
    document.getElementById("b2").style.height= H2.offsetHeight +"px";
    document.getElementById("b3").style.height= H3.offsetHeight +"px";
    document.getElementById("b4").style.height= H4.offsetHeight +"px";
    document.getElementById("b5").style.height= H5.offsetHeight +"px";
}
// Xpath 尋找元素--------------------------------------------------
function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
// 輸入值行最上的中文，回傳以下所有中文---------------------------------
function get_column(name){
    var tables = document.getElementsByTagName("table");
    var table_index = 0;
    for(let k = 0; k < tables.length; k++){
        var W = tables[k].rows[0].cells.length;
        if(W == 13){
            table_index = k;
        }
    }
    var table = tables[table_index]
    var width = tables[table_index].rows[0].cells.length;
    var height= tables[table_index].rows.length;
    var column_index = 0;
    var column_text = [];
    for (let i = 0; i < width; i++){
        var TEXT = tables[table_index].rows[0].cells[i].innerText;
        if (TEXT == name){column_index = i;}
    }
    for (let j = 0; j < height; j++){
        column_text.push(tables[table_index].rows[j].cells[column_index].innerText);
    }
    return column_text;
}
// 將中文數字字符轉換成數字輸出---------------------------------------
function change_chinese_to_number(chinese_number){
    var C = chinese_number;
    var n = 1;
    if(C=="一"){n=1};
    if(C=="二"){n=2};
    if(C=="三"){n=3};
    if(C=="四"){n=4};
    if(C=="五"){n=5};
    if(C=="六"){n=6};
    if(C=="日"){n=7};
    return n
}
// 將中文數字字符轉換成數字輸出---------------------------------------
function change_time_to_region(time){
    var c = time;
    var n = 1;
    if(c=="1" ||c=="2" ||c=="3" ||c=="A"||c=="B"){n=1};
    if(c=="4" ||c=="5" ||c=="6" ||c=="C"||c=="D"){n=2};
    if(c=="7" ||c=="8" ||c=="9" ||c=="E"||c=="F"){n=3};
    if(c=="10"||c=="11"||c=="12"||c=="G"||c=="H"){n=4};
    if(c=="13"||c=="14"||c=="15"||c=="I"||c=="J"){n=5};
    return n
}
// 輸入中文時間，回傳時間向量----------------------------------------
function check_time(time){
    time = time.replace(" ","");
    var data_index = []
    for(let i = 0; i < time.length; i++){
        var cha = time[i]
        if(cha=="一"||cha=="二"||cha=="三"||cha=="四"||cha=="五"||cha=="六"||cha=="日"){
            data_index.push(i)
        }
    }
    for(let j = data_index.length-1; j >= 0 ; j--){
        time = time.slice(0, data_index[j]) + "|" + time.slice(data_index[j]);
    }
    time = time.slice(1,time.length);
    time = time.split("|");
    var vector = [];
    for(let k = 0; k < time.length; k++){
        var sub_time = time[k];
        //alert("sub : "+sub_time)
        var W = change_chinese_to_number(sub_time[0]);
        //alert("week : "+W);
        var T = sub_time.slice(1,sub_time.length);
        T = T.split(",")
        for(let l = 0; l < T.length; l++){
            var region = change_time_to_region(T[l]);
            vector.push([W,region,T[l]]);
        }
    }
    return vector
}
// 生程課表矩陣----------------------------------------------------
function generate_array(){
    var times = get_column("上課時間");
    var years = get_column("年級");
    var id = get_column("編號");
    var title = get_column("科目名稱");
    var professor = get_column("任課教授");
    var credit = get_column("學分");
    var people = get_column("限修人數");
    var type = get_column("選必");
    var place = get_column("上課地點");
    var A = [["","","","","","",""],["","","","","","",""],["","","","","","",""],["","","","","","",""],["","","","","","",""]];
    for(let i = 1; i < times.length; i++){
        var vector = check_time(times[i]);
        for(let j = 0; j < vector.length; j++){
            var w = vector[j][0]-1; //week 0~6
            var r = vector[j][1]-1; //region 0 ~ 4
            var t = vector[j][2].replace(" ",""); // 1~15 , A~J
            var num = 1;
            if(type[i]=="必修"){num=1};
            if(type[i]=="選修"){num=2};
            if(type[i]=="通識"){num=3};
            A[r][w] += '<div class="Class'+num+'">';
            A[r][w] += "("+t+")"+ title[i] +"<br>" + professor[i];
            A[r][w] += '<div class="hide">';
            A[r][w] += "年級："+years[i]+"<br>";
            A[r][w] += "人數："+people[i]+"<br>";
            A[r][w] += "學分："+credit[i]+"<br>";
            A[r][w] += "地點："+place[i]+"<br>";
            A[r][w] += "編號："+id[i]+"<br>";
            A[r][w] += "</div></div>";

        }
    }
    return A
}
//----------------------------------------------------------------
// 寫入星期一到星期日的每一個元素，回傳html----------------------------
function generate_region(A="",B="",C="",D="",E="",F="",G=""){
    var html = "<td>" + A + "</td>";
    html += "<td>" + B + "</td>";
    html += "<td>" + C + "</td>";
    html += "<td>" + D + "</td>";
    html += "<td>" + E + "</td>";
    html += "<td>" + F + "</td>";
    html += "<td>" + G + "</td>";
    return html;
}
// 寫入五個時間區塊，回傳html----------------------------------------
function generate_html(R1,R2,R3,R4,R5){
    var html1 = `
    <!DOCTYPE html>
    <html>
    <head>
        <!--<link rel="stylesheet" href="style.css">-->
        <style>
            .table1 {display: table;border-collapse: separate;box-sizing: border-box;text-indent: initial;white-space: normal;line-height: normal;font-weight: normal;font-size: medium;font-style: normal;color: -internal-quirk-inherit;text-align: start;border-spacing: 2px;border-color: #ccc;font-variant: normal;margin: 0 10 0 0}
            .table2 {display: table;border-collapse: separate;box-sizing: border-box;text-indent: initial;white-space: normal;font-weight: normal;font-size: medium;font-style: normal;color: -internal-quirk-inherit;text-align: start;border-spacing: 2px;font-variant: normal;height:auto;width:100%;border="0";}
            tr {padding:1px;display: table-row;}
            td {border-radius:3px;}
            th {border-radius:5px;display: table-cell;vertical-align: inherit;font-weight: bold;}
            .WEEK {background-color:#d9d9f3;border-radius:5px;}
            .TIME {background-color:#d9d9f3;border:solid 0.5px;border-color:#bbb;border-radius:5px;}
            .REGION {padding:0px;background-color:#f4f0e6;border-radius:5px;}
            table {border-radius:10px;}
            .button span {cursor: pointer;display: inline-block;position: relative;transition: 0.5s;}
            .button {display: inline-block;border-radius: 10px;background-color: #656566;border: solid 3px;border-color:#bbb;color: white;text-align: center;font-size: 20px;padding: 10px;width: 200px;transition: all 0.5s;cursor: pointer;margin: 5px;}
            .button span:after {content: '→';position: absolute;opacity: 0;top: 0;right: -20px;transition: 0.5s;}
            .button:hover span {padding-right: 25px;}
            .button:hover span:after {opacity: 1;right: 0;}
            /*時間大框框*/
            .block1	{height:120px;min-width:140px;background-color:rgb(244,244,244);padding:-10px}
            .block2	{width:45%;display:inline-block;text-align:center;border-radius:5px;height:100%;min-height:120px;margin-left:2px;min-width:65px;}
            .block2 table	{height:100%;}
            .block2 td {border:solid 1px;min-width:10px;}
            .REGION td{background-color:#d9d9f3;}
            .WEEK {font-size:15px;font-size:xx-small;font-style: normal;font-weight: normal;}
            .TIME {font-size:xx-small;font-size:xx-small;font-style: normal;font-weight: normal;}
            tr td {font-size:10px;}
            .TIME td, tr{text-align:center;}
            .hide {display: none;}
            /*必修---------------------*/
            .Class1 {border:solid 1px;border-radius:5px;margin:5px;background-color:rgba(255,204,204,0.5);}
            .Class1:hover{position;absolute;display: block;border:solid 1px;border-radius:5px;margin:5px;background-color:rgba(255,204,204,0.8);}
            .Class1:hover  .hide {
            display: block;background-color:rgba(255,255,255,0.8);border:solid 0.5px;border-radius:3px;margin:1px 5px 3px 5px;}
            /*-選修------------------*/
            .Class2 {border:solid 1px;border-radius:5px;margin:5px;background-color:rgba(204,229,255,0.5);}
            .Class2:hover{position;absolute;display: block;border:solid 1px;border-radius:5px;margin:5px;background-color:rgba(204,229,255,0.8);}
            .Class2:hover  .hide {display: block;background-color:rgba(255,255,255,0.8);border:solid 0.5px;border-radius:3px;margin:1px 5px 3px 5px;}
            /*必修---------------------*/
            .Class3 {border:solid 1px;border-radius:5px;margin:5px;background-color:rgba(229,255,204,0.5);}
            .Class3:hover{position;absolute;display: block;border:solid 1px;border-radius:5px;margin:5px;background-color:rgba(229,255,204,0.8);}
            .Class3:hover  .hide {display: block;background-color:rgba(255,255,255,0.8);border:solid 0.5px;border-radius:3px;margin:1px 5px 3px 5px;}
            .div1 {font-size:18px;display: inline-block;border:solid 1px;padding:10px 40px 10px 40px;border-radius: 10px;background-color:rgba(255,204,204,0.5);margin:5px;}
            .div2 {font-size:18px;display: inline-block;border:solid 1px;padding:10px 40px 10px 40px;border-radius: 10px;background-color:rgba(204,229,255,0.5);margin:5px;}
            .div3 {font-size:18px;display: inline-block;border:solid 1px;padding:10px 40px 10px 40px;border-radius: 10px;background-color:rgba(229,255,204,0.5);margin:5px;}
            .div1:hover {background-color:rgba(255,204,204,0.9);}
            .div2:hover {background-color:rgba(204,229,255,0.9);}
            .div3:hover {background-color:rgba(229,255,204,0.9);}
        </style>
    </head>
    <body>
        <hr>
        <p style="text-align:right;margin:10px 100px 10px 0px;font-size:5px">
        by 物理系-楊長茂 ( <a href = "mailto: jeffrey0613mao@gmail.com">jeffrey0613mao@gmail.com</a> )
        </p>
        <!--<span style="margin:100px;"><button class="button" onclick="changeColor();" ><span>Change color</span></button></span><br>-->
        <span style="margin:120px;">
        <div class="div1">必修</div>
        <div class="div2">選修</div>
        <div class="div3">通識</div>
        </span><br>
        <table class="table1" align="center" border="12" width="90%";>
            <tbody>
                <!-------------------------------------------------------------------------------------------------------------------------------->
                <tr>
                    <th class="WEEK" id = "COLOR1"  width="10%">星期/區段</th>
                    <th class="WEEK">一</th>
                    <th class="WEEK">二</th>
                    <th class="WEEK">三</th>
                    <th class="WEEK">四</th>
                    <th class="WEEK">五</th>
                    <th class="WEEK">六</th>
                    <th class="WEEK">日</th>
                </tr>
                <!-------------------------------------------------------------------------------------------------------------------------------->
                <tr valign="center" width="100px">
                    <th class="REGION" id="R1" style="height:auto;">
                        <div class="block1" id="b1">
                        <div class="block2">
                            <table>
                                <tr>
                                    <td rowspan="3" class="TIME">I</td>
                                    <td class="TIME">1</td>
                                    <td class="TIME">7:10<br>8:00</td>
                                </tr>
                                <tr>
                                    <td class="TIME">2</td>
                                    <td class="TIME">8:10<br>9:00</td>
                                </tr>
                                <tr>
                                    <td class="TIME">3</td>
                                    <td class="TIME">9:10<br>10:00</td>
                                </tr>
                            </table>
                        </div>
                        <div class="block2">
                            <table width="55px">
                                <tr>
                                    <td class="TIME">A</td>
                                    <td class="TIME">7:00<br>8:00</td>
                                </tr>
                                    <td class="TIME">B</td>
                                    <td class="TIME">8:10<br>9:00</td>
                                </tr>
                            </table>
                        </div>
                        </div>
                    </th>`;
    var html2 = `</tr>
                <!-------------------------------------------------------------------------------------------------------------------------------->
                <tr valign="center">
                    <th class="REGION" id="R2" style="height:auto;width:auto">
                        <div class="block1" id="b2">
                        <div class="block2">
                            <table>
                                <tr>
                                    <td rowspan="3" class="TIME">II</td>
                                    <td class="TIME">4</td>
                                    <td class="TIME">10:10<br>11:00</td>
                                </tr>
                                <tr>
                                    <td class="TIME">5</td>
                                    <td class="TIME">11:10<br>12:00</td>
                                </tr>
                                <tr>
                                    <td class="TIME">6</td>
                                    <td class="TIME">12:10<br>13:00</td>
                                </tr>
                            </table>
                        </div>
                        <div class="block2">
                            <table width="55px">
                                <tr>
                                    <td class="TIME">C</td>
                                    <td class="TIME">10:15<br>11:30</td>
                                </tr>
                                <tr>
                                    <td class="TIME">D</td>
                                    <td class="TIME">11:45<br>13:00</td>
                                </tr>
                            </table>
                        </div>
                        </div>
                    </th>`;
    var html3 = `
                </tr>
                <!-------------------------------------------------------------------------------------------------------------------------------->
                <tr valign="center">
                    <th class="REGION" id="R3" style="height:auto;width:auto">
                        <div class="block1" id="b3">
                        <div class="block2">
                            <table>
                                <tr>
                                    <td rowspan="3" class="TIME">III</td>
                                    <td class="TIME">7</td>
                                    <td class="TIME">13:10<br>14:00</td>
                                </tr>
                                <tr>
                                    <td class="TIME">8</td>
                                    <td class="TIME">14:10<br>15:00</td>
                                </tr>
                                <tr>
                                    <td class="TIME">9</td>
                                    <td class="TIME">15:10<br>16:00</td>
                                </tr>
                            </table>
                        </div>
                        <div class="block2">
                            <table width="55px">
                                <tr>
                                    <td class="TIME">E</td>
                                    <td class="TIME">13:15<br>14:30</td>
                                </tr>
                                <tr>
                                    <td class="TIME">F</td>
                                    <td class="TIME">14:45<br>16:00</td>
                                </tr>
                            </table>
                        </div>
                        </div>
                    </th>`;
    var html4 = `</tr>
                <!-------------------------------------------------------------------------------------------------------------------------------->
                <tr valign="center">
                    <th class="REGION" id="R4" style="height:auto;width:auto">
                        <div class="block1" id="b4">
                        <div class="block2">
                            <table>
                                <tr>
                                    <td rowspan="3" class="TIME">IV</td>
                                    <td class="TIME">10</td>
                                    <td class="TIME">16:10<br>17:00</td>
                                </tr>
                                <tr>
                                    <td class="TIME">11</td>
                                    <td class="TIME">17:10<br>18:00</td>
                                </tr>
                                <tr>
                                    <td class="TIME">12</td>
                                    <td class="TIME">18:10<br>19:00</td>
                                </tr>
                            </table>
                        </div>
                        <div class="block2">
                            <table width="55px">
                                <tr>
                                    <td class="TIME">G</td>
                                    <td class="TIME">16:15<br>17:30</td>
                                </tr>
                                <tr>
                                    <td class="TIME">H</td>
                                    <td class="TIME">17:45<br>19:00</td>
                                </tr>
                            </table>
                        </div>
                        </div>
                    </th>`;
        var html5 = `</tr>
                <!-------------------------------------------------------------------------------------------------------------------------------->
                <tr valign="center">
                    <th class="REGION" id="R5" style="height:auto;width:auto">
                        <div class="block1" id="b5">
                        <div class="block2">
                            <table>
                                <tr>
                                    <td rowspan="3" class="TIME">V</td>
                                    <td class="TIME">13</td>
                                    <td class="TIME">19:10<br>20:00</td>
                                </tr>
                                <tr>
                                    <td class="TIME">14</td>
                                    <td class="TIME">20:10<br>21:00</td>
                                </tr>
                                <tr>
                                    <td class="TIME">15</td>
                                    <td class="TIME">21:10<br>22:00</td>
                                </tr>
                            </table>
                        </div>
                        <div class="block2">
                            <table width="55px">
                                <tr>
                                    <td class="TIME">I</td>
                                    <td class="TIME">19:15<br>20:30</td>
                                </tr>
                                <tr>
                                    <td class="TIME">J</td>
                                    <td class="TIME">20:45<br>22:00</td>
                                </tr>
                            </table>
                        </div>
                        </div>
                    </th>`;
    var html6 = `
                </tr>
                <!-------------------------------------------------------------------------------------------------------------------------------->
            </tbody>
        </table>
    </body>
    </html>`;
    var html = html1 +R1+ html2 +R2+ html3 +R3+ html4 +R4+ html5 +R5+ html6;
    return html;
};
// 將表格插入在輸入之 tag 之後---------------------------------------
function add_table_after_tags(tags,array){
    var a = array;
    var H1 = document.getElementsByTagName(tags);
    newline(2,H1[0]);
    var R1 = generate_region(a[0][0],a[0][1],a[0][2],a[0][3],a[0][4],a[0][5],a[0][6]);
    var R2 = generate_region(a[1][0],a[1][1],a[1][2],a[1][3],a[1][4],a[1][5],a[1][6]);
    var R3 = generate_region(a[2][0],a[2][1],a[2][2],a[2][3],a[2][4],a[2][5],a[2][6]);
    var R4 = generate_region(a[3][0],a[3][1],a[3][2],a[3][3],a[3][4],a[3][5],a[3][6]);
    var R5 = generate_region(a[4][0],a[4][1],a[4][2],a[4][3],a[4][4],a[4][5],a[4][6]);
    var html = generate_html(R1,R2,R3,R4,R5);
    H1[0].insertAdjacentHTML('beforeend', html);
    newline(2,H1[0])
}
//----------------------------------------------------------------------------------------------------------
// 執行程式
(function() {'use strict';
    //修改弧角度
    adjust_border_radius("5px");
    //生成 table 並加在第一個 tag 之後
    add_table_after_tags("h1",generate_array());
})();
//修正表格內部時間表的高度
var intervalId = window.setInterval(function(){adjust_table_height()}, 10);

