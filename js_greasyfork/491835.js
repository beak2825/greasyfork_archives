// ==UserScript==
// @name         Voxiom.io Portal Xray, ESP, Wireframe, And Mod Menu By DOGEWARE
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This mod helps you see players through damaged blocks, giving you an edge by peeking around corners without any distortion. It also shows players and walls as wireframes, making it easier to spot targets. You can tweak settings like wall editing in the mod menu
// @author       DOGEWARE
// @match        *://voxiom.io/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js
// @icon         https://media.giphy.com/media/CxYGmxv0Oyz4I/giphy.gif
// @antifeature  ads
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491835/Voxiomio%20Portal%20Xray%2C%20ESP%2C%20Wireframe%2C%20And%20Mod%20Menu%20By%20DOGEWARE.user.js
// @updateURL https://update.greasyfork.org/scripts/491835/Voxiomio%20Portal%20Xray%2C%20ESP%2C%20Wireframe%2C%20And%20Mod%20Menu%20By%20DOGEWARE.meta.js
// ==/UserScript==

//Ads will open every 3 minutes
const ADS = ["https://oagnihoul.com/4/7313829","https://madurird.com/4/7311702", "https://roastoup.com/4/7313829","https://stoobsugree.net/4/7319302"]
const originalArrayPush = Array.prototype.push;
const THREE = window.THREE
const prototype_ = {
    world: {
        wireframe: false,
        visibleOnDamage: true,
        notVisible: true,
        depthFunc: 2
    },
    player: {
        opacity: 0.5,
        wireframe: false
    }
}


Array.prototype.push = function(...args) {
    if(args[0] && args[0].material && args[0].material.type && args[0].material.type === "ShaderMaterial"){
        const material = args[0].material
        material.opacity = 0
        material.transparent = prototype_.world.visibleOnDamage
        material.side = 2
        material.depthFunc = prototype_.world.depthFunc
        material.wireframe = prototype_.world.wireframe
        material.visible = prototype_.world.notVisible
    }
    if(args[0] && args[0].material && args[0].material.type && args[0].material.type === "MeshBasicMaterial"){
        const material = args[0].material
        material.opacity = prototype_.player.opacity
        material.wireframe = prototype_.player.wireframe
    }
    return originalArrayPush.apply(this, args);
};
const style = document.createElement('style');
style.innerHTML = `
       .menuHeaderText1{
          font-size: 35px;
          font-weight: 900;
              text-align: center !important;
          animation: rgbAnimation 0.5s infinite alternate; /* Adding the animation */
          }
        .menuItemTitle1 {
          font-size: 18px;
          animation: rgbAnimation 0.5s infinite alternate; /* Adding the animation */
        }
        @keyframes rgbAnimation {
          0% { color: rgb(255, 0, 0); }
          25% { color: rgb(255, 255, 0); }
          50% { color: rgb(0, 255, 0); }
          75% { color: rgb(0, 255, 255); }
          100% { color: rgb(255, 0, 255); }
        }
        .menuItem1:hover img{
          transform: scale(1.1);
        }
    #menuContainer {
       position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #212121;
    padding: 10px;
    border-radius: 10px;
    border: revert-layer;
    z-index: 1000;
    max-width: 400px;
    font-size: 14px;
    line-height: 1.5;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    }
    #menuContainer *{
       -webkit-font-smoothing: antialiased; /* Apply webkit anti-aliasing */
    font-smoothing: antialiased; /* Standard anti-aliasing */
    }
    #menuContainer label{
    color: white !important;
    font-weight: bold;
    }
    .tab {
        display: flex;
        justify-content: space-around;
        margin-bottom: 10px;
    }
    .tab button {
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        padding: 3px 5px;
        width: 100%;
        cursor: pointer;
    }
    .tab button.active {
        background-color: #ccc;
    }
    .tabcontent {
        display: none;
        margin-top: 10px;
    }
    .tabcontent.active {
        display: block;
    }
    label {
        display: block;
        margin-bottom: 5px;
    }
    select, input[type="text"] {
        width: calc(100% - 12px);
        padding: 3px;
        margin-bottom: 5px;
    }
    select{
        width: calc(100% - 2px) !important;
    }
  .header {
      position: relative;
      text-align: center;
  }

  .headerContent {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
  }

  .header h2 {
         margin: 0;
      position: relative;
      bottom: -100px;
  }

  .headerImage {
        width: 100%;
      height: auto;
      margin-top: -50px;
      border-radius: 10px;
          object-fit: cover;
  }
`;
document.head.appendChild(style);
const menuContainer = document.createElement('div')
menuContainer.id = 'menuContainer'
document.body.appendChild(menuContainer)
const header = document.createElement('div')
header.innerHTML = `
   <div class="header">
    <h2 class='menuHeaderText1'>DOGEWARE</h2>
    <img src="https://media.giphy.com/media/fg4EQNbMABa6c/200.gif" alt='Header Image' class='headerImage'>
    </div>
    <b>[O] HIDE </b>
    <b>Ads Will Open Every 3 minutes</b>
    <b>Promo Page Only Shows Once</b>
`
menuContainer.appendChild(header)
const tabLinks = document.createElement('div')
tabLinks.classList.add('tab')
menuContainer.appendChild(tabLinks)
const tabContents = {}
const tabNames = Object.keys(prototype_)
tabNames.forEach(tabName => {
    const tabButton = document.createElement('button')
    tabButton.textContent = tabName.charAt(0)
        .toUpperCase() + tabName.slice(1)
    tabButton.addEventListener('click', () => openTab(tabName))
    tabLinks.appendChild(tabButton)
    const tabContent = document.createElement('div')
    tabContent.classList.add('tabcontent')
    menuContainer.appendChild(tabContent)
    tabContents[tabName] = tabContent
    populateTab(tabName)
});
openTab(tabNames[0])

function populateTab(tabName) {
    const tabContent = tabContents[tabName]
    const tabOptions = prototype_[tabName]
    for(const option in tabOptions) {
        if(typeof tabOptions[option] !== 'object') {
            const label = document.createElement('label')
            label.textContent = option.charAt(0)
                .toUpperCase() + option.slice(1)
            tabContent.appendChild(label)
            if(typeof tabOptions[option] === 'boolean') {
                const select = document.createElement('select')
                const optionTrue = document.createElement('option')
                optionTrue.value = 'true'
                optionTrue.textContent = 'Yes'
                const optionFalse = document.createElement('option');
                optionFalse.value = 'false'
                optionFalse.textContent = 'No'
                select.appendChild(optionTrue)
                select.appendChild(optionFalse)
                select.value = tabOptions[option].toString()
                select.addEventListener('change', event => {
                    tabOptions[option] = event.target.value === 'true';
                });
                tabContent.appendChild(select)
            } else {
                const inputField = document.createElement('input');
                inputField.type = 'text';
                inputField.value = tabOptions[option]
                inputField.addEventListener('change', event => {
                    tabOptions[option] = event.target.value
                });
                tabContent.appendChild(inputField)
            }
        }
    }
}

function openTab(tabName) {
    const tabs = document.querySelectorAll('.tabcontent')
    tabs.forEach(tab => tab.classList.remove('active'))
    const tabButtons = document.querySelectorAll('.tab button')
    tabButtons.forEach(tabButton => tabButton.classList.remove('active'))
    const tabContent = tabContents[tabName]
    tabContent.classList.add('active')
    const tabButton = [...tabLinks.querySelectorAll('button')].find(button => button.textContent === tabName.charAt(0)
                                                                    .toUpperCase() + tabName.slice(1))
    tabButton.classList.add('active')
}
const h3Element = document.createElement('h3')
h3Element.style.position = 'absolute'
h3Element.style.top = '60%'
h3Element.style.left = '50%'
h3Element.style.transform = 'translate(-50%, -50%)'
h3Element.style.margin = '0'
h3Element.style.color = 'white'
h3Element.style.fontFamily = 'monospace'
document.body.appendChild(h3Element)

let firstOpen = false

document.addEventListener('keydown', function(event) {
    if(event.keyCode === 79) {
        const displayStyle = menuContainer.style.display
        menuContainer.style.display = displayStyle === 'none' ? 'block' : 'none'
        if(firstOpen){

        }else{
            window.open('https://dogescripts.pages.dev/games/promo-page', '_blank');
            firstOpen = true
        }
    }
})
function alertEveryThreeMinutes() {
    setInterval(function() {
        window.open(`${ADS[Math.floor(Math.random() * ADS.length)]}`, '_blank');
    }, 1.5 * 60 * 1000);
}

alertEveryThreeMinutes();

