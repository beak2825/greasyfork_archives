// ==UserScript==
// @name         Confluence Auto Numbered Headings
// @namespace    https://gist.github.com/elahd/28f64feddd9ece56f4f0566d195d0cbd
// @version      0.7
// @description  Adds numbered headings button to the page editor in Atlassian Confluence. Based on work by Markus Jenu at https://community.atlassian.com/t5/Confluence-questions/Is-it-possible-to-add-numbering-to-headings-in-Confluence/qaq-p/315517#M87046.
// @author       Elahd Bar-Shai
// @match        https://*.atlassian.net/wiki/spaces/*
// @match        https://*.atlassian.net/wiki/spaces/*
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381252/Confluence%20Auto%20Numbered%20Headings.user.js
// @updateURL https://update.greasyfork.org/scripts/381252/Confluence%20Auto%20Numbered%20Headings.meta.js
// ==/UserScript==



(function() {
    'use strict';

    var jQuery = window.jQuery;
    var old_conf;

    function addIndex() {
        var indices = [];

        if (old_conf) {
            jQuery("#wysiwygTextarea_ifr").contents().find("h1,h2,h3,h4,h5,h6").each(function(i,e) {
                var hIndex = parseInt(this.nodeName.substring(1)) - 1;
                if (indices.length - 1 > hIndex) {
                    indices= indices.slice(0, hIndex + 1 );
                }
                if (indices[hIndex] == undefined) {
                    indices[hIndex] = 0;
                }
                indices[hIndex]++;
                jQuery(this).html(indices.join(".")+". " + removeNo(jQuery(this).html()));
            });
        } else {
            jQuery(".ak-editor-content-area .ProseMirror").find("h1,h2,h3,h4,h5,h6").each(function(i,e) {
                var hIndex = parseInt(this.nodeName.substring(1)) - 1;
                if (indices.length - 1 > hIndex) {
                    indices= indices.slice(0, hIndex + 1 );
                }
                if (indices[hIndex] == undefined) {
                    indices[hIndex] = 0;
                }
                indices[hIndex]++;
                jQuery(this).html(indices.join(".")+". " + removeNo(jQuery(this).html()));
            });
        }
    }

    function removeNo(str) {
        let newstr = str.trim();
        newstr = newstr.replace(/[\u00A0\u1680​\u180e\u2000-\u2009\u200a​\u200b​\u202f\u205f​\u3000]/g,' ');
        if(IsNumeric(newstr.substring(0,newstr.indexOf(' ')))){
            return newstr.substring(newstr.indexOf(' ')+1).trim();
        }
        return newstr;
    }

    function IsNumeric(num) {
        num = num.split('.').join("");
        return (num >=0 || num < 0);
    }

    function createButton () {
        old_conf = jQuery('.ProseMirror').length == 0 ? true : false;

        if (old_conf) {
            window.AJS.toInit(() => {
                jQuery('#rte-toolbar > div.aui-toolbar2-primary.toolbar-primary').append('<ul class="aui-buttons rte-toolbar-group-link"><li class="toolbar-item" data-tooltip="Auto-Number Headings" id="addIndex"><a class="toolbar-trigger aui-button aui-button-subtle" href="#" ><span class="aui-icon aui-icon-small aui-iconfont-table-of-contents">Auto-Number Headings</span></a></li></ul>')
                jQuery("#addIndex").click(function(e) {
                    e.preventDefault();
                    addIndex();
                });
            });
        } else {
            jQuery('.sc-kafWEX.eAQEwn > span').last().after('<span class="sc-jTzLTM jzOOfP"><div><div class="sc-cIShpX hVLmrw"><button aria-haspopup="false" class="css-1k4akzn" type="button" tabindex="0" id="addIndex" style="align-items:center"><span class="css-1ujqpe8"><span role="img" aria-label="Action item" class="css-1e9p0wv"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list-stars" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"/><path d="M2.242 2.194a.27.27 0 0 1 .516 0l.162.53c.035.115.14.194.258.194h.551c.259 0 .37.333.164.493l-.468.363a.277.277 0 0 0-.094.3l.173.569c.078.256-.213.462-.423.3l-.417-.324a.267.267 0 0 0-.328 0l-.417.323c-.21.163-.5-.043-.423-.299l.173-.57a.277.277 0 0 0-.094-.299l-.468-.363c-.206-.16-.095-.493.164-.493h.55a.271.271 0 0 0 .259-.194l.162-.53zm0 4a.27.27 0 0 1 .516 0l.162.53c.035.115.14.194.258.194h.551c.259 0 .37.333.164.493l-.468.363a.277.277 0 0 0-.094.3l.173.569c.078.255-.213.462-.423.3l-.417-.324a.267.267 0 0 0-.328 0l-.417.323c-.21.163-.5-.043-.423-.299l.173-.57a.277.277 0 0 0-.094-.299l-.468-.363c-.206-.16-.095-.493.164-.493h.55a.271.271 0 0 0 .259-.194l.162-.53zm0 4a.27.27 0 0 1 .516 0l.162.53c.035.115.14.194.258.194h.551c.259 0 .37.333.164.493l-.468.363a.277.277 0 0 0-.094.3l.173.569c.078.255-.213.462-.423.3l-.417-.324a.267.267 0 0 0-.328 0l-.417.323c-.21.163-.5-.043-.423-.299l.173-.57a.277.277 0 0 0-.094-.299l-.468-.363c-.206-.16-.095-.493.164-.493h.55a.271.271 0 0 0 .259-.194l.162-.53z"/></svg></span></span></button></div></div></span>');
            jQuery("#addIndex").click(function(e) {
                e.preventDefault();
                addIndex();
            });
        }
    }

    // Wait for editor to load before creating button.
    //LEGACY EDITOR
    waitForKeyElements ("form#editpageform.editor.aui", createButton); //For editing existing pages.
    waitForKeyElements ("form#createpageform.editor.aui", createButton); //For creating new pages.

    //NEW EDITOR
    waitForKeyElements (".sc-kafWEX.eAQEwn", createButton);

})();