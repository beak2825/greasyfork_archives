// ==UserScript==
// @name         dd-wrt mac to Hostnames
// @namespace    http://10.0.0.1/
// @namespace    http:/192.168.1.1/
// @version      0.1
// @description  DD-WRT Match MAC Addresses and then display custom Hostnames
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-alpha1/jquery.js
// @author       RickZabel '2022
// @match        http://10.0.0.1/*
// @match        http://192.168.1.1/*
// @grant        none
// @run-at       document-start
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/444336/dd-wrt%20mac%20to%20Hostnames.user.js
// @updateURL https://update.greasyfork.org/scripts/444336/dd-wrt%20mac%20to%20Hostnames.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function ddwwrt_bootstrap() {

        //if AddToMACAddressOrReplaceRadioname is set to 0 the specified Hostname will be added to the mac field.
        //If it is set to 1 the RadioName will be filled in with the specified Hostname.
        var AddToMACAddressOrReplaceRadioname = 1;

        // Both the top level and the /Info.htm pages mask part of the MAC address if this is set to 1,
        // we will search for partial matches and replace the mac or radio name according to the setting ReplaceMACAddressOrRadioname
        var ReplacePartialMACAddress = 1;

        // do not edit the next two lines.
        var MacList = [];
        var Hostname = [];

        //fill in your MAC Addresses and Hostnames to the same numbered MacList[##] and Hostname[##], and if you need to add more devices add another pair using the next higher number.
        //do not skip numbers
        //hostnemas and macs need to be properly escaped or they will prevent the script from running. An example would be Hostname[0]='Rick\'s";, It is much easier not using special characters in your text such as single, double quote, punctuation, and symbols.
        //I also recommend not having spaces in your Hostname because ddwrt will wrap the Hostname to the next line.


        MacList[0]='98:70:31:c3:81:46'; Hostname[0]='Tablet1';
        MacList[1]='a3:bc:04:01:f0:9f'; Hostname[1]='Desktop2';
        MacList[2]='b5:d3:19:f4:ef:e2'; Hostname[2]='Laptop1';
        MacList[3]='c3:dd:b1:68:ea:f8'; Hostname[3]='Laptop2';
        MacList[4]='8f:be:3d:af:02:2d'; Hostname[4]='Iphone';
        MacList[5]='5f:0e:cc:2a:09:c5'; Hostname[5]='AndroidPhone';
        MacList[6]='2d:73:a5:f6:45:c7'; Hostname[6]='AmazonFireStick';
        MacList[7]='88:93:f1:ba:5e:e3'; Hostname[7]='Alexea1';
        MacList[8]='8a:3f:a4:12:ac:4d'; Hostname[8]='Alexea2';
        MacList[9]='f0:f4:84:19:0f:34'; Hostname[9]='RingDoorbell';

        //--------------------------------------------------------------------//
        //-------------------Do not edit the code past here-------------------//
        //--------------------------------------------------------------------//


        //wireless list code
        var macs = document.querySelectorAll('#wireless_table > tbody > tr > td:first-child');
        for(var i = 0; i< macs.length; i++){
            var expr = macs[i].innerText;
            for (var i2 = 0; i2 < MacList.length; i2++) {
                var result2 = false;
                if (expr.length === 17) {
                    var result = expr.substring(0,12);
                    if (result === "xx:xx:xx:xx:"){
                        result2 = expr.substring(12,17);
                    }
                }
                if(expr === MacList[i2] || (MacList[i2].indexOf(result2) > 0 && ReplacePartialMACAddress==1)) {
                    console.log( expr + " " + result2 + " " + i + " " + i2 + " " + Hostname[i2]);
                    if(AddToMACAddressOrReplaceRadioname == 0) {
                        macs[i].textContent = Hostname[i2] + " " + macs[i].textContent;
                    } else {
                        macs[i].nextSibling.textContent = Hostname[i2];
                    }
                    break;
                }
            }
        }
        //end of wireless list code

        //Active Clients code
        macs = document.querySelectorAll('#active_clients_table > tbody > tr > td:first-child');
        for( i = 0; i< macs.length; i++){
            expr = macs[i].nextSibling.nextSibling.textContent;
            for ( i2 = 0; i2 < MacList.length; i2++) {
                result2 = false;
                if (expr.length === 17) {
                    result = expr.substring(0,12);
                    if (result === "xx:xx:xx:xx:"){
                        result2 = expr.substring(12,17);
                    }
                }
                if(expr === MacList[i2] || (MacList[i2].indexOf(result2) > 0 && ReplacePartialMACAddress==1)) {
                    console.log( expr + " " + result2 + " " + i + " " + i2 + " " + Hostname[i2]);
                    macs[i].textContent = Hostname[i2];
                    break;
                }
            }
        }
        //end of Active Clients code

        // end of ddwwrt_bootstrap
    }
    setInterval(ddwwrt_bootstrap, 25);
    //setTimeout(ddwwrt_bootstrap, 3000);
})();
