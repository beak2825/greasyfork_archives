// ==UserScript==
// @name         Send2Phone
// @namespace    bilipan
// @version      0.1.2
// @description  Send website to phone via IFTTT webhook
// @author       bilipan
// @match        http://*/*
// @match        https://*/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/372006/Send2Phone.user.js
// @updateURL https://update.greasyfork.org/scripts/372006/Send2Phone.meta.js
// ==/UserScript==
(function() {
  function send2Phone() {
  	var url = encodeURIComponent(location.href);
    GM.xmlHttpRequest({
      method: 'POST',
      url: 'https://maker.ifttt.com/trigger/send2phone/with/key/dTy9QziGOdqg-Rdj2WMxEC?value1='+url,
      onload: function(response) {
        var resp = JSON.parse(response.responseText);
        console.log(resp);
      },
    });
  }
  var $btn = $('<button>Send2Phone</button>');
  $(document.body).prepend($btn);
  $btn.css({position: "fixed", bottom: 0, left: 0, "z-index": 100000, padding:"3px 10px"});
	$btn.on('click', send2Phone);
}());