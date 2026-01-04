// ==UserScript==
// @name         Copy Rally Link
// @namespace    http://www.sdl.com
// @version      0.4
// @description  Script that adds various utilities to Rally (CA Agile).
// @author       You
// @match        https://rally1.rallydev.com
// @grant    GM_setClipboard
// @run-at document-end
// @updateUrl https://greasyfork.org/scripts/405631-copy-rally-link/code/Copy%20Rally%20Link.user.js

// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/405631/Copy%20Rally%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/405631/Copy%20Rally%20Link.meta.js
// ==/UserScript==


'use strict';

// add copy link buttons in every row

let mList = $('body')[0],
    options = {
        childList: true,
        subtree: true
    },
    observer = new MutationObserver(onMutationObserved);

observer.observe(mList, options);

function onMutationObserved(mutations) {
    for (let mutation of mutations) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(function(currentValue, currentIndex, listObj) {

                if (currentValue.tagName == "TR" && currentValue.classList.contains('smb-TableRow')){
                    addCopyLinkButton(currentValue);
                }
                else if (currentValue.tagName == "DIV" && currentValue.classList.contains('chr-DataTableWithToolbar')){
                    addDataTableToolbarButtons();
                }
                else if (currentValue.tagName == "DIV" && currentValue.classList.contains('chr-FullDetailPage')){
                    addFullDetailsPageButton(currentValue);
                }
            });
        }
    }
}

function addCopyLinkButton(row){
    // find id and link
    var idCell = getIdCell(row);
    if (!idCell){
        return;
    }

    var idAnchor = getIdAnchor(idCell);

    var linkSnippet = getLinkSnippet(row);

    $(idAnchor).after(shareIconHtml);

    $(idAnchor).next().click(function() {
        console.log("Copying link...");
        GM_setClipboard(linkSnippet, 'html');
        console.log("Link copied to clipboard.");
    });
}

function addFullDetailsPageButton(){
    if ($("#copyLinkButton").length>0){
        // button already added
        console.log("Buttons already added.");
        return;
    }
    console.log("BEGIN addFullDetailsPageButton");

    var toolbarSection = $(".chr-QuickDetailEntityHeader-buttons").last();

    $(toolbarSection).prepend(copyLinkButtonHtml);
    var button = $(toolbarSection).children().first();

    button.click(function() {
        copyLink();
    });

    console.log("END addFullDetailsPageButton");
}

function addDataTableToolbarButtons(){
    if ($("#copyTableButton").length>0){
        // button already added
        console.log("Buttons already added.");
        return;
    }
    console.log("BEGIN addDataTableToolbarButtons");

    var toolbarSection = $(".smb-HeaderGroupContainer--right").last();


    $(toolbarSection).prepend(copyAllLinksButtonHtml);
    var button = $(toolbarSection).children().first();

    button.click(function() {
        copyAllLinks();
    });

    $(toolbarSection).prepend(copyTableButtonHtml);
    var button2 = $(toolbarSection).children().first();

    button2.click(function() {
        copyTable();
    });

    console.log("END addDataTableToolbarButtons");
}

function getIdCell(row){
    return $(row).find('.smb-TableCell--formattedID')[0];
}

function getIdAnchor(idCell){
    return $(idCell).find('a')[0];
}

function getRallyUrl(idAnchor){
return 'https://rally1.rallydev.com/' + idAnchor.getAttribute('href');
}

function getId(row){
    var idCell = getIdCell(row);

    var a = getIdAnchor(idCell);
    return $(a).find('.chr-FormattedId-idText')[0].innerText;
}

function getJiraId(row){
    var c = $(row).find('.smb-TableCell--cJiraID');

    if (c.length == 0){
        return null;
    }

    var jiraIdCell = c[0];

    return $(jiraIdCell).text();
}

function getName(row){
    var nameCell = $(row).find('.smb-TableCell--name')[0];
    return $(nameCell).find('.smb-TableCell-renderContent')[0].innerText;
}

function getLinkSnippet(row){
    var idCell = getIdCell(row);

    var idAnchor = getIdAnchor(idCell);

    var link =  getRallyUrl(idAnchor);
    var idText = getId(row);

    // find name
    var name = getName(row);

    var jiraId = getJiraId(row);

    var linkSnippet = "<a href='" + link + "'>" + idText + " - " + name + "</a>";
    if (jiraId != null){
        linkSnippet += " (<a href='https://jira.sdl.com/browse/" + jiraId + "'>" + jiraId + "</a>)";
    }

    return linkSnippet;
}

function copyLink() {
    console.log("Copying link...");
    var html = "";

    var id = $(".chr-QuickDetailFormattedId-panelTitle").text();
    var name = $(".chr-QuickDetailAttributeEditorWrapper--name").text();

    var relativeRallyUrl = $(".chr-EditorsEntityCollectionBar-collectionLink")[0].getAttribute("href");
    var rallyUrl = 'https://rally1.rallydev.com/' + relativeRallyUrl;
    var jiraId = $(".chr-QuickDetailAttributeEditorWrapper--cJiraID").find("input").val();

    var html = "<a href='" + rallyUrl + "'>" + id + " - " + name + "</a>";

    if (jiraId && jiraId.length > 0){
        html += " (<a href='https://jira.sdl.com/browse/" + jiraId + "'>" + jiraId + "</a>)";
    }

    GM_setClipboard(html, 'html');
    console.log("Link copied to clipboard.");
}



function copyAllLinks() {
    console.log("Copying links...");
    var html = "";
    var onlySelected = hasSelectedItems();
    if (onlySelected){
        console.log("Copying selected links...");
    }
    else{
        console.log("Copying all links...");
    }
    $(".smb-TableRow").each(function(index){
        if (!onlySelected || $(this).find(".smb-Checkbox.is-checked").size() > 0){
            html += getLinkSnippet(this) + "<br/>";

        }
    });
    GM_setClipboard(html, 'html');
    console.log("Links copied to clipboard.");
}

function copyTable() {
    console.log("Copying table...");
    var onlySelected = hasSelectedItems();
    var tableHtml = "<table>";

    var headerRow = $(".smb-DataTable-headerRow")[0];
    var headerRowHtml = "<tr>";
    var significantColumnIndexes = [];

    $(headerRow).find(".smb-TableHeaderCell").each(function(index){
        var text = this.innerText;
        if (text.length != 0){
            // add column header
            headerRowHtml += "<th>" + text + "</th>";
            significantColumnIndexes.push(true);

            if (this.getAttribute("aria-label") == "ID"){
                // add extra link column
                headerRowHtml += "<th>Link</th>";
            }

        }
        else{
            // skip column
            significantColumnIndexes.push(false);
        }
    });
    headerRowHtml += "</tr>";
    tableHtml += headerRowHtml;


    $(".smb-TableRow").each(function(index){
        if (!onlySelected || $(this).find(".smb-Checkbox.is-checked").size() > 0){
            var row = this;
            var rowHtml = "<tr>";
            $(this).find(".smb-TableCell").each(function(index){

                if (significantColumnIndexes[index]){
                    if (this.classList.contains("smb-TableCell--formattedID")){
                        // add link + text
                        rowHtml += "<td>" + this.innerText + "</td>"
                            + "<td>" + getLinkSnippet(row) + "</td>";
                    }
                    else{
                        // just add text
                        rowHtml += "<td>" + this.innerText + "</td>";
                    }
                }
            });
            rowHtml += "</tr>";
            tableHtml += rowHtml;
        }
    });
    tableHtml += "</table>";
    GM_setClipboard(tableHtml, 'html');
    //GM_setClipboard(tableHtml, 'text');
    console.log("Table copied to clipboard.");
}

function hasSelectedItems(){
    return $(".smb-DataTable").find(".smb-Checkbox.is-checked").size() > 0;
}

var shareIconHtml = `<span style="width:16px;height:16px;vertical-align: middle;padding-left:3px;margin-top:2px;cursor:pointer" title="Copy link"><svg width="16px"  height="16px" viewBox="0 0 44 44" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 49.2 (51160) - http://www.bohemiancoding.com/sketch -->
    <title>Share</title>
    <desc>Created with Sketch.</desc>
    <defs></defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Social-Icons---Isolated" transform="translate(-54.000000, -393.000000)" fill="#4A4A4A">
            <path d="M61.855,422.51 C63.681,422.51 65.363,421.885 66.697,420.838 L81.603,428.197 C81.603,428.227 81.601,428.254 81.601,428.283 C81.601,432.621 85.119,436.139 89.457,436.139 C93.794,436.139 97.312,432.621 97.312,428.283 C97.312,423.946 93.794,420.428 89.457,420.428 C87.148,420.428 85.074,421.422 83.638,423.006 L69.582,416.067 C69.664,415.61 69.71,415.139 69.71,414.656 C69.71,414.559 69.707,414.463 69.703,414.367 L84.244,406.731 C85.632,407.961 87.457,408.711 89.457,408.711 C93.796,408.711 97.312,405.194 97.312,400.856 C97.312,396.516 93.794,393 89.457,393 C85.119,393 81.601,396.516 81.601,400.856 C81.601,401.18 81.625,401.498 81.662,401.811 L67.533,409.231 C66.103,407.735 64.089,406.801 61.855,406.801 C57.517,406.801 54,410.319 54,414.656 C54,418.994 57.517,422.51 61.855,422.51" id="Share"></path>
        </g>
    </g>
</svg></span>`;

var copyAllLinksButtonHtml = `<div style="height:100%" id="copyAllLinksButton"><button style="height:100%" aria-label="Copy Links" class="smb-Button smb-Button--secondary smb-Button--xs" type="button"  title="Copy links to all or selected items"">
   <div class="smb-Button-contents">
      <span class="smb-Button-children">Copy Links</span>
   </div>
</button></div>`;

var copyTableButtonHtml = `<div style="height:100%" id="copyTableButton"><button style="height:100%" aria-label="Copy Table" class="smb-Button smb-Button--secondary smb-Button--xs" type="button" title="Copy table with all or selected items">
   <div class="smb-Button-contents">
      <span class="smb-Button-children">Copy Table</span>
   </div>
</button></div>`;

var copyLinkButtonHtml = `<div style="height:100%" id="copyLinkButton"><button style="height:100%" aria-label="Copy Link" class="smb-Button smb-Button--secondary smb-Button--xs" type="button"  title="Copy link"">
   <div class="smb-Button-contents">
      <span class="smb-Button-children">Copy Link</span>
   </div>
</button></div>`;
