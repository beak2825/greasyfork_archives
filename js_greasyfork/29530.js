// ==UserScript==
// @name         (Mobile Version) Better CGS Schedule 
// @version      2.5
// @description  Adds class links, removes annoying special schedule days, and makes your schedule into a checklist.
// @author       Liam Wang
// @include      http://inside.catlin.edu/scripts/sched/index.php?*
// @include      https://inside.catlin.edu/scripts/sched/index.php?*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// @grant GM_addStyle
// @namespace https://greasyfork.org/users/118299
// @downloadURL https://update.greasyfork.org/scripts/29530/%28Mobile%20Version%29%20Better%20CGS%20Schedule.user.js
// @updateURL https://update.greasyfork.org/scripts/29530/%28Mobile%20Version%29%20Better%20CGS%20Schedule.meta.js
// ==/UserScript==



(function() {
    'use strict';
    GM_addStyle('.specialday{ padding: 0;} #special{ margin: 0; height: 100% !important;} #special tr:first-child td { border-top: 0; } #special tr td:first-child { border-left: 0; } #special tr td:last-child { border-right: 0; } TD.daylabel, TD.mainlabel { border-style: solid; border-width: 2px; border-color: #000000; } HR.controls { display: none; } TD.controls.arrows a img { content: url("https://i.imgur.com/FBeFEE6.png") !important; } TD.controls.arrows:last-child a img { -moz-transform: scaleX(-1); -o-transform: scaleX(-1); -webkit-transform: scaleX(-1); transform: scaleX(-1); filter: FlipH; -ms-filter: "FlipH"; } TD.controls.links a { color: black } ');

    // Add your classes here! No need to remove the old ones, just add more in the blank spaces.
    var courseList =
        [['Acc Science I', 'https://catlin.haikulearning.com/nakayamab/acceleratedscienceibiologyphysicsche2/cms_page/view'],
         ['Chinese II', 'https://catlin.haikulearning.com/hub/chineseii2/calendar'],
         ['Advanced Algebra II', "https://catlin.haikulearning.com/sloank/algebraii1/cms_page/view/30473220"],
         ['English 9', "https://docs.google.com/document/d/1i9e4bweemW3G9iEfcFcGR49SI3crwSUYs7VwKJRe_eE/edit"],
         ['Human Crossroads', "https://catlin.haikulearning.com/masonc/humancrossroads/cms_page/view/30077224"],
         ['Comp Sci II', "https://catlin.haikulearning.com/merrilla/honorscomputerscienceiidatastructure/cms_page/view/30019866"],
         ['Spanish III', "https://catlin.haikulearning.com/villar/spanishiiicommunicationb1/cms_page/view"],
         ['<ClassNameGoesHere>', "<ClassLinkGoesHere>"],
         ['<ClassNameGoesHere>', "<ClassLinkGoesHere>"],
         ['<ClassNameGoesHere>', "<ClassLinkGoesHere>"],
         ['<ClassNameGoesHere>', "<ClassLinkGoesHere>"],
         ['<ClassNameGoesHere>', "<ClassLinkGoesHere>"],
         ['<ClassNameGoesHere>', "<ClassLinkGoesHere>"],
         ['<ClassNameGoesHere>', "<ClassLinkGoesHere>"],
         ['<ClassNameGoesHere>', "<ClassLinkGoesHere>"]];



    // Remove swipe to page for mobile devices
    //removeMobileSwipePaging();

    // Generate hashcode for this page
    var daylabels;
    $('.daylabel').each(function () {
        daylabels+=$(this).text();
    });
    var pageHash = hashCode(daylabels);
    // Replace the link with the proper HTML for special schedule days
    specialDaysFix();

    // Replace course names with links
    swapLinks(courseList);

    // Reset and restore checklist data
    restoreChecklistData(pageHash);

    // Add reset button
    addResetChecklistButton(pageHash);


    // Checklist functionality
    makeCheckboxes(pageHash);

    // Parse the time labels and assign each class a time range
    parseAssignTimes();

    // Add the time divider to the appropreate cell
    addHrToTableColumn(getCurrentDayIndex());
    setInterval(function(){
        $('.timeHr').each(function() {
            $(this).remove();
        });
        addHrToTableColumn(getCurrentDayIndex());
    }, 60000);
})(jQuery);

function removeMobileSwipePaging() {
    $('#schedarea').removeAttr('ontouchstart');
    $('#schedarea').removeAttr('ontouchend');
    $('#schedarea').removeAttr('ontouchmove');
    $('#schedarea').removeAttr('ontouchcancel');
    $('.controls.arrows').each(function () {
        var link;
        link = $(this).children().attr('href');
        $(this).children().click(function () {
            window.location.href = link;
        });
        $(this).children().removeAttr('href');
    });
}
function specialDaysFix () {
    $('.specialday a').each(function () {
        $(this).css('text-decoration', 'line-through');
        var specialDayHTML = ($.ajax({type: "GET", url: 'https://inside.catlin.edu'+$(this).attr('href'), async: false}).responseText);
        $(this).append(specialDayHTML);
        $(this).replaceWith($(this).find('#schedarea').html());

    });
    $('.specialday').each(function () {
        $(this).children('table:first').children('tbody:first').children('tr:first').remove();
        $(this).children('table:first').attr('id', 'special');
    });

    $('#special').each(function () {
        $(this).css('height', '100%');
    });
}

function swapLinks(courseList) {
    var courseName;
    $('.coursename').each(function () {
        courseName = $(this).text();
        for (var ii=0; ii<courseList.length; ii++) {
            if (courseName == courseList[ii][0]) {
                $(this).replaceWith('<a class="coursename" target="_blank" href="'+courseList[ii][1]+'">'+courseName+'</a>');
                break;
            }
        }
    });
}

function addResetChecklistButton(pageHash) {
    $('<td class="controls links"><a>Clear Checklist</a></td>').insertAfter('.controls.links:eq(2)');
    $('.links').each(function () {
        $(this).css('width', '21%');
        $(this).css('text-decoration', 'underline');
    });
    $('.controls.links:eq(3)').click(function () {
        $('.period').each(function () {
            if ($(this).attr('data-is-checked')=='true') {
                eraseCookie(pageHash.toString()+$(this).attr('data-index'));
            }
        });
        location.reload();
    });
}

function restoreChecklistData(pageHash) {
    $('.period')
        .each(function () {$(this).attr('data-is-checked', 'false');});
    var counter = 0;
    $('.period').each(function () {
        $(this).attr('data-index', counter);
        if (readCookie(pageHash.toString()+counter.toString())=='true') {
            $(this).css('background-color', shadeColor($(this).attr('bgcolor'), -0.5));
            $(this).css('text-decoration', 'line-through');
            $(this).attr('data-is-checked', 'true');
        }
        counter++;
    });
    $('.coursename')
        .css('color', 'black')
        .click(function(e) {e.stopPropagation();});
}

function makeCheckboxes(pageHash) {
    $('.period')
        .click(function () {
        if ($(this).attr('bgcolor') != '#FFFFFF' && $(this).attr('bgcolor') != '#C0C0C0') {
            if($(this).attr('data-is-checked')=='false'){
                checkClass($(this), pageHash);
            } else {
                uncheckClass($(this), pageHash);
            }
        }
    }).hover(function () {
        if ($(this).attr('bgcolor') != '#FFFFFF' && $(this).attr('bgcolor') != '#C0C0C0') {
            if($(this).attr('data-is-checked')=='false'){
                $(this).css('background-color', shadeColor($(this).attr('bgcolor'), -0.1));
            }
        }
    }, function () {
        if ($(this).attr('bgcolor') != '#FFFFFF' && $(this).attr('bgcolor') != '#C0C0C0') {
            if($(this).attr('data-is-checked')=='false'){
                $(this).css('background-color', $(this).attr('bgcolor'), -0.1);
            }
        }
    });
}

function checkClass(classObj, pageHash) {
    classObj.css('background-color', shadeColor(classObj.attr('bgcolor'), -0.5));
    classObj.css('text-decoration', 'line-through');
    classObj.attr('data-is-checked', 'true');
    createCookie(pageHash.toString()+classObj.attr('data-index').toString(), 'true');
}

function uncheckClass(classObj, pageHash) {
    classObj.css('background-color', shadeColor(classObj.attr('bgcolor'), -0.1));
    classObj.css('text-decoration', 'none');
    classObj.attr('data-is-checked', 'false');
    eraseCookie(pageHash.toString()+classObj.attr('data-index').toString());
}

function parseAssignTimes() {
    var timeLabelsArray = new Array(0);
    $('.sched:not(#special) > tbody > tr > .times:first').each(function () {
        var timeText = $(this).text();
        var startTime = timeText.substring(0, timeText.indexOf("-"));
        var startHours = parseInt(startTime.substring(0, startTime.indexOf(":")), 10);
        var convertedStartTime = ((startHours<7) ? startHours+12 : startHours)*60+parseInt(startTime.substring(startTime.indexOf(":")+1), 10);
        timeLabelsArray[timeLabelsArray.length] = convertedStartTime;
    });
    $('.sched:not(#special) > tbody > tr > .times').each(function () {
        var timeText = $(this).text();
        var endTime = timeText.substring(timeText.indexOf("-")+1);
        var endHours = parseInt(endTime.substring(0, endTime.indexOf(":")), 10);
        var convertedEndTime = (((endHours<7)? endHours+12 : endHours)*60)+parseInt(endTime.substring(endTime.indexOf(":")+1), 10);
        timeLabelsArray[timeLabelsArray.length] = convertedEndTime;
    });
    $(".sched:not(#special) > tbody > tr").each(function(rowIndex) {
        $(this).children().each(function(tdIndex) {
            $(this).attr('data-start-time', timeLabelsArray[(rowIndex-1)]);
            $(this).attr('data-end-time', timeLabelsArray[rowIndex+($(this).attr('rowspan')-1)]);
        });
    });
}

function addHrToTableColumn(currentDay) {
    if (currentDay==-1) {
        return;
    }

    var hour = new Date().getHours();
    var time = hour * 60 + new Date().getMinutes() + new Date().getSeconds()/60;
    var colToGet = currentDay;

    var offsets = [];
    var skips = [];

    function incrementOffset(index) {
        if (offsets[index]) {
            offsets[index]++;
        } else {
            offsets[index] = 1;
        }
    }

    function getOffset(index) {
        return offsets[index] || 0;
    }
    $(".sched:not(#special) > tbody > tr").each(function(rowIndex) {
        var thisOffset = getOffset(rowIndex);

        $(this).children().each(function(tdIndex) {
            var rowspan = $(this).attr("rowspan");

            if (tdIndex + thisOffset >= colToGet) {
                if(skips[rowIndex]) return false;
                if (!$(this).hasClass('specialday')){
                    var startTime = $(this).attr('data-start-time');
                    var endTime = $(this).attr('data-end-time');

                    if (startTime<=time&&time<endTime) {
                        addHr($(this), time, startTime, endTime);
                    }
                }

                if (rowspan > 1) {
                    for (var i = 1; i < rowspan; i++) {
                        skips[rowIndex + i] = true;
                    }
                }
                return false;
            }
            if (rowspan > 1) {
                for (var ii = 1; ii < rowspan; ii++) {
                    incrementOffset(rowIndex + ii);
                }
            }
        });
    });
}

function getCurrentDayIndex() {
    var month = new Date().getMonth();
    var date = new Date().getDate();
    var foundIndex = -2;
    $(".sched > tbody > tr:first > .daylabel").each(function (dayLabelIndex) {
        if ($(this).text().substring(4, ($(this).text().indexOf(")")==-1)?$(this).text().length:$(this).text().indexOf(")")-3) == getMonthAbbr(month)+" "+date) {
            foundIndex = dayLabelIndex;
        }
    });
    return foundIndex+1;
}

function addHr(classObj, time, startTime, endTime) {
    //classObj.css('background-color', shadeColor(classObj.attr('bgcolor'), -0.3));
    var contrastColor = (getContrastYIQ(colorToHex(classObj.css('background-color'))));
    var adjustedPercentage = ((time-startTime)/(endTime-startTime)*100);
    classObj.css('position', 'relative');
    classObj.append('<hr class="timeHr" style="position:absolute !important; width:90%; border : 0;height: 15px; background-image: linear-gradient(to right, rgba(0, 0, 0, 0), '+contrastColor+', rgba(0, 0, 0, 0));  margin:0px; left:5%; right:5%;  top:'+adjustedPercentage+'%;" >');
}

function colorToHex(rgb){
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return ((rgb && rgb.length === 4) ? "#" +
            ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '').toUpperCase();
}

function shadeColor(color, percent) {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return ("#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1)).toUpperCase();
}

function hashCode(s) {
    var h = 0, l = s.length, i = 0;
    if ( l > 0 )
        while (i < l)
            h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return h;
}

function createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}
function getContrastYIQ(hexcolor){
    var r = parseInt(hexcolor.substr(1,2),16);
    var g = parseInt(hexcolor.substr(3,2),16);
    var b = parseInt(hexcolor.substr(5,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 150) ? 'black' : 'white';
}

function getMonthAbbr(monthNum) {
    switch (monthNum) {
        case 0:
            return 'Jan';
        case 1:
            return 'Feb';
        case 2:
            return 'Mar';
        case 3:
            return 'Apr';
        case 4:
            return 'May';
        case 5:
            return 'Jun';
        case 6:
            return 'Jul';
        case 7:
            return 'Aug';
        case 8:
            return 'Sep';
        case 9:
            return 'Oct';
        case 10:
            return 'Nov';
        case 11:
            return 'Dec';
    }
}


