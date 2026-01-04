// ==UserScript==
// @name        NUMA/NMaps Enhancer
// @namespace   iamMG
// @version     2.0
// @description Improves NUMA website
// @author      iamMG
// @match       http*://www.nmaps.net/*
// @match       http*://numa-notdot-net.appspot.com/*
// @match       http*://myversion-dot-nmapsdotnet.appspot.com/*
// @grant       GM_setClipboard
// @grant       GM.openInTab
// @run-at		document-end
// @copyright 	2019, iamMG (https://openuserjs.org//users/iamMG)
// @license 	MIT
// @downloadURL https://update.greasyfork.org/scripts/375126/NUMANMaps%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/375126/NUMANMaps%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function buttonMaker(text, type, url){
        var button = document.createElement("BUTTON");
        Object.assign(button.style,{cursor: type, backgroundColor: "#fcad3d", borderStyle: "solid", borderColor: "#363332", borderWidth: "2px", color: "#000000", font: "12px Verdana, Tahoma, sans-serif", margin: "4px 4px 4px 0px", padding: "1px 7px 2px 7px", cursor: "copy"});
        button.appendChild(document.createTextNode(text));
		if (type =='pointer') button.addEventListener('click', function(e){ window.open(url, "", "", false);}, false)
		else {
			button.addEventListener('click', function(e){
				var temp = document.createElement("textarea");
				document.body.appendChild(temp);
				temp.innerText = url;
				temp.select();
				document.execCommand('copy');
				temp.parentElement.removeChild(temp);
			}, false)
		}
        return button;
    }
	var datedetails = document.getElementsByClassName('attribs'), mapnum = '', title = document.getElementsByClassName('section'), times = title.length, data = document.getElementsByTagName('textarea');
    if (!isNaN(parseInt(window.location.pathname.replace('/','')))) {
		mapnum = window.location.pathname.replace('/','');
		times = 1;
	}

	for (var h=0; h<datedetails.length; h++){
        Object.assign(datedetails[h].style,{backgroundImage: "none", width: "140px", fontStyle: "bold", font:"12px Tahoma, sans-serif"});
    }

    for (var j=0; j<data.length-2; j++){
        data[j].parentElement.appendChild(buttonMaker("☍ copy data",'copy', data[j].innerHTML));
    }

	for (var i=0; i<times; i++){
            var author = title[i].getElementsByClassName('formtable')[0].getElementsByTagName('td')[0].innerText;
		    if (isNaN(parseInt(window.location.pathname.replace('/','')))) {
				mapnum = title[i].getElementsByClassName('body')[0].childNodes[1].getAttribute('href').replace('/', '');
				title[i].appendChild(buttonMaker("open in new tab ⬈", 'pointer', 'http://www.nmaps.net/'+ mapnum));
			}
		    title[i].appendChild(buttonMaker("☍ copy id",'copy', mapnum));
            title[i].appendChild(buttonMaker("view on n.infunity.com ⬈", 'pointer', 'http://n.infunity.com/numa_speedrun.php?mapID=' + mapnum));
            title[i].appendChild(buttonMaker("5 random maps of author ⬈",'pointer', 'http://www.nmaps.net/browse?q=author%3A' + author + '&start=0&count=5&random=true'));

        };

})();