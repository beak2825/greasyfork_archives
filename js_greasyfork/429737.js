// ==UserScript==
// @name       Popup SGF Display for Sensei's Library
// @description Makes the diagrams on Sensei's Library interactive
// @locale     en
// @include    https://senseis.xmp.net/*
// @include    http://senseis.xmp.net/*
// @require    https://code.jquery.com/jquery-3.6.0.slim.min.js
// @require    https://cdn.jsdelivr.net/gh/yewang/besogo@59cd44cc1a7ffd2e85bafb3634cdf7c874871b71/js/besogo.js
// @require    https://cdn.jsdelivr.net/gh/yewang/besogo@59cd44cc1a7ffd2e85bafb3634cdf7c874871b71/js/editor.js
// @require    https://cdn.jsdelivr.net/gh/yewang/besogo@59cd44cc1a7ffd2e85bafb3634cdf7c874871b71/js/gameRoot.js
// @require    https://cdn.jsdelivr.net/gh/yewang/besogo@59cd44cc1a7ffd2e85bafb3634cdf7c874871b71/js/svgUtil.js
// @require    https://cdn.jsdelivr.net/gh/yewang/besogo@59cd44cc1a7ffd2e85bafb3634cdf7c874871b71/js/parseSgf.js
// @require    https://cdn.jsdelivr.net/gh/yewang/besogo@59cd44cc1a7ffd2e85bafb3634cdf7c874871b71/js/loadSgf.js
// @require    https://cdn.jsdelivr.net/gh/yewang/besogo@59cd44cc1a7ffd2e85bafb3634cdf7c874871b71/js/saveSgf.js
// @require    https://cdn.jsdelivr.net/gh/yewang/besogo@59cd44cc1a7ffd2e85bafb3634cdf7c874871b71/js/boardDisplay.js
// @require    https://cdn.jsdelivr.net/gh/yewang/besogo@59cd44cc1a7ffd2e85bafb3634cdf7c874871b71/js/coord.js
// @require    https://cdn.jsdelivr.net/gh/yewang/besogo@59cd44cc1a7ffd2e85bafb3634cdf7c874871b71/js/toolPanel.js
// @require    https://cdn.jsdelivr.net/gh/yewang/besogo@59cd44cc1a7ffd2e85bafb3634cdf7c874871b71/js/filePanel.js
// @require    https://cdn.jsdelivr.net/gh/yewang/besogo@59cd44cc1a7ffd2e85bafb3634cdf7c874871b71/js/controlPanel.js
// @require    https://cdn.jsdelivr.net/gh/yewang/besogo@59cd44cc1a7ffd2e85bafb3634cdf7c874871b71/js/namesPanel.js
// @require    https://cdn.jsdelivr.net/gh/yewang/besogo@59cd44cc1a7ffd2e85bafb3634cdf7c874871b71/js/commentPanel.js
// @require    https://cdn.jsdelivr.net/gh/yewang/besogo@59cd44cc1a7ffd2e85bafb3634cdf7c874871b71/js/treePanel.js
// @resource    besogoCSS https://yewang.github.io/besogo/css/besogo.css
// @resource    boardCSS https://yewang.github.io/besogo/css/board-kibitz.css
// @grant      GM_addStyle
// @grant      GM_getResourceText
// @version 0.0.1.20210722182324
// @namespace https://greasyfork.org/users/796297
// @downloadURL https://update.greasyfork.org/scripts/429737/Popup%20SGF%20Display%20for%20Sensei%27s%20Library.user.js
// @updateURL https://update.greasyfork.org/scripts/429737/Popup%20SGF%20Display%20for%20Sensei%27s%20Library.meta.js
// ==/UserScript==
/*- The @grant directive is needed to work around a design change
    introduced in GM 1.0.   It restores the sandbox.
*/

//--- Use jQuery to add the form in a "popup" dialog.
GM_addStyle(GM_getResourceText('besogoCSS'))
GM_addStyle(GM_getResourceText('boardCSS'))
console.log('success')
function sgfDisplay(path) {
    $("body").append ( `
        <div id="gmPopupContainer">
            <button id="gmCloseDlgBtn" type="button">Close popup</button>
            <div class='besogo-editor' style="max-width: 140vh; height:70vh;" resize="fixed" panels="control+tool+tree" sgf=${path}> </div>
        </div>
    ` );
    besogo.autoInit()
    $("#gmCloseDlgBtn").click ( function () {
        $("#gmPopupContainer").remove();
    } );
}



//--- Use jQuery to activate the dialog buttons.
$('a').each(function() {
    let sgf = this.href
    if (sgf.endsWith('.sgf')) {
        this.href = ''
        this.onclick = () => {
           sgfDisplay(sgf)
           return false
        }
    }
})

//--- CSS styles make it work...
GM_addStyle ( `
     .besogo-tree {overflow:auto;}
     .besogo-control, .besogo-tool { justify-content: center; }
     #gmPopupContainer {
         position: fixed;
         top: 10%;
         left: 5%;
         width: 90%;
         max-width: 150vh;
         height: 75%;
         max-height: 85%;
         padding: 2em;
         background: powderblue;
         border: 3px double black;
         border-radius: 1ex;
         z-index: 777;
     }
     .besogo-control button, .besogo-tool button, .besogo-tool input { margin: 1px 2px}
     #gmPopupContainer #gmCloseDlgBtn{
         cursor: pointer;
         margin: 1em 1em 0;
         border: 1px outset buttonface;
     }
`
)
