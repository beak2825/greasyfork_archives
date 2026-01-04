// ==UserScript==
// @name            TAU - Better bidding
// @description     Improve the user experience of bidding on courses in TAU's bidding website
// @version         1.0.3
// @namespace       https://www.github.com/sh0oki/tau-better-bidding
// @source          https://www.github.com/sh0oki/tau-better-bidding
// @include         https://www.ims.tau.ac.il/Bidd/BD/Kursim.aspx*
// @include         https://www.ims.tau.ac.il/tal/TL/Mivchanim_L.aspx*
// @include         https://iims.tau.ac.il/tal/TL/Mivchanim_L.aspx*
// @include         https://www.ims.tau.ac.il/tal/TL/Marechet_L.aspx*
// @include         https://iims.tau.ac.il/tal/TL/Marechet_L.aspx*
// @require         https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @copyright       2018, sh0oki
// @downloadURL https://update.greasyfork.org/scripts/372852/TAU%20-%20Better%20bidding.user.js
// @updateURL https://update.greasyfork.org/scripts/372852/TAU%20-%20Better%20bidding.meta.js
// ==/UserScript==

function mainWrapper() {
    var start_of_semester = '';
    
    function main() {
        if (location.href.includes("Kursim.aspx")) {
            // Increase max number of rows
            increase_max_rows();
            
            // Gray out FULL courses
            remove_full_courses();
        } else if (location.href.includes("Mivchanim_L.aspx")) {
            // Make Test date clickable
            add_to_google_calendar_links();
        } else if (location.href.includes("Marechet_L.aspx")) {
            // Make Test date clickable
            add_courses_to_google_calendar_links();
        }

    }

    function increase_max_rows() {
        max_rows = $('select[name="max_rows"]');
        max_rows.empty();
        max_rows_max_value = 0;
        for (i = 50; i <= 400; i = i * 2) {
            max_rows_max_value = i;
            max_rows.append($('<option/>', { 
                value: max_rows_max_value,
                text : max_rows_max_value
            }));
        }
        max_rows.val(max_rows_max_value);
    }

    function remove_full_courses() {
        tr_selector = $('.tableblds td span b:contains(0)')
            .closest("tr");

        hide_full_courses(tr_selector);
        
        hide_full_courses(tr_selector
            .filter("tr:not(:has(>input[type='checkbox']))")
            .prev());
    }

    function hide_full_courses(selector) {
        selector.css("text-decoration", "line-through")
            .css("background-color", '#AAAFB4');


        selector.find('input[type=checkbox]')
            .attr('disabled', true);
    }

    function link_to_google_calendar(where, date, time, title, description, loc, recur) {
        if (time.indexOf('-') == -1) {
            m = moment(date + " " + time, "DD/MM/YYYY hh:mm").utc();
            m2 = moment(m).add('hours', 2);
        } else {
            times = time.split('-');
            m = moment(date + " " + times[0], "DD/MM/YYYY hh:mm").utc();
            m2 = moment(date + " " + times[1], "DD/MM/YYYY hh:mm").utc();
        }
        
        date_range = m.format() + "/" + m2.format();

        url = "http://www.google.com/calendar/event?action=TEMPLATE&text=" + encodeURIComponent(title) + 
                "&dates=" + encodeURIComponent(date_range.replace(/[\:\-]/g, "")) + 
                "&location=" + encodeURIComponent(loc) + 
                "&details=" + encodeURIComponent(description) + recur;
        
        $(where).wrapInner("<a target=\"_blank\" href=\"" + url + "\"></a>")
    }
    
    function add_to_google_calendar_links() {
        $.each($("table.table tr:not(.listth)"), function(_, tr) {
            cells = $(tr).find("td");
            if (7 != cells.length) {
                return;
            }

            course_id = cells[0].innerText;
            course_name = cells[2].innerText;
            
            exam_id = cells[3].innerText;
            date = cells[4].innerText;
            time = cells[5].innerText;

            exam_name = "[מבחן] " + course_name + " - מועד " + exam_id;
            link_to_google_calendar(cells[4],
                date, time,
                exam_name, 
                "", "Tel Aviv University", "");
        });
    }

    function translate_day_of_week(a) {
        switch (a[0]) {
            case 'א':
                return 7;
            case 'ב':
                return 1;
            case 'ג':
                return 2;
            case 'ד':
                return 3;
            case 'ה':
                return 4;
            case 'ו':
                return 5;
            case 'ש':
                return 6;
        }
    }
    
    function add_courses_to_google_calendar_links() {
        start_of_semester = moment(prompt("First day of semester? [dd/mm/yyyy]"), 'DD/MM/YYYY');
        semester_start_day = start_of_semester.isoWeekday();

        $.each($("table.table tr:not(.listth)"), function(_, tr) {
            cells = $(tr).find("td");
            if (13 != cells.length) {
                return;
            }

            course_id = cells[1].innerText;
            course_name = cells[3].innerText;
            course_type = cells[4].innerText;
            day_of_week = cells[8].innerText;
            n_day_of_week = translate_day_of_week(day_of_week.replace(/\s/,''));
            hours = cells[9].innerText;
            course_location = cells[10].innerText + ", חדר " + cells[11].innerText;            
            
            start_date = start_of_semester.clone().isoWeekday(n_day_of_week);

            if (semester_start_day > n_day_of_week) { 
              start_date = start_of_semester.clone().add(1, 'weeks').isoWeekday(n_day_of_week);
            }

            link_to_google_calendar(cells[8],
                start_date.format("DD/MM/YYYY"), hours,
                course_name + ": " + course_type, 
                "",
                course_location, 
                "&recur=RRULE:FREQ=WEEKLY");
        });
    }

    main();
};

$(document).ready(function() {
    mainWrapper()
});
