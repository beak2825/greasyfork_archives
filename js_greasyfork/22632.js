// ==UserScript==
// @name         = STN = TradeOffer Helper
// @namespace    http://stn.tf
// @version      0.2.3
// @description  Trying to make your TradeOffer Experience better!
// @author       spyfly
// @match        https://steamcommunity.com/tradeoffer/new/*
// @match        *backpack.tf/stats/*
// @match        *backpack.tf/classifieds*
// @match        *stntrading.eu/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/22632/%3D%20STN%20%3D%20TradeOffer%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/22632/%3D%20STN%20%3D%20TradeOffer%20Helper.meta.js
// ==/UserScript==

(function() {
        var $_GET = {};
    if(document.location.toString().indexOf('?') !== -1) {
        var query = document.location
                   .toString()
                   // get the query string
                   .replace(/^.*?\?/, '')
                   // and remove any existing hash string (thanks, @vrijdenker)
                   .replace(/#.*$/, '')
                   .split('&');

        for(var i=0, l=query.length; i<l; i++) {
            var aux = decodeURIComponent(query[i]).split('=');
            $_GET[aux[0]] = aux[1];
        }
    }
    var location = window.location.toString();
    if (location.includes("steamcommunity.com/tradeoffer/new/") === true){
    function simulate(element, eventName)
{
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers)
    {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent)
    {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents')
        {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
        else
        {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
            options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    }
    else
    {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
}

function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
}

var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
};
var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
};
    var botids = ["76561198171369482", "76561198171381246", "76561198291327810", "76561198306870587", "76561198309811425", "76561198308976829", "76561198309739563", "76561198309980175", "76561198309246958"];
    if (botids.includes(g_ulTradePartnerSteamID) === true){
    var body = document.getElementsByClassName('responsive_page_frame')[0];
    body.style.backgroundImage = 'url(https://stntrading.eu/background.png)';
    body.style.color = 'white';
    var h2 = document.getElementsByTagName('h2')[0]; 
    h2.style.color = 'white';
    h2.style.fontWeight = 'bold';
    }
    //get the 'for_item' query parameter
    var item = $_GET['for_item'];
    var name = $_GET["sell_item"];
    if (item){
        simulate(document.getElementById("inventory_select_their_inventory"), "click");
            var done = false;
    var i = 0;
    while (i !== 20){
    i++;
        setTimeout(function(){
        if (done == false){
            try {
    simulate(document.getElementById("item" + item), "dblclick");
    simulate(document.getElementById("inventory_select_your_inventory"), "click");
    done = true;
    } catch (ex){}}} , i*500);}
    }
    
    if (name){
        var found = false;
        var itemid;
        var steamid = g_steamID;
        GM_xmlhttpRequest({
  method: "GET",
  url: 'https://steamcommunity.com/profiles/' + steamid + '/inventory/json/440/2',
  onload: function(response) {
                 var data = JSON.parse(response.responseText);
           var ids = data["rgInventory"];
           var items = data["rgDescriptions"];
            for (var key in ids) {
                var obj = ids[key];
                var invid = obj["classid"] + "_" + obj["instanceid"];
                var marketname = items[invid]["market_hash_name"];
                if ((marketname == name || marketname == "The "+name) && items[invid]["tradable"] == 1){
                    found = true;
                    itemid = key;
                    break;
                }
            }
        if (found == true){
                    var done = false;
                    var i = 0;
                    while (i !== 20){
                    i++;
                    setTimeout(function(){
                        if (done == false){
                            try {
                                simulate(document.getElementById("item440_2_" + itemid), "dblclick");
                                done = true;
                   } catch (ex){}}} , i*500);}
        }
  }
});
    }
        
    } else if (location.includes("stntrading.eu") === true){ 
        document.getElementById("plugin").innerHTML = true;
    } else {
        var i = 0;
        var listings = document.getElementsByClassName("media-list")[1].getElementsByTagName("a");
        for (var key in listings) {
            var href = listings[key].href;
            if (href) {
            if (href.includes("steamcommunity.com") == true){
                var itemname = document.getElementsByClassName("media-list")[1].getElementsByTagName("h5")[i].innerHTML.replace(/<\/?[^>]+(>|$)/g, "").substring(1);
                i++;
                document.getElementsByClassName("media-list")[1].getElementsByTagName("a")[key].href= href + "&sell_item=" + itemname;
            }
            }
    }
    }
})();