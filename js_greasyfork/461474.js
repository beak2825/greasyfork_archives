// ==UserScript==
// @name         BackOffice Extended version 0.1 (Alpha)
// @namespace    https://github.com/fagwizard
// @version      0.1
// @description  Extension that will save you some nerves.
// @author       fagwizard
// @match        https://pinocasino.casino-backend.com/backend/players/233517
// @copyright    2023, fagwizard (https://github.com/fagwizard)
// @icon         https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.creativefabrica.com%2Fde%2Fproduct%2Fpencil-icon-vector-16%2F&psig=AOvVaw3LdzibzM2tX0fLefRftV1N&ust=1678388900073000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCNCJl4GEzf0CFQAAAAAdAAAAABAZ
// @grant         none
// @run-at        document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461474/BackOffice%20Extended%20version%2001%20%28Alpha%29.user.js
// @updateURL https://update.greasyfork.org/scripts/461474/BackOffice%20Extended%20version%2001%20%28Alpha%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var Birthday = document.querySelector("#attributes_table_profile_189766 > table > tbody > tr.row.row-date_of_birth");
    var Country = document.querySelector("#attributes_table_profile_189766 > table > tbody > tr.row.row-country");
    var sTag = document.querySelector("#attributes_table_ad_arg_189151 > table > tbody > tr.row.row-s_tag_affiliate > td")
    var PhoneNum = document.querySelector("#attributes_table_profile_189766 > table > tbody > tr.row.row-mobile_phone");
    var elem = document.querySelector("#status_sidebar_section")
    var clone = elem.cloneNode(true);
    var clone1 = Birthday.cloneNode(true);
    var clone2 = Country.cloneNode(true);
    var clone3 = sTag.cloneNode(true);
    var clone4 = PhoneNum.cloneNode(true);
    clone.id = 'status_sidebar_section_2';
    clone.classList.add('sidebar_section panel 2');

// Inject it into the DOM
    elem.after(clone);
    var currentNode = document.querySelector('#status_sidebar_section');
    var newNode = document.createElement('th');
    newNode.id = 'salutations';
    newNode.innerHTML =
        '<div class="sidebar_section panel" id="status_sidebar_section_3">' +
        '<h3>BackOffice+ version 0.1</h3>' +
        '<div class="panel_contents"><div class="attributes_table" style="overflow: visible;">' +
        '<table class="extended-statuses">' +
        '<table class="player-extended">' +
        '<tbody>' +
        '<tr class="row">' +
        '<th colspan="2">' +
        'BackOffice+ version 0.1' +
        '</th>🍳' +
        '</tr>' +
        clone1 +
        clone2 +
        '<th>S TAG AFFILIATE</th>' +
        '<td><a href="https://docs.google.com/spreadsheets/d/1q1TNfLAriAA4ZwTu_Wembk4N-kJ5qGkyI_Ryh9rNUjw/edit#gid=0"' + clone3 + '</a></td>' +
                 clone4 +
        '</tbody>'
        '</table>'
        '</div>'
    currentNode.parentNode.replaceChild(newNode, currentNode);

    /*
document.body.onload = addElement;

function addElement() {
  // create a new th element
  const newDiv = document.createElement("th");

  // and give it some content
  const currentDiv = document.getElementById("div1")
  const newContent = document.createTextNode("Hi there and greetings!");

  // add the text node to the newly created div
  newDiv.appendChild(newContent);

  // add the newly created element and its content into the DOM
  const currentDiv = document.getElementById("div1");
  document.body.insertBefore(newDiv, currentDiv);
}
    const myElement = document.getElementById("status_sidebar_section");
const element = document.getElementById("ul"); // assuming ul exists
const fragment = document.createDocumentFragment();
const browsers = ["Firefox", "Chrome", "Opera", "Safari"];

browsers.forEach((browser) => {
  const li = document.createElement("li");
  li.textContent = browser;
  fragment.appendChild(li);
});

element.appendChild(fragment); */

    // Your code here...
})();