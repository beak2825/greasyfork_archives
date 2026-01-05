// ==UserScript==
// @name        Pipermail date view: reversed timestamped
// @namespace   armeagle.nl
// @description In the date view of a Pipermail archive, reverse the sorting of entries (newest on top) and add the message timestamp
// @include     */pipermail/*/*/date.html
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/3020/Pipermail%20date%20view%3A%20reversed%20timestamped.user.js
// @updateURL https://update.greasyfork.org/scripts/3020/Pipermail%20date%20view%3A%20reversed%20timestamped.meta.js
// ==/UserScript==

var list = document.querySelectorAll('body > ul')[1];
var entries = list.querySelectorAll('li');
if (entries.length > 1) {
	var topEntry = entries[0];
	timestampify(topEntry);
	for (index = 1; index < entries.length; index++) {
		var entry = entries[index];
		
		topEntry.parentNode.insertBefore(entry, topEntry);
		topEntry = entry;
		timestampify(topEntry);
	}
}

function timestampify(entry) {
	var link = entry.querySelector('a');
	var url = link.getAttribute('href');
	
	GM_xmlhttpRequest({
        method: "GET",
        url: link.getAttribute('href'),
        onload: function(response) {
			if (!response.responseXML) {
				response.responseXML = new DOMParser()
				.parseFromString(response.responseText, "text/html");
			}
            var timestamp = response.responseXML.querySelector('body > i').textContent;
			
			var timestampElement = document.createElement('small');
			timestampElement.appendChild(document.createTextNode(timestamp));
			entry.appendChild(timestampElement);
        }
    });
	
	console.log(url);
	
}