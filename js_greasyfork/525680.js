// ==UserScript==
// @name           Enhanced Visuals: improves your visuals making the experience better!
// @version        v-3.5
// @description    Adds better Visuals to Sploop.io! Such Item effects, perfect hitbox, shadows, footsteps, weapon range, and more!

// @namespace      EHD
// @license        All Rights Reserved
// @author         Cubic Flex [CF]
// @match          *://sploop.io/
// @grant          none
// @icon           https://cdn.glitch.global/499d2ba6-cd57-4e5f-8b56-5557baa5b3a0/EHD%20Visuals.png?v=1709777562902
// @downloadURL https://update.greasyfork.org/scripts/525680/Enhanced%20Visuals%3A%20improves%20your%20visuals%20making%20the%20experience%20better%21.user.js
// @updateURL https://update.greasyfork.org/scripts/525680/Enhanced%20Visuals%3A%20improves%20your%20visuals%20making%20the%20experience%20better%21.meta.js
// ==/UserScript==

/*!
 * Enhanced Visuals [*Free Version] v3.5.1
 * https://discord.gg/aZGuQmrm8z
 *
 * Auto save features
 * Mouse over for tooltips (feature description)
 * Hold click to settings menu
 *
 * More info at:
 * https://io-mods.glitch.me/
 *
 * Made By: Cubic Flex [CF] | 10/11/2024 (mmddyy)
 */

//[=]=> Util functions
class MouseManager {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.resize();
    }

    listeners() {
        window.addEventListener('mousemove', this.move.bind(this));
        window.addEventListener('resize', this.resize.bind(this));
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.update();
    }

    move(e) {
        this.x = e.clientX;
        this.y = e.clientY;

        this.update();
    }

    update() {
        this.angle = Math.atan2(this.y - this.height / 2, this.x - this.width / 2);
    }
}

class Img extends Image {
    constructor(src, width = 150, height = 150) {
        super(width, height);

        this.src = src;
    }
}

class Utils {
    static distance(player1, player2) {
        return Math.sqrt(Math.pow(player2.y - player1.y, 2) +
                         Math.pow(player2.x - player1.x, 2));
    }

    static lerp(start, end, amt) {
        return start + (end - start) * amt;
    }

    static try_parse(STRING) {
        try {
            return JSON.parse(STRING);
        } catch {
            return 'Failed to PARSE'
        }
    }

    static ls_get(key) {
        const got = localStorage[key];

        return got ? this.try_parse(got) : false;
    }

    static ls_set(key, value) {
        localStorage[key] = typeof value === 'string' ? value : JSON.stringify(value);
    }
}

class Tooltip {
    static show(id, title) {
        const TIP = document.querySelector('#tooltip-menu');
        const feature = All_features[id];

        TIP.style.opacity = '1';
        TIP.innerHTML = title || feature.info;
        TIP.style.left = Mouse.x + 'px';
        TIP.style.top = Mouse.y + 'px';
    }

    static hide() {
        const TIP = document.querySelector('#tooltip-menu');

        TIP.style.opacity = '0';
    }
}

//[=]=> Variables def.
const server = {
    request_received: 17,
    entity_spawned: 32,
    items_upgrade: 2,
    items_count: 36,
    ping_update: 15,
    create_clan: 24,
    update_clan: 16,
    entity_chat: 30,
    leave_clan: 27,
    update_age: 8,
    item_hit: 29,
    upgrades: 14,
    spawned: 35,
    killed: 28,
    update: 20,
    died: 19
}

const All_features = {
    colored_hp: {
        name: 'Colored HP',
        info: 'Colors your health bar',
        icon: 'palette-fill',
        enabled: true
    },
    display_hp: {
        name: 'Display HP',
        info: 'Shows how many hp you have',
        icon: 'percent',
        enabled: true
    },
    smooth_hp: {
        name: 'Smooth HP',
        info: 'Makes the health bar smoother',
        icon: 'water',
        enabled: true
    },
    healing_effect: {
        name: 'Healing effect',
        info: 'Particles come out when heal',
        icon: 'apple',
        enabled: true
    },
    weapon_range: {
        name: 'Weapon range',
        info: 'Shows weapon range',
        icon: 'opencollective',
        enabled: true
    },
    hitbox: {
        name: 'Hitbox',
        info: 'Shows objects hitbox',
        icon: 'disc',
        enabled: false
    },
    tornado_particles: {
        name: 'Tornado particles',
        info: 'Adds particles to tornadoes',
        icon: 'tornado',
        enabled: true
    },
    footsteps: {
        name: 'Footsteps',
        info: 'Shows footsteps',
        icon: 'meta',
        enabled: true
    },
    hide_ads: {
        name: 'Hide ads',
        info: 'Hide ads from the game menu',
        icon: 'eye-slash-fill',
        enabled: true
    },
    night_mode: {
        name: 'Night mode',
        info: 'Night mode in sploop',
        icon: 'moon-stars-fill',
        enabled: false
    },
    name_changer: {
        name: 'Name changer',
        info: 'Changes the mob names',
        icon: 'marker-tip',
        enabled: false
    }
}

const Features = Utils.ls_get('ehd_features') || {
    colored_hp: true,
    display_hp: true,
    smooth_hp: true,
    healing_effect: true,
    weapon_range: true,
    hitbox: false,
    tornado_particles: true,
    footsteps: true,
    hide_ads: true,
    night_mode: false,
    name_changer: false
}

const Settings = Utils.ls_get('ehd_settings') || {
    colored_hp: {
        mine_health: '#611a80',
        enemy_health: '#ae6999'
    },
    weapon_range: {
        color: '#404040',
        cap: true
    },
    hitbox: {
        color: '#50C878'
    },
    footsteps: {
        land: false
    },
    name_changers: {
        Wolf: 'Dog',
        Dragon: 'Boss',
        Duck: 'Quack'
    }
}

for (const key in All_features) {
    if (All_features.hasOwnProperty(key)) {
        if (!Features.hasOwnProperty(key)) {
            Features[key] = All_features[key].enabled;
        }
    }
}

const Vars = {
    loaded: false,
    entities: [],
    steps: [],
    heals: [],
    health: false,
    images: {
        cookie: new Img('https://sploop.io/img/entity/cookie.png'),
        apple: new Img('https://sploop.io/img/entity/apple.png')
    },
    holds: {}
}

//[=]=> Menu functions
class MenuManager {
    static parseID(id) {
        const value = id.children[1].innerHTML;

        return value.replace(/ /g, '_').toLowerCase();
    }

    static parseSetting(element) {
        const value = element.parentElement.parentElement;
        const feature = value.parentElement.classList[1].replace(/settings\-/g, '');

        return {
            feature,
            id: value.classList[2]
        }
    }

    static removeNC(element) {
        const name = element.parentElement.children[1].children[0];
        const value = name.innerHTML;

        // Cleans the input values, adds it to the settings & close the "dropdown"
        delete Settings.name_changers[value];

        // Then append the replacers again lm4o
        this.appendReplacer()
    }

    static addNC(element) {
        const inputs = element.parentElement.children[1].children;
        const name = inputs[0];
        const replace = inputs[2];

        if (name.value.trim().length < 1) return name.focus();
        if (replace.value.trim().length < 1) return replace.focus();

        // Cleans the input values, adds it to the settings & close the "dropdown"
        Settings.name_changers[name.value] = replace.value;

        document.querySelector('.button-plus').click() //MenuManager.toggleNewNC(this);

        name.value = '';
        replace.value = '';

        // Then append the replacers again lm4o
        this.appendReplacer()
    }

    static appendReplacer() {
        // Appends each name changer
        let string = '';

        for (let name in Settings.name_changers) {
            const change = Settings.name_changers[name];

            string += `
                <div class="name-changer">
                    <i class="text bi bi-trash-fill" onclick="MenuManager.removeNC(this)"></i>

                    <div class="name-changes">
                        <span>${name}</span>
                        <i class="bi bi-arrow-left-right"></i>
                        <span> ${change} </span>
                    </div>
                </div>
            `;
        }

        document.querySelector('#name-changer-wrap').innerHTML = string;
    }

    static changeIcon(element, over, icon, remove) {
        setTimeout(() => {
            element.classList = `bi bi-${icon}`
        }, 1e3 / 60)
    }

    static toggleNewNC(element) {
        // Display / hide
        const edit = document.querySelectorAll('.edit');
        const display = edit[0].style.display === 'flex' ? 'none' : 'flex';
        const icon = edit[0].style.display === 'flex' ? 'bi bi-plus' : 'bi bi-dash';

        edit.forEach(edit => {
            edit.style.display = display;
        });

        // Focus the input
        const input = document.querySelector('.name-changes').children[0];
        input.focus();

        // Change this icon
        element.children[0].classList = icon;
    }

    static searchParent(element, parentClass) {
        function repeat(elem) {
            if (!elem || !elem.parentElement) {
                return null;
            }

            const contains = elem.parentElement.classList.contains(parentClass);

            if (contains) {
                return elem.parentElement;
            } else {
                return repeat(elem.parentElement);
            }
        }

        return repeat(element);
    }

    static enable(element, id, enabled, disabled) {
        const { feature } = this.parseSetting(element);
        const Setting = Settings[feature][id];

        Settings[feature][id] = element.checked;

        if (!enabled) return;

        const parent = this.searchParent(element, 'switch')
        const icon = parent.querySelector('i');

        icon.classList = `bi bi-${element.checked ? enabled : disabled}`
    }

    static changeColor(element) {
        // Remove all balls active class & add it to self
        const balls = element.parentElement.children;

        for (let ballID in balls) {
            const ball = balls[ballID];

            if (ball.classList?.contains('color-ball')) {
                ball.classList.remove('active');
            }
        }

        element.classList.add('active')

        // Now apply the color to the settings
        const { feature, id } = this.parseSetting(element);

        Settings[feature][id] = element.style.backgroundColor;
    }

    static colorPicker(element) {
        // First apply the color to the settings
        const { feature, id } = this.parseSetting(element);

        Settings[feature][id] = element.value;

        // Then change the color in the ball
        const balls = element.parentElement.parentElement.children[0].children;

        for (let ballID in balls) {
            const ball = balls[ballID];

            if (ball.classList?.contains('picker-div')) {
                ball.style.backgroundColor = element.value
                ball.classList.add('active')
            } else if (ball.classList?.contains('color-ball')) {
                ball.classList.remove('active')
            }
        }

        // Make this element active
    }

    static ToggleToolTip(raw_id, hovering) {
        const id = this.parseID(raw_id);

        if (!hovering) {
            Tooltip.hide()
            return;
        }

        Tooltip.show(id);
    }

    static display(menu, toggle, trigger) {
        menu.style.display = toggle ? 'block' : 'none';

        setTimeout(() => {
            trigger || this.s_opacity(menu, toggle, true);
        }, trigger ? 80 : 0);
    }

    static s_opacity(menu, toggle, trigger) {
        menu.style.opacity = toggle ? '1' : '0';

        setTimeout(() => {
            trigger || this.display(menu, toggle, true);
        }, trigger ? 0 : 400);
    }

    static toggleSelector() {
        // frist change the text to select feture
        document.querySelector('.settings-icon').classList = `bi bi-sliders2 settings-icon`;
        document.querySelector('.settings-name').innerHTML = 'Select a feature';

        // THEN open the selector andclose body
        document.querySelector('.settings-selector').style.display = 'flex';
        document.querySelector('.settings-body').style.display = 'none';
    }

    static toggleSettings(raw_id, toggle) {
        const id = toggle && this.parseID(raw_id);
        const menu = document.querySelector('#settings-menu');

        toggle ? this.display(menu, toggle) : this.s_opacity(menu, toggle);

        if (!toggle) return;
        // ok if its opening then: append the name and info to the menu
        const { icon, name } = All_features[id];
        document.querySelector('.settings-icon').classList = `bi bi-${icon} settings-icon`;
        document.querySelector('.settings-name').innerHTML = name;

        // First closes "all feature settings" div then open the settings div
        document.querySelector('.settings-selector').style.display = 'none';
        document.querySelector('.settings-body').style.display = 'block';

        // After open the div card, if it has a card then open the card if not open the error card kk
        const setting_divs = document.querySelectorAll('.setting');
        const error = document.querySelector('.settings-undefined');

        setting_divs.forEach(div => {
            div.style.display = 'none'; // also clsoes all the opened cards
        })

        const setting = document.querySelector(`.settings-${id}`);
        (setting || error).style.display = 'block';
    }

    static ToggleFeature(raw_id, holding) {
        if (holding) {
            Vars.holds[raw_id] = Date.now();
            return;
        }

        // Handle MouseUp
        const date = Date.now() - Vars.holds[raw_id];

        if (date > 200) { // Holding
            this.toggleSettings(raw_id, true)
            return;
        }

        const id = this.parseID(raw_id);

        Features[id] = !Features[id];

        // Add the active class
        const setting = document.querySelector(`.setting-div-${id}`);
        const toggle = Features[id] ? 'add' : 'remove';

        raw_id.classList[toggle]('active')
        setting.classList[toggle]('active')
    }

    static minimize(element) {
        const menu = document.querySelector('#ehd-menu');
        const minimized = menu.style.width === '4.6vw';

        element.style.rotate = !minimized ? '0deg' : '180deg'; // rotate the arrow
        menu.style.width = minimized ? '16vw' : '4.6vw'; // adjust width

        menu.classList[minimized ? 'remove' : 'add']('minimized'); // then just add / remove the minimized class
    }

    static opacity(element) {
        const checked = element.checked;
        const color = checked ? 'rgb(255 255 255 / .25)' : 'transparent';

        document.querySelector('#ehd-menu').style.opacity = checked ? '.6' : '1';
        document.querySelector('#transparency').parentElement.style.backgroundColor = color;
    }
}

//[=]=> Css !
const CSS = document.createElement('style');
      CSS.innerHTML = `
          @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css");

          :root {
              --main: #242527;
              --softer: #3a3b3d;
              --color: #dedee0;
              --gray: #a6a7a9;

              --light-gray: #3a3b3d;

              --text: url(img/ui/cursor-text.png) 16 0, text;
              --default: url(img/ui/cursor-default.png) 2 0, default;
              --pointer: url(img/ui/cursor-pointer.png) 6 0, pointer;
              --index: 100000000;
          }

          * {
              transition: all 0.4s ease;
              transition-duration: .4s /* lmao=? */
          }

          @keyframes glow {
              0% {
                  box-shadow: 0 0 20px -1.1vw rgba(255, 255, 255, 0.9);
              }

              50% {
                  box-shadow: 0 0 40px -1.1vw rgba(255, 255, 255, 0.9);
              }

              100% {
                  box-shadow: 0 0 20px -1.1vw rgba(255, 255, 255, 0.9);
              }
          }

          @keyframes rotate {
              0% {
                  transform: scale(1) rotateY(0deg)
              }

              50% {
                  transform: scale(1.15) rotateY(180deg)
              }

              100% {
                  transform: scale(1) rotateY(0deg)
              }
          }

          @keyframes rotateDeg {
              0% {
                  rotate: 0deg
              }

              50% {
                  rotate: 360deg
              }

              100% {
                  rotate: 0deg
              }
          }

          .ehd_scrollBar::-webkit-scrollbar,
          .ehd_scrollBar *::-webkit-scrollbar {
              height: 7px;
              width: 7px;
          }

          .ehd_scrollBar::-webkit-scrollbar-track,
          .ehd_scrollBar *::-webkit-scrollbar-track {
              border-radius: 5px;
              background-color: transparent;
          }

          .ehd_scrollBar::-webkit-scrollbar-track:hover,
          .ehd_scrollBar *::-webkit-scrollbar-track:hover {
              background-color: #B8C0C2;
          }

          .ehd_scrollBar::-webkit-scrollbar-track:active,
          .ehd_scrollBar *::-webkit-scrollbar-track:active {
              background-color: #B8C0C2;
          }

          .ehd_scrollBar::-webkit-scrollbar-thumb,
          .ehd_scrollBar *::-webkit-scrollbar-thumb {
              border-radius: 5px;
              background-color: #5E5E5E;
          }

          .ehd_scrollBar::-webkit-scrollbar-thumb:hover,
          .ehd_scrollBar *::-webkit-scrollbar-thumb:hover {
              background-color: #474747;
          }

          .ehd_scrollBar::-webkit-scrollbar-thumb:active,
          .ehd_scrollBar *::-webkit-scrollbar-thumb:active {
              background-color: #7F7F7F;
          }

          #ehd-menu {
              overflow: hidden;
              background-color: var(--main);
              z-index: var(--index);
              position: fixed;
              left: 1.5vw;
              top: 1.5vw;
              width: 16vw;
              height: 32vw;
              border-radius: .7vw;
              display: flex;
              flex-direction: column;
              box-shadow: 0px 0px 6px 0px black
          }

          #ehd-menu.minimized .body {
              overflow: hidden /* idk, why can you scroll while minimized? no sense ig */
          }

          #ehd-menu.minimized .checkbox,
          #ehd-menu.minimized span {
              font-size: 0vw;
              width: 0vw !important
          }

          #ehd-menu.minimized .menu-size {
              margin-left: 2.8vw
          }

          #ehd-menu div {
              width: 100%;
          }

          #ehd-menu .header {
              height: 16%;
              padding: 1vw;
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              align-items: center;
          }

          #ehd-menu .body {
              padding: 1vw;
              height: 60%;
              overflow: scroll;
              overflow-x: hidden
          }

          #ehd-menu .footer {
              border-top: 1px solid #47484a;
              padding: 1vw;
              height: max-content
          }

          .header img {
              width: 2.8vw;
              margin-right: .8vw;
              border-radius: 0.4vw
          }

          .header span {
              color: var(--color);
          }

          .header-holder {
              display: flex;
              flex-direction: column
          }

          .header-holder span {
              font-weight: 700;
              font-size: .9vw
          }

          .description {
              color: var(--gray) !important;
              font-size: .8vw !important
          }

          .menu-button {
              margin-bottom: .3vw;
              height: max-content;
              padding: 0.7vw;
              display: flex;
              flex-direction: row;
              align-items: center;
              text-align: left;
              color: var(--color);
              border-radius: 0.4vw;
              overflow: hidden
          }

          .menu-button:hover {
              background: rgb(255 255 255 / .05);
          }

          .menu-button.active {
              background: rgb(255 255 255 / .15);
          }

          .menu-button i,
          .menu-button span {
              margin-right: .7vw;
              font-weight: 600;
              font-size: 1.2vw
          }

          .menu-button span {
              font-size: 0.9vw
          }

          .menu-button,
          .menu-button * {
              cursor: var(--pointer);
          }

          .separator {
              display: flex;
              align-items: center;
          }

          .switch {
              display: flex;
              min-width: 2vw;
              justify-content: space-between;
          }

          .switch * {
              cursor: var(--pointer)
          }

          .switch input[type="checkbox"] {
              opacity: 0;
              position: fixed
          }

          .checkbox {
              display: block;
              width: 2.5vw !important;
              height: 1vw;
              border-radius: 20vw;
              background-color: white;
          }

          .switch .checkbox::before {
              content: '';
              display: block;
              width: 0.8vw;
              height: 0.8vw;
              border-radius: 50%;
              margin: .1vw;
              background-color: var(--main);
              transition: margin-left 0.3s ease
          }

          .switch input[type="checkbox"]:checked + .checkbox::before {
              margin-left: 1.15vw
          }

          .menu-size {
              background-color: var(--light-gray);
              position: fixed;
              border-radius: 50%;
              width: 1.7vw !important;
              height: 1.7vw;
              margin-left: 14vw;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
              font-weight: bolder;
              font-size: 1vw;
              cursor: var(--pointer);
              text-shadow: 0px 0px 1px white;
              box-shadow: 0px 0px 2px black;
              rotate: 180deg
          }

          .menu-size i {
              cursor: var(--pointer);
              color: white;
          }

          #tooltip-menu {
              position: fixed;
              top: 100px;
              left: 220px;
              pointer-events: none;
              background-color: #1d1e1f;
              color: white;
              font-family: 'Baloo Paaji';
              font-weight: 300;
              z-index: calc(var(--index) + 10);
              border-radius: 0.4vw;
              height: 2.8vw;
              padding: 0.4vw 1vw;
              box-shadow: 0px 0px 6px var(--main);
          }

          #settings-menu,
          .night-card {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: radial-gradient(transparent, rgb(0 0 0 / .6));
              pointer-events: none;
              z-index: calc(var(--index) - 1);
          }

          #settings-menu {
              display: none;
              opacity: 0;
              background: none;
              background-color: rgb(0 0 0 / .4);
              z-index: calc(var(--index) + 2);
              pointer-events: all
          }

          #settings-menu .container {
              display: flex;
              flex-direction: column;
              width: 30%;
              height: 60%;
              margin: 10% auto;
              background: var(--main);
              border-radius: .7vw;
              padding: 1.5vw;
              box-shadow: 0px 0px 6px 0px var(--main)
          }

          #main-content {
              width: max-content
          }

          .settings-header {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              margin-bottom: 0.5vw
          }

          .settings-header * {
              font-size: 2.7vw;
              font-weight: 700;
              color: var(--color);
          }

          .feature-container {
              display: flex;
              flex-direction: column;
              justify-content: center;
          }

          .feature-container * {
              font-size: 1.3vw;
          }

          .settings-button {
              cursor: var(--pointer)
          }

          .settings-button:hover {
              animation: rotateDeg 1.5s ease forwards
          }

          .actual-feature { /* Same as desc but diff font size */
              color: var(--gray) !important;
              font-size: 1vw !important
          }

          .settings-body,
          .settings-selector {
              width: 100%;
              height: 100%;
              background: #1d1d1d;
              padding: 1vw;
              border-radius: 0.4vw;
              overflow: scroll;
              overflow-x: hidden
          }

          .settings-body *,
          .settings-selector * {
              color: var(--color);
              font-weight: 600;
              font-size: 1.175vw;
          }

          .settings-selector {
              flex-direction: row;
              flex-wrap: wrap;
              justify-content: center;
              align-content: flex-start;
          }

          .settings-item {
              width: 4vw;
              height: 4vw;
              background: rgb(255 255 255 / .025);
              display: grid;
              align-items: center;
              justify-content: center;
              border-radius: 1vw;
              cursor: var(--pointer);
              margin: 1vw;
          }

          .settings-item:hover {
              background: rgb(255 255 255 / .25);
              border-radius: .6vw;
          }

          .settings-item.active {
              background: rgb(255 255 255 / .15);
          }

          .settings-item * {
              cursor: var(--pointer);
              font-size: 2vw
          }

          .color-ball {
              width: 1.5vw;
              height: 1.5vw;
              border-radius: 50%;
              margin: 0vw 0.6vw;
              cursor: var(--pointer);
          }

          .color-ball:hover {
              filter: brightness(.7);
              border-radius: 30%
          }

          .color-ball.active::before {
              transition: all 0.4s ease;
              content: '';
              display: flex;
              width: 109%;
              height: 110%;
              border: 0.15vw solid rgb(255 255 255 / 0.25);
              border-radius: 50%;
              margin: -.22vw;
          }

          .color-ball.active:hover::before {
              filter: brightness(.7);
              border-radius: 30%
          }

          .picker-holder input[type="color"] {
              opacity: 0;
              position: fixed
          }

          .picker-color {
              cursor: var(--pointer);
              font-size: 1.5vw;
              margin-left: 1vw
          }

          .picker-text {
              color: var(--gray) !important;
              font-size: 1vw !important;
          }

          .color-picker {
              display: flex;
              justify-content: space-between;
          }

          .settings-hr {
              margin: 1vw 0vw;
              border: .025vw solid var(--main);
          }

          .checkbox-wrapper {
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
          }

          .checkbox-wrapper i {
              margin-right: 1.5vw;
              font-size: 2.3vw;
          }

          .info-holder {
              display: flex;
              flex-direction: column;
          }

          .info-holder * {
              font-size: 1vw
          }

          .dropdown-div {
              display: flex;
              justify-content: space-between
          }

          .dropdown-div i {
              margin-right: .6vw;
              font-size: 1vw !important;
              color: var(--gray) !important;
          }

          .button-plus {
              cursor: var(--pointer);
              background-color: rgb(255 255 255 / .25););
              border-radius: 50%;
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              width: 1.5vw;
              height: 1.5vw;
          }

          .button-plus:hover {
              filter: opacity(0.7)
          }

          .button-plus:active {
              filter: opacity(1.2)
          }

          .button-plus i {
              cursor: var(--pointer);
              margin: 0px !important;
              color: white !important;
              font-size: 1.3vw;
          }

          .name-changer {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 1vw
          }

          .name-changer .text {
              font-size: 2.1vw;
              color: var(--gray) !important;
              cursor: var(--pointer);
              margin-right: 1vw
          }

          .name-changes {
              justify-content: space-between;
              display: flex;
              width: 100%;
              background: #161616;
              padding: 0.6vw 1vw;
              border-radius: 0.4vw;
              flex-direction: row;
              justify-content: center;
              text-align: center;
          }

          .name-changes i {
              margin: 0vw 1vw
          }

          .name-changes > :first-child {
              width: 45%;
          }

          .name-changes > :nth-child(2) {
              width: 10%;
          }

          .name-changes > :nth-child(3) {
              width: 45%;
          }

          .name-edit {
              text-align: center;
              outline: none;
              user-select: none;
              background-color: inherit;
              border: 0px;
              cursor: var(--text);
          }

          .edit {
              margin-bottom: 1vw;
              display: none
          }

          .edit .name-changes {
              animation: glow 1s forwards;
              box-shadow: 0 0 20px -1.1vw rgb(255 255 255 / .9)
          }

          .edit span {
              font-size: 0.8vw;
              margin-bottom: 1vw
          }

          .risk {
              margin-right: .5vw;
              color: #E74C3C
          }

          .icon-change:hover {
              animation: rotate 1s infinite
          }

          .icon-change {
              animation: rotate 1s forwards
          }

          .name-changer i:hover {
              filter: opacity(.5)
          }
      `;

//[=]=> Menu append & title
const HUD = document.createElement('div');
      HUD.id = 'ehd-menu';
      HUD.classList = 'ehd_scrollBar';
      HUD.innerHTML = `
        <div class="header">
            <img src="https://cdn.glitch.global/499d2ba6-cd57-4e5f-8b56-5557baa5b3a0/EHD%20Visuals.png" alt="EHD Mod Icon" draggable="false">

            <div class="header-holder">
                <span> EHD [Free Version] </span>
                <span class="description header-info"> Settings </span>
            </div>

            <div class="menu-size" onclick="MenuManager.minimize(this)">
                <i class="bi bi-chevron-right"></i>
            </div>
        </div>

        <div class="body"></div>

        <div class="footer">
            <div class="menu-button" role="button" onclick="window.open('https://discord.gg/aZGuQmrm8z', '_blank')"
                 onmouseover="Tooltip.show(void 0, 'Join our Discord to share your feedback and discover more mods!')"
                 onmouseout="Tooltip.hide()">
                <i class="bi bi-discord"></i>
                <span> Discord </span>
            </div>

            <label class="menu-button switch">
                <div class="separator" id="transparency">
                    <i class="bi bi-transparency"></i>
                    <span> Transparency </span>
                </div>

                <input type="checkbox" onchange="MenuManager.opacity(this)">
                <div class="checkbox"></div>
            </label>
        </div>
      `;

const TIP = document.createElement('div');
      TIP.id = 'tooltip-menu';
      TIP.style = 'opacity: 0';
      TIP.innerHTML = ` Enhanced Visuals `

const NIGHT = document.createElement('div');
      NIGHT.classList = 'night-card';
      NIGHT.style = 'opacity: 0';

const SETTINGS = document.createElement('div');
      SETTINGS.id = 'settings-menu';
      SETTINGS.innerHTML = `
          <div class="container">
              <div class="settings-header">
                  <div class="separator"> <!-- Separate the flex -->
                      <i class="bi bi-sliders2 settings-icon" style="margin-right: 1vw"></i>

                      <div class="feature-container">
                          <span> Settings </span>
                          <span class="actual-feature settings-name"> Tornado particles </span>
                      </div>
                  </div>

                  <div class="separator">
                      <i class="bi bi-arrow-90deg-left settings-button" style="font-size: 1.2vw; color: var(--gray)" onclick="MenuManager.toggleSelector()"></i>
                      <i class="bi bi-x settings-button" onclick="MenuManager.toggleSettings('', false)"></i>
                  </div>
              </div>

              <div class="settings-selector ehd_scrollBar"> </div>

              <div class="settings-body ehd_scrollBar">
                  <div class="setting settings-colored_hp">
                      Health bar color

                      <div class="separator color-picker mine_health" style="margin-top: 0.6vw">
                          <div class="separator">
                              <div class="color-ball" style="background-color: #801a1a" onclick="MenuManager.changeColor(this)"></div>
                              <div class="color-ball" style="background-color: #bacb29" onclick="MenuManager.changeColor(this)"></div>
                              <div class="color-ball" style="background-color: #269a23" onclick="MenuManager.changeColor(this)"></div>
                              <div class="color-ball" style="background-color: #23629a" onclick="MenuManager.changeColor(this)"></div>
                              <div class="color-ball active picker-div" onclick="MenuManager.changeColor(this)" style="background-color: #611a80"></div>
                          </div>

                          <label class="picker-holder separator">
                              <input type="color" value="#611a80" onchange="MenuManager.colorPicker(this)"/>
                              <span class="picker-text"> Color picker </span>
                              <i class="bi bi-brush-fill picker-color"></i>
                          </label>
                      </div>

                      <hr class="settings-hr">

                      Enemy bar color

                      <div class="separator color-picker enemy_health" style="margin-top: 0.6vw">
                          <div class="separator">
                              <div class="color-ball" style="background-color: #801a1a" onclick="MenuManager.changeColor(this)"></div>
                              <div class="color-ball" style="background-color: #bacb29" onclick="MenuManager.changeColor(this)"></div>
                              <div class="color-ball" style="background-color: #269a23" onclick="MenuManager.changeColor(this)"></div>
                              <div class="color-ball" style="background-color: #23629a" onclick="MenuManager.changeColor(this)"></div>
                              <div class="color-ball active picker-div" onclick="MenuManager.changeColor(this)" style="background-color: #ae6999"></div>
                          </div>

                          <label class="picker-holder separator">
                              <input type="color" value="#ae6999" onchange="MenuManager.colorPicker(this)"/>
                              <span class="picker-text"> Color picker </span>
                              <i class="bi bi-brush-fill picker-color"></i>
                          </label>
                      </div>
                  </div>

                  <div class="setting settings-weapon_range">
                      <div class="switch separator checkbox-wrapper">
                          <div class="separator">
                              <i class="bi bi-slash-circle-fill"></i>

                              <div class="info-holder">
                                  <span> Round Cap </span>
                                  <span class="description"> Rounds the line cap to smooth </span>
                              </div>
                          </div>

                          <label class="separator" style="width: 2.1vw">
                              <input type="checkbox" checked onchange="MenuManager.enable(this, 'cap', 'slash-circle-fill', 'slash-square-fill')">
                              <div class="checkbox"></div>
                          </label>
                      </div>

                      <hr class="settings-hr">

                      Draw color

                      <div class="separator color-picker color" style="margin-top: 0.6vw">
                          <div class="separator">
                              <div class="color-ball" style="background-color: #801a1a" onclick="MenuManager.changeColor(this)"></div>
                              <div class="color-ball" style="background-color: #bacb29" onclick="MenuManager.changeColor(this)"></div>
                              <div class="color-ball" style="background-color: #269a23" onclick="MenuManager.changeColor(this)"></div>
                              <div class="color-ball" style="background-color: #23629a" onclick="MenuManager.changeColor(this)"></div>
                              <div class="color-ball active picker-div" onclick="MenuManager.changeColor(this)" style="background-color: #404040"></div>
                          </div>

                          <label class="picker-holder separator">
                              <input type="color" value="#404040" onchange="MenuManager.colorPicker(this)"/>
                              <span class="picker-text"> Color picker </span>
                              <i class="bi bi-brush-fill picker-color"></i>
                          </label>
                      </div>
                  </div>

                  <div class="setting settings-hitbox">
                      Draw color

                      <div class="separator color-picker color" style="margin-top: 0.6vw">
                          <div class="separator">
                              <div class="color-ball" style="background-color: #801a1a" onclick="MenuManager.changeColor(this)"></div>
                              <div class="color-ball" style="background-color: #bacb29" onclick="MenuManager.changeColor(this)"></div>
                              <div class="color-ball" style="background-color: #269a23" onclick="MenuManager.changeColor(this)"></div>
                              <div class="color-ball" style="background-color: #23629a" onclick="MenuManager.changeColor(this)"></div>
                              <div class="color-ball active picker-div" onclick="MenuManager.changeColor(this)" style="background-color: #50C878"></div>
                          </div>

                          <label class="picker-holder separator">
                              <input type="color" value="#50C878" onchange="MenuManager.colorPicker(this)"/>
                              <span class="picker-text"> Color picker </span>
                              <i class="bi bi-brush-fill picker-color"></i>
                          </label>
                      </div>
                  </div>

                  <div class="setting settings-footsteps">
                      <div class="switch separator checkbox-wrapper">
                          <div class="separator">
                              <i class="bi bi-meta"></i>

                              <div class="info-holder">
                                  <span> Land steps </span>
                                  <span class="description"> Draw steps when walking on land </span>
                              </div>
                          </div>

                          <label class="separator" style="width: 2.1vw">
                              <input type="checkbox" checked onchange="MenuManager.enable(this, 'land')">
                              <div class="checkbox"></div>
                          </label>
                      </div>
                  </div>

                  <div class="setting settings-name_changer">
                      <div class="dropdown-div">
                          <div class="separator">
                              <i class="bi bi-pencil-fill"></i>
                              <span> New Name Changer </span>
                          </div>

                          <div class="button-plus" onclick="MenuManager.toggleNewNC(this)">
                              <i class="bi bi-plus"></i>
                          </div>
                      </div>

                      <hr class="settings-hr">

                      <div class="name-changer-holder">
                          <div class="name-changer edit">
                              <i class="bi bi-pencil-square text icon-change"
                                 onclick="MenuManager.addNC(this)"
                                 onmouseover="MenuManager.changeIcon(this, 1, 'bookmark-plus text icon-change')"
                                 onmouseout="MenuManager.changeIcon(this, 0, 'pencil-square text icon-change')">
                              </i>

                              <div class="name-changes">
                                  <input type="text" placeholder="Wolf" class="name-edit"/>
                                  <i class="bi bi-arrows"></i>
                                  <input type="text" placeholder="Dog" class="name-edit"/>
                              </div>
                          </div>

                          <span class="edit">
                              <span class="risk">*</span>
                              <span> NOTE: The name will be replaced ONCE entity is displayed on screen </span>
                          </span>

                          <div id="name-changer-wrap"></div>
                      </div>
                  </div>

                  <div class="setting settings-undefined" style="display: none">
                      <span> No settings available for this feature. </span>
                  </div>
              </div>
          </div>
      `

document.head.appendChild(CSS);
document.body.appendChild(HUD);
document.body.appendChild(TIP);
document.body.appendChild(NIGHT);
document.body.appendChild(SETTINGS);

document.title = 'Sploop.io - EHD';

//[=]=> WebSocket overrider & functions
class PlayerManager {
    constructor() {
        this.alive = false;
        this.clan = [];
        this.age = 0;
        this.old_weapon = 0;
    }

    update() {
        const velocity = !Vars.steps.length && Player.velocity > 18;

        if (velocity) {
            const land = Settings.footsteps.land;

            const platform = Vars.entities.find(entity => entity && entity.type === 9 && Utils.distance(Player, entity) <= 65);
            const bed = Vars.entities.find(entity => entity && entity.type === 15 && Utils.distance(Player, entity) <= 65);

            const { x, y } = Player;
            const color = bed ? '#474747' : platform ? '#69482a' : y < 2485 ? '#b9b5ad' : y < 7485 ? '#51603a' : y < 8000 ? '#beb387' : y < 9000 ? '#1e6774' : '#86613d'

            if (!land && y < 7485) return;

            Vars.steps.push({ x, y, color, size: 10 });
        }
    }
}

class Packets {
    static init(ws) {
        const url = ws.url;

        ws.addEventListener('message', this.message.bind(this));

        Object.assign(this, { ws, url })
    }

    static message(event) {
        const message = event.data;
        const type = typeof message;
        const data = type === 'string' ? JSON.parse(message) : new Uint8Array(message);
        data.type = data[0];

        if (data.type === server.items_upgrade) {
            if (data.byteLength > 1) {
                Player.items = [];

                for (let index = 1; index < data.byteLength; index++) {
                    Player.items.push(data[index])
                };
            }
        }

        if (data.type === server.spawned) {
            const id = data[1],
                  items = data[4],
                  alive = true;

            Object.assign(Player, { id, items, alive });
        }

        if (data.type === server.died) Player.alive = false;

        if (data.type === server.update) {
            Vars.enemy = null;

            for (let index = 1; index < data.length; index += 19) {
                const broke = data[index + 8];

                const type = data[index + 0];
                const sid = data[index + 1];
                const id = data[index + 2] | data[index + 3] << 8;
                const x = data[index + 4] | data[index + 5] << 8;
                const y = data[index + 6] | data[index + 7] << 8;
                const dir = data[index + 9] / 255 * 6.283185307179586 - Math.PI;
                const weapon = data[index + 10];
                const hat = data[index + 11];
                const team = data[index + 12];
                const health = data[index + 13] / 255 * 100;

                if (2 & broke) {
                    Vars.entities[id] = null;
                } else {
                    const entity = Vars.entities[id] || {};
                    Object.assign(entity, { type, sid, id, x, y, weapon, hat, health, team, dir });

                    Vars.entities[id] = entity;

                    if (id === Player.id) {
                        Player.velocity = Math.hypot(y - Player.y, x - Player.x);

                        Player.update();
                        Object.assign(Player, entity);
                    }

                    const clan = (!Player.team || team != Player.team);
                    if (type === 0 && Player.id !== id && clan) {
                        const enemy = Vars.enemy;
                        const newDist = Math.hypot(Player.y - y, Player.x - x);
                        const oldDist = Vars.enemy ? Math.hypot(Player.y - enemy.y, Player.x - enemy.x) : null;

                        if (enemy) {
                            if (newDist < oldDist) {
                                Vars.enemy = entity;
                            }
                        } else {
                            Vars.enemy = entity;
                        }
                    }
                }
            }
        }
    }
}

WebSocket.prototype.send_ = WebSocket.prototype.send;

WebSocket.prototype.send = function(data) {
    const url = Packets.ws?.url !== this.url;
    if (!Packets.ws || url) {
        Packets.init(this);
    }

    this.send_(data);
};

//[=]=> Canvas drawing functions
const particlesArray = []
class Functions {
    static footsteps(canvas, args) {
        Vars.steps.forEach((step, index) => {
            const { x, y, size, color } = step;

            canvas.save()
            canvas.beginPath()

            canvas.globalAlpha = Math.max(0, 1 - step.size / 30)
            canvas.fillStyle = color
            canvas.arc(x, y, size, 0, Math.PI * 2)

            canvas.fill()
            canvas.restore()

            step.size *= 1.05

            if (step.size > 100) {
                Vars.steps.splice(index, 1);
            }
        })
    }

    static heal_effect(canvas, args) {
        const [ x, y, hp ] = args;

        Vars.heals.forEach((healed, index) => {
            const { plus, type, dir, rot, x, y } = healed;
            const speed = .01;

            healed.alpha -= speed * 2;
            healed.plus += speed * rot;

            canvas.save();
            canvas.translate(x, y);
            canvas.rotate(dir + plus);

            canvas.globalAlpha = healed.alpha;
            canvas.drawImage(type, 0, 0, 80, 80);

            canvas.restore();

            if (healed.alpha < .06) {
                Vars.heals.splice(index, 1);
            }
        })
    }

    static health_bar(canvas) {
        const colors = Settings.colored_hp;
        const color = canvas.fillStyle === '#a4cc4f' ? colors.mine_health : colors.enemy_health;

        canvas.fillStyle = color
    }

    static display_hp(canvas, args) {
        const [ x, y, hp ] = args
        const health = Math.round(hp + 5)

        const content = `${health}%`
        const { width } = canvas.measureText(content)
        const text = [content, x + 30 - (health > 99 ? 2 : 0), y + 30]

        canvas.font = '20px Baloo Paaji'
        canvas.fillStyle = 'white'
        canvas.strokeStyle = '#404040';

        canvas.lineWidth = 6.5

        canvas.strokeText(...text)
        canvas.fillText(...text)
    }

    static weaponRange(canvas, range) {
        const width = Math.min(4, canvas.lineWidth);

        canvas.save()
        canvas.beginPath()
        canvas.strokeStyle = Settings.weapon_range.color || '#404040'
        canvas.globalAlpha = .5

        canvas.lineCap = Settings.weapon_range.cap ? 'round' : 'square';

        canvas.rotate(-Math.PI / 2) // left

        canvas.arc(0, 0, range - width, 0, Math.PI)

        canvas.stroke()
        canvas.restore()
    }

    static hitbox(canvas, radius, object, x = 0, y = 0, width = 0, height = 0) {
        canvas.save()
        canvas.beginPath()
        canvas.strokeStyle = Settings.hitbox.color || '#50C878';
        canvas.globalAlpha = object === 'trap' ? 1 : .6

        canvas.arc(x + width / 2, y + height / 2, radius, 0, Math.PI * 2)

        canvas.stroke()
        canvas.restore()
    }

    static particles(canvas) {
        const particleCount = 20
        const arcRadius = 5

        if (particlesArray.length === 0) {
            for (let i = 0; i < particleCount; i++) {
                const x = Math.random() * 440
                const y = Math.random() * 440

                particlesArray.push({
                    x: -220 + x,
                    y: -220 + y,
                    alpha: 1,
                    lifespan: Math.random() * 100 + 50
                })
            }
        }

        for (let i = particlesArray.length - 1; i >= 0; i--) {
            const particle = particlesArray[i]

            particle.alpha -= 1 / particle.lifespan
            if (particle.alpha <= 0) {
                particle.x = -220 + Math.random() * 400
                particle.y = -220 + Math.random() * 400
                particle.alpha = 1
                particle.lifespan = Math.random() * 100 + 50
            }

            // Draw particle
            canvas.beginPath()
            canvas.arc(particle.x, particle.y, arcRadius, 0, Math.PI * 2, false)
            canvas.fillStyle = `rgba(154, 113, 53, ${particle.alpha})`
            canvas.fill()
            canvas.closePath()
        }
    }
}

// [=]=> Ctx override
function getWeaponRange(src) {
    let range = 0

    weapons.forEach(weapon => {
        if (src.search(weapon) > 0) {
            const index = weapons.indexOf(weapon)

            range = ranges[index]
        }
    })

    return range;
}

const weapons = [ 'hammer', 'sword', 'spear', 'axe', 'shield', 'stick', 'katana', 'naginata', 'bat', 'chillrend', 'dagger', 'staff', 'secret', 'scythe' ];
const ranges = [ 80, 135, 160, 90, 55, 100, 140, 165, 115, 140, 80, 140, 115, 160 ]
const item_radius = {
    trap: 40,
    spike: 45,
    hard_spike: 45,
    big_spike: 42,
    boost: 40,
    wall: 45
}

const drawImage = CanvasRenderingContext2D.prototype.drawImage;
CanvasRenderingContext2D.prototype.drawImage = function (image, x, y, width, height) {
    const canvas = this;
    const check = image.src && image.src.search('inv') < 0;

    const isWeapon = check && weapons.some(item => image.src.search(item) > 0);

    if (isWeapon && Features.weapon_range) {
        const range = getWeaponRange(image.src);

        Functions.weaponRange(canvas, range);
    }

    if (!isWeapon && check && Features.hitbox) {
        const object = image.src.split('/')[5].split('.')[0]
        const radius = item_radius[object]

        const holding = image.src.includes('item');
        const args = holding ? [x, y, width, height] : [];

        if (radius) Functions.hitbox(canvas, radius, object, ...args);
    }

    if (!isWeapon && check && image.src.search('tornado') > 0 && Features.tornado_particles) {
        Functions.particles(canvas)
    }

    return drawImage.apply(this, arguments)
};

const strokeText = CanvasRenderingContext2D.prototype.strokeText;
CanvasRenderingContext2D.prototype.strokeText = function (text, x, y, maxWidth) { // name changer
    const name = Settings.name_changers[text]

    if (Features.name_changer && name) {
        arguments[0] = name;
    }

    return strokeText.apply(this, arguments)
}

const fillText = CanvasRenderingContext2D.prototype.fillText;
CanvasRenderingContext2D.prototype.fillText = function (text, x, y, maxWidth) {
    const canvas = this;

    // Healing effect!
    if (canvas.fillStyle === '#8ecc51' && Features.healing_effect) {
        const type = Player?.items?.includes(12) ? Vars.images.cookie : Vars.images.apple;
        const { x, y } = Player;

        const rot = Vars.rot || -1;
        Vars.rot ? delete Vars.rot : (Vars.rot = 1);

        const dir = Mouse.angle + (rot === -1 ? -.9 : 0);

        Vars.heals.push({ type, dir, rot, x, y, plus: 0, alpha: 1 });
    }

    // Name changer
    const name = Settings.name_changers[text]

    if (Features.name_changer && name) {
        arguments[0] = name;
    }

    return fillText.apply(this, arguments)
};

const fillRect = CanvasRenderingContext2D.prototype.fillRect;
CanvasRenderingContext2D.prototype.fillRect = function (x, y, width, height) {
    const canvas = this;
    const isBar = ['#a4cc4f', '#cc5151'].includes(canvas.fillStyle);

    if (canvas.fillStyle === '#a4cc4f') {
        // Makes hp bar smoother
        if (Features.smooth_hp) {
            const old = Vars.health || width;
            const smooth = Utils.lerp(old, width, .1)

            width = smooth

            Vars.health = smooth
        }

        // Heal effect disp ck
        Features.healing_effect && Functions.heal_effect(canvas, arguments);

        // Footsteps disp
        Features.footsteps && Functions.footsteps(canvas, arguments);
    }

    if (isBar) {
        // Change bar colors
        Features.colored_hp && Functions.health_bar(canvas);
        fillRect.apply(canvas, arguments);

        // Then display HP
        Features.display_hp && Functions.display_hp(canvas, arguments);
        return;
    }

    return fillRect.apply(this, arguments)
};

//[=]=> Apply window values
window.Tooltip = Tooltip;
window.MenuManager = MenuManager;
window.Settings = Settings;

const Player = new PlayerManager();
const Mouse = new MouseManager();

window.addEventListener('beforeunload', function () {
    Utils.ls_set('ehd_features', Features);
    Utils.ls_set('ehd_settings', Settings);
});

window.addEventListener('click', function (event) {
    const { target } = event;

    if (target.id === 'settings-menu') MenuManager.toggleSettings('', false);
});

//[=]=> Event listeners, dom load, etc
(function load() {
    if (Vars.loaded) return;
    Vars.loaded = true;

    Mouse.listeners();
    MenuManager.appendReplacer();

    // Appends each button to the menu
    let string = '';

    for (let featureID in Features) {
        const Feature = Features[featureID];
        const { name, icon, info } = All_features[featureID] || {};

        name && (string += `
            <div class="menu-button ${ Feature ? 'active' : '' }" role="button"
                 onmouseover="MenuManager.ToggleToolTip(this, 1)"
                 onmouseout="MenuManager.ToggleToolTip(this, 0)"
                 onmousedown="MenuManager.ToggleFeature(this, 1)"
                 onmouseup="MenuManager.ToggleFeature(this, 0)">
                <i class="bi bi-${icon}"></i>
                <span>${name}</span>
            </div>
        `);
    }

    document.querySelector('.body').innerHTML = string;

    // Appends features but to the setting selector
    string = '';

    for (let featureID in Features) {
        const Feature = Features[featureID];
        const { name, icon } = All_features[featureID] || {};

        name && (string += `
            <div class="settings-item setting-div-${featureID} ${Feature ? 'active' : ''}"
                 onmouseover="MenuManager.ToggleToolTip(this, 1)"
                 onmouseout="MenuManager.ToggleToolTip(this, 0)"
                 onclick="MenuManager.toggleSettings(this, true)">
                <i class="bi bi-${icon}"></i>
                <span style="display: none">${name}</span>
            </div>
        `);
    }

    document.querySelector('.settings-selector').innerHTML = string;

    function update() {
        // Hide ads, sry
        const rightAd = document.querySelector('#game-right-content-main');
        const leftAd = document.querySelector('#game-left-content-main');
        const downAd = document.querySelector('#game-bottom-content');

        const display = Features.hide_ads ? 'none' : 'block';

        rightAd.style.display = display;
        leftAd.style.display = display;
        downAd.style.display = display;

        // Night mode !
        const condition = Features.night_mode && Player.alive;
        const night = document.querySelector('.night-card');

        night.style.opacity = condition ? '1' : '0';

        setTimeout(() => {
            requestAnimationFrame(update);
        }, 1e2);
    }

    requestAnimationFrame(update);
})();

//yb!
//sry for unsemantic html!