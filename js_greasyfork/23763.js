// ==UserScript==
// @name         Bierdopje Old Shows
// @namespace    http://www.bierdopje.com/
// @version      2.1.1
// @description  Adds a menu which includes a brand new page for the older (finished) shows.
// @match        http://*.bierdopje.com/shows
// @match        http://*.bierdopje.com/shows/
// @match        http://*.bierdopje.com/shows/page/*
// @match        http://*.bierdopje.com/shows/new
// @match        http://*.bierdopje.com/shows/new/
// @match        http://*.bierdopje.com/shows/finished
// @match        http://*.bierdopje.com/shows/finished/
// @match        http://*.bierdopje.com/shows/finished/*
// @grant        unsafeWindow
// @require      http://code.jquery.com/jquery-1.10.2.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/linq.js/2.2.0.2/linq.min.js
// @author       Tom
// @copyright    2016+, Tom
// @downloadURL https://update.greasyfork.org/scripts/23763/Bierdopje%20Old%20Shows.user.js
// @updateURL https://update.greasyfork.org/scripts/23763/Bierdopje%20Old%20Shows.meta.js
// ==/UserScript==

$(function() {
    var showURL            = 'http://www.bierdopje.com/shows/';
    var sourceJSON         = 'https://raw.githubusercontent.com/Bierdopje-Community/old-shows/master/show_data/bierdopje_series.json';
    var SHOWS_PER_PAGE     = 50;
    var PAGINATION_ITEMS   = 6;
    
    // Submenu for the /shows/* pages.
    var subMenuContainer = '<div id="submenucontainer"><div id="submenu"><ul><li class="strong"><a href="/shows" id="active" selected="selected">Actieve series</a></li><li class="strong"><a href="/shows/new" id="new">Nieuwe series</a></li><li class="strong"><a href="/shows/finished" id="finished">Oude series</a></li></ul></div></div>';
    $('#topmenu').after(subMenuContainer);
    
    // Select the page in the submenu and set page title.
    if (window.location.href.indexOf("new") > -1) {
        document.title = 'Bierdopje.com | Series | Nieuwe series';
        $('#new').addClass("selected");
    } else if (window.location.href.indexOf("finished") > -1) {
        document.title = 'Bierdopje.com | Series | Oude series';
        $('#finished').addClass("selected");
    } else {
        document.title = 'Bierdopje.com | Series | Actieve series';
        $('#active').addClass("selected");
    }
    
    // Add finished series content
    if (window.location.href.indexOf("finished") > -1) {
        var prefix             = getCurrentPrefixFromURL();
        var currentPage        = getCurrentPageFromURL();
        var clear              = '<div class="clear">&nbsp;</div>';
        var finishedHeaderText = '<h3>Alle <u>afgelopen</u> series</h3>';
        var contentDiv         = $('.go-wide');
        contentDiv.find('div').replaceWith(finishedHeaderText);
        
        // Raw data
        var letterPaginationStart = '<div class="rightfloat" style="width: 620px;"><ul id="pagination" class="letterPagination">';
        var letterPaginationEnd   = '</ul></div>';
        
        var paginationStart       = '<ul id="pagination" class="numberPagination">';
        var paginationEnd         = '</ul>';
        
        var tableStart            = '<table id="startShowTable" class="listing form" cellspacing="0"><colgroup><col style="width:20%;"><col style="width:5%;"><col style="width:6%;"><col style="width:6%;"><col style="width:8%;"><col style="width:6%;"><col style="width:6%;"></colgroup><tbody id="tableData">';
        var tableHeaders          = '<tr id="tableHeader"><th class="bluerow">Naam</th><th class="bluerow">Runtime</th><th class="bluerow"># Seizoenen</th><th class="bluerow"># Afleveringen</th><th class="bluerow">Status</th><th class="bluerow">Score</th><th class="bluerow"># Favorieten</th></tr>';
        var tableEnd              = '</tbody></table>';
        
        var loadingRow            = '<tr id="loadingRows"><td colspan="7" style="text-align: center;"><img src="http://cdn.bierdopje.eu/g/if/facebox/loading.gif" style="vertical-align: middle;" />&nbsp;&nbsp;&nbsp;<span style="vertical-align: middle;">Series laden...</span></td></tr>';
        
        contentDiv.append(letterPaginationStart);
        contentDiv.append(letterPaginationEnd);
        contentDiv.append(paginationStart);
        contentDiv.append(paginationEnd);
        contentDiv.append(tableStart);
        
        // Data accessors after insertion
        var letterPaginationData = $(".letterPagination");
        var paginationData       = $(".numberPagination");
        var startShowTable       = $("#startShowTable");
        var tableData            = $('#tableData');
        
        tableData.append(tableHeaders);
        tableData.append(loadingRow);
        
        var loading = $("#loadingRows");
        
        getData(currentPage, prefix);
    }
    
    function getCurrentPrefixFromURL() {
        if (window.location.href.indexOf("/finished/") > -1) {
            var url = window.location.href;
            var reg = /finished\/(?!page)([a-z|A-Z|0-9])/.exec(url);
            if (reg) {
                return reg[1];
            }
        }
        return "";
    }
    
    function getCurrentPageFromURL() {
        if (window.location.href.indexOf("/page/") > -1) {
            var url = window.location.href;
            return parseInt(url.substring(url.lastIndexOf('/page/') + 6));
        }
        return 1;
    }
    
    function getPageAmount(showCount) {
        if (showCount > SHOWS_PER_PAGE) {
            return Math.ceil(showCount / SHOWS_PER_PAGE);
        }
        return 1;
    }
    
    function getData(page, prefix) {
        currentPage = page;
        
        $.getJSON(sourceJSON, function(showData) {
            // Use LINQ to get only the prefix data
            showData = Enumerable.From(showData)
                .Where(function (x) { return startsWith(x.name, prefix) })
                .OrderBy(function (x) { return x.name })
                .ToArray();
            var showCount = Object.keys(showData).length;
            var pages     = getPageAmount(showCount);
            
            console.log("Great! I've found " + showCount + " shows.");
            console.log("Will be putting that on " + pages + " page(s). " + SHOWS_PER_PAGE + " on each page.");
            
            addLetterPagination(prefix);
            addPagination(prefix, pages);
            
            console.log("Crushing all that show data now. Just for you!");
            
            var startIndex = (currentPage * SHOWS_PER_PAGE) - SHOWS_PER_PAGE;
            
            for (var i = 0; i < SHOWS_PER_PAGE; i++, startIndex++) {
                var j = startIndex;
                if (typeof showData[j] != "undefined") {
                    //var showtvdbId     = showData[j].tvdbId;
                    var showName       = showData[j].name;
                    var currentURL     = showData[j].slug;
                    var showRuntime    = showData[j].runtime;
                    var showSeasons    = showData[j].seasons;
                    var showEpisodes   = showData[j].episodes;
                    var showStatus     = 'Afgelopen'; //showData[j].showstatus;
                    var showScore      = showData[j].score;
                    var showFavourites = showData[j].favorites;

                    var tableRow = '<tr class="show"><td><a href="' + showURL + currentURL + '">' + showName + '</a></td><td>' + showRuntime + '</td><td>' + showSeasons + '</td><td>' + showEpisodes + '</td><td>' + showStatus + '</td><td>' + showScore + '</td><td>' + showFavourites + '</td></tr>';
                    //var tableRow = '<tr class="show"><td><a href="' + currentURL + '" class="getShow" data-tvdbid="' + showtvdbId + '">' + showName + '</a></td><td>' + showRuntime + '</td><td>' + showSeasons + '</td><td>' + showEpisodes + '</td><td>' + showStatus + '</td><td>-</td><td>-</td></tr>';
                    tableData.append(tableRow);
                }
            }
        }).done(function() {
            loading.hide();
        }).fail(function() {
            console.log("Could not get shows.");
            var errorRow = '<tr id="error"><td colspan="7" style="text-align: center;"><img src="http://cdn.bierdopje.eu/g/s/sadley.gif" style="vertical-align: middle;" />&nbsp;&nbsp;&nbsp;<span style="vertical-align: middle;">Er is een fout opgetreden.</span></td></tr>';
            loading.after(errorRow);
            loading.hide();
        });
        
        tableData.append(tableEnd);
    }
    
    function startsWith(str, prefix) {
        // Special
        if (prefix === "0") {
            if (!isNaN(+str.charAt(0))) {
                return str;
            }
        }
        
        str = str.toLowerCase();
        prefix = prefix.toLowerCase();
        
        if (str.indexOf(prefix) === 0) {
            return str;
        }
        return "";
    }
    
    function addLetterPagination(prefix) {
        var letterArray = ["0-9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "Alle"];
        $.each(letterArray, function(index, value) {
            // Handle specials
            if (index === 0) {
                if (prefix === "0") {
                    prefix = letterArray[0];
                    letterPaginationData.append('<li class="active">' + prefix + '</li>');
                } else {
                    letterPaginationData.append('<li><a href="/shows/finished/0">' + letterArray[0] + '</a></li>');
                }
            } else if (index === letterArray.length - 1) {
                if (!prefix) {
                    letterPaginationData.append('<li class="active">' + letterArray[index] + '</li>');
                } else {
                    letterPaginationData.append('<li><a href="/shows/finished/">' + letterArray[index] + '</a></li>');
                }
            } else {
                if (value === prefix) {
                    letterPaginationData.append('<li class="active">' + value.toUpperCase() + '</li>');
                } else {
                    letterPaginationData.append('<li><a data-letterpage="' + value + '" class="changeLetterPage" href="/shows/finished/' + value + '">' + value.toUpperCase() + '</a></li>');
                }
            }
        });
    }
    
    function addPagination(prefix, pages) {
        var FIRST_LAST_ITEMS = Math.round(PAGINATION_ITEMS / 2);
            
        // First FIRST_LAST_ITEMS pages
        for (var i = 1; i <= FIRST_LAST_ITEMS; i++) {
            if (i <= pages) {
                addPaginationItem(prefix, i);
            } else {
                break;
            }
        }

        // Middle block
        if (pages > PAGINATION_ITEMS) {
            if ((currentPage - 1) >= PAGINATION_ITEMS) {
                paginationData.append('<li class="spacer">...</li>');
            }
            for (var i = (currentPage - FIRST_LAST_ITEMS) + 1 ; i < (currentPage + FIRST_LAST_ITEMS); i++) {
                if (i > FIRST_LAST_ITEMS && i < (pages - FIRST_LAST_ITEMS) + 1) {
                    addPaginationItem(prefix, i);
                }
            }

            if ((currentPage) <= (pages - PAGINATION_ITEMS)) {
                paginationData.append('<li class="spacer">...</li>');
            }
        }

        // Last FIRST_LAST_ITEMS pages
        for (var i = (pages - FIRST_LAST_ITEMS) + 1; i <= pages; i++) {
            if (i >= FIRST_LAST_ITEMS + 1) {
                addPaginationItem(prefix, i);
            }
        }

        paginationData.append(paginationEnd);
        paginationData.after(clear);
        startShowTable.after(paginationData.clone());
    }
    
    function addPaginationItem(prefix, i) {
        if (i === currentPage) {
            paginationData.append('<li class="active">' + i + '</li>');
        } else {
            if (prefix) {
                paginationData.append('<li><a data-page="' + i + '" class="changePage" href="/shows/finished/' + prefix + '/page/' + i + '">' + i + '</a></li>');
            } else {
                paginationData.append('<li><a data-page="' + i + '" class="changePage" href="/shows/finished/page/' + i + '">' + i + '</a></li>');
            }
        }
    }
});
