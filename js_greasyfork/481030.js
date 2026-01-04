// ==UserScript==
// @name         Task loop tool
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  Useful programmer tool
// @author       You
// @match        *://*/*
// @icon         https://i.ibb.co/pvv9522/Icon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481030/Task%20loop%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/481030/Task%20loop%20tool.meta.js
// ==/UserScript==

//(function() {
//    'use strict';
function newElement(type, propertys, parent) {
    let id = null;
    let className = null;
    let type1 = null;
    if (type.indexOf("#") !== -1 && type.indexOf(".") !== -1) {
        if (type.indexOf("#") < type.indexOf(".")) {
            type1 = type.slice(0, type.indexOf("#"));
            id = type.slice(type.indexOf("#") + 1, type.indexOf("."));
            className = type.slice(type.indexOf(".") + 1);
        } else {
            type1 = type.slice(0, type.indexOf("."));
            className = type.slice(type.indexOf(".") + 1, type.indexOf("#"));
            id = type.slice(type.indexOf("#") + 1);
        }
    } else if (type.indexOf("#") !== -1 && type.indexOf(".") == -1) {
        type1 = type.slice(0, type.indexOf("#"));
        id = type.slice(type.indexOf("#") + 1);
    } else if (type.indexOf("#") == -1 && type.indexOf(".") !== -1) {
        type1 = type.slice(0, type.indexOf("."));
        className = type.slice(type.indexOf(".") + 1);
    };
    let result = null;
    if (type1 !== null) result = document.createElement(type1);
    else result = document.createElement(type);
    for (let name in propertys) {
        result[name] = propertys[name];
    }
    if (id !== null) result.id = id;
    if (className !== null) result.className = className;
    parent.appendChild(result);
    return result;
}

function cpush(varName, value) {
    return value;
}

function newWindow(width, height, callback, appname, property) {
    function returnIf(condition, iftrue, iffalse) {
        if (condition) return iftrue;
        else return iffalse;
    }
    let tab = cpush('tab', document.createElement("div"));
    tab.style = "box-sizing: border-box; box-shadow: white 0 0 0 1px; position: absolute; width: 0px; height: 0px; min-height: fit-content;";
    if (property.maxSize == undefined) {
        let randomX = Math.floor(Math.random() * (window.innerWidth - width));
        let randomY = Math.floor(Math.random() * (window.innerHeight - (height + 35)) + 35);
        tab.style.left = randomX + "px";
        tab.style.top = randomY + "px";
    } else {
        width = window.innerWidth;
        height = window.innerHeight;
    };
    if (property.transition == false) tab.style.width = width + "px";
    if (height == "fit-content") tab.style.height = "fit-content";
    if (width == "fit-content") tab.style.width = "fit-content";
    document.body.appendChild(tab);

    let tabBar = document.createElement("div");
    tabBar.style = "height: 35px; background-color: black; width: 100%; color: white; font-family: monospace; font-size: 19px; display: flex; justify-content: space-between; align-items: center; padding-left: 40px; box-sizing: border-box;";
    tabBar.innerHTML = appname.constructor.name == "String" ? appname : appname[1];
    tab.appendChild(tabBar);
    let tabBody = document.createElement("div");
    tabBody.style = "overflow-y: auto; height: " + (returnIf((property.maxSize == undefined), height, window.innerHeight) - 35) + "px; background-color: rgba(20, 20, 20); width: 100%; padding: 16px; box-sizing: border-box;";
    tab.appendChild(tabBody);
    let tabClose = document.createElement("div");
    tabClose.style = "user-select: none; font-family: 'Source Code Pro', monospace; cursor: pointer; color: white; height: 35px; background-color: black; width: 50px; float: right; align-items: center; display: flex; justify-content: center;";
    tabClose.innerText = "x";
    tabClose.onclick = function () {
        document.body.removeChild(tab);
    }
    tabClose.onmouseover = function () {
        this.style.backgroundColor = "red";
    }
    tabClose.onmouseout = function () {
        this.style.backgroundColor = "black";
    }
    tabBar.appendChild(tabClose);

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    tabBar.addEventListener("mousedown", function (event) {
        if (property.drag == undefined) {
            isDragging = true;
            offsetX = event.clientX - tab.offsetLeft;
            offsetY = event.clientY - tab.offsetTop;

        }
    });

    let newPosX;
    let newPosY;
    let maxX;
    let maxY;
    document.addEventListener("mousemove", function (event) {
        if (isDragging) {
            event.preventDefault();
            newPosX = event.clientX - offsetX;
            newPosY = event.clientY - offsetY;
            maxX = (window.innerWidth - tab.offsetWidth) + (width - 50);
            maxY = (window.innerHeight - tab.offsetHeight) + (height - 35);
            tab.style.left = newPosX + "px";
            tab.style.top = newPosY + "px";
        }
    });

    document.addEventListener("mouseup", function (event) {
        isDragging = false;
    });


    let duration = cpush('duration', 500);
    let startTime = cpush('startTime', null);
    let startWidth = cpush('startWidth', 0);
    let startHeight = cpush('startHeight', 0);
    function animate(timestamp) {
        if (!startTime) {
            startTime = timestamp;
            startWidth = 0;
            startHeight = 0;
        }
        let progress = timestamp - startTime;
        if (progress > duration) {
            progress = duration;
        }
        let ratio = progress / duration;
        let newWidth = startWidth + (returnIf((property.maxSize == undefined), width, window.innerWidth) - startWidth) * ratio;
        let newHeight = startHeight + (height - startHeight) * ratio;
        tab.style.width = newWidth + "px";
        tab.style.height = newHeight + "px";
        if (progress < duration) {
            window.requestAnimationFrame(animate);
        }
    }
    if (property.transition !== false) window.requestAnimationFrame(animate);

    callback(tab, tabBar, tabBody, tabClose);

    window.addEventListener("resize", () => {
        if (property.maxSize !== undefined) {
            tab.style.width = window.innerWidth + "px";
        }
    })
}

window.task = (callback, taskCount) => {
    newWindow(400, "fit-content", (tab, tabBar, tabBody, tabClose) => {
        tab.style.position = "absolute";
        tab.style.zIndex = "100000";
        tab.style.left = "10px";
        tab.style.top = "10px";
        let progress = 0;
        let count = 0;
        let progressInfos = newElement("p", { "style": "word-wrap: break-word; color: white; font-family: monospace; margin-top: 0px;" }, tabBody);
        var parent = document.createElement("div");
        parent.style = "border: 1px solid white;";
        tabBody.appendChild(parent);
        let progressBarDiv = newElement("div", { "style": "width: 100%; height: 25px; border: 1px white solid; box-sizing: border-box;" }, tabBody)
        let progressBar = newElement("div", { "style": `width: ${progress}%; height: 100%; background: linear-gradient(to right, #004800, rgb(0, 167, 0));` }, progressBarDiv)
        let lastTime = Date.now();
        let delay = 1000;
        let minDelay = delay;
        let maxDelay = 0;
        let data = [];

        let graphic = document.createElement('canvas');
        graphic.width = parent.offsetWidth;
        graphic.height = 80;

        let context = graphic.getContext('2d');

        function refreshGraphic() {
            let columnHeight = data[data.length - 1] * 1.5;
            let columnWidth = (parent.offsetWidth / taskCount);
            context.fillStyle = "rgb(0, 167, 0)";
            context.fillRect((data.length - 1) * columnWidth, graphic.height, columnWidth, 0 - columnHeight);
        }

        parent.appendChild(graphic); // ajout du graphique au parent
        let backup1 = tabClose.onclick;
        tabClose.onclick = () => {
            backup1();
            count = taskCount - 1;
        };
        let start = Date.now();
        function getTime(ms) {
            let hours = Math.floor(ms / 3600000);
            let minutes = Math.floor((ms % 3600000) / 60000);
            let seconds = Math.floor(((ms % 3600000) % 60000) / 1000);
            let milliseconds = Math.floor(((ms % 3600000) % 60000) % 1000);

            let hourText = hours.toString().padStart(2, '0');
            let minuteText = minutes.toString().padStart(2, '0');
            let secondText = seconds.toString().padStart(2, '0');
            let millisecondText = milliseconds.toString().padStart(3, '0');

            return hourText + ':' + minuteText + ':' + secondText + ':' + millisecondText;
        }
        let timeLeftEstimed = 0;
        let loop = () => {
            setTimeout(() => {
                delay = Date.now() - lastTime;
                data.push(delay);
                refreshGraphic();
                if (delay < minDelay) minDelay = delay;
                if (delay > maxDelay) maxDelay = delay;
                let info = "";
                let send = (message) => {
                    info = message;
                };

                callback();
                count++;
                progress = (count / taskCount) * 100;
                progressBar.style.width = `${progress}%`;
                timeLeftEstimed = 0;
                data.forEach(localDelay => {
                    timeLeftEstimed += localDelay;
                });
                timeLeftEstimed /= data.length;
                timeLeftEstimed *= (taskCount - count);
                progressInfos.innerHTML = `Tasks running in progress : ${Math.round(progress * 100) / 100}%<br>Delay : ${delay}ms.<br>Max delay : ${maxDelay}, min delay : ${minDelay}.<br>Time passed : ${getTime(Date.now() - start)}.<br><br>Time left estimed : ${getTime(timeLeftEstimed)}.<br><br>Tasks left : ${taskCount - count}.<br><br>${info}`;
                if (count == taskCount) {
                    progressInfos.innerHTML = `Tasks completed !<br><br>` + progressInfos.innerHTML;
                } else {
                    loop();
                }
                lastTime = Date.now();
            }, 20);
        };
        loop();
    }, "TASK", { "transition": false })
};
//})();