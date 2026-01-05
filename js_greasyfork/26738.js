// ==UserScript==
// @name     FB: Full Timestamps 2018
// @match    https://www.facebook.com/*
// @match    https://*.facebook.com/*
// @match    http://www.facebook.com/*
// @match    http://*.facebook.com/*
// @run-at   document-start
// @grant    GM_addStyle
// @author   wOxxOm & JZersche
// @require  https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @ require  http://momentjs.com/downloads/moment.min.js
// @ require https://momentjs.com/downloads/moment-with-locales.min.js
// @version 3.00DEV
// @namespace https://greasyfork.org/users/95175
// @description Shows full timestamps on Facebook posts
// @downloadURL https://update.greasyfork.org/scripts/26738/FB%3A%20Full%20Timestamps%202018.user.js
// @updateURL https://update.greasyfork.org/scripts/26738/FB%3A%20Full%20Timestamps%202018.meta.js
// ==/UserScript==

var options = { weekday: 'long', year: 'numeric', month: 'numeric', day: '2-digit' };

GM_addStyle(
    '.full-timestamp { opacity: 0.95; color: #f00!important; }' +
    '.full-timestamp:hover { opacity: 1.0; }' +
    '.full-timestamp:before { content: ""; }' +
    '.full-timestamp:after  { content: ""; }' +
    '.timestampContent {display: none; }' +
    '.savePostButton {position:relative!important; top:1px;left:50px; color:red !important;}'
);

// process the already loaded portion of the page if any
expandDates(document.querySelectorAll('abbr[data-utime]'));

// process the stuff added from now on
setMutationHandler(document, 'abbr[data-utime]', expandDates);
setMutationHandler(document, '._5pcq', expandPostIDs);
setMutationHandler(document, '.r_1zif-zub1', savePostButton);
setMutationHandler(document, '.r_1zif-zub1', ButtonEvents);

function expandDates(nodes) {
    for ( var i = 0, abbr; (abbr = nodes[i++]); ) {
        if (abbr.querySelector('.full-timestamp'))
            {
            // already processed
            continue;
            }

        abbr.insertAdjacentHTML(
        'beforeend', '<span class="full-timestamp">'
        + ' on ' + moment(new Date(abbr.dataset.utime * 1000)).format('M/DD/Y \\at LTS'));
    }
}

function expandPostIDs(nodes) {
    for ( var i = 0; i < nodes.length; i++ )
    {
        var element = nodes[i];
        if(element.innerHTML.includes('<br>') === false && element.className === '_5pcq')
          {
          element.insertAdjacentHTML('beforeend', '<br>' +
          element.href.replace(/(&|\?)__xts__%5B0%5D=68.{0,240}/,'')
                      .replace('permalink.php?','&nbsp;permalink.php?').replace('/groups/','Group: ')
                      .replace('/permalink/','<br>Post ID: ').slice(24,100)
                      .replace('/',''));
          }
     }
}


var Quote = '"';
var sFunction = document.getElementsByClassName("brb")[0].style.backgroundColor = "red";



function savePostButton(nodes) {
  for ( var i = 0; i < nodes.length; i++ )
  {
    var element = nodes[i]; element.getElementsByClassName("r_1zif-zub1");

    if(element.className == 'r_1zif-zub1')
          {
          element.insertAdjacentHTML(
'beforeend',
'<input class="savePostButton" type="button"><br><span style="color:#09f!important;">Save Post</span></input>');
          }
   }
}

function ButtonEvents(nodes) {
// Start of Function
  for (var i = 0; i < nodes.length; i++)
         {
          var element = nodes[i];
            var getNodes = element.getElementsByClassName("savePostButton");
               if (getNodes) {element.addEventListener("click", ClickButton, false);}
                 }
// End Of Function
}

// Button Action
function ClickButton(nodes) {
  alert("clicked");
}
// End of Button Action Function







/*
var getMainNode = element.getElementsByClassName("_6a _43_1 _4f-9 _nws _21o- _fol");
getMainNode[0];
var createSpan = document.createElement("span");
createSpan[0];
var newButton = document.createElement("button");
newButton[0];
*/
