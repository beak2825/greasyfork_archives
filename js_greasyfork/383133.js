// ==UserScript==
// @name        Jira QA Helper
// @namespace   Jira QA Helper
// @include     https://jsw.ibm.com/browse/*-*
// @include     https://jsw.ibm.com/projects/IB/issues/*-*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js
// @version     1.25
// @description Help developers to deliver high quality pages
// @grant       none
// allow pasting
// @downloadURL https://update.greasyfork.org/scripts/383133/Jira%20QA%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/383133/Jira%20QA%20Helper.meta.js
// ==/UserScript==

var insertScript = `<script>
var idleTime = 0; // Stores duration of user idle (not scrolling or moving the cursor)
var blockzillaAppearTimes = 10000; // How many times Blockzilla will appear
jQuery(document).ready(function() {
    function showBlockzilla() {
      jQuery("#blockzilla").addClass("blockzilla-walk"); // makes him walk
      setTimeout(function(){
        jQuery("#blockzilla").removeClass("blockzilla-walk"); // makes him stop walking after the walk animation
        if(blockzillaAppearTimes > 0) {
          blockzillaTimer(); // Makes the itle timer run again if he didn't reach maximum appearances
        }
      }, 28000); // 28 seconds of animation to start the scripts
    }
    function blockzillaTimer() {
      idleTime = 0; // Resets idle timer
      var timeToShowBlockzilla = Math.floor(Math.random() * 120) + 60; // Duration of idle time to Blockzilla appear, between 60s and 300s
      blockzillaAppearTimes--; // Reduces number of times that he will appear on the page
      nIntervId = setInterval(function(){ // Every 1 second increases the timer or show Blockzilla
        if(idleTime <= timeToShowBlockzilla - 1){
          idleTime++; // Timer runs if is not time to show the monster
        } else {
          showBlockzilla(); // Shows Blockzilla if timer is ready and
          clearInterval(nIntervId); // stops the timer
        }
      }, 1000);
    }
    blockzillaTimer(); // begin the fun
});
jQuery(window).scroll(function(){
  idleTime = 0; // if page is scrolled, resets the timer
});
jQuery(window).mousemove(function(){
  idleTime = 0; // if cursor moves, resets the timer
});
if(!localStorage['qa-sound']) {
  localStorage['qa-sound'] = "on";
}
if(localStorage['qa-sound'] == "off") {
  jQuery("#qa-sound").css("background-position","top right");
}
var counter = 0;
var checklist = [
  "CMS links to be relative",
  "Links opening guidance",
  "Alternative text (alt)",
  "Kaltura ID on videos",
  "Background images on mobile",
  "Metadata",
  "Page admin ID",
  "URL definition",
  "Drupal URL when delivering"
];
var numberOfChecks = checklist.length;
function addNewPage() {
  var peopleList = [
    "bruno",
    "rodrigo"
  ];
  var randomPerson = peopleList[parseInt(Math.random() * peopleList.length)];
  var newPageCode = \`<div class="checklist">
    <p><input type="text" placeholder="URL of the page"></p>\`;
  checklist.forEach(function(item, index){
    newPageCode += \`<p><input id="option-\`+ (counter*numberOfChecks + index) +\`" type="checkbox"> <label for="option-\`+ (counter*numberOfChecks + index) +\`">\`+item+\`</label></p>\`;
  });
  newPageCode += \`<img class="bottom-person" src="http://webdev.webmaster.ibm.com/blockchain/qa-checklist/\`+randomPerson+\`.png" width="50" height="44">\`;
  newPageCode += \`</div>\`;
  jQuery("#qa-pages").append(newPageCode);
  jQuery("#qa-content .gradient").css("height","");
  jQuery("#qa-content .gradient").css("height",jQuery("#qa-content .gradient").height());
  counter++;
}

jQuery(document).on("click", "#qa-pages input[type=checkbox]", function(){
  var allCompleted = true;
  var soundList = [
    "uau",
    "uau-2",
    "uau-3",
    "nice",
    "good-job",
    "good-job-2",
    "are-you-sure"
  ];
  var randomSound = soundList[parseInt(Math.random() * soundList.length)];
  var sound = document.getElementById(randomSound);
  var min = parseInt(parseInt(jQuery(this).attr("id").replace("option-","")) / checklist.length) * checklist.length;
  var max = min + checklist.length - 1;
  for(var i = min; i <= max; i++) {
    if(jQuery("#option-"+i).prop("checked") == false) {
      allCompleted = false;
    }
  }
  if(allCompleted == true) {
    sound = document.getElementById("yay");
    jQuery(this).closest(".checklist").addClass("congratz");
    jQuery(this).closest(".checklist").prepend("<div class='greg'></div>");
    var thisChecklist = jQuery(this).closest(".checklist");
    setTimeout(function(){
      thisChecklist.removeClass("congratz");
      thisChecklist.find(".greg").remove();
    }, 2800);
    allCompleted = false;
  }
  if(jQuery(this).prop("checked") == true && allCompleted == false && localStorage['qa-sound'] == "on") {
    sound.play();
  }
});

jQuery(document).on("click", "#qa-sound", function(){
  if(localStorage['qa-sound'] == "on") {
    localStorage['qa-sound'] = "off";
    jQuery("#qa-sound").css("background-position","top right");
  } else {
    localStorage['qa-sound'] = "on";
    jQuery("#qa-sound").css("background-position","top left");
  }
});

jQuery(document).ready(function(){
  for(var i = 1; i <= 6000; i++) {
    setTimeout(function(){
      jQuery("#qa-tab").addClass("shake");
    }, i * 30000);
    setTimeout(function(){
      jQuery("#qa-tab").removeClass("shake");
    }, i * 30000 + 820);
  }
});

addNewPage();
</script>`;

var insertHTML = `<div id="qa-container">
  <div id="qa-sound"></div>
  <div id="qa-tab">
    <span>QA</span>
  </div>
  <div id="qa-content">
    <h2>QA Checklist <img src="http://webdev.webmaster.ibm.com/blockchain/qa-checklist/greg.png" width="2" style="visibility:hidden" alt="Greg cool guy"></h2>
    <div class="gradient">
      <div id="qa-pages">
      </div>
    </div>
    <p>
      <a href="#" onclick="addNewPage(); return false;" style="text-decoration:none; text-shadow: 1px 1px white; position: relative; z-index: 99">
        <span style="color:#1bcc17;">+</span> <span style="color:#c6c6c6;font-weight: bold;">new page</span>
      </a>
    </p>
    <div id="blockzilla" style="position:absolute;right:-170px;bottom:-12px;width:167px;height:159px; opacity: 0.4; pointer-events: none;">
      <div class="blockzilla" style="position:relative;width:100%;height:100%">
        <img src="http://webdev.webmaster.ibm.com/blockchain/qa-checklist/blockzilla-jaw.png" alt="" class="blockzilla-jaw" style="position:absolute;top:2%;left:2%;width:41%;height:auto;">
        <img src="http://webdev.webmaster.ibm.com/blockchain/qa-checklist/blockzilla-back-arm.png" alt="" class="blockzilla-back-arm" style="position:absolute;top:22%;left:10%;width:41%;height:auto;">
        <img src="http://webdev.webmaster.ibm.com/blockchain/qa-checklist/blockzilla-body.png" alt="" class="blockzilla-body" style="position:absolute;top:0;left:0;width:100%;height:auto;">
        <img src="http://webdev.webmaster.ibm.com/blockchain/qa-checklist/blockzilla-front-arm.png" alt="" class="blockzilla-front-arm" style="position:absolute;top:22%;left:10%;width:41%;height:auto;">
      </div>
    </div>
    <div id="sounds">
      <audio id="uau" src="http://webdev.webmaster.ibm.com/blockchain/qa-checklist/uau.mp3" autostart="0"></audio>
      <audio id="uau-2" src="http://webdev.webmaster.ibm.com/blockchain/qa-checklist/uau-2.mp3" autostart="0"></audio>
      <audio id="uau-3" src="http://webdev.webmaster.ibm.com/blockchain/qa-checklist/uau-3.mp3" autostart="0"></audio>
      <audio id="nice" src="http://webdev.webmaster.ibm.com/blockchain/qa-checklist/nice.mp3" autostart="0"></audio>
      <audio id="good-job" src="http://webdev.webmaster.ibm.com/blockchain/qa-checklist/good-job.mp3" autostart="0"></audio>
      <audio id="good-job-2" src="http://webdev.webmaster.ibm.com/blockchain/qa-checklist/good-job-2.mp3" autostart="0"></audio>
      <audio id="are-you-sure" src="http://webdev.webmaster.ibm.com/blockchain/qa-checklist/are-you-sure.aac" autostart="0"></audio>
      <audio id="yay" src="http://webdev.webmaster.ibm.com/blockchain/qa-checklist/yay.mp3" autostart="0"></audio>
    </div>
  </div>
</div>`;

var insertCSS = `<style>
  body #page {
    width: 100%;
    transition: all 0.2s linear;
    -o-transition: all 0.2s linear; /* opera */
    -ms-transition: all 0.2s linear; /* IE 10 */
    -moz-transition: all 0.2s linear; /* Firefox */
    -webkit-transition: all 0.2s linear; /*safari and chrome */
  }
  body.qa-active #page {
    width: 75%;
  }
  #qa-content {
    overflow: hidden;
    width: 25%;
    height: 100%;
    box-sizing: border-box;
    border-left: 1px solid #ccc;
    position: fixed;
    right: -25%;
    top: 0px;
    background: white;
    padding: 20px;
    transition: all 0.2s linear;
    -o-transition: all 0.2s linear; /* opera */
    -ms-transition: all 0.2s linear; /* IE 10 */
    -moz-transition: all 0.2s linear; /* Firefox */
    -webkit-transition: all 0.2s linear; /*safari and chrome */
  }
  body.qa-active #qa-content {
    right: 0px;
  }
  #qa-sound {
    position: absolute;
    width: 18px;
    height: 15px;
    background-image: url("http://webdev.webmaster.ibm.com/blockchain/qa-checklist/sound.png");
    background-position: top left;
    cursor: pointer;
    right: 25px;
    top: 27px;
    z-index: 11;
  }
  #qa-content h2 {
    margin-bottom: 20px;
  }
  #qa-tab {
    width: 50px;
    height: 60px;
    cursor: pointer;
    display: block;
    position: fixed;
    right: -1px;
    background: white;
    z-index: 10;
    border-radius: 3px 0 0 3px;
    top: 25%;
    border: 1px solid #ccc;
    border-right: 1px solid #fff;
    text-align: center;
    font-weight: bold;
    font-size: 15px;
    line-height: 59px;
    color: #498bef;
    transition: all 0.2s linear;
    -o-transition: all 0.2s linear; /* opera */
    -ms-transition: all 0.2s linear; /* IE 10 */
    -moz-transition: all 0.2s linear; /* Firefox */
    -webkit-transition: all 0.2s linear; /*safari and chrome */
  }
  body.qa-active #qa-tab {
    right: 25%;
    right: calc(25% - 1px);
  }
  #qa-tab span {
    position: relative;
  }
  #qa-tab span:before {
    content: "«";
    display: block;
    opacity: 0;
    width: 10px;
    height: 10px;
    position: absolute;
    left: -12px;
    top: 0px;
    color: #b3b3b3;
    line-height: 15px;
    font-size: 20px;
    transition: all 0.2s linear;
    -o-transition: all 0.2s linear; /* opera */
    -ms-transition: all 0.2s linear; /* IE 10 */
    -moz-transition: all 0.2s linear; /* Firefox */
    -webkit-transition: all 0.2s linear; /*safari and chrome */
  }
  #qa-tab:hover span:before {
    opacity: 1;
  }
  body.qa-active #qa-tab span:before {
    content: "»";
  }
  #qa-content .gradient {
    position: relative;
    max-height: 75%;
    max-height: calc(100% - 80px);
  }
  #qa-content .gradient:after {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 30px;
    right: 0;
    bottom: 0;
    background-color: none;
    background-image: linear-gradient(rgba(255,255,255,0), rgba(255,255,255,1));
    pointer-events: none;
  }
  #qa-content .checklist {
    position: relative;
    border: 1px solid #f2f2f2;
    padding: 10px;
    margin-bottom: 10px;
    margin-top: 0px;
    transition: all 0.2s linear;
    -o-transition: all 0.2s linear; /* opera */
    -ms-transition: all 0.2s linear; /* IE 10 */
    -moz-transition: all 0.2s linear; /* Firefox */
    -webkit-transition: all 0.2s linear; /*safari and chrome */
  }
  #qa-content .checklist:before, #qa-content .checklist:after {
    content: "";
    display: block;
    position: absolute;
    width: 30px;
    height: 0px;
    top: -31px;
    background-color: none;
    pointer-events: none;
    transition: all 0.2s linear;
    -o-transition: all 0.2s linear; /* opera */
    -ms-transition: all 0.2s linear; /* IE 10 */
    -moz-transition: all 0.2s linear; /* Firefox */
    -webkit-transition: all 0.2s linear; /*safari and chrome */
  }
  #qa-content .checklist.congratz:before, #qa-content .checklist.congratz:after {
    height: 30px;
  }
  #qa-content .checklist:before {
    left: 0;
    background-image: linear-gradient(to left, rgba(255,255,255,0), rgba(255,255,255,1));
  }
  #qa-content .checklist:after {
    right: 0;
    background-image: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1));
  }
  #qa-content .checklist.congratz {
    margin-top: 40px;
  }
  #qa-content .checklist:last-child {
    margin-bottom: 30px;
  }
  #qa-content .checklist input[type=text] {
    width: 100%;
    box-sizing: border-box;
    border-radius: 10px;
    border: 1px solid #ebe5f6;
    height: 27px;
    padding: 5px 5px 5px 10px;
  }
  #qa-content #qa-pages {
    overflow-y: scroll;
    overflow-x: hidden;
    height: 100%;
    width: 100%;
  }
  @keyframes move {
    from {
      display: none;
      margin-left: 0px;
    }
    to {
      display: block;
      margin-left: 120%;
    }
  }
  .greg {
    position: absolute;
    top: -25px;
    left: -30px;
    width: 30px;
    height: 25px;
    background: url('http://webdev.webmaster.ibm.com/blockchain/qa-checklist/greg.png') no-repeat center top / cover;
    animation-name: move;
    animation-duration: 4s;
  }
  .bottom-person {
    position: absolute;
    bottom: -1px;
    right: -1px;
    border-left: 1px solid #bababa;
    border-radius: 20px 0 0 0;
    border-top: 1px solid #bababa;
    background: #eaedff;
    padding-left: 5px;
    opacity: 0.8;
  }
  .blockzilla {
    -webkit-animation:1.6s linear 0s normal none infinite blockzilla-balance;
    animation:1.6s linear 0s normal none infinite blockzilla-balance;
  }
  .blockzilla-walk {
    display: block;
    -webkit-animation:28s linear 0s normal none 1 blockzilla-walk;
    animation:28s linear 0s normal none 1 blockzilla-walk;
  }
  .blockzilla-jaw {
    -webkit-animation:2.3s linear 0s normal none infinite blockzilla-jaw;
    animation:2.3s linear 0s normal none infinite blockzilla-jaw;
  }
  .blockzilla-front-arm {
    -webkit-animation:1.8s linear 0s normal none infinite blockzilla-front-arm;
    animation:1.8s linear 0s normal none infinite blockzilla-front-arm;
  }
  .blockzilla-back-arm {
    -webkit-animation:1.8s linear 0s normal none infinite blockzilla-jaw;
    animation:1.8s linear 0s normal none infinite blockzilla-jaw;
  }
  @-webkit-keyframes blockzilla-balance {
    0% {
      -webkit-transform:rotate(-4deg);
    }
    50% {
      -webkit-transform:rotate(4deg);
    }
    100% {
      -webkit-transform:rotate(-4deg);
    }
  }
  @-webkit-keyframes blockzilla-walk {
    0% {
      margin-right: 0;
      -moz-transform: scaleX(1);
      -o-transform: scaleX(1);
      -webkit-transform: scaleX(1);
      transform: scaleX(1);
      filter: none;
      -ms-filter: none;
    }
    45% {
      margin-right: 140%;
      -moz-transform: scaleX(1);
      -o-transform: scaleX(1);
      -webkit-transform: scaleX(1);
      transform: scaleX(1);
      filter: none;
      -ms-filter: none;
    }
    48% {
      margin-right: 140%;
      -moz-transform: scaleX(1);
      -o-transform: scaleX(1);
      -webkit-transform: scaleX(1);
      transform: scaleX(1);
      filter: none;
      -ms-filter: none;
    }
    52% {
      margin-right: 140%;
      -moz-transform: scaleX(-1);
      -o-transform: scaleX(-1);
      -webkit-transform: scaleX(-1);
      transform: scaleX(-1);
      filter: FlipH;
      -ms-filter: "FlipH";
    }
    55% {
      margin-right: 140%;
      -moz-transform: scaleX(-1);
      -o-transform: scaleX(-1);
      -webkit-transform: scaleX(-1);
      transform: scaleX(-1);
      filter: FlipH;
      -ms-filter: "FlipH";
    }
    100% {
      margin-right: 0;
      -moz-transform: scaleX(-1);
      -o-transform: scaleX(-1);
      -webkit-transform: scaleX(-1);
      transform: scaleX(-1);
      filter: FlipH;
      -ms-filter: "FlipH";
    }
  }
  @-webkit-keyframes blockzilla-jaw {
    0% {
      -webkit-transform:rotate(-10deg);
    }
    50% {
      -webkit-transform:rotate(10deg);
    }
    100% {
      -webkit-transform:rotate(-10deg);
    }
  }
  @-webkit-keyframes blockzilla-front-arm {
    0% {
      -webkit-transform:rotate(15deg);
    }
    50% {
      -webkit-transform:rotate(-5deg);
    }
    100% {
      -webkit-transform:rotate(15deg);
    }
  }
  body:not(.qa-active) #qa-tab.shake {
    animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
  }
  @keyframes shake {
    10%, 90% {
      transform: translate3d(0, -1px, 0);
    }
    20%, 80% {
      transform: translate3d(0, 2px, 0);
    }
    30%, 50%, 70% {
      transform: translate3d(0, -4px, 0);
    }
    40%, 60% {
      transform: translate3d(0, 4px, 0);
    }
  }
</style>`;

jQuery("#page").before(insertHTML);
jQuery("head").append(insertCSS);
jQuery("head").append(insertScript);

jQuery("#qa-tab").click(function(){
  jQuery("body").toggleClass("qa-active");
  setTimeout(function(){
    window.dispatchEvent(new Event('resize'));
  }, 300);
});
