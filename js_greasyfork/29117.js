// ==UserScript==
// @name         WME G2GMDM
// @name:es      WME G2GMDM - Vamoj pa Gaia
// @version      1.1
// @description  WME Go to GaiaMDM. Redirects to Gaia MDM page on current position by clicking on wme coordinates label.
// @description:es WME Go to GaiaMDM - Vamoj pa Gaia te lleva directito a la mijma posicion en el mapa de gaia pa que no tengas que hacer tantos clics puej.
// @author       abdielisai
// @include      https://www.waze.com/editor/*
// @include      https://www.waze.com/*/editor/*
// @include      https://beta.waze.com/*
// @exclude      https://www.waze.com/user/editor*
// @grant        none
// @license      GPLv3
// @namespace https://greasyfork.org/users/118132
// @downloadURL https://update.greasyfork.org/scripts/29117/WME%20G2GMDM.user.js
// @updateURL https://update.greasyfork.org/scripts/29117/WME%20G2GMDM.meta.js
// ==/UserScript==

(function() {

	//> We don't need the whole 
	//> @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
	//> just this function:
    function bootstrap(tries) {
        tries = tries || 1;

        if (window.W &&
            window.W.map &&
            window.W.model &&
            $) {
            init();
        } else if (tries < 1000) {
            setTimeout(function () {bootstrap(tries++);}, 200);
        }
    }

    bootstrap();

    function init(){

        //> Adds hiperlink element
        createLink();
        
        console.log("WME G2GMDM " + GM_info.script.version+" is running.");
    }

    //> Appends a link to permalinks section on status bar
    function createLink(){
        var $a = $("<a href='#' data-toggle='tooltip' title='Ir a Gaia'><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAINSURBVDhPnZPfS1NhGMcf6A8QgpIVpczN82vKCCyoLvpxWdRutMn5uTGhvJEoiIl0kxeDLOqiKBqSsKCrrIyCJhGlIl14IavAMFs4IU3BmIUz9+054w3GcKF94L047/t8v+f7Puc5VBVZ95Bih0ixukhxoiQ7+8TJJtCcTvLpX8lrgBrcZYJ2t6+SbKZI7vCIqipoVjf5LHiOX8SlW4MYHn+P/icjOBS7CpKjIMmaoGZjp6iuQLWDVNe+5j8Rx0xuHuX8LhYRS6RAfhukmNeFogLF6CPJwY1HI3g9vYJnk9+R/rCIpZVCySRfKMB/qgdU3zZHgXCtUJXREE5vP3oBw5lZJMe+4Vo6i97nMxiaXCgZ/FoDTncnQXtD66TpLUJVhi/8quZwF95+nMXSz3VkcnlcfjqNHl73x+fwYuoHQvF7oLpqBrJ50+347cE3pTe6vPuyjP6xHB5OLCC7mId0Ms4JwvMkRXcJVRmqtZ/8erH2yHmMZj4Li78UEe0dAPm4iaqVFIoN0OyE2+mag504m3iAgaFR9KVeosW4wmKeh0b7E8/JHlG9Aa2t29jkMckRvmsbd/yM23WQVwfvL/OXOiAq/0EwsoM0c4qaYm5cFjqgAA+RauuiYhOozjFq1AsU4CTNHWxi3BEnW0Ax71LwnJsgW0q1ZSS7nqOv8jXiYuc/0Ph3bop4xVMFRH8AgigQaceEwpQAAAAASUVORK5CYII=' width='20px' height='20px' align='left' hspace='2' vspace='2'></a>");
        $a[0].onclick = go2GMDM;
        $(".WazeControlPermalink").append($a);
    }

    //> Opens a new MDM window on current position
    function go2GMDM(){
        var link = $(".permalink")[0].href;
        //> Extracts coordinates from element inner text and encode them into base64
        window.open("http://gaia.inegi.org.mx/mdm6/?v="+btoa("lat:"+getQueryString(link, 'lat')+",lon:"+getQueryString(link,'lon')+",z:"+(parseInt(getQueryString(link,'zoom'))+8)));
    }

    //> Taken from WME Permalink to serveral Maps by AlexN-114
    function getQueryString(link, name){
        var pos = link.indexOf( name + '=' ) + name.length + 1;
        var len = link.substr(pos).indexOf('&');
        if (-1 == len) len = link.substr(pos).length;
        return link.substr(pos,len);
    }
})();
