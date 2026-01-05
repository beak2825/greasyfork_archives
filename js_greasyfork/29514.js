// ==UserScript==
// @name         TweetDeck Image Assistant
// @namespace    http://ejew.in/
// @version      1.1
// @description  Download/Share Images Faster
// @author       EntranceJew
// @match        https://tweetdeck.twitter.com*
// @require      https://cdn.rawgit.com/eligrey/FileSaver.js/5ed507ef8aa53d8ecfea96d96bc7214cd2476fd2/FileSaver.min.js
// @require      https://cdn.rawgit.com/kamranahmedse/jquery-toast-plugin/1105577ed71ef368f8aa3d96295857643dca43d7/dist/jquery.toast.min.js
// @noframes
// @resource    toastCSS https://cdn.rawgit.com/kamranahmedse/jquery-toast-plugin/1105577ed71ef368f8aa3d96295857643dca43d7/dist/jquery.toast.min.css
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/29514/TweetDeck%20Image%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/29514/TweetDeck%20Image%20Assistant.meta.js
// ==/UserScript==
/*
1.1 - performance fixes, ctrl+hotlink doesn't destroy the first image's media link anymore, better button insertion, auto-follow lockfind updated, buttons don't appear in DMs anymore
1.0 - fixed issue with logic in setting default image resolution
0.9 - toast notifications, better clipboard access methods, better image sources, ctrl+click like/rt/download to follow from column owner, fixed errors in previewer
0.8 - added t.co link unmasking
0.7 - apparently getting gif sources works most reliably inside callbacks
0.6 - hotfix to prevent redundant page reloading with stream-media seek methods
0.5 - video links no longer destroy links, ctrl+click the timestamp to copy the tweet link, ctrl+click the link icon to prepare multi-image tweets for discord
0.4 - changed download icon, added copy links button, videos now don't flash their preview, videos no longer close your draft tweets panel
0.3 - gif support wasn't that hard
0.2 - removed debug prints, updated mimes, added video download link, instant-spice now grabs videos
0.1 - initial version
*/

/* # todo:
 * move code into bettertweetdeck
 * make it so that toasts batch by purpose, extending notification times
 * better support for tweet-details view (sometimes causing lockouts?)
 * better support for modal big preview tweets
 * stack quote-tweets
 * do not count quoted media as a media source
 * context menu item insertion
 * context sensitive actions
 * custom action icons / styles
 * update action button tooltips when modifier keys are pressed
 * action to follow all explicitly mentioned users in a tweet (not in the conversation)
 * better tweetdeck integration
 */

(function() {
    'use strict';

    GM_addStyle( GM_getResourceText("toastCSS") );

    var settings = {
        toast: {
            hideAfter: 1000,
        }
    };

    var toast_prototype = {
        text: "Don't forget to star the repository if you like it.", // Text that is to be shown in the toast
        heading: 'Note', // Optional heading to be shown on the toast
        icon: 'success', // Type of toast icon
        showHideTransition: 'slide', // fade, slide or plain
        allowToastClose: true, // Boolean value true or false
        hideAfter: settings.toast.hideAfter, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
        stack: 32, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
        position: 'bottom-left', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values

        textAlign: 'left',  // Text alignment i.e. left, right or center
        loader: true,  // Whether to show loader or not. True by default
        loaderBg: '#9EC600',  // Background color of the toast loader
        beforeShow: function () {}, // will be triggered before the toast is shown
        afterShown: function () {}, // will be triggered after the toat has been shown
        beforeHide: function () {}, // will be triggered before the toast gets hidden
        afterHidden: function () {}  // will be triggered after the toast has been hidden
    };

    function toast( heading, text, icon ){
        return $.toast(jQuery.extend(true, toast_prototype, {
            heading: heading,
            text: text,
            icon: icon
        }));
    }

    var toolbar_size = 6;
    var tool_icon_width = (1 / toolbar_size) * 100;

    GM_addStyle( `
    .tweet-detail-action-item,
    .without-tweet-drag-handles .tweet-detail-action-item {
        width: ` + tool_icon_width + `% !important;
    }

    .jq-toast-single {
        word-break: break-all;
    }
    `);

    function add_action_style( name, details ){
        var style = `
            .tweet-action:hover .icon-` + details.icon_name +`,
            .tweet-detail-action:hover .icon-` + details.icon_name +`,
            .dm-action:hover .icon-` + details.icon_name +`,
            .tweet-action:focus .icon-` + details.icon_name +`,
            .tweet-detail-action:focus .icon-` + details.icon_name +`,
            .dm-action:focus .icon-` + details.icon_name +`,
            .tweet-action:active .icon-` + details.icon_name +`,
            .tweet-detail-action:active .icon-` + details.icon_name +`,
            .dm-action:active .icon-` + details.icon_name +`,
            .tweet-action.is-selected .icon-` + details.icon_name +`,
            .is-selected.tweet-detail-action .icon-` + details.icon_name +`,
            .is-selected.dm-action .icon-` + details.icon_name +` {
                color: ` + details.color + `;
            }`;
        GM_addStyle( style );
    }

    //.icon-link:before{ content: "\f088"; }
    var action_properties = {
        'download': {
            'name': 'Download',
            'tool_tip': 'Download',
            'rel': 'download',
            'icon_name': 'attachment',
            'before_content': "\f088",
            'color': '#D400E0',
            'on': {
                'click': [
                    ['download_url', ['media_link']],
                    'media_next',
                    ['download_url', ['media_link']],
                    'media_next',
                    ['download_url', ['media_link']],
                    'media_next',
                    ['download_url', ['media_link']],
                    'media_next',
                ],
                'ctrl+click': [
                    'default',
                    'follow'
                ]
            },
        },
        'hotlink': {
            'name': 'Hotlink',
            'tool_tip': 'Hotlink',
            'rel': 'hotlink',
            'icon_name': 'link',
            'before_content': "\f098",
            'color': '#00498A',
            'on': {
                'click': [
                    'clipboard_open',
                    ['clipboard_push', ['media_link']],
                    'media_next',
                    ['clipboard_push', ['media_link']],
                    'media_next',
                    ['clipboard_push', ['media_link']],
                    'media_next',
                    ['clipboard_push', ['media_link']],
                    'media_next',
                    'clipboard_copy'
                ],
                'ctrl+click': [
                    'clipboard_open',
                    ['clipboard_push', ['tweet_link']],
                    'media_next',
                    'media_next',
                    ['clipboard_push', ['media_link']],
                    'media_next',
                    ['clipboard_push', ['media_link']],
                    'media_next',
                    ['clipboard_push', ['media_link']],
                    'media_next',
                    'clipboard_copy'
                ],
            },
        },
    };

    for (var name in action_properties) {
        add_action_style(name, action_properties[name]);
    }

    var possible_locations = {
        'single': {
            'context': '.tweet-detail-wrapper > article.stream-item',
            //'toolbar': 'tweet-detail-actions',
            //'item': 'tweet-detail-action-item',
            'filters': [
                ":not('.feature-customtimelines')",
                ":last"
            ],
            'images': [
                'img.media-img',
            ],
        },
        'normal': {
            'context': 'article.stream-item',
            //'toolbar': 'tweet-actions',
            //'item': 'tweet-action-item',
            'filters': [
                ":not('.feature-customtimelines')",
                ":last"
            ]
        },
        'modal': {
            'context': 'div#open-modal div.item-box',
            //'toolbar':
            //
            'filters': []
        }
    };

    function add_to_toolbar( context = 'html', action = action_properties.download, location = possible_locations.normal ){
        // var slugged = action.name.replace(/\s/g, '').toLowerCase();

        // clone reply
        var x = $( context ).find( "ul[class*=-actions] > li:first" ).clone();

        // set the attributes
        x.find('a')
            .removeClass('js-reply-action')
            .addClass('js-'+action.rel+'-action')
            .addClass('js-show-tip')
            .attr('rel', action.rel )
            .attr('title', action.tool_tip )
            .data('original-title', action.tool_tip );

        x.find('i')
            .removeClass('icon-reply')
            .addClass('icon-'+action.icon_name)
            .addClass('icon-'+action.icon_name+'-toggle');

        x.find('span.is-vishidden')
            .text( action.tool_tip );

        // plant it back at the end
        var z = $( context ).find( "ul[class*=-actions] > li" );
        location.filters.forEach(function(element){
            z = $( z ).filter( element );
        });
        z = $( z ).prev();
        $( x ).insertAfter( $(z) );

        return $( x );
    }

    var mime_db = {
        jpeg: "image/jpeg",
        jpg: "image/jpeg",
        gif: "image/gif",
        webp: "image/webp",
        mp4: "video/mp4",
        m3u8: "application/x-mpegURL",
        undefined: "text/plain"
    };

    function clipboard_data( text ){
        var tc = $('.compose-text-container .js-compose-text');
        var orig = tc.val();
        var active = document.activeElement;
        tc.val( text );
        tc[0].focus();
        tc[0].setSelectionRange( 0, text.length );
        document.execCommand("copy");
        tc.val( orig );
        active.focus();
        toast("Copied <em>" + text.split(/\r*\n/).length + "</em> Lines!", text.replace(/\r*\n/, "<br>"), "info");
    }

    // http://stackoverflow.com/a/2091331
    function getQueryVariable(str, variable) {
        var query = str.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
        console.log('Query variable %s not found', variable);
    }

    function detect_mime(url){
        return mime_db[ /(?:\.([^.]+))?$/.exec(url)[1] ];
    }

    function get_img_data( url, on_load ) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.onload = on_load;
        xhr.send();
    }

    function is_empty( str ){
        return !(str && typeof(str) == "string" && str.trim().length !== 0 && str !== "none");
    }

    function unique(array) {
        return $.grep(array, function(el, index) {
            return index === $.inArray(el, array);
        });
    }

    function unpack_sources( packed_sources, context ){
        var unpacked = [];
        for( var str in packed_sources ){
            var src = packed_sources[str];
            if( typeof(src) === "function" ){
                src = src( context );
            }
            if( !is_empty( src ) ){
                unpacked.push( nice_url( src ) );
            }
        }
        return unique(unpacked);
    }

    function download_now( url, prefix = "twitter_" ){
        if( url.length ){
            get_img_data( url, function( e ){
                var img_name = url.substring( url.lastIndexOf('/')+1 );
                var the_blob = new Blob([this.response], {type: detect_mime(url)});
                var save_file_name = img_name.replace(/:orig$/, "");
                saveAs( the_blob, prefix + save_file_name );
                if( save_file_name.endsWith('mp4') ){
                    toast("Downloaded <em>1</em> Video!", save_file_name, "info");
                }
            });
        }
    }

    function nice_url( url, replacement ){
        if( replacement === "" ){
            // whatever
        } else if( !replacement ){
            replacement = ":orig";
        }

        var bg = url;
        bg = bg.replace('url(','').replace(')','').replace(/\"/gi, "");
        bg = bg.replace(/:thumb$/, replacement);
        bg = bg.replace(/:small$/, replacement);
        bg = bg.replace(/:medium$/, replacement);
        bg = bg.replace(/:large$/, replacement);
        return bg;
    }

    // danger: this could potentially lockup if the element isn't guaranteed to appear.
    function lock_find( selector, context ){
        var results = $( selector, context );
        while( !results.length ){
            results = $( selector, context );
        }
        return results;
    }

    // we have to do literal jungle japes in order to get to the follow button from here
    // strap in
    function follow_tweet( selector ){
        $( selector ).find( "ul[class*=-actions] > li:not(.feature-customtimelines) i.icon-more" ).filter(":last").click();
        var column_owner = $( selector ).parents('.column-panel').find('h1.column-title span.attribution').text();
        var more = lock_find('.js-dropdown.dropdown-menu a[data-action="followOrUnfollow"]', $( selector ));
        $( more ).parent('li.is-selectable').addClass('is-selected');
        $( more ).click();
        var follow_container = lock_find('div.js-modal-context');
        var column_owner_follow = null;

        // entrancejew only follows from his third account
        // entrancejew also refuses to implement settings yet
        if( column_owner == "@EntranceJew" ){
            column_owner_follow = lock_find('div.js-follow-from:nth-child(3)', follow_container);
        } else {
            follow_container.find('.js-from-username').each(function(){
                var this_name = $( this ).text();
                if( this_name.includes( column_owner ) ){
                    column_owner_follow = $( this ).parent('.js-follow-from');
                }
            });
        }

        var follow_button = null;
        var follow_seeker = setInterval(function(){
            follow_button = column_owner_follow.find('.js-action-follow[class*=" s-"]');
            if( follow_button.length ){
                if( follow_button.hasClass('s-not-following') ){
                    var user_to_follow = $('.mdl-header-title a[rel="user"]').text();
                    follow_button.find('button').click();
                    toast("Followed <em>1</em> Users!", user_to_follow, "info");
                } else if( !follow_button.hasClass('s-following') ){
                    var attrs = follow_button.attr('class');
                    toast("I'm Confused!", "What is a <em>" + attrs + "</em>?", "error");
                }
                follow_container.find('.icon-close').click();
                clearInterval(follow_seeker);
            }
        },50);
    }

    setInterval(function(){
        // process all toolbars and tweet locations
        for(var key in possible_locations){
            var location = possible_locations[key];
            $( location.context + ':not([data-ejew])').each(function(){
                var grand_dad = $( this );

                // find all the images and store their links in data
                var sources = [];
                var media_type = 'idk';
                if( grand_dad.find('.is-video').length ){
                    media_type = 'video';
                    sources.push( function( e ){
                        var anchor = grand_dad.find('.js-media-image-link');
                        var o_target = anchor.attr('target');
                        var o_src = anchor.attr('src');
                        anchor.attr('target', '');
                        anchor.attr('src', '#');
                        anchor.click();

                        var embeds = lock_find('.js-embeditem');

                        var vid_url = '';
                        embeds.each(function(){
                            var iframe_src = $( this ).find( 'iframe' ).attr('src');
                            if( iframe_src ){
                                vid_url = getQueryVariable( iframe_src, 'video_url' );
                            }
                            $('.mdl-dismiss .icon-close').click();
                        });

                        anchor.attr('target', o_target);
                        anchor.attr('src', o_src);

                        if( vid_url.length ){
                            return vid_url;
                        }
                    });
                } else if( grand_dad.find('.is-gif').length ){
                    media_type = 'gif';
                    sources.push( function(){
                        return grand_dad.find('video.js-media-gif').attr('src');
                    });
                } else {
                    var patterns = [
                        '.js-media-image-link',
                        'a.med-link img.media-img',
                        '.js-media .media-image'
                    ];
                    patterns.forEach(function( pattern ){
                        grand_dad.find( pattern ).each( function(i, el){
                            var src = $( el ).css('background-image');
                            if( is_empty( src ) ){
                                src =  $( el ).attr('src');
                            }
                            if( !is_empty( src ) ){
                                sources.push( src );
                            }
                        });
                    });
                    if( sources.length ){
                        media_type = 'image';
                    }
                }
                var orig_link = grand_dad.find("a.txt-small.no-wrap[rel=\"url\"]");
                orig_link.on('click', function(e){
                    if( e.ctrlKey ){
                        e.preventDefault();
                        clipboard_data( $( this ).attr("href") );
                    }
                });
                grand_dad.data('ejew-sources', sources );
                grand_dad.data('direct-url', orig_link.attr("href"));

                // enhance stock buttons with auto-follow
                grand_dad.find('.icon-retweet').on('click', function(e){
                    if( e.ctrlKey ){
                        follow_tweet( grand_dad );
                    }
                });
                grand_dad.find('.icon-favorite').on('click', function(e){
                    if( e.ctrlKey ){
                        follow_tweet( grand_dad );
                    }
                });

                // add more buttons
                add_to_toolbar( grand_dad, action_properties.download ).on('click', function(e){
                    var sauce = grand_dad.data('ejew-sources').slice();
                    console.log( sauce );
                    var sources = unpack_sources( sauce , this );
                    console.log( sources );

                    for( var i = 0; i < sources.length; i++ ){
                        download_now( sources[i] );
                    }

                    if( sources.length && !sources[0].endsWith("mp4") ){
                        toast("Downloaded <em>" + sources.length + "</em> Images!", sources.join("\n<br>"), "info");
                    }

                    if( e.ctrlKey ){
                        follow_tweet( grand_dad );
                    }
                });
                add_to_toolbar( grand_dad, action_properties.hotlink ).on('click', function(e){
                    var sauce = grand_dad.data('ejew-sources').slice();
                    console.log( sauce );
                    var sources = unpack_sources( sauce , this );
                    console.log( sources );

                    var the_url = grand_dad.data('direct-url');
                    if( e.ctrlKey && sources.length ){
                        sources[0] = the_url;
                    }

                    if( sources.length ){
                        clipboard_data( sources.join("\n") );
                    } else {
                        clipboard_data( the_url );
                    }
                });

                // prevent loading up this element again
                grand_dad.attr('data-ejew', 'in');
            });
        }

        // make it so that you can copy image source from previews
        $('img.media-img:not([data-ejew])').each(function(){
            $( this ).attr('src', nice_url( $( this ).attr('src'), "" ) );
            $( this ).attr('data-ejew', 'in');
        });

        // provide a download source link in zoomable previews for videos
        $('.js-embeditem:not([data-ejew])').each(function(){
            var iframe_src = $( this ).find( 'iframe' ).attr('src');
            if( iframe_src ){
                var vid_url = getQueryVariable( iframe_src, 'video_url' );
                var dl_link = $( '<a href="#">Download Source</a>' );
                dl_link.on('click', function(){
                    download_now( vid_url );
                });
                $(".med-origlink").after( dl_link );
            }
            $( this ).attr('data-ejew', 'in');
        });

        // unmask t.co links
        var links_to_unmask = $('a[href^="https://t.co/"][data-full-url]');
        links_to_unmask.each(function(){
            $( this ).attr('href', $( this ).data('full-url') );
        });
        if( links_to_unmask.length > 0 ){
            toast("Unmasked <em>" + links_to_unmask.length + "</em> Links!", "<em>That's a lot!</em>", "info");
        }
    }, 300);
})();