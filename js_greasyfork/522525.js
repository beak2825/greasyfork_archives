// ==UserScript==
// @name         Discourse++
// @namespace    http://tampermonkey.net/
// @version      7.2.2
// @description  discourse king
// @author       CheetahSuperSpeed
// @match        https://x-camp.discourse.group/*
// @grant        none
// @license      kkylefree
// @downloadURL https://update.greasyfork.org/scripts/522525/Discourse%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/522525/Discourse%2B%2B.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const bgc = document.querySelector("div.contents").backgroundColor;
  const codeNewSection = `<div data-section-name="discoursepp" class="sidebar-section sidebar-section-wrapper sidebar-section--expanded">
<div class="sidebar-section-header-wrapper sidebar-row">


    <button class="btn no-text sidebar-section-header sidebar-section-header-collapsable btn-transparent" aria-controls="sidebar-section-content-chat-dms" aria-expanded="true" title="Toggle section" type="button">
<!----><!---->

                <span class="sidebar-section-header-caret">
                  <img src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/92_Discourse_logo_logos-512.png" style="width:20px;height:20px;">
                </span>

              <span class="sidebar-section-header-text">
                Discourse++
              </span>

<!---->

    </button>
<button title="Create a personal chat" class="sidebar-section-header-button" type="button">
                  <svg class="fa d-icon d-icon-user-group svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#user-group"></use></svg>
                </button>
</div>
    <ul id="sidebar-section-content-discoursepp" class="sidebar-section-content">
        <li class="sidebar-section-link-wrapper">
            <button class="sidebar-section-link sidebar-row dpp-button" title="Create a new reply" type="button">
            <span class="sidebar-section-link-prefix image">
            <svg class="fa d-icon d-icon-reply svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#reply"></use></svg></span>
                <span class="sidebar-section-link-content-text"> New Reply </span>
            </button>
        </li>
        <li class="sidebar-section-link-wrapper">
            <button class="sidebar-section-link sidebar-row dpp-button" title="Create a new topic" type="button">
                        <span class="sidebar-section-link-prefix image">
            <svg class="fa d-icon d-icon-plus svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#plus"></use></svg></span>
                <span class="sidebar-section-link-content-text"> New Topic </span>
            </button>
        </li>
        <li class="sidebar-section-link-wrapper">
            <button class="sidebar-section-link sidebar-row dpp-button" title="Find a topic" type="button">
                                    <span class="sidebar-section-link-prefix image">
            <svg class="fa d-icon d-icon-magnifying-glass svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#magnifying-glass"></use></svg></span>
                <span class="sidebar-section-link-content-text"> Find Topic </span>
            </button>
        </li>
        <li class="sidebar-section-link-wrapper">
            <button class="sidebar-section-link sidebar-row dpp-button" title="Automatic" type="button">
                                    <span class="sidebar-section-link-prefix image">
            <svg class="fa d-icon d-icon-robot svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#robot"></use></svg></span>
                <span class="sidebar-section-link-content-text"> Automatic </span>
            </button>
        </li>
        <li class="sidebar-section-link-wrapper">
            <button class="sidebar-section-link sidebar-row dpp-button" title="Home" type="button">
                                    <span class="sidebar-section-link-prefix image">
            <svg class="fa d-icon d-icon-house svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#house"></use></svg></span>
                <span class="sidebar-section-link-content-text"> Home </span>
            </button>
        </li>
    </ul>
</div>

<style>
.dpp-button{
    background-color:var(--secondary);
    border:none;
}
</style>
`

    var proofed = document.createElement("div");
    proofed.innerHTML = codeNewSection;
    document.querySelector("div.sidebar-sections").appendChild(proofed)
  function createButton(index) {
    var button = document.querySelectorAll("button.dpp-button")[index];
    return button;
  }

  var replyButton = createButton(0);
  var topicButton = createButton(1);
  var findButton = createButton(2);
  var homeButton = createButton(4);
  var autoButton = createButton(3);
  homeButton.onclick=function(){window.location.href="https://x-camp.discourse.group"}

  function generateContent() {
    var randomId = Math.floor(Math.random() * 1000000000) + 1;
    return `
Download [Discourse++](https://greasyfork.org/en/scripts/522525-discourse) for all your spamming needs, and check out the details to beat me at my own game.
[details="Details"]
I am the final boss. I am the insane. I am the unimaginable. I am Kyle.

# Defeat the Final Boss… At his own game. Kyleer.
Kyleer is a strategy game where you have to defeat the other player’s Inner Kyle to win. Rules are not revealed. DM Kyle to play. The first victor against Kyle will receive the Crown of Glory.

# DM NOW TO PLAY (chat aka dm)
[/details]

[spoiler]
[details]
[spoiler]
[details]
[spoiler]
[details]
[spoiler]
[details]
[spoiler]
[details]
@EthanChang @Ivan_Zong @XC241518 @e @Tom @XC242075 @XC241261 @XC241070 @XC242071 @hola_soy_nuevo
[/details]
[/spoiler]
[/details]
[/spoiler]
[/details]
[/spoiler]
[/details]
[/spoiler]
[/details]
[/spoiler]
<woos` + randomId + '>';
  }

  replyButton.addEventListener("click", function () {
    var initialReplyButton = document.querySelector(".btn.btn-icon-text.btn-primary.create[title='begin composing a reply to this topic']");
    if (initialReplyButton) {
        initialReplyButton.scrollIntoView();
      initialReplyButton.click();
    } else {
      console.error("Initial reply button not found.");
    }
    setTimeout(function () {
      var textarea = document.querySelector("textarea[aria-label='Type here. Use Markdown, BBCode, or HTML to format. Drag or paste images.']");
      if (textarea) {
        var content = generateContent();
        textarea.value = content;
        textarea.dispatchEvent(new Event("input", { 'bubbles': true }));
        console.log("Typed into textarea:", content);
        var submitButton = document.querySelector(".btn.btn-icon-text.btn-primary.create[title='Or press Ctrl+Enter']");
        if (submitButton) {
          setTimeout(function () {
            submitButton.click();
          }, 3000);
        } else {
          console.error("Final reply button not found.");
        }
      } else {
        console.error("Textarea not found.");
      }
    }, 1000);
  });

  topicButton.addEventListener("click", function () {
    var createTopicButton = document.querySelector(".btn.btn-icon-text.btn-default#create-topic");
    if (createTopicButton) {
      createTopicButton.click();
    } else {
      console.error("Create topic button not found.");
    }
    setTimeout(function () {
      var titleInput = document.querySelector("input[aria-label='Type title, or paste a link here']");
      if (titleInput) {
        var randomTitle = "Random Title " + Math.random().toString(36).substring(7);
        titleInput.value = randomTitle;
        titleInput.dispatchEvent(new Event('input', { 'bubbles': true }));
        console.log("Typed into title input:", randomTitle);
      } else {
        console.error("Title input not found.");
      }
      var contentTextarea = document.querySelector("textarea[aria-label='Type here. Use Markdown, BBCode, or HTML to format. Drag or paste images.']");
      if (contentTextarea) {
        var content = generateContent();
        contentTextarea.value = content;
        contentTextarea.dispatchEvent(new Event("input", { 'bubbles': true }));
        console.log("Typed into textarea:", content);
        var categoryDropdown = document.getElementsByClassName('select-kit-header-wrapper')[4];
        if (categoryDropdown) {
          categoryDropdown.click();
          setTimeout(function () {
            var firstCategory = document.querySelector(".category-row.select-kit-row[data-index='1']");
            if (firstCategory) {
              firstCategory.click();
              console.log("Category selected.");
              var submitButton = document.querySelector(".btn.btn-icon-text.btn-primary.create[title='Or press Ctrl+Enter']");
              if (submitButton) {
                setTimeout(function () {
                  submitButton.click();
                }, 1000);
              } else {
                console.error("Final create topic button not found.");
              }
            } else {
              console.error("Category row not found.");
            }
          }, 1000);
        } else {
          console.error("Details dropdown not found.");
        }
      } else {
        console.error("Textarea not found.");
      }
    }, 1000);
  });

  findButton.addEventListener("click",function(){
      var collection = document.querySelectorAll("img.avatar.latest");
      var post = document.querySelectorAll("td.main-link.clearfix.topic-list-data");
      var currIndex = 0;
      Array.from(collection).forEach(item => {
          if (item.title.includes("kkyle")){}else{
              post[currIndex].click();
          }
          currIndex++;
      });
  });


autoButton.addEventListener("click", function() {
    if(window.location.href.startsWith("https://x-camp.discourse.group/t")){ // Reply logic
        //click 1
        replyButton.click()
        // click 2
        setTimeout(function(){
            replyButton.click();
            //click 3
            setTimeout(function(){
                replyButton.click();
            },5000)
        },5000)
    } else if(window.location.href.startsWith("https://x-camp.discourse.group")){
        findButton.click()
    }
});

})();
