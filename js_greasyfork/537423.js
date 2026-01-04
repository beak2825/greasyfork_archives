// ==UserScript==
// @name         一键预览GGbase的图片|GGBases Image Extractor Button
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.1
// @description  一键预览GGBASE的图片，Adds a button to GGBases to extract and display preview images with EXHENTAI links in a new window.
// @author       Lain
// @match        https://www.ggbases.com/*
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.10/dayjs.min.js
// @downloadURL https://update.greasyfork.org/scripts/537423/%E4%B8%80%E9%94%AE%E9%A2%84%E8%A7%88GGbase%E7%9A%84%E5%9B%BE%E7%89%87%7CGGBases%20Image%20Extractor%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/537423/%E4%B8%80%E9%94%AE%E9%A2%84%E8%A7%88GGbase%E7%9A%84%E5%9B%BE%E7%89%87%7CGGBases%20Image%20Extractor%20Button.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // --- GM_addStyle for button styling ---
    GM_addStyle(`
        #extractImagesBtn {
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            padding: 10px 15px;
            background-color: #8656d4; /* Original search button color */
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        #extractImagesBtn:hover {
            background-color: #6a42b4;
        }
    `);

    // --- Create and add the button to the page ---
    const button = document.createElement('button');
    button.id = 'extractImagesBtn';
    button.textContent = '提取预览图';
    document.body.appendChild(button);

    // --- Add click event listener to the button ---
    button.addEventListener('click', function() {
        extractAndShowImages();
    });

    function extractAndShowImages() {
        // --- Helper function to get formatted date ---
        // This function `getFormattedDate` is defined but currently not used anywhere in the script.
        // You can remove it if it's not needed, or implement its usage.
        let getFormattedDate;
        if (typeof dayjs === 'undefined') {
            console.warn('dayjs not found on page, using manual date formatting.');
            getFormattedDate = function() {
                const d = new Date();
                const YYYY = d.getFullYear();
                const MM = String(d.getMonth() + 1).padStart(2, '0');
                const DD = String(d.getDate()).padStart(2, '0');
                return `${YYYY}-${MM}-${DD}`;
            };
        } else {
            getFormattedDate = function() {
                return dayjs().format("YYYY-MM-DD");
            };
        }

        // --- Original gendlcover and gengccover ---
        function gendlcover(original_did_str, type) {
            var pre0 = null, dpre0 = null, npre = null;
            const did_as_string_for_npre = String(original_did_str);
            if (did_as_string_for_npre.startsWith('0') && did_as_string_for_npre.length === 8) npre = '0'; // Used startsWith and ===
            let did_num = parseInt(original_did_str, 10);
            if (isNaN(did_num)) return "error_parsing_gendl_did.jpg";
            let rid_num = Math.ceil(did_num / 1000) * 1000;
            if (did_num < 10) pre0 = "00000"; else if (did_num < 100) pre0 = "0000"; else if (did_num < 1000) pre0 = "000"; else if (did_num < 10000) pre0 = "00"; else if (did_num < 100000) pre0 = "0";
            if (rid_num < 10000) dpre0 = "00"; else if (rid_num < 100000) dpre0 = "0";
            let final_did_val = String(did_num); let final_rid_val = String(rid_num);
            if (pre0) final_did_val = pre0 + final_did_val; if (dpre0) final_rid_val = dpre0 + final_rid_val;
            if (npre) { final_did_val = npre + final_did_val; final_rid_val = npre + final_rid_val; }
            var usecoverproxy = false; // Default to dlsite for this function
            const baseUrl = usecoverproxy ? "//cover.ydgal.com/" : "//img.dlsite.jp/";
            const pathPrefix = usecoverproxy ? "_200_cover/" : "resize/images2/work/";
            return baseUrl + pathPrefix +
                   (!type ? "doujin/RJ" : "professional/VJ") +
                   final_rid_val + "/" +
                   (!type ? "RJ" : "VJ") +
                   final_did_val + "_img_main_240x240.jpg";
        }

        function gengccover(did_str) {
            return "//cover.ydgal.com/_300_cover/getchu/gc" + String(did_str) + ".jpg";
        }

        function originalPageCoverurl(tid_suffix) {
            if (!tid_suffix || typeof tid_suffix !== 'string') return null;
            var num_str = tid_suffix.split("_")[0];
            var num = parseInt(num_str, 10);
            if (isNaN(num)) return null;
            var coverUrlBase = "//cover.ydgal.com/_200_cover/";
            if (num > 1360000) {
                return coverUrlBase + "new/" + tid_suffix;
            } else {
                return coverUrlBase + "old/" + tid_suffix;
            }
        }

        // --- Step 2, 3, 4: Find items, extract info, and collect URLs ---
        const imageElements = document.querySelectorAll('a[name="title"]');
        const itemsData = []; // To store {imageUrl, title, exhentaiLink}

        imageElements.forEach(el => {
            const cAttribute = el.getAttribute('c');
            const titleText = (el.textContent || el.innerText).trim();
            let imageUrl = null;
            let exhentaiLink = null;

            let parentTr = el.closest('tr');
            if (parentTr) {
                const exLinkElement = parentTr.querySelector('a[title="EXHENTAI"]');
                if (exLinkElement) {
                    exhentaiLink = exLinkElement.getAttribute('href');
                }
            }

            if (cAttribute) {
                if (cAttribute.startsWith('//cover.ydgal.com/_200_cover/')) {
                    imageUrl = cAttribute;
                    if (!imageUrl.startsWith('https:')) { imageUrl = 'https:' + imageUrl; }
                    const parts = imageUrl.split('/');
                    const lastPart = parts[parts.length -1];
                    if (lastPart.match(/^\d+_[0-9a-fA-F]+$/)) { imageUrl += '_';}
                } else if (cAttribute.match(/^(\d+_[0-9a-fA-F]+_)$/)) {
                    imageUrl = originalPageCoverurl(cAttribute);
                    if (imageUrl && !imageUrl.startsWith('https:')) imageUrl = 'https:' + imageUrl;
                } else {
                    let match_dlsite_rj = cAttribute.match(/^(?:RJ|d)(\d{6,8})$/i);
                    let match_dlsite_vj = cAttribute.match(/^(?:VJ|v)(\d{6,8})$/i);
                    let match_getchu = cAttribute.match(/^(?:gc|g)(\d{6,7})$/i);

                    if (match_dlsite_rj && match_dlsite_rj[1]) {
                        imageUrl = gendlcover(match_dlsite_rj[1], 0);
                    } else if (match_dlsite_vj && match_dlsite_vj[1]) {
                        imageUrl = gendlcover(match_dlsite_vj[1], 1);
                    } else if (match_getchu && match_getchu[1]) {
                        // POTENTIAL LOGIC ISSUE: The original condition here:
                        // if (!(match_getchu[0].toLowerCase().startsWith('g') && !cAttribute.match(/^g\d{6,7}$/i) ))
                        // effectively SKIPS calling gengccover for `cAttribute` values like "gc123456"
                        // but processes "g123456". This is likely unintended.
                        // If you want to process all matches from `^(?:gc|g)(\d{6,7})$/i`,
                        // you can simplify this or remove the inner `if`.
                        // For now, kept original logic, but commented for review:
                        if (!(match_getchu[0].toLowerCase().startsWith('g') && !cAttribute.match(/^g\d{6,7}$/i) )) {
                             imageUrl = gengccover(match_getchu[1]);
                        }
                        // If you want to process both 'g' and 'gc' prefixes from the regex match:
                        // imageUrl = gengccover(match_getchu[1]); // Simplified: always use if match_getchu is valid.
                    }
                    if (imageUrl && !imageUrl.startsWith('https:')) imageUrl = 'https:' + imageUrl;
                }
            }

            if (imageUrl) {
                itemsData.push({
                    imageUrl: imageUrl,
                    title: titleText,
                    exhentaiLink: exhentaiLink
                });
            } else {
                console.warn('Could not determine preview URL for c:', cAttribute, 'for title:', titleText);
            }
        });

        // --- Step 5: Open new window and display images and links ---
        if (itemsData.length > 0) {
            function populateNewWindow(targetWindow, dataToDisplay) {
                targetWindow.document.write('<html><head><title>Preview Images with Links</title><style>' +
                    'body { display: flex; flex-wrap: wrap; gap: 10px; background-color: #282c34; padding:10px; justify-content: center; font-family: sans-serif; } ' +
                    '.img-container { display: flex; flex-direction: column; align-items: center; border: 1px solid #555; padding: 8px; background-color: #333944; border-radius: 4px; width: 250px; box-sizing: border-box;} ' +
                    'img { width: 240px; height: 240px; border: 1px solid #ddd; margin-bottom: 5px; object-fit: contain; background-color: #fff; } ' +
                    'p.title { font-size: 12px; color: #eee; text-align: center; margin: 0 0 5px 0; max-width: 240px; word-wrap: break-word; height: 2.4em; overflow: hidden; line-height: 1.2em; }' +
                    'a.ex-link { display: inline-block; background-color: #e91e63; color: white; padding: 5px 10px; text-decoration: none; border-radius: 3px; font-size: 12px; margin-top: 5px; }' +
                    'a.ex-link:hover { background-color: #c2185b; }' +
                    'p.error-msg { font-size: 11px; color: #ff7777; text-align: center; margin-top: 3px; height: auto !important; }' +
                    '</style></head><body></body></html>');
                targetWindow.document.close(); // Close the document for writing

                dataToDisplay.forEach((item, index) => {
                    const container = targetWindow.document.createElement('div');
                    container.className = 'img-container';

                    const img = targetWindow.document.createElement('img');
                    img.src = item.imageUrl;
                    img.alt = item.title || 'Preview ' + (index + 1);
                    img.title = item.title || 'Preview';
                    img.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');

                    img.onerror = function() {
                        this.alt = 'Error loading: ' + this.src;
                        this.style.border = '1px solid red';
                        this.src = "data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'%3E%3Crect width='240' height='240' fill='%23e0e0e0'/%3E%3Ctext x='50%' y='50%' font-family='sans-serif' font-size='16px' fill='%23757575' dominant-baseline='middle' text-anchor='middle'%3EImage not found%3C/text%3E%3C/svg%3E";
                        let pError = targetWindow.document.createElement('p');
                        pError.className = 'error-msg';
                        const originalFailedUrl = item.imageUrl; // Closure captures item
                        pError.textContent = 'Failed: ' + originalFailedUrl.substring(originalFailedUrl.lastIndexOf('/') + 1);
                        if (!this.parentNode.querySelector('p.error-msg')) {
                            let insertBeforeNode = this.nextSibling; // Should be the title paragraph
                            if (insertBeforeNode && insertBeforeNode.nextSibling) { // If EX link exists after title
                                insertBeforeNode = insertBeforeNode.nextSibling; // Insert before EX link
                            }
                            this.parentNode.insertBefore(pError, insertBeforeNode);
                        }
                    };
                    container.appendChild(img);

                    const titlePara = targetWindow.document.createElement('p');
                    titlePara.className = 'title';
                    titlePara.textContent = item.title || ('Image ' + (index + 1));
                    container.appendChild(titlePara);

                    if (item.exhentaiLink) {
                        const exLink = targetWindow.document.createElement('a');
                        exLink.href = item.exhentaiLink;
                        exLink.textContent = 'E站链接';
                        exLink.target = '_blank';
                        exLink.className = 'ex-link';
                        container.appendChild(exLink);
                    }
                    targetWindow.document.body.appendChild(container);
                });
                console.log(`Tampermonkey: Attempted to open ${dataToDisplay.length} items in a new window using window.open.`);
            }

            const newWindow = window.open('', '_blank');

            if (newWindow) {
                if (newWindow.document.readyState === 'complete') {
                    populateNewWindow(newWindow, itemsData);
                } else {
                    newWindow.onload = function() {
                        populateNewWindow(newWindow, itemsData);
                    };
                }
            } else {
                alert('Could not open new window. Please check your browser pop-up blocker settings.');
                console.error('Tampermonkey: Failed to open new window using window.open.');
            }
            // Your comment "// *** 已删除这里多余的、悬挂的 else 块 ***" was here.
            // The structure of if (newWindow) { ... } else { ... } is correct.
        } else {
            alert('No items found or could be generated based on the current logic.');
            console.log('No itemsData were extracted.');
        }
    } // <--- THIS IS THE MISSING CLOSING BRACE that caused the syntax error

})();