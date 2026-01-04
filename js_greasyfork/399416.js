// ==UserScript==
// @name         WK Lesson Items Tooltip
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Displays number of items in lessons queue (sorting by level and type)
// @author       Richard J. Sové
// @include      https://www.wanikani.com/dashboard
// @include      https://www.wanikani.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399416/WK%20Lesson%20Items%20Tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/399416/WK%20Lesson%20Items%20Tooltip.meta.js
// ==/UserScript==


(function()
{
    'use strict';

    // User API Key
    var user_api_key = ''; // <- insert your API key here

    // Create Authorization Header
    var header = new Headers();
    header.append('Authorization','Bearer ' + user_api_key);

    // Get Lessons DOM
    var lessons = document.getElementsByClassName('lessons-and-reviews__lessons-button')[0];
    lessons.addEventListener("mouseover",toggle_tooltip);
    lessons.addEventListener("mouseout",toggle_tooltip);

    // Get Lessons Position
    var parent_rect = lessons.parentNode.getBoundingClientRect();
    var lessons_rect = lessons.getBoundingClientRect();
    var position_x = lessons_rect.x-parent_rect.x; // middle
    var position_y = parent_rect.height; // bottom

    // Tooltip Style
    var style = "<style>"+
	"table#lessons_tooltip_text td:nth-child(even) { text-align : right}"+
    "table#lessons_tooltip_text {margin-left : 25px}"+
    "</style>";
    document.head.insertAdjacentHTML("beforeend",style);

    // Tooltip HTML
    var tooltip_text = "";
    function tooltip_html()
    {
        var tooltip_html = "<div id=\"tooltip\" style=\"top: "+position_y+"px; left: "+position_x+"px; display: block;\">"+
        "<span class=\"arrow\">"+ tooltip_text +
        "</span>"+
        "</div>";
        return tooltip_html;
    }

    // Format
    function table(lvl,rad,kan,voc)
    {
        return "Level "+lvl+"<br><table id=lessons_tooltip_text><tr><td>Radical:</td><td>"+rad+
            "</td></tr><tr><td>Kanji:</td><td>"+kan+"</td><tr><td>Vocab:</td><td>"+voc+"</td></tr><table>";
    }

    // Tooltip Function
    function toggle_tooltip(event)
    {
        if (event.type == "mouseover")
        {
            // Display Tooltip
            lessons.insertAdjacentHTML("beforeend",tooltip_html());
        }
        else if (event.type == "mouseout")
        {
            // Hide Tooltip
            lessons.removeChild(lessons.childNodes[lessons.childNodes.length-1]);
        }
    }

    // HTTP Requests
    var url_summary_info = 'https://api.wanikani.com/v2/summary';
    var url_user_info = 'https://api.wanikani.com/v2/user';
    var url_wk_items = 'https://api.wanikani.com/v2/assignments?srs_stages=0&unlocked=true&levels=';

    // Temp Defs
    var current_level = 26;

    // Request Summary Info to Get Number of Lessons
    var summary_info = new Request(url_summary_info,{headers : header});
    fetch(summary_info)
    .then(response => response.json())
    .then(data =>
    {
        // Get Number of Lessons
        var total_lessons = data.data.lessons.length;

        // Request User Info to Get Current Level
        var user_info = new Request(url_user_info,{headers : header});
        fetch(user_info)
        .then(response => response.json())
        .then(data =>
        {
            // Get Current Level
            var current_level = data.data.level;

            // Fetch API
            fetchAPI(current_level,0,0,0);

            // Fetch Function Definition
            function fetchAPI(level,radical_count,kanji_count,vocab_count)
            {
                var request = new Request(url_wk_items+level,{headers : header});
                fetch(request)
                .then(response => response.json())
                .then(data =>
                {
                    // Count Items in 'level'
                    var radical = 0, kanji = 0, vocab = 0;
                    for (var i = 0; i < data.data.length; i++)
                    {
                        var type = data.data[i].data.subject_type;
                        if (type == "radical")
                        {
                            radical++;
                        }
                        else if (type == "kanji")
                        {
                            kanji++;
                        }
                        else if (type == "vocabulary")
                        {
                            vocab++;
                        }
                    }
                    radical_count+=radical;
                    kanji_count+=kanji;
                    vocab_count+=vocab;

                    // Append to Tooltip
                    if (level==current_level || radical+kanji+vocab!=0)
                    {
                        tooltip_text += table(level,radical,kanji,vocab);
                    }

                    // Determine if All Lesson Items Have Been Counted
                    if ((radical_count+kanji_count+vocab_count) == total_lessons || level<2)
                    {
                        return;
                    }
                    else
                    {
                        level--;
                        fetchAPI(level,radical_count,kanji_count,vocab_count);
                    }
                });
            }
        });
     });
})();