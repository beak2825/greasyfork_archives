// ==UserScript==
// @name        LK getCSV
// @namespace   LK getCSV Script
// @match       https://lk.mango-office.ru/profile/*
// @grant       none
// @version     1.1
// @author      -
// @description 31.07.2020, 12:23:08
// @downloadURL https://update.greasyfork.org/scripts/407975/LK%20getCSV.user.js
// @updateURL https://update.greasyfork.org/scripts/407975/LK%20getCSV.meta.js
// ==/UserScript==

var timeInterval = setInterval(()=>{
  if (document.getElementsByClassName('members-line__header').length == true) {
    clearInterval(timeInterval); initCSV();
  }
},500);

function initCSV() {
  document.getElementsByClassName('members-line__title')[0].innerHTML += '<button id="csvbutton" style="right: 31px; position: absolute;">CSV</button>';
  document.getElementById('csvbutton').onclick = function(){getcsv();}
}
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}
async function getcsv() {
  let response = await fetch("https://lk.mango-office.ru/profile/"+location.href.split('/')[4]+"/"+location.href.split('/')[5]+"/api/presence", {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,bg;q=0.6,uk;q=0.5,be;q=0.4,kk;q=0.3,ku;q=0.2,cs;q=0.1,eo;q=0.1",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin"
    },
    "referrer": "https://lk.mango-office.ru/profile/"+location.href.split('/')[4]+'/'+location.href.split('/')[5],
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  });
  if (response.ok) {
    let json = await response.json();
    let csv = "User;Domain;SIP;User-Agent;IP\r\n";
      json.forEach(element => {       
          if (Object.keys(element.sip).length  + Object.keys(element.mtm).length + Object.keys(element.mtd).length != 0) { 
              element.sip.forEach(sip => {
                  let uac = sip.uac.split('|').join('_');
                  uac = uac.split(';').join('_');
                  csv = csv + sip.uname.split('@')[0] + ';' + sip.uname.split('@')[1] + ';' + sip.uname + ';' + uac + ';' + sip.ip;
                  csv = csv + '\r\n';
              });
              element.mtm.forEach(mtm => {
                  csv = csv + mtm.uname.split('@')[0] + ';' + mtm.uname.split('@')[1] + ';' + mtm.uname + ';M.TALKER MOBILE ' + mtm.uac.split('mtm.')[1] + ';' + mtm.ip;
                  csv = csv + '\r\n';
              });
              element.mtd.forEach(mtd => {
                  csv = csv + mtd.uname.split('@')[0] + ';' + mtd.uname.split('@')[1] + ';' + mtd.uname + ';M.TALKER DESKTOP ' + mtd.uac.split('mtd.')[1] + ';' + mtd.ip;
                  csv = csv + '\r\n';
              });
              //element.cc.forEach(cc => {
              //    console.log(cc);
              //    csv = csv + cc.device + ';' + cc.device + ';' + cc.uname + ';CCC' + cc.uac.split('VCC')[1] + ';' + cc.ip;
              //    csv = csv + '\r\n';
             // });
          }
  }); 

  download(csv, 'Список.csv', 'text/csv');
  } else {
    alert("Ошибка HTTP: " + response.status);
  }
}