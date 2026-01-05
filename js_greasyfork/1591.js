// ==UserScript==
// @name        Runkeeper - Display Weather for Activity
// @namespace   com.krozy.gm.runkeeper.weather
// @description On a runkeeper activity page, downloads GPX file to get LAT + LON, then uses weather underground to do geolookup and weather history. To live within constraints of dev accounts saves data to cookie to reuse later.  Requires an API KEY from weather underground which you can get info on and for free from http://www.wunderground.com/weather/api
// @include     http://runkeeper.com/user/*/activity/*
// @version     3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/1591/Runkeeper%20-%20Display%20Weather%20for%20Activity.user.js
// @updateURL https://update.greasyfork.org/scripts/1591/Runkeeper%20-%20Display%20Weather%20for%20Activity.meta.js
// ==/UserScript==
// IMPORTANT!!!! -- THIS VARIABLE MUST BE CHANGED TO YOUR API KEY VALUE TO SUCCESSFULLY USE THIS SCRIPT!
// Get your weather underground API Key at http://www.wunderground.com/weather/api
// You want the Developer Plan, WITH the History Add-On. The price is $0. You can do up to 10 calls per minute so don't review more then 5 of your activities in the span of a minute.
var WEATHER_UNDERGROUND_API_KEY = 'put your personal api key here';
// Specify desired precision for geolookups. (0=70 miles, 1=~7 miles, 2=~1 kilometer, 3=~100 meters). 
// For most cases, you want to use the default.  0 is good if all your runs are in Antarctica, or on Mars.
// 2 is more ideal if geological formations (like mountains) may cause great differences in weather between 1-6 miles.
// 3 is only useful if you are in an urban area with lots of weather stations and you dont mind the additional lookups.
// But to put this in context, the author lives in a suburb of Washington, DC, and uses 1.
var GEO_PRECISION = 1;
//alert(GEO_PRECISION);
function parseGPX4Weather(GPX4document)
{
    // With GPX file retrieved, lets get the first data point
    $trkpt = $(GPX4document) .find('trkseg') .find('trkpt') .filter(':first');
    // With that we can get the location...
    $lat = $trkpt.attr('lat');
    // decimal degrees
    $lon = $trkpt.attr('lon');
    // decimal degrees
    // And the date and time...
    $ptime = $trkpt.find('time') .text();
    // ISO format 2014-05-21T18:19:59Z << note that runkeeper is treating local as UTC
    // Format the weather date and time
    var weatherdate = $ptime.split('T') [0];
    var weatherhour = $ptime.split('T') [1].split(':') [0];
    weatherdate = weatherdate.split('-') [0] + weatherdate.split('-') [1] + weatherdate.split('-') [2];
    wug(weatherdate, weatherhour, $lat, $lon);
}
function geolookup(latitude, longitude)
{
    // See if we have cookie of nearby geo
    var location = loadGeo(latitude, longitude);
    // Yes, we have it, return it.
    if (location != null) return location;
    // No, lets lookup from weather underground
    // Using the location, lookup nearest location from weather underground
    var wuggeo = 'http://api.wunderground.com/api/' + WEATHER_UNDERGROUND_API_KEY + '/geolookup/q/' + latitude + ',' + longitude + '.json';
    $.ajax({
        url: wuggeo,
        dataType: 'jsonp',
        success: function (parsed_geo) {
            location = parsed_geo['location'];
            // Save it
            saveGeo(latitude, longitude, location);
            // and hand it back
            return location;
        }
    });
}
function wug(weatherdate, weatherhour, latitude, longitude)
{
    var wuglocation = geolookup(latitude, longitude);
    // Using geo location info, build url for pulling history...
    var requesturl = wuglocation['requesturl'];
    var prefix = 'US/';
    var suffix = '.html';
    var rpart = requesturl.substring(prefix.length, requesturl.length - suffix.length);
    var wughist = 'http://api.wunderground.com/api/' + WEATHER_UNDERGROUND_API_KEY + '/history_' + weatherdate + '/q/' + rpart + '.json';
    $.ajax({
        url: wughist,
        dataType: 'jsonp',
        success: function (parsed_hist) {
            // Look at the history observations
            var observations = parsed_hist['history']['observations'];
            var found = false;
            for (idx in observations)
            {
                if (!found)
                {
                    var observation = observations[idx];
                    if (observation['date']['hour'] == weatherhour)
                    {
                        found = true;
                        saveWeather(activityid, observation, wuglocation);
                        displayWeather(observation, false);
                        return ;
                    }
                }
            }
            if (!found)
            {
                alert('Count not find weather history in any of the observations for the hour indicated (' + weatherhour + ')');
            }
        }
    });
}
function geoprecis(v)
{
    // For purposes of this script, we don't need fine grained precision, ... 
    // 0 = ~69.4 miles
    // 1 = ~6.94 miles
    // 2 = ~.694 miles (~3664 ft / ~1 kilometer)
    // 3 = ~.069 miles (~366 ft / ~100 meters)
    // For most cases, 1 is sufficient, and will reduce the number of geo lookups you need to do
    // If you are in an area where weather is routinely dramatically different 5-10 miles away then go with 2 or 3.
    // as well as cookies that you'll need to store.
    var geoprecision = GEO_PRECISION;
    return Math.floor(v * Math.pow(10, geoprecision));
}
function getGeoCookieName(latitude, longitude)
{
    var c = 'geo' + geoprecis(latitude) + 'x' + geoprecis(longitude);
    c = c.replace('-', 'n');
    return c;
}
function saveGeo(latitude, longitude, location)
{
    var smalllocation = {
        'type': location['type'],
        'country': location['country'],
        'state': location['state'],
        'city': location['city'],
        'lat': location['lat'],
        'lon': location['lon'],
        'zip': location['zip'],
        'requesturl': location['requesturl']
    };
    var cookiename = getGeoCookieName(latitude, longitude);
    var cookievalue = JSON.stringify(smalllocation);
    setCookie(cookiename, cookievalue, 365);
}
function loadGeo(latitude, longitude)
{
    var cookiename = getGeoCookieName(latitude, longitude);
    var cookievalue = getCookie(cookiename);
    if (cookievalue == '') return null;
    var location = JSON.parse(cookievalue);
    return location;
}
function getWeatherCookieName(activityid)
{
    return 'aidw' + activityid;
}
function saveWeather(activityid, observation, location)
{
    var smallobservation = {
        'tempi': observation['tempi'],
        'hum': observation['hum'],
        'wspdi': observation['wspdi'],
        'wdire': observation['wdire'],
        'conds': observation['conds'],
        'icon': observation['icon'],
        'city': location['city'],
        'state': location['state']
    };
    var cookiename = getWeatherCookieName(activityid);
    var cookievalue = JSON.stringify(smallobservation);
    setCookie(cookiename, cookievalue, 365);
}
function loadWeather(activityid)
{
    var cookiename = getWeatherCookieName(activityid);
    var cookievalue = getCookie(cookiename);
    if (cookievalue == '') return null;
    var observation = JSON.parse(cookievalue);
    return observation;
}
function setCookie(cname, cvalue, exdays)
{
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = 'expires=' + d.toGMTString();
    document.cookie = cname + '=' + cvalue + '; ' + expires + '; path=/';
}
function getCookie(cname)
{
    var name = cname + '=';
    var ca = document.cookie.split(';');
    var v = '';
    for (var i = 0; i < ca.length; i++)
    {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0)
        {
            v = c.substring(name.length, c.length);
            return v;
        }
    }
    return v;
}
function deleteCookie(cname)
{
    setCookie(cname, '', 0);
}
var regetWeatherFlag = false;
function regetWeather()
{
    if (regetWeatherFlag) return ;
    regetWeatherFlag = true;
    fetchWeather();
}
function valEmpty(v)
{
    if (v == '') return true;
    if (v == 'undefined') return true;
    if (v == null) return true;
    return false;
}
function displayWeather(observation, isFromCookie)
{
    var temp = observation['tempi'];
    var humidity = observation['hum'];
    var windspeed = observation['wspdi'];
    var winddir = observation['wdire'];
    var conditions = observation['conds'];
    var icon = observation['icon'];
    if (valEmpty(icon)) {
        regetWeather();
        return ;
    }
    var city = observation['city'];
    if (valEmpty(city)) city = '';
    var state = observation['state'];
    if (valEmpty(state)) state = '';
    var weathersummary = ' ';
    var weatherelement = '<div class="mainColumnPadding clearfix">';
    weatherelement += '<a href="http://www.wunderground.com/?apiref=1ef1f4a0ad522a43">';
    weatherelement += '<img src="http://www.wunderground.com/logos/images/wundergroundLogo_4c.jpg" border="0" />';
    weatherelement += '</a>';
    if (!valEmpty(city) || !valEmpty(state))
    {
        weatherelement += '<p align="center">';
        weathersummary += ' in ';
        if (!valEmpty(city))
        {
            weatherelement += city;
            weathersummary += city;
            if (!valEmpty(state))
            {
                weatherelement += ', ';
                weathersummary += ', ';
            }
        }
        if (!valEmpty(state))
        {
            weatherelement += state;
            weathersummary += state;
        }
        weatherelement += '</p>';
    }
    //weatherelement += "<h4>Weather</h4>";

    weatherelement += '<p>Temperature: ' + temp + '&deg; Fahrenheit</p>';
    weathersummary += ' ' + temp + '&deg;F';
    weatherelement += '<p>Humidity: ' + humidity + ' %</p>';
    weathersummary += ', ' + humidity + '% humidity';
    weatherelement += '<p>Conditions: ' + conditions + '</p>';
    weathersummary += ', ' + conditions;
    weatherelement += '<p>Wind: ' + winddir + ' ' + windspeed + '</p>';
    weatherelement += '<img src="http://icons.wxug.com/i/c/k/' + icon + '.gif" border="0" />';
    if (isFromCookie)
    {
        weatherelement += '<p align="center">(loaded from cookie)</p>';
        //        weatherelement += "<p align=\"center\">(<a href=\"javascript:void(0);\" onclick=\"deleteCookie(getCookieName(activityid)));\">delete cookie</a>)</p>";
    }
    weatherelement += '</div>';
    // This is where we want to insert the data!!!
    $('#splitsBox') .prepend(weatherelement);
    $('.activitySubTitle') .append(weathersummary);    
}
function fetchWeather()
{
    // See if we can get from mapController, but we have to give it time to load..
    var waitForMap = 3000;
    setTimeout(function ()
    {
        if (mapController.model.map)
        {
            // Get location
            var ll = mapController.model.map.getCenter();
            var lat = ll.lat;
            var lng = ll.lng;
            // Get date and time of activity
            var dt = $('.activitySubTitle').text();
            // formulate as iso date.
            var weatheryear = dt.substr(8, 4);
            var weathermonth = dt.substr(0, 3) .toUpperCase();
            weathermonth = {
                JAN: '01',
                FEB: '02',
                MAR: '03',
                APR: '04',
                MAY: '05',
                JUN: '06',
                JUL: '07',
                AUG: '08',
                SEP: '09',
                OCT: '10',
                NOV: '11',
                DEC: '12'
            }
            [
                weathermonth
            ];
            var weatherday = dt.substr(4, 2);
            var weatherdate = weatheryear + '-' + weathermonth + '-' + weatherday;
            // and capture critical hour
            var weatherhour = dt.split('-') [1];
            weatherhour = weatherhour.split(':') [0];
            weatherhour = weatherhour.trim();
            weatherhour = parseInt(weatherhour);
            if (weatherhour < 12 && dt.substr(dt.length - 2, 1) == 'P') weatherhour = 12 + parseInt(weatherhour);
            if (weatherhour.length == 1) weatherhour = '0' + weatherhour;
            wug(weatherdate, weatherhour, lat, lng);
        } 
        else
        {
            // Map isn't loaded, lets try to get from GPX, but thats only available for us and not friends..
            // can only do this if we have export options (which is our own page)
            if ($('#exportOptions') .length)
            {
                // Now form the link to the GPX file that has LAT + LON
                var gpxfile = 'http://runkeeper.com/download/activity?activityId=' + activityid + '&downloadType=gpx';
                // Use the existing jQuery framework pulled into the page to retrieve the file
                $.ajax({
                    url: gpxfile,
                    dataType: 'xml',
                    success: parseGPX4Weather,
                    error: function () {
                        alert('Error: Unable to download GPX file to lookup location and time information!');
                    }
                });
            }
        }
    }, waitForMap);
}
// Look at url to get activity number

var activityid = location.pathname.split('/') [4];
// Load it from cookie if previously captured
var observation = loadWeather(activityid);
// If we have an observation from the cookie...
if (observation != null)
{
    // Show it! Saves 3 GET calls!
    displayWeather(observation, true);
} 
else
{
    fetchWeather();
}
