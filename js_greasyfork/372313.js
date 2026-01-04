// ==UserScript==
// @name         Munzee v4 Icons
// @namespace    Munzee4.0Icons
// @version      1.2
// @description  Changes icons on most of Munzee's Website to the icons from Munzee v4
// @author       MOBlox
// @match        https://*.munzee.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372313/Munzee%20v4%20Icons.user.js
// @updateURL https://update.greasyfork.org/scripts/372313/Munzee%20v4%20Icons.meta.js
// ==/UserScript==

window.Munzeev4IconPhysical = ['owned','captured','cyclops','firepegasus','cherub','ogre','chimera'];
(function() {
    'use strict';
    if(location.href.includes('special'))return;
    var l = Munzeev4IconPhysical;
    var x = $('img');
    for(var i = 0;i < x.length;i++){
        if(x[i].src.startsWith('https://munzee.global.ssl.fastly.net/images/pins/')){
            x[i].src = x[i].src.replace('/images/pins/','/images/v4pins/').replace(/\/v4pins\/svg\/(.+)\.svg/g,'/v4pins/$1.png');
            for(var j=0;j<l.length;j++){
                x[i].src = x[i].src.replace('v4pins/' + l[j] + '.png','v4pins/' + l[j] + '_physical.png');
            }
        }
    }
    if(location.href.toString().includes('map')){
        getImageUrl = eval('var xxx = ' + getImageUrl.toString().replace('getImageUrl(){','function(){').replace('return iconurl;','return tov4(iconurl);') + ';xxx;');
    }
})();
window.tov4 = function(i){
    var l = Munzeev4IconPhysical;
    i=i.replace('/pins/','/v4pins/');
    for(var j=0;j<l.length;j++){
        i = i.replace('v4pins/' + l[j] + '.png','v4pins/' + l[j] + '_physical.png');
    }
    return i
}
setInterval(function(){
    if(location.href.includes('special'))return;
    var x = $('img');
    for(var i = 0;i < x.length;i++){
        if(x[i].src.startsWith('https://munzee.global.ssl.fastly.net/images/v4pins/')){
            x[i].src = x[i].src.replace(/v4pins\/(.+)_virtual.png/,'v4pins/$1_physicalx.png').replace(/v4pins\/(.+)_physical.png/,'v4pins/$1_virtual.png').replace(/v4pins\/(.+)_physicalx.png/,'v4pins/$1_physical.png');
        }
    }
},1000);