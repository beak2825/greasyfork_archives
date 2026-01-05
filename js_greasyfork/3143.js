// ==UserScript==
// @name        TradeMe Address Check
// @namespace   https://greasyfork.org/scripts/3143-address-check
// @version     0.34
// @description Add Link To Check An Address
// @include     https://www.trademe.co.nz/MyTradeMe/Delivery/SendDeliveryAddress.aspx*
// @include     https://www.trademe.co.nz/MyTradeMe/Sell/Sold.aspx*
// @copyright   public domain
// @author      Godfrey Livingstone godfrey@satelliteshop.co.nz
// @run-at	document-end
// @require	https://greasyfork.org/scripts/2722-gm-config-mod-library/code/gm_config_mod%20library.js?version=7536
// @grant	GM_addStyle
// @grant	GM_getValue
// @grant	GM_log
// @grant	GM_registerMenuCommand
// @grant	GM_setValue
// @grant	GM_xmlhttpRequest
// @grant	GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/3143/TradeMe%20Address%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/3143/TradeMe%20Address%20Check.meta.js
// ==/UserScript==
// v0.31:	Remove all jquery so that it works with GM 2.0 aand TM 3.8
// v0.32:	Fix for TradeMe Changes
// v0.33:	Add UserName to URL
// v0.34:	Fix for Chrome UserName added to URL does not work for chrome


if (window.top != window.self) { //-- Don't run on frames or iframes
    return;
}

// replace trademe's JS error handler
window.onerror=function(msg, url, linenumber){
    console.log('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return true;
};

//
// Delivery Address
// http://www.trademe.co.nz/MyTradeMe/Delivery/SendDeliveryAddress.aspx?asid=<purchase id>
//
// Delivery Address
// Phone Number
// Message

//
// Purchase Summary
// http://www.trademe.co.nz/MyTradeMe/PurchaseSummary.aspx?asid=<purchase id>&isBuyer=false
//
// Shipping Option

//
// Listing
// http://www.trademe.co.nz/Browse/Listing.aspx?id=<Listing ID>
//
// Title
// Photo Link

//
// Photo
// http://images.trademe.co.nz/photoserver/tq/263983945.jpg
//
// encodeURIComponent() will not encode: ~!*()'
// separate function to add '!' to encodeURIComponent
// removes hard returns
// lastly replaces spaces with '+'
function encodeURIfix(str) {
    return encodeURIComponent(str).replace(/!/g,'%21')
                                  .replace(/%0A/g,'%20')
                                  .replace(/%20/g,'+');
}

// Prototype for the callback function - remember which purchase
Function.prototype.bind = function (thisObject) {
    var method, oldargs, newargs;
    method = this;
    oldargs = [].slice.call(arguments, 1);
    return function () {
        newargs = [].slice.call(arguments);
        return method.apply(thisObject, oldargs.concat(newargs));
    };
};

function checkAddressLink(doc, delivery_address){
    var add_html, add_array, add_str, encoded_add, namestr, encoded_name, ph, encoded_ph, message, encoded_message, encoded_addassent, link_url;

    add_html = delivery_address.innerHTML;
    add_array = add_html.split("<br>");
    add_str = add_array.slice(1, -1).join(', ');
    encoded_add = encodeURIfix(add_str);
    namestr = add_array[0];
    encoded_name = encodeURIfix(namestr);

    ph = doc.getElementById("PhoneNumber");
    encoded_ph = "";
    if (ph) {
        encoded_ph = encodeURIfix(ph.innerHTML);
    }

    message = doc.getElementById("Message");
    encoded_message = "";
    if (message){
        encoded_message = encodeURIfix(message.innerHTML);
    }

    encoded_addassent = encodeURIfix(add_html);

    link_url = "http://" + userName + ".addresscheck.co.nz/?address=";
    link_url = link_url + encoded_add + '&name=' + encoded_name + '&phone=' + encoded_ph + '&address_as_sent=' + encoded_addassent + '&message=' + encoded_message;

    return link_url;
}

function addSoldDeliveryCheck(dL) {
    var doc, delivery_address, link_url, add_image, add_link, newTr, td_start, td_end;
    //var purchase_summary_url = 'http://www.trademe.co.nz/MyTradeMe/PurchaseSummary.aspx?asid=' + pReference + '&isBuyer=false';

    //turn the response text into a dom object
    doc = document.implementation.createHTMLDocument("delivery address");
    doc.documentElement.innerHTML = dL.target.responseText;

    delivery_address = doc.getElementById("DeliveryAddress");

    if ( delivery_address ) {

        link_url = checkAddressLink(doc, delivery_address);

        add_image = '<a id="AddressImageCheckLink" target="_blank" href="' + link_url + '"><img  width="18" height="17" alt="" style="vertical-align: middle; margin-right:5px; border:0;"src="/images/1pixel.gif"></a>';
        add_link =  '<a id="AddressCheckLink" target="_blank" href="' + link_url + '"> * Check address * </a>';

        newTr = document.createElement("tr");

        td_start = '<td style="vertical-align: middle;"></td><td style="color: #666;" align="left"><small>';
        // td_start = '<td style="vertical-align: middle;"><img alt="" src="/images/my_trademe/tick2.gif"></td><td style="color: #666;" align="left"><small>';
        td_end = '</small></td>';

        newTr.innerHTML = td_start + add_link + td_end;
        this.deliveryDetails.parentNode.parentNode.parentNode.parentNode.appendChild(newTr);

    }
    doc.parentNode.removeChild(doc);
}

// Get userName
var USERNAME_STORAGE_ITEM = "trademeusername";

var userName = sessionStorage.getItem(USERNAME_STORAGE_ITEM);
if (!userName || userName==="") {
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://www.trademe.co.nz/MyTradeMe/Default.aspx",
        onload: function(data) {
            userName = $('#MemberLink', data.responseText).text();
            sessionStorage.setItem(USERNAME_STORAGE_ITEM, userName);
            }
    });
}

if (!userName || userName==="") {
    userName = "www"
    sessionStorage.setItem(USERNAME_STORAGE_ITEM, userName);
}

// Are we on the SendDeliveryAddress page?
var delivery_address, link_url, add_image, add_link, newDiv;

delivery_address = document.getElementById("DeliveryAddress");
if ( delivery_address ) {
    link_url = checkAddressLink(document, delivery_address);
    add_image = '<a id="AddressImageCheckLink" target="_blank" href="' + link_url + '"><img  width="18" height="17" alt="" style="vertical-align: middle; margin-right:5px; border:0;"src="/images/1pixel.gif"></a>';
    add_link =  '<a id="AddressCheckLink" target="_blank" href="' + link_url + '">Check address</a>';
    newDiv = document.createElement("div");
    newDiv.setAttribute("style", "font-size: 12px; margin-top: 10px; padding: 0;");

    newDiv.innerHTML = add_image + add_link;
    delivery_address.parentNode.appendChild(newDiv);
}

// Are we on the Sold Page and have any 'Delivery address' details been provided?
var frm, i, j, l, m, els, els2, el, el2, pReference, oReq, auction_array;

frm = document.getElementById("form1");
if (frm) {
    els = frm.getElementsByTagName("a");
    for ( i = 0, l = els.length; i < l; i++) {
        el = els[i];
        if (el.innerHTML === 'Delivery address') {
           pReference = el.href.replace(/.*asid=/i, '');
           oReq = new XMLHttpRequest();
           oReq.open("GET", el.href);
           // register the event handler
           oReq.addEventListener("load", addSoldDeliveryCheck.bind({
                deliveryDetails: el
            }), true);
          oReq.send();
        }
    }
    els2 = frm.getElementsByTagName("dt");
    for ( j = 0, m = els2.length; j < m; j++) {
        el2 = els2[j];
        if (el2.innerHTML === "Listing #:") {
            auction_array = el2.nextSibling.innerHTML.split(";");
            console.log(auction_array[0]);
            console.log(auction_array[1]);
            el2.nextSibling.innerHTML = auction_array[0] + ';<a target="_blank" href="http://www.trademe.co.nz/Browse/Listing.aspx?id=' + auction_array[1] + '">' + auction_array[1] + '</a>';
        }
    }
}
