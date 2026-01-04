// ==UserScript==
// @name        Wagepoint.com - Download Paystub History Pdfs
// @match       https://secure.wagepoint.com/essdashboard
// @grant       none
// @version     1.0.6
// @author      tkodev
// @namespace   tkodev/wagepoint-paystub-history-pdfs
// @license     GNU GPLv3
// @description 4/24/2023, 3:55:02 PM
// @downloadURL https://update.greasyfork.org/scripts/464774/Wagepointcom%20-%20Download%20Paystub%20History%20Pdfs.user.js
// @updateURL https://update.greasyfork.org/scripts/464774/Wagepointcom%20-%20Download%20Paystub%20History%20Pdfs.meta.js
// ==/UserScript==

// await for delay
const waitForDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// await for el to appear
const waitForEl = (selector) => new Promise((resolve) => {
  const curElement = document.querySelector(selector)
  if (curElement) {
    return resolve(curElement);
  }

  const observer = new MutationObserver((mutations) => {
    const newElement = document.querySelector(selector)
    if (newElement) {
      resolve(newElement);
      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes : true, attributeFilter : ['style']
  });
})

// open payroll modal and download pdf
const downloadPayrollId = async (payrollId) => {
  console.log(`now downloading: ${payrollId}`)
  showPayStub(payrollId)
  await waitForEl('#viewPayStubForm[style="display: block;"]')
  const pdfButton = await waitForEl('#viewPayStubPDF')
  pdfButton.setAttribute("download", "");
  pdfButton.click()
  const closeButton = await waitForEl('.overlay')
  closeButton.click()
  await waitForEl('#viewPayStubForm[style="display: none;"]')
}

// get payroll ids
const getPayrolls = async () => {
  const elements = [ ...document.querySelectorAll('.payroll-history input[value="Details »"]') ]
  const payrollIds = elements.map((element) => element.getAttribute('onclick').match(/^showPayStub\((.+)\)$/)[1])
  for (const payrollId of payrollIds) {
    await downloadPayrollId(payrollId)
  }
}

// create and append button to div
const createButton = () => {
  var button = document.createElement("input");
  button.setAttribute("type", "button");
  button.setAttribute("class", "button");
  button.setAttribute("value", "Download Paystub History Pdfs");
  button.setAttribute("style", "margin: 4px 0px; width: 100%;");
  const div = [ ...document.querySelectorAll('.payroll-history h2') ][1]
  div.after(button);
  button.addEventListener('click', getPayrolls)
}
createButton()
