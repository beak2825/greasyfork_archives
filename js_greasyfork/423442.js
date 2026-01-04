// ==UserScript==
// @name         Elite singles show last login script
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Display additional data concerning online date/time
// @author       Nibbly
// @match        https://www.elitesingles.co.uk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423442/Elite%20singles%20show%20last%20login%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/423442/Elite%20singles%20show%20last%20login%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function formatDate(d)
    {
        var ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
        var mo = new Intl.DateTimeFormat('en', { month: 'long' }).format(d);
        var da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

        da = ("0" + da).slice(-2);

        var hours = ("0" + d.getHours()).slice(-2);
        var minutes = ("0" + d.getMinutes()).slice(-2);

        var toReturn = mo + ' ' + da + ' at ' + hours + ":" + minutes;

        var currentDate = new Date();
        var yesterdayDate = new Date();
        yesterdayDate.setDate(currentDate.getDate() - 1);

        if (currentDate.getDate() == d.getDate() && currentDate.getMonth() == d.getMonth() && currentDate.getFullYear() == d.getFullYear())
        {
            toReturn = "Today at " + hours + ":" + minutes;
        }
        else if (yesterdayDate.getDate() == d.getDate() && yesterdayDate.getMonth() == d.getMonth() && yesterdayDate.getFullYear() == d.getFullYear())
        {
            toReturn = "Yesterday at " + hours + ":" + minutes;
        }

        return toReturn;
    }

    function sortIt()
    {
        var request = new XMLHttpRequest();
    request.open('GET', '/rest/matches', true);

request.onload = function() {
  if (this.status >= 200 && this.status < 400) {
    // Success!
    var data = JSON.parse(this.response);

    var targetProfileId = window.location.href.match(/^.+\/client\/matches\/profile\/(\d+).*$/);

    if (targetProfileId == null || targetProfileId.length == 0)
    {
        return;
    }

    targetProfileId = targetProfileId[1];

    var matchedProfile = null;
    for (var i=0; i< data.length; i++)
    {
        if (data[i].userId == targetProfileId)
        {
            matchedProfile = data[i];
            break;
        }
    }

      if (matchedProfile != null)
      {
          var infoBox = document.getElementsByClassName('facts')[0];

          var newInfoRow = document.createElement("div");
          newInfoRow.className = 'fact in-row login-date';

          var icon = "<icon><svg class='svg-icon' width='500' height='500' viewBox='0 0 20 20'><path d='M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z'></path></svg></icon>";

          var isOnline = matchedProfile.isOnline;

          if (isOnline)
          {
              newInfoRow.innerHTML = icon + "<span title='Last Login: " + formatDate(new Date(matchedProfile.lastLoginTime)) + "' style='color: green; cursor: default'>Online Now</span>";
          }
          else
          {
              newInfoRow.innerHTML = icon + "<span>Last Login: " + formatDate(new Date(matchedProfile.lastLoginTime)) + "</span>";
          }

          infoBox.appendChild(newInfoRow);
      }

  } else {
    // We reached our target server, but it returned an error
    console.log('server error :(');
  }
};

request.onerror = function() {
  // There was a connection error of some sort
    console.log('connection error :(');
};

request.send();

    }

    function checkAndSort()
    {
        if (document.getElementsByClassName('facts').length > 0 && document.getElementsByClassName('login-date').length == 0 && window.location.href.contains('client/matches/profile'))
        {
            sortIt();
        }

        window.setTimeout(checkAndSort, 500);
    }

    // Page uses an SPA format and doesn't refresh, with elements that load dynamically, so we have to poll for elements to target to insert the data.
    window.setTimeout(checkAndSort, 500);

})();