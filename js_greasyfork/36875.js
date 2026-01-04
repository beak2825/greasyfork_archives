// ==UserScript==
// @name            Send URL to VLC Web
// @description     Add context menu options that add selected URL to VLC WEB. To use this script you must have VLC Web interface Enabled.
// @version         0.0
// @author          Autocanon
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js
// @locale          Broken English
// @include         *
// @namespace https://greasyfork.org/users/165004
// @downloadURL https://update.greasyfork.org/scripts/36875/Send%20URL%20to%20VLC%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/36875/Send%20URL%20to%20VLC%20Web.meta.js
// ==/UserScript==

var host = "http://localhost:8080";
var user = "";
var pwd = "vlcwebpassword";



if (!("contextMenu" in document.documentElement &&
      "HTMLMenuItemElement" in window)) return;

var body = document.body;
body.addEventListener("contextmenu", initMenu, false);

var vlcico = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QweCygvniPTOAAAAi5JREFUKM+Nkj1oU2EYhZ/vu3+5t0mbNknbGKRFS6laVGzFoVJoFbEiTv4MopsIWt0dxEHs7Cg4iZtFBwdR6FDErYNWUGOxP9Rqaxvy1yZp7s3N5xAEkUR9x4fzcg6HAw1u4ZoYW7ohphZvihONNLIenDgSD1VN63SoWT9WFdbYlZ3ddj2dXg/uuni1K9u8NRhwSqznzMHDUbvr4e2J5H89y91D3ZvR2CEr1klmeWlAC611A8l/xr7chhlIfTrguBu6XlzFdjdsJ/25/1QdI+1PcGuIRIc3N77D/9ITTL+l6ds0lXcvt+Nm9vXzFfJ/jR3W6Ayk54ea5+YJmBDUYD3L0VZJB7DSOPY9peV7h/tlJB5EgPJBGEAk3ra1b3gPSomGztoIZnb27PFCRPFD5jGFhys0snmbXEYbJcckUP6lFwC5O7ZeKZTPLG8nrs8MTBzs2bu/zbEdhJS4rks6m2Hxw2yqd/ru+wTf71uO8aLvsefXnN2y4SsxXkmvj8STT7DaBaq9D2WFEF6eUPoj8eSzaHUzNUpYltS2NwWUdAA/GG6VhcyI8MtEFl4Rc2ewLAdd15BmhXKhiPyaQQu4RBPipNkaDTKZKoniA0fg+5dUqfzI3YStNcADTYFhgGaC0sH1wY6BFQatxbkgdH1SD0Q8iVLnKUMgCk0tILxaGUqB0GvNKAO0CGCCCHrnEJWn+vKcgZAUgqGmN0iqwqxNR/xeqQQMoACiiCyueiWl4CdYMMUI4SlDpwAAAABJRU5ErkJggg=="

var menu = body.appendChild(document.createElement("menu"));
menu.outerHTML = '<menu id="userscript-vlc-tools" type="context">\
                    <menuitem label="Add to VLC Playlist"\
                              id="userscript-vlc-add-queue"\
                              icon=' + vlcico + '></menuitem>\
                    <menuitem label="Add to VLC and Play"\
                              id="userscript-vlc-add-and-play"\
                              icon=' + vlcico + '></menuitem>\
                  </menu>';

                  
                  
document.querySelector("#userscript-vlc-add-queue")
        .addEventListener("click", addQueue, false);
document.querySelector("#userscript-vlc-add-and-play")
        .addEventListener("click", addAndplay, false);
        
        
function initMenu(aEvent) {
  var node = aEvent.target;
  var item = document.querySelector("#userscript-vlc-tools");
  if (node.localName == "a") {
    body.setAttribute("contextmenu", "userscript-vlc-tools");
    item.setAttribute("URL", node.href);
  } else {
    body.removeAttribute("contextmenu");
    item.removeAttribute("URL");
  }
}

function addQueue(aEvent) {
  var iURL = aEvent.target.parentElement.getAttribute("URL");
  sendCommand({
        'command': 'in_enqueue',
        'input': iURL
      });
}

function addAndplay(aEvent) {
    var iURL = aEvent.target.parentElement.getAttribute("URL");
    var params = {
        'command': 'in_enqueue',
        'input': iURL
      };
    $.ajax({
        url: host + '/requests/status.xml',
        data: params,
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(user + ":" + pwd));
        },
        success: function (data, status, jqXHR) {
              PlayLastFile();
        },
        error: function (jqXHR, textStatus, errorThrown ) {
            alert("Can't connect to VLC! Make sure you start VLC before using this function.");
            console.log("Ajax Fail!" + textStatus + errorThrown);
        }
    });
}

function sendCommand(params, append) {
    $.ajax({
        url: host + '/requests/status.xml',
        data: params,
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(user + ":" + pwd));
        },
        error: function (jqXHR, textStatus, errorThrown ) {
            alert("Can't connect to VLC! Make sure you start VLC before using this function.");
            console.log("Ajax Fail!" + textStatus + errorThrown);
        }
    });
}

function PlayLastFile() {
    $.ajax({
        url: host + '/requests/playlist.json',
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(user + ":" + pwd));
        },
        success: function (data, status, jqXHR) {
            var x = data.children[0].children.length;
          	var plid = data.children[0].children[x-1].id;
            sendCommand({
              'command': 'pl_play',
              'id': plid
            });
        },
        error: function (jqXHR, textStatus, errorThrown ) {
            alert("Can't connect to VLC! Make sure you start VLC before using this function.");
            console.log("Ajax Fail!" + textStatus + errorThrown);
        }
    });
}