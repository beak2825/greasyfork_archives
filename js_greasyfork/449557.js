// ==UserScript==
// @name                WME History Enhancer
// @namespace           http://greasemonkey.chizzum.com
// @description         Enhances map object history entries
// @include             https://*.waze.com/*editor*
// @include             https://editor-beta.waze.com/*
// @include             https://beta.waze.com/*
// @exclude             https://www.waze.com/user/*editor/*
// @exclude             https://www.waze.com/*/user/*editor/*
// @grant               none
// @version             1.6
// @downloadURL https://update.greasyfork.org/scripts/449557/WME%20History%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/449557/WME%20History%20Enhancer.meta.js
// ==/UserScript==

/*
=======================================================================================================================
Bug fixes - MUST BE CLEARED BEFORE RELEASE
=======================================================================================================================


=======================================================================================================================
Things to be checked
=======================================================================================================================

*/

/* JSHint Directives */
/* globals W: true */
/* globals I18n: */
/* globals trustedTypes: */
/* jshint bitwise: false */
/* jshint eqnull: true */
/* jshint esversion: 11 */
/* jshint undef: true */
/* jshint unused: true */

const Release =
{
   version : "1.6",
   date : "20250504",
   changes : 
   [
      "Compatibility updates",
      "Reformats venue category and service changes to clearly show what they are",
      "Hide closures/rejected updates setting is now persistent"
   ]
};

const AlertBox =
{
   stack: [],
   tickAction: null,
   crossAction: null,
   inUse: false,
   ab: null,
   abID: null,
   fnMH: null,
   
   ABObj: function(headericon, title, content, hasCross, tickText, crossText, tickAction, crossAction)
   {
      this.headericon = headericon;
      this.title = title;
      this.content = content;
      this.hasCross = hasCross;
      this.tickText = tickText;
      this.crossText = crossText;
      this.tickAction = tickAction;
      this.crossAction = crossAction;
   },
   Close: function()
   {
      let abElm = document.getElementById(AlertBox.abID);
      abElm.childNodes[0].innerHTML = AlertBox.fnMH('');
      abElm.childNodes[1].innerHTML = AlertBox.fnMH('');
      abElm.querySelector('#tickBtnCaption').innerHTML = AlertBox.fnMH('');
      abElm.querySelector('#crossBtnCaption').innerHTML = AlertBox.fnMH('');
      AlertBox.tickAction = null;
      AlertBox.crossAction = null;
      abElm.style.visibility = "hidden";
      abElm.querySelector('#crossBtn').style.visibility = "hidden";
      AlertBox.inUse = false;
      if(AlertBox.stack.length > 0)
      {
         AlertBox.BuildFromStack();
      }
   },
   CloseWithTick: function()
   {
      if(typeof AlertBox.tickAction === 'function')
      {
         AlertBox.tickAction();
      }
      AlertBox.Close();
   },
   CloseWithCross: function()
   {
      if(typeof AlertBox.crossAction === 'function')
      {
         AlertBox.crossAction();
      }
      AlertBox.Close();
   },
   Show: function(headericon, title, content, hasCross, tickText, crossText, tickAction, crossAction)
   {
      AlertBox.stack.push(new AlertBox.ABObj(headericon, title, content, hasCross, tickText, crossText, tickAction, crossAction));
      if(AlertBox.inUse === false)
      {
         AlertBox.BuildFromStack();
      }
   },
   BuildFromStack: function()
   {
      AlertBox.inUse = true;
      AlertBox.tickAction = null;
      AlertBox.crossAction = null;
      let titleContent = '<span style="font-size:14px;padding:2px;">';
      titleContent += '<i class="fa '+AlertBox.stack[0].headericon+'"> </i>&nbsp;';
      titleContent += AlertBox.stack[0].title;
      titleContent += '</span>';
      let abElm = document.getElementById(AlertBox.abID);
      abElm.childNodes[0].innerHTML = AlertBox.fnMH(titleContent);
      abElm.childNodes[1].innerHTML = AlertBox.fnMH(AlertBox.stack[0].content);
      abElm.querySelector('#tickBtnCaption').innerHTML = AlertBox.fnMH(AlertBox.stack[0].tickText);
      if(AlertBox.stack[0].hasCross)
      {
         abElm.querySelector('#crossBtnCaption').innerHTML = AlertBox.fnMH(AlertBox.stack[0].crossText);
         abElm.querySelector('#crossBtn').style.visibility = "visible";
         if(typeof AlertBox.stack[0].crossAction === "function")
         {
            AlertBox.crossAction = AlertBox.stack[0].crossAction;
         }
      }
      else
      {
         abElm.querySelector('#crossBtn').style.visibility = "hidden";
      }
      if(typeof AlertBox.stack[0].tickAction === "function")
      {
         AlertBox.tickAction = AlertBox.stack[0].tickAction;
      }
      abElm.style.visibility = "";
      AlertBox.stack.shift();
   },
   Init: function(abID, hdCol, bgCol, fnModHTML)
   {
      AlertBox.abID = abID;
      AlertBox.fnMH = fnModHTML;

      // create a new div to display script alerts
      AlertBox.ab = document.createElement('div');
      AlertBox.ab.id = abID;
      AlertBox.ab.style.position = 'fixed';
      AlertBox.ab.style.visibility = 'hidden';
      AlertBox.ab.style.top = '50%';
      AlertBox.ab.style.left = '50%';
      AlertBox.ab.style.zIndex = 10000;
      AlertBox.ab.style.backgroundColor = bgCol;
      AlertBox.ab.style.borderWidth = '3px';
      AlertBox.ab.style.borderStyle = 'solid';
      AlertBox.ab.style.borderRadius = '10px';
      AlertBox.ab.style.boxShadow = '5px 5px 10px Silver';
      AlertBox.ab.style.padding = '4px';
      AlertBox.ab.style.webkitTransform = "translate(-50%, -50%)";
      AlertBox.ab.style.transform = "translate(-50%, -50%)";
   
      let alertsHTML = '<div id="header" style="padding: 4px; background-color:'+hdCol+'; font-weight: bold;">Alert title goes here...</div>';
      alertsHTML += '<div id="content" style="padding: 4px; background-color:White; overflow:auto;max-height:500px">Alert content goes here...</div>';
      alertsHTML += '<div id="controls" align="center" style="padding: 4px;">';
      alertsHTML += '<span id="tickBtn" style="cursor:pointer;font-size:14px;border:thin outset black;padding:2px 10px 2px 10px;">';
      alertsHTML += '<i class="fa fa-check"> </i>';
      alertsHTML += '<span id="tickBtnCaption" style="font-weight: bold;"></span>';
      alertsHTML += '</span>';
      alertsHTML += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
      alertsHTML += '<span id="crossBtn" style="cursor:pointer;font-size:14px;border:thin outset black;padding:2px 10px 2px 10px;">';
      alertsHTML += '<i class="fa fa-times"> </i>';
      alertsHTML += '<span id="crossBtnCaption" style="font-weight: bold;"></span>';
      alertsHTML += '</span>';
      alertsHTML += '</div>';
      AlertBox.ab.innerHTML = fnModHTML(alertsHTML);
      document.body.appendChild(AlertBox.ab);

      window.setTimeout(AlertBox.Init2, 100);
   },
   Init2: function()
   {
      let abElm = document.getElementById(AlertBox.abID);
      abElm.querySelector('#tickBtn').addEventListener('click', AlertBox.CloseWithTick, true);
      abElm.querySelector('#crossBtn').addEventListener('click', AlertBox.CloseWithCross, true);   
   }
};

const WHE =
{
   showDebugOutput: true,
   enhanceHistoryItemID: null,
   enhanceHistoryItemType: null,
   itemHistoryDetails: null,
   itemHistoryLoaded: false,
   prevWazeBitsPresent: null,
   wazeBitsPresent: 0,
   initAttempts: 10,
   settings: {lastVer: null, hideBits: null},
   listType: {categories: "categories", services: "services"},

   ModifyHTML: function(htmlIn)
   {
      if(typeof trustedTypes === "undefined")
      {
         return htmlIn;
      }
      else
      {
         const escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {createHTML: (to_escape) => to_escape});
         return escapeHTMLPolicy.createHTML(htmlIn);
      }
   },
   AddLog: function(logtext)
   {
      if(WHE.showDebugOutput) console.log('WHE: '+Date()+' '+logtext);
   },
   GetRestrictionLanes: function(disposition)
   {
      let retval = '';
      if(disposition == 1) retval += 'All lanes';
      else if(disposition == 2) retval += 'Left lane';
      else if(disposition == 3) retval += 'Middle lane';
      else if(disposition == 4) retval += 'Right lane';
      else retval += ' - ';
      return retval;
   },
   GetRestrictionLaneType: function(laneType)
   {
      let retval = '';
      if(laneType === null) retval += ' - ';
      else
      {
         if(laneType == 1) retval += 'HOV';
         else if(laneType == 2) retval += 'HOT';
         else if(laneType == 3) retval += 'Express';
         else if(laneType == 4) retval += 'Bus lane';
         else if(laneType == 5) retval += 'Fast lane';
         else retval += ' - ';
      }
      return retval;
   },
   GetDirectionString: function(isForward)
   {
      if(isForward === true)
      {
         return 'A-B';
      }
      else
      {
         return 'B-A';
      }
   },
   GetVehicleDescription: function(vehicleType)
   {
      let retval = null;
      let i18nLookup = null;
      if(vehicleType === 0) i18nLookup = "TRUCK";
      else if(vehicleType === 256) i18nLookup = "PUBLIC_TRANSPORTATION";
      else if(vehicleType === 272) i18nLookup = "TAXI";
      else if(vehicleType === 288) i18nLookup = "BUS";
      else if(vehicleType === 512) i18nLookup = "RV";
      else if(vehicleType === 768) i18nLookup = "TOWING_VEHICLE";
      else if(vehicleType === 1024) i18nLookup = "MOTORCYCLE";
      else if(vehicleType === 1280) i18nLookup = "PRIVATE";
      else if(vehicleType === 1536) i18nLookup = "HAZARDOUS_MATERIALS";
      else if(vehicleType === 1792) i18nLookup = "CAV";
      else if(vehicleType === 1808) i18nLookup = "EV";
      else if(vehicleType === 1824) i18nLookup = "HYBRID";
      else if(vehicleType === 1840) i18nLookup = "CLEAN_FUEL";
      if(i18nLookup !== null)
      {
         retval = I18n.lookup("restrictions.vehicle_types."+i18nLookup);
      }
      return retval;
   },
   FormatTBR: function(tbrObj)
   {
      let retval = '';
      if(tbrObj.description !== null)
      {
         retval += '&nbsp;&nbsp;Reason: ' + tbrObj.description + '<br>';
      }

      if(tbrObj.timeFrames.length > 0)
      {
         retval += '&nbsp;&nbsp;Dates: ';
         if(tbrObj.timeFrames[0].startDate === null)
         {
            retval += 'all dates';
         }
         else
         {
            retval += tbrObj.timeFrames[0].startDate + ' to ' + tbrObj.timeFrames[0].endDate;
         }
         retval += '<br>';

         retval += '&nbsp;&nbsp;Days: ';
         if(tbrObj.timeFrames[0].weekdays & (1<<0)) retval += 'M';
         else retval += '-';
         if(tbrObj.timeFrames[0].weekdays & (1<<1)) retval += 'T';
         else retval += '-';
         if(tbrObj.timeFrames[0].weekdays & (1<<2)) retval += 'W';
         else retval += '-';
         if(tbrObj.timeFrames[0].weekdays & (1<<3)) retval += 'T';
         else retval += '-';
         if(tbrObj.timeFrames[0].weekdays & (1<<4)) retval += 'F';
         else retval += '-';
         if(tbrObj.timeFrames[0].weekdays & (1<<5)) retval += 'S';
         else retval += '-';
         if(tbrObj.timeFrames[0].weekdays & (1<<6)) retval += 'S';
         else retval += '-';
         retval += '<br>';

         retval += '&nbsp;Timespan: ';
         if(tbrObj.timeFrames[0].fromTime === null)
         {
            retval += 'all day';
         }
         else
         {
            retval += tbrObj.timeFrames[0].fromTime + ' to ' + tbrObj.timeFrames[0].toTime;
         }
         retval += '<br>';
      }

      let vtLength = 0;
      if(tbrObj.driveProfiles.BLOCKED !== undefined)
      {
         vtLength = tbrObj.driveProfiles.BLOCKED[0].vehicleTypes.length;
         if(vtLength > 0)
         {
            retval += '&nbsp;Vehicle types prohibited:<br>';
            for(let i=0; i<vtLength; i++)
            {
               retval += '&nbsp;&nbsp;'+WHE.GetVehicleDescription(tbrObj.driveProfiles.BLOCKED[0].vehicleTypes[i])+'<br>';
            }
         }
      }
      else if(tbrObj.driveProfiles.FREE !== undefined)
      {
         vtLength = tbrObj.driveProfiles.FREE[0].vehicleTypes.length;
         if(vtLength > 0)
         {
            retval += '&nbsp;Vehicle types allowed:<br>';
            for(let i=0; i<vtLength; i++)
            {
               retval += '&nbsp;&nbsp;'+WHE.GetVehicleDescription(tbrObj.driveProfiles.FREE[0].vehicleTypes[i])+'<br>';
            }
         }
      }
      else if(tbrObj.defaultType === "BLOCKED")
      {
         retval += '&nbsp;Blocked for all vehicle types<br>';
      }

      if(tbrObj.defaultType === "DIFFICULT")
      {
         retval += '&nbsp;Difficult Turn<br>';
      }
      return retval;
   },
   // IsObject and CompareTBRs modified from original code at
   // https://dmitripavlutin.com/how-to-compare-objects-in-javascript/
   IsObject: function(object) 
   {
      return object != null && typeof object === 'object';
   },
   CompareTBRs: function(tbr1, tbr2)
   {
      let retval = true;
      const keys1 = Object.keys(tbr1);
      const keys2 = Object.keys(tbr2);
      if (keys1.length !== keys2.length) 
      {
         retval = false;
      }
      else
      {
         for (const key of keys1) 
         {
            const val1 = tbr1[key];
            const val2 = tbr2[key];
            const areObjects = WHE.IsObject(val1) && WHE.IsObject(val2);
            if (areObjects && !WHE.CompareTBRs(val1, val2) || !areObjects && val1 !== val2) 
            {
               retval = false;
               break;
            }
         }
      }
      return retval;
   },
   FormatTBRDetails: function(tbrObj)
   {
      let retval = '';

      let hasOld = ((tbrObj.oldValue !== undefined) && (tbrObj.oldValue.restrictions !== undefined) && (tbrObj.oldValue.restrictions.length > 0));
      let hasNew = ((tbrObj.newValue !== undefined) && (tbrObj.newValue.restrictions !== undefined) && (tbrObj.newValue.restrictions.length > 0));

      if((hasOld === true) || (hasNew === true))
      {
         retval += '<i>TBR ';
         if(hasOld === false)
         {
            retval += 'Added:<br>';
            for(let i = 0; i < tbrObj.newValue.restrictions.length; ++i)
            {
               if(i > 0)
               {
                  retval += '<br>';
               }
               retval += WHE.FormatTBR(tbrObj.newValue.restrictions[i]);
            }
         }
         else if (hasNew === false)
         {
            retval += 'Deleted:<br>';
            for(let i = 0; i < tbrObj.oldValue.restrictions.length; ++i)
            {
               if(i > 0)
               {
                  retval += '<br>';
               }
               retval += WHE.FormatTBR(tbrObj.oldValue.restrictions[i]);
            }
         }
         else
         {
            retval += 'Changed:<br>';

            let oldStillPresent = [];
            let newStillPresent = [];
            for(let i = 0; i < tbrObj.oldValue.restrictions.length; ++i)
            {
               for(let j = 0; j < tbrObj.newValue.restrictions.length; ++j)
               {
                  if(WHE.CompareTBRs(tbrObj.oldValue.restrictions[i], tbrObj.newValue.restrictions[j]) == true)
                  {
                     oldStillPresent.push(i);
                     newStillPresent.push(j);
                  }
               }
            }

            let tbrsShown = 0;
            for(let i = 0; i < tbrObj.oldValue.restrictions.length; ++i)
            {
               if(oldStillPresent.indexOf(i) == -1)
               {
                  if(tbrsShown == 0)
                  {
                     retval += 'Removed:<br>';
                  }
                  else
                  {
                     retval += '<br>';
                  }
                  retval += WHE.FormatTBR(tbrObj.oldValue.restrictions[i]);
                  ++tbrsShown;
               }
            }
            if(tbrsShown > 0)
            {
               retval += '<br>';
            }
            tbrsShown = 0;
            for(let i = 0; i < tbrObj.newValue.restrictions.length; ++i)
            {
               if(newStillPresent.indexOf(i) == -1)
               {
                  if(tbrsShown == 0)
                  {
                     retval += 'Added:<br>';
                  }
                  else
                  {
                     retval += '<br>';
                  }
                  retval += WHE.FormatTBR(tbrObj.newValue.restrictions[i]);
                  ++tbrsShown;
               }
            }
         }
         retval += '</i>';
      }
      else
      {
         // not a TBR history entry...
      }

      return retval;
   },
   FormatClosureReason: function(rData)
   {
      let retval = "";
      if(rData == null)
      {
         retval = "<i>not provided</i>";
      }
      else
      {
         retval = rData;
      }
      return retval;
   },
   FormatClosureMTE: function(mData)
   {
      let retval = "";
      if(mData == null)
      {
         retval = "<i>not provided</i>";
      }
      else if(W.model.majorTrafficEvents.objects[mData] === undefined)
      {
         retval = "<i>data not available</i>";
      }
      else
      {
         retval = W.model.majorTrafficEvents.objects[mData].attributes.names[0].value;
      }
      return retval;
   },
   FormatClosureDetails: function(cObjA, cObjB)
   {
      let retval = '';
      if(cObjB === null)
      {
         retval += 'Reason: ' + WHE.FormatClosureReason(cObjA.reason) + '<br>';
         retval += 'MTE: ' + WHE.FormatClosureMTE(cObjA.eventId) + '<br>';
         retval += 'From: ' + cObjA.startDate + '<br>';
         retval += 'To: ' + cObjA.endDate + '<br>';
         retval += 'Direction: ' + WHE.GetDirectionString(cObjA.forward) + '<br>';
         retval += 'Ignore traffic: ' + cObjA.permanent;
      }
      else
      {
         if(cObjA.reason !== cObjB.reason)
         {
            retval += 'Reason: ' + WHE.FormatClosureReason(cObjA.reason);
            retval += ' <i>\>\>\> ' + WHE.FormatClosureReason(cObjB.reason) + '</i><br>';
         }
         if(cObjA.eventId !== cObjB.eventId)
         {
            retval += 'MTE: ' + WHE.FormatClosureMTE(cObjA.eventId);
            retval += ' <i>\>\>\> ' + WHE.FormatClosureMTE(cObjB.eventId) + '</i><br>';
         }
         if(cObjA.startDate !== cObjB.startDate)
         {
            retval += 'From: ' + cObjA.startDate;
            retval += ' <i>\>\>\> ' + cObjB.startDate + '</i><br>';
         }
         if(cObjA.endDate !== cObjB.endDate)
         {
            retval += 'To: ' + cObjA.endDate;
            retval += ' <i>\>\>\> ' + cObjB.endDate + '<i><br>';
         }
         if(cObjA.forward !== cObjB.forward)
         {
            retval += 'Direction: ' + WHE.GetDirectionString(cObjA.forward);
            retval += ' <i>\>\>\> ' + WHE.GetDirectionString(cObjB.forward) + '</i><br>';
         }
         if(cObjA.permanent !== cObjB.permanent)
         {
            retval += 'Ignore traffic: ' + cObjA.permanent;
            retval += ' <i>\>\>\> ' + cObjB.permanent + '</i><br>';
         }
      }
      return retval;
   },
   GetTIOString: function(tioValue)
   {
      let retval = I18n.lookup("turn_tooltip.instruction_override.no_opcode");
      if(tioValue !== null)
      {
         retval = I18n.lookup("turn_tooltip.instruction_override.opcodes." + tioValue);
      }
      return retval;
   },
   SegmentHistoryNameString: function(segID)
   {
      let retval = '';
      if(W.model.segments.objects[segID] !== undefined)
      {
         if(W.model.segments.objects[segID].attributes.primaryStreetID !== undefined)
         {
            const sID = W.model.segments.objects[segID].attributes.primaryStreetID;
            const sName = W.model.streets.objects[sID].attributes.name;
            if((sName === null) || (sName === ''))
            {
               retval += 'unnamed segment';
            }
            else
            {
               retval += sName;
            }
         }
         else
         {
            retval += 'unnamed segment';
         }
      }
      else
      {
         retval += 'unknown segment';
      }
      retval += ' (ID ' + segID + ')';
      return retval;
   },
   VenueHistoryFormatChanges: function(vObj, showExtendedDetails)
   {
      let tHTML = '';
      if(vObj.type === "IMAGE")
      {
         tHTML += '<br>Image update';
      }
      else if(vObj.type === "REQUEST")
      {
         if(vObj.subType === "UPDATE")
         {
            if(vObj.changedVenue !== undefined)
            {
               if(vObj.changedVenue.categories !== undefined)
               {
                  tHTML += '<br>Category update';

                  if(showExtendedDetails === true)
                  {
                     tHTML += "<ul>";
                     for(let j = 0; j < vObj.changedVenue.categories.length; ++j)
                     {
                        tHTML += '<li>'+vObj.changedVenue.categories[j];
                     }
                     tHTML += "</ul>";
                  }
               }
               if(vObj.changedVenue.entryExitPoints !== undefined)
               {
                  tHTML += '<br>Entry/exit point change';
               }
               if(vObj.changedVenue.description !== undefined)
               {
                  tHTML += '<br>Description change';
                  if(showExtendedDetails === true)
                  {
                     tHTML += '<ul><li>' + vObj.changedVenue.description + "</ul>";
                  }
               }
               if(vObj.changedVenue.name !== undefined)
               {
                  tHTML += '<br>Name change';
                  if(showExtendedDetails === true)
                  {
                     tHTML += '<ul><li>' + vObj.changedVenue.name + "</ul>";
                  }
               }
               if(vObj.changedVenue.openingHours !== undefined)
               {
                  tHTML += '<br>Opening hours change';
                  if(showExtendedDetails === true)
                  {
                  }
               }
               if(vObj.changedVenue.url !== undefined)
               {
                  tHTML += '<br>URL change';
                  if(showExtendedDetails === true)
                  {
                  }
               }
               if(vObj.changedVenue.services !== undefined)
               {
                  tHTML += '<br>Services change';
                  if(showExtendedDetails === true)
                  {
                     tHTML += '<ul>';
                     for(let i = 0; i < vObj.changedVenue.services.length; ++i)
                     {
                        tHTML += '<li>' + I18n.lookup('venues.services')[vObj.changedVenue.services[i]];
                     }
                     tHTML += '</ul>';
                  }
               }
               if(vObj.changedVenue.phone !== undefined)
               {
                  tHTML += '<br>Phone number change';
                  if(showExtendedDetails === true)
                  {
                  }
               }
               if(vObj.changedVenue.aliases !== undefined)
               {
                  tHTML += '<br>Alternate name change';
                  if(showExtendedDetails === true)
                  {
                     tHTML += '<ul>';
                     for(let i = 0; i < vObj.changedVenue.aliases.length; ++i)
                     {
                        tHTML += '<li>' + vObj.changedVenue.aliases[i];
                     }
                     tHTML += '</ul>';
                  }
               }
               if(vObj.changedVenue.brand !== undefined)
               {
                  tHTML += '<br>Brand change';
                  if(showExtendedDetails === true)
                  {
                  }
               }
            }
         }
         else if(vObj.subType === "FLAG")
         {
            tHTML += '<br>Flagged place';
         }
      }

      if(tHTML === '')
      {
         tHTML += '<br>No details';
      }
      return tHTML;
   },
   TranslateListType: function(orig, listType)
   {
      return I18n.lookup("venues."+listType)[orig];
   },
   GenerateChangeList: function(oldOnes, newOnes, listType)
   {
      if(newOnes === undefined)
      {
         newOnes = [''];
      }
      if(oldOnes === undefined)
      {
         oldOnes = [''];
      }

      let tHTML = "";
      let addHeader = true;
      for(let i = 0; i < newOnes.length; ++i)
      {
         let nC = newOnes[i];
         if(oldOnes.indexOf(nC) === -1)
         {
            if(addHeader === true)
            {
               tHTML += '<br>Added:<ul>';
               addHeader = false;
            }
            tHTML += '<li>' + WHE.TranslateListType(nC, listType);
         }
      }
      if(addHeader === false)
      {
         tHTML += '</ul>';
      }

      addHeader = true;
      for(let i = 0; i < oldOnes.length; ++i)
      {
         let oC = oldOnes[i];
         if(newOnes.indexOf(oC) === -1)
         {
            if(addHeader === true)
            {
               tHTML += '<br>Removed:<ul>';
               addHeader = false;
            }
            tHTML += '<li>' + WHE.TranslateListType(oC, listType);
         }
      }
      if(addHeader === false)
      {
         tHTML += '</ul>';
      }

      return tHTML;
   },
   ParseHistoryObject_Venue: function(tObj)
   {
      let tHTML = '';
      let aType = tObj.actionType;

      if(aType === "UPDATE")
      {
         // categories
         tHTML += WHE.GenerateChangeList(tObj.oldValue.categories, tObj.newValue.categories, WHE.listType.categories);

         // services
         tHTML += WHE.GenerateChangeList(tObj.oldValue.services, tObj.newValue.services, WHE.listType.services);
      }

      return tHTML;
   },
   ParseHistoryObject_VenueUpdateRequest: function(tObj)
   {
      let tHTML = '';
      let aType = tObj.actionType;

      if(aType === "DELETE")
      {
         if(tObj.oldValue.approve === true)
         {
            tHTML += '<b>Approved:</b>';
            tHTML += WHE.VenueHistoryFormatChanges(tObj.oldValue, false);
         }
         else if(tObj.oldValue.approve === false)
         {
            tHTML += '<b>Rejected:</b>';
            tHTML += WHE.VenueHistoryFormatChanges(tObj.oldValue, true);
         }
         else
         {
            tHTML += '<b>Closed, no further details</b>';
            // older venueUpdateRequest objects don't have fully populated oldValues...
         }
      }
      else if(aType === "ADD")
      {
         tHTML += '<b>Editor change pending approval:</b> ';
         tHTML += WHE.VenueHistoryFormatChanges(tObj.newValue, true);
      }

      return tHTML;
   },
   GetStreetBits: function(segID)
   {
      let retval = null;

      if(segID != undefined)
      {
         let sIdx = -1;
         let cIdx = -1;
         let stIdx = -1;
         for(let i = 0; i < WHE.itemHistoryDetails.streets.length; ++i)
         {
            if(WHE.itemHistoryDetails.streets[i].id == segID)
            {
               sIdx = i;
               break;
            }
         }
         
         const cityID = WHE.itemHistoryDetails.streets[sIdx].cityID;
         for(let i = 0; i < WHE.itemHistoryDetails.cities.length; ++i)
         {
            if(WHE.itemHistoryDetails.cities[i].id == cityID)
            {
               cIdx = i;
               break;
            }
         }

         const stateID = WHE.itemHistoryDetails.cities[cIdx].stateID;
         for(let i = 0; i < WHE.itemHistoryDetails.states.length; ++i)
         {
            if(WHE.itemHistoryDetails.states[i].id == stateID)
            {
               stIdx = i;
               break;
            }
         }

         let streetName = "";
         if(sIdx != -1)
         {
            streetName = WHE.itemHistoryDetails.streets[sIdx].name;
         }
         if(streetName == "")
         {
            streetName = "(none)";
         }

         let cityName = "";
         if(cIdx != -1)
         {
            cityName = WHE.itemHistoryDetails.cities[cIdx].name;
         }
         if(cityName == "")
         {
            cityName = "(none)";
         }
         let stateName = "";
         if(stIdx != -1)
         {
            stateName = WHE.itemHistoryDetails.states[stIdx].name;
         }
         if(stateName == "")
         {
            stateName = "(none)";
         }

         retval = [];
         retval.push(streetName);
         retval.push(cityName);
         retval.push(stateName);
      }

      return retval;
   },
   FormatSegmentNameDetails: function(tObj)
   {
      let oldStreetBits = null;
      let newStreetBits = null;

      let retval = "";
      const bitIDs = ["Street: ", "City: ", "County: "];

      if(tObj.oldValue != undefined)
      {
         oldStreetBits = WHE.GetStreetBits(tObj.oldValue.primaryStreetID);
      }
      if(tObj.newValue != undefined)
      {
         newStreetBits = WHE.GetStreetBits(tObj.newValue.primaryStreetID);
      }

      if(oldStreetBits != newStreetBits)
      {
         if(oldStreetBits == null)
         {
            retval += "Added:<br>";
            for(let i = 0; i < 3; ++i)
            {
               if(newStreetBits[i] != "(none)")
               {
                  retval += "&nbsp;";
                  retval += bitIDs[i] + newStreetBits[i]+"<br>";
               }
            }
         }
         else if(newStreetBits == null)
         {
            retval += "Deleted: "+oldStreetBits[0]+', '+oldStreetBits[1]+', '+oldStreetBits[2];
         }
         else
         {
            retval += "Changed:<br>";
            for(let i = 0; i < 3; ++i)
            {
               if(oldStreetBits[i] != newStreetBits[i])
               {
                  retval += "&nbsp;";
                  retval += bitIDs[i] + oldStreetBits[i]+" >> "+newStreetBits[i]+"<br>";
               }
            }
         }
      }
      return retval;
   },
   ParseHistoryObject_Segment: function(tObj)
   {
      let tHTML = '';
      let aType = tObj.actionType;
      
      if(aType === "UPDATE")
      {
         tHTML += WHE.FormatSegmentNameDetails(tObj);
         tHTML += WHE.FormatTBRDetails(tObj);
      }

      return tHTML;
   },
   ParseHistoryObject_RoadClosure: function(tObj)
   {
      let tHTML = '';
      let aType = tObj.actionType;

      let cObjA = null;
      let cObjB = null;

      tHTML += '<b>Road closure:</b> ';
      if(aType === "ADD")
      {
         tHTML += 'added<br>';
         cObjA = tObj.newValue;
      }
      else if(aType === "DELETE")
      {
         tHTML += 'deleted<br>';
         cObjA = tObj.oldValue;
      }
      else if(aType === "UPDATE")
      {
         tHTML += 'edited<br>';
         cObjA = tObj.oldValue;
         cObjB = tObj.newValue;
      }
      tHTML += 'ID: ' + tObj.objectID + '<br>';
      tHTML += WHE.FormatClosureDetails(cObjA, cObjB);

      return tHTML;
   },
   GetTurnAngleString: function(angle)
   {
      let retval = I18n.lookup('lanes.override.angles')[angle];
      if(retval == undefined)
      {
         retval = 'unknown angle';
      }
      return retval;
   },
   GetLanesString: function(lanesFrom, lanesTo)
   {
      let retval = '';
      if(lanesFrom == lanesTo)
      {
         retval = 'lane '+lanesFrom;
      }
      else
      {
         retval = 'lanes '+lanesFrom+'-'+lanesTo;
      }
      return retval;
   },
   GetGuidanceModeString: function(gMode)
   {
      let retval;
      if(gMode == 0)
      {
         retval = "Waze Selected";
      }
      else if(gMode == 1)
      {
         retval = "View Only";
      }
      else if(gMode == 2)
      {
         retval = "View and Hear";
      }
      else
      {
         retval = "";
      }
      return retval;
   },
   GetLaneGuidanceUpdateString: function(tObj)
   {
      let tHTML = '<br><i>';
      if(tObj.oldValue.lanes == undefined)
      {
         tHTML += 'Lane guidance added: ';
         let lanesFrom = tObj.newValue.lanes.fromLaneIndex + 1;
         let lanesTo = tObj.newValue.lanes.toLaneIndex + 1;
         tHTML += WHE.GetLanesString(lanesFrom, lanesTo);
         let turnAngle = tObj.newValue.lanes.laneArrowAngle;
         if(tObj.newValue.lanes.angleOverride != undefined)
         {
            turnAngle = tObj.newValue.lanes.angleOverride;
         }
         tHTML += ' '+WHE.GetTurnAngleString(turnAngle);
      }
      else if(tObj.newValue.lanes == undefined)
      {
         tHTML += 'Lane guidance removed';
      }
      else
      {
         tHTML += 'Lane guidance changed: ';

         let lanesFromNew = tObj.newValue.lanes.fromLaneIndex + 1;
         let lanesToNew = tObj.newValue.lanes.toLaneIndex + 1;
         let lanesFromOld = tObj.oldValue.lanes.fromLaneIndex + 1;
         let lanesToOld = tObj.oldValue.lanes.toLaneIndex + 1;
         tHTML += WHE.GetLanesString(lanesFromOld, lanesToOld);
         let lanesSame = ((lanesFromNew == lanesFromOld) && (lanesToNew == lanesToOld));

         let turnAngleNew = tObj.newValue.lanes.laneArrowAngle;
         if(tObj.newValue.lanes.angleOverride != undefined)
         {
            turnAngleNew = tObj.newValue.lanes.angleOverride;
         }
         let turnAngleOld = tObj.oldValue.lanes.laneArrowAngle;
         if(tObj.oldValue.lanes.angleOverride != undefined)
         {
            turnAngleOld = tObj.oldValue.lanes.angleOverride;
         }
         if((turnAngleOld != turnAngleNew) || (lanesSame == false))
         {
            tHTML += ' '+WHE.GetTurnAngleString(turnAngleOld)+' > ';
            if(lanesSame == false)
            {
               tHTML += WHE.GetLanesString(lanesFromNew, lanesToNew);
               tHTML += ' ';
            }
            tHTML += WHE.GetTurnAngleString(turnAngleNew);
         }

         let gModeNew = tObj.newValue.lanes.guidanceMode;
         let gModeOld = tObj.oldValue.lanes.guidanceMode;
         if(gModeOld != gModeNew)
         {
            tHTML += ' '+WHE.GetGuidanceModeString(gModeOld)+' > '+WHE.GetGuidanceModeString(gModeNew);
         }
      }
      tHTML += '</i>';

      return tHTML;
   },
   ParseHistoryObject_NodeConnection: function(tObj)
   {
      let tHTML = '';
      let aType = tObj.actionType;

      let outboundTR = (tObj.objectID.fromSegID === WHE.enhanceHistoryItemID);
      if(outboundTR === true)
      {
         tHTML += '<b>Outbound turn:</b> ';
      }
      else
      {
         tHTML += '<b>Inbound turn:</b> ';
      }
      if(aType == "DELETE") tHTML += 'disabled';
      else if(aType == "ADD") tHTML += 'enabled';
      tHTML += ' from ';

      if(outboundTR === true)
      {
         tHTML += 'node ';
         if(tObj.objectID.fromSegFwd === true)
         {
            tHTML += 'B';
         }
         else
         {
            tHTML += 'A';
         }
         tHTML += ' to ';
         tHTML += WHE.SegmentHistoryNameString(tObj.objectID.toSegID);
      }
      else
      {
         tHTML += WHE.SegmentHistoryNameString(tObj.objectID.fromSegID);
         tHTML += ' to node ';
         if(tObj.objectID.toSegFwd === true)
         {
            tHTML += 'A';
         }
         else
         {
            tHTML += 'B';
         }
      }
      tHTML += '<br>';

      if(aType === "UPDATE")
      {
         if((tObj.oldValue !== undefined) && (tObj.newValue !== undefined))
         {
            if(tObj.oldValue.instructionOpCode !== tObj.newValue.instructionOpCode)
            {
               tHTML += '<i>Instruction Override changed from '+WHE.GetTIOString(tObj.oldValue.instructionOpCode)+' to '+WHE.GetTIOString(tObj.newValue.instructionOpCode)+'</i><br>';
            }
            if(tObj.oldValue.lanes !== tObj.newValue.lanes)
            {
               tHTML += WHE.GetLaneGuidanceUpdateString(tObj);
            }
            if((tObj.oldValue.turnGuidance != null) && (tObj.newValue.turnGuidance == null))
            {
               tHTML += '<i>Turn guidance deleted</i><br>';
            }
         }
      }
      else if(aType === "ADD")
      {
         if(tObj.newValue !== undefined)
         {
            if(tObj.newValue.instructionOpCode !== null)
            {
               tHTML += '<i>Instruction Override set to ' + WHE.GetTIOString(tObj.newValue.instructionOpCode)+'</i><br>';
            }
         }
      }
      else if(aType === "DELETE")
      {
         if(tObj.oldValue !== undefined)
         {
            if(tObj.oldValue.instructionOpCode !== null)
            {
            }
         }
      }
      if(aType === "UPDATE")
      {
         tHTML += WHE.FormatTBRDetails(tObj);
         if((tObj.oldValue.navigable !== null) && (tObj.oldValue.navigable !== undefined))
         {
            if((tObj.newValue.navigable !== null) && (tObj.newValue.navigable !== undefined))
            {
               if((tObj.oldValue.navigable === false) && (tObj.newValue.navigable === true))
               {
                  tHTML += '<br><i>Turn enabled</i>';
               }
               else if((tObj.oldValue.navigable === true) && (tObj.newValue.navigable === false))
               {
                  tHTML += '<br><i>Turn disabled</i>';
               }
            }
         }

      }
      else if(aType === "ADD")
      {
         tHTML += WHE.FormatTBRDetails(tObj);
      }

      return tHTML;  
   },
   HistoryEntryToAdjust: function(lObj)
   {
      let retval;

      if
      (
         (lObj.getElementsByClassName('ca-geometry').length > 0) ||
         (lObj.getElementsByClassName('ca-roadType').length > 0) ||
         (lObj.getElementsByClassName('ca-fwdLaneCount').length > 0) ||
         (lObj.getElementsByClassName('ca-revLaneCount').length > 0)
      )
      {
         // For any history entry with one of these classes, the native details are sufficient, so don't touch them at all...
         retval = null;
      }
      else if (lObj.getElementsByClassName('turn-preview').length > 0)
      {
         // For turn previews, edit just the name so that it more clearly indicates which turn the preview relates to...
         retval = lObj.getElementsByClassName('ro-name')[0];
      }
      else
      {
         // For all other history entries, nuke the whole thing and replace with our own details...
         retval = lObj;
      }

      return retval;
   },
   EditPanelChanged: function()
   {
      let objType = W.selectionManager.getSelectedDataModelObjects()[0]?.type;
      if((objType == "segment") || (objType == "venue"))
      {
         if((document.querySelector('.toggleHistory') != null) && (document.querySelector('#wheHideHistoryBits') == null))
         {
            document.querySelector('.elementHistoryContainer').style.display='block';
            let hhbToggle = document.createElement('label');
            hhbToggle.id = "wheHideHistoryBits";
            let hhbText = "";
            if(objType == "segment")
            {
               hhbText = "Hide closures?";
            }
            else if(objType == "venue")
            {
               hhbText = "Hide rejected updates?";
            }

            let iHTML = "<input type='checkbox' id='whe_cbHideHistoryBits'";
            if(WHE.settings.hideBits === true)
            {
               iHTML += " checked";
            }
            iHTML += " />" + hhbText;
            hhbToggle.innerHTML = iHTML;
            document.querySelector(".elementHistoryContainer").insertBefore(hhbToggle, null);

            document.querySelector('#whe_cbHideHistoryBits').addEventListener('click', WHE.UpdateHistoryEntries, true);
            document.querySelector('.toggleHistory').addEventListener('click', WHE.WaitHistoryShown, true);
         }
      }
   },
   WaitHistoryShown: function()
   {
      if(document.querySelector('.toggleHistory').innerText == "View History")
      {
         window.setTimeout(WHE.WaitHistoryShown, 100);
      }
      else
      {
         WHE.UpdateHistoryEntries();
      }
   },
   ShowUpgradeNotes: function()
   {
      WHE.AddLog('let users know what\'s new in this release');

      let releaseNotes = '';
      releaseNotes += '<p>Thanks for installing WHE ' + Release.version + ' (' + Release.date + ')</p>';

      let loop;
      if(Release.changes.length > 0)
      {
         releaseNotes += '<br>Changes since the last release:<br>';
         releaseNotes += '<ul>';
         for(loop=0; loop < Release.changes.length; loop++)
         {
            releaseNotes += '<li>'+Release.changes[loop];
         }
         releaseNotes += '</ul>';
      }

      AlertBox.Init("wheReleaseNotes", "wheat", "aliceblue", WHE.ModifyHTML);
      AlertBox.Show('fa-info-circle', 'WHE Release Notes', releaseNotes, false, "OK", "", null, null);
   },
   LoadSettings: function()
   {
      if(localStorage.WHESettings !== undefined)
      {
         WHE.settings = JSON.parse(localStorage.WHESettings);
      }
   },
   SaveSettings: function()
   {
      localStorage.WHESettings = JSON.stringify(WHE.settings);
   },
   FinaliseInit: function()
   {
      WHE.AddLog('Finalise init');
      let MO_EditPanel = new MutationObserver(WHE.EditPanelChanged);
      MO_EditPanel.observe(document.querySelector('#edit-panel'),{childList: true, subtree: true});

      WHE.LoadSettings();
      window.addEventListener("beforeunload", WHE.SaveSettings, false);

      WHE.AddInterceptor();
      if(Release.version != WHE.settings.lastVer)
      {
         WHE.ShowUpgradeNotes();
         WHE.settings.lastVer = Release.version;
      }

      ////WHE.showDebugOutput = false;
   },
   ArrayPushUnique: function(arr, obj)
   {
      let doPush = true;
      let sObj = JSON.stringify(obj);

      for(const i of arr)
      {
         if(JSON.stringify(i) == sObj)
         {
            doPush = false;
            break;
         }
      }
      if(doPush === true)
      {
         arr.push(obj);
      }
      return arr;
   },
   ParseHistoryResponse: function(body)
   {
      WHE.AddLog('history response received...');

      if(W.selectionManager.getSelectedDataModelObjects().length === 1)
      {
         WHE.enhanceHistoryItemID = W.selectionManager.getSelectedDataModelObjects()[0].attributes.id;
         WHE.AddLog('itemID = '+WHE.enhanceHistoryItemID);

         for(const t of body.streets.objects)
         {
            WHE.ArrayPushUnique(WHE.itemHistoryDetails.streets, t);
         }
         for(const t of body.cities.objects)
         {
            WHE.ArrayPushUnique(WHE.itemHistoryDetails.cities, t);
         }
         for(const t of body.states.objects)
         {
            WHE.ArrayPushUnique(WHE.itemHistoryDetails.states, t);
         }
         for(const t of body.countries.objects)
         {
            WHE.ArrayPushUnique(WHE.itemHistoryDetails.countries, t);
         }
         for(const t of body.users.objects)
         {
            WHE.ArrayPushUnique(WHE.itemHistoryDetails.users, t);
         }      
         for(const t of body.transactions.objects)
         {
            WHE.itemHistoryDetails.transactions.push(t);
         }
         WHE.UpdateHistoryEntries();
      }
      else
      {
         WHE.AddLog('selected item count != 1, which is odd...');
         WHE.enhanceHistoryItemID = null;
      }
   },
   HandleListEntry: function(className)
   {
      const handledClasses = ['ca-images', 'ca-categories', 'ca-services', 'segment-related-objects'];
      let retval = false;

      for(let i = 0; i < handledClasses.length; ++ i)
      {
         if(className.indexOf(handledClasses[i]) !== -1)
         {
            retval = true;
            break;
         }
      }
      return retval;
   },
   ProcessNativeHistoryEntry: function(lObj, listEntries)
   {
      let TCA = lObj.querySelectorAll('.tx-changed-attribute');
      if(TCA.length > 0)
      {
         for(let i = 0; i < TCA.length; ++i)
         {
            let taObj = WHE.HistoryEntryToAdjust(TCA[i]);
            if(taObj !== null)
            {
               let cn = taObj.childNodes[1];
               if(WHE.HandleListEntry(cn.className) === true)
               {
                  listEntries.push(cn);
               }
            }
         }
      }
      else
      {
         let newLObj = WHE.HistoryEntryToAdjust(lObj);
         if(newLObj !== null)
         {
            if(newLObj.querySelectorAll('.ca-name').length > 0)
            {
               // Keep the caption part of any entry where it's stored within the tx-changed
               // element rather than outside of it - this seems to be done for anything
               // where the caption is something other than "Allowed" or "Disallowed"
               let taObj = WHE.HistoryEntryToAdjust(newLObj);
               if(taObj !== null)
               {
                  let cn = newLObj.childNodes[1];
                  if(WHE.HandleListEntry(cn.className) === true)
                  {
                     listEntries.push(cn);
                  }
               }
            }
            else
            {
               // For entries where the caption is outside the element, we can overwrite the
               // whole thing...
               if(WHE.HandleListEntry(newLObj.className) === true)
               {
                  listEntries.push(newLObj);
               }
            }
         }
      }
   },
   UpdateHistoryEntries: function()
   {
      let heContainer = document.querySelector('.historyContent');
      if(heContainer !== null)
      {
         if(heContainer.querySelector('.history-loader') !== null)
         {
            window.setTimeout(WHE.UpdateHistoryEntries, 10);
            return;
         }

         if(heContainer.style.display === "")
         {
            let historyLength = WHE.itemHistoryDetails.transactions.length;
            WHE.AddLog("found "+historyLength+" history entries");
            let tHTML;
            let hideBits = document.querySelector('#whe_cbHideHistoryBits').checked;
            if(hideBits !== WHE.settings.hideBits)
            {
               WHE.settings.hideBits = hideBits;
               WHE.SaveSettings();
            }
            let objType = W.selectionManager.getSelectedDataModelObjects()[0]?.type;

            let goAround = false;
            for(let i = 0; i < historyLength; ++i)
            {
               let heEntry = heContainer.querySelectorAll('.tx-item')[i];
               let heToggle = heEntry.querySelector('.tx-item-toggle-icon');
               if(heToggle !== null)
               {
                  if(heEntry.classList.contains('tx-item-expanded') === false)
                  {
                     heToggle.click();
                     goAround = true;
                  }
               }
            }
            if(goAround === true)
            {
               window.setTimeout(WHE.UpdateHistoryEntries, 10);
               return;
            }

            for(let i = 0; i < historyLength; ++i)
            {
               let heEntry = heContainer.querySelectorAll('.tx-item')[i];
               let historyEntry = heEntry.querySelector('.tx-item-content');
               if(historyEntry !== null)
               {
                  let listEntries = [];
                  let listEntryIdx = 0;

                  if((objType === 'segment') || (objType === 'venue'))
                  {
                     let lObj = historyEntry.querySelector('.main-changes-list');
                     if(lObj !== null)
                     {
                        WHE.ProcessNativeHistoryEntry(lObj, listEntries);
                     }
                     lObj = historyEntry.querySelector('.segment-related-objects');
                     if(lObj !== null)
                     {
                        WHE.ProcessNativeHistoryEntry(lObj, listEntries);
                     }
                  }

                  for(let rol of historyEntry.querySelectorAll('.related-objects-list'))
                  {
                     for(let lObj of rol.getElementsByTagName('wz-caption'))
                     {
                        WHE.ProcessNativeHistoryEntry(lObj, listEntries);
                     }
                  }

                  let hObj = WHE.itemHistoryDetails.transactions[i];
                  let uIdx = -1;
                  let aIdx = -1;
                  let dIdx = -1;
                  let s;
                  for(s = 0; s < hObj.objects.length; ++s)
                  {
                     if((uIdx == -1) && (hObj.objects[s].actionType == "UPDATE"))
                     {
                        uIdx = s;
                     }
                     if((aIdx == -1) && (hObj.objects[s].actionType == "ADD"))
                     {
                        aIdx = s;
                     }
                     if((dIdx == -1) && (hObj.objects[s].actionType == "DELETE"))
                     {
                        dIdx = s;
                     }
                  }
                  let tList = [];
                  if(uIdx != -1)
                  {
                     for(s = 0; s < hObj.objects.length; ++s)
                     {
                        if(hObj.objects[s].actionType == "UPDATE")
                        {
                           tList.push(hObj.objects[s]);
                        }
                     }
                  }
                  if((aIdx != -1) && (aIdx < dIdx))
                  {
                     for(s = 0; s < hObj.objects.length; ++s)
                     {
                        if(hObj.objects[s].actionType == "ADD")
                        {
                           tList.push(hObj.objects[s]);
                        }
                     }
                     for(s = 0; s < hObj.objects.length; ++s)
                     {
                        if(hObj.objects[s].actionType == "DELETE")
                        {
                           tList.push(hObj.objects[s]);
                        }
                     }
                  }
                  else
                  {
                     for(s = 0; s < hObj.objects.length; ++s)
                     {
                        if(hObj.objects[s].actionType == "DELETE")
                        {
                           tList.push(hObj.objects[s]);
                        }
                     }
                     for(s = 0; s < hObj.objects.length; ++s)
                     {
                        if(hObj.objects[s].actionType == "ADD")
                        {
                           tList.push(hObj.objects[s]);
                        }
                     }
                  }

                  let hiddenBits = 0;
                  for(let k = 0; k < tList.length; ++k)
                  {
                     tHTML = '';
                     let tObj = tList[k];
                     let oType = tObj.objectType;

                     if(oType === "nodeConnection")
                     {
                        tHTML += WHE.ParseHistoryObject_NodeConnection(tObj);
                     }
                     else if(oType === "roadClosure")
                     {
                        tHTML += WHE.ParseHistoryObject_RoadClosure(tObj);
                     }
                     else if(oType === "venue")
                     {
                        tHTML += WHE.ParseHistoryObject_Venue(tObj);
                     }
                     else if(oType === "venueUpdateRequest")
                     {
                        tHTML += WHE.ParseHistoryObject_VenueUpdateRequest(tObj);
                     }
                     else if(oType === "segment")
                     {
                        tHTML += WHE.ParseHistoryObject_Segment(tObj);
                     }

                     if(listEntries.length > listEntryIdx)
                     {
                        if(tHTML !== '')
                        {
                           if(listEntries[listEntryIdx] !== undefined)
                           {
                              listEntries[listEntryIdx].innerHTML = WHE.ModifyHTML(tHTML + '<br>');
                              
                              if((oType === 'roadClosure') || (oType === 'venue'))
                              {
                                 let pObj = listEntries[listEntryIdx];
                                 WHE.FindCard(pObj, hideBits);
                              }
                              else if(oType === 'venueUpdateRequest')
                              {
                                 // Hide/unhide the individual transaction entries for rejected PURs
                                 if(tObj?.oldValue?.approve === false)
                                 {
                                    let pObj = listEntries[listEntryIdx];   
                                    if(hideBits === true)
                                    {
                                       pObj.style.display = "none";
                                    }
                                    else
                                    {
                                       pObj.style.display = "";
                                    }
                                    ++hiddenBits;
                                 }
                              }
                           }
                           ++listEntryIdx;
                        }
                     }
                  }

                  // Venue entry cards may contain multiple transactions, so we only want to hide/restore
                  // them if all of the transaction entries have also been hidden/restored (i.e. whenever
                  // tList.length = hiddenBits)... 
                  if(objType === "venue")
                  {
                     if(tList.length === hiddenBits)
                     {
                        // -1 as we've already incremented listEntryIdx...
                        let pObj = listEntries[listEntryIdx - 1];
                        WHE.FindCard(pObj, hideBits);
                     }
                  }
               }
            }
         }
      }
   },
   FindCard: function(pObj, hideBits)
   {
      let foundCard = false;
      while(foundCard === false)
      {
         pObj = pObj.parentElement;
         foundCard = (pObj.tagName == "WZ-CARD");
      }
      if(hideBits === true)
      {
         pObj.style.display = "none";
      }
      else
      {
         pObj.style.display = "";
      }
   },
   AddInterceptor: function()
   {
      WHE.AddLog('Adding interceptor functions...');

      // intercept fetch() so we can detect when requests are made for object history details, and
      // grab copies of the responses - this both enables us to know when the history is being
      // viewed (requests are only made when the user clicks View History...), and avoids the need
      // to perform our own requests to get the same data (as URO+ used to do in the original
      // iteration of this code...)

      // https://stackoverflow.com/questions/45425169/intercept-fetch-api-requests-and-responses-in-javascript  
      const origFetch = window.fetch;
      window.fetch = async (...args) => 
      {
         let [resource, config ] = args;

         // as we're handling everything that goes via fetch(), we let all requests through as-is,
         // except for the ones related to history fetches - these requests always include a
         // reference to "ElementHistory" in their URLs...
         if(resource.url !== undefined)
         {
            if(resource.url.indexOf('ElementHistory') != -1)
            {
               WHE.AddLog('object history being viewed...');
               if(resource.url.indexOf('&till=') == -1)
               {
                  WHE.AddLog('first history entries requested, resetting tracking vars...');
                  WHE.enhanceHistoryItemID = null;
                  WHE.itemHistoryDetails = {streets: [], cities: [], states: [], countries: [], users: [], transactions: []};
               }
            }
         }

         const response = await origFetch(resource, config);

         // we also let all responses through as-is, except for the ones related to history fetches...
         if(response.url !== undefined)
         {
            if(response.url.indexOf('ElementHistory') != -1)
            {
               response
               .clone()
               .json()
               .then(body => WHE.ParseHistoryResponse(body));
            }
         }

         return response;
      };
   },
   Initialise: function()
   {
      if(document.getElementsByClassName("sandbox").length > 0)
      {
         WHE.AddLog('WME practice mode detected, script is disabled...');
         return;
      }

      if(document.location.href.indexOf('user/') !== -1)
      {
         WHE.AddLog('User profile page detected, script is disabled...');
         return;
      }

      if ((typeof W === 'object') && (W.userscripts?.state?.isReady))
      {
         WHE.AddLog('Initialising now...');
         WHE.FinaliseInit();
      } 
      else 
      {
         WHE.AddLog('Initialising on wme-ready...');
         document.addEventListener("wme-ready", WHE.FinaliseInit, {once: true});
      }
   }
};
WHE.Initialise();