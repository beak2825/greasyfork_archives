// ==UserScript==
// @name         Bypass It
// @namespace    http://tampermonkey.net/
// @version      2025-09-14
// @description  Automatically Bypass Restrictions and Get Straight to Your Destination!
// @supportURL   https://greasyfork.org/scripts/527564/feedback
// @author       You
// @match        *://vn88.id/*
// @match        *://vn88.fan/*
// @match        *://vn88.ing/*
// @match        *://vn88.wtf/*
// @match        *://aylink.co/*
// @match        *://vn8eu.com/*
// @match        *://vn88n.com/*
// @match        *://gplinks.co/*
// @match        *://v2links.me/*
// @match        *://upfion.com/*
// @match        *://fb88dv.com/*
// @match        *://m88usb.com/*
// @match        *://vn88.group/*
// @match        *://vn88wo.com/*
// @match        *://vn88zx.com/*
// @match        *://vn88ko.com/*
// @match        *://vn88es.com/*
// @match        *://vn88tu.com/*
// @match        *://vn88my.com/*
// @match        *://v9bethi.com/*
// @match        *://www.m88.com/*
// @match        *://bet88li.com/*
// @match        *://cutyion.com/*
// @match        *://vn88tk1.com/*
// @match        *://vn88vc.wiki/*
// @match        *://fb88vao.com/*
// @match        *://coinclix.co/*
// @match        *://vn88.hiphop/*
// @match        *://gwaher.com/ptc
// @match        *://www.fb88.com/*
// @match        *://*.devnote.in/*
// @match        *://naamlist.com/*
// @match        *://modsfire.com/*
// @match        *://yeumoney.com/*
// @match        *://165.22.63.250/*
// @match        *://*.gmsrweb.org/*
// @match        *://modijiurl.com/*
// @match        *://geekgrove.net/*
// @match        *://www.m88sut.com/*
// @match        *://*.techyuth.xyz/*
// @match        *://vn88.solutions/*
// @match        *://financewada.com/*
// @match        *://188.166.185.213/*
// @match        *://earnbitmoon.club/*
// @match        *://gemini.google.com/*
// @match        *://cryptowidgets.net/*
// @match        *://*.wikijankari.com/*
// @match        *://cricketlegacy.com/*
// @match        *://ourcoincash.xyz/ptc*
// @match        *://*.idblogmarket.com/*
// @match        *://*.phonesparrow.com/*
// @match        *://financenova.online/*
// @match        *://bitcotasks.com//lead*
// @match        *://rajasthantopnews.com/*
// @match        *://www.google.com/url?q=*
// @match        *://freepayz.com/framed-ads
// @match        *://utkarshonlinetest.com/*
// @match        *://www.youtube.com/redirect*
// @match        *://www.facebook.com/flx/warn/*
// @match        *://gemini.google.com/app?msg=*
// @match        *://www.instagram.com/linkshim/*
// @match        *://coinhub.wiki/*
// @match        *://vitalityvista.net/*
// @match        *://geekgrove.net/*
// @match        *://hypershort.com/*
// @match        *://info.quizrent.com/*
// @match        *://info.tejtime24.com/*
// @match        *://lksfy.com/*
// @match        *://mahitimanch.in/*
// @match        *://web.quizrent.com/*
// @match        https://www.google.com/recaptcha/api2/bframe*
// @match        https://www.google.com/recaptcha/api2/anchor*
// @icon         data:image/png;base64,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
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_openInTab
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_addValueChangeListener
// @require      https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// @connect      api.nocaptchaai.com
// @connect      iconcaptcha-solver.vercel.app
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527564/Bypass%20It.user.js
// @updateURL https://update.greasyfork.org/scripts/527564/Bypass%20It.meta.js
// ==/UserScript==
const cfg = new MonkeyConfig({
    menuCommand: true,
    params: {
        redirectToSocial: {
            type: 'checkbox',
            label: "Auto-Redirect to Social Media",
            default: false,
        },
        ptcFaucet: {
            type: 'checkbox',
            label: "Opens PTC links",
            default: false
        },
        apiKey1: {
            type: 'text',
            label: "noCaptcha Ai API Key",
            default: "",
        },
        apiKey2: {
            type: 'text',
            label: "IconCaptchas API key",
            default: "",
        },
        siteDelays: {
            type: 'text',
            long: 3,
            label: "Site-Specific Delays (domain:delay)",
            default: 'example.com:50ms\nanotherexample.net:100ms'
        }
    }
});
 
const noop = () => {};
const rawWindow = unsafeWindow;
const currentUrl = location.href;
const queryParams = new URLSearchParams(location.search);
 
function waitForElement(selector, callback = noop) {
    const findElement = () => {
        if (selector.startsWith("//")) {
            return document.evaluate(selector, document, null, 9).singleNodeValue;
        }
        return document.querySelector(selector);
 
    };
 
    return new Promise((resolve) => {
        const element = findElement();
        if (document.contains(element)) {
            callback(element);
            return resolve(element);
        }
        const observer = new MutationObserver((mutations, observerInstance) => {
            const node = findElement();
            if (document.contains(node)) {
                observerInstance.disconnect();
                callback(node);
                resolve(node);
            }
        });
        observer.observe(document.documentElement, {
            attributes: true,
            childList: true,
            subtree: true,
        });
    });
}
 
function navigateTo(url) {
    location = url;
}
 
function waitSeconds(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
 
function redirectToLink(selector) {
    waitForElement(selector).then((element) => navigateTo(element.href));
}
 
function imageUrlToBase64(imageUrl) {
    if (!imageUrl) {
        console.error("No imageUrl provided");
        return null;
    }
    return new Promise((resolve, reject) => {
        makeRequest(imageUrl, {
            responseType: "blob",
        }).then(blob => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => {
                console.error("FileReader error:", error);
                reject(error);
            };
            reader.readAsDataURL(blob);
        })
    });
}
 
function onMatch(hostPattern, callback, ...args) {
    hostPattern = hostPattern.replace("www.", "");
    if (hostPattern.length < 3) return;
 
    const isMatch = new RegExp(hostPattern).test(location.host);
    if (isMatch) callback(...args);
}
 
function onMatchClick(hostPattern, selector) {
    onMatch(hostPattern, simulateClick, selector)
}
 
function simulateClick(selector, delay = 0) {
    const clickFun = (element) => {
        const events = ["mouseover", "mousedown", "mouseup", "click"];
        events.forEach((eventName) => {
            const event = new MouseEvent(eventName, {
                bubbles: true,
            });
            element.dispatchEvent(event);
        });
    }
    if (typeof selector != "string") {
        return clickFun(selector);
    }
    const selectors = selector.split(", ");
    if (selectors.length > 1) {
        selectors.forEach((sel) => simulateClick(sel, delay));
        return;
    }
 
    waitForElement(selector, async function(element) {
        if (delay > 0) await waitSeconds(delay);
        clickFun(element);
    });
}
 
function whenCaptchaSolved(callback, onWait = noop) {
    let intervalId;
    const stopChecking = () => clearInterval(intervalId);
 
    // waitForElement("//*[@id='captcha-result'] and normalize-space() = 'Verified!']", function() {
    //     stopChecking();
    //     callback();
    // })
    const checkCaptcha = () => {
        try {
            const element = document.querySelector('#captcha-result .mb-2.badge.bg-success');
            if (element && element.textContent.trim() === 'Verified!') {
                stopChecking();
                callback();
            }
 
            const captcha = rawWindow.turnstile || rawWindow.hcaptcha || rawWindow.grecaptcha;
            const response = captcha.getResponse();
 
            if (response) {
                stopChecking();
                callback();
            }
        } catch (error) {
            onWait(stopChecking);
        }
    };
 
    checkCaptcha();
    intervalId = setInterval(checkCaptcha, 1000);
}
 const clickAfterCaptcha = (selector) => whenCaptchaSolved(() => simulateClick(selector));

function GM_onMessage(label, callback = noop) {
    GM_addValueChangeListener("postMessage-" + label, function(name, oldValue, newValue, remote) {
        if (remote) {
            GM_deleteValue("postMessage-" + label);
            callback(newValue);
        }
    });
}
 
function GM_sendMessage(label, value) {
    GM_setValue("postMessage-" + label, value);
}
 
function onOpenTab(callback) {
    const originalOpen = rawWindow.open;
 
    rawWindow.open = function(...args) {
        const newWindow = originalOpen.apply(rawWindow, args);
        callback(newWindow);
        return newWindow;
    };
}
 
function clickWithTrusted() {
    // Create window proxy to disable Object.freeze
    const sandbox = new Proxy(window, {
        get(target, key) {
            if (key === 'Object') {
                return new Proxy(Object, {
                    get(objTarget, objKey) {
                        if (objKey === 'freeze') {
                            return function(obj) {
                                console.warn("Object.freeze disabled in sandbox.");
                                return obj;
                            };
                        }
                        return Reflect.get(objTarget, objKey);
                    }
                });
            }
            return Reflect.get(target, key);
        }
    });
 
    // Patch addEventListener to clone events and force isTrusted
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        const wrappedListener = function(event) {
            const clonedEvent = Object.create(event);
            Object.defineProperty(clonedEvent, "isTrusted", {
                value: true,
                writable: false
            });
            return listener.call(this, clonedEvent);
        };
        return originalAddEventListener.call(this, type, wrappedListener, options);
    };
 
    return sandbox;
}
 
function isVisible(element) {
    if (!element) return false;
 
    const style = window.getComputedStyle(element);
    const visible = style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          style.opacity !== '0' &&
          element.offsetWidth > 0 &&
          element.offsetHeight > 0;
 
    if (!visible) return false;
 
    return isVisible(element.parentElement) || element.parentElement === null;
};
 
function transformMethod(object, methodName, argumentProcessor) {
    const originalMethod = object[methodName];
 
    Object.defineProperty(object, methodName, {
        value: function (...args) {
            const processedArgs = argumentProcessor(args);
            return originalMethod(...processedArgs);
        },
        writable: false,
        configurable: false
    });
}
 
function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            url,
            method: options.method || "GET",
            responseType: options.responseType || "json",
            headers: options.headers || {},
            data: options.data ? JSON.stringify(options.data) : null,
            //timeout: options.timeout || 0,
            onload: (response) => resolve(response.response),
            onerror: (error) => reject(error),
            ontimeout: (error) => reject(error),
            onabort: (error) => reject(error)
        });
    });
}
 
// Main execution
(function () {
    "use strict";
    //only click
    onMatchClick("cutyion.com", "#submit-button:not([disabled])");
    onMatchClick("modsfire.com", ".download-button, .download-button[href]");
    onMatchClick("aylink.co", ".btn-go, .complete[style*='display: block;'] a, a.btn:not(.btn-go)")
    onMatchClick("devnote.in|techyuth.xyz", "#scroll:not(.no), #getlinks[style*='display: block;'], .get-link:not(.disabled)");
    onMatchClick("gplinks.co|cricketlegacy.com", "#VerifyBtn[style*='display: block;'], #NextBtn:not([href='#']), #captchaButton:not(.disabled)");
    onMatchClick("(financewada|utkarshonlinetest).com|financenova.online|v2links.me", ".get_btn a[href], //div[contains(text(),'Continue')], .get-link:not(.disabled)");
    onMatchClick("(wikijankari|idblogmarket|modijiurl|phonesparrow|naamlist|rajasthantopnews).com|gmsrweb.org", "center a[style*='display: block;'], .get-link:not(.disabled)");
    cfg.get("redirectToSocial") && onMatchClick("(instagram|youtube|facebook).com", ".-cx-PRIVATE-Linkshim__followLink__, #invalid-token-redirect-goto-site-button, .selected");
 
    onMatch("upfion.com", function() {
        simulateClick("#link-button:not([disabled])");
        redirectToLink("a#link-button:not([disabled])");
    });
 
    onMatch("(m88(sut|usb)?|bet88li|fb88(dv|vao)?|yeumoney|google|vn8?8(wo|tk1|eu|zx|ko|es|tu|n|my)?|v9bethi).com|188.166.185.213|165.22.63.250|vn88.(hiphop|wtf|id|now|fan|group|solutions|ing)|vn88vc.wiki", function() {
        waitForElement(".getcodebtn", function(element) {
            element.click();
            GM_sendMessage("close_tabs", currentUrl);
        })
        waitForElement("//*[contains(@class, 'cursor-pointer') and contains(text(), 'footer')]", function() {
            simulateClick("a[href*='"+location.host+"']");
        })
        waitForElement("//*[contains(@class, 'cursor-pointer') and string-length(translate(normalize-space(text()), '0123456789', '')) = 0]", function(element) {
            GM_sendMessage("vietnam_code", element.innerText)
        })
 
        const tabs = [];
        const urls = [
            "m88.com", "vn88.id", "vn88.fan", "vn88.ing", "fb88.com", "vn88.now",
            "vn88.wtf", "vn8eu.com", "vn88n.com", "m88sut.com", "m88usb.com",
            "fb88dv.com", "vn88.group", "vn88wo.com", "vn88zx.com", "vn88ko.com",
            "vn88es.com", "vn88tu.com", "vn88tk1.com","vn88vc.wiki", "fb88vao.com",
            "vn88.hiphop", "vn88.solutions", "bet88li.com/m88", "188.166.185.213/w88",
            "165.22.63.250/188bet", "vn88my.com/m88", "v9bethi.com"
        ]
 
        urls.includes(queryParams.get("q")?.replace("https://", "")) && simulateClick(".mymGo ~ div a");
 
        GM_onMessage("vietnam_code", function(newValue) {
            tabs.forEach(([_, tab]) => tab.close());
            document.querySelector('[name="code"]').value = newValue;
            simulateClick(".box-form-button button");
        });
 
        waitForElement("[data-clipboard-text]:not([data-clipboard-text=''])", function(element) {
            const links = urls.filter(url => url.includes(element.dataset.clipboardText));
            links.forEach(url => {
                const tab = GM_openInTab("https://www.google.com/url?q=https://" + url);
                tabs.push([url, tab]);
            })
            GM_onMessage("close_tabs", function(newValue) {
                tabs.forEach(([url, tab]) => {
                    if (new URL("https://" + url).host !== new URL(newValue).host) {
                        tab.close();
                    }
                });
            });
        })
    });
 
    if (cfg.get("ptcFaucet")) {
        const regex = /^(visit for \d+ sec|visit(?: now)?|go|view|view now|view ads?|watch|start .* coins|start view ad)$/i;
        const findButton = () => [...document.querySelectorAll("button")].find(btn => regex.test(btn.textContent.trim()));
 
        onMatch("ourcoincash.xyz|(bitcotasks|freepayz|gwaher).com", function() {
            //TODO: replace the use of setInterval and fix the issue with tabs
            let tabObj;
            onOpenTab(function(tab) { tabObj = tab; });
            rawWindow.addEventListener("beforeunload", function() { tabObj?.close(); })
 
            findButton()?.click();
 
            setInterval(function() {
                tabObj?.close();
                findButton()?.click();
            }, 120000) // 120 sec
            whenCaptchaSolved(function() {
                const btn = document.querySelector("button[type='submit']")
                isVisible(btn) && btn.click();
            })
        })
    }
 
    onMatch('coinclix.co|coinhub.wiki|(vitalityvista|geekgrove).net|(instagram|youtube|google|facebook).com', async () => {
        document?.referrer == '' && simulateClick('.-cx-PRIVATE-Linkshim__followLink__, #invalid-token-redirect-goto-site-button, .selected');
        /vitalityvista|geekgrove|coinhub/.test(document?.referrer) && queryParams.has('url') && goTo(queryParams.get('url'));

        if (currentUrl.includes('go/')) {
            let tab;
            const code = await waitForElement('.mb-2 code');
            try {
                const link = await waitForElement('strong > a', 1);
                GM_setValue('geek_code', code.innerText);
                tab = GM_openInTab(link.href, {
                    active: true
                });
            } catch (e) {
                const q = document.querySelector('.user-select-none').textContent;
                tab = GM_openInTab(`https://www.google.com/url?q=${q}`, {
                    active: true
                });
            }

            GM_onMessage('finalcode', function(newValue) {
                tab?.close();
                document.querySelector('#verification_code').value = newValue;
            })
        }
        simulateClick('a.btn:has(.mdi-check), #btnLinkStart:not([disabled]), #linkResFooter > #btnLinkContinue:not([disabled]), #linkResHeader > #btnLpcont');
        clickAfterCaptcha('#btnLinkContinue');
        simulateClick('#btnLinkContinue:not(:has(.iconcaptcha-modal)), .iconcaptcha-modal__body');
        simulateClick('#btnLpcont');
        waitForElement('#linkInput').then((input) => {
            input.value = GM_getValue('geek_code', '');
            simulateClick('#btnLink', 1);
        })
        const codeEl = await waitForElement('code.link_code');
        GM_sendMessage('finalcode', codeEl.innerText)
    });

    onMatch("hypershort.com", function() {
        simulateClick("#continue:not([disabled]) ~ #generatelink");
        simulateClick("#gettinglink");
    })

    // Temporary handling until I improve all the functions
    onMatch("info.quizrent.com|info.tejtime24.com|web.quizrent.com", async function() {
        simulateClick("#bottomButton:not([disabled]), #topButton:not([disabled])");
        await waitSeconds(2);
        simulateClick("#bottomButton:not([disabled]), #topButton:not([disabled])");
        await waitSeconds(2);

        whenCaptchaSolved(() => {
            simulateClick("#open-link:not([.disabled])");
        })
    })

    onMatch('lksfy.com', function() {
        simulateClick('#get-link[href]:not([href^="javascript:"])')
    })

    onMatch('mahitimanch.in', async function() {
        simulateClick("#link");
        await waitSeconds(2);
        simulateClick("#btn6");
        simulateClick("#gtelinkbtn");
    })
    // end of "Temporary handling until I improve all the functions"


    // Don't forget to add the site into the @match.
    const sites = cfg.get("siteDelays").replaceAll("ms", "").split(/\n|:/);
    if (location.host in sites) {
        const argumentProcessor = (cb, delay, ...args) => ([cb, sites[location.host] * 1000, ...args]);
        transformMethod(rawWindow, "setInterval", argumentProcessor);
        transformMethod(rawWindow, "setTimeout", argumentProcessor);
    }
})();
// There are several known bugs, so if possible, it is recommended to use the official chrome extensions for now.
(async function(isEnabled) {
    if (!isEnabled) return;
 
    let isSolved = false;
 
    const isCheckboxPresent = () => !!document.querySelector('.recaptcha-checkbox');
    const isCheckboxChecked = () => document.querySelector('#recaptcha-anchor')?.getAttribute('aria-checked') === 'true';
    const isImageChallengePresent = () => !!document.querySelector('#rc-imageselect');
    const isGrid4x4 = () => document.querySelectorAll('.rc-imageselect-tile').length === 16;
    const isGrid3x3 = () => document.querySelectorAll('.rc-imageselect-tile').length === 9;
    const getChallengeData = () => {
        const target = document.querySelector('.rc-imageselect-instructions strong')?.innerText;
        const imageUrl = document.querySelector('.rc-image-tile-33, .rc-image-tile-44')?.src;
        return [target, imageUrl];
    };
 
    const solveImageChallenge = async (target, imageUrl, gridType) => {
        return new Promise(async (resolve, reject) => {
            const response = await makeRequest("https://api.nocaptchaai.com/createTask", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    clientKey: cfg.get('apiKey1'),
                    task: {
                        type: 'ReCaptchaV2Classification',
                        questionType: gridType,
                        image: (await imageUrlToBase64(imageUrl)).replace("data:image/jpeg;base64,", ""),
                        question: target
                    }
                }
            })
 
            if (response.errorId) reject(response);
            const solution = response.solution;
            resolve(solution?.objects || solution?.hasObject);
        });
    };
 
    const hasError = () => {
        const errorElements = document.querySelectorAll('[class^="rc-imageselect-error-"]');
        return Array.from(errorElements).some(isVisible);
    };
 
    while (!isSolved) {
        await waitSeconds(2);
        if (isCheckboxPresent()) {
            if (isCheckboxChecked()) {
                isSolved = true;
                return;
            }
            await simulateClick('#recaptcha-anchor');
        } else if (isImageChallengePresent()) {
            const gridType = isGrid4x4() ? "44" : isGrid3x3() ? "33" : null;
            if (gridType && isImageChallengePresent() && !isCheckboxChecked()) {
                const [target, imageUrl] = getChallengeData();
                if (target && imageUrl) {
                    const solution = await solveImageChallenge(target, imageUrl, gridType);
                    if (solution) {
                        const tiles = document.querySelectorAll('.rc-image-tile-wrapper');
                        for (const index of solution) {
                            if (tiles[index]) {
                                simulateClick(tiles[index]);
                                await waitSeconds(0.4);
                            }
                        }
                        await waitSeconds(1);
                        simulateClick("#recaptcha-verify-button");
 
                        if (isCheckboxChecked()) {
                            isSolved = true;
                            await waitSeconds(1);
                            return;
                        }
                    }
                }
            }
        } else if (isCheckboxChecked()) {
            isSolved = true;
            await waitSeconds(1);
            return;
        }
 
        if (hasError()) {
            simulateClick("#recaptcha-reload-button");
            await waitSeconds(1);
        }
    }
})(cfg.get("apiKey1").length > 20);
 
(async function(isEnabled) {
    if (!isEnabled) return;
    await waitForElement('.iconcaptcha-holder');
    const OriginalImage = rawWindow.Image;
    rawWindow.Image = function(width, height) {
        const img = new OriginalImage(width, height);
 
        img.addEventListener('load', () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                solve(canvas.toDataURL())
            } catch (err) {
                console.warn('Could not convert image to base64:', err);
            }
        });
        return img;
 
    }
 
    rawWindow.Image.prototype = OriginalImage.prototype;
    const element = await waitForElement(".iconcaptcha-modal__body-icons");
    await waitSeconds(0.5);
 
    if (element.tagName === "canvas") solve(element.toDataURL());
    async function solve(base64Image) {
        base64Image = base64Image.replace("data:image/png;base64,", "");
        console.log(base64Image);
 
        const response = await makeRequest("https://iconcaptcha-solver.vercel.app/api/v2/solve", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                token: cfg.get("apiKey2").trim(),
                image: base64Image
            }
        });
 
        console.log(response);
        const captchaBox = document.querySelector(".iconcaptcha-modal__body-selection > i");
 
        const rect = element.getBoundingClientRect();
        const clientX = rect.left + response.center_x;
        const clientY = rect.top + response.center_y;
 
        console.log("Click inside canvas at:", { clientX, clientY });
 
        // Visual marker
        const marker = document.createElement("div");
        marker.style.position = "fixed";
        marker.style.left = `${clientX - 5}px`;
        marker.style.top = `${clientY - 5}px`;
        marker.style.width = "10px";
        marker.style.height = "10px";
        marker.style.backgroundColor = "red";
        marker.style.borderRadius = "50%";
        marker.style.zIndex = "9999";
        marker.style.pointerEvents = "none";
        document.body.appendChild(marker);
 
        setTimeout(() => marker.remove(), 1000);
 
        ["mouseenter", "mousemove", "mousedown", "mouseup", "click"].forEach(type => {
            captchaBox.dispatchEvent(new MouseEvent(type, {
                bubbles: true,
                cancelable: true,
                view: rawWindow,
                clientX,
                clientY,
                pageX: clientX + rawWindow.scrollX,
                pageY: clientY + rawWindow.scrollY
            }));
        });
    }
})(cfg.get("apiKey2").length > 5);