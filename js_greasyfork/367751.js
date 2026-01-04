// ==UserScript==
// @name         World's Best Userscript
// @namespace    https://greasyfork.org/users/3898
// @version      1.1
// @description  Center the World Map on Europe
// @author       Xiphias[187717]
// @match        https://www.torn.com/travelagency.php
// @match        http://www.torn.com/travelagency.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367751/World%27s%20Best%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/367751/World%27s%20Best%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global variables
    var min_x = 0;
    var max_x = 782-20;

    var offset_left = -199;
    var offset_right = 564;

    var map_width = $('.travel-map').css('width').replace(/[^-\d\.]/g, '') - 2;

    // Reposition background
    function get_background_image_url(background_image_property) {
        return background_image_property.replace('url(','').replace(')','').replace(/\"/gi, "");
    }

    // Reposition a coordinate, wrap around between min and max if out of bounds
    function reposition_x(coordinate_x, offset_x, min_x, max_x) {
    return (coordinate_x + offset_x + min_x + max_x) % max_x;
    }

    // Reposition country flags and travel paths
    $(".travel-agency").find("#tab4-1 > div,#tab4-2 > div,#tab4-3 > div,#tab4-4 > div").each(function() {
        var current_left = parseInt($(this).css("left").replace(/[^-\d\.]/g, ''));
        var new_left = reposition_x(current_left, offset_left, min_x, max_x);
        $(this).css("left", new_left);
    });

    // Reposition background
    var travel_map_background_image = get_background_image_url($('.travel-map').css('background-image'));
    var travel_map_style = {
        'background': 'url(' + travel_map_background_image + '), url(' + travel_map_background_image +')',
        'width': map_width,
        'height': '396px',
        'background-repeat': 'no-repeat, no-repeat',
        'background-position-x': offset_left + 'px, ' + offset_right + 'px',
        'background-position-y': 'top, top',
        'margin-left': '1px',
    }
    $('.travel-map').css(travel_map_style);

    // Fix paths to china and japan
    var path_to_china_background_image = get_background_image_url($(".path.to-china").css('background-image'));
    var path_to_china_style = {
        'left': min_x,
        'background': 'url(' + path_to_china_background_image + '), url(' + path_to_china_background_image + ')',
        'background-position-x': '-129px, 630px',
        'background-repeat': 'no-repeat, no-repeat',
        'width': map_width,
        'margin-left': '1px'
    };
    $(".path.to-china").css(path_to_china_style);

    var path_to_japan_background_image = get_background_image_url($(".path.to-japan").css('background-image'));
    var path_to_japan_style = {
        'left': min_x,
        'background': 'url(' + path_to_japan_background_image +'), url(' + path_to_japan_background_image + ')',
        'width': map_width,
        'background-position-x': '-83px, 678px',
        'background-repeat': 'no-repeat, no-repeat',
        'margin-left': '1px'
    }
    $(".path.to-japan").css(path_to_japan_style);
})();