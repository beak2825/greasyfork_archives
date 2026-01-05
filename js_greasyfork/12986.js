// ==UserScript==
// @name         Link Dumper
// @version      0.21
// @description  Dumps links on page into a text box
// @author       You
// @match        http://manga.madokami.com/*
// @grant        GM_addStyle
// @include      https://code.jquery.com/jquery-2.1.4.min.js
// @namespace https://greasyfork.org/users/11676
// @downloadURL https://update.greasyfork.org/scripts/12986/Link%20Dumper.user.js
// @updateURL https://update.greasyfork.org/scripts/12986/Link%20Dumper.meta.js
// ==/UserScript==

GM_addStyle ("#linkDump,#linkDumpVisibilityTab{position:fixed;bottom:0;background-color:#fff}#linkDumpVisibilityTab{right:250px;height:25px;width:auto;padding-left:5px;padding-right:5px;border-top-left-radius:10px;border-top-right-radius:10px;color:#000;cursor:pointer;justify-content:center;align-items:center;display:flex}#linkDump{right:0;height:200px;width:500px;padding:15px}#linkDumpFilterList li{width:auto;display:inline}#linkTextArea{height:100%;width:100%;resize:none;color:#000;white-space:nowrap}");
/**
 * function to load a given css file
 */
addCSS = function(href) {
    var cssLink = $("<link rel='stylesheet' type='text/css' href='"+href+"'>");
    $("head").append(cssLink);
};

/**
 * function to load a given css file
 */
addHTML = function(html) {
    $("body").append(html);
};

gatherLinks = function(baseUrl) {
    var links = [];
    var link = "";
    $("a").each(function(){
        link = $(this).attr("href");
        if(link.charAt(0) === "/"){
            link = baseUrl + link;
        }
        links.push(link);
    });
    return links;
};

$(document).ready(function(){
    
    
    addHTML("<div id=\"linkDumpVisibilityTab\">Show</div><div id=\"linkDump\"> <div id=\"linkDumpFilter\"> <ul id=\"linkDumpFilterList\"> <li><input type=\"radio\" name=\"linkDumpFilter\" value=\"none\" checked=\"checked\">None</li><li><input type=\"radio\" name=\"linkDumpFilter\" value=\"archives\">Archives</li><li><input type=\"radio\" name=\"linkDumpFilter\" value=\"images\">Images</li></ul> </div><textarea id=\"linkTextArea\" wrap=\"soft\"></textarea></div>");
    //addCSS("linkDump.css");

    var mainUrl = location.origin;    

    var $ui = $("#linkDump");
    $ui.hide();

    var $uiTab = $("#linkDumpVisibilityTab");
    $uiTab.data("toggled", false);
    
    var $uiTextBox = $("#linkTextArea");

    var pageLinks = gatherLinks(mainUrl);
    var filteredPageLinks = pageLinks;
    
    refreshTextBox = function(links){
        if (typeof links === "undefined"){
            $uiTextBox.text(filteredPageLinks.join("\n"));
            $uiTab.text("Show (" + filteredPageLinks.length + ")");
        }
        else{
            $uiTextBox.text(links.join("\n"));
            $uiTab.text("Show (" + links.length + ")");
        }
            
    };
    refreshTextBox();

    $uiTab.click(function(){
        if($(this).data("toggled")){
            $(this).animate({
                bottom: "-=200"
            });
            $uiTab.data("toggled", false);
            $uiTab.text("Show (" + pageLinks.length + ")");
        }
        else {
            $(this).animate({
                bottom: "+=200"
            });
            $uiTab.data("toggled", true);
            $uiTab.text("Hide (" + pageLinks.length + ")");
        }
        $ui.slideToggle();
    });
    
    $("input[name='linkDumpFilter']").click(function(){
        var resLinks = [];
        var regEx;
        
        if($(this).val() === "none"){
            filteredPageLinks = pageLinks;
            refreshTextBox();
            return;
        }
        else if($(this).val() === "archives"){
            regEx = new RegExp(".*\\.((?:zip)|(?:rar)|(?:cb.)|(?:7z)|(?:tar(?:\\.xz)?))");
        }
        else if($(this).val() === "images"){
            regEx = new RegExp(".*\\.((?:jpeg)|(?:jpg)|(?:png)|(?:gif)|(?:tif)|(?:tiff))");
        }
        var currLink = "";
        for(var i=0;i< pageLinks.length;i++){
            currLink = pageLinks[i];
            if(regEx.test(currLink)){
               resLinks.push(currLink);
            }
        }
        filteredPageLinks = resLinks;
        refreshTextBox();
    });
    
    applySecondaryFilter = function(filter){
        var resLinks = [];
        var regEx = new RegExp(filter);
        
        var currLink = "";
        for(var i=0;i< filteredPageLinks.length;i++){
            currLink = filteredPageLinks[i];
            if(regEx.test(currLink)){
               resLinks.push(currLink);
            }
        }
        refreshTextBox(resLinks);
    };
});