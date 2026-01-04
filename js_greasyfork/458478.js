// ==UserScript==
// @name        Blackprint for PlayCanvas Editor
// @namespace   PlayCanvas Scripts
// @match       https://playcanvas.com/editor/scene/*
// @match       https://launch.playcanvas.com/*
// @icon        https://user-images.githubusercontent.com/11073373/141421213-5decd773-a870-4324-8324-e175e83b0f55.png
// @grant       none
// @version     0.1.2
// @author      StefansArya
// @license     MIT
// @description A small Blackprint Editor addons for PlayCanvas Editor
// @downloadURL https://update.greasyfork.org/scripts/458478/Blackprint%20for%20PlayCanvas%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/458478/Blackprint%20for%20PlayCanvas%20Editor.meta.js
// ==/UserScript==

/** External dependency loaded from this script
 * - Font-Awesome:              UI icons
 * - ScarletsFrame:             Frontend framework
 * - Blackprint Sketch:         For nodes editor
 *   - Blackprint Engine:       For executing nodes
 *   - Blackprint Skeleton:     To import without executing module/nodes
 *   - Timeplate:               For cable animation (this deps can be removed)
 *     - Eventpine:             Simple event emitter
 *
 * Please scroll down to "Load external modules" for the version and URLs
 */



!(async ()=>{
let isGameMode = location.host === 'launch.playcanvas.com';

let frameworkURL = "https://cdn.jsdelivr.net/npm/scarletsframe@0.35.25/dist/scarletsframe.dev.js";
await import(frameworkURL);

let sf = window.sf;
let { $ } = sf;
window.$ = sf.$;

// Required if we're going to use sf.Window
sf.Window.frameworkPath = frameworkURL;

// No state refresh
// sf.hotReload?.(1);

// ================ Load external modules ================

sf.loader.js([
    "https://cdn.jsdelivr.net/npm/@blackprint/engine@0.8.6/dist/engine.min.js",
    "https://cdn.jsdelivr.net/npm/@blackprint/engine@0.8.6/dist/skeleton.min.js",
    "https://cdn.jsdelivr.net/npm/@blackprint/sketch@0.8.7/dist/blackprint.min.js",
    "https://cdn.jsdelivr.net/npm/@blackprint/sketch@0.8.7/dist/blackprint.sf.js",
    "https://cdn.jsdelivr.net/npm/eventpine@1.0.3",
    "https://cdn.jsdelivr.net/npm/timeplate@0.1.0",
], { ordered: true });

sf.loader.css([
    "https://cdn.jsdelivr.net/npm/@blackprint/sketch@0.8.7/dist/blackprint.sf.css",
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/fontawesome.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/solid.min.css',
]);

let panelElement = $('#layout-assets .pcui-panel-content');


// ==================== On page ready ====================
$(function init(){
    Blackprint.settings('visualizeFlow', true);

    // Below is for editor only
    if(isGameMode) return;

    editor.assets.on('add', refreshAssetIcon);
    editor.assets.on('move', refreshAssetIcon);
    editor.assets.on('load:all', refreshAssetIcon);

    panelElement.on('dblclick', '.type-blackprint', {capture: true}, async ev => {
        let el = ev.target.closest('.pcui-asset-grid-view-item');
        let index = $.prevAll(el, 'div').length;
        let file = editor.assets.list()[index]?.get('file');
        ev.stopImmediatePropagation();
        ev.stopPropagation();
        ev.preventDefault();

        if(!file || !file.filename.endsWith('.bp.json'))
            throw new Error("Failed to get Blackprint file by element index");

        showEditor(file);
    })
});

let _refreshAssetIcon;
function refreshAssetIcon(){
    clearTimeout(_refreshAssetIcon);
    _refreshAssetIcon = setTimeout(() => {
        let list = editor.assets.list();

        for (let i=0; i < list.length; i++) {
            let asset = list[i];
            if(asset.get('type') === 'json' && asset.get('name').endsWith('.bp')){
                var els = panelElement.find('.pcui-gridview-item');
                if(els.length === 0) continue;

                let el = els.eq(i);
                el.addClass('pcui-asset-grid-view-item-source')
                    .addClass('type-blackprint');
                el.find('span').removeClass('type-json');
                el.find('img').attr('src', "https://user-images.githubusercontent.com/11073373/141421213-5decd773-a870-4324-8324-e175e83b0f55.png").css({
                    'display': 'block',
                    'width': '58px',
                    'height': '58px',
                });
            }
        }
    }, 500);
}


// ========= Initialize component's styles =========

let editors = {};

sf.$(document.head).append('<style id="blackprint-mini-css"></style>');
sf.$('style#blackprint-mini-css').html(`
    sf-m { display: block; }

    sf-space[blackprint] sf-m[name=container] {
        height: 100%;
        width: 100%;
    }

    @font-face {
        font-family: "Proxima Nova Regular";
        src: url("https://playcanvas.com/static-assets/fonts/proxima_nova_regular.woff") format("woff");
        font-weight: normal;
        font-style: normal;
    }
    @font-face {
        font-family: "Proxima Nova Light";
        src: url("https://playcanvas.com/static-assets/fonts/proxima_nova_light.woff") format("woff");
        font-weight: 200;
        font-style: normal;
    }
    @font-face {
        font-family: "Proxima Nova Bold";
        src: url("https://playcanvas.com/static-assets/fonts/proxima_nova_bold.woff") format("woff");
        font-weight: bold;
        font-style: normal;
    }
    @font-face {
        font-family: "Proxima Nova Thin";
        src: url("https://playcanvas.com/static-assets/fonts/proxima_nova_thin_t.woff") format("woff");
        font-weight: 100;
        font-style: normal;
    }

    bp-mini-editor {
        color: #b1b8ba;
        font-family: "Proxima Nova Regular", "Helvetica Neue", Arial, Helvetica, sans-serif;
    }

    bp-mini-editor > .container {
        background: #7c7c7cdb;
        position: fixed;
        width: 50vw;
        height: 50vh;
        z-index: 10;
        border-radius: 20px;
        overflow: hidden;
        border: 2px solid #5a5a5a;
    }

    bp-mini-editor > .container > .header{
        background: #181818;
        width: 100%;
        height: 20px;
        text-align: center;
        cursor: default;
        z-index: 2;
        position: relative;
        font-weight: bold;
    }

    bp-mini-editor > .container > sf-space[blackprint]{
        height: calc(100% - 20px);
    }
    bp-mini-editor > .container > .close,
    bp-mini-editor > .container > .copy-clipboard {
        position: absolute;
        font-weight: bold;
        cursor: pointer;
        padding: 0 10px;
        z-index: 2;
    }

    bp-mini-editor > .container > .close {
        top: 0;
        right: 20px;
    }
    bp-mini-editor > .container > .new-window {
        position: absolute;
        right: 70px;
        top: 2px;
        z-index: 2;
        font-size: 14px;
        cursor: pointer;
    }

    bp-mini-editor > .container > .copy-clipboard {
        top: 0;
        left: 20px;
    }

    bp-mini-editor a {
        color: #bfc0c0;
    }

    bp-mini-editor a span {
        color: black;
    }

    bp-instance-list .container > .list-closed {
        position: fixed;
        width: 30px;
        height: 30px;
        background: #00000099;
        color: white;
        letter-spacing: 2px;
        border-radius: 20px;
        padding: 6px;
        padding-left: 20px;
        top: 50%;
        left: -15px;
        font-family: sans-serif;
        box-shadow: 0 0 4px #c1c1c1;
        cursor: pointer;
        transform: translateY(-50%);
    }

    bp-instance-list .container > .list-closed > img {
        width: 100%;
           height: 100%;
    }

    bp-instance-list .container.opened > .list-closed {
        display: none;
    }

    bp-instance-list .container > .list-opened {
        top: 50%;
        border-radius: 0 10px 10px 0;
        box-shadow: 0 0 10px black;
        color: white;
        left: 0;
        transform: translate(-100%, -50%);
        background: #383838fa;
        position: fixed;
        opacity: 0;
        transition: 0.7s ease-in-out;
        transition-property: opacity, transform;
        font-size: 16px;
        width: 200px;
        padding: 5px 10px;
    }

    bp-instance-list .container.opened > .list-opened {
        opacity: 1;
        transform: translate(0%, -50%);
    }
    bp-instance-list .container > .list-opened > .close {
        float: right;
        cursor: pointer;
    }
    bp-instance-list .container > .list-opened > .list-title {
        text-align: center;
    }
    bp-instance-list .container > .list-opened > .instance-list {
        margin-top: 5px;
        padding-top: 5px;
        border-top: 1px dashed white;
    }
    bp-instance-list .container > .list-opened > .instance-list {
        cursor: pointer;
    }
`);

// ========= Initialize bp-mini-editor component =========

sf.component.html('bp-mini-editor', `
<div class="container" style="left:{{ x }}px; top: {{ y }}px;">
    <div class="header" @dragmove="moveEditor(event)" title="{{ !isGameMode ? 'This editor is used only for previewing node connection without loading or executing any nodes' : 'This editor can be be used to modify node data flow in realtime' }}">
        {{ title }} - Blackprint {{ isGameMode ? 'Nodes' : 'Skeleton'}} Editor
    </div>
    <div class="copy-clipboard" style="display: {{ isGameMode ? 'show' : '' }}" title="Save to clipboard" @click="save()">copy</div>
    <div class="close" title="Close" @click="close()">x</div>
    <div class="new-window" title="Open in new window" @click="cloneContainer()">
        <i class="fa fa-window-restore"></i>
    </div>
</div>
`);
sf.component('bp-mini-editor', class extends sf.Model {
    constructor(){
        super();
        this.isGameMode = isGameMode;

        this.x = 310;
        this.y = 50;
        this.title = "Loading...";
    }

    init(){
        if(this.sketchEl || !this.instance) return;
        this.sketchEl = this.instance.cloneContainer();
        this.$el('.container').append(this.sketchEl);

        registerEditorListener($('sf-m[name="container"]', this.sketchEl)[0].model);

        // Delay a bit until the container is attached to DOM and initialized
        return new Promise(r => setTimeout(r, 500));
    }

    async import(title, json){
        this.instance ??= new Blackprint.Sketch();

        await this.init();
        this.title = title;

        // Load node skeleton only if in PlayCanvas editor
        // Load and use engine instance if in game mode
        await this.instance.importJSON(json, {isSkeletonInstance: !isGameMode});
        await this.onLoaded();
    }

    async onLoaded(){
        let sketch = this.instance;
        await sketch.recalculatePosition();

        let Ref = sketch.scope('container');
        let {offsetHeight, offsetWidth} = Ref.$el[0].parentElement;
        let nodes = Ref.nodeScope.list;
        let maxX = 0, maxY = 0;
        let W = 0, H = 0;

        for (var i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            if(maxX < node.x){
                maxX = node.x;
                W = node.w || 0;
            }

            if(maxY < node.y){
                maxY = node.y;
                H = node.h || 0;
            }
        }

        maxX += W + 50;
        maxY += H + 50;

        let A = offsetWidth / maxX;
        let B = offsetHeight / maxY;

        let decidedScale = A < B ? A : B;
        decidedScale = decidedScale - (decidedScale % 0.01);

        if(decidedScale === 0) {
            console.log("Unexpected: scaling the container to zero");
            decidedScale = 1;
        }

        Ref.scale = decidedScale > 1 ? 1 : decidedScale;
        Ref.size.w = offsetWidth / decidedScale;
        Ref.size.h = offsetHeight / decidedScale;
    }

    save(){
        navigator.clipboard.writeText(this.instance.exportJSON());
    }

    moveEditor(ev){
        this.x += ev.movementX;
        this.y += ev.movementY;

        if(ev.type === 'pointerup' || ev.type === 'touchend' || ev.type === 'mouseup')
            this.instance?.recalculatePosition();
    }

    cloneContainer(){
        let sketch = this.instance;
        let title = sketch._funcMain != null ? `"${sketch._funcMain.title}" Function` : `Main`;

        // Clone into new window
        new sf.Window({
            title: `Sketch: ${title}`,
            templateHTML: sketch.cloneContainer() // Clone 2
        });
    }

    close(){ this.$el.remove(); }
    destroy(){
        delete editors[this.hash];
    }
});

async function showEditor(file){
    if(!editors[file.hash]){
        let component = $('<bp-mini-editor></bp-mini-editor>')[0];
        editors[file.hash] = component;
        $(document.body).append(component);
    }

    let editor = editors[file.hash];
    let data = await $.getJSON(file.url);
    editor.model.import(file.filename, data);
    editor.model.hash = file.hash;
}

function registerEditorListener(My){
    function pointerOver(targetEl){
        if(targetEl.tagName === 'path'){
            targetEl.parentElement.model.disconnect();
        }
    }

    function pmEvent(ev){
        if(!ev.altKey) return temp.off('pointermove', pmEvent);
        pointerOver(ev.target);
    }
    function tmEvent(ev){
        if(!ev.altKey) return temp.off('touchmove', tmEvent);

        let touch = ev.touches[0];
        pointerOver(document.elementFromPoint(touch.clientX, touch.clientY));
    }

    let temp = My.$el('sf-m[name="cables"]');
    let evRegistered = false;
    temp.on('pointerdown', function(ev){
        if(ev.altKey && !evRegistered){
            evRegistered = true;
            if(ev.pointerType === 'touch')
                temp.on('touchmove', tmEvent);
            else temp.on('pointermove', pmEvent);
        }
    })
    .on('pointerup', function(ev){
        if(evRegistered){
            evRegistered = false;
            if(ev.pointerType === 'touch')
                temp.off('touchmove', tmEvent);
            else temp.off('pointermove', pmEvent);
        }
    });
}

// ======== Initialize bp-instance-list component ========

sf.component.html('bp-instance-list', `
<div class="container {{ listOpened ? 'opened' : ''}}" style="display: {{
    isGameMode ? '' : 'none'
}}">
    <div class="list-closed" @click="listOpened = true">
        <img src="https://user-images.githubusercontent.com/11073373/141421213-5decd773-a870-4324-8324-e175e83b0f55.png">
    </div>
    <div class="list-opened">
        <div class="close" @click="listOpened = false">x</div>
        <div class="list-title">Instance List <span>🌿</span></div>
        <div class="instance-list">
            <div sf-each="i, val in instances" @click="open(val)">
            {{ i+1 }}. {{ val._pcAssetName }}
            </div>
        </div>
        <div class="list-title" style="display: {{ ready ? 'none' : '' }}">Loading instances</div>
    </div>
</div>
`);
sf.component('bp-instance-list', class extends sf.Model {
    constructor(){
        super();
        this.isGameMode = isGameMode;
        this.listOpened = false;
        this.ready = false;
        this.instances = window.blackprintList ??= [];

        window.onBlackprintReady = () => {
            this.ready = true;
        }
    }

    async open(instance){
        if(!editors[instance._pcAssetName]){
            let component = $('<bp-mini-editor></bp-mini-editor>')[0];
            $(document.body).append(component);
            editors[instance._pcAssetName] = component;
        }

        let editor = editors[instance._pcAssetName];
        let model = editor.model;
        model.instance = instance;
        model.hash = model.title = instance._pcAssetName;

        await model.init();
        model.onLoaded();
    }
});

$(function(){
    let component = $('<bp-instance-list></bp-instance-list>')[0];
    $(document.body).append(component);

    let lastInteractEl = null;
    function checkIfHasSelection(skipSelectionCheck){
        // Skip textbox/input element
        let tagName = lastInteractEl.tagName;
        if(tagName === 'INPUT' || tagName === 'TEXTAREA')
            return;

        let sketch = lastInteractEl.closest('sf-m[name="container"]')?.model.$space.sketch;
        if(sketch == null) return;

        let container = sketch.scope('container');

        // Skip if no selected nodes/cables
        if(!skipSelectionCheck && container.nodeScope.selected.length === 0
        && container.cableScope.selected.length === 0){
            return;
        }

        return {sketch, container};
    }

    $(window)
    .on('pointerdown', function(ev){
        lastInteractEl = ev.target;
    })
    .on('keydown', async (ev) => {
        if(ev.key !== 'Delete') return;

        let passed = checkIfHasSelection();
        if(!passed) return;
        let {sketch, container} = passed;

        if(container.nodeScope.selected.length === 0 && container.cableScope.selected.length === 0) return;

        if(ev.key === 'Delete'){
            let selected = container.nodeScope.selected;
            for(let i=0; i < selected.length; i++)
                sketch.deleteNode(selected[i]);

            selected.splice(0);

            selected = container.cableScope.selected;
            for(let i=0; i < selected.length; i++)
                selected[i].disconnect();

            selected.splice(0);
        }
    })
});


})();