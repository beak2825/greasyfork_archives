// ==UserScript==
// @name        TorrentBD - Get Uploaded Torrent Links
// @icon        https://www.torrentbd.net/themes/material/static/favicon/favicon-32x32.png
// @namespace   Violentmonkey Scripts
// @match       https://www.torrentbd.com/account-details.php*
// @match       https://www.torrentbd.me/account-details.php*
// @match       https://www.torrentbd.net/account-details.php*
// @match       https://www.torrentbd.org/account-details.php*
// @grant       none
// @version     1.3.2
// @author      frostfire
// @run-at      document-end
// @description Add buttons in accounts page's torrent tab to copy or download uploaded torrents links from current page
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456879/TorrentBD%20-%20Get%20Uploaded%20Torrent%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/456879/TorrentBD%20-%20Get%20Uploaded%20Torrent%20Links.meta.js
// ==/UserScript==

const checkBoxChecked = () => {
  if (document.getElementById("numberCB").checked)
    return true;
    return false;
};

const getTorrentLinks = () => {
  let a = document.querySelectorAll("td.torrent-name span");
  let output = "";
  let k = 1;
  let cb = checkBoxChecked();
  for (i = 0; i < a.length; i++) {
    let tid = a[i].dataset.tid;
    if (tid != undefined) {
      if (cb) {
        output +=
          k +
          ". " +
          "https://www.torrentbd.net/torrents-details.php?id=" +
          tid +
          "\n";
      } else {
        output +=
          "https://www.torrentbd.net/torrents-details.php?id=" + tid + "\n";
      }
      k++;
    }
  }
  return output;
};

const downloadTorrentLinks = () => {
  output = getTorrentLinks();
  downloadFiles(output, "text", "html");
  function downloadFiles(data, file_name, file_type) {
    var file = new Blob([data], { type: file_type });
    if (window.navigator.msSaveOrOpenBlob)
      window.navigator.msSaveOrOpenBlob(file, file_name);
    else {
      var a = document.createElement("a"),
        url = URL.createObjectURL(file);
      a.href = url;
      a.download = file_name;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  }
};

const copyTorrentLinks = () => {
  const input = document.createElement("textarea");
  input.value = getTorrentLinks();
  document.body.appendChild(input);
  input.focus();
  input.select();
  let result = document.execCommand("copy");
  document.body.removeChild(input);
  if (result) alert("Torrent links copied to clipboard");
  else
    prompt("Failed to copy links. Manually copy from below\n\n", input.value);
};

// target
let container = document.querySelector("#torrents");

// div
const newDiv = document.createElement("div");
newDiv.style = "text-align: center;margin-top: 10px;";

// copy button
const cpyBtn = document.createElement("button");
cpyBtn.textContent = "Copy Links";
cpyBtn.setAttribute("align", "center");
cpyBtn.style =
  "border-radius: 4px;margin: 6px 14px;padding: 6px 14px;border: none;";
cpyBtn.addEventListener("click", copyTorrentLinks);

// dl button
const dlBtn = document.createElement("button");
dlBtn.textContent = "Download Links";
dlBtn.setAttribute("align", "center");
dlBtn.style =
  "border-radius: 4px;margin: 6px 8px;padding: 6px 14px;border: none;";
dlBtn.addEventListener("click", downloadTorrentLinks);

// checkBox
let newCheckbox = document.createElement("input");
newCheckbox.type = "checkbox";
newCheckbox.value = "yes";
newCheckbox.name = "numberCB";
newCheckbox.id = "numberCB";

// checkBox label
let label = document.createElement("label");
label.htmlFor = "numberCB";
label.textContent = "Numbered";

newDiv.appendChild(newCheckbox);
newDiv.appendChild(label);
newDiv.appendChild(cpyBtn);
newDiv.appendChild(dlBtn);
container.prepend(newDiv);
