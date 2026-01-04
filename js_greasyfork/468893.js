// ==UserScript==
// @name             Cloudflare Bypasser for Nitro Type Race
// @match            https://www.nitrotype.com/race
// @match            https://www.nitrotype.com/race/*
// @author           Sing Developments
// @grant            none
// @description      Bypass Cloudflare
// @license MIT
// @version          2
// @namespace https://singdevelopmentsblog.wordpress.com/?p=4354
// @icon         https://singdevelopmentsblog.files.wordpress.com/2022/11/nitrotype-logo.jpg
// @downloadURL https://update.greasyfork.org/scripts/468893/Cloudflare%20Bypasser%20for%20Nitro%20Type%20Race.user.js
// @updateURL https://update.greasyfork.org/scripts/468893/Cloudflare%20Bypasser%20for%20Nitro%20Type%20Race.meta.js
// ==/UserScript==


// This code is for educational purposes only and may not work or be safe to use.
// It tries to reverse engineer the Cloudflare JavaScript challenge and make a request to the target website.

// Define the target website URL
const targetURL = 'https://nitrotype.com/race';

// Define a function to extract the challenge parameters from the HTML source
function getChallengeParams(html) {
  // Use regular expressions to match the challenge parameters
  const challenge = /name="jschl_vc" value="(\w+)"/.exec(html)[1];
  const pass = /name="pass" value="(.+?)"/.exec(html)[1];
  const s = /s\s*=\s*document\.createElement\('div'\);\s*s\.innerHTML\s*=\s*"(.+?)";/.exec(html)[1];
  const k = /k\s*=\s*'(\w+)';/.exec(html)[1];
  return {challenge, pass, s, k};
}

// Define a function to solve the challenge expression using eval
function solveChallengeExpr(expr) {
  // Replace document.getElementById with a dummy function
  expr = expr.replace(/document\.getElementById/g, 'function(){}');
  // Evaluate the expression and return the result
  return eval(expr);
}

// Define a function to make a request using XMLHttpRequest
function makeRequest(url, callback) {
  // Create a new XMLHttpRequest object
  const xhr = new XMLHttpRequest();
  // Open a GET request to the url
  xhr.open('GET', url);
  // Set the response type to text
  xhr.responseType = 'text';
  // Set the onload event handler to call the callback function with the response text
  xhr.onload = function() {
    callback(xhr.responseText);
  };
  // Send the request
  xhr.send();
}

// Make an initial request to the target website
makeRequest(targetURL, function(response) {
  // Get the challenge parameters from the response
  const params = getChallengeParams(response);
  // Solve the challenge expression using eval
  const answer = solveChallengeExpr(params.s + params.k);
  // Construct the verification URL with the challenge parameters and answer
  const verifyURL = targetURL + '/cdn-cgi/l/chk_jschl?jschl_vc=' + params.challenge + '&pass=' + params.pass + '&jschl_answer=' + answer;
  // Wait for 4 seconds before making the verification request
  setTimeout(function() {
    makeRequest(verifyURL, function(response) {
      // Check if the verification was successful
      if (response.includes('You are being redirected')) {
        // Redirect to the target website
        window.location.href = targetURL;
      } else {
        // Display an error message
        alert('Verification failed');
      }
    });
  }, 4000);
});
