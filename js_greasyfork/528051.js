// ==UserScript==
// @name         Discord Members Extractor
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  DiscordのメンバーIDを取得して、コピーが出来るスクリプトです。
// @author       CTKP
// @match        https://discord.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      You can modify as long as you credit me
// @downloadURL https://update.greasyfork.org/scripts/528051/Discord%20Members%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/528051/Discord%20Members%20Extractor.meta.js
// ==/UserScript==

(function() {
    "use strict";
    function makeElementDraggable(element) {
        element.onmousedown = function(event) {
            event.preventDefault();
            let offsetX = event.clientX - element.getBoundingClientRect().left;
            let offsetY = event.clientY - element.getBoundingClientRect().top;
            function moveAt(pageX, pageY) {
                element.style.left = Math.min(Math.max(0, pageX - offsetX), window.innerWidth - element.offsetWidth) + "px";
                element.style.top = Math.min(Math.max(0, pageY - offsetY), window.innerHeight - element.offsetHeight) + "px";
            }
            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }
            document.addEventListener("mousemove", onMouseMove);
            function onMouseUp() {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            }
            document.addEventListener("mouseup", onMouseUp);
        };
        element.ondragstart = function() {
            return false;
        };
    }
    const originalWidth = "300px";
    const originalHeight = "auto";
    const container = document.createElement("div");
    container.id = "useridContainer";
    container.style.display = "none";
    document.body.appendChild(container);
    container.innerHTML = `
        <div id="useridHeader">
            <h2>Discordメンバー取得拡張機能</h2>
        </div>
        <ul id="userslist"></ul>
        <div id="useridButtons">
            <button id="startButton">
                <img src="data:image/png;base64,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" alt="start icon" />
            </button>
            <button id="copyButton">
                <img src="data:image/png;base64,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EgAAEEgAAEAgAQAAgQQAAAQSAAAQSAAAQCABAACBBAAABBIAABBIAABAIAEAAIEEAAAEEgAAEEgAAEAgAQAAgQQAAAQSAAAQSAAAQCABAACBBAAABBIAABBIAABAIAEAAIEEAAAEEgAAEEgAAEAgAQAAgQQAAAQSAAAQSAAAQCABAACBBAAABBIAABBIAABAIAEAAIEEAAAEEgAAEEgAAEAgAQAAgQQAAAQSAAAQSAAAQCABAACBBAAABBIAABBIAABAIAEAAIEEAAAEEgAAEEgAAEAgAQAAgQQAAAQSAAAQSAAAQCABAACBBAAABBIAABBIAABAIAEAAIEEAAAEEgAAEEgAAEAgAQAAgQQAAAQSAAAQSAAAQCABAACBBAAABBIAABBIAABAIAEAAIEEAAAEEgAAEEgAAEAgAQAAgQQAAAQSAAAQSAAAQCABAACBBAAABBIAABBIAABAIAEAAIEEAAAEEgAAEEgAAEAgAQAAgQQAAAQSAAAQSAAAQCABAACBBAAABBIAABBIAABAIAEAAIEEAAAEEgAAEEgAAEAgAQAAgQQAAAQSAAAQSAAAQCABAACBBAAABBIAABBIAABAIAEAAIEEAAAEEgAAEEgAAEAgAQAAgQQAAAQSAAAQSAAAQCABAACBBAAABBIAABBIAABAIAEAAIEEAAAEEgAAEEgAAEAgAQAAgQQAAAQSAAAQSAAAQCABAACBBAAABBIAABBIAABAIAEAAIEEAAAEEgAAEEgAAEAgAQAAgQQAAAQSAAAQSAAAQCABAACBBAAABBIAABBIAABAIAEAAIEEAAAEEgAAEEgAAEAgAQAAgQQAAAQSAAAQSAAAQCABAACBBAAABBIAABBIAABAIAEAAIEEAAAEEgAAEEgAAEAgAQAAgQQAAAQSAAAQSAAAQCABAACBBAAABBIAABBIAABAIAEAAIEEAAAEEgAAEEgAAEAgAQAAgQQAAAQSAAAQSAAAQCABAACBBAAABBIAABBIAABAIAEAAIEEAAAEEgAAEEgAAEAgAQAAgQQAAAQSAAAQSAAAQCABAACBBAAABBIAABBIAABAIAEAAIEEAAAEEgAAEEgAAEAgAQAAgQQAAAQSAAAQSAAAQCABAACBBAAABBIAABBIAABAIAEAAIEEAAAEEgAAEEgAAEAgAQAAgQQAAAQSAAAQSAAAQCABAACBBAAABBIAABBIAABAIAEAAIEEAAAEEgAAEEgAAEAgAQAAgQQAAKU8bNrltCr8NwoAAAgkAAAgkAAAgEACAAACCQAAypn5Q3YVPgC4EwAAEEgAAFDSjHfaVe7+dwIAAAIJAADKmumOu9Ld/04AAFDaDBtvtc1/JwAAKG/bfz+1y8Ntf/fndlmKAABgBV+3jfivdn2Y9nf+++OrWgQAAKv4e9uQv7Tr4dqd/98/vqpHAACwkv9uG/Pw5/Ht7yh55/9IAACwnJERMPLffSQBAMCS9o161768W/vXLbH57wQAAEtr+/bNG3f7x5fZ+B9N/T/0fdMup7biwADGsbbN4+V7kbSeC4AOkgYMcD9rGzPwCAAAAgkAAAgkAAAgkAAAgEACAAACCQAACCQAACCQAACAQAIAAAIJAAAIJAAAIJAAAIBAAgAAAgkAAAgkAAAgkAAAgEACAAACCQAACCQAACCQAACAQAIAAAIJAAAIJAAAIJAAAIBAAgAAAgkAAAgkAAAgkAAAgEACAAACCQAACCQAACCQAACAQAIAAAJNHQAPm3YJwIGsv+tzAgAAgQQAAAQSAB1837RLgDdZL5iFAACAQAIAAAIJAAAIJAA68VwPeI91gplMHwC+FxXgWNbdDE4AACCQAOjI8R7wO9YHZiMAACCQAOhM5QMvWReYUYkA8IEUgGNYb3M4ARhA7QOPrAfMSgAAQCABMIjqB6wDzKzUs56Kk8nzNMhkvWJ2TgDGM6Egj3nP9ATAYNtNwLd2CYQw76mgXKVWPFbbOVqDDNYoqnACcJCqiwJwOfOcSgTAgSwOsC7zm2pKHvlUn2iO2mAt1iQqcgJwguqLBfCT+UxVAuAkFg2ozzymspIBsMpxVVs8HL1BPQ+rbP6O/3OVfeNXmXyPTEKowdrDKkq/8SYicCRrDisRABMyKWEu1hpWVP7NX3Vi7kxOOJf1hZUJgAJMVDiWdYUESwyAhMn6yKSFMawjpBEAxZnIcBvrBumWGQTJkxngUjZ/HvlJgAAQaKkSdAoA8Hvu/nlqucEgAgB+ZfPnJY8AACDQkkXoFADgJ3f/vGbJE4BtrP/RLgGiWQ/5nVUfAXxrfwKksx7yqqWPhTwKAJI5+uctyw8OEQAksvnznuW/C2CbA5/bJUAE6x6XiChEpwBAEnf/XCJmkIgAIIHNn0tFDRQRAKzM5s814gaLCABWZPPnWpEDRgQAK7H5c4vYQSMCgBXY/LlV9MARAUBlNn/uET94RABQkc2fexlAGxEAVGLzpweDqBEBQAU2f3oxkJ4QAcDMbP70ZDC9IAKAGdn86c2AeoUIAGZi82eE5X8b4C32ybbx27SAU23r0Jd9MWpfQlcG1jucBgBnsPEzmgF2AREAHMnmzxEMsst93Drga7sG6G7b9/fHsm44OIQAuJLTAGAEd/0czYC7kRAAerDxcxYD7w4iALiHzZ8zGXwdCAHgGjZ+ZmAQdiQEgLfY+JmJwTiAEACesvEzI4NyICEA2Wz8zMzgPIAQgCw2fiowSA8mBmBNNn2qMWBPJAagNps+lRm8kxADUINNn1UYyJMSBDAHGz6rMrALEQUwls2eHB8+/A9U1tsZa2z5gQAAAABJRU5ErkJggg==" alt="copy icon" />
            </button>
            <button id="settingsButton">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAqkSURBVHhe7d3Bdho5EIXh2E48C+dkl5x5/1eczGaS2CMZYWMDRt20qm6p/m8D5MwYWlV1Ww0OufmEkJ6KdlfCTdHuIhCKFoza4L9HEMRy226h7059+Kv2GumrIEjrACIM/insBvRRIHFRh3+PENDGVk3bj3YbVvQAmx3prOu2zM6fdj+0sgmoJxqCQBABIGq2MyeXApooiqBZt82EgB7eAwASI5HFzHr232MXoIUdAJAYAQAkRgAAiXE9JmT26/893gfQwQ4ASIwAABIjAIDECAAgMQIASIwAABIjAIDE+DxWRJbfAdjjdwE0sAMAEpsuhXvPpGpnIHYAvqL2zbWmOZi1A6RS0LWvPyqRdb8py/7Y7i+i0jfXCn8QWw2Od0EJAFuz9M21Qr8HsOXQtJ/1sHuEiT0M6JuwwqbXyIX3SPXojbTUbGvscTxbCLkDGD0so38+7NEzp4ULAKuFbs/zZfdoLKtjUmJ4zGb/pqLhMW0m1LbFa4FHb+8iNs4WZl3X0ce1pTA7AM8h8XxurEO/9AkRAAoLGqmo2dEv/eQDQGkh22vZ7KPC+vOq9jCddvhbHv+mH/FdS+m1nCN9raK8gGuv8yI0hacZ13XtMVmQfWERBmVBYaf5l34t9a7vZL1iSvJFRSjoXqnrfbn5tXv0VqTjUPbB8NSP+H63+/IUQ0DuBUUdmsPiMvhjzLDGh8egQOrFMDjIQCkEZF4Iw49MVEJA4kUw/MhIIQTcXwDDj8y8Q8D1yRl+wDcE3J6Y4QdeeYWAy5My/MAxjxAwf0KGHzjPOgRMn4zhBy6zDAGzJ2L4gX5WIRDyOwEBbMMkZTj7A8tZ7ALYAQCJDU8Yzv7AeqN3AewAgMQIACAxAgBIjAAAEiMAgMQIACAxAgBIjAAAEiMAgMT4uwCAKP4uAIChTAKgBBlBAyxgcfavrAaTSwBAkEnK7PFeAHCZ1dm/Mt2al+P62u4COMF6Rkx3ABW7AOA8y7N/ZR4AFSEAHLMe/solACpCAHjlMfyV28dz5Xg/t7tAamUWvrS75jw/n//TboHsfrdbc26XAHtcCiAzr63/nnsAVIQAMvIe/koiACpCwMalpqMONhSGv5IJgOKh9N7Pdh9XGNVchMM2Snm+lZt/do98KQUADbaS19mEeq3jVa9TpAKgoqn6KDVRRd36qNVNLgAqmuk0teY5h/qdplg/1Ya6Kz3k9tmomiiD/x5B8KqUsP6yj1xPyzYWzRN38N+jlrq1lG6wrI1TeuWu3DzuHk3jppRztmPqohzkfFWXmNYsMw7Kk/IgZMUOQES24aC2GmRfGA0yP2rsj0sAR6Un7rMOf1WPvfirPYQDyebLcGaond/uoqDmPtgBOGD4j7EmPhQDYOpGoNHPS7A2cvMmt+AzbwUZ/j70gB0uAYww/P1YKztSCz1r8tPQ69AP47EDGIzhX4+1G48AGIgGvh5rOJZMAMy23St9yy+4bKSs5X27OwWlXmcHMM5/7RbX+9VusTG37dVsZ/xDbFvHoGe2N+xJZy7WRxj+seirba3+oVkLcQkBMBZ9d9ravuv+n1j4yxh+G/TiZb29ePE/YrH7lPWub6iyVjZuS1vyj8t2uBQEH30KUL/DjYbux1rZSfndgmu0GT4bAucC4Ef5/1jkTr3bLWyHNe/XZvnH7tFbR4vYEgML0Iw+6NXl3vfqmwcs6HIMvy96drnDnj28BOC3AoEc6r878ewlCUjS5Tj7a6B3l9v37vNZnwUEctnPPNt+IDE+61+J7b8W+ngddgBAYgQAkBgBsALbfz3UZB0CAEiMAAASIwCAxAiAhbjW1EVtliMAgMQIACAxAgBIjAAAEiMAgMQIACAxAmABPmbCbAgATIWQXoYAABIjAIDECAAgMQIASIwAABIjADAVvhx0GQJgAZoLsyEAgMQIACAxAgBIjAAAEiMAgMQIACAxAmAhPgrURW2WIwCAxAgAIDECAEiMAFiBa0091GQdAgBIjAAAEnv+AkW2T+vwBZQa6N91av+yAwASew4AzmRALvuZf9kBlMd37S46sfX0Rw2WO5z1w0uAx3YLYG4vs3609SdRl9tvp2CLXl3ufa8evQlY/4Pi7/YQwATKTH+vg90evvjozHVTApbLgk6nFhfjcPbvV1qznuhPrtfRDuDAE029yEdriW2x1p3aDJ8Ny+4BJ3EvIzBt0IuX9fbi6oalCKcRAmPRd8eu6blhzZq1UATAWPTVttyadeZCEgJj0DPbk2nU2YpLCGyL/hiDd1PHuW+3uN6XdouNSZ2lSHmcQl+Mww5goNka1wNrOBYBMBgNvB5rN57cFnXWonM5sAx9YIMdgJFZG3oE1sqOXACUgJw2lGjsy1gjW4rDNnUD0ODnzb42ipeBXAI4IASOsSY+JANAMSm31hqeXxYqa5Bh+FV7WnbQMjTFXobAO4Ua+5NuPBpkXtRWAwEgZvYgoKZaeBNQTBuQGetSv2My3fCrk00mmmWe3QC11K2l6pnmc7tNrQ5O1R6G014+Z/0dyb/SLJlKNM1pUXYE1O80xfrJvSCap49aM1G3Pmp1o4km4NVU1GsdpRBQeg/god1ioTqIh9ofb679+Bftj7Hct3brTiaJaCg7585A1MCOyi5A4kXQeMhIIQTcXwDDj8y8Q8D1yRl+wDcEPN8EvGu3QHZuvyTkljyc/YFXXrsAlydl+IFjHiFg/oQMP3CedQhYvwfAL/sAHzOdEdO04ewPXGa5CzB7IoYf6GcVAlaXAKY7DQB9TAaTsz+wnMUuQPUbgQAYGJ4wnP2B9UbvAtgBAIkRAEBiBACQGAEAJEYAAIkRAEBiBACQGAEAJEYAAKKm+FVgi4MAsA47ACAxs7MzfycA6Ge1c2YHACRmen3OLgC4zPJ9M/M36AgB4DzL4a/MA6AiBIBj1sNfuQRARQgArzyGv3ILgIoQAPyGv3INgIoQQGaew1+5B0BFCCAj7+GvJAKgIgSQicLwVzIBUBECyEBl+CupAKiihsBhUQmyMWZY48NjUCAXAFWk4pZ63pebX7tHb0VtUjUfDM1dWeLf7b48teGvJAOgijA8Cwp6Uw7nsd1Hp971naxXTMkGQKVc2LUFjdCsnmZc17XHZEE6ACq1wpZafi03/+4eXUe5aS1tOCAPZUl/tvsSlIe/kg+ASmVQRhUzaxDMvp6jjm9LIb4PQGEhIxQTO/RLvzBfCOK5oFGKiVf0S59Q3whkvbDl6e4jFRNv1doVn9tDE/UJ290QQja3xTWedSFVrlutzLi+1se0hZDfCTh6oSMWEh+jZ04L+6WgIxa8/MiHqIXEZbW2Rf0Yd1P1h7a74YRv9q22dt5FtNiiKpllvb2P41rhA2BvbUFVCrhVQ0YRfd1VXv+1pgmAQz1FVSvg2kaMKur6q73ua00ZABERAPAQ9k1AANcjhYVk2QVw9tfBDgBIjAAAEiMAgMQIACAxAgBIjAAAEiMAhPDxGKwRADBFyGkhAIDECAAgMQIASIzrMUGz/p0Arv/1sAMAEiORRc22C+Dsr4kdgKgyL9PUZqZjmQ2F0fVUBud7ux9dqm87ioRtmbjolwJs/bVRnACihgDDr48CxXFbcuBPuy+tzP1duXncPYIyAiAY9d0AZ/1YKFZQakHA4Ef06dP/9aFdGyzwVu0AAAAASUVORK5CYII=" alt="settings icon" />
            </button>
        </div>
        <div id="settingsContainer" style="display:none;">
            <div class="checkbox-container">
                <input type="checkbox" id="commaDelimiter" name="useridDelimiter" value="comma" />
                <label for="commaDelimiter">IDをカンマで区切る</label>
            </div>
            <div class="checkbox-container">
                <input type="checkbox" id="newlineDelimiter" name="useridDelimiter" value="newline" />
                <label for="newlineDelimiter">IDを改行で区切る</label>
            </div>
            <button id="saveSettings">設定を保存</button>
        </div>

    `;
    const style = document.createElement("style");
    style.innerHTML = `
        @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap");
        #useridContainer {
            position: fixed;
            bottom: 5px;
            right: 5px;
            background: #2f3136;
            color: #ffffff;
            padding: 15px;
            border-radius: 4px;
            z-index: 1000;
            width: ${originalWidth};
            height: ${originalHeight};
            overflow-y: auto;
            font-family: "Roboto", sans-serif;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6);
        }
        #useridHeader h2 {
            margin: 0;
            font-size: 18px;
            text-align: center;
            font-weight: 700;
            color: #ffffff;
        }
        #userslist {
            list-style-type: none;
            padding: 10px;
            margin: 10px 0;
            font-size: 14px;
            max-height: 200px;
            overflow-y: auto;
            color: #bbb;
            line-height: 1.6;
            background-color: #1e2024;
            border-radius: 5px;
        }
        #userslist li {
            padding: 5px 0;
            border-bottom: 1px solid #444;
        }
        #useridButtons {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
        }
        #useridButtons button {
            width: 90px;
            height: 40px;
            border-radius: 4px;
            border: none;
            color: #fff;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;
        }
        #useridButtons button img {
            width: 18px;
            height: 18px;
        }
        #startButton {
            background: #59a558;
        }
        #copyButton {
            background: #655dff;
        }
        #settingsButton {
            background: #545454;
        }
        #useridButtons button:hover {
            opacity: 0.8;
        }
        .checkbox-container {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        input[type="checkbox"] {
            appearance: none;
            width: 24px;
            height: 24px;
            border: 2px solid #ffffff;
            border-radius: 4px;
            background-color: #2f3136;
            display: inline-block;
            position: relative;
            cursor: pointer;
            margin-right: 10px;
            vertical-align: middle;
        }
        input[type="checkbox"]:checked {
            background-color: #655dff;
            border-color: #655dff;
        }
        input[type="checkbox"]:checked::after {
            content: "✔";
            font-size: 18px;
            color: white;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-weight: bold;
        }
        label {
            font-size: 16px;
            color: #ffffff;
            cursor: pointer;
            display: inline-block;
            vertical-align: middle;
        }
        #settingsContainer {
            background: #2f3136;
            color: #fff;
            padding: 15px;
            border-radius: 4px;
            margin-top: 10px;
        }
        #saveSettings {
            width: 270px;
            height: 40px;
            background-color: #808080;
            border-radius: 4px;
            color: #fff;
            font-size: 16px;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 10px;
        }
        #saveSettings:hover {
            background-color: #707070;
        }
        #useridToolbarButton {
            margin-left: 1px;
        }
        #useridToolbarButton img {
            width: 24px;
            height: 24px;
            cursor: pointer;
            transition: opacity 0.2s;
        }
        #useridToolbarButton img:hover {
            opacity: 0.7;
        }
        @media (max-width: 400px) {
            #useridContainer {
                width: 220px;
                height: 300px;
            }
            #useridButtons button {
                width: 70px;
                height: 35px;
            }
        }
    `;
    document.head.appendChild(style);
    makeElementDraggable(container);
    const userslist = document.getElementById("userslist");
    const startButton = document.getElementById("startButton");
    const copyButton = document.getElementById("copyButton");
    const settingsButton = document.getElementById("settingsButton");
    const settingsContainer = document.getElementById("settingsContainer");
    const saveSettingsButton = document.getElementById("saveSettings");
    function saveSettings() {
        const delimiter = document.querySelector("input[name='useridDelimiter']:checked").value;
        GM_setValue("useridDelimiter", delimiter);
        alert("設定が保存されました");
        settingsContainer.style.display = "none";
    }
    function loadSettings() {
        const delimiter = GM_getValue("useridDelimiter", "newline");
        document.querySelector(`#${delimiter}Delimiter`).checked = true;
    }
    const checkboxes = document.querySelectorAll("input[name='useridDelimiter']");
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", function() {
            if (this.checked) {
                checkboxes.forEach(cb => {
                    if (cb !== this) cb.checked = false;
                });
            }
        });
    });
    function GetUsers() {
        return [...new Set(
            [...document.querySelectorAll("img[src*='cdn.discordapp.com/avatars/']")]
                .map(img => img.src.match(/avatars\/(\d+)\//)?.[1])
                .filter(Boolean)
        )];
    }    
    function updateUsersList() {
        const userids = GetUsers();
        const existingUserIDs = new Set([...userslist.children].map(item => item.textContent));
        userids.forEach(userid => {
            if (!existingUserIDs.has(userid)) {
                const listItem = document.createElement("li");
                listItem.textContent = userid;
                userslist.appendChild(listItem);
            }
        });
    }
    function copyUserIDs() {
        const userids = Array.from(userslist.children).map(item => item.textContent);
        const delimiter = GM_getValue("useridDelimiter", "newline");
        let copiedText;
        if (delimiter === "comma") {
            copiedText = userids.join(",");
        } else {
            copiedText = userids.join("\n");
        }
        navigator.clipboard.writeText(copiedText).then(() => {
            alert("IDをコピーしました");
        }).catch(err => {
            alert("コピーできませんでした", err);
        });
    }
    startButton.addEventListener("click", () => {
        userslist.innerHTML = "";
        updateUsersList();
        const observer = new MutationObserver(() => {setTimeout(updateUsersList, 1000);});
        observer.observe(document.body, { childList: true, subtree: true });
    });
    copyButton.addEventListener("click", copyUserIDs);
    settingsButton.addEventListener("click", () => {
        settingsContainer.style.display = settingsContainer.style.display === "block" ? "none" : "block";
    });
    saveSettingsButton.addEventListener("click", saveSettings);
    loadSettings();
    function addToolbarIcon() {
        const toolbar = document.querySelector("[class*='toolbar']");
        if (!toolbar) return;
        if (document.getElementById("useridToolbarButton")) return; 
        const toolbarButton = document.createElement("div");
        toolbarButton.id = "useridToolbarButton";
        toolbarButton.innerHTML = `
            <img src="data:image/png;base64,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" />
        `;
        toolbarButton.style.marginLeft = "10px";
        toolbarButton.addEventListener("click", () => {
            container.style.display = (container.style.display === "none") ? "block" : "none";
        });
        toolbar.appendChild(toolbarButton);
        container.style.display = "none";
    }
    function observeToolbar() {
        const observer = new MutationObserver(() => {
            if (!document.getElementById("useridToolbarButton")) {
                addToolbarIcon();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
    addToolbarIcon();
    observeToolbar();
})();