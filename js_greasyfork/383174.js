// ==UserScript==
// @name         RPG-City Multi Beitrag Liker
// @namespace    https://greasyfork.org/en/users/302662-xtobishotz
// @description  Liked Automatisch alle Beiträge eines Users.
// @icon         https://rpg-city.de/images/styleLogo-4fca0210d8dd5d4af0151581cfc7b55113972ba2.png
// @version      0.4.2
// @author       xTobiShotz & Banda
// @include      https://rpg-city.de/forum/thread/*
// @include      https://rpg-city.de/user/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/383174/RPG-City%20Multi%20Beitrag%20Liker.user.js
// @updateURL https://update.greasyfork.org/scripts/383174/RPG-City%20Multi%20Beitrag%20Liker.meta.js
// ==/UserScript==

if (document.getElementById("userLogin")) {
  return console.error("Du musst eingeloggt sein um das Script nutzen zu können!")
};

if (document.body.id == "tpl_wbb_thread") {
  window.onload = function () {
    let AppendElement = document.getElementsByClassName("wbbPostAddButton")[0];
    if (!AppendElement) {
      AppendElement = document.getElementsByClassName("contentHeader messageGroupContentHeader wbbThread")[0];
      GM_addStyle(`
      #dropdown-select {
        margin-top: 2px;
        }
        `);
    };

    let input = document.createElement("button");
    input.type = "button";
    input.innerHTML = "Multi Like";
    input.onclick = likeName;
    input.setAttribute("id", "myButton");
    input.setAttribute("class", "fa fa-thumbs-up");
    AppendElement.insertBefore(input, document.getElementsByClassName("button buttonPrimary jsQuickReply")[0]);

    let dropdown = document.createElement("select");
    dropdown.id = "dropdown-select";
    AppendElement.insertBefore(dropdown, document.getElementsByClassName("fa fa-thumbs-up")[0]);

    var select = document.getElementById("dropdown-select");
    getpersonlist();
    personarrayuniq.sort();
    for (let person in personarrayuniq) {
      select.options[select.options.length] = new Option(personarrayuniq[person], person);
    }
  };

  let posts = $('[data-object-type="com.woltlab.wbb.likeablePost"]');
  let iii = 0;
  let array = [];
  let person;
  let personarray = [];
  let personarrayuniq = [];

  function getpersonlist() {
    for (let e = 0; e < posts.length; e++) {
      personarray.push(posts[e].children[1].children[0].children[1].innerText);
    }
    var filteredArr = personarray.filter(function (item, index) {
      if (personarray.indexOf(item) == index) return personarrayuniq.push(item);
    });
    removeself();
  }

  function removeself() {
    for (var q = personarrayuniq.length - 1; q >= 0; q--) {
      if (personarrayuniq[q] == document.getElementById("userMenu").children[0].children[1].innerText) {
        personarrayuniq.splice(q, 1);
      }
    }
  }

  function likeName() {
    var select = document.getElementById("dropdown-select");
    person = select.options[select.selectedIndex].text
    if (person != null) {
      array = [];
      personarray = [];
      personarrayuniq = [];
      likePosts();
    } else {
      array = [];
      personarray = [];
      personarrayuniq = [];
      alert("Error?");
      return;
    }
  }

  function likePosts() {
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].children[1].children[0].children[1].innerText == person && posts[i].attributes["data-like-liked"].nodeValue != "1") {
        let messageFooterGroup = posts[i].children[2].children[2].getElementsByClassName("messageFooterGroup");
        array.push(messageFooterGroup[0].children[2].children[1].children[0]);
      }
    }
    arraycheck();
  }

  function arraycheck() {
    if (array.length == 0) {
      array = [];
      personarray = [];
      personarrayuniq = [];
      alert(`Konnte keinen weiteren Beitrag zum liken finden! Alle Beiträge von ${person} sollten geliked sein!`);
      return;
    } else {
      clickLike();
    }
  }

  function clickLike() {
    array[iii].click();
    iii++;
    if (iii < array.length) {
      setTimeout(clickLike, 200);
    }
    if (iii == array.length) {
      alert(`Fertig! ${array.length} Beiträge von ${person} wurden geliked!`);
      location.reload();
      return;
    }
  }

  GM_addStyle(`
  #myButton {
      font-family: "Open Sans", Arial, Helvetica, sans-serif;
      font-size: 14px;
      position: static;
      margin-left: 5px;
      margin-right: 5px;
      color: #ffffff;
      background-color: #37475a;
  }
  #myButton:hover {
      background-color: #232F3D;
  }
  #myButton:before {
      font-family: "FontAwesome";
      right: 6px;
      position: relative;
      padding-left: 8px;
  }
`);

} else if (document.body.id == "tpl_wcf_user") {
  window.onload = function () {
    expanderclick();
    setposts();
    let AppendElement = document.getElementsByClassName("contentHeaderNavigation")[0];
    let input = document.createElement("button");
    input.type = "button";
    input.innerHTML = "Multi Like";
    input.onclick = likeName;
    input.setAttribute("id", "myButton");
    input.setAttribute("class", "fa fa-thumbs-up");

    let dropdown = document.createElement("select");
    dropdown.id = "dropdown-select";

    AppendElement.insertBefore(input, document.getElementById("wcf1")[0]);
    AppendElement.insertBefore(dropdown, document.getElementsByClassName("fa fa-thumbs-up")[0]);

    var select = document.getElementById("dropdown-select");
    getpersonlist();
    personarrayuniq.sort();
    for (let person in personarrayuniq) {
      select.options[select.options.length] = new Option(personarrayuniq[person], person);
    }
  };

  let posts;

  function setposts() {
    return (posts = document.getElementById("userProfileCommentList").getElementsByClassName("commentContent"));
  }

  let array = [];
  let person;
  let personarray = [];
  let personarrayuniq = [];
  let iii = 0;

  function expanderclick() {
    let moreanswers = document.getElementsByClassName("jsCommentLoadNextResponses");
    for (let a = 0; a < moreanswers.length; a++) {
      moreanswers[a].children[0].click();
    }
  }

  function getpersonlist() {
    for (let e = 0; e < posts.length; e++) {
      personarray.push(posts[e].children[1].children[0].children[0].innerText);
    }
    var filteredArr = personarray.filter(function (item, index) {
      if (personarray.indexOf(item) == index) return personarrayuniq.push(item);
    });
    removeself();
  }

  function removeself() {
    for (var q = personarrayuniq.length - 1; q >= 0; q--) {
      if (personarrayuniq[q] == document.getElementById("userMenu").children[0].children[1].innerText + " ") {
        personarrayuniq.splice(q, 1);
      }
    }
  }

  function likeName() {
    var select = document.getElementById("dropdown-select");
    person = select.options[select.selectedIndex].text;
    if (person != null) {
      array = [];
      personarray = [];
      personarrayuniq = [];
      likePosts();
    } else {
      array = [];
      personarray = [];
      personarrayuniq = [];
      alert("Error?");
      return;
    }
  }

  function likePosts() {
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].getElementsByClassName("wcfLikeButton")[0] != "undefined") {
        if (posts[i].children[1].children[0].children[0].innerText == person + " " && posts[i].getElementsByClassName("wcfLikeButton")[0].className != "wcfLikeButton active") {
          let pinnwandlikebutton = posts[i].getElementsByClassName("wcfLikeButton")[0].children[0];
          array.push(pinnwandlikebutton);
        }
      }
    }
    arraycheck();
  }

  function arraycheck() {
    if (array.length == 0) {
      array = [];
      personarray = [];
      personarrayuniq = [];
      alert(`Konnte keinen weiteren Kommentar zum liken finden! Alle Kommentare von ${person} sollten geliked sein!`);
      return;
    } else {
      clickLike();
    }
  }

  function clickLike() {
    array[iii].click();
    iii++;
    if (iii < array.length) {
      setTimeout(clickLike, 200);
    }
    if (iii == array.length) {
      alert(`Fertig! ${array.length} Kommentare von ${person} wurden geliked!`);
      location.reload();
      return;
    }
  }
  GM_addStyle(`
  #myButton {
      font-family: "Open Sans", Arial, Helvetica, sans-serif;
      font-size: 16px;
      position: static;
      color: #FFFFFF;
      background-color: #070a0d;
      margin-left: 5px;
      margin-top: 5px;
  }
  #myButton:hover {
      background-color: #333a42;
  }
  #myButton:before {
      font-family: "FontAwesome";
      right: 6px;
      position: relative;
      padding-left: 6px;
  }
`);
};