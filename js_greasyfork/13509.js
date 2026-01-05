// ==UserScript==
// @name        Steam search filter for Linux
// @namespace   jones.herbert@gmail.com
// @description Always filter for linux
// @include     http://store.steampowered.com/search/*
// @include     https://store.steampowered.com/search/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13509/Steam%20search%20filter%20for%20Linux.user.js
// @updateURL https://update.greasyfork.org/scripts/13509/Steam%20search%20filter%20for%20Linux.meta.js
// ==/UserScript==

function LocationSearchPairs()
{
    if (location.search.length == 0)
    {
        return [];
    }
    else
    {
        var keyAndValue = location.search.substr(1).split('&');
        return keyAndValue.map(function (item)
                               {
                                   var splitResult = item.split('=', 2);
                                   if (splitResult.length == 2)
                                       return splitResult;
                                   return [item,''];
                               });
    }
}

var searchMap = new Map(LocationSearchPairs());
if (!searchMap.has('os') || searchMap.get('os') != "linux")
{
    searchMap.set('os', 'linux');

    var pairs = [];
    searchMap.forEach(function(value, key) {
        pairs.push(key + '=' + value);
    });
    location.search = '?' + pairs.join('&');
}
