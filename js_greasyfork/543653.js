// ==UserScript==
// @name        Auto-Submit Forms on Hostingzbuzz and Oii
// @namespace   Violentmonkey Scripts
// @match       https://hostingzbuzz.com/*/*
// @match       https://oii.la/*
// @grant       none
// @version     2.2
// @author      Drigtime
// @license     MIT
// @description Automatically submits forms on hostingzbuzz.com and oii.la, checks getmylink and nextpage for FORM tag, and handles go-link via XMLHttpRequest with custom headers and retries every 2 seconds
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/543653/Auto-Submit%20Forms%20on%20Hostingzbuzz%20and%20Oii.user.js
// @updateURL https://update.greasyfork.org/scripts/543653/Auto-Submit%20Forms%20on%20Hostingzbuzz%20and%20Oii.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Function to serialize form data
  function serializeForm(form) {
    const formData = new FormData(form);
    const params = new URLSearchParams();
    for (const [key, value] of formData) {
      params.append(key, value);
    }
    return params.toString();
  }

  // Function to send XMLHttpRequest with retry
  function sendRequestWithRetry(url, body) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        console.log('Response status:', xhr.status, xhr.statusText);
        console.log('Response headers:', xhr.getAllResponseHeaders());
        if (xhr.status === 200) {
          try {
            const result = JSON.parse(xhr.responseText);
            console.log('Response body:', result);
            if (result.status === 'success' && result.url) {
              console.log('Redirecting to:', result.url);
              window.location.href = result.url;
            } else {
              console.warn('No valid URL in response, retrying in 2 seconds:', result);
              setTimeout(() => sendRequestWithRetry(url, body), 2000); // Retry after 2 seconds
            }
          } catch (e) {
            console.error('Failed to parse response JSON, retrying in 2 seconds:', e);
            setTimeout(() => sendRequestWithRetry(url, body), 2000); // Retry after 2 seconds
          }
        } else {
          console.error('Request failed, retrying in 2 seconds:', xhr.status, xhr.statusText);
          setTimeout(() => sendRequestWithRetry(url, body), 2000); // Retry after 2 seconds
        }
      }
    };
    console.log('XMLHttpRequest details:', {
      url: url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: body
    });
    xhr.send(body);
  }

  // Check for getmylink, nextpage, or go-link forms
  const getmylink = document.getElementById('getmylink');
  const nextpage = document.getElementById('nextpage');
  const golink = document.getElementById('go-link');

  if (getmylink && getmylink.tagName === 'FORM') {
    console.log('Submitting form: getmylink');
    getmylink.submit();
  } else if (nextpage && nextpage.tagName === 'FORM') {
    console.log('Submitting form: nextpage');
    nextpage.submit();
  } else if (golink && golink.tagName === 'FORM') {
    // Add class and start request with retry for go-link
    golink.classList.add('go-link');
    console.log('Added class "go-link" to #go-link form');
    const url = golink.action || 'https://oii.la/links/go'; // Use form action if available
    const body = serializeForm(golink);
    sendRequestWithRetry(url, body);
  } else {
    console.warn('No valid form found.');
  }
})();