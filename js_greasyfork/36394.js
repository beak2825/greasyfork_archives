// ==UserScript==
// https://github.com/hannsen/userscripts
// @name        actiTIME to Ausbilungsnachweis
// @namespace     https://actitime.net/
// @version         1.9
// @description      creates IHK Ausbilungsnachweis from actitime sheet | Greasemonkey 4.1: ✕ Tampermonkey 4.4: ✔
// @author         hoannsi
// @match         https://ktr.quodata.de/actitime*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/36394/actiTIME%20to%20Ausbilungsnachweis.user.js
// @updateURL https://update.greasyfork.org/scripts/36394/actiTIME%20to%20Ausbilungsnachweis.meta.js
// ==/UserScript==

azubiName = "azubiName";
ausbildungsbereich = "ausbildungsbereich";



var createCookie = function(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
};

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

//cookie laden, wenn leer meine daten rein
try{azubiList =  JSON.parse(getCookie('azubiList'));}
catch(err){azubiList = [azubiName , ausbildungsbereich];}

today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

if(dd<10){
    dd='0'+dd;
}
if(mm<10){
    mm='0'+mm;
}
var today = dd+'.'+mm+'.'+yyyy;


//wann zur arbeit gekommen
workTimes=[];
var i = 0;

// Holt die Ankunfszeit aus den Kommentaren der ersten Zeile
function getWorkTime(){
    $('.cursorImageLink')[i].click();
    setTimeout( function(){
        if( $("#editDescriptionPopupText")[0].value){
            workTimes.push( $("#editDescriptionPopupText")[0].value);
        }
        else{
            workTimes.push('9:00');
        }
        if(i < 4){
            i++;
            getWorkTime();
        }
    }, 100);

}

zeitVom = "";
zeitBis = "";
yearFound = "";

function getTimes(){
    splitTimes = $('#ext-gen10').html().split(',');

    yearFound = splitTimes[1];
    splitTimes = splitTimes[0].split('-');

    zeitVom = splitTimes[0];
    zeitBis =    splitTimes[1];
}

//wieviel stunden gearbeitet:  workTotal=['mo','di','mi','do','fr','total'];
workTotal=[];

function getWorkTotal(){
    workTotal.push(document.getElementById('dayTotal[0]').innerHTML);
    workTotal.push(document.getElementById('dayTotal[1]').innerHTML);
    workTotal.push(document.getElementById('dayTotal[2]').innerHTML);
    workTotal.push(document.getElementById('dayTotal[3]').innerHTML);
    workTotal.push(document.getElementById('dayTotal[4]').innerHTML);
    workTotal.push(document.getElementById('weekTotal').innerHTML);
}

// supTask = ["manueller Test durch QD-Mitarbeiter (PROLab-Weiterentwicklung)", undefined, undefined, "4:06", "", "", "", "1:10", "", "", undefined, undefined]
allTasks=[];
function getTasks(){
    //zeilen level
    $('.taskNameColumn').each(function(){

        var supTask=[];
        //task namen
        supTask.push( '• ' + $(this).find('.task').html() + ' (' + $(this).find('.customer').html()  + ' / ' + $(this).find('.project').html() + ')' );

        //jede spalte in momentaner zeile
        $(this).siblings().each(function(){
            supTask.push(   $(this).find('.text.inputTT').val()   );
        });
        //falls Task frozen, gibt es keine input fields, wir brauchen alternative methode  calendarWorkingDayNormal
        if(typeof supTask[3] == "undefined"){
              supTask.splice(1 , 11);
                   $(this).siblings().each(function(){
                       supTask.push(   $(this).find('.text.completedTimeText').text()   );
                   });
           }
 console.log(  supTask[3].match(/\s*--.*/gi)  );
        allTasks.push(supTask);
    });
}

// createDay(1) is monday, 5 is friday
//returns html code to be filled into table
function createDay( dayNumber , getTime){
    var output = "";
    for(var i =0; i<allTasks.length; i++){
        if(allTasks[i][dayNumber + 2].match(/\s*--.*/gi) !== null) allTasks[i][dayNumber + 2] = '';

        if(allTasks[i][dayNumber + 2] !== "" ){
            if(getTime){output = output + allTasks[i][dayNumber + 2] + '<br>' ;}
            else{output = output + allTasks[i][0] + '<br>';}
        }
    }
    return output;
}



function addTimes(in1, in2){
        var in1Save =in1;
        in1 = in1.split(':');
        in2 = in2.split(':');

        var hours = parseInt(in1[0]) + parseInt(in2[0]);
        var mins = parseInt(in1[1]) + parseInt(in2[1]);

        if(mins > 59){
            hours++;
            mins = mins % 60;
        }

        mins = mins.toString();

        var pad = "00";
        var minsGood = pad.substring(0, pad.length - mins.length) + mins;

        return in1Save + '-' + hours + ':' + minsGood;
   }

function newWin() {
  var w = window.open();
  var html = newHTML;

    $(w.document.body).html(html);
}

$(document).ready(function(){

    $('#taskSelectControl').parent().after('<a href="javascript:void(0)" id="actiToAusbildungButton"> Actime 2 Ausbildungsnachweis</a> <input id="azubiName" value="'+ azubiList[0] + '"></input><input id="fachrichtung" value= "'+ azubiList[1] + '"></input>');
    $('#actiToAusbildungButton').on("click" , function(){

        azubiList[0] = $('#azubiName').val();
        azubiList[1] = $('#fachrichtung').val();
        var json_str = JSON.stringify(azubiList);
        createCookie('azubiList', json_str, 60);
        getWorkTime();
        getWorkTotal();
        getTasks();
        getTimes();
        setTimeout( function(){
            createHTML();
             newWin();
        },600);

    } );
});



newHTML="";
function createHTML(){
newHTML = `
<!DOCTYPE html><html>
<style type="text/css" media="print">
@page {
    size: auto;   /* auto is the initial value */
    margin: 0;  /* this affects the margin in the printer settings */
}
</style>
<style type="text/css">
* {font-size:10px;}
.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{font-family:Arial, sans-serif;font-size:10px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}
.tg th{font-family:Arial, sans-serif;font-size:10px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}
.tg .tg-yw4l{vertical-align:top}

table {width:90% ; margin:auto;}

</style>

<table class="tg">
  <tr>
    <th class="tg-031e" colspan="2">Name des/der Auszubildenden:  ` + azubiList[0] +  `</th>
  </tr>
  <tr>
    <td class="tg-031e">Ausbildungsjahr: ` + yearFound + ` </td>
    <td class="tg-031e">Ausbildungsbereich: ` + azubiList[1] + `</td>
  </tr>
  <tr>
    <td class="tg-yw4l">Ausbildungswoche vom: ` + zeitVom + ` </td>
    <td class="tg-yw4l">bis: ` + zeitBis + `</td>
  </tr>
</table>
<br>
<table class="tg">
  <tr>
    <th class="tg-yw4l"></th>
    <th class="tg-yw4l">Betriebliche Tätigkeiten, Unterweisungen, betrieblicher Unterricht, <br>sonstige Schulungen, Themen des Berufsschulunterrichts</th>
    <th class="tg-yw4l">Arbeitszeit<br>von/bis</th>
    <th class="tg-yw4l">Zeit in<br>h</th>
  </tr>
  <tr>
    <td class="tg-yw4l days" rowspan="2">Montag</td>
    <td class="tg-yw4l" rowspan="2">` + createDay(1, false) +`</td>
    <td class="tg-yw4l" rowspan="2"> ` +  addTimes( workTimes[0] , workTotal[0] ) + `</td>
    <td class="tg-yw4l">` + createDay(1, true) +`</td>
  </tr>
  <tr>
    <td class="tg-yw4l"> &sum; ` + workTotal[0] +  `</td>
  </tr>
  <tr>
    <td class="tg-yw4l days" rowspan="2">Dienstag</td>
    <td class="tg-yw4l" rowspan="2">` + createDay(2, false) +`</td>
    <td class="tg-yw4l" rowspan="2"> ` +  addTimes( workTimes[1] , workTotal[1] ) +  ` </td>
    <td class="tg-yw4l">` + createDay(2, true) +`</td>
  </tr>
  <tr>
    <td class="tg-yw4l"> &sum; ` + workTotal[1] +  `</td>
  </tr>
  <tr>
    <td class="tg-yw4l days" rowspan="2">Mittwoch</td>
    <td class="tg-yw4l" rowspan="2">` + createDay(3, false) +`</td>
    <td class="tg-yw4l" rowspan="2"> `+  addTimes( workTimes[2] , workTotal[2] ) +  ` </td>
    <td class="tg-yw4l">` + createDay(3, true) +`</td>
  </tr>
  <tr>
    <td class="tg-yw4l"> &sum; ` + workTotal[2] +  `</td>
  </tr>
  <tr>
    <td class="tg-yw4l days" rowspan="2">Donnerstag</td>
    <td class="tg-yw4l" rowspan="2">` + createDay(4, false) +`</td>
    <td class="tg-yw4l" rowspan="2"> `+  addTimes( workTimes[3] , workTotal[3] ) +  ` </td>
    <td class="tg-yw4l">` + createDay(4, true) +`</td>
  </tr>
  <tr>
    <td class="tg-yw4l"> &sum; ` + workTotal[3] +  `</td>
  </tr>
  <tr>
    <td class="tg-yw4l days" rowspan="2">Freitag</td>
    <td class="tg-yw4l" rowspan="2">` + createDay(5, false) +`</td>
    <td class="tg-yw4l" rowspan="2"> ` +  addTimes( workTimes[4] , workTotal[4] ) +  ` </td>
    <td class="tg-yw4l">` + createDay(5, true) +`</td>
  </tr>
  <tr>
    <td class="tg-yw4l"> &sum; ` + workTotal[4] +  `</td>
  </tr>

  <tr>
    <td class="tg-yw4l" colspan="3" align="right" >Gesamtstunden der Woche:</td>
    <td class="tg-yw4l"> &sum; ` + workTotal[5] +  `</td>
  </tr>
</table>
<div style="width:95% ; margin:auto; font-family:Arial, sans-serif; text-align:center;">
<br> __ Anzahl Fehltage krank    __ Anzahl Tage Berufschule     __ Anzahl Tage Unternehmen <br> <br> </div>

<table class="tg">
  <tr>
    <td class="tg-031e">Besondere Bemerkungen Auszubildende/r:  <br> <br> </td>
    <td class="tg-031e">Weitere Sichtvermerke (z.B.: Berufsschule, …): <br> <br> </td>
  </tr>
  <tr>
    <td class="tg-yw4l"> ` + today + `<br> <br>Datum / Unterschrift / Auszubildende/r</td>
    <td class="tg-yw4l">` + today + `<br> <br>Datum / Unterschrift / Ausbildender bzw. Ausbilder/in</td>
  </tr>
</table>



</html>
`;
}
