// ==UserScript==
// @name         KittenManager
// @namespace    http://inithello.net/
// @version      1.1
// @description  Manage resources in bloodrizer's kittens game.
// @author       InitHello
// @license      CC-BY-NC-SA-4.0
// @supportURL   https://github.com/InitHello/greasemonkey/issues
// @match        http://bloodrizer.ru/games/kittens/
// @require      https://code.jquery.com/jquery-3.3.1.min.js#sha256=FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373285/KittenManager.user.js
// @updateURL https://update.greasyfork.org/scripts/373285/KittenManager.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

class KittenManagement {
    constructor() {
        this.resources = {};
        this.capless_resources = ['hunters', 'astronomers', 'log', 'furs']
        this.managed_resources = ['faith', 'science', 'culture', 'catnip', 'wood', 'minerals', 'coal', 'iron'];
        this.loadConfig();
        window.setTimeout(this.mainTick.bind(null, this), 2500);
    }

    checkResources() {
        let products = {catnip: ['wood'],
                        wood: ['beam'],
                        minerals: ['slab'],
                        iron: ['steel', 'plate'],
                        coal: ['steel'],
                        culture: ['manuscript'],
                        science: ['compendium', 'blueprint']};
        for (let resource in products) {
            let over = this.overThreshold(resource);
            if (over) {
                try {
                    var resname = products[resource];
                    this.game.craft(game.resPool.get(resname).name, 1);
                }
                catch (err) {
                    console.log(`Error crafting ${resname} (${typeof(resname)}): ${err}`);
                }
            }
        }
        try {
            let furs = this.game.resPool.get('furs');
            if (furs.value >= 175 && this.config.resource_management.furs.manage) {
                this.game.craft(game.resPool.get('parchment').name, 1);
            }
        }
        catch (err) {
            console.log(`Error checking furs: ${err}`);
        }
        let faith = this.game.resPool.get('faith');
        let faithcap = faith.maxValue * 0.95;
        if (faith.value >= faithcap) {
            this.game.religion.praise();
        }
    }

    getCap(resource) {
        let threshold = 1000;
        try {
            threshold = this.config.resource_management[resource.name].threshold;
        }
        catch (err) {
            console.log(`Error getting cap for ${resource}: ${err}`);
        }
        return threshold == 0 ? 0 : threshold / 100;
    }

    initialStartup() {
        let tab = ['<span> | </span>',
                   '<a href="#" id="KittenManager" class="tab" style="white-space: nowrap;">Tools</a>'].join('');
        let tabRow = $('#gameContainerId').find('div.tabsContainer');
        tabRow.append($(tab));
        $('#KittenManager').on('click', () => {
            this.showConfig();
        });
        let css = $(['<style type="text/css">',
                     '#custom-handle { width: 3em; height: 1.6em; top: 50%; margin-top: -.8em; text-align: center; line-height: 1.6em; }',
                     '.resourcecap { width: 2em; height: 12px; border: none; }',
                     '.management-tools { padding-left: 2px; float: right; cursor: pointer; }',
                     '</style>'].join(''));
        $(document.body).append(css);
    }

    loadConfig() {
        if (localStorage.getItem('KittenManager') !== null) {
            this.config = JSON.parse(localStorage.getItem('KittenManager'));
        }
        else {
            this.config = {logLevel: 0, resource_management: {}};
            for (let resource in this.capless_resources) {
                this.config.resource_management[this.capless_resources[resource]] = {manage: false};
            }
            for (let resource in this.managed_resources) {
                this.config.resource_management[this.managed_resources[resource]] = {manage: false, threshold: 80};
            }
            this.saveConfig();
        }
    }

    mainTick(self) {
        self.game = window.game;
        let child = $('#KittenManager');
        if (!child.length) {
            self.initialStartup();
        }
        let controller = $('#KittenManager');
        let hunters = self.config.resource_management.hunters.manage;
        let astro = self.config.resource_management.astronomers.manage;
        let log = self.config.resource_management.log.manage;
        self.checkResources();
        if (hunters && self.game.resPool.get('manpower').value >= 100) {
            self.game.village.huntAll();
        }
        if (astro && self.game.calendar.observeRemainingTime && !game.workshop.get("seti").researched) {
            self.game.calendar.observeHandler();
        }
        if (log) {
            $('#clearLogHref').click();
        }
        window.setTimeout(self.mainTick.bind(null, self), self.config.heartbeat);
    }

    managing(resource) {
        if (!this.config.resource_management.hasOwnProperty(resource.name)) {
            this.config.resource_management[resource.name] = {manage: false, threshold: 80};
            this.saveConfig();
        }
        return this.config.resource_management[resource.name].manage;
    }

    overThreshold(material) {
        let resource = this.game.resPool.get(material);
        let adj = 0;
        if (!this.managing(resource)) {
            return false;
        }
        let cap = this.getCap(resource);
        try {
            adj = resource.maxValue * cap;
        }
        catch (err) {
            console.log(`Error checking cap for ${resource.name}: ${err}`);
            return false;
        }
        if (resource.value >= adj) {
            return true;
        }
        return false
    }

    saveConfig() {
        localStorage.removeItem('KittenManager');
        localStorage.setItem('KittenManager', JSON.stringify(this.config));
    }

    setCap(resource, cap) {
        if (this.config.resource_management.hasOwnProperty(resource)) {
            if (this.config.resource_management[resource].hasOwnProperty('threshold')) {
                this.config.resource_management[resource].threshold = cap;
                this.saveConfig();
            }
            else {
                this.config.resource_management[resource] = {manage: false, threshold: cap};
            }
        }
    }

    showConfig() {
        let tab_contents = ['<div class="bldGroupContainer">'];
        $('.tab').removeClass('activeTab');
        $('#KittenManager').addClass('activeTab');
        for (let idx in this.capless_resources) {
            let resource = this.capless_resources[idx];
            if (this.config.resource_management.hasOwnProperty(resource)) {
                let enabled = this.config.resource_management[resource].manage ? 'on' : 'off';
                let chtclass = this.config.resource_management[resource].manage ? ' bldEnabled' : '';
                let label = resource[0].toUpperCase() + resource.slice(1);
                tab_contents = tab_contents.concat([
                         `<div id="cht-${resource}" class="btn nosel modern${chtclass}" style="position: relative; display: block; margin-left: auto; margin-right: auto;">`,
                         `<div class="btnContent" title=""><span>${label}</span>`,
                         '<span class="linkBreak" style="float: right; padding-left: 2px; margin-right: 1px;">|</span>',
                         `<a href="#" class="management-tools" data-item="${resource}" style="" title="Active">${enabled}</a>`,
                         '<span class="linkBreak" style="float: right; padding-left: 2px;">|</span></div></div>']);
            }
        }

        for (let idx in this.managed_resources) {
            let resource = this.managed_resources[idx];
            if (this.config.resource_management.hasOwnProperty(resource)) {
                let enabled = this.config.resource_management[resource].manage ? 'on' : 'off';
                let chtclass = this.config.resource_management[resource].manage ? ' bldEnabled' : '';
                let label = resource[0].toUpperCase() + resource.slice(1);
                let cap = this.config.resource_management[resource].threshold;
                tab_contents = tab_contents.concat([
                         `<div id="cht-${resource}" class="btn nosel modern${chtclass}" style="position: relative; display: block; margin-left: auto; margin-right: auto;">`,
                         `<div class="btnContent" title=""><span>${label}</span>`,
                         '<span class="linkBreak" style="float: right; padding-left: 2px; margin-right: 1px;">|</span>',
                         `<div style="float: right;"><input type="text" id="cap_${resource}" class="resourcecap" data-resource="${resource}" value="${cap}" /></div>`,
                         '<span class="linkBreak" style="float: right; padding-left: 2px; margin-right: 1px;">|</span>',
                         `<a href="#" class="management-tools" data-item="${resource}" style="" title="Active">${enabled}</a>`,
                         '<span class="linkBreak" style="float: right; padding-left: 2px;">|</span></div></div>']);
            }
        }
        tab_contents.push('</div>');
        let elm = $(tab_contents.join(''));
        let tabContents = $('#gameContainerId').find('div.tabInner');
        tabContents.html(elm);
        $('.resourcecap').on('change', ev => {
            let elm = $(ev.currentTarget);
            let item = elm.attr('data-resource');
            let newvalue = parseInt(elm.val());
            this.setCap(item, newvalue);
        });
        $('.management-tools').on('click', (ev) => {
            let elm = $(ev.currentTarget);
            let item = elm.attr('data-item');
            let isactive = this.config.resource_management[item];
            if (isactive.manage) {
                $('#cht-' + item).removeClass('bldEnabled');
                isactive.manage = false;
                this.config.resource_management[item] = isactive;
                this.saveConfig();
                elm.html('off')
            }
            else {
                $('#cht-' + item).addClass('bldEnabled');
                isactive.manage = true;
                this.config.resource_management[item] = isactive;
                this.saveConfig();
                elm.html('on')
            }
        });
    }
}


let $ = window.jQuery;


$(function() {
    'use strict';
    const kittenManagement = new KittenManagement();
});

