// ==UserScript==
// @name        Panda Crazy Automator
// @description Automate certain things in Panda Crazy
// @version     0.2.0
// @author      parseHex
// @namespace   https://greasyfork.org/users/8394
// @include     http*://worker.mturk.com/?filters[search_term]=pandacrazy=on*
// @include     http*://worker.mturk.com/requesters/PandaCrazy/projects*
// @include     http*://worker.mturk.com/?PandaCrazy*
// @include     http*://worker.mturk.com/?end_signin=1&filters%5Bsearch_term%5D=pandacrazy%3Don*
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/371196/Panda%20Crazy%20Automator.user.js
// @updateURL https://update.greasyfork.org/scripts/371196/Panda%20Crazy%20Automator.meta.js
// ==/UserScript==

(function () {
	'use strict';

	function enableWatcher(watcher) {
	    if (!watcher)
	        return true;
	    const collectBtn = watcher.querySelector('.myButtonArea .JRCollectButton');
	    if (collectBtn.classList.contains('JROnButton'))
	        return false;
	    collectBtn.click();
	    return true;
	}
	function disableWatcher(watcher) {
	    if (!watcher)
	        return true;
	    const collectBtn = watcher.querySelector('.myButtonArea .JRCollectButton');
	    if (collectBtn.classList.contains('JROffButton'))
	        return false;
	    collectBtn.click();
	    return true;
	}

	const HS_KEY = 'hit_scraper_disable';
	function getBatchesTab() {
	    const tabs = document.querySelectorAll('#JRMainTabs .JRTabs a.JRTabLabel');
	    for (let i = 0; i < tabs.length; i++) {
	        if (tabs[i].textContent.toLowerCase() !== 'batches')
	            continue;
	        // use getAttribute so that we get "#tab-?" instead of a full url
	        const bTabId = tabs[i].getAttribute('href');
	        return document.querySelector(bTabId);
	    }
	}
	function getWatchers() {
	    const batchesTab = getBatchesTab();
	    return Array.from(batchesTab.querySelectorAll('.JRHitCell'));
	}
	function getWatcherGID(watcher) {
	    if (!watcher)
	        return '';
	    const titleEl = watcher.querySelector('.myTitle');
	    return titleEl.title.split('\n')[1];
	}
	function pandaCrazyRunning() {
	    return document.getElementById('JRTheControls');
	}
	// don't run the script onload if page isn't visible since pc won't run yet either
	requestAnimationFrame(function () {
	    setTimeout(init, 1500);
	});
	function init() {
	    if (!pandaCrazyRunning())
	        return;
	    console.log('PCA Hook');
	    const observer = new MutationObserver(handleMutation);
	    observer.observe(document.getElementById('JRQueueWatchLog'), {
	        childList: true,
	    });
	}
	let reEnable = [];
	function handleMutation(records) {
	    const batchWatchers = getWatchers();
	    const batchIds = batchWatchers.map(getWatcherGID);
	    let shouldDisable = false;
	    for (let i = 0; i < records.length; i++) {
	        for (let k = 0; k < records[i].addedNodes.length; k++) {
	            const addedNode = records[i].addedNodes[k];
	            if (addedNode.className === 'muteQueueWatch')
	                continue;
	            if (addedNode.innerText === '')
	                continue;
	            if (addedNode.innerText.indexOf('You have no hits in your queue at this time.') > -1)
	                continue;
	            const continueBtn = addedNode.querySelector('.JRQueueContinue');
	            const groupId = continueBtn.href.match(/projects\/([A-Z0-9]+)\/tasks/)[1];
	            // don't react to HITs in Batches tab
	            if (batchIds.indexOf(groupId) > -1)
	                continue;
	            shouldDisable = true;
	            break;
	        }
	        if (shouldDisable)
	            break;
	    }
	    if (shouldDisable) {
	        for (let i = 0; i < batchWatchers.length; i++) {
	            // watchers that were enabled should get re enabled once the queue is empty (of non-batches)
	            if (disableWatcher(batchWatchers[i])) {
	                // skip watchers that are already set to re enable
	                if (reEnable.indexOf(batchWatchers[i]) > -1)
	                    continue;
	                reEnable.push(batchWatchers[i]);
	            }
	        }
	        localStorage.setItem(HS_KEY, 'true');
	    }
	    else {
	        for (let i = 0; i < reEnable.length; i++) {
	            enableWatcher(reEnable[i]);
	        }
	        reEnable.length = 0;
	        localStorage.setItem(HS_KEY, 'false');
	    }
	}
	window.addEventListener('beforeunload', function () {
	    localStorage.removeItem(HS_KEY);
	});

}());
