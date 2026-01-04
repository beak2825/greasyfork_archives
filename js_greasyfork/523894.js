// ==UserScript==
// @name         Typhacker (new UI)
// @namespace    http://tampermonkey.net/
// @version      3.2BETA
// @license      MIT
// @description   !!!TOGGLE ELEMENTS BEFORE TYPING!!! (Automates typing in Typewriter with a UI)
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAYCAYAAADkgu3FAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAGdYAABnWARjRyu0AAATISURBVEhLnVZJbBxFFH3V3dMztifeJnGwnQXkeCIlJyRAHDhgCSRAcCBhiRCIC2I5cEAEKTeLY+CCwo1IHBAcjKKwRRghEDigAEJwQYjEwVa8Rsl4X6ane3rh/arpmbHxgfDlr+qp///7a1VZPfrUy8mh+05gcXEBZT+CpRTAv/9CopY0rZr4EScJWjIWugsFTFwagb9WgnrtzPeJVxxEznWRbW9DEsdQ4uyWybijDyjLhr+xCT8IkbvyF7CyBmuhVEIumwGiKsKyR67U18i7BdY2hqsbG0A1YPA2FhYWMDc/C0vKlWvPw2ZGlm3DcoQdgN8JI4uUpTm2yLLuwCKvsgpiJ/aSnJ3JIJtv1e1YXfdhWZZCHMVMWdJucCuT7MoqFDsdHNhlo7fVRl9+Zx7osHGYeilJwERBzDYIvm1bsEQgPUn7kn5nbYWco9BOh3mubRmFPBvczK2yLzquhU6y9DftscClmEJOOmG6iaIQBtwE3ri3gAzLlarKJOma6FhZmiYQoYBVGT37FuzCPvQ8+Dw3gprEEJHEwGQhJcs6jJTRMm94noc/xydQWl5FJNqUsxLaScX3cXniGiZm5rFJPdFP4qgxtTqwBjFf2UgoTBDFCfras7i9uwUuG7u2WcbTrw9j9NJvki4qYaTrLgFNzlzHi8Nv49TpM1heWYWbcZi1AdWQOoEG1TNKEk4Nv1eDBKVyiE++/RGjP/yKwf39WA4ULs5V4FUlWjFRyHCqCpyqnkNH8c3vV3D+6zF9fhQHQQLfTnoYhCQKi1lthqCzGGc/+hjnv/wKbuhh6uYKxqYrKAeRdqKJa1DxoLr7ceHiL3jvgw8ReutIAu6Jyr9KVyNjT2OWx48Vjjz5KoqPv4I9j7yEruKdyKPCsZVKGwBZtdMoxMGhYzj6zEnsfegFdN79MOLAJ3IdWlPjV81Q+hSSZXqc3fuR6xuA1daJkAFINGlG9ZWAdsde6h5A7rY74Hb16qEQ3WZqOGoCEI6rFcO+h4RRa+Bt5RCSzGIeibo+v3fS3ZKRGKVMlzSw4MippqHeE4BtlAZmhsQMSk1g1hrVHWkH+hzIGus9McrK3SdaItcH9v9RzREheBItGU+JTnYIzNajw1Vw5T6UDLeNrbhOyVRhB5IANZYmkz5vWK5GIAdTlLI8Frz2RAWKZ60ZULuuAZmSGZnWSdUkcME2v2rgYiTmPHRy0rtyDu7qcbGnxUY1oiWDMIAGLGSpHV0JcSgolPFD6xg1uSR1O7Y4SiMTtmnsMpVCzuItrlW0XDLV1xC3bAbEq7F+z2lvtBU9rSBUw91SOh0JNxV5gG/QkS4HRb41x4odeHNoH/p5D0p5hQ8f7Men77+L088+gPwfFzB57h194Qp+HIlTg8yI9UHXjtJsNMtvcjmMsVSJMLURY/zGCv6emsXV6XmMT82ZdXoOV67N4/LkDLyKTzxza0jFJOCk1uvUoTp+aiQZfOIxvvNlCjmGLIcoVvm+SImiXDuWfv4CSz99Dqetg4Zm9IUEVHBac1lk+K9A7/GT2l4oDkNkeOleHfkM67PXoZ4bPpfsHrofSbUKiwNgymhABMbOuPBvTsO/MQXl8LkV5NRDjSI5f1x3Fe8xMgJEfK/Ap2bxuzHal/APSD6C85Hx/ZAAAAAASUVORK5CYII=
// @author       random russian guy
// @match        https://sg.typewriter.ch/index.php?r=typewriter/runLevel
// @match        https://sg.typewriter.ch/index.php?r=typewriter/resumeLevel
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523894/Typhacker%20%28new%20UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/523894/Typhacker%20%28new%20UI%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let typingEnabled = false;
    let typingTimer = null;
    let speed = 100;
    let elementsHidden = false;


    const elementsToToggle = [
        "#hud_info",
        "#hud_top1",
        "#hud_top2",
        ".keyboard",
        'img[height="325"][width="980"][src="/assets/65968696/images/tastatur_background.svg"]'
    ];


    function toggleElementsVisibility() {
        elementsHidden = !elementsHidden;
        elementsToToggle.forEach((selector) => {
            const element = document.querySelector(selector);
            if (element) element.style.display = elementsHidden ? "none" : "";
        });
    }

    // Function to simulate typing
    function detectAndType() {
        const spans = document.querySelectorAll('span');
        spans.forEach((span) => {
            const text = span.textContent.trim();
            if (text.length === 1 && isElementInMiddle(span)) {
                typeCharacter(text);
            }
        });
    }

    function isElementInMiddle(element) {
        const rect = element.getBoundingClientRect();
        const middleX = window.innerWidth / 2;
        const middleY = window.innerHeight / 2;

        return (
            rect.left >= middleX - window.innerWidth / 4 &&
            rect.right <= middleX + window.innerWidth / 4 &&
            rect.top >= middleY - window.innerHeight / 4 &&
            rect.bottom <= middleY + window.innerHeight / 4
        );
    }

    function typeCharacter(char) {
        const typingArea = document.activeElement;
        if (typingArea && (typingArea.tagName === "INPUT" || typingArea.tagName === "TEXTAREA")) {
            const eventOptions = {
                key: char,
                code: `Key${char.toUpperCase()}`,
                char: char,
                keyCode: char.charCodeAt(0),
                which: char.charCodeAt(0),
                bubbles: true,
                cancelable: true
            };
            typingArea.dispatchEvent(new KeyboardEvent("keydown", eventOptions));
            typingArea.dispatchEvent(new KeyboardEvent("keypress", eventOptions));
            typingArea.dispatchEvent(new KeyboardEvent("keyup", eventOptions));
        }
    }

    function startTypingAutomation() {
        if (!typingEnabled) {
            typingEnabled = true;
            typingTimer = setInterval(detectAndType, speed);
        }
    }

    function stopTypingAutomation() {
        typingEnabled = false;
        if (typingTimer) {
            clearInterval(typingTimer);
            typingTimer = null;
        }
    }

    function updateTypingSpeed(newSpeed) {
        speed = newSpeed;
        if (typingEnabled) {
            stopTypingAutomation();
            startTypingAutomation();
        }
    }


    const controlPanel = document.createElement("div");
    controlPanel.style.position = "fixed";
    controlPanel.style.bottom = "20px";
    controlPanel.style.left = "20px";
    controlPanel.style.padding = "15px";
    controlPanel.style.backgroundColor = "#f9f9f9";
    controlPanel.style.border = "1px solid #ccc";
    controlPanel.style.borderRadius = "12px";
    controlPanel.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
    controlPanel.style.zIndex = "10000";
    controlPanel.style.fontFamily = "Arial, sans-serif";
    controlPanel.style.fontSize = "14px";


    const speedLabel = document.createElement("label");
    speedLabel.textContent = "Speed (ms): ";
    speedLabel.style.display = "block";
    speedLabel.style.marginBottom = "8px";

    const speedSlider = document.createElement("input");
    speedSlider.type = "range";
    speedSlider.min = "1";
    speedSlider.max = "1000";
    speedSlider.value = speed;
    speedSlider.style.width = "100px";
    speedSlider.style.marginRight = "10px";
    speedSlider.addEventListener("input", (e) => {
        updateTypingSpeed(parseInt(e.target.value));
        speedInput.value = e.target.value;
    });

    const speedInput = document.createElement("input");
    speedInput.type = "number";
    speedInput.value = speed;
    speedInput.style.width = "50px";
    speedInput.addEventListener("change", (e) => {
        updateTypingSpeed(parseInt(e.target.value));
        speedSlider.value = e.target.value;
    });

    controlPanel.appendChild(speedLabel);
    controlPanel.appendChild(speedSlider);
    controlPanel.appendChild(speedInput);
    controlPanel.appendChild(document.createElement("br"));


    function createButton(label, onClick) {
        const button = document.createElement("button");
        button.textContent = label;
        button.style.margin = "5px 5px 0 0";
        button.style.padding = "8px 12px";
        button.style.border = "none";
        button.style.borderRadius = "8px";
        button.style.backgroundColor = "#007bff";
        button.style.color = "#fff";
        button.style.cursor = "pointer";
        button.style.fontSize = "14px";
        button.style.fontFamily = "Arial, sans-serif";
        button.style.transition = "background-color 0.2s";

        button.addEventListener("mouseover", () => {
            button.style.backgroundColor = "#0056b3";
        });

        button.addEventListener("mouseout", () => {
            button.style.backgroundColor = "#007bff";
        });

        button.addEventListener("click", onClick);
        return button;
    }


    controlPanel.appendChild(createButton("Start Typing", startTypingAutomation));
    controlPanel.appendChild(createButton("Stop Typing", stopTypingAutomation));
    controlPanel.appendChild(createButton("Toggle Elements", toggleElementsVisibility));

    const hideButton = createButton("Hide Controls", () => {
        controlPanel.style.display = "none";
        showButton.style.display = "block";
    });
    controlPanel.appendChild(hideButton);


    const showButton = createButton("Show Controls", () => {
        controlPanel.style.display = "block";
        showButton.style.display = "none";
    });
    showButton.style.position = "fixed";
    showButton.style.bottom = "20px";
    showButton.style.left = "20px";
    showButton.style.display = "none";
    showButton.style.padding = "6px 10px"; 
    showButton.style.fontSize = "12px";

    document.body.appendChild(controlPanel);
    document.body.appendChild(showButton);
})();
