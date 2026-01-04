// ==UserScript==
// @name            Readmore Userscript
// @version         4.6.1
// @description     Fügt der deutschen eSport-Webseite zusätzliche Funktionen hinzu
// @author          thextor, vntw
// @credits         IllDependence (Extrabuttons), Biki (RM Plus)
// @namespace       readmore
// @include         *.readmore.de/*
// @require         http://code.jquery.com/jquery-2.2.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/368511/Readmore%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/368511/Readmore%20Userscript.meta.js
// ==/UserScript==

/*
 * HTML5 Sortable jQuery Plugin
 * http://farhadi.ir/projects/html5sortable
 * 
 * Copyright 2012, Ali Farhadi
 * Released under the MIT license.
 */
(function($) {
var dragging, placeholders = $();
$.fn.sortable = function(options) {
	var method = String(options);
	options = $.extend({
		connectWith: false
	}, options);
	return this.each(function() {
		if (/^enable|disable|destroy$/.test(method)) {
			var items = $(this).children($(this).data('items')).attr('draggable', method == 'enable');
			if (method == 'destroy') {
				items.add(this).removeData('connectWith items')
					.off('dragstart.h5s dragend.h5s selectstart.h5s dragover.h5s dragenter.h5s drop.h5s');
			}
			return;
		}
		var isHandle, index, items = $(this).children(options.items);
		var placeholder = $('<' + (/^ul|ol$/i.test(this.tagName) ? 'li' : 'div') + ' class="sortable-placeholder">');
		items.find(options.handle).mousedown(function() {
			isHandle = true;
		}).mouseup(function() {
			isHandle = false;
		});
		$(this).data('items', options.items)
		placeholders = placeholders.add(placeholder);
		if (options.connectWith) {
			$(options.connectWith).add(this).data('connectWith', options.connectWith);
		}
		items.attr('draggable', 'true').on('dragstart.h5s', function(e) {
			if (options.handle && !isHandle) {
				return false;
			}
			isHandle = false;
			var dt = e.originalEvent.dataTransfer;
			dt.effectAllowed = 'move';
			dt.setData('Text', 'dummy');
			index = (dragging = $(this)).addClass('sortable-dragging').index();
		}).on('dragend.h5s', function() {
			if (!dragging) {
				return;
			}
			dragging.removeClass('sortable-dragging').show();
			placeholders.detach();
			if (index != dragging.index()) {
				dragging.parent().trigger('sortupdate', {item: dragging});
			}
			dragging = null;
		}).not('a[href], img').on('selectstart.h5s', function() {
			this.dragDrop && this.dragDrop();
			return false;
		}).end().add([this, placeholder]).on('dragover.h5s dragenter.h5s drop.h5s', function(e) {
			if (!items.is(dragging) && options.connectWith !== $(dragging).parent().data('connectWith')) {
				return true;
			}
			if (e.type == 'drop') {
				e.stopPropagation();
				placeholders.filter(':visible').after(dragging);
				dragging.trigger('dragend.h5s');
				return false;
			}
			e.preventDefault();
			e.originalEvent.dataTransfer.dropEffect = 'move';
			if (items.is(this)) {
				if (options.forcePlaceholderSize) {
					placeholder.height(dragging.outerHeight());
				}
				dragging.hide();
				$(this)[placeholder.index() < $(this).index() ? 'after' : 'before'](placeholder);
				placeholders.not(placeholder).detach();
			} else if (!placeholders.is(this) && !$(this).children(options.items).length) {
				placeholders.detach();
				$(this).append(placeholder);
			}
			return false;
		});
	});
};
})(jQuery);

// Greasemonkey FIX
try {
    GM_log("[Readmore Userscript]");
} catch (e) {}
function BettingOverview($, _options){

    var _controlElement = null;
    var _games = {};

    this.init = function(){
        _controlElement = document.createElement('div');
        _controlElement.id = 'userscriptBettingControl';

        $('#c_content ul.breadcrumbs').next().after(_controlElement);

        _readGames();
        _buildControlPanel();
    };

    var _readGames = function(){
        var betElements = $('#c_content').find('[id^="betting_open_"]');
        var indexNumber = 0;

        $.each(betElements, function(i, e){
            var imgElement = e.querySelector('div.match_head > span.cov > img');

            if (!_games.hasOwnProperty(imgElement.title)){
                _games[imgElement.title] = {
                    title: imgElement.title,
                    src: imgElement.src,
                    number: indexNumber
                };

                indexNumber++;
            }

            e.className = 'userscriptBetting userscriptBettingControlNumber_' + _games[imgElement.title].number;
        });
    };

    var _buildControlPanel = function(){
        for (var game in _games){
            var gameContainer = document.createElement('div');
            var gameName = document.createElement('img');
            var gameBox = document.createElement('input');

            gameName.className = 'gameName';
            gameName.src = _games[game].src;
            gameBox.className = 'gameBox';
            gameBox.type = 'checkbox';
            gameBox.checked = 'checked';
            gameBox.name = _games[game].title;
            gameBox.value = _games[game].number;

            gameContainer.appendChild(gameName);
            gameContainer.appendChild(gameBox);

            _controlElement.appendChild(gameContainer);
        };

        $(_controlElement).find('input').on('change', function(){
            $('.userscriptBettingControlNumber_' + this.value).toggle();
        });
    };
}
/**
 * CheckUpdate
 * ===========
 *
 * Überbrüft ob eine neue Version des Userscripts verfügbar ist.
 */

function CheckUpdate($, _options){
    var self = this;

    var updateUrl = 'https://www.readmore.de/forums/91-technik/60-software/111239-readmore-userscript',
        lastCheck = 0,
        lastVersion = '',
        timeBetweenChecks = 24*60*60*1000, // 24 Stunden
        notificationActive = false;

    this.checkUpdate = function(){
        if (!lastCheck || !lastVersion){
            _readLastCheckTime().done(function(){
                self.checkUpdate();
            })
        }
        else{
            if (lastVersion != _options.getVersion()){
                _displayNotification();
            }
        }
    };

    var _readLastCheckTime = function(){
        var dfd = new $.Deferred();

        lastCheck = Number(_options.getData('checkUpdateLastCheck'));
        lastVersion = _options.getData('checkUpdateLastVersion');

        // Ausgelesene Daten sind nicht komplett oder es sind 2 Stunden vergangen
        if (!lastCheck || !lastVersion || lastCheck + timeBetweenChecks < +new Date()){
            $.ajax({
                type: "POST",
                cache: false,
                url: updateUrl
            }).done(function(data) {
                if (data != null) {
                    var pageData = data.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, " ");
                    lastVersion = $(pageData).find('div#post_4473381')[0].innerText.match(/Readmore Userscript \[v([0-9]+\.[0-9]+\.[0-9]+)\]/)[1];
                    lastCheck = +new Date();

                    _options.setData('checkUpdateLastCheck', lastCheck);
                    _options.setData('checkUpdateLastVersion', lastVersion);
                    _options.saveCurrentOptions();

                    dfd.resolve();
                }
            });
        }
        else{
            dfd.resolve();
        }

        return dfd;
    };

    var _displayNotification = function(){
        if (!notificationActive){
            var aTag = document.createElement('a');

            aTag.href = updateUrl;
            aTag.title = 'Update verfügbar!';
            aTag.text = 'Update!';
            aTag.className = "checkUpdate";

            $('#openUserscriptOptions').after(aTag);
            notificationActive = true;
        }
    };
};
/**
 * Content
 * =======
 *
 * Klasse um zu prüfen ob bestimmte Bestandteile der Readmore.de Seite vorhanden sind
 * und sie als jQuery-Object / Array zurückzugeben. Zum einen können die Elemente so gecached werden,
 * zum anderen müssen die Selectoren / Funktionen nicht wiederholt implementiert werden.
 */

function Content($){

    var _self = this;

    /**
     * Hier werden die verschiedenen Möglichkeiten zum Abfragen definiert.
     * Denke elements und selector sind selbsterklärend.
     * @type {{forumPosts: {selector: string, elements: Array}}}
     * @private
     */
    var _content = {
        'forumNavigation': {
            'selector': 'div#forums_list',
            'function': '',
            'elements': []
        },
        'forumPosts': {
            'selector': 'div.forum_post',
            'function': '',
            'elements': []
        },
        'headlines': {
            'selector': '#headlines_list',
            'function': '',
            'elements': []
        },
        'tickerMatches': {
            'selector': '#matches_list',
            'function': '',
            'elements': []
        },
        'tickerComplete': {
            'selector': '',
            'function': 'tickerComplete',
            'elements': []
        },
        'betKing': {
            'selector': '',
            'function': 'betKing',
            'elements': []
        }
    };

    /**
     * Als Name wird hier einfach ein String übergeben, der auf die erste Ebene in dem _content Object passt. Wird KEIN
     * context Parameter übergeben, werden die Daten aus dem aktuellen DOM geladen und zwischengespeichert.
     * Mit Context (was z.B. bei übergabe von Daten die per Ajax geholt werden nützlich ist), wird nicht
     * gecached und mit $(context).find() gearbeitet.
     * @param name
     * @param context
     * @returns {Array}
     */
    this.get = function(name, context){
        context = typeof context !== 'undefined' ? context : '';

        var returnValue = [];

        if (_content.hasOwnProperty(name)){
            // Falls das Array leer ist oder ein Kontext übergeben wurde
            if (!_content[name].elements.length || context !== ''){
                // Einfachen Selector oder Funktion nutzen
                returnValue = (_content[name].function ? _selectElementFunction(name, context) : _selectElement(name, context));

                // Kein Kontext -> Cachen
                if (context === ''){
                    _content[name].elements = returnValue;
                }
            }
            // Kein Kontext und das Element wurde bereits selektiert
            else{
                returnValue = _content[name].elements;
            }
        }

        return returnValue;
    };

    var _selectElement = function(name, context){
        return (context === ''  ? $(_content[name].selector)
                                : $(context).find(_content[name].selector));
    };

    var _selectElementFunction = function(name, context){
        var $element = (context === '' ? $(document) : $.parseHTML(context));
        return _functionContainer[_content[name].function]($element);
    };

    /**
     * Container für die Funktionen.
     * @type {{tickerComplete: tickerComplete}}
     * @private
     */
    var _functionContainer = {
        tickerComplete: function($element){
            var returnValue = $element.find('#c_right').find('#matches_control, .matches_filter, #matches_list, a.control');
            if (returnValue.length){
                returnValue = $.merge(returnValue, returnValue.last().next());
                returnValue = $.merge(returnValue, returnValue.first().next());
            }
            return returnValue;
        },

        betKing: function($element){
            var headline = $('#c_right').find('h3>a[href*="betting/ranking"]').parent(),
                returnValue = [];

            if (headline.length){
                returnValue.push(headline[0]);
                returnValue.push(headline.next()[0]);
                returnValue.push(headline.next().next()[0]);
                returnValue.push(headline.next().next().next()[0]);
            }

            return $(returnValue);
        }
    };
};
function ForumFavorites($, _options, _content, _loadingScreen/*, _sync*/){
    var OPTIONS_NAME = 'forumFavoritesData';
    var ICON_FAVORITE = 'rmus-icon-star';
    var ICON_NOT_FAVORITE = 'rmus-icon-star-empty';

    var _threadId = 0;
    var _favorites = _options.getData(OPTIONS_NAME);
    var _itag = null;
    var _lastpostChanged = [];

    /**
     * Bereitet das Icon im Thread vor
     */
    this.initThread = function(){
        _threadId   = Number(document.location.pathname.match(/(\d+)-[^/]*?$/)[1]);

        if (typeof _favorites === 'undefined' || _favorites === null){
            _favorites = {};
            _saveFavorites();
        }

        _itag = document.createElement('i');
        _itag.id = 'userscriptForumFavorites';
        _changeITag();

        $('#c_content h1:first')
            .append(_itag)
            .find('#' + _itag.id)
            .on('click', function(){

                // _favorites auf den aktuellen stand bringen
                // Daten aus dem Localstorage auslesen
                var options = JSON.parse(_options.getOptionsRaw());
                _favorites = options['dataStorage'][OPTIONS_NAME];

                if (typeof _favorites[_threadId] === 'undefined')
                    _favorites[_threadId] = _getThreadInfo();
                else
                    _favorites[_threadId] = undefined;

                _changeITag();
                _saveFavorites();
            });
    };

    /**
     * Zeigt die Favoriten in der Forennavigation an
     */
    this.initForumNavi = function(){
        // Überschrift zusammenbauen
        var header = document.createElement('div'),
            headerSpan = document.createElement('span'),
            headerSpanA = document.createElement('a'),
            headerSpanRefresh = document.createElement('span'),
            headerSpanRefreshI = document.createElement('i');

        header.className = 'headlines_cat';
        headerSpanA.innerHTML = 'Favoriten';
        headerSpanA.src = '#';
        headerSpan.appendChild(headerSpanA);

        // Refresh Button
        headerSpanRefresh.style.float = 'right';
        headerSpanRefreshI.id = 'userscriptRealoadFavoritesButton';
        headerSpanRefreshI.title = 'Favoriten aktualisieren';
        headerSpanRefreshI.className = 'rmus-icon rmus-icon-arrows-cw';
        headerSpanRefresh.appendChild(headerSpanRefreshI);

        header.appendChild(headerSpan);
        header.appendChild(headerSpanRefresh);
        _content.get('forumNavigation').append(header);

        // Einträge zusammensetzen
        _content.get('forumNavigation').append( _generateEntries());

        _addRefreshEvent();
    };

    var _generateEntries = function(){
        var ul = document.createElement('ul');
            ul.id = 'userscriptFavoriten';

        $.each(_getFavoritesArrayInOrder(), function(index, threadInfo){
            var li = document.createElement('li'),
                aArrow = document.createElement('a'),
                aArrowImage = document.createElement('img'),
                aArrowLast = document.createElement('a'),
                aArrowLastImage = document.createElement('img'),
                aForum = document.createElement('a'),
                aForumSpan = document.createElement('span'),
                aThread = document.createElement('a'),
                aThreadSpan = document.createElement('span');

            // Pfeil (ungelesene Seite)
            aArrow.href = threadInfo.threadLink.replace(/&page=last$/gi, '') + '/firstunread';
            aArrow.className = 'r';
            aArrow.title = 'Zum ersten ungelesenen Beitrag des Themas';
            aArrowImage.src = '//cdn1.readmore.de/img/themes/readmore/arrow_last_item.gif';
            aArrowImage.border = '0';
            aArrow.appendChild(aArrowImage);

            // Pfeil (letzte Seite)
            aArrowLast.href = threadInfo.threadLink;
            aArrowLast.className = 'r favLastArrow';
            aArrowLast.title = 'Zur letzten Seite des Themas';
            aArrowLastImage.src = '//cdn1.readmore.de/img/themes/readmore/arrow_last_item2.gif';
            aArrowLastImage.border = '0';
            aArrowLast.appendChild(aArrowLastImage);

            // Forum
            aForum.href = threadInfo.forumLink;
            aForumSpan.innerHTML = threadInfo.forumName + ': ';
            aForumSpan.className = 'forum';
            aForum.appendChild(aForumSpan);

            // Thread
            aThread.href = threadInfo.threadLink.split('&page')[0];
            aThreadSpan.innerHTML = (threadInfo.threadName.length <= 31) ? threadInfo.threadName : threadInfo.threadName.substring(0, 28) + "...";
            aThread.appendChild(aThreadSpan);

            if (_lastpostChanged.indexOf(threadInfo['id']) != -1){
                aThreadSpan.className = 'newPostFavs';
            }

            // Zusammenfügen
            li.appendChild(aArrowLast);
            li.appendChild(aArrow);
            li.appendChild(aForum);
            li.appendChild(aThread);
            ul.appendChild(li);
        });

        return ul;
    };

    /**
     * Verändert das Icon im Thread
     * @private
     */
    var _changeITag = function(){
        _itag.className = 'rmus-icon ' + (typeof _favorites[_threadId] === 'undefined' ? ICON_NOT_FAVORITE : ICON_FAVORITE);
        _itag.title = 'Thread als Favorit ' + (typeof _favorites[_threadId] === 'undefined' ? 'hinzufügen' : 'entfernen');
    };

    /**
     * Liest die Informationen des Threads aus, wird für die Übersicht in der Navi gebraucht
     * @returns {{forumName: (string|innerHTML|*|._row.cells.innerHTML|id.innerHTML|L.innerHTML), forumLink: (href|string|jsl.$.href|window.location.href), threadName: (string|innerHTML|*|._row.cells.innerHTML|id.innerHTML|L.innerHTML), threadLink: string}}
     * @private
     */
    var _getThreadInfo = function(){
        var liTags = $('#c_content > ul.breadcrumbs:first > li');

        return {
            forumName: _replaceLongForumNames(liTags[2].childNodes[0].innerHTML),
            forumLink: liTags[2].childNodes[0].href,
            threadName: liTags[3].innerHTML,
            threadLink: document.location.href + '&page=last'
        };
    };

    var _replaceLongForumNames = function(name){
        var newName = '';

        switch(name){
            case 'Counter-Strike: Global Offensive':
                newName = 'CS:GO';
                break;
            case 'League of Legends':
                newName = 'LoL';
                break;
            case 'Defense of the Ancients':
                newName = 'DotA';
                break;
            default:
                newName = name;
                break;
        }

        return newName;
    };

    /**
     * Favoriten speichern
     * @private
     */
    var _saveFavorites = function(){
        _options.setData(OPTIONS_NAME, _favorites);
        _options.saveCurrentOptions();

        /*if (_options.getOption('miscellaneous_syncOptions')){
            _sync.sendOptionsToServer();
        }*/
    };

    var _addRefreshEvent = function(){
        // Die setTimeouts werden gebraucht damit der Browser die Elemente zeichnen / darstellen
        // kann und Javascript nicht alles blockiert.
        setTimeout(function(){
           $('#userscriptRealoadFavoritesButton').click(function(){
               var i = 0,
                   favCount = Object.keys(_favorites).length;

               _loadingScreen.showLoadingScreen();
               _loadingScreen.changeLoadingMessage('0 / ' + favCount + ' Favoriten ausgelesen');

               setTimeout(function(){
                   $.each(_favorites, function(threadid, threadInfo){
                       setTimeout(function(){
                           $.ajax({
                               type: "GET",
                               cache: false,
                               url: threadInfo['threadLink']
                           }).done(function(data) {
                               if (data != null) {
                                   var lastPost   = $(data).find('.forum_post:last').attr('id').match(/[0-9]+/)[0],
                                       threadName = $(data).find('#c_content > ul.breadcrumbs:first > li')[3].innerHTML;

                                   _loadingScreen.changeLoadingMessage(++i + ' / ' +  favCount + ' Favoriten ausgelesen');

                                   // Neuer Post
                                   if (lastPost != null) {
                                       if (threadInfo['lastPost'] != lastPost) {
                                           threadInfo['lastPost'] =  lastPost;

                                           _lastpostChanged.push(threadid);
                                       }
                                       if (threadInfo['threadName'] != threadName){
                                           threadInfo['threadName'] =  threadName;
                                       }
                                   }

                                   // Letzter Favorit
                                   if (i == favCount){
                                       // Etwas verzögern, sonst flackert das Bild bei wenigen
                                       // Favoriten nur kurz auf
                                       setTimeout(function(){
                                           _loadingScreen.removeLoadingScreen();
                                           _saveFavorites();

                                           $('#userscriptFavoriten').replaceWith(_generateEntries());

                                           setTimeout(function(){
                                               _addRefreshEvent();
                                           }, 50);
                                       }, 250);
                                   }
                               }
                           });
                       }, 0);
                   });
               }, 0);
            });
        }, 0);
    };

    var _getFavoritesArrayInOrder = function(){
        var tempArray = [];

        $.each(_favorites, function(threadid, threadInfo){
            threadInfo['id'] = threadid;
            tempArray.push(threadInfo);
        });

        tempArray.sort(function(a, b){
            a['lastPost'] = Number(a['lastPost']);
            b['lastPost'] = Number(b['lastPost']);

            if (a['lastPost'] > b['lastPost'] || !a['lastPost']) return -1;
            if (a['lastPost'] < b['lastPost'] || !b['lastPost']) return +1;

            return 0;
        });

        return tempArray;
    };
};
/**
 * ForumNavigation
 * ===============
 *
 * Sorgt für das Umsortieren, Ausblenden und Neuladen der Forumnavigation.
 */

function ForumNavigation($, _options, _reloadPageData, _misc, _content, _forumFavorites) {

    var _self = this,
        _observer = null,
        _section = null,
        _sectionOpts = null,
        _mappings = {
            'esport': 'eSport',
            'technik': 'Technik',
            'offtopic': 'Offtopic',
            'spiele': 'Spiele',
            'readmore': 'readmore',
            'trashtalk': 'Trashtalk'
        };

    this.getMappings = function(){
        // Eventuell die Favoriten hinzufügen
        if (_options.getOption('forumFavorites')){
            _mappings['favoriten'] = 'Favoriten';
        }

        return _mappings;
    };

    /**
     * Lädt die Forennavigation neu.
     * @return {[type]} [description]
     */
    this.reloadForum = function() {
        var reloadData = _content.get('forumNavigation', _reloadPageData.getPageData());

        if (reloadData.length) {
            _content.get('forumNavigation').html(reloadData.html());
        }

        // Nachdem das Forum neugeladen wurde, müssen die Pfeile eventuell wieder angepasst werden
        if (_options.getOption("miscellaneous_lastPageJumpToLastPost")) {
            _misc.changeForumArrowBehavior();
        }

        // Neu sortieren/ausblenden
        if (_options.getOption('rightColumn_forum_sections')) {
            this._handleForums();
        }

        // Favoriten Forennavi
        if (_options.getOption('forumFavorites')){
            _forumFavorites.initForumNavi();
        }
    };

    /**
     * Fügt den Button ein, mit dem man das Forum manuell neuladen kann.
     */
    this.addReloadBtn = function() {
        return $("h3 > a[href$='/forums']").parent().append('<span style="float: right;"><i id="userscript_reloadForumButton" title="Forum aktualisieren" class="rmus-icon rmus-icon-arrows-cw" style="cursor: pointer;"></i></span>');
    };

    /**
     * Lädt das Forum manuell neu, wenn auf den Button geklickt wird.
     * @return {[type]} [description]
     */
    this.reloadForumManually = function() {
        _reloadPageData.readPage();
        setTimeout(function() {
            _self.reloadForum();
        }, 500);
    };

    /**
     * Startet einen MutationObserver, der auf DOM-Änderungen im div#headlines_list listened.
     * Bei Änderungen werden die Headlines neu eingelesen und wieder versteckt, da
     * readmore.de bei einem Klick auf +/- die kompletten Headlines neu lädt.
     *
     * MutationObserver sind in allen modernen Browsern und IE ab v11 supported.
     *
     * Da die +/- Buttons einen Ajax-Request abschicken, müsste man irgendwie einen Callback übergeben,
     * ich habe es aber nicht geschafft, mich in die originale Funktion "sidebar_headlines_setlimit" zu hooken.
     * Ein normaler Click-Listener auf den Buttons hat durch die asynchrone Natur nicht funktioniert.
     */
    this._catchForumsChange = function() {
        try {
            var target = _content.get('forumNavigation')[0],
                config = {
                    childList: true,
                    attributes: false
                };

            MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

            _observer = new MutationObserver(function() {
                // Temporär observer stoppen, sonst deadlock
                _observer.disconnect();
                _self._handleForums();
                _observer.observe(target, config);
            });

            _observer.observe(target, config);
        } catch(e) {
            console.warn('Der MutationObserver konnte nicht initialisiert werden. Nachladen von Foren kann Fehler verursachen!');
        }
    };

    this._handleForums = function() {
        if (_options.getOption('rightColumn_forum_hideForum')) {
            // Foren ausblenden
            _section.hideAll();
            return;
        }

        if (_options.getOption('rightColumn_forum_sections')) {
            _section.process(_sectionOpts, _self.getMappings());
        }
    };

    this.init = function () {
        // Button ums Forum nachzuladen einbauen
        this.addReloadBtn().click(function() {
            _self.reloadForumManually();
        });

        _sectionOpts = _options.getOptionsFuzzy('rightColumn_forums_item_');
        _section = new SidebarSection($, _content.get('forumNavigation'));

        this._handleForums();

        // Wenn NICHT alle Foren ausgeblendet werden sollen muss der Observer gestartet werden
        if (!_options.getOption('rightColumn_forum_hideForum')) {
            this._catchForumsChange();
        }
    };
}

/**
 * Headlines
 * =========
 *
 * Sorgt für das Umsortieren und Ausblenden der Headlines.
 */

function Headlines($, _options, _content) {

    var _self = this,
        _observer = null,
        _section = null,
        _sectionOpts = null,
        _mappings = {
            'cs': 'CS:GO',
            'sc': 'StarCraft II',    // 30+ Minuten debuggt weil das C klein geschrieben war,
                                    // immerhin kenne ich jetzt die SidebarSection Klasse gründlich ;D
            'dota': 'Dota 2',
            'lol': 'League of Legends',
            'hs': 'Hearthstone',
            'wc3': 'Warcraft 3',
            'other': 'Sonstiges'
        };


    /**
     * Öffentlich verfügbar machen, damit wir die Schlagzeilen in den Optionen auslesen können
     * @returns {{cs: string, sc: string, dota: string, lol: string, hs: string, wc3: string, other: string}}
     */
    this.getMappings = function(){
        return _mappings;
    };

    /**
     * Startet einen MutationObserver, der auf DOM-Änderungen im div#headlines_list listened.
     * Bei Änderungen werden die Headlines neu eingelesen und wieder versteckt, da
     * readmore.de bei einem Klick auf +/- die kompletten Headlines neu lädt.
     *
     * MutationObserver sind in allen modernen Browsern und IE ab v11 supported.
     *
     * Da die +/- Buttons einen Ajax-Request abschicken, müsste man irgendwie einen Callback übergeben,
     * ich habe es aber nicht geschafft, mich in die originale Funktion "sidebar_headlines_setlimit" zu hooken.
     * Ein normaler Click-Listener auf den Buttons hat durch die asynchrone Natur nicht funktioniert.
     */
    this._catchHeadlineChange = function() {
        try {
            var target = _content.get('headlines')[0],
                config = {
                    childList: true,
                    attributes: false
                };

            MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

            _observer = new MutationObserver(function() {
                // Temporär observer stoppen, sonst deadlock
                _observer.disconnect();
                _self._handleHeadlines();
                _observer.observe(target, config);
            });

            _observer.observe(target, config);
        } catch(e) {
            console.warn('Der MutationObserver konnte nicht initialisiert werden. Nachladen von Headlines kann Fehler verursachen!');
        }
    };

    this._handleHeadlines = function() {
        if (_options.getOption('rightColumn_headlines_hideHeadlines')) {
            // Schlagzeilen ausblenden
            _section.hideAll();
            // "Schlagzeile einsenden" entfernen
            _content.get('headlines').next('br').hide().next('a').hide();
            return;
        }

        if (_options.getOption('rightColumn_headlines_sections')) {
            _section.process(_sectionOpts, _mappings);
        }
    };

    this.init = function() {
        _sectionOpts = _options.getOptionsFuzzy('rightColumn_headlines_item_');
        _section = new SidebarSection($, _content.get('headlines'));

        this._handleHeadlines();

        // Wenn NICHT alle Headlines ausgeblendet werden sollen muss der Observer gestartet werden
        if (!_options.getOption('rightColumn_headlines_hideHeadlines')) {
            this._catchHeadlineChange();
        }
    };
}

/**
 * IgnoreUser
 * ==========
 *
 * Ermöglicht das Ignorieren von Usern. Angegeben wird die jeweilige User-ID. Der geschriebene Post im Forum,
 * Kommentar im Ticker oder unter den News oder aber Gästebucheintrag wird versteckt.
 */

function IgnoreUser($, _options, _siteLocation, _content){
    var _userIds     = [],
        _$contentElm = $('#c_content');

    this.ignore = function(){
        _readUserIds();

        // Wenn wir uns im Forum befinden und Posts vorhanden sind
        if (_siteLocation.getLocation('forums')){
            if (_content.get('forumPosts').length){
                _ignoreThread();
            }
        }
        else{
            // News, Userprofile (Gästebuch) oder Ticker
            if (_siteLocation.getLocation('news') || _siteLocation.getLocation('users') || _siteLocation.getLocation('matches')){
                _ignoreNews();
            }
        }
    };

    var _readUserIds = function(){
        $(_options.getOption('miscellaneous_ignoreUser_userids').trim().split(',')).each(function(){
            var userId  = Number(this);
            if (userId) _userIds.push(userId);
        });
    };

    /**
     * Ignoriert Posts im Forum
     * @private
     */
    var _ignoreThread = function(){
        var $posts = _$contentElm.find('.forum_post');

        $(_userIds).each(function(){
            $posts.has('span.user a[href*="/' + this + '-"]').each(function(){
                var $postElement            = $(this),
                    $postHeadElement        = $postElement.find('.head'),
                    $toggleTriggerElement   = $('<a class="ignoreUserTrigger">Toggle ignore</a>');

                // Nur ausführen wenn der Posts noch nicht ignoriert wurde
                if (!$postElement.data('ignoreUserTrigger')){
                    // Als ignoriert markieren
                    $postElement.data('ignoreUserTrigger', 1);

                    $postElement.find('div').not($postHeadElement).toggle();
                    $postHeadElement.find('span').prepend($toggleTriggerElement);

                    $toggleTriggerElement.on('click', function(e){
                        e.preventDefault();
                        $postElement.find('div').not($postHeadElement).toggle();
                    });
                }
            });
        });
    };

    /**
     * Ignoriert Posts unter den News, im Ticker und in Gästebüchern
     * @private
     */
    var _ignoreNews = function(){
        var $comments = _$contentElm.find('.comment');

        $(_userIds).each(function(){
            $comments.has('.comment_head > a[href*="/' + this + '-"]').each(function(){
                var $postElement            = $(this),
                    $postHeadElement        = $postElement.find('.comment_head'),
                    $postCommentElement     = $postElement.find('.comment_con'),
                    $toggleTriggerElement   = $('<a class="ignoreUserTrigger">Toggle ignore</a>');

                if (!$postElement.data('ignoreUserTrigger')){
                    // Als ignoriert markieren
                    $postElement.data('ignoreUserTrigger', 1);

                    $postElement.find('>div').not($postCommentElement).toggle();
                    $postCommentElement.find('>*').not($postHeadElement).not('textarea').toggle();
                    $postHeadElement.find('.comment_counter').prepend($toggleTriggerElement);

                    $toggleTriggerElement.on('click', function(e){
                        e.preventDefault();
                        $postElement.find('>div').not($postCommentElement).toggle();
                        $postCommentElement.find('>*').not($postHeadElement).not('textarea').toggle();
                    });
                }
            });
        });
    };
};
function LoadingScreen(){
    var _loadingElement = null,
        _loadingTextElement = null;

    this.showLoadingScreen = function(){
        var container = document.createElement('div'),
            innerDiv = document.createElement('div'),
            spanText = document.createElement('span'),
            IconImg = document.createElement('img');

        container.id = 'userscriptRealoadFavoritesContainer';
        spanText.id = 'userscriptRealoadFavoritesContainerText';
        IconImg.src = 'data:image/gif;base64,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';

        innerDiv.appendChild(IconImg);
        innerDiv.appendChild(spanText);
        container.appendChild(innerDiv);

        _loadingTextElement = spanText;
        _loadingElement = container;
        document.body.appendChild(_loadingElement);
    };

    this.removeLoadingScreen = function(){
        document.body.removeChild(_loadingElement);
    };

    this.changeLoadingMessage = function(text){
        _loadingTextElement.innerText = text;
    };

}
/**
 * [Miscellaneous description]
 */

function Miscellaneous($, _content) {

    /**
     * [createFixedToolbar description]
     * @return {[type]}
     */
    this.createFixedToolbar = function() {
        $("div#header").css({
            "position": "fixed",
            "zIndex": 10,
            "top": 0
        });
        $("div#monkey").css("margin-top", "88px");
    };

    /**
     * Vergrößert den Content-Bereich um 200px.
     * Sorgt leider für ein "Flackern" wenn man die Seite lädt, da das CSS relativ spät geladen wird.
     * Lässt sich glaube ich nicht ändern im Userscript.
     */
    this.makeContentWider = function() {
        var maxWidth = 1200,
            leftSidebarWidth = $("#c_left").outerWidth(),
            rightSidebarWidth = $("#c_right").outerWidth(),
            sidebarsWidth = !leftSidebarWidth ? rightSidebarWidth + 1 : !rightSidebarWidth ? leftSidebarWidth + 1 : (leftSidebarWidth && rightSidebarWidth) ? leftSidebarWidth + rightSidebarWidth : 1200,
            padding = 4,
            siteLocation = new SiteLocation($);

        $("#header > div > div").css({
            "width": maxWidth + "px"
        });

        $("#monkey").css({
            "maxWidth": maxWidth + "px",
            "width": maxWidth + "px"
        });

        $("#container").css({
            "width": maxWidth + "px"
        });

        $("#c_content").css({
            "width": (maxWidth - sidebarsWidth - padding) + "px"
        });

        // fixt den Livestream Bereich
        if(siteLocation.getLocation("livestreams")) {
            // vergroessert die Livestream Thumbnails im Highlight Bereich um 30%
            $("#c_content > .livestream_highlights").find(".livestream_cap > img").each(function() {
                $(this).css("height", $(this).height() * 1.3 + "px");
                $(this).css("width", $(this).width() * 1.3 + "px");
            });
        }

        // fixt den VOD Bereich
        if(siteLocation.getLocation("vods")) {
            //vergroessert die VOD Thumbnails im Highlight Bereich um 30%
            $("#c_content > .vod_highlights").find(".vod_thumb > img").each(function() {
                $(this).css("height", $(this).height() * 1.3 + "px");
                $(this).css("width", $(this).width() * 1.3 + "px");
            });

            // veraendert die Margins der VOD Thumbnails, damit sie sauber in einer Reihe angezeigt werden
            $("#c_content > .vod_videos_list > li").each(function() {
                $(this).css("margin", "0px 10px 10px 10px");
            });
        }

        // fixt den Gallery Bereich
        if(siteLocation.getLocation("gallery")) {
            // verandert die Margins der Thumbnails, damit sie saber in einer Reihe angezeigt werden
            $("#c_content > .gallery_albums > li").each(function() {
                $(this).css("margin", "0px 5px 5px 10px");
            });
        }

        // fixt den verzerrten YouTube Player im Forum
        if(siteLocation.getLocation("forums")) {
            $(".forum_ed_youtube embed").each(function() {
                $(this).css("height", $(this).parent().parent().width() * (9 / 16) + "px");
                $(this).parent().css("height", $(this).parent().parent().width() * (9 / 16) + "px");
            });
        }

        // fixt den verzerrten YouTube Player in den News
        if (siteLocation.getLocation("news")) {
            $("iframe").each(function () {
                if ($(this).attr("src").match(/^http[s]?:\/\/(?:www\.)?youtube.com\/embed\/\w+(&\S*)?$/)) {
                    $(this).css("height", $(this).width() * (9 / 16) + "px");
                }
            })
        }

        // fixt den verzerrten YouTube Player in den Schlagzeilen
        if (siteLocation.getLocation("headlines")) {
            $("iframe").each(function () {
                if ($(this).attr("src").match(/^http[s]?:\/\/(?:www\.)?youtube.com\/embed\/\w+(&\S*)?$/)) {
                    $(this).css("height", $(this).width() * (9 / 16) + "px");
                }
            })
        }
    };

    /**
     * Ändert den Pfeil im Forum so, dass er zum letzten Post springt, nicht zum letzten gelesenen.
     */
    this.changeForumArrowBehavior = function() {
        _content.get('forumNavigation')
            .find('img[src$=\'arrow_last_item2.gif\']')
            .each(function() {

                var parentA = this.parentElement;
                parentA.href = parentA.href + '#plast';
        });
    };

    /**
     * Sortiert den Thread-Titel um, sodass dieser an erster Stelle steht.
     */
    this.resortTitle = function () {
        var title = $('head').find('title').text();
        var pieces = title.split(' \u00BB Thread: ');

        document.title = pieces.reverse().join(' \u00BB ').replace(/^Thread:\W+/, '');
    };

    this.buttonScrollUp = function(){
        $('#c_content h2:last').append('<i id="icon_miscellaneous_buttonScrollUp" class="rmus-icon rmus-icon-angle-double-up" title="Nach oben scrollen"></i>')
            .find('#icon_miscellaneous_buttonScrollUp')
            .on('click', function(){
                window.scrollTo(0, 0);
            });
    };

    this.buttonScrollDown = function(){
        $('#c_content h1:first').append('<i id="icon_miscellaneous_buttonScrollDown" class="rmus-icon rmus-icon-angle-double-down" title="Nach unten scrollen"></i>')
            .find('#icon_miscellaneous_buttonScrollDown')
            .on('click', function(){
                window.scrollTo(0, document.body.offsetHeight);
            });
    };

    this.hideBetKing = function(){
        _content.get('betKing').hide();
    };
}

/**
 * Options
 * =======
 *
 * Pseudoklasse um die Optionen des Userscript zu handeln. Braucht zum instanziieren keine weiteren
 * Parameter, ruft direkt die _init() Methode auf um die Settings auszulesen.
 */

function Options($) {
    /**
     * Name der benutzt wird um die Optionen im Localstorage zu speichern.
     * @type {string}
     */
    var LOCALSTORAGE_NAME = 'userscriptOptions';

    /**
     * Name der benutzt wird um das Backup der Optionen im Localstorage zu speichern.
     * @type {string}
     */
    var LOCALSTORAGE_NAME_BACKUP = 'userscriptOptionsBackup';

    /**
     * Um das Object aus privaten Methoden heraus ansprechen zu können.
     * @type {Options}
     * @private
     */
    var _self = this;

    /**
     * Version des Scriptes, wird durch GrundJS im Buildprozess ersetzt.
     * @type {string}
     * @private
     */
    var _version = '4.6.1';

    /**
     * Property für die Optionen. Werden über entsprechende Methoden abgefragt, sind daher
     * nicht mehr public.
     * @type {{}}
     * @private
     */
    var _options = {};

    /**
     * Missbrauche diese Funktion einfach mal als Konstuktor-Ersatz. Finde es einfach schöner
     * dafür eine separate Methode zu haben. Wird als letzte Zeile ausgerufen.     *
     * @private
     */
    var _init = function() {
        // Optionen aus dem Localstorage auslesen
        _readOptionsFromLocalstorage();
    };

    /**
     * Funktion um den Wert einer bestimmten Option zurückzugeben.
     * @param {String} what
     */
    this.getOption = function(what) {
        return _options[what];
    };

    /**
     * Gibt das Data Object zurück
     * @returns {*}
     */
    this.getData = function(key){
        return _options['dataStorage'][key];
    };

    /**
     * Setzt eine Value in dem Data Object.
     * @param key
     * @param value
     */
    this.setData = function(key, value){
        _options['dataStorage'][key] =  value;
    };

    /**
     * Speichert die Optionen ohne sie neu aus dem HTML auszulesen.
     */
    this.saveCurrentOptions = function(){
        localStorage.setItem(LOCALSTORAGE_NAME, JSON.stringify(_options));
    };

    /**
     * Gibt alle Optionen zurück, die auf die "Wildcard" zutreffen.
     * @param {String} what
     */
    this.getOptionsFuzzy = function(what) {
        var options = {},
            len = what.length;

        for (var opt in _options) {
            if (_options.hasOwnProperty(opt) && what === opt.substr(0, len)){
                options[opt] = _options[opt];
            }
        }

        return options;
    };

    /**
     * Gibt die aktuelle Version zurück.
     * @returns {string}
     */
    this.getVersion = function() {
        return _version;
    };

    /**
     * Fügt zuerst den Quellcode der Optionen in die Seite ein, danach den Link / das Icon zum öffnen
     * und zuletzt die diversen Eventhandler.
     */
    this.insertOptions = function() {
        // Optionen einfügen
        $('body').append('<style>#userscriptOptions{color:#000;font-family:Verdana,sans-serif;font-size:12px}a#openUserscriptOptions{margin-top:4px;display:inline-block}#header ul.line li.userscriptOptionsLi{color:#dadada;font-size:16px;padding-top:0;margin-right:5px}div#userscriptOptionsOverlay{position:fixed;top:0;left:0;width:100%;height:100%;z-index:2147483645;display:none;background-color:#fff;opacity:.8}#userscriptOptions.rmus-options{display:none;box-shadow:0 0 6px 1px #BEBEBE;position:fixed;width:600px;left:50%;margin-left:-300px;top:75px;border:1px solid silver;border-radius:3px;background-color:#fff;z-index:2147483646}#userscriptOptions .rmus-options-header{border-bottom:3px solid #007BFF;padding:10px 18px;color:#fff;background:#3e3e3e;background:-moz-linear-gradient(top,#3e3e3e 0,#242424 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0%,#3e3e3e),color-stop(100%,#242424));background:-webkit-linear-gradient(top,#3e3e3e 0,#242424 100%);background:-o-linear-gradient(top,#3e3e3e 0,#242424 100%);background:-ms-linear-gradient(top,#3e3e3e 0,#242424 100%);background:linear-gradient(to bottom,#3e3e3e 0,#242424 100%)}#userscriptOptions .rmus-options-header h1{font-size:16px;text-transform:uppercase;float:left;text-shadow:1px 1px #0063A5;color:#fff;margin-bottom:0!important;font-family:Arial,sans-serif!important;font-weight:400!important}#userscriptOptions .rmus-options-header a{color:#fff;border-bottom:1px dotted #fff}#userscriptOptions .rmus-options-header a:hover{text-decoration:none}#userscriptOptions .rmus-options-header .rmus-links{float:right;margin-top:2px}#userscriptOptions .rmus-options-header .rmus-links .rmus-version{font-weight:700}#userscriptOptions .rmus-options-header-divider{height:1px;background-color:#000}#userscriptOptions .rmus-options-content{overflow-y:scroll}#userscriptOptions .rmus-options-content table{border:none;width:100%;margin-top:-1px}#userscriptOptions .rmus-options-content table tr.menuparent{background-color:#fff!important;padding:0}#userscriptOptions .rmus-options-content table tr.menufirstchild{display:none;margin:0;padding:0}#userscriptOptions .rmus-options-content table tr.menufirstchild td{background-color:#f1f1f1!important}#userscriptOptions .rmus-options-content table tr.menufirstchild td:nth-child(2){padding-left:20px}#userscriptOptions .rmus-options-content table tr.menusecondchild{display:none;margin:0;padding:0}#userscriptOptions .rmus-options-content table tr.menusecondchild td{background-color:#e2e2e2!important}#userscriptOptions .rmus-options-content table tr.menusecondchild td:nth-child(2){padding-left:40px}#userscriptOptions .rmus-options-content table .headline td{color:#7A7A7A!important;font-size:14px;margin:0;padding:5px 0 5px 50px!important;width:100%;border-top:1px solid #ccc;border-bottom:1px solid #ccc;background:#f2f5f6;background:-moz-linear-gradient(top,#f2f5f6 0,#e3eaed 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0%,#f2f5f6),color-stop(100%,#e3eaed));background:-webkit-linear-gradient(top,#f2f5f6 0,#e3eaed 100%);background:-o-linear-gradient(top,#f2f5f6 0,#e3eaed 100%);background:-ms-linear-gradient(top,#f2f5f6 0,#e3eaed 100%);background:linear-gradient(to bottom,#f2f5f6 0,#e3eaed 100%)!important}#userscriptOptions td{padding-left:0;padding-right:0;height:35px}#userscriptOptions td:nth-child(1){width:10%}#userscriptOptions td:nth-child(2){width:65%}#userscriptOptions td:nth-child(3){width:15%}#userscriptOptions td:nth-child(4){width:10%}#userscriptOptions .rmus-options-footer{text-align:right;padding:8px 10px;border-top:1px solid #ccc;background:#fff;background:-moz-linear-gradient(top,#fff 0,#ededed 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0%,#fff),color-stop(100%,#ededed));background:-webkit-linear-gradient(top,#fff 0,#ededed 100%);background:-o-linear-gradient(top,#fff 0,#ededed 100%);background:-ms-linear-gradient(top,#fff 0,#ededed 100%);background:linear-gradient(to bottom,#fff 0,#ededed 100%)}#userscriptOptions .rmus-options-footer #rmus-options-imexport{clear:both;text-align:left;margin-top:10px;display:none}#userscriptOptions .rmus-options-footer #rmus-options-imexport .rmus-options-imexport-help{font-size:10px}#userscriptOptions .rmus-options-footer #rmus-options-imexport textarea{width:568px;font-family:Verdana;font-size:10px;padding:5px;margin:5px 0 3px;height:40px}#userscriptOptions input[type=checkbox],#userscriptOptions input[type=select],#userscriptOptions input[type=text]{margin:0;padding:0}#userscriptOptions input[type=color],#userscriptOptions input[type=number],#userscriptOptions input[type=text],#userscriptOptions select,#userscriptOptions textarea{display:block;background:#fdfdfd!important;font-size:11px;color:#7b7b7b!important;border:1px solid #ccc;text-align:right;padding:1px 5px}#userscriptOptions input[type=color],#userscriptOptions input[type=number],#userscriptOptions input[type=text]{width:80%}#userscriptOptions .rmus-options-footer input[type=button]{color:#000!important}#userscriptOptions .rmus-options-footer #saveUserscriptOptions{color:#fff!important}#sub_rightColumn_forum_sections_sortable,#sub_rightColumn_headlines_hideHeadlines_sortable{width:100%}#sub_rightColumn_forum_sections_sortable>div>span,#sub_rightColumn_headlines_hideHeadlines_sortable>div>span{display:block;margin-bottom:15px}#sub_rightColumn_forum_sections_sortable ul,#sub_rightColumn_headlines_hideHeadlines_sortable ul{width:100%;background:#fff!important;min-height:100px;padding:1px 0}#sub_rightColumn_forum_sections_sortable li,#sub_rightColumn_headlines_hideHeadlines_sortable li{width:95%;padding:2%;background:#e2e2e2;outline:#ccc solid 1px;list-style:none;height:22px;margin:8px 2.5%;cursor:move}#sub_rightColumn_forum_sections_sortable>div:nth-child(1),#sub_rightColumn_headlines_hideHeadlines_sortable>div:nth-child(1){width:50%;float:left}#sub_rightColumn_forum_sections_sortable>div:nth-child(2),#sub_rightColumn_headlines_hideHeadlines_sortable>div:nth-child(2){width:50%;float:right}#sub_rightColumn_forum_sections_sortable>div:nth-child(3),#sub_rightColumn_headlines_hideHeadlines_sortable>div:nth-child(3){clear:both}.btn-rm{border:1px solid #ccccce;color:#222!important;font-family:Verdana;font-size:10px;min-height:14px;padding:4px 8px;background:#fff;background:-moz-linear-gradient(top,#fff 0,#e4e4e4 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0%,#fff),color-stop(100%,#e4e4e4));background:-webkit-linear-gradient(top,#fff 0,#e4e4e4 100%);background:-o-linear-gradient(top,#fff 0,#e4e4e4 100%);background:-ms-linear-gradient(top,#fff 0,#e4e4e4 100%);background:linear-gradient(to bottom,#fff 0,#e4e4e4 100%)}.btn-rm.primary{color:#fff!important;border-color:#006DE4;background:#2890ff;background:-moz-linear-gradient(top,#2890ff 0,#1d7add 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0%,#2890ff),color-stop(100%,#1d7add));background:-webkit-linear-gradient(top,#2890ff 0,#1d7add 100%);background:-o-linear-gradient(top,#2890ff 0,#1d7add 100%);background:-ms-linear-gradient(top,#2890ff 0,#1d7add 100%);background:linear-gradient(to bottom,#2890ff 0,#1d7add 100%)}.rmus-icon{font-size:18px!important;color:#19A1EC!important}#icon_miscellaneous_buttonScrollDown,#icon_miscellaneous_buttonScrollUp,#moveTextareaTopTrigger,#userscriptForumFavorites{float:right;cursor:pointer}#moveTextareaTopTrigger{margin-right:10px;margin-top:-2px;padding:2px;font-size:13px}#icon_miscellaneous_buttonScrollDown:hover,#icon_miscellaneous_buttonScrollUp:hover,#moveTextareaTopTrigger:hover,#userscriptForumFavorites:hover{color:#FFB400!important}.forum_thread_reply{margin-bottom:15px}.ignoreUserTrigger:after{content:"\\00a0\\00a0|\\00a0\\00a0";color:#7b7b7b}.comment,.comment .comment_con{min-height:inherit!important}#userscript_reloadForumButton{color:#999;font-size:17px!important}.favLastArrow{margin-left:12px;margin-right:4px}.userNicknames{width:5px;height:5px;display:inline;font-size:11px!important;color:grey}.userscriptOptionsLi .checkUpdate{font-size:11px;vertical-align:top;padding-top:6px;display:inline-block;color:red}#userscriptRealoadFavoritesButton{cursor:pointer;color:#999;font-size:16px!important}#userscriptRealoadFavoritesContainer{box-shadow:0 0 6px 1px #BEBEBE;position:fixed;width:300px;left:50%;margin-left:-180px;margin-top:-60px;top:50%;border:1px solid silver;border-radius:3px;background-color:#fff;z-index:2147483647;min-height:115px;padding:10px;color:#000}#userscriptRealoadFavoritesContainer>div{text-align:center}#userscriptRealoadFavoritesContainer img{margin-top:10px;padding-bottom:20px}#userscriptRealoadFavoritesContainer span{display:block;width:100%;text-align:center}#userscriptBettingControl>div{width:25px;float:right;padding-bottom:10px;text-align:right}#userscriptBettingControl img{width:14px;padding-bottom:5px}#userscriptBettingControl:after{content:".";clear:both;display:block;visibility:hidden;height:0}.userscriptBetting hr{display:none}.userscriptBetting{border-top:1px solid #e4e4e4;padding-top:10px}.newPostFavs{font-weight:700!important}@font-face{font-family:rmus;src:url(../font/rmus.eot?68757660);src:url(../font/rmus.eot?68757660#iefix) format(\'embedded-opentype\'),url(../font/rmus.svg?68757660#rmus) format(\'svg\');font-weight:400;font-style:normal}@font-face{font-family:rmus;src:url(data:application/octet-stream;base64,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) format(\'woff\'),url(data:application/octet-stream;base64,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) format(\'truetype\')}[class*=" rmus-icon-"]:before,[class^=rmus-icon-]:before{font-family:rmus;font-style:normal;font-weight:400;speak:none;display:inline-block;text-decoration:inherit;width:1em;margin-right:.2em;text-align:center;font-variant:normal;text-transform:none;line-height:1em;margin-left:.2em}.rmus-icon-plus-circled:before{content:\'\\e800\'}.rmus-icon-cog:before{content:\'\\e801\'}.rmus-icon-search:before{content:\'\\e802\'}.rmus-icon-minus-circled:before{content:\'\\e803\'}.rmus-icon-arrows-cw:before{content:\'\\e804\'}.rmus-icon-angle-double-up:before{content:\'\\e805\'}.rmus-icon-angle-double-down:before{content:\'\\e806\'}.rmus-icon-star-empty:before{content:\'\\e807\'}.rmus-icon-star:before{content:\'\\e808\'}.rmus-icon-list:before{content:\'\\e809\'}</style><div id="userscriptOptions" class="rmus-options"><div class="rmus-options-wrapper"><div class="rmus-options-header"><h1>RM Userscript - Optionen</h1><div class="rmus-links"><a href="/forums/91-technik/60-software/111239-readmore-userscript-chrome-extension">Thread</a> | Version <span class="rmus-version">4.6.1</span></div><div style="clear:both"></div></div><div class="rmus-options-header-divider"></div><div class="rmus-options-content"><table><tr class="headline"><td colspan="4">Funktionen</td></tr><tr class="menuparent"><td align="center"><i id="toggle_sub_middleColumn_forum_reloadPosts_readNewPosts" title="Weitere Optionen" class="rmus-icon rmus-icon-plus-circled"></i></td><td align="left">Neue Forenbeiträge im Hintergrund nachladen</td><td align="right"><input type="checkbox" class="userscriptOptions" name="middleColumn_forum_reloadPosts_readNewPosts"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Neue Beiträge im Readmore.de-Froum werden automatisch nachgeladen. Ein Refresh des Threads entfällt somit."></i></td></tr><tr class="menufirstchild sub_middleColumn_forum_reloadPosts_readNewPosts"><td align="center"><i id="toggle_sub_middleColumn_forum_reloadPosts_endlessPage" title="Weitere Optionen" class="rmus-icon rmus-icon-plus-circled"></i></td><td align="left">Seite endlos erweitern</td><td align="right"><input type="checkbox" class="userscriptOptions" name="middleColumn_forum_reloadPosts_endlessPage"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Neue Posts werden einfach eingeblendet. Es muss also nicht mehr auf eine neue Seite gewechselt werden."></i></td></tr><tr class="menusecondchild sub_middleColumn_forum_reloadPosts_endlessPage"><td align="center"></td><td align="left">Automatisch zu neuen Posts scrollen/springen</td><td align="right"><input type="checkbox" class="userscriptOptions" name="middleColumn_forum_reloadPosts_jumpToNewPosts"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Springt zu neuen posts."></i></td></tr><tr class="menusecondchild sub_middleColumn_forum_reloadPosts_endlessPage"><td align="center"></td><td align="left">Zeit zwischen zwei Sprüngen</td><td align="right"><input type="number" class="userscriptOptions" name="middleColumn_forum_reloadPosts_jumpToNewPosts_waitUntilNextJump" value="10"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Zeit in Sekunden, die zwischen 2 Sprüngen mindestens vergehen muss."></i></td></tr><tr class="menufirstchild sub_middleColumn_forum_reloadPosts_readNewPosts"><td align="center"><i id="toggle_sub_middleColumn_forum_reloadPosts_markNewPosts" title="Weitere Optionen" class="rmus-icon rmus-icon-plus-circled"></i></td><td align="left">Neue Einträge farblich markieren</td><td align="right"><input type="checkbox" class="userscriptOptions" name="middleColumn_forum_reloadPosts_markNewPosts"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Die neu eingetragenen Posts werden markiert."></i></td></tr><tr class="menusecondchild sub_middleColumn_forum_reloadPosts_markNewPosts"><td align="center"></td><td align="left">Farbe auswählen (HEX-Code)</td><td align="right"><input type="color" class="userscriptOptions" name="middleColumn_forum_reloadPosts_markPostColor" value="#EEEEEE"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Bitte eine HEX Zahl eingeben. Beispiel: #FFEE11"></i></td></tr><tr class="menusecondchild sub_middleColumn_forum_reloadPosts_markNewPosts"><td align="center"></td><td align="left">Ungelesene Posts im Titel / Tab anzeigen</td><td align="right"><input type="checkbox" class="userscriptOptions" name="middleColumn_forum_reloadPosts_showNewPostsTitle"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Die Anzahl der Ungelesenen Posts im Tab anzeigen."></i></td></tr><tr class="menusecondchild sub_middleColumn_forum_reloadPosts_markNewPosts"><td align="center"></td><td align="left">Favicon verändern</td><td align="right"><input type="checkbox" class="userscriptOptions" name="middleColumn_forum_reloadPosts_changeFavicon"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Bei ungelesenen Posts das Favicon verändern."></i></td></tr><tr class="menufirstchild sub_middleColumn_forum_reloadPosts_readNewPosts"><td align="center"></td><td align="left">Zeit zwischen dem Nachladen (Sekunden)</td><td align="right"><input type="number" class="userscriptOptions" name="middleColumn_forum_reloadPosts_timeToWait" value="15"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Sekunden die zwischen dem Nachladen gewartet werden muss."></i></td></tr><tr class="menuparent"><td align="center"><i id="toggle_sub_miscellaneous_ignoreUser" title="Weitere Optionen" class="rmus-icon rmus-icon-plus-circled"></i></td><td align="left">Readmore User ignorieren</td><td align="right"><input type="checkbox" class="userscriptOptions" name="miscellaneous_ignoreUser"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Blendet Foreneinträge, Tickercomments und Gästebucheinträge aus."></i></td></tr><tr class="menufirstchild sub_miscellaneous_ignoreUser"><td align="center"></td><td align="left">Userids (kommasepariert)</td><td align="right"><input type="text" class="userscriptOptions" name="miscellaneous_ignoreUser_userids" value=" "></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Beispielsweise: 9021,1,3"></i></td></tr><tr class="menuparent"><td align="center"><i id="toggle_sub_middleColumn_forum_scrollForNewPage" title="Weitere Optionen" class="rmus-icon rmus-icon-plus-circled"></i></td><td align="left">Scrollen bis zum Seitenende lädt die Nächste</td><td align="right"><input type="checkbox" class="userscriptOptions" name="middleColumn_forum_scrollForNewPage"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Beim ereichen des letzten Posts ggf. die nächste Seite nachladen."></i></td></tr><tr class="menufirstchild sub_middleColumn_forum_scrollForNewPage"><td align="center"></td><td align="left">Postbox nach oben verschieben</td><td align="right"><input type="checkbox" class="userscriptOptions" name="middleColumn_forum_hideForum_editboxTop"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Verschiebt die Box zum Posten an den Anfang der Seite."></i></td></tr><tr class="menuparent"><td align="center"></td><td align="left">Beiträge ohne Reload senden</td><td align="right"><input type="checkbox" class="userscriptOptions" name="middleColumn_forum_postPerAjax"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Beiträge werden im Hintergrund gepostet. Ein manueller Refresh der Seite entfällt."></i></td></tr><tr class="menuparent"><td align="center"></td><td align="left">Forennavigation aktualisieren</td><td align="right"><input type="checkbox" class="userscriptOptions" name="rightColumn_forum_reloadForum"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Aktualisiert die Navigation des Forums (unten rechts) im Hintergund."></i></td></tr><tr class="menuparent"><td align="center"></td><td align="left">Nickname History Link</td><td align="right"><input type="checkbox" class="userscriptOptions" name="miscellaneous_nicknameHistoryLink"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Fügt einen Link neben dem Username ein, um schnell auf die Nickname History eines Users zugreifen zu können"></i></td></tr><tr class="menuparent"><td align="center"></td><td align="left">Threads favorisieren</td><td align="right"><input type="checkbox" class="userscriptOptions" name="forumFavorites"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Erlaubt es Threads zu den Favoriten hinzuzufügen. Diese werden dann in der Threadnavigation angezeigt. Damit die Favoriten beim Umsortieren mit angezeigt werden, müssen die Optionen gespeichert und erneut aufgerufen werden. Dann können die Favoriten zugeordnet werden."></i></td></tr><tr class="menuparent"><td align="center"></td><td align="left">Spiele in den offenen Wetten ausblenden</td><td align="right"><input type="checkbox" class="userscriptOptions" name="bettingOverview"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Erlaubt es einzelne Spiele in der Übersicht auszublenden."></i></td></tr><tr class="headline"><td colspan="4">Optische Veränderungen</td></tr><tr class="menuparent"><td align="center"><i id="toggle_sub_rightColumn_forum_hideForum" title="Weitere Optionen" class="rmus-icon rmus-icon-plus-circled"></i></td><td align="left">Foren ausblenden und umsortieren</td><td align="right"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Das Forum ausblenden oder umsortieren."></i></td></tr><tr class="menufirstchild sub_rightColumn_forum_hideForum"><td align="center"></td><td align="left">Komplett ausblenden</td><td align="right"><input type="checkbox" class="userscriptOptions" name="rightColumn_forum_hideForum"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Das komplette Forum ausblenden."></i></td></tr><tr class="menufirstchild sub_rightColumn_forum_hideForum"><td align="center"><i id="toggle_sub_rightColumn_forum_sections" title="Weitere Optionen" class="rmus-icon rmus-icon-plus-circled"></i></td><td align="left">Foren umsortieren</td><td align="right"><input type="checkbox" class="userscriptOptions" name="rightColumn_forum_sections"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Ermöglicht das Umsortieren des Forums."></i></td></tr><tr class="menusecondchild sub_rightColumn_forum_sections"><td align="center"></td><td colspan="3"><div id="sub_rightColumn_forum_sections_sortable"><div><span>Nicht angezeigte Elemente</span><ul class="conncected list forum"></ul></div><div><span>Sortierung</span><ul class="conncected list forum"></ul></div><div></div></div></td></tr><tr class="menuparent"><td align="center"><i id="toggle_sub_rightColumn_headlines_hideHeadlines" title="Weitere Optionen" class="rmus-icon rmus-icon-plus-circled"></i></td><td align="left">Schlagzeilen ausblenden und umsortieren</td><td align="right"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Bestimmte oder alle Schlagzeilen ausblenden"></i></td></tr><tr class="menufirstchild sub_rightColumn_headlines_hideHeadlines"><td align="center"></td><td align="left">Komplett ausblenden</td><td align="right"><input type="checkbox" class="userscriptOptions" name="rightColumn_headlines_hideHeadlines"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Blendet alle Schlagzeilen aus."></i></td></tr><tr class="menufirstchild sub_rightColumn_headlines_hideHeadlines"><td align="center"><i id="toggle_sub_rightColumn_headlines_sections" title="Weitere Optionen" class="rmus-icon rmus-icon-plus-circled"></i></td><td align="left">Schlagzeilen umsortieren</td><td align="right"><input type="checkbox" class="userscriptOptions" name="rightColumn_headlines_sections"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Ermöglicht das Umsortieren des Forums."></i></td></tr><tr class="menusecondchild sub_rightColumn_headlines_sections"><td align="center"></td><td colspan="3"><div id="sub_rightColumn_headlines_hideHeadlines_sortable"><div><span>Nicht angezeigte Elemente</span><ul class="conncected list headlines"></ul></div><div><span>Sortierung</span><ul class="conncected list headlines"></ul></div><div></div></div></td></tr><tr class="menuparent"><td align="center"></td><td align="left">Fixierter Header</td><td align="right"><input type="checkbox" class="userscriptOptions" name="miscellaneous_fixedToolbar"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Der Header wird am oberen Fensterrand fixiert."></i></td></tr><tr class="menuparent"><td align="center"></td><td align="left">Breiteres Design</td><td align="right"><input type="checkbox" class="userscriptOptions" name="miscellaneous_makeContentWider"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Erhöht die Breite des Contents um 200px"></i></td></tr><tr class="menuparent"><td align="center"></td><td align="left">Ticker ausblenden</td><td align="right"><input type="checkbox" class="userscriptOptions" name="rightColumn_ticker_hideTicker"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Der Ticker wird komplett ausgeblendet."></i></td></tr><tr class="menuparent"><td align="center"></td><td align="left">Wettkönig ausblenden</td><td align="right"><input type="checkbox" class="userscriptOptions" name="rightColumn_hideBetKing"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Der Wettkönig wird komplett ausgeblendet."></i></td></tr><tr class="headline"><td colspan="4">Sonstiges</td></tr><tr class="menuparent"><td align="center"></td><td align="left">Titel / Tab umsortieren</td><td align="right"><input type="checkbox" class="userscriptOptions" name="miscellaneous_reSortTitle"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Wenn diese Option aktiviert ist, wird der Threadname an den Anfang des Titels gestellt. Offene Tabs können so besser den verschiedenen Threads zugeordnet werden."></i></td></tr><tr class="menuparent"><td align="center"></td><td align="left">Button zum Hochscrollen anzeigen</td><td align="right"><input type="checkbox" class="userscriptOptions" name="miscellaneous_buttonScrollUp"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Im Forum wird ein Icon eingefügt, beim betätigen wird zum ersten Post gesprungen."></i></td></tr><tr class="menuparent"><td align="center"></td><td align="left">Button zum Runterscrollen anzeigen</td><td align="right"><input type="checkbox" class="userscriptOptions" name="miscellaneous_buttonScrollDown"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Im Forum wird ein Icon eingefügt, beim betätigen wird zum letzten Post gesprungen."></i></td></tr><tr class="menuparent"><td align="center"></td><td align="left">Last-Page-Pfeil springt zum letzten Post</td><td align="right"><input type="checkbox" class="userscriptOptions" name="miscellaneous_lastPageJumpToLastPost"></td><td align="right"><i class="rmus-icon rmus-icon-search" title="Nach dem Betätigen des Pfeils (ganz Recht im Forum, hinter den Threads) wird zum aktuellsten Post gesprungen."></i></td></tr></table></div><div class="rmus-options-footer"><div style="float:left"><input class="btn-rm imexp" type="button" id="importUserscriptOptions" value="Import">&nbsp; <input class="btn-rm imexp" type="button" id="exportUserscriptOptions" value="Export"></div><input class="btn-rm" type="button" id="closeUserscriptOptions" value="Abbrechen">&nbsp; <input class="btn-rm primary" type="button" value="Speichern" id="saveUserscriptOptions"><div id="rmus-options-imexport"><div class="rmus-options-imexport-help"></div><textarea class="btn-rm"></textarea><input class="btn-rm primary" style="margin-right:4px" type="button" value="Importieren" id="importUserscriptOptionsBtn"> <input class="btn-rm" type="button" value="Schlie&szlig;en" id="imexportUserscriptOptionsCloseBtn"></div></div></div></div><div id="userscriptOptionsOverlay"></div>');

        // Link einfügen
        $('div#header li.ucp').after('<li class="userscriptOptionsLi"><a id="openUserscriptOptions" href="" title="Userscript"><i class="rmus-icon rmus-icon-cog"></i></a> | </li>');
        $('div#header li.socials').css('margin-left', '0px');

        // Eventhandler
        _addEventHandler();
    };

    /**
     * Liest die Optionen aus dem HTML aus und speichert sie anschließend als JSON-String den Localstorage
     * des Browsers. Gibt im Fehlerfall eine einfache Meldung zurück.
     * @return {boolean}
     */
    this.saveOptions = function() {
        _readOptionsFromHTML();
        _readSortableLists();

        try {
            localStorage.setItem(LOCALSTORAGE_NAME, JSON.stringify(_options));
        } catch (e) {
            alert('Es ist ein Fehler beim Speichern aufgetreten: ' + e);
            return false;
        }

        return true;
    };

    /**
     * Funktion um die Optionen als JSON-String auszulesen und zurück zu geben. Wird für den
     * Export der Settings benutzt.
     * @returns {String}
     */
    this.getOptionsRaw = function() {
        return localStorage.getItem(LOCALSTORAGE_NAME);
    };

    /**
     * Funktion um die Optionen als JSON-String zu übergeben und in den Localstorage zu speichern. Wird für
     * den Import benutzt.
     * @param options {String}
     */
    this.setOptionsRaw = function(options) {
        localStorage.setItem(LOCALSTORAGE_NAME, options + "");
    };

    /**
     * Sichert die aktuelle Konfiguration für Backupzwecke. Falls ein Import schief geht kann so der alte
     * Stand wieder hergestellt werdne.
     */
    this.backupOptions = function() {
        localStorage.setItem(LOCALSTORAGE_NAME_BACKUP, localStorage.getItem(LOCALSTORAGE_NAME));
    };

    /**
     * Blendet das Fenster mit den Optionen ein.
     */
    this.showOptions = function() {
        _self.writeOptionsToHTML();
        _displaySortableLists();

        $('div#userscriptOptionsOverlay').fadeIn(200, function() {
            // Reset scroll
            $('div#userscriptOptions div.rmus-options-content').animate({
                scrollTop: 0
            }, 50);

            // Im-/Export ausblenden
            $('div#rmus-options-imexport').hide();
            $('div#userscriptOptions').fadeIn(250);

            // Dynamische Content-Höhe
            $(window).ready(function() {
                var height =  $(window).height()-350; $('div#userscriptOptions div.rmus-options-content').height(height);
                $(window).resize(function(){var height =  $(window).height()-350; $('div#userscriptOptions div.rmus-options-content').height(height);});
            });
        });
    };

    /**
     * Schließt das Fenster mit den Optionen.
     */
    this.hideOptions = function() {
        $('div#userscriptOptions').fadeOut(250, function() {
            $('div#userscriptOptionsOverlay').fadeOut(200);
        });

        _readOptionsFromLocalstorage();
    };

    /**
     * Private Methode um die aktuellen Einstellung aus den Input-Feldern der Optionen auszulesen
     * und in das entsprechende Property zu schreiben.     *
     * @private
     */
    var _readOptionsFromHTML = function() {
        var userscriptOptions = {};

        // Geht alle Checkboxen durch, prüft ob die Box gechecked ist und setzt den passenden
        // Wert in den Optionen.
        $('input[type=checkbox].userscriptOptions').each(function() {
            var attr = $(this).prop('checked');
            if (attr === true) {
                userscriptOptions[$(this).attr('name')] = 'checked';
            } else {
                userscriptOptions[$(this).attr('name')] = false;
            }
        });

        // Liest den Wert der Textfelder aus.
        $('input.userscriptOptions[type!=checkbox]').each(function() {
            userscriptOptions[$(this).attr('name')] = $(this).val();
        });

        // Liest den Wert der Selects aus.
        $('select.userscriptOptions').each(function() {
            userscriptOptions[$(this).attr('name')] = $(this).val();
        });

        // Data Storage wieder hinzufügen, wird immer mit durchgeschliffen
        userscriptOptions['dataStorage'] = _options['dataStorage'];

        // Nachdem alle Daten eingelesen wurden, werden die Settings in dem Attribut gesichert.
        _options = userscriptOptions;
    };

    /**
     * Liest den JSON-String aus dem Localstorage aus und setzt das passende
     * Attribut der Pseudoklasse. Wird im Konstruktor aufgerunden, sollte also stets verfügbar sein.     *
     * @private
     */
    var _readOptionsFromLocalstorage = function() {
        // JSON-String aus dem Localstorage auslesen und wieder in ein Objekt umwandeln
        _options = JSON.parse(localStorage.getItem(LOCALSTORAGE_NAME));

        if (_options == null) {
            _options = {};
        }

        if (typeof _options['dataStorage'] === 'undefined'){
            _options['dataStorage'] = {};
        }
    };

    /**
     * Private Methode um die Inputboxen im Menu zu setzen. Die Optionen werden aus dem
     * Attribut entnommen.
     */
    this.writeOptionsToHTML = function() {
        var type = '',
            inputTypes = ['text', 'color', 'number'];

        if (!$.isEmptyObject(_options)) {
            $.each(_options, function(index, value) {
                // Typ der Option bestimmen
                type = $('[name=' + index + ']').attr('type');

                // Checkboxen auslesen und den Wert zuweisen
                if (type == 'checkbox') {
                    // Checkboxen setzen
                    if (value == 'checked') {
                        $('[name=' + index + ']').attr('checked', true);
                    } else {
                        $('[name=' + index + ']').attr('checked', false);
                    }
                }

                // Textfelder auslesen und den Wert zuweisen
                if (($.inArray(type, inputTypes) !== -1) || type == null) {
                    $('[name=' + index + ']').val(value);
                }
            });
        }
    };

    /**
     * Fügt die Eventhandler hinzu
     * @private
     */
    var _addEventHandler = function() {

        // Eventhandler für die Optionen setzen
        $('#saveUserscriptOptions').click(function() {
            if (_self.saveOptions()) {
                _self.hideOptions();
            }
        });

        $('#openUserscriptOptions').click(function(e) {
            e.preventDefault();
            _self.showOptions();
        });

        $('#closeUserscriptOptions,#userscriptOptionsOverlay').click(function(e) {
            e.preventDefault();
            _self.hideOptions();
        });

        $('div#userscriptOptions input.imexp').click(function() {
            var $this = $(this),
                imexportContainer = $('div#rmus-options-imexport'),
                importBtn = $('div#rmus-options-imexport input#importUserscriptOptionsBtn'),
                helpContainer = $('div.rmus-options-imexport-help', imexportContainer),
                textarea = $('textarea', imexportContainer);

            imexportContainer.hide();

            if ($this.prop('id') === 'importUserscriptOptions') {
                importBtn.show();
                helpContainer.text('Füge den exportierten JSON-String in das Textfeld ein:');
                textarea.val('');
                textarea.focus();
            } else {
                var opts = _self.getOptionsRaw();

                if (opts === 'null') {
                    alert('Es sind keine gespeicherten Optionen zum Exportieren vorhanden. Bitte speichere deine Optionen zuerst ab.');
                    return;
                }

                importBtn.hide();
                helpContainer.text('Kopiere diesen JSON-String für den späteren Import:');
                textarea.val(opts);
            }

            imexportContainer.slideToggle(250, function() {
                textarea.select();
            });
        });
        $('#imexportUserscriptOptionsCloseBtn').click(function() {
            $('div#rmus-options-imexport').hide();
        });
        $('#importUserscriptOptionsBtn').click(function() {
            var opts = $('div#rmus-options-imexport textarea').val(),
                validJson = true;

            try {
                JSON.parse(opts);
            } catch (e) {
                validJson = false;
            }

            if (validJson) {
                _self.backupOptions();
                _self.setOptionsRaw(opts);

                // Optionen schließen, damit sie neu geladen werden beim nächsten öffnen.
                _self.hideOptions();

                alert('Die Optionen wurden erfolgreich importiert! Du musst die Seite neu laden, damit die Optionen vollständig übernommen werden.');
            } else {
                alert('Die Optionen konnten nicht importiert werden! Der eingegebene Text ist kein valider JSON-String.');
            }
        });

        var toggleBtn = function ($el, opened) {
            if (opened) {
                $el.removeClass('rmus-icon-minus-circled').addClass('rmus-icon-plus-circled');
            } else {
                $el.removeClass('rmus-icon-plus-circled').addClass('rmus-icon-minus-circled');
            }
        }

        // Eventhandler für die +/- Buttons
        $('[id*=toggle_sub]').click(function() {
            var $el = $(this);

            toggleBtn($el, $el.hasClass('rmus-icon-minus-circled'));
        });

        // Auf- und zuklappen der Unterkategorien
        $('#toggle_sub_middleColumn_forum_reloadPosts_readNewPosts').click(function() {
            $('.sub_middleColumn_forum_reloadPosts_readNewPosts').toggle();
            $('.sub_middleColumn_forum_reloadPosts_markNewPosts').hide();
            $('.sub_middleColumn_forum_reloadPosts_endlessPage').hide();
            toggleBtn($("#toggle_sub_middleColumn_forum_reloadPosts_endlessPage"), true);
            toggleBtn($("#toggle_sub_middleColumn_forum_reloadPosts_markNewPosts"), true);
        });
        $('#toggle_sub_middleColumn_forum_reloadPosts_endlessPage').click(function() {
            $('.sub_middleColumn_forum_reloadPosts_endlessPage').toggle();
        });
        $('#toggle_sub_middleColumn_forum_reloadPosts_markNewPosts').click(function() {
            $('.sub_middleColumn_forum_reloadPosts_markNewPosts').toggle();
        });
        $('#toggle_sub_rightColumn_headlines_hideHeadlines').click(function() {
            $('.sub_rightColumn_headlines_hideHeadlines').toggle();
            $(".sub_rightColumn_headlines_sections").hide();
            toggleBtn($("#toggle_sub_rightColumn_headlines_sections"), true);
        });
        $('#toggle_sub_rightColumn_forum_hideForum').click(function() {
            $('.sub_rightColumn_forum_hideForum').toggle();
            $('.sub_rightColumn_forum_sections').hide();
            toggleBtn($("#toggle_sub_rightColumn_forum_sections"), true);
        });
        $('#toggle_sub_rightColumn_forum_sections').click(function() {
            $('.sub_rightColumn_forum_sections').toggle();
        });
        $('#toggle_sub_rightColumn_headlines_sections').click(function() {
            $('.sub_rightColumn_headlines_sections').toggle();
        });
        $('#toggle_sub_miscellaneous_reloadMessages').click(function() {
            $('.sub_miscellaneous_reloadMessages').toggle();
        });
        $('#toggle_sub_miscellaneous_ignoreUser').click(function() {
            $('.sub_miscellaneous_ignoreUser').toggle();
        });
        $('#toggle_sub_middleColumn_forum_scrollForNewPage').click(function() {
            $('.sub_middleColumn_forum_scrollForNewPage').toggle();
        });
        /*$('#toggle_sub_miscellaneous_syncOptions').click(function() {
            $('.sub_miscellaneous_syncOptions').toggle();
        });*/
    };

    /**
     * Die Inhalte der Sortierbaren Listen werden ausgelesen
     * @private
     */
    var _readSortableLists = function(){
        var headlineMappings    = new Headlines($, _self, '').getMappings(),
            headlineDiv         = document.getElementById('sub_rightColumn_headlines_hideHeadlines_sortable'),
            $headlineListUsed   = $(headlineDiv.children[1].children[1]),

            forumMappings       = new ForumNavigation($, _self, '', '', '').getMappings(),
            forumDiv            = document.getElementById('sub_rightColumn_forum_sections_sortable'),
            $forumListUsed      = $(forumDiv.children[1].children[1]);

        // Headlines
        for(var headline in headlineMappings){
            var optionName  = 'rightColumn_headlines_item_' + headline,
                $element    = $headlineListUsed.find('li[data-name="' + optionName + '"]');

            // Da nur die Used Liste durchsucht wird, werden alle anderen Einträge auf 0 gesetzt
            _options[optionName] = ($element.length) ? Number($headlineListUsed.children().index($element)) + 1 : 0;
        }

        // Forum
        for(var forum in forumMappings){
            var optionName  = 'rightColumn_forums_item_' + forum,
                $element    = $forumListUsed.find('li[data-name="' + optionName + '"]');

            // Da nur die Used Liste durchsucht wird, werden alle anderen Einträge auf 0 gesetzt
            _options[optionName] = ($element.length) ? Number($forumListUsed.children().index($element)) + 1 : 0;
        }
    };

    /**
     * Sortierbare Listen erstellen
     * @private
     */
    var _displaySortableLists = function(){
        var headlineMappings    = new Headlines($, _self, '').getMappings(),
            headlineDiv         = document.getElementById('sub_rightColumn_headlines_hideHeadlines_sortable'),
            $headlineListUnused = $(headlineDiv.children[0].children[1]),
            $headlineListUsed   = $(headlineDiv.children[1].children[1]),

            forumMappings       = new ForumNavigation($, _self, '', '', '').getMappings(),
            forumDiv            = document.getElementById('sub_rightColumn_forum_sections_sortable'),
            $forumListUnused    = $(forumDiv.children[0].children[1]),
            $forumListUsed      = $(forumDiv.children[1].children[1]);

        // Listen leeren
        $headlineListUnused.children().add($headlineListUsed.children()).remove();
        $forumListUnused.children().add($forumListUsed.children()).remove();

        // Headline Listen auslesen
        for(var headline in headlineMappings){
            var optionName  = 'rightColumn_headlines_item_' + headline,
                listElement = (typeof _options[optionName] === 'undefined' || Number(_options[optionName]) !== 0) ? $headlineListUsed : $headlineListUnused,
                sortValue   = (typeof _options[optionName] === 'undefined') ? 1 : Number(_options[optionName]);

            listElement.append('<li data-sort="' + sortValue + '" data-name="' + optionName + '">' + headlineMappings[headline] + '</li>')
        }

        // Forum Listen auslesen
        for(var forum in forumMappings){
            var optionName  = 'rightColumn_forums_item_' + forum,
                listElement = (typeof _options[optionName] === 'undefined' || Number(_options[optionName]) !== 0) ? $forumListUsed : $forumListUnused,
                sortValue   = (typeof _options[optionName] === 'undefined') ? 1 : Number(_options[optionName]);

            listElement.append('<li data-sort="' + sortValue + '" data-name="' + optionName + '">' + forumMappings[forum] + '</li>')
        }

        // Elemente in die korrekte Reihenfolge bringen
        $headlineListUsed.find('li').sort(_sortLiElementsByData).appendTo($headlineListUsed);
        $forumListUsed.find('li').sort(_sortLiElementsByData).appendTo($forumListUsed);

        // Headline Listen sortierbar
        $('.conncected.list.headlines').sortable({
            connectWith: '.conncected.list.headlines'
        });

        // Forum Listen sortierbar
        $('.conncected.list.forum').sortable({
            connectWith: '.conncected.list.forum'
        });
    };

    /**
     * Methode um die sortierbaren Listen bei der Initialisierung zu sortieren.
     * @param elmOne
     * @param elmTwo
     * @returns {number}
     * @private
     */
    var _sortLiElementsByData = function(elmOne, elmTwo){
        var dataOne     = $(elmOne).data(),
            dataTwo     = $(elmTwo).data(),
            returnVal   = 0;

        if (dataOne['sort'] === dataTwo['sort']){
            returnVal = (dataOne['name'] > dataTwo['name']) ? 1 : -1;
        }
        else returnVal = (dataOne['sort'] > dataTwo['sort']) ? 1 : -1;

        return returnVal;
    };

    /**
     * Init Methode aufrufen!
     */
    _init();
}

/**
 * PostWithoutReload
 * =================
 *
 * Klasse um einen Beitrag im Forum zu schreiben ohne die Seite neuladen zu
 * müssen.
 */

function PostWithoutReload($, _options,_reloadPosts){
    var _$form              = [];
    var _$inputField        = [];
    var _$submitButton      = [];
    var _$newSubmitButton   = [];
    var _crypt          = '';


    this.init = function(){
        _$form          = $('#c_content form:last');
        _$inputField    = _$form.find('#post_text_0');
        _$submitButton  = _$form.find('input[type=submit]');
        _crypt          = _$form.find('input[name=crypt]').val();

        // Prüfen ob input Feld und Submitbutton gefunden wurden
        if (_$inputField.length && _$submitButton.length){
            _addEventListener();

            // Prüfen ob reloadPosts aktiv ist, sonst initialisieren (ohne intervall)
            if (!_options.getOption('middleColumn_forum_reloadPosts_readNewPosts')){
                _reloadPosts.init(false);
            }
        }
    };

    var _addEventListener = function(){
        _$submitButton.hide();

        // Bekomme es nicht geschissen den scheiß Reload zu
        // unterdrücken.. Baue daher einfach meinen eigenen Submit-Button,
        // mit Koks und Nutten!!!1

        var newButton = document.createElement('input');
        newButton.type = 'button';
        newButton.value = 'Antwort erstellen';
        newButton.setAttribute('data-koks', 'true');
        newButton.setAttribute('data-nutten', 'true');

        _$newSubmitButton = $(newButton);
        _$submitButton.after(_$newSubmitButton);

        _$newSubmitButton.on('click', function(e){
            e.preventDefault();
            _postMessage();
        });
    };

    var _postMessage = function(){
        var postData = {
            'post':         1,
            'crypt':        _crypt,
            'post_text_0':  _$inputField.val()
        };

        // Button und Field sperren, damit nicht versehentlich noch mehr abgeschickt wird
        _$inputField.prop('disabled', true);
        _$newSubmitButton.prop('disabled', true);

        // Posten
        var postRequest = $.post(document.location.pathname, postData);
            // Bei einem Fehler eine simple Meldung ausgeben
            postRequest.fail(function(){
                alert('Der Post konnte nicht abgeschickt werden, bitte lade die Seite neu und versiche es erneut!');
            });
            // Post ist durchgelaufen, kann aber trotzdem fehlerhaft sein
            // Mindestanzahl an Zeichen oder Readmore-Interne Probleme
            postRequest.done(function(returnData){
                var $returnElement  = $(returnData);
                var postError       = _detectErrors($returnElement);

                // Fehler ausgeben
                if (postError !== ''){
                    alert(postError);
                }
                // Post erfolgreich, neue crypt Value auslesen und Reload anstoßen
                else{
                    _crypt = $returnElement.find('#c_content form:last input[name=crypt]').val();
                    _reloadPosts.readPosts();

                    // Input field leeren
                    _$inputField.val('');
                }
            });
            // Elemente wieder entsperren
            postRequest.always(function(){
                _$inputField.prop('disabled', false);
                _$newSubmitButton.prop('disabled', false);
            });
    };

    var _detectErrors = function($element){
        var errorMessage    = '';
        var $errorDiv       = $element.find('#c_content div.module_notice.error');

        if ($errorDiv.length){
            errorMessage = $errorDiv.text().replace(/\s+/g, ' ').trim();
        }

        return errorMessage;
    };
};
function ReadmoreUserscript($) {

    var _options = new Options($),
        _loadingScreen = new LoadingScreen(),
        _siteLocation = new SiteLocation($),
        _content = new Content($),
        _ignoreUser = new IgnoreUser($, _options, _siteLocation, _content),
        _userNicknames = new UserNicknames($, _siteLocation, _content),
        _reloadPosts = new ReloadPosts($, _options, _content, _ignoreUser, _userNicknames),
        _misc = new Miscellaneous($, _content),
        _headlines = new Headlines($, _options, _content),
        _reloadPageData = new ReloadPageData($),
        _ticker = new Ticker($, _content),
        //_sync = new Sync($, _options, _loadingScreen),
        _forumFavorites = new ForumFavorites($, _options, _content, _loadingScreen/*, _sync*/),
        _forumNavigation = new ForumNavigation($, _options, _reloadPageData, _misc, _content, _forumFavorites),
        _postWithoutReload = new PostWithoutReload($, _options,_reloadPosts),
        _scrollForNewPage = new ScrollForNewPage($, _options, _content, _ignoreUser, _userNicknames),
        _checkUpdate = new CheckUpdate($, _options),
        _bettingOverview = new BettingOverview($, _options);

    this.start = function() {
        if (_options.getOption('miscellaneous_makeContentWider')) {
            _misc.makeContentWider();
        }

        // Optionen einfügen
        _options.insertOptions();

        // Header fixen
        if (_options.getOption('miscellaneous_fixedToolbar')) {
            _misc.createFixedToolbar();
        }

        // Im Forum
        if (_siteLocation.getLocation('forums')) {
            // Titel umsortieren
            if (_options.getOption('miscellaneous_reSortTitle')) {
                _misc.resortTitle();
            }

            // Sind Posts verfügbar?
            if ( _content.get('forumPosts').length){
                // Post ohne Reload
                if (_options.getOption('middleColumn_forum_postPerAjax')){
                    _postWithoutReload.init();
                }

                // Hochscrollen
                if (_options.getOption('miscellaneous_buttonScrollUp')){
                    _misc.buttonScrollUp();
                }

                // Runterscrollen
                if (_options.getOption('miscellaneous_buttonScrollDown')){
                    _misc.buttonScrollDown();
                }

                // Runterscrollen für eine neue Seite
                if (_options.getOption('middleColumn_forum_scrollForNewPage')){
                    _scrollForNewPage.init();
                }

                // Favoriten im Thread
                if (_options.getOption('forumFavorites')){
                    _forumFavorites.initThread();
                }
            }
        }

        // Prüfen ob die Übersicht überhaupt vorhanden ist
        if (_content.get('forumNavigation').length) {

            // Favoriten Forennavi
            if (_options.getOption('forumFavorites')){
                _forumFavorites.initForumNavi();
            }

            // Pfeile anpassen
            if (_options.getOption('miscellaneous_lastPageJumpToLastPost')) {
                _misc.changeForumArrowBehavior();
            }

            _forumNavigation.init();
        }

        // Schlagzeilen ausblenden
        if (_content.get('headlines').length && _content.get('tickerMatches').length) {
            _headlines.init();
        }

        // Ticker ausblenden
        if (_options.getOption('rightColumn_ticker_hideTicker')){
            _ticker.hideTicker();
        }

        // Wettkönig ausblenden
        if (_options.getOption('rightColumn_hideBetKing')){
            _misc.hideBetKing();
        }

        // User Ignorieren
        if (_options.getOption('miscellaneous_ignoreUser')){
            _ignoreUser.ignore();
        }

        // Nickname History Link
        if (_options.getOption('miscellaneous_nicknameHistoryLink')){
            _userNicknames.insertLink();
        }

        // Betting Selection
        if (_options.getOption('bettingOverview') && _siteLocation.getLocation('betting')){
            _bettingOverview.init();
        }

        // Sync anschalten
        //_sync.init();

        // Update prüfen
        _checkUpdate.checkUpdate();
    };

    this.startIntervalReloadPosts = function() {
        // Prüfen ob die Option gesetzt ist
        if (_options.getOption('middleColumn_forum_reloadPosts_readNewPosts')) {
            // Prüfen ob wir uns im Forum befinden
            if (_siteLocation.getLocation('forums') && _content.get('forumPosts').length) {
                // Nachladen von Posts vorbereiten und invervall setzen
                _reloadPosts.init();
            }
        }
    };

    this.startIntervalRapid = function() {
        setInterval(function() {
            // Posts unmarkieren
            if (_options.getOption('middleColumn_forum_reloadPosts_markNewPosts')) {
                if (_siteLocation.getLocation('forums') && _content.get('forumPosts').length) {
                    _reloadPosts.unmarkNewPosts();
                    if (_options.getOption('middleColumn_forum_reloadPosts_changeFavicon'))     _reloadPosts.changeFavicon();
                    if (_options.getOption('middleColumn_forum_reloadPosts_showNewPostsTitle')) _reloadPosts.showNewPostsTitle();
                }
            }
        }, 333);
    };

    this.startIntervalSlow = function() {
        setInterval(function() {
            _reloadPageData.readPage();

            // Forum aktualisieren
            if (_options.getOption('rightColumn_forum_reloadForum') && _content.get('forumNavigation').length) {
                // Lag im FF verhindern
                setTimeout(function() {
                    _forumNavigation.reloadForum();
                }, 1000);
            }

            // Update prüfen
            _checkUpdate.checkUpdate();

            // Gucken ob eine aktuellere Version der Optionen verfügbar ist
            if (_options.getOption('rightColumn_forum_reloadForum')){

            }
        }, 15000);
    };
}

/**
 * ReloadPageData
 * ==============
 */

function ReloadPageData($) {

    var _self = this;
    var _pageData = "";

    /**
     * Gibt den HTML-String zurück.
     * @return {[type]} [description]
     */
    this.getPageData = function() {
        return _pageData;
    }

    /**
     * Liest die Seite neu ein.
     * @return {[type]} [description]
     */
    this.readPage = function() {
        $.ajax({
            type: "POST",
            cache: false,
            url: "https://www.readmore.de/start",
            timeout: 10000
        }).done(function(data) {
            if (data != null) {
                _pageData = data.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, " ");
            }
        });
    }

}

/**
 * ReloadPosts
 * ===========
 *
 * Ermöglicht das nachladen von Posts im Hintergrund. Bietet außerdem
 * Methoden um das Favicon zu verändern oder die neuen Posts einzufärben.
 *
 * @param _options      {Options}
 * @param _content      {Content}
 * @constructor
 */

function ReloadPosts($, _options, _content, _ignoreUser, _userNicknames) {
    var _postcount      = 0;
    var _finishedPages  = 0;
    var _currentPage    = 1;
    var _oldLimit       = 0;
    var _oldJumpLimit   = 0;

    var _threadlink     = '';
    var _oldTitle       = '';

    var _$postInsertElement = null;
    var _$headElm           = null;
    var _$contentElm        = null;
    var _$jumpToChkElm      = null;

    var _favIcons       = [];
    var _unseenPosts    = [];
    var _markPostColor  = {
        hex: '#EEEEEE',
        rgb: 'rgb(238, 238, 238)'
    };

    /**
     * Bereitet das Nachladen vor.
     * @param enableIntervall {boolean}
     */
    this.init = function (enableIntervall) {
        enableIntervall = (typeof enableIntervall === 'undefined' ? true : enableIntervall);

        var $insertElement  = $('div.pagination:last');
        _$postInsertElement = $insertElement.length ? $insertElement : $('div.forum_thread_reply:last');

        _$headElm       = $('head');
        _$contentElm    = $('#c_content');
        _oldTitle       = document.title;

        _readCurrentPage();
        _readThreadLink();
        _readPostcount();
        _setMarkPostColor();

        if (enableIntervall){
            setInterval(function() {
                _readNewPosts();
            }, (parseInt(_options.getOption('middleColumn_forum_reloadPosts_timeToWait'), 10) > 2) ? parseInt(_options.getOption('middleColumn_forum_reloadPosts_timeToWait'), 10) * 1000 : 3000);

            if (_options.getOption('middleColumn_forum_reloadPosts_jumpToNewPosts') && _options.getOption('middleColumn_forum_reloadPosts_endlessPage')) {
                if (_isLastpage()){
                    _jumpToNewPosts();

                    setInterval(function () {
                        _jumpToNewPosts();
                    }, (parseInt(_options.getOption('middleColumn_forum_reloadPosts_jumpToNewPosts_waitUntilNextJump'), 10) > 1 ? parseInt(_options.getOption('middleColumn_forum_reloadPosts_jumpToNewPosts_waitUntilNextJump'), 10) : 1) * 1000);
                }
            }
        }
    };

    /**
     * Gibt den Postcount zurück
     * @returns {number}
     */
    this.getPostcount = function () {
        return _postcount;
    };

    this.getThreadlink = function () {
        return _threadlink;
    };

    this.getCurrentPage = function(){
        return _currentPage;
    };

    this.setCurrentPage = function(page){
        _currentPage = page;
    };

    this.setPostcount = function (postcount) {
        _postcount = postcount;
    };

    /**
     * Wird von der PostWithoutReload Klasse genutzt,
     * falls möglich sonst vermeiden!
     */
    this.readPosts = function(){
        _readNewPosts();
    };

    /**
     * Lädt die neuen Posts nach und führt anschließend eine ganze Reihe
     * an Funktionen aus (Favicon anpassen, Markieren der Posts, ...)
     */
    var _readNewPosts = function () {
        if (_isLastpage()) {
            // Seiten endlos erweitern
            if (_options.getOption('middleColumn_forum_reloadPosts_endlessPage')) {
                _prepareEndlessPage();
            }

            // Der eigentliche Reload
            $.ajax({
                type: 'POST',
                async: true,
                cache: false,
                url: _threadlink + '&page=' + _currentPage,
                contentType: 'text/html; charset=UTF-8;',
                dataType: 'html',
                success: function (data) {

                    var $parsedData = $($.parseHTML(data));

                    // Da Readmore nun bei zu hoher Page Nummer einfach die letzte Seite anzeigt,
                    // muss überprüft werden ob der angegebene &page-Parameter mit der Seite übereinstimmt
                    if (_currentPage !== 1){
                        var pageNum = +$parsedData.find('div.pagination li.active').first().find('a').text();
                        if (pageNum && pageNum !== _currentPage){
                            return false;
                        }
                    }

                    var posts = _content.get('forumPosts', $parsedData);

                    if (posts.length) {
                        var oldPosts = (25 * _finishedPages);
                        var postNumber = posts.length + oldPosts;
                        var i = _postcount;

                        for (i; i < postNumber; i++) {
                            posts[i - oldPosts] = $(posts[i - oldPosts]);
                            _$postInsertElement.before(posts[i - oldPosts]);

                            var unseenPostData = {
                                element:    posts[i - oldPosts],
                                offset:     parseInt(posts[i - oldPosts].offset().top, 10),
                                marked:     false
                            };

                            _unseenPosts.push(unseenPostData);  // Zum markieren der neuen Posts
                            _postcount++;
                        }

                        _oldLimit = (window.pageYOffset + $(window).height());

                        // Ungelesene Posts makieren
                        if (_options.getOption('middleColumn_forum_reloadPosts_markNewPosts')) {
                            _markNewPosts();
                        }

                        // User Ignorieren
                        if (_options.getOption('miscellaneous_ignoreUser')){
                            _ignoreUser.ignore();
                        }

                        // Nickname History Link
                        if (_options.getOption('miscellaneous_nicknameHistoryLink')){
                            _userNicknames.insertLink();
                        }
                    }
                }
            });

            // Rausfinden ob eine neue Seite existiert
    /*        if (_options.getOption('middleColumn_forum_reloadPosts_endlessPage') != 'checked') {
                _checkForNewPage();
            }
     */   }
    };

    /**
     * Entfernt die Markierung und bereits gelesenen Posts.
     */
    this.unmarkNewPosts = function () {
        var limit           = (window.pageYOffset + $(window).height());
        var removeElements  = 0;

        // Nur wenn nach unten gescrollt wurde
        if (limit != _oldLimit){
            $.each(_unseenPosts, function(i, post){
                if (!post.marked || post.offset > limit){
                    return false;
                }

                post.element.css('background-color', '');
                removeElements++
            });

            if (removeElements){
                _unseenPosts.splice(0, removeElements);
            }
        }
    };

    /**
     * Zeigt die Anzahl der neuen Posts im Titel / Tab an.
     */
    this.showNewPostsTitle = function () {

        var tempTitle = _oldTitle;

        if (_unseenPosts.length) {
            tempTitle = '(' + _unseenPosts.length + ') ' + tempTitle;
        }

        if (document.title !== tempTitle) {
            document.title = tempTitle;
        }
    };

    /**
     * Tauscht das Favicon falls ein ungelesener Post existiert
     */
    this.changeFavicon = function () {
        if (!_favIcons.length){
            _favIcons = $('link[rel="shortcut icon"], link[rel="icon"]');
            _favIcons.addClass('noNewPosts');
        }



        if (_unseenPosts.length > 0 && _favIcons.hasClass('noNewPosts')){
            _favIcons.remove();

            _favIcons
                .attr('href', 'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB/ElEQVQ4y62STWtTQRSGnzMz9zZprLW4s+BKiFSDS/e6EBT8gJa46l7X7tSNXfoD/AeKdlEQWtxI8QMEoYgW7EJIoyBNSEsbuM29N5OZcRETbaMrPcvDnGde3veFfxw5vHj5saUbyX417djZTpqd9EFRiqVxfGpiabKoHl88N53+FbD87kulvsNiR/JyJ1EcixQKwSpL1ykmS4Vv01N2/ur58qsRwMrbemWj1X6j9NHJNGsTj4NOI3KxaKO5c+3sQekiMgSsrn/Vte/Zp700mhnLE25XK/1HzuF0AAy6f9W/DoHVja2JCzMnEgVQ392v1ppuZnO7zU5ucYDFkmuNxhPcqHm1ZnoLwAC8/tC80Wo0USZmy1uUP41hDMSCjzGSAsUDgPfr9SvAQwWwndhTOggiGbuuh1PjEDRIxPV7z8hUcURBay8tAyiA0E1cLxac1UyIJ/IQdIon4ERR8L0RgHW5HgK8d5vBQ1AFuqEEAhJilBNyU+DS3Sd/6tDnIQBYQoSgujid/MxJYzUUQkYkY0P3CYH+p375d8DTATFSEZCBBfFdrLXEpjgI/1eU8GgIWFmYc8BNoO2CpisGIo+RmCPGkHfSEf0rC3PJSJUv31+sgCwSfFmJIbhAEA8Klh/MHijSoInqEHUdwhlE5j3uedB+DcUa8OKwB/9tfgDWu9z+ndeArQAAAABJRU5ErkJggg==')
                .attr('type', 'image/png')
                .removeClass('noNewPosts')
                .addClass('newPosts');

            _$headElm.append(_favIcons);
        }
        else {
            if (_unseenPosts.length == 0 && _favIcons.hasClass('newPosts')) {
                _favIcons.remove();

                _favIcons
                    .attr('href', '//cdn1.readmore.de/img/themes/readmore/favicon.ico')
                    .attr('type', 'image/vnd.microsoft.icon')
                    .removeClass('newPosts')
                    .addClass('noNewPosts');

                _$headElm.append(_favIcons);
            }
        }
    };

    /**
     * Springt automatisch zu neuen Posts.
     */
    _jumpToNewPosts = function () {
        if (_$jumpToChkElm === null) {
            $('#c_content>ul.breadcrumbs').append('<li style="float: right">Jump <input style="margin-left: 2px;" type="checkbox" id="userscript_enable_jump" name="userscript_enable_jump"></li>');
            _$jumpToChkElm = $('#userscript_enable_jump');
        }
        else{
            if (_unseenPosts.length > 0) {
                if (_$jumpToChkElm.prop('checked')) {
                    var jumpto = _unseenPosts[0]['offset'] - (window.innerHeight * 0.60) + 25;
                    if (jumpto <= _oldJumpLimit) {
                        jumpto = _oldJumpLimit + 25;
                    }

                    _oldJumpLimit = jumpto;
                    window.scrollTo(0, jumpto);
                }
            }
        }
    };

    /**
     * Überschreibt die Farbe für die Markierung der Posts.
     * Wenn ein valider Hexwert in den Optionen angegeben ist.
     * @private
     */
    var _setMarkPostColor = function () {
        var hexColor = _options.getOption('middleColumn_forum_reloadPosts_markPostColor');

        if (typeof hexColor === 'undefined' || hexColor === null){
            hexColor = '';
        }

        // Nur wenn eine HEX-Zahl eingegeben wurde
        if (hexColor[0] === '#' && hexColor.length === 7) {
            _markPostColor.hex = hexColor;
            _markPostColor.rgb = "rgb(" + parseInt(_markPostColor.hex.substr(1, 2), 16).toString() + ", " + parseInt(_markPostColor.hex.substr(3, 2), 16).toString() + ", " + parseInt(_markPostColor.hex.substr(5, 2), 16).toString() + ")";
        }
    };

    /**
     * Markiert ungelesene Posts.
     * @private
     */
    var _markNewPosts = function () {
        $.each(_unseenPosts, function(i, post){
            if (!post.marked){
                post.marked = true;
                post.element.css('background-color', _markPostColor.rgb);
            }
        });
    };

    /**
     * Liest die aktuelle Anzahl der Posts auf der aktuellen
     * Seite aus.
     * @private
     */
    var _readPostcount = function () {
        _postcount = _content.get('forumPosts').length;
    };

    /**
     * Prüft ob wir uns auf der letzten Seite eines Threads befinden.
     * @returns {boolean}
     * @private
     */
    var _isLastpage = function () {
        var lastLi      = $('div.pagination:first>ul>li').last();

        // Wenn keine Navigation da ist true (es gibt nur eine Seite)
        return lastLi.length ? lastLi.hasClass('active') : true;
    };

    /**
     * Ermöglicht das endlose Nachladen auf einer Seite.
     * @private
     */
    var _prepareEndlessPage = function () {
        if (+_postcount === (25 + (25 * _finishedPages))) {
            _finishedPages++;
            _currentPage++;
        }
    };

    /**
     * Liest die aktuelle Seitenzahl aus.
     * @private
     */
    var _readCurrentPage = function () {
        var pageText = $('div.pagination li.active').first().find('a').text();
        // Empty String = Seite 1. Keine Page navigation vorhanden.
        _currentPage = pageText !== '' ? +pageText : 1;
    };

    /**
     * Liest den Link der aktuellen Seite ohne Seitenzahl aus.
     * @private
     */
    var _readThreadLink = function () {
        _threadlink = document.location.href
                        .replace(/&page=([\d]+|last)/, '')
                        .replace(/#p[\d]+/, '')
                        .replace(/#plast/, '');
    };

    /**
     * Prüft ob eine neue Seite verfügbar und und blendet ggf.
     * eine Meldung ein.
     * @private
     */
 /*   var _checkForNewPage = function () {
        if (_options.getOption('middleColumn_forum_reloadPosts_checkForNewPage') == 'checked') {
            if (_postcount === (25 + (25 * _finishedPages)) && $('#userscriptNewPage').length < 1) {
                $.ajax({
                    type: 'POST',
                    async: true,
                    cache: false,
                    url: _threadlink + '&pagenum=' + (_currentPage + 1),
                    contentType: 'text/html; charset=iso-8859-1;',
                    dataType: 'html',
                    success: function (data) {
                        var posts = data.match(/\<tr class=\"post\_[^"]+\"\>[^]+?\<\/tr\>/g);
                        if (posts != null) {
                            $('table.elf.forum.p2:last').after('<br/><div id="userscriptNewPage" style="width:520px; height: 23px; background-color: #2B91FF; text-align: right; vertical-align:middle; display:table-cell"><a style="color: #fff; font-weight: bold; padding-right: 10px;" href="' + _threadlink + '&pagenum=' + (_currentPage + 1) + '">Zur nächsten Seite</a></div>');
                        }
                    },
                    beforeSend: function (jqXHR) {
                        jqXHR.overrideMimeType('text/html;charset=iso-8859-1');
                    }
                });
            }
        }
    };
*/
}
/**
 * ScrollForNewPage
 * ================
 *
 * Beim Runterscrollen werden neue Seiten nachgeladen und angezeigt.
 */

function ScrollForNewPage($, _options, _content, _ignoreUser, _userNicknames){
    var _currentPage    = 0,
        _postCount      = 0,
        _threadlink     = '',
        _currentlyLoading   = false,
        _lastPage           = false,
        _$postInsertElement = null;

    this.init = function(){
        if (_options.getOption('middleColumn_forum_hideForum_editboxTop')){
            _moveTextareaTop();
        }

        _readPostcount();

        // 25 Posts geladen, es könnte also eine neue Seite geben
        if (_postCount === 25){

            _readThreadLink();
            _readCurrentPage();
            var $insertElement  = $('div.pagination:last');
            _$postInsertElement = $insertElement.length ? $insertElement : $('div.forum_thread_reply:last');

            setInterval(function() {
                if (!_lastPage && !_currentlyLoading && (_postCount % 25 === 0)){
                    if ((window.pageYOffset + $(window).height()) >= (document.body.offsetHeight - 400)){
                        _readNextPage();
                    }
                }
            }, 1000);
        }
    };

    /**
     * Auslesen wie viele Posts existieren
     * @private
     */
    var _readPostcount = function(){
        _postCount += Number(_content.get('forumPosts').length);
    };

    /**
     * Liest die aktuelle Seitenzahl aus.
     * @private
     */
    var _readCurrentPage = function (){
        var pageText = $('div.pagination li.active').first().find('a').text();
        // Empty String = Seite 1. Keine Page navigation vorhanden.
        _currentPage = pageText !== '' ? +pageText : 1;
    };

    var _readNextPage = function(){
        _currentlyLoading = true;

        $.get(_threadlink + '&page=' + (_currentPage + 1))
            .success(function(data){
                var $parsedData = $($.parseHTML(data));

                // Da Readmore nun bei zu hoher Page Nummer einfach die letzte Seite anzeigt,
                // muss überprüft werden ob der angegebene &page-Parameter mit der Seite übereinstimmt
                var pageNum = +$parsedData.find('div.pagination li.active').first().find('a').text();
                if (pageNum && pageNum !== (_currentPage + 1)){
                    _lastPage = true;
                    return false;
                }


                var posts = _content.get('forumPosts', $parsedData);
                if (!posts.length){
                    _lastPage = true;
                }
                else{
                    _currentPage++;
                    _$postInsertElement.before(posts);
                    _readPostcount();

                    // User Ignorieren
                    if (_options.getOption('miscellaneous_ignoreUser')){
                      _ignoreUser.ignore();
                    }

                    // Nickname History Link
                    if (_options.getOption('miscellaneous_nicknameHistoryLink')){
                        _userNicknames.insertLink();
                    }
                }
            })
            .always(function(){
                _currentlyLoading = false;
            });
    };

    /**
     * Liest den Link der aktuellen Seite ohne Seitenzahl aus.
     * @private
     */
    var _readThreadLink = function () {
        _threadlink = document.location.href
            .replace(/&page=([\d]+|last)/, '')
            .replace(/#p[\d]+/, '')
            .replace(/#plast/, '');
    };

    /**
     * Verschiebt die Textarea zum Posten nach oben auf die Seite.
     * @private
     */
    var _moveTextareaTop = function(){
        var $contentElement = $('#c_content'),
            $textElement    = $contentElement.find('.forum_thread_reply:first'),
            $firstpostElement   = $contentElement.find('.forum_post:first'),
            positionTop         = false;

        $('#c_content h1:first').append('<i id="moveTextareaTopTrigger">Postbox verschieben</i>');

        $('#moveTextareaTopTrigger').on('click', function(){
            if (positionTop)    $contentElement.append($textElement);
            else                $firstpostElement.before($textElement);

            positionTop = !positionTop;
        });
    };
};
/**
 * Sidebar Section
 * ======
 *
 * Klasse für das Verwalten von Sidebar Sektionen (Foren/Headlines)
 */

function SidebarSection($, section) {

    var _self = this,
        _section = section;

    /**
     * Gibt den Link mit dem übergebenen Namen zurück
     *
     * @param name
     * @private
     */
    this._getTarget = function (name) {
        var target = $("div.headlines_cat a:contains('" + name + "')", _section);
        return target.length === 1 ? target : null;
    };

    /**
     * Komplette Sektion ausblenden
     */
    this.hideAll = function () {
        var title = _section.prev('h3');
        title.hide().prev('hr').hide();
        _section.hide();
    };

    /**
     * Einzelne Einträge einer Sektion ausblenden
     *
     * @param name
     */
    this.hideSingle = function (name) {
        var target = this._getTarget(name);

        if (target) {
            target.parents('div.headlines_cat:first').hide().next('ul').hide();
        }
    };

    /**
     * Neusortieren der Sektionen
     *
     * @param sections
     */
    this.resortSections = function (sections) {
        var html = '',
            sections = $.extend({}, sections);

        // Habe die Funktion beim Debuggen etwas umgeschrieben. Macht letztendlich das selbe,
        // bau sie deshalb nicht wieder zurück.
        for (var sectionItem in sections){
            var target = _self._getTarget(sections[sectionItem].title);

            if (target !== null) {
                var headline = target.parents('div.headlines_cat:first'),
                    content = headline.next('ul');

                html += headline[0].outerHTML + content[0].outerHTML;
            }
        };

        _section.html(html);
    };

    /**
     * Optionen anwenden, umsortieren
     *
     * @param optionSections
     * @param mappings
     */
    this.process = function (optionSections, mappings) {
        var resortable = [];

        for (var section in optionSections) {
            if (!optionSections.hasOwnProperty(section)) {
                continue;
            }

            var raw = section.split('_').pop(),
                mapped = mappings[raw];

            if (Number(optionSections[section]) === 0) {
                this.hideSingle(mapped);
            } else {
                var sort = parseInt(optionSections[section]);
                resortable[sort] = {
                    raw: raw,
                    title: mapped,
                    sort: sort
                }
            }
        }

        if (resortable.length > 0) {
            this.resortSections(resortable);
        }
    }
}

/**
 * SiteLocation
 * ============
 *
 * Simple Pseudoklasse um auszulesen wo wir uns auf der Readmore.de Seite befinden.
 * Dadurch werden Funktionen des Userscriptes gesteuert. Ist im Grunde die alte Content Klasse..
 */
function SiteLocation($){

    /**
     * Property in dem alle content Möglichkeiten aufgelistet sind. Default sind alle false, die _init Methode
     * liest die aktuelle Seite aus.
     * @type {{start: boolean, coverages: boolean, livestreams: boolean, vods: boolean, gallery: boolean, groups: boolean, forums: boolean, search: boolean, users: boolean, headlines: boolean, matches: boolean, betting: boolean, changes: boolean, staff: boolean, statics: boolean}}
     * @private
     */
    var _siteLocation = {
        start: false,
        coverages: false,
        livestreams: false,
        vods: false,
        gallery: false,
        groups: false,
        forums: false,
        search: false,
        users: false,
        headlines: false,
        matches: false,
        betting: false,
        changes: false,
        staff: false,
        statics: false,
        news: false
    };

    /**
     * Methode wird bei der Instanziierung des Objektes ausgeführt. Liest die
     * aktuelle Seite aus.
     * @private
     */
    var _init = function(){
        _readCurrentLocation();
    };

    /**
     * Übergeben wird welche Seite abgefragt werden soll, die Funktion liefert dann true oder falls zurück,
     * je nachdem ob wir aktuell auf der Seite sind oder nicht.
     * @param what {String}
     * @returns {Boolean}
     */
    this.getLocation = function(what){
        return _siteLocation.hasOwnProperty(what) ? _siteLocation[what] : false;
    };

    /**
     * Erlaubt es direkt mehrere Abfragen mit einer Methode zu erledigen. Ist minimal langsamer, bringt
     * meiner Meinung nach aber einen Vorteil in der Übersichtlchkeit des Codes.
     * @param what {Array}
     * @param type {String} Möglichkeiten sind AND/OR. Wird ein andere Parameter übergeben, wird OR als
     *                      Default-Wert gesetzt.
     * @returns {boolean}
     */
    this.getMultipleLocations = function(what, type){
        var returnValue = false;
        var that        = this;

        switch(type){
            // AND wurde angegeben
            case 'AND':
                returnValue = true;

                $(what).each(function(index, value){
                    if (!that.getLocation(value)){
                        return returnValue = false;
                    }
                });
                break;

            // OR oder ein falscher Parameter wurde angegeben
            default:
                $(what).each(function(index, value){
                    if (that.getLocation(value)){
                        returnValue = true;
                        return false;
                    }
                });
                break;
        }

        return returnValue;
    };

    /**
     * Liest aus der URL (document.location.pathname) den Pfad (Routing) aus und match es auf die verschiedenen
     * Seiten.
     * @private
     */
    var _readCurrentLocation = function(){
        $.each(_siteLocation, function(name){
            if (document.location.pathname.substring(1, (name.length + 1)) === name){
                _siteLocation[name] = true;
                return false;
            }
        });
    };

    /**
     * Init Methode starten
     */
    _init();
}

/*
function Sync($, _options, _loadingScreen) {

    var _self = this;
    var _syncUrl = 'http://userscript.thextor.de/api/options/';
    var _syncOptions = JSON.parse(localStorage.getItem('userscriptSyncData'));
    var _$pwField = null;
    var _userId = 0;

    this.init = function(){
        $('#rmusSyncOptionsSave').on('click', _save);
        _$pwField = $('input[name="miscellaneous_syncOptionsPassword"]');
        _userId = _getUserId();

        // Beim Speichern der Optionen Syncen!
        $('#saveUserscriptOptions').click(function() {
            _self.sendOptionsToServer();
        });

        if (typeof _syncOptions === 'undefined' || _syncOptions == null){
            _syncOptions = {
                'lastupdate': 0,
                'lastcheck': +new Date()
            };
        }

        if (_options.getOption('miscellaneous_syncOptions')){
            if (_syncOptions.lastcheck < (+new Date()-300)){
                _self.receiveOptionsFromServer();
            }
        }
    };

    var _save = function(){
        var hash = _generateHash(_$pwField.val());

        _syncOptions.hashCode = hash;

        if (_$pwField.val().length >= 3){
            _$pwField.val(hash);

            if (_userId != 0){
                _self.receiveOptionsFromServer(true, true);
            }
            else{
                alert('Um diese Funktion zu nutzen musst du eingeloggt sein!');
            }
        }
        else{
            alert('Das Passwort muss mindestens 3 Zeichen lang sein!');
        }

    };

    var _saveSyncOptions = function(){
        localStorage.setItem('userscriptSyncData', JSON.stringify(_syncOptions));
    };

    var _generateHash = function(text){
        var hash = 0;
        if (text.length == 0) return hash;
        for (var i = 0; i < text.length; i++) {
            var char = text.charCodeAt(i);

            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    };

    var _getUserId = function(){
        var idMatches = $('#header li.ucp a:first')[0].href.match('users/([0-9]+)-.+');
        if (idMatches == null) return 0;
        return Number(idMatches[1]);
    };

    var _displayErrors = function(error){
        switch (error.type){
            case 'hash':
                alert(error.text);
                break;
            case 'userid':
                alert(error.text + ' Deine aktuellen Optionen werden deshalb nach dem Speichern mit dem Server synchonisiert.');

                break;
        }
    };

    this.sendOptionsToServer = function(){
        var type = 'PUT',
            data = {
                lastupdate: +new Date(),
                options: _options.getOptionsRaw()
            };

        // optionen wurden noch nicht synchonisiert
        if (_syncOptions.lastupdate === 0){
            type = 'POST';
            _syncOptions.lastupdate = +new Date();
        }

        $.ajax({
            url: _syncUrl + _userId + '/' + _syncOptions.hashCode,
            method: type,
            cache: false,
            dataType: 'json',
            data: data
        })
            .done(function(remoteData){
                // Kein Fehler aufgetreten
                if (typeof remoteData.error == 'undefined'){
                    _syncOptions.lastupdate = +new Date();
                }
                else{
                    _displayErrors(remoteData.error);
                }
            })
            .always(function(){
                _saveSyncOptions();
            });
    };

    this.receiveOptionsFromServer = function(showLoadingScreen, showPromt){
        showLoadingScreen = typeof showLoadingScreen === 'undefined' ? false : showLoadingScreen;
        showPromt         = typeof showPromt         === 'undefined' ? false : showPromt;

        if (showLoadingScreen){
            _loadingScreen.showLoadingScreen();
            _loadingScreen.changeLoadingMessage('Verbindung zum Server wird hergestellt, Passwort verglichen..');
        }

        var currentTime = +new Date();
        _syncOptions.lastcheck = currentTime;

        $.ajax({
            url: _syncUrl + _userId + '/' + _syncOptions.hashCode,
            method: 'GET',
            cache: false,
            dataType: 'json'
        })
            .done(function(remoteData){
                // Kein Fehler aufgetreten
                if (typeof remoteData.error == 'undefined'){
                    if (remoteData.lastupdate < currentTime && typeof remoteData.options !== 'undefined'){
                        var save = true;

                        if (showPromt){
                            save = confirm('Es wurden Optionen auf dem Server gefunden, sollen diese übernommen werden? (die aktuellen Einstellungen werden verworfen!)');
                        }

                        if (save){
                            _options.setOptionsRaw(remoteData.options);
                            // Wenn in den Optionen gespeichert wird neu laden
                            if (showPromt){
                                setTimeout(function(){
                                    location.reload();
                                }, 200);
                            }
                        }
                    }

                    _syncOptions.lastupdate = currentTime;
                }
                else{
                    _displayErrors(remoteData.error);
                }
            })
            .always(function(){
                // Sync Daten speichern
                _saveSyncOptions();

                setTimeout(function(){
                    if (showLoadingScreen)_loadingScreen.removeLoadingScreen();
                }, 150)
            });
    }
}
*/
/**
 * Ticker
 * ======
 *
 * Klasse für Funktionen die den Ticker betreffen.
 */

function Ticker($, _content) {

    /**
     * Blendent den Ticker komplett aus
     */
    this.hideTicker = function() {
        _content.get('tickerComplete').hide();
    };
}

/**
 * UserNicknames
 * ==========
 *
 * Fügt einen Link neben dem Username ein, um schnell auf die Nickname History eines Users zugreifen zu können
 */

function UserNicknames($, _siteLocation, _content){
    var _$contentElm = $('#c_content');

    this.insertLink = function(){
        if (_siteLocation.getLocation('forums') && _content.get('forumPosts').length){
            // Wenn wir uns im Forum befinden und Posts vorhanden sind
            // :not falls der Post schon einmal selektiert und bearbeitet wurde (bei nachladen von Posts)
            _insertDOMLink('.forum_post span.user:not(span:has(a.rmus-old-nicknames))');
        } else if (_siteLocation.getLocation('news') || _siteLocation.getLocation('users') || _siteLocation.getLocation('matches')){
            // News, Userprofile (Gästebuch) oder Ticker
            _insertDOMLink('div.comment div.comment_head');
        }
    };

    var _clickHandler = function (e) {
        e.preventDefault();

        var profileLink = $(this).next().prop('href'),
            nickHistoryLink = profileLink + '/nick_history';

        $.get(nickHistoryLink, null, function (content) {
            var siteContent = $('div#c_content', $($.parseHTML(content))),
                nicknameTable = $('table', siteContent);

            if (nicknameTable.length === 0 && null !== siteContent.text().match(/Der ausgewählte Account wurde von einem Admin gesperrt/)) {
                alert('Nicknames können nicht abgerufen werden, da der User gebannt wurde.');
                return;
            }

            var nicknameRows = $('tr', nicknameTable),
                nicknameCount = nicknameRows.length - 1, // - Header
                nicks = 'Bisherige Nicknames:\n\n';

            nicknameRows.each(function (i) {
                if (i === 0) {
                    // table header - continue
                    return true;
                }

                var row = $(this),
                    name = $('td:first', row).text(),
                    date = $('td:last', row).text();

                if (nicknameCount === 1 && name === 'Bisher keine anderen Nicknames.') {
                    nicks = name;
                    return false; // break
                }

                nicks += name + ' - '+ date + '\n';
            });

            alert(nicks);
        });
    };

    var _createLink = function () {
        var link = document.createElement('a'),
            div = document.createElement('div');

        div.className = 'userNicknames rmus-icon rmus-icon-list';
        link.title = 'Bisherige Nicknames anzeigen';
        link.className = 'rmus-old-nicknames';
        link.href = '';
        link.style.marginLeft = '3px';
        link.appendChild(div);

        return link;
    };

    var _insertDOMLink = function(selector){
        var $users = $(selector, _$contentElm);

        $users.each(function() {
            var nickLink = _createLink();
            $(nickLink).insertAfter($('span.user_status', this));
            $(nickLink).click(_clickHandler);
        });
    };
};
/**
 * Falls jQuery beziehungsweise das Userscript nicht in einer VM läuft wird Mootools von jQuery überschieben
 * und kann nicht mehr durch $ genutzt werden. Um das zu vermeiden werden alle globalen Einträge von
 * jQuery gelöscht und das Userscript noch einmal gekapselt.
 */

(function($){
    /**
     * Leider muss dadurch $ an alle Klassen übergeben werden
     * um wie vorher nutzbar zu sein.
     */
    var readmoreUserscript = new ReadmoreUserscript($);

    readmoreUserscript.start();
    readmoreUserscript.startIntervalReloadPosts();
    readmoreUserscript.startIntervalRapid();
    readmoreUserscript.startIntervalSlow();
})(jQuery.noConflict(true));

/**
 * Stellt die globale Variable $ wieder für Mootools her.
 * http://mootools.net/blog/2009/06/22/the-dollar-safe-mode/
 */
try{window.$ = document.id;}
catch(e){};