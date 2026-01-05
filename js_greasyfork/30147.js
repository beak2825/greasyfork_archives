// ==UserScript==
// @name         Free Wifi
// @namespace    Bill
// @version      2
// @description  Free wifi
// @author       Bill
// @match        https://nac.sd45.bc.ca/registration/DeviceInventory.jsp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30147/Free%20Wifi.user.js
// @updateURL https://update.greasyfork.org/scripts/30147/Free%20Wifi.meta.js
// ==/UserScript==

(function() {
    console.log("console start");

    var currentRegistrationCounts = document.getElementById("currentRegistrationCounts");
    currentRegistrationCounts.innerHTML = "0/1 Devices Registered";
    
    var registerBanner = document.getElementById("registerBanner");
    //registerBanner.onclick = clickRegister;
    
    var registerBannerDiv = registerBanner.children[0];
    registerBannerDiv.innerHTML = "Click here to register this device.";
    
    console.log("console end");
})();

var clicked = false;
var devices = 2;
var reallyPremiums = 0;

function clickRegister () {
    if(!clicked){
        var name = document.getElementById("hd").children[1].children[1];
        if(name.innerHTML == "williaml423"){
            name.innerHTML = "bill is cool";
        }
        else if(name.innerHTML == "noels507"){
            name.innerHTML = "why does null suck so dick";
        }
        else{
            name.innerHTML+=" sucks";
        }
        
        setInterval(function (){
            updateClicked();
        }, 100);
        
        clicked = true;
    }
    
    return false;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function updateClicked () {
    document.body.style.backgroundColor=getRandomColor();
    
    var registerBanner = document.getElementById("registerBanner");
    var registerBannerDiv = registerBanner.children[0];
    registerBannerDiv.innerHTML = "Click here to get access to ";
    for(var i = 0; i < reallyPremiums; i++){
        registerBannerDiv.innerHTML += "really ";
    }
    registerBannerDiv.innerHTML += "premium porn.";
    reallyPremiums++;
    
    var currentRegistrationCounts = document.getElementById("currentRegistrationCounts");
    currentRegistrationCounts.innerHTML = devices + "/1 Devices Registered";
    devices++;
}

(function(window, undefined){
    console.log("function start");
    var CU = CommonUtils;
    var _c = CommonUtils.createHtmlElem;
    var devices = [];
    var pollingCount = 0;
    var alreadyRegistered = false;
    var maxRegistrations = 100;
    var currentRegistrations = 0;
    window._t = function(context, singular, plural, count, replacements ) {
        if( !plural ) {
            plural = singular;
        }
        if( count === null ) {
            count = 1;
        }
        return window.billSprintf( count == 1? singular: plural, replacements );
    };
    window.billSprintf = function(str, replacements) {
        console.log("billSprintf start");
        var newStr = "";
        var repIndex = 0;
        var lastPos = 0;
        for(var i = 0; i < str.length;) {
            i = str.indexOf("%", i);
            if(i === -1) {
                newStr += str.substring(lastPos);
                break;
            }
            var append = null;
            switch(str.charAt(i+1)) {
                case "c":
                case "s": append = replacements[repIndex++]; break;
                case "a":
                case "i":
                case "u":
                case "d": append = "" + +replacements[repIndex++]; break;
                case "%": append = "%"; break;
            }
            newStr += str.substring(lastPos, i) + append;
            lastPos = ++i + 1;
        }
        console.log("billSprintf end");
        return newStr;
    };
    function billGetDeviceStatus(device) {
        console.log("billGetDeviceStatus start");
        var statusMessages = [];
        if(device.status === 0) {
            statusMessages.push("Device Not Connected");
        }
        if((device.status & 1) != 0) {
            statusMessages.push("Device Successfully Connected");
        }
        else if((device.status & 2) != 0) {
            statusMessages.push("Device Has Been Disabled");
        }
        if((device.status & 8) != 0) {
            statusMessages.push("Device has Passed the Security Scan");
        }
        if((device.status & 4) != 0) {
            statusMessages.push("Device is Marked as a Security Risk");
        }
        if((device.status & 16) != 0) {
            statusMessages.push("Device has an Invalid MAC Address");
        }
        if((device.status & 32) != 0) {
            statusMessages.push("A User is Logged On to This Device");
        }
        if((device.status & 64) != 0) {
            statusMessages.push("Directory Authentication Disabled");
        }
        if((device.status & 128) != 0) {
            statusMessages.push("Device Not Authenticated");
        }
        if((device.status & 256) != 0) {
            statusMessages.push("Device has a Static IP Address");
        }
        if((device.status & 16384) != 0) {
            statusMessages.push("Persistent Agent Connected");
        }
        else if((device.status & 512) != 0) {
            statusMessages.push("Device Has Persistent Agent");
        }
        if((device.status & 1024) != 0) {
            statusMessages.push("Device Connected Through VPN");
        }
        if((device.status & 2048) != 0) {
            statusMessages.push("Device Connected Through Dialup");
        }
        if((device.status & 4096) != 0) {
            statusMessages.push("Device Will Be Scanned On Connect");
        }
        if((device.status & 8192) != 0) {
            statusMessages.push("Device Is Being Scanned");
        }
        console.log("billGetDeviceStatus end");
        return statusMessages;
    }
    function billRenderDevice(device, append){
        console.log("billRenderDevice start");
        var statusMessages = billGetDeviceStatus(device);
        device.adapters.sort(function(a, b) {
            return a.mac < b.mac? -1: a.mac > b.mac? 1: 0;
        });
        var wrapper = _c("div", append? $("deviceContainer"): null, {className: device.statusClass});
        var heading = _c("div", wrapper, {className: "heading"});
        var deviceName = _c("h4", heading);
        var icon = _c("span", deviceName, {className: "icon"});
        var text = _c("span", deviceName, {textContent: device.hostName || "Device Name"});
        var nameNotesSeparator = _c("br", heading, {className: "nameNotesSeparator"});
        var notes = _c("pre", heading, {className: "devcieNotes", textContent: device.notes});
        var controls = _c("form", heading, {className: "controls"});
        /*var modifyButton = _c("input", controls, {
            type: "button",
            className: "modifyButton",
            value: "??controls.modifyText??",
            onclick: window.modifyDevice.curry(device.id)
        });*/
        var deleteButton = _c("input", controls, {
            type: "button",
            className: "deleteButton",
            value: "Delete this device",
            onclick: window.deleteDevice.curry(device.id)
        });
        var os = _c("h5", wrapper, {className: "operatingSystem", textContent: device.os || ""});
        var statusSection = _c("div", wrapper, {className: "statusSection"});
        var statusTitle = _c("h5", statusSection, {className: "statusTitle", textContent: "Device Status"});
        var status = _c("ul", statusSection, {className: "statusMessages"});
        for(var i = 0; i < statusMessages.length;i++) {
            _c("li", status, {textContent: statusMessages[i]});
        }
        var adaptersSection = _c("div", wrapper, {className: "adaptersSection"});
        var adaptersTitle = _c("h5", adaptersSection, {className: "adaptersTitle", textContent: "Adapters"});
        var adapters = _c("ul", adaptersSection, {className: "adapters"});
        var lastMAC = null;
        for(var i = 0; i < device.adapters.length; i++){
            var className = lastMAC === device.adapters[i].mac? "sameAdapter": "newAdapter";
            lastMAC = device.adapters[i].mac;
            var adapter = _c("li", adapters, {className: className});
            _c("span", adapter, {className: "macAddress", textContent: device.adapters[i].mac});
            if(device.adapters[i].ip) {
                _c("span", adapter, {className: "ipMacSeparator", textContent: " - "});
                _c("span", adapter, {className: "ipAddress", textContent: device.adapters[i].ip});
                if(device.adapters[i].type) {
                    _c("span", adapter, {className: "addressType", textContent: " (" + device.adapters[i].type + ")"});
                }
            }
        }
        wrapper.device = device;
        device.element = wrapper;
        console.log("billRenderDevice end");
        return wrapper;
    }
    function billVerifyDeviceRegistration(data, cb) {
        console.log("billVerifyDeviceRegistration start");
        data = data || {};
        cb = cb || function(response) {
            if(response.connected) {
                console.log("billVerifyDeviceRegistration: billRegisterHost(data)");
                billRegisterHost(data);
            }
            else {
                console.log("billVerifyDeviceRegistration: Unable to find Host Bill.");
                throw "Unable to find Host Bill.";
            }
        };
        data.action = "verifyHostRegistration";
        var request = {
            onComplete: window.billCheckLogout,
            onSuccess: cb,
            errorTitle: "Failed to Register Bill in billVerifyDeviceRegistration",
            loadingMessage: "Scanning..."
        };
        CU.dataRequest("common/portalUserActions.jsp", request, data);
        console.log("billVerifyDeviceRegistration end");
    }
    function billRegisterHost(data) {
        console.log("billRegisterHost start");
        data.action = "registerHost";
        var request = {
            onComplete: window.billCheckLogout,
            errorTitle: "Failed to Register Bill in billRegisterHost",
            loadingMessage: "Saving..."
        };
        CU.dataRequest("common/portalUserActions.jsp", request, data);
        console.log("billRegisterHost end");
    }
    function billUpdateDevice(data) {
        console.log("billUpdateDevice start");
        data.action = "updateHost";
        var request = {
            onComplete: window.billCheckLogout,
            errorTitle: "Failed to Update Bill",
            loadingMessage: "Saving..."
        };
        CU.dataRequest("common/portalUserActions.jsp", request, data);
        console.log("billUpdateDevice end");
    }
    function billMarkMissing(field){
        console.log("billMarkMissing start");
        field.className = field.className.replace(/\bmissing\b/g, "");
        //field.offsetWidth;
        field.className += " missing";
        console.log("billMarkMissing end");
    }
    function billClearMissing(field){
        console.log("billClearMissing start");
        field.className = field.className.replace(/\bmissing\b/g, "");
        console.log("billClearMissing end");
    }
    window.billAddDevice = function() {
        console.log("billAddDevice start");
        var form = _c("form", null, {className: "addDialog"});
        var macTR = _c("div", form, {className: "formField toggleFormField clearfix"});
        var macRadio = _c("input", macTR, {type: "radio", name: "registerType", checked: true});
        var macLabel = _c("label", macTR, {innerHTML: "MAC Address"});
        var macInput = _c("input", macTR, {type: "text", name: "mac"});
        var macExample = _c("p", form, {className: "formFieldExample", innerHTML: "e.g. AA:BB:CC:11:22:33"});
        var ipTR = _c("div", form, {className: "formField toggleFormField clearfix"});
        var ipRadio = _c("input", ipTR, {type: "radio", name: "registerType"});
        var ipLabel = _c("label", ipTR, {innerHTML: "IP Address"});
        var ipInput = _c("input", ipTR, {type: "text", name: "ipAddress"});
        var ipExample = _c("p", form, {className: "formFieldExample", innerHTML: "e.g. 192.168.10.10"});
        (macRadio.onclick = ipRadio.onclick = function() {
            macLabel.className = macRadio.checked? "": "disabledLabel";
            ipLabel.className = ipRadio.checked? "": "disabledLabel";
            macInput.disabled = !macRadio.checked;
            ipInput.disabled = !ipRadio.checked;
        })();
        ipInput.onkeydown = macInput.onkeydown = function(){
            clearMissing(ipInput);
            clearMissing(macInput);
        };
        var dlg = YahooDialog.displayOKCancelDialog("Register Host", form, function() {
            var data = {
                mac: macRadio.checked? macInput.value: "",
                ipAddress: ipRadio.checked? ipInput.value: ""
            };
            var valid = true;
            clearMissing(ipInput);
            clearMissing(macInput);
            if(!data.mac && !data.ipAddress){
                valid = false;
                markMissing(macInput);
                markMissing(ipInput);
            }
            else if(data.mac){
                if(!MacValidator().isValid(data.mac)){
                    valid = false;
                    markMissing(macInput);
                }
            }
            else if(!IpValidator().isValid(data.ipAddress)){
                valid = false;
                markMissing(ipInput);
            }
            if(valid){
                verifyDeviceRegistration(data);
                return true;
            }
        }, 500);
        YahooDialog.fixPortalDialog(dlg.element.id);
        console.log("billAddDevice end");
    };
    /*window.modifyDevice = function(id) {
        var index = getDeviceIndex(id);
        var notesValue = devices[index].notes || "";
        var body = _c("form", null, {className: "addDialog"});
        var notesLabel = _c("label", body, null);
        _c("span", notesLabel, {innerHTML: "??controls.notesLabel??"});
        var notes = _c("textarea", notesLabel, {name: "notes", innerText: notesValue, textContent: notesValue, value: notesValue});
        var dlg = YahooDialog.displayOKCancelDialog("??controls.modifyTitle??", body, function() {
            updateDevice({id: id, notes: notes.value});
            return true;
        }, 500);
        YahooDialog.fixPortalDialog(dlg.element.id);
        return false;
    }*/
    window.billGetDeviceIndex = function(id) {
        for(var i = 0; i < devices.length; i++) {
            if(devices[i].id == id) {
                return i;
            }
        }
        return -1;
    };
    window.billDeleteDevice = function(id) {
        console.log("billDeleteDevice start");
        var dlg = YahooDialog.displayOKCancelDialog("Kill Device", "Are you sure you would like to kill your device?", function() {
            var data = {
                action: "deleteHost",
                id: id
            };
            var request = {
                onComplete: window.billCheckLogout,
                onSuccess: function() {
                    var index = getDeviceIndex(id);
                    if(index >= 0) {
                        devices[index].element.style.display = "none";
                    }
                },
                errorTitle: "Failed to Kill Device"
            };
            CU.dataRequest("common/portalUserActions.jsp", request, data);
            return true;
        });
        YahooDialog.fixPortalDialog(dlg.element.id);
        console.log("billDeleteDevice end");
        return false;
    };
    window.billRenderDevices = function(devices) {
        for(var i = 0; i < devices.length; i++){
            billRenderDevice(devices[i], true);
            currentRegistrations++;
        }
        billUpdateRegistrationCounts();
    };
    window.billUpdateRegistrationCounts = function() {
        if( true ) {
            //document.getElementById("currentRegistrationCounts").innerHTML = currentRegistrations + "/" + maxRegistrations + " Devices Registered";
        }
    };
    window.billLoadDevices = function() {
        var params = {action: "getDevicesForUser"};
        var request = {
            onComplete: window.billCheckLogout,
            onSuccess: function(response) {
                devices = response.devices;
                $("deviceContainer").innerHTML = "";
                maxRegistrations = response.max + 100;
                renderDevices(response.devices);
                window.checkForCurrentDevice();
            },
            errorTitle: "Load Devices"
        };
        CU.dataRequest("common/portalUserActions.jsp", request, params);
    };
    window.billCheckForCurrentDevice = function() {
        if(alreadyRegistered) {
            document.getElementById("registerBanner").style.display = "none";
            return;
        }
        document.getElementById("registerBanner").style.display = "";
        for(var i = 0; i < devices.length; i++) {
            if(devices[i].currentDevice) {
                document.getElementById("registerBanner").style.display = "none";
            }
        }
    };
    window.billUpdateDevices = function() {
        console.log("window.billUpdateDevices start");
        var params = {action: "getDeviceUpdates"};
        var request = {
            loadingMessage: false,
            onSuccess: function(response) {
                renderDevices(response.added);
                for(var i = 0; i < response.added.length; i++) {
                    devices.push(response.added[i]);
                }
                for(var i = 0; i < response.modified.length; i++) {
                    var index = window.getDeviceIndex(response.modified[i].id);
                    if(index > -1) {
                        var elem = devices[index].element;
                        var newElem = renderDevice(response.modified[i]);
                        elem.parentNode.insertBefore(newElem, elem);
                        elem.parentNode.removeChild(elem);
                        devices.splice(index, 1, response.modified[i]);
                    }
                    else {
                        renderDevice(response.modified[i], true);
                        devices.push(response.modified[i]);
                        currentRegistrations++;
                    }
                }
                for(var i = 0; i < response.removed.length; i++) {
                    var index = window.getDeviceIndex(response.removed[i]);
                    if(index > -1) {
                        var elem = devices[index].element;
                        elem.parentNode.removeChild(elem);
                        if(devices.splice(index, 1).currentDevice) {
                            alreadyRegistered = false;
                        }
                        currentRegistrations--;
                    }
                }
                window.billCheckForCurrentDevice();
                window.billUpdateRegistrationCounts();
            },
            errorTitle: "Load Devices"
        };
        CU.dataRequest("common/portalUserActions.jsp", request, params);
        console.log("window.billUpdateDevices end");
    };
    window.billLogout = function() {
        console.log("window.billLogout start");
        var params = {action: "logoutUser"};
        var request = {
            onComplete: window.billCheckLogout,
            errorTitle: "Logout"
        };
        CU.dataRequest("common/portalUserActions.jsp", request, params);
        console.log("window.billLogout end");
    };
    window.billCheckLogout = function(response) {
        console.log("window.billCheckLogout start");
        if(response.logout) {
            window.location.href = "/registration/LoginMenu.jsp";
        }
        // They performed an action, other than gathering updates,
        // so reset the polling count.
        pollingCount = 0;
        console.log("window.billCheckLogout end");
    };
    window.billStartPolling = function() {
        console.log("window.billStartPolling start");
        window.billPollingInterval = setInterval(function() {
            pollingCount++;
            // 300 seconds / a poll every 5 seconds
            if(pollingCount < (300/5)) {
                window.billUpdateDevices();
            }
            else if(pollingCount > (600/5)) {
                window.billLogout();
            }
        }, 5000);
    };
    window.billRegisterCurrentDevice = function() {
        console.log("window.billRegisterCurrentDevice start");
        billVerifyDeviceRegistration(null, function(response) {
            console.log("billVerifyDeviceRegistration start");
            if(response.connected && !response.registered) {
                console.log("billVerifyDeviceRegistration: response.connected && !response.registered");
                if(response.policy) {
                    console.log("billVerifyDeviceRegistration: response.policy, window.location.href = "+billSprintf("common/portalUserActions.jsp?action=registerHostMatchingPolicy&ipAddress=%s&macAddress=%s&policy=%s", [response.ipAddress, response.macAddress, response.policy]));
                    window.location.href = billSprintf("common/portalUserActions.jsp?action=registerHostMatchingPolicy&ipAddress=%s&macAddress=%s&policy=%s", [response.ipAddress, response.macAddress, response.policy]);
                }
                else {
                    console.log("billVerifyDeviceRegistration: billRegisterHost(response)");
                    billRegisterHost(response);
                }
                document.getElementById("registerBanner").style.display = "none";
            }
            else if(response.connected) {
                alreadyRegistered = true;
                console.log("billVerifyDeviceRegistration: response.connected, This host is Already Registered.");
                throw "This host is Already Registered.";
            }
            else {
                console.log("billVerifyDeviceRegistration: Unable to find Host.");
                throw "Unable to find Host.";
            }
            console.log("billVerifyDeviceRegistration end");
        });
        console.log("window.billRegisterCurrentDevice end");
    };
    YAHOO.util.Event.onDOMReady(function() {
        console.log("YAHOO.util.Event.onDOMReady start");
        window.billLoadDevices();
        window.billStartPolling();
        billVerifyDeviceRegistration(null, function(response) {
            console.log("billVerifyDeviceRegistration start");
            alreadyRegistered = !!response.registered;
            console.log("billVerifyDeviceRegistration end");
        });
        document.getElementsByTagName("body")[0].className += " hostInventory";
        console.log("YAHOO.util.Event.onDOMReady end");
    });
    console.log("function end");
})(window);