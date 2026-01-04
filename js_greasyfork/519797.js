// ==UserScript==
// @name         ControlD IP Flusher
// @description  Automatically flush IP addresses from ControlD Endpoint device logs in Legacy mode.
// @author       @T3SL4
// @namespace    https://github.com/0x11DFE
// @version      05/12/24
// @license	 MIT
// @icon         https://i.imgur.com/I7yP7HH.jpeg
// @icon64       https://i.imgur.com/Ec7CwUP.jpeg
// @match        *://controld.com/dashboard/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519797/ControlD%20IP%20Flusher.user.js
// @updateURL https://update.greasyfork.org/scripts/519797/ControlD%20IP%20Flusher.meta.js
// ==/UserScript==

(function() {
  'use strict';

  /**
   * This script automates the removal of IP address entries from
   * the Endpoint device logs in ControlD's Legacy DNS resolver mode.
   *
   * ControlD, a powerful DNS management service, offers a Legacy mode
   * for older devices that may not support modern DNS protocols. In this mode,
   * ControlD logs the IP addresses of devices making DNS queries. This script
   * helps you automatically clear these logs by continuously checking for
   * new IP address entries on the ControlD page and deleting them.
   *
   * Why is this useful?
   * - Privacy: Regularly flushing IP logs can help maintain privacy by
   *   reducing the amount of historical data stored.
   * - Troubleshooting: Clearing logs can be helpful when diagnosing network
   *   issues or testing new configurations.
   *
   * IMPORTANT: This script is specifically designed for ControlD's Legacy
   * DNS resolver mode with the "Auto Authorize IP" feature enabled.
   * Ensure you have this configuration before running the script.
   *
   * In order for this script to function correctly, you must first navigate
   * to the "Endpoint Devices" tab within ControlD and click into the specific
   * device's "IPs" section. This will allow the script to continuously monitor
   * and clear the IP address entries for that device.
   *
   * Disclaimer: This script is provided as-is and may require adjustments
   * based on the specific structure of the ControlD webpage. Use it responsibly
   * and at your own risk.
   */

  // Function to simulate a click on an element with an optional delay
  const clickElement = (selector, delay = 0) => {
    setTimeout(() => {
      const element = document.querySelector(selector);
      if (element) {
        element.click();
      } else {
        console.error(`Element not found: ${selector}`);
      }
    }, delay);
  };

  const deleteIPs = () => {
    // Select all IP address elements
    const ipButtons = document.querySelectorAll("[aria-label='select ip']");

    if (ipButtons.length > 0) {
      // Select all IP addresses
      ipButtons.forEach(btn => btn.click());

      // Click the delete button after a short delay
      clickElement("[aria-label='delete ips button']", 500); // .5s

      // Click the confirmation button after another delay
      clickElement("[aria-label='confirm delete ip button']", 500); // .5s

    } else {
      // No IP addresses found, check again after a delay
      setTimeout(deleteIPs, 5000); // Check every 5s
    }
  };

  // Start the process
  deleteIPs();

})();