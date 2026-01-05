/// ==UserScript==
// @name         Staging plugin injector
// @namespace    me
// @description  Replaces ssm-plugin with plugin from staging
// @include      /^https?://.*(sarenza|camper|ecco|globetrotter|vente-privee|vaola|gnlfootwear|laredoute|rubirosa|2sneakers|voegele-shoes|ertlrenz|thinkshoes|brandpoolshop|fly-london-shop|fly-london-outlet|softinos-shop|softinos-outlet|aurelien|assem|timberland|ancient-greek-sandals|thursdayboots).*$/
// @version     1.1
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/14143/Staging%20plugin%20injector.user.js
// @updateURL https://update.greasyfork.org/scripts/14143/Staging%20plugin%20injector.meta.js
// ==/UserScript==

var loaderContent = '';
var done = false;

function removeWhenExists(list, callback, who) {
    var interval;
    var timesUp = 20;

    function check() {
        for(var i = 0; i < list.length; i++) {
            if(document.getElementById(list[i])) {
                document.getElementById(list[i]).remove();
                list.splice(i,1);
            }
        }
        if (list.length === null || timesUp === 0) {
            clearInterval( interval );
            callback(who);
        } else {
            timesUp--;
        }
    }
    interval = setInterval( check, 100 );
}

function emptyElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    for(var i = 0; i < elements.length; i++) {
        elements[i].innerHTML = '';

    }
    /*while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }*/
}

function removeLoader() {
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; ++i) {
        if(scripts[i].getAttribute('src') !== null){
            if(scripts[i].getAttribute('src').indexOf("loader.js") > -1) {
                loaderContent = scripts[i].innerHTML;
                scripts[i].remove();
            }
        }
    }
}

function rebuild(who) {
    var s1 = document.createElement("script");
    s1.type = "text/javascript";
    switch(who) {
        case 'local': s1.src = "http://localhost:3000/assets/plugin/loader.js";
            break;
        case 'live': s1.src = "https://shoesize.me/assets/plugin/loader.js";
            break;
        case 'staging': s1.src = "https://staging01.shoesize.me/assets/plugin/loader.js";
            break;
        default: break;
    }
    s1.text = loaderContent;
    //s1.text  = "{  shopID: 1461,shoeID: '324519704', locale: 'de'}";
    document.getElementsByTagName('body')[0].appendChild(s1);
    var div = document.createElement('div');
    div.style.cssText = 'position:fixed;width:100%;height:40px;top:0px; font-size: 30px;z-index:100000;background:#fff;text-align:center;line-height: 40px; border: 1px solid black;';
    div.innerHTML = "Plugin loaded";

    // Prepend it
    document.body.insertBefore(div, document.body.firstChild);
}

function replaceSSM(add_new, who) {
    if(add_new) {
        document.getElementsByClassName('advice')[0].innerHTML += '<div class="ShoeSizeMe"></div>'; 
        rebuild(who);
    } else {
        removeLoader();
        emptyElementsByClass('ShoeSizeMe');
        removeWhenExists(['ShoeSizeMe', 'ShoeSizeMe_widget'], rebuild, who);   
    }
}

replaceSSM(false, 'staging');
