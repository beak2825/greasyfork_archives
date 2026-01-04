// ==UserScript==
// @name           New Inline Tier Charts (fork)
// @namespace      DusanAndWarric
// @description    This will provide an inline tier chart for Dawn of the Dragons.Maps created by Brayden.Tiers collected by Warric.
// @include        http://www.27thdimension.com/dotd/tierChartsStandalone.html
// @include        http://www.kongregate.com/games/5thplanetgames/dawn-of-the-dragons*
// @include        https://www.kongregate.com/games/5thplanetgames/dawn-of-the-dragons*
// @include        http://www.kongregate.com/games/5thPlanetGames/dawn-of-the-dragons*
// @include        https://www.kongregate.com/games/5thPlanetGames/dawn-of-the-dragons*
// @include        http://kongregate.com/games/5thplanetgames/dawn-of-the-dragons*
// @include        https://kongregate.com/games/5thplanetgames/dawn-of-the-dragons*
// @include        http://kongregate.com/games/5thPlanetGames/dawn-of-the-dragons*
// @include        https://kongregate.com/games/5thPlanetGames/dawn-of-the-dragons*
// @include        http://www.dawnofthedragons.com/game*
// @include        http://www.dawnofthedragons.com/
// @include        http://www.dawnofthedragons.com
// @include        http://dawnofthedragons.com/game*
// @include        https://apps.facebook.com/dawnofthedragons*
// @include        http://web1.dawnofthedragons.com/live_standalone*
// @include        http://www.newgrounds.com/portal/view/609826*
// @include        http://newgrounds.com/portal/view/609826*
// @include        http://dawnofthedragons.com/
// @include        https://armorgames.com/dawn-of-the-dragons-game/13509*
// @include        https://www.armorgames.com/dawn-of-the-dragons-game/13509*
// @include        https://armorgames.com/play/13509/dawn-of-the-dragons*
// @version        3.6.5
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/34134/New%20Inline%20Tier%20Charts%20%28fork%29.user.js
// @updateURL https://update.greasyfork.org/scripts/34134/New%20Inline%20Tier%20Charts%20%28fork%29.meta.js
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
            [ "Z1-9", "http://image.prntscr.com/image/4f72335bf6a44a699472fb174e487a28.png" ],
            [ "Small", "https://image.prntscr.com/image/WOtD-EqcQ1WBbbzVtuaElA.png" ],
            [ "Medium", "https://image.prntscr.com/image/88b1b4cbe4c34b7b9b4babe47b22cf37.png" ],
            [ "Large", "https://image.prntscr.com/image/etE3auhnRMeb-3y0-7AAow.png" ],
            [ "Epic", "https://image.prntscr.com/image/GFiaLV4VQdKWo7hfpGBbtA.png" ],
            [ "Colossal", "https://image.prntscr.com/image/18204873f20f4521a3226d1438f51cc3.png" ],
            [ "Gigantic", "https://image.prntscr.com/image/sS0xtIeMQwm2XJYEw1MVrA.png" ],
            [ "Elite", "https://image.prntscr.com/image/1o0iyT0rRyypgHvrNliJ_Q.png" ],
            [ "Deadly", "https://image.prntscr.com/image/fAK4qKkQSNeINAjkZfAS7g.png" ],
            [ "", "" ],
            [ "Old Guild", "http://image.prntscr.com/image/6afdca29e2f14617ad6ee220615ebc54.png" ],
            [ "Guild 1/2", "http://image.prntscr.com/image/ecb8c73134954e61ad5990a476cd78d4.png" ],
            [ "Guild 2/2", "https://image.prntscr.com/image/9mMy9WMHTkq9A6jR5mRwHQ.png" ],
            [ "", "" ],
            [ "BoB Map", "http://image.prntscr.com/image/5600754e9a294daeb006c210134a9889.png" ],
            [ "MaM Map", "http://image.prntscr.com/image/832f8eb0bd4a433cbf5b366fcbf66f3a.png" ],
            [ "GD Map", "http://image.prntscr.com/image/aeaada2593784f29ab056098bae4e18b.png" ],
            [ "GoC Map", "http://image.prntscr.com/image/333019c25a0e435593a15ef78986539b.png" ],
            [ "FW Map", "http://image.prntscr.com/image/4d0e0f3a7d30407887e3e323ee5350c4.png" ],
            [ "NQ Map", "https://image.prntscr.com/image/993789c610e6447d9d178360b1b52ef7.png" ],
            [ "RT Map", "http://image.prntscr.com/image/dac78691e48440de83a7366540de3da1.png" ],
            [ "BHH Map", "https://image.prntscr.com/image/06592f09a3d94f5c9b99add335e6ec46.png" ],
            [ "CC Map", "https://image.prntscr.com/image/eyRPCdBhTEWidcCmrZmlDw.png" ]
        ]
);