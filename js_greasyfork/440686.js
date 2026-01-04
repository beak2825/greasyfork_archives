// ==UserScript==
// @name         🐅 Theme In-Game Editor for Arras.io 🐅
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Modify the look and feel of your Arras.io game, while you're playing it!
// @author       Road6943
// @match        *://arras.io/
// @match        *://arras.netlify.app/
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.12
// @resource     VERTE_CSS https://cdn.jsdelivr.net/npm/verte@0.0.12/dist/verte.css
// @require      https://unpkg.com/prompt-boxes@2.0.6/src/js/prompt-boxes.js
// @resource     PROMPT_BOXES_CSS https://unpkg.com/prompt-boxes@2.0.6/src/css/prompt-boxes.css
// @require      https://unpkg.com/konva@4.0.0/konva.min.js
// @require      https://cdn.jsdelivr.net/npm/vue-konva@1.0.7/lib/vue-konva.min.js
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/440686/%F0%9F%90%85%20Theme%20In-Game%20Editor%20for%20Arrasio%20%F0%9F%90%85.user.js
// @updateURL https://update.greasyfork.org/scripts/440686/%F0%9F%90%85%20Theme%20In-Game%20Editor%20for%20Arrasio%20%F0%9F%90%85.meta.js
// ==/UserScript==


/* IMPORTANT NOTES: use single quotes (') for the majority of stuff as they won't interfere with
** either HTML's " double quotes " or the js string interpolation backticks ``
** Arras() function is what allows this whole thing to work -- gives current theme values and allows you to set new ones */
var CONTAINER_ID = 'app';
var CANVAS_ID = 'canvas';
var LAUNCH_BTN_ID = 'launch-btn';

(function() {
    'use strict';

    // add these css files at the start so that the launch btn can be styled and positioned above canvas from the very start
    // Verte css stuff can't go here because it screws with the Arras landing page styling
    GM_addStyle( getUserscriptSpecificCSS() ); // positions items above canvas
    GM_addStyle( getAppCSS() ); // adds styling for the majority of the Vue app's ui
    //GM_addStyle( GM_getResourceText('PROMPT_BOXES_CSS') ); // (non-blocking dialogs)

    var canvas = document.getElementById(CANVAS_ID);

    // add a launch button to launch the main Vue instance, it should look identical to the toggle-btn
    // thanks to their shared .tiger-btn class
    canvas.insertAdjacentHTML('beforebegin', `
      <button id="${LAUNCH_BTN_ID}" class="tiger-btn">
        🐅 Open 🐅
      </button>
    `);

    document.getElementById(LAUNCH_BTN_ID).onclick = launchApp
})();


// launch the main editor app only if user is in-game (so that the themeColor stuff is actually availiable to grab)
// also destroy the initial launch-btn at the end of this function because it is no longer needed and is replaced with toggle-btn inside the main Vue app
function launchApp() {
  if (!userIsCurrentlyInGame()) {
    alert('You must be in-game to use this!');
    return;
  }

  // remove the launch button, so that the toggle-btn in the Vue instance can take over
  // and also to prevent users from accidently creating multiple Vue instances through multiple clicks
  document.getElementById(LAUNCH_BTN_ID).remove();

  // something in arras's default css styling screws with the top color picker
  // by making it be too wide and overflow from the color picker container
  // so this removes all existing css for just that top slider, so that only Verte's css can style it
  // the width:85% thing is something that I used before to make the slider look correct,
  // but it screwed with the functionality somewhat so I removed it
  /* Verte-related */
  GM_addStyle( '.verte-picker__slider { all: unset;        /* width: 85%; */ }' );

  // add verte css file (color picker styling)
  // Must go here (in-game only, never landing page) because it screws with the Arras landing page styling somehow
  GM_addStyle( GM_getResourceText("VERTE_CSS") );

  // add css to make the Prompt Boxes non-blocking dialog toasts work
  GM_addStyle( GM_getResourceText('PROMPT_BOXES_CSS') );

  var canvas = document.getElementById(CANVAS_ID);
  canvas.insertAdjacentHTML('beforebegin', getAppHTML());
  runAppJS();
}


// a little hack to detect if the user is currently in game or on the main landing page
function userIsCurrentlyInGame() {
  // playerNameInput is disabled in-game, but enabled on the main landing page (because thats how players enter their name)
  //return document.getElementById("playerNameInput").hasAttribute("disabled");

  // ^^ that no longer works, so heres a new hack:
  // Arras().themeColor is undefined on the landing page, but has a value in-game
  return (Arras().themeColor !== undefined)
}

// this is css that allows the the userscript to properly show the editor above the game canvas
// and anything else that's not used for the actual app functionality (anything that wouldn't go into a codepen of the app)
function getUserscriptSpecificCSS() {
  return `

/* These position the launch button and editor div directly above the canvas */
#${CONTAINER_ID}, #${LAUNCH_BTN_ID} {
  position: absolute;
  z-index: 2;
}
#${CANVAS_ID} {
  position: absolute;
  z-index: 1;
}

`}

// paste the vue js html code into here, but NOT the script tag stuff or the style tag stuff
function getAppHTML() {
  return `
    <!-- 
    This file contains the html (vue-template html) for the main editor
    
    The @keydown.stop stuff everywhere prevents typing into inputs in tiger from also affecting the game (e.g. when typing a theme name, you don't want presssing 'e' to also toggle autofire)
 -->

<div id="app" 
    :style="[showApp ? {
                    backgroundColor: '#0004', /* not a typo */
                    height: '50%',
                    width: '30%',
                    overflow: 'hidden',
                } : {
                    backgroundColor: 'transparent',
                    height: '0%',
                    width: '0%',
                }]"
> <!-- app when open gets a bg color of #0001 (not a typo, it's pure black but with near-complete transparency) so that its styling like table borders appear no matter which color the map bg is -->
<!--MOUSEOVER BUG FIX:
    When the container has a set size in a css file, your mouse inputs when over the app,
        even if its closed, do not register with the game */
/* You need to have the container have 0% height & width when closed so the mouse can freely move around the top left corner 
    This is why we use the v-bind:style for this -->
<!-- overflow:hidden is to prevent editor from extending past the transparentish background of the app -->

    <button id="toggle-btn" class="tiger-btn" @click="showApp = !showApp">
        🐅 {{ showApp ? "Close" : "Open" }} 🐅
    </button>
    <button id="tab-btn" class="tiger-btn" @click="changeTab()" v-show="showApp">
        Change Tab
    </button>
    <br>
    <button id="save-btn" class="tiger-btn" v-show="showApp"
            @mousedown="indicateClicked('saveCurrentTheme') "
            @mouseup="saveCurrentTheme()"
    >
        Save Current Theme (Hold for 3s)
    </button>

    <div id="editor" class="tab" v-show="showApp && currentTab === 'editor' ">
        <div v-for="(_, category) in config" 
            v-if="category !== 'themeColor' " 
        > <!-- handle themeColor separately -->
            <table>
                <thead>
                    <th colspan="2" >
                        Edit {{ category }}
                    </th>
                </thead>

                <!-- in Vue, key,val is reversed to val,key -->
                <tr v-for="(val,key) in config[category]" 
                    @change="console.log('Arras().' + category + '.' + key + ' is now ' + config[category][key])"
                >
                    <td>
                        {{ key }}
                    </td>

                    <!-- use the type of the value to determine the type of input selector :: typeof won't work because Vue represents numbers as strings -->
                    <td v-if="getType(val) === 'number' ">
                        <input type="number" v-model.number="config[category][key]" @keydown.stop>
                    </td>

                    <td v-else-if="getType(val) === 'boolean' ">
                        <input type="checkbox" v-model="config[category][key]" >
                    </td>

                    <td v-else>
                        <!-- This means that the type of one of the properties was not recognized by this.getType() -->
                        <strong>:( This is broken. Please ping Road#6943 in Discord to fix this. ):</strong>
                    </td>
                </tr>
            </table>
        </div>

        <div> <!-- themeColor is treated differently from other Arras() properties because color pickers need special attention (like the color descriptions, etc...) -->
            <table>
                <thead>
                    <th colspan="3" >
                        Edit themeColor
                    </th>
                </thead>

                <tr>
                    <td>
                        border
                    </td>
                    <td colspan="2" >
                        <input type="number" v-model.number="config.themeColor.border" @keydown.stop
                                @change="console.log('Arras().themeColor.border is now ' + config.themeColor.border)"
                        >
                    </td>
                </tr>

                <tr v-for="[ description, colorName ] in colorDescriptions" >

                    <!-- A "dummy" column, so that the color picker doesn't flow out of the app -->
                    <!-- Verte-related -->
                    <td class="dummy-column">
                        {{ colorName }}
                    </td>

                    <td @keydown.stop> <!-- putting @keydown.stop in verte won't work, so this is the next best thing -->
                        <!-- Why won't menuPosition="right" work!!! --> <!-- Verte-related -->
                        <verte picker="square" model="hex" menuPosition="right"
                                v-model="config.themeColor.table[ colorNames.indexOf(colorName) ]"
                                @input=" console.log( colorName + ' is now ' + getHex(colorName) ) "
                        ></verte>
                    </td>

                    <td>
                        {{ description }}
                    </td>
                </tr>
            </table>
        </div>

        <div id="special-color-buttons-container">
            <button class="tiger-btn" @click="randomizeColors">Randomize Colors</button>
        </div>
    </div>

    <div id="extras" class="tab" v-show="showApp && currentTab === 'extras' ">
        
        <button id="feedback-btn" class="tiger-btn"
            onclick="window.open('https://forms.gle/M425vYsiBqZzjdRx6','_blank')"
        >
            Give Feedback! (Opens in New Tab)
        </button>

        <table>
            <tr>
                <td>
                    Theme Name:
                </td>
                <td>
                    <input type="text" v-model="themeDetails.name" 
                        placeholder="Name" @keydown.stop
                    >
                </td>
            </tr>
            <tr>
                <td>
                    Theme Author:
                </td>
                <td>
                    <input type="text" v-model="themeDetails.author" 
                        placeholder="Author" @keydown.stop
                    >
                </td>
            </tr>
            <tr>
                <td>
                    <textarea id="import-theme-textarea" v-model="importedTheme" 
                        placeholder="Enter theme" @keydown.stop
                    ></textarea>
                </td>
                <td>
                    <button class="tiger-btn" @click="indicateClicked('importTheme'); importTheme()">
                        {{
                            wasButtonClicked.importTheme
                            ? 'Currently Importing Theme'
                            : 'Import Theme (All Types Accepted)'
                        }}
                    </button>
                </td>
            </tr>
            <tr>
                <td>
                    Best Option. Includes everything. Only works with Tiger (Theme In-Game Editor).
                </td>
                <td>
                    <button class="tiger-btn" @click="indicateClicked('exportTiger'); exportTheme('TIGER_JSON')">
                        {{ 
                            wasButtonClicked.exportTiger
                            ?  'Copied to clipboard!'
                            : '🐅 Export Tiger Theme 🐅' 
                        }}
                    </button>
                </td>
            </tr>
            <tr>
                <td>
                    Only includes colors (and the border size). DOES NOT INCLUDE ANY OTHER VALUES SUCH AS FOR GRAPHICAL OR GUI PROPERTIES. However, it can be used without Tiger, by entering it into Arras.io's custom theme input.
                </td>
                <td>
                    <button class="tiger-btn" @click="indicateClicked('exportBackwardsCompatible'); exportTheme('backwardsCompatible')">
                        {{ 
                            wasButtonClicked.exportBackwardsCompatible
                            ? 'Copied to clipboard!'
                            : 'Export Backwards-Compatible Theme'
                        }}
                    </button>
                </td>
            </tr>
        </table>

        
        
    </div>

    <div id="savedThemes" class="tab" v-show="showApp && currentTab === 'savedThemes' ">
        <table>
            <tr v-for="(theme,index) in savedThemes">
                <td class="theme-details-container" >
                    {{ theme.themeDetails.name }}
                    <br><br>
                    by:
                    <br>
                    {{ theme.themeDetails.author }}
                    <br><br>
                    <button class="delete-btn tiger-btn"
                            @mousedown="indicateClicked('deleteTheme') 
                                            /* sets the starting timestamp */
                                        "
                            @mouseup="deleteSavedTheme(index)  
                                        /* only deletes if mouseup timestamp - mousedown timestamp >= 3 seconds, to prevent accidental deletion */ 
                                        " 
                    >
                        Delete Theme<br>(Hold for 3s)
                    </button>
                </td>
                <td class="theme-preview-container">
                    <svg class="preview" 
                        :style="{ 
                            backgroundColor: getHex('white', theme) ,
                            stroke: getHex('black', theme) ,
                            strokeWidth: 3 ,
                        }"
                        @click="applyTheme(theme)"
                    >
                        <rect class="barrelsAndRocks" x="50" y="40" rx="5" ry="5" width="35" height="20" stroke-width="3"
                            :fill="getHex('grey', theme)" />
                        <circle class="blueTeam" cx="50" cy="50" r="20" stroke-width="3"
                            :fill="getHex('blue', theme)" />
                        
                        <rect class="barrelsAndRocks" x="215" y="40" rx="5" ry="5" width="35" height="20" stroke-width="3"
                            :fill="getHex('grey', theme)" />
                        <circle class="greenTeam" cx="250" cy="50" r="20" stroke-width="3"
                            :fill="getHex('green', theme)" />
                        
                        <rect class="barrelsAndRocks" x="215" y="140" rx="5" ry="5" width="35" height="20" stroke-width="3"
                            :fill="getHex('grey', theme)" />
                        <circle class="magentaTeam" cx="250" cy="150" r="20" stroke-width="3"
                            :fill="getHex('magenta', theme)" />
                        
                        <rect class="barrelsAndRocks" x="50" y="140" rx="5" ry="5" width="35" height="20" stroke-width="3"
                            :fill="getHex('grey', theme)" />
                        <circle class="redTeam" cx="50" cy="150" r="20" stroke-width="3"
                            :fill="getHex('red', theme)" />
                        
                        <polygon class="triangle" points="65.5,100  100,80  100,120"
                            :fill="getHex('orange', theme)" />
                        
                        <polygon class="square" points="230.5,85 230.5,115 200.5,115 200.5,85"
                            :fill="getHex('gold', theme)" />
                        
                        <polygon class="pentagon" points="138,113  130.6,90.2  150,76.1  169.4,90.2  162,113" 
                            :fill="getHex('purple', theme)" />
                        
                        <polygon class="rock" class="barrelsAndRocks" points="142.1,53.7  131.15,42.75  131.15,27.25  142.1,16.3  157.6,16.1  168.55,27.25  168.55,42.75  157.6,53.7"
                            :fill="getHex('grey', theme)" />
                        
                        <polygon class="crasher" points="150,130 140,147.32 160,147.32"
                            :fill="getHex('pink', theme)" />
                        
                        <text x="87.5" y="180" class="gameText"
                            :fill="getHex('guiwhite', theme)"
                        >Click To Use</text>
                    </svg>
                </td>
            </tr>
        </table>
    </div>
</div>

  `
}

function getAppCSS() {
  return `
    /*
    This file contains the css (non-userscript specific or library-imported) that makes the editor appear and then look presentable
*/

/* These make sure the editor doesn't take up the whole screen
** and instead stays in a nice neat tiny box */
html,body {
    height: 100%;
    width: 100%;
}

/* DO NOT SET HEIGHT/WIDTH/OVERFLOW FOR app IN HERE (CSS FILE) */
/* SET IT USING Vue's conditional :style binding */
/* When the container has a set size, your mouse inputs when over the app,
        even if its closed, do not register with the game */
/* You need to have the container have 0% height & width when closed so the mouse can freely move around the top left corner */
#app .tab {
    height: 75%; /* To prevent bottom from extending past app */
    width: 100%;
    overflow: auto;
}

/* dummy column adds space for the color picker to fully expand into */
/* Verte-related */
td.dummy-column {
    width: 100px;
}

/* makes number/text inputs and textareas and editor buttons transparent */
#app input[type="number"]:not(.verte__input), 
#app input[type="text"]:not(.verte__input),
#app textarea,
.tiger-btn {
    background-color:transparent;
}
/* adds outline to text so its visible against any background color, # of repeated shadows determines strength of outline */
/* from https://stackoverflow.com/a/57465026 */
/* also making all text bold and Ubuntu, so its easier to see */
#app, 
#app input[type="number"]:not(.verte__input),
#app input[type="text"]:not(.verte__input),
#app textarea,
.tiger-btn {
    text-shadow: 0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 1px black;
    color: white;
    
    font-weight: bold;
    /* no need to import Ubuntu font, Arras's default styling will take over in-game and provide it for free */
}

/* makes the items more easy to visually separate from each other and the borders of the app */
#app table, 
#app th, 
#app td {
    border: 1px solid white;
    border-collapse: collapse;
    padding: 10px;
}

/* forces the number in number inputs to be close to its label on the left */
#app input[type="number"] {
    text-align: left;
}

/* force text inside toggle-btn to stay in 1 line */
#toggle-btn {
    white-space: nowrap;
}

/* make the tab changing and save theme buttons stay away from the open/close button */
#tab-btn, #save-btn {
    float: right;
}
/* add some extra space below the #save-btn */
#save-btn {
    margin-bottom: 10px;
}

/* make extras tab table stay within app */
#extras table {
    table-layout: fixed;
}
#extras textarea {
    width: 100%;
}

/* make the entire svg theme preview show up
** and give it a "softer" look */
#savedThemes svg {
    height: 250%;
    border-radius: 5%;
}
/* make the full svg preview show up instead of being cut off at the bottom */
#savedThemes .theme-preview-container {
    height: 100px;
    /* Align svg to top of cell */
    vertical-align: top;
}

/* make the svg text more visible and reflective of its in-game look */
#savedThemes svg text {
    font-family: Ubuntu, sans-serif;
    font-size: 25px;
    font-weight: bold;
    stroke-width: 1;
    letter-spacing: -1.5px;
}

/* add some space around the deleteTheme buttons, 
** and make them half-transparent red
*/
#savedThemes .delete-btn {
    margin: 10px;
    background-color: rgba(255, 0, 0, 0.7)
}

#savedThemes .theme-details-container {
    text-align: center;

    /* To prevent really long theme names or author names from 
        fully displaying in one linemaking it impossible to scroll 
        rightwards to the theme previews 
        
        Instead, they are forced to wrap, which generates a really tall cell */
    word-break: break-all;
    min-width: 150px;
}

/* main verte container 
    -- add some space between its left and the #app container's left */
/* Verte-related */
[class="verte__menu-origin verte__menu-origin--bottom verte__menu-origin--active"] {
    margin-left: 25px;
}

#special-color-buttons-container {
    text-align: center;
    margin-top: 10px;
}

  `
}

// paste the vue js <script> js </script> code into herexs
function runAppJS() {

  /*
    This file contains the Vue.js code that runs the editor
*/
'use strict';

// initializing PromptBoxes (used for its toasts, which are non-blocking dialogs)
var pb = new PromptBoxes({
    attrPrefix: 'pb',
    toasts: {
        direction: 'top',       // Which direction to show the toast  'top' | 'bottom'
        max: 2,                 // The number of toasts that can be in the stack
        duration: 1000 * 3,     // The time the toast appears (in milliseconds)
        showTimerBar: true,     // Show timer bar countdown
        closeWithEscape: true,  // Allow closing with escaping
        allowClose: true,      // Whether to show a "x" to close the toast
    }
});


var app = new Vue({
    el: "#app",

    components: { Verte }, /* Verte-related */

    data: {
        showApp: true, // applies to the overall app (#app)
        currentTab: 'editor', // color pickers tab must be the initial one because otherwise the color pickers break
                                // other options can be found in the changeTab() function

        config: {}, // is filled with Arras(), and then stored currentTheme (config from previous session) on Vue instance creation
                    // because this is linked directly to the game's Arras() obj, we don't need a watcher on config or a renderChange() function
        themeDetails: {
            name: "", // theme name
            author: "",
        },
        
        importedTheme: "",

        // is synced with GM_ storage using a watcher :: each theme's unique key is its index in this array
        savedThemes: [],

        // used to temporarily change button text after being clicked
        wasButtonClicked: {
            importTheme: false,
            exportTiger: false,
            exportBackwardsCompatible: false,
        },

        // used to ensure user holds down btn for 3 seconds before the functioanlity actually happens
        // to prevent accidental stray clicks
        buttonClickStartTime: {
            deleteTheme: Infinity,
            saveCurrentTheme: Infinity,
        },

        // colorNames is an array of the names of the colors in the array at Arras().themeColor.table, in the same order
        colorNames: ["teal","lgreen","orange","yellow","lavender","pink","vlgrey","lgrey","guiwhite","black","blue","green","red","gold","purple","magenta","grey","dgrey","white","guiblack"],
        // colorNames and colorDescriptions CANNOT be combined because the order for colorNames is a bad description order (you shouldn't put magenta far apart from blue/green/red, etc...)
        colorDescriptions: [
            /* "Utility" stuff, not sure how to describe these */
            /* Borders -- at top since the border size selector is right above the color selectors */
            ["Borders, Text Outlines, Health Bar Background"
                , "black"],
            ["Map Background"
                , "white"],
            ["Map Border, Grid"
                , "guiblack"],
            ["Text Color"
                , "guiwhite"],
            
            /* Teams */
            ["Your tank in FFA, Left team in 2TDM, Top left team in 4TDM" 
                , "blue"],
            ["Enemy tanks in FFA, Bottom left team in 4TDM"
                , "red"],
            ["Right team in 2TDM, Top right team in 4TDM, Score Bar"
                , "green"],
            ["Bottom right team in 4TDM"
                , "magenta"],
            
            /* Shapes */
            ["Rocks, Barrels, Bar Backgrounds"
                , "grey"],
            ["Squares, Level Bar"
                , "gold"],
            ["Triangles"
                , "orange"],
            ["Pentagons, Pentagon Nest Background"
                , "purple"],
            ["Crashers"
                , "pink"],
            ["Eggs, Minimap Background, Invulnerability Flash"
                , "vlgrey"],

            /* Bars under tanks/shapes/bosses/etc... */
            ["Main Health Bar, Rare Polygons"
                , "lgreen"],
            ["Shield/Regen Bar, Rare Polygons"
                , "teal"],

            /* Extras */
            ["Arena Closers, Neutral Dominators"
                , "yellow"],
            ["Rogue Palisades"
                , "dgrey"],
            ["Unused"
                , "lavender"],
            ["Unused"
                , "lgrey"],
        ],
    },

    methods: {
        // this is needed because vue converts everything into a string once you change a value
        // so the typeof operator won't work
        getType(val) {
            val = val.toString();
            if (val === "true" || val === "false") {
                return "boolean";
            }
            if (!isNaN(val)) {
                return "number";
            }
            if (val[0] === "#") {
                return "color";
            }
        },

        // get the hexadecimal (#abc123) value for the given colorName in the themeColor table
        // second optional argument is a themeObj to use in case you want to get a hex for a different theme
        getHex(colorName, themeObj = this) {
            return themeObj.config.themeColor.table[ this.colorNames.indexOf(colorName) ];
        },

        // move to next tab in tabs array, and then wrap back around to beginning
        changeTab() {
            var tabs = ['editor', 'extras', 'savedThemes'];

            var currentTabIndex = tabs.indexOf( this.currentTab );

            var newTabIndex = currentTabIndex + 1;
            if (newTabIndex === tabs.length) {
                newTabIndex = 0;
            }

            this.currentTab = tabs[ newTabIndex ];
        },

        // either changes the button's text for 3 seconds, 
        // or starts a timer to ensure a button is held for 3 seconds before its functionality is run
        indicateClicked(btnName) {
            if (btnName === 'deleteTheme' || btnName === 'saveCurrentTheme') {
                pb.info('Hold button for 3 seconds to ' + btnName)
                // instead of a boolean, we want to use a numerical timestamp to make sure user holds click for 3 sec
                // to prevent stray click accidents
                this.buttonClickStartTime[btnName] = performance.now();
            }
            // button text depends on if true or false, this thus changes the button text for 3 seconds
            else {
                this.wasButtonClicked[btnName] = true;
                setTimeout(() => {
                    this.wasButtonClicked[btnName] = false;
                }, 1000 * 3);
            }
        },

        // export a theme as either a 'tiger' theme (using edn format) or 'arras' theme (json format, only contains themeColor changes)
        exportTheme(type) {
            var themeToExport = {};

            // 'tiger' themes are purposefully incompatible with 'arras' themes because we don't want people who are not familiar with tiger
            // to become confused why a theme they got/found from someone else doesn't seem to work properly 
            // (as the default arras custom theme input would only change colors and border, not any of the other graphical/gui properties)
            // tiger themes look like this:
            // TIGER_JSON{/* valid JSON */}
            // this way it'll be easy in the future if we want to add in extra theme types like TIGER_BASE64/* valid base64 */ or TIGER_XML</* valid XML */>
            if (type === 'TIGER_JSON') {
                themeToExport = {
                    themeDetails: this.themeDetails,
                    config: this.config,
                };

                themeToExport = 'TIGER_JSON' + JSON.stringify(themeToExport);
            }
            else if (type === 'backwardsCompatible') {
                themeToExport = {
                    name: this.themeDetails.name,
                    author: this.themeDetails.author,
                    content: {},
                };

                for (var colorName of this.colorNames) {
                    themeToExport.content[colorName] = this.getHex(colorName);
                }

                themeToExport = JSON.stringify(themeToExport);
            }
            else {
                console.log('unsupported export theme type');
                return;
            }


            // copy to clipboard
            GM_setClipboard(themeToExport);

            console.log('Exported the following theme:');
            console.log(themeToExport);

            // use Prompt-Boxes library to notify user
            pb.success('Copied to Clipboard!');
        },

        // supports both types of arras themes as well as the new TIGER_JSON theme type
        // this function only converts an imported theme string into a js object mirroring this.config/the game's Arras() object
        // but importTheme calls a different function (applyTheme) that will take in a theme obj and change the game's visual properties
        importTheme() {
            var themeToImport = this.importedTheme;
            themeToImport = themeToImport.trim();

            if (themeToImport === '') {
                pb.error('Enter theme in box to the left');
                return;
            }

            // Tiger themes start with TIGER, and then _<datatype>, e.g. TIGER_JSON{valid json here}
            if (themeToImport.startsWith('TIGER')) {
                if (themeToImport.startsWith('TIGER_JSON')) {
                    // remove TIGER_JSON from start of string
                    themeToImport = themeToImport.substring( 'TIGER_JSON'.length );
                    themeToImport = JSON.parse(themeToImport);
                }
                else {
                    console.log('invalid tiger theme format')
                }
            }
            // standard arras theme, either base64 or normal JSON
            // use functions provided by CX to handle these
            else {
                themeToImport = this.parseArrasTheme(themeToImport);

                var newTheme = {
                    themeDetails: {
                        name: themeToImport.name,
                        author: themeToImport.author,
                    },
                    config: {
                        themeColor: {
                            border: themeToImport.content.border,
                            table: [],
                        },
                    },
                }

                // add colors
                for (var colorName of this.colorNames) {
                    var importedColorNameValue = themeToImport.content[colorName];
                    (newTheme.config.themeColor.table).push( importedColorNameValue );
                }

                // put the correctly formatted js object back into the themeToImport variable
                // to match the other branches of the if statement
                themeToImport = newTheme;
            }

            /* At this point, themeToImport should contain a js object mirroring the structure of this.config */
            console.log('Imported Theme has been parsed as:');
            console.log(themeToImport)

            // clear the import theme textarea
            this.importedTheme = '';

            // use the js object to change the game's colors
            this.applyTheme(themeToImport);
        },

        // takes in a themeObj, and changes the games visual properties using it
        // be careful not to simply assign this.config to a new object, 
        // because that will remove it being a reference to the actual game's Arras() object
        // similarly, you can only directly change the atomic properties + arrays (not objects)
        applyTheme(themeObj) {
            // this function will create a new identical theme to remove reference to original theme object
            // this prevents future theme modifications from screwing with the original theme
            var newTheme = JSON.parse( JSON.stringify(themeObj) );

            this.themeDetails = newTheme.themeDetails;
            
            for (var category in newTheme.config) {
                for (var property in newTheme.config[category]) {
                    this.config[category][property] = newTheme.config[category][property];
                }
            }

            pb.success('Theme Imported!');
        },
        
        // saves the current settings in the editor/extras as a new theme in savedThemes
        saveCurrentTheme() {
            // perforance.now uses milliseconds, so we divide by 1000 to convert to seconds
            var timeButtonWasHeldFor = (performance.now() - this.buttonClickStartTime.saveCurrentTheme) / 1000;

            // button held for less than 3 sec
            if (timeButtonWasHeldFor < 3) {
                // clear the hold for 3 sec notification
                pb.clear();
                return;
            }
            // no author/name entered
            if (this.themeDetails.author.trim() === '' || this.themeDetails.name.trim() === '') {
                pb.error('Enter theme name and author!');
                return;
            }
            
            // actual theme saving stuff
            var themeToSave = {
                themeDetails: this.themeDetails,
                config: this.config,
            };

            // create new identical theme to remove reference to the 'this' obj
            // so that future changes won't modify the theme being saved
            themeToSave = JSON.parse( JSON.stringify(themeToSave) );

            // add new theme to start of the list
            this.savedThemes.unshift(themeToSave);

            pb.success('Saved ' + themeToSave.themeDetails.name + ' by ' + themeToSave.themeDetails.author);
        },
        // delete a theme previously saved
        // only allow this function to complete if user holds down click for 3 seconds
        deleteSavedTheme(indexInSavedThemes) {
            // perforance.now uses milliseconds, so we divide by 1000 to convert to seconds
            var timeButtonWasHeldFor = (performance.now() - this.buttonClickStartTime.deleteTheme) / 1000;
            
            if (timeButtonWasHeldFor < 3) {
                // clear the hold click notification
                pb.clear();
                return;
            }

            var deletedThemeDetails = this.savedThemes[indexInSavedThemes].themeDetails;
            // splice will do the actual deleting
            this.savedThemes.splice(indexInSavedThemes, 1);
            pb.success('Deleted ' + deletedThemeDetails.name + ' by ' + deletedThemeDetails.author);
        },



        // Thank you to CX for providing this:
        // converts standard arras themes (BOTH base64 and JSON) into a JSON object,
        // in the same format as the standard arras JSON themes { name: "", author: "", content: {} }
        parseArrasTheme(string){
            // Compact Base64 Theme Format
            // - stored as a regular base64 string without trailing equal signs
            // name + \0 + author + \0 + border byte + (RGB colors)*
        
            try {
            let stripped = string.replace(/\s+/g, '')
            if (stripped.length % 4 == 2)
                stripped += '=='
            else if (stripped.length % 4 == 3)
                stripped += '='
            let data = atob(stripped)
        
            let name = 'Unknown Theme', author = ''
            let index = data.indexOf('\x00')
            if (index === -1) return null
            name = data.slice(0, index) || name
            data = data.slice(index + 1)
            index = data.indexOf('\x00')
            if (index === -1) return null
            author = data.slice(0, index) || author
            data = data.slice(index + 1)
            let border = data.charCodeAt(0) / 0xff
            data = data.slice(1)
            let paletteSize = Math.floor(data.length / 3)
            if (paletteSize < 2) return null
            let colorArray = []
            for (let i = 0; i < paletteSize; i++) {
                let red = data.charCodeAt(i * 3)
                let green = data.charCodeAt(i * 3 + 1)
                let blue = data.charCodeAt(i * 3 + 2)
                let color = (red << 16) | (green << 8) | blue
                colorArray.push('#' + color.toString(16).padStart(6, '0'))
            }
            let content = {
                teal:     colorArray[0],
                lgreen:   colorArray[1],
                orange:   colorArray[2],
                yellow:   colorArray[3],
                lavender: colorArray[4],
                pink:     colorArray[5],
                vlgrey:   colorArray[6],
                lgrey:    colorArray[7],
                guiwhite: colorArray[8],
                black:    colorArray[9],
        
                blue:     colorArray[10],
                green:    colorArray[11],
                red:      colorArray[12],
                gold:     colorArray[13],
                purple:   colorArray[14],
                magenta:  colorArray[15],
                grey:     colorArray[16],
                dgrey:    colorArray[17],
                white:    colorArray[18],
                guiblack: colorArray[19],
        
                paletteSize,
                border,
            }
            return { name, author, content }
            } catch (e) {}
            try {
            let output = JSON.parse(string)
            if (typeof output !== 'object')
                return null
            let { name = 'Unknown Theme', author = '', content } = output
        
            for (let colorHex of [
                content.teal,
                content.lgreen,
                content.orange,
                content.yellow,
                content.lavender,
                content.pink,
                content.vlgrey,
                content.lgrey,
                content.guiwhite,
                content.black,
        
                content.blue,
                content.green,
                content.red,
                content.gold,
                content.purple,
                content.magenta,
                content.grey,
                content.dgrey,
                content.white,
                content.guiblack,
            ]) {
                if (!/^#[0-9a-fA-F]{6}$/.test(colorHex))
                return null
            }
        
            return {
                isJSON: true,
                name: (typeof name === 'string' && name) || 'Unknown Theme',
                author: (typeof author === 'string' && author) || '',
                content,
            }
            } catch (e) {}
        
            return null
        },


        // make the game colors random
        randomizeColors() {
            function getRandomColor() {
                const chars = "0123456789ABCDEF";
                let color = "#";
                
                for (let i = 0; i < 6; ++i) {
                    let charIndex = Math.floor(Math.random() * 16);
                    color += chars[charIndex];
                }
                return color;
            }

            const numColors = this.colorNames.length;
            const newColors = [];
            for (let i = 0; i < numColors; i++) {
                newColors.push( getRandomColor() );
            }
            this.config.themeColor.table = newColors;
            console.log(`Game colors changed to [${newColors.join(", ")}]`);
        }
    },

    // function run when Vue instance is first mounted onto the DOM
    // loads savedThemes from
    mounted() {
        // used in case it's users first time using tiger, which means they have no saved themes yet
        // see default theme authors at this link: https://discord.com/channels/372930441826533386/379175293149118465/398373439133712384
        var defaultSavedThemes = [
            {"themeDetails":{"name":"Light Colors","author":"Neph"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#7adbbc","#b9e87e","#e7896d","#fdf380","#b58efd","#ef99c3","#e8ebf7","#aa9f9e","#ffffff","#484848","#3ca4cb","#8abc3f","#e03e41","#efc74b","#8d6adf","#cc669c","#a7a7af","#726f6f","#dbdbdb","#000000"],"border":0.5}}}
            ,
            {"themeDetails":{"name":"Dark Colors","author":"Neph"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#8975b7","#1ba01f","#c46748","#b2b224","#7d56c5","#b24fae","#1e1e1e","#3c3a3a","#000000","#e5e5e5","#379fc6","#30b53b","#ff6c6e","#ffc665","#9673e8","#c8679b","#635f5f","#73747a","#11110f","#ffffff"],"border":0.5}}}
            ,
            {"themeDetails":{"name":"Natural","author":"Neph"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#76c1bb","#aad35d","#e09545","#ffd993","#939fff","#d87fb2","#c4b6b6","#7f7f7f","#ffffff","#373834","#4f93b5","#00b659","#e14f65","#e5bf42","#8053a0","#b67caa","#998f8f","#494954","#a5b2a5","#000000"],"border":0.5}}}
            ,
            {"themeDetails":{"name":"Classic","author":"Neph"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#8efffb","#85e37d","#fc7676","#ffeb8e","#b58eff","#f177dd","#cdcdcd","#999999","#ffffff","#525252","#00b0e1","#00e06c","#f04f54","#ffe46b","#768cfc","#be7ff5","#999999","#545454","#c0c0c0","#000000"],"border":0.5}}}
            ,
            /* https://discord.com/channels/372930441826533386/380128318076223489/398339465166192641 */
            {"themeDetails":{"name":"Forest","author":"Sterlon"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#884aa5","#8c9b3e","#d16a80","#97596d","#499855","#60294f","#ddc6b8","#7e949e","#ffffe8","#665750","#807bb6","#a1be55","#e5b05b","#ff4747","#bac674","#ba78d1","#998866","#529758","#7da060","#000000"],"border":0.5}}}
            ,
            /* https://discord.com/channels/372930441826533386/380128318076223489/398358280784838656 */
            {"themeDetails":{"name":"Midnight","author":"uoiea"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#2b9098","#4baa5d","#345678","#cdc684","#89778e","#a85c90","#cccccc","#a7b2b7","#bac6ff","#091f28","#123455","#098765","#000013","#566381","#743784","#b29098","#555555","#649eb7","#444444","#000000"],"border":0.5}}}
            ,
            /* https://discord.com/channels/372930441826533386/380128318076223489/398368953921175553 */
            {"themeDetails":{"name":"Snow","author":"Deolveopoler"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#89bfba","#b5d17d","#e5e0e0","#b5bbe5","#939fff","#646de5","#b2b2b2","#7f7f7f","#ffffff","#383835","#aeaeff","#aeffae","#ffaeae","#ffffff","#c3c3d8","#ffb5ff","#cccccc","#a0a0b2","#f2f2f2","#000000"],"border":0.5}}}
            ,
            /* https://discord.com/channels/372930441826533386/380128318076223489/398633942661595147 */
            {"themeDetails":{"name":"Coral Reef","author":"Celesteα"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#76eec6","#41aa78","#ff7f50","#ffd250","#dc3388","#fa8072","#8b8886","#bfc1c2","#ffffff","#12466b","#4200ae","#0d6338","#dc4333","#fea904","#7b4bab","#5c246e","#656884","#d4d7d9","#3283bc","#000000"],"border":0.5}}}
            ,
            /* https://discord.com/channels/372930441826533386/380128318076223489/398638773392375819 */
            {"themeDetails":{"name":"Badlands","author":"Incognious"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#f9cb9c","#f1c232","#38761d","#e69138","#b7b7b7","#78866b","#6aa84f","#b7b7b7","#a4c2f4","#000000","#0c5a9e","#6e8922","#5b0000","#783f04","#591c77","#20124d","#2f1c16","#999999","#543517","#ffffff"],"border":0.5}}}
            ,
            /* https://discord.com/channels/372930441826533386/380128318076223489/398631247879995414 */
            {"themeDetails":{"name":"Bleach","author":"definitelynot."},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#00ffff","#00ff00","#ff3200","#ffec00","#ff24a7","#ff3cbd","#fff186","#918181","#f1f1f1","#5f5f5f","#0025ff","#00ff00","#ff0000","#fffa23","#3100ff","#d4d3d3","#838383","#4c4c4c","#fffefe","#000000"],"border":0.5}}}
            ,
            /* https://discord.com/channels/372930441826533386/380128318076223489/398626876249210881 */
            {"themeDetails":{"name":"Space","author":"Call"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#4788f3","#af1010","#ff0000","#82f850","#ffffff","#57006c","#ffffff","#272727","#000000","#7f7f7f","#0e1b92","#0aeb80","#c2b90a","#3e7e8c","#285911","#a9707e","#6f6a68","#2d0738","#000000","#ffffff"],"border":0.5}}}
            ,
            /* https://discord.com/channels/372930441826533386/380128318076223489/398635479022567435 */
            {"themeDetails":{"name":"Nebula","author":"Deleted User"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#38b06e","#22882e","#d28e7f","#d5d879","#e084eb","#df3e3e","#f0f2cc","#7d7d7d","#c2c5ef","#161616","#9274e6","#89f470","#e08e5d","#ecdc58","#58cbec","#ea58ec","#7e5713","#303030","#555555","#ffffff"],"border":0.5}}}
            ,
            {"themeDetails":{"name":"Pumpkin Skeleton","author":"Road"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#721970","#ff6347","#1b713a","#fdf380","#941100","#194417","#1b713a","#aa9f9e","#fed8b1","#484848","#3ca4cb","#76eec6","#f04f54","#1b713a","#1b713a","#cc669c","#ffffff","#726f6f","#ff9b58","#000000"],"border":"3.3"}}} /* Its supposed to be in quotes (Pumpkin Skeleton border) */
            ,
            {"themeDetails":{"name":"Solarized Dark","author":"Road"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#b58900","#2aa198","#cb4b16","#657b83","#eee8d5","#d33682","#e0e2e4","#073642","#ffffff","#000000","#268bd2","#869600","#dc322f","#b58900","#678cb1","#a082bd","#839496","#073642","#002b36","#000000"],"border":0.5}}}
            ,
            {"themeDetails":{"name":"Desert","author":"Road"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#783b31","#f5deb3","#e17d70","#dfab79","#b9a9bb","#c1938e","#a88e80","#ccb78e","#ffffff","#555555","#007ba7","#2e8b57","#e44d2e","#ddcf70","#5b968f","#856088","#989b9d","#9e8171","#ceb385","#000000"],"border":0.5}}}
            ,
            {"themeDetails":{"name":"Eggplant","author":"Road"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#e96ba8","#78d4b6","#d6100f","#a39e9b","#e7e9db","#e96ba8","#8d8687","#2b1a29","#ffffff","#2b1a29","#06b6ef","#48b685","#ef6155","#f99b15","#815ba4","#fec418","#b9b6b0","#40113f","#50374d","#000000"],"border":0.5}}}
            ,
            {"themeDetails":{"name":"Gruvbox","author":"Road"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#83a598","#8ec07c","#d65d0e","#d79920","#d3869b","#d3869b","#bdae93","#aa9f9e","#ebddd2","#000000","#458588","#98971a","#cc241d","#d79920","#417b58","#b16186","#928374","#000000","#282828","#000000"],"border":"0.6"}}}
            ,
            {"themeDetails":{"name":"Depths","author":"Skrialik"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#fec700","#b51a00","#ffdbd8","#573400","#b58efd","#cde9b5","#cbf1ff","#aa9f9e","#ffffff","#000000","#002e7a","#375719","#000000","#fff2d5","#f4a4c0","#561029","#c1c1c1","#7a7a7a","#434343","#ffffff"],"border":0.7019607843137254}}}
            ,

            // Theme contest winners below, except Solarized Dark and Eggplant which were already included

            {"themeDetails":{"name":"Retro","author":"Damocles"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"renderNames":true,"censorNames":false,"darkBorders":false,"neon":false,"alternateBorder":false,"coloredNest":false},"gui":{"enabled":true,"scale":1,"alcoveSize":200,"spacing":20,"leaderboard":true,"barChunk":5},"themeColor":{"table":["#ffff62","#06bf3b","#318e95","#937d00","#eee8d5","#e72c76","#c8d8e7","#073642","#ffffff","#000000","#2c3eb9","#efb209","#b91234","#82dfe4","#1e616a","#8b124c","#839496","#76b68b","#081e20","#000000"],"border":0.7529411764705882}}}
            ,
            {"themeDetails":{"name":"Pastel","author":"Damocles"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"renderNames":true,"censorNames":false,"darkBorders":false,"neon":false,"alternateBorder":false,"coloredNest":false},"gui":{"enabled":true,"scale":1,"alcoveSize":200,"spacing":20,"leaderboard":true,"barChunk":5},"themeColor":{"table":["#ffff98","#8affb2","#d8b384","#ffeb76","#eee8d5","#ff8dbd","#f3f0d7","#073642","#ffffb5","#675240","#397697","#3ff7a1","#f65f64","#d2b869","#81654a","#a75299","#c1c1c1","#8da996","#f5dba7","#000000"],"border":0.7529411764705882}}}
            ,
            {"themeDetails":{"name":"Discord","author":"Damocles"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"renderNames":true,"censorNames":false,"darkBorders":false,"neon":false,"alternateBorder":false,"coloredNest":false},"gui":{"enabled":true,"scale":1,"alcoveSize":200,"spacing":20,"leaderboard":true,"barChunk":5},"themeColor":{"table":["#d53f3f","#29b399","#ff2828","#ffeb8e","#b58eff","#ff68ff","#cdcdcd","#999999","#e0e0e0","#000000","#7289da","#43b581","#f04747","#ffe800","#5c79ff","#faa419","#999999","#545454","#1e2124","#36393e"],"border":0.7529411764705882}}}
            ,
            {"themeDetails":{"name":"WR Sheet Theme","author":"alettera"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"renderNames":true,"censorNames":false,"darkBorders":false,"neon":false,"alternateBorder":false,"coloredNest":false},"gui":{"enabled":true,"scale":1,"alcoveSize":200,"spacing":20,"leaderboard":true,"barChunk":5},"themeColor":{"table":["#fd9827","#689168","#bb8e75","#f5deba","#9e8171","#b35757","#eae0c9","#aa9f9e","#ffffff","#795548","#6bb2bf","#68c56c","#b86358","#d8bc67","#6e78aa","#846187","#868788","#726f6f","#cbb690","#000000"],"border":0.2980392156862745}}}
            ,
            {"themeDetails":{"name":"Descent","author":"Rog456"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"renderNames":true,"censorNames":false,"darkBorders":false,"neon":false,"alternateBorder":false,"coloredNest":false},"gui":{"enabled":true,"scale":1,"alcoveSize":200,"spacing":20,"leaderboard":true,"barChunk":5},"themeColor":{"table":["#95cecf","#ffa5ff","#bc8989","#ffffb2","#000000","#bd91c4","#7f7360","#000000","#ffffff","#000000","#ababab","#a69768","#545454","#fde7a5","#878777","#85a686","#c4bb9d","#2e2e32","#3b3b37","#000000"],"border":0}}}
            ,
        ];

        defaultSavedThemes = JSON.stringify(defaultSavedThemes);

        // localStorage returns a string, and I think GM_ storage does too?
        var tigerSavedThemes = GM_getValue('tigerSavedThemes', defaultSavedThemes);
        tigerSavedThemes = JSON.parse(tigerSavedThemes);

        // load the stored themes into our savedThemes variable
        this.savedThemes = tigerSavedThemes;

        console.log('Retrieved the following themes from storage:');
        console.log(tigerSavedThemes);

        /*----------*/
        // tigerCurrentTheme stuff starts here:

        // first load the most up-to-date Arras() into config, 
        // in case new features were added recently that aren't in the saved currentTheme
        this.config = Arras();

        // Next, load the 'tigerCurrentTheme' if there is one, else use the current game colors
        // this holds the theme that the user had loaded on their previous game session
        var tigerCurrentTheme = GM_getValue( 'tigerCurrentTheme', JSON.stringify(Arras()) );
        tigerCurrentTheme = JSON.parse(tigerCurrentTheme);

        // do same for themeDetails
        var defaultTigerCurrentThemeDetails = {name: '', author: ''};
        defaultTigerCurrentThemeDetails =  JSON.stringify(defaultTigerCurrentThemeDetails);
        var tigerCurrentThemeDetails = GM_getValue( 'tigerCurrentThemeDetails', defaultTigerCurrentThemeDetails);
        tigerCurrentThemeDetails = JSON.parse(tigerCurrentThemeDetails);

        // this is to get the input to applyTheme into the right format so it will work properly
        tigerCurrentTheme = {
            themeDetails: tigerCurrentThemeDetails,
            config: tigerCurrentTheme,
        };

        // finally apply the saved theme if there is one to the actual game colors (and this.config as well)
        this.applyTheme(tigerCurrentTheme);

        console.log('Retrieved and applied this current theme from storage:');
        console.log(tigerCurrentTheme);
    },

    // store stuff to storage when they change
    watch: {
        // re-save this.savedThemes array to storage's tigerSavedThemes key whenever this.savedThemes changes
        savedThemes(newVal) {
            // save new savedThemes array to storage
            GM_setValue( 'tigerSavedThemes', JSON.stringify(newVal) );

            console.log('Saved the following savedThemes to storage:');
            console.log(newVal);
        },

        // re-save the themeDetails whenever they change
        // deep:true is because we want to detect if the object's keys change, not if
        // the object itself is changed to be a reference to a different object
        themeDetails: {
            deep: true,
            handler: function(newVal) {
                // save new themeDetails object to storage
                GM_setValue( 'tigerCurrentThemeDetails', JSON.stringify(newVal) );

                console.log('Saved the following currentThemeDetails to storage:');
                console.log(newVal);
            },
        },
    },

    // since config is so heavily nested, the deep:true stuff isn't working for it 
    // (in the userscript and game at least, the website seems to work fine for some reason (maybe because website's config isn't a reference to the actual game config object)??)
    // so instead, we grab and store its value from the Arras() object right before the page unloads (this won't work for the website though because it's Arras() object doesn't change)
    created() {
        // need to use Arras() object because Vue instance won't exist at this point in time
        window.addEventListener("beforeunload", function() {
            GM_setValue('tigerCurrentTheme', JSON.stringify(Arras()) );

            console.log('Saved the following currentTheme to storage:');
            console.log( JSON.stringify(Arras()) );
        });
    },
});

}


