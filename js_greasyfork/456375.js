// ==UserScript==
// @name         ShaderToy Editor Shader Input UI Fix
// @name:zh-CN   ShaderToy 着色器输入UI修复 
// @namespace    https://unlucky.ninja/shadertoy
// @version      0.1
// @description  It makes the shader input panel scrollable
// @description:zh-CN   使编辑器上方的着色器输入面板可滚动
// @author       UnluckyNinja
// @license      MIT
// @match        https://www.shadertoy.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shadertoy.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456375/ShaderToy%20Editor%20Shader%20Input%20UI%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/456375/ShaderToy%20Editor%20Shader%20Input%20UI%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const container = document.querySelector("#editorHeader");
    if (container){
        container.style['overflow-y'] = 'auto';
    }
    const header = document.querySelector("#editorHeaderBar");
    if (header){
        header.style.position = 'sticky';
        header.style['z-index'] = '10';
        header.style['transform'] = 'translateY(-2px)';
    }
})();