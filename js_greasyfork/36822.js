// ==UserScript==
// @name         YouTube Clickbait Rubbish Scrubber
// @namespace    http://dbiru.com/
// @version      0.1
// @description  I'm just so tired of this Rubbish. For now, this script simply marks offending, clickbaity videos with an identifier so you can be on your way.
// @author       dbiru
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36822/YouTube%20Clickbait%20Rubbish%20Scrubber.user.js
// @updateURL https://update.greasyfork.org/scripts/36822/YouTube%20Clickbait%20Rubbish%20Scrubber.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var settings = {
        /* Highlights videos with red to make it easier to avoid */
        markVideos: true,

        /* Remove the videos from the listing altogether */
        hideVideos: false,

        /* Number of seconds to delay before hiding the video */
        hideVideoDelay: .5,

         /* The annoyances we want to look for in the*/
         /* video listing. Remove or add as necessary. */
         /* A corresponding object is fetched below this */
         /* in order to get the pattern to be used to */
         /* match the video and the tag to mark the video with*/
         /* if there's a match.*/
        annoyancesBlocked: [
            'vlogs',
            'compilations',
            'reactions',
            'generalRubbish',
            'clickbaits'
        ],

         /* Targets general annoyances, videos with all caps */
         /* in the title, annoying emojis or unicode  */
        generalRubbish: {
            tag: '[Just Rubbish]',
            patterns: [
                /★{2,}/,
                /^[A-Z\s0-9\(\)\!-_]+$/
            ]
        },


        /* Targets reaction videos.*/
        reactions: {
            tag: '[Reaction Rubbish]',
            patterns: [
                /(live|best) reaction/i,
                /try not to \w*/i,
                /react to/i,
                /REACTION[!]*$/i
            ]
        },


         /* Targets clickbaits with  */
         /* over-the-top titles */
        clickbaits: {
            tag: '[Clickbait]',
            patterns: [
                /top \d+/i,
                /ultimate .+/i,
                /\d+.*gone.*/i,
                /\w\s(wtf|crazy|tv|movie|funny) moments/i,
                /the (most|worst|best|greatest|least)/i,
                /fail wins/i
            ]
        },


        /* Targets countdowns, "best-of's", and */
        /* general compilation videos */
        compilations: {
            tag: '[Compilation Rubbish]',
            patterns: [
                /compilation/i,
                /best of/i,
                /videos[\s!#]*$/i,
                /\d+\s*(best|worst|winning|losing|successfully|win)/i,
                /^.*#\d+$/i
            ]
        },

        vlogs: {
            tag: '[Vlog Rubbish]',
            patterns: [
                /vlog/i
            ]
        }
    };


    /**
     * Checks to see if the video contains any
     * matches from the settings object
     * 
     * @param  {object} video dom element
     * @return {Boolean}
     */
    var isAnnoyance = function(video) {
        var title = video.getAttribute('title');
        settings.annoyancesBlocked.forEach(function(annoyance) {
            //console.info('Checking', title,'annoyance type: ' + annoyance);
            settings[annoyance].patterns.forEach(function(clickbait) {
                if (title.search(clickbait) !== -1) {
                    //console.info('Matched', title, 'on ', settings[annoyance].patterns);
                    throw new Error(settings[annoyance].tag);
                }
            });
        });
    };


    /**
     * Checks to see if the specified video is deemed annoying
     * via the isAnnoynance() method invoked in this function. 
     * If so, then the video marked with red and tagged
     * @param  {object}
     * @return {void}
     */
    var checkVideoForAnnoyance = function(video_title) {
        var video_parent;
        try {
            if (video_title.getAttribute('data-marked') === null)
                video_title.setAttribute('data-marked', 'true'); 
                isAnnoyance(video_title);
        } catch (e) {
            video_parent = video_title.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
            video_title.setAttribute('style', 'background: red; padding: 3px; border-radius: 2.5px; color: white;');
            video_title.innerText = e.message + ' ' + video_title.innerText;

            if (settings.hideVideos === true) {
                // delay the hiding to let the user know our intentions
                setTimeout(function() {
                    video_parent.remove();
                }, settings.hideVideoDelay * 1000);
            }
        }
    };

    var init = function() {
        var video_titles = document.querySelectorAll('#video-title:not([data-marked="true"]');
        var i;
        for (i = 0; i < video_titles.length; i++) {
            checkVideoForAnnoyance(video_titles[i]);
        }
    };

    window.onload = function() {
        init();
        setInterval(init, 1200);
    };
})();
