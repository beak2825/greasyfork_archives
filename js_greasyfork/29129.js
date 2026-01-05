// ==UserScript==
// @name         Better CGS Schedule
// @version      2.17
// @description  Adds class links, removes annoying special schedule days, and makes your schedule into a checklist.
// @author       Liam Wang
// @include      http://inside.catlin.edu/scripts/sched/index.php?*
// @include      https://inside.catlin.edu/scripts/sched/index.php?*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require     http://code.jquery.com/color/jquery.color-2.1.2.min.js
// @require     https://cdn.jsdelivr.net/npm/bootstrap@3/dist/js/bootstrap.min.js
// @resource    bootstrapCSS https://github.com/maxweldsouza/font-awesome-controls/raw/master/bootstrap.min.css
// @resource    faCSS https://netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css
// @resource    controlsCSS https://raw.githubusercontent.com/maxweldsouza/font-awesome-controls/master/fac.css
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @namespace https://greasyfork.org/users/118299
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/29129/Better%20CGS%20Schedule.user.js
// @updateURL https://update.greasyfork.org/scripts/29129/Better%20CGS%20Schedule.meta.js
// ==/UserScript==

document.head.appendChild(cssElement(GM_getResourceURL ("bootstrapCSS")));
document.head.appendChild(cssElement("//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css"));
document.head.appendChild(cssElement(GM_getResourceURL ("controlsCSS")));

GM_addStyle(`
body {
overflow: hidden;
}
#schedarea {
margin-left: 1%;
margin-right: 1%;
}
#schedarea > .sched {
height: 95%;
}
.specialday {
padding: 0;
}
.specialday > .sched{
margin: 0;
height: 100% !important;
}
.specialday > .sched tr:first-child td {
border-top: 0;
}
.specialday > .sched tr td:first-child {
border-left: 0;
}
.specialday > .sched tr td:last-child {
border-right: 0;
}
table.controls {
margin: 5px;
}
TD.daylabel,
TD.mainlabel {
border-style: solid;
border-width: 2px;
border-color: #000000;
}
TD.controls.arrows a img {
content: url("https://i.imgur.com/FBeFEE6.png") !important;
}
TD.controls.arrows:last-child a img {
-moz-transform: scaleX(-1);
-o-transform: scaleX(-1);
-webkit-transform: scaleX(-1);
transform: scaleX(-1);
filter: FlipH;
-ms-filter: "FlipH";
}
TD.controls.links a {
color: black
}
.fac{
display: block;
}
ul.nav {
margin-bottom: 20px;
`);

function cssElement(url) {
    var link = document.createElement("link");
    link.href = url;
    link.rel="stylesheet";
    link.type="text/css";
    return link;
}

$('head').append(`
<script>
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}
var room = 1;
function education_fields() {
    room++;
    var objTo = document.getElementById('education_fields');
    var divtest = document.createElement("div");
	divtest.setAttribute("class", "form-group removeclass"+room);
	var rdiv = 'removeclass'+room;
    divtest.innerHTML = '<div class="col-sm-3 nopadding" style="width: 30%"> <div class="form-group"> <select class="form-control" id="block"> <option value="0">Block 1</option> <option value="1">Block 2</option> <option value="2">Block 3</option> <option value="3">Block 4</option> <option value="4">Block 5</option> <option value="7">Block 6</option> <option value="8">Block 7</option> <option value="9">Robotics</option> </select> </div></div><div class="col-sm-3 nopadding" style="width: 70%"> <div class="form-group"> <div class="input-group"> <input type="text" class="form-control" id="classlink" value="" placeholder="Class Link"> <div class="input-group-btn"> <button class="btn btn-danger" type="button" onclick="remove_education_fields('+room+');"> <span class="glyphicon glyphicon-minus" aria-hidden="true"></span> </button></div></div></div></div>';
    objTo.appendChild(divtest);
}
function remove_education_fields(rid) {
    document.getElementsByClassName('removeclass'+rid).remove();

}
</script>
`);

$(function(){
    'use strict';

    addSettingsButton(pageHash);
    // Add your classes here! No need to remove the old ones, just add more in the blank spaces.
    var courseList =
        [['Acc Science II', 'https://catlin.haikulearning.com/nakayamab/acceleratedscienceibiologyphysicsche2/cms_page/view'],
         ['Chinese II', 'https://catlin.haikulearning.com/hub/chineseii2/calendar'],
         ['Advanced Algebra II', "https://catlin.haikulearning.com/sloank/algebraii1/cms_page/view/30473220"],
         ['English 9', "https://docs.google.com/document/d/1i9e4bweemW3G9iEfcFcGR49SI3crwSUYs7VwKJRe_eE/edit"],
         ['Human Crossroads', "https://catlin.haikulearning.com/masonc/humancrossroads/cms_page/view/30077224"],
         ['Comp Sci II', "https://catlin.haikulearning.com/merrilla/honorscomputerscienceiidatastructure/cms_page/view/30019866"],
         ['Spanish III', "https://catlin.haikulearning.com/villar/spanishiiicommunicationb1/cms_page/view"],
         ['ClassNameGoesHere', "ClassLinkGoesHere"],
         ['ClassNameGoesHere', "ClassLinkGoesHere"],
         ['ClassNameGoesHere', "ClassLinkGoesHere"],
         ['ClassNameGoesHere', "ClassLinkGoesHere"],
         ['ClassNameGoesHere', "ClassLinkGoesHere"],
         ['ClassNameGoesHere', "ClassLinkGoesHere"],
         ['ClassNameGoesHere', "ClassLinkGoesHere"],
         ['ClassNameGoesHere', "ClassLinkGoesHere"]];



    // Remove swipe to page for mobile devices
    removeMobileSwipePaging();

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



    loadModal();


    // Checklist functionality
    makeCheckboxes(pageHash);

    // Parse the time labels and assign each class a time range
    parseAssignTimes();

    // Add the time divider to the appropreate cell
    if (addHrToTableColumn(getCurrentDayColumn())) {
        setInterval(function(){
            $('.timeHr').each(function() {
                $(this).remove();
            });
            addHrToTableColumn(getCurrentDayColumn());

        }, 60000);
    }

});

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

function loadModal() {
    'use strict';
    var modalHtml = `
<!-- Modal -->
<div class="modal fade in" id="myModal" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                <ul class="nav nav-tabs">
                    <li class="active"><a data-toggle="tab" href="#menu0" aria-expanded="true">General Settings</a></li>
                    <li class=""><a data-toggle="tab" href="#menu1" aria-expanded="false">Schedule Styling</a></li>
                    <li class=""><a data-toggle="tab" href="#menu2" aria-expanded="false">Class Links</a></li>
                    <li class=""><a data-toggle="tab" href="#menu3" aria-expanded="false">Checklist Styling</a></li>
                </ul>
                <div class="tab-content">
                    <div id="menu0" class="tab-pane fade active in">
                        <div class="panel panel-default">
                            <div class="panel-heading">General Feature Settings</div>
                            <div class="panel-body">
                                <div>
                                    <div class="fac fac-checkbox fac-primary "><span></span>
                                        <input id="special" type="checkbox" value="1" checked><label for="special">Special
                                            Days Fix</label>
                                    </div>
                                </div>
                                <div>
                                    <div class="fac fac-checkbox fac-primary "><span></span>
                                        <input id="time" type="checkbox" value="1" checked><label for="time">Current
                                            Time Bar</label>
                                    </div>
                                </div>
                                <div>
                                    <div class="fac fac-checkbox fac-primary "><span></span>
                                        <input id="checklist" type="checkbox" value="1" checked><label for="checklist">Homework
                                            Checklist</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="menu1" class="tab-pane fade">
                        <div class="panel panel-default">
                            <div class="panel-heading">Schedule Style Settings</div>
                            <div class="panel-body">
                                <div style="width:100%" class="col-sm-3">
                                    <div class="form-group">
                                        <label for="schedule-font" style="
                                 display: inline-block;
                                 ">Main Font: &nbsp;</label>
                                        <select class="form-control" id="schedule-font"
                                                style="width:  30%;display:  inline;">
                                            <option value="0">Georgia</option>
                                            <option value="1">Palatino Linotype</option>
                                            <option value="2">Times New Roman</option>
                                            <option value="3">Arial</option>
                                            <option value="4">Arial Black</option>
                                            <option value="5">Comic Sans MS</option>
                                            <option value="6">Impact</option>
                                            <option value="7">Lucida Sans Unicode</option>
                                            <option value="8">Tahoma</option>
                                            <option value="9">Trebuchet MS</option>
                                            <option value="10">Verdana</option>
                                            <option value="11">Courier New</option>
                                            <option value="12">Lucida Console</option>
                                        </select>
                                    </div>
                                </div>
                                <div style="width:100%" class="col-sm-3">
                                    <div class="form-group">
                                        <label for="schedule-font" style="display: inline-block;">Border Style:
                                            &nbsp;</label>
                                        <select class="form-control" id="border-style"
                                                style="width:  30%;display:  inline;">
                                            <option value="0">hidden</option>
                                            <option value="1">dotted</option>
                                            <option value="2">dashed</option>
                                            <option value="3">solid</option>
                                            <option value="4">groove</option>
                                            <option value="5">ridge</option>
                                            <option value="6">inset</option>
                                            <option value="7">outset</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="menu2" class="tab-pane fade">
                        <div class="panel panel-default">
                            <div class="panel-heading">Add Links to Class Pages</div>
                            <div class="panel-body">
                                <div id="education_fields"></div>
                                <div id="education_fields"><div class="form-group">
                                <div class="col-sm-3 nopadding" style="width: 30%">
                                    <div class="form-group">
                                        <select class="form-control" id="block">
                                            <option value="0">Block 1</option>
                                            <option value="1">Block 2</option>
                                            <option value="2">Block 3</option>
                                            <option value="3">Block 4</option>
                                            <option value="4">Block 5</option>
                                            <option value="7">Block 6</option>
                                            <option value="8">Block 7</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="col-sm-3 nopadding" style="width: 70%">
                                    <div class="form-group">
                                        <div class="input-group">
                                            <input type="text" class="form-control" id="classlink" value=""
                                                   placeholder="Class Link">
                                            <div class="input-group-btn">
                                                <button class="btn btn-success" type="button"
                                                        onclick="education_fields();"><span
                                                        class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div></div></div>
                            </div>
                        </div>
                    </div>
                    <div id="menu3" class="tab-pane fade">
                        <div class="panel panel-default">
                            <div class="panel-heading">Homework Checklist Style Settings</div>
                            <div class="panel-body">
                                <div style="width:100%" class="col-sm-3">
                                    <div class="form-group">
                                        <label for="schedule-font" style="display: inline-block;">Text Formatting:
                                            &nbsp;</label>
                                        <select class="form-control" id="checklist-text"
                                                style="width:  30%;display:  inline;">
                                            <option value="0">strikethrough</option>
                                            <option value="1">underline</option>
                                            <option value="2">italics</option>
                                            <option value="3">bold</option>
                                            <option value="4">hidden</option>
                                        </select>
                                    </div>
                                </div>
                                <div style="width:100%" class="col-sm-3">
                                    <div class="form-group">
                                        <label for="schedule-font" style="display: inline-block;">Class Background:
                                            &nbsp;</label>
                                        <select class="form-control" id="checklist-background"
                                                style="width:  30%;display:  inline;">
                                            <option value="0">dark</option>
                                            <option value="1">light</option>
                                            <option value="2">none</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
<a href="mailto:wangl@catlin.edu?Subject=Better%20Schedule%20Feature%20Suggestion" target="_top" style="
    float:  left;
    padding-top: 10px;
">Have a feature suggestion?</a>
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary">Save Changes</button>
            </div>
        </div>
    </div>
</div>
`;

    //--- Add nodes to page
    $("body").prepend(modalHtml);
    $("#saveSettingsButton").click(function() {
        saveSettings();
        $('#exampleSelect1 > option:last').attr('selected');
    });
}

function saveSettings() {
    console.log($('form.settings').serializeArray());
    alert("Settings Saved!");
}

function specialDaysFix () {
    $('.specialday a').each(function () {
        var specialDayHTML = ($.ajax({type: "GET", url: 'http://inside.catlin.edu'+$(this).attr('href'), async: false}).responseText);
        $(this).append(specialDayHTML);
        $(this).replaceWith($(this).find('#schedarea').html());
    });
    $('.specialday').each(function () {
        $(this).children('table:first').children('tbody:first').children('tr:first').remove();
        $(this).children('table:first').attr('id', 'special');
    });
}

function swapLinks(courseList) {
    $('.period:not(.daylabel):not(.mainlabel):not(times)').each(function () {
        var courseName = $(this).children('.coursename').text();
        for (var ii=0; ii<courseList.length; ii++) {
            if (courseName == courseList[ii][0]) {
                //$(this).replaceWith('<a class="coursename" target="_blank" href="'+courseList[ii][1]+'">'+courseName+'</a>');
                $(this).dblclick(function() {
                    window.open(courseList[ii][1]);
                });
                break;
            }
        }
    }).mousedown(function(event) {
        if (event.which == 3) {
            alert($(this).children('.coursename').text());
        }
    });
}

function addSettingsButton(pageHash) {
    $('<td class="controls links"><a id="settingsButton" data-toggle="modal" data-target="#myModal" href="">Settings</a></td>').insertAfter('.controls.links:eq(2)');
    $('.controls.links').each(function () {
        $(this).css('width', '21%');
        $(this).css('text-decoration', 'underline');
    });
}

function restoreChecklistData(pageHash) {
    $('.period')
        .each(function () {$(this).attr('data-is-checked', 'false');});
    $('.period').each(function (counter) {
        $(this).attr('data-index', counter);
        if (readCookie(pageHash.toString()+counter.toString())=='true') {
            $(this).css('background-color', shadeColor($(this).attr('bgcolor'), -0.5));
            $(this).css('text-decoration', 'line-through');
            $(this).attr('data-is-checked', 'true');
        }
    });
}

function makeCheckboxes(pageHash) {
    $('.period:not(.daylabel):not(.mainlabel):not(times)')
        .click(function () {
        if($(this).attr('data-is-checked')=='false'){
            checkClass($(this), pageHash);
        } else {
            uncheckClass($(this), pageHash);
        }
    }).hover(function () {
        if($(this).attr('data-is-checked')=='false'){
            $(this).animate({
                backgroundColor: shadeColor($(this).attr('bgcolor'), -0.1),
            }, 50);
        }
    }, function () {
        if($(this).attr('data-is-checked')=='false'){
            $(this).animate({
                backgroundColor: $(this).attr('bgcolor'),
            }, 50);
        }
    });
}

function checkClass(classObj, pageHash) {
    classObj.animate({
        backgroundColor: shadeColor(classObj.attr('bgcolor'), -0.5),
    }, 100);
    classObj.css('text-decoration', 'line-through');
    classObj.attr('data-is-checked', 'true');
    createCookie(pageHash.toString()+classObj.attr('data-index').toString(), 'true');
}

function uncheckClass(classObj, pageHash) {
    classObj.animate({
        backgroundColor: shadeColor(classObj.attr('bgcolor'), -0.1),
    }, 100);
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

function getCurrentMinutes() {
    return (new Date().getHours() * 60) + new Date().getMinutes() + (new Date().getSeconds() / 60);
}

function addHrToTableColumn(currentDay) {
    if (currentDay==-1) {
        return;
    }
    var currentTime = getCurrentMinutes();

    var didModify = false;
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

                    if (startTime<=currentTime&&currentTime<endTime) {
                        didModify = true;
                        addHr($(this), currentTime, startTime, endTime);
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
    return didModify;
}

function getCurrentDayColumn() {
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
    classObj.append('<hr class="timeHr" style="position:absolute !important; width:90%; border : 0;height: 2px; background-image: linear-gradient(to right, rgba(0, 0, 0, 0), '+contrastColor+', rgba(0, 0, 0, 0));  margin:0px; left:5%; right:5%;  top:'+adjustedPercentage+'%;" >');
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


