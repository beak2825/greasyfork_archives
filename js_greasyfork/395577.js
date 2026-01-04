// ==UserScript==
// @name                WME Map Comments Chronological Conversation Corrector (WMC4)
// @namespace           http://greasemonkey.chizzum.com
// @description         Quick hacky fix to restore chronological ordering to map comment conversations
// @include             https://*.waze.com/*editor*
// @include             https://editor-beta.waze.com/*
// @include             https://beta.waze.com/*
// @exclude             https://www.waze.com/user/*editor/*
// @exclude             https://www.waze.com/*/user/*editor/*
// @grant               none
// @version             1.2
// @downloadURL https://update.greasyfork.org/scripts/395577/WME%20Map%20Comments%20Chronological%20Conversation%20Corrector%20%28WMC4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/395577/WME%20Map%20Comments%20Chronological%20Conversation%20Corrector%20%28WMC4%29.meta.js
// ==/UserScript==

/* JSHint Directives */
/* globals W: true */
/* jshint bitwise: false */
/* jshint eqnull: true */
/* jshint esversion: 6 */

function wmc4MCLayerEvent()
{
   // re-order MC conversations after any change is detected in the MC layer
   var idx;
   for(idx in W.model.mapComments.objects)
   {
      if(W.model.mapComments.objects.hasOwnProperty(idx))
      {
         var convo = W.model.mapComments.objects[idx].attributes.conversation;
         if(convo.length > 1)
         {
            console.info('WMC4 - correcting MC '+idx);
            var doSwapPass = true;
            while(doSwapPass === true)
            {
               doSwapPass = false;
               // With the back-to-front rendering of comments in the latest WME, correcting their
               // display order first requires them to be sorted in reverse order, so that when WME
               // then renders them in reverse order, we get back to where we should have been had
               // the WME devs not had a brain fart when deciding that reversing their order was a
               // good idea...
               for(var i = 0; i < (convo.length - 1); ++ i)
               {
                  if(convo[i].createdOn < convo[i + 1].createdOn)
                  {
                     var tSwap = convo[i];
                     convo[i] = convo[i + 1];
                     convo[i + 1] = tSwap;
                     doSwapPass = true;
                  }
               }
            }
         }
      }
   }
}

function wmc4URLayerEvent()
{
   // re-order UR conversations after any change is detected
   var idx;
   for(idx in W.model.updateRequestSessions.objects)
   {
      if(W.model.updateRequestSessions.objects.hasOwnProperty(idx))
      {
         var convo = W.model.updateRequestSessions.objects[idx].comments;
         if(convo.length > 1)
         {
            console.info('WMC4 - correcting UR '+idx);
            var doSwapPass = true;
            while(doSwapPass === true)
            {
               doSwapPass = false;
               // With the back-to-front rendering of comments in the latest WME, correcting their
               // display order first requires them to be sorted in reverse order, so that when WME
               // then renders them in reverse order, we get back to where we should have been had
               // the WME devs not had a brain fart when deciding that reversing their order was a
               // good idea...
               for(var i = 0; i < (convo.length - 1); ++ i)
               {
                  if(convo[i].createdOn < convo[i + 1].createdOn)
                  {
                     var tSwap = convo[i];
                     convo[i] = convo[i + 1];
                     convo[i + 1] = tSwap;
                     doSwapPass = true;
                  }
               }
            }
         }
      }
   }
}

function wmc4WaitInit()
{
   var stillWaiting = false;

   // check for all required objects...
   stillWaiting = stillWaiting || (typeof W == 'undefined');
   if(stillWaiting === false)
   {
      stillWaiting = stillWaiting || (typeof W.app == 'undefined');
      stillWaiting = stillWaiting || (typeof W.model == 'undefined');
      stillWaiting = stillWaiting || (typeof W.loginManager == 'undefined');
   }
   if(stillWaiting === false)
   {
      stillWaiting = stillWaiting || (typeof W.model.mapComments == 'undefined');
      stillWaiting = stillWaiting || (typeof W.model.updateRequestSessions == 'undefined');
   }

   if(stillWaiting === false)
   {
      if(W.loginManager.isLoggedIn())
      {
         console.info('WMC4 - ready for action');
         // Set up listeners for those parts of the model which store map comments and UR comments...
         W.model.mapComments.on("objectsadded", wmc4MCLayerEvent);
         W.model.updateRequestSessions.on("objectschanged", wmc4URLayerEvent);
         // call the reordering functions here just in case those parts of the model were already loaded before
         // we set up the listeners...
         wmc4MCLayerEvent();
         wmc4URLayerEvent();
      }
      else
      {
         stillWaiting = true;
      }
   }

   if(stillWaiting === true)
   {
      // if we weren't able to complete initialisation, try again in a little while
      window.setTimeout(wmc4WaitInit, 1000);
   }
}

wmc4WaitInit();