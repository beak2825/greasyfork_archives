// ==UserScript==
// @name         Hordes.io Extra Overlay - By AriusII
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  An extra overlay for Hordes.io, where you can add your own custom overlays(menus) and more.
// @author       AriusII - ╲⎝⧹ AriusII⧸⎠╱#4556  & Thanks xFuRiOuS#9356 for the help.
// @match        https://hordes.io/play
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://hordes.io&size=32
// @grant        none
// @namespace    https://greasyfork.org/users/898675
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/443143/Hordesio%20Extra%20Overlay%20-%20By%20AriusII.user.js
// @updateURL https://update.greasyfork.org/scripts/443143/Hordesio%20Extra%20Overlay%20-%20By%20AriusII.meta.js
// ==/UserScript==

class HomeMenu {
    constructor() {
        this.name = "HomeMenu"
        this.windowname = "home"
    }

    Init_SubMenu() {
        this.SubMenu_Home()
    }

    Init_MainFrame() {
        this.name
        this.MenuFrame_Home()
    }

    Init_Window(origin) {
        this.WindowSettings(origin)
    }

    /**
     * It inserts a div with the id "SubMenuHome" and the class "choice" into the div with the id "SubMenu".
     */
    SubMenu_Home() {
        document.getElementById("SubMenu").insertAdjacentHTML('beforeend',
            `<div id=${this.name} class="choice">Home</div>`)
    }

    /**
     * It inserts HTML into a div with the ID "MenuFrame".
     */
    MenuFrame_Home() {
        document.getElementById("MenuFrame").insertAdjacentHTML('beforeend',
            `<div class="slot svelte-yjs4p5">
				<div class="card">
					<div class="svelte-cbx1m">
						<div>
							<h1 class="textprimary">Hordes.io <span class="textsub"> Extra Overlay</span></h1>
							<div class="textwhite"><img class="svgicon" src="/assets/ui/icons/gem.svg?v=5699699"> Created by AriusII</div>
							<div class="textwhite"><img class="svgicon" src="/assets/ui/icons/check.svg?v=5699699"> <span class="old svelte-cbx1m">Yes Ads</span> <span class="textsub">NO</span> Ads</div>
							<div class="textwhite"><img class="svgicon" src="/assets/ui/icons/check.svg?v=5699699"> Auto AFK</div>
							<div class="textwhite"><img class="svgicon" src="/assets/ui/icons/check.svg?v=5699699"> Auto Loot</div>
							<div class="textwhite"><img class="svgicon" src="/assets/ui/icons/check.svg?v=5699699"> Bot</div>
							<div class="textwhite"><img class="svgicon" src="/assets/ui/icons/check.svg?v=5699699"> Auto Selling</div>
							<div class="textgrey">+ more to come (TBA)</div>
						</div>
					</div><small class="textgrey">Readme</small>
					<p class="textgrey">Welcome to my Extra Overlay.</p>
				</div>
			</div>`)
    }

    Options() {
        const Settings = {
            "HomeMenu": {
                "Ads": false
            }
        }
        return Settings
    }

    WindowSettings(origin) {
        window[this.windowname] = this.Options()
        let world = origin.match(/([_a-zA-Z0-9]*?)\.entities\.array\.length;/)[1]
        let coder = origin.match(/\,([_a-zA-Z0-9]*?)=\{clientPlayerInput:\{/)[1]
        let ws = origin.match(/\(([_a-zA-Z0-9]*?)=new WebSocket/)[1]
        let send = origin.match(/([_a-zA-Z0-9]*?)=[_a-zA-Z0-9]*?=>\{void 0!==[_a-zA-Z0-9]*?&&1===[_a-zA-Z0-9]*?&&[_a-zA-Z0-9]*?\.send\(.*?\)\}/)[1]
        origin = origin.replace('this.player=t', `Object.assign(window. ${this.windowname}, {world: ${world}, me:t, coder: ${coder}, ws: ${ws}, send: ${send} }), this.player=t`)
        return window.origin = origin
    }
}

class Core {
    constructor(add) {
        this.ShowUI = false
        this.AddonsList = add
    }

    /**
     * It fetches the game's HTML, replaces the script tag with a script tag that will run the game's code,
     * and then writes the HTML to the document.
     * 
     * The reason I'm doing this is because I want to add a button to the game's UI. I'm doing this by
     * adding a button to the HTML, and then using the game's code to make it do something.
     * 
     */
    Init() {
        document.write()
        fetch('https://hordes.io/play').then(d => d.text()).then(async html => {
            const element = html.match(/<script.*?client\.js.*?><\/script>/)[0]
            const url = element.match(/src="(.*?)"/)[1]
            html = html.replace(element, `<script>let _t=origin;delete origin;eval(_t)</script>`)
            let origin = await fetch(url).then(d => d.text())
            await Promise.resolve(this.LoadAddons_Window(origin))

            setInterval(() => {
                if (document.getElementById("uiBtn") == null) {
                    this.UISettingsButtonInBar()
                }
            }, 1000)

            document.open().write(html)
            document.close()
        })
    }

    /**
     * It creates a UI for the user to interact with.
     */
    CreateUI() {
        if (!this.ShowUI) {
            document.querySelector(".l-ui.layout > .container:first-child").insertAdjacentHTML('beforeend',
                `<div class="container svelte-ntyx09 MainBody">
                    <div class="window panel-black svelte-yjs4p5 MainSubMenu">
                        <div class="titleframe svelte-yjs4p5 MainFrameTitle">
                            <img src="https://www.svgrepo.com/show/284868/unsecured-shield-hacker.svg" class="titleicon svgicon svelte-yjs4p5">
                            <div class="textprimary title svelte-yjs4p5">
                                <div name="title">Extra Overlay Settings - By AriusII</div>
                            </div>
                            <img src="/assets/ui/icons/cross.svg?v=5699699" class="btn black svgicon CloseMain">
                        </div>
                        <div class="slot svelte-yjs4p5">
                            <div id="MainDiv" class="divide svelte-ntyx09">
                                <div id="SubMenu">
                                
                                </div>

                                <div id="MenuFrame" class="menu panel-black scrollbar svelte-ntyx09">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>`)
            this.LoadAddons_SubMenu()
            new HomeMenu().MenuFrame_Home()

            this.LoadAddons_Frame()

            document.querySelector('.CloseMain').addEventListener('click', e => this.CreateUI());
        } else {
            document.querySelector(".MainBody").remove()
        }
        this.ShowUI ^= 1
    }

    /**
     * It creates a button in the top bar of the page, and when clicked, it calls the CreateUI() function.
     * @returns true.
     */
    UISettingsButtonInBar() {
        document.querySelector(".svelte-1wol45y").insertAdjacentHTML('beforeend',
            `<div id="uiBtn" class="btn border black"><img class="svgicon" src="https://www.svgrepo.com/show/284868/unsecured-shield-hacker.svg"></div>`)
        document.querySelector("#uiBtn").addEventListener('click', e => this.CreateUI())
        return true
    }


    /**
     * It loops through the AddonsList array and calls the Init() function of each addon
     */
    LoadAddons_SubMenu() {
        this.AddonsList.forEach(addon => {
            return addon.Init_SubMenu()
        })
    }

    /**
     * It adds an event listener to each addon's submenu, and when clicked, it clears the menu frame and
     * inserts the addon's frame.
     */
    LoadAddons_Frame() {
        this.AddonsList.forEach(addon => {
            let SubMenu = document.getElementById(addon.name)
            SubMenu.addEventListener('click', e => {
                document.getElementById("MenuFrame").innerHTML = "";
                if (addon.Init_MainFrame() != undefined) {
                    document.getElementById('MenuFrame').insertAdjacentHTML('beforeend', addon.Init_MainFrame())
                }
            })
        })
    }

    /**
     * It's supposed to loop through an array of objects, and call a function in each object
     * @param origin - The origin of the window.
     */
    LoadAddons_Window(origin) {
        this.AddonsList.forEach(addon => {
            return Promise.resolve(addon.Init_Window(origin))
        })
    }
}

(function() {
    'use strict'
    const addons = [
        new HomeMenu(),
    ]
    new Core(addons).Init()
}())