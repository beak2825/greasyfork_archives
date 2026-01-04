// ==UserScript==
// @name         雀魂回放编辑器Replay_Editor
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  雀魂自制回放
// @author       xiaolan16
// @homepageURL  https://github.com/xiaolan16/make-a-replay-in-maj-soul
// @match        https://game.maj-soul.com/1/
// @match        https://game.mahjongsoul.com/
// @match        https://mahjongsoul.game.yo-star.com/
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @license      Apache-2.0 License
// @downloadURL https://update.greasyfork.org/scripts/446969/%E9%9B%80%E9%AD%82%E5%9B%9E%E6%94%BE%E7%BC%96%E8%BE%91%E5%99%A8Replay_Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/446969/%E9%9B%80%E9%AD%82%E5%9B%9E%E6%94%BE%E7%BC%96%E8%BE%91%E5%99%A8Replay_Editor.meta.js
// ==/UserScript==
class Majsoul_Replay_Editor{
    save(name){
        let allreplay=GM_getValue('allreplay',{});
        saveproject();
        loadreplay();
        allreplay[name]=JSON.stringify(editdata);
        loadproject(lstscene);
        GM_setValue('allreplay',allreplay);
    }
    load(name){
        let allreplay=GM_getValue('allreplay',{});
        try{edit(JSON.parse(allreplay[name]))}catch(e){throw(e);}
    }
    saveproject(name){
        let project=GM_getValue('project',{});
        saveproject();
        project[name]=JSON.stringify(lstscene);
        GM_setValue('project',project);
    }
    loadproject(name){
        let project=GM_getValue('project',{});
        loadproject(JSON.parse(project[name]));
    }
    open(){
        unsafeWindow.getlstaction=getlstaction;
        unsafeWindow.loadproject=loadproject;
        unsafeWindow.tingpai=tingpai;

        unsafeWindow.editdata=editdata;
        unsafeWindow.settings=settings;
        unsafeWindow.gamebegin=gamebegin;
        unsafeWindow.gameend=gameend;
        unsafeWindow.edit=edit;
        unsafeWindow.canceledit=canceledit;

        unsafeWindow.roundbegin=roundbegin;
        unsafeWindow.roundend=roundend;
        unsafeWindow.randompaishan=randompaishan;
        unsafeWindow.tiles0=tiles0;
        unsafeWindow.tiles1=tiles1;
        unsafeWindow.tiles2=tiles2;
        unsafeWindow.tiles3=tiles3;
        unsafeWindow.paishan=paishan;
        unsafeWindow.muyuseats=muyuseats;
        unsafeWindow.discardtiles=discardtiles;

        unsafeWindow.mopai=mopai;
        unsafeWindow.qiepai=qiepai;
        unsafeWindow.mingpai=mingpai;
        unsafeWindow.leimingpai=leimingpai;
        unsafeWindow.notileliuju=notileliuju;
        unsafeWindow.liuju=liuju;
        unsafeWindow.hupai=hupai;

        unsafeWindow.huansanzhang=huansanzhang;
        unsafeWindow.dingque=dingque;
    }
    close(){
        try{
            unsafeWindow.getlstaction=null;
            unsafeWindow.loadproject=null;
            unsafeWindow.tingpai=null;

            unsafeWindow.editdata=null;
            unsafeWindow.settings=null;
            unsafeWindow.gamebegin=null;
            unsafeWindow.gameend=null;
            unsafeWindow.edit=null;
            unsafeWindow.canceledit=null;

            unsafeWindow.roundbegin=null;
            unsafeWindow.roundend=null;
            unsafeWindow.randompaishan=null;
            unsafeWindow.tiles0=null;
            unsafeWindow.tiles1=null;
            unsafeWindow.tiles2=null;
            unsafeWindow.tiles3=null;
            unsafeWindow.paishan=null;
            unsafeWindow.muyuseats=null;
            unsafeWindow.discardtiles=null;

            unsafeWindow.mopai=null;
            unsafeWindow.qiepai=null;
            unsafeWindow.mingpai=null;
            unsafeWindow.leimingpai=null;
            unsafeWindow.notileliuju=null;
            unsafeWindow.liuju=null;
            unsafeWindow.hupai=null;

            unsafeWindow.huansanzhang=null;
            unsafeWindow.dingque=null;
        }catch(e){throw(e);}
    }
}