// ==UserScript==
// @name        New script kylebing.cn
// @namespace   Violentmonkey Scripts
// @match       https://kylebing.cn/tools/typepad/*
// @grant       none
// @version     1.0
// @author      -
// @description 1/8/2024, 12:18:59 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484678/New%20script%20kylebingcn.user.js
// @updateURL https://update.greasyfork.org/scripts/484678/New%20script%20kylebingcn.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 定义加载文件的函数
    function loadTextFile() {
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'text/plain';
        fileInput.style.display = 'none';

        fileInput.onchange = function(e) {
            var file = e.target.files[0];
            if (file) {
                var reader = new FileReader();
                var filename = e.target.files[0].name;
                console.log(filename);
                reader.onload = function(e) {
                    var editor = document.getElementById('editor');
                    if (editor) {
                        editor.value = e.target.result;
                    }
                    var titleedit = document.getElementsByClassName("editor-title")[0];
                    if (titleedit) {
                        titleedit.value = filename.split(".")[0];
                    }
                };
                reader.readAsText(file, 'UTF-8');
            }
            fileInput.remove();
        };

        document.body.appendChild(fileInput);
        fileInput.click();
    }

    // 创建按钮
    var btn = document.createElement('div');
    btn.className = 'btn';
    btn.id = "selectfile";
    btn.textContent = '加载文本文件';
    btn.addEventListener("click", function(){
      loadTextFile();
    });

    var observer = new MutationObserver(function(mutations, me) {
    var editor = document.getElementById('editor');
    if (editor) {
        var parentCont = document.getElementsByClassName("editor-toolbar")[0];
        var buttonGroup = document.createElement("div");
        buttonGroup.className = "btn-group";
        buttonGroup.appendChild(btn);
        parentCont.appendChild(buttonGroup);
        console.log("injected!!");
        me.disconnect(); // 停止观察
        return;
    }
});
    var config = { childList: true, subtree: true };
    var target = document.body;
    observer.observe(target, config);


    // TODO: 将按钮添加到页面的合适位置
    // 例如：
    // var container = document.querySelector('.your-container-selector');
    // container.appendChild(btn);
})();