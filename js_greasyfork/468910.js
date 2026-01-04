// ==UserScript==
// @name         Paste Images - MAL
// @namespace    TheUploader
// @version      5
// @description  Copy any image and paste it on MAL to get it uploaded to Imgur and have the direct image link and BBCode automatically added to the reply box!
// @author       hacker09
// @match        https://myanimelist.net/profile/*
// @match        https://myanimelist.net/forum/?topicid=*
// @match        https://myanimelist.net/comtocom.php?id1=*
// @match        https://myanimelist.net/mymessages.php?go=send&*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @connect      imgur.com
// @downloadURL https://update.greasyfork.org/scripts/468910/Paste%20Images%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/468910/Paste%20Images%20-%20MAL.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.body.addEventListener('paste', function(event) { //When the user pastes on the website
    document.querySelectorAll(".sourceMode > textarea").forEach(function(el) { //ForEach reply box
      const clipboardData = event.clipboardData || event.originalEvent.clipboardData; // Retrieves clipboard data for the paste event
      if (Array.from(clipboardData.items).find(item => item.type.indexOf('image') !== -1)) { //If its an image
        const formData = new FormData(); //Creates a new instance of FormData object
        formData.append('image', Array.from((event.clipboardData || event.originalEvent.clipboardData).items).find(item => item.type.indexOf('image') !== -1)?.getAsFile()); //Appends an image file from clipboard data to the FormData object

        GM.xmlHttpRequest({ //Starts a new xmlHttpRequest
          method: 'POST',
          url: 'https://api.imgur.com/3/image',
          headers: {
            'Authorization': 'Client-ID aca6d2502f5bfd8'
          },
          data: formData,
          onload: function(response) {
            if (JSON.parse(response.responseText).data.error !== undefined) //If the API is being time rate limited
            { //Starts the if condition
              el.value += ` ${JSON.parse(response.responseText).data.error.message}`; //Add the error message to the reply box
            } //Finishes the if condition
            else //If the API is not being time rate limited
            { //Starts the else condition
              el.value += ` [img]${JSON.parse(response.responseText).data.link}[/img]`; //Add the Imgur direct image link and BBCode to the reply box
            } //Finishes the else condition

            document.querySelectorAll(".js-timeline-reply-submit,.btn-recaptcha-submit,.mt8.ac > input,.spaceit > input").forEach(function(el) { //ForEach New Reply button / "Send Message"
              el.title = `The script can upload ${response.responseHeaders.match(/X-ratelimit-clientremaining:\s*(\d+)/i)[1]} images today.\nYou have ${response.responseHeaders.match(/x-ratelimit-userremaining:\s*(\d+)/i)[1]} image uploads left per hour.\nYour user upload limits will reset again in ${Math.floor(parseInt(response.responseHeaders.match(/x-ratelimit-userreset:\s*(\d+)/i)[1]) / 60)} minutes.\nLast uploaded image dimensions: (${JSON.parse(response.responseText).data.width + '×' + JSON.parse(response.responseText).data.height}) / (${JSON.parse(response.responseText).data.size} Bytes)`; //Show helpful info on hover
            }); //Finishes the ForEach New Reply button function
          } //Finishes the xmlHttpRequest onload event listener
        }); //Finishes the xmlHttpRequest
      } //Finishes the if condition
    }); //Finishes the ForEach Reply button function
  });
})();