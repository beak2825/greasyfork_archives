// ==UserScript==
// @name        WME Form Filler
// @description Use info from WME to automatically fill out related forms
// @namespace   https://greasyfork.org/users/6605
// @version     2024.04.29
// @homepage    https://github.com/WazeDev/WME-Form-Filler
// @supportURL  https://github.com/WazeDev/WME-Form-Filler/issues
// @include     https://www.waze.com/editor
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @author      crazycaveman
// @license     MIT
// @run-at      document-end
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NUIzRDdFNzAwRTlGMTFFNkIyRDZGMzNERUFDMUM1NDgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NUIzRDdFNzEwRTlGMTFFNkIyRDZGMzNERUFDMUM1NDgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1QjNEN0U2RTBFOUYxMUU2QjJENkYzM0RFQUMxQzU0OCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1QjNEN0U2RjBFOUYxMUU2QjJENkYzM0RFQUMxQzU0OCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtdrqLIAAAOCSURBVHjatJdLaBNBGMdn81ITQ2mLNqlIKInGkpSgFooPpKGHIlZPJqgoIvQivooPfFUsxYNVW62KiuItPah48RaUSlFEaDzEqgeV+sBUxag1rZa8Nv6nfMKaZpNssx34kdnN7sx/5nvNCtFolAUCAW8ymdwtCIKZMZZh6jQBjIIL4EkikWA+n485HI7/HtLFYjHH0NDQnXQ6XQkBbAbaGrAsHo+PNDc3T/lTF4lEVouiWKnX62O4DgBRpYn1YBuoAkuxwBGNRjNVAP7QZjKTu/4V7FJ59euAEWjlHtBg2//ZXEOq1WpzaUyWz690Ms5jUDhZcrqm0+UYyAPuKxyH2zqohgC++j/gmcJxRot5yGAwFBTAr9+AtWrHIqKMBYNBFgqFmlKpVLympuax1+udIiBD9reUON/nLMcTtFotC4fDBoR8H5JSVV1dXVdjY+OxbAEpUA8GSxRQC95KrkUe6jABzwnbkQ/OmUwmPSJQzBbAw+YL6C5hcr7y72TO2TTeI9AA7oErELNBp9NF5HzgEziogtnNZM6j4BfoAfNBB0XZu1wCuAkWggMKJ7sBXmbd4xmwH1wHW8FKut/Hi5NcFIiUu/cpFNCfQ0ACHKGdOM0LHbx/DE54HJWX92XDMEy7oKRFc9z7SXSBBZiYWSyWs0aj8QMvzVarVTYRJckP1GhLwN7J7Ugkhv1+f4/H48mbiPi+LOKeWmIUtIKP4AxFAiNn/F0oE/KX5wB3iQLSoAmsp3sPwW0q+3kF8HL8HFgVTqrJqvn8upf6XMyhYotRhsKnVqEAXj9ikuv9wEX9m/mKWy4fWA6eKhSwEdylfjVop/4PcEJJOebbOAz2KDgdC1kr7ATl1O+gUFwMXhcjgNvuG7g8TQdcAXZQ/xW4RLvxXk6ARmagBhqoTHJvFdhCUSLX2iVjttH7h8GEEh9wggEwiw4mfirRA2Sia2CnzHjV9HuLCs5FOpwmlERBGU3Om41+50nCzJ4nFCM0eTftlI/XAJ778WHCeDou5kg2SNtXLzkXPAAnKbWeymOCzWCM+nwRGT55S0sLs9lszG635xQgSCphivq9OU7LnQUcUJRMzts4T0JozOl0Ci6Xq6AJ+GHhPGUuNRo/jJRTGZbPAyiLIZzRJrBVZXi4bQY+TsfNZvMLWQEVFRVht9u9CQJaIcCk8uf5GArQVRxAh+Ue+ivAAAY7DIf3WTuXAAAAAElFTkSuQmCC
// @grant       none
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @downloadURL https://update.greasyfork.org/scripts/23367/WME%20Form%20Filler.user.js
// @updateURL https://update.greasyfork.org/scripts/23367/WME%20Form%20Filler.meta.js
// ==/UserScript==

/*global W, $, GM_info, WazeWrap */

(function () {
    "use strict";
    var WMEFFName = GM_info.script.name;
    var WMEFFVersion = GM_info.script.version;
    var WMEFFIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NUIzRDdFNzAwRTlGMTFFNkIyRDZGMzNERUFDMUM1NDgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NUIzRDdFNzEwRTlGMTFFNkIyRDZGMzNERUFDMUM1NDgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1QjNEN0U2RTBFOUYxMUU2QjJENkYzM0RFQUMxQzU0OCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1QjNEN0U2RjBFOUYxMUU2QjJENkYzM0RFQUMxQzU0OCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtdrqLIAAAOCSURBVHjatJdLaBNBGMdn81ITQ2mLNqlIKInGkpSgFooPpKGHIlZPJqgoIvQivooPfFUsxYNVW62KiuItPah48RaUSlFEaDzEqgeV+sBUxag1rZa8Nv6nfMKaZpNssx34kdnN7sx/5nvNCtFolAUCAW8ymdwtCIKZMZZh6jQBjIIL4EkikWA+n485HI7/HtLFYjHH0NDQnXQ6XQkBbAbaGrAsHo+PNDc3T/lTF4lEVouiWKnX62O4DgBRpYn1YBuoAkuxwBGNRjNVAP7QZjKTu/4V7FJ59euAEWjlHtBg2//ZXEOq1WpzaUyWz690Ms5jUDhZcrqm0+UYyAPuKxyH2zqohgC++j/gmcJxRot5yGAwFBTAr9+AtWrHIqKMBYNBFgqFmlKpVLympuax1+udIiBD9reUON/nLMcTtFotC4fDBoR8H5JSVV1dXVdjY+OxbAEpUA8GSxRQC95KrkUe6jABzwnbkQ/OmUwmPSJQzBbAw+YL6C5hcr7y72TO2TTeI9AA7oErELNBp9NF5HzgEziogtnNZM6j4BfoAfNBB0XZu1wCuAkWggMKJ7sBXmbd4xmwH1wHW8FKut/Hi5NcFIiUu/cpFNCfQ0ACHKGdOM0LHbx/DE54HJWX92XDMEy7oKRFc9z7SXSBBZiYWSyWs0aj8QMvzVarVTYRJckP1GhLwN7J7Ugkhv1+f4/H48mbiPi+LOKeWmIUtIKP4AxFAiNn/F0oE/KX5wB3iQLSoAmsp3sPwW0q+3kF8HL8HFgVTqrJqvn8upf6XMyhYotRhsKnVqEAXj9ikuv9wEX9m/mKWy4fWA6eKhSwEdylfjVop/4PcEJJOebbOAz2KDgdC1kr7ATl1O+gUFwMXhcjgNvuG7g8TQdcAXZQ/xW4RLvxXk6ARmagBhqoTHJvFdhCUSLX2iVjttH7h8GEEh9wggEwiw4mfirRA2Sia2CnzHjV9HuLCs5FOpwmlERBGU3Om41+50nCzJ4nFCM0eTftlI/XAJ778WHCeDou5kg2SNtXLzkXPAAnKbWeymOCzWCM+nwRGT55S0sLs9lszG635xQgSCphivq9OU7LnQUcUJRMzts4T0JozOl0Ci6Xq6AJ+GHhPGUuNRo/jJRTGZbPAyiLIZzRJrBVZXi4bQY+TsfNZvMLWQEVFRVht9u9CQJaIcCk8uf5GArQVRxAh+Ue+ivAAAY7DIf3WTuXAAAAAElFTkSuQmCC";
    var forms = [];

    function formfiller_bootstrap() {
        formfiller_log("Running bootstrap");

        if (typeof W.app === "undefined" || !window.W.map) {
            setTimeout(formfiller_bootstrap, 500);
            return;
        }
        formfiller_log("Starting init");
        formfiller_init();
    }

    /*function formfiller_waitForSegmentEditDiv(callback, callCount = 0) {
        const div = $('div.segment-edit-section');
        if (div.length) {
            callback();
        } else if (callCount < 30) { // try for about 3 seconds
            setTimeout(() => formfiller_waitForSegmentEditDiv(callback, ++callCount), 100);
        }
    }*/

    function formfiller_init() {
        // Check document elements are ready
        var userInfo = document.getElementById("user-info");
        if (userInfo === null) {
            window.setTimeout(formfiller_init, 500);
            return;
        }
        var userTabs = document.getElementById("user-tabs");
        if (userTabs === null) {
            window.setTimeout(formfiller_init, 500);
            return;
        }
        var navTab = userInfo.getElementsByTagName("ul");
        if (navTab.length === 0) {
            window.setTimeout(formfiller_init, 500);
            return;
        }
        if (typeof navTab[0] === "undefined") {
            window.setTimeout(formfiller_init, 500);
            return;
        }
        var tabContent = userInfo.getElementsByTagName("div");
        if (tabContent.length === 0) {
            window.setTimeout(formfiller_init, 500);
            return;
        }
        if (typeof tabContent[0] === "undefined") {
            window.setTimeout(formfiller_init, 500);
            return;
        }

        ff_addUserTab();
        ff_addFormBtn();

        W.selectionManager.events.on('selectionchanged', evt => {
            const selected = W.selectionManager.getSelectedDataModelObjects();
            if (selected.length && selected[0].type === 'segment') {
                $('#formfillerDiv').show();
            }
            else
            {
                $('#formfillerDiv').hide();
            }
        });

        if (W.app.modeController) {
            W.app.modeController.model.bind("change:mode", function (model, modeId) {
                if (modeId === 0) {
                    ff_addUserTab();
                }
            });
        }

        // Unit switched (imperial/metric)
        if (W.prefs) {
            W.prefs.on("change:isImperial", ff_addUserTab);
        }

        if (!W.selectionManager.getSelectedFeatures) {
            W.selectionManager.getSelectedFeatures = W.selectionManager.getSelectedItems;
        }
        formfiller_log("Init done");
        return;
    }

    //Shamelessly copied from https://gist.github.com/CalebGrove/c285a9510948b633aa47
    function abbrState(input, to) {
        var states = [
            ["ALABAMA", "AL"],
            ["ALASKA", "AK"],
            ["ARIZONA", "AZ"],
            ["ARKANSAS", "AR"],
            ["CALIFORNIA", "CA"],
            ["COLORADO", "CO"],
            ["CONNECTICUT", "CT"],
            ["DELAWARE", "DE"],
            ["DISTRICT OF COLUMBIA", "DC"],
            ["FLORIDA", "FL"],
            ["GEORGIA", "GA"],
            ["HAWAII", "HI"],
            ["IDAHO", "ID"],
            ["ILLINOIS", "IL"],
            ["INDIANA", "IN"],
            ["IOWA", "IA"],
            ["KANSAS", "KS"],
            ["KENTUCKY", "KY"],
            ["LOUISIANA", "LA"],
            ["MAINE", "ME"],
            ["MARYLAND", "MD"],
            ["MASSACHUSETTS", "MA"],
            ["MICHIGAN", "MI"],
            ["MINNESOTA", "MN"],
            ["MISSISSIPPI", "MS"],
            ["MISSOURI", "MO"],
            ["MONTANA", "MT"],
            ["NEBRASKA", "NE"],
            ["NEVADA", "NV"],
            ["NEW HAMPSHIRE", "NH"],
            ["NEW JERSEY", "NJ"],
            ["NEW MEXICO", "NM"],
            ["NEW YORK", "NY"],
            ["NORTH CAROLINA", "NC"],
            ["NORTH DAKOTA", "ND"],
            ["OHIO", "OH"],
            ["OKLAHOMA", "OK"],
            ["OREGON", "OR"],
            ["PENNSYLVANIA", "PA"],
            ["RHODE ISLAND", "RI"],
            ["SOUTH CAROLINA", "SC"],
            ["SOUTH DAKOTA", "SD"],
            ["TENNESSEE", "TN"],
            ["TEXAS", "TX"],
            ["UTAH", "UT"],
            ["VERMONT", "VT"],
            ["VIRGINIA", "VA"],
            ["WASHINGTON", "WA"],
            ["WEST VIRGINIA", "WV"],
            ["WISCONSIN", "WI"],
            ["WYOMING", "WY"],
            ["PUERTO RICO", "PR"],
            ["VIRGIN ISLANDS (U.S.)", "VI"]
        ];

        var i;
        if (to === "abbr") {
            input = input.toUpperCase();
            for (i = 0; i < states.length; i += 1) {
                if (states[i][0] === input) {
                    return (states[i][1]);
                }
            }
        } else if (to === "name") {
            input = input.toUpperCase();
            for (i = 0; i < states.length; i += 1) {
                if (states[i][1] === input) {
                    return (states[i][0]);
                }
            }
        }
    }

    function formfiller_log(message) {
        if (typeof message === "string") {
            console.log("FormFiller: " + message);
        } else {
            console.log("FormFiller: ", message);
        }
    }

    function ff_getStreetName(selection) {
        var streetName = [],
            i;

        for (i = 0; i < selection.length; i += 1) {
            var newStreet = W.model.streets.getObjectById(selection[i]._wmeObject.attributes.primaryStreetID);
            if (typeof newStreet === "undefined" || newStreet.attributes.name === null) {
                newStreet = { name: "No Name" };
            }
            if (streetName.indexOf(newStreet.attributes.name) === -1) {
                streetName.push(newStreet.attributes.name);
            }
        }
        return streetName.join(", ");
    }

    function ff_getState(selection) {
        var stateName = "",
            i;

        for (i = 0; i < selection.length; i += 1) {
            var cID = W.model.streets.getObjectById(selection[i]._wmeObject.attributes.primaryStreetID).attributes.cityID;
            var sID = W.model.cities.getObjectById(cID).attributes.stateID;
            var newState = W.model.states.getObjectById(sID).attributes.name;

            if (newState === "") {
                sID = W.model.cities.getObjectById(cID).attributes.countryID;
                newState = W.model.countries.getObjectById(sID).attributes.name;
                formfiller_log("cID: " + cID);
                formfiller_log("sID: " + sID);
                formfiller_log("newState: " + newState);
            }

            if (stateName === "") {
                stateName = newState;
            } else if (stateName !== newState) {
                stateName = "";
                break;
            }
        }
        return stateName;
    }

    function ff_getCity(selection) {
        var cityName = "",
            i;
        for (i = 0; i < selection.length; i += 1) {
            var cID = W.model.streets.getObjectById(selection[i]._wmeObject.attributes.primaryStreetID).attributes.cityID;
            var newCity = W.model.cities.getObjectById(cID).attributes.name;
            if (cityName === "") {
                cityName = newCity;
            } else if (cityName !== newCity) {
                cityName = "";
                break;
            }
        }
        return cityName;
    }

    function ff_getCounty(selection) {
        var county = "";
        // Disable county for now, currently broken
        /*var center = W.map.center.clone().transform(W.map.projection.projCode, W.map.displayProjection.projCode);
        //formfiller_log("Getting county for "+center.lat.toString()+","+center.lon.toString());
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + center.lat + "," + center.lon, false);
        xhr.onload = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    if (response.status !== "OK") {
                        formfiller_log(`Error getting county name (${response.status})`);
                        return county;
                    }
                    var addrComps = response.results[0].address_components;
                    var comp;
                    for (comp = 0; comp < addrComps.length; comp += 1) {
                        if (addrComps[comp].types.indexOf("administrative_area_level_2") !== -1) {
                            county = addrComps[comp].long_name;
                            //formfiller_log("ff_getCounty: "+county);
                            var countyIndex = (county.indexOf(" County") !== -1 ? county.indexOf(" County") : county.indexOf(" Parish"));
                            if (countyIndex !== -1) {
                                county = county.slice(0, countyIndex);
                            }
                            break;
                        }
                    }
                }
            }
        };
        xhr.send(null);*/
        return county;
    }

    function ff_closureActive(selection) {
        var i;
        for (i = 0; i < selection.length; i += 1) {
            if (selection[i].hasClosures) {
                if (W.model.roadClosures.active) {
                    return true;
                }
            }
        }
        return false;
    }

    function ff_getClosureInfo(seg) {
        var closureInfo = {
            closedDir: "",
            endDate: "",
            idFwd: "",
            idRev: "",
            closedReason: ""
        };
        var segID = seg._wmeObject.attributes.id;
        var clf = W.model.roadClosures.getObjectArray();
        var closureList = clf.filter((cl) => cl.attributes.segID === segID);
        var i;

        for (i = 0; i < closureList.length; i += 1) {
            if (closureList[i].attributes.closureStatus === 'ACTIVE') {
                if (closureInfo.endDate === "") {
                    closureInfo.endDate = closureList[i].attributes.endDate;
                } else if (closureInfo.endDate > closureList[i].attributes.endDate) {
                    closureInfo.endDate = closureList[i].attributes.endDate;
                }
                if (closureList[i].attributes.forward === true) {
                    closureInfo.idFwd = closureList[i].attributes.id;
                } else {
                    closureInfo.idRev = closureList[i].attributes.id;
                }
                if (closureInfo.closedReason === "") {
                    closureInfo.closedReason = closureList[i].attributes.reason;
                }
            }
        }

        if (closureInfo.idFwd !== "" && closureInfo.idRev !== "") {
            closureInfo.closedDir = "Two-Way";
        } else {
            closureInfo.closedDir = "One-Way";
        }

        return closureInfo;
    }

    function ff_createPermalink(selection) {
        //https://www.waze.com/editor/?env=usa&lon=-79.79248&lat=32.86150&layers=12709&zoom=5&mode=0&mapProblemFilter=1&mapUpdateRequestFilter=0&venueFilter=0&segments=504534141
        //https://www.waze.com/editor/?env=usa&lon=-79.79248&lat=32.86150&layers=12709&zoom=5&mode=0&mapProblemFilter=1&mapUpdateRequestFilter=0&venueFilter=0&venues=183632201.1836387542.3102948
        var permalink = "https://www.waze.com/editor/?",
            segIDs = [];

        var latLon = WazeWrap.Geometry.ConvertTo4326(W.map.getOLMap().center.lon, W.map.getOLMap().center.lat)
        var lat = latLon.lat,
            lon = latLon.lon;
        var env = W.location ? W.location.code : W.app.getAppRegionCode();
        var type = "segments";
        var zoom = W.map.getOLMap().zoom;
        var zoomToRoadType = function (e) {
            switch (e) {
                case 0:
                case 1:
                    return [];
                case 2:
                    return [2, 3, 4, 6, 7, 15];
                case 3:
                    return [2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                default:
                    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
            }
        };
        var i;

        //To get lat and long centered on segment
        if (selection.length === 1) {
            latLon = structuredClone(selection[0]._wmeObject.getCenterLonLat());
            lat = latLon.lat;
            lon = latLon.lon;
        }

        for (i = 0; i < selection.length; i += 1) {
            var segment = selection[i]._wmeObject;
            if (segment.type === "segment") {
                segIDs.push(segment.attributes.id);
                if (zoomToRoadType(zoom) === 0 || zoomToRoadType(zoom).indexOf(segment.attributes.roadType) === -1) {
                    alert("This zoom level (" + zoom.toString() + ") cannot be used for this road type! Please increase your zoom:\n" +
                        "Streets: 4+\nOther drivable and Non-drivable: 3+\nHighways and PS: 2+");
                    formfiller_log("Zoom level not correct for segment: " + zoom.toString() + " " + segment.attributes.roadType.toString());
                    return;
                }
            }
        }
        permalink += "env=" + env + "&lon=" + lon + "&lat=" + lat + "&zoomLevel=" + zoom.toString() + "&" + type + "=" + segIDs.join();
        return permalink;
    }

    function ff_getLastEditor(selection) {
        var eID;
        var editorNames = "";
        var newEdName = "";
        //selection[0].model.attributes.updatedBy;
        selection.forEach(function (selected) {
            eID = selected.model.attributes.updatedBy;
            if (typeof eID !== "undefined") {
                formfiller_log("Unable to get updatedBy on " + selected.model.attributes.id);
                eID = selected.model.attributes.createdBy;
            }
            newEdName = W.model.users.getObjectById(eID).userName;
            if (editorNames.indexOf(newEdName) === -1) {
                editorNames += ", " + newEdName;
            }

        });
        editorNames = editorNames.substr(2);
        return editorNames;
    }

    function ff_createFormLink(formSel) {
        var selection = W.selectionManager.getSelectedFeatures();
        var formValues = {};
        var formFields = formSel.fields;
        var formLink = formSel.url + "?entry.";
        var formArgs = [];
        if (selection.length === 0 || selection[0].featureType !== "segment") {
            formfiller_log("No segments selected.");
            return;
        }

        /*Fields expected:
        username
        permalink
        closedDir
        closureStatus
        closedReason
        endDate
        streetname
        fromStreet
        toStreet
        stateabbr
        county
        city
        source
        notes
         */

        Object.keys(formFields).forEach((key, index) => {
            switch (key) {
                case "username":
                    formValues[key] = W.loginManager.user.attributes.userName;
                    break;
                case "permalink":
                    formValues[key] = ff_createPermalink(selection);
                    if (typeof formValues.permalink === "undefined") {
                        formfiller_log("No permalink generated");
                        return;
                    }
                    break;
                case "streetname":
                    formValues[key] = W.model.hasStates ? ff_getStreetName(selection) : "";
                    break;
                case "editorName":
                    formValues[key] = ff_getLastEditor(selection);
                    break;
                case "stateabbr":
                    formValues[key] = abbrState(ff_getState(selection), "abbr");
                    break;
                case "state":
                    formValues[key] = ff_getState(selection);
                    break;
                case "county":
                    formValues.county = ff_getCounty(selection);
                    break;
                case "city":
                    formValues[key] = ff_getCity(selection);
                    break;
                case "notes":
                    formValues[key] = "Form filled by " + WMEFFName + " v" + WMEFFVersion;
                    break;
                case "closureStatus":
                    if (selection[0].featureType === "segment") {
                        if (ff_closureActive(selection)) {
                            formValues.closureStatus = "CLOSED";
                            var closureInfo = ff_getClosureInfo(selection[0]);
                            formValues.closedDir = closureInfo.closedDir;
                            formValues.closedReason = closureInfo.closedReason;
                            formValues.endDate = closureInfo.endDate;
                        } else {
                            formValues.closureStatus = "REPORTED";
                            formValues.closedDir = "Two-Way";
                            formValues.closedReason = document.getElementById("ff-closure-reason").value;
                            formValues.endDate = document.getElementById("ff-closure-endDate").value + "+" + document.getElementById("ff-closure-endTime").value;
                        }
                    }
                    break;
                default:
                    formfiller_log("Nothing defined for " + key);
                    break;
            }

            //Add entry to form URL, if there's something to add
            if (typeof formValues[key] !== "undefined" && formValues[key] !== "") {
                formArgs[index] = formFields[key] + "=" + encodeURIComponent(formValues[key]);
            }
        });
        formLink += formArgs.join("&entry.");

        formfiller_log(formLink);
        return formLink;
    }

    function ff_addFormBtn() {
        var selection = W.selectionManager.getSelectedFeatures();
        var ffDiv = document.createElement("div"),
            ffMnu = document.createElement("select"),
            ffBtn = document.createElement("button");
        var formWindowName = "WME Form Filler result",
            formWindowSpecs = "resizable=1,menubar=0,scrollbars=1,status=0,toolbar=0";
        var formLink;
            ffDiv.id = "formfillerDiv";
        /*if (selection.length === 0 || selection[0].model.type !== "segment") {
            //formfiller_log("No segments selected.");
            return;
        }*/
        if (document.getElementById("formfillerDiv")) {
            //formfiller_log("Div already created");
            return;
        }

        forms = [{
            //https://docs.google.com/forms/d/e/1FAIpQLScxs_FMsjcEeTD0gjWUahb3Qb0XjeB2K32n_vWLm_HV2fUweQ/viewform?entry.1553765347=username&entry.1264424583=CLOSED&entry.1811077109=permalink&entry.792657790=Two-Way&entry.345142186=reason&entry.1102521735=2016-09-20+03:00&entry.2015424420=street+name&entry.1547375393=from+street&entry.1335391716=to+street&entry.1867193205=NSW&entry.1714138473=county&entry.1803937317=source&entry.1648634142=notes
            name: "AUS VEOC closures",
            url: "https://docs.google.com/forms/d/e/1FAIpQLScxs_FMsjcEeTD0gjWUahb3Qb0XjeB2K32n_vWLm_HV2fUweQ/viewform",
            fields: {
                username: "1553765347",
                closureStatus: "1264424583",
                permalink: "1811077109",
                closedDir: "792657790",
                closedReason: "345142186",
                endDate: "1102521735",
                streetname: "2015424420",
                fromStreet: "1547375393",
                toStreet: "1335391716",
                stateabbr: "1867193205",
                county: "1714138473",
                source: "1803937317",
                notes: "1648634142"
            }
        }, {
            //https://docs.google.com/forms/d/e/1FAIpQLScX8hlXopzXTLEPUpXwdXBWF6qFmz1asKtX5IOy9gbdsfMmTA/viewform?entry.1553765347=username&entry.1264424583=CLOSED&entry.1811077109=permalink&entry.792657790=Two-Way&entry.345142186=reason&entry.1102521735=2016-09-20+03:00&entry.2015424420=street+name&entry.1547375393=from+street&entry.1335391716=to+street&entry.1867193205=SC&entry.1714138473=county&entry.1803937317=source&entry.1648634142=notes
            name: "USA VEOC closures",
            url: "https://docs.google.com/forms/d/e/1FAIpQLScX8hlXopzXTLEPUpXwdXBWF6qFmz1asKtX5IOy9gbdsfMmTA/viewform",
            fields: {
                username: "1553765347",
                closureStatus: "1264424583",
                permalink: "1811077109",
                closedDir: "792657790",
                closedReason: "345142186",
                endDate: "1102521735",
                streetname: "2015424420",
                fromStreet: "1547375393",
                toStreet: "1335391716",
                stateabbr: "1867193205",
                county: "1714138473",
                source: "1803937317",
                notes: "1648634142"
            }
        }, {
            name: "US Jane TTS Pronunciation",
            url: "https://docs.google.com/forms/d/e/1FAIpQLSeuCmC0zy7GEQDJQP5R8dndxYhXCkqzadrPgP89BvatVl1bdg/viewform",
            fields: {
                username: "324217272",
                state: "1065619417",
                issue: "1086951221",
                streetname: "1163516948",
                incorrectp: "1191620241",
                correctp: "1649051316",
                permalink: "2028167849",
                instructions: "2120232339",
                comments: "1917392591"
            }
        }, {
            //https://docs.google.com/forms/d/e/1FAIpQLSff7nsBw8qxCojBdxrjTPl6tercqyyzGy92Vif_SBdHkYDchw/viewform?entry.1204781462=Reporter&entry.828228572=Reported&entry.1647952662=Street+name+&entry.1501712688=From+street+&entry.2094306654=To+street+&entry.1414240321=Two-Way&entry.900957975=10/27/2016+00:00&entry.1051351191=Adams&entry.1093044522=City+&entry.1540676081=IDOT&entry.430378754=Reason+&entry.1754051160=Permalink+&entry.172235277=Source+&entry.1722909714=Notes+
            name: "IL closures",
            url: "https://docs.google.com/forms/d/e/1FAIpQLSff7nsBw8qxCojBdxrjTPl6tercqyyzGy92Vif_SBdHkYDchw/viewform",
            fields: {
                username: "1204781462",
                closureStatus: "828228572",
                permalink: "1754051160",
                closedDir: "1414240321",
                closedReason: "430378754",
                endDate: "900957975",
                streetname: "1647952662",
                fromStreet: "1501712688",
                toStreet: "2094306654",
                county: "1051351191",
                city: "1093044522",
                source: "172235277",
                notes: "1722909714"
            }
        }, {
            //https://docs.google.com/forms/d/e/1FAIpQLSd8wouEY6DhA4ifMb_Ub0rEE7X4TCM7WIEqFiT4Lq1hySxEWw/viewform?entry.1553765347=username&entry.1264424583=CLOSED&entry.1811077109=permalink&entry.792657790=Two-Way&entry.345142186=reason&entry.1102521735=2016-09-20+03:00&entry.2015424420=street+name&entry.1547375393=from+street&entry.1335391716=to+street&entry.1867193205=OK&entry.1714138473=county&entry.1803937317=source&entry.1648634142=notes
            name: "OK closures",
            url: "https://docs.google.com/forms/d/e/1FAIpQLSd8wouEY6DhA4ifMb_Ub0rEE7X4TCM7WIEqFiT4Lq1hySxEWw/viewform",
            fields: {
                username: "1553765347",
                closureStatus: "1264424583",
                permalink: "1811077109",
                closedDir: "792657790",
                closedReason: "345142186",
                endDate: "1102521735",
                streetname: "2015424420",
                fromStreet: "1547375393",
                toStreet: "1335391716",
                stateabbr: "1867193205",
                county: "1714138473",
                source: "1803937317",
                notes: "1648634142"
            }
        }, {
            //https://docs.google.com/forms/d/e/1FAIpQLScwEyNVqiHHdFjc4hr82zlFXW2bAsff9pqIzFUqT8Evh6YROg/viewform?usp=pp_url&entry.1553765347=kwrigh01&entry.1264424583=CLOSED&entry.1811077109=https://www.waze.com/editor/?env%3Dusa%26lon%3D-79.99979%26lat%3D37.89567%26zoom%3D5%26segments%3D82457306,82457308,82457338&entry.792657790=Two-Way&entry.345142186=Bridge+Work&entry.1102521735=2018-07-01+23:59&entry.2015424420=Morris+Hollow+Rd&entry.1547375393=1st&entry.1335391716=2nd&entry.1867193205=VA&entry.1714138473=Alleghany&entry.1803937317=VDOT&entry.1648634142=Test+Closure
            name: "VA Closures",
            url: "https://docs.google.com/forms/d/e/1FAIpQLScwEyNVqiHHdFjc4hr82zlFXW2bAsff9pqIzFUqT8Evh6YROg/viewform",
            fields: {
                username: "1553765347",
                closureStatus: "1264424583",
                permalink: "1811077109",
                closedDir: "792657790",
                closedReason: "345142186",
                endDate: "1102521735",
                streetname: "2015424420",
                fromStreet: "1547375393",
                toStreet: "1335391716",
                stateabbr: "1867193205",
                county: "1714138473",
                source: "1803937317",
                notes: "1648634142"
            }
        }, {
            //https://docs.google.com/forms/d/e/1FAIpQLSeiKY0KsO0xN69Asw77MARQFmxOy6zQXF-k2OQdWOfwtiCp7Q/viewform?entry.1204781462=ojlaw&entry.828228572=CLOSED&entry.1647952662=Test1&entry.1501712688=Test2&entry.2094306654=Test3&entry.1414240321=One-Way&entry.900957975=00/00/0000+00:00&entry.1051351191=Adams&entry.1093044522=Test4&entry.1540676081=City&entry.430378754=Test5&entry.1754051160=Test6&entry.172235277=Test7&entry.1722909714=Test8
            name: "WI closures",
            url: "https://docs.google.com/forms/d/e/1FAIpQLSeiKY0KsO0xN69Asw77MARQFmxOy6zQXF-k2OQdWOfwtiCp7Q/viewform",
            fields: {
                username: "1204781462",
                closureStatus: "828228572",
                permalink: "1754051160",
                closedDir: "1414240321",
                closedReason: "430378754",
                endDate: "900957975",
                streetname: "1647952662",
                fromStreet: "1501712688",
                toStreet: "2094306654",
                county: "1051351191",
                city: "1093044522",
                source: "172235277",
                notes: "1722909714"
            }
        }, {
            //https://docs.google.com/forms/d/e/1FAIpQLSd2Stl1DabZRVZ315HT6kdF78e9ysqjItR09pYtE7WiKmPotg/viewform?usp=pp_url&entry.1677745178=user&entry.1292331655=CLOSED&entry.408708691=http://waze.com&entry.52585226=Two-Way&entry.1079033335=reason&entry.1176076628=2020-05-05+05:00&entry.223275032=street&entry.1159260930=from&entry.1582819664=to&entry.2135402288=Monongalia&entry.858860694=source&entry.1440969572=notes
            name: "WV Closures",
            url: "https://docs.google.com/forms/d/e/1FAIpQLSd2Stl1DabZRVZ315HT6kdF78e9ysqjItR09pYtE7WiKmPotg/viewform",
            fields: {
                username: "1677745178",
                closureStatus: "1292331655",
                permalink: "408708691",
                closedDir: "52585226",
                closedReason: "1079033335",
                endDate: "1176076628",
                streetname: "223275032",
                fromStreet: "1159260930",
                toStreet: "1582819664",
                county: "2135402288",
                source: "858860694",
                notes: "1440969572"
            }
        }
        ];

        forms.forEach(function (key, i) {
            ffMnu.options.add(new Option(forms[i].name, i));
        });
        const lastIndex = localStorage.getItem("ff-last-form-index");
        if (lastIndex > -1 && lastIndex < forms.length) {
            ffMnu.value = lastIndex;
        }
        $(ffMnu).change(() => { localStorage.setItem("ff-last-form-index", ffMnu.value); });
        ffBtn.innerHTML = "Go to Form";
        ffBtn.onclick = function () {
            //alert(ffMnu.options[ffMnu.selectedIndex].value+": "+forms[ffMnu.options[ffMnu.selectedIndex].value].name);
            ff_saveSettings();
            formLink = ff_createFormLink(forms[ffMnu.options[ffMnu.selectedIndex].value]);
            if (typeof formLink === "undefined") {
                return;
            }

            if ($("#ff-open-in-tab").prop("checked")) {
                window.open(formLink, "_blank");
            } else {
                window.open(formLink, formWindowName, formWindowSpecs);
            }
        };
        ffDiv.appendChild(ffMnu);
        ffDiv.appendChild(ffBtn);
        $('#edit-panel').prepend(ffDiv);
        return;
    }

    function ff_loadSettings() {
        var todayDate = new Date(),
            futureDate = new Date(),
            daysInFuture = 3;
        var today = todayDate.getFullYear() + "-" + (todayDate.getMonth() + 1 < 10 ? "0" + (todayDate.getMonth() + 1) : todayDate.getMonth() + 1) + "-" + todayDate.getDate();
        futureDate.setDate(futureDate.getDate() + daysInFuture);

        var ffOpenInTab = localStorage.getItem("ff-open-in-tab");
        if (ffOpenInTab === "1") {
            $("#ff-open-in-tab").trigger("click");
        }
        var ffClosureReason = localStorage.getItem("ff-closure-reason");
        if (ffClosureReason !== null) {
            $("#ff-closure-reason").val(ffClosureReason);
        }
        var ffClosureEndDate = localStorage.getItem("ff-closure-endDate");
        if (ffClosureEndDate !== null && ffClosureEndDate !== "" && ffClosureEndDate >= today) {
            $("#ff-closure-endDate").val(ffClosureEndDate);
        } else {
            var closureDate = futureDate.getFullYear() + "-" + (futureDate.getMonth() + 1 < 10 ? "0" + (futureDate.getMonth() + 1) : futureDate.getMonth() + 1) + "-" + (futureDate.getDate() < 10 ? "0" + futureDate.getDate() : futureDate.getDate());
            $("#ff-closure-endDate").val(closureDate);
        }
        var ffClosureEndTime = localStorage.getItem("ff-closure-endTime");
        if (ffClosureEndTime !== null && ffClosureEndTime !== "") {
            $("#ff-closure-endTime").val(ffClosureEndTime);
        }
        //formfiller_log("Settings loaded");
        return;
    }

    function ff_saveSettings() {
        if ($("#ff-open-in-tab").prop("checked")) {
            localStorage.setItem("ff-open-in-tab", "1");
        } else {
            localStorage.setItem("ff-open-in-tab", "0");
        }
        localStorage.setItem("ff-closure-reason", $("#ff-closure-reason").val());
        localStorage.setItem("ff-closure-endDate", $("#ff-closure-endDate").val());
        localStorage.setItem("ff-closure-endTime", $("#ff-closure-endTime").val());
        //formfiller_log("Settings saved");
        return;
    }

    function ff_addUserTab() {
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

        ffTab.innerHTML = '<a title="Form Filler" href="#sidepanel-formfill" data-toggle="tab"><img class="fa" src="' + WMEFFIcon + '" width="15px" /></a>';
        ffPanel.id = "sidepanel-formfill";
        ffPanel.className = "tab-pane";

        ffTabInfo.innerHTML = '<b>' + WMEFFName + '</b> v' + WMEFFVersion;

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
            $("#ff-closure-endDate").datepicker({
                format: "yyyy-mm-dd",
                todayHighlight: true,
                autoclose: true
            });
        } else {
            if (typeof $.fn.daterangepicker !== "undefined") {
                $("#ff-closure-endDate").daterangepicker({
                    singleDatePicker: true,
                    locale: {
                        format: "YYYY-MM-DD"
                    }
                });
            }
        }

        if (typeof $.fn.timepicker !== "undefined") {
            $("#ff-closure-endTime").timepicker({
                template: false,
                defaultTime: "00:00",
                showMeridian: false
            });
        }

        ff_loadSettings();
        $("#ff-closure-reason").change(function () {
            ff_saveSettings();
        });
        $("#ff-closure-endDate").change(function () {
            ff_saveSettings();
        });
        $("#ff-closure-endTime").change(function () {
            ff_saveSettings();
        });
        $("#ff-open-in-tab").click(function () {
            ff_saveSettings();
        });
    }

    setTimeout(formfiller_bootstrap, 2000);
}());
