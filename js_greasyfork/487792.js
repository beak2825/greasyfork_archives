// ==UserScript==
// @name         cocos Viewer
// @namespace    http://tampermonkey.net/
// @version      2024-02-18
// @description  这是一个展示cocos节点树的工具
// @author       放学我走了
// @include      *://172.16.16.125/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=16.124
// @require      http://172.16.16.125/ccc-devtools/libs/js/vue.min.js
// @require      http://172.16.16.125/ccc-devtools/libs/js/vuetify4.js
// @resource customCSS1 http://172.16.16.125/ccc-devtools/libs/css/materialdesignicons.min4.css
// @resource customCSS2 http://172.16.16.125/ccc-devtools/libs/css/vuetify.min.css
// @resource customCSS3 http://172.16.16.125/ccc-devtools/libs/css/style4.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487792/cocos%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/487792/cocos%20Viewer.meta.js
// ==/UserScript==
(function() {

    'use strict';
    // Your code here...

    const initConsoleUtil = function () {
        try {
            if (cc) {

            }else {
                return;
            }
        } catch (error) {
            return;
        }

        if (cc.tree) return;
        cc.tree = function (key) {
            let index = key || 0;
            let treeNode = function (node) {
                let nameStyle =
                    `color: ${node.parent === null || node.activeInHierarchy ? 'green' : 'grey'}; font-size: 14px;font-weight:bold`;
                let propStyle =
                    `color: black; background: lightgrey;margin-left: 5px;border-radius:3px;padding: 0 3px;font-size: 10px;font-weight:bold`;
                let indexStyle =
                    `color: orange; background: black;margin-left: 5px;border-radius:3px;padding:0 3px;fonrt-size: 10px;font-weight:bold;`
            let nameValue = `%c${node.name}`;
                let propValue =
                    `%c${node.x.toFixed(0) + ',' + node.y.toFixed(0) + ',' + node.width.toFixed(0) + ',' + node.height.toFixed(0) + ',' + node.scale.toFixed(1)}`
            let indexValue = `%c${index++}`;
                if (node.childrenCount > 0) {
                    console.groupCollapsed(nameValue + propValue + indexValue, nameStyle,
                                           propStyle, indexStyle);
                    for (let i = 0; i < node.childrenCount; i++) {
                        treeNode(node.children[i]);
                    }
                    console.groupEnd();
                } else {
                    console.log(nameValue + propValue + indexValue, nameStyle, propStyle,
                                indexStyle);
                }
            }
            if (key) {
                let node = cc.cat(key);
                index = node['tempIndex'];
                treeNode(node);
            } else {
                let scene = cc.director.getScene();
                treeNode(scene);
            }
            return '属性依次为x,y,width,height,scale.使用cc.cat(id)查看详细属性.';
        }
        cc.cat = function (key) {
            let index = 0;
            let target;
            let sortId = function (node) {
                if (target) return;
                if (cc.js.isNumber(key)) {
                    if (key === index++) {
                        target = node;
                        return;
                    }
                } else {
                    if (key.toLowerCase() === node.name.toLowerCase()) {
                        target = node;
                        return;
                    } else {
                        index++;
                    }
                }
                if (node.childrenCount > 0) {
                    for (let i = 0; i < node.childrenCount; i++) {
                        sortId(node.children[i]);
                    }
                }
            }
            let scene = cc.director.getScene();
            sortId(scene);
            target['tempIndex'] = cc.js.isNumber(key) ? key : index;
            return target;
        }
        cc.list = function (key) {
            let targets = [];
            let step = function (node) {
                if (node.name.toLowerCase().indexOf(key.toLowerCase()) > -1) {
                    targets.push(node);
                }
                if (node.childrenCount > 0) {
                    for (let i = 0; i < node.childrenCount; i++) {
                        step(node.children[i]);
                    }
                }
            }
            let scene = cc.director.getScene();
            step(scene);
            if (targets.length === 1) {
                return targets[0];
            } else {
                return targets;
            }
        }
        cc.where = function (key) {
            let target = key.name ? key : cc.cat(key);
            if (!target) {
                return null;
            }
            let rect = target.getBoundingBoxToWorld();
            let bgNode = new cc.Node();
            let graphics = bgNode.addComponent(cc.Graphics);
            let scene = cc.director.getScene();
            scene.addChild(bgNode);
            bgNode.position = rect.center;
            bgNode.group = target.group;
            bgNode.zIndex = cc.macro.MAX_ZINDEX;
            let isZeroSize = rect.width === 0 || rect.height === 0;
            if (isZeroSize) {
                graphics.circle(0, 0, 100);
                graphics.fillColor = cc.Color.GREEN;
                graphics.fill();
            } else {
                bgNode.width = rect.width;
                bgNode.height = rect.height;
                graphics.rect(-bgNode.width / 2, -bgNode.height / 2, bgNode.width, bgNode.height);
                graphics.fillColor = new cc.Color().fromHEX('#E91E6390');
                graphics.fill();
            }
            setTimeout(() => {
                if (cc.isValid(bgNode)) {
                    bgNode.destroy();
                }
            }, 2000);
            return target;
        }
        cc.cache = function () {
            if(cc.ENGINE_VERSION.indexOf("2.4")==-1){
             return cc.cache2();
            }
            let rawCacheData = cc.assetManager.assets._map;
            let cacheData = [];
            let totalTextureSize = 0;
            for (let k in rawCacheData) {
                let item = rawCacheData[k];
                if (item.type !== 'js' && item.type !== 'json') {
                    let itemName = '_';
                    let preview = '';
                    let content = item.__classname__;
                    let formatSize = -1;
                    if (item.type === 'png' || item.type === 'jpg') {
                        let texture = rawCacheData[k.replace('.' + item.type, '.json')];
                        if (texture && texture._owner && texture._owner._name) {
                            itemName = texture._owner._name;
                            preview = texture.content.url;
                        }
                    } else {
                        if (item.name) {
                            itemName = item.name;
                        } else if (item._owner) {
                            itemName = (item._owner && item._owner.name) || '_';
                        }
                        if (content === 'cc.Texture2D') {
                            preview = item.nativeUrl;
                            let textureSize = item.width * item.height * ((item._native === '.jpg' ? 3 : 4) / 1024 / 1024);
                            totalTextureSize += textureSize;
                            // sizeStr = textureSize.toFixed(3) + 'M';
                            formatSize = Math.round(textureSize * 1000) / 1000;
                        } else if (content === 'cc.SpriteFrame') {
                            preview = item._texture.nativeUrl;
                        }
                    }
                    cacheData.push({
                        queueId: item.queueId,
                        type: content,
                        name: itemName,
                        preview: preview,
                        id: item._uuid,
                        size: formatSize
                    });
                }
            }
            let cacheTitle = `缓存 [文件总数:${cacheData.length}][纹理缓存:${totalTextureSize.toFixed(2) + 'M'}]`;
            return [cacheData, cacheTitle];
        }
        cc.cache2=function(){
            let rawCacheData = cc.loader._cache;
            let cacheData = [];
            let totalTextureSize = 0;
            for (let k in rawCacheData) {
                let item = rawCacheData[k];
                let type=item.type;
                if (item.type !== 'js' && item.type !== 'json') {
                    let itemName = '_';
                    let preview = '';
                    let content = (item.content && item.content.__classname__) ? item.content.__classname__ : item.type;
                    let formatSize = -1;
                    if (item.type === 'png' || item.type === 'jpg') {
                        let texture = rawCacheData[k.replace('.' + item.type, '.json')];
                        if (texture && texture._owner && texture._owner._name) {
                            itemName = texture._owner._name;
                            preview = texture.content.url;
                        }
                    } else {
                        if (item.content.name && item.content.name.length > 0) {
                            itemName = item.content.name;
                        } else if (item._owner) {
                            itemName = (item._owner && item._owner.name) || '_';
                        }
                        if (content === 'cc.Texture2D') {
                            type=content;
                            let texture = item.content;
                            preview = texture.url;
                            let textureSize = texture.width * texture.height * ((texture._native === '.jpg' ? 3 : 4) / 1024 / 1024);
                            totalTextureSize += textureSize;
                            // sizeStr = textureSize.toFixed(3) + 'M';
                            formatSize = Math.round(textureSize * 1000) / 1000;
                        } else if (content === 'cc.SpriteFrame') {
                            preview = item.content._texture.url;
                        }
                    }
                    cacheData.push({
                        queueId: item.queueId,
                        type: type,
                        name: itemName,
                        preview: preview,
                        id: item.id,
                        content: content,
                        size: formatSize
                    });
                }
            }
            let cacheTitle = `缓存 [文件总数:${cacheData.length}][纹理缓存:${totalTextureSize.toFixed(2) + 'M'}]`;
            return [cacheData, cacheTitle];
        }
    }
    const NEX_CONFIG = {
        nodeSchema: {
            node2d: {
                title: 'Node',
                key: 'cc.Node',
                rows: [
                    { name: 'Name', key: 'name', type: 'text' },
                    { name: 'X', key: 'x', type: 'number' },
                    { name: 'Y', key: 'y', type: 'number' },
                    { name: 'Width', key: 'width', type: 'number' },
                    { name: 'Height', key: 'height', type: 'number' },
                    { name: 'Angle', key: 'angle', type: 'number' },
                    { name: 'ScaleX', key: 'scaleX', type: 'number' },
                    { name: 'ScaleY', key: 'scaleY', type: 'number' },
                    { name: 'Opacity', key: 'opacity', type: 'number' },
                    { name: 'Color', key: 'hex_color', type: 'color' },
                    { name: 'Group', key: 'group', type: 'text' },
                ]
            },
            node3d: {
                title: 'Node',
                key: 'cc.Node',
                rows: [
                    // TODO:
                ]
            },
        },
        componentsSchema: {
            'cc.Camera': {
                title: 'cc.Camera',
                key: 'cc.Camera',
                rows: [
                    { name: 'Zoom Ratio', key: 'zoomRatio', type: 'number' },
                    { name: 'Depth', key: 'depth', type: 'number' },
                    { name: 'Bacground Color', key: 'hex_backgroundColor', rawKey: 'backgroundColor', type: 'color' },
                    { name: 'Align with Screen', key: 'alignWithScreen', type: 'bool' },
                ]
            },
            'cc.Sprite': {
                key: 'cc.Sprite',
                title: 'cc.Sprite',
                rows: []
            },
            'cc.Label': {
                title: 'cc.Label',
                key: 'cc.Label',
                rows: [
                    { name: 'String', key: 'string', type: 'textarea' },
                    { name: 'Font Size', key: 'fontSize', type: 'number' },
                    { name: 'Line Height', key: 'lineHeight', type: 'number' },
                ]
            }
        }
    }


    function isCocos() {
        return new Promise((re, rj) => {
            let inter = setInterval(() => {
                try {
                    if (cc) {
                        window.clearInterval(inter);
                        re(cc)
                    }
                } catch (error) {

                }
            }, 100)
            });
    }

    function createApp(){
        // 创建一个div元素

        // 创建一个新的 div 元素
        var newDivElement = document.createElement('div');
        // 设置新 div 的一些属性和样式
        newDivElement.textContent = '这是新的 div';
        //newDivElement.style.zIndex="8888";
        newDivElement.style.width = '100%';
        newDivElement.style.height = '100%';
        //newDivElement.style.display = 'flex';
        //newDivElement.style.flexDirection = 'column';
        //newDivElement.style.justifyContent = 'center';
        // 获取父元素的引用
        var parentElement = document.getElementById('GameCanvas'); // 
        // 在父元素的前面插入新的 div 元素
        parentElement.parentNode.insertBefore(newDivElement, parentElement);
        newDivElement.innerHTML=getHtml();
        let inter = setInterval(() => {
            try {
                var elementToMove = document.getElementById('Cocos2dGameContainer');
                var targetElement = document.getElementById('GameDiv');
                // 移动元素到目标元素的内部
                if (elementToMove&&targetElement) {
                    window.clearInterval(inter);
                    targetElement.appendChild(elementToMove);
                    setInterval(()=>{shipei(); },1000)
                }
            } catch (error) {
            }
        }, 100)
        }
    function shipei(){
        cc.director.getScene().getChildByName("Canvas").scale=0.45;
        return;
        var elementToMove = document.getElementById('Cocos2dGameContainer');
        var myDiv = document.getElementById('GameDiv'); // 替换为实际的 <div> 的 id
        var rect = myDiv.getBoundingClientRect();
        var w=rect.width;
        var h=rect.height;
        let ws= w/1136;
        let hs= h/640;
        if(ws<hs){
            h=640*ws;
            //h=h*ws;
        }else {
            w=1136*hs;
            //w=w*hs;
        }
        myDiv.style.width = w+'px%';
        myDiv.style.height = h+'px%';
        console.log(`==============${w}===${h}====`);
        var resizeEvent = new UIEvent('resize', { bubbles: true, cancelable: true });
        window.dispatchEvent(resizeEvent);
    }


    async function appMain(){
        const css1 = GM_getResourceText("customCSS1");
        GM_addStyle(css1);
        const css2 = GM_getResourceText("customCSS2");
        GM_addStyle(css2);
        const css3 = GM_getResourceText("customCSS3");
        GM_addStyle(css3);
        await isCocos();
        console.log("=========createTreeButton=========")
        createApp();
        initVue();
        initConsoleUtil();

    }

    function initVue(){

        const app = new Vue({
            el: '#app',
            vuetify: new Vuetify({
                theme: { dark: true }
            }),
            data: {
                isShowTop: true,
                drawer: false,
                cacheDialog: false,
                cacheTitle: '',
                cacheHeaders: [
                    { text: 'Type', value: 'type' },
                    { text: 'Name', value: 'name' },
                    { text: 'Preivew', value: 'preview' },
                    { text: 'ID', value: 'id' },
                    { text: 'Size', value: 'size' },
                ],
                cacheRawData: [],
                cacheData: [],
                cacheSearchText: null,
                cacheOnlyTexture: true,
                treeData: [],
                selectedNodes: [],
                intervalId: -1,
                treeSearchText: null,
                nodeSchema: {},
                componentsSchema: [],
            },
            created() {

                if (this.isShowTop) {
                    this.startUpdateTree();
                }
                this.waitCCInit().then(() => {

                    initConsoleUtil();
                });
            },
            watch: {
                cacheOnlyTexture() {
                    this.updateCacheData();
                }
            },
            computed: {
                treeFilter() {
                    return (item, search, textKey) => item[textKey].indexOf(search) > -1;
                },
                selectedNode() {
                    if (!this.selectedNodes.length) return undefined
                    let node = getNodeById(this.selectedNodes[0]);
                    if (node) {
                        if (!node.hex_color) {
                            cc.js.getset(node, 'hex_color', () => {
                                return '#' + node.color.toHEX('#rrggbb');
                            }, (hex) => {
                                node.color = new cc.Color().fromHEX(hex);
                            }, false, true);
                        }

                        let superPreLoad = node._onPreDestroy;
                        node._onPreDestroy = () => {
                            superPreLoad.apply(node);
                            if (this.selectedNodes.length > 0 && this.selectedNodes[0] === node._id) {
                                this.selectedNodes.pop();
                            }
                        }
                        this.nodeSchema = NEX_CONFIG.nodeSchema.node2d;
                        let componentsSchema = [];
                        for (let component of node._components) {
                            let schema = NEX_CONFIG.componentsSchema[component.__classname__];
                            if (schema) {
                                node[schema.key] = node.getComponent(schema.key);
                                for (let i = 0; i < schema.rows.length; i++) {
                                    if (schema.rows[i].type === 'color') {
                                        if (!node[schema.key][schema.rows[i].key]) {
                                            cc.js.getset(node[schema.key], schema.rows[i].key, () => {
                                                return '#' + node.getComponent(schema.key)[schema.rows[i].rawKey].toHEX('#rrggbb');
                                            }, (hex) => {
                                                node.getComponent(schema.key)[schema.rows[i].rawKey] = new cc.Color().fromHEX(hex);
                                            }, false, true);
                                        }
                                    }
                                }
                            } else {
                                schema = {
                                    title: component.__classname__,
                                    key: component.__classname__
                                };
                                node[schema.key] = node.getComponent(schema.key);
                            }
                            componentsSchema.push(schema);
                        }
                        this.componentsSchema = componentsSchema;
                    }
                    return node;
                },
            },
            methods: {
                waitCCInit() {
                    return new Promise((resolve, reject) => {
                        resolve();
                    });
                },
                refreshTree: function () {
                    if (!this.$data.drawer || !cc.director.getScene() || !cc.director.getScene().children) return;
                    this.$data.treeData = getChildren(cc.director.getScene());
                },
                startUpdateTree: function () {
                    this.$data.intervalId = setInterval(() => {
                        this.refreshTree();
                    }, 200);
                },
                stopUpdateTree: function () {
                    clearInterval(this.$data.intervalId);
                },
                outputNodeHandler(id) {
                    let i = 1;
                    while (window['temp' + i] !== undefined) {
                        i++;
                    }
                    window['temp' + i] = this.selectedNode;
                    console.log('temp' + i);
                    console.log(window['temp' + i]);
                },
                outputComponentHandler(component) {
                    let i = 1;
                    while (window['temp' + i] !== undefined) {
                        i++;
                    }
                    window['temp' + i] = this.selectedNode.getComponent(component);
                    console.log('temp' + i);
                    console.log(window['temp' + i]);
                },
                drawNodeRect() {
                    cc.where(this.selectedNode);
                },
                updateCacheData() {
                    if (this.$data.cacheOnlyTexture) {
                        this.$data.cacheData = this.$data.cacheRawData.filter(item => item.type === 'cc.Texture2D');
                    } else {
                        this.$data.cacheData = this.$data.cacheRawData;
                    }
                },
                openCacheDialog() {
                    [this.$data.cacheRawData, this.$data.cacheTitle] = cc.cache();
                    this.updateCacheData();
                    this.$data.cacheDialog = true;
                },
                openGithub() {
                    window.open('https://github.com/potato47/ccc-devtools');
                },
                openCocosForum() {
                    window.open('https://forum.cocos.com/');
                },
                openCocosDocs() {
                    window.open('https://docs.cocos.com/');
                }
            }
        });
        return app;
    }

    function getChildren(node) {
        return node.children.map(child => {
            let children = (child.children && child.children.length > 0) ? getChildren(child) : [];
            return { id: child._id, name: child.name, active: child.activeInHierarchy, children };
        });
    }

    function getNodeById(id) {
        let target;
        const search = function (node) {
            if (node._id === id) {
                target = node;
                return;
            }
            if (node.childrenCount) {
                for (let i = 0; i < node.childrenCount; i++) {
                    if (!target) {
                        search(node.children[i]);
                    }
                }
            }
        }
        const scene = cc.director.getScene();
        search(scene);
        return target;
    }

    function getHtml(){
        let y=window.location.href.substring(window.location.protocol.length+2,35)
        y=y.substring(0,y.lastIndexOf("/"));
        let html=` <v-app id="app">
    <v-app-bar app clipped-left color="gray" dense v-if="isShowTop">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <div id="recompiling"><span>Recompiling...</span></div>
        <v-spacer></v-spacer>
        <div class="toolbar">
            <div class="item">
                <v-btn id="btn-show-fps" small height="25"><span style="color: #aaa;">Show FPS</span></v-btn>
            </div>
           <div class="item">
                <v-btn id="btn-show-fps" small height="25" @click="openCacheDialog" ><span style="color: #aaa;">显示缓存资源</span></v-btn>
            </div>

        </div>
    </v-app-bar>
<v-navigation-drawer v-model="drawer" app clipped fixed width="512" v-if="isShowTop">
        <v-container style="height: 50%;overflow: auto;">
            <v-text-field v-model="treeSearchText" dense label="Search Node or Component" dark flat solo-inverted
                hide-details clearable clear-icon="mdi-close-circle-outline"></v-text-field>
            <v-treeview :items="treeData" item-key="id" dense activatable :search="treeSearchText"
                :active.sync="selectedNodes">
                <template v-slot:label="{ item, active }">
                    <label v-if="item.active" style="color: white;">{{ item.name }}</label>
                    <label v-else style="color: gray;">{{ item.name }}</label>
                </template>
            </v-treeview>
        </v-container>
        <v-container style="border-top: 2px solid darkgray;height: 50%;overflow-y: auto;">
            <template v-if="selectedNode">
                <!-- Node -->
                <table style="width: 100%;color: white;" border="1">
                    <thead>
                        <tr>
                            <th colspan="2" style="text-align: left; padding: 10px;">
                                <div class="float-left" style="display:inline-flex;">
                                    <v-simple-checkbox v-model="selectedNode.active"></v-simple-checkbox>
                                    <span style="margin-left: 10px;">{{ nodeSchema.title }}</span>
                                </div>
                                <div class="float-right">
                                    <v-icon style="margin-left: 10px;margin-right: 10px;" @click="drawNodeRect()">
                                        mdi-adjust</v-icon>
                                    <v-icon @click="outputNodeHandler()">mdi-send</v-icon>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in nodeSchema.rows" :key="row.key">
                            <td style="padding: 10px;width: 40%;">{{ row.name }}</td>
                            <td style="width: 60%;">
                                <v-color-picker v-if="row.type == 'color'" class="ma-2" canvas-height="80" width="259"
                                    v-model="selectedNode[row.key]"></v-color-picker>
                                <v-simple-checkbox v-else-if="row.type == 'bool'" v-model="selectedNode[row.key]"
                                    style="padding: 10px;width: 100%;"></v-simple-checkbox>
                                <input v-else :type="row.type" v-model="selectedNode[row.key]"
                                    style="padding: 10px;width: 100%;"></input>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!-- Components -->
                <table v-for="component in componentsSchema" style="width: 100%;color: white;" border="1">
                    <thead>
                        <tr>
                            <th colspan="2" style="text-align: left; padding: 10px;">
                                <div class="float-left" style="display:inline-flex;">
                                    <v-simple-checkbox v-model="selectedNode[component.key].enabled">
                                    </v-simple-checkbox>
                                    <span style="margin-left: 10px;">{{ component.title }}</span>
                                </div>
                                <div class="float-right">
                                    <v-icon @click="outputComponentHandler(component.key)">mdi-send</v-icon>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in component.rows" :key="row.key">
                            <td style="padding: 10px;width: 40%;">{{ row.name }}</td>
                            <td style="width: 60%;">
                                <v-color-picker v-if="row.type == 'color'" class="ma-2" canvas-height="80" width="259"
                                    v-model="selectedNode[component.key][row.key]"></v-color-picker>
                                <textarea v-else-if="row.type == 'textarea'" rows="1"
                                    v-model="selectedNode[component.key][row.key]" style="padding: 10px;width: 100%;">
                                </textarea>
                                <v-simple-checkbox v-else-if="row.type == 'bool'"
                                    v-model="selectedNode[component.key][row.key]" style="padding: 10px;width: 100%;">
                                </v-simple-checkbox>
                                <input v-else :type="row.type" v-model="selectedNode[component.key][row.key]"
                                    style="padding: 10px;width: 100%;"></input>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </template>
        </v-container>
    </v-navigation-drawer>

        <v-content>
        <v-container fill-height>
            <div id="content" class="content">
                <div class="contentWrap">
                    <div id="GameDiv" class="wrapper">

                    </div>
                </div>
            </div>
        </v-container>
    </v-content>

    <v-dialog v-model="cacheDialog" persistent scrollable>
        <v-card>
            <v-card-title>
                {{ cacheTitle }}
                <v-spacer></v-spacer>
                <v-text-field v-model="cacheSearchText" append-icon="mdi-magnify" label="Search" single-line
                    hide-details>
                </v-text-field>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-data-table :headers="cacheHeaders" :items="cacheData" :search="cacheSearchText" :sort-by="['size']"
                    :sort-desc="[true]" :footer-props="{
                        showFirstLastPage: true,
                        firstIcon: 'mdi-chevron-double-left',
                        lastIcon: 'mdi-chevron-double-right',
                      }">
                    <template v-slot:item.size="{ item }">
                        {{ item.size == -1 ? '_' : (item.size +'MB') }}
                    </template>
                    <template v-slot:item.preview="{ item }">
                        <div style="height: 60px;display: flex;align-items: center;">
                            <img :src="window.location.protocol + '//${y}/' + item.preview"
                                style="max-height: 60px;max-width: 120px;" v-if="item.preview">
                            <template v-else>_</template>
                        </div>
                    </template>
                </v-data-table>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn color="blue darken-1" text @click="cacheDialog = false">Close</v-btn>
                <v-spacer></v-spacer>
                <v-switch v-model="cacheOnlyTexture" label="只显示纹理"></v-switch>
            </v-card-actions>
        </v-card>
    </v-dialog>
    </v-app>
    `
        return html;

    }

    appMain();
})();