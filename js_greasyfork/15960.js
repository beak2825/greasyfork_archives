// ==UserScript==
// @name            TW-Script Suite
// @include         http*://*.the-west.*/game.php*
// @author          Slygoxx, Azbestka mod
// @grant           none
// @version         1.9
// @description     Kolekcja akcesoriów dla gry przeglądarkowej The West
// @namespace       https://greasyfork.org/pl/users/26244-azbestka
// @downloadURL https://update.greasyfork.org/scripts/15960/TW-Script%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/15960/TW-Script%20Suite.meta.js
// ==/UserScript==

function runScript(source) {
    if ('function' == typeof source) {
        source = '(' + source + ')();';
    }
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = source;
    document.body.appendChild(script);
    document.body.removeChild(script);
}

runScript(function() {

    SlySuite = {
        preferences: {
            KOTimer: true,
            RiverColours: "default",
            Experience: false,
            Achievements: false,
            CraftingWindow: false,
            ExpBar: true
        },
        possibleRiverColours: {
            default: 'Domyślny',
            halloween: 'Czerwony',
            paddy: 'Zielony',
            valentine: 'Różowy',
            blue: 'Niebieski',
            norivers: 'Ukryj rzeki'
        },
        getPreference: function(pref) {
            return this.preferences[pref];
        },
        setPreference: function(pref, val) {
            if (pref == 'RiverColours')
                SlySuite.RiverColours.changeColour();

            this.preferences[pref] = val;
            localStorage.setObject('SlySuite', this.preferences);


        },
        images: {
            achievements: '//i300.photobucket.com/albums/nn22/qwexrty/achievs_zps4c5d9ee3.jpg',
            settings: '//i300.photobucket.com/albums/nn22/qwexrty/settings_zpsa8c2f112.jpg',
            achievement_icon: '//i300.photobucket.com/albums/nn22/qwexrty/questbook2_zpsf9bfe431.png'
        },
        init: function() {
            Storage.prototype.setObject = function(key, value) {
                this.setItem(key, JSON.stringify(value));
            };

            Storage.prototype.getObject = function(key) {
                var value = this.getItem(key);
                return value && JSON.parse(value);
            };

            localStorage.getObject('SlySuite') == null ? localStorage.setObject('SlySuite', this.preferences) : $.extend(this.preferences, localStorage.getObject('SlySuite'));
            SlySuite.createSettingsButton();

            if (SlySuite.getPreference('KOTimer'))
                SlySuite.KOTimer.firstrun();

            $(setTimeout(function() {
                SlySuite.RiverColours.init();
                if (SlySuite.getPreference('RiverColours') != 'default')
                    SlySuite.RiverColours.changeColour();
            }, 5000));

            if (SlySuite.getPreference('Achievements'))
                SlySuite.Achievements.init();

            if (SlySuite.getPreference('CraftingWindow'))
                SlySuite.CraftingWindow.init();

            if (SlySuite.getPreference('ExpBar'))
                SlySuite.ExpBar.init();

        },
        createSettingsButton: function() {

            var bottom = $('<div></div>').attr({
                'class': 'menucontainer_bottom'
            });

            var icon = $('<div></div>').attr({
                'class': 'menulink',
                'title': "TW-Script Suite Ustawienia"
            }).css({
                'background-image': 'url(' + this.images.settings + ')',
                'background-position': '0px 0px'
            }).mouseleave(function() {
                $(this).css("background-position", "0px 0px");
            }).mouseenter(function(e) {
                $(this).css("background-position", "-25px 0px");
            }).click(function() {
                SlySuite.openSettings();
            });

            $('#ui_menubar .ui_menucontainer :last').after($('<div></div>').attr({
                'class': 'ui_menucontainer',
                'id': 'SlySuite_settings_icon'
            }).append(icon).append(bottom));
        },
        createAchievementsButton: function() {

        },
        openSettings: function() {
            content = this.generateWindowContent();
            var win = wman.open("SlySuite", "TW-Script Suite Ustawienia").setResizeable(true).setMinSize(450, 400).setSize(450, 400);
            win.appendToContentPane(content);
        },
        generateWindowContent: function() {
            content = "";
            content += "<div style=\"margin-left:5px;\">";
            content += "Kollor rzek ";
            content += "<select onchange=\"SlySuite.setPreference('RiverColours',this.value);\">";
            colours = SlySuite.possibleRiverColours;
            for (var c in colours) {
                if (SlySuite.getPreference('RiverColours') == c)
                    content += "<option selected='selected' value=\"" + c + "\">" + colours[c] + "</option>";
                else
                    content += "<option value=\"" + c + "\">" + colours[c] + "</option>";

            }
            content += "</select><br />";
            this.getPreference('KOTimer') == true ? check = " checked='checked'" : check = "";
            content += "<input type='checkbox' id='KOtimer_checkbox'" + check + " onchange=\"SlySuite.setPreference('KOTimer',this.checked)\"><label for='KOtimer_checkbox'>Zegar odliczający</label><br />";
            this.getPreference('Achievements') == true ? check = " checked='checked'" : check = "";
            content += "<input type='checkbox' id='Achievements_checkbox'" + check + " onchange=\"SlySuite.setPreference('Achievements',this.checked)\"><label for='Achievements_checkbox'>Śledzenie osiągnięć</label><br />";
            this.getPreference('CraftingWindow') == true ? check = " checked='checked'" : check = "";
            content += "<input type='checkbox' id='CraftingWindow_checkbox'" + check + " onchange=\"SlySuite.setPreference('CraftingWindow',this.checked)\"><label for='CraftingWindow_checkbox'>Zmień wygląd okna rzemiosła</label><br />";
            this.getPreference('ExpBar') == true ? check = " checked='checked'" : check = "";
            content += "<input type='checkbox' id='ExpBar_checkbox'" + check + " onchange=\"SlySuite.setPreference('ExpBar',this.checked)\"><label for='ExpBar_checkbox'>Zmień wygląd paska doświadczenia</label><br />";
            content += "<br /><br />";
            content += "Niektóre ustawienia wymagają odświerzenia okna z grą";
            content += "</div>";
            return content;
        }

    };

    SlySuite.KOTimer = {
        timeleft: 0,
        aliveAgain: 0,
        protectedUntil: 0,
        timers: "<div style='position:relative;display:block;width:59px;height:59px;cursor:pointer;' class='brown' id='knockouttimer'><div id='timer'></div></div>",
        lastDied: Character.lastDied,
        image_brown: "//i300.photobucket.com/albums/nn22/qwexrty/knockout_sprite_zpsa87b8b68.png",
        image_green: "//i300.photobucket.com/albums/nn22/qwexrty/knockout_sprite_green_zpsb8aa3008.png"
    };

    SlySuite.KOTimer.firstrun = function() {

        if ($('.game_notification_area').length > 0) {
            $('.game_notification_area').append(this.timers);
        } else {
            setTimeout(SlySuite.KOTimer.firstrun, 3000);
            console.log('Couldn\'t find the notification area, trying again soon...');
            return;
        }
        $('body').append('<style>#knockouttimer.green {background-image: url("' + this.image_green + '");} #knockouttimer.brown {background-image: url("' + this.image_brown + '");}</style>');
        $('#knockouttimer').attr({
            'title': "Gotowy do pojedynku<br />Chroniony do: 12/2/2015 23:50:12"
        });

        $('#knockouttimer #timer').css({
            'position': 'absolute',
            'bottom': '0px',
            'left': '0px',
            'right': '0px',
            'color': 'white',
            'text-align': 'center',
            'font-size': '11px',
            'height': '30px',
            'line-height': '30px'
        });
        SlySuite.KOTimer.getTimes();
        SlySuite.KOTimer.update();
    };

    SlySuite.KOTimer.getTimes = function() {
        var unix = Math.round(new Date().getTime() / 1000);
        SlySuite.KOTimer.aliveAgain = Character.getMandatoryDuelProtection();
        SlySuite.KOTimer.protectedUntil = Character.getDuelProtection();

        var duelString = "";
        var protectionString = "";
        serverDateAlive = get_server_date_string(false, SlySuite.KOTimer.aliveAgain * 1000, true);
        serverDateProtection = get_server_date_string(false, SlySuite.KOTimer.protectedUntil * 1000, true);
        serverDateAlive = serverDateAlive.split(" ")[1] + " " + serverDateAlive.split(" ")[0];
        serverDateProtection = serverDateProtection.split(" ")[1] + " " + serverDateProtection.split(" ")[0];
        if (SlySuite.KOTimer.aliveAgain < unix) {
            duelString = "Gotowy do pojedynku";
            if ($('#knockouttimer').hasClass('brown')) {
                $('#knockouttimer').removeClass('brown hasMousePopup').addClass('green');
            }
        } else {
            duelString = "Gotowy do pojedynku o: " + serverDateAlive;
            if ($('#knockouttimer').hasClass('green')) {
                $('#knockouttimer').removeClass('green hasMousePopup').addClass('brown');
            }
        }
        protectionString = "Chroniony do: " + serverDateProtection;
        $('#knockouttimer').attr({
            'title': duelString + "<br />" + protectionString
        });
    };

    SlySuite.KOTimer.update = function() {
        if (!SlySuite.KOTimer.aliveAgain) {
            $('#knockouttimer').hide();
            setTimeout(SlySuite.KOTimer.update, 1000);
            return;
        }
        var unix = Math.round(new Date().getTime() / 1000);
        if (SlySuite.KOTimer.protectedUntil != Character.getDuelProtection())
            SlySuite.KOTimer.getTimes();
        if (SlySuite.KOTimer.protectedUntil < unix) {
            $('#knockouttimer').hide();
            setTimeout(SlySuite.KOTimer.update, 10000);
            return;
        } else
            $('#knockouttimer').show();
        if (SlySuite.KOTimer.aliveAgain < unix) {
            time = SlySuite.KOTimer.protectedUntil;
            $('#knockouttimer').removeClass('brown').addClass('green');
        } else {
            time = SlySuite.KOTimer.aliveAgain;
            $('#knockouttimer').removeClass('green').addClass('brown');
        }

        difference = time - unix;
        hours = Math.floor(difference / 60 / 60);
        difference -= hours * 60 * 60;
        minutes = Math.floor(difference / 60);
        difference -= minutes * 60;
        seconds = difference;
        if (seconds < 0) seconds = 0;

        $('#knockouttimer #timer').html(("0" + hours).slice(-2) + ':' + ("0" + minutes).slice(-2) + ':' + ("0" + seconds).slice(-2));

        setTimeout(SlySuite.KOTimer.update, 1000);

    };
    SlySuite.RiverColours = {
        initialized: false
    };

    SlySuite.RiverColours.init = function() {
        if (typeof(Map.Helper) == 'undefined')
            return;
        SlySuite.RiverColours.initialized = true;
        SlySuite.RiverColours.oldScript = Map.Helper.imgPath.lookForModification.bind({});
        Map.Helper.imgPath.lookForModification = function(path, d) {
            $('#river_hide_css').remove();
            if (/river|deco_egg_05|quests_fluss/.test(path) && SlySuite.getPreference('RiverColours') != 'default' && SlySuite.getPreference('RiverColours') != 'norivers') {
                if (SlySuite.getPreference('RiverColours') == 'blue')
                    return '/' + path;
                else
                    return SlySuite.getPreference('RiverColours') + '/' + path;
            } else if (SlySuite.getPreference('RiverColours') == 'norivers') {
                var hidingrivers = document.createElement('style');
                hidingrivers.setAttribute("id", "river_hide_css");
                hidingrivers.textContent = ".image[style*='river']{display:none;}";
                document.body.appendChild(hidingrivers);
                return SlySuite.RiverColours.oldScript(path, d);
            } else
                return SlySuite.RiverColours.oldScript(path, d);

        };
        SlySuite.RiverColours.changeColour = function() {
            Map.Helper.imgPath.clearCache();
            Map.refresh(true);
        };
    };

    SlySuite.Achievements = {
        achievementsList: {},
        allFolders: [],
        lastUpdate: new Date(0),
        nextFolderCheck: false,
        init: function() {
            localStorage.getObject('SlySuite_Achievements') == null ? localStorage.setObject('SlySuite_Achievements', SlySuite.Achievements.achievementsList) : $.extend(this.achievementsList, localStorage.getObject('SlySuite_Achievements'));
            $(function() {
                Ajax.remoteCall('achievement', '', {
                    playerid: Character.playerId
                }, function(r) {
                    if (r.error) return new MessageError(r.msg).show();
                    for (var f in r.menu) {
                        if (!('id' in r.menu[f])) continue;
                        if (r.menu[f].id == 'overall' || r.menu[f].id == 'heroics')
                            continue;
                        SlySuite.Achievements.allFolders.push(r.menu[f].id);
                        for (var sub in r.menu[f].sub)
                            if ('id' in r.menu[f].sub[sub]) SlySuite.Achievements.allFolders.push(r.menu[f].sub[sub].id);
                    }
                });
                setTimeout(function() {
                    SlySuite.Achievements.createWindow();
                    SlySuite.Achievements.editTracker();
                    SlySuite.Achievements.updateAchievements();


                }, 5000);
            });

            this.createButton();
        },
        createWindow: function() {
            if (typeof(Map.width) == 'undefined' || Map.width == 0) {
                setTimeout(SlySuite.Achievements.createWindow, 3000);
                return;
            }
            this.scrolling = new west.gui.Scrollpane(null).appendContent(
                "<div class='achievement_tracker_container' />"
            );
            this.window = wman.open('achievementtracker', null, 'chat questtracker noclose nofocus nocloseall dontminimize')
                .setMiniTitle('Śledzone siągnięcia')
                .setSize(350, 170)
                .setMinSize(320, 140)
                .addEventListener(TWE('WINDOW_MINIMIZE'), this.minimize, this)
                .addEventListener(TWE('WINDOW_DESTROY'), this.minimize, this)
                .addEventListener(TWE('WINDOW_RELOAD'), this.manualUpdate, this)
                .setResizeable(true)
                .appendToContentPane($("<div id='ui_achievementtracker'/>").append(this.scrolling.getMainDiv()));

            this.window.addTab('<div class="questbook" title="Śledzenie siągnięć"></div> Śledzenie siągnięć', 'achievementtracker', function() {});

            this.window.dontCloseAll = true;
            this.addCss();

            $(this.window.getMainDiv()).css({
                left: Map.width - 425,
                top: 400
            });
            $('._tab_id_achievementtracker .tw2gui_window_tab_text .questbook').css({
                'background-image': 'url(' + SlySuite.images.achievement_icon + ')'
            });
            $('#windows .tw2gui_window.questtracker .tw2gui_window_tabbar_tabs').attr({
                'style': 'left:2px !important;'
            });
        },
        createButton: function() {
            var bottom = $('<div></div>').attr({
                'class': 'menucontainer_bottom'
            });

            var icon = $('<div></div>').attr({
                'class': 'menulink',
                'title': "Otwórz śledzenie siągnięć"
            }).css({
                'background-image': 'url(' + SlySuite.images.achievements + ')',
                'background-position': '0px 0px'
            }).mouseleave(function() {
                $(this).css("background-position", "0px 0px");
            }).mouseenter(function(e) {
                $(this).css("background-position", "-25px 0px");
            }).click(function() {
                SlySuite.Achievements.openWindow();
            });

            $('#ui_menubar .ui_menucontainer :last').after($('<div></div>').attr({
                'class': 'ui_menucontainer',
                'id': 'Achievementtracker_button'
            }).css({
                display: 'none'
            }).append(icon).append(bottom));
        },
        minimize: function() {
            $(this.window.divMain).hide();
            $('#Achievementtracker_button').show();
            wman.minimizedIds[this.window.id] = this.window;
        },
        openWindow: function() {
            $(this.window.divMain).show();
            $('#Achievementtracker_button').hide();
        },
        editTracker: function() {
            SlySuite.Achievements.oldTracker = Character.trackAchievement;
            Character.trackAchievement = function(a, b) {
                SlySuite.Achievements.trackAchievement(a, b);
            };
        },
        trackAchievement: function(progress, update) {
            if (!SlySuite.preferences.Achievements) {
                SlySuite.Achievements.oldTracker(progress, update);
                return;
            }
            var params = progress.split('-');
            // achievement done, track next one in group
            if (!update || params[2]) {
                var achvId = (params[2]) ? params[2] : params[0];
                this.setAchievement(achvId);
            } else {
                this.setAchievement(params[1]);
            }

        },
        setAchievement: function(achi) {
            if (achi in this.achievementsList) {
                delete this.achievementsList[achi];
                this.removeFromTracker(achi);
                localStorage.setObject('SlySuite_Achievements', SlySuite.Achievements.achievementsList);
            } else {
                SlySuite.Achievements.openWindow();
                this.achievementsList[achi] = new Object();
                this.getAchievementData(achi);
                SlySuite.Achievements.descriptionNeeded.push(parseInt(achi));
                if (!SlySuite.Achievements.nextFolderCheck)
                    SlySuite.Achievements.getFolderInfo(SlySuite.Achievements.allFolders.slice());

            }
        },
        manualUpdate: function() {
            if (this.lastUpdate.getTime() < new Date().getTime() - 60000) {
                this.window.showLoader();
                clearTimeout(this.nextUpdate);
                this.updateAchievements();
                this.lastUpdate = new Date();
                this.window.hideLoader();
            } else {
                secleft = 60 - Math.floor((new Date().getTime() - this.lastUpdate.getTime()) / 1000);
                new MessageError("Updated too recently, try again in " + secleft + "s").show();
            }

        },
        updateTracker: function(achi) {
            if (this.achievementsList[achi].current >= this.achievementsList[achi].required) {
                this.setAchievement(achi);
                return;
            }

            if (!('isTime' in this.achievementsList[achi]))
                this.achievementsList[achi].isTime = false;

            if ($('#ui_achievementtracker #achievementtracker_' + achi).length > 0) {
                $('#ui_achievementtracker #achievementtracker_' + achi + ' .achievement_current').html(this.achievementsList[achi].isTime ? this.tcalc(this.achievementsList[achi].current) : this.achievementsList[achi].current);
                $('#ui_achievementtracker #achievementtracker_' + achi + ' .achievement_required').html(this.achievementsList[achi].isTime ? this.tcalc(this.achievementsList[achi].required) : this.achievementsList[achi].required);
                $('#ui_achievementtracker #achievementtracker_' + achi + ' .achievement_percentage').html(Math.floor(this.achievementsList[achi].current / this.achievementsList[achi].required * 100));
                $('#ui_achievementtracker #achievementtracker_' + achi + ' .quest_requirement').attr('title', ('description' in this.achievementsList[achi] ? this.achievementsList[achi].description : ''));
            } else {
                $('#ui_achievementtracker .achievement_tracker_container').append('<div class="selectable" id="achievementtracker_' + achi + '">' +
                    '<div class="quest-list title">' + this.achievementsList[achi].title +
                    '<span class="quest-list remove" title="Przestań śledzić"></span></div>' +
                    '<ul class="requirement_container"><li class="quest_requirement" ' + ('description' in this.achievementsList[achi] ? 'title="' + this.achievementsList[achi].description + '"=' : '') + '>- <span class="achievement_current">' + (this.achievementsList[achi].isTime ? this.tcalc(this.achievementsList[achi].current) : this.achievementsList[achi].current) +
                    '</span> / <span class="achievement_required">' + (this.achievementsList[achi].isTime ? this.tcalc(this.achievementsList[achi].required) : this.achievementsList[achi].required) + '</span> (<span class="achievement_percentage">' +
                    (Math.floor(this.achievementsList[achi].current / this.achievementsList[achi].required * 100)) + '</span>%)</li></ul></div>');
                $('#ui_achievementtracker #achievementtracker_' + achi + ' .quest-list.remove').click(function() {
                    SlySuite.Achievements.setAchievement(achi);
                });
            }
        },
        getAchievementData: function(achi) {
            Ajax.remoteCall('achievement', 'track', {
                achvid: achi
            }, function(resp) {
                if (resp.error) return new MessageError(resp.msg).show();
                $.extend(SlySuite.Achievements.achievementsList[achi], {
                    title: resp.title,
                    current: resp.current,
                    required: resp.required
                });
                SlySuite.Achievements.updateTracker(achi);
                Ajax.remoteCall('achievement', 'untrack');
                localStorage.setObject('SlySuite_Achievements', SlySuite.Achievements.achievementsList);
            });
        },
        removeFromTracker: function(achi) {
            $('#ui_achievementtracker #achievementtracker_' + achi).remove();
            if (Object.keys(SlySuite.Achievements.achievementsList).length == 0)
                SlySuite.Achievements.minimize();
        },
        updateAchievements: function() {
            SlySuite.Achievements.descriptionNeeded = [];

            if (Object.keys(SlySuite.Achievements.achievementsList).length == 0)
                SlySuite.Achievements.minimize();

            for (var a in SlySuite.Achievements.achievementsList) {
                SlySuite.Achievements.getAchievementData(a);
                if (!('folder' in SlySuite.Achievements.achievementsList[a]))
                    SlySuite.Achievements.descriptionNeeded.push(parseInt(a));
            }
            SlySuite.Achievements.nextUpdate = setTimeout(SlySuite.Achievements.updateAchievements, 10 * 60 * 1000);

            if (SlySuite.Achievements.descriptionNeeded.length > 0)
                SlySuite.Achievements.getFolderInfo(SlySuite.Achievements.allFolders.slice());


        },
        getFolderInfo: function(arr) {
            if (arr.length == 0 || SlySuite.Achievements.descriptionNeeded.length == 0) {
                SlySuite.Achievements.nextFolderCheck = false;
                return;
            }
            Ajax.remoteCall('achievement', 'get_list', {
                folder: arr[0],
                playerid: Character.playerId
            }, function(json) {
                for (var achieve in json.achievements.progress) {
                    currentId = json.achievements.progress[achieve].id;
                    if ($.inArray(currentId, SlySuite.Achievements.descriptionNeeded) != -1) {
                        SlySuite.Achievements.descriptionNeeded.splice(SlySuite.Achievements.descriptionNeeded.indexOf(currentId), 1);
                        SlySuite.Achievements.achievementsList[currentId].description = json.achievements.progress[achieve].desc;
                        SlySuite.Achievements.achievementsList[currentId].folder = arr[0];
                        if (json.achievements.progress[achieve].meta[0].match('^js:')) {
                            var parts = json.achievements.progress[achieve].meta[0].split(":");
                            var func = eval(parts[1]);
                            if (func instanceof west.gui.Progressbar) {
                                parts[4] ? SlySuite.Achievements.achievementsList[currentId].isTime = true : SlySuite.Achievements.achievementsList[currentId].isTime = false;
                            }
                        }
                        SlySuite.Achievements.updateTracker(currentId);
                        localStorage.setObject('SlySuite_Achievements', SlySuite.Achievements.achievementsList);
                    }
                }

                arr.splice(0, 1);
                SlySuite.Achievements.nextFolderCheck = setTimeout(SlySuite.Achievements.getFolderInfo, 2000, arr);
            });
        },
        addCss: function() {
            achievementCss = '';
            achievementCss += "#ui_achievementtracker .quest-list.title {margin-left:5px;color: #DBA901;font-weight: bold;display:inline-block;zoom:1;}\n";
            achievementCss += "#ui_achievementtracker .selectable:hover .quest-list.remove {display:inline-block;zoom:1;cursor:pointer;}\n";
            achievementCss += "#ui_achievementtracker .quest-list.remove {background: url('/images/chat/windowicons.png') no-repeat -120px 0px;width: 12px; height: 12px; margin-left:5px;margin-bottom:-2px;}\n";
            achievementCss += "div#ui_achievementtracker { width: 100%; height: 100%; display:block;}";

            var style = document.createElement('style');
            style.textContent = achievementCss;
            document.body.appendChild(style);
        },
        tcalc: function(val) {
            var h, m, s;
            m = s = "00";
            h = Math.floor(val / 3600);
            if (0 != (val % 3600)) {
                var c = val - (h * 3600);
                minute = Math.floor(c / 60);
                if (0 != (c % 60)) s = c % 60;
            }
            return (h <= 0 ? "" : h + ":") + m + ":" + s;
        }

    };

    SlySuite.CraftingWindow = {

        old: $.extend({}, Crafting),
        currentlySelected: false,
        knownRecipes: [],
        init: function() {
            Crafting.addRecipe = SlySuite.CraftingWindow.addRecipe;
            Crafting.updateResources = SlySuite.CraftingWindow.updateResources;
            /*Bag.updateChanges = function(changes, from) {
                Bag.handleChanges(changes, from);
                Crafting.updateResources();
                SlySuite.CraftingWindow.updateAllCount();
            };*/

            SlySuite.CraftingWindow.addCss();
        },
        selectRecipe: function(id) {
            $('#recipe' + SlySuite.CraftingWindow.currentlySelected + '.selected').removeClass('selected');
            $('.recipe_content').hide();
            $('#recipe' + id).addClass('selected');
            $('#recipe_content_' + id).show();
            SlySuite.CraftingWindow.currentlySelected = id;
            if (SlySuite.CraftingWindow.craftCount(id) > 0) {
                $('#crafting_requirements_display #craftbuttons').show();
            } else {
                $('#crafting_requirements_display #craftbuttons').hide();
            }
            $('#crafting_requirements_display #craftbuttons #craft_amount').val(1);
            $('#crafting_requirements_display #craftbuttons #craft_amount').change();

        },
        craftCount: function(id) {
            if (!id)
                return 0;
            var canCraft = 10000;
            for (var i in Crafting.recipes[id].resources) {
                if (!Crafting.recipes[id].resources.hasOwnProperty((i))) continue;

                resourceItem = ItemManager.get(Crafting.recipes[id].resources[i].item);
                amountRequired = Crafting.recipes[id].resources[i].count;
                var bag_count = Bag.getItemCount(resourceItem.item_id);
                canCraft = Math.min(Math.floor(bag_count / amountRequired), canCraft);
            }
            return canCraft;
        },
        updateResources: function() {
            for (var k in Crafting.recipes) {
                var mats_available = true,
                    resourceItem, amountRequired;
                for (var i in Crafting.recipes[k].resources) {
                    if (!Crafting.recipes[k].resources.hasOwnProperty((i))) continue;

                    resourceItem = ItemManager.get(Crafting.recipes[k].resources[i].item);
                    amountRequired = Crafting.recipes[k].resources[i].count;

                    var bag_count = Bag.getItemCount(resourceItem.item_id);

                    SlySuite.CraftingWindow.updateCount(k);

                    if (bag_count < amountRequired) mats_available = false;

                    window.CharacterWindow.window.$('#resources_' + k + '_' + resourceItem.item_id).html(
                        new tw2widget.CraftingItem(resourceItem)
                        .setRequired(bag_count, amountRequired)
                        .getMainDiv()
                    );
                }
                window.CharacterWindow.window.$('#recipe_craft_' + Crafting.recipes[k].item_id).empty();

                if (Crafting.recipes[k].last_craft) {
                    $('#recipe_craft_' + Crafting.recipes[k].item_id).append("<span cursor:default;'>" + Crafting.recipes[k].last_craft.formatDurationBuffWay() + "</span>");
                    console.log('test');
                }

                if (mats_available)
                    CharacterWindow.window.$('#recipe' + Crafting.recipes[k].item_id).removeClass("not_available");
                else
                    CharacterWindow.window.$('#recipe' + Crafting.recipes[k].item_id).addClass("not_available");
            }

            if (SlySuite.CraftingWindow.craftCount(SlySuite.CraftingWindow.currentlySelected) > 0) {
                $('#crafting_requirements_display #craftbuttons').show();
            } else {
                $('#crafting_requirements_display #craftbuttons').hide();
            }
        },
        updateCount: function(id) {
            $('#recipe_count_' + id).html('[' + SlySuite.CraftingWindow.craftCount(id) + ']');
            console.log(id);
            $('#crafting_requirements_display #craftbuttons #craft_amount').change();
        },
        updateCraftAmount(action) {
            console.log(action);
            $('#crafting_requirements_display #craftbuttons #minbutton').css('opacity', '1');
            $('#crafting_requirements_display #craftbuttons #plusbutton').css('opacity', '1');
            if (action == "plus") {
                $('#crafting_requirements_display #craftbuttons #craft_amount').val(parseInt($('#crafting_requirements_display #craftbuttons #craft_amount').val()) + 1);
                $('#crafting_requirements_display #craftbuttons #craft_amount').change();
            } else if (action == "min") {
                $('#crafting_requirements_display #craftbuttons #craft_amount').val(parseInt($('#crafting_requirements_display #craftbuttons #craft_amount').val()) - 1);
                $('#crafting_requirements_display #craftbuttons #craft_amount').change();
            } else if (action == "textbox") {
                if ($('#crafting_requirements_display #craftbuttons #craft_amount').val() >= SlySuite.CraftingWindow.craftCount(SlySuite.CraftingWindow.currentlySelected)) {
                    $('#crafting_requirements_display #craftbuttons #plusbutton').css('opacity', '0.3');
                    $('#crafting_requirements_display #craftbuttons #craft_amount').val(SlySuite.CraftingWindow.craftCount(SlySuite.CraftingWindow.currentlySelected));
                }
                if ($('#crafting_requirements_display #craftbuttons #craft_amount').val() <= 1) {
                    $('#crafting_requirements_display #craftbuttons #minbutton').css('opacity', '0.3');
                    $('#crafting_requirements_display #craftbuttons #craft_amount').val(1);
                }
            }
        },
        addRecipe: function(recipe) {
            if ($('#crafting_requirements_display').length < 1) {
                $('.character-crafting.crafting').append($("<div id='crafting_requirements_display' ><div id='craftbuttons' /></div>"));
                $('#crafting_requirements_display #craftbuttons').append(new west.gui.Button(_("Wytwórz"), function() {
                    SlySuite.CraftingWindow.craftItem(SlySuite.CraftingWindow.currentlySelected);
                }).setMinWidth(150).getMainDiv());
                var textbox = new west.gui.Textfield('craft_amount').setSize(4).setValue(1).getMainDiv();
                $('#crafting_requirements_display #craftbuttons').append("<span id='minbutton' />", textbox, "<span id='plusbutton' />");
                /*EventHandler.listen('inventory_changed',function(){
                    
                    
                });*/
                $('#crafting_requirements_display #craftbuttons #craft_amount').change(function() {
                    SlySuite.CraftingWindow.updateCraftAmount('textbox');
                });
                $('#crafting_requirements_display #craftbuttons #minbutton').click(function() {
                    SlySuite.CraftingWindow.updateCraftAmount('min');
                });
                $('#crafting_requirements_display #craftbuttons #plusbutton').click(function() {
                    SlySuite.CraftingWindow.updateCraftAmount('plus');
                });

            }
            var time_last_craft = recipe.last_craft;
            var recipe = ItemManager.get(recipe.item_id);
            Crafting.recipes[recipe.item_id] = recipe;
            Crafting.recipes[recipe.item_id]['last_craft'] = time_last_craft;
            if (window.CharacterWindow.window != undefined && window.CharacterWindow.window.$('#crafting_recipe_list').length > 0) {
                var recipe_div = $("<div class='" + Crafting.getRecipeColor(recipe) + "' id='recipe" + recipe.item_id + "' onclick='SlySuite.CraftingWindow.selectRecipe(" + recipe.item_id + ");'></div>");
                var recipe_title_inner_div = $("<div class='recipe_title_inner' />");
                var recipe_title_div = $("<div id='recipe_title_" + recipe.item_id + "' class='recipe_title'></div>");
                var recipe_collapse_div = $("<div id='recipe_count_" + recipe.item_id + "' class='recipe_collapse'></div>");
                var recipe_difficult_div = $("<div id='recipe_difficult_" + recipe.item_id + "' class='recipe_difficult " + Crafting.getRecipeColor(recipe) + "' title='" + Crafting.description.escapeHTML() + "'></div>");
                var recipe_name_div = $("<div id='recipe_name" + recipe.item_id + "' class='recipe_name'>" + recipe.name + "</div>");
                var recipe_craft_div = $("<div id='recipe_craft_" + recipe.item_id + "' class='recipe_craft'></div>");
                var recipe_content_div = $("<div id='recipe_content_" + recipe.item_id + "' class='recipe_content'></div>").hide();
                var recipe_craftitem_div = $("<div id='recipe_craftitem_" + recipe.item_id + "' class='recipe_craftitem'></div>");
                var recipe_resources_content_div = $("<div id='recipe_resources_content_" + recipe.item_id + "' class='recipe_resources'></div>");

                SlySuite.CraftingWindow.knownRecipes[recipe.item_id] = recipe;

                recipe_title_inner_div.append(recipe_collapse_div, recipe_name_div);
                recipe_title_div.append(recipe_title_inner_div, recipe_craft_div).appendTo(recipe_div);

                var craftitem = $("<div id='craftitem_" + recipe.item_id + "' style='float:none;'/>")
                    .append((new tw2widget.CraftingItem(ItemManager.get(recipe.craftitem))).getMainDiv());

                craftitem.appendTo(recipe_craftitem_div);

                var available = true,
                    resourceItem, canCraft = 1000000;
                for (var i in recipe.resources) {
                    if (!recipe.resources.hasOwnProperty(i)) continue;

                    resourceItem = ItemManager.get(recipe.resources[i].item);

                    var resource = $("<div id='resources_" + recipe.item_id + "_" + resourceItem.item_id + "'></div>");
                    var bag_count = Bag.getItemCount(resourceItem.item_id);

                    canCraft = Math.min(Math.floor(bag_count / recipe.resources[i].count), canCraft);

                    recipe_resources_content_div.append(resource.append(
                        new tw2widget.CraftingItem(resourceItem)
                        .setRequired(bag_count, recipe.resources[i].count)
                        .getMainDiv()
                    ));

                    var hasItem = Bag.getItemByItemId(resourceItem.item_id);
                    if (!hasItem || hasItem.getCount() < recipe.resources[i].count)
                        available = false;
                }
                recipe_collapse_div.html('[' + canCraft + ']');

                if (!available) {
                    recipe_div.addClass("not_available");
                } else if (time_last_craft) {
                    recipe_craft_div.append("<span style='cursor:default;'>" + time_last_craft.formatDurationBuffWay() + "</span>");
                }
                recipe_content_div.append(recipe_craftitem_div, recipe_resources_content_div, $("<br />"));
                recipe_content_div.appendTo($('#crafting_requirements_display'));
                $('#crafting_recipe_list .tw2gui_scrollpane_clipper_contentpane').prepend(recipe_div);
                SlySuite.CraftingWindow.selectRecipe(recipe.item_id);
            }
        },
        craftItem: function(recipe_id) {
            Ajax.remoteCall('crafting', 'start_craft', {
                recipe_id: recipe_id,
                amount: $('#crafting_requirements_display #craftbuttons #craft_amount').val()
            }, function(resp) {
                if (resp.error) return new MessageError(resp.msg).show();
                var data = resp.msg;

                CharacterWindow.progressCrafting.setValue(data.profession_skill);
                Character.setProfessionSkill(data.profession_skill);
                CharacterWindow.window.$('#recipe' + recipe_id)
                    .removeClass('middle hard easy')
                    .addClass(Crafting.getRecipeColor(ItemManager.get(recipe_id)));

                EventHandler.signal("inventory_changed");
                Character.updateDailyTask('crafts', data.count);
                return new MessageSuccess(data.msg).show();
            });
        },
        addCss: function() {
            var css = '';
            css += '#crafting_recipe_list { height:250px; top:43px;position:relative}';
            css += '.recipe_title { background:none; cursor:pointer}';
            css += '.recipe_title_inner { margin-top:2px;}';

            css += '.easy { background:none; color:rgb(40,40,40);}';
            css += '.easy .recipe_title:hover { background:rgba(55, 55, 55, 0.75); color:white;}';
            css += '.easy.selected .recipe_title { background:rgba(55, 55, 55, 0.75); color:white;}';

            css += '.middle { background:none; color:rgb(0, 179, 3);}';
            css += '.middle .recipe_title:hover { background:rgba(0, 118, 6, 0.75); color:white;}';
            css += '.middle.selected .recipe_title { background:rgba(0, 118, 6, 0.75); color:white;}';

            css += '.hard { background:none; color:rgb(255, 88, 0);}';
            css += '.hard .recipe_title:hover { background:rgba(221, 92, 0, 0.75); color:white;}';
            css += '.hard.selected .recipe_title { background:rgba(221, 92, 0, 0.75); color:white;}';

            css += '.recipe_name {color:inherit;margin-top:0px;}';
            css += '.recipe_collapse {color:inherit;font-size:inherit;}';
            css += '.not_available .recipe_collapse {visibility:hidden;}';
            css += '.recipe_craft {color:rgb(236, 25, 25);}';
            css += '#crafting_requirements_display { position: relative; top: 43px; left: 61px;}';
            css += '#crafting_requirements_display #craftbuttons {position:absolute; left:2px; bottom:-19px;}';

            css += '#crafting_requirements_display #craftbuttons #minbutton {cursor:pointer;margin-left:5px;display:inline-block;background-image: url("https://westnls.innogamescdn.com/images/tw2gui/plusminus/minus_button.png");width: 12px;height: 12px;}';
            css += '#crafting_requirements_display #craftbuttons #plusbutton {cursor:pointer;display:inline-block;background-image: url("https://westnls.innogamescdn.com/images/tw2gui/plusminus/plus_button.png");width: 12px;height: 12px;}';
            css += '#crafting_requirements_display #craftbuttons > span {vertical-align:middle;}';

            $('body').append('<style>' + css + '</style>');
        }
    };

    SlySuite.ExpBar = {

        init: function() {
            $("#ui_experience_bar .label").off('hover');
            $("#ui_experience_bar .label span").show();
            $("#ui_experience_bar .label").toggleClass('label xp_label');
            EventHandler.listen("character_exp_changed", SlySuite.ExpBar.update);
            EventHandler.listen("character_tracking_achievement_changed", SlySuite.ExpBar.update);
            SlySuite.ExpBar.update();

            var css = 'div#ui_experience_bar .xp_label {color: white !important;position: absolute;top: 0;left: 0;right: 0;bottom: 0;text-align: center;font-size: 11px;font-weight: bold;text-shadow: 3px 1px 1px #000, 3px -1px 1px #000, -2px 1px 1px #000, -2px 0px 0px #000;}';
            $('body').append('<style>' + css + '</style>');
        },
        update: function() {
            var epEl = $("#ui_experience_bar"),
                prog = (undefined === Character.getTrackingAchievement()) ? WestUi.updateTrackXp(epEl) : WestUi.updateTrackAchievement(epEl);
            $("#ui_experience_bar .xp_label").off('hover');
            $("#ui_experience_bar .xp_label span").show();
            xpString = '';
            if (Character.level < 150) {
                xpString = prog.percent + '% - ' + (prog.current > 10000 ? Math.round(prog.current / 1000) + 'k' : prog.current) + " / " + (prog.required > 10000 ? Math.round(prog.required / 1000) + 'k' : prog.required);
                xpString += " (" + ((prog.required - prog.current) > 10000 ? Math.round((prog.required - prog.current) / 1000) + 'k' : (prog.required - prog.current)) + ")";
            } else
                xpString = Character.experience.toLocaleString();
            $("#ui_experience_bar .xp_label span").html(xpString);
        }

    };


    SlySuite.init();
});