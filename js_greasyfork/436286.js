// ==UserScript==
// @name        MyAnimeList (MAL) Enhancements
// @namespace   https://greasyfork.org/en/users/684162
// @description A lot of useful enhancements on anime, manga, character, and people pages.
// @icon        http://i.imgur.com/b7Fw8oH.png
// @version     7.23
// @author      WitherOfMc
// @include     /^https?:\/\/myanimelist\.net\/(anime|manga|character|people)(\.php\?id=|\/)\d+/
// @exclude     /\/episode\/\d+\/edit[^\/]*?$/
// @run-at      document-start
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/436286/MyAnimeList%20%28MAL%29%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/436286/MyAnimeList%20%28MAL%29%20Enhancements.meta.js
// ==/UserScript==

/*jslint fudge, maxerr: 10, browser, devel, this, white, for, single */
/*global jQuery */

(function() {
    'use strict';

var mal = {
    type: document.URL.match(/^https?:\/\/myanimelist\.net\/(\w+)/)[1],
    details: document.URL.match(/^https?:\/\/myanimelist\.net\/\w+(\.php\?id=\d+|\/\d+\/?(?!.*\/.+))/)
};

mal.cache = {
    version: '7.15',

    encodeKey: function(key) {
        return 'mal_enhancements#' + mal.cache.version + '#' + key;
    },

    loadValue: function(key, value) {
        try {
            return JSON.parse(localStorage.getItem(mal.cache.encodeKey(key))) || value;
        } catch(e) {
            console.log(e.name + ': ' + e.message);
            return value;
        }
    },

    saveValue: function(key, value) {
        localStorage.setItem(mal.cache.encodeKey(key), JSON.stringify(value));
    }
};

var OPTS = {
    EXPAND_ADDTOLIST:       1,
    PRELOAD_PICTURES:       101,
    PRELOAD_VIDEOS:         102,
    PRELOAD_MOREINFO:       103,
    PRELOAD_RELATIONS:      104,
    HIDE_EPISODES:          202,
    HIDE_NEWS:              203,
    HIDE_FEATURED:          204,
    HIDE_TOPBAR:            205,
    HIDE_VIDEOS:            206,
    HIDE_ADDTOFAV:          207,
    HIDE_STORE:             208,
    HIDE_BUYBTN:            209,
    HIDE_STREAM:            210,
    FORMAT_GENRES:          301,
    FORMAT_AUTHORS:         302,
    FORMAT_RELATIONS:       303,
    FORMAT_DURATION:        304,
    FORMAT_EDITLINKS:       305,
    FORMAT_THUMBS:          307,
    FORMAT_VOICEACTORS_JAP: 308,
    FORMAT_VOICEACTORS_ENG: 3082,
    FORMAT_USERRECS:        310,
    FORMAT_USERRECS_THUMBS: 311,
    FORMAT_STATUS:          312,
    FOLD_BACKGROUND:        401,
    FOLD_REVIEWS:           404,
    FOLD_STATS:             406,
    FOLD_COMMENTS:          407,
    FOLD_RELATIONS:         408,
    MOVE_RELATIONS:         501
};

var OPTS_VISIBLE = [
    { id: OPTS.EXPAND_ADDTOLIST, section: 'Sidebar',
        text: 'Expand \'Add to List\' block', def: true },
    { id: OPTS.PRELOAD_MOREINFO, section: 'Details tab',
        text: 'Preload \'More Info\' section', def: true },
    { id: OPTS.PRELOAD_PICTURES, section: 'Navigation bar',
        text: 'Preload number of available pictures', def: false },
    { id: OPTS.PRELOAD_VIDEOS, section: 'Navigation bar',
        text: 'Preload number of available videos', def: false },
    { id: OPTS.FOLD_BACKGROUND, section: 'Details tab',
        text: 'Fold \'Background\' section', def: false },
    { id: OPTS.FOLD_REVIEWS, section: 'Details tab',
        text: 'Fold \'Reviews\' section', def: true },
    { id: OPTS.FOLD_STATS, section: 'Sidebar, Stats tab',
        text: 'Fold \'Statistics\' section', def: false },
    { id: OPTS.FOLD_COMMENTS, section: 'Details tab',
        text: 'Fold \'Comments\' section on people pages', def: false },
    { id: OPTS.HIDE_TOPBAR, section: 'Details tab',
        text: 'Remove top statistics section', def: true },
    { id: OPTS.HIDE_VIDEOS, section: 'Details tab',
        text: 'Remove \'Episode Videos\' section', def: true },
    { id: OPTS.HIDE_NEWS, section: 'Details tab',
        text: 'Remove \'Recent News\' section', def: true },
    { id: OPTS.HIDE_FEATURED, section: 'Details tab',
        text: 'Remove \'Featured Articles\' section', def: true },
    { id: OPTS.HIDE_STORE, section: 'Details tab',
        text: 'Remove \'Manga Store\' section', def: true },
    { id: OPTS.FORMAT_STATUS, section: 'Sidebar',
        text: 'Change default entry status to \'Plan to Watch/Read\'', def: false },
    { id: OPTS.HIDE_ADDTOFAV, section: 'Sidebar',
        text: 'Remove \'Add to Favorites\' button', def: false },
    { id: OPTS.HIDE_BUYBTN, section: 'Sidebar',
        text: 'Remove \'Buy on Manga Store\' button', def: true },
    { id: OPTS.HIDE_STREAM, section: 'Sidebar',
        text: 'Remove \'Watch online\' banner', def: true },
    { id: OPTS.FORMAT_GENRES, section: 'Sidebar',
        text: 'Sort genres in alphabetical order', def: true },
    { id: OPTS.FORMAT_AUTHORS, section: 'Sidebar',
        text: 'Format manga authors', def: true },
    { id: OPTS.FORMAT_DURATION, section: 'Sidebar',
        text: 'Format anime episodes duration', def: false },
    { id: OPTS.FORMAT_USERRECS, section: 'Details tab',
        text: 'Replace recommendations links with entries links', def: true },
    { id: OPTS.FORMAT_RELATIONS, section: 'Sidebar, Details tab',
        text: 'Format \'Related Entries\' section', def: true },
    { id: OPTS.FOLD_RELATIONS, section: 'Sidebar, Details tab',
        text: 'Fold \'Related Entries\' section', def: false },
    { id: OPTS.MOVE_RELATIONS, section: 'Sidebar, Details tab',
        text: 'Move \'Related Entries\' section to sidebar', def: false },
    { id: OPTS.PRELOAD_RELATIONS, section: 'Sidebar',
        text: 'Preload \'Related Entries\' section from \'Details\' tab', def: false },
    { id: OPTS.FORMAT_EDITLINKS, section: 'Sidebar',
        text: 'Add database modification links', def: false },
    { id: OPTS.FORMAT_VOICEACTORS_JAP, section: 'Details tab, Characters tab',
        text: 'Show only Japanese voice actors', def: false },
    { id: OPTS.FORMAT_VOICEACTORS_ENG, section: 'Details tab, Characters tab',
        text: 'Also show English voice actors', def: false },
    { id: OPTS.FORMAT_THUMBS, section: 'Details tab, Characters tab',
        text: 'Enlarge small thumbnails', def: false },
    { id: OPTS.FORMAT_USERRECS_THUMBS, section: 'Recommendations tab',
        text: 'Enlarge recommendations thumbnails', def: false }
];

function main($) {
    mal.id = document.URL.match(/\d+/)[0];

    $.fn.myfancybox = function(onstart) {
        return $(this).click(function() {
            mal.fancybox.show(onstart);
        });
    };

    mal.fancybox = {
        body: $('<div id="enh_fancybox_inner">'),
        outer: $('<div id="enh_fancybox_outer">'),
        wrapper: $('<div id="enh_fancybox_wrapper">'),

        init: function(el) {
            mal.fancybox.outer.hide().append(mal.fancybox.body).insertAfter(el);
            mal.fancybox.wrapper.hide().click(mal.fancybox.hide).insertAfter(el);
        },

        show: function(onstart) {
            mal.fancybox.body.children().hide();
            if (!onstart()) {
                mal.fancybox.hide();
                return;
            }
            mal.fancybox.wrapper.show();
            mal.fancybox.outer.show();
        },

        hide: function() {
            mal.fancybox.outer.hide();
            mal.fancybox.wrapper.hide();
        }
    };

    mal.settings = {
        body: $('<div id="enh_settings">'),
        opts: {},

        load: function() {
            mal.settings.reset();
            mal.settings.opts = mal.cache.loadValue('mal.settings.opts', mal.settings.opts);
        },

        save: function() {
            mal.cache.saveValue('mal.settings.opts', mal.settings.opts);
        },

        reset: function() {
            mal.settings.opts = {};
            OPTS_VISIBLE.forEach(function(opt) {
                if (opt.def) {
                    mal.settings.opts[opt.id] = true;
                }
            });
        },

        check: function(id) {
            return mal.settings.opts.hasOwnProperty(id);
        },

        update: function() {
            mal.settings.body.empty();

            var table = $('<table class="enh_table" border="0" cellpadding="0" cellspacing="0" width="100%">');

            OPTS_VISIBLE.forEach(function(opt) {
                var el = $('<div class="enh_checkbox">' +
                    '<input name="enh_cb_' + opt.id + '" id="enh_cb_' + opt.id + '" type="checkbox" />' +
                    '<label for="enh_cb_' + opt.id + '"><b><small>[' + opt.section + ']</small></b> ' + opt.text + '</label>' +
                '</div>');
                $('input', el).prop('checked', mal.settings.opts.hasOwnProperty(opt.id));

                $('<tr>')
                    .append($('<td>').append(el))
                    .appendTo(table);
            });

            var buttons = $('<div class="enh_buttons">')
                .append($('<input class="enh_button inputButton" value="Save" type="button">').click(function() {
                    mal.settings.opts = {};
                    $('input[type="checkbox"]', mal.settings.body).each(function() {
                        if ($(this).prop('checked')) {
                            var id = this.id.match(/\d+/);
                            if (id) {
                                mal.settings.opts[id[0]] = true;
                            }
                        }
                    });

                    mal.settings.save();
                    mal.fancybox.hide();
                    location.reload();
                }))
                .append($('<input class="enh_button inputButton" value="Cancel" type="button">').click(function() {
                    mal.fancybox.hide();
                }))
                .append($('<input class="enh_button inputButton" value="Reset" type="button">').click(function() {
                    mal.settings.reset();
                    mal.settings.save();
                    mal.fancybox.hide();
                    location.reload();
                }));

            mal.settings.body
                .append('<div class="enh_title">MAL Enhancements Settings</div>')
                .append($('<div class="enh_content">').append(table))
                .append(buttons);
        }
    };

    function getToggleSection(status) {
        return $('<a href="javascript:void(0);" class="mpe-toggle" onclick="' +
            'var c=$(this).closest(\'h2, div.normal_header\').next(),' +
                'h=(c.css(\'display\')===\'none\');' +
            '$(this).text(h ? \'hide\' : \'show\');' +
            'if (h) {' +
                'c.slideDown(\'fast\');' +
            '} else {' +
                'c.slideUp(\'fast\');' +
            '}">' + (status !== 'hide' ? 'hide' : 'show') + '</a>');
    }

    function formatAddToList() {
        var link = $('#content a[id^="showAddtolist"]');
        if (link.length === 0 || $('#malLogin').length > 0) {
            if (mal.settings.check(OPTS.HIDE_ADDTOFAV)) {
                $('.page-common #profileRows').css('padding', '0');
            }
            return;
        }

        if (mal.settings.check(OPTS.EXPAND_ADDTOLIST)) {
            link.parent().replaceWith('<h2 class="mt8">Edit Status</h2>');

            var el = $('.page-common .addtolist-block').show()
                .find('span#addtolistresult');

            link = $('<small>' + el.html() + '</small>');
            el.replaceWith(link);

            $('a', link).text('Edit Details');
            link.prev('input').addClass('btn-middle').val('Add');

            if (mal.settings.check(OPTS.HIDE_ADDTOFAV)) {
                $('.page-common #profileRows').css('padding', '0');
            }
        } else {
            if (mal.settings.check(OPTS.HIDE_ADDTOFAV)) {
                link.css('border-bottom', '1px solid #92b0f1');
            }
        }

        if (mal.settings.check(OPTS.FORMAT_STATUS)) {
            $('#myinfo_status :last').attr('selected', 'selected');
        }
    }

    function formatAddToFav() {
        if (!mal.settings.check(OPTS.HIDE_ADDTOFAV) || $('#malLogin').length > 0) {
            return;
        }

        $('.page-common #profileRows a.js-favorite-button').closest('div#v-favorite').remove();
        if (mal.type.match(/(character|people)/)) {
            $('.page-common #profileRows ~ br').first().remove();
        }
    }

    function formatBuyBtn() {
        if (!mal.settings.check(OPTS.HIDE_BUYBTN)) {
            return;
        }

        $('.page-common #profileRows ~ div a.left-info-block-manga-store-button').closest('div').remove();
    }

    function formatWatchOnline() {
        if (!mal.settings.check(OPTS.HIDE_STREAM)) {
            return;
        }

        $('.page-common #profileRows ~ a[class*="js-daisuki"]').remove();
    }

    function formatTopbar() {
        if (mal.settings.check(OPTS.HIDE_TOPBAR)) {
            $('.anime-detail-header-stats').parent().parent().remove();
            return;
        }
    }

    function formatFeatured() {
        var el = $('#horiznav_nav ~ table h2:contains(Featured Articles), ' +
                   '#horiznav_nav ~ h2:contains(Featured Articles)');
        if (el.length === 0) {
            return;
        }

        if (mal.settings.check(OPTS.HIDE_FEATURED)) {
            el.next().remove();
            var tag = el.next().prop('tagName');
            if (tag && tag.match(/br/i)) {
                el.next().remove();
            }
            el.remove();
        } else {
            $('.floatRightHeader > a:contains(More)', el).text('More');
        }
    }

    function formatStore() {
        var el = $('#horiznav_nav ~ table h2:contains(Manga Store), ' +
                   '#horiznav_nav ~ h2:contains(Manga Store)');
        if (el.length === 0) {
            return;
        }

        if (mal.settings.check(OPTS.HIDE_STORE)) {
            el.closest('tr').remove();
        } else {
            $('.floatRightHeader > a:contains(Preview)', el).text('Preview');
        }
    }

    function formatNews() {
        var el = $('#horiznav_nav ~ table h2:contains(Recent News), ' +
                             '#horiznav_nav ~ h2:contains(Recent News)');
        if (el.length > 0) {
            if (mal.settings.check(OPTS.HIDE_NEWS)) {
                el.nextUntil('h2, div.normal_header').remove();
                el.remove();
            } else {
                $('.floatRightHeader > a:contains(More)', el).text('More');
            }
        }
    }

    function formatComments() {
        if (mal.type !== 'people' || !mal.settings.check(OPTS.FOLD_COMMENTS)) {
            return;
        }

        var el = $('#horiznav_nav ~ div.normal_header:contains(Comments)');
        if (el.length === 0) {
            return;
        }

        $('<div>').hide()
            .append(el.nextAll().detach())
            .insertAfter(el);

        $('<small style="font-weight: normal;">')
            .append('(')
            .append(getToggleSection('hide'))
            .append(')')
            .appendTo(el.append(' '));
    }

    function formatBackground() {
        var el = $('#horiznav_nav ~ table h2:contains(Background)').parent();
        if (el.length === 0) {
            return;
        }

        el.html(el.html().replace(/>Background<\/h2>([\s\S]*?)(<h2|$)/, '>Background</h2><div id="mpe-background">$1</div>$2'));
        var header = $('h2:contains(Background)', el).first();
        el = header.next();

        $('div.border_top', el).remove();
        el.html(el.html().replace(/<br>$/, ''));

        if (el.text().match(/^No\s[\w\s]+?\sbeen\sadded\sto\sthis\stitle/)) {
            return;
        }

        if (!mal.settings.check(OPTS.FOLD_BACKGROUND)) {
            return;
        }

        el.hide();
        $('<small style="font-weight: normal;">')
            .append('(')
            .append(getToggleSection('hide'))
            .append(')')
            .appendTo(header.append(' '));
    }

    function formatPictures() {
        if (!mal.settings.check(OPTS.PRELOAD_PICTURES)) {
            return;
        }

        var pictures = $('#horiznav_nav li > a:contains(Pictures)');
        if (pictures.length === 0) {
            return;
        }

        $('#horiznav_nav li > a[href$="/clubs"]').parent()
            .detach().insertBefore(pictures.parent());

        if (document.URL.match(/\/\d+\/.*?\/pics(?!.*\/)/)) {
            pictures.append(' (' + $('#horiznav_nav ~ * div.picSurround').length + ')');
        } else {
            $.get(pictures.prop('href'), function(data) {
                pictures.append(' (' + $('#horiznav_nav ~ * div.picSurround', data).length + ')');
            });
        }
    }

    function formatVideos() {
        var el = $('#horiznav_nav li > a[href$="/video"]');
        if (el.length === 0) {
            return;
        }

        el.parent().detach().insertAfter(
            $('#horiznav_nav li > a:contains(Pictures)').parent()
        );

        if (mal.settings.check(OPTS.PRELOAD_VIDEOS)) {
            var videos = el;
            if (document.URL.match(/\/\d+\/.*?\/video(?!.*\/)/)) {
                videos.append(' (' +
                    $('#horiznav_nav ~ * .video-block .video-list-outer').length +
                    ($('#horiznav_nav ~ * .video-block .pagination').length > 0 ? '+' : '') +
                ')');
            } else {
                $.get(videos.prop('href'), function(data) {
                    videos.append(' (' +
                        $('#horiznav_nav ~ * .video-block .video-list-outer', data).length +
                        ($('#horiznav_nav ~ * .video-block .pagination', data).length > 0 ? '+' : '') +
                    ')');
                });
            }
        }

        el = $('#horiznav_nav ~ table h2:contains(Episode Videos)');
        if (el.length > 0) {
            $('.floatRightHeader > a[href$="/video"]', el).text('More');
            el.nextAll('.border_top').first().remove();
            if (mal.settings.check(OPTS.HIDE_VIDEOS)) {
                el.next().remove();
                el.remove();
            }
        }
    }

    function formatMoreInfo() {
        if (!mal.settings.check(OPTS.PRELOAD_MOREINFO)) {
            return;
        }

        var more = $('#horiznav_nav li > a[href$="/moreinfo"]');
        if (more.length === 0) {
            return;
        }

        var header = $('<h2 style="margin-top: 15px;">More Info <small style="font-weight: normal;">(loading...)</small></h2>');
        $('#horiznav_nav ~ table h2:contains(Synopsis)').parent().append(header);

        $.get(more.prop('href'), function(data) {
            var el = $('h2:contains(More Info)', data).parent();
            if (el.length === 0) {
                return;
            }

            var re = el.html().match(/More\sInfo<\/h2>([\s\S]+?)$/);
            if (!re) {
                return;
            }

            $('<span>').hide().html(re[1].trim().replace(/(<br>\s*?)*?$/g, '')).insertAfter(header);

            $('<small style="font-weight: normal;">')
                .append('(')
                .append(getToggleSection('hide'))
                .append(')')
                .appendTo(header.empty().append('More Info '));
        });
    }

    function formatRelationsData(data) {
        return data.match(/<a\s[^<]*?<\/a>/g).sort(function(a, b) {
                return $(a).text().toLowerCase().localeCompare($(b).text().toLowerCase());
            })
            .join('<br>')
            .replace(/><\/a>/g, '>(Empty Relation)</a>');
    }

    function formatRelations() {
        if (mal.settings.check(OPTS.MOVE_RELATIONS)) {
            return;
        }

        var el = $('#horiznav_nav ~ table h2:contains(Related )');
        if (el.length === 0) {
            return;
        }

        el.html(el.html().replace(/>Related\s(Anime|Manga)$/, '>Related Entries'));
        var related = el.next();

        if (mal.settings.check(OPTS.FORMAT_RELATIONS)) {
            $('td:first-child:contains(Adaptation)', related).parent().detach().prependTo(related);
            $('tr > td:last-child', related).each(function() {
                $(this).html(formatRelationsData($(this).html()));
            });
        }

        if (mal.settings.check(OPTS.FOLD_RELATIONS)) {
            related.hide();
            $('<small style="font-weight: normal;">')
                .append('(')
                .append(getToggleSection('hide'))
                .append(')')
                .appendTo(el.append(' '));
        }
    }

    function moveRelations() {
        if ((mal.details && !mal.settings.check(OPTS.MOVE_RELATIONS)) ||
            (!mal.details && !mal.settings.check(OPTS.PRELOAD_RELATIONS))) {
            return;
        }

        var processRelations = function(related) {
            if (related.length === 0) {
                return;
            }

            $('td:first-child:contains(Adaptation)', related).parent().detach().prependTo(related);

            var html = '';
            $('tr', related).each(function() {
               var data = $('td:last-child', this).html();
               if (mal.settings.check(OPTS.FORMAT_RELATIONS)) {
                   data = formatRelationsData(data);
               }
               html += '<span class="dark_text">' + $('td:first-child', this).text() + '</span><br>' + data + '<br><br>';
            });

            html = '<h2>Related Entries</h2><div>' + html.replace(/<br><br>$/, '') + '</div><br>';
            if (mal.settings.check(OPTS.FORMAT_EDITLINKS) && $('#malLogin').length === 0) {
                html = html.replace(/^<h2>/, '<h2><a href="/dbchanges.php?' + mal.type[0] + 'id=' + mal.id + '&t=relations" class="floatRightHeader">Edit</a>');
            }

            $('.page-common #profileRows').parent().append(html);

            if (mal.settings.check(OPTS.FOLD_RELATIONS)) {
                var el = $('.page-common #profileRows ~ h2:contains(Related Entries)');
                el.next().hide();
                $('<small style="font-weight: normal;">')
                    .append('(')
                    .append(getToggleSection('hide'))
                    .append(')')
                    .appendTo(el.append(' '));
            }
        };

        if (mal.details) {
            var related = $('table[class*="_detail_related_"]');
            if (related.length > 0) {
                related.prevAll('h2').last().remove();
                related.nextAll('br').first().remove();
                processRelations(related.detach());
            }
        } else if (mal.settings.check(OPTS.PRELOAD_RELATIONS)) {
            $.get('/' + mal.type + '/' + mal.id, function(data) {
                processRelations($('table[class*="_detail_related_"]', data));
            });
        }
    }

    function formatThumbs(flag, width, delta) {
        if (!mal.settings.check(flag)) {
            return;
        }

        var processImg = function(attr, el) {
            var src = $(el).attr(attr)
                .replace(/\/r\/\d+x\d+\//, '/')
                .replace(/\/(\d+)[a-z]?\.jpg(\?s=\S+$)?/, '/$1.jpg')
                .replace(/\/questionmark_23.gif$/, '/qm_50.gif');
            $(el).attr(attr, src).attr('width', '' + width).removeAttr('height')
                .css('image-rendering', 'auto');
            if (delta > 0) {
                $(el).closest('td').attr('width', '' + (parseInt(width) + delta));
            }
        };

        $('td > div.picSurround img').each(function() {
            if ($(this).parent().hasClass('js-picture-gallery')) {
                return;
            }
            var processed = false;
            if ($(this)[0].hasAttribute('data-src')) {
                processImg('data-src', this);
                processed = true;
            }
            if ($(this)[0].hasAttribute('data-srcset')) {
                processImg('data-srcset', this);
                processed = true;
            }
            if (!processed && $(this)[0].hasAttribute('src')) {
                processImg('src', this);
                processed = true;
            }
        });
    }

    function Category() {
        this.header = $();
        this.rows = $();
        this.prepare = function() {
            if (this.rows.length === 0) {
                return;
            }

            var rows = this.rows.hide();
            var link = $('<a href="javascript:void(0);">show</a>').click(function() {
                    if (rows.first().css('display') === 'none') {
                        $(this).text('hide');
                        rows.slideDown('fast');
                    } else {
                        $(this).text('show');
                        rows.slideUp('fast');
                    }
                });

            $('<small style="font-weight: normal;">')
                .append('(')
                .append(link)
                .append(')')
                .appendTo(this.header.append(' '));
        };
    }

    function formatCategories() {
        var el;
        var more = $('#horiznav_nav li > a[href$="/characters"]').prop('href');
        var chars = $('#horiznav_nav ~ table h2:contains(Characters)');
        if (chars.length > 0) {
            if ($('.floatRightHeader', chars).length === 0) {
                chars.prepend('<span class="floatRightHeader">');
            }

            $('.floatRightHeader', chars).empty()
                .append('<a href="/panel.php?go=characters&do=add">Add</a>')
                .append(' | ')
                .append('<a href="' + more + '">More</a>');
        }

        var staff = $('#horiznav_nav ~ table h2:contains(Staff)');
        if (staff.length > 0) {
            if ($('.floatRightHeader', staff).length === 0) {
                staff.prepend('<span class="floatRightHeader">');
            }

            $('.floatRightHeader', staff).empty()
                .append('<a href="/dbchanges.php?aid=' + mal.id + '&t=staff">Add</a>')
                .append(' | ')
                .append('<a href="' + more + '#staff">More</a>');

            staff.nextAll('table').first().nextAll('br').first().remove();
        }

        more = $('#horiznav_nav li > a[href$="/reviews"]').prop('href');
        var revs = new Category();
        revs.header = $('#horiznav_nav ~ table h2:contains(Reviews)');
        revs.rows = revs.header.nextUntil('br').filter('div.borderDark');
        if (revs.header.length > 0) {
            if ($('.floatRightHeader', revs.header).length === 0) {
                revs.header.prepend('<span class="floatRightHeader">');
            }

            $('.floatRightHeader', revs.header).empty()
                .append('<a href="/myreviews.php?' + (mal.type === 'anime' ? 'series' : 'm') + 'id=' + mal.id + '&go=write">Add</a>')
                .append(' | ')
                .append('<a href="' + more + '">More</a>');
        }
        if (mal.settings.check(OPTS.FOLD_REVIEWS)) {
            revs.prepare();
        }

        if (revs.rows.length === 0) {
            el = revs.header.next();
            el.replaceWith(el.html() + '<br>');
        }

        more = $('#horiznav_nav li > a[href$="/userrecs"]').prop('href');
        el = $('#horiznav_nav ~ table h2:contains(Recommendations)');
        if (el.length > 0) {
            if ($('.floatRightHeader', el).length === 0) {
                el.prepend('<span class="floatRightHeader">');
            }

            $('.floatRightHeader', el).empty()
                .append('<a href="/myrecommendations.php?go=make&' + mal.type[0] + 'id=' + mal.id + '">Add</a>')
                .append(' | ')
                .append('<a href="' + more + '">More</a>');

            $('a.btn-detail-recommendations-view-all', el.next()).remove();
            var recs = $('.anime-slide-block', el.next());
            if (recs.length > 0) {
                recs.attr('data-json', recs.attr('data-json').replace(/"width":\d+/, '"width":800'));
            }

            if (mal.settings.check(OPTS.FORMAT_USERRECS)) {
                recs = el.next().find('.btn-anime > a');
                if (recs.length === 0) {
                    el = el.next().find('p');
                    el.parent().replaceWith(el.html() + '<br>');
                } else {
                    recs.each(function() {
                        var href = $(this).prop('href');
                        var re = href.match(/(\d+)-(\d+)$/);
                        if (!re) {
                            $(this).prop('href', href.replace(/\?suggestion$/i, ''));
                            return;
                        }
                        var id = re[1] === mal.id ? re[2] : re[1];
                        var title = $('.title', this).text()
                            .replace(/[)(]/g, '')
                            .replace(/[^\w\d\-]/g, ' ')
                            .replace(/\s/g, '_')
                            .replace(/^_+/, '')
                            .replace(/_+$/, '');
                        $(this).prop('href', '/' + mal.type + '/' + id + '/' + title);
                    });
                }
            }
        }
    }

    function formatInfo(category, stopstr, joinstr, newline, replace) {
        var el = $('#content span.dark_text:contains(' + category + ':)').parent();
        if (el.length === 0) {
            return;
        }

        var re = '<a [^<]*?<\\/a>[^<]*?';
        var links = el.html().match(new RegExp(re + stopstr, 'g'));
        if (!links || links.length < 2) {
            return;
        }

        if (replace) {
            links = $.map(links, function(n) {
                return n.replace(new RegExp('(' + re + ')' + stopstr), '$1');
            });
        }

        var html = el.html().match(/<span\s[\s\S]*?<\/span>/)[0] +
            (newline ? '<div style="margin-left: 0.8em;">' : ' ') +
            links.sort(function(a, b) {
                return $(a).text().toLowerCase().localeCompare($(b).text().toLowerCase());
            }).join(joinstr) +
            (newline ? '</div>' : '');

        el.html(html);
    }

    function formatDiscussions() {
        var el = $('#horiznav_nav ~ table h2:contains(Forum Discussion)');
        if (el.length === 0) {
            return;
        }

        $('.floatRightHeader', el).empty()
            .append('<a href="/forum/?action=post&' + mal.type + '_id=' + mal.id + '">Add</a>')
            .append(' | ')
            .append('<a href="/forum/?' + mal.type + 'id=' + mal.id + '">More</a>');
    }

    function formatDuration() {
        if (!mal.settings.check(OPTS.FORMAT_DURATION) || mal.type !== 'anime' || $('#malLogin').length > 0) {
            return;
        }

        var el = $('span.dark_text:contains(Duration:)').parent();
        if (el.length === 0) {
            return;
        }

        $.get('/dbchanges.php?t=duration&aid=' + mal.id, function(data) {
            var duration = data.match(/<strong>Current\sDuration<\/strong><br[^>]*>\s*(\d\d:\d\d:\d\d)\sper\sepisode\s*<br/)[1].replace(/^00:/, '');

            el.html(el.html().replace(/span>[\s\S]*$/, 'span> ' +
                (duration !== '00:00' ? (duration + ' per ep.') : 'Unknown')));
        });
    }

    function formatEditLink(selector, href) {
        var el = $(selector);
        if (el.length > 0) {
            var parent = el.parent();
            if (parent.html().match(/span>\s+?None\sfound,/)) {
                parent.html(parent.html()
                    .replace(/span>\s+?None\sfound,[\s\S]+?$/, 'span> Unknown'));
                el = $('span', parent).first();
            }
            var text = el.text().replace(/:$/, '');
            el.empty()
                .append('<a href="' + href + '">' + text + '</a>')
                .append(':');
        }
    }

    function formatEditLinks() {
        if (!mal.settings.check(OPTS.FORMAT_EDITLINKS) || $('#malLogin').length > 0) {
            return;
        }

        var el = $('#addtolist ~ h2:contains(Alternative Titles)');
        if (el.length > 0) {
            el.prepend('<a href="/dbchanges.php?' + mal.type[0] + 'id=' + mal.id + '&t=alternative_titles" class="floatRightHeader">Edit</a>');
        }

        if (mal.type === 'anime') {
            formatEditLink('span.dark_text:contains(Aired:)', '/dbchanges.php?aid=' + mal.id + '&t=airingdates');
            formatEditLink('span.dark_text:contains(Broadcast:)', '/dbchanges.php?aid=' + mal.id + '&t=broadcast');
            formatEditLink('span.dark_text:contains(Producers:)', '/dbchanges.php?aid=' + mal.id + '&t=producers');
            formatEditLink('span.dark_text:contains(Licensors:)', '/dbchanges.php?aid=' + mal.id + '&t=producers');
            formatEditLink('span.dark_text:contains(Studios:)', '/dbchanges.php?aid=' + mal.id + '&t=producers');
            formatEditLink('span.dark_text:contains(Source:)', '/dbchanges.php?aid=' + mal.id + '&t=source');
            formatEditLink('span.dark_text:contains(Duration:)', '/dbchanges.php?aid=' + mal.id + '&t=duration');
            formatEditLink('span.dark_text:contains(Rating:)', '/dbchanges.php?aid=' + mal.id + '&t=rating');
        } else {
            formatEditLink('span.dark_text:contains(Type:)', '/dbchanges.php?mid=' + mal.id + '&t=type');
            formatEditLink('span.dark_text:contains(Volumes:)', '/dbchanges.php?mid=' + mal.id + '&t=chapvol');
            formatEditLink('span.dark_text:contains(Chapters:)', '/dbchanges.php?mid=' + mal.id + '&t=chapvol');
            formatEditLink('span.dark_text:contains(Published:)', '/dbchanges.php?mid=' + mal.id + '&t=pubdates');
        }
    }

    function formatStats() {
        var el = $('.page-common #profileRows ~ h2:contains(Statistics)');
        if (el.length === 0) {
            return;
        }

        if (el.nextAll('br').length === 0) {
            el.parent().append('<br>');
        }

        if (!mal.settings.check(OPTS.FOLD_STATS)) {
            return;
        }

        $('<div>')
            .append(el.nextUntil('br').detach())
            .hide()
            .insertAfter(el);

        $('<small style="font-weight: normal;">')
            .append(' (')
            .append(getToggleSection('hide'))
            .append(')')
            .appendTo(el);

        if (document.URL.match(/\/(anime|manga)\/\d+\/.*?\/stats(?!.*\/)/)) {
            $('.page-common #horiznav_nav ~ div.border_top').remove();

            el = $('.page-common #horiznav_nav ~ h2:contains(Summary Stats)');
            if (el.length > 0) {
                $('<div>')
                    .append(el.nextUntil('br').detach())
                    .hide()
                    .insertAfter(el);

                $('<small style="font-weight: normal;">')
                    .append(' (')
                    .append(getToggleSection('hide'))
                    .append(')')
                    .appendTo(el);
            }

            el = $('.page-common #horiznav_nav ~ h2:contains(Score Stats)');
            if (el.length > 0) {
                el.next().hide();

                $('<small style="font-weight: normal;">')
                    .append(' (')
                    .append(getToggleSection('hide'))
                    .append(')')
                    .appendTo(el);
            }
        }
    }

    function pageAnimeMangaOther() {
        $('#content ~ div.mauto').remove();
        $('.js-statistics-info ~ div.mauto').remove();
        $('#horiznav_nav li > a[href$="/watch"], #horiznav_nav li > a[href$="/featured"]').parent().remove();
        $('.js-sns-icon-container + br, .js-sns-icon-container').remove();
        $('.js-scrollfix-bottom').removeClass('js-scrollfix-bottom');
        $('.js-scrollfix-bottom-rel').removeClass('js-scrollfix-bottom-rel');

        $('div[id^="pc_anime_detail"]').closest('div.border_bottom').remove();
        $('div[id^="pc_anime_detail"]').closest('div.border_top').remove();
        $('div.borderDark + div:has(div[id^="pc_anime_detail"])').remove();
        $('div.clearfix + div.borderClass + div:has(div[id^="pc_anime_detail"])').remove();

        $('div[id^="pc_manga_detail"]').closest('div.border_bottom').remove();
        $('div[id^="pc_manga_detail"]').closest('div.border_top').remove();
        $('div.borderDark + div:has(div[id^="pc_manga_detail"])').remove();
        $('div.clearfix + div.borderClass + div:has(div[id^="pc_manga_detail"])').remove();

        formatAddToList();
        formatAddToFav();
        formatBuyBtn();
        formatWatchOnline();
        formatPictures();
        formatVideos();

        $('#content #profileRows ~ div > span.dark_text').each(function () {
            var el = $(this).parent();
            el.html(el.html().trim());
        });

        if (mal.settings.check(OPTS.FORMAT_GENRES)) {
            formatInfo('Genres', ',?', ', ', false, true);
        }
        if (mal.settings.check(OPTS.FORMAT_AUTHORS)) {
            formatInfo('Authors', '\\)', '<br>', true, false);
        }

        formatDuration();
        formatEditLinks();
        formatStats();
        moveRelations();

        if (document.URL.match(/\/userrecs[^\/]*?$/)) {
            formatThumbs(OPTS.FORMAT_USERRECS_THUMBS, 80, 10);
        }
    }

    function pageAnimeMangaDetails() {
        $('h2 ~ div[style="padding:16px 0px 0px 0px;"]').remove();
        $('h2 ~ br + div[style^="padding: 20px "][style$="display: inline-block;"]').prev().remove();
        if (mal.type === 'anime') {
            $('h2 ~ div[style^="padding: 20px "][style$="display: inline-block;"] + br').remove();
        }
        $('h2 ~ div[style^="padding: 20px "][style$="display: inline-block;"]').remove();
        $('.theme-songs > div.pt12').removeClass('pt12');
        $('.amazon-ads').remove();
        $('#content table div.mauto.clearfix[style*="width"]').remove();
        $('.detail-characters-list + br + br').remove();

        var el = $('div[class^="above-reviews-section"]').closest('div[class="di-t"]');
        if (el.length > 0) {
            el.next('br').remove();
            el.next('br').remove();
            el.remove();
        }

        el = $('div[class^="kiosked-hook-pc"]').closest('div[class="di-t"]');
        if (el.length > 0) {
            el.next('br').remove();
            el.next('br').remove();
            el.remove();
        }

        formatBackground();
        formatTopbar();
        formatNews();
        formatStore();
        formatFeatured();
        formatMoreInfo();
        formatRelations();
        formatCategories();
        formatDiscussions();
        formatThumbs(OPTS.FORMAT_THUMBS, 50, 0);
    }

    function pageAnimeMangaCharacters() {
        formatThumbs(OPTS.FORMAT_THUMBS, 50, 0);

        if (mal.type === 'anime' && mal.settings.check(OPTS.FORMAT_VOICEACTORS_JAP)) {
            var el = $('#horiznav_nav ~ h2:contains(Characters) ~ table:has(.borderClass > a[href*="/character/"]) td[align="right"] > table tr:has(small)').not(':not(a):contains("Japanese")');
            if (mal.settings.check(OPTS.FORMAT_VOICEACTORS_ENG)) {
                el = el.not(':not(a):contains("English")');
            }
            el.remove();
        }
    }

    function pagePeopleCharsOther() {
        $('#horiznav_nav li > a[href$="/featured"]').parent().remove();

        formatAddToFav();
        formatPictures();
        formatThumbs(OPTS.FORMAT_THUMBS, 50, 0);
    }

    function pagePeopleCharsDetails() {
        formatNews();
        formatFeatured();
        formatComments();

        if (mal.type === 'character' && mal.settings.check(OPTS.FORMAT_VOICEACTORS_JAP)) {
            var el = $('#horiznav_nav ~ div.normal_header:contains(Voice Actors) ~ table:has(.borderClass > a[href*="/people/"]):has(small)').not(':not(a):contains("Japanese")');
            if (mal.settings.check(OPTS.FORMAT_VOICEACTORS_ENG)) {
                el = el.not(':not(a):contains("English")');
            }
            el.remove();
        } else {
            $('.floatRightHeader > a:contains(Add)').text('Add');
        }
    }

    mal.settings.load();
    mal.fancybox.init('#contentWrapper');
    mal.fancybox.body.append(mal.settings.body);

    if (mal.type.match(/(people|character)/)) {
        pagePeopleCharsOther();
        if (mal.details) {
            pagePeopleCharsDetails();
        }
    } else {
        pageAnimeMangaOther();
        if (mal.details) {
            pageAnimeMangaDetails();
        } else if (document.URL.match(/\/(anime|manga)\/\d+\/.*?\/characters(?!.*\/)/)) {
            pageAnimeMangaCharacters();
        }
    }

    var breadcrumb = $('.page-common .breadcrumb');
    if (breadcrumb.length === 0) {
        return;
    }

    $('<div style="float: right">')
        .append($('<small>')
            .append($('<a href="javascript:void(0);">Enhancements Script Settings</a>').myfancybox(function() {
                mal.settings.update();
                mal.settings.body.show();
                return true;
            }))
        )
        .appendTo(breadcrumb);

    $('<style type="text/css">').html(
        'div#enh_fancybox_wrapper { position: fixed; width: 100%; height: 100%; top: 0; left: 0; background: rgba(102, 102, 102, 0.3); z-index: 99990; }' +
        'div#enh_fancybox_inner { width: 550px !important; height: 770px !important; overflow: hidden; color: #000; }' +
        'div#enh_fancybox_outer { position: absolute; display: block; width: auto; height: auto; padding: 10px; border-radius: 8px; top: 80px; left: 50%; margin-top: 0 !important; margin-left: -250px !important; background: #fff; box-shadow: 0 0 15px rgba(32, 32, 32, 0.4); z-index: 99991; }' +
        'div#enh_settings { text-align: center; padding: 5px; }' +
        'div#enh_settings .enh_title { font-size: 12px; font-weight: bold; text-align: center !important; padding: 0 !important; }' +
        'div#enh_settings .enh_title:after { content: ""; display: block; position: relative; width: 100%; height: 8px; margin: 0.5em 0 0;	padding: 0;	border-top: 1px solid #ebebeb; background: center bottom no-repeat radial-gradient(#f6f6f6, #fff 70%); background-size: 100% 16px; }' +
        'div#enh_settings .enh_content { height: 690px; overflow-y: auto; }' +
        'div#enh_settings .enh_table { border: none; margin: 10px 0; }' +
        'div#enh_settings .enh_table tbody { background-color: #fff; }' +
        'div#enh_settings .enh_table td { text-align: left !important; }' +
        'div#enh_settings .enh_table .enh_checkbox > * { vertical-align: middle; }' +
        'div#enh_settings .enh_buttons { position: absolute; bottom: 10px; width: 540px; height: 30px; text-align: center; padding: 0; }' +
        'div#enh_settings .enh_buttons > .enh_button { margin: 2px 5px !important; font-size: 12px; }'
    ).appendTo('head');
}

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '.page-common #contentWrapper { display: none !important; }';

var head = document.getElementsByTagName('head');
if (head.length > 0) {
    head[0].appendChild(style);
}

var callback = function() {
    try {
        main(jQuery);
    } catch(e) {
        console.log(e.name + ': ' + e.message);
    } finally {
        style.remove();
    }
};

if (document.readyState !== 'loading') {
    callback();
} else {
    document.addEventListener('DOMContentLoaded', callback);
}

}());