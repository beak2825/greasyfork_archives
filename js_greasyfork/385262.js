// ==UserScript==
// @name         Randaris Link holer
// @description  Nanoids Link Grabber.
// @icon         https://randaris.app/img/favicon.ico
// @version      1.0
// @author       Banda
// @include      https://randaris.app/serie/episode/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @namespace https://greasyfork.org/users/23321
// @downloadURL https://update.greasyfork.org/scripts/385262/Randaris%20Link%20holer.user.js
// @updateURL https://update.greasyfork.org/scripts/385262/Randaris%20Link%20holer.meta.js
// ==/UserScript==

let linklist = [];
let infolist = [];
let teststring;
let testcheck = false;
let link;
let links = GM_getValue("links", "");
if (links.length != 0) {
  addoldlink();
}
let info = GM_getValue("info", "");
if (info.length != 0) {
  addoldinfo();
}

window.onload = function() {
  let buttonparent = document.getElementById("site-sidebar");
  let button = document.createElement("button");
  button.type = "button";
  button.innerHTML = "Hole Download Link";
  button.onclick = getlinks;
  button.setAttribute("id", "myButton");
  button.setAttribute("class", "fa1");

  let button2 = document.createElement("button");
  button2.type = "button";
  button2.innerHTML = "Lösche Links";
  button2.onclick = removelinks;
  button2.setAttribute("id", "myButton2");
  button2.setAttribute("class", "fa2");

  let button3 = document.createElement("button");
  button3.type = "button";
  button3.innerHTML = "Zeige Links";
  button3.onclick = showlinks;
  button3.setAttribute("id", "myButton3");
  button3.setAttribute("class", "fa3");

  buttonparent.insertBefore(button, document.getElementsByClassName("social-icons nav-pills nav-justified")[0]);
  buttonparent.insertBefore(button2, document.getElementsByClassName("social-icons nav-pills nav-justified")[0]);
  buttonparent.insertBefore(button3, document.getElementsByClassName("social-icons nav-pills nav-justified")[0]);
};

function getlinks() {
  let epinumber = document.getElementsByClassName("content-header content-header-episode clearfix")[0].getElementsByTagName("h1")[0].innerText;
  let epiname = document.getElementsByClassName("content-header content-header-episode clearfix")[0].getElementsByTagName("a")[0].innerText;
  let videomirror = document.getElementsByClassName("mirror-card text-center small active")[0].children[0].getElementsByTagName("b")[0].innerText;
  switch (videomirror) {
    case "Nanoids":
      link = document.getElementsByClassName("video-player")[0].getElementsByTagName("a")[0].href;
      if (linklist.length >= 1) {
        let linksort = linklist.toString();
        teststring = linksort.split(",").filter(links => links);
        for (var i = 0; i < teststring.length; i++) {
          if (teststring[i] == link + "," || teststring[i] == link) {
            testcheck = true;
            alert("Der Download Link befindet sich schon in der Liste.");
            break;
          }
        }
      } else {
        linklist.push(link + ",");
        infolist.push(epiname + " " + epinumber + ",");
        savelink();
        savename();
        break;
      }
      if (testcheck == false) {
        linklist.push(link + ",");
        infolist.push(epiname + " " + epinumber + ",");
        savelink();
        savename();
        break;
      }
      break;
    case "Ani-Stream":
      link = document.getElementsByClassName("video-player")[0].getElementsByTagName("iframe")[0].src;
      if (linklist.length >= 1) {
        let linksort = linklist.toString();
        teststring = linksort.split(",").filter(links => links);
        for (var ii = 0; ii < teststring.length; ii++) {
          if (teststring[ii] == link + "," || teststring[ii] == link) {
            testcheck = true;
            alert("Der Download Link befindet sich schon in der Liste.");
            break;
          }
        }
      } else {
        linklist.push(link + ",");
        infolist.push(epiname + " " + epinumber + ",");
        savelink();
        savename();
        break;
      }
      if (testcheck == false) {
        linklist.push(link + ",");
        infolist.push(epiname + " " + epinumber + ",");
        savelink();
        savename();
        break;
      }
      break;
    case "MP4Upload":
      link = document.getElementsByClassName("video-player")[0].getElementsByTagName("iframe")[0].src;
      if (linklist.length >= 1) {
        let linksort = linklist.toString();
        teststring = linksort.split(",").filter(links => links);
        for (var iii = 0; iii < teststring.length; iii++) {
          if (teststring[iii] == link + "," || teststring[iii] == link) {
            testcheck = true;
            alert("Der Download Link befindet sich schon in der Liste.");
            break;
          }
        }
      } else {
        linklist.push(link + ",");
        infolist.push(epiname + " " + epinumber + ",");
        savelink();
        savename();
        break;
      }
      if (testcheck == false) {
        linklist.push(link + ",");
        infolist.push(epiname + " " + epinumber + ",");
        savelink();
        savename();
        break;
      }
      break;
      case "OpenLoad":
        link = document.getElementsByClassName("video-player")[0].getElementsByTagName("iframe")[0].src;
        if (linklist.length >= 1) {
          let linksort = linklist.toString();
          teststring = linksort.split(",").filter(links => links);
          for (var iii = 0; iii < teststring.length; iii++) {
            if (teststring[iii] == link + "," || teststring[iii] == link) {
              testcheck = true;
              alert("Der Download Link befindet sich schon in der Liste.");
              break;
            }
          }
        } else {
          linklist.push(link + ",");
          infolist.push(epiname + " " + epinumber + ",");
          savelink();
          savename();
          break;
        }
        if (testcheck == false) {
          linklist.push(link + ",");
          infolist.push(epiname + " " + epinumber + ",");
          savelink();
          savename();
          break;
        }
        break;
    default:
      alert("Sieht so aus als ob du " + videomirror + " ausgewählt hast. \n\nBitte wähle einen zulässigen Hoster.");
      break;
  }
}

function savelink() {
  let linksort = linklist.toString();
  GM_setValue("links", linksort);
}

function savename() {
  let infosort = infolist.toString();
  GM_setValue("info", infosort);
}

function addoldlink() {
  var oldstring = links.split(",").filter(links => links);
  linklist.push(oldstring + ",");
}

function addoldinfo() {
  var oldinfo = info.split(",").filter(info => info);
  infolist.push(oldinfo + ",");
}

function removelinks() {
  let deletecheck = confirm("Drücke Ok zum Löschen der Link Liste.");
  if (deletecheck == true) {
    GM_deleteValue("links");
    GM_deleteValue("info");
    linklist = [];
    infolist = [];
    alert("Deine Linkliste wurde gelöscht.");
  } else {
    alert("Deine Linkliste wurde nicht gelöscht.");
  }
}

function showlinks() {
  let linksort = linklist.toString();
  var oldstring = linksort.split(",").filter(links => links);
  let infosort = infolist.toString();
  let infofixer = infosort.replace(/ Nanoids/g, '').replace(/ Ani-Stream/g, '').replace(/ MP4Upload/g, '').replace(/ OpenLoad/g, '');
  var oldinfo = infofixer.split(",").filter(info => info);
  var w = window.open("", "", "width=700,height=800,scrollbars");
  var str1 = "<ul>";
  var str2 = "<ul>";

  oldstring.forEach(function(oldstring) {
    str1 += "<li>" + oldstring + "</li>";
  });

  oldinfo.forEach(function(oldinfo) {
    str2 += "<li>" + oldinfo + "</li>";
  });

  str1 += "</ul>";
  str2 += "</ul>";
  let list1 = w.document.innerHTML = str1;
  let list2 = w.document.innerHTML = str2;
  w.document.write(list1 + list2);
  w.document.close();
}

GM_addStyle(`
#myButton {
margin-bottom: 10px;
margin-right: 20px;
  }
#myButton2 {
margin-bottom: 10px;
margin-right: 20px;
  }
#myButton3 {
margin-bottom: 10px;
margin-right: 20px;
  }
`);
