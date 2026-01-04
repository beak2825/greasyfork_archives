// ==UserScript==
// @name            PixAI Utilities Mod
// @namespace       Violentmonkey Scripts
// @match           https://pixai.art/*
// @version         1.3.1
// @author          brunon
// @description     Preloads images; download prompt filename; auto open slideshow; negative prompt persist option; keeps selection highlighted.
// @grant           GM_addStyle
// @grant           GM_download
// @grant           GM_info
// @grant           GM_setClipboard
// @grant           GM.getValue
// @grant           GM_getValue
// @grant           GM.setValue
// @grant           GM_setValue
// @require         https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @icon            https://www.google.com/s2/favicons?sz=64&domain=pixai.art
// @downloadURL https://update.greasyfork.org/scripts/512716/PixAI%20Utilities%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/512716/PixAI%20Utilities%20Mod.meta.js
// ==/UserScript==


(async () => {




function saveValue(key, array) {
    const saveFunc = (typeof GM !== 'undefined' && GM.setValue) || GM_setValue;
    if (!saveFunc) return; // console.log("Oh no, no save method available");

    const result = saveFunc(key, array);
    if (result instanceof Promise) {
        result.then(() => { /* console.log("Array saved successfully"); */ })
              .catch(e => console.error("Error:", e));
    } else {
        // console.log("Array saved successfully");
    }
}


  function retrieveValueFromStorage(key) {
    if (typeof GM_getValue === "function") {
      return GM_getValue(key, false);
    }

    if (typeof GM === "object" && typeof GM.getValue === "function") {
      return GM.getValue(key, false).then(value => value);
    }

    console.error("Unsupported userscript manager.");
    return undefined;
  }







    if (!VM.shortcut) {
        console.error('VM.shortcut is not available!');
        return;
    }

    const shortcuts = new VM.shortcut.KeyboardService();
    shortcuts.enable();

    shortcuts.setContext('slideshowOpen', false);
    shortcuts.setContext('isInput', false);

    shortcuts.register(
        'd',
        () => {
            let downloadBtn = document.querySelector('#custom-download');
            if (!!downloadBtn) downloadBtn.click();
        },
        {
            condition: 'slideshowOpen',
        }
    );

    const shortcutMapping = {
      up: -3,
      down: 3,
      right: 1,
      left: -1
    };

    Object.entries(shortcutMapping).forEach(([shortcut, direction]) => {
      shortcuts.register(
        shortcut,
        () => arrowNavigation(direction),
        {
          condition: '!slideshowOpen && !isInput',
        }
      );
    });



    let regenerateBtnText = 'Regenerate All';


    let imgPreviewSelector = 'main img[src^="https://images-ng.pixai.art/images/thumb/"]';
    let imgOriginalSelector = 'main img[src^="https://images-ng.pixai.art/images/orig/"]';
    let imgThumbsSelector = '[data-test-id="virtuoso-item-list"] .contents>button';
    let promptTextareaSelector = 'textarea.w-full';
    let scrollListSelector = '[data-test-id="virtuoso-scroller"]';
    let selectedListThumbSelector = `${scrollListSelector} button.outline`;

    let thumbIcons = [];
    let openedPreviewCache = new Map();
    let lastCacheUpdate = 0;
    let slideshowPresent = false;
    let dbNameAntiban = `${GM_info.script.name}-${GM_info.uuid}`.replace(/\s+/g, '-');

    let generateButtonListener;
    let pauseThumbListener = false;
    let latestClickedElement;
    let currentImgObserver;
    let latestEventListener;
    let shouldEnforceNegative = !!localStorage.getItem('enforceNegativeNegativePrompt');
    let previewListCheckListener;
    let latestClickedID;
    let stopGenerationLoop = false;
    let latestToastMessage = "";
    let scrollingToElement = false;

    performDatabaseOperation(1, 'previews', (store, id) => {});


  async function waitForFocus() {
    return new Promise(resolve => {
        function onFocus() {
            window.removeEventListener('focus', onFocus);
            resolve();
        }
        if (document.hasFocus()) {
            resolve();
        } else {
            window.addEventListener('focus', onFocus);
        }
    });
}



    function findButtonByInnerText(innerText, extraSelector = '') {
      return [...document.querySelectorAll('button'+extraSelector)].find(button => button.textContent.includes(innerText)) || null;
    }



    await waitForElement(imgThumbsSelector);
    console.log("Running")

    window.print = function () { };


    function preloadImages(imageUrls) {
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }

    async function waitForElements(selector) {
        const startTime = Date.now();
        const waitTime = 10000;

        return new Promise(resolve => {
            const checkInterval = setInterval(() => {
                const elements = document.querySelectorAll(selector);
                if (elements.length >= 4 || Date.now() - startTime > waitTime) {
                    clearInterval(checkInterval);
                    resolve(elements);
                }
            }, 150);
        });
    }

    async function updateThumbs(refresh = false) {
        if (refresh) {
            thumbIcons = [];
            await updatePreviewCache();
        }

        let newThumbs = await waitForElements(imgThumbsSelector);

        newThumbs.forEach(newThumb => {
            let id = extractPreviewId(newThumb);
            displayOpenedState(id, newThumb);

            if (!thumbIcons.includes(newThumb)) thumbIcons.push(newThumb);
        });

        updateListeners();
    }



    async function getImagePreviews() {
        return await waitForElements(imgPreviewSelector);
    }



    async function preloadFullImages() {
        const imagePreviews = await getImagePreviews();
        preloadImages(Array.from(imagePreviews).map(img => {
            return img.src.replace("thumb", "orig");
        }));
    }


async function waitForElement(selector, timeout = 10) {
    return new Promise((resolve) => {

        const timeoutId = setTimeout(() => resolve(null), timeout * 1000);

        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (!!element) {
                clearTimeout(timeoutId);
                observer.disconnect();
                resolve(element);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });
}






    async function waitForClass(element, className) {
        if (!element) {
            return Promise.reject('Element is null');
        }

        return new Promise(resolve => {
            const checkInterval = setInterval(() => {
                if (element.classList.contains(className)) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100); // Check every 100 milliseconds
        });
    }


    async function highlightSelected(target) {
        await waitForClass(target, 'ring-theme-primary');

        thumbIcons.forEach(icon => {
            icon.classList.remove('selected-thumb');
        });

        target.classList.add('selected-thumb');
    }

    function eventToElement(event) {
        return event.currentTarget;
    }



    async function updatePreviewCache() {
        if (Date.now() - lastCacheUpdate < 100) return Promise.resolve();
        lastCacheUpdate = Date.now();

        try {
            const request = openDatabase(); // Get the database request
            const db = await new Promise((resolve, reject) => {
                request.onsuccess = ({ target }) => resolve(target.result); // Resolve with the database object
                request.onerror = () => reject('IndexedDB error');
            });

            const store = db.transaction('previews', 'readonly').objectStore('previews');
            const allValues = [];

            return new Promise((resolve, reject) => {
                const cursorRequest = store.openCursor();
                cursorRequest.onsuccess = ({ target }) => {
                    const cursor = target.result;
                    if (!cursor) {
                        allValues.forEach(item => openedPreviewCache.set(item.id, item));
                        resolve();
                    } else {
                        allValues.push(cursor.value);
                        cursor.continue();
                    }
                };
                cursorRequest.onerror = () => reject('Error retrieving cache values');
            });
        } catch (error) {
            // console.error("Error accessing the database:", error);
            throw new Error("Error accessing the database:", error);
        }
    }
    async function measureUpdatePreviewCacheTime() {
        const startTime = performance.now(); // Start timing

        await updatePreviewCache();

        const endTime = performance.now(); // End timing
        console.log(`updatePreviewCache execution time: ${endTime - startTime} ms`);
    }

    measureUpdatePreviewCacheTime();


    function extractSrcId(src) {
        try {
            return src.split('/').pop();
        } catch (error) {
            console.error('Error occurred with src:', src);
        }
    }



    function extractPreviewId(element) {
        const img = element.querySelector('div img');
        const src = img?.getAttribute('src');
        if (!src) return null;

        return (extractSrcId(src))
    }

    function openDatabase() {
        return indexedDB.open(dbNameAntiban, 3);
    }



function performDatabaseOperation(id, storeName, operation) {
    const request = openDatabase();

    request.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
        }
    };

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        operation(store, id);
        transaction.oncomplete = () => null;
        transaction.onerror = () => console.error(`Transaction ${id} error: ${event.target.error}`);
    };

    request.onerror = function (event) {
        console.error('IndexedDB error:', event.target.error);
    };
}







    function upsertDatabase(id) {
        if (!id) {
            console.error('Invalid ID provided for upsert operation');
            return;
        }

        let infoID = { id, timestamp: new Date().toISOString() };

        performDatabaseOperation(id, 'previews', (store, id) => {
            store.put(infoID);
        });

        openedPreviewCache.set(id, infoID);

    }










    async function isIdPresentInDatabase(id, storeName) {
        return new Promise((resolve) => {
            performDatabaseOperation(id, storeName, (store, id) => {
                const request = store.get(id);
                request.onsuccess = () => resolve(request.result !== undefined);
                request.onerror = () => resolve(false);
            });
        });
    }





    async function getValueById(id, storeName) {
        const request = openDatabase();
        return new Promise((resolve, reject) => {
            request.onsuccess = ({ target }) => {
                const store = target.result.transaction(storeName, 'readonly').objectStore(storeName);
                store.get(id).onsuccess = e => resolve(e.target.result || null);
                store.get(id).onerror = () => reject('Error retrieving value');
            };
            request.onerror = () => reject('IndexedDB error');
        });
    }

    async function wasAlreadyOpenedCheck(id, forceRefresh = false) {

        if (forceRefresh) {
            let storedValue = await getValueById(id, 'previews');
            if (storedValue) openedPreviewCache.set(id, storedValue);
            return !!storedValue;
        }

        return openedPreviewCache.has(id);
    }



    function displayOpenedState(id, previewButton, forceRecheckDB = false) {
        let existingSpan = previewButton.querySelector('span[data-label="check"]');

        wasAlreadyOpenedCheck(id, forceRecheckDB).then(isPresent => {

            if (!isPresent && !!existingSpan) {
                existingSpan.remove();
                return;
            }

            if (isPresent && !existingSpan) {
                let span = document.createElement('span');
                span.setAttribute('data-label', 'check');
                span.textContent = '✔️';
                span.style.opacity = '0';
                previewButton.appendChild(span);
                setTimeout(() => span.style.opacity = '1', 5)
            }

        });
    }


    function selectThumbFromId(id) {
        let img = document.querySelector(`[data-test-id="virtuoso-item-list"] .contents>button img[src$="${id}"]`);
        if (!img) return;

        thumbIcons.forEach(icon => {
            icon.classList.remove('selected-thumb');
        });
        let elementToSelect = img.parentElement.parentElement;
        elementToSelect.classList.add('selected-thumb');
        // console.log("Selecting",elementToSelect,'because of ID',id);
    }


    function latestClickSrc() {
        if (!latestClickedElement) return {
            src: null,
            img: null
        };

        let latestClickImg = latestClickedElement.querySelector("img");
        if (!latestClickImg) return;

        return {
            src: latestClickImg.src,
            img: latestClickImg
        };
    }

    async function updateListenersOnNewGeneration() {

      /**
       * Removes currentImgObserver whis is only used inside this function
       *
       * */


        let srcRestore = latestClickSrc();
      console.log("srcRestore:", srcRestore)
        if (!srcRestore) return;


        if (currentImgObserver) currentImgObserver.disconnect();

        currentImgObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (!(mutation.type === 'attributes' && mutation.attributeName === 'src')) return;



                let srcId = extractSrcId(srcRestore.src);

                console.log("Generate click detected, runnign selectThumbFromId on",srcId, "from updateListenersOnNewGeneration()");

                selectThumbFromId(srcId);
                updateThumbs(true);
                currentImgObserver.disconnect();
            });
        });


        currentImgObserver.observe(srcRestore.img, { attributes: true, attributeFilter: ['src'] });
    }





    async function addGenerateButtonListener() {
      /*
       * Replaces the previous listener to updateListenersOnNewGeneration()
       *
       * */


        while (!findButtonByInnerText('Generate', ".outline-2")) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        let generateBtn = findButtonByInnerText('Generate', ".outline-2");
        if (!generateBtn) return;

        console.log("We have generateBtn", generateBtn)

        if (generateButtonListener) generateBtn.removeEventListener('click', generateButtonListener);

        generateButtonListener = () => {
            console.log("Generate btn clicked")
            updateListenersOnNewGeneration();
        }

        generateBtn.addEventListener('click', generateButtonListener);
        console.log("We added generateButtonListener()", generateButtonListener)
    }

    async function openFirstImage() {
        let observer = new MutationObserver(() => {
            if (!document.body.innerText.match(/completed/i)) {

                let firstPreview = document.querySelector(imgOriginalSelector);
                if (!!firstPreview) {
                    // await new Promise(resolve => setTimeout(resolve, 100));
                    firstPreview.click();
                    observer.disconnect();
                } else {
                    console.error("Couldn't locate", firstPreview, "with", imgPreviewSelector)
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }


    async function thumbListener(event) {
        if(isTabActive('favorites')) {
          console.log("Returning, because we're inside favourites");
          return;
        }

        let clickedElementTarget = eventToElement(event);

        let latestSrc = latestClickSrc();

        let id = extractPreviewId(clickedElementTarget);

        if(!id) {
          console.log("Element has no ID. Returning");
          return;
        }

        // console.log("ID:",id);

        // console.log("Clicked:", clickedElementTarget, event)


        latestClickedElement = clickedElementTarget;


        let alreadyInsideDB = await isIdPresentInDatabase(id, 'previews');

        // console.log(alreadyInsideDB ? "Was already inside DB" : "Wasn't previously inside DB");


        await highlightSelected(clickedElementTarget);
        console.log(clickedElementTarget, "has been highlighted");

        // upsertDatabase(id);
        latestClickedID = id;
        saveValue("latestClickedID", {id: latestClickedID})

        preloadFullImages();
        updateThumbs();


        displayOpenedState(id, clickedElementTarget, true);
        addGenerateButtonListener();


        // createEnforceNegativeCheckbox();

        if (!alreadyInsideDB) openFirstImage()

    }


    function manageEnforceNegative(isChecked) {
        const textarea = document.querySelector('textarea[placeholder="Enter negative prompt here"]');
        let storedValue = localStorage.getItem('enforceNegativeNegativePrompt');

        if (!isChecked && !storedValue) {
            localStorage.removeItem('enforceNegativeNegativePrompt');
            shouldEnforceNegative = false;
            return;
        }
        localStorage.setItem('enforceNegativeNegativePrompt', textarea.value);
        shouldEnforceNegative = true;
    }

    let toggleCheckbox = (selector, isChecked) => {
        let checkboxLabel = document.querySelector(selector);
        if (!checkboxLabel) return;
        let checkedPath = checkboxLabel.querySelector('.checked-path');

        checkedPath.style.display = !isChecked ? 'none' : 'block';

        let checkbox = checkboxLabel.querySelector('input[type="checkbox"]');
        checkbox.checked = isChecked;

        // console.log("setting",checkbox, "to", isChecked)
    };

    function syncNegativePrompt() {
        toggleCheckbox('#enforce-negative', shouldEnforceNegative);
        if (!shouldEnforceNegative) {
            // console.log("if (!shouldEnforceNegative)")

            return;
        }

        let textarea = document.querySelector('textarea[placeholder="Enter negative prompt here"]');
        if (document.activeElement === textarea) {
            localStorage.removeItem('enforceNegativeNegativePrompt');
            shouldEnforceNegative = false;
            // console.log("Active element, skipping")
            return;
        }

        let storedValue = localStorage.getItem('enforceNegativeNegativePrompt');
        if (!storedValue) {
            // console.log("f (!storedValue) {")

            return;
        }

        if (textarea.value.trim() === storedValue.trim()) {
            // console.log("alrready changed");
            return;
        }



        textarea.value = ''; // Clear the textarea
        textarea.value = storedValue; // Set the new value
        textarea.dispatchEvent(new Event('input', { bubbles: true })); // Trigger input event
        console.log("set to", storedValue);


        awakeTextarea(textarea);

    }


    setInterval(syncNegativePrompt, 1 * 1000);

    async function slideShowDowloadButtonManager() {
        const observer = new MutationObserver(() => {
            const nextButton = document.querySelector('.pswp__button--arrow--next');
            if (!nextButton || !!document.querySelector('#custom-download')) return;

            const button = document.createElement('button');
            button.id = 'custom-download';
            button.title = 'Download with prompt as file name';
            button.innerHTML = `<svg aria-hidden="true" viewBox="0 0 32 32" width="32" height="32"><use class="pswp__icn-shadow" xlink:href="#pswp__icn-download"></use><path d="M20.5 14.3 17.1 18V10h-2.2v7.9l-3.4-3.6L10 16l6 6.1 6-6.1ZM23 23H9v2h14Z" id="pswp__icn-download"></path></svg>`;

            button.onclick = async () => {
                nextButton.style.cursor = 'pointer';
                await saveImage();
            };

            nextButton.insertAdjacentElement('beforebegin', button);
            setTimeout(() => button.classList.add('show'), 10);
            addHideSlideshowListeners(button);
        });

        observer.observe(document.body, { childList: true, subtree: true });
        window.addEventListener('beforeunload', () => {
            observer.disconnect();
        });
    }


    function sanitizeFilename(filename) {
        const maxLength = 125;
        const dotIndex = filename.lastIndexOf('.');
        const extension = dotIndex !== -1 ? filename.substring(dotIndex) : ''; // Get the file extension
        const baseFilename = dotIndex !== -1 ? filename.substring(0, dotIndex) : filename; // Get the base filename
        const sanitizedBase = baseFilename
            .replace(/[^a-zA-Z0-9-_\. ]/g, '_') // Replace invalid characters with underscores
            .replace(/\s+/g, '_') // Replace spaces with underscores
            .replace(/_+/g, '_') // Remove duplicate underscores
            .substring(0, maxLength - extension.length); // Truncate to max length minus extension

        return sanitizedBase + extension; // Combine sanitized base with extension
    }


    async function saveImage() {
        const textarea = document.querySelector(promptTextareaSelector);
        const imgSrc = document.querySelector('#pswp__items .pswp__item[aria-hidden="false"] img.pswp__img')?.src;
        if (!textarea || !imgSrc) return;
        let filename = sanitizeFilename(`${textarea.value.trim()}.png`);
        await GM_download({
            url: imgSrc,
            name: filename,
            saveAs: false
        });
    }


    function highlightOpenThumbnail() {
        let firstPreviewSrc = document.querySelector(imgPreviewSelector);
        if (!firstPreviewSrc) return console.warn(`Element not found for selector: ${imgPreviewSelector}`);

        let currentId = extractSrcId(firstPreviewSrc.src);
        if (!currentId) return console.warn('Current ID could not be extracted from the image source.');
        console.log("highlightOpenThumbnail(): Selection id", currentId, "from", firstPreviewSrc.src, 'of', firstPreviewSrc)
        selectThumbFromId(currentId);
    }

    function createCheckbox(id, labelText, onChangeFunction) {
        const newLabel = document.createElement('label');
        newLabel.style.userSelect = "none";
        newLabel.id = id;
        newLabel.innerHTML = `
    ${labelText}
    <input type="checkbox" style="display:none">
    <svg class="sc-eDvSVe cSfylm MuiSvgIcon-root MuiSvgIcon-fontSizeMedium" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
      <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
      <path class="checked-path" d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
    </svg>`;

        const checkbox = newLabel.querySelector('input[type="checkbox"]');
        const checkedPath = newLabel.querySelector('.checked-path');
        checkbox.checked = shouldEnforceNegative;

        checkbox.addEventListener('change', function () {
            checkedPath.style.display = !this.checked ? 'none' : 'block';
            if (typeof onChangeFunction === 'function') onChangeFunction(this.checked);
        });

        return newLabel;
    }

    function createEnforceNegativeCheckbox() {
        const negativeLabel = Array.from(document.querySelectorAll('label')).find(label => label.textContent === 'Negative');
        if (!negativeLabel || document.getElementById('enforce-negative')) return;

        negativeLabel.parentElement.insertBefore(createCheckbox('enforce-negative', 'Enforce negative for every task', manageEnforceNegative), negativeLabel);
    }



    async function slideShowLifetimeMonitor() {
        while (true) {

            while (!document.querySelector('#pswp__items')) await new Promise(resolve => setTimeout(resolve, 100));
            slideshowPresent = true;
            shortcuts.setContext('slideshowOpen', true);

            if (latestClickedID) {
                console.log("Adding", latestClickedID, "(latestClickedID) to DB");
                upsertDatabase(latestClickedID);
            }




            while (!!document.querySelector('#pswp__items')) await new Promise(resolve => setTimeout(resolve, 100));
            slideshowPresent = false;
            shortcuts.setContext('slideshowOpen', false);



            await new Promise(resolve => setTimeout(resolve, 100));

            highlightOpenThumbnail();
        }
    }


    function checkOpenedImageOpacity() {
        let openedImage = document.querySelector('div.pswp__item[aria-hidden="false"] > div.pswp__zoom-wrap > img');

        // console.log("opened",openedImage,"opacity:",parseFloat(openedImage.style.opacity));

        return !!openedImage && (openedImage.complete && openedImage.naturalWidth !== 0) && (!openedImage.style.opacity || parseFloat(openedImage.style.opacity) >= 1);


    }


    async function addHideSlideshowListeners(customDownload) {
        if (!customDownload) return;

        let firstImageShowed = false;

        const elements = document.querySelectorAll('.pswp__scroll-wrap, .pswp__button--close');
        const bg = document.querySelector('.pswp__bg');
        bg.classList.add("black-bg");

        if (!firstImageShowed) {
            firstImageShowed = checkOpenedImageOpacity();
        }



        const hideDownload = async (e) => {
            const initialOpacity = parseFloat(bg.style.opacity) || 1;
            let opacityChanged = false;


            if (!firstImageShowed) {
                firstImageShowed = checkOpenedImageOpacity();
            }


            const observer = new MutationObserver(() => {



                if (firstImageShowed && !bg.classList.contains("black-bg") && !opacityChanged) bg.classList.add("black-bg");

                if (parseFloat(bg.style.opacity) !== initialOpacity) {
                    customDownload.classList.add('hide');
                    opacityChanged = true;
                    bg.classList.remove("black-bg");
                    observer.disconnect();
                }
            });

            observer.observe(bg, { attributes: true });
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible' && !opacityChanged) observer.disconnect();
            });

            bg.classList.remove("black-bg");

            await new Promise(resolve => setTimeout(resolve, 2000));
            if (opacityChanged) {
                customDownload.classList.add('hide');
            }
            observer.disconnect();
        };

        elements.forEach(el => el.addEventListener('click', hideDownload));
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideDownload(e); });
    }





function isTabActive(tab = "favorites") {
 /*

   tasks / favorites

  */
  let tabFavourites = document.querySelector(`#radix-\\:r9\\:-trigger-${tab}[data-state="active"]`);

  return !!tabFavourites && tabFavourites.getAttribute('data-state') === 'active';
}



  function createActionButton(id = "newBtn", text = "Go!", action = () => {}, remove = false) {
    let generateButton = findButtonByInnerText('Generate', '.outline-2');
    if (!generateButton) return;


    let button = document.querySelector(`#${id}`);

    if (remove && !!button){
        button.remove();
        return;
    }

    if (!!button || remove) return;

    button = document.createElement('button');
    button.id = id;
    button.textContent = text;
    button.classList.add('mr-3', 'grid-cols-[auto_1fr_auto]', 'focus:outline', 'outline-2', 'outline-offset-1', 'duration-75', 'disabled:text-black/50', 'disabled:bg-black/15', 'dark:disabled:text-white/50', 'dark:disabled:bg-white/15', 'text-white', 'bg-purple-600', 'hover:bg-purple-500', 'outline-purple-600', 'dark:outline-purple-500', 'text-sm', '[--ui-size:theme(spacing.8)]', 'w-full', 'mlg:w-auto', 'h-[--height]', 'flex', 'items-center', 'transition', 'font-semibold', 'dense:text-sm', 'px-4', 'mlg:py-2', 'dense:px-3', 'dense:py-0.5', 'rounded-xl', 'mlg:rounded-lg', 'dense:rounded-md');
    button.classList.add('bg-gradient-member');
    generateButton.parentNode.insertBefore(button, generateButton);
    button.addEventListener('click', action);
  }

createActionButton("Copy", "Copy!", ()=>{

    const textarea = document.querySelector(promptTextareaSelector);
  if (!textarea) return;


GM_setClipboard(textarea.value.trim(),'text/plain');

});






  function pasteButton(remove = false) {
    let generateButton = findButtonByInnerText('Generate', '.outline-2');
    if (!generateButton) return;


    let pasteTbn = document.querySelector('#pasteButton');

    if (remove && !!pasteTbn){
        pasteTbn.remove();
        return;
    }

    if (!!pasteTbn || remove) return;

    pasteTbn = document.createElement('button');
    pasteTbn.id = 'pasteButton';
    pasteTbn.textContent = "Paste! (demo)";
    pasteTbn.classList.add('mr-3', 'grid-cols-[auto_1fr_auto]', 'focus:outline', 'outline-2', 'outline-offset-1', 'duration-75', 'disabled:text-black/50', 'disabled:bg-black/15', 'dark:disabled:text-white/50', 'dark:disabled:bg-white/15', 'text-white', 'bg-purple-600', 'hover:bg-purple-500', 'outline-purple-600', 'dark:outline-purple-500', 'text-sm', '[--ui-size:theme(spacing.8)]', 'w-full', 'mlg:w-auto', 'h-[--height]', 'flex', 'items-center', 'transition', 'font-semibold', 'dense:text-sm', 'px-4', 'mlg:py-2', 'dense:px-3', 'dense:py-0.5', 'rounded-xl', 'mlg:rounded-lg', 'dense:rounded-md');
    pasteTbn.classList.add('bg-gradient-member');
    generateButton.parentNode.insertBefore(pasteTbn, generateButton);
    pasteTbn.addEventListener('click', pasteIntoTextarea);

    const textarea = document.querySelector(promptTextareaSelector);
    console.log(textarea)
  }

  // pasteButton();


function pasteIntoTextarea() {
    const textarea = document.querySelector(promptTextareaSelector);
    if (textarea) {
        const currentValue = 'Your text here';

        // Focus on the textarea
        textarea.focus();
        textarea.dispatchEvent(new Event('focus', { bubbles: true }));

        // Simulate paste event
        const clipboardData = new DataTransfer();
        clipboardData.setData('text/plain', currentValue);

        const pasteEvent = new ClipboardEvent('paste', {
            bubbles: true,
            cancelable: true
        });

        Object.defineProperty(pasteEvent, 'clipboardData', {
            get: () => clipboardData
        });

        textarea.dispatchEvent(pasteEvent);

        // Directly trigger React’s onChange handler
        const changeEvent = new Event('change', { bubbles: true });
        textarea.value = currentValue;
        textarea.dispatchEvent(changeEvent);

        // Manually trigger input and change events to ensure React updates state
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.dispatchEvent(new Event('change', { bubbles: true }));

        // Optionally simulate submit action
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton) submitButton.click();
    }
}







function favouritesRegenerateButton(remove = false) {
  let generateButton = findButtonByInnerText('Generate', '.outline-2');
  if (!generateButton) return;


  let regenerateBtn = document.querySelector('#favouriteRegenerateAutomation');

  if (remove && !!regenerateBtn){
      regenerateBtn.remove();
      return;
  }

  if (!!regenerateBtn || remove) return;

  // console.log("Adding because remove =",remove)
  regenerateBtn = document.createElement('button');
  regenerateBtn.id = 'favouriteRegenerateAutomation';
  regenerateBtn.textContent = regenerateBtnText;
  regenerateBtn.classList.add('mr-3', 'grid-cols-[auto_1fr_auto]', 'focus:outline', 'outline-2', 'outline-offset-1', 'duration-75', 'disabled:text-black/50', 'disabled:bg-black/15', 'dark:disabled:text-white/50', 'dark:disabled:bg-white/15', 'text-white', 'bg-purple-600', 'hover:bg-purple-500', 'outline-purple-600', 'dark:outline-purple-500', 'text-sm', '[--ui-size:theme(spacing.8)]', 'w-full', 'mlg:w-auto', 'h-[--height]', 'flex', 'items-center', 'transition', 'font-semibold', 'dense:text-sm', 'px-4', 'mlg:py-2', 'dense:px-3', 'dense:py-0.5', 'rounded-xl', 'mlg:rounded-lg', 'dense:rounded-md');
  regenerateBtn.classList.add('bg-gradient-member');
  generateButton.parentNode.insertBefore(regenerateBtn, generateButton);
  regenerateBtn.addEventListener('click', favouriteRegenerateAutomation);

  let tasksTab = findButtonByInnerText('Tasks', '[role="tab"]');
  tasksTab.addEventListener('click', () => favouritesRegenerateButton(true));

}


async function favouriteRegenerateAutomation(){



    let regenerateBtn = document.querySelector('#favouriteRegenerateAutomation');

    if (!!regenerateBtn && regenerateBtn.getAttribute('data-running') === 'true') {
        console.log("Stopping")
        stopGenerationLoop = true;
        stoppedFavouriteLoopButtonDOM(regenerateBtn);
        return;
    }

    let generateButton = findButtonByInnerText('Generate', '.outline-2');

    if (!generateButton || !regenerateBtn) throw new Error('Generate button or regenerate button not found. What the actual..? Impossible!');

    let currentlySelectedItem = document.querySelector(selectedListThumbSelector);
    if(!currentlySelectedItem) {
      alert("Please select the oldest item to start")
      return;
    }

    regenerateBtn.textContent = 'Stop!';
    regenerateBtn.classList.remove('bg-gradient-member');
    regenerateBtn.setAttribute('data-running', 'true');


    stopGenerationLoop = false;

    let successCount = 0;

    while (true) {
        if(successCount > 0) await new Promise(resolve => setTimeout(resolve, 1000));

        if(stopGenerationLoop) break;

        let selectedButton = document.querySelector('button.outline');

        console.info("Start wait for Generate Button")
         while (!findButtonByInnerText('Generate', ".outline-2")) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        console.info("End wait for Generate Button")

        generateButton.click();

        console.log("Waiting for toast")
        const toast = await waitForToastify();
        console.log("Toast found");

        let toastText = toast.textContent;


        let closeBtn = toast.querySelector('.Toastify__close-button');
        if(!!closeBtn) {
          closeBtn.click();
          console.log("Closed toast");
        }

        if(stopGenerationLoop) break;

        if (toastText.includes('submitted')) {
            console.log('Success for',document.querySelector(promptTextareaSelector).value);
            successCount++;
        } else if (toastText.includes('error')) {
            console.log('Error, retrying...');
            continue;
        } else if(document.body.innerText.includes("Too many tasks in queue")) {
            console.log("Too many tasks in queue");
            findButtonByInnerText('OK').click();
            continue;
        }

        let newestElement = document.querySelector('[data-state="active"][role="tabpanel"] button');
        // console.log("Newest element:", newestElement);

        if(selectedButton === newestElement){
          console.log("End reached");
          break;
        }

        if (!arrowNavigation(-1, selectedButton)) break;

    }

    console.log("Success count:",successCount)

    stoppedFavouriteLoopButtonDOM(regenerateBtn);

}

  function stoppedFavouriteLoopButtonDOM(regenerateBtn){
    regenerateBtn.textContent = regenerateBtnText;
    regenerateBtn.classList.add('bg-gradient-member');
    regenerateBtn.removeAttribute('data-running');
  }


async function waitForToastify() {
    return new Promise(resolve => {
        const checkToast = setInterval(() => {
            if (stopGenerationLoop) {
                clearInterval(checkToast);
                return;
            }
            const toastElement = document.querySelector('.Toastify');
            let messageText = toastElement.textContent;
            if (!!toastElement && (messageText.includes('submitted') || messageText.includes('fail'))) {
                latestToastMessage = messageText;
                clearInterval(checkToast);
                resolve(toastElement);
            }
        }, 100);
    });
}





function arrowNavigation(direction = -1, givenButton = null) {
  let selectedButton = givenButton || document.querySelector('button.outline');
  if (!selectedButton) return;

  let tileHeight = selectedButton.offsetHeight;

  let scrollContainer = document.querySelector(scrollListSelector);
  if (!scrollContainer) return console.error("There is no scrollContainer");

  let positionFromTop = selectedButton.getBoundingClientRect().top - scrollContainer.getBoundingClientRect().top;

  if (positionFromTop <= tileHeight) {
      scrollContainer.scrollTop -= tileHeight * 1.5;
  }

  let buttons = Array.from(document.querySelectorAll('button'));
  let selectedIndex = buttons.indexOf(selectedButton);

  if (selectedIndex <= 0) return;

  let previousButton = buttons[selectedIndex + direction];
  if (!previousButton) {
    console.log("No more buttons")
    return false;
 }

  previousButton.click();
  return true;
}






    function updateListeners() {
        if(isTabActive('favorites')){
          thumbIcons = [];
          favouritesRegenerateButton();
          console.log("Returning because we are inside Favourites");
          return;
        }

        // console.info("Running checks for listeners inside updateListeners()");
        thumbIcons.forEach(icon => {
            if (!icon.thumbClickListenerAdded) {
                icon.addEventListener('click', thumbListener);
                icon.thumbClickListenerAdded = true;
            }
        });

        favouritesRegenerateButton(true); // remove

    }

    async function detectScroll() {
        let scroller = await waitForElements(scrollListSelector);

        scroller[0].addEventListener('scroll', () => {
            requestAnimationFrame(() => updateThumbs(true));
        });
    }

    const scale = (x) => {
        if (x >= 2) return 1.5;
        if (x < 1) return x;
        return 0.5 * (x - 1) + 1;
    };



    function awakeTextarea(textarea, input = null) {
        textarea.focus();
        if (!input) {
            textarea.value += ' ';
        } else {
            textarea.value = input;
        }
        textarea.dispatchEvent(new InputEvent('input', { bubbles: true }));
        setTimeout(() => {
            textarea.value = textarea.value.slice(0, -1);
            textarea.dispatchEvent(new InputEvent('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
            textarea.blur();
        }, 500);
    };



const textareaPasteFix = async (promptTextareaSelector) => {
    const textarea = await waitForElement(promptTextareaSelector);
    textarea.addEventListener('paste', (event) => {
        const clipboardData = event.clipboardData.getData('text/plain');
        const modifiedText = clipboardData
            .replace(/(\d+) year old/g, '$1yo')
            .replace(/(\d+) years old/g, '$1yo')
            .replace(/(\d+) years/g, '$1yo')
            .replace(/(\d+) years-old/g, '$1yo')
            .replace(/(\d+) year-old/g, '$1yo')
            .replace(/(\d+)-year-old/g, '$1yo')
            .replace(/(\d+)-years-old/g, '$1yo')
            .replace(/thx/g, 'thanks')
            .replace('suckling', 'sucking')
            .replace(/\(\(/g, '(')
            .replace(/\)\)/g, ')')
            .replace(/:(\d+(\.\d+)?)/g, (match, num) => {
                const scaledNum = scale(parseFloat(num));
                return `:${Math.round(scaledNum * 10) / 10}`;
            })
            .replace(/<[^>]*>/g, '');  // Remove content between '<' and '>'


        if (clipboardData !== modifiedText) {
            event.preventDefault();
            const { selectionStart: start, selectionEnd: end } = textarea;
            const textBefore = textarea.value.slice(0, start);
            const textAfter = textarea.value.slice(end);
            textarea.value = textBefore + modifiedText + textAfter;
            textarea.selectionStart = textarea.selectionEnd = start + modifiedText.length;
            awakeTextarea(textarea);
        }
    });
};


function createScrollToBottomButton() {
  const list = document.querySelector(scrollListSelector);
  const button = document.createElement('div');
  Object.assign(button.style, {
    position: 'fixed',
    bottom: '10px',
    left: '14px',
    width: '50px',
    height: '50px',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    color: 'white',
    fontSize: '24px',
    zIndex: '5'
  });
  button.innerHTML = '&#8595;';
  button.id = 'scrollDownBtn';
  button.onclick = () => {


    scrollingToElement = !scrollingToElement;
    button.innerHTML = scrollingToElement ? '&#9634;' : '&#8595;';
    if(scrollingToElement) scrollUntilElement();
  };
  list.appendChild(button);
}


function scrollUntilElement(id = null) {
  const list = document.querySelector(scrollListSelector);
  if (!list) return;

  if (id === null) {
    id = retrieveValueFromStorage('latestClickedID')?.['id'];
    console.log("Finding ID", id);
  }

  const interval = setInterval(() => {

    if(!scrollingToElement) {
      clearInterval(interval);
      return;
    }

    const target = id !== undefined
      ? Array.from(list.querySelectorAll('img')).find(img => img.src.includes(id))
      : list.querySelector('span[data-label="check"]');

    if (target) {
      clearInterval(interval);
      const offset = window.innerHeight * 0.7;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });

      let scrollBtn = document.querySelector('#scrollDownBtn');
      if (!!scrollBtn) scrollBtn.innerHTML = '&#8595;';
      updateThumbs();

    } else {
      list.scrollBy(0, 100);
    }
  }, 100);
}





  await waitForFocus();

  const textarea = await waitForElement(promptTextareaSelector, 60*60);

  textarea.addEventListener('focus', () => {
    shortcuts.setContext('isInput', true);
    // console.log("isInput", true)
  });

  textarea.addEventListener('blur', () => {
    shortcuts.setContext('isInput', false);
    // console.log("isInput", false)
  });





window.addEventListener('blur', () => {
    if(!previewListCheckListener) return;
    previewListCheckListener.disconnect();
});

window.addEventListener('focus', () => {
    startScrollListListener();
});


    function startScrollListListener() {
        const targetNode = document.querySelector(scrollListSelector);
        if (!targetNode) {
          console.log("Returning because there is no scrollListSelector inside startScrollListListener()");
          return;
        }

        previewListCheckListener = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType !== 1 || !node.matches('[data-label="check"]')) return;

                    const parent = node.parentElement;
                    const id = extractPreviewId(parent);
                    if (!openedPreviewCache.get(id)) {
                        node.remove();
                        console.log("Removed", node, "because", id, "not present")
                    }
                });
            });
        });

        previewListCheckListener.observe(targetNode, { childList: true, subtree: true });
    }

    startScrollListListener();




    textareaPasteFix(promptTextareaSelector)


    upsertDatabase(1)
    detectScroll();
    slideShowLifetimeMonitor();

    slideShowDowloadButtonManager();
    createEnforceNegativeCheckbox();
    updateThumbs(true);


    window.addEventListener('focus', () => {
        updateThumbs(true);
        highlightOpenThumbnail();
    });


    let scrollList = await waitForElement(scrollListSelector);

  createScrollToBottomButton()


    // let scrollList = document.querySelector(scrollListSelector);

    scrollList.addEventListener('mouseenter', () => updateThumbs(true));
    scrollList.addEventListener('mouseleave', () => updateThumbs(true));
    scrollList.addEventListener('mousemove', () => updateThumbs());



    GM_addStyle(`
#favouriteRegenerateAutomation:hover{
  filter: brightness(1.1) contrast(1.05);
}
.black-bg{
  opacity: 1 !important;
}

.pswp__bg{
  transition: opacity .5s cubic-bezier(0.25,0.1,0.25,1);
}

.selected-thumb{
  outline: 2px solid hsla(0, 12%, 85.3%, 0.77);
  transition: outline 100ms;
}
#app .ring-2{
  box-shadow: none;
}
[data-test-id="virtuoso-item-list"] .contents>button img{
  cursor:pointer;
  transition: filter .1s ease;
}
[data-test-id="virtuoso-item-list"] .contents>button img:hover{
filter: brightness(1.05);
}
[data-label="check"] {
	position: absolute;
	left: 0;
	bottom: 0;
	background: #ffffff2b;
	border-top-right-radius: 5px;
	backdrop-filter: blur(10px);
	filter: brightness(1.3);
  transition: opacity .5s ease;
  opacity: 0;
}
#custom-download{
  width: 75px;
  height: 100px;
  margin-top: -50px;
  position: absolute;
  top: 50%;
  right: calc(75px + .5rem);
  display: flex; justify-content: center; align-items: center;
  opacity:0;
  will-change: opacity;
  transition: opacity 333ms cubic-bezier(0.4, 0, 0.22, 1);
}
#custom-download.show{
  opacity:1;
}
#custom-download.hide{
  opacity:0;
}
#custom-download > svg{
fill: var(--pswp-icon-color);
/*   color: var(--pswp-icon-color-secondary); */
  width: 60px;
  height: 60px;
}
#custom-download > svg > .pswp__icn-shadow {
	stroke-width: 1px;
}
button[aria-label="Download"][type="button"]{
  display:none
}
`);
})();