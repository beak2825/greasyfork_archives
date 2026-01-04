// ==UserScript==
// @name         AnimeGo Prev Next player
// @name:ru      AnimeGo След. Пред. кнопки для проигрывателя
// @namespace    http://tampermonkey.net/
// @version      0.5.3
// @description  Prev, Next button for player on animego.org
// @description:ru  След., Пред. кнопки для проигрывателя на animego.org.
// @author       You
// @match        https://animego.me/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=animego.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453391/AnimeGo%20Prev%20Next%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/453391/AnimeGo%20Prev%20Next%20player.meta.js
// ==/UserScript==

const VIDEO_SELECTOR = ".video-player-main";
const SERIES_SELECTOR = "select[name='series']";

const $ = selector => document.querySelector(selector);

const seriesElem = $(SERIES_SELECTOR);
const posterImg = $(".anime-poster img");
const fullScreenButton = {
  width: 150,
  height: 80,
  offset: 5
};

function inRange(x, min, max) {
  return (x - min) * (x - max) <= 0;
}

function waitForElm(selector) {
  return new Promise(resolve => {
    if ($(selector)) {
      return resolve($(selector));
    }

    const observer = new MutationObserver(mutations => {
      if ($(selector)) {
        resolve($(selector));
        observer.disconnect();
      }
    });

    observer.observe(document, {
      attributeFilter: ["aria-hidden", "data-focus-method"],
      childList: true,
      subtree: true
    });
  });
}

const appendFixStyle = player => {
  const tStyle = document.querySelector("style");
  tStyle.innerHTML = `
    #video-carousel {
      display: flex !important;
    }
    .tns-liveregion.tns-visually-hidden {
      display: none;
    }
    .video-player .owl-nav, .video-player .tns-controls {
      background: #383838;
      z-index: 9;
    }
    .video-player-online.position-relative iframe::backdrop {
      position: absolute;
      left: 0;
      top: 0;
      width: 0;
      height: 0;
    }
  `;
  player.appendChild(tStyle);
};

const changeSeries = series => {
  $('.video-player-bar-series-list [data-id="' + series + '"]').click();
};

const getOptionInfo = option => {
  if (!option) return undefined;
  return {
    value: option.value,
    text: `<span>${option.textContent}</span>`
  };
};

const getPrevNextSeries = seriesElem => {
  const selected = seriesElem.value;
  const options = Array.from(seriesElem.querySelectorAll("option"));
  const values = options.map(option => option.value);
  const selectedIndex = values.indexOf(selected);
  const prev = getOptionInfo(options[selectedIndex - 1]) || undefined;
  const next = getOptionInfo(options[selectedIndex + 1]) || undefined;
  return { prev, next };
};

const elementExist = element =>
  typeof element != "undefined" && element != null;

const removeElement = element => {
  if (elementExist(element)) {
    element.parentNode.removeChild(element);
  }
};

class Default {
  constructor({ seriesElem, player }) {
    this.seriesElem = seriesElem;
    this.player = player;
    this.updButtons = this.updButtons.bind(this);
    this.getPrevButton = this.getPrevButton.bind(this);
    this.getNextButton = this.getNextButton.bind(this);
    this.appendStyle = this.appendStyle.bind(this);
    this.switchToPrev = this.switchToPrev.bind(this);
    this.switchToNext = this.switchToNext.bind(this);
    this.createContainer = this.createContainer.bind(this);
    this.handleFullScreenButtons = this.handleOnMessages.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.addListeners = this.addListeners.bind(this);

    this.createContainer();
    this.handleOnMessages();
    this.handleSelectChange();
    this.addListeners();
  }

  addListeners() {
    document.addEventListener('keypress', (evt) => {
      const nextKeys = ['n', 'N', 'т', 'T']
      if (nextKeys.includes(evt.key)) {
        this.switchToNext();
      }
      const prevKeys = ['p', 'P', 'з', 'З']
      if (prevKeys.includes(evt.key)) {
        this.switchToPrev();
      }
    })
  }

  switchToPrev() {
    const { prev } = getPrevNextSeries(this.seriesElem);
    changeSeries(prev.value);
    this.updButtons();
  }

  switchToNext() {
    const { next } = getPrevNextSeries(this.seriesElem);
    changeSeries(next.value);
    this.updButtons();
  }

  updButtons() {
    const { prev, next } = getPrevNextSeries(this.seriesElem);
    const container = $(".pn-container");
    const prevElem = container.querySelector(".pn-prev");
    const nextElem = container.querySelector(".pn-next");
    if (prev) {
      if (!elementExist(prevElem)) {
        const prevElemNew = this.getPrevButton();
        container.appendChild(prevElemNew);
      } else {
        prevElem.innerHTML = prev.text;
      }
    } else {
      removeElement(prevElem);
    }
    if (next) {
      if (!elementExist(nextElem)) {
        const nextElemNew = this.getNextButton();
        container.appendChild(nextElemNew);
      } else {
        nextElem.innerHTML = next.text;
      }
    } else {
      removeElement(nextElem);
    }
  }

  getPrevButton() {
    const { prev } = getPrevNextSeries(this.seriesElem);
    if (prev) {
      const prevElem = document.createElement("button");
      const posterImgSrc = posterImg.src;
      prevElem.style.backgroundImage = `url(${posterImgSrc})`;
      prevElem.innerHTML = prev.text;
      prevElem.classList.add("pn-button");
      prevElem.classList.add("pn-prev");
      prevElem.addEventListener("click", () => {
        this.switchToPrev();
      });
      return prevElem;
    }
    return undefined;
  }

  getNextButton() {
    const { next } = getPrevNextSeries(this.seriesElem);
    if (next) {
      const nextElem = document.createElement("button");
      const posterImgSrc = posterImg.src;
      nextElem.style.backgroundImage = `url(${posterImgSrc})`;
      nextElem.innerHTML = next.text;
      nextElem.classList.add("pn-button");
      nextElem.classList.add("pn-next");
      nextElem.addEventListener("click", () => {
        this.switchToNext();
      });
      return nextElem;
    }
    return undefined;
  }

  appendStyle() {
    const tStyle = document.querySelector("style");
    tStyle.innerHTML = `
      .pn-button {
        position: absolute;
        top: calc(50%);
        outline: unset;
        border: 2px solid #fff;
        color: #fff;
        font-size: 16px;
        cursor: pointer;
        padding: 10px 20px;
        min-width: 150px;
        min-height: 60px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 3px;
        transition: all 0.3s;
        z-index: 10;
        box-shadow: rgb(255 255 255 / 0%) 0px 0px 10px;
        opacity: 0.1;

        background-position: center;
        background-size: cover;
        perspective: 1000px;
        perspective-origin: 50% 50%;
        transform: translate(0, -50%);

        display: flex;
        flex-direction: column;
        align-content: center;
        justify-content: center;
        align-items: center;

        & > span {
          margin-top: 4px;
          background: rgba(0, 0, 0, 0.8);
          padding: 2px 10px;
          border-radius: 3px;
        }

        &:after {
          display: flex;
          border: 1px solid white;
          border-radius: 3px;
          width: 32px;
          box-shadow: 0px 8px 12px #000;
          margin-top: 4px;
          text-shadow: 2px 2px rgba(0, 0, 0, 0.2);
          background: rgba(0, 0, 0, 0.8);
          align-content: center;
          justify-content: center;
        }
      }

      .pn-button:hover {
        opacity: 1;
        box-shadow: rgb(255 255 255 / 50%) 0px 0px 10px;

        &:after {
          animation: scale 1s linear infinite;
        }
      }

      .pn-button:hover,.pn-button:focus {
        outline: unset;
      }

      .pn-prev {
        left: 5px;

        &:after{
          content: "P";
        }
      }

      .pn-prev:hover {
        animation: scroll-to-bottom 100s linear infinite;
      }

      .pn-next {
        right: 5px;

        &:after{
          content: "N";
        }
      }

      .pn-next:hover {
        animation: scroll-to-top 100s linear infinite;
      }

      @keyframes scroll-to-top {
        100%{
          background-position: 0px -3000px;
        }
      }

      @keyframes scroll-to-bottom {
        100%{
          background-position: 0px 3000px;
        }
      }

      @keyframes scale {
        0% {
         scale: 1
        }
        100%{
         scale: 0.95
        }
      }
    `;
    this.player.appendChild(tStyle);
  }

  createContainer() {
    const pnContainer = document.createElement("DIV");
    pnContainer.classList.add("pn-container");
    const prev = this.getPrevButton();
    if (prev) pnContainer.appendChild(prev);
    const next = this.getNextButton();
    if (next) pnContainer.appendChild(next);
    this.appendStyle();
    this.player.insertBefore(pnContainer, this.player.firstChild);
  }

  handleOnMessages() {
    window.onmessage = event => {
      if (document.fullscreenElement) {
        if (event.data.title === "click") {
          const { height, width } = window.screen;
          const { clientX, clientY } = event.data.data;
          const targetCoords = {
            y: [
              height / 2 - fullScreenButton.height / 2,
              height / 2 + fullScreenButton.height / 2
            ],
            prevX: [0, fullScreenButton.width + fullScreenButton.offset],
            nextX: [
              width - (fullScreenButton.width + fullScreenButton.offset),
              width
            ]
          };
          const isPrevButton =
            inRange(clientX, targetCoords.prevX[0], targetCoords.prevX[1]) &&
            inRange(clientY, targetCoords.y[0], targetCoords.y[1]);
          const isNextButton =
            inRange(clientX, targetCoords.nextX[0], targetCoords.nextX[1]) &&
            inRange(clientY, targetCoords.y[0], targetCoords.y[1]);
          if (isPrevButton) {
            this.switchToPrev();
          }
          if (isNextButton) {
            this.switchToNext();
          }
        }
      }

      if (event.data.title === "keydown") {
        console.log(event);
      }
    };
  }

  handleSelectChange() {
    // This code looks like a HACK
    // Default select change does'nt work correctly
    // This code now work correctly!
    var element = document.querySelector(".video-player-bar-series-watch");
    var observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === "data-watched-id") {
          setTimeout(() => {
            this.updButtons();
          }, 100);
        }
      });
    });

    observer.observe(element, { attributes: true });
  }
}

waitForElm(VIDEO_SELECTOR).then(player => {
  waitForElm(SERIES_SELECTOR).then(seriesElem => {
    waitForElm(".video-player-main iframe").then(() => {
      new Default({ seriesElem, player });
      appendFixStyle(document.body);
    });
  });
});
