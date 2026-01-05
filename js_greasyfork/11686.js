// ==UserScript==
// @name        Workflow Job View
// @namespace   http://www.geosolve.co.nz
// @description Adds a link to projtrack (an internal project tracking software) to the workflow max interface.
// @include     https://my.workflowmax.com/job/jobview.aspx?id=*
// @version     1.01
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/11686/Workflow%20Job%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/11686/Workflow%20Job%20View.meta.js
// ==/UserScript==
console.log('Loading Grease');
Greasemonkey_main();

function sendMail() {
  try {
    $.ajax({
      type: 'POST',
      url: 'https://mandrillapp.com/api/1.0/messages/send.json',
      data: {
        'key': 'DtfG8jcydGP55YvGGxZevw',
        'message': {
          'from_email': 'william.colin.gibson@gmail.com',
          'to': [
              {
                'email': 'maildaemon@geosolve.co.nz',
                'name': 'Will',
                'type': 'to'
              }
            ],
          'autotext': 'true',
          'subject': 'YOUR SUBJECT HERE!',
          'html': 'YOUR EMAIL CONTENT HERE! YOU CAN USE HTML!'
        }
      }
     }).done(function(response) {
       console.log(response); // if you're into that sorta thing
     });
  } catch (fail) {
    console.log(fail);
  }
};

function Greasemonkey_main() {
  sendMail();
  console.log('TEST2');
  var bDebug = true;
  var bTabInfo = false;
  var isTab;
  if (isTab = getQueryVariable('tab')) {
    if (isTab == 'info') {
      bTabInfo = true;
    }
  } else {
    bTabInfo = true;
  };
  if (bTabInfo == true) {
    try {
      var oPage = document.getElementById('ctl00_PageContent_layout');
      var sJobNo = oPage.children[1].children[0].children[0].children[1].children[0].innerHTML;
      console.log(sJobNo);
      var oTable = oPage.children[2];
      var oTrow = oTable.children[0];
      var i;
      var oRows;
      var sWorking;
      console.log(oTrow.children.length);
      for (i = 0; i < oTrow.children.length; i++) {
        oRows = oTrow.children[i];
        if (bDebug == true) {
          console.log(oRows.children[0].innerHTML);
          console.log(oRows.children[1].innerHTML);
        }

        if (oRows.children[0].innerHTML == 'Link to Projtrack:') {
          oRows.children[1].innerHTML = '<a href="http://dunprojtrack.geosolve.local/job.php?job=' + sJobNo + '" target="_blank">' + sJobNo + ' on Projtrack</a>';
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  }
  $.ajax({url: "http://dunprojtrack.geosolve.local/job.php?job=130199&callback=", success: function(result){$("#ext-gen3").html(result);}});
};

function getQueryVariable(variable)
{
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return ('');
};