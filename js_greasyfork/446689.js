// ==UserScript==
// @name         Netflix Recommendation Explorer
// @version      0.2
// @description  Add a "More Info" button to Netflix "More Like This" and Collections recommendations
// @author       Kevin Shay @kshay
// @grant        none
// @match        https://www.netflix.com/*
// @namespace https://greasyfork.org/users/154233
// @downloadURL https://update.greasyfork.org/scripts/446689/Netflix%20Recommendation%20Explorer.user.js
// @updateURL https://update.greasyfork.org/scripts/446689/Netflix%20Recommendation%20Explorer.meta.js
// ==/UserScript==

(function() {
    // The recommendation cards we want to modify are not necessarily on the page when the script runs,
    // so we need to account for a few different scenarios of either finding them immediately or
    // watching for them to be added to the page. Different classnames are also used depending whether
    // the target is a More Like This or a Collection.


    function addButton(titleCardContainer) {
        let metaWrapper = titleCardContainer.querySelector('.titleCard--metadataWrapper');
        let trackContent = metaWrapper.querySelector('.ptrack-content');
        if (!trackContent) {
            return;
        }
        let videoId = JSON.parse(decodeURIComponent(trackContent.getAttribute('data-ui-tracking-context'))).video_id;
        let moreInfoBtn = document.createElement('button');
        moreInfoBtn.appendChild(document.createTextNode('More Info'));
        moreInfoBtn.classList.add('color-secondary', 'hasLabel');
        // Just some basic styling, could clean this up by injecting a class declaration but not bothering for now
        moreInfoBtn.style.backgroundColor = 'rgba(109, 109, 110, 0.7)';
        moreInfoBtn.style.border = '0';
        moreInfoBtn.style.borderRadius = '4px';
        moreInfoBtn.style.fontSize = '.8em';
        moreInfoBtn.style.fontWeight = 'bold';
        moreInfoBtn.style.margin = '0 0 5px 10px';
        moreInfoBtn.style.padding = '0.8rem';
        moreInfoBtn.addEventListener('click', (evt) => {
            // Will still work without this but after a flash of the title starting to play
            evt.stopPropagation();
            window.location.href = `/title/${videoId}`
        });
        metaWrapper.insertBefore(moreInfoBtn, metaWrapper.querySelector('.titleCard-synopsis'));
    }

    const sectionObserver = new MutationObserver((mutationList) => {
        mutationList.forEach((mutation) => {
            mutation.addedNodes.forEach((added) => {
                if (added.classList?.contains('titleCard--container')) {
                    addButton(added);
                }
            });
        });
    });
    // Once the target elements are found, this function does the actual work of pulling out the video id
    // and injecting the link button.
    function addButtons(targets) {
        targets.forEach((target) => {
            sectionObserver.observe(target, { subtree: true, childList: true });
        });
    }

    const detailObserver = new MutationObserver((mutationList) => {
        mutationList.forEach((mutation) => {
            mutation.addedNodes.forEach((infoAdded) => {
                if (infoAdded.classList?.contains('section-container') || infoAdded.classList?.contains('ptrack-container')) {
                    addButtons([infoAdded]);
                }
            });
        });
    });

    // Once the modal is on the page, it may or may not already contain the recommendation sections, so we either
    // add the buttons immediately or watch for the sections to be added.
    function addOrObserve(target) {
        let sectionContainers = target.querySelectorAll('.section-container,.titleGroup--container');
        if (sectionContainers.length > 0) {
            addButtons(sectionContainers);
        } else {
            detailObserver.observe(target, { subtree: true, childList: true });
        }
    }

    // The modal may be on the page already; if so, we can operate on it immediately.
    let detailModal = document.querySelector('.detail-modal-container');
    if (detailModal) {
        addOrObserve(detailModal);
    }

    // Watch from the top-level container for the modal to be added. We still want this
    // even if it was initially on the page because it can be closed and opened again.
    const appObserver = new MutationObserver((mutationList) => {
        mutationList.forEach((mutation) => {
            mutation.addedNodes.forEach((appAdded) => {
                if (appAdded.classList?.contains('detail-modal-container') || appAdded.classList?.contains('detail-modal')) {
                    addOrObserve(appAdded);
                }
            });
        });
    });
    appObserver.observe(document.getElementById('appMountPoint'), { subtree: true, childList: true });
})();