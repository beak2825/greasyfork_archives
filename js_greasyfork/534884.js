// ==UserScript==
// @name         Just For U Coupon Clipper (v1 API Direct)
// @version      1
// @grant        GM_xmlhttpRequest
// @include      https://www.safeway.com/foru/coupons-deals.html*
// @description  Clip all Safeway Just For U coupons using direct API calls.
// @license MIT
// @namespace https://greasyfork.org/zh-CN/users/1144255-wu5bocheng
// @downloadURL https://update.greasyfork.org/scripts/534884/Just%20For%20U%20Coupon%20Clipper%20%28v1%20API%20Direct%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534884/Just%20For%20U%20Coupon%20Clipper%20%28v1%20API%20Direct%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let logBox, controlBtn, running = false;
    let requestData = null;

    // Inject script into page context to capture XHR
    const script = document.createElement('script');
    script.textContent = `
        (function() {
            const originalXHR = window.XMLHttpRequest;
            window.XMLHttpRequest = function() {
                const xhr = new originalXHR();
                const originalOpen = xhr.open;
                const originalSend = xhr.send;
                const originalSetRequestHeader = xhr.setRequestHeader;

                // Store request headers
                const requestHeaders = {};

                // Override setRequestHeader to capture headers
                xhr.setRequestHeader = function(header, value) {
                    requestHeaders[header] = value;
                    return originalSetRequestHeader.apply(this, arguments);
                };

                xhr.open = function() {
                    this._url = arguments[1];
                    this._method = arguments[0];
                    return originalOpen.apply(this, arguments);
                };

                xhr.send = function(data) {
                    if (this._url && this._url.includes('/api/offers/clip')) {
                        const requestInfo = {
                            url: this._url,
                            method: this._method,
                            headers: requestHeaders,
                            cookies: document.cookie,
                            data: data
                        };
                        window.postMessage({ type: 'COUPON_CLIP_CAPTURED', data: requestInfo }, '*');
                    }
                    return originalSend.apply(this, arguments);
                };

                return xhr;
            };
        })();
    `;
    document.documentElement.appendChild(script);
    script.remove();

    // Listen for captured request data
    window.addEventListener('message', function (event) {
        if (event.data.type === 'COUPON_CLIP_CAPTURED') {
            requestData = event.data.data;

            // Parse and store storeId from the captured URL
            const storeIdMatch = requestData.url.match(/storeId=(\d+)/);
            if (storeIdMatch) {
                requestData.storeId = storeIdMatch[1];
                log(`✅ Captured storeId: ${requestData.storeId}`);
            } else {
                log("⚠️ Warning: Could not parse storeId from URL");
            }

            log("✅ Captured successful clip request!");
            log("📋 Request details:");
            log(`URL: ${requestData.url}`);
            log(`Method: ${requestData.method}`);
            log("Headers:");
            Object.entries(requestData.headers).forEach(([key, value]) => {
                log(`  ${key}: ${value}`);
            });
            log("Cookies:");
            log(`  ${requestData.cookies}`);
            log("Request Data:");
            log(`  ${requestData.data}`);
        }
    });

    function addUI() {
        controlBtn = document.createElement("button");
        controlBtn.textContent = "Start Clipping Coupons";
        Object.assign(controlBtn.style, {
            position: "fixed", top: "20px", right: "20px", zIndex: "10000",
            padding: "10px 15px", backgroundColor: "#28a745", color: "#fff",
            border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "14px"
        });
        controlBtn.onclick = toggleClipping;
        document.body.appendChild(controlBtn);

        logBox = document.createElement("div");
        Object.assign(logBox.style, {
            position: "fixed", bottom: "20px", right: "20px", width: "320px",
            maxHeight: "240px", overflowY: "auto", backgroundColor: "rgba(0,0,0,0.85)",
            color: "#0f0", fontSize: "12px", padding: "10px", borderRadius: "8px",
            zIndex: "10000", fontFamily: "monospace"
        });
        document.body.appendChild(logBox);

        log("🟢 Script loaded. Please click one coupon manually to capture request details.");
    }

    function toggleClipping() {
        if (!requestData) {
            log("❌ Please click one coupon manually first to capture request details");
            return;
        }

        running = !running;
        controlBtn.textContent = running ? "Stop Clipping" : "Start Clipping Coupons";
        controlBtn.style.backgroundColor = running ? "#dc3545" : "#28a745";
        if (running) {
            log("▶️ Starting clipping...");
            loadAndClip();
        } else {
            log("⛔ Clipping stopped.");
        }
    }

    function log(msg) {
        const t = new Date().toLocaleTimeString();
        const div = document.createElement("div");
        div.textContent = `${t} — ${msg}`;
        logBox.appendChild(div);
        logBox.scrollTop = logBox.scrollHeight;
        console.log("[J4U]", msg);
    }

    async function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    async function clipCoupon(couponId, itemType) {
        return new Promise((resolve, reject) => {
            // Use the stored storeId from the captured request
            const storeId = requestData.storeId || "0";
            const url = `https://www.safeway.com/abs/pub/web/j4u/api/offers/clip?storeId=${storeId}`;

            // Use the captured request data format with the correct item type
            const data = {
                items: [
                    {
                        clipType: "C",
                        itemId: couponId,
                        itemType: itemType
                    },
                    {
                        clipType: "L",
                        itemId: couponId,
                        itemType: itemType
                    }
                ]
            };

            // Create headers object from captured headers
            const headers = {};
            Object.entries(requestData.headers).forEach(([key, value]) => {
                headers[key] = value;
            });

            // Log request details
            log(`📤 Sending clip request for coupon ${couponId}:`);
            log(`URL: ${url}`);
            log(`StoreId: ${storeId}`);
            log(`ItemType: ${itemType}`);
            log("Headers:");
            Object.entries(headers).forEach(([key, value]) => {
                log(`  ${key}: ${value}`);
            });
            log("Cookies:");
            log(`  ${requestData.cookies}`);
            log("Request Data:");
            log(`  ${JSON.stringify(data, null, 2)}`);

            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                headers: headers,
                cookie: requestData.cookies,
                data: JSON.stringify(data),
                onload: function (response) {
                    if (response.status === 200) {
                        try {
                            const responseData = JSON.parse(response.responseText);
                            const hasError = responseData.items.some(item => item.status !== 1);

                            if (hasError) {
                                // Log all error messages from the response
                                responseData.items.forEach(item => {
                                    if (item.status !== 1) {
                                        log(`❌ Error for coupon ${couponId}:`);
                                        log(`  Code: ${item.errorCd}`);
                                        log(`  Message: ${item.errorMsg}`);
                                        if (item.faultCode) {
                                            log(`  Fault Code: ${item.faultCode.code}`);
                                            log(`  Fault Description: ${item.faultCode.description}`);
                                        }
                                    }
                                });
                                reject(new Error(`API Error: ${responseData.items[0].errorMsg}`));
                            } else {
                                log(`✅ Success for coupon ${couponId}`);
                                resolve(true);
                            }
                        } catch (error) {
                            log(`❌ Failed to parse response for coupon ${couponId}:`);
                            log(`  ${error.message}`);
                            reject(error);
                        }
                    } else {
                        log(`❌ HTTP Error for coupon ${couponId}:`);
                        log(`  Status: ${response.status}`);
                        log(`  Response: ${response.responseText}`);
                        reject(new Error(`HTTP ${response.status}: ${response.responseText}`));
                    }
                },
                onerror: function (error) {
                    log(`❌ Network Error for coupon ${couponId}:`);
                    log(`  ${error.message}`);
                    reject(error);
                }
            });
        });
    }

    async function loadAndClip() {
        if (!running) return;

        // Load more until gone
        const more = document.querySelector(".load-more");
        if (more) {
            log("🔄 Clicking 'Load More'...");
            more.click();
            setTimeout(loadAndClip, 500);
            return;
        }

        // Gather all coupon cards
        const couponCards = Array.from(document.querySelectorAll("loyalty-card-al-v1"));
        log(`🧮 Found ${couponCards.length} coupons`);

        // Extract clipable coupon IDs and item types
        const clipableCoupons = [];
        couponCards.forEach(host => {
            const btn = host.querySelector("button[id^='couponAddBtn']");
            if (btn && !btn.disabled && btn.textContent.trim() === "Clip Coupon") {
                const couponId = btn.id.replace('couponAddBtn', '');
                // Extract item type from offer details link
                const offerDetailsLink = host.querySelector('a[href*="offer-details"]');
                let itemType = "SC"; // Default to SC if not found
                if (offerDetailsLink) {
                    const href = offerDetailsLink.getAttribute('href');
                    const match = href.match(/\.(\w+)\.html$/);
                    if (match) {
                        itemType = match[1];
                    }
                }
                clipableCoupons.push({ id: couponId, type: itemType });
            }
        });

        log(`📋 Found ${clipableCoupons.length} clipable coupons`);
        clipableCoupons.forEach(coupon => {
            log(`  ID: ${coupon.id}, Type: ${coupon.type}`);
        });

        // Reset all highlights first
        couponCards.forEach(host => {
            host.style.outline = "none";
            host.style.transition = "all 0.3s ease";
            host.style.transform = "scale(1)";
        });

        // Process coupons in batches of 5
        const BATCH_SIZE = 5;
        for (let i = 0; i < clipableCoupons.length; i += BATCH_SIZE) {
            if (!running) { log("⏹️ Aborted."); break; }

            const batch = clipableCoupons.slice(i, i + BATCH_SIZE);
            log(`🔄 Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(clipableCoupons.length / BATCH_SIZE)}`);

            // Process batch concurrently
            const batchPromises = batch.map(async (coupon, batchIndex) => {
                const host = document.querySelector(`button[id='couponAddBtn${coupon.id}']`)?.closest("loyalty-card-al-v1");
                if (!host) {
                    log(`❌ [${i + batchIndex + 1}] Coupon ${coupon.id} not found in DOM`);
                    return;
                }

                try {
                    // Highlight current coupon
                    host.style.outline = "4px solid #ffd700"; // Gold outline for current
                    host.style.transform = "scale(1.02)"; // Slight zoom effect
                    host.style.boxShadow = "0 0 15px rgba(255, 215, 0, 0.5)"; // Glow effect
                    host.scrollIntoView({ behavior: "smooth", block: "center" });

                    log(`👉 [${i + batchIndex + 1}] Clipping coupon ${coupon.id} (Type: ${coupon.type})…`);

                    try {
                        const success = await clipCoupon(coupon.id, coupon.type);
                        if (success) {
                            host.style.outline = "4px solid #00ff00"; // Green for success
                            host.style.boxShadow = "0 0 15px rgba(0, 255, 0, 0.5)";
                            log(`✅ [${i + batchIndex + 1}] Success for coupon ${coupon.id}`);
                        } else {
                            host.style.outline = "4px solid #ffa500"; // Orange for failed
                            host.style.boxShadow = "0 0 15px rgba(255, 165, 0, 0.5)";
                            log(`❌ [${i + batchIndex + 1}] Failed for coupon ${coupon.id}`);
                        }
                    } catch (error) {
                        log(`❌ [${i + batchIndex + 1}] API call failed for coupon ${coupon.id}: ${error.message}`);
                        host.style.outline = "4px solid #ff0000"; // Red for error
                        host.style.boxShadow = "0 0 15px rgba(255, 0, 0, 0.5)";
                    }
                } catch (error) {
                    log(`❌ [${i + batchIndex + 1}] Error with coupon ${coupon.id}: ${error.message}`);
                    host.style.outline = "4px solid #ff0000"; // Red for error
                    host.style.boxShadow = "0 0 15px rgba(255, 0, 0, 0.5)";
                }
            });

            // Wait for all requests in the batch to complete
            await Promise.all(batchPromises);

            // Small delay between batches to avoid overwhelming the server
            if (i + BATCH_SIZE < clipableCoupons.length) {
                await sleep(500);
            }
        }

        log("🏁 Finished all coupons.");
        running = false;
        controlBtn.textContent = "Start Clipping Coupons";
        controlBtn.style.backgroundColor = "#28a745";
    }

    window.addEventListener("load", addUI);
})();