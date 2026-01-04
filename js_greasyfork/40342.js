// ==UserScript==
// @name         MAL Friend watched
// @namespace    MALFW
// @version      0.3
// @description  try to take over the world!
// @author       Samu
// @match        https://myanimelist.net/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/40342/MAL%20Friend%20watched.user.js
// @updateURL https://update.greasyfork.org/scripts/40342/MAL%20Friend%20watched.meta.js
// ==/UserScript==

(function() {
  'use strict';


  var container = document.querySelector("td div.border_top") || document.querySelector("td .slider-wrap");;

  if (container !== null) {

    //remove empty ad space
    removeAd();

    GM_addStyle(`
      #friends-watched table, #friends-watched tr, #friends-watched td, #friends-watched th {
        border: 1px solid black;
        border-collapse: collapse;
        padding: 5px;
      }

      .status_2 {
        background-color: #26448f;
      }

      .status_1 {
        background-color: #2db039;
      }

      .status_3 {
        background-color: #e7b715;
      }

      .status_4 {
        background-color: #a12f31;
      }

      .status_6 {
        background-color: #8f8f8f;
      }
    `);

    function checkIfWatched(url, name) {

      $.getJSON(url, function(data) {

        for (var j = 0; j < data.length; j++) {
          if (+id === data[j].anime_id) {

            var link = "<a href="+ url.replace("/load.json", "") +">"+ name +"</a>";

            table.append(createTable({
              link: link,
              statusCode: data[j].status,
              statusText: getStatus(data[j].status),
              score: data[j].score,
              progress: data[j].num_watched_episodes +"/"+ data[j].anime_num_episodes,
            }));
            break;

          }
        }

        friendsChecked++;
        if (friendsChecked === friendsCount)
          loading.style.display = "none";

      }).fail(function() {

        setTimeout(function() {
          checkIfWatched(url, name);
        }, 500);

      });

    }

    function getStatus(n) {
      switch(n) {
        case 1:
          return "Watching";
          break;
        case 2:
          return "Completed";
          break;
        case 3:
          return "On-Hold";
          break;
        case 4:
          return "Dropped";
          break;
        case 6:
          return "Plan to Watch";
          break;
      }
    }

    function init() {

      startBtn.style.display = "none";
      loading.innerText = "Loading...";
      

      $.get("https://myanimelist.net/profile/Samu-/friends", function(data) {


        var friendBlock = $(data).find(".majorPad .friendBlock");
        var friendNames = friendBlock.find(".picSurround + div strong");
        var friendsUrl = friendBlock.find(".friendIcon a");

        friendsCount = friendBlock.length;
        var i = 0;

        var checkFriendsLoop = setInterval(function() {

          var url = friendsUrl[i].href.replace("profile","animelist") + "/load.json?status=7&";
          url += "s=" + encodeURI(animeName);
          // checkIfWatched(url, offset, friendNames[i].innerText);
          checkIfWatched(url, friendNames[i].innerText);

          i++;

          if (i >= friendsUrl.length) {
            clearInterval(checkFriendsLoop);
          }

        }, 500);


      }).fail(function() {
        init();
      });
    }

    var wrap = document.createElement("div");
    var title = document.createElement("h2");
    var friends = document.createElement("div");
    var table = document.createElement("table");
    var loading = document.createElement("span");
    var startBtn = document.createElement("button");
    var id = document.location.href.replace(/^.*(?:manga|anime)\/([0-9]*)(?:\/.*)?$/,"$1");
    var animeName = document.querySelector(".title-name").textContent;

    wrap.id = "friends-watched";
    title.innerText = "Friends Watched (Under Development)";
    table.append($("<tr><th>Username</th><th>Status</th><th>Score</th><th>Episodes</th></tr>")[0]);
    startBtn.innerText = "Load";

    var friendsCount;
    var friendsChecked = 0;

    startBtn.onclick = init;

    friends.appendChild(table);
    wrap.appendChild(title);
    wrap.appendChild(friends);
    wrap.appendChild(loading);
    wrap.appendChild(startBtn);
    container.appendChild(wrap);

  }

  function removeAd() {
    var adLeftOvers = container.getElementsByClassName("_unit");
    for (var i = 0; i < adLeftOvers.length; i++) {
      adLeftOvers[i].parentElement.style.display = "none";
    }
  }

  function createTable ({link, statusCode, statusText, score, progress}) {
    var row = createElem("tr");
    var usernameCell = createElem("td", { text: link });
    var statusCell = createElem("td", { text: statusText, className: "status_" + statusCode });
    var scoreCell = createElem("td", { text: score });
    var episodeCell = createElem("td", { text: progress });
    row.__proto__.multiAppend =  multiAppend;
    row.multiAppend(usernameCell, statusCell, scoreCell, episodeCell);
    return row;
  }

  function createElem(element, {text, className, id} = {}) {
    if (!element) return;
    var newElement = document.createElement(element);
    text ? newElement.innerHTML = text : "";
    className ? newElement.className = className : "";
    id ? newElement.id = id : "";
    return newElement;
  }

  function multiAppend(childs) {
    for (var i = 0; i < arguments.length; i++) {
      this.appendChild(arguments[i]);
    }
  }

})();