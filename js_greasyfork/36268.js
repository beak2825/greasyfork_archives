// ==UserScript==
// @name         [Worker] Today's Projected Earnings (mTurk)
// @version      1.2
// @description  Add your projected earnings to whatever sites you want. Uses Task Archive's API.
// @author       red_rum97
// @include      http://www.mturkcrowd.com/*
// @include      https://*.mturk.com/*
// @exclude      https://worker.mturk.com/*
// @noframes
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @namespace https://greasyfork.org/users/162707
// @downloadURL https://update.greasyfork.org/scripts/36268/%5BWorker%5D%20Today%27s%20Projected%20Earnings%20%28mTurk%29.user.js
// @updateURL https://update.greasyfork.org/scripts/36268/%5BWorker%5D%20Today%27s%20Projected%20Earnings%20%28mTurk%29.meta.js
// ==/UserScript==
/* jshint esversion: 6 */



	// 1. Change the '@include' above to whatever site(s) you want.
	// 2. Change or add stuff to the 'elementStyle' below if you want.
	// 3. IMPORTANT: Turn on TA's API for the @include site(s) so the script can get
	//    your earnings and update whenever you submit a HIT or one gets rejected.
	//      Instructions here: chrome-extension://boaodomjkjehcobmcehliafmodimcidg/html/documentation.html#faq=1_45
	//
	// I threw this script together while playing around with TA's API for
	// an idea I have in a larger script that I've been working on. I won't
	// have much time to make any major changes to it anytime soon.



  const elementStyle = {
//  position: 'absolute',
    position: 'fixed',
//  top: '0px',
//  right: '0px',
    bottom: '0px',
    left: '0px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'black',
    backgroundColor: 'white',
    border: 'solid 1px',
    borderRadius: '2px',
    borderColor: 'forestgreen',
    padding: '2px 8px',
    margin: '10px',
    cursor: 'default',
    zIndex: 10000
  };


// ------------------------------------------
(async () => {
  const element = document.createElement('div');
  const today = () =>
    new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'America/Los_Angeles'
    }).format(new Date)
      .replace(/(\d+)\/(\d+)\/(\d+)/, '$3$1$2');

  const update = async () => {
    let disconnect;
    const messageId = Math.random() + '';
    const queryEarnings = () => {
      window.postMessage({
        id: messageId,
        destination: 'TaskArchive',
        fields: 'monetary_reward',
        searchTasks: {
          state: ['pending', 'approved'],
          date: today()
      }}, document.location.origin);
    };

    const addMessageHandler = resolve => {
      const messageHandler = ({origin, data:{from}, data:{id}, data:{results}}) => {
        if (origin == document.location.origin && from == 'TaskArchive' && id == messageId) {
          let projectedEarnings = 0;
          for (let {monetary_reward} of results) {
            projectedEarnings += monetary_reward;
          }
          resolve('$' + (projectedEarnings / 100).toFixed(2));
        }
      };

      disconnect = projectedEarnings => {
        window.removeEventListener('message', messageHandler);
        GM_setValue(today(), projectedEarnings);
        return projectedEarnings;
      };

      window.addEventListener('message', messageHandler);
    };

    return new Promise(resolve => {
      addMessageHandler(resolve);
      setTimeout(resolve, 1E3, 'error');
      queryEarnings();
    }).then(disconnect);
  };

  for (let property in elementStyle) {
    element.style[property] = elementStyle[property];
  }

  element.textContent = await GM_getValue(today(), '$0.00');
  document.body.appendChild(element);

  window.postMessage({
    destination: 'TaskArchive',
    startEvents: {
      stateChange: ['pending', 'rejected']
  }}, document.location.origin);

  window.addEventListener('message', async ({origin, data:{from}, data:{event}, data:{type}, data:{data}}) => {
    if (origin == document.location.origin && from == 'TaskArchive' && event == 'stateChange' && (type == 'pending' || type == 'rejected') && data[0].date == today()) {
      element.textContent = await update();
    }
  });
})();