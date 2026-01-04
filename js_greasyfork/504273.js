// ==UserScript==
// @name        Mute KvR topics
// @namespace   Violentmonkey Scripts
// @match       https://www.kvraudio.com/forum/viewforum.php*
// @grant       none
// @version     0.666
// @author      farlukar
// @description Hides topics by certain authors in the forum view
// @license CC0
// @downloadURL https://update.greasyfork.org/scripts/504273/Mute%20KvR%20topics.user.js
// @updateURL https://update.greasyfork.org/scripts/504273/Mute%20KvR%20topics.meta.js
// ==/UserScript==


let mutelist = [ "*", "*", "*", "*", "*" ];
//       Edit the above, replace asterisks with user names on your foes list (note: case sensitive!)
//       e.g. [ "*", '*', '*', "*", "*" ] -> [ "DumbTopicPoster", "Right Bastard", "sOmetr0ll", "*", "*" ] 

//       Add more if necessary.



let allTopics, thisTopic, topicAuthor, i;


allTopics = document.getElementsByClassName('topic-poster');


for (i = allTopics.length-1; i>=0; i--) {
  thisTopic = allTopics[i];

  topicAuthor = thisTopic.querySelectorAll(".username,.username-coloured")[0].innerHTML;
  if (mutelist.indexOf(topicAuthor) != -1) {
    thisTopic.parentNode.parentNode.parentNode.innerHTML = "<span><big><big><big><big>&emsp; &emsp; &emsp; &emsp; ಠ_ಠ </big></big></big></big></span>";
  }
}