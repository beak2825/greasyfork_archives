// ==UserScript==
// @name         Maccabi Overtime - Thursday
// @version      2.0
// @description  Overtime calculator for Maccabi employees.
// @author       Shay Cohen
// @include      http://lavie/timenet/tb2020.aspx
// @namespace https://greasyfork.org/users/313606
// @downloadURL https://update.greasyfork.org/scripts/386936/Maccabi%20Overtime%20-%20Thursday.user.js
// @updateURL https://update.greasyfork.org/scripts/386936/Maccabi%20Overtime%20-%20Thursday.meta.js
// ==/UserScript==

(function() {

unsafeWindow.on = true;
setInterval (readTable, 1000);

function convertMinsToHrsMins(minutes) {
  var flag = false;
  if(minutes<0){
            minutes = minutes*(-1);
            flag = true;
  }
  var h = Math.floor(minutes / 60);
  var m = minutes % 60;
  h = h < 10 ? '0' + h : h;
  m = m < 10 ? '0' + m : m;
  if(flag){
    var str = '-' + h + ':' + m + ' :שעות חוסר';
            return str;
  }
  return h + ':' + m + ' :שעות עודפות';
}

function diffTime(s1, s2){
            var b1 = s1.split(':');
            var reserv1 = new Date(0,0,0,b1[0],b1[1])
            var b2 = s2.split(':');
            var reserv2 = new Date(0,0,0,b2[0],b2[1])
            var timeDiff = ((reserv2 -reserv1)/1000)/60
            return timeDiff
}

function getSpanValue(s) {
    var innerObj = s;
    var index = innerObj.indexOf("</span>");
    var objValue = "";
    objValue = innerObj.substring(index-1,index);
    return objValue;
    }

function getInnerValue(s) {
    var innerObj = s
            var index = innerObj.indexOf("value=");
            var objValue = "";
            if(index>0){
            index+=7;
                        var tempStr = innerObj.substring(index,innerObj.lenght);
                        var tempIndex = tempStr.indexOf("\"");
                        tempIndex+=index;
                        objValue = innerObj.substring(index,tempIndex);
                        return objValue;
            }
    }
function readTable () {
    if (unsafeWindow.on){
    var oTable = document.getElementById('DataGrid1');
    var rowLength = oTable.rows.length;
    var overTime = 0;
    var workTime = 540;
    var workTimeRe = 540;//09:00 Regular Work Day
    var workTimeThu = 510;//08:30 Thursday Work Day
    var a=$('#DataGrid1_lbldate_0').text().split('/');
    var  startDay =4 - new Date(2000+a[2]*1+"  "+a[1]+" "+a[0]).getDay();
    var today = new Date();
	var curTime = today.getHours() + ":" + today.getMinutes();

     startDay = startDay <0 ? startDay+7 :startDay;
    for (var i = 0; i < rowLength; i++){

      //gets cells of current row
       var oCells = oTable.rows.item(i).cells;
       var cellLength = oCells.length;
       var count =0;
       var temp = 0;
       var flag = false;
       if(cellLength >13){
       workTime = (i-startDay)%7==0 ? workTimeThu: workTimeRe;
       	var cellVal1 = getInnerValue(oCells.item(11).innerHTML);
       	var cellVal2 = getInnerValue(oCells.item(12).innerHTML);
	    var cellVal3 = getInnerValue(oCells.item(3).innerHTML);
        var cellVal4 = getInnerValue(oCells.item(4).innerHTML);
	    var cellVal5 = getInnerValue(oCells.item(7).innerHTML);
        var cellVal6 = getInnerValue(oCells.item(8).innerHTML);
	if(cellVal1 && cellVal2){
			overTime += diffTime(cellVal2,cellVal1);
			//console.log(cellVal1 + "    " +cellVal2);
            flag = true;
	      }
    if(cellVal3 && cellVal4){
			overTime += diffTime(cellVal4,cellVal3);
			//console.log(cellVal3 + "    " + cellVal4);
            flag = true;
           }
	if(cellVal5 && cellVal6){
			overTime += diffTime(cellVal6,cellVal5);
			//console.log(cellVal5 + "    " +cellVal6);
           flag = true;
           }
       if(flag == true){
          overTime = overTime - workTime;
           flag = false;
       }
      }
    }
    //console.log(convertMinsToHrsMins(overTime))
    var doc = document.getElementById('lmif');
    doc.innerHTML = convertMinsToHrsMins(overTime);
    //alert(convertMinsToHrsMins(overTime))
    //unsafeWindow.on = false;
    }
}
})();

