// ==UserScript==
// @name         QtCrawler
// @namespace    com.yellowfever.qtcrawler
// @version      0.3
// @description  Taiwan is not a part of China
// @author       (You)
// @match        http://www.interpals.net/*
// @match        https://www.interpals.net/*
// @include      http://www.interpals.net/*
// @include      https://www.interpals.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35738/QtCrawler.user.js
// @updateURL https://update.greasyfork.org/scripts/35738/QtCrawler.meta.js
// ==/UserScript==
var Qt = function() {
    if (window.location.hash == '#qtcontinue') {
        new Qt.OnlineVisitor();
    }
    else {
        var intf = new Qt.Interface();
        intf.run();
    }
};

Qt.Popup = function(content, closebutton) {
    var that = this;

    // credits: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    that.guid = function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };

    that.id = that.guid();

    that.css = {
        'display'           : 'none',
        'height'            : '130px',
        'width'             : '330px',
        'position'          : 'fixed',
        'left'              : '50%',
        'margin-left'       : '-150px',
        'z-index'           : '99999',
        'background-color'  : '#ccc',
        'top'               : '10px',
        'padding'           : '5px'
    };

    that.closeButton = closebutton || false;
    that.content = content || "";

    that.buildTemplate = function() {
        var popupOutter = document.createElement('div');

        $(popupOutter).css(that.css);
        $(popupOutter).attr('id', that.id);
        $(popupOutter).addClass('qt-popup');

        var popupHeader = document.createElement('div');
        $(popupHeader).addClass('qt-header');

        if(that.closeButton) {
            var closeButton = document.createElement('a');
            $(closeButton).addClass('qt-close');
            $(closeButton).attr('qt-remove', that.id);
            $(closeButton).html('[X]');
            $(closeButton).attr('href', 'javascript:void(0)');
            $(popupHeader).append(closeButton);
        }

        $(popupOutter).append(popupHeader);
        return popupOutter;
    }

    that.show = function() {
        var popupHtml = that.buildTemplate();
        var popupBody = document.createElement('div');



        $(popupBody).addClass('qt-body');

        if(typeof that.content != typeof "") {
            that.content = that.content.outerHTML;
        }

        console.log("content: "+that.content);

        $(popupBody).html(that.content);
        $(popupHtml).append(popupBody);

        $('body').append(popupHtml);
        $('#'+that.id).show();

        Qt.Popup.refreshListener();
    }

    that.getSelector = function() {
        return $('#'+that.id);
    }
};

Qt.Popup.refreshListener = function() {
    $('.qt-close').off('click');
    $('.qt-close').on('click', function() {
        Qt.Popup.remove($(this).attr('qt-remove'));
    });
}

Qt.Popup.remove = function (popupId) {
    $('#'+popupId).remove();
};

Qt.Registry = {
    get : function() {
        this._init();
        return JSON.parse(localStorage.getItem("qts"));
    },

    set: function(qtList) {
        localStorage.setItem("qts", JSON.stringify(qtList));
    },

    reset: function() {
        localStorage.setItem("qts", JSON.stringify({}));
    },

    _init: function() {
        if(localStorage.getItem("qts") === null) {
            Qt.Registry.reset();
        }
    }
};

Qt.EnumeratorOnlinePage = {
    count : function() {
        return $('.online_prof a.female').length;
    },
    enumerate : function(callback) {
        $('.online_prof a.female').each(function() {
            if($(this).attr('href').indexOf('country') === -1) {
                callback( $(this).attr('href').replace('/',''), $(this) );
            }
        });
    }
};

Qt.EnumeratorSearchPage = {
    count : function() {
        return $('.sResThumb').length;
    },
    enumerate : function(callback) {
        $('.sResThumb').each(function() {
            callback( $(this).attr('href').split('?')[0].replace('/','') , $(this) );
        });
    }
};

Qt.MaybeHeadToNextPage = function() {
    var href = $('.cur_page').next().attr('href');
    
    if (href) {
        var url = 'https://www.interpals.net' + href + '#qtcontinue'
        window.location.href = url;
    }
};

Qt.OnlineVisitor = function() {
    var that = this;

    that.popup = null;

    that.buildInterface = function() {
        // Headline
        var popupHeadline = document.createElement('h1');
        $(popupHeadline).html('QtCrawler');

        // Popup info
        var popupInfo = document.createElement('div');
        $(popupInfo).attr('id', 'qtpopupinfo');
        $(popupInfo).html('currently visiting qts... ');

        // Pointer
        var popupContent = document.createElement('span');
        $(popupContent).attr('id', 'qtpopupcontent');

        var pp = document.createElement('div');
        $(pp).append(popupHeadline);
        $(pp).append(popupInfo);
        $(pp).append(popupContent);

        that.popup = new Qt.Popup(pp, true);
    };

    that.runBot = function() {
        that.buildInterface();

        // choose correct enumerator
        var qtEnumerator = Qt.EnumeratorOnlinePage.count() > Qt.EnumeratorSearchPage.count() ?
            Qt.EnumeratorOnlinePage : Qt.EnumeratorSearchPage;

        var visitedQts = Qt.Registry.get();
        var unfilteredTotal = qtEnumerator.count();
        var doneVisited = 0;
        var currentCounter = 0;

        that.popup.show();
        
        qtEnumerator.enumerate(function(userName, element) {
        
            if(typeof visitedQts[userName] !== typeof undefined) {
                return;
            }

            currentCounter++;

            $.get('//www.interpals.net/'+userName).done(function() {
                visitedQts[userName] = true;
                doneVisited ++;
                element.parent().parent().parent().css({'background-color': '#000'});

                var percentDone = doneVisited / currentCounter * 100;
                $('#qtpopupinfo').html('visiting: '+doneVisited+' of '+currentCounter);
                $('#qtpopupcontent').html("<div style='width: "+percentDone+"%; background: #000; text-align: center; color: red'>&nbsp;</div>");

                // finished
                if(doneVisited === currentCounter) {
                    Qt.Registry.set(visitedQts);

                    var popupText = 'Finished visiting Qts ('+doneVisited+')';

                    if(unfilteredTotal - doneVisited !== 0) {
                        popupText += '<br />';
                        popupText += 'A total of '+(unfilteredTotal - currentCounter)+' QTs have been skipped ';
                        popupText += 'because you already visited them before. <br />';
                        popupText += '<a href="#" id="clearqtlist">Clear visited QT List</a> ';
                        popupText += '(click requires no further confirmation)';
                    }
                    
                    // If on search page
                    Qt.MaybeHeadToNextPage();

                    $('#qtpopupinfo').html(popupText);
                    that.refreshListener();
                }
            });
        });
        
        // all were already visited, head to next search page
        if (currentCounter == 0) {
            Qt.MaybeHeadToNextPage();
        }
    };

    that.refreshListener = function() {
        $('#clearqtlist').off('click');
        $('#clearqtlist').on('click',function(ev) {
            ev.preventDefault();
            Qt.Registry.reset();
            $('#clearqtlist').replaceWith('<strong>Visited QTs resetted</strong>');
            ev.stopPropagation();
        });
    }

    that.runBot();
};

Qt.Messenger = function ()  {
    var that = this;

    that.popup = null;

    that.buildInterface = function() {
        // Headline
        var popupHeadline = document.createElement('h1');
        $(popupHeadline).html('QtCrawler');

        // Popup info
        var popupInfo = document.createElement('div');
        $(popupInfo).attr('id', 'messagepopup');
        $(popupInfo).html('Type in your message. Use {username}, {city} and {country} as placeholders. <br />');

        // Pointer
        var popupContent = document.createElement('span');
        $(popupContent).attr('id', 'messagepopupcontent');

        $(popupContent).html('<textarea style="width: 310px; height: 40px" id="messagetext"></textarea>')
        $(popupContent).append('<br /><a href="#" id="sendMessages">Message all</a>')
        var pp = document.createElement('div');
        $(pp).append(popupHeadline);
        $(pp).append(popupInfo);
        $(pp).append(popupContent);

        that.popup = new Qt.Popup(pp, true);
    };

    that.showPopup = function() {
        that.buildInterface();
        that.popup.show();
        $('#sendMessages').off('click');
        $('#sendMessages').on('click', function() {
            that.runBot();
        });
    }

    that.runBot = function() {
        var visitedQts = Qt.Registry.get();
        var unfilteredTotal = $('.online_prof a.female').length;
        var doneVisited = 0;
        var currentCounter = 0;

        that.popup.show();

        $('.online_prof a.female').each(function() {
            if($(this).attr('href').indexOf('country') === -1) {
                var userName = $(this).attr('href').replace('/','');

                var el = $(this);

                $.ajax('/'+userName).done(function(html) {

                    // COLLECT DATA
                    var visitedSite = document.createElement('div');
                    $(visitedSite).html(html);
                    var pmLink = $(visitedSite).find('#prof-action-links a').first().attr('href');
                    var pmCity = $(visitedSite).find('.profDataTopData div a').first().text().trim();
                    var pmCountry = $(visitedSite).find('.profDataTopData div a').first().next().text().trim();

                    // Call PM link

                    $.get('//www.interpals.net/'+pmLink).done(function(response, _, header) {
                        // found thread
                        var thread = document.createElement('div');
                        $(thread).html(response);

                        if(header.getResponseHeader("TM-finalURLdhdg") !== null) {
                            if($(thread).find(".msg_user").length > 0) {
                                // user does not like being contacted
                                el.parent().parent().parent().css({'background-color': '#0f0'});
                            } else {
                                var threadUrl = header.getResponseHeader("TM-finalURLdhdg");
                                var chunks = threadUrl.split('thread_id=');

                                if(chunks.length === 2) {
                                    var thradId = chunks[1];
                                    var sMessage = $('#messagetext').val();
                                    sMessage = sMessage.replace("{username}", userName);
                                    sMessage = sMessage.replace("{city}", pmCity);
                                    sMessage = sMessage.replace("{country}", pmCountry);

                                    $.ajax({type:"POST",url:"https://www.interpals.net/pm.php",data:{action:"send_message",thread:thradId,message: sMessage},dataType:"json"}).done(function() {
                                        el.parent().parent().parent().css({'background-color': '#000'});
                                    });
                                } else {
                                    el.parent().parent().parent().css({'background-color': '#f00'});
                                }
                            }
                        }
                    });
                });
            }
        });
    };

    that.showPopup();
}

Qt.Interface = function() {
    var that = this;

    that.build = function() {
        // Create container
        var fLinkAuto = document.createElement('div');
        $(fLinkAuto).addClass('filterLinks');

        // Create headline for container
        var fLinkHeadline = document.createElement('h1');
        $(fLinkHeadline).html('Auto:');
        $(fLinkHeadline).css({
            'margin'    : '5px 0 5px 25px',
            'float'     : 'left'
        });

        // Create link "view all"
        var fLinkViewAll = document.createElement('a');
        $(fLinkViewAll).attr('href', '#');
        $(fLinkViewAll).attr('id', 'autoView');
        $(fLinkViewAll).html('view all');

        // Create link "view all"
        var fLinkMessage = document.createElement('a');
        $(fLinkMessage).attr('href', '#');
        $(fLinkMessage).attr('id', 'autoMessage');
        $(fLinkMessage).html('message all');

        // Append link to box
        $(fLinkAuto).append(fLinkHeadline);
        $(fLinkAuto).append(fLinkViewAll);
        $(fLinkAuto).append(fLinkMessage);

        // Add box to headmenu
        $('form[name="onlineForm"]').append(fLinkAuto);
        
        // Add to search box on search page
        $('form[name="sCForm"]').append(fLinkAuto);
    };

    that.run = function() {
        that.build();

        $('#autoView').off('click');
        $('#autoView').on('click', function () {
            new Qt.OnlineVisitor();
        });

        $('#autoMessage').off('click');
        $('#autoMessage').on('click', function () {
            new Qt.Messenger();
        });
    }
};

$(document).ready(function() {
    new Qt();
})
