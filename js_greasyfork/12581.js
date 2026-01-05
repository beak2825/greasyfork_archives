// ==UserScript==
// @name        Google News Filter
// @namespace   http://www.google-news-filter.com
// @description Removes blacklisted articles and news sources from Google News.
// @include     *//news.google.com/*
// @grant       none
// @version     3.0.5
// @require     http://code.jquery.com/jquery-latest.min.js
// @require https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant   GM_getValue
// @grant   GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/12581/Google%20News%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/12581/Google%20News%20Filter.meta.js
// ==/UserScript==

$(function() {

    // **************** //

        // Initialize user settings window
        // Persistent user settings for greasemonkey scripts using local storage are made possible by the GM_config library:
        // https://github.com/sizzlemctwizzle/GM_config
        function gnf_settings() {

		// define gm_config_panel div
		var gm_config_panel = document.createElement('div');
        gm_config_panel.draggable=true;
		document.body.appendChild(gm_config_panel);

		GM_config.init({
  		'id': 'gnf_settings_dialog', // id for this instance of GM_config
	  	'title': 'Google News Filter settings',
		  'fields':
  		{
	    'blacklist_terms': // field id
	    	{
  		    'label': '<div style="margin:1em 0 0;padding:0;">Blacklisted Terms <span style="font-weight:normal;color:gray;">(<i>comma-separated, case-insensitive</i>)</span></div>',
	  	    'type': 'textarea',
      		'default': ''
	    	},
  	  	'blacklist_sources': // field id
    		{
  		    'label': '<div style="margin:1em 0 0;padding:0;">Blacklisted News Sources <span style="font-weight:normal;color:gray;">(<i>comma-separated, case-insensitive</i>)</span></div>',
	      	'type': 'textarea',
	      	'default': ''
  	  	},
  	  	'position': // field id
    		{
  		    'label': 'Position:',
	      	'type': 'radio',
	      	'options': ['Left','Right'],
	      	'default': 'Right'
  	  	},
  	  	'disable': // field id
    		{
  		    'label': 'Disable Filtering:',
	      	'type': 'checkbox',
	      	'default': false
  	  	},
  	  	'hide_sidebar': // field id
    		{
  		    'label': 'Hide Sidebar:',
	      	'type': 'checkbox',
	      	'default': false
  	  	}
  		},
  		 'events': // Callback functions object
		  {
//	  	  'init': function() { alert('onInit()'); },
//		    'open': function() { alert('onOpen()'); },
    		'save': function() { location.reload(); },
//  	  	'close': function() { alert('onClose()'); },
//		    'reset': function() {  }
		  },
            'css': '#gnf_settings_dialog { width:70% !important;border:0!important;border-radius:3px!important;padding:3em 1em 1em !important;height:auto !important;box-shadow:0 0 32px #000000 !important;line-height:unset; font-size:1em; }     textarea { width:-moz-calc(100% - 2em - 2px) !important;width:calc(100% - 2em - 2px)!important;height:8em;margin:0!important;padding:0.5em 1em;color:grey!important;font-family:monospace !important;font-size:0.875em!important;line-height:1.5!important; border-color:grey; border-radius:3px; }     textarea:focus { color:black!important; }     #gnf_settings_dialog_header { font-size:1.25em !important;position:absolute;top:0;right:0;left:0;height:1.618em;background: -moz-linear-gradient(top,#cfcfcf 0%,#a8a8a8 100%); background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#cfcfcf), color-stop(100%,#a8a8a8)); background: -webkit-linear-gradient(top,#cfcfcf 0%,#a8a8a8 100%); background: -ms-linear-gradient(top, #cfcfcf 0%,#a8a8a8 100%); background: linear-gradient(top,#cfcfcf 0%,#a8a8a8 100%);box-shadow:0px 1px 0px rgba(255,255,255,0.5) inset,0px 1px 0px #515151; padding:0.5em 0 0;text-shadow:0px 1px 0px rgba(255,255,255,0.25);color:#444444; }     #gnf_settings_dialog_position_var { margin-top:1em!important;}     #gnf_settings_dialog_position_var,#gnf_settings_dialog_disable_var,#gnf_settings_dialog_hide_sidebar_var { margin-right:2em!important;float:left; }     #gnf_settings_dialog_position_var { display:block; clear:both; }     #gnf_settings_dialog_disable_var { clear:left; }     #gnf_settings_dialog_blacklist_terms_field_label,#gnf_settings_dialog_blacklist_sources_field_label { float:left !important; margin-bottom:0.618em !important; }     #gnf_settings_dialog_field_position,#gnf_settings_dialog_position_field_label { float:left; }     #gnf_settings_dialog_field_position label { margin-right:1em; }     #gnf_settings_dialog_buttons_holder {float:right; }     #gnf_settings_dialog_saveBtn,#gnf_settings_dialog_closeBtn{width:6em;text-align:center;color:white!important;border-radius:3px;margin-top:0!important;margin-bottom:0!important;padding:0.5em 1em!important; }     #gnf_settings_dialog_saveBtn { background:cornflowerblue !important;border:solid 1px cornflowerblue!important; }     #gnf_settings_dialog_closeBtn{background:white!important;color:#444444 !important;border:solid 1px #444444 !important; }     #gnf_settings_dialog_saveBtn:hover{background:#2e8b57!important;border:solid 1px #2e8b57!important; }     #gnf_settings_dialog_saveBtn:active{border:solid 1px #2e8b57!important; }     #gnf_settings_dialog_closeBtn:active { background:cornflowerblue!important;color:white!important;border:solid 1px cornflowerblue!important; }  .reset_holder { display:none!important; }',
  		'frame':gm_config_panel
		});
	}
	gnf_settings();

	// **************** //

    $('#gnf_wrapper').remove();

    // Create Google News Filter settings element
    var $gnf_el = '<div id="gnf_wrapper" style="background-color:white;position:absolute;top:0;right:0;padding:0.125em 1em;z-index:9000;cursor:pointer;border-bottom-left-radius:3px;border-bottom-right-radius:3px;box-shadow:0 0 12px #AAAAAA;color:#888888;"><div id="gnf_title" style="display:block;font-weight:bold;position:relative;z-index:1001;" title="Click to reload.">Google News Filter</div><div id="gnf_statistics" title="Click to show matched terms."></div><div id="gnf_settings" title="Click to show settings.">Settings</div></div>';
    $('.pGxpHc').css('position','relative').after($gnf_el);
    $('#gnf_statistics,#gnf_settings').hide();

    // define variables
    var $gnf_wrapper = $('#gnf_wrapper');
    var $gnf_statistics = $('#gnf_statistics');
    var $gnf_settings = $('#gnf_settings');
    var $count = 0;
    var $matched = '';
    var $matchedArray = [];
    var $story = '';

    function google_news_filter() {

        // Open GM_config window, focus blacklist textarea, change default "close window" text
        $gnf_settings.on('click',function() {
            GM_config.open();
            $('#gnf_settings_dialog').css({'position':'absolute','top':'4em','left':'15%'});
            $('#gnf_settings_dialog_field_blacklist_terms').focus().add('#gnf_settings_dialog_field_blacklist_sources').css({'font-family':'monospace'});
            $('#gnf_settings_dialog_closeBtn').text('Cancel');
            return false;
        });

        // Main Google News Filter function: the magic happens here!
        if ( GM_config.get('disable') == 1 ) {
			$gnf_statistics.attr('title','').append('<span style="color:red">! Filtering disabled</span>');
		} else {
            // get blacklist terms from GM_config local storage, convert to lowercase, trim whitespace, escape punctuation:
            var	$blacklist_terms = GM_config.get('blacklist_terms').toLowerCase().trim().replace(/\s+,\s+|,\s+|\s+,|,,|\r/g,',').replace(/,$/,'').replace(/'/g,"\'").replace(/"/g,'\"');
            var $blacklist = $blacklist_terms.split(','); // create array from blacklist
            $blacklist = $blacklist.filter(function(n,i) { return n !== ''; }); // remove empty terms
            $blacklist = [...new Set($blacklist)]; // remove duplicate terms

            var	$blacklist_sources = GM_config.get('blacklist_sources').toLowerCase().trim().replace(/\s+,\s+|,\s+|\s+,|,,|\r/g,',').replace(/,$/,'').replace(/'/g,"\'").replace(/"/g,'\"');
            var $sources = $blacklist_sources.split(','); // create array from blacklist sources
            $sources = $sources.filter(function(n,i) { return n !== ''; }); // remove empty terms
            $sources = [...new Set($sources)]; // remove duplicate terms

            // remove blacklisted stories
            $('.v4IxVd,.M1Uqc,.Q3vG6d > a,.Q3vG6d,.nuEeue').each(function() { // elements to search ,.Q3vG6d,.hzdq5d,.nuEeue
              var $titletext = $(this).text().toLowerCase();
			  for ( var i=0; i < $blacklist.length; i++ ) { // for each blacklist term...
                  if ( $titletext.indexOf( $blacklist[i] ) > -1 ) { // ...if the term is found...
                      $(this).parents('.PaqQNc,.M1Uqc,.HzT8Gd').remove(); // ...remove the parent element,...
                      $count += 1; // ...and increment count of stories removed.
                      $matchedArray.push($blacklist[i]);
                  }
                  if ( $count == 1 ) { $story = " story"; } else { $story = " stories"; }
              }
              // update statistics and add matched terms:
                var obj = {};
                $matchedArray.forEach(function(item) {
                    if (typeof obj[item] == 'number') {
                        obj[item]++;
                    } else {
                        obj[item] = 1;
                    }
                });
                // make list of removed items and append to statistics:
                $matched = Object.keys(obj).map(function(item) {
                    return item + (obj[item] == 1 ? ' (1)' : ' (' + obj[item] + ')');
                }).join('<br>');
                $gnf_statistics.text($count + $story +' removed').append('<p id="matched" style="display:none;margin:0 0 0.5em 1em;-moz-columns:2;columns:2;">'+$matched+'</p>');
            });

            // remove blacklisted sources
			$('.IH8C7b.Pc0Wt').each(function() {
			  var $sourcetext = $(this).text().toLowerCase();
              var $parentContainer = $(this).closest('c-wiz');
			  for (var i=0; i < $sources.length; i++) {
                if ( $sourcetext.indexOf( $sources[i] ) > -1 ) {
                    $parentContainer.remove(); //.append($related).prepend('<div  class="esc-lead-article-title-wrapper"><p><span class="titletext">[ blacklisted story source removed: '+ $sourcetext +' ]</span></p></div>');
                  }
                }
			});
		} // end else

        // Events
        // show statistics and settings labels on hover
        $gnf_wrapper.on('click','#gnf_title',function(e) {
            e.stopPropagation();
        });
        // hover colors
        $gnf_wrapper.on('mouseenter',function() {
            $(this).css({'color':'#444444'});
        });
        $gnf_wrapper.on('mouseleave',function() {
            $('#gnf_statistics p').hide();
            $(this).css({'color':'#888888'});
        });
        $gnf_wrapper.find('#gnf_settings,#gnf_statistics').hover(function() {
            $(this).css({'color':'#000000'});
        }, function() {
            $(this).css({'color':'unset'});
        });

    } // end google_news_filter function

    google_news_filter();

    // Click "Google News Filter" title to reload Google News.
    $gnf_wrapper.find('#gnf_title').on('click',function() { location.reload(); });
    // Reload page when clicking Google News section links (needed in order to fire google_news_filter function).
    $('#sdgBod,.adH5zf').on('click',function() {
        var $thisHref = $(this).attr('href');
        if ( $thisHref ) { location.assign($thisHref); }
    });

    // **************** //

    $gnf_wrapper.on('mouseenter mouseleave',function(e) {
        e.stopPropagation();
        $('#gnf_statistics,#gnf_settings').toggle();
    });
    // show/hide matched terms on click:
    $gnf_wrapper.on('click',$gnf_statistics,function(e) {
        e.stopPropagation();
        if ( $('#matched:visible').length ) {
            $('#matched').hide(500);
        } else {
            $('#matched').show(500);
        }
    });

    // Google News Filter options

 	// position Google News Filter element
 	function gnf_el_position() {
	 	var	$position = GM_config.get('position');
		if ( $position == 'Left' ) {
			$gnf_wrapper.css({'left':0,
			'right':'unset'});
		}
	}
	gnf_el_position();

    // Hide Sidebar
    if ( GM_config.get('hide_sidebar') == 1 ) {
        $('div[aria-label="Main menu"]').click().blur();
    }

    // Experimental: use keyboard to cancel or save settings
    $('body').on('keydown','#gnf_settings_dialog,#gnf_settings_dialog_closeBtn,#gnf_settings_dialog_saveBtn',function(e) {
        if ( e.metaKey && e.which == 190 ) { $('#gnf_settings_dialog_closeBtn').click(); }
        if ( e.which == 13 ) { $('#gnf_settings_dialog_saveBtn').click(); }
    });

    dragSettings();
    function dragSettings() {
        const state = { mouseDown:1 };
        // Experimental: make settings window draggable
        var $gnf_settings_dialog = $('#gnf_settings_dialog');
        $(document).on("mousedown", "#gnf_settings_dialog_header", function() {
            eleMouseDown();
            return false;
        });
        function eleMouseDown(e) {
            state.mouseDown = 1;
            clientX = e.offsetX;
            clientY = e.offsetY;
            $(document).on("mousemove", function() { eleMouseMove(); return false; });
            $(document).on("mouseup" , function() { eleMouseUp(); return false; });
        }
        function eleMouseMove(ev) {
            ev.preventDefault();
            if (state.mouseDown == 1) {
                state.mouseDown = 2;
                return;
            }
            if (stateMouseDown == 2){
                var pX = ev.pageX;
                var pY = ev.pageY;
                $gnf_settings_dialog.css('left',pX - clientX + "px");
                $gnf_settings_dialog.css('top',pY - clientY + "px");
            }
        }
        function eleMouseUp(e) {
            e.preventDefault();
            state.mouseDown = 0;
            document.removeEventListener ("mousemove" , eleMouseMove , false);
            document.removeEventListener ("mouseup" , eleMouseUp , false);
        }
    }


});
