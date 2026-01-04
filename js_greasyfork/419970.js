// ==UserScript==
// @name         All user Donald trump
// @namespace    https://twitter.com/_sotaatos
// @version      0.1
// @description  Change Twitter user icon to Trump
// @author       @_sotaatos
// @match        http*://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419970/All%20user%20Donald%20trump.user.js
// @updateURL https://update.greasyfork.org/scripts/419970/All%20user%20Donald%20trump.meta.js
// ==/UserScript==

let iconTag = "css-1dbjc4n r-sdzlij r-1p0dtai r-1mlwlqe r-1d2f490 r-1udh08x r-u8s1d r-zchlnj r-ipm5af r-417010";
let iconImageTag = "css-1dbjc4n r-1niwhzg r-vvn4in r-u6sd8q r-4gszlv r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-13qz1uu r-1wyyakw";
let trumpStyle = "background-image: url(\"https://pbs.twimg.com/media/ErRVzBwUcAAPb5G?format=jpg\");";

function changeTrumpIcon(){
    var elements = document.getElementsByClassName(iconTag);
    for (var i of elements){
        var icon = i.getElementsByClassName(iconImageTag) ;
        console.log(icon[0].style.cssText);
        icon[0].style.cssText = trumpStyle;
        console.log(icon[0].style);
    }

    //return elements;
}


(function() {
    setInterval(changeTrumpIcon, 500);
})();