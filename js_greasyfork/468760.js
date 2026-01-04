"use strict";
class CultureUI {
  constructor(mainDiv) {
    this.mainDiv = mainDiv;
  }

  createHeading() {
    const heading = document.createElement("h3");
    heading.textContent = "AutoCulture";
    heading.style.color = "Yellow";
    return heading;
  }

  createDropDown(optionValues, name) {
    const dropDown = document.createElement("select");
    dropDown.setAttribute("name", name);

    for (let i = 0; i < optionValues.length; i++) {
      const option = document.createElement("option");
      option.text = optionValues[i];
      dropDown.appendChild(option);
    }

    return dropDown;
  }

  createButton() {
    const button = document.createElement("button");
    button.textContent = "Start";

    button.addEventListener("click", function () {
      let ac = new AutoCulture();
      const dropDown = document.querySelector(
        "select[name='culture-drop-down']"
      );
      const optDropDown = document.querySelector(
        "select[name='option-drop-down']"
      );
      const selectedValue = dropDown.value;
      const selectedOption = optDropDown.value;
      console.log(selectedOption);
      ac.run(selectedOption, selectedValue);
    });

    return button;
  }

  createAutoCultureDiv(name) {
    const autoFarmDiv = document.createElement("div");
    autoFarmDiv.className = name;
    return autoFarmDiv;
  }

  createCultureUI() {
    const optionValues = [
      "Mestský festival",
      "Olympijské hry",
      "Víťazná procesia",
      "Divadelné hry",
    ];

    const optionValues1 = [
      "02:00:00",
      "04:00:00",
      "08:00:00",
      "10:00:00",
      "11:00:00",
      "12:00:00",
    ];

    const heading = this.createHeading();
    const dropDown = this.createDropDown(optionValues, "option-drop-down");
    const dropDown1 = this.createDropDown(optionValues1, "culture-drop-down");
    const button = this.createButton();
    const autoCultureDiv = this.createAutoCultureDiv("auto-culture-options");
    const autoCultureDiv1 = this.createAutoCultureDiv("auto-culture-timer");

    autoCultureDiv.appendChild(dropDown);

    autoCultureDiv1.appendChild(dropDown1);
    autoCultureDiv1.appendChild(button);

    this.mainDiv.appendChild(heading);
    this.mainDiv.appendChild(autoCultureDiv);
    this.mainDiv.appendChild(autoCultureDiv1);
  }
}

"use strict";
class FarmUI {
  constructor(mainDiv) {
    this.mainDiv = mainDiv;
  }

  createHeading() {
    const heading = document.createElement("h3");
    heading.textContent = "AutoFarm";
    heading.style.color = "green";
    return heading;
  }

  createDropDown() {
    const dropDown = document.createElement("select");
    dropDown.setAttribute("name", "farm-drop-down");

    const optionValues = [
      "00:05:00",
      "00:10:00",
      "00:20:00",
      "00:40:00",
      "01:30:00",
      "03:00:00",
      "04:00:00",
      "08:00:00",
    ];

    for (let i = 0; i < optionValues.length; i++) {
      const option = document.createElement("option");
      option.text = optionValues[i];
      dropDown.appendChild(option);
    }

    return dropDown;
  }

  createButton() {
    const button = document.createElement("button");
    button.textContent = "Start";

    button.addEventListener("click", function () {
      let af = new AutoFarm();
      const dropDown = document.querySelector("select[name='farm-drop-down']");
      const selectedValue = dropDown.value;
      af.run(selectedValue);
    });

    return button;
  }

  createAutoFarmDiv() {
    const autoFarmDiv = document.createElement("div");
    autoFarmDiv.className = "auto-farm";
    return autoFarmDiv;
  }

  createFarmUI() {
    const heading = this.createHeading();
    const dropDown = this.createDropDown();
    const button = this.createButton();
    const autoFarmDiv = this.createAutoFarmDiv();

    autoFarmDiv.appendChild(dropDown);
    autoFarmDiv.appendChild(button);

    this.mainDiv.appendChild(heading);
    this.mainDiv.appendChild(autoFarmDiv);
  }
}

"use strict";

class MainUI {
  constructor() {
    this.panel = document.getElementsByClassName(
      "ui_construction_queue instant_buy"
    )[0];
    this.createMainDiv();
    this.addDragFunctionality();
    this.createAutoFarmUI();
  }

  createMainDiv() {
    this.mainDiv = document.createElement("div");
    this.mainDiv.setAttribute("name", "bot-main-div");
    this.mainDiv.style.position = "absolute";
    this.mainDiv.style.left = "0px";
    this.mainDiv.style.top = "0px";
    this.mainDiv.style.width = "300px";
    this.mainDiv.style.height = "500px";
    this.mainDiv.style.backgroundColor = "rgba(0, 0, 10, 0.5)";
    this.mainDiv.style.zIndex = "1000";
    this.mainDiv.style.borderRadius = "10px";
    let parentDiv = this.panel.parentNode;
    parentDiv.insertBefore(this.mainDiv, this.panel);
  }

  addDragFunctionality() {
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    const startDrag = (event) => {
      isDragging = true;
      dragOffsetX = event.clientX - this.mainDiv.offsetLeft;
      dragOffsetY = event.clientY - this.mainDiv.offsetTop;
    };

    const endDrag = () => {
      isDragging = false;
    };

    const drag = (event) => {
      if (isDragging) {
        this.mainDiv.style.left = event.clientX - dragOffsetX + "px";
        this.mainDiv.style.top = event.clientY - dragOffsetY + "px";
      }
    };

    this.mainDiv.addEventListener("mousedown", startDrag);
    this.mainDiv.addEventListener("mouseup", endDrag);
    this.mainDiv.addEventListener("mousemove", drag);
  }

  createAutoFarmUI() {
    let farm = new FarmUI(this.mainDiv);
    farm.createFarmUI();
    let culture = new CultureUI(this.mainDiv);
    culture.createCultureUI();
  }
}

"use strict";

class AutoFarm {
  constructor() {
    this.utils = new Utils();
  }

  async selectVillages() {
    const linkElement = document.querySelector(
      "#overviews_link_hover_menu > div.box.middle.left > div > div > ul > li.subsection.captain.enabled > ul > li.farm_town_overview > a"
    );

    function triggerClickEvent(target) {
      const clickEvent = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      target.dispatchEvent(clickEvent);
    }

    triggerClickEvent(linkElement);
    await this.utils.timeout(889 + this.utils.generateDelay());
  }

  async selectAll() {
    this.utils.waitForElementToAppear(
      "#fto_town_wrapper > div > div.game_header.bold > span.checkbox_wrapper > a",
      (element) => {
        element.click();
      }
    );
    await this.utils.timeout(798 + this.utils.generateDelay());
  }

  async checkTime(seconds) {
    if (
      seconds === 300 ||
      seconds === 1200 ||
      seconds === 5400 ||
      seconds === 14400
    ) {
        this.utils.waitForElementToAppear(
        "#time_options_wrapper > div.time_options_default > div.fto_time_checkbox.fto_" +
          seconds +
          "> a",
        (element) => {
          element.click();
        }
      );
    } else {
        this.utils.waitForElementToAppear(
        "#time_options_wrapper > div.time_options_loyalty > div.fto_time_checkbox.fto_" +
          seconds +
          " > a",
        (element) => {
          element.click();
        }
      );
    }
    await this.utils.timeout(805 + this.utils.generateDelay());
  }

  async collect() {
    this.utils.waitForElementToAppear(
      "#fto_claim_button > div.caption.js-caption",
      (element) => {
        element.click();
      }
    );
    await this.utils.timeout(985);
  }

  async confirm() {
    this.utils.waitForElementToAppear(
      ".window_content.js-window-content > div > div.buttons > div.btn_confirm.button_new > div.caption.js-caption",
      (element) => {
        element.click();
      }
    );
    await this.utils.timeout(1188 + this.utils.generateDelay());
  }

  async close() {
    this.utils.waitForElementToAppear(
      "body > div.ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.ui-draggable.js-window-main-container > div.ui-dialog-titlebar.ui-corner-all.ui-widget-header.ui-helper-clearfix.ui-draggable-handle > button",
      (element) => {
        element.click();
      }
    );
    await this.utils.timeout(1205 + this.utils.generateDelay());
  }

  async repeatFarm() {
    await this.selectVillages();
    await this.selectAll();
    await this.checkTime(this.seconds);
    await this.collect();
    await this.confirm();
    await this.close();
    console.log("Collecting is finished");
  }

  async run(time) {
    console.log(time);
    const seconds = this.utils.convertToSeconds(time);
    console.log(seconds);
    this.seconds = seconds;

    while (true) {
      await this.repeatFarm();

      let delay =
        this.seconds * 1000 + Math.floor(Math.random() * (30000 - 5000) + 5000);
      console.log(delay);
      await this.utils.timeout(delay);
    }
    //await this.repeatFarm();

    //setInterval(this.myFunction, 1000);
  }
}

"use strict";

class AutoCulture {
  constructor() {
    this.utils = new Utils();
  }

  async selectOverview() {
    this.utils.waitForElementToAppear(
      "#overviews_link_hover_menu > div.box.middle.left > div > div > ul > li.subsection.curator.enabled > ul > li.culture_overview > a",
      (element) => {
        element.click();
      }
    );
    await this.utils.timeout(658 + this.utils.generateDelay());
  }

  async confirm() {
    this.utils.waitForElementToAppear("#start_all_celebrations", (element) => {
      element.click();
    });
    await this.utils.timeout(1001 + this.utils.generateDelay());
  }

  async close() {
    this.utils.waitForElementToAppear(
      "body > div.ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.ui-draggable.js-window-main-container > div.ui-dialog-titlebar.ui-corner-all.ui-widget-header.ui-helper-clearfix.ui-draggable-handle > button",
      (element) => {
        element.click();
      }
    );
    await this.utils.timeout(1488 + this.utils.generateDelay());
  }

  async selectOption(opt) {
    let num = 1;
    switch (opt) {
      case "Mestský festival":
        num = 1;
        break;
      case "Olympijské hry":
        num = 2;
        break;
      case "Víťazná procesia":
        num = 3;
        break;
      case "Divadelné hry":
        num = 4;
        break;
    }

    this.utils.waitForElementToAppear(
      "#place_celebration_select",
      (element) => {
        element.click();
      }
    );
    await this.utils.timeout(1488 + this.utils.generateDelay());

    this.utils.waitForElementToAppear(
      "#place_celebration_select_list > div > div:nth-child(" + num + ")",
      (element) => {
        element.click();
      }
    );
    await this.utils.timeout(1488 + this.utils.generateDelay());
  }

  async repeatCulture(opt) {
    await this.selectOverview();
    await this.selectOption(opt);
    await this.confirm();
    await this.close();
    console.log("Culture is being runned.");
  }

  async run(opt, time) {
    console.log(time);
    const seconds = this.utils.convertToSeconds(time);
    console.log(seconds);
    this.seconds = seconds;

    await this.repeatCulture(opt);

    let delay =
      this.seconds * 1000 +
      Math.floor(Math.random() * (900000 - 180000) + 120000);
    console.log(delay);
  }
}

"use strict";

class Utils {
  timeout(delay) {
    return new Promise((r) => setTimeout(r, delay));
  }

  generateDelay() {
    return Math.floor(Math.random() * (601 - 300) + 300);
  }

  convertToSeconds(timeString) {
    const [hours, minutes, seconds] = timeString.split(":");
    const totalSeconds =
      parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
    return totalSeconds;
  }

  waitForElementToAppear(selector, callback, interval = 100, maxAttempts = 10) {
    var attempts = 0;
    var timer = setInterval(function () {
      attempts++;
      var element = document.querySelector(selector);
      if (element || attempts >= maxAttempts) {
        clearInterval(timer);
        if (element) {
          callback(element);
        } else {
          console.log("Element not found within the specified time.");
        }
      }
    }, interval);
  }
}

"use strict";

(function () {
  window.addEventListener("load", function () {
    setTimeout(function () {
      new MainUI();
    }, 2000); // 2000 milliseconds = 2 seconds delay
  });
})();

// ==UserScript==
// @name         Grepolisbot
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Skrašlenie dizajnu tejto peknej prehliadačovej hry
// @author       You
// @match        https://*.grepolis.com/game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grepolis.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468760/Grepolisbot.user.js
// @updateURL https://update.greasyfork.org/scripts/468760/Grepolisbot.meta.js
// ==/UserScript==