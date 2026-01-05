// ==UserScript==
// @name         Swagger UI
// @locale       English (en)
// @namespace    COMDSPDSA
// @version      11.1
// @description  Enhance Swagger Output (and take over the world!)
// @author       Dan Overlander
// @include      http://*/swagger/*
// @include      *jsoneditoronline.org*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require	     https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @require      https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18592/Swagger%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/18592/Swagger%20UI.meta.js
// ==/UserScript==

// Since v11: minor tamperIcon style edit
// Since v10: Fixed the text-selection by adding a separate button for it.
// Since v09: Modernized trigger methods
// Since v08: auto-submits DSA api key (a new DCQO requirement)
// Since v07: Adds "THIS" and "TOP" buttons for quick in-element/page navigation
// Since v06: Fixed outgoing linkify for new UI
// Since v05: Filters both lists (sidebar AND main area) on new UI, not just sidebar
//          : Cleaned up filter button appearance
// Since v04: Expanded reach for secondary Swagger layout (with the left-hand navigation)
// Since v03: added jQuery no-conflict :)
//          : added method-filter buttons
// Since v02: Added "back to element" button.
// Since v01: adopting code structure as found in my other (TFS) scripts. massive overhaul.

/*
 * tm is an object included via @require from DorkForce's Tampermonkey Assist script
 */

(function() {
    'use strict';

    const TIMEOUT = 750;
    var global =
        {
            isMouseMoved: false,
            systemPasteReady: false,
            scriptName: 'Swagger UI',
            areClassesAdded: false,
            areFiltersAdded: false,
            areJsonEditorClassesAdded: false,
            prefs: localStorage.getItem('swaggerPrefs') != null ? JSON.parse(localStorage.getItem('swaggerPrefs')) : {}
        },
        pages = {
            swagger: {
                titleElement: '#logo',
                initializeOnElement: '.container',
                initialize: function () {
                    setTimeout(function () {
                        if (global.prefs.apiKey == null) global.prefs.apiKey = '';
                        pages.swagger.addClasses();
                        utils.setTamperIcon();
                        pages.swagger.addLinks();
                        pages.swagger.addButtons();
                        pages.swagger.addFilterButtons();
                        //pages.swagger.addPrefsMenu();
                        pages.swagger.submitApiKey();
                    }, TIMEOUT);
                },
                addClasses: function () {
                    if (!global.areClassesAdded) {
                        global.areClassesAdded = true;

                        // tampermonkey script identifier
                        tm.addGlobalStyle('.tamperlabel { position:fixed; bottom:20px; right:20px; width:18px; height:18px; color:black; cursor:pointer; font-size:0.5em; font-weight:bold; line-height:15px; }');

                        // json editor buttons
                        tm.addGlobalStyle('.selectIt { float:right; height:50px; margin-left:20px; top:5px; position:relative; }');
                        tm.addGlobalStyle('.jsonEdit, .backElement, .topElement { float:right; height:50px; margin-left:20px; top:5px; position:relative; clear:both; width:52px; margin-top:10px; }');

                        // filter button class
                        tm.addGlobalStyle('.filtery { cursor:pointer; color:white !important; border:2px solid white; border-radius:9px; padding:3px 10px; float:right; }');
                        tm.addGlobalStyle('.filteryed { border-color:cornflowerblue; }');
                        tm.addGlobalStyle('.yAll { background-color:#000; }');
                        tm.addGlobalStyle('.yGet { background-color:#0f6ab4; }');
                        tm.addGlobalStyle('.yPatch { background-color:#D38042; }');
                        tm.addGlobalStyle('.yPost { background-color:#10A54A; }');
                        tm.addGlobalStyle('.yPut { background-color:#C5862B; }');
                        tm.addGlobalStyle('.yDelete { background-color:#A41E22; }');
                        tm.addGlobalStyle('.yPrefs { background-color:forestgreen; }');
                    }
                },
                addLinks: function () {
                    var updateLoop,
                        interval = 2000;
                    if ($('.request_url pre').length === 0) {
                        updateLoop = setTimeout(pages.swagger.addLinks, interval);
                    } else {
                        var outgoingLinks;
                        outgoingLinks = $('.hljs-attribute').length > 0 ? $('.request_url .hljs-attribute') : $('.request_url pre');
                        utils.linkifyArray(outgoingLinks);

                        updateLoop = undefined;
                    }
                },
                addPrefsMenu: function() {
                    var scrName = global.scriptName.replace(/\s/g, '');
                    if ($('.helpFor' + scrName).length === 0) {
                        tm.log('adding');
                        $('.swagger-ui-wrap').before('<a class="filtery yPrefs fingery helpFor' + scrName + '" title="Preferences">PREFS</a>');
                        $('.helpFor' + scrName).mouseup(function clickIdLink (e) {
                            var modalId = 'swaggerOptions',
                                modalBody = '';
                            _.each(global.prefs, function (value, key) {
                                if (Array.isArray(value) || typeof value === 'string') {
                                    modalBody += '    <div class="popupDetailTitle">' + key + '</div><div class="popupDetailContent"><input style="width:100%" id="' + key + '" type="text" value="' + value + '"></input></div>';
                                } else {
                                    _.each(value, function (value2, key2) {
                                        modalBody += '    <div class="popupDetailTitle">' + key2 + '</div><div class="popupDetailContent"><input style="width:100%" id="' + key2 + '" type="text" value="' + value2 + '"></input></div>';
                                    });
                                }
                            });
                            modalBody += '<div class="popupDetailTitle">&nbsp;</div><div class="popupDetailContent" style="text-align:right;">' +
                                '    <button class="savery">Save</button>' +
                                '</div>';
                            modalBody += '<div class="popupDetailTitle">&nbsp;</div><div class="popupDetailContent" style="text-align:right;">' +
                                '    <button class="resetery">Reset</button>' +
                                '</div>';
                            tm.showModal(modalId, modalBody);

                            $('.savery').on('click', function() {
                                global.prefs = {
                                    apiKey: $('#apiKey').val() // ** * * * add more save prefs here. Should rework someday.
                                };
                                localStorage.setItem('swaggerPrefs', JSON.stringify(global.prefs));
                                alert('Refresh to see new values.');
                            });
                            $('.resetery').on('click', function() {
                                localStorage.setItem('swaggerPrefs', {});
                                alert('Refresh to see default values.');
                            });
                        });
                    }
                },
                addButtons: function () {
                    if (!global.areButtonsAdded) {
                        global.areButtonsAdded = true;

                        // enhance existing "Try it out" button functionality
                        $('.submit').on('click', function () {
                            $('html, body').animate({
                                scrollTop: $(this).offset().top
                            }, 500);
                        });

                        // BEGIN add Select button
                        var selectIt = function () {
                            $('.selectedJson').removeClass('selectedJson');
                            $(this).parent().find('code').eq(0).addClass('selectedJson');

                            tm.selectText('selectedJson');
                            return false;
                        };
                        $('.response_body').before('<button class="selectIt">TEXT</button>');
                        $('.selectIt').click(selectIt);
                        // END add Select button

                        // BEGIN add JSON button
                        var editJson = function () {
                            $('.selectedJson').removeClass('selectedJson');
                            $(this).parent().find('code').eq(0).addClass('selectedJson');

                            tm.copyTextToClipboard($('.selectedJson').prop('innerText'));
                            // tm.selectText('selectedJson'); only works with console open (?)

                            window.open('https://jsoneditoronline.org/#/new', 'jsonEditor Online');
                            return false;
                        };
                        $('.response_body').before('<button class="jsonEdit">JSON</button>');
                        $('.jsonEdit').click(editJson);
                        // END add JSON button

                        // BEGIN add Back to Element button
                        var backElement = function () {
                            $('html, body').animate({ scrollTop: $(this).closest('.endpoint').offset().top }, 500);
                            return false;
                        };
                        $('.response_body').before('<button class="backElement">THIS</button>');
                        $('.backElement').click(backElement);
                        // BEGIN add Back to Element button

                        // BEGIN add Back to Top button
                        var topElement = function () {
                            $('html, body').animate({ scrollTop: $('body').offset().top }, 500);
                            return false;
                        };
                        $('.response_body').before('<button class="topElement">TOP</button>');
                        $('.topElement').click(topElement);
                        // BEGIN add Back to Top button
                    }
                },
                addFilterButtons: function () {
                    if (!global.areFiltersAdded) {
                        global.areFiltersAdded = true;

                        var showParents = function () {
                            $('.sidebarParent').show();
                            $('.resource').show();
                        };

                        var hideParents = function () {
                            var thisParent, visibleChildren = 0;
                            _.each($('#sidebar li'), function (thisLi) {
                                if ($(thisLi).hasClass('sidebarParent')){
                                    if (thisParent !== undefined) {
                                        if (visibleChildren === 0) {
                                            thisParent.hide();
                                        }
                                    }
                                    thisParent = $(thisLi);
                                    visibleChildren = 0;
                                } else {
                                    if ($(thisLi).css('display') !== 'none') {
                                        visibleChildren++;
                                    }
                                }
                            });

                            $.each( $('.resource'), function( i, val ) {
                                if($(this).find('.showing').length <= 0) {
                                    $(this).hide();
                                }
                            });
                        };

                        var yGet = function () {
                            showParents();
                            $('.operation').hide().removeClass('showing');
                            $('.get').show().addClass('showing');
                            $('.sidebarChild').hide();$('.btn-get').closest('.sidebarChild').show();
                            $('.filtery').removeClass('filteryed');
                            $('.yGet').addClass('filteryed');
                            hideParents();
                        };
                        var yPatch = function () {
                            showParents();
                            $('.operation').hide().removeClass('showing');
                            $('.patch').show().addClass('showing');
                            $('.sidebarChild').hide();$('.btn-patch').closest('.sidebarChild').show();
                            $('.filtery').removeClass('filteryed');
                            $('.yPatch').addClass('filteryed');
                            hideParents();
                        };
                        var yPost = function () {
                            showParents();
                            $('.operation').hide().removeClass('showing');
                            $('.post').show().addClass('showing');
                            $('.sidebarChild').hide();$('.btn-post').closest('.sidebarChild').show();
                            $('.filtery').removeClass('filteryed');
                            $('.yPost').addClass('filteryed');
                            hideParents();
                        };
                        var yPut = function () {
                            showParents();
                            $('.operation').hide().removeClass('showing');
                            $('.put').show().addClass('showing');
                            $('.sidebarChild').hide();$('.btn-put').closest('.sidebarChild').show();
                            $('.filtery').removeClass('filteryed');
                            $('.yPut').addClass('filteryed');
                            hideParents();
                        };
                        var yDelete = function () {
                            showParents();
                            $('.operation').hide().removeClass('showing');
                            $('.delete').show().addClass('showing');
                            $('.sidebarChild').hide();$('.btn-delete').closest('.sidebarChild').show();
                            $('.filtery').removeClass('filteryed');
                            $('.yDelete').addClass('filteryed');
                            hideParents();
                        };
                        var yAll = function () {
                            showParents();
                            $('.operation').show().addClass('showing');
                            $('.sidebarChild').show();
                            $('.filtery').removeClass('filteryed');
                        };

                        $('#resources')
                            .before('<a class="filtery yAll">ALL</a>')
                            .before('<a class="filtery yGet">GET</a>')
                            .before('<a class="filtery yPatch">PATCH</a>')
                            .before('<a class="filtery yPost">POST</a>')
                            .before('<a class="filtery yPut">PUT</a>')
                            .before('<a class="filtery yDelete">DEL</a>');
                        $('.yGet').click(yGet);
                        $('.yPatch').click(yPatch);
                        $('.yPost').click(yPost);
                        $('.yPut').click(yPut);
                        $('.yDelete').click(yDelete);
                        $('.yAll').click(yAll);

                    }
                },
                submitApiKey: function () {
                    if ($('#input_apiKey').val().length === 0 && global.prefs.apiKey != null) {
                        $('#input_apiKey').val(global.prefs.apiKey);
                        $('#explore').click();
                    }
                }
            },
            jsonEditor: {
                titleElement: '#header',
                initializeOnElement: '.ace_content',
                initialize: function () {
                    setTimeout(function () {
                        pages.swagger.addClasses();
                        pages.jsonEditor.addClasses();
                        utils.setTamperIcon();
                        pages.jsonEditor.initJsonEditor();
                    }, TIMEOUT);
                },
                addClasses: function () {
                    if (!global.areJsonEditorClassesAdded) {
                        global.areJsonEditorClassesAdded = true;

                        tm.addGlobalStyle('#treeEditor { width:55% !important; }');
                        tm.addGlobalStyle('.tamperlabel { margin-bottom:-25px; }');
                    }
                },
                initJsonEditor: function () {
                    if (!global.isJsonEditorInitialized) {
                        global.isJsonEditorInitialized = true;
                        //utils.paste($('.ace_text-input'));
                    }
                }
            }
        },
        utils = {
			setTamperIcon: function () {
                // Add Tampermonkey Icon with label to identify this script
                if($('.tamperlabel').length > 0) {
                    if ($('.tamperlabel').prop('title').indexOf(global.scriptName) === -1) {
                        $('.tamperlabel').prop('title', $('.tamperlabel').prop('title') + ' | ' + global.scriptName);
                    }
                } else {
                    $('body').append('<span class="tamperlabel" title="Tampermonkey scripts: ' + global.scriptName + '"> *TM</span>');
                }
            },
            linkifyArray: function (linkArray) {
                var newLink;
                if (linkArray.length > 0) {
                    _.each(linkArray, function(link) {
                        newLink = link.innerHTML.replace('"', '');
                        if (link.innerHTML.indexOf('href') < 0) {
                            link.innerHTML = '<a href="' + newLink + '" target="_blank" style="font-weight:bold;">' + newLink + '</a>';
                        }
                    });
                }
            }
        };

    /*
     * Global functions
     */

    function initScript () {
        tm.getContainer({
            'el': pages.swagger.initializeOnElement,
            'max': 100,
            'spd': 1000
        }).then(function($container){
            pages.swagger.initialize();
        });
        tm.getContainer({
            'el': pages.jsonEditor.initializeOnElement,
            'max': 100,
            'spd': 1000
        }).then(function($container){
            pages.jsonEditor.initialize();
        });
    }

    initScript();

    $(document).mousemove(function(e) {
        if (!global.isMouseMoved) {
            global.isMouseMoved = true;
            setTimeout(function() {
                global.isMouseMoved = false;
            }, TIMEOUT * 2);
            initScript();
        }
    });

})();
$.noConflict();