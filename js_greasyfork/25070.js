// ==UserScript==
// @name         GGn DLSite Uploady
// @namespace    https://orbitalzero.ovh/scripts
// @version      0.3
// @include      https://gazellegames.net/upload.php
// @include      http://www.dlsite.com/*
// @include      https://www.dlsite.com/*
// @description  Uploady for DLSite
// @author       NeutronNoir
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant		 GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @require      https://greasyfork.org/scripts/23948-html2bbcode/code/HTML2BBCode.js
// 
// @downloadURL https://update.greasyfork.org/scripts/25070/GGn%20DLSite%20Uploady.user.js
// @updateURL https://update.greasyfork.org/scripts/25070/GGn%20DLSite%20Uploady.meta.js
// ==/UserScript==
(function () {
    var links = JSON.parse(GM_getValue('links') || '{}');
    GM_setValue('links', JSON.stringify(links));
    if (typeof console != 'undefined' && typeof console.log != 'undefined') console.log(links);
    if (window.location.hostname == 'gazellegames.net') {
        links.active = false;
        add_search_buttons();
    } 
    else if (typeof links.active != 'undefined' && links.active === true) {
        add_validate_button();
    }
    GM_addStyle(button_css());
}) ();
function add_search_buttons() {
    $('#uploady').after('<input id="dlsite_uploady_Search" type="button" value="Search DLSite"/>');
    $('#dlsite_uploady_Search').click(function () {
        var title = encodeURIComponent($('#title').val());
        window.open('http://www.dlsite.com/eng/fsr/=/language/en/keyword/' + title, '_blank');
        var links = {
        };
        links.dlsite = {
        };
        links.active = true;
        GM_setValue('links', JSON.stringify(links));
    });
    //need to add a button to fill the inputs and stop gathering links
    $('#dlsite_uploady_Search').after('<input id="dlsite_uploady_Validate" type="button" value="Validate DLSite"/>');
    $('#dlsite_uploady_Validate').click(function () {
        var links = JSON.parse(GM_getValue('links') || '{}');
        $('#title').val(links.dlsite.title);
        $('#tags').val(links.dlsite.tags);
        $('#year').val(links.dlsite.year);
        $('#image').val(links.dlsite.cover);
        $('#album_desc').val(links.dlsite.description);
        links.dlsite.screenshots.forEach(function (screenshot, index) {
            if (index >= 16) return; //The site doesn't accept more than 16 screenshots
            if (index >= 3) $('a:contains(\'+\')').click(); //There's 3 screenshot boxes by default. If we need to add more, we do as if the user clicked on the "[+]" (for reasons mentioned above)
            $('[name=\'screens[]\']').eq(index).val(screenshot); //Finally store the screenshot link in the right screen field.
        });
        links.dlsite = {};
        
        links.active = false;
        GM_setValue('links', JSON.stringify(links));
    });
}
function add_validate_button() {
    if (typeof console != 'undefined' && typeof console.log != 'undefined') console.log('Adding button to window');
    $('body').prepend('<input type="button" id="save_link" value="Save link for GGn"/>');
    $('#save_link').click(function () {
        var links = JSON.parse(GM_getValue("links") || '{}');
        if (typeof links.dlsite === 'string') links.dlsite = JSON.parse(links.dlsite); //Fix for a weird bug happening on http://www.arkane-studios.com/uk/arx.php, transforming the array of strings into a string
        links.dlsite.cover = $("#work_visual").css("background-image").slice(5, -2);
        links.dlsite.screenshots = [];
        $("a[rel='sample_images']").each(function (index, item) {
            links.dlsite.screenshots.push('https:' + $(item).attr('href'));
        });
        links.dlsite.description = html2bb($("div[itemprop='description']").html());
        var date_array = $("#work_outline th:contains('Release')").next().text().split('/');
        links.dlsite.year = date_array[date_array.length - 1];
        var tags_array = [
        ];
        $('.main_genre').first().children('a').each(function (index, item) {
            tags_array.push($(item).text().trim().toLowerCase().replace(' ', '.'));
        });
        links.dlsite.tags = tags_array;
        links.dlsite.title = $("span[itemprop='title']").last().text().trim();
        links.dlsite.circle = $("span[itemprop='brand']").text();
        GM_setValue("links", JSON.stringify(links));
        //window.close();
    });
}
function button_css() {
    return '\t\t#save_link {\t\t\tposition: fixed;\t\t\tleft: 0;\t\t\ttop: 0;\t\t\tz-index: 999999;\t\t\tcursor: pointer;            height: 5%;            background-color: lightblue;\t\t}\t'
    ;
}
