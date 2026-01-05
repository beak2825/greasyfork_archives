// ==UserScript==
// @name         Remove unpopular meetup.com events
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove unpopular events with less than 30 people attending. Change settings to run script at "document-start".
// @author       You
// @match        http://www.meetup.com/find/events/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/14784/Remove%20unpopular%20meetupcom%20events.user.js
// @updateURL https://update.greasyfork.org/scripts/14784/Remove%20unpopular%20meetupcom%20events.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

    function loadAndRemoveUnpopularEvents()
    {
        var numPagesToLoad = 4;
        var timeToWaitForEachPageLoad = 2000;
        
        loadMoreEvents(numPagesToLoad, timeToWaitForEachPageLoad);
        
        var timeToWaitBeforeRemovingEvents = numPagesToLoad * timeToWaitForEachPageLoad;
        
        setTimeout(removeUnpopularEventsAndMakeReadable, timeToWaitBeforeRemovingEvents);
    }

    function isEventUnpopular(event)
    {
        var attendeeObj = event.find('.attendee-count');
        var attendeeCount = attendeeObj.text().split('\n')[1];
        
        if(attendeeCount < 30)
        {
            return true;
        }
        
        return false;
    }
    
    function scrollToBottom()
    {
       $(window).scrollTop($(document).height());
    }
    
    //Click the more button to get more events, otherwise 
    //if we delete events before doing this, because the scrollbar doesn't 
    //scroll as far to the bottom, the more button doesn't show up.
    function loadMoreEvents(numExtraPagesToLoad, timeToWaitForEachPageLoad)
    {
        $('.simple-infinite-pager').click();
        
        if(numExtraPagesToLoad < 2)
        {
            return;
        }
        
        var numToLoadByScrolling = numExtraPagesToLoad - 1;
        
        for(var i = 0; i < numToLoadByScrolling; i++)
        {
            setTimeout(scrollToBottom, timeToWaitForEachPageLoad*(i+1));
        }
    }

    function removeUnpopularEvents()
    {
        var events = $('.event-listing');
  
        events.each(function(){
          var event = $(this);
          var shouldRemove = isEventUnpopular(event);

          if(shouldRemove == true)
          {
              event.remove();
          }
        });
    }

    function scrollToStartOfResults()
    {
        $(window).scrollTop(0);
        var startOfResultsOffset = $('#C_pageBody').offset().top;
        $(window).scrollTop(startOfResultsOffset);
    }

    function removeUnpopularEventsAndMakeReadable()
    {
        removeUnpopularEvents();
        
        scrollToStartOfResults();
        
        $('.docked-event-date-wrap').remove();
        $('.find-navbar-wrap').remove();
    }

    setTimeout(loadAndRemoveUnpopularEvents, 2000);
    
