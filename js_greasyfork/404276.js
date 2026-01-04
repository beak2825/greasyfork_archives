/*
    Icy Veins Leveling Slider Reminder - Remembers the last selected level on the Icy Veins Leveling Guide sliders
	Copyright (C) 2020-2023  DJScias

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with this program. If not, see <https://www.gnu.org/licenses/>.
*/


// ==UserScript==
// @name         Icy Veins Leveling Slider Reminder
// @description  Remembers the last selected level on the Icy Veins Leveling Guide sliders
// @namespace    https://github.com/DJScias
// @version      2.0.0
// @author       DJScias
// @match        https://www.icy-veins.com/wow/*-leveling-guide
// @grant        none
// @require http://code.jquery.com/jquery-3.5.1.min.js
// @require https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js
// @license GPLv3
// @homepageURL https://github.com/DJScias/Icy-Veins-Leveling-Slider-Reminder
// @supportURL https://github.com/DJScias/Icy-Veins-Leveling-Slider-Reminder/issues
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/404276/Icy%20Veins%20Leveling%20Slider%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/404276/Icy%20Veins%20Leveling%20Slider%20Reminder.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements, Cookies */

(function() {
    'use strict';

    // Check all the sliders and apply saved values
    $('.leveling_slider_container input').each(function () {
        let id = $(this).parent().attr('id');
        let name = id.split("_")[0];
        let level = Cookies.get(id);


        if (Cookies.get(id) !== undefined) {
            $(this).val(level).trigger('change');

			// Update the website UI to reflect the level change
            $(this).next().find("span").text(level);
            let processName = name + '_process_levels';
            let processFnc = window[processName];
            processFnc(level);
        }

        $(this).parent().append('<a href="#" id="'+id+'_reset" class="slider_reset">Reset</a>');
    });

    $(document).on('input', '.leveling_slider_container > input', function() {
        let id = $(this).parent().attr('id');
        let level = $(this).val();

        // Save for a week, that should be fine
        Cookies.set(id, level, { expires: 7, path: '' });
    });

    // Reset button function
    $(document).on('click', '.slider_reset', function(e) {
        e.preventDefault();

        let id = $(this).parent().attr('id');
        let name = id.split("_")[0];
		let level = 60;
        let curid = $(this).parent().attr('id');

        $("#" + id + " > input").val(level).trigger('change');

		// Update the website UI to reflect the level change
        $(this).prev().find("span").text(level);
        let processName = name + '_process_levels';
        let processFnc = window[processName];
        processFnc(level);

        // Remove the cookie, we don't need it anymore
        Cookies.remove(id, { path: '' });
    });
})();
