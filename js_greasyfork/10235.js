// ==UserScript==
// @name       everget
// @namespace  http://nucular.github.io
// @version    0.1.1
// @description  Simple GET script for 8chan
// @match      *://8ch.net/*/*
// @copyright  2015+, nucular
// @license    MIT License
// @downloadURL https://update.greasyfork.org/scripts/10235/everget.user.js
// @updateURL https://update.greasyfork.org/scripts/10235/everget.meta.js
// ==/UserScript==


function inject() {
  var func = arguments[0];
  var args = Array.prototype.slice.call(arguments, 1);
  
  var el = document.createElement("script");
  el.innerHTML = "(" + func.toString() + ").apply(window, " + JSON.stringify(args) + ");";
  document.body.appendChild(el);
}

inject((function(showdebug) {
  "use strict";
  
  if (showdebug)
    var debug = console.log.bind(console, "[EVERGET]");
  else
    var debug = function() {};
  
  var board = window.location.href.match(/^https?:\/\/8ch\.net\/(\w+)\/?/);
  if (!board) return;
  board = board[1];
  debug("Board", board);
  
  var lastnr = 0;
  var targetnr = 0;
  
  var stack = []; // derived history of post nrs
  var stackmax = 30;
  
  var pps = 0; // posts per second
  var estimation = 0; // in seconds
  
  var targetmode = "dubs";
  var targettail = 69; // for "tail" mode
  var targets = {
    dubs: function(lastnr) {
      var tail = lastnr % 100;
      if (tail == 99)
        return lastnr + 1;
      return lastnr + (11 - tail % 11);
    },
    trips: function(lastnr) {
      var tail = lastnr % 1000;
      if (tail == 999)
        return lastnr + 1;
      return lastnr + (111 - tail % 111);
    },
    quads: function(lastnr) {
      var tail = lastnr % 10000;
      if (tail == 9999)
        return lastnr + 1;
      return lastnr + (1111 - tail % 1111);
    },
    quints: function(lastnr) {
      var tail = lastnr % 100000;
      if (tail == 99999)
        return lastnr + 1;
      return lastnr + (11111 - tail % 11111);
    },
    tail: function(lastnr, targettail) {
      var mod = Math.pow(10, targettail.toString().length)
      var targetnr = lastnr + (targettail - (lastnr % mod));
      if (targetnr <= lastnr)
        targetnr += mod;
      return targetnr;
    }
  };
  
  $(
    "<tr>" +
      "<th>Everget</th>" +
      "<td>" +
        "Target:&nbsp;" +
        "<select id='everget-targetmode'>" +
          "<option value='dubs'>Dubs</option>" +
          "<option value='trips'>Trips</option>" +
          "<option value='quads'>Quads</option>" +
          "<option value='quints'>Quints</option>" +
          "<option value='tail'>Custom</option>" +
        "</select><br/>" +
        "<div id='everget-tailcontainer' style='display: none;'>" +
          "Custom GET:&nbsp;" +
          "<input id='everget-targettail' type='number' value='69' min='0'/><br/>" +
        "</div>" +
        "<p class='unimportant'>" +
          "Targeting <span id='everget-targetnr'>0</span>, last nr. was <span id='everget-lastnr'>0</span> = <span id='everget-remaining'>0</span> remaining<br/>" +
          "<span id='everget-sum'>0</span> posts in the last <span id='everget-stackmax'>0</span> seconds = <span id='everget-pps'>0</span>P/s<br/>" +
          "<span id='everget-no-est'>Watch for ~<span id='everget-countdown'>30</span> more seconds to get an estimate</span>" +
          "<span id='everget-est' style='display: none;'>GET estimated in <span id='everget-hours'>00</span>:<span id='everget-minutes'>00</span>:<span id='everget-seconds'>00</span></span>" +
        "</p>" +
      "</td>" +
    "</tr>"
  ).prependTo(".post-table-options");
  
  $(
    "<input accesskey='s' style='margin-left: 2px; display: none;' type='button' name='wait' value='Wait for' disabled='true'>" +
    "<input id='everget-active' type='checkbox' name='everget-active'/>" +
    "<label for='everget-active'>GET</label>"
  ).insertAfter("input[name=post]");
  
  $("input[name=wait]").on("click", function(e) {
    $("input[name=wait]").val("Waiting for").attr("disabled", true);
  });
  
  $("#everget-active").on("change", function(e) {
    if (this.checked) {
      $("input[name=post]").hide().attr("disabled", true);
      $("input[name=wait]").val("Wait for").show().attr("disabled", false);
    } else {
      $("input[name=post]").show().attr("disabled", false);
      $("input[name=wait]").val("Wait for").hide().attr("disabled", true);
    }
  });
  
  $("#everget-targetmode").on("change", function(e) {
    targetmode = $(this).val();
    
    if (targetmode == "tail")
      $("#everget-tailcontainer").show();
    else
      $("#everget-tailcontainer").hide();
    
    targetnr = targets[targetmode](lastnr, targettail);
    $("#everget-targetnr").text(targetnr);
  });
  
  $("#everget-targettail").on("change", function(e) {
    targettail = Number($(this).val());
    targetnr = targets[targetmode](lastnr, targettail);
    $("#everget-targetnr").text(targetnr);
  });
  
  $("#everget-stackmax").text(stackmax);
  
  
  var get = function() {
    if ($("#everget-active")[0].checked && $("input[name=wait]").attr("disabled")) {
      $("#everget-active")[0].checked = false;
      $("input[name=wait]").val("Wait for").hide().attr("disabled", true);
      $("input[name=post]").show().attr("disabled", false).click();
    }
  }
  
  var update = function(first) {
    $.getJSON("//8ch.net/" + board + "/0.json").then(function(data) {
      debug("====");
      var newlastnr = lastnr;
      
      $.each(data.threads, function(threadnr, thread) {
        $.each(thread.posts, function(postnr, post) {
          if (post.no > newlastnr)
            newlastnr = post.no;
        });
      });
      targetnr = targets[targetmode](newlastnr, targettail);
      $("#everget-targetnr").text(targetnr);
      debug("Last post:", newlastnr, "Targeting:", targetnr);
      
      remaining = targetnr - newlastnr;
      if (remaining == 1)
        get();
      $("#everget-remaining").text(remaining);
      
      if (!first && newlastnr >= lastnr) {
        stack.push(newlastnr - lastnr);
        if (stack.length > stackmax)
          stack.shift();
      }
      debug("Stack:", stack);
      lastnr = newlastnr;
      $("#everget-lastnr").text(lastnr);
      
      if (stack.length >= stackmax) {
        $("#everget-no-est").hide();
        $("#everget-est").show();
        
        var sum = 0;
        for (var i = 0; i < stack.length; i++)
          sum += stack[i];
        $("#everget-sum").text(sum);
        
        pps = sum / stack.length;
        $("#everget-pps").text(Math.floor(pps * 100) / 100);
        if (pps > 0)
          estimation = remaining / pps;
        else
          estimation = 0;
        
        var hours = Math.floor(estimation / (60 * 60));
        var minutes = Math.floor(estimation / 60) % 60;
        var seconds = Math.floor(estimation) % 60;
        $("#everget-hours").text(("00"+hours).slice(-2));
        $("#everget-minutes").text(("00"+minutes).slice(-2));
        $("#everget-seconds").text(("00"+seconds).slice(-2));
        
        debug("PPS:", pps, "Time:", hours + ":" + minutes + ":" + seconds);
      } else {
        $("#everget-no-est").show();
        $("#everget-est").hide();
        debug("Seconds until estimation", stackmax - stack.length);
        $("#everget-countdown").text(stackmax - stack.length);
      }
    });
  }
  
  update(true);
  setInterval(update, 1000);
}), false);
