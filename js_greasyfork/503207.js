// ==UserScript==
// @name         Zalo Sly Cleaning
// @namespace    DucLH
// @version      2024-07-29
// @description  Auto tools for Zalo Web
// @author       DucLH
// @match        https://chat.zalo.me/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zalo.me
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503207/Zalo%20Sly%20Cleaning.user.js
// @updateURL https://update.greasyfork.org/scripts/503207/Zalo%20Sly%20Cleaning.meta.js
// ==/UserScript==

const FAIL_MESSAGE_NOT_FRIEND = "Bạn chưa thể gửi tin nhắn";
const FAIL_MESSAGE_BLOCKED = "Xin lỗi";

const SELECTORS = {
  INIT: "#main-tab > div:nth-child(1) > div.nav__tabs__zalo.web",
  SEARCH_INPUT: "#contact-search-input",
}

let isModalShow = false;
let inputSearchElement, inputChatElem;
let curDelay = 0;

let textToSend = "";
let phonesText = "";


const defaultTextInput = 'Ahihi'
let isFirstTime = true;
let countdownConfig = {
  DEFAULT_COUNTDOWN_INTERVAL_SEC: 60 * 10,
  TIMEOUT_GET_RESULT: 5000,
  currentSecsRemain: 0,
  isCountDownRunning: false,
  isLastPhoneDone: false,
}

let curPhones = [], curPhone = "";
let curText = "";

let originText = `📢 CÁC BẠN CÓ BIẾT BÀN PHÍM MÌNH DÙNG HÀNG NGÀY CÓ MỨC ĐỘ SẠCH SẼ NHƯ THẾ NÀO KHÔNG? 📢
▶ Nếu chỉ nhìn bề ngoài thì bạn sẽ khẳng định là sạch tinh như mới, nhưng sự thật không như bạn nghĩ đâu.
⏩ Việc dùng khăn lau bề mặt sẽ chỉ giúp bạn cảm thấy yên tâm hôm nay chứ không đảm bảo được sức khoẻ trong tương lai.
🎖 Hãy để chuyên gia giúp bạn làm việc này nhé!
📢 SLY cung cấp dịch vụ vệ sinh bàn phím trọn gói, không phát sinh chi phí, nhận ngay trong ngày.
☎ Liên hệ qua ZALO hoặc xem chi tiết tại website: https://sly.vn/.`

//Enable console.log
var theFrame = document.createElement('iframe');
theFrame.src = "about:blank";
theFrame.style.display = "none";
document.body.appendChild(theFrame);
window.console = theFrame.contentWindow.console;
window.alert = theFrame.contentWindow.alert;

//Imports
// (() => {
//   //Boosstrap
//   let link = document.createElement("link");
//   link.rel = "stylesheet";
//   link.href = "https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css";
//   document.head.appendChild(link);
// })();

// ======================== 
const TEMPLATE_MODAL = `<div class="duclh-send-modal" style="display:none;position:fixed;z-index:9999;left:0;top:0;width:100%;height:100%;overflow:auto;background-color:rgba(0,0,0,.4)"><div style="background-color:#fefefe;height:700px;margin:15% auto;margin-top:120px;padding:20px;border:1px solid #888;width:80%"><div style="width:60%;float:left"><p></p><textarea class="duclh-text-input" rows="15" placeholder="Nội dung tin nhắn" style="width:100%;height:50%"></textarea><textarea class="duclh-phones-input" rows="15" placeholder="Danh sách số điện thoại" style="width:100%;height:50%"></textarea><div><button id="duclh-send">Bắt đầu</button><button id="duclh-stop">Tạm dừng</button><button id="duclh-close" style="margin-left:20px">Close</button></div></div><div style="width:30%;float:right;margin-left:10px;color:black"><input id="duclh-input-interval" type="number" style="width: 20%;"> Thời gian chờ mỗi lần gửi tính bằng giây<h3 class="duclh-countdown-info">Nothing todo here</h3><p class="duclh-countdown-sec"></p><p class="duclh-cur-phone-info"></p><p class="duclh-next-phone-info"></p></div></div></div>`

// let defaultPhoneInput = `0931316543
// 0999191919 - done
// 3123134134
// 289382938923
// 457834895789 - fail
// 5343465342563456
// 457834895789
// cloud`;

let defaultPhoneInput = `cloud
cloud
`;



const renderModalWithTwoTextAreas = () => {
  let modal = document.createElement("div");
  modal.innerHTML = TEMPLATE_MODAL;
  document.body.appendChild(modal);
  document.querySelector(".duclh-phones-input").value = defaultPhoneInput.trim();
  document.querySelector(".duclh-text-input").value = originText.trim();

  document.querySelector("#duclh-send").onclick = onStartSending;
  document.querySelector("#duclh-close").onclick = showOrHideModal;
  document.querySelector("#duclh-stop").onclick = pauseSending;
  document.querySelector("#duclh-stop").style.display = "none";

  document.querySelector("#duclh-input-interval").value = countdownConfig.DEFAULT_COUNTDOWN_INTERVAL_SEC;
  document.querySelector("#duclh-input-interval").onchange = (e) => {
    countdownConfig.DEFAULT_COUNTDOWN_INTERVAL_SEC = e.target.value;
  }
}


const renderShowModalButton = () => {
  let btn = document.createElement("button");
  btn.innerHTML = "Zalo Tools";
  btn.style.backgroundColor = "#54d954";
  btn.style.borderRadius = "5px";
  btn.onclick = showOrHideModal;
  document.querySelector("#main-tab > div:nth-child(1) > div.nav__tabs__top").appendChild(btn);
}


const renderSendButtonTest = () => {
  console.log("Init send test button")
  let btn = document.createElement("button");
  btn.innerHTML = "Send Test";
  btn.style.position = "relative";
  btn.style.top = "0";
  btn.style.right = "0";
  btn.style.zIndex = "9999";
  btn.onclick = testPipeline;
  document.querySelector("#main-tab > div:nth-child(1) > div.nav__tabs__top").appendChild(btn);
}

const showOrHideModal = () => {
  let modal = document.querySelector(".duclh-send-modal");
  modal.style.display = isModalShow ? "none" : "block";
  isModalShow = !isModalShow;
}


const startSending = () => {
  console.log("countdownConfig", countdownConfig);
  if (countdownConfig.isCountDownRunning) return; // Nếu đang chạy thì để yên nó chạy tiếp
  countdownConfig.isCountDownRunning = true; // Dùng ở false ở chỗ khác để ngắt
  updateStatus("Đang chạy...");

  countDown();
}

const pauseSending = () => {
  countdownConfig.isCountDownRunning = false;
  updateStatus("Đang tạm dừng");
}

const countDown = () => {
  let onEverySec = setInterval(() => {
    if (!countdownConfig.isCountDownRunning) {
      clearInterval(onEverySec);
      return;
    }
    console.log("🚀 ~ countDown ~ currentSecsRemain", countdownConfig.currentSecsRemain);
    updateStatus("Đang gửi tin nhắn...");
    updateCountdown(`${countdownConfig.currentSecsRemain} giây`);
    countdownConfig.currentSecsRemain = countdownConfig.currentSecsRemain - 1;

    if (countdownConfig.isLastPhoneDone) {
      onAllPhoneDone();

      clearInterval(onEverySec);
      return;
    }

    const ITS_TIME_TO_SEND = countdownConfig.currentSecsRemain < 0 || isFirstTime;
    if (ITS_TIME_TO_SEND) {
      sendZaloMessageToNextPhone();
    }
  }, 1000)
}

const onAllPhoneDone = () => {
  updateStatus("Tất cả đã xong");
  updateCountdown("");
  updateCurPhoneInfo("");
  updateNextPhoneInfo("");

  curPhones = [];
  curPhone = "";
  curText = "";

  isFirstTime = true;
  countdownConfig.isCountDownRunning = false;
  countdownConfig.isLastPhoneDone = false;
}

const isAllPhoneDone = (phones) => {
  // if (countdownConfig.isEnd) return true;
  return phones.every(phone => phone.includes(" - "))
}

const sendZaloMessageToNextPhone = async () => {
  isFirstTime = false;
  for (let i = 0; i < curPhones.length; i++) {
    curPhone = curPhones[i];
    if (curPhone.includes(" - ")) {
      // Nếu phone có dấu hiệu gì đó, thì skip
      countdownConfig.currentSecsRemain = 3;
      continue;
    }

    // Hợp lệ
    // Gửi tin nhắn, cập nhật lại textarea. Break
    updateCurPhoneInfo(curPhone);
    updateNextPhoneInfo(curPhones[i + 1] || "");

    //Gửi TN here
    sendChatPipeline(i);


    //Reset thời gian
    countdownConfig.currentSecsRemain = countdownConfig.DEFAULT_COUNTDOWN_INTERVAL_SEC;
    break;
  }
}

const onStartSending = () => {
  let textInput = document.querySelector(".duclh-text-input")?.value?.trim() || "";
  let phonesInput = document.querySelector(".duclh-phones-input")?.value?.trim() || "";
  console.log("🚀 ~ onStartSending ~ textInput:", { textInput, phonesInput })

  document.querySelector(".duclh-text-input").value = textInput;
  document.querySelector(".duclh-phones-input").value = phonesInput;
  curPhones = getCurrentPhonesValue();

  if (phonesInput === "") {
    updateStatus("Vui lòng nhập số điện thoại")
    return;
  }
  if (textInput === "") {
    updateStatus("Vui lòng nhập nội dung tin nhắn")
    return;
  }

  startSending();
}

const updateStatus = (text) => {
  document.querySelector(".duclh-countdown-info").innerHTML = text;
}

const updateCountdown = (text) => {
  document.querySelector(".duclh-countdown-sec").innerHTML = text;
}

const updateCurPhoneInfo = (phone, isDone = false) => {
  let text = `${phone}: ${isDone ? "Đã xong" : "Đang xử lý"}`;
  if (!phone) text = "";
  document.querySelector(".duclh-cur-phone-info").innerHTML = text;
}

const updateNextPhoneInfo = (phone) => {
  let text = `Tiếp theo: ${phone}`
  if (!phone) text = "";
  document.querySelector(".duclh-next-phone-info").innerHTML = text;
}


const getTextValue = () => {
  let textInput = document.querySelector(".duclh-text-input").value || "";
  return textInput.trim();
};


const getCurrentPhonesValue = () => {
  let phones = [];
  let phonesText = document.querySelector(".duclh-phones-input").value || null;
  if (!phonesText) return [];
  phones = phonesText.split("\n");
  return phones;
};

const getPhonesTosend = (phones) => {
  return phones.filter(phone => !phone.includes(" - "))

}







// ======================== Utils ========================





// ======================== Browser functions ========================
const typeTextToInput = (inputElem, text) => {
  inputElem.focus();
  inputElem.value = text + '0';
  var evt = document.createEvent("HTMLEvents");
  evt.initEvent("change", false, true);
  inputElem.dispatchEvent(evt);
}


const pressBackspace = (element) => {
  var start = element.selectionStart, end = element.selectionEnd, event;

  if (!element.setRangeText) { return; }
  if (start >= end) {
    if (start <= 0 || !element.setSelectionRange) { return; }
    element.setSelectionRange(start - 1, start);
  }

  element.setRangeText("");
  event = document.createEvent("HTMLEvents");
  event.initEvent("input", true, false);
  element.dispatchEvent(event);
}


const parseTextToHtml = (text) => {
  let htmlText = ``;
  let textArr = text.split("\n");
  for (let i = 0; i < textArr.length; i++) {
    let text = textArr[i];
    let newLine = `<div id="input_line_0" class="_endClass_">${text}</div>`;
    if (i === textArr.length - 1) newLine = newLine.replace("_endClass_", "duclh-end");

    htmlText += newLine;
  }

  return htmlText;
}

const pipelineDelay = (fn, plusDelay, args = {}) => {
  return new Promise((resolve, reject) => {
    curDelay += plusDelay;
    setTimeout(() => {
      fn(args);
      resolve();
    }, curDelay)
  })

  // curDelay += plusDelay;
  // setTimeout(() => {
  //   fn(args);
  // }, curDelay)
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const waitForSelector = (selector, sleepMs = 0) => {
  return new Promise((resolve, reject) => {
    let checkExist = setInterval(async () => {
      if (document.querySelector(selector)) {
        clearInterval(checkExist);
        await sleep(sleepMs)
        resolve();
      }
    }, 200);
  });
}





// ======================== Pipeline functions ========================

const searchPhone = () => {
  inputSearchElement.focus();
  typeTextToInput(inputSearchElement, curPhone);
}

const backspaceSearch = () => {
  inputSearchElement.focus();
  pressBackspace(inputSearchElement);
}

const typeTextToChat = ({ originText = "", i }) => {
  inputChatElem = document.querySelector("#richInput");
  let text = document.querySelector(".duclh-text-input").value.trim();
  let htmlText = parseTextToHtml(text);
  inputChatElem.focus();
  inputChatElem.innerHTML = htmlText;
}

const sendChat = ({ i }) => {
  let end = document.querySelector(".duclh-end");
  let event = document.createEvent("HTMLEvents");
  event.initEvent("input", true, false);
  end.dispatchEvent(event);
  document.querySelector("#chat-input-container-id > div.chat-input-container--audit-2023__right-layout > div.normal-buttons-group > div.z--btn--v2.btn-tertiary-primary.medium.chat-box-input-button.--rounded.icon-only.chat-box-input-button").click();

  setTimeout(() => {
    let result = getResult();
    curPhones[i] += " - " + result;
    if (i + 1 === curPhones.length) {
      countdownConfig.isLastPhoneDone = true;
      countdownConfig.isCountDownRunning = false;
    }

    document.querySelector(".duclh-phones-input").value = curPhones.join("\n");

    updateCurPhoneInfo(curPhone, true);

  }, countdownConfig.TIMEOUT_GET_RESULT);

}

const getResult = () => {
  let result = "done";

  let lastText = getLastMessage();
  if (lastText.includes(FAIL_MESSAGE_NOT_FRIEND)) result = "Chưa kết bạn";
  if (lastText.includes(FAIL_MESSAGE_BLOCKED)) result = "Người dùng chặn";

  return result;
}

const getLastMessage = () => {
  let messageNotMe = document.querySelectorAll(".chat-item:not(.me)") || [];
  if (!messageNotMe.length) return "done";

  let lastMessageElem = messageNotMe[messageNotMe.length - 1];
  if (!lastMessageElem.length) return "done";

  let lastMessageSpan = lastMessageElem.querySelectorAll("span.text");
  if (!lastMessageSpan.length) return "done";

  let lastText = "";

  for (let text of lastMessageSpan) lastText += " " + text.innerHTML;
  return lastText;
}

const selectFirstSearchResult = () => {
  document.querySelector("#global_search_list > div > div:nth-child(2) > div").click();
}





// ======================== Pipeline ========================
const main = async () => {
  await waitForSelector("#main-tab > div:nth-child(1) > div.nav__tabs__zalo.web");
  init();
}

const init = () => {
  inputSearchElement = document.querySelector('#contact-search-input');

  renderModalWithTwoTextAreas();
  renderShowModalButton();
  // renderSendButtonTest();
}


const sendChatPipeline = async (i) => {
  pipelineDelay(searchPhone, 0);
  pipelineDelay(backspaceSearch, 300);

  pipelineDelay(selectFirstSearchResult, 700);

  pipelineDelay(typeTextToChat, 500, { originText });
  pipelineDelay(sendChat, 500, { i });
}


const testPipeline = async () => {
  curDelay = 0;
  pipelineDelay(searchPhone, 0, { phone: "cloud" });
  pipelineDelay(backspaceSearch, 300);

  pipelineDelay(selectFirstSearchResult, 700);

  pipelineDelay(typeTextToChat, 500, { originText });
  pipelineDelay(sendChat, 500);

  //Check if blocked
}



main();