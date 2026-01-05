// ==UserScript==
// @name         Confluence - Open editor inside main view (keep sidebar)
// @namespace    http://netresearch.de/
// @version      0.2
// @description  Open editor inside main view when creating and editing pages (known bug: when page creation requires multiple steps, the resulting page will be opened without the page tree)
// @author       Christian Opitz
// @include      *.atlassian.net/wiki/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/22249/Confluence%20-%20Open%20editor%20inside%20main%20view%20%28keep%20sidebar%29.user.js
// @updateURL https://update.greasyfork.org/scripts/22249/Confluence%20-%20Open%20editor%20inside%20main%20view%20%28keep%20sidebar%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    AJS.toInit(function(){
        var $ = AJS.$;
        //AJS.whenIType("c").execute(function(e) { // Don't know how to stop further execution/propagation with that
        $(document).bind('keydown', 'c', function(e) {
            var quickLink = $('#quick-create-page-button');
            if (quickLink.is(':visible')) {
                quickLink.click();
                e.preventDefault();
                e.stopImmediatePropagation();
                return false;
            }
        });
        var origConfluenceDialogWizard = Confluence.DialogWizard;
        Confluence.DialogWizard = function(dialog, finalAction) {
            var res = origConfluenceDialogWizard(dialog, finalAction);
            // Unfortunately we can not override the doFinalAction via prototype - so, the res.newPage-Action will still use the old one :(
            var doFinalAction = res.doFinalAction;
            res.doFinalAction = function(ev, state, wizardData, finalAction, wizard) {
                if (state.finalUrl && state.spaceKey == AJS.Meta.get('space-key')) {
                    runInMain(state.finalUrl);
                    AJS.$(".button-panel-cancel-link").click();
                } else {
                    doFinalAction(ev, state, wizardData, finalAction, wizard);
                }
            };
            return res;
        };
        function runInMain(src) {
            var $main = $('#main'), headerHeight = $('#header').height();
            $main.children().detach();
            $('body').css('overflow', 'hidden');
            $main.parent().css('height', 'calc(100% - ' + headerHeight + 'px)');
            $main.parents().css('overflow', 'hidden');
            $main.css({
                height: '100%',
                padding: 0,
                borderBottom: 'none',
                minHeight: 0
            });
            $('#footer').hide();
            var iframe = $('<iframe>', {
                src: src,
                frameborder: 0,
                scrolling: 'no',
            }).css({
                marginTop: -1 * headerHeight,
                marginBottom: -1,
                height: 'calc(100% + ' + (headerHeight + 1) + 'px)',
                width: '100%'
            }).appendTo($main).one('load', function(e) {
                iframe.contents().find('head').append('<base target="_parent">');
                $(iframe.prop('contentWindow')).bind('unload', function() {
                    window.setInterval(function() {
                        var doc = iframe.prop('contentWindow').document;
                        if (doc.readyState === 'loading') {
                            document.location.href = doc.location.href;
                            iframe.css('visibility', 'hidden');
                        }
                    }, 10);
                });
                $(this).one('load', function(e) {
                    //document.location.href = $(this).prop('contentWindow').document.location.href;
                });
            });
        }
        $('#editPageLink, #quick-create-page-button').off('click').click(function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            runInMain($(this).attr('href'));
        });
    });
})();