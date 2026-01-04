// ==UserScript==
// @name         CAI Swipe Navigator
// @namespace    Massgen swipenav
// @version      0.7
// @description  Displays swipes separately and navigates to them on the main form with one click
// @author       GPT ft. anon
// @match        https://old.character.ai/comms*
// @match        https://old.character.ai/chat2*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492378/CAI%20Swipe%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/492378/CAI%20Swipe%20Navigator.meta.js
// ==/UserScript==

//Change if you want the old style
const oldStyle = false;

//Change if you want the swipe number shown on the actual swipes
const showCircle = false;

// If enabled, the menu will be opened immediately when the page is loaded, otherwise only after click
const show_on_start = false;

// If enabled, Swipenav will be on by default, otherwise HYW will be (if present)
const swipenav_default = false;

//Hide the premium button
const adblock = false;

var style = document.createElement('style');
style.innerHTML = '#message-display-swipenav > div > div:nth-child(2) > div:nth-child(2) {display: none;}';
if (adblock) {
  style.innerHTML += '#root > div.apppage > div > div.container-fluid.chattop > div.col-xs-12.col-md-8.offset-md-2 > div.row.pb-1.pt-2.justify-content-between.chatheaderbg-normal.align-items-center > div.col-3.col-md-3 > div > div > div.shine-btn.dark {display:none;}';
}
document.head.appendChild(style);

// Create display box for showing the message text
var displayBox = document.createElement('div');
displayBox.setAttribute('id', 'message-display-swipenav');
displayBox.setAttribute('class', 'messages-list-swipenav');
displayBox.setAttribute('style', 'display: none;');
document.body.appendChild(displayBox);

var count = 0;
var prevClass = '';

function clearDisplayAndCount() {
  count = 0;
  document.getElementById('message-display-swipenav').innerHTML = '';
}

// Function to retrieve and display the associated message
function getMessage(event) {
  var number = parseInt(event.target.getAttribute('data-slide-number'));
  var messageDiv = document.querySelectorAll('div[class="msg char-msg"]')[number - 1].cloneNode(true); // clone the message element
  var annotationContainer = messageDiv.querySelector('.annotation-buttons-container'); // find the annotation buttons container
  if(annotationContainer !== null) {
    annotationContainer.remove(); // remove the annotation buttons container
  }
  var message = messageDiv.innerHTML;

  // Check if message is already in the message display box before adding it
  var messageExists = false;
  var messageDivs = document.querySelectorAll('.hywmsg.non-deleted');
  for (var i = 0; i < messageDivs.length; i++) {
    if (messageDivs[i].innerHTML.includes(message)) {
      messageExists = true;
      break;
    }
  }

  if (!messageExists) {
    var newMessage = document.createElement('div');
    newMessage.innerHTML = '<div class="slide-number-msg">Swipe ' + (number) + ': </div>' + message;
    newMessage.setAttribute('class', 'hywmsg non-deleted');
    document.getElementById('message-display').appendChild(newMessage);
  }
}
// Function to check for new messages and add them to the display box
function checkNewMessages() {
  var messages = document.querySelectorAll('.swiper-slide div[class="msg char-msg"]');
  for (var i = 0; i < messages.length; i++) {
    if (!messages[i].hasAttribute('data-isnew')) {
      var messageContent = messages[i].innerHTML;
      // Exclude messages with typing-dot typing-dot-light-bg class
      if (!messageContent.includes("typing-dot typing-dot-light-bg")) {
        messages[i].setAttribute('data-isnew', 'true');
        var message = messageContent.trim();
        var messageNumber = i + 1;
        var currentClass = messages[i].parentNode.parentNode.parentNode.parentNode.getAttribute('class');
        if (prevClass !== '' && prevClass !== currentClass) {
          count = 0;
          document.getElementById('message-display-swipenav').innerHTML = '';
        }
        prevClass = currentClass;
        count++;

        var existingMessage = document.querySelector('.hywmsg.non-deleted-swipenav[data-slide-number="' + messageNumber + '"]');
        if (existingMessage) {
          existingMessage.remove();
        }
        var newMessage = document.createElement('div');
        newMessage.setAttribute('data-slide-number', messageNumber);
        if (oldStyle) {
          newMessage.innerHTML = '<div class="slide-number-msg-swipenav">Swipe ' + messageNumber + ':</div>' + message;
        } else {
          newMessage.innerHTML = '<div class="slide-number-msg-swipenav">                                   ' + messageNumber + '                                  </div>' + message;
        }
        newMessage.setAttribute('class', 'hywmsg non-deleted-swipenav');

        // Remove empty divs
        newMessage.innerHTML = newMessage.innerHTML.replace(/<div><\/div>/g, '');

        document.getElementById('message-display-swipenav').appendChild(newMessage);
        newMessage.addEventListener('click', getMessage);
      }
    }
  }

  // Remove the annotation buttons from newly added messages
  var newMessages = document.querySelectorAll('.hywmsg.non-deleted-swipenav');
  for (var i = 0; i < newMessages.length; i++) {
    var annotationButtons = newMessages[i].querySelectorAll('.annotation-buttons-container.col.mb-3');
    for (var j = 0; j < annotationButtons.length; j++) {
      annotationButtons[j].remove();
    }
  }




        // Function to navigate to the corresponding slide when slide-number-msg element is clicked
function navigateToSlide(event) {
  var slideNumber = parseInt(event.target.getAttribute('data-slide-number'));
  var activeSlideNumber = parseInt(document.querySelector('.swiper-slide.swiper-slide-active').getAttribute('data-slide-number'));
  var slideDifference = slideNumber - activeSlideNumber;
  if (slideDifference < 0) {
    for (var i = 0; i < Math.abs(slideDifference); i++) {
      document.querySelector('.swiper-button-prev').click();
    }
  } else if (slideDifference > 0) {
    for (var i = 0; i < slideDifference; i++) {
      document.querySelector('.swiper-button-next').click();
    }
  }
}

// Add slide navigation function to slide-number-msg elements
var slideNumberMsgs = document.querySelectorAll('.slide-number-msg-swipenav');
for (var i = 0; i < slideNumberMsgs.length; i++) {
  slideNumberMsgs[i].setAttribute('data-slide-number', i + 1);
  slideNumberMsgs[i].addEventListener('click', navigateToSlide);
}

// Add numbered navigation to swiper-slide elements
var swiperSlides = document.getElementsByClassName('swiper-slide');
for (var i = 0; i < swiperSlides.length; i++) {
  swiperSlides[i].setAttribute('data-slide-number', i + 1);

  // Check if slide already has a slide-number element before adding one
  if (!swiperSlides[i].querySelector('.slide-number-swipenav')) {
    var messageNumber = document.createElement('div');
    messageNumber.innerHTML = i + 1;
    messageNumber.setAttribute('class', 'slide-number-swipenav');
    messageNumber.setAttribute('data-slide-number', i + 1);
    messageNumber.onclick = function() {
      var slideNumber = this.getAttribute('data-slide-number');
      var activeSlideNumber = document.querySelector('.swiper-slide.swiper-slide-active').getAttribute('data-slide-number');
      var slideDifference = slideNumber - activeSlideNumber;
      if (slideDifference < 0) {
        for (var i = 0; i < Math.abs(slideDifference); i++) {
          document.querySelector('.swiper-button-prev').click();
        }
      } else if (slideDifference > 0) {
        for (var i = 0; i < slideDifference; i++) {
          document.querySelector('.swiper-button-next').click();
        }
      }
    };
    swiperSlides[i].appendChild(messageNumber);
  }
}

  // Add class to currently active swiper-slide element
  var activeSlide = document.querySelector('.swiper-slide.swiper-slide-active');
  activeSlide.classList.add('active-slide-swipenav');
}

// Select the target node
const targetNode = document.body;

// Options for the observer (which mutations to observe)
const config = { attributes: false, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
  for(const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      // Check if new element with class "msg-row msg-row-light-bg" is added
      const addedNodes = mutation.addedNodes;
      for(const addedNode of addedNodes) {
        if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode.classList.contains("msg-row") && addedNode.classList.contains("msg-row-light-bg")) {
          // Check if the new element becomes the second child of its parent
          const parent = addedNode.parentNode;
          const children = parent.children;
          if (children.length > 1 && children[1] === addedNode) {
            clearDisplayAndCount();
          }
        }
      }
    }
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

// Call the checkNewMessages function every second
setInterval(checkNewMessages, 1000);



// Style HTML
let styleHTML = document.createElement('style');
if (oldStyle) {
  styleHTML.innerHTML = `
html {
    height: 100%;
    overflow: hidden;
    width: 100%;
}
body {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    width: 100%;
}
.messages-list-swipenav {
   padding: 4px 4px 3px 4px;
   margin: 40px 4px 0 0;
   border: 3px solid gray;
   position: absolute;
   top: 0;
   right: 0;
   width: 20%;
   height: 80%;
   overflow-y: scroll;
   border-radius: 0 0 8px 8px;
   z-index: 100;
   resize: both;
   direction: rtl;
   min-width: 100px;
   min-height: 100px;
}
.display-btn-swipenav {
   cursor: pointer;
   user-select: none;
   border: 3px solid gray;
   padding: 4px;
   margin: 4px;
   width: 20%;
   position: absolute;
   top: 0;
   right: 0;
   background-color: lightsteelblue;
   color: black;
   font-weight: bold;
   text-align: center;
   z-index: 100;
}
.messages-list-swipenav div {
   margin-top: 5px;
   padding: 8px;
   background-color: lightpink;
   direction: ltr;
}
.hywmsg-swipenav {
   border-radius: 8px;
}
.hywmsg.non-deleted-swipenav {
   background-color: aquamarine;
}
.hywmsg.hidden-swipenav {
   display: none;
}
.screen-btn-swipenav {
   cursor: pointer;
   user-select: none;
   border: 3px solid gray;
   padding: 4px;
   margin: 4px;
   width: 20%;
   position: absolute;
   top: 0;
   right: 0;
   background-color: lightsteelblue;
   color: black;
   font-weight: bold;
   text-align: center;
   z-index: 100;
}
.swiper-slide {
  position: relative;
}
.slide-number-swipenav {
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: white;
  border-radius: 50%;
  height: 20px;
  width: 20px;
  text-align: center;
  line-height: 20px;
  font-weight: bold;
   ${!showCircle ? "display: none;" : ""}
}
.active-slide-swipenav .slide-number-swipenav {
  background-color: lightsteelblue;
  color: black;
}
.slide-number-msg-swipenav {
  display: inline-block;
  margin-right: 5px;
  font-weight: bold;
  cursor: pointer;
}
`;
} else {
  styleHTML.innerHTML = `
html {
    height: 100%;
    overflow: hidden;
    width: 100%;
}
body {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    width: 100%;
    font-family: Arial, Helvetica, sans-serif;
}
.messages-list-swipenav {
   padding: 4px;
   margin: 40px 4px 0 0;
   border: 1px solid #D9D9D9;
   position: absolute;
   top: 0;
   right: 0;
   width: 20%;
   height: 80%;
   overflow-y: scroll;
   border-radius: 8px;
   z-index: 100;
   resize: both;
   direction: rtl;
   min-width: 100px;
   min-height: 100px;
   background-color: #FFFFFF;
}
.display-btn-swipenav {
   cursor: pointer;
   user-select: none;
   border: 1px solid #D9D9D9;
   padding: 4px;
   margin: 4px;
   width: 20%;
   position: absolute;
   top: 0;
   right: 0;
   background-color: #FFFFFF;
   color: #5A5A5A;
   font-weight: bold;
   text-align: center;
   z-index: 100;
   border-radius: 4px;
}
.messages-list-swipenav div {
   margin-top: 5px;
   padding: 8px;
   background-color: #F2F2F2;
   direction: ltr;
   border-radius: 4px;
}
.hywmsg-swipenav {
   border-radius: 4px;
}
.hywmsg.non-deleted-swipenav {
   background-color: silver;
}
.hywmsg.hidden-swipenav {
   display: none;
}
.screen-btn-swipenav {
   cursor: pointer;
   user-select: none;
   border: 1px solid #D9D9D9;
   padding: 4px;
   margin: 4px;
   width: 20%;
   position: absolute;
   top: 0;
   right: 0;
   background-color: #FFFFFF;
   color: #5A5A5A;
   font-weight: bold;
   text-align: center;
   z-index: 100;
   border-radius: 4px;
}
.swiper-slide {
  position: relative;
}
.slide-number-swipenav {
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: white;
  border-radius: 50%;
  height: 20px;
  width: 20px;
  text-align: center;
  line-height: 20px;
  font-weight: bold;
  border: 1px solid #D9D9D9;
   ${!showCircle ? "display: none;" : ""}
}
.active-slide-swipenav .slide-number-swipenav {
  background-color: #5A5A5A;
  color: #FFFFFF;
}
.slide-number-msg-swipenav {
  background-color: silver !important;
  display: inline;
  margin-right: 5px;
  font-weight: bold;
  cursor: pointer;
  color: black;
}
`;
}
document.body.appendChild(styleHTML);



// Button HTML
let buttonHTML = document.createElement('div');
buttonHTML.innerHTML = "Swipenav";
buttonHTML.onclick = function () {
    let msgList = document.getElementsByClassName('messages-list-swipenav')[0]
    if (msgList.style.display === "none") {
        msgList.style.display = "block";
    } else {
        msgList.style.display = "none";
    }
};
buttonHTML.classList.add("display-btn-swipenav");
document.body.appendChild(buttonHTML);


window.addEventListener('load', function() {
    if (!isFirefox()) {
        init();
    }
});

function isFirefox() {
    return navigator.userAgent.includes('Firefox');
}

if (isFirefox()) {
    init();
}

function init() {
    const displayBtn = {
        default: document.querySelector('.display-btn'),
        massgen: document.querySelector('.display-btn-swipenav'),
    };
    const messagesList = {
        default: document.querySelector('.messages-list'),
        massgen: document.querySelector('.messages-list-swipenav'),
    };
    const hideBtn = document.createElement('div');
    let isHidden = false;
    let currentMode = 'default';


    function setMode(mode) {
        if (mode === currentMode) {
            return;
        }
        if (mode === 'default') {
            if (displayBtn.default) displayBtn.default.style.display = 'block';
            if (messagesList.default) messagesList.default.style.display = 'block';
            if (displayBtn.massgen) displayBtn.massgen.style.display = 'none';
            if (messagesList.massgen) messagesList.massgen.style.display = 'none';
            hideBtn.innerHTML = 'Swipenav';
        } else if (mode === 'massgen') {
            if (displayBtn.default) displayBtn.default.style.display = 'none';
            if (messagesList.default) messagesList.default.style.display = 'none';
            if (displayBtn.massgen) displayBtn.massgen.style.display = 'block';
            if (messagesList.massgen) messagesList.massgen.style.display = 'block';
            hideBtn.innerHTML = 'HYW';
        }
        currentMode = mode;


    }

    hideBtn.innerHTML = 'Swipenav';
    hideBtn.style.position = 'absolute';
    hideBtn.style.top = '0px';
    hideBtn.style.right = '386px';
    hideBtn.style.cursor = 'pointer';
    hideBtn.style.userSelect = 'none';
    hideBtn.style.border = '3px solid grey';
    hideBtn.style.padding = '4px';
    hideBtn.style.margin = '4px';
    hideBtn.style.backgroundColor = 'lightsteelblue';
    hideBtn.style.color = 'white';
    hideBtn.style.fontWeight = 'bold';
    hideBtn.style.textAlign = 'center';
    hideBtn.style.zIndex = '100';
    hideBtn.id = 'hideBtn';
    hideBtn.classList.add("hide-btn-swipenav");


    // Hide massgen mode elements on page load
    if (displayBtn.default && !swipenav_default) displayBtn.massgen.style.display = 'none';
    if (messagesList.default && !swipenav_default) messagesList.massgen.style.display = 'none';

    hideBtn.onclick = function () {
        if (isHidden) {
            setMode('default');
            hideBtn.style.backgroundColor = 'lightsteelblue';
            hideBtn.style.border = '3px solid grey';
            hideBtn.style.color = 'white';
            isHidden = false;
        } else {
            setMode('massgen');
            if (oldStyle) {
                hideBtn.style.backgroundColor = 'lightsteelblue';
                hideBtn.style.border = '3px solid grey';
                hideBtn.style.color = 'white';
            } else {
                hideBtn.style.backgroundColor = '#FFFFFF';
                hideBtn.style.border = '1px solid #D9D9D9';
                hideBtn.style.color = '#5A5A5A';
            }
            isHidden = true;
        }
    };

    hideBtn.style.display = 'block';
    document.body.appendChild(hideBtn);

        // Check for default mode elements
    if (!displayBtn.default || !messagesList.default) {
        setMode('massgen');
        hideBtn.style.display = 'none';
    }
    if (swipenav_default) {
  setMode('massgen');
  isHidden = true;
  hideBtn.style.backgroundColor = '#FFFFFF';
  hideBtn.style.border = '1px solid #D9D9D9';
  hideBtn.style.color = '#5A5A5A';
  hideBtn.innerHTML = 'HYW';
}
        if (!show_on_start) messagesList.massgen.style.display = 'none';
};
