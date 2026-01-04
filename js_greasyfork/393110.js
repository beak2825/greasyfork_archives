// ==UserScript==
// @name     OGame Delay Helper
// @version  1
// @description:de Hilft beim Verzögern von Flotten
// @grant    none
// @include  *://*.ogame.gameforge.com/game/index.php?page=*fleetdispatch
// @namespace https://greasyfork.org/users/406969
// @description Hilft beim Verzögern von Flotten
// @downloadURL https://update.greasyfork.org/scripts/393110/OGame%20Delay%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/393110/OGame%20Delay%20Helper.meta.js
// ==/UserScript==

li_id = "delayAKS";
li_possible_time_id = "delay_possibleAKS";
maximum_delay_percent = 0.3

function updateAKSDelayTimes(){
  if(window.document.getElementById("fleet3").style.display == "none" || !window.document.getElementById("missionButton2").classList.contains("selected"))
    return;
  
  if(window.document.getElementById(li_id) == null){
    var x = document.createElement("LI");
    x.id = li_id;
    window.document.getElementById("roundup").firstElementChild.appendChild(x)
  }

  if(window.document.getElementById(li_possible_time_id) == null){
    var x = document.createElement("LI");
    x.id = li_possible_time_id;
    window.document.getElementById("roundup").firstElementChild.appendChild(x)
  }

  var li_elem = window.document.getElementById(li_id);
  var li_time_possible_elem = window.document.getElementById(li_possible_time_id);;
  var duration = seconds_from_string(window.document.getElementById("duration").innerText.replace(" h", ""));
  var durationAKS = seconds_from_string(window.document.getElementById("durationAKS").innerText);
  var possible_delayAKS = durationAKS * maximum_delay_percent;

  var delay = Math.floor(Math.max(0, duration - durationAKS));
  var time_until_impossible = Math.floor(durationAKS - duration / (1 + maximum_delay_percent));

  li_elem.innerHTML = "Verzögerung: <span class=\"value\"><span id=\"" + li_id + "\">" + string_from_seconds(delay) + "</span> h</span>";
  li_time_possible_elem.innerHTML = "Verzögerung möglich: <span class=\"value\"><span id=\"" + li_possible_time_id + "\">" + string_from_seconds(time_until_impossible) + "</span> h</span>";
}

function seconds_from_string(s){
  arr = s.split(":");
  return parseInt(arr[0]) * 3600 + parseInt(arr[1]) * 60 + parseInt(arr[2]);
}

function string_from_seconds(sec){
  sec = Math.floor(sec);
  if(sec < 0) return "impossible!";
  return pad(Math.floor(sec / 3600), 2) + ":" + pad(Math.floor((sec % 3600) / 60), 2) + ":" + pad(Math.floor(sec % 60), 2);
}

function pad(num, size) {
    var s = "0" + num;
    return s.substr(s.length-size);
}

var observer_duration = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if(mutation.target.style.display != "none"){
      updateAKSDelayTimes();
    }
  });
});

observer_duration.observe(window.document.getElementById("durationAKS"), {
  childList: true
});
