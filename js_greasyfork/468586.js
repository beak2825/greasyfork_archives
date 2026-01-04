// ==UserScript==
// @name         自动存档备份
// @namespace    http://yuyanmc.top/
// @version      0.1
// @description  要什么简介
// @author       yuyanMC
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468586/%E8%87%AA%E5%8A%A8%E5%AD%98%E6%A1%A3%E5%A4%87%E4%BB%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/468586/%E8%87%AA%E5%8A%A8%E5%AD%98%E6%A1%A3%E5%A4%87%E4%BB%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const backupStoreName="This is the auto backup stuff and don't touch this unless you know how it works.";
    setInterval(function(){
        localStorage[backupStoreName]||(localStorage[backupStoreName]="{}");
        let saves=JSON.parse(localStorage[backupStoreName])[location.href]||[];
        let lastSave=saves[saves.length-1]||{"t":0};
        let ct=Date.now();
        if(ct-lastSave.t<55*60*1000){
            return;
        }
        let lswithoutbackup=JSON.parse(JSON.stringify(localStorage));
        delete lswithoutbackup[backupStoreName];
        let cs={
            "t":ct,
            "c":lswithoutbackup
        };
        saves.push(cs);
        if(saves.length>50){
            saves.splice(0,1);
        }
        let newls=JSON.parse(localStorage[backupStoreName]);
        newls[location.href]=saves;
        localStorage[backupStoreName]=JSON.stringify(newls);
    },60*60*1000);
    (function(){
        localStorage[backupStoreName]||(localStorage[backupStoreName]="{}");
        let saves=JSON.parse(localStorage[backupStoreName])[location.href]||[];
        let lastSave=saves[saves.length-1]||{"t":0};
        let ct=Date.now();
        if(ct-lastSave.t<55*60*1000){
            return;
        }
        let lswithoutbackup=JSON.parse(JSON.stringify(localStorage));
        delete lswithoutbackup[backupStoreName];
        let cs={
            "t":ct,
            "c":lswithoutbackup
        };
        saves.push(cs);
        if(saves.length>50){
            saves.splice(0,1);
        }
        let newls=JSON.parse(localStorage[backupStoreName]);
        newls[location.href]=saves;
        localStorage[backupStoreName]=JSON.stringify(newls);
    }());
    window.backupNow=function(){
        localStorage[backupStoreName]||(localStorage[backupStoreName]="{}");
        let saves=JSON.parse(localStorage[backupStoreName])[location.href]||[];
        let ct=Date.now();
        let lswithoutbackup=JSON.parse(JSON.stringify(localStorage));
        delete lswithoutbackup[backupStoreName];
        let cs={
            "t":ct,
            "c":lswithoutbackup
        };
        saves.push(cs);
        if(saves.length>50){
            saves.splice(0,1);
        }
        let newls=JSON.parse(localStorage[backupStoreName]);
        newls[location.href]=saves;
        localStorage[backupStoreName]=JSON.stringify(newls);
    };
    window.loadBackupSave=function(id=0){
        let saves=JSON.parse(localStorage[backupStoreName])[location.href];
        if(id>=saves.length){
            return `Out of range. Available save id from 0 to ${saves.length-1}.`;
        }
        let backups=localStorage[backupStoreName];
        localStorage.clear();
        Object.getOwnPropertyNames(saves[id].c).forEach(function(e){
            localStorage[e]=saves[id]["c"][e];
        })
        localStorage[backupStoreName]=backups;
        location.reload();
    };
})();