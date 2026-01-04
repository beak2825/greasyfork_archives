// ==UserScript==
// @name           New Inline Tier Charts+
// @namespace      DusanAndWarric
// @description    This will provide an inline tier chart for Dawn of the Dragons.Maps created by Brayden.Tiers collected by Warric. Big tab by kylereese.
// @include        *www.27thdimension.com/dotd/tierChartsStandalone.html
// @include        *kongregate.com/games/5thplanetgames/dawn-of-the-dragons*
// @include        *kongregate.com/games/5thPlanetGames/dawn-of-the-dragons*
// @include        *50.18.191.15/kong/?DO_NOT_SHARE_THIS_LINK*
// @include        *dawnofthedragons.com*
// @include        *apps.facebook.com/dawnofthedragons*
// @include        *web1.dawnofthedragons.com/live_standalone*
// @include        *newgrounds.com/portal/view/609826*
// @include        *armorgames.com/dawn-of-the-dragons-game/13509*
// @include        *armorgames.com/*/13509*
// @version        3.7.4
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/390983/New%20Inline%20Tier%20Charts%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/390983/New%20Inline%20Tier%20Charts%2B.meta.js
// ==/UserScript==
(function () {
    var bigRaidsTable = [
        {
            name: "Aurim Bonestorm",
            ap: "277.2t",
            os: "500t (and all above)",
            mt: "8q",
            tiers: "300t - 500t - 750t - 1.5q - 2q - 4q - 8q"
        },
        {
            name: "Black Hand Besieger",
            ap: "46.2t",
            os: "50t",
            mt: "1.5q",
            tiers: "100t - 200t - 300t - 750t - 1.5q"
        },
        {
            name: "Bound Protector",
            ap: "224.61t",
            os: "250t",
            mt: "3q",
            tiers: "250t - 300t - 450t - 750t - 1q - 1.5q - 2q - 3q"
        },
        {
            name: "Deadly Bloodmane",
            ap: "125t",
            os: "125t",
            mt: "1.5q",
            tiers: "200t - 250t - 500t - 1q - 1.5q"
        },
        {
            name: "Deadly Cenius",
            ap: "168.75t",
            os: "4q",
            mt: "30q",
            tiers: "200t - 300t - 750t - 1.5q - 2q - 4q - 8q - 12q - 30q"
        },
        {
            name: "Deadly Erebus",
            ap: "312.5t",
            os: "8q",
            mt: "60q",
            tiers: "750t - 1.5q - 2q - 4q - 8q - 12q - 30q - 60q"
        },
        {
            name: "Deadly Hydra",
            ap: "85.7t",
            os: "100t",
            mt: "2q",
            tiers: "100t - 200t - 250t - 300t - 400t - 800t - 1.5q - 2q"
        },
        {
            name: "Deadly Kalaxia",
            ap: "35t",
            os: "35t",
            mt: "2q",
            tiers: "100t - 200t - 300t - 400t - 800t - 1.5q - 2q"
        },
        {
            name: "Deadly Lady Vas'ok",
            ap: "6.25t",
            os: "6.25t",
            mt: "1q",
            tiers: "100t - 200t - 300t - 400t - 500t - 600t - 1q"
        },
        {
            name: "Deadly Pit of Bone",
            ap: "314.81t",
            os: "5q",
            mt: "60q",
            tiers: "750t - 1.5q - 2q - 5q - 8q - 14q - 30q - 60q"
        },
        {
            name: "Deadly Reaper Mantis",
            ap: "74.1t",
            os: "90t",
            mt: "2.5q",
            tiers: "100t - 200t - 250t - 300t - 400t - 1q - 1.5q - 2q - 2.5q"
        },
        {
            name: "Deadly Shackled Spirit",
            ap: "288.46t",
            os: "300t (5q)",
            mt: "50q",
            tiers: "300t - 750t - 1.5q - 2q - 5q - 8q - 14q - 30q - 50q"
        },
        {
            name: "Deadly Sir Cai",
            ap: "62.5t",
            os: "62.5t",
            mt: "3q",
            tiers: ""
        },
        {
            name: "Deadly Talon",
            ap: "37.5t",
            os: "40t",
            mt: "1.5q",
            tiers: "100t - 200t - 250t - 300t - 400t - 500t - 1q - 1.5q"
        },
        {
            name: "Deadly Verkiteia",
            ap: "75t",
            os: "75t",
            mt: "2q",
            tiers: "100t - 200t - 250t - 300t - 400t - 800t - 1.5q - 2q"
        },
        {
            name: "Deadly Vhaliribdis",
            ap: "187.5t",
            os: "200t (8q)",
            mt: "30q",
            tiers: "200t - 300t - 750t - 1.5q - 2q - 4q - 8q - 12q - 30q"
        },
        {
            name: "Diseasebearer",
            ap: "194.04t",
            os: "500t",
            mt: "8q",
            tiers: "100t - 300t - 500t - 750t - 1.5q - 2q - 4q - 8q"
        },
        {
            name: "Galapthog",
            ap: "74.59t",
            os: "100t",
            mt: "3.5q",
            tiers: "100t - 200t - 500t - 750t - 1q - 1.5q - 2q - 3.5q"
        },
        {
            name: "Giant Spearman",
            ap: "25.9t",
            os: "75t",
            mt: "2q",
            tiers: ""
        },
        {
            name: "Gloom Colossus",
            ap: "49.725t",
            os: "80t",
            mt: "5q",
            tiers: "80t - 200t - 500t - 750t - 1q - 1.5q - 2q - 5q"
        },
        {
            name: "Mokattam",
            ap: "82.875t",
            os: "130t",
            mt: "8q",
            tiers: "130t - 600t - 800t - 1q - 2q - 5q - 8q"
        },
        {
            name: "Qwyngyl",
            ap: "32.5t",
            os: "50t",
            mt: "2q",
            tiers: "50t - 100t - 500t - 750t - 1q - 1.5q - 2q"
        },
        {
            name: "Rash'ita",
            ap: "50.07t",
            os: "100t",
            mt: "4q",
            tiers: "100t - 200t - 500t - 750t - 1q - 1.5q - 2q - 4q"
        },
        {
            name: "Rotleflash",
            ap: "383.46t",
            os: "all tiers",
            mt: "6q",
            tiers: "500t - 750t - 1.5q - 2q - 4q - 6q"
        },
        {
            name: "Volcanic Worm",
            ap: "97.655t",
            os: "250t",
            mt: "3q",
            tiers: "100t - 200t - 250t - 300t - 400t - 1q - 2q - 3q"
        },
        {
            name: "Werereindeer",
            ap: "97.1t",
            os: "250t",
            mt: "3q",
            tiers: "100t - 200t - 250t - 300t - 400t - 1q - 2q - 3q"
        },
        {
            name: "Xeurim the Corruptor",
            ap: "443.52t",
            os: "1.5q (and all above)",
            mt: "5q",
            tiers: "500t -750t - 1.5q - 2q - 4q - 5q"
        }
    ];

    ( function ( data ) {
        "use strict";

        function createTable(data, wrapper) {
            wrapper.appendChild(document.createElement('div'));
            var table = wrapper.firstChild.appendChild(document.createElement("table"));
            var thead = table.appendChild(document.createElement("thead"));
            thead.appendChild(document.createElement("tr"));
            var td = thead.firstChild.appendChild(document.createElement("td"));
            td.appendChild(document.createTextNode("Name"));
            td = thead.firstChild.appendChild(document.createElement("td"));
            td.appendChild(document.createTextNode("AP"));
            td = thead.firstChild.appendChild(document.createElement("td"));
            td.appendChild(document.createTextNode("OS"));
            td = thead.firstChild.appendChild(document.createElement("td"));
            td.appendChild(document.createTextNode("MT"));
            td = thead.firstChild.appendChild(document.createElement("td"));
            td.appendChild(document.createTextNode("All tiers"));

            var tbody = table.appendChild(document.createElement("tbody"));
            var row;
            for (var i = 0; i < data.length; i++) {
                row = tbody.appendChild(document.createElement("tr"));
                td = row.appendChild(document.createElement("td"));
                td.appendChild(document.createTextNode(data[i].name));
                td = row.appendChild(document.createElement("td"));
                td.appendChild(document.createTextNode(data[i].ap));
                td = row.appendChild(document.createElement("td"));
                td.appendChild(document.createTextNode(data[i].os));
                td = row.appendChild(document.createElement("td"));
                td.appendChild(document.createTextNode(data[i].mt));
                td = row.appendChild(document.createElement("td"));
                td.appendChild(document.createTextNode(data[i].tiers));
            }
        }

        /**
        * creates a new element for the list
        * @param {string} label the name of the dataset
        * @param {string} src the image id
        * @param {Function} func the function to be called when clicked
        * @returns {unresolved}
        */
        function create(label, data, func) {
            var wrapper = document.createElement ( "li" );
            wrapper.onclick = func;
            if ( typeof data === "string" ) {
                wrapper.appendChild ( document.createElement('div') );
                wrapper.firstChild.appendChild ( document.createElement ( "img" ) );
                wrapper.firstChild.firstChild.setAttribute ( "src", data );
                wrapper.firstChild.firstChild.setAttribute ( "alt", label );
            }
            else if (typeof data === "object") {
                createTable(data, wrapper);
            }
            if(label) {
                wrapper.appendChild ( document.createElement ( "button" ) );
                wrapper.lastChild.appendChild ( document.createTextNode ( label ) );
            }
            return wrapper;
        };

        var list = document.createElement ( "ul" );
        list.setAttribute ( "id", "NewInlineTierCharts" );
        list.appendChild ( create ( "\u21C6", "", function () {
            this.parentNode.setAttribute("class",( this.parentNode.getAttribute ( "class" ) === "right" ? "" : "right" ));
        } ) );
        /**
     * switches between active and inactive
     * @returns {undefined}
     */
        var showHide = function () {
            var status = this.getAttribute ( "class" ) === "active" ? "" : "active";
            for (var counter = 0; counter < this.parentNode.childNodes.length; counter++) {
                this.parentNode.childNodes[counter].setAttribute ( "class", "" );
            }
            this.setAttribute ( "class", status );
            this.parentNode.setAttribute("active",status);
        };

        for (var counter = 0; counter < data.length; counter++) {
            list.appendChild ( create ( data[counter][0], data[counter][1], showHide ) );
        }
        var styles = document.createElement ( "style" );
        styles.setAttribute ( "type", "text/css" );
        styles.setAttribute ( "id", "NewInlineTierChartsStyles" );
        styles.appendChild ( document.createTextNode (
            "#NewInlineTierCharts { position:fixed;top:0;left:-65px;z-index:100000;max-height:100%; }" +
            "#NewInlineTierCharts:hover,#NewInlineTierCharts[active=\"active\"] { left:0; }" +
            "#NewInlineTierCharts.right { left:auto;right:-65px; }" +
            "#NewInlineTierCharts.right:hover,#NewInlineTierCharts.right[active=\"active\"] { right:0; }" +
            "#NewInlineTierCharts,#NewInlineTierCharts li { margin:0;padding:0;list-style: none;display:block; }" +
            "#NewInlineTierCharts li { min-height:0.25em; }" +
            "#NewInlineTierCharts img { width:auto;height:auto;display:block;background-color:#fff; }" +
            "#NewInlineTierCharts div { width:auto;max-height:100%;display:none;overflow:auto; }" +
            `#NewInlineTierCharts button {
border-radius:2px;background:#fff;
height:auto;
font-size: 12px;
font-family: monospace;
padding:1px;
text-align: center;
box-sizing: border-box;
text-align:center;
color:#000;
border: 1px solid #000;
width:75px;
display:block;
background-color:#fff;
background-image:linear-gradient(to bottom,rgba(255,255,255,0.1),rgba(255,255,255,0.2),rgba(0,0,0,0.1));
font-weight:normal;
line-height:normal;
}` +
            "#NewInlineTierCharts .active div { display:block;position:fixed;top:0;left:75px;z-index:100000;max-height:100%;max-width:"+(window.innerWidth-150)+"px; }" +
            "#NewInlineTierCharts.right .active div { left:auto;right:75px; }" +
            "#NewInlineTierCharts .active button { background:#222;color:#fff; }" +
            "#NewInlineTierCharts table { background: white; font-size: 12px; color: black; }" +
            "#NewInlineTierCharts table tbody tr:nth-child(2n+1) { background: #ccc; }" +
            "#NewInlineTierCharts table tr { border-bottom: 1px solid black; }" +
            "#NewInlineTierCharts table td { border-right: 1px solid #eee; padding: 0 16px; text-align: center; }" +
            "#NewInlineTierCharts table thead td { font-weight: bold; }"
        ) );
        window.addEventListener('resize',function() {
            document.getElementById("NewInlineTierChartsStyles").innerHTML = document.getElementById("NewInlineTierChartsStyles").innerHTML.replace(/(#NewInlineTierCharts .active div\{.*?max-width:)[0-9]+(px;.*?\})/,'$1'+(window.innerWidth-150)+'$2');
        });
        document.getElementsByTagName ( "head" )[0].appendChild ( styles );
        document.getElementsByTagName ( "body" )[0].appendChild ( list );
    } ) (
        [
            [ "", "" ],
            [ "Z1-9", "https://vignette.wikia.nocookie.net/imw/images/d/d0/Z1-9.png/revision/latest/scale-to-width-down/618" ],
            [ "Small", "https://vignette.wikia.nocookie.net/godra/images/b/b6/Small.png/revision/latest/scale-to-width-down/786" ],
            [ "Medium", "https://vignette.wikia.nocookie.net/godra/images/9/96/Medium.png/revision/latest/scale-to-width-down/786" ],
            [ "Large", "https://vignette.wikia.nocookie.net/godra/images/7/71/Large.png/revision/latest/scale-to-width-down/786" ],
            [ "Epic", "https://vignette.wikia.nocookie.net/godra/images/2/26/Epic.png/revision/latest/scale-to-width-down/786" ],
            [ "Colossal", "https://vignette.wikia.nocookie.net/godra/images/2/24/Collossal.png/revision/latest/scale-to-width-down/786" ],
            [ "Gigantic", "https://vignette.wikia.nocookie.net/godra/images/3/37/Gigantic.png/revision/latest/scale-to-width-down/786" ],
            [ "Elite", "https://vignette.wikia.nocookie.net/godra/images/7/7b/Elites.png/revision/latest/scale-to-width-down/786" ],
            [ "Deadly", "https://vignette.wikia.nocookie.net/godra/images/8/88/Deadlies.png/revision/latest/scale-to-width-down/786" ],
            [ "", "" ],
            [ "BIG", bigRaidsTable ],
            [ "", "" ],
            [ "Old Guild", "https://vignette.wikia.nocookie.net/imw/images/2/2a/Guild_old.png/revision/latest/scale-to-width-down/426" ],
            [ "Guild 1/2", "https://vignette.wikia.nocookie.net/imw/images/5/5c/Guild1.png/revision/latest/scale-to-width-down/786" ],
            [ "Guild 2/2", "https://vignette.wikia.nocookie.net/godra/images/9/9d/Guild_II.png/revision/latest/scale-to-width-down/786" ],
            [ "", "" ],
            [ "BoB Map", "https://vignette.wikia.nocookie.net/imw/images/f/f0/BoB.png/revision/latest/scale-to-width-down/666" ],
            [ "MaM Map", "https://vignette.wikia.nocookie.net/imw/images/2/22/MaM.png/revision/latest/scale-to-width-down/666" ],
            [ "GD Map", "https://vignette.wikia.nocookie.net/imw/images/5/55/GD.png/revision/latest/scale-to-width-down/666" ],
            [ "GoC Map", "https://vignette.wikia.nocookie.net/imw/images/3/30/GoC.png/revision/latest/scale-to-width-down/666" ],
            [ "FW Map", "https://vignette.wikia.nocookie.net/imw/images/3/38/FW.png/revision/latest/scale-to-width-down/666" ],
            [ "NQ Map", "https://vignette.wikia.nocookie.net/imw/images/0/01/NMQ.png/revision/latest/scale-to-width-down/666" ],
            [ "RT Map", "https://vignette.wikia.nocookie.net/imw/images/2/24/RT.png/revision/latest/scale-to-width-down/688" ],
            [ "BHH Map", "https://vignette.wikia.nocookie.net/godra/images/4/49/BHH.png/revision/latest/scale-to-width-down/665" ],
            [ "CC Map", "https://vignette.wikia.nocookie.net/godra/images/9/9f/CC.png/revision/latest/scale-to-width-down/664" ],
            [ "IH Map", "https://vignette.wikia.nocookie.net/imw/images/c/ce/IH.png/revision/latest/scale-to-width-down/608" ],
            [ "SoB Map", "https://vignette.wikia.nocookie.net/godra/images/2/29/SoB.png/revision/latest/scale-to-width-down/608" ],
            [ "DC Map", "https://vignette.wikia.nocookie.net/imw/images/f/f5/DC.png/revision/latest/scale-to-width-down/608" ]
        ]
    );
})();
