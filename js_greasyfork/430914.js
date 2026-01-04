// ==UserScript==
// @name               QOAL/discord/channelPanel
// @namespace          QOAL/discord/channelPanel
// @description        Makes the channel list a panel you can toggle
// @author             QOAL
// @version            1.10
// @grant              GM.setValue
// @grant              GM.getValue
// @match              https://discord.com/*
// @run-at             document-end
// @license            GPLv3
// @downloadURL https://update.greasyfork.org/scripts/430914/QOALdiscordchannelPanel.user.js
// @updateURL https://update.greasyfork.org/scripts/430914/QOALdiscordchannelPanel.meta.js
// ==/UserScript==


	/*

	Adds a # button to the toolbar (Top right), click it will toggle the visibility of the Channel list pane.

	Based on my QOAL/discord/dontPingReplies script

	*/

(function(){
	'use strict';

	const toolbarSelector = '.toolbar__88c63';
  const channelsSideBarSelector = '.sidebar_ded4b5';
  const channelIconSVGSelector = '.icon__4cb88';
  const selectedIconClass = 'selected_be2668';
  const iconWrapper = "iconWrapper_af9215";
	const clickable = "clickable_d23a1a";

	const clickEvent = document.createEvent('Events');
	clickEvent.initEvent('click', true, false);


	// Discord has an connecting screen should you or it have network issues
	// The url and page title doesn't change during this
	// I think it's a good idea to listen for browser events, and start mutation observers
	const networkStatusChange = (e) => {
		findUI();
	}
	window.addEventListener('online', networkStatusChange);
	//window.addEventListener('offline', networkStatusChange);


	let lastLocation = window.location;
	const pageChange = () => {
    if (document.querySelector(toolbarSelector)) {
      // Recheck if we have a server UI, if not start the mutation handler for it
      findUI();
    }
	}
	new MutationObserver(pageChange).observe(
		document.head.querySelector('title'),
		{ subtree: true, characterData: true, childList: true }
	);


  let toolbarEle;
  let channelsPane;
  let channelsIcon;
  let toolbarButton;

  let initiallyActive = true;

  let findUIObserver;
  let findUITimer;

	const findUI = () => {
		stopUIObserver();

		const tmpCont = document.querySelector(toolbarSelector);
		if (tmpCont) {
			toolbarEle = tmpCont;
			doUIStuff();
			return;
		}

		findUIObserver = new MutationObserver(checkForUI);
    findUIObserver.observe(
			document.body/*getElementById("app-mount")*/,
			{ subtree: true, childList: true }
		);

		findUITimer = setTimeout(function() {
			// Give up waiting
			findUIObserver.disconnect();
		}, 10 * 1000);
	}

  const stopUIObserver = () => {
		if (findUIObserver) {
			findUIObserver.disconnect();
			findUIObserver = null;
		}
	}

	const checkForUI = () => {
		const tmpCont = document.querySelector(toolbarSelector);
		if (!tmpCont) { return; }

		toolbarEle = tmpCont;

		stopUIObserver();
    doUIStuff();
	}

  
  const doUIStuff = async () => {
    // What do we do here?
    // Get the current channel pane visibility and set the visibility of it.
    // Add, if needed, the button to the toolbar

    channelsPane = document.querySelector(channelsSideBarSelector);

    if (!channelsIcon) {
      // Try and find a text channel icon, if we can't find one use the first icon we can.
      channelsIcon = document.querySelector(channelIconSVGSelector).cloneNode(true)
    }

    if (!initiallyActive) {
      channelsPane.style.width = '0';
    }

    if (!toolbarButton) {
      
      const hideMembersBtn = document.querySelector(toolbarSelector + ` [aria-label="Hide Member List"]`);

      if (hideMembersBtn) {
				toolbarButton = hideMembersBtn.cloneNode();
        toolbarButton.replaceChildren(channelsIcon.cloneNode(true));
        toolbarButton.setAttribute('aria-label', 'Toggle Server Channels');
      } else {

        toolbarButton = document.createElement('div');
      	toolbarButton.append(channelsIcon.cloneNode(true));

        toolbarButton.setAttribute('class', `${iconWrapper} ${clickable}` + (initiallyActive ? ' ' + selectedIconClass : ''));
        toolbarButton.setAttribute('role', 'button');
        toolbarButton.setAttribute('aria-label', 'Toggle Server Channels');
        toolbarButton.setAttribute('tabindex', '0');
      }

      toolbarEle.prepend(toolbarButton)

      toolbarButton.addEventListener('click', toggleChannelPane)
    } else if (toolbarButton.parentNode !== toolbarEle) {
      toolbarEle.prepend(toolbarButton)
    }

  }

  const toggleChannelPane = () => {
    const isActive = toolbarButton.classList.contains(selectedIconClass);

    toolbarButton.classList.toggle(selectedIconClass);
		channelsPane.style.width = isActive ? '0' : '';

    GM.setValue("showChannelPane", !isActive);
  }
  
  GM.getValue("showChannelPane", true).then(rVal => {
    initiallyActive = rVal;
  })


	findUI();

})()