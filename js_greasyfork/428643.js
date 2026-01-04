// ==UserScript==
// @name         wimbledon.com event filter for men
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  shows only the men's singles match info for live and upcoming events.
// @author       big-guy
// @match        https://www.wimbledon.com/en_GB/scores/*
// @icon         https://www.google.com/s2/favicons?domain=wimbledon.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428643/wimbledoncom%20event%20filter%20for%20men.user.js
// @updateURL https://update.greasyfork.org/scripts/428643/wimbledoncom%20event%20filter%20for%20men.meta.js
// ==/UserScript==


//press f or click empty space to filter only mens singles matches.

function filterw(){
  console.log('filtering for men only');
  var matches = [];
  document.querySelectorAll('.match').forEach(function(post) {
    var isMen = (post.getElementsByClassName('event')[0].innerText.toLowerCase().search("gentlemen's singles") >= 0) || false;
    if (!isMen){
      post.remove()
    }
  });
  document.querySelectorAll('.match-box-container').forEach(function(post) {
    var isMen = (post.getElementsByClassName('event-type')[0].innerText.toLowerCase().search("gentlemen's singles") >= 0) || false;
    if (!isMen){
      post.remove()
    }
  });
  document.querySelectorAll('.match-information span').forEach(function(post) {
    post.querySelectorAll('.player-info .match-type-status .match-type').forEach(function(subpost) {
      var isMen = (subpost.innerText.toLowerCase().search("gentlemen's singles") >= 0);
      if (isMen==false){
        post.remove()
      }
    });
  });
}

var a = document.createElement('a');
    a.id = "mybutt";
    a.class = 'togg';
    a.href = 'javascript:void(0)';
    a.innerText = "[FILTER FOR MEN]";
    a.onclick = filterw;

function append(){
  document.getElementsByClassName('live-status') ? document.getElementsByClassName('live-status')[0].prepend(a) : alert('click anywhere on the page to show filter button at top left');//live-status

}
console.log('removing womens press f');
document.addEventListener('load',append());
document.onclick = function () {
  filterw()
    document.getElementsByClassName('jsx-parser') && !document.getElementById('mybutt') ? document.getElementsByClassName('jsx-parser')[0].append(a) : null;
    document.getElementsByClassName('sidepanel-content-scores') && !document.getElementById('mybutt')  ? document.getElementsByClassName('sidepanel-content-scores')[0].prepend(a) : null;
};

document.addEventListener('keydown', function(event) {
  if (event.code == 'KeyF'){
    console.log('got keypress');
    filterw();
  }
});