// ==UserScript==
// @name        Wanikani Ultimate Timeline
// @namespace   rfindley
// @description Review schedule explorer for WaniKani in Dark Material style
// @version     7.0.22.1
// @include     https://www.wanikani.com/dashboard
// @include     https://www.wanikani.com/
// @copyright   2018+, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/383511/Wanikani%20Ultimate%20Timeline.user.js
// @updateURL https://update.greasyfork.org/scripts/383511/Wanikani%20Ultimate%20Timeline.meta.js
// ==/UserScript==

window.timeline = {};

(function(gobj) {

    /* global $, wkof */

    //===================================================================
    // Initialization of the Wanikani Open Framework.
    //-------------------------------------------------------------------
    var script_name = 'Ultimate Timeline';
    var wkof_version_needed = '1.0.27';
    if (!window.wkof) {
        if (confirm(script_name+' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?')) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }
        return;
    }
    if (wkof.version.compare_to(wkof_version_needed) === 'older') {
        if (confirm(script_name+' requires Wanikani Open Framework version '+wkof_version_needed+'.\nDo you want to be forwarded to the update page?')) {
            window.location.href = 'https://greasyfork.org/en/scripts/38582-wanikani-open-framework';
        }
        return;
    }

    wkof.include('ItemData,Menu,Settings');
    wkof.ready('document,ItemData,Menu,Settings').then(load_settings).then(startup);

    //===================================================================
    // Chart defining the auto-scaling factors of the X-axis.
    //-------------------------------------------------------------------
    var xscale = {
        // Scaling chart.  Each column represents a scaling range,
        // and each row is something that we are scaling.
        hours_per_label:   [  1 ,  3 ,  6 ,  12 ,  24 ,  48 , 720 ],
        red_tic_choices:   ['1d','1d','1d', '1d', '1w','1ws', '1m'], // Red major tics (red label)
        major_tic_choices: ['1h','3h','6h','12h', '1d','1ds', '5D'], // Major tics (has label)
        minor_tic_choices: [ '-','1h','1h', '3h', '6h','12h', '1d'], // Minor tics (no label)
        bundle_choices   : [  1 ,  1 ,  1 ,   3 ,   6 ,  12 ,  24 ], // How many hours are bundled together.
        idx: 0
    };

    //===================================================================
    // Interal global object for centralizing data and configuration.
    //-------------------------------------------------------------------
    var graph = {
        elem: null,
        margin: {
            top: 16,
            left: 28,
            bottom: 16,
        },
        x_axis: {
            width: 0,
            max_hours: 0,
            pixels_per_tic: 0,
        },
        y_axis: {
            height: 100,
            min_height: 80,
            max_height: 300,
            max_reviews: 0,
        },
        radical_cache: {},
    };
    gobj.graph = graph;

    //===================================================================
    // Global utility functions.
    //-------------------------------------------------------------------
    function to_title_case(str) {return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});}

    //===================================================================
    // Global variables
    //-------------------------------------------------------------------
    var settings, settings_dialog;
    var tz_ofs = new Date().getTimezoneOffset();
    var time_shift = Math.ceil(tz_ofs / 60) * 60 - tz_ofs;

    //========================================================================
    // Load the script settings.
    //-------------------------------------------------------------------
    function load_settings() {
        var defaults = {
            minimized: false,
            placement: 'before_nextreview',
            time_format: '12hour',
            graph_height: 100,
            max_days: 14,
            days: 3.5,
            max_bar_width: 40,
            max_bar_height: 0,
            fixed_bar_height: false,
            bar_style: 'item_type',
            srs_curr_next: 'curr',
            current_level_markers: 'rkv',
            burn_markers: 'show',
            show_review_details: 'full',
            review_details_summary: 'item_type',
            review_details_buttons: true,
            show_bar_style_dropdown: true,
        };
        return wkof.Settings.load('timeline', defaults).then(function(data){
            settings = wkof.settings.timeline;
            switch (settings.show_markers) {
                case 'none':
                    settings.current_level_markers = 'none';
                    settings.burn_markers = 'hide';
                    break;
                case 'curr':
                    settings.current_level_markers = 'rkv';
                    settings.burn_markers = 'hide';
                    break;
                case 'burn':
                    settings.current_level_markers = 'none';
                    settings.burn_markers = 'show';
                    break;
                case 'both':
                    settings.current_level_markers = 'rkv';
                    settings.burn_markers = 'show';
                    break;
            }
            delete settings.show_markers;
        });
    }

    //========================================================================
    // Startup
    //-------------------------------------------------------------------
    function startup() {
        install_css();
        install_menu_link();
        place_timeline(true /* first_time */);
        fetch_and_update();
        start_refresh_timer();
    }

    //===================================================================
    // Install a link to the settings in the menu.
    //-------------------------------------------------------------------
    function install_menu_link()
    {
        wkof.Menu.insert_script_link({
            name: 'timeline',
            submenu: 'Settings',
            title: 'Ultimate Timeline',
            on_click: open_settings
        });
    }

    //===================================================================
    // Top-level HTML for the script.
    //-------------------------------------------------------------------
    var timeline_html =
        '<section id="timeline">'+
        '  <h4 class="no_min">Reviews Timeline</h4>'+
        '  <i class="link open noselect no_min icon-chevron-up" title="Open the timeline"></i>'+
        '  <i class="link minimize noselect icon-chevron-down" title="Minimize the timeline"></i>'+
        '  <i class="link refresh noselect icon-refresh" title="Refresh"></i>'+
        '  <i class="link settings noselect icon-gear" title="Change timeline settings"></i>'+
        '  <span class="bar_style hidden"><label>Bar Style: </label><select>'+
        '    <option name="count">Review Count</option>'+
        '    <option name="item_type">Item Type</option>'+
        '    <option name="srs_stage">SRS Level</option>'+
        '    <option name="level">Level</option>'+
        '  </select></span>'+
        '  <form class="range_form" class="hidden"><label><span class="range_reviews">0</span> reviews in <span class="range_days">3 days</span> <input class="range_input" type="range" min="0.25" max="7" value="3" step="0.25" name="range_input"></label></form><br clear="all" class="no_min">'+
        '  <div class="graph_wrap">'+
        '    <div class="review_info hidden"><div class="inner"></div></div>'+
        '    <div class="graph_panel"></div>'+
        '  </div>'+
        '</section>';

    //===================================================================
    // Install the style sheet for the script.
    //-------------------------------------------------------------------
    function install_css() {
        var timeline_css =
            '.noselect {-webkit-touch-callout:none; -webkit-user-select:none; -khtml-user-select:none; -moz-user-select:none; -ms-user-select:none; user-select:none; cursor:default;}'+
            '.dashboard section.review-status {border-top: 0px solid #ffffff;}'+ //DARK MATERIAL EDIT
            '.dashboard section.review-status ul li time {white-space: nowrap; overflow-x: hidden; height: 1.5em; margin-bottom: 0;}'+

            '#timeline {margin-bottom: 0px; border-bottom: 0px solid #d4d4d4;}'+ //DARK MATERIAL EDIT
            '#timeline > h4 {clear:none; float:left; height:20px; margin-top:0px; margin-bottom:4px; font-weight:normal; margin-right:12px;}'+
            '@media (max-width: 767px) {#timeline h4 {display: none;}}'+
            '#timeline > .link {color:rgba(0,0,0,0.3); font-size:1.1em; text-decoration:none; cursor:pointer; margin-right:4px;}'+
            '#timeline > .link:hover {color:rgba(255,31,31,0.5);}'+
            '#timeline:not(.min) > .link.open, #timeline.min > :not(.no_min) {display:none;}'+
            '#timeline > .range_form {float:right; margin-bottom:0px; text-align:right;}'+

            '#timeline .bar_style label {display:inline; margin-left:80px;}'+
            '#timeline .bar_style select {height:auto; padding:0; width:auto; vertical-align:baseline; background-color:#e3e3e3; border:1px solid #aaa; border-radius:2px;}'+
            '@media (max-width: 979px) {'+
            '  #timeline .bar_style {float:left; clear:both; margin-left:inherit;}'+
            '  #timeline .bar_style label {margin-left:inherit;}'+
            '}'+
            '@media (max-width: 767px) {#timeline .link {float:left;}}'+

            '#timeline > .graph_panel div, #timeline > .graph_panel canvas {height:100%;width:100%;}'+
            '#timeline > .graph_panel div {border:1px solid #d4d4d4;}'+

            '#timeline .graph_wrap {position:relative;}'+

            '#timeline .review_info {position:absolute; padding-bottom:150px; z-index:5;}'+
            '#timeline .review_info .inner {padding:4px 8px 8px 8px; color:#eeeeee; background-color:rgba(0,0,0,0.8); border-radius:4px; font-weight:bold; z-index:2; box-sizing:border-box;}'+
            '#timeline .review_info .summary {font-family:"Open Sans","Helvetica Neue",Helvetica,Arial,sans-serif; font-size:13px; display:inline-block;}'+
            '#timeline .review_info .summary div {padding:0px 8px;}'+
            '#timeline .review_info .summary .indent {padding:0; margin-bottom:8px;}'+
            '#timeline .review_info .summary .indent:last-child {margin-bottom:0;}'+
            '#timeline .review_info .summary .fixed {text-align:right;}'+
            '#timeline .review_info .summary .tot {color:#000000; background-color:#efefef; background-image:linear-gradient(to bottom, #efefef, #cfcfcf);}'+
            '#timeline .review_info .items_wrap {position:relative;}'+
            '#timeline .summary .fixed {display:inline-block;}'+
            '#timeline .review_info .summary .indent>div {display:none}'+

            '#timeline .review_info[data-mode="item_type"] .summary .item_type {display:block;}'+
            '#timeline .review_info[data-mode="srs_stage"] .summary .srs_stage {display:block;}'+
            '#timeline .review_info[data-mode="level"] .summary .level {display:block;}'+

            '#timeline .review_info[data-mode="count"] .item_list > li {background-color:#eee; background-image:linear-gradient(to bottom, #efefef, #cfcfcf); color:#000;}'+
            '#timeline .review_info[data-mode="count"] .item_list > li svg {stroke:#000;}'+
            '#timeline .review_info[data-mode="item_type"] .rad {background-color:#0096e7; background-image:linear-gradient(to bottom, #0af, #0093dd);}'+
            '#timeline .review_info[data-mode="item_type"] .kan {background-color:#ee00a1; background-image:linear-gradient(to bottom, #f0a, #dd0093);}'+
            '#timeline .review_info[data-mode="item_type"] .voc {background-color:#9800e8; background-image:linear-gradient(to bottom, #a0f, #9300dd);}'+
            '#timeline .review_info[data-mode="srs_stage"] .appr {background-color:#dd0093; background-image:linear-gradient(to bottom, #ff00aa, #b30077);}'+
            '#timeline .review_info[data-mode="srs_stage"] .guru {background-color:#882d9e; background-image:linear-gradient(to bottom, #aa38c7, #662277);}'+
            '#timeline .review_info[data-mode="srs_stage"] .mast {background-color:#294ddb; background-image:linear-gradient(to bottom, #516ee1, #2142c4);}'+
            '#timeline .review_info[data-mode="srs_stage"] .enli {background-color:#0093dd; background-image:linear-gradient(to bottom, #00aaff, #0077b3);}'+
            '#timeline .review_info[data-mode="srs_stage"] .burn {background-color:#434343; background-image:linear-gradient(to bottom, #434343, #1a1a1a);}'+
            '#timeline .review_info[data-mode="srs_stage"] li.burn {border:1px solid #777;}'+
            '#timeline .review_info[data-mode="level"] .lvlgrp0 {background-color:#5eb6e8; background-image:linear-gradient(to bottom, #5eb6e8, #1d8ac9);}'+
            '#timeline .review_info[data-mode="level"] .lvlgrp1 {background-color:#e25ebc; background-image:linear-gradient(to bottom, #e25ebc, #c22495);}'+
            '#timeline .review_info[data-mode="level"] .lvlgrp2 {background-color:#af79c3; background-image:linear-gradient(to bottom, #af79c3, #87479e);}'+
            '#timeline .review_info[data-mode="level"] .lvlgrp3 {background-color:#768ce7; background-image:linear-gradient(to bottom, #768ce7, #264ad9);}'+
            '#timeline .review_info[data-mode="level"] .lvlgrp4 {background-color:#5e5e64; background-image:linear-gradient(to bottom, #5e5e64, #313135);}'+
            '#timeline .review_info[data-mode="level"] .lvlgrp5 {background-color:#f5c667; background-image:linear-gradient(to bottom, #f5c667, #f0a50f); color:#333}'+

            '#timeline .review_info[data-mode="level"] .lvlgrp5 svg {stroke:#333}'+

            '#timeline .review_info .summary .indent>.cur {display:block; font-style:italic; color:#000000; background-color:#ffff88; background-image:linear-gradient(to bottom, #ffffaa, #eeee77);}'+
            '#timeline .review_info .summary .indent>.bur {display:block; font-style:italic; color:#ffffff; background-color:#000000; background-image:linear-gradient(to bottom, #444444, #000000);}'+

            '#timeline .item_list {margin: 8px 0 0 0; padding: 0px;}'+
            '#timeline .item_list > li {padding:0 3px; margin:1px 1px; display:inline-block; border-radius:4px; font-size:14px; font-weight:normal; cursor:default; box-sizing:border-box; border:1px solid rgba(0,0,0,0);}'+

            '#timeline[data-detail="full"] .item_list > li {cursor:pointer;}'+
            '#timeline .item_info {position:absolute; background:#333; border:8px solid rgba(0,0,0,0.7); border-radius:6px; left:4px; padding:0 8px; z-index:10;}'+
            '#timeline .item_info .item {font-size:2em; line-height:1.2em;}'+
            '#timeline .review_info svg.radical {fill:none;stroke:#fff;stroke-width:85;stroke-linecap:square;stroke-miterlimit:2;}'+
            '#timeline .item_list svg.radical {width:1em; transform:translateY(2px); stroke-width:85;}'+
            '#timeline .item_info .item svg.radical {width:28px; transform:translateY(2px);}'+

            '#timeline .detail_buttons {display:inline-block; vertical-align:top; margin-left:8px;}'+
            '#timeline .detail_buttons button {display:block; width:130px; padding:0; margin-bottom:2px;}'+

            '#timeline svg {overflow:hidden;}'+
            '#timeline svg .grid {pointer-events:none;}'+
            '#timeline svg .grid path {fill:none;stroke:black;stroke-linecap:square;shape-rendering:crispEdges;}'+
            '#timeline svg .grid .light {stroke:rgb(78, 82, 98);fill:rgb(78, 82, 98);}'+ //DARK MATERIAL EDIT
            '#timeline svg .grid .shadow {stroke:#d5d5d5;}'+
            '#timeline svg .grid .major {opacity:0.15;}'+
            '#timeline svg .grid .minor {opacity:0.05;}'+
            '#timeline svg .grid .redtic {stroke:#f22;opacity:1;}'+
            '#timeline svg .grid .max {stroke:#f22;opacity:0.2;}'+
            '#timeline svg .boundary {fill:#000;opacity:0;}'+
            '#timeline svg .resize_grip {fill:none;cursor:row-resize;}'+
            '#timeline svg .resize_grip .light {stroke:#ffffff;}'+
            '#timeline svg .resize_grip .shadow {stroke:#bbb;}'+
            '#timeline svg text.redtic {fill:#f22;font-weight:bold;}'+
            '#timeline svg .label-x text {text-anchor:start;font-size:0.8em;}'+
            '#timeline svg .label-y text {text-anchor:end;font-size:0.8em;}'+
            '#timeline svg text {pointer-events:none;}'+
            '#timeline svg .bars rect {stroke:none;shape-rendering:crispEdges;}'+
            '#timeline svg .bar.overlay {opacity:0;}'+
            '#timeline svg .bkgd {fill:rgb(78, 82, 98);}'+ //DARK MATERIAL EDIT
            '#timeline svg .rad {fill:#00a1f1;}'+
            '#timeline svg .kan {fill:#f100a1;}'+
            '#timeline svg .voc {fill:#a100f1;}'+
            '#timeline svg .sum {fill:#294ddb;}'+
            '#timeline svg .appr {fill:#dd0093;}'+
            '#timeline svg .guru {fill:#882d9e;}'+
            '#timeline svg .mast {fill:#294ddb;}'+
            '#timeline svg .enli {fill:#0093dd;}'+
            '#timeline svg .burn {fill:#434343;}'+
            '#timeline svg .count {fill:#778ad8;}'+
            '#timeline svg .lvlgrp0 {fill:#5eb6e8;}'+
            '#timeline svg .lvlgrp1 {fill:#e25ebc;}'+
            '#timeline svg .lvlgrp2 {fill:#af79c3;}'+
            '#timeline svg .lvlgrp3 {fill:#768ce7;}'+
            '#timeline svg .lvlgrp4 {fill:#5e5e64;}'+
            '#timeline svg .lvlgrp5 {fill:#f5c667;}'+
            '#timeline svg .bars .cur {fill:#ffffff;opacity:0.6;}'+
            '#timeline svg .bars .bur {fill:#000000;opacity:0.4;}'+
            '#timeline svg .markers {stroke:#000000;stroke-width:0.5;}'+
            '#timeline svg .markers .bur {fill:#000000;}'+
            '#timeline svg .markers .cur {fill:#ffffff;}'+
            '#timeline svg .highlight .boundary {cursor:pointer;}'+
            '#timeline[data-detail="none"] .highlight .boundary {cursor:auto;}'+
            '#timeline svg .highlight .marker {pointer-events:none;shape-rendering:crispEdges;}'+
            '#timeline svg .highlight path.marker {fill:#00a1f1; stroke:#00a1f1; stroke-width:2;}'+
            '#timeline svg .highlight rect.marker {fill:rgba(0,161,241,0.1); stroke:#00a1f1; stroke-width:1;}'+
            '#timeline svg.link:hover * {fill:rgb(255,31,31);}'+
            'body.mute_popover .popover.srs {display:none !important;}'+
            '';

        $('head').append('<style>'+timeline_css+'</style>');
    }

    //========================================================================
    // Place the timeline on the dashboard, or adjust its location on the page.
    //-------------------------------------------------------------------
    function place_timeline(first_time) {
        var timeline = (first_time ? $(timeline_html) : $('#timeline'));
        switch (settings.placement) {
            case 'after_nextreview'   : $('section.review-status').after(timeline); break;
            case 'after_srsprogress'  : $('section.srs-progress').after(timeline); break;
            case 'after_levelprogress': $('section.progression').after(timeline); break;
            case 'after_unlocks'      : $('section.recent-unlocks').closest('div.row').after(timeline); break;
            case 'after_recentchat'   : $('section.forum-topics-list').closest('div.row').after(timeline); break;
            default: $('section.review-status').before(timeline); break; // 'before_nextreview'
        }
        if (first_time) {
            // Initialize UI from settings
            graph.elem = timeline.find('.graph_panel');
            graph.x_axis.width = graph.elem.width() - graph.margin.left;
            graph.y_axis.height = settings.graph_height - (graph.margin.top + graph.margin.bottom);
            update_minimize();
            init_ui();

            // Install event handlers
            timeline.find('.link.open, .link.minimize').on('click', toggle_minimize);
            timeline.find('.link.refresh').on('click', fetch_and_update);
            timeline.find('.link.settings').on('click', open_settings);
            timeline.find('.bar_style select').on('change', bar_style_changed);
            timeline.find('.range_input').on('input change', days_changed);
            timeline.find('.review_info>.inner').on('mouseenter', '.item_list > li', item_hover);
            timeline.find('.review_info>.inner').on('mouseleave', '.item_list', item_hover);
            timeline.find('.review_info>.inner').on('click', '.detail_buttons button', detail_button_clicked);
            timeline.find('.review_info>.inner').on('click', function(){return false;});
            window.addEventListener('resize', window_resized);
        }
    }

    //========================================================================
    // Toggle whether the timeline is minimized.
    //-------------------------------------------------------------------
    function toggle_minimize() {
        settings.minimized = !settings.minimized;
        update_minimize();
        save_settings();
    }

    //========================================================================
    // Hide or unhide the timeline when the user minimizes/restores.
    //-------------------------------------------------------------------
    function update_minimize() {
        var timeline = $('#timeline');
        var is_min = timeline.hasClass('min');
        if (settings.minimized && !is_min) {
            timeline.addClass('min');
        } else if (!settings.minimized && is_min) {
            timeline.removeClass('min');
        }
    }

    //========================================================================
    // Update the timeline after the user changes the number of days to display.
    //-------------------------------------------------------------------
    function days_changed() {
        var days = Number($('#timeline .range_input').val());
        if (days === settings.days) return;
        settings.days = days;
        update_slider_days();
        bundle_by_timeslot();
        update_slider_reviews();
        draw_timeline();
        save_settings();
    }

    //========================================================================
    // Handler for when user changes the Bar Style.
    //-------------------------------------------------------------------
    function bar_style_changed() {
        settings.bar_style = $('#timeline .bar_style select :selected').attr('name');
        draw_timeline();
        save_settings();
    }

    //========================================================================
    // Handler for when user clicks 'Save' in the settings window.
    //-------------------------------------------------------------------
    function settings_saved() {
        settings = wkof.settings.timeline;
        place_timeline(false /* first_time */);
        init_ui();
        bundle_by_timeslot();
        draw_timeline();
    }

    //========================================================================
    // Initialize the user interface.
    //-------------------------------------------------------------------
    function init_ui() {
        init_slider();
        if (settings.show_bar_style_dropdown) {
            $('#timeline .bar_style').removeClass('hidden');
        } else {
            $('#timeline .bar_style').addClass('hidden');
        }
        $('#timeline .bar_style option[name="'+settings.bar_style+'"]').prop('selected',true);
        $('#timeline').attr('data-detail', settings.show_review_details);
        $('#timeline .review_info').attr('data-mode', settings.review_details_summary);
    }

    //========================================================================
    // Initialize the scale slider.
    //-------------------------------------------------------------------
    function init_slider() {
        var range = $('#timeline .range_input');
        if (settings.days > settings.max_days) {
            settings.days = settings.max_days;
            save_settings();
        }
        range.attr('max', settings.max_days);
        range.attr('value', settings.days);
        update_slider_days();
    }

    //========================================================================
    // Update the 'reviews' text of the scale slider.
    //-------------------------------------------------------------------
    function update_slider_reviews() {
        var review_count = $('#timeline .range_reviews');
        review_count.text(graph.total_reviews);
    }

    //========================================================================
    // Update the 'days' text of the scale slider.
    //-------------------------------------------------------------------
    function update_slider_days() {
        var days = settings.days;
        var period = $('#timeline .range_days');
        if (days <= 1) {
            period.text((days*24)+' hours');
        } else {
            period.text(days.toFixed(2)+' days');
        }
    }

    //========================================================================
    // Save the script settings (after a 500ms delay).
    //-------------------------------------------------------------------
    var save_delay_timer;
    function save_settings() {
        if (save_delay_timer !== undefined) clearTimeout(save_delay_timer);
        save_delay_timer = setTimeout(function(){
            wkof.Settings.save('timeline');
        }, 500);
    }

    //========================================================================
    // Handler for resizing the panel by dragging the bottom of the graph.
    //------------------------------------------------------------------------
    function resize_panel(e) {
        if (e.button !== 0) return;
        var panel = $('#timeline > .graph_panel');
        var start_y = e.pageY;
        var start_height = settings.graph_height;
        $('body')
        .addClass('mute_popover')
        .on('mousemove.timeline_resize touchmove.timeline_resize', function(e){
            var height = start_height + (e.pageY - start_y);
            if (height < graph.y_axis.min_height) height = graph.y_axis.min_height;
            if (height > graph.y_axis.max_height) height = graph.y_axis.max_height;
            settings.graph_height = height;
            graph.y_axis.height = height - (graph.margin.top + graph.margin.bottom);
            draw_timeline();
        })
        .on('mouseup.timeline_resize touchend.timeline_resize', function(e){
            save_settings();
            $('body').off('.timeline_resize').removeClass('mute_popover');
        });
    }

    //========================================================================
    // Event handler for hovering over the time scale for highlighting.
    //------------------------------------------------------------------------
    var highlight = {start:0, end:0, dragging:false, highlighted: false};
    function highlight_hover(e) {
        if (settings.show_review_details === 'none') return;
        if (highlight.dragging) return true;
        var bundle_idx = nearest_bundle(e.pageX);
        var x;
        switch (e.type) {
            case 'mouseenter':
                break;

            case 'mousemove':
                if (highlight.highlighted) return;
                x = bundle_to_x(bundle_idx);
                $('#timeline .highlight .marker.start').attr('transform', 'translate('+x+',0)');
                break;

            case 'mouseleave':
                if (highlight.dragging || highlight.highlighted) return true;
                hide_highlight();
                break;

            case 'touchstart':
            case 'mousedown':
                if (e.button !== 0) return;
                highlight.highlighted = true;
                highlight.dragging = true;
                highlight.start = bundle_idx;
                x = bundle_to_x(bundle_idx);
                $('#timeline .highlight .marker.start').attr('transform', 'translate('+x+',0)');
                $('#timeline .highlight .marker.end').attr('transform', 'translate(-100,0)');
                $('#timeline .highlight rect.marker').attr('width',0).attr('transform', 'translate('+x+',0)');
                $('body').on('mousemove.timeline_highlight', highlight_drag);
                $('body').on('touchend.timeline_highlight mouseup.timeline_highlight', highlight_release);
                break;
        }
    }

    //========================================================================
    // Even handler for dragging when highlighting a time range.
    //------------------------------------------------------------------------
    function highlight_drag(e) {
        var bundle_idx = nearest_bundle(e.pageX);
        highlight.end = bundle_idx;
        var x1 = bundle_to_x(highlight.start);
        var x2 = bundle_to_x(highlight.end);
        $('#timeline .highlight .marker.end').attr('transform', 'translate('+x2+',0)');
        $('#timeline .highlight rect.marker').attr('transform', 'translate('+Math.min(x1,x2)+'.5,0.5)').attr('width',Math.abs(x2-x1));
        show_review_info(false /* sticky */);
    }

    //========================================================================
    // Event handler for the end of a 'drag' when highlighting a time range.
    //------------------------------------------------------------------------
    function highlight_release(e) {
        if (e.button !== 0) return;
        highlight.dragging = false;
        $('body').off('.timeline_highlight');
        var bundle_idx = nearest_bundle(e.pageX);
        highlight.end = bundle_idx;
        if (highlight.start === highlight.end) {
            hide_highlight();
        } else {
            var x1 = bundle_to_x(Math.min(highlight.start, highlight.end));
            var x2 = bundle_to_x(Math.max(highlight.start, highlight.end));
            $('#timeline .highlight .marker.start').attr('transform', 'translate('+x1+',0)');
            $('#timeline .highlight .marker.end').attr('transform', 'translate('+x2+',0)');
            $('#timeline .highlight rect.marker').attr('transform', 'translate('+x1+'.5,0.5)').attr('width',x2-x1);
            highlight.highlighted = true;
            show_review_info(true /* sticky */);
        }
        return false;
    }

    //========================================================================
    // Hide the timeline's highlight cursors.
    //------------------------------------------------------------------------
    function hide_highlight() {
        highlight.start = -1;
        highlight.end = -1;
        highlight.highlighted = false;
        $('#timeline .highlight rect.marker').attr('width',0).attr('transform', 'translate(-100,0.5)');
        $('#timeline .highlight .marker.start').attr('transform', 'translate(-100,0)');
        $('#timeline .highlight .marker.end').attr('transform', 'translate(-100,0)');
        hide_review_info();
    }

    //========================================================================
    // nearest_bundle()
    //------------------------------------------------------------------------
    function nearest_bundle(x) {
        var panel_left = Math.floor($('#timeline .graph_panel').offset().left);
        x -= panel_left + graph.margin.left;
        if (x < 0) x = 0;
        var tic = x * graph.x_axis.max_hours / graph.x_axis.width;
        var bundle_idx = graph.timeslots[Math.min(graph.x_axis.max_hours-1, Math.floor(tic))];
        var bundle = graph.bundles[bundle_idx];
        var start = bundle.start_time;
        var end = bundle.end_time;
        return (tic <= ((start+end)/2) ? bundle_idx : bundle_idx+1);
    }

    //========================================================================
    // Convert a bundle_idx to a graph hour offset.
    //------------------------------------------------------------------------
    function bundle_to_tic(bundle_idx) {
        if (bundle_idx >= graph.bundles.length) return graph.x_axis.max_hours;
        return graph.bundles[bundle_idx].start_time;
    }

    //========================================================================
    // Convert a bundle_idx to a graph X offset.
    //------------------------------------------------------------------------
    function bundle_to_x(bundle_idx) {
        return Math.round(bundle_to_tic(bundle_idx) * graph.tic_spacing);
    }

    //========================================================================
    // Open the settings dialog
    //-------------------------------------------------------------------
    function open_settings() {
        var config = {
            script_id: 'timeline',
            title: 'Ultimate Timeline',
            on_save: settings_saved,
            content: {
                tabs: {type:'tabset', content: {
                    pgGraph: {type:'page', label:'Graph', hover_tip:'Graph Settings', content: {
                        grpPlacement: {type:'group', label:'Placement', content:{
                            placement: {type:'dropdown', label:'Placement on Dashboard', default:'before_nextreview', content:{before_nextreview:'Before "Next Review"',after_nextreview:'After "Next Review"',after_srsprogress:'After "SRS Progress"',after_levelprogress:'After "Level Progress"',after_unlocks:'After "New Unlocks"',after_recentchat:'After Recent Forum Activity'}, hover_tip:'Choose where the timeline will\nbe positioned on the dashboard.'},
                        }},
                        grpTime: {type:'group', label:'Time', content:{
                            time_format: {type:'dropdown', label:'Time Format', default:'12hour', content:{'12hour':'12-hour','24hour':'24-hour'}, hover_tip:'Display time in 12 or 24-hour format.'},
                            max_days: {type:'number', label:'Slider Range Max (days)', min:1, max:125, default:7, hover_tip:'Choose maximum range of the timeline slider (in days).'},
                        }},
                        grpBars: {type:'group', label:'Bars', content:{
                            max_bar_width: {type:'number', label:'Max Bar Width (pixels)', default:0, hover_tip:'Set the maximum bar width (in pixels).\n(0 = unlimited)'},
                            max_bar_height: {type:'number', label:'Max Graph Height (reviews)', default:0, hover_tip:'Set the maximum graph height (in reviews).\n(0 = unlimited)\nUseful for when you have a huge backlog.'},
                            fixed_bar_height: {type:'checkbox', label:'Force Graph to Max Height', default:false, hover_tip:'Force the graph height to always be the Max Graph Height.\nUseful when limiting the number of reviews you do in one sitting.'},
                            bar_style: {type:'dropdown', label:'Bar Style', default:'item_type', content:{'count':'Review Count','item_type':'Item Type','srs_stage':'SRS Level','level':'Level'}, hover_tip:'Choose how bars are subdivided.'},
                            srs_curr_next: {type:'dropdown', label:'Current / Next SRS Level', default:'curr', content:{'curr':'Current SRS Level','next':'Next SRS Level'}, hover_tip:'Select whether SRS is color-coded by\ncurrent SRS level, or next SRS level.'},
                        }},
                        grpMarkers: {type:'group', label:'Markers', content:{
                            current_level_markers: {type:'dropdown', label:'Current Level Markers', default:'rkv', content:{'none':'None','rk':'Rad + Kan','rkv':'Rad + Kan + Voc'}, hover_tip:'Select which item types will trigger a Current Level\nmarker at the bottom of the graph.'},
                            burn_markers: {type:'dropdown', label:'Burn Markers', default:'show', content:{'show':'Show','hide':'Hide'}, hover_tip:'Select whether Burn markers are shown\nat the bottom of the graph.'},
                        }},
                    }},
                    pgReviewDetails: {type:'page', label:'Review Details', hover_tip:'Review Details Pop-up', content: {
                        show_review_details: {type:'dropdown', label:'Show Review Details', default:'full', content:{'none':'None','summary':'Summary','item_list':'Item List','full':'Full Item Details'}, hover_tip:'Choose the level of detail to display\nwhen a bar or time range is selected.'},
                        review_details_summary: {type:'dropdown', label:'Review Details Summary', default:'item_type', content:{'count':'Review Count','item_type':'Item Type','srs_stage':'SRS Level','level':'Level'}, hover_tip:'Choose which summary information to\ndisplay on the Review Details pop-up.'},
                        review_details_buttons: {type:'checkbox', label:'Show Review Details Buttons', default:true, hover_tip:'Show configuration buttons on Review Details pop-up.'},
                        show_bar_style_dropdown: {type:'checkbox', label:'Show Bar Style Dropdown', default:false, hover_tip:'Show the Bar Style dropdown above the timeline.'},
                    }},
                }},
            }
        };
        var settings_dialog = new wkof.Settings(config);
        settings_dialog.open();
    }

    //========================================================================
    // Get the number of hours per bar.
    //-------------------------------------------------------------------
    function get_hours_per_bar() {
        graph.x_axis.width = graph.elem.width() - graph.margin.left;
        graph.x_axis.max_hours = Math.round(settings.days * 24);

        // No more than 1 label every 50 pixels
        var min_pixels_per_label = 50;
        graph.min_hours_per_label = min_pixels_per_label * graph.x_axis.max_hours / graph.x_axis.width;
        xscale.idx = 0;
        while ((xscale.hours_per_label[xscale.idx] <= graph.min_hours_per_label) &&
               (xscale.idx < xscale.hours_per_label.length-1)) {
            xscale.idx++;
        }

        return xscale.bundle_choices[xscale.idx];
    }

    //========================================================================
    // Map letters in the xscale chart to corresponding label-generating functions.
    //-------------------------------------------------------------------
    var label_functions = {
        'm': month_label,
        'w': week_label,
        'D': mday_label,
        'd': day_label,
        'h': hour_label,
        '-': no_label,
    };

    //========================================================================
    // Functions for generating time-scale labels
    //-------------------------------------------------------------------
    function month_label(date, qty, use_short) {
        if (date.getHours() !== 0 || date.getDate() !== 1) return;
        return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][date.getMonth()];
    }
    //-------------------------------------------------------------------
    function week_label(date, qty, use_short) {
        if (date.getHours() !== 0 || date.getDay() !== 0) return;
        return (use_short ? 'S' : 'Sun');
    }
    //-------------------------------------------------------------------
    function mday_label(date, qty, use_short) {
        if (date.getHours() !== 0) return;
        var mday = date.getDate();
        if (mday % qty !== 0) return;
        return mday;
    }
    //-------------------------------------------------------------------
    function day_label(date, qty, use_short) {
        if (date.getHours() !== 0) return;
        var label = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][date.getDay()];
        return (use_short ? label[0] : label);
    }
    //-------------------------------------------------------------------
    function hour_label(date, qty, use_short) {
        var hh = date.getHours();
        if ((hh % qty) !== 0) return;
        if (settings.time_format === '24hour') {
            return ('0'+hh+':00').slice(-5);
        } else {
            return (((hh + 11) % 12) + 1) + 'ap'[Math.floor(hh/12)] + 'm';
        }
    }
    //-------------------------------------------------------------------
    function no_label() {return;}
    //-------------------------------------------------------------------

    //========================================================================
    // Draw the timeline
    //-------------------------------------------------------------------
    function draw_timeline() {
        var panel = graph.elem,
            panel_height = settings.graph_height,
            panel_width = graph.elem.width(),
            graph_height = panel_height - (graph.margin.top + graph.margin.bottom);

        var match = xscale.red_tic_choices[xscale.idx].match(/^(\d*)(.)(s?)$/);
        var red_qty = Number(match[1]);
        var red_func = label_functions[match[2]];
        var red_use_short = (match[3] === 's');

        match = xscale.major_tic_choices[xscale.idx].match(/^(\d*)(.)(s?)$/);
        var maj_qty = Number(match[1]);
        var maj_func = label_functions[match[2]];
        var maj_use_short = (match[3] === 's');

        match = xscale.minor_tic_choices[xscale.idx].match(/^(\d*)(.)(s?)$/);
        var min_qty = Number(match[1]);
        var min_func = label_functions[match[2]];
        var min_use_short = (match[3] === 's');

        var bundle_size = xscale.bundle_choices[xscale.idx];

        // String for building html.
        var grid = '';
        var label_x = [];
        var label_y = '';
        var bars = '', bar_overlays = '';
        var markers = '';

        //=================================
        // Draw vertical axis grid

        // Calculate major and minor vertical graph tics.
        var inc_s = 1, inc_l = 5;
        var max_reviews = graph.max_reviews;
        if (settings.max_bar_height > 0) {
            if (settings.fixed_bar_height || (max_reviews > settings.max_bar_height)) max_reviews = settings.max_bar_height;
        }
        while (Math.ceil(max_reviews / inc_s) > 5) {
            switch (inc_s.toString()[0]) {
                case '1': inc_s *= 2; inc_l *= 2; break;
                case '2': inc_s = Math.round(2.5 * inc_s); break;
                case '5': inc_s *= 2; inc_l *= 5; break;
            }
        }

        // Draw vertical graph tics (# of Reviews).
        var tic_class, y;
        graph.y_axis.max_reviews = Math.max(3, Math.ceil(max_reviews / inc_s) * inc_s);
        for (var tic = 0; tic <= graph.y_axis.max_reviews; tic += inc_s) {
            tic_class = ((tic % inc_l) === 0 ? 'major' : 'minor');
            y = (graph.margin.top + graph_height) - Math.round(graph_height * (tic / graph.y_axis.max_reviews));
            if (tic > 0) {
                grid += '<path class="'+tic_class+'" d="M'+graph.margin.left+','+y+'h'+graph.x_axis.width+'" />';
            }
            label_y += '<text class="'+tic_class+'" x="'+(graph.margin.left-4)+'" y="'+y+'" dy="0.4em">'+tic+'</text>';
        }

        //=================================
        // Draw horizontal axis grid

        graph.tic_spacing = (graph.x_axis.width) / (graph.x_axis.max_hours); // Width of a time slot.
        var prev_label = -9e10;
        for (var tic_idx = 0; tic_idx < graph.x_axis.max_hours; tic_idx++) {
            var time = new Date(graph.start_time.getTime() + tic_idx * 3600000);

            var red_label = red_func(time, red_qty, red_use_short);
            var maj_label = maj_func(time, maj_qty, maj_use_short);
            var min_label = min_func(time, min_qty, min_use_short);

            var x = graph.margin.left + Math.round((tic_idx - time_shift/60) * graph.tic_spacing);
            var label;
            if (red_label) {
                if (tic_idx > 0) grid += '<path class="redtic" d="M'+x+',0v'+(graph.margin.top+graph_height-1)+'" />';
                if (!maj_use_short && tic_idx - prev_label < graph.min_hours_per_label*0.58) label_x.pop();
                label_x.push('<text class="redtic" x="'+(x+4)+'" y="'+(graph.margin.top-8)+'">'+red_label+'</text>');
                prev_label = tic_idx;
            } else if (maj_label) {
                if (tic_idx > 0) grid += '<path class="major" d="M'+x+',0v'+(graph.margin.top+graph_height-1)+'" />';
                if (maj_use_short || tic_idx - prev_label > graph.min_hours_per_label*0.58) {
                    label_x.push('<text class="major" x="'+(x+4)+'" y="'+(graph.margin.top-8)+'">'+maj_label+'</text>');
                    prev_label = tic_idx;
                }
            } else if (min_label) {
                if (tic_idx > 0) grid += '<path class="minor" d="M'+x+','+(graph.margin.top-6)+'v'+(graph_height+6)+'" />';
            }
        }

        //=================================
        // Draw bars

        var min_bar_height = Math.ceil(graph.y_axis.max_reviews / graph.y_axis.height);
        for (var bundle_idx in graph.bundles) {
            var bundle = graph.bundles[bundle_idx];
            var bar_parts = [];
            var stats = bundle.stats;

            var x1 = Math.round(bundle.start_time * graph.tic_spacing);
            var x2 = Math.round(bundle.end_time * graph.tic_spacing);
            if (settings.max_bar_width > 0) x2 = Math.min(x1 + settings.max_bar_width, x2);

            switch (settings.bar_style) {
                case 'count':
                    if (stats.count) bar_parts.push({class:'count', height:stats.count});
                    break;

                case 'item_type':
                    if (stats.rad) bar_parts.push({class:'rad', height:stats.rad});
                    if (stats.kan) bar_parts.push({class:'kan', height:stats.kan});
                    if (stats.voc) bar_parts.push({class:'voc', height:stats.voc});
                    break;

                case 'srs_stage':
                    if (stats.appr) bar_parts.push({class:'appr', height:stats.appr});
                    if (stats.guru) bar_parts.push({class:'guru', height:stats.guru});
                    if (stats.mast) bar_parts.push({class:'mast', height:stats.mast});
                    if (stats.enli) bar_parts.push({class:'enli', height:stats.enli});
                    if (stats.burn) bar_parts.push({class:'burn', height:stats.burn});
                    break;

                case 'level':
                    for (var grp_idx = 0; grp_idx <= 5; grp_idx++) {
                        var grp_name = 'lvlgrp'+grp_idx;
                        if (stats[grp_name]) bar_parts.push({class:'lvlgrp'+grp_idx, height:stats[grp_name]});
                    }
                    break;
            }
            var bar_offset = 0;
            for (var part_idx in bar_parts) {
                var part = bar_parts[part_idx];
                if ((part_idx == bar_parts.length-1) && (bar_offset + part.height < min_bar_height)) {
                    part.height = min_bar_height - bar_offset;
                }
                bars += '<rect class="bar '+part.class+'" x="'+(x1+1)+'" y="'+bar_offset+'" width="'+(x2-x1-3)+'" height="'+part.height+'" />';
                bar_offset += part.height;
            }
            if (bar_parts.length > 0) {
                bar_overlays += '<rect class="bar overlay" x="'+x1+'" y="0" width="'+(x2-x1)+'" height="'+graph.y_axis.max_reviews+'" data-bundle="'+bundle_idx+'" />';
            }

            var marker_x;
            marker_x = graph.margin.left + Math.floor((x1+x2)/2);
            if (bundle.stats.has_curr_marker && settings.current_level_markers !== 'none') {
                markers += '<path class="cur" d="M'+marker_x+','+(graph.margin.top+graph_height+1)+'l-3,6h6z" />';
            }
            if ( bundle.stats.burn_count > 0 && settings.burn_markers === 'show') {
                markers += '<path class="bur" d="M'+marker_x+','+(graph.margin.top+graph_height+8)+'l-3,6h6z" />';
            }
        }

        //=================================
        // Assemble the HTML

        panel.html(
            '<svg class="graph noselect" width="'+panel_width+'" height="'+panel_height+'">'+
            '  <rect class="bkgd" x="'+graph.margin.left+'" y="'+graph.margin.top+'" width="'+graph.x_axis.width+'" height="'+graph_height+'" />'+
            '  <g class="grid" transform="translate(0.5,0.5)">'+
            grid+
            '    <path class="shadow" d="M'+(graph.margin.left-2)+',0v'+(graph.margin.top+graph_height)+',h'+(graph.margin.left+graph.x_axis.width+1)+'" />'+
            '    <path class="light" d="M'+(graph.margin.left-1)+',0v'+(graph.margin.top+graph_height-1)+'" />'+
            '    <path class="light" d="M'+(graph.margin.left-2)+','+(graph.margin.top+graph_height+1)+'h'+(graph.margin.left+graph.x_axis.width+1)+'" />'+
            '  </g>'+
            '  <g class="label-x">'+
            label_x.join('')+
            '  </g>'+
            '  <g class="label-y">'+
            label_y+
            '  </g>'+
            '  <g class="markers" transform="translate(0.5,0.5)">'+
            markers+
            '  </g>'+
            '  <g class="bars" transform="translate('+graph.margin.left+','+(graph.margin.top+graph_height)+') scale(1,'+(-1 * graph_height / graph.y_axis.max_reviews)+')">'+
            bars+
            bar_overlays+
            '  </g>'+
            '  <g class="resize_grip">'+
            '    <path class="shadow" d="M'+(panel_width-2)+','+panel_height+'l2,-2m0,-4l-6,6m-4,0l10,-10" />'+
            '    <path class="light" d="M'+(panel_width-3)+','+panel_height+'l3,-3m0,-4l-7,7m-4,0l11,-11" />'+
            '    <rect class="boundary" x="0" y="'+(panel_height-13)+'" width="'+panel_width+'" height="13" />'+
            '  </g>'+
            '  <g class="highlight">'+
            '    <rect class="marker" transform="translate(-100,0.5)" x="'+graph.margin.left+'" y="'+graph.margin.top+'" width="0" height="'+graph_height+'" />'+
            '    <path class="marker start" transform="translate(-100,0)" d="M'+graph.margin.left+','+(graph.margin.top-1)+'l-3,-5h6l-3,5v'+(graph_height+1)+'" />'+
            '    <path class="marker end" transform="translate(-100,0)" d="M'+graph.margin.left+','+(graph.margin.top-1)+'l-3,-5h6l-3,5v'+(graph_height+1)+'" />'+
            '    <rect class="boundary" x="'+(graph.margin.left-2)+'" y="0" width="'+(graph.x_axis.width+2)+'" height="'+graph.margin.top+'" />'+
            '  </g>'+
            '</svg>'
        );
        panel.height(panel_height);

        // Attach event handlers
        panel.find('.resize_grip .boundary').on('mousedown touchstart', resize_panel);
        panel.find('.highlight .boundary').on('mouseenter mouseleave mousemove mousedown touchstart', highlight_hover);
        panel.find('.bar.overlay').on('mouseenter mouseleave', bar_hover);
        panel.find('.bar.overlay').on('click', bar_click);
    }

    //========================================================================
    // Event handler for clicking timeline bars.
    //-------------------------------------------------------------------
    function bar_click(e) {
        if (settings.show_review_details === 'none') return;
        if (highlight.highlighted) hide_highlight();
        var bundle_idx = Number(e.target.attributes['data-bundle'].value);
        highlight.start = bundle_idx;
        highlight.end = bundle_idx + 1;
        highlight.highlighted = true;
        graph.elem.off('.bar_hover_move');
        show_review_info(true /* sticky */, e);
    }

    //========================================================================
    // Event handler for hovering over timeline bars.
    //-------------------------------------------------------------------
    function bar_hover(e) {
        if (settings.show_review_details === 'none') return;
        if (highlight.highlighted) return;
        switch (e.type) {
            case 'mouseenter':
                var bundle_idx = Number(e.target.attributes['data-bundle'].value);
                highlight.start = bundle_idx;
                highlight.end = bundle_idx + 1;
                show_review_info(false /* sticky */, e);
                graph.elem.on('mousemove.bar_hover_move', function(e){
                    graph.review_info.css('top', e.clientY - e.target.getBoundingClientRect().top - 30);
                });
                break;

            case 'mouseleave':
                graph.elem.off('.bar_hover_move');
                hide_review_info();
                break;
        }
    }

    //========================================================================
    // Build and display the Review Info pop-up.
    //-------------------------------------------------------------------
    function show_review_info(sticky, e) {
        var info = $('#timeline .review_info');
        if (sticky) {
            $('body').off('.timeline_hideinfo');
            setTimeout(function(){
                $('body').on('click.timeline_hideinfo', function(e){
                    $('body').off('.timeline_hideinfo');
                    hide_highlight();
                    hide_review_info();
                });
            }, 10);
        }

        var start = Math.min(highlight.start, highlight.end);
        var end = Math.max(highlight.start, highlight.end);

        var bundle = {items:[]};
        for (var bundle_idx = start; bundle_idx < end; bundle_idx++) {
            bundle.items = bundle.items.concat(graph.bundles[bundle_idx].items);
        }

        calc_bundle_stats(bundle);

        // Print the date or date range.
        var allow_now = ((start === 0) && (graph.bundle_size === 1));
        var html = '<div>';
        html += format_date(new Date(graph.start_time.getTime() + bundle_to_tic(start) * 3600000), allow_now);
        if (((end-start) > 1) || (graph.bundle_size > 1)) {
            html += ' to ' + format_date(new Date(graph.start_time.getTime() + bundle_to_tic(end) * 3600000));
        }
        html += '</div>';

        // Populate item type summaries.
        html += '<div class="summary">';
        html += '<div class="tot">'+(bundle.stats.count)+' reviews</div>';
        html += '<div class="indent">';

        html += '<div class="item_type rad"><span class="fixed">'+(bundle.stats.rad || 0)+'</span> radicals</div>';
        html += '<div class="item_type kan"><span class="fixed">'+(bundle.stats.kan || 0)+'</span> kanji</div>';
        html += '<div class="item_type voc"><span class="fixed">'+(bundle.stats.voc || 0)+'</span> vocabulary</div>';

        html += '<div class="srs_stage appr"><span class="fixed">'+(bundle.stats.appr || 0)+'</span> apprentice</div>';
        html += '<div class="srs_stage guru"><span class="fixed">'+(bundle.stats.guru || 0)+'</span> guru</div>';
        html += '<div class="srs_stage mast"><span class="fixed">'+(bundle.stats.mast || 0)+'</span> master</div>';
        html += '<div class="srs_stage enli"><span class="fixed">'+(bundle.stats.enli || 0)+'</span> enlightened</div>';
        if (settings.srs_curr_next === 'next') {
            html += '<div class="srs_stage burn"><span class="fixed">'+(bundle.stats.burn || 0)+'</span> burn</div>';
        }

        html += '<div class="level lvlgrp0"><span class="fixed">'+(bundle.stats.lvlgrp0 || 0)+'</span> levels 1-10</div>';
        html += '<div class="level lvlgrp1"><span class="fixed">'+(bundle.stats.lvlgrp1 || 0)+'</span> levels 11-20</div>';
        html += '<div class="level lvlgrp2"><span class="fixed">'+(bundle.stats.lvlgrp2 || 0)+'</span> levels 21-30</div>';
        html += '<div class="level lvlgrp3"><span class="fixed">'+(bundle.stats.lvlgrp3 || 0)+'</span> levels 31-40</div>';
        html += '<div class="level lvlgrp4"><span class="fixed">'+(bundle.stats.lvlgrp4 || 0)+'</span> levels 41-50</div>';
        html += '<div class="level lvlgrp5"><span class="fixed">'+(bundle.stats.lvlgrp5 || 0)+'</span> levels 51-60</div>';

        html += '</div>';

        if ((bundle.stats.curr_count > 0) || (bundle.stats.burn_count > 0)) {
            html += '<div class="indent">';
            if (bundle.stats.curr_count > 0) html += '<div class="cur"><span class="fixed">'+bundle.stats.curr_count+'</span> Current Level</div>';
            if (bundle.stats.burn_count > 0) html += '<div class="bur"><span class="fixed">'+bundle.stats.burn_count+'</span> Burn Item'+(bundle.stats.burn_count > 1 ? 's' : '')+'</div>';
            html += '</div>';
        }

        html += '</div>';

        if (settings.review_details_buttons) {
            html += '<div class="detail_buttons">';
            html += '<button class="count">Review Count</button>';
            html += '<button class="item_type">Item Type</button>';
            html += '<button class="srs_stage">SRS Level</button>';
            html += '<button class="level">Level</button>';
            html += '</div>';
        }

        if (settings.show_review_details === 'item_list' || settings.show_review_details === 'full') {
            html = populate_item_list(bundle, html);
        }

        info.find('.inner').html(html);
        graph.review_info = info;

        var num_width = bundle.stats.count.toString();
        info.find('.summary .fixed').css('width', (num_width.toString().length * 9 + 8) + 'px');

        var top, left, right, width;
        var half_width = graph.x_axis.width/2;
        var x = bundle_to_x(start);
        info.css('max-width', half_width);
        if (highlight.dragging) {
            top = graph.margin.top + graph.y_axis.height + graph.margin.bottom;
            if (x < half_width) {
                left = graph.margin.left + x;
                info.css({left:left, right:'auto', top:top});
            } else {
                right = 0;
                info.css({left:'auto', right:right, top:top});
                if (x < graph.x_axis.width - info.outerWidth()) {
                    left = graph.margin.left + x;
                    info.css({left:left, right:'auto', top:top});
                }
            }
        } else if (e) {
            top = e.clientY - e.target.getBoundingClientRect().top - 30;
            if (x < half_width) {
                left = graph.margin.left + bundle_to_x(start+1) + 4;
                info.css({left:left, right:'auto', top:top});
            } else {
                right = graph.x_axis.width - bundle_to_x(start) + 4;
                info.css({left:'auto', right:right, top:top});
            }
        }

        info.removeClass('hidden');
    }

    //========================================================================
    // Populate the list of items present in a time bundle.
    //-------------------------------------------------------------------
    function populate_item_list(bundle, html) {
        var srs_to_class = {
            curr: ['appr','appr','appr','appr','appr','guru','guru','mast','enli'],
            next: ['appr','appr','appr','appr','guru','guru','mast','enli','burn']
        };
        html += '<div class="item_info hidden"></div><ul class="item_list">';
        for (var item_idx in bundle.items) {
            var item = bundle.items[item_idx];
            var classes = [
                item.object.slice(0,3),
                srs_to_class[settings.srs_curr_next][item.assignments.srs_stage],
                'lvlgrp'+Math.floor((item.data.level-1)/10)
            ];
            var item_name;
            if (item.object === 'radical') {
                if (item.data.characters) {
                    html += '<li class="'+classes.join(' ')+'">'+item.data.characters+'</li>';
                } else {
                    html += '<li class="'+classes.join(' ')+'" data-radname="'+item.data.slug+'">...</li>';
                    var selector = '#timeline .review_info .item_list > li[data-radname="'+item.data.slug+'"]';
                    load_radical_svg(item).then(populate_radical_svg.bind(null, selector));
                }
            } else {
                html += '<li class="'+classes.join(' ')+'">'+item.data.slug+'</li>';
            }
        }
        html += '</ul>';
        return html;
    }

    //========================================================================
    // Insert an svg into a specified DOM element.
    //-------------------------------------------------------------------
    function populate_radical_svg(selector, svg) {
        $(selector).html(svg);
    }

    //========================================================================
    // Event handler for buttons on the Review Info pop-up.
    //-------------------------------------------------------------------
    function detail_button_clicked(e) {
        var mode = e.target.className;
        $('#timeline .review_info').attr('data-mode', mode);
        settings.review_details_summary = mode;
        save_settings();
    }

    //========================================================================
    // Event handler for hovering over an item in the Review Detail pop-up.
    //-------------------------------------------------------------------
    function item_hover(e) {
        if (settings.show_review_details !== 'full') return;
        var info = $('#timeline .item_info');
        switch (e.type) {
            case 'mouseenter':
                var target = $(e.currentTarget);
                var item = graph.current_bundle.items[target.index()];
                var pos = target.position();
                info.css({top:pos.top+target.outerHeight()+3});
                populate_item_info(info, item);
                info.removeClass('hidden');
                break;

            case 'mouseleave':
                info.addClass('hidden');
                break;
        }
    }

    //========================================================================
    // Handler for resizing the timeline when the window size changes.
    //-------------------------------------------------------------------
    function window_resized() {
        var new_width = graph.elem.width();
        if (new_width != graph.x_axis.width + graph.margin.left) {
            bundle_by_timeslot();
            draw_timeline();
        }
    }

    //========================================================================
    // Generate the HTML content of the Item Detail pop-up.
    //-------------------------------------------------------------------
    function populate_item_info(info, item) {
        var html;
        switch (item.object) {
            case 'radical':
                if (item.data.characters) {
                    html = '<span class="item">Radical: <span class="slug" lang="ja">'+item.data.characters+'</span></span><br>';
                } else {
                    html = '<span class="item">Radical: <span class="slug" data-radname="'+item.data.slug+'">...</span></span><br>';
                    var selector = '#timeline .item_info [data-radname="'+item.data.slug+'"]';
                    load_radical_svg(item).then(populate_radical_svg.bind(null, selector));
                }
                break;

            case 'kanji':
                html = '<span class="item">Kanji: <span class="slug" lang="ja">'+item.data.slug+'</span></span><br>';
                html += get_important_reading(item)+'<br>';
                break;

            case 'vocabulary':
                html = '<span class="item">Vocab: <span class="slug" lang="ja">'+item.data.slug+'</span></span><br>';
                html += 'Reading: '+get_reading(item)+'<br>';
                break;
        }
        html += 'Meaning: '+get_meanings(item)+'<br>';
        html += 'Level: '+item.data.level+'<br>';
        html += 'SRS Level: '+item.assignments.srs_stage_name;
        info.html(html);
    }

    //========================================================================
    // Load a radical's svg file.
    //-------------------------------------------------------------------
    function load_radical_svg(item) {
        var promise = graph.radical_cache[item.data.slug];
        if (promise) return promise;
        if (item.data.character_images.length === 0) return promise;
        var url = item.data.character_images.filter(function(img){
            return (img.content_type === 'image/svg+xml' && !img.metadata.inline_styles);
        })[0].url;
        promise = wkof.load_file(url);
        graph.radical_cache[item.data.slug] = promise;
        return promise;
    }

    //========================================================================
    // Extract the meanings (including synonyms) from an item.
    //-------------------------------------------------------------------
    function get_meanings(item) {
        var meanings = [];
        if (item.study_materials && item.study_materials.meaning_synonyms) {
            meanings = item.study_materials.meaning_synonyms;
        }
        meanings = meanings.concat(item.data.meanings.map(meaning => meaning.meaning));
        return to_title_case(meanings.join(', '));
    }

    //========================================================================
    // Extract the 'important' readings from a kanji.
    //-------------------------------------------------------------------
    function get_important_reading(item) {
        var readings = item.data.readings.filter(reading => reading.primary);
        return to_title_case(readings[0].type)+': '+readings.map(reading => reading.reading).join(', ');
    }

    //========================================================================
    // Extract the list of readings from an item.
    //-------------------------------------------------------------------
    function get_reading(item) {
        return item.data.readings.map(reading => reading.reading).join(', ');
    }

    //========================================================================
    // Hide the Review Info pop-up.
    //-------------------------------------------------------------------
    function hide_review_info() {
        $('#timeline .review_info').addClass('hidden');
    }

    //========================================================================
    // Generate a formatted date string.
    //-------------------------------------------------------------------
    function format_date(time, allow_now) {
        var str;
        if (allow_now && time.getTime() >= graph.start_time.getTime()) return 'Now';
        if (time.getDate() === (new Date()).getDate()) {
            str = 'Today';
        } else {
            str = 'SunMonTueWedThuFriSat'.substr(time.getDay()*3, 3);
        }
        if (settings.time_format === '24hour') {
            str += ' ' + ('0' + time.getHours()).slice(-2) + ':' + ('0'+time_shift).slice(-2);
        } else {
            str += ' ' + ('0' + (((time.getHours()+11)%12)+1)).slice(-2) + ':'+('0'+time_shift).slice(-2) + 'ap'[Math.floor(time.getHours()/12)] + 'm';
        }
        return str;
    }

    //========================================================================
    // Fetch item info, and redraw the timeline.
    //-------------------------------------------------------------------
    function fetch_and_update() {
        return wkof.ItemData.get_items('subjects, assignments, study_materials')
        .then(process_items)
        .then(draw_timeline);
    }

    //========================================================================
    // Process the fetched items.
    //-------------------------------------------------------------------
    function process_items(fetched_items) {
        // Remove any unlearned items.
        graph.items = [];
        for (var idx in fetched_items) {
            var item = fetched_items[idx];
            if (!item.assignments || !item.assignments.available_at || item.assignments.srs_stage <= 0) continue;
            if (item.data.level > wkof.user.level) continue;
            graph.items.push(item);
        }

        graph.items.sort(function(a, b) {
            return (new Date(a.assignments.available_at).getTime() - new Date(b.assignments.available_at).getTime());
        });

        bundle_by_timeslot();
        update_slider_reviews();
    }

    //========================================================================
    // Bundle the items into timeslots.
    //-------------------------------------------------------------------
    function bundle_by_timeslot() {
        var bundle_size = graph.bundle_size = get_hours_per_bar();
        var bundles = graph.bundles = [];
        var timeslots = graph.timeslots = [];

        // Rewind the clock to the start of a bundle period.
        var start_time = toStartOfUTCHour(new Date());
        while (start_time.getHours() % bundle_size !== 0) start_time = new Date(start_time.getTime() - 3600000);
        graph.start_time = start_time;

        // Find the tic of the last bundle (round down if only a partial).
        graph.total_reviews = 0;
        graph.max_reviews = 0;
        var hour = 0, item_idx = 0, item_count = 0;
        var bundle = {start_time:hour, items:[]};
        while (true) {
            timeslots.push(bundles.length);
            hour++;
            // Check if we're past end of the timeline (including rounding up to the nearest bundle)
            // Need to use date function to account for time shifts (e.g. Daylight Savings Time)
            var time = new Date(start_time.getTime() + hour * 3600000);
            if ((time.getHours() % bundle_size) !== 0) continue;

            var start_idx = item_idx;
            while ((item_idx < graph.items.length) &&
                   (new Date(graph.items[item_idx].assignments.available_at) < time)) {
                item_idx++;
            }

            bundle.items = graph.items.slice(start_idx, item_idx);
            bundle.end_time = hour;
            calc_bundle_stats(bundle);
            graph.bundles.push(bundle);

            graph.total_reviews += bundle.items.length;
            if (bundle.items.length > graph.max_reviews) graph.max_reviews = bundle.items.length;
            if (hour >= graph.x_axis.max_hours) break;

            bundle = {start_time:hour, items:[]};
        }
        graph.x_axis.max_hours = hour;
    }

    //========================================================================
    // Calculate stats for a bundle
    //-------------------------------------------------------------------
    function calc_bundle_stats(bundle) {
        var itype_to_int = {radical:0, kanji:1, vocabulary:2};
        var itype_to_class = {radical:'rad', kanji:'kan', vocabulary:'voc'};
        var srs_to_class = {
            curr: ['appr','appr','appr','appr','appr','guru','guru','mast','enli'],
            next: ['appr','appr','appr','appr','guru','guru','mast','enli','burn']
        };
        bundle.items.sort(function(a, b){
            var a_itype = itype_to_int[a.object];
            var b_itype = itype_to_int[b.object];
            if (a_itype !== b_itype) return a_itype - b_itype;
            if (a.data.level !== b.data.level) return a.data.level - b.data.level;
            return a.data.slug.localeCompare(b.data.slug);
        });
        bundle.stats = {
            count:0,
            rad:0, kan:0, voc:0,
            appr:0, guru:0, mast:0, enli:0, burn:0,
            lvlgrp0:0, lvlgrp1:0, lvlgrp2:0, lvlgrp3:0, lvlgrp4:0, lvlgrp5:0,
            curr_count: 0,
            has_curr_marker: false,
            burn_count: 0
        };
        var stats = bundle.stats;
        for (var item_idx in bundle.items) {
            var item = bundle.items[item_idx];
            stats.count++;
            stats[itype_to_class[item.object]]++;
            stats[srs_to_class[settings.srs_curr_next][item.assignments.srs_stage]]++;
            stats['lvlgrp'+Math.floor((item.data.level-1)/10)]++;
            if (item.data.level === wkof.user.level) {
                stats.curr_count++;
                if (settings.current_level_markers.indexOf(item.object[0]) >= 0) {
                    stats.has_curr_marker = true;
                }
            }
        }
        bundle.stats.burn_count = bundle.stats[srs_to_class[settings.srs_curr_next][8]];
        graph.current_bundle = bundle;
    }

    //========================================================================
    // Return the timestamp of the beginning of the current UTC hour.
    //-------------------------------------------------------------------
    function toStartOfUTCHour(date) {
        var d = (date instanceof Date ? date.getTime() : date);
        d = Math.floor(d/3600000)*3600000;
        return (date instanceof Date ? new Date(d) : d);
    }

    //========================================================================
    // Start a timer to refresh the timeline (without fetch) at the top of the hour.
    //-------------------------------------------------------------------
    function start_refresh_timer() {
        var now = Date.now();
        var next_hour = toStartOfUTCHour(now) + 3601000; // 1 second past the next UTC hour.
        var wait_time = (next_hour - now);
        setTimeout(function(){
            bundle_by_timeslot();
            update_slider_reviews();
            draw_timeline();
            start_refresh_timer();
        }, wait_time);
    }

})(window.timeline);
