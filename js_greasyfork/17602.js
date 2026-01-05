// ==UserScript==
// @name         AU Global Fix
// @namespace    AUVTF
// @version      2.1.0
// @description  Will fix many things that are wrong with AnimeUltima.io
// @author       Jopitan
// @match        http://www.animeultima.io/*
// @exclude      http://www.animeultima.io/forums/*
// @exclude      http://www.animeultima.io/[a-zA-Z0-9-].php
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/17602/AU%20Global%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/17602/AU%20Global%20Fix.meta.js
// ==/UserScript==

'use strict';
(function ($) {
    const STORAGE_VARIABLE_SETTINGS = 'au_settings';
    const STORAGE_VARIABLE_THUMBNAIL = 'au_thumbnails';
    const STORAGE_VARIABLE_FAVORITES = 'au_favorites';

    function _storage() {

        var _get = function (item) {
            return JSON.parse(localStorage.getItem(item));
        };

        var _set = function (item, obj) {
            localStorage.setItem(item, JSON.stringify(obj));
        };

        var _create = function (items) {
            if (items instanceof Array) {
                for (var item in items) {
                    if (items.hasOwnProperty(item))
                        _create(items[item]);
                }
                return;
            }
            var storageItem = _get(items);
            if (storageItem === null)
                _set(items, {});
        };

        return {
            'create': _create,
            'get': _get,
            'set': _set
        };
    }

    function _favorites() {

        var favorites = {};

        var _save = function () {
            window.au.storage.set(STORAGE_VARIABLE_FAVORITES, favorites);
        };

        var _load = function () {
            var favoritesList = window.au.storage.get(STORAGE_VARIABLE_FAVORITES);
            if (favoritesList !== null)
                favorites = favoritesList;
        };

        var _new = function (id, obj) {
            var key = btoa(id);
            favorites[key] = obj;
            _save();
        };

        var _get = function (id) {
            var key = btoa(id);
            return favorites[key] || null;
        };

        var _exists = function (id) {
            return _get(id) !== null;
        };

        var _list = function () {
            return favorites;
        };

        var _remove = function (id) {
            var key = btoa(id);
            favorites.splice(key);
            _save();
        };

        _load();

        return {
            'new': _new,
            'remove': _remove,
            'get': _get,
            'list': _list,
            'exists': _exists
        };

    }

    function _settings() {

        var settings = {};

        var _list = function () {
            return settings;
        };

        var _save = function () {
            window.au.storage.set(STORAGE_VARIABLE_SETTINGS, settings);
        };

        var _get = function (id) {
            var key = btoa(id);
            return settings[key];
        };

        var _set = function (id, value) {
            var key = btoa(id);
            settings[key] = value;
            _save();
        };

        var _load = function () {
            var settingsList = window.au.storage.get(STORAGE_VARIABLE_SETTINGS);
            if (settingsList !== null)
                settings = settingsList;
        };

        _load();

        return {
            'list': _list,
            'get': _get,
            'set': _set
        };

    }

    function _thumbnails() {

        const DOWNLOAD_URL = 'http://topdev.xyz/thumb.php';

        var thumbnails = {};

        var _list = function () {
            return thumbnails;
        };

        var _save = function () {
            window.au.storage.set(STORAGE_VARIABLE_THUMBNAIL, thumbnails);
        };

        var _get = function (id) {
            var key = btoa(id);
            return thumbnails[key] || null;
        };

        var _set = function (id, value) {
            var key = btoa(id);
            thumbnails[key] = value;
            _save();
        };

        var _addRelative = function (parentUrl, relativeUrl) {
            var parentObj = _get(parentUrl);
            if (typeof parentObj.relatives === 'undefined')
                parentObj.relatives = [];
            parentObj.relatives.push(btoa(relativeUrl));
            _set(parentUrl, parentObj);
        };

        var _hasRelative = function (parentObj, relativeUrl) {
            if (typeof parentObj.relatives === 'undefined')
                return false;
            var key = btoa(relativeUrl);
            return parentObj.relatives.indexOf(key) >= 0;
        };

        var _getParent = function (url) {
            var key = btoa(url);
            for (var thumbnail in thumbnails) {
                if (thumbnails.hasOwnProperty(thumbnail)) {
                    var obj = thumbnails[thumbnail];
                    if (typeof obj.relatives !== 'undefined') {
                        if (obj.relatives.indexOf(key) !== -1) {
                            return obj;
                        }
                    }
                }
            }
            return null;
        };

        var _download = function (id, url, applyTo) {
            $.get(DOWNLOAD_URL + '?id=0&url=' + encodeURIComponent(btoa(url)))
                .done(function (xhr) {
                    var imgUrl = xhr.data[0];
                    _set(id, {
                        'relatives': [],
                        'img': imgUrl
                    });
                    if (typeof applyTo !== 'undefined') {
                        if (typeof applyTo === 'function') {
                            applyTo();
                        } else {
                            $(applyTo).attr('src', imgUrl);
                        }
                    }
                });
        };

        var _load = function () {
            var thumbnailsList = window.au.storage.get(STORAGE_VARIABLE_THUMBNAIL);
            if (thumbnailsList !== null)
                thumbnails = thumbnailsList;
        };

        _load();

        return {
            'list': _list,
            'get': _get,
            'set': _set,
            'download': _download,
            'addRelative': _addRelative,
            'hasRelative': _hasRelative,
            'getParent': _getParent
        };

    }

    function _router() {

        const PAGE_NAME_VIDEO_OVERVIEW = 'video_overview';
        const PAGE_NAME_UPLOAD_PAGE = 'upload_page';
        const PAGE_NAME_VIDEO_PAGE = 'video_page';
        const PAGE_NAME_ANIME_LIST = 'anime_list';
        const PAGE_NAME_SEARCH = 'search';
        const PAGE_NAME_DEFAULT = 'home';
        const PAGE_NAME_NONE = 'none';

        var _path = function () {
            return window.location.pathname;
        };

        var _whoAmI = function () {
            var pathSplit = _path().split('/');
            if (pathSplit[1] == 'watch') {
                return PAGE_NAME_VIDEO_OVERVIEW;
            } else if (pathSplit[1] == 'search.html') {
                return PAGE_NAME_SEARCH;
            } else if (typeof pathSplit[2] !== 'undefined') {
                if (pathSplit[1] == 'upload') {
                    return PAGE_NAME_UPLOAD_PAGE;
                } else if (pathSplit[1] == 'watch-anime') {
                    return PAGE_NAME_ANIME_LIST;
                }
                return PAGE_NAME_VIDEO_PAGE;
            } else if (pathSplit[0] == '' && pathSplit[1] == '') {
                return PAGE_NAME_DEFAULT;
            } else {
                return PAGE_NAME_NONE;
            }
        };

        var _const = {
            'PAGE_NAME_VIDEO_OVERVIEW': PAGE_NAME_VIDEO_OVERVIEW,
            'PAGE_NAME_UPLOAD_PAGE': PAGE_NAME_UPLOAD_PAGE,
            'PAGE_NAME_VIDEO_PAGE': PAGE_NAME_VIDEO_PAGE,
            'PAGE_NAME_ANIME_LIST': PAGE_NAME_ANIME_LIST,
            'PAGE_NAME_SEARCH': PAGE_NAME_SEARCH,
            'PAGE_NAME_DEFAULT': PAGE_NAME_DEFAULT,
            'PAGE_NAME_NONE': PAGE_NAME_NONE
        };

        return {
            'path': _path,
            'whoAmI': _whoAmI,
            'const': _const
        };

    }

    function _behaviour() {

        var _home = function () {
            $('div.nr-top a').on('click', function () {
                var rel = $(this).attr('rel');
                $('div.nr-top a').removeClass('nr-toggle-view-active');
                $(this).addClass('nr-toggle-view-active');
                $('.switch').hide();
                $('.switch.' + rel).show();
            });
            $('<div id="calendar-view" style="display: none;" class="switch calendar"></div>')
                .insertAfter('#new-episodes');
            $('#new-episodes').addClass('switch default');
            $('#calendar-view').css({
                'width': '100%',
                'height': '650px'
            });
            $("#new-episodes .thumb a").each(function (index, object) {
                var episodeObject = $(object);
                var episodeLink = episodeObject.attr('href');
                var cachedObject = window.au.thumbnails.get(episodeLink);
                if (cachedObject === null) {
                    $.get(episodeLink)
                        .done(function (data) {
                            var html = $(data);
                            var link = html.find('#pembed iframe').attr('src');
                            window.au.thumbnails.download(episodeLink, link, episodeObject.find('img'));
                        });
                } else {
                    episodeObject.find('img').attr('src', cachedObject.img);
                }
            });

            $.get('/ajax.php?method=newrelease_calendarview&standalone=0')
                .done(function (html) {
                    $('#calendar-view').html(html);
                    $('#calendar-view').show();
                    var height = $('#fp_calendarview').height();
                    $('#calendar-view').hide().height(height);
                });
        };

        var _videoOverview = function () {
            $('div.inline-top a:contains(Reviews)').remove();
            var path = window.au.router.path();
            if (!window.au.favorites.exists(path)) {
                $('div.inline-top a:contains(Add to Favorites)').on('click', function () {
                    var href = $(this).attr('href');
                    $.get(href)
                        .done(function (data) {
                            if (data !== 'Already on your favorites...') {
                                alert(data);
                            }
                            window.au.favorites.new(window.au.router.path(), {
                                'date': (new Date()).toUTCString()
                            });
                            $('div.inline-top a:contains(Add to Favorites)').remove();
                        });
                    return false;
                });
            } else {
                $('div.inline-top a:contains(Add to Favorites)').remove();
            }
        };

        var _checkRelatedVideos = function (url, obj) {
            $('#related-videos .thumb a').each(function (index, object) {
                var obj = $(object);
                var href = obj.attr('href');
                if (!window.au.thumbnails.hasRelative(obj, href)) {
                    window.au.thumbnails.addRelative(url, href);
                }
            });
        };

        var _videoPage = function () {
            var currentPath = window.au.router.path();
            var parentThumbnail = window.au.thumbnails.getParent(currentPath);
            var getThumbnail = window.au.thumbnails.get(currentPath);
            if (parentThumbnail !== null) {
                $('#related-videos .thumb .bg-image').attr('src', parentThumbnail.img);
            } else if (getThumbnail !== null) {
                _checkRelatedVideos(currentPath, getThumbnail);
                $('#related-videos .thumb .bg-image').attr('src', getThumbnail.img);
            } else {
                var link = $('#pembed iframe').attr('src');
                window.au.thumbnails.download(currentPath, link, function () {
                    var thumbnail = window.au.thumbnails.get(currentPath);
                    $('#related-videos .thumb .bg-image').attr('src', thumbnail.img);
                    _checkRelatedVideos(currentPath, thumbnail);
                });
            }
        };

        return {
            'home': _home,
            'videoOverview': _videoOverview,
            'videoPage': _videoPage
        };

    }

    function _css() {

        var _removeUselessCrap = function () {
            $("h3:contains(Popular Episodes in the past 7 days)").next().remove();
            $("h3:contains(Popular Episodes in the past 7 days)").remove();
            $("h2:contains(Episode Tracker)").next().remove();
            $("h2:contains(Episode Tracker)").remove();
            $("#hp-ads").remove();
        };

        var _restyleSearch = function () {
            var searchField = $('#search').find('input[name="searchquery"]');
            $('#search button').remove();
            searchField.css({'width': '248px','line-height':'22px'}).attr({'placeholder': searchField.val(),'autocomplete': 'off'}).val('').attr('onclick', '');
            $('#search').append('<div class="searchify"></div>');
            $('.searchify').css({
                'background-color': '#fff',
                'position': 'absolute',
                'width': '250px',
                'border': '1px solid #000'
            }).hide().append('<div class="container"></div>');
            $('.searchify .container').append('<ul id="searchResults"></ul>');
            $('#searchResults').css({'padding':'5px'});
        };

        var _moveBlocks = function () {
            $("#new-anime-div").css({'float': 'left'}).after('<div id="ongoing-anime"></div>');
            var ongoingParent = $('h3:contains("On-Going Anime")').parent();
            var ongoingAnimeSelector = ongoingParent.html();
            $('#ongoing-anime').css({'float':'right', 'width': '320px'}).html(ongoingAnimeSelector)
            ongoingParent.remove();
        };
        
        $('body').on('keyup', function(event) {
            if(event.keyCode === 27) {
                $('.searchify').hide();
            }
        });
        
        $('input[name="searchquery"]').on('input', function() {
           var searchQuery = $(this).val();
           if(searchQuery.length >= 3) {
               $.ajax({
                   url: '/search.html?searchquery=' + searchQuery.trim(),
                   dataType: 'html',
                   method: 'GET'
               }).done(function(data) {
                   $('.searchify').show();
                   $('#searchResults').html('');
                    var html = $(data);
                    var results = html.find('#searchresult li');
                    results.each(function(index, obj) {
                       $('#searchResults').append($(obj).prop('outerHTML').replace('h2>', 'h3>'));
                    });
                    $('#searchResults li p').remove();
                    $('#searchResults li').css({
                        'border-right': '0',
                        'width': '94%'
                    });
               });
           } else {
               $('.searchify').hide();
           }
           return false;
        });

        return {
            'removeUselessCrap': _removeUselessCrap,
            'restyleSearch': _restyleSearch,
            'moveBlocks': _moveBlocks
        };

    }

    window.au = {};
    window.au.storage = _storage();
    window.au.settings = _settings();
    window.au.favorites = _favorites();
    window.au.thumbnails = _thumbnails();
    window.au.router = _router();
    window.au.behaviour = _behaviour();
    window.au.css = _css();

    $(document).ready(function () {

        window.au.storage.create([
            STORAGE_VARIABLE_SETTINGS,
            STORAGE_VARIABLE_THUMBNAIL,
            STORAGE_VARIABLE_FAVORITES
        ]);

        switch (window.au.router.whoAmI()) {
            case window.au.router.const.PAGE_NAME_VIDEO_OVERVIEW:
                window.au.behaviour.videoOverview();
                break;
            case window.au.router.const.PAGE_NAME_VIDEO_PAGE:
                window.au.behaviour.videoPage();
                break;
            case window.au.router.const.PAGE_NAME_DEFAULT:
                window.au.behaviour.home();
                window.au.css.removeUselessCrap();
                window.au.css.moveBlocks();
                break;
            case window.au.router.const.PAGE_NAME_NONE:
            default:
        }
        window.au.css.restyleSearch();
    });
})(jQuery);