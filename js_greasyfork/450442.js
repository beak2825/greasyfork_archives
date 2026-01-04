// ==UserScript==
// @name         Nuvola Favourites
// @namespace    http://tampermonkey.net/
// @version      0.15
// @license      WTFPL
// @description  try to make nuvola website a bit more comfortable
// @author       https://github.com/Skeeve
// @icon         https://www.google.com/s2/favicons?sz=64&domain=frontier-nuvola.net
// @match        https://smartradio.frontier-nuvola.net/portal/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/450442/Nuvola%20Favourites.user.js
// @updateURL https://update.greasyfork.org/scripts/450442/Nuvola%20Favourites.meta.js
// ==/UserScript==

/* eslint-env jquery */

(function () {
    'use strict';
    const NUVOLA_RELOGIN = 'NuvolaRelogin';
    const NuvolaIgnore = JSON.parse(GM_getValue("NuvolaIgnore", '{}'));
	const Device = JSON.parse(GM_getValue("NuvolaDevice", '{}'));
	console.log(Device);

	setup();

	const path = document.location.pathname.split('/');
	if (path[1] != 'portal') return;

	switch (path[2]) {
		case 'favorites':
			if (path[3] === undefined) break;
			store_current_device();
			prepare_folder();
			prepare_hearts();
			break;
		case 'content':
			prepare_hearts();
			prepare_device_selector();
			break;
		case 'devices':
			if (window.name == NUVOLA_RELOGIN) {
				window.opener.logged_in_again(window);
			}
			break;
	}

    // clickhandler //////////////////////////////////////////////////////////
    function toggleFolder() {
        const dir = $(this);
        // toggle closed <-> open
        dir.toggleClass('fa-folder fa-folder-open');
        const dir_id = dir.attr('data-id');
        dir.closest('table').toggleClass('open-' + dir_id + ' closed-' + dir_id);
        $('tr[data-sorting*="null"] td[colspan="2"]')
            .closest('tr')
            .each( function(idx, row) {
                const r = $(row);
                const dir_id = getStationId(r.prevAll('tr.directory:first'));
                var sorting = r.attr('data-sorting').replace(/null/, `"${dir_id}"`);
                r.attr('data-sorting', sorting);
            }
        );
    }

    function toggleIgnore() {
        const ignoreBtn = $(this);
        const id = ignoreBtn.attr('data-id');
        if (NuvolaIgnore[id] === undefined) {
            NuvolaIgnore[id] = 1;
        } else {
            delete NuvolaIgnore[id];
        }
        GM_setValue('NuvolaIgnore', JSON.stringify(NuvolaIgnore));
        showIgnore(ignoreBtn);
    }

    function showIgnore(ignoreBtn) {
        const id = ignoreBtn.attr('data-id');
        if (NuvolaIgnore[id] === undefined) {
            ignoreBtn.removeClass(['fa-skull', 'fa', 'ignored']);
        } else {
            ignoreBtn.addClass(['fa-skull', 'fa', 'ignored']);
        }
    }

	function heartClick(event) {
		event.stopPropagation();
        const lnk = $(this);
        let data = {};
        // Check whether to insert a favorite or remove
        let bg = 'LightGrey';
		let url = lnk.attr('href');
        if (lnk.hasClass('is-outlined')) {
            // insert
            data[`insert[${Device.id}]`] = 1;
			if (Device.selected != '') {
				data[`parent[${Device.id}]`] = Device.selected;
			}
            bg = 'MistyRose';
        }
        // Make row LightGrey for remove and MistyRosefor insert.
        const row = lnk.closest('tr');
        const bgcol= row.css('background-color');
        lnk.blur();
        row.css('background-color', bg);
        // POST the request
        jQuery.post(url, data)
            .done(function(data) {
            // If we were logged out, there should be no logout link in the result page
            if (data.match(/href="\/portal\/logout"/)) {
                // But there is one, so we were still logged in
                // Switch back the button
                lnk.toggleClass('is-outlined');
                // Make it a heart again, if it were an error before
                lnk.children('i').removeClass('fa-exclamation-triangle').addClass('fa-heart');
                // And set a title to signal success
                lnk.attr('title', 'Success!');
            } else {
                // Otherwise we were logged out
                // Signal this by changing the heart to an error indicator.
                lnk.children('i').removeClass('fa-heart').addClass('fa-exclamation-triangle');
                // And set a title
                lnk.attr('title', 'Failed!\nMake sure you are logged in.');
                // Open a window to log in again.
                relogin();
            }
        })
        // reset all color changes
            .always(function() {
            row.css('background-color', bgcol);
        });
        return false;
    };

	function change_device_folder() {
		if (this.selectedIndex == 0) {
			document.location = this.value;
			return;
		}
		Device.selected = this.value;
		GM_setValue('NuvolaDevice', JSON.stringify(Device));
		console.log(Device);
	}

	function checkStation(event) {
        const player = event.currentTarget;
        const url = JSON.parse(player.getAttribute('data-stream'))[0].replace(/^http:/, 'https:');
        console.log(url, player);
        try {
            fetch(url)
            .then(function(response) {
                if (!response.ok) {
                    cannotPlay(player, `Could not access ${url}`);
                }
                return undefined;
            })
            .catch((error) => {
                cannotPlay(player, error);
            })
        } catch(error) {
            cannotPlay(player, error);
        }
    }

    // helpers ///////////////////////////////////////////////////////////////
    function cannotPlay(player, msg) {
        console.log("Cannot play:", msg);
        player.setAttribute('disabled','disabled')
        player.classList.add('is-outlined', 'is-light', 'tooltip')
        player.setAttribute('data-tooltip', msg);
    }

    function getStationId(row) {
        return $(row).attr('data-sorting').replaceAll(/^\["([^"]+)".*$/g, "$1");
    }

    // Relogin function
    function relogin() {
        // Calculate the position of the login window
        // It should be centered
        const w = 500;
        const h = 770;
        const top = (screen.height - h) / 2;
        const left = (screen.width - w) / 2;
        window.open(
            'https://smartradio.frontier-nuvola.net/portal/oauth',
            NUVOLA_RELOGIN,
            ['fullscreen=no',
             'height=' + h, 'width=' + w,
             'top=' + top, 'left=' + left,
             'location=no',
             'menubar=no',
             'resizable=yes',
             'scrollbars=no',
             'status=no',
             'titlebar=no',
             'toolbar=no',
            ].join()
        );
    }

	// setup functions ///////////////////////////////////////////////////////
	function prepare_folder() {
		$('tr.directory i.fa-folder').each(function(idx, dir) {
			// get the folder's id
			const dir_id = getStationId(dir.closest('tr'));
			// Add a class to the table element indicating that the folder is closed.
			$(dir.closest('table')).addClass('closed-' + dir_id);
			// Add a click handler for opening or closing the folder
			$(dir).attr('data-id', dir_id);
			$(dir).on('click', toggleFolder);
			// Create a new style for all folder members, hiding them in closed status
			const newStyle = 'table.closed-' + dir_id + ' tr:not(.directory)[data-sorting*="' + dir_id+ '"] { display:none !important; }';
			GM_addStyle(newStyle);
		});
	}

	function store_current_device() {
		Device.id = path[3];
		Device.name = $('h2 strong').text().replace(/^.*?:\s+/, '');
		Device.folder = [];
        let selectedFound = false;
		$('tr.directory input.input[type="text"][name="name"]').each(function(idx, elt){
			const name = elt.value;
			const id = $(elt.closest('td')).find('input[type="hidden"][name="directory"]')[0].value;
			Device.folder.push({ "id" : id, "name" : name});
            selectedFound || id == Device.selected;
		});
        if (! selectedFound) Device.selected = '';
		GM_setValue("NuvolaDevice", JSON.stringify(Device));
        console.log(Device);
	}

	function prepare_hearts() {
	    // Enhance all the "Heart-Buttons"
	    const buttons = $('a.button.is-small.is-rounded.is-primary');
	    console.log("Enhancing buttons:", buttons.length);
        const favorites = {};
        var countFavorites = 0;
	    buttons.each(function(idx,elt) {
            const btn = $(elt);
	        const row = btn.closest('tr');
            const station_id = row.attr('id');
            // not for pens
            if (btn.find('i.fa-pen').length == 0) {
                // Set a click handler for the button
	            btn.click(heartClick);
                // Do we have no id?
                if (station_id === undefined) {
                    // then we are in the list of the device's favourites
                    // we will store them
                    favorites[btn.attr('href').replaceAll(/^\/portal\/favorites\/([^\/]+)\/.*/g, "$1")] = 1;
                    ++countFavorites;
                } else {
                    if (Device.favorites[station_id.substr(1)] == 1) {
                        btn.removeClass('is-outlined');
                    } else {
                        btn.addClass('is-outlined');
                    }
                }
            }
			// Is there a reliability-column?
	        const reliability = row.find('td:nth-child(6) > small');
			if (reliability.length > 0) {
				const ignoreBtn = reliability.wrap('<span class="to-ignore button is-rounded is-size-7" title="Click to ignore this Station">')
					.parent();
				ignoreBtn.attr('data-id', station_id)
					.click(toggleIgnore)
				;
				if (NuvolaIgnore[station_id] !== undefined) {
					showIgnore(ignoreBtn);
				}
			}
	    });
        if (countFavorites > 0) {
            console.log("Number of Favorites:", countFavorites);
            Device.favorites = favorites;
            GM_setValue('NuvolaDevice', JSON.stringify(Device));
        }
	    console.log("Buttons enhanced:", buttons.length);
        const players = $('i.fas.fa-play');
        console.log("Enhancing players", players.length);
        players.each(function(idx, elt){
            $(elt.parentNode).click(checkStation);
        });

	}

	function prepare_device_selector() {
		const loc = $('a[href="/portal/devices"]');
		const sel = $('<select/>');
		sel.change(change_device_folder);
		sel.append($('<option/>').attr('value', loc.attr('href')).text(loc.attr('title')));
        sel.append($('<option/>').attr('value', '').text(`${Device.name} /`));
        sel[0].selectedIndex = 1;
		if (Device.folder.length > 0) {
			var i = 2;
			Device.folder.forEach( fldr => {
				sel.append($('<option/>').attr('value', fldr.id).text(`${Device.name} / ${fldr.name}`));
				if (Device.selected == fldr.id) {
					sel[0].selectedIndex = i;
				}
				++i;
			});
		}
		loc.replaceWith(sel);
	}

    function setup() {
		unsafeWindow.logged_in_again = function(theWIndow) {
			theWIndow.close();
			$('#loggedout').hide();
			checkLoginStatus();
		};
        // styles for
        // - signalling that an operation failed: i.fa-exclamation.triange
        // - an overlay when logged out: #loggedout
        // - the message window when logged out: #logoutpopup
        // - the logo in the message window: loggedoutlogo
        GM_addStyle(`
             body {
                 padding-top: 100px;
             }
             body > header {
                 position: fixed;
                 top: 0px;
                 width: 100%;
                 display: block;
                 background-color: white;
                 z-index: 10;
                 height: 80px;
             }
             body > header img {
                 top: -60px;
                 position: relative;
             }
             body > div.tabs {
                 position: fixed;
                 top: 80px;
                 width: 100%;
                 display: block;
                 background-color: white;
                 z-index: 11;
             }
             i.fa-exclamation-triangle {color:red;}
             #loggedout {
                 position: fixed; /* Sit on top of the page content */
                 display: none; /* Hidden by default */
                 width: 100%; /* Full width (cover the whole page) */
                 height: 100%; /* Full height (cover the whole page) */
                 top: 0;
                 left: 0;
                 right: 0;
                 bottom: 0;
                 background-color: rgba(0,0,0,0.5); /* Black background with opacity */
                 z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
                 cursor: pointer; /* Add a pointer on hover */
                 z-index: 998;
             }
             #logoutpopup {
                 text-align: center;
                 margin: auto;
                 width: 20em;
                 border: 0.25em solid red;
                 background-color: white;
                 padding: 0.25em;
                 margin-top: 5em;
             }
             #logoutpopup::after {
                 content: "";
                 clear: both;
                 display: table;
             }
             #logoutpopup p {
                 padding: 0.25em;
             }
             #loggedoutlogo {
                 background: url(https://smartradio.frontier-nuvola.net/static/frontier-nuvola.png);
                 width: 100px;
                 height: 100px;
                 float: left;
             }
             .to-ignored {
                 color: black;
             }
             .to-ignore.ignored {
                 font-size: 150%;
                 background-color: black;
                 color: white;
             }
             .to-ignore.ignored small {
                 display: none;
             }
             .fa-skull:before {
                 position: relative;
                 top: 3px;
             }
             tr[id^="c"] td:nth-child(6) {
                 text-align: center;
             }
        `);

        // add the HTML for the overlay and the logged-out-message.
        $(document.body).append(`
        <div id="loggedout">
            <div id="logoutpopup">
                <div id="loggedoutlogo"></div>
                <div id="logoutmsg">
                    <p>You were logged out.</p>
                    <button id="LoginButton" class="button is-small">
                        <span class="icon"><i class="fa fa-user"></i></span>
                        <span>Login</span>
                    </button>
                </div>
            </div>
        </div>
       `);
        // Button for logging in again
        $('#LoginButton').click(function() {
            relogin();
            checkLoginStatus();
        });

        // Handler to check every 10 seconds whether or not we
        // are still logged in.
        const checkLoginStatus = function() {
			// Call the devices page to check for a redirect
			const url = 'https://smartradio.frontier-nuvola.net/portal/devices';
			fetch(url, { method: 'HEAD' })
				.then(response => {
					if (response.redirected) {
						// We were logged out
						// Show the overlay and wait until the user loggs in again.
						$('#loggedout').show();
					} else {
						// come back in 10 seconds
						window.setTimeout(checkLoginStatus, 10000);
					}
				});
        }
        checkLoginStatus();
    }

})();