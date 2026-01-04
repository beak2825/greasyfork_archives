// ==UserScript==
// @name         WASM Editor
// @namespace    http://tampermonkey.net/
// @version      2024-07-18-01:56:41
// @description  acces it in diep.io settings button; when in editor, press F1 for info
// @author       todp
// @match        https://diep.io/*
// @match        https://staging.diep.io/*
// @match        https://mobile.diep.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @run-at       document-start
// @license      todp
// @downloadURL https://update.greasyfork.org/scripts/497013/WASM%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/497013/WASM%20Editor.meta.js
// ==/UserScript==
if (!localStorage['weloadingwasm??@@44-!2d2']) localStorage['weloadingwasm??@@44-!2d2'] = false;

if (localStorage['weloadingwasm??@@44-!2d'] === 'true') {
    localStorage['weloadingwasm??@@44-!2d'] = false;
    modWasm();
}
if (localStorage['weloadingwasm??@@44-!2d2'] === 'true') {
    modWasm();
}
function modWasm() {
    const instant = WebAssembly.instantiate;
    const strea = WebAssembly.instantiateStreaming;
    WebAssembly.instantiateStreaming = (r, i) => r.arrayBuffer().then(b => WebAssembly.instantiate(b, i));
    if (!localStorage['wasm22233f_@s']) return alert('trying to load nothing?')
    var buffer = new Uint8Array(localStorage['wasm22233f_@s'].split(","));
    WebAssembly.instantiate = function (buf, imports) {
        return instant(buffer, imports).then(function (wasm) {
            WebAssembly.instantiate = instant;
            WebAssembly.instantiateStreaming = strea;
            window.instance = wasm.instance;
            return wasm;
        }).catch(function (err) {
            throw err;
        });
    };
}
//for some reason i cant use it in @require since greasyfork says its a unapproved script, so i had to make this
(async function() {
    window.ok = await fetch("https://cdn.jsdelivr.net/gh/AssemblyScript/wabt.js/index.js").then(e=>e.text());
    eval(window.ok);
    //
let idThisTime = parseFloat(Math.random().toFixed(3)).toString(13).slice(2,8);
let wasm2wat = null;
let wat2wasm = null;

WabtModule().then(function(wabt) {
    window.wabt = wabt;
    function compileText(contents) {
        if (!contents) {
            return;
        }
        try {
            var module = wabt.readWasm(contents, {generateNames: false, readDebugNames: false, foldExprs: false, inlineExport: false});
            var result = module.toText({foldExprs: false, inlineExport: false});
            return result;

        } catch (e) {
            console.log('error', e)
        }
    }
    wasm2wat = compileText;
    window.wasm2wat = wasm2wat;

    function compileWasm(contents) {
        if (!contents) {
            return;
        }
        try {
            var module = wabt.parseWat('todp', contents, {generateNames: false, readDebugNames: false, foldExprs: false, inlineExport: false});
            var result = module.toBinary({foldExprs: false, inlineExport: false});
            return result;

        } catch (e) {
            console.log('error', e)
        }
    }
    wat2wasm = compileWasm;
    window.wat2wasm = wat2wasm;
});
const buildFetch = async () => {
    const res = await fetch(location.origin + '/', { cache: "no-cache" });
    const text = await res.text();

    const JS_PATH = text.slice(text.indexOf("src=\"/index.") + "src=\"/".length, text.indexOf("\">", text.indexOf("src=\"/index.")));
    const wasm2js = await fetch(location.origin + '/' + JS_PATH).then(res => res.text());
    const WASM_PATH = wasm2js.slice(wasm2js.lastIndexOf("\"", wasm2js.indexOf(".wasm\"")) + 1, wasm2js.indexOf(".wasm\"")) + ".wasm"
    return {JS_PATH, WASM_PATH}
};
buildFetch().then(async function(a){
    let wasm = await fetch(location.origin + '/' + a.WASM_PATH);
    let dat = await wasm.arrayBuffer();
    let data = new Uint8Array(dat);
    window.wat = wasm2wat(data);
    window.wasm = data;
})
let load = setInterval(()=>{
    if (document.querySelector("#sidebar-menu")) {
        let el = document.querySelector("#sidebar-menu");
        let hr = document.querySelector("#sidebar-menu").children[1].cloneNode(true);
        let thing = document.querySelector("#sidebar-menu").children[2].cloneNode(true);
        thing.textContent = 'Edit WASM*';
        thing.onclick = openWasmEditor;
        document.querySelector("#sidebar-menu").appendChild(hr);
        document.querySelector("#sidebar-menu").appendChild(thing);
        document.querySelector("#sidebar-menu").appendChild(hr);
        clearInterval(load);
    }
});
window.saveWat = function() {
    if (wat2wasm(editor.getValue()) !== undefined) {
    const url=URL.createObjectURL(new Blob([editor.getValue()])),element=document.createElement("a");element.download=`diepwat_${idThisTime}.wat`,element.href=url,element.click();
    }
    else alert("There's an error. Check console")
}
window.useWat = function() {
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');
        reader.onload = readerEvent => {
            var content = readerEvent.target.result;
            if (wat2wasm(content) !== undefined) {
                alert('Succesfully loaded WAT ' + file.name)
                editor.setValue(content)
            }
            else alert('Thats not a valid wat file')
        }
    }
    input.click();
}
window.toggleAutoLoad = function() {
    let ch = document.getElementById('checkboxAutoLoad');
    localStorage['weloadingwasm??@@44-!2d2'] = ch.checked;
}
window.fixtd = function(a) {
    if (a==='true') return true;
    if (a==='false') return false;
}
window.loadCustomWasm = function() {
    if (wat2wasm(editor.getValue()) !== undefined) {
        if (confirm('Are you sure') === true) {
        localStorage['wasm22233f_@s'] = wat2wasm(editor.getValue()).buffer;
        localStorage['weloadingwasm??@@44-!2d'] = true;
        location.reload();
        }
    }
    else alert("There's an error. Check console");
}
window.saveWasm = function() {
    if (wat2wasm(editor.getValue()) !== undefined) {
        localStorage['wasm22233f_@s'] = wat2wasm(editor.getValue()).buffer;
        alert('Saved');
    }
    else alert("There's an error. Check console");
}
function openWasmEditor() {
    window.stop();
    document.open();
    document.write(`
<!DOCTYPE html>
<head>
<style>
    #editor {
        position: absolute;
        top: 20px;
        right: 0;
        bottom: 0;
        left: 0;
    }
    #buttonSaveWat {
        position: absolute;
        top: 0px;
        left: 0px;
    }
    #buttonUseWat {
        position: absolute;
        top: 0px;
        left: 110px;
    }
    #buttonSaveWasm {
        position: absolute;
        top: 0px;
        left: 199px;
    }
    #buttonLoadDiep {
        position: absolute;
        top: 0px;
        left: 293px;
    }
</style>
<button type="button" id="buttonSaveWat" onclick="window.saveWat()">Download WAT</button>
<button type="button" id="buttonUseWat" onclick="window.useWat()">Import WAT</button>
<button type="button" id="buttonSaveWasm" onclick="window.saveWasm()">Save WASM</button>
<button type="button" id="buttonLoadDiep" onclick="window.loadCustomWasm()">Load Diep</button>
<label style="position: absolute; top: 0px; left: 370px"><input type="checkbox" name="checkbox" id="checkboxAutoLoad" onclick="window.toggleAutoLoad()">Auto Load</label>
<label style="position: absolute; top: 0px; left: 500px">Editing:<select id="editingSelect"><option value="saved">Saved WASM</option><option value="default">Default Diep</option></select></label>
</head>
<body>

<div id="editor"></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.34.2/ace.min.js"></script>
<script>
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/github_dark");
    document.querySelector("#editor > div.ace_scroller > div.ace_content > div.ace_layer.ace_print-margin-layer > div").remove();
    editor.session.setMode('ace/mode/abap')
    if (localStorage['wasm22233f_@s']) {
    editor.setValue(window.wasm2wat(new Uint8Array(localStorage['wasm22233f_@s'].split(","))));
    }
    if (!localStorage['wasm22233f_@s']) editor.setValue('Theres nothing saved');
    document.querySelector("#editingSelect").onchange = function(e) {
    let selected = e.srcElement.options[e.srcElement.selectedIndex].textContent;
    if (selected === 'Default Diep') editor.setValue(window.wat);
    if (selected === 'Saved WASM') {
    if (!localStorage['wasm22233f_@s']) return editor.setValue('Theres nothing saved')
    editor.setValue(window.wasm2wat(new Uint8Array(localStorage['wasm22233f_@s'].split(","))));
    }
    }
    document.querySelector("#checkboxAutoLoad").checked = fixtd(localStorage['weloadingwasm??@@44-!2d2'])
</script>
</body>
</html>
`);
    document.close();
}
    window.openWasm = openWasmEditor;
})();