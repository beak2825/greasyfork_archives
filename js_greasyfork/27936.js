// ==UserScript==
// @name             Waze Editor Profile Enhancements
// @namespace        http://tampermonkey.net/
// @version          2024.01.04.01
// @description      Pulls the correct forum post count - changed to red to signify the value as pulled from the forum by the script & more!
// @icon             data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAUCAYAAACXtf2DAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMjHxIGmVAAADQklEQVRIS92VS0wTQRjHq+IrvmKiB8VEbxK9aIweNMZEEi/Gkxq6u4UCKjEEiQajMRobE7DdbrvS8DCF3Z3ty8oqiGAw4KMKxKpBxUcEORTF+EZFRQjPz5llbVqo0nj0n/wzO535ft/szDdbXbwyAUylrWgNxUk5NCsdpTm0h7LLGw446mZqUyYXAEwxmUwJWleVgXPPoTnZTrHoG2WRvutZsRc/DzJWuZ/h0A+c7Attk7MURZmmhcTWbjzBYJE2ptnlRO0nnRGhWZRV7KdYqQ8b/mgr+omTfsxwKIu10IliWGElZS7fkckK80gyhpU249XhwBjAGNaz0ihpIxcYFtkaxipso1hxS5bFuYCyoSQ8+UckIG5bURfj8MzX0GOizaULDZy0dZ/DtUXPCksZKzqO93ooJmAS06w4jAshW0OPibGULUvLlxNzCtHNPLGqAVcLPsjYgHisZ9Frk6LM0PA6XUaBuJiy+RaRM8gu9ifjrVL389+NRkibyVbPUxNkFytzqQJnEklAm+V1EwPI4bkgnXerbaxxYjKWccYDeAfUBZISVxPg2p/KFJRtZk5L62nOuxzX+/D4YOKq4BPwNz4E4VoQztY1gaP2FhTV3obSq00gNATVsZr7zwCf4eAhRZmtwolIFenNwtosp3M6qeUosBWpbTUO7OzuCftMTQBaQm/C/aevPwBXeR2a20KQWejt1NAThV9vUyrnGiTQdN4FB8svwoMI0G9X3n0Cz998Cvc73n+GiuZWQDfuDRh5t0/DRWt/sT+VgK897hhpf9sdBYzHra/egpF39abx8moNGa1UTu464antf/EuGh6KeB7v0Kevatvc9lLdSgzfpeEmyhQIJODXK9nr8H0vrw8O+W4/gL0OL16VG843PYoCN7Z3QnbJeVwpMhxz1YwY7a6fBhtiNNTfZbBJG402TxFe0fApfx3w1QFcetKoyXulJ0+41JdfUf8Nl+PQYbEKyuvvqCtneLRdC49f+GPXkuu8AEekSwTSg/sp+H8gFyejKYvYmFV0Dk56r5CxAYb3LNHCJhe5IAwnrqLMwk69RbxOYCk2KYVcSFLSRjNawbAoGd+Xyxge1FtQLvncaOH/lXS6Xw40MXnm6lDsAAAAAElFTkSuQmCC
// @author           JustinS83
// @include          https://www.waze.com/*user/editor*
// @include          https://beta.waze.com/*user/editor*
// @contributionURL  https://github.com/WazeDev/Thank-The-Authors
// @run-at           document-start
// @downloadURL https://update.greasyfork.org/scripts/27936/Waze%20Editor%20Profile%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/27936/Waze%20Editor%20Profile%20Enhancements.meta.js
// ==/UserScript==

/* global W */
/* global OL */
/* global $ */
/* global I18n */
/* global _ */
/* global WazeWrap */
/* global require */
/* eslint curly: ["warn", "multi-or-nest"] */

(function() {
    'use strict';
    var gon = {"data":""};
    var settings = {};
    var nawkts, rowwkts, ilwkts = [];
    var combinedNAWKT, combinedROWWKT, combinedILWKT= "";
    var naMA, rowMA, ilMA;
    var lastEditEnv;
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const delay = ms => new Promise(res => setTimeout(res, ms));

    loadSettings();

    function getApiUrlUserProfile(username, env) {
        let apiEnv = '';
        if (env != 'na')
            apiEnv = env + '-';
        return `https://${window.location.host}/${apiEnv}Descartes/app/UserProfile/Profile?username=${username}`;
    }

    async function bootstrap(tries = 1) {
        console.log('WEPE: ' + tries);
        if (typeof W !== 'undefined' && typeof W.EditorProfile !== 'undefined' && typeof W.EditorProfile.data !== 'undefined' && $){
            await delay(2000);
            init();
        }

        else if (tries < 1000)
            setTimeout(function () {bootstrap(++tries);}, 200);
    }

    bootstrap();

    async function init(){
        lastEditEnv = W.EditorProfile.data.lastEditEnv;
        if (typeof settings.Environment != 'undefined'
            && settings.Environment != 'default'
            && settings.Environment != gon.data.lastEditEnv) {
            let apiUrl = getApiUrlUserProfile(gon.data.username, settings.Environment);

            // synchronous XMLHttpRequest required as we need to pause execution to replace window.gon object
            // The deprication warning in console is expected.
            var request = new XMLHttpRequest();
            request.open('GET', apiUrl, false); // 'false' makes the request synchronous
            request.send(null);

            if (request.status === 200)
                gon.data = JSON.parse(request.responseText);
            gon.data.lastEditEnv = settings.Environment;
        }

        $('body').append('<span id="ruler" style="visibility:hidden; white-space:nowrap;"></span>');
        //injectCSS();
        String.prototype.visualLength = function(){ //measures the visual length of a string so we can better center the area labels on the areas
            var ruler = $("#ruler");
            ruler[0].innerHTML = this;
            return ruler[0].offsetWidth;
        }
        $.get('https://www.waze.com/forum/memberlist.php?username=' + W.EditorProfile.data.username, function(forumResult){
            var re = 0;
            var matches = forumResult.match(/<a href=".*?"\s*?title="Search user’s posts">(\d+)<\/a>/);
            if(matches && matches.length > 0)
                re = matches[1];
            var WazeVal = $('.posts').parent().next()[0].innerHTML.trim();
            var userForumID = forumResult.match(/<a href="\.\/memberlist\.php\?mode=viewprofile&amp;u=(\d+)"/);
            if(userForumID != null){
                userForumID = userForumID[1];
                $('.posts').parent().css('position', 'relative');

                if(WazeVal !== re.toString()){
                    $('.posts').parent().next()[0].innerHTML = re;
                    $('.posts').parent().next().css('color','red');
                    $('.posts').parent().next().prop('title', 'Waze reported value: ' + WazeVal);
                }

                $('.posts').parent().parent().wrap('<a href="https://www.waze.com/forum/search.php?author_id=' + userForumID + '&sr=posts" target="_blank"></a>');

                $('#header > div > div.user-info > div > div.user-highlights').prepend('<a href="https://www.waze.com/forum/memberlist.php?mode=viewprofile&u=' + userForumID +'" target="_blank" style="margin-right:5px;" id="forumProfile" style="float: right;"><button class="s-modern-button s-modern" style="float: right;"><i class="fa fa-user"></i><span>Forum Profile</span></button></a>');

            }
        });

        var count = 0;
        W.EditorProfile.data.editingActivity.forEach(function(x) { if(x !== 0) count++; });
        $('#editing-activity > div > h3').append(" (" + count + " of last 91 days)");

        await getManagedAreas();
        BuildManagedAreasWKTInterface();
        /**************  Add Average & Total to Editing Activity ***********/
        AddEditingActivityAvgandTot();
        /************** Add Editor Stats Section **************/
        AddEditorStatsSection();

        initEnvironmentChooser();

        $('.user-stats-value').each(function(num){
            debugger;
            let num1 = Number($(this).text());
            if(!isNaN(num1))
                $(this).text(Number(num1).toLocaleString());
        })

        $('.type-content__count > h3').each(function(num){
            $(this).text(Number($(this).text()).toLocaleString());
        })
    }

    function initEnvironmentChooser(){
        let highlight = document.createElement('div');
        highlight.className="highlight";
        let highlightTitle = document.createElement('div');
        highlightTitle.className="highlight-title";
        let highlightTitleIcon = document.createElement('div');
        //highlightTitleIcon.className="highlight-title-icon posts";
        highlightTitleIcon.setAttribute('style',getIconStyle());
        let highlightTitleText = document.createElement('div');
        highlightTitleText.className="highlight-title-text";
        let userStatsValue = document.createElement('div');
        userStatsValue.className="user-stats-value";

        highlightTitle.appendChild(highlightTitleIcon);
        highlightTitle.appendChild(highlightTitleText);
        highlight.appendChild(highlightTitle);
        highlight.appendChild(userStatsValue);

        highlightTitleText.innerHTML = 'Environments';
        userStatsValue.setAttribute('style','margin-top: -10px;font-size: 17px;');

        let frag = document.createDocumentFragment(),
            select = document.createElement("select");
        select.id = 'environmentSelect';
        select.name = 'environmentSelect';
        select.setAttribute('style','position:relative;box-shadow: 0 0 2px #57889C;background: white;font-family: sans-serif;display: inherit;top: -11px;border: 0px;outline: 0px;color: #59899e;');

        select.options.add( new Option("Last Edit (" + lastEditEnv.toUpperCase() + ")","default", true, true) );
        select.options.add( new Option("NA","na") );
        select.options.add( new Option("ROW","row") );
        select.options.add( new Option("IL","il") );

        for (var i = 0; i < select.options.length; i++) {
            if (select.options[i].value == settings.Environment)
                select.options[i].selected = true;
        }

        frag.appendChild(select);
        document.getElementsByClassName('user-stats')[0].prepend(highlight);
        userStatsValue.appendChild(frag);

        document.querySelector('select[name="environmentSelect"]').onchange = envChanged;
    }

    function getIconStyle() {
        let tempQuerySelector = document.querySelector('#edits-by-type .venue-icon');
        let tempComputedStyle = window.getComputedStyle(tempQuerySelector);
        let iconStyle =
            `background-image:${tempComputedStyle.getPropertyValue('background-image')};`
        + `background-size:${tempComputedStyle.getPropertyValue('background-size')};`
        + `background-position:${tempComputedStyle.getPropertyValue('background-position')};`
        + `width:${tempComputedStyle.getPropertyValue('width')};`
        + `height:${tempComputedStyle.getPropertyValue('height')};`
        + `transform: scale(0.5);`
        + `display: inline-block;`
        + `float: left;`
        + `position: relative;`
        + `top: -10px;`
        + `left: -9px;`
        + `margin-right: -18px;`
        + `filter: invert(10%) sepia(39%) saturate(405%) hue-rotate(152deg) brightness(99%) contrast(86%);`;
        return iconStyle;
    }

    function AddLabelsToAreas(){
        if($('svg.leaflet-zoom-animated').length > 0){
            $('svg.leaflet-zoom-animated g > text').remove();
            var svg = $('svg.leaflet-zoom-animated')[0];
            var pt = svg.createSVGPoint(), svgP;

            let displayedAreas = $('svg.leaflet-zoom-animated g');

            for(let i=0;i<displayedAreas.length;i++){
                let windowPosition = $(displayedAreas[i])[0].getBoundingClientRect();
                pt.x = (windowPosition.left + windowPosition.right) / 2;
                pt.y = (windowPosition.top + windowPosition.bottom) / 2;
                svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

                if(svgP.x != 0 && svgP.y != 0){
                    var newText = document.createElementNS("http://www.w3.org/2000/svg","text");
                    newText.setAttributeNS(null,"x",svgP.x - (`Area ${i+1}`.visualLength() /2));
                    newText.setAttributeNS(null,"y",svgP.y);
                    newText.setAttributeNS(null, "fill", "red");
                    newText.setAttributeNS(null,"font-size","12");

                    var textNode = document.createTextNode(`Area ${i+1}`);
                    newText.appendChild(textNode);
                    $(displayedAreas[i])[0].appendChild(newText);
                }
            }
        }
    }

    function BuildManagedAreasWKTInterface(){
        if(naMA.managedAreas.length > 0 || rowMA.managedAreas.length > 0 || ilMA.managedAreas.length > 0){
            $('#header > div > div.user-info > div > div.user-highlights > div.user-stats').before('<a href="#" title="View editor\'s managed areas in WKT format"><button class="s-modern-button s-modern" id="userMA" style="float: right;"><i class="fa fa-map-o" aria-hidden="true"></i></button></a>');

            /****** MO to update labels when panning/zooming the map ************/
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if ($(mutation.target).hasClass('leaflet-map-pane') && (mutation.attributeName === "class" || mutation.attributeName === "style")){
                        if(mutation.attributeName === "class" && mutation.target.classList.length == 1) //zoom has ended, we can redraw our labels
                            setTimeout(AddLabelsToAreas, 200);
                        else if(mutation.attributeName === "style") //panning the map
                            setTimeout(AddLabelsToAreas, 200);
                    }
                });
            });
            observer.observe(document.getElementsByClassName('component-map-view')[0], { childList: true, subtree: true, attributes:true });

            AddLabelsToAreas();

            $('#userMA').click(function(){
                if($('#wpeWKT').css('visibility') === 'visible')
                    $('#wpeWKT').css({'visibility': 'hidden'});
                else
                    $('#wpeWKT').css({'visibility': 'visible'});
            });

            var result = buildWKTArray(naMA);
            nawkts = result.wktArr;
            combinedNAWKT = result.combinedWKT;

            result = buildWKTArray(rowMA);
            rowwkts = result.wktArr;
            combinedROWWKT = result.combinedWKT;

            result = buildWKTArray(ilMA);
            ilwkts = result.wktArr;
            combinedILWKT = result.combinedWKT;

            var $section = $("<div>", {style:"padding:8px 16px"});
            $section.html([
                '<div id="wpeWKT" style="padding:8px 16px; position:fixed; border-radius:10px; box-shadow:5px 5px 10px 4px Silver; top:25%; left:40%; background-color:white; visibility:hidden;">', //Main div
                '<div style="float:right; cursor:pointer;" id="wpeClose"><i class="fa fa-window-close" aria-hidden="true"></i></div>',
                '<ul class="nav nav-tabs">',
                `${naMA.managedAreas.length > 0 ? '<li class="active"><a data-toggle="pill" href="#naAreas">NA</a></li>' : ''}`,
                `${rowMA.managedAreas.length > 0 ? '<li><a data-toggle="pill" href="#rowAreas">ROW</a></li>' : ''}`,
                `${ilMA.managedAreas.length > 0 ? '<li><a data-toggle="pill" href="#ilAreas">IL</a></li>' : ''}`,
                '</ul>',
                '<div class="tab-content">',
                '<div id="naAreas" class="tab-pane fade in active">',
                '<div id="wpenaAreas" style="float:left; max-height:350px; overflow:auto;"><h3 style="float:left; left:50%;">Editor Areas</h3><br>' + buildAreaList(nawkts,"na") + '</div>',
                '<div id="wpenaPolygons" style="float:left; padding-left:15px;"><h3 style="position:relative; float:left; left:40%;">Area WKT</h3><br><textarea rows="7" cols="55" id="wpenaAreaWKT" style="height:auto;"></textarea></div>',
                '</div>',//naAreas
                '<div id="rowAreas" class="tab-pane fade">',
                '<div id="wperowAreas" style="float:left; max-height:350px; overflow:auto;"><h3 style="float:left; left:50%;">Editor Areas</h3><br>' + buildAreaList(rowwkts, "row") + '</div>',
                '<div id="wperowPolygons" style="float:left; padding-left:15px;"><h3 style="position:relative; float:left; left:40%;">Area WKT</h3><br><textarea rows="7" cols="55" id="wperowAreaWKT" style="height:auto;"></textarea></div>',
                '</div>',//rowAreas
                '<div id="ilAreas" class="tab-pane fade">',
                '<div id="wpeilAreas" style="float:left; max-height:350px; overflow:auto;"><h3 style="float:left; left:50%;">Editor Areas</h3><br>' + buildAreaList(ilwkts, "il") + '</div>',
                '<div id="wpeilPolygons" style="float:left; padding-left:15px;"><h3 style="position:relative; float:left; left:40%;">Area WKT</h3><br><textarea rows="7" cols="55" id="wpeilAreaWKT" style="height:auto;"></textarea></div>',
                '</div>',//ilAreas
                '<div id="wpeFooter" style="clear:both; margin-top:10px;">View the areas by entering the WKT at <a href="http://map.wazedev.com" target="_blank">http://map.wazedev.com</a></div>',
                '</div>', //tab-content
                '</div>' //end main div
            ].join(' '));

            $('body').append($section.html());

            $('[id^="wpenaAreaButton"]').click(function(){
                let index = parseInt($(this)[0].id.replace("wpenaAreaButton", ""));
                $('#wpenaAreaWKT').text(nawkts[index]);
                $('#wpenaPolygons > h3').text(`Area ${index+1} WKT`);
            });

            $('[id^="wperowAreaButton"]').click(function(){
                let index = parseInt($(this)[0].id.replace("wperowAreaButton", ""));
                $('#wperowAreaWKT').text(rowwkts[index]);
                $('#wperowPolygons > h3').text(`Area ${index+1} WKT`);
            });

            $('[id^="wpeilAreaButton"]').click(function(){
                let index = parseInt($(this)[0].id.replace("wpeilAreaButton", ""));
                $('#wpeilAreaWKT').text(ilwkts[index]);
                $('#wpeilPolygons > h3').text(`Area ${index+1} WKT`);
            });

            $('#wpenaCombinedAreaButton').click(function(){
                $('#wpenaAreaWKT').text(combinedNAWKT);
                $('#wpenaPolygons > h3').text(`Combined Area WKT`);
            });

            $('#wperowCombinedAreaButton').click(function(){
                $('#wperowAreaWKT').text(combinedROWWKT);
                $('#wperowPolygons > h3').text(`Combined Area WKT`);
            });

            $('#wpeilCombinedAreaButton').click(function(){
                $('#wpeilAreaWKT').text(combinedILWKT);
                $('#wpeilPolygons > h3').text(`Combined Area WKT`);
            });

            $('#wpeClose').click(function(){
                if($('#wpeWKT').css('visibility') === 'visible')
                    $('#wpeWKT').css({'visibility': 'hidden'});
                else
                    $('#wpeWKT').css({'visibility': 'visible'});
            });
        }
    }

    function AddEditorStatsSection(){
        let edits = W.EditorProfile.data.edits
        let editActivity = [].concat(W.EditorProfile.data.editingActivity);
        let rank = W.EditorProfile.data.rank+1;
        let count = 0;
        editActivity.forEach(function(x) {if(x !== 0) count++; });
        let editAverageDailyActive = Math.round(editActivity.reduce(reducer)/count);
        let editAverageDaily = Math.round(editActivity.reduce(reducer)/91);

        var $editorProgress = $("<div>");
        $editorProgress.html([
            `<div id="collapsible" style="display:${settings.EditingStatsExpanded ? "block" : "none"};">`,
            '<div style="display:inline-block;"><div><h4>Average Edits per Day</h4></div><div>' + editAverageDaily + '</div></div>',
            '<div style="display:inline-block; margin-left:25px;"><div><h4>Average Edits per Day (active days only)</h4></div><div>' + editAverageDailyActive + '</div></div>',
            '<div class="editor-progress-list" style="display:flex; flex-flow:row wrap; justify-content:space-around;">',
            buildProgressItemsHTML(),
            '</div>'
        ].join(' '));

        $('#editing-activity').append('<div id="editor-progress"><h3 id="collapseHeader" style="cursor:pointer;">Editing Stats</h3></div>');
        $('#editor-progress').append($editorProgress.html()+'</div>');

        $('#collapseHeader').click(function(){
            $('#collapsible').toggle();
            settings.EditingStatsExpanded = ($('#collapsible').css("display") === "block");
            saveSettings();
        });
    }

    function buildProgressItemsHTML(){
        var itemsArr = [];
        var $items = $("<div>");
        let editActivity = W.EditorProfile.data.editingActivity;

        //loop over the 13 tracked weeks on the profile
        for(let i=0; i<13; i++){
            let header = "";
            let weekEditCount = 0;
            //let weekEditPct = 0;
            if(i==0){
                header = "Past 7 days";
                weekEditCount = editActivity.slice(-7).reduce(reducer);
            }
            else{
                header = `Past ${i*7+1} - ${(i+1)*7} days`;
                weekEditCount = editActivity.slice(-((i+1)*7),-i*7).reduce(reducer);
            }
            let weekDailyAvg = Math.round(weekEditCount/7*100)/100;
            itemsArr.push('<div style="margin-right:20px;">');
            itemsArr.push(`<h4>${header}</h4>`);
            itemsArr.push('<div class="editor-progress-item">');
            itemsArr.push(`<div class="editor-progress__name">Week\'s Edits</div><div class="editor-progress__count">${weekEditCount}</div>`); //, ${weekEditPct}%</div>`);
            itemsArr.push(`<div class="editor-progress__name">Average Edits/Day</div><div class="editor-progress__count">${weekDailyAvg}</div>`);
            itemsArr.push('</div></div>');
        }
        $items.html(itemsArr.join(' '));
        return $items.html();
    }

    function AddEditingActivityAvgandTot(){
        $('.legend').append('<div class="day-initial">Avg</div> <div class="day-initial">Tot</div>');
        $('.editing-activity').css({"width":"1010px"}); //With adding the Avg and Tot rows we have to widen the div a little so it doesn't wrap one of the columns

        let currWeekday = new Date().getDay();
        if(currWeekday === 0)
            currWeekday = 7;
        let localEditActivity = [].concat(W.EditorProfile.data.editingActivity);
        let weekEditsArr = localEditActivity.splice(-currWeekday);
        let weekEditsCount = weekEditsArr.reduce(reducer);
        var iteratorStart = 13;
        if(currWeekday === 7)
            iteratorStart = 12;
        $(`.weeks div:nth-child(${iteratorStart+1}) .week`).append(`<div class="day" style="font-size:10px; height:10px; text-align:center; margin-top:-5px;" title="Average edits per day for this week">${Math.round(weekEditsCount/currWeekday * 100) / 100}</div><div style="font-size:10px; height:10px; text-align:center;" title="Total edits for this week">${weekEditsCount}</div>`);
        for(let i=iteratorStart; i>0; i--){
            weekEditsArr = localEditActivity.splice(-7);
            weekEditsCount = weekEditsArr.splice(-7).reduce(reducer);
            let avg = Math.round(weekEditsCount/7 * 100) / 100;
            $(`.weeks div:nth-child(${i}) .week`).append(`<div class="day" style="font-size:10px; height:10px; text-align:center; margin-top:-5px;" title="Average edits per day for this week">${avg}</div><div style="font-size:10px; height:10px; text-align:center;" title="Total edits for this week">${weekEditsCount}</div>`);
        }
    }

    function buildAreaList(wkts, server){
        let html = "";
        for(let i=0; i<wkts.length; i++){
            html +=`<button id="wpe${server}AreaButton${i}" class="s-button s-button--mercury " style="margin-bottom:5px;">Area ${i+1}</button><br>`;
        }
        if(wkts.length > 1)
            html +=`<button id="wpe${server}CombinedAreaButton" class="s-button s-button--mercury " style="margin-bottom:5px;">Combined</button><br>`;
        return html;
    }

    function buildWKTArray(wktObj){
        let wkt = "";
        let combined = "";
        let wktArr = [];
        for(let i=0; i<wktObj.managedAreas.length; i++){
            if(i>0)
                combined += ",";
            wkt = "";
            combined += "(";
            for(let j=0; j<wktObj.managedAreas[i].coordinates.length; j++){
                if(j>0){
                    wkt += ",";
                    combined += ",";
                }
                combined += "(";
                wkt +="(";
                for(let k=0; k<wktObj.managedAreas[i].coordinates[j].length; k++){
                    if(k > 0){
                        wkt+=", ";
                        combined += ",";
                    }
                    wkt += round(parseFloat(wktObj.managedAreas[i].coordinates[j][k][0])).toString() + " " + round(parseFloat(wktObj.managedAreas[i].coordinates[j][k][1])).toString();
                    combined += round(parseFloat(wktObj.managedAreas[i].coordinates[j][k][0])).toString() + " " + round(parseFloat(wktObj.managedAreas[i].coordinates[j][k][1])).toString();
                }
                combined += ")";
                wkt += ")";
            }
            combined += ")";
            wkt = `POLYGON${wkt}`;
            wktArr.push(wkt);
        }
        if(wktObj.managedAreas.length > 1)
            combined = `MULTIPOLYGON(${combined})` ;
        else
            combined = `POLYGON${combined}`;

        return {wktArr: wktArr, combinedWKT: combined};
    }

    function round(val){
        return Math.round(val*1000000)/1000000;
    }

    async function getManagedAreas(){
        naMA = await $.get(`https://www.waze.com/Descartes/app/UserProfile/Areas?userID=${W.EditorProfile.data.userID}`);
        rowMA = await $.get(`https://www.waze.com/row-Descartes/app/UserProfile/Areas?userID=${W.EditorProfile.data.userID}`);
        ilMA = await $.get(`https://www.waze.com/il-Descartes/app/UserProfile/Areas?userID=${W.EditorProfile.data.userID}`);

        /*return await new W.EditorProfile.Models.ManagedAreas([],{
                lastEditEnv: 'na',
                userId: W.EditorProfile.data.userID
            }).fetch();*/
    }

    function envChanged(e) {
        settings.Environment = e.target.value;
        saveSettings();
        location.reload();
    }

    function injectCSS() {
        /*var css =  [
            ].join(' ');
        $('<style type="text/css">' + css + '</style>').appendTo('head');*/
    }

    function loadSettings() {
        var loadedSettings = JSON.parse(localStorage.getItem("WEPE_Settings"));
        var defaultSettings = {
            EditingStatsExpanded: true,
            Environment: 'default'
        };
        settings = loadedSettings ? loadedSettings : defaultSettings;
        for (var prop in defaultSettings) {
            if (!settings.hasOwnProperty(prop))
                settings[prop] = defaultSettings[prop];
        }
    }

    function saveSettings() {
        if (localStorage) {
            var localsettings = {
                EditingStatsExpanded: settings.EditingStatsExpanded,
                Environment: settings.Environment
            };

            localStorage.setItem("WEPE_Settings", JSON.stringify(localsettings));
        }
    }
})();
