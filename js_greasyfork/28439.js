// ==UserScript==
// @name         Comcast Business SMCD3G Port Forward Autoconfig
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Easily/Automatically create port forwards, without having to sit and wait for each change to apply. Created to while diagnosing an issue with SMCD3G that caused it to forgets all configured port forwards, which seems to be a common problem for some xfinity customers as well. 
// @author       firefish5000@kataomoi.moe
// @include      /https?:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}\/user/\index\.asp/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28439/Comcast%20Business%20SMCD3G%20Port%20Forward%20Autoconfig.user.js
// @updateURL https://update.greasyfork.org/scripts/28439/Comcast%20Business%20SMCD3G%20Port%20Forward%20Autoconfig.meta.js
// ==/UserScript==

// [ "Application Name", Public port start, Public port end, Internal port Start, "Protocall", "Forward IP"]
var Ports = [
    ["HTTP",        80,80,80,'TCP','10.0.0.12'],
    ["HTTPS",        443,443,443,'TCP','10.0.0.12'],
    ["IKEv2-NAT-T", 4500,4500,4500,'UDP','10.0.0.12'],
    ["IPSEC-IKE",        500,500,500,'UDP','10.0.0.12'],
    ["IPSEC-ESP",        50,50,50,'ESP','10.0.0.12'],
    ["SSH",        2222,2222,22,'TCP','10.0.0.12'],
];


function dbg(txt) {
    console.log(txt);
}

function getElementByXpath(path,element=document) {
  return document.evaluate(path, element, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
function getElementsByXpath(xpath, parent=document)
{
  let results = [];
  let query = document.evaluate(xpath,
      parent,
      null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (let i=0, length=query.snapshotLength; i<length; ++i) {
    results.push(query.snapshotItem(i));
  }
  return results;
}
function SelectOptionByText(selectList,val) {// class = ffSelectWrapper
    dbg("Got Select List");
    dbg(selectList);
    for (var i=0;i<selectList.options.length;i++) {
        dbg("Scanning option " + selectList.options[i].value.trim() + " with id " + i + " for option " + val);
        if (selectList.options[i].textContent.trim() == val) {
            dbg("Selected option " + val + " with id " + i);
            selectList.selectedIndex=i;
            break;
        }
    }
}
function SelectOption(selectList,val) {// class = ffSelectWrapper
    dbg("Got Select List");
    dbg(selectList);
    for (var i=0;i<selectList.options.length;i++) {
        dbg("Scanning option " + selectList.options[i].value.trim() + " with id " + i + " for option " + val);
        if (selectList.options[i].value.trim() == val) {
            dbg("Selected option " + val + " with id " + i);
            selectList.selectedIndex=i;
            break;
        }
    }
}

function SetPortForwarding(name,start,stop,local_start,type,ip) {
    dbg("Setting up a port forward");
    var doc = getElementByXpath('//frame[@src="main.asp"]').contentDocument;
    var form  = getElementByXpath('//form[@name="PortForwardForm"]',doc);
    var f_name = getElementByXpath('.//input[@id="app_X_name"]',form);
    var f_start = getElementByXpath('.//input[@id="app_X_public_start"]',form);
    var f_stop = getElementByXpath('.//input[@id="app_X_public_end"]',form);
    var f_local_start = getElementByXpath('.//input[@id="app_X_private_start"]',form);
    var f_type = getElementByXpath('.//select[@id="app_X_protocol"]',form);
    var f_ip = getElementByXpath('.//input[@id="app_X_ip"]',form);
    var f_submit = getElementByXpath('.//div[@id="submit"]/input',form);
    f_name.value=name;
    f_start.value=start;
    f_stop.value=stop;
    f_local_start.value=local_start;
    // Update local stop via keyup event
    f_local_start.onkeyup();
    SelectOptionByText(f_type,type);
    f_ip.value=ip;
    setTimeout(function() { f_submit.onmouseup(); f_submit.click(); },500);
}

function AddNewForward() {
    var doc = getElementByXpath('//frame[@src="main.asp"]').contentDocument;
    var form  = getElementByXpath('//form[@name="ServiceA"]',doc);
    var add_new = getElementByXpath('.//input[@name="add_new"]',form);
    add_new.click();
}

function CheckLoop(xpath,callback,thenCall=function(){return null;},timeout=500,tries=1000,errcallback=function(e_xpath) { dbg("Failed to find form '" + e_xpath + "' within tries limit."); }) {
    var doc = getElementByXpath('//frame[@src="main.asp"]').contentDocument;
    var elm = getElementByXpath(xpath,doc);
    if ( elm ) {
        callback();
        thenCall();
    }
    else if (tries !== 0) {
        dbg("Didn't see element");
        dbg(tries);
        setTimeout(function() { CheckLoop(xpath,callback,thenCall,timeout,tries - 1); }, timeout);
    }
    else {
        errcallback(xpath);
    }
}




var rollTimeout=null;
function rollmsg(elm,msg) {
    var NowMsg=elm.textContent;
    NowMsg=NowMsg.substring(1,NowMsg.length)+NowMsg.substring(0,1);
    elm.textContent = NowMsg;
    if (elm.offsetParent !== null) {
        clearTimeout(rollTimeout);
        rollTimeout=setTimeout(function(){ rollmsg(elm,msg); },200);
    }
}
var origTitle="";
function SavingBanner() {
    dbg("Activating Saving Banner");
    var doc = getElementByXpath('//frame[@src="main.asp"]').contentDocument;
    var title  = getElementByXpath('//div[@id="body-container"]/h2',doc);
    origTitle=title.textContent;
    title.textContent="SAVING ! ! !";
    // I am not sure why this makes the title 3 lines long, but I like it!
    title.style.width*=2;
    clearTimeout(rollTimeout);
    rollmsg(title,"");
}
function SetApplyBanner() {
    dbg("Apply Btn now calls Saving Banner");
    var doc = getElementByXpath('//frame[@src="main.asp"]').contentDocument;
    var form  = getElementByXpath('//form',doc);
    var apply = getElementByXpath('.//div[@id="submit"]/input',form);
    var origOnClick = apply.onclick;
    //apply.onclick=function() {rollTimeout=setTimeout(function(){ SavingBanner(); },200); origOnClick.apply(null,arguments);};
    apply.onmouseup=function() { rollTimeout=setTimeout(function(){ SavingBanner(); },200);};
    // Intercept Alerts
    var awin = getElementByXpath('//frame[@src="main.asp"]').contentWindow;
    var oldAlert=window.alert;
    awin.alert = function() {
        dbg("got Alert!");
        clearTimeout(rollTimeout);
        oldAlert.apply(awin,arguments);
    };
}
function SetApplyBannerLoop() {
    CheckLoop('//form//div[@id="submit"]/input',SetApplyBanner,function() { setTimeout(SetApplyBannerLoop,5000); },5000);
}
SetApplyBannerLoop();

var port_i = 0;
function itteratePorts() {
    if (port_i < Ports.length) {
        var port = Ports[port_i];
        port_i++;
        var forwardPort = function() {
            SetApplyBanner();
            SetPortForwarding.apply(null,port);
            /*
            var doc = getElementByXpath('//frame[@src="main.asp"]').contentDocument;
            var title  = getElementByXpath('//div[@id="body-container"]/h2',doc);
            title.textContent="SAVING ! ! !";
            // I am not sure why this makes the title 3 lines long, but I like it!
            title.style.width*=2;
            rollmsg(title,"");
            */
        };
        var addNewForward = function() {
            var doc = getElementByXpath('//frame[@src="main.asp"]').contentDocument;
            var form  = getElementByXpath('//form[@name="ServiceA"]',doc);
            var add_new_btn = getElementByXpath('.//input[@name="add_new"]',form);
            var edit_btn = getElementByXpath('.//input[@name="edit"]',form);
            var rows = getElementsByXpath('.//tr[td/@class="content"]',form);
            var edit = false;
            dbg("Configuring Forward Named " + port[0]);
            for (var r=0; r<rows.length; r++) {
                var row=rows[r];
                if (row.children[2].textContent === port[0] ) {
                    dbg("Found Existing Forward! Editing #" + (r + 1));
                    edit = true;
                    row.children[0].children[0].click();
                }
            }
            if (edit) {
                edit_btn.click();
            }
            else {
                dbg("Creating new Forward!");
                add_new_btn.click();
            }
        };
        //CheckLoop('//form[@name="ServiceA"]',addNewForward);
        //if (true) return null;
        CheckLoop('//form[@name="ServiceA"]',addNewForward,function() {
            CheckLoop('//form[@name="PortForwardForm"]',forwardPort,itteratePorts);
        });
    }
}
itteratePorts();


