// ==UserScript==
// @name         Brawlify - Active Member
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Monitor club member progress
// @author       Esor
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @include      /https?:\/\/(www.)?brawlify.com\/stats\/.+
// @icon         https://www.google.com/s2/favicons?sz=64&domain=brawlify.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516634/Brawlify%20-%20Active%20Member.user.js
// @updateURL https://update.greasyfork.org/scripts/516634/Brawlify%20-%20Active%20Member.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var css = '';
    window.progressrange = ['recent', 'today', 'week', 'season'];
    window.progressindex = 3;

    css += '.sticky-top { position: relative !important; } ';                                          // remove sticky navbar
    css += '@media (min-width: 1200px) { .container#activemember { max-width: 1300px !important; } }'; // extra width foe Active Member

    $('.container-fluid.content-container').css({'max-width' : '1270px'}); // extra width for parent container to allow Active Member have wider max-width
    $('.text-white.shadow-normal.mb-0:contains("Data Visualization")').hide();
    addCSS(css);
    getProgress();

    $(document).ready(async function() {
        if ($('[id^="push"]').length) {
            $('html, body').scrollTop($('[id^="push"]').offset().top); // for batttle stats
        }

        setInterval(function(){
            if ($('#activemember').is(':visible')) return;
            if (activeMemberList.length != 30)     return;
            card();
            $('html, body').scrollTop($('#activemember').offset().top); // for club stats
        }, 500)

    });

    function addCSS(css) {
        $('<style type="text/css"></style>').html(css).appendTo('head');
    }

    async function getProgress () {
        window.activeMemberList = [];
        await asyncForEach(memberList, async (tag) => {
            fetch(`https://brawlify.com/stats/profile/${tag.slice(1)}`)
                .then(response => response.text())
                .then(data =>  saveMember(data))
                .catch(error => console.error("Error fetching page:", error));
        });
    }

    function saveMember(data) {
        // Create a temporary jQuery object to hold the HTML
        let doc = $(data);

        // Find the #mainNumbers element and log its text
        let progress = doc.find('#mainNumbers').text().trim();
        let name     = doc.find('.profile-top h1').text();
        let tag      = doc.find('.profile-top p').contents().eq(0).text().slice(1);
        let trophy   = doc.find('th:contains("Trophies"):first').next().text().replace(',', '');

        let zprogress = doc.find('#mainNumbers').clone();
        let zrecent   = doc.find('#mainRecent').addClass('progress-range').clone();
        let ztoday    = doc.find('#mainDaily').addClass('progress-range').clone();
        let zweek     = doc.find('#mainWeekly').addClass('progress-range').clone();
        let zseason   = doc.find('#mainSeason').addClass('progress-range').clone();

        // Save member data
        activeMemberList.push({ tag, name, trophy, ...split(progress), zprogress, zrecent, ztoday, zweek, zseason });
        activeMemberList = activeMemberList.sort((a,b) => b.xseason - a.xseason);

        // Output the text
        // console.log(tag, name, progress);
    }

    function split(data) {
        // Initialize the object outside the loop
        let splited = {};

        // Split the input data into lines and process each line
        data.split('\n').forEach((line) => {
            let match = line.trim().match(/^([+-]?[\d,]+)\s(.*)$/); // match value and label
            if (match) {
                let [, value, label] = match;

                // Assign the value based on the label
                if (label === 'recently')    splited.xrecent = value.replace('+', '').replace(',', '');
                if (label === 'today')       splited.xtoday  = value.replace('+', '').replace(',', '');
                if (label === 'this week')   splited.xweek   = value.replace('+', '').replace(',', '');
                if (label === 'this season') splited.xseason = value.replace('+', '').replace(',', '');
            }
        });

        return splited;
    }

    window.card = function() {
        var elem   = $('#members').clone();
        var toggle = $('#graphGroupingBtn').clone();

        toggle.attr('id', 'activememberBtn');
        toggle.attr('onclick', 'switchProgress()');
        toggle.text('SEASON');

        elem.attr('id', 'activemember');
        elem.find('.text-white.shadow-normal.mb-1').text('Active Members');
        elem.find('.alert.alert-info.mb-1').contents().wrapAll('<div class="new-wrapper"></div>');
        elem.find('.alert.alert-info.mb-1').addClass('d-flex justify-content-between align-items-center');
        elem.find('.new-wrapper').after(toggle);
        elem.find('.row:first').children().each(function() {
            var tag    = $(this).attr('id');
            var member = activeMemberList.find(item => item.tag == tag);

            $(this).find('.text-dark.h6.small').remove();
            $(this).find('.text-dark.border-info').remove();
            $(this).find('.text-white.mr-1').remove();
            $(this).find('.h5.mt-1').parent().css({
                'white-space': 'nowrap',
                'overflow': 'hidden',
                'text-overflow': 'ellipsis',
                'margin-right' : '5px',
            });
            $(this).find('.grayer-border:last').find('h4, .container').remove();
            $(this).find('.grayer-border:last').find('.stats-top').empty().append(member.zprogress);
            $(this).find('.grayer-border:last').find('tr:contains("Position"), tr:contains("Role")').remove();
            $(this).find('.text-orange.ml-0').after(member.zseason).remove();
            $(this).removeClass('col-lg-6');
            $(this).addClass('col-lg-3');
            $(this).data('recent', member.xrecent);
            $(this).data('today',  member.xtoday);
            $(this).data('week',   member.xweek);
            $(this).data('season', member.xseason);
        });

        var sorted = elem.find('.row:first').children().sort((a, b) => {
            return parseInt($(b).data("season")) - parseInt($(a).data("season"));
        });
        elem.find('.row:first').append(sorted);
        elem.insertBefore('#members');
    }

    window.switchProgress = function () {
        progressindex = (progressindex + 1) % 4; // Increment the index and cycle back to 0 after reaching the end

        var range = progressrange[progressindex];
        $('#activememberBtn').text(range.toUpperCase()); // Set the button text

        // Change Member Progress
        $('#activemember').find('.row:first').children().each(function() {
            var tag    = $(this).attr('id');
            var member = activeMemberList.find(item => item.tag == tag);

            $(this).find('.progress-range').after(member[`z${range}`])
            $(this).find('.progress-range:first').remove();
        });

        // Resort Member Card
        var sorted = $('#activemember').find('.row:first').children().sort((a, b) => {
            return parseInt($(b).data(range)) - parseInt($(a).data(range));
        });
        $('#activemember').find('.row:first').append(sorted);
    }

})();