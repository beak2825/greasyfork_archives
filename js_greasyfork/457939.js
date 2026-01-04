// ==UserScript==
// @name        WEBTOON Comic Size Slider
// @namespace   https://github.com/gudine
// @match       https://www.webtoons.com/*/viewer
// @grant       GM_getValue
// @grant       GM_setValue
// @version     1.0
// @author      Gudine
// @description Adds a slider to WEBTOON comic pages to change the comic's size
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457939/WEBTOON%20Comic%20Size%20Slider.user.js
// @updateURL https://update.greasyfork.org/scripts/457939/WEBTOON%20Comic%20Size%20Slider.meta.js
// ==/UserScript==


window.addEventListener("load", () => {
  const style = document.createElement("style");
  document.head.appendChild(style);

  style.textContent = `
    .tool_area .size_slider {
      position: absolute;
      top: 0;
      right: 17%;
      z-index: 100;
      width: 300px;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }

    .tool_area .size_slider input[type="range"] {
      width: 250px;
    }

    .viewer_lst .viewer_img {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .viewer_lst .viewer_img img{
      min-width: initial;
      max-width: initial;
    }

    .en #wrap, .es #wrap, .fr #wrap {
      min-width: 1240px;
    }
  `;

  let sliderValue = GM_getValue("slider", "70");
  const toolbar = document.getElementById("toolbar");

  const sliderDiv = document.createElement("div");
  sliderDiv.className = "size_slider";
  sliderDiv.id = "_toolBarSizeSlider";

  const slider = document.createElement("input");
  slider.type = "range";
  slider.id = "_toolBarSizeSliderInput";
  slider.name = "size";
  slider.min = 10;
  slider.max = 100;
  slider.step = 10;
  slider.value = sliderValue;

  const sliderLabel = document.createElement("label");
  sliderLabel.htmlFor = "_toolBarSizeSliderInput";

  function changeComicSize(size) {
    const imageDiv = document.querySelector(".viewer_lst .viewer_img");
    const images = document.querySelectorAll(".viewer_lst .viewer_img img");

    const viewHeight = document.documentElement.clientHeight;
    const { y, height } = imageDiv.getBoundingClientRect();
    const imageDivTop = y + document.documentElement.scrollTop;
    let currCenter = -y + viewHeight / 2;
    let carryoverHeight = 0;
    if (currCenter < 0) {
      carryoverHeight = currCenter;
      currCenter = 0;
    } else if (currCenter > height) {
      carryoverHeight = currCenter - height;
      currCenter = height;
    }
    const newCenter = currCenter * (size / sliderValue);
    const newTop = newCenter - viewHeight / 2;

    for (let image of images) {
      image.style.width = `${size}%`;
      image.style.height = `${size}%`;
    }

    void(document.documentElement.offsetHeight); // Reflow

    scrollTo({ top: newTop + imageDivTop + carryoverHeight, behavior: "auto" });

    sliderLabel.textContent = `${size}%`;
    GM_setValue("slider", size);
    sliderValue = size;
  }

  slider.addEventListener("input", (ev) => changeComicSize(ev.target.value));

  sliderDiv.appendChild(slider);
  sliderDiv.appendChild(sliderLabel);
  toolbar.appendChild(sliderDiv);

  changeComicSize(sliderValue);
});
