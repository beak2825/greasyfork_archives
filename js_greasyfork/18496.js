// ==UserScript==
// @name         Workflowier
// @namespace    Workflowier
// @include      https://workflowy.com/*
// @author       Nick Busey
// @grant        none
// @description  User Script for Workflowy.com that adds some extra features.
// @version      0.2
// @license      MIT
// @homepageURL  http://workflowier.com/
// @downloadURL https://update.greasyfork.org/scripts/18496/Workflowier.user.js
// @updateURL https://update.greasyfork.org/scripts/18496/Workflowier.meta.js
// ==/UserScript==

// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}

searching = false;

// the guts of this userscript
function main() {
    // Note, jQ replaces jQ to avoid conflicts.

    // Calendar
    // Find due date items
    calendarCreated = false;


    function myDateFunction(id, fromModal) {
        var date = $("#" + id).data("date");
        var hasEvent = $("#" + id).data("hasEvent");
        search.searchProjectTree('#due-'+date);
        calendarCreated = false;
        jQ('.cal_wrap').slideToggle();
        return true;
    }

    jQ('#savedViewHUDButton').after("<div class='menuButton button'><div class='topBarButtonTextContainer'><a href='#' id='showCalendar'>Calendar</a></div></div>");
    jQ('#showCalendar').click(function(e) {
        e.preventDefault();
        if (!calendarCreated) {
            $('body').append('<div id="calendar" class="cal_wrap"></div>')
            var dates = generateCalendarData();
            $("#calendar").zabuto_calendar({
                data: dates,
                action: function () {
                    return myDateFunction(this.id, false);
                },
                action_nav: function() {
                    setTimeout(function() {
                        $('.glyphicon-chevron-right').html('&gt;');
                        $('.glyphicon-chevron-left').html('&lt;');
                    },100);
                },
                legend: [
                    {type: "text", label: "Tasks Incomplete"},
                    {type: "list", list: ["grade-1", "grade-2", "grade-3", "grade-4", "grade-5"]},
                    {type: "text", label: "Tasks Completed"}
                ],
            });

            $('.glyphicon-chevron-right').html('&gt;');
            $('.glyphicon-chevron-left').html('&lt;');
            calendarCreated = true;
        } else {
            calendarCreated = false;
            jQ('.zabuto_calendar').remove();
        }
        jQ('.cal_wrap').slideToggle();
    });

    // Insert recent links
    var recentLinks = "<div class='menu-options' id='recentLinksMenu'>"+
    "<div class='button'><div class='topBarButtonTextContainer'><a href='#' id='recentLink_1wk'>This Week</a></div></div>"+
    "<div class='button'><div class='topBarButtonTextContainer'><a href='#' class='button' id='recentLink_24hrs'>Today</a></div></div>"+
    "<div class='button'><div class='topBarButtonTextContainer'><a href='#' class='button' id='recentLink_1hr'>Last Hour</a></div></div>"+
    "</div>";
    jQ('#savedViewHUDButton').after("<div class='menuButton button'><div class='topBarButtonTextContainer'><a href='#' id='showRecentLinks'>Recent</a></div></div>"+recentLinks);

    jQ('#showRecentLinks').click(function(e) {
        e.preventDefault();
        jQ('#recentLinksMenu').slideToggle();
    });

    jQ('#recentLink_1wk').click(function(e) {
        e.preventDefault();
        if (jQ('#searchBox').val()=='last-changed:7d') {
            search.searchProjectTree('');
        } else {
            search.searchProjectTree('last-changed:7d');
        }
    });
    jQ('#recentLink_24hrs').click(function(e) {
        e.preventDefault();
        if (jQ('#searchBox').val()=='last-changed:1d') {
            search.searchProjectTree('');
        } else {
            search.searchProjectTree('last-changed:1d');
        }
    });
    jQ('#recentLink_1hr').click(function(e) {
        e.preventDefault();
        if (jQ('#searchBox').val()=='last-changed:1h') {
            search.searchProjectTree('');
        } else {
            search.searchProjectTree('last-changed:1h');
        }
    });

    var generateTagList = function() {
        // Generate list of all hashtags
        var tags = $('.contentTagText');
        var tagObjs = {};
        tags.each(function(ii, obj) {
            var tag = jQ(obj).text().toLowerCase();

            var tagObj = tagObjs[tag];
            if (!tagObj) {
                tagObj = {'count':1};
            } else {
                tagObj.count++;
            }
            tagObjs[tag] = tagObj;
        });
        var tagObjsArray = [];
        for (var tag in tagObjs) {
            var tagObj = tagObjs[tag];
            tagObj.tag = tag;
            tagObjsArray.push(tagObj);
        }
        return tagObjsArray.sort(function (a, b) {
            return b.count - a.count;
        });
    };

    var generateCalendarData = function() {
        var currentSearch = jQ('#searchBox').val();
        // First let's delete the existing tags index, or else it will count those and old tags are never removed.
        search.searchProjectTree('#wf-tag-list');
        $('.project.matches:last .notes .content').text('');
        $('.project.matches:last .content').trigger('blur');
        // Now find existing tags.
        showCompleted();
        search.searchProjectTree('#due-');
        var allDatedItems = generateTagList();
        search.searchProjectTree('#due- is:complete');
        var completedDateItems = generateTagList();

        search.searchProjectTree(currentSearch);

        var dates = [];
        for (var ii in allDatedItems) {
            var dateItem = allDatedItems[ii];
            console.log(dateItem);
            var tag = dateItem.tag;
            if (tag.substr(0,4)=='due-') {
                var count = dateItem.count;
                var completed = completedDateItems.filter(function (obj) {
                    return obj.tag === tag;
                });
                var completed_count = (completed[0]) ? completed[0].count : 0;
                var completed_pct = Math.round(100*(completed_count/count));
                var className = 'grade-5';
                switch (true) {
                    case (completed_pct < 20):
                        className = 'grade-1';
                        break;
                    case (completed_pct > 20 && completed_pct < 40):
                        className = 'grade-2';
                        break;
                    case (completed_pct > 40 && completed_pct < 60):
                        className = 'grade-3';
                        break;
                    case (completed_pct > 60 && completed_pct < 80):
                        className = 'grade-4';
                        break;
                    case (completed_pct > 80):
                        className = 'grade-5';
                        break;
                }

                dates.push({
                    "date":dateItem.tag.substr(4),
                    "classname": className,
                    "title": Math.round(100*(completed_count/count))+"% complete"
                });
            }
        }
        console.log(dates);
        return dates;
    };

    var generateTags = function() {
        var currentSearch = jQ('#searchBox').val();
        // First let's delete the existing tags index, or else it will count those and old tags are never removed.
        search.searchProjectTree('#wf-tag-list');
        $('.project.matches:last .notes .content').text('');
        $('.project.matches:last .content').trigger('blur');
        // Now find existing tags.
        search.searchProjectTree('#');
        var allTags = generateTagList();
        // Now find which of those are completed
        search.searchProjectTree('# is:complete');
        var completedTags = generateTagList();

        // Store the list of tags
        updateTagsNote(allTags);

        // Update the menu
        var tagLinkOutput = '';
        for (var ii in allTags) {
            var count = allTags[ii]['count'];
            var tag = allTags[ii]['tag'];
            var completed = completedTags.filter(function (obj) {
                return obj.tag === tag;
            });
            var completed_count = (completed[0]) ? completed[0].count : 0;
            tagLinkOutput += "<a href='/#/"+tag+"?q=%23"+tag+"' title='"+Math.round(100*(completed_count/count))+"% "+completed_count+"/"+count+" complete.'><strong>"+count+"</strong> #"+tag+"</a>";
        }
        $('#tagsMenu').html(tagLinkOutput);
        search.searchProjectTree(currentSearch);

    };

    var generateTagsMenu = function () {
        // Ensure the search is ready. This will throw an exception if not.
        var currentSearch = jQ('#searchBox').val();
        search.searchProjectTree('#wf-tag-list');
        search.searchProjectTree(currentSearch);

        generateTags();
        jQ('#savedViewHUDButton').after("<div class='button menuButton'><div class='topBarButtonTextContainer'><a href='#' class='button' id='openTags'>View Tags</a></div></div><div class='menu-options' id='tagsMenu'></div>");
        jQ('#openTags').on('click',function(e) {
            e.preventDefault();
            // If we're showing the tags menu, regenerate the tags list. Don't do it on hide.
            if ($('#tagsMenu:visible').length < 1) {
                generateTags();
            }
            jQ('#tagsMenu').slideToggle();
        });
    };

    var updateTagsNote = function(tagArray) {
        window.location.hash='';
        search.searchProjectTree('#wf-tag-list');
        var tagList = '';
        for (var ii in tagArray) {
            var count = tagArray[ii]['count'];
            var tag = tagArray[ii]['tag'];
            tagList += count+" #"+tag+" - ";
        }

        $('.project.matches:last .notes .content').text('View Full List: '+tagList);
        $('.project.matches:last .content').trigger('blur');
    };

    var attemptTags = function() {
        setTimeout(function() {
            try {
                generateTagsMenu();
            } catch(e) {
                attemptTags();
            }
        },500);
    };

    attemptTags();

    // Add -rand functionality
    jQ(window).on('hashchange',function(e) {
        if (searching) {
            return false;
        }

        var query = jQ('#searchBox').val();
        var needle=/(%23\w*-rand)+/;
        var match = window.location.href.match(needle);
        if (match) {
            // A tag with -rand on the end has been clicked. Locate another.
            searching = true;
            var tag = match[0]; //matches "2 chapters"
            tag = "#"+tag.slice(3);
            window.location.href='/#';
            search.searchProjectTree(tag);
            var target = null;
            var count = 0;
            var tags = $('.contentMatch');
            var random = $(tags[Math.floor(Math.random()*tags.length)])[0];
            var parent = jQ(random).parents('.name').find('a').first();
            var href = jQ(parent).attr('href');
            window.location.href = href;
            setTimeout(function() {
                searching = false;
            },100);
        }
    });

    // Add image popups
    var addImagePreviews = function() {
        jQ('a').each(function() {
            if (jQ(this).data('previewLoaded')) {
                return;
            }
            var url = this.href;
            var target = this;
            var img = null;
            function testImage(url, callback, timeout) {
                timeout = timeout || 5000;
                var timedOut = false, timer;
                img = new Image();
                img.onerror = img.onabort = function() {
                    if (!timedOut) {
                        clearTimeout(timer);
                        callback(url, 0);
                    }
                };
                img.onload = function() {
                    if (!timedOut) {
                        clearTimeout(timer);
                        callback(url, 1);
                    }
                };
                img.src = url;
                timer = setTimeout(function() {
                    timedOut = true;
                    // reset .src to invalid URL so it stops previous
                    // loading, but doesn't trigger new load
                    img.src = "//!!!!/test.jpg";
                    callback(url, "timeout");
                }, timeout);
            }
            testImage(url,function(url,loaded) {
                jQ(target).data('previewLoaded',true);
                if (loaded) {
                    jQ(target).after(jQ(img).addClass('image-preview'));
                }
            },2000);
        });
    };

    // Add styles
    jQ('body').append("<style>"+
        ".image-preview { height: 100px; display: block; } "+
        ".image-preview:hover { height: initial; display: block; } "+
        "#tagsMenu{ height:300px; overflow:scroll; max-width: 250px; right: 140px; }"+
        "#tagsMenu a { margin: 0 5px; display: block; }"+
        "#recentLinksMenu{ right:400px; }"+
        ".menuButton{ display: block; color: white; margin-left: -1px;    padding: 8px 1em;    font-size: 13px;    text-align: center;    float: right;    border-bottom: none;    border-left: 1px solid #111;    border-right: 1px solid #111; border-radius: 0;    background-color: #555;    position: relative;}"+
        "div.zabuto_calendar{margin:0;padding:0}div.zabuto_calendar .table{width:100%;margin:0;padding:0}div.zabuto_calendar .table th,div.zabuto_calendar .table td{padding:4px 2px;text-align:center}div.zabuto_calendar .table tr th,div.zabuto_calendar .table tr td{background-color:#fff}div.zabuto_calendar .table tr.calendar-month-header th{background-color:#fafafa}div.zabuto_calendar .table tr.calendar-month-header th span{cursor:pointer;display:inline-block;padding-bottom:10px}div.zabuto_calendar .table tr.calendar-dow-header th{background-color:#f0f0f0}div.zabuto_calendar .table tr:last-child{border-bottom:1px solid #ddd}div.zabuto_calendar .table tr.calendar-month-header th{padding-top:12px;padding-bottom:4px}div.zabuto_calendar .table-bordered tr.calendar-month-header th{border-left:0;border-right:0}div.zabuto_calendar .table-bordered tr.calendar-month-header th:first-child{border-left:1px solid #ddd}div.zabuto_calendar div.calendar-month-navigation{cursor:pointer;margin:0;padding:0;padding-top:5px}div.zabuto_calendar tr.calendar-dow-header th,div.zabuto_calendar tr.calendar-dow td{width:14%}div.zabuto_calendar .table tr td div.day{margin:0;padding-top:7px;padding-bottom:7px}div.zabuto_calendar .table tr td.event div.day,div.zabuto_calendar ul.legend li.event{background-color:#fff0c3}div.zabuto_calendar .table tr td.dow-clickable,div.zabuto_calendar .table tr td.event-clickable{cursor:pointer}div.zabuto_calendar .badge-today,div.zabuto_calendar div.legend span.badge-today{background-color:#357ebd;color:#fff;text-shadow:none}div.zabuto_calendar .badge-event,div.zabuto_calendar div.legend span.badge-event{background-color:#ff9b08;color:#fff;text-shadow:none}div.zabuto_calendar .badge-event{font-size:.95em;padding-left:8px;padding-right:8px;padding-bottom:4px}div.zabuto_calendar div.legend{margin-top:5px;text-align:right}div.zabuto_calendar div.legend span{color:#999;font-size:10px;font-weight:normal}div.zabuto_calendar div.legend span.legend-text:after,div.zabuto_calendar div.legend span.legend-block:after,div.zabuto_calendar div.legend span.legend-list:after,div.zabuto_calendar div.legend span.legend-spacer:after{content:' '}div.zabuto_calendar div.legend span.legend-spacer{padding-left:25px}div.zabuto_calendar ul.legend>span{padding-left:2px}div.zabuto_calendar ul.legend{display:inline-block;list-style:none outside none;margin:0;padding:0}div.zabuto_calendar ul.legend li{display:inline-block;height:11px;width:11px;margin-left:5px}div.zabuto_calendar ul.legend div.zabuto_calendar ul.legend li:first-child{margin-left:7px}div.zabuto_calendar ul.legend li:last-child{margin-right:5px}div.zabuto_calendar div.legend span.badge{font-size:.9em;border-radius:5px 5px 5px 5px;padding-left:5px;padding-right:5px;padding-top:2px;padding-bottom:3px}@media(max-width:979px){div.zabuto_calendar .table th,div.zabuto_calendar .table td{padding:2px 1px}}"+
        ".cal_wrap { position: absolute; top: 2em; z-index: 2000; display: none; background-color: white;padding: 1em;border: solid gray 3px;border-radius: 5px;} "+
        ".grade-1 {background-color: #FA2601;} .grade-2 {background-color: #FA8A00;} .grade-3 {background-color: #FFEB00;} .grade-4 {background-color: #27AB00;}  .grade-5 {background-color: #27AB00;} "+
    "</style>");
    // "<link rel='stylesheet' href='//netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap.min.css'>"+
    // "<script src='//netdna.bootstrapcdn.com/bootstrap/3.0.2/js/bootstrap.min.js'></script>");

    // Add coloring styles (ala Paintly, stolen from: https://userstyles.org/styles/125832/re-workflowy-re-painter)
    setInterval(function() {
        $('.content').css('background-color','');
        var colors = {
            'red':'#FFB5B5',
            'orange':'#FFD8B5',
            'yellow':'#FFFAB5',
            'lime':'#E1FFB5',
            'olive':'#B5FFC9',
            'green':'#CCFFB5',
            'teal':'#B5FFD7',
            'aquea':'#B5FFFC',
            'blu':'#B5E8FF',
            'navy':'#B9B5FF',
            'fuchia':'#F1B5FF',
            'purple':'#D3B5FF',
            'maroon':'#C08F8F',
            'silver':'silver',
            'gray':'gray',
            'black':'black',
            'white':'white'
        };
        for (var ii in colors) {
            var color = colors[ii];
            $('.content:contains("#'+ii+'")').css('background-color',color);
        }
        addImagePreviews();
    },500);
}

if(typeof jQuery=="undefined"){throw new Error("jQuery is not loaded")}$.fn.zabuto_calendar=function(options){var opts=$.extend({},$.fn.zabuto_calendar_defaults(),options);var languageSettings=$.fn.zabuto_calendar_language(opts.language);opts=$.extend({},opts,languageSettings);this.each(function(){var $calendarElement=$(this);$calendarElement.attr("id","zabuto_calendar_"+Math.floor(Math.random()*99999).toString(36));$calendarElement.data("initYear",opts.year);$calendarElement.data("initMonth",opts.month);$calendarElement.data("monthLabels",opts.month_labels);$calendarElement.data("weekStartsOn",opts.weekstartson);$calendarElement.data("navIcons",opts.nav_icon);$calendarElement.data("dowLabels",opts.dow_labels);$calendarElement.data("showToday",opts.today);$calendarElement.data("showDays",opts.show_days);$calendarElement.data("showPrevious",opts.show_previous);$calendarElement.data("showNext",opts.show_next);$calendarElement.data("cellBorder",opts.cell_border);$calendarElement.data("jsonData",opts.data);$calendarElement.data("ajaxSettings",opts.ajax);$calendarElement.data("legendList",opts.legend);$calendarElement.data("actionFunction",opts.action);$calendarElement.data("actionNavFunction",opts.action_nav);drawCalendar();function drawCalendar(){var dateInitYear=parseInt($calendarElement.data("initYear"));var dateInitMonth=parseInt($calendarElement.data("initMonth"))-1;var dateInitObj=new Date(dateInitYear,dateInitMonth,1,0,0,0,0);$calendarElement.data("initDate",dateInitObj);var tableClassHtml=$calendarElement.data("cellBorder")===true?" table-bordered":"";$tableObj=$('<table class="table'+tableClassHtml+'"></table>');$tableObj=drawTable($calendarElement,$tableObj,dateInitObj.getFullYear(),dateInitObj.getMonth());$legendObj=drawLegend($calendarElement);var $containerHtml=$('<div class="zabuto_calendar" id="'+$calendarElement.attr("id")+'"></div>');$containerHtml.append($tableObj);$containerHtml.append($legendObj);$calendarElement.append($containerHtml);var jsonData=$calendarElement.data("jsonData");if(false!==jsonData){checkEvents($calendarElement,dateInitObj.getFullYear(),dateInitObj.getMonth())}}function drawTable($calendarElement,$tableObj,year,month){var dateCurrObj=new Date(year,month,1,0,0,0,0);$calendarElement.data("currDate",dateCurrObj);$tableObj.empty();$tableObj=appendMonthHeader($calendarElement,$tableObj,year,month);$tableObj=appendDayOfWeekHeader($calendarElement,$tableObj);$tableObj=appendDaysOfMonth($calendarElement,$tableObj,year,month);checkEvents($calendarElement,year,month);return $tableObj}function drawLegend($calendarElement){var $legendObj=$('<div class="legend" id="'+$calendarElement.attr("id")+'_legend"></div>');var legend=$calendarElement.data("legendList");if(typeof legend=="object"&&legend.length>0){$(legend).each(function(index,item){if(typeof item=="object"){if("type"in item){var itemLabel="";if("label"in item){itemLabel=item.label}switch(item.type){case"text":if(itemLabel!==""){var itemBadge="";if("badge"in item){if(typeof item.classname==="undefined"){var badgeClassName="badge-event"}else{var badgeClassName=item.classname}itemBadge='<span class="badge '+badgeClassName+'">'+item.badge+"</span> "}$legendObj.append('<span class="legend-'+item.type+'">'+itemBadge+itemLabel+"</span>")}break;case"block":if(itemLabel!==""){itemLabel="<span>"+itemLabel+"</span>"}if(typeof item.classname==="undefined"){var listClassName="event"}else{var listClassName="event-styled "+item.classname}$legendObj.append('<span class="legend-'+item.type+'"><ul class="legend"><li class="'+listClassName+'"></li></u>'+itemLabel+"</span>");break;case"list":if("list"in item&&typeof item.list=="object"&&item.list.length>0){var $legendUl=$('<ul class="legend"></u>');$(item.list).each(function(listIndex,listClassName){$legendUl.append('<li class="'+listClassName+'"></li>')});$legendObj.append($legendUl)}break;case"spacer":$legendObj.append('<span class="legend-'+item.type+'"> </span>');break}}}})}return $legendObj}function appendMonthHeader($calendarElement,$tableObj,year,month){var navIcons=$calendarElement.data("navIcons");var $prevMonthNavIcon=$('<span><span class="glyphicon glyphicon-chevron-left"></span></span>');var $nextMonthNavIcon=$('<span><span class="glyphicon glyphicon-chevron-right"></span></span>');if(typeof navIcons==="object"){if("prev"in navIcons){$prevMonthNavIcon.html(navIcons.prev)}if("next"in navIcons){$nextMonthNavIcon.html(navIcons.next)}}var prevIsValid=$calendarElement.data("showPrevious");if(typeof prevIsValid==="number"||prevIsValid===false){prevIsValid=checkMonthLimit($calendarElement.data("showPrevious"),true)}var $prevMonthNav=$('<div class="calendar-month-navigation"></div>');$prevMonthNav.attr("id",$calendarElement.attr("id")+"_nav-prev");$prevMonthNav.data("navigation","prev");if(prevIsValid!==false){prevMonth=month-1;prevYear=year;if(prevMonth==-1){prevYear=prevYear-1;prevMonth=11}$prevMonthNav.data("to",{year:prevYear,month:prevMonth+1});$prevMonthNav.append($prevMonthNavIcon);if(typeof $calendarElement.data("actionNavFunction")==="function"){$prevMonthNav.click($calendarElement.data("actionNavFunction"))}$prevMonthNav.click(function(e){drawTable($calendarElement,$tableObj,prevYear,prevMonth)})}var nextIsValid=$calendarElement.data("showNext");if(typeof nextIsValid==="number"||nextIsValid===false){nextIsValid=checkMonthLimit($calendarElement.data("showNext"),false)}var $nextMonthNav=$('<div class="calendar-month-navigation"></div>');$nextMonthNav.attr("id",$calendarElement.attr("id")+"_nav-next");$nextMonthNav.data("navigation","next");if(nextIsValid!==false){nextMonth=month+1;nextYear=year;if(nextMonth==12){nextYear=nextYear+1;nextMonth=0}$nextMonthNav.data("to",{year:nextYear,month:nextMonth+1});$nextMonthNav.append($nextMonthNavIcon);if(typeof $calendarElement.data("actionNavFunction")==="function"){$nextMonthNav.click($calendarElement.data("actionNavFunction"))}$nextMonthNav.click(function(e){drawTable($calendarElement,$tableObj,nextYear,nextMonth)})}var monthLabels=$calendarElement.data("monthLabels");var $prevMonthCell=$("<th></th>").append($prevMonthNav);var $nextMonthCell=$("<th></th>").append($nextMonthNav);var $currMonthLabel=$("<span>"+monthLabels[month]+" "+year+"</span>");$currMonthLabel.dblclick(function(){var dateInitObj=$calendarElement.data("initDate");drawTable($calendarElement,$tableObj,dateInitObj.getFullYear(),dateInitObj.getMonth())});var $currMonthCell=$('<th colspan="5"></th>');$currMonthCell.append($currMonthLabel);var $monthHeaderRow=$('<tr class="calendar-month-header"></tr>');$monthHeaderRow.append($prevMonthCell,$currMonthCell,$nextMonthCell);$tableObj.append($monthHeaderRow);return $tableObj}function appendDayOfWeekHeader($calendarElement,$tableObj){if($calendarElement.data("showDays")===true){var weekStartsOn=$calendarElement.data("weekStartsOn");var dowLabels=$calendarElement.data("dowLabels");if(weekStartsOn===0){var dowFull=$.extend([],dowLabels);var sunArray=new Array(dowFull.pop());dowLabels=sunArray.concat(dowFull)}var $dowHeaderRow=$('<tr class="calendar-dow-header"></tr>');$(dowLabels).each(function(index,value){$dowHeaderRow.append("<th>"+value+"</th>")});$tableObj.append($dowHeaderRow)}return $tableObj}function appendDaysOfMonth($calendarElement,$tableObj,year,month){var ajaxSettings=$calendarElement.data("ajaxSettings");var weeksInMonth=calcWeeksInMonth(year,month);var lastDayinMonth=calcLastDayInMonth(year,month);var firstDow=calcDayOfWeek(year,month,1);var lastDow=calcDayOfWeek(year,month,lastDayinMonth);var currDayOfMonth=1;var weekStartsOn=$calendarElement.data("weekStartsOn");if(weekStartsOn===0){if(lastDow==6){weeksInMonth++}if(firstDow==6&&(lastDow==0||lastDow==1||lastDow==5)){weeksInMonth--}firstDow++;if(firstDow==7){firstDow=0}}for(var wk=0;wk<weeksInMonth;wk++){var $dowRow=$('<tr class="calendar-dow"></tr>');for(var dow=0;dow<7;dow++){if(dow<firstDow||currDayOfMonth>lastDayinMonth){$dowRow.append("<td></td>")}else{var dateId=$calendarElement.attr("id")+"_"+dateAsString(year,month,currDayOfMonth);var dayId=dateId+"_day";var $dayElement=$('<div id="'+dayId+'" class="day" >'+currDayOfMonth+"</div>");$dayElement.data("day",currDayOfMonth);if($calendarElement.data("showToday")===true){if(isToday(year,month,currDayOfMonth)){$dayElement.html('<span class="badge badge-today">'+currDayOfMonth+"</span>")}}var $dowElement=$('<td id="'+dateId+'"></td>');$dowElement.append($dayElement);$dowElement.data("date",dateAsString(year,month,currDayOfMonth));$dowElement.data("hasEvent",false);if(typeof $calendarElement.data("actionFunction")==="function"){$dowElement.addClass("dow-clickable");$dowElement.click(function(){$calendarElement.data("selectedDate",$(this).data("date"))});$dowElement.click($calendarElement.data("actionFunction"))}$dowRow.append($dowElement);currDayOfMonth++}if(dow==6){firstDow=0}}$tableObj.append($dowRow)}return $tableObj}function createModal(id,title,body,footer){var $modalHeaderButton=$('<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>');var $modalHeaderTitle=$('<h4 class="modal-title" id="'+id+'_modal_title">'+title+"</h4>");var $modalHeader=$('<div class="modal-header"></div>');$modalHeader.append($modalHeaderButton);$modalHeader.append($modalHeaderTitle);var $modalBody=$('<div class="modal-body" id="'+id+'_modal_body">'+body+"</div>");var $modalFooter=$('<div class="modal-footer" id="'+id+'_modal_footer"></div>');if(typeof footer!=="undefined"){var $modalFooterAddOn=$("<div>"+footer+"</div>");$modalFooter.append($modalFooterAddOn)}var $modalContent=$('<div class="modal-content"></div>');$modalContent.append($modalHeader);$modalContent.append($modalBody);$modalContent.append($modalFooter);var $modalDialog=$('<div class="modal-dialog"></div>');$modalDialog.append($modalContent);var $modalFade=$('<div class="modal fade" id="'+id+'_modal" tabindex="-1" role="dialog" aria-labelledby="'+id+'_modal_title" aria-hidden="true"></div>');$modalFade.append($modalDialog);$modalFade.data("dateId",id);$modalFade.attr("dateId",id);return $modalFade}function checkEvents($calendarElement,year,month){var jsonData=$calendarElement.data("jsonData");var ajaxSettings=$calendarElement.data("ajaxSettings");$calendarElement.data("events",false);if(false!==jsonData){return jsonEvents($calendarElement)}else if(false!==ajaxSettings){return ajaxEvents($calendarElement,year,month)}return true}function jsonEvents($calendarElement){var jsonData=$calendarElement.data("jsonData");$calendarElement.data("events",jsonData);drawEvents($calendarElement,"json");return true}function ajaxEvents($calendarElement,year,month){var ajaxSettings=$calendarElement.data("ajaxSettings");if(typeof ajaxSettings!="object"||typeof ajaxSettings.url=="undefined"){alert("Invalid calendar event settings");return false}var data={year:year,month:month+1};$.ajax({type:"GET",url:ajaxSettings.url,data:data,dataType:"json"}).done(function(response){var events=[];$.each(response,function(k,v){events.push(response[k])});$calendarElement.data("events",events);drawEvents($calendarElement,"ajax")});return true}function drawEvents($calendarElement,type){var jsonData=$calendarElement.data("jsonData");var ajaxSettings=$calendarElement.data("ajaxSettings");var events=$calendarElement.data("events");if(events!==false){$(events).each(function(index,value){var id=$calendarElement.attr("id")+"_"+value.date;var $dowElement=$("#"+id);var $dayElement=$("#"+id+"_day");$dowElement.data("hasEvent",true);if(typeof value.title!=="undefined"){$dowElement.attr("title",value.title)}if(typeof value.classname==="undefined"){$dowElement.addClass("event")}else{$dowElement.addClass("event-styled");$dayElement.addClass(value.classname)}if(typeof value.badge!=="undefined"&&value.badge!==false){var badgeClass=value.badge===true?"":" badge-"+value.badge;var dayLabel=$dayElement.data("day");$dayElement.html('<span class="badge badge-event'+badgeClass+'">'+dayLabel+"</span>")}if(typeof value.body!=="undefined"){var modalUse=false;if(type==="json"&&typeof value.modal!=="undefined"&&value.modal===true){modalUse=true}else if(type==="ajax"&&"modal"in ajaxSettings&&ajaxSettings.modal===true){modalUse=true}if(modalUse===true){$dowElement.addClass("event-clickable");var $modalElement=createModal(id,value.title,value.body,value.footer);$("body").append($modalElement);$("#"+id).click(function(){$("#"+id+"_modal").modal()})}}})}}function isToday(year,month,day){var todayObj=new Date;var dateObj=new Date(year,month,day);return dateObj.toDateString()==todayObj.toDateString()}function dateAsString(year,month,day){d=day<10?"0"+day:day;m=month+1;m=m<10?"0"+m:m;return year+"-"+m+"-"+d}function calcDayOfWeek(year,month,day){var dateObj=new Date(year,month,day,0,0,0,0);var dow=dateObj.getDay();if(dow==0){dow=6}else{dow--}return dow}function calcLastDayInMonth(year,month){var day=28;while(checkValidDate(year,month+1,day+1)){day++}return day}function calcWeeksInMonth(year,month){var daysInMonth=calcLastDayInMonth(year,month);var firstDow=calcDayOfWeek(year,month,1);var lastDow=calcDayOfWeek(year,month,daysInMonth);var days=daysInMonth;var correct=firstDow-lastDow;if(correct>0){days+=correct}return Math.ceil(days/7)}function checkValidDate(y,m,d){return m>0&&m<13&&y>0&&y<32768&&d>0&&d<=new Date(y,m,0).getDate()}function checkMonthLimit(count,invert){if(count===false){count=0}var d1=$calendarElement.data("currDate");var d2=$calendarElement.data("initDate");var months;months=(d2.getFullYear()-d1.getFullYear())*12;months-=d1.getMonth()+1;months+=d2.getMonth();if(invert===true){if(months<parseInt(count)-1){return true}}else{if(months>=0-parseInt(count)){return true}}return false}});return this};$.fn.zabuto_calendar_defaults=function(){var now=new Date;var year=now.getFullYear();var month=now.getMonth()+1;var settings={language:false,year:year,month:month,show_previous:true,show_next:true,cell_border:false,today:false,show_days:true,weekstartson:1,nav_icon:false,data:false,ajax:false,legend:false,action:false,action_nav:false};return settings};$.fn.zabuto_calendar_language=function(lang){if(typeof lang=="undefined"||lang===false){lang="en"}switch(lang.toLowerCase()){case"de":return{month_labels:["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],dow_labels:["Mo","Di","Mi","Do","Fr","Sa","So"]};break;case"en":return{month_labels:["January","February","March","April","May","June","July","August","September","October","November","December"],dow_labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]};break;case"ar":return{month_labels:["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"],dow_labels:["أثنين","ثلاثاء","اربعاء","خميس","جمعه","سبت","أحد"]};break;case"es":return{month_labels:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],dow_labels:["Lu","Ma","Mi","Ju","Vi","Sá","Do"]};break;case"fr":return{month_labels:["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],dow_labels:["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"]};break;case"it":return{month_labels:["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"],dow_labels:["Lun","Mar","Mer","Gio","Ven","Sab","Dom"]};break;case"nl":return{month_labels:["Januari","Februari","Maart","April","Mei","Juni","Juli","Augustus","September","Oktober","November","December"],dow_labels:["Ma","Di","Wo","Do","Vr","Za","Zo"]};break;case"pl":return{month_labels:["Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec","Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień"],dow_labels:["pon.","wt.","śr.","czw.","pt.","sob.","niedz."]};break;case"pt":return{month_labels:["Janeiro","Fevereiro","Marco","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],dow_labels:["S","T","Q","Q","S","S","D"]};break;case"ru":return{month_labels:["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],dow_labels:["Пн","Вт","Ср","Чт","Пт","Сб","Вск"]};break;case"se":return{month_labels:["Januari","Februari","Mars","April","Maj","Juni","Juli","Augusti","September","Oktober","November","December"],dow_labels:["Mån","Tis","Ons","Tor","Fre","Lör","Sön"]};break;case"tr":return{month_labels:["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"],dow_labels:["Pts","Salı","Çar","Per","Cuma","Cts","Paz"]};break}};

// load jQuery and execute the main function
addJQuery(main);
