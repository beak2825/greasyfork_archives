// ==UserScript==
// @name         TetteLib
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  A library containing several functions I use often in my other scripts
// @author       TetteDev
// @match        *://*/*
// @grant        none
// ==/UserScript==


function assert(condition, message, onAssertErrorHappened = undefined) {
    if (!condition) {
        console.log(message);
        simulateNotification("Assert Failed!", message || "No Message Provided", "Error", -1);
        if (onAssertErrorHappened !== undefined) onAssertErrorHappened();
      	debugger;
        throw new Error(message || "Assertion failed");
    }
}
function simulateNotification(title, message, type = "info", timeout = 2500) {
	const toastId = "simpleToast";
	var notificationContainer = document.createElement("div");
	notificationContainer.id = toastId;
 
	let existingNotification = document.getElementById(toastId);
	if (existingNotification) existingNotification.remove();
 
	notificationContainer.title = "Click to dismiss this message";
 
	var innerContainer = document.createElement("div");
	const imgSize = 54;
	let imgSrc = "";
	let backgroundColor = "";
	let fontColor = "";
 
	if (type.toLowerCase() === "debug") {
		imgSrc = "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678124-wrench-screwdriver-64.png";
		backgroundColor = "#eac100";
		fontColor = "#323232";
	}
	else if (type.toLowerCase() === "error") {
		imgSrc = "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678069-sign-error-64.png";
		backgroundColor = "#ff0000";
		fontColor = "#ffffff";
	}
	else {
		imgSrc = "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678110-sign-info-64.png";
		backgroundColor = "#0f0f0f";
		fontColor = "#ffffff";
	}
 
	notificationContainer.style.cssText
		= `position: fixed;
        bottom: 15px;
        right: 15px;
        background-color: ${backgroundColor};
        color: ${fontColor};
        border: 1px solid #ffffff;
		max-width: 20%;
        padding-left: 50px;
		padding-right: 50px;
		padding-top:10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        opacity: 1;
        transition: opacity 1s, border-radius 0.5s;
        border-radius: 5px;
		cursor: pointer;
        `
 
	innerContainer.innerHTML =
		`<img src='${imgSrc}' style='width:${imgSize}px;height:${imgSize}px;padding-bottom:10px;display:block;margin:auto;'></img>
		<p id='title' style='text-align:center;font-weight:bold;font-size:20px;'>${title}</p>
		<p id='message' style='text-align:center;padding-bottom:15px;font-size:15px;'>${message}</p>`;
 
	notificationContainer.appendChild(innerContainer);
 
	notificationContainer.onclick = function() { document.body.removeChild(notificationContainer); notificationContainer = null; }
	document.body.appendChild(notificationContainer);
 
	if (type.toLowerCase() === "debug") {
		console.warn(`[DEBUG] ${title}: ${message}`);
	}
	else if (type.toLowerCase() === "error") {
		console.error(`[ERROR] ${title}: ${message}`);
	}
 
	// Set a timer to fade out the notification after 'timeout' milliseconds if (if 'timeout' is not -1 or less)
	if (timeout > -1) {
		setTimeout(function() {
			if (notificationContainer == null) return;
			notificationContainer.style.opacity = 0;
			setTimeout(function() {
				if (notificationContainer == null) return;
				document.body.removeChild(notificationContainer);
			}, 500); // Remove the notification after the fade-out animation (adjust as needed)
		}, (timeout < 1 ? 2500 : timeout)); // Start the fade-out animation after 5 seconds (adjust as needed)
	}
}
const toastId = "permission_prompt";
function showToast(message, button1Text = 'Allow', button2Text = 'Block') {
    return new Promise((resolve) => {
        const clearAllActivePrompts = () => {
            Array.from(document.querySelectorAll(`#${toastId}`)).forEach(toast => toast.remove());
        };

        const toast = document.createElement('div');
        toast.id = toastId;
        toast.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px;
                border-radius: 5px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                min-width: 200px;
                animation: slideIn 0.3s ease;
                border: 2px solid red;
                font-weight: bold;
            ">
                <div style="margin-bottom: 10px; color: black;">${message}</div>
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button id="btn1" style="padding: 5px 10px; color: black; cursor: pointer;">${button1Text}</button>
                    <button id="btn2" style="padding: 5px 10px; color: black; cursor: pointer;">${button2Text}</button>
                </div>
            </div>
        `;

        // Add animation style
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        // Add to document
        document.body.appendChild(toast);

        // Button handlers
        toast.querySelector('#btn1').onclick = () => {
            style.remove();
            clearAllActivePrompts();
            resolve("allow");
        };

        toast.querySelector('#btn2').onclick = () => {
            style.remove();
            clearAllActivePrompts();
            resolve("block");
        };
    });
}
function waitUntil(predicate, timeoutMs = 5000, checkIntervalMs = 100) {
    return new Promise((resolve, reject) => {
        if (typeof predicate !== 'function') {
            reject(new Error('Predicate must be a function'));
            return;
        }

        const startTime = Date.now();
        
        const check = () => {
            const result = predicate();
            
            if (result) {
                resolve(result);
                return;
            }
            
            if (timeoutMs > 0 && Date.now() - startTime >= timeoutMs) {
                reject(new Error(`Timeout: Predicate did not become true within ${timeoutMs}ms`));
                return;
            }
            
            setTimeout(check, checkIntervalMs);
        };
        
        check();
    });
}
function waitForElement(selector) {
  return new Promise((resolve, reject) => {
    const el = document.querySelector(selector);
    if (el) {resolve(el);}
    new MutationObserver((mutationRecords, observer) => {
      // Query for elements matching the specified selector
      Array.from(document.querySelectorAll(selector)).forEach((element) => {
        resolve(element);
        //Once we have resolved we don't need the observer anymore.
        observer.disconnect();
      });
    })
      .observe(document.documentElement, {
        childList: true,
        subtree: true
      });
  });
}
function waitForElementWithTimeout(selector, mustBeVisibleToEye = false, timeout = 3000) {
	return new Promise((resolve, reject) => {
		if (timeout < 0) timeout = 0;
		if (!selector) reject("No selector specified");
 
		const el = document.querySelector(selector);
		if (el && (mustBeVisibleToEye ? __visible(el) : true)) {
			resolve(el);
		}
 
		const timeoutMessage = `Timeout: Element with selector '${selector}' not found within ${timeout} ms`;
		const timer = setTimeout(() => {
			observer.disconnect();
			reject(new Error(timeoutMessage));
		}, timeout);
 
		const observer = new MutationObserver((mutationRecords, observer) => {
			let elements = Array.from(document.querySelectorAll(selector));
			if (elements.length > 0 && mustBeVisibleToEye) elements = elements.filter((el) => __visible(el));
 
			//debugger;
			if (elements.length > 0) {
				clearTimeout(timer);
				observer.disconnect();
				resolve(elements[0]);
			}
		});
 
		observer.observe(document.documentElement, {
			childList: true,
			subtree: true,
		});
	});
}
function waitForElementWithTimeoutExtended(selector, options = {timeoutMessage: null, onElementFoundValidatorFunc: null, returnAllMatches: false }, timeoutThresholdMs = 3000) {
	return new Promise((resolve, reject) => {
		if (timeoutThresholdMs < 0) timeoutThresholdMs = 0;
		if (!selector) reject("No selector specified");
		if (options && typeof options !== 'object') reject("Options parameter must be an object");
 
		if (options.returnAllMatches) {
			let els = Array.from(document.querySelectorAll(selector));
			if (els.length > 0) {
				if (options.onElementFoundValidatorFunc && typeof options.onElementFoundValidatorFunc === 'function') {
					els = els.filter((e) => options.onElementFoundValidatorFunc(e));
					if (els.length > 0) resolve(els);
				}
				else resolve(els);
			}
		}
		else {
			const el = document.querySelector(selector);
			if (el && (options.onElementFoundValidatorFunc && typeof options.onElementFoundValidatorFunc === 'function' ? options.onElementFoundValidatorFunc(el) : true)) {
				resolve(el);
			}
		}
 
		const timeoutMessage = (options.timeoutMessage || `Timeout: Element with selector '${selector}' not found within ${timeoutThresholdMs} ms`);
		const timer = setTimeout(() => {
			observer.disconnect();
			reject(new Error(timeoutMessage));
		}, timeoutThresholdMs);
 
		const observer = new MutationObserver((mutationRecords, observer) => {
			let elements = Array.from(document.querySelectorAll(selector));
			if (elements.length > 0 && (options.onElementFoundValidatorFunc && typeof options.onElementFoundValidatorFunc === 'function')) elements = elements.filter((el) => options.onElementFoundValidatorFunc(el));
 
			if (elements.length > 0) {
				clearTimeout(timer);
				observer.disconnect();
				if (options.returnAllMatches) resolve(elements);
				else resolve(elements[0]);
			}
		});
 
		observer.observe(document.documentElement, {
			childList: true,
			subtree: true,
		});
	});
}
function traverseParentsUntil(startElement, predicateUntil, stopAfterNItteratedParents = -1) {
	if (!startElement) return null;
	if (!predicateUntil || typeof predicateUntil !== "function") return null;
	if (!startElement.parentElement) return predicateUntil(startElement) ? startElement : null;
 
	let parentsItterated = 0;
 
	while (startElement.parentElement) {
		if (predicateUntil(startElement.parentElement)) return startElement.parentElement;
		else startElement = startElement.parentElement;
		if (stopAfterNItteratedParents > 0 && stopAfterNItteratedParents === ++parentsItterated) return null;
	}
	return null;
}
function traverseChildrenUntil(startElement, predicateUntil, stopAfterNItteratedChildren = -1) {
	if (!startElement) return null;
	if (!predicateUntil || typeof predicateUntil !== "function") return null;
	if (!startElement.firstChild) return predicateUntil(startElement) ? startElement : null;
 
	let childrenItterated = 0;
 
	while (startElement.firstChild) {
		if (predicateUntil(startElement.firstChild)) return startElement.firstChild;
		else startElement = startElement.firstChild;
		if (stopAfterNItteratedChildren > 0 && stopAfterNItteratedChildren === ++childrenItterated) return null;
	}
	return null;
}
function __visible(el) {
	return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}
function removeAllEventListeners(el, preserveChildrenEvents = true) {
	if (!preserveChildrenEvents) {
		el.parentNode.replaceChild(el.cloneNode(true), el);
	}
	else {
		var newEl = el.cloneNode(false);
		while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
		el.parentNode.replaceChild(newEl, el);
	}
	return el;
}
const DoOnceMap = new Map();
const DoOnce = (action) => {
    if (typeof action !== 'function') throw new Error("Function 'DoOnce' expects a function for the 'action' argument");
    if (!(typeof String.prototype.hashCode === "function")) {
        Object.defineProperty(String.prototype, 'hashCode', {
            value: function() {
                let hash = 0,
                    i, chr;
                if (this.length === 0) return hash;
                const len = this.length;
                for (i = 0; i < len; i++) {
                    chr = this.charCodeAt(i);
                    hash = ((hash << 5) - hash) + chr;
                    hash |= 0; // Convert to 32bit integer
                }
                return hash;
            },
            writable: true,
            configurable: true
        });
    }

    const stripWhitespaceExceptQuotes = (str) => {
        return str.replace(/\s+(?=(?:[^'"`]*[`'"][^'"`]*[`'"])*[^'"`]*$)/g, '');
    };
    const fnHash = stripWhitespaceExceptQuotes(action.toString()).hashCode();
    if (DoOnceMap.has(fnHash)) return;

    let returnValue = action();
    DoOnceMap.set(fnHash, true);
    return returnValue;
};