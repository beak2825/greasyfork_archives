// ==UserScript==
// @name        BvS Peace Treaty Helper
// @namespace   ns://yesterday.BvS.local/
// @description Disables villages with which you have a peace treaty in spy/bingo/attack menus.
// @include     http://*animecubed.com/billy/bvs/village.html
// @include     http://*animecubed.com/billy/bvs/bingo.html
// @include     http://*animecubed.com/billy/bvs/villageattack.html
// @include     http://*animecubed.com/billy/bvs/villagespy.html
// @include     http://*animecubed.com/billy/bvs/villagespyreport.html
// @version     1.2.1
// @history     1.2.1 [2014-09-14] Cleaner, more generic compatibility hack.
// @history     1.2.0 [2014-09-13] Scriptish 0.1.12 compatibility hack.
// @history     1.1.0 [2014-09-12] Changed list formatting to use "Pax List".
// @history     1.0.5 [2014-09-12] Enabled multiball.
// @history     1.0.4 [2014-09-12] Changed list formatting to double-parenthesis.
// @history     1.0.3 [2014-09-12] Items are now removed from the list entirely, rather than merely being disabled.
// @history     1.0.2 [2014-09-11] Added spy report modification.
// @history     1.0.1 [2014-09-09] Changed list formatting from bracketed (impossible) to parenthesized.
// @history     1.0.0 [2014-09-08] Initial version.
// @license     WTFPL (http://wtfpl.org/)
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/4935/BvS%20Peace%20Treaty%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/4935/BvS%20Peace%20Treaty%20Helper.meta.js
// ==/UserScript==

/////////////////////////
// Options
/////////////////////////

// If the announcement parser fails badly for one or more of your alts,
// you can override it on a per-alt basis.
// For example, if you have three alts named "Main", "Alt 1", and "Alt 2":
//
// const overrideList = {
//   "Main":  ["VillageOne", "Village 2", "Village3"], // override: peace with just these three villages
//   "Alt 1": null,                                    // don't override at all (this can be omitted)
//   "Alt 2": [],                                      // override: peace with no villages
// };
//
const overrideList = null;

// Set this to "true" to see the results of the announcement parser in the console.
const logParseToConsole = false;

/////////////////////////
// Main
/////////////////////////

(function(outerGMGet,outerGMSet) { try {
  
  // Multiball! Handle multiple alts.
	const playerName = document.evaluate(
		"//input[@name='player']", document, null,
		XPathResult.ANY_UNORDERED_NODE_TYPE, null
	).singleNodeValue.value;
  
  // Get values on a per-alt basis. Non-Greasemonkey script engines typically
	// can't handle raw array values, so we also manually JSONify our data.
  function GM_setValue(key, val) {
		return outerGMSet(playerName + ";" + key, JSON.stringify(val));
	}
  function GM_getValue(key, def) {
		key = playerName + ";" + key;
		const val = outerGMGet(key, def);
		if (val) try { 
			return JSON.parse(val); 
		} catch (e) {
			console.log({err: "GM_getValue JSON parse failure!", key: key, val: val});
		}
		return def;
	}
 
  function parseAnnouncement() 
  {
    // If the user has manually specified a list of villages, use that instead of
    // checking the village announcement.
    if (overrideList && overrideList[playerName])
      return overrideList[playerName];
    
    // The kage may specify one or more lists of peaceable villages as a parenthesized,
    // comma-separated list in the village announcement, prefixed with "Pax List:",
    // e.g.:
    //
    //                Pax List: (Village1, Village2, Vil Lage3, Etc)
    //
    // Spacing and formatting is mostly ignored, but capitalization (except for the
    // initial "[Pp]ax [Ll]ist:") is not. Do not use quotation marks.
    const announcement = document.getElementById("annul");
    const match = announcement.textContent.match(/[Pp]ax [Ll]ist\:\s*\((\s*[\w ]+\s*,)*[\w ]+\)/g);
    if (match) {
      return match.map(function(L){return L.match(/\((.*)\)/)[1].split(",");})
        .reduce(function(a,b){return a.concat(b)})
        .map(function(s){return s.trim();});
    }
    
    // Otherwise, we have to guess. In so doing we just pull ALL the potential village
    // names out of the announcement text.
    // 
    // Spaces are potentially part of a village name, which is more helpful than harmful:
    // it means we're not typically going to have to worry about (e.g.) "That Village"
    // being triggered by a sentence like "That won't help." Instead, the detected strings
    // will be "That won" and "t help".
    //
    // There are still things you can name a village to sneak your way onto this list:
    // "Invading" or "Sannin", for example, will often work. Of course, players can always
    // just turn off the script...
    const textblocksSnapshot = document.evaluate(
      '//*[@id="annul"]//text()', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const textsArray = (function(){
      var a = [];
      for (var i = 0; i < textblocksSnapshot.snapshotLength; ++i) {
        const node = textblocksSnapshot.snapshotItem(i);
        a = a.concat(node.textContent.split(/[^\w ]/).map(function(e){return e.trim();}));
      }
      // filter out "and " if the kage uses the Oxford comma
      a = a.map(function(s){ if (s.match(/^and /)) return s.slice(4); return s; });

      // filter out "and " if the kage _doesn't_ use the Oxford comma, or in two-item lists
      // (this prevents villages with the five-character string " and " in their names from
      // being detected, but at time of writing no such villages exist)
      a = a.map(function(s){ return s.split(/ and /g); })
           .reduce(function(A,B){ B.forEach(function(v){A.push(v);}); return A;},[]);
      
      // filter out null strings and strings too long to be a village name
      a = a.filter(function(e){return e.length > 0 && e.length <= 10});
      
      // filter out duplicate strings (keep only one instance)
      a = Object.getOwnPropertyNames(a.reduce(function(o,k){o[k]++;return o;},({}))).sort();
      
      return a;
    })();
    
    // As a special case, we also check to see if there's a village set for invasion
    // and, if it's there, remove it from the list.
    const invadeMatch = document.body.textContent.match(
      /Planning to Invade: (.*) Village/);
    if (invadeMatch && invadeMatch[1]) {
      const invadeIndex = textsArray.indexOf(invadeMatch[1]);
      if (invadeIndex != -1) textsArray.splice(invadeIndex, 1);
    }
    
    return textsArray;
  }

  function disableInputsInForm(theForm, verbotenList)
  {
    const inputNodes = Array.prototype.filter.call(
      theForm.elements,
      function(n){return n.type != "hidden"}
    );
    
    const removedVillages = [];

    inputNodes.forEach(function(input) {
      if (input.type == "hidden") return;
      if (verbotenList.indexOf(input.value) == -1) return;
      
      // collect all the text used to label this input
      const labels = (function(n) {
        var a = [];
        while (true) {
          a.push(n);
          n = n.nextSibling;
          if (!n) break;
          if (n.tagName && ({input:1})[n.tagName.toLowerCase()]) break;
        };
        return a;
      })(input);

      labels.forEach(function(n){ n.parentNode.removeChild(n); });
      // replace real spaces in village name with nbsp
      removedVillages.push(input.value.replace(/ /g, ' '));
    });
    
    // add note concerning removed villages
    if (removedVillages.length > 0) {
      const container = theForm.parentNode;
      
      // outer div: border
      const div = document.createElement("div");

      const dStyle = div.style;
      const cStyle = getComputedStyle(container);
      
      // copy border style, width
      ["Left","Right","Bottom"].forEach(function(a){
        ["Color","Style","Width"].forEach(function(b){
          const k = "border" + a + b;
          dStyle[k] = cStyle[k];
        });
      });
      dStyle.width = cStyle.width;
      
      // inner div: text styling, text
      div.innerHTML = "<div style='color: #040; font: bold italic x-small sans-serif;\
margin: 0px 5px; text-align: right'>TEXT</span>";
      
      // add actual village list (note: NBSP in "Not shown")
      div.firstChild.firstChild.textContent = (
        "Not shown: " + removedVillages.sort().join(", ")
      );

      // insert after container
      container.parentNode.insertBefore(div, container.nextSibling);
    }
  }

  function disableFromSpyReport(verbotenList) {
    const nameTexts = (function(){
      const a = [];
      const ss = document.evaluate("//tr/td[2]/a/text()", document, null,
                                   XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (var i = 0; i < ss.snapshotLength; ++i)
        a.push(ss.snapshotItem(i));
      return a;
    })();
    
    nameTexts.forEach(function(t){
      if (verbotenList.indexOf(t.textContent.trim()) == -1)
        return;
      const td = t.parentNode.parentNode.parentNode;
      td.style.textDecoration = "line-through";
      td.style.color = "#888"
      t.parentNode.style.color = "#888";
    });
  };
  
  // main function
  (function(){
    "use strict";
    const pageURL = document.location.href;
    
    if (pageURL.endsWith("/village.html")) {
      // Get names from announcement
      const candidateNames = parseAnnouncement();
      if (logParseToConsole) console.log(candidateNames);
      GM_setValue("peaceList", candidateNames);
      return;
    }
   
    const verbotenList = GM_getValue("peaceList", []);
    
    if (pageURL.endsWith("/bingo.html")) {
      disableInputsInForm(document.forms.lookinto, verbotenList);
      return;
    }

    if (pageURL.endsWith("/villageattack.html")) {
      disableInputsInForm(document.forms.lookinto, verbotenList);
      return;
    }

    if (pageURL.endsWith("/villagespy.html")) {
      disableInputsInForm(document.forms.lookinto, verbotenList);
      disableInputsInForm(document.forms.multili, verbotenList);
      return;
    }
    
    if (pageURL.endsWith("/villagespyreport.html")) {
      disableFromSpyReport(verbotenList);
      return;
    }
    
  })();
  
} catch (e) {
  console.log(e);
}
})(GM_getValue, GM_setValue);
