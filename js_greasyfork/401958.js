// ==UserScript==
// @name        JummBox SysEx
// @namespace   buttspace
// @description Import and export JummBox patches to and from clipboard.
// @include     *://jummbus.bitbucket.io/*
// @include     *://hidden-realm.github.io/cardboardbox/*
// @version     0.8.2
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/401958/JummBox%20SysEx.user.js
// @updateURL https://update.greasyfork.org/scripts/401958/JummBox%20SysEx.meta.js
// ==/UserScript==
// include     *://beepbox.co/*

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function localStorage2JSON(label) {
    try {
        return JSON.parse(String(window.localStorage.getItem(label)));
    } catch (e) {
        return null;
    }
}

function date2string(d) {
    var ret = "";
    ret += d.getFullYear();
    ret += "-";
    ret += d.getMonth();
    ret += "-";
    ret += d.getDate();
    
    return ret;
}

function flashInput(elem, isSucceed) {
        var delay = 200;
    
    function _flashInput(nrCycle) {
        if (nrCycle&1) {
            elem.style.backgroundColor = "";
        } else {
            elem.style.backgroundColor = isSucceed ? "LightGreen" : "LightPink";
        }
        if (--nrCycle > 0) {
            setTimeout(_flashInput, delay,      nrCycle);
        }
    }
    _flashInput(2*2);
}

// https://stackoverflow.com/a/33928558
function writeToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData("Text", text); 

    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
}

//-----------------------------------------------------------------------------------------

var INSTRDATA = "instrumentCopy";
var SYSEX_INSTR = "SYSEX_INSTR";

//---
var divSysexCtrl;
var buttInstrRead;
var buttInstrWrite;
var inptSysex;


function sysexReadInstr() {
    var now = new Date();
    var dataObj = localStorage2JSON("instrumentCopy");
    
    if (dataObj) {
        var instr = {"sysexType":SYSEX_INSTR, "software":null, "patchDate":null, "data":null};
        //instr.software = "JummBox3";  //I don't think we can feasably tell. Prove me wrong, though.
        instr.patchDate = date2string(now);
        instr.data = dataObj;
        
        return instr;
    }
    return null;
}

function sysexWrite(sysObj) {
    var data = sysObj.data;
    var now = new Date();
    
    if (!data) return false;
    if (sysObj.sysexType == SYSEX_INSTR) {
        var patchDate = new Date(sysObj.patchDate ? sysObj.patchDate : null); //if missing, go back to 1970
        var instrStr = JSON.stringify(sysObj.data);
        
        //a newer version of JummBox might change up the JSON, since it's internal
        //so it pays to keep a date handy for any conversions
        //eventually do that here
        
        window.localStorage.setItem(INSTRDATA, instrStr);
    } else {
        return false;
    }
    return true;
}

function cbDummy(ev) {
    ev.stopPropagation();
}

function cbClearInput(ev) {
    inptSysex.value = "";
    ev.stopPropagation();
}


function cbReadInstr(ev) {
    var butt = document.querySelector("button.copyButton");
    var isSucc = false;
    var instrStr;
    
    if (butt) {
        butt.click();
        var sysObj = sysexReadInstr();
        
        if (sysObj) {
            instrStr = JSON.stringify(sysObj, null, 4);
            if (writeToClipboard(instrStr)) {
                inptSysex.value = "";
                isSucc = true;
            } else { //at this stage, copy text yourself
                inptSysex.focus();
                inptSysex.value = instrStr;
                inptSysex.select();
            }
        }
    }
    ev.stopPropagation();
    flashInput(inptSysex, isSucc);
}

function cbWriteInstr(ev) {
    var butt = document.querySelector("button.pasteButton");
    var isSucc = false;
    var sysObj;
    
    try {
        sysObj = JSON.parse(inptSysex.value);
        sysexWrite(sysObj);
        butt.click();
        isSucc = true;
    } catch (e) { }
    inptSysex.value = "";
    ev.stopPropagation();
    flashInput(inptSysex, isSucc);
}



function main() {
    var songSettingArea;
    
    //wait until the editor has spawned
    songSettingArea = document.querySelector("div.song-settings-area");
    if (!songSettingArea) {
        setTimeout(main, 500);
        return;
    }
    
    divSysexCtrl = htmlToElement(`
        <div class="selectionbox">
            <p>Sysex input/output:</p>
            <div class="operatorRow">
                <span class="top">Instr:</span>
                <button class="modBInstrRead">Read</button>
                <button class="modBInstrWrite">Write</button>
            </div>
            <textarea class="modInput" style="resize:none;"></textarea>
        </div>
    `);
    
    buttInstrRead  = divSysexCtrl.querySelector("button.modBInstrRead");
    buttInstrWrite = divSysexCtrl.querySelector("button.modBInstrWrite");
    inptSysex      = divSysexCtrl.querySelector("textarea.modInput");
    
    buttInstrRead.onclick  = cbReadInstr;
    buttInstrWrite.onclick = cbWriteInstr;
    inptSysex.onkeydown  = cbDummy;
    inptSysex.onkeypress = cbDummy;
    inptSysex.onkeyup    = cbDummy;
    inptSysex.onfocus = cbClearInput;
    //inptSysex.onblur  = cbClearInput;
    songSettingArea.appendChild(divSysexCtrl);
}
main();