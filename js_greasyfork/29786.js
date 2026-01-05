// ==UserScript==
// @name        WaniKani Ultimate Timeline (Basic Edition)
// @namespace   rfindley
// @description Review schedule explorer for WaniKani
// @version     6.5.1
// @include     https://www.wanikani.com/
// @include     https://www.wanikani.com/dashboard
// @include     https://www.wanikani.com/settings/account
// @include     https://www.wanikani.com/review/session*
// @include     https://www.wanikani.com/lesson/session*
// @copyright   2015+, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29786/WaniKani%20Ultimate%20Timeline%20%28Basic%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/29786/WaniKani%20Ultimate%20Timeline%20%28Basic%20Edition%29.meta.js
// ==/UserScript==

window.wktimeln = {};

(function(gobj) {
    var settings = {
        '24hour': false,
        'jp_font': 'Meiryo',
        'show_detail': true,
        'rescale_redraw': true,
        'mark_current': true,
        'mark_current_vocab': true,
        'graph_height': 80,
        'max_days': 7,
        'show_current_bars': true,
        'show_burn_bars': true,
        'summary_bar_only': false,
        'placement': 'before_nextreview',
        'minimized': false
    };

    // A list of Japanese fonts to appear in the Settings menu.
    var jp_fonts = ['default','Hiragino Kaku Gothic Pro','Meiryo','Meiryo UI','Osaka','Yu Gothic','Yu Gothic UI','ヒラギノ角ゴ Pro W3','メイリオ','ＭＳ Ｐゴシック','sans-serif'];

    var levels_per_fetch = 15,
        ms_betw_fetches = 250,

        graph_width_left = 20,
        graph_height_top = 20,
        graph_height_bottom = 22,

        max_reviews, graph_hours, graph_reviews = 0, graph_review_total = 0,
        graph_height_panel, graph_height, graph_width_panel, graph_width, graph_width_bar,
        graph_hilight_x1, graph_hilight_x2, graph_hilight_mode = 0,
        graph_range_slot1, graph_range_slot2, graph_detail_items, show_detail_while_dragging = true,

        api_key, user_level = 1, user_data, timeline, status_div, calc_time, current_slot,
        detail_latched = false, next_review, last_review, last_unlock, last_fetch, first_draw = true;

    var srslvls = ['Apprentice 1','Apprentice 2','Apprentice 3','Apprentice 4','Guru 1','Guru 2','Master','Enlightened','Burned'];

    var css =
        '#graph-bar-info {'+
        '  position: absolute;'+
        '  padding: 4px 8px 8px 8px;'+
        '  color: #eeeeee;'+
        '  background-color: rgba(0,0,0,0.8);'+
        '  border-radius: 4px;'+
        '  font-weight: bold;'+
        '  z-index:2;'+
        '}'+
        '#graph-bar-info .summary {font-family:"Open Sans","Helvetica Neue",Helvetica,Arial,sans-serif; font-size:13px; max-width:140px;}'+
        '#graph-bar-info .summary div {padding:0px 8px;}'+
        '#graph-bar-info .summary .indent {padding:0;}'+
        '#graph-bar-info .summary .indent div {padding-left:16px;}'+
        '#graph-bar-info .summary .tot {color:#000000; background-color:#efefef; background-image:linear-gradient(to bottom, #efefef, #cfcfcf);}'+
        '#graph-bar-info .rad {background-color:#0096e7; background-image:linear-gradient(to bottom, #0af, #0093dd);}'+
        '#graph-bar-info .kan {background-color:#ee00a1; background-image:linear-gradient(to bottom, #f0a, #dd0093);}'+
        '#graph-bar-info .voc {background-color:#9800e8; background-image:linear-gradient(to bottom, #a0f, #9300dd); margin-bottom:8px;}'+
        '#graph-bar-info .summary .cur {text-align:center; font-style:italic; color:#000000; background-color:#ffff88; background-image:linear-gradient(to bottom, #ffffaa, #eeee77);}'+
        '#graph-bar-info .summary .bur {text-align:center; font-style:italic; color:#ffffff; background-color:#000000; background-image:linear-gradient(to bottom, #444444, #000000);}'+
        '#graph-bar-info .detail {margin: 8px 0 0 0; padding: 0px;}'+
        '#graph-bar-info .detail li {padding:0 3px; margin:1px 1px; display:inline-block; cursor:pointer; border-radius:4px; font-size:14px;}'+
        '#graph-bar-info .detail li img {height:0.8em; width:0.8em;}'+
        'div#graph-item-info {'+
        '  position: absolute;'+
        '  padding:8px;'+
        '  color: #eeeeee;'+
        '  background-color:rgba(0,0,0,0.8);'+
        '  border-radius:8px;'+
        '  font-family:"Open Sans","Helvetica Neue",Helvetica,Arial,sans-serif;'+
        '  font-weight: bold;'+
        '  z-index:3;'+
        '}'+
        '#graph-item-info .item {font-size:2em; line-height:1.2em;}'+
        '#graph-item-info .item img {height:1em; width:1em; vertical-align:bottom;}'+
        '#graph-item-info>div {padding:0 8px; background-color:#333333;}'+
        'section#timeln {margin-bottom: 0px; border-bottom: 1px solid #d4d4d4;}'+
        '#timeln-graph {height:116px;}'+
        '#timeln-graph div, #timeln-graph canvas {height:100%;width:100%;}'+
        '#timeln-graph div {border:1px solid #d4d4d4;}'+
        'form#range_form {'+
        '  float: right;'+
        '  margin-bottom: 0px;'+
        '  min-width: 50%;'+
        '  text-align: right;'+
        '}'+
        'section#timeln h4 {'+
        '  clear: none;'+
        '  float: left;'+
        '  height: 20px;'+
        '  margin-top: 0px;'+
        '  margin-bottom: 4px;'+
        '  font-weight: normal;'+
        '  margin-right: 12px;'+
        '}'+
        '@media (max-width: 767px) {section#timeln h4 {display: none;}}'+
        '.dashboard section.review-status {border-top: 1px solid #ffffff;}'+
        '.dashboard section.review-status ul li time {white-space: nowrap; overflow-x: hidden; height: 1.5em; margin-bottom: 0;}'+
        '#timeline {overflow:hidden;}'+
        '#timeline .grid {pointer-events:none;}'+
        '#timeline .grid polyline {fill:none;stroke:black;stroke-linecap:square;shape-rendering:crispEdges;}'+
        '#timeline .grid .light {stroke:#ffffff;}'+
        '#timeline .grid .shadow {stroke:#d5d5d5;}'+
        '#timeline .grid .major {opacity:0.05;}'+
        '#timeline .grid .minor {opacity:0;}'+
        '#timeline .grid .newday {stroke:#f22;opacity:0;}'+
        '#timeline .grid .max {stroke:#f22;opacity:0.05;}'+
        '#timeline text.newday {opacity:0;}'+
        '#timeline .label-x text {text-anchor:end;font-size:0.85em;}'+
        '#timeline .label-y text {text-anchor:end;font-size:0.85em;}'+
        '.noselect {-webkit-touch-callout:none; -webkit-user-select:none; -khtml-user-select:none; -moz-user-select:none; -ms-user-select:none; user-select:none; cursor:default;}'+
        '#timeline text {pointer-events:none;}'+
        '#timeline .bars rect {stroke:none;shape-rendering:crispEdges;}'+
        '#timeline .rad {fill:#00a1f1;}'+
        '#timeline .kan {fill:#f100a1;}'+
        '#timeline .voc {fill:#a100f1;}'+
        '#timeline .sum {fill:#294ddb;}'+
        '#timeline .bars .cur {fill:#ffffff;opacity:0;}'+
        '#timeline .bars .bur {fill:#000000;opacity:0.3;}'+
        '#timeline .bars .clr {fill:#000000;opacity:0;cursor:pointer;}'+
        '#timeline .arrows .bur {fill:#000000;stroke:#000000;stroke-width:1;}'+
        '#timeline .arrows .cur {fill:#ffffff;stroke:#000000;stroke-width:1;}'+
        '#timeline .hilight {pointer-events:none;}'+
        '#timeline .hilight path {fill:#00a1f1; stroke:#00a1f1; stroke-width:2;}'+
        '#timeline .hilight rect {fill:rgba(0,161,241,0.1); stroke:#00a1f1; stroke-width:1;}'+
        '#timeln-modal {position:absolute; top:0; left:0; width:100%; height:100%; float:left; z-index:10;}'+
        '#timeln .link {color:rgba(0,0,0,0.3); font-size:1.1em; text-decoration:none; cursor:pointer; margin-right:4px;}'+
        '#timeln .link:hover {color:rgba(255,31,31,0.5);}'+
        '#timeln svg.link:hover * {fill:rgb(255,31,31);}'+
        '#timeln .dialog {'+
        '  position:absolute;'+
        '  padding:8px;'+
        '  color:#eeeeee;'+
        '  background-color:#000;'+
        '  border-radius:8px;'+
        '  font-weight:bold;'+
        '  z-index:15;'+
        '}'+
        '#timeln .dialog h4 {'+
        '  width:100%;'+
        '  padding-bottom:4px;'+
        '  border-radius:4px;'+
        '  background-color:#f22;'+
        '  text-align:center;'+
        '  margin-bottom:20px;'+
        '}'+
        '#timeln .dialog button {margin:4px;}'+
        '#timeln-settings label {'+
        '  display:inline-block;'+
        '  width:175px;'+
        '  margin-right:10px;'+
        '  text-align:right;'+
        '  font-weight:bold;'+
        '}'+
        '#timeln .font_sample {line-height:26px; padding-left:5px; vertical-align:middle; font-size:14px;}'+
        '#timeln:not(.min) #timeln-open, #timeln.min > *:not(.no_min) {display:none;}'
        ;

    //-------------------------------------------------------------------
    // Run when 'refresh' link is clicked.
    //-------------------------------------------------------------------
    function click_refresh() {
        clear_cache();
        $('#range_form, #graph-bar-info, #graph-item-info, #timeln-help, #timeln-settings').addClass('hidden');
        $('#timeline').remove();
        startup(true);
    }

    //-------------------------------------------------------------------
    // Change the value of a setting.
    //-------------------------------------------------------------------
    function set_setting(name, value) {
        settings[name] = value;
        localStorage.setItem('timeln_settings', JSON.stringify(settings));
    }

    //-------------------------------------------------------------------
    // Clear timeline data cache.
    //-------------------------------------------------------------------
    function clear_cache() {
        localStorage.removeItem('apiKey');
        localStorage.removeItem('timeln_cache');
        localStorage.removeItem('timeln_last_fetch');
        localStorage.removeItem('timeln_last_review');
    }

    //-------------------------------------------------------------------
    // Retrieve the value of a setting.
    //-------------------------------------------------------------------
    function get_setting(name) {
        return settings[name];
    }

    //-------------------------------------------------------------------
    // Generate a formatted date string.
    //-------------------------------------------------------------------
    function format_date(time) {
        var str;
        if (time.getTime() === calc_time) return 'Now';
        if (time.getDate() === (new Date()).getDate())
            str = 'Today';
        else
            str = 'SunMonTueWedThuFriSat'.substr(time.getDay()*3, 3);
        if (settings['24hour'])
            str += ' ' + ('0' + time.getHours()).slice(-2) + ':' + '00153045'.substr(Math.floor(time.getMinutes()/15)*2, 2);
        else
            str += ' ' + ('0' + (((time.getHours()+11)%12)+1)).slice(-2) + ':' + '00153045'.substr(Math.floor(time.getMinutes()/15)*2, 2) + 'ap'[Math.floor(time.getHours()/12)] + 'm';
        return str;
    }

    //-------------------------------------------------------------------
    // Populate the info box.
    //-------------------------------------------------------------------
    function populate_info(slot_idx1, slot_idx2, hide_detail) {
        // Check arguments, assign default values when missing.
        if (slot_idx2 === undefined) slot_idx2 = slot_idx1+1;
        if (hide_detail === undefined) hide_detail = false;

        // Consolidate the selected range into a single structure of review items.
        var si;
        var si1 = Math.min(slot_idx1, slot_idx2);
        var si2 = Math.max(slot_idx1, slot_idx2);
        var hinfo = $('#graph-bar-info');
        var slot_sum = {radicals:[], kanji:[], vocabulary:[], item_count:0, has_current:false, has_burn:false};
        for (si = si1; si < si2; si++) {
            var slot = timeline[si];
            if (slot === undefined) continue;
            slot_sum.radicals = slot_sum.radicals.concat(slot.radicals);
            slot_sum.kanji = slot_sum.kanji.concat(slot.kanji);
            slot_sum.vocabulary = slot_sum.vocabulary.concat(slot.vocabulary);
            slot_sum.item_count += slot.item_count;
            slot_sum.has_current |= slot.has_current;
            slot_sum.has_burn |= slot.has_burn;
        }

        // If no items are in the range, hide the detail window.
        if (slot_sum.item_count === 0) {
            hinfo.addClass('hidden');
            return;
        }

        // Save a global copy of the consolidated info for use in support functions.
        graph_detail_items = slot_sum;

        // Print the date or date range).
        var str = format_date(new Date(calc_time + si1 * 900000));
        if (si2-si1 > 1) str += ' to ' + format_date(new Date(calc_time + si2 * 900000));

        // Populate item type summaries.
        str += '<div class="summary">';
        str += '<div class="tot">'+(slot_sum.radicals.length+slot_sum.kanji.length+slot_sum.vocabulary.length)+' reviews</div>';
        str += '<div class="indent">';
        str += '<div class="rad">'+slot_sum.radicals.length+' radicals</div>';
        str += '<div class="kan">'+slot_sum.kanji.length+' kanji</div>';
        str += '<div class="voc">'+slot_sum.vocabulary.length+' vocabulary</div>';
        str += '</div>';
        if (slot_sum.has_current) str += '<div class="cur">Current Level</div>';
        if (slot_sum.has_burn) str += '<div class="bur">Burn Items</div>';
        str += '</div>';

        // We are done building the info box.  Add it to the DOM.
        hinfo.css('max-width', $('#timeln-graph').width()/2 - 15);
        hinfo.html(str);

        // If we are displaying a range, position the info box below the timeline.
        // If the user is just hovering over a timeslot, the info box is positioned in a different function.
        if (graph_hilight_mode !== 0) {
            var tlpos = $('#timeline')[0].getBoundingClientRect();
            if (si1 <= graph_hours*2)
                hinfo.css('left', tlpos.left + Math.floor(Math.min(graph_hilight_x1,graph_hilight_x2)));
            else
                hinfo.css('left', tlpos.left + Math.floor(Math.max(graph_hilight_x1,graph_hilight_x2)) - hinfo.outerWidth());
            hinfo.css('top', tlpos.top + window.scrollY + graph_height_panel);
        }
        hinfo.removeClass('hidden');
    }

    //-------------------------------------------------------------------
    // Event handler for time slots.
    //-------------------------------------------------------------------
    function bar_events(e) {
        // Don't accept events while user is selecting a range.
        if (detail_latched || graph_hilight_mode !== 0) return;

        var hinfo = $('#graph-bar-info');
        var target = $(e.target);
        var slot_idx = target.data('slot');
        switch (e.type) {
            //-----------------------------
            case 'mousemove':
                e.stopPropagation();
                // We only want to redraw the info box just as we enter a new time slot.
                if (slot_idx !== current_slot) {
                    current_slot = slot_idx;

                    // Populate the info box.
                    populate_info(slot_idx);

                    // Set the info box position, and unhide.
                    var left = e.target.getBoundingClientRect().left;
                    if (slot_idx < graph_hours*2)
                        hinfo.css('left', Math.floor(left + e.target.width.baseVal.value)+3);
                    else
                        hinfo.css('left', Math.floor(left - hinfo.outerWidth())-2);
                }

                // Update the vertical position even if we're on the
                // same time slot, so box follows cursor vertically.
                hinfo.css('top', e.pageY - 30);
                break;

            //-----------------------------
            case 'mouseleave':
                hinfo.addClass('hidden');
                current_slot = undefined;
                break;
        }
    }

    //-------------------------------------------------------------------
    // Event handler for hours slider.
    //-------------------------------------------------------------------
    function change_hours(e) {
        graph_hours = Math.round(Number($('#range_input').val())*24);
        localStorage.setItem('timeln_graph_hours', graph_hours);
        $('#range_days').text(slider_label(graph_hours));

        if (e.type === 'change' || get_setting('rescale_redraw'))
            draw_timeline();
    }

    //-------------------------------------------------------------------
    // Draw the timeline.
    //-------------------------------------------------------------------
    function draw_timeline() {
        // Need to 'restore' before redrawing.
        if (get_setting('minimized')) $('#timeln').removeClass('min');

        // Do some cleanup, in case redraw was triggered by 15min timer.
        $('#graph-bar-info, #graph-bar-info').addClass('hidden');
        graph_hilight_mode = 0;

        // Update our timeline data based on cache.
        calc_timeline();

        // If cache says we have available items, but WK says next review
        // date is in the future, user must have done reviews on another
        // device.  Need to force refresh.
        var now = Math.floor(new Date()/1000);
        if (first_draw === true && timeline[0] !== undefined && next_review >= Math.ceil(now/900)*900) {
            first_draw = false;
            setTimeout(click_refresh, 50); // Refresh after finishing main()
            return;
        }

        // Update slider label with number of reviews on graph.
        $('#range_reviews').text(graph_review_total);

        // Calculate graph dimensions.
        var timeln_graph = $('#timeln-graph');
        $('#timeline').remove();
        graph_height_panel = timeln_graph.height();
        graph_height = graph_height_panel - (graph_height_top + graph_height_bottom);
        graph_width_panel = timeln_graph.width();
        graph_width = graph_width_panel - graph_width_left;

        // String for building html.
        var grid = '';
        var label_x = '';
        var label_y = '';
        var bars = '';
        var arrows = '';

        // Draw vertical graph tics (# of Reviews).
        var tic, tic_class, y;
        graph_reviews = max_reviews;
        var inc_s = max_reviews/2, inc_l = max_reviews;
        for (tic = 0; tic <= graph_reviews; tic += inc_s) {
            tic_class = ((tic % inc_l) === 0 ? 'major' : 'minor');
            y = (graph_height_top + graph_height) - Math.round(graph_height * (tic / graph_reviews));
            if (tic > 0)
                grid += '<polyline class="'+tic_class+'" points="'+graph_width_left+','+y+' '+(graph_width_panel-1)+','+y+'" />';
            if (tic === max_reviews)
                label_y += '<text class="'+tic_class+'" x="'+(graph_width_left-4)+'" y="'+y+'" dy="0.4em">'+tic+'</text>';
        }

        // Set up to draw horizontal graph tics (Time).
        var major_tic = 12; // Hours
        var minor_tic = 48; // 15min intervals

        // Draw grid tics, and populate datapoints
        var tic_ofs = Math.floor((calc_time - (new Date(calc_time)).setHours(0, 0, 0, 0)) / 900000);
        graph_width_bar = (graph_width-1) / (graph_hours*4); // Width of a time slot.
        for (tic = 0; tic <= graph_hours*4; tic++) {
            var x = Math.floor(graph_width_left + tic * graph_width_bar);

            // Check if we are on a Major Tic mark
            if (tic % (major_tic*4) === 0) {
                if (tic > 0) {
                    tic_class = 'major';
                    label = tic/4;
                    grid += '<polyline class="'+tic_class+'" points="'+x+',0 '+x+','+(graph_height_top+graph_height-1)+'" />';
                    label_x += '<text class="'+tic_class+'" x="'+(x-4)+'" y="'+(graph_height_top-8)+'">'+label+'</text>';
                }
            } else if (tic % minor_tic === 0) {
                // Minor Tic mark
                if (tic > 0)
                    grid += '<polyline class="minor" points="'+x+','+(graph_height_top-6)+' '+x+','+(graph_height_top+graph_height-1)+'" />';
            }

            // If there are reviews for the current timeslot, draw graph bars.
            var slot = timeline[tic];
            if (slot && tic < graph_hours*4) {
                var x1 = x - graph_width_left;
                var x2 = Math.floor((tic+1) * graph_width_bar);
                var base = 0;
                var rad = slot.radicals.length;
                var kan = slot.kanji.length;
                var voc = slot.vocabulary.length;
                if (get_setting('summary_bar_only')) {
                    bars += '<rect class="sum" x="'+x1+'" y="0" width="'+(x2-x1)+'" height="'+(rad+kan+voc)+'" />';
                    base += rad+kan+voc;
                } else {
                    if (rad > 0) {
                        bars += '<rect class="rad" x="'+x1+'" y="0" width="'+(x2-x1)+'" height="'+rad+'" />';
                        base += rad;
                    }
                    if (kan > 0) {
                        bars += '<rect class="kan" x="'+x1+'" y="'+base+'" width="'+(x2-x1)+'" height="'+kan+'" />';
                        base += kan;
                    }
                    if (voc > 0) {
                        bars += '<rect class="voc" x="'+x1+'" y="'+base+'" width="'+(x2-x1)+'" height="'+voc+'" />';
                        base += voc;
                    }
                }

                // If current timeslot has current-level items, or items ready for Burning, draw indicator arrows.
                var ay = graph_height_top+graph_height+1;
                var ac = graph_width_left+(x1+x2)/2;
                var ah = 10;
                var aw = Math.min(x2-x1, ah);
                var ax1 = ac-(aw/2);
                var ax2 = ax1+aw;
                if (slot.has_current) {
                    if (get_setting('show_current_bars'))
                        bars += '<rect class="cur" x="'+x1+'" y="'+base+'" width="'+(x2-x1)+'" height="'+(graph_reviews-base)+'" />';
                    arrows += '<polygon class="cur" points="'+ac+','+ay+' '+ax1+','+(ay+ah)+' '+ax2+','+(ay+ah)+'" />';
                    ay += ah+1;
                }
                if (slot.has_burn) {
                    if (get_setting('show_burn_bars') && !(slot.has_current && get_setting('show_current_bars')))
                        bars += '<rect class="bur" x="'+x1+'" y="'+base+'" width="'+(x2-x1)+'" height="'+(graph_reviews-base)+'" />';
                    arrows += '<polygon class="bur" points="'+ac+','+ay+' '+ax1+','+(ay+ah)+' '+ax2+','+(ay+ah)+'" />';
                }
                bars += '<rect class="clr" x="'+x1+'" y="0" width="'+(x2-x1)+'" height="'+graph_reviews+'" data-slot="'+tic+'" />';
            }
        }

        // Build the html/svg object from the components build above.
        timeln_graph.append(
            '<svg id="timeline" class="noselect" width="'+graph_width_panel+'" height="'+graph_height_panel+'">'+
            '  <g class="grid" transform="translate(0.5,0.5)">'+
            grid+
            '    <polyline class="shadow" points="'+(graph_width_left-2)+',0 '+(graph_width_left-2)+','+(graph_height_top+graph_height-1)+'" />'+
            '    <polyline class="light"  points="'+(graph_width_left-1)+',0 '+(graph_width_left-1)+','+(graph_height_top+graph_height-1)+'" />'+
            '    <polyline class="light"  points="'+(graph_width_left-2)+','+(graph_height_top+graph_height+1)+' '+(graph_width_panel-1)+','+(graph_height_top+graph_height+1)+'" />'+
            '    <polyline class="shadow" points="'+(graph_width_left-2)+','+(graph_height_top+graph_height)+' '+(graph_width_panel-1)+','+(graph_height_top+graph_height)+'" />'+
            '  </g>'+
            '  <g class="label-x">'+
            label_x+
            '  </g>'+
            '  <g class="label-y">'+
            label_y+
            '  </g>'+
            '  <g class="arrows">'+
            arrows+
            '  </g>'+
            '  <svg x="'+graph_width_left+'" y="'+graph_height_top+'" width="'+graph_width+'" height="'+graph_height+'" viewbox="0 0 '+graph_width+' '+graph_reviews+'" preserveAspectRatio="none">'+
            '    <g class="bars" transform="scale(1,-1) translate(0,-'+graph_reviews+')">'+
            bars+
            '    </g>'+
            '  </svg>'+
            '  <g class="hilight">'+ //RJF
            '    <rect x="0" y="-1000" height="'+graph_height+'"  transform="translate(0.5,0.5)" shape-rendering="crispEdges" />'+
            '    <path class="marker" transform="translate(0 -1000)" d="M 0 0 L -3 -5 L 3 -5 L 0 0 L 0 '+(graph_height+1)+'" />'+
            '    <path class="marker" transform="translate(0 -1000)" d="M 0 0 L -3 -5 L 3 -5 L 0 0 L 0 '+(graph_height+1)+'" />'+
            '  </g>'+
            '</svg>'
        );

        // Add event handlers for the graph.
        $('#timeline .bars .clr').on('mousemove mouseleave', bar_events);

        // Schedule next timeline update, 1sec after next qtr hour.
        var next_time = (new Date()).getTime();
        next_time = Math.ceil(next_time/900000)*900000 - next_time + 1000;
        setTimeout(function() {
            draw_timeline();
        }, next_time);

        // Need to 'restore' before redrawing.
        if (get_setting('minimized')) $('#timeln').addClass('min');
    }

    //-------------------------------------------------------------------
    // Generate timeline data.
    //-------------------------------------------------------------------
    function calc_timeline() {
        calc_time = new Date();
        calc_time = calc_time.setMinutes(Math.floor(calc_time.getMinutes()/15)*15, 0, 0);
        var next_time = Math.ceil(calc_time/900000); // Timestamp of next 15min slot
        max_reviews = 3;
        graph_review_total = 0;
        var max_slot = graph_hours*4;
        timeline = [];
        types = ['radicals', 'kanji', 'vocabulary'];
        var mark = {
            radicals: (get_setting('mark_current') === true),
            kanji: (get_setting('mark_current') === true),
            vocabulary: ((get_setting('mark_current') === true) && (get_setting('mark_current_vocab') === true))
        };
        for (var type_idx in types) {
            var type = types[type_idx];
            var item_cnt = user_data[type].length;
            var mark_current = mark[type];
            for (var item_idx = 0; item_idx < item_cnt; item_idx++) {
                var item = user_data[type][item_idx];
                var item_time = Math.floor(item.user_specific.available_date / 900); // Round down to 15min.
                var slot_idx = Math.min(max_slot, Math.max(0, item_time - next_time));
                if (timeline[slot_idx] === undefined)
                    timeline[slot_idx] = {radicals:[], kanji:[], vocabulary:[], item_count:0, has_current:false, has_burn:false, item_time:item_time*900};
                var slot = timeline[slot_idx];
                slot.item_count++;
                if (slot_idx < max_slot) {
                    graph_review_total++;
                    if (slot.item_count > max_reviews)
                        max_reviews = slot.item_count;
                }
                slot[type].push(item);
                if (mark_current && item.level == user_level)
                    slot.has_current = true;
                if (item.user_specific.srs_numeric == 8)
                    slot.has_burn = true;
            }
        }
        gobj.timeline = timeline;
    }

    //-------------------------------------------------------------------
    // Make first letter of each word upper-case.
    //-------------------------------------------------------------------
    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

    //-------------------------------------------------------------------
    // Add a <style> section to the document.
    //-------------------------------------------------------------------
    function addStyle(aCss) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (head) {
            style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = aCss;
            head.appendChild(style);
            return style;
        }
        return null;
    }

    //-------------------------------------------------------------------
    // Fetch a document from the server.
    //-------------------------------------------------------------------
    function ajax_retry(url, retries, timeout) {
        retries = retries || 3;
        timeout = timeout || 3000;
        function action(resolve, reject) {
            $.ajax({
                url: url,
                timeout: timeout
            })
            .done(function(data, status){
                if (status === 'success')
                    resolve(data);
                else
                    reject();
            })
            .fail(function(xhr, status, error){
                if ((status === 'error' || status === 'timeout') && --retries > 0)
                    action(resolve, reject);
                else
                    reject();
            });
        }
        return new Promise(action);
    }

    //-------------------------------------------------------------------
    // Fetch API key from account page.
    //-------------------------------------------------------------------
    function get_api_key() {
        return new Promise(function(resolve, reject) {
            api_key = localStorage.getItem('apiKey');
            if (typeof api_key === 'string' && api_key.length == 32) return resolve();

            status_div.html('Fetching API key...');
            ajax_retry('/settings/account').then(function(page) {

                // --[ SUCCESS ]----------------------
                // Make sure what we got is a web page.
                if (typeof page !== 'string') {return reject();}

                // Extract the user name.
                page = $(page);

                // Extract the API key.
                api_key = page.find('#user_api_key').attr('value');
                if (typeof api_key !== 'string' || api_key.length !== 32) {
                    return reject(new Error('generate_apikey'));
                }

                localStorage.setItem('apiKey', api_key);
                resolve();

            },function(result) {

                // --[ FAIL ]-------------------------
                reject(new Error('Failed to fetch API key!'));

            });
        });
    }

    //-------------------------------------------------------------------
    // Slider conversion functions.
    //-------------------------------------------------------------------
    function slider_value(hours) {
        return (Number(hours)/24).toFixed(2);
    }

    function slider_label(hours) {
        if (hours <= 72)
            return hours+' hours';
        else
            return (Number(hours)/24).toFixed(2) + ' days';
    }

    //-------------------------------------------------------------------
    // Fetch review data.
    //-------------------------------------------------------------------
    function get_review_data() {
        return new Promise(function(resolve, reject) {
            status_div.html(
                'Loading review data. Please be patient...<br>'+
                'Radicals: <span class="radicals">0%</span><br>'+
                'Kanji: <span class="kanji">0%</span><br>'+
                'Vocabulary: <span class="vocabulary">0%</span>'
            );

            user_data = {radicals:[], kanji:[], vocabulary:[]};
            var cnt = {radicals:0, kanji:0, vocabulary:0};
            var max = Math.ceil(user_level/levels_per_fetch);
            var max_date = next_review + (Math.round(Number(get_setting('max_days'))*24)+1)*3600;
            function fetch(type,lvl,delay) {
                setTimeout(function(){
                    $.getJSON('/api/user/'+api_key+'/'+type+'/'+lvl)
                    .then(function(json){
                        if (json.error && json.error.code === 'user_not_found') {
                            localStorage.removeItem('apiKey');
                            localStorage.removeItem('timeln_last_fetch');
                            location.reload();
                            reject();
                            return;
                        }
                        $(json.requested_information).each(function(i,v){
                            try {
                                if (v.user_specific.burned === false && v.user_specific.available_date < max_date)
                                    user_data[type].push(v);
                            } catch(e) {}
                        });
                        cnt[type]++;
                        status_div.find('.'+type).html(''+Math.round(100*cnt[type]/max)+'%');
                        if (cnt.radicals == max && cnt.kanji == max && cnt.vocabulary == max) {
                            last_fetch = Math.floor(new Date()/1000);
                            localStorage.setItem('timeln_last_fetch', last_fetch);
                            localStorage.setItem('timeln_cache', JSON.stringify(user_data));
                            resolve();
                        }
                    })
                    .fail(function(data){
                        if (data.status === 403 && data.responseText === 'Rate Limit Exceeded') {
                            fetch(type, lvl, 500);
                        } else {
                            console.log('Error '+data.status+': '+data.responseText);
                        }
                    });
                }, delay);
            }

            var delay = 0;
            var arr = [];
            for (var lvl=1; lvl<=user_level; lvl++) {
                arr.push(lvl);
                if (((lvl % levels_per_fetch) === 0) || (lvl == user_level)) {
                    var str = arr.join(',');
                    fetch('radicals',str, delay);
                    delay += ms_betw_fetches;
                    fetch('kanji',str, delay);
                    delay += ms_betw_fetches;
                    fetch('vocabulary',str, delay);
                    delay += ms_betw_fetches;
                    arr = [];
                }
            }
        });
    }

    //-------------------------------------------------------------------
    // Place the timeline on the dashboard.
    //-------------------------------------------------------------------
    function place_timeline(html) {
        if (html === undefined) html = $('#timeln');
        switch (get_setting('placement')) {
            case 'after_nextreview'   : $('section.review-status').after(html); break;
            case 'after_srsprogress'  : $('section.srs-progress').after(html); break;
            case 'after_levelprogress': $('section.progression').after(html); break;
            case 'after_unlocks'      : $('section.recent-unlocks').closest('div.row').after(html); break;
            case 'after_recentchat'   : $('section.forum-topics-list').closest('div.row').after(html); break;
            default: $('section.review-status').before(html); break; // 'before_nextreview'
        }
    }

    //-------------------------------------------------------------------
    // Startup. Runs at document 'load' event.
    //-------------------------------------------------------------------
    function startup(warmboot) {
        var now = Math.floor(new Date()/1000);

        // If we are on the account screen, check if user requested
        // to automatically generate an API key.  Otherwise, do nothing.
        if (window.location.pathname == '/settings/account') {
            var status = localStorage.getItem('timeln_generate_apikey');
            if (status == 'generate') {
                localStorage.setItem('timeln_generate_apikey','refresh');
                $('#user_api_key').closest('fieldset').find('button').click();
                return;
            }
            if (status === 'refresh') {
                api_key = $('#user_api_key').attr('value');
                if (typeof api_key === 'string' && api_key.length === 32)
                    localStorage.setItem('apiKey', api_key);
                localStorage.removeItem('timeln_generate_apikey');
                window.location.href = '/dashboard';
            }
            return;
        }

        // If we are on the review screen, record the time, so we know our
        // cache is out of date when we return to dashboard.
        if (window.location.pathname == '/review/session' || window.location.pathname == '/lesson/session') {
            localStorage.setItem('timeln_last_review', now);
            return;
        }

        // Clear cache if different user is logged in.
        var last_user = localStorage.getItem('timeln_username') || '';
        var current_user = $('.account a[href^="/users/"]').attr('href').split('/').pop();
        if (current_user != last_user) clear_cache();
        localStorage.setItem('timeln_username', current_user);

        // Load settings.
        if (localStorage.getItem('timeln_settings'))
            $.extend(true, settings, JSON.parse(localStorage.getItem('timeln_settings')));
        gobj.settings = settings;
        graph_hours = localStorage.getItem('timeln_graph_hours');
        if (!graph_hours) graph_hours = 36;

        // Some DOM setup that we don't want to repeat if user forced refresh (i.e. 'warm boot').
        if (warmboot !== true) {
            addStyle(css);
            var jp_font = get_setting('jp_font');
            place_timeline(
                '<section id="timeln">'+
                '  <style id="timeln-style">#timeln [lang="ja"] {font-family:'+jp_font+';}</style>'+
                '  <h4 class="no_min">Reviews Timeline</h4>'+
                '  <i id="timeln-open" class="link no_min icon-chevron-down" title="Open the timeline"></i>'+
                '  <i id="timeln-minimize" class="link icon-chevron-up" title="Minimize the timeline"></i>'+
                '  <i id="timeln-refresh-lnk" class="link icon-refresh" title="Force full data refresh.  Usually not necessary.  Please use sparingly."></i>'+
                '  <form id="range_form" class="hidden"><label><span id="range_reviews">0</span> reviews in <span id="range_days">'+slider_label(graph_hours)+'</span> <input id="range_input" type="range" min="0.25" max="'+slider_value(get_setting('max_days')*24)+'" value="'+slider_value(graph_hours)+'" step="0.25" name="range_input"></label></form><br clear="all" class="no_min">'+
                '  <div id="graph-bar-info" class="hidden"></div>'+
                '  <div id="graph-item-info" class="hidden"></div>'+
                '  <div id="timeln-graph"><div id="timeln-status" class="hidden"></div></div>'+
                '</section>'
            );
            $('#timeln-open, #timeln-minimize').on('click', function(e){
                e.preventDefault();
                set_setting('minimized', !get_setting('minimized'));
                $('#timeln').toggleClass('min');
            });
            $('#timeln-refresh-lnk').on('click', click_refresh);
            $('#timeln-graph').height(Number(get_setting('graph_height')));
        }

        // Gather some info to help determine cache status.
        user_level = Number($('.levels span:nth(0)').text());
        next_review = Number($('.review-status .timeago').attr('datetime'));
        last_review = Number(localStorage.getItem('timeln_last_review') || 0);
        last_unlock = new Date($('.recent-unlocks time:nth(0)').attr('datetime'))/1000;
        last_fetch = Number(localStorage.getItem('timeln_last_fetch') || 0);

        // Workaround for "WaniKani Real Times" script, which deletes the element we were looking for above.
        if (isNaN(next_review)) {
            next_review = Number($('.review-status time1').attr('datetime'));
            // Conditional divide-by-1000, in case someone fixed this error in Real Times script.
            if (next_review > 10000000000) next_review /= 1000;
        }

        // Fetch API key and update cache, only if necessary.
        var promise;
        status_div = $('#timeln-status');
        if (last_fetch <= last_unlock || last_fetch <= last_review || (next_review < now && last_fetch <= (now-3600))) {
            status_div.removeClass('hidden');
            status_div.html('Failed to fetch API key!');
            promise = get_api_key()
            .then(get_review_data);
        } else {
            promise = Promise.resolve();
        }

        // We have an up-to-date cache.  Draw the timeline.
        promise.then(function(){
            // Fetch user data from cache.
            user_data = JSON.parse(localStorage.getItem('timeln_cache'));

            // Draw the timeline.
            status_div.addClass('hidden');
            draw_timeline();

            // Install event handlers for time range slider.
            $('#range_input').on('input change', change_hours);
            $('#range_form').removeClass('hidden');
        },null)
        .catch(function(e){
            if (e.message === 'generate_apikey') {
                status_div.html(
                    'It seems you haven\'t generated an API key yet.<br>'+
                    'Please click [<a id="timeln_gen_apikey" href="/settings/account" rel="nofollow">here</a>] to generate one automatically.'
                );
                $('#timeln_gen_apikey').on('click',function(){
                    localStorage.setItem('timeln_generate_apikey','generate');
                });
            } else {
                status_div.html(e.message);
            }
        });
    }

    // Run startup() after window.onload event.
    if (document.readyState === 'complete')
        startup();
    else
        window.addEventListener("load", startup, false);

})(wktimeln);