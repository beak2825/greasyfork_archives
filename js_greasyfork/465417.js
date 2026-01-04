// ==UserScript==
// @name           Futbin Plus
// @name:en        Futbin Plus
// @namespace      iN4sser
// @match          *://*.futbin.com/*/squad/*
// @match          *://*.futbin.com/*/player/*
// @run-at         document-end
// @grant          none
// @version        1.2.2
// @author         Nasser Alrayes
// @description    Adding some features to Futbin
// @description:en Adding some features to Futbin
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465417/Futbin%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/465417/Futbin%20Plus.meta.js
// ==/UserScript==

// Squad rating statistics
if (window.location.href.includes('futbin.com') && window.location.href.includes('/squad/')) {
    function displayTotalPlayerRating() {
      'use strict';
  
      const elementList = Array.from(document.querySelectorAll('#area .pcdisplay-rat'));
      const numbers = elementList.reduce((obj, element) => {
        const elementText = element.textContent;
        const elementNumbers = elementText.match(/\d+/g);
        if (elementNumbers) {
          elementNumbers.forEach(number => {
            obj[number] = (obj[number] || 0) + 1;
          });
        }
        return obj;
      }, {});
  
      const resultDiv = document.createElement('div');
      resultDiv.className = 'TotalRating';
      const resultHtml = Object.entries(numbers).map(([number, count]) => `
        <span class="Number">${number}</span>
        <span class="Count">${count}</span>
        <br>
      `).join('');
  
      resultDiv.innerHTML = resultHtml;
      document.querySelector('#area').appendChild(resultDiv);
    }
  
    // CSS
    const style = document.createElement('style');
    style.innerHTML = `
      .TotalRating {
        margin-top: 10px;
      }
      .Number, .Count {
        display: inline-block;
        width: 30px;
        height: 20px;
        margin: 1px;
        font-size: 14px;
        line-height: 1;
        text-align: center;
        padding: 5px;
        text-transform: uppercase;
        cursor: pointer;
        transition: .35s;
        border-radius: 3px;
        box-shadow: 0 2px 5px 0 rgba(0,0,0,.16), 0 2px 10px 0 rgba(0,0,0,.12);
      }
      .Number {
        background: #00ffae;
        color: #212121;
      }
      .Count {
        background: #292929;
        color: #fff;
      }
    `;
  
    document.head.appendChild(style);
  
    displayTotalPlayerRating();
  }
  
  
  // YouTube Player Review
  if (window.location.href.match(/.*:\/\/.*\.futbin\.com\/.*\/player\/.*/)) {
    function addYouTubeButton() {
      'use strict';
  
      const playerPage = document.querySelector("body > div.site-player-page > div.container.p-xs-0 > div.row.col-md-12.padding_5.page-header-top.mt-2 > div.col-md-4.padding_5 > ol > li:nth-child(2) > a");
      const playerName = document.querySelector('.pcdisplay-name').textContent.trim();
      const searchUrl = `https://www.youtube.com/results?search_query=${playerPage.textContent.trim()} ${playerName} Review`;
      const iconUrl = 'https://www.youtube.com/s/desktop/0953dc72/img/favicon_48x48.png';
  
      const iconHtml = `<a href="${searchUrl}" target="_blank"><img src="${iconUrl}" class="YouTubePlayerReview" style="display: unset; line-height: 2.7;"></a>`;
  
      const shareTooltip = document.querySelector('.link-holder.inline-block.pt-2');
      shareTooltip.insertAdjacentHTML('afterend', iconHtml);
    }
  
    window.addEventListener('load', addYouTubeButton);
  }
  
  
  