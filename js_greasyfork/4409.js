// ==UserScript==
// @name        pr0grammSurfer
// @author      CaptnUrMom
// @namespace   pr0surfer.pr0gramm
// @description Diashowscript for pr0gramm
// @include     *pr0gramm.com/*
// @version     1.2.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4409/pr0grammSurfer.user.js
// @updateURL https://update.greasyfork.org/scripts/4409/pr0grammSurfer.meta.js
// ==/UserScript==



/*
  thanks to greasyforks restrictions, i have to paste the raw code of the script in here....
*/


///////////////////////////////////////// https://gist.githubusercontent.com/arantius/3123124/raw/grant-none-shim.js /////////////////////////////////////////
/*
The MIT License (MIT)

Copyright (c) 2014 Anthony Lieuallen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


This script is intended to be used with @require, for Greasemonkey scripts
using "@grant none".  It emulates the GM_ APIs as closely as possible, using
modern browser features like DOM storage.

Scripts should plan to remove usage of GM_ APIs, but this shim offers a
short-term workaround to gain the benefits of running in the security
restriction free "@grant none" mode before that is completed.

Read the comments on each function to learn if its emulation is good enough
for your purposes.

NOT IMPLEMENTED:
 * GM_getResourceText
 * GM_openInTab
 * GM_registerMenuCommand
*/

function GM_addStyle(aCss) {
  'use strict';
  let head = document.getElementsByTagName('head')[0];
  if (head) {
    let style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.textContent = aCss;
    head.appendChild(style);
    return style;
  }
  return null;
}

const GM_log = console.log;

// This naive implementation will simply fail to do cross-domain requests,
// just like any javascript in any page would.
function GM_xmlhttpRequest(aOpts) {
  'use strict';
  let req = new XMLHttpRequest();

  __setupRequestEvent(aOpts, req, 'abort');
  __setupRequestEvent(aOpts, req, 'error');
  __setupRequestEvent(aOpts, req, 'load');
  __setupRequestEvent(aOpts, req, 'progress');
  __setupRequestEvent(aOpts, req, 'readystatechange');

  req.open(aOpts.method, aOpts.url, !aOpts.synchronous,
      aOpts.user || '', aOpts.password || '');
  if (aOpts.overrideMimeType) {
    req.overrideMimeType(aOpts.overrideMimeType);
  }
  if (aOpts.headers) {
    for (let prop in aOpts.headers) {
      if (Object.prototype.hasOwnProperty.call(aOpts.headers, prop)) {
        req.setRequestHeader(prop, aOpts.headers[prop]);
      }
    }
  }
  let body = aOpts.data ? aOpts.data : null;
  if (aOpts.binary) {
    return req.sendAsBinary(body);
  } else {
    return req.send(body);
  }
}

function __setupRequestEvent(aOpts, aReq, aEventName) {
  'use strict';
  if (!aOpts['on' + aEventName]) return;

  aReq.addEventListener(aEventName, function(aEvent) {
    let responseState = {
      responseText: aReq.responseText,
      responseXML: aReq.responseXML,
      readyState: aReq.readyState,
      responseHeaders: null,
      status: null,
      statusText: null,
      finalUrl: null
    };
    switch (aEventName) {
      case "progress":
        responseState.lengthComputable = aEvent.lengthComputable;
        responseState.loaded = aEvent.loaded;
        responseState.total = aEvent.total;
        break;
      case "error":
        break;
      default:
        if (4 != aReq.readyState) break;
        responseState.responseHeaders = aReq.getAllResponseHeaders();
        responseState.status = aReq.status;
        responseState.statusText = aReq.statusText;
        break;
    }
    aOpts['on' + aEventName](responseState);
  });
}

const __GM_STORAGE_PREFIX = [
    '', GM_info.script.namespace, GM_info.script.name, ''].join('***');

// All of the GM_*Value methods rely on DOM Storage's localStorage facility.
// They work like always, but the values are scoped to a domain, unlike the
// original functions.  The content page's scripts can access, set, and
// remove these values.  A
function GM_deleteValue(aKey) {
  'use strict';
  localStorage.removeItem(__GM_STORAGE_PREFIX + aKey);
}

function GM_getValue(aKey, aDefault) {
  'use strict';
  let val = localStorage.getItem(__GM_STORAGE_PREFIX + aKey)
  if (null === val && 'undefined' != typeof aDefault) return aDefault;
  return val;
}

function GM_listValues() {
  'use strict';
  let prefixLen = __GM_STORAGE_PREFIX.length;
  let values = [];
  let i = 0;
  for (let i = 0; i < localStorage.length; i++) {
    let k = localStorage.key(i);
    if (k.substr(0, prefixLen) === __GM_STORAGE_PREFIX) {
      values.push(k.substr(prefixLen));
    }
  }
  return values;
}

function GM_setValue(aKey, aVal) {
  'use strict';
  localStorage.setItem(__GM_STORAGE_PREFIX + aKey, aVal);
}

function GM_getResourceURL(aName) {
  'use strict';
  return 'greasemonkey-script:' + GM_info.uuid + '/' + aName;
}

/////////////////////////////////////////    pr0surfer    /////////////////////////////////////////
var pr0surfing = 0;
var playImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEXElEQVRogdVaPWgcRxQeRBDBmGBSCJNKRQoXwUVw4cIYY4wwLlK4UplChQoTVKhIEcylMMalCa5UpVRlgjDBBHGkOIzh4FjM3M77PlSoUCXMEYQIQhyXIrvn0WRmb2d2T1IePLRIqzfvb958894q1RJlWbYkIo8AbIrIK5LbAHYA7JDcFpFXxd8eZVm21Na6jcgYc1NEnpP8QHICoBaTnJD8ICLPjTE3z1XpTqezAOAxgHeFIlO2lIt6BvAOwONOp7MwV+UB3AUwcBX3cYoxAAYA7rauuNb6Ksmt2DQBcALgJCG9trTWV1tRXkRuAMhnePuUZBfATyRX8jxf1lovWg5YzPN8meRK8U4XwOmMaOQicqOR8nme3yM5qlB+H8BmSlXJsmwJwCbJ/YrUGuV5fi9JeQAPSB4HQv1RRJ7YXk4lrfWiiDwB8DGQUscAHkQJNcbcAnBke8Xyzo7W+npTxT2GXC/ODHsPlT+PjDG3YgQdBFLm6TxLXafTWSD5NLDPDmY6rqjxbz1hHIvI2rwUd0lE1kiOPSn1ttKBIrIW2Ewb56V8SSQ3nKo0ITkJOnIwGFwDcOgJ31adBfv9/pVWLVBKlWePk0qHg8Hgmu/lZ57UkbqKicjvJDe63e5nbRnQ7/evkBSPXs/OvFictCO3Hhtj7tddTER6JRwgebstI4wx9z2VaXTmpAaw7gnVm5iFRKRn/f+4gANftmEEgDce/danL5DsuWESkTuxBniqxiGA75uWXhG540mjnlLq3yO98Ji943XCIr0KbPPncDj8pokRALRTkcZZli0pEVn1HVgpBjghdsHZCYAXqdXKd8CJyKoC8NITnuhNGEghH7bZN8Z8l2DAbY+8l4rkruOtkxSQNiOFfM+/5Xm+XFe+1noRxd3C4l0FYM8JfR6rfGlAVQr5nkkek/yxrsPcewmAPVWiTivEu6kG1EmhAOs6uL/MFouPVAmaLMteNzEgJgIeuP5r1eWI5Gvn/bGyS2hTA2JTyPM8BvAiyoBLkkK1IIg3hQDsOZ5I3sQpXgfwF2uCQO8mJrnr/DK5jCZUoW1jzFd15FeV0XM9yAr5JLkSIz94kInIqsdDSVCihtf/FpGfu93u57HyGYISLpgrFkwCc1UpBOAPrfXXsXJLQgHm7Ao0LbmcH5yeADgQkdVUxQvZYThdWLfueg4JFxrH66ckfyH5RRPlC/2qLzT2ldLm2CulJfz9cDj8tqniSn26Ujo8+k/zl80v9T2SIwDrbTW/al/qlfrUVvFUj1ptFQA/tD06YkxbRalpR8wN14QX3NhySme4Q/i/by0qdba564G7l7u5W5LdXvfwXNvrgTXrt9dLQjHgCHhjLgOOwP6LH3CUZI+YAtjm8o6YSiqHfDMQ5imLIZ8x5mFoyGeMeQhnyFfBzYd8lgLTMWsMwxqzRnJ7Y1abUAy6a8DmpGfMa9Btk/upwYw0qHO5meC8PjVwyf3YI5Iv5mOPEF3U5zb/AMzNjuXkUQUPAAAAAElFTkSuQmCC';
var stopImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADrElEQVRogdVaPUskQRBtDAzEwEgMDS4wMpLDQERERAyN/AEGBgYGhodMIsYGRv4COQ4DMTBYjMRkYRmkma73MDAwEtlADEQWL7ievbbt2ZnZj9EtKHbZnemuj9fV1VWtVJ8ojuNJEVkHsCcixyRPAZwDOCd5KiLH9r/1OI4n+zVvT2SMmRWRQ5K3JN8BFGKS7yRvReTQGDNbqdBRFI0A2ABwYwVpsyNcqe8AbgBsRFE0MlDhASwCaPiCh7gbZQA0ACz2XXCt9TjJk7IwAfAK4LULeJ1orcf7IryIzABIcqz9RvIKwC+Sq0mSTGutRx0DjCZJMk1y1T5zBeAtxxuJiMz0JHySJEskmx2Evwew101UieN4EsAeyfsO0GomSbLUlfAAVki+ZLj6SUR2XCt3S1rrURHZAfCUAakXACulBjXGzAF4dq3iWOdcaz3Vq+ABRabsnuGuofTz2RgzV2aghwzI7A8y1EVRNEJyP2OdPeQazsb4y4AbWyKyNSjBfRKRLZKtAKQuOxpQRLYyFtNuVcKnRHLXi0rvJN8zDdloNCYAPAbcd1Kx7G1K9x4PSo+NRmMi9PBBADpSr9fHvkB2pZRS9Xp9jKQE5Dr48KDdaZt+PDbGLHeaAMBvAH96Za31j6w5jDHLgcjU/LBTA9gOuOoiz0IkW/3IhUTkZ46hLgLjb7uCXPtuEpGFIgoUzXE6cZ4CIrIQgNG1Uurflu5a0j6g84R3FejG6mU8oJRSALQXkVpxHE8qEdkMbVhFFagCQnauTxuciGwqAEcB98yX8cCgIWTnmg+8e6RI1jyrvBZN0qqEkNZ6FPZs4XBNAbjzXJ8UET5VoCoIKaUUvHMJgDsFm3U68KmVUaAqCNn5at67z59gQPKsrAJVQMjOd+Z5uhWCQSkFqoRQUIGhhxCAO88qpRZxlRAKLmKSNe/HUmG0Kgh1CqPDvZGJyGbAKoVTiaogxKxUwk/m7MCFk7mqIASbzLkRqF2P4jCn01a7bd8qKHigqQJCyDvQuEdKl7/TkdLj5qfiL4f5UK/U/7JKwMXDUVZRql0RC0WVLy1seaEzu0I49KVFpT4Wd104Wf7exd2U3PJ6gAdaXs+Ys3h5PSXYBkeGNQbS4MhYf+UbHCm5LaaMzej7tphSSpt8OenAG22TzxizltXkM8aswWvydeDem3yOAO02axmG02Ytyf1rs7oE2+juR/4T+o5BNbpd8q8aFM04s9iOUc1VA5/8yx4l+Wsue2TRV123+QsJoWd7ZFYqwgAAAABJRU5ErkJggg==';
var configImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABSklEQVRIibVWO66EMAxEaA/DGTjOVhxhy9yDmhq9E1BScIB4pnnn2IpXvGRlWCd8BJYsBSnxZzy2KYqdAmAiOZOcAUx73+01XkXjykl1ypiIPL33dfwehuEBoA9GZwDRQT8MwyPe897XIvLcivSlohxFpMW/zAmFiLQkR5XZKxn5Goazambiva9VFBqKQ2eSs4Z4ISTHDBy7lOSYK3CbShvAL8mOZBfOKXha03hgC4z03yLSOOfKeNc5V4pIA+Bt3IdmV2RPBaC3UhaRJpNxk4Cq//SJ7lALFh35WpxzZQ4uAFOxwZwuWbAgoSYLFmkttEGDEYccGO/n+yEKdfgUeQ3XVpGtRlsUOUqkqZFqlqbWfPqiqYrovkYLBRsvmEX2qIjD7oJZZA+728d1UeQXTgIWANi3cHQm1so0oPg5vDJTgiuXfsbJqd+WP9pX1s6n3GdsAAAAAElFTkSuQmCC';
jQuery(document).ready(function () {
  jQuery('body').append('<div id=\'pr0surfer\'><img src=\'' + playImg + '\' /></div>');
  jQuery('#pr0surfer').css('position', 'fixed').css('top', '10px').css('right', '10px').css('cursor', 'pointer');
  var value = "5";
  if (GM_getValue('pr0surferTime', 0) != "") {
    value = GM_getValue('pr0surferTime', 0);
  }
  jQuery('#pr0surfer').append('<br/><div id=\'pr0surferConf\' ></div>');
  jQuery('#pr0surferConf').hide();
  jQuery('#pr0surferConf').append('&nbsp;&nbsp;<img id="pr0surferConfButton" src="' + configImg + '" style="align: right;"/><br />');
  jQuery('#pr0surfer').after('<div id="pr0surferConfDiv"></div>');
  jQuery('#pr0surferConfDiv').css('position', 'fixed').css('top', '100px').css('right', '10px').css('cursor', 'pointer');
  jQuery("#pr0surferConfDiv").hide();
  jQuery('#pr0surferConfDiv').append('Pause in Sekunden: <input type=\'text\' style=\'width: 50px;\' id=\'pr0surferTime\' name=\'pr0surferTime\' value=\'' + value + '\' />');
  jQuery("#pr0surferConfButton").click(function() {
    jQuery("#pr0surferConfDiv").toggle();
  });
  jQuery('#pr0surferTime').change(function (event) { 
    GM_setValue('pr0surferTime', jQuery('#pr0surferTime').val());
  });
  var checked = '';
  if (GM_getValue('pr0surferStopWebm', 0) == 'checked') {
    checked = 'checked="checked" ';
  }
  jQuery('#pr0surferTime').after('<br/><span id="pr0surferStopWebmLabel">Bei WebM Inhalten anhalten? </span><input type=\'checkbox\' id=\'pr0surferStopWebm\' ' + checked + 'name=\'pr0surferStopWebm\' />');
  jQuery("#pr0surferStopWebmLabel").click(function(event) {
    jQuery("#pr0surferStopWebm").click();
  });
  jQuery('#pr0surferStopWebm').change(function (event) {
    if (jQuery('#pr0surferStopWebm').is(':checked')) {
      GM_setValue('pr0surferStopWebm', 'checked');
    } else {
      GM_setValue('pr0surferStopWebm', '');
    }
  });
  jQuery('#pr0surfer > img').click(function (event) {
    togglePr0surfer(false, true);
  });
  var hotKey = GM_getValue("pr0surferHotkey");
  if(hotKey == 'undefined' || hotKey == '' || hotKey == null) {
    hotKey = 110;
  }
  jQuery('#pr0surferConfDiv').append('<br />Hotkey neu setzen -> <button id="pr0surferConfHotkey">[ ' + hotKey + ' ]</button>');
  jQuery("#pr0surferConfHotkey").click(function(e) {
    jQuery("body").on("keydown.pr0surfer_configHotkey", function(event) {pr0surfer_editHotkey(event);});
  });
  jQuery('body').on("keydown.pr0surfer_hotKey", function (event) {
    if (event.keyCode == hotKey) {
      togglePr0surfer(false, true);
    }
  });
  jQuery('#pr0surfer').hover(function () {
    jQuery('#pr0surferConf').show();
  }, function () {
    if(!jQuery("#pr0surferConfDiv").is(":visible")) {
      jQuery('#pr0surferConf').hide();
    }
  });
});
function togglePr0surfer(stop, force) {
  stop = typeof stop !== 'undefined' ? stop : false;
  force = typeof force !== 'undefined' ? force : false;
  
  if(jQuery(".item-container").length == 0) {
    jQuery(".stream-row").children().eq(0).children().click();
  }
  
  if (stop || pr0surfing > 0) {
    pr0surfing = 0;
    jQuery('#pr0surfer > img').attr('src', playImg);
  } else {
    pr0surfing = pr0surfing + 1;
    jQuery('#pr0surfer > img').attr('src', stopImg);
    pr0surfer(force);
  }
}
function pr0surfer(force) {
  force = typeof force !== 'undefined' ? force : false;
  if (pr0surfing == 1) {
    if (jQuery('#pr0surferStopWebm').is(':checked'))
    {
      jQuery(document).ready(function () {
        var image = jQuery('.item-image').eq(0);
        if (!force && jQuery(image).prop('tagName') == 'VIDEO')
        {
          togglePr0surfer(true);
        } 
        else
        {
          jQuery('.stream-next').click();
          setTimeout(function () {
            pr0surfer();
          }, jQuery('#pr0surferTime').val() * 1000);
        }
      });
    } 
    else
    {
      jQuery('.stream-next').click();
      setTimeout(function () {
        pr0surfer();
      }, jQuery('#pr0surferTime').val() * 1000);
    }
  }
}
function pr0surfer_editHotkey(event) {
  var hotKey = event.keyCode;
  jQuery('body').off("keydown.pr0surfer_hotKey");
  jQuery('body').on("keydown.pr0surfer_hotKey", function (event) {
    if (event.keyCode == hotKey) {
      togglePr0surfer(false, true);
    }
  });
  GM_setValue("pr0surferHotkey", hotKey);
  jQuery("#pr0surferConfHotkey").text("[ " + hotKey + " ]");
  jQuery("body").off("keydown.pr0surfer_configHotkey");
  
}
