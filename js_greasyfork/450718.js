// ==UserScript==
// @name        Use preferred language on steamcommunity.com and store.steampowered.com (Steam Store)
// @namespace   Violentmonkey Scripts
// @match       https://steamcommunity.com/*
// @match       https://store.steampowered.com/*
// @grant       none
// @version     1.0
// @author      -
// @description When going to steamcommunity.com or store.steampowered.com from search results, they often include the l get parameter, which sets the language to something random that your search engine picked up. This script removes that, so your preferred language, which you set in the browser, is used instead. 9/4/2022, 8:53:53 AM
// @downloadURL https://update.greasyfork.org/scripts/450718/Use%20preferred%20language%20on%20steamcommunitycom%20and%20storesteampoweredcom%20%28Steam%20Store%29.user.js
// @updateURL https://update.greasyfork.org/scripts/450718/Use%20preferred%20language%20on%20steamcommunitycom%20and%20storesteampoweredcom%20%28Steam%20Store%29.meta.js
// ==/UserScript==

// Update a query parameter in a url, or insert it if it's not there already.
// If del is true, delete the parameter.
var updateParam = function(url, key, value, del, URLEncoder) {
  if(key.length == 0) {
    // we can't deal with zero-length keys
    return url
  }
  
  if (URLEncoder === undefined) {
    URLEncoder = encodeURIComponent
  }
  
  key = URLEncoder(key)
  value = URLEncoder(value)

  const urlAndQuery = url.split('?')
  paramFound = false
  paramsNew = []
  if (urlAndQuery.length > 1) {
    // there was a query string (there was a '?' character)
    var params = urlAndQuery[1].split('&') // params looks like ['key1=value1', 'key2=value2', ...]
    let i = 0

    for (; i < params.length; i++) {
      if ((params[i] == "key") && (del == true)) { // for parameters that don't contain a '=' character, which is possible
        continue // do not copy this one over
      }
      
      if (params[i].startsWith(key + '=')) {
        if (del == true) {
          continue // do not copy this one over
        }
        let kv = params[i].split('=') // split "key=value" into ["key", "value"]
        kv[1] = value
        paramsNew.push(kv.join('='))
        paramFound = true
        continue
      }
      
      paramsNew.push(params[i]) // by default, copy everything over
    }
  }

  if ((paramFound == false) && (del !== true)) {
    paramsNew.push([key, value].join('='))
  }

  let newQuery = paramsNew.join('&')
  var newUri = urlAndQuery[0]
  if (newQuery.length > 0) { // there were query parameters, you're free to add a '?' character, so we won't get a dangling '?' at the end
    newUri = [urlAndQuery[0], newQuery].join('?')
  }
  return newUri
}

window.updateParam = updateParam;

location_ = window.location.toString(); // prevent a situation where that changes from under our feet while updateParam is running

if (location_.includes("l=")) { // is the language get parameter set?
  newLocation = updateParam(location_, "l", "", true);
  if (newLocation != location_) {
    window.location.replace(newLocation)
  }
}

