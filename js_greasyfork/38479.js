// ==UserScript==
// @name         Travian Task Repeater (T4.4)
// @namespace    https://greasyfork.org/pt-BR/scripts/38479-travian-task-repeater-t4-4
// @version      0.0.4
// @description  Script that automatically repeat registred task (e.g., send farm list, train troops, etc.)
// @author       Hudson Silva Borges <hudsonsilbor[at]gmail.com>
// @grant        GM_getValue
// @grant        GM_setValue
// @include      *://*.travian.*
// @exclude      *://*.travian*.*/hilfe.php*
// @exclude      *://*.travian*.*/log*.php*
// @exclude      *://*.travian*.*/index.php*
// @exclude      *://*.travian*.*/anleitung.php*
// @exclude      *://*.travian*.*/impressum.php*
// @exclude      *://*.travian*.*/anmelden.php*
// @exclude      *://*.travian*.*/gutscheine.php*
// @exclude      *://*.travian*.*/spielregeln.php*
// @exclude      *://*.travian*.*/links.php*
// @exclude      *://*.travian*.*/geschichte.php*
// @exclude      *://*.travian*.*/tutorial.php*
// @exclude      *://*.travian*.*/manual.php*
// @exclude      *://*.travian*.*/ajax.php*
// @exclude      *://*.travian*.*/ad/*
// @exclude      *://*.travian*.*/chat/*
// @exclude      *://forum.travian*.*
// @exclude      *://board.travian*.*
// @exclude      *://shop.travian*.*
// @exclude      *://*.travian*.*/activate.php*
// @exclude      *://*.travian*.*/support.php*
// @exclude      *://help.travian*.*
// @exclude      *://*.answers.travian*.*
// @exclude      *.css
// @exclude     *.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.20.1/moment.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.5/lodash.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/URI.js/1.19.1/URI.min.js
// @downloadURL https://update.greasyfork.org/scripts/38479/Travian%20Task%20Repeater%20%28T44%29.user.js
// @updateURL https://update.greasyfork.org/scripts/38479/Travian%20Task%20Repeater%20%28T44%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ttr_account = $('.playerName').first().text().trim() + '@' + (new URI()).hostname();
    var ttr_schedule = JSON.parse(GM_getValue(ttr_account) || '[]');

    var ttr_last_refresh = GM_getValue('ttr_last_refresh');
    GM_setValue('ttr_last_refresh', moment().unix());

    var ttr_buildings = {
        smithy:  13,
        main: 15,
        rally_point: 16,
        barracks: 19,
        stable: 20,
    };

    var ttr_tasks = {
        smithy:      { name: 'SMITHY',    building: ttr_buildings.smithy },
        barracks:    { name: 'BARRACKS',  building: ttr_buildings.barracks },
        stable:      { name: 'STABLE',    building: ttr_buildings.stable },
        farm_list:   { name: 'FARM_LIST', building: ttr_buildings.rally_point, tab: 99 },
        demolish:    { name: 'DEMOLISH',  building: ttr_buildings.main },
    };

    var ttr_build = parseInt((new URI()).search(true).id);
    var ttr_build_gid = $('#build').attr('class') && $('#build').attr('class').split().reduce(function(id, c){ return c.startsWith('gid') ? parseInt(c.match(/\d+/g)[0]) : id; }, null);
    var ttr_village = parseInt((/newdid=(\d+)/g).exec($('#sidebarBoxVillagelist ul > li > a.active').first().attr('href'))[1]);
    var ttr_village_name = $('#sidebarBoxVillagelist ul > li > a.active > div.name').first().text().trim();


    /* * */
    var getResources = function() {
        return {
            wood: parseInt($('ul#stockBar #l1').text().trim().replace(/[,\.]/g, '')),
            clay: parseInt($('ul#stockBar #l2').text().trim().replace(/[,\.]/g, '')),
            iron: parseInt($('ul#stockBar #l3').text().trim().replace(/[,\.]/g, '')),
            crop: parseInt($('ul#stockBar #l2').text().trim().replace(/[,\.]/g, '')),
        };
    };

    /* * */
    var addInfoBox = function() {
        var tasks = _.orderBy(ttr_schedule, 'next', 'asc');
        var div = $('<div style="background-color:white;position:absolute;top:15px;left:15px;color:black;z-index:9999;padding:5px 15px;border:3px solid black;border-radius:10px;"></div>');
        div.append($('<span style="text-align:center;font-weight:bold;font-size: 15px;">TTR Tasks</span><hr style="margin: 5px 0;">'));
        if (tasks.length) {
            tasks.forEach(function(task, i) {
                var removeOption = $('<a style="color:red;padding-left:5px;font-weight:bold;" title="Remove this task">&#10008;</a>');
                removeOption.click(function(e){ e.preventDefault(); removeTask(task); window.location = window.location.href; });
                var small = $('<small> ' + _.capitalize(moment.unix(task.next).fromNow()) + ' </small>');
                setInterval(function(){ small.text(_.capitalize(moment.unix(task.next).fromNow())); }, 1000);
                var taskDiv = $('<span>' + task.type + ' | ' + task.name + '</span><br>');
                div.append(taskDiv).append($('<small>-- </small>')).append(small).append(removeOption);
                if (i < (tasks.length - 1)) div.append($('<hr style="margin: 5px 0;">'));
            });
        } else {
            div.append($('<span>NONE</span>'));
        }
        $('body').prepend(div);
    };

    /* * */
    var createButton = function(task, callback) {
        var styleBtn = 'style="padding: 0px 15px;font-size: 12px;font-weight:  bold;border: 1px solid #283308;position: relative;border-radius: 5px;margin-left:  15px;line-height: 25px;vertical-align: middle;"';
        var submitBtn;

        if (task) {
            submitBtn = $('<button ' + styleBtn + '><span style="color: green; font-weight: bold;">&#10004;</span> Repeater Enabled <small>(' + task.interval + ' minutes)</small></button>');
        } else {
            submitBtn = $('<button ' + styleBtn + '><span style="color: red; font-weight: bold;">&#10008;</span> Repeater Disabled</button>');
        }

        submitBtn.click(callback);
        return submitBtn;
    };

    /* * */
    var requestInterval = function() {
        var interval = parseInt(prompt('Enter the interval (in minutes):'));
        if (isNaN(interval) || interval < 0) { alert('Use only positive values!'); throw new Error('Invalid interval value!'); }
        return interval;
    };

    /* * */
    var requestDelay = function(defaultValue) {
        var delay = parseInt(prompt('Enter the delay (0 = start immediately):', defaultValue + ''));
        if (isNaN(delay) || delay < 0) { alert('Use only positive values!'); throw new Error('Invalid delay value!'); }
        return delay;
    };

    var addDemolishButton = function() {
        if (!onPage(ttr_buildings.main)) { return; }

        var repeaterBtn;

        var task = _.find(ttr_schedule, { id: ttr_village, type: ttr_tasks.demolish.name });

        if (task) {
            repeaterBtn = createButton(task, function(e) {
                e.preventDefault();
                removeTask({ id: ttr_village, type: ttr_tasks.demolish.name });
                window.location.reload();
            });
        } else {
            repeaterBtn = createButton(null, function(e) {
                e.preventDefault();
                if ($('table#demolish').length > 0 ) { alert('There is a demolition running.'); return; }

                var select = $('select#demolish');
                var option = select.find('option[value=' + select.val() + ']').first();

                var next = moment().add(requestDelay(0), 'minutes').unix();
                var name = '"' + option.text().match(/[\D\s]+\s\d+/g)[0].trim() + '"@' + ttr_village_name;
                var dname = option.text().match(/\d+([\D\s]+)/g)[0].trim();

                updateTask({ id: ttr_village, type: ttr_tasks.demolish.name, name: name, village: ttr_village, build: ttr_build, demolish: parseInt(select.val()), dname: dname, next: next, interval: 0 });
                window.location.reload();
            });
        }

        $('#build').append(repeaterBtn.css('margin', '5px 0 0 0'));
    };

    /* * */
    var addSmithyButton = function() {
        if (!onPage(ttr_buildings.smithy)) { return; }

        $('.research .information').each(function(index){
            if ($(this).find('.costs .showCosts').length == 0) { return; }
            $(this).append($('<div style="margin-top:15px;vertical-align:middle;"><label>Priority:</label> <input name="' + index + '" type="range" min="0" max="10" value="0"></div>'));
        });

        var repeatBtn;
        var task = _.find(ttr_schedule, function(t){ return (t.id == ttr_village && t.type == ttr_tasks.smithy.name); });

        if (task) {
            task.units.forEach(function(unit) {
                $('input[type=range][name=' + unit.index + ']').val(unit.priority);
            });

            repeatBtn = createButton(task, function(e) {
                e.preventDefault();
                removeTask({ id: ttr_village, type: ttr_tasks.smithy.name });
                window.location.reload();
            });
        } else {
            repeatBtn = createButton(null, function(e) {
                e.preventDefault();

                var units = [];
                $('input[type=range]').each(function() {
                    var input = $(this);
                    var name = $(input.closest('.information').find('.title a').get(1)).text().trim();
                    var priority = parseInt(input.val());
                    if (priority > 0) { units.push({ index: parseInt(input.attr('name')), name: name, priority: priority }); }
                });

                if (!units.length) { alert('Your must setup at least one unit to improve!'); return; }

                var interval = requestInterval(), delay = requestDelay(interval);
                var next = moment().add(delay, 'minutes').unix();

                var prefix = [units[0].name];
                if (units.length > 1) { prefix.push(('+' + (units.length - 1))); }
                var name = JSON.stringify(prefix) + '@' + ttr_village_name;

                updateTask({ id: ttr_village, type: ttr_tasks.smithy.name, name: name, village: ttr_village, build: ttr_build, units: units, next: next, interval: interval });
                window.location.reload();
            });
        }

        $('.researches').parent().append(repeatBtn.css('margin', '5px 0 0 0'));
    };

    /* * */
    var addTrainingButton = function() {
        var taskType;
        if (onPage(ttr_buildings.barracks)) { taskType = ttr_tasks.barracks; }
        if (onPage(ttr_buildings.stable)) { taskType = ttr_tasks.stable; }

        if (!taskType) { return; }

        var submitBtn;
        var task = _.find(ttr_schedule, function(t){ return (t.id == ttr_village && t.type == taskType.name); });

        if (task) {
            submitBtn = createButton(task, function(e) {
                e.preventDefault();
                removeTask({ id: ttr_village, type: taskType.name });
                window.location.reload();
            });
        } else {
            submitBtn = createButton(null, function(e) {
                e.preventDefault();

                var units = [];
                $('form[method=post] div.trainUnits div.action div.details').each(function(){
                    var unit = $($(this).find('div.tit a').get(1)).text().trim();
                    var input = $(this).find('input[type=text].text').first();
                    units.push({ unit: unit, name: input.attr('name'), value: parseInt(input.val()) });
                });

                var validUnits = units.filter(function(u){ return u.value > 0; });
                if (validUnits.length < 1) { alert('You have to train at least one unit.'); return; }

                var interval = requestInterval(), delay = requestDelay(interval);
                var next = moment().add(delay, 'minutes').unix();
                var name = JSON.stringify(validUnits.map(function(u){ return u.unit; })) + '@' + ttr_village_name;
                updateTask({ id: ttr_village, type: taskType.name, name: name, village: ttr_village, build: ttr_build, units: units, next: next, interval: interval });
                window.location.reload();
            });
        }

        $('button[type=submit].startTraining').first().after(submitBtn);
    };

    /* * */
    var addFarmListButton = function() {
        if (!onPage(ttr_buildings.rally_point) || $('#raidList').length == 0) { return; }

        $('div#raidList > div.listEntry').each(function(){
            var listElem = $(this);
            var id = listElem.attr('id');
            var name = listElem.find('form .listTitle .listTitleText').text().trim();

            var interval,submitBtn, btnAction;
            var styleBtn = 'style="padding: 0px 15px;font-size: 12px;font-weight:  bold;border: 1px solid #283308;position: relative;border-radius: 5px;margin-left:  15px;line-height: 25px;vertical-align: middle;"';

            var task = _.find(ttr_schedule, { id: id, type: ttr_tasks.farm_list.name });

            if (task) {
                submitBtn = createButton(task, function(e){
                    e.preventDefault();
                    removeTask({ id: id, type: ttr_tasks.farm_list.name });
                    window.location.reload();
                });
            } else {
                submitBtn = createButton(null, function(e){
                    e.preventDefault();
                    var interval = requestInterval(), delay = requestDelay(interval);
                    var next = moment().add(delay, 'minutes').unix();
                    updateTask({ id: id, type: ttr_tasks.farm_list.name, name: name, next: next, interval: interval });
                    window.location.reload();
                });
            }

            $(this).find('button[type=submit]').first().after(submitBtn);
        });
    };

    /* * */
    var isLoggedIn = function() {
        return $('#outOfGame .logout').length > 0;
    };

    /* * */
    var onPage = function(gid, villageId) {
        if (villageId) {
            return ttr_village == villageId && $('div#build.gid' + gid).length > 0;
        } else {
            return $('div#build.gid' + gid).length > 0;
        }
    };


    /* * */
    var updateTask = function(task) {
        var tasks = JSON.parse(GM_getValue(ttr_account) || '[]');
        var taskIndex = _.findIndex(tasks, function(t){ return t.id == task.id && t.type == task.type; });
        if (taskIndex >= 0) { tasks[taskIndex] = task; }
        else { tasks.push(task); }
        return GM_setValue(ttr_account, JSON.stringify(tasks));
    };

    /* * */
    var removeTask = function(task) {
        if (!task || !task.id || !task.type) { throw new Error('Invalid task data:', task); }
        var tasks = JSON.parse(GM_getValue(ttr_account) || '[]').filter(function(t){ return !(t.id == task.id && t.type == task.type); });
        return GM_setValue(ttr_account, JSON.stringify(tasks));
    };

    /* * */
    var getNextTask = function() {
        return _.chain(ttr_schedule).sortBy('next').first().value();
    };

    /* * */
    var changeVillage = function(id) {
        var links = $('#sidebarBoxVillagelist ul > li > a');
        if (!id) {
            links.get(_.random(0, links.length)).click();
        } else {
            var villageLink = links.filter(function(i, e){ return $(this).attr('href').indexOf('newdid=' + id) >= 0; }).first();
            if (villageLink) { villageLink.click(); }
            else { /* TODO - handle village not found */ }
        }
    };

    /* * */
    var trainTroops = function(task) {
        var gid;
        if (task.type == ttr_tasks.barracks.name) { gid = ttr_buildings.barracks; }
        if (task.type == ttr_tasks.stable.name) { gid = ttr_buildings.stable; }

        if (!onPage(gid, task.village)) {
            window.location = (new URI()).path('/build.php').search('newdid=' + task.village + '&id=' + task.build + '&gid=' + gid);
        } else {
            var unitsCosts = {};
            $('form[method=post] div.trainUnits div.action div.details').each(function(){
                var input = $(this).find('input[type=text].text').first();
                var ru1 = parseInt($(this).find('div.showCosts span.resources.r1').first().text().trim().replace(/[,\.]/g, ''));
                var ru2 = parseInt($(this).find('div.showCosts span.resources.r2').first().text().trim().replace(/[,\.]/g, ''));
                var ru3 = parseInt($(this).find('div.showCosts span.resources.r3').first().text().trim().replace(/[,\.]/g, ''));
                var ru4 = parseInt($(this).find('div.showCosts span.resources.r4').first().text().trim().replace(/[,\.]/g, ''));
                unitsCosts[input.attr('name')] = { r1: ru1, r2: ru2, r3: ru3, r4: ru4 };
            });

            var reduce = 0;
            var found = false;
            var unit, unitCount;
            var resources = getResources();

            do {
                var rn1 = 0;
                var rn2 = 0;
                var rn3 = 0;
                var rn4 = 0;
                for (var i = 0; i < task.units.length; i++) {
                    unit = task.units[i];
                    unitCount = reduce > unit.value ? 0 : (unit.value-reduce);
                    rn1 += (unitsCosts[unit.name].r1*unitCount);
                    rn2 += (unitsCosts[unit.name].r2*unitCount);
                    rn3 += (unitsCosts[unit.name].r3*unitCount);
                    rn4 += (unitsCosts[unit.name].r4*unitCount);
                }

                if (rn1 > resources.wood || rn2 > resources.clay || rn3 > resources.iron || rn4 > resources.crop) { reduce += 1; continue; }

                for (var j = 0; j < task.units.length; j++) {
                    unit = task.units[j];
                    unitCount = unit.value - reduce;
                    if (unitCount < 0) { unitCount = 0; }
                    $('form[method=post] div.trainUnits div.action div.details input[name=' + unit.name + ']').first().val(unitCount);
                }

                task.next = moment().add(task.interval + _.random(-1, 1, true), 'minutes').unix();
                updateTask(task);
                $('form[method=post] button[type=submit].startTraining').first().click();

                found = true;
            } while(!found);
        }
    };

    /* * */
    var sendFarmList = function(task) {
        if (!onPage(ttr_buildings.rally_point) || $('#raidList').length == 0) {
            window.location = (new URI()).path('/build.php').search('tt=99&id=39');
        } else {
            $('#' + task.id + ' table tr.slotRow').each(function(){
                if ($(this).find('.iReport.iReport2, .iReport.iReport3').length) { return; }
                $(this).find('.markSlot').first().click();
            });

            task.next = moment().add(task.interval + _.random(-1, 1), 'minutes').unix();
            updateTask(task);
            $('#' + task.id + ' button[type=submit]').first().click();
        }
    };

    /* * */
    var demolish = function(task) {
        if (!onPage(ttr_buildings.main, task.village)) {
            window.location = (new URI()).path('/build.php').search('newdid=' + task.village + '&id=' + task.build + '&gid=' + ttr_buildings.main);
        } else {
            var running = $('table#demolish span.timer').last();

            if (running && running.length) {
                task.next = moment().add(parseInt(running.attr('value')) + 10, 'seconds').unix();
                updateTask(task);
                window.location.reload();
            } else {
                var option = $('select#demolish option[value=' + task.demolish + ']').last();
                var tokens = option.text().trim().split(' ');
                var level = parseInt(tokens[tokens.length - 1]);

                if (level == 1) { removeTask({ id: task.id, type: task.type }); }

                $('select#demolish').val(task.demolish);
                $('form.demolish_building button[type=submit]').click();
            }
        }
    };

    /* * */
    var upgradeArmour = function(task) {
        if (!onPage(ttr_buildings.smithy, task.village)) {
            window.location = (new URI()).path('/build.php').search('newdid=' + task.village + '&id=' + task.build + '&gid=' + ttr_buildings.smithy);
        } else {
            var progress = $('table.under_progress tbody tr');
            var seconds = 4*60;

            if (progress.length) {
                seconds = parseInt(progress.last().find('span.timer').first().attr('value'));
            } else {
                var order = _.orderBy(task.units, 'priority', 'desc');
                var resources = getResources();

                for (var i = 0; i < order.length; i++) {
                    var input = $('input[type=range][name=' + order[i].index + ']').first();
                    var info = input.closest('.information');

                    var r1 = parseInt(info.find('span.resources.r1').first().text().trim().replace(/[,\.]/g, ''));
                    var r2 = parseInt(info.find('span.resources.r2').first().text().trim().replace(/[,\.]/g, ''));
                    var r3 = parseInt(info.find('span.resources.r3').first().text().trim().replace(/[,\.]/g, ''));
                    var r4 = parseInt(info.find('span.resources.r4').first().text().trim().replace(/[,\.]/g, ''));

                    if (r1 > resources.wood || r2 > resources.clay || r3 > resources.iron || r4 > resources.crop) { continue; }

                    info.find('button[type=button]').click();
                    return;
                }
            }

            task.next = moment().add(seconds + 60, 'seconds').unix();
            updateTask(task);
            window.location.reload();
        }
    };

    $( document ).ready(function() {
        if (!isLoggedIn()) { return; }

        addInfoBox();

        switch(ttr_build_gid) {
            case ttr_buildings.rally_point:
                addFarmListButton();
                break;
            case ttr_buildings.barracks:
            case ttr_buildings.stable:
                addTrainingButton();
                break;
            case ttr_buildings.smithy:
                addSmithyButton();
                break;
            case ttr_buildings.main:
                addDemolishButton();
                break;
            default:
                break;
        }

        var callback, task = getNextTask();
        var diff = (task && task.next) ? moment.unix(task.next).diff(new Date(), 'milliseconds') : 0;

        switch (task && task.type) {
            case ttr_tasks.farm_list.name:
                callback = function(){ sendFarmList(task); };
                break;
            case ttr_tasks.barracks.name:
            case ttr_tasks.stable.name:
                callback = function(){ trainTroops(task); };
                break;
            case ttr_tasks.smithy.name:
                callback = function(){ upgradeArmour(task); };
                break;
            case ttr_tasks.demolish.name:
                callback = function(){ demolish(task); };
                break;
            default:
                // TODO
        }

        setTimeout(function() {
            if (ttr_last_refresh && moment().diff(moment.unix(ttr_last_refresh)) > 5*1000 ) { window.location.reload(); }
            callback();
        }, Math.max(diff, 100));
    });
})();