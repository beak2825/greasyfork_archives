// ==UserScript==
// @name         SNR Review
// @namespace    http://your.homepage/
// @version      1.41
// @description  SNR Pregled
// @author       Edin Mahmutović
// @match        http://213.161.2.101/graphs/lj_index.html?action=cmts*
// @match        http://213.161.2.101/graphs/index.html?action=cmts*
// @match        http://213.161.2.101/graphs/lj_index.html?query*
// @match        http://213.161.2.101/graphs/index.html?query*
// @match        http://213.161.2.101/graphs/real*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12597/SNR%20Review.user.js
// @updateURL https://update.greasyfork.org/scripts/12597/SNR%20Review.meta.js
// ==/UserScript==

var red = "Red:\n\n", yellow = "", itemRed, itemYellow, list, linktext, snr;
if (window.location.href.indexOf("http://213.161.2.101/graphs/real") > -1) {
    list = document.getElementsByTagName("TD");
} else {
    list = document.links;
}
for (var item in list) {
    if (item !== undefined) {
        linktext = list[item].textContent;
        if (linktext !== undefined) {
            snr = linktext.match(/[0-9\.]+(\s)dBmV/g);
            if (snr !== undefined && snr !== null) {
                snr = linktext.match(/[0-9\.]+/g);
                if (snr >= 30) {
                    list[item].style.color = "#00c853";  //zelena
                } else if (snr >= 25) {
                    list[item].style.color = "#ffa726";  //rumena
                    itemYellow = list[item-4].textContent;
                    yellow = yellow.concat(itemYellow+"....."+snr+" dBmV\n");
                } else if (snr > 0) {
                    itemRed = list[item-4].textContent;
                    if (itemRed.indexOf("Trdinov") > -1 || itemRed.indexOf("Grmace") > -1 ||
                        itemRed.indexOf("Krvavec") > -1 || itemRed.indexOf("Krim") > -1 || itemRed.indexOf("BAND 10G") > -1 ||
                        (itemRed.indexOf("Cable4/1-upstream2") && list[item-14] !== undefined && list[item-14].textContent.indexOf("KRIM")) > -1 ||
                        (itemRed.indexOf("Cable4/1-upstream3") && list[item-19] !== undefined && list[item-19].textContent.indexOf("KRIM")) > -1) {
                        if (snr >= 18) {
                            list[item].style.color = "#00c853";  //zelena
                        } else if (snr > 16)  {
                            list[item].style.color = "#ffa726";  //rumena
                            yellow = yellow.concat(itemRed+"....."+snr+" dBmV\n");
                        } else if (snr > 0)  {
                            list[item].style.color = "#f44336";  //rdeča
                            red = red.concat(itemRed+"....."+snr+" dBmV\n");
                        } else {
                            list[item].style.color = "#9e9e9e";  //siva
                        }
                    } else {
                        list[item].style.color = "#f44336";  //rdeča
                        red = red.concat(itemRed+"....."+snr+" dBmV\n");
                    }
                } else {
                    list[item].style.color = "#9e9e9e";  //siva
                }
            }
        }
    }
}
if (window.location.href.indexOf("http://213.161.2.101/graphs/lj_index.html?query=upstream0&host_id=0&search_description=Posici&action=search") > -1 ||
   window.location.href.indexOf("http://213.161.2.101/graphs/lj_index.html?query=interface&host_id=0&search_description=Posici&action=search") > -1) {
    setTimeout(function(){
        window.location.reload(1);
    }, 150000);
    red = red.concat("\nYellow:\n\n" + yellow);
    (function(){
        //document.location = 'data:text/attachment,' + encodeURIComponent(red);
        window.open('data:text/attachment,' + encodeURIComponent(red),'_blank');
    })();
}