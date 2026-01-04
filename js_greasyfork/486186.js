// ==UserScript==
// @name         User Group Automation Script
// @namespace    com.scale.userscripts.bulba
// @version      0.2
// @description  Automate user grouping tasks
// @author       KaushikMahorker
// @match        https://datacompute.google.com/m2/scale_ai/bard_data*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486186/User%20Group%20Automation%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/486186/User%20Group%20Automation%20Script.meta.js
// ==/UserScript==


//========= MODIFY THIS =======
const inputRows = [
  {
      userEmail: 'stephcurrymvp758@gmail.com',
      groupName: 'tomer_test'
  },
  {
    userEmail: 'kmahorker@gmail.com',
    groupName: 'kaushik_test1'
  },
  {
      userEmail: 'stephcurrymvp758@gmail.com',
      groupName: 'kaushik_test1'
  },
  {
    userEmail: 'lithofyre1@gmail.com',
    groupName: 'kaushik_test1'
  },
  {
    userEmail: 'kmahorker@gmail.com',
    groupName: 'kaushik_test1'
  },

];




//===== DO NOT MODIFY PAST HERE ======

function throwValidationError(messageContent) {
  throw {
    name: 'ValidationError',
    message: messageContent
  };
}

// Function to click the 'Raters' tab using XPath
function clickRatersTab() {
  // Define the XPath for the 'Raters' tab
  const ratersTabXPath = '/html/body/c-wiz/div/div[3]/div/div[2]/div[2]/div[2]/div[1]/ul/li[3]/div';
  // Use document.evaluate to find the element
  const ratersTabElement = document.evaluate(
    ratersTabXPath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue;

  if (ratersTabElement) {
    // Simulate a click on the 'Raters' tab
    ratersTabElement.click();
  } else {
    console.error('Raters tab not found');
  }
}

function clickRatersTabAlt() {
  const ratersTabDiv = document.querySelector('li.tpL2Nd[data-nav-page="labelers"] > div.pf1jLe');

  if (ratersTabDiv) {
    // Dispatch a click event to the 'Raters' tab div
    ratersTabDiv.click();
  } else {
    console.error('Raters tab not found');
  }
}

function executeClickRaters() {
  console.log('starting script');
  // Select the node that will be observed for mutations
  const targetNode = document.body;

  // Options for the observer (which mutations to observe)
  const config = { attributes: false, childList: true, subtree: true };

  // Callback function to execute when mutations are observed
  const callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // Check if the 'Raters' tab is now present
        if (document.querySelector('li.tpL2Nd[data-nav-page="labelers"] > div.pf1jLe')) {
          clickRatersTab();
          // Once the tab is clicked, there is no need to observe for mutations any longer
          observer.disconnect();
          break;
        }
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
}

(async function () {
  'use strict';

  // Define the xPaths
  const xPaths = {
    addGlobalFilter:
      '/html/body/c-wiz/div/div[3]/div/div[2]/div[2]/div[1]/div/div/div[1]/ul/li/div[2]/div[1]/input[2]',
    filterEmailType:
      '/html/body/c-wiz/div/div[3]/div/div[2]/div[2]/div[1]/div/div/div[1]/ul/li/div[2]/div[2]/div/div/div/div[3]',
    filterEmailSearchBar:
      '/html/body/c-wiz/div/div[3]/div/div[2]/div[2]/div[1]/div/div/div[1]/ul/li[1]/div[2]/div[2]/div[2]/div/span/div/div/div/div/div[1]/div/div[1]/input',
    applyEmailSearch:
      '/html/body/c-wiz/div/div[3]/div/div[2]/div[2]/div[1]/div/div/div[1]/ul/li[1]/div[2]/div[2]/div[3]/div',
    searchBar:
      '/html/body/c-wiz/div/div[3]/div/div[2]/div[2]/div[1]/div/div/div[1]/ul/li/div[2]/div[1]/input[2]',
    addToGroup: '/html/body/c-wiz/div/div[3]/div/div[2]/div[2]/div[3]/div/div[2]/div[2]/div/button',
    addToGroupSearch: '/html/body/div[9]/div[2]/div/div/div/div[2]/div/label/input',
    addToGroupDialogComplete: '/html/body/div[9]/div[2]/div/div/div/div[4]/div[2]/button',
    checkboxAll:
      '/html/body/c-wiz/div/div[3]/div/div[2]/div[2]/div[3]/div/div[3]/div[2]/div/div[1]/table/thead/tr/th[1]/div/div',
    verifyLoadedGroups: '/html/body/div[9]/div[2]/div/div/div/div[3]/div[1]',
    verifyGroupName: '/html/body/div[9]/div[2]/div/div/div/div[3]/div/label',
    confirmAddedCloseButton: '/html/body/div[9]/div[2]/div/div[2]/button',
    clearGlobalFiltersButton:
      '/html/body/c-wiz/div/div[3]/div/div[2]/div[2]/div[1]/div/div/div[2]/div',
    //initiateSearch: '/html/body/c-wiz/div/div[3]/div/div[2]/div[2]/div[1]/div/div/div[1]/ul/li/div[2]/div[2]/div/div/div[1]/div[2]/div',
    // checkbox: '/html/body/c-wiz/div/div[3]/div/div[2]/div[2]/div[3]/div/div[3]/div[2]/div/div[1]/table/tbody/tr/td[1]/div/div/input',
    checkbox2:
      '/html/body/c-wiz/div/div[3]/div/div[2]/div[2]/div[3]/div/div[3]/div[2]/div/div[1]/table/tbody/tr/td[1]/div/div',
    groupCountSpan: '/html/body/c-wiz/div/div[3]/div/div[2]/div[2]/div[3]/div/div[3]/div[2]/div/div[1]/table/tbody/tr/td[4]/div/div/button/span',
    zeroGroupCountSpan: '/html/body/c-wiz/div/div[3]/div/div[2]/div[2]/div[3]/div/div[3]/div[2]/div/div[1]/table/tbody/tr/td[4]/div/div/button/span',
    emailEntry: '/html/body/c-wiz/div/div[3]/div/div[2]/div[2]/div[3]/div/div[3]/div[2]/div/div[1]/table/tbody/tr/td[2]'
  };

  const selectorPaths = {
    checkbox:
      '#yDmH0d > c-wiz > div > div.pOBVE > div > div.yze1pe > div.HRTlac > div.yE1WOb > div > div.p7ZiKf > div.lHjNMb > div > div.VfPpkd-wZVHld-zg7Cn-haAclf > table > tbody > tr > td.VfPpkd-wZVHld-aOtOmf.VfPpkd-wZVHld-aOtOmf-OWXEXe-MPu53c > div > div > input',
    checkoxAll:
      '#yDmH0d > c-wiz > div > div.pOBVE > div > div.yze1pe > div.HRTlac > div.yE1WOb > div > div.p7ZiKf > div.lHjNMb > div > div.VfPpkd-wZVHld-zg7Cn-haAclf > table > thead > tr > th.VfPpkd-wZVHld-vqLbZd-eEDwDf.VfPpkd-wZVHld-vqLbZd-eEDwDf-OWXEXe-MPu53c > div > div',
    radioButton:
      '#yDmH0d > div.VfPpkd-Sx9Kwc.cC1eCc.UDxLd.PzCPDd.VfPpkd-Sx9Kwc-OWXEXe-FNFY6c > div.VfPpkd-wzTsW > div > div > div > div.VeiUQ > div > div',
    groupCountSpan:
    '#yDmH0d > c-wiz > div > div.pOBVE > div > div.yze1pe > div.HRTlac > div.yE1WOb > div > div.p7ZiKf > div.lHjNMb > div > div.VfPpkd-wZVHld-zg7Cn-haAclf > table > tbody > tr > td:nth-child(4) > div > div > button > span',
  };

  // Function to click the Add Global Filter button
  function clickAddGlobalFilter() {
    const addGlobalFilterButton = getElementByXPath(xPaths.addGlobalFilter);
    addGlobalFilterButton.click();
  }

  function clickSelector(selectorPath) {
    const element = document.querySelector(selectorPath);
    element.click();
  }

  function clickSelectorAfterDelay(selectorPath, delay) {
    setTimeout(() => {
      clickSelector(selectorPath);
    }, delay);
  }

  function clickXPath(xpath) {
    const element = getElementByXPath(xpath);
    if (element) {
      element.click();
    } else {
      console.error('Element not found for XPath:', xpath);
    }
  }

  function clickXPathAfterDelay(xpath, delay) {
    setTimeout(() => {
      clickXPath(xpath);
    }, delay);
  }

  function simulateMouseClickAfterDelay(xpath) {
    const element = getElementByXPath(xpath);
    ['mousedown', 'mouseup', 'click'].forEach(eventType => {
      element.dispatchEvent(
        new MouseEvent(eventType, {
          view: window,
          bubbles: true,
          cancelable: true,
          buttons: 1,
        }),
      );
    });
  }

  function simulateMouseClick(xpath) {
    const element = getElementByXPath(xpath);
    ['mousedown', 'mouseup', 'click'].forEach(eventType => {
      element.dispatchEvent(
        new MouseEvent(eventType, {
          view: window,
          bubbles: true,
          cancelable: true,
          buttons: 1,
        }),
      );
    });
  }

  async function filterEmailDialog(userEmail) {
    populateSearchByXpath(xPaths.filterEmailSearchBar, userEmail);
    // Click the search button or element that initiates search
    await waitForElement(xPaths.applyEmailSearch, () =>
      clickXPathAfterDelay(xPaths.applyEmailSearch, 500),
    );
  }
  // Function to search for a user by email
  async function searchUser(userEmail) {
    await waitForElement(xPaths.searchBar, () => clickXPathAfterDelay(xPaths.searchBar, 500));
    await waitForElement(xPaths.filterEmailType, () =>
      clickXPathAfterDelay(xPaths.filterEmailType, 500),
    );
    await waitForElement(
      xPaths.filterEmailSearchBar,
      async () => await filterEmailDialog(userEmail),
    );
  }

  function addToGroupDialog(groupName) {
    populateSearchByXpath(xPaths.addToGroupSearch, groupName);
    verifyGroupNameElement(groupName, () =>
      clickSelectorAfterDelay(selectorPaths.radioButton, 200),
    );
    clickSelectorAfterDelay(selectorPaths.radioButton, 1500);
    // waitForElement(xPaths.addToGroupDialogComplete, () => clickXPathAfterDelay(xPaths.addToGroupDialogComplete, 200));
    waitForButtonAndClick(xPaths.addToGroupDialogComplete);
  }

  async function addToGroupFlow(groupName) {
    waitForButtonAndClick(xPaths.addToGroup);
    await waitForElement(xPaths.verifyLoadedGroups, () => addToGroupDialog(groupName));
    waitForButtonAndClick(xPaths.confirmAddedCloseButton);
  }

  // Function to click the checkbox next to the user's email
  function clickCheckbox() {
    console.log('start click checkbox');
    clickSelectorAfterDelay(selectorPaths.checkbox, 500);
    //clickXPathAfterDelay(xPaths.checkBox2, 8000);
    console.log('end click');
  }

  function populateSearchByXpath(xpath, value) {
    const element = getElementByXPath(xpath);
    if (element) {
      element.value = value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      console.error('Element not found for XPath:', xpath);
    }
  }

  // Utility function to get an element by XPath
  function getElementByXPath(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
      .singleNodeValue;
  }


  async function waitForSelectorPeriodic(selector, callback, maxTimeout = 10000) {
    let elapsedTime = 0;
    const intervalTime = 500; // Check every 500 milliseconds

    return new Promise((resolve, reject) => {
      const intervalId = setInterval(async () => {
        const element = document.querySelector(selector);
        if (element) {
          clearInterval(intervalId);
          await callback();
          resolve();
        } else if (elapsedTime > maxTimeout) {
          console.log(`TIMED OUT for selector: ${selector}`);
          clearInterval(intervalId);
          reject(new Error(`Element not found within the specified time: ${selector}`));
        }
        elapsedTime += intervalTime;
      }, intervalTime);
    });
  }

  async function waitForSelector(selector, callback) {
    return new Promise((resolve, reject) => {
      const observer = new MutationObserver(async (mutations, me) => {
        const element = document.querySelector(selector);
        console.log('element:', element);
        if (element) {
          await callback();
          resolve(element);
          me.disconnect(); // Stop observing once the element is found
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Optional: reject the promise after a timeout if the element is not found
      setTimeout(() => {
        console.log(`TIMED OUT for selector periodic: ${selector}`);
        observer.disconnect();
        reject(new Error('Element not found within the specified time: ' + selector));
      }, 10000); // Timeout after 10 seconds, for example
    });
  }


  async function waitForElementPeriodic(xpath, callback, maxTimeout = 10000) {
    let elapsedTime = 0;
    const intervalTime = 100; // Check every 500 milliseconds

    return new Promise((resolve, reject) => {
      const intervalId = setInterval(async () => {
        const element = getElementByXPath(xpath);
        if (element) {
          clearInterval(intervalId);
          await callback();
          resolve();
        } else if (elapsedTime > maxTimeout) {
          console.log(`TIMED OUT for element periodic: ${selector}`);
          clearInterval(intervalId);
          reject(new Error(`Element not found within the specified time: ${selector}`));
        }
        elapsedTime += intervalTime;
      }, intervalTime);
    });
  }
  // Function to wait for an element to be available in the DOM and then execute a callback - if value is specified only resolve when the value is found
  async function waitForElement(xpath, callback, value = null) {
    return new Promise((resolve, reject) => {
      const observer = new MutationObserver(async (mutations, me) => {
        const element = getElementByXPath(xpath);
        if (element) {
          if (value && element.textContent !== value) {
            return;
          }
          await callback();
          resolve(element);
          me.disconnect(); // Stop observing once the element is found
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Optional: reject the promise after a timeout if the element is not found
      setTimeout(() => {
        console.log(`TIMED OUT for element: ${element}`);
        observer.disconnect();
        reject(new Error('Element not found within the specified time: ' + xpath));
      }, 10000); // Timeout after 10 seconds, for example
    });
  }

  // Function to wait for a button to be enabled and then click
  function waitForButtonAndClick(xpath) {
    const observer = new MutationObserver(() => {
      const button = getElementByXPath(xpath);
      if (button && !button.disabled) {
        // clickXPath(xpath);
        simulateMouseClick(xpath);
        observer.disconnect(); // Stop observing once the button is clicked
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['disabled'],
    });
  }

  function groupCountSpan() {}

  function verifyGroupNameElement(groupName, callback) {
    const observer = new MutationObserver(() => {
      const groupNameElement = getElementByXPath(xPaths.verifyGroupName);
      if (groupNameElement && groupNameElement.textContent === groupName) {
        callback();
        observer.disconnect(); // Stop observing once the group name is verified
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  async function validateGroupCount(expectedCount, callback, callbackParams, callbackResult) {
    const groupCountSpan = document.querySelector(selectorPaths.groupCountSpan);

    console.log('groupCountSpan:', groupCountSpan);
    // console.log('zeroGroupCountSpan:', zeroGroupCountSpan);
    if ((groupCountSpan && groupCountSpan.textContent === expectedCount)) { // || (zeroGroupCountSpan && zeroGroupCountSpan.textContent === expectedCount)) {
      console.log ('Group count validation passed');
     callback(true, callbackParams, callbackResult);
     return;
    }
    callback(false, callbackParams, callbackResult);
  }

  function validateGroupCountCallback(result, params, callbackResult) {
    const message = result ? `Group count validation passed for ${params?.userEmail}` : `Group count validation failed for ${params?.userEmail}`;
    callbackResult.result = result;
    console.log('INNER CALLBACK:', message);
    if (!result) {
      console.error(message);
      // throw new throwValidationError(message);
    }
  }

  function continueAfterFailedGroupCountValidation() {
    // reset
    console.log('clear global filters');
    clickXPathAfterDelay(xPaths.clearGlobalFiltersButton, 500); // Clear the global filters to reset
    waitForButtonAndClick(xPaths.searchBar);
  }

  // Start the process
  async function runIteration(inputRow) {
    const userEmail = inputRow.userEmail;
    const groupName = inputRow.groupName;

    await waitForElement(xPaths.searchBar, async () => await searchUser(userEmail)); // Replace with actual user email

    //VALIDATIONS

    const callbackResult = {
      result: false
    };

    // Waits for the email entry to appear and then validates the group count
    await waitForElement(xPaths.emailEntry, async () => await validateGroupCount('0', validateGroupCountCallback, { userEmail }, callbackResult), userEmail);
    console.log('OUTER callbackResult:', callbackResult);
    if (!callbackResult.result) {
      console.log(`RETURNING: Group count validation failed for ${userEmail}`);
      continueAfterFailedGroupCountValidation();
      return false;
    }


    // Wait for the checkbox related to the user to appear and then click it
    await waitForSelectorPeriodic(selectorPaths.checkbox, () => clickCheckbox(), 10000);
    console.log('checkbox found');

    // clickCheckbox();
    // , async () => new Promise((resolve, reject) => {
    //   clickCheckbox()
    //   resolve();
    // }));
    await waitForElementPeriodic(xPaths.addToGroup, async () => await addToGroupFlow(groupName)); // Replace with actual group name

    console.log('clear global filters');
    clickXPathAfterDelay(xPaths.clearGlobalFiltersButton, 500); // Clear the global filters to reset
    waitForButtonAndClick(xPaths.searchBar);
    // waitForElement(xPaths.clearGlobalFiltersButton, () => simulateMouseClickAfterDelay(xPaths.clearGlobalFiltersButton, 500)); // Clear the global filters to reset
    return true;
  }

  const successRows = [];
  const failedRows = [];
  executeClickRaters();
  await waitForElement(xPaths.addGlobalFilter, () => clickAddGlobalFilter());
  for (const inputRow of inputRows) {
    console.log('starting iteration', inputRow);
    const status = await runIteration(inputRow);
    if (status) {
      successRows.push(inputRow);
    } else {
      failedRows.push(inputRow);
    }
      // include continue and abort options
      // const choice = window.confirm('CONTINUE EXECUTION?');
      // if (!choice) {
      //   throw new Error('Execution aborted');
      // } else {
      //   console.log('Continuing with the next iteration');
      // }
    console.log('iteration complete');
    console.log('successEmails:', successRows);
    console.log('failedEmails:', failedRows);
  }
})();
