// ==UserScript==
// @name         Fighting Game Notationizer
// @namespace    http://erichgaming.com/
// @version      5.8
// @description  convert text notation for fighting games to images
// @author       ejrich
// @license MIT
// @match        https://www.dustloop.com/*
// @match        https://www.reddit.com/r/Guiltygear/*
// @match        https://www.reddit.com/r/StreetFighter/*
// @match        https://fullmeter.com/*
// @match        https://drunkardshade.com/*
// @match        https://erichgaming.com/fg/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14731/Fighting%20Game%20Notationizer.user.js
// @updateURL https://update.greasyfork.org/scripts/14731/Fighting%20Game%20Notationizer.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var FGIT = {
    site: '//www.erichgaming.com/fgi/',
    $2rx: /\$2/g
};
FGIT.startingMatchers = [
    {rx: /\b(4?1236)(LP|MP|HP|LK|MK|HK|HS|[PKDSHABC]|4|41236)/g, img: 'hcf.png'},
    {rx: /\b(6?3214)(LP|MP|HP|LK|MK|HK|HS|[PKDSHABC]|6|63214)/g, img: 'hcb.png'},
    {rx: /(j\.?)(LP|MP|HP|LK|MK|HK|HS|[PKDSHABC]|2|236|214)/g, img: 'jump.png'},
    {rx: /\b(236)(LP|MP|HP|LK|MK|HK|HS|[PKDSHABC]|236(?:HS|[PKDSHABC])|3214)/g, img: 'qcf.png'},
    {rx: /\b(214)(LP|MP|HP|LK|MK|HK|HS|[PKDSHABC]|214(?:HS|[PKDSHABC])|1236)/g, img: 'qcb.png'},
    {rx: /(623)(LP|MP|HP|LK|MK|HK|HS|[PKDSHABC])/g, img: 'shoryf.png'},
    {rx: /(421)(LP|MP|HP|LK|MK|HK|HS|[PKDSHABC])/g, img: 'shoryb.png'},
    {rx: /\b(2)(LP|MP|HP|LK|MK|HK|HS|[PKDSHABC])/g, img: 'down.png'},
    {rx: /\b(2)(2LP|2MP|2HP|2LK|2MK|2HK|2HS|2[PKDSHABC])/g, img: 'down.png'},
    {rx: /\b(4)(LP|MP|HP|LK|MK|HK|HS|[PKDSHABC])/g, img: 'back.png'},
    {rx: /\b(4)(4HS|4[PKDSHABC])/g, img: 'back.png'},
    {rx: /\b(4)(6LP|6MP|6HP|6LK|6MK|6HK|6HS|6[PKDSHABC])/g, img: 'back.png'},
    {rx: /\b(6)(LP|MP|HP|LK|MK|HK|HS|[PKDSHABC])/g, img: 'forward.png'},
    {rx: /\b(6)(6HS|6[PKDSHABC])/g, img: 'forward.png'},
    {rx: /\b(1)(LP|MP|HP|LK|MK|HK|HS|[PKDSHABC])/g, img: 'downback.png'},
    {rx: /\b(3)(LP|MP|HP|LK|MK|HK|HS|[PKDSHABC])/g, img: 'downforward.png'},
    {rx: /\b(~)(LP|MP|HP|LK|MK|HK|HS|[PKDSHABC])/g, prefix: '~'},
    {rx: /\b(P)(\+HS|\+[KDSH])/g, img: 'sfpunch.png', height: 20},
    {rx: /\b(K)(\+HS|\+[DSH])/g, img: 'K.png', height: 20},
    {rx: /\b(S)(\+HS|\+[DH])/g, img: 'button_s.png', height: 20},
    {rx: /\b(HS|H)(\+D)/g, img: 'button_hs.png', height: 20},
    {rx: /(P)(\/K(?:\/S)?(?:\/H)?(?:\/D)?)/g, img: 'sfpunch.png', height: 20},
    {rx: /\b(c\.?S)/g, img: 'button_s.png', prefix: 'close', height: 20},
    {rx: /\b(f\.?S)/g, img: 'button_s.png', prefix: 'far', height: 20},
    {rx: /\b(cr?\.? ?)(LP|MP|HP|LK|MK|HK)/ig, img: 'down.png'},
    {rx: /\b(st\.? ?)(LP|MP|HP|LK|MK|HK)/ig},
    {rx: /\b(LP)\b/ig, img: 'lp.png', height: 22},
    {rx: /\b(MP)\b/ig, img: 'mp.png', height: 22},
    {rx: /\b(HP)\b/ig, img: 'hp.png', height: 22},
    {rx: /\b(LK)\b/ig, img: 'lk.png', height: 22},
    {rx: /\b(MK)\b/ig, img: 'mk.png', height: 22},
    {rx: /\b(HK)\b/ig, img: 'hk.png', height: 22},
    {rx: /(5P)/g, img: 'sfpunch.png', height: 20},
    {rx: /(5A)/g, img: 'A.png', height: 20},
    {rx: /(5B)/g, img: 'B.png', height: 20},
    {rx: /(5C)/g, img: 'C.png', height: 20},
    {rx: /(5K)/g, img: 'K.png', height: 20},
    {rx: /(5D)/g, img: 'button_d.png', height: 20},
    {rx: /(5S)/g, img: 'button_s.png', height: 20},
    {rx: /(5LP)/g, img: 'lp.png', height: 22},
    {rx: /(5MP)/g, img: 'mp.png', height: 22},
    {rx: /(5HP)/g, img: 'hp.png', height: 22},
    {rx: /(5LK)/g, img: 'lk.png', height: 22},
    {rx: /(5MK)/g, img: 'mk.png', height: 22},
    {rx: /(5HK)/g, img: 'hk.png', height: 22},
    {rx: /(5HS|5H)(?:[^KP]|\b)/g, img: 'button_hs.png', height: 20}
];
FGIT.endingMatchers = [
    {rx: /^\/(A)/, prefix: ' / ', img: 'A.png', cont: true, height: 20},
    {rx: /^\/(B)/i, prefix: ' / ', img: 'B.png', cont: true, height: 20},
    {rx: /^\/(C)/i, prefix: ' / ', img: 'C.png', cont: true, height: 20},
    {rx: /^\/(K)/i, prefix: ' / ', img: 'K.png', cont: true, height: 20},
    {rx: /^\/(S)/i, prefix: ' / ', img: 'button_s.png', cont: true, height: 20},
    {rx: /^\/(HS|H)/i, prefix: ' / ', img: 'button_hs.png', cont: true, height: 20},
    {rx: /^\/(D)/i, prefix: ' / ', img: 'button_d.png', height: 20},
    {rx: /^(6?3214)/, img: 'hcb.png', cont: true},
    {rx: /^(4?1236)/, img: 'hcf.png', cont: true},
    {rx: /^(236)(LP|MP|HP|LK|MK|HK|HS|[PKDSHABC])/, img: 'qcf.png', cont: true},
    {rx: /^(214)(LP|MP|HP|LK|MK|HK|HS|[PKDSHABC])/, img: 'qcb.png', cont: true},
    {rx: /^(4)(LP|MP|HP|LK|MK|HK|HS|[PKDSHABC])/i, img: 'back.png', cont: true},
    {rx: /^(6)(LP|MP|HP|LK|MK|HK|HS|[PKDSHABC])/i, img: 'forward.png', cont: true},
    {rx: /^(2)(LP|MP|HP|LK|MK|HK|HS|[PKDSHABC])/i, img: 'down.png', cont: true},
    {rx: /^(\+)(LP|MP|HP|LK|MK|HK|HS|[PKDSHABC])/i, prefix: '+', cont: true},
    {rx: /^(P)\b/i, img: 'sfpunch.png', height: 20},
	{rx: /^(A)\b/, img: 'A.png', height: 20},
	{rx: /^(B)\b/i, img: 'B.png', height: 20},
	{rx: /^(C)\b/i, img: 'C.png', height: 20},
    {rx: /^(K)\b/i, img: 'K.png', height: 20},
    {rx: /^(S)\b/i, img: 'button_s.png', height: 20},
    {rx: /^(HS|H)\b/i, img: 'button_hs.png', height: 20},
    {rx: /^(D)\b/i, img: 'button_d.png', height: 20},
    {rx: /^(LP)\b/i, img: 'lp.png', height: 22},
    {rx: /^(MP)\b/i, img: 'mp.png', height: 22},
    {rx: /^(HP)\b/i, img: 'hp.png', height: 22},
    {rx: /^(LK)\b/i, img: 'lk.png', height: 22},
    {rx: /^(MK)\b/i, img: 'mk.png', height: 22},
    {rx: /^(HK)\b/i, img: 'hk.png', height: 22}
];

FGIT.traverseChildNodes = function(node, matchers) {
 
    var next;
 
    if (node.nodeType === 1) {
 
        // (Element node)

        // Ignore link nodes 
        if (node.nodeName === 'A')
            return;

        if (node = node.firstChild) {
            do {
                // Recursively call traverseChildNodes
                // on each child node
                next = node.nextSibling;
                FGIT.traverseChildNodes(node, matchers);
            } while(node = next);
        }
 
    } else if (node.nodeType === 3) {
        var div, first, endNodes, cont;
        // (Text node)
        for (var i = 0; i < matchers.length; i++) {
          if (matchers[i].rx.test(node.data)) {
              if (!node.parentNode) {
                  console.log(node);
              }
              div = document.createElement('div');
              div.innerHTML = node.data;
              
              cont = false;
              for (var j = 0; j < matchers.length; j++) {
                  if (!matchers[j].prefix)
                      matchers[j].prefix = '';
                  if (!matchers[j].suffix)
                      matchers[j].suffix = '';
                  if (!matchers[j].height)
                      matchers[j].height = 26;
                  
                  if (matchers[j].img) {
                      div.innerHTML = div.innerHTML.replace(matchers[j].rx, matchers[j].prefix + '<img src="' + FGIT.site + matchers[j].img + '" title="$1" style="height: ' + matchers[j].height + 'px"/>$2' + matchers[j].suffix).replace(FGIT.$2rx, '');
                  } else {
                      div.innerHTML = div.innerHTML.replace(matchers[j].rx, '<span>' + matchers[j].prefix + '</span>$2' + matchers[j].suffix).replace(FGIT.$2rx, '');
                  }
                  if (matchers[j].cont)
                      cont = true;
              }
             
              
              first = true;
              endNodes = [];
              while (div.firstChild) {
                  if (!first && div.firstChild.nodeType === 3) {
                      endNodes.push(div.firstChild);
                  }
                  first = false;
                  node.parentNode.insertBefore(div.firstChild, node);
              }
              
              node.parentNode.removeChild(node);
              
              if (matchers === FGIT.startingMatchers || cont) {
                  for (j = 0; j < endNodes.length; j++) {
                      FGIT.traverseChildNodes(endNodes[j], FGIT.endingMatchers);
                  }
              }
              break;
          }
        }
    }
};

FGIT.traverseChildNodes(document.body, FGIT.startingMatchers);

// Hook into angular for fullmeter.com
var FGNTimeout;
if (typeof angular !== 'undefined' && angular.version.major == 1 && angular.element(document.body).scope()) {
	angular.element(document.body).scope().$watch(function (value) {
		window.clearTimeout(FGNTimeout);
		FGNTimeout = window.setTimeout(function() {
			FGIT.traverseChildNodes(document.body, FGIT.startingMatchers);
		}, 1000)});
}