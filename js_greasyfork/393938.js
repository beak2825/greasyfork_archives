// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://m.pufei.net/*
// @grant        none
// @require http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/393938/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/393938/New%20Userscript.meta.js
// ==/UserScript==
function find_element_by_xpath(STR_XPATH) {
    var xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
    var xnodes = [];
    var xres;
    while (xres = xresult.iterateNext()) {
        xnodes.push(xres);
    }
    return xnodes;
}
(function() {
    'use strict';
    //移出广告
    function removeAd(){
        //#tcFhKHfzFa
        //document.querySelector("#tcFhKHfz1_1")
        ////*[@id="tcFhKHfz1_1"]
        //#ssBPYfcP1_1 body > div.___qnd > div:nth-child(3) body > iframe
        ////*[@id="WHzszYPkFa"]//*[@id="kob4en6ck72"]body > iframe
        //<img width="100%" src="http://res.img.220012.net/images/2019/11/23/02/48d8f7cde5.jpg/0" style="display: inline-block;">
        $("body > iframe:nth-child(9)").remove();
        //$("body > div:nth-child(6)").remove();

        //#manga
        let a=find_element_by_xpath("//*[@id=\"tcFhKHfz1_1\"]");
        console.log(a);
        a.innerHTML="";
    }
    function addAllManHua(){
         $("#manga>img").remove();
        for (let i=1;i<window._cuRs.length;i++){
            $("#manga").append("<img width=\"100%\" src=\"http://res.img.220012.net/"+window._cuRs[i]+"\" style=\"display: inline-block;\">")
        }
    }
    removeAd();
    addAllManHua()
    console.log("sssssssssss",window._cuRs)

})();