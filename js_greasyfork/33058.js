// ==UserScript==
// @name        Export times from Cube Timer
// @namespace   cubetimer
// @description Exports a list of times to import on Twisty Timer
// @include     http://www.cubetimer.com/
// @author      SoKeT
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/33058/Export%20times%20from%20Cube%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/33058/Export%20times%20from%20Cube%20Timer.meta.js
// ==/UserScript==

let selector = "body > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)";
let $container = $(selector);
let $button = $("<button id='export-times'>Export times</button>").appendTo($container);;
let $download = $("<a id='download' download='times.txt' style='display: block'>Download</a>").appendTo($container).hide();

$button.click(function() {
  let formattedList = "";
  
  $.each(time_list, function(index, value) {
    let time = Math.floor((value / 1000) * 100) / 100;
    let date = new Date();
    date.setSeconds(date.getSeconds() - (time_list.length - index) * 30);
    let formattedTime = '"' + time + '"; ""; "' + date.toISOString() + '"\r\n';
    formattedList += formattedTime;
  });

  let file = createFile(formattedList);
  $download.attr("href", file).show();
  console.log(formattedList);
});

function createFile(text) {
  let data = new Blob([text], {type: "octet/stream"});
  let file = window.URL.createObjectURL(data);
  return file;
};