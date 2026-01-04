// ==UserScript==
// @name         Avistaz Plus
// @version      1.6
// @description  This extension simply calculates the required seeding time and displays it in the hours seeded box. Colors Ratio accordingly. Many other QOL features to come. - This is not affiliated with Avistaz. At all. -
// @author       Improved Avistaz
// @match        https://avistaz.to/profile/*/history*
// @match        https://avistaz.to/torrent*
// @match        https://avistaz.to/profile/*/bonus
// @match        https://privatehd.to/profile/*/history*
// @match        https://privatehd.to/torrent*
// @match        https://privatehd.to/profile/*/bonus
// @match        https://cinemaz.to/profile/*/history*
// @match        https://cinemaz.to/torrent*
// @match        https://cinemaz.to/profile/*/bonus
// @grant        none
// @run-at       document-end
// @namespace http://your-namespace.com
// @downloadURL https://update.greasyfork.org/scripts/474530/Avistaz%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/474530/Avistaz%20Plus.meta.js
// ==/UserScript==

function AddedSeeding() {
  const table = document.getElementsByClassName('table table-condensed table-striped table-bordered')[0]
  const firstTorrent=table.children[1].children[0]
  const span = firstTorrent.children[8].querySelector('span')
  const addedTime = (span.dataset.originalTitle).substring(0, 10)
  const remainingDays = Math.ceil((new Date(addedTime).setDate(new Date(addedTime).getDate() + 89) - Date.now()) / (1000 * 60 * 60 * 24));
  const newDiv = document.createElement("div");
  newDiv.style.display = "flex";
  newDiv.style.justifyContent = "center";
  newDiv.style.alignItems = "center";
  newDiv.style.marginTop = "40px";
  newDiv.style.padding = "15px";
  newDiv.style.fontSize = "16px"; // Change this value to whatever size you prefer
  if (remainingDays>15){
        newDiv.className = "badge-extra text-green";
  }else{newDiv.className = "badge-extra text-red";}
  newDiv.textContent = `  Your Latest torrent has been added on ${addedTime} you have ${remainingDays} days to add a new torrent.`;
    table.parentNode.insertBefore(newDiv, table);
    document.querySelectorAll('tbody > tr').forEach(el => {
    const cells = el.querySelectorAll('td');
    const Seededtimeraw = cells[10].querySelector('span').getAttribute('data-original-title');
    const Seedingtimeraw = Seededtimeraw.match(/(\d+(\.\d+)?)/g);
    const Seedingtime = Math.ceil(parseInt(Seedingtimeraw) / 60);
    const Ratio = cells[7].querySelector('.text-bold').textContent;
    const rawDownload = cells[6].querySelector('.text-red').textContent;
    var Match = rawDownload.match(/(\d+(\.\d+)?)\s*(GB|MB|KB|TB|B)\b/i);
    if (Match) {
      var DownloadedGB = parseFloat(Match[1]);
      var unit = Match[3];
      unit === "TB" ? DownloadedGB *= 1024 : unit === "MB" ? DownloadedGB /= 1024 : unit === "KB" ? DownloadedGB /= 1024 ** 2 : DownloadedGB = DownloadedGB
    }
    else Match = "0";

    var result = DownloadedGB <= 1 ? result = 72 : DownloadedGB > 1 && DownloadedGB < 50 ? result = Math.ceil(72 + 2 * DownloadedGB) : DownloadedGB > 50 ? result = Math.ceil(100 * Math.log(DownloadedGB) - 219.2023) : 0

    var difference = result - Seedingtime

    const appendedValue = Seedingtime;
    const seedingCell = cells[10];
    const textToDisplay = Seedingtime + 'h / ' + result + 'h';
    seedingCell.textContent = textToDisplay;
    Seedingtime > result ? seedingCell.style.color = 'green' : seedingCell.style.color = 'red';

    const ratioCell = cells[7];
    ratioCell.textContent = Ratio;
    ratioCell.classList.add('badge-extra');
    ratioCell.style.marginLeft = '5px';
    ratioCell.style.marginTop = '5px';
    Ratio > 0.9 ? ratioCell.style.color = 'green' : ratioCell.style.color = 'lightcoral';
  });
}
function HitandRun() {
  const data = [];
  var table = document.querySelector("#content-area > div:nth-child(5) > div.table-responsive");
  document.querySelectorAll('tbody > tr').forEach(el => {
    const cells = el.querySelectorAll('td');
    var name = cells[0].innerText;
    console.log(name)
    if (name.includes('Size')) {
      const rawDownload = cells[1].textContent;
      console.log(rawDownload)
      var Match = rawDownload.match(/(\d+(\.\d+)?)\s*(GB|MB|KB|TB|B)\b/i);
      if (Match) {
        var DownloadedGB = parseFloat(Match[1]);
        let torrentinfo = (DownloadedGB * 0.9).toFixed(3);
        var unit = Match[3];
        unit === "TB" ? DownloadedGB *= 1024 : unit === "MB" ? DownloadedGB /= 1024 : unit === "KB" ? DownloadedGB /= 1024 ** 2 : DownloadedGB = DownloadedGB
      }
      var result = DownloadedGB <= 1 ? result = 72 : DownloadedGB > 1 && DownloadedGB < 50 ? result = Math.ceil(72 + 2 * DownloadedGB) : DownloadedGB > 50 ? result = Math.ceil(100 * Math.log(DownloadedGB) - 219.2023) : 0
      var days = Math.floor(result / 24);
      var hours = result % 24;
      console.log(days + ' days and ' + hours + ' hours');
      const size = cells[1].textContent;
      var clone = el.cloneNode(true);
      var cloneCells = clone.querySelectorAll('td');
      cloneCells[0].textContent = "Hit and Run";
      cloneCells[0].style.fontWeight = 'bold';
      let torrentinfo = (DownloadedGB * 0.9).toFixed(2);
      console.log(torrentinfo,DownloadedGB)
      console.log(torrentinfo,rawDownload)
      cloneCells[1].textContent = `If you download this torrent you will need to upload ${torrentinfo} GB or seed for ${days} days and ${hours} hours.`;
      el.parentNode.insertBefore(clone, el.nextSibling);
      return;
    }
  })
}
function addedBonus(){var showNext = true;
var showEach = true;

var tbl = document.getElementsByTagName('table')[1];

var perHour = parseFloat(document.documentElement.innerHTML.match(/<strong>(\d+(?:\.\d*)?)<\/strong> points per hour/)[1]);
perHour = perHour == 0 ? -1 : perHour;
var total = parseFloat(document.documentElement.innerHTML.match(/<strong>Total:<\/strong> (\d+\.\d{2})/)[1]);

var th = document.createElement("th");
th.appendChild(document.createTextNode("ETA " + ((showNext || showEach) ? (" (" + (showNext ? "next" : "") + ((showNext && showEach) ? "/" : "") + (showEach ? "each" : "") + ")") : "")));
var header = tbl.getElementsByTagName('thead')[0].rows[0];
header.insertCell(2);
header.cells[2].appendChild(th);

for(var i = 1; i < tbl.rows.length; i++) {
    var row = tbl.rows[i];
    var cost = parseInt(row.cells[1].innerHTML.match(/\d+(?:,\d+)?/)[0].replace(',', ''));
    var total_mod = total % cost;

    var duration = (Math.max(0, cost - total) / perHour)/24;
    var next_duration = (Math.max(0, cost - total_mod) / perHour)/24;
    var each_duration = (cost/perHour)/24;
    if(perHour == -1) {
        duration = 0;
        next_duration = 0;
        each_duration = 0;
    }

    var content = duration.toFixed(2) + ((showNext || showEach) ? (" (" + (showNext ? next_duration.toFixed(2) : "") + ((showNext && showEach) ? "/" : "") + (showEach ? each_duration.toFixed(2) : "") + ")") : "") + " days"
    var content_right = Math.floor(total/cost);
    createCell(row.insertCell(2), content, "float:left;");
    createCell(row.cells[2], content_right, "float:right;font-weight:bold;");
}

function createCell(cell, text, style) {
    var div = document.createElement('div'),
        txt = document.createTextNode(text);
    div.setAttribute('style', style);
    div.appendChild(txt);
    cell.appendChild(div);
}}
// This checks the URL and picks which function to run.
var currentURL = window.location.href;
console.log(currentURL)
// Check the URL and decide which function to execute
if (currentURL.includes("/history")) {
  AddedSeeding(); // Execute function for Type 1 URL
} else if (currentURL.includes("/torrent")) {
  HitandRun(); // Execute function for Type 2 URL
} else if (currentURL.includes("/bonus")) {
  addedBonus(); // Execute function for Type 2 URL
} else {
  // Handle other URLs or provide a default action
  console.log("This URL doesn't match any known types");
}


// Many thanks to the kind person that showed interest in this code!
// Thank you GlassHoney2354 for the addedBonus function!