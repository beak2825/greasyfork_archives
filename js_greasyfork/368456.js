// ==UserScript==
// @name           WME AltCity
// @description    Easily add an alternate city name to selected segment(s)
// @namespace      russblau.waze@gmail.com
// @grant          none
// @version        20241129001
// @match          https://www.waze.com/editor*
// @match          https://beta.waze.com/editor*
// @match          https://www.waze.com/*/editor*
// @match          https://beta.waze.com/*/editor*
// @exclude        https://www.waze.com/user/*editor/*
// @exclude        https://www.waze.com/*/user/*editor/*
// @require        https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @author         russblau
// @license        MIT/BSD/X11
// @downloadURL https://update.greasyfork.org/scripts/368456/WME%20AltCity.user.js
// @updateURL https://update.greasyfork.org/scripts/368456/WME%20AltCity.meta.js
// ==/UserScript==
/* global jQuery, getWmeSdk */

window.SDK_INITIALIZED.then(WMEAC_init);

function WMEAC_log(message) {
	if (typeof message === 'string') {
		console.log('WMEAltCity: ' + message);
	} else {
		console.log('WMEAltCity: ', message);
	}
}

// initialize WMEAltCity and do some checks

function WMEAC_init() {
   	WMEAC_log("Starting initialization.");

    const wmeSDK = getWmeSdk({scriptId: "wme-altcity", scriptName: "WME Alt City"});
	const $ = jQuery;
	const WMEAltCity = {};

    function updateCityList() {
        const cities = wmeSDK.DataModel.Cities.getAll()
            .map(city => city.name)
            .filter(name => name.length)
            .sort()
            .map(name => `<option value="${name}">`);
        $('#acAltCityDatalist').empty().append(cities);
    }

	WMEAltCity.onAddAltCityButtonClick = function () {
        // create array of available city names indexed by state
        updateCityList();
		// show form and give input element focus
		$('#acCityForm').css("display", "block");
		$('#acAltCityInp')[0].focus();
		// hide button
		$('#acAddAltCityButton').css("display", "none");
	};

	WMEAltCity.doSubmit = function (evt) {
		// Submit button clicked
		evt.preventDefault();
		const altcity = $('#acAltCityInp').val();
        if (altcity !== '') {
			// city name is not empty
			WMEAC_log(altcity);
			let altcity_id;
            const selection = wmeSDK.Editing.getSelection();
            if (selection.objectType === "segment") {
                $.each(selection.ids, function(i, seg_id) {
                    const segment = wmeSDK.DataModel.Segments.getById({segmentId: seg_id});
                    if (segment === null) {
                        return;
                    }
                    if (segment.lockRank > wmeSDK.State.getUserInfo().rank) {
						WMEAC_log(`Segment ${seg_id} is locked; skipping.`);
						return;
					}
                    if (! wmeSDK.DataModel.Segments.hasPermissions({segmentId: seg_id}) ) {
						WMEAC_log(`Segment ${seg_id} is not editable; skipping.`);
						return;
					}
                    const address = wmeSDK.DataModel.Segments.getAddress({segmentId: seg_id});
                    const streetname = address.street?.name; // null or string
					if (streetname === "" || streetname === null || streetname === undefined) {
						// don't edit unnamed segments
						return;
					}
					const country = address.country;
					const state = address.state;
                    WMEAC_log(streetname + ', ' + state?.name + ', ' + country?.name);
                    if (typeof altcity_id === "undefined") {
						// make sure alt city already exists
                    const altcity_obj = wmeSDK.DataModel.Cities.getAll()
                                           .filter(city => city.countryId === country?.id &&
                                                           city.stateId === state?.id &&
                                                           city.name === altcity);
						if (altcity_obj.length === 0) {
							altcity_id = null;
							WMEAC_log(`City object "${altcity}, ${state?.name}" not found; aborting.`);
						} else {
							altcity_id = altcity_obj[0].id;
							WMEAC_log(`Alt city "${altcity}" found with id ${altcity_id}`);
						}
					}
					if (altcity_id === null) {
						return;
                    }
					const currentcityname = address.city.name; // not null, could be ""
					if (currentcityname == altcity) {
						 // can't set alt city same as primary city
						WMEAC_log(`Segment ${seg_id} already is in city ${altcity}; skipping.`);
						return;
					}
					// see if a street with current name + alt city already exists
                    let newobj = wmeSDK.DataModel.Streets.getStreet({streetName: streetname, cityId: altcity_id});
                    let is_new;
					if (newobj) {
    					const alt_streets = address.altStreets;
    					is_new = true;
                        for (let j = 0; j < alt_streets.length; j++) {
			    			if (alt_streets[j].street.name === newobj.name && alt_streets[j].city.id === newobj.cityId) {
				    			WMEAC_log(`Segment ${seg_id} already has desired alt name; skipping.`);
					    		is_new = false;
						    	break;
						    }
    					}
	    				if (!is_new) {
		    				return;
                        }
                    } else {
                        is_new = true;
                        newobj = wmeSDK.DataModel.Streets.addStreet({streetName: streetname, cityId: altcity_id});
                    }
                    WMEAC_log(`Updating segment ${seg_id}.`);
                    wmeSDK.DataModel.Segments.addAlternateStreet({segmentIds: [seg_id], streetId: newobj.id});
					WMEAC_log(`Updated segment ${seg_id} with new alt name.`);
				}
			);
		}
        }
        // hide form
		$('#acCityForm').css("display", "none");
		$('#acAltCityInp').val("");
		// show button
		$('#acAddAltCityButton').css("display", "inline-block");
	};

	WMEAltCity.doCancel = function (evt) {
		// Cancel button clicked
		evt.preventDefault();
		// hide form
		$('#acCityForm').css("display", "none");
		// show button
		$('#acAddAltCityButton').css("display", "inline-block");
	};

	WMEAltCity.makeAltCityButton = function (elem) {
        elem.append(
            $('<wz-button>',
              {id:"acAddAltCityButton",
               color:"secondary"
              }
             ).text("Add alt city").click(WMEAltCity.onAddAltCityButtonClick)
         );
		// see whether WME ClickSaver "alt city" link is present and remove it
		$("div#segment-edit-general label.control-label a").detach();
		// add city name dialog
		$('#acAddAltCityButton').after(
			'<form id="acCityForm" class="address-form clearfix inner-form" style="display:none">' +
			  '<div id="acAltCityDiv" class="new-alt-streets">' +
				'<div class="alt-street-form-template new-alt-street">' +
				  '<div class="alt-street-block">' +
					'<div class="city-block form-group toggleable-input">'+
					  '<label class="control-label">City</label>' +
					  '<div class="city-container">' +
						'<input id="acAltCityInp" class="city-name form-control" type="text" list="acAltCityDatalist" autocomplete="off" title="City" maxlength="100" required="">' +
                        '<datalist id="acAltCityDatalist"></datalist>' +
					  '</div>' +
					'</div>' +
				  '</div>' +
				'</div>' +
			  '</div>' +
			  '<div class="action-buttons">' +
				'<button id=acSubmit class="save-button waze-btn waze-btn-blue waze-btn-smaller" type="submit">Apply</button>' +
				'<button id=acCancel class="cancel-button waze-btn waze-btn-smaller waze-btn-transparent" type="button">Cancel</button>' +
			  '</div>' +
			'</form>');
        $('#acAddAltCityButton').attr('size', 'sm');
		$('#acSubmit').click(WMEAltCity.doSubmit);
		$('#acCancel').click(WMEAltCity.doCancel);
	};

	// check for changes in the edit-panel
	const addressEditObserver = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			// Mutation is a NodeList and doesn't support forEach like an array
			for (let i = 0; i < mutation.addedNodes.length; i++) {
				const addedNode = mutation.addedNodes[i];

				// Only fire up if it's a node
				if (addedNode.nodeType === Node.ELEMENT_NODE) {
					const addressEditDiv = addedNode.querySelector('#segment-edit-general div.address-edit');

					if (addressEditDiv) {
                        if ($('div.alt-streets-region').length) {
                            WMEAltCity.makeAltCityButton($('div.alt-streets-region>div'));
                        } else if ($('div.alt-streets-control').length) {
                            WMEAltCity.makeAltCityButton($('div.alt-streets-control'));
                        } else {
                            WMEAC_log("ERROR: Can't find alt-streets area.");
                        }
					}
				}
			}
		});
	});
    wmeSDK.Events.once({ eventName: "wme-ready" }).then(() => {
        addressEditObserver.observe(document.getElementById('edit-panel'), { childList: true, subtree: true });
        WMEAC_log("Initialized.");
    });
}
