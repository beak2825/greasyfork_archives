// ==UserScript==
// @name         Improved Sexmap
// @namespace    https://greasyfork.org/en/scripts/30399-improved-sexmap
// @version      0.6
// @description  Adding additional functionality to the Sexmap
// @author       alexmasters83
// @match        *://*.humansexmap.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30399/Improved%20Sexmap.user.js
// @updateURL https://update.greasyfork.org/scripts/30399/Improved%20Sexmap.meta.js
// ==/UserScript==

const thumbHeight = 39;
let pins = {};
const colors = ['green','red','purple','black'];
let counter = 0;
let currentColor = "green";
let currentEdit;
const tooltipParams = {
  position: { my: "left top", at: "right top" }
};


function removePin(event) {
  if(confirm("Are you sure you want to delete the selected pin?")) {
    delete pins[currentEdit];
    $('#editBox').hide();
    updateUrl();
    $('#' + currentEdit).remove();
  }
}

function updatePin() {
  let comment = $('#comment').val();
  let color = $('#colorSelect').val();
  $('#' + currentEdit)
    .attr('title', comment)
    .attr('src', "pin-" + color + ".gif")
  ;
  pins[currentEdit].comment = comment;
  pins[currentEdit].color = color;
  $('#editBox').hide();
  updateUrl();
  brighten(currentEdit);
  $('#' + currentEdit).tooltip(tooltipParams);
}

function editPin() {
  $('#editBox')
    .css({
      'left': pins[this.id].x - 3,
      'top': pins[this.id].y - 119
    })
    .show();
  $(`#colorSelect option[value="${pins[this.id].color}"]`).attr("selected", "selected");
  $('#comment').val(pins[this.id].comment);
  currentEdit = this.id;
}

function addPinToMap(id) {
  let pin = pins[id];
  $('body').append('<img class="pin" id="' + id + '" />');
  $('#' + id)
    .attr('src', "pin-" + pin.color + ".gif")
    .attr('title', pin.comment)
    .css({
      'position': 'absolute',
      'left': pin.x - 3,
      'top': pin.y - thumbHeight
    })
    .click(editPin)
  ;
  brighten(id);
}

function addPin(event) {
  pins[counter] = {
    x: event.pageX,
    y: event.pageY,
    color: currentColor,
    comment: ""
  };
  addPinToMap(counter);
  $('#editBox').hide();
  updateUrl();
  counter++;
}

function updateUrl() {
  window.history.pushState("object or string", "Title", "http://www.humansexmap.com?data=" + btoa(JSON.stringify(pins)));
}

function brighten(id) {
  $('#' + id).css('filter', (pins[id].comment ? 'brightness(150%)' : ''));
}

let data = window.location.search.split("data=")[1];

if(data) {
  pins = JSON.parse(atob(data));
  for(let pin in pins) {
    addPinToMap(pin);
    if(pin > counter) {
      counter = pin;
    }
  }
  counter++;
  $(".pin").tooltip(tooltipParams);
}

$("head").append (
  '<link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/base/jquery-ui.css" rel="stylesheet" type="text/css">'
);

let toolbar = $('<div id="toolbar"></div>');
toolbar.append($("#green"));
toolbar.append('<br style="clear: both" />');
toolbar.append($("#red"));
toolbar.append('<br style="clear: both" />');
toolbar.append($("#purple"));
toolbar.append('<br style="clear: both" />');
toolbar.append($("#black"));
toolbar.append('<br style="clear: both" />');
toolbar.append('<p>Click on the map to place a pin. You can edit the pin (change the colour or add a comment) or remove it by clicking it and choosing the appropriate option. Pins that have a comment have a slightly brighter colour than pins that don\'t.</p><p>To share the map, just copy the url (it updates automatically as you update the map) and share that. The <a href="https://greasyfork.org/en/scripts/30399-improved-sexmap">Improved Sexmap script</a> is required to be able to load your map.</p>');
$("#toolbar").replaceWith(toolbar);

$(".pintype");

$('body').append('<div id="editBox"></div>');
$('#editBox').append('<div id="textBox"></div>').append('<div id="colorBox"></div>').append('<div id="buttons"></div>');
$('#editBox')
  .hide()
  .css({
    'width': '200px',
    'height': '120px',
    'z-index': 1,
    'position': 'absolute',
    'background': 'white',
    'padding': '4px',
    'border': '3px solid black',
    'opacity': '.85'
  })
;

$("#textBox").append('<label for="comment">Comment</label>');
$("#textBox").append('<textarea id="comment"></textarea>');
$("#comment").css({
  'width': 'calc(100% - 8px)',
  'height': '50px',
  'margin-bottom': '5px'
});

$("#colorBox").append('<label for="colorSelect">Colour</label>');
$("#colorBox").append('<select id="colorSelect"></select>');
for(let color of colors) {
  $('#colorSelect').append(`<option value="${color}">${color}</option>`);
}
$("#colorSelect").css({
  'margin-left': '10px'
});

$("#buttons").append('<a id="updateButton">Update Pin</a>');
$("#buttons").append('<a id="removeButton">Remove Pin</a>');
$("#buttons").css({
  'position': 'absolute',
  'bottom': '4px',
  'width': 'calc(100% - 8px)'
});

$('#updateButton').click(updatePin);

$("#removeButton").css({
  'float': 'right'
});

$("#removeButton").click(removePin);


$(document).ready(function() {
this.$ = this.jQuery = jQuery.noConflict(true);
$("#map1, #map2, #map3, #map4, #green, #red, #purple, #black").unbind();

$("#map1, #map2, #map3, #map4").click(function(clickEvent){
  addPin(clickEvent);
});

$("#green, #red, #purple, #black").click(function(){
  for(let color of colors) {
    $("#" + color + " img").attr('src', color + "dot.gif");
  }
  $("#" + this.id + " img").attr('src', this.id + "dotglowing.gif");
  currentColor = this.id;
});
});
