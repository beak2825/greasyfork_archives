// ==UserScript==
// @name         WMEFixer
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  try to take over the world!
// @author       jangliss (h/t to dummyd2)
// @match        https://*.waze.com/*editor*
// @match        https://editor-beta.waze.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32480/WMEFixer.user.js
// @updateURL https://update.greasyfork.org/scripts/32480/WMEFixer.meta.js
// ==/UserScript==
(function() {
// setup one global var and put all in
var WMEAPI = {};
// detect URL of WME source code
WMEAPI.scripts = document.getElementsByTagName('script');
WMEAPI.url=null;
for (i=0;i<WMEAPI.scripts.length;i++)
{
    if (WMEAPI.scripts[i].src.indexOf('/assets-editor/js/app')!=-1)
    {
        WMEAPI.url=WMEAPI.scripts[i].src;
        break;
    }
}
if (WMEAPI.url===null)
{
    throw new Error("WME Hack: can't detect WME main JS");
}
// setup a fake require and require.define
WMEAPI.require=function (e) {
    if (WMEAPI.require.define.modules.hasOwnProperty(e))
        return WMEAPI.require.define.modules[e];
    else
        console.error('Require failed on ' + e, WMEAPI.require.define.modules);
    return null;
};
WMEAPI.require.define=function (m) {
    if (WMEAPI.require.define.hasOwnProperty('modules')===false)
        WMEAPI.require.define.modules={};
    for (var p in m)
    {
        WMEAPI.require.define.modules[p]=m[p];
    }
};
// save the original webpackJsonp function
WMEAPI.tmp = window.webpackJsonp;
// taken from WME code: this function is a wrapper that setup the API and may call recursively other functions
WMEAPI.t = function (n) {
    if (WMEAPI.s[n]) return WMEAPI.s[n].exports;
    var r = WMEAPI.s[n] = {
        exports: {},
        id: n,
        loaded: !1
    };
    return WMEAPI.e[n].call(r.exports, r, r.exports, WMEAPI.t), r.loaded = !0, r.exports;
};
// e is a copy of all WME funcs because function t need to access to this list
WMEAPI.e=[];
// the patch
window.webpackJsonp = function(a, i) {
    // our API but we will use it only to build the require stuffs
    var api={};
    // taken from WME code. a is [1], so...
    for (var o, d, u = 0, l = []; u < a.length; u++) d = a[u], WMEAPI.r[d] && l.push.apply(l, WMEAPI.r[d]), WMEAPI.r[d] = 0;
    
    var unknownCount=0;
    var classname, funcStr;
    
    // copy i in e and keep a link from classname to index in e
    for (o in i)
    {
        WMEAPI.e[o] = i[o];
        funcStr = i[o].toString();
        classname = funcStr.match(/CLASS_NAME:\"([^\"]*)\"/);
        if (classname)
        {
            // keep the link.
            api[classname[1].replace(/\./g,'/').replace(/^W\//, 'Waze/')]={index: o, func: WMEAPI.e[o]};
        }
        else
        {
            api['Waze/Unknown/' + unknownCount]={index: o, func: WMEAPI.e[o]};
            unknownCount++;
        }
        
    }
    
    // taken from WME code: it calls the original webpackJsonp and do something else, but I don't really know what.
    // removed the call to the original webpackJsonp: still works...
    //for (tmp && tmp(a, i); l.length;) l.shift().call(null, t);
    for (; l.length;) l.shift().call(null, WMEAPI.t);
    WMEAPI.s[0] = 0;
    
    // run the first func of WME. This first func will call recusrsively all funcs needed to setup the API.
    // After this call, s will contain all instanciables classes.
    //var ret = WMEAPI.t(0);
    
    // now, build the requires thanks to the link we've built in var api.
    var module={};
    var apiFuncName;
    unknownCount=0;
    
    for (o in i)
    {
        funcStr = i[o].toString();
        classname = funcStr.match(/CLASS_NAME:\"([^\"]*)\"/);
        if (classname)
        {
            module={};
            apiFuncName = classname[1].replace(/\./g,'/').replace(/^W\//, 'Waze/');
            module[apiFuncName]=WMEAPI.t(api[apiFuncName].index);
            WMEAPI.require.define(module);
        }
        else
        {
            var matches = funcStr.match(/SEGMENT:"segment",/);
            if (matches)
            {
                module={};
                apiFuncName='Waze/Model/ObjectType';
                module[apiFuncName]=WMEAPI.t(api['Waze/Unknown/' + unknownCount].index);
                WMEAPI.require.define(module);
            }
            unknownCount++;
        }
    }
     
    // restore the original func
    window.webpackJsonp=WMEAPI.tmp;
    // set the require public if needed
    // if so: others scripts must wait for the window.require to be available before using it.
    window.require=WMEAPI.require;
    // all available functions are in WMEAPI.require.define.modules
    // console.debug this variable to read it:
    // console.debug('Modules: ', WMEAPI.require.define.modules);
    
    // run your script here:
    // setTimeout(yourscript);
    
    // again taken from WME code. Not sure about what it does.
    //if (i[0]) return ret;
};
// some kind of global vars and init
WMEAPI.s = {};
WMEAPI.r = {
    0: 0
};
// hacking finished
// load again WME through our patched func
WMEAPI.WMEHACK_Injected_script = document.createElement("script");
WMEAPI.WMEHACK_Injected_script.setAttribute("type", "application/javascript");
WMEAPI.WMEHACK_Injected_script.src = WMEAPI.url;
document.body.appendChild(WMEAPI.WMEHACK_Injected_script);
})();