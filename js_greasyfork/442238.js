// ==UserScript==
// @name         No Usernames
// @version      1.5.0
// @author       Blu
// @description  A userscript to toggle visibility settings in bonk
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/826975
// @downloadURL https://update.greasyfork.org/scripts/442238/No%20Usernames.user.js
// @updateURL https://update.greasyfork.org/scripts/442238/No%20Usernames.meta.js
// ==/UserScript==

// for use as a userscript ensure you have Excigma's code injector userscript
// https://greasyfork.org/en/scripts/433861-code-injector-bonk-io

const injectorName = `NoUsernames`;
const errorMsg = `Whoops! ${injectorName} was unable to load.
This may be due to an update to Bonk.io. If so, please report this error!
This could also be because you have an extension that is incompatible with \
${injectorName}`;

// global variables for mod contained within object under this namespace
window[injectorName] = {
  players: {
    usernames: {
      visible: true,
      alpha: 1
    },
    skins: true,
    visible: true,
    alpha: 1
  },
  chat: {
    visible: true,
    alpha: 1
  }
};

function injector(src){
  let newSrc = src;

  parent.document.querySelector('#adboxverticalCurse').style.zIndex = -1;

  let guiCSS = document.createElement('style');
  guiCSS.innerHTML = `
  .${injectorName}Menu {
    background-color: #cfd8cd;
    width: calc(35.2vw - 400px);
    min-width: 154px;
    max-width: 260px;
    position: absolute;
    right: 1%;
    border-radius: 7px;
    display: unset;
    transition: ease-in-out 100ms;
    bottom: auto;
    height: auto;
    max-height: 100%;
    overflow-y: visible;
  }

  #${injectorName}MenuCollapse {
      position: absolute;
      right: 3px;
      top: 3px;
      width: 26px;
      height: 26px;
      border-radius: 2px;
      text-transform: full-width;
      visibility: visible;
  }

  #${injectorName}MenuControls {
      width:100%;
  }

  .${injectorName}SubMenu {
    margin: 2%;
    background: rgba(94, 114, 90, .15);
    border-radius: 2px;
    overflow-x: hidden;
  }

  element::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }

  .${injectorName}SubMenu p {
    text-align: left;
    padding-left: 5%;
    margin: 0;
  }

  .${injectorName}SubMenu td:nth-child(2) {
    text-align: right;
  }`;
  document.getElementsByTagName('head')[0].appendChild(guiCSS);

  let gui = document.createElement('div');
  document.getElementById('pagecontainer').appendChild(gui);

  let collapseMenu = `
    let menu = document.querySelector('#${injectorName}Menu');
    let submenus = [...menu.querySelectorAll('.NoUsernamesSubMenu')];
    let button = document.querySelector('#${injectorName}MenuCollapse');
    // maximize menu
    if(menu.style.visibility == 'hidden'){
      menu.style.minWidth = '';
      menu.style.width = '';
      menu.style.minHeight = '';
      menu.style.maxHeight = '';
      menu.style.visibility = '';
      submenus.forEach(n=>n.style.visibility='');
      button.innerText = '-';
    // minimize menu
    } else {
      menu.style.minWidth = 0;
      menu.style.width = 0;
      menu.style.minHeight = 0;
      menu.style.maxHeight = 0;
      menu.style.visibility = 'hidden';
      submenus.forEach(n=>n.style.visibility='hidden');
      button.innerText = '+';
    }
  `;

  let startDrag = `
    // start drag
    let e = arguments[0];
    e.preventDefault();
    let d = document.querySelector('#${injectorName}Menu');
    let offsetx = d.getBoundingClientRect().left - e.clientX;
    let offsety = d.getBoundingClientRect().top - e.clientY;
    d.style.transition = '0ms';
    // drag
    document.onmousemove = (e) => {
      let d = document.querySelector('#${injectorName}Menu');
      d.style.left = e.clientX + offsetx + 'px';
      d.style.top = e.clientY + offsety + 'px';
    };
    // stop drag
    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
      let d = document.querySelector('#${injectorName}Menu');
      d.style.transition = '';
      localStorage.setItem('${injectorName}Coords', d.style.left + ':' + d.style.top);
    };
  `;

  let savedLocation = localStorage.getItem(`${injectorName}Coords`);
  if(savedLocation){
    savedLocation = savedLocation.split(':');
  }

  gui.outerHTML = `
  <div class="windowShadow ${injectorName}Menu newbonklobby_elementcontainer" id="${injectorName}Menu" style="left: ${savedLocation?.[0] ?? "auto"}; top: ${savedLocation?.[1] ?? "60px"};">
    <div class="newbonklobby_boxtop newbonklobby_boxtop_classic" style='overflow-x: auto; cursor: pointer;' onmousedown="${startDrag}">
      <div id="${injectorName}MenuCollapse" class="newbonklobby_settings_button brownButton brownButton_classic buttonShadow" onclick="${collapseMenu}">-</div>
      Settings
    </div>
    <div class="${injectorName}SubMenu">
      <div class="newbonklobby_boxtop newbonklobby_boxtop_classic">
        <p>Players</p>
      </div>
      <table>
        <tr>
          <td class="mapeditor_rightbox_table">
            Skins
          </td>
          <td>
            <input type="checkbox" checked onchange="window.${injectorName}.players.skins = !window.${injectorName}.players.skins">
          </td>
        </tr>
        <tr>
          <td class="mapeditor_rightbox_table">
            Visible
          </td>
          <td>
            <input type="checkbox" checked onchange="window.${injectorName}.players.visible = !window.${injectorName}.players.visible">
          </td>
        </tr>
        <tr>
          <td class="mapeditor_rightbox_table">
            Opacity
          </td>
          <td>
            <input type="range" style="width: 5vw" value=100 oninput="window.${injectorName}.players.alpha = this.value/100">
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <div class="${injectorName}SubMenu">
              <div class="newbonklobby_boxtop newbonklobby_boxtop_classic">
                <p>Usernames</p>
              </div>
              <table>
                <tr>
                  <td class="mapeditor_rightbox_table">
                    Visible
                  </td>
                  <td>
                    <input type="checkbox" checked onchange="window.${injectorName}.players.usernames.visible = !window.${injectorName}.players.usernames.visible">
                  </td>
                </tr>
                <tr>
                  <td class="mapeditor_rightbox_table">
                    Opacity
                  </td>
                  <td>
                    <input type="range" style="width: 5vw" value=100 oninput="window.${injectorName}.players.usernames.alpha = this.value/100">
                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div class="${injectorName}SubMenu">
      <div class="newbonklobby_boxtop newbonklobby_boxtop_classic">
        <p>Chat</p>
      </div>
      <table>
        <tr>
          <td class="mapeditor_rightbox_table">
            Visible
          </td>
          <td>
            <input type="checkbox" checked onchange="window.${injectorName}.chat.visible = !window.${injectorName}.chat.visible; window.${injectorName}.chatWindow.style.opacity = +window.${injectorName}.chat.visible;">
          </td>
        </tr>
        <tr>
          <td class="mapeditor_rightbox_table">
            Opacity
          </td>
          <td>
            <input type="range" style="width: 5vw" value=100 oninput="window.${injectorName}.chat.alpha = this.value/100; window.${injectorName}.chatWindow.style.opacity = window.${injectorName}.chat.alpha;">
          </td>
        </tr>
      </table>
    </div>
  </div>`;

  // control player and username visibility
  let discID =  newSrc.match(/this.discGraphics\[([\w$]{2,4})\]=null;\}/)[1];
  newSrc = newSrc.replace(`this.discGraphics[${discID}]=null;}`, `this.discGraphics[${discID}]=null;} else {
    if(this.discGraphics[${discID}]){
      if(this.discGraphics[${discID}].sfwSkin){
        // control skin visibility
        this.discGraphics[${discID}].playerGraphic.alpha = window.${injectorName}.players.skins ? 1 : 0;
        this.discGraphics[${discID}].sfwSkin.visible = !window.${injectorName}.players.skins;
      // gotta wait for avatar to be created
      } else if(this.discGraphics[${discID}]?.avatar?.bc != undefined){
        // create sfwSkin
        this.discGraphics[${discID}].sfwSkin = new PIXI.Graphics;
        this.discGraphics[${discID}].sfwSkin.beginFill(this.discGraphics[${discID}].teamify(this.discGraphics[${discID}].avatar.bc, this.discGraphics[${discID}].team));
        this.discGraphics[${discID}].sfwSkin.drawCircle(0,0,this.discGraphics[${discID}].radius);
        this.discGraphics[${discID}].sfwSkin.endFill();
        this.discGraphics[${discID}].container.addChildAt(this.discGraphics[${discID}].sfwSkin, 3);
      }

      // everything else
      this.discGraphics[${discID}].nameText.alpha = window.${injectorName}.players.usernames.visible ? window.${injectorName}.players.usernames.alpha : 0;
      if(this.discGraphics[${discID}].playerID != this.localPlayerID){
        this.discGraphics[${discID}].container.visible = window.${injectorName}.players.visible;
        this.discGraphics[${discID}].container.alpha = window.${injectorName}.players.alpha;
      }
    }
  }`);
  
  // get chat window when building renderer
  let buildRendererFunction = newSrc.match(/(build\([\w$]{2,4},[\w$]{2,4}\)) \{.{30,150}=new [\w$]{2,4}\[[0-9]+\]\(/)[1];
  newSrc = newSrc.replace(`${buildRendererFunction} {`, `${buildRendererFunction} {
    window.${injectorName}.chatWindow = document.querySelector('#ingamechatbox');
  `);

  if(src === newSrc) throw "Injection failed!";
  console.log(injectorName+" injector run");
  return newSrc;
}

// Compatibility with Excigma's code injector userscript
if(!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push(bonkCode => {
	try {
		return injector(bonkCode);
	} catch (error) {
		alert(errorMsg);
		throw error;
	}
});

console.log(injectorName+" injector loaded");