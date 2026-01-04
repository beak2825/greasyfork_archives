// ==UserScript==
// @name        WME Form Filler AL/NoFL (Dev)
// @description Use info from WME to automatically fill out related forms - for the AL/NoFL MapRaid
// @namespace   hbiede.com
// @version     2019.10.10.002
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @author      HBiede
// @license     MIT
// @run-at      document-end
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NUIzRDdFNzAwRTlGMTFFNkIyRDZGMzNERUFDMUM1NDgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NUIzRDdFNzEwRTlGMTFFNkIyRDZGMzNERUFDMUM1NDgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1QjNEN0U2RTBFOUYxMUU2QjJENkYzM0RFQUMxQzU0OCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1QjNEN0U2RjBFOUYxMUU2QjJENkYzM0RFQUMxQzU0OCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtdrqLIAAAOCSURBVHjatJdLaBNBGMdn81ITQ2mLNqlIKInGkpSgFooPpKGHIlZPJqgoIvQivooPfFUsxYNVW62KiuItPah48RaUSlFEaDzEqgeV+sBUxag1rZa8Nv6nfMKaZpNssx34kdnN7sx/5nvNCtFolAUCAW8ymdwtCIKZMZZh6jQBjIIL4EkikWA+n485HI7/HtLFYjHH0NDQnXQ6XQkBbAbaGrAsHo+PNDc3T/lTF4lEVouiWKnX62O4DgBRpYn1YBuoAkuxwBGNRjNVAP7QZjKTu/4V7FJ59euAEWjlHtBg2//ZXEOq1WpzaUyWz690Ms5jUDhZcrqm0+UYyAPuKxyH2zqohgC++j/gmcJxRot5yGAwFBTAr9+AtWrHIqKMBYNBFgqFmlKpVLympuax1+udIiBD9reUON/nLMcTtFotC4fDBoR8H5JSVV1dXVdjY+OxbAEpUA8GSxRQC95KrkUe6jABzwnbkQ/OmUwmPSJQzBbAw+YL6C5hcr7y72TO2TTeI9AA7oErELNBp9NF5HzgEziogtnNZM6j4BfoAfNBB0XZu1wCuAkWggMKJ7sBXmbd4xmwH1wHW8FKut/Hi5NcFIiUu/cpFNCfQ0ACHKGdOM0LHbx/DE54HJWX92XDMEy7oKRFc9z7SXSBBZiYWSyWs0aj8QMvzVarVTYRJckP1GhLwN7J7Ugkhv1+f4/H48mbiPi+LOKeWmIUtIKP4AxFAiNn/F0oE/KX5wB3iQLSoAmsp3sPwW0q+3kF8HL8HFgVTqrJqvn8upf6XMyhYotRhsKnVqEAXj9ikuv9wEX9m/mKWy4fWA6eKhSwEdylfjVop/4PcEJJOebbOAz2KDgdC1kr7ATl1O+gUFwMXhcjgNvuG7g8TQdcAXZQ/xW4RLvxXk6ARmagBhqoTHJvFdhCUSLX2iVjttH7h8GEEh9wggEwiw4mfirRA2Sia2CnzHjV9HuLCs5FOpwmlERBGU3Om41+50nCzJ4nFCM0eTftlI/XAJ778WHCeDou5kg2SNtXLzkXPAAnKbWeymOCzWCM+nwRGT55S0sLs9lszG635xQgSCphivq9OU7LnQUcUJRMzts4T0JozOl0Ci6Xq6AJ+GHhPGUuNRo/jJRTGZbPAyiLIZzRJrBVZXi4bQY+TsfNZvMLWQEVFRVht9u9CQJaIcCk8uf5GArQVRxAh+Ue+ivAAAY7DIf3WTuXAAAAAElFTkSuQmCC
// @grant       none
// @copyright   2019 HBiede, adapted from crazycaveman
// @downloadURL https://update.greasyfork.org/scripts/390954/WME%20Form%20Filler%20ALNoFL%20%28Dev%29.user.js
// @updateURL https://update.greasyfork.org/scripts/390954/WME%20Form%20Filler%20ALNoFL%20%28Dev%29.meta.js
// ==/UserScript==

/*global W, $, GM_info */

(function () {
    "use strict";
    const debug = false;
    var WMEFFName = GM_info.script.name;
    var WMEFFVersion = GM_info.script.version;
    var WMEFFIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NUIzRDdFNzAwRTlGMTFFNkIyRDZGMzNERUFDMUM1NDgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NUIzRDdFNzEwRTlGMTFFNkIyRDZGMzNERUFDMUM1NDgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1QjNEN0U2RTBFOUYxMUU2QjJENkYzM0RFQUMxQzU0OCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1QjNEN0U2RjBFOUYxMUU2QjJENkYzM0RFQUMxQzU0OCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtdrqLIAAAOCSURBVHjatJdLaBNBGMdn81ITQ2mLNqlIKInGkpSgFooPpKGHIlZPJqgoIvQivooPfFUsxYNVW62KiuItPah48RaUSlFEaDzEqgeV+sBUxag1rZa8Nv6nfMKaZpNssx34kdnN7sx/5nvNCtFolAUCAW8ymdwtCIKZMZZh6jQBjIIL4EkikWA+n485HI7/HtLFYjHH0NDQnXQ6XQkBbAbaGrAsHo+PNDc3T/lTF4lEVouiWKnX62O4DgBRpYn1YBuoAkuxwBGNRjNVAP7QZjKTu/4V7FJ59euAEWjlHtBg2//ZXEOq1WpzaUyWz690Ms5jUDhZcrqm0+UYyAPuKxyH2zqohgC++j/gmcJxRot5yGAwFBTAr9+AtWrHIqKMBYNBFgqFmlKpVLympuax1+udIiBD9reUON/nLMcTtFotC4fDBoR8H5JSVV1dXVdjY+OxbAEpUA8GSxRQC95KrkUe6jABzwnbkQ/OmUwmPSJQzBbAw+YL6C5hcr7y72TO2TTeI9AA7oErELNBp9NF5HzgEziogtnNZM6j4BfoAfNBB0XZu1wCuAkWggMKJ7sBXmbd4xmwH1wHW8FKut/Hi5NcFIiUu/cpFNCfQ0ACHKGdOM0LHbx/DE54HJWX92XDMEy7oKRFc9z7SXSBBZiYWSyWs0aj8QMvzVarVTYRJckP1GhLwN7J7Ugkhv1+f4/H48mbiPi+LOKeWmIUtIKP4AxFAiNn/F0oE/KX5wB3iQLSoAmsp3sPwW0q+3kF8HL8HFgVTqrJqvn8upf6XMyhYotRhsKnVqEAXj9ikuv9wEX9m/mKWy4fWA6eKhSwEdylfjVop/4PcEJJOebbOAz2KDgdC1kr7ATl1O+gUFwMXhcjgNvuG7g8TQdcAXZQ/xW4RLvxXk6ARmagBhqoTHJvFdhCUSLX2iVjttH7h8GEEh9wggEwiw4mfirRA2Sia2CnzHjV9HuLCs5FOpwmlERBGU3Om41+50nCzJ4nFCM0eTftlI/XAJ778WHCeDou5kg2SNtXLzkXPAAnKbWeymOCzWCM+nwRGT55S0sLs9lszG635xQgSCphivq9OU7LnQUcUJRMzts4T0JozOl0Ci6Xq6AJ+GHhPGUuNRo/jJRTGZbPAyiLIZzRJrBVZXi4bQY+TsfNZvMLWQEVFRVht9u9CQJaIcCk8uf5GArQVRxAh+Ue+ivAAAY7DIf3WTuXAAAAAElFTkSuQmCC";
    var forms = {};
    var ff_mapLayer;
    var groups = [
						{ name: "Group 1 - Mobile",
							points: [
								{lon: '-87.1973627', lat: '30.2830619'},
								{lon:'-87.3051661',lat:'31.7082857'},
								{lon:'-88.4649104',lat:'31.7272687'},
								{lon:'-88.3851404',lat:'30.1763031'},
								{lon:'-87.8045578',lat:'30.1998109'},
								{lon:'-87.1973627',lat:'30.2830619'},
							]
						},
						{
							name: "Group 2 - Pensacola",
							points: [
								{lon: '-87.1973627', lat: '30.2830619'},
								{lon: '-86.6564531', lat: '30.3470012'},
								{lon: '-86.1702734', lat: '30.2616802'},
								{lon: '-85.8996028', lat: '30.1465889'},
								{lon: '-85.8529109', lat: '30.329301'},
								{lon: '-85.9545344', lat: '31.6852088'},
								{lon: '-87.3051661', lat: '31.7082857'},
								{lon: '-87.1973627', lat: '30.2830619'}
							]
						},
						{
							name: "Group 3 - Dothan/PC",
							points: [
								{lon: '-85.8996028,30.1465889'},
								{lon: '-85.5989232', lat: '30.0099391'},
								{lon: '-85.4643215', lat: '29.9147676'},
								{lon: '-85.4601496', lat: '29.8301975'},
								{lon: '-85.434071', lat: '29.6382198'},
								{lon: '-85.0701276', lat: '29.6084099'},
								{lon: '-84.9451633', lat: '29.6931625'},
								{lon: '-85.0304062', lat: '30.4075901'},
								{lon: '-84.9343195', lat: '30.7693668'},
								{lon: '-85.0454158', lat: '31.1272951'},
								{lon: '-85.0978101', lat: '31.2173031'},
								{lon: '-85.0800141', lat: '31.6409353'},
								{lon: '-85.9545344', lat: '31.6852088'},
								{lon: '-85.8529109', lat: '30.329301'},
								{lon: '-85.8996028', lat: '30.1465889'}
							]
						},
						{
							name: "Group 4 - Montgomery",
							points: [
								{lon: '-88.4072322', lat: '32.4405167'},
								{lon: '-88.4722455', lat: '31.9032884'},
								{lon: '-88.4649104', lat: '31.7272687'},
								{lon: '-87.2094377', lat: '31.7065456'},
								{lon: '-86.5791673', lat: '31.6950762'},
								{lon: '-85.9545344', lat: '31.6852088'},
								{lon: '-85.0800141', lat: '31.6409353'},
								{lon: '-85.1264399', lat: '31.7477077'},
								{lon: '-85.1445903', lat: '31.8464827'},
								{lon: '-85.0031814', lat: '32.1888451'},
								{lon: '-85.0032011', lat: '32.330532'},
								{lon: '-85.1607722', lat: '32.8013941'},
								{lon: '-88.361492', lat: '32.7567752'},
								{lon: '-88.4072322', lat: '32.4405167'}
							]
						},
						{
							name: "Group 5 - B'Ham",
							points: [
								{lon:'-86.8233137',lat:'33.8301606'},
								{lon:'-86.8119844',lat:'33.3026763'},
								{lon:'-86.710689',lat:'32.7912346'},
								{lon:'-85.1607722',lat:'32.8013941'},
								{lon:'-85.2397311',lat:'33.1362159'},
								{lon:'-85.2472823',lat:'33.1758731'},
								{lon:'-85.2583568',lat:'33.2152941'},
								{lon:'-85.2918799',lat:'33.4074859'},
								{lon:'-85.3740542',lat:'33.811053'},
								{lon:'-86.8233137',lat:'33.8301606'}
							]
						},
						{
							name: "Group 6 - Florence",
							points: [
								{lon:'-88.2331078',lat:'33.8315763'},
								{lon:'-86.8233137',lat:'33.8301606'},
								{lon:'-86.8279795',lat:'34.9930997'},
								{lon:'-88.2015217',lat:'35.0078151'},
								{lon:'-88.181266',lat:'34.9728456'},
								{lon:'-88.1476204',lat:'34.9179685'},
								{lon:'-88.1177513',lat:'34.9010759'},
								{lon:'-88.096122',lat:'34.8931914'},
								{lon:'-88.0933754',lat:'34.8529128'},
								{lon:'-88.0902855',lat:'34.8351613'},
								{lon:'-88.1084816',lat:'34.808668'},
								{lon:'-88.2331078',lat:'33.8315763'}
							]
						},
						{
							name: "Group 7 - Tuscaloosa",
							points: [
								{lon:'-88.2331078',lat:'33.8315763'},
								{lon:'-88.361492',lat:'32.7567752'},
								{lon:'-86.710689',lat:'32.7912346'},
								{lon:'-86.8119844',lat:'33.3026763'},
								{lon:'-86.8233137',lat:'33.8301606'},
								{lon:'-88.2331078',lat:'33.8315763'}
							]
						},
						{
							name: "Group 8 - Huntsville",
							points: [
								{lon:'-86.8279795',lat:'34.9930997'},
								{lon:'-86.8233137',lat:'33.8301606'},
								{lon:'-85.3740542',lat:'33.811053'},
								{lon:'-85.6123033',lat:'34.9667111'},
								{lon:'-86.8279795',lat:'34.9930997'}
							]
						}
					];

	function convertPoints(list) {
		return list.map(function(point) {
			return new OL.Geometry.Point(point.lon, point.lat).transform(new OL.Projection("EPSG:4326"), W.map.getProjectionObject());
		});
	}

	function addRaidPolygon(raidLayer, dataList) {
		var style = {
			strokeOpacity: 0.0,
			strokeWidth: 0,
			label: name,
		};
		var polygon = new OL.Geometry.Polygon(new OL.Geometry.LinearRing(convertPoints(dataList.points)));
		var vector = new OL.Feature.Vector(polygon, { name: dataList.name}, style);
		raidLayer.addFeatures([ vector ]);
	}

    function formfiller_bootstrap() {
        formfiller_log("Running bootstrap");

        if (typeof W.app === "undefined" || !window.W.map) {
            setTimeout(formfiller_bootstrap, 500);
            return;
        }
        formfiller_log("Starting init");
        formfiller_init();
    }

    function formfiller_init() {
		ff_mapLayer = new OL.Layer.Vector("Group Regions", {
			uniqueName: WMEFFName
		});
		groups.forEach(function(groupData) {
			addRaidPolygon(ff_mapLayer, groupData);
		});
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

        ff_addFormBtn();
        var formFillerObserver = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    // Mutation is a NodeList and doesn't support forEach like an array
                    for (var i = 0; i < mutation.addedNodes.length; i += 1) {
                        var addedNode = mutation.addedNodes[i];

                        // Only fire up if it's a node
                        if (addedNode.nodeType === Node.ELEMENT_NODE) {
                            var selectionDiv = addedNode.querySelector("div.selection");

                            if (selectionDiv) {
                                ff_addFormBtn();
                            }
                        }
                    }
                });
            });
        formFillerObserver.observe(document.getElementById("edit-panel"), {
            childList: true,
            subtree: true
        });
        //W.selectionManager.events.register("selectionchanged", null, ff_addFormBtn);
        if (W.app.modeController) {
            W.app.modeController.model.bind("change:mode", function (model, modeId) {
                if (modeId === 0) {
                    ff_addUserTab();
                }
            });
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
        var streetName = "",
            i;

        for (i = 0; i < selection.length; i += 1) {
            var newStreet = W.model.streets.get(selection[i].model.attributes.primaryStreetID);
            if (typeof newStreet === "undefined" || newStreet.name === null) {
                newStreet = "No Name";
            }
            if (streetName === "") {
                streetName = newStreet.name;
            } else if (streetName !== newStreet.name) {
                streetName += ", " + newStreet.name;
            }
        }
        return streetName;
    }

    function ff_getState(selection) {
        var stateName = "",
            i;

        for (i = 0; i < selection.length; i += 1) {
            var cID = W.model.streets.get(selection[i].model.attributes.primaryStreetID).cityID;
            var sID = W.model.cities.get(cID).attributes.stateID;
            var newState = W.model.states.get(sID).name;

            if (newState === "") {
                sID = W.model.cities.get(cID).attributes.countryID;
                newState = W.model.countries.get(sID).name;
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
            var cID = W.model.streets.get(selection[i].model.attributes.primaryStreetID).cityID;
            var newCity = W.model.cities.get(cID).attributes.name;
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
        var center = W.map.center.clone().transform(W.map.projection.projCode, W.map.displayProjection.projCode);
        //formfiller_log("Getting county for "+center.lat.toString()+","+center.lon.toString());
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + center.lat + "," + center.lon, false);
        xhr.onload = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
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
        xhr.send(null);
        return county;

        //Async call. Figure this out!
        /*return $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng="+center.lat+","+center.lon, function(data) {
        if (data.status === "OK")
    {
        var addrComps = data.results[0].address_components;
        for (comp = 0; comp < addrComps.length; comp+=1)
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

    function ff_closureActive(selection) {
        var i;
        for (i = 0; i < selection.length; i += 1) {
            if (selection[i].model.hasClosures()) {
                if (W.model.roadClosures.getByAttributes({
                        segID: selection[i].model.attributes.id
                    })[0].active) {
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
        var segID = seg.model.attributes.id;
        var closureList = W.model.roadClosures.getByAttributes({
                segID: segID,
                active: true
            });
        var i;

        for (i = 0; i < closureList.length; i += 1) {
            if (closureList[i].active === true) {
                if (closureInfo.endDate === "") {
                    closureInfo.endDate = closureList[i].endDate;
                } else if (closureInfo.endDate > closureList[i].endDate) {
                    closureInfo.endDate = closureList[i].endDate;
                }
                if (closureList[i].forward === true) {
                    closureInfo.idFwd = closureList[i].id;
                } else {
                    closureInfo.idRev = closureList[i].id;
                }
                if (closureInfo.closedReason === "") {
                    closureInfo.closedReason = closureList[i].closedReason;
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
        var latLon = W.map.center.clone().transform(W.map.projection.projCode, W.map.displayProjection.projCode);
        var lat = latLon.lat,
            lon = latLon.lon;
        var env = "en-US";
        var type = "segments";
        var zoomToRoadType = W.Config.segments.zoomToRoadType;
        var i;

        //To get lat and long centered on segment
        if (selection.length === 1) {
            latLon = selection[0].model.getCenter().clone();
            latLon.transform(W.map.projection.projCode, W.map.displayProjection.projCode);
            lat = latLon.y;
            lon = latLon.x;
        }

		selection.forEach(function(segment) {
			segIDs.push(segment.model.attributes.id);
		});
        permalink += "env=" + env + "&lon=" + lon + "&lat=" + lat + "&zoom=" + W.map.zoom.toString() + "&" + type + "=" + segIDs.join();
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
            newEdName = W.model.users.get(eID).userName;
            if (editorNames.indexOf(newEdName) === -1) {
                editorNames += ", " + newEdName;
            }

        });
        editorNames = editorNames.substr(2);
        return editorNames;
    }

    function ff_getGroupNumber(selection) {
    	let segmentPoint = W.selectionManager.getSelectedFeatures()[0].geometry.components[0].getCentroid();
    	var raidCenterPoint = new OL.Geometry.Point(segmentPoint.x, segmentPoint.y);
    	for (var i = 0; i < ff_mapLayer.features.length; i++) {
			if (ff_mapLayer.features[i].geometry.components[0].containsPoint(segmentPoint)) {
				return ff_mapLayer.features[i].attributes.name;
			}
		}
		return "Not in the Raid!!"
    }

    function ff_checkZooms(selections) {
    	// LS = 1, PS = 2, FWY = 3, Ramp = 4, MH = 6, mH = 7, PR = 17, RR = 18, PLR = 20
    	let maxZoom = [10, 4, 2, 2, 2, 3, 2, 2];
    	selections.forEach(function(segment) {
			if ((maxZoom[segment.model.attributes.roadType] && W.map.zoom < maxZoom[segment.model.attributes.roadType]) || W.map.zoom < 3) {
				alert("Please zoom to a safe distance (no less than " + maxZoom[segment.model.attributes.roadType] +")");
				return false;
			}
    	});
    	return true;
    }

    function ff_createFormLink(formSel) {
        var selection = W.selectionManager.getSelectedFeatures();
        var formValues = {};
        var formFields = formSel.fields;
        var formLink = formSel.url + "?entry.";
        var formArgs = [];
        if (selection.length === 0 || selection[0].model.type !== "segment") {
            alert("No segments selected.");
            return true;
        }
        if (ff_checkZooms(selection) == false) {
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
        groupNumber
         */

        Object.keys(formFields).forEach(function (key, index) {
            switch (key) {
            case "username":
                formValues[key] = W.loginManager.user.userName;
                break;
            case "permalink":
                formValues[key] = ff_createPermalink(selection);
                if (typeof formValues.permalink === "undefined") {
                    formfiller_log("No permalink generated");
                    return;
                }
                break;
            case "streetname":
                formValues[key] = ff_getStreetName(selection);
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
                if (selection[0].model.type === "segment") {
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
            case "groupNumber":
            	formValues[key] = ff_getGroupNumber(selection);
            	break;
            default:
                if (debug == true) formfiller_log("Nothing defined for " + key);
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
        var formWindowName = "WME Form Filler Result",
            formWindowSpecs = "resizable=1,menubar=0,scrollbars=1,status=0,toolbar=0";
        var editPanel,
            selElem,
            formLink;
            ffDiv.id = "formfillerDiv";
        editPanel = document.getElementById("edit-panel");
        selElem = editPanel.getElementsByClassName("selection");
        if (selection.length === 0 || selection[0].model.type !== "segment") {
            //formfiller_log("No segments selected.");
            return;
        }
        if (document.getElementById("formfillerDiv")) {
            ffDiv = document.getElementById("formfillerDiv");
            ffBtn = ffDiv.getElementsByTagName('button')[0];
            ffMnu = ffDiv.getElementsByTagName('select')[0];
            //formfiller_log("Div already created");
            //return;
        }

    forms = [
        {
			// https://docs.google.com/forms/d/e/1FAIpQLSepGbaZwkScTyrfld_aFOb7bYfoQ1PQ18sq57WGK_TETcritQ/viewform?usp=pp_url&entry.1497159329=User&entry.871809061=www.example.com&entry.659791093=Group+1+-+Mobile&entry.196392479=AL&entry.290080183=Delete&entry.1214382106=Reasoning
            name: "AL/NoFL Mapraid Segment Update Request",
            url: "https://docs.google.com/forms/d/e/1FAIpQLSepGbaZwkScTyrfld_aFOb7bYfoQ1PQ18sq57WGK_TETcritQ/viewform",
            fields: {
                username: "1497159329",
                permalink: "871809061",
                groupNumber: "659791093",
                state: "196392479"
            }
        }
    ];

        forms.forEach(function (key, i) {
            ffMnu.options.add(new Option(forms[i].name, i),0);
        });
        ffMnu.value = 0;
        ffBtn.innerHTML = "Go to Form";
        ffBtn.onclick = function () {
            if (debug == true) formfiller_log(ffMnu.options[ffMnu.selectedIndex].value+": "+forms[ffMnu.options[ffMnu.selectedIndex].value].name);
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
        selElem[0].appendChild(ffDiv);

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

    setTimeout(formfiller_bootstrap, 4000);
}());