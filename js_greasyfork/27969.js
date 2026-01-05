// ==UserScript==
// @name        Wanikani Forums Lesson/Review Status
// @namespace   rfindley
// @description Shows status of your Wanikani lessons/reviews while in the forums.
// @version     1.0.18
// @include     https://community.wanikani.com/*
// @copyright   2018+, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27969/Wanikani%20Forums%20LessonReview%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/27969/Wanikani%20Forums%20LessonReview%20Status.meta.js
// ==/UserScript==

window.lrstatus = {};

(function(gobj) {

    /* global $, wkof */

    var settings = {
        show_next_review: true,
        highlight_labels: false
    };

    var randomize_query = 300; // Randomize API query times over a 300 sec period to spread server load.
    var next_review = -1;

	function promise(){var a,b,c=new Promise(function(d,e){a=d;b=e;});c.resolve=a;c.reject=b;return c;}

    //-------------------------------------------------------------------
    // Styling info for this script.
    //-------------------------------------------------------------------
    var css =
        '.float_wkappnav .d-header {padding-bottom: 2em;}'+
        '.float_wkappnav .d-header .title {height:4em;}'+
        '.float_wkappnav .wanikani-app-nav-container {border-top:1px solid #ccc; line-height:2em;}'+
        '.float_wkappnav .wanikani-app-nav ul {padding-bottom:0; margin-bottom:0; border-bottom:inherit;}'+
        '.timeline-container:not(.timeline-docked) {margin-top:25px;}'+

        '.dashboard_bubble {color:#fff; background-color:#bdbdbd; font-size:0.8em; border-radius:0.5em; padding:0 6px; margin:0 0 0 4px; font-weight:bold;}'+
        'li[data-highlight="true"] .dashboard_bubble {background-color:#6cf;}'+
        'body[theme="dark"] .dashboard_bubble {color:#ddd; background-color:#646464;}'+
        'body[theme="dark"] li[data-highlight="true"] .dashboard_bubble {color:#000; background-color:#6cf;}'+
        'body[theme="dark"] .wanikani-app-nav[data-highlight-labels="true"] li[data-highlight="true"] a {color:#6cf;}'+
        'body[theme="dark"] .wanikani-app-nav ul li a {color:#999;}'+

        '.wanikani-app-nav.prompt_apikey li:not(.apikey_form):not(:first-child) {display:none;}'+
        '.wanikani-app-nav:not(.prompt_apikey) .apikey_form {display:none;}'+
        '.apikey_form input {margin:0; box-sizing:border-box; border:1px solid #ccc; height:1.6em; width:auto;}'+
        '.apikey_form input {margin:0; box-sizing:border-box; border:1px solid #ccc; height:1.6em; width:auto;}'+
        '.apikey_form input::placeholder {color:#ccc;}'+
        '.apikey_form button {height:1.6em;}'+
        '';

    //-------------------------------------------------------------------
    // Display a friendly relative time for the next review.
    //-------------------------------------------------------------------
    function update_time() {
        var timestamp = next_review;
        var nr = $('#next_review');
        if (timestamp === null) {
            nr.text('none').closest('li').attr('data-highlight','false');
            return;
        }

        var now = Math.trunc(new Date().getTime()/1000);
        var diff = Math.max(0, timestamp-now);
        var dd = Math.floor(diff / 86400);
        diff -= dd*86400;
        var hh = Math.floor(diff / 3600);
        diff -= hh*3600;
        var mm = Math.floor(diff / 60);
        diff -= mm*60;
        var ss = diff;
        var text, next_update;
        var is_now = false;

        if (dd > 0) {
            text = dd+' day'+(dd===1?'':'s')+', '+hh+' hour'+(hh===1?'':'s');
            next_update = mm*60+ss+1;
        } else if (hh > 0) {
            text = hh+' hour'+(hh===1?'':'s')+', '+mm+' min'+(mm===1?'':'s');
            next_update = ss;
        } else if (mm > 0 || ss > 15) {
            if (ss > 0) mm++;
            text = mm+' min'+(mm===1?'':'s');
            next_update = ss;
        } else {
            text = 'Now';
            next_update = -1;
            is_now = true;
        }
        nr.text(text);
        $('[data-name="next_review"]').attr('data-highlight',(is_now ? 'true' : 'false'));
        if (next_update >= 0) setTimeout(update_time, (next_update+1)*1000);
    }

    //-------------------------------------------------------------------
    // Update the lesson/review count info on the screen.
    //-------------------------------------------------------------------
    function update_counts(lessons, reviews) {
        var lc = $('#lesson_count');
        var rc = $('#review_count');
        lc.text(lessons);
        rc.text(reviews);
        $('[data-name="lesson_count"]').attr('data-highlight',(lessons > 0 ? 'true' : 'false'));
        $('[data-name="review_count"]').attr('data-highlight',(reviews > 0 ? 'true' : 'false'));
        if (settings.show_next_review === true) {
            update_time();
        }
    }

    //-------------------------------------------------------------------
    // Fetch lesson/review count info from the server.
    //-------------------------------------------------------------------
    function fetch_data() {
        var now = Math.round(new Date().getTime()/1000);
        query_api('summary')
        .then(function(json){
            var lessons = json.data.lessons[0].subject_ids.length;
            var reviews = json.data.reviews[0].subject_ids.length;
            next_review = (json.data.next_reviews_at ? Math.floor(new Date(json.data.next_reviews_at).getTime()/1000) : null);
            update_counts(lessons, reviews);
        })
        .catch(function() {
            return;
        });
        var next_query = (new Date().setMinutes(60,1,0) - Date.now())/1000 + Math.round(Math.random()*randomize_query) + 10;
        setTimeout(fetch_data, next_query*1000);
    }

	//------------------------------
	// Check if a string is a valid apikey format.
	//------------------------------
	function is_valid_apikey_format(str) {
		return ((typeof str === 'string') &&
			(str.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/) !== null));
	}

	//------------------------------
	// Fetch the specified endpoint from the WK API.
	//------------------------------
    function query_api(endpoint) {
        var fetch_promise = promise();
        var retry_cnt = 0;
        var apikey = localStorage.getItem('apiv2_key');
        if (!is_valid_apikey_format(apikey)) {
            bad_apikey();
        } else {
            fetch();
        }
        return fetch_promise;

        function fetch() {
            retry_cnt++;
            var request = new XMLHttpRequest();
            request.onreadystatechange = received;
            request.open('GET', "https://api.wanikani.com/v2/" + endpoint, true);
            request.setRequestHeader('Authorization', 'Bearer '+apikey);
            request.setRequestHeader('Cache-Control', 'no-cache');
            request.send();
        }

        function received(event) {
			// ReadyState of 4 means transaction is complete.
			if (this.readyState !== 4) return;

			// Check for rate-limit error.  Delay and retry if necessary.
			if (this.status === 429 && retry_cnt < 40) {
				var delay = Math.min((retry_cnt * 250), 2000);
				setTimeout(fetch, delay);
				return;
			}

            // Check for bad API key.
			if (this.status === 401) return bad_apikey();

            // Process the response data.
			var json = JSON.parse(event.target.response);
            fetch_promise.resolve(json);
        }

        function bad_apikey() {
            $('.wanikani-app-nav').addClass('prompt_apikey');
            fetch_promise.reject();
        }
    }

    //-------------------------------------------------------------------
    // Determine whether the user is using a dark theme.
    //-------------------------------------------------------------------
    function is_dark_theme() {
        // Grab the <html> background color, average the RGB.  If less than 50% bright, it's dark theme.
        return $('html').css('background-color').match(/\((.*)\)/)[1].split(',').slice(0,3).map(str => Number(str)).reduce((a, i) => a+i)/(255*3) < 0.5;
    }

    //-------------------------------------------------------------------
    // Handler for apikey input change.
    //-------------------------------------------------------------------
    function apikey_changed() {
        var val = $('.apikey_form input').val();
        var button = $('.apikey_form button');
        if (is_valid_apikey_format(val)) {
            button.text('Save');
        } else {
            button.text('Find it');
        }
    }

    //-------------------------------------------------------------------
    // Handler for apikey form button.
    //-------------------------------------------------------------------
    function apikey_btn_clicked() {
        var button = $('.apikey_form button');
        if (button.text() === 'Save') {
            var apikey = $('.apikey_form input').val();
            localStorage.setItem('apiv2_key', apikey);
            $('.wanikani-app-nav').removeClass('prompt_apikey');
            fetch_data();
        } else {
            window.open('https://www.wanikani.com/settings/personal_access_tokens','_blank');
        }
    }

    //-------------------------------------------------------------------
    // Startup. Runs at document 'load' event.
    //-------------------------------------------------------------------
    var retry = 25;
    function startup() {
        var wk_app_nav = $('.wanikani-app-nav').closest('.container');
        if (wk_app_nav.length === 0) {
            if (retry-- > 0) setTimeout(startup, 200);
            return;
        }

        if (is_dark_theme()) {
            $('body').attr('theme','dark');
        } else {
            $('body').attr('theme','light');
        }

        // Attach the Dashboard menu to the stay-on-top menu.
        var top_menu = $('.d-header');
        var main_content = $('#main-outlet');
        $('body').addClass('float_wkappnav');
        wk_app_nav.addClass('wanikani-app-nav-container');
        top_menu.find('>.wrap > .contents:eq(0)').after(wk_app_nav);

        // Adjust the main content's top padding, so it won't be hidden under the new taller top menu.
        var main_content_toppad = Number(main_content.css('padding-top').match(/[0-9]*/)[0]);
        main_content.css('padding-top', (main_content_toppad + 25) + 'px');

        // Insert CSS.
        $('head').append('<style type="text/css">'+css+'</style>');

        // Add our content to the WK App Nav bar.
        $('.wanikani-app-nav > ul > li:contains("Lessons")').attr('data-name', 'lesson_count').attr('data-highlight','false').append('<span id="lesson_count" class="dashboard_bubble">?</span>');
        $('.wanikani-app-nav > ul > li:contains("Reviews")').attr('data-name', 'review_count').attr('data-highlight','false').append('<span id="review_count" class="dashboard_bubble">?</span>');
        if (settings.show_next_review === true) {
            $('.wanikani-app-nav > ul').append('<li data-name="next_review" data-highlight="false"><a href="https://www.wanikani.com/review" title="Go to reviews">Next Review<span id="next_review" class="dashboard_bubble">Loading...</span></a></li>');
        }
        $('.wanikani-app-nav').attr('data-highlight-labels', (settings.highlight_labels === true ? 'true' : 'false'));
        $('.wanikani-app-nav > ul').append('<li class="apikey_form"><input type="text" placeholder="Paste your Personal Access Token" size="36"></input><button type="submit">Find it</button></li>');
        $('.wanikani-app-nav .apikey_form button').on('click', apikey_btn_clicked);
        $('.wanikani-app-nav .apikey_form input').on('input', apikey_changed);

        var now = Math.trunc(new Date().getTime()/1000);
        var last_qtr_hr = Math.trunc(now / 900) * 900;
        var last_query = Number(localStorage.getItem('wkf_lrstatus.last_query'));

        fetch_data();
    }

    // Run startup() after window.onload event.
    if (document.readyState === 'complete') {
        startup();
    } else {
        window.addEventListener("load", startup, false);
    }
    console.log('LRS');

})(window.lrstatus);
