// ==UserScript==
// @name         Last.fm Original Tag Chart
// @namespace    http://thlayli.detrave.net
// @description  Restores the "subway map" chart on new Last.fm report pages
// @icon         https://www.google.com/s2/favicons?sz=64&domain=last.fm
// @require      https://cdnjs.cloudflare.com/ajax/libs/d3/4.13.0/d3.min.js
// @require      https://code.jquery.com/jquery-1.9.0.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery-address@1.6.0/src/jquery.address.min.js
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @include      https://www.last.fm/*
// @version      1.9.5
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/485285/Lastfm%20Original%20Tag%20Chart.user.js
// @updateURL https://update.greasyfork.org/scripts/485285/Lastfm%20Original%20Tag%20Chart.meta.js
// ==/UserScript==

// define custom colors (24 colors)
var colorPalettes = [];
// interlaced rainbow mod 11 (1,12,2,13...)
colorPalettes[1] = ['#0FB2AC', '#3E90D2', '#795CC6', '#B539B0', '#DF2D77', '#F93A40', '#FA7845', '#F9A948', '#FDE34E', '#F9FF51', '#C5E44D', '#68D15A', '#329FD4', '#5579E0', '#8E48BA', '#C72E95', '#F13667', '#FB5843', '#FA8F46', '#FCCE4B', '#FBF250', '#E1F051', '#9DDD53', '#07C16C'];
// full rainbow
colorPalettes[2] = ['#0FB2AC', '#329FD4', '#3E90D2', '#5579E0', '#795CC6', '#8E48BA', '#B539B0', '#C72E95', '#DF2D77', '#F13667', '#F93A40', '#FB5843', '#FA7845', '#FA8F46', '#F9A948', '#FCCE4B', '#FDE34E', '#FBF250', '#F9FF51', '#E1F051', '#C5E44D', '#9DDD53', '#68D15A', '#07C16C'];

// define icons for button
var paletteIcons = [];
paletteIcons[1] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAABCAYAAACYJC2PAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAa0lEQVQImbXMIQrCYBgA0Pf92xwI2gxWkzCsA4un8KIK4gnWDXaDYhEEwebc7yl8B3jRHnYZpteF9C01p7eyz9aXh4TlqxOy2bgTMag3I1CsKkqqtiZhXlCE872XM/vnRD+E421LxF/+Tw4/1GowrKfDOgcAAAAASUVORK5CYII=";
paletteIcons[2] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAABCAYAAACYJC2PAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAiUlEQVQImSXKwUpCQRQA0HNnHibIM4jSZQrSJ/TfLqQPadMyKITCyERdiM5t4fLAiefVMmG0XYjs1F0TSf/Viwyzz7WS6eFnD552R3B7WCvZTNqHcDEe/grppr6hGTx2JDEroEwKhZhWKt28Xn3fAePr0xeCzR+ZfB/PLsn7aaDhdT/UkpftHfgH524vZuHw1EUAAAAASUVORK5CYII=";

function switch_legacy_colors(event){
    if(event.data.change && event.data.change == true){

        var current = GM_getValue("legacy-chart-colors", 0);
        if(current == 2)
            GM_setValue("legacy-chart-colors", 0)
        else
            GM_setValue("legacy-chart-colors", current+1)
    }
    $("#legacy-colors-button img").attr('src', paletteIcons[GM_getValue("legacy-chart-colors", 0)]);
    var colors = colorPalettes[GM_getValue("legacy-chart-colors", 0)];
    // add color style tags
    var styleHtml = '<style class="legacy-chart-colors">';
    for(var i=0; i<24; i++)
        styleHtml += '.legacy-tag-chart .top-tags-over-time-colour-'+i+' {fill: '+colors[i]+'; stroke: '+colors[i]+'} ';
    styleHtml += '</style>';
    $('.legacy-chart-colors').remove();
    $('head').append(styleHtml);
    // reset some styles
    $('head').append('<style class="legacy-chart-colors">#legacy-colors-button img {margin-left: 7px; height: 15px; width: 15px; border-radius: 50%; margin-top: 16px; cursor: pointer} .legacy-tag-chart svg {paint-order: stroke;} .legacy-tag-chart .tick text {fill: #a7acb7; stroke: none} .legacy-tag-chart .report-box-container--top-tags-over-time { fill: none; } text.lc-tag.lc-tag-white {fill: white; stroke: black} .lc-no-dot {display: none; }</style>');

}

function switch_toptag_colors(event){
    if(event.data.change && event.data.change == true){

        var current = GM_getValue("toptag-chart-colors", 0);
        if(current == 2)
            GM_setValue("toptag-chart-colors", 0)
        else
            GM_setValue("toptag-chart-colors", current+1)
    }
    $("#toptag-colors-button img").attr('src', paletteIcons[GM_getValue("toptag-chart-colors", 0)]);
    var colors = colorPalettes[GM_getValue("toptag-chart-colors", 0)];
    // add color style tags
    var styleHtml = '<style class="toptag-chart-colors">';
    for(var i=0; i<24; i++)
        styleHtml += '#top-tags-over-time .highcharts-series-'+i+' {fill: '+colors[i]+'; stroke: '+colors[i]+'} ';
    styleHtml += '</style>';
    $('.toptag-chart-colors').remove();
    $('head').append(styleHtml);
    // reset some styles
    $('head').append('<style class="toptag-chart-colors">#toptag-colors-button img {margin-left: 7px; height: 15px; width: 15px; border-radius: 50%; margin-top: 16px; cursor: pointer} </style>');

}

// disable to leave tags in database/proper case
var lowercase = true;

function main_func(){

    // prevent duplicate chart insertion
    if($(".legacy-tag-chart").length == 0){

        var tagData = [];
        var vals = [];

        // switch between 2023 and 2025 default palettes
        if($("#listening-fingerprint").length > 0){
            paletteIcons[0] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAACCAYAAAAesF8hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAkklEQVQYldXMsQ7BQACA4f96zZ1iu4jE3NFgsNAOYpMQb2D2AN09ka0IYrJ38wiiiRe4c2nZzFbfA3xitDm/AeKFJ2zAo0ipvcJkOS9luY53iCqkVfYBWHdmAOzTI0453G0IgOpJhIR47gkjKIuEymtMlgNwmWwBaN8HAKzMlGagOSQnrLbfZ/nsEtXy5z/gz30AGagy3m19NawAAAAASUVORK5CYII=";
            colorPalettes[0] = ['#c490ff', '#61d4b6', '#469df8', '#5911ac', '#165159', '#223689', '#8a4bd2', '#398d84', '#3262b8', '#c490ff', '#61d4b6', '#469df8', '#5911ac', '#165159', '#223689', '#8a4bd2', '#398d84', '#3262b8', '#c490ff', '#61d4b6', '#469df8', '#5911ac', '#165159', '#223689'];
        }else{
            paletteIcons[0] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAABCAYAAACYJC2PAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAWUlEQVQImbXMsREBQRQA0HdLH4Yh0pnIqEBjV4FSbrllRNj/JVoQvuQNh/GScL+9ZVBrt8ww1yA/ntfQdW16yWAbDazyoUibaBbS+uddn5WBfUwKjqezf/5f27tTkfwMSIIAAAAASUVORK5CYII=";
            colorPalettes[0] = ['#6ABDCB', '#5AA9C6', '#4A94C1', '#397FBB', '#2A6CB6', '#1955B0', '#3D53A0', '#5E5291', '#835080', '#A64F71', '#CD4D60', '#FA4B4B', '#6ABDCB', '#5AA9C6', '#4A94C1', '#397FBB', '#2A6CB6', '#1955B0', '#3D53A0', '#5E5291', '#835080', '#A64F71', '#CD4D60', '#FA4B4B'];
        }
        // don't run on old style (pre-2023) pages
        if($("section[data-require='stats/top-tags-v2']").length == 0){

            // Create a div to put the chart into
            $('<div class="listening-report-row listening-report-row--2-wide"><div class="report-box-container report-box-container--charts report-box-container--top-tags-over-time"><div class="report-box-header"><h3 class="report-box-title">Tag timeline</h3></div><div class="report-box-content legacy-tag-chart" style="text-align: center;"></div><div id="legacy-colors-button" class="report-dropdown-button"><img alt="Change color palette" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAABCAYAAACYJC2PAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAWUlEQVQImbXMsREBQRQA0HdLH4Yh0pnIqEBjV4FSbrllRNj/JVoQvuQNh/GScL+9ZVBrt8ww1yA/ntfQdW16yWAbDazyoUibaBbS+uddn5WBfUwKjqezf/5f27tTkfwMSIIAAAAASUVORK5CYII="></div></div></div>').insertAfter($('.listening-report-row--2-wide').first());

            //  add color button handler and set colors
            $("#legacy-colors-button").click({change: true}, switch_legacy_colors);
            switch_legacy_colors({data: {change: false}});

            // create the secondary (top tag chart) color button
            $('<div id="toptag-colors-button" class="report-dropdown-button"><img alt="Change color palette" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAABCAYAAACYJC2PAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAWUlEQVQImbXMsREBQRQA0HdLH4Yh0pnIqEBjV4FSbrllRNj/JVoQvuQNh/GScL+9ZVBrt8ww1yA/ntfQdW16yWAbDazyoUibaBbS+uddn5WBfUwKjqezf/5f27tTkfwMSIIAAAAASUVORK5CYII="></div>').insertAfter($('#top-tags-over-time .report-box-header').first());

            //  add secondary color button handler and set colors
            $("#toptag-colors-button").click({change: true}, switch_toptag_colors);
            switch_toptag_colors({data: {change: false}});

            // get the tag data from the html table
            d3.selection.prototype.mapNested = function (f) {
                var arr = d3.range(this.size()).map(function () { return []; });
                this.each(function (d, i) { arr[i].push(f.call(this, d, i)); });
                return arr;
            };
            tagData = d3.select(".js-top-tags-over-time-table").selectAll("thead,tbody").selectAll("tr").selectAll("th,td");
            vals = tagData.mapNested(function(d, i, j){ return d3.select(this).text().replace(/\n\s+/g,"") }).filter(v => (v.length > 0));

            // console.log('tag timeline raw data: '+vals);

            // change scale and width for 2025 layout pages
            if($("#listening-fingerprint").length > 0 && $("#artist-map").length == 0){
                var scale = (vals.length > 7) ? 1.94 : 0.97;
                var chartWidth = (vals.length > 7) ? 2200 : 1050;
                var chartHeight = 335*scale;
                // scale lines slightly less than layout
                var lineScale = (vals.length > 7) ? 1.75 : 0.97;
            }else{
                var scale = (vals.length > 7) ? 2 : 1;
                var chartWidth = (vals.length > 7) ? 2000 : 850;
                var chartHeight = 350*scale;
                // scale lines slightly less than layout
                var lineScale = (vals.length > 7) ? 1.5 : 1;
            }
            var margin = 25*scale;

            // clear any previous styles
            $('.tag-chart-styles').remove();

            // scale chart if full year
            if(vals.length > 7){
                // scale yearly pages differently from 2025 on
                if($("#listening-fingerprint").length > 0){
                    $('head').append(`<style class='tag-chart-styles'>
                .legacy-tag-chart svg {margin-top: -8%; transform-origin: top left; transform: scale(0.59);}
                .legacy-tag-chart .x-axis {transform: scale(1) translate(` + 24*lineScale + "px, "+ (chartHeight - margin) + `px);}
                .legacy-tag-chart .tick text {fill: #a7acb7;}
                .y-axis {transform: translate(51px, 0);}
                .legacy-tag-chart {overflow-x: hidden;}
                @media (max-width: 1260px) {
                    .legacy-tag-chart svg {margin-top: -5%; transform: scale(0.47);}
                }
                @media (max-width: 768px){
                    .legacy-tag-chart {overflow-x: scroll;}
                    .legacy-tag-chart svg {margin-right: -1050px; margin-bottom: -370px; margin-top: -70px;}
                }
                </style>`);
                }else{
                    $('head').append(`<style class='tag-chart-styles'>
                .legacy-tag-chart svg {margin-top: -5%; transform-origin: top left; transform: scale(0.52)}
                .legacy-tag-chart .x-axis {transform: scale(1) translate(` + 24*lineScale + "px, "+ (chartHeight - margin) + `px); }
                .y-axis {transform: translate(47px, 0);}
                @media (max-width: 1260px) {
                    .legacy-tag-chart svg {margin-top: -3%; transform: scale(0.43)}
                }
                .legacy-tag-chart {overflow-x: hidden; }
                @media (max-width: 768px){
                    .legacy-tag-chart {overflow-x: scroll;}
                    .legacy-tag-chart svg {margin-right: -1125px; margin-bottom: -400px; margin-top: -50px;}
                }
                </style>`);
                }
            }else{
                // scale week/month charts from 2025 on
                if($("#listening-fingerprint").length > 0){
                    $('head').append(`<style class='tag-chart-styles'>
                .legacy-tag-chart .x-axis {transform: translate(0, `+ (chartHeight - margin*0.75) + `px); }
                .y-axis {transform: translate(47px, 0);}
                .y-axis circle {fill: #232323; }
                .x-axis .tick text {transform: translate(2%, 0);}
                .legacy-tag-chart {overflow-x: hidden;}
                @media (max-width: 1260px) {
                    .legacy-tag-chart svg {transform: scale(0.85) translate(-9%, 0);}
                    .legacy-tag-chart .x-axis {transform: scale(1) translate(-22px, `+ (chartHeight - margin*0.75) + `px); }
                    .y-axis {transform: translate(55px, 0);}
                }
                @media (max-width: 768px){
                    .legacy-tag-chart {overflow-x: scroll;}
                    .legacy-tag-chart svg {margin-right: -150px;}
                }</style>`);
                }else{
                    $('head').append(`<style class='tag-chart-styles'>
                .y-axis {transform: translate(46.5px, 0);}
                .legacy-tag-chart .x-axis {transform: translate(` + 24*lineScale + "px, "+ (chartHeight - margin) + `px); }
                .legacy-tag-chart {overflow-x: hidden;}
                @media (max-width: 768px){
                    .legacy-tag-chart {overflow-x: scroll;}
                    .legacy-tag-chart svg {margin-right: -150px}
                }
                </style>`);
                }
            }

            // get list of tags
            var tags = vals[0].slice(1);

            // set some font sizes and overflow
            $('head').append('<style>.legacy-tag-chart .y-axis {font-size: ' + ((vals.length > 7) ? 36 : 20) + 'px; font-weight: bold} .legacy-tag-chart .x-axis {font-size: ' + 11*scale + 'px; font-weight: normal}</style>');

            // do some data transposition
            var valsByTag = d3.transpose(vals);
            var dates = valsByTag[0].map(v => v);
            dates[0] = '';

            console.log('tag timeline sorted data: '+valsByTag);

            // collect top 5 tags for each week
            var weekData = vals.map(r => r.slice(1).map(function(element, index, array){ return (element > 0) ? {tag: tags[index], plays: element } : {tag:'', plays: 0} }).sort(function(a, b){ return parseInt(b.plays) - parseInt(a.plays); }).slice(0,5));
            weekData.shift();

            // find first appearance of tag for dots
            var firstTag = []
            tags.map(function(element, index, array){
                var weekSummary = weekData.map(w => w.map(x => (x.tag == element) ? 1 : 0));
                var weekBoolean = weekSummary.map(w => (w.indexOf(1) != -1) ? 1 : 0);
                firstTag[element] = weekBoolean.indexOf(1);
            });

            // build d3 data object
            var d3data = [];
            weekData.map(function(element1, index1, array1){ element1.map(function(element2, index2, array2){
                if(element2.tag)
                    d3data.push({ date: index1+1, rank: index2+1, tag: element2.tag, dot: (firstTag[element2.tag] == index1) });
            })});

            // svg scalers
            const x = d3.scaleLinear().domain([0, 6*Math.ceil(scale)]).range([margin - 40, chartWidth - margin - 60])
            const y = d3.scaleLinear().domain([7, 1]).range([chartHeight - margin + 40, 10 + margin + ((Math.ceil(scale) == 2) ? 150 : 0)])

            var svgContainer = d3.select(".legacy-tag-chart").append("svg")
            .attr("width", chartWidth)
            .attr("height", chartHeight);

            var g = svgContainer.append("svg:g");

            // x axis
            var xaxis = d3.axisBottom(x)
            .ticks(vals.length-1)
            .tickFormat(function (d) {
                return dates[d];
            });

            svgContainer.append("g")
                .attr("fill","white")
                .attr("stroke","white")
                .attr("ticks",vals.length-1)
                .attr("class", "x-axis")
                .attr("stroke-width","0.5")
                .call(xaxis);

            // y axis
            var yaxis = d3.axisLeft(y)
            .ticks(6)
            .tickFormat(function (d) {
                return  (d < 6) ? d : '';
            });

            // draw y axis numbers
            svgContainer.append("g")
                .call(yaxis)
                .attr("fill","white")
                .attr("stroke","none")
                .attr("class", "y-axis")
                .attr("r", 12)
                .append("text")
                .attr("y", 6)
                .attr("dy", (0.71*scale)+"em")
                .style("text-anchor", "end");

            // draw circles behind y axis numbers
            $(".legacy-tag-chart .y-axis g:gt(1)").each(function() { d3.select(this).append("circle").attr("r", ((vals.length > 7) ? 28 : 19)).attr("cx",((vals.length > 7) ? -18 : -14)).attr("fill","#313131").lower(); });

            // delete axis lines
            d3.selectAll(".domain,.tick>line").remove();

            // draws circles (first tag appearance only)
            g.selectAll("tag-nodes")
                .data(d3data)
                .enter()
                .append("svg:circle")
                .attr("cx", function(d) { return x(d.date); })
                .attr("cy", function(d) { return y(d.rank); })
                .attr("r", 8*lineScale)
                .attr("class", function(d) { return ((d.dot) ? "" : "lc-no-dot ") + "lc-tag lc-tag-" + tags.indexOf(d.tag) + " top-tags-over-time-colour-" + tags.indexOf(d.tag) % 24})
                .append("svg:title")
                .text(function(d){ return d.tag.toProperCase(); });

            // draws lines
            g.selectAll("tag-lines")
                .data(d3data)
                .enter()
                .append('line')
                .attr('x1', function(d) { return x(d.date); })
                .attr('y1', function(d) { return y(d.rank); })
                .attr('x2', function(d) { return x(d.date) + ((scale == 2) ? 70 : 50); })
                .attr('y2', function(d) { return y(d.rank); })
                .attr("class", function(d) { return "lc-tag lc-tag-" + tags.indexOf(d.tag) + " top-tags-over-time-colour-" + tags.indexOf(d.tag) % 24})
                .style("stroke-width", 5*lineScale)
                .append("svg:title")
                .text(function(d){ return d.tag.toProperCase(); });

            // calculate links and draw curves

            // provide source column, source row, destination row
            function curveMaker(xsrc,xdest,ysrc,ydest){
                return [{ x: x(xsrc)+((scale == 2) ? 69 : 49), y: y(ysrc)},
                        { x: x(xsrc)+((scale == 2) ? 99 : 79), y: y(ysrc)},
                        { x: x(xdest)-29, y: y(ydest)},
                        { x: x(xdest)+1, y: y(ydest)}];
            }

            var curve = d3.line()
            .x((d) => d.x)
            .y((d) => d.y)
            .curve(d3.curveBasis);

            // iterate over tags
            jQuery.each(d3data, function(i,d) {

                // check to see if tag appears again
                var nextWeekToAppear = 0;
                for(var n=i+1; n<d3data.length; n++){
                    if(d3data[n].tag == d.tag){
                        nextWeekToAppear = d3data[n].date;
                        var nextRow = d3data[n].rank;
                        break;
                    }
                }

                // draw curves to tags that appear in the next week
                if(nextWeekToAppear == d.date+1){
                    // check for the tag in the next date set
                    if(d.date < vals.length-1 && weekData[d.date]){
                        var weeklyTags = weekData[d.date].map(r => r.tag);
                        var row = (weeklyTags.indexOf(d.tag) < 0) ? 6 : weeklyTags.indexOf(d.tag) + 1;
                        svgContainer.select("g")
                            .append("path")
                            .attr("d", curve(curveMaker(d.date,d.date+1,d.rank,row)))
                            .attr("fill", "none")
                            .attr("stroke", "white")
                            .style("stroke-width", 5*lineScale)
                            .attr("class", function(e) { return "lc-tag lc-tag-" + tags.indexOf(d.tag) + " report-box-container--top-tags-over-time top-tags-over-time-colour-" + tags.indexOf(d.tag) % 24});
                    }
                }

                // draw a curve to row 6 for artists who don't appear next week
                if(nextWeekToAppear > d.date+1){
                    svgContainer.select("g")
                        .append("path")
                        .attr("d", curve(curveMaker(d.date,d.date+1,d.rank,6)))
                        .attr("fill", "none")
                        .attr("opacity", 0.5)
                        .attr("stroke", "white")
                        .style("stroke-width", 5*lineScale)
                        .attr("class", function(e) { return "lc-dim lc-tag lc-tag-" + tags.indexOf(d.tag) + " report-box-container--top-tags-over-time top-tags-over-time-colour-" + tags.indexOf(d.tag) % 24})
                        .append("svg:title")
                        .text(function(e){ return d.tag.toProperCase(); });

                }

                if(nextWeekToAppear > 2 && 1 < d.date < 5 && d.date < nextWeekToAppear-1){
                    // draw a line on row 6 from the next week to nextWeekToAppear-1
                    if($("#listening-fingerprint").length > 0 && $("#artist-map").length == 0){
                        var scaleDifference = -0.07;
                        var endOffset = 0.703;
                    }else{
                        var scaleDifference = -0.07;
                        var endOffset = 0.63;
                    }
                    svgContainer.select("g")
                        .append("path")
                        .attr("d", curve(curveMaker(parseInt(d.date)+endOffset+((scale>1.5) ? scaleDifference : 0), parseInt(nextWeekToAppear)-endOffset-((scale>1.5) ? scaleDifference : 0), 6, 6)))
                        .attr("fill", "none")
                        .attr("stroke", "white")
                        .attr("opacity", 0.5)
                        .style("stroke-width", 5*lineScale)
                        .attr("class", function(e) { return "lc-dim lc-tag lc-tag-" + tags.indexOf(d.tag) + " report-box-container--top-tags-over-time top-tags-over-time-colour-" + tags.indexOf(d.tag) % 24})
                        .append("svg:title")
                        .text(function(e){ return d.tag.toProperCase(); });
                }

                // add curves (behind) from row 6 for returning tags
                if(d.date > 2){
                    var lastWeek = weekData[d.date-2].map(r => r.tag);
                    var found = lastWeek.indexOf(d.tag);
                    //if(found > -1)
                    //  else
                    //

                    // if no dot and not in last week, draw curve from row 6
                    if(d.dot == false && found == -1){
                        svgContainer.select("g")
                            .append("path")
                            .attr("d", curve(curveMaker(d.date-1,d.date,6,d.rank)))
                            .attr("fill", "none")
                            .attr("stroke", "white")
                            .attr("opacity", 0.5)
                            .style("stroke-width", 5*lineScale)
                            .attr("class", function(e) { return "lc-dim lc-tag lc-tag-" + tags.indexOf(d.tag) + " report-box-container--top-tags-over-time top-tags-over-time-colour-" + tags.indexOf(d.tag) % 24})
                            .append("svg:title")
                            .text(function(e){ return d.tag.toProperCase(); });
                    }
                }
            });

            // add tag labels (first time only)
            g.selectAll("legacy-text")
                .data(d3data)
                .enter()
                .append('text')
                .attr('x', function(d) { return x(d.date); })
                .attr('y', function(d) { return y(d.rank) - 20*lineScale; })
                .attr("fill", "white")
                .attr("stroke","black")
                .attr("font-family", "sans-serif")
                .attr("class", function(d) { return ((d.dot) ? "" : "lc-no-dot ") + "lc-tag lc-tag-white lc-tag-" + tags.indexOf(d.tag) + " report-box-container--top-tags-over-time top-tags-over-time-colour-" + tags.indexOf(d.tag) % 24})
                .attr("text-anchor", "middle")
                .text((d) => d.tag.toLowerCase());

            // truncate tags and convert to proper case on older and yearly pages (left over from legacy chart style)
            if($("#listening-fingerprint").length == 0 || $("#artist-map").length > 0)
                g.selectAll('text.lc-tag').attr("font-size", ((scale == 2) ? 20 : 12)).text((d) => (d.tag.length > 14) ? ($("#listening-fingerprint").length > 0) ? d.tag.slice(0,11).toLowerCase() + "..." : d.tag.slice(0,11).toProperCase() + "..." : ($("#listening-fingerprint").length > 0) ? d.tag.toLowerCase() : d.tag.toProperCase());

            // allow longer string on new pages - also slightly larger font
            if($("#listening-fingerprint").length > 0)
                g.selectAll('text.lc-tag').attr("font-size", ((scale == 2) ? 20 : 13)).text((d) => (d.tag.length > 17) ? d.tag.slice(0,14).toLowerCase() + "..." : d.tag.toLowerCase());


            // set up mouseover event listeners
            tags.forEach(function(t) {

                g.selectAll(".lc-tag-"+tags.indexOf(t))
                    .on('mouseover', function (d) {

                    // dim all tags
                    d3.selectAll(".lc-tag").transition().duration('100').attr('opacity', '.15');
                    // undim selected
                    d3.selectAll(".lc-tag-"+tags.indexOf(t)).transition().duration('100').attr('opacity', '1');
                    // dim selected lc-dim tags to 50%
                    d3.selectAll(".lc-tag-"+tags.indexOf(t)).filter(function() { return this.classList.contains('lc-dim') }).transition().duration('100').attr('opacity', '0.6');

                })
                    .on('mouseout', function (d) {
                    setTimeout(() => {
                        // undim all tags
                        d3.selectAll(".lc-tag").transition().duration('100').attr('opacity', '1');
                        // dim lc-dim tags to 50%
                        d3.selectAll(".lc-dim").transition().duration('100').attr('opacity', '0.5');
                    }, "50");
                });

            });

        }

    }

}

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

$.address.change(function(event) {
    waitForKeyElements(".js-top-tags-over-time-target > .highcharts-container", main_func);
});
