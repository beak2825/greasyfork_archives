// ==UserScript==
// @name                TIMSLink2000
// @namespace           http://greasemonkey.chizzum.com
// @description         Provides link to full TIMS details when viewing a disruption on the TfL Traffic Status Updates site 
// @include             https://tfl.gov.uk/traffic/status/*
// @grant               none
// @version             0.04
// @downloadURL https://update.greasyfork.org/scripts/34350/TIMSLink2000.user.js
// @updateURL https://update.greasyfork.org/scripts/34350/TIMSLink2000.meta.js
// ==/UserScript==

/* JSHint Directives */
/* jshint bitwise: false */
/* jshint evil: true */

var timsVersion = '0.04';
var currentTIMsID = null;

function timsDateSort(a, b)
{
   var retval;
   if(a.startTime > b.startTime)
   {
      retval = 1;
   }
   else if(a.startTime < b.startTime)
   {
      retval = -1;
   }
   else
   {
      retval = 0;
   }
   return retval;
}
function timsWaitPanel()
{
   if
   (
      (document.getElementById('roadmap-panel').className === 'map-panel hidden') ||
      (document.getElementById("roadmap-panel").getElementsByClassName('road-disruption').length === 0)
   )
   {      
      currentTIMsID = null;
      setTimeout(timsWaitPanel,500);
   }
   else
   {
      var timsID = document.getElementById("roadmap-panel").getElementsByClassName('road-disruption')[0].getAttribute("data-disruption-id");
      if(timsID !== currentTIMsID)
      {
         currentTIMsID = timsID;
         var linkURL = 'https://api.tfl.gov.uk/Road/all/Disruption/'+timsID;
         
         var timsReq = new XMLHttpRequest();
         timsReq.onreadystatechange = function ()
         {
            if (timsReq.readyState == 4)
            {
               console.debug('TIMS data request, response '+timsReq.status+' received');
               if (timsReq.status == 200)
               {
                  var tResp = JSON.parse(timsReq.responseText);
                  console.debug('TIMS data received and parsed...');
                  
                  var tStart = new Date(tResp[0].startDateTime);
                  var tEnd = new Date(tResp[0].endDateTime);
                  var nRecurring = tResp[0].recurringSchedules.length;
                  
                  if(nRecurring > 0)
                  {
                     tResp[0].recurringSchedules = tResp[0].recurringSchedules.sort(timsDateSort);
                  }

                  var tHTML = '';
                  if(nRecurring > 0)
                  {
                     tHTML += 'Overall period from ';
                  }
                  else
                  {
                     tHTML += 'Restriction from ';
                  }
                  tHTML += tStart.toUTCString() + ' to ' + tEnd.toUTCString();
                  if(nRecurring > 0)
                  {
                     tHTML += '<br>Recurring restrictions schedule:';
                     tHTML += '<div style="overflow: scroll; height: 200px;"><ul>';
                     for(var i=0; i<nRecurring; i++)
                     {
                        tStart = new Date(tResp[0].recurringSchedules[i].startTime);
                        tEnd = new Date(tResp[0].recurringSchedules[i].endTime);
                        tHTML += '<li>' + tStart.toUTCString() + ' - ' + tEnd.toUTCString();
                     }
                     tHTML += '</ul></div>';
                  }
                  document.getElementById("roadmap-panel").getElementsByClassName('highlight dates')[0].innerHTML = tHTML;                  
                  
               }
            }
         };
         timsReq.open('GET',linkURL,true);
         timsReq.send();
         console.debug('GET: '+linkURL);
      }
      setTimeout(timsWaitPanel,100);
   }
}

timsWaitPanel();