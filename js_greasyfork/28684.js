// ==UserScript==
// @name         Visualise Orienteering Splits
// @namespace    http://watsons.id.au
// @version      2.7.000
// @description  allow orienteering splits visualisation
// @include      http://obasen.orientering.se/winsplits/online/*/default.asp*
// @include      http://wmoc2016.ee/2016/wmoc2016/longf/split*
// @include      http://act.orienteering.asn.au/eventor/results/splits/*
// @author       Arthur Watson
// @copyright    2017+ GPL
// @grant        none
// @run-at-document-start
// @downloadURL https://update.greasyfork.org/scripts/28684/Visualise%20Orienteering%20Splits.user.js
// @updateURL https://update.greasyfork.org/scripts/28684/Visualise%20Orienteering%20Splits.meta.js
// ==/UserScript==
/*
 @require http://http://members.iinet.net.au/~arthurwatson@netspace.net.au/visualiser/visualise_splits.user.js
 @require file:///home/watsar/public_html/tampermonkey/visualise_splits.user.js
 @include      http://act.orienteering.asn.au/gfolder/results/*
*/

//"use strict";
/*jslint
   browser: true, continue: true, indent: 2, regexp: true, white: true, sloppy: true
*/

var
  visLiterals = {

  },
  visConstants = {
    secondsPerMinute: 60,
    secondsPerHour: 3600,
    minutesPerHour: 60
  },
  htmlHead = function() {/*
    <meta charset="utf-8">
    <meta name="description" content="Visualise Orienteering Split Times">
    <meta name="author" content="Arthur Watson">
    <meta name="version" content="2.1">
    <meta name="last modified" content="04 Sep 2017">
    <meta name="robots" content="noindex, nofollow">
    <title>Visualise Orienteering Split Times</title>
*/}.toString().slice( 15, -3),
  htmlBody = function() {/*
    <div class="container">
      <div class="headers">
        <h1 class="aardvark">Orienteering Splits Time Visualiser</h1>
        <h2 class="aardvark" id="description"></h2>
      </div>
      <!-- <div class="box">
        <button class="splits" type="submit" onclick="drawSplits();">1. Begin Here!</button>
      </div> -->
      <div class="box">
        <div id="courseclasslistcell"></div>
        <div id="showrunnerbuttoncell"></div>
      </div>
      <div class="box">
        <div id="runnerlistcell"></div>
        <div id="visualisebuttoncell"></div>
      </div>
      <div class="box">
        <button id="helpButton" class="splits" type="submit" onclick="window.open( 'http://members.iinet.net.au/~arthurwatson@netspace.net.au/visualiser/documentation.html',target='_blank','height=500,width=400');">Show Help.</button>
        <!-- <button id="helpButton" class="splits" type="submit" onclick="interact.displayHelp();">Show Help.</button> -->
        <!-- <div id="showhelp" class="hide box"></div> -->
      </div>

    <div class="courses" id="tableSplits"></div>
    <div class="graph" id="visualSplits"></div>
    <div class="declaration" id="source"><p>Produced from published data by SOURCE. [Aardvark Systems 2017]</p></div>
    <input type="hidden" id="eventdata" onchange="drawSplits();" value="">
*/}.toString().slice( 15, -3);

function fixTime( t) {
  var
    items = [],
    seconds = 0;

  // remove the leg place [ n] for WMOC
  t = t.replace( /\[.*?\]/, '');

  items = t.split( /[.:]/);

  switch ( items.length) {
  case 2:
    // m:s, so will be OK but change . to :
    t = items[ 0] + ':' + items[ 1];
    seconds = parseInt( items[ 0], 10) * 60 + parseInt( items[ 1], 10);
    break;
  case 3:
    // h:m:s
    t = parseInt( items[ 0], 10) * 60 + parseInt( items[ 1], 10);
    t = t.toString() + ':' + items[ 2];
    seconds = parseInt( items[ 0], 10) * 3600 + parseInt( items[ 1], 10) * 60 + parseInt( items[ 2], 10);
    break;
    default:
      if ( !isNaN( parseInt( t, 10))) {
        t = '0:' + t;
        seconds = parseInt( t, 10);
      }
  }
  return [ t, seconds];
}

function timeToSeconds( t) {
  // transform the [h:]mm.ss on the WinSplits page --> seconds

  var
    items = [],
    seconds = 0;

  items = t.split( /[.:]/);

  switch ( items.length) {
  case 2:
    // m.s
    seconds = parseInt( items[ 0], 10) * visConstants.secondsPerMinute +
              parseInt( items[ 1], 10);
    break;
  case 3:
    // h:m.s
    seconds = parseInt( items[ 0], 10) * visConstants.secondsPerHour +
              parseInt( items[ 1], 10) * visConstants.secondsPerMinute +
              parseInt( items[ 2], 10);
    break;
    default:
      if ( !isNaN( parseInt( t, 10))) {
        seconds = parseInt( t, 10);
      }
  }
  return seconds;
}

function timeFormat( t) {
  // transform the [h]:mm.ss on the WinSplits page --> mmm:ss

  var
    items = [];

  items = t.split( /[.:]/);

  switch ( items.length) {
  case 2:
    // m:s, so will be OK but change . to :
    t = items[ 0] + ':' + items[ 1];
    break;
  case 3:
    // h:m:s --> m:s
    t = parseInt( items[ 0], 10) * visConstants.minutesPerHour +
        parseInt( items[ 1], 10);
    t = t.toString() + ':' + items[ 2];
    break;
    default:
      if ( !isNaN( parseInt( t, 10))) {
        t = '0:' + t;
      }
  }
  return t;
}

function pad( str, max) {
  return str.length < max ? pad( "0" + str, max) : str;
}

function secondsToTime( s) {
  // convert seconds to mmm:ss
  var min, sec;

  min = ( Math.floor( s / 60)).toString();
  sec = pad( (s - ( min* 60)).toString(), 2);

  return min + ':' + sec;
}

function stripHeader( header) {
  // change the header from S-1 (135) to 1, & 11-F to 11
  var regex = /^[\w\W]*\-\s*(\d+)[\w\W]*$/;
  if ( header.indexOf( 'F') > -1) {
    header = 'F';
  }
  else {
    header = header.replace( regex, '$1');
  }
  return header;
}

function stripWhitespace( text) {
  // remove leading and trailing whitespace
  var regex = /\s*(.*?)\s*$/;  // non greedy match of non-whitespace
  text = text.replace( regex, '$1');
  return text;
}

function processMessage ( message, ageClass, eventTitle) {
  var
    i,
    j,
    runnerIndex,
    results = {};

  // fix ageclass
  ageClass = ageClass.replace( /\s+\([\w\s]*\)/, '');

  results.description = eventTitle;
  results.courses = [];
  results.courses[ 0] = {};
  results.courses[ 0].name = 'Course: - Not Stated';
  results.courses[ 0].ageclasses = [];
  results.courses[ 0].ageclasses[ 0] = ageClass;

  results.courses[ 0].controlcodes = [];
  for ( j = 1; j < message[ 1].length - 1; j += 1) { // just the control sequence really
    results.courses[ 0].controlcodes[ j - 1] = stripHeader( message[ 1][ j]);
  }

  results.courses[ 0].runners = [];
  runnerIndex = 0;
  for ( i = 2; i < message.length; i += 2) {  // process every second line
    if ( fixTime( message[ i][ 2])[ 1] < 1 ||
         isNaN( fixTime( message[ i][ 2])[ 1])) { // ignore dnf's etc
      continue;
    }
    results.courses[ 0].runners[ runnerIndex] = {};
    results.courses[ 0].runners[ runnerIndex].name = message[ i][ 1];
    results.courses[ 0].runners[ runnerIndex].ageclass = ageClass;
    results.courses[ 0].runners[ runnerIndex].time = timeFormat( message[ i][ 2]);
    results.courses[ 0].runners[ runnerIndex].splits = {};
    results.courses[ 0].runners[ runnerIndex].splits.raw = [];
    for ( j = 4; j < message[ i].length - 1; j += 2) {  // and only every 2nd is a split
      results.courses[ 0].runners[ runnerIndex].splits.raw.push( fixTime( message[ i][ j])[ 0]);
    }
    runnerIndex += 1;
  }

  return results;
}

function processWMOCMessage ( message, ageClass, eventTitle) {
  var
    i,
    j,
    runnerIndex,
    results = {};

  results.description = eventTitle;
  results.courses = [];
  results.courses[ 0] = {};
  results.courses[ 0].name = 'Course: - Not Stated';
  results.courses[ 0].ageclasses = [];
  results.courses[ 0].ageclasses[ 0] = ageClass;

  results.courses[ 0].controlcodes = [];
  var code = 1;
  for ( j = 7; j < message[ 1].length - 1; j += 1) { // wmoc doesn't give codes so just the numbers
    //results.courses[ 0].controlcodes[ j - 7] = message[ 1][ j];
    results.courses[ 0].controlcodes[ j - 7] = code++;
  }
  results.courses[ 0].controlcodes[ message[ 1].length - 7] = 'F';

  results.courses[ 0].runners = [];
  runnerIndex = 0;
  for ( i = 2; i < message.length; i += 2) {  // process every two line pair
    if ( fixTime( message[ i][ 5])[ 1] < 1 ||
         isNaN( fixTime( message[ i][ 5])[ 1])) { // ignore dnf's etc
      continue;
    }
    results.courses[ 0].runners[ runnerIndex] = {};
    results.courses[ 0].runners[ runnerIndex].name = stripWhitespace( message[ i][ 2]);
    results.courses[ 0].runners[ runnerIndex].ageclass = ageClass;
    results.courses[ 0].runners[ runnerIndex].time = timeFormat( message[ i][ 5]);
    results.courses[ 0].runners[ runnerIndex].splits = {};
    results.courses[ 0].runners[ runnerIndex].splits.raw = [];
    for ( j = 7; j < message[ i].length; j += 1) {  // the second line has the splits
      results.courses[ 0].runners[ runnerIndex].splits.raw.push( fixTime( message[ i + 1][ j])[ 0]);
    }
    //console.log( results.courses[0].runners[runnerIndex].name + ", " +
    //             results.courses[0].runners[runnerIndex].time + " --> " +
    //             results.courses[ 0].runners[ runnerIndex].splits.raw);
    runnerIndex += 1;
  }

  return results;
}

function setupNewWindow( oEvent) {
  var
    scriptSource = 'http://members.iinet.net.au/~arthurwatson@netspace.net.au/visualiser/',
    //scriptSource = 'http://localhost/~watsar/tampermonkey/',
    splitsElements,
    splitsVisualiser,
    scriptElement,
    i,
    j;

    splitsElements = [
       { 'element':'script', 'attributes': [[ 'src', scriptSource + 'draw_splits.js'],
                                            [ 'type', 'text/javascript']]
       },
       { 'element':'script', 'attributes': [[ 'src', 'http://d3js.org/d3.v3.min.js'],
                                            [ 'charset', 'utf-8']]
       },
       { 'element':'link',   'attributes': [[ 'href', scriptSource + 'draw_splits.css'],
                                            [ 'type', 'text/css'],
                                            [ 'rel', 'stylesheet']]
       }];


    splitsVisualiser = window.open( '', 'Splits Visualiser', 'left=100,top=100,width=1200,height=800,menubar=no,titlebar=no,location=no,scrollbars=yes', 'POS');
    splitsVisualiser.document.head.innerHTML = htmlHead;

    for ( i = 0; i < splitsElements.length; i += 1) {
      scriptElement = splitsVisualiser.document.createElement( splitsElements[ i].element);
      for ( j = 0; j < splitsElements[ i].attributes.length; j += 1) {
        scriptElement.setAttribute( splitsElements[ i].attributes[ j][ 0], splitsElements[ i].attributes[ j][ 1] );
        splitsVisualiser.document.head.appendChild( scriptElement);
      }
    }

    splitsVisualiser.document.body.innerHTML = htmlBody;
    //splitsVisualiser.document.body.setAttribute( 'onload', "drawSplits();");
    splitsVisualiser.document.title = 'Orienteering Event - Splits Visualiser --> ' + oEvent.description;
    splitsVisualiser.document.getElementById( 'eventdata').setAttribute( 'value', JSON.stringify( oEvent));

  return 0;
}

function validateMessage( message) {
  var headerLine;

  headerLine = message[ 0].join( ',');
  headerLine = headerLine.replace( /\s/g, '');

  //console.log( 'header: ' + headerLine);

  if (    headerLine.match( /^Pos,Name,Finishtime,Diff,legtot/) &&
          headerLine.match( /legtot,Name$/)) { return true;}

  return false;
}

// The following are for extracting from OACT web pages

// check that this is a splits result from Stephan Kramer SportSoftware
function getResultHeaders( headerRow) {
  var i = 0,
      count = 0,
      headers = {},
      t = '',
      cells = headerRow.querySelectorAll( 'th');

  for ( i = 0; i < cells.length; i += 1) {
    t = cells[ i].textContent;
    if ( t.length > 0) {
      headers[ t] = i;
      count += 1;
    }
    else {
      break;
    }
  }
  headers.length = count;
  return headers;
}

function getEventData() {
// preliminary scan through the results page to get:
//    1. the name and date of the event
//    2. the names of the course
//    3. how many controls in each
//    4. how many runners in each
  var event = {},
      eventDescription,
      courseNameCells,
      courseLengthCells,
      courseNumberOfControlCells,
      courseName,
      courseLength,
      courseNumberOfControls,
      courseNumberOfRunners,
      courseNamePattern = /\s+\(\d+\)$/,  // to get the number of runners in the parenthised bit at the end
      runners,
      i;

  eventDescription = document.querySelector( 'div#reporttop table tr td nobr').textContent;
  event.description = eventDescription ;

  courseNameCells            = document.querySelectorAll( 'td#c00');
  courseLengthCells          = document.querySelectorAll( 'td#c01');
  courseNumberOfControlCells = document.querySelectorAll( 'td#c02');

  event.courses = [];

  for ( i = 0; i < courseNameCells.length; i += 1) {
    event.courses[ i] = {};
    // course name field is <course_name> <(no_of_runners)>
    courseName = courseNameCells[ i].textContent;
    runners = courseNamePattern.exec( courseName);
    courseName = courseName.replace( runners[ 0], '');
    courseName = courseName.replace( /\s+/, '_');
    runners = /\d+/.exec( runners[ 0]);
    courseNumberOfRunners = runners[ 0];

    event.courses[ i].name = courseName;
    event.courses[ i].numberofrunners = courseNumberOfRunners;
    event.courses[ i].ageclasses = [];

    // take the Km off the end of the length
    courseLength = courseLengthCells[ i].textContent;
    courseLength = courseLength.replace( /\s+km/i, '');

    event.courses[ i].length = courseLength;

    // and take off the 'C' and the end of this field
    courseNumberOfControls= courseNumberOfControlCells[ i].textContent;
    courseNumberOfControls = courseNumberOfControls.replace( /\s+c/i, '');

    event.courses[ i].controls = courseNumberOfControls;
  }

  return event;
}

function getRunnerData( runnersRowIndex, rowCells, resultHeaders, runnersData) {
  //  grab name, ageclass and time from the first runner row
  //  the club from the second
  // the indices are in the result headers in the event object
  if ( runnersRowIndex === 0) {
    // get name, ageclass and time
    runnersData.Pl       = rowCells[ resultHeaders.Pl].textContent;
    runnersData.name     = rowCells[ resultHeaders.Name].textContent;
    runnersData.ageclass = rowCells[ resultHeaders[ 'Cl.']].textContent;
    runnersData.time     = rowCells[ resultHeaders.Time].textContent;
  }
  else if ( runnersRowIndex === 1) {
    if ( typeof runnersData === "undefined"){
      runnersData = {};
      runnersData.time = 'undef';
    }
    else {
      // get the club, in the same position as name in row 0
      runnersData.club = rowCells[ resultHeaders.Name].textContent;  // club is in same position as name in the previous row
    }
  }
  return runnersData;
}

function getRunnerSplits( rowCells, resultHeadersLength, runnersSplits) {
  // get the splits from odd numbered rows
  var i;

  for ( i = resultHeadersLength; i < rowCells.length; i += 1) {
    if ( rowCells[ i].textContent.length > 0) {
      runnersSplits.push( rowCells[ i].textContent);
    }
    else {
      break;
    }
  }

  return runnersSplits;
}

function extractResults( event, rows, courseIndex, columnLength) {
  // the first row tuple has the control numbers
  // then we have tuples of double the length for the results which have
  // split and cumulative times on alternating rows
  // also there are short rows which we will ignore
  // also stop scanning when we get to non-finishers, ie the time is not in the correct format
  var cellLength,
      controlsPerRow,
      rowsForControls,
      rowsForRunner,
      rowCells,
      controlCodes,
      thisCode,
      controlCodePattern,
      runnersSplits,
      runnersData,
      splitsIndex,
      runnersIndex,
      runnersRowIndex,
      resultHeaders,
      rowContent,
      i,
      j;

  // check that the column length and number of cells tally
  cellLength = rows[ 0].querySelectorAll( 'td').length;
  if ( columnLength === cellLength) {
    event.checkCellLength[ courseIndex] = true;
  }
  else {
    event.checkCellLength[ courseIndex] = false;
    return event;
  }

  controlsPerRow = columnLength - event.courses[ courseIndex].resultHeaders.length;
  rowsForControls = Math.ceil(( parseInt( event.courses[ courseIndex].controls, 10) + 1) / controlsPerRow);  // need an extra cell for last control to finish
  rowsForRunner = rowsForControls * 2;
  //alert( 'course ' + event.courses[ courseIndex].name + ': columns ==> ' + columnLength + ', rowsForControls ==> ' + rowsForControls + ', rowsForRunners ==> ' + rowsForRunner);

  controlCodes = [];
  controlCodePattern = /\(\d+/;

  for ( i = 0; i < rowsForControls; i += 1) {
    rowCells = rows[ i].querySelectorAll( 'td');
    for ( j = event.courses[ courseIndex].resultHeaders.length; j < rowCells.length; j += 1) {
      thisCode = rowCells[ j].textContent;
      if ( controlCodePattern.test( thisCode)) {
        thisCode = controlCodePattern.exec( thisCode);
        thisCode = thisCode[ 0].replace( '(', '');
      }
      controlCodes.push( thisCode);
      if( /F/.test( thisCode)) { break;}  // no more controls after the finish
    }
    if( /F/.test( thisCode)) { break;} // and break from the outer loop
  }
  event.courses[ courseIndex].controlcodes = controlCodes;

  // now get the runners' results
  splitsIndex = 0;
  runnersIndex = 0;
  runnersRowIndex = 0;
  resultHeaders = event.courses[ courseIndex].resultHeaders;
  event.courses[ courseIndex].runners = [];

  for ( i = rowsForControls; i < rows.length; i += 1) {
    rowCells = rows[ i].querySelectorAll( 'td');
    if( rowCells.length < columnLength) { continue;}  // there are short rows used as spacers that can be ignored

    // also some rows  that indicate controls visited that weren't on the course
    // these have an attribute of style="font-style: italic;"
    rowContent = '';
    for ( j = resultHeaders.length; j < columnLength; j += 1) {
      if ( rowCells[ j].getAttribute( 'style') === 'font-style: italic;') {  // set the content to empty string
        rowCells[ j].textContent = '';
      }
      if ( /\-+/.test( rowCells[ j].textContent)) { // make unknowns ( '-----' ) zero time
        rowCells[ j].textContent = '0:00';
      }
      if ( !/\d+:\d+/.test( rowCells[ j].textContent)) { // set non-times to empty string
        rowCells[ j].textContent = '';
      }
      rowContent += rowCells[ j].textContent;
    }

    if ( rowContent.length < 1) {
      continue;
    }

    if( /\d+/.test( rowCells[ 0].textContent)) { // this should be the runners place
      // start a new runner
      runnersRowIndex = 0;
      runnersData = {};
      runnersSplits = [];
      runnersData = getRunnerData( runnersRowIndex, rowCells, resultHeaders, runnersData);
    }

    if ( runnersRowIndex === 1) {
      runnersData = getRunnerData( runnersRowIndex, rowCells, resultHeaders, runnersData);
      // do this to prevent funnies for undefined splits and messy data
      if ( !( /\d{1,4}:\d{1,}/.test( runnersData.time))) { // if not a valid time mm:ss then skip this runner
        runnersRowIndex = rowsForRunner + 1; // this will force a skip below
        runnersData = {};     // and the data and splits
        runnersSplits = [];
      }
    }


    if( runnersRowIndex % 2 !== 0) {
      // for odd rows just get the splits
      runnersSplits = getRunnerSplits( rowCells, resultHeaders.length, runnersSplits);
    }

    // increment the runner row index
    runnersRowIndex += 1;

    if ( runnersRowIndex === rowsForRunner) {
      if ( runnersSplits.length === ( parseInt( event.courses[ courseIndex].controls, 10) + 1)) {
        runnersData.splits = {};
        runnersData.splits.raw = runnersSplits;  // add the splits to the runner

        // add the ageclass to the course if not there already
        if ( event.courses[ courseIndex].ageclasses.indexOf( runnersData.ageclass) < 0) {
          // add the ageclass to the course
          event.courses[ courseIndex].ageclasses.push( runnersData.ageclass);
        }
        event.courses[ courseIndex].runners.push( runnersData); // add the runner to the course
      }
      runnersRowIndex = 0;  // reset the runner row index
      runnersData = {};     // and the data and splits
      runnersSplits = [];
    }
    else if ( runnersRowIndex > rowsForRunner) {
      continue;
    }
  }

  return event;
}

function getResults( event) {
  // now go through the page and grab the runner sin each course by ageclass
  //   so we get:
  //    ageClass[ i] = [ runner[ 0], runner[ 1], ... runner[ max]],
  //     runner[ i]   = { name: 'name', 'time', splits: []}
  //       splits       = [ split[ 0], split[ 1], ... split[ F]]

  // how the page is organised:
  //  there are groups of three tables for each course:
  //    1. table with one row of course info, we've already got this but it is useful as a place marker.
  //    2. a table with one row of headers for the results, this will tell us how many headers there
  //       are since sometimes some fields are optional. Note that these are 'th' not 'td'.
  //    3. a table with the results, the first rows in this are the control numbers so the number of controls
  //       in this course is useful since we can work out how many rows we need for the headers plus the controls.
  //       we can get the width of the table from the number of cells but there is also a 'col' group that is
  //       convenient.
  //      Some of the rows here are short and must just be spacers so we need to drop them so that we can
  //      run through the runner data without hiccuping.
  //      Some results of team members don't have split times just '---' so we can ignore them too.
  //      Once we reach runners with a time not in a [hh:]mm:ss format we can stop since we can't compare
  //      non finishers.
  // method:
  //  get all relevant tables by querySelector( table[width]:not([width=""]"), the first is the reporttop which
  //  we've already looked at. so start at the second. There shoudl be three per course.
  //  check that this is a course description by it having a 'td#c00'. if not abort and report an error.
  //  do a couple of nextSibling to get the results headers table.
  //  work out how many headers there are.
  //  do a nextSibling to get the results.
  //  count the columns, either by the count of querySelectorAll( 'col') and / or count the 'td's in a row.
  //  do both and check that we get the same answer, abort if we don't with an error message.
  var tables,
       rows,
       //cells,
       courseIndex,
       //resultHeaders,
       columnLength,
       i;

  tables = document.querySelectorAll( 'table[width]:not([width=""])');

  // check that there are three times number of courses plus one
  if (( event.courses.length * 3 + 1) === tables.length) {
    event.checkCourseNumber = true;
  }
  else {
    //console.log( 'There are ' + tables.length + ' tables, and ' + event.courses.length + ' courses, there should be ' + ( event.courses.length * 3 + 1) + ' tables!.');
    event.checkCourseNumber = false;
    return event;
  }

  // preset the courseIndex
  courseIndex = -1;

  // initialise some event properties
  event.checkCellLength = [];

  // run through the tables
  for ( i = 1; i < tables.length; i += 1) {
    // check which table we are processing
    rows = tables[ i].querySelectorAll( 'tr');
    if ( rows[ 0].querySelector( 'td#c00') !== null) {
      // this is the course info header, set the index and skip
      courseIndex += 1;
    }
    else if ( rows[ 0].querySelector( 'th') !== null &&
              rows[ 0].querySelector( 'th').textContent === 'Pl') {
      // this is the results header, so count the header cells and
      // evaluate their indices
      event.courses[ courseIndex].resultHeaders = getResultHeaders( rows[ 0]);
      //alert( 'result headers for course ' + event.courses[ courseIndex].name + ': ' + JSON.stringify( event.resultHeaders[ courseIndex]));
    }
    else if ( rows[ 0].querySelector( 'td#c11') !== null) {
      // now we have the results table
      columnLength = tables[ i].querySelectorAll( 'col').length;
      event = extractResults( event, rows, courseIndex, columnLength);
    }
  }
  return event;
}

function getEventData() {
// preliminary scan through the results page to get:
//    1. the name and date of the event
//    2. the names of the course
//    3. how many controls in each
//    4. how many runners in each
  var event,
      //headerTable,
      eventDescription,
      courseNameCells,
      courseLengthCells,
      courseNumberOfControlCells,
      courseName,
      courseLength,
      courseNumberOfControls,
      courseNumberOfRunners,
      courseNamePattern = /\s+\(\d+\)$/,  // to get the number of runners in the parenthised bit at the end
      runners,
      i;

  event = {};

  // note the source of this data
  if ( document.URL.indexOf( 'act.orienteering') !== -1) {
    event.source = 'Orienteering ACT';
  }
  else if ( document.URL.indexOf( 'websplits') !== -1) {
    event.source = 'WebSplits';
  }
  else {
    event.source = 'unknown';
  }

  eventDescription = document.querySelector( 'div#reporttop table tr td nobr').textContent;
  event.description = eventDescription ;

  courseNameCells            = document.querySelectorAll( 'td#c00');
  courseLengthCells          = document.querySelectorAll( 'td#c01');
  courseNumberOfControlCells = document.querySelectorAll( 'td#c02');

  event.courses = [];

  for ( i = 0; i < courseNameCells.length; i += 1) {
    event.courses[ i] = {};
    // course name field is <course_name> <(no_of_runners)>
    courseName = courseNameCells[ i].textContent;
    runners = courseNamePattern.exec( courseName);
    courseName = courseName.replace( runners[ 0], '');
    courseName = courseName.replace( /\s+/, '_');
    runners = /\d+/.exec( runners[ 0]);
    courseNumberOfRunners = runners[ 0];

    event.courses[ i].name = courseName;
    event.courses[ i].numberofrunners = courseNumberOfRunners;
    event.courses[ i].ageclasses = [];

    // take the Km off the end of the length
    courseLength = courseLengthCells[ i].textContent;
    courseLength = courseLength.replace( /\s+km/i, '');

    event.courses[ i].length = courseLength;

    // and take off the 'C' and the end of this field
    courseNumberOfControls= courseNumberOfControlCells[ i].textContent;
    courseNumberOfControls = courseNumberOfControls.replace( /\s+c/i, '');

    event.courses[ i].controls = courseNumberOfControls;
  }
  return event;
}

function getOACTResults( results) {

  results = getEventData();
  results = getResults( results);

  return results;
}

function getNewOACTCourse( ageclass, controls, allResults){
  /* see if this is the same as any other course */
  /* if not then give it a new one               */
  /* return the index of the course in allResults*/

  var thisSeq = controls.join( ''),
      otherSeq = '',
      thisCourse = '',
      nextCourse = 'course' + pad(( allResults.courses.length + 1).toString(), 2);

  for( let i = 0; i < allResults.courses.length; i++){
    otherSeq = allResults.courses[ i].controlcodes.join( '');
    if( thisSeq === otherSeq){
      allResults.courses[ i].ageclasses.push( ageclass);
      return [ i, allResults];
    }
  }

  if( thisCourse === ''){
    /* add a new course to results */
    let newCourse = {};
    newCourse.name = nextCourse;
    newCourse.ageclasses = [ ageclass];
    newCourse.controlcodes = controls;

    allResults.courses.push( newCourse);
  }

  return [ allResults.courses.length - 1, allResults];
}

function getNewOACTResults( allResults){
  /* get split results from new OACT web pages */

  var ageClasses = [];

  let eventTitle  = document.getElementsByTagName( 'h1')[0].textContent;
  let classHeaders = document.getElementsByTagName( 'h3');
  let splitsTables = document.getElementsByClassName( 'evt-results');

  /* set event title */
  allResults.description = eventTitle;

  /* initialise other results structures */
  allResults.courses = [];
  /* data structure
   allResults = {  description: '',
                   courses = [
                               {  name: string,
                                  controlcodes:[],
                                  ageclasses: [],
                                  runners:[
                                            {  name,
                                               club,
                                               time,
                                               splits:{ raw:[]}
                                             }
                                          ]
                               }
                            ]
                };
  */

  /* get the list of age classes from the h3 elements */
  for ( let i = 0; i < classHeaders.length; i++) {
    ageClasses[ i] = classHeaders[ i].textContent;
  }

  /* check whether we have the same number of age classes and result tables */
  if( ageClasses.length !== splitsTables.length) {
    alert( 'class and results length mismatch! ' + ageClasses.length + ' ' + results.length);
    return 0; /* exit here, no point in going further */
  }

  /* now work our way through the results which are shown by age class  */
  /* but we can get them into course by comparing control sequences     */
  for ( let i = 0; i < splitsTables.length; i ++) {

    /* set the age class since the two collections are in sync */
    thisAgeClass = ageClasses[ i];

    /* get the control sequence */
    let th = splitsTables[ i].getElementsByTagName( 'tr')[0].getElementsByTagName( 'th');
    let controls = [];
    for ( let j = 1; j < th.length; j++) {
       items = th[j].innerHTML.split( '<br>');
       if( items.length > 1){
         controls[ j - 1] = items[ 1];
       }
       else {
         controls[ j -1] = items[ 0];
      }
    }

    /* either add ageclass to an exisitng course or set up  a new course */
    var returnValues = getNewOACTCourse( thisAgeClass, controls, allResults);
    var courseIndex = returnValues[ 0];   // which course to add runners to
    allResults = returnValues[ 1];        // preserve changes made in the function

    /* now get the runners */
    if( allResults.courses[ courseIndex].runners === undefined){
      allResults.courses[ courseIndex].runners = [];
    }

    let runnerRows = splitsTables[ i].getElementsByClassName( 'classResult OK');

    for( let j = 0; j < runnerRows.length; j++){
      /* set up the runner */
      let thisRowInfo = runnerRows[ j].getElementsByTagName( 'th');
      let runner = {};
      runner.name = thisRowInfo[ 0].textContent;
      runner.club = thisRowInfo[ 1].textContent;
      runner.time = thisRowInfo[ 2].textContent;
      runner.ageclass = thisAgeClass;

      /* add the split times */
      runner.splits = {};
      let thisRowTimes = runnerRows[ j].getElementsByTagName( 'td');
      thisSplits = [];
      for( let k = 0; k < thisRowTimes.length; k++){
        let elementContents = thisRowTimes[ k].getElementsByClassName( 's')[0].textContent;
        sTime = elementContents.split( ' ')[ 0];
        thisSplits.push( sTime);
      }
      runner.splits.raw = thisSplits;

      allResults.courses[ courseIndex].runners.push( runner);
    }
  }
  //console.log( allResults);
  return allResults;
}

function getWMOCresults( results) {

  var message = [];
  var courseData = window.document.querySelectorAll( 'div.classinfo');
  var ageClass = stripWhitespace( courseData[ 0].querySelector( 'span.classheader').textContent);
  var eventTitle = courseData[ 0].textContent;
  var re = new RegExp( ageClass);
  eventTitle = stripWhitespace( eventTitle.replace( re, ''));

  // extract the splits data from the web page
  trs = window.document.querySelectorAll( 'tr');

  for ( let i = 0; i < trs.length; i += 1) {
    tds = trs[ i].querySelectorAll( 'td');
    messageRow = [];
    for ( j = 0; j < tds.length; j += 1) {
      messageRow.push( stripWhitespace( tds[ j].textContent));
    }
    message.push( messageRow);
  }

  results = processWMOCMessage( message, ageClass, eventTitle);

  return results;
}

// this is where we start
//var window = {};
window.onload = function() {
  var
    i,
    j,
    results = {},
    message = [],
    messageRow = [],
    courseData = [],
    eventTitle,
    ageClass,
    tds,
    trs,
    source = 'unknown',
    splitsButton,
    splitsButtonPlace,
    splitsStyleText = function() {/*
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
  color: #ffffff;
  padding: 10px 20px;
  background: -moz-linear-gradient(
    top,
    #42aaff 0%,
    #003366);
  background: -webkit-gradient(
    linear, left top, left bottom,
    from(#42aaff),
    to(#003366));
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
  border-radius: 10px;
  border: 1px solid #003366;
  -moz-box-shadow:
    0px 1px 3px rgba(000,000,000,0.5),
    inset 0px 0px 1px rgba(255,255,255,0.5);
  -webkit-box-shadow:
    0px 1px 3px rgba(000,000,000,0.5),
    inset 0px 0px 1px rgba(255,255,255,0.5);
  box-shadow:
    0px 1px 3px rgba(000,000,000,0.5),
    inset 0px 0px 1px rgba(255,255,255,0.5);
  text-shadow:
    0px -1px 0px rgba(000,000,000,0.7),
    0px 1px 0px rgba(255,255,255,0.3);
  margin-bottom: 10px;
*/}.toString().slice( 15, -3);

  // determine where we are getting this data from
  // get source

  if ( document.URL.indexOf( 'winsplits') > 0) {
    source = 'Winsplits';
    // get the event and course / age class data
    courseData = window.frames[ 1].document.querySelectorAll( 'table.border table a.menubar');
    eventTitle = courseData[ 0].textContent;
    ageClass = courseData[ 1].textContent;

    // extract the splits data from the web page
    // these are in frame name 'main'
    trs = window.frames[ 2].document.querySelectorAll( 'tr');
    for ( i = 0; i < trs.length; i += 1) {
      tds = trs[ i].querySelectorAll( 'td');
      messageRow = [];
      for ( j = 0; j < tds.length; j += 1) {
        messageRow.push( tds[ j].textContent);
      }
      message.push( messageRow);
    }
    if ( validateMessage( message)) {
      results = processMessage( message, ageClass, eventTitle);
    }
    else {
      window.alert( 'Unusual Winsplit options selected. Only tick "position, finish times and extended information" at the foot of the page');
      return 0;
    }
    results.source = source;
    splitsButtonPlace = window.frames[ 2].document; // make the button
  }
  //else if ( document.URL.indexOf( 'act.orienteering.asn.au/gfolder/results') > 0) {
  //  results.source = 'Old Orienteering ACT';
  //  if ( document.querySelector( 'body div#reporttop tr:nth-child( 2) td nobr').textContent !== 'Split time results') {
  //    return 0;
  //  }
  //  results = getOACTResults( results);
  //  splitsButtonPlace = document; // make the button
  //}
  else if ( document.URL.indexOf( 'act.orienteering.asn.au/eventor/results/splits') > 0) {
    results.source = 'Orienteering ACT';
    results = getNewOACTResults( results);
    splitsButtonPlace = document; // make the button
  }
  else if ( document.URL.indexOf( 'wmoc') > 0) {
    results.source = 'WMOC';
    results = getWMOCresults( results);
    splitsButtonPlace = document; // make the button
  }
  else {
    window.alert( 'Fell: ' + document.URL);
    return 0;
  }

  // do the popup
  splitsButton = splitsButtonPlace.createElement( 'button');
  splitsButton.setAttribute( 'class', 'splits');
  splitsButton.setAttribute( 'style', splitsStyleText);
  splitsButton.id = 'splitsButton';
  splitsButton.textContent = 'Show Visualisation!';
  splitsButton.onclick = function(){ setupNewWindow( results);};
  splitsButtonPlace.body.insertBefore( splitsButton, splitsButtonPlace.body.firstChild);
};
