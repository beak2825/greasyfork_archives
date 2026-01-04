// ==UserScript==
// @name        Super PiP
// @namespace   https://flawcra.cc/
// @match       *://*/*
// @grant       none
// @version     1.1.1-GitHub
// @author      FlawCra
// @license     Apache License 2.0
// @icon    data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZT0iI0Y5RjlGOSI+CiAgPHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNNC41IDQuNWwxNSAxNW0wIDBWOC4yNW0wIDExLjI1SDguMjUiIC8+Cjwvc3ZnPg==
// @description A simple script to add a Picture in Picture button to multiple Sites.
// @downloadURL https://update.greasyfork.org/scripts/461296/Super%20PiP.user.js
// @updateURL https://update.greasyfork.org/scripts/461296/Super%20PiP.meta.js
// ==/UserScript==
const SVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#F9F9F9">
  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
</svg>`;

const SVG64 = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZT0iI0Y5RjlGOSI+CiAgPHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNNC41IDQuNWwxNSAxNW0wIDBWOC4yNW0wIDExLjI1SDguMjUiIC8+Cjwvc3ZnPg==`;

const netflix = () => {
  if (document.querySelector("#popout-btn")) return;
  let data = {};
  data.masterDiv = document.querySelector(`[data-uia="controls-standard"] > div > div:nth-child(3) > div > div:nth-child(3)`)
  if (!data.masterDiv) return;

  data.exampleSpacer = data.masterDiv.querySelector(`[class^="default-ltr-"]`);
  data.spacerClass = data.exampleSpacer.getAttribute("class");
  data.spacerStyle = data.exampleSpacer.getAttribute("style");

  data.exampleIcon = data.masterDiv.querySelector(`.medium`);
  data.iconClass = data.exampleIcon.getAttribute("class");

  data.exampleButton = data.exampleIcon.querySelector("button");
  data.buttonClass = data.exampleButton.getAttribute("class");

  data.exampleButtonDiv = data.exampleButton.querySelector("div");
  data.buttonDivClass = data.exampleButtonDiv.getAttribute("class");
  data.buttonDivRole = data.exampleButtonDiv.getAttribute("role");

  data.buttonDiv = document.createElement("div");
  data.buttonDiv.setAttribute("class", data.buttonDivClass);
  data.buttonDiv.setAttribute("role", data.buttonDivRole);
  data.buttonDiv.innerHTML = SVG;

  data.button = document.createElement("button");
  data.button.setAttribute("class", data.buttonClass);
  data.button.setAttribute("id", "popout-btn");
  data.button.addEventListener("click", () => {
    const videoElement = document.querySelector(`[data-uia="video-canvas"]`).querySelector("video");
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    } else {
      videoElement.requestPictureInPicture();
    }
  });

  data.button.addEventListener("mouseenter", () => {
    data.button.classList.add("active");
  });

  data.button.addEventListener("mouseleave", () => {
    data.button.classList.remove("active");
  });

  data.button.appendChild(data.buttonDiv);

  data.icon = document.createElement("div");
  data.icon.setAttribute("class", data.iconClass);
  data.icon.appendChild(data.button);

  data.spacer = document.createElement("div");
  data.spacer.setAttribute("class", data.spacerClass);
  data.spacer.setAttribute("style", data.spacerStyle);

  data.masterDiv.appendChild(data.spacer);
  data.masterDiv.appendChild(data.icon);
};

matchDomain(`https:\/\/(.*)\.?netflix\.com(.*)`, () => loop(netflix));

const youtube = () => {
  const elem = document.querySelector(".ytp-pip-button");
  if (!elem) return;
  if (elem.style.display == "") return;

  elem.style.display = "";
  elem.innerHTML = SVG;
};

matchDomain(`https:\/\/(.*)\.?youtube\.com(.*)`, () => loop(youtube));

const disneyPlus = () => {
  let data = {};
  data.masterDiv = document.querySelector(".controls__right");
  if (!data.masterDiv) return;

  if(document.pictureInPictureElement && document.pictureInPictureElement != document.querySelector(`[id^="hudson-"].video_view--theater`).querySelector("video")) {
    const videoElement = document.querySelector(`[id^="hudson-"].video_view--theater`).querySelector("video");
    if (videoElement.hasAttribute("disablepictureinpicture")) videoElement.removeAttribute("disablepictureinpicture");
    videoElement.requestPictureInPicture();
    return;
  }

  data.button = data.masterDiv.querySelector(`[data-tooltip="PiP"]`);
  if (data.button) return;

  data.button = document.createElement("button");
  data.button.setAttribute("type", "button");
  data.button.setAttribute("aria-label", "Picture in Picture");
  data.button.setAttribute("class", "control-icon-btn fullscreen-icon tooltip__left");
  data.button.setAttribute("role", "button");
  data.button.setAttribute("data-tooltip", "PiP");
  data.button.addEventListener("click", () => {
    const videoElement = document.querySelector(`[id^="hudson-"].video_view--theater`).querySelector("video");
    if (videoElement.hasAttribute("disablepictureinpicture")) videoElement.removeAttribute("disablepictureinpicture");
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    } else {
      videoElement.requestPictureInPicture();
    }
  });

  data.buttonDiv = document.createElement("div");
  data.buttonDiv.setAttribute("class", "focus-hack-div");
  data.buttonDiv.setAttribute("tabindex", "-1");

  data.buttonDiv.innerHTML = SVG;

  data.button.appendChild(data.buttonDiv);

  data.masterDiv.appendChild(data.button);
};

matchDomain(`https:\/\/(.*)\.?disneyplus\.com(.*)`, () => loop(disneyPlus));

const amazonPrimeVideo = () => {
  let data = {};
  data.masterDiv = document.querySelector(".atvwebplayersdk-hideabletopbuttons-container");
  if (!data.masterDiv) return;
  data.button = data.masterDiv.querySelector(`[data-tooltip="PiP"]`);
  if (data.button) return;

  data.div = document.createElement("div");
  data.div.setAttribute("class", "f1qd5172 f7mv6lt");

  data.span = document.createElement("span");

  data.spandiv = document.createElement("div");
  data.spandiv.setAttribute("class", "fewcsle fcmecz0");

  data.button = document.createElement("button");
  data.button.setAttribute("class", "fqye4e3 f1ly7q5u fk9c3ap fz9ydgy f1xrlb00 f1hy0e6n fgbpje3 f1uteees f1h2a8xb f760yrh f1mic5r1 f13ipev8 atvwebplayersdk-subtitleaudiomenu-button f130s5ag f15v4vpu frcngjs f12ossvl f45h");
  data.button.setAttribute("data-tooltip", "PiP");
  data.button.setAttribute("aria-label", "Picture in Picture");
  data.button.setAttribute("style", "padding: 0px; min-width: 0px;");
  data.button.addEventListener("click", () => {
      const videoElement = document.querySelector(".scalingVideoContainer video");
      if (videoElement.hasAttribute("disablepictureinpicture")) videoElement.removeAttribute("disablepictureinpicture");
      if (document.pictureInPictureElement) {
          document.exitPictureInPicture();
      } else {
          videoElement.requestPictureInPicture();
      }
  });

  data.buttondiv = document.createElement("div");
  data.buttondiv.setAttribute("class", "f45h");

  data.buttondivimg = document.createElement("img");
  data.buttondivimg.setAttribute("class", "fuorrko");
  data.buttondivimg.style.color = "#F9F9F9";
  data.buttondivimg.src = SVG64;

  data.buttondiv.appendChild(data.buttondivimg);
  data.button.appendChild(data.buttondiv);

  data.spandivdiv = document.createElement("div");
  data.spandivdiv.setAttribute("class", "f1wp6x33");

  data.spandivdivdiv = document.createElement("div");
  data.spandivdivdiv.setAttribute("class", "fhjv49j f1svrrcm f1tep9b4 fqlubke");
  data.spandivdivdiv.innerText = "Picture in Picture";

  data.spandivdiv.appendChild(data.spandivdivdiv);
  data.spandiv.appendChild(data.button);
  data.spandiv.appendChild(data.spandivdiv);
  data.span.appendChild(data.spandiv);
  data.div.appendChild(data.span);

  document.querySelector(".atvwebplayersdk-hideabletopbuttons-container").lastChild.remove();

  data.masterDiv.appendChild(data.div);
};

matchDomain(`https:\/\/www\.amazon\.[a-z]{2,3}\/-\/[a-z]{2}\/gp\/video\/detail\/[A-Za-z0-9]+`, () => loop(amazonPrimeVideo));
matchDomain(`https:\/\/www\.amazon\.[a-z]{2,3}\/-\/[a-z]{2}\/dp\/[A-Za-z0-9]+`, () => loop(amazonPrimeVideo));


function loop(func) {
  setInterval(() => {
    func();
  }, 1);
}

function matchDomain(domains, cb) {
  const url = location.href;
  if (typeof domains === 'string') { domains = [domains]; }
  if (domains.some(domain => new RegExp(domain).test(url))) {
    cb();
  }
}

function waitDOMElement(selector, tagName = '', callback, multiple = false) {
  new window.MutationObserver(function (mutations) {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!tagName || (node.tagName === tagName)) {
          if (node.matches(selector)) {
            callback(node);
            if (!multiple) { this.disconnect(); }
          }
        }
      }
    }
  }).observe(document, {
    subtree: true,
    childList: true
  });
}

function removeDOMElement(...elements) {
  for (const element of elements) {
    if (element) { element.remove(); }
  }
}

function removeClassesByPrefix(el, prefix) {
  for (const clazz of el.classList) {
    if (clazz.startsWith(prefix)) {
      el.classList.remove(clazz);
    }
  }
}

function blockElement(selector, blockAlways = false) {
  new window.MutationObserver(function (mutations) {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node instanceof window.HTMLElement) {
          if (node.matches(selector)) {
            removeDOMElement(node);
            if (!blockAlways) {
              this.disconnect(); // Stop watching for element being added after one removal
            }
          }
        }
      }
    }
  }).observe(document, { subtree: true, childList: true });
}
