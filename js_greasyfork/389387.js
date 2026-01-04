// ==UserScript==
// @name         Wanikani Wrap-up Button Enhancement (Jerky Edition)
// @namespace    https://www.wanikani.com
// @version      5.1.3
// @description  Beefed-up Wrap-up button (Jerky Edition)
// @author       Inserio (Orig. Mempo)
// @match        https://www.wanikani.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/389387/Wanikani%20Wrap-up%20Button%20Enhancement%20%28Jerky%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/389387/Wanikani%20Wrap-up%20Button%20Enhancement%20%28Jerky%20Edition%29.meta.js
// ==/UserScript==
/* global Stimulus */
/* jshint esversion: 11 */

(function() {
    'use strict';

    // ========================================================================
    // Globals
    const scriptId = 'wrap-up-amount', menuId = `${scriptId}-menu`, filterId = `${scriptId}-filter`, filterContainerId = `${filterId}-container`,
          filterIconId = `${filterId}-icon`, filterIconContainerId = `${filterIconId}-container`, inputNumberId = `${scriptId}-input`, listenerOpts = {passive: true};
    const state = {
        queue: {
            controller: null,
            count: 10 // default value from WaniKani
        },
        filter: {
            enabled: false,
            hasProcessed: false
        }
    };

    // ========================================================================
    // Startup

    installCSS();
    document.documentElement.addEventListener('turbo:load', () => { setTimeout(initUi, 0); }, listenerOpts);
    if (window.Turbo?.session.history.pageLoaded)
        initUi();

    // ========================================================================
    // Functions

    /**
     * Install stylesheet.
     */
    function installCSS() {
        const head = document.getElementsByTagName('head')[0];
        if (head) {
            const style = document.createElement('style');
            style.setAttribute('id', scriptId);
            style.setAttribute('type', 'text/css');
            // language=CSS
            style.textContent = `
li#${menuId} {
    display: flex;
    align-items: center;
}
li#${menuId} * {
    text-align: center;
}
li#${menuId} > * {
    flex: 1;
    min-width: 0;
}`;
            head.insertAdjacentElement('beforeend', style);
        }
    }

    /**
     * Initialize the user interface.
     */
    function initUi() {
        state.queue.controller = null;
        const wrapUpBox = document.getElementById('additional-content')?.querySelector('li:has(.additional-content__item--wrap-up)');
        if (!wrapUpBox) return Promise.resolve();

        wrapUpBox.insertAdjacentHTML('afterend', `
<li class="additional-content__menu-item additional-content__menu-item--5" id="${menuId}">
    <a class="additional-content__item additional-content__item--wrap-up-filter" id="${filterContainerId}" title="Filter Wrap Up to Only Started Items" data-wrap-up-count-class="additional-content__item-icon-text" data-wrap-up-active-class="additional-content__item--active" tabindex="0">
        <div class="additional-content__item-text">Filter</div>
        <div class="additional-content__item-icon-container" id="${filterIconContainerId}">
            <div class="additional-content__item-icon-text"></div>
            <div class="wk-icon wk-icon--scales" id="${filterIconId}" aria-hidden="true">🔗</div>
        </div>
    </a>
    <input class="additional-content__item additional-content__item--wrap-up-count" id="${inputNumberId}" title="Wrap Up Item Count" tabindex="0" type="number" min="1" max="${state.queue.count}" step="1" value="${state.queue.count}"></input>
</li>`);
        document.getElementById(filterContainerId).addEventListener('click', onFilterButtonClick, listenerOpts);
        const inputNumber = document.getElementById(inputNumberId);
        inputNumber.addEventListener('input', onWrapUpValueChanged, listenerOpts);
        inputNumber.addEventListener('wheel', {}, {passive: false}); // hack to inherit default onwheel listener

        return waitForController('quizQueue', 'quiz-queue').then(res=>{
            if (!('quizQueue' in res)) throw Error('Failed to access the quizQueue controller');
            state.queue.controller = res;
            document.getElementById(inputNumberId).max = res.quizQueue.totalItems;
            registerOnWrapUpListener();
        });
    }

    function registerOnWrapUpListener() {
        let onRegistration = ({toggleWrap, deregisterObserver}) => {};
        let onUpdateCount = ({currentCount}) => {};
        let onWrapUp = ({isWrappingUp, currentCount}) => {
            onWrapUpFilterClicked(isWrappingUp);
            if (!state.filter.enabled && !state.filter.hasProcessed) {
                // if not using the filter, the queue count must be manually updated instead
                onWrapUpValueChanged();
            }
        };
        let registerWrapUpObserver = {
            onRegistration: onRegistration,
            onUpdateCount: onUpdateCount,
            onWrapUp: onWrapUp
        };
        window.dispatchEvent(new CustomEvent('registerWrapUpObserver', {detail: {observer: registerWrapUpObserver}}));
    }

    function getControllerV1(name) { return Stimulus?.controllers.find(controller => controller[name]); }
    function getControllerV2(name) { return Stimulus?.getControllerForElementAndIdentifier(document.querySelector(`[data-controller~="${name}"]`),name); }

    async function waitForController(nameV1, nameV2) {
        if (nameV1 == null && nameV2 == null) return Promise.reject();
        const controller = (nameV1 ? getControllerV1(nameV1) : null) ?? (nameV2 ? getControllerV2(nameV2) : null);
        if (controller) return controller;
        await new Promise(resolve => setTimeout(resolve, 1));
        return await waitForController(nameV1, nameV2);
    }

    function onFilterButtonClick() {
        const newState = document.getElementById(filterContainerId)?.classList.toggle('additional-content__item--active');
        const inputContainer = document.getElementById(inputNumberId);
        inputContainer?.classList.toggle('additional-content__item--disabled', newState);
        inputContainer?.toggleAttribute('disabled', newState);
        state.filter.enabled = newState;
        onWrapUpFilterClicked(state.queue.controller?.quizQueue.wrapUpManager.wrappingUp);
    }

    function onWrapUpValueChanged() {
        const element = document.getElementById(inputNumberId);
        const newQueueSize = getCustomWrapUpAmount(element);
        if (newQueueSize === null) {
            element.value = state.queue.count;
            return;
        }
        updateQueueCount(newQueueSize);
    }

    function onWrapUpFilterClicked(isWrappingUp) {
        if (!state.queue.controller || !('quizQueue' in state.queue.controller)) return;
        const quizQueue = state.queue.controller.quizQueue;
        if (!isWrappingUp || (state.filter.hasProcessed && !state.filter.enabled)) { // revert queue modifications when no longer wrapping up
            if (!state.filter.hasProcessed) return; // nothing to revert
            const emptySlots = quizQueue.maxActiveQueueSize - quizQueue.activeQueue.length;
            quizQueue.activeQueue = quizQueue.activeQueue.concat(quizQueue.backlogQueue.slice(0, emptySlots));
            quizQueue.backlogQueue = quizQueue.backlogQueue.slice(emptySlots);
            quizQueue.fetchMoreItems();
            quizQueue.wrapUpManager.updateQueueSize(quizQueue.activeQueue.length);
            onWrapUpValueChanged();
            state.filter.hasProcessed = false;
            return;
        }
        if (!state.filter.enabled) return; // don't modify queue when filter is disabled
        const ids = Array.from(quizQueue.stats.data.entries().filter(([,{reading,meaning}])=>(!(reading.complete && meaning.complete))).map(([id])=>id));
        const newActiveQueue = [];
        const newBacklogQueue = [];
        for (const item of quizQueue.activeQueue) {
            if (ids.includes(item.id))
                newActiveQueue.push(item);
            else
                newBacklogQueue.push(item);
        }
        if (!newActiveQueue.includes(quizQueue.currentItem)) newActiveQueue.unshift(quizQueue.currentItem);
        newBacklogQueue.push(...quizQueue.backlogQueue);
        let index = -1;
        if ((index = newBacklogQueue.indexOf(quizQueue.currentItem)) > -1) newBacklogQueue.splice(index, 1);
        quizQueue.activeQueue = newActiveQueue;
        quizQueue.backlogQueue = newBacklogQueue;
        quizQueue.wrapUpManager.updateQueueSize(quizQueue.activeQueue.length);
        onWrapUpValueChanged();
        state.filter.hasProcessed = true;
    }

    function getCustomWrapUpAmount(element) {
        if (!element || !element.value) return null;
        let amount = Number(element.value);
        if (Number.isNaN(amount) || (amount = parseInt(amount)) <= 0) return null;
        return state.queue.count = amount;
    }

    function getQueueSizeDifference(newSize) {
        if (typeof newSize !== 'number' || !state.queue.controller || !('quizQueue' in state.queue.controller)) return 0;
        const quizQueue = state.queue.controller.quizQueue;
        if (newSize > quizQueue.totalItems)
            document.getElementById(inputNumberId).value = newSize = quizQueue.totalItems;
        if (!quizQueue.wrapUpManager.wrappingUp) return 0; // don't actually modify the queue if not currently wrappingUp
        if (state.filter.hasProcessed) return 0; // this shouldn't be necessary, but better to be safe
        return newSize - quizQueue.maxActiveQueueSize;
    }

    function updateQueueCount(newSize) {
        const queueDifference = getQueueSizeDifference(newSize);
        const quizQueue = state.queue.controller.quizQueue;
        if (queueDifference === 0) return;
        // update the queue similar to how it is done in `onWrapUp({isWrappingUp})`
        // empty slots must be calculated because a user could have previously been in wrap up mode
        const emptySlots = quizQueue.maxActiveQueueSize - quizQueue.activeQueue.length;

        quizQueue.maxActiveQueueSize = newSize;
        let sliceIndex;
        if (queueDifference > 0) {
            sliceIndex = emptySlots + queueDifference;
            quizQueue.activeQueue = quizQueue.activeQueue.concat(quizQueue.backlogQueue.slice(0, sliceIndex));
            quizQueue.backlogQueue = quizQueue.backlogQueue.slice(sliceIndex);
            quizQueue.fetchMoreItems();
        } else {
            sliceIndex = quizQueue.maxActiveQueueSize - emptySlots;
            quizQueue.backlogQueue = quizQueue.activeQueue.slice(sliceIndex).concat(quizQueue.backlogQueue);
            quizQueue.activeQueue = quizQueue.activeQueue.slice(0, sliceIndex);
        }
        quizQueue.wrapUpManager.updateQueueSize(quizQueue.activeQueue.length);
    }

})();
