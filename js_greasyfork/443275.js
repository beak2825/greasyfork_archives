// ==UserScript==
// @name     Twitch-collapse-messages
// @description     Twitch.tv hide chat messages from certain usernames (bots)
// @version  1
// @grant    none
// @match    https://www.twitch.tv/*
// @namespace https://greasyfork.org/users/901386
// @downloadURL https://update.greasyfork.org/scripts/443275/Twitch-collapse-messages.user.js
// @updateURL https://update.greasyfork.org/scripts/443275/Twitch-collapse-messages.meta.js
// ==/UserScript==


//usernames based on the viewed channel
lists = {};
lists['beastr0'] = ["Moobot","Nightbot","zsemlebot"];
  
  


function log(msg) {
  console.log(`[Twitch collapse messages script] ${msg}`);
}

function registerListener() {  
  log('Entering registerListener');
  
	const chatMessageContainer = document.querySelector('[role="log"]');
  
  if (chatMessageContainer == null) {
    log("registerListener couldn't find chat box, trying again in 1s");
    setTimeout(registerListener, 1000);
    return;
  }
  
  channel = window.location.pathname.substr(1);  
  if (lists[channel] === undefined) {
    log("channel ${channel} is not in list of monitored channels");
    return;
  }
  
  const onChatMessageListModified = function(mutationsList, observer) {
      for(let mutation of mutationsList) {
          if (mutation.type !== 'childList') {
              return;
          }

          mutation.addedNodes.forEach(node => {
              const message = node.querySelector("[data-test-selector='chat-line-message-body']");
              const text = node.querySelector('[data-a-target="chat-message-text"]').innerText;
              const username = node.querySelector('[data-a-target="chat-message-username"]').innerText;
              if (lists[channel].indexOf(username) != -1) {
                log(`Hiding message: ${text}`);
                colapseMe(message);
              }
              //if (text.startsWith('!')) {
              //  log(`Hiding message: ${text}`);
              //  node.style.display = 'none';
              //}
          });
      }
  };

  const observer = new MutationObserver(onChatMessageListModified);
  observer.observe(chatMessageContainer, { childList: true });
  
  log('registerListener completed successfully');
}


function colapseMe(e) {
  console.log("adding a plus sign");
  console.log(e);
  e.style.display = "none";
  var expand_b = document.createElement("span");
  function expand_msg(){
    e.style.display = "inherit";
    expand_b.style.display ="none";
    console.log('clicked');
  }
  expand_b.innerHTML = "[+]";
  expand_b.style = "background-color:#aaa; color:#555;";
  expand_b.addEventListener("click", expand_msg);
  e.parentNode.insertBefore(expand_b, e);
  
}


log('beginning first-time registration attempt');
registerListener();