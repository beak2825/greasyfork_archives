// ==UserScript==
// @name         Plugins for capturing URLs
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Send the URL to your remote server to build your own benign dataset
// @author       pic4xiu
// @icon         https://cdn2.iconfinder.com/data/icons/artificial-intelligence-6/64/ArtificialIntelligence6-512.png
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468709/Plugins%20for%20capturing%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/468709/Plugins%20for%20capturing%20URLs.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Get the URL of the current page
  const currentUrl = window.location.href;

  // Send HTTP request to send URL to server
  GM_xmlhttpRequest({
    method: 'POST',
    url: 'http://***:7000',//Change it to your own. I use Alibaba Cloud. It's easy to use. Go to Alibaba Cloud when you go to the cloud! 
    data: currentUrl,//Of course, if you want to be more secure, you can change it to https
    headers: {
      'Content-Type': 'text/plain'
    },
    onload: function(response) {
      console.log('URL sent to server');
    },
    onerror: function(error) {
      console.error('Error sending URL to server:', error);
    }
  });
})();

/*
//The server receives the URL and writes it to the urls.txt file. This is a demonstration of nodejs
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      fs.appendFile('urls.txt', body + '\n', err => {
        if (err) {
          console.error('Error appending URL to file:', err);
          res.statusCode = 500;
          res.end('Error appending URL to file');
        } else {
          console.log('URL appended to file:', body);
          res.statusCode = 200;
          res.end('URL appended to file');
        }
      });
    });
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

server.listen(7000, () => {
  console.log('Server running on port 7000');
*/