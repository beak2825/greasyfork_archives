// ==UserScript==
// @name         GitLab Tweaks
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  change the list order in GitLab Issue Boards
// @author       Longbiao CHEN
// @match        gitlab.longbiaochen.com/*
// @grant        GM_addStyle
// @license      GPLv3
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/381897/GitLab%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/381897/GitLab%20Tweaks.meta.js
// ==/UserScript==


(function() {

    // open Finder for files
    $('.detail-page-header-actions.js-issuable-actions').append('<a id="open-folder" class="d-none d-sm-none d-md-block btn btn-grouped btn-primary btn-inverted js-btn-issue-action" title="Open folder" data-qa-selector="open_folder_button" rel="nofollow" data-method="" href="open-folder:///Users/longbiao/Documents/">Open folder</a>');
    $('#open-folder').attr('href', 'open-folder:///Users/longbiao/Documents/' + window.location.pathname.split('/')[2]);
    document.addEventListener('keydown', function(e) {
        if (e.keyCode == 70 && e.shiftKey && e.metaKey) {
            console.log('hello');
            $('#open-folder').trigger( "click" );
        }
    }, false);

    // issue board
    var p = $('div.project-title > h2 > a');
    for(var i = 0; i < p.length; i++){
        var pi = p[i];
        pi.href += '/-/boards?key=1';
    }

    var p = $('div.namespace-title > a');
    for(var i = 0; i < p.length; i++){
        var pi = p[i];
        pi.href += '/-/boards?key=2';
    }


    var p = $('div.d-flex.align-items-center.flex-wrap.title.namespace-title.append-right-8 > a');
    for(var i = 0; i < p.length; i++){
        var pi = p[i];
        console.log(pi.href);
        pi.href += '/-/boards?key=3';

    }

    var p = $('.shortcuts-issues');
    for(var i = 0; i < p.length; i++){
        var pi = p[i];
        pi.href = pi.href.replace('/issues', '/boards');
    }
    $('#content-body > aside > div > div > a > i.fa-angle-double-right').click();

    // navigation buttons
    $('#nav-groups-dropdown > button').click(function(e){
        window.location.href = "/dashboard/groups?sort=name_asc";
    });

    $('a#logo').attr('href', '/dashboard/projects/starred?sort=name_asc');

    // wiki page
    $('body > div.layout-page.page-gutter.page-with-contextual-sidebar.right-sidebar-expanded.wiki-sidebar').attr('class','layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed wiki-sidebar');
    $('aside.wiki-sidebar').attr('class', 'right-sidebar right-sidebar-collapsed wiki-sidebar js-wiki-sidebar js-right-sidebar');

    $('#filtered-search-issues').focus();

    $(document).on('dblclick', '.timeline-entry-inner', function(e){
        $('.qa-note-edit-button', this).click();
    });

})();