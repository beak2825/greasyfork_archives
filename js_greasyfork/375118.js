// This is a Greasemonkey script and must be run using a Greasemonkey-compatible browser.
//
// ==UserScript==
// @name         Amazon Giveaway Bot - Ryan Montgomery
// @version      1.9.3
// @author       Ryan Montgomery
// @description  Automates Amazon giveaway entries
// @match        https://www.amazon.com/ga/*
// @match        https://www.amazon.com/ap/signin*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at document-start
// @namespace https://greasyfork.org/users/230049
// @downloadURL https://update.greasyfork.org/scripts/375118/Amazon%20Giveaway%20Bot%20-%20Ryan%20Montgomery.user.js
// @updateURL https://update.greasyfork.org/scripts/375118/Amazon%20Giveaway%20Bot%20-%20Ryan%20Montgomery.meta.js
// ==/UserScript==



(function() {

    var mytemplate = {};

  	mytemplate["controls.html"] = "<div id=\"container\"\n" +
  		"	style=\"font-family: Roboto,\\'Helvetica Neue\\',Helvetica,Arial,sans-serif;font-size: 100%;padding: 5px; overflow: hidden; width: 400px; color: white; background-color: #232f3e; border-color: #232f3e; border-width: 2px; border-style: solid; z-index: 9999; text-align: center; display: flex; flex-direction: column; justify-content: center;\">\n" +
  		"	<h3 class=\"textColor\" style=\"padding-top: 0; margin-top: 0;\">Amazon Giveaway Automator</h3>\n" +
  		"\n" +
  		"		<div><span for=\"allowVideos\">Allow Videos: </span><input id=\"allowVideos\" name=\"allowVideos\" type=\"checkbox\"></input></div>\n" +
  		"		<div><label for=\"userEmail\">Enter your email address to receive an email when you win:</label><input id=\"userEmail\" name=\"userEmail\" type=\"text\" placeholdertype=\"Enter your email here\"></input><label>Follow me on instagram @0day</label></div>\n" +
  		"		<span id=\"numEntered\"></span>\n" +
  		"		<span id=\"currentSessionGiveawaysEntered\"></span>\n" +
  		"		<button id=\"run\">Start Automator (opens in new window)</button>\n" +
      "		<button id=\"disable\">Stop Automator</button>\n" +
  		"\n" +
  		"</div>\n" +
  		"";

    if(!GM_getValue("giveawaysEntered"))
      GM_setValue("giveawaysEntered", 0)
    if(!GM_getValue("userEmail"))
      GM_setValue("userEmail", "email")

    if(!GM_getValue("running")){

      var newHTML = document.createElement('div');
      newHTML.style.position = "absolute";
      newHTML.style.left = 'calc(50% - 200px)';
      newHTML.style.top = 150 + 'px';
      newHTML.style.zIndex = 9999;
      newHTML.innerHTML = mytemplate["controls.html"];
      document.body.appendChild(newHTML);
      document.getElementById("run").style.display = (GM_getValue("running") ? 'none' : 'block');
      document.getElementById("disable").style.display = (GM_getValue("running") ? 'block' : 'none');
      document.getElementById("currentSessionGiveawaysEntered").style.display = (GM_getValue("running") ? 'block' : 'none');
      document.getElementById("allowVideos").checked = GM_getValue("allowVideos");
      if(GM_getValue("userEmail")){
        document.getElementById("userEmail").value = GM_getValue("userEmail");
      }
      document.getElementById("numEntered").innerHTML = GM_getValue("giveawaysEntered") + ' Total Giveaways Entered';
      document.getElementById("currentSessionGiveawaysEntered").style.display = 'none'

      var automatorWindow

      document.getElementById("run").onclick = function () {
        GM_setValue("running", true)
        GM_setValue("processingGiveaways", false)
        GM_setValue("currentSessionGiveawaysEntered", 0)
        GM_setValue("currentIdx", 0)
        GM_setValue("mainPageUrl", window.location.href)
        if(document.getElementById("userEmail").value.includes("@"))
          GM_setValue("userEmail", document.getElementById("userEmail").value)
        GM_setValue("allowVideos", document.getElementById("allowVideos").checked)

        document.getElementById("run").style.display = 'none';
        document.getElementById("disable").style.display = 'block';
        document.getElementById("currentSessionGiveawaysEntered").style.display = 'block';
        automatorWindow = window.open(window.location.href, '_blank', 'height=500,width=500')
        setInterval(function() {
          document.getElementById("currentSessionGiveawaysEntered").innerHTML = GM_getValue("currentSessionGiveawaysEntered") + ' Giveaways Entered This Session';
          document.getElementById("numEntered").innerHTML = GM_getValue("giveawaysEntered") + ' Total Giveaways Entered';
          if(automatorWindow.closed && GM_getValue("running") ) {
            GM_setValue("running", false)
            GM_setValue("processingGiveaways", false)
            document.getElementById("currentSessionGiveawaysEntered").style.display = 'none';
            document.getElementById("disable").style.display = 'none';
            document.getElementById("run").style.display = 'block';
          }
        }, 1000);
        window.addEventListener('unload', () => {
          if(!automatorWindow.closed)
            automatorWindow.close()
          GM_setValue("running", false)
          GM_setValue("processingGiveaways", false)
        }, false);
      }

      document.getElementById("disable").onclick = function () {
        GM_setValue("running", false)
        GM_setValue("processGiveaways", false)
        document.getElementById("currentSessionGiveawaysEntered").style.display = 'none';
        document.getElementById("disable").style.display = 'none';
        document.getElementById("run").style.display = 'block';
        automatorWindow.close()
      }
    }

      // run script on page load
    window.addEventListener('DOMContentLoaded', main, false);


    var isSignIn = window.location.href.includes("https://www.amazon.com/ap/signin")
    var isMainPage = window.location.href.includes("https://www.amazon.com/ga/giveaways")
    var isGiveaway = window.location.href.indexOf('ga/p') !== -1;
  // var isSignInpwd = window.location.href.includes("https://www.amazon.com/ap/signin")

    function getGiveaways() {
      var giveawayItems = document.querySelectorAll(".giveawayItemContainer a");
      giveawayItems.forEach((item, idx) => {
        GM_setValue(`giveaway-${idx}`, JSON.stringify(item.href))
      })
      processGiveaways()
    }

    async function processGiveaways() {
      GM_setValue("processingGiveaways", true)
      let idx = GM_getValue("currentIdx");
      let currentGiveaway = JSON.parse(GM_getValue(`giveaway-${idx}`))
      GM_setValue(`giveaway-${idx}`, false)
      idx += 1
      GM_setValue("currentIdx", idx)
      if(idx <= 23){
        window.location.href = currentGiveaway;
      } else {
        window.location.href = GM_getValue("mainPageUrl")
      }
    }

    async function enterGiveaway(){
      let numEntered = GM_getValue("giveawaysEntered")
      numEntered += 1
      GM_setValue("giveawaysEntered", numEntered)
      numEntered = GM_getValue("currentSessionGiveawaysEntered")
      numEntered += 1
      GM_setValue("currentSessionGiveawaysEntered", numEntered)

      setInterval( () => {
        // if giveaway has video requirement, click the continiue entry button first
        if((document.getElementById("giveaway-video-watch-text") || (document.getElementById("giveaway-youtube-video-watch-text") && !document.querySelector(".continue_button_inner").disabled))){
          if(GM_getValue("allowVideos")){
            document.querySelector(".continue_button_inner").click();
            handleSubmit()
          }
          else {
            processGiveaways()
          }
        }
        // don't enter givaways with follow requirements or contains a kindle e-book
        else if (document.getElementById('en_fo_follow-announce') || (document.getElementById("giveaway-prize-container").innerText.includes('Kindle'))) {
          processGiveaways()
        }
        // otherwise, enter giveaway immediately
        else {
            if(document.querySelector("#ts_en_enter")){
              document.querySelector("#ts_en_enter span input").click()
              handleSubmit();
            }
            if(document.querySelector(".boxClickTarget")){
              document.querySelector(".boxClickTarget").click()
              handleSubmit();
            }
        }
      }, 1000)
    }

    // check page until results show up then continue to next giveaway in queue if not a winner
    function handleSubmit(){
      let emailed = false
      setInterval(() => {
        if(document.getElementById('title')){
          if(document.getElementById('title').innerHTML.includes('won')){
            // setInterval( () => GM_notification("You just won an Amazon giveaway!", "Amazon Giveway Automator"), 5000)
            if(!emailed){
              emailed = true
              GM_xmlhttpRequest({
                method: "POST",
                url: "http://email-sender-213012.appspot.com/hello",
                data: `email=${GM_getValue("userEmail")}&href=${window.location.href}`,
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
              });
            }
            document.getElementById('lu_co_ship_box-announce').click()
            processGiveaways()
            return
          } else {
            processGiveaways()
            return
          }
          return
        }
      }, 1000)
    }

    function main() {
      if(GM_getValue("running")){
        if(isSignIn){
          setInterval(() => {document.querySelector(".a-row.a-color-base").click()}, 1000)
        }
     // if(isSignInpwd){
       //   setInterval(() => {document.querySelector("#signInSubmit").click()}, 1200)
         //     }

        if(isMainPage){
          GM_setValue("mainPageUrl", window.location.href)
          if(GM_getValue("currentIdx") > 23){
            GM_setValue("processingGiveaways", false)
            GM_setValue("currentIdx", 0)
            document.querySelector(".a-last a").click()
          } else if(!GM_getValue("processingGiveaways")){
            getGiveaways();
          } else {
            processGiveaways();
          }
        }

        if(isGiveaway){
          // if giveaway has already been entered, continue on to next giveaway in queue
          if(document.querySelector("#giveaway-ended-header") || (document.getElementById('title') && !document.getElementById('title').innerText.includes('confirmation'))){
            processGiveaways()
          }
          // if giveaway has follow requirement or is having an error, don't enter
          else if(document.getElementById("ts_en_fo_follow-announce") || (document.querySelector("#giveaway-digital-eni-alert"))){
            processGiveaways()
          }
          // handle giveaways with video requirement
          else if (document.getElementById("giveaway-youtube-video-watch-text") || document.getElementById("giveaway-video-watch-text")){
            if(GM_getValue("allowVideos")){
              window.addEventListener('load', () => {
                if(document.querySelector(".continue_button_inner")){
                  if(document.querySelector(".airy-play-toggle-hint.airy-hint.airy-play-hint")){
                    document.querySelector(".airy-play-toggle-hint.airy-hint.airy-play-hint").click()
                  }
                  setTimeout(enterGiveaway, 16000)
                }
              }, false);
            }
            else {
              processGiveaways()
            }
          }
          // if giveaway has no requirements, enter it
          else{
            enterGiveaway()
          }
        }
      }
    }

})();
