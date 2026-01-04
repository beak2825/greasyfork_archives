// ==UserScript==
// @name         Copy mandatory information
// @namespace    https://*.amazon.com
// @version      1.2
// @author       chengng@
// @description  Primary function for the MCM/PCF automation
// @match        https://sim.amazon.com/*
// @match        https://issues.amazon.com/*
// @match        https://tt.amazon.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/475173/Copy%20mandatory%20information.user.js
// @updateURL https://update.greasyfork.org/scripts/475173/Copy%20mandatory%20information.meta.js
// ==/UserScript==

/*
REVISION HISTORY:
0.1 - 2023-09-13 - chengng@ - Initial setup
0.2 - 2023-09-13 - chengng@ - Modify to alert users that creation of MCM only works with Chrome
0.3 - 2023-09-13 - chengng@ - Add author info and browser detection
0.4 to 0.41 - 2023-09-13 - chengng@ - Change the script to activate by button for better user experience
0.5 - 2023-09-20 - chengng@ - Big update with additional "Create PCF" function
0.6 - 2023-09-21 - chengng@ & pantojab@ - Thanks Billy to fix the playbook search function
0.7 - 2023-09-25 - chengng@ - Now search for NDE cutsheet as well for the MCM creation
0.8 - 2023-09-26 - chengng@ - Now search for RFQ and RSPC as well
0.9 - 2023-09-29 - chengng@ - Change the matching URLs
1.0 - 2023-11-07 - chengng@ - Added Device build/config & NDE support MCM buttons
1.1 - 2023-11-16 - chengng@ - update the RFQ URL and Title detection logic
1.2 - 2024-01-12 - chengng@ - Thanks PB, fixed the PCF detection logic
*/

(function () {
  'use strict';

  let alertShown = false;
  let playbookURL = '';
  let uniqueMCMURLs = [];
  let rfqURL = ''; // New variable to store RFQ URL
  let rspcURL = ''; // New variable to store RSPC URL

  const isChrome = /Chrome/.test(navigator.userAgent);

  if (!isChrome) {
    alert("You are not using Chrome. This script is only compatible with Chrome and will now abort.");
    return;
  }

  let buttonClickCount = 0;

  function clickButtonAndWait() {
    const button = document.querySelector('#render-next-stream-activities[data-link*="visible{:remainingUpdateStreamActivities && displayShowMore}"]');

    if (button) {
      button.click();
      buttonClickCount++;

      if (buttonClickCount >= 5) {
        clearInterval(clickInterval);
        console.log('Finished clicking the button.');
        executeRestOfScript();
      }
    } else {
      clearInterval(clickInterval);
      console.log('Button no longer exists.');
      executeRestOfScript();
    }
  }

  const clickInterval = setInterval(clickButtonAndWait, 2000);

function findAndCopyURL() {
  const selector1 = 'div.activity.activity-editable';
  const selector2 = 'div.activity-body.rich-text';

  const elements1 = Array.from(document.querySelectorAll(selector1));
  const elements2 = Array.from(document.querySelectorAll(selector2));

  const activityElements = [...elements1, ...elements2];

  playbookURL = '';
  uniqueMCMURLs = new Set();
  rfqURL = ''; // New variable to store RFQ URL
  rspcURL = ''; // New variable to store RSPC URL

  for (let element of activityElements) {
    const hrefElements = element.querySelectorAll('a');
    for (let hrefElement of hrefElements) {
      const hrefValue = hrefElement.getAttribute('href');
      if (hrefValue) {
          const playbookMatch = hrefValue.match(/https:\/\/playbook2\.amazon\.com\/project\/\d{6,7}/i);
        if (playbookMatch) {
          playbookURL = playbookMatch[0];
        }

        const mcmMatch = hrefValue.match(/https:\/\/(mcm\.amazon\.com\/mcm-[A-Za-z0-9]{8}|mcm\.zhy\.aws-border\.cn\/cms\/[A-Za-z]{3}-[0-9]{7}|mcm\.amazon\.com\/cms\/mcm-[A-Za-z0-9]{8})/i);
        if (mcmMatch) {
          uniqueMCMURLs.add(mcmMatch[0]);
        }

        const rfqMatch = hrefValue.match(/https:\/\/t\.corp\.amazon\.com\/[A-Z]\d{8,9}/i); // Match RFQURL with 1 letter followed by 8 or 9 digits
        if (rfqMatch) {
          if (!rfqURL) {
            // Set rfqURL if it's not already set
            rfqURL = rfqMatch[0];
          }
        }

        // Check if the text contains "RFQ" and set rfqURL as the first URL after "RFQ"
        if (hrefElement.textContent.includes('RFQ') && !rfqURL) {
          rfqURL = hrefValue;
        }

          const rspcMatch = hrefValue.match(/(?:https:\/\/issues\.amazon\.com|https:\/\/sim\.amazon\.com)\/issues\/APACP-\d{4}/i);
        if (rspcMatch) {
          if (!rspcURL) {
            // Set rspcURL if it's not already set
            rspcURL = rspcMatch[0];
          }
        }

        // Check if the text contains "RSPC" and set rspcURL as the first URL after "RSPC"
        if (hrefElement.textContent.includes('RSPC') && !rspcURL) {
          rspcURL = hrefValue;
        }
      }
    }
  }


  console.log('Playbook URL:', playbookURL);
  console.log('MCM URLs:', [...uniqueMCMURLs].join(' & '));
  console.log('RFQ URL:', rfqURL);
  console.log('RSPC URL:', rspcURL);

  return { playbookURL, mcmURL: [...uniqueMCMURLs].join(' & '), rfqURL, rspcURL }; // Return all URLs
}

  function createEle(eleName, text, attrs) {
    let ele = document.createElement(eleName);
    ele.innerText = text;
    for (let k in attrs) {
      ele.setAttribute(k, attrs[k]);
    }
    return ele;
  }

  function createPopup(message) {
    const popupContainer = document.createElement('div');
    popupContainer.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      border: 1px solid #ccc;
      padding: 20px;
      border-radius: 4px;
      z-index: 10000;
    `;

    const popupMessage = document.createElement('div');
    popupMessage.innerText = message;

    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.onclick = function () {
      popupContainer.remove();
    };

    popupContainer.appendChild(popupMessage);
    popupContainer.appendChild(closeButton);

    document.body.appendChild(popupContainer);
  }

  let hoverDetected = false;

  function handleButtonHover(event) {
    if (!hoverDetected) {
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      const popupX = window.innerWidth - 250;
      const popupY = mouseY;

      const popupContainer = document.createElement('div');
      popupContainer.style.cssText = `
        position: fixed;
        top: ${popupY}px;
        left: ${popupX}px;
        background-color: black;
        padding: 20px;
        border-radius: 4px;
        z-index: 10000;
      `;

      const popupMessage = document.createElement('div');
      popupMessage.innerText = 'Detecting necessary infomation, please wait 3 sec';
      popupMessage.style.color = 'red';

      popupContainer.appendChild(popupMessage);
      document.body.appendChild(popupContainer);

      setTimeout(() => {
        popupContainer.remove();
        const { playbookURL, mcmURL, rfqURL, rspcURL } = findAndCopyURL();

        if (!playbookURL && !mcmURL && !rfqURL && !rspcURL) {
          createPopup('Please make sure Playbook/RFQ/RSPC/NDE MCM all availabile in comment before using script.');
        } else if (!playbookURL) {
          createPopup('Please paste Playbook ticket in comment before using script.');
        } else if (!rfqURL) {
          createPopup('Please paste RFQ ticket in comment before using script.');
        } else if (!mcmURL) {
          createPopup('Please paste NDE cutsheet MCM in comment before using script.');
        } else if (!rspcURL) {
          createPopup('Please paste RSPC ticket in comment before using script.');
        }

        hoverDetected = true;
      }, 3000);
    }
  }

  const buttonContainer = createEle('div', '', {
    style: `
      position: fixed;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      z-index: 9999;
    `,
  });

  const installCableBtn = createEle('button', 'Install Cable', {
    style: `
      width: 120px;
      height: 32px;
      margin: 10px 0;
      border: #799dd7;
      border-radius: 4px;
      background: #799dd7;
      color: #fff;
      font-size: 14px;
      outline: none;
      display: block;
    `,
  });

  installCableBtn.onclick = function () {
    window.open(rfqURL + '/communication', '_blank');
    executeRestOfScript();
  };

  installCableBtn.addEventListener('mouseenter', handleButtonHover);

  const patchCableBtn = createEle('button', 'Patch Cable', {
    style: `
      width: 120px;
      height: 32px;
      margin: 10px 0;
      border: #799dd7;
      border-radius: 4px;
      background: #799dd7;
      color: #fff;
      font-size: 14px;
      outline: none;
      display: block;
    `,
  });

  patchCableBtn.onclick = function () {
    window.open('https://mcm.amazon.com/cms/new?from_template=7b61ac86-0baa-44af-b9f5-be930912b72d', '_blank');
    executeRestOfScript();
  };

  patchCableBtn.addEventListener('mouseenter', handleButtonHover);

  const hwInstallBtn = createEle('button', 'HW install', {
    style: `
      width: 120px;
      height: 32px;
      margin: 10px 0;
      border: #799dd7;
      border-radius: 4px;
      background: #799dd7;
      color: #fff;
      font-size: 14px;
      outline: none;
      display: block;
    `,
  });

  hwInstallBtn.onclick = function () {
    window.open('https://mcm.amazon.com/cms/new?from_template=0d640ded-d096-48a6-b3f5-c7c2d5fa76a7', '_blank');
    executeRestOfScript();
  };

  hwInstallBtn.addEventListener('mouseenter', handleButtonHover);

  const DeviceBdBtn = createEle('button', 'Device Bd/Cfg/Upg', {
    style: `
      width: 120px;
      height: 32px;
      margin: 10px 0;
      border: #799dd7;
      border-radius: 4px;
      background: #799dd7;
      color: #fff;
      font-size: 12px;
      outline: none;
      display: block;
    `,
  });

  DeviceBdBtn.onclick = function () {
    window.open('https://mcm.amazon.com/cms/new?from_template=0b3579e5-e2c5-4a19-9474-1e6f14e64aed', '_blank');
    executeRestOfScript();
  };

  DeviceBdBtn.addEventListener('mouseenter', handleButtonHover);

  const NDEsupportBtn = createEle('button', 'NDE Support', {
    style: `
      width: 120px;
      height: 32px;
      margin: 10px 0;
      border: #799dd7;
      border-radius: 4px;
      background: #799dd7;
      color: #fff;
      font-size: 14px;
      outline: none;
      display: block;
    `,
  });

  NDEsupportBtn.onclick = function () {
    window.open('https://mcm.amazon.com/cms/new?from_template=90e25523-0f97-4baa-8517-5b6c9922ddb5', '_blank');
    executeRestOfScript();
  };

  NDEsupportBtn.addEventListener('mouseenter', handleButtonHover);

    const buttonOffBtn = createEle('button', 'Button OFF', {
    style: `
      width: 120px;
      height: 32px;
      margin: 10px 0;
      border: #ccc;
      border-radius: 4px;
      background: #ccc;
      color: #fff;
      font-size: 14px;
      outline: none;
      display: block;
    `,
  });

  function removeHoverEventListeners() {
    installCableBtn.removeEventListener('mouseenter', handleButtonHover);
    patchCableBtn.removeEventListener('mouseenter', handleButtonHover);
    hwInstallBtn.removeEventListener('mouseenter', handleButtonHover);
    DeviceBdBtn.removeEventListener('mouseenter', handleButtonHover);
    NDEsupportBtn.removeEventListener('mouseenter', handleButtonHover);
    createPCFBtn.removeEventListener('mouseenter', handleButtonHover);
  }

  buttonOffBtn.addEventListener('click', removeHoverEventListeners);

  buttonOffBtn.onclick = function () {
    buttonContainer.remove();
  };

  const createPCFBtn = createEle('button', 'Create PCF', {
    style: `
      width: 120px;
      height: 32px;
      margin: 10px 0;
      border: #799dd7;
      border-radius: 4px;
      background: #799dd7;
      color: #fff;
      font-size: 14px;
      outline: none;
      display: block;
    `,
  });

  createPCFBtn.addEventListener('mouseenter', handleButtonHover);

  function updateCreatePCFButton() {
    const { playbookURL, mcmURL, rfqURL, rspcURL } = findAndCopyURL();

    if (playbookURL) {
      createPCFBtn.onclick = function () {
        window.open(playbookURL, '_blank');
        executeRestOfScript();
      };
    }
  }

  updateCreatePCFButton();

  buttonContainer.appendChild(installCableBtn);
  buttonContainer.appendChild(patchCableBtn);
  buttonContainer.appendChild(hwInstallBtn);
  buttonContainer.appendChild(DeviceBdBtn);
  buttonContainer.appendChild(NDEsupportBtn);
  buttonContainer.appendChild(createPCFBtn);
  buttonContainer.appendChild(buttonOffBtn);

  document.body.appendChild(buttonContainer);

  const intervalId = setInterval(updateCreatePCFButton, 2000);

  function executeRestOfScript() {
    let titleInfo = document.querySelector('title').innerText;
    let pageURL = window.location.href;

    // Extracting userinput1
    let match1 = /\[(.*?)\]/.exec(titleInfo);
    let userinput1 = match1 && match1[1] ? match1[1].replace(/[\[\]]/g, "") : "";

    // Extracting content of the 2nd and 3rd brackets
    let brackets = titleInfo.match(/\[(.*?)\]/g);
    let secondBracketContent = brackets && brackets[1] ? brackets[1].replace(/[\[\]]/g, "") : "";
    let thirdBracketContent = brackets && brackets[2] ? brackets[2].replace(/[\[\]]/g, "") : "";

    // DE/NW logic for userinput3
    const nwdeRegex = /(NW|DE)(.{8})/i;
    let matchNWDE2nd = nwdeRegex.exec(secondBracketContent);
    let matchNWDE3rd = nwdeRegex.exec(thirdBracketContent);

    let userinput2 = matchNWDE2nd ? matchNWDE2nd[0] : (matchNWDE3rd ? matchNWDE3rd[0] : "");

    // Determine userinput3 based on the position of DE/NW
    let userinput3 = "";
    if (matchNWDE2nd) {
        userinput3 = thirdBracketContent;
    } else if (matchNWDE3rd) {
        userinput3 = secondBracketContent;
    }

    // Set userinput2 to "NWxxxx2023" if no NW/DE detected
    if (!matchNWDE2nd && !matchNWDE3rd) {
        userinput2 = "NWxxxx2023";
    }

      let userinputURL = playbookURL || 'No URL found';
      let userinputURL2 = [...uniqueMCMURLs].join(' & ') || 'No MCM URL found';
      let userinputURL3 = rfqURL || 'No URL found';
      let userinputURL4 = rspcURL || 'No URL found';

  // Append the URLs the clipboard text
  let combinedInput = userinput1 + "\n" + userinput2 + "\n" + userinput3 + "\n" + pageURL + "\n" + userinputURL + "\n" + userinputURL2 + "\n" + userinputURL3 + "\n" + userinputURL4;

  GM_setClipboard(combinedInput); // Update the clipboard

  }
})();