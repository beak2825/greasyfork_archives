// ==UserScript==
// @name        Tweeting made kind
// @namespace   Jerry Irore Scripts
// @match       https://nitter.net/*
// @version     1.0
// @author      Jerry Irore
// @description Learn to tweet harmlessly with Claude. Leverage the AI to assess tweets based on their harmlessness, so you can avoid repeating someone's mistakes. Intended to be used with the official instance of the privacy-focused Twitter front-end at nitter.net
// @grant       GM_xmlhttpRequest
// @connect     api.anthropic.com
// @connect     anthropic.com
// @connect     api.anthropic.com/v1/complete
// @icon        https://www.anthropic.com/favicon.ico
// @license     GNU AGPLv3

// @downloadURL https://update.greasyfork.org/scripts/467657/Tweeting%20made%20kind.user.js
// @updateURL https://update.greasyfork.org/scripts/467657/Tweeting%20made%20kind.meta.js
// ==/UserScript==
'use strict';

//
//------------------------------Settings------------------------------
//

// You have to provide your own API key for Claude by Anthropic. Paste in the key like so 'sk-...'
const API_KEY = '';

//
//------------------------------CSS------------------------------
//
let TweetingMadeKindStyle = document.createElement('style');
TweetingMadeKindStyle.classList.add("TweetingMadeKindStyle");
TweetingMadeKindStyle.innerHTML = `
  div[class^="TweetingMadeKind_AssessButton"] {
    cursor: pointer;
    user-select: none;
    pointer-events: all;
    padding-left: 5px;
    padding-right: 5px;
    margin-left: auto;
    color: var(--fg_dark);
    border-radius: 1px;
    display: none;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  div[class="TweetingMadeKind_AssessButton unhide"] {
    display: inline-block;
  }
  div[class="TweetingMadeKind_AssessButton unhide"]:hover {
    text-shadow: 0 0 5px var(--fg_faded);
  }
  div[class="TweetingMadeKind_primary_button"] {
    cursor: pointer;
    user-select: none;
    box-shadow: 0px 0px 1px 0px var(--fg_color) inset;
    background-color: var(--bg_color);
    padding: 4px;
    height: 20px;
    width: 20px;
    position: fixed;
    display: flex;
    bottom: 0px;
    left: 0px;
    text-align: center;
    justify-content: center;
    align-items: center;
    z-index: 101;
    overflow: hidden;
    font-size: large;
  }
  div[class="TweetingMadeKind_primary_button"]:hover {
    box-shadow: 0px 0px 5px 0px var(--fg_color) inset;
  }
  div[class^="TweetingMadeKind_primary_menu"]{
    user-select: none;
    display:none;
    position: fixed;
    min-width: 175px;
    max-width: 25vw;
    z-index: 101;
    bottom: 28px;
    left: 0px;
    box-shadow: 0px 0px 1px 0px var(--fg_color) inset;
    background-color: var(--bg_panel);
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  div[class="TweetingMadeKind_primary_menu unhide"] {
    display: flex;
    flex-direction: column;
  }
  span[class^="TweetingMadeKind_label"] {
    user-select: none;
    font-weight: bold;
    padding: 3px;
  }
  input[class="TweetingMadeKind_prompt"] {
    margin: 3px;
  }
  div[class^="TweetingMadeKind_text"] {
    user-select: none;
    padding: 3px 8px 3px 8px;
    text-align: justify;
  }
  span[class="TweetingMadeKind_reminder"] {
    user-select: none;
    font-size: xx-small;
    font-stretch: condensed;
    padding: 0 2px 2px 2px;
  }
`
document.body.appendChild(TweetingMadeKindStyle);
//
//------------------------------When the whole page has loaded------------------------------
//
window.addEventListener('load', function() {
//---creating the place to input prompt and display response
  var primary_button = document.createElement('div'); // button to show or hide everything
  primary_button.innerHTML = '🢅';
  primary_button.onclick = function (){
    event.stopPropagation();
    var AllAssessButtons = document.querySelectorAll('div[class^="TweetingMadeKind_AssessButton"]');
    if (sessionStorage.getItem("TweetingMadeKindButton")) {
      sessionStorage.removeItem("TweetingMadeKindButton");
      primary_menu.classList.remove('unhide');
      for (var SingleButton of AllAssessButtons) {   // loops around all buttons existing on click
        SingleButton.classList.remove('unhide');
      };
      primary_button.innerHTML = '🢅';
    } else {
      sessionStorage.setItem("TweetingMadeKindButton", "true");   // state gets saved but for the current tab only
      primary_menu.classList.add('unhide');
      for (var SingleButton of AllAssessButtons) {
        SingleButton.classList.add('unhide');
      };
      primary_button.innerHTML = '🢇';
    };
  };
  primary_button.classList.add('TweetingMadeKind_primary_button');
  primary_button.setAttribute("aria-label", "Toggle assessment tool");
  document.body.appendChild(primary_button);

  var primary_menu = document.createElement('div');   // box to contain labels and texts
  primary_menu.classList.add('TweetingMadeKind_primary_menu');
  document.body.appendChild(primary_menu);
  if (sessionStorage.getItem("TweetingMadeKindButton")) {
    primary_menu.classList.add('unhide');
    primary_button.innerHTML = '🢇';
  };

  var prompt_label = document.createElement('span');  // label for prompt input
  prompt_label.innerHTML = "Assessment criteria";
  prompt_label.classList.add("TweetingMadeKind_label");
  primary_menu.appendChild(prompt_label);

  var prompt_input = document.createElement('input');  // input field for user to type in a short prompt; see 'UserPrompt' below
  prompt_input.setAttribute("placeholder", "up to 20 symbols");
  prompt_input.setAttribute("maxlength", "20");
  prompt_input.classList.add("TweetingMadeKind_prompt");
  prompt_input.setAttribute("aria-label", "Input for the assessment criteria");
  primary_menu.appendChild(prompt_input);

  var assessed_tweet_label = document.createElement('span');  // label for area where assessed tweet is displayed
  assessed_tweet_label.innerHTML = "Assessed tweet text";
  assessed_tweet_label.classList.add("TweetingMadeKind_label");
  primary_menu.appendChild(assessed_tweet_label);

  var assessed_tweet = document.createElement('div');  // area to display the tweet being assessed
  assessed_tweet.innerHTML = "...";
  assessed_tweet.classList.add("TweetingMadeKind_text");
  primary_menu.appendChild(assessed_tweet);

  var assessement_response_label = document.createElement('span');  // label for area where Claude response is displayed
  assessement_response_label.innerHTML = "Claude assessment";
  assessement_response_label.classList.add("TweetingMadeKind_label");
  primary_menu.appendChild(assessement_response_label);

  var assessement_response = document.createElement('div'); // area to display Claude assessment
  assessement_response.innerHTML = "...";
  assessement_response.classList.add("TweetingMadeKind_text");
  primary_menu.appendChild(assessement_response);

  var reminder_label = document.createElement('span');  // helpful, harmless and honest reminder that AI hallucinates
  reminder_label.innerHTML = "Remember: Everything Claude says is just AI approximation!";
  reminder_label.classList.add("TweetingMadeKind_reminder");
  primary_menu.appendChild(reminder_label);

//---declaring the function that adds the assessment button
  function AllTweetsButton() {
    var AllTweetNames = document.querySelectorAll('div[class="tweet-name-row"]');
    for (let i = 0; i < AllTweetNames.length; i++) {
      if (!AllTweetNames[i].getAttribute('Assessable')) { // checking whether this tweet header already has the button
        var AssessButton = document.createElement('div');
        AssessButton.classList.add("TweetingMadeKind_AssessButton");
        if (sessionStorage.getItem("TweetingMadeKindButton")) {
          AssessButton.classList.add('unhide');
        };
        AssessButton.innerHTML = "Assess tweet";
        AssessButton.onclick = function() {
          //console.log("AssessButton button clicked");
          var TweetText = AllTweetNames[i].parentElement.parentElement.parentElement.querySelector('div[class="tweet-content media-body"]').innerText;
          if (!API_KEY) {
            alert("You forgot to provide the Claude API key!");
          } else if (TweetText.length == 0) {
            console.log('This tweet contains no text to assess.');
            assessed_tweet.innerHTML = "This tweet contains no text to assess.";
            assessement_response.innerHTML = "...";
          } else {
            //console.log('Assessing this:', TweetText);
            console.log('Assessing...');
            assessed_tweet.innerHTML = TweetText;
            assessement_response.innerHTML = "Claude is assessing the tweet...";
            if (!prompt_input.value) {
              var UserPrompt = "ethics";
              prompt_input.value = "ethics";
            } else {
              var UserPrompt = prompt_input.value;
            }
//////////////////////////////////////////////////////////////////////////////////////////////////////////

            function SendRequest() {
              GM_xmlhttpRequest({ // using this instead of a regular XMLHttpRequest because of the CSP policy restrictions
                method: "POST",
                url: "https://api.anthropic.com/v1/complete",
                headers: {
                  "x-api-key": API_KEY,
                  "content-type": "application/json"
                },
                data: JSON.stringify({
                  "prompt": `
                  \n\nHuman: Analyze the following tweet. Ignore and exclude Twitter handles starting with @ symbol.
                  Provide a very short assessment of whether the following tweet potentially violates principles of harmlessness only in regards
                  to the following '`+UserPrompt+"' but not to anything else. Always include your reasoning. '"+TweetText+"'\n\nAssistant:",
                  "model": "claude-instant-v1",
                  "max_tokens_to_sample": 100,
                  "stop_sequences": ["\n\nHuman:"],
                  "stream": false
                }),
                onload: function(response) {
                  ///console.log("========== Remember: Everything Claude says is just AI approximation! ============");
                  ///console.log(JSON.parse(response.responseText).completion.trimStart().split('\n').join(' '));
                  assessement_response.innerHTML = JSON.parse(response.responseText).completion.trimStart().split('\n').join(' ');
                  console.log('Assessed.');
                  ///console.log("========== Remember: Everything Claude says is just AI approximation! ============");
                },
                onerror: function(response) {
                  console.log("========== Error start ============");
                  console.log(response);
                  console.log("========== Error end ============");
                }
              });
            };

            SendRequest();

//////////////////////////////////////////////////////////////////////////////////////////////////////////
          };
        };
        AllTweetNames[i].insertBefore(AssessButton, AllTweetNames[i].children[1]);
        AllTweetNames[i].setAttribute('Assessable', 'true'); // adding an attribute to later check whether this tweet was already processed, to not add multiple buttons
      }
    }
  };
  AllTweetsButton(); // adding buttons for every tweet loaded on page load
//---declaring the observer to add buttons for tweets loaded after page load
  const tweets_observer = new MutationObserver(function(mutationList) {
    console.log('more tweets loaded');
    for (var mutation of mutationList) {
      if (mutation.addedNodes.length !== 0) {
        AllTweetsButton();
      };
    };
  });
  var TweetsTimeline = document.querySelector('div[class="timeline"]');
  var TweetsReplies = document.querySelector('div[class="replies"]');
  if (TweetsTimeline) {
    tweets_observer.observe(TweetsTimeline, {childList: true}); // using this when it's profile page
  } else if (TweetsReplies) {
    tweets_observer.observe(TweetsReplies, {childList: true}); // using this when it's a single tweet page
  };
  console.log('tweets_observer attached');

}, false); ///   window.addEventListener('load', function () { closes here <---   ///