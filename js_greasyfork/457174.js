// ==UserScript==
// @name         Diep.io build selector
// @match        *://diep.io/*
// @version      1.4.1
// @description  Allows adding, editing, and deleting builds dynamically and saves them on the go.
// @icon         https://i.imgur.com/pvqsu5e.png
// @license      GNU GPLv3
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-end
// @namespace https://greasyfork.org/users/1003196
// @downloadURL https://update.greasyfork.org/scripts/457174/Diepio%20build%20selector.user.js
// @updateURL https://update.greasyfork.org/scripts/457174/Diepio%20build%20selector.meta.js
// ==/UserScript==

function getBuilds() {
    const savedBuilds = GM_getValue("builds", null);
    return savedBuilds ? JSON.parse(savedBuilds) : [
        { name: "Anni", values: [1, 1, 0, 7, 7, 7, 3, 7] },
        { name: "Glass", values: [0, 0, 0, 7, 7, 7, 7, 5] },
        { name: "Ram", values: [5, 7, 7, 0, 0, 0, 7, 7] },
        { name: "OverLord", values: [0, 5, 0, 7, 7, 7, 0, 7] },
        { name: "Trapper", values: [5, 7, 0, 0, 7, 7, 7, 0] },
        { name: "Necro", values: [0, 0, 0, 7, 6, 7, 6, 7] },
        { name: "Spammer", values: [2, 3, 0, 7, 7, 7, 7, 0] },
        { name: "Tri-Angle", values: [4, 4, 4, 0, 7, 7, 7, 0] },
        { name: "Assassin", values: [2, 3, 0, 7, 7, 7, 3, 4] },
        { name: "Predator", values: [0, 0, 0, 6, 7, 7, 7, 6] },
        { name: "Penta", values: [1, 3, 0, 5, 6, 6, 7, 5] }
    ];
}

function saveBuilds(builds) {
    GM_setValue("builds", JSON.stringify(builds));
    updateBuildMenu(); // Update build menu after saving builds
}

let builds = getBuilds();

function sendCommand(command) {
    input.execute(command);
}

function convertBuildToString(build) {
    return build.values.map((value, index) => (index + 1).toString().repeat(value)).join('');
}

function optimizeBuildString(buildString) {
    const count = new Array(8).fill(0);
    for (let i = 0; i < buildString.length; i++) {
        count[buildString[i] - 1]++;
    }

    let result = "";
    while (result.length < buildString.length) {
        let max = 0;
        let maxValue = null;
        for (let i = 0; i < count.length; i++) {
            if (count[i] > max) {
                max = count[i];
                maxValue = i + 1;
            }
        }
        result += maxValue.toString();
        count[maxValue - 1]--;
    }

    return result;
}

function determineBuildType(values) {
    const damageStats = values[4] + values[5];
    const ramStats = values[1] + values[2];

    if (damageStats > ramStats) {
        return "damage";
    } else if (ramStats > damageStats) {
        return "ram";
    } else {
        return "balanced";
    }
}

function selectBuild(build) {
    const buildType = determineBuildType(build.values);
    const initialPoints = buildType === "damage" ? "65" : buildType === "ram" ? "23" : "";

    const buildString = initialPoints + optimizeBuildString(convertBuildToString(build));
    sendCommand(`game_stats_build ${buildString}`);
    console.log(`Build order: ${buildString}`);
    closeSubmenus();
}

function createButton(label, icon, clickHandler) {
    const button = document.createElement("button");
    button.innerHTML = icon + " " + label;
    button.style.marginTop = "10px";
    button.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    button.style.color = "white";
    button.style.border = "none";
    button.style.cursor = "pointer";
    button.style.padding = "5px 10px";
    button.addEventListener("click", clickHandler);
    return button;
}

function showManageBuildsMenu() {
    let menu = document.querySelector("#manageBuildsMenu");

    if (menu) {
        menu.parentNode.removeChild(menu);
        closeSubmenus();
        return;
    }

    menu = document.createElement("div");
    menu.id = "manageBuildsMenu";
    menu.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: rgba(0, 0, 0, 0.7); border: 1px solid grey; padding: 10px; text-align: center; z-index: 9999; color: white;";

    builds.forEach((build, index) => {
        const buildElement = document.createElement("div");
        buildElement.classList.add("menu-item");
        buildElement.style.cssText = "font-family: sans-serif; display: flex; justify-content: space-between; align-items: center;";

        const buildInfo = document.createElement("span");
        buildInfo.innerHTML = `${build.name}`;
        buildInfo.style.flex = "1";

        const editButton = createButton("", "✎", (event) => {
            event.stopPropagation();
            editBuild(index);
        });

        const deleteButton = createButton("", "⛌", (event) => {
            event.stopPropagation();
            deleteBuild(index);
        });

        buildElement.appendChild(buildInfo);
        buildElement.appendChild(editButton);
        buildElement.appendChild(deleteButton);

        menu.appendChild(buildElement);
    });

    menu.appendChild(createButton("Add New Build", "➕", addNewBuild));
    menu.appendChild(createButton("Close", "➖", () => menu.parentNode.removeChild(menu)));

    document.body.appendChild(menu);
}

function editBuild(index) {
    let buildName = prompt("Enter the new name of the build:", builds[index].name);
    if (!buildName) return;

    let buildValues = prompt("Enter the new build values (e.g., 0/2/3/0/7/7/7/7):", builds[index].values.join('/'));
    if (!buildValues) return;

    buildValues = buildValues.split("/").map(Number);
    if (buildValues.length !== 8) {
        alert("Invalid build values. There must be 8 values.");
        return;
    }

    builds[index] = { name: buildName, values: buildValues };
    saveBuilds(builds);
    showManageBuildsMenu();
    updateBuildMenu(); // Update build menu after editing
}

function deleteBuild(index) {
    if (confirm("Are you sure you want to delete the build ${builds[index].name}?")) {
        builds.splice(index, 1);
        saveBuilds(builds);
        showManageBuildsMenu();
        updateBuildMenu(); // Update build menu after deleting
    }
}

function addNewBuild() {
    let buildName = prompt("Enter the name of the new build:");
    if (!buildName) return;

    let buildValues = prompt("Enter the build values (e.g., 0/2/3/0/7/7/7/7):");
    if (!buildValues) return;

    buildValues = buildValues.split("/").map(Number);
    if (buildValues.length !== 8) {
        alert("Invalid build values. There must be 8 values.");
        return;
    }

    let newBuild = { name: buildName, values: buildValues };
    builds.push(newBuild);
    saveBuilds(builds);
    showManageBuildsMenu();
    updateBuildMenu(); // Update build menu after adding new build
}

function closeSubmenus() {
    document.querySelectorAll("#buildMenu, #manageBuildsMenu, #buildPreview").forEach(menu => menu.parentNode.removeChild(menu));
}

document.addEventListener("keydown", function(event) {
    if (event.key === "r") {
        showBuilds();
        let values = document.querySelector(".build-values");
        if (values) {
            values.parentNode.removeChild(values);
        }
    }
});

function showBuilds() {
    let menu = document.querySelector("#buildMenu");

    if (menu) {
        menu.parentNode.removeChild(menu);
        closeSubmenus();
        return;
    }

    menu = document.createElement("div");
    menu.id = "buildMenu";
    menu.style.cssText = "position: fixed; top: 50%; right: 0%; transform: translate(0, -50%); background-color: rgba(0, 0, 0, 0.7); border: 1px solid grey; padding: 10px; z-index: 9999; color: white;";

    const buildPreview = document.createElement("div");
    buildPreview.id = "buildPreview";
    buildPreview.style.cssText = "position: fixed; bottom: 10px; left: 10px; background-color: rgba(0, 0, 0, 0.5); border: 1px solid grey; padding: 10px; z-index: 10000; color: white; display: none;";
    document.body.appendChild(buildPreview);

    builds.forEach(build => {
        let buildElement = document.createElement("div");
        buildElement.classList.add("menu-item");
        buildElement.innerHTML = build.name;
        buildElement.style.cssText = "cursor: pointer; font-family: sans-serif;";
        buildElement.addEventListener("click", () => {
            selectBuild(build);
            closeSubmenus();
        });
        buildElement.addEventListener("mouseover", () => {
            buildPreview.innerHTML = build.values.join("/");
            buildPreview.style.display = "block";
        });
        buildElement.addEventListener("mouseout", () => {
            buildPreview.style.display = "none";
        });
        menu.appendChild(buildElement);
    });

    const manageBuildsButton = createButton("Manage Builds", "", showManageBuildsMenu);
    menu.appendChild(manageBuildsButton);

    document.body.appendChild(menu);
}

function updateBuildMenu() {
    closeSubmenus();
    showBuilds();
}