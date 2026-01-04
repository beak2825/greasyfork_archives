// ==UserScript==
// @name         Crunchyroll Queue Tile Mode
// @namespace    http://tampermonkey.net/
// @version      2.14
// @description  Changes the Crunchyroll queue to be shown as tiles instead of a list.
// @author       /u/mythriz modified by /u/fulano76
// @match        https://www.crunchyroll.com/home/queue
// @grant        GM_addStyle
// @icon         https://www.crunchyroll.com/i/beta/ios_icon/cr_ios.png
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/373267/Crunchyroll%20Queue%20Tile%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/373267/Crunchyroll%20Queue%20Tile%20Mode.meta.js
// ==/UserScript==

// JQuery 1.11.1 seems to be the version loaded on Crunchyroll, so I put that in the @require meta key here too.

(function() {
    'use strict';
    ///////////////// Options /////////////////

    // Sets the number of tiles per row
    var tiles = 4;
    // Space between tiles
    var spacer = 15;
    // Changes the size of the preview image (and also the size of the tile if you use embedded mode)
    var preview_width = 300;
    // Calculate a 16:9 size height:
    var preview_height = preview_width/16*9;
    // But it will also work if you use a different height. Try square-shaped tiles if you want!

    var page_width = preview_width * tiles + (tiles - 1) * spacer;
    
    // Different modes for the show and episode information:
    // embed - overlays information on top of the preview image
    // below - shows the information under the preview image
    // float - hides the information, but shows it when you hold the mouse over the tile
    var show_information_mode = 'embed';

    // This option decides whether to show the entire title of the anime or to crop it if it's too long (longer than one line)
    var show_full_title = 0;
    // Same as above but for the episode name
    var show_full_episode_name = 0;
    // In "float" mode it should be fine to show the full title and episode name, but for the other two modes it's better to crop them.


    // Replaces the "premium" preview image (with a crown in the corner) with the regular preview image
    var hide_premium_crown = 1;
    // Note that the script replaces the preview images with slightly larger versions (200x113 instead of 160x90),
    // but I couldn't find a larger version of the preview with the crown on it, so it'll stay 160x90 if you keep it.

    // The text and background color for the title and episode name box, set the last number inside "rgba" to 1 if you don't want it to be transparent
    // If you use float mode, setting the opacity to 1 is recommended.
    var info_bg_color = 'rgba(255, 255, 255, 0.7)';
    var info_text_color = 'black';

    // This value sets how opaque the info box is before you move the mouse over the tile.
    // You can set this to 0 to make the info box completely invisible until you move the mouse over the tile,
    // or set it to 1 to make it fully opaque (except for the BG color).
    var info_start_opacity = '0.7';
    // This variable is ignored in "float" mode.

    // The color of the play button
    var play_button_fill_color = 'orange';
    var play_button_outline_color = 'white';
    var play_button_outline_width = '3px';
    // You can also use only the outline with a transparent fill color if you want, for example:
    // var play_button_fill_color = 'transparent';
    // var play_button_outline_color = 'orange';
    // var play_button_outline_width = '4px';


    ///////////////// The actual work /////////////////
    // Makes the list fill the entire width of the browser window instead of being resized into a fixed-width column
    GM_addStyle('#template_container.template-container { width: '+page_width+'px; padding: 40px}');
    //GM_addStyle('#main_content { width: calc(100% - 300px); }');
    GM_addStyle('#main_content { width: 100%; }');

    // Using flexboxes instead of floating all the tiles to make them line up and wrap to a new line
    GM_addStyle('ul#sortable { display: flex; flex-wrap: wrap; }');

    // Sets the tile width, also removes padding to make sure the episode preview fills the entire tile
    GM_addStyle('ul#sortable li { width: '+preview_width+'px; margin-left: '+spacer+'px; margin-bottom: '+spacer+'px;}');
    GM_addStyle('ul#sortable { margin-left: -'+spacer+'px; }');
     GM_addStyle('body .small-margin-bottom { margin-bottom: 0px }');
    GM_addStyle('#source_home .landscape-grid li .queue-wrapper { width: 100% !important; height: auto; }');
    GM_addStyle('ul#sortable a.episode { width: 100% !important; padding: 0; }');
    GM_addStyle('.episode-progress-bar { position: absolute; top: '+(preview_height)+'px; width: 100%; }');

    // Replaces IMG element with a DIV element, setting the preview image as its background.
    // That way even with f.ex. square-shaped tiles, the image won't be stretched.
    $('#main_content .landscape-element img.landscape').each( function() {
        var image_url = $(this).attr('src');
        if (hide_premium_crown)
            image_url = image_url.replace(/wide(star)?/g,'full');
        else image_url = image_url.replace(/wide\.jpg?/g,'full.jpg');
        $(this).replaceWith( $('<div class="crunchyroll_image_div">').css('background-image',"url('"+image_url+"')" ) );
    });
    GM_addStyle('.crunchyroll_image_div { width: '+preview_width+'px; height: '+preview_height+'px; background-size: cover; background-position: center center; background-repeat: norepeat; }');
    GM_addStyle('#main_content .landscape-element .episode-img { width: '+preview_width+'px; height: '+(preview_height+70)+'px; }');

    // Move the "drag and drop" handle to the top left
    GM_addStyle('#source_home .handle { position: absolute; top: 0; left: 0; z-index: 10; height: 30px; background-position-y: -193px; opacity: 0.5; }');
    GM_addStyle('#source_home .handle:hover { background-position-y: -23px; }');

    // Move the "Move to top" button to the top right, and hides it unless you move the mouse over it
    GM_addStyle('#source_home .queue-to-top { position: absolute; top: 0; right: 0; z-index: 10; margin: 0; opacity: 0; transition: opacity 0.3s ease-in-out; }');
    GM_addStyle('#source_home .queue-to-top:hover { opacity: 1; }');

    // Move the episode information over the preview image
    GM_addStyle('ul#sortable .series-info { width: auto !important; padding: 0 10px 15px; background: '+info_bg_color+'; z-index: 15; }');
    if (show_information_mode == 'embed')
        GM_addStyle('ul#sortable .series-info { position: absolute; bottom: 4px; left: 0; right: 0; opacity: '+info_start_opacity+'; transition: opacity 0.3s ease-in-out; }');
    if (show_information_mode == 'float') {
        GM_addStyle('ul#sortable .series-info { position: absolute; top: '+preview_height+'px; left: 0; right: 0; display: none; }');
    }
    GM_addStyle('ul#sortable li:hover .series-info { opacity: 1; display: block; }');
    GM_addStyle('ul#sortable .episode-img, ul#sortable .series-info, ul#sortable .series-title { max-width: 100%; height: auto; }');
    if (show_full_title)
        GM_addStyle('ul#sortable .series-title { white-space: normal; }');
    if (show_full_episode_name)
        GM_addStyle('ul#sortable .series-data { white-space: normal; }');
    GM_addStyle('ul#sortable .series-title, ul#sortable .series-data { color: '+info_text_color+'; }');

    // Hide the episode description, but if it isn't empty, add it to the mouseover text
    GM_addStyle('ul#sortable .short-desc { display: none; }');
    $('.short-desc').each(function(){
        if ($(this).text().trim() != '') {
            var ep_link = $(this).parent().parent();
            ep_link.attr('title', ep_link.attr('title')+' - '+$(this).text().trim() );
        }
    });

    // Fix the "Play" button that shows when you hold the mouse over a tile.
    // Made it orange with white outline and used a character instead of the image (because the image was too small and looked bad if I resized it)
    GM_addStyle('#main_content .landscape-element.episode .play-icon-overlay { width: '+preview_width+'px; height: '+preview_height+'px; background: none; z-index: 5; }');
    var play_x = (preview_width-40)/2;
    var play_y = (preview_height-80)/2;
    GM_addStyle('#main_content .landscape-element.episode .play-icon-overlay::before { content: "▶"; font-size: 50px; position: absolute; left: '+play_x+'px; top: '+play_y+'px; color: '+play_button_fill_color+'; -webkit-text-stroke-width: '+play_button_outline_width+'; -webkit-text-stroke-color: '+play_button_outline_color+';}');

    // Removes the useless "Next up:" label from the episode name
    $('.series-data').each( function(){
        $(this).html( $(this).html().split('Next up:').join('') );
    });

    // Hides the dropdown arrow for the episode list since this doesn't work properly for the tile anyways and I haven't figured out how to make it work
    GM_addStyle( 'a.dropdown-collection { display: none; }' );

    // Moves the "Show information" link from the hidden block into the tile
    $('a:contains(Show Information)').each( function(){
        $(this).appendTo( $(this).parent().parent().parent().find('.series-info') );
    });
    GM_addStyle( '.series-info a.text-link { position: absolute; bottom: 0; right: 3px; z-index: 15; font-size: 0.8em; }' );
    GM_addStyle( '.series-info a.text-link:hover { text-decoration: underline !important; }' );



    // Makes the recents list appear on the bottom of the page
    GM_addStyle( '.right { float: left;}' );
    // Expands size of recents list so it fits the entire page
    GM_addStyle( '#sidebar { width: auto;}' );
    // Makes the elements of the recents list appear side by side instead of one below the other
    GM_addStyle( '.list-block li { float: left !important; padding-right: 12px; padding-bottom: 8px;}' );
    // Changes the height of the placeholder that appears when you're dragging an item to another position on the screen
    GM_addStyle( '#source_home .placeholder { height: '+(preview_height+66)+'px; }' );

})();

