// ==UserScript==
// @name        Flatmates Plus
// @namespace   http://www.facebook.com/Tophness
// @include     https://flatmates.com.au/share-houses/*
// @require https://greasyfork.org/scripts/6217-gm-config/code/GM_config.js?version=23537
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @grant   GM_getValue
// @grant   GM_setValue
// @grant   GM_log
// @grant   GM_registerMenuCommand
// @version     1.1
// @noframes
// @run-at       document-idle
// @description Adds blacklist and whitelist filters to the FlatMates website, gets rid of early bird listings
// @downloadURL https://update.greasyfork.org/scripts/26912/Flatmates%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/26912/Flatmates%20Plus.meta.js
// ==/UserScript==
GM_config.init('Flatmates Plus Options', {
  'filters':
  {
    'label': 'Location Filters',
    'type': 'text',
    'default': 'blacktown'
  },
  'blacklist':
  {
    'label': 'Descriptions Blacklist',
    'type': 'text',
    'default': 'Not included in rent'
  },
  'whitelist':
  {
    'label': 'Descriprions Whitelist',
    'type': 'text',
    'default': 'unlimited-internet'
  },
  'homeaddress':
  {
    'label': 'Work Address (For distance calculating)',
    'type': 'text',
    'default': 'Central Station, Sydney, NSW'
  }
});
function opengmcf() {
  GM_config.open();
}
GM_registerMenuCommand('Flatmates Plus Options', opengmcf);
var stream = document.querySelector('div[data-react-class^="ListingResults"]');
var whitelist = GM_config.get('whitelist');
var blacklist = GM_config.get('blacklist');
if (whitelist.length != 0) {
  whitelist = whitelist.split(',');
}
if (blacklist.length != 0) {
  blacklist = blacklist.split(',');
}
function searchProp(id, listingel) {
  if (stream) {
    var arr = JSON.parse(stream.getAttribute('data-react-props')).listings;
    var findid = arr.indexOf('"id":' + id);
    if (findid != - 1) {
      var listing = arr.substring(findid);
      listing = listing.substring(0, arr.indexOf('},{'));
      return findProp(listing, listingel);
    } 
    else {
      ajaxsubmit('https://flatmates.com.au/P' + id, id, listingel);
    }
  }
}
function ajaxsubmit(url, id, listingel)
{
  var mygetrequest = new ajaxRequest();
  mygetrequest.onreadystatechange = function () {
    if (mygetrequest.readyState == 4) {
      if (mygetrequest.status == 200) {
        findPropAjax(mygetrequest.responseText, id, listingel);
      }
    }
  }
  mygetrequest.open('GET', url, true);
  mygetrequest.send(null);
}
function findPropAjax(arr, id, listingel) {
  var findid = arr.indexOf('PropertyListing');
  if (findid != - 1) {
    //var listing = arr.substring(findid);
    //listing = listing.substring(0, arr.indexOf('modal-placeholder'));
    //findProp(listing, prop);
    findProp(unescapeHtml(arr.substring(findid)), listingel);
  }
}
function findProp(listing, listingel) {
  if (whitelist.length > 0) {
    for (var i6 = 0; i6 < whitelist.length; i6++) {
      if (listing.indexOf(whitelist[i6]) == -1) {
        listingel.parentNode.removeChild(listingel);
      }
    }
  }
  if (blacklist.length > 0) {
    for (var i7 = 0; i7 < blacklist.length; i7++) {
      if (listing.indexOf(blacklist[i7]) != -1) {
        listingel.parentNode.removeChild(listingel);
      }
    }
  }
}
function ajaxRequest() {
  var activexmodes = [
    'Msxml2.XMLHTTP',
    'Microsoft.XMLHTTP'
  ];
  if (window.ActiveXObject) {
    for (var i = 0; i < activexmodes.length; i++) {
      try {
        return new ActiveXObject(activexmodes[i]);
      } 
      catch (e) {
      }
    }
  } 
  else if (window.XMLHttpRequest)
  return new XMLHttpRequest();
   else
  return false;
}
function unescapeHtml(safe) {
  return safe.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, '\'');
}
//function unescapeHtml(safe) {
//    return $('<div />').html(safe).text();
//}
var i = 0;
function filter(listingel) {
  i++;
  var id = listingel.getElementsByClassName('link');
  if (id.length != 0) {
    id = id[0].href.toString();
    id = id.substring(id.indexOf('/P') + 2);
    searchProp(id, listingel);
  }
  var earlybird = listingel.getElementsByClassName('home-listing-contact');
  if (earlybird.length != 0) {
    if (earlybird[0].innerText.indexOf('Free to Message') == -1) {
      listingel.parentNode.removeChild(listingel);
    }
  }
  var title = listingel.getElementsByClassName('listing-head');
  if (title.length != 0) {
    title = title[0].innerText.toString().toLowerCase();
    var filters = GM_config.get('filters');
    if (filters.length != 0) {
      filters = filters.split(',');
      for (var i2 = 0; i2 < filters.length; i2++) {
        if (title.indexOf(filters[i2].toLowerCase()) != -1) {
          listingel.parentNode.removeChild(listingel);
        }
      }
    }
    listingel.id = 'listing' + i;
    gdist(listingel.id, title);
  }
}
function gdist(listingel, title) {
  var etitle = document.createElement('div');
  etitle.innerHTML = title;
  etitle.id = 'etitle';
  etitle.style.visibility = 'hidden';
  var elistingel = document.createElement('div');
  elistingel.innerHTML = listingel;
  elistingel.id = 'elistingel';
  elistingel.style.visibility = 'hidden';
  var ehomeaddress = document.createElement('div');
  ehomeaddress.innerHTML = GM_config.get('homeaddress');
  ehomeaddress.id = 'ehomeaddress';
  ehomeaddress.style.visibility = 'hidden';
  document.body.appendChild(etitle);
  document.body.appendChild(elistingel);
  document.body.appendChild(ehomeaddress);
  exec(function () {
    var el = document.getElementById('elistingel').innerHTML.toString();
    var or = document.getElementById('ehomeaddress').innerHTML.toString();
    var des = document.getElementById('etitle').innerHTML.toString();
    var TransitOptions = {
      modes: [
        'TRAIN',
        'BUS'
      ]
    }
    var service = new google.maps.DistanceMatrixService;
    service.getDistanceMatrix({
      origins: [
        or
      ],
      destinations: [
        des
      ],
      travelMode: 'TRANSIT',
      transitOptions: TransitOptions,
      unitSystem: google.maps.UnitSystem.METRIC
    }, function (response, status) {
      if (status !== 'OK') {
        console.log('Error was: ' + status);
      } else {
        var originList = response.originAddresses;
        var destinationList = response.destinationAddresses;
        for (var i = 0; i < originList.length; i++) {
          var results = response.rows[i].elements;
          for (var j = 0; j < results.length; j++) {
            var newdiv = document.createElement('div');
            newdiv.innerHTML += results[j].duration.text + ' to ' + originList[i] + '<br>';
            document.getElementById(el).appendChild(newdiv);
          }
        }
      }
    });
  });
  document.body.removeChild(etitle);
  document.body.removeChild(elistingel);
  document.body.removeChild(ehomeaddress);
}
function exec(fn) {
  var script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = '(' + fn + ')();';
  document.body.appendChild(script); // run the script
  document.body.removeChild(script); // clean up
}
function removeit(id) {
  if (document.getElementById(id)) {
    document.getElementById(id).parentNode.removeChild(document.getElementById(id));
  }
}
function timefilter(listingel) {
  setTimeout(function () {
    filter(listingel[0]);
  }, 200);
}
waitForKeyElements('div.content-column', timefilter);
function waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
  var targetNodes,
  btargetsFound;
  if (typeof iframeSelector == 'undefined')
  targetNodes = $(selectorTxt);
   else
  targetNodes = $(iframeSelector).contents().find(selectorTxt);
  if (targetNodes && targetNodes.length > 0) {
    btargetsFound = true;
    /*--- Found target node(s).  Go through each and act if they
            are new.
        */
    targetNodes.each(function () {
      var jThis = $(this);
      var alreadyFound = jThis.data('alreadyFound') || false;
      if (!alreadyFound) {
        //--- Call the payload function.
        var cancelFound = actionFunction(jThis);
        if (cancelFound)
        btargetsFound = false;
         else
        jThis.data('alreadyFound', true);
      }
    });
  } 
  else {
    btargetsFound = false;
  } //--- Get the timer-control variable for this selector.

  var controlObj = waitForKeyElements.controlObj || {
  };
  var controlKey = selectorTxt.replace(/[^\w]/g, '_');
  var timeControl = controlObj[controlKey];
  //--- Now set or clear the timer as appropriate.
  if (btargetsFound && bWaitOnce && timeControl) {
    //--- The only condition where we need to clear the timer.
    clearInterval(timeControl);
    delete controlObj[controlKey]
  } 
  else {
    //--- Set a timer, if needed.
    if (!timeControl) {
      timeControl = setInterval(function () {
        waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector
        );
      }, 300
      );
      controlObj[controlKey] = timeControl;
    }
  }
  waitForKeyElements.controlObj = controlObj;
}
