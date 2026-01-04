// ==UserScript==
// @name         1337x Magnet to RD - WF
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Gets all magnet links and creates a one-click button for RD conversion. Must be logged into RD
// @author       ME
// @match        https://www.1377x.to/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/389799/1337x%20Magnet%20to%20RD%20-%20WF.user.js
// @updateURL https://update.greasyfork.org/scripts/389799/1337x%20Magnet%20to%20RD%20-%20WF.meta.js
// ==/UserScript==

jQuery(function($) {
    'use strict';

    var url = 'https://real-debrid.com/torrents';
    function createRDForm(magnet_url){
        return $('<form action="' + url + '" method="post" target="_blank">' +
                 '<input type="hidden" name="magnet" value="' + magnet_url + '" />' +
                 '<input type="hidden" name="split" value="2000" />' +
                 '<input type="hidden" name="hoster" value="rd" />' +
                 '<input value="RD Convert &raquo;" type="submit" style="font-size:10px; background:green; color:white; border:0; cursor:pointer;" />' +
                 '</form>');
    }

    // Look through entire search list and create RD convert links
    $('a[href^="/torrent"]').each(function(){
        var link = $(this).attr('href');
        //var new_elem = $('<div>');
        //$(this).after( new_elem.load( link + " a[href^=magnet]:first" ) );
        //var form = createRDForm( new_elem.children('a').attr('href') );
        var $list_item = $(this);
        //new_elem.after(form);

        $.get({
            url: link,
            success: function(res) {
                var data = $.parseHTML(res);
                $(data).find('a[href^=magnet]:first').each(function(){
                    var form = createRDForm( $(this).attr('href') );
                    $list_item.after(form);
                });
            }
        });
    })

    // Add form to all magnet links
    $('a[href^=magnet]').each(function(){
        var form = createRDForm( $(this).attr('href') );
        $(this).after(form);
    });


    //    $( document ).ready(function() {
    //        if ( $('#submit_files').length ) {
    //            $('#submit_files').click();
    //        }
    //    });
})();