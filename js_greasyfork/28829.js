// ==UserScript==
// @name         QuietStreets - Hotels.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.hotels.com/hotel/details.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28829/QuietStreets%20-%20Hotelscom.user.js
// @updateURL https://update.greasyfork.org/scripts/28829/QuietStreets%20-%20Hotelscom.meta.js
// ==/UserScript==



    var address = $("span[itemprop='address']").text();
    var search = encodeURIComponent(encodeURIComponent(address));
    vals = $("#hotel-map .map-widget:first").attr("style").split(/[=,&]/);
    lat = vals[1];
    lng = vals[2];
    iframe = '<iframe src="https://www.crimereports.com/home/?is_widget=true#!/dashboard?incident_types=Assault%252CAssault%2520with%2520Deadly%2520Weapon%252CBreaking%2520%2526%2520Entering%252CDisorder%252CDrugs%252CHomicide%252CKidnapping%252CLiquor%252COther%2520Sexual%2520Offense%252CProperty%2520Crime%252CProperty%2520Crime%2520Commercial%252CProperty%2520Crime%2520Residential%252CQuality%2520of%2520Life%252CRobbery%252CSexual%2520Assault%252CSexual%2520Offense%252CTheft%252CTheft%2520from%2520Vehicle%252CTheft%2520of%2520Vehicle&start_date=2017-03-25&end_date=2017-04-08&days=sunday%252Cmonday%252Ctuesday%252Cwednesday%252Cthursday%252Cfriday%252Csaturday&start_time=0&end_time=23&include_sex_offenders=false&zoom=16&lat=' +
        lat + '&lng=' + lng + '&current_tab=list&shapeIds=&shape_id=false&date_type=relative&searchText=' + search + '" width="768" height="586" style="border: 1px solid #28566c;"></iframe>';
    $("div.property-description").after(iframe);
    // Your code here...
