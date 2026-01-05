// ==UserScript==
// @name    TweetDeck Clear
// @namespace   http://b1nj.fr
// @version 0.6.6
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAABCNJREFUWAnFV11sFFUU/s6dmZ3tLrvLLitFEwMlNlGeyjYYf6KhsTaY8MCLkhhjKolgAoQXQnwxIg8qPPiCEmiiIVHjg4m8+KaERnhCYwhRBGPUNjW1uGVb2Nmd/+u9U7d2N/Ozq1RPMjtzz893vnPPnTt7gf9ZqJW/dHp2CzE6Ds62gXh/S38375zzXwl00XQbR4z9A79LbALntG5i5mGQNimG6buZMBKL01wTja2NfZtmGd6Awil1+j9LLlmJGU5DfxfPcoUV1s3dL/owFMl2lQxE7Gk8AZUp5G5YpRxJsDlYV1XG08SSPLu1uz9cgF/9uVt3lEs6U+O8JaD60EicC7hRg/P5W6CvzwV+nvh1c2Ww594EZQrwLkxAGdkLZWMlFCeWAP/oEOzBx5AaF2s0QtwPD4B+utxmpTtV8Pf3ggutPjQKbi622VcO4qffaoK+Ow/77VF4U9+ujAueA11H8k4n+8qX4PNTnerlcSwBpvcFjlSdgn9yN+yzr7QRod+uLgNFPZSefw3pkT1RZsS2ILPtGdQvfbYcLGfDF5cneoz+zVCz+WVb2IMswH50HJblh5kDXSyB5vT10EDZY4hLLrg4Ue8diE0uY2Nb4M/9EoefaKPifYk+sQRyO15OBIhzUAYfiTMHtlgCfOwQ8mPjaC3GRLQVDjKGKrtWaMIfY9eA2fTB52bgi9exV8k+uRtWqgBEr78AMnYGpEfuxePQ+jf2lF/609hB8ITkEjSRgEF5FF89F7SiGyJy6vMvvQNTiX9FWxXFtkA6ySpqTRfkcHgLN1txoXelUEb54BncLg+Bu12UL1AiCTiXzoJ/Iz4wpgG5EyZJpjKKwvgJLPgFuF0ml5iRBNY8tQfagxWYFz+G7RjwFsXm0yGyJfrgMAo798NcO4D5hidmrLvKW1CRBOT26W0YQvqFrSjpBFUBmlfOB3HKmiJSD1RgORAXR9X04NeT9sVWyva7iqZyG3q7sjWSU1l3gbqxpNE2Lf034OI76/4hDP9GOG/IcAbDmObgXe25juNDXr30OIqj+DP+VfWW5bNaseaQT4dFVb01Lwq5C73ItUhkH4Vxy2OYHbadhj0pDg27OLHLwig6u0rCUec+fcFdb6dfs6/j++1OcDARZwOtoE9nWUbLeaqa4podukEpXirLFH6SgMfDKIpWfuJw/xgo/FVgXPMU5lh83rpTMzcbOEquwBIiGiIPKMCkinvWq+W0sqTvyGIvZjXoeklT/QkQLa3Iv3wExAdg9ut+3amreSv0lZA9l9MuK8enFPiEJurI+/dQnGTKO25kHLe4XrA9RYQxaRSVn2GKfazq3lzAvmFTHH26Xk+9EZDZBAlsv9a3lpXKjLFTYvZ+ZJp94p8kl3C9E5BR4giN965lsqm+LLkZXmcz9V4rD2DEz59N/ZDZSCzAyQAAAABJRU5ErkJggg==
// @description Add buttons and keyboard shortcuts to tweetdeck for clear all tweets or column tweets
// @match   https://tweetdeck.twitter.com/*
// @match   http://tweetdeck.twitter.com/*
// @match   https://www.tweetdeck.twitter.com/*
// @match   http://www.tweetdeck.twitter.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant       none
// @copyright   B1nj
// @license License:X11 (MIT)
// @downloadURL https://update.greasyfork.org/scripts/15976/TweetDeck%20Clear.user.js
// @updateURL https://update.greasyfork.org/scripts/15976/TweetDeck%20Clear.meta.js
// ==/UserScript==


function addButtons() {
    var button = '<button style="position: absolute; right: 10px; top: -10px; padding-bottom: 0px;" type="button" class="js-user-button Button--link btn-options-tray padding-hn "> <i class="icon icon-clear-timeline"></i> <span class="label">Clear</span> </button>';
    window.eval("window.TD_mustaches['column/column_header.mustache'] = window.TD_mustaches['column/column_header.mustache'].replace(/\\\s*<\\\/header>/, '" + button + " </header>');");

    $(document).on('click', '.js-user-button', function () {
        clearTweets($(this).parents('.js-column'));
    });
}

function addButtonAll() {
    var buttonAll = '<a class="js-user-buttonAll link-clean cf app-nav-link padding-h--10"> <div class="obj-left margin-l--2"> <i class="icon icon-clear-timeline icon-medium"></i> </div> <div class="nbfc padding-ts hide-condensed txt-size--16 app-nav-link-text">Clear all</div> </a>';
    window.eval("window.TD_mustaches['topbar/app_header.mustache'] = window.TD_mustaches['topbar/app_header.mustache'].replace(/<\\\/a>\\\s*<\\\/nav>/,'</a> " + buttonAll + " </nav>');");

    $(document).on('click', '.js-user-buttonAll', function () {
        $('.js-user-button').each(function() {
            $(this).trigger('click');
        });
    });
}

function clearTweets($col) {
    $buttonOptions = $('a[data-action="options"]', $col)[0];
    $buttonOptions.click();
    window.setTimeout(function ($col, $buttonOptions) {
        $('button[data-action="clear"]', $col)[0].click();
        $buttonOptions.click();
    }, 1000, $col, $buttonOptions);
}


// Add Keyboard shortcuts
var key = [];
function addKeyboardShortcuts() {
    $(document).on("keydown keyup", function(e){

        // First check if user has an open tweet compose or reply window. If so, ignore any "Delete" keypress
        var userIsReplying = $('.js-inline-reply').length > 0 || $('.js-compose-text').is(':focus');

        // Next check if user is viewing the expanded detail of a selected tweet, in which case Delete key should just return to column view and not clear the column.
        var userIsReturningFromDetail = $('.js-tweet-detail').length > 0;

        key[e.keyCode] = e.type == 'keydown';

        if (
            (!userIsReplying && !userIsReturningFromDetail) &&
            (test_key('del') || test_key('mac-del'))
        ) {
            $jsColumnFocused = $('.js-column.is-focused');
            if ($jsColumnFocused.length) {
                $jsColumnFocused.find('.js-user-button').trigger('click');
                key = [];
            }

            $isSelectedTweet = $('.is-selected-tweet');
            if ($isSelectedTweet.length) {
                $isSelectedTweet.parents('.js-column').find('.js-user-button').trigger('click');
                key = [];
            }
        }

        if (!userIsReplying && (test_keys('alt', 'del') || test_keys('ctrl', 'mac-del'))) {
            $('.js-user-buttonAll').trigger('click');
            key = [];
        }

        // If we are skipping because user is replying or returning from detail, still clear out the key array so those keypresses don't get counted with future keypresses
        if (userIsReplying || userIsReturningFromDetail) key = [];
    });
}

/* http://stackoverflow.com/questions/5203407/javascript-multiple-keys-pressed-at-once */
function test_key(selkey){
    var alias = {
        "alt":   18,
        "ctrl":  17,
        "shift": 16,
        "C":     67,
        "del":   46,
        "mac-del": 8
    };
    return key[selkey] || key[alias[selkey]];
}

function test_keys(){
    var i,
        keylist = arguments,
        status = true;

    for(i = 0; i < keylist.length; i++){
        if(!test_key(keylist[i])){
            status = false;
        }
    }
    return status;
}

function addInfosShortcuts(){
    // Add text Keyboard shortcuts in modal
    var txt  = '<dd class="keyboard-shortcut-definition"><span class="text-like-keyboard-key">Del</span> Clear active column</dd>'
             + '<dd id="js-keyboard-clear" class="keyboard-shortcut-definition"><span class="text-like-keyboard-key">1</span>…<span class="text-like-keyboard-key">9</span> + <span class="text-like-keyboard-key">Del</span>  Clear column 1－9</dd>'
             + '<dd class="keyboard-shortcut-definition"><span class="text-like-keyboard-key">Alt</span> + <span class="text-like-keyboard-key">Del</span> Clear all</dd>';

    window.eval("window.TD_mustaches['keyboard_shortcut_list.mustache'] = window.TD_mustaches['keyboard_shortcut_list.mustache'].replace(/<\\\/dl>\\\s*<dl/, ' " + txt + " </dl> <dl');");
}

addButtons();
addButtonAll();
addKeyboardShortcuts();
addInfosShortcuts();
