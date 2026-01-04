// ==UserScript==
// @name         Faction Attack Counter
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  try to take over the world!
// @author      H1k3
// @grant       GM_setClipboard
// @include       https://www.torn.com/factions.php?step=your*
// @run-at      document-end

// @downloadURL https://update.greasyfork.org/scripts/408850/Faction%20Attack%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/408850/Faction%20Attack%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
var api_key = '';//-----------------CHANGE HERE
var members = new Array();var indexsave;var members2 = new Array();

var timer=1000000000;
const now = new Date()
const secondsSinceEpoch = Math.round(now.getTime() / 1000)
var d_to = parseInt(secondsSinceEpoch),d_from=d_to-86400;
var trigger = 0;var number = 0;var count=0;var call = "",call2="";var number2 = 0;var me2=true;
addStuff();
function appendButton(){
	var buttonEl = document.createElement("a");
	buttonEl.id = "cad";
	var buttonTextEl = document.createElement("button");
	buttonTextEl.className = "copy_a_d";
	buttonTextEl.innerHTML = "Copy Attack Data";
	buttonEl.appendChild(buttonTextEl);
	document.getElementById("top-page-links-list").appendChild(buttonEl);
   }

appendButton();
document.getElementById("cad").addEventListener("click", function(){GM_setClipboard(members2.replace(/},/g,'\n').replace(/{/g,'').replace('[','').replace(']',''));});
$.post("https://api.torn.com/faction/?selections=&key="+api_key, function(data, status){
$.each(data.members, function(index, value) {
    members.push({name: value.name, id: index,last_on: value.last_action.relative,loss: 0, success: 0, respect: 0, escape: 0,lastpull: 0});
});
   //console.log(members);//Object.keys(data.attacks).length);// alert("Data: " + data + "\nStatus: " + status);
  });call="https://api.torn.com/faction/?selections=attacksfull&key="+api_key+"&from="+1000000000;
call_attacks();
function call_attacks(){
setTimeout(function(){

$.post("https://api.torn.com/faction/?selections=attacksfull&key="+api_key+"&from="+timer.toString(), function(data, status){trigger=0;
if(Object.keys(data.attacks).length === 0 && data.attacks.constructor === Object){console.log("utoh");}//console.log(data);
else{$.each(data.attacks, function(index, value) {
   if(trigger==0){number2=index;d_to=parseInt(value.timestamp_started);trigger=1;}
if(parseInt(value.timestamp_ended)>parseInt(timer)){timer=value.timestamp_ended;}

   members.forEach(function(item,index2){
   if(members[index2].id==value.attacker_id&&members[index2].lastpull<index)
   {members[index2].lastpull=index;
    if(value.result=="Lost"){members[index2].loss++;}
    else if(value.result=="Attacked"){members[index2].success++;members[index2].respect =Math.round(members[index2].respect+value.respect_gain);}
    else if(value.result=="Mugged"){members[index2].success++;members[index2].respect =Math.round(members[index2].respect+value.respect_gain);}
    else if(value.result=="Hospitalized"){members[index2].success++;members[index2].respect =Math.round(members[index2].respect+value.respect_gain);}
    else if(value.result=="Special"){members[index2].success++;members[index2].respect =Math.round(members[index2].respect+value.respect_gain);}
    else if(value.result=="Stalemate"){members[index2].loss++;}
    else if(value.result=="Timeout"){members[index2].loss++;}
    else if(value.result=="Interrupted"){members[index2].loss++;}
    else if(value.result=="Assist"){members[index2].success++;}
    else if(value.result=="Escape"){members[index2].escape++;}
    else{console.log(value);}

   }
   //if(members[index].id==value.attacker_id&&value.respect_gain>0){members[index].respect =members[index].respect+value.respect_gain;members[index].success++;}
   //else if(members[index].id==value.attacker_id&&value.result=="Lost"){members[index].loss++;}
   //else if(members[index].id==value.attacker_id&&value.respect_gain==0){members[index].loss++;}
   else if(members[index2].id==value.defender_id&&members[index2].lastpull<index)
   {members[index2].lastpull=index;
    if(value.result=="Lost"){members[index2].success++;}
    else if(value.result=="Attacked"){members[index2].loss++;}
    else if(value.result=="Mugged"){members[index2].loss++;}
    else if(value.result=="Hospitalized"){members[index2].loss++;}
    else if(value.result=="Escape"){members[index2].escape++;}
    else if(value.result=="Assist"){members[index2].loss++;}
    else if(value.result=="Stalemate"){members[index2].loss++;}
    else if(value.result=="Timeout"){members[index2].loss++;}
    else if(value.result=="Interrupted"){members[index2].loss++;}
    //else{console.log(value);}

       //console.log(value);.members[index2].respect.toFixed(2);
   }
   });

});call="https://api.torn.com/faction/?selections=attacksfull&key="+api_key+"&start=1000";
     //var mess2;
     var mess= "";// = JSON.stringify(members.sort());
     members2 = JSON.parse(JSON.stringify(members));//members.slice(0);
     var table = document.getElementById("hhStats");//console.log(table);
//     $("#hhStats").find("tr").click(function(){
//    $(this).addClass('selected').siblings().removeClass('selected');
//    var value=$(this).find('td:nth-child(2)').html();
    //alert(value);

//});
    // var table = document.getElementById("mytab1");
//for (var i2 = 0, rows; rows = table.rows[i2]; i2++) {
  //   for (var j = 0, col; col = rows.cells[j]; j++) {
     //iterate through cells
     //cells would be accessed using the "cell" variable assigned in the for loop
//console.log(col);
     for (var i = 0; i < members2.length; i++) {
         if ($('#hhStats td:contains(' + members2[i].name + ')').length) {
         $('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[0].innerHTML=members2[i].name;
         $('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[1].innerHTML=members2[i].respect;
         $('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[2].innerHTML=members2[i].success;
         $('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[3].innerHTML=members2[i].loss;
         $('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[4].innerHTML=members2[i].last_on;
         $('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[5].innerHTML=members2[i].id;
$('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[6].innerHTML=members2[i].lastpull;//sortTable();
          //var cell8
        if(members2[i].success<50){$('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[7].innerHTML = "E1";}
        else if(members2[i].success<100){$('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[7].innerHTML = "E2";}
        else if(members2[i].success<150){$('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[7].innerHTML = "E3";}
        else if(members2[i].success<200){$('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[7].innerHTML = "E4";}
        else if(members2[i].success<250){$('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[7].innerHTML = "E5";}
        else if(members2[i].success<300){$('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[7].innerHTML = "E6";}
        else if(members2[i].success<350){$('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[7].innerHTML = "E7";}
        else if(members2[i].success<400){$('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[7].innerHTML = "E8";}
        else if(members2[i].success<450){$('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[7].innerHTML = "E9";}
        else if(members2[i].success<500){$('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[7].innerHTML = "E9-2";}
        else if(members2[i].success<550){$('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[7].innerHTML = "E9-3";}
        else if(members2[i].success<600){$('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[7].innerHTML = "W1";}
        else if(members2[i].success<650){$('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[7].innerHTML = "W2";}
        else if(members2[i].success<700){$('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[7].innerHTML = "W3";}
        else if(members2[i].success<750){$('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[7].innerHTML = "W4";}
        else if(members2[i].success<800){$('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[7].innerHTML= "O1";}
        else if(members2[i].success<850){$('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[7].innerHTML = "O2";}
        else if(members2[i].success<900){$('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[7].innerHTML = "O3";}
        else if(members2[i].success<1000){$('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[7].innerHTML = "O4";}
        else if(members2[i].success<1050){$('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[7].innerHTML = "O5";}
        else if(members2[i].success<1100){$('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[7].innerHTML = "O6";}
        else if(members2[i].success<1150){$('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[7].innerHTML = "O7";}
        else if(members2[i].success<1200){$('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[7].innerHTML = "O8";}
        else if(members2[i].success<1250){$('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[7].innerHTML = "O9";}
        else if(members2[i].success<1300){$('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[7].innerHTML = "O10";}
        else if(members2[i].success<1350){$('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode.children[7].innerHTML = "O11";}
       // console.log($('#hhStats td:contains(' + members2[i].name + ')')[0].parentNode);
    } else {
        var row = table.insertRow(1);
         var cell1 = row.insertCell(0);cell1.innerHTML = ""+members2[i].name;
         var cell2 = row.insertCell(1);cell2.innerHTML = ""+members2[i].respect;
         var cell3 = row.insertCell(2);cell3.innerHTML = ""+members2[i].success;
         var cell4 = row.insertCell(3);cell4.innerHTML = ""+members2[i].loss;
         var cell5 = row.insertCell(4);cell5.innerHTML = ""+members2[i].last_on;
         var cell6 = row.insertCell(5);cell6.innerHTML = ""+members2[i].id;
         var cell7 = row.insertCell(6);cell7.innerHTML = ""+members2[i].lastpull;//sortTable();
        var cell8;
        if(members2[i].success<50){cell8 = row.insertCell(7);cell8.innerHTML = "E1";}
        else if(members2[i].success<100){cell8 = row.insertCell(7);cell8.innerHTML = "E2";}
        else if(members2[i].success<150){cell8 = row.insertCell(7);cell8.innerHTML = "E3";}
        else if(members2[i].success<200){cell8 = row.insertCell(7);cell8.innerHTML = "E4";}
        else if(members2[i].success<250){cell8 = row.insertCell(7);cell8.innerHTML = "E5";}
        else if(members2[i].success<300){cell8 = row.insertCell(7);cell8.innerHTML = "E6";}
        else if(members2[i].success<350){cell8 = row.insertCell(7);cell8.innerHTML = "E7";}
        else if(members2[i].success<400){cell8 = row.insertCell(7);cell8.innerHTML = "E8";}
        else if(members2[i].success<450){cell8 = row.insertCell(7);cell8.innerHTML = "E9";}
        else if(members2[i].success<500){cell8 = row.insertCell(7);cell8.innerHTML = "E9-2";}
        else if(members2[i].success<550){cell8 = row.insertCell(7);cell8.innerHTML = "E9-3";}
        else if(members2[i].success<600){cell8 = row.insertCell(7);cell8.innerHTML = "W1";}
        else if(members2[i].success<650){cell8 = row.insertCell(7);cell8.innerHTML = "W2";}
        else if(members2[i].success<700){cell8 = row.insertCell(7);cell8.innerHTML = "W3";}
        else if(members2[i].success<750){cell8 = row.insertCell(7);cell8.innerHTML = "W4";}
        else if(members2[i].success<800){cell8 = row.insertCell(7);cell8.innerHTML = "O1";}
        else if(members2[i].success<850){cell8 = row.insertCell(7);cell8.innerHTML = "O2";}
        else if(members2[i].success<900){cell8 = row.insertCell(7);cell8.innerHTML = "O3";}
        else if(members2[i].success<1000){cell8 = row.insertCell(7);cell8.innerHTML = "O4";}
        else if(members2[i].success<1050){cell8 = row.insertCell(7);cell8.innerHTML = "O5";}
        else if(members2[i].success<1100){cell8 = row.insertCell(7);cell8.innerHTML = "O6";}
        else if(members2[i].success<1150){cell8 = row.insertCell(7);cell8.innerHTML = "O7";}
        else if(members2[i].success<1200){cell8 = row.insertCell(7);cell8.innerHTML = "O8";}
        else if(members2[i].success<1250){cell8 = row.insertCell(7);cell8.innerHTML = "O9";}
        else if(members2[i].success<1300){cell8 = row.insertCell(7);cell8.innerHTML = "O10";}
        else if(members2[i].success<1350){cell8 = row.insertCell(7);cell8.innerHTML = "O11";}
        //console.log("No");
    }


        // var html2;

//document.getElementById("hhStats").children[0].children[0].insertAdjacentHTML("beforeend", html2);
    delete members2[i].id;delete members2[i].lastpull;

    //Do something
}sortTable(); members2 = members2.sort();members2 = JSON.stringify(members2);
//sortTable();
     number=number2;count=1;console.log(members);call_attacks();}

  });
}, 2000);}

members2.sort(function(a,b) {
    return parseInt(a.success) - parseInt(b.success);
});
function addStuff() {
    var html = '<table id="hhStats" style="float:right; border: 1px solid black;width:100%;text-align:center;">';
    //for (var i = 0; i < 10; i++)
        html += '<tr><th>' +"User"+ '</th><th>' +"Respect"+ '</th><th>'+"Success"+'</th><th>'+"Loss"+'</th><th>'+"Last On"+'</th><th>'+"ID"+'</th><th>Last Logged</th><th>Rank</th></tr>';
//html += '<tr><th>' +"User"+ '</th><th>' +"Respect"+ '</th><th>'+"Success"+'</th><th>'+"Loss"+'</th><th>'+"Last On"+'</th><th>'+"ID"+'</th><th>Last Logged</th></tr>';
    html += '</table>';
//document.getElementById("faction-news").appendChild(html);
    document.getElementById("factions")
            .insertAdjacentHTML("beforeend", html);console.log(document.getElementById("hhStats").children[0].children[0]);
}
function sortTable() {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("hhStats");
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[2];
      y = rows[i + 1].getElementsByTagName("TD")[2];
      //check if the two rows should switch place:
      if (Number(x.innerHTML) > Number(y.innerHTML)) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}