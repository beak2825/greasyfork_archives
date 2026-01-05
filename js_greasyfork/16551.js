//The MIT License (MIT)
//Copyright (c) 2016 Jeff Wilde
//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// ==UserScript==
// @name         Add Story Points to Jira Dashboard
// @namespace    http://vivintsolar.com/
// @version      0.5
// @description  Add the story points to the  "Two Dimensional Filter Statistics" dashboard gadget.  You can not add custom external gadgets to Jira cloud.   This works around the issue. See also 
// https://answers.atlassian.com/questions/85876/two-dimensional-filter-statistics-summing-story-point
// version 0.2 adds sorting to columns headers.
// version 0.4 adds Estimated and Actual Story points
// version 0.5 fixes first column bug
// @author       Jeff Wilde
// @match        https://*.atlassian.net/secure/Dashboard.jspa*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16551/Add%20Story%20Points%20to%20Jira%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/16551/Add%20Story%20Points%20to%20Jira%20Dashboard.meta.js
// ==/UserScript==
/* jshint -W097 */
/* globals $, _ */
/* jshint esnext: true */
(function () {
    'use strict';

    const getStoryPointField = (type) => {
        const deferred = $.Deferred();
        $
            .get(window.location.origin + "/rest/api/2/field")
            .then((data) => {

            var storyPointFields = _.where(data, {
                name: type + " Story Points"
            });
            if (storyPointFields.length === 1) {
                deferred.resolve(storyPointFields[0]);
            } else {
                deferred.reject();
            }
        })
            .fail(() => {
            deferred.reject();
        });

        return deferred.promise();
    };

    var estStoryPointField = getStoryPointField('Est');
    var actStoryPointField = getStoryPointField('Act');

    const jqlSearch = (jql, type) => {
        const deferred = $.Deferred();
        let storyPointField = estStoryPointField;
        if (type === 'Act'){
            storyPointField = actStoryPointField;
        }

        let url = window.location.origin;
        url += "/rest/api/2/search";
        url += jql;
        $.get(url, function (data) {
            if (data && data.issues) {
                storyPointField.then((field) => {
                    let storyPoints = data.issues.map((issue) => {
                        return issue.fields[field.id];

                    });
                    let storyPointSum = storyPoints.reduce((prev, curr) => prev + curr, 0);
                    deferred.resolve(storyPointSum);
                });

            }
        });
        return deferred.promise();
    };

    const parseJqlParameter = (url, link, type) => {
        let jqlIndex = url.indexOf("?jql");
        let jql = url.substring(jqlIndex);

        jqlSearch(jql, type).then((points) => {
            link.text(points);
        });
    };

    const getStoryPoints = (td, type) => {
        const links = td.find("a");
        links.each(function () {
            let link = $(this);
            let href = link.attr("href");

            let jqlIndex = href.indexOf("?jql");
            let fliterIndex = href.indexOf("?filter");
            if (jqlIndex < 0 && fliterIndex >= 0) {
                let filter = href.substring(fliterIndex + 8);
                let url = window.location.origin;
                url += "/rest/api/2/filter/";
                url += filter;

                $.get(url, function (data) {
                    parseJqlParameter(data.searchUrl, link, type);
                });

            } else if (jqlIndex >= 0) {
                parseJqlParameter(href, link, type);
            }

        });


    };

    const sortTable = (e) => {

        const iconDown = $('<span class="aui-icon aui-icon-small aui-iconfont-arrows-down"></span>');
        const iconUp = $('<span class="aui-icon aui-icon-small aui-iconfont-arrows-up"></span>');
        const clicked = $(e.target).closest("th");
        const row = clicked.closest("tr");
        const table = row.closest("table");
        const tbody = table.find("tbody");
        const tbodyRows = tbody.find("tr");

        let upSorted = clicked.find(".aui-iconfont-arrows-up").length !== 0;
        let downSorted = clicked.find(".aui-iconfont-arrows-down").length !== 0;

        let sortDown = true;
        const clickedIndex = clicked.index();

        row.find(".aui-icon").remove();

        if (upSorted){
            clicked.append(iconDown);
            sortDown = true;
        }
        else if (downSorted){
            clicked.append(iconUp);
            sortDown = false;
        }
        else{
            clicked.append(iconDown);
            sortDown = true;
        }

        let rowArray = tbodyRows.toArray();
        let totalRow = rowArray.pop();

        tbodyRows.remove();
        rowArray = _.sortBy(rowArray, (row) => {
            let sortByTd = $(row).find( "td:nth-of-type(" + clickedIndex + ")" );
            let value = Number(sortByTd.text());
            return value;
        });

        if (sortDown){
            rowArray.reverse();
        }

        rowArray.push(totalRow);
        tbody.append(rowArray);

    };

    const changeTableHead = (table) => {
        const headTrs = table.find('thead tr');
        const gadgetHeads = headTrs.find("th:not(.axis)");

        gadgetHeads.on("click", sortTable);
        gadgetHeads.css("cursor", "pointer");

        gadgetHeads.each(function () {
            let head = $(this);
            let clone = head.clone();
            clone.on("click", sortTable);
            head.after(clone);
            clone.html(clone.html() + "<br/> Est Story Points");
        });

        gadgetHeads.each(function () {
            let head = $(this);
            let clone = head.clone();
            clone.on("click", sortTable);
            head.after(clone);
            clone.html(clone.html() + "<br/> Act Story Points");
        });

    };

    const changeTablebody = (table) => {
        var headTrs = table.find('tbody tr');
        var gadgetHeads = headTrs.find("td:not(.scope)");
        gadgetHeads.each(function () {
            let cell = $(this);
            let clone = cell.clone();
            clone.find('a').html('"<span class="aui-icon aui-icon-wait">Wait</span>"');
            cell.after(clone);
            getStoryPoints(clone, 'Est');

        });
        gadgetHeads.each(function () {
            let cell = $(this);
            let clone = cell.clone();
            clone.find('a').html('"<span class="aui-icon aui-icon-wait">Wait</span>"');
            cell.after(clone);
            getStoryPoints(clone, 'Act');

        });
        $($(".two-d-container .aui th:contains('T:')")[0]).trigger('click');
    };

    const addPointsToTable = (table) => {
        changeTableHead(table);
        changeTablebody(table);
        toggleColumns(table);
    };


    const addToMenu = (menu) => {
        const container = menu.closest('.dashboard-item-frame.gadget-container');
        const containerId = container.attr('id');
        const types = ['Tickets', 'Actual', 'Estimated'];
        types.forEach((type) => {
            const id = containerId + '-' + type;
            menu.append('<li class="dropdown-item"><a class="item-link minimization" href="#"><label><input id="' + id + '" type="checkbox" name="filter" value="' + type + '" />' + type + '</label></a></li>');        
            const checked = !!window.localStorage.getItem(id);
            $('#' + id).prop( "checked", checked );
        });
    };

    const toggle = (event) => {
        const checkbox = $(event.currentTarget);
        const container = checkbox.closest('.dashboard-item-frame.gadget-container');
        const containerId = container.attr('id');
        const table = container.find('table');
        const value = $(event.currentTarget).val();
        const checked = $(event.currentTarget).is(':checked');
        const id = containerId + '-' + value;

        if (checked){
            window.localStorage.setItem(id, 'true');
        } else {
            window.localStorage.removeItem(id);
        }

        toggleColumns(table);
    };

    const toggleColumns = (table) => {
        if (!table.is('table')) return;
        const container = table.closest('.dashboard-item-frame.gadget-container');
        const containerId = container.attr('id');

        const types = ['Tickets', 'Actual', 'Estimated'];
        types.forEach((type) => {
            const id = containerId + '-' + type;
            const checked = !!window.localStorage.getItem(id);
            const index = types.indexOf(type);
            const columnIndexes = [];
            const ths = $(table.find('tr')[0]).find('th');
            for(let i = 0; i < ths.length; i++){
                const text = $(ths[i]).text();
                if(type === 'Actual' && text.endsWith('Act Story Points')){
                    columnIndexes.push(i);
                } else if(type === 'Estimated' && text.endsWith('Est Story Points')){
                    columnIndexes.push(i);
                } else if(type === 'Tickets' && i !== 0 && !text.endsWith(' Story Points') ){
                    columnIndexes.push(i);
                }
            }
            hideColumns(table, checked, columnIndexes);
        });
    };

    const hideColumns = (table, show, indexes) => {
        indexes.forEach((index) => {
            const trs = table.find( "tr" );
            trs.toArray().forEach((tr) => {
                const tds = $(tr).find('td');
                if (show){
                    if (tds[index - 1]) $(tds[index - 1]).show();
                } else {
                    if (tds[index - 1]) $(tds[index - 1]).hide();
                }
                const ths = $(tr).find('th');
                if (show){
                    if (ths[index]) $(ths[index]).show();
                } else {
                    if (ths[index]) $(ths[index]).hide();
                }
            });
        });
    };

    $(document).ready(function () {
        $(document).on('change','input[type="checkbox"][name="filter"]', toggle);

        $(".two-d-container .aui").each(function () {
            addPointsToTable($(this));
        });


        document.addEventListener("DOMNodeInserted", function (e) {
            const tables = $(e.target).find(".aui");
            if ($(e.target).is(".two-d-container") && tables.length > 0) {
                console.log(tables);
                tables.each(function () {
                    addPointsToTable($(this));
                });
            }
        }, false);

        $(".gadget-menu .aui-dropdown.standard").each(function () {
            addToMenu($(this));
        });


        document.addEventListener("DOMNodeInserted", function (e) {
            const menus = $(e.target).find(".gadget-menu .aui-dropdown.standard");
            if ($(e.target).is(".gadget-menu") && menus.length > 0) {
                console.log(menus);
                menus.each(function () {
                    addToMenu($(this));
                });
            }
        }, false);

    });

}());