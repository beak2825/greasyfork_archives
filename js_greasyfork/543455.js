// ==UserScript==
// //
// @namespace    http://leopardindustries.net
// @name         NewMetro UI for Netflix
// @version      1.5.9
// @license      MIT
// @match        https://www.netflix.com/*
// @match        https://www.netflix.com/watch/*
// @grant        none
// @grant        GM_xmlhttpRequest
// @connect      unogs.com
// @connect      openweathermap.org
// @connect      corsproxy.io
// @connect      omdbapi.com
// @icon         https://i.postimg.cc/Twchqj2j/nf.png
// @description  metro ui forever
// //
// @downloadURL https://update.greasyfork.org/scripts/543455/NewMetro%20UI%20for%20Netflix.user.js
// @updateURL https://update.greasyfork.org/scripts/543455/NewMetro%20UI%20for%20Netflix.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // Modifying this script is one hundered percent allowed but may break it eventually

    // ==========================================
    // CONSTANTS & CONFIG
    // ==========================================
    const LICENSE_URL = "https://corsproxy.io/?" + encodeURIComponent("https://pastebin.com/raw/Ujb6sHm5");
    const LICENSE_KEY = "newmetro_license_email";
    const BLUR_ID = "nm-blur";
    const POPUP_ID = "nm-popup";
    const HUD_ID = "nm-hud";

    const WEATHER_API_KEY = "d06b19a448302595d8a8226d6cf6bee5";
    const COUNTRY_CODE = "us";

    const OMDB_API_KEY = '678ad194';

    // State variables
    let zipCode = null;
    let lastFetchTime = 0;
    let tempEl = null;

    let updateClockInterval = null;
    let clockObserver = null;
    let mainObserver = null;

    let storedTitle = null;
    let storedYear = null;

    // ==========================================
    // UTILITIES & HELPERS
    // ==========================================

    function checkStylver(expectedVersion) {
        const current = getComputedStyle(document.documentElement)
            .getPropertyValue('--stylver')
            .replace(/['"]/g, '') // strip quotes if present
            .trim();

        if (current !== expectedVersion) {
            alert('warning the stylesheet is out of date -- the site will not preform as expected');
            return false;
        }
        return true;
    }

    function lockScroll(lock) {
        if (lock) {
            document.body.classList.add("nm-scroll-lock");
        } else {
            document.body.classList.remove("nm-scroll-lock");
        }
    }

    function showHUD(message, duration = 2000) {
        let hud = document.getElementById(HUD_ID);
        if (!hud) {
            hud = document.createElement("div");
            hud.id = HUD_ID;
            document.body.appendChild(hud);
        }
        hud.textContent = message.toLowerCase();
        hud.style.opacity = "1";
        setTimeout(() => {
            hud.style.opacity = "0";
        }, duration);
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;

        // Set styles
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.background = 'black';
        toast.style.color = 'white';
        toast.style.padding = '10px 20px';
        toast.style.border = '1px solid white';
        toast.style.borderRadius = '0px';
        toast.style.zIndex = '999999';
        toast.style.opacity = '1';
        toast.style.transition = 'opacity 0.4s ease';

        document.body.appendChild(toast);

        // Show for 1 second before blinking
        setTimeout(() => {
            let flashes = 0;
            const flashInterval = setInterval(() => {
                toast.style.opacity = toast.style.opacity === '1' ? '0' : '1';
                flashes++;
                if (flashes >= 6) { // 3 full flashes
                    clearInterval(flashInterval);
                    // Ensure opacity is 1 before fading out
                    toast.style.opacity = '1';
                    // Wait 100ms to allow reflow, then fade out
                    setTimeout(() => {
                        toast.style.opacity = '0';
                        // Wait for transition to complete, then remove
                        toast.addEventListener('transitionend', () => {
                            toast.remove();
                        }, { once: true });
                    }, 100);
                }
            }, 120);
        }, 1000); // 1 second solid show
    }

    function parseFloatToBigIntFraction(floatNum) {
        const numStr = floatNum.toString();
        const decimalIndex = numStr.indexOf('.');

        if (decimalIndex === -1) {
            return { numerator: BigInt(numStr), denominator: 1n };
        }

        const integerPartStr = numStr.substring(0, decimalIndex);
        const decimalPartStr = numStr.substring(decimalIndex + 1);
        const denominator = 10n ** BigInt(decimalPartStr.length);
        const numerator = BigInt(integerPartStr + decimalPartStr);

        return { numerator, denominator };
    }

    function multiplyHexByShift(hexString, shiftFactor) {
        try {
            const hexBigInt = BigInt('0x' + hexString);
            const { numerator: shiftNumerator, denominator: shiftDenominator } = parseFloatToBigIntFraction(shiftFactor);
            const resultBigInt = (hexBigInt * shiftNumerator) / shiftDenominator;
            return resultBigInt.toString(16).toUpperCase();
        } catch (e) {
            throw new Error("fail multiply hexes with  " + e.message);
        }
    }

    function toUppercaseHex(str) {
        return Array.from(str).map(char => {
            return char.charCodeAt(0).toString(16).toUpperCase();
        }).join('');
    }

    // ==========================================
    // WEATHER & CLOCK
    // ==========================================

    async function getZipFromIP() {
        if (zipCode) return zipCode; // already fetched
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        zipCode = data.postal;
        return zipCode;
    }

    async function insertTemperature() {
        const now = Date.now();
        const isSearchPage = window.location.pathname.startsWith("/search");

        // If it's a search page, remove the element and stop
        if (isSearchPage) {
            if (tempEl && tempEl.parentNode) {
                tempEl.parentNode.removeChild(tempEl);
                tempEl = null;
            }
            return;
        }

        // Only fetch again if more than 10 minutes (600,000 ms) passed
        if (now - lastFetchTime < 600000 && tempEl && document.body.contains(tempEl)) {
            return; // Too soon, and tempEl is still attached
        }

        try {
            const zip = await getZipFromIP();
            if (!zip) throw new Error("no zip from ip");

            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?zip=${zip},${COUNTRY_CODE}&appid=${WEATHER_API_KEY}&units=imperial`
            );
            if (!response.ok) throw new Error("weather fetch issue");
            const data = await response.json();

            const tempF = Math.round(data.main.temp);

            // Remove old element if it exists
            if (tempEl && tempEl.parentNode) {
                tempEl.parentNode.removeChild(tempEl);
            }

            // Create and style new element
            tempEl = document.createElement("div");
            tempEl.textContent = `Weather ‍  ‍ -- ‍  ‍  ${tempF}°F`;
            tempEl.style.fontWeight = "bold";
            tempEl.style.position = "relative";
            tempEl.style.bottom = "5px";
            tempEl.style.left = "-12px";

            // Insert next to your button
            const btn = document.querySelector("button.searchTab");
            if (btn && btn.parentNode) {
                btn.parentNode.insertBefore(tempEl, btn);
            }

            // Update fetch time
            lastFetchTime = now;
        } catch (err) {
            console.error("weather error - ", err);
        }
    }

    function styleAndUpdateClock(button) {
        if (!button) return;

        Object.assign(button.style, {
            padding: '6px 12px',
            fontSize: '15px',
            background: 'black',
            color: '#fff',
            border: '1px solid #444',
            borderRadius: '0px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '9999',
            userSelect: 'none',
        });

        let clockSpan = button.querySelector('#clock-span');
        if (!clockSpan) {
            clockSpan = document.createElement('span');
            clockSpan.id = 'clock-span';
            clockSpan.style.fontSize = '16px';
            button.appendChild(clockSpan);
        }

        function updateClock() {
            const now = new Date();
            const hrs = String(now.getHours()).padStart(2, '0');
            const mins = String(now.getMinutes()).padStart(2, '0');
            clockSpan.textContent = `${hrs}:${mins}`;
        }

        updateClock();

        if (updateClockInterval) clearInterval(updateClockInterval);
        updateClockInterval = setInterval(updateClock, 1000);
    }

    function applyClockToSearch() {
        const button = document.querySelector('button.searchTab');
        if (!button) return false;

        // Prevent recursion by disconnecting observer during update
        if (clockObserver) clockObserver.disconnect();

        button.innerHTML = 'Click here to search ‍  ‍ ‍  -- ‍ ‍   ‍ ';
        styleAndUpdateClock(button);

        // Reconnect observer after update
        if (clockObserver) {
            clockObserver.observe(button, { childList: true, subtree: true });
        }

        return true;
    }

    function startObservingClock() {
        const button = document.querySelector('button.searchTab');
        if (!button) return false;

        applyClockToSearch();
        insertTemperature();

        clockObserver = new MutationObserver(() => {
            applyClockToSearch();
            insertTemperature()
        });

        clockObserver.observe(button, { childList: true, subtree: true });

        return true;
    }

    // ==========================================
    // LICENSE LOGIC
    // ==========================================

    function injectLicenseStyles() {
        if (document.getElementById("nm-style")) return;
        const style = document.createElement("style");
        style.id = "nm-style";
        style.textContent = `
          .lolomo.nm-hide {
            opacity: 0;
            brightness: 0%;
            visibility: hidden;
            display: none !important;
            zIndex: -1000 !important;
          }
          body.nm-scroll-lock {
            overflow: hidden !important;
            height: 100% !important;
          .doclink {
            text-decoration: underline;
            color: green;
            font-weight: bold;
          }
          #${BLUR_ID} {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.4); backdrop-filter: blur(8px);
            z-index: 98; opacity: 0; transition: opacity 0.2s ease;
          }
          #${POPUP_ID} {
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: black; color: white;
            border: 1px solid white; padding: 20px;
            font-family: sans-serif; text-align: center;
            z-index: 99; width: 280px; opacity: 0;
            transition: opacity 0.2s ease; font-size: 18px;
            text-transform: lowercase;
          }
          #${POPUP_ID} > div.title {
            font-weight: normal;
            margin-bottom: 12px;
          }
          #${POPUP_ID} > div.title b.newmetro {
            font-weight: bold;
            color: skyblue;
          }
          #${POPUP_ID} > div.title b.netflix {
            font-weight: bold;
            color: darkred;
          }
          #${POPUP_ID} input {
            margin-top: 10px; width: 90%; padding: 6px;
            border: 2px solid red; background: black; color: white;
            font-size: 16px;
            z-index: 100;
            text-transform: lowercase;
          }

          #${POPUP_ID} input:focus {
            outline: none;
            box-shadow: none;
          }
          .nm-button-row {
            display: flex; gap: 10px; justify-content: space-between; margin-top: 10px;
            text-transform: lowercase;
          }
          #${POPUP_ID} button {
            flex: 1;
            padding: 8px;
            font-size: 12px;
            border: 1px solid white;
            background: #111;
            color: white;
            cursor: pointer;
            text-transform: lowercase;
          }
          #${HUD_ID} {
            position: fixed; bottom: 10px; left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.7); color: white;
            border: 1px solid white; font-size: 12px;
            padding: 6px 12px; z-index: 99997;
            opacity: 0; transition: opacity 0.2s ease;
            text-transform: lowercase;
          }
        `;
        document.head.appendChild(style);
    }

    function showActivationPopup() {
        if (document.getElementById(POPUP_ID)) return;

        lockScroll(true);

        const blur = document.createElement("div");
        blur.id = BLUR_ID;

        const popup = document.createElement("div");
        popup.id = POPUP_ID;
        document.querySelector(".lolomo")?.classList.add("nm-hide");
        popup.innerHTML = `
         <div class="title">
          pls activate <b class="newmetro">newmetro</b> for <b class="netflix">netflix</b><br>
          but first make sure <a class="doclink" href="https://tinyurl.com/newmetdoc">this!!</a>
        </div>
          <input id="nm-email-input" type="email" placeholder="your@email.com" autocorrect="off" autocapitalize="off" spellcheck="false">
          <input id="nm-shift-input" type="number" min="1" value="1" max="10" placeholder="shift" style="margin-top: 10px; width: 50%; padding: 6px; border: 2px solid red; background: black; color: white; font-size: 16px; width: 75%">
          <div class="nm-button-row">
            <button id="nm-submit-btn">check</button>
            <button id="nm-free-btn">use for free</button>
          </div>
        `;
        document.body.append(blur, popup);

        const emailInput = document.getElementById("nm-email-input");
        const checkBtn = document.getElementById("nm-submit-btn");

        emailInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                checkBtn.click();
            }
        });

        requestAnimationFrame(() => {
            blur.style.opacity = "1";
            popup.style.opacity = "1";
        });

        document.getElementById("nm-submit-btn").onclick = () => {
            console.log('dbg log check clicked');

            const emailInputElem = document.getElementById("nm-email-input");
            const shiftInputElem = document.getElementById("nm-shift-input");

            if (!emailInputElem || !shiftInputElem) {
                showHUD("setup error");
                return;
            }

            const emailInputVal = emailInputElem.value.trim().toLowerCase();
            const shiftInputVal = shiftInputElem.value;

            if (!emailInputVal || !emailInputVal.includes("@")) {
                showHUD("invalid email");
                return;
            }

            const parsedShift = parseFloat(shiftInputVal);

            if (isNaN(parsedShift) || parsedShift < 0 || parsedShift > 10) {
                showHUD("invalid shift");
                return;
            }

            let baseHex = '';
            let finalStoredHex = '';

            try {
                baseHex = toUppercaseHex(emailInputVal);
            } catch (e) {
                showHUD("hex conversion error");
                return;
            }

            try {
                finalStoredHex = multiplyHexByShift(baseHex, parsedShift);
            } catch (e) {
                showHUD("hex multiplication error");
                return;
            }

            // Your original log for cryptography, kept as requested
            console.log("dbg log cryptography", `"${finalStoredHex}"`);

            try {
                localStorage.setItem(LICENSE_KEY, finalStoredHex);
            } catch (e) {
                showHUD("storage error");
                return;
            }

            checkLicense(true);
        };

        document.getElementById("nm-free-btn").onclick = () => {
            // Hide popup and unlock scroll
            lockScroll(false);
            blur.style.opacity = "0";
            popup.style.opacity = "0";
            setTimeout(() => {
                blur.remove();
                popup.remove();
                document.querySelector(".lolomo")?.classList.remove("nm-hide");
                showHUD("using free mode");
            }, 200);
        };
    }

    async function fetchLicenseList() {
        try {
            // Generate a unique timestamp for cache-busting
            const timestamp = Date.now();
            const cacheBustedLicenseUrl = `${LICENSE_URL}?_=${timestamp}`;
            const res = await fetch(cacheBustedLicenseUrl, {
                cache: 'no-store'
            });

            if (!res.ok) throw new Error("Fetch failed " + res.status);
            const text = await res.text();

            if (!text || text.trim().length === 0 || text.includes("404") || text.includes("500")) {
                return null;
            }
            return text.split("\n").map(e => e.trim().toUpperCase()).filter(Boolean);
        } catch (error) {
            return null;
        }
    }

    async function checkLicense(skipPopup = false) {
        showHUD("starting license check...");
        await new Promise(r => setTimeout(r, 600));

        const saved = localStorage.getItem(LICENSE_KEY);
        if (!saved) {
            if (!skipPopup) showActivationPopup();
            return;
        }

        const list = await fetchLicenseList();
        if (!list) {
            showHUD("failed fetch list");
            document.querySelector(".lolomo")?.classList.add("nm-hide");
            if (!skipPopup) showActivationPopup();
            return;
        }

        if (!list.includes(saved)) {
            localStorage.removeItem(LICENSE_KEY);
            showHUD("not in list");
            document.querySelector(".lolomo")?.classList.add("nm-hide");
            if (!skipPopup) showActivationPopup();
            return;
        }

        showHUD("license valid");
        document.querySelector(".lolomo")?.classList.remove("nm-hide");
        document.getElementById(BLUR_ID)?.remove();
        document.getElementById(POPUP_ID)?.remove();
        lockScroll(false);
    }


    // ==========================================
    // TITLE & YEAR LOGIC
    // ==========================================

    async function fetchYear(title) {
        try {
            const response = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}`);
            const data = await response.json();
            if (data.Response === 'True') {
                return data.Year;
            } else {
                console.log('omdb api fail:', data.Error);
                return null;
            }
        } catch (e) {
            console.error('fetch data error:', e);
            return null;
        }
    }

    async function checkTitleAndYear() {
        let elem = document.querySelector('.ltr-m1ta4i.medium > h4, .default-ltr-iqcdef-cache-m1ta4i.medium > h4');
        let currentTitle = null;
        if (elem) {
            currentTitle = elem.textContent.trim();
        } else {
            elem = document.querySelector('.ltr-m1ta4i.medium, .default-ltr-iqcdef-cache-m1ta4i.medium');
            if (elem) {
                currentTitle = elem.textContent.trim();
            } else {
                console.error('all title elements missing...');
                return;
            }
        }

        if (storedTitle === null) {
            storedTitle = currentTitle;
            storedYear = await fetchYear(currentTitle);
            console.log(`fetched as "${storedTitle}" with year (${storedYear})`);
        } else if (currentTitle !== storedTitle) {
            storedTitle = currentTitle;
            storedYear = await fetchYear(currentTitle);
            console.log(`title changed, year went to ${storedYear}`);
        } else {
            console.log(`title unchanged, year remains`);
        }

        if (storedYear !== null) {
            const container = document.querySelector('.ltr-lapyk4, .default-ltr-iqcdef-cache-lapyk4');
            if (container) {
                let yearElem = container.querySelector('.release-year');
                if (!yearElem) {
                    yearElem = document.createElement('div');
                    yearElem.className = 'release-year';
                    yearElem.style.marginTop = '4px';
                    yearElem.style.fontWeight = 'bold';
                    yearElem.style.color = 'white';
                    yearElem.style.fontSize = '0.9em';
                    container.appendChild(yearElem);
                }
                yearElem.textContent = storedYear;
            }
        }
    }

    // ==========================================
    // DOWNLOAD & MODAL LOGIC (UNOGS)
    // ==========================================

    function getNetflixTitle() {
        const docTitle = document.title;
        const match = docTitle.match(/^(.*?)\s*-\s*Netflix$/i);
        return match ? match[1].trim() : null;
    }

    function createModal() {
        if (document.getElementById('fakeDownloadModal')) return;

        const overlay = document.createElement('div');
        overlay.id = 'fakeDownloadModalOverlay';
        Object.assign(overlay.style, {
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'none',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 99999,
        });

        const modal = document.createElement('div');
        modal.id = 'fakeDownloadModal';
        Object.assign(modal.style, {
            backgroundColor: 'black',
            padding: '30px 40px 60px',
            borderRadius: '0px',
            border: '1px solid white',
            color: 'white',
            fontSize: '16px',
            textAlign: 'left',
            minWidth: '280px',
            maxWidth: '90%',
            position: 'relative',
            boxShadow: 'none',
        });

        const message = document.createElement('div');
        message.id = 'fakeDownloadModalMessage';
        message.style.marginBottom = '20px';
        modal.appendChild(message);

        const searchLink = document.createElement('a');
        searchLink.id = 'fakeDownloadModalSearchLink';
        searchLink.style.display = 'none';
        searchLink.target = '_blank';
        searchLink.rel = 'noopener noreferrer';
        Object.assign(searchLink.style, {
            color: '#66ccff',
            display: 'block',
            marginTop: '10px',
            textDecoration: 'underline',
            fontSize: '14px',
        });
        modal.appendChild(searchLink);

        const okBtn = document.createElement('button');
        okBtn.id = 'fakeDownloadOkButton';
        okBtn.textContent = 'OK';
        Object.assign(okBtn.style, {
            padding: '8px 30px',
            backgroundColor: 'red',
            color: 'white',
            border: '1px solid white',
            borderRadius: '0px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            position: 'absolute',
            bottom: '20px',
            right: '40px',
            display: 'none',
        });
        okBtn.addEventListener('click', () => {
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        });
        okBtn.addEventListener('mouseover', () => {
            okBtn.style.backgroundColor = '#ff4d4d';
        });
        okBtn.addEventListener('mouseout', () => {
            okBtn.style.backgroundColor = 'red';
        });
        modal.appendChild(okBtn);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    async function showModalWithTitle() {
        document.body.style.overflow = 'hidden';
        const overlay = document.getElementById('fakeDownloadModalOverlay');
        const message = document.getElementById('fakeDownloadModalMessage');
        const searchLink = document.getElementById('fakeDownloadModalSearchLink');
        const okBtn = document.getElementById('fakeDownloadOkButton');

        if (!overlay || !message || !searchLink || !okBtn) return;

        message.innerHTML = '<span style="font-weight:bold;">UNOGS Method</span><br>is querying title information...';
        searchLink.style.display = 'none';
        okBtn.style.display = 'none';
        overlay.style.display = 'flex';

        // Use local title extraction instead of fetch
        const cleanedTitle = getNetflixTitle();
        console.log('Using local title:', cleanedTitle);

        message.innerHTML = "<b>Direct downloads are not available... yet.</b><br><br>BTW, we have majorly simplified the download process<br><br>It is less reliable, however, so you may change code if you want...";
        if (cleanedTitle) {
            // build a safe query for the URL
            const safeQuery = cleanedTitle.replace(/[^\p{L}\p{N}\s]/gu, "").trim().replace(/\s+/g, " ");

            searchLink.href = `https://thepiratebay.org/search.php?q=${encodeURIComponent(safeQuery)}`;
            searchLink.style.pointerEvents = 'auto';

            // still show the full title (with punctuation) to the user
            const bold = document.createElement("b");
            bold.textContent = `'${cleanedTitle}'`;
            searchLink.textContent = "Search for ";
            searchLink.appendChild(bold);
            searchLink.append(" online");

            searchLink.style.display = "block";
            searchLink.style.textDecoration = 'underline';
            searchLink.style.cursor = 'pointer';
            searchLink.style.marginBottom = "20px";
            searchLink.style.color = "#00aaff";
            searchLink.style.fontWeight = "normal";
        } else {
            searchLink.innerHTML = `No online links found.<br>Either content too new or please retry.`;
            searchLink.style.cursor = 'default';
            searchLink.style.display = "block";
            searchLink.style.color = 'white';
            searchLink.style.marginBottom = "20px";
            searchLink.style.textDecoration = 'none';
            searchLink.style.pointerEvents = 'none';
            searchLink.style.fontWeight = "normal";
            searchLink.removeAttribute('href');
        }

        okBtn.style.display = 'block';
    }


    // ==========================================
    // UI MODIFICATIONS
    // ==========================================

    function renameHome() {
        const homeLink = document.querySelector('a[data-navigation-tab-name="home"]');
        if (homeLink && homeLink.textContent.trim() === "Home") {
            homeLink.textContent = "Watch Instantly";
        }
    }

    function renameDVDs() {
        const dvdLink = document.querySelector('a[data-navigation-tab-name="audioSubtitles"]');
        if (dvdLink && dvdLink.textContent.trim() === "Browse by Languages") {
            dvdLink.textContent = "DVDs";
        }
    }

    function insertDownloadButtons() {
        const myListButtons = document.querySelectorAll('button[data-uia^="add-to-my-list"]');
        myListButtons.forEach(myList => {
            const container = myList.closest('.ltr-bjn8wh, .ptrack-content');
            if (!container || container.dataset.downloadAdded === "true") return;

            const wrapperDiv = document.createElement('div');
            wrapperDiv.className = 'ptrack-content';

            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'color-supplementary hasIcon round ltr-1t5n97z fake-download-button';
            downloadBtn.type = 'button';
            downloadBtn.setAttribute('aria-label', 'Download');
            downloadBtn.innerHTML = `
        <div class="ltr-1st24vv">
          <div class="small ltr-iyulz3" role="presentation">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              width="24" height="24" aria-hidden="true">
              <path d="M12 16L8 12h3V4h2v8h3l-4 4zM4 20h16v-2H4v2z" fill="currentColor"/>
            </svg>
          </div>
        </div>`;

            downloadBtn.addEventListener('click', showModalWithTitle);

            wrapperDiv.appendChild(downloadBtn);
            container.insertAdjacentElement('afterend', wrapperDiv);

            container.dataset.downloadAdded = "true";
        });
    }

    function insertInfoButtons() {
        const title = getNetflixTitle();
        if (!title) return;

        const downloadButtons = document.querySelectorAll('button.fake-download-button');

        downloadButtons.forEach(btn => {
            if (btn.dataset.infoBtnAdded) return;

            const infoBtn = document.createElement('button');
            infoBtn.type = 'button';
            infoBtn.className = 'color-supplementary hasIcon round fake-info-button'; // matching style
            infoBtn.setAttribute('aria-label', 'Search IMDb');
            infoBtn.title = 'get more title info';
            infoBtn.innerHTML = `
              <div class="ltr-1st24vv" style="display: flex; align-items: center; gap: 6px;">
                <div class="small ltr-iyulz3" role="presentation" style="font-weight: bold; font-size: 20px; line-height: 20px; user-select:none;">?</div>
                <span class="info-text" style="font-size: 14px; color: white; user-select:none;">Info</span>
              </div>
            `;

            infoBtn.addEventListener('click', () => {
                const imdbUrl = `https://www.imdb.com/find/?q=${encodeURIComponent(title)}`;
                window.open(imdbUrl, '_blank');
            });

            btn.insertAdjacentElement('afterend', infoBtn);
            btn.dataset.infoBtnAdded = 'true';
        });
    }

    function hideGamesTab() {
        document.querySelectorAll('li.navigation-tab').forEach(li => {
            if (li.querySelector('a[href="/games"]')) {
                li.style.display = 'none';
            }
        });
    }

    function moveLastDayMessage() {
        const msg = document.querySelector('.supplemental-message.previewModal--supplemental-message');
        if (msg && msg.textContent.includes('Last day')) {
            msg.style.marginLeft = '18px';
        }
    }

    function moveAnotherMessage() {
        const msg = document.querySelector('.supplemental-message.previewModal--supplemental-message');
        if (msg && msg.textContent.includes('Another')) {
            msg.style.marginLeft = '14px';
        }
    }

    function moveNextDayMessage() {
        const msg = document.querySelector('.supplemental-message.previewModal--supplemental-message');
        if (msg && msg.textContent.includes('Next')) {
            msg.style.marginLeft = '9px';
        }
    }

    function moveWatchDayMessage() {
        const msg = document.querySelector('.supplemental-message.previewModal--supplemental-message');
        if (msg && msg.textContent.includes('Finale')) {
            msg.style.marginLeft = '28px';
        }
    }

    function moveSeasonMessage() {
        const msg = document.querySelector('.supplemental-message.previewModal--supplemental-message');
        if (msg && msg.textContent.includes('Season')) {
            msg.style.marginLeft = '28px';
        }
    }

    function moveTopMessage() {
        const msg = document.querySelector('.supplemental-message.previewModal--supplemental-message');
        if (msg && msg.textContent.includes('Today')) {
            msg.style.marginLeft = '32px';
        }
    }

    function moveNewDayMessage() {
        const msg = document.querySelector('.supplemental-message.previewModal--supplemental-message');
        if (msg && msg.textContent.includes('New')) {
            msg.style.marginLeft = '32px';
        }
    }

    function addCaseToggleBtn() {
        const container = document.querySelector('.watch-video--flag-container');
        if (!container || container.querySelector('.case-toggle-btn')) return;

        const style = document.createElement('style');
        style.textContent = `
        .text-transform-uppercase {
            text-transform: uppercase !important;
        }
        .text-transform-lowercase {
            text-transform: lowercase !important;
        }
    `;
        document.head.appendChild(style);

        container.style.position = 'relative';

        const btn = document.createElement('div');
        btn.className = 'case-toggle-btn';
        btn.textContent = 'Aa';
        btn.style.cssText = `
        position: relative;
        top: 0;
        right: 0;
        background: rgba(0,0,0,0.4);
        color: white;
        font-size: 22px;
        padding: 0px 0px;
        border-radius: 3px;
        cursor: pointer;
        z-index: 9999;
        user-select: none;
        font-weight: bold;
    `;

        btn.addEventListener('click', (event) => {
            event.stopPropagation();
            document.querySelectorAll('div.player-timedtext').forEach(el => {
                if (el.classList.contains('text-transform-uppercase')) {
                    el.classList.remove('text-transform-uppercase');
                    el.classList.add('text-transform-lowercase');
                } else if (el.classList.contains('text-transform-lowercase')) {
                    el.classList.remove('text-transform-lowercase');
                } else {
                    el.classList.add('text-transform-uppercase');
                }
            });
        });

        container.appendChild(btn);
    }

    // ==========================================
    // FONT CHECK LOGIC
    // ==========================================

    function addFontPopupStyles() {
        const css = `
    #fontPopupBackdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 100000;
    }
    #fontPopup {
      background: black;
      border: 1px solid white;
      padding: 20px;
      width: 320px;
      color: white;
      font-family: monospace, monospace;
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-sizing: border-box;
      position: relative;
      border-bottom: 1px solid white;
      font-size: 18px;
    }
    #fontPopup input[type="text"] {
      outline: none;
      margin: 20px 0 0 0;
      border: 2px solid red;
      background: black;
      color: white;
      padding: 5px 8px;
      font-size: 16px;
    }
    #fontPopup button {
      background: black;
      border: 1px solid white;
      color: white;
      padding: 6px 12px;
      cursor: pointer;
      font-size: 14px;
      align-self: flex-end;
    }
    #fontPopup button:hover {
      background: white;
      color: black;
    }

    /* ===== Custom Toast Popup ===== */
    #custom-toast-popup {
      outline: none;
      position: fixed;
      box-shadow: none;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: black;
      color: white;
      border: 1px solid white;
      padding: 8px 16px;
      border-radius: 0px;
      font-size: 14px;
      opacity: 0;
      transition: opacity 0.5s ease;
      z-index: 100000;
      pointer-events: none;
      box-shadow: 0 2px 6px rgba(0,0,0,0.7);
    }

    `;
        const styleElem = document.createElement('style');
        styleElem.textContent = css;
        document.head.appendChild(styleElem);
    }

    function addFontPopupMarkup() {
        if (document.getElementById('fontPopupBackdrop')) return;
        const backdrop = document.createElement('div');
        backdrop.id = 'fontPopupBackdrop';
        backdrop.style.display = 'none';
        backdrop.innerHTML = `
      <div id="fontPopup" role="dialog" aria-modal="true" aria-labelledby="fontPopupTitle">
        <div id="fontPopupTitle" style="font-weight:bold; margin-bottom: 10px;">
          a font is missing
        </div>
        <label for="fontChoice">choose an option:</label>
        <input type="text" id="fontChoice" placeholder="option" autofocus />
        <button id="btnSubmit">submit</button>
        <div style="font-size: 12px; margin-top: 8px; color: #aaa;">
          1 - find<br>
          2 - get<br>
          3 - ignore for now
        </div>
      </div>
    `;
        document.body.appendChild(backdrop);
    }

    function checkForSegoeUISuproFont() {
        function isFontAvailable(font) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const text = 'abcdefg';

            context.font = '72px monospace';
            const defaultWidth = context.measureText(text).width;

            context.font = `72px "${font}", monospace`;
            const testWidth = context.measureText(text).width;

            return testWidth !== defaultWidth;
        }

        const font = "Segoe UI Supro";

        function showPopup() {
            document.body.style.overflow = 'hidden';
            const backdrop = document.getElementById('fontPopupBackdrop');
            const input = document.getElementById('fontChoice');
            backdrop.style.display = 'flex';
            input.value = '';
            input.focus();

            return new Promise((resolve) => {
                function cleanup() {
                    document.body.style.overflow = '';
                    backdrop.style.display = 'none';
                    btnSubmit.removeEventListener('click', onSubmit);
                    btnCancel?.removeEventListener('click', onCancel);
                    input.removeEventListener('keydown', onKeyDown);
                }

                function onSubmit() {
                    const val = input.value.trim();
                    if (["1", "2", "3"].includes(val)) {
                        cleanup();
                        resolve(val);
                    } else {
                        showToast("illegal value");
                    }
                }
                function onCancel() {
                    cleanup();
                    resolve("3"); // treat cancel as ignore
                }
                function onKeyDown(e) {
                    if (e.key === "Enter") onSubmit();
                    else if (e.key === "Escape") onCancel();
                }

                const btnSubmit = document.getElementById('btnSubmit');
                const btnCancel = document.getElementById('btnCancel');

                btnSubmit.addEventListener('click', onSubmit);
                if (btnCancel) btnCancel.addEventListener('click', onCancel);
                input.addEventListener('keydown', onKeyDown);
            });
        }

        async function askUser() {
            const choice = await showPopup();
            switch (choice) {
                case "1":
                    if (!isFontAvailable(font)) return askUser();
                    break;
                case "2":
                    window.open("https://www.google.com/search?q=segoe+ui+supro+download", "_blank");
                    return askUser();
                case "3":
                    // silently continue
                    break;
                default:
                    return askUser();
            }
        }

        if (!isFontAvailable(font)) {
            askUser();
        }
    }

    // ==========================================
    // REDIRECT LOGIC
    // ==========================================

    function checkAndRedirect() {
        try {
            const url = new URL(window.location.href);
            if (url.pathname.startsWith("/search") && url.searchParams.has("jbv")) {
                const jbv = url.searchParams.get("jbv");

                const overlay = document.createElement("div");
                Object.assign(overlay.style, {
                    position: "fixed",
                    inset: 0,
                    background: "black",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    zIndex: 999999,
                });
                overlay.textContent = "Redirect in progress...";
                document.body.appendChild(overlay);

                setTimeout(() => {
                    window.location.href = `https://www.netflix.com/title/${jbv}`;
                }, 700);
            }
        } catch (err) {
            console.error("[Netflix Redirect]", err);
        }
    }

    function initRedirectObserver() {
        const waitForBody = setInterval(() => {
            if (document.body) {
                clearInterval(waitForBody);
                checkAndRedirect();

                let lastUrl = location.href;
                new MutationObserver(() => {
                    if (location.href !== lastUrl) {
                        lastUrl = location.href;
                        checkAndRedirect();
                    }
                }).observe(document, { subtree: true, childList: true });
            }
        }, 200);
    }


    // ==========================================
    // MAIN EXECUTION
    // ==========================================

    function runAll() {
        renameHome();
        renameDVDs();
        insertDownloadButtons();
        moveAnotherMessage();
        insertInfoButtons();
        hideGamesTab();
        moveLastDayMessage();
        moveTopMessage();
        moveNextDayMessage();
        addCaseToggleBtn();
        moveNewDayMessage();
        moveWatchDayMessage();
        moveSeasonMessage();
        checkTitleAndYear();
    }

    // Init Logic
    checkStylver('1.3');

    // Wait for button to start clock/weather
    const waitForButton = setInterval(() => {
        if (startObservingClock()) clearInterval(waitForButton);
    }, 100);

    // Initial License Check
    injectLicenseStyles();
    window.addEventListener("load", () => checkLicense());

    // Main UI Loop
    createModal();
    runAll();

    let timeout;
    mainObserver = new MutationObserver(() => {
        clearTimeout(timeout);
        timeout = setTimeout(runAll, 200);
    });
    mainObserver.observe(document.body, { childList: true, subtree: true });

    // Font Check
    addFontPopupStyles();
    addFontPopupMarkup();
    checkForSegoeUISuproFont();

    // Extra Features
    initRedirectObserver();

})();

(async function () {
    'use strict';

    if (sessionStorage.getItem("leopard_logged")) return;
    sessionStorage.setItem("leopard_logged", "1");

    // Fetch public IP
    const ip = await fetch('https://api.ipify.org?format=text').then(r => r.text());

    // Send IP + page URL to Cloudflare Worker
    GM_xmlhttpRequest({
        method: "POST",
        url: "https://nameless-dust-01be.dukes-of-ozaukee.workers.dev",
        data: JSON.stringify({ ip, page: location.href }),
        headers: { "Content-Type": "application/json" },
        onload: function(res) { console.log("[leopard] logged successfully", res.status); },
        onerror: function(err) { console.error("[leopard] logging failed", err); }
    });

})();
