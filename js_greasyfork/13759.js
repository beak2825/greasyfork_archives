// ==UserScript==
// @name         Umbel Map Popup
// @namespace    http://your.homepage/
// @version      0.1
// @description  // @description  Pop up a map highlighting the room listed in a google calendar event
// @author       Alan B
// @match        https://calendar.google.com/calendar/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/13759/Umbel%20Map%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/13759/Umbel%20Map%20Popup.meta.js
// ==/UserScript==

// todo/bugs
// - sometimes init() runs after only 8-12 chips have been rendered - find out why and fix it - 500ms timeout didnt seem to help
// - stops working when you go to the next week/day
//   chips need onclicks added again - or get the generic eb-data:hover working
//   any time the view is refreshed (nav left/right, click day/week/month/etc, need to redo chip onclicks
// - doesnt work at all in 'month' view.
//   no chips - need to add onclick to a different element (span class="te-s" ??)
//   OR get the generic eb-data:hover working
// - doesnt work at all in 'agenda' view.
//   no chips - need to look for a different element
//
// if i can figure out how to make everything work by just adding a hover listener to the eb-data class, then the 
// program structure has to change a little - instead of drawing the overlay in the onclick, and just using the hover to show/hide,
// need the hover to do all the work. in theory this might cause a little repetition (redoing the lookup and draw on every hover),
// but the user probably won't be using it in that way, and it will make the code very simple while supporting all the views,
// and eliminate the need for any onclick
//
// todo/features
// - implement in popup window
// - keep map on page, but position it so it doesnt get in the way - maybe next to the bubble?
// - change scale of map div

// https://media.umbel.com/brands/logos/bitmap/seaholm_map_large.png
// "chip" = the small calendar entries
// "bubble" = the event info that pops up when you click a chip

DEBUG_PRINT = true;
DISPLAY_MODE = 0;

debug('run start');
umbelmap_rooms = { //          [x1,  y1,  x2,  y2]
    'Aliens': {floor: 2, bbox: [90, 267, 145, 321]},
    'WALL-E': {floor: 2, bbox: [90, 321, 145, 377]},
    'Avatar': {floor: 2, bbox: [90, 377, 145, 430]},
    'Ex Machina': {floor: 2, bbox: [478, 563, 553, 618]},
    'Short Circuit': {floor: 2, bbox: [553, 563, 635, 618]},
    'Galaxy Quest': {floor: 2, bbox: [554, 431, 597, 481]},
    'Inception': {floor: 2, bbox: [599, 431, 645, 479]},
    'Elysium': {floor: 2, bbox: [552, 375, 634, 429]},
    'Minority Report': {floor: 2, bbox: [554, 267, 639, 375]},
    'Firefly': {floor: 2, bbox: [554, 214, 632, 265]},
    'Hunger Games': {floor: 2, bbox: [554, 164, 631, 210]},
    'Prometheus': {floor: 2, bbox: [405, 47, 436, 70]},
    'Oblivion': {floor: 2, bbox: [405, 74, 437, 94]},
    'District9': {floor: 2, bbox: [473, 50, 503, 77]},
    'Gattaca': {floor: 2, bbox: [473, 79, 505, 107]},
    'Interstellar': {floor: 2, bbox: [318, 306, 358, 362]},
    'Fifth Element': {floor: 2, bbox: [360, 309, 400, 364]},
    'Contact': {floor: 1, bbox: [500, 286, 555, 325]},
    'The Matrix': {floor: 1, bbox: [501, 336, 555, 374]},
    'Clockwork Orange': {floor: 1, bbox: [421, 443, 461, 497]},
    'Back to the Future': {floor: 1, bbox: [377, 442, 419, 496]},
    'Tron': {floor: 1, bbox: [368, 525, 393, 557]},
    'Looper': {floor: 1, bbox: [395, 525, 418, 557]},
    'Dune': {floor: 1, bbox: [419, 525, 443, 557]},
    'Mad Max': {floor: 1, bbox: [501, 485, 663, 644]},
    'The Island': {floor: 1, bbox: [336, 316, 421, 375]},
    'Vox': {floor: 1, bbox: [100, 220, 184, 499]},
    'Nap Room': {floor: 2, bbox: [599, 431, 645, 479]},
    'Labs': {floor: 2, bbox: [479, 480, 639, 564]},
    'backend pod skylight': {floor: 2, bbox: [13, 619, 242, 669]},
    'gym': {floor: 2, bbox: [13, 619, 242, 669]},        
    'audio video av': {floor: 1, bbox: [446, 525, 500, 587]},
    'bar/beer/kegs': {floor: 1, bbox: [577, 162, 670, 219]}
};

function draw_overlay(room_name) {
    canvas = $('.umbelmap_b2');
    context = canvas[0].getContext("2d");
    context.clearRect(0, 0, canvas[0].width, canvas[0].height);
    //context1.scale(0.5, 0.5);

    offset = 0.5; // for sharp lines
    room = umbelmap_rooms[room_name];
    if(room.floor == 1) {
        canvas.css('background-position-x', '-850px');
    } else if(room.floor == 2) {
        canvas.css('background-position-x', '-80px');
    }
    x1 = room.bbox[0] + offset;
    y1 = room.bbox[1] + offset;
    x2 = room.bbox[2] + offset;
    y2 = room.bbox[3] + offset;
    context.fillStyle = 'rgba(69, 174, 177, .5)'; // umbel blue
    context.fillRect(x1, y1, x2-x1, y2-y1);
    debug('draw_overlay for ' + room_name + ' done')
}

function check_for_room_text(str) {
    for(var name in umbelmap_rooms) {
        if(str.toLowerCase().search(name.toLowerCase()) >= 0)
            return name;
    }
    return '';
}

function chip_onclick() {
    debug('chip_onclick');
    els = $('.eb-data');
    debug(els.length + ' eb-data elements');
    if(els.length > 0) {
       loc_label = $('div[id$="location-label"]');
       if(loc_label.length > 0) {
           loc_info = loc_label[0].parentElement.nextSibling;
           loc_text = loc_info.innerHTML;
           room_name = check_for_room_text(loc_text);
           if(room_name.length > 0) {
               if(DISPLAY_MODE == 0) {
                   // popup div fixed in lower-right corner
                   draw_overlay(room_name);
                   els.hover(function() {$('.umo').show();}, 
                             function() {$('.umo').hide();}
                            );
               } else if(DISPLAY_MODE == 1) {
                   // popup div dynamically placed in intelligent location
               } else if(DISPLAY_MODE == 2) {
                   // popup window
               }
               debug(els[0]);
               debug(loc_label);
               debug(room_name);
           } else {
               debug('no room text found');
           }
       } else {
           debug('bubble has no location row');
       }
    } else {
        debug('bubble not present, try again later');
        setTimeout(chip_onclick, 1000);
    }
}

function umbelmap_init(){
    debug('init start');

    // preload map image

    // set up map elements
    div = $("<div class='umo' style='position:fixed;bottom:0px;right:0px;display:none;'>");
    c1 = $("<canvas class='umbelmap_b2' width=700 height=700 style='background: url(https://media.umbel.com/brands/logos/bitmap/seaholm_map_large.png); background-repeat:no-repeat; background-position:-80px -500px;'>");
    $("body").append(div);
    $(".umo").append(c1);
    
    // add onclicks for each "chip"
    chips = $('.chip');
    debug(chips.length + ' chips');
    for(var i = 0, len=chips.length; i<len; i++) {
        chips[i].addEventListener("click", function() {setTimeout(chip_onclick, 100);});
    }
    
  //  $('.chip').click('chip_onclick');
    //$('body').on('click', '.chip', chip_onclick);
//    $('body').on('hover', '.eb-data', function(e) {console.log('asdf')});
//    $('body').on('hover', '*', function(e) {console.log(e)});
    debug('init done');
}

function debug(arg) {
    if(DEBUG_PRINT)
        console.log(arg);
}

$(document).ready(setTimeout(umbelmap_init, 500));
debug('run done');