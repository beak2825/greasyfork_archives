// ==UserScript==
// @name         Galaxy Browser
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Go find everything in the universe
// @author       Maxime VINCENT
// @match        https://www.origins-return.fr/univers-origins/galaxie.php
// @require      http://code.jquery.com/jquery-3.5.1.slim.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_log
// @downloadURL https://update.greasyfork.org/scripts/422072/Galaxy%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/422072/Galaxy%20Browser.meta.js
// ==/UserScript==

const CONST_MAX_DELAY = 500
const CONST_MIN_DELAY = 100

class SpyingTool {
    constructor() {
        this.name = 'Spying'
        this.GM_VAR_NAME = 'spyer_list_coo'
        this.listToSpy = []
        this.isActive = true
    }

    async init() {
        this.listToSpy = await Tools.get(this.GM_VAR_NAME, [])
    }

    async start() {
        let list = $('img[title="Envoyer une sonde"]').map(function () {
            return $(this).attr('onclick')
        }).get()
        this.listToSpy = list
        await Tools.set(this.GM_VAR_NAME, this.listToSpy)
    }

    isRunning() {
        return this.isActive && this.listToSpy.length > 0
    }

    async stop() {
        await Tools.set(this.GM_VAR_NAME, [])
    }

    async do() {
        let currentSpy = this.listToSpy.pop()
        if (!currentSpy)
            return false
        await Tools.set(this.GM_VAR_NAME, this.listToSpy)
        await Tools.randomDelay()
        eval(currentSpy)
        return true
    }
}

class ScavengerTool {
    constructor() {
        this.name = 'Scavenger'
        this.GM_VAR_NAME = 'scavenger_list_coo'
        this.listToScav = []
        this.isActive = true
    }

    async init() {
        this.listToScav = await Tools.get(this.GM_VAR_NAME, [])
    }

    async start() {
        let list = $('img[onclick*="envoi_vruines"]').map(function () {
            return $(this).attr('onclick')
        }).get()
        this.listToScav = list
        await Tools.set(this.GM_VAR_NAME, this.listToScav)
    }

    isRunning() {
        return this.isActive && this.listToScav.length > 0
    }

    async stop() {
        await Tools.set(this.GM_VAR_NAME, [])
    }

    async do() {
        let currentScav = this.listToScav.pop()
        if (!currentScav)
            return false
        await Tools.set(this.GM_VAR_NAME, this.listToScav)
        await Tools.randomDelay()
        eval(currentScav)
        return true
    }
}

class PNJFinderTool {
    constructor() {
        this.name = 'PNJFinder'
        this.GM_VAR_NAME = 'pnj_finder_list_coo'
        this.running = false
        this.list = []
        this.isActive = true
        this.pos = { 
            g : parseInt($('#galaxi2').val()),
            s : parseInt($('#system2').val())
        }
    }

    async init() {
        this.list = await Tools.get(this.GM_VAR_NAME, this.list)
        this.running = false
        this.start()
    }
    
    async start() {
        this.running = true
        let that = this
        $('tr td img[title="Contacter"]').each(function () {
            let pos = $(this).parents('tr').index() + 1
            let colName = $(this).parents('tr').find('td:nth-child(4) span:last-of-type').html()
            let id = parseInt($(this).attr('onclick').split('=')[1].split('\'')[0], 10)
            if (id > 1734900 && id < 1735050) {
                let coo = [that.pos.g, that.pos.s, pos].join(':') + `;${colName};${id}`
                if (that.list.indexOf(coo) < 0)
                    that.list.push(coo)
            }
        })
        await Tools.set(this.GM_VAR_NAME, this.list)
    }

    isRunning() {
        return this.isActive && this.running
    }

    async stop() {
        this.running = false
    }

    async do() {
        return false
    }

    async reset() {
        await Tools.set(this.GM_VAR_NAME, [])
    }

    displayColo(html, colo, i) {
        let cell = `<td>${colo}</td>`
        html += `</tr><tr class="${i % 2 == 1 ? 'tabligne1' : ''}" style="text-align:center">`
        return html + cell
    }

    display() {
        $('#galaxy-browser').after(`
        <br>
        <table width="600px" id="galaxy-result-pnj" class="tableau" cellspacing="0" cellpadding="0">
            <tbody>
                <tr class="tabligne2" style="text-align:center">
                    <td><b>Coordonées des PNJ</b></td>
                </tr>
                <tr class="" style="text-align:center">
                    ${this.list.reduce(this.displayColo, '')}
                </tr>
            
            </tbody>
        </table>
        `)
    }
}

class AllyFinderTool {
    constructor() {
        this.name = 'AllyFinder'
        this.GM_VAR_NAME = 'ally_finder_list_coo'
        this.running = false
        this.data = { tagToFind : '', list : []}
        this.isActive = true
        this.pos = { 
            g : parseInt($('#galaxi2').val()),
            s : parseInt($('#system2').val())
        }
    }

    async init() {
        this.data = await Tools.get(this.GM_VAR_NAME, this.data)
        this.running = false
    }

    async start() {
        this.running = true
        let that = this
        $('tr td span[onclick*="PageAlly"]').each(function () {
            let pos = $(this).parents('tr').index() + 1
            let colName = $(this).parents('tr').find('td:nth-child(4) span:last-of-type').html()
            if ($(this).parents('tr').find('td img[title="Contacter"]').length) {
                let id = parseInt($(this).parents('tr').find('td img[title="Contacter"]').attr('onclick').split('=')[1].split('\'')[0], 10)
                let tag = $(this).html().substr(1, $(this).html().length - 2)
                if (tag === that.data.tagToFind) {
                    let coo = [that.pos.g, that.pos.s, pos].join(':') + `;${colName};${id}`
                    if (that.data.list.indexOf(coo) < 0)
                        that.data.list.push(coo)
                }
            }
        })
        await Tools.set(this.GM_VAR_NAME, this.data)
    }

    isRunning() {
        return this.isActive && this.running
    }

    async stop() {
        this.running = false
    }

    async do() {
        return false
    }

    async reset() {
        await Tools.set(this.GM_VAR_NAME, { tagToFind : '', list : []})
    }

    async setTag() {
        this.data.tagToFind = $('#tag-find').val()
        await Tools.set(this.GM_VAR_NAME, this.data)
    }

    displayColo(html, colo, i) {
        let cell = `<td>${colo}</td>`
        html += `</tr><tr class="${i % 2 == 1 ? 'tabligne1' : ''}" style="text-align:center">`
        return html + cell
    }

    display() {
        $('#galaxy-browser').after(`
        <br>
        <table width="600px" id="galaxy-result" class="tableau" cellspacing="0" cellpadding="0">
            <tbody>
                <tr class="tabligne2" style="text-align:center">
                    <td><b>Coordonées des [${this.data.tagToFind}]</b></td>
                </tr>
                <tr class="" style="text-align:center">
                    ${this.data.list.reduce(this.displayColo, '')}
                </tr>
            
            </tbody>
        </table>
        `)
    }
}

const AllPlugins = {
    Spying : SpyingTool,
    Scavenger : ScavengerTool,
    AllyFinder : AllyFinderTool,
    PNJFinder : PNJFinderTool
}

class Browser {
    constructor() {
        this.g = parseInt($('#galaxi2').val())
        this.s = parseInt($('#system2').val())
        this.GM_VAR_NAME = 'browser_is_running'
        this.GM_PLUGIN_ID = 'current_plugin_id'
        this.GM_PLUGIN_ACTIVE = 'list_plugin_activ'
        this.currentPlugin = 0
        this.plugins = [new ScavengerTool(), new SpyingTool(), new AllyFinderTool(), new PNJFinderTool()]
    }

    displayMenu() {
        const startButton = `<input type="button" id="start-browser" value="Start" />`
        const stopButton = `<input type="button" id="stop-browser" value="Stop" />`
        $('#galaxiform').after(`
            <br>
            <table width="600px" id="galaxy-browser" class="tableau" cellspacing="0" cellpadding="0">
                <tbody>
                    <tr class="tabligne2" style="text-align:center">
                        <td colspan="10"><b>Parcourir l'univers</b></td>
                    </tr>
                    <tr class="tabligne1">
                        <td width="20%" style="text-align:center">${startButton}</td>
                        <td width="3%"><input class="checkbox plugin-choice" id="Spying" type="checkbox" value="Spying" ${this.isPluginActive('Spying') ? 'checked=checked' : ''} name="plugin-choice"></td>
                        <td width="17%"><label for="Spying">Espionnage</label></td>
                        <td width="3%"><input class="checkbox plugin-choice" id="Scavenger" type="checkbox" value="Scavenger" ${this.isPluginActive('Scavenger') ? 'checked=checked' : ''} name="plugin-choice"></td>
                        <td width="17%"><label for="PNJFinder">Trouver les PNJ</label></td>
                        <td width="3%"><input class="checkbox plugin-choice" id="PNJFinder" type="checkbox" value="Scavenger" ${this.isPluginActive('PNJFinder') ? 'checked=checked' : ''} name="plugin-choice"></td>
                        <td width="17%"><label for="Scavenger">Recyclage</label></td>
                        <td width="3%"><input class="checkbox plugin-choice" id="AllyFinder" type="checkbox" value="AllyFinder" ${this.isPluginActive('AllyFinder') ? 'checked=checked' : ''} name="plugin-choice"></td>
                        <td width="6%"><label for="AllyFinder">Tag</label></td>
                        <td width="5%"><input id="tag-find" type="text" value="${this.getPlugin('AllyFinder').data.tagToFind}" name="tag-find"></td>
                        <td width="3%"><input id="tag-find-reset" type="button" value="reset"></td>
                        <td width="20%" style="text-align:center">${stopButton}</td>
                    </tr>
                </tbody>
            </table>
            `)
            this.getPlugin('AllyFinder').display()
            this.getPlugin('PNJFinder').display()
            $('#tag-find-reset').on('click', async () => { await this.getPlugin('AllyFinder').reset(); await this.getPlugin('PNJFinder').reset()})
            $('#tag-find').on('change', async () => { await this.getPlugin('AllyFinder').setTag()})
            $('.plugin-choice').on('click', async () => { await this.updatePlugins() })
            $('#start-browser').on('click', async () => { await this.start() })
            $('#stop-browser').on('click', async () => { await this.stop() })
    }

    isPluginActive(name) {
        return this.getPlugin(name) !== null ? this.getPlugin(name).isActive : false
    }

    getPlugin(name) {
        let plugin = this.plugins.find((p) => p.name === name)
        return !plugin ? null : plugin
    }

    async updatePlugins() {
        let that = this
        this.plugins.map((p) => p.isActive = false)
        $('.plugin-choice:checkbox[name=plugin-choice]:checked').each(function() {
            that.getPlugin($(this).val()).isActive = true
       })
       await Tools.set(this.GM_PLUGIN_ACTIVE, this.plugins)
    }

    async init() {
        this.plugins = (await Tools.get(this.GM_PLUGIN_ACTIVE, this.plugins)).map((p) => {
            let p2 = new AllPlugins[p.name]
            p2.isActive = p.isActive
            return p2
        })
        await Promise.all(this.plugins.map(async (plugin) => plugin.init()))
        this.currentPlugin = await Tools.get(this.GM_PLUGIN_ID, 0)
        this.running = await Tools.get(this.GM_VAR_NAME, 0)
    }

    async start() {
        this.running = 1
        await Tools.set(this.GM_VAR_NAME, this.running)
        await this.plugins[this.currentPlugin].start()
        await this.do()
    }

    async do() {
        if (!this.plugins[this.currentPlugin].isRunning()) {
            await this.nextPlugin()
        }
        if (!await this.plugins[this.currentPlugin].do()) {
            await this.reset()
            await this.goNext()
        }
    }

    async nextPlugin() {
        await this.plugins[this.currentPlugin].stop()
        this.currentPlugin += 1
        if (this.currentPlugin >= this.plugins.length) {
            await this.reset()
            return await this.goNext()
        }
        if (!this.plugins[this.currentPlugin].isActive)
            return await this.nextPlugin()
        await this.plugins[this.currentPlugin].start()
        await Tools.set(this.GM_PLUGIN_ID, this.currentPlugin)
    }

    async reset() {
        this.currentPlugin = 0
        await Tools.set(this.GM_PLUGIN_ID, this.currentPlugin)
    }

    async stop() {
        await this.reset()
        await Tools.set(this.GM_VAR_NAME, 0)
    }

    async goNext() {
        await this.reset()
        if (this.g > 72)
            return await this.stop()
        await Tools.randomDelay(5)
        galaxi_envoi(this.g, this.s + 1)
    }

    async goPrev() {
        await this.reset()
        galaxi_envoi(this.g, this.s - 1)
    }

    async isRunning() {
        return this.running
    }

    async launch() {
        if (this.g > 72)
            await this.stop()
        if (await this.isRunning())
            await this.do()
    }
}

class Tools {
    static async get(name, defaultValue = '') {
        return JSON.parse(await GM_getValue(name, JSON.stringify(defaultValue)))
    }

    static async set(name, value) {
        return await GM_setValue(name, JSON.stringify(value))
    }

    static async del(name) {
        return await GM_deleteValue(name)
    }

    static getRandomDelay() {
        return Math.random() * (CONST_MAX_DELAY - CONST_MIN_DELAY) + CONST_MIN_DELAY;
    }

    static async randomDelay(div = 1) {
        await new Promise(resolve => setTimeout(resolve, Tools.getRandomDelay() / div))
    }
}

(async function() {
    'use strict';

    let browser = new Browser()
    await browser.init()
    browser.displayMenu()
    await browser.launch()
})();