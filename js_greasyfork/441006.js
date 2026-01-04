// ==UserScript==
// @name         WK Extra study mover
// @namespace    http://tampermonkey.net/
// @version      0.8.7
// @description  Moves the WaniKani extra study box below the level progress
// @author       Gorbit99
// @include      /^https?:\/\/(www\.)?(preview\.)?wanikani\.com\/?(dashboard)?$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        none
// @license      MIT
// @require      https://greasyfork.org/scripts/441792-cidwwa/code/CIDWWA.js?version=1270274
// @require      https://greasyfork.org/scripts/489759-wk-custom-icons/code/CustomIcons.js?version=1344498
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/441006/WK%20Extra%20study%20mover.user.js
// @updateURL https://update.greasyfork.org/scripts/441006/WK%20Extra%20study%20mover.meta.js
// ==/UserScript==

(() => {
    "use strict";

    const headerObserverConfig = {
        childList: true,
    };

    const headerObserver = new MutationObserver((mutationList) => {
        for (const mutation of mutationList) {
            for (const added of mutation.addedNodes) {
                if (added.id === "LnRHeader") {
                    const progress = document.querySelector(".wk-panel--level-progress");
                    const recentMistakes = document.querySelector(".wk-panel--recent-mistakes");
                    const extraStudy = document.querySelector(".wk-panel--extra-study");
                    const dashboard = document.querySelector(".progress-and-forecast");
                    dashboard.style.gridTemplateRows = "auto auto auto auto";
                    switch (settings.position) {
                        case "none":
                            progress.style.gridRow = settings.goodMojo == "yes" ? "1/5" : "2/5";
                            recentMistakes.style.gridRow = "1";
                            break;
                        case "top":
                            recentMistakes.style.gridRow = "3";
                            extraStudy.style.setProperty("grid-row", settings.goodMojo == "yes" ? "1/4" : "1/3", "important");
                            break;
                        case "above-rm":
                            recentMistakes.style.gridRow = "3";
                            extraStudy.style.setProperty("grid-row", settings.goodMojo == "yes" ? "1/4" : "1/3", "important");
                            break;
                        case "above-lp":
                            recentMistakes.style.gridRow = "1";
                            extraStudy.style.setProperty("grid-row", settings.goodMojo == "yes" ? "1/4" : "2/4", "important");
                            break;
                        case "below-lp":
                            progress.style.gridRow = settings.goodMojo == "yes" ? "1/4" : "2 / 4";
                            recentMistakes.style.gridRow = "1";
                            break;
                        case "above-ib":
                            progress.style.gridRow = settings.goodMojo == "yes" ? "1/4" : "2 / 4";
                            recentMistakes.style.gridRow = "1";
                            break;
                        case "below-ib":
                            progress.style.gridRow = settings.goodMojo == "yes" ? "1/4" : "2 / 4";
                            recentMistakes.style.gridRow = "1";
                            break;
                        case "above-rf":
                            progress.style.gridRow = settings.goodMojo == "yes" ? "1/4" : "3/4";
                            recentMistakes.style.gridRow = "1/3";
                            break;
                        case "below-rf":
                            progress.style.gridRow = settings.goodMojo == "yes" ? "1/5" : "2/5";
                            recentMistakes.style.gridRow = "1";
                            break;
                        case "header":
                            progress.style.gridRow = settings.goodMojo == "yes" ? "1/4" : "2 / 4";
                            recentMistakes.style.gridRow = "1";
                            break;
                    }
                    headerObserver.disconnect();
                }
            }
        }
    });

    const gearIcon = `
    <svg id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M424.5,216.5h-15.2c-12.4,0-22.8-10.7-22.8-23.4c0-6.4,2.7-12.2,7.5-16.5l9.8-9.6c9.7-9.6,9.7-25.3,0-34.9l-22.3-22.1  c-4.4-4.4-10.9-7-17.5-7c-6.6,0-13,2.6-17.5,7l-9.4,9.4c-4.5,5-10.5,7.7-17,7.7c-12.8,0-23.5-10.4-23.5-22.7V89.1  c0-13.5-10.9-25.1-24.5-25.1h-30.4c-13.6,0-24.4,11.5-24.4,25.1v15.2c0,12.3-10.7,22.7-23.5,22.7c-6.4,0-12.3-2.7-16.6-7.4l-9.7-9.6  c-4.4-4.5-10.9-7-17.5-7s-13,2.6-17.5,7L110,132c-9.6,9.6-9.6,25.3,0,34.8l9.4,9.4c5,4.5,7.8,10.5,7.8,16.9  c0,12.8-10.4,23.4-22.8,23.4H89.2c-13.7,0-25.2,10.7-25.2,24.3V256v15.2c0,13.5,11.5,24.3,25.2,24.3h15.2  c12.4,0,22.8,10.7,22.8,23.4c0,6.4-2.8,12.4-7.8,16.9l-9.4,9.3c-9.6,9.6-9.6,25.3,0,34.8l22.3,22.2c4.4,4.5,10.9,7,17.5,7  c6.6,0,13-2.6,17.5-7l9.7-9.6c4.2-4.7,10.2-7.4,16.6-7.4c12.8,0,23.5,10.4,23.5,22.7v15.2c0,13.5,10.8,25.1,24.5,25.1h30.4  c13.6,0,24.4-11.5,24.4-25.1v-15.2c0-12.3,10.7-22.7,23.5-22.7c6.4,0,12.4,2.8,17,7.7l9.4,9.4c4.5,4.4,10.9,7,17.5,7  c6.6,0,13-2.6,17.5-7l22.3-22.2c9.6-9.6,9.6-25.3,0-34.9l-9.8-9.6c-4.8-4.3-7.5-10.2-7.5-16.5c0-12.8,10.4-23.4,22.8-23.4h15.2  c13.6,0,23.3-10.7,23.3-24.3V256v-15.2C447.8,227.2,438.1,216.5,424.5,216.5z M336.8,256L336.8,256c0,44.1-35.7,80-80,80  c-44.3,0-80-35.9-80-80l0,0l0,0c0-44.1,35.7-80,80-80C301.1,176,336.8,211.9,336.8,256L336.8,256z"/></svg>
    `;

    headerObserver.observe(document.head, headerObserverConfig);

    let settings = {
        position: "below-lp",
        style: "normal",
        questionmarks: "yes",
        orientation: "horizontal",
        goodMojo: "no",
    };

    const modal = window.createModal({
        title: "Extra Study Mover Settings",
    });

    const iconStyle = document.createElement("style");
    document.head.append(iconStyle);
    iconStyle.innerHTML = `
      .es-mover-settings__gear svg {
        width: 1.5em;
      }
    `;

    function loadSettings() {
        const storedSettings = window.localStorage.getItem("esMover.settings");
        if (storedSettings) {
            settings = JSON.parse(storedSettings);
            settings.questionmarks ??= "yes";
            settings.orientation ??= "horizontal";
            settings.goodMojo ??= "no";
        }
    }

    function saveSettings() {
        window.localStorage.setItem("esMover.settings", JSON.stringify(settings));
    }

    function injectChanges() {
        if (document.querySelector(".wk-panel--extra-study").childElementCount === 0) {
            requestAnimationFrame(injectChanges);
            return;
        }
        changeOrientation();
        changePosition();
        createSettingsButton();
        populateSettingsModal();
        changeStyling();

        if (settings.questionmarks === "no") {
            removeQuestionmarks();
        }
    }

    function changeStyling() {
        const extraStudy = document.querySelector(".wk-panel--extra-study");
        if (settings.position !== "header") {
            const title = extraStudy.querySelector("h2");
            switch (settings.style) {
                case "normal":
                    break;
                case "only-text":
                    extraStudy.querySelector("img").parentNode.remove();
                    extraStudy.querySelector(".extra-study__info").style.flexBasis = "100%";
                    break;
                case "only-image":
                    extraStudy.querySelector(".extra-study__info p").remove();
                    break;
                case "reduced":
                    extraStudy.querySelector(".extra-study__info p").remove();
                    extraStudy.querySelector("img").parentNode.remove();
                    extraStudy.querySelector(".extra-study__info").style.flexBasis = "100%";
                    break;
                case "minimal": {
                    const items = extraStudy.querySelector(".extra-study__buttons");
                    title.after(items);
                    items.classList.remove("w-full");
                    extraStudy.querySelector(".extra-study").remove();
                    title.parentNode.style.display = "flex";
                    title.parentNode.style.flexDirection = "row";
                    title.parentNode.style.alignItems = "center";
                    title.style.marginBottom = "0";
                    break;
                }
            }
        }
        document.querySelector(".wk-panel--extra-study")
            .classList.add(`es-mover-${settings.style}`);
    }

    function changeOrientation() {
        if (settings.orientation === "horizontal") {
            const extraStudyList = document.querySelector(".extra-study__buttons");
            extraStudyList.style.flexDirection = "row";
            extraStudyList.style.display = "flex";

            const orientationStyleElement = document.createElement("style");
            document.head.append(orientationStyleElement);
            orientationStyleElement.innerHTML = `
         .extra-study__buttons > div{
          margin-bottom: 0 !important;
          margin-top: 0 !important;
          min-width: 0;
          flex: 1 1 0;
          position: relative;
        }

        .extra-study-button__link {
          width: 100%;
        }

        .extra-study__info {
          width: 100%;
        }

        .extra-study-button__tooltip-button {
          position: absolute;
          right: -0.95em;
          bottom: 0.05em;
        }
        `;
            }
        }

    function changePosition() {
        const container = document.querySelector(".progress-and-forecast");
        const extraStudy = document.querySelector(".wk-panel--extra-study");
        const dashboardProgress = document.querySelector(".wk-panel--level-progress");
        const lAndR = document.querySelector(".lessons-and-reviews");
        const srsProgress = document.querySelector(".srs-progress");
        const reviewForecast = document.querySelector(".wk-panel--review-forecast");
        const recentMistakes = document.querySelector(".wk-panel--recent-mistakes");
        extraStudy.classList.add("es-mover");

        if (settings.goodMojo == "yes") {
            recentMistakes.style.display = "none";
        }

        switch (settings.position) {
            case "top":
                container.style.gridTemplateRows = "auto auto auto";
                extraStudy.style.setProperty("grid-row", "1", "important");
                lAndR.style.gridRow = settings.goodMojo == "yes" ? "2/4" : "2/3";
                lAndR.style.marginBottom = "0";
                recentMistakes.style.gridRow = 3;
                break;
            case "above-rm":
                extraStudy.style.setProperty("grid-row", settings.goodMojo == "yes" ? "2/4" : "2", "important");
                recentMistakes.style.gridRow = 3;
                break;
            case "above-lp":
                extraStudy.style.setProperty("grid-row", settings.goodMojo == "yes" ? "2/4" : "3", "important");
                break;
            case "below-lp":
                container.style.marginBottom = "30px";
                dashboardProgress.style.gridRow = settings.goodMojo == "yes" ? "2/4" : "3";
                dashboardProgress.style.marginBottom = "0";
                extraStudy.style.setProperty("grid-row", "4", "important");
                extraStudy.style.marginBottom = "0";
                reviewForecast.style.marginBottom = "0";
                break;
            case "above-ib":
                container.style.gridTemplateRows = "auto auto";
                dashboardProgress.style.gridRow = settings.goodMojo == "yes" ? "2/4" : "3";
                dashboardProgress.style.marginBottom = "0";
                extraStudy.style.marginBottom = "30px";
                lAndR.style.gridRow = "1";
                lAndR.style.marginBottom = "0";
                srsProgress.before(extraStudy);
                break;
            case "below-ib":
                container.style.gridTemplateRows = "auto auto";
                dashboardProgress.style.gridRow = settings.goodMojo == "yes" ? "2/4" : "3";
                dashboardProgress.style.marginBottom = "0";
                extraStudy.style.marginBottom = "30px";
                lAndR.style.gridRow = "1";
                lAndR.style.marginBottom = "0";
                srsProgress.after(extraStudy);
                break;
            case "above-rf":
                container.style.gridTemplateRows = "auto auto auto";
                dashboardProgress.style.gridRow = settings.goodMojo == "yes" ? "2/4" : "3";
                dashboardProgress.style.marginBottom = "0";
                extraStudy.style.gridColumn = "5/span 2";
                extraStudy.style.setProperty("grid-row", "1", "important");
                extraStudy.style.marginBottom = "0";
                lAndR.style.gridRow = "1";
                lAndR.style.marginBottom = "0";
                reviewForecast.style.gridRow = "2/5";
                break;
            case "below-rf":
                container.style.gridTemplateRows = "auto auto";
                dashboardProgress.style.gridRow = settings.goodMojo == "yes" ? "2/5" : "3/5";
                extraStudy.style.gridColumn = "5/span 2";
                extraStudy.style.setProperty("grid-row", "4", "important");
                extraStudy.style.marginBottom = "30px";
                lAndR.style.gridRow = "1";
                lAndR.style.marginBottom = "0";
                reviewForecast.style.gridRow = "1/4";
                reviewForecast.style.marginBottom = "0";
                break;
            case "none": {
                container.style.gridTemplateRows = "auto auto";
                dashboardProgress.style.gridRow = settings.goodMojo == "yes" ? "2/5" : "3/5";
                extraStudy.style.display = "none";
                lAndR.style.gridRow = "1";
                lAndR.style.marginBottom = "0";
                const menus = document.querySelectorAll(".sitemap__section--subsection");
                const settingsMenu = menus[menus.length - 1];
                settingsMenu.querySelector(".sitemap__pages").innerHTML += `
          <li class="sitemap__page" style="cursor: pointer">
            <a class="es-mover-settings">Extra Study Position</a>
          </li>
        `;
                break;
            }
            case "header": {
                const button = window.createButton({
                    englishText: "Extra Study",
                    japaneseText: "エクストラ",
                    color: "#ffb13d",
                    hoverColor: "#ffbf5e",
                    withDropdown: {
                        bgColor: "#f4f4f4",
                    },
                });

                const buttonDropdownStyle = `
          position: relative;
          color: black;
          overflow: visible;
        `;

                const settingsGearStyle = `
          position: absolute;
          top: 2px;
          right: 10px;
          color: var(--color-text);
        `;

                const buttonsContainerStyle = `
          display: flex;
          flex-direction: column;
          padding: 26px 12px 12px;
          gap: 12px;
          margin: 0;
          color: white;
          list-style-type: none;
        `;

                button.setDropdownContent(`
            <div
              class="wk-panel--extra-study es-mover es-mover-header"
              style="${buttonDropdownStyle}"
            >
              <span
                class="es-mover-settings cursor-pointer"
                style="${settingsGearStyle}"
              >
                <span class="es-mover-settings__gear">
                  ${gearIcon}
                </span>
              </span>
              <div style="${buttonsContainerStyle}" class="extra-study-buttons">
              </div>
            </div>
          `);
                const buttonContainer = document.querySelector(".extra-study-buttons");
                [...document.querySelectorAll(".extra-study__buttons > div")]
                    .forEach((button) => {
                    buttonContainer.append(button);
                });

                buttonContainer.classList.add("extra-study__buttons");

                const audioQuizSwitch = document.querySelector("#audio-quiz-switch");
                if (audioQuizSwitch) {
                    buttonContainer.after(
                        document.querySelector("[for=audio-quiz-switch]")
                    );
                    buttonContainer.after(audioQuizSwitch);
                }

                const style = document.createElement("style");
                style.innerHTML = ".wk-panel--extra-study ul > div {margin: 0;}";
                document.head.append(style);

                extraStudy.remove();
                dashboardProgress.style.gridRow = settings.goodMojo == "yes" ? "2/4" : "3";
                dashboardProgress.style.marginBottom = "0";

                break;
            }
        }

        document.querySelector(".wk-panel--extra-study")
            .classList.add(`es-mover-${settings.position}`);
    }

    function createSettingsButton() {
        if (settings.position !== "header" && settings.position !== "none") {
            const title = document.querySelector(".wk-panel--extra-study h2");
            title.style.marginBottom = "0";

            title.outerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: var(--spacing-tight)">
        ${title.outerHTML}
        <div class="es-mover-settings" style="cursor: pointer">
          <span class="es-mover-settings__gear">${gearIcon}</span>
        </div>
      </div>
    `;
        }

        const settingsButton = document.querySelector(".es-mover-settings");
        settingsButton.addEventListener("click", () => modal.toggle());
    }

    function populateSettingsModal() {
        const positionOptions = [
            { value: "top", label: "Top" },
            { value: "above-rm", label: "Above Recent Mistakes" },
            { value: "above-lp", label: "Above Level Progress" },
            { value: "below-lp", label: "Below Level Progress" },
            { value: "above-ib", label: "Above Item Breakdown" },
            { value: "below-ib", label: "Below Item Breakdown" },
            { value: "above-rf", label: "Above Review Forecast" },
            { value: "below-rf", label: "Below Review Forecast" },
            { value: "header", label: "In the header" },
            { value: "none", label: "None" },
        ];

        const positionOptionsHTML = positionOptions.map(option =>
                                                        `<option
      value="${option.value}" 
      ${option.value == settings.position ? "selected" : ""}
    >
      ${option.label}
    </option>`)
        .join("");

        const styleOptions = [
            { value: "normal", label: "Normal" },
            { value: "only-text", label: "Only Text" },
            { value: "only-image", label: "Only Image" },
            { value: "reduced", label: "Reduced" },
            { value: "minimal", label: "Minimal" },
        ];

        const styleOptionsHTML = styleOptions.map(option =>
                                                  `<option
      value="${option.value}" 
      ${option.value == settings.style ? "selected" : ""}
    >
      ${option.label}
    </option>`)
      .join("");

        const questionmarkOptions = [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
        ];

        const questionmarkOptionsHTML = questionmarkOptions.map(option =>
                                                                `<option
      value="${option.value}" 
      ${option.value == settings.questionmarks ? "selected" : ""}
    >
      ${option.label}
    </option>`)
      .join("");

        const orientationOptions = [
            { value: "horizontal", label: "Horizontal" },
            { value: "vertical", label: "Vertical" },
        ];

        const orientationOptionsHTML = orientationOptions.map(option =>
                                                              `<option
      value="${option.value}" 
      ${option.value == settings.orientation ? "selected" : ""}
    >
      ${option.label}
    </option>`)
      .join("");

        const goodMojoOptions = [
            { value: "no", label: "No" },
            { value: "yes", label: "Yes" },
        ];

        const goodMojoOptionsHTML = goodMojoOptions.map(option =>
                                                              `<option
      value="${option.value}"
      ${option.value == settings.goodMojo ? "selected" : ""}
    >
      ${option.label}
    </option>`)
      .join("");

        const buttonsStyle = `
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 3em;
  `;

        modal.setContent(`
    <div class="es-mover-settings-items">
      <div class="control-group flag">
        <label class="flag__item">Extra study panel position</label>
        <select 
          class="flag__asset position-select" 
          value="${settings.position}"
        >
          ${positionOptionsHTML}
        </select>
      </div>
      <div class="control-group flag">
        <label class="flag__item">Extra study style</label>
        <select class="flag__asset style-select" value="${settings.style}">
          ${styleOptionsHTML}
        </select>
      </div>
      <div class="control-group flag">
        <label class="flag__item">Include questionmarks</label>
        <select 
          class="flag__asset questionmark-select" 
          value="${settings.questionmarks}"
        >
          ${questionmarkOptionsHTML}
        </select>
      </div>
      <div class="control-group flag">
        <label class="flag__item">Button orientation</label>
        <select 
          class="flag__asset orientation-select" 
          value="${settings.orientation}"
        >
          ${orientationOptionsHTML}
        </select>
      </div>
      <div class="control-group flag">
        <label class="flag__item">Good Mojo</label>
        <select
          class="flag__asset good-mojo-select"
          value="${settings.goodMojo}"
        >
          ${goodMojoOptionsHTML}
        </select>
      </div>
      <div class="buttons" style="${buttonsStyle}">
        <button class="btn btn-cancel">Cancel</button>
        <button class="btn btn-ok">Ok</button>
      </div>
    </div>
  `);
        const settingsItems = document.querySelector(".es-mover-settings-items");
        const buttons = settingsItems.querySelector(".buttons");

        const positionSelect = settingsItems.querySelector(".position-select");
        const styleSelect = settingsItems.querySelector(".style-select");
        const questionmarkSelect =
              settingsItems.querySelector(".questionmark-select");
        const orientationSelect =
              settingsItems.querySelector(".orientation-select");
        const goodMojoSelect =
              settingsItems.querySelector(".good-mojo-select");

        const okButton = buttons.querySelector(".btn-ok");
        const cancelButton = buttons.querySelector(".btn-cancel");

        okButton.addEventListener("click", () => {
            settings.position = positionSelect.value;
            settings.style = styleSelect.value;
            settings.questionmarks = questionmarkSelect.value;
            settings.orientation = orientationSelect.value;
            settings.goodMojo = goodMojoSelect.value;
            saveSettings();
            location.reload();
        });

        cancelButton.addEventListener("click", () => {
            positionSelect.value = settings.position;
            styleSelect.value = settings.style;
            questionmarkSelect.value = settings.questionmarks;
            orientationSelect.value = settings.orientation;
            goodMojoSelect.value = settings.goodMojo;
            modal.close();
        });
    }

    function removeQuestionmarks() {
        [...document.querySelectorAll(".extra-study-button__tooltip-button")]
            .forEach((button) => {
            button.style.display = "none";
            //button.querySelector(":scope > div").remove();
            //button.querySelector("a, button").style.paddingRight = "12px";
        });
    }

    loadSettings();
    injectChanges();
})();