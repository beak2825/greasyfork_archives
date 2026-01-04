// ==UserScript==
// @name         zenkyo-hoihoi
// @namespace    https://github.com/TwoSquirrels
// @version      0.2
// @description  traQ 用物理 CTF 対策ネタスクリプト
// @author       TwoSquirrels
// @license      MIT
// @match        https://q.trap.jp/*
// @connect      https://q.trap.jp/*
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/511734/zenkyo-hoihoi.user.js
// @updateURL https://update.greasyfork.org/scripts/511734/zenkyo-hoihoi.meta.js
// ==/UserScript==

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class Camera {
  #video = document.createElement("video");
  #canvas = document.createElement("canvas");

  constructor(win = window) {
    this.window = win;
    this.#video.style.position = "absolute";
    this.#video.style.visibility = "hidden";
    document.body.appendChild(this.#video);
  }

  stop() {
    this.#video.remove();
    this.#video = null;
    this.#canvas = null;
  }

  async takePhoto(brightnessThreshold = 0.1, type = undefined, encoderOptions = undefined) {
    this.#video.srcObject = await this.window.navigator.mediaDevices.getUserMedia({ video: true });
    await this.#video.play();
    this.#canvas.width = this.#video.clientWidth;
    this.#canvas.height = this.#video.clientHeight;
    this.#canvas.getContext("2d").drawImage(this.#video, 0, 0, this.#canvas.width, this.#canvas.height);

    const { data } = this.#canvas.getContext("2d").getImageData(8, 8, this.#canvas.width - 8, this.#canvas.height - 8);
    let brightness = 0;
    for (let i = 0; i < data.length; i += 4) {
      brightness += (data[i] * 0.30 + data[i + 1] * 0.59 + data[i + 2] * 0.11) * data[i + 3] / 255 ** 2;
    }
    brightness /= data.length / 4;
    if (brightness < brightnessThreshold) {
      throw new Error(`The brightness of the photo (${brightness}) is less than the threshold (${brightnessThreshold})!`);
    }

    const blob = await new Promise((resolve, reject) =>
      this.#canvas.toBlob((blob) => (blob == null ? reject() : resolve(blob)), type, encoderOptions),
    );
    await this.#video.pause();
    this.#video.srcObject.getTracks().forEach((track) => track.stop());
    return blob;
  }
}

class AFKDetecter extends EventTarget {
  #isAFK = false;
  #timeoutID = 0;

  constructor(timeoutMS = 300000, win = window) {
    super();
    this.window = win;
    this.timeoutMS = timeoutMS;
    ["resize", "blur", "focus", "mousemove", "keydown", "mousedown", "touchstart", "wheel"].forEach((type) => {
      this.window.addEventListener(type, () => this.activate(type));
    });
    this.activate("init");
  }

  stop() {
    clearTimeout(this.#timeoutID);
  }

  get isAFK() {
    return this.#isAFK;
  }

  activate(reason = null) {
    clearTimeout(this.#timeoutID);
    if (this.#isAFK) this.dispatchEvent(Object.assign(new Event("active"), { reason }));
    this.#isAFK = false;
    this.#timeoutID = setTimeout(() => {
      if (this.#isAFK) return;
      this.#isAFK = true;
      this.dispatchEvent(new Event("afk"));
    }, this.timeoutMS);
  }
}

try {
  const camera = new Camera(unsafeWindow);
  const afkDetecter = new AFKDetecter(6000.0, unsafeWindow);
  const getSendButtons = () => [...document.querySelectorAll('[class^="_inputContainer_"] button[class^="_sendButton_"]')];
  const getTextareas = () => [...document.querySelectorAll('[class^="_inputContainer_"] textarea[class^="_textarea_"]')];
  const getMyIconButtons = () => [...document.querySelectorAll('[class^="_selector_"] [class^="_container"] div[role="button"]')];
  let hoihoi = false;
  console.log({ hoihoi });

  const zenkyo = async () => {
    const blob = await camera.takePhoto(0.125, "image/jpeg");
    console.log(blob);
    const formData = new FormData();
    formData.set("file", blob, "webcam.jpg");
    formData.set("channelId", "5ce0fda0-1349-4f26-b26c-1e2e24f267b6"); // gps/times/TwoSquirrels
    const response = await GM.xmlHttpRequest({ method: "POST", url: "/api/v3/files", data: formData });
    console.log({ response });
    const fileInfo = JSON.parse(response.responseText);
    const additionalMessage = `\n\n↓\n\n${unsafeWindow.location.protocol}//${unsafeWindow.location.host}/files/${fileInfo.id}`;

    const textarea = getTextareas()[0];
    textarea.value += additionalMessage;
    textarea.dispatchEvent(new InputEvent("input", { inputType: "insertFromPaste", data: additionalMessage }));
    await wait(10);
    getSendButtons()[0].click();
    console.log({ message: textarea.value });
    hoihoi = false;
    afkDetecter.dispatchEvent(new Event("afk"));
  };

  const hoihoify = () => {
    const sendButtons = getSendButtons();
    while (sendButtons.length > 1) sendButtons.pop().remove();
    const sendButton = sendButtons[0];
    const textareas = getTextareas();
    while (textareas.length > 1) textareas.pop().remove();
    const textarea = textareas[0];
    const myIconButtons = getMyIconButtons();
    while (myIconButtons.length > 1) myIconButtons.pop().remove();
    const myIconButton = myIconButtons[0];
    if (sendButton == null || textarea == null || myIconButton == null) {
      afkDetecter.activate("unloaded");
      return;
    }
    hoihoi = true;

    sendButton.style.display = null;
    const fakeSendButton = sendButton.cloneNode(true);
    fakeSendButton.onclick = (event) => zenkyo();
    sendButton.style.display = "none";
    sendButton.after(fakeSendButton);

    textarea.style.display = null;
    const fakeTextarea = textarea.cloneNode(true);
    fakeTextarea.onbeforeinput = (event) => {
      if (event.inputType !== "insertLineBreak") return;
      if (/^\s*$/.test(fakeTextarea.value)) return;
      event.preventDefault();
      zenkyo();
    };
    fakeTextarea.oninput = async (event) => {
      textarea.value = fakeTextarea.value;
      textarea.dispatchEvent(new InputEvent("input", { inputType: event.inputType, data: event.data }));
      await wait(10);
      fakeSendButton.disabled = sendButton.disabled;
    };
    textarea.style.display = "none";
    textarea.after(fakeTextarea);

    myIconButton.style.display = null;
    const fakeMyIconButton = myIconButton.cloneNode(true);
    fakeMyIconButton.style.transform = "scale(-1, 1)";
    myIconButton.style.display = "none";
    myIconButton.after(fakeMyIconButton);

    fakeMyIconButton.onclick = (event) => {
      fakeSendButton?.remove();
      sendButton.style.display = null;
      fakeTextarea?.remove();
      textarea.style.display = null;
      fakeMyIconButton?.remove();
      myIconButton.style.display = null;
      hoihoi = false;
      console.log({ hoihoi });
    };
  };

  afkDetecter.addEventListener("afk", (event) => {
    hoihoify(); // TODO: 時間指定
    console.log({ hoihoi });
  });
  setInterval(() => {
    if (hoihoi && document.activeElement !== getTextareas()[1]) hoihoify();
  }, 1000);
} catch (error) {
  console.error(error);
}
