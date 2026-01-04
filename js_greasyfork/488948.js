// ==UserScript==
// @name        VMS Additions
// @namespace   Violentmonkey Scripts
// @match       *://vms.fcvfra.org/*
// @grant       none
// @version     1.0
// @author      -
// @license     MIT
// // not used yet [?] require https://code.jquery.com/jquery-3.7.1.min.js
// // not used yet [?] require https://code.jquery.com/ui/1.13.1/jquery-ui.min.js
// @description 2/29/2024, 1:27:49 AM
// @downloadURL https://update.greasyfork.org/scripts/488948/VMS%20Additions.user.js
// @updateURL https://update.greasyfork.org/scripts/488948/VMS%20Additions.meta.js
// ==/UserScript==

function addDayOfWeekToDates() {
  // all native js, no jquery stuff here
  const weekday = ["(Su)","(Mo)","(Tu)","(W)","(Th)","(F)","(Sa)"];
  //regex date finder matches e.g. mm/dd/yy OR mm/dd/yyyy, with or without leading zeros, I think
  r = /(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-](\d{4}|\d{2})/g
  dates = document.body.innerHTML.match(r);
  uniqueDates = new Set(dates);
  for (d of uniqueDates) {
    // gets day of week from date
    this_d = new Date(d);
    day = weekday[this_d.getDay()];
    console.log(this_d, day);
    // match on all copies of date d
    matchD = new RegExp(d, 'g');
    // replace in text
    document.body.innerHTML = document.body.innerHTML.replace(matchD, d.concat(" ").concat(day));
  }
}

async function addCrewDataToShiftLinks(cssPath) {
  // works on main page to find the table of duty shifts
  dutyShiftTable = document.body.querySelector(cssPath);
  // create a parser to handle
  var parser = new DOMParser();
  for (shift of dutyShiftTable.rows) {
    // look for the ones with a shift link in them <a href=...>
    if (shift.querySelectorAll("a").length > 0) {
      //console.log(shift.innerHTML);
      shiftLink = shift.querySelector("a"); //finds the link
      otherPage = await fetch(shiftLink.href).then(function (response) { return response.text();});
      otherHTML = parser.parseFromString(otherPage, 'text/html');
      crewTable = getCrewFromTable(otherHTML);
      shiftLink.setAttribute('title', crewTable);
                             //otherHTML.querySelector('.table').innerHTML);
    };
  };
};

function getCrewFromTable(crewTable) {
  crewHTML = crewTable.querySelector('.table').querySelectorAll('.layoutelement');
  crewTable = new Array();
  for (memberHTML of crewHTML) {
    role = memberHTML.querySelector('label').textContent.trim();
    name = memberHTML.querySelector('.layoutvalue').textContent.trim();
    if (name === 'Sign up!') name = '';
    crewTable.push(role.concat('\t').concat(name).concat('\r\n'));
    //crewTable.push([role, '\t', name, '\r\n']);
  }
  return crewTable;
}

function addCrewDataToPages() {
  url = document.URL.split('?')[0];
  if (url === "https://vms.fcvfra.org/membersonly.cfm") {
    cssPath = '#column2-40 > div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > table:nth-child(1)';
    addCrewDataToShiftLinks(cssPath);
  }
  if (url === "https://vms.fcvfra.org/membersonly/duty.cfm") {
    cssPath = '#column1-50 > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > table:nth-child(1)';
    addCrewDataToShiftLinks(cssPath);
    cssPath = '#column2-50 > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > table:nth-child(1)';
    addCrewDataToShiftLinks(cssPath);
  }
}

async function getDataFromPage(url) {
  var parser = new DOMParser();
  otherPage = await fetch(url).then(function (response) { return response.text();});
  otherHTML = parser.parseFromString(otherPage, 'text/html');
  return otherHTML;
}

async function getPeopleFromTrainingPage(url) {
  // get the data from the other page and create an html object
  var parser = new DOMParser();
  otherPage = await fetch(url).then(function (response) { return response.text();});
  otherHTML = parser.parseFromString(otherPage, 'text/html');

  peopleTable = otherHTML.querySelector('.table').querySelector('.portletcontent');
  peopleSections = peopleTable.querySelectorAll('.layoutelement');
  peopleArray = new Array();
  for (section of peopleSections) {
    // section titles are Interested, Approved and Enrolled
    sectionTitle = section.querySelector('.layoutlabel').innerText.split(" (")[0].trim();
    sectionPeople = section.querySelector('.layoutvalue').innerText.replace(/\r|\n|\t/g,'');
    if (sectionPeople.trim() === "None found") {
      peopleArray.push([sectionTitle, [['', '']]])
    } else {
      sectionPeople = section.querySelector('.layoutvalue').innerText.replace(/\r|\n|\t/g,'').split(', ');
      // split up to create an array in format [ station, name ]
      personStationArray = new Array();
      for (person of sectionPeople) {
        person = person.replace('\r','').replace('\t','').replace('\n','');
        //strips off the final ')' of the station and splits on ' ('
        data = person.trim().slice(0,-1).split(' (');
        // insert station eg. 410 then person name
        personStationArray.push([data[1], data[0]]);
        personStationArray = personStationArray.sort();
      }
      peopleArray.push([sectionTitle, personStationArray])
    }
  }
  return peopleArray;
}

async function thing() {
  // only work on the pages in the training section
  url = document.URL.split('?')[0];
  if (url === "https://vms.fcvfra.org/membersonly/training.cfm") {
    trainingEventDataArray = document.querySelectorAll('.datarow');
    rowIndex = 2
    for (trainingEventRow of trainingEventDataArray) {
        rowIndexIncrementer = 0;
        // hide the ones that are old (gray)
        if (!trainingEventRow.classList.contains('gray')) {
        trainingEventLink = trainingEventRow.querySelector('a').href;
        p = await getPeopleFromTrainingPage(trainingEventLink);
        for (enrollmentStatusRow of p) {
          // make a new row for each of 3 statuses: enrolled/approved/interested
          if (enrollmentStatusRow[1][0][0] != "") {
            //console.log(enrollmentStatusRow[1]);
            newRow = document.querySelector('tbody').insertRow(rowIndex);
            newRow.classList = trainingEventRow.classList; // same format as previous row
            newRow.insertCell(); // offset by one, which we'll ignore
            titleCell = newRow.insertCell()
            titleCell.innerHTML = enrollmentStatusRow[0];
            newCell = newRow.insertCell();
            newCell.colSpan = 8; // use almost the whole width of the table
            station = "";
            result = "";
            //console.log(station)
            for (enrollmentStationPerson of enrollmentStatusRow[1]) {
              thisStation = enrollmentStationPerson[0];
              thisPerson = enrollmentStationPerson[1];
              if (enrollmentStationPerson[0] === station) {
                result = result.concat(thisPerson).concat(', ');
                //console.log(thisPerson);
              } else {
                station = thisStation;
                //console.log(station);
                result = result.concat('\n<b>').concat(station).concat(':</b> ').concat(thisPerson).concat(', ');
                //console.log(thisPerson);
              }
            }
            newCell.innerHTML = result;
            rowIndexIncrementer += 1;
          }
        }
        //p.then( function (result) { newCell.innerHTML = result;});
      }
        rowIndex += (1 + rowIndexIncrementer);
    }
  }
}

addDayOfWeekToDates();
addCrewDataToPages();
thing();