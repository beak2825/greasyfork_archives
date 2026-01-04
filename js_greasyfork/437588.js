// ==UserScript==
// @name        V2rayA - Add country flag to Ip or domain
// @namespace   Violentmonkey Scripts
// @description This script will convert ip or domain to country from "Server Address" column on V2rayA's web interface
// @version     0.3
// @author      thelostthing
// @license     MIT
// 
// @match       http://localhost:2017/
// @match       http://127.0.0.1:2017/
// 
// @grant       GM_xmlhttpRequest
// @require     https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// 
// @downloadURL https://update.greasyfork.org/scripts/437588/V2rayA%20-%20Add%20country%20flag%20to%20Ip%20or%20domain.user.js
// @updateURL https://update.greasyfork.org/scripts/437588/V2rayA%20-%20Add%20country%20flag%20to%20Ip%20or%20domain.meta.js
// ==/UserScript==

const ipFlag = () => {
  $('section.tab-content > .tab-item:not([style*="display: none"]) td[data-label="Server Address"]:not(.flagged)').each( function( index, element ) {
    const domain_ip = $(element).html().split(':')[0].trim();
    
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://api.techniknews.net/ipgeo/'+domain_ip,
      headers: { cache: true, 'Cache-Control': 'max-age=86400' },
      onload: function( response ) {
        if( response.status == 200 && !$(element).hasClass('flagged') ) {
          const geoJson = JSON.parse(response.responseText);
          if( geoJson.countryCode && geoJson.country ) {
            const country_code = geoJson.countryCode && geoJson.countryCode.toLowerCase();
            const coutry_icon = document.createElement('img');
            coutry_icon.src = 'https://cdn.jsdelivr.net/npm/round-flag-icons/flags/'+country_code+'.svg';
            coutry_icon.title = geoJson.country;
            coutry_icon.width = 18;
            $(element).prepend(coutry_icon);
            $(element).addClass('flagged');
          }
        }
      }
    });
  })
}

const checkContent = ( target ) => new Promise( (resolve, reject) => {
  new MutationObserver( (mutations, self) => {
    for( let mutation of mutations) {
      if( !mutation.target.hidden && mutation.target.classList.contains('tab-item')) {
        self.disconnect();
        resolve();
      }
    }
  }).observe(target, { subtree: true, attributes: true, attributeOldValue : true, attributeFilter: ['style'] });
});

document.onreadystatechange = () => {
  if ( document.readyState === 'complete' ) {
    ipFlag(); // for default server page
  
    $('.main-tabs > nav.tabs > ul > li').click(async () => {
      await checkContent(document.querySelector('.tab-content'));
      ipFlag();
    });
  }
}