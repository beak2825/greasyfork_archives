// ==UserScript==
// @name         VrapiLogger
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Log submission data.
// @author      Andy
// @include     https://safe.hostcompliance.com/dashboard/tasks/address_identification/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @require     https://unpkg.com/papaparse@5.0.0/papaparse.min.js
// @grant       GM_getValue
// @grant       GM_setValue

// @downloadURL https://update.greasyfork.org/scripts/388116/VrapiLogger.user.js
// @updateURL https://update.greasyfork.org/scripts/388116/VrapiLogger.meta.js
// ==/UserScript==
(function(){
  const buttonCSS = "box-sizing:border-box;text-align:center;width:33%;min-height:30px;cursor:pointer;border:2px solid black;display:inline-block";
  const containerCSS = "position:fixed;top:0;left:64%;z-index:2;width:36%;";

  $("body").append(`<div id='vrapi-logger-button-container' style='${containerCSS}'></div>`);
  $("#vrapi-logger-button-container").append(`<div id='vrapi-logger-record-data' style='${buttonCSS}'>Log Data</div>`);
  $("#vrapi-logger-button-container").append(`<div id='vrapi-logger-download-data' style='${buttonCSS}'>Download CSV</div>`);
  $("#vrapi-logger-button-container").append(`<div id='vrapi-logger-delete-data' style='${buttonCSS}'>Clear Records</div>`);
  const recordButton = document.getElementById('vrapi-logger-record-data');
  const downloadButton = document.getElementById('vrapi-logger-download-data');
  const deleteButton = document.getElementById('vrapi-logger-delete-data');

  let alreadyLogged = false;
  let confirmDelete = false;
  let storedIndex;

  const retrieveData = function(){
    let storedData = JSON.parse(GM_getValue("storedDataVrapi", null));
    if (!Array.isArray(storedData)){
      storedData = [];
    }
    return storedData;
  };

  const deleteData = function(){
    if(confirmDelete){
      alreadyLogged = false;
      storedIndex = null;
      deleteButton.style.border = "2px solid red";
      deleteButton.style.background = "#f39191";
      GM_setValue("storedDataVrapi", "[]");
    } else {
      confirmDelete = true;
      deleteButton.style.border = "2px solid pink";
    }
  };

  const retrieveDate = function(){
    let date = new Date();
    date = date.toISOString().substring(0,10);
    return date;
  };

  const recordData = function(){
    const date = retrieveDate();

    //Retrieve values from inputs and links.
    const listing = document.querySelector("a.md-no-style.md-button.md-ink-ripple").href;

    const address = document.querySelector("input[name='identified_formatted_address']").value;

    const unitSelection = document.querySelector("select[name='type_unit_number']").value;
    const unit = (unitSelection === "2") ? "Yes, but I don't know it" : document.querySelector("input[name='identified_unit_number']").value;

    const parcel = document.querySelector("input[name='identified_parcel_number']").value;

    const lat = document.querySelector("input[name='latitude']").value;
    const long = document.querySelector("input[name='longitude']").value;
    const gps = lat +", "+long;

    const proof = document.getElementById('input_13').value;

    let submission = [date, listing, address, unit, parcel, gps, proof];
    //Retrieve data from the three evidence sections.
    for (let i = 1; i < 4; i++){
      const evidenceURL = document.querySelector(`input[name='explanation_${i}']`).value;
      const matchComment = document.querySelector(`input[name='evidence_url_${i}']`).value;
      submission = submission.concat([evidenceURL, matchComment]);
    }

    const storedData = retrieveData();
    //Overwrite submission data if already logged.
    if (alreadyLogged && storedData[storedIndex]){
        storedData[storedIndex] = submission;
    } else {
        storedData.push(submission);
        storedIndex = storedData.length-1
        alreadyLogged = true;
    }
    recordButton.style.border = "2px solid green";
    recordButton.style.background = "#609948";
    GM_setValue("storedDataVrapi", JSON.stringify(storedData));
    console.log(storedData);
  };

  const downloadCSV = function (){
    const date = retrieveDate();
    const storedData = retrieveData();
    const header = [
        'Date',
        'Listing',
        'Address',
        'Unit',
        'Parcel No.',
        'GPS',
        'Proof',
        'Evidence URL 1',
        'Match Comment 1',
        'Evidence URL 2',
        'Match Comment 2',
        'Evidence URL 3',
        'Match Comment 3'
    ];
    let csvData = Papa.unparse({
      fields:header,
      data:storedData
    });

    const csv = new Blob([csvData], {type: 'text/csv;charset=utf-8;'});
    const csvURL = window.URL.createObjectURL(csv);

    const csvElement = document.createElement("a");
    csvElement.href = csvURL;
    csvElement.target = "_blank";
    csvElement.download = `submissionLog-${date}.csv`;
    csvElement.dispatchEvent(new MouseEvent("click"));
    window.URL.revokeObjectURL(csv);

    downloadButton.style.border = "2px solid green";
    downloadButton.style.background = "#609948";
  };

  recordButton.addEventListener('click', recordData);
  downloadButton.addEventListener('click', downloadCSV);
  deleteButton.addEventListener('click', deleteData);
}());

