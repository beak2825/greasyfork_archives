// ==UserScript==
// @name           Finn.no EU-kontroll-frist
// @namespace      http://mikeri.net
// @author         Michael Ilsaas
// @description    Viser frist for EU-kontroll i bruktbilannonser på Finn.no
// @version        0.1
// @run-at         document-end
// @match          https://www.finn.no/car/used/ad.html*
// @grant          GM_xmlhttpRequest
// @require        https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/40931/Finnno%20EU-kontroll-frist.user.js
// @updateURL https://update.greasyfork.org/scripts/40931/Finnno%20EU-kontroll-frist.meta.js
// ==/UserScript==

regNoEl = $('dt:contains("Reg.nr")').next();
regNo = regNoEl.text();
url = "https://www.vegvesen.no/system/mobilapi?registreringsnummer=" + regNo;
addEuDateEl();

GM_xmlhttpRequest({
      method: "GET",
      url: url,
      onload: function(response) {
              addEuStatus(response.responseText);
            }
});

function getEuDate(xmlData) {
	data = $.parseXML(xmlData);
    $xml = $(data);
    euDate = $xml.find("eukontrollfrist").text();
    return euDate;
}

function addEuStatus(data) {
    euDate = getEuDate(data);
    $("#eudate").text(euDate);
}

function addEuDateEl() {
    regNoEl.after('<dt data-automation-id="key">EU-kontroll</dt><dd id="eudate" data-automation-id="value">søker...</dd>');
}
