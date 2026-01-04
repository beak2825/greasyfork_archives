// ==UserScript==
// @name              HTML5 Save Export Import
// @name:zh           HTML5游戏存档导入导出
// @namespace    http://tampermonkey.net/
// @icon  https://github.com/YuriSizuku/Kirikiroid2/releases/download/1.3.9_yuri/46031510_p0_icon.jpg
// @version      0.7.1
// @description  Local Storage Access. Mainly used for html5 game save export or import.
// @author       devseed
// @match        *://*/*
// @grant        none
// @require https://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/395502/HTML5%20Save%20Export%20Import.user.js
// @updateURL https://update.greasyfork.org/scripts/395502/HTML5%20Save%20Export%20Import.meta.js
// ==/UserScript==

var $=jQuery;
var YURI = YURI || {};
(function($$) {
    "use strict";
    var _saveFile = (name, content) => {
        //console.log(name+" "+content);
        var e = document.createEvent('MouseEvents');
        var a = document.createElement('a');
        var blob = new Blob([content], {type:'application/octet-stream'});
        a.download = name;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
    }
    var _requestFiles =  (requestDone) => {
        var i = document.createElement('input');
        i.type = 'file';
        i.addEventListener('change', () => {
            requestDone(i.files);
        });
        i.click(); //can not open without user click
    }

    $$.storage = {
        saveFile:function(path, content) {
            _saveFile(path, content);
        },
        exportSave: function(isMerge) {
            isMerge = isMerge || true
            var key_value={};
            if(arguments.length > 1){
                for(var i=1;i<arguments.length;i++)
                    key_value[arguments[i]] = window.localStorage.getItem(arguments[i]);
            }
            else{
                for(var i=0;i<window.localStorage.length;i++)
                     key_value[window.localStorage.key(i)] =
                         window.localStorage.getItem(window.localStorage.key(i));
            }
            if(isMerge){
                var json = JSON.stringify(key_value);
                _saveFile("saves.json", json);
            } else{
                for (var k in key_value){
                    if(key_value[k]!=null)
                        _saveFile(k.toString()+".sav", key_value[k]);
                }
            }
        },
        importSave: function() {
            var requestDone = (files) => {
               var file = files[0];
               var reader = new FileReader();
               reader.onload = (e) =>{
                   var text=e.target.result;
                   var key_value = {};
                   //console.log(text);
                   if(file.type == 'application/json'){
                       key_value = JSON.parse(text);
                   }else{
                       var key = file.name.split('.');
                       key = key.slice(0, key.length-1).join('.');
                       key_value[key] = text;
                   }
                   for(var key in key_value){
                       window.localStorage.setItem(key, key_value[key]);
                   }
               }
               reader.readAsText(file);
            }
            _requestFiles(requestDone);
        },
    }
})(YURI) //initial functions


var button_export = button_export ||
    $('body').append('<input type="button" id="btn_export" value="Export saves" \
                       style="position relative;margin:0px 10px 0px 0px">')
             .find('#btn_export');
console.log(button_export)
var button_import = button_import ||
    $('body').append('<input type="button" id="btn_import" value="Import saves">')
             .find('#btn_import');

button_export.click(()=>YURI.storage.exportSave())
button_import.click(()=>YURI.storage.importSave())