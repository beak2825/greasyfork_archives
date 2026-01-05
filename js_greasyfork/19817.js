// ==UserScript==
// @name          Custom reddit top posts
// @description   Allows selecting a custom time interval for subreddit top posts
// @namespace     Jonas Högman
// @include         https://*.reddit.com/r/*/top/*
// @include         http://*.reddit.com/r/*/top/*
// @include         http://*.reddit.com/top/*
// @include         https://*.reddit.com/top/*
// @require       http://cdn.jsdelivr.net/jquery/2.1.3/jquery.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/pickadate.js/3.5.6/compressed/picker.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/pickadate.js/3.5.6/compressed/picker.date.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/pickadate.js/3.5.6/compressed/picker.time.js
// @version       1.09
// @grant         GM_addStyle
// @grant         GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/19817/Custom%20reddit%20top%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/19817/Custom%20reddit%20top%20posts.meta.js
// ==/UserScript==
//default
//GM_addStyle('.picker__footer,.picker__header,.picker__table{text-align:center}.picker__day--highlighted,.picker__select--month:focus,.picker__select--year:focus{border-color:#0089ec}.picker__box{padding:0 1em}.picker__header{position:relative;margin-top:.75em}.picker__month,.picker__year{font-weight:500;display:inline-block;margin-left:.25em;margin-right:.25em}.picker__year{color:#999;font-size:.8em;font-style:italic}.picker__select--month,.picker__select--year{border:1px solid #b7b7b7;height:2em;padding:.5em;margin-left:.25em;margin-right:.25em}.picker__select--month{width:35%}.picker__select--year{width:22.5%}.picker__nav--next,.picker__nav--prev{position:absolute;padding:.5em 1.25em;width:1em;height:1em;box-sizing:content-box;top:-.25em}.picker__nav--prev{left:-1em;padding-right:1.25em}.picker__nav--next{right:-1em;padding-left:1.25em}@media (min-width:24.5em){.picker__select--month,.picker__select--year{margin-top:-.5em}.picker__nav--next,.picker__nav--prev{top:-.33em}.picker__nav--prev{padding-right:1.5em}.picker__nav--next{padding-left:1.5em}}.picker__nav--next:before,.picker__nav--prev:before{content:" ";border-top:.5em solid transparent;border-bottom:.5em solid transparent;border-right:.75em solid #000;width:0;height:0;display:block;margin:0 auto}.picker__nav--next:before{border-right:0;border-left:.75em solid #000}.picker__nav--next:hover,.picker__nav--prev:hover{cursor:pointer;color:#000;background:#b1dcfb}.picker__nav--disabled,.picker__nav--disabled:before,.picker__nav--disabled:before:hover,.picker__nav--disabled:hover{cursor:default;background:0 0;border-right-color:#f5f5f5;border-left-color:#f5f5f5}.picker--focused .picker__day--highlighted,.picker__day--highlighted:hover,.picker__day--infocus:hover,.picker__day--outfocus:hover{color:#000;cursor:pointer;background:#b1dcfb}.picker__table{border-collapse:collapse;border-spacing:0;table-layout:fixed;font-size:inherit;width:100%;margin-top:.75em;margin-bottom:.5em}@media (min-height:33.875em){.picker__table{margin-bottom:.75em}}.picker__table td{margin:0;padding:0}.picker__weekday{width:14.285714286%;font-size:.75em;padding-bottom:.25em;color:#999;font-weight:500}@media (min-height:33.875em){.picker__weekday{padding-bottom:.5em}}.picker__day{padding:.3125em 0;font-weight:200;border:1px solid transparent}.picker__day--today{position:relative}.picker__day--today:before{content:" ";position:absolute;top:2px;right:2px;width:0;height:0;border-top:.5em solid #0059bc;border-left:.5em solid transparent}.picker__day--disabled:before{border-top-color:#aaa}.picker__day--outfocus{color:#ddd}.picker--focused .picker__day--selected,.picker__day--selected,.picker__day--selected:hover{background:#0089ec;color:#fff}.picker--focused .picker__day--disabled,.picker__day--disabled,.picker__day--disabled:hover{background:#f5f5f5;border-color:#f5f5f5;color:#ddd;cursor:default}.picker__day--highlighted.picker__day--disabled,.picker__day--highlighted.picker__day--disabled:hover{background:#bbb}.picker__button--clear,.picker__button--close,.picker__button--today{border:1px solid #fff;background:#fff;font-size:.8em;padding:.66em 0;font-weight:700;width:33%;display:inline-block;vertical-align:bottom}.picker__button--clear:hover,.picker__button--close:hover,.picker__button--today:hover{cursor:pointer;color:#000;background:#b1dcfb;border-bottom-color:#b1dcfb}.picker__button--clear:focus,.picker__button--close:focus,.picker__button--today:focus{background:#b1dcfb;border-color:#0089ec;outline:0}.picker__button--clear:before,.picker__button--close:before,.picker__button--today:before{position:relative;display:inline-block;height:0}.picker__button--clear:before,.picker__button--today:before{content:" ";margin-right:.45em}.picker__button--today:before{top:-.05em;width:0;border-top:.66em solid #0059bc;border-left:.66em solid transparent}.picker__button--clear:before{top:-.25em;width:.66em;border-top:3px solid #e20}.picker__button--close:before{content:"\D7";top:-.1em;vertical-align:top;font-size:1.1em;margin-right:.35em;color:#777}.picker__button--today[disabled],.picker__button--today[disabled]:hover{background:#f5f5f5;border-color:#f5f5f5;color:#ddd;cursor:default}.picker__button--today[disabled]:before{border-top-color:#aaa}');
//GM_addStyle('.picker{font-size:16px;text-align:left;line-height:1.2;color:#000;position:absolute;z-index:10000;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.picker__input{cursor:default}.picker__input.picker__input--active{border-color:#0089ec}.picker__holder{width:100%;overflow-y:auto;-webkit-overflow-scrolling:touch;position:fixed;transition:background .15s ease-out,-webkit-transform 0s .15s;transition:background .15s ease-out,transform 0s .15s;-webkit-backface-visibility:hidden} .picker__frame,.picker__holder{top:0;bottom:0;left:0;right:0;-webkit-transform:translateY(100%);-ms-transform:translateY(100%);transform:translateY(100%)}.picker__frame{position:absolute;margin:0 auto;min-width:256px;max-width:666px;width:100%;-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";filter:alpha(opacity=0);-moz-opacity:0;opacity:0;transition:all .15s ease-out}.picker__wrap{display:table;width:100%;height:100%}@media (min-height:33.875em){.picker__frame{overflow:visible;top:auto;bottom:-100%;max-height:80%}.picker__wrap{display:block}}.picker__box{background:#fff;display:table-cell;vertical-align:middle}@media (min-height:26.5em){.picker__box{font-size:1.25em}}@media (min-height:33.875em){.picker__box{display:block;font-size:1.33em;border:1px solid #777;border-top-color:#898989;border-bottom-width:0;border-radius:5px 5px 0 0;box-shadow:0 12px 36px 16px rgba(0,0,0,.24)}}@media (min-height:40.125em){.picker__frame{margin-bottom:7.5%}.picker__box{font-size:1.5em;border-bottom-width:1px;border-radius:5px}}.picker--opened .picker__holder{-webkit-transform:translateY(0);-ms-transform:translateY(0);transform:translateY(0);zoom:1;background:rgba(0,0,0,.32);transition:background .15s ease-out}.picker--opened .picker__frame{-webkit-transform:translateY(0);-ms-transform:translateY(0);transform:translateY(0);-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";filter:alpha(opacity=100);-moz-opacity:1;opacity:1}@media (min-height:33.875em){.picker--opened .picker__frame{top:auto;bottom:0}}');
//classic
GM_addStyle(
    '.picker,.picker__holder{width:100%;position:absolute}.picker{font-size:16px;text-align:left;line-height:1.2;color:#000;z-index:10000;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.picker__input{cursor:default}.picker__input.picker__input--active{border-color:#0089ec}.picker__holder{overflow-y:auto;-webkit-overflow-scrolling:touch;background:#fff;border:1px solid #aaa;border-top-width:0;border-bottom-width:0;border-radius:0 0 5px 5px;box-sizing:border-box;min-width:176px;max-width:466px;max-height:0;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=0);filter:alpha(opacity=0);-moz-opacity:0;opacity:0;-webkit-transform:translateY(-1em)perspective(600px)rotateX(10deg);transform:translateY(-1em)perspective(600px)rotateX(10deg);transition:-webkit-transform .15s ease-out,opacity .15s ease-out,max-height 0 .15s,border-width 0 .15s;transition:transform .15s ease-out,opacity .15s ease-out,max-height 0 .15s,border-width 0 .15s}.picker__frame{padding:1px}.picker__wrap{margin:-1px}.picker--opened .picker__holder{max-height:25em;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=100);filter:alpha(opacity=100);-moz-opacity:1;opacity:1;border-top-width:1px;border-bottom-width:1px;-webkit-transform:translateY(0)perspective(600px)rotateX(0);transform:translateY(0)perspective(600px)rotateX(0);transition:-webkit-transform .15s ease-out,opacity .15s ease-out,max-height 0s,border-width 0;transition:transform .15s ease-out,opacity .15s ease-out,max-height 0s,border-width 0;box-shadow:0 6px 18px 1px rgba(0,0,0,.12)}'
);
GM_addStyle(
    '.picker__footer,.picker__header,.picker__table{text-align:center}.picker__day--highlighted,.picker__select--month:focus,.picker__select--year:focus{border-color:#0089ec}.picker__box{padding:0 1em}.picker__header{position:relative;margin-top:.75em}.picker__month,.picker__year{font-weight:500;display:inline-block;margin-left:.25em;margin-right:.25em}.picker__year{color:#999;font-size:.8em;font-style:italic}.picker__select--month,.picker__select--year{border:1px solid #b7b7b7;height:2.5em;padding:.5em;margin-left:.25em;margin-right:.25em}.picker__select--month{width:35%}.picker__select--year{width:22.5%}.picker__nav--next,.picker__nav--prev{position:absolute;padding:.5em 1.25em;width:1em;height:1em;box-sizing:content-box;top:-.25em}.picker__nav--prev{left:-1em;padding-right:1.25em}.picker__nav--next{right:-1em;padding-left:1.25em}@media (min-width:24.5em){.picker__select--month,.picker__select--year{margin-top:-.5em}.picker__nav--next,.picker__nav--prev{top:-.33em}.picker__nav--prev{padding-right:1.5em}.picker__nav--next{padding-left:1.5em}}.picker__nav--next:before,.picker__nav--prev:before{content:" ";border-top:.5em solid transparent;border-bottom:.5em solid transparent;border-right:.75em solid #000;width:0;height:0;display:block;margin:0 auto}.picker__nav--next:before{border-right:0;border-left:.75em solid #000}.picker__nav--next:hover,.picker__nav--prev:hover{cursor:pointer;color:#000;background:#b1dcfb}.picker__nav--disabled,.picker__nav--disabled:before,.picker__nav--disabled:before:hover,.picker__nav--disabled:hover{cursor:default;background:0 0;border-right-color:#f5f5f5;border-left-color:#f5f5f5}.picker--focused .picker__day--highlighted,.picker__day--highlighted:hover,.picker__day--infocus:hover,.picker__day--outfocus:hover{color:#000;cursor:pointer;background:#b1dcfb}.picker__table{border-collapse:collapse;border-spacing:0;table-layout:fixed;font-size:inherit;width:100%;margin-top:.75em;margin-bottom:.5em}@media (min-height:33.875em){.picker__table{margin-bottom:.75em}}.picker__table td{margin:0;padding:0}.picker__weekday{width:14.285714286%;font-size:.75em;padding-bottom:.25em;color:#999;font-weight:500}@media (min-height:33.875em){.picker__weekday{padding-bottom:.5em}}.picker__day{padding:.3125em 0;font-weight:200;border:1px solid transparent}.picker__day--today{position:relative}.picker__day--today:before{content:" ";position:absolute;top:2px;right:2px;width:0;height:0;border-top:.5em solid #0059bc;border-left:.5em solid transparent}.picker__day--disabled:before{border-top-color:#aaa}.picker__day--outfocus{color:#ddd}.picker--focused .picker__day--selected,.picker__day--selected,.picker__day--selected:hover{background:#0089ec;color:#fff}.picker--focused .picker__day--disabled,.picker__day--disabled,.picker__day--disabled:hover{background:#f5f5f5;border-color:#f5f5f5;color:#ddd;cursor:default}.picker__day--highlighted.picker__day--disabled,.picker__day--highlighted.picker__day--disabled:hover{background:#bbb}.picker__button--clear,.picker__button--close,.picker__button--today{border:1px solid #fff;background:#fff;font-size:.8em;padding:.66em 0;font-weight:700;width:33%;display:inline-block;vertical-align:bottom}.picker__button--clear:hover,.picker__button--close:hover,.picker__button--today:hover{cursor:pointer;color:#000;background:#b1dcfb;border-bottom-color:#b1dcfb}.picker__button--clear:focus,.picker__button--close:focus,.picker__button--today:focus{background:#b1dcfb;border-color:#0089ec;outline:0}.picker__button--clear:before,.picker__button--close:before,.picker__button--today:before{position:relative;display:inline-block;height:0}.picker__button--clear:before,.picker__button--today:before{content:" ";margin-right:.45em}.picker__button--today:before{top:-.05em;width:0;border-top:.66em solid #0059bc;border-left:.66em solid transparent}.picker__button--clear:before{top:-.25em;width:.66em;border-top:3px solid #e20}.picker__button--close:before{content:"\D7";top:-.1em;vertical-align:top;font-size:1.1em;margin-right:.35em;color:#777}.picker__button--today[disabled],.picker__button--today[disabled]:hover{background:#f5f5f5;border-color:#f5f5f5;color:#ddd;cursor:default}.picker__button--today[disabled]:before{border-top-color:#aaa}'
);

//Add "custom" option to top list dropdown
$(".drop-choices").append(
    '<form method="POST" action="https://www.reddit.com/r/leagueoflegends/top/"><input name="t" value="year" type="hidden"><a href="#" class="choice custom">custom</a>'
);

//Show calendar when "custom" is selected
$(document).ready(function() {
    $('.custom').click(function() {
        $('.calendar').slideToggle("fast");
    });
});

//Add fields for selecting date on calendar
$(".menuarea").append(
    '<div class="calendar" style="display: none;"><fieldset> <input type="text" id="input_from"> </fieldset> <fieldset> <input type="text" id="input_to"> </fieldset> <p id="myNumberSum">&nbsp;</p> <button id="gmAddNumsBtn" type="button">Search</button> <button id="gmCloseDlgBtn" type="button">Close</button> </div>'
);

//--- Use jQuery to activate the dialog buttons.
$("#gmAddNumsBtn").click(function() {
    $('.sitetable.linklisting').not(':first').remove();
    nextlink_div = $('.nextprev');
    $('.sitetable.linklisting').empty().append(nextlink_div);
    //$('.thing.link').not('.promoted').remove();
    $('.sitetable.linklisting').last().prepend(
        '<div id="loading" class="loadingsearch"> <p><img src="http://i.stack.imgur.com/FhHRx.gif" /> Please wait, retrieving search results…</p><br></div>'
    );

    $("a[rel*='next']").attr('onclick', 'return false;');
    $("a[rel*='next']").attr("href", '#');
    
    
    $("a[rel*='next']").click(function() {
        p = $('.nextprev').detach();
        $(".sitetable.linklisting").last().append(
            '<div id="loading" class="loadingsearch"> <p><img src="http://i.stack.imgur.com/FhHRx.gif" /> Please wait, retrieving search results…</p><br></div>'
        );
        search_elements = getContent(next_link, true, p);
        $('.sitetable.linklisting').last().append(search_elements);
    });

    function getContent(link, next, p) {
        ret = GM_xmlhttpRequest({
            method: "GET",
            url: link,
            onload: function(res) {
                search_html = (res.responseText);
                parser = new DOMParser();
                html_doc = $.parseHTML(search_html);

                search_elements = $('.search-result',
                    html_doc);
                next_link = $(html_doc).find(
                    "a[rel*='next']").attr('href');

                if ($('div#NREPause').length) {
                    handleDataRES(search_elements, next_link);
                } else if (next === true) {
                    $('.sitetable.linklisting').last().append(search_elements);
                    $('.loadingsearch').remove();
                    $('.sitetable.linklisting').last().append(p);
                } else {
                    handleData(search_elements, next_link);
                }

                return search_elements
            },
        });
    }

    function handleData(search_elements, next_link) {
        console.log(next_link, search_elements);
        $('.sitetable.linklisting').last().prepend(search_elements);
        $("a[rel*='next']").attr("href", '#');
        $('.loadingsearch').remove();

    }

    function handleDataRES(search_elements, next_link) {
        $('.sitetable.linklisting').last().prepend(search_elements);

        $('.loadingsearch').remove();
        if ($('div#NREPause').hasClass('paused')) {
            $('div#NREPause').click();
        }
    }

    if (window.location.href.indexOf('reddit.com/top') > -1) {
        //console.log(next_link, search_elements);
        console.log('Running first search page')
        getContent(
            'https://www.reddit.com/search?sort=top&q=timestamp:' +
            from_picker.get('select').pick / 1000 + '..' +
            to_picker.get('select').pick / 1000 +
            '&syntax=cloudsearch&restrict_sr=on');
    } else {
        getContent('https://www.reddit.com/r/' + window.location.href.split(
                '/')[4] + '/search?sort=top&q=timestamp:' +
            from_picker.get('select').pick / 1000 + '..' +
            to_picker.get('select').pick / 1000 +
            '&syntax=cloudsearch&restrict_sr=on');
    }
    $(document).on('DOMNodeInserted', function(e) {
        if ($(e.target).hasClass('sitetable') || $(e.target).hasClass(
                'linklisting')) {
            //if ($(e.target).hasClass('NERPageMarker')) {
            console.log('Detected new page with RES');
            $('div#NREPause').click();
            $('.sitetable.linklisting').last().empty();
            $('.sitetable.linklisting').last().append(
                '<div id="loading" class="loadingsearch"> <p><img src="http://i.stack.imgur.com/FhHRx.gif" /> Please wait, retrieving search results…</p></div>'
            );
            getContent(next_link, function(search_elements,
                next_link) {
                handleData(next_link, search_elements)
            });
        }

    });
});

$("#gmCloseDlgBtn").click(function() {
    $(".calendar").slideToggle("fast");
});


var from_$input = $('#input_from').pickadate({
        selectMonths: true,
        selectYears: true
    }),
    from_picker = from_$input.pickadate('picker');

var to_$input = $('#input_to').pickadate({
        selectMonths: true,
        selectYears: true
    }),
    to_picker = to_$input.pickadate('picker');


// Check if there’s a “from” or “to” date to start with.
if (from_picker.get('value')) {
    to_picker.set('min', from_picker.get('select'));
}
if (to_picker.get('value')) {
    from_picker.set('max', to_picker.get('select'));
}

// When something is selected, update the “from” and “to” limits.
from_picker.on('set', function(event) {
    if (event.select) {
        to_picker.set('min', from_picker.get('select'));
    } else if ('clear' in event) {
        to_picker.set('min', false);
    }
});
to_picker.on('set', function(event) {
    if (event.select) {
        from_picker.set('max', to_picker.get('select'));
    } else if ('clear' in event) {
        from_picker.set('max', false);
    }
});