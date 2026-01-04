// ==UserScript==
// @name        AO3 Hx
// @description Hide seen works.
// @namespace   https://greasyfork.org/scripts/ao3hx
// @version     2.10
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @include     http://*archiveofourown.org/*
// @include     https://*archiveofourown.org/*
// @downloadURL https://update.greasyfork.org/scripts/492306/AO3%20Hx.user.js
// @updateURL https://update.greasyfork.org/scripts/492306/AO3%20Hx.meta.js
// ==/UserScript==
 
 
(function ($) {
 
    var DEBUG = false;
 
    // newest version, for the update notice
    var current_version = '2.09';
 
    var kudos_history = {}, seen_buttons = {}, saved_settings = {};
    var main = $('#main');
 
    // check if reversi
    var body_bg_color = window.getComputedStyle(document.body).backgroundColor;
    if (body_bg_color == 'rgb(51, 51, 51)') {
        main.addClass('kh-reversi');
    }
 
 
    var KHList = {
        init: function init(name, max_length) {
            this.name = name;
            this.max_length = max_length || 200000;
            this.list = localStorage.getItem('kudoshistory_' + this.name) || ',';
            return this;
        },
 
        reload: function reload() {
            this.list = localStorage.getItem('kudoshistory_' + this.name) || this.list;
            return this;
        },
        save: function save() {
            try {
                localStorage.setItem('kudoshistory_' + this.name, this.list.slice(0, this.max_length));
            }
            catch (e) {
                localStorage.setItem('kudoshistory_' + this.name, this.list.slice(0, this.list.length * 0.9));
            }
            return this;
        },
        hasId: function hasId(work_id) {
 
            if (this.list.indexOf(',' + work_id + ',') > -1) {
                this.list = ',' + work_id + this.list.replace(',' + work_id + ',', ',');
                return true;
            }
            else {
                return false;
            }
        },
        add: function add(work_id) {
            this.list = ',' + work_id + this.list.replace(',' + work_id + ',', ',');
            return this;
        },
        remove: function remove(work_id) {
            this.list = this.list.replace(',' + work_id + ',', ',');
            return this;
        },
    };
 
    var KHSetting = {
        init: function init(setting) {
            this.name = setting.name;
            this.label = setting.label;
            this.description = setting.description;
            this.options = setting.options;
            this.current = saved_settings[this.name] || setting.default_value;
            return this;
        },
 
        next: function next() {
            this.current = this.options[this.options.indexOf(this.current) + 1] || this.options[0];
            this.updateButton();
            this.save();
            addMainClass(true);
        },
        getButton: function getButton() {
            this.button_link = $('<a></a>').text(this.label + ': ' + this.current.toUpperCase()).prop('title', this.options.join(' / ').toUpperCase());
            this.button = $('<li class="kh-menu-setting"></li>').append(this.button_link);
            var this_setting = this;
            this.button.click(function () {
                this_setting.next();
            });
            return this.button;
        },
        updateButton: function updateButton() {
            this.button_link.text(this.label + ': ' + this.current.toUpperCase());
        },
        changeValue: function changeValue(value) {
            this.current = value;
            this.updateButton();
            this.updateSettingRow();
            this.save();
            addMainClass(true);
        },
        getSettingRow: function getSettingRow() {
            var setting_row_info = $('<p class="kh-setting-info kh-hide-element">' + this.description + '</p>');
            var setting_row_info_button = $('<a class="help symbol question kh-setting-info-button"><span class="symbol question"><span>?</span></span></a>');
            var setting_row_label = $('<span class="kh-setting-label">' + this.label + ': </span>').append(setting_row_info_button);
            this.setting_row_options = $('<span class="kh-setting-options"></span>');
            this.setting_row = $('<p class="kh-setting-row"></p>').append(setting_row_label, this.setting_row_options, setting_row_info);
            this.updateSettingRow();
            setting_row_info_button.click(function () {
                setting_row_info.toggleClass('kh-hide-element');
            });
            return this.setting_row;
        },
        updateSettingRow: function updateSettingRow() {
            var this_setting = this;
            this_setting.setting_row_options.empty();
            this.options.forEach(function (option) {
                var option_link = $('<a class="kh-setting-option"></a>');
                option_link.click(function () {
                    this_setting.changeValue(option);
                });
 
                if (this_setting.current == option) {
                    option_link.html('<strong>' + option.toUpperCase() + '</strong>').addClass('kh-setting-option-selected');
                }
                else {
                    option_link.text(option.toUpperCase());
                }
 
                this_setting.setting_row_options.append(' ', option_link, ' <span class="kh-setting-separator">&bull;</span>');
            });
        },
        save: function save() {
            saved_settings[this.name] = this.current;
            localStorage.setItem('kudoshistory_settings', JSON.stringify(saved_settings));
        },
        check: function check(compare) {
            return (this.current === (compare || 'yes'));
        },
    };
 
    var settings_list = [
        {
            name: 'seen_display',
            label: 'Seen Works',
            description: 'Hide the works on lists, show the whole blurb, or show just the blurb header.',
            options: ['hide', 'show', 'collapse'],
            default_value: 'collapse',
        },
        {
            name: 'highlight_bookmarked',
            label: 'Highlight Bookmarks',
            description: 'Show a striped stripe (yeah) on the right for works you\'ve bookmarked.',
            options: ['yes', 'no'],
            default_value: 'yes',
        },

    ];
 
    if (typeof (Storage) !== 'undefined') {
 
        saved_settings = JSON.parse(localStorage.getItem('kudoshistory_settings')) || {};
 
        kudos_history = {
            kudosed: Object.create(KHList).init('kudosed'),
            checked: Object.create(KHList).init('checked'),
            seen: Object.create(KHList).init('seen', 2000000),
            bookmarked: Object.create(KHList).init('bookmarked'),
 
            username: localStorage.getItem('kudoshistory_username'),
 
            saveLists: function () {
                DEBUG && console.log('saving lists');
                this.kudosed.save();
                this.checked.save();
                this.seen.save();
                this.bookmarked.save();
            },
        };
 
        settings_list.forEach(function (setting) {
            kudos_history[setting.name] = Object.create(KHSetting).init(setting);
        });
 
        var userlink = $('#greeting li.dropdown > a[href^="/users/"]');
 
        if (!kudos_history.username) { localStorage.setItem('kudoshistory_lastver', current_version); }
 
        // if logged in
        if (userlink.length) {
            var found_username = userlink.attr('href').split('/')[2];
            DEBUG && console.log('found username: ' + found_username);
 
            if (kudos_history.username !== found_username) {
                kudos_history.username = found_username;
                localStorage.setItem('kudoshistory_username', kudos_history.username);
            }
        }
        // if not logged in, but remembers username
        else if (!!kudos_history.username) {
            DEBUG && console.log("didn't find username on page, saved username: " + kudos_history.username);
        }
        else {
            kudos_history.username = prompt('AO3: Kudosed and seen history\n\nYour AO3 username:');
            localStorage.setItem('kudoshistory_username', kudos_history.username);
        }
 
        $(document).ajaxStop(function () {
            kudos_history.saveLists();
        });
 
        // add css rules for kudosed works
        addCss();
 
        var works_and_bookmarks = $('li.work.blurb, li.bookmark.blurb');
 
        // if there's a list of works or bookmarks
        if (works_and_bookmarks.length) {
            addSeenMenu();
 
            var blurb_index = $('.index');
 
            // click on header to collapse/expand
            blurb_index.on('click', '.header', function (e) {
                if (!$(e.target).is('a') && !$(e.target).is('span')) {
                    $(this).closest('.blurb').toggleClass('collapsed-blurb');
                    e.stopPropagation();
                }
            });
 
 
            // click on delete bookmark
            blurb_index.on('click', '.own.user a[data-method="delete"]', function () {
                var work_id = $(this).closest('.blurb').data('work_id');
 
                if (work_id) {
                    kudos_history.bookmarked.reload().remove(work_id).save();
                }
            });
 
            // for each work and bookmark blurb
            works_and_bookmarks.not('.deleted').each(function () {
                blurbCheck($(this));
            });
        }
 
        // if it's the first time after an update
        addNotice();
 
        // if it's a work page
        if ($('#workskin').length) {
 
            var work_meta = $('dl.work.meta.group');
 
            // get work id
            var work_id = $('#kudo_commentable_id').val();
            DEBUG && console.log('work_id ' + work_id);
 
            if (kudos_history.autoseen.check()) {
                kudos_history.seen.add(work_id);
            }
 
            // check if work id is on the seen list
            var is_seen = kudos_history.seen.hasId(work_id);
 
            if (is_seen) {
                work_meta.addClass('marked-seen');
            }
 
            addSeenButtons();
 
            // if work id is on the kudosed list
            if (kudos_history.kudosed.hasId(work_id)) {
                work_meta.addClass('has-kudos');
                DEBUG && console.log('- on kudosed list');
            }
            else {
                // check if there are kudos from the user
                var user_kudos = $('#kudos').find('[href="/users/' + kudos_history.username + '"]');
 
                if (user_kudos.length) {
                    // highlight blurb and add work id to kudosed list
                    kudos_history.kudosed.add(work_id);
                    kudos_history.checked.remove(work_id);
                    work_meta.addClass('has-kudos');
                }
                else {
                    // add work id to checked list
                    kudos_history.checked.add(work_id);
 
                    $('#new_kudo').one('click', function () {
                        kudos_history.kudosed.reload().add(work_id).save();
                        kudos_history.checked.reload().remove(work_id).save();
                        work_meta.addClass('has-kudos');
                    });
                }
            }
 
            // check if it's bookmarked
            var bookmark_button_text = $('a.bookmark_form_placement_open').filter(':first').text();
 
            if (bookmark_button_text.indexOf('Edit') > -1) {
                // highlight blurb
                kudos_history.bookmarked.add(work_id);
                work_meta.addClass('is-bookmarked');
            }
            else {
                kudos_history.bookmarked.remove(work_id);
            }
        }
 
        // save all lists
        kudos_history.saveLists();
    }
 
    // check if work is on lists
    function blurbCheck(blurb) {
 
        var work_id;
        var blurb_id = blurb.attr('id');
 
        if (blurb.hasClass('work')) {
            work_id = blurb_id.replace('work_', '');
        }
        else if (blurb.hasClass('bookmark')) {
            var work_link = blurb.find('h4 a:first').attr('href');
 
            // if it's not a deleted work and not a series or external bookmark
            if (!!work_link && work_link.indexOf('series') === -1 && work_link.indexOf('external_work') === -1) {
                work_id = work_link.split('/').pop();
 
                // if it's your own bookmark
                var own_bookmark = blurb.find('div.own.user.module.group');
                if (own_bookmark.length) {
                    kudos_history.bookmarked.add(work_id);
                }
            }
        }
 
        blurb.data('work_id', work_id);
 
        DEBUG && console.log('blurb check ' + blurb_id + ', work_id: ' + work_id);
 
        if (!work_id) {
            return false;
        }
 
        var found_on_list = false;
        var blurb_classes = 'blurb-with-toggles';
        blurb.prepend('<div class="kh-toggles">mark/unmark as: <a class="kh-toggle" data-list="seen">seen</a> &bull; <a class="kh-toggle" data-list="skipped">skipped</a>');
 
        // if work id is on the kudosed list
        if (kudos_history.kudosed.hasId(work_id)) {
            DEBUG && console.log('- is kudosed');
            blurb_classes += ' has-kudos collapsed-blurb';
            found_on_list = true;
        }
 
        // if work id is on the seen list
        if (kudos_history.seen.hasId(work_id)) {
            DEBUG && console.log('- is seen');
            blurb_classes += ' marked-seen collapsed-blurb';
            found_on_list = true;
        }
 
        // not on the kudosed/seen list
        if (!found_on_list) {
 
            // if work id is on the checked list
            if (kudos_history.checked.hasId(work_id)) {
                DEBUG && console.log('- is checked');
            }
            else {
                blurb_classes += ' new-blurb';
                loadKudos(blurb);
            }
        }
 
        // if work id is on the bookmarked list
        if (kudos_history.bookmarked.hasId(work_id)) {
            DEBUG && console.log('- is bookmarked');
            blurb_classes += ' is-bookmarked';
        }
 
 
        blurb.addClass(blurb_classes);
    }
 
    // load kudos for blurb
    function loadKudos(blurb) {
 
        var work_id = blurb.data('work_id');
 
        if (!work_id) {
            return false;
        }
 
        DEBUG && console.log('- loading kudos for ' + work_id);
 
        // add a div to the blurb that will house the kudos
        var kudos_container = $('<div style="display: none;"></div>');
        blurb.append(kudos_container);
 
        // retrieve a list of kudos from the work
        var work_url = window.location.protocol + '//' + window.location.hostname + '/works/' + work_id + '/kudos #kudos';
        kudos_container.load(work_url, function () {
            // check if there are kudos from the user
            var user_kudos = kudos_container.find('[href="/users/' + kudos_history.username + '"]');
 
            if (user_kudos.length) {
                // highlight blurb and add work id to kudosed list
                blurb.addClass('has-kudos collapsed-blurb');
                kudos_history.kudosed.add(work_id);
            }
            else {
                // add work id to checked list
                kudos_history.checked.add(work_id);
            }
        });
    }
 
    // mark all works on the page as seen
    function markPageSeen() {
 
        kudos_history.seen.reload();
 
        // for each blurb
        works_and_bookmarks.not('.marked-seen').not('.has-kudos').not('.deleted').each(function () {
            changeBlurbStatus($(this), 'seen', false, true);
        });
 
        kudos_history.seen.save();
    }
 
    // mark all works on the page as unseen
    function markPageUnseen() {
 
        kudos_history.seen.reload();
 
        // for each blurb
        works_and_bookmarks.not('.deleted').each(function () {
            changeBlurbStatus($(this), 'seen', false, false);
        });
 
        kudos_history.seen.save();
    }
 
    // mark/unmark blurb as X
    function changeBlurbStatus(blurb, list, save_list, add_to_list) {
 
        var work_id = blurb.data('work_id');
 
        if (work_id) {
 
            save_list && kudos_history[list].reload();
 
            var blurb_class = {
                seen: 'marked-seen',
            };
 
            if (add_to_list == undefined) {
                add_to_list = !kudos_history[list].hasId(work_id);
            }
 
            if (add_to_list) {
                DEBUG && console.log('marking as ' + list + ' ' + work_id);
                kudos_history[list].add(work_id);
                blurb.addClass(blurb_class[list] + ' collapsed-blurb');
            }
            else {
                DEBUG && console.log('unmarking as ' + list + ' ' + work_id);
                kudos_history[list].remove(work_id);
                blurb.removeClass(blurb_class[list]);
            }
 
            save_list && kudos_history[list].save();
        }
    }
 
 
 
    // add the seen/unseen buttons
    function addSeenButtons() {
 
        seen_buttons = {
            is_seen: is_seen,
            buttons_links: [],
 
            change: function () {
                DEBUG && console.log(this);
                this.is_seen = !this.is_seen;
                kudos_history.seen.reload();
 
                if (this.is_seen) {
                    kudos_history.seen.add(work_id);
                    work_meta.addClass('marked-seen');
                }
                else {
                    kudos_history.seen.remove(work_id);
                    work_meta.removeClass('marked-seen');
                }
 
                kudos_history.seen.save();
                this.updateButtons();
                DEBUG && console.log(this);
            },
            getButton: function () {
                var button_link = $('<a></a>').html(this.is_seen ? 'Unseen &cross;' : 'Seen &check;');
                var button = $('<li class="kh-seen-button"></li>').append(button_link);
                var this_setting = this;
                button.click(function () {
                    this_setting.change();
                });
                this.buttons_links.push(button_link);
                return button;
            },
            updateButtons: function () {
                for (var i = 0; i < this.buttons_links.length; i++) {
                    this.buttons_links[i].html(this.is_seen ? 'Unseen &cross;' : 'Seen &check;');
                }
            },
        };
 
        $('li.bookmark').after(seen_buttons.getButton());
        $('#new_kudo').parent().after(seen_buttons.getButton());
    }
 
    // attach the menu
    function addSeenMenu() {
 
        // create a button for the menu
        function getMenuButton(button_text, on_click) {
            var button = $('<li><a>' + button_text + '</a></li>');
            if (on_click) {
                button.click(on_click);
                button.addClass('kh-menu-setting');
            }
            else {
                button.addClass('kh-menu-header');
            }
            return button;
        }
 
        // get the header menu
        var header_menu = $('ul.primary.navigation.actions');
 
        // create menu button
        var seen_menu = $('<li class="dropdown"></li>').html('<a>Seen works</a>');
 
        // create dropdown menu
        var drop_menu = $('<ul class="menu dropdown-menu"></li>');
 
        // append buttons to the dropdown menu
        drop_menu.append(
            getMenuButton('Mark as Seen', markPageSeen),
            getMenuButton('Unmark as Seen', markPageUnseen),
 
        );
 
        settings_list.forEach(function (setting) {
            drop_menu.append(kudos_history[setting.name].getButton());
        });
 
        seen_menu.append(drop_menu);
        header_menu.find('li.search').before(seen_menu);
    }
 
     // add css rules to page head
    function addCss() {
        var css = '.has-kudos.marked-seen,.has-kudos{background:url("https://i.imgur.com/jK7d4jh.png") left no-repeat,url("https://i.imgur.com/ESdBCSX.png") left repeat-y !important;padding-left:50px !important}@media screen and (max-width: 42em){.has-kudos.marked-seen,.has-kudos{background-size:20px !important;padding-left:30px !important}}.marked-seen{background:url("https://i.imgur.com/ESdBCSX.png") left repeat-y !important;padding-left:50px !important}@media screen and (max-width: 42em){.marked-seen{background-size:20px !important;padding-left:30px !important}}.kh-highlight-bookmarked-yes .is-bookmarked,dl.is-bookmarked{background:url("https://i.imgur.com/qol1mWZ.png") right repeat-y !important;padding-right:50px !important}@media screen and (max-width: 42em){.kh-highlight-bookmarked-yes .is-bookmarked,dl.is-bookmarked{background-size:20px !important;padding-right:30px !important}}.kh-highlight-bookmarked-yes .is-bookmarked.has-kudos,dl.is-bookmarked.has-kudos,.kh-highlight-bookmarked-yes .is-bookmarked.has-kudos.marked-seen,dl.is-bookmarked.has-kudos.marked-seen{background:url("https://i.imgur.com/jK7d4jh.png") left no-repeat,url("https://i.imgur.com/ESdBCSX.png") left repeat-y,url("https://i.imgur.com/qol1mWZ.png") right repeat-y !important}@media screen and (max-width: 42em){.kh-highlight-bookmarked-yes .is-bookmarked.has-kudos,dl.is-bookmarked.has-kudos,.kh-highlight-bookmarked-yes .is-bookmarked.has-kudos.marked-seen,dl.is-bookmarked.has-kudos.marked-seen{background-size:20px !important}}.kh-highlight-bookmarked-yes .is-bookmarked.marked-seen,dl.is-bookmarked.marked-seen{background:url("https://i.imgur.com/ESdBCSX.png") left repeat-y,url("https://i.imgur.com/qol1mWZ.png") right repeat-y !important}@media screen and (max-width: 42em){.kh-highlight-bookmarked-yes .is-bookmarked.marked-seen,dl.is-bookmarked.marked-seen{background-size:20px !important}}#kudoshistory-update a,.kh-menu-setting a,.kh-seen-button a{cursor:pointer}.kh-menu-header a{padding:.5em .5em .25em !important;text-align:center;font-weight:bold}#kudoshistory-update{padding:.5em 1em 1em 1em}#kudoshistory-update img{max-width:300px;height:auto}#importexport-box{position:fixed;top:0px;bottom:0px;left:0px;right:0px;width:60%;height:80%;max-width:800px;margin:auto;overflow-y:auto;border:10px solid #eee;box-shadow:0px 0px 8px 0px rgba(0,0,0,.2);padding:0 20px;background-color:#fff;z-index:999}#importexport-box input[type=button]{height:auto;cursor:pointer}#importexport-box p.actions{float:none;text-align:right}#importexport-box .kh-setting-row{line-height:1.6em}#importexport-box .kh-setting-label{display:inline-block;min-width:13.5em}@media screen and (max-width: 42em){#importexport-box .kh-setting-label{display:block;min-width:auto}}#importexport-box .kh-setting-label .kh-setting-info-button{font-size:.8em;cursor:pointer}#importexport-box .kh-setting-option{padding:0 3px;border-radius:4px;border:0;color:#111;background:#eee;cursor:pointer}#importexport-box .kh-setting-option.kh-setting-option-selected{color:#fff;background:#900}#importexport-box .kh-setting-separator:last-child{display:none}#importexport-box .kh-setting-info{position:relative;border:1px solid;padding:1px 5px}#importexport-box .kh-setting-info:before{content:" ";position:absolute;top:-12px;border:6px solid transparent;border-bottom-color:initial}#importexport-bg{position:fixed;width:100%;height:100%;background-color:#000;opacity:.7;z-index:998}.kh-toggles{display:none;position:absolute;top:-22px;font-size:10px;line-height:10px;right:-1px;background:#fff;border:1px solid #ddd;padding:5px}.kh-toggles a{cursor:pointer}.kh-reversi #importexport-box{background-color:#333;border-color:#222}.kh-reversi #importexport-box .kh-setting-option-selected{background:#5998d6}.kh-reversi .kh-toggles{background:#333;border-color:#555}.kh-hide-element{display:none}.kh-highlight-bookmarked-yes .bookmark.is-bookmarked p.status{padding-right:40px}@media screen and (max-width: 42em){.kh-highlight-bookmarked-yes .bookmark.is-bookmarked p.status{padding-right:20px}}.kh-skipped-display-collapse .collapsed-blurb.skipped-work h6.landmark.heading,.kh-seen-display-collapse .collapsed-blurb.marked-seen h6.landmark.heading,.kh-kudosed-display-collapse .collapsed-blurb.has-kudos h6.landmark.heading,.kh-skipped-display-collapse .collapsed-blurb.skipped-work>ul,.kh-seen-display-collapse .collapsed-blurb.marked-seen>ul,.kh-kudosed-display-collapse .collapsed-blurb.has-kudos>ul,.kh-skipped-display-collapse .collapsed-blurb.skipped-work blockquote.userstuff.summary,.kh-seen-display-collapse .collapsed-blurb.marked-seen blockquote.userstuff.summary,.kh-kudosed-display-collapse .collapsed-blurb.has-kudos blockquote.userstuff.summary,.kh-skipped-display-collapse .collapsed-blurb.skipped-work dl.stats,.kh-seen-display-collapse .collapsed-blurb.marked-seen dl.stats,.kh-kudosed-display-collapse .collapsed-blurb.has-kudos dl.stats,.kh-skipped-display-collapse .collapsed-blurb.skipped-work .header .fandoms.heading,.kh-seen-display-collapse .collapsed-blurb.marked-seen .header .fandoms.heading,.kh-kudosed-display-collapse .collapsed-blurb.has-kudos .header .fandoms.heading{display:none !important}.kh-skipped-display-collapse .collapsed-blurb.skipped-work .required-tags,.kh-seen-display-collapse .collapsed-blurb.marked-seen .required-tags,.kh-kudosed-display-collapse .collapsed-blurb.has-kudos .required-tags,.kh-skipped-display-collapse .collapsed-blurb.skipped-work .mystery .icon,.kh-seen-display-collapse .collapsed-blurb.marked-seen .mystery .icon,.kh-kudosed-display-collapse .collapsed-blurb.has-kudos .mystery .icon{opacity:.6;transform:scale(0.4);transform-origin:top left}.kh-skipped-display-collapse .collapsed-blurb.skipped-work .header,.kh-seen-display-collapse .collapsed-blurb.marked-seen .header,.kh-kudosed-display-collapse .collapsed-blurb.has-kudos .header{min-height:22px;cursor:zoom-in}.kh-skipped-display-collapse .collapsed-blurb.skipped-work .header .heading,.kh-seen-display-collapse .collapsed-blurb.marked-seen .header .heading,.kh-kudosed-display-collapse .collapsed-blurb.has-kudos .header .heading{margin-left:32px}.kh-skipped-display-collapse .skipped-work:not(.collapsed-blurb) .header,.kh-seen-display-collapse .marked-seen:not(.collapsed-blurb) .header,.kh-kudosed-display-collapse .has-kudos:not(.collapsed-blurb) .header{cursor:zoom-out}.kh-kudosed-display-hide:not(.bookmarks-show) li.has-kudos{display:none !important}.kh-seen-display-hide:not(.bookmarks-show) li.marked-seen{display:none !important}.kh-skipped-display-hide .skipped-work{display:none}.kh-skipped-display-placeholder .skipped-work>*{display:none}.kh-skipped-display-placeholder .skipped-work:before{content:"Skipped"}.kh-highlight-new-yes li.new-blurb{border-left:5px solid #900}.kh-highlight-new-yes.kh-reversi#main li.new-blurb{border-left-color:#5998d6}.kh-toggles-display-on-hover li.blurb-with-toggles:hover>.kh-toggles{display:block}.kh-toggles-display-show li.blurb-with-toggles{margin-top:31px}.kh-toggles-display-show li.blurb-with-toggles .kh-toggles{display:block}';
 
        var style = $('<style type="text/css"></style>').appendTo($('head'));
        style.html(css);
 
        addMainClass();
    }
 
    function addMainClass(update) {
 
        var classes_to_remove = [];
        var classes_to_add = [];
 
        settings_list.forEach(function (setting) {
            var setting_class_name = setting.name.replace('_', '-');
            classes_to_add.push('kh-' + setting_class_name + '-' + kudos_history[setting.name].current.replace(' ', '-'));
 
            if (update) {
                setting.options.forEach(function (option) {
                    classes_to_remove.push('kh-' + setting_class_name + '-' + option.replace(' ', '-'));
                });
            }
        });
 
        if (update) {
            main.removeClass(classes_to_remove.join(' '));
        }
 
        main.addClass(classes_to_add.join(' '));
    }
})(jQuery);