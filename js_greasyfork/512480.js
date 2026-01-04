// ==UserScript==
// @name         Dream MessageHistory with photo
// @namespace    http://tampermonkey.net/
// @version      2024-10-15
// @description  MessageHistory with photo
// @author       Penis
// @match        https://www.dream-singles.com/members/messaging/compose/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512480/Dream%20MessageHistory%20with%20photo.user.js
// @updateURL https://update.greasyfork.org/scripts/512480/Dream%20MessageHistory%20with%20photo.meta.js
// ==/UserScript==

//Function to override site default script and add photos to message history
function overrideProcessMsg() {
  if (typeof processMsg !== "undefined") {
    console.log("Overriding processMsg");

    processMsg = function (data) {
      let msg = data["results"];
      // can only be sender or receiver
      hideLoadingImage();
      let who = "sender";
      let name = "";
      let photo = "";
      let hyperlinks = "<ul>";
let replyMap = new Map();
for (let i = 0; i < msg.length; i++) {
        replyMap.set(msg[i]["msg_hash"], msg[i]);
      }
      for (let i = 0; i < msg.length; i++) {
        if (msg[i]["sender"] === 1) {
          who = "sender";
        } else {
          who = "receiver";
        }
        name = msg[i]["from_name"];
        photo = `https://dream-marriage-attach.s3.amazonaws.com/msg/${btoa(
          msg[i]["attachment_hash"]
        )}.jpg`;
let replyToMessage = "";
 let replyButton = "";
if (msg[i]["reply_to"]) {
          let replyToMsg = replyMap.get(msg[i]["reply_to"]);
          if (replyToMsg) {
            replyToMessage = `
              <div class="reply-to" style="display: none; background-color: #f0f0f0; padding: 5px; margin-bottom: 5px; border-left: 2px solid #ccc;">
                <strong>${replyToMsg["from_name"]}:</strong> ${replyToMsg["body"]}
              </div>
            `;
            replyButton = `<button class="toggle-reply" data-msg-id="${msg[i]["msg_hash"]}" style="margin-top: 5px;">Show/Hide the message, this is reply to</button>`;
          }
        }
        hyperlinks +=
          '<li class="' +
          who +
          '" id="msg-' +
          msg[i]["msg_hash"] +
          '">' +
          replyToMessage +
          '<strong>' +
          name +
          ":</strong>" +
          msg[i]["hyperlink"] +
          "<br /><p>" +
          msg[i]["body"] +
          '<br /><img src="' +
          photo +
          '" class="msg-image" style="max-width: 300px; max-height: 300px;"" />' +
          "</p></li>"+
            replyButton +
          "</p></li><p>_____________________________________________________________</p>";
      }
      hyperlinks += "</ul>";

      $(" #messageHistoryPopupBody").html(hyperlinks);
$(".toggle-reply").on("click", function() {
        let msgId = $(this).data("msg-id");
        $(`#msg-${msgId} .reply-to`).toggle();
      });
    };
  }
}

// looking through scripts
let observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    mutation.addedNodes.forEach(function (node) {
      if (node.tagName === "SCRIPT") {
        // waiting for the NEW script to load
        node.onload = function () {
          // actual ovrrd
          overrideProcessMsg();
        };
      }
    });
  });
});

// OBSERVER
observer.observe(document.head, { childList: true });

// OVRD processMsg,
window.onload = overrideProcessMsg();
