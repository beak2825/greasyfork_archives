// ==UserScript==
// @name         Lemmy Local Community Redirect
// @version      1.1
// @description  Adds a button to open a community page in your local instance.
// @author       @lemmy.world/u/soy, @lemmy.world/u/fperson
// @match        https://*/c/*
// @icon         https://join-lemmy.org/static/assets/icons/favicon.svg
// @namespace    fperson.dev
// @license      GPL 3.0
// @downloadURL https://update.greasyfork.org/scripts/469221/Lemmy%20Local%20Community%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/469221/Lemmy%20Local%20Community%20Redirect.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const localLemmy = 'lemmy.world';
  const isLemmy = document.head.querySelector('[name~=Description][content]').content === 'Lemmy';

  if (!isLemmy) {
    return;
  }

  // Get URL info
  const splitUrl = location.href.split('/');
  const instanceUrl = splitUrl[2];
  const community = splitUrl[4];
  let localizedUrl = `https://${localLemmy}/c/${community}`;
  if (!community.includes('@')) {
    localizedUrl = `${localizedUrl}@${instanceUrl}`;
  }

  // Create redirect button if not on local
  if (instanceUrl !== localLemmy) {
    var zNode = document.createElement('a'); // create anchor tag
    zNode.href = localizedUrl; // set the href
    zNode.textContent = `Open in ${localLemmy}`; // set the text
    zNode.id = 'localizeContainer'; // set the id
    // update styles for a more modern look
    zNode.style = `
          display: inline-block;
          cursor: pointer;
          padding: 5px 20px;
          background-color: #007BFF;
          color: #FFF;
          text-decoration: none;
          border-radius: 5px;
          border: none;
          box-shadow: 0 2px 5px rgba(0,0,0,0.15);
          font-size: 1rem;
          font-weight: bold;
          transition: background-color 0.3s ease;
          top: 5rem;
          right: 1rem;
          z-index: 1000;
          `;
    zNode.addEventListener('mouseenter', function () {
      this.style.backgroundColor = '#0056b3';
    });
    zNode.addEventListener('mouseleave', function () {
      this.style.backgroundColor = '#007BFF';
    });

    function addButtonIfNotPresent(node) {
      const link = node.querySelector('a[href*="/create_post"]');
      if (link && !link.parentNode.querySelector('#localizeContainer')) {
        var zNode = document.createElement('a');
        zNode.href = localizedUrl;
        zNode.textContent = `Open in ${localLemmy}`;
        zNode.id = 'localizeContainer';
        zNode.style = `
    display: inline-block;
    cursor: pointer;
    padding: 5px 20px;
    background-color: #007BFF;
    color: #FFF;
    text-decoration: none;
    border-radius: 5px;
    border: none;
    box-shadow: 0 2px 5px rgba(0,0,0,0.15);
    font-size: 1rem;
    font-weight: bold;
    transition: background-color 0.3s ease;
    top: 5rem;
    right: 1rem;
    z-index: 1000;
  `;
        zNode.addEventListener('mouseenter', function () {
          this.style.backgroundColor = '#0056b3';
        });
        zNode.addEventListener('mouseleave', function () {
          this.style.backgroundColor = '#007BFF';
        });

        link.parentNode.appendChild(zNode);
      }
    }

    const observer = new MutationObserver(function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              addButtonIfNotPresent(node);
            }
          });
        }
      }
    });

    // Options for the observer (which mutations to observe)
    const config = { childList: true, subtree: true };

    // Target node to observe
    const targetNode = document.body;

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    // Run initial check
    document.querySelectorAll('.card-body').forEach(addButtonIfNotPresent);
  }
})();
