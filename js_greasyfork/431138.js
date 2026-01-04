// ==UserScript==
// @name        Request Finder - redacted.ch
// @namespace   Violentmonkey Scripts
// @match       https://redacted.ch/upload.php
// @grant       none
// @version     1.0
// @author      chyfp (https://redacted.ch/user.php?id=54179)
// @description Look for requests that match the name of your upload
// @downloadURL https://update.greasyfork.org/scripts/431138/Request%20Finder%20-%20redactedch.user.js
// @updateURL https://update.greasyfork.org/scripts/431138/Request%20Finder%20-%20redactedch.meta.js
// ==/UserScript==

const getPotentialRequests = () => {
  const uploadTitle = $("#title").val();
  $("#links").empty();
  $.getJSON(`https://redacted.ch/ajax.php?action=requests&search=${uploadTitle}`, (data) => {
    const results = data.response.results;
    
    if (results.length > 0) {
      const resultData = results.map(result => {
        return {
          url: `https://redacted.ch/requests.php?action=view&id=${result.requestId}`,
          title: result.title
        }
      });

      resultData.forEach(result => {
        $("#links").append(`<b>${result.title}:</b>&nbsp;<a href='${result.url}' target='_blank'>${result.url}</a><br/>`);
      })
    } else {
       $("#links").append("Nothing Found");
    }
  });
}

$("#content").append("<table><tbody><tr><td width='25%'><button id='requestSearch'>Search For Requests</button></td><td id='links'></td></tr></tbody></table>")
if($("#requestSearch")) {
  $("#requestSearch").click(getPotentialRequests)
}
