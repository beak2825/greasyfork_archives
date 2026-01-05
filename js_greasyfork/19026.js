// ==UserScript==
// @author      Xiphias[187717]
// @name        Torn City - Casino Slots Extensions by Xiphias[187717]
// @description This script adds a function to automaticall play the Slots machine.
// @include     http://www.torn.com/loader.php?sid=slots
// @include     https://www.torn.com/loader.php?sid=slots
// @include     torn.com/loader.php?sid=slots
// @version     1.0.5
// @namespace     https://greasyfork.org/users/3898
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19026/Torn%20City%20-%20Casino%20Slots%20Extensions%20by%20Xiphias%5B187717%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/19026/Torn%20City%20-%20Casino%20Slots%20Extensions%20by%20Xiphias%5B187717%5D.meta.js
// ==/UserScript==


/**
 * Number.prototype.format(n, x, s, c)
 * 
 * @param integer n: length of decimal
 * @param integer x: length of whole part
 * @param mixed   s: sections delimiter
 * @param mixed   c: decimal delimiter
 */
Number.prototype.format = function(n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};


window.slotsScriptTokens = -2;
window.slotsError = null;

function addPlaySlotsButton() {
  var input = '<input type="number" name="txt" id="numberOfGames" placeholder="Number of Spins" \
style="width: 110px; height: 12px;\
  border: 1px solid #ccc;\
    line-height: 14px;\
    margin-left: 5px;\
    padding: 3px;\
    text-align: right;\
    vertical-align: middle;\
    border-radius: 5px;\
    font-family: Arial,serif; font-size: 11px;\
  "/>';
  var select = ' <select id="betAmount" style="margin-right: 5px;">  <option value="10">10</option>  <option value="100">100</option>  <option value="1000">1k</option>  <option value="10000">10k</option>  <option value="100000">100k</option>  <option value="1000000">1m</option>  <option value="10000000">10m</option></select>';
  var button = $('<button id="playSlotsButton">Play</button>');
  button.on('click', function () {
    var numberOfGames = getNumberOfGames();
    var betAmount = getBetAmount();
    playSlotsXTimes(numberOfGames, betAmount);
  });

  var div = $('<div style="float:right; margin: 10px;"/>');
  div.append(input);
  div.append(select);
  div.append(button);
  $('#mainContainer > .content-wrapper.m-left20.left').append(div);
}


function getNumberOfGames() {
  var numberOfGames = $('#numberOfGames').val();
  try {
    if (numberOfGames.length == 0 || numberOfGames == 'undefined') {
      return 0;
    }
    times = parseInt(numberOfGames);
    return times;
  } catch (e) {
    console.log(e);
    return 0;
  }
}


function getBetAmount() {
  var betAmount = $('#betAmount').val();
  return betAmount;
}


function playSlotsXTimes(numberOfTimes, betAmount) {
  var delay = 1000;
  var index = 0;
  var timer = setInterval(function () {
    index++;
    console.log(window.slotsScriptTokens);
    if (index > numberOfTimes) {
      clearInterval(timer);
      return false;
    }
    
    if (window.slotsScriptTokens == -1 || window.slotsScriptTokens == 0) {
      console.log("No more tokens left.");
      clearInterval(timer);
      return false;
    }
    
    if (window.slotsError != null) {
      console.log(window.slotsError);
      clearInterval(timer);
      return false;
    }
    
    ajaxPlaySlots(index, betAmount);

  }, 1000)
}


function tryParseJSON(jsonString) {
  try {
    var o = JSON.parse(jsonString);
    // Handle non-exception-throwing cases:
    // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
    // but... JSON.parse(null) returns 'null', and typeof null === "object",
    // so we must check for that, too.
    if (o && typeof o === 'object' && o !== null) {
      return o;
    }
  } catch (e) {
  }
  return false;
}


function ajaxPlaySlots(gameNumber, stake) {
  $.ajax({
    url: 'loader.php?rfcv=' + getCookie('rfc_v'),
    type: 'GET',
    data: {
      sid: 'slotsInterface',
      stake: stake,
      step: 'play'
    },
    success: function (response) {
      console.log(response);
      var tokens = getTokens(response);
      window.slotsScriptTokens = tokens;
      
      getError(response);
      
      populateTable(gameNumber, stake, response);
    }
  });
}


function setCasinoAjaxListener() {
	var isSlots = 'sid=slotsInterface';
	$('body').ajaxComplete(function (e, xhr, settings) {
		var url = settings.url;
		if (url.indexOf(isSlots) >= 0) {
			var responseText = xhr.responseText;
			var obj = tryParseJSON(responseText);
			if (obj) {
				if (obj.length > 0) {
					obj = obj[0];
				}
        var tokens = null;
        if (obj.hasOwnProperty('tokens')) {
          tokens = obj.tokens;
          window.slotsScriptTokens = tokens;
        }
        
        if (obj.hasOwnProperty('errorMsg')) {
          var errorMsg = obj.errorMsg;
          window.slotsError = errorMsg;
        }
        
        if (obj.hasOwnProperty('moneyTotal') && obj.hasOwnProperty('moneyWon')) {
          var moneyTotal = obj.moneyTotal;
          var moneyWon = obj.moneyWon;
          updateInformation(tokens, moneyWon, moneyTotal);
        }
      
      }
    }
  });
}

function updateInformation(tokens, moneyWon, moneyTotal) {
  $('#tokens').text(tokens);
  $('#moneyAmount').text(moneyTotal);
  $('#moneyWon').text(moneyWon);
  console.log(2);
}

function createResultsTable() {
  
}

function addTableStyles() {
	var slots_style_css = ' #results-table { background: #fafafa; color: #444; font: 100%/30px "Helvetica Neue", helvetica, arial, sans-serif; text-shadow: 0 1px 0 #fff; } #results-table { background: #f5f5f5; border-collapse: separate; box-shadow: inset 0 1px 0 #fff; font-size: 12px; line-height: 24px; text-align: left; width: 800px; } #results-table th { background: linear-gradient(#777, #444); border-left: 1px solid #555; border-right: 1px solid #777; border-top: 1px solid #555; border-bottom: 1px solid #333; box-shadow: inset 0 1px 0 #999; color: #fff; font-weight: bold; padding: 10px 15px; position: relative; text-shadow: 0 1px 0 #000; } #results-table th:after { background: linear-gradient(rgba(255,255,255,0), rgba(255,255,255,.08)); content: ""; display: block; height: 25%; left: 0; margin: 1px 0 0 0; position: absolute; top: 25%; width: 100%; } #results-table th:first-child { border-left: 1px solid #777; box-shadow: inset 1px 1px 0 #999; } #results-table th:last-child { box-shadow: inset -1px 1px 0 #999; } #results-table td { border-right: 1px solid #fff; border-left: 1px solid #e8e8e8; border-top: 1px solid #fff; border-bottom: 1px solid #e8e8e8; padding: 10px 15px; position: relative; transition: all 300ms; } #results-table td:first-child { box-shadow: inset 1px 0 0 #fff; } #results-table td:last-child { border-right: 1px solid #e8e8e8; box-shadow: inset -1px 0 0 #fff; } #results-table tr:last-of-type td { box-shadow: inset 0 -1px 0 #fff; } #results-table tr:last-of-type td:first-child { box-shadow: inset 1px -1px 0 #fff; } #results-table tr:last-of-type td:last-child { box-shadow: inset -1px -1px 0 #fff; } #results-table tr td {padding: 10px; vertical-align: middle; text-align: left;} #results-table tr td:nth-of-type(1) {text-align: center;} #results-table tr td:nth-of-type(2) {width: 190px; text-align: center;}  ';
  slots_style_css += ' .results-table-pane { display: inline-block; overflow-y: scroll; max-height:800px;}';
  $('head').append('<style type="text/css">' + slots_style_css + '</style>');
}

function createResultsTable() {
	var tableResults = '<div class="results-table-pane"><table id="results-table" >\
   <thead>\
    <tr><th style="width: 50px;">Game #</th><th>Barrel positions</th><th>Stake</th><th>Money Won</th><th>Money Total</th></tr>\
   </thead>\
   <tbody><tr></tr>\
   </tbody></table></div>';
	$('#mainContainer > .content-wrapper.m-left20.left').append(tableResults);
}


         
function getTokens(response) {
  var obj = tryParseJSON(response);
  if (obj) {
    if (obj.length > 0) {
      obj = obj[0];
    }
    if (obj.hasOwnProperty('tokens')) {
      var tokens = obj.tokens;
      return tokens;
    }
  }
}

function getError(response) {
  var obj = tryParseJSON(response);
  if (obj) {
    if (obj.length > 0) {
      obj = obj[0];
    }
    if (obj.hasOwnProperty('errorMsg')) {
      var errorMsg = obj.errorMsg;
      window.slotsError = errorMsg;
    }
    
    // Check if the user is in Jail or Hospital
    if (obj.hasOwnProperty('content')) {
      var content = obj.content;
      
      var hospitalString = 'while in hospital';
      var jailString = 'jail';
      var travelString = 'traveling';
      if (content.indexOf(hospitalString) > -1) {
        window.slotsError = "You can't access this page while in hospital.";
      } else if (content.indexOf(jailString) > -1) {
        window.slotsError = "You can't access this page while in jail.";
      } else if (content.indexOf(travelString) > -1) {
        window.slotsError = "You can't access this page while traveling.";
      }
    }
  } 
}

function populateTable(gameNumber, stake, response) {
  var obj = tryParseJSON(response);
  if (obj) {
    if (obj.length > 0) {
      obj = obj[0];
    }
    
    var row = $('<tr><td>'+gameNumber +'</td></tr>');
    
    if (window.slotsError != null) {
      row.append('<td>'+window.slotsError+'</td><td></td><td></td><td></td>');
      row.css('background-color', '#ffb3b3'); // Red color
      $('#results-table tr:first').after(row);
      return;
    }
    
    if (obj.hasOwnProperty('errorMsg')) {
      var errorMsg = obj.errorMsg;
      if (errorMsg != null) {
        row.append('<td>'+errorMsg+'</td><td></td><td></td><td></td>');
        row.css('background-color', '#ffb3b3'); // Red color
        $('#results-table tr:first').after(row);
        return;
      }
    }
    
    if (obj.hasOwnProperty('images')) {
      var barrelsTd = $('<td>');
      var images = obj.images;
      for (i = 0; i < images.length; i++) {
        var img = $('<img>');
        var image = images[i].replace(/\/slots\//, "/slots/images/");
        img.attr("src", "/" + image);
        barrelsTd.append(img);
      }
      row.append(barrelsTd);
    }
    
    // Add stake
    row.append('<td>$'+ parseInt(stake).format(0, 3, ',') + '</td>');
    
    if (obj.hasOwnProperty('moneyWon')) {
      var moneyWon = parseInt(obj.moneyWon);
      if (moneyWon != null) {
        row.append('<td>$' + moneyWon.format(0, 3, ',') + '</td>');
      }
    }
    
    if (obj.hasOwnProperty('moneyTotal')) {
      var moneyTotal = parseInt(obj.moneyTotal);
      if (moneyTotal != null) {
        row.append('<td>$' + moneyTotal.format(0, 3, ',') + '</td>');
      }
    }
    console.log(row);
    if (obj.hasOwnProperty('won')) {
      var won = obj.won;
      console.log(won);
      if (won != null && won == 1) {
        console.log("pot");
        row.css('background-color', '#b3e6b0'); // Green
      }
    }
    
    console.log("hello");
    $('#results-table tr:first').after(row);

  }
}
  
function retrieve(id) {
  var txtbox = document.getElementById(id);
  var value = txtbox.value;
}
  
  
$(document).ready(function () {
  console.log('running script');
  setCasinoAjaxListener();
  addPlaySlotsButton();
  addTableStyles();
  createResultsTable();
});


/**
 
NO enough money 
 
{"images":"","won":null,"moneyWon":null,"moneyTotal":"0","currentJackpot":"5775790310","tokens":98,"errorMsg"
:"You don't have enough money to make this stake!","comboTitle":null,"slotsHash":8438} 

Normal 10 dollar play
{"images":["casino\/slots\/duck.png","casino\/slots\/duck.png","casino\/slots\/duck.png"],"won":1,"moneyWon"
:30,"moneyTotal":"1653","currentJackpot":"5779825711","tokens":98,"errorMsg":null,"comboTitle":"Flock
 o' Ducks","slotsHash":6388} 

 */
