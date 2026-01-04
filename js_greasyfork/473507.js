// ==UserScript==
// @name         GuardianService auto picker
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  .
// @author       kaemxk
// @match        https://guardian.services/wp-admin/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL v2
// @downloadURL https://update.greasyfork.org/scripts/473507/GuardianService%20auto%20picker.user.js
// @updateURL https://update.greasyfork.org/scripts/473507/GuardianService%20auto%20picker.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function beep() {
        const snd = new Audio(
            "data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU="
        );
        snd.play();
    }

    const allowedPlatforms = JSON.parse(localStorage.getItem("allowed-platforms")) || {
        steam: false,
        playstation: false,
        xbox: false,
    };

    let include = JSON.parse(localStorage.getItem("include")) || [];
    let exclude = JSON.parse(localStorage.getItem("exclude")) || [];

    const requestedOrders = JSON.parse(localStorage.getItem("requested-orders")) || [];

    const ordersTable = document.querySelector("#order_management_table_body");

    const refreshButton = document.querySelector("#oq_orders_submit_refresh");

    let filteredTabs = getFilteredTabs();

    let interval;
    let isTurnedOn = false;

    const delays = [1100, 2600, 4100, 5600, 7100];
    const timeForClick = [0, 1250, 2750, 4250, 5750];
    const timeForParse = [1000, 2500, 4000, 5500, 7000];

    const turnOn = () => {
        if (!isTurnedOn) {
            refreshButton.click();

            filteredTabs = getFilteredTabs();

            let delay = delays[filteredTabs.length - 1];

            interval = setInterval(() => {
                filteredTabs = getFilteredTabs();

                for (let i = 0; i < filteredTabs.length; i++) {
                    setTimeout(
                        () => {
                            filteredTabs = getFilteredTabs();
                            filteredTabs[i].click();

                            if (!filteredTabs.length) {
                                turnOff();
                                turnOn();
                            }
                        },
                        timeForClick[i],
                        i
                    );
                    setTimeout(() => parseOrders([...ordersTable.children]), timeForParse[i]);
                }

                const newDelay = delays[filteredTabs.length - 1];

                if (delay !== newDelay) {
                    turnOff();
                    turnOn();
                }
                if (!filteredTabs.length) {
                    const tabs = getTabs();
                    tabs[0]?.click();
                    turnOff();
                    turnOn();
                }
            }, delay || 1000);

            isTurnedOn = true;

            condition.innerText = "true";
        }
    };

    const turnOff = () => {
        if (isTurnedOn) {
            clearInterval(interval);
            condition.innerText = "false";
            isTurnedOn = false;
        }
    };

    function getFilteredTabs() {
        const tabs = document.querySelectorAll("div.order_queue_status_listing > div > ul > li");
        return [...tabs].filter((el) => !el.innerHTML.match(/carry/gi));
    }

    function getTabs() {
        const tabs = document.querySelectorAll("div.order_queue_status_listing > div > ul > li");
        return [...tabs];
    }

    const parseOrders = (ordersArray) => {
        if (!ordersArray[0].children[0].innerText.includes("No Order Found!")) {
            ordersArray.forEach((order) => {
                const id = order.children[0].querySelector(".text-sm").innerText.slice(1);

                const info = order.children[1].innerText.split("Primary Order Status")[0].toLowerCase();

                const platform = order.children[1]
                    .querySelector(".item-content")
                    .children[0].children[1].innerText.split(" ")[1];

                const isRecovery = Boolean(
                    order.children[1]
                        .querySelector(".item-content")
                        .children[0].children[2].innerText.match(/recovery/gi)
                );

                const isBooster = order.children[3].innerText === "Fastest Available";

                const isNotStreaming = !Boolean(
                    order.children[2].querySelector('[title="Private Streaming"]')
                );

                const pickButton = order.children[8].querySelector(".cursor-pointer");

                if (
                    include.some((v) => info.includes(v)) &&
                    !exclude.some((v) => info.includes(v)) &&
                    !requestedOrders.includes(id) &&
                    allowedPlatforms[platform] &&
                    isNotStreaming &&
                    isRecovery &&
                    isBooster
                ) {
                    requestedOrders.push(id);
                    localStorage.setItem("requested-orders", JSON.stringify(requestedOrders));
                    pickButton.click();
                    beep();
                    turnOff();
                }
            });
        }
    };

    const body = document.body;

    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.display = "flex";
    wrapper.style.backgroundColor = "#f2f2f7";
    wrapper.style.color = "#1c1c1e";
    wrapper.style.border = "1px solid #1c1c1e";
    wrapper.style.borderRadius = "8px";
    wrapper.style.flexDirection = "column";
    wrapper.style.justifyContent = "center";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "10px";
    wrapper.style.padding = "10px";
    wrapper.style.zIndex = "9999999";
    wrapper.style.top = "10px";
    wrapper.style.left = "50%";
    wrapper.style.transform = "translateX(-50%)";

    const buttonWrapper = document.createElement("div");
    buttonWrapper.style.gap = "10px";
    buttonWrapper.style.display = "flex";

    const stopButton = document.createElement("button");
    stopButton.addEventListener("click", turnOff);
    stopButton.innerText = "stop";

    const startButton = document.createElement("button");
    startButton.addEventListener("click", turnOn);
    startButton.innerText = "start";

    const condition = document.createElement("div");
    condition.setAttribute("style", "align-self: center; color: #1c1c1e !important;");
    condition.innerText = !!interval;

    // INCLUDE

    const includeWrapper = document.createElement("div");
    includeWrapper.style.display = "none";
    includeWrapper.style.gap = "10px";
    includeWrapper.style.flexWrap = "wrap";

    const showIncludeButton = document.createElement("button");
    showIncludeButton.innerText = "include";
    showIncludeButton.addEventListener("click", () => {
        if (includeWrapper.style.display === "flex") {
            includeWrapper.style.display = "none";
        } else {
            includeWrapper.style.display = "flex";
        }
    });

    const addIncludeWrapper = document.createElement("div");
    addIncludeWrapper.style.display = "flex";
    addIncludeWrapper.style.gap = "10px";
    addIncludeWrapper.style.flexDirection = "column";

    const addIncludeButton = document.createElement("button");
    addIncludeButton.innerText = "add include";
    addIncludeButton.addEventListener("click", () => {
        if (addIncludeInput.value !== "") {
            include = [...include, addIncludeInput.value.toLowerCase()];
            localStorage.setItem("include", JSON.stringify(include));
            addIncludeInput.value = "";
            includeList.innerText = include.join(", ");
        }
    });

    const addIncludeInput = document.createElement("input");

    addIncludeWrapper.append(addIncludeInput, addIncludeButton);

    const delIncludeWrapper = document.createElement("div");
    delIncludeWrapper.style.display = "flex";
    delIncludeWrapper.style.gap = "10px";
    delIncludeWrapper.style.flexDirection = "column";

    const delIncludeButton = document.createElement("button");
    delIncludeButton.innerText = "delete include";

    const delIncludeInput = document.createElement("input");
    delIncludeButton.addEventListener("click", () => {
        if (include.indexOf(delIncludeInput.value.toLowerCase()) !== -1 && delIncludeInput.value !== "") {
            include.splice(include.indexOf(delIncludeInput.value.toLowerCase()), 1);
            localStorage.setItem("include", JSON.stringify(include));
            includeList.innerText = include.join(", ");
            delIncludeInput.value = "";
        }
    });

    delIncludeWrapper.append(delIncludeInput, delIncludeButton);

    const clearAllIncludes = document.createElement("button");
    clearAllIncludes.innerText = "clear all includes";

    clearAllIncludes.addEventListener("click", () => {
        include = [];
        localStorage.removeItem("include");
        includeList.innerText = include.join(", ");
    });

    const includeList = document.createElement("div");
    includeList.innerText = include.join(", ");
    includeList.setAttribute("style", "flex: 0 0 100%; color: #1c1c1e !important;");

    // EXCLUDE

    const excludeWrapper = document.createElement("div");
    excludeWrapper.style.display = "none";
    excludeWrapper.style.gap = "10px";
    excludeWrapper.style.flexWrap = "wrap";

    const showExcludeButton = document.createElement("button");
    showExcludeButton.innerText = "exclude";
    showExcludeButton.addEventListener("click", () => {
        if (excludeWrapper.style.display === "flex") {
            excludeWrapper.style.display = "none";
        } else {
            excludeWrapper.style.display = "flex";
        }
    });

    const addExcludeWrapper = document.createElement("div");
    addExcludeWrapper.style.display = "flex";
    addExcludeWrapper.style.gap = "10px";
    addExcludeWrapper.style.flexDirection = "column";

    const addExcludeButton = document.createElement("button");
    addExcludeButton.innerText = "add exclude";
    addExcludeButton.addEventListener("click", () => {
        if (addExcludeInput.value !== "") {
            exclude = [...exclude, addExcludeInput.value.toLowerCase()];
            localStorage.setItem("exclude", JSON.stringify(exclude));
            addExcludeInput.value = "";
            excludeList.innerText = exclude.join(", ");
        }
    });

    const addExcludeInput = document.createElement("input");

    addExcludeWrapper.append(addExcludeInput, addExcludeButton);

    const delExcludeWrapper = document.createElement("div");
    delExcludeWrapper.style.display = "flex";
    delExcludeWrapper.style.gap = "10px";
    delExcludeWrapper.style.flexDirection = "column";

    const delExcludeButton = document.createElement("button");
    delExcludeButton.innerText = "delete exclude";

    const delExcludeInput = document.createElement("input");
    delExcludeButton.addEventListener("click", () => {
        if (exclude.indexOf(delExcludeInput.value.toLowerCase()) !== -1 && delExcludeInput.value !== "") {
            exclude.splice(exclude.indexOf(delExcludeInput.value.toLowerCase()), 1);
            localStorage.setItem("exclude", JSON.stringify(exclude));
            excludeList.innerText = exclude.join(", ");
            delExcludeInput.value = "";
        }
    });

    delExcludeWrapper.append(delExcludeInput, delExcludeButton);

    const clearAllExcludes = document.createElement("button");
    clearAllExcludes.innerText = "clear all excludes";

    clearAllExcludes.addEventListener("click", () => {
        include = [];
        localStorage.removeItem("exclude");
        excludeList.innerText = exclude.join(", ");
    });

    const excludeList = document.createElement("div");
    excludeList.innerText = exclude.join(", ");
    excludeList.setAttribute("style", "flex: 0 0 100%; color: #1c1c1e !important;");

    const showPlatformsButton = document.createElement("button");
    showPlatformsButton.innerText = "platforms";
    showPlatformsButton.addEventListener("click", () => {
        if (platformsWrapper.style.display === "flex") {
            platformsWrapper.style.display = "none";
        } else {
            platformsWrapper.style.display = "flex";
        }
    });

    const platformsWrapper = document.createElement("div");
    platformsWrapper.style.display = "none";
    platformsWrapper.addEventListener("click", (e) => {
        e.stopPropagation();
        const target = e.target;

        if (target.id === "checkbox-steam") {
            allowedPlatforms["steam"] = !allowedPlatforms["steam"];
        }

        if (target.id === "checkbox-playstation") {
            allowedPlatforms["playstation"] = !allowedPlatforms["playstation"];
        }

        if (target.id === "checkbox-xbox") {
            allowedPlatforms["xbox"] = !allowedPlatforms["xbox"];
        }

        localStorage.setItem("allowed-platforms", JSON.stringify(allowedPlatforms));
    });

    const pcLabel = document.createElement("label");
    pcLabel.innerText = "steam";
    pcLabel.setAttribute("style", "color: #1c1c1e !important;");

    const pcCheckbox = document.createElement("input");
    pcCheckbox.checked = allowedPlatforms["steam"];
    pcCheckbox.style.marginLeft = "5px";
    pcCheckbox.setAttribute("type", "checkbox");
    pcCheckbox.setAttribute("id", "checkbox-steam");

    pcLabel.append(pcCheckbox);

    const playstationLabel = document.createElement("label");
    playstationLabel.innerText = "playstation";
    playstationLabel.setAttribute("style", "color: #1c1c1e !important;");

    const playstationCheckbox = document.createElement("input");
    playstationCheckbox.checked = allowedPlatforms["playstation"];
    playstationCheckbox.style.marginLeft = "5px";
    playstationCheckbox.setAttribute("type", "checkbox");
    playstationCheckbox.setAttribute("id", "checkbox-playstation");

    playstationLabel.append(playstationCheckbox);

    const xboxLabel = document.createElement("label");
    xboxLabel.innerText = "xbox";
    xboxLabel.setAttribute("style", "color: #1c1c1e !important;");

    const xboxCheckbox = document.createElement("input");
    xboxCheckbox.checked = allowedPlatforms["xbox"];
    xboxCheckbox.style.marginLeft = "5px";
    xboxCheckbox.setAttribute("type", "checkbox");
    xboxCheckbox.setAttribute("id", "checkbox-xbox");

    xboxLabel.append(xboxCheckbox);

    platformsWrapper.append(pcLabel, playstationLabel, xboxLabel);

    includeWrapper.append(addIncludeWrapper);
    includeWrapper.append(delIncludeWrapper);
    includeWrapper.append(clearAllIncludes);
    includeWrapper.append(includeList);

    excludeWrapper.append(addExcludeWrapper);
    excludeWrapper.append(delExcludeWrapper);
    excludeWrapper.append(clearAllExcludes);
    excludeWrapper.append(excludeList);

    buttonWrapper.append(stopButton);
    buttonWrapper.append(startButton);

    wrapper.append(condition);
    wrapper.append(buttonWrapper);
    wrapper.append(showIncludeButton);
    wrapper.append(includeWrapper);
    wrapper.append(showExcludeButton);
    wrapper.append(excludeWrapper);
    wrapper.append(showPlatformsButton);
    wrapper.append(platformsWrapper);

    body.append(wrapper);
})();
