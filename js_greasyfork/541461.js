// ==UserScript==
// @name        TriX Core Library
// @namespace   https://github.com/COURTESYCOIL/TriX-Executor
// @version     2.4.0a
// @description Core logic library for TriX Executor.
// @author      Painsel
// @license     MIT
// ==/UserScript==

const TriX_Core = (function() {
    'use strict';
    let _GM; 

    const TabManager = { /* ... (unchanged) ... */ };
    const ScriptManager = {
        async saveScriptFromEditor() {
            const name = document.getElementById("trix-save-name").value.trim();
            // Get content from CodeMirror instances via the UI library
            const jsCode = TriX_UI.jsEditor.state.doc.toString();
            const pyCode = TriX_UI.pyEditor.state.doc.toString();
            
            if (!name) return TriX_UI.log("Cannot save: Name is required.", "error");
            if (!jsCode && !pyCode) return TriX_UI.log("Cannot save: Both editors are empty.", "warn");
            
            const scriptData = JSON.stringify({ js: jsCode, py: pyCode });
            await _GM.GM_setValue(`trix_script_${name}`, scriptData);
            
            TriX_UI.log(`Script '${name}' saved.`, "info");
            this.populateScriptList();
        },
        async loadScriptToEditor(key) {
            if (!key) return TriX_UI.log("Invalid script key.", "error");
            const scriptJSON = await _GM.GM_getValue(key, "{}");
            const name = key.replace("trix_script_", "");
            try {
                const scriptData = JSON.parse(scriptJSON);
                const jsEditor = TriX_UI.jsEditor;
                const pyEditor = TriX_UI.pyEditor;

                // Use CodeMirror's transaction system to update the content
                jsEditor.dispatch({ changes: { from: 0, to: jsEditor.state.doc.length, insert: scriptData.js || "" } });
                pyEditor.dispatch({ changes: { from: 0, to: pyEditor.state.doc.length, insert: scriptData.py || "" } });

                document.getElementById("trix-save-name").value = name;
                TriX_UI.log(`Loaded script: ${name}`, "info");
                TriX_UI.currentScriptName = name;
                TriX_UI.setActiveScriptItem(key);
            } catch (e) {
                TriX_UI.log("Error loading script data.", "error");
            }
        },
        async deleteCurrentScript() { /* ... (unchanged) ... */ },
        async populateScriptList() { /* ... (unchanged) ... */ }
    };
    const Executor = { /* ... (unchanged) ... */ };
    const MultiTab = { /* ... (unchanged) ... */ };
    
    function init(username, gmFunctions) {
        _GM = gmFunctions;
        TabManager.init(username);
    }
    
    // Minified unchanged code for brevity
    TabManager.init=function(e){this.myTabInfo={id:`tab_${Date.now().toString(36)}_${Math.random().toString(36).substring(2)}`,username:e,loadTime:Date.now(),lastSeen:Date.now()};_GM.GM_addValueChangeListener("trix_active_tabs",(e,t,i,s)=>{s&&this.pruneAndRefresh(i)});this.register();setInterval(()=>this.register(),5e3);window.addEventListener("beforeunload",()=>this.unregister())},TabManager.register=async function(){let e=await _GM.GM_getValue("trix_active_tabs",[]);const t=Date.now();e=e.filter(e=>t-e.lastSeen<15e3),this.myTabInfo.lastSeen=t;const i=e.findIndex(e=>e.id===this.myTabInfo.id);-1<i?e[i]=this.myTabInfo:e.push(this.myTabInfo),await _GM.GM_setValue("trix_active_tabs",e),this.pruneAndRefresh(e)},TabManager.unregister=async function(){let e=await _GM.GM_getValue("trix_active_tabs",[]);e=e.filter(e=>e.id!==this.myTabInfo.id),await _GM.GM_setValue("trix_active_tabs",e)},TabManager.pruneAndRefresh=function(e){this.tabs=e,this.uiInitialized&&TriX_UI.updateTabCountUI(e.length),this.checkMasterStatus()},TabManager.checkMasterStatus=function(){this.isMaster=this.amIMaster(),this.isMaster&&!this.uiInitialized&&this.initUI()},TabManager.amIMaster=function(){if(!this.myTabInfo.username||this.myTabInfo.username.startsWith("Guest_"))return!0;const e=this.tabs.filter(e=>e.username===this.myTabInfo.username);return 0===e.length||this.myTabInfo.loadTime===Math.min(...e.map(e=>e.loadTime))},TabManager.initUI=function(){this.uiInitialized||(console.log("[TriX Core] This tab is the master. Initializing UI."),this.uiInitialized=!0,TriX_UI.init(_GM))};
    ScriptManager.deleteCurrentScript=async function(){const e=TriX_UI.currentScriptName;e&&confirm(`Are you sure you want to delete '${e}'?`)&&(await _GM.GM_deleteValue(`trix_script_${e}`),TriX_UI.log(`Script '${e}' deleted.`,"info"),TriX_UI.jsEditor.dispatch({changes:{from:0,to:TriX_UI.jsEditor.state.doc.length,insert:""}}),TriX_UI.pyEditor.dispatch({changes:{from:0,to:TriX_UI.pyEditor.state.doc.length,insert:""}}),document.getElementById("trix-save-name").value="",TriX_UI.currentScriptName="",this.populateScriptList())},ScriptManager.populateScriptList=async function(e=null){const t=document.getElementById("trix-script-list");t.innerHTML="";const i=(await _GM.GM_listValues()).filter(e=>e.startsWith("trix_script_"));i.sort().forEach(e=>{const i=document.createElement("div");i.className="trix-script-item",i.textContent=e.replace("trix_script_",""),i.dataset.scriptKey=e,t.appendChild(i)}),TriX_UI.setActiveScriptItem(e||TriX_UI.currentScriptName?`trix_script_${TriX_UI.currentScriptName}`:null)};
    Executor.executeJS=function(e){if(!e.trim())return TriX_UI.log("JS Execution skipped: script is empty.","warn");TriX_UI.log("Executing JavaScript...","info");try{const t=this.createAPI(),i=new Function("TriX",e);i(t)}catch(e){TriX_UI.log(`JavaScript Error: ${e.message}`,"error"),console.error("TriX Executor JS Error:",e)}},Executor.executePY=function(e){if(!e.trim())return TriX_UI.log("Python Execution skipped: script is empty.","warn");if("undefined"==typeof Sk)return TriX_UI.log("Skulpt not loaded. Cannot run Python.","error");TriX_UI.log("Executing Python via Skulpt...","info"),Sk.configure({output:e=>{e.trim()&&TriX_UI.log(`[Python]: ${e.trim()}`,"log")},read:function(e){if(void 0===Sk.builtinFiles||void 0===Sk.builtinFiles.files[e])throw"File not found: '"+e+"'";return Sk.builtinFiles.files[e]}}),Sk.misceval.asyncToPromise(()=>Sk.importMainWithBody("<stdin>",!1,e,!0)).then(e=>{TriX_UI.log("Skulpt script finished.","info")}).catch(e=>{TriX_UI.log(e.toString(),"error")})},Executor.createAPI=()=>({log:(e,t="log")=>{const i="object"==typeof e?JSON.stringify(e):String(e);TriX_UI.log(i,t)},broadcast:e=>{MultiTab.broadcast(e)},query:(e,t="text")=>{const i=document.querySelector(e);return i?"html"===t?i.innerHTML:"value"===t?i.value:"element"===t?i:i.textContent:null},queryAll:(e,t="text")=>{const i=document.querySelectorAll(e);return Array.from(i).map(e=>"html"===t?e.innerHTML:"value"===t?e.value:"element"===t?e:e.textContent)}});
    MultiTab.init=function(e){_GM=e;const t=`tab_${Date.now().toString(36)}_${Math.random().toString(36).substring(2)}`;this.TAB_ID=t,_GM.GM_addValueChangeListener("trix_broadcast_channel",this.listener.bind(this))},MultiTab.listener=function(e,t,i,s){s&&i.senderId!==this.TAB_ID&&TriX_UI.log(`Received broadcast: ${JSON.stringify(i.payload)}`,"broadcast")},MultiTab.broadcast=function(e){const t={senderId:this.TAB_ID,timestamp:Date.now(),payload:e};_GM.GM_setValue("trix_broadcast_channel",t),TriX_UI.log(`Broadcast sent: ${JSON.stringify(e)}`,"broadcast")};

    return { init, ScriptManager, Executor, MultiTab };
})();