/*===========================================================================*\
|  The Amazon Review Tabulator - TART                                         |
|      (c) 2016-17 by Another Floyd                                           |
|  From your "Public Reviews Written by You" page on Amazon, this script      |
|  collects and tabulates vote tallies and related information, from all of   |
|  your Amazon reviews. Click the "Tabulate" link in the "Your Profile"       |
|  panel. Click the heart icon, for options.                                  |
\*===========================================================================*/

// ==UserScript==
// @name           The Amazon Review Tabulator - TART
// @namespace      floyd.scripts
// @version        1.5.7
// @author         Another Floyd at Amazon.com
// @description    Lists all of your reviews with vote and comment tallies, with updates highlighted
// @include        https://*amazon.com/gp/cdp/member-reviews*
// @include        https://*amazon.co.uk/gp/cdp/member-reviews*
// @include        https://*amazon.ca/gp/cdp/member-reviews*
// @include        https://*amazon.com.au/gp/cdp/member-reviews*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @grant          GM_log
// @grant          GM_openInTab
// @grant          GM_info
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @require        https://greasyfork.org/scripts/20744-sortable/code/sortable.js?version=132520
// @require        https://openuserjs.org/src/libs/sizzle/GM_config.js
// @icon           data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/24434/The%20Amazon%20Review%20Tabulator%20-%20TART.user.js
// @updateURL https://update.greasyfork.org/scripts/24434/The%20Amazon%20Review%20Tabulator%20-%20TART.meta.js
// ==/UserScript==

// Start

(function() {

    var showUpdatesOnly = false;
    var primaryDisplayBuffer = "";
    var updateDisplayBuffer = "";
    var oldTARTstats = [];

    var userID = "";
    var reviewCount = 0;
    var reviewerRanking = ""; // no longer used, but kept to avoid error-prone mods to newTARTstats and oldTARTstats structure
    var helpfulVotes = 0;

    var oldStoreItemIDs = [];
    var oldStoreUpvotes = [];
    var oldStoreDownvotes = [];
    var oldStoreComments = [];

    var newStoreItemIDs = "";
    var newStoreUpvotes = "";
    var newStoreDownvotes = "";
    var newStoreComments = "";

    var tallyWordcount = 0;
    var tallyUpvotes = 0;
    var tallyDownvotes = 0;
    var tallyAllvotes = 0;
    var tallyStars = 0;
    var tallyComments = 0;
    var tallyAVP = 0;
    var tallyVine = 0;

    // use this reference for progress indicator
    var profileDiv = "";
    var profileDivOriginalHTML = "";
    var profileDivTabulateHTML = "<br></br><a href='javascript:tabulate();'>Tabulate</a> <a href='javascript:options();' title='Click for TART options' style='text-decoration:none;font-size:135%;font-weight:bold'>" + String.fromCharCode(9829) + "</a>";

    function assembleDisplayBuffers (completeSetOfTableRows, reviewsProcessed) {

        var today = new Date();
        var formattedToday = today.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
        var toggleLink = (GM_config.get('DisplayMode')) ? "<p><a href='javascript:toggleView();'>Toggle View: All Reviews | Updates Only</a>" : "";
        var bMargin = (GM_config.get('FixedFooter')) ? "36" : "0";
        var upvoteReviewRatio = (helpfulVotes/reviewCount).toFixed(2);

        // set up top of display page
        primaryDisplayBuffer = "<!DOCTYPE html><html lang='en'>" +
            "<head><meta charset='utf-8'/><title>TART Amazon Review Details</title>" +
            "<style type='text/css'>" +
            "body {font-family:Arial,sans-serif;font-size:" + GM_config.get('FontSize') + "px; margin:0; padding:0px 5px}" +
            ".tg  {border-collapse:collapse;border-spacing:0;width:100%}" +
            ".tg td{padding:" + GM_config.get('RowPadding') + "px 4px; border-style:solid; border-width:1px; overflow:hidden; word-break:normal; font-size:" + GM_config.get('FontSize') + "px; text-align:right}" +
            ".tg th{padding:" + GM_config.get('RowPadding') + "px 4px; border-style:solid; border-width:1px; overflow:hidden; word-break:normal; font-size:" + GM_config.get('FontSize') + "px; text-align:right; font-weight:bold; background-color:#010066; color:#ffffff}" +
            ".tg .cell-left{text-align:left}" +
            ".tg .hilite-left{text-align:left;background-color:#" + GM_config.get('HighliteColor') + "}" +
            ".tg .hilite-right{background-color:#" + GM_config.get('HighliteColor') + "}" +
            "#tblMain.hide7 tr td:nth-child(7), #tblMain.hide7 tr th:nth-child(7) {display: none}" +
            "#tblMain.hide10 tr td:nth-child(10), #tblMain.hide10 tr th:nth-child(10) {display: none}" +
            "#tblMain.hide11 tr td:nth-child(11), #tblMain.hide11 tr th:nth-child(11) {display: none}" +
            "#footer {position:fixed; bottom:0}" +
            "#footer.hide7 tr td:nth-child(7), #footer.hide7 tr th:nth-child(7) {display: none}" +
            "#footer.hide10 tr td:nth-child(10), #footer.hide10 tr th:nth-child(10) {display: none}" +
            "#footer.hide11 tr td:nth-child(11), #footer.hide11 tr th:nth-child(11) {display: none}" +
            ".txtLarge {font-size:18px;font-weight:bold}" +
            ".summaryLink, .summaryLink:link, .summaryLink:visited {text-decoration:none; font-weight:bold; color:#000000}" +
            ".tableLink, .tableLink:link, .tableLink:visited {text-decoration:none; font-weight:bold; font-size:110%; color:#000000}" +
            ".footerLink, .footerLink:link, .footerLink:visited {text-decoration:none; font-weight:bold; color:#FFFF12}" +
            "table.sortable th.sorted {background-color:#000000}" +
            "</style></head><body>" +
            "<span class='txtLarge'>Amazon Review Details</span><br>" +
            "Prepared with <a href='https://greasyfork.org/en/scripts/24434-the-amazon-review-tabulator-tart' target='_new'>TART " + GM_info.script.version + "</a> - " + formattedToday +
            "<p>Review Count: " + checkChange(reviewCount, oldTARTstats[6], false) + "<br>" +
            "Helpful Votes: " + checkChange(helpfulVotes, oldTARTstats[7], false) + "<br>" +
            "Upvote/Review Ratio: " + checkChange(upvoteReviewRatio, oldTARTstats[8], false) + toggleLink +
            "</p><table class='tg sortable' id='tblMain' style='margin-bottom:" + bMargin + "px'>" +
            "<thead><tr>" +
            "<th class='cell-left sort-number sort-default' style='width:6%'>#</th>" +
            "<th class='cell-left sort-text' style='width:33%'>Item</th>" +
            "<th class='cell-left sort-date' style='width:12%'>Date</th>" +
            "<th class='sort-number'>Stars</th>" +
            "<th class='sort-number'>Upvotes</th>" +
            "<th class='sort-number'>Downvotes</th>" +
            "<th class='sort-number'>All&nbsp;Votes</th>" +
            "<th class='sort-number'>%&nbsp;Helpful</th>" +
            "<th class='sort-number'>Comments</th>" +
            "<th class='sort-text' style='width:6%'>AVP</th>" +
            "<th class='sort-text' style='width:6%'>Vine</th>" +
            "</tr></thead><tbody>";

        // Column widths above are assigned to columns that have heading shorter than
        // data is likely to be; widths are duplicated at separate footer table, to keep
        // them all in sync

        updateDisplayBuffer = primaryDisplayBuffer; // both displays have same top section
        primaryDisplayBuffer += completeSetOfTableRows;

        // info needed in footer
        var calcStars = (tallyStars/reviewsProcessed).toFixed(1);
        var calcHelpfulPct = helpfulPercent(tallyUpvotes,tallyDownvotes);
        var avgWordsPerReview = (tallyWordcount/reviewsProcessed).toFixed(0);
        var newTARTstats = calcStars + " " + tallyUpvotes + " " + tallyDownvotes + " " + calcHelpfulPct + " " + tallyComments + " " + reviewerRanking + " " + reviewCount + " " + helpfulVotes + " " + upvoteReviewRatio + " " + tallyAllvotes + " " + tallyAVP + " " + tallyVine + " " + reviewsProcessed + " " + avgWordsPerReview;
        GM_setValue("recentFooterValues", newTARTstats.trim()); // write 'em with new values

        var visibleFooterRow = "<tr>" +
            "<th style='text-align:left'>" + checkChange(reviewsProcessed, oldTARTstats[12], true) + "</th>" +
            "<th style='text-align:left'>Average words per review: " + checkChange(avgWordsPerReview, oldTARTstats[13], true) + "</th>" +
            "<th></th>" +
            "<th>" + checkChange(calcStars, oldTARTstats[0], true) + "</th>" +
            "<th>" + checkChange(tallyUpvotes, oldTARTstats[1], true) + "</th>" +
            "<th>" + checkChange(tallyDownvotes, oldTARTstats[2], true) + "</th>" +
            "<th>" + checkChange(tallyAllvotes, oldTARTstats[9], true) + "</th>" +
            "<th>" + checkChange(calcHelpfulPct, oldTARTstats[3], true) + "</th>" +
            "<th>" + checkChange(tallyComments, oldTARTstats[4], true) + "</th>" +
            "<th>" + checkChange(tallyAVP, oldTARTstats[10], true) + "</th>" +
            "<th>" + checkChange(tallyVine, oldTARTstats[11], true) + "</th>" +
            "</tr>";

        // add footer either to be fixed at bottom of screen, or normal
        if(GM_config.get('FixedFooter')) {
            var hiddenRowForColumnWidths = "<tr style='visibility:hidden'>" +
            "<th style='width:6%; border-style: hidden'></th>" +
            "<th style='width:33%; border-style: hidden'></th>" +
            "<th style='width:12%; border-style: hidden'></th>" +
            "<th style='border-style: hidden'>Stars</th>" +
            "<th style='border-style: hidden'>Upvotes</th>" +
            "<th style='border-style: hidden'>Downvotes</th>" +
            "<th style='border-style: hidden'>All&nbsp;Votes</th>" +
            "<th style='border-style: hidden'>%&nbsp;Helpful</th>" +
            "<th style='border-style: hidden'>Comments</th>" +
            "<th style='width:6%; border-style: hidden'></th>" +
            "<th style='width:6%; border-style: hidden'></th></tr>";

            // create detached table for footer
            // fixed, by virtue of the styled 'footer' id
            primaryDisplayBuffer += "</tbody></table><table class='tg' id='footer' style='width:calc(100% - 10px)'><tfoot>" + hiddenRowForColumnWidths + visibleFooterRow + "</tfoot></table></body></html>"; 
        }
        else {
            primaryDisplayBuffer += "</tbody><tfoot>" + visibleFooterRow + "</tfoot></table></body></html>"; // normal
        }

        // get rows containing updated reviews, only
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = primaryDisplayBuffer;

        var findUpdateRows = document.evaluate("//td[@class='hilite-left']/..", tempDiv, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        for(var d = 0; d < findUpdateRows.snapshotLength; d++) {
            updateDisplayBuffer += findUpdateRows.snapshotItem(d).outerHTML;
        }
        updateDisplayBuffer += "</tbody></table></body></html>";
    }

    function tabulate() {

        // reset global accumulators to ensure that repeated script runs
        // (non-enhanced mode) remain clean
        newStoreItemIDs = "";
        newStoreUpvotes = "";
        newStoreDownvotes = "";
        newStoreComments = "";

        tallyWordcount = 0;
        tallyUpvotes = 0;
        tallyDownvotes = 0;
        tallyAllvotes = 0;
        tallyStars = 0;
        tallyComments = 0;
        tallyAVP = 0;
        tallyVine = 0;

        // read in stored info from past run, for use in change detection
        oldStoreItemIDs = GM_getValue("recentItemIDs", "").split(" ");
        oldStoreUpvotes = GM_getValue("recentUpvotes", "").split(" ");
        oldStoreDownvotes = GM_getValue("recentDownvotes", "").split(" ");
        oldStoreComments = GM_getValue("recentComments", "").split(" ");

        // prepare url with country domain and user ID, ready for review page number
        var tld = "com";
        var url = window.location.href;
        if(url.indexOf('amazon.co.uk/') > -1) tld = "co.uk";
        if(url.indexOf('amazon.ca/') > -1) tld = "ca";
        if(url.indexOf('amazon.com.au/') > -1) tld = "com.au";
        var urlStart = "https://www.amazon." + tld + "/gp/cdp/member-reviews/" + userID + "?ie=UTF8&display=public&page=";
        var urlEnd = "&sort_by=MostRecentReview";

        // space and counters for incoming data
        var perPageResponseDiv = [];
        var pageSetOfTableRows = [];
        var pageResponseCount = 0;
        var reviewsProcessed = 0;
        var pageCount = Math.floor(reviewCount / 10) + ((reviewCount % 10 > 0) ? 1 : 0);
        //var pageCount = 3; // for testing

        // initialize the progress indicator
        // sort of pre-redundant to do this here AND in the loop, but,
        // looks better, if there is a lag before the first response
        var progressHTML = "<br></br><b>" + pageCount + "</b>";
        profileDiv.innerHTML = profileDivOriginalHTML + progressHTML;

        // download and process Amazon pages
        var receivedPageWithNoReviews = false;
        var x = 1;
        while (x <= pageCount) {
            (function(x){
                var urlComplete = urlStart + x + urlEnd;
                perPageResponseDiv[x] = document.createElement('div');

                GM_xmlhttpRequest({
                    method: "GET",
                    url: urlComplete,
                    onload: function(response) {

                        // capture incoming data
                        perPageResponseDiv[x].innerHTML = response.responseText;
                        pageResponseCount++;

                        // update the progress indicator
                        var progressHTML = "<br></br><b>" + (pageCount - pageResponseCount) + "</b>";
                        profileDiv.innerHTML = profileDivOriginalHTML + progressHTML;

                        // get parent of any reviewText DIV
                        var findReviews = document.evaluate("//div[@class='reviewText']/..", perPageResponseDiv[x], null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null); // evaluating the doc DIV made above
                        var reviewsOnPage = findReviews.snapshotLength;
                        if(reviewsOnPage == 0) receivedPageWithNoReviews = true;

                        // process each review found on current page
                        pageSetOfTableRows[x] = ""; // initialize each member prior to concatenating

                        for (var j = 0; j < reviewsOnPage; j++) {

                            var oneReview = findReviews.snapshotItem(j);
                            var reviewChildren = oneReview.children;
                            var childCount = reviewChildren.length;

                            var commentCount = 0;
                            var itemTitle = "No Title Available";
                            var itemLink = "";
                            var permaLink = "";
                            var starRating = 0;
                            var reviewDate = "";
                            var upVotes = 0;
                            var downVotes = 0;
                            var totalVotes = 0;
                            var itemID = "";
                            var isAVP = 0;
                            var isVine = 0;

                            // get number of comments, and permalink
                            var tempText = reviewChildren[childCount-2].textContent;
                            if(tempText.indexOf('Comment (') > -1 || tempText.indexOf('Comments (') > -1) {
                                var paren1 = tempText.indexOf('(');
                                var paren2 = tempText.indexOf(')');
                                commentCount = tempText.substring(paren1+1,paren2);
                                commentCount = parseInt(commentCount.replace(/,/g, '')); // remove commas
                            }
                            var lst = reviewChildren[childCount-2].getElementsByTagName('a');
                            permaLink = lst[2].getAttribute("href");

                            // get review wordcount and add to tally
                            tempText = reviewChildren[childCount-3].textContent;
                            tallyWordcount += countWords(tempText);

                            // the data items below do not have reliable positions, due to presence
                            // or not, of vine voice tags, verified purchase, votes, etc.
                            // so, are done in a loop with IF checks. Must start loop just above review
                            // text, in case the reviewer has used any of the phrases I am searching for
                            for (var i = childCount - 4; i > -1; i--) {

                                var childHTML = reviewChildren[i].innerHTML;

                                // get item title and item link
                                var titleClue = childHTML.indexOf('This review is from');
                                if(titleClue > -1) {
                                    var lst = reviewChildren[i].getElementsByTagName('a');
                                    itemLink = lst[0].getAttribute("href");
                                    itemTitle = lst[0].textContent;
                                }

                                // get star rating AND review date
                                var ratingClue = childHTML.indexOf('out of 5 stars');
                                if(ratingClue > -1) {
                                    starRating = childHTML.substring(ratingClue-4,ratingClue-1);
                                    reviewDate = reviewChildren[i].lastElementChild.textContent;
                                    var lst = reviewDate.split(" ");
                                    reviewDate = lst[0].substring(0,3) + " " + lst[1] + " " + lst[2];
                                }

                                // get vote counts
                                var childText = reviewChildren[i].textContent;
                                var voteClue = childText.indexOf('people found the following review helpful');
                                if(voteClue > -1) {
                                    var list = childText.trim().split(" "); // there were extra, invisible spaces!
                                    upVotes = parseInt(list[0].replace(/,/g, '')); // remove commas
                                    totalVotes = parseInt(list[2].replace(/,/g, ''));
                                    downVotes = totalVotes - upVotes;
                                }

                                // check for AVP and Vine
                                var avpClue = childHTML.indexOf('Verified Purchase');
                                if(avpClue > -1) isAVP = 1;

                                var vineClue = childHTML.indexOf('Vine Customer Review');
                                if(vineClue > -1) isVine = 1;
                            }

                            // get item ID
                            var lst = oneReview.parentNode.getElementsByTagName('a');
                            itemID = lst[0].getAttribute("name");

                            // get HTML formatted table row; rows COULD be accumulated in
                            // preOneTableRow; but, since they come in page sets that may be
                            // received out of order, the non-enhanced view (which has no sort,
                            // thus no default sort) would appear out of order
                            pageSetOfTableRows[x] += prepOneTableRow((j+1+(x-1)*10),itemID,itemTitle,permaLink,reviewDate,starRating,upVotes,downVotes,commentCount,totalVotes,isAVP,isVine);

                            reviewsProcessed++; // more reliable than reviewCount, for calculating avg. rating
                        }

                        // clear the response, to save memory --
                        // could be critical when there are many review pages
                        perPageResponseDiv[x].innerHTML = "";

                        // see if all data from multiple page loads has arrived
                        if(pageResponseCount==pageCount) {

                            // assemble the sets of table rows, which will be in proper order
                            // rather than order received
                            var completeSetOfTableRows = "";
                            for(var y=1; y <= pageCount; y++) {
                                completeSetOfTableRows += pageSetOfTableRows[y];
                            }

                            assembleDisplayBuffers(completeSetOfTableRows, reviewsProcessed);

                            // store info to be used in subsequent run, for change detection
                            GM_setValue("recentItemIDs", newStoreItemIDs.trim());
                            GM_setValue("recentUpvotes", newStoreUpvotes.trim());
                            GM_setValue("recentDownvotes", newStoreDownvotes.trim());
                            GM_setValue("recentComments", newStoreComments.trim());

                            // replace progress indicator with Tabulate link
                            profileDiv.innerHTML = profileDivOriginalHTML + profileDivTabulateHTML;

                            // show message if any of the received pages contained NO reviews...
                            // SOMETHING was received -- an empty, error, or 'please try again' type page
                            if(receivedPageWithNoReviews) {
                                alert("A page or more of reviews was not received. \n\nReview the results, anyway, because any highlighted updates will not be highlighted in the next run. \n\nAlso, any reviews missing from the results will be highlighted in the next run, as 'new' reviews.");
                            }

                            // --- display the results
                            if(!GM_config.get('DisplayMode')) GM_openInTab("data:text/html," + encodeURIComponent(primaryDisplayBuffer));
                            else {
                                document.body.innerHTML = primaryDisplayBuffer;
                                manageColumns();
                            }
                        }
                    }
                });
            })(x);
            x++;
        }
    }

    function manageColumns() {
        if(!GM_config.get('ShowAllVotes')) {
            document.getElementById("tblMain").classList.toggle("hide7");
            if(!showUpdatesOnly) document.getElementById("footer").classList.toggle("hide7");
        }

        if(!GM_config.get('ShowAVP')) {
            document.getElementById("tblMain").classList.toggle("hide10");
            if(!showUpdatesOnly) document.getElementById("footer").classList.toggle("hide10");
        }

        if(!GM_config.get('ShowVine')) {
            document.getElementById("tblMain").classList.toggle("hide11");
            if(!showUpdatesOnly) document.getElementById("footer").classList.toggle("hide11");
        }
    }

    function countWords(s){ // from 'neokio' on StackOverflow
        s = s.replace(/\n/g,' '); // newlines to space
        s = s.replace(/(^\s*)|(\s*$)/gi,''); // remove spaces from start + end
        s = s.replace(/[ ]{2,}/gi,' '); // 2 or more spaces to 1
        return s.split(' ').length;
    }

    function invalidValue(oldStoredValue) {
        if(oldStoredValue === undefined || oldStoredValue == "?") return true;
        return false;
    }

    function checkChange(newStat,oldStat,forFooter) {
        if(newStat == oldStat || invalidValue(oldStat) === true) return newStat;
        else {
            var linkClass = "summaryLink";
            if(forFooter) linkClass = "footerLink";
            return "<a href='javascript: void(0)' class='" + linkClass + "' title='Previous: " + oldStat + "'>" + newStat + "</a>";
        }
    }

    function toggleView() {
        showUpdatesOnly = !showUpdatesOnly;
        if(showUpdatesOnly) document.body.innerHTML = updateDisplayBuffer;
        else document.body.innerHTML = primaryDisplayBuffer;
        manageColumns();
    }

    function helpfulPercent(upVotes,downVotes) {
        var helpfulPercent = "";
        upVotes = upVotes;
        downVotes = downVotes;
        if(upVotes + downVotes > 0) helpfulPercent = (upVotes/(upVotes+downVotes)*100).toFixed(1);

        return helpfulPercent;
    }

    function prepOneTableRow (row,itemID,itemTitle,permaLink,reviewDate,starRating,upVotes,downVotes,commentCount,totalVotes,isAVP,isVine) {

        // do these before mangling the values with <b> tags </b>
        var helpfulPct = helpfulPercent(upVotes,downVotes);
        itemTitle = "<a href='" + permaLink + "' target='_new'>" + itemTitle.substring(0,40) + "</a>";

        // keep tallies to use in table footer
        tallyUpvotes += upVotes;
        tallyDownvotes += downVotes;
        tallyAllvotes += totalVotes;
        tallyStars += parseInt(starRating);
        tallyComments += commentCount;
        tallyAVP += isAVP;
        tallyVine += isVine;

        // assemble storage info, to use in subsequent run, for change detection
        newStoreItemIDs += itemID + " ";
        newStoreUpvotes += upVotes + " ";
        newStoreDownvotes += downVotes + " ";
        newStoreComments += commentCount + " ";

        // see if review for this item has previously been examined
        var matchIdx = -1;
        for(var i=0; i<oldStoreItemIDs.length; i++) {
            if(oldStoreItemIDs[i] == itemID) {
                // we have a match, an item that has previously been seen
                matchIdx = i;
                break;
            }
        }

        var hiliteRow = false;
        if(matchIdx > -1) {
            // entry exists; see if any of the numbers have changed
            if(oldStoreUpvotes[matchIdx] != upVotes) {
                // for changed number, make it bold, and hilite row
                // and store previous value for display as tooltip, for mouse hover
                upVotes = "<a href='javascript: void(0)' class='tableLink' title='Previous: " + oldStoreUpvotes[matchIdx] + "'>" + upVotes + "</a>";
                hiliteRow = true;
            }
            if(oldStoreDownvotes[matchIdx] != downVotes) {
                downVotes = "<a href='javascript: void(0)' class='tableLink' title='Previous: " + oldStoreDownvotes[matchIdx] + "'>" + downVotes + "</a>";
                hiliteRow = true;
            }
            if(oldStoreComments[matchIdx] != commentCount) {
                commentCount = "<a href='javascript: void(0)' class='tableLink' title='Previous: " + oldStoreComments[matchIdx] + "'>" + commentCount + "</a>";
                hiliteRow = true;
            }
        }
        else {
            // no match, so, it's a new review; bold the title and hilite the row
            itemTitle = "<b>" + itemTitle + "</b>";
            hiliteRow = true;
        }

        var tdLeft = "<td class='cell-left'>";
        var tdRight = "<td>";
        if(hiliteRow===true && oldStoreItemIDs[0].length > 0) {
            tdLeft = "<td class='hilite-left'>";
            tdRight = "<td class='hilite-right'>";
        }

        var tableRow = "<tr>" + tdLeft + row + "</td>" + tdLeft + itemTitle + "</td>" + tdLeft + reviewDate + "</td>" + tdRight + starRating + "</td>" + tdRight + upVotes + "</td>" + tdRight + downVotes + "</td>" + tdRight + totalVotes + "</td>" + tdRight + helpfulPct + "</td>" + tdRight +commentCount + "</td>" + tdRight + ((isAVP > 0) ? "&bull;" : "") + "</td>" + tdRight + ((isVine > 0) ? "&bull;" : "") + "</td></tr>";

        return tableRow;
    }

    // create Options menu with GM_config

    var frame = document.createElement('div');
    document.body.appendChild(frame);
    GM_config.init(
    {
    'id': 'MyConfig', // The id used for this instance of GM_config
    'title': 'TART Options', // Panel Title

    'fields': // Fields object
        {
        'DisplayMode': // Line item
            {
            'type': 'checkbox',
            'label': 'Enhanced display (uncheck for new tab with fewer features)',
            'default': true
            },

        'FixedFooter':
            {
            'type': 'checkbox',
            'label': 'Show fixed footer at bottom of screen',
            'default': true
            },

        'ShowAllVotes':
            {
            'type': 'checkbox',
            'label': 'Show All Votes column',
            'default': true
            },

        'ShowAVP':
            {
            'type': 'checkbox',
            'label': 'Show AVP column',
            'default': true
            },

        'ShowVine':
            {
            'type': 'checkbox',
            'label': 'Show Vine column',
            'default': true
            },

        'FontSize':
            {
            'label': 'Text size',
            'type': 'unsigned int',
            'size': 2,
            'default': 12
            },

        'RowPadding':
            {
            'label': 'Row padding',
            'type': 'unsigned int',
            'size': 2,
            'default': 10
            },

        'HighliteColor':
            {
            'label': 'Highlight color (6-place hex code)',
            'title': 'From graphics program or online color picker',
            'type': 'text',
            'size': 6,
            'default': 'FFFF55'
            }
        },

    'events': // Callback functions object
        {
        'open': function() {
            // style the panel as it's being displayed
            frame.style.position = "auto";
            frame.style.width = "auto";
            frame.style.height = "auto";
            frame.style.backgroundColor = "#F3F3F3";
            frame.style.padding = "10px";
            frame.style.borderWidth = "5px";
            frame.style.borderStyle = "ridge";
            frame.style.borderColor = "gray";
            var x = (document.documentElement.clientWidth - frame.offsetWidth) / 2;
            frame.style.left = x + 'px';
            }
        },

    'frame': frame, // specify the DIV element used for the panel

    'css': '#MyConfig .config_header { font-size: 12pt; font-weight:bold; margin-bottom:12px }' +
           '#MyConfig .field_label { font-size: 12px; font-weight:normal; margin: 0 3px }'
    });

    // event listener to pick up mouse clicks, to run script functions

    document.addEventListener('click', function(event) {
        var tempstr = new String(event.target);
        var quash = false;

        if(tempstr.indexOf('tabulate') > -1) {
            tabulate();
            quash = true;
            }

        if(tempstr.indexOf('options') > -1) {
            GM_config.open();
            quash = true;
        }

        if(tempstr.indexOf('toggleView') > -1) {
            toggleView();
            quash = true;
        }

        if(quash) {
            event.stopPropagation();
            event.preventDefault();
        }
    }, true);

    // initiate the script

    function main() {

        var findProfileLink = "";
        var url = window.location.href;
        // read previous values for footer and top summary values
        oldTARTstats = GM_getValue("recentFooterValues", "? ? ? ? ? ? ? ? ? ? ? ? ? ?").split(" ");

        if(url.indexOf('amazon.com/') > -1) {
            // for Amazon US
            findProfileLink = document.evaluate("//b[contains(.,'Your Profile')]/a", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        }
        else {
            // Amazon UK, CA, AU
            findProfileLink = document.evaluate("//a[contains(.,'Customer reviews')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        }
        // and, the following lines are ok for US and UK, but, maybe not for others
        GM_log("Finding account info...");
        var profileLink = findProfileLink.snapshotItem(0).getAttribute("href");
        var lst = profileLink.split("/");
        userID = lst[4];
        GM_log("User ID: " + userID);

        // find profile info panel
        var findDiv = document.evaluate("//div[contains(.,'Helpful Votes')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        profileDiv = findDiv.snapshotItem(0);

        // get helpful votes
        var lst = profileDiv.textContent.split(" ");
        helpfulVotes = lst[3].substring(7);
        GM_log("Helpful Votes: " + helpfulVotes);

        // get review count
        var prevSibDiv = profileDiv.previousElementSibling;
        charIdx = prevSibDiv.textContent.lastIndexOf(':');
        reviewCount = prevSibDiv.textContent.substring(charIdx+2);
        // remove any commas, though has not been necessary w/thousands of reviews
        reviewCount = parseInt(reviewCount.replace(/,/g, ''));
        GM_log("Review Count: " + reviewCount);

        // add Tabulate link; also, save content for use with progress indicator
        profileDivOriginalHTML = profileDiv.innerHTML;
        profileDiv.innerHTML += profileDivTabulateHTML;

        // add delta symbol with mouseover note, if there are obvious new values to Tabulate
        // but, don't show delta on first run, which would have invalid comparison values
        if(helpfulVotes != oldTARTstats[7] && invalidValue(oldTARTstats[7]) === false) {
            profileDiv.innerHTML += " <a href='javascript: void(0)' style='text-decoration:none; color:#000000' title='Reviewer Ranking or Helpful Vote count has changed since last Tabulate run'>&#916;</a>";
        }
    }

    main();

})();
// End