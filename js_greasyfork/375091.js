// ==UserScript==
// @name         PON Raid Sort
// @namespace    1
// @version      0.3
// @description  Простая сортировка рейдов под уровень персонажа.
// @author       http:/pathofninja.ru/info_pl.php?pl=Нет
// @match        *://pathofninja.ru/raid
// @match        *://pon.fun/raid
// @match        *://www.pathofninja.ru/raid
// @match        *://www.pon.fun/raid
// @match        *://148.251.233.231/raid
// @match        *://178.63.14.254/raid
// @icon         http://mrshex.narod.ru/pon/qw.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375091/PON%20Raid%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/375091/PON%20Raid%20Sort.meta.js
// ==/UserScript==



var RTable = unsafeWindow.document.getElementsByClassName('tbl10')[0];
var RHeader = unsafeWindow.document.getElementsByClassName('ttl div_r_top2')[0];
var AddStrValue = '<tr><th class="bg4" width="5%">№<th class="bg4">Персонаж<th class="bg4">Расположение<th class="bg4" width="20%">Время респауна</tr><tr><td colspan="4" align="center"><b><u>МОЁ</u></b></tr>';
var n1 = RTable.childNodes[1].childNodes[3].innerHTML;
var addFirst = '';
var addSecond = '';
var RegTime = /(\d\d)\.(\d\d)\.(\d\d\d\d).(\d\d):(\d\d):(\d\d)/
var founded = [];
var RaidLevel = top.getCookie("ch_level");
var s;

s = "<div>Удобная информация о рейдах. Нужный уровень: <select size='1' selected=`selected` id=`RaidSecletor` value='7' onchange='top.setCookie(`ch_level`,this.value, `Tue, 19 Jan 2099 03:14:07 GMT`); location.reload()'>"
for (var i=5;i<=26;i++) {s+="<option value='"+i+"'>"+i+"</option>"}
s+="</select></div>"
RHeader.innerHTML = s;

function RedrawTable () {

function RTCalc (x)
{
    return (Number(x[6]))+(Number(x[5])*60)+(Number(x[4])*3600)+(Number(x[1])*86400)+(Number(x[2])*2592000)+((Number(x[3])-2018)*31104000);
}

function bubbleSort(arr) {

    for (var i = 0, endI = arr.length - 1; i < endI; i++) {
        var wasSwap = false;

        for (var j = 0, endJ = endI - i; j < endJ; j++) {
            if (RTCalc(arr[j].match(RegTime)) > RTCalc(arr[j + 1].match(RegTime))) {
                var swap = arr[j];

                arr[j] = arr[j + 1];
                arr[j + 1] = swap;
                wasSwap = true;
            }
        }
        if (!wasSwap) break;
    }
    return arr;
}

for (var i=1;i<RTable.childNodes[1].childNodes.length;i++)
{
    var tr = RTable.childNodes[1].childNodes[i].innerHTML;
    var s;
    if (
        (tr.indexOf('['+(String(Number(RaidLevel)-1))+']')>0 )||
        (tr.indexOf('['+(String(RaidLevel)+']'))>0 )||
        (tr.indexOf('['+(String(Number(RaidLevel)+1))+']')>0 )
       )
    {
        s = tr.match(RegTime);
        if (s == null) addFirst+=(tr+'<tr>'); else founded.push(tr);
    }
    else addSecond+=(tr+'<tr>');
}

bubbleSort(founded);

for (var i in founded)
 {
     addFirst+=(founded[i]+'<tr>');
 }

RTable.innerHTML ='<tbody>'+AddStrValue+addFirst+addSecond+'</tbody>';
};

RedrawTable();