// ==UserScript==
// @name                TISWAS
// @namespace           http://greasemonkey.chizzum.com
// @description         Lists all turn instructions defined within the current map view
// @include             https://*.waze.com/*editor*
// @include             https://editor-beta.waze.com/*
// @include             https://beta.waze.com/*
// @exclude             https://www.waze.com/user/*editor/*
// @exclude             https://www.waze.com/*/user/*editor/*
// @grant               none
// @version             0.9
// @downloadURL https://update.greasyfork.org/scripts/483357/TISWAS.user.js
// @updateURL https://update.greasyfork.org/scripts/483357/TISWAS.meta.js
// ==/UserScript==

const TISWAS =
{
   graphEntries: [],

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
   AddEventListener: function(elm,eventType,eventFn,eventBool)
   {
      try
      {
         document.getElementById(elm).addEventListener(eventType, eventFn, eventBool);
      }
      catch(err)
      {
         TISWAS.AddLog('AddEventListener() - '+elm+' not found!');
      }
   },
   AddLog: function(logtext)
   {
      console.log('TISWAS: '+Date()+' '+logtext);
   },
   RegexContains: function(text, contains)
   {
      let retval = false;
      if(text !== null)
      {
         let re = RegExp(contains, 'i');
         if(text.search(re) != -1)
         {
            retval = true;
         }
      }
      return retval;
   },

   GraphEntry: function(segID, es, rs, t, tts, vi, ioc)
   {
      this.segID = segID;
      this.es = es;
      this.rs = rs;
      this.t = t;
      this.tts = tts;
      this.vi = vi;
      this.ioc = ioc;
   },
   PushGraphEntry: function(e)
   {
      for(let i in e)
      {
         if(e.hasOwnProperty(i))
         {
            let tg = e[i].turnGuidance;
            let ioc = e[i].instructionOpcode;
            if((tg !== null) || (ioc !== null))
            {
               let segID = i;
               let entry = null;
               segID = segID.replace("f","");
               segID = segID.replace("r","");

               let es = [];
               let rs = [];

               entry = new TISWAS.GraphEntry(segID, es, rs, "", null, null, ioc);

               if(tg !== null)
               {
                  if(tg.exitSigns !== null)
                  {
                     for(let j = 0; j < tg.exitSigns.length; ++j)
                     {
                        es.push(tg.exitSigns[j]);
                     }
                     entry.es = es;
                  }
                  if(tg.roadShields !== null)
                  {
                     for(let j in tg.roadShields)
                     {
                        if(tg.roadShields.hasOwnProperty(j))
                        {
                           rs.push(tg.roadShields[j]);
                        }
                        entry.rs = rs;
                     }
                  }
                  entry.t = tg.towards;
                  if(tg.tts !== "")
                  {
                     entry.tts = tg.tts;
                  }
               }
               
               TISWAS.graphEntries.push(entry);
            }
         }
      }
   },
   SegSelect: function(e)
   {
      let segID = e.currentTarget.attributes.tag.value;
      let segObj = W.model.segments.objects[segID];
      let segCenter = segObj.attributes.geometry.getBounds().getCenterLonLat();
      W.selectionManager.setSelectedModels(segObj);
      W.map.setCenter(segCenter);
   },
   ReplaceShieldIDs: function(textIn, rs)
   {
      while(textIn.indexOf("$RS") !== -1)
      {
         let start = textIn.indexOf("$RS");
         let end = textIn.indexOf(" ", start);
         let rsID = null;
         if(end === -1)
         {
            rsID = parseInt(textIn.slice(start + 4));
         }
         else
         {
            rsID = parseInt(textIn.slice(start + 4, end));
         }

         let rsImg = "";
         if(rsID !== null)
         {
            rsImg = '<img src="https://renderer-row.waze.com/renderer/v1/signs/' + rs[rsID].type + '?text=' + rs[rsID].text + '" height="40px" style="margin-top:-8px;margin-bottom:-8px;">';
            if(rs[rsID].direction !== null)
            {
               rsImg += rs[rsID].direction;
            }
         }

         if(end === -1)
         {
            textIn = textIn.slice(0, start) + rsImg;
         }
         else
         {
            textIn = textIn.slice(0, start) + rsImg + textIn.slice(end + 1);
         }
      }
      return textIn;
   },
   FormatTI: function(ge, idx, useFilter, contains)
   {
      let showTI;
      if(useFilter === false)
      {
         showTI = true;
      }
      else
      {
         showTI = false;
      }

      let innerHTML = '<div style="background-color: yellow;"><i class="fa fa-road" style="scale:150%;;padding-right:10px;"></i><b>' + ge.segID + '</b></div>';
      
      innerHTML += '<div style="padding-left:10px;padding-top:4px;">';
      if(ge.es.length !== 0)
      {
         innerHTML += '<i class="fa fa-sign-out" style="scale:150%;;padding-right:10px;"></i>';         
         for(let j = 0; j < ge.es.length; ++j)
         {
            innerHTML += '<img src="https://renderer-row.waze.com/renderer/v1/signs/' + ge.es[j].type + '?text=' + ge.es[j].text + '" height="25px" style="padding-right:10px;">';
         }
         innerHTML += '<br>';
      }
      if(ge.vi !== null)
      {
         innerHTML += '<i class="fa fa-eye" style="scale:150%;;padding-right:10px;"></i>';
         innerHTML += TISWAS.ReplaceShieldIDs(ge.vi, ge.rs);
         innerHTML += '<br>';

         if(useFilter === true)
         {
            showTI = showTI || TISWAS.RegexContains(ge.vi, contains);
         }
      }
      if(ge.rs.length > 0)
      {
         for(let j = 0; j < ge.rs.length; ++j)
         {
            if(useFilter === true)
            {
               showTI = showTI || TISWAS.RegexContains(ge.rs[j].text, contains);
               showTI = showTI || TISWAS.RegexContains(ge.rs[j].direction, contains);
            }
         }
      }
      if(ge.t !== "")
      {
         innerHTML += '<i class="fa fa-reply" style="scale:150%;;padding-right:10px;"></i>';
         innerHTML += TISWAS.ReplaceShieldIDs(ge.t, ge.rs);
         innerHTML += '<br>';

         if(useFilter === true)
         {
            showTI = showTI || TISWAS.RegexContains(ge.t, contains);
         }
      }
      if(ge.tts !== null)
      {
         innerHTML += '<i class="fa fa-comment" style="scale:150%;;padding-right:10px;"></i>';
         innerHTML += ge.tts + '<br>';
         if(useFilter === true)
         {
            showTI = showTI || TISWAS.RegexContains(ge.tts, contains);
         }
      }
      if(ge.ioc !== null)
      {
         innerHTML += '<div';
         if(ge.tts !== null)
         {
            innerHTML += ' style="color: gray; text-decoration: line-through;"';
         }
         innerHTML += '><i class="fa fa-comment" style="scale:150%;;padding-right:10px;"></i>';
         let localisedIOC = I18n.lookup('turn_tooltip.instruction_override.opcodes')[ge.ioc];
         innerHTML += localisedIOC + '</div>';
         if(useFilter === true)
         {
            showTI = showTI || TISWAS.RegexContains(localisedIOC, contains);
         }
      }
      innerHTML += '</div>';

      let resHTML = '<div id="_tdiv-' + idx + '" tag="' + ge.segID + '" style="padding:2px; margin:6px; cursor:pointer;';
      if(showTI === false)
      {
         resHTML += ' display:none;';
      }
      resHTML += '">';
      resHTML += innerHTML;
      resHTML += '</div>';

      return resHTML;
   },
   DisplayTIs: function()
   {
      let resHTML = '';
      let filterEnabled = document.querySelector('#_tisEnableFilter').checked;
      let filterContains = document.querySelector('#_tisContains').value;

      for(let i = 0; i < TISWAS.graphEntries.length; ++i)
      {
         let ge = TISWAS.graphEntries[i];
         resHTML += TISWAS.FormatTI(ge, i, filterEnabled, filterContains);
      }
      return resHTML;
   },
   UpdateList: function()
   {
      let outPane = document.querySelector('#_tisOutput');
      if(outPane !== null)
      {
         let resHTML = '';
         let nEntries = 0;

         if(W.map.getZoom() >= 17)
         {
            nEntries = TISWAS.graphEntries.length;

            if(nEntries > 0)
            {
               resHTML += TISWAS.DisplayTIs();
            }
            else
            {
               resHTML += "No TIs here...";
            }
         }
         else
         {
            resHTML += "TIs only available at zoom 17+";
         }
         outPane.innerHTML = TISWAS.ModifyHTML(resHTML);

         if(nEntries > 0)
         {
            for(let i = 0; i < nEntries; ++i)
            {
               let linkID = "_tdiv-" + i;
               TISWAS.AddEventListener(linkID, "click", TISWAS.SegSelect, true);
            }
         }
      }
   },
   SurfaceTIs: function()
   {
      TISWAS.graphEntries = [];

      if(W.map.getZoom() >= 17)
      {
         W.model.turnGraph.reverseAdjacencyList.forEach(TISWAS.PushGraphEntry);
      }

      TISWAS.UpdateList();
   },

   PopulateUI: function()
   {
      var iHTML = '';
      iHTML += '<div id="_tisControl">';
      iHTML += '<i class="fa fa-filter" style="scale:150%;padding-right:10px;"></i><input type="checkbox" id="_tisEnableFilter" />&nbsp;';
      iHTML += '<input type="text" style="font-size:14px; line-height:16px; height:22px; margin-bottom:4px;" id="_tisContains">';
      iHTML += '</div>';

      iHTML += '<div id="_tisOutput" />';
   
      return iHTML;
   },
   Initialise: function()
   {
      TISWAS.AddLog("Initialise");
      if(document.getElementsByClassName("sandbox").length > 0)
      {
         TISWAS.AddLog('WME practice mode detected, script is disabled...');
         return;
      }
      if(document.location.href.indexOf('user/') !== -1)
      {
         TISWAS.AddLog('User profile page detected, script is disabled...');
         return;
      }
   
      TISWAS.WaitForW();
   },
   WaitForW: function()
   {
      if(window.W === undefined)
      {
         window.setTimeout(TISWAS.WaitForW, 100);
         return;
      }
   
      if (W.userscripts?.state?.isReady)
      {
         TISWAS.AddTab_API();
      } 
      else 
      {
         document.addEventListener("wme-ready", TISWAS.AddTab_API, {once: true});
      }
   },
   AddTab_API: async function()
   {
      TISWAS.AddLog("Registering with sidepanel...");
      let {tabLabel, tabPane} = W.userscripts.registerSidebarTab("TISWAS");
      tabLabel.innerText = "TISWAS";
      tabPane.innerHTML = TISWAS.ModifyHTML(TISWAS.PopulateUI());
      await W.userscripts.waitForElementConnected(tabPane);
      TISWAS.CompleteUISetup();
   },
   CompleteUISetup: function()
   {
      W.map.events.register("moveend", null, TISWAS.SurfaceTIs);
      W.map.events.register("zoomend", null, TISWAS.SurfaceTIs);
      TISWAS.AddEventListener("_tisEnableFilter", "change", TISWAS.UpdateList, true);
      TISWAS.AddEventListener("_tisContains", "keyup", TISWAS.UpdateList, true);
   }
};
TISWAS.Initialise();
