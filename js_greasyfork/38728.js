// ==UserScript==
// @name        WME Form Filler WI ojlaw hijack from ccm
// @description Use info from WME to automatically fill out related forms
// @namespace   https://greasyfork.org/en/users/142632
// @version     1.4.0
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @author      hijacked from ccm
// @license     MIT
// @run-at      document-end
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NUIzRDdFNzAwRTlGMTFFNkIyRDZGMzNERUFDMUM1NDgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NUIzRDdFNzEwRTlGMTFFNkIyRDZGMzNERUFDMUM1NDgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1QjNEN0U2RTBFOUYxMUU2QjJENkYzM0RFQUMxQzU0OCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1QjNEN0U2RjBFOUYxMUU2QjJENkYzM0RFQUMxQzU0OCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtdrqLIAAAOCSURBVHjatJdLaBNBGMdn81ITQ2mLNqlIKInGkpSgFooPpKGHIlZPJqgoIvQivooPfFUsxYNVW62KiuItPah48RaUSlFEaDzEqgeV+sBUxag1rZa8Nv6nfMKaZpNssx34kdnN7sx/5nvNCtFolAUCAW8ymdwtCIKZMZZh6jQBjIIL4EkikWA+n485HI7/HtLFYjHH0NDQnXQ6XQkBbAbaGrAsHo+PNDc3T/lTF4lEVouiWKnX62O4DgBRpYn1YBuoAkuxwBGNRjNVAP7QZjKTu/4V7FJ59euAEWjlHtBg2//ZXEOq1WpzaUyWz690Ms5jUDhZcrqm0+UYyAPuKxyH2zqohgC++j/gmcJxRot5yGAwFBTAr9+AtWrHIqKMBYNBFgqFmlKpVLympuax1+udIiBD9reUON/nLMcTtFotC4fDBoR8H5JSVV1dXVdjY+OxbAEpUA8GSxRQC95KrkUe6jABzwnbkQ/OmUwmPSJQzBbAw+YL6C5hcr7y72TO2TTeI9AA7oErELNBp9NF5HzgEziogtnNZM6j4BfoAfNBB0XZu1wCuAkWggMKJ7sBXmbd4xmwH1wHW8FKut/Hi5NcFIiUu/cpFNCfQ0ACHKGdOM0LHbx/DE54HJWX92XDMEy7oKRFc9z7SXSBBZiYWSyWs0aj8QMvzVarVTYRJckP1GhLwN7J7Ugkhv1+f4/H48mbiPi+LOKeWmIUtIKP4AxFAiNn/F0oE/KX5wB3iQLSoAmsp3sPwW0q+3kF8HL8HFgVTqrJqvn8upf6XMyhYotRhsKnVqEAXj9ikuv9wEX9m/mKWy4fWA6eKhSwEdylfjVop/4PcEJJOebbOAz2KDgdC1kr7ATl1O+gUFwMXhcjgNvuG7g8TQdcAXZQ/xW4RLvxXk6ARmagBhqoTHJvFdhCUSLX2iVjttH7h8GEEh9wggEwiw4mfirRA2Sia2CnzHjV9HuLCs5FOpwmlERBGU3Om41+50nCzJ4nFCM0eTftlI/XAJ778WHCeDou5kg2SNtXLzkXPAAnKbWeymOCzWCM+nwRGT55S0sLs9lszG635xQgSCphivq9OU7LnQUcUJRMzts4T0JozOl0Ci6Xq6AJ+GHhPGUuNRo/jJRTGZbPAyiLIZzRJrBVZXi4bQY+TsfNZvMLWQEVFRVht9u9CQJaIcCk8uf5GArQVRxAh+Ue+ivAAAY7DIf3WTuXAAAAAElFTkSuQmCC
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/38728/WME%20Form%20Filler%20WI%20ojlaw%20hijack%20from%20ccm.user.js
// @updateURL https://update.greasyfork.org/scripts/38728/WME%20Form%20Filler%20WI%20ojlaw%20hijack%20from%20ccm.meta.js
// ==/UserScript==

//this is a brutal hack job from crazycavemans's script. it's not authorized by him. i'm a total hack and i have no idea what i'm doing. this script seems to work but if it breaks or your computer goes up in flames it's not my fault. you have been warned

/*****************
To-Do:
        *Allow manual user entries
        *Update closure date to number of days to close
******************/

(function()
{
var WMEFFName = GM_info.script.name;
var WMEFFVersion = GM_info.script.version;
var WMEFFIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NUIzRDdFNzAwRTlGMTFFNkIyRDZGMzNERUFDMUM1NDgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NUIzRDdFNzEwRTlGMTFFNkIyRDZGMzNERUFDMUM1NDgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1QjNEN0U2RTBFOUYxMUU2QjJENkYzM0RFQUMxQzU0OCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1QjNEN0U2RjBFOUYxMUU2QjJENkYzM0RFQUMxQzU0OCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtdrqLIAAAOCSURBVHjatJdLaBNBGMdn81ITQ2mLNqlIKInGkpSgFooPpKGHIlZPJqgoIvQivooPfFUsxYNVW62KiuItPah48RaUSlFEaDzEqgeV+sBUxag1rZa8Nv6nfMKaZpNssx34kdnN7sx/5nvNCtFolAUCAW8ymdwtCIKZMZZh6jQBjIIL4EkikWA+n485HI7/HtLFYjHH0NDQnXQ6XQkBbAbaGrAsHo+PNDc3T/lTF4lEVouiWKnX62O4DgBRpYn1YBuoAkuxwBGNRjNVAP7QZjKTu/4V7FJ59euAEWjlHtBg2//ZXEOq1WpzaUyWz690Ms5jUDhZcrqm0+UYyAPuKxyH2zqohgC++j/gmcJxRot5yGAwFBTAr9+AtWrHIqKMBYNBFgqFmlKpVLympuax1+udIiBD9reUON/nLMcTtFotC4fDBoR8H5JSVV1dXVdjY+OxbAEpUA8GSxRQC95KrkUe6jABzwnbkQ/OmUwmPSJQzBbAw+YL6C5hcr7y72TO2TTeI9AA7oErELNBp9NF5HzgEziogtnNZM6j4BfoAfNBB0XZu1wCuAkWggMKJ7sBXmbd4xmwH1wHW8FKut/Hi5NcFIiUu/cpFNCfQ0ACHKGdOM0LHbx/DE54HJWX92XDMEy7oKRFc9z7SXSBBZiYWSyWs0aj8QMvzVarVTYRJckP1GhLwN7J7Ugkhv1+f4/H48mbiPi+LOKeWmIUtIKP4AxFAiNn/F0oE/KX5wB3iQLSoAmsp3sPwW0q+3kF8HL8HFgVTqrJqvn8upf6XMyhYotRhsKnVqEAXj9ikuv9wEX9m/mKWy4fWA6eKhSwEdylfjVop/4PcEJJOebbOAz2KDgdC1kr7ATl1O+gUFwMXhcjgNvuG7g8TQdcAXZQ/xW4RLvxXk6ARmagBhqoTHJvFdhCUSLX2iVjttH7h8GEEh9wggEwiw4mfirRA2Sia2CnzHjV9HuLCs5FOpwmlERBGU3Om41+50nCzJ4nFCM0eTftlI/XAJ778WHCeDou5kg2SNtXLzkXPAAnKbWeymOCzWCM+nwRGT55S0sLs9lszG635xQgSCphivq9OU7LnQUcUJRMzts4T0JozOl0Ci6Xq6AJ+GHhPGUuNRo/jJRTGZbPAyiLIZzRJrBVZXi4bQY+TsfNZvMLWQEVFRVht9u9CQJaIcCk8uf5GArQVRxAh+Ue+ivAAAY7DIf3WTuXAAAAAElFTkSuQmCC';
var forms = {};

function formfiller_bootstrap()
{
    formfiller_log("Running bootstrap");
    /*var bGreasemonkeyServiceDefined = false;
    try
    {
        if ("object" === typeof Components.interfaces.gmIGreasemonkeyService)
        {
            bGreasemonkeyServiceDefined = true;
        }
    }
    catch (err)
    {
        //Ignore
    }
    if ("undefined" === typeof unsafeWindow || ! bGreasemonkeyServiceDefined)
    {
        unsafeWindow = ( function ()
        {
            var dummyElem = document.createElement('p');
            dummyElem.setAttribute('onClick','return window;');
            return dummyElem.onclick ();
        } )();
    }*/

    if (typeof Waze.app === 'undefined' || !window.Waze.map)
    {
        setTimeout(formfiller_bootstrap,500);
        return;
    }
    formfiller_log("Starting init");
    formfiller_init();
}

function formfiller_init()
{
    // Check document elements are ready
    var userInfo = document.getElementById("user-info");
    if (userInfo === null)
    {
        window.setTimeout(formfiller_init,500);
        return;
    }
    var userTabs = document.getElementById("user-tabs");
    if (userTabs === null)
    {
        window.setTimeout(formfiller_init,500);
        return;
    }
    var navTab = userInfo.getElementsByTagName("ul");
    if (navTab.length === 0)
    {
        window.setTimeout(formfiller_init,500);
        return;
    }
    if (typeof navTab[0] === "undefined")
    {
        window.setTimeout(formfiller_init,500);
        return;
    }
    var tabContent = userInfo.getElementsByTagName("div");
    if (tabContent.length === 0)
    {
        window.setTimeout(formfiller_init,500);
        return;
    }
    if (typeof tabContent[0] === "undefined")
    {
        window.setTimeout(formfiller_init,500);
        return;
    }

    ff_addUserTab();
    ff_addFormBtn();
    var formFillerObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Mutation is a NodeList and doesn't support forEach like an array
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                var addedNode = mutation.addedNodes[i];

                // Only fire up if it's a node
                if (addedNode.nodeType === Node.ELEMENT_NODE) {
                    var selectionDiv = addedNode.querySelector('div.selection');

                    if (selectionDiv) {
                        ff_addFormBtn();
                    }
                }
            }
        });
    });
    formFillerObserver.observe(document.getElementById("edit-panel"), { childList: true, subtree: true });
    //Waze.selectionManager.events.register("selectionchanged", null, ff_addFormBtn);
    if (Waze.app.modeController) {
        Waze.app.modeController.model.bind('change:mode', function(model, modeId) {
            if (modeId == 0) {
                ff_addUserTab();
            }
        });
    }
    formfiller_log("Init done");
    return;
}

//Shamelessly copied from https://gist.github.com/CalebGrove/c285a9510948b633aa47
function abbrState(input, to)
{
    var states = [
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arizona', 'AZ'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
        ['Puerto Rico', 'PR'],
        ['Virgin Islands (U.S.)', 'VI']
    ];

    if (to == 'abbr'){
        input = input.replace(/\w+/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        for(i = 0; i < states.length; i++){
            if(states[i][0] == input){
                return(states[i][1]);
            }
        }
    } else if (to == 'name'){
        input = input.toUpperCase();
        for(i = 0; i < states.length; i++){
            if(states[i][1] == input){
                return(states[i][0]);
            }
        }
    }
}

function formfiller_log(message)
{
    if (typeof message === 'string')
        console.log('FormFiller: ' + message);
    else
        console.log('FormFiller: ', message);
}

function ff_getStreetName(sel)
{
    var streetName = "";

    for (i=0; i<sel.length; i++)
    {
        var newStreet = Waze.model.streets.get(sel[i].model.attributes.primaryStreetID);
        if (typeof newStreet === "undefined" || newStreet.name === null)
            newStreet = "No Name";
        if (streetName === "")
            streetName = newStreet.name;
        else if (streetName != newStreet.name)
            streetName += ", "+newStreet.name;
    }
    return streetName;
}

function ff_getState(sel)
{
    var stateName = "";

    for (i=0; i<sel.length; i++)
    {
        var cID = Waze.model.streets.get(sel[i].model.attributes.primaryStreetID).cityID;
        var sID = Waze.model.cities.get(cID).attributes.stateID;
        var newState = Waze.model.states.get(sID).name;
        
        if (newState === "")
        {
            sID = Waze.model.cities.get(cID).attributes.countryID;
            newState = Waze.model.countries.get(sID).name;
            formfiller_log('cID: '+cID);
            formfiller_log('sID: '+sID);
            formfiller_log('newState: '+newState);
        }
        
        if (stateName === "")
            stateName = newState;
        else if (stateName != newState)
        {
            stateName = "";
            break;
        }
    }
    return stateName;
}

function ff_getCity(sel)
{
    var cityName = "";
    for (i=0; i<sel.length; i++)
    {
        var cID = Waze.model.streets.get(sel[i].model.attributes.primaryStreetID).cityID;
        var newCity = Waze.model.cities.get(cID).attributes.name;
        if (cityName === "")
            cityName = newCity;
        else if (cityName != newCity)
        {
            cityName = "";
            break;
        }
    }
    return cityName;
}

function ff_getCounty(sel)
{
    var county = "";
    var center = Waze.map.center.clone().transform(Waze.map.projection.projCode,Waze.map.displayProjection.projCode);
    //formfiller_log("Getting county for "+center.lat.toString()+","+center.lon.toString());
    var xhr = new XMLHttpRequest();
    xhr.open("GET",'https://maps.googleapis.com/maps/api/geocode/json?latlng='+center.lat+','+center.lon,false);
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                var addrComps = response.results[0].address_components;
                for (comp = 0; comp < addrComps.length; comp++)
                {
                    if (addrComps[comp].types.indexOf("administrative_area_level_2") !== -1)
                    {
                        county = addrComps[comp].long_name;
                        //formfiller_log("ff_getCounty: "+county);
                        var countyIndex = (county.indexOf(" County") !== -1 ? county.indexOf(" County") : county.indexOf(" Parish"));
                        if (countyIndex !== -1)
                            county = county.slice(0,countyIndex);
                        break;
                    }
                }
            }
        }
    };
    xhr.send(null);
    return county;

    //Async call. Figure this out!
    /*return $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?latlng='+center.lat+','+center.lon, function(data) {
        if (data.status === "OK")
        {
            var addrComps = data.results[0].address_components;
            for (comp = 0; comp < addrComps.length; comp++)
            {
                if (addrComps[comp].types.indexOf("administrative_area_level_2") !== -1)
                {
                    county = addrComps[comp].long_name;
                    county = county.slice(0,county.indexOf(" County"));
                    formfiller_log("JSON func "+county);
                    break;
                }
            }
        }
        if (county === "")
            county = "Not found";
        formfiller_log("Got county");
        formfiller_log(county);
        return county;
    });*/
}

function ff_closureActive(sel)
{
    for (i=0; i<sel.length; i++)
    {
        if (sel[i].model.hasClosures())
            if (Waze.model.roadClosures.getByAttributes({segID: sel[i].model.attributes.id})[0].active)
                return true;
    }
    return false;
}

function ff_getClosureInfo(seg)
{
    var closureInfo = {
        direction: "",
        endDate: "",
        idFwd: "",
        idRev: "",
        reason: ""
    };
    var segID = seg.model.attributes.id;
    var closureList = Waze.model.roadClosures.getByAttributes({segID: segID,active: true});
    /*if (closureList.length > 2)
        return closureList;
    if (closureList.length == 2 && closureList[0].forward != closureList[1].forward)
        closureInfo.direction = "Two-Way";
    else
        closureInfo.direction = "One-Way";*/

    for (i=0; i<closureList.length; i++)
    {
        if (closureList[i].active === true)
        {
            if (closureInfo.endDate === "")
            {
                closureInfo.endDate = closureList[i].endDate;
            }
            else if (closureInfo.endDate > closureList[i].endDate)
            {
                closureInfo.endDate = closureList[i].endDate;
            }
            if (closureList[i].forward === true)
            {
                closureInfo.idFwd = closureList[i].id;
            }
            else
            {
                closureInfo.idRev = closureList[i].id;
            }
            if (closureInfo.reason === "")
            {
                closureInfo.reason = closureList[i].reason;
            }
        }
    }

    if (closureInfo.idFwd !== "" && closureInfo.idRev !== "")
        closureInfo.direction = "Two-Way";
    else
        closureInfo.direction = "One-Way";

    return closureInfo;
}

function ff_createPermalink(selection)
{
    //https://www.waze.com/editor/?env=usa&lon=-79.79248&lat=32.86150&layers=12709&zoom=5&mode=0&mapProblemFilter=1&mapUpdateRequestFilter=0&venueFilter=0&segments=504534141
    //https://www.waze.com/editor/?env=usa&lon=-79.79248&lat=32.86150&layers=12709&zoom=5&mode=0&mapProblemFilter=1&mapUpdateRequestFilter=0&venueFilter=0&venues=183632201.1836387542.3102948
    var permalink = "https://www.waze.com/editor/?", segIDs = [];
    var latLon = Waze.map.center.clone().transform(Waze.map.projection.projCode,Waze.map.displayProjection.projCode);
    var lat = latLon.lat, lon = latLon.lon;
    var env = Waze.location.code;
    var type = "segments";
    var zoom = Waze.map.zoom;

    /*if (zoom == 3)
        alert('Current zoom level (3) will not select street segments! If your selection includes street segments, please increase the zoom level');
    else if (zoom == 2)
        alert ('Current zoom level (2) will only select PS+ segments! If you have any other segment type selected, please increase the zoom level');
    else if (zoom <= 1)
    {
        alert ('Current zoom level ('+ zoom.toString() +') will not select any segments! Increase the zoom level before submitting!');
        return;
    }*/

    //To get lat and long centered on segment
    if (selection.length == 1)
    {
        latLon = selection[0].model.getCenter().clone();
        latLon.transform(Waze.map.projection.projCode,Waze.map.displayProjection.projCode);
        lat = latLon.y;
        lon = latLon.x;
    }

    var maxzoom = 2,
        zoomToRoadType = Waze.Config.segments.zoomToRoadType;
    for (i=0; i<selection.length; i++)
    {
        var segment = selection[i].model;
        if (segment.type != "segment")
            continue;
        segIDs.push(segment.attributes.id);
        if (zoomToRoadType[zoom] !== -1 && zoomToRoadType[zoom].indexOf(segment.attributes.roadType) === -1)
        {
            alert("This zoom level ("+ zoom.toString() +") cannot be used for this road type! Please increase your zoom:\n"+
                "Streets: 4+\nOther drivable and Non-drivable: 3+\nHighways and PS: 2+");
            formfiller_log("Zoom level not correct for segment: "+ zoom.toString() +" "+ segment.attributes.roadType.toString());
            return;
        }
    }
    permalink += "env="+env+"&lon="+lon+"&lat="+lat+"&zoom="+zoom.toString()+"&"+type+"="+segIDs.join();
    return permalink;
}

function ff_createFormLink(formIndx)
{
    var selection = Waze.selectionManager.selectedItems;
    var formInfo = {};
    var formDt = forms[formIndx];
    var formLink = formDt.url;
    if (selection.length === 0 || selection[0].model.type != "segment")
    {
        formfiller_log("No segments selected.");
        return;
    }

    formInfo.username = encodeURIComponent(Waze.loginManager.user.userName);
    formInfo.streetname = encodeURIComponent(ff_getStreetName(selection));
    formInfo.permalink = encodeURIComponent(ff_createPermalink(selection));
    if (formInfo.permalink === "undefined")
    {
        formfiller_log("No permalink generated");
        return;
    }
    formInfo.county = ff_getCounty(selection);

    formInfo.status = "REPORTED";
    formInfo.direction = "Two-Way";
    formInfo.reason = document.getElementById("ff-closure-reason").value;
    formInfo.endDate = document.getElementById("ff-closure-endDate").value +"+"+ document.getElementById("ff-closure-endTime").value;
    if (ff_closureActive(selection))
    {
        formInfo.status = "CLOSED";
        var closureInfo = ff_getClosureInfo(selection[0]);
        formInfo.direction = closureInfo.direction;
        formInfo.reason = encodeURIComponent(closureInfo.reason);
        formInfo.endDate = encodeURIComponent(closureInfo.endDate);
    }
    formInfo.notes = "Form+filled+by+"+WMEFFName+"+v"+WMEFFVersion;

    //Need to do this part better, works for now
    formLink += "?entry."+formDt.username+"="+formInfo.username;
    formLink += "&entry."+formDt.streetname+"="+formInfo.streetname;
    formLink += "&entry."+formDt.permalink+"="+formInfo.permalink;
    if (formDt.hasOwnProperty('state'))
    {
        formInfo.state = abbrState(ff_getState(selection),"abbr"); //Abbreviation
        formLink += "&entry."+formDt.state+"="+formInfo.state;
    }
    if (formDt.hasOwnProperty('city'))
    {
        formInfo.city = encodeURIComponent(ff_getCity(selection));
        formLink += "&entry."+formDt.city+"="+formInfo.city;
    }
    formLink += "&entry."+formDt.county+"="+formInfo.county;
    formLink += "&entry."+formDt.status+"="+formInfo.status;
    formLink += "&entry."+formDt.direction+"="+formInfo.direction;
    formLink += "&entry."+formDt.reason+"="+formInfo.reason;
    formLink += "&entry."+formDt.endDate+"="+formInfo.endDate;
    formLink += "&entry."+formDt.notes+"="+formInfo.notes;
    formfiller_log(formLink);
    return formLink;
}

function ff_addFormBtn()
{
    var selection = Waze.selectionManager.selectedItems;
    if (selection.length === 0 || selection[0].model.type != "segment")
    {
        //formfiller_log("No segments selected.");
        return;
    }
    if (document.getElementById("formfillerDiv"))
    {
        //formfiller_log("Div already created");
        return;
    }

    forms = [
    {
        //https://docs.google.com/forms/d/e/1FAIpQLSeiKY0KsO0xN69Asw77MARQFmxOy6zQXF-k2OQdWOfwtiCp7Q/viewform?entry.1204781462=ojlaw&entry.828228572=CLOSED&entry.1647952662=Test1&entry.1501712688=Test2&entry.2094306654=Test3&entry.1414240321=One-Way&entry.900957975=00/00/0000+00:00&entry.1051351191=Adams&entry.1093044522=Test4&entry.1540676081=City&entry.430378754=Test5&entry.1754051160=Test6&entry.172235277=Test7&entry.1722909714=Test8
        name: 'Wisconsin event/weather closures',
        url: 'https://docs.google.com/forms/d/e/1FAIpQLSeiKY0KsO0xN69Asw77MARQFmxOy6zQXF-k2OQdWOfwtiCp7Q/viewform',
        username: '1204781462',
        status: '828228572',
        permalink: '1754051160',
        direction: '1414240321',
        reason: '430378754',
        endDate: '900957975',
        streetname: '1647952662',
        fromStreet: '1501712688',
        toStreet: '2094306654',
        //state: '0',
        county: '1051351191',
        city: '1093044522',
        source: '172235277',
        notes: '1722909714',
    },
    /*{
        //https://docs.google.com/forms/d/e/1FAIpQLSeRVbj9DNsbP4GOeYr_6_2KjgS2TGi3f_Z5d9FVX1MmqMrZDQ/viewform?entry.1553765347=username&entry.1264424583=REPORTED&entry.1811077109=permalink&entry.792657790=Two-Way&entry.345142186=reason&entry.1102521735=2016-09-12+19:15&entry.2015424420=streetname&entry.1547375393=closure_from&entry.1335391716=closure_to&entry.1867193205=SC&entry.1714138473=county&entry.1803937317=source&entry.1648634142=notes
        name: 'Testing form weather closures',
        url: 'https://docs.google.com/forms/d/e/1FAIpQLSeRVbj9DNsbP4GOeYr_6_2KjgS2TGi3f_Z5d9FVX1MmqMrZDQ/viewform',
        username: '1553765347',
        status: '1264424583',
        permalink: '1811077109',
        direction: '792657790',
        reason: '345142186',
        endDate: '1102521735',
        streetname: '2015424420',
        fromStreet: '1547375393',
        toStreet: '1335391716',
        state: '1867193205',
        county: '1714138473',
        source: '1803937317',
        notes: '1648634142',
    },*/
    /*{
        //https://docs.google.com/forms/d/e/1FAIpQLScY_5WKyYTqvH1fdiBThqLO4DRIzFzgdBtBexw5-iKL_LOzBw/viewform?entry.1553765347=username&entry.1264424583=CLOSED&entry.1811077109=permalink&entry.792657790=Two-Way&entry.345142186=reason&entry.1102521735=2016-09-20+03:00&entry.2015424420=street+name&entry.1547375393=from+street&entry.1335391716=to+street&entry.1867193205=SC&entry.1714138473=county&entry.1803937317=source&entry.1648634142=notes
        name: 'USA Weather related closures',
        url: 'https://docs.google.com/forms/d/e/1FAIpQLScY_5WKyYTqvH1fdiBThqLO4DRIzFzgdBtBexw5-iKL_LOzBw/viewform',
        username: '1553765347',
        status: '1264424583',
        permalink: '1811077109',
        direction: '792657790',
        reason: '345142186',
        endDate: '1102521735',
        streetname: '2015424420',
        fromStreet: '1547375393',
        toStreet: '1335391716',
        state: '1867193205',
        county: '1714138473',
        source: '1803937317',
        notes: '1648634142',
    }*/
    ];

    var ffDiv = document.createElement("div"),
        ffMnu = document.createElement("select"),
        ffBtn = document.createElement("button");
    ffDiv.id = "formfillerDiv";
    var formWindowName  = "WME Form Filler result",
        formWindowSpecs = "resizable=1,menubar=0,scrollbars=1,status=0,toolbar=0";
    var editPanel, selElem, formLink;
    editPanel = document.getElementById("edit-panel");
    selElem = editPanel.getElementsByClassName("selection");

    for (i=0; i<forms.length; i++)
    {
        ffMnu.options.add(new Option(forms[i].name,i));
    }
    ffBtn.innerHTML = "Go to Form";
    ffBtn.onclick = function()
    {
        //alert(ffMnu.options[ffMnu.selectedIndex].value+": "+forms[ffMnu.options[ffMnu.selectedIndex].value].name);
        ff_saveSettings();
        formLink = ff_createFormLink(ffMnu.options[ffMnu.selectedIndex].value);
        if (typeof formLink === "undefined")
            return;

        if ($("#ff-open-in-tab").prop("checked"))
            window.open(formLink,"_blank");
        else
            window.open(formLink,formWindowName,formWindowSpecs);
    };
    ffDiv.appendChild(ffMnu);
    ffDiv.appendChild(ffBtn);
    selElem[0].appendChild(ffDiv);

    return;
}

function ff_loadSettings()
{
    var todayDate = new Date(),
        futureDate = new Date(),
        daysInFuture = 3;
    var today = todayDate.getFullYear() +"-"+ (todayDate.getMonth()+1<10 ? "0"+(todayDate.getMonth()+1) : todayDate.getMonth()+1) +"-"+ todayDate.getDate();
    futureDate.setDate(futureDate.getDate() + daysInFuture);

    var ffOpenInTab = localStorage.getItem("ff-open-in-tab");
    if (ffOpenInTab === "1")
        $("#ff-open-in-tab").trigger("click");
    var ffClosureReason = localStorage.getItem("ff-closure-reason");
    if (ffClosureReason !== null)
        $("#ff-closure-reason").val(ffClosureReason);
    var ffClosureEndDate = localStorage.getItem("ff-closure-endDate");
    if (ffClosureEndDate !== null && ffClosureEndDate !== "" && ffClosureEndDate >= today)
        $("#ff-closure-endDate").val(ffClosureEndDate);
    else
    {
        var closureDate = futureDate.getFullYear() +"-"+ (futureDate.getMonth()+1<10 ? "0"+(futureDate.getMonth()+1) : futureDate.getMonth()+1) +"-"+ (futureDate.getDate() < 10 ? "0"+futureDate.getDate() : futureDate.getDate());
        $("#ff-closure-endDate").val(closureDate);
    }
    var ffClosureEndTime = localStorage.getItem("ff-closure-endTime");
    if (ffClosureEndTime !== null && ffClosureEndTime !== "")
        $("#ff-closure-endTime").val(ffClosureEndTime);
    //formfiller_log("Settings loaded");
    return;
}

function ff_saveSettings()
{
    /*formfiller_log("Saving settings:\n"+$("#ff-open-in-tab").prop("checked")+
        "\n"+$("#ff-closure-reason").val()+
        "\n"+$("#ff-closure-endDate").val()+
        "\n"+$("#ff-closure-endTime").val());*/
    if ($("#ff-open-in-tab").prop("checked"))
        localStorage.setItem("ff-open-in-tab", "1");
    else
        localStorage.setItem("ff-open-in-tab", "0");
    localStorage.setItem("ff-closure-reason", $("#ff-closure-reason").val());
    localStorage.setItem("ff-closure-endDate", $("#ff-closure-endDate").val());
    localStorage.setItem("ff-closure-endTime", $("#ff-closure-endTime").val());
    //formfiller_log("Settings saved");
    return;
}

function ff_addUserTab()
{
    var userInfo = document.getElementById("user-info"),
        userTabs = document.getElementById("user-tabs"),
        navTabs = userTabs.getElementsByClassName("nav-tabs"),
        tabContent = userInfo.getElementsByClassName("tab-content");
    var ffTab = document.createElement("li"),
        ffPanel = document.createElement("div"),
        ffReason = document.createElement("div"),
        ffEndDate = document.createElement("div"),
        ffNewTabBox = document.createElement("input"),
        ffNewTabLabel = document.createElement("label"),
        ffTabInfo = document.createElement("div");

    ffTab.innerHTML = '<a title="Form Filler" href="#sidepanel-formfill" data-toggle="tab"><img class="fa" src="'+WMEFFIcon+'" width="15px" /></a>';
    ffPanel.id = "sidepanel-formfill";
    ffPanel.className = "tab-pane";

    ffTabInfo.innerHTML = '<b>'+ WMEFFName +'</b> v'+ WMEFFVersion;

    ffNewTabBox.id = "ff-open-in-tab";
    ffNewTabBox.type = "checkbox";
    ffNewTabBox.name = "ff_open_tab";

    ffNewTabLabel.innerHTML = "Open form in new tab";
    ffNewTabLabel.for = "ff_open_tab";

    ffReason.className = "form-group";
    ffReason.innerHTML = '<label class="control-label" for="ff_closure_reason">Closures reason:</label><div class="controls"><input id="ff-closure-reason" class="form-control" type="text" name="ff_closure_reason"></div>';

    ffEndDate.className = "form-group";
    ffEndDate.innerHTML = '<label class="control-label" for="ff_closure_endDate">Closures end:</label><div class="controls"><div class="date date-input-group input-group pull-left" style="width: 62%"><input id="ff-closure-endDate" class="form-control end-date" type="text" name="ff_closure_endDate"><span class="input-group-addon"><i class="fa fa-calendar"></i></span></div><div class="bootstrap-timepicker input-group style="width: 38%""><input id="ff-closure-endTime" class="end-time form-control" type="text" name="ff_closure_endTime"><span class="input-group-addon"><i class="fa fa-clock-o"></i></span></div></div>';

    ffPanel.appendChild(ffTabInfo);
    ffPanel.appendChild(ffNewTabBox);
    ffPanel.appendChild(ffNewTabLabel);
    ffPanel.appendChild(ffReason);
    ffPanel.appendChild(ffEndDate);
    navTabs[0].appendChild(ffTab);
    tabContent[0].appendChild(ffPanel);

    if (typeof $.fn.datepicker !== "undefined") {
      $("#ff-closure-endDate").datepicker({format:"yyyy-mm-dd", todayHighlight:true, autoclose:true});
    } else {
      if (typeof $.fn.daterangepicker !== "undefined") {
        $("#ff-closure-endDate").daterangepicker({singleDatePicker:true, locale:{format:"YYYY-MM-DD"}});
      }
    }

    if (typeof $.fn.timepicker !== "undefined") {
        $("#ff-closure-endTime").timepicker({template:false,defaultTime:"00:00",showMeridian:false});
    }

    ff_loadSettings();
    $("#ff-closure-reason").change(function() {ff_saveSettings();});
    $("#ff-closure-endDate").change(function() {ff_saveSettings();});
    $("#ff-closure-endTime").change(function() {ff_saveSettings();});
    $("#ff-open-in-tab").click(function() {ff_saveSettings();});
}

setTimeout(formfiller_bootstrap,2000);
})();
