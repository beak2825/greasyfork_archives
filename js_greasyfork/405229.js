// ==UserScript==
// @name        Reports - Appeals link
// @namespace   Violentmonkey Scripts
// @match       https://reports.cubecraft.net/report
// @grant       none
// @version     1.3.5
// @author      Caliditas
// @description Adds a shortcut to the reported player's appeals page and removes the unnecessary alerts. Also has a page selector.
// @downloadURL https://update.greasyfork.org/scripts/405229/Reports%20-%20Appeals%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/405229/Reports%20-%20Appeals%20link.meta.js
// ==/UserScript==

const urlParams = new URLSearchParams(window.location.search);

$('tr td:nth-child(2)').each(function(i) {
  var names = $.trim($(this).find('a').first().html());
  if (!names.includes(",")) {
    $(this).append($('<a target="_blank" href="https://appeals.cubecraft.net/find_appeals/'
                   + $.trim($(this).find('a').first().html())
                   + '"> ???</a>'));
  } else {
    
    $(this).append($('<a target="_blank" href="https://appeals.cubecraft.net/find_appeals/'
                   + names.slice(0, names.indexOf(","))
                   + '"> ???</a>'));
    names = names.slice(names.indexOf(",") + 1).trim();
    for (var i = 0; i < amountOfAppearances($.trim($(this).find('a').first().html()), ","); i++) {
      if (i != amountOfAppearances($.trim($(this).find('a').first().html()), ",") - 1) {
        $(this).append($('<a target="_blank" href="https://appeals.cubecraft.net/find_appeals/'
                   + names.slice(0, names.indexOf(","))
                   + '"> ???</a>'));
      } else {
        $(this).append($('<a target="_blank" href="https://appeals.cubecraft.net/find_appeals/'
                   + names
                   + '"> ???</a>'));
      }
      names = names.slice(names.indexOf(",") + 1).trim();
    }
  }
  
});
  
function amountOfAppearances(string, substring) {
  return string.split(substring).length - 1;
}


var table = document.getElementsByClassName("table-striped")[0].children[2];

var alerts = document.getElementsByClassName("text-center");
for (i = 0; i < 2; i++) {
  if (alerts[i].firstElementChild.childNodes.length >= 6) {
    if (alerts[i].firstElementChild.childNodes[5].textContent.includes("Reports for chat offences must have a screenshot of chat open.")) {
      alerts[i].firstElementChild.remove();
    }
  } else if (alerts[i].firstElementChild.childNodes.length >= 4) {
    if (alerts[i].firstElementChild.childNodes[2].textContent.includes("Need help using this site?")) {
      alerts[i].firstElementChild.remove();
    }
  }
}

var currentPage
if (urlParams.has("page")) {
  currentPage = parseInt(urlParams.get("page"))
} else {
  currentPage = 1
}

var existingSelector = document.getElementsByClassName("pagination")[0];
if (urlParams.has("name")) {
  var markedUsername = urlParams.get("name");
  if (!table.outerHTML.includes(markedUsername)) {
    existingSelector.insertAdjacentHTML("beforeend", '<li><div style="color:white; cursor: default;" style="-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;" unselectable="on" onselectstart="return false;" onmousedown="return false;">-----</div></li><ul class=\"pagination\"><input class="pagination" type="number" id="myNumber" oninput="processInput()" value="' + currentPage + '"><li class="page-item"><a id="JumpButton" href="https://reports.cubecraft.net/report?page=' + currentPage + '&name=' + markedUsername + '" class="page-link">Jump</a></li></ul>');
  } else {
    existingSelector.insertAdjacentHTML("beforeend", '<li><div style="color:white; cursor: default;" style="-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;" unselectable="on" onselectstart="return false;" onmousedown="return false;">-----</div></li><ul class=\"pagination\"><input class="pagination" type="number" id="myNumber" oninput="processInput()" value="' + currentPage + '"><li class="page-item"><a id="JumpButton" href="https://reports.cubecraft.net/report?page=' + currentPage + '" class="page-link">Jump</a></li></ul>');
  }
} else {
  existingSelector.insertAdjacentHTML("beforeend", '<li><div style="color:white; cursor: default;" style="-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;" unselectable="on" onselectstart="return false;" onmousedown="return false;">-----</div></li><ul class=\"pagination\"><input class="pagination" type="number" id="myNumber" oninput="processInput()" value="' + currentPage + '"><li class="page-item"><a id="JumpButton" href="https://reports.cubecraft.net/report?page=' + currentPage + '" class="page-link">Jump</a></li></ul>');
}

var script = document.createElement("script");
var text;
if (urlParams.has("name")) {
  var markedUsername = urlParams.get("name");
  if (!table.outerHTML.includes(markedUsername)) {
    text = document.createTextNode('function processInput() {var input = document.getElementsByClassName("pagination")[1].children[0].value; console.log(input); var jumpButton = document.getElementById("JumpButton"); var html = jumpButton.outerHTML; jumpButton.outerHTML = html.slice(0, html.indexOf("page=") + 5) + input + "&name=" + "' + markedUsername + '" + html.slice(html.indexOf(\'" class="page\')); var inputElem = document.getElementById("myNumber"); inputElem.addEventListener("keyup", function(event) {if (event.keyCode === 13) {event.preventDefault();document.getElementById("JumpButton").click();}});};');
  } else {
    text = document.createTextNode('function processInput() {var input = document.getElementsByClassName("pagination")[1].children[0].value; console.log(input); var jumpButton = document.getElementById("JumpButton"); var html = jumpButton.outerHTML; jumpButton.outerHTML = html.slice(0, html.indexOf("page=") + 5) + input + html.slice(html.indexOf(\'" class="page\')); var inputElem = document.getElementById("myNumber"); inputElem.addEventListener("keyup", function(event) {if (event.keyCode === 13) {event.preventDefault();document.getElementById("JumpButton").click();}});};');
  }
} else {
  text = document.createTextNode('function processInput() {var input = document.getElementsByClassName("pagination")[1].children[0].value; console.log(input); var jumpButton = document.getElementById("JumpButton"); var html = jumpButton.outerHTML; jumpButton.outerHTML = html.slice(0, html.indexOf("page=") + 5) + input + html.slice(html.indexOf(\'" class="page\')); var inputElem = document.getElementById("myNumber"); inputElem.addEventListener("keyup", function(event) {if (event.keyCode === 13) {event.preventDefault();document.getElementById("JumpButton").click();}});};');
}
script.appendChild(text);
document.body.appendChild(script);
// $('head').append('<script>function processInput() {var input = document.getElementsByClassName("pagination")[1].value; console.log(input) var jumpButton = document.getElementById("JumpButton"); var html = jumpButton.outerHTML; jumpButton.outerHTML = html.slice(0, html.indexOf("page=") + 5) + input + html.slice(html.indexOf(\'" class="page\'));};<\/script>');

if (urlParams.has("name")) {
  var markedUsername = urlParams.get("name");
  table.outerHTML = table.outerHTML.replace(markedUsername, "<mark style='background-color: yellow'>" + markedUsername + "</mark>")
  if (!table.outerHTML.includes(markedUsername)) {
    var pageRefs = document.getElementsByClassName("page-item");
    for (var i = 0; i < pageRefs.length; i++) {
      if (!(pageRefs[i].classList.contains("active") || pageRefs[i].classList.contains("disabled")) && !pageRefs[i].children[0].href.includes(markedUsername)) {
        pageRefs[i].children[0].href = pageRefs[i].children[0].href + "&name=" + markedUsername;
      }
    }
  }
}
