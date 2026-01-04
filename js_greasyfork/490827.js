// ==UserScript==
// @name        Wanikani Burn Manager Updates
// @namespace   gartholomew
// @description Mass Resurrect/Retire of Burn items on WaniKani
// @version     1.0.0
// @include     https://www.wanikani.com/*
// @exclude     https://www.wanikani.com/lesson*
// @exclude     https://www.wanikani.com/review*
// @copyright   2024, Gartholomew O'Brien
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/490827/Wanikani%20Burn%20Manager%20Updates.user.js
// @updateURL https://update.greasyfork.org/scripts/490827/Wanikani%20Burn%20Manager%20Updates.meta.js
// ==/UserScript==

window.burnmgr = {};

(function(gobj) {

    /* globals $, wkof */
    /* eslint no-multi-spaces: "off" */

    //===================================================================
    // Initialization of the Wanikani Open Framework.
    //-------------------------------------------------------------------
    var script_name = 'Burn Manager';
    if (!window.wkof) {
        if (confirm(script_name+' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?')) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }
        return;
    }

    wkof.include('ItemData,Menu');
    wkof.ready('ItemData,Menu').then(startup);

    var mgr_added = false, busy = false, items, items_by_id;

    function startup() {
        wkof.Menu.insert_script_link({
            name: 'burnmgr',
            submenu: 'Open',
            title: 'Burn Manager',
            on_click: open_burnmgr
        });
    }

    function open_burnmgr() {
        // Add the manager if not already.
        if (!mgr_added) add_mgr();

        $('#burn_mgr').slideDown();
        $('html, body').animate({scrollTop:0},800);
    }

    var srslvls = ['Apprentice 1','Apprentice 2','Apprentice 3','Apprentice 4','Guru 1','Guru 2','Master','Enlightened','Burned'];

    //-------------------------------------------------------------------
    // Display the Burn Manager object.
    //-------------------------------------------------------------------
    function add_mgr() {
        var html =
            '<div id="burn_mgr"><div id="burn_mgr_box" class="container">'+
            '<h3 class="small-caps invert">Burn Manager <span id="burn_mgr_instr" href="#">[ Instructions ]</span></h3>'+

            '<form accept-charset="UTF-8" action="#" class="form-horizontal"><fieldset class="additional-info">'+

            // Instructions
            '  <div class="instructions">'+
            '    <div class="header small-caps invert">Instructions</div>'+
            '    <div class="content">'+
            '      <p>Enter your Resurrect/Retire criteria below, then click <span class="btn">Preview</span>.<br>A preview window will open, showing burn items matching the Level and Type criteria.<br>'+
                     'You can change your criteria at any time, then click <span class="btn">Preview</span> again to update your settings... but any <b>manually toggled changes will be lost</b>.</p>'+
            '      <p class="nogap">In the preview window:</p>'+
            '      <ul>'+
            '        <li><b>Hover</b> over an item to see <b>item details</b>.</li>'+
            '        <li><b>Click</b> an item to <b>toggle</b> its desired state between <b>Resurrect</b> and <b>Retired</b>.</li>'+
            '      </ul>'+
            '      <p>After you have adjusted all items to their desired state, click <span class="btn">Execute</span> to begin changing you item statuses<br>'+
                     'While executing, please allow the progress bar to reach 100% before navigating to another page, otherwise some items will not be Resurrected or Retired.</p>'+
            '      <span class="rad">十</span><span class="kan">本</span><span class="voc">本当</span> = Will be Resurrected<br>'+
            '      <span class="rad inactive">十</span><span class="kan inactive">本</span><span class="voc inactive">本当</span> = Will be Retired'+
            '    </div>'+
            '  </div>'+

            // Settings
            '  <div class="control-group">'+
            '    <label class="control-label" for="burn_mgr_levels">Level Selection:</label>'+
            '    <div class="controls">'+
            '      <input id="burn_mgr_levels" type="text" autocomplete="off" class="span6" max_length=255 name="burn_mgr[levels]" placeholder="Levels to resurrect or retire (e.g. &quot;1-3,5&quot;)" value>'+
            '    </div>'+
            '  </div>'+
            '  <div class="control-group">'+
            '    <label class="control-label">Item types:</label>'+
            '    <div id="burn_mgr_types" class="controls">'+
            '      <label class="checkbox inline"><input id="burn_mgr_rad" name="burn_mgr[rad]" type="checkbox" value="1" checked="checked">Radicals</label>'+
            '      <label class="checkbox inline"><input id="burn_mgr_kan" name="burn_mgr[kan]" type="checkbox" value="1" checked="checked">Kanji</label>'+
            '      <label class="checkbox inline"><input id="burn_mgr_voc" name="burn_mgr[voc]" type="checkbox" value="1" checked="checked">Vocab</label>'+
            '    </div>'+
            '  </div>'+
            '  <div class="control-group">'+
            '    <label class="control-label" for="burn_mgr_initial">Action / Initial State:</label>'+
            '    <div id="burn_mgr_initial" class="controls">'+
            '      <label class="radio inline"><input id="burn_mgr_initial_current" name="burn_mgr[initial]" type="radio" value="0" checked="checked">No change / Current state</label>'+
            '      <label class="radio inline"><input id="burn_mgr_initial_resurrect" name="burn_mgr[initial]" type="radio" value="1">Resurrect All</label>'+
            '      <label class="radio inline"><input id="burn_mgr_initial_retire" name="burn_mgr[initial]" type="radio" value="2">Retire All</label>'+
            '    </div>'+
            '  </div>'+
            '  <div class="control-group">'+
            '    <div id="burn_mgr_btns" class="controls">'+
            '      <a id="burn_mgr_preview" href="#burn_mgr_preview" class="btn btn-mini">Preview</a>'+
            '      <a id="burn_mgr_execute" href="#burn_mgr_execute" class="btn btn-mini">Execute</a>'+
            '      <a id="burn_mgr_close" href="#burn_mgr_close" class="btn btn-mini">Close</a>'+
            '    </div>'+
            '  </div>'+

            // Preview
            '  <div class="status"><div class="message controls"></div></div>'+
            '  <div class="preview"></div>'+
            '  <div id="burn_mgr_item_info" class="hidden"></div>'+

            '</fieldset>'+
            '</form>'+
            '<hr>'+
            '</div></div>';

        var css =
            '#burn_mgr {display:none;}'+

            '#burn_mgr_instr {margin-left:20px; font-size:0.8em; opacity:0.8; cursor:pointer;}'+
            '#burn_mgr .instructions {display:none;}'+
            '#burn_mgr .instructions .content {padding:5px;}'+
            '#burn_mgr .instructions p {font-size:13px; line-height:17px; margin-bottom:1.2em;}'+
            '#burn_mgr .instructions p.nogap {margin-bottom:0;}'+
            '#burn_mgr .instructions ul {margin-left:16px; margin-bottom:1.2em;}'+
            '#burn_mgr .instructions li {font-size:13px; line-height:17px;}'+
            '#burn_mgr .instructions span {cursor:default;}'+
            '#burn_mgr .instructions .btn {color:#000; padding:0px 3px 2px 3px;}'+
            '#burn_mgr .noselect {-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}'+

            '#burn_mgr h3 {'+
            '  margin-top:10px; margin-bottom:0px; padding:0 30px; border-radius: 5px 5px 0 0;'+
            '  background-color: #fbc042;'+
            '  background-image: -moz-linear-gradient(-45deg, #fbc550, #faac05);'+
            '  background-image: -webkit-linear-gradient(-45deg, #fbc550, #faac05);'+
            '  background-image: -o-linear-gradient(-45deg, #fbc550, #faac05);'+
            '  background-image: linear-gradient(-45deg, #fbc550, #faac05);'+
            '}'+

            '#burn_mgr form {border-radius:0 0 5px 5px; margin-bottom:10px;}'+
            '#burn_mgr #burn_mgr_box fieldset {border-radius:0 0 5px 5px; margin-bottom:0px; padding:10px;}'+
            '#burn_mgr .control-group {margin-bottom:10px;}'+
            '#burn_mgr .controls .inline {padding-right:10px;}'+
            '#burn_mgr .controls .inline input {margin-left:-15px;}'+
            '#burn_mgr_btns .btn {width:50px; margin-right:10px;}'+

            '#burn_mgr .status {display:none;}'+
            '#burn_mgr .status .message {display:inline-block; background-color:#ffc; padding:2px 10px; font-weight:bold; border:1px solid #999; min-width:196px;}'+

            '#burn_mgr .preview {display:none;}'+
            '#burn_mgr .header {padding:0px 3px; line-height:1.2em; margin:0px;}'+
            '#burn_mgr .preview .header .count {text-transform:none; margin-left:10px;}'+
            '#burn_mgr .content {padding:0px 2px 2px 2px; border:1px solid #999; border-top:0px; background-color:#fff; margin-bottom:10px; position:relative;}'+
            '#burn_mgr .content span {'+
            '  color:#fff;'+
            '  font-size:13px;'+
            '  line-height:13px;'+
            '  margin:0px 1px;'+
            '  padding:2px 3px 3px 2px;'+
            '  border-radius:4px;'+
            '  box-shadow:0 -2px 0 rgba(0,0,0,0.2) inset;'+
            '  display:inline-block;'+
            '}'+
            '#burn_mgr .rad > img {height:0.9em;}'+
            '#burn_mgr .rad {background-color:#0096e7; background-image:linear-gradient(to bottom, #0af, #0093dd);}'+
            '#burn_mgr .kan {background-color:#ee00a1; background-image:linear-gradient(to bottom, #f0a, #dd0093);}'+
            '#burn_mgr .voc {background-color:#9800e8; background-image:linear-gradient(to bottom, #a0f, #9300dd);}'+
            '#burn_mgr .rad.inactive {background-color:#c3e3f3; background-image:linear-gradient(to bottom, #d4ebf7, #c3e3f3);}'+
            '#burn_mgr .kan.inactive {background-color:#f3c3e3; background-image:linear-gradient(to bottom, #f7d4eb, #f3c3e3);}'+
            '#burn_mgr .voc.inactive {background-color:#e3c3f3; background-image:linear-gradient(to bottom, #ebd4f7, #e3c3f3);}'+

            '#burn_mgr .preview .content span {cursor:pointer;}'+

            '#burn_mgr_item_info {'+
            '  position: absolute;'+
            '  padding:8px;'+
            '  color: #eeeeee;'+
            '  background-color:rgba(0,0,0,0.8);'+
            '  border-radius:8px;'+
            '  font-family:"Open Sans","Helvetica Neue",Helvetica,Arial,sans-serif;'+
            '  font-weight: bold;'+
            '  z-index:3;'+
            '}'+
            '#burn_mgr_item_info .item {font-size:2em; line-height:1.2em;}'+
            '#burn_mgr_item_info .item img {height:1em; width:1em; vertical-align:bottom;}'+
            '#burn_mgr_item_info>div {padding:0 8px; background-color:#333333;}'+

            '#burn_mgr hr {border-top-color:#bbb; margin-top:0px; margin-bottom:0px;}';

        $('head').append('<style type="text/css">'+css+'</style>');
        $(html).insertAfter($('.global-header'));

        // Add event handlers
        $('#burn_mgr_preview').on('click', on_preview);
        $('#burn_mgr_execute').on('click', on_execute);
        $('#burn_mgr_close').on('click', on_close);
        $('#burn_mgr_instr').on('click', on_instructions);

        mgr_added = true;
    }

    //-------------------------------------------------------------------
    // Event handler for item click.
    //-------------------------------------------------------------------
    function item_click_event(e) {
        $(e.currentTarget).toggleClass('inactive');
    }

    //-------------------------------------------------------------------
    // Event handler for item hover info.
    //-------------------------------------------------------------------
    function item_info_event(e) {
        var hinfo = $('#burn_mgr_item_info');
        var target = $(e.currentTarget);
        switch (e.type) {
            //-----------------------------
            case 'mouseenter':
                var itype = target.data('type');
                var ref = target.data('ref');
                var item = items_by_id[ref];
                var status = (can_resurrect(item)===true ? 'Retired' : 'Resurrected');
                var str = '<div class="'+itype+'">';
                var readings, reading_str, important_reading, meanings, meaning_str, synonyms, synonym_str;
                switch (itype) {
                    case 'rad':
                        meanings = item.data.meanings.filter(primary);
                        meaning_str = meanings.map(meaning).join(', ');
                        str += '<span class="item">Item: <span lang="ja">';
                        if (item.data.characters !== null) {
                            str += item.data.characters+'</span></span><br />';
                        } else {
                            str += '<img src="'+item.data.character_images[0].url+'" /></span></span><br />';
                        }
                        str += 'Meaning: '+toTitleCase(meaning_str)+'<br />';
                        if (item.study_materials && item.study_materials.meaning_synonyms.length > 0) {
                            str += 'Synonyms: '+toTitleCase(item.study_materials.meaning_synonyms.join(', '))+'<br />';
                        }
                        break;
                    case 'kan':
                        readings = item.data.readings.filter(primary);
                        important_reading = readings[0].type;
                        reading_str = readings.map(reading).join(', ');
                        meanings = item.data.meanings.filter(primary);
                        meaning_str = meanings.map(meaning).join(', ');
                        str += '<span class="item">Item: <span lang="ja">'+item.data.characters+'</span></span><br />';
                        str += toTitleCase(important_reading)+': <span lang="ja">'+reading_str+'</span><br />';
                        str += 'Meaning: '+toTitleCase(meaning_str)+'<br />';
                        if (item.study_materials && item.study_materials.meaning_synonyms.length > 0) {
                            str += 'Synonyms: '+toTitleCase(item.study_materials.meaning_synonyms.join(', '))+'<br />';
                        }
                        break;
                    case 'voc':
                        readings = item.data.readings.filter(primary);
                        reading_str = readings.map(reading).join(', ');
                        meanings = item.data.meanings.filter(primary);
                        meaning_str = meanings.map(meaning).join(', ');
                        str += '<span class="item">Item: <span lang="ja">'+item.data.characters+'</span></span><br />';
                        str += 'Reading: <span lang="ja">'+reading_str+'</span><br />';
                        str += 'Meaning: '+toTitleCase(meaning_str)+'<br />';
                        if (item.study_materials && item.study_materials.meaning_synonyms.length > 0) {
                            str += 'Synonyms: '+toTitleCase(item.study_materials.meaning_synonyms.join(', '))+'<br />';
                        }
                        break;
                }
                str += 'Level: '+item.data.level+'<br />';
                str += 'SRS Level: '+srslvls[item.assignments.srs_stage-1]+'<br />';
                str += 'Currently: '+status+'<br />';
                str += '</div>';
                hinfo.html(str);
                hinfo.css('left', target.offset().left - target.position().left);
                hinfo.css('top', target.offset().top + target.outerHeight() + 3);
                hinfo.removeClass('hidden');
                break;

            //-----------------------------
            case 'mouseleave':
                hinfo.addClass('hidden');
                break;
        }
    }

    //-------------------------------------------------------------------
    // Filters and maps
    //-------------------------------------------------------------------
    function primary(info) {return info.primary;}
    function meaning(info) {return info.meaning;}
    function reading(info) {return info.reading;}

    //-------------------------------------------------------------------
    // Make first letter of each word upper-case.
    //-------------------------------------------------------------------
    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

    //-------------------------------------------------------------------
    // Read the user's "initial state" setting.
    //-------------------------------------------------------------------
    function read_initial_state() {
        return Number($('#burn_mgr_initial input:checked').val());
    }

    //-------------------------------------------------------------------
    // Run when user clicks 'Preview' button
    //-------------------------------------------------------------------
    function on_preview(e, refresh) {
        if (refresh !== true) e.preventDefault();
        if (busy) return;

        var preview_is_open = $('#burn_mgr .preview').is(':visible');
        if (preview_is_open) {
            $('#burn_mgr .preview').html('').slideUp();
            busy = true;
            fetch_items(true /* force_update */).then(populate_data.bind(null, refresh));
        } else {
            busy = true;
            fetch_items(true /* force_update */).then(populate_data.bind(null, refresh));
        }
    }

    //-------------------------------------------------------------------
    // Fetch the requested items
    //-------------------------------------------------------------------
    function fetch_items(force_update) {
        var levels = $('#burn_mgr_levels').val();
        if (levels === '') levels = '*';

        var item_type = [];
        if ($('#burn_mgr_rad').attr('checked') === 'checked') item_type.push('rad');
        if ($('#burn_mgr_kan').attr('checked') === 'checked') item_type.push('kan');
        if ($('#burn_mgr_voc').attr('checked') === 'checked') item_type.push('voc');

        $('#burn_mgr .status .message').html('Fetching data...');
        $('#burn_mgr .status').slideDown();

        return wkof.ItemData.get_items({
            wk_items: {
                options: {subjects: true, assignments: true, study_materials: true},
                filters: {
                    have_burned: true,
                    level: levels,
                    item_type: item_type
                }
            }
        }, {force_update: force_update});
    }

    //-------------------------------------------------------------------
    // Populate the item data on-screen.
    //-------------------------------------------------------------------
    function populate_data(refresh, data) {
        // Hide the "Loading" message.
        busy = false;
        $('#burn_mgr .status').slideUp();
        items = data;
        items_by_id = wkof.ItemData.get_index(items, 'subject_id');
        window.items = items;

        var html = '';
        var itypes = ['radical', 'kanji', 'vocabulary'];
        var state = read_initial_state();
        if (refresh === true) state = 0;
        var get_initial = [
            /* 0 */ function(item) {return can_retire(item);}, // Show current item state.
            /* 1 */ function(item) {return true;},             // Mark all items for resurrection.
            /* 2 */ function(item) {return false;},            // Mark all items for retirement.
        ][state];

        var items_by_level = wkof.ItemData.get_index(items, 'level');
        var item_html, items_by_type, level_items, itype3, list;
        for (var level = 1; level <= wkof.user.level; level++) {
            level_items = items_by_level[level];
            if (!level_items) continue;
            items_by_type = wkof.ItemData.get_index(level_items, 'item_type');
            item_html = '';
            $.each(itypes, populate_by_type);
            html +=
                '<div class="header small-caps invert">Level '+level+
                '</div>'+
                '<div class="content level noselect">'+
                item_html+
                '</div>';
        }
        function populate_by_type(idx, itype) {
            // Skip item types that aren't checked.
            itype3 = itype.slice(0,3);
            list = items_by_type[itype];
            if (!$('#burn_mgr_'+itype3).is(':checked')) return;
            if (list === undefined) return;
            $.each(list, populate_individual_items);
        }
        function populate_individual_items(idx,item){
            var text, ref, state;
            text = item.data.slug;
            if (itype3 === 'rad') {
                if (item.data.character_images.length > 0) {
                    text = '<img src="'+item.data.character_images[0].url+'">';
                } else {
                    text = item.data.characters;
                }
            } else {
                text = item.data.characters;
            }
            if (get_initial(item)) {
                state = '';
            } else {
                state = ' inactive';
            }
            item_html += '<span class="'+itype3+state+'" data-type="'+itype3+'" data-ref="'+item.id+'">'+text+'</span>';
        }
        $('#burn_mgr .preview').html(html).slideDown();
        $('#burn_mgr .preview .content.level')
            .on('mouseenter', 'span', item_info_event)
            .on('mouseleave', item_info_event)
            .on('click', 'span', item_click_event);
    }

    //-------------------------------------------------------------------
    // Run when user clicks 'Execute' button
    //-------------------------------------------------------------------
    function on_execute(e) {
        e.preventDefault();
        if (busy) return;
        busy = true;

        var status = $('#burn_mgr .status'), message = $('#burn_mgr .status .message');
        var use_preview = $('#burn_mgr .preview').is(':visible');
        var task_list = [];

        var auth_token = encodeURIComponent($('[name="csrf-token"]').attr('content'));

        if (use_preview) {
            $('#burn_mgr .preview .content span').each(function(idx,elem){
                elem = $(elem);
                var ref = elem.data('ref');
                var item = items_by_id[ref];
                var current = can_resurrect(item);
                var want = elem.hasClass('inactive');
                if (current != want) {
                    task_list.push({url:'/assignments/'+ref+'/'+(want?'burn':'resurrect'),item:item});
                }
            });
            start_execute();
        } else {
            // Don't use Preview information.
            fetch_items(true /* force_update */).then(function(items){
                var state = read_initial_state();
                if (state === 0) return;
                var want = (state===2);
                $.each(items, function(idx, item){
                    var ref = item.id;
                    var current = can_resurrect(item);
                    if (current != want) {
                        task_list.push({url:'/assignments/'+ref+'/'+(want?'burn':'resurrect'),item:item});
                    }
                });
                start_execute();
            });
        }

        var cnt, tot, rateLimitRefresh;

        function start_execute() {
            tot = task_list.length;
            cnt = 0;
            message.html('Executing 0 / '+tot);
            status.slideDown();

            var simultaneous = Math.min(5, tot);
            for (cnt=0; cnt<simultaneous; cnt++) {
                retire(task_list[cnt]).then(next, next);
            }

            function next(result) {
                if (result.rateLimitRefresh > 0) {
                    let waitTime = result.rateLimitRefresh * 1000 - new Date().getTime() + 5000; // Add a 5 second grace period just in case
                    console.log('waiting', waitTime / 1000, 'seconds');
                    for (let currWaitTime = waitTime; currWaitTime > 0; currWaitTime -= 1000) {
                        let remaining = waitTime - currWaitTime;
                        setTimeout(() => console.log('waiting for', remaining / 1000, 'more seconds'), currWaitTime);
                    }
                    new Promise(resolve => setTimeout(() => resolve({status: result.status, task: result.task}), waitTime)).then(next);
                } else if (cnt < tot) {
                    message.html('Working... ('+cnt+' of '+tot+')');
                    retire(task_list[cnt++]).then(next, next);
                } else {
                    message.html('Done! ('+cnt+' of '+tot+')');
                    busy = false;
                    on_preview(null, true /* refresh */);
                }
            }
        }

        function retire(task) {
            return new Promise(function(resolve, reject){
                $.ajax(task.url, {
                    type:'POST',
                    data:'_method=put&authenticity_token='+auth_token,
                    dataType:'text'
                }).done(function(res, status, xhr){
                    resolve({status:'success', task:task});
                }).fail(function(xhr){
                    rateLimitRefresh = xhr.getResponseHeader('Ratelimit-Reset');
                    reject({status:'fail', task:task, rateLimitRefresh: rateLimitRefresh});
                });
            });
        }
    }

    //-------------------------------------------------------------------
    // Run when user clicks 'Close' button
    //-------------------------------------------------------------------
    function on_close(e) {
        e.preventDefault();
        var preview_is_open = $('#burn_mgr .preview').is(':visible');
        if (preview_is_open) $('#burn_mgr .preview').html('').slideUp();
        $('#burn_mgr').slideUp();
    }

    //-------------------------------------------------------------------
    // Run when user clicks 'Instructions'
    //-------------------------------------------------------------------
    function on_instructions(e) {
        e.preventDefault();
        $('#burn_mgr .instructions').slideToggle();
    }

    //-------------------------------------------------------------------
    // Return 'true' if item can be retired.
    //-------------------------------------------------------------------
    function can_retire(item){
        return (item.assignments.srs_stage !== 9);
    }

    //-------------------------------------------------------------------
    // Return 'true' if item can be resurrected.
    //-------------------------------------------------------------------
    function can_resurrect(item){
        return (item.assignments.srs_stage === 9);
    }

})(window.burnmgr);
