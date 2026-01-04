// jshint browser: true, jquery: true
// ==UserScript==
// @name        SoundCloud Downloader
// @namespace	http://www.dieterholvoet.com
// @author	    Dieter Holvoet
// @description	Adds a direct download button to all the tracks on SoundCloud  (works with the new SoundCloud interface)
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @include	    http://www.soundcloud.com/*
// @include	    http://soundcloud.com/*
// @include	    https://www.soundcloud.com/*
// @include	    https://soundcloud.com/*
// @grant       GM_addStyle
// @grant       GM_openInTab
// @version	1.1
// @downloadURL https://update.greasyfork.org/scripts/35092/SoundCloud%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/35092/SoundCloud%20Downloader.meta.js
// ==/UserScript==
//-----------------------------------------------------------------------------------

jQuery.noConflict();
(function ($) {

    $(function () {

        $.fn.exists = function () {
            return this.length !== 0;
        };

        /** Append stylesheet */
        var icon_buy = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAQAAACR313BAAAAg0lEQVQY02NgIAzU/qtuxSP9/4zOdxkhPAqcPqr9R4Uo5gXdRZd2eIwknXoAXXrZJiTp0tmokl6f/hsjSXfm4dHLwLDZUv+3y5fYN5VPZ907cO3leRS9QK/x/d/7f8H/5v9p/z3+a//nw/Ca6laYVxAsJOB6z/UeOgvZ+An/J6CzKAUAAatiLSilSl4AAAAASUVORK5CYII=";

        GM_addStyle(
            ".sc-button-small.sc-button-buy:before, .sc-button-medium.sc-button-buy:before {" +
            "background-image: url("+icon_buy+")" +
            "}"
        );

        /** Append download buttons */
        setInterval(function () {

            /**
             * Playlist page
             * - with official downloads: e.g. https://soundcloud.com/alexdoanofficial/sets/into-the-void-ep
             * - without official downloads: e.g. https://soundcloud.com/mule-z/sets/tropical
             * */

            $(".trackList").find(".trackList__item").each(function () {
                var $item = $(this).find(".trackItem__trackTitle").eq(0),
                    data = {
                        title: cleanTitle($item.text()),
                        url: $item.attr("href"),
                        id: "" // TODO: Fetch ID
                    },
                    track = new SoundCloudTrack($(this), data);

                track.appendButton('small', true);
            });


            /**
             * Track page
             * e.g. https://soundcloud.com/mkjaff/dyrisk-the-tallest-man-mkj-remix
             * */

            if($(".listenDetails .commentsList").exists()) {
                var $el = ($(".listenEngagement__footer").exists() ? $(".listenEngagement__footer") : $(".sound__footer")),
                    data = {
                        title: cleanTitle($(".soundTitle__title").eq(0).text()),
                        url: document.location.href,
                        id: "" // TODO: Fetch ID
                    },
                    track = new SoundCloudTrack($el, data);

                track.appendButton('medium', false);
            }


            /**
             * Homepage
             * https://soundcloud.com/stream
             *
             * Likes
             * https://soundcloud.com/you/likes
             *
             * Overview
             * https://soundcloud.com/you/collection
             *
             * User tracks page
             * https://soundcloud.com/lexer/tracks
             * */

            $(".lazyLoadingList").find(".soundList__item").each(function () {
                if (!$(this).find(".sound").is(".playlist")) {
                    var data = {
                            title: cleanTitle($(this).find(".soundTitle__title").eq(0).text()),
                            url: $(this).find(".soundTitle__title").eq(0).attr("href"),
                            id: ""
                        },
                        track = new SoundCloudTrack($(this), data);

                    track.appendButton('small', false);
                }
            });


            /**
             * Charts
             * e.g. https://soundcloud.com/charts/top
             * */

            $(".chartTracks").find(".chartTracks__item > .chartTrack").each(function () {
                var $item = $(this).find(".chartTrack__title a").eq(0),
                    data = {
                        title: $item.text(),
                        url: $item.attr("href")
                    },
                    track = new SoundCloudTrack($(this), data);

                track.appendButton('small', true);
            });


            /**
             * Play history
             * https://soundcloud.com/you/history
             * */

            $(".historicalPlays").find(".historicalPlays__item").each(function () {
                var $item = $(this).find("a.soundTitle__title").eq(0),
                    data = {
                        title: cleanTitle($item.text()),
                        url: $item.attr("href")
                    },
                    track = new SoundCloudTrack($(this), data);

                track.appendButton('small', false);
            });


            /**
             * User profile page
             * e.g. https://soundcloud.com/kiyokomusik
             * */

            $(".userStream").find(".soundList__item > .userStreamItem").each(function () {
                if (!$(this).find(".sound").is(".playlist")) {
                    var data = {
                            title: cleanTitle($(this).find(".soundTitle__title").eq(0).text()),
                            url: $(this).find(".soundTitle__title").eq(0).attr("href")
                        },
                        track = new SoundCloudTrack($(this), data);

                    track.appendButton('small', false);
                }
            });


            /**
             * Search page
             * e.g. https://soundcloud.com/search?q=addal
             * */

            $(".searchList").find(".searchList__item").each(function () {
                if ($(this).find(".sound").is(".track")) {
                    var $item = $(this).find(".soundTitle__title").eq(0),
                        data = {
                            title: $item.text(),
                            url: $item.attr("href")
                        },
                        track = new SoundCloudTrack($(this), data);

                    track.appendButton('small', false);

                } else if ($(this).find(".sound").is(".playlist")) {
                    // TO DO: Download playlist
                }
            });

        }, 2000);

        function SoundCloudGritter(track, title, isError, timeout) {
            var $wrapper = $("#gritter-notice-wrapper"),
                $gritters = $(".gritter-item-wrapper"),
                id = 'gritter-item-'+$gritters.length+1,
                $gritter = $('<div id="'+id+'" class="gritter-item-wrapper'+(isError ? ' error' : '')+'"><div class="gritter-top"></div><div class="gritter-item"><div class="gritter-close" style="display: none;"></div>'+(isError && track.findID() ? '' : '<img src="'+track.getArtworkURL(50)+'" class="gritter-image">')+'<div class="gritter-with-image">'+title+'<div style="clear:both"></div></div><div class="gritter-bottom"></div></div>');

            if(!$wrapper.exists()) {
                $(document).find('body').append('<div id="gritter-notice-wrapper" class="top-right"></div>');
                $wrapper = $($wrapper.selector)
            }

            $wrapper.append($gritter);

            setTimeout(function() {
                $("#"+id).fadeOut();
            }, timeout);
        }

        function SoundCloudTrack($el, data) {

            // Set $el
            this.$el = $el;

            // Set title
            if('title' in data)
                this.title = cleanTitle(data.title);
            else
                console.error("Missing title.", this);

            // Set url
            if('url' in data && isValidTrackURL(cleanURL(data.url)))
                this.url = cleanURL(data.url);
            else
                console.error("Missing or invalid track url.", this);

            // Set id
            data.id = this.findID();

            if('id' in data)
                this.id = data.id;
            else
                console.error("Couldn't find the ID of this song: ", this);
        }

        SoundCloudTrack.prototype.findButtonGroup = function() {
            var $small = this.$el.find('.soundActions .sc-button-group-small'),
                $medium = this.$el.find('.soundActions .sc-button-group-medium');

            if($small.exists()) {
                return $small;

            } else if($medium.exists()) {
                return $medium;

            } else {
                return false;
            }
        };

        SoundCloudTrack.prototype.findID = function() {
            if(exists(this.id))
                return this.id;

            var id = false,
                track = this;

            this.$el.find(".sc-artwork").each(function() {
                var bg = $(this).css("background-image"),
                    results = /artworks-([a-zA-Z0-9]+)-/.exec(bg);

                if(results != null && results.length > 0) {
                    id = results[1];
                }
            });

            if(id) {
                this.id = id;
            }

            return id;
        };

        SoundCloudTrack.prototype.makeDownloadButton = function(url, size, isIconOnly, isExternal) {
            var $button = $('<a class="sc-button sc-button-'+size+' sc-button-responsive sc-button-download'+(isIconOnly ? ' sc-button-icon' : '')+'" sc-id="'+this.id+'" title="Download ' + this.title + '" >Download'+ (isExternal ? ' (external)' : '') +'</a>'),
                track = this;

            // Remove exit.sc from URL
            if(url.indexOf("exit.sc") !== -1) {
                url = (new URL(url).search.match(/(?:\?|&)url=([^&]+)/) || [])[1];
                url = decodeURIComponent(url);
            }

            if(!isExternal && isValidTrackURL(url)) {
                url = "https://mrvv.net/scdl/scdlSC.php?url=" + url;

                $button.on("click", function() {
                    var id = $(this).attr('sc-id');
                    if(exists(id))
                        new SoundCloudGritter(track, 'Download of <span class="gritter-title">'+track.title+'</span> will start in a moment.</div>', false, 3000);

                    $.get(url, function (data) {
                        if (data.hasOwnProperty('error')) {
                            var message = data.error;

                            if(track.isGeoblocked())
                                message = "not available in your country.";
                            else if(track.isGO())
                                message = "only for SoundCloud GO users.";

                            new SoundCloudGritter(track, 'Download of <span class="gritter-title">'+track.title+'</span> failed: '+message, true, 8000);
                            console.error("Download failed: " + message, track);

                        } else {
                            GM_openInTab("https://mrvv.net/scdl/scdlDL.php?url=" + data.dlfileurl, true);
                        }
                    }, "json");
                });

            } else {
                $button.attr("href", url);
                $button.attr("target", '_blank');
            }

            this.findButtonGroup().eq(0).append($button);
            return $button;
        };

        SoundCloudTrack.prototype.makeBuyButton = function(url, size, iconOnly) {
            var $button = $('<a href="'+url+'" target="_blank" class="sc-button sc-button-'+size+' sc-button-responsive sc-button-buy'+(iconOnly ? ' sc-button-icon' : '')+'" title="Buy ' + this.title + '" >Buy</a>');
            this.findButtonGroup().eq(0).append($button);
            return $button;
        };

        SoundCloudTrack.prototype.appendButton = function(size, iconOnly) {

            // Set checked
            if(this.isChecked())
                return;
            else
                this.setChecked(true);

            /** Find and check button group **/
            if(!this.findButtonGroup()) {
                if(this.isPreview()) {
                    console.error("Track is preview-only, can't be downloaded: " + url);

                } else if(this.isGeoblocked()) {
                    console.error("Track is geoblocked, can't be downloaded: " + url);

                } else {
                    console.error("No button-group found. Please verify selector.");
                }

                return;
            }

            // Append download button
            if(this.findButtonGroup().find(".sc-button-download").exists()) {
                /** Check presence of download button */
                // console.error("Download button already present.");

            } else if(this.findExternalFreeDownload()) {
                /** Check presence of external free download link */
                this.makeDownloadButton(this.findExternalFreeDownload().prop('href'), size, iconOnly, true);
                this.findExternalFreeDownload().remove();

            } else {
                /** Fetch download URL */
                this.makeDownloadButton(this.url, size, iconOnly, false);
            }

            // Append buy button
            var $external = this.findExternalBuyLink();
            if($external) {
                this.makeBuyButton($external.prop('href'), size, iconOnly);
                $external.remove();
            }
        };

        SoundCloudTrack.prototype.findExternalFreeDownload = function() {
            if(exists(this.$freedl))
                return this.$freedl;

            var $freedl = this.$el.parent().find('.soundActions__purchaseLink').eq(0),
                strings = ['free download', 'free dl'],
                websites = ['theartistunion', 'toneden', 'artistsunlimited.co', 'melodicsoundsnetwork.com', 'edmlead.net', 'click.dj', 'woox.agency', 'hypeddit.com', 'hive.co'],
                hasExternalFreeDownload = false;

            if($freedl.exists()) {
                strings.forEach(function(elem) {
                    if($freedl.text().toLowerCase().indexOf(elem) !== -1)
                        hasExternalFreeDownload = true;
                });

                websites.forEach(function(elem) {
                    if($freedl.attr('href').toLowerCase().indexOf(elem) !== -1)
                        hasExternalFreeDownload = true;
                });
            }

            if(hasExternalFreeDownload) {
                this.$freedl = $freedl;
                return $freedl;

            } else {
                return false;
            }
        };

        SoundCloudTrack.prototype.findExternalBuyLink = function() {
            var $buylink = this.$el.find('.soundActions__purchaseLink').eq(0),
                strings = ['buy', 'spotify', 'beatport', 'juno', 'stream'],
                websites = ['lnk.to', 'open.spotify.com', 'spoti.fi', 'junodownload.com', 'beatport.com', 'itunes.apple.com', 'play.google.com', 'deezer.com', 'napster.com', 'music.microsoft.com'],
                hasExternalBuyLink = false;

            if($buylink.exists()) {
                strings.forEach(function(elem) {
                    if($buylink.text().toLowerCase().indexOf(elem) !== -1)
                        hasExternalBuyLink = true;
                });

                websites.forEach(function(elem) {
                    if($buylink.attr('href').toLowerCase().indexOf(elem) !== -1)
                        hasExternalBuyLink = true;
                });
            }

            if(hasExternalBuyLink) {
                return $buylink;

            } else {
                return false;
            }
        };

        SoundCloudTrack.prototype.setChecked = function(checked) {
            this.$el.attr('checked', checked);
        };

        SoundCloudTrack.prototype.isChecked = function(checked) {
            return typeof this.$el.attr('checked') != 'undefined';
        };

        SoundCloudTrack.prototype.isGeoblocked = function() {
            if(this.$el.find(".g-geoblocked-icon").exists()) {
                return true;

            } else if(this.$el.parent("trackItem__additional").find(".g-geoblocked-icon").exists()) {
                return true;
            }

            return false;
        };

        SoundCloudTrack.prototype.isPreview = function() {
            var $item = $([]);

            if(this.$el.find(".sc-snippet-badge").exists()) {
                $item = $item.find(".sc-snippet-badge");

            } else if(this.$el.parent("trackItem__additional").find(".sc-snippet-badge").exists()) {
                $item = $item.parent("trackItem__additional").find(".sc-snippet-badge");
            }

            return $item.eq(0).text() === "Preview";
        };

        SoundCloudTrack.prototype.isGO = function() {
            return this.$el.find('.g-go-marker-artwork').exists();
        };

        SoundCloudTrack.prototype.getArtworkURL = function(size) {
            return 'https://i1.sndcdn.com/artworks-'+this.id+'-0-t'+size+'x'+size+'.jpg'
        };

        /*
         HELPERS
         */

        function exists(thing) {
            return (typeof thing != "undefined" || thing != null || ($.isArray(thing) && thing.length > 0))
        }

        function cleanTitle(title) {
            title = title.replace(/"/g, "'");
            title = $.trim(title);
            return title;
        }

        function cleanURL(url) {
            url = url.split(/[?#]/)[0]; // Strip query string
            url = relativeToAbsoluteURL(url); // Convert to an absolute url if necessary
            return url;
        }

        function isValidTrackURL(url) {
            if(!url.match(/^(http|https):\/\/soundcloud\.com\/.+\/.+$/g)) return false;
            if(url.match(/^(http|https):\/\/soundcloud\.com\/.+\/sets\/.+$/)) return false;
            return true;
        }

        function relativeToAbsoluteURL(url) {
            if(url.substr(0, 1) === '/')
                return 'https://soundcloud.com'+url;
            else
                return url;
        }

    });

})(jQuery);