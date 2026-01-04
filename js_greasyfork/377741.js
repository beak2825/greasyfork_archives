// ==UserScript==
// @name         Trello Count Points based on T-shirt size
// @namespace    https://trello.com/
// @version      0.5.2
// @description  Sums the amount of points of cards in Trello and display the result in the list header. Based on Filipe Oliveira's script
// @author       Aska Lee
// @include      https://trello.com/b/*
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377741/Trello%20Count%20Points%20based%20on%20T-shirt%20size.user.js
// @updateURL https://update.greasyfork.org/scripts/377741/Trello%20Count%20Points%20based%20on%20T-shirt%20size.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var REGEX_POINTS = /\{(.*?)\??\}/;

    function computeTShirtSum() {
        jQuery('.list-wrapper > .list').each((idx, b) => {
            var board = jQuery(b);
            var sum = 0;
          	var sizes = {S: 0, M: 0, L: 0, XL: 0};

          	var header = board.find('.list-header-name-assist').first();

            board.find('.list-card-title').each((jdx, c) => {
                var card = jQuery(c);
              	var pureCardText = card.clone().children().remove().end().text()
                var match = REGEX_POINTS.exec(pureCardText);
              	var point = 0;
              	if(match) {

                  switch(match[1].toUpperCase()){
                    case 'S':
                      point = 1;
                      sizes.S++;
                      break;
                    case 'M':
                      point = 2;
                      sizes.M++;
                      break;
                    case 'L':
                      point = 4;
                      sizes.L++;
                      break;
                    case 'XL':
                      point = 8;
                      sizes.XL++;
                      break;
                  }
                  sum += point;
                }
            });

            var pointsHeader = board.find('.list-header').first();
            var child = pointsHeader.find('span.count-points').first();

            if (!child || !child.length) {
                child = $('<span>').addClass('count-points');
                pointsHeader.append(child);
            }

            child.html(sum ? `<span align='right'>(<b>T-points</b>: <font color='red'>${sum}</font>, ${sizes.S}<b>S</b> ${sizes.M}<b>M</b> ${sizes.L}<b>L</b> ${sizes.XL}<b>XL</b>)</span>` : '');
        });
    }

    var REGEX_HOURS = /\s*\((\d*?)\??\)/;

    function computeTaskHours() {
        jQuery('.list-wrapper > .list').each((idx, b) => {
            var board = jQuery(b);
            var sum = 0;

            board.find('.aj-item-name').each((jdx, c) => {
                var card = jQuery(c);
              	var pureCardText = card.clone().children().remove().end().text()
                
                var match = REGEX_HOURS.exec(pureCardText);
              	if(match) {
                  //console.log(pureCardText + "==>" + match[1]);
                  var hours = parseFloat(match[1]);
                  if (!isNaN(hours)) {
                    sum += hours;
                  }
                }
            });

            var pointsHeader = board.find('.list-header').first();
            var child = pointsHeader.find('span.count-hours').first();

            if (!child || !child.length) {
                child = $('<span>').addClass('count-hours');
                pointsHeader.append(child);
            }

            child.html(sum ? `<span align='right'>(<b>hours</b>: <font color='red'>${sum}</font>)</span>` : '');
        });
    }


    function computeSum() {
        computeTShirtSum();
        computeTaskHours();

        setTimeout(computeSum, 1000);
    }

    computeSum();

})();

var colorize = function() {
    //$(".list-card").css("background-color", "").css("border", "");
    // Story
    $(".list-card:has(.card-label-green)").css("background-color", "#bce89d");
    // Bug
    $(".list-card:has(.card-label-red)").css("background-color", "#ffbbbb");
};
$(document).ready(function() {
  colorize();
  setInterval(colorize, 2000);
});