// ==UserScript==
// @name         Quick Search Genre
// @namespace    https://greasyfork.org
// @license      MIT
// @version      1.12.2
// @description  Helps to quickly search titles for the genre forum game.
// @author       Nyannerz
// @match        https://gazellegames.net/forums.php?*action=viewthread*
// @icon         https://gazellegames.net/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529890/Quick%20Search%20Genre.user.js
// @updateURL https://update.greasyfork.org/scripts/529890/Quick%20Search%20Genre.meta.js
// ==/UserScript==


const activategames = [14895]; //threadids to work on
const filterAdultGames = true;
const filterDND = false;

function checkThread() {
    let threadid = window.location.href.match(/threadid=([0-9]+)/)[1];
    return activategames.includes(parseInt(threadid));
}

(function() {
    'use strict';
    if (!checkThread()) {return;}
    //$('a:contains("[Quote]")').after(function() {return ' <a id="'+this.id.replace('quote','copy')+'" href="#0" style="font-size: .8em;" data-id='+this.id.replace('quote','')+' onclick="'+$('#'+this.id).attr('onclick').replace('Quote','Yes')+'">[yes]</a>'});
    $('a:contains("[Quote]")')
        .after(function() { return ` <a id="${this.id.replace('quote','searchButton')}" class="searchgenre" data-id="${this.id.replace('quote_','')}" href="#0" style="font-size: 1em;">[Search]</a>`;});
    $('.searchgenre').click( (event) => searchUp(event.target.dataset.id));
})();

function replaceInString(str)
{
  str = str.toLowerCase();
  str = str.replace("–","-");
  str = str.replace("'", "");
  str = str.replace("shootem up", "shoot em up");
  str = str.replace("hns", "hack.and.slash");
  str = str.replace(" n ", ".and.");
  str = str.replace("3rd", "third");
  str = str.replace("mmorpg", "massive.multiplayer,Role.Playing.Game");
  str = str.replace("arpg", "action.role.playing.game");
  str = str.replace("tbrpg", "turn.based,role.playing.game");
  str = str.replace("turn based rpg", "turn.based,role.playing.game");
  str = str.replace("turn based ", "turn.based,");
  str = str.replace("jrpg", "japanese.role.playing.game");
  str = str.replace("tactical ", "tactics,");
  str = str.replace("trpg", "tactics,role.playing.game");
  str = str.replace("rpg", "Role Playing Game");
  if (str == "rts") str="Real Time Strategy";
  str = str.replace("vn", "Visual Novel");
  str = str.replace("tbs", "Turn Based Strategy");
  str = str.replace("fps", "First Person Shooter");
  str = str.replace("tps", "Third Person Shooter");
  str = str.replace("p&c", "point and click");
  str = str.replace("pnc", "point and click");
  str = str.replace("point&click", "point and click");
  str = str.replace("&", "and");
  str = str.replaceAll(" ", ".");
  str = str.replace("-", ".");
  str = str.replace(":", "");
  return str;
}

function inPost(elt) {return $.contains($("#post" + postid)[0], elt);}

function searchUp(postid)
{
  let post;


  if (getSelection().toString() && inPost(getSelection().anchorNode) && inPost(getSelection().focusNode)) post=getSelection().toString();
  else post = $("#content"+postid).html().trim();
  console.log(post);
  var questionAnswerStringPairs = post.split('<br>');
  let line;
  console.log(questionAnswerStringPairs);
  if(questionAnswerStringPairs.length >=3)line = questionAnswerStringPairs[2];
  else line = questionAnswerStringPairs[1];

  if(!line) line = questionAnswerStringPairs[1];
  line = line.substr(1);
  line = line.replace("4x", "fourecks"); //have to do this jank so I don't need to wrestle the regex
  line = line.replace("4X", "fourecks");
  let lineBeforeNumber = line.match(/^\D+/)[0].trim();
  let lineAfterNumber = line.substr(lineBeforeNumber.length).trim();
  lineBeforeNumber = lineBeforeNumber.replace("fourecks", "4x"); //have to do this jank so I don't need to wrestle the regex
  if(lineBeforeNumber.slice(-1) == "(" || lineBeforeNumber.slice(-1) == "[") lineBeforeNumber = lineBeforeNumber.substr(0,lineBeforeNumber.length-1);
  if(lineAfterNumber.slice(-1) == ")" || lineAfterNumber.slice(-1) == "]") lineAfterNumber = lineAfterNumber.substr(0,lineAfterNumber.length-1);

  lineBeforeNumber = lineBeforeNumber.trim();
  lineAfterNumber = lineAfterNumber.trim();
  if(lineAfterNumber.length <= 2)//damn you J_0
  {
    lineAfterNumber = questionAnswerStringPairs[3];
    if(lineAfterNumber.slice(-1) == ")" || lineAfterNumber.slice(-1) == "]") lineAfterNumber = lineAfterNumber.substr(0,lineAfterNumber.length-1);
    lineAfterNumber = lineAfterNumber.trim();
  }
  lineAfterNumber = lineAfterNumber.replaceAll(" ", "");
  lineBeforeNumber = replaceInString(lineBeforeNumber);
  if (filterAdultGames) lineBeforeNumber += ",-adult";
  if (filterDND) lineBeforeNumber += ",-dungeons.and.dragons";
  let url = `https://gazellegames.net/torrents.php?artistname=&action=basic&year=${lineAfterNumber}&taglist=${lineBeforeNumber}&tags_type=1&order_by=relevance&order_way=desc&empty_groups=both`;
  window.open(url, '_blank').focus();

  console.log(lineBeforeNumber);
  console.log(lineAfterNumber);
  console.log(questionAnswerStringPairs);
}