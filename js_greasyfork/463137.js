// ==UserScript==
// @name New Userscript
// @namespace http://tampermonkey.net/
// @version 1.9
// @description for omegle something or something lol
// @author You
// @match https://www.omegle.com/
// @icon data:image/gif;base64,R0lGODlhAQABAAAAACH5     BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/463137/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/463137/New%20Userscript.meta.js
// ==/UserScript==

// Your code here...
let skipMessage = [];
let autoMessage = [];
let firstSkip = 0;
let matchedUp = false;
let replyMessage1 = false;

if (localStorage.getItem('autoMessage')) {
  autoMessage = localStorage.getItem('autoMessage').split(',');
}

if (localStorage.getItem('messageSkip')) {
  skipMessage = localStorage.getItem('messageSkip').split(',');
}

let getReplyMessage = getMessageMatch2;
let replySendMessage = createReplyMessage2;

const body = document.getElementsByTagName('BODY')[0];
let widthOfbody = document.body.clientWidth;
let myStyle = document.createElement('style');
let myCss = `
  .dis {
    display: flex !important;
  }
  .logtopicsettings > label,
  body
    > div.chatbox3
    > div
    > div
    > div.logwrapper
    > div.logbox
    > div
    > div:nth-child(4)
    > div
    > div
    > div:nth-child(2)
    > label {
    color: white;
  }
  .reply-wrappper {
    background: #00000075;
    color: #fff;
    display: none;
    align-items: stretch;
    position: relative;
    top: 100%;
    z-index: 0;
    animation-duration: 0.3s;
    transition: 0.3s;
  }
  .replyUp {
    display: flex;
    top: 0;
  }
  .nothing {
    color: red;
  }
  .firstColumn {
    flex: 0 0 15%;
    max-width: 100px;
    display: grid;
    place-items: center;
  }
  .secondColumn {
    flex-grow: 2;
    padding: 5px;
  }
  .item2 {
    padding-top: 5px;
    padding-bottom: 5px;
    font-size: 1em;
  }
  .message {
    overflow-wrap: anywhere;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .replyIcon {
    width: 30px;
    object-fit: contain;
  }
  .thirdColumn {
    margin-right: 17px;
    font-size: 1.5em;
    color: red;
    font-weight: 700;
  }
  .controltable {
    width: 100%;
  }
  .disconnectbtnwrapper {
    background-image: none;
  }
  body {
    background: #292929 !important;
  }
  .strangermsggroup .msggroup-msg:first-child {
    background-color: #0e4927 !important;
    background-image: none !important;
    border-radius: 10px !important;
  }
  .strangermsggroup .msggroup-msg {
    border-color: transparent !important;
  }
  .statuslog {
    color: #fff !important;
  }
  .msggroup-msg {

    background: #0e4927 !important;
    color: #fff !important;
    box-shadow: rgb(0 0 0 / 67%) 0 4px 12px !important;
    border-radius: 10px !important;
    margin-top: 7px !important;
    padding: 8px 10px 8px 10px !important;
    border: 0 !important;
    overflow-wrap: anywhere !important;
  }
  .youmsggroup .msggroup-msg {
    background: rgb(22 26 140) !important;
    color: #000;

  }
  .youmsggroup  > .msggroup-msgs >div{
    width: fit-content !important;
    clear:both !important;
    float:right !important;
  }

  .youmsggroup  > .msggroup-msgs >div{
    width: fit-content !important;
    clear:both !important;
    float:right !important;
  }
.strangermsggroup > .msggroup-msgs >div{
  width: fit-content !important;
  clear:both !important;
  float:left !important;
}

  .youmsggroup > div > div > div{

  }
  .youmsggroup .msggroup-msg:first-child {
    background-image: none !important;
    background: rgb(22 26 140) !important;
    border: 0 !important;
  }
  .chatmsgcell {
    background: #2e2e2e !important;
  }
  .chatmsg {
    color: #fff;
  }
  .controltable {
    border: 3px solid !important;
    position: relative;
    z-index: 1;
  }
  .chatmsgwrapper {
    border: 0 !important;
    background-image: none !important;
    background: #000 !important;
  }
  .disconnectbtnwrapper {
    margin: 0;
    background-color: none !important;
    border: none !important;
    background-image: none !important;
    color: red !important;
  }
  .disconnectbtnwrapper.newbtn {
    background: grey !important;
  }
  #logo {
    background: #292929 !important;
    -webkit-box-shadow: none !important;
  }
  .body
    > div.chatbox3
    > div
    > div
    > div.logwrapper
    > div.logbox
    > div
    > div:nth-child(10)
    > div
    > div
    > div:nth-child(2) {
    color: #fff;
  }
  body
    > div.chatbox3
    > div
    > div
    > div.logwrapper
    > div.logbox
    > div
    > div:nth-child(6)
    > div
    > label {
    color: #fff;
  }
  `;
myStyle.innerHTML = myCss;
body.append(myStyle);

body.addEventListener('keydown', function (e) {
  if (document.getElementsByClassName('disconnectbtn').length == 0) return;

  if (e.keyCode == 13) {
    if (
      document.getElementsByClassName('disconnectbtn')[0].textContent == 'New'
    )
      document.getElementsByClassName('disconnectbtn')[0].click();
  }
});

// for replying
document.body.addEventListener('click', (e) => {
  const target = e.target;

  if (
    !(
      (target.tagName == 'DIV' && target.className == 'msggroup-msg') ||
      (target.tagName == 'SPAN' && target.className == 'hasbeenread')
    )
  )
    return;
  if (body.className == '') return;
  document.getElementsByClassName('chatmsgwrapper')[0].scrollIntoView();
  let replyWrapper =
    document.getElementsByClassName('firstColumn')[0].parentNode;
  replyWrapper.setAttribute('class', 'reply-wrappper dis');
  setTimeout(() => {
    replyWrapper.setAttribute('class', 'reply-wrappper replyUp');
  }, 100);
  assignReplyMessage(target);
});
function getMessageMatch1(replyMes) {
  let messageIndex = 0;
  if (
    replyMes.startsWith('✉️Replied to yourself✉️') ||
    replyMes.startsWith('✉️Replied to them✉️')
  )
    messageIndex = replyMes.lastIndexOf('------------➔') + 13;

  return messageIndex;
}
function getMessageMatch2(replyMes) {
  let messageIndex = 0;
  if (
    replyMes.match(/".*": /i) &&
    replyMes.startsWith(replyMes.match(/".*": /i)[0])
  )
    messageIndex = replyMes.indexOf('": ') + 3;

  return messageIndex;
}

function assignReplyMessage(target) {
  let targetParent;
  let fromWho;
  target.className == 'hasbeenread'
    ? (targetParent = target.parentNode.parentNode.parentNode)
    : (targetParent = target.parentNode.parentNode);
  targetParent.className != 'msggroup strangermsggroup'
    ? (fromWho = 'Replying to you')
    : (fromWho = 'Replying to them');

  console.log(targetParent);
  const Replymessage = document.getElementById('replyMessage');
  let replyMes = target.textContent;
  let messageIndex = 0;

  messageIndex = getReplyMessage(replyMes);

  Replymessage.innerText = replyMes.substring(messageIndex);
  const form = document.getElementsByClassName('chatmsg')[0].parentNode;
  document.getElementsByClassName('Nothing')[0].innerText = fromWho;
  form.childNodes[3].setAttribute('hidden', true);
  let replyinput = form.childNodes[1];
  replyinput.removeAttribute('hidden');
  replyinput.value = '';
  replyinput.focus();
}

var callback = () => {
  console.log(document.getElementById('intro'));
  if (document.getElementById('intro') != null) return;

  const logbox = document.getElementsByClassName('logbox')[0];
  logObserver = new MutationObserver(callback2);
  logObserver.observe(logbox, {
    childList: true,
    subtree: true,
  });
  const controlwrapper = document.getElementsByClassName('controlwrapper')[0];
  console.log('enter');
  matchedUp = false;
  firstSkip = 0;
  disableAll();
  resetTurns();
  const form = document.getElementsByClassName('chatmsg')[0].parentNode;
  if (document.getElementById('replyWrapper')) return;
  controlwrapper.insertAdjacentHTML(
    'afterbegin',
    "<div class='reply-wrappper' id='replyWrapper'><div class='firstColumn'><img class='replyIcon' src='https://cdn-icons-png.flaticon.com/512/3388/3388657.png'></div><div class='secondColumn'><div class='item2'><span class='Nothing'>Replying To</span></div><div class='message' id='replyMessage'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, quos debitis. Non similique et ad placeat eaque optio enim magnam, officia perferendis. Atque repudiandae illo omnis molestias provident quia laboriosam!</div></div><div class='thirdColumn'><div id='RemoveButton'>X</div></div></div>"
  );

  let replyMessage = document.getElementById('replyMessage');

  let replyInput = document.createElement('input');

  replyInput.setAttribute('class', 'chatmsg');
  replyInput.setAttribute('type', 'text');
  replyInput.setAttribute('placeholder', 'Reply message...');
  replyInput.setAttribute('hidden', true);
  form.appendChild(replyInput);

  let input = document.createElement('input');
  input.setAttribute('hidden', true);
  input.setAttribute('type', 'submit');
  input.setAttribute('id', 'submit');
  form.appendChild(input);

  replyInput.addEventListener('keydown', (e) => {
    if (e.keyCode == 13) {
      form.childNodes[1].setAttribute('hidden', true);
      form.childNodes[3].removeAttribute('hidden');
      let replyText = replyMessage.innerText;
      if (replyText.length > 60) replyText = replyText.substring(0, 60) + '...';

      replySendMessage(replyInput.value, replyText);

      document
        .getElementById('replyWrapper')
        .setAttribute('class', 'reply-wrappper');
      replyInput.value = '';
    }
  });
  let personalInput = document.createElement('input');
  personalInput.setAttribute('class', 'chatmsg permsg');
  personalInput.setAttribute('type', 'text');
  personalInput.setAttribute('placeholder', 'Type your message!');

  form.appendChild(personalInput);

  personalInput.addEventListener('keydown', (e) => {
    if (e.keyCode == 13) {
      let myMessage = personalInput.value;
      personalInput.blur();
      personalInput.focus();

      //this code is for personal sending of my message
      if (myMessage.startsWith('/message add ')) {
        myMessage = myMessage.trim().replaceAll('/message add ', '');
        autoMessage.push(myMessage);
        autoMessage = [...new Set(autoMessage)];
        localStorage.setItem('autoMessage', autoMessage);
        printMessage({
          message: 'Message Added : %0A' + myMessage,
          stranger: false,
        });
        return (personalInput.value = '');
      }

      if (myMessage.startsWith('/message remove ')) {
        myMessage = myMessage.trim().replaceAll('/message remove ', '');
        let autoMes = autoMessage[myMessage - 1];
        autoMessage = autoMessage.filter((mess) => autoMes != mess);

        localStorage.setItem('autoMessage', autoMessage);
        printMessage({
          message: 'Message removed : %0A' + autoMes,
          stranger: false,
        });
        return (personalInput.value = '');
      }

      if (myMessage.startsWith('/message show')) {
        skipMessage.length == 0
          ? printMessage({ message: 'There are no messages', stranger: false })
          : autoMessage.forEach((autoMes, i) => {
              printMessage({
                message: `${i + 1}. ${autoMes} %0A`,
                stranger: false,
              });
            });
        return (personalInput.value = '');
      }

      if (myMessage.startsWith('/skip add ')) {
        myMessage = myMessage.trim().replaceAll('/skip add ', '');
        skipMessage.push(myMessage);
        skipMessage = [...new Set(skipMessage)];
        localStorage.setItem('messageSkip', skipMessage);
        printMessage({
          message: 'Skip Added : %0A' + myMessage,
          stranger: false,
        });
        return (personalInput.value = '');
      }

      if (myMessage.startsWith('/skip remove ')) {
        myMessage = myMessage.trim().replaceAll('/skip remove ', '');
        let skipMess = skipMessage[myMessage - 1];
        skipMessage = skipMessage.filter((mess) => skipMess != mess);

        localStorage.setItem('messageSkip', skipMessage);
        printMessage({
          message: 'Skip removed : %0A' + skipMess,
          stranger: false,
        });
        return (personalInput.value = '');
      }
      if (myMessage.startsWith('/skip show')) {
        skipMessage.length == 0
          ? printMessage({ message: 'There no skip added', stranger: false })
          : skipMessage.forEach((skipMes, i) => {
              printMessage({
                message: `${i + 1}. ${skipMes} %0A`,
                stranger: false,
              });
            });
        return (personalInput.value = '');
      }

      form.childNodes[0].value = myMessage;
      input.click();

      personalInput.value = '';
    }
  });

  document.getElementsByClassName('chatmsg')[0].setAttribute('hidden', true);
  document.getElementsByClassName('permsg')[0].setAttribute('disabled', true);

  const removeButton = document.getElementById('RemoveButton');
  const replyWrapper = document.getElementsByClassName('reply-wrappper')[0];

  let replyText = '';
  removeButton.addEventListener('click', () => {
    replyText = '';
    const form = document.getElementsByClassName('chatmsg')[0].parentNode;

    form.childNodes[1].setAttribute('hidden', true);
    form.childNodes[3].removeAttribute('hidden');
    replyWrapper.setAttribute('class', 'reply-wrappper');
  });
};
var observer = new MutationObserver(callback);
observer.observe(body, {
  childList: true,
});
var logObserver;

//for hiding the

var callback1 = () => {
  if (!(body.className == '' && document.getElementById('intro') == null))
    return;

  logObserver.disconnect();

  let replyWrapper =
    document.getElementsByClassName('firstColumn')[0].parentNode;

  document.getElementsByClassName('permsg')[0].setAttribute('hidden', true);
  document.getElementsByClassName('chatmsg ')[1].setAttribute('hidden', true);
  document.getElementsByClassName('chatmsg ')[0].removeAttribute('hidden');

  replyWrapper.setAttribute('class', 'reply-wrappper');
};
var incoObserver = new MutationObserver(callback1);
incoObserver.observe(document.getElementsByTagName('BODY')[0], {
  attributes: true,
});

var callback2 = () => {
  findLastMessage();
};

function findLastMessage() {
  // console.time('search');
  // console.timeEnd('search');
  let que = document.querySelectorAll(
    ".msggroup > div > div > span:not([class='hasbeenread']"
  );

  if (que.length == 0) return;

  que = que[que.length - 1];

  let spanClassName = que.className;
  //if class name is blank then it didnot process yet else process
  if (spanClassName != '' || spanClassName == 'hasbeenread') return;
  que.className = 'hasbeenread'; // include classname  if the message is already  read
  //
  let parentNode = que.parentNode.parentNode.parentNode;
  let message = que.textContent;
  message = message.toLowerCase();
  //msggroup strangermsggroup
  //msggroup youmsggroup

  if (
    firstSkip <= 3 &&
    parentNode.className != 'msggroup youmsggroup' &&
    skipMessage.some((skipmes) => {
      if (
        message.toLowerCase().includes(skipmes) &&
        skipmes.length == 1 &&
        message.length <= 4
      )
        return true;

      if (message.toLowerCase().startsWith(skipmes) && skipmes.length > 1)
        return true;
    })
  ) {
    console.log(message);
    for (let i = 0; i < 3; i++) {
      document.getElementsByClassName('disconnectbtn')[0].click();
    }
  }

  if (firstSkip <= 3) {
    firstSkip++;
  }

  if (message.startsWith('/turn switch')) {
    switchTurns();
    sendMessage('Switch turns ', playerTurn);
    return;
  }
  if (message.startsWith('/turn reset')) {
    resetTurns();
    sendMessage('turn reset ', playerTurn);
    return;
  }
  if (
    message == '/clear message' &&
    parentNode.className != 'msggroup strangermsggroup'
  ) {
    clearMessages();
    return;
  }
  if (
    message == '/change reply' &&
    parentNode.className != 'msggroup strangermsggroup'
  ) {
    changeReplyMethod();
    return;
  }
  checkerHandler(message, parentNode);
  chessHandler(message, parentNode);
  connectHandler(message, parentNode);
  battleShipHandler(message, parentNode);
  oldMaidHandler(message, parentNode);
}
function changeReplyMethod() {
  if (replyMessage1) {
    replyMessage1 = false;
    getReplyMessage = getMessageMatch2;
    replySendMessage = createReplyMessage2;
  } else {
    replyMessage1 = true;
    getReplyMessage = getMessageMatch1;
    replySendMessage = createReplyMessage1;
  }
}
function clearMessages() {
  let len = parseInt(document.getElementsByClassName('logitem').length / 2);
  for (let i = 0; i <= len - 1; i++) {
    document.getElementsByClassName('logitem')[0].remove();
  }
  sendMessage('Cleared');
}
function sendMessage(message) {
  const form = document.getElementsByClassName('chatmsg')[0].parentNode;
  const submit = document.getElementById('submit');
  form.childNodes[0].value = message;
  submit.click();
}
async function printMessage(options) {
  let message = options['message'];
  let stranger = options['stranger'];
  if (!stranger) createMychat(message);
  else await sendPostMessage(message, true);
}
async function sendPostMessage(message, disable, appendPrev) {
  message = message.replaceAll('%0A%0A', '%0A');

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://front24.omegle.com/send', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  //xhr.onload = function () { console.log(this.responseText);};
  //%0A
  if (!disable) createMychat(message, appendPrev);

  xhr.send(`msg=${message}&id=${connectedID}`);
}
function createReplyMessage2(reply, replyingMessage) {
  console.log(reply);
  sendMessage(`"${replyingMessage}": ${reply}`);
}
function createReplyMessage1(reply, replyingMessage) {
  let towhom = document.getElementsByClassName('Nothing')[0].innerText;
  let forwho;
  let message;
  towhom.includes('you') ? (forwho = 'yourself') : (forwho = 'them');

  message = `✉️Replied to ${forwho}✉️%0A------%0A"${replyingMessage}"%0A------------%0A➔ ${reply}`;

  let query = document.querySelectorAll('.msggroup');
  query = query[query.length - 1];
  if (query.className == 'msggroup strangermsggroup') {
    let div = document.createElement('div');
    div.innerHTML = `<div class="msggroup youmsggroup"><div class="msggroup-msgs"><div class="msggroup-msg"><span class="hasbeenread"></span></div></div></div>`;
    message = message.replaceAll('%0A%0A', '%0A');
    message = message.replaceAll('%0A', '\n');
    div.querySelectorAll('.hasbeenread')[0].innerText = message;
    let replyDiv = div.firstChild;
    let strangeMsg = query;
    let strangerMessage = strangeMsg.querySelectorAll('.msggroup-msg');
    //removing all the messageest of the replied something
    let messageLenght = strangerMessage.length;
    let clone = strangeMsg.cloneNode(true);
    for (let i = 0; i < messageLenght; i++) {
      strangerMessage[0].remove();
      console.log('remove');
    }

    let logItem = query.parentNode;
    logItem.append(clone); //first
    logItem.append(replyDiv); //second

    logItem.append(strangeMsg); //third
  } else {
    query.firstChild.append(createDiv(message, false));
  }
  document.getElementsByClassName('chatmsgwrapper')[0].scrollIntoView();
  towhom.includes('you') ? (forwho = 'themself') : (forwho = 'you');
  message = `✉️Replied to ${forwho}✉️%0A------%0A"${replyingMessage}"%0A------------%0A➔ ${reply}`;

  sendPostMessage(message, true);
}
function createStarnger() {
  let div = document.createElement('div');
  // convert html string into DOM
  div.innerHTML =
    '<div class="logitem"><div class="msggroup strangermsggroup"><div class="msggroup-msgs"><span ></span></div></div></div>';
  document
    .getElementsByClassName('logitem')[0]
    .parentNode.append(div.firstChild);

  return;
}
function createMychat(message, appendPrev) {
  let que = document.querySelectorAll('.msggroup');
  //if zero just create
  if (que.length == 0) {
    let que = document.querySelectorAll('.logitem')[0].parentNode;
    que.prepend(createDiv(message, true));
    return;
  }

  que = que[que.length - 1];
  if (que.className == 'msggroup strangermsggroup' && !appendPrev) {
    //create whole div
    que.parentNode.after(createDiv(message, true));
  } else {
    que = document.getElementsByClassName('youmsggroup');
    que = que[que.length - 1];
    que.firstChild.append(createDiv(message, false));
  }
  document.getElementsByClassName('chatmsgwrapper')[0].scrollIntoView();
}
function createDiv(message, logitem) {
  //convert the A0%
  message = message.replaceAll('%0A%0A', '%0A');
  message = message.replaceAll('%0A', '\n');
  let myMessage;
  if (logitem) {
    myMessage =
      "<div class='logitem'><div class='msggroup youmsggroup'><div class='msggroup-msgs'> <div class='msggroup-msg'>";
    myMessage += `<span class = 'hasbeenread'>${message}</span> </div> </div></div></div>`;
  } else {
    myMessage = `<div class="msggroup-msg"><span class = 'hasbeenread'>${message}</span></div>`;
  }

  let div = document.createElement('div');
  // convert html string into DOM
  div.innerHTML = myMessage;
  div.firstChild.querySelectorAll('.hasbeenread')[0].innerText = message;
  return div.firstChild;
}

let connectedID;

(function (open) {
  XMLHttpRequest.prototype.open = function (m, u, a, us, p) {
    this.addEventListener(
      'readystatechange',
      function () {
        let res = this.response;

        if (res.includes('connected') && !matchedUp) {
          console.log('connected');
          document
            .getElementsByClassName('permsg')[0]
            .removeAttribute('disabled');
          matchedUp = true;
          setTimeout(() => {
            autoMessage.forEach((message, i) => {
              sendMessage(message);
            });
          }, 400);
        }
        if (res.includes('clientID')) {
          res = JSON.parse(res);

          connectedID = res['clientID'];
        }
      },
      false
    );

    open.call(this, m, u, a, us, p);
  };
})(XMLHttpRequest.prototype.open);

function disableAll() {
  connectEnabled = false;
  battleShipEnable = false;
  enabledChess = false;
  battleStart = false;
  cardEnabled = false;
  cardStart = false;
  checkerEnabled = false;
}
let previewPickPosition = '';
const letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
let enabledChess = false;
//kingMoved
//white firstIndex
//black 2nd index
let kingMoved = [false, false];
let checks = [false, false];
let castled = [false, false];
let turns = 'w';
let rookHaveMoved = [
  [false, false],
  [false, false],
];
//first index for left
let previewMoves = [];

let available_moves = [];
let tempMatch = [];
let tempMoves = [];
let currentPosition = '';
let enpasant = false;
let pieceEnpass = [[]];
let chessPattern = [
  ['⬜', '🟩', '⬜', '🟩', '⬜', '🟩', '⬜', '🟩'],
  ['🟩', '⬜', '🟩', '⬜', '🟩', '⬜', '🟩', '⬜'],
  ['⬜', '🟩', '⬜', '🟩', '⬜', '🟩', '⬜', '🟩'],
  ['🟩', '⬜', '🟩', '⬜', '🟩', '⬜', '🟩', '⬜'],
  ['⬜', '🟩', '⬜', '🟩', '⬜', '🟩', '⬜', '🟩'],
  ['🟩', '⬜', '🟩', '⬜', '🟩', '⬜', '🟩', '⬜'],
  ['⬜', '🟩', '⬜', '🟩', '⬜', '🟩', '⬜', '🟩'],
  ['🟩', '⬜', '🟩', '⬜', '🟩', '⬜', '🟩', '⬜'],
];

const chessNotation = [
  ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'],
  ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'],
  ['a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6'],
  ['a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5'],
  ['a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4'],
  ['a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3'],
  ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'],
  ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'],
];
let match = [
  ['b♜R', 'b♞KN', 'b♝B', 'b♛Q', 'b♚K', 'b♝B', 'b♞KN', 'b♜R'],
  ['b♟P', 'b♟P', 'b♟P', 'b♟P', 'b♟P', 'b♟P', 'b♟P', 'b♟P'],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  ['w♙P', 'w♙P', 'w♙P', 'w♙P', 'w♙P', 'w♙P', 'w♙P', 'w♙P'],
  ['w♖R', 'w♘KN', 'w♗B', 'w♕Q', 'w♔K', 'w♗B', 'w♘KN', 'w♖R'],
];

const matchCopy = [
  ['b♜R', 'b♞KN', 'b♝B', 'b♛Q', 'b♚K', 'b♝B', 'b♞KN', 'b♜R'],
  ['b♟P', 'b♟P', 'b♟P', 'b♟P', 'b♟P', 'b♟P', 'b♟P', 'b♟P'],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  ['w♙P', 'w♙P', 'w♙P', 'w♙P', 'w♙P', 'w♙P', 'w♙P', 'w♙P'],
  ['w♖R', 'w♘KN', 'w♗B', 'w♕Q', 'w♔K', 'w♗B', 'w♘KN', 'w♖R'],
];

// prettier-ignore

// prettier-ignore
const chessEmojiReplace = [
  '🐴','👩', '🧙‍♂️',  '🤴','👸', '👩‍⚖️', '🐴','👩', '🧙‍♂️','🤴','👸','👩‍⚖️','🟥','🟥',];
// prettier-ignore
const chessEmoji = [ '🦄','👩🏻','🧙🏻', '🤴🏻', '👸🏻','👩🏻‍⚖️', '🐴', '👩🏿', '🧙🏿‍♂️', '🤴🏿', '👸🏿', '👩🏿‍⚖️', '⬜','🟩',];
// prettier-ignore
const chessEmoticon = [ '♘', '♙', '♗', '♔','♕', '♖','♞','♟','♝','♚','♛','♜','⬜','🟩',];

let pieceTake = [[], []];
let pinnedOnce = true;
function chessHandler(message, parentNode) {
  if (message.startsWith('/chessgame start') && !enabledChess) {
    disableAll();
    enabledChess = true;
    reset(); //reset the chess
    changeTextView(' '); // send the initial state of the board
    parentNode.className == 'msggroup strangermsggroup'
      ? (turns = 'b')
      : (turns = 'w');
    return;
  }

  if (message.startsWith('/chessgame reset') && enabledChess) {
    reset();
    changeTextView(' ');
    return;
  }
  if (message.startsWith('/chessgame show') && enabledChess) {
    changeTextView(' ');
    return;
  }
  if (message.startsWith('/surrender')) {
    let Mess;
    parentNode.className == 'msggroup strangermsggroup'
      ? (Mess = 'Black Surrendered')
      : (Mess = 'White Surrendered');
    sendPostMessage(Mess + '%0A' + 'Chessgame exited', false);

    disableAll();
    return;
  }
  if (message.startsWith('/chessgame quit')) {
    sendMessage('chessgame exit');
    disableAll();
    return;
  }

  if (message.startsWith('/moves') && enabledChess) {
    let stranger;
    parentNode.className == 'msggroup strangermsggroup'
      ? (stranger = true)
      : (stranger = false);

    let sendmes = preview(message, stranger);
    stranger ? sendPostMessage(sendmes, true) : createMychat(sendmes);
    return;
  }

  //here
  if (enabledChess) {
    if (
      (turns == 'w' && parentNode.className == 'msggroup strangermsggroup') ||
      (turns == 'b' && parentNode.className != 'msggroup strangermsggroup')
    )
      return;

    let pattern = message.toLowerCase().match(/([a-h][1-8])/i);
    if (
      pattern &&
      message.toLowerCase().startsWith(pattern[0]) &&
      message.length == 2
    ) {
      message = previewPickPosition + message;
    }

    notationMoves(message);
    previewPickPosition = '';
  }
}
function reset() {
  kingMoved = [false, false];
  checks = [false, false];
  castled = [false, false];
  rookHaveMoved = [
    [false, false],
    [false, false],
  ];
  previewMoves = [];
  previewPickPosition = '';
  enpasant = false;
  pieceEnpass = [[]];
  currentPosition = '';
  pieceTake[0] = [];
  pieceTake[1] = [];
  match = matchCopy.map((e) => e.map((el) => el));
}

function notationMoves(text) {
  let pattern = text.toLowerCase().match(/([a-h][1-8][a-h][1-8][a-z]*)/i);
  if (!pattern || !text.toLowerCase().startsWith(pattern[0])) return;

  let message = textConvertToMove(pattern[0]);

  //something happens
  message = message.toLowerCase();

  changeTextView(message);
}

function preview(text, stranger) {
  text = text.replaceAll('/moves', '');
  let message;
  if (text.length < 2) return (message = 'Wrong Notation');
  text = text.toLowerCase().trim().replaceAll(' ', '');

  let verified = false;
  let firstSeq = text.substring(0, 2);

  verifyNotation(firstSeq) ? (verified = true) : (verified = false);

  if (!verified) return (message = 'Wrong Notation');

  let index = convertNotationToIndex(firstSeq);

  findPiece(index['column'], index['row'], true, match, true);

  if (match[index['row']][index['column']] == ' ')
    return 'Blank Space - Taylor Swift';
  if (
    (stranger && match[index['row']][index['column']][0] == 'w') ||
    (!stranger && match[index['row']][index['column']][0] == 'b')
  )
    return 'Opposite Piece';
  // if theres no moves of that position
  if (previewMoves.length == 0) return 'No available Moves';

  let processedMessage;
  let getChessMess = getChessPreview(previewMoves);
  stranger
    ? (processedMessage = getChessMess.reverseOrder)
    : (processedMessage = getChessMess.inOrder);
  previewPickPosition = firstSeq;
  return processedMessage;
}
function getChessPreview(moves) {
  let inOrder = '';
  let reverseOrder = '';
  let enemyView = [];
  let takes = '';
  match.forEach((row, i) => {
    let combination = '';
    row.forEach((element, x) => {
      let piece = element[1];
      let comb;
      if (piece == null || piece == '' || piece == ' ')
        piece = chessPattern[i][x];
      // if (piece == '♟') piece = '🖱️';
      let index = chessEmoticon.findIndex((e) => piece == e);
      if (moves.includes(indexToNotation(x, i))) {
        comb = chessEmojiReplace[index] + chessNotation[i][x];
        takes += chessEmojiReplace[index] + chessNotation[i][x];
      } else {
        comb = chessEmoji[index] + chessNotation[i][x];
      }

      combination = combination + comb;
    });
    //process here
    inOrder += combination + '%0A';
    enemyView.push(combination + '%0A');
  });
  for (let i = enemyView.length - 1; i >= 0; i--) {
    reverseOrder += enemyView[i];
  }

  //prettier-ignore
  reverseOrder = '.%0A'+reverseOrder+"Available Moves: %0A"+takes;
  //prettier-ignore
  inOrder = '.%0A'+inOrder+"Available Moves: %0A"+takes;
  return { reverseOrder: reverseOrder, inOrder: inOrder };
}
function verifyNotation(text) {
  let verified = false;

  if (
    letter.includes(text[0].toLowerCase()) &&
    parseInt(text[1]) <= 8 &&
    parseInt(text[1]) >= 1
  )
    verified = true;
  if (
    getPiece('b', text)['type'] != '' &&
    getPiece('b', text)['type'] != 'K' &&
    getPiece('b', text)['type'] != 'P'
  )
    verified = true;

  return verified;
}

function textConvertToMove(text) {
  let message = '';
  if (text.length < 4) return (message = 'Wrong Notation');
  text = text.toLowerCase().trim().replaceAll(' ', '').trim(0, 5);

  let verified = false;
  let firstSeq = text.substring(0, 2);
  let secondSeq = text.substring(2, 4);
  verifyNotation(firstSeq) ? (verified = true) : (verified = false);

  verifyNotation(secondSeq) && verified
    ? (verified = true)
    : (verified = false);
  let promote = text.substring(4);

  if (promote != '' && verified)
    verifyNotation(promote) ? (verified = true) : (verified = false);

  if (!verified) return (message = 'Wrong Notation');

  let index = convertNotationToIndex(firstSeq);
  //find piece
  let who;
  turns == 'w' ? (who = "White's") : (who = "Black's");
  let anMove = analyzeMove(index['column'], index['row'], promote);

  if (anMove == 'turns') return (message = who + ' turn');
  if (anMove == 'illegal move') return (message = 'illegal move');
  if (anMove == 'Wrong piece') return (message = 'Wrong move');

  findPiece(index['column'], index['row'], false, match);
  // if theres no moves of that position
  if (available_moves.length == 0) {
    currentPosition = ' ';
    return (message = 'illegal move');
  }

  // if theres no promotion on the text
  let pieceType = getPieceProp(firstSeq, match);

  if (
    pieceType['type'] == 'pawn' &&
    (secondSeq.includes('8') || secondSeq.includes('1')) &&
    promote == ''
  ) {
    currentPosition = ' ';
    return (message = 'Choose promotion');
  }
  console.log(available_moves);

  index = convertNotationToIndex(secondSeq);

  if (!available_moves.includes(secondSeq)) {
    currentPosition = ' ';
    available_moves = [];
    return (message = 'illegal move');
  }

  message = analyzeMove(index['column'], index['row'], promote);

  return message;
}
function verifyNotation(text) {
  let verified = false;

  if (
    letter.includes(text[0].toLowerCase()) &&
    parseInt(text[1]) <= 8 &&
    parseInt(text[1]) >= 1
  )
    verified = true;
  if (
    getPiece('b', text)['type'] != '' &&
    getPiece('b', text)['type'] != 'K' &&
    getPiece('b', text)['type'] != 'P'
  )
    verified = true;

  return verified;
}

function pawnMove(piece, rowIndex, cellIndex, arrayMatch) {
  available_moves = [];
  let white = piece.charAt(0) == 'w' ? true : false;
  let alpa = letter[cellIndex];
  let number = 8 - rowIndex;
  let multiplyNumber;
  let indexOfAlpa = letter.findIndex((letter) => letter == alpa);
  white == true ? (multiplyNumber = -1) : (multiplyNumber = 1);

  if (alpa == 'a') {
    //front // a4
    available_moves.push(letter[indexOfAlpa] + (number - 1 * multiplyNumber)); // a5
    available_moves.push(letter[indexOfAlpa] + (number - 2 * multiplyNumber)); // a2
    let indexs = convertNotationToIndex(
      letter[indexOfAlpa + 1] + (number - 1 * multiplyNumber)
    );

    if (
      arrayMatch[indexs['row']][indexs['column']][0] != ' ' &&
      arrayMatch[indexs['row']][indexs['column']][0] != piece.charAt(0)
    )
      available_moves.push(
        letter[indexOfAlpa + 1] + (number - 1 * multiplyNumber)
      );
  } else if (alpa == 'h') {
    available_moves.push(letter[indexOfAlpa] + (number - 1 * multiplyNumber));
    available_moves.push(letter[indexOfAlpa] + (number - 2 * multiplyNumber));
    let indexs = convertNotationToIndex(
      letter[indexOfAlpa - 1] + (number - 1 * multiplyNumber)
    );
    if (
      arrayMatch[indexs['row']][indexs['column']][0] != ' ' &&
      arrayMatch[indexs['row']][indexs['column']][0] != piece.charAt(0)
    )
      available_moves.push(
        letter[indexOfAlpa - 1] + (number - 1 * multiplyNumber)
      );
  } else {
    available_moves.push(letter[indexOfAlpa] + (number - 1 * multiplyNumber));
    available_moves.push(letter[indexOfAlpa] + (number - 2 * multiplyNumber));

    available_moves.push(
      letter[indexOfAlpa - 1] + (number - 1 * multiplyNumber)
    );
    available_moves.push(
      letter[indexOfAlpa + 1] + (number - 1 * multiplyNumber)
    );
    let tempArray = [];

    for (let i = 3; i > 1; i--) {
      let indexs = convertNotationToIndex(available_moves[i]);
      // pawn is probabily in the lowest or highest of the board
      if (
        available_moves[i][1].includes('0') ||
        available_moves[i][1].includes('9')
      ) {
        available_moves = [];
        return;
      }

      if (
        arrayMatch[indexs['row']][indexs['column']][0] == piece.charAt(0) ||
        arrayMatch[indexs['row']][indexs['column']][0] == ' '
      )
        tempArray.push(available_moves[i]);
    }

    available_moves = available_moves.filter((e) => !tempArray.includes(e));
  }
  let first_moved = false;
  // remove the second jump if the pawn alreadfy moved
  if ((number == 7 && !white) || (number == 2 && white)) first_moved = true;
  if (!first_moved) available_moves = available_moves.filter((e, i) => i != 1);

  for (let i = 0; i < available_moves.length; i++) {
    let indexes = convertNotationToIndex(available_moves[i]);
    let conditions =
      arrayMatch[indexes['row']][indexes['column']] != ' ' &&
      available_moves[i][0] == alpa;
    //check if theres a piece infront of the pawn remove both if theres one
    if (conditions && i == 0) {
      available_moves = available_moves.filter((e) => e[0] != alpa);
      break;
    }
    //if its second  just remove the second
    if (conditions && i != 0) {
      available_moves = available_moves.filter((e, index) => i != index);
      break;
    }
  }

  //enpasant adder
  let currentPosition = indexToNotation(cellIndex, rowIndex);

  pieceEnpass[0].forEach((move) => {
    if (currentPosition == move) {
      console.log('how manyt');

      let addNumber;
      pieceEnpass[1]['currentPos'].includes('4')
        ? (addNumber = 3)
        : (addNumber = 6);
      available_moves.push(pieceEnpass[1]['currentPos'][0] + addNumber);
    }
  });
  //pinned
}
//a7
function convertNotationToIndex(text) {
  let textLetter = letter.findIndex((e) => e == text[0]); //0
  let numeric = parseInt(8 - text[1]);

  return { column: textLetter, row: numeric };
}

function indexToNotation(cellIndex, rowIndex) {
  let alpa = letter[cellIndex];

  let number = 8 - rowIndex;

  return alpa + number;
}

function rookMove(piece, rowIndex, cellIndex, arrayMatch) {
  available_moves = [];
  let alpa = letter[cellIndex];
  let number = 8 - rowIndex;
  let positionIndex = convertNotationToIndex(alpa + number);
  xy_move(piece, positionIndex, arrayMatch);
}

function xy_move(piece, positionIndex, arrayMatch) {
  //check right corner

  rookCheck_X(
    piece,
    positionIndex['column'] + 1,
    positionIndex['row'],
    true,
    arrayMatch
  );
  //check left corner
  //prettier-ignore
  rookCheck_X(piece, positionIndex['column'] - 1, positionIndex['row'], false,arrayMatch);

  // check up
  //prettier-ignore
  rookCheck_Y(piece,positionIndex['row'] - 1, positionIndex['column'], false ,arrayMatch);

  //check down
  //prettier-ignore
  rookCheck_Y(piece,positionIndex['row'] + 1, positionIndex['column'], true,arrayMatch);
}

function rookCheck_X(piece, index, rowIndex, increment, arrayMatch) {
  while (index >= 0 && index < 8) {
    let condition = arrayMatch[rowIndex][index];
    //same color blocking dont add anything
    if (condition[0] == piece[0]) break;
    //encounter blank space then add
    if (condition == ' ') {
      available_moves.push(indexToNotation(index, rowIndex));
    }
    //encounter different color add then stop
    if (condition != ' ' && condition[0] != piece[0]) {
      available_moves.push(indexToNotation(index, rowIndex));
      break;
    }
    if (increment) index++;
    else index--;
  }
}

function rookCheck_Y(piece, rowIndex, index, increment, arrayMatch) {
  while (rowIndex >= 0 && rowIndex < 8) {
    let condition = arrayMatch[rowIndex][index];
    //same color blocking dont add anything
    if (condition[0] == piece[0]) break;
    //encounter blank space then add
    if (condition == ' ') {
      available_moves.push(indexToNotation(index, rowIndex));
    }
    //encounter different color add then stop
    if (condition != ' ' && condition[0] != piece[0]) {
      available_moves.push(indexToNotation(index, rowIndex));
      break;
    }
    if (increment) rowIndex++;
    else rowIndex--;
  }
}

function bishopMove(piece, rowIndex, cellIndex, arrayMatch) {
  available_moves = [];
  let alpa = letter[cellIndex];
  let number = 8 - rowIndex;
  let positionIndex = convertNotationToIndex(alpa + number);

  xMove(piece, positionIndex, arrayMatch);
}

function xMove(piece, positionIndex, arrayMatch) {
  //  left to up
  bishopLeftToRight(
    piece,
    positionIndex['column'] - 1,
    positionIndex['row'] - 1,
    false,
    arrayMatch
  );
  // right to down
  bishopLeftToRight(
    piece,
    positionIndex['column'] + 1,
    positionIndex['row'] + 1,
    true,
    arrayMatch
  );
  // right to up
  bishopRightToLeft(
    piece,
    positionIndex['column'] + 1,
    positionIndex['row'] - 1,
    true,
    arrayMatch
  );
  //left down
  bishopRightToLeft(
    piece,
    positionIndex['column'] - 1,
    positionIndex['row'] + 1,
    false,
    arrayMatch
  );
}

function bishopLeftToRight(piece, index, rowIndex, increment, arrayMatch) {
  while (index >= 0 && rowIndex >= 0 && index <= 7 && rowIndex <= 7) {
    let condition = arrayMatch[rowIndex][index];
    //same color blocking dont add anything
    if (condition[0] == piece[0]) break;
    //encounter blank space then add
    if (condition == ' ') {
      available_moves.push(indexToNotation(index, rowIndex));
    }
    //encounter different color add then stop
    if (condition != ' ' && condition[0] != piece[0]) {
      available_moves.push(indexToNotation(index, rowIndex));
      break;
    }
    if (increment) {
      index++;
      rowIndex++;
    } else {
      index--;
      rowIndex--;
    }
  }
}
function bishopRightToLeft(piece, index, rowIndex, increment, arrayMatch) {
  while (index >= 0 && rowIndex >= 0 && index <= 7 && rowIndex <= 7) {
    let condition = arrayMatch[rowIndex][index];
    //same color blocking dont add anything
    if (condition[0] == piece[0]) break;
    //encounter blank space then add
    if (condition == ' ') {
      available_moves.push(indexToNotation(index, rowIndex));
    }
    //encounter different color add then stop
    if (condition != ' ' && condition[0] != piece[0]) {
      available_moves.push(indexToNotation(index, rowIndex));
      break;
    }
    if (increment) {
      index++;
      rowIndex--;
    } else {
      index--;
      rowIndex++;
    }
  }
}

function kingMove(piece, rowIndex, cellIndex, arrayMatch) {
  available_moves = [];

  //left
  if (
    cellIndex - 1 >= 0 &&
    arrayMatch[rowIndex][cellIndex - 1][0] != piece[0]
  ) {
    available_moves.push(indexToNotation(cellIndex - 1, rowIndex));
  }
  //left-up
  if (
    cellIndex - 1 >= 0 &&
    rowIndex - 1 >= 0 &&
    arrayMatch[rowIndex - 1][cellIndex - 1][0] != piece[0]
  ) {
    available_moves.push(indexToNotation(cellIndex - 1, rowIndex - 1));
  }

  //up
  if (rowIndex - 1 >= 0 && arrayMatch[rowIndex - 1][cellIndex][0] != piece[0]) {
    available_moves.push(indexToNotation(cellIndex, rowIndex - 1));
  }
  //right-up
  if (
    rowIndex - 1 >= 0 &&
    cellIndex + 1 < 8 &&
    arrayMatch[rowIndex - 1][cellIndex + 1][0] != piece[0]
  ) {
    available_moves.push(indexToNotation(cellIndex + 1, rowIndex - 1));
  }

  //right
  if (cellIndex + 1 < 8 && arrayMatch[rowIndex][cellIndex + 1][0] != piece[0]) {
    available_moves.push(indexToNotation(cellIndex + 1, rowIndex));
  }
  //right-down
  if (
    cellIndex + 1 < 8 &&
    rowIndex + 1 < 8 &&
    arrayMatch[rowIndex + 1][cellIndex + 1][0] != piece[0]
  ) {
    available_moves.push(indexToNotation(cellIndex + 1, rowIndex + 1));
  }
  //down
  if (rowIndex + 1 < 8 && arrayMatch[rowIndex + 1][cellIndex][0] != piece[0]) {
    available_moves.push(indexToNotation(cellIndex, rowIndex + 1));
  }
  //left-down
  if (
    cellIndex - 1 >= 0 &&
    rowIndex + 1 < 8 &&
    arrayMatch[rowIndex + 1][cellIndex - 1][0] != piece[0]
  ) {
    available_moves.push(indexToNotation(cellIndex - 1, rowIndex + 1));
  }
  // castle left side
  //prettier-ignore
  if ( (piece[0] == 'w' &&!castled[0] &&!kingMoved[0] &&!checks[0] && !rookHaveMoved[0][0])
  || (piece[0] == 'b' && !castled[1] &&!kingMoved[1] &&!checks[1]  && !rookHaveMoved[1][0])
  ) {
  let noPiecesInBetween = false
    for (let i = 1; i < cellIndex; i++) 
      if (arrayMatch[rowIndex][i] == " " || arrayMatch[rowIndex][i] == "" )noPiecesInBetween =true;
        else{
        noPiecesInBetween =false
        break;
        } 

        
      

      if(noPiecesInBetween && piece[0]=="w"){
        available_moves.push("a1")
        available_moves.push("c1")
    
      }
      if(noPiecesInBetween && piece[0]=="b"){

        available_moves.push("a8")
        available_moves.push("c8")
      }
  }
  // castle right side
  //prettier-ignore
  if( (piece[0] == 'w' &&!castled[0] &&!kingMoved[0] &&!checks[0] && !rookHaveMoved[0][1])
  || (piece[0] == 'b' && !castled[1] &&!kingMoved[1] &&!checks[1]  && !rookHaveMoved[1][1])
  )  {
  let noPiecesInBetween = false
  for (let i = cellIndex+1; i <=6; i++) 
  if (arrayMatch[rowIndex][i] == " " || arrayMatch[rowIndex][i] == "" )noPiecesInBetween =true;
        else{
        noPiecesInBetween =false
        break;
        } 
    
    if(noPiecesInBetween && piece[0]=="w"){
      available_moves.push("h1")

      available_moves.push("g1")
    }

    if(noPiecesInBetween && piece[0]=="b"){
      

      available_moves.push("h8")
      available_moves.push("g8")
    }
  }
}
function queenMove(piece, rowIndex, cellIndex, arrayMatch) {
  available_moves = [];
  let alpa = letter[cellIndex];
  let number = 8 - rowIndex;
  let positionIndex = convertNotationToIndex(alpa + number);
  console.log('queen');
  xMove(piece, positionIndex, arrayMatch);
  xy_move(piece, positionIndex, arrayMatch);
}

function knightMove(piece, rowIndex, cellIndex, arrayMatch) {
  available_moves = [];
  let alpa = letter[cellIndex];
  let number = 8 - rowIndex;
  let positionIndex = convertNotationToIndex(alpa + number);

  horseMoves(piece, positionIndex['row'], positionIndex['column'], arrayMatch);
}
function horseMoves(piece, rowIndex, cellIndex, arrayMatch) {
  //right
  //above the chessboard

  let addedIndex = cellIndex + 2;
  let subtractedIndex = cellIndex - 2;

  let addedRow = rowIndex + 2;
  let subtractedRow = rowIndex - 2;

  //right down
  if (
    addedIndex <= 7 &&
    rowIndex != 7 &&
    arrayMatch[rowIndex + 1][addedIndex][0] != piece[0]
  )
    available_moves.push(indexToNotation(addedIndex, rowIndex + 1));

  //left down
  if (
    subtractedIndex >= 0 &&
    rowIndex != 7 &&
    arrayMatch[rowIndex + 1][subtractedIndex][0] != piece[0]
  )
    available_moves.push(indexToNotation(subtractedIndex, rowIndex + 1));
  //right up
  if (
    addedIndex <= 7 &&
    rowIndex != 0 &&
    arrayMatch[rowIndex - 1][addedIndex][0] != piece[0]
  )
    available_moves.push(indexToNotation(addedIndex, rowIndex - 1));
  //left up
  if (
    subtractedIndex >= 0 &&
    rowIndex != 0 &&
    arrayMatch[rowIndex - 1][subtractedIndex][0] != piece[0]
  )
    available_moves.push(indexToNotation(subtractedIndex, rowIndex - 1));

  //up right
  if (
    subtractedRow >= 0 &&
    cellIndex + 1 < 8 &&
    arrayMatch[subtractedRow][cellIndex + 1][0] != piece[0]
  )
    available_moves.push(indexToNotation(cellIndex + 1, subtractedRow));

  //up left
  if (
    subtractedRow >= 0 &&
    cellIndex - 1 >= 0 &&
    arrayMatch[subtractedRow][cellIndex - 1][0] != piece[0]
  )
    available_moves.push(indexToNotation(cellIndex - 1, subtractedRow));

  //down left
  if (
    addedRow < 8 &&
    cellIndex - 1 >= 0 &&
    arrayMatch[addedRow][cellIndex - 1][0] != piece[0]
  )
    available_moves.push(indexToNotation(cellIndex - 1, addedRow));

  //down right
  if (
    addedRow < 8 &&
    cellIndex + 1 < 8 &&
    arrayMatch[addedRow][cellIndex + 1][0] != piece[0]
  )
    available_moves.push(indexToNotation(cellIndex + 1, addedRow));
}
function getKingPostion(color, arr) {
  let kingNotationPosition = '';
  let find = '';
  color == 'w' ? (find = '♔K') : (find = '♚K');
  arr.forEach((e, i) => {
    let temp = indexToNotation(
      e.findIndex((element) => element.endsWith(find)),
      i
    );
    if (letter.includes(temp[0])) kingNotationPosition = temp;
  });

  return kingNotationPosition;
}

function check(color, arr) {
  let kingColor = getKingPostion(color, arr);
  let oppositeColor;
  //black
  color == 'w' ? (oppositeColor = 'b') : (oppositeColor = 'w');
  //white

  let everyMoves = getEveryMoves(arr, oppositeColor);

  if (everyMoves.includes(kingColor)) {
    return true;
  }

  return false;
}

function pinned(color, positionNotation, moves) {
  console.time('pinned');
  let pieceMoves = [];
  let remainingMoves;
  pieceMoves.push(positionNotation);
  pieceMoves.push(moves);

  remainingMoves = checkmate(color, [pieceMoves], true)['moves'];
  console.log(remainingMoves);
  // enbling pinned Mode
  pinnedOnce = true;
  console.timeEnd('pinned');
  return remainingMoves;
}

function getEveryMoves(arr, color) {
  let everyMoves = [];
  //findPiece

  arr.forEach((row, rowIndex) => {
    available_moves = [];
    row.forEach((cells, cellIndex) => {
      //for white
      if (cells != '' && cells != ' ' && cells.startsWith(color)) {
        findPiece(cellIndex, rowIndex, true, arr);
        if (available_moves.length != 0)
          everyMoves = [...everyMoves, ...available_moves];
      }
    });
  });
  return everyMoves;
}

function getMovesAndPosition(arr, color) {
  let postionAndMoves = [];
  console.log(arr);
  arr.forEach((row, rowIndex) => {
    available_moves = [];
    row.forEach((cells, cellIndex) => {
      if (cells != '' && cells.startsWith(color)) {
        let position = indexToNotation(cellIndex, rowIndex);
        findPiece(cellIndex, rowIndex, true, arr);
        if (available_moves.length != 0) {
          let tempArr = [];
          tempArr.push(position, available_moves);
          postionAndMoves.push(tempArr);
        }
      }
    });
  });
  return postionAndMoves;
}

function checkmate(color, moves, Pinned, stalemate) {
  let oppositeColor;
  let remainingMoves = [];
  color == 'w' ? oppositeColor == 'b' : oppositeColor == 'w';

  // let inCheckMoves = getMovesAndPosition(match, color);
  let inCheckMoves = moves;
  let checkMated = true;
  // the one who check
  tempMatch = match.map((arr) => arr.slice(0));

  inCheckMoves.some((element) => {
    let positionNotation = element[0];

    let currentIndexes = convertNotationToIndex(positionNotation);
    let moves = element[1];
    let kingCastleMoves = ['a1', 'a8', 'c1', 'c8', 'g1', 'g8', 'h1', 'h8'];
    let piceProp = getPieceProp(positionNotation, tempMatch);
    let kingColor;
    let castle;
    piceProp['color'] == 'w' ? (kingColor = 0) : (kingColor = 1);

    return moves.some((move) => {
      console.log('king' + move);
      //king castle remove for checking
      //prettier-ignore
      let castlecondition =   piceProp['type'] == 'king' && ["e8","e1"].includes(positionNotation) &&!castled[kingColor] && kingCastleMoves.includes(move)

      let enpassCondition =
        enpasant &&
        pieceEnpass[0].includes(positionNotation) &&
        pieceEnpass[2] == move;
      if (!Pinned && castlecondition) return;

      let moveIndex = convertNotationToIndex(move);
      let passantSquare;
      let passantCurrentIndex;
      let currentPosition =
        tempMatch[currentIndexes['row']][currentIndexes['column']];
      let soonPosition = tempMatch[moveIndex['row']][moveIndex['column']];
      //castle and if pick
      if (Pinned && castlecondition) {
        kingCastleMoves.slice(0, 4).includes(move)
          ? (castle = 'left')
          : (castle = 'right');
        castlingMove(tempMatch, positionNotation, castle, false);
      } else {
        tempMatch[currentIndexes['row']][currentIndexes['column']] = ' ';
        tempMatch[moveIndex['row']][moveIndex['column']] = currentPosition;
      }

      if (enpassCondition) {
        //prettier-ignore
        passantCurrentIndex = convertNotationToIndex( pieceEnpass[1]['currentPos'] );
        console.log(pieceEnpass[1]['currentPos']);
        passantSquare =
          tempMatch[passantCurrentIndex['row']][passantCurrentIndex['column']];
        tempMatch[passantCurrentIndex['row']][passantCurrentIndex['column']] =
          ' ';
      }

      //if theres a move that remove the check then its not checkmate
      if (!check(color, tempMatch)) {
        checkMated = false;
        //for pinned
        castlecondition;
        remainingMoves.push(move);

        //stalemate Checking
        if (!Pinned) return true;
      }

      //reset every move
      if (enpassCondition)
        tempMatch[passantCurrentIndex['row']][passantCurrentIndex['column']] =
          passantSquare;

      tempMatch[currentIndexes['row']][currentIndexes['column']] =
        currentPosition;
      tempMatch[moveIndex['row']][moveIndex['column']] = soonPosition;
    });
  });

  return { checked: checkMated, moves: remainingMoves };
}
let clicked = false;

function getPieceProp(positon, arrayMatch) {
  let lastLetter = convertNotationToIndex(positon);
  console.log(positon);
  lastLetter = arrayMatch[lastLetter['row']][lastLetter['column']];
  let color;
  color = lastLetter[0];
  lastLetter = lastLetter[lastLetter.length - 1];
  let type = '';
  let abri = '';

  switch (lastLetter) {
    case 'R':
      type = 'rook';
      abri = 'R';
      break;
    case 'N':
      type = 'knight';
      abri = 'KN';
      break;
    case 'B':
      type = 'bishop';
      abri = 'B';
      break;
    case 'Q':
      type = 'queen';
      abri = 'Q';
      break;
    case 'K':
      type = 'king';
      abri = 'K';
      break;
    case 'P':
      type = 'pawn';
      abri = 'P';
      break;
    default:
      type = ' ';
      abri = ' ';
  }
  return { type: type, color: color, end: abri };
}
function getOppositeColor(color) {
  let oppositeColor;
  color == 'w' ? (oppositeColor = 'b') : (oppositeColor = 'w');
  return oppositeColor;
}
function getPiece(color, type) {
  let end = '';
  let abri = '';
  switch (type.toUpperCase()) {
    case 'R':
      abri = '♖';
      end = 'R';
      break;
    case 'N':
      abri = '♘';
      end = 'KN';
      break;
    case 'B':
      abri = '♗';
      end = 'B';
      break;
    case 'Q':
      abri = '♕';
      end = 'Q';
      break;
    case 'K':
      abri = '♔';
      end = 'K';
      break;
    case 'P':
      abri = '♙';
      end = 'P';
      break;
  }

  if (color == 'b') {
    switch (type) {
      case 'R':
        abri = '♜';
        end = 'R';
        break;
      case 'N':
        abri = '♞';
        end = 'KN';
        break;
      case 'B':
        abri = '♝';
        end = 'B';
        break;
      case 'Q':
        abri = '♛';
        end = 'Q';
        break;
      case 'K':
        abri = '♚';
        end = 'K';
        break;
      case 'P':
        abri = '♟';
        end = 'P';
        break;
    }
  }
  return { piece: abri, type: end };
}

const createBoard = () => {
  let rows = [];
  const main = document.getElementById('main');

  for (let i = 0; i < 8; i++) {
    let row = document.createElement('tr');
    for (let x = 0; x < 8; x++) {
      let column = document.createElement('td');
      let span = document.createElement('span');
      let text;
      match[i][x][1] == null ? (text = ' ') : (text = match[i][x][1]);
      span.innerText = text;
      column.appendChild(span);
      span.addEventListener('click', () => {
        let cellIndex = span.parentNode.cellIndex;
        let rowIndex = span.parentNode.parentNode.rowIndex;
        Array.from(main.rows).forEach((row) => {
          Array.from(row.cells).forEach(
            (cell) => (cell.style = 'background:transparent')
          );
        });

        if (analyzeMove(cellIndex, rowIndex, 'Q')) return;

        findPiece(cellIndex, rowIndex, false, match);
        available_moves.forEach((element) => {
          let indext = convertNotationToIndex(element);

          main.rows[indext['row']].cells[indext['column']].style =
            'background:red !important;';
        });
      });
      row.appendChild(column);
    }

    main.appendChild(row);
    rows.push(row);
    //  console.log(rows);
  }
};

function analyzeMove(cellIndex, rowIndex, promote) {
  let message = ' ';
  if (
    currentPosition != '' &&
    available_moves.find((e) =>
      e.includes(indexToNotation(cellIndex, rowIndex))
    )
  ) {
    let pieceType = getPieceProp(currentPosition, match);
    //return if same

    available_moves.forEach((moves) => {
      let indexes = convertNotationToIndex(moves);
      if (indexes['row'] == rowIndex && indexes['column'] == cellIndex) {
        let currentPostionIndex = convertNotationToIndex(currentPosition);
        let queen;
        pieceType['color'] == 'w' ? (queen = '♕') : (queen = '♛');

        //pawm promotion
        if (
          (pieceType['type'] == 'pawn' && moves.includes('8')) ||
          (pieceType['type'] == 'pawn' && moves.includes('1'))
        ) {
          let tempPiece = getPiece(pieceType['color'], promote);
          match[currentPostionIndex['row']][currentPostionIndex['column']] =
            pieceType['color'] + tempPiece['piece'] + tempPiece['type'];
        }
        //rookMove for castling left side
        //prettier-ignore
        if ( pieceType['type'] == 'rook' && (currentPosition == 'a1' || currentPosition == 'a8')) 
          pieceType['color'] == 'w' ? (rookHaveMoved[0][0] = true)  : (rookHaveMoved[1][0] = true);
        //rookMove for castling right side
        //prettier-ignore
        if ( pieceType['type'] == 'rook' && (currentPosition == 'h1' || currentPosition == 'h8')) 
      pieceType['color'] == 'w' ? (rookHaveMoved[0][1] = true)  : (rookHaveMoved[1][1] = true);

        //kingmoveCastle
        //prettier-ignore
        let kingCastleMoves = ['a1', 'a8','c1','c8','g1','g8','h1','h8', ];

        let castle = { enabled: false };
        let arrNumber;
        pieceType['color'] == 'w' ? (arrNumber = 0) : (arrNumber = 1);

        if (
          pieceType['type'] == 'king' &&
          kingCastleMoves.includes(moves) &&
          !kingMoved[arrNumber]
        ) {
          kingCastleMoves.slice(0, 4).includes(moves)
            ? (castle = { enabled: true, side: 'left' })
            : (castle = { enabled: true, side: 'right' });
          pieceType['color'] == 'w'
            ? (kingMoved[0] = true)
            : (kingMoved[1] = true);
        }
        if (pieceType['type'] == 'king') kingMoved[arrNumber] = true;

        if (
          enpasant &&
          pieceType['type'] == 'pawn' &&
          pieceEnpass[0].includes(currentPosition)
        ) {
          message = moved(match, castle, currentPostionIndex, indexes, {
            enabled: true,
            position: pieceEnpass[1]['currentPos'],
          });
        } else {
          message = moved(match, castle, currentPostionIndex, indexes, {
            enabled: false,
          });
        }
        //reset enpasant
        if (enpasant) {
          enpasant = false;
          pieceEnpass = [[]];
        }

        //en passant initialization
        //prettier-ignore
        if ( !enpasant &&pieceType['type'] == 'pawn' &&
    ( moves.includes('4') && currentPosition.includes('2') && pieceType['color'] == 'w') 
    ||
    (pieceType['color'] == 'b' &&  moves.includes('5') &&currentPosition.includes('7'))
      ) {
      enpass(match,moves)
        
      }

        //visual
        //remove the previos position
      }
    });

    currentPosition = '';
    console.log(message);
    return message;
  }

  let pieceColor = match[rowIndex][cellIndex][0];
  if (pieceColor == ' ') {
    currentPosition = ' ';
    available_moves = [];

    return 'illegal Move';
  }
  //same block

  if (turns != pieceColor) {
    currentPosition = ' ';
    available_moves = [];

    return 'Wrong Piece';
  }
  if (currentPosition == indexToNotation(cellIndex, rowIndex)) {
    currentPosition = ' ';
    available_moves = [];
    console.log('stoppp');
    return 'turns';
  }
  return false;
}
function changeVisual(arr) {
  Array.from(main.rows).forEach((row, i) => {
    Array.from(row.cells).forEach((cell, x) => {
      cell.style = 'background:transparent;';
      let piece = arr[i][x][1];
      if (piece == null) piece = ' ';
      if (cell.firstChild.innerText != piece) {
        cell.firstChild.innerText = piece;
      }
    });
  });
}

function changeTextView(message) {
  message = message.toLowerCase();
  console.log(message);

  if (
    message == 'wrong notation' ||
    message.includes("white's") ||
    message.includes("black's") ||
    message.includes('illegal move') ||
    message.includes('wrong piece') ||
    message.includes('choose promotion')
  ) {
    sendMessage(message);
    return;
  }

  if (message == 'checkmated' || message == 'stalemate') {
    enabledChess = false;
    sendMessage(message);
  }

  if (message == 'check') {
    sendMessage(message);
  }

  let getMess = getChessMessage();
  sendPostMessage(getMess.reverseOrder, true);

  createMychat(getMess.inOrder);
}

function getChessMessage() {
  let inOrder = '';
  let reverseOrder = '';
  let enemyView = [];
  match.forEach((row, i) => {
    let combination = '';
    row.forEach((element, x) => {
      let piece = element[1];
      let comb;
      if (piece == null || piece == '' || piece == ' ')
        piece = chessPattern[i][x];
      // if (piece == '♟') piece = '🖱️';
      let index = chessEmoticon.findIndex((e) => piece == e);
      comb = chessEmoji[index] + chessNotation[i][x];
      combination = combination + comb;
    });
    //process here
    inOrder += combination + '%0A';
    enemyView.push(combination + '%0A');
  });
  for (let i = enemyView.length - 1; i >= 0; i--) {
    reverseOrder += enemyView[i];
  }
  let blackTakes = '';
  let whiteTakes = '';
  let line = '-----------------------------------------------';
  //white
  pieceTake[0].forEach((piece) => {
    whiteTakes += piece;
  });
  //black
  pieceTake[1].forEach((piece) => {
    blackTakes += piece;
  });

  //prettier-ignore
  reverseOrder = '.%0A'+whiteTakes+"%0A"+line+"%0A"+ reverseOrder+line+"%0A"+blackTakes;
  //prettier-ignore
  inOrder = '.%0A'+blackTakes+"%0A"+line+"%0A"+inOrder+line+"%0A"+whiteTakes;
  return { reverseOrder: reverseOrder, inOrder: inOrder };
}

function castlingMove(arr, position, side, revert) {
  let indexes = convertNotationToIndex(position);
  let rook, king;
  let row = indexes['row'];
  if (revert) {
    if (side == 'left') {
      arr[row][0] = arr[row][3];
      arr[row][4] = arr[row][2];

      arr[row][3] = ' ';

      arr[row][2] = ' ';

      return;
    }

    //right side

    arr[row][7] = arr[row][5];
    arr[row][4] = arr[row][6];
    arr[row][5] = ' ';

    arr[row][6] = ' ';
    return;
  }

  //left side
  if (side == 'left') {
    rook = arr[row][0];
    king = arr[row][4];

    //remove previous
    arr[row][0] = ' ';
    arr[row][4] = ' ';

    //insert
    //rook
    arr[row][3] = rook;
    //king
    arr[row][2] = king;
  }
  if (side == 'right') {
    //right side
    rook = arr[row][7];
    king = arr[row][4];
    //remove previous
    arr[row][7] = ' ';
    arr[row][4] = ' ';

    //insert
    //rook
    arr[row][5] = rook;
    //king
    arr[row][6] = king;
  }
}

function insertTake(piece, number) {
  if (piece == ' ') return '';
  let index = chessEmoticon.findIndex((e) => e == piece.charAt(1));

  pieceTake[number].push(chessEmoji[index]);
  return chessEmoji[index];
}

function moved(arr, castle, currentPostionIndex, newIndex, enpass) {
  let message = 'moved';
  let temp = arr[currentPostionIndex['row']][currentPostionIndex['column']];
  console.log(temp);

  let color = temp[0];
  let number;
  color == 'w' ? (number = 0) : (number = 1);
  checks[number] = false;

  let indexes;
  let removedPawn;
  // enpass MOve
  if (enpass['enabled']) {
    indexes = convertNotationToIndex(enpass['position']);
    removedPawn = arr[indexes['row']][indexes['column']];

    message += insertTake(removedPawn, number);
    arr[indexes['row']][indexes['column']] = ' ';
  }
  // normal move
  if (!castle['enabled']) {
    //remove the previos position
    arr[currentPostionIndex['row']][currentPostionIndex['column']] = ' ';
    //insert the previos position
    let taking = arr[newIndex['row']][newIndex['column']];
    message += insertTake(taking, number);
    arr[newIndex['row']][newIndex['column']] = temp;
    //
  }
  //castling
  if (castle['enabled'])
    castlingMove(
      arr,
      indexToNotation(
        currentPostionIndex['column'],
        currentPostionIndex['row']
      ),
      castle['side']
    );
  //checking check
  let oppositeCol = getOppositeColor(color);
  pinnedOnce = false;
  console.time('response');
  let checkBol = check(oppositeCol, arr);

  if (checkBol) {
    let number;
    oppositeCol == 'w' ? (number = 0) : (number = 1);
    checks[number] = true;
    console.log('IN CHECK');
    message = 'Check';
    //check if checkmate
    checkmate(oppositeCol, getMovesAndPosition(arr, oppositeCol), false)[
      'checked'
    ] == true
      ? (console.log('checkmate'), (message = 'checkmated'))
      : (message = 'Check');
  }
  //stalemate cheking
  if (!checkBol) {
    stalemate(
      checkBol,
      checkmate(oppositeCol, getMovesAndPosition(arr, oppositeCol), false, true)
    )
      ? (message = 'Stalemate')
      : (message = 'moved');
  }

  pinnedOnce = true;
  turns == 'w' ? (turns = 'b') : (turns = 'w');

  // checkmate checking
  // turn off the pinned

  console.timeEnd('response');

  // changeVisual(arr);

  return message;
}
// function sandok(datas) {
//   let temp = datas['temp'];

//   main.rows[datas['currentPostionIndex']['row']].cells[
//     datas['currentPostionIndex']['column']
//   ].firstChild.innerText = ' ';

//   if (datas['enpass']['enabled']) {
//     let indexes = convertNotationToIndex(datas['enpass']['position']);
//     main.rows[indexes['row']].cells[indexes['column']].firstChild.innerText =
//       ' ';
//   }
//   //insert the previos position
//   main.rows[datas['newIndex']['row']].cells[
//     datas['newIndex']['column']
//   ].firstChild.innerText = temp;

//   //reset
//   Array.from(main.rows).forEach((row) => {
//     Array.from(row.cells).forEach(
//       (cell) => (cell.style = 'background:transparent;')
//     );
//   });
// }

function enpass(arr, position) {
  enpasant = true;
  let indexes = convertNotationToIndex(position);
  let positions = [];
  pieceEnpass = [];
  let tempArr = [];
  let enpasantMove;
  console.log(position);
  //right
  if (indexes['column'] + 1 <= 7) {
    positions.push(letter[indexes['column'] + 1] + position[1]);
  }
  //left
  if (indexes['column'] - 1 >= 0) {
    positions.push(letter[indexes['column'] - 1] + position[1]);
  }

  //checking if the piece is pawn
  positions.forEach((pos) => {
    if (getPieceProp(pos, arr)['end'].toLowerCase() == 'p') {
      tempArr.push(pos);
      let tempMove;

      pos[1].includes('5')
        ? (tempMove = position[0] + 6)
        : (tempMove = position[0] + 3);

      enpasantMove = tempMove;
    }
  });
  pieceEnpass.push(tempArr);
  pieceEnpass.push({ currentPos: position });
  pieceEnpass.push(enpasantMove);
  console.log(enpasantMove);
  pieceEnpass[0].length == 0 ? (enpasant = false) : (enpasant = true);
}
function stalemate(inCheck, checkmateMoves) {
  console.log(checkmateMoves['moves'], 'stalemoves');
  if (!inCheck && checkmateMoves['moves'].length == 0) return true;
  return false;
}
function findPiece(cellIndex, rowIndex, check, arrayMatch, prev) {
  let piecesInMatch = arrayMatch[rowIndex][cellIndex];

  if (piecesInMatch == ' ') return;
  if (!check) {
    currentPosition = indexToNotation(cellIndex, rowIndex);
    clicked = true;
  }

  switch (piecesInMatch[piecesInMatch.length - 1]) {
    case 'R':
      rookMove(piecesInMatch, rowIndex, cellIndex, arrayMatch);
      break;
    case 'N':
      knightMove(piecesInMatch, rowIndex, cellIndex, arrayMatch);
      break;
    case 'B':
      bishopMove(piecesInMatch, rowIndex, cellIndex, arrayMatch);
      break;
    case 'Q':
      queenMove(piecesInMatch, rowIndex, cellIndex, arrayMatch);
      break;
    case 'K':
      kingMove(piecesInMatch, rowIndex, cellIndex, arrayMatch);
      break;
    case 'P':
      pawnMove(piecesInMatch, rowIndex, cellIndex, arrayMatch);

      break;
  }

  let position = indexToNotation(cellIndex, rowIndex);
  if ((!pinnedOnce || check) && !prev) return;
  console.log('one');
  pinnedOnce = false;
  let pieceProp = getPieceProp(
    indexToNotation(cellIndex, rowIndex),
    arrayMatch
  );
  //for pin
  prev
    ? (previewMoves = pinned(pieceProp['color'], position, available_moves))
    : (available_moves = pinned(pieceProp['color'], position, available_moves));
}

//connect game

let connectBoard = [];
let colorTurns = '🔵';
let connectEnabled = false;
let winner = false;
const connectLetter = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

function connectHandler(message, parentNode) {
  if (message == '/connectgame start' && !connectEnabled) {
    disableAll();
    connectEnabled = true;

    resetConnect();
    sendMessage('Connect 4 enabled');
    printConnect();
    return;
  }

  if (message == '/connect4 show' && connectEnabled) {
    printConnect();
    return;
  }
  if (message == '/connect4 reset' && connectEnabled) {
    sendMessage('Connect 4 reset');
    resetConnect();
    printConnect();
    return;
  }
  if (message == '/connect4 quit' && connectEnabled) {
    sendMessage('Connect 4 exit');
    disableAll();
    return;
  }

  if (connectEnabled) {
    if (
      (colorTurns == '🔵' &&
        parentNode.className == 'msggroup strangermsggroup') ||
      (colorTurns == '🔴' &&
        parentNode.className != 'msggroup strangermsggroup')
    )
      return;
    connectMove(message);
  }
}

function switchTurns() {
  colorTurns == '🔵' ? (colorTurns = '🔴') : (colorTurns = '');
  turns == 'w' ? (turns = 'b') : (turns = 'w');
  battleShipTurn == 0 ? (battleShipTurn = 1) : (battleShipTurn = 0);
  playerTurn == 0 ? (playerTurn = 1) : (playerTurn = 0);
  checkerTurn == 0 ? (checkerTurn = 1) : (checkerTurn = 0);
}

function resetTurns() {
  battleShipTurn = 0;
  colorTurns = '🔵';
  playerTurn = 0;
  checkerTurn = 0;
  turns = 'w';
}

function resetConnect() {
  createConnectBoard();
  winner = false;
}
function createConnectBoard() {
  connectBoard = [];
  for (let i = 0; i < 6; i++) {
    let temp = [];
    for (let x = 0; x < 7; x++) {
      temp.push('⚪');
    }
    connectBoard.push(temp);
  }
}
function connectMove(message) {
  message = message.toLowerCase();

  if (!message.startsWith('!') || message.length != 2) return;

  let conletter = message.charAt(1);
  conletter = conletter.toUpperCase();
  console.log();
  insertCoin(conletter);
  printConnect();
  colorTurns == '🔵' ? (colorTurns = '🔴') : (colorTurns = '🔵');
}
function printConnect() {
  const form = document.getElementsByClassName('chatmsg')[0].parentNode;
  const submit = document.getElementById('submit');

  let firstSent = '.%0A-A--B--C---D---E--F--G%0A'; //

  //let firstSent = '.%0A[Ⓐ][Ⓑ][Ⓒ][Ⓓ][Ⓔ][Ⓕ][Ⓖ]%0A'; //

  let lastSent = '-A--B--C--D--E--F--G';

  if (winner) {
    form.childNodes[0].value = colorTurns + 'Won';
    submit.click();
    disableAll();
    winner = false;
  }

  connectBoard.forEach((el) => {
    let combination = '';
    el.forEach((element) => {
      combination = combination + element;
    });

    firstSent += combination + '%0A';
  });
  firstSent += lastSent;
  sendPostMessage(firstSent, false);
}

function insertCoin(letter) {
  const index = connectLetter.findIndex((e) => e == letter.toUpperCase());

  if (index == -1) {
    colorTurns == '🔵' ? (colorTurns = '🔴') : (colorTurns = '🔵');
    return sendMessage("Doesn't contain " + letter.toUpperCase());
  }

  let indexes = [];
  let outOfrange = true;

  for (let i = connectBoard.length - 1; i >= 0; i--) {
    if (connectBoard[i][index] == '⚪') {
      connectBoard[i][index] = colorTurns;
      indexes.rowIndex = i;
      indexes.cellIndex = index;
      // found = true;
      outOfrange = false;
      break;
    }
  }
  if (outOfrange) {
    colorTurns == '🔵' ? (colorTurns = '🔴') : (colorTurns = '🔵');
    return sendMessage('Full');
  }

  let found = connectBoard[0].some((el) => {
    if (el == '⚪') return true;
  });
  if (!found) {
    return sendMessage('Draw');
  }

  connected4(colorTurns, indexes['cellIndex'], indexes['rowIndex']);
}
function connected4(color, cellIndex, rowIndex) {
  let collection = [
    lookHorizontal(color, rowIndex),
    lookVertical(color, cellIndex),
    lookDiagonalLR(color, cellIndex, rowIndex),
    lookDiagonalRL(color, cellIndex, rowIndex),
  ];
  collection.forEach((el) => {
    if (el)
      el.forEach((element) => {
        connectBoard[element['rowIndex']][element['cellIndex']] = '🟢';
      });
  });
  winner = collection.find((e) => e != false);
  if (winner) return;
}
function lookHorizontal(color, rowIndex) {
  const coinColor = color;
  let counter = 0;
  let indexesArr = [];
  for (let i = 0; i < connectBoard[0].length; i++) {
    let tempArr = [];
    if (connectBoard[rowIndex][i] == coinColor) {
      tempArr['cellIndex'] = i;
      tempArr['rowIndex'] = rowIndex;
      indexesArr.push(tempArr);
      counter++;
    } else {
      indexesArr = [];
      counter = 0;
    }
    if (counter == 4) {
      console.log(counter);
      return indexesArr;
    }
  }

  return false;
}
function lookVertical(color, cellIndex) {
  const coinColor = color;
  let counter = 0;
  let indexesArr = [];
  for (let i = 0; i < connectBoard.length; i++) {
    let tempArr = [];
    if (connectBoard[i][cellIndex] == coinColor) {
      tempArr['cellIndex'] = cellIndex;
      tempArr['rowIndex'] = i;
      indexesArr.push(tempArr);
      counter++;
    } else {
      indexesArr = [];
      counter = 0;
    }
    if (counter == 4) {
      return indexesArr;
    }
  }

  return false;
}
function lookDiagonalRL(color, cellIndex, rowIndex) {
  const coinColor = color;
  let counter = 0;
  let indexesArr = [];
  //right to left

  let startCellIndex = cellIndex - (5 - rowIndex);

  for (let i = 5; i >= 0; i--) {
    let tempArr = [];
    if (connectBoard[i][startCellIndex] == coinColor) {
      tempArr['cellIndex'] = startCellIndex;
      tempArr['rowIndex'] = i;
      indexesArr.push(tempArr);
      counter++;
    } else {
      indexesArr = [];
      counter = 0;
    }
    if (counter == 4) {
      return indexesArr;
    }
    startCellIndex++;
  }

  return false;
}
function lookDiagonalLR(color, cellIndex, rowIndex) {
  const coinColor = color;
  let counter = 0;
  let indexesArr = [];
  ///left to right                   6 - 5  =  1
  let startIndex = cellIndex - rowIndex; //
  for (let i = 0; i < connectBoard.length; i++) {
    let tempArr = [];
    if (connectBoard[i][startIndex] == coinColor) {
      tempArr['cellIndex'] = startIndex;
      tempArr['rowIndex'] = i;
      indexesArr.push(tempArr);
      counter++;
    } else {
      indexesArr = [];
      counter = 0;
    }
    if (counter == 4) {
      return indexesArr;
    }
    startIndex++;
  }
  return false;
}

//battleship
let alliedShipsBoard, enemyViewBoard, enemyShipsBoard, alliedViewBoard;
let battleShipEnable = false;
let battleShipTurn = 0;
let numbersLabel = [
  ['０１', '..２', '..３', '..４', '.５', '..６', '..７', '.８', '..９', '.10'],
  ['⓪①', ' ②', ' ③', ' ④', ' ⑤', ' ⑥', ' ⑦', ' ⑧', ' ⑨', ' ⑩'],
];
let numbering1 = '０１..２..３..４.５..６..７.８..９.10';
let numbering2 = '⓪① ② ③ ④ ⑤ ⑥ ⑦ ⑧ ⑨ ⑩';
let battleStart = false;
let shipPosition = [[], []];
let myNumber = numbering1;
let themNumber = numbering2;
let latestDirection = 'l';
let battleshipLetter = 'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙ';
let op;
let boardSize = 7;
let extraColor = ['🟥', '🟦', '⬛️', '🔳', '🔲'];
let extraColorDup = extraColor.slice();
let shipsProp = [
  [5, 4, 3, 3, 2],
  ['🟨', '🟩', '🟫', '🟧', '🟪'],
  ['1', '2', '3', '4', '5'],
];
let originalShips = shipsProp.map((element) => {
  return element.map((ell) => ell);
});
let shipsletter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
let directions = [
  'l',
  'u',
  'd',
  'r',
  'l',
  'u',
  'd',
  'r',
  'l',
  'u',
  'd',
  'r',
  'l',
  'u',
  'd',
  'r',
  'l',
  'u',
  'd',
  'r',
];

function whiteBoardShip() {
  (alliedShipsBoard = []),
    (enemyViewBoard = []),
    (enemyShipsBoard = []),
    (alliedViewBoard = []);
  for (let i = 0; i < boardSize; i++) {
    let temp = [];
    for (let x = 0; x < boardSize; x++) {
      temp.push('⬜');
    }
    alliedShipsBoard.push(temp.slice(0));
    alliedViewBoard.push(temp.slice(0));
    enemyViewBoard.push(temp.slice(0));
    enemyShipsBoard.push(temp.slice(0));
  }
}

function fillBoard() {
  //10x10
  battleShipTurn = 0;
  whiteBoardShip();

  numbering1 = '';
  numbering2 = '';

  for (let i = 0; i < boardSize; i++) {
    numbering1 += numbersLabel[0][i];
    numbering2 += numbersLabel[1][i];
  }
  myNumber = numbering1;
  themNumber = numbering2;

  arrangeShips(alliedShipsBoard);
  arrangeShips(enemyShipsBoard);
}

function battleShipHandler(message, parentNode) {
  let className = parentNode.className;

  let stranger;
  let myShipBoard;
  let myViewBoard;
  let enemyBoard;
  let numbering;
  let oppositeNumber;

  let oppositeViewBoard;

  if (className == 'msggroup strangermsggroup') {
    stranger = true;
    myShipBoard = enemyShipsBoard;
    myViewBoard = enemyViewBoard;
    enemyBoard = alliedShipsBoard;
    numbering = themNumber;
    oppositeViewBoard = alliedViewBoard;
    oppositeNumber = myNumber;
  } else {
    myShipBoard = alliedShipsBoard;
    myViewBoard = alliedViewBoard;
    enemyBoard = enemyShipsBoard;
    oppositeViewBoard = enemyViewBoard;
    numbering = myNumber;
    oppositeNumber = themNumber;
    stranger = false;
  }

  // options
  let options = {
    stranger: stranger,
    myViewBoard: myViewBoard,
    myShipBoard: myShipBoard,
    oppositeBoard: enemyBoard,
    print: [true, true, true], //shipboard, viewboard ,active
    numbering: numbering,
  };

  if (
    message.match(/\/battleship gamesize \b([5-9]|10)\b/) &&
    !battleShipEnable
  ) {
    boardSize = message.match(/\/battleship gamesize \b([5-9]|10)\b/)[1];
    disableAll();
    extraColor = extraColorDup.slice();
    shipsProp[0] = originalShips[0].slice();
    shipsProp[1] = originalShips[1].slice();
    shipsProp[2] = originalShips[2].slice();
    battleShipEnable = true;
    let temp = [themNumber, myNumber];
    fillBoard();
    themNumber = temp[0];
    myNumber = temp[1];
    printBothShips([true, true, true, false]);
  }
  if (
    message.startsWith('/battleship start') &&
    battleShipEnable &&
    !battleStart
  ) {
    battleStart = true;
    //send message

    sendMessage('Game Started' + ' Player ' + (battleShipTurn + 1) + ' turn');

    let viewBoards = [alliedViewBoard, enemyViewBoard];
    let numberings = [myNumber, themNumber];
    let stranger = [false, true];

    options = {
      stranger: stranger[battleShipTurn],
      myViewBoard: viewBoards[battleShipTurn],
      myShipBoard: [],
      oppositeBoard: [],
      print: [false, true, false, false], //shipboard, viewboard ,active
      numbering: numberings[battleShipTurn],
    };
    printMessage(battleshipMessage(options));
    return;
  }

  if (message.startsWith('/view ship') && battleShipEnable) {
    options['print'] = [true, false, false, false];
    printMessage(battleshipMessage(options));
    return;
  }
  if (message.startsWith('/view board') && battleShipEnable) {
    options['print'] = [false, true, false, false];
    printMessage(battleshipMessage(options));
    return;
  }

  if (message.startsWith('/view all') && battleShipEnable) {
    options['print'] = [true, true, true, false];
    printMessage(battleshipMessage(options));
    return;
  }
  if (message.startsWith('/change number') && battleShipEnable) {
    stranger
      ? themNumber == numbering1
        ? (themNumber = numbering2)
        : (themNumber = numbering1)
      : myNumber == numbering1
      ? (myNumber = numbering2)
      : (myNumber = numbering1);

    stranger ? (numbering = themNumber) : (numbering = myNumber);
    options['numbering'] = numbering;
    options['print'] = [true, false, false, false];

    printMessage(battleshipMessage(options));
    return;
  }

  if (message.startsWith('/ship random') && battleShipEnable && !battleStart) {
    arrangeShips(myShipBoard);
    options['print'] = [true, false, false, false];
    printMessage(battleshipMessage(options));
    return;
  }

  if (message.match(/\/addship \d{1,2}/) && battleShipEnable && !battleStart) {
    let matches = message.match(/ \d{1,2}/g);
    let insertedShip = {
      counter: 0,
      colors: [],
      size: [],
    };
    matches.some((number) => {
      let data = additionalShip(parseInt(number));
      if (data['inserted']) {
        insertedShip['colors'].push(data['message']);
        insertedShip['size'].push(number);
        insertedShip['counter']++;
      } else {
        sendMessage(data['message']);
      }
      if (data['stop']) return true;
    });
    if (insertedShip['counter'] != 0) {
      let message = '';
      insertedShip['colors'].forEach(
        (color, index) =>
          (message += ',Ship(' + insertedShip['size'][index] + '): ' + color)
      );
      message =
        'Added (' + insertedShip['counter'] + ') ' + message.substring(1);
      sendMessage(message);
      arrangeShips(alliedShipsBoard);
      arrangeShips(enemyShipsBoard);
      printBothShips([true, false, false, false]);
    }
    return;
  }

  if (
    message.match(/\/removeship \d{1,2}/) &&
    battleShipEnable &&
    !battleStart
  ) {
    let matches = message.match(/ \d{1,2}/g);
    let nakaremoved = false;
    matches.some((number) => {
      if (shipsProp[0].length == 5) {
        sendMessage("Can't remove anymore");
        return true;
      }
      let index = shipsProp[0].findIndex((shiplength) => shiplength == number);
      sendMessage('Ship size ' + number + ' has been removed');
      clearColor(alliedShipsBoard, shipsProp[1][index]);
      clearColor(enemyShipsBoard, shipsProp[1][index]);
      extraColor.push(shipsProp[1][index]);
      shipsProp[0].splice(index, 1);
      shipsProp[1].splice(index, 1);
      shipsProp[2].splice(index, 1);
      nakaremoved = true;
    });
    if (nakaremoved) {
      arrangeShips(alliedShipsBoard);
      arrangeShips(enemyShipsBoard);
      printBothShips([true, false, false, false]);
    }
    return;
  }

  if (message == '/battleship reset' && battleShipEnable && !battleStart) {
    let temp = [themNumber, myNumber];
    extraColor = extraColorDup.slice();
    shipsProp[0] = originalShips[0].slice();
    shipsProp[1] = originalShips[1].slice();
    shipsProp[2] = originalShips[2].slice();
    battleShipEnable = true;
    fillBoard();
    themNumber = temp[0];
    myNumber = temp[1];
    printBothShips([true, true, true, false]);

    sendMessage('battleship reset');
    return;
  }

  if (message.startsWith('/battleship quit') && battleShipEnable) {
    disableAll();
    sendMessage('battleship exited');
    return;
  }

  if (battleShipEnable && battleStart) {
    // error here
    if (
      (battleShipTurn == 0 &&
        parentNode.className == 'msggroup strangermsggroup') ||
      (battleShipTurn == 1 &&
        parentNode.className != 'msggroup strangermsggroup')
    )
      return;
    let fired = fireCondition(message, options);
    if (fired) {
      console.log('fired');
      if (fired.startsWith('mentioned')) {
        sendMessage(message.substring(1) + ' Already mentioned UwU');
        return;
      }

      if (fired == 'missed') {
        //send view board to the one whos firing
        options['print'] = [false, true, true, false];
        printMessage(battleshipMessage(options));
        sendMessage(
          'You missed: ' + ' Player ' + (battleShipTurn + 1) + " turn's"
        );

        //send board to the who who will fire next
        let mes = createBattleShipMessage({
          shipBoard: enemyBoard,
          enemy: false,
          numbering: oppositeNumber,
        });
        mes += createBattleShipMessage({
          shipBoard: oppositeViewBoard,
          enemy: true,
          numbering: oppositeNumber,
        });

        mes += findActiveShips(myShipBoard);

        printMessage({
          stranger: !options['stranger'],
          message: mes,
        });

        return;
      }

      if (fired == 'hit') {
        //send the enemyShipBoard

        let battleWon = checkWinner(enemyBoard);

        if (battleWon) {
          let lastMes = ['', ''];
          let shipBoards = [
            [enemyShipsBoard, alliedShipsBoard],
            [alliedShipsBoard, enemyShipsBoard],
          ];
          let numberings = [themNumber, myNumber];
          let labels = [false, true];
          findActiveShips(enemyShipsBoard);
          findActiveShips(alliedShipsBoard);
          lastMes.forEach((e, i) => {
            findActiveShips(shipBoards[i][0]);
            let mes = '%0A';
            for (let x = 0; x < 2; x++) {
              mes += createBattleShipMessage({
                shipBoard: shipBoards[i][x],
                enemy: labels[x],
                numbering: numberings[i],
              });
            }

            lastMes[i] = mes;
          });

          stranger
            ? (sendPostMessage('You Won' + lastMes[0], true),
              createMychat('You Lose' + lastMes[1]))
            : (sendPostMessage('You Lose' + lastMes[0], true),
              createMychat('You Win' + lastMes[1]));
          battleShipTurn == 0 ? (battleShipTurn = 1) : (battleShipTurn = 0);
          sendMessage('battleship exited');
          disableAll();

          //true winner
          return;
        }
        sendMessage(
          'Hit: ' + ' Player ' + (battleShipTurn + 1) + " turn's again"
        );
        //send view board for the one whos firing
        options['print'] = [false, true, true, false];
        printMessage(battleshipMessage(options));
        //send ship board for the one who got hit
        options['stranger'] = !options['stranger'];
        options['print'] = [false, false, false, true];
        printMessage(battleshipMessage(options));
      }

      return;
    }
  }
}

function printBothShips(print) {
  options = {
    stranger: true,
    myViewBoard: enemyViewBoard,
    myShipBoard: enemyShipsBoard,
    oppositeBoard: alliedShipsBoard,
    print: print, //shipboard, viewboard ,active,enemyShipBoard
    numbering: themNumber,
  };

  printMessage(battleshipMessage(options));
  //send for me
  options = {
    stranger: false,
    myViewBoard: alliedViewBoard,
    myShipBoard: alliedShipsBoard,
    oppositeBoard: enemyShipsBoard,
    print: print, //shipboard, viewboard ,active
    numbering: myNumber,
  };
  printMessage(battleshipMessage(options));
}
function battleshipMessage(options) {
  let stranger = options['stranger'];
  let myViewBoard = options['myViewBoard'];
  let myShipBoard = options['myShipBoard'];
  let enemyBoard = options['oppositeBoard'];
  let printViewBoard = options['print'][1];
  let printShipBoard = options['print'][0];
  let printEnemyBoard = options['print'][3];
  let findShips = options['print'][2];
  let numbering = options['numbering'];
  let message = '';
  let activeShips = '';

  if (findShips) {
    activeShips = findActiveShips(enemyBoard);
  }
  if (printShipBoard) {
    message += createBattleShipMessage({
      shipBoard: myShipBoard,
      enemy: false,
      numbering: numbering,
    });
  }
  if (printViewBoard) {
    message += createBattleShipMessage({
      shipBoard: myViewBoard,
      enemy: true,
      numbering: numbering,
    });
  }
  //active ships
  message += activeShips;

  if (printEnemyBoard) {
    let enemyNumber;
    stranger ? (enemyNumber = themNumber) : (enemyNumber = myNumber);
    message += createBattleShipMessage({
      shipBoard: enemyBoard,
      enemy: false,
      numbering: enemyNumber,
    });
  }
  return { message: message, stranger: stranger };

  //just me
}

function additionalShip(number) {
  let limitSize = 15;
  let message = '';
  if (number <= 1)
    return {
      inserted: false,
      message: (message = 'Ship size should be greater than 1'),
      stop: false,
    };

  // number is larger than the size of the board
  if (number >= boardSize)
    return {
      inserted: false,
      message: (message = `Ship size ${number} is too large`),
      stop: false,
    };

  if (extraColor.length == 0)
    return {
      inserted: false,
      message: (message = `Ships reached its limit (${shipsProp[0].length})`),
      stop: true,
    };

  let sumOftheBoard = shipsProp[0].reduce((prev, next) => prev + next);
  let predictSize = boardSize * boardSize - (sumOftheBoard + number);
  if (limitSize > predictSize) {
    let remaining = boardSize * boardSize - (sumOftheBoard + limitSize);
    message =
      remaining == limitSize
        ? "The board is full of ship can't add more"
        : `Ship remaining size left is ${remaining < 0 ? 0 : remaining}`;
    return { inserted: false, message: message, stop: false };
  }

  //went through
  return { inserted: true, message: AddShips(number), stop: false };
}
function AddShips(size) {
  let addedColor;
  shipsProp[0].some((ele, index) => {
    if (size >= ele) {
      shipsProp[0].splice(index, 0, size);
      addedColor = extraColor.shift();
      shipsProp[1].splice(index, 0, addedColor);
      shipsProp[2].splice(index, 0, shipsProp[0].length);
      return true;
    }
  });
  if (addedColor == undefined) {
    shipsProp[0].push(size);
    addedColor = extraColor.shift();
    shipsProp[1].push(addedColor);
    shipsProp[2].push(shipsProp[0].length);
  }

  return addedColor;
}
function createBattleShipMessage(options) {
  let shipBoard = options['shipBoard']; //
  let enemy = options['enemy']; // bol

  let numbering = options['numbering'];
  let message = '';
  let label;
  enemy
    ? (label = `Enemy Ships:%0A${numbering}%0A`) // myshipBoard
    : (label = `Your ships: %0A${numbering}%0A`); // myviewBoard
  message += label;
  shipBoard.forEach((element, i) => {
    let tempString = '';
    element.forEach((el) => {
      tempString += el;
    });
    message += battleshipLetter[i] + tempString + '%0A';
  });
  //messageOpposite += ;
  message += numbering + '%0A';
  return message;
}
function checkWinner(enemyBoard) {
  let activeShips = [];
  for (let i = 1; i <= shipsProp[0].length; i++) {
    activeShips.push(findShips(i, enemyBoard)); //p ush true if the ship still alive
  }
  let shipsRemaining = activeShips.filter((e) => e == true); //if didnt find then its lose

  let allDestroyed = false;
  if (!shipsRemaining.length) allDestroyed = true;

  return allDestroyed;
}
function findActiveShips(enemyBoard) {
  let activeShips = '';
  for (let i = 1; i <= shipsProp[0].length; i++) {
    if (findShips(i, enemyBoard)) {
      activeShips += `Ship ${i}(${shipsProp[0][i - 1]}): Active %0A`;
    } else {
      console.log('ito');
      shipDestroyedEmoji(enemyBoard, i);
      activeShips += `Ship ${i}(${shipsProp[0][i - 1]}): Destroyed %0A`;
    }
  }
  return activeShips;
}
function shipDestroyedEmoji(enemyBoard, shipId) {
  let index;
  enemyBoard == alliedShipsBoard ? (index = 0) : (index = 1);
  let boardsAndView = [
    [alliedShipsBoard, enemyViewBoard],
    [enemyShipsBoard, alliedViewBoard],
  ];
  let shipInfo = shipPosition[index][shipId - 1];
  let cellIndex = shipInfo['cellIndex'];
  let rowIndex = shipInfo['rowIndex'];
  let direction = shipInfo['direction'];
  let ship = shipsProp[0][shipId - 1];
  let shipColor = '♨️';
  let board = boardsAndView[index][0];
  let shipView = boardsAndView[index][1];
  let indexes = { rowIndex: rowIndex, cellIndex: cellIndex };
  console.log(rowIndex, cellIndex);
  console.log(shipInfo);
  if (board[rowIndex][cellIndex] == shipColor) return; // means its already process
  switch (direction) {
    case 'l':
      console.log('sad');
      //prettier-ignore
      placeShipLeft({arr: board,indexes: indexes,ship: ship, shipColor: shipColor  }); //change into fire
      //prettier-ignore
      placeShipLeft(  {arr: shipView,indexes: indexes,ship: ship, shipColor: shipColor  });
      break;
    case 'r':
      //prettier-ignore
      placeShipRight({arr: board,indexes: indexes,ship: ship, shipColor: shipColor  }); //change into fire
      //prettier-ignore
      placeShipRight({arr: shipView,indexes: indexes,ship: ship, shipColor: shipColor  }); //change into fire
      break;
    case 'd':
      //prettier-ignore
      placeShipDown({arr: board,indexes: indexes,ship: ship, shipColor: shipColor  }); //change into fire
      //prettier-ignore
      placeShipDown({arr: shipView,indexes: indexes,ship: ship, shipColor: shipColor  }); //change into fire
      break;
    case 'u':
      //prettier-ignore
      placeShipUp({arr: board,indexes: indexes,ship: ship, shipColor: shipColor  }); //change into fire
      //prettier-ignore
      placeShipUp({arr: shipView,indexes: indexes,ship: ship, shipColor: shipColor  }); //change into fire
      break;
  }
}
function fireCondition(message, option) {
  if (message.charAt(0) != '!') return false;

  message = message.toLowerCase();
  message = message.substring(1, 4);
  let matches = message.match(/([a-j][1-9][0]?)/);
  console.log(matches);
  if (!matches) return false; // no matches
  matches = matches[0];

  let num = matches.substring(1);

  let letterIndex = shipsletter.findIndex((e) => e == matches[0]);
  if (num > boardSize || letterIndex > boardSize) return false;
  return shipFire(matches, option);
}
function findShips(shipId, arr) {
  let shipColor = shipsProp[1][shipId - 1];
  let active = arr.some((element) => {
    return element.some((el) => {
      if (shipColor == el) {
        console.log(el);
        return true;
      }
    });
  });

  return active;
}
function shipFire(position, option) {
  let indexes = convertPositonToIndex(position);

  let oppositeShipBoard = option['oppositeBoard'];
  let myViewBoard = option['myViewBoard'];
  if (myViewBoard[indexes['rowIndex']][indexes['cellIndex']] != '⬜')
    return 'mentioned ';
  if (oppositeShipBoard[indexes['rowIndex']][indexes['cellIndex']] == '⬜') {
    myViewBoard[indexes['rowIndex']][indexes['cellIndex']] = '🔵';
    oppositeShipBoard[indexes['rowIndex']][indexes['cellIndex']] = '🔵';

    battleShipTurn == 0 ? (battleShipTurn = 1) : (battleShipTurn = 0);
    return 'missed';
  } else {
    oppositeShipBoard[indexes['rowIndex']][indexes['cellIndex']] = '⭕️';
    myViewBoard[indexes['rowIndex']][indexes['cellIndex']] = '❌';
    return 'hit';
  }
}

function convertPositonToIndex(pos) {
  let alpa = pos[0].toLowerCase();

  let rowIndex = shipsletter.findIndex((e) => e == alpa);
  let number = parseInt(pos.substring(1)) - 1;

  return { rowIndex: rowIndex, cellIndex: number };
}
function randomNum(min, max) {
  // min and max included
  let arr = [];
  if (max == 0 || !max) arr.push(0);
  for (let i = min; i <= max; i++) {
    arr.push(i);
  }

  let shuffledArr = shuffle(arr);

  return shuffledArr[0];
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function placeRandom(arr, shipId) {
  shuffle(directions);
  let direction = directions[0];
  let index;
  arr == alliedShipsBoard ? (index = 0) : (index = 1);
  let rowIndex;
  let cellIndex;
  let numberShip = shipsProp[0][shipsProp[2].findIndex((e) => e == shipId)];
  let boardSizeIndex = boardSize - 1;

  switch (direction) {
    case 'l':
      cellIndex = randomNum(numberShip - 1, boardSizeIndex);
      rowIndex = randomNum(0, boardSizeIndex);
      break;
    case 'r':
      cellIndex = randomNum(0, numberShip);
      rowIndex = randomNum(0, boardSizeIndex);
      break;
    case 'd':
      rowIndex = randomNum(0, numberShip);
      cellIndex = randomNum(0, boardSizeIndex);
      break;
    case 'u':
      rowIndex = randomNum(numberShip - 1, boardSizeIndex);
      cellIndex = randomNum(0, boardSizeIndex);
      break;
  }

  //prettier-ignore
  if (!placeShips(shipsletter[rowIndex] + (cellIndex + 1), shipId, direction, arr)){
    placeRandom(arr, shipId)
  
  }else{
  //prettier-ignore
  shipPosition[index].push({shipId:shipId,cellIndex:cellIndex,rowIndex:rowIndex,direction:direction})
  }
  console.log('here');
}
function arrangeShips(arr) {
  let index;
  console.log(arr == alliedShipsBoard);
  arr == alliedShipsBoard ? (index = 0) : (index = 1);
  shipPosition[index] = [];
  console.log(shipPosition[index]);
  console.time('time');
  shipsProp[2].forEach((e) => {
    placeRandom(arr, e);
  });
  console.timeEnd('time');
  console.log(arr);
}

function placeShips(position, shipId, direction, arr) {
  let indexes = convertPositonToIndex(position);
  let success = true;
  let options = {
    indexes: indexes,
    ship: shipsProp[0][shipsProp[2].findIndex((e) => e == shipId)],
    shipColor: shipsProp[1][shipsProp[2].findIndex((e) => e == shipId)],
    arr: arr,
  };
  switch (direction) {
    case 'l':
      success = placeLeft(options);
      break;
    case 'r':
      success = placeRight(options);
      break;
    case 'd':
      success = placeDown(options);
      break;
    case 'u':
      success = placeUp(options);
      break;
  }

  return success;
}
function clearColor(arr, shipColor) {
  arr.forEach((el, i) => {
    el.forEach((e, x) => {
      if (e == shipColor) arr[i][x] = '⬜';
    });
  });
}
function placeRight(options) {
  let ship = options['ship'];
  let arr = options['arr'];
  let shipColor = options['shipColor'];
  let indexes = options['indexes'];
  let added = indexes['cellIndex'] + ship;

  if (added > boardSize) return false;
  //check if theres blocking it
  for (let i = 0; i < ship; i++) {
    let con = arr[indexes['rowIndex']][indexes['cellIndex'] + i];
    if (con != '⬜' && con != shipColor) return false; //something is already place
  }

  clearColor(arr, shipColor); //reset the color
  placeShipRight({
    arr: arr,
    indexes: indexes,
    ship: ship,
    shipColor: shipColor,
  });
  return true;
}

function placeShipRight(options) {
  let arr = options['arr'];
  let indexes = options['indexes'];
  let ship = options['ship'];
  let shipColor = options['shipColor'];
  for (let i = 0; i < ship; i++) {
    arr[indexes['rowIndex']][indexes['cellIndex'] + i] = shipColor;
  }
}
function placeLeft(options) {
  let ship = options['ship'];
  let shipColor = options['shipColor'];

  let arr = options['arr'];
  let indexes = options['indexes'];
  let added = indexes['cellIndex'] - ship;
  if (added < 0) return false;
  for (let i = 0; i < ship; i++) {
    let con = arr[indexes['rowIndex']][indexes['cellIndex'] - i];
    if (con != '⬜' && con != shipColor) return false; //something is already place
    return false; //something is already place
  }

  clearColor(arr, shipColor); //reset the color
  placeShipLeft({
    arr: arr,
    indexes: indexes,
    ship: ship,
    shipColor: shipColor,
  });

  return true;
}
function placeShipLeft(options) {
  let arr = options['arr'];
  let indexes = options['indexes'];
  let ship = options['ship'];
  let shipColor = options['shipColor'];
  for (let i = 0; i < ship; i++) {
    arr[indexes['rowIndex']][indexes['cellIndex'] - i] = shipColor;
  }
}

function placeUp(options) {
  let ship = options['ship'];
  let shipColor = options['shipColor'];
  let arr = options['arr'];
  let indexes = options['indexes'];
  let added = indexes['rowIndex'] - ship;
  if (added + 1 < 0) return false;

  for (let i = 0; i < ship; i++) {
    let con = arr[indexes['rowIndex'] - i][indexes['cellIndex']];

    if (con != '⬜' && con != shipColor) return false; //something is already place
  }
  clearColor(arr, shipColor); //reset the color
  placeShipUp({ arr: arr, indexes: indexes, ship: ship, shipColor: shipColor });

  return true;
}

function placeShipUp(options) {
  let arr = options['arr'];
  let indexes = options['indexes'];
  let ship = options['ship'];
  let shipColor = options['shipColor'];
  for (let i = 0; i < ship; i++) {
    arr[indexes['rowIndex'] - i][indexes['cellIndex']] = shipColor;
  }
}
function placeDown(options) {
  let ship = options['ship'];
  let shipColor = options['shipColor'];
  let indexes = options['indexes'];
  let arr = options['arr'];
  let added = indexes['rowIndex'] + ship;
  if (added > boardSize) return false;
  //check if theres blocking it
  for (let i = 0; i < ship; i++) {
    let con = arr[indexes['rowIndex'] + i][indexes['cellIndex']];
    if (con != '⬜' && con != shipColor) return false; //something is already place
  }
  clearColor(arr, shipColor); //reset the color
  placeShipDown({
    arr: arr,
    indexes: indexes,
    ship: ship,
    shipColor: shipColor,
  });
  return true;
}
function placeShipDown(options) {
  let arr = options['arr'];
  let indexes = options['indexes'];
  let ship = options['ship'];
  let shipColor = options['shipColor'];
  for (let i = 0; i < ship; i++) {
    arr[indexes['rowIndex'] + i][indexes['cellIndex']] = shipColor;
  }
}

/// old maid
let deckOfCards = [''];
let jokerCard = { rank: 'J', name: 'Joker', emoji: '🃏' };
//prettier-ignore
let cardsRank= ["A","2","3","4","5","6","7","8","9","10","J","Q","K"]
let cardsEmoji = ['♦️', '♥️', '♣️', '♠️'];
let cardsName = ['Diamonds', 'Hearts', 'Gloves', 'Spades'];
let hands = [[], []]; //me first index second sila
let cardEnabled = false;
let cardStart = false;
let playerReady = [false, false];
let playerTurn = 0;

async function oldMaidHandler(message, parentNode) {
  let className = parentNode.className;
  let stranger;
  let cardPlayer;
  let oppositePlayer;

  if (className == 'msggroup strangermsggroup') {
    stranger = true;
    cardPlayer = 1;
    oppositePlayer = 0;
  } else {
    stranger = false;
    cardPlayer = 0;
    oppositePlayer = 1;
  }

  if (message == '/cardgame' && !cardEnabled) {
    disableAll();
    playerReady = [false, false];
    cardEnabled = true;
    createDeck();
    sendMessage('Cardgame Started');
    //player 1
    printMessage({
      stranger: false,
      message: printCards(hands[0], '.%0AYour cards:'),
    });
    //player 2
    printMessage({
      stranger: true,
      message: printCards(hands[1], '.%0AYour cards:'),
    });
    return;
  }

  if (message.substring(0, 3) == '/m ' && cardEnabled) {
    let removedArr = pair(message, cardPlayer);
    //send here the cards remaining
    let messageToSend = getRemovePairMessage(removedArr, cardPlayer);
    let additionalMessage = printCards(
      hands[cardPlayer],
      '.%0ARemaining cards:'
    );
    //send the remaining cards
    if (removedArr.length == 0) {
      printMessage({
        stranger: stranger,
        message: "Cards didn't match or not a letter",
      });

      return;
    }
    printMessage({
      stranger: stranger,
      message: additionalMessage + '%0A' + messageToSend,
    }); // send reamining cards

    printMessage({
      stranger: !stranger,
      message: '.%0APlayer ' + (cardPlayer + 1) + messageToSend,
    });

    //send remove pair message

    return;
  }
  if (message == '/cardgame quit') {
    disableAll();
    sendMessage('Cardgame exited');
    return;
  }
  //here
  if (
    message == '/cardready' &&
    cardEnabled &&
    !playerReady[cardPlayer] &&
    !cardStart
  ) {
    // if they both ready game will start and send the cards of the other player
    sendMessage('Player ' + (cardPlayer + 1) + ' is ready');
    playerReady[cardPlayer] = true;
    if (playerReady[0] && playerReady[1]) {
      cardStart = true;
      let oppositeTurn;
      printMessage({
        stranger: stranger,
        message: printCards(hands[cardPlayer], '.%0ARemaining  cards:'),
      });
      playerTurn == 0
        ? ((oppositeTurn = 1), (stranger = false))
        : ((oppositeTurn = 0), (stranger = true));

      sendPostMessage(
        '.%0AGame Started ' +
          '%0Aplayer ' +
          (playerTurn + 1) +
          ' picking first' +
          '%0A Pick 1 to ' +
          hands[oppositeTurn].length,
        false
      );
      return;
    }

    printMessage({
      stranger: stranger,
      message: printCards(hands[cardPlayer], '.%0AYour cards:'),
    });

    return;
  }
  if (message == '/view cards' && cardEnabled) {
    printMessage({
      stranger: stranger,
      message: printCards(hands[cardPlayer], '.%0ARemaining  cards:'),
    });
    return;
  }

  if (message == '/shuffle' && cardEnabled) {
    shuffle(hands[cardPlayer]);
    printMessage({
      stranger: stranger,
      message: printCards(hands[cardPlayer], '.%0ARemaining cards:'),
    });
    return;
  }

  if (
    message.match(/(^\/p [1-9][0-9]?)/) &&
    cardEnabled &&
    playerReady[0] &&
    playerReady[1]
  ) {
    if (playerTurn != cardPlayer) return;
    let card = getCard(message, cardPlayer, oppositePlayer);
    if (card.length == 0) {
      sendMessage('Number Exceeded or No Number');
      return;
    }
    console.log('pick', card[0]);
    //the one whos picking
    let messageToSend = '.%0APicked Card: ' + card[0] + '%0A';
    let removePairMessage = getRemovePairMessage(
      findPair(card[0], cardPlayer),
      cardPlayer
    );
    console.log(removePairMessage);
    printMessage({
      stranger: stranger,
      message:
        printCards(hands[cardPlayer], messageToSend + 'Remaining cards:') +
        removePairMessage,
    });
    //the one whos picking

    //check winner
    let win = cardWinner(); //check winner
    if (win['winner']) {
      sendPostMessage(win['message'] + ' zero card left', false);
      disableAll();
      return;
    }

    //card of the one who got pick
    //prettier-ignore

    removePairMessage
      ? (messageToSend = '.%0A---------------------------------------%0APlayer ' + (cardPlayer + 1) + removePairMessage)
      : messageToSend = '';

    await printMessage({
      stranger: !stranger,
      message:
        printCards(
          hands[oppositePlayer],
          '.%0APlayer ' +
            (playerTurn + 1) +
            ' picked your card: ' +
            card[0] +
            '%0ARemaining cards:'
        ) + messageToSend,
    });

    // the one who got picked
    let pickingMessage =
      'Player ' +
      (oppositePlayer + 1) +
      ': pick 1 to ' +
      hands[playerTurn].length;
    printMessage({ message: pickingMessage, stranger: !stranger });

    //card of the one who got pick

    playerTurn == 0 ? (playerTurn = 1) : (playerTurn = 0);
    return;
  }
}

function getRemovePairMessage(removedArr, cardPlayer) {
  let messageToSend = '';
  if (removedArr.length == 0) return messageToSend;
  messageToSend += '%0ANumber of pair removed : ' + removedArr.length + '%0A';
  for (let i = 0; i < removedArr.length; i++) {
    messageToSend += removedArr[i][0] + ' ' + removedArr[i][1] + ' ';
  }

  return messageToSend;
}
function cardWinner() {
  let mess = '';
  let cardWin = false;
  if (hands[0].length == 0) {
    mess = 'Player 1 won';
    cardWin = true;
  }
  if (hands[1].length == 0) {
    mess = 'Player 2 won';
    cardWin = true;
  }
  return { winner: cardWin, message: mess };
}

function createDeck() {
  deckOfCards = [];

  for (let i = 0; i < cardsName.length; i++) {
    for (let x = 0; x < cardsRank.length - 3; x++) {
      deckOfCards.push(cardsRank[x] + cardsName[i][0] + cardsEmoji[i]);
    }
  }
  //pushJoker
  deckOfCards.push(
    jokerCard['rank'] + jokerCard['name'][0] + jokerCard['emoji']
  );
  distributeCards();
}
function getCard(text, cardPlayer, oppositePlayer) {
  let matches = text.match(/\d+/g);
  let removedMatch = [];
  if (matches.length == 0) return []; //probably wrong number or no number
  let index = matches[0] - 1;

  let oppositeCard = hands[oppositePlayer];
  if (index >= oppositeCard.length || index < 0) return []; //number excceed
  let pickCard = oppositeCard[index];
  let randomNumberIndex = randomNum(0, hands[cardPlayer].length - 1);
  //swaping
  let temp = hands[cardPlayer][randomNumberIndex];
  hands[cardPlayer][randomNumberIndex] = pickCard;
  hands[cardPlayer].push(temp);
  removedMatch.push(pickCard);
  hands[oppositePlayer].splice(index, 1);
  // shuffle(hands[cardPlayer]);

  return removedMatch;
}

function autoPair(cardPlayer) {
  let text = '/m';
  hands[cardPlayer].forEach((e, i) => (text += ' ' + alphabet[i]));
  console.log(text);
  pair(text, cardPlayer);
}
function findPair(pickedCard, cardPlayer) {
  let pickedCardIndex = hands[cardPlayer].findIndex((card) => {
    return pickedCard == card;
  });
  console.log(hands[cardPlayer]);
  console.log(pickedCardIndex);

  let findCardIndex = hands[cardPlayer].findIndex((card, index) => {
    return (
      pickedCard.match(/\d+|[a-z]/i)[0] == card.match(/\d+|[a-z]/i)[0] &&
      index != pickedCardIndex
    );
  });
  console.log(findCardIndex);
  if (findCardIndex == -1) return [];
  let alpa = alphabet[pickedCardIndex] + ' ' + alphabet[findCardIndex];
  console.log(alpa);
  return pair('/m ' + alpa, cardPlayer);
}
function pair(text, cardPlayer) {
  let cards = hands[cardPlayer];
  text = text.replaceAll('/m', '');
  let matches = text.match(/[a-z][ ]?/g);
  // get index

  if (matches == null) return [];
  matches = matches.map((e, i) =>
    alphabet.findIndex((lett) => lett == matches[i].trim())
  );

  matches = [...new Set(matches)]; //remove duplicated
  console.log(matches);
  //remove exceeding
  matches = matches.filter((number) => number <= cards.length - 1);

  let removedMatch = [];
  let pairMatches = [];
  let processedIndex = [];
  matches.forEach((cardIndex) => {
    if (processedIndex.includes(cardIndex)) return; // if the index is already process skip
    let pickedCard = hands[cardPlayer][cardIndex];
    let matchIndex = cards.findIndex(
      (card, cardInHandIndex) =>
        card.match(/\d+|[a-z]/i)[0] == pickedCard.match(/\d+|[a-z]/i)[0] &&
        cardInHandIndex != cardIndex &&
        matches.includes(cardInHandIndex) &&
        !processedIndex.includes(cardInHandIndex)
    );
    if (matchIndex == -1) return; // didnt find
    let matchingCard = hands[cardPlayer][matchIndex];
    //processs indexes
    processedIndex.push(cardIndex);
    processedIndex.push(matchIndex);
    console.log(hands[cardPlayer][cardIndex]);
    console.log(hands[cardPlayer][matchIndex]);
    removedMatch.push([pickedCard, matchingCard]);
    pairMatches.push(pickedCard);
    pairMatches.push(matchingCard);
  });

  pairMatches = [...new Set(pairMatches)]; //remove duplicated
  hands[cardPlayer] = hands[cardPlayer].filter(
    (card) => !pairMatches.includes(card)
  );

  return removedMatch;
}

function distributeCards() {
  hands[0] = [];
  hands[1] = [];
  shuffle(deckOfCards);
  let viceVersa = true;
  for (let i = 0; i < deckOfCards.length; i++) {
    viceVersa
      ? ((viceVersa = false), hands[0].push(deckOfCards[i]))
      : ((viceVersa = true), hands[1].push(deckOfCards[i]));
  }
  console.log(hands);
}

//prettier-ignore
let alphabet= ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
//prettier-ignore
let alphabetEmoji =["🅐","🅑","🅒","🅓","🅔", "🅕", "🅖" ,"🅗" ,"🅘" ,"🅙" ,"🅚" ,"🅛", "🅜" ,"🅝" ,"🅞" ,"🅟", "🅠", 
"🅡", "🅢", "🅣" ,"🅤", "🅥", "🅦", "🅧", "🅨", "🅩"]
function printCards(arr, label) {
  if (label != null) label = label + '%0A';
  else label = '';
  let message = label + '';
  for (let i = 0; i < arr.length; i++) {
    message += alphabetEmoji[i].toUpperCase() + ' : ' + arr[i] + ' ';
    if ((i + 1) % 4 == 0)
      message += '%0A---------------------------------------%0A';
  }
  return message;
}

//checkerrr

let checkerMatch = [];
let checkerMoves = [];
let checkerColor = ['w', 'b'];

let checkerTurn = 0;
let forceJump = true;
let checkerEnabled = false;
let checkerNumberOfmoves = 0; // checking
let checkerPattern = [
  ['⬛️', '⬜️', '⬛️', '⬜️', '⬛️', '⬜️', '⬛️', '⬜️'],
  ['⬜️', '⬛️', '⬜️', '⬛️', '⬜️', '⬛️', '⬜️', '⬛️'],
  ['⬛️', '⬜️', '⬛️', '⬜️', '⬛️', '⬜️', '⬛️', '⬜️'],
  ['⬜️', '⬛️', '⬜️', '⬛️', '⬜️', '⬛️', '⬜️', '⬛️'],
  ['⬛️', '⬜️', '⬛️', '⬜️', '⬛️', '⬜️', '⬛️', '⬜️'],
  ['⬜️', '⬛️', '⬜️', '⬛️', '⬜️', '⬛️', '⬜️', '⬛️'],
  ['⬛️', '⬜️', '⬛️', '⬜️', '⬛️', '⬜️', '⬛️', '⬜️'],
  ['⬜️', '⬛️', '⬜️', '⬛️', '⬜️', '⬛️', '⬜️', '⬛️'],
];

let checkerBoardCopy = [
  [' ', 'b🟢p', ' ', 'b🟢p', ' ', 'b🟢p', ' ', 'b🟢p'],
  ['b🟢p', ' ', 'b🟢p', ' ', 'b🟢p', ' ', 'b🟢p', ' '],
  [' ', 'b🟢p', ' ', 'b🟢p', ' ', 'b🟢p', ' ', 'b🟢p'],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  ['w🟡p', ' ', 'w🟡p', ' ', 'w🟡p', ' ', 'w🟡p', ' '],
  [' ', 'w🟡p', ' ', 'w🟡p', ' ', 'w🟡p', ' ', 'w🟡p'],
  ['w🟡p', ' ', 'w🟡p', ' ', 'w🟡p', ' ', 'w🟡p', ' '],
];

function prepareCheckerBoard() {
  forceJump = true;
  checkerMatch = checkerBoardCopy.map((row) => row.map((cells) => cells));

  getlAllCheckerMoves(checkerColor[checkerTurn], checkerMatch);
}

function checkerHandler(message, parentNode) {
  if (message == '/checker start' && !checkerEnabled) {
    disableAll();
    checkerEnabled = true;
    prepareCheckerBoard();
    sendMessage('Force jump ' + forceJump);
    console.log('loop');
    printChecker(checkerMatch);
    return;
  }
  if (message == '/checker jumpcheck' && !checkerEnabled) {
    sendMessage('Force jump ' + forceJump);
    return;
  }
  if (message == '/checker jump' && !checkerEnabled) {
    forceJump ? (forceJump = false) : (forceJump = true);
    sendMessage('Force jump set to ' + forceJump);
    return;
  }

  if (message == '/checker reset' && checkerEnabled) {
    prepareCheckerBoard();
    sendMessage('Force jump ' + forceJump);
    printChecker(checkerMatch);
    return;
  }
  if (message == '/checker show' && checkerEnabled) {
    printChecker(checkerMatch);
    return;
  }

  if (message == '/checker quit' && checkerEnabled) {
    sendMessage('checker exit');
    disableAll();
    return;
  }
  if (
    checkerEnabled &&
    message.toLowerCase().match(/([a-h][1-8][a-h][1-8])/i)
  ) {
    if (
      (checkerColor[checkerTurn] == 'w' &&
        parentNode.className == 'msggroup strangermsggroup') ||
      (checkerColor[checkerTurn] == 'b' &&
        parentNode.className != 'msggroup strangermsggroup')
    )
      return sendMessage('Not your turn yet. excited yarn?');

    let sendingMessage = checkerMoved(message);
    if (sendingMessage) sendPostMessage(sendingMessage, false);
    return;
  }
}

function checkerMoved(text) {
  let pattern = text.toLowerCase().match(/([a-h][1-8][a-h][1-8])/i);
  if (!pattern || !text.toLowerCase().startsWith(pattern[0]))
    return 'Wrong notation';
  let firstSeq = text.substring(0, 2);
  let secondSeq = text.substring(2, 4);
  let positionIndex = convertNotationToIndex(firstSeq);
  let takePostionIndex = convertNotationToIndex(secondSeq);
  let piece = checkerMatch[positionIndex.row][positionIndex.column];
  let availMoves = checkerMoves.filter(
    (element) => element.position == firstSeq
  )[0];
  //wrong color
  if (checkerMatch[positionIndex.row][positionIndex.column][0] == ' ')
    return 'Blank space - Taylor Swift';
  if (
    checkerMatch[positionIndex.row][positionIndex.column][0] !=
    checkerColor[checkerTurn]
  )
    return 'Wrong piece Baaakaaa!';

  if (!availMoves) return `That piece can't move like jagger`; //no moves
  //normal move
  if (availMoves.normalMoves.includes(secondSeq)) {
    checkerNumberOfmoves++;
    checkerMatch[positionIndex.row][positionIndex.column] = ' ';
    checkerMatch[takePostionIndex.row][takePostionIndex.column] = piece;

    let lastJump = secondSeq;
    if (lastJump[1] == '1' || lastJump[1] == '8') {
      let emojiPiece;
      checkerTurn == 0 ? (emojiPiece = '💛') : (emojiPiece = '💚');
      let takePostionIndex = convertNotationToIndex(lastJump);
      checkerMatch[takePostionIndex.row][takePostionIndex.column] =
        checkerColor[checkerTurn] + emojiPiece + 'k';
    }

    checkerTurn == 0 ? (checkerTurn = 1) : (checkerTurn = 0);
    getlAllCheckerMoves(checkerColor[checkerTurn], checkerMatch);
    printChecker(checkerMatch);
    let stats = checkerStatus(checkerTurn);
    if (stats) return stats;
    return;
  }
  //take move
  if (!availMoves.takeMoves[0].find((e) => e.takePosition == secondSeq))
    return `That piece can't move like jagger`; //check if there a move like that
  checkerNumberOfmoves = 0;
  let takePosition = secondSeq; // b4
  let found;
  //to highest
  do {
    if (!forceJump) break;

    found = availMoves.takeMoves[0].find((e) => e.position == takePosition);
    if (found) takePosition = found.takePosition;
  } while (found);

  let jumpOrder = [];

  //get path to the main piece position
  while (true) {
    found = availMoves.takeMoves[0].find((e) => e.takePosition == takePosition);
    jumpOrder.push(found);
    takePosition = found.position; // check again
    if (takePosition == firstSeq) break; // end of the line
  }

  jumpOrder = jumpOrder.reverse(); // reverse the order

  console.log(jumpOrder);
  //execute the move
  jumpOrder.forEach((moves) => {
    let position = moves.position;
    let oppositePiece = moves.oppositePiece;
    takePosition = moves.takePosition;
    checkerJump(position, oppositePiece, takePosition, checkerMatch);
  });

  let lastJump = jumpOrder[jumpOrder.length - 1].takePosition;
  if (lastJump[1] == '1' || lastJump[1] == '8') {
    let emojiPiece;
    checkerTurn == 0 ? (emojiPiece = '💛') : (emojiPiece = '💚');
    let takePostionIndex = convertNotationToIndex(lastJump);
    checkerMatch[takePostionIndex.row][takePostionIndex.column] =
      checkerColor[checkerTurn] + emojiPiece + 'k';
  }
  checkerTurn == 0 ? (checkerTurn = 1) : (checkerTurn = 0);

  getlAllCheckerMoves(checkerColor[checkerTurn], checkerMatch);
  printChecker(checkerMatch);
  let stats = checkerStatus();
  if (stats) return stats;
}
function checkerStatus() {
  let color;
  checkerTurn == 0 ? (color = 'Green wins') : (color = 'Yellow wins');
  if (checkerMoves.length == 0) {
    disableAll();
    return color;
  }
  if (checkerNumberOfmoves == 20) {
    disableAll();
    return 'Draw';
  }
}

function getCheckerBoard(arr) {
  let pieceThatCanMove = [];
  let pieceMoves = [];
  checkerMoves.forEach((moves) => {
    pieceThatCanMove.push(moves.position);
    moves.takeMoves[0].forEach((take) => {
      pieceMoves.push(take.takePosition);
    });
    pieceMoves = [...pieceMoves, ...moves.normalMoves];
  });

  let inOrder = '';
  let reverseOrder = '';
  let enemyView = [];

  arr.forEach((row, i) => {
    let combination = '';
    row.forEach((piece, x) => {
      let chesspat = checkerPattern[i][x];
      let chessNot;
      chesspat == '⬛️' ? (chessNot = '00') : (chessNot = chessNotation[i][x]);
      piece[0] == ' ' ? (piece = chesspat) : (piece = piece.substring(1, 3));

      let notation = indexToNotation(x, i);
      if (pieceMoves.includes(notation)) piece = '🟥';
      // if (pieceThatCanMove.includes(notation)) piece = '⭕️';

      let comb = piece + chessNot;
      combination = combination + comb;
    });
    //process here
    console.log(combination);
    inOrder += combination + '%0A';
    enemyView.push(combination + '%0A');
  });
  for (let i = enemyView.length - 1; i >= 0; i--) {
    reverseOrder += enemyView[i];
  }
  inOrder = '.%0A' + inOrder;
  reverseOrder = '.%0A' + reverseOrder;

  return { reverseOrder: reverseOrder, inOrder: inOrder };
}
function printChecker(arr) {
  let checkerBoard = getCheckerBoard(arr);

  sendPostMessage(checkerBoard.reverseOrder, true);
  createMychat(checkerBoard.inOrder);
}

function getlAllCheckerMoves(color, arr) {
  let allmoves = [];
  checkerMoves = [];
  console.time('moves');
  checkerMatch.forEach((row, i) => {
    row.forEach((cell, x) => {
      if (cell[0] == color) {
        allmoves.push(checkerPieceMoves(indexToNotation(x, i), arr));
      }
    });
  });

  allmoves = allmoves.filter((row) => {
    return row.takeMoves[0].length != 0 || row.normalMoves.length != 0;
  }); //removing piece that cant be moved
  if (forceJump) {
    let found = allmoves.some((row) => {
      return row.takeMoves[0].length != 0;
    });
    if (found)
      allmoves = allmoves.filter((moves) => {
        if (moves.takeMoves[0].length != 0) {
          moves.normalMoves = [];
          return true;
        }
      });
  }
  console.timeEnd('moves');
  console.log(allmoves);
  checkerMoves = allmoves;
}
function checkerJump(first, second, third, arr) {
  let positionIndex = convertNotationToIndex(first);
  let takePieceIndex = convertNotationToIndex(second);
  let takePostionIndex = convertNotationToIndex(third);
  let piece = arr[positionIndex.row][positionIndex.column];
  arr[positionIndex.row][positionIndex.column] = ' '; //piece position
  arr[takePieceIndex.row][takePieceIndex.column] = ' '; //the taken piece
  arr[takePostionIndex.row][takePostionIndex.column] = piece; //piece path
}
function checkerPieceMoves(position, arrayMatch, prevArr) {
  //checkerMoves = [];
  let indexes = convertNotationToIndex(position);
  let king = false;
  let cellIndex = indexes.column;
  let rowIndex = indexes.row;
  let piece = arrayMatch[rowIndex][cellIndex];
  let oppositePiece;
  let takesMoves = [];
  let normalMoves = [];
  let type = piece[piece.length - 1];
  let pieceTakePosition;
  piece[0] == checkerColor[0]
    ? (oppositePiece = checkerColor[1])
    : (oppositePiece = checkerColor[0]);
  type == 'k' ? (king = true) : (king = false);

  //left-up not take
  if (
    (piece[0] == checkerColor[0] || king) &&
    cellIndex - 1 >= 0 &&
    rowIndex - 1 >= 0 &&
    arrayMatch[rowIndex - 1][cellIndex - 1][0] == ' '
  ) {
    normalMoves.push(indexToNotation(cellIndex - 1, rowIndex - 1));
  }
  //left-up take
  if (
    (piece[0] == checkerColor[0] || king) &&
    cellIndex - 2 >= 0 &&
    rowIndex - 2 >= 0 &&
    arrayMatch[rowIndex - 1][cellIndex - 1][0] == oppositePiece &&
    arrayMatch[rowIndex - 2][cellIndex - 2][0] == ' '
  ) {
    pieceTakePosition = indexToNotation(cellIndex - 1, rowIndex - 1);
    takesMoves.push({
      position: position,
      oppositePiece: pieceTakePosition,
      takePosition: indexToNotation(cellIndex - 2, rowIndex - 2),
    });
  }

  //right-up not take
  if (
    (piece[0] == checkerColor[0] || king) &&
    rowIndex - 1 >= 0 &&
    cellIndex + 1 < 8 &&
    arrayMatch[rowIndex - 1][cellIndex + 1][0] == ' '
  ) {
    normalMoves.push(indexToNotation(cellIndex + 1, rowIndex - 1));
  }
  //right-up take

  if (
    (piece[0] == checkerColor[0] || king) &&
    rowIndex - 2 >= 0 &&
    cellIndex + 2 < 8 &&
    arrayMatch[rowIndex - 1][cellIndex + 1][0] == oppositePiece &&
    arrayMatch[rowIndex - 2][cellIndex + 2][0] == ' '
  ) {
    pieceTakePosition = indexToNotation(cellIndex + 1, rowIndex - 1);
    takesMoves.push({
      position: position,
      oppositePiece: pieceTakePosition,
      takePosition: indexToNotation(cellIndex + 2, rowIndex - 2),
    });
  }

  //right-down not take
  if (
    (piece[0] == checkerColor[1] || king) &&
    cellIndex + 1 < 8 &&
    rowIndex + 1 < 8 &&
    arrayMatch[rowIndex + 1][cellIndex + 1][0] == ' '
  ) {
    normalMoves.push(indexToNotation(cellIndex + 1, rowIndex + 1));
  }
  //right-down  take
  if (
    (piece[0] == checkerColor[1] || king) &&
    cellIndex + 2 < 8 &&
    rowIndex + 2 < 8 &&
    arrayMatch[rowIndex + 1][cellIndex + 1][0] == oppositePiece &&
    arrayMatch[rowIndex + 2][cellIndex + 2][0] == ' '
  ) {
    console.log('take');
    pieceTakePosition = indexToNotation(cellIndex + 1, rowIndex + 1);
    takesMoves.push({
      position: position,
      oppositePiece: pieceTakePosition,
      takePosition: indexToNotation(cellIndex + 2, rowIndex + 2),
    });
  }
  //left-down not take
  if (
    (piece[0] == checkerColor[1] || king) &&
    cellIndex - 1 >= 0 &&
    rowIndex + 1 < 8 &&
    arrayMatch[rowIndex + 1][cellIndex - 1][0] == ' '
  ) {
    normalMoves.push(indexToNotation(cellIndex - 1, rowIndex + 1));
  }

  //left-down take
  if (
    (piece[0] == checkerColor[1] || king) &&
    cellIndex - 2 >= 0 &&
    rowIndex + 2 < 8 &&
    arrayMatch[rowIndex + 1][cellIndex - 1][0] == oppositePiece &&
    arrayMatch[rowIndex + 2][cellIndex - 2][0] == ' '
  ) {
    pieceTakePosition = indexToNotation(cellIndex - 1, rowIndex + 1);
    takesMoves.push({
      position: position,
      oppositePiece: pieceTakePosition,
      takePosition: indexToNotation(cellIndex - 2, rowIndex + 2),
    });
  }
  // checkerMoves.push(normalMoves);
  // checkerMoves.push(takesMoves);
  takesMoves = [takesMoves];
  const unchangeLenght = takesMoves[0].length;

  if (unchangeLenght != 0) {
    let tempCheckerMatch = [];
    let tempArr = [];

    for (let i = 0; i < unchangeLenght; i++) {
      !prevArr
        ? (tempCheckerMatch = checkerMatch.map((el) => el.slice(0))) //jump
        : (tempCheckerMatch = prevArr.map((el) => el.slice(0)));

      checkerJump(
        position,
        takesMoves[0][i].oppositePiece,
        takesMoves[0][i].takePosition,
        tempCheckerMatch
      );

      let takeMoveJump = checkerPieceMoves(
        takesMoves[0][i].takePosition,
        tempCheckerMatch,
        tempCheckerMatch
      );
      if (takeMoveJump.takeMoves[0].length != 0) {
        takeMoveJump.takeMoves[0].forEach((moves) => {
          takesMoves[0].push(moves);
        });
      }
    }
  }

  takesMoves = [
    takesMoves[0].filter((e, pos) => {
      return (
        takesMoves[0].findIndex((move) => {
          return (
            move.oppositePiece == e.oppositePiece &&
            move.takePosition == e.takePosition &&
            move.position == e.position
          );
        }) == pos
      );
    }),
  ]; //removing the duplicates

  return {
    position: position,
    takeMoves: takesMoves,
    normalMoves: normalMoves,
  };
}
