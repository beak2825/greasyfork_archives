// ==UserScript==
// @name     Blockety Block
// @version  2.14
// @grant    none
// @match    *://rdrama.net/*
// @namespace https://greasyfork.org/users/906873
// @description Block whoever
// @downloadURL https://update.greasyfork.org/scripts/443990/Blockety%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/443990/Blockety%20Block.meta.js
// ==/UserScript==
    var blocks = ['LUCARIO','MASCFUCKMACHINE','PAULO','ONTHEATTACK'];
	var holeblocks = ['/h/meowr'];
    var xp = null;
	var isPosts = false;

    if (document.querySelector(".comment-section")) {
        xp = document.evaluate("//div[contains(@id,'comment-')]",document.querySelector(".comment-section"),null,XPathResult.ANY_TYPE,null);
    }
    else if (document.querySelector(".posts")) {
        xp = document.evaluate("//div[contains(@id,'post-')]",document.querySelector(".posts"),null,XPathResult.ANY_TYPE,null);
      	isPosts = true;
    }

    if (xp) {
        var goaway = [];
        var next;
      
        var rc = document.evaluate("//div[contains(@class,'ricardo')]",document.body,null,XPathResult.ANY_TYPE,null);
        if (rc) {
            var next;
            while (next=rc.iterateNext()) {     
              goaway.push(next);
            }
        }     
      
        while (next=xp.iterateNext()) {
            var userId = document.evaluate("descendant::a[contains(@class,'user-name')]/span",next,null,
                XPathResult.STRING_TYPE,null).stringValue;
            /*
            if (blocks.indexOf(userId.toUpperCase()) >= 0) {
                goaway.push(next);
            }
            */
            if (typeof userId === "string" && userId.trim().length > 0 && blocks.some(
              function(a) { 
              	return userId.toUpperCase().indexOf(a) >= 0
            	}
            )) {
              goaway.push(next);
            }
          
          	
          	if (isPosts && next.querySelector(".card-block a")) {
          		var hole = next.querySelector(".card-block a").innerText;
          		if (holeblocks.indexOf(hole) >= 0) {
              	    goaway.push(next);
            	}
            }

        }
        goaway.map(function(nope) {
            nope.remove();
        });
        console.log("Blocked " + goaway.length + " posts on this page.");
    }
