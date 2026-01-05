// ==UserScript==
// @name           New Inline Tier Charts
// @namespace      DusanAndWarric
// @description    This will provide an inline tier chart for Dawn of the Dragons.Maps created by Brayden.Tiers collected by Warric.
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
// @version        3.6.22
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/12484/New%20Inline%20Tier%20Charts.user.js
// @updateURL https://update.greasyfork.org/scripts/12484/New%20Inline%20Tier%20Charts.meta.js
// ==/UserScript==
( function ( data ) {
    "use strict";
    /**
     * creates a new element for the list
     * @param {string} label the name of the dataset
     * @param {string} src the image id
     * @param {Function} func the function to be called when clicked
     * @returns {unresolved}
     */
    var create = function ( label, src, func ) {
        var wrapper = document.createElement ( "li" );
        wrapper.onclick = func;
        if ( src ) {
            wrapper.appendChild ( document.createElement('div') );
            wrapper.firstChild.appendChild ( document.createElement ( "img" ) );
            wrapper.firstChild.firstChild.setAttribute ( "src", src );
            wrapper.firstChild.firstChild.setAttribute ( "alt", label );
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
            "#NewInlineTierCharts{position:fixed;top:0;left:-65px;z-index:100000;max-height:100%;}" +
            "#NewInlineTierCharts:hover,#NewInlineTierCharts[active=\"active\"]{left:0;}" +
            "#NewInlineTierCharts.right{left:auto;right:-65px;}" +
            "#NewInlineTierCharts.right:hover,#NewInlineTierCharts.right[active=\"active\"]{right:0;}" +
            "#NewInlineTierCharts,#NewInlineTierCharts li{margin:0;padding:0;list-style: none;display:block;}" +
            "#NewInlineTierCharts li{min-height:0.25em;}" +
            "#NewInlineTierCharts img{width:auto;height:auto;display:block;background-color:#fff;}" +
            "#NewInlineTierCharts div{width:auto;max-height:100%;display:none;overflow:auto;}" +
            "#NewInlineTierCharts button{border-radius:2px;background:#fff;height:auto;font-size: 12px;font-family: monospace;padding:1px;text-align: center;box-sizing: border-box;text-align:center;color:#000;border: 1px solid #000;width:75px;display:block;background-color:#fff;background-image:linear-gradient(to bottom,rgba(255,255,255,0.1),rgba(255,255,255,0.2),rgba(0,0,0,0.1));font-weight:normal;line-height:normal;}" +
            "#NewInlineTierCharts .active div{display:block;position:fixed;top:0;left:75px;z-index:100000;max-height:100%;max-width:"+(window.innerWidth-150)+"px;}" +
            "#NewInlineTierCharts.right .active div{left:auto;right:75px;}" +
            "#NewInlineTierCharts .active button{background:#222;color:#fff;}"
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
