// ==UserScript==
// @name Bexio Verrechnungsfaktor-Berechnung
// @namespace Script Runner Pro
// @include https://office.bexio.com/index.php/monitoring/list/*
// @match https://office.bexio.com/index.php/monitoring/list
// @grant GM_getValue
// @grant GM_setValue
// @description Fügt eine Verrechnungsfaktor-Button in der Bexio-Zeiterfassungsliste hinzu
// @version 2.80
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498352/Bexio%20Verrechnungsfaktor-Berechnung.user.js
// @updateURL https://update.greasyfork.org/scripts/498352/Bexio%20Verrechnungsfaktor-Berechnung.meta.js
// ==/UserScript==

  
const block = $("[href='/index.php/monitoring/edit']").parent();
const filterButton = document.createElement("a");
var heute = new Date();

//Date-Override
//heute = new Date("2024-06-10T00:00:00.000+00:00");

var month = heute.getMonth()+1;
var btnTextBase = "clocko:do ↔ bexio";

function checkApiKey() {
  let actualKey = GM_getValue('ClockodoApiKey', 0);
  if (actualKey == 0) {
    let key = prompt('Bitte gib einmalig den ApiKey aus Clockodo an. Er wird hinterher nur auf deinem Gerät gespeichert.');
    if (key != null)  GM_setValue('ClockodoApiKey',key);
  }
}
function checkUser() {
  let actualUser = GM_getValue('ClockodoUser', '');
  if (actualUser == '') {
    let user = prompt('Bitte gib einmalig deine User-Email aus Clockodo an. Er wird hinterher nur auf deinem Gerät gespeichert.');
    if (user != null)  GM_setValue('ClockodoUser',user);
  }
}

function getDayOfMonth(date) {
  let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
  return day;
}
function getMonthAndYear(date) {
  let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
  let month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
  return month + "." + year;
}

function formatDateForBexio(date) {
  let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
  let month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
  let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
  return day + "." + month + "." + year;
}

function formatDateForClockodo(date, isTo) {
  let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
  let month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
  let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
  var retValue = year + "-" + month + "-" + day;
  if (isTo) {
    retValue += "T23:59:59Z";
  } else {
    retValue += "T00:00:00Z";
  }
  return retValue;
}

function manageClockodoEntries(entries) {
  var total = 0;
  $(entries).each(function(index) {
    total += this.duration;
  });
  return total;
}

function formatTwoDecimals(input) {
  return input.toFixed(2);
}

function getSollFromClockodo(from, to, callback) {
  var from = formatDateForClockodo(from, false);
  var to = formatDateForClockodo(to, true);
  var url = "https://my.clockodo.com/api/v2/entries?time_since="+from+"&time_until="+to+"&enhanced_list=1";
  var apiKey = GM_getValue('ClockodoApiKey', 0);  
  var user = GM_getValue('ClockodoUser', "");  
  $.ajax({
    type: "GET",
    beforeSend: function(request) {
      request.setRequestHeader("X-Clockodo-External-Application", "modan;modan@modan.ch");
      request.setRequestHeader("X-ClockodoApiUser", user);
      request.setRequestHeader("X-ClockodoApiKey", apiKey);
    },
    url: url,
    processData: true,
    success: function(msg) {
      var value = manageClockodoEntries(msg.entries);
      callback(value/60/60, msg.entries);
    },
    error: function(msg) {
      callback(0, null);
    }
  });  
}

function setButtonText() {
  $(filterButton).text(btnTextBase+" - "+monthtext);
}

function generateTable(from, to, clockododata, fakt) {

  var totalText = "Total inkl. heute"
  var content = "";
  content += "<br><table class='table table-striped table-condensed table-hover mx-4'>";
  content += "<thead><tr><th>Datum</th><th class='r'>Arbeitszeiterfassung Clockodo</th><th class='r'>Leistungserfassung Bexio</th><th class='r'>Differenz</th><th class='r'>Anz. Einträge Bexio</th><th class='r'>Faktor</th></tr></thead>";
  content += "<tbody>";
  
  var my = getMonthAndYear(from);
  var totalist = 0, totalsoll = 0; totalhbexio = 0, totalhcd = 0, totalEntriesBexio = 0;
  var takethisday = true;
  
  for (i=1;i<=getDayOfMonth(to);i++) {

    takethisday = true;
    var ds = i;
    if (i < 10) { ds = "0" + i} else {ds = "" + i};
    var actDateText = ds + "." + my;
    
    var totaldaybx = 0;
    var totaldayentries = 0;
    $("#dataTable tr").each(function(index) {
      var date = $(this).children().eq(0).text().trim();
      var value = $(this).children().eq(7).text().trim();
      var h = value.substr(0,2)*1;
      var hd = (value.substr(3,2)/60)
      if (date == actDateText) {
        totaldaybx += (h + hd);
        totalhbexio += (h + hd);
        totaldayentries++;
        totalEntriesBexio++;
      }
    });  

    if ((i == heute.getDate()) && (totaldayentries==0)) {
      //heute nicht zählen wenn noch keine bexio einträge
      takethisday = false;
      totalText = "Total ohne heute"
    }
    
    var totaldaycd = 0;
    $(clockododata).each(function(index) {
      var nf = actDateText.substr(6,4) + "-" + actDateText.substr(3,2) + "-" +  actDateText.substr(0,2);
      var ts = this.time_since.substr(0,10);
      if (ts == nf) {
        totaldaycd += this.duration/60/60;
        if (takethisday) totalhcd += this.duration/60/60;
      }
    });

    if (takethisday) {
      totalsoll += totaldaycd;
      totalist += totaldaybx;
    }

    totaldaycd = Math.round(totaldaycd*100)/100;
    totaldaybx = Math.round(totaldaybx*100)/100;
    
    if ((totaldaycd > 0) | (totaldaybx > 0)) {
      var dif = Math.round((totaldaybx - totaldaycd)*100)/100;
      var diftext = formatTwoDecimals(dif)+"h";
      if (dif == 0) { diftext = ""; };
      var faktd = 100/totaldaycd*totaldaybx;
      faktd = Math.round(faktd*10)/10;
      var add1 = "";
      var add2 = "";
      if (faktd == 100) {
        add1 = "<small>"
        add2 = "</small>"
      }
      var addStyle = "";
      if (takethisday==false) {
        addStyle = "text-decoration: line-through;";
      }
      content += "<tr>";
      content += "<td>" + actDateText + "</td>";
      content += "<td class='r'>"+formatTwoDecimals(totaldaycd)+"h</td>";
      content += "<td class='r'>"+formatTwoDecimals(totaldaybx)+"h</td>";
      content += "<td class='r'>"+diftext+"</td>";
      content += "<td class='r'>"+totaldayentries+"</td>";
      content += "<td class='r' style='color:"+getColForValue(faktd)+";"+addStyle+"'>"+add1+formatTwoDecimals(faktd)+"%"+add2+"</td>";
      content += "</tr>";
    }
  }
  
  var fakt = 100 / totalsoll * totalist;
  fakt = Math.round(fakt*100)/100;
  totalhcd = Math.round(totalhcd*100)/100;
  totalhbexio = Math.round(totalhbexio*100)/100;
  
  content += "<tr>";
  content += "<td class=''><b>"+totalText+"</b></td>";
  content += "<td class='r'>"+formatTwoDecimals(totalhcd)+"h</td>";
  content += "<td class='r'>"+formatTwoDecimals(totalhbexio)+"h</td>";
  content += "<td></td>";
  content += "<td class='r'>"+totalEntriesBexio+"</td>";
  content += "<td class='r'><b style='color:"+getColForValue(fakt)+"''>"+formatTwoDecimals(fakt)+"%</b></td>"
  content += "</tr>";
  content += "</tbody>";
  content += "</table><br>"; 
  
  var holder = $(".dataTableHolder");
  holder.prepend(content);
}


function getColForValue(value) {

  var col = 'rgb(51, 51, 51)';
  if (value < 80)
    col = 'rgb(173, 30, 2)';
  if (value > 90)
    col = 'rgb(2,150,56)';
  
  return col;
}

$(filterButton).addClass("btn btn-light js-first-btn");
let monthtext = heute.toLocaleString('default', { month: 'long' });
setButtonText();

checkApiKey();
checkUser();

$(filterButton).click(function() {
  $(filterButton).text(btnTextBase + " - wait...");
  $("#contentContainer").animate({opacity: 0.5}, 100);
  var firstofmonth = new Date(heute.getFullYear(),month-1,1);
  $("#monitoring_filters_date_from").val(formatDateForBexio(firstofmonth));
  var lastofmonth = new Date(heute.getFullYear(),month,0);
  $("#monitoring_filters_date_to").val(formatDateForBexio(lastofmonth));
  
  //toggleFilter($('.halflings-filter').parent())
  var vna = $('.bx-main-user-img').parent().text().split(" ");
  let vorname = vna[0];
  let nachname = vna[1];
  var select = $('#monitoring_filters_user_id');
  select.find("option").removeAttr("selected");
  let nnvn = nachname+" "+vorname;
  let persopt = select.find("option:contains('"+nnvn+"')");
  persopt.attr("selected","selected");
  
  $(".bx-formular-filter .btn-primary").click();
  setTimeout(function() {
    getSollFromClockodo(firstofmonth, lastofmonth, function(soll, cddata) {
      setButtonText();
      generateTable(firstofmonth, lastofmonth, cddata);
      $("#contentContainer").animate({opacity: 1}, 500);
    }) 
  }, 1800);
});

block.prepend("&nbsp;");
block.prepend(filterButton);
