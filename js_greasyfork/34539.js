// ==UserScript==
// @name WaniKani API
// @version 1.0
// @description  Tools for accessing the WaniKani API without having to use jQuery.
// @copyright 2017 jeshuam
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// ==/UserScript==

/**
 * WaniKani API utilities, for use within userscripts.
 * Just place this script in the @require section of the userscript header.
 */
(function() {
  // Common key to use for the API key.
  var API_RETREIVAL_KEY = 'jeshuam-wanikani-apikey';

  var WaniKaniAPI = window.WaniKaniAPI = {
    /**
     * Get the API key from storage and return it. If it doesn't exist, return null.
     */
    getAPIKey: function() {
      return GM_getValue(API_RETREIVAL_KEY, undefined);
    },

    /**
     * Insert the API key into storage. If you are deleting, rather use deleteAPIKey().
     */
    setAPIKey: function(apiKey) {
      GM_setValue(API_RETREIVAL_KEY, apiKey);
    },

    /**
     * Remove the API key from storage.
     */
    deleteAPIKey: function() {
      GM_deleteValue(API_RETREIVAL_KEY);
    },

    /**
     * Get the API base URL.
     */
    apiURL: function(action) {
      return 'https://www.wanikani.com/api/v1.2/user/' + WaniKaniAPI.getAPIKey() + '/' + action;
    },

    /**
     * Make an AJAX request to the given API url, and call `callback` when finished.
     */
    load: function(url, callback) {
      var xhr;

      // Get the XHR element first.
      if (typeof XMLHttpRequest !== 'undefined') {
        xhr = new XMLHttpRequest();
      } else {
        var versions = ["MSXML2.XmlHttp.5.0",
          "MSXML2.XmlHttp.4.0",
          "MSXML2.XmlHttp.3.0",
          "MSXML2.XmlHttp.2.0",
          "Microsoft.XmlHttp"
        ]

        for (var i = 0, len = versions.length; i < len; i++) {
          try {
            xhr = new ActiveXObject(versions[i]);
            break;
          } catch (e) {

          }
        }
      }

      // Function to execute when the state of the XHR request changes.
      xhr.onreadystatechange = function() {
        if (xhr.readyState < 4) {
          return;
        }

        if (xhr.status !== 200) {
          return;
        }

        if (xhr.readyState === 4) {
          callback(JSON.parse(xhr.responseText));
        }
      };

      // Start the request.
      xhr.open('GET', url, true);
      xhr.send('');
    }
  };

  // Register some GreaseMonkey commands.
  GM_registerMenuCommand('JeshuaM Scripts: Change API Key', function() {
    var apiKey = prompt('Please enter your API key.', WaniKaniAPI.getAPIKey() || '');
    if (apiKey !== null) {
      WaniKaniAPI.setAPIKey(apiKey);
      alert('JeshuaM Scripts: API Key Saved! ' + apiKey);
    }
  });

  GM_registerMenuCommand('JeshuaM Scripts: Reset API Key', function() {
    WaniKaniAPI.deleteAPIKey();
    alert('JeshuaM Scripts: API Key Deleted!');
  });
})();

//////////////////////////////
/////// Start Function ///////
//////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
  if (WaniKaniAPI.getAPIKey() === undefined) {
    // If we are on the account page, populate the API key (and maybe move back
    // to where we were before).
    if (window.location.href.indexOf('settings/account') >= 0) {
      key = document.querySelector('#user_api_key').value;
      WaniKaniAPI.setAPIKey(key);

      // From http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
      let getParameterByName = function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        var results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
      };

      // Notify the user, then redirect if necessary.
      var redirect = getParameterByName('prev');
      if (redirect) {
        window.alert('WANIKANI-API: API key set to ' + key + '! Going back to ' + redirect);
        window.location.href = redirect;
      } else {
        window.alert('WANIKANI-API: API key set to ' + key + '!');
      }
    } else {
      if (window.confirm('WANIKANI-API: Moving to settings page to fetch API key!')) {
        window.location.href = '/settings/account?prev=' + window.location.href;
      }
    }
  }
});
