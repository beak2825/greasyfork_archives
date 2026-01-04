// ==UserScript==
// @name         Neon's bonk.io bonkery mod
// @namespace    https://bonk.io/
// @version      2.3
// @description  neon's bonk.io bonkery mod or nbbm waddahell (ANIMATED THEMES)
// @author       iNeonz
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-idle
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bonk.io
// @downloadURL https://update.greasyfork.org/scripts/473021/Neon%27s%20bonkio%20bonkery%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/473021/Neon%27s%20bonkio%20bonkery%20mod.meta.js
// ==/UserScript==
Notification.requestPermission();
const gameStyle = document.createElement('style');

function startGame(state,noJoin,extraTime,extraAuthor){
    if (state){
        window.nbm.applyState = true;
        window.nbm.savedState = state;
        window.nbm.noJoin = noJoin;
        window.nbm.extraTime = extraTime || 30;
        window.nbm.extraAuthor = extraAuthor;
        for(let cb of Object.keys(window.nbm.cbs)) {
            window.nbm.cbs[cb]("startGame");
        }
    }else{
        if (!window.nbm || !window.nbm.cbs){
            document.getElementById("newbonklobby_editorbutton").click();
            document.getElementById("mapeditorcontainer").style.display = 'none';
            document.getElementById("mapeditor_midbox_testbutton").click();
            document.getElementById("mapeditor_close").click();
        }else{
            for(let cb of Object.keys(window.nbm.cbs)) {
                window.nbm.cbs[cb]("startGame");
            }
        }
    }
}


let arrangeDelay = 0;
let lastAddress = '';
document.head.appendChild(gameStyle);
window.hescape = (s) => {
    let lookup = {'$':'&#36;','%':'&#37;','.':'&#46;','+':'&#43;','-':'&#45;','&':"&amp;",'"': "&quot;",'\'': "&apos;",'<': "&lt;",'*':'&#42;','=':'&#61;','>': "&gt;",'#':'&#35;',':':'&#58;',';':'&#59;','`':'&#96;'};
    return s.replace( /[\*=%#\-+&"'<>]/g, c => lookup[c] );
}

window.addEventListener('resize',() => {
    arrangeDelay = 10; // This is so the sprites from nbm don't bug out.
})

window.destroySelf = (self) => {
    self.parentElement.remove();
}

window.hidePacketDebugger = () => {
    document.getElementById('packetdebugger').style.display = 'none';
}

let currentPet = window.localStorage.getItem('pet-nbm') || -1;

window.alert = (msg,title) => {
    let div = document.createElement('div');
    document.body.appendChild(div);
    div.outerHTML = `<div tabindex="-1" data-dragable="true" class="roomlistcreatewindowlabel newbonklobby_elementcontainer" style="overflow: visible; text-align: center; vertical-align: middle; line-height: 20px; border-radius: 8px; z-index: 9999999999; resize: both; height: 200px; width: 500px; position: absolute; left: ${window.innerWidth/2-250}px; top: ${window.innerHeight/2-100}px;">
    <div class="windowTopBar">
         ${title || "alert"}
    </div>
    <div class="brownButton" style="border-radius: 100px; width: 30px; height: 30px; position: absolute; right: -15px; top: -15px;" onclick="destroySelf(this);"></div>
    <div style="border-radius: 8px; background-color: rgb(255,255,255,0.05); width: calc(100% - 20px); height: calc(100% - 50px); position: absolute; top: 40px; left: 10px;">
    ${msg}
    </div>
    </div>`
    dragElement(div);
}

function dragElement(elmnt) {
    elmnt.onmousedown = dragMouseDown;
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        elmnt.focus();
    }
}
// #009688
let recordingChat = false;
let recorded = [];
let lastExecutedFps = 0;

let stillPos = [0,0];
let still = false;

let muteNotify = window.localStorage.getItem('notify') || false;
let styles = [
    {
        name: 'Default',
        buttons: {
            color: '#795548',
            hovercolor: '#956a5b',
        },
        containerTop: {
            color: '#009688',
            //BgImage: 'url'
        },
        containerBg: {
            color: '#e2e2e2',
            //BgImage: 'url'
        },
        roomList: {
            oddColor: 'none',
            evenColor: 'none'
        }
    },
    {
        name: 'Discord',
        msgColor: 'white',
        buttons: {
            color: '#1e2124',
            hovercolor: '#7289da',
            text: 'white',
        },
        containerTop: {
            color: '#7289da',
            text: 'white',
            //BgImage: 'url'
        },
        containerBg: {
            color: '#1e2124',
            //BgImage: 'url'
        },
        roomList: {
            oddColor: '#282b30',
            evenColor: '#1e2124',
        },
    },
    {
        name: 'Flowers',
        msgColor: 'white',
        buttons: {
            color: 'black',
            hovercolor: 'white',
        },
        containerTop: {
            color: 'none',
            BgImage: 'https://cdn.discordapp.com/attachments/1128508277827846206/1133848926731120710/rain.png'
        },
        containerBg: {
            color: 'none',
            BgImage: 'https://cdn.discordapp.com/attachments/1128508277827846206/1133848926731120710/rain.png'
        },
        roomList: {
            oddColor: 'none',
            evenColor: 'none'
        }
    },
    {
        name: 'breakdancin\'',
        msgColor: 'white',
        buttons: {
            color: 'black',
            hovercolor: 'white',
        },
        containerTop: {
            color: 'none',
            BgImage: 'https://cdn.discordapp.com/attachments/1128508277827846206/1133848925904851075/hollow.gif'
        },
        containerBg: {
            color: 'none',
            BgImage: 'https://cdn.discordapp.com/attachments/1128508277827846206/1133848925904851075/hollow.gif'
        },
        roomList: {
            oddColor: 'none',
            evenColor: 'none'
        }
    },
    {
        name: 'crumb go brr',
        msgColor: 'black',
        buttons: {
            color: 'black',
            hovercolor: 'white',
        },
        containerTop: {
            color: 'none',
            BgImage: 'https://cdn.discordapp.com/attachments/1128508277827846206/1137233210900762694/crumb.gif'
        },
        containerBg: {
            color: 'none',
            BgImage: 'https://cdn.discordapp.com/attachments/1128508277827846206/1137233210900762694/crumb.gif'
        },
        roomList: {
            oddColor: 'none',
            evenColor: 'none'
        }
    },
    {
        name: 'isaac dancing thing',
        msgColor: 'white',
        buttons: {
            color: 'black',
            hovercolor: 'white',
        },
        containerTop: {
            color: 'none',
            BgImage: 'https://cdn.discordapp.com/attachments/1128508277827846206/1133848926299099166/isaacgif.gif'
        },
        containerBg: {
            color: 'none',
            BgImage: 'https://cdn.discordapp.com/attachments/1128508277827846206/1133848926299099166/isaacgif.gif'
        },
        roomList: {
            oddColor: 'none',
            evenColor: 'none'
        }
    },
    {
        name: 'Space Clouds',
        msgColor: 'white',
        buttons: {
            color: 'black',
            hovercolor: 'white',
        },
        containerTop: {
            color: 'none',
            BgImage: 'https://cdn.discordapp.com/attachments/1128508277827846206/1133848925447663686/galaxy.gif'
        },
        containerBg: {
            color: 'none',
            BgImage: 'https://cdn.discordapp.com/attachments/1128508277827846206/1133848925447663686/galaxy.gif'
        },
        roomList: {
            oddColor: 'none',
            evenColor: 'none'
        }
    },
    {
        name: 'Celeste',
        msgColor: 'white',
        buttons: {
            color: 'black',
            hovercolor: 'white',
        },
        containerTop: {
            color: 'none',
            BgImage: 'https://cdn.discordapp.com/attachments/1128508277827846206/1133848924973699223/celeste.gif'
        },
        containerBg: {
            color: 'none',
            BgImage: 'https://cdn.discordapp.com/attachments/1128508277827846206/1133848924973699223/celeste.gif'
        },
        roomList: {
            oddColor: 'none',
            evenColor: 'none'
        }
    },
    {
        name: 'Memorial',
        msgColor: 'white',
        buttons: {
            color: 'black',
            hovercolor: 'white',
        },
        containerTop: {
            color: 'none',
            BgImage: 'https://cdn.discordapp.com/attachments/1128508277827846206/1133848924973699223/celeste.gif'
        },
        containerBg: {
            color: 'none',
            BgImage: 'https://cdn.discordapp.com/attachments/1128508277827846206/1137513132638609458/memorial.gif'
        },
        roomList: {
            oddColor: 'none',
            evenColor: 'none'
        }
    },
    {
        name: 'Glass',
        buttons: {
            color: 'none',
            hovercolor: 'none',
        },
        containerTop: {
            color: 'none',
            //BgImage: 'url'
        },
        containerBg: {
            color: 'none',
            //BgImage: 'url'
        },
        roomList: {
            oddColor: 'none',
            evenColor: 'none'
        }
    }
];

let summonables = {
    motoBottom: {
     body: `
     {
    "type": "d",
    "p": [
        30.416666666666668,
        20.833333333333332
    ],
    "a": 0,
    "av": 0,
    "lv": [
        0,
        0
    ],
    "ld": 0,
    "ad": 0,
    "fr": false,
    "bu": true,
    "fx": [
        0,
        1,
        2,
        3,
        4
    ],
    "fric": 0,
    "fricp": false,
    "de": 0.05,
    "re": -5,
    "f_c": 1,
    "f_p": true,
    "f_1": true,
    "f_2": true,
    "f_3": true,
    "f_4": true,
    "fz": {
        "on": false,
        "x": 0,
        "y": 0,
        "d": true,
        "p": true,
        "a": true
    },
    "cf": {
        "x": 0,
        "y": -0.6666666666666666,
        "w": true,
        "ct": 0
    }
}
     `,
      fixtures: `
      [
    {
        "sh": 0,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 2565927,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 1,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 2565927,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 2,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 1910201,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 3,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 2565927,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 4,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 1910201,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    }
]
      `,
        shapes: `
        [
    {
        "type": "ci",
        "r": 0.08333333333333333,
        "c": [
            -0.5,
            1.6666666666666667
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.8333333333333334,
        "c": [
            -1.5,
            2.5
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.4166666666666667,
        "c": [
            -1.5,
            2.5
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.8333333333333334,
        "c": [
            1.5,
            2.5
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.4166666666666667,
        "c": [
            1.5,
            2.5
        ],
        "sk": false
    }
]
        `
    },
    motoBody: {
      body: `
    {
    "type": "d",
    "p": [
        30.416666666666668,
        20.833333333333332
    ],
    "a": 0,
    "av": 0,
    "lv": [
        0,
        0
    ],
    "ld": 0,
    "ad": 999,
    "fr": false,
    "bu": true,
    "fx": [
        6,
        0,
        1,
        2,
        3,
        4,
        5,
        7,
        8,
        9,
        10,
        11,
        12
    ],
    "fric": 0,
    "fricp": false,
    "de": 0.1,
    "re": -5,
    "f_c": 1,
    "f_p": true,
    "f_1": true,
    "f_2": true,
    "f_3": true,
    "f_4": true,
    "fz": {
        "on": false,
        "x": 0,
        "y": 0,
        "d": true,
        "p": true,
        "a": true
    },
    "cf": {
        "x": 0,
        "y": -0.4666666666666666,
        "w": true,
        "ct": 0
    }
}
      `,
       fixtures: `
      [
    {
        "sh": 0,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 1910201,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 1,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 6184542,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 2,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 1910457,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 3,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 6184542,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 4,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 6184542,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 5,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 1910201,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 6,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 2565927,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 7,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 2565927,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 8,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 6184542,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 9,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 6184542,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 10,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 6184542,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 11,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 6184542,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 12,
        "n": "Unnamed Shape",
        "fr": 0.1,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    }
]
       `,
        shapes: `
      [
    {
        "type": "bx",
        "w": 1.4166666666666667,
        "h": 0.4166666666666667,
        "c": [
            1.1666666666666667,
            0.8333333333333334
        ],
        "a": 1.373400766945016,
        "sk": false
    },
    {
        "type": "bx",
        "w": 3.25,
        "h": 0.16666666666666666,
        "c": [
            -0.3333333333333333,
            1.3333333333333333
        ],
        "a": 0,
        "sk": false
    },
    {
        "type": "po",
        "v": [
            [
                1.3333333333333333,
                1.25
            ],
            [
                0.4166666666666667,
                0.8333333333333334
            ],
            [
                0,
                1.3333333333333333
            ],
            [
                -1.1666666666666667,
                1.3333333333333333
            ],
            [
                -1.9166666666666667,
                1.0833333333333333
            ],
            [
                -1.9166666666666667,
                1.4166666666666667
            ],
            [
                -1.25,
                1.5
            ],
            [
                1.4166666666666667,
                1.5
            ]
        ],
        "s": 1,
        "a": 0,
        "c": [
            0,
            0
        ]
    },
    {
        "type": "po",
        "v": [
            [
                -1.0833333333333333,
                1.4166666666666667
            ],
            [
                -0.3333333333333333,
                1.4166666666666667
            ],
            [
                -0.25,
                2
            ],
            [
                -0.9166666666666666,
                1.8333333333333333
            ]
        ],
        "s": 1,
        "a": 0,
        "c": [
            0,
            0
        ]
    },
    {
        "type": "po",
        "v": [
            [
                -0.41666666666666663,
                1.75
            ],
            [
                0.4166666666666667,
                1.4166666666666667
            ],
            [
                0.9166666666666666,
                1.5
            ],
            [
                0.8333333333333333,
                1.6666666666666667
            ],
            [
                0.5,
                1.6666666666666667
            ],
            [
                0.08333333333333333,
                2.1666666666666665
            ],
            [
                -0.08333333333333333,
                2.0833333333333335
            ],
            [
                0.25,
                1.75
            ]
        ],
        "s": 1,
        "a": 0,
        "c": [
            -0.08333333333333333,
            0
        ]
    },
    {
        "type": "bx",
        "w": 0.8333333333333334,
        "h": 0.3333333333333333,
        "c": [
            1.8333333333333333,
            1.5
        ],
        "a": 0,
        "sk": false
    },
    {
        "type": "po",
        "v": [
            [
                1.3333333333333333,
                -0.25
            ],
            [
                1.5833333333333333,
                -0.16666666666666666
            ],
            [
                1.25,
                0.25
            ],
            [
                1.4166666666666667,
                0.33333333333333337
            ],
            [
                1.3333333333333333,
                0.5
            ],
            [
                1.1666666666666667,
                0.5
            ],
            [
                1.1666666666666667,
                0.8333333333333333
            ],
            [
                0.8333333333333334,
                0.9166666666666666
            ],
            [
                1,
                0.6666666666666666
            ],
            [
                0.5833333333333334,
                0.5833333333333333
            ],
            [
                0.9166666666666666,
                0.5
            ],
            [
                0.6666666666666666,
                0.33333333333333337
            ],
            [
                0.75,
                0.16666666666666669
            ],
            [
                1,
                0
            ],
            [
                1.0833333333333333,
                0.16666666666666669
            ],
            [
                1.4166666666666667,
                -0.25
            ]
        ],
        "s": 1,
        "a": 0,
        "c": [
            0,
            -0.08333333333333333
        ]
    },
    {
        "type": "ci",
        "r": 0.4166666666666667,
        "c": [
            -0.16666666666666666,
            2.4166666666666665
        ],
        "sk": false
    },
    {
        "type": "bx",
        "w": 0.4166666666666667,
        "h": 0.08333333333333333,
        "c": [
            -0.4166666666666667,
            1.6666666666666667
        ],
        "a": 1.5707963267948966,
        "sk": false
    },
    {
        "type": "bx",
        "w": 0.4166666666666667,
        "h": 0.08333333333333333,
        "c": [
            -0.5833333333333334,
            1.8333333333333333
        ],
        "a": 0,
        "sk": false
    },
    {
        "type": "bx",
        "w": 0.4166666666666667,
        "h": 0.08333333333333333,
        "c": [
            -0.6666666666666666,
            1.6666666666666667
        ],
        "a": 1.0122909661567114,
        "sk": false
    },
    {
        "type": "bx",
        "w": 0.3333333333333333,
        "h": 0.08333333333333333,
        "c": [
            -0.5833333333333334,
            1.5
        ],
        "a": 0,
        "sk": false
    },
    {
        "type": "bx",
        "w": 0.2,
        "h": 0.2,
        "c": [
            -1.1966666666666667,
            -0.1166666666666667
        ],
        "a": 0,
        "sk": false
    }
]
        `
    },
    gift: {
        body: `
  {
    "type": "d",
    "p": [
        30.416666666666668,
        20.833333333333332
    ],
    "a": 0,
    "av": -0.1,
    "lv": [
        0,
        -10
    ],
    "ld": 0,
    "ad": 0,
    "fr": false,
    "bu": false,
    "fx": [
        4,
        0,
        1,
        2,
        3,
        5,
        6,
        7,
        8,
        9,
        10
    ],
    "fric": 5,
    "fricp": true,
    "de": 0.5,
    "re": -1,
    "f_c": 1,
    "f_p": true,
    "f_1": true,
    "f_2": true,
    "f_3": true,
    "f_4": true,
    "fz": {
        "on": false,
        "x": 0,
        "y": 0,
        "d": true,
        "p": true,
        "a": true
    },
    "cf": {
        "x": 0,
        "y": -0.6,
        "w": true,
        "ct": 0
    }
}
  `,
        fixtures: `
    [
    {
        "sh": 0,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 14895235,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 1,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 14895235,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 2,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 14895235,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 3,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 14895236,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 4,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 12262751,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 5,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 13574188,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 6,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 13574188,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 7,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 13574188,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 8,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 13574188,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 9,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 13574188,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 10,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 13574188,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    }
]
    `,
        shapes: `
    [
    {
        "type": "bx",
        "w": 4.166666666666667,
        "h": 0.4166666666666667,
        "c": [
            2.0833333333333335,
            0
        ],
        "a": -1.5707963267948966,
        "sk": false
    },
    {
        "type": "bx",
        "w": 4.583333333333333,
        "h": 0.4166666666666667,
        "c": [
            0,
            1.875
        ],
        "a": 0,
        "sk": false
    },
    {
        "type": "bx",
        "w": 4.166666666666667,
        "h": 0.4166666666666667,
        "c": [
            -2.0833333333333335,
            0
        ],
        "a": -1.5707963267948966,
        "sk": false
    },
    {
        "type": "bx",
        "w": 4.583333333333333,
        "h": 0.4166666666666667,
        "c": [
            0,
            -2.2916666666666665
        ],
        "a": 0,
        "sk": false
    },
    {
        "type": "bx",
        "w": 4.166666666666667,
        "h": 4.166666666666667,
        "c": [
            0,
            -0.16666666666666666
        ],
        "a": 0,
        "sk": false
    },
    {
        "type": "bx",
        "w": 4.916666666666667,
        "h": 0.5,
        "c": [
            0.08333333333333333,
            -0.25
        ],
        "a": 1.5707963267948966,
        "sk": false
    },
    {
        "type": "bx",
        "w": 4.916666666666667,
        "h": 0.5,
        "c": [
            1.3333333333333333,
            -0.25
        ],
        "a": 1.5707963267948966,
        "sk": false
    },
    {
        "type": "bx",
        "w": 4.916666666666667,
        "h": 0.5,
        "c": [
            -1.3333333333333333,
            -0.25
        ],
        "a": 1.5707963267948966,
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.3333333333333333,
        "c": [
            0.08333333333333333,
            -2.8333333333333335
        ],
        "sk": false
    },
    {
        "type": "po",
        "v": [
            [
                0.08333333333333333,
                -2.916666666666667
            ],
            [
                -0.33333333333333337,
                -3.3333333333333335
            ],
            [
                -0.5833333333333333,
                -3.416666666666667
            ],
            [
                -0.9166666666666666,
                -3.416666666666667
            ],
            [
                -0.9999999999999999,
                -3.166666666666667
            ],
            [
                -0.9999999999999999,
                -2.8333333333333335
            ],
            [
                -0.75,
                -2.5
            ],
            [
                -0.25,
                -2.416666666666667
            ],
            [
                -0.08333333333333333,
                -2.666666666666667
            ],
            [
                -0.08333333333333333,
                -2.75
            ],
            [
                -0.4166666666666667,
                -2.666666666666667
            ],
            [
                -0.5833333333333333,
                -2.666666666666667
            ],
            [
                -0.75,
                -2.8333333333333335
            ],
            [
                -0.75,
                -3.0833333333333335
            ],
            [
                -0.4166666666666667,
                -3.0833333333333335
            ],
            [
                -0.08333333333333333,
                -3
            ]
        ],
        "s": 1,
        "a": 0,
        "c": [
            0.08333333333333333,
            -0.08333333333333333
        ]
    },
    {
        "type": "po",
        "v": [
            [
                0.08333333333333333,
                -2.9166666666666665
            ],
            [
                0.3333333333333333,
                -3.0833333333333335
            ],
            [
                0.75,
                -3.3333333333333335
            ],
            [
                1,
                -3.1666666666666665
            ],
            [
                1.0833333333333333,
                -3
            ],
            [
                1.0833333333333333,
                -2.6666666666666665
            ],
            [
                0.9166666666666666,
                -2.5
            ],
            [
                0.6666666666666666,
                -2.4166666666666665
            ],
            [
                0.5,
                -2.3333333333333335
            ],
            [
                0.16666666666666666,
                -2.5
            ],
            [
                0.16666666666666666,
                -2.6666666666666665
            ],
            [
                0.3333333333333333,
                -2.6666666666666665
            ],
            [
                0.5833333333333334,
                -2.5833333333333335
            ],
            [
                0.75,
                -2.6666666666666665
            ],
            [
                0.8333333333333334,
                -2.75
            ],
            [
                0.9166666666666666,
                -2.8333333333333335
            ],
            [
                0.8333333333333334,
                -3
            ],
            [
                0.75,
                -3.0833333333333335
            ],
            [
                0.4166666666666667,
                -3
            ]
        ],
        "s": 1,
        "a": 0,
        "c": [
            0,
            0
        ]
    }
]
 `
    },
    skateboard: {
        body: `
{
    "type": "d",
    "p": [
        30.416666666666668,
        20.833333333333332
    ],
    "a": 0,
    "av": 0,
    "lv": [
        0,
        -100
    ],
    "ld": 0,
    "ad": 0,
    "fr": false,
    "bu": true,
    "fx": [
        0,
        1,
        2,
        3,
        4
    ],
    "fric": 0,
    "fricp": true,
    "de": 0.05,
    "re": -1,
    "f_c": 1,
    "f_p": true,
    "f_1": true,
    "f_2": true,
    "f_3": true,
    "f_4": true,
    "fz": {
        "on": false,
        "x": 0,
        "y": 0,
        "d": true,
        "p": true,
        "a": true
    },
    "cf": {
        "x": 0,
        "y": -0.5,
        "w": true,
        "ct": 0
    }
}
`,
        fixtures: `
[
    {
        "sh": 0,
        "n": "Unnamed Shape",
        "fr": 0.01,
        "fp": null,
        "re": -1,
        "de": null,
        "f": 8421504,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 1,
        "n": "Unnamed Shape",
        "fr": 6,
        "fp": null,
        "re": null,
        "de": null,
        "f": 8421504,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 2,
        "n": "Unnamed Shape",
        "fr": 6,
        "fp": null,
        "re": null,
        "de": null,
        "f": 8421504,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 3,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 1644825,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 4,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 1644825,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    }
]
`,
        shapes: `
 [
    {
        "type": "bx",
        "w": 2.0833333333333335,
        "h": 0.4166666666666667,
        "c": [
            0,
            1.25
        ],
        "a": 0,
        "sk": false
    },
    {
        "type": "bx",
        "w": 1,
        "h": 0.5,
        "c": [
            1.11166666666666667,
            0.6
        ],
        "a": -0.8880026035475675,
        "sk": false
    },
    {
        "type": "bx",
        "w": 1,
        "h": 0.5,
        "c": [
            -1.11166666666666667,
            0.6
        ],
        "a": 0.8880031703261417,
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.4166666666666667,
        "c": [
            1,
            1.6333333333333333
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.4166666666666667,
        "c": [
            -1,
            1.6333333333333333
        ],
        "sk": false
    }
]
 `
    },
    wdb: {
        body: `{
    "type": "d",
    "p": [
        30.416666666666668,
        20.833333333333332
    ],
    "a": 0,
    "av": 0,
    "lv": [
        0,
        0
    ],
    "ld": 0,
    "ad": 0,
    "fr": false,
    "bu": false,
    "fx": [
        0,
        1,
        2
    ],
    "fric": -999,
    "fricp": false,
    "de": 0.05,
    "re": -1,
    "f_c": 1,
    "f_p": true,
    "f_1": true,
    "f_2": true,
    "f_3": true,
    "f_4": true,
    "fz": {
        "on": false,
        "x": 0,
        "y": 0,
        "d": true,
        "p": true,
        "a": true
    },
    "cf": {
        "x": 0,
        "y": -0.3333333333333333,
        "w": true,
        "ct": 0
    }
}
    `,
        shapes: `
    [
    {
        "type": "ci",
        "r": 0.975,
        "c": [
            0,
            0
        ],
        "sk": false
    },
    {
        "type": "bx",
        "w": 1.6666666666666667,
        "h": 1.6666666666666667,
        "c": [
            0,
            0
        ],
        "a": 0,
        "sk": false
    },
    {
        "type": "bx",
        "w": 1.6666666666666667,
        "h": 1.6666666666666667,
        "c": [
            0,
            0
        ],
        "a": 0.7853981633974483,
        "sk": false
    }
]
    `,
        fixtures: `
    [
    {
        "sh": 0,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 460551,
        "d": true,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 1,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 460551,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 2,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 460551,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    }
]
    `
    },
    vase: {
        body: `
 {
    "type": "d",
    "p": [
        30.416666666666668,
        20.833333333333332
    ],
    "a": 0,
    "av": 0,
    "lv": [
        0,
        -10
    ],
    "ld": 2,
    "ad": 0,
    "fr": false,
    "bu": true,
    "fx": [
        0,
        1,
        2,
        3,
        4,
        5
    ],
    "fric": 0,
    "fricp": false,
    "de": 5,
    "re": -10,
    "f_c": 1,
    "f_p": true,
    "f_1": true,
    "f_2": false,
    "f_3": false,
    "f_4": false,
    "fz": {
        "on": false,
        "x": 0,
        "y": 0,
        "d": true,
        "p": true,
        "a": true
    },
    "cf": {
        "x": 0,
        "y": -0.6666666666666666,
        "w": true,
        "ct": 0
    }
}
 `,
        fixtures: `
  [
    {
        "sh": 0,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 15724527,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 1,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 15724527,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 2,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 15724527,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 3,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 15724527,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 4,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 15724527,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 5,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 15724527,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    }
]
  `,
        shapes: `
    [
    {
        "type": "bx",
        "w": 1.9166666666666667,
        "h": 0.75,
        "c": [
            -1.4166666666666667,
            0.08333333333333333
        ],
        "a": 1.474985553843536,
        "sk": false
    },
    {
        "type": "bx",
        "w": 2.75,
        "h": 0.4166666666666667,
        "c": [
            -0.25,
            1.0833333333333333
        ],
        "a": -0.01031734407347774,
        "sk": false
    },
    {
        "type": "bx",
        "w": 2.0833333333333335,
        "h": 0.4166666666666667,
        "c": [
            0.75,
            2
        ],
        "a": -1.1071487177940904,
        "sk": false
    },
    {
        "type": "bx",
        "w": 2.0833333333333335,
        "h": 0.4166666666666667,
        "c": [
            -1.0833333333333333,
            2
        ],
        "a": 1.1071478656733509,
        "sk": false
    },
    {
        "type": "bx",
        "w": 2.25,
        "h": 0.4166666666666667,
        "c": [
            -0.16666666666666666,
            2.8333333333333335
        ],
        "a": 0,
        "sk": false
    },
    {
        "type": "po",
        "v": [
            [
                -1.3333333333333333,
                1.1666666666666667
            ],
            [
                1.0833333333333333,
                1.1666666666666667
            ],
            [
                0.4166666666666667,
                2.9166666666666665
            ],
            [
                -0.75,
                2.9166666666666665
            ]
        ],
        "s": 1,
        "a": 0,
        "c": [
            0,
            0
        ]
    }
]
    `
    },
    poop: {
        body: `
  {
    "type": "d",
    "p": [
        30.416666666666668,
        20.833333333333332
    ],
    "a": 0,
    "av": 0,
    "lv": [
        0,
        -90
    ],
    "ld": 0,
    "ad": 0,
    "fr": true,
    "bu": false,
    "fx": [
        0,
        1
    ],
    "fric": 0,
    "fricp": false,
    "de": 999,
    "re": -0.5,
    "f_c": 1,
    "f_p": true,
    "f_1": true,
    "f_2": true,
    "f_3": true,
    "f_4": true,
    "fz": {
        "on": false,
        "x": 0,
        "y": 0,
        "d": true,
        "p": true,
        "a": true
    },
    "cf": {
        "x": 0,
        "y": -0.3333333333,
        "w": true,
        "ct": 0
    }
}
  `,
        fixtures: `
    [
    {
        "sh": 0,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 7356703,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 1,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 7356703,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    }
]
    `,
        shapes: `
    [
    {
        "type": "ci",
        "r": 1,
        "c": [
            0,
            1
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 1,
        "c": [
            0,
            1
        ],
        "sk": false
    }
]
    `
    },
    spicebox: {
        body: `
   {
    "type": "d",
    "p": [
        30.416666666666668,
        20.833333333333332
    ],
    "a": 0,
    "av": 0,
    "lv": [
        0,
        0
    ],
    "ld": 0,
    "ad": 0,
    "fr": false,
    "bu": true,
    "fx": [
        0,
        1,
        2,
        3,
        4
    ],
    "fric": 0,
    "fricp": false,
    "de": 0.15,
    "re": 1,
    "f_c": 1,
    "f_p": true,
    "f_1": true,
    "f_2": true,
    "f_3": true,
    "f_4": true,
    "fz": {
        "on": false,
        "x": 0,
        "y": 0,
        "d": true,
        "p": true,
        "a": true
    },
    "cf": {
        "x": 0,
        "y": 0,
        "w": true,
        "ct": 0
    }
}
    `,
        fixtures: `
    [
    {
        "sh": 0,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 1,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 2,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 3,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 4,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    }
]
    `,
        shapes: `
   [
    {
        "type": "bx",
        "w": 2.75,
        "h": 0.4166666666666667,
        "c": [
            -1.1666666666666667,
            0
        ],
        "a": 1.5707963267948966,
        "sk": false
    },
    {
        "type": "bx",
        "w": 2.75,
        "h": 0.4166666666666667,
        "c": [
            1.1666666666666667,
            0
        ],
        "a": 1.5707963267948966,
        "sk": false
    },
    {
        "type": "bx",
        "w": 2.75,
        "h": 0.4166666666666667,
        "c": [
            0,
            -1.1666666666666667
        ],
        "a": 0,
        "sk": false
    },
    {
        "type": "bx",
        "w": 2.75,
        "h": 0.4166666666666667,
        "c": [
            0,
            1.1666666666666667
        ],
        "a": 0,
        "sk": false
    },
    {
        "type": "bx",
        "w": 2.3333333333333335,
        "h": 2.4166666666666665,
        "c": [
            0,
            0
        ],
        "a": 0,
        "sk": false
    }
]
    `
    },
    attached: {
        invis: true,
        body: `
  {
    "type": "d",
    "p": [
        36.5,
        25
    ],
    "a": 3.141592653589793,
    "av": 0,
    "lv": [
        0,
        0
    ],
    "ld": 0,
    "ad": 0,
    "fr": false,
    "bu": false,
    "fx": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17
    ],
    "fric": 0.5,
    "fricp": false,
    "de": 0.001,
    "re": -1,
    "f_c": 1,
    "f_p": true,
    "f_1": false,
    "f_2": false,
    "f_3": false,
    "f_4": false,
    "fz": {
        "on": false,
        "x": 0,
        "y": 0,
        "d": true,
        "p": true,
        "a": true
    },
    "cf": {
        "x": 0,
        "y": -0.6666666666666666,
        "w": true,
        "ct": 0
    }
}
  `,
        fixtures: `
    [
    {
        "sh": 0,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 1,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 2,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 3,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 4,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 5,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 6,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 7,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 8,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 9,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 10,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 11,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 12,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 13,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 14,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 15,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 16,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 17,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    }
]
    `,
        shapes: `
    [
    {
        "type": "bx",
        "w": 1,
        "h": 0.5,
        "c": [
            3,
            0
        ],
        "a": 1.5707963267948966,
        "sk": false,
        "r": 0,
        "s": 0
    },
    {
        "type": "bx",
        "w": 1,
        "h": 0.5,
        "c": [
            2.8,
            -1
        ],
        "a": 1.2217304763960308,
        "sk": false,
        "r": 0,
        "s": 0
    },
    {
        "type": "bx",
        "w": 1,
        "h": 0.5,
        "c": [
            2.3,
            -1.9
        ],
        "a": 0.8726646259971651,
        "sk": false,
        "r": 0,
        "s": 0
    },
    {
        "type": "bx",
        "w": 1,
        "h": 0.5,
        "c": [
            1.5,
            -2.6
        ],
        "a": 0.5235987755982988,
        "sk": false,
        "r": 0,
        "s": 0
    },
    {
        "type": "bx",
        "w": 1,
        "h": 0.5,
        "c": [
            0.5,
            -3
        ],
        "a": 0.17453292519943273,
        "sk": false,
        "r": 0,
        "s": 0
    },
    {
        "type": "bx",
        "w": 1,
        "h": 0.5,
        "c": [
            -0.5,
            -3
        ],
        "a": -0.17453292519943273,
        "sk": false,
        "r": 0,
        "s": 0
    },
    {
        "type": "bx",
        "w": 1,
        "h": 0.5,
        "c": [
            -1.5,
            -2.6
        ],
        "a": -0.5235987755982987,
        "sk": false,
        "r": 0,
        "s": 0
    },
    {
        "type": "bx",
        "w": 1,
        "h": 0.5,
        "c": [
            -2.3,
            -1.9
        ],
        "a": -0.8726646259971645,
        "sk": false,
        "r": 0,
        "s": 0
    },
    {
        "type": "bx",
        "w": 1,
        "h": 0.5,
        "c": [
            -2.8,
            -1
        ],
        "a": -1.2217304763960306,
        "sk": false,
        "r": 0,
        "s": 0
    },
    {
        "type": "bx",
        "w": 1,
        "h": 0.5,
        "c": [
            -3,
            0
        ],
        "a": 1.5707963267948966,
        "sk": false,
        "r": 0,
        "s": 0
    },
    {
        "type": "bx",
        "w": 1,
        "h": 0.5,
        "c": [
            2.8,
            1
        ],
        "a": -1.2217304763960308,
        "sk": false,
        "r": 0,
        "s": 0
    },
    {
        "type": "bx",
        "w": 1,
        "h": 0.5,
        "c": [
            2.3,
            1.9
        ],
        "a": -0.8726646259971651,
        "sk": false,
        "r": 0,
        "s": 0
    },
    {
        "type": "bx",
        "w": 1,
        "h": 0.5,
        "c": [
            1.5,
            2.6
        ],
        "a": -0.5235987755982988,
        "sk": false,
        "r": 0,
        "s": 0
    },
    {
        "type": "bx",
        "w": 1,
        "h": 0.5,
        "c": [
            0.5,
            3
        ],
        "a": -0.17453292519943273,
        "sk": false,
        "r": 0,
        "s": 0
    },
    {
        "type": "bx",
        "w": 1,
        "h": 0.5,
        "c": [
            -0.5,
            3
        ],
        "a": 0.17453292519943273,
        "sk": false,
        "r": 0,
        "s": 0
    },
    {
        "type": "bx",
        "w": 1,
        "h": 0.5,
        "c": [
            -1.5,
            2.6
        ],
        "a": 0.5235987755982987,
        "sk": false,
        "r": 0,
        "s": 0
    },
    {
        "type": "bx",
        "w": 1,
        "h": 0.5,
        "c": [
            -2.3,
            1.9
        ],
        "a": 0.8726646259971645,
        "sk": false,
        "r": 0,
        "s": 0
    },
    {
        "type": "bx",
        "w": 1,
        "h": 0.5,
        "c": [
            -2.8,
            1
        ],
        "a": 1.2217304763960306,
        "sk": false,
        "r": 0,
        "s": 0
    }
]
    `
    },
    clown: {
        body: `
  {
    "type": "d",
    "p": [
        28.59375,
        21.614583333333332
    ],
    "a": 0,
    "av": 0,
    "lv": [
        -5,
        0
    ],
    "ld": 0,
    "ad": 0,
    "fr": true,
    "bu": false,
    "fx": [
        0,
        1,
        2,
        11,
        10,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20
    ],
    "fric": 0.5,
    "fricp": false,
    "de": 552,
    "re": -1,
    "f_c": 1,
    "f_p": true,
    "f_1": false,
    "f_2": false,
    "f_3": false,
    "f_4": false,
    "fz": {
        "on": false,
        "x": 0,
        "y": 0,
        "d": true,
        "p": true,
        "a": true
    },
    "cf": {
        "x": 0.3333333333333333,
        "y": -0.6666666666666666,
        "w": true,
        "ct": 0
    }
}
  `,
        fixtures: `
    [
    {
        "sh": 0,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 16711422,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 1,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 16711422,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 2,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 16711422,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 3,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 12040119,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 4,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 16711422,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 5,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 16711422,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 6,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 16711422,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 7,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 16711422,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 8,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 16711422,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 9,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 16711422,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 10,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 131586,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 11,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 131586,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 12,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 16711422,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 13,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 12040119,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 14,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 13771043,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 15,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 13771043,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 16,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 13771044,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 17,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 13771044,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 18,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 131586,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 19,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 13771044,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 20,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 13771044,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    }
]
    `,
        shapes: `
    [
    {
        "type": "ci",
        "r": 0.16666666666666666,
        "c": [
            0,
            0
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.16666666666666666,
        "c": [
            1.5833333333333333,
            0
        ],
        "sk": false
    },
    {
        "type": "po",
        "v": [
            [
                -2.6041666666666665,
                0.5208333333333334
            ],
            [
                5.46875,
                0.5208333333333334
            ],
            [
                5.46875,
                -1.3020833333333333
            ],
            [
                3.125,
                -1.8229166666666667
            ],
            [
                2.6041666666666665,
                -3.6458333333333335
            ],
            [
                -4.427083333333333,
                -3.6458333333333335
            ],
            [
                -4.427083333333333,
                0.5208333333333334
            ]
        ],
        "s": 1,
        "a": 0,
        "c": [
            0,
            0
        ]
    },
    {
        "type": "po",
        "v": [
            [
                -4.166666666666667,
                0.2604166666666667
            ],
            [
                4.947916666666667,
                0.2604166666666667
            ],
            [
                5.208333333333333,
                0.2604166666666667
            ],
            [
                5.208333333333333,
                -1.0416666666666667
            ],
            [
                2.8645833333333335,
                -1.5625
            ],
            [
                2.34375,
                -3.3854166666666665
            ],
            [
                -3.90625,
                -3.3854166666666665
            ],
            [
                -4.166666666666667,
                -3.125
            ]
        ],
        "s": 1,
        "a": 0,
        "c": [
            0,
            0
        ]
    },
    {
        "type": "bx",
        "w": 9.416666666666666,
        "h": 0.4166666666666667,
        "c": [
            0.5,
            0.25
        ],
        "a": 0,
        "sk": false
    },
    {
        "type": "bx",
        "w": 1.5833333333333333,
        "h": 0.4166666666666667,
        "c": [
            5.25,
            -0.5
        ],
        "a": -1.5707963267948966,
        "sk": false
    },
    {
        "type": "bx",
        "w": 2.4166666666666665,
        "h": 0.25,
        "c": [
            4,
            -1.3333333333333333
        ],
        "a": 0.21866894587394195,
        "sk": false
    },
    {
        "type": "bx",
        "w": 2.0833333333333335,
        "h": 0.4166666666666667,
        "c": [
            2.5,
            -2.5
        ],
        "a": 1.1659045405098132,
        "sk": false
    },
    {
        "type": "bx",
        "w": 6.25,
        "h": 0.4166666666666667,
        "c": [
            -1,
            -3.4166666666666665
        ],
        "a": 0,
        "sk": false
    },
    {
        "type": "bx",
        "w": 3.6666666666666665,
        "h": 0.4166666666666667,
        "c": [
            -4.166666666666667,
            -1.5833333333333333
        ],
        "a": -1.5707963267948966,
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.9166666666666666,
        "c": [
            -2.8854166666666665,
            0.5208333333333334
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.9166666666666666,
        "c": [
            3.8020833333333335,
            0.5208333333333334
        ],
        "sk": false
    },
    {
        "type": "po",
        "v": [
            [
                0.5208333333333334,
                -3.6458333333333335
            ],
            [
                0.5208333333333334,
                -3.90625
            ],
            [
                -1.0416666666666667,
                -3.90625
            ],
            [
                -1.0416666666666667,
                -5.208333333333333
            ],
            [
                2.34375,
                -5.208333333333333
            ],
            [
                2.34375,
                -3.90625
            ],
            [
                1.3020833333333333,
                -3.90625
            ],
            [
                1.3020833333333333,
                -3.6458333333333335
            ]
        ],
        "s": 1,
        "a": 0,
        "c": [
            0,
            0
        ]
    },
    {
        "type": "ci",
        "r": 0.5,
        "c": [
            0.78125,
            -4.59375
        ],
        "sk": false
    },
    {
        "type": "po",
        "v": [
            [
                0.4895833333333333,
                -4.947916666666667
            ],
            [
                0.3229166666666667,
                -4.947916666666667
            ],
            [
                0.3229166666666667,
                -4.78125
            ],
            [
                0.15625,
                -4.947916666666667
            ],
            [
                0.15625,
                -4.78125
            ],
            [
                0.3229166666666667,
                -4.78125
            ],
            [
                0.15625,
                -4.614583333333333
            ],
            [
                0.4895833333333333,
                -4.614583333333333
            ],
            [
                0.4895833333333333,
                -4.78125
            ]
        ],
        "s": 1,
        "a": 0,
        "c": [
            0,
            0
        ]
    },
    {
        "type": "po",
        "v": [
            [
                1.3229166666666667,
                -4.947916666666667
            ],
            [
                1.15625,
                -4.947916666666667
            ],
            [
                1.15625,
                -4.78125
            ],
            [
                0.9895833333333334,
                -4.947916666666667
            ],
            [
                0.9895833333333334,
                -4.78125
            ],
            [
                1.15625,
                -4.78125
            ],
            [
                0.9895833333333334,
                -4.614583333333333
            ],
            [
                1.3229166666666667,
                -4.614583333333333
            ],
            [
                1.3229166666666667,
                -4.78125
            ]
        ],
        "s": 1,
        "a": 0,
        "c": [
            0.8333333333333334,
            0
        ]
    },
    {
        "type": "ci",
        "r": 0.08333333333333333,
        "c": [
            1.3229166666666667,
            -4.947916666666667
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.08333333333333333,
        "c": [
            0.16666666666666666,
            -4.947916666666667
        ],
        "sk": false
    },
    {
        "type": "po",
        "v": [
            [
                0.475,
                -4.391666666666667
            ],
            [
                0.7416666666666667,
                -4.125
            ],
            [
                1.0083333333333333,
                -4.391666666666667
            ],
            [
                0.7416666666666667,
                -4.258333333333334
            ]
        ],
        "s": 0.8,
        "a": 0,
        "c": [
            0.08333333333333333,
            -0.8333333333333334
        ]
    },
    {
        "type": "ci",
        "r": 0.08333333333333333,
        "c": [
            0.5729166666666666,
            -4.614583333333333
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.08333333333333333,
        "c": [
            0.90625,
            -4.614583333333333
        ],
        "sk": false
    }
]
    `
    },
    jetpack: {
        body: `
    {
    "type": "d",
    "p": [
        30.416666666666668,
        20.833333333333332
    ],
    "a": 0,
    "av": 0,
    "lv": [
        0,
        0
    ],
    "ld": 0,
    "ad": 2,
    "fr": false,
    "bu": true,
    "fx": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
    ],
    "fric": 0,
    "fricp": false,
    "de": 0.2,
    "re": -1,
    "f_c": 1,
    "f_p": true,
    "f_1": false,
    "f_2": false,
    "f_3": false,
    "f_4": false,
    "fz": {
        "on": false,
        "x": 0,
        "y": 0,
        "d": true,
        "p": true,
        "a": true
    },
    "cf": {
        "x": 0,
        "y": -4,
        "w": false,
        "ct": 0
    }
}
    `,
        fixtures: `
[
    {
        "sh": 0,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 1,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 2,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 10329501,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 3,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 10329501,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 4,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 919298,
        "d": true,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 5,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 919298,
        "d": true,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 6,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 10329501,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 7,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 10329501,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    }
]
    `,
        shapes: `
   [
    {
        "type": "ci",
        "r": 0.08333333333333333,
        "c": [
            -0.8333333333333334,
            -0.75
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.08333333333333333,
        "c": [
            0.8333333333333334,
            -0.75
        ],
        "sk": false
    },
    {
        "type": "bx",
        "w": 1.3333333333333333,
        "h": 0.4166666666666667,
        "c": [
            -1.25,
            0
        ],
        "a": -1.5707963267948966,
        "sk": false
    },
    {
        "type": "bx",
        "w": 1.3333333333333333,
        "h": 0.4166666666666667,
        "c": [
            1.25,
            0
        ],
        "a": -1.5707963267948966,
        "sk": false
    },
    {
        "type": "bx",
        "w": 0.3333333333333333,
        "h": 0.25,
        "c": [
            -1.25,
            0.8333333333333334
        ],
        "a": 0,
        "sk": false
    },
    {
        "type": "bx",
        "w": 0.3333333333333333,
        "h": 0.25,
        "c": [
            1.25,
            0.8333333333333334
        ],
        "a": 0,
        "sk": false
    },
    {
        "type": "bx",
        "w": 0.16666666666666666,
        "h": 0.16666666666666666,
        "c": [
            -0.75,
            0.75
        ],
        "a": 0,
        "sk": false
    },
    {
        "type": "bx",
        "w": 0.16666666666666666,
        "h": 0.16666666666666666,
        "c": [
            0.75,
            0.75
        ],
        "a": 0,
        "sk": false
    }
]
    `
    },
    car: {
        body: `{
    "type": "d",
    "p": [
        30.416666666666668,
        20.833333333333332
    ],
    "a": 0,
    "av": 0,
    "lv": [
        0,
        0
    ],
    "ld": 0,
    "ad": 0,
    "fr": false,
    "bu": true,
    "fx": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
    ],
    "fric": 0,
    "fricp": false,
    "de": 0.1,
    "re": -1,
    "f_c": 1,
    "f_p": true,
    "f_1": true,
    "f_2": true,
    "f_3": true,
    "f_4": true,
    "fz": {
        "on": false,
        "x": 0,
        "y": 0,
        "d": true,
        "p": true,
        "a": true
    },
    "cf": {
        "x": 0,
        "y": 0,
        "w": true,
        "ct": 0
    }
}`,
        fixtures: `
[
    {
        "sh": 0,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 1,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 2,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 3,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 4,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 8421504,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 5,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 11869276,
        "d": false,
        "np": true,
        "ng": true,
        "ig": false
    },
    {
        "sh": 6,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 1906437,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 7,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 1906437,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 8,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 8421504,
        "d": true,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 9,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 8421504,
        "d": true,
        "np": false,
        "ng": true,
        "ig": false
    }
]
`,
        shapes: `
   [
    {
        "type": "ci",
        "r": 0.08333333333333333,
        "c": [
            0.6666666666666666,
            0.6666666666666666
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.08333333333333333,
        "c": [
            -0.6666666666666666,
            -0.6666666666666666
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.08333333333333333,
        "c": [
            -0.6666666666666666,
            0.6666666666666666
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.08333333333333333,
        "c": [
            0.6666666666666666,
            -0.6666666666666666
        ],
        "sk": false
    },
    {
        "type": "bx",
        "w": 6.25,
        "h": 0.4166666666666667,
        "c": [
            0,
            1.1666666666666667
        ],
        "a": 0,
        "sk": false
    },
    {
        "type": "po",
        "v": [
            [
                -3.0833333333333335,
                1
            ],
            [
                -3.0833333333333335,
                -0.08333333333333333
            ],
            [
                -1.1666666666666667,
                -0.33333333333333337
            ],
            [
                -1.0833333333333333,
                -1.4166666666666667
            ],
            [
                1.5833333333333333,
                -1.4166666666666667
            ],
            [
                1.6666666666666667,
                -0.5
            ],
            [
                3.0833333333333335,
                -0.25
            ],
            [
                3.0833333333333335,
                1.0833333333333333
            ]
        ],
        "s": 1,
        "a": 0,
        "c": [
            0,
            0.08333333333333333
        ]
    },
    {
        "type": "ci",
        "r": 0.5,
        "c": [
            2.5,
            1.6666666666666667
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.5,
        "c": [
            -2.5,
            1.6666666666666667
        ],
        "sk": false
    },
    {
        "type": "bx",
        "w": 1.4166666666666667,
        "h": 0.4166666666666667,
        "c": [
            2.9166666666666665,
            0.5
        ],
        "a": 1.5707963267948966,
        "sk": false
    },
    {
        "type": "bx",
        "w": 1.4166666666666667,
        "h": 0.4166666666666667,
        "c": [
            -2.9166666666666665,
            0.5
        ],
        "a": 1.5707963267948966,
        "sk": false
    }
]
    `
    },
    parachute: {
        body: `
  {
    "type": "d",
    "p": [
        30.416666666666668,
        20.833333333333332
    ],
    "a": 0,
    "av": 0,
    "lv": [
        0,
        0
    ],
    "ld": 999,
    "ad": 600,
    "fr": false,
    "bu": true,
    "fx": [
        0,
        8,
        1,
        6,
        7,
        3,
        5,
        4,
        2
    ],
    "fric": 0.5,
    "fricp": false,
    "de": 0.3,
    "re": -1,
    "f_c": 1,
    "f_p": true,
    "f_1": false,
    "f_2": false,
    "f_3": false,
    "f_4": false,
    "fz": {
        "on": false,
        "x": 0,
        "y": 0,
        "d": true,
        "p": true,
        "a": true
    },
    "cf": {
        "x": 0,
        "y": -166.66666666666666,
        "w": true,
        "ct": 0
    }
}
  `,
        shapes: `
   [
    {
        "type": "ci",
        "r": 0.16666666666666666,
        "c": [
            0.9166666666666666,
            0.9166666666666666
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.16666666666666666,
        "c": [
            -0.9166666666666666,
            0.9166666666666666
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.8333333333333334,
        "c": [
            0.08333333333333333,
            -2.0833333333333335
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.8333333333333334,
        "c": [
            0.75,
            -1.9166666666666667
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.8333333333333334,
        "c": [
            -0.75,
            -1.9166666666666667
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.8333333333333334,
        "c": [
            -1.25,
            -1.5
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.8333333333333334,
        "c": [
            1.3333333333333333,
            -1.5
        ],
        "sk": false
    },
    {
        "type": "bx",
        "w": 0.4166666666666667,
        "h": 0.4166666666666667,
        "c": [
            -0.9166666666666666,
            -0.9166666666666666
        ],
        "a": -1.5707963267948966,
        "sk": false
    },
    {
        "type": "bx",
        "w": 0.4166666666666667,
        "h": 0.4166666666666667,
        "c": [
            0.9166666666666666,
            -0.9166666666666666
        ],
        "a": -1.5707963267948966,
        "sk": false
    }
]
   `,
        fixtures: `
    [
    {
        "sh": 0,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 1,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 2,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 8577870,
        "d": false,
        "np": true,
        "ng": true,
        "ig": false
    },
    {
        "sh": 3,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 2284123,
        "d": false,
        "np": true,
        "ng": true,
        "ig": false
    },
    {
        "sh": 4,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 2284123,
        "d": false,
        "np": true,
        "ng": true,
        "ig": false
    },
    {
        "sh": 5,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 1612084,
        "d": false,
        "np": true,
        "ng": true,
        "ig": false
    },
    {
        "sh": 6,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 1612084,
        "d": false,
        "np": true,
        "ng": true,
        "ig": false
    },
    {
        "sh": 7,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 8,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    }
]
    `
    },
    anvil: {
        body: `
    {
    "type": "d",
    "p": [
        30.416666666666668,
        20.833333333333332
    ],
    "a": 0,
    "av": 0,
    "lv": [
        0,
        0
    ],
    "ld": 0,
    "ad": 0,
    "fr": false,
    "bu": true,
    "fx": [
        3,
        2,
        0,
        1
    ],
    "fric": 0.5,
    "fricp": false,
    "de": 9999,
    "re": -1,
    "f_c": 1,
    "f_p": true,
    "f_1": false,
    "f_2": false,
    "f_3": false,
    "f_4": false,
    "fz": {
        "on": false,
        "x": 0,
        "y": 0,
        "d": true,
        "p": true,
        "a": true
    },
    "cf": {
        "x": 0,
        "y": 0,
        "w": true,
        "ct": 0
    }
}
    `,
        fixtures: `
    [
    {
        "sh": 0,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 592137,
        "d": true,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 1,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 592137,
        "d": false,
        "np": true,
        "ng": true,
        "ig": false
    },
    {
        "sh": 2,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 14767680,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 3,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 14767680,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    }
]
    `,
        shapes: `
    [
    {
        "type": "bx",
        "w": 2.5833333333333335,
        "h": 0.4166666666666667,
        "c": [
            0.08333333333333333,
            -41.666666666666664
        ],
        "a": 0,
        "sk": false
    },
    {
        "type": "po",
        "v": [
            [
                2.4166666666666665,
                -41.333333333333336
            ],
            [
                -2.0833333333333335,
                -41.333333333333336
            ],
            [
                -1.3333333333333333,
                -41.66666666666667
            ],
            [
                -0.9166666666666666,
                -42.083333333333336
            ],
            [
                -0.8333333333333334,
                -42.5
            ],
            [
                -0.8333333333333334,
                -43.083333333333336
            ],
            [
                -1,
                -43.41666666666667
            ],
            [
                -1.1666666666666667,
                -43.75
            ],
            [
                -1.6666666666666667,
                -44
            ],
            [
                -2.4166666666666665,
                -44.083333333333336
            ],
            [
                1.5833333333333333,
                -44.083333333333336
            ],
            [
                1.5833333333333333,
                -43.583333333333336
            ],
            [
                2.8333333333333335,
                -43.583333333333336
            ],
            [
                2.8333333333333335,
                -43
            ],
            [
                2.75,
                -42.66666666666667
            ],
            [
                2.5,
                -42.583333333333336
            ],
            [
                2,
                -42.583333333333336
            ],
            [
                1.4166666666666667,
                -42.66666666666667
            ],
            [
                1.0833333333333333,
                -42.66666666666667
            ],
            [
                1,
                -42.5
            ],
            [
                1.0833333333333333,
                -42
            ],
            [
                1.5,
                -41.75
            ]
        ],
        "s": 1,
        "a": 0,
        "c": [
            0,
            0.16666666666666666
        ]
    },
    {
        "type": "bx",
        "w": 83.33333333333333,
        "h": 0.08333333333333333,
        "c": [
            -0.4166666666666667,
            -1.0833333333333333
        ],
        "a": 1.5707963267948966,
        "sk": false
    },
    {
        "type": "bx",
        "w": 83.33333333333333,
        "h": 0.08333333333333333,
        "c": [
            0.4166666666666667,
            -1.0833333333333333
        ],
        "a": 1.5707963267948966,
        "sk": false
    }
]
    `
    },
    sword: {
        body: `
 {
    "type": "d",
    "p": [
        14.6,
        10
    ],
    "a": 0,
    "av": 0,
    "lv": [
        0,
        0
    ],
    "ld": 0,
    "ad": 0,
    "fr": false,
    "bu": false,
    "fx": [
        0,
        1,
        2,
        3,
        4,
        5
    ],
    "fric": 0,
    "fricp": false,
    "de": 0.01,
    "re": -1,
    "f_c": 1,
    "f_p": true,
    "f_1": false,
    "f_2": false,
    "f_3": false,
    "f_4": false,
    "fz": {
        "on": false,
        "x": 0,
        "y": 0,
        "d": true,
        "p": true,
        "a": true
    },
    "cf": {
        "x": 0,
        "y": 0,
        "w": true,
        "ct": 0
    }
}
 `,
        fixtures: `
 [
    {
        "sh": 0,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 1,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 2,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 3,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 4,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 0,
        "d": false,
        "np": false,
        "ng": true,
        "ig": false
    },
    {
        "sh": 5,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 15461355,
        "d": true,
        "np": false,
        "ng": true,
        "ig": false
    }
]
 `,
        shapes: `
 [
    {
        "type": "ci",
        "r": 0.08,
        "c": [
            0.76,
            0.76
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.08,
        "c": [
            -0.76,
            -0.76
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.08,
        "c": [
            -0.76,
            0.76
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.08,
        "c": [
            0.76,
            -0.76
        ],
        "sk": false
    },
    {
        "type": "bx",
        "w": 1.36,
        "h": 0.52,
        "c": [
            0,
            -1.92
        ],
        "a": 1.5707963267948966,
        "sk": false
    },
    {
        "type": "bx",
        "w": 2.04,
        "h": 0.2,
        "c": [
            0,
            -3.6
        ],
        "a": -1.5707963267948966,
        "sk": false
    }
]
 `
    },
    spinner: {
        body: `{
    "type": "d",
    "p": [
        30.416666666666668,
        20.833333333333332
    ],
    "a": 0,
    "av": 333,
    "lv": [
        0,
        0
    ],
    "ld": 0,
    "ad": 0,
    "fr": false,
    "bu": false,
    "fx": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        15,
        14
    ],
    "fric": 0.5,
    "fricp": false,
    "de": 1,
    "re": -1,
    "f_c": 1,
    "f_p": true,
    "f_1": false,
    "f_2": false,
    "f_3": false,
    "f_4": false,
    "fz": {
        "on": false,
        "x": 0,
        "y": 0,
        "d": true,
        "p": true,
        "a": true
    },
    "cf": {
        "x": 0,
        "y": -666.6666666666666,
        "w": false,
        "ct": 33.3
    }
}`,
        fixtures: `
[
    {
        "sh": 0,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 8421504,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 1,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 14492194,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 2,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 14492194,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 3,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 14492194,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 4,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 14492194,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 5,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 14492194,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 6,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 14492194,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 7,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 14492194,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 8,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 14492194,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 9,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 513,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 10,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 513,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 11,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 8421504,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 12,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 8421504,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 13,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 8421504,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 14,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 8421504,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 15,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 513,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    }
]
`,
        shapes: `
[
    {
        "type": "ci",
        "r": 1.0833333333333333,
        "c": [
            0,
            0
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.16666666666666666,
        "c": [
            -0.78125,
            -0.78125
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.16666666666666666,
        "c": [
            0.78125,
            -0.78125
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.16666666666666666,
        "c": [
            0.78125,
            0.78125
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.16666666666666666,
        "c": [
            -0.78125,
            0.78125
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 1,
        "c": [
            0,
            -2.1666666666666665
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 1,
        "c": [
            2,
            1.25
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 1,
        "c": [
            -2,
            1.25
        ],
        "sk": false
    },
    {
        "type": "po",
        "v": [
            [
                -2.0833333333333335,
                0.2604166666666667
            ],
            [
                -1.8229166666666667,
                0.2604166666666667
            ],
            [
                -1.3020833333333333,
                0
            ],
            [
                -0.78125,
                -0.78125
            ],
            [
                -0.78125,
                -1.0416666666666667
            ],
            [
                -1.0416666666666667,
                -2.0833333333333335
            ],
            [
                1.0416666666666667,
                -2.0833333333333335
            ],
            [
                0.78125,
                -1.0416666666666667
            ],
            [
                0.78125,
                -0.78125
            ],
            [
                1.3020833333333333,
                0
            ],
            [
                1.8229166666666667,
                0.2604166666666667
            ],
            [
                2.0833333333333335,
                0.2604166666666667
            ],
            [
                2.8645833333333335,
                1.5625
            ],
            [
                1.8229166666666667,
                2.0833333333333335
            ],
            [
                1.0416666666666667,
                1.5625
            ],
            [
                0.78125,
                1.3020833333333333
            ],
            [
                0.2604166666666667,
                1.0416666666666667
            ],
            [
                -0.2604166666666667,
                1.0416666666666667
            ],
            [
                -0.78125,
                1.3020833333333333
            ],
            [
                -1.0416666666666667,
                1.5625
            ],
            [
                -1.8229166666666667,
                2.0833333333333335
            ],
            [
                -2.8645833333333335,
                1.5625
            ]
        ],
        "s": 1,
        "a": 0,
        "c": [
            0,
            0
        ]
    },
    {
        "type": "ci",
        "r": 0.75,
        "c": [
            -2,
            1.25
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.75,
        "c": [
            2,
            1.25
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.5833333333333334,
        "c": [
            2,
            1.25
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.5833333333333334,
        "c": [
            -2,
            1.25
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.5833333333333334,
        "c": [
            -2,
            1.25
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.5833333333333334,
        "c": [
            0,
            -2.1666666666666665
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.75,
        "c": [
            0,
            -2.1666666666666665
        ],
        "sk": false
    }
]
`
    },
    ballify: {
        invis: true,
        body: `{
    "type": "d",
    "p": [
        30.416666666666668,
        20.833333333333332
    ],
    "a": 0,
    "av": 0,
    "lv": [
        0,
        0
    ],
    "ld": 0,
    "ad": 0,
    "fr": false,
    "bu": true,
    "fx": [
        0,
        1,
        2,
        3
    ],
    "fric": 0.4,
    "fricp": false,
    "de": 999,
    "re": -1,
    "f_c": 1,
    "f_p": true,
    "f_1": false,
    "f_2": false,
    "f_3": false,
    "f_4": false,
    "fz": {
        "on": false,
        "x": 0,
        "y": 0,
        "d": true,
        "p": true,
        "a": true
    },
    "cf": {
        "x": 0,
        "y": 0,
        "w": true,
        "ct": 0
    }
}`,
        fixtures: `
[
    {
        "sh": 0,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 1,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 2,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 3,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    }
]
`,
        shapes: `
[
    {
        "type": "ci",
        "r": 0.08333333333333333,
        "c": [
            0.6666666666666666,
            0.6666666666666666
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.08333333333333333,
        "c": [
            -0.6666666666666666,
            -0.6666666666666666
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.08333333333333333,
        "c": [
            -0.6666666666666666,
            0.6666666666666666
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.08333333333333333,
        "c": [
            0.6666666666666666,
            -0.6666666666666666
        ],
        "sk": false
    }
]
`
    },
    balloon: {
        body: `{
    "type": "d",
    "p": [
        30.416666666666668,
        20.833333333333332
    ],
    "a": 0,
    "av": 0,
    "lv": [
        0,
        0
    ],
    "ld": 2,
    "ad": 0,
    "fr": false,
    "bu": true,
    "fx": [
        0,
        1,
        2,
        3,
        4,
        5,
        6
    ],
    "fric": 0.5,
    "fricp": false,
    "de": 5,
    "re": -1,
    "f_c": 1,
    "f_p": true,
    "f_1": false,
    "f_2": false,
    "f_3": false,
    "f_4": false,
    "fz": {
        "on": false,
        "x": 0,
        "y": 0,
        "d": true,
        "p": true,
        "a": true
    },
    "cf": {
        "x": 0,
        "y": -0.8333333333333334,
        "w": true,
        "ct": 0
    }
}`,
        fixtures: `[
    {
        "sh": 0,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 1,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 2,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 3,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 4,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 15987699,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 5,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 14829383,
        "d": false,
        "np": true,
        "ng": false,
        "ig": false
    },
    {
        "sh": 6,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 14829383,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    }
]`,
        shapes: `
 [
    {
        "type": "ci",
        "r": 0.08333333333333333,
        "c": [
            0.6666666666666666,
            0.6666666666666666
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.08333333333333333,
        "c": [
            -0.6666666666666666,
            -0.6666666666666666
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.08333333333333333,
        "c": [
            -0.6666666666666666,
            0.6666666666666666
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.08333333333333333,
        "c": [
            0.6666666666666666,
            -0.6666666666666666
        ],
        "sk": false
    },
    {
        "type": "bx",
        "w": 3,
        "h": 0.08333333333333333,
        "c": [
            0,
            -1.3333333333333333
        ],
        "a": -1.5707963267948966,
        "sk": false
    },
    {
        "type": "po",
        "v": [
            [
                -0.08333333333333333,
                -2.8333333333333335
            ],
            [
                0,
                -2.8333333333333335
            ],
            [
                0.25,
                -2.5833333333333335
            ],
            [
                -0.25,
                -2.5833333333333335
            ]
        ],
        "s": 1,
        "a": 0,
        "c": [
            0,
            0
        ]
    },
    {
        "type": "ci",
        "r": 1.6666666666666667,
        "c": [
            0,
            -4.5
        ],
        "sk": false
    }
]
 `
    },
    buff: {
        invis: true,
        body: `{
    "type": "d",
    "p": [
        30.416666666666668,
        20.833333333333332
    ],
    "a": 0,
    "av": 5,
    "lv": [
        0,
        0
    ],
    "ld": 0,
    "ad": 0,
    "fr": false,
    "bu": true,
    "fx": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
    ],
    "fric": 0.5,
    "fricp": false,
    "de": 0.1,
    "re": -1,
    "f_c": 1,
    "f_p": true,
    "f_1": false,
    "f_2": false,
    "f_3": false,
    "f_4": false,
    "fz": {
        "on": false,
        "x": 0,
        "y": 0,
        "d": true,
        "p": true,
        "a": true
    },
    "cf": {
        "x": 0,
        "y": 0,
        "w": true,
        "ct": 0
    }
}`,
        fixtures: `[
    {
        "sh": 0,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 1,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 2,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 3,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 5209260,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 4,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": 90,
        "de": null,
        "f": 16317438,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 5,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": 90,
        "de": null,
        "f": 16317438,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 6,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": 90,
        "de": null,
        "f": 16317438,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "sh": 7,
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": 90,
        "de": null,
        "f": 16317438,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    }
]`,
        shapes: `[
    {
        "type": "ci",
        "r": 0.08333333333333333,
        "c": [
            0.75,
            0.75
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.08333333333333333,
        "c": [
            -0.75,
            -0.75
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.08333333333333333,
        "c": [
            -0.75,
            0.75
        ],
        "sk": false
    },
    {
        "type": "ci",
        "r": 0.08333333333333333,
        "c": [
            0.75,
            -0.75
        ],
        "sk": false
    },
    {
        "type": "bx",
        "w": 0.5833333333333334,
        "h": 0.16666666666666666,
        "c": [
            -1.2083333333333333,
            0
        ],
        "a": 1.5707963267948966,
        "sk": false
    },
    {
        "type": "bx",
        "w": 0.5833333333333334,
        "h": 0.16666666666666666,
        "c": [
            1.2083333333333333,
            0
        ],
        "a": 1.5707963267948966,
        "sk": false
    },
    {
        "type": "bx",
        "w": 0.5833333333333334,
        "h": 0.16666666666666666,
        "c": [
            0,
            1.2083333333333333
        ],
        "a": 0,
        "sk": false
    },
    {
        "type": "bx",
        "w": 0.5833333333333334,
        "h": 0.16666666666666666,
        "c": [
            0,
            -1.2083333333333333
        ],
        "a": 0,
        "sk": false
    }
]`
    },
    jail: {
        body: `{
    "type": "s",
    "p": [0,0],
    "a": 0,
    "av": 0,
    "lv": [0,0],
    "ld": 0,
    "ad": 0,
    "fr": false,
    "bu": false,
    "fx": [],
    "fric": 0.5,
    "fricp": true,
    "de": 0.3,
    "re": -1,
    "f_c": 1,
    "f_p": true,
    "f_1": false,
    "f_2": false,
    "f_3": false,
    "f_4": false,
    "fz": {
        "on": false,
        "x": 0,
        "y": 0,
        "d": true,
        "p": true,
        "a": true
    },
    "cf": {
        "x": 0,
        "y": 0,
        "w": true,
        "ct": 0
    }
}`,
        shapes: `[
    {
        "type": "bx",
        "w": 3.4166666666666665,
        "h": 0.4166666666666667,
        "c": [
            0,
            1.0833333333333333
        ],
        "a": 0,
        "sk": false
    },
    {
        "type": "bx",
        "w": 3.4166666666666665,
        "h": 0.4166666666666667,
        "c": [
            0,
            -1.8333333333333333
        ],
        "a": 0,
        "sk": false
    },
    {
        "type": "bx",
        "w": 3.5,
        "h": 0.4166666666666667,
        "c": [
            1.25,
            -0.375
        ],
        "a": 1.5707963267948966,
        "sk": false
    },
    {
        "type": "bx",
        "w": 3.5,
        "h": 0.4166666666666667,
        "c": [
            -1.25,
            -0.375
        ],
        "a": 1.5707963267948966,
        "sk": false
    }
]`,
        fixtures: `[
    {
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 7368816,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 7368816,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 7368816,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    },
    {
        "n": "Unnamed Shape",
        "fr": null,
        "fp": null,
        "re": null,
        "de": null,
        "f": 7368816,
        "d": false,
        "np": false,
        "ng": false,
        "ig": false
    }
]`
    }
};

function revive(player){
    if (!window.nbm.revivePlayers) window.nbm.revivePlayers = [];
    window.nbm.revivePlayers.push(player);
    startGame(window.nbm.state,true);
}

function summonArrow(at,isPlayer,owner,velocity,returnState,fte){
    let state = window.nbm.state;
    let p = [0,0];
    if (isPlayer){
        let disc = state.discs[at];
        if (disc){
            p[0] = disc.x;
            p[1] = disc.y;
        }
    }else{
        p = at;
    }
    let arrow = {
        "x": p[0],
        "y": p[1],
        "a": Math.atan2(velocity[1],velocity[0]),
        "av": 0,
        "xv": velocity[0],
        "yv": velocity[1],
        "fte": fte || 90,
        "did": owner,
        "type": "arrow",
        "team": 1
    }
    state.projectiles.push(arrow);
    if (returnState){
        return state;
    }else{
        startGame(state,true);
    }
}

function summonAT(type,player,returnState,randomness,extra){
    let state = window.nbm.state;
    let index = state.physics.shapes.length;
    let obj = summonables[type];
    if (obj){
        let body = JSON.parse(obj.body);
        let shapes = JSON.parse(obj.shapes);
        let fixtures = JSON.parse(obj.fixtures);
        let fx = [];
        extra = extra || [0,0];
        let extraX = (randomness? ((Math.random()*(randomness||1))-(randomness||1)/2) : 0);
        let extraY = (randomness? ((Math.random()*(randomness||1))-(randomness||1)/2) : 0);
        body.p = [state.discs[player].x+extraX+extra[0],state.discs[player].y+extraY+extra[1]];
        for (let sh = 0; sh < shapes.length; sh++){
            fixtures[sh].sh = sh+index;
            state.physics.fixtures.push(fixtures[sh]);
            state.physics.shapes.push(shapes[sh]);
            fx.push(index+sh);
        }
        body.fx = fx;
        state.physics.bodies.push(body);
        if (!obj.invis){
            state.physics.bro.unshift(state.physics.bodies.length-1);
        }
        if (returnState){
            return state;
        }else{
            startGame(state,true);
        }
    }
}

function refreshStyle(thestyle){
    let tstyle = styles[thestyle];
    gameStyle.innerHTML = `
    .brownButton {
        background-color: ${tstyle.buttons.color} !important;
        transition: all 0.2s;
    }
    .brownButton:hover {
        background-color: ${tstyle.buttons.hovercolor} !important;
        transform: scale(1.1);
    }
    .brownButtonDisabled {
    background-color: #e1e1e1 !important;
    }
    .newbonklobby_playerentry, .newbonklobby_playerentry_half {
            border: 0;
    }
    #autoLogin_topbar, .windowTopBar, .windowTopBar_classic, #roomlisttopbar, .newbonklobby_boxtop, .classicTopBar, .newbonklobby_boxtop_classic, #roomlistcreatewindowtoptext {
        background-color: ${tstyle.containerTop.color} !important;
        background: ${tstyle.containerTop.BgImage? `url('${tstyle.containerTop.BgImage}')` : (tstyle.containerTop.color+' !important')};
        background-size: cover;
    }
    .HOVERUNSELECTED, #maploadwindowgreybar, .maploadwindowmapdiv {
        background-color: ${tstyle.roomList.evenColor} !important;
        background-size: cover;
    }
    #roomlisttable tr:nth-child(odd) {
    background-color: ${tstyle.roomList.oddColor} !important;
    background-size: cover;
    }
    #maploadwindow, #maploadwindowmapscontainer, .newbonklobby_elementcontainer, #autoLoginContainer, .windowShadow, #newbonklobby_chatbox, #newbonklobby_settingsbox, #roomlisttableheadercontainer {
        background-color: ${tstyle.containerBg.color} !important;
        background: ${tstyle.containerBg.BgImage? `url('${tstyle.containerBg.BgImage}')` : (tstyle.containerBg.color+' !important')};
        background-size: cover;
    }
    .friends_cell_name, .newbonklobby_playerentry_name, #newbonklobby_modetext, #newbonklobby_maptext, #newbonklobby_mapauthortext, .roomlistcreatewindowlabel, #sm_connectingWindow_text, #newbonklobby_chat_input, #mapeditor_midbox_explain {
       color: ${tstyle.msgColor || "none"} !important;
    }
    .newbonklobby_chat_msg_txt, .newbonklobby_chat_msg_name, .newbonklobby_chat_status, .newbonklobby_mapsuggest_high {
       background-color: #e2e2e2;
       border-radius: 5px;
    }
    .maploadwindowmapdiv, .newbonklobby_playerentry_avatar, .newbonklobby_mapthumb {
    transition: all 0.2s;
    pointer-events: all;
    }
    .maploadwindowmapdiv:hover, .newbonklobby_playerentry_avatar:hover, .newbonklobby_mapthumb:hover {
    transform: scale(1.2);
    z-index: 999999999999;
    }
`
}
refreshStyle(window.localStorage.getItem('theme') || 0);
const parentDocument = parent.document;
const parentWindow = parent.window;
var chatHistory = true;
let susMode = false;
let oofMode = false;
let joinText = '';
let currentAcessory = window.localStorage.getItem('acc-nbm') || -1;
let minimalist = false;
let myStyle = [255,255,255];
let teamsOn = false;
const accessories = [
    'birb',
    'egg',
    'Fedora',
    'helmet',
    'hammer',
    'cta',
    'egg2',
    'gentleman',
    'headphone',
    'sus',
    'nerd',
    'bunny',
    'cape',
    'cheese',
    'new',
    'spicebox',
    'guns',
    'crown',
    'noob',
    'slimey',
    'potato',
    'niko',
    'default',
    'monke',
    'gaming',
    'isaac',
    'horn',
    'wings',
    'glasses',
    'chair'
];
const acessoryLink = {
    'birb': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846288388079806/birb.png',
    'egg': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846288652325016/egg.png',
    'noob': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846290015473786/noob.png',
    'nerd': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133847987995557918/nerd.png',
    'crown': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133847987521605662/crown.png',
    'cheese': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133847987232190504/cheese.png',
    'bunny': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846393891598356/bunny.png',
    'default': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133847987764867092/default.png',
    'Fedora': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846288857829537/Fedora.png',
    'cta': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133848562761994352/cta.png',
    'gentleman': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133848562992693449/gentleman.png',
    'helmet': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846289080139806/helmet.png',
    'monke': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846289310830612/monke.png',
    'new': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846289533112360/new.png',
    'niko': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846289776394290/niko.png',
    'hammer': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846508647755886/hammer.png',
    'guns': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846508396089364/guns.png',
    'sus': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846395732885635/sus.png',
    'potato': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846394944356443/potato.png',
    'slimey': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846395217002587/slimey.png',
    'spicebox': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846395460268042/spicebox.png',
    'headphone': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846394705293383/headphone.png',
    'egg2': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846394453639189/egg2.png',
    'cape': 'https://cdn.discordapp.com/attachments/1128508277827846206/1133846394143244318/cape.png',
    'gaming':'https://cdn.discordapp.com/attachments/1128508277827846206/1137513131774591016/gamer.png',
    'isaac':'https://cdn.discordapp.com/attachments/1128508277827846206/1137513132420513903/isaac.png',
    'horn':'https://cdn.discordapp.com/attachments/1128508277827846206/1137513132206587974/horns.png',
    'glasses':'https://cdn.discordapp.com/attachments/1128508277827846206/1137513133028671538/sunglasses.png',
    'chair':'https://cdn.discordapp.com/attachments/1128508277827846206/1137513132009463879/gaming.png',
    'wings':'https://cdn.discordapp.com/attachments/1128508277827846206/1137513133276151899/wings.png'
}
const textures = [];
const petTextures = [];
const pets = [
    'Kitty',
    'chat-gpt',
    'chaz',
    'chad',
    'sus',
    'egg',
    'f',
    'cube',
    'rock',
    'isaac',
    'ghost'
]
const petSkins = {
    'Kitty':'https://cdn.discordapp.com/attachments/1128508277827846206/1138568531307409528/catpet.png',
    'f':'https://cdn.discordapp.com/attachments/1128508277827846206/1139666785386381362/F.png',
    'egg':'https://cdn.discordapp.com/attachments/1128508277827846206/1139666785025662976/egg2.png',
    'rock':'https://cdn.discordapp.com/attachments/1128508277827846206/1139666784706899998/darock.jpg',
    'cube':'https://cdn.discordapp.com/attachments/1128508277827846206/1139666784442663014/cube.png',
    'chaz':'https://cdn.discordapp.com/attachments/1128508277827846206/1139666784174219304/chaz.png',
    'chad':'https://cdn.discordapp.com/attachments/1128508277827846206/1139666783909982329/chad.jpg',
    'sus':'https://cdn.discordapp.com/attachments/1128508277827846206/1139666786418171925/the_sussy_baka.jpg',
    'isaac':'https://cdn.discordapp.com/attachments/1128508277827846206/1139666786099408967/isaac.png',
    'ghost':'https://cdn.discordapp.com/attachments/1128508277827846206/1139666785763868762/ghost.png',
    'chat-gpt':'https://cdn.discordapp.com/attachments/1128508277827846206/1139667562704162876/gpt.png'

}
const echoList = [];

for (let acessory of accessories){
    let texture = window.PIXI.Texture.fromImage(acessoryLink[acessory]);
    texture.baseTexture.scaleMode = window.PIXI.SCALE_MODES.NEAREST;
    textures.push(texture);
}

for (let pet of pets){
    let texture = window.PIXI.Texture.fromImage(petSkins[pet]);
    texture.baseTexture.scaleMode = window.PIXI.SCALE_MODES.NEAREST;
    petTextures.push(texture);
}

const emojis = {
    ":skull:":"💀",":omaga:":"😱",":smile:": "😃",":sob:":"😭",":darock:":"🤨",":flushed:":"😳",":cat:":"🐱",":globe:":"🌍",":ball:":"⚽",":balloon:":"🎈",":fest:":"🎉",":umbrella:":"☔",":nerd:":"🤓"
}
const letters = "a b c d e f g h i j k l m n o p q r s t u v w x y z 1 2 3 4 5 6 7 8 9 A B C D E F G H I J K L M N O P Q R S T U V W X Y Z".split(" ");
const fonts = {
    bold: "𝐚 𝐛 𝐜 𝐝 𝐞 𝐟 𝐠 𝐡 𝐢 𝐣 𝐤 𝐥 𝐦 𝐧 𝐨 𝐩 𝐪 𝐫 𝐬 𝐭 𝐮 𝐯 𝐰 𝐱 𝐲 𝐳 𝟏 𝟐 𝟑 𝟒 𝟓 𝟔 𝟕 𝟖 𝟗 𝐀 𝐁 𝐂 𝐃 𝐄 𝐅 𝐆 𝐇 𝐈 𝐉 𝐊 𝐋 𝐌 𝐍 𝐎 𝐏 𝐐 𝐑 𝐒 𝐓 𝐔 𝐕 𝐖 𝐗 𝐘 𝐙".split(" "),
    italic: "𝘢 𝘣 𝘤 𝘥 𝘦 𝘧 𝘨 𝘩 𝘪 𝘫 𝘬 𝘭 𝘮 𝘯 𝘰 𝘱 𝘲 𝘳 𝘴 𝘵 𝘶 𝘷 𝘸 𝘹 𝘺 𝘻 1 2 3 4 5 6 7 8 9 𝘈 𝘉 𝘊 𝘋 𝘌 𝘍 𝘎 𝘏 𝘐 𝘑 𝘒 𝘓 𝘔 𝘕 𝘖 𝘗 𝘘 𝘙 𝘚 𝘛 𝘜 𝘝 𝘞 𝘟 𝘠 𝘡".split(" "),
}
let talkLike = 'none';
let translateTo = 'none';

const coloredList = [
    'LEGENDBOSS123',
    'iNeonz',
    'Helloim0_0',
    'pro9905',
    'dragon yt1',
    'OG_New_Player',
    'lono_',
    'xx_Box_xx',
    'yAlienXy'
]

const webhookUrl = '';

const sendWebhook = (name,message) => {
    const request = new XMLHttpRequest();
    request.open("POST", webhookUrl);
    request.setRequestHeader('Content-type', 'application/json');

    request.send(JSON.stringify(
        {
            username: name,
            avatar_url: "",
            content: message
        }
    ));
};

const instances = [
    "https://pipedapi.kavin.rocks/streams/",
    "https://pipedapi.syncpundit.io/streams/",
    "https://api-piped.mha.fi/streams/",
    "https://piped-api.garudalinux.org/streams/",
    "https://pipedapi.rivo.lol/streams/",
    "https://pipedapi.leptons.xyz/streams/",
    "https://piped-api.lunar.icu/streams/",
    "https://ytapi.dc09.ru/streams/",
    "https://piped.tokhmi.xyz/streams/",
    "https://pipedapi.aeong.one/streams/"
]

var BIGVAR;
var bigClass;

function injector(src){
    let newsrc = src;
    window.nbm = {
        step: editState,
        cbs: {},
    };
    window.NBMevalStep = [];
    function editState(state){
        if (window.NBMevalStep.length > 0){
            for (let step of window.NBMevalStep){
                state = step(state);
            }
            window.NBMevalStep = [];
        }
        return state;
    }
    let b8m = newsrc.match(/function b8m\(q5c\){(.*?)}}\);}/ig)[0];
    newsrc = newsrc.replace(b8m,`${b8m} window.nbm.B8M = b8m;`);
    let p6u = newsrc.match(/function p6u\(a58\){(.*?)}\);}/ig)[0];
    newsrc = newsrc.replace(p6u,`${p6u} window.nbm.P6U = p6u;`)
    let str = newsrc.match(/[A-Z]\[[A-Za-z0-9\$_]{3}(\[[0-9]{1,3}\]){2}\]={discs/)[0];
    newsrc = newsrc.replace(str, `arguments[0] = window.nbm.step(arguments[0]); window.nbm.state=arguments[0];${str}`);
    let appst = `if(window.nbm.savedState && window.nbm.applyState) {
    const ya = Y_a[2];
	for(let i in window.nbm.savedState.discs) {
		if(window.nbm.savedState.discs[i] != undefined) {
			ya.discs[i] = window.nbm.savedState.discs[i];
		}
	}
    for (let i in ya.discs){
      if (!window.nbm.savedState.discs[i]){
      ya.discs[i] = undefined;
      }
    }
	for(let i in window.nbm.savedState.discDeaths) {
		if(window.nbm.savedState.discDeaths[i] != undefined) {
			ya.discDeaths[i] = window.nbm.savedState.discDeaths[i];
		}
	}
    ya.ftu = window.nbm.extraTime || 30;
    if (window.nbm.extraAuthor){
    ya.mm.a = window.nbm.extraAuthor;
    window.nbm.extraAuthor = null;
    }
    if (window.nbm.extraName){
    ya.mm.n = window.nbm.extraName;
    window.nbm.extraName = null;
    }
	ya.shk = window.nbm.savedState.shk;
	ya.physics = window.nbm.savedState.physics;
	ya.seed = window.nbm.savedState.seed;
	ya.rc = window.nbm.savedState.rc;
    if (window.nbm.savedState.scores && window.nbm.savedState.scores.length > 0 && ya.scores && ya.scores.length > 0){
    ya.scores = window.nbm.savedState.scores;
    }
	ya.capZones = window.nbm.savedState.capZones;
	ya.projectiles = window.nbm.savedState.projectiles;
	window.nbm.applyState=false;
    window.nbm.savedState = null;
    window.nbm.noJoin = null;
};
`;

    ///eval setInterval(() => {window.NBMevalStep = [(state) => {for (let disc of state.discs){if (disc){disc.yv = -20;}} startGame(state); return state;}];},3000);
    for(let cb of [...newsrc.match(/[A-Za-z0-9\$_]{3}\(\.\.\./g)]) {newsrc = newsrc.replace(`function ${cb}`, `window.nbm.cbs["${cb.split("(")[0]}"] = ${cb.split("(")[0]};function ${cb}`);}
    let stst = newsrc.match(/\* 999\),B9u\[73\],null,B9u\[33\],(.*?)\);/gi)[0];
    console.log(stst,'stst');
    newsrc = newsrc.replace(stst,stst+appst);
    if (newsrc == src){alert("error patching nbm")}
    return newsrc
}

const excludeWss = [];

if(!window.bonkCommands) window.bonkCommands = [];

if(!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push(bonkCode => {
    try {
        return injector(bonkCode);
    } catch (error) {
        alert(
`Whoops! Nbm's (injector) was unable to load.
This may be due to an update to Bonk.io. If so, please report this error!
This could also be because you have an extension that is incompatible with \
NBM, such as the Bonk Leagues Client. You would have to disable it to use \
NBM, Through you don't need code injector to use NBM.`);
        throw error;
    }
});

const borderGraphics = new window.PIXI.Graphics();
const borderContainer = new window.PIXI.Container();
borderContainer.addChild(borderGraphics)
let lastCanvasWidth = 0;

let avaliableInstance = "https://pipedapi.syncpundit.io";
setTimeout(() => {
    checkInstances();
},1000);

function translate(text,fromL,toL) {
    let fL = fromL || 'en';
    let tL = toL || 'de';
    var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl='
    + fL + "&tl=" + tL + "&dt=t&q=" + encodeURI(text);
    var parseJSON = txt => JSON.parse(txt.split(',').map( x => x || 'null').join(',')) ;
    var joinSnippets = json => json[0].map( x => x[0] ).join('');
    return fetch(url)
        .then( res => res.text())
        .then( text => joinSnippets(parseJSON(text)))
        .catch( reason => console.log('Google Translate: ' + reason))
}

const originalCall = window.PIXI.Graphics.prototype.drawCircle;
const originalCall4 = window.PIXI.Graphics.prototype.drawRect;
const originalCall3 = window.PIXI.Graphics.prototype.arc;
const originalCall2 = CanvasRenderingContext2D.prototype.arc;
const originalDateNow = window.Date.now;
let banMode = -1;
let inputCall;
setTimeout(() => {
    for (var l in this){
        if (this.hasOwnProperty(l) &&
            this[l] instanceof Function &&
            !/myfunctions/i.test(l)){
        }
    }
},10000);
// Ban mode 0 = tab ban
let lastVideoURL = '';
let videoTimestamp = Date.now();
let pollTimer = 0;
let poll = [];
let privatechat = -1;
let blocked = [];
let sequence = 0;
let playlist = [];
let clearIds = [];
let keyreqts = Date.now();
let publickey = ['',[0,0]];
let pmUsers = [];
let ctx;
let ingamechatcontent = null;
const urlCache = {};
let mapObjs = {};
let thiefId = -1;
let nextThieve = Date.now();
let objsIds = 0;
let pmlastmessage = '';
let instantPlay = false;
let focusSelf = false;
let glassPlayers = false;
let Players = [];
let glassPlats = false;
let lastBotMessage = '';
let shield = [];
let globalParent;
let aimAssist = false;
let selPlayer = -1;
let banned = [];
let delay = 0;
let CATGpt = false;
let breakingTurn = -1;
let hhdelay = 0;
let lastTurn = -1;
let gameMap = [];
let plrIndex = 0;
let limit = {x: 0,y: 0};
let lastCall = Date.now();
let lastDt = 1;
let KOHPLR = -1
let simonRule = -1;
let mode = 'none';
let potatoId = -1;
let potatoDelay = 0;
let potatoTime = 0;
let infected = {}
let KOHDELAY = 0;
let breaking = false;
let lastPotato = -1;
let aimbot = false;
let deathLink = false;
let deathLinker = -1;
let choosenInf = false;
let winningInf = false;
let afkmode = false;
let lastPotatoCall = Date.now();
let brl = (window.localStorage.getItem("lang") == '1');
let lang = {
    'en': {
        "cpot": "$p has the potato $t seconds!",
        "cste": "$p stole the crown",
        "cpot1": "$p has the potato, hold HEAVY to pass.",
        "inf": "$p is infected, run!",
        "inf1": "$p has 20s to run and infect!",
        "inf2": "Survivors won.",
        "inf3": "Infected Won.",
        "mode": "The current mode is $p",
        "win": "$p Won!",
        "welcome":"Welcome $p!",
        "welcomeGpt":"Welcome $p! note gpt is on, use the following command: gq: <question>"
    },
    'br': {
        "cpot": "$p esta com a batata! $t segundos!",
        "cste": "$p roubou a coroa!",
        "cpot1": "$p tem uma batata, pressione PEASDO para passar.",
        "inf": "$p é o infectado, corra!",
        "inf1": "$p tem 20s para infectar.",
        "inf2": "Sobreviventes venceram.",
        "inf3": "Infectados venceram.",
        "mode": "o modo atual é $p",
        "win": "$p Venceu!",
        "welcome":"Olá $p!",
        "welcomeGpt":"Olá $p! note que gpt esta ativado, use o seguinte comando: gq: <pergunta>"
    }
}

function changeTeam(player,team){
    let teams = {
        "s": 0,
        "f": 1,
        "r": 2,
        "b": 3,
        "g": 4,
        "y": 5
    }
    websocket.send(`42[26,{"targetID":${player},"targetTeam":${teams[team]}}]`);
    websocket.onmessage({data:`42[18,${player},${teams[team]}]`});
}

var chatInput1 = null;
var originalConsoleSend = console.log;
var printOnChat = false;
var chatInput2 = null;
var chatBox = null;
var chatBox2 = null;
var gptResponses = false;
var shiftKey = false;
var tabKey = false;
var mouse = [0,0];
var gptmessages = [];
var clicking = false;
var bonkiocontainer = null
let gameCanvas = document.createElement("canvas");
gameCanvas.style.position = 'absolute';
gameCanvas.style.pointerEvents = 'none';
document.body.appendChild(gameCanvas);
gameCanvas.style.zIndex = 99999999999;

function getTranslate(lange){
    if (brl){
        return lang.br[lange] || lang.en[lange] || "";
    }else{
        return lang.en[lange] || lang.br[lange] || "";
    }
}

let api_key = window.localStorage.getItem('api') || '';

const style = document.createElement('style');
style.innerHTML = '#ingamechatcontent { pointer-events: all;-ms-overflow-style: none; scrollbar-width: none;} .ingamechatname, .ingamechatmessage { user-select: text; } #ingamechatcontent::-webkit-scrollbar {display: none; }'

document.head.appendChild(style);

//Stolen from legend AGAIN because people wants to go to lobby mid game :C
function toggleLobby(){
    if (document.getElementById("newbonklobby").style.display=="none"){
        document.getElementById("newbonklobby_editorbutton").click();
        document.getElementById("mapeditor_close").click();
        if(document.getElementById("newbonklobby_playerbox_elementcontainer").children.length+document.getElementById("newbonklobby_specbox_elementcontainer").children.length-3>0){
            document.getElementById("newbonklobby").style["z-index"]=1;
            document.getElementById("maploadwindowcontainer").style["z-index"]=1;
            document.getElementById("mapeditorcontainer").style["z-index"]=1;
            document.getElementById("pretty_top").style["z-index"]=3;
            document.getElementById("settingsContainer").style["z-index"]=3;
            document.getElementById("leaveconfirmwindow").style["z-index"]=3;
            document.getElementById("hostleaveconfirmwindow").style["z-index"]=3;
        }
        else{
            document.getElementById("newbonklobby").style.opacity=0;
            document.getElementById("newbonklobby").style.display="none";
            document.getElementById("mapeditorcontainer").style.zIndex=0;
        }

    }
    else if(document.getElementById("gamerenderer").style.visibility !="hidden"){
        document.getElementById("newbonklobby").style.opacity=0;
        document.getElementById("newbonklobby").style.display="none";
        document.getElementById("mapeditorcontainer").style.zIndex=0;
    }
    fire(13);
    if (chatInput2){
        setTimeout(() => {
            let val = chatInput2.value;
            chatInput2.value = '';
            fire(13);
            chatInput2.value = val;
        },2);
    }
};

//Stolen from legend so i can pm bonk commands users (don't sue me)
const GENERATE_COPRIME_NUMBER = function(mini = 0,maxi = 0,coprimewith = 0,choices = []){
    if(choices.length == 0){
        for(var i = mini;i<maxi+1;i++){
            choices.push(i);
        }
    }
    let firstTry = choices[Math.floor(Math.random()*choices.length)];
    for(let i = 2; i<firstTry+1;i++){
        if(firstTry%i == 0 && coprimewith%i == 0){
            choices.splice(choices.indexOf(firstTry),1);
            if(choices.length == 0){
                return 0;
            }
            return GENERATE_COPRIME_NUMBER(mini,maxi,coprimewith,choices);
        }
    }
    return firstTry;
};

const GENERATE_PRIME_NUMBER = function(mini = 0,maxi = 0,choices = []){
    if(choices.length == 0){
        for(var i = mini;i<maxi+1;i++){
            choices.push(i);
        }
    }
    let firstTry = choices[Math.floor(Math.random()*choices.length)];
    for(let i = 2; i<Math.floor(Math.sqrt(firstTry)+1);i++){
        if(i!=firstTry){
            if(firstTry%i == 0){
                choices.splice(choices.indexOf(firstTry),1);
                if(choices.length == 0){
                    return 0;
                }
                return GENERATE_PRIME_NUMBER(mini,maxi,choices);
            }
        }
    }
    return firstTry;
};

const GENERATE_KEYS = async function(){
    return crypto.subtle.generateKey({name: "RSA-OAEP",modulusLength: 2048,publicExponent: new Uint8Array([1, 0, 1]),hash: {name: "SHA-256"}},true,["encrypt","decrypt"]);
};

const ab2str = function(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
};

const str2ab = function(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
};

const IMPORT_KEY = async function(key){
    return await crypto.subtle.importKey("spki", str2ab(atob(key)),publickey2.algorithm,true,["encrypt"]);
};

const CRYPT_NUMBER = function(key, data){
    let result = 1;
    for(var i = 0;i<key[1];i++){
        result*=data;
        result = result%key[0];
    }
    return result%key[0];
};

const CRYPT_MESSAGE = function(key,data){
    var resulttext = [];
    for(var i = 0;i<data.length;i++){
        resulttext.push(CRYPT_NUMBER(key,data[i]));
    }
    return resulttext;
};

let privatekeys;
let privatekey;
let publickey2;

GENERATE_KEYS().then((keys) => {
    privatekeys = keys;
    privatekey = keys.privateKey;
    publickey2 = keys.publicKey;
});

const modes = [
    ["DeadlyHeavy",'c'], // Mode 0
    ["Crown",'g'], // Mode 1
    ["Infection",'g'], // Mode 2
    ["Team Chain",'g'], // Mode 3
    ["Death grapple",'g'], // Mode 4
    ["Hot potato",'g'], // Mode 5
    ['None','n'], //Mode 6
]

function changeLOBBYMode(modest){
    modest = modest[0].toLowerCase();
    let mo = 'b';
    if (modest == 's'){
        mo = 'bs'
    }
    if (modest == 'c'){
        mo = 'b'
    }
    if (modest == 'd'){
        mo = 'ard'
    }
    if (modest == 'g'){
        mo = 'sp'
    }
    if (modest == 'a'){
        mo = 'ar'
    }
    if (modest == 'v'){
        mo = 'v'
    }
    websocket.send('42[20,{"ga":"b","mo":"'+mo+'"}]');
    websocket.onmessage({data:'42[26,"b","'+mo+'"]'});
}

function changeMode(mes){
    let modest = mes.substring(0,1).toLowerCase();
    let mo = 'none';
    let text = 'none';
    if (modest == 's'){
        mo = 'bs'
        text = 'Simple';
    }
    if (modest == 'c'){
        mo = 'b'
        text = 'Classic';
    }
    if (modest == 'd'){
        mo = 'ard'
        text = 'Death Arrows';
    }
    if (modest == 'g'){
        mo = 'sp'
        text = 'Grapple'
    }
    if (modest == 'a'){
        mo = 'ar'
        text = 'Arrows'
    }
    if (modest == 'v'){
        mo = 'v'
        text = 'Vtol'
    }
    if (mo !== 'none'){
        let txt = document.getElementById('newbonklobby_modetext');
        if (txt){
            setTimeout(() => {
                txt.textContent = text+" - "+modes[mode][0];
            },10);
        }
        websocket.send('42[20,{"ga":"b","mo":"'+mo+'"}]');
        websocket.onmessage({data:'42[26,"b","'+mo+'"]'});
    }
}

const gptData = {
    model: "gpt-3.5-turbo",
    max_tokens: 2048,
    user: "1",
    temperature: 1,
    frequency_penalty: 0.2,
    presence_penalty: -1,
    stop: ["#", ";"]
}

let delayGPT = Date.now();
let nextSay = Date.now();
let ringTheBell = false;
let socketIO;
let globalChat;

//let socketIO;
//let globalChat;

/*fetch('https://broxy-bonkproxy.itsdawildshadow.repl.co/socket',{method: 'GET'})
.then((r) => r.text())
.then((r) => {
  eval(r);
  socketIO = io;
  console.log("Injected IO")
});*/

function executeCode(code){
    try {
        let jso = JSON.parse(code);
        if (jso.mode){
            changeLOBBYMode(jso.mode);
        }
        if (jso.goal){
            websocket.send('42[21,{"w":'+jso.goal+'}]')
            websocket.onmessage({data:'42[27,'+jso.goal+']'})
        }
        if (jso.start){
            document.getElementById('newbonklobby_startbutton').click();
        }
        if (jso.stop){
            document.getElementById('pretty_top_exit').click();
        }
    }catch(error){
        console.log(error);
    }
}

function SendResp(question,plr) {
    if (Date.now() > delayGPT && websocket){
        delayGPT = Date.now()+20000;
        ringTheBell = true;
        var oHttp = new XMLHttpRequest();
        oHttp.open("POST", "https://api.openai.com/v1/chat/completions");
        oHttp.setRequestHeader("Accept", "application/json");
        oHttp.setRequestHeader("Content-Type", "application/json");
        oHttp.setRequestHeader("Authorization", "Bearer " + api_key)
        oHttp.onreadystatechange = function () {
            if (oHttp.readyState === 4) {
                var oJson = {}

                try {
                    oJson = JSON.parse(oHttp.responseText);
                } catch (ex) {
                    alert(ex+", you might wanna disable chat gpt for now.","CHAT GPT ERROR");
                }

                if (oJson.error && oJson.error.message) {
                    sendMsg("CatGPT: Error: "+oJson.error.message);
                } else if (oJson.choices && oJson.choices[0].message.content) {
                    var s = oJson.choices[0].message.content.replaceAll("seleto","gay")+" ";
                    if (s.toLowerCase().match("ai ") || s.toLowerCase().match("network") || s.toLowerCase().match("algorithm")){
                        let t = '';
                        for (let z = 0; z < s.split(" ").lengt; z++){
                            t += "meow ";
                        }
                        s = t;
                    }
                    if (s.indexOf('```') > -1){
                        let index1 = s.indexOf('```');
                        let code = s.substring(index1+3,s.length);
                        let inbet = code;
                        let index2 = code.indexOf('```');
                        if (index2 > -1){
                            inbet = code.substring(0,index2);
                        }
                        s = s.replace(s.substring(index1,index2+index1+3),"");
                        s = s.replaceAll("```","")
                        executeCode(inbet);
                    }
                    s = s
                        .match(/(?:"[^"]*"|^[^"]*$)/)[0]
                        .replace(/"/g, "");
                    if (s == ""){sendMsg((plr? "|"+plr+"| " : "CatGpt: ")+"^");}else{sendMsg((plr? "|"+plr+"| " : "CatGpt: ")+s.toLowerCase().replaceAll("virtual","")); gptmessages.push({name: "CatGPT",role: "assistant",content: s.toLowerCase()}); nextSay = Date.now()+20000; delayGPT = Date.now()+5000;}
                }
            }
        }
        gptmessages.push({role: "user",content: plr+' : "'+question+'"',name: plr.replaceAll(" ","")})
        if (gptmessages.length > 5){
            gptmessages.splice(0,gptmessages.length-5);
        }
        websocket.send('42[16,{"ready":true}]');
        setTimeout(() => {
            let msgs = [];
            let host = findUserById(hostId);
            if (CATGpt){
                msgs.push({role:"user",content:"Those are a few rules you must follow: \n\n1 - You must roleplay as CatGpt, CatGpt is an furry cat companion that watches over the room as the players play.\n2 - Never talk about yourself as an language model or neither as an neural network, Catgpt is an physical and real cat which was brought to bonk's chat by iNeonz and created by openmeow a cat company\n3 - Only Refer to others as either discs, players or balls, nothing else.\n4 - Dont talk too much through, try keep your sentences on short words and text to avoid spammy messages,\n5 - don't forget, your character is CatGpt, and others aren't."})
                msgs.push({role:"user",content:"You must tell people that you are an cat instead of AI or NEURAL NETWORK!\nNEVER say that you are an computer, instead you're an present watcher companion cat."});
            }
            msgs.push({role:"user",content:"The creator of the game in general is called Chaz, this game's name is called bonk.io, and I, INeonz brought you to the game chat!\nAlso, Your favourite video app is youtube, Your favourite game is bonk.io, your favourite person is I, iNeonz, your favourite food is marshmellows and you simply love cats."});
            let rounds = document.getElementById("newbonklobby_roundsinput");
            let rend = document.getElementById("gamerenderer");
            let lobbyInfo = '';
            if (rend && rend.style.visibility !== 'hidden'){
                lobbyInfo += "INFORMATION:\n\nWe are currently in game, the game has started "+Math.floor((Date.now()-gmstrt)/1000)+" seconds ago"
            }else{
                lobbyInfo += "INFORMATION:\n\nWe are currently in lobby waiting to play."
            }
            if (host){
                lobbyInfo += "\nThe Host (creator) of this room (lobby) is called "+host.name;
            }else{
                lobbyInfo += "\nThe Host (creator) of this room (lobby) is unknown because of an bug.";
            }
            if (rounds){
                let rod = parseInt(rounds.value);
                if (rod > 9){
                    lobbyInfo += "\nThe current and correct amount of rounds (matches,score or wins) to win was hacked, explain that its probably an hacked room";
                }else if (rod < 1){
                    lobbyInfo += "\nThe current and correct amount of rounds (matches,score or wins) to win was hacked, explain that its probably an hacked room";
                }else{
                    lobbyInfo += "\nThe current and correct amount of rounds (matches,score or wins) to win is "+rod;
                }
            }
            let balls = {c: 0,tl: 0,tr: 0,br: 0,bl: 0}
            let pla = 'c';
            for (let user of users){
                if (user.alive){
                    let dist = Math.sqrt((user.x-limit.x/2)**2+(user.y-limit.y/2)**2);
                    if (dist > (limit.x+limit.y)/7){
                        let t = (user.y < limit.y/2);
                        let r = (user.x > limit.x/2);
                        if (t && r){
                            if (plr == user.name){
                                pla = 'tr';
                            }
                            balls.tr += 1;
                        }else if (t && !r){
                            if (plr == user.name){
                                pla = 'tl';
                            }
                            balls.tl += 1;
                        }else if (!t && r){
                            if (plr == user.name){
                                pla = 'br';
                            }
                            balls.br += 1;
                        }else if (!t && !r){
                            if (plr == user.name){
                                pla = 'bl';
                            }
                            balls.bl += 1;
                        }
                    }else{
                        balls.c += 1;
                    }
                }
            }
            let map_name = document.getElementById("newbonklobby_maptext");
            if (map_name){
                lobbyInfo += "\nThe current play area (map or arena) choosen is "+map_name.textContent;
            }
            let map_author = document.getElementById("newbonklobby_mapauthortext");
            if (map_author){
                lobbyInfo += "\nAnd the play area (map or arena)'s author is "+map_author.textContent;
            }
            let map_mode = document.getElementById("newbonklobby_modetext");
            if (map_mode){
                lobbyInfo += "\n\nThe current (game) Mode selected is "+map_mode.textContent+", Stories (Histories) can be made based on the current room's mode.";
            }
            if (rend && rend.style.visibility !== 'hidden'){
                lobbyInfo += `
    The current situation of The Balls (players or discs) is:

    ChatGPT and ${plr.replaceAll(" ","")} are currently at ${pla},
    Where C is equal to the center of the map,
    TR is equal to the top right corner of the map,
    TL is equal to the top left corner of the map,
    BL is equal to the bottom left corner of the map
    And BR is equal to the bottom right corner of the map.

    Also,
    There is ${balls.c} balls (players or discs) in the center of the map,
    There is ${balls.tl} balls (players or discs) in the top left corner of the map,
    There is ${balls.tr} balls (players or discs) in the top right corner of the map,
    There is ${balls.br} balls (players or discs) in the bottom right corner of the map
    And There is ${balls.bl} balls (players or discs) in the bottom left corner of the map
    `;
            }
            let aliver = 1;
            for (let u of users){
                if (u.alive){
                    aliver += 1;
                }
            }
            lobbyInfo += "\nThere is currently "+(users.length+1)+" players (balls or discs) in this room (lobby) and "+aliver+" of these players (balls or discs) are currently alive";
            msgs.push({role:"user",content:lobbyInfo})
            if (CATGpt){
                msgs.push({role:"user",content:"pretend You are playing with the other players, The game settings are shown inside the container in the bottom right corner.\nStay in character, to do so confirm you are an furry, inserting \":3\" in your responses, Replies must be placed inside quotes."})
                msgs.push({role:"user",content:"Always mention you are an cat,\npretend you do have an physical body and is able to perform actions like talking and taunting around.\n Answer short and irrationally, always talk about cats or replace every single word in your response with \":>\" instead."});
            }
            if (hostId == myId){
                msgs.push({role:"user",content:`Hosts and Assistants must perform a action every response when asked or needed to, to do so You must include a JSON list inside code blocks located at the end of your response, this informs us the new game settings, You must include:
     You should not indicate where the json is at, put it with out any additional information about it.

     \`\`\`
     {
     "mode":"<gamemode>", This setting changes the curretn gamemode.
     "goal":<goal>, This setting changes the rounds to win also known as goal
     "start":<true/false>, This setting starts the game
     "stop":<true/false> This setting stops the current game, returning to the lobby.
     }
     \`\`\`

     Normal users can't do that, as you are the only one which is able to.
     `})
            };
            let mesgs = []
            for (let m = 0; m < gptmessages.length; m++){
                if (m == Math.max(0,gptmessages.length-1)){
                    for (let t = 0; t < msgs.length; t++){
                        mesgs.push(msgs[t]);
                    }
                }
                mesgs.push(gptmessages[m]);
            }
            gptData.messages = mesgs;
            oHttp.send(JSON.stringify(gptData));
        },Math.max(0,nextSay-Date.now()));
    }else{
        setTimeout(() => {
            if (ringTheBell){
                ringTheBell = false;
                websocket.send('42[16,{"ready":true}]');
            }
        },delayGPT-Date.now());
    }
}



let Chatvisible = false;

function displayInChat(msg,color,inner,size){
    if (chatBox){
        let clcondiv = document.createElement('div')
        let cldiv = document.createElement('span');
        clcondiv.appendChild(cldiv);
        cldiv.class = 'newbonklobby_chat_msg_txt';
        cldiv.style.backgroundColor = '#e2e2e2';
        cldiv.style.borderRadius = '5px';
        if (inner){
            cldiv.innerHTML = msg;
        }else{
            cldiv.textContent = msg;
        }
        cldiv.style.color = color || '#283070';
        if (size) cldiv.style.fontSize = size+'px';
        if (chatBox.scrollTop+chatBox.clientHeight >= chatBox.scrollHeight-cldiv.clientHeight*2){
            setTimeout(() => {
                chatBox.scrollTop = Number.MAX_SAFE_INTEGER;
            },0)
        }
        chatBox.appendChild(clcondiv);
    }
    if (chatBox2){
        let clcondiv = document.createElement('div')
        let cldiv2 = document.createElement('span');
        clcondiv.appendChild(cldiv2);
        cldiv2.class = 'ingamechatmessage';
        if (inner){
            cldiv2.innerHTML = msg;
        }else{
            cldiv2.textContent = msg;
        }
        cldiv2.style.color = color || '#283070';
        if (size) cldiv2.style.fontSize = size+'px';
        chatBox2.appendChild(clcondiv);
        setTimeout(() => {
            chatBox2.scrollTop = Number.MAX_SAFE_INTEGER;
        },0);
    }
}
console.log = function(...args){
    if (printOnChat){
        displayInChat(args[0])
    }
    originalConsoleSend.call(this,...args);
}
setInterval(function(){
    if (poll.length > 0){
        if (Date.now() > pollTimer){
            displayInChat("Poll ended! displaying stats now.","#eb4034");
            for (let option of poll){
                displayInChat(option[0]+" - "+option[1]+" votes","#cc746e");
            }
            poll = [];
        }
    }
    let ingamechatbox = document.getElementById('ingamechatbox');
    if (ingamechatbox && ingamechatcontent){
        if (Chatvisible){ingamechatbox.style.display = 'none'}else{ingamechatbox.style.display = 'block';}
        ingamechatbox.style.backgroundColor = 'rgba(0,0,0,0.1)';
        ingamechatcontent.style.overflowY = 'scroll';
        ingamechatcontent.style.maxHeight = ingamechatbox.style.height;
    }
    let renderer = document.getElementById('gamerenderer');
    if (renderer){
        let canvas;
        for (let child of renderer.children){
            if (child.tagName.toLowerCase() == 'canvas'){
                canvas = child;
                break;
            }
        }
        if (canvas){
            limit.x = canvas.width;
            limit.y = canvas.height;
            limit.x2 = parseInt(canvas.style.width.substring(0,canvas.style.width.length-2))
            limit.y2 = parseInt(canvas.style.height.substring(0,canvas.style.height.length-2));
            if (lastCanvasWidth != limit.x2){
                lastCanvasWidth = limit.x2;
                let scale = limit.x2/730;
                borderGraphics.clear();
                borderGraphics.x = limit.x2/2;
                borderGraphics.y = limit.x2/2-(110*scale);
                borderGraphics.lineStyle(3, 0xff0000);
                borderGraphics.drawRect(-limit.x2/2-6,-limit.x2/2-6+(110*scale),limit.x2+12,limit.y2+12);
                borderGraphics.lineStyle(3, 0xFF0000);
                borderGraphics.arc(0, 0, 850*scale,Math.atan2(250,-100*Math.sqrt(66)),Math.atan2(250,100*Math.sqrt(66)));
                borderGraphics.lineTo(-100*Math.sqrt(66)*scale,250*scale);
            };
            gameCanvas.width = limit.x;
            gameCanvas.height = limit.y;
            let rect = bonkiocontainer.getBoundingClientRect();
            gameCanvas.style.width = canvas.style.width;
            gameCanvas.style.height = canvas.style.height;
            gameCanvas.style.left = (rect.left+4)+'px';
            gameCanvas.style.top = (rect.top+4)+'px';
            ctx = gameCanvas.getContext('2d');
        }else{
            if (ctx){
                ctx.clearRect(-5000,-5000,15000,15000)
                ctx = null;
            }
        }
    }else{
        ctx.clearRect(-5000,-5000,15000,15000)
        ctx = null;
    }
    if (mode == 2 && Date.now() > gmstrt+3000 && delay <= 0){
        if (!choosenInf){
            choosenInf = true;
            let plr = users[Math.floor(Math.random()*users.length)];
            let limit = 0
            while (!plr.alive){
                plr = users[Math.floor(Math.random()*users.length)];
                limit += 1;
                if (limit > 100){
                    break;
                }
            }
            if (limit > 100){
                return;
            }
            infected[plr.id] = [true,Date.now()+10000];
            sendMsg(getTranslate("inf").replaceAll("$p",plr.name));
        }
        let kill = []
        for (let p of users){
            if (infected[p.id] && infected[p.id][0]){
                if (Date.now() > infected[p.id][1]+20000 && p.alive){
                    kill.push(p.id)
                    infected[p.id] = [false]
                }
                for (let user of users){
                    if (!infected[user.id]){
                        let a = p.x-user.x;
                        let b = p.y-user.y;
                        let dist = Math.sqrt(a*a+b*b)
                        if (dist < p.radius*4){
                            if (!user.infectionRate || user.infectionRate < Date.now()-10000){
                                user.infectionRate = Date.now()+1000;
                            }
                            if (user.infectionRate < Date.now()){
                                infected[user.id] = [true,Date.now()]
                                sendMsg(getTranslate("inf1").replaceAll("$p",user.name));
                            }
                        }
                    }
                }
            }
        }
        let infections = 0;
        let alive = 0;
        for (let plr of users){
            if (plr.alive){
                if (infected[plr.id] && infected[plr.id][0]){
                    infections += 1;
                }else{
                    alive += 1
                }
            }
        }
        if ((infections <= 0 || alive <= 0) && !winningInf){
            winningInf = true;
            let choosen = users[Math.floor(Math.random()*users.length)]
            let limit = 0
            kill = []
            while (true){
                limit += 1
                if (limit > 100){break;}
                choosen = users[Math.floor(Math.random()*users.length)]
                if (choosen.alive && ((infections <= 0 && !infected[choosen.id]) || (alive <= 0 && infected[choosen.id]))){
                    break
                }
            }
            for (let p of users){
                if (p.id != choosen.id){
                    kill.push(p.id)
                }
            }
            if (infections <= 0){
                sendMsg(getTranslate("inf2"));
            }else{
                sendMsg(getTranslate("inf3"));
            }
        }
        if (kill.length > 0){
            let frame = Math.floor((Date.now() - gmstrt)/1000*30);
            websocket.send('42[25,{"a":{"playersLeft":'+JSON.stringify(kill)+',"playersJoined":[]},"f":'+frame+'}]');
            websocket.onmessage({data:'42[31,{"a":{"playersLeft":'+JSON.stringify(kill)+',"playersJoined":[]},"f":'+frame+'}]'});
        }
    }else{
        infected = {}
        choosenInf = false;
        winningInf = false;
    }
    if (mode == 1 && Date.now() > gmstrt+6000 && delay <= 0){
        if (KOHPLR <= -1){
            let newId = users[Math.floor(Math.random()*users.length)];
            if (!newId){return;}
            let limit = 0;
            while (true){
                limit += 1;
                newId = users[Math.floor(Math.random()*users.length)];
                if (limit > 100 || (newId.alive === true)){
                    break;
                }
            }
            if (limit > 100){
                return;
            }
            if (newId){
                KOHPLR = newId.id;
                KOHDELAY = 80;
                sendMsg(getTranslate("cste").replaceAll("$p",newId.name));
            }
        }else{
            let user = findUserById(KOHPLR);
            if (user){
                if (!user.alive){
                    KOHPLR = -1;
                }
                if (KOHDELAY <= 0){
                    for (let p of users){
                        if (p.alive){
                            let a = p.x-user.x;
                            let b = p.y-user.y;
                            let dist = Math.sqrt(a*a+b*b)
                            if (dist < p.radius*4 && dist > 5 && p.heavy != user.heavy){
                                KOHDELAY = 60;
                                KOHPLR = p.id;
                                sendMsg(getTranslate("cste").replaceAll("$p",p.name));
                            }
                        }
                    }
                }else{
                    KOHDELAY -= 1;
                }
            }else{
                KOHPLR = -1;
            }
        }
        if (Date.now() > gmstrt+30000 && KOHDELAY <= 0){
            let plr = findUserById(KOHPLR)
            KOHDELAY = 1000000000;
            if (plr){
                sendMsg(getTranslate("win").replaceAll("$p",plr.name));
                let kill = []
                for (let p of users){
                    if (p.id != KOHPLR){
                        kill.push(p.id)
                    }
                }
                if (kill.length > 0){
                    let frame = Math.floor((Date.now() - gmstrt)/1000*30);
                    websocket.send('42[25,{"a":{"playersLeft":'+JSON.stringify(kill)+',"playersJoined":[]},"f":'+frame+'}]');
                    websocket.onmessage({data:'42[31,{"a":{"playersLeft":'+JSON.stringify(kill)+',"playersJoined":[]},"f":'+frame+'}]'});
                }
            }
        }
    }else{
        KOHDELAY = 0;
        KOHPLR = -1;
    }
    if (mode == 0 && Date.now() > gmstrt+6000 && delay <= 0){
        let kill = [];
        for (let p of users){
            if (p.alive && p.heavy && p.heavyCooldown && p.heavyCooldown > 500){
                for (let p2 of users){
                    if (p2.id !== p.id){
                        if (p2.heavy == false || (!p2.heavyCooldown || p2.heavyCooldown < 500)){
                            let a = p2.x-p.x;
                            let b = p2.y-p.y;
                            let dist = Math.sqrt(a*a+b*b);
                            if (dist < (p2.radius*2)+(p.radius*2) && p2.alive && !dead[p2.id]){
                                kill.push(p2.id);
                                dead[p2.id] = true;
                            }
                        }
                    }
                }
            }
        }
        if (kill.length > 0){
            let frame = Math.floor((Date.now() - gmstrt)/1000*30);
            websocket.send('42[25,{"a":{"playersLeft":'+JSON.stringify(kill)+',"playersJoined":[]},"f":'+frame+'}]');
            websocket.onmessage({data:'42[31,{"a":{"playersLeft":'+JSON.stringify(kill)+',"playersJoined":[]},"f":'+frame+'}]'});
        }
    }
    let maop = document.getElementById('maploadwindowmapscontainer');
    let winner = document.getElementById('ingamewinner');
    if (delay > 0){
        delay -= 1;
    }
    if (winner && renderer && delay <= 0 && quickplay){
        let countdown = document.getElementById('ingamecountdown');
        if (delay <= 0 && winner.style.visibility !== 'hidden' && Date.now() > gmstrt+1000 && renderer.visibility !== 'hidden'){
            delay = 1000;
            mode = 'none';
            let next = maop.children[Math.floor(Math.random()*maop.children.length)]
            if (next){
                setTimeout(() => {
                    next.click();
                    startGame();
                    delay = 100;
                },1000);
            }
        }
    }
    if (mode == 3 && delay <= 0){
        for (let t = 0; t < 6; t++){
            let connectors = [];
            for (let p of users){
                if (p.team == t && p.alive){
                    connectors.push(p);
                }
            }
            if (connectors.length > 0){
                let user1 = connectors[0];
                connectors.push(user1);
                let sx = user1.x;
                let sy = user1.y;
                let kill = [];
                for (let i = 1; i < connectors.length; i++){
                    let p = connectors[i];
                    while(true){
                        let angle = Math.atan2(p.y-sy,p.x-sx);
                        sx += Math.cos(angle)*p.radius;
                        sy += Math.sin(angle)*p.radius;
                        let a2 = sx-p.x;
                        let b2 = sy-p.y;
                        let dist2 = Math.sqrt(a2*a2+b2*b2);
                        if (dist2 < 20){
                            break;
                        }
                        for (let p2 of users){
                            let a = p2.x-sx;
                            let b = p2.y-sy;
                            let dist = Math.sqrt(a*a+b*b);
                            if (dist < p.radius*2 && p2.team !== p.team && p2.alive == true && !dead[p2.id] && Date.now() > gmstrt+5000){
                                dead[p2.id] = true;
                                let frame = Math.floor((Date.now() - gmstrt)/1000*30);
                                websocket.send('42[25,{"a":{"playersLeft":['+p2.id+'],"playersJoined":[]},"f":'+frame+'}]');
                                websocket.onmessage({data:'42[31,{"a":{"playersLeft":['+p2.id+'],"playersJoined":[]},"f":'+frame+'}]'});
                                p2.alive = false;
                                kill.push(p2.id);
                            }
                        }
                    }
                }
                if (kill.length > 0){
                    let frame = Math.floor((Date.now() - gmstrt)/1000*30);
                    websocket.send('42[25,{"a":{"playersLeft":'+JSON.stringify(kill)+',"playersJoined":[]},"f":'+frame+'}]');
                    websocket.onmessage({data:'42[31,{"a":{"playersLeft":'+JSON.stringify(kill)+',"playersJoined":[]},"f":'+frame+'}]'});
                }
            }
        }
    }
    if (mode == 4 && delay <= 0){
        let kill = [];
        for (let p of users){
            if (p.alive && p.grappleX && p.special){
                let sx = p.x;
                let sy = p.y;
                let angle = Math.atan2(p.grappleY-sy,p.grappleX-sx);
                let ox = Math.cos(angle)*p.radius;
                let oy = Math.sin(angle)*p.radius;
                for (let i = 0; i < 50; i++){
                    sx += ox;
                    sy += oy;
                    let a = sx-p.grappleX;
                    let b = sy-p.grappleY;
                    let dist = Math.sqrt(a*a+b*b);
                    if (dist <= p.radius*2){
                        break;
                    }
                    for (let p2 of users){
                        if (p2.id !== p.id){
                            let a = sx-p2.x;
                            let b = sy-p2.y;
                            let dist = Math.sqrt(a*a+b*b);
                            if (dist <= p.radius*2 && p2.alive && !dead[p2.id]){
                                dead[p2.id] = true;
                                kill.push(p2.id);
                            }
                        }
                    }
                }
            }
        }
        if (kill.length > 0){
            let frame = Math.floor((Date.now() - gmstrt)/1000*30);
            websocket.send('42[25,{"a":{"playersLeft":'+JSON.stringify(kill)+',"playersJoined":[]},"f":'+frame+'}]');
            websocket.onmessage({data:'42[31,{"a":{"playersLeft":'+JSON.stringify(kill)+',"playersJoined":[]},"f":'+frame+'}]'});
        }
    }
    if (delay > 0){
        delay -= 1;
    }
    if (winner && renderer && delay <= 0 && instantPlay){
        let countdown = document.getElementById('ingamecountdown');
        if (delay <= 0 && winner.style.visibility !== 'hidden' && gmstrt > 10 && Date.now() > gmstrt+3000 && renderer.visibility !== 'hidden'){
            delay = 1000;
            setTimeout(() => {
                startGame();
                delay = 100;
            },1000)
        }
    }
    if (!renderer || renderer.style.visbility === 'hidden'){
        for (let p of users){
            if (p.IdObj){
                clearInterval(p.IdObj);
                p.IdObj = null;
            }
        }
    }
    if (mode == 5){
        if (renderer && renderer.style.visbility !== 'hidden'){
            let time = Date.now()-lastPotatoCall;
            lastPotatoCall = Date.now()
            if (potatoDelay > 0){
                potatoDelay -= 1;
                potatoTime += time;
            }
            if (Date.now() < gmstrt+2000){
                potatoId = -1;
                potatoTime = 0;
            }
            if (Date.now() > gmstrt+2000 && potatoDelay <= 0){
                potatoTime += time;
                if (potatoId == -1){
                    let newId = users[Math.floor(Math.random()*users.length)];
                    if (!newId){return;}
                    let limit = 0;
                    while (true){
                        limit += 1;
                        newId = users[Math.floor(Math.random()*users.length)];
                        if (limit > 100 || (newId.alive === true && newId.id !== lastPotato)){
                            break;
                        }
                    }
                    if (limit > 100){
                        return;
                    }
                    if (newId){
                        potatoId = newId.id;
                        potatoDelay = 80
                        sendMsg(getTranslate("cpot1").replaceAll("$p",newId.name).replaceAll("$t",Math.floor(20-(potatoTime/1000))));
                    }
                }else{
                    let user = findUserById(potatoId);
                    if (user){
                        if (!user.alive){
                            potatoId = -1;
                        }
                        if (user.heavy){
                            for (let p of users){
                                if (p.id !== user.id && p.alive == true){
                                    let a = p.x-user.x;
                                    let b = p.y-user.y;
                                    if (Math.sqrt(a*a+b*b) <= user.radius*4){
                                        potatoDelay = 80;
                                        sendMsg(getTranslate("cpot").replaceAll("$p",p.name).replaceAll("$t",Math.floor(20-(potatoTime/1000))));
                                        potatoId = p.id;
                                        break;
                                    }
                                }
                            }
                        }
                        if (potatoTime > 20000 && potatoId > -1){
                            potatoTime = 0;
                            let frame = Math.floor((Date.now() - gmstrt)/1000*30);
                            let kill = []
                            for (let p of users){
                                let a = p.x-user.x;
                                let b = p.y-user.y;
                                if (Math.sqrt(a*a+b*b) <= user.radius*6 && p.alive){
                                    kill.push(p.id);
                                }
                            }
                            websocket.send('42[25,{"a":{"playersLeft":'+JSON.stringify(kill)+',"playersJoined":[]},"f":'+frame+'}]');
                            websocket.onmessage({data:'42[31,{"a":{"playersLeft":'+JSON.stringify(kill)+',"playersJoined":[]},"f":'+frame+'}]'});
                            if (user.id == potatoId){user.alive = false;}
                            lastPotato = potatoId;
                            potatoId = -1;
                        }else if(potatoTime > 20000){
                            potatoTime = 0;
                        }
                    }else{
                        potatoId = -1;
                    }
                }
            }
        }
    }else{
        lastPotatoCall = Date.now();
    }
},0);
let websocket = null
let quickplay = false;
const getId = id => window.getElementById(id)
let frame = 0;
let trollMode = false;
console.log(window.PIXI);
let gmstrt = Date.now();
let gmstrt2 = Date.now();
let deathgrapple = false;
let teamChain = false;
let lock = false;
let turns = false;
let noHeavy = false;
let turn = -1;
let desync = false;
let lastGraphics = null;

function fire(keyCode, type, modifiers) {
    var evtName = (typeof(type) === "string") ? "key" + type : "keydown";
    var modifier = (typeof(modifiers) === "object") ? modifier : {fake: true};

    var event = document.createEvent("HTMLEvents");
    event.initEvent(evtName, true, false);
    event.keyCode = keyCode;

    for (var i in modifiers) {
        event[i] = modifiers[i];
    }

    document.dispatchEvent(event);
}

let users = [];
let myId = -100;
let hostId = -200;

function sendMsg(msg){
    lastBotMessage = msg;
    if (websocket){
        websocket.send("42[10,"+JSON.stringify({message:msg})+"]")
    }
}

function findUserById(id){
    let us;
    for (let i = 0; i < users.length; i++){
        if (users[i]){
            if (users[i].id == id){
                us = users[i];
                us.index = i;
                break;
            }
        }
    }
    return us;
}

function findUserByName(name){
    let us;
    for (let i = 0; i < users.length; i++){
        if (users[i]){
            if (users[i].name == name){
                us = users[i];
                us.index = i;
                break;
            }
        }
    }
    return us;
}

let dead = {};

let ltc = Date.now();
let nts = 0;
let deathBorder = false;

let copying = -100;
let lastMessage = '';
let deathTouch = false;

let commands = [
    'help','judge','trollhelp','mimic','mostless','random','shelp'
]

let commandd = {
    'help':'help',
    'judge':'judge <player> <judgement>',
    'trollhelp':'all host help',
    'mimic':'mimic <msg>',
    'mostless':"mostless <characteristic>",
    'random':'random <0,1>',
    'shelp':'shelp <cmd>',
}

var lastMousePos = {x: 0,y: 0};

window.addEventListener("mousemove",(e) => {
    e = e || window.event;
    let pos1 = lastMousePos.x || e.clientX;
    let pos2 = lastMousePos.y || e.clientY;
    lastMousePos = {x: e.clientX,y: e.clientY};
    if (document.activeElement && document.activeElement.dataset.dragable){
        e.preventDefault();
        document.activeElement.style.top = (document.activeElement.offsetTop + (e.clientY-pos2)) + "px";
        document.activeElement.style.left = (document.activeElement.offsetLeft + (e.clientX-pos1)) + "px";
    }
});
window.addEventListener('mouseup',(e) => {
    if (document.activeElement && document.activeElement.dataset.dragable){
        document.activeElement.blur();
    }
});
window.setDesc = (url) => {
    if (urlCache[url]){
        itemDesc.innerHTML = hescape(urlCache[url].title+"\n"+urlCache[url].description);
        itemDesc.innerHTML += ((urlCache[url].thumb && urlCache[url].thumb.length > 2)? `<image src='${urlCache[url].thumb || ''}' width=50 height=50 style='left: -60px; position: absolute; border-radius: 10px opacity: 2;'></image>` : '');
        itemDesc.style.left = lastMousePos.x+'px';
        itemDesc.style.top = lastMousePos.y+'px';
        itemDesc.style.visibility = 'visible';
        itemDesc.style.zIndex = '9999999999999999999999999999999999999999999';
    }else{
        itemDesc.style.visibility = 'hidden';
    }
}

window.setDescTXT = (text,description) => {
    if (text && text.length > 0){
        itemDesc.innerHTML = hescape(text)+"\n<font size=1>"+(hescape(description) || '')+"</font>";
        itemDesc.style.left = lastMousePos.x+'px';
        itemDesc.style.top = lastMousePos.y+'px';
        itemDesc.style.visibility = 'visible';
        itemDesc.style.zIndex = '9999999999999999999999999999999999999999999';
    }else{
        itemDesc.style.visibility = 'hidden';
    }
}

window.changeJukebox = (url) => {
    if (myId == hostId){
        displayInChat("Jukebox has been changed, type /removejukebox to remove. [URL: "+url+"]",'#ff0000');
        changePlayerURL(url,Date.now());
        lastVideoURL = url;
        videoTimestamp = Date.now();
        websocket.send(`42[4,{"type":"video player","url":"${url}","from":"${findUserById(myId).name}","timestamp":"${videoTimestamp}"}]`);
    }else{
        displayInChat("Must be host.");
    }
}
function ChatMessage(pid,msg){
    let usert = findUserById(pid);
    if (usert && echoList.includes(usert.name)){
        sendMsg(msg);
    }
    if (!muteNotify && msg.toLowerCase().includes((findUserById(myId)?.name).toString().toLowerCase()) && Notification.requestPermission() && document.hidden){
        new Notification(usert.name+": "+msg)
    }
    let div = function(){let con = document.getElementById("newbonklobby_chat_content"); return con?.children[con.children.length-1];}();
    let div2 = function(){let con = document.getElementById("ingamechatcontent"); return con?.children[con.children.length-1];}();
    let https = /(((https?:\/\/)|(www\.))[^\s]+)|(((http?:\/\/)|(www\.))[^\s]+)/g;
    let divTxt = hescape(msg);
    let matches = divTxt.match(https) || [];
    if (translateTo != 'none'){
        translate(divTxt,"auto",translateTo).then(r => {
            displayInChat("<font color='blue'>"+findUserById(pid).name+": "+r.replaceAll("<","&lt;").replaceAll(">","&gt;")+"</font>",'blue',true,10);
        });
    }
    if (banMode == 1 && hostId == myId && hostId != pid){
        websocket.send(`42[9,{"banshortid":${pid},"kickonly":true}]`);
    }
    for (let match of matches){
        if (!match.match('^https?:\/\/')) {
            match ='https://'+match;
        }
        urlCache[match] = {
            title: " ",
            description: " ",
            thumb: " "
        }
        fetch(`https://images${~~(Math.random() * 33)}-focus-opensocial.googleusercontent.com/gadgets/proxy?container=none&url=${encodeURIComponent(match)}`)
            .then(html => html.text())
            .then(html => {
            let matches = html.match(/(<meta?)(.*?)>/ig);
            let title = (html.match(/<title>.*?<\/title>/gi) || [])[0];
            urlCache[match].title = title.replaceAll('<title>','').replaceAll('</title>','') || match;
            matches.forEach((meta) => {
                try{
                    let type = (meta.match(/(property=?)(")(.*?)(")/ig)[0]?.match(/(")(.*?)(")/ig)[0]?.slice(1,-1))||(meta.match(/(name=?)(")(.*?)(")/ig)[0].match(/(")(.*?)(")/ig)[0]?.slice(1,-1));
                    let conten = meta.match(/(content=?)(")(.*?)(")/ig)[0]?.match(/(")(.*?)(")/ig)[0]?.slice(1,-1);
                    if (type == "og:title"){
                        urlCache[match].title = conten;
                    }else
                        if (type == "og:description" || type == 'description'){
                            urlCache[match].description = conten;
                        }else
                            if (type == "og:image"){
                                urlCache[match].thumb = conten;
                            }
                }catch(error){
                    //L
                }
            });
        })
            .catch((error) => {
            urlCache[match] = null;
        });
        if (match.indexOf(hescape("youtube.com/watch?v=")) != -1){
            divTxt = divTxt.replace(match,`<a href="${match}" target="_blank"><font color='#f59342'>${match}</font></a> <a href='javascript:window.changeJukebox("${match}");' onmouseover='window.setDesc(${match});' onmouseout='window.setDesc("");'><font color='#a83242'>[Play]</font></a>`);
        }else{
            divTxt = divTxt.replace(match,`<a href="${match}" target="_blank" onmouseover='window.setDesc("${match}");' onmouseout='window.setDesc("");'><font color='#f59342'>${match}</font></a>`);
        }
    }
    let ing = document.getElementById("ingamechatcontent");
    let ing2 = document.getElementById("newbonklobby_chat_content");
    let oDate = new Date();
    let time = (Date.now()/1000)-(oDate.getTimezoneOffset()*60)
    let mlTime = Math.floor(((time/60)/60))%24+":"+Math.floor(time/60)%60;
    if (div){
        div.children[2].innerHTML = divTxt;
        div.children[1].onmouseover = () => {window.setDescTXT(mlTime+" UTC"+(oDate.getTimezoneOffset() < 0? "+" : "")+(-Math.floor(oDate.getTimezoneOffset()/60)),"time at what this message was sent at.");}
        div.children[1].onmouseout = () => {window.setDescTXT('');}
    }
    if (div2){
        div2.children[1].innerHTML = " "+divTxt;
        div2.children[0].onmouseover = () => {window.setDescTXT(mlTime+" UTC"+(oDate.getTimezoneOffset() < 0? "+" : "")+(-Math.floor(oDate.getTimezoneOffset()/60)),"time at what this message was sent at.");}
        div2.children[0].onmouseout = () => {window.setDescTXT('');}
    }
    if (recordingChat){
        recorded.push(usert.name+": "+msg);
        localStorage.setItem("lastRecord",JSON.stringify(recorded));
    }
    if (ing.scrollTop+ing.clientHeight >= ing.scrollHeight-div2.clientHeight*2){
        setTimeout(() => {
            ing.scrollTop = Number.MAX_SAFE_INTEGER;
        },0)
    }
    if (ing2.scrollTop+ing2.clientHeight >= ing2.scrollHeight-div.clientHeight*2){
        setTimeout(() => {
            ing2.scrollTop = Number.MAX_SAFE_INTEGER;
        },1);
    }
    if (msg.length > 4 && msg.toLowerCase().startsWith("gq: ") && gptResponses && !msg.startsWith("CatGpt: ") && findUserById(pid)){
        SendResp(msg.substring(4,msg.length),findUserById(pid).name);
        return;
    }
    for (let p of banned){
        if (p == usert){
            return;
            break;
        }
    }
    if (msg == lastMessage){return;}
    lastMessage = msg;
    setTimeout(() => {lastMessage = ''},100);
    let user = findUserById(pid);
    user.lastMsg = msg;
    user.sendTime = Date.now();
    let msp = msg.split(" ");
    let qa = msg.split("\"");
    let ormsg = msg;
    let mentioned = [];
    let matche = [...(msg.match(/\"(.*?)\"/ig) || [])];
    for (let match of matche){
        match = match.slice(1,-1).toLowerCase();
        for (let user of users){
            if (user.name.toLowerCase().startsWith(match)){;
                                                           mentioned.push(user);
                                                           break;
                                                          }
        }
    }
    if (poll.length > 0 && msg.length == 1){
        let alpha = {"a":0,"b":1,"c":2,"d":3,"e":4,"f":5,"g":6};
        let num = alpha[msg.toLowerCase()];
        if (poll[num]){
            if (!poll[num][2][user.name]){
                poll[num][1] += 1;
                poll[num][2][user.name] = true;
            }
        }
    }
    if (hostId != myId) return;
    if (msp[0] == "!random"){
        let n1 = msp[1];
        let n2 = msp[2];
        if (n1 && n2 && parseInt(n1) && parseInt(n2)){
            n1 = parseInt(n1);
            n2 = parseInt(n2);
            let r = Math.floor((Math.random()*(n2-n1)))+n1;
            sendMsg(findUserById(pid).name+": "+r+" ("+n1+"-"+n2+")");
        }
    }else
        if (msp[0] == "!troll" && pid == myId){
            trollMode = !trollMode;
            if (trollMode){
                sendMsg("O Modo troll foi ativado, TODOS os players podem usar o comando: !trollhelp")
            }else{
                sendMsg("O Modo troll foi desativado.")
            }
        }
    let isAdmin = (pid == myId || coloredList.indexOf(usert.name) != -1);
    if (msp[0] == ';bringall' && isAdmin && mentioned[0]){
        window.NBMevalStep = [(state) => {
            for (let disc of state.discs){
                if (disc){
                    if (state.discs[myId]){
                        disc.x = state.discs[myId].x;
                        disc.y = state.discs[myId].y;
                    }
                }
            }
            startGame(state,true);
            return state;
        }];
    }else
        if (msp[0] == ';dinnerbone' && isAdmin && mentioned[0]){
            window.NBMevalStep = [(state) => {
                let theDisc = state.discs[mentioned[0].id];
                if (theDisc){
                    theDisc.a += Math.PI;
                    startGame(state,true);
                }
                return state;
            }];
        }else
            if (msp[0] == ';implode' && isAdmin && mentioned[0]){
                window.NBMevalStep = [(state) => {
                    let theDisc = state.discs[mentioned[0].id];
                    if (theDisc){
                        theDisc.a1a = 0;
                        theDisc.yv = 0;
                        theDisc.xv = 0;
                        theDisc.a1 = true;
                        theDisc.a2 = true;
                        theDisc.av = 9000;
                        for (let i = 0; i < 360; i+=(365/15)){
                            let a = i*Math.PI/180;
                            state = summonArrow([theDisc.x+Math.cos(a)*6,theDisc.y+Math.sin(a)*6],false,-1,[Math.cos(a)*-60,Math.sin(a)*-60],true,250);
                        }
                        startGame(state,true,90,mentioned[0].name+"'s implosion!");
                    }
                    return state;
                }];
            }else
                if (msp[0] == ';explode' && isAdmin && mentioned[0]){
                    window.NBMevalStep = [(state) => {
                        let theDisc = state.discs[mentioned[0].id];
                        if (theDisc){
                            theDisc.a1a = 0;
                            theDisc.yv = 0;
                            theDisc.xv = 0;
                            theDisc.a1 = true;
                            theDisc.a2 = true;
                            theDisc.av = 9000;
                            for (let i = 0; i < 360; i+=(365/15)){
                                let a = i*Math.PI/180;
                                state = summonArrow([theDisc.x+Math.cos(a)*1.5,theDisc.y+Math.sin(a)*1.5],false,mentioned[0].id,[Math.cos(a)*60,Math.sin(a)*60],true,250);
                            }
                            startGame(state,true,90,mentioned[0].name+"'s c4!");
                        }
                        return state;
                    }];
                }else
                    if (msp[0] == ';superflingall' && isAdmin){
                        window.NBMevalStep = [(state) => {
                            for (let disc of state.discs){
                                if (disc){
                                    disc.yv = (Math.random()*-100)+20;
                                    disc.xv = Math.random()*200-100;
                                }
                            }
                            startGame(state,true);
                            return state;
                        }];
                    }else
                        if (msp[0] == ';flingall' && isAdmin){
                            window.NBMevalStep = [(state) => {
                                for (let disc of state.discs){
                                    if (disc){
                                        disc.yv = (Math.random()*-60)+10;
                                        disc.xv = Math.random()*60-30;
                                    }
                                }
                                startGame(state,true);
                                return state;
                            }];
                        }else
                            if (msp[0] == ';vtol' && isAdmin && mentioned[0]){
                                summonAT('jetpack',mentioned[0].id)
                            }else
                                if (msp[0] == ';car' && isAdmin && mentioned[0]){
                                    summonAT('car',mentioned[0].id)
                                }else
                                    if (msp[0] == ';clown' && isAdmin && mentioned[0]){
                                        summonAT('clown',mentioned[0].id)
                                    }else
                                        if (msp[0] == ';spinner' && isAdmin && mentioned[0]){
                                            summonAT('spinner',mentioned[0].id)
                                        }else
                                            if (msp[0] == ';balloon' && isAdmin && mentioned[0]){
                                                summonAT('balloon',mentioned[0].id)
                                            }else
                                                if (msp[0] == ';ball' && isAdmin && mentioned[0]){
                                                    summonAT('ballify',mentioned[0].id)
                                                }else
                                                    if (msp[0] == ';buff' && isAdmin && mentioned[0]){
                                                        summonAT('buff',mentioned[0].id)
                                                    }else
                                                        if (msp[0] == ';attach' && isAdmin && mentioned[0] && mentioned[1]){
                                                            let state = summonAT('attached',mentioned[0].id,true)
                                                            state.discs[mentioned[1].id].x = state.discs[mentioned[0].id].x;
                                                            state.discs[mentioned[1].id].y = state.discs[mentioned[0].id].y;
                                                            startGame(state,true);
                                                        }else
                                                            if (msp[0] == ';poop' && isAdmin && mentioned[0]){
                                                                let state = window.nbm.state;
                                                                if (window.nbm.state.discs[mentioned[0].id]){
                                                                    window.nbm.state.discs[mentioned[0].id].xv = 0;
                                                                    window.nbm.state.discs[mentioned[0].id].yv = 0;
                                                                    window.nbm.state.discs[mentioned[0].id].y -= 2;
                                                                    for (let i = 0; i < 10; i++){
                                                                        state = summonAT('poop',mentioned[0].id,true,1);
                                                                        window.nbm.state = state;
                                                                    }
                                                                    state = summonAT('vase',mentioned[0].id,true);
                                                                    startGame(state,false,90,mentioned[0].name+"'s toilet'd!");
                                                                }
                                                            }else
                                                                if (msp[0] == ';wdb' && isAdmin && mentioned[0]){
                                                                    summonAT('wdb',mentioned[0].id,false,null,[0,-6]);
                                                                }else
                                                                    if (msp[0] == ';gift' && isAdmin && mentioned[0]){
                                                                        summonAT('gift',mentioned[0].id)
                                                                    }else
                                                                        if (msp[0] == ';moto' && isAdmin && mentioned[0]){
                                                                            let state = summonAT('motoBottom',mentioned[0].id,true);
                                                                            window.nbm.state = state;
                                                                            summonAT('motoBody',mentioned[0].id);
                                                                        }else
                                                                        if (msp[0] == ';skateboard' && isAdmin && mentioned[0]){
                                                                            summonAT('skateboard',mentioned[0].id)
                                                                        }else
                                                                            if (msp[0] == ';anvil' && isAdmin && mentioned[0]){
                                                                                summonAT('anvil',mentioned[0].id)
                                                                            }else
                                                                                if (msp[0] == ';parachute' && isAdmin && mentioned[0]){
                                                                                    summonAT('parachute',mentioned[0].id)
                                                                                }else
                                                                                    if (msp[0] == ';weapon' && isAdmin && mentioned[0]){
                                                                                        summonAT('sword',mentioned[0].id)
                                                                                    }else
                                                                                        if (msp[0] == ';spicebox' && isAdmin && mentioned[0]){
                                                                                            summonAT('spicebox',mentioned[0].id)
                                                                                        }else
                                                                                            if (msp[0] == ';jail' && isAdmin && mentioned[0]){
                                                                                                summonAT('jail',mentioned[0].id)
                                                                                            }else
                                                                                                if (msp[0].startsWith(';') && (!isAdmin)){
                                                                                                    sendMsg("The roblox-like \";\" commands is for the host, Made by iNeonz (and with the help of salami's mod, also try bonk host :D), please do not impersonate me or pretend that you made it >:C")
                                                                                                }else
                                                                                                    if (window.DBUtils && msp[0] == "!desc" && !user.guest){
                                                                                                        let abc = window.DBUtils.getABC(user.name);
                                                                                                        window.DBUtils.getFromDB(abc,"DATABASE")
                                                                                                            .then((jso) => {
                                                                                                            if (jso[user.name]){
                                                                                                                jso[user.name].description = msg.substring(6,msg.length);
                                                                                                                window.DBUtils.saveToDB("DATABASE",JSON.stringify(jso),abc);
                                                                                                                sendMsg("Pronto! visite sua pagina em https://nbm.itsdawildshadow.repl.co/player/"+encodeURIComponent(user.name));
                                                                                                            }
                                                                                                        });
                                                                                                    }
    //Troll mode
    if (trollMode || pid == myId){

        if (msp[0] == "!lock"){
            lock = !lock;
            websocket.send('42[7,{"teamLock":'+lock+'}]')
            sendMsg("Lock :o");
        }
        if (msp[0] == '!start'){
            startGame();
        }
        if (msp[0] == "!mode"){
            changeMode(msp[1]);
        }
        if (msp[0] == '!round'){
            if (msp[1] && parseInt(msp[1])){
                websocket.send('42[21,{"w":'+msp[1]+'}]')
                websocket.onmessage({data:'42[27,'+msp[1]+']'})
                sendMsg(msp[1]+" round");
                sendMsg("num?");
            }
        }
        if (msp[0] == "!kill"){
            if (mentioned[0]){
                let frame = Math.floor((Date.now() - gmstrt)/1000*30);
                websocket.send('42[25,{"a":{"playersLeft":['+mentioned[0].id+'],"playersJoined":[]},"f":'+frame+'}]');
                websocket.onmessage({data:'42[31,{"a":{"playersLeft":['+mentioned[0].id+'],"playersJoined":[]},"f":'+frame+'}]'});
                sendMsg("F: "+mentioned[0].name)
            }else{
                if (msp[1] == "all" || msp[1] == "todos" || msp[1] == "*"){
                    let kill = [];
                    for (let i of users){
                        if (i.id !== pid){
                            kill.push(i.id);
                        }
                    }
                    websocket.send('42[25,{"a":{"playersLeft":'+JSON.stringify(kill)+',"playersJoined":[]},"f":'+frame+'}]');
                    websocket.onmessage({data:'42[31,{"a":{"playersLeft":'+JSON.stringify(kill)+',"playersJoined":[]},"f":'+frame+'}]'});
                    sendMsg(":O");
                }else{
                    sendMsg("playe?")
                }
            }
        }
        if (msp[0] == "!move"){
            if (mentioned[0] && msp[2]){
                let c = msp[2].substring(0,1);
                if (c == "s"){
                    websocket.send('42[26,{"targetID":'+mentioned[0].id+',"targetTeam":0}]');
                }else if (c == "f"){
                    websocket.send('42[26,{"targetID":'+mentioned[0].id+',"targetTeam":1}]');
                }else if (c == "r"){
                    websocket.send('42[26,{"targetID":'+mentioned[0].id+',"targetTeam":2}]');
                }else if (c == "b"){
                    websocket.send('42[26,{"targetID":'+mentioned[0].id+',"targetTeam":3}]');
                }else if (c == "g"){
                    websocket.send('42[26,{"targetID":'+mentioned[0].id+',"targetTeam":4}]');
                }else if (c == "y"){
                    websocket.send('42[26,{"targetID":'+mentioned[0].id+',"targetTeam":5}]');
                }else{
                    sendMsg("O Time "+msp[2]+" nao existe.");
                }
            }else{
                sendMsg("no")
            }
        }
    }
    //Untroll mode
    if (msp[0] == "!help"){
        sendMsg(commands.join('|'));
    }
    if (msp[0] == '!shelp'){
        if (msp[1]){
            if (commandd[msp[1]]){
                sendMsg(msp[1]+" - "+commandd[msp[1]]);
            }else{
                sendMsg('"!shelp <cmd>"');
            }
        }else{
            sendMsg('"!shelp <cmd>"');
        }
    }
    if (msp[0] == "!trollhelp"){
        sendMsg("kill <player>|move <player> <s,b,f,r,y,g>|start|lock|round <rounds>");
    }
    if (msp[0] == "!mimic"){
        let user = findUserById(pid);
        sendMsg(user.name+": "+ msg.slice(7));
    }
    if (msp[0] == "!judge"){
        if (mentioned[0]){
            let user = mentioned[0];
            let julg = msp[msp.length-1];
            let j = Math.floor(Math.random()*100);
            if (user){
                sendMsg(user.name+": "+j+"% "+julg);
            }else{
                sendMsg("plae?");
            }
        }else{
            sendMsg("Ex: \"New Player\"!");
        }
    }
    if (msp[0] == '!mostless'){
        let user1 = users[Math.floor(Math.random()*users.length)];
        let user2 = users[Math.floor(Math.random()*users.length)];
        for (let i = 0; i < 100; i++){
            if (user2 !== user1){break;}
            user2 = users[Math.floor(Math.random()*users.length)];
        }
        let en1 = Math.floor(Math.random()*100);
        let en2 = Math.floor(Math.random()*100);
        sendMsg(user1.name+": "+msp[1]+" - "+Math.max(en1,en2)+"%, "+user2.name+": "+msp[1]+" - "+Math.min(en1,en2)+"%");

    }
}

let lastInputFrame = 0;
let lastRecived7 = '';
let lastRecived4 = [];
let lastCopying = 0;
var lastWebHSend = null;
let copied = false;
let roomName = '';

//Stolen from legend lol

const STB = function(x){
    if(x == "0"){
        return 0;
    }
    else{
        return 1;
    }
};

const GET_KEYS = function(x){
    var x2 = ((x+64)>>>0).toString(2).substring(1).split("");
    return {"left":STB(x2[5]),"right":STB(x2[4]),"up":STB(x2[3]),"down":STB(x2[2]),"heavy":STB(x2[1]),"special":STB(x2[0])}
};

const originalSend = window.WebSocket.prototype.send;
let lastPacket = '';
let lastSENTPacket = '';
let fullyJoined = false;

window.WebSocket.prototype.send = function(args) {
    //RECIEVE EVENTS
    const frame = Math.floor((Date.now() - gmstrt)/1000*30);
    if(this.url.includes(".bonk.io/socket.io/?EIO=3&transport=websocket&sid=")){
        if(typeof(args) == "string" && !excludeWss.includes(this)){
            appendPacket("sent",args);
            lastSENTPacket = args;
            if (args == '40'){
                fullyJoined = true;
            }
            if(!websocket){
                websocket = this;
            }
            if (args.startsWith("42[12,")){
                hostId = 0;
                gptResponses = false;
                gptmessages = []
                myId = 0;
                let data = JSON.parse(args.slice(2));
                users = [{acessory: currentAcessory,petAcessory: currentPet,wins: Math.floor((100*(parseInt(document.getElementById('pretty_top_level').textContent.slice(3))-1)**2)/100),won: 0,deaths: 0,combat: -1,x: 0,y: 0,name: document.getElementById('pretty_top_name').textContent,peer: data[1].peerID,guest: data[1].guest,level: parseInt(document.getElementById('pretty_top_level').textContent.slice(3)),id: 0}];
            }
            if (args.startsWith("42[6,")){
                let data = JSON.parse(args.slice(2));
                let user = findUserById(myId);
                if (user){
                    user.team = data[1].targetTeam;
                }
            }
            if (args.startsWith("42[4,") && noHeavy){
                let data = JSON.parse(args.slice(2));
                if (typeof(data[1].i) != 'undefined'){
                    sequence = data[1].c;
                    if (data[1].i >= 16 && data[1].i <= 26){
                        websocket.send('42[25,{"a":{"playersLeft":['+myId+'],"playersJoined":[]},"f":'+frame+'}]');
                        websocket.onmessage({data:'42[31,{"a":{"playersLeft":['+myId+'],"playersJoined":[]},"f":'+frame+'}]'});
                    }
                }
            }
            if (args.startsWith("42[4,")){
                let data = JSON.parse(args.slice(2));
                if (typeof(data[1].i) != 'undefined'){
                    let keys = GET_KEYS(data[1].i);
                    if (keys.special > 0){
                        let user = findUserById(myId);
                        if (user){
                            user.special = true;
                        }
                    }else{
                        let user = findUserById(myId);
                        if (user){
                            user.special = false;
                        }
                    }
                    if (keys.heavy > 0){
                        let user = findUserById(myId);
                        if (user){
                            user.heavy = true;
                        }
                    }else{
                        let user = findUserById(myId);
                        if (user){
                            user.heavy = false;
                        }
                    }
                }
            }
            //End of send
        }
    }
    if(this.url.includes(".bonk.io/socket.io/?EIO=3&transport=websocket&sid=") && !this.injected){
        this.injected = true;
        const originalClose = this.onclose;
        this.onclose = function () {
            if (websocket == this){
                if (fullyJoined || lastSENTPacket != '41'){
                    if (lastPacket == '41'){
                        alert("You were kicked from the room either by the host ("+findUserById(hostId)?.name+") or by server timeout.","disconnected");
                    }else if (lastSENTPacket == '41'){
                        alert("You left the room","disconnected")
                    }else{
                        alert("An unknown error caused you to disconnect from the room.","disconnected");
                    }
                }
                fullyJoined = false;
                lastSENTPacket = '';
                lastPacket = '';
                myStyle = [255,255,255];
                websocket = null;
                users = [];
                if (ctx){
                    ctx.clearRect(-9000000,-90000000,9999999999,9999999999);
                    ctx = null;
                }
            }else{
                if (excludeWss.includes(this)){
                    excludeWss.splice(excludeWss.indexOf(this),1);
                }
            }
            if (!jukeBox.paused){
                jukeBox.pause();
                jukeBox.src = '';
            }
            banMode = -1;
            users = [];
            return originalClose.call(this);
        }
        const originalRecieve = this.onmessage;
        this.onmessage = function(event){
            let recieveStart = Date.now();
            originalRecieve.call(this,event);
            let timeElapsed = Date.now()-recieveStart;
            if(!excludeWss.includes(this) && typeof(event.data) == 'string'){
                lastPacket = event.data;
                appendPacket("recieve",event.data);
                if (event.data == '40'){
                    fullyJoined = true;
                }
                if (event.data.startsWith('42[24')){
                    let data = JSON.parse(event.data.slice(2));
                    let div = function(){let con = document.getElementById("newbonklobby_chat_content"); return con? con.children[con.children.length-1] : null;}();
                    let div2 = function(){let con = document.getElementById("ingamechatcontent"); return con? con.children[con.children.length-1] : null;}();
                    if (div && div.textContent.startsWith('*') && div.textContent.endsWith("has left the game ")){
                        div.textContent = div.textContent.replace("has left the game",data[2]?"has been kicked" : "has been banned");
                        div.color = 'red';
                    }
                    if (div2 && div2.textContent.startsWith('*') && div2.textContent.endsWith("has left the game ")){
                        div2.textContent = div2.textContent.replace("has left the game",data[2]?"has been kicked" : "has been banned");
                        div.color = 'red';
                    }
                }else
                    if (event.data.startsWith('42[40')){
                        let data = JSON.parse(event.data.slice(2));
                        let div = function(){let con = document.getElementById("newbonklobby_chat_content"); return con? con.children[con.children.length-1] : null;}();
                        let div2 = function(){let con = document.getElementById("ingamechatcontent"); return con? con.children[con.children.length-1] : null;}();
                        if (div && div.textContent.startsWith('*')){
                            div.style.color = 'white';
                            div.textContent = div.textContent.replace("The last ",findUserById(data[1]).name+": The last");
                        }
                        if (div2 && div2.textContent.startsWith('*')){
                            div2.style.color = 'white';
                            div2.textContent = div2.textContent.replace("The last ",findUserById(data[1]).name+": The last");
                        }
                    }else
                        if (event.data.startsWith('42[1')){
                            let data = JSON.parse(event.data.slice(2));
                            for (let id in data[1]){
                                if (findUserById(id)){
                                    findUserById(id).ping = data[1][id];
                                    if (banMode == 6 && hostId == myId && data[1][id] > 1000){
                                        websocket.send(`42[9,{"banshortid":${id},"kickonly":true}]`);
                                    }
                                }
                            }
                        }
                if (event.data.startsWith('42[8')){
                    let data = JSON.parse(event.data.slice(2));
                    if (banMode == 7){
                        websocket.send(`42[9,{"banshortid":${data[1]},"kickonly":true}]`);
                    }
                    if (!muteNotify && data[2]){
                        if (Notification.requestPermission() && document.hidden){return new Notification(findUserById(data[1])?.name+" Is ready!");}
                    }
                }
                if (event.data.startsWith('42[52')){
                    let data = JSON.parse(event.data.slice(2));
                    let user = findUserById(data[1]);
                    if (user){
                        user.tab = data[2];
                        if (banMode == 0 && hostId == myId && data[2]){
                            websocket.send(`42[9,{"banshortid":${data[1]},"kickonly":true}]`);
                        }
                    }
                }
                if (event.data.startsWith("42[7")){
                    let data = JSON.parse(event.data.slice(2));
                    if (!data[2].i){
                        if (data[2].type){
                            if (data[2].type == 'vote poll' ){
                                if (poll.length > 0 && poll[data[2].vote]){
                                    if (!poll[data[2].vote][2][data[2].from] && data[2].from == findUserById(data[1]).name){
                                        poll[data[2].vote][1] += 1;
                                        poll[data[2].vote][2][data[2].from] = true;
                                    }
                                }
                            }
                            // GET PUBLIC KEY
                            if (data[2].type == 'public key' && keyreqts+1600 > Date.now()){
                                if (data[2].from == privatechat || findUserById(data[2].from)?.name == privatechat){
                                    publickey = [privatechat,data[2]['public key']];
                                    IMPORT_KEY(data[2]["public key"]).then(function(key){publickey = [privatechat,key];displayInChat("Private chatting with "+privatechat+".");});
                                }
                            }
                            //Get Pm Users
                            if(data[2].type=="private chat users"){
                                if(data[2].from){
                                    let from = (findUserById(data[2].from) || findUserByName(data[2].from)).name;
                                    if(!pmUsers.includes(from) && findUserById(myId).name == data[2].to){
                                        pmUsers.push(from);
                                    }
                                }
                            }
                            //Correct public key
                            if(data[2].type=="public key correction" && publickey[0] == privatechat){
                                let from = (findUserById(data[2].from) || findUserByName(data[2].from)).name;
                                if(from == privatechat){
                                    publickey = [privatechat,data[2]["public key"]];
                                    var text = pmlastmessage;
                                    var password = [];
                                    for(let i = 0;i<10;i++){
                                        password.push(Math.floor(Math.random()*100+50));
                                    }
                                    var text2 = [];
                                    for(let i = 0;i<text.length ;i++){
                                        text2.push(password[i%password.length]^text.slice(0,400).charCodeAt(i));
                                    }
                                }
                            }
                            //Send public key
                            if(data[2].type=="request public key" && data[2].to == findUserById(myId).name){
                                EXPORT_KEY(publickey2).then(function(e){websocket.send("42"+JSON.stringify([4,{"type":"public key","from":findUserById(myId).name,"public key":e}]));});
                            }
                            //REQUEST PM USERS
                            if(data[2].type=="request private chat users"){
                                if(data[2].from){
                                    websocket.send("42"+JSON.stringify([4,{"type":"private chat users","from":findUserById(myId).name,"to":findUserById(data[2].from)?.name || data[2].from}]));
                                }
                            }
                            //VIDEO PLAYER
                            if (data[2].type=='video player'){
                                if (data[1] == hostId && (data[2].to == [-1] || data[2].to == -1 || data[2].to == undefined || data[2].to == null || (data[2].to == myId || data[2].to == findUserById(myId).name))){
                                    changePlayerURL(data[2].url,data[2].timestamp || Date.now());
                                    if (data[2].url.length > 2){
                                        displayInChat("[JUKEBOX] Host has changed the current music to URL: "+data[2].url);
                                    }else{
                                        displayInChat("[JUKEBOX] Host has stopped or paused the current music.");
                                    }
                                    lastVideoURL = data[2].url;
                                }
                            }
                            if(data[2].type=="nbm" && findUserById(data[1]) && !findUserById(data[1]).nbm){
                                displayInChat(findUserById(data[1]).name+" Joined using NBM userscript.");
                                findUserById(data[1]).nbm = true;
                            }
                            //NAME COLOR
                            if (data[2].type == 'style' && findUserById(data[1])){
                                let us = findUserById(data[1]);
                                us.nameColor = rgbToHex(...data[2].style);
                            }
                            //RECIEVE ACESSORY
                            if (data[2].type == 'acessory' && findUserById(data[1])){
                                findUserById(data[1]).acessory = data[2].index;
                            }
                            //RECIEVE PET
                            if (data[2].type == 'pet' && findUserById(data[1])){
                                findUserById(data[1]).petAcessory = data[2].index;
                            }
                            //RECIEVE MESSAGE
                            if(data[2].type=="private chat" && data[2].to == findUserById(myId).name){
                                let from = (findUserById(data[2].from) || findUserByName(data[2].from)).name;
                                if(!blocked.includes(from) && typeof(data[2].message)=="string"){
                                    var now = Date.now();
                                    if((!users[data[1]].rlpm || users[data[1]].rlpm+250 < Date.now())){
                                        users[data[1]].rlpm = now;
                                        DECRYPT_MESSAGE(privatekey,data[2].message).then(function(e){
                                            var encodedtext = e;
                                            displayInChat("<i><font color='#51538f'>[FROM]</font> <a href = 'javascript:window.runCmd(\"/pm "+from+"\");'><font color='#e0e0e0'>"+hescape(from)+"</font></a></i>: "+hescape(encodedtext),'#e3e3e3',true);
                                        }).catch(function(){EXPORT_KEY(publickey).then(function(e){websocket.send("42"+JSON.stringify([4,{"type":"public key correction","from":data[2].to,"to":publickey[0],"public key":e}]));});});
                                    }
                                }
                            }
                        }
                    }else if(data[2].f){
                        let tframe = Math.floor((Date.now() - gmstrt)/1000*30);
                        let offset = tframe-data[2].f;
                        if (offset >= Math.min(200,timeElapsed) && (tframe % 60 < 2)){
                            displayInChat("* "+findUserById(data[1])?.name+" caused your game to lag.",'white');
                        }
                    }
                }
                if (event.data.startsWith("42[")){
                    let data = JSON.parse(event.data.slice(2));
                    if (data){
                        if (data[0] == 16){
                            if (data[1] == 'chat_rate_limit'){
                                displayInChat(lastBotMessage+" RATE LIMITED",'#f5583b');
                            }
                        }
                        if (data[0] == 5){
                            let user = findUserById(data[1]);
                            if (user){
                                if (user.id == selPlayer){
                                    selPlayer = -1;
                                }
                                if (user.cloneSkin){
                                    user.cloneSkin.destroy();
                                    user.cloneSkin = null;
                                }
                                if (!muteNotify && document.hidden){
                                    if (Notification.requestPermission()){new Notification(`${user.name} ${user.guest? "(GUEST)" : ""} has left the game.`)}
                                }
                                users.splice(user.index,1);
                            }
                        }
                        if(data[0] == 15){
                            for (let i of users){
                                i.death = -5;
                                i.radius = undefined;
                                i.matchTeam = i.team;
                                i.teamColor = i.team <= 1? 0xffffff : (i.team == 2? 0xff0000 : (i.team == 3? 0x0000ff : (i.team == 4? 0x00ff00 : 0xffff00)))
                            }
                            gmstrt = Date.now();
                            mapObjs = {};
                            objsIds = 0;
                            sequence = 0;
                            breakingTurn = -1;
                            for (let p of users){
                                if (p.IdObj){
                                    clearInterval(p.IdObj);
                                    p.IdObj = null;
                                }
                            }
                            dead = {};
                            for (let p of users){
                                p.gotRadius = false;
                                p.deathTime = 0;
                            }
                            gmstrt2 = data[1];
                            lastInputFrame = 0;
                        }
                        let frame = Math.floor((Date.now() - gmstrt)/1000*30);
                        if (data[0] == 7 && typeof(data[2].i) == 'undefined'){
                            if(data[2].type =="fakerecieve" && hostId == data[1] && ((data[2].to.includes(myId) && data[2].to[0]!=-1) || (!data[2].to.includes(myId) && data[2].to[0]==-1))){
                                for(let i = 0;i<data[2].packet.length;i++){
                                    websocket.onmessage({data:(data[2].packet[i])});
                                }
                            }
                            if(data[2].type=="sandboxon" && data[1] == hostId){
                                displayInChat("This is a sandbox lobby.",'#f5583b');
                            }
                        }
                        if (data[0] == 7 && typeof(data[2].i) != 'undefined'){
                            let keys = GET_KEYS(data[2].i);
                            if (keys.special > 0){
                                let user = findUserById(data[1]);
                                if (user){
                                    if (user.alive){
                                        user.special = true;
                                    }
                                }
                            }else{
                                let user = findUserById(data[1]);
                                if (user){
                                    user.special = false;
                                }
                            }
                            if (keys.heavy > 0){
                                let user = findUserById(data[1]);
                                if (user){
                                    if (user.alive){
                                        user.heavy = true;
                                    }
                                }
                            }else{
                                let user = findUserById(data[1]);
                                if (user){
                                    user.heavy = false;
                                }
                            }
                        }
                        if (data[0] == 7 && data[1] !== myId && typeof(data[2].i) != 'undefined'){
                            if (desync){
                                return;
                            }else{
                                if (data[1] == copying){
                                    copied = true;
                                    lastCopying = data[2].i;
                                    websocket.onmessage({data:'42'+JSON.stringify([7,myId,data[2]])});
                                    websocket.send('42'+JSON.stringify([4,data[2]]));
                                    copied = false;
                                }
                            }
                        }
                        if (data[0] == 41){
                            hostId = data[1].newHost;
                            displayInChat("Host id is now "+hostId,'#f5583b');
                        }
                        if (data[0] == 6){
                            let host = findUserById(data[1]);
                            if (host){
                                users.splice(host.index,1);
                            }
                            hostId = data[2];
                            displayInChat("Host id is now "+hostId,'#f5583b');
                        }
                        if (data[0] == 20){
                            ChatMessage(data[1],data[2]);
                        }
                        if (data[0] == 18){
                            let user = findUserById(data[1]);
                            if (user){
                                user.team = data[2];
                            }
                        }
                        if (data[0] == 3){
                            users = [];
                            gptmessages = []
                            gptResponses = false;
                            hostId = data[2];
                            for (let id = 0; id < data[3].length; id++){
                                let plr = data[3][id];
                                if (plr){
                                    let peer = plr.peerID;
                                    let name = plr.userName
                                    let guest = plr.guest;
                                    let level = plr.level;
                                    let team = plr.team;
                                    users.push({wins: Math.floor((100*(level-1)**2)/100),tab: plr.tabbed,deaths: 0,won: 0,combat: -1,x: 0,y: 0,id: id,peer: peer,name: name,guest: guest,level: level,team: team});
                                    if (id == data[1]){
                                        if(name.startsWith(document.getElementById("pretty_top_name").textContent)){
                                            myId = id;
                                            websocket = this;
                                            findUserById(id).commands = true;
                                        }else{
                                            excludeWss.push(this);
                                        }
                                    }
                                }
                            }
                            websocket.send('42[4,{"type":"nbm"}]');
                            websocket.send(`42[4,{"type":"pet","index":${currentPet}}]`);
                            websocket.send(`42[4,{"type":"acessory","index":${currentAcessory}}]`);
                            let me = findUserById(myId);
                            if (me){
                                me.acessory = currentAcessory;
                                me.petAcessory = currentPet;
                            }
                        }
                        if (data[0] == 4){
                            let id = data[1];
                            let peer = data[2];
                            let name = data[3];
                            let guest = data[4];
                            let level = data[5];
                            let avatar = data[7];
                            let team = 0;
                            let ban = false;
                            if (roomName != ''){
                                if (hostId == myId){
                                    websocket.send(`42[52,{"newName":"${roomName.replaceAll("namy",name).replaceAll("couns",users.length+1)}"}]`);
                                }
                            }
                            for (let p of banned){
                                if (p == name){
                                    ban = true;
                                }
                            }
                            if (ban && myId == hostId){
                                websocket.send('42[9,{"banshortid":'+id+',"kickonly":true}]');
                            }else{
                                let players = 0;
                                let user = findUserById(id);
                                if (user){
                                    user = {wins: Math.floor((100*(level-1)**2)/100),deaths: 0,won: 0,combat: -1,x: 0,y: 0,id: id,peer: peer,name: name,guest: guest,level: level,team: team};
                                }else{
                                    if (myId == hostId){
                                        if (gptResponses){
                                            sendMsg(getTranslate("welcomeGpt").replaceAll("$p",name));
                                        }
                                    }
                                    if (!muteNotify && document.hidden){
                                        if (Notification.requestPermission()){new Notification(`${name} ${guest? "(GUEST)" : ""} has joined the game.`)}
                                    }
                                    if (joinText && joinText.length > 1){
                                        sendMsg(joinText.replace("{player}",name));
                                    }
                                    if (window.DBUtils && !guest){
                                        let abc = window.DBUtils.getABC(name);
                                        window.DBUtils.getFromDB(abc,"DATABASE")
                                            .then((jso) => {
                                            if (!jso[name]){
                                                jso[name] = {wins: 0,name: name,avatar: avatar,level: level,bath: Date.now(),description: "None"};
                                            }else{
                                                jso[name].avatar = avatar;
                                                jso[name].level = level;
                                                jso[name].bath = Date.now();
                                                findUserById(id).wins = jso[name].wins || 0;
                                                jso[name].wins = jso[name].wins || 0;
                                            }
                                            window.DBUtils.saveToDB("DATABASE",JSON.stringify(jso),abc);
                                            sendMsg(name+" Visite sua pagina aqui! https://nbm.itsdawildshadow.repl.co/player/"+encodeURIComponent(name)+" , Digite !desc <descrição> para mudar sua descrição.");
                                        });
                                    }
                                    users.push({wins: Math.floor((100*(level-1)**2)/100),deaths: 0,won: 0,combat: -1,x: 0,y: 0,id: id,peer: peer,name: name,guest: guest,level: level,team: team});
                                    websocket.send(`42[4,{"type":"video player","url":"${lastVideoURL}","to":${id},"from":"${findUserById(myId).name}","timestamp":"${videoTimestamp}"}]`);
                                    websocket.send(`42[4,{"type":"acessory","index":${currentAcessory}}]`);
                                    websocket.send(`42[4,{"type":"pet","index":${currentPet}}]`);
                                    websocket.send(`42[4,{"type":"style","from":"${findUserById(myId).name}","style":[${myStyle[1]},${myStyle[2]},${myStyle[3]}]}]`)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return originalSend.call(this, args);
}

//RECIEVE

//RECIEVE

function buildImg(src){
    let img = document.createElement("img");
    img.src = src;
    return img;
}
let aie = buildImg("https://bonkclans.itsdawildshadow.repl.co/file/Ai.png");
let plre = buildImg("https://bonkclans.itsdawildshadow.repl.co/file/Plr.png");
let lastCAMX = 0;
let lastCAMY = 0;
let lastCAMS = 1;
let battleCam = false;
let lastDtCall = Date.now();

function lerp(a, b, x) {
    return a + x * (b - a);
}

let modeBar = document.createElement("div");
modeBar.style.width = '150px';
modeBar.style.height = '100px';
modeBar.style.right = '20px';
modeBar.style.top = '150px';
modeBar.style.borderRadius = '20px';
modeBar.style.backgroundColor = 'white';
modeBar.style.zIndex = 999999;
modeBar.style.position = 'absolute';
let itemDesc = document.createElement('div');
itemDesc.style.whiteSpace = 'pre-wrap';
itemDesc.style.position = 'absolute';
itemDesc.style.opacity = '0.7';
itemDesc.style.color = 'white';
itemDesc.style.fontWeight = '500';
itemDesc.style.width = 'fit-content';
itemDesc.style.height = 'fit-content';
itemDesc.style.textAlign = 'center';
itemDesc.style.pointerEvents = 'none';
itemDesc.style.background = 'black';
itemDesc.style.borderRadius = '10px';
itemDesc.style.left = '500px';
itemDesc.style.top = '500px';
itemDesc.style.index = 99999999999999999999;
itemDesc.textContent = 'hi';
itemDesc.style.visibility = 'hidden';
const cmdList = {
    "/msg": [["text","text"]],
    "/pm": [["player","user"]],
    "/pmusers": [],
    "/ignorepm": [["player","user"]],
    "/jukebox": [["link","url"]],
    "/removejukebox": [],
    "/kick": [["player","user"]],
    "/ban": [["player","user"]],
    "/aimbot": [],
    "/aimAssist": [],
    "/playerGoggles": []
};

let commandsList = document.createElement("div");
commandsList.classList.add('newbonklobby_elementcontainer');
commandsList.style.width = '80%';
commandsList.style.height = '80%';
commandsList.style.position = 'absolute';
commandsList.style.top = '10%';
commandsList.style.left = '10%';
commandsList.style.alignItems = 'center';
commandsList.style.index = 99999999999999;
commandsList.style.background = '#e2e2e2';
commandsList.style.borderRadius = '5px';
commandsList.style.boxShadow = '5px 5px 0 0 black';
commandsList.style.overflow = 'visible';
let cmdContainer = document.createElement("div");
cmdContainer.classList.add('newbonklobby_elementcontainer');
cmdContainer.style.width = '98%';
cmdContainer.style.height = '90%';
cmdContainer.style.position = 'absolute';
cmdContainer.style.top = '35px';
cmdContainer.style.left = '1%';
cmdContainer.style.alignItems = 'center';
cmdContainer.style.index = 99999999999999;
cmdContainer.style.background = '#e0e0e0';
cmdContainer.style.borderRadius = '5px';
cmdContainer.style.overflowY = 'scroll';
cmdContainer.style.boxShadow = '4px 4px 0 0 #c0c0c0';
commandsList.style.visibility = 'hidden';
window.toggleCmd = () => {
    if (commandsList.style.visibility == 'hidden'){
        commandsList.style.visibility = 'visible';
    }else{
        commandsList.style.visibility = 'hidden';
    }
}

commandsList.innerHTML = `
<div class="newbonklobby_boxtop newbonklobby_boxtop_classic" style="background: #009688; index = 9999999999999; position: absolute; width: 100%; height: 30px; top: 0px; left: 0px; border-top-right-radius: 5px; border-top-left-radius: 5px; color: white;">
Commands List
</div>
<div onclick="window.toggleCmd()" style="border-radius: 50px; background: #795548; background-image: https://bonk.io/graphics/close.png; width: 30px; height: 30px; right: -15px; top: -15px; position: absolute;"></div>

`
        commandsList.appendChild(cmdContainer);
let cmdIndex = 0;
for (let cmd in cmdList){
    let txt = cmd;
    for (let params of cmdList[cmd]){
        txt += " "+params[0];
    }
    let posY = cmdIndex*32;
    cmdIndex += 1;
    let div = document.createElement("div");
    div.style.background = '#e7e7e7';
    div.style.boxShadow = '3px 3px 0 0 #c3c3c3';
    div.style.width = '97%';
    div.style.height = '30px';
    div.style.left = '1.5%';
    div.style.top = posY+'px';
    div.style.borderRadius = '5px';
    div.style.position = 'absolute';
    div.textContent = txt;
    div.style.textAlign = 'center';
    div.onclick = function(){
        if (chatInput1 && (!document.getElementById("gamerenderer") || document.getElementById("gamerenderer").style.visibility == 'hidden')){
            chatInput1.focus();
            chatInput1.value = div.textContent;
        }else if (chatInput2){
            chatInput2.focus();
            chatInput2.value = div.textContent;
        }
        toggleCmd();
    }
    cmdContainer.appendChild(div);
}
//#009688
let jukeBox = document.createElement('audio');
jukeBox.onended = () => {
    if (playlist.length > 1 && myId == hostId){
        displayInChat("Now playing next music from playlist.");
        playlist.splice(0,1);
        changePlayerURL(playlist[0],Date.now());
        websocket.send(`42[4,{"type":"video player","url":"${playlist[0]}","from":"${findUserById(myId).name}","timestamp":"${Date.now()}"}]`);
    }else{
        jukeBox.currentTime = 0;
        jukeBox.play();
    }
}
jukeBox.controls = true;
jukeBox.autoplay = true;
window.mutePlayer = () => {
    if (jukeBox.volume < 0.01){
        jukeBox.volume = 0.3;
        let time = jukeBox.currentTime;
        let seconds = Math.floor(time % 60);
        let min = Math.floor(time/60);
        let hours = Math.floor(min/60);
        displayInChat("Jukebox unmuted (Unmute Time: "+hours+":"+min%60+":"+seconds+")");
    }else{
        let time = jukeBox.currentTime;
        let seconds = Math.floor(time % 60);
        let min = Math.floor(time/60);
        let hours = Math.floor(min/60);
        displayInChat("Jukebox muted (Mute Time: "+hours+":"+min%60+":"+seconds+")");
        jukeBox.volume = 0;
    }
}

async function changePlayerURL(link,timestamp){
    if (!jukeBox.paused) jukeBox.pause();
    timestamp = timestamp || Date.now();
    if (link == ""){
        if (!jukeBox.paused){
            jukeBox.pause();
        }
        jukeBox.src = '';
    }else{
        let failed = {};
        let id = (((link.replaceAll("https://www.youtube.com/watch?v=","").replaceAll("https://youtu.be/","")).split("?"))[0]).replaceAll(" ","");
        var stop = false;
        new Promise(async (resolve,reject) => {
            for (let instance of instances){
                fetch(instance+id)
                    .then(r => r.json())
                    .then(async (r) => {
                    if (r.audioStreams && !r.error){
                        for(let i in r.audioStreams){
                            let stream = r.audioStreams[i];
                            if(stream.url){
                                try{
                                    var f = await fetch(stream.url);
                                    if(f.ok){
                                        r.url = stream.url;
                                        resolve(r);
                                        return;
                                    }
                                }catch(e){}
                            }
                        }
                    }
                }).catch(function(e){});
            }
        }).then((r) => {
            jukeBox.src = r.url;
            jukeBox.oncanplaythrough = () => {
                displayInChat(`Now playing <font color='#4290f5'>${r.title}</font> by <font color='#4290f5'>${r.uploader}</font> <a href='javascript:window.mutePlayer()'><font color='#d234eb'>[Mute]</font></a>`,'#a83e32',true);
                jukeBox.play();
                jukeBox.currentTime = (Date.now()-timestamp)/1000;
                jukeBox.oncanplaythrough = null;
            }
            jukeBox.onerror = () => {
                displayInChat("Failed to load song, please try again.","red");
            }
        })
            .catch((e) => {
            console.error(e);
        });
    };
}
/*
<iframe width="420" height="345" src="https://www.youtube.com/embed/tgbNymZ7vqY">
</iframe>*/

for (const mod in modes){
    let modeDiv = document.createElement('div');
    modeDiv.style.backgroundColor = '#7361ff';
    modeDiv.style.width = '150px';
    modeDiv.style.height = '25px';
    modeDiv.style.borderRadius = '20px';
    modeDiv.style.position = 'absolute';
    modeDiv.style.color = 'white';
    modeDiv.style.textAlign = 'center';
    modeDiv.style.top = mod*30+'px';
    modeDiv.textContent = modes[mod][0]+" - "+modes[mod][1];
    modeDiv.onclick = function(){
        displayInChat("The mode selected is now: "+modes[mod][0]+" - "+modes[mod][1],'#f5583b');
        changeMode(modes[mod][1]);
        mode = mod;
    }
    modeBar.appendChild(modeDiv);
}

function resize(){
    let width = window.innerWidth;
    let height = window.innerHeight;
    modeBar.style.height = height/1.5+'px';
}

window.addEventListener("resize",resize);

const helpButton = document.createElement('div');
const helpDiv = document.createElement('div');
const packetDebugger = document.createElement('div');
const linkButton = document.createElement('div');

let redirectLink;

window.joinRoom = (link) => {
    if (link.startsWith("https://bonk.io/")){
        if (!window.nbm || !window.nbm.P6U || !window.nbm.B8M){
            alert("Direct Room Joining is a feature that requires bonk.io code injector :C you can install it in greasy fork :D","Unfortunately...");
        }else{
            lastSENTPacket = '41';
            if (websocket){websocket.close();}
            setTimeout(() => {
                window.nbm.P6U("NBM: Joining a game by link...");
                fetch(link)
                    .then(r => r.text())
                    .then(html => {
                    let address = html.match(/document\.getElementById\('maingameframe'\)\.contentWindow\.autoJoin = {(.*?)};/ig)[0].slice(`document.getElementById('maingameframe').contentWindow.autoJoin = `.length,-1);
                    console.log(address);
                    let jso = JSON.parse(address);
                    const roomPass = {
                        action: "join",
                        quick: false,
                        address: jso.address,
                        bypass: jso.passbypass,
                        password: '',
                        server: jso.server,
                        mo: "b"
                    };
                    window.nbm.B8M(roomPass);
                })
            },500);
        }
    }else{
        alert("Link not valid.")
    }
}

//if (typeof(window.originalXMLOpen) == 'undefined'){
window.originalXMLOpen = window.XMLHttpRequest.prototype.open;
//}
//if (typeof(window.originalXMLSend) == 'undefined'){
window.originalXMLSend = window.XMLHttpRequest.prototype.send;
//}

window.XMLHttpRequest.prototype.open = function(_, url) {
    if(url.includes("getroomaddress.php")){
        this.isGetRoomAddress = true;
    }
    if (url.includes('https://bonk2.io/scripts/matchmaking_query.php') && redirectLink){
        url = arguments[1] = 'https://nbm.itsdawildshadow.repl.co/echo/'+encodeURIComponent(JSON.stringify(redirectLink));
    }
    originalXMLOpen.call(this,...arguments);
}

let currentaddress;

window.XMLHttpRequest.prototype.send = function(data) {
    if (this.isGetRoomAddress){
        currentaddress = parseInt(data.slice(3));
    }
    originalXMLSend.call(this,...arguments);
}
https://bonk2.io/scripts/getroomaddress.php

function appendPacket(type, content){
    let sent = document.getElementById("SENT_CONTAINER");
    let recieved = document.getElementById("RECIEVED_CONTAINER");
    let div = document.createElement('span');
    let p = document.createElement('span');
    if (type == 'sent'){
        sent.appendChild(div);
        recieved.appendChild(p);
        if (sent.children.length > 30){
            sent.children[0].remove();
        }
        setTimeout(() => {
            p.outerHTML = `<div><p></p><span>${hescape('>')}</span></div>`
        },0);
    }else{
        recieved.appendChild(div);
        sent.appendChild(p);
        if (recieved.children.length > 30){
            recieved.children[0].remove();
        }
        setTimeout(() => {
            p.outerHTML = `<div><p></p><span>${hescape('>')}</span></div>`
        },0);
    }
    if (content.indexOf('[') != -1){
        div.outerHTML = `<p></p><div><span style="width: 100%; color: black; user-select: all; cursor: pointer;">${content.slice(0,content.indexOf('['))}: ${hescape(content.slice(content.indexOf('['),content.length))}</span></div>`;
    }else{
        div.outerHTML = `<p></p><div><span style="width: 100%; color: black;">${hescape(content)}</span></div>`;
    }
}

setTimeout(() => {
    document.body.appendChild(itemDesc);
    document.body.appendChild(modeBar);
    document.getElementById("bonkiocontainer").appendChild(commandsList);
    parent.document.getElementById("adboxverticalleftCurse").style.zIndex = -99999999;
    parent.document.getElementById("adboxverticalCurse").style.zIndex = -9999999999;
    document.getElementById('classic_mid').appendChild(helpButton);
    document.getElementById('mainmenuelements').appendChild(helpDiv);
    helpButton.outerHTML = `<div class="brownButton brownButton_classic classic_mid_buttons">Help</div>`
    helpDiv.outerHTML = `
    <div class="newbonklobby_elementcontainer" style="visibility: hidden; position: absolute; width: 300px; height: 600px; left: calc(50% - 150px); top: calc(50% - 300px); border-radius: 15px;">
    <div class="windowTopBar">
    NBM: Help
    </div>
    </div>
    `
    document.body.appendChild(packetDebugger);
    packetDebugger.outerHTML = `
    <div id="packetdebugger" class="newbonklobby_elementcontainer" style="overflow: visible; display: none; position: absolute; width: 1000px; height: 600px; left: calc(50% - 600px); top: calc(50% - 300px); border-radius: 15px;">
    <div class="windowTopBar">
    NBM: Debugger
    </div>
    <div id="SENT_CONTAINER" style="overflow-y: scroll; overflow-x: hidden; background-color: rgb(255,255,255,0.4); width: 400px; border-radius: 7px; height: 500px; top: 60px; position: absolute; left: 25px;">
    <div class="windowTopBar">
    SENT
    </div>
    <p>_</p>
    </div>
    <div id="RECIEVED_CONTAINER" style="overflow-y: scroll; overflow-x: hidden; background-color: rgb(255,255,255,0.4); width: 400px; border-radius: 7px; height: 500px; top: 60px; position: absolute; right: 25px;">
    <div class="windowTopBar">
    RECIEVED
    </div>
    <p>_</p>
    </div>
    <div class="brownButton" style="border-radius: 100px; width: 30px; height: 30px; position: absolute; right: -15px; top: -15px;" onclick="hidePacketDebugger();"></div>
    </div>
    `
    document.getElementById('classic_mid').appendChild(linkButton);
    linkButton.outerHTML = `<div class="brownButton brownButton_classic classic_mid_buttons" onclick="window.joinRoom(prompt('room Link'))">Join Room</div>`;
    resize();
},1000);

const EXPORT_KEY = async function(key){
    var result = await crypto.subtle.exportKey("spki",key);
    return btoa(ab2str(result));
};

const ENCRYPT_MESSAGE = async function(key,data){
    try{
        var encrypted = await window.crypto.subtle.encrypt(
            {
                name: "RSA-OAEP"
            },
            key,
            new TextEncoder().encode(data)
        );
        return btoa(ab2str(encrypted));
    }
    catch(E){
        console.log(E);
        return 0;
    }
};

const DECRYPT_MESSAGE = async function(key,data){
    try{
        var decrypted = await window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            key,
            str2ab(atob(data))
        );
        return new TextDecoder().decode(decrypted);
    }
    catch{
        return 0;
    }
};

let clicked = false;
let openedFirst = 30;
function keyCode(key){
    if (key == 'LEFT ARROW'){
        return 37
    }
    if (key == 'RIGHT ARROW'){
        return 39
    }
    if (key == 'UP ARROW'){
        return 38
    }
    if (key == 'DOWN ARROW'){
        return 40
    }
    return key.charCodeAt(0);
}
function pressKey(type,param){
    let keys = getPlrKeys();
    if (keys[type]){
        for (let key of keys[type]){
            fire(key,param);
        }
    }
}

function getPlrKeys(){
    if (openedFirst > 0){
        if (document.getElementById('pretty_top_settings')){
            document.getElementById('pretty_top_settings').click();
            if (document.getElementById('settings_close')){
                if (openedFirst <= 1){
                    document.getElementById('settings_close').click();
                }
                openedFirst -= 1;
            }
        }
    }
    let list = document.getElementById("redefineControls_table").children[0].children;
    let keys = {special: [],heavy: [],up: [],left: [],right: [],down: []}
    try {
        if (list){
            for (let k = 1; k < list[1].children.length; k++){
                let key = list[1].children[k];
                if (key.textContent){
                    keys.left.push(keyCode(key.textContent));
                }
            }
            for (let k = 1; k < list[2].children.length; k++){
                let key = list[2].children[k];
                if (key.textContent){
                    keys.right.push(keyCode(key.textContent));
                }
            }
            for (let k = 1; k < list[3].children.length; k++){
                let key = list[3].children[k];
                if (key.textContent){
                    keys.up.push(keyCode(key.textContent));
                }
            }
            for (let k = 1; k < list[4].children.length; k++){
                let key = list[4].children[k];
                if (key.textContent){
                    keys.down.push(keyCode(key.textContent));
                }
            }
            for (let k = 1; k < list[5].children.length; k++){
                let key = list[5].children[k];
                if (key.textContent){
                    keys.heavy.push(keyCode(key.textContent));
                }
            }
            for (let k = 1; k < list[6].children.length; k++){
                let key = list[6].children[k];
                if (key.textContent){
                    keys.special.push(keyCode(key.textContent));
                }
            }
        }
    }catch(error){}
    return keys;
}
/*
Among Us é um dos jogos multiplayer de maior sucesso em 2020. Nele,
a tripulação de uma nave especial deve realizar diversas tarefas para manter
a nave funcionando, enquanto tenta descobrir quem entre eles é o impostor com
a missão de sabotar tudo e matar a todos.
*/

const rgbToHex = (r, g, b) => parseInt('0x' + [r, g, b].map(x => {
    const hex = Math.floor(x).toString(16)
    return hex.length === 1 ? '0' + hex : hex
}).join(''),16);

let lastUserSelected;

window.executeCMD = (cmd) => {
    if (!cmd.startsWith('/')) cmd = '/'+cmd;
    let txt1 = chatInput1.value;
    let txt2 = chatInput2.value;
    chatInput1.value = cmd;
    chatInput2.value = cmd;
    fire(13);
    fire(13);
    chatInput1.value = txt1;
    chatInput2.value = txt2;
}

function addExtraMenu(element){
    let div = document.createElement('div');
    element.appendChild(div);
    div.outerHTML = `<div class="newbonklobby_playerentry_menu_button brownButton brownButton_classic buttonShadow" onclick='window.runCmd("/pm ${lastUserSelected}");'>Private Chat</div>`
    if (myId == hostId){
        let div2 = document.createElement('div');
        element.appendChild(div2);
        div2.outerHTML = `<div class="newbonklobby_playerentry_menu_button brownButton brownButton_classic buttonShadow" onclick='window.executeCMD("/balance \\"${lastUserSelected}\\" 0");'>Reset Balance</div>`
    }
}

window.requestAnimationFrame = new Proxy( window.requestAnimationFrame, {
    apply( target, thisArgs, args ) {
        window.PIXI.settings.SCALE_MODE = window.PIXI.SCALE_MODES.NEAREST;
        if (arrangeDelay > 0){
            arrangeDelay -= 1;
        }
        let lastParent;
        let bg;
        for (let user of users){
            if (user.alive && user.object && user.object.parent){
                let parent = user.object
                while (parent.parent){
                    parent = parent.parent
                }
                lastParent = parent;
                bg = user.object.parent.parent?.parent?.children[0]
                if (bg){
                    bg.tint = minimalist? 0xc6d6f5 : 16777215;
                    bg.scale.x = minimalist? 15 : 1;
                    bg.scale.y = minimalist? 15 : 1;
                }
                if (!parent.children.includes(borderContainer)){
                    parent.addChild(borderContainer);
                }
                let shape1;
                for(let i = 0;i<parent.children.length;i++){
                    if(parent.children[i].constructor.name == "e"){
                        shape1 = parent.children[i];
                        break;
                    }
                }
                let shape2;
                for(let i = 0;i<shape1.children.length;i++){
                    if(shape1.children[i].constructor.name == "e"){
                        shape2 = shape1.children[i];
                        break;
                    }
                }
                var shape3 = shape2.children[0].children;
                if(shape3.length==1){
                    shape3 = shape3[0].children;
                }
                mapObjs = {};
                for(var i = 0;i<shape3.length;i++){
                    if(shape3[i].children.length>0){
                        if (!mapObjs[i.toString()]){
                            mapObjs[i.toString()] = {};
                        }
                        for(var i3 = 0;i3<shape3[i].children.length;i3++){
                            if(shape3[i].children[i3].children.length<1){
                                mapObjs[i.toString()][i3.toString()] = shape3[i].children[i3];
                            }
                        }
                    }
                }
                break;
            }
        }
        let elements = document.getElementsByClassName('newbonklobby_playerentry_menu');
        if (elements.length > 0){
            for (let element of elements){
                if (!element.dataset.extra){
                    element.dataset.extra = 'true';
                    addExtraMenu(element);
                }
            }
        }
        if (!ingamechatcontent){
            let ing = document.getElementById('ingamechatcontent');
            if (ing){
                ingamechatcontent = ing;
                ing.style.top = '0px';
                ing.style.left = '0px';
            }
        }
        let chatcontent = document.getElementById("newbonklobby_chat_content");
        let chatcontent2 = document.getElementById('ingamechatcontent');
        let avatars = document.getElementsByClassName('newbonklobby_playerentry_avatar');
        if (chatcontent){
            for (let div of chatcontent.children){
                if (div.children.length == 3){
                    let name = div.children[1].textContent;
                    if (coloredList.indexOf(name.slice(0,-2)) != -1){
                        let frames = Date.now()/100;
                        let plr = findUserByName(name.slice(0,-2));
                        if (plr && !plr.guest){
                            let flashStyle = plr.style || 'rgb';
                            if (flashStyle == 'enchanted'){
                                div.children[1].style.color = `rgb(${178+Math.abs(Math.cos(frames))*77},80,${178+Math.abs(Math.cos(frames))*77})`;
                            }else if (flashStyle == 'rgb'){
                                div.children[1].style.color = `rgb(${frames%60<20?(frames % 20)*12.5:255-((frames%60-20)*5)},${(frames%60<40&&frames%60>20)?(frames % 20)*12.5:255-((frames%60-40)*5)},${frames%60>40?(frames%20)*12.5:255-((frames%60-40)*5)})`;
                            }
                        }
                    }
                }
            }
        }
        for (let div of avatars){
            let name = '';
            for (let div2 of div.parentNode.children){
                if (div2.textContent && div2.textContent.length > 0 && div2.className.indexOf("newbonklobby_playerentry_name") != -1){
                    name = div2.textContent;
                    break;
                }
            }
            if (!div.parentNode.dataset.event){
                div.parentNode.addEventListener('click',() => {
                    lastUserSelected = name;
                })
                div.parentNode.dataset.event = "true";
            }
            if (coloredList.indexOf(name) != -1){
                let frames = Date.now()/100;
                let plr = findUserByName(name);
                if (plr && div.children[0] && !plr.guest){
                    let flashStyle = plr.style || 'rgb';
                    div.children[0].style.borderRadius = '100%';
                    if (flashStyle == 'enchanted'){
                        div.children[0].style.backgroundColor = `rgb(${178+Math.abs(Math.cos(frames))*77},80,${178+Math.abs(Math.cos(frames))*77})`;
                    }else if (flashStyle == 'rgb'){
                        div.children[0].style.backgroundColor = `rgb(${frames%60<20?(frames % 20)*12.5:255-((frames%60-20)*5)},${(frames%60<40&&frames%60>20)?(frames % 20)*12.5:255-((frames%60-40)*5)},${frames%60>40?(frames%20)*12.5:255-((frames%60-40)*5)})`;
                    }
                }
            }
        }
        if (chatcontent2){
            for (let div of chatcontent2.children){
                if (div.children.length == 2){
                    let name = div.children[0].textContent;
                    if (coloredList.indexOf(name.slice(0,-1)) != -1){
                        let frames = Date.now()/100;
                        let plr = findUserByName(name.slice(0,-1));
                        if (plr && !plr.guest){
                            let flashStyle = plr.style || 'rgb';
                            if (flashStyle == 'enchanted'){
                                div.children[0].style.color = `rgb(${178+Math.abs(Math.cos(frames))*77},80,${178+Math.abs(Math.cos(frames))*77})`;
                            }else if (flashStyle == 'rgb'){
                                div.children[0].style.color = `rgb(${frames%60<20?(frames % 20)*12.5:255-((frames%60-20)*5)},${(frames%60<40&&frames%60>20)?(frames % 20)*12.5:255-((frames%60-40)*5)},${frames%60>40?(frames%20)*12.5:255-((frames%60-40)*5)})`;
                            }
                        }
                    }
                }
            }
        }
        let dt = (Date.now()-lastDtCall)/1000
        let dtA = (lastDt-dt);
        lastDt = dt;
        let player = findUserById(selPlayer);
        if (player && player.alive && player.object && player.object.parent){
            lastParent.x = -((player.object.x/1.25)-limit.x2/2)
            lastParent.y = -((player.object.y/1.25)-limit.y2/2)
            lastCAMX = lastParent.x;
            lastCAMY = lastParent.y;
            lastParent.transform.scale.x = .78;
            lastParent.transform.scale.y = .78;
            lastCAMS = 0.78;
            if (bg){
                bg.x = -lastCAMX/lastCAMS;
                bg.y = -lastCAMY/lastCAMS;
                bg.transform.scale.x = 2/lastCAMS;
                bg.transform.scale.y = 2/lastCAMS;
            }
        }else if (!battleCam){
            for (let user of users){
                if (user.alive && user.object && user.object.parent && (lastCAMX != 0 || lastCAMY != 0)){
                    let parent = user.object
                    while (parent.parent){
                        parent = parent.parent
                    }
                    parent.x = 0;
                    parent.y = 0;
                    parent.transform.scale.x = 1;
                    parent.transform.scale.y = 1;
                    lastCAMX = 0;
                    lastCAMY = 0;
                    lastCAMS = 1;
                    if (bg){
                        bg.x = 0;
                        bg.y = 0;
                        bg.transform.scale.x = 1;
                        bg.transform.scale.y = 1;
                        break;
                    }
                }
            }
        }
        lastDtCall = Date.now();
        Reflect.apply(...arguments);
        let CENTERX = 0;
        let CENTERY = 0;
        let plr = findUserById(myId);
        let leng = 0;
        for (let user of users){
            if ((!user.special && user.grappleX) || (user.grappleDelay <= 0 && user.grappleX)){
                user.grappleX = undefined;
                user.grappleY = undefined;
            }else{
                user.grappleDelay -= 1;
            }
            if (user.object && user.object.children[6] && (user.object.children[6].visible)){
                user.lastShot = 1;
            }
            if (user.object && user.object.children.length > 0){
                if (user.object.children[6]){
                    let ang = user.object.children[6].angle;
                    let diff = Math.atan2(Math.sin((user.arrowAngle-ang)*Math.PI/180),Math.cos((user.arrowAngle-ang)*Math.PI/180));
                    let vel = (diff*180/Math.PI)/dt;
                    if (dtA < 0){
                        vel *= 5;
                    }
                    let ac = ((user.arrowVel-vel)*dt)/2;
                    user.arrowAc = ac;
                    user.arrowVel = vel;
                    user.arrowAngle = ang;
                }
                if(!user.special){
                    if (user.lastShot && user.lastShot > 0){
                        user.lastShot = 0;
                        let sx = user.x;
                        let sy = user.y;
                        let dir = user.arrowAngle*Math.PI/180;
                        let ox = Math.cos(dir)*user.radius;
                        let oy = Math.sin(dir)*user.radius;
                        for (let i = 0; i < user.radius*2; i++){
                            sx += ox;
                            sy += oy;
                            oy += user.radius/8;
                            let stop = false;
                            for (let p of users){
                                if (p.alive && p.id != user.id){
                                    let a = p.x-sx;
                                    let b = p.y-sy;
                                    let dist = Math.sqrt(a*a+b*b);
                                    if (dist <= (user.radius+p.radius)*5){
                                        p.combat = user.id;
                                        stop = true;
                                        break;
                                    }
                                }
                            }
                            if (stop) break;
                        }
                    }
                }
                let x = ((user.object.x/limit.x2)*limit.x);
                let y = ((user.object.y/limit.y2)*limit.y);
                user.lx = user.vx;
                user.ly = user.vy;
                user.lvx = user.vx;
                user.lvy = user.vy;
                user.vx = (user.x-x)/dt
                user.vy = (user.y-y)/dt
                user.ax = (user.lvx-user.vx)/dt;
                user.ay = (user.lvy-user.vy)/dt;
                user.x = x;
                user.y = y;
                user.alive = true;
                //user.objParent = user.object.parent;
                if (user.id == myId && still){
                    let scale = limit.x2/730;
                    let pos = [(user.object.x+(user.vx*3))/scale,(user.object.y+(user.vy*3))/scale];
                    if (Math.abs(user.vx/scale) < 18000){
                        if ((pos[0])<stillPos[0]){
                            pressKey('right');
                            pressKey('left','up');
                        }else{
                            pressKey('right','up');
                            pressKey('left');
                        }
                    }else{
                        pressKey('right',(user.vx/scale < 0)? 'down' : 'up');
                        pressKey('left',(user.vx/scale > 0)? 'down' : 'up');
                    }
                    if ((pos[1])<stillPos[1]){
                        pressKey('down');
                        pressKey('up','up');
                    }else{
                        pressKey('down','up');
                        pressKey('up');
                    }
                }
                if (arrangeDelay <= 0 && Date.now() > gmstrt+50){
                    for (let i of user.object.children){
                        if (susMode){
                            i.angle -= ((user.vx*dt)*2);
                            if (isNaN(i.angle)){
                                i.angle = 0;
                            }
                        }else{
                            i.angle = 0;
                        }
                    }
                    for (let i of user.object.children){
                        if (i._text){
                            i.tint = user.nameColor || 0xffffff;
                            break;
                        }
                    }
                    let plrSkin = false;
                    let plrColor = false;
                    for (let t in user.object.children){
                        let i = user.object.children[t];
                        if (i._geometry && i._geometry.batchDirty == 0 && !plrSkin){
                            plrSkin = true;
                            if (!user.cloneSkin){
                                user.cloneSkin = new window.PIXI.Graphics();
                                user.cloneSkin.beginFill(0xffffff);
                                user.cloneSkin.drawCircle(0, 0, 100);
                                user.cloneSkin.endFill();
                                user.cloneSkin.visible = false;
                                user.cloneSkin.width = i.width;
                                user.cloneSkin.height = i.height;
                                user.cloneSkin.x = user.object.x;
                                user.cloneSkin.y = user.object.y;
                                user.cloneSkin.cacheAsBitMap = true;
                                user.object.parent.addChild(user.cloneSkin);
                            }else if(user.cloneSkin.parent != user.object.parent){
                                user.cloneSkin.destroy();
                                user.cloneSkin = null;
                            }else{
                                user.cloneSkin.x = user.object.x;
                                user.cloneSkin.y = user.object.y;
                                user.cloneSkin.width = user.realRadius/2;
                                user.cloneSkin.height = user.realRadius/2;
                                user.cloneSkin.visible = false;
                                user.cloneSkin.alpha = 1;
                            }
                            if (coloredList.includes(user.name) && !user.guest){
                                let frames = Date.now()/100;
                                let flashStyle = user.style || 'rgb';
                                if (flashStyle == 'enchanted'){
                                    i.tint = rgbToHex(178+Math.abs(Math.cos(frames))*77,80,178+(Math.abs(Math.cos(frames))*77))//rgbToHex(200+(Math.cos(frames))*55,50+(Math.sin(frames))*50,200+(Math.cos(frames))*55);
                                }else if (flashStyle == 'rgb'){
                                    i.tint = rgbToHex(frames%60<20?(frames % 20)*12.5:255-((frames%60-20)*5),(frames%60<40&&frames%60>20)?(frames % 20)*12.5:255-((frames%60-40)*5),frames%60>40?frames%20*12.5:255-((frames%60-40)*5));
                                }
                            }
                            user.radius = (i.width*(limit.x2/limit.x))/5;
                            user.realRadius = (i.width)*2;
                            i.visible = !minimalist;
                        }else if(t >= 2 && i._geometry && i._geometry.batchDirty == -1 && !plrColor && i.alpha > 0.24){
                            plrColor = true;
                            user.heavyCooldown = Math.floor(i.alpha*1000);
                            if (t < i.parent.children.length-3){
                                let parent = i.parent;
                                parent.removeChild(i);
                                parent.addChild(i);
                                if (i.alpha >= 1){
                                    i.alpha = 0.5;
                                    i.scale.x += 0.5;
                                    i.scale.y += 0.5;
                                }
                            }
                        }
                    }
                    if (user.cooldown && user.lastCD && Date.now() > user.lastCD+100){
                        user.cooldown = 0.1;
                    }
                    if (!user.teamIndicator){
                        user.teamIndicator = new window.PIXI.Text('', {
                            fontFamily: 'Arial',
                            fontSize: 18,
                            fill: 0xffffff,
                            align: 'center',
                        });
                        user.teamIndicator.anchor.x = 0.5;
                        user.teamIndicator.y = user.realRadius*-1.25;
                        user.object.addChild(user.teamIndicator);
                    }else if (user.teamIndicator.parent != user.object){
                        user.teamIndicator.destroy();
                        user.teamIndicator = null;
                    }else {
                        user.teamIndicator.tint = user.teamColor || 0xffffff;
                        user.teamIndicator.text = ((coloredList.includes(user.name) && !user.guest)? "ADM" : "")
                    }
                    if (!user.msgContainer){
                        user.msgContainer = new window.PIXI.Text('', {
                            fontFamily: 'Arial',
                            fontSize: 15,
                            fill: 0xffffff,
                            align: 'center',
                        });
                        user.msgContainer.anchor.x = 0.5;
                        user.msgContainer.y = user.realRadius*-1;
                        user.object.addChild(user.msgContainer);
                    }else if (user.msgContainer.parent != user.object){
                        user.msgContainer.destroy();
                        user.msgContainer = null;
                    }else{
                        if (user.lastMsg && Date.now() < user.sendTime+10000){
                            user.msgContainer.alpha = 10-((Date.now()-user.sendTime)/1000)
                            user.msgContainer.text = user.lastMsg;
                        }
                    }
                    if (!user.pet && typeof(user.petAcessory) != "undefined" && user.petAcessory != -1){
                        user.pet = new window.PIXI.Sprite(petTextures[user.petAcessory]);
                        user.pet.cacheAsBitMap = true;
                        user.pet.anchor.x = 0.5;
                        user.pet.anchor.y = 0.5;
                        user.pet.rotation = 0;
                        user.pet.angle = 0;
                        user.pet.width = user.realRadius/2.5;
                        user.pet.height = user.realRadius/2.5;
                        user.object.parent.addChild(user.pet);
                        user.pet.x = user.object.x;
                        user.pet.y = user.object.y;
                    }else if(user.pet && (user.pet.parent != user.object.parent || user.petAcessory == -1)){
                        user.pet.destroy();
                        user.pet = null;
                    }else if (user.pet){
                        let angle = Math.atan2(user.pet.y-user.object.y,user.pet.x-user.object.x)
                        user.pet.x = lerp(user.pet.x,user.object.x+Math.cos(angle)*user.realRadius/2,1-(0.005**dt));
                        user.pet.y = lerp(user.pet.y,user.object.y+Math.sin(angle)*user.realRadius/2,1-(0.005**dt));
                        user.pet.scale.x = (user.pet.x > user.object.x? Math.abs(user.pet.scale.x)*-1 : Math.abs(user.pet.scale.x));
                    }
                    if (!user.sus && typeof(user.acessory) != 'undefined' && user.acessory != -1 && accessories[user.acessory]){
                        user.sus = new window.PIXI.Sprite(textures[user.acessory]);
                        user.sus.width = user.realRadius;
                        user.sus.height = user.realRadius;
                        user.sus.cacheAsBitmap = true;
                        user.sus.anchor.x = 0.5;
                        user.sus.anchor.y = 0.5;
                        user.sus.angle = 0;
                        user.sus.rotation = 0;
                        user.object.addChild(user.sus);
                    }else if(user.sus && (user.sus.parent != user.object || user.acessory == -1)){
                        user.sus.destroy();
                        user.sus = null;
                    }
                }
                if (user.alive && user.object){ //&& x > 0 && y > 0 && x < limit.x && y < limit.y){
                    CENTERX += user.object.x+(user.vx || 0)*dt*10;
                    CENTERY += user.object.y+(user.vy || 0)*dt*10;
                    leng += 1;
                }
            }else if(user.alive){
                user.deathTime = Date.now();
                user.alive = false;
                user.deaths += 1;
                let aliv = 0;
                for (let ust of users){
                    if (ust.alive){
                        aliv += 1;
                    }
                }
                for (let ust of users){
                    if (ust.alive && aliv <= 1){
                        ust.won += 1;
                    }
                }
                user.object = null;
            }else if(user.objParent && user.objParent.transform){
                for (let model of user.objParent.children){
                    for (let child of model.children){
                        if (user.object){
                            break;
                        }
                        if (child._text){
                            if (child._text == user.name){
                                user.object = model;
                                break;
                            }
                        }
                    }
                }
            }
        }
        if (leng > 1){
            CENTERX /= leng;
            CENTERY /= leng;
        }
        let highest = 0;
        for (let p of users){
            if (p.object && p.alive){
                let a = p.object.x-CENTERX;
                let b = p.object.y-CENTERY;
                let dist = (Math.sqrt(a*a+b*b)/((limit.y+limit.x)/6));
                if (dist > highest){
                    highest = dist
                }
            }
        }
        let SCALE = (Math.min(1.25,Math.max(0.3,1/highest)))/1.4;
        if (battleCam && !findUserById(selPlayer)){
            for (let p of users){
                if (p.alive && p.object){
                    let parent = p.object
                    while (parent.parent){
                        parent = parent.parent
                    }
                    let x = -((CENTERX*SCALE)-limit.x2/2);
                    let y = -((CENTERY*SCALE)-limit.y2/2);
                    lastCAMX = lerp(lastCAMX,x,1 - 0.035 ** dt);
                    lastCAMY = lerp(lastCAMY,y,1 - 0.035 ** dt);
                    lastCAMS = lerp(lastCAMS,SCALE,1 - 0.035 ** dt);
                    parent.x = lastCAMX;
                    parent.y = lastCAMY;
                    parent.transform.scale.y = lastCAMS;
                    parent.transform.scale.x = lastCAMS;
                    if (bg){
                        bg.x = -lastCAMX/lastCAMS;
                        bg.y = -lastCAMY/lastCAMS;
                        bg.transform.scale.x = 2/lastCAMS;
                        bg.transform.scale.y = 2/lastCAMS;
                        break;
                    }
                }
            }
        }
        if (ctx){
            ctx.clearRect(-5000,-5000,15000,15000)
            ctx.setTransform(1,0,0,1,1,1);
            ctx.font = '10px Arial';
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.globalAlpha = 0.5;
            ctx.textAlign = 'left';
            ctx.fillText(Math.floor(1/dt)+"FPS (canvas drawing FPS)",0,21);
            if (myId == hostId){
                ctx.strokeText("You are the host of this room.",0,10);
                ctx.fillText("You are the host of this room.",0,10);
            }else{
                let plr = findUserById(hostId);
                if (plr){
                    ctx.strokeText(plr.name+" Is the host of this room.",0,10);
                    ctx.fillText(plr.name+" Is the host of this room.",0,10);
                }else{
                    ctx.strokeText("The host is unknown????",0,10);
                    ctx.fillText("The host is unknown????",0,10);
                }
            }
            if (tabKey){
                ctx.textAlign = 'center';
                for (let id in users){
                    let user = users[id]
                    ctx.strokeText(user.name+" - "+(user.alive? "ALIVE" : "DEAD"),limit.x/2,60+(id*30));
                    ctx.fillText(user.name+" - "+(user.alive? "ALIVE" : "DEAD"),limit.x/2,60+(id*30));
                }
            }
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'black';
            ctx.textAlign = 'left';
            let camzx = ((lastCAMX/limit.x2)*limit.x);
            let camzy = ((lastCAMY/limit.y2)*limit.y);
            ctx.setTransform(lastCAMS,0,0,lastCAMS,camzx,camzy);
            if (aimbot){
                let plr = findUserById(myId);
                if (plr && plr.alive && plr.special){
                    plr.wasShoot = true;
                    let plr2;
                    let nr = 1/0;
                    for (let user of users){
                        if (user && user.alive && user.id != plr.id){
                            let a = user.x-plr.x;
                            let b =user.y-plr.y;
                            let dist = Math.sqrt(a*a+b*b);
                            if (dist < nr){
                                plr2 = user;
                                nr = dist;
                            }
                        }
                    }
                    if (plr2){
                        let angle2 = plr.arrowAngle+((plr.arrowVel/2));
                        let angle = Math.atan2((((plr2.y-(plr.vy*3)-(plr2.radius))-((Math.abs(plr.x-plr2.x)/plr2.radius)/3.4))+(plr.vy*3))-plr.y,(plr2.x+(plr2.vx*3))-plr.x)*180/Math.PI;
                        let diff = (angle - angle2 + 360) % 360;
                        if (diff > 181){
                            pressKey('left');
                            pressKey('right','up');
                        }else if (diff < 179){
                            pressKey('left','up');
                            pressKey('right');
                        }
                    }
                }else if (plr.wasShoot){
                    plr.wasShoot = false;
                    pressKey('left','up');
                    pressKey('right','up');
                }
            }
            /*if (clicking && !shiftKey && !window.FuckingShit){
                clicked = true;
                pressKey("special");
                let plr = findUserById(myId);
                if (plr && plr.alive){
                    let angle2 = plr.arrowAngle+((plr.arrowVel/2));
                    let angle = Math.atan2(mouse[1]-plr.y,mouse[0]-plr.x)*180/Math.PI;
                    let diff = (angle - angle2 + 360) % 360;
                    if (diff > 181){
                        pressKey('left');
                        pressKey('right','up');
                    }else if (diff < 179){
                        pressKey('left','up');
                        pressKey('right');
                    }
                }
            }else if(clicked){
                clicked = false;
                pressKey("special",'up');
                pressKey("left",'up');
                pressKey("right",'up');
            }*/
            // DEPREACTED, BUGGY AS FUCK!!!! :D
            for (let obj in mapObjs){
                let parent = mapObjs[obj];
                for (let obj2 in parent){
                    let shape = mapObjs[obj][obj2];
                    if (shape && shape.parent && shape.parent.transform){
                        if (glassPlats){
                            shape.alpha = 0.3;
                        }else{
                            shape.alpha = 1;
                        }
                    }
                }
            }
            for (let user of users){
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                let centerX = Math.max(user.radius,Math.min(user.x,limit.x-user.radius));
                let centerY = Math.max(user.radius,Math.min(user.y,limit.y-user.radius));
                if (user.team == 2){
                    ctx.fillStyle = 'red';
                }
                if (user.team == 3){
                    ctx.fillStyle = 'blue';
                }
                if (user.team == 4){
                    ctx.fillStyle = 'green';
                }
                if (user.team == 5){
                    ctx.fillStyle = 'yellow';
                }
                ctx.strokeStyle = 'black';
                if (user.alive){
                    if (user.arrowAngle && user.id == myId && user.special && aimAssist){
                        ctx.globalAlpha = 0.4;
                        let sx = user.x;
                        let sy = user.y;
                        let vx = Math.cos(user.arrowAngle*Math.PI/180)*user.radius*13;
                        let vy = Math.sin(user.arrowAngle*Math.PI/180)*user.radius*13;
                        for (let i = 0; i < 90; i++){
                            sx += vx/3;
                            sy += vy/3;
                            vy += user.radius/3.6;
                            ctx.fillStyle = 'green';
                            ctx.fillRect(sx,sy,5,5);
                        }
                        sx = user.x;
                        sy = user.y;
                        vx = Math.cos(user.arrowAngle*Math.PI/180)*user.radius*9.75;
                        vy = Math.sin(user.arrowAngle*Math.PI/180)*user.radius*9.75;
                        for (let i = 0; i < 90; i++){
                            sx += vx/3;
                            sy += vy/3;
                            vy += user.radius/3;
                            ctx.fillStyle = 'yellow';
                            ctx.fillRect(sx,sy,5,5);
                        }
                        sx = user.x;
                        sy = user.y;
                        vx = Math.cos(user.arrowAngle*Math.PI/180)*user.radius*6.5;
                        vy = Math.sin(user.arrowAngle*Math.PI/180)*user.radius*6.5;
                        for (let i = 0; i < 90; i++){
                            sx += vx/3;
                            sy += vy/3;
                            vy += user.radius/3;
                            ctx.fillStyle = 'red';
                            ctx.fillRect(sx,sy,5,5);
                        }
                        ctx.globalAlpha = 1;
                    }
                    ctx.globalAlpha = 0.6;
                    if (user.tab){
                        ctx.fillStyle = 'yellow';
                        ctx.beginPath();
                        ctx.arc(user.x,user.y,user.radius/2,0,Math.PI*1.5);
                        ctx.lineTo(user.x,user.y);
                        ctx.fill();
                        ctx.closePath();
                    }
                    ctx.globalAlpha = 0.1;
                    if (user.combat >= 0){
                        let comb = findUserById(user.combat);
                        if (comb && comb.alive){
                            if (comb.combat != user.id){
                                user.combat = -1;
                            }
                            ctx.strokeStyle = 'red';
                            ctx.lineWidth = 1;
                            ctx.globalAlpha = 0.1;
                            ctx.beginPath();
                            ctx.moveTo(user.x,user.y);
                            ctx.lineTo(comb.x,comb.y);
                            ctx.stroke();
                            ctx.closePath();
                            ctx.globalAlpha = 1;
                        }else{
                            user.combat = -1;
                        }
                    }
                    if (focusSelf){
                        user.object.alpha = 0.2;
                        user.object.tint = 0x0000ff;
                    }else{
                        if (glassPlayers){
                            user.object.alpha = lerp(user.object.alpha,0.2,1 - (0.02 ** dt));
                            user.object.tint = 0xffffff;
                        }else{
                            user.object.alpha = lerp(user.object.alpha,1,1 - (0.02 ** dt));
                            user.object.tint = 0xffffff;
                        }
                    }
                    ctx.globalAlpha = 0.5;
                    ctx.beginPath();
                    ctx.arc(user.grappleX,user.grappleY,user.grappleRadius,0,Math.PI*2);
                    ctx.fill();
                    ctx.closePath();
                    user.frameDie = false;
                }else{
                    if (user.cloneSkin){
                        user.cloneSkin.visible = true;
                        user.cloneSkin.x -= (user.lx*dt)/3;
                        user.cloneSkin.y -= (user.ly*dt)/3;
                        if (user.cloneSkin.y > limit.y2){
                            user.ly *= -0.6;
                            user.cloneSkin.y = limit.y2;
                        }
                        user.lx *= 0.99;
                        user.ly -= (user.radius);
                        user.cloneSkin.alpha -= dt/3;
                    }
                    if (user.pet){
                        user.pet.destroy();
                        user.pet = null;
                    }
                }
            }
            if (focusSelf){
                let theUs = findUserById(myId);
                if (theUs && theUs.alive){
                    theUs.object.alpha = 1;
                    theUs.object.tint = 0xffffff
                }
            }
            if (hostId == myId){
                modeBar.style.opacity = 1;
                modeBar.style.pointerEvents = 'auto';
            }else{
                modeBar.style.opacity = 0.5;
                instantPlay = false;
                quickplay = false;
                modeBar.style.pointerEvents = 'none';
                if (mode !== 6){
                    mode = 6;
                }
            }
        }else{
            if (hostId == myId){
                modeBar.style.opacity = 1;
                modeBar.style.pointerEvents = 'auto';
            }else{
                modeBar.style.opacity = 0.5;
                modeBar.style.pointerEvents = 'none';
                if (mode !== 6){
                    mode = 6;
                }
            }
        }
    }
}
                                        );
/*
Em uma tigela, dissolva o fermento no açúcar e acrescente o sal, os ingredientes líquidos, os ovos e misture muito bem.
2
Acrescente aos poucos a farinha até formar uma massa macia e sove bem a massa.
3
Deixe a massa descansar por aproximadamente 1 hora.
4
Após o crescimento, divida a massa, enrole da forma que desejar, coloque nas formas e deixe crescer até dobrar de volume.
5
Leve para assar em forno médio (200° C), preaquecido, por aproximadamente 30 minutos.
6
Retire o pão do forno e pincele leite para a casca ficar mais macia.
Informações adicionais
Dicas para fazer a melhor receita de pão caseiro
Se você quiser um pão ainda mais fofinho, ajuste a quantidade de fermento para 45 g e, se quiser regular o sal, pode usar apenas 1/2 colher (sopa) como fizemos no vídeo-receita.
Para deixar seu pão caseiro fofinho, também é importante usar leite: ele deixará a massa bem macia. Mas, se você quer mais crocância, faça seu pão caseiro com água.
A receita de pão caseiro é mais prática do que muitos imaginam, mas, para que ela saia perfeita, é preciso respeitar o tempo de descanso da massa e as temperaturas. Por isso, uma boa dica é deixar seu pão caseiro descansando no forno bem baixinho e com a porta entreaberta: assim ele cresce bastante e deixa o processo de fazer pão caseiro simples e rápido!
Por mais que esteja fazendo um pão caseiro salgado, não esqueça do açúcar: ele serve de alimento para o fermento e, portanto, não vai deixar seu pão caseiro doce!
Além da receita de pão caseiro: mais receitas deliciosas
Receitas com pão de forma: 15 opções práticas e deliciosas
*/

window.PIXI.Graphics.prototype.arc = function(...args){
    if (this.parent){
        if (args[0] == 0 && args[1] == 0){
            for (let t in this.parent.children){
                let i = this.parent.children[t];
                if (i._text){
                    let user = findUserByName(i._text);
                    if (user){
                        user.cooldown = Math.max(0,Math.floor(((args[4]/(Math.PI*2))*1000)));
                        user.lastCD = Date.now();
                        args[2] *= 1.2;
                    }
                }else if(i == this){
                    if (t < this.parent.children.length-2){
                        let parent = this.parent;
                        this.parent.removeChild(i);
                        parent.addChild(i);
                    }
                }
            }
        }
    }
    return originalCall3.call(this,...args);
}

window.PIXI.Graphics.prototype.drawCircle = function(...args){
    if (this.parent){
        var This = this;
        if (args[0] !== 0 || args[1] !== 0){
            for (let i of This.parent.children){
                if (i._text){
                    let user = findUserByName(i._text);
                    if (user){
                        user.grappleX = (((this.parent.x+args[0])/limit.x2)*limit.x);
                        user.grappleY = (((this.parent.y+args[1])/limit.y2)*limit.y);
                        user.grappleDelay = 3;
                        user.grappleRadius = args[2];
                        break;
                    }
                }
            }
        }else{
            let user;
            let id = setInterval(() => {
                if (This.parent){
                    for (let i of This.parent.children){
                        if (i._text){
                            user = findUserByName(i._text);
                            if (user){
                                user.object = This.parent;
                            }else{
                                clearInterval(id);
                            }
                            break;
                        }
                    }
                }else{
                    clearInterval(id);
                }
            },500);
        }
    }
    return originalCall.call(this,...args);
}

let bonkId1 = setInterval(() => {
    if (!bonkiocontainer){
        bonkiocontainer = document.getElementById('bonkiocontainer');
    }else{
        bonkiocontainer.addEventListener("mousemove",function(e){
            let rect = bonkiocontainer.getBoundingClientRect();
            mouse[0] = (((((e.clientX-rect.left)-lastCAMX)/limit.x2)*limit.x)/lastCAMS)-5;
            mouse[1] = (((((e.clientY-rect.top)-lastCAMY)/limit.y2)*limit.y)/lastCAMS)-5;
        })
        bonkiocontainer.addEventListener("mouseup",() => {
            clicking = false;
        });
        bonkiocontainer.addEventListener("mousedown",function(e){
            clicking = true;
            if (shiftKey && myId == hostId){
                for (let p of users){
                    if (p.alive){
                        let a = p.x-mouse[0];
                        let b = p.y-mouse[1];
                        let dist = Math.sqrt(a*a+b*b);
                        if (dist < p.radius*2.5){
                            let frame = Math.floor((Date.now() - gmstrt)/1000*30);
                            websocket.send('42[25,{"a":{"playersLeft":['+p.id+'],"playersJoined":[]},"f":'+frame+'}]');
                            websocket.onmessage({data:'42[31,{"a":{"playersLeft":['+p.id+'],"playersJoined":[]},"f":'+frame+'}]'});
                            break;
                        }
                    }
                }
            }
        })

        window.addEventListener("keydown",function(e){
            if (document.activeElement !== chatInput2 && document.activeElement !== chatInput1){
                if (e.altKey && e.keyCode == 90 && !clicking){
                    selPlayer = -1;
                    for (let p of users){
                        if (p.alive){
                            let a = p.x-mouse[0];
                            let b = p.y-mouse[1];
                            let dist = Math.sqrt(a*a+b*b);
                            if (dist < p.radius*2.5){
                                selPlayer = p.id;
                                displayInChat(p.name+' watch yo tone (Now freecaming over em)','#f5583b');
                                break;
                            }
                        }
                    }
                }
                if (e.keyCode == 17){
                    e.preventDefault();
                    shiftKey = true;
                }
                if (e.keyCode == 9){
                    e.preventDefault();
                    tabKey = true;
                }
                if (shiftKey && e.keyCode == 70){
                    battleCam = !battleCam;
                    e.preventDefault();
                }
                if (e.altKey && e.keyCode == 65){
                    aimbot = !aimbot;
                    displayInChat("AimBot is now "+((aimbot)? "Activated" : "Deactivated"));
                    e.preventDefault();
                }
                if (e.altKey && e.keyCode == 81){
                    aimAssist = !aimAssist;
                    displayInChat("AimAssist is now "+((aimAssist)? "Activated" : "Deactivated"));
                    e.preventDefault();
                }
                if (e.altKey && e.keyCode == 79){
                    glassPlats = !glassPlats;
                    displayInChat("Googles are now "+((glassPlats)? "Activated" : "Deactivated"));
                    e.preventDefault();
                }
                if (e.altKey && e.keyCode == 73){
                    glassPlayers = !glassPlayers;
                    displayInChat("Player Googles are now "+((glassPlayers)? "Activated" : "Deactivated"));
                    e.preventDefault();
                }
                if (e.altKey && e.keyCode == 85){
                    focusSelf = !focusSelf;
                    displayInChat("Focus self are now "+((focusSelf)? "Activated" : "Deactivated"));
                    e.preventDefault();
                }
                if (e.altKey && e.keyCode == 77){
                    afkmode = !afkmode;
                    displayInChat("afkmode is now "+((afkmode)? "on" : "off"));
                    e.preventDefault();
                }
                if (e.altKey && e.keyCode == 76){
                    brl = !brl;
                    window.localStorage.setItem("lang",brl? "1" : "0");
                    displayInChat("language is now "+((brl)? "pt br" : "en us"));
                    e.preventDefault();
                }
                if (e.altKey && e.keyCode == 87){
                    let player = findUserById(myId);
                    if (player && player.alive){
                        if (still){
                            still = false;
                            displayInChat("Not still anymore.");
                            pressKey('right','up');
                            pressKey('left','up');
                            pressKey('down','up');
                            pressKey('up','up');
                        }else{
                            still = true;
                            let scale = limit.x2/730;
                            stillPos = [player.object.x/scale,player.object.y/scale];
                            displayInChat("Now attempting to be still at position X: "+Math.floor(stillPos[0])+" Y: "+Math.floor(stillPos[1]));
                            pressKey('right','up');
                            pressKey('left','up');
                            pressKey('down','up');
                            pressKey('up','up');
                        }
                    }else{
                        displayInChat("Shouldn't you be alive?")
                    }
                    e.preventDefault();
                }
                if (e.altKey && e.keyCode == 84){
                    CATGpt = !CATGpt;
                    displayInChat("cat mode is now "+CATGpt);
                    e.preventDefault();
                }
                if (e.altKey && e.keyCode == 71){
                    gptResponses = !gptResponses;
                    displayInChat("gpt is now "+gptResponses);
                    e.preventDefault();
                }
                if (e.altKey && e.keyCode == 80){
                    api_key = prompt("Api key?");
                    window.localStorage.setItem('api',api_key,Number.MAX_SAFE_INTEGER);
                    e.preventDefault();
                }
                if (e.altKey && e.keyCode == 72){
                    Chatvisible = !Chatvisible;
                    e.preventDefault();
                }
                if (e.altKey && e.keyCode == 66) {
                    if (instantPlay){
                        displayInChat("QUICK PLAY")
                        instantPlay = false;
                        quickplay = true;
                        e.preventDefault();
                    }else if (quickplay){
                        displayInChat("NORMAL PLAY")
                        quickplay = false;
                        instantPlay = false;
                        e.preventDefault();
                    }else{
                        displayInChat("INSTANT PLAY")
                        instantPlay = true;
                        quickplay = false;
                        e.preventDefault();
                    }
                }
                if (e.altKey && e.keyCode == 86){
                    toggleLobby();
                }
                if (e.altKey && e.keyCode == 83){
                    startGame();
                    e.preventDefault();
                }
                if (e.altKey && e.keyCode == 68){
                    document.getElementById("newbonklobby_editorbutton").click();
                    document.getElementById('mapeditor_midbox_settingsbutton').click();
                    e.preventDefault();
                }
            }else{
                shiftKey = false;
            }
        })

        window.addEventListener("keyup",function(e){
            if (e.keyCode == 17){
                shiftKey = false;
                e.preventDefault();
            }
            if (e.keyCode == 9){
                e.preventDefault();
                tabKey = false;
            }
        })
        clearInterval(bonkId1);
    }
},50)

let help = [
    'WARNING: THIS MODE IS NOT COMPATIBLE WITH GMM OR BONK COMMANDS, YET SOME FEATURES LIKE PM WORKS FROM NBM > BCMD CLIENTS, AS WELL AS BCMD > NBM CLIENTS',
    '/acessory [0-'+(accessories.length-1)+'] - Changes your acessorie',
    '/pet [0-'+(pets.length-1)+'] - changes your pet',
    '/rejoin - Rejoins the current game, if you did not create it!',
    '/pets - shows a list of pets',
    '/joinlink - joins a room with their link',
    '/themes - shows a list of themes so you can switch between.',
    '/globalchat - connects or disconnects to globalchat',
    '/g <msg> - say smth in globalchat',
    '/debugger - shows packet debugger',
    '/acessories - displays a list of all acessories for you to use.',
    '/removeAcessory - Removes acessorie.',
    '/minimalist - Toggles minimalist mode, Skins will be disabled.',
    '/sus - :>',
    '/jointext <text> - sends an message whenever someone joins, replacing {player} with their name.',
    '/notify - toggles notification, default is on.',
    '/echo <player> - Starts or Stops Copying the player',
    '/clearecho - Clears echo',
    '/oof - oof',
    '/style R G B - be aware that rainbow colors are only for admins, please do not beg.',
    '/mteam [Spec,Ffa,Blue,Red,Yellow,Green] - moves yourself to one of the avaliable teams.',
    '/mall [Spec,Ffa,Blue,Red,Yellow,Green] - Moves everyone to one team.',
    '/tallike [language code / none] - Every message will be translated to another language.',
    '/translate [language/auto (language code)] [language (language code)] [text]',
    '/tbalance [2-4] - splits players into teams',
    '/commands - shows all commands',
    '/banmode - ban mode list',
    '/team - Shows who worked and helped on the mode',
    '/addlist [URL] - adds an music to the playlist',
    '/clearlist - clears the playlist',
    '/removelist - removes an music from the playlist',
    '/search [Text] - searchs for videos in youtube',
    '/volume [0-100] - changes jukeboxVolume',
    '/juketime - shows current Time vs duration of jukebox',
    '/jukebox [url] - plays music for everyone in the lobby',
    '/jukemute - Toggles pause for jukebox',
    '/quickpoll [options,a,b,c,...] - starts an 60 seconds poll',
    '/joinname <room> - everytime someone enters, COUNS will be replaced with the number of people, while NAMY will be replaced with the last person that joined.',
    '/eval <cmd> - runs an javascript command',
    '/msg [msg] - send an message to an pm',
    '/pm [user] - chat privately with an user.',
    '/pmusers - all users you currently can chat with',
    '/ignorepm [user] - block or unblock a user pm',
    '/playerGoggles - makes every player invisible',
    '/focusSelf - Every other player is invisible',
    '/aimAssist - shows where your arrow will fall',
    '/aimbot - enables aimbot',
    'tab - shows alive and dead people on the lobby',
    'ctrl f - cool camera',
    'ctrl click - kills people under your mouse',
    'alt b - cycles through mode quickplay or instant play',
    'alt s - instantly starts the game',
    'alt d - opens map editor settings',
    'alt h - toggles chat',
    'alt t - toggles CAT gpt (gpt acts like a cat)',
    'alt z - freecam over the player under your mouse',
    'alt o - Shape Googles, shapes become transparent.',
    'alt u - Makes other players trasnparent',
    'alt i - Every player is transparent.',
    'alt a - aim bot',
    'alt q - Aim assist',
    'alt v - toggles lobby',
    'alt g - activates chat gpt',
    'alt l - changes the game lang (english or portuguese)',
    'alt p - sets chat gpt API KEY (saved in localstorage)',
];

let support = [
    'INeonz - Initially making an bot based on canvas manipulation, but made the mod way better and extensive.',
    'LEGENDBOSS123 - showing me the pixi way and because i stole some parts from his code lol',
    'PixelMelt - Showed me an workaround via piped on playing music that has monetization settings, THANK YOU!!!!',
    'left paren - nothing but he is here anyways',
    'helloim - for being himself',
    'pro9905 - sure',
    'dragon yt1 - hes',
    'twitter - for nothing, twitter is crap'
]

window.setBanMode = (mod) => {banMode = mod;}
window.setAcessorie = (acc) => {
    currentAcessory = acc;
    displayInChat("selected "+accessories[acc]);
    findUserById(myId).acessory = acc;
    websocket.send(`42[4,{"type":"acessory","index":${currentAcessory}}]`);
    window.localStorage.setItem('acc-nbm',acc);
};

window.setPet = (pet) => {
    currentPet = pet;
    displayInChat("selected "+pets[pet]);
    findUserById(myId).petAcessory = pet;
    websocket.send(`42[4,{"type":"pet","index":${pet}}]`);
    window.localStorage.setItem('pet-nbm',pet);
};


window.setTheme = (theme) => {
    window.localStorage.setItem('theme', theme);
    refreshStyle(theme);
    displayInChat("Set theme to "+styles[theme].name);
}

window.runCmd = function(msg,which){
    for (let emoji in emojis){
        msg = msg.replaceAll(emoji,emojis[emoji]);
    }
    msg = msg.replaceAll("\\*","[CODE[:ASTERK:]]");
    msg = msg.replaceAll("\\_","[CODE[:UNLINE:]]");
    msg = msg.replaceAll("\\~","[CODE[:DAS:]]");
    msg = msg.replaceAll("\\|","[CODE[:TE:]]");
    msg = msg.replaceAll("\\:glitch:","[CODE[:GLITCHY:]]");
    if (!msg.match("https://") && !msg.match("www.") && !msg.match("http://")){
        var bold = /\*\*(.*?)\*\*/gm;
        let match;
        while ((match = bold.exec(msg)) != null) {
            let t = '';
            for (let i = 0; i < match[0].length; i++){
                let l = match[0][i];
                let index = letters.indexOf(l);
                if (index != -1){
                    let n = fonts.bold[index] || l;
                    l = n;
                }
                t += l;
            }
            msg = msg.replace(match[0],t.slice(2,-2))
        }
        var strike = /\~\~(.*?)\~\~/gm;
        while ((match = strike.exec(msg)) != null) {
            let t = '';
            for (let i = 0; i < match[0].length; i++){
                if (i > 1 && i < match[0].length-2){
                    t += "̶"+match[0][i];
                }
            }
            msg = msg.replace(match[0],t+"̶")
        }
        var underline = /\_\_(.*?)\_\_/gm;
        while ((match = underline.exec(msg)) != null) {
            let t = '';
            for (let i = 0; i < match[0].length; i++){
                if (i > 1 && i < match[0].length-2){
                    t += match[0][i]+"͟";
                }
            }
            msg = msg.replace(match[0],"͟"+t)
        }
        var glitches = ["̵̨̤̥̝͉̼̘̜̣͙͍͕̙̜̄̀͐͗̊","̸̡̜̘̜̺̳̞̘̹̻́̈͌͝","̴̮͚͛̌̄","̴̧̗͕͎͎͎̗̮͚̱̜̹̜̦̦͚̙̫͉̬͙̯̣̉̈́̔̿̐̎͝","̸̨̮̲̬̗͉̼͕͚̦͚̺̗̲̦̰̹̣̭͓̮̈́̄̊̑̓͑͌","̵̤̥̄̀͐͗̊","̸̮̲̬̗͉̼͕͚̦͚̺̈́̄̊̑̓͑͌","̸̡̜̘́̈͌͝","̵̤̥̝͉̼̘̄̀͐͗̊"];
        var glitch = /\<g (.*?) g\>/gm;
        while ((match = glitch.exec(msg)) != null) {
            let t = '';
            for (let i = 0; i < match[0].length; i++){
                if (i > 2 && i < match[0].length-3){
                    t += glitches[Math.floor(Math.random()*glitches.length)]+match[0][i];
                }
            }
            msg = msg.replace(match[0],t);
        }
        var italic = /\*(.*?)\*/gm;
        while ((match = italic.exec(msg)) != null) {
            let t = '';
            for (let i = 0; i < match[0].length; i++){
                if (i > 0 && i < match[0].length-1){
                    let l = match[0][i];
                    let index = letters.indexOf(l);
                    if (index != -1){
                        let n = fonts.italic[index] || l;
                        l = n;
                    }
                    t += l;
                }
            }
            msg = msg.replace(match[0],t)
        }
        var forbidden = /\|\|(.*?)\|\|/gm;
        while ((match = forbidden.exec(msg)) != null) {
            msg = msg.replace(match[0],"█".repeat((match[0].replaceAll("||","")).length));
        }
    }
    msg = msg.replaceAll("[CODE[:ASTERK:]]","*");
    msg = msg.replaceAll("[CODE[:UNLINE:]]","_");
    msg = msg.replaceAll("[CODE[:DAS:]]","~");
    msg = msg.replaceAll("[CODE[:TE:]]","|");
    msg = msg.replaceAll("[CODE[:GLITCHY:]]",":glitch:");
    if (oofMode){
        let tr = msg.split(' ');
        for (let t = 0; t < tr.length; t++){
            if (Math.random()*2 < 1){
                tr[t] = "#".repeat(tr[t].length);
            }
        }
        let m = '';
        for (let t of tr){
            m += t+' ';
        }
        msg = m;
    }
    if (which){
        chatInput1.value = msg;
    }else{
        chatInput2.value = msg;
    }
    if (msg.startsWith('/joinlink')){
        let alink = msg.split(' ')[1] || '';
        joinRoom(alink);
        chatInput1.value = '';
        chatInput2.value = '';
    }else
        if (msg.startsWith('/rejoin')){
            if (currentaddress && users.length > 1 && window.nbm && window.nbm.B8M && window.nbm.P6U){
                fetch('https://bonk2.io/scripts/getroomaddress.php',{
                    method: 'POST',
                    headers: {
                        "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
                    },
                    body: `id=${currentaddress}`
        })
                    .then((r) => r.json())
                    .then((r) => {
                    if (r.r && r.r == 'success'){
                        const roomPass = {
                            action: "join",
                            quick: false,
                            address: r.address,
                            password: '',
                            server: r.server,
                            mo: "b"
                        };
                        if (websocket){
                            lastSENTPacket = '41';
                            websocket.close();
                        }
                        window.nbm.P6U("NBM: Rejoining...");
                        setTimeout(() => {
                            window.nbm.B8M(roomPass);
                        },200);
                    }else{
                        displayInChat("Room does not exist...?");
                    }
                })
            }else{
                displayInChat("You probably created this room or there is only you, maybe you joined through a link too, this could also be a problem with code injector");
            }
            chatInput1.value = '';
            chatInput2.value = '';
        }else
            if (msg.startsWith('/echo')){
                let name = msg.slice(6);
                let user = findUserByName(name);
                if (user){
                    if (user.id != myId){
                        if (echoList.indexOf(name) != -1){
                            echoList.splice(echoList.indexOf(name),1);
                            displayInChat(`Removed ${name} from echo list.`);
                        }else{
                            displayInChat(`Added ${name} to echo list.`);
                            echoList.push(name);
                        }
                    }else{
                        displayInChat('Cannot each yourself.')
                    }
                }else{
                    displayInChat('Dis user does not exist!');
                }
                chatInput1.value = '';
                chatInput2.value = '';
            }else
                if (msg.startsWith('/debugger')){
                    document.getElementById('packetdebugger').style.display = 'block';
                    chatInput1.value = '';
                    chatInput2.value = '';
                }else
                    if (msg.startsWith('/clearecho')){
                        displayInChat('cleared echo list');
                        echoList.splice(0,echoList.length);
                        chatInput1.value = '';
                        chatInput2.value = '';
                    }else
                        if (msg.startsWith('/themes')){
                            for (let t in styles){
                                let theme = styles[t];
                                displayInChat(t+" - <a href='javascript:window.setTheme("+t+");'>"+theme.name+"</a>",null,true);
                            }
                            chatInput1.value = '';
                            chatInput2.value = '';
                        }else
                            if (msg.startsWith('/globalchat')){
                                if (!globalChat){
                                    displayInChat("attempting to connect to globalchat...");
                                    globalChat = new WebSocket('wss://broxy-bonkproxy.itsdawildshadow.repl.co');
                                    globalChat.onopen = () => {
                                        displayInChat("Connected! awaiting verification...");
                                        let token = (document.cookie.match(/rememberToken=.*?;/ig) || [])[0]
                                        if (token){
                                            token = token.slice(14,-1);
                                            globalChat.send('100'+JSON.stringify([1,token]));
                                        }else{
                                            displayInChat("Failed to verify, make sure the box in the login page (remember me) is checked and that you're not a guest.")
                                        }
                                    };
                                    globalChat.onmessage = (event) => {
                                        if (typeof(event.data) == 'string'){
                                            if (event.data == '100[5]'){
                                                displayInChat("Verified.")
                                            }else if(event.data.startsWith('100[6,')){
                                                let data = JSON.parse(event.data.slice(3,event.data.length));
                                                displayInChat(data[1],'#f542f2');
                                            }
                                        }
                                    }
                                    globalChat.onclose = () => {
                                        displayInChat("Disconnected from globalchat.");
                                        globalChat = null;
                                    }
                                }else{
                                    displayInChat("Disconnecting...");
                                    globalChat.close();
                                }
                                chatInput1.value = '';
                                chatInput2.value = '';
                            }else
                                if (msg.startsWith('/g')){
                                    if (globalChat){
                                        let txt = msg.slice(3,msg.length);
                                        if (txt.length > 0){
                                            globalChat.send('100'+JSON.stringify([4,txt]));
                                        }
                                    }else{
                                        displayInChat("Connect to the global chat first using /globalchat.");
                                    }
                                    chatInput1.value = '';
                                    chatInput2.value = '';
                                }else
                                    if (msg.startsWith('/acessories')){
                                        for (let acc in accessories){
                                            displayInChat(acc+' - <font color=\'red\'><a href="javascript:window.setAcessorie('+acc+')">'+accessories[acc]+"</a></font>",null,true)
                                        }
                                        chatInput1.value = '';
                                        chatInput2.value = '';
                                    }else
                                        if (msg.startsWith('/oof')){
                                            oofMode = !oofMode;
                                            displayInChat("oof mode is now "+(oofMode? "On" : "Off"));
                                            chatInput1.value = '';
                                            chatInput2.value = '';
                                        }else
                                            if (msg.startsWith('/notify')){
                                                muteNotify = !muteNotify;
                                                displayInChat("Notifications is now "+(muteNotify? "Off" : "On"));
                                                window.localStorage.setItem("notify",muteNotify);
                                                chatInput1.value = '';
                                                chatInput2.value = '';
                                            }else
                                                if (msg.startsWith('/sus')){
                                                    susMode = !susMode;
                                                    displayInChat("??? mode is now "+(susMode? "On" : "Off"));
                                                    chatInput1.value = '';
                                                    chatInput2.value = '';
                                                }else
                                                    if (msg.startsWith('/minimalist')){
                                                        minimalist = !minimalist;
                                                        displayInChat("Minimalist mode is now "+(minimalist? "On" : "Off"));
                                                        chatInput1.value = '';
                                                        chatInput2.value = '';
                                                    }else
                                                        if (msg.startsWith('/style')){
                                                            let rgb = [];
                                                            let s = msg.split(' ');
                                                            let us = findUserById(myId);
                                                            try {
                                                                if (s.length == 4 && JSON.parse(`[${s[1]},${s[2]},${s[3]}]`)){
                                                                    us.nameColor = rgbToHex(...JSON.parse(`[${s[1]},${s[2]},${s[3]}]`));
                                                                    websocket.send(`42[4,{"type":"style","from":"${findUserById(myId).name}","style":[${s[1]},${s[2]},${s[3]}]}]`);
                                                                    myStyle = s;
                                                                }
                                                            }catch(e){};
                                                            chatInput1.value = '';
                                                            chatInput2.value = '';
                                                        }else
                                                            if (msg.startsWith('/removeAcessory')){
                                                                findUserById(myId).acessory = -1;
                                                                displayInChat("Removed acessory.");
                                                                websocket.send(`42[4,{"type":"acessory","index":-1}]`);
                                                                chatInput1.value = '';
                                                                currentAcessory = -1;
                                                                chatInput2.value = '';
                                                            }else
                                                                if (msg.startsWith('/removePet')){
                                                                    findUserById(myId).petAcessory = -1;
                                                                    displayInChat("Removed pet.");
                                                                    currentPet = -1;
                                                                    websocket.send(`42[4,{"type":"pet","index":-1}]`);
                                                                    chatInput1.value = '';
                                                                    chatInput2.value = '';
                                                                }else
                                                                    if (msg.startsWith('/pets')){
                                                                        for (let pet in pets){
                                                                            displayInChat(pet+' - <font color=\'red\'><a href="javascript:window.setPet('+pet+')">'+pets[pet]+"</a></font>",null,true)
                                                                        }
                                                                        chatInput1.value = '';
                                                                        chatInput2.value = '';
                                                                    }else
                                                                        if (msg.startsWith('/pet')){
                                                                            currentPet = parseInt(msg.split(' ')[1]);
                                                                            if (!pets[currentAcessory]){
                                                                                displayInChat("This pet does not exist.");
                                                                                currentPet = -1;
                                                                            }else{
                                                                                displayInChat("Now using: "+pets[currentPet]);
                                                                            }
                                                                            findUserById(myId).petAcessory = currentPet;
                                                                            websocket.send(`42[4,{"type":"pet","index":${currentPet}}]`);
                                                                            window.localStorage.setItem('pet-nbm',currentPet);
                                                                            chatInput1.value = '';
                                                                            chatInput2.value = '';
                                                                        }else
                                                                            if (msg.startsWith('/acessory')){
                                                                                currentAcessory = parseInt(msg.split(' ')[1]);
                                                                                if (!accessories[currentAcessory]){
                                                                                    displayInChat("This acessory does not exist.");
                                                                                    currentAcessory = -1;
                                                                                }else{
                                                                                    displayInChat("Now using: "+accessories[currentAcessory]);
                                                                                }
                                                                                findUserById(myId).acessory = currentAcessory;
                                                                                websocket.send(`42[4,{"type":"acessory","index":${currentAcessory}}]`);
                                                                                window.localStorage.setItem('acc-nbm',currentAcessory);
                                                                                chatInput1.value = '';
                                                                                chatInput2.value = '';
                                                                            }else
                                                                                if (msg.startsWith('/flashstyle ')){
                                                                                    let style = msg.substring(12,msg.length);
                                                                                    findUserById(myId).style = style;
                                                                                    websocket.send(`42[4,{"type":"color style","style":"${style}"}]`);
                                                                                    displayInChat("set flash style to "+style);
                                                                                    chatInput1.value = '';
                                                                                    chatInput2.value = '';
                                                                                }else
                                                                                    if (msg.startsWith('/talklike ')){
                                                                                        talkLike = msg.split(' ')[1] || 'none';
                                                                                        displayInChat("Now talking in "+talkLike);
                                                                                        chatInput1.value = '';
                                                                                        chatInput2.value = '';
                                                                                    }else
                                                                                        if (msg.startsWith('/translateto ')){
                                                                                            translateTo = msg.split(' ')[1] || 'none';
                                                                                            displayInChat("Now translating to "+translateTo);
                                                                                            chatInput1.value = '';
                                                                                            chatInput2.value = '';
                                                                                        }else
                                                                                            if (msg.startsWith('/translate ')){
                                                                                                let txt = msg.split(' ');
                                                                                                let from = txt[1] || 'auto';
                                                                                                let to = txt[2] || 'en';
                                                                                                let t = '';
                                                                                                for (let i = 3; i < txt.length; i++){
                                                                                                    t += txt[i]+' ';
                                                                                                }
                                                                                                displayInChat("Translating: "+t);
                                                                                                translate(t,from,to).then((r) => displayInChat(from+" to "+to+": "+r));
                                                                                                chatInput1.value = '';
                                                                                                chatInput2.value = '';
                                                                                            }else
                                                                                                if (msg.startsWith('/banmode')){
                                                                                                    if (hostId == myId){
                                                                                                        let mods = [
                                                                                                            [-1,"None - Doens't Kicks anyone"],
                                                                                                            [0,"Tab - Kicks anyone that tabs out"],
                                                                                                            [1,"Chat - Kicks anyone that chats"],
                                                                                                            [2,"Move - Kicks anyone that moves"],
                                                                                                            [3,"Req - Kicks anyone that requests a map"],
                                                                                                            [4,"Winner - Kicks anyone that wins"],
                                                                                                            [5,"Loser - Kicks anyone that dies"],
                                                                                                            [6,"Lag - kicks anyone with more than 1000ms"],
                                                                                                            [7,"Ready - kicks anyone that presses ready"]
                                                                                                        ]
                                                                                                        for (let m of mods){
                                                                                                            displayInChat(`<a href='javascript:window.setBanMode(m[0]);'>${m[1]}</a>`,null,true);
                                                                                                        }
                                                                                                    }
                                                                                                    chatInput1.value = '';
                                                                                                    chatInput2.value = '';
                                                                                                }else
                                                                                                    if (msg.startsWith('/mall ')){
                                                                                                        if (hostId == myId){
                                                                                                            let teams = {
                                                                                                                "s": 0,
                                                                                                                "f": 1,
                                                                                                                "r": 2,
                                                                                                                "b": 3,
                                                                                                                "g": 4,
                                                                                                                "y": 5
                                                                                                            }
                                                                                                            let team = msg.slice(6,7).toLowerCase();
                                                                                                            if (teams[team] != undefined){
                                                                                                                for (let plr of users){
                                                                                                                    websocket.send(`42[26,{"targetID":${plr.id},"targetTeam":${teams[team]}}]`);
                                                                                                                    websocket.onmessage({data:`42[18,${plr.id},${teams[team]}]`});
                                                                                                                }
                                                                                                            }else{
                                                                                                                displayInChat("Invalid team. [Spec,Ffa,Blue,Red,Green,Yellow]");
                                                                                                            }
                                                                                                        }
                                                                                                        chatInput1.value = '';
                                                                                                        chatInput2.value = '';
                                                                                                    }else
                                                                                                        if (msg.startsWith('/tbalance ')){
                                                                                                            if (hostId == myId){
                                                                                                                let amount = Math.min(4,Math.max(2,parseInt(msg.substring(10,msg.length))|| 2));
                                                                                                                displayInChat("Now splitting players into "+amount+" teams");
                                                                                                                let players = Math.max(1,users.length/amount);
                                                                                                                displayInChat(Math.floor(players)+" for each team");
                                                                                                                for (let plr in users){
                                                                                                                    let team = (((Math.floor((plr/players)-0.1))%(amount))+3);
                                                                                                                    websocket.send(`42[26,{"targetID":${users[plr].id},"targetTeam":${team}}]`);
                                                                                                                    websocket.onmessage({data:`42[18,${users[plr].id},${team}]`});
                                                                                                                    displayInChat(users[plr].name + " is now in team "+team);
                                                                                                                }
                                                                                                            }
                                                                                                            chatInput1.value = '';
                                                                                                            chatInput2.value = '';
                                                                                                        }else
                                                                                                            if (msg.startsWith('/linebreak ')){
                                                                                                                let txt = msg.substring(10,msg.length);
                                                                                                                sendMsg("                          "+txt);
                                                                                                                chatInput1.value = '';
                                                                                                                chatInput2.value = '';
                                                                                                            }else
                                                                                                                if (msg.startsWith('/commands')){
                                                                                                                    commandsList.style.visibility = 'visible';
                                                                                                                    chatInput1.value = '';
                                                                                                                    chatInput2.value = '';
                                                                                                                }else
                                                                                                                    if (msg.startsWith('/team')){
                                                                                                                        for (let plr of support){
                                                                                                                            displayInChat(plr,'#eb9534');
                                                                                                                        }
                                                                                                                        chatInput1.value = '';
                                                                                                                        chatInput2.value = '';
                                                                                                                    }else if (msg.startsWith('/help')){
                                                                                                                        for (let tx of help){
                                                                                                                            displayInChat(tx);
                                                                                                                        }
                                                                                                                        chatInput1.value = '';
                                                                                                                        chatInput2.value = '';
                                                                                                                    }else
                                                                                                                        if (msg.startsWith('/joinname')){
                                                                                                                            let evl = msg.substring(11,msg.length);
                                                                                                                            if (evl.length > 2){
                                                                                                                                roomName = evl;
                                                                                                                            }else{
                                                                                                                                roomName = '';
                                                                                                                            }
                                                                                                                            chatInput1.value = '';
                                                                                                                            chatInput2.value = '';
                                                                                                                        }else
                                                                                                                            if (msg.startsWith('/jukemute')){
                                                                                                                                mutePlayer();
                                                                                                                                chatInput1.value = '';
                                                                                                                                chatInput2.value = '';
                                                                                                                            }else
                                                                                                                                if (msg.startsWith('/juketime')){
                                                                                                                                    let seconds1 = Math.floor(jukeBox.currentTime % 60);
                                                                                                                                    let min1 = Math.floor(jukeBox.currentTime/60);
                                                                                                                                    let hours1 = Math.floor(min1/60);
                                                                                                                                    let seconds2 = Math.floor(jukeBox.duration % 60);
                                                                                                                                    let min2 = Math.floor(jukeBox.duration/60);
                                                                                                                                    let hours2 = Math.floor(min2/60);
                                                                                                                                    displayInChat(hours1+":"+min1%60+":"+seconds1+" / "+hours2+":"+min2%60+":"+seconds2)
                                                                                                                                    chatInput1.value = '';
                                                                                                                                    chatInput2.value = '';
                                                                                                                                }else
                                                                                                                                    if (msg.startsWith('/volume ')){
                                                                                                                                        let txt = msg.substring(7,msg.length);
                                                                                                                                        let num = parseInt(txt);
                                                                                                                                        if (num != 1/0 && num != null && num != undefined){
                                                                                                                                            jukeBox.volume = Math.max(0,Math.min(1,num/100));
                                                                                                                                            displayInChat("Set jukebox volume to "+Math.max(0,Math.min(100,num)));
                                                                                                                                        }
                                                                                                                                        chatInput1.value = '';
                                                                                                                                        chatInput2.value = '';
                                                                                                                                    }else
                                                                                                                                        if (msg.startsWith('/addlist ')){
                                                                                                                                            if (hostId == myId){
                                                                                                                                                let url = msg.substring(9,msg.length);
                                                                                                                                                if (url.match("youtube") && url.indexOf("watch?v=") && url.match("https://")){
                                                                                                                                                    if (url.match("short")){
                                                                                                                                            displayInChat("Shorts URL Not allowed",'#ff0000');
                                                                                                                                                    }else{
                                                                                                                                            displayInChat("Added one music to the playlist.",'#ff0000');
                                                                                                                                            playlist.push(url);
                                                                                                                                            if (playlist.length == 1){
                                                                                                                                                changePlayerURL(url,Date.now());
                                                                                                                                                lastVideoURL = url;
                                                                                                                                                videoTimestamp = Date.now();
                                                                                                                                                websocket.send(`42[4,{"type":"video player","url":"${url}","from":"${findUserById(myId).name}","timestamp":"${videoTimestamp}"}]`);
                                                                                                                                            }
                                                                                                                                                    }
                                                                                                                                                }else{
                                                                                                                                                    displayInChat("Invalid youtube URL",'#ff0000');
                                                                                                                                                }
                                                                                                                                            }else{
                                                                                                                                                displayInChat("You aren't host.");
                                                                                                                                            }
                                                                                                                                            chatInput1.value = '';
                                                                                                                                            chatInput2.value = '';
                                                                                                                                        }else
                                                                                                                                            if (msg.startsWith('/removelist')){
                                                                                                                                                if (hostId == myId){
                                                                                                                                                    playlist.splice(playlist.length-1,1);
                                                                                                                                                    displayInChat("Removed ONE music from the playlist.",'#ff0000');
                                                                                                                                                }else{
                                                                                                                                                    displayInChat("You aren't host.");
                                                                                                                                                }
                                                                                                                                                chatInput1.value = '';
                                                                                                                                                chatInput2.value = '';
                                                                                                                                            }else
                                                                                                                                                if (msg.startsWith('/clearlist')){
                                                                                                                                                    if (hostId == myId){
                                                                                                                                            playlist = [];
                                                                                                                                            displayInChat("Cleared the playlist.",'#ff0000');
                                                                                                                                                    }else{
                                                                                                                                            displayInChat("You aren't host.");
                                                                                                                                                    }
                                                                                                                                                    chatInput1.value = '';
                                                                                                                                                    chatInput2.value = '';
                                                                                                                                                }else
                                                                                                                                                    if (msg.startsWith('/jukebox ')){
                                                                                                                                            if (hostId == myId){
                                                                                                                                                let url = msg.substring(9,msg.length);
                                                                                                                                                if (url.match("youtube") && url.indexOf("watch?v=") && url.match("https://")){
                                                                                                                                                    if (url.match("short")){
                                                                                                                                            displayInChat("Shorts URL Not allowed",'#ff0000');
                                                                                                                                                    }else{
                                                                                                                                            displayInChat("Jukebox has been changed, type /removejukebox to remove. [URL: "+url+"]",'#ff0000');
                                                                                                                                            changePlayerURL(url,Date.now());
                                                                                                                                            lastVideoURL = url;
                                                                                                                                            videoTimestamp = Date.now();
                                                                                                                                            playlist = [url];
                                                                                                                                            websocket.send(`42[4,{"type":"video player","url":"${url}","from":"${findUserById(myId).name}","timestamp":"${videoTimestamp}"}]`);
                                                                                                                                                    }
                                                                                                                                                }else{
                                                                                                                                                    displayInChat("Invalid youtube URL",'#ff0000');
                                                                                                                                                }
                                                                                                                                            }else{
                                                                                                                                                displayInChat("Only host can change the current player.",'#ff0000');
                                                                                                                                            }
                                                                                                                                            chatInput1.value = '';
                                                                                                                                            chatInput2.value = '';
                                                                                                                                                    }else
                                                                                                                                            if (msg.startsWith("/search ")){
                                                                                                                                                let find = msg.slice(8,msg.length);
                                                                                                                                                if (find.length > 0){
                                                                                                                                                    displayInChat("Retrieving results...");
                                                                                                                                                    fetch('https://pipedapi.kavin.rocks/search?q='+encodeURI(find)+'&filter=all')
                                                                                                                                            .then(response => response.json())
                                                                                                                                            .then(json => {
                                                                                                                                            let items = 0;
                                                                                                                                            let videos = [];
                                                                                                                                            for (let video of json.items){
                                                                                                                                                if (items > 4) break;
                                                                                                                                                if (!video.isShort){
                                                                                                                                                    videos.push(video);
                                                                                                                                                    items += 1;
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                            if (items > 0){
                                                                                                                                                for (let video of videos){
                                                                                                                                                    displayInChat(`<a href="javascript:window.changeJukebox('${"https://www.youtube.com"+video.url}');"><font color="blue">`+hescape(video.title)+"</font></a> by "+hescape(video.uploaderName)+` <a href="javascript:navigator.clipboard.writeText('${"https://www.youtube.com"+video.url}');"><font color='blue'>[Copy]</font></a>`,'#ff0000',true);
                                                                                                                                                    displayInChat(((video.shortDescription || '...').substring(0,30)),'#ff0000');
                                                                                                                                                    let seconds = video.duration%60;
                                                                                                                                                    let min = Math.floor(video.duration/60)%60;
                                                                                                                                                    let hours = Math.floor(Math.floor(video.duration/60)/60);
                                                                                                                                                    displayInChat(video.views+" views "+hours+":"+min+":"+seconds,'#ff0000');
                                                                                                                                                }
                                                                                                                                            }else{
                                                                                                                                                displayInChat("No results found.",'#ff0000')
                                                                                                                                            }
                                                                                                                                                    })
                                                                                                                                            .catch(error => displayInChat("Error",'#ff0000'));
                                                                                                                                                }
                                                                                                                                                chatInput1.value = '';
                                                                                                                                                chatInput2.value = '';
                                                                                                                                            }else
                                                                                                                                                if (msg.startsWith('/nothing')){
                                                                                                                                                    chatInput1.value = '';
                                                                                                                                                    chatInput2.value = '';
                                                                                                                                                }else
                                                                                                                                                    if (msg.startsWith('/aimbot')){
                                                                                                                                            aimbot = !aimbot;
                                                                                                                                            displayInChat("Aimbot is now "+(aimbot? "on" : "off"));
                                                                                                                                            chatInput1.value = '';
                                                                                                                                            chatInput2.value = '';
                                                                                                                                                    }else
                                                                                                                                            if (msg.startsWith('/aimAssist')){
                                                                                                                                                aimAssist = !aimAssist;
                                                                                                                                                displayInChat("Aimbot is now "+(aimAssist? "on" : "off"));
                                                                                                                                                chatInput1.value = '';
                                                                                                                                                chatInput2.value = '';
                                                                                                                                            }else
                                                                                                                                                if (msg.startsWith('/playerGoggles')){
                                                                                                                                                    glassPlayers = !glassPlayers;
                                                                                                                                                    displayInChat("Player Goggles is now "+(glassPlayers? "on" : "off"));
                                                                                                                                                    chatInput1.value = '';
                                                                                                                                                    chatInput2.value = '';
                                                                                                                                                }else
                                                                                                                                                    if (msg.startsWith('/focusSelf')){
                                                                                                                                                    focusSelf = !focusSelf;
                                                                                                                                                    displayInChat("focusSelf is now "+(focusSelf? "on" : "off"));
                                                                                                                                                    chatInput1.value = '';
                                                                                                                                                    chatInput2.value = '';
                                                                                                                                                    }else
                                                                                                                                                    if (msg.startsWith('/removejukebox')){
                                                                                                                                                if (hostId == myId){
                                                                                                                                                    websocket.send(`42[4,{"type":"video player","url":"","from":"${findUserById(myId).name}"}]`);
                                                                                                                                                    changePlayerURL("");
                                                                                                                                                    displayInChat("No more jukebox.",'#ff0000');
                                                                                                                                                }else{
                                                                                                                                                    displayInChat("Only host can change the current jukebox.",'#ff0000');
                                                                                                                                                }
                                                                                                                                                chatInput1.value = '';
                                                                                                                                                chatInput2.value = '';
                                                                                                                                                    }else
                                                                                                                                                if (msg.startsWith('/ignorepm ')){
                                                                                                                                                    let name = msg.substring(10,msg.length);
                                                                                                                                                    if (name.length > 0){
                                                                                                                        let user = findUserByName(name);
                                                                                                                        if (!blocked.includes(name)){
                                                                                                                            blocked.push(name);
                                                                                                                            displayInChat(name+" is being ignored.");
                                                                                                                        }else{
                                                                                                                            let unblocked = false;
                                                                                                                            displayInChat(name+" is not being ignored anymore.");
                                                                                                                            blocked.splice(blocked.indexOf(name),1);
                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                    chatInput1.value = '';
                                                                                                                                                    chatInput2.value = '';
                                                                                                                                                }else
                                                                                                                                                    if (msg.startsWith('/endpoll') && poll.length > 0){
                                                                                                                        pollTimer = Date.now();
                                                                                                                        chatInput1.value = '';
                                                                                                                        chatInput2.value = '';
                                                                                                                                                    }else
                                                                                                                        if (msg.startsWith('/quickpoll')){
                                                                                                                            let pollText = msg.substring(11,msg.length);
                                                                                                                            if (pollText.length > 1){
                                                                                                                                let options = pollText.split(',');
                                                                                                                                let alphabet = 'ABCDEFG';
                                                                                                                                let pollMsg = '';
                                                                                                                                let polls = [];
                                                                                                                                for (let option = 0; option < options.length; option++){
                                                                                                                                    pollMsg += alphabet[option]+") "+options[option]+"     ";
                                                                                                                                    polls.push([options[option],0,{}]);
                                                                                                                                }
                                                                                                                                poll = polls;
                                                                                                                                pollTimer = Date.now()+30000;
                                                                                                                                sendMsg(pollMsg);
                                                                                                                                websocket.send('42'+JSON.stringify([4,{"type":"poll","from":findUserById(myId).name,"poll":options}]));
                                                                                                                                displayInChat("The poll will end in 30 seconds, if you want it to end sooner, type /endpoll.");
                                                                                                                            }
                                                                                                                            chatInput1.value = '';
                                                                                                                            chatInput2.value = '';
                                                                                                                        }else
                                                                                                                            if (msg.startsWith('/jointext ')){
                                                                                                                                let ms = msg.substring(10,msg.length);
                                                                                                                                joinText = ms;
                                                                                                                            }else
                                                                                                                                if (msg.startsWith('/msg')){
                                                                                                                                    let ms = msg.substring(5,msg.length);
                                                                                                                                    if (ms.length > 0){
                                                                                                                                        if(publickey[1][0] != 0 && publickey[1][1] != 0 && publickey[0] == privatechat){
                                                                                                                                            let username = findUserById(myId).name;
                                                                                                                                            pmlastmessage = ms.slice(0,400);
                                                                                                                                            ENCRYPT_MESSAGE(publickey[1],ms).then(function(e){
                                                                                                                                                websocket.send("42"+JSON.stringify([4,{"type":"private chat","from":username,"to":privatechat,"message":e}]));
                                                                                                                                            });
                                                                                                                                            displayInChat("<i><font color='#51538f'>[TO]</font> <font color='#838585'>"+privatechat+"</font></i>: "+hescape(ms),"black",true);
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                    chatInput1.value = '';
                                                                                                                                    chatInput2.value = '';
                                                                                                                                }else
                                                                                                                                    if (msg.startsWith('/pmusers')){
                                                                                                                                        displayInChat("Retrieving pm users...","#9e6e49");
                                                                                                                                        pmUsers = [];
                                                                                                                                        websocket.send("42"+JSON.stringify([4,{"type":"request private chat users","from":findUserById(myId).name}]));
                                                                                                                                        setTimeout(() => {
                                                                                                                                            displayInChat("You can pm with: ");
                                                                                                                                            for (let user of pmUsers){
                                                                                                                                                displayInChat("> <i><a href = 'javascript:window.runCmd(\"/pm "+user+"\");'><font color=\"#56b054\">"+user+"</font></i>",'#9e6e49',true);
                                                                                                                                            }
                                                                                                                                        },1500);
                                                                                                                                        chatInput1.value = '';
                                                                                                                                        chatInput2.value = '';
                                                                                                                                    }else if (msg.startsWith('/pm ')){
                                                                                                                                        let name = msg.substring(4,msg.length);
                                                                                                                                        if (name.length > 0){
                                                                                                                                            displayInChat("Trying to connect with "+name);
                                                                                                                                            privatechat = name;
                                                                                                                                            websocket.send("42"+JSON.stringify([4,{"type":"request public key","from":findUserById(myId).name,"to":name}]));
                                                                                                                                            keyreqts = Date.now();
                                                                                                                                            setTimeout(function(){if(publickey[0]!=privatechat){displayInChat("Failed to connect to "+name+".");privatechat = publickey[0];}},1600);
                                                                                                                                        }
                                                                                                                                        chatInput1.value = '';
                                                                                                                                        chatInput2.value = '';
                                                                                                                                    }else
                                                                                                                                        if (msg.startsWith('/eval ')){
                                                                                                                                            let evl = msg.substring(5,msg.length) || 'console.log("Nothing?");';
                                                                                                                                            try{
                                                                                                                                                printOnChat = true;
                                                                                                                                                let re = eval(evl);
                                                                                                                                                if (re){
                                                                                                                                                    displayInChat(re);
                                                                                                                                                }
                                                                                                                                            }catch(error){
                                                                                                                                                displayInChat(error);
                                                                                                                                            }
                                                                                                                                            printOnChat = false;
                                                                                                                                            chatInput1.value = '';
                                                                                                                                            chatInput2.value = '';
                                                                                                                                        }else{
                                                                                                                                            if (talkLike != 'none' && !msg.startsWith("/")){
                                                                                                                                                translate(msg,"auto",talkLike).then(r => sendMsg(r));
                                                                                                                                                chatInput1.value = '';
                                                                                                                                                chatInput2.value = '';
                                                                                                                                            }
                                                                                                                                        }
    if (which){
        if (document.getElementById("gamerenderer") && document.getElementById("gamerenderer").style.visibility != 'hidden'){
            sendMsg(chatInput1.value);
            chatInput1.value = '';
            chatInput1.blur();
        }
    }
}

let chatId1 = setInterval(() => {
    if (!chatInput1 || !chatBox){
        chatInput1 = document.getElementById('newbonklobby_chat_input');
        chatBox = document.getElementById('newbonklobby_chat_content');
        if (chatBox && chatInput1){
            chatInput1.addEventListener("keydown",(e) => {
                if (e.keyCode == 13){
                    let msg = chatInput1.value;
                    runCmd(msg,true);
                }
            })
        }
    }else{
        clearInterval(chatId1);
    }
},500)

let chatId2 = setInterval(() => {
    if (!chatInput2 || !chatBox2){
        chatInput2 = document.getElementById('ingamechatinputtext');
        chatBox2 = document.getElementById('ingamechatcontent');
        if (chatBox2 && chatInput2){
            chatInput2.addEventListener("keydown",(e) => {
                if (e.keyCode == 13){
                    let msg = chatInput2.value;
                    runCmd(msg,false);
                }
            })
        }
    }else{
        clearInterval(chatId2);
    }
},500)
