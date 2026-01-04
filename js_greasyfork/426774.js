// ==UserScript==
// @name        Duolingo Keyboard Shortcuts
// @match       https://www.duolingo.com/*
// @require     https://code.jquery.com/jquery-3.4.1.js
// @description Duolingo keyboard shortcuts
// @version 0.0.1.20210520194707
// @namespace https://greasyfork.org/users/774343
// @downloadURL https://update.greasyfork.org/scripts/426774/Duolingo%20Keyboard%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/426774/Duolingo%20Keyboard%20Shortcuts.meta.js
// ==/UserScript==

function isLesson() {
  return /https:\/\/www.duolingo.com\/(practice|skill.*)/.test(window.location.href);
}

window.addEventListener("keydown", function(e) {
  var key = e.key.toLowerCase();
  
  if (isLesson()) {
    
    // matching shortcut
    if (/[a-z]/.test(key)) {
      var hint = $(`span.matching-hint:contains(${key})`);
    	var parent = hint.parent();
      if (!parent.attr("disabled")) {
        parent.click();
      }
    }
    
    // discussion shortcut
    if (key == "d") {
      $("span:contains(Discuss)").click();
    }
    
    // report shortcut
    if (key == "r") {
      $("span:contains(Report)").click();
    }
    
    // keyboard toggle
    if (key == "b" && e.ctrlKey) {
      e.preventDefault();
      $("button[data-test=player-toggle-keyboard]").click();
    }
    
  }
});

// insert a-z shortcut hints on matching tiles
var observer = new MutationObserver(function(mutations) {
  if (isLesson()){
    var tiles = $("button[data-test=challenge-tap-token]");
	 	if (tiles.length > 0) {
 	    var alpha = "abcdefghijklmnopqrstuvwxyz";
      tiles.each(function (i, e) {
        var tile = $(e);
       	if (!tile.attr("hint-added")) {
     		  var hint = document.createElement("span");
   		    hint.className = "_2R_o5 _2S0Zh _2f9B3 matching-hint";
 		      hint.innerHTML = alpha.charAt(i);
          hint.style.marginRight = "16px";
    	    tile.prepend(hint);
          hint = $(hint);
          var buttonObserver = new MutationObserver(function(m) {
            if (tile.hasClass("pmjld")) {
              hint.removeClass("_2R_o5").addClass("Z7UoT");
            } else {
              hint.removeClass("Z7UoT").addClass("_2R_o5");
            }
            if (tile.attr("disabled")) {
			      	hint.css("color", "#e5e5e5");
              buttonObserver.disconnect();
		    		}
          });
          buttonObserver.observe(e, {attributes: true});
       		tile.attr("hint-added", "1");
     	  }
   	  });
 	  }
  }
});

observer.observe(document, {childList: true, subtree: true, attributes: false, characterData: false});