
//
// ==UserScript==
//
// @name            IkaTweaks
// @description     Improvements for Ikariam
// @version         2.6
// @author          Yvonne P.
// @license         MIT; https://opensource.org/licenses/MIT
// @icon            http://de.ikariam.gameforge.com/favicon.ico
// @namespace       YveOne
// @include         /^https?:\/\/s\d+-\w+\.ikariam\.gameforge\.com.*?$/
// @run-at          document-start
//
// @downloadURL https://update.greasyfork.org/scripts/401313/IkaTweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/401313/IkaTweaks.meta.js
// ==/UserScript==
//

/* jshint esversion: 6 */
/* global $ */
/* global ikariam */
/* global ajax */
/* global GM_info */
/* global dataSetForView */
/* global LocalizationStrings */

(function(window){
    "use strict";
    var jshintUnused;

    //--------------------------------------------------------------------------------------------------
    // CONSTANTS

    const _LINKS_ = {
        OnePiece    : 'http://www.iconarchive.com/show/one-piece-character-icons-by-crountch.html',
        GreasyFork  : 'https://greasyfork.org/de/scripts/401313-ikatweaks',
        OpenUserJS  : 'https://openuserjs.org/scripts/YveOne/IkaTweaks',
        GitHubRepo  : 'https://github.com/YveOne/Userscript-IkaTweaks',
    };

    // CONSTANTS
    //--------------------------------------------------------------------------------------------------

    //--------------------------------------------------------------------------------------------------
    // SYSTEM FUNCTIONS

    function forEach(obj, func)                 {for(var k in obj){if(obj.hasOwnProperty(k)){func(obj[k],k,obj);}}}
    function jsonDecode(str, dflt)              {var obj=null;try{obj=JSON.parse(str);}catch(e){}return((obj!==null)?obj:dflt);}
    function injectCSS(cssText)                 {var el=document.createElement('style');el.setAttribute('type','text/css');if(el.styleSheet){el.styleSheet.cssText=cssText;}else{el.appendChild(document.createTextNode(cssText));}document.querySelector('head').appendChild(el);return el;}
    function hookFunction(obj, fn, cb)          {(function(of){obj[fn]=function(){var ret=of.apply(this,arguments);cb.apply(this,arguments);return ret;};}(obj[fn]));}
    function removeElement(el)                  {try{return el.parentNode.removeChild(el);}catch(e){}return null;}
    function forceInt(str)                      {return parseInt(str.replace(/\D/g, ''));}
    function random(min, max)                   {min=Math.ceil(min);max=Math.floor(max);return Math.floor(Math.random()*(max-min+1))+min; } 
    function timestamp()                        {return Math.round(Date.now()/1000)}

    // v2 (c) Yvonne P.
    function waitFor(cond)                      {return new Promise((ok,ko)=>{var tEnd=Date.now()+waitFor.timeout,ret,w4=function(){try{ret=cond();}catch(e){ret=false;}if(ret){return ok(ret);}else{if(tEnd<Date.now()){return ko();}}setTimeout(w4,waitFor.sleep);};w4();});}
    waitFor.timeout = 2000;
    waitFor.sleep = 33;

    // v3 (c) Yvonne P.
    function LocalStorageHandler(tag) {
        var data = JSON.parse(localStorage.getItem(tag)) || {
            storedKeys : {},
        };
        function unsetItem(k1) {
            var s = {};
            forEach(data.storedKeys, (_, k) => {
                if (k1 !== k) {
                    s[k] = data.storedKeys[k];
                }
            });
            if (data) {
                data.storedKeys = s;
            }
            localStorage.setItem(tag, JSON.stringify(data));
        }
        function setItem(k) {
            if (data) {
                data.storedKeys[tag] = Date.now();
                data.storedKeys[k] = Date.now();
            }
            localStorage.setItem(tag, JSON.stringify(data));
        }
        this.drop = function(key) {
            key = tag+key;
            localStorage.removeItem(key);
            unsetItem(key);
            return (typeof localStorage.getItem(key) == 'undefined');
        };
        this.save = function(key, val) {
            key = tag+key;
            localStorage.setItem(key, val);
            setItem(key);
            return (localStorage.getItem(key) == val);
        };
        this.load = function(key, dflt) {
            key = tag+key;
            var v = localStorage.getItem(key);
            return (v!==null ) ? v : dflt;
        };
        this.data = function() {
            return JSON.parse(JSON.stringify(data));
        };
        this.clear = function(t) {
            var b = true;
            if (typeof t == 'string') {
                var s = [t];
                forEach(data.storedKeys, (_, k) => {
                    s.push(' "'+k+'"');
                });
                b = confirm(s.join("\n"));
            }
            if (b) {
                forEach(data.storedKeys, (_, k) => {
                    localStorage.removeItem(k);
                });
                data = null;
                return true;
            }
            return false;
        };
    }

    // v2 (c) Yvonne P.
    function EasyTemplates(){
        var that=this,tplList={};
        var reParse=new RegExp('\\{[a-zA-Z0-9_]+\\}','gi');
        this.set=function(id,html){tplList[id]=html;};
        this.get=function(id,data){id=id||'';return (tplList[id])?that.parse(tplList[id],data):'Template "'+id+'" not found';};
        this.each=function(obj,func){var ret=[],keys=Object.keys(obj);while(keys.length){var k=keys.shift(),a=func(obj[k],k,obj);if(a)ret.push(that.get.apply(null,a));}return ret.join('');};
        this.parse=function(html,data){html=html||'';data=data||{};return html.replace(reParse,function(x){var y=data[x.substr(1,x.length-2)];return (y!==null&&y!==undefined)?y:x;});};
    }

    // v4 (c) Yvonne P.
    function LanguageHandler(useLocal,baseLocal){
        var str={},ctr={},als={};
        function get(k){return (typeof str[k]==='string')?str[k]:k;}
        function set(c,l,n){if(c instanceof Array){while(c.length){set(c.shift(),n);}return;}if(als[c]===useLocal){c=als[c];}ctr[c]=l;if(c===baseLocal){Object.keys(n).forEach((k)=>{var v=n[k];if(v!==null){str[k]=(typeof str[k]=='string')?str[k]:v.toString();}});}else{if(c===useLocal){Object.keys(n).forEach((k)=>{var v=n[k];if(v!==null){str[k]=v.toString();}});}}}
        var ret=function(){if(arguments.length===1)return get.apply(null,arguments);if(arguments.length===3)return set.apply(null,arguments);return str;};
        ret.codes=function(){return JSON.parse(JSON.stringify(ctr));};
        ret.alias=function(a,b){als[a]=b;};
        ret.local=function(){return useLocal;};
        return ret;
    }

    const TPL  = new EasyTemplates();
    const LS   = new LocalStorageHandler('IkaTweaks_');
    const LANG = LanguageHandler(LS.load('LANG', location.hostname.match(/s\d+\-(\w+)\.ikariam\.gameforge\.com/i)[1]), 'en');

    (function(){
        var _injectCSS=injectCSS,queue=[],headAvailable=false;
        injectCSS=function(css,cb){if(headAvailable){(cb||function(){})(_injectCSS(css));}else{queue.push([css,cb]);}};
        waitFor(()=>{return document.querySelector('head');}).then(()=>{headAvailable=true;while(queue.length){injectCSS.apply(null,queue.shift());}}).catch(()=>{});
    }());

    // SYSTEM FUNCTIONS
    //--------------------------------------------------------------------------------------------------

    //--------------------------------------------------------------------------------------------------
    // HTML: Select DropDown

    TPL.set('SelectContainer', `
        <div id="js_{selectId}Container" class="select_container size{selectSize}">
            <select id="js_{selectId}Options" class="dropdown" name="{selectId}Options">
                {selectOptions}
            </select>
        </div>
    `);

    TPL.set('SelectOption', `
        <option value="{value}" {selected}>{text}</option>
    `);

    function SelectDropDown(selectId, size, options, selected) {
        this.val = function() {
            return $(`#js_${selectId}Options`).val();
        };
        this.tpl = function() {
            return TPL.get('SelectContainer', {
                selectSize      : size,
                selectId        : selectId,
                selectOptions   : TPL.each(options, function(v, k){
                    return ['SelectOption', {
                        value   : k,
                        text    : v,
                        selected: (selected == k) ? 'selected="selected"' : '',
                    }];
                }),
            });
        };
        this.change = function(cb) {
            $('#js_'+selectId+'Options').change(cb);
        };
    }

    // HTML: Select DropDown
    //--------------------------------------------------------------------------------------------------

    //--------------------------------------------------------------------------------------------------
    // HTML: Checkboxes

    function isChecked(id) {
        return $(id+'Img').hasClass('checked');
    }

    // HTML: Checkboxes
    //--------------------------------------------------------------------------------------------------

    //--------------------------------------------------------------------------------------------------
    // CORE

    waitFor.ajaxResponder = (function(waitFor){
        var resp = false, queue = [];
        waitFor(() => { return ikariam.controller; }).then((n) => {
            if(n.ajaxResponder===null){n.ajaxResponder=ikariam.getClass(ajax.Responder);}
            resp = n.ajaxResponder; while(queue.length) queue.shift()[0](resp);
        }).catch(() => { while(queue.length) queue.shift()[1](resp); });
        return function() {
            return new Promise((ok, ko) => { if (resp) { ok(resp); } else { queue.push([ok, ko]); } });
        };
    }(waitFor));

    const IkaTweaks = {};
    (function(IkaTweaks){

        var coreData = jsonDecode(LS.load('Core'), {});
        function coreDataSave() {
            LS.save('Core', JSON.stringify(coreData));
        }

        const mainViewIcon = 'https://raw.githubusercontent.com/YveOne/Userscript-IkaTweaks/master/images/mainViewIcon.png';
        var enabledModules = jsonDecode(LS.load('modules'), {});
        var definedModules = {};
        var sidebarButtons = [];

        function loadModule(modId) {
            var modData = jsonDecode(LS.load(modId), {});
            definedModules[modId].func(modData, function() {
                LS.save(modId, JSON.stringify(modData));
            });
        }

        injectCSS(`
            #IkaTweaks_sidebar1 .centerButton .button {width:200px;margin:2px 0px;}
            #IkaTweaks_sidebar2 .centerButton .button {width:200px;margin:2px 0px;}
            #IkaTweaks_c:before,
            #UpdateChecker_c:before {
                content: url('${mainViewIcon}');
            }
            /** extend h3 header **/
            .contentBox01h .header.hidden {
                overflow: hidden;
                height: 0px;
                padding-top: 7px;
            }
        `);

        IkaTweaks.setModule = function(modId, modFunc) {
            if (typeof enabledModules[modId] == 'undefined') enabledModules[modId] = false;
            definedModules[modId] = {
                name: `{str_${modId}_name}`,
                info: `{str_${modId}_info}`,
                func: modFunc,
            };
            if (enabledModules[modId]) {
                loadModule(modId);
            }
            // window icon
            injectCSS(`#${modId}_c:before { content: url('${mainViewIcon}'); }`);
        };

        IkaTweaks.addSidebarButton = function(btnText, btnFunc, useTop) {
            sidebarButtons.push({text:btnText,func:btnFunc,useTop:useTop});
        };

        IkaTweaks.success = function(t) {
            if (!t) {
                t = LANG('str_success'+random(0,4));
            }
            ikariam.controller.ajaxResponder.provideFeedback([{ location: 1, text: t, type: 10 }]);
        };
        IkaTweaks.warning = function(t) {
            ikariam.controller.ajaxResponder.provideFeedback([{ location: 1, text: t, type: 11 }]);
        };
        IkaTweaks.notice = function(t) {
            ikariam.controller.ajaxResponder.provideFeedback([{ location: 1, text: t, type: 12 }]);
        };

        IkaTweaks.changeHTML = function(id, html) {
            return new Promise((ok, ko) => {
                waitFor.ajaxResponder().then((ajaxResponder) => {
                    html = TPL.get('IkaTweaksFrame', {
                        version : GM_info.script.version,
                        mainview: html,
                        buttons1: TPL.each(sidebarButtons, function(btn, i){
                            return (!btn.useTop) ? null : ['IkaTweaksSidebar_button', {
                                btnId: 'IkaTweaksSidebar_button'+i,
                                btnText: btn.text
                            }];
                        }),
                        buttons2: TPL.each(sidebarButtons, function(btn, i){
                            return (btn.useTop) ? null : ['IkaTweaksSidebar_button', {
                                btnId: 'IkaTweaksSidebar_button'+i,
                                btnText: btn.text
                            }];
                        }),
                    });

                    html = TPL.parse(html, LANG());
                    ajaxResponder.changeHTML([id,html], true);
                    setTimeout(ikariam.controller.adjustSizes, 1000);

                    var sidebarButtonsLength = sidebarButtons.length;
                    for(var i=0; i<sidebarButtonsLength; i++) {
                        $('#IkaTweaksSidebar_button'+i).click(sidebarButtons[i].func);
                    }

                    $('table.table01 tr').not(':even').addClass('alt');
                    ikariam.controller.replaceCheckboxes();
                    ikariam.controller.replaceDropdownMenus();
                    ok();
                }).catch(ko);
            });
        };

        TPL.set('IkaTweaksFrame', `
            <div class="dynamic" id="IkaTweaks_sidebar1">
                <h3 class="header">{str_IkaTweaks} {version}</h3>
                <div class="content"><div class="centerButton">{buttons1}</div></div>
                <div class="footer"></div>
            </div>
            <div class="dynamic" id="IkaTweaks_sidebar2">
                <h3 class="header">{str_modules}</h3>
                <div class="content"><div class="centerButton">{buttons2}</div></div>
                <div class="footer"></div>
            </div>
            {mainview}
        `);

        TPL.set('IkaTweaksSidebar_button', `
            <button id="{btnId}" class="button">{btnText}</button>
        `);

        TPL.set('IkaTweaks_tabbedWindow', `
            <div id="mainview">
                <div class="buildingDescription"><h1>{str_IkaTweaks_menu}</h1></div>
                <ul class="tabmenu">
                    <li class="tab" id="js_tab_IkaTweaks_modulesWindow"><b>{str_IkaTweaks_tabModules}</b></li>
                    <li class="tab" id="js_tab_IkaTweaks_aboutWindow"><b>{str_IkaTweaks_tabAbout}</b></li>
                    <li class="tab" id="js_tab_IkaTweaks_versionWindow"><b>{str_IkaTweaks_version}</b></li>
                    <li class="tab" id="js_tab_IkaTweaks_changelogWindow"><b>{str_IkaTweaks_changelog}</b></li>
                </ul>
                <div>
                    {mainviewContent}
                </div>
            </div>
        `);

        TPL.set('IkaTweaks_modulesWindow', `
            <div class="contentBox01h" style="z-index: 101;">
                <h3 class="header">{str_IkaTweaks_tabModules}</h3>
                <div class="content">
                    <table class="table01"><tbody>
                        <tr>
                            <th style="width:50px;">{str_enabled}</th>
                            <th style="width:200px;">{str_name}</th>
                            <th>{str_description}</th>
                        </tr>
                        {modulesTR}
                        <tr>
                            <th colspan="3">
                                <div class="centerButton">
                                    <input id="js_IkaTweaks_saveModulesButton" type="button" class="button" value="{str_save}" />
                                </div>
                            </th>
                        </tr>
                    </tbody></table>
                </div>
                <div class="footer"></div>
            </div>
        `);

        TPL.set('IkaTweaks_modulesTR', `
            <tr class="{trClass}">
                <td><input id="IkaTweaksMainview_Checkbox{modId}" type="checkbox" class="notifications checkbox" {checked}></td>
                <td>{modName}</td>
                <td>{modInfo}</td>
            </tr>
        `);

        TPL.set('IkaTweaks_aboutWindow', `
            <div class="contentBox01h" style="z-index: 101;">
                <div class="header" style="height:0px;"></div>
                <div class="content">
                    <table class="table01"><tbody>
                        <tr>
                            <th style="width:150px;">{select}</th>
                            <th class="left">
                                <input id="js_IkaTweaks_saveLanguageButton" style="width:150px;" type="button" class="button" value="{str_saveLanguage}" />
                            </th>
                        </tr>
                    </tbody></table>
                </div>
                <div class="footer"></div>
            </div>
            <div class="contentBox01h" style="z-index: 101;">
                <h3 class="header">{str_IkaTweaks_aboutHeader}</h3>
                <div class="content">
                    <table class="table01"><tbody>
                        <tr>
                            <td colspan="2" class="center">
                                {str_IkaTweaks_aboutText2}
                                <div class="centerButton">
                                    <a id="js_IkaTweaks_openGreasyForkButton" class="button">{str_ToGreasyForkText}</a>
                                    <a id="js_IkaTweaks_openOpenUserJSButton" class="button">{str_ToOpenUserJSText}</a>
                                    <a id="js_IkaTweaks_openGitHubRepoButton" class="button">{str_ToGitHubRepoText}</a>
                                </div>
                            </td>
                        </tr>
                    </tbody></table>
                </div>
                <div class="footer"></div>
            </div>
            <div class="contentBox01h" style="z-index: 101;">
                <div class="header" style="height:0px;"></div>
                <div class="content">
                    <table class="table01"><tbody>
                        <tr>
                            <th style="min-width:150px;"><input id="js_IkaTweaks_clearStorageButton" style="min-width:150px;" type="button" class="button" value="{str_ClearStorageText}" /></th>
                            <th class="left">{str_ClearStorageInfo}</th>
                        </tr>
                    </tbody></table>
                </div>
                <div class="footer"></div>
            </div>
            <div class="contentBox01h" style="z-index: 101;">
                <h3 class="header">{str_IkaTweaks_creditsHeader}</h3>
                <div class="content">
                    <table class="table01 left"><tbody>
                        <tr>
                            <td>
                                {str_IkaTweaks_aboutCredits}
                            </td>
                        </tr>
                    </tbody></table>
                </div>
                <div class="footer"></div>
            </div>
        `);

        TPL.set('IkaTweaks_versionWindow', `
            <div class="contentBox01h">
                <h3 class="header">{str_IkaTweaks_version}</h3>
                <div class="content">
                    <table class="table01 left"><tbody>
                        {settingsTR}
                        <tr>
                            <th colspan="2">
                                <div class="centerButton">
                                    <input id="js_IkaTweaks_saveVersionSettingsButton" type="button" class="button" value="{str_save}" />
                                </div>
                            </th>
                        </tr>
                    </tbody></table>
                </div>
                <div class="footer"></div>
            </div>
            <div class="contentBox01h">
                <h3 class="header hidden"></h3>
                <div class="content">
                    <table class="table01" id="IkaTweaks_newVersionsTable">
                        <tr>
                            <th class="left" style="width:150px;">
                                <input id="js_IkaTweaks_versionCheckButton" style="width:150px;" type="button" class="button" value="{str_versionForceCheck}" />
                            </th>
                            <th class="left">
                                {str_versionLastCheckResult}: {lastResult}
                            </th>
                        </tr>
                    </table>
                </div>
                <div class="footer"></div>
            </div>
            <div class="contentBox01h" style="z-index: 101;display:none;" id="js_IkaTweaks_newVersionLinks">
                <h3 class="header">{str_versionGetNewestHere}</h3>
                <div class="content">
                    <table class="table01">
                        <tr>
                            <th class="center">
                                <div class="centerButton">
                                    <a id="js_IkaTweaks_openGreasyForkButton" class="button">{str_ToGreasyForkText}</a>
                                    <a id="js_IkaTweaks_openOpenUserJSButton" class="button">{str_ToOpenUserJSText}</a>
                                    <a id="js_IkaTweaks_openGitHubRepoButton" class="button">{str_ToGitHubRepoText}</a>
                                </div>
                            </th>
                        </tr>
                    </table>
                </div>
                <div class="footer"></div>
            </div>
        `);

        TPL.set('IkaTweaks_settingTR', `
            <tr>
                <td width="50"><input id="IkaTweaks_settingCheckbox{id}" type="checkbox" class="checkbox" {checked}></td>
                <td>{text}</td>
            </tr>
        `);

        TPL.set('IkaTweaks_changelogWindow', `
            <div class="contentBox01h">
                <h3 class="header">{str_IkaTweaks_changelog}</h3>
                <div class="content">
                    <table class="table01" id="js_IkaTweaks_changelogTable">

                    </table>
                </div>
                <div class="footer"></div>
            </div>
        `);

        if(typeof coreData.versionLastCheck     == 'undefined') coreData.versionLastCheck   = 0;
        if(typeof coreData.versionAutoCheck     == 'undefined') coreData.versionAutoCheck   = false;
        var versionNow = false;
        var versionNew = false;
        var versionCheckResult = '-';
        (function(v){
            versionNow = [
                parseInt(v[0]), // major
                parseInt(v[1]), // minor
            ];
        })(GM_info.script.version.match(/\d+/g));

        function versionCheck(onSuccess, onError) {
            var image = new Image();
            image.onload = function(){
                var versionChk = [ image.width-1, image.height-1 ];
                if ((versionChk[0] > versionNow[0]) || (versionChk[0] === versionNow[0] && versionChk[1] > versionNow[1])) {
                    versionCheckResult = '{str_versionNewAvailable}: v'+versionChk.join('.');
                    versionNew = versionChk;
                    onSuccess(true);
                } else {
                    versionCheckResult = '{str_versionUpToDate}';
                    onSuccess(false);
                }
            };
            image.onerror = onError;
            image.src = 'https://raw.githubusercontent.com/YveOne/Userscript-IkaTweaks/master/versions/versionImage.gif';
            coreData.versionLastCheck = timestamp();
            coreDataSave();
        }

        function versionAutoCheck() {
            if (coreData.versionAutoCheck) {
                if (coreData.versionLastCheck < timestamp()-86400) {
                    versionCheck(function(result) {
                        if (result) {
                            alert('IkaTweaks: ' + versionCheckResult);
                        }
                    });
                }
                setTimeout(versionAutoCheck, 3600);
            }
        }
        setTimeout(versionAutoCheck, 3600);
        versionAutoCheck();

        function versionShowNewList(cb) {
            var table = $('#IkaTweaks_newVersionsTable');
            var curMajor = versionNow[0];
            var curMinor = versionNow[1]+1;
            var newMajor = versionNew[0];
            var newMinor = versionNew[1];
            if (newMajor > curMajor) {
                curMajor = newMajor;
                curMinor = 0;
            }
            function loop() {
                var image = new Image();
                image.onload = function(){
                    table.prepend($('<tr></tr>').append($('<td colspan="2" class="left"></td>').append(image)));
                    curMinor++;
                    loop();
                };
                image.onerror = function(){
                    $('#js_IkaTweaks_newVersionLinks').show();
                    ikariam.controller.adjustSizes();
                    if (cb) cb();
                };
                image.src = 'https://raw.githubusercontent.com/YveOne/Userscript-IkaTweaks/master/versions/version'+curMajor+'.'+curMinor+'.png';
            }
            loop();
        }

        function changelogShowList(cb) {
            var table = $('#js_IkaTweaks_changelogTable');
            var curMajor = versionNow[0];
            var curMinor = 0;
            function loop() {
                var image = new Image();
                image.onload = function(){
                    table.prepend($('<tr></tr>').append($('<td colspan="2" class="left"></td>').append(image)));
                    curMinor++;
                    loop();
                };
                image.onerror = cb;
                image.src = 'https://raw.githubusercontent.com/YveOne/Userscript-IkaTweaks/master/versions/version'+curMajor+'.'+curMinor+'.png';
            }
            loop();
        }












        var tutorialHintInterval;
        var showSettingsWindow, showAboutWindow;
        var showVersionWindow, showChangelogWindow;

        showSettingsWindow = function(){
            IkaTweaks.changeHTML('IkaTweaks', TPL.get('IkaTweaks_tabbedWindow', {
                mainviewContent: TPL.get('IkaTweaks_modulesWindow', {
                    modulesTR: TPL.each(definedModules, (mod, modId) => {
                        return ['IkaTweaks_modulesTR', {
                            modId   : modId,
                            modName : mod.name,
                            modInfo : mod.info,
                            checked : enabledModules[modId] ? 'checked="checked"' : '',
                        }];
                    }),
                }),
            })).then(() => {
                $('#js_tab_IkaTweaks_modulesWindow').click(showSettingsWindow);
                $('#js_tab_IkaTweaks_aboutWindow').click(showAboutWindow);
                $('#js_tab_IkaTweaks_versionWindow').click(showVersionWindow);
                $('#js_tab_IkaTweaks_changelogWindow').click(showChangelogWindow);
                $('#js_tab_IkaTweaks_modulesWindow').addClass('selected');
                $('#js_IkaTweaks_saveModulesButton').click(function(){
                    var l = {};
                    forEach(definedModules, (_, modId) => {
                        l[modId] = isChecked('#IkaTweaksMainview_Checkbox'+modId);
                    });
                    enabledModules = l;
                    LS.save('modules', JSON.stringify(enabledModules));
                    LS.save('reopenSettingWindow', '1');
                    location.reload();
                });
                if(document.getElementById('js_IkaTweaks_tutorialArrow')) {
                    clearInterval(tutorialHintInterval);
                    LS.save('tutorialDone', '1');
                    $('#js_IkaTweaks_tutorialArrow').fadeOut();
                }
            }).catch(() => {});
        };

        showAboutWindow = function(){

            var LangSelect = new SelectDropDown('IkaTweaks_Languages', 175, LANG.codes(), LANG.local());

            IkaTweaks.changeHTML('IkaTweaks', TPL.get('IkaTweaks_tabbedWindow', {
                mainviewContent: TPL.get('IkaTweaks_aboutWindow', {
                    select  : LangSelect.tpl(),
                }),
            })).then(() => {
                $('#js_tab_IkaTweaks_modulesWindow').click(showSettingsWindow);
                $('#js_tab_IkaTweaks_aboutWindow').click(showAboutWindow);
                $('#js_tab_IkaTweaks_versionWindow').click(showVersionWindow);
                $('#js_tab_IkaTweaks_changelogWindow').click(showChangelogWindow);
                $('#js_tab_IkaTweaks_aboutWindow').addClass('selected');
                $('#js_IkaTweaks_saveLanguageButton').click(function(){
                    LS.save('LANG', LangSelect.val());
                    LS.save('reopenSettingWindow', '1');
                    location.reload();
                });
                $('#js_IkaTweaks_clearStorageButton').click(function(){
                    if(LS.clear()) {
                        LS.save('reopenSettingWindow', '1');
                        location.reload();
                    }
                });
                $('#js_IkaTweaks_openGreasyForkButton').attr({
                    'href': _LINKS_.GreasyFork,
                    'target': '_blank',
                });
                $('#js_IkaTweaks_openOpenUserJSButton').attr({
                    'href': _LINKS_.OpenUserJS,
                    'target': '_blank',
                });
                $('#js_IkaTweaks_openGitHubRepoButton').attr({
                    'href': _LINKS_.GitHubRepo,
                    'target': '_blank',
                });
                $('#myEmail').attr('style', 'position:absolute;width:82px;height:14px;display:inline-block;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFIAAAAOCAYAAAC8YEsXAAAACXBIWXMAAAsTAAALEwEAmpwYAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAADP0lEQVR42mL8//8/wyigHAAEEAuMEaor8A7KTAfi1WSYFQrEaUDsCsRKUH4nCfrLgdgFiI2h/LNAvAfNjA4oXQHEu4F4FpluJQRAYSFEwK8zQYzVlz+A1QEEEAuSpCDUgWfJtPws1GPIHiYWnIEG4Cxo4DFAI6MDGriuSGIwMIsCtxICgkT4tRPZnwABxISmACR5D8qeCY0ZEF6FpEYJ6nGYeAc0EAShtDHU8y7QVAaLQZieu1A+DOyG0oxQM8qhZtyDRqwSkjnIwBhJfSia+2YiqUF2qxKeFAZTV44lp9yFysEC7h56bgMIICYcBq+CZtNOKA5FMuQMUqAbI2VJF6gedKAENQ8Wi2eRIgYW8CbQADWGqlFCss8VRwpPg9opiOb5NKg5sAi/h2TmGSLc14EWwB3Q4qMTas8qbAEGEECMsMoGWEb+h6YKWCzsQco6yA46g6QOBP5DUw5MnxCSZWFYyktjJDNWIZWFIDFlqD1K0FQA47/DYu47qJmr0dTC3CMIDWgTNLeaoBUJHWjqkN13Buq2CixyYPOAZSSYDRBAuFLkPaij/0MxrAIAWfgeTe17AuXJPaj+d1CzkFOFCzQw0qAOvoekB5kWJGD+PaSUyICUAo2R/PAfyU70FHkPrfxDlitH0n8GlyMAAghf1t4DjSVGpJrxHhZPESqYO5BSJCNaakY24z2anntI2YtQpTILGpBpSGrfQ/3AiIRNsLQk3qP5QQlNrgKLGRgAIICY8DgOlrWRC/PVaLVyBxE1nyCecuoeUkCFIqWAciSxVdAmGT7QCbUnDSmgZqFVeOVQu5WwRAKyOuQycDVSZQqT243NAQABxITHYbCs3QH1lBJS+QRL7ml4mgcuUIfDPPkfWpa9RypvVkPN6oRG3F0kPiwQYeWsEhFNEuTIPgtNTR1I/qiARl45tKjBpg45Z1RAzTsDlXPBFakAAYSrsiGUVSsIFOCkNn73IHkSWzHjQqCBPFAAXtkABBATFkcbE9CcBk05q6CB8J7ChrEJNMXeRTJ3FVIqEMRVLg0gMEZvBgEEEBNaeUCsx1cjlS+UppR70LaiMlLPiAGpsnPFkVIHA4CHGUAAMY4OWlAHAAQYAH37+Z/ovMxFAAAAAElFTkSuQmCC);');
                $('#myEmail').after('<span style="width:82px;height:1px;display:inline-block;"></span>');
                $('#creditUrl1').attr({
                    'href': _LINKS_.OnePiece,
                    'target': '_blank',
                }).html(_LINKS_.OnePiece);

            }).catch(() => {});
        };

        showVersionWindow = function(){
            var checkboxes = {
                versionAutoCheck    : coreData.versionAutoCheck,
            };
            IkaTweaks.changeHTML('IkaTweaks', TPL.get('IkaTweaks_tabbedWindow', {
                mainviewContent: TPL.get('IkaTweaks_versionWindow', {
                    lastResult: versionCheckResult,
                    settingsTR: TPL.each(checkboxes, (checked, k) => {
                        return ['IkaTweaks_settingTR', {
                            id      : k,
                            text    : '{str_'+k+'}',
                            checked : (checked) ? 'checked="checked"' : '',
                        }];
                    }),
                }),
            })).then(() => {
                $('#js_tab_IkaTweaks_modulesWindow').click(showSettingsWindow);
                $('#js_tab_IkaTweaks_aboutWindow').click(showAboutWindow);
                $('#js_tab_IkaTweaks_versionWindow').click(showVersionWindow);
                $('#js_tab_IkaTweaks_changelogWindow').click(showChangelogWindow);
                $('#js_tab_IkaTweaks_versionWindow').addClass('selected');

                $('#js_IkaTweaks_openGreasyForkButton').attr({
                    'href': _LINKS_.GreasyFork,
                    'target': '_blank',
                });
                $('#js_IkaTweaks_openOpenUserJSButton').attr({
                    'href': _LINKS_.OpenUserJS,
                    'target': '_blank',
                });
                $('#js_IkaTweaks_openGitHubRepoButton').attr({
                    'href': _LINKS_.GitHubRepo,
                    'target': '_blank',
                });

                $('#js_IkaTweaks_versionCheckButton').click(function(){
                    $('#js_IkaTweaks_versionCheckButton').attr('disabled', 'disabled');
                    versionCheck(function(result){
                        showVersionWindow();
                        IkaTweaks.success();
                    },function(){
                        IkaTweaks.warning(LANG('str_UpdateChecker_checkFailed'));
                    });
                });
                $('#js_IkaTweaks_saveVersionSettingsButton').click(function(){
                    forEach(checkboxes, (_, k) => {
                        coreData[k] = isChecked('#IkaTweaks_settingCheckbox'+k);
                    });
                    coreDataSave();
                    IkaTweaks.success();
                });
                if (versionNew) {
                    versionShowNewList();
                }
            }).catch(() => {});
        };

        showChangelogWindow = function(){
            var checkboxes = {
                versionAutoCheck    : coreData.versionAutoCheck,
            };
            IkaTweaks.changeHTML('IkaTweaks', TPL.get('IkaTweaks_tabbedWindow', {
                mainviewContent: TPL.get('IkaTweaks_changelogWindow', {
                }),
            })).then(() => {
                $('#js_tab_IkaTweaks_modulesWindow').click(showSettingsWindow);
                $('#js_tab_IkaTweaks_aboutWindow').click(showAboutWindow);
                $('#js_tab_IkaTweaks_versionWindow').click(showVersionWindow);
                $('#js_tab_IkaTweaks_changelogWindow').click(showChangelogWindow);
                $('#js_tab_IkaTweaks_changelogWindow').addClass('selected');
                changelogShowList(() => {
                    ikariam.controller.adjustSizes();
                });
            }).catch(() => {});
        };

        waitFor(() => {
            return ($ !== undefined);
        }).then(() => {
            $('#GF_toolbar ul li.options').after($('<li></li>').append($('<a>',{
                'id'   : 'IkaTweaksToolbarButton',
                'click': function(){ showSettingsWindow();return false; },
                'href' : '#',
                'class': 'noViewParameters',
                'title': 'IkaTweaks',
                'text' : 'IkaTweaks'
            })));
            var tutorialDone = LS.load('tutorialDone');
            var showArrow = !tutorialDone;
            switch(LS.load('version', false)) {
                case false:
                    if (tutorialDone) {
                        alert(`IkaTweaks: Important information!\n\nThis new version contains a lot of changes and bug fixes. Please open the menu and check your settings.\nSorry for the inconveniences and thanks for using (and supporting) IkaTweaks =)`);
                        showArrow = true;
                    }
                    break;
            }
            LS.save('version', GM_info.script.version);
            if(showArrow) {
                var e=20;
                var arrow = $('<div>').attr({
                    'id': 'js_IkaTweaks_tutorialArrow',
                    'class': 'aniArrow',
                    'style': 'top:'+e+'px;display:block;',
                }).appendTo($('#IkaTweaksToolbarButton'))[0];
                var arrowCounter=0;
                tutorialHintInterval = setInterval(function(){
                    arrow.style.top = (e+(Math.sin(++arrowCounter/15)*10))+'px';
                }, 10);
            }
            if(LS.load('reopenSettingWindow')) {
                LS.drop('reopenSettingWindow');
                showSettingsWindow();
            }
        }).catch(() => {});

        IkaTweaks.addSidebarButton('{str_IkaTweaks_menu}', showSettingsWindow, true);

    })(IkaTweaks);

    // CORE
    //--------------------------------------------------------------------------------------------------

    //--------------------------------------------------------------------------------------------------
    // MODULE: GeneralTweaks

    IkaTweaks.setModule('GeneralTweaks', function(modData, modDataSave){

        // bug fixes
        if(typeof modData.fixResearchWindowList     == 'undefined') modData.fixResearchWindowList       = true;
        if(typeof modData.fixCitySelectItems        == 'undefined') modData.fixCitySelectItems          = true;
        if(typeof modData.fixWindowTopPadding       == 'undefined') modData.fixWindowTopPadding         = true;
        if(typeof modData.fixScrollbars             == 'undefined') modData.fixScrollbars               = true;
        if(typeof modData.fixHoverEffectSwitching   == 'undefined') modData.fixHoverEffectSwitching     = true;
        if(typeof modData.fixDarkSelectActiveColor  == 'undefined') modData.fixDarkSelectActiveColor    = true;
        if(typeof modData.fixWindowTabSizes         == 'undefined') modData.fixWindowTabSizes           = true;
        if(typeof modData.removeBlueLinkBorders     == 'undefined') modData.removeBlueLinkBorders       = true;


        // anti ads
        if(typeof modData.adsHideSpeedUpButtons     == 'undefined') modData.adsHideSpeedUpButtons       = modData.adsHideSpeedUpButton || false;
        if(typeof modData.adsHideWindowAds          == 'undefined') modData.adsHideWindowAds            = true;
        if(typeof modData.adsHideHappyHour          == 'undefined') modData.adsHideHappyHour            = false;
        if(typeof modData.adsHideOfferBoxes         == 'undefined') modData.adsHideOfferBoxes           = true;
        if(typeof modData.adsHideSlotResourceShop   == 'undefined') modData.adsHideSlotResourceShop     = false;
        if(typeof modData.adsHideSlotPremiumTrader  == 'undefined') modData.adsHideSlotPremiumTrader    = false;
        if(typeof modData.adsHideArchiveButtons     == 'undefined') modData.adsHideArchiveButtons       = false;
        if(typeof modData.adsHideMilitaryDummies    == 'undefined') modData.adsHideMilitaryDummies      = false;
        if(typeof modData.adsHideAdvisorButtons     == 'undefined') modData.adsHideAdvisorButtons       = false;
        if(typeof modData.adsHideToolbarMMOAds      == 'undefined') modData.adsHideToolbarMMOAds        = false;

        // animations
        if(typeof modData.animHideWalkers           == 'undefined') modData.animHideWalkers         = false;
        if(typeof modData.animHideBirdsOnly         == 'undefined') modData.animHideBirdsOnly       = false;
        if(typeof modData.animHideWalkerBubbles     == 'undefined') modData.animHideWalkerBubbles   = false;

        // cities
        if(typeof modData.cityIgnoreCapital             == 'undefined') modData.cityIgnoreCapital           = false;
        if(typeof modData.cityHidePirateFortress        == 'undefined') modData.cityHidePirateFortress      = false;
        if(typeof modData.cityHideLockedPosition        == 'undefined') modData.cityHideLockedPosition      = false;
        if(typeof modData.cityUseCustomBackground       == 'undefined') modData.cityUseCustomBackground     = false;
        if(typeof modData.cityCustomBackground          == 'undefined') modData.cityCustomBackground        = 0;
        if(typeof modData.cityHideDailyTasks            == 'undefined') modData.cityHideDailyTasks          = false;
        if(typeof modData.cityHideRegistrationGifts     == 'undefined') modData.cityHideRegistrationGifts   = false;
        if(typeof modData.cityHideFlyingShop            == 'undefined') modData.cityHideFlyingShop          = true;
        if(typeof modData.cityHideAmbrosiaFountain      == 'undefined') modData.cityHideAmbrosiaFountain    = true;

        // ressources
        if(typeof modData.resShowMissing                == 'undefined') modData.resShowMissing              = modData.ressShowMissing || true;
        if(typeof modData.resShowRemaining              == 'undefined') modData.resShowRemaining            = modData.ressShowRemaining || false;
        if(typeof modData.warehouseShowRemainingSave    == 'undefined') modData.warehouseShowRemainingSave  = false;

        // interactive
        if(typeof modData.cityHoverToBackground         == 'undefined') modData.cityHoverToBackground       = modData.fixHoverToBackground || false;
        if(typeof modData.islandHoverToBackground       == 'undefined') modData.islandHoverToBackground     = modData.fixHoverToBackground || false;
        if(typeof modData.actShowMouseoverPlaques       == 'undefined') modData.actShowMouseoverPlaques     = false;
        if(typeof modData.actHideMouseoverTitles        == 'undefined') modData.actHideMouseoverTitles      = false;
        if(typeof modData.actPreventPlaqueScaling       == 'undefined') modData.actPreventPlaqueScaling     = false;

        // fleets
        if(typeof modData.fleetHideSpeedColumn          == 'undefined') modData.fleetHideSpeedColumn        = false;
        if(typeof modData.fleetHidePremiumFleetInfo     == 'undefined') modData.fleetHidePremiumFleetInfo   = false;
        if(typeof modData.fleetShowCapacities           == 'undefined') modData.fleetShowCapacities         = false;
        if(typeof modData.fleetDontBreakLines           == 'undefined') modData.fleetDontBreakLines         = false;
        if(typeof modData.fleetReadableFilterButtons    == 'undefined') modData.fleetReadableFilterButtons  = false;
        if(typeof modData.fleetHideZeroFilterButtons    == 'undefined') modData.fleetHideZeroFilterButtons  = false;
        if(typeof modData.fleetMouseOverFleetInfo      == 'undefined') modData.fleetMouseOverFleetInfo    = false;




        ///////////////////////////////////////////////////////////////////////

        const CITY_BACKGROUNDS_COUNT = 5;
        const CITY_BACKGROUNDS = [
            {
                'nw': '//gf2.geo.gfsrv.net/cdn1b/1e250328264c77f3d5d2de7176bf3b.jpg',
                'ne': '//gf1.geo.gfsrv.net/cdnc1/552b032dccb6186776fa0a8e7aff38.jpg',
                'sw': '//gf1.geo.gfsrv.net/cdn36/d1c51f8791b8dd42887b4f4cab84a5.jpg',
                'se': '//gf2.geo.gfsrv.net/cdna2/bc0dc662a07cc16cdd6622f599a7cb.jpg',
            },
            {
                'nw': '//gf1.geo.gfsrv.net/cdn01/29c74235f5eff480c7f7c205e644fe.jpg',
                'ne': '//gf3.geo.gfsrv.net/cdn54/ee1e1655ebd0b1a7e5c0bc584824a4.jpg',
                'sw': '//gf1.geo.gfsrv.net/cdnf7/07f4d3bb04d1cfc0ec565aee163ed2.jpg',
                'se': '//gf2.geo.gfsrv.net/cdn14/0aee9fee17624ef1322ee6f6133309.jpg',
            },
            {
                'nw': '//gf1.geo.gfsrv.net/cdn3b/2b919d92c79b0b9a80cefafe88ef58.jpg',
                'ne': '//gf3.geo.gfsrv.net/cdne1/4d56d4e51fefd7cd46ece81109f119.jpg',
                'sw': '//gf2.geo.gfsrv.net/cdn10/df064c1633744b1c33cc4573575891.jpg',
                'se': '//gf3.geo.gfsrv.net/cdnba/1c46d69d1413178b52ac9a82f32048.jpg',
            },
            {
                'nw': '//gf3.geo.gfsrv.net/cdn88/88e5a1eb809101da2282719be49d7e.jpg',
                'ne': '//gf2.geo.gfsrv.net/cdn42/7345451d8a2b1184ef6b6df6878267.jpg',
                'sw': '//gf2.geo.gfsrv.net/cdn43/a6f005720cf4571d51aebaa2437036.jpg',
                'se': '//gf3.geo.gfsrv.net/cdn81/cd248b5153bee36d2308765f7894bd.jpg',
            },
            {
                'nw': '//gf2.geo.gfsrv.net/cdn1a/3d1c1893f5c157a63e54560d9c1604.jpg',
                'ne': '//gf2.geo.gfsrv.net/cdn44/462ee215d7a6c299758d0c30aa48bc.jpg',
                'sw': '//gf2.geo.gfsrv.net/cdna6/44fb3d605e47d91f1b978788be16ed.jpg',
                'se': '//gf2.geo.gfsrv.net/cdn40/c52fc8f2b70787f27a15b4f62e323c.jpg',
            },
        ];

        const CITY_BACKGROUNDS_CAPITAL = [
            {
                'nw': '//gf2.geo.gfsrv.net/cdn1b/1e250328264c77f3d5d2de7176bf3b.jpg',
                'ne': '//gf2.geo.gfsrv.net/cdn1b/2a9c139ad689ed5a5838d1b5d65bb5.jpg',
                'sw': '//gf1.geo.gfsrv.net/cdn36/d1c51f8791b8dd42887b4f4cab84a5.jpg',
                'se': '//gf3.geo.gfsrv.net/cdnea/94eaf99ed5ac493a18ed532df203fa.jpg',
            },
            {
                'nw': '//gf1.geo.gfsrv.net/cdn01/29c74235f5eff480c7f7c205e644fe.jpg',
                'ne': '//gf3.geo.gfsrv.net/cdnbd/5316ff26044f7fa39c37e905024309.jpg',
                'sw': '//gf1.geo.gfsrv.net/cdnf7/07f4d3bb04d1cfc0ec565aee163ed2.jpg',
                'se': '//gf3.geo.gfsrv.net/cdne2/d2f889c380847628d9d843e0a787d3.jpg',
            },
            {
                'nw': '//gf1.geo.gfsrv.net/cdn3b/2b919d92c79b0b9a80cefafe88ef58.jpg',
                'ne': '//gf3.geo.gfsrv.net/cdn80/3972d1d22db3b9b49e584948275208.jpg',
                'sw': '//gf2.geo.gfsrv.net/cdn10/df064c1633744b1c33cc4573575891.jpg',
                'se': '//gf2.geo.gfsrv.net/cdnd2/b069fd71423e719623114c24f6f507.jpg',
            },
            {
                'nw': '//gf2.geo.gfsrv.net/cdn41/4aff5cf60ff96eb23c895080f236f1.jpg',
                'ne': '//gf2.geo.gfsrv.net/cdnd6/65c6ef4f57cc4467d7a91c6ab34c88.jpg',
                'sw': '//gf2.geo.gfsrv.net/cdn43/a6f005720cf4571d51aebaa2437036.jpg',
                'se': '//gf3.geo.gfsrv.net/cdned/09edd1df297346b09f7de8a6c021f4.jpg',
            },
            {
                'nw': '//gf2.geo.gfsrv.net/cdnd6/875162f980bf06afcbc2dd3af6d23c.jpg',
                'ne': '//gf1.geo.gfsrv.net/cdn01/eeba3ad6b113d71ef18fb594070641.jpg',
                'sw': '//gf2.geo.gfsrv.net/cdna6/44fb3d605e47d91f1b978788be16ed.jpg',
                'se': '//gf2.geo.gfsrv.net/cdn46/12f80c826b9a4f841f3bd0d49df1d3.jpg',
            },
        ];

        const UNIT_WEIGHTS = {
            ship_transport: -500,

            slinger: 3,
            archer: 5,
            marksman: 5,
            spearman: 3,
            swordsman: 3,
            phalanx: 5,
            steamgiant: 15,
            gyrocopter: 15,
            bombardier: 30,
            ram: 30,
            catapult: 30,
            mortar: 30,
            cook: 20,
            medic: 10,
            spartan: 5,

            wood: 1,
            wine: 1,
            marble: 1,
            glass: 1,
            sulfur: 1,
        };






        function actRescalePlaques() {
            switch(ikariam.backgroundView.id) {

                case 'city':
                    if (modData.actPreventPlaqueScaling) {
                        var s = 1/ikariam.worldview_scale_city;
                        $('.timetofinish').each(function() {
                            $(this).css('transform', 'scale(' + s + ')');
                        });
                    } else {
                        $('.timetofinish').each(function() {
                            $(this).css('transform', '');
                        });
                    }
                    break;

                case 'island':
                    if (modData.actPreventPlaqueScaling) {
                        var s = 1/ikariam.worldview_scale_island;
                        $('#island .location_list .cityLocationScroll').each(function() {
                            $(this).css('transform', 'scale(' + s + ')');
                        });
                    } else {
                        $('#island .location_list .cityLocationScroll').each(function() {
                            $(this).css('transform', '');
                        });
                    }
                    break;

            }
        }

        function actOnMouseover() {
            switch(ikariam.backgroundView.id) {

                case 'city':
                    var title = $(this).attr('title');
                    if (modData.actShowMouseoverPlaques) {
                        var pos = forceInt($(this).attr('id'));
                        $('#js_CityPosition'+pos+'Scroll').css('display', 'block');
                        $('#js_CityPosition'+pos+'Scroll').css('pointer-events', 'none');
                        $('#js_CityPosition'+pos+'ScrollName').text(title);
                        $(this)[0]._tweakInterval = setInterval(() => {
                            $('#js_CityPosition'+pos+'ScrollName').text(title);
                        }, 1000);
                    }
                    if (modData.actHideMouseoverTitles) {
                        $(this).attr('title', '');
                        $(this).attr('_title', title);
                    }
                    break;

                case 'island':
                    if (modData.actHideMouseoverTitles) {
                        var title = $(this).attr('title');
                        $(this).attr('title', '');
                        $(this).attr('_title', title);
                    }
                    break;

            }
        }

        function actOnMouseout() {
            switch(ikariam.backgroundView.id) {

                case 'city':
                    var pos = forceInt($(this).attr('id'));
                    $('#js_CityPosition'+pos+'Scroll').css('display', '');
                    $('#js_CityPosition'+pos+'Scroll').css('pointer-events', '');
                    var title = $(this).attr('title') || $(this).attr('_title');
                    $(this).attr('title', title);
                    $(this).attr('_title', null);
                    if (modData.fixHoverEffectSwitching) {
                        $('#position'+pos+' .img_pos.hover').addClass('invisible');
                    }
                    clearInterval($(this)[0]._tweakInterval);
                    $(this)[0]._tweakInterval = null;
                    break;

                case 'island':
                    var title = $(this).attr('title') || $(this).attr('_title');
                    $(this).attr('title', title);
                    $(this).attr('_title', null);
                    if (modData.fixHoverEffectSwitching) {
                        $(this).prev().removeClass('invisible');
                    }
                    break;

            }
        }

        function actSetHoverHandlers() {
            switch(ikariam.backgroundView.id) {

                case 'city':
                    if (modData.actShowMouseoverPlaques
                     || modData.actHideMouseoverTitles
                     || modData.fixHoverEffectSwitching) {
                        $('#city #locations .building a:not([_tweaked])').each(function() {
                            $(this).on('mouseover', actOnMouseover);
                            $(this).on('mouseout', actOnMouseout);
                            $(this).attr('_tweaked', '1');
                        });
                    } else {
                        $('#city #locations .building a[_tweaked]').each(function() {
                            $(this).off('mouseover');
                            $(this).off('mouseout');
                            $(this).attr('_tweaked', null);
                            actOnMouseout.call(this);
                        });
                    }
                    break;

                case 'island':
                    if (modData.actHideMouseoverTitles
                     || modData.fixHoverEffectSwitching) {
                        $('#island a.island_feature_img:not([_tweaked])').each(function() {
                            $(this).on('mouseover', actOnMouseover);
                            $(this).on('mouseout', actOnMouseout);
                            $(this).attr('_tweaked', '1');
                        });
                        $('#island_heliosLocation a:not([_tweaked])').each(function() {
                            $(this).on('mouseover', actOnMouseover);
                            $(this).on('mouseout', actOnMouseout);
                            $(this).attr('_tweaked', '1');
                        });
                    } else {
                        $('#island a.island_feature_img[_tweaked]').each(function() {
                            $(this).off('mouseover');
                            $(this).off('mouseout');
                            $(this).attr('_tweaked', null);
                            actOnMouseout.call(this);
                        });
                        $('#island_heliosLocation a[_tweaked]').each(function() {
                            $(this).off('mouseover');
                            $(this).off('mouseout');
                            $(this).attr('_tweaked', null);
                            actOnMouseout.call(this);
                        });
                    }
                    break;

            }
        }

        function updateRessourcesCosts() {
            if (modData.ressShowMissing || modData.ressShowRemaining) {
                var res = {
                    'wood':'resource',
                    'wine':'1',
                    'marble':'2',
                    'glass':'3',
                    'sulfur':'4',
                };
                $('#buildingUpgrade ul.resources li').each(function(i){
                    var t = $(this);
                    forEach(res, (v, k) => {
                        if (t.hasClass(k)) {
                            var req = parseInt(t.html().replace(/\D+/g,''));
                            var cur = ikariam.model.currentResources[v];
                            var lft = req-cur;
                            if (lft>0) {
                                if (modData.ressShowMissing) {
                                    t.addClass('red bold').css({'line-height':'initial'});
                                    t.append('<span style="display:block;font-weight:normal;font-size:10px;">-'+ikariam.model.shortenValue(lft,6)+'</span>');
                                }
                            } else {
                                if(modData.ressShowRemaining) {
                                    t.css({'line-height':'initial'});
                                    t.append('<span class="green" style="display:block;font-weight:normal;font-size:10px;">+'+ikariam.model.shortenValue(lft*-1,6)+'</span>');
                                }
                            }
                            return;
                        }
                    });
                });
            }
        }

        function updateFleetMovements() {
            if (document.getElementById('militaryAdvisor')) {

//http://gf3.geo.gfsrv.net/cdnb4/c8d5abf2d65cd8386593aced475cae.js

                if (!$('#militaryMovementsFleetMovementsFilters')[0].hasAttribute('_onclick')) {
                    $('#militaryMovementsFleetMovementsFilters').attr('_onclick', '');
                    $('#militaryMovementsFleetMovementsFilters > div').on('click', updateFleetMovements);
                }

                $('#militaryMovementsFleetMovementsFilters').hide();
                waitFor(() => {
                    return ikariam.templateView.viewScripts.militaryAdvisor.militaryMovementsFleetMovements;
                }).then((m) => {
                    $('#militaryMovementsFleetMovementsFilters').show();

                    //hookFunction(m, 'selectFilter', updateFleetMovements);

                    if (modData.fleetHideZeroFilterButtons) {
                        $('#militaryMovementsFleetMovementsFilters div.amount').each(function(){
                            if (!parseInt($(this).text())) {
                                $(this).parent().addClass('hidden');
                            }
                        });
                    }

                    if (modData.fleetHidePremiumFleetInfo) {
                        $('table.military_event_table td.spyMilitary.magnify_icon').each(function(){
                            var t = $(this);
                            if (t.find('.unit_detail_icon').length === 0) {
                                t.css('opacity', 0);
                                t.css('cursor', 'unset');
                                t.attr('onclick', null);
                            }
                        });
                    }

                    if (modData.fleetShowCapacities) {

                        var ignoreClasses = ['unit_detail_icon','floatleft','icon40','bold','center','resource_icon'];
                        $('table.military_event_table tr.own').each(function(){
                            var tr = $(this);
                            var space = 0;
                            var used = 0;
                            tr.find('div.unit_detail_icon').each(function(){
                                var icon = $(this);
                                var cls = icon[0].className.split(' ').filter((s) => {
                                    return ignoreClasses.indexOf(s) === -1;
                                }).join().trim();
                                if (cls) {
                                    var weight = UNIT_WEIGHTS[cls];
                                    if (weight) {
                                        weight *= forceInt(icon.text());
                                        if (weight < 0) {
                                            space -= weight;
                                        } else {
                                            used += weight;
                                        }
                                    } else {
                                        // SHOULD NOT HAPPEN !!!
                                    }
                                } else {
                                    // SHOULD NOT HAPPEN !!!
                                }
                            });
                            if (space) {
                                $('td:nth-child(4)', this).append(`<div>${used} / ${space}</div>`);
                            }
                        });
                    }

                    if (modData.fleetMouseOverFleetInfo) {
                        $('table.military_event_table tr:first-child th[colspan="2"]').attr('colspan', null);
                        function triggerOver() {
                            $(document).trigger("closeExclusiveInfo");
                            var id = $(this).closest('tr').attr('data-fleet-id');
                            ikariam.controller.clickTarget = this;
                            ikariam.controller.actionMonitor.toggleExclusiveInfo('fleetInfo'+id);
                        }
                        function triggerOut() {
                            $('#exclusiveTooltip').remove();
                        }
                        $('table.military_event_table tr:not([data-fleet-id]) td.spyMilitary.magnify_icon').each(function(){
                            var td = $(this);
                            var tr = td.closest('tr');
                            var prev = td.prev();
                            if (td[0].hasAttribute('onclick')) {
                                tr.attr('data-fleet-id', td.attr('onclick').match(/fleetInfo(\d+)/)[1]);
                                prev.on("mouseover", triggerOver);
                            } else {
                                tr.attr('data-fleet-id', '');
                            }
                            prev.on("mouseout", triggerOut);
                            td.css('display', 'none');
                            $('div', prev).css('pointer-events', 'none');
                            prev.attr('title', null);
                        });
                    }

                }).catch(() => {});
            }
        }

        function updateWarehouseInfos() {
            if (document.getElementById('warehouse')) {

                if (modData.warehouseShowRemainingSave) {
                    var res = [ 'wood', 'wine', 'marble', 'glass', 'sulfur' ];
                    res.forEach((res) => {
                        var secure = forceInt($('#js_secure_'+res).text());
                        var plunderable = forceInt($('#js_plunderable_'+res).text());
                        var total = forceInt($('#js_total_'+res).text());
                        var capacity = forceInt($('#js_capacity_'+res).text());
                        if (!plunderable) {
                            var restSecure = secure - total;
                            $('#js_plunderable_'+res)[0].innerHTML = ikariam.model.shortenValue(restSecure, 6);
                            $('#js_plunderable_'+res).addClass('green');
                        }
                    });
                }
            }
        }

        waitFor.ajaxResponder().then((ajaxResponder) => {
            hookFunction(ajaxResponder, 'changeView', () => {
                updateRessourcesCosts();
                updateFleetMovements();
            });
            hookFunction(ajaxResponder, 'updateViewScriptData', updateFleetMovements);
            hookFunction(ajaxResponder, 'updateTemplateData', updateWarehouseInfos);
            updateRessourcesCosts();
            updateFleetMovements();
        }).catch(() => {});

        waitFor(() => {
            return dataSetForView.relatedCityData && ikariam.backgroundView.screen.update;
        }).then(() => {
            hookFunction(ikariam.backgroundView.screen, 'update', () => {
                actSetHoverHandlers();
                actRescalePlaques();
            });
            hookFunction(ikariam.controller, 'scaleWorldMap', actRescalePlaques);
            actSetHoverHandlers();
            actRescalePlaques();
            actRescalePlaques();
        }).catch(() => {});

        var cssElement;
        function updateCSS() {
            var css = [];

            //
            // bugFixes
            //
            if (modData.fixResearchWindowList) {
                css.push('ol.research_type { width: 220px !important; }');
            }
            if (modData.fixCitySelectItems) {
                css.push('.dropdownContainer.city_select li.last-child { background-position: left -142px !important; padding-bottom: 3px; }');
                css.push('.dropdownContainer.city_select li.last-child:hover{ background-position: left -196px !important; }');
            }
            if (modData.fixWindowTopPadding) {
                css.push('#container .mainContentBox .mainContent { padding-top: 20px !important; }');
            }
            if (modData.fixScrollbars) {
                /** fix scrollbar x position **/
                css.push('#container .scroller { background-position-x: -1px !important; }');
                /** fix scroll window margin top **/
                css.push('#container .mainContentBox .mainContentScroll { margin-top: -0.5px; }');
                /** fix scroll area margin right to parent view window **/
                css.push('#container .scroll_area { margin-right: 3px; }');
                css.push('#container .scroll_area.scroll_disabled { margin-right: 0px; }');
            }
            if (modData.fixDarkSelectActiveColor) {
                css.push('.select_container.city_select .dropDownButton.active a { color: #faeac6; }');
            }
            if (modData.fixWindowTabSizes) {
                css.push('#container .tabmenu .tab { border: 1px solid transparent; border-bottom: 0; }');
                css.push('#container .tabmenu .selected, #container .tabmenu .tab:hover { padding: 2px 3px 1px 3px !important; }');
            }
            if (modData.removeBlueLinkBorders) {
                css.push('a { border: 0; text-decoration: none; outline: none; }');
            }





            //
            // antiAds
            //
            if (modData.adsHideHappyHour) {
                css.push('div.btnIngameCountdown.happyHour  { height: 0; padding: 0; overflow: hidden; }'); // screw that display:block
            }
            if (modData.adsHideSpeedUpButtons) {
                css.push('#city #locations .timetofinish.buildingSpeedup { padding-right: 16px; pointer-events: none; }');
                css.push('#city .buildingSpeedupButton { display: none; }');
                css.push('#js_MilitaryMovementsFleetMovementsTable .action_icon.accLoading { display: none; }');
                css.push('#js_MilitaryMovementsFleetMovementsTable .table01 .right br { display: none; }');
            }
            if (modData.adsHideSlotResourceShop) {
                css.push('#container .slot_menu li.expandable.resourceShop { display: none !important; }');
            }
            if (modData.adsHideSlotPremiumTrader) {
                css.push('#container .slot_menu li[onclick^="ajaxHandlerCall(\'?view=premiumTrader\')"] { display: none !important; }');
            }
            if (modData.adsHideOfferBoxes) {

                css.push('#townHall .premiumOffer { display: none !important; }');
                css.push('#warehouse .premiumOfferBox { display: none !important; }');
                css.push('#finances #js_BadTaxAccountantOffer { display: none !important; }');
                css.push('#finances td.premiumOffer { height: unset; padding: unset; }');

                // premium boxes in mines
                css.push('#setWorkers .content { min-height: unset !important; }');
                css.push('#setWorkers #workersWrapper + .premiumOfferBox { display: none !important; }');

                // bottom premium boxes in advisor views
                css.push('#tab_tradeAdvisor > div.contentBox01h:last-child { display: none !important; }');
                css.push('#militaryAdvisor #militaryMovements + div.contentBox01h { display: none !important; }');
                css.push('#researchAdvisor .mainContent > div.contentBox01h:last-child { display: none !important; }');
                css.push('#diplomacyAdvisor #tab_diplomacyAdvisor > div:last-child.contentBox01h { display: none !important; }');
            }
            if (modData.adsHideWindowAds) {
                css.push('#container .mainContent > div:first-child.center { display: none !important; }');     // advertising at top of each view window
            }
            if (modData.adsHideArchiveButtons) {
                css.push('#tab_diplomacyAdvisor .button_bar_msg { display: none !important; }');
                css.push('#tab_diplomacyAdvisor .button_bar_right { display: none !important; }');
            }
            if (modData.adsHideMilitaryDummies) {
                css.push('#barracks #premium_btn { display: none !important; }');
                css.push('#barracks #premium_btn2 { display: none !important; }');
                css.push('#shipyard #premium_btn { display: none !important; }');
                css.push('#shipyard #premium_btn2 { display: none !important; }');
                css.push('#cityMilitary #premium_btn { display: none !important; }');
                css.push('#cityMilitary #premium_btn2 { display: none !important; }');
            }
            if (modData.adsHideAdvisorButtons) {
                css.push('#header #advisors a#js_GlobalMenu_citiesPremium     { display: none; }');
                css.push('#header #advisors a#js_GlobalMenu_militaryPremium   { display: none; }');
                css.push('#header #advisors a#js_GlobalMenu_researchPremium   { display: none; }');
                css.push('#header #advisors a#js_GlobalMenu_diplomacyPremium  { display: none; }');
            }
            if (modData.adsHideToolbarMMOAds) {
                css.push('#GF_toolbar ul li:last-child  { display: none; }');
            }

            //
            // animations
            //
            if (modData.animHideWalkers) {
                css.push('#walkers { display: none; }');
            }
            if (modData.animHideBirdsOnly) {
                css.push('div.bird, div.animated_bird { display: none; }');
            }
            if (modData.animHideWalkerBubbles) {
                css.push('.not_selectable, .animation {pointer-events: none;}');
            }

            //
            // cities
            //
            if (modData.cityHideLockedPosition) {
                css.push('#locations .lockedPosition        { display: none; }');
            }
            if (modData.cityHideDailyTasks) {
                css.push('#city #cityDailyTasks             { display: none; }');
            }
            if (modData.cityHideRegistrationGifts) {
                css.push('#cityRegistrationGifts            { display: none; }');
            }
            if (modData.cityHideFlyingShop) {
                css.push('#city #cityFlyingShopContainer    { display: none; }');
            }
            if (modData.cityHideAmbrosiaFountain) {
                css.push('#city #cityAmbrosiaFountain       { display: none; }');
            }
            if (modData.cityHidePirateFortress) {
                css.push('#city #pirateFortressBackground { display: none; }');
                css.push('#city #pirateFortressShip       { display: none; }');
                css.push('#city #locations #position17    { display: none; }');
            }
            if (modData.cityIgnoreCapital || modData.cityUsecityCustomBackground) {

                var townBackgrounds = [];
                var capitalBackgrounds = [];
                if (modData.cityUseCustomBackground) {
                    for(var i=0; i<CITY_BACKGROUNDS_COUNT; i+=1) {
                        townBackgrounds.push(CITY_BACKGROUNDS[modData.cityCustomBackground]);
                        capitalBackgrounds.push(CITY_BACKGROUNDS_CAPITAL[modData.cityCustomBackground]);
                    }
                } else {
                    for(var i=0; i<CITY_BACKGROUNDS_COUNT; i+=1) {
                        townBackgrounds.push(CITY_BACKGROUNDS[i]);
                        capitalBackgrounds.push(CITY_BACKGROUNDS_CAPITAL[i]);
                    }
                }
                if (modData.cityIgnoreCapital) {
                    capitalBackgrounds = townBackgrounds;
                }

                for(var i=0; i<CITY_BACKGROUNDS_COUNT; i+=1) {
                    css.push('.phase'+(i+1)+' #city_background_nw{background-image:url('+townBackgrounds[i].nw+')}');
                    css.push('.phase'+(i+1)+' #city_background_ne{background-image:url('+townBackgrounds[i].ne+')}');
                    css.push('.phase'+(i+1)+' #city_background_sw{background-image:url('+townBackgrounds[i].sw+')}');
                    css.push('.phase'+(i+1)+' #city_background_se{background-image:url('+townBackgrounds[i].se+')}');
                    css.push('.phase'+(i+1)+'.isCapital #city_background_nw{background-image:url('+capitalBackgrounds[i].nw+')}');
                    css.push('.phase'+(i+1)+'.isCapital #city_background_ne{background-image:url('+capitalBackgrounds[i].ne+')}');
                    css.push('.phase'+(i+1)+'.isCapital #city_background_sw{background-image:url('+capitalBackgrounds[i].sw+')}');
                    css.push('.phase'+(i+1)+'.isCapital #city_background_se{background-image:url('+capitalBackgrounds[i].se+')}');
                }
            }

            //
            // fleets
            //
            if (modData.fleetHideSpeedColumn) {
                css.push('#js_MilitaryMovementsFleetMovementsTable table tr th:nth-child(3) { display: none; }');
                css.push('#js_MilitaryMovementsFleetMovementsTable table tr td:nth-child(3) { display: none; }');
            }
            if (modData.fleetDontBreakLines) {
                css.push('#js_MilitaryMovementsFleetMovementsTable table { white-space: nowrap; }');
            }
            if (modData.fleetReadableFilterButtons) {
                css.push('#militaryMovementsFleetMovementsFilters { background-color: #faeac6; height: 44px; margin-right: 3.5px; padding: 5px 9px 0; }');
                css.push('#militaryMovementsFleetMovementsFilters > div.missionFilter:not(.selected) { opacity: 0.5; }');
                css.push('#militaryMovementsFleetMovementsFilters > div.missionFilter:not(.selected):hover { opacity: 0.75; }');
                css.push('#militaryMovementsFleetMovementsFilters > div.missionFilter > div.mission_icon.all { background-color: #fff8d7; }');
                css.push('#militaryMovementsFleetMovementsFilters > div.missionFilter > div.amount { background: #532000; }');
                css.push('#militaryMovementsFleetMovementsFilters > div.missionFilter > div.amount { color: #fff8d7; }');
                css.push('#militaryMovementsFleetMovementsFilters > div.missionFilter { cursor: pointer; }');
                css.push('#militaryMovementsFleetMovementsFilters > div.missionFilter { margin-right: 0; }');
                css.push('#militaryMovementsFleetMovementsFilters > div.missionFilter > div.amount { margin-top: -2px; line-height: 14px; }');
            }
            if (modData.fleetHideZeroFilterButtons) {
                css.push('#militaryMovementsFleetMovementsFilters > div.missionFilter.hidden { display: none; }');
            }
            if (modData.miliHidePremiumFleetInfo) {
                css.push('#exclusiveTooltip { pointer-events: none; }');
            }







            //
            // interactive
            //
            if (modData.actHideMouseoverTitles) {
                css.push('#island #cities .hover { pointer-events: none; }');
            }
            if (modData.cityHoverToBackground) {
                css.push('#city #locations .img_pos.buildingimg { z-index: 2; pointer-events: none; }');
                css.push('#city #locations .img_pos.constructionSite { z-index: 2; pointer-events: none; }');
                //css.push('#island a.island_feature_img { z-index: 3; position: absolute; }');
            }
            if (modData.islandHoverToBackground) {
                css.push('#island #cities .hover { position: absolute; z-index: -1; }');
                css.push('#island #islandtradegood .hover { z-index: 0; }');
                css.push('#island #islandtradegood .hover { z-index: 0; }');
                css.push('#island #islandtradegood a { position: absolute; z-index: 1; }');
            }








            if(cssElement) removeElement(cssElement);
            injectCSS(css.join(''), function(el){cssElement=el;});
        }
        updateCSS();





        var categories = [
            ['bugFixes', [
                'fixResearchWindowList',
                'fixCitySelectItems',
                'fixWindowTopPadding',
                'fixScrollbars',
                'fixHoverEffectSwitching',
                'fixDarkSelectActiveColor',
                'fixWindowTabSizes',
                'removeBlueLinkBorders',
            ]],
            ['antiAds', [
                'adsHideSpeedUpButtons',
                'adsHideWindowAds',
                'adsHideHappyHour',
                'adsHideOfferBoxes',
                'adsHideSlotResourceShop',
                'adsHideSlotPremiumTrader',
                'adsHideArchiveButtons',
                'adsHideMilitaryDummies',
                'adsHideAdvisorButtons',
                'adsHideToolbarMMOAds',
            ]],
            ['animations', [
                'animHideWalkers',
                'animHideWalkerBubbles',
                'animHideBirdsOnly',
            ]],
            ['cities', [
                'cityIgnoreCapital',
                'cityHidePirateFortress',
                'cityHideLockedPosition',
                'cityUseCustomBackground',
                'cityHideDailyTasks',
                'cityHideRegistrationGifts',
                'cityHideFlyingShop',
                'cityHideAmbrosiaFountain',
            ]],
            ['interactive', [
                'actShowMouseoverPlaques',
                'actHideMouseoverTitles',
                'actPreventPlaqueScaling',
                'cityHoverToBackground',
                'islandHoverToBackground',
            ]],
            ['resources', [
                'resShowMissing',
                'resShowRemaining',
                'warehouseShowRemainingSave',
            ]],
            ['fleets', [
                'fleetHideSpeedColumn',
                'fleetHidePremiumFleetInfo',
                'fleetShowCapacities',
                'fleetDontBreakLines',
                'fleetReadableFilterButtons',
                'fleetHideZeroFilterButtons',
                'fleetMouseOverFleetInfo',
            ]],
        ];


        TPL.set('GeneralTweaks_settingsWindow', `
            <div id="mainview">
                <div class="buildingDescription"><h1>{str_GeneralTweaks_name}</h1></div>
                <div>
                    {categories}
                    <div class="contentBox01h" style="z-index: 101;">
                        <h3 class="header hidden"></h3>
                        <div class="content">
                            <table class="table01 left"><tbody>
                                <tr>
                                    <th colspan="2">
                                        <div class="centerButton">
                                            <input id="js_GeneralTweaks_settingsButton" type="button" class="button" value="{str_save}" />
                                        </div>
                                    </th>
                                </tr>
                            </tbody></table>
                        </div>
                        <div class="footer"></div>
                    </div>
                </div>
            </div>
        `);

        TPL.set('GeneralTweaks_category', `
            <div class="contentBox01h" style="z-index: 101;">
                <h3 class="header">{categoryTitle}</h3>
                <div class="content">
                    <table class="table01 left"><tbody>
                        {categoryRows}
                    </tbody></table>
                </div>
                <div class="footer"></div>
            </div>
        `);

        TPL.set('GeneralTweaks_settingTR', `
            <tr>
                <td width="50"><input id="GeneralTweaks_settingCheckbox{id}" type="checkbox" class="notifications checkbox" {checked}></td>
                <td>{text}</td>
            </tr>
        `);

        TPL.set('GeneralTweaks_settingSelectTR', `
            <tr>
                <td width="50" style="vertical-align: top;"><input id="GeneralTweaks_settingCheckbox{id}" type="checkbox" class="notifications checkbox" {checked}></td>
                <td>{text} {selectContainer}</td>
            </tr>
        `);

        IkaTweaks.addSidebarButton('{str_GeneralTweaks_name}', function() {

            var cityCustomBackgroundList = [ '1', '2', '3', '4', '5' ].map((level) => {
                return TPL.parse(LANG('str_GeneralTweaks_cityUseCustomBackgroundLevel'), {level:level});
            });
            var cityCustomBackgroundSelect = new SelectDropDown('GeneralTweaks_customBackgroundSelect', 95, cityCustomBackgroundList, modData.cityCustomBackground);

            IkaTweaks.changeHTML('GeneralTweaks', TPL.get('GeneralTweaks_settingsWindow', {
                categories: TPL.each(categories, function(category){
                    var categoryId = category[0];
                    var checkboxes = category[1];
                    return ['GeneralTweaks_category', {
                        categoryTitle: '{str_GeneralTweaks_'+categoryId+'}',
                        categoryRows:  TPL.each(checkboxes, function(k){
                            switch(k) {
                                case 'cityUseCustomBackground':
                                    return ['GeneralTweaks_settingSelectTR', {
                                        id      : k,
                                        text    : '{str_GeneralTweaks_'+k+'}',
                                        checked : (modData[k]) ? 'checked="checked"' : '',
                                        selectContainer : cityCustomBackgroundSelect.tpl(),
                                    }];
                                default:
                                    return ['GeneralTweaks_settingTR', {
                                        id      : k,
                                        text    : '{str_GeneralTweaks_'+k+'}',
                                        checked : (modData[k]) ? 'checked="checked"' : '',
                                    }];
                            }
                        })
                    }];
                })
            })).then(() => {
                $('#js_GeneralTweaks_settingsButton').click(function(){
                    function forEachCheckBox(k) {
                        modData[k] = isChecked('#GeneralTweaks_settingCheckbox'+k);
                    }
                    categories.forEach((category) => {
                        var categoryId = category[0];
                        var checkboxes = category[1];
                        checkboxes.forEach(forEachCheckBox);
                    });
                    modData.cityCustomBackground = parseInt(cityCustomBackgroundSelect.val());
                    modDataSave();
                    updateCSS();
                    actRescalePlaques();
                    actSetHoverHandlers();
                    IkaTweaks.success();
                });
            }).catch(() => {});
        });

    });

    // MODULE: GeneralTweaks
    //--------------------------------------------------------------------------------------------------

    //--------------------------------------------------------------------------------------------------
    // MODULE: CityListing

    IkaTweaks.setModule('CityListing', function(modData, modDataSave){
        if(typeof modData.hideCoords        == 'undefined') modData.hideCoords          = false;
        if(typeof modData.showTradegoods    == 'undefined') modData.showTradegoods      = true;
        if(typeof modData.highlightSelected == 'undefined') modData.highlightSelected   = true;
        if(typeof modData.sortList          == 'undefined') modData.sortList            = true;
        if(typeof modData.sortedList        == 'undefined') modData.sortedList          = [];

        // afterI = after what child ele append others?
        // chields = {cityId:listEle, cityId:listEle, ...}
        function sortElementChilds(parent, childs, afterI, altRows) {
            var sortedList = modData.sortedList.slice(0), ch;
            while(sortedList.length) {
                ch = childs[sortedList.pop()]; // from last, to fist
                if (ch) {
                    // remove element from DOM and append again at top
                    parent.children().eq(afterI).before(ch);
                }
            }
            if (altRows) {
                sortedList = modData.sortedList.slice(0);
                var alt = false;
                while(sortedList.length) {
                    ch = childs[sortedList.shift()]; // but now from first to last
                    if (ch) {
                        ch.removeClass('alt');
                        if (alt) {
                            ch.addClass('alt');
                        }
                        alt = !alt;
                    }
                }
            }
        }

        var tradegoodImagesCache = {};
        var tradegoodImagePaths = {
            '1': '/skin/resources/icon_wine.png',
            '2': '/skin/resources/icon_marble.png',
            '3': '/skin/resources/icon_glass.png',
            '4': '/skin/resources/icon_sulfur.png'
        };
        function getTradegoodImage(k, cityId, tradegood) {
            var cacheKey = k+cityId;
            var img = tradegoodImagesCache[cacheKey] || $('<img>');
            tradegoodImagesCache[cacheKey] = img;
            img.attr({
                'class': 'citySelectTradegoodIcon',
                'src': tradegoodImagePaths[tradegood] || '',
            });
            return img;
        }

        function updateCitySelect_appendTradegoods() {
            var relatedCityData = ikariam.model.relatedCityData, relatedCity = relatedCityData[relatedCityData.selectedCity];
            if (relatedCity.relationship == 'ownCity') {
                $('#js_citySelectContainer span').append(getTradegoodImage('span', relatedCity.id, relatedCity.tradegood));
            }
            var citySelectUl = $('#dropDown_js_citySelectContainer ul');
            citySelectUl.addClass('width'+citySelectUl.width());
            forEach(relatedCityData, (relatedCity, cityKey) => {
                if (relatedCity && relatedCity.relationship == 'ownCity' && relatedCity.tradegood) {
                    $('#dropDown_js_citySelectContainer li[selectvalue="'+relatedCity.id+'"]').append(getTradegoodImage('li', relatedCity.id, relatedCity.tradegood));
                }
            });
        }

        function updateCitySelect_highlightSelected() {
            var relatedCityData = ikariam.model.relatedCityData, relatedCity = relatedCityData[relatedCityData.selectedCity];
            $('#dropDown_js_citySelectContainer li[selectvalue="'+relatedCity.id+'"]').addClass('active');
        }

        function updateCitySelect_hideCoords() {
            var aSpan = $('#js_citySelectContainer span a');
            aSpan.text(aSpan.text().replace(/\[\d+\:\d+\]\s+/, ''));
            var aLi = $('#dropDown_js_citySelectContainer li a');
            aLi.each(function(){
                $(this).text($(this).text().replace(/\[\d+\:\d+\]\s+/, ''));
            });
        }

        function updateCitySelect_sort() {
            var parent = $('#dropDown_js_citySelectContainer ul');
            var childs = {};
            $('#dropDown_js_citySelectContainer ul li').each(function(i){
                childs[$(this).attr('selectvalue').match(/\d+/)] = $(this);
            });
            sortElementChilds(parent, childs, 0);
            // refresh classes for :first and :last
            (function(li){
                li.removeClass('first-child');
                li.removeClass('last-child');
                li.first().addClass('first-child');
                li.last().addClass('last-child');
            })(parent.children());
        }

        function updateCitySelect() {
            if(modData.showTradegoods)      updateCitySelect_appendTradegoods();
            if(modData.highlightSelected)   updateCitySelect_highlightSelected();
            if(modData.hideCoords)          updateCitySelect_hideCoords();
            if(modData.sortList)            updateCitySelect_sort();
        }

        function changeViewUpdate() {
            if(!(modData.sortList)) return;

            var unsortedIds = [];
            forEach(ikariam.model.relatedCityData, (relatedCity, cityKey) => {
                if (relatedCity && relatedCity.relationship == 'ownCity') {
                    unsortedIds.push(relatedCity.id);
                }
            });

            var parent, childs = {};
            if(document.getElementById('palace_c')) {
                parent = $('#palace_c table:eq(1) tbody');
                parent.find('tr:gt(0)').each(function(i){
                    childs[unsortedIds[i]] = $(this);
                });
                return sortElementChilds(parent, childs, 1, true);
            }
            if(document.getElementById('palaceColony_c')) {
                parent = $('#palaceColony_c table:eq(0) tbody');
                parent.find('tr').each(function(i){
                    childs[unsortedIds[i]] = $(this);
                });
                return sortElementChilds(parent, childs, 0);
            }
            if(document.getElementById('culturalPossessions_assign_c')) {
                parent = $('#culturalPossessions_assign_c ul:eq(1)');
                parent.find('li').each(function(i){
                    childs[unsortedIds[i]] = $(this);
                });
                return sortElementChilds(parent, childs, 0);
            }
            if(document.getElementById('finances_c')) {
                parent = $('#finances_c table:eq(1) tbody');
                parent.find('tr:gt(0)').each(function(i){
                    childs[unsortedIds[i]] = $(this);
                });
                return sortElementChilds(parent, childs, 1, true);
            }
            if(document.getElementById('port_c')) {
                parent = $('#port_c ul.cities');
                parent.find('li').each(function(i){
                    childs[$(this).attr('id').match(/\d+/)] = $(this);
                });
                return sortElementChilds(parent, childs, 0);
            }
        }

        waitFor(() => {
            jshintUnused = ikariam.backgroundView.updateCityDropdownMenu;
            jshintUnused = ikariam.model.relatedCityData;
            return true;
        }).then((ret) => {
            hookFunction(ikariam.backgroundView, 'updateCityDropdownMenu', updateCitySelect);
            updateCitySelect();
        }).catch(() => {});

        waitFor.ajaxResponder().then((ajaxResponder) => {
            hookFunction(ajaxResponder, 'changeView', changeViewUpdate);
            changeViewUpdate();
        }).catch(() => {});

        injectCSS(`
            img.citySelectTradegoodIcon {width:15px;height:12px;position:absolute;margin-top:5px;}
            ul.width177 img.citySelectTradegoodIcon {left:138px;}
            ul.width158 img.citySelectTradegoodIcon {left:138px;}
            #js_citySelectContainer span img.citySelectTradegoodIcon {left:146px;width:20px;height:16px;}
            #js_citySelectContainer span a {display:inline;}
            .dropdownContainer.city_select li.active{font-weight:bold;}
            #CityListing_sortingList button {cursor:pointer;display:inline-block;border:none;width:17px;height:17px;}
            #CityListing_sortingList button.up {background:url(/skin/friends/button17_up.png) no-repeat center 0px;}
            #CityListing_sortingList button.down {background:url(/skin/friends/button17_down.png) no-repeat center 0px;}
        `);

/*
        var cssElement;
        function updateCSS() {
            var css = [];

            if(cssElement) removeElement(cssElement);
            injectCSS(css.join(''), function(el){cssElement=el;});
        }
        updateCSS();
*/


        TPL.set('CityListing_settingsWindow', `
            <div id="mainview">
                <div class="buildingDescription"><h1>{str_CityListing_name}</h1></div>
                <div>
                    <div class="contentBox01h" style="z-index: 101;">
                        <h3 class="header hidden"></h3>
                        <div class="content">
                            <table class="table01 left"><tbody>
                                {settingsTR}
                                <tr>
                                    <th colspan="2">
                                        <div class="centerButton">
                                            <input id="js_CityListing_saveSettingsButton" type="button" class="button" value="{str_save}" />
                                        </div>
                                    </th>
                                </tr>
                            </tbody></table>
                        </div>
                        <div class="footer"></div>
                    </div>
                </div>
            </div>
        `);

        TPL.set('CityListing_settingTR', `
            <tr>
                <td width="50"><input id="CityListing_settingCheckbox{id}" type="checkbox" class="checkbox" {checked}></td>
                <td>{text}</td>
            </tr>
        `);
        TPL.set('CityListing_settingListTR', `
            <tr>
                <td width="50" rowspan="2" style="vertical-align:top;"><input id="CityListing_settingCheckbox{id}" type="checkbox" class="checkbox" {checked}></td>
                <td>{text}</td>
            </tr>
            <tr>
                <td style="padding-left: 0;">
                    <table><tbody id="CityListing_sortingList"></tbody></table>
                </td>
            </tr>
        `);

        IkaTweaks.addSidebarButton('{str_CityListing_name}', function(){

            var checkboxes = {
                hideCoords          : modData.hideCoords,
                showTradegoods      : modData.showTradegoods,
                highlightSelected   : modData.highlightSelected,
                sortList            : modData.sortList,
            };

            IkaTweaks.changeHTML('CityListing', TPL.get('CityListing_settingsWindow', {
                settingsTR: TPL.each(checkboxes, function(checked, k){
                    return [(k==='sortList'?'CityListing_settingListTR':'CityListing_settingTR'), {
                        id      : k,
                        text    : '{str_CityListing_'+k+'}',
                        checked : (checked) ? 'checked="checked"' : '',
                    }];
                }),
            })).then(() => {

                var CityListing_sortingList = $('#CityListing_sortingList');

                var relatedCity, relatedCityData = ikariam.model.relatedCityData;

                // add current ids of moddata
                var newSortedList = [];
                while (modData.sortedList.length) {
                    relatedCity = relatedCityData['city_'+modData.sortedList.shift()];
                    if (relatedCity && relatedCity.relationship == 'ownCity') {
                        if (newSortedList.indexOf(relatedCity.id) == -1) {
                            newSortedList.push(relatedCity.id);
                        }
                    }
                }

                // add missing ownCity ids of relatedCityData
                forEach(relatedCityData, (relatedCity, cityKey) => {
                    if (relatedCity && relatedCity.relationship == 'ownCity') {
                        if (newSortedList.indexOf(relatedCity.id) == -1) {
                            newSortedList.push(relatedCity.id);
                        }
                    }
                });

                function onClickSortUp(that) {
                    var tr = $(this).closest('tr'); // jshint ignore:line
                    var ch = CityListing_sortingList.children();
                    if(tr[0] === ch.first()[0]) ch.last().after(tr);
                    else tr.prev().before(tr);
                }

                function onClickSortDown() {
                    var tr = $(this).closest('tr'); // jshint ignore:line
                    var ch = CityListing_sortingList.children();
                    if(tr[0] === ch.last()[0]) ch.first().before(tr);
                    else tr.next().after(tr);
                }

                // fill #CityListing_sortingList
                while(newSortedList.length)
                {
                    var cityId = newSortedList.shift();
                    modData.sortedList.push(cityId);
                    CityListing_sortingList.append($('<tr>', {cityId:cityId})
                        .append($('<td>')
                            .append($('<button>', {'class':'up',    click:onClickSortUp}))
                            .append($('<button>', {'class':'down',  click:onClickSortDown}))
                        ).append($('<td>', {html:relatedCityData['city_'+cityId].name}))
                    );
                }

                $('#js_CityListing_saveSettingsButton').click(function(){
                    forEach(checkboxes, (_, k) => {
                        modData[k] = isChecked('#CityListing_settingCheckbox'+k);
                    });
                    modData.sortedList = [];
                    $('#CityListing_sortingList tr').each(function(){
                        modData.sortedList.push(parseInt($(this).attr('cityId')));
                    });
                    modDataSave();
                    ikariam.backgroundView.updateCityDropdownMenu();
                    IkaTweaks.success();
                });

            }).catch(() => {});

        });

    });

    // MODULE: CityListing
    //-----------------------------------------------------------------------------

    //-----------------------------------------------------------------------------
    // MODULE: ChangeAdvisors

    IkaTweaks.setModule('ChangeAdvisors', function(modData, modDataSave){
        if(typeof modData.replacements == 'undefined') modData.replacements = {cities:'maleMayor',military:'maleGeneral',research:'maleScientist',diplomacy:'maleDiplomat'};

        const advisors = [ 'cities', 'military', 'research', 'diplomacy' ];
        const advisorImages = {
            cities: {

                maleMayor: {
                    normal: '/skin/layout/advisors/mayor.png',
                    active: '/skin/layout/advisors/mayor_active.png',
                    mini  : '/skin/minimized/tradeAdvisor.png',
                    fixes : 'background-position-y:1px;',
                },
                maleMayorPremium: {
                    normal: '/skin/layout/advisors/mayor_premium.png',
                    active: '/skin/layout/advisors/mayor_premium_active.png',
                    mini  : 'https://raw.githubusercontent.com/YveOne/Userscript-IkaTweaks/master/images/maleMayorPremiumMini.png',
                    fixes : 'background-position-y:1px;',
                },

                femaleMayor: {
                    normal: 'https://gf2.geo.gfsrv.net/cdnad/c65484ebe05e4218aa8af0a016f70f.png',
                    active: 'https://gf1.geo.gfsrv.net/cdn6b/8004819074813a1e74377e16bc39db.png',
                    mini  : 'https://raw.githubusercontent.com/YveOne/Userscript-IkaTweaks/master/images/femaleMayorMini.png',
                },

                femaleMayorPremium: {
                    normal: 'https://gf2.geo.gfsrv.net/cdn43/438ff9314cd4594efbe0bd3cde2daa.png',
                    active: 'https://gf1.geo.gfsrv.net/cdn93/5ddaa2ef6569a1274842e5661aa7ec.png',
                    mini  : 'https://raw.githubusercontent.com/YveOne/Userscript-IkaTweaks/master/images/femaleMayorPremiumMini.png',
                },

                barbarianMayor: {
                    normal: 'https://gf2.geo.gfsrv.net/cdndd/4038e23b2dee65425ff19452e43b60.png',
                    active: 'https://gf2.geo.gfsrv.net/cdnda/97f887e4a5e0dea4c974fe888adc07.png',
                    mini  : '/skin/minimized/tradeAdvisor.png',
                },
                barbarianMayorPremium: {
                    normal: 'https://gf1.geo.gfsrv.net/cdnf2/8cddf3b88425522f2cec8bf954ff67.png',
                    active: 'https://gf2.geo.gfsrv.net/cdn4e/0aca9eab9f2e921abc609bf18bc72e.png',
                    mini  : '/skin/minimized/tradeAdvisor.png',
                },

                onePieceLuffy: {
                    normal: 'https://raw.githubusercontent.com/YveOne/Userscript-IkaTweaks/master/images/onePieceLuffyNormal.png',
                    active: 'https://raw.githubusercontent.com/YveOne/Userscript-IkaTweaks/master/images/onePieceLuffyActive.png',
                    mini  : 'https://raw.githubusercontent.com/YveOne/Userscript-IkaTweaks/master/images/onePieceLuffyMini.png',
                    fixes : 'background-position-y:1px;',
                },

            },
            military: {

                maleGeneral: {
                    normal: '/skin/layout/advisors/general.png',
                    active: '/skin/layout/advisors/general_active.png',
                    alert : '/skin/layout/advisors/general_alert.png',
                    mini  : '/skin/minimized/militaryAdvisor.png',
                    fixes : 'background-position-y:1px;',
                },
                maleGeneralPremium: {
                    normal: '/skin/layout/advisors/general_premium.png',
                    active: '/skin/layout/advisors/general_premium_active.png',
                    alert : '/skin/layout/advisors/general_premium_alert.png',
                    mini  : 'https://raw.githubusercontent.com/YveOne/Userscript-IkaTweaks/master/images/maleGeneralPremiumMini.png',
                    fixes : 'background-position-y:1px;',
                },

                femaleGeneral: {
                    normal: 'https://gf1.geo.gfsrv.net/cdn93/de97d2e03efcb617b55e554872bd7f.png',
                    active: 'https://gf3.geo.gfsrv.net/cdn59/9945e4257ea5fa1115c780b61c6f87.png',
                    alert : 'https://gf2.geo.gfsrv.net/cdn4b/cb7e1b73321ca334edb3f7cde014a4.png',
                    mini  : '/skin/minimized/militaryAdvisor.png',
                }, 
                femaleGeneralPremium: {
                    normal: 'https://gf2.geo.gfsrv.net/cdn7d/846622eb7b6d22b4d8e9ed67fe9540.png',
                    active: 'https://gf3.geo.gfsrv.net/cdnbf/be172f27c65aa08dad2492c7a688dc.png',
                    alert : 'https://gf1.geo.gfsrv.net/cdnc9/300f3eb409c5547ecef988ee60ec63.png',
                    mini  : '/skin/minimized/militaryAdvisor.png',
                },

                barbarianGeneral: {
                    normal: 'https://gf3.geo.gfsrv.net/cdn2f/64face27ba8bb80615bc7ae1bf5e08.png',
                    active: 'https://gf2.geo.gfsrv.net/cdnde/7b6e769a93988aa4f305a8b17ca45c.png',
                    alert : 'https://gf2.geo.gfsrv.net/cdn1a/9696dae76e5ab16f4604fa311cb87d.png',
                    mini  : '/skin/minimized/militaryAdvisor.png',
                },
                barbarianGeneralPremium: {
                    normal: 'https://gf1.geo.gfsrv.net/cdnc5/f907938b1897e3791c4b99c56c26cd.png',
                    active: 'https://gf2.geo.gfsrv.net/cdna5/a14f7b05b3a33f47ff0a5689de6c94.png',
                    alert : 'https://gf3.geo.gfsrv.net/cdne6/76ef247198b1a3493b59d5fb8512da.png',
                    mini  : '/skin/minimized/militaryAdvisor.png',
                },

                onePieceZoro: {
                    normal: 'https://raw.githubusercontent.com/YveOne/Userscript-IkaTweaks/master/images/onePieceZoroNormal.png',
                    active: 'https://raw.githubusercontent.com/YveOne/Userscript-IkaTweaks/master/images/onePieceZoroActive.png',
                    alert : 'https://raw.githubusercontent.com/YveOne/Userscript-IkaTweaks/master/images/onePieceZoroAlert.png',
                    mini  : 'https://raw.githubusercontent.com/YveOne/Userscript-IkaTweaks/master/images/onePieceZoroMini.png',
                    fixes : 'background-position-y:1px;',
                },

            },
            research: {

                maleScientist: {
                    normal: '/skin/layout/advisors/scientist.png',
                    active: '/skin/layout/advisors/scientist_active.png',
                    mini  : '/skin/minimized/researchAdvisor.png',
                    fixes : 'background-position-y:1px;',
                },
                maleScientistPremium: {
                    normal: '/skin/layout/advisors/scientist_premium.png',
                    active: '/skin/layout/advisors/scientist_premium_active.png',
                    mini  : 'https://raw.githubusercontent.com/YveOne/Userscript-IkaTweaks/master/images/maleScientistPremiumMini.png',
                    fixes : 'background-position-y:1px;',
                },

                femaleScientist: {
                    normal: 'https://gf3.geo.gfsrv.net/cdn2c/718516ef80f6b471d46829db736645.png',
                    active: 'https://gf1.geo.gfsrv.net/cdnf6/195cc0fee967c828a16cbbe6771927.png',
                    mini  : '/skin/minimized/researchAdvisor.png',
                },
                femaleScientistPremium: {
                    normal: 'https://gf2.geo.gfsrv.net/cdn4e/b5ac699f00b625287c7cca2ee4113c.png',
                    active: 'https://gf3.geo.gfsrv.net/cdn22/17ad363fb799ac7813e8f66a99b865.png',
                    mini  : '/skin/minimized/researchAdvisor.png',
                },

                barbarianScientist: {
                    normal: 'https://gf3.geo.gfsrv.net/cdne0/568aff5ecbf5a5d9b24cc109fb40bc.png',
                    active: 'https://gf2.geo.gfsrv.net/cdn48/fd3a7d5df4256d5ee7792f3196ecbd.png',
                    mini  : '/skin/minimized/researchAdvisor.png',
                },

                barbarianScientistPremium: {
                    normal: 'https://gf2.geo.gfsrv.net/cdn7a/eb29418610d19bfd0e87574abbaaef.png',
                    active: 'https://gf3.geo.gfsrv.net/cdn8d/d2b95e6eeb9191f0a207adbe1d9994.png',
                    mini  : '/skin/minimized/researchAdvisor.png',
                },

                onePieceUsopp: {
                    normal: 'https://raw.githubusercontent.com/YveOne/Userscript-IkaTweaks/master/images/onePieceUsoppNormal.png',
                    active: 'https://raw.githubusercontent.com/YveOne/Userscript-IkaTweaks/master/images/onePieceUsoppActive.png',
                    mini  : 'https://raw.githubusercontent.com/YveOne/Userscript-IkaTweaks/master/images/onePieceUsoppMini.png',
                    fixes : 'background-position-y:1px;',
                },

            },
            diplomacy: {

                maleDiplomat: {
                    normal: '/skin/layout/advisors/diplomat.png',
                    active: '/skin/layout/advisors/diplomat_active.png',
                    mini  : '/skin/minimized/diplomacyAdvisor.png',
                    fixes : 'background-position-y:1px;',
                },
                maleDiplomatPremium: {
                    normal: '/skin/layout/advisors/diplomat_premium.png',
                    active: '/skin/layout/advisors/diplomat_premium_active.png',
                    mini  : 'https://raw.githubusercontent.com/YveOne/Userscript-IkaTweaks/master/images/maleDiplomatPremiumMini.png',
                    fixes : 'background-position-y:1px;',
                },

                femaleDiplomat: {
                    normal: 'https://gf2.geo.gfsrv.net/cdn79/34aae35dbef7ac0666cd5d4e795fec.png',
                    active: 'https://gf3.geo.gfsrv.net/cdn22/9183f61d09d24f5fae2394bc970bbf.png',
                    mini  : '/skin/minimized/diplomacyAdvisor.png',
                },
                femaleDiplomatPremium: {
                    normal: 'https://gf1.geo.gfsrv.net/cdn9c/f57b89fb383d7071aabaff522582a0.png',
                    active: 'https://gf1.geo.gfsrv.net/cdn32/70449a533dbc49e268644784739e29.png',
                    mini  : '/skin/minimized/diplomacyAdvisor.png',
                },

                barbarianDiplomat: {
                    normal: 'https://gf1.geo.gfsrv.net/cdn35/e6b1edfb47413ca3125ade683d12fe.png',
                    active: 'https://gf1.geo.gfsrv.net/cdn6e/a250bc22b3802efc5aa663c0c9e2e8.png',
                    mini  : '/skin/minimized/diplomacyAdvisor.png',
                },
                barbarianDiplomatPremium: {
                    normal: 'https://gf3.geo.gfsrv.net/cdn2d/6ed7dcb6cac8e54520f1019b8f5056.png',
                    active: 'https://gf2.geo.gfsrv.net/cdn7a/27a589adb2ace5d7067db7b954736d.png',
                    mini  : '/skin/minimized/diplomacyAdvisor.png',
                },

                onePieceNami: {
                    normal: 'https://raw.githubusercontent.com/YveOne/Userscript-IkaTweaks/master/images/onePieceNamiNormal.png',
                    active: 'https://raw.githubusercontent.com/YveOne/Userscript-IkaTweaks/master/images/onePieceNamiActive.png',
                    mini  : 'https://raw.githubusercontent.com/YveOne/Userscript-IkaTweaks/master/images/onePieceNamiMini.png',
                    fixes : 'background-position-y:1px;',
                },
            },
        };

        var advisorsStyleRules = `
            #header #advisors #advCities a      {{citiesFixes}}
            #header #advisors #advMilitary a    {{militaryFixes}}
            #header #advisors #advResearch a    {{researchFixes}}
            #header #advisors #advDiplomacy a   {{diplomacyFixes}}
            #header #advisors #advCities .normal            {background-image:url({citiesNormal})}
            #header #advisors #advCities .normalactive      {background-image:url({citiesActive})}
            #header #advisors #advCities .premium           {background-image:url({citiesNormal})}
            #header #advisors #advCities .premiumactive     {background-image:url({citiesActive})}
            #header #advisors #advMilitary .normal          {background-image:url({militaryNormal})}
            #header #advisors #advMilitary .normalactive    {background-image:url({militaryActive})}
            #header #advisors #advMilitary .normalalert     {background-image:url({militaryAlert})}
            #header #advisors #advMilitary .premium         {background-image:url({militaryNormal})}
            #header #advisors #advMilitary .premiumactive   {background-image:url({militaryActive})}
            #header #advisors #advMilitary .premiumalert    {background-image:url({militaryAlert})}
            #header #advisors #advResearch .normal          {background-image:url({researchNormal})}
            #header #advisors #advResearch .normalactive    {background-image:url({researchActive})}
            #header #advisors #advResearch .premium         {background-image:url({researchNormal})}
            #header #advisors #advResearch .premiumactive   {background-image:url({researchActive})}
            #header #advisors #advDiplomacy .normal         {background-image:url({diplomacyNormal})}
            #header #advisors #advDiplomacy .normalactive   {background-image:url({diplomacyActive})}
            #header #advisors #advDiplomacy .premium        {background-image:url({diplomacyNormal})}
            #header #advisors #advDiplomacy .premiumactive  {background-image:url({diplomacyActive})}
            #container #tradeAdvisor_c:before, #container #premiumTradeAdvisor_c:before, #container #tradeRoutes_c:before, #container #registrationGifts_c:before, #container #dailyTasks_c:before, #container #dailyTasksRewards_c:before, #container #premiumTradeAdvisorCitizens_c:before, #container #premiumTradeAdvisorBuildings_c:before {
                content: url({citiesMini});
            }
            #container #militaryAdvisor_c:before, #container #retreat_c:before, #container #premiumMilitaryAdvisor_c:before, #container #militaryAdvisorCombatList_c:before, #container #militaryAdvisorWarList_c:before, #container #militaryAdvisorOldWars_c:before, #container #militaryAdvisorOldAllyWars_c:before, #container #militaryAdvisorWarDetails_c:before, #container #militaryAdvisorAllyWarDetails_c:before {
                content: url({militaryMini});
            }
            #container #researchAdvisor_c:before, #container #researchDetail_c:before, #container #premiumResearchAdvisor_c:before {
                content: url({researchMini});
            }
            #container #diplomacyAdvisor_c:before, #container #diplomacyIslandBoard_c:before, #container #diplomacyAdvisorOutBox_c:before, #container #diplomacyAdvisorArchive_c:before, #container #diplomacyAdvisorArchiveOutBox_c:before, #container #diplomacyTreaty_c:before, #container #diplomacyAlly_c:before, #container #diplomacyAdvisorSearchUser_c:before, #container #diplomacyAlly_c:before, #container #premiumDiplomacyAdvisor_c:before, #container #ignoreList_c:before, #container #diplomacyAllyMemberlist_c:before, #container #diplomacyAllySearch_c:before, #container #diplomacyAllyInfo_c:before {
                content: url({diplomacyMini});
            }
        `;

        var cssElement;
        function updateCSS() {
            var css = [];
            var cities      = advisorImages.cities[modData.replacements.cities];
            var military    = advisorImages.military[modData.replacements.military];
            var research    = advisorImages.research[modData.replacements.research];
            var diplomacy   = advisorImages.diplomacy[modData.replacements.diplomacy];
            css.push(TPL.parse(advisorsStyleRules, {
                citiesNormal        : cities.normal,
                citiesActive        : cities.active,
                citiesMini          : cities.mini,
                citiesFixes         : cities.fixes||'',
                militaryNormal      : military.normal,
                militaryActive      : military.active,
                militaryAlert       : military.alert,
                militaryMini        : military.mini,
                militaryFixes       : military.fixes||'',
                researchNormal      : research.normal,
                researchActive      : research.active,
                researchMini        : research.mini,
                researchFixes       : research.fixes||'',
                diplomacyNormal     : diplomacy.normal,
                diplomacyActive     : diplomacy.active,
                diplomacyMini       : diplomacy.mini,
                diplomacyFixes      : diplomacy.fixes||'',
            }));
            if(cssElement) removeElement(cssElement);
            injectCSS(css.join(''), function(el){cssElement=el;});
        }
        updateCSS();

        TPL.set('ChangeAdvisors_settingsWindow', `
            <div id="mainview">
                <div class='buildingDescription'><h1>{str_ChangeAdvisors_name}</h1></div>
                <div>
                    <div class="contentBox01h" style="z-index: 101;">
                        <h3 class="header hidden"></h3>
                        <div class="content">
                            <table class="table01 left"><tbody>
                                <tr>
                                    <td>
                                        <table id="ChangeAdvisors_advisorSelectTable">
                                            {advisors}
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        <div class="centerButton">
                                            <input id="js_ChangeAdvisors_saveSettingsBtn" type="button" class="button" value="{str_save}" />
                                        </div>
                                    </th>
                                </tr>
                            </tbody></table>
                        </div>
                        <div class="footer"></div>
                    </div>
                </div>
            </div>
        `);

        TPL.set('ChangeAdvisors_advisorTR', `
            <tr>
                <td style="width:100px;">{text}</td>
                <td>{select}</td>
            </tr>
        `);

        IkaTweaks.addSidebarButton('{str_ChangeAdvisors_name}', function(){

            var AdvisorSelects = {};
            advisors.forEach((advisorId) => {
                var selectId = 'ChangeAdvisors_advisorSelect_'+advisorId;
                var options = {};
                Object.keys(advisorImages[advisorId]).forEach((key) => {
                    options[key] = `{str_ChangeAdvisors_${key}}`;
                });
                var selected = modData.replacements[advisorId];
                AdvisorSelects[advisorId] = new SelectDropDown(selectId, 300, options, selected);
            });

            IkaTweaks.changeHTML('ChangeAdvisors', TPL.get('ChangeAdvisors_settingsWindow', {
                advisors: TPL.each(advisorImages, function(advisorData, advisorId){
                    return ['ChangeAdvisors_advisorTR', {
                        text    : '{str_ChangeAdvisors_'+advisorId+'}',
                        select  : AdvisorSelects[advisorId].tpl(),
                    }];
                }),

            })).then(() => {
                $('#js_ChangeAdvisors_saveSettingsBtn').click(function(){
                    forEach(advisorImages, (_, advisorId) => {
                        modData.replacements[advisorId] = AdvisorSelects[advisorId].val();
                    });
                    modDataSave();
                    updateCSS();
                    IkaTweaks.success();
                });

                // preview
                var $img = $('<img>');
                $('<td>',{rowspan:4,width:90}).appendTo($('#ChangeAdvisors_advisorSelectTable tr').first()).append($img);
                function optionMove(event) {
                    var tar = $(event.target);
                    $img.attr('src', advisorImages[tar.closest('ul').attr('advisor')][tar.closest('li').attr('selectValue')].normal);
                }
                function optionEnter(event) {
                    $img.fadeIn();
                }
                function optionLeave(event) {
                    $img.fadeOut();
                }
                forEach(advisorImages, (advisorImageList, k) => {
                    $('#dropDown_js_ChangeAdvisors_advisorSelect_'+k+'Container ul').attr('advisor', k).mouseenter(optionEnter).mouseleave(optionLeave);
                    forEach(advisorImageList, (_, n) => {
                        $('#dropDown_js_ChangeAdvisors_advisorSelect_'+k+'Container li[selectValue="'+n+'"]').mousemove(optionMove);
                        $('#dropDown_js_ChangeAdvisors_advisorSelect_'+k+'Container li[selectValue="'+n+'"] a').mousemove(optionMove);
                    });
                });

            }).catch(() => {});
        });

    });

    // MODULE: ChangeAdvisors
    //-----------------------------------------------------------------------------

    //-----------------------------------------------------------------------------
    // MODULE: MoveBuildings

    IkaTweaks.setModule('MoveBuildings', function(modData, modDataSave){
        if(typeof modData.customPositions           == 'undefined') modData.customPositions         = {};

        var moveBuildingsBackground = 'https://raw.githubusercontent.com/YveOne/Userscript-IkaTweaks/master/images/moveBuildingsBackground.jpg';
        var moveBuildingsEmptyButton = 'https://raw.githubusercontent.com/YveOne/Userscript-IkaTweaks/master/images/moveBuildingsEmptyButton.png';

        const BUILDING_POSITIONS_COUNT = 20;
        function buildEmptyPositions() {
            return new Array(BUILDING_POSITIONS_COUNT).fill(null).map((v, i)=>(i));
        }

        injectCSS(`
            #MoveBuildings #buildingDetail .building_nav { height: 424px; /*width:674px;*/ overflow: visible; background: url(`+moveBuildingsBackground+`); }
            #MoveBuildings #buildingDetail .button_building { position: absolute; }
            #MoveBuildings #buildingDetail .button_building[position="0"]  {left: 299px;top: 169px;}
            #MoveBuildings #buildingDetail .button_building[position="1"]  {left: 236px;top: 293px;}
            #MoveBuildings #buildingDetail .button_building[position="2"]  {left: 381px;top: 270px;}
            #MoveBuildings #buildingDetail .button_building[position="3"]  {left: 440px;top: 198px;}
            #MoveBuildings #buildingDetail .button_building[position="4"]  {left: 354px;top: 205px;}
            #MoveBuildings #buildingDetail .button_building[position="5"]  {left: 282px;top: 222px;}
            #MoveBuildings #buildingDetail .button_building[position="6"]  {left: 204px;top: 212px;}
            #MoveBuildings #buildingDetail .button_building[position="7"]  {left: 142px;top: 192px;}
            #MoveBuildings #buildingDetail .button_building[position="8"]  {left: 135px;top: 143px;}
            #MoveBuildings #buildingDetail .button_building[position="9"]  {left: 197px;top: 161px;}
            #MoveBuildings #buildingDetail .button_building[position="10"] {left: 369px;top: 151px;}
            #MoveBuildings #buildingDetail .button_building[position="11"] {left: 440px;top: 131px;}
            #MoveBuildings #buildingDetail .button_building[position="12"] {left: 317px;top: 104px;}
            #MoveBuildings #buildingDetail .button_building[position="13"] {left: 258px;top: 123px;}
            #MoveBuildings #buildingDetail .button_building[position="14"] {left: 119px;top:  91px;}
            #MoveBuildings #buildingDetail .button_building[position="15"] {left: 168px;top: 271px;}
            #MoveBuildings #buildingDetail .button_building[position="16"] {left: 387px;top: 102px;}
            #MoveBuildings #buildingDetail .button_building[position="17"] {left: 385px;top: 352px;}
            #MoveBuildings #buildingDetail .button_building[position="18"] {left: 492px;top: 223px;}
            #MoveBuildings #buildingDetail .button_building[position="19"] {left: 492px;top:  54px;}
            #MoveBuildings .building_nav .button_building.groundShore,
            #MoveBuildings .building_nav .button_building.groundLand,
            #MoveBuildings .building_nav .button_building.groundLocked,
            #MoveBuildings .building_nav .button_building.groundWall,
            #MoveBuildings .building_nav .button_building.empty {
                background-image: url(`+moveBuildingsEmptyButton+`);
            }
            #MoveBuildings .building_nav .button_building.empty {
                background-position: -86px 0px;
            }
            #MoveBuildings .building_nav .button_building.empty.hover {
                background-position: -86px -41px;
            }
            #MoveBuildings .building_nav .button_building.groundShore,
            #MoveBuildings .building_nav .button_building.groundLand,
            #MoveBuildings .building_nav .button_building.groundWall {
                background-position: -43px 0px;
            }
            #MoveBuildings .building_nav .button_building.groundShore.hover,
            #MoveBuildings .building_nav .button_building.groundLand.hover,
            #MoveBuildings .building_nav .button_building.groundWall.hover {
                background-position: -43px -41px;
            }
            #MoveBuildings .building_nav .button_building.groundLocked {
                background-position: 0px 0px;
            }
            #MoveBuildings .building_nav .button_building.groundLocked.hover {
                background-position: 0px -41px;
            }
        `);

        var positionCSS = `
            #city #locations .position{0} {left: 884px;top:462px}
            #city #locations .position{1} {left: 730px;top:738px}
            #city #locations .position{2} {left:1085px;top:717px}
            #city #locations .position{3} {left:1209px;top:535px}
            #city #locations .position{4} {left:1010px;top:556px}
            #city #locations .position{5} {left: 851px;top:596px}
            #city #locations .position{6} {left: 649px;top:577px}
            #city #locations .position{7} {left: 491px;top:537px}
            #city #locations .position{8} {left: 490px;top:416px}
            #city #locations .position{9} {left: 650px;top:457px}
            #city #locations .position{10}{left:1051px;top:418px}
            #city #locations .position{11}{left:1207px;top:376px}
            #city #locations .position{12}{left: 908px;top:312px}
            #city #locations .position{13}{left: 770px;top:359px}
            #city #locations .position{14}{left: 452px;top:284px}
            #city #locations .position{15}{left: 528px;top:717px}
            #city #locations .position{16}{left:1088px;top:319px}
            #city #locations .position{17}{left:1088px;top:892px}
            #city #locations .position{18}{left:1332px;top:585px}
            #city #locations .position{19}{left:1320px;top:203px}
            #city #locations .position{1}.port .buildingimg{background-image:url(skin/img/city/port_r.png)}
            #city #locations .position{2}.port .buildingimg{background-image:url(skin/img/city/port_l.png)}
            #city #locations .position{1}.port.busy .buildingimg{background-image:url(skin/img/city/port_r_mit_schiff.png)}
            #city #locations .position{2}.port.busy .buildingimg{background-image:url(skin/img/city/port_l_mit_schiff.png)}
            #city #locations .position{1}.shipyard .buildingimg{background-image:url(skin/img/city/shipyard_r.png)}
            #city #locations .position{2}.shipyard .buildingimg{background-image:url(skin/img/city/shipyard_l.png)}
            #city #locations .position{1}.port .hover{background-image:url(//gf1.geo.gfsrv.net/cdn00/1e6f6c206e6bf006790b2062fba85d.png)}
            #city #locations .position{2}.port .hover{background-image:url(//gf2.geo.gfsrv.net/cdn48/5f95f6e13b94a5fedae8aca896d3d1.png)}
            #city #locations .position{1}.shipyard .hover{background-image:url(//gf1.geo.gfsrv.net/cdn3f/9f9aabfcb932d03424c287a9743315.png)}
            #city #locations .position{2}.shipyard .hover{background-image:url(//gf2.geo.gfsrv.net/cdn44/c2e872f477f8bb8e49eaab4e154012.png)}
            #city #locations .position{1}.port .img_pos{left:-45px;top:-48px;width:209px;height:148px}
            #city #locations .position{2}.port .img_pos{left:-57px;top:-43px;width:209px;height:148px}
            #city #locations .shipyard .img_pos{left:-70px;top:-64px;width:191px;height:126px}
            #city .animated #locations .position{1}.port.busy .buildingimg{background-image:url(skin/img/city/hafen_r_neu.png)}
            #city .animated #locations .position{2}.port.busy .buildingimg{background:url(skin/img/city/hafen_l_neu.png) 5px 0px}
        `;

        var cssPositionsElement;
        function updatePositionsCSS(cityKey) {
            var aliases = modData.customPositions[cityKey];
            if(!aliases) return;
            var css = [];
            css.push(TPL.parse(positionCSS, aliases));
            if (cssPositionsElement) removeElement(cssPositionsElement);
            injectCSS(css.join(''), function(el){ cssPositionsElement = el; });
        }

        TPL.set('MoveBuildings_positionsWindow', `
            <div id="mainview">
                <div class='buildingDescription'><h1>{str_MoveBuildings_name}</h1></div>
                <div class="contentBox01h" style="z-index: 101;">
                    <h3 class="header hidden"></h3>
                    <div class="content">
                        <table class="table01 left"><tbody>
                            <tr>
                                <th style="width:190px;">{select}</th>
                                <th class="left">
                                    <input id="js_MoveBuildings_savePositionsButton" type="button" class="button" value="{str_MoveBuildings_SavePositions}" />
                                </th>
                            </tr>
                            <tr><td colspan="2" style="padding:0;">
                                <div id="buildingDetail"><div class="building_nav" style="position:relative;"></div></div>
                            </td></tr>
                            <tr><th colspan="2"><i>{str_MoveBuildings_DragDropHint}</i></th></tr>
                        </tbody></table>
                    </div>
                    <div class="footer"></div>
                </div>
            </div>
        `);

        TPL.set('MoveBuildings_dragableButton', `
            <div position="{position}"
                class="button_building empty"
                draggable="true"
                onmouseover="$(this).addClass('hover');"
                onmouseout="$(this).removeClass('hover');">
            </div>
        `);

        function buildPositionsData(relatedCityData) {
            forEach(relatedCityData, (relatedCity, cityKey) => {
                if(relatedCity && relatedCity.relationship == 'ownCity') {
                    if(!modData.customPositions[cityKey]) {
                        modData.customPositions[cityKey] = buildEmptyPositions();
                    }
                    for(var i=0; i<BUILDING_POSITIONS_COUNT; i+=1) {
                        if(typeof modData.customPositions[cityKey][i] == 'undefined') modData.customPositions[cityKey][i] = i;
                    }
                }
            });
            // TODO: cleanup deleted cities
        }

        var locationHideStyleEle;
        injectCSS('#locations {display: none;}', function(el){ locationHideStyleEle = el; });

        // fast update after page load
        // no need to check if we are in city view because the expandslot is only visible in city view
        waitFor(() => {
            return document.querySelector('li.expandable.slot0.military').getAttribute('onclick').match(/cityId=(\d+)/)[1];
        }).then((cityId) => {
            updatePositionsCSS('city_'+cityId);
            if(locationHideStyleEle) removeElement(locationHideStyleEle);
        }).catch(() => {});

        // later updates after city change
        waitFor(() => {
            jshintUnused = dataSetForView.relatedCityData;
            jshintUnused = ikariam.backgroundView.screen.update;
            return true;
        }).then(() => {
            if(ikariam.backgroundView.id != 'city') return;
            buildPositionsData(dataSetForView.relatedCityData);
            hookFunction(ikariam.backgroundView.screen, 'update', function(){
                updatePositionsCSS(ikariam.model.relatedCityData.selectedCity);
            });
        }).catch(() => {});

        var showPositionsWindow;

        showPositionsWindow = function() {

            var relatedCityData = ikariam.model.relatedCityData;
            buildPositionsData(relatedCityData);

            var buildingSpawn;
            var buildingButtons = {};
            var workingPositionAliases = [];
            var workingConfirmTownChange = false;
            var workingCityKey;

            var restricted = [];
            restricted[1] = [1,2];
            restricted[2] = [1,2];
            restricted[14] = [14];

            function allowDrop(event) {
                event = event.originalEvent;
                event.preventDefault();
            }

            function drag(event) {
                event = event.originalEvent;
                event.dataTransfer.setData('position', event.target.getAttribute('position'));
            }

            function drop(event) {
                event = event.originalEvent;
                event.preventDefault();
                workingConfirmTownChange = true;
                var ele1 = $('#buildingDetail .building_nav .button_building[position="'+event.target.getAttribute('position')+'"]');
                var ele2 = $('#buildingDetail .building_nav .button_building[position="'+event.dataTransfer.getData('position')+'"]');
                var pos1 = parseInt(ele1.attr('position'));
                var pos2 = parseInt(ele2.attr('position'));
                if((restricted[pos1] && restricted[pos1].indexOf(pos2) == -1) || (restricted[pos2] && restricted[pos2].indexOf(pos1) == -1)) {
                    IkaTweaks.warning(LANG('str_MoveBuildings_restrictedPosition'));
                    return;
                }
                // swap working positions
                workingPositionAliases[pos1] = [workingPositionAliases[pos2], workingPositionAliases[pos2] = workingPositionAliases[pos1]][0];
                // swap element attributes
                ele1.attr('position', pos2);
                ele2.attr('position', pos1);
            }

            function buildWorkingButtons() {
                buildingSpawn = $('#buildingDetail .building_nav');
                for (var i=0; i<BUILDING_POSITIONS_COUNT; i++) {
                    buildingButtons[i] = $(TPL.get('MoveBuildings_dragableButton',{position:i}));
                    buildingButtons[i].on('dragstart', drag);
                    buildingButtons[i].on('dragover', allowDrop);
                    buildingButtons[i].on('drop', drop);
                    buildingButtons[i].appendTo(buildingSpawn);
                }
            }

            var citySelectOptions = {};
            forEach(relatedCityData, (data, cityKey) => {
                if (data.relationship === 'ownCity') {
                    citySelectOptions[cityKey] = data.name;
                }
            });
            var citySelect = new SelectDropDown('MoveBuildings_citySelect', 175, citySelectOptions, relatedCityData.selectedCity);

            function updateWorkingPositions() {
                workingConfirmTownChange = false;
                forEach(buildingButtons, (_, k) => {
                    buildingButtons[k].attr('class', 'button_building empty').attr('title', '');
                });
                var cityId = forceInt(citySelect.val());

                var cityKey = 'city_'+cityId;
                if(!modData.customPositions[cityKey]) return;
                workingCityKey = cityKey;

                workingPositionAliases = (function(p){
                    var l=[];
                    for(var i=0; i<BUILDING_POSITIONS_COUNT; i++) {
                        l[i]=(typeof p[i] !== null) ? p[i] : i;
                    }
                    return l;
                })(modData.customPositions[cityKey]);

                $.ajax({
                    async:true,
                    type:'GET',
                    url:'index.php?action=header&function=changeCurrentCity&currentCityId='+cityId+'&cityId='+cityId+'&backgroundView=city&oldView=city&ajax=1',
                    data:null,
                    beforeSend:function(){},
                    error:function(){},
                    success:function(data){

                        data = (function(c){for(var i=0; i<c.length; i++) if(c[i][0]=='updateGlobalData') return c[i][1].backgroundData;})(JSON.parse(data));
                        for(var i=0; i<data.position.length; i++)
                        {
                            var position = data.position[workingPositionAliases[i]];
                            if(position.building.startsWith('buildingGround'))
                            {
                                if(data.lockedPosition[i])
                                {
                                    buildingButtons[i].attr('class', 'button_building groundLocked').attr('title', data.lockedPosition[i]);
                                }
                                else
                                {
                                    buildingButtons[i].attr('class', 'button_building groundLand').attr('title', LocalizationStrings.free_building_space);
                                }
                            }
                            else
                            {
                                buildingButtons[i].attr('class', 'button_building '+position.building).attr('title', position.name+' ('+position.level+')');
                            }
                            buildingButtons[i].attr('position', i);
                        }
                    }
                });
            }

            function saveWorking() {
                workingConfirmTownChange = false;
                for(var i=0; i<BUILDING_POSITIONS_COUNT; i+=1) modData.customPositions[workingCityKey][i] = workingPositionAliases[i];
                modDataSave();
                if (citySelect.val() === ikariam.model.relatedCityData.selectedCity) {
                    updatePositionsCSS(citySelect.val());
                }
                IkaTweaks.success();
            }

            IkaTweaks.changeHTML('MoveBuildings', TPL.get('MoveBuildings_positionsWindow', {
                select : citySelect.tpl(),
            })).then(() => {
                $('#js_tab_MoveBuildings_positionsWindow').addClass('selected');
                buildWorkingButtons();
                citySelect.change(function(){
                    if(workingConfirmTownChange && confirm(LANG('str_MoveBuildings_confirmSaveChanged'))) saveWorking();
                    updateWorkingPositions();
                });
                updateWorkingPositions();
                $('#js_MoveBuildings_savePositionsButton').click(saveWorking);
            }).catch(() => {});

        };

        IkaTweaks.addSidebarButton('{str_MoveBuildings_name}', showPositionsWindow);

    });

    // MODULE: MoveBuildings
    //-----------------------------------------------------------------------------

    LANG.alias('us', 'en');
    LANG('en', 'English', {

        'str_IkaTweaks'             : 'IkaTweaks',
        'str_IkaTweaks_menu'        : 'IkaTweaks Menu',
        'str_IkaTweaks_tabModules'  : 'Modules',
        'str_IkaTweaks_tabAbout'    : 'About & Credits',
        'str_IkaTweaks_version'     : 'Version',
        'str_IkaTweaks_changelog'   : 'Changelog',

        'str_modules'           : 'Modules',
        'str_enabled'           : 'Enabled',
        'str_name'              : 'Name',
        'str_description'       : 'Description',
        'str_save'              : 'Save',
        'str_saveLanguage'      : 'Save language',
        'str_success0'          : 'Success',
        'str_success1'          : 'It\s an honor',
        'str_success2'          : 'At your command',
        'str_success3'          : 'Hallelujah',
        'str_success4'          : 'That\'s how it should be',

        'str_IkaTweaks_aboutHeader'     : 'About',
        'str_IkaTweaks_creditsHeader'   : 'Credits',

        'str_ClearStorageText'  : 'Clear LocalStorage',
        'str_ClearStorageInfo'  : 'Here you can delete all saved data for IkaTweaks out of your Browser',

        'str_ToGreasyForkText'  : 'IkaTweaks @ Greasy Fork',
        'str_ToOpenUserJSText'  : 'IkaTweaks @ OpenUserJS',
        'str_ToGitHubRepoText'  : 'IkaTweaks @ GitHub',

        'str_IkaTweaks_aboutText2'  : 'Questions, ideas, bugs or complaints? Email me at <span id="myEmail"></span> or visit me at: ',
        'str_IkaTweaks_aboutCredits': 'The used OnePiece images can be found on: <a id="creditUrl1"></a>',

        'str_versionForceCheck'         : 'Check now',
        'str_versionLastCheckResult'    : 'Last result',
        'str_versionNewAvailable'       : 'New version available',
        'str_versionUpToDate'           : 'Version is up to date',
        'str_versionGetNewestHere'      : 'Get the newest versions here',
        'str_versionCheckFailed'        : 'Checking failed',
        'str_versionAutoCheck'          : 'Activate automatic checks',

        // -- GeneralTweaks
        'str_GeneralTweaks_name'                : 'General tweaks',
        'str_GeneralTweaks_info'                : 'Change CSS rules or remove objects and advertising',
        // -- GeneralTweaks - bugFixes
        'str_GeneralTweaks_bugFixes'                    : 'Bug fixes',
        'str_GeneralTweaks_fixResearchWindowList'           : 'Fix research list in research window',
        'str_GeneralTweaks_fixCitySelectItems'              : 'Fix city select items',
        'str_GeneralTweaks_fixWindowTopPadding'             : 'Fix window top padding (looks nicer)',
        'str_GeneralTweaks_fixScrollbars'                   : 'Fix scrollbars',
        'str_GeneralTweaks_fixHoverEffectSwitching'         : 'Fix hover effects switching while mouseover on page load',
        'str_GeneralTweaks_fixDarkSelectActiveColor'        : 'Fix active font color of dark drop down menus',
        'str_GeneralTweaks_fixWindowTabSizes'               : 'Fix window tab sizes',
        'str_GeneralTweaks_removeBlueLinkBorders'           : 'Remove blue borders from active Links',
        // -- GeneralTweaks - antiAds
        'str_GeneralTweaks_antiAds'                     : 'Anti Advertising',
        'str_GeneralTweaks_adsHideSpeedUpButtons'           : 'Remove speed-up buttons',
        'str_GeneralTweaks_adsHideWindowAds'                : 'Remove window ads',
        'str_GeneralTweaks_adsHideHappyHour'                : 'Remove happy hour timer',
        'str_GeneralTweaks_adsHideOfferBoxes'               : 'Remove premium offer boxes',
        'str_GeneralTweaks_adsHideSlotResourceShop'         : 'Remove slot "Resource Shop"',
        'str_GeneralTweaks_adsHideSlotPremiumTrader'        : 'Remove slot "Premium Trader"',
        'str_GeneralTweaks_adsHideArchiveButtons'           : 'Remove archive buttons in messages window',
        'str_GeneralTweaks_adsHideMilitaryDummies'          : 'Remove military dummy boxes',
        'str_GeneralTweaks_adsHideAdvisorButtons'           : 'Remove advisor premium buttons',
        'str_GeneralTweaks_adsHideToolbarMMOAds'            : 'Remove toolbar MMO ads',
        // -- GeneralTweaks - animations
        'str_GeneralTweaks_animations'                  : 'Animations',
        'str_GeneralTweaks_animHideWalkers'                 : 'Hide all walkers and birds',
        'str_GeneralTweaks_animHideWalkerBubbles'           : 'Hide walker bubbles',
        'str_GeneralTweaks_animHideBirdsOnly'               : 'Hide birds only',
        // -- GeneralTweaks - cities
        'str_GeneralTweaks_cities'                      : 'cities',
        'str_GeneralTweaks_cityIgnoreCapital'               : 'Use normal city background for capital',
        'str_GeneralTweaks_cityUseCustomBackground'         : 'Use custom background for all your cities',
        'str_GeneralTweaks_cityUseCustomBackgroundLevel'    : 'Level {level}',
        'str_GeneralTweaks_cityHidePirateFortress'          : 'Hide pirate fortress',
        'str_GeneralTweaks_cityHideLockedPosition'          : 'Hide locked position',
        'str_GeneralTweaks_cityHideDailyTasks'              : 'Hide daily tasks',
        'str_GeneralTweaks_cityHideRegistrationGifts'       : 'Hide regestration gifts',
        'str_GeneralTweaks_cityHideFlyingShop'              : 'Hide flying premium shop',
        'str_GeneralTweaks_cityHideAmbrosiaFountain'        : 'Hide ambrosia fountain',
        // -- GeneralTweaks - ressources
        'str_GeneralTweaks_resources'                   : 'Cost resources',
        'str_GeneralTweaks_resShowMissing'                  : 'Show missing resources',
        'str_GeneralTweaks_resShowRemaining'                : 'Show remaining resources',
        'str_GeneralTweaks_warehouseShowRemainingSave'      : 'Show remaing secure resources in warehouse',
        // -- GeneralTweaks - interactive
        'str_GeneralTweaks_interactive'                 : 'Interactive',
        'str_GeneralTweaks_actShowMouseoverPlaques'         : 'Show building name on plaque on mouse over',
        'str_GeneralTweaks_actPreventPlaqueScaling'         : 'Show plaques always at full size',
        'str_GeneralTweaks_actHideMouseoverTitles'          : 'Hide default titles on mouse over',
        'str_GeneralTweaks_cityHoverToBackground'           : 'Move mouseover effect into background in cities (fixes display bugs)',
        'str_GeneralTweaks_islandHoverToBackground'         : 'Move mouseover effect into background on islands',
        // -- GeneralTweaks - fleets
        'str_GeneralTweaks_fleets'                      : 'Fleet movements',
        'str_GeneralTweaks_fleetHideSpeedColumn'            : 'Hide speed column',
        'str_GeneralTweaks_fleetHidePremiumFleetInfo'       : 'Hide premium fleet info',
        'str_GeneralTweaks_fleetShowCapacities'             : 'Show Capacities',
        'str_GeneralTweaks_fleetDontBreakLines'             : 'Don\'t break lines (could cause display error on large names)',
        'str_GeneralTweaks_fleetReadableFilterButtons'      : 'Improve appearance of filter buttons (more readable)',
        'str_GeneralTweaks_fleetHideZeroFilterButtons'      : 'Hide filter buttons without movements',
        'str_GeneralTweaks_fleetMouseOverFleetInfo'         : 'Hide magnify icon and show fleet info on mouse over',



        // -- CityListing
        'str_CityListing_name'                  : 'Enhanced City Listing',
        'str_CityListing_info'                  : 'Change city order, show tradegoods or hide coords',
        'str_CityListing_hideCoords'            : 'Hide Coords',
        'str_CityListing_showTradegoods'        : 'Show Tradegoods',
        'str_CityListing_highlightSelected'     : 'Highlight selected city',
        'str_CityListing_sortList'              : 'Use custom sorting',

        // -- ChangeAdvisors
        'str_ChangeAdvisors_name'                    : 'Individual advisors',
        'str_ChangeAdvisors_info'                    : 'Change the appearance of your advisors separately',
        'str_ChangeAdvisors_cities'                  : 'Cities',
        'str_ChangeAdvisors_military'                : 'Military',
        'str_ChangeAdvisors_research'                : 'Research',
        'str_ChangeAdvisors_diplomacy'               : 'Diplomacy',
        'str_ChangeAdvisors_maleMayor'               : 'Mayor',
        'str_ChangeAdvisors_maleMayorPremium'        : 'Mayor (premium)',
        'str_ChangeAdvisors_maleGeneral'             : 'General',
        'str_ChangeAdvisors_maleGeneralPremium'      : 'General (premium)',
        'str_ChangeAdvisors_maleScientist'           : 'Scientist',
        'str_ChangeAdvisors_maleScientistPremium'    : 'Scientist (premium)',
        'str_ChangeAdvisors_maleDiplomat'            : 'Diplomat',
        'str_ChangeAdvisors_maleDiplomatPremium'     : 'Diplomat (premium)',
        'str_ChangeAdvisors_onePieceLuffy'           : 'Monkey D. Luffy (One Piece)',
        'str_ChangeAdvisors_onePieceZoro'            : 'Roronoa Zoro (One Piece)',
        'str_ChangeAdvisors_onePieceUsopp'           : 'Usopp (One Piece)',
        'str_ChangeAdvisors_onePieceNami'            : 'Nami (One Piece)',
        'str_ChangeAdvisors_barbarianMayor'              : 'Barbarian mayor',
        'str_ChangeAdvisors_barbarianMayorPremium'       : 'Barbarian mayor (premium)',
        'str_ChangeAdvisors_barbarianGeneral'            : 'Barbarian general',
        'str_ChangeAdvisors_barbarianGeneralPremium'     : 'Barbarian general (premium)',
        'str_ChangeAdvisors_barbarianScientist'          : 'Barbarian scientist',
        'str_ChangeAdvisors_barbarianScientistPremium'   : 'Barbarian scientist (premium)',
        'str_ChangeAdvisors_barbarianDiplomat'           : 'Barbarian diplomat',
        'str_ChangeAdvisors_barbarianDiplomatPremium'    : 'Barbarian diplomat (premium)',
        'str_ChangeAdvisors_femaleMayor'                 : 'Female mayor',
        'str_ChangeAdvisors_femaleMayorPremium'          : 'Female mayor (premium)',
        'str_ChangeAdvisors_femaleGeneral'               : 'Female general',
        'str_ChangeAdvisors_femaleGeneralPremium'        : 'Female general (premium)',
        'str_ChangeAdvisors_femaleScientist'             : 'Female scientist',
        'str_ChangeAdvisors_femaleScientistPremium'      : 'Female scientist (premium)',
        'str_ChangeAdvisors_femaleDiplomat'              : 'Female diplomat',
        'str_ChangeAdvisors_femaleDiplomatPremium'       : 'Female diplomat (premium)',

        // -- MoveBuildings
        'str_MoveBuildings_name'                : 'Move Buildings',
        'str_MoveBuildings_info'                : 'Change positions of your buildings',
        'str_MoveBuildings_SavePositions'       : 'Save positions',
        'str_MoveBuildings_DragDropHint'        : '(Change positions by drag&drop them onto each other)',
        'str_MoveBuildings_confirmSaveChanged'  : 'Save changed positions?',
        'str_MoveBuildings_restrictedPosition'  : 'That building cannot be placed there',

    });

    LANG('de', 'Deutsch', {

        'str_IkaTweaks'             : 'IkaTweaks',
        'str_IkaTweaks_menu'        : 'IkaTweaks Menü',
        'str_IkaTweaks_tabModules'  : 'Module',
        'str_IkaTweaks_tabAbout'    : 'Info & Credits',
        'str_IkaTweaks_version'     : 'Version',
        'str_IkaTweaks_changelog'   : 'Changelog',

        'str_modules'           : 'Module',
        'str_enabled'           : 'Aktiviert',
        'str_name'              : 'Name',
        'str_description'       : 'Beschreibung',
        'str_save'              : 'Speichern',
        'str_saveLanguage'      : 'Sprache speichern',
        'str_success0'          : 'Erfolg',
        'str_success1'          : 'Es ist mir eine Ehre',
        'str_success2'          : 'Zu Befehl!',
        'str_success3'          : 'Hallelujah',
        'str_success4'          : 'So soll es sein',

        'str_IkaTweaks_aboutHeader'     : 'Info',
        'str_IkaTweaks_creditsHeader'   : 'Credits',

        'str_ClearStorageText'  : 'LocalStorage leeren',
        'str_ClearStorageInfo'  : 'Hier können die gespeicherten Daten für IkaTweaks aus dem Browser gelöscht werden.',

        'str_ToGreasyForkText'  : 'IkaTweaks @ Greasy Fork',
        'str_ToOpenUserJSText'  : 'IkaTweaks @ OpenUserJS',
        'str_ToGitHubRepoText'  : 'IkaTweaks @ GitHub',
        'str_IkaTweaks_aboutText2'  : 'Fragen, Ideen, Fehler gefunden oder eine Beschwerde? Einfach eine Email an <span id="myEmail"></span> oder besuche mich auf: ',
        'str_IkaTweaks_aboutCredits': 'Die hier benutzten OnePiece Bilder sind von: <a id="creditUrl1"></a>',

        'str_versionForceCheck'             : 'Jetzt überprüfen',
        'str_versionLastCheckResult'        : 'Letztes Ergebnis',
        'str_versionNewAvailable'           : 'Neue Version verfügbar',
        'str_versionUpToDate'               : 'Deine Version ist aktuell',
        'str_versionGetNewestHere'          : 'Die neuste Version gibt es immer hier',
        'str_versionCheckFailed'            : 'Konnte Version nicht überprüfen',
        'str_versionAutoCheck'              : 'Überprüfe Version automatisch',

        // -- GeneralTweaks
        'str_GeneralTweaks_name'                : 'Allgemeine Optimierungen',
        'str_GeneralTweaks_info'                : 'Ändere CSS-Regeln oder entferne Objekte und Werbung',
        // -- GeneralTweaks - bugFixes
        'str_GeneralTweaks_bugFixes'                    : 'Bugfixes',
        'str_GeneralTweaks_fixResearchWindowList'           : 'Fix Forschungsliste im Forschungsfenster',
        'str_GeneralTweaks_fixCitySelectItems'              : 'Fix Stadt-Auswahl',
        'str_GeneralTweaks_fixWindowTopPadding'             : 'Fix oberen Abstand vom Fenster',
        'str_GeneralTweaks_fixScrollbars'                   : 'Fix Scrollbalken',
        'str_GeneralTweaks_fixHoverEffectSwitching'         : 'Fix Hover-Effekte-Wechsel',
        'str_GeneralTweaks_fixDarkSelectActiveColor'        : 'Fix Aktive Textfarbe von dunklen Dropdown-Menüs',
        'str_GeneralTweaks_fixWindowTabSizes'               : 'Fix Tab-Größen im Fenster',
        'str_GeneralTweaks_removeBlueLinkBorders'           : 'Entferne blauen Rand von aktivierten Links',
        // -- GeneralTweaks - antiAds
        'str_GeneralTweaks_antiAds'                     : 'Anti-Werbung',
        'str_GeneralTweaks_adsHideSpeedUpButtons'           : 'Entferne Speed-Up-Buttons',
        'str_GeneralTweaks_adsHideWindowAds'                : 'Entferne Werbung',
        'str_GeneralTweaks_adsHideHappyHour'                : 'Entferne Happy-Hour-Timer',
        'str_GeneralTweaks_adsHideOfferBoxes'               : 'Entferne Premium-Angebote',
        'str_GeneralTweaks_adsHideSlotResourceShop'         : 'Entferne Slot "Rohstoffe holen"',
        'str_GeneralTweaks_adsHideSlotPremiumTrader'        : 'Entferne slot "Premium Händler"',
        'str_GeneralTweaks_adsHideArchiveButtons'           : 'Entferne Archivieren-Buttons',
        'str_GeneralTweaks_adsHideMilitaryDummies'          : 'Entferne militärische Attrappen',
        'str_GeneralTweaks_adsHideAdvisorButtons'           : 'Entferne Berater-Premium-Buttons',
        'str_GeneralTweaks_adsHideToolbarMMOAds'            : 'Entferne MMO-Ads in der Toolbar',
        // -- GeneralTweaks - animations
        'str_GeneralTweaks_animations'                  : 'Animationen',
        'str_GeneralTweaks_animHideWalkers'                 : 'Verstecke alle Spaziergänger und Vögel',
        'str_GeneralTweaks_animHideWalkerBubbles'           : 'Verstecke Sprechblasen von Spaziergängern',
        'str_GeneralTweaks_animHideBirdsOnly'               : 'Verstecke nur Vögel',
        // -- GeneralTweaks - cities
        'str_GeneralTweaks_cities'                      : 'Städte',
        'str_GeneralTweaks_cityIgnoreCapital'               : 'Benutze normalen Hintergrund auch für Hauptstadt',
        'str_GeneralTweaks_cityUseCustomBackground'         : 'Benutzerdefinierter Hintergrund für all Deine Städte',
        'str_GeneralTweaks_cityUseCustomBackgroundLevel'    : 'Stufe {level}',
        'str_GeneralTweaks_cityHidePirateFortress'          : 'Verstecke Piratenfestung',
        'str_GeneralTweaks_cityHideLockedPosition'          : 'Verstecke gesperrten Bauplatz',
        'str_GeneralTweaks_cityHideDailyTasks'              : 'Verstecke tägliche Aufgaben',
        'str_GeneralTweaks_cityHideRegistrationGifts'       : 'Verstecke tägliche Geschenke',
        'str_GeneralTweaks_cityHideFlyingShop'              : 'Verstecke fliegenden Shop',
        'str_GeneralTweaks_cityHideAmbrosiaFountain'        : 'Verstecke Ambrosia-Brunnen',
        // -- GeneralTweaks - ressources
        'str_GeneralTweaks_resources'                   : 'Ressourcen-Kosten',
        'str_GeneralTweaks_resShowMissing'                  : 'Zeige fehlende Ressourcen',
        'str_GeneralTweaks_resShowRemaining'                : 'Zeige verbleibende Ressourcen',
        'str_GeneralTweaks_warehouseShowRemainingSave'      : 'Zeige verbleibende sichere Ressourcen im Lagerhaus',
        // -- GeneralTweaks - interactive
        'str_GeneralTweaks_interactive'                 : 'Interaktiv',
        'str_GeneralTweaks_actShowMouseoverPlaques'         : 'Zeige Gebäudenamen auf Plaketten bei Mouse-Over',
        'str_GeneralTweaks_actPreventPlaqueScaling'         : 'Zeige Plaketten immer mit voller Größe',
        'str_GeneralTweaks_actHideMouseoverTitles'          : 'Verstecke Standard-Titel bei MouseOver',
        'str_GeneralTweaks_cityHoverToBackground'           : 'Setze MouseOver-Effekt in Städten in den Hintergrund (Behebt einige Anzeigefehler)',
        'str_GeneralTweaks_islandHoverToBackground'         : 'Setze MouseOver-Effekt auf Inseln in den Hintergrund',
        // -- GeneralTweaks - fleets
        'str_GeneralTweaks_fleets'                      : 'Truppenbewegungen',
        'str_GeneralTweaks_fleetHideSpeedColumn'            : 'Verstecke Spalte für Geschwindigkeit',
        'str_GeneralTweaks_fleetHidePremiumFleetInfo'       : 'Verstecke Premium-Flotten-Info',
        'str_GeneralTweaks_fleetShowCapacities'             : 'Zeige Kapazitäten',
        'str_GeneralTweaks_fleetDontBreakLines'             : 'Zeilen nicht umbrechen (kann bei langen Namen Fehler verursachen)',
        'str_GeneralTweaks_fleetReadableFilterButtons'      : 'Aussehen der Filter-Buttons verbessern (lesbarer machen)',
        'str_GeneralTweaks_fleetHideZeroFilterButtons'      : 'Verstecke Filter-Buttons ohne Truppen/Flotten-Bewegungen',
        'str_GeneralTweaks_fleetMouseOverFleetInfo'         : 'Entferne Lupen-Icon und zeige Flotten-Info bei MouseOver',




        // -- CityListing
        'str_CityListing_name'                  : 'Verbesserte Städteliste',
        'str_CityListing_info'                  : 'Ändere die Reihenfolge der Städte oder lass Dir Luxusgüter anzeigen',
        'str_CityListing_hideCoords'            : 'Keine Koordinaten',
        'str_CityListing_showTradegoods'        : 'Zeige Luxusgüter',
        'str_CityListing_highlightSelected'     : 'Ausgewählte Stadt hervorheben',
        'str_CityListing_sortList'              : 'Eigene Reihenfolge',

        // -- ChangeAdvisors
        'str_ChangeAdvisors_name'                    : 'Individuelle Berater',
        'str_ChangeAdvisors_info'                    : 'Ändere das Aussehen einzelner Berater',
        'str_ChangeAdvisors_cities'                  : 'Städte',
        'str_ChangeAdvisors_military'                : 'Militär',
        'str_ChangeAdvisors_research'                : 'Forschung',
        'str_ChangeAdvisors_diplomacy'               : 'Diplomatie',
        'str_ChangeAdvisors_maleMayor'               : 'Bürgermeister',
        'str_ChangeAdvisors_maleMayorPremium'        : 'Bürgermeister (Premium)',
        'str_ChangeAdvisors_maleGeneral'             : 'General',
        'str_ChangeAdvisors_maleGeneralPremium'      : 'General (Premium)',
        'str_ChangeAdvisors_maleScientist'           : 'Wissenschaftler',
        'str_ChangeAdvisors_maleScientistPremium'    : 'Wissenschaftler (Premium)',
        'str_ChangeAdvisors_maleDiplomat'            : 'Diplomat',
        'str_ChangeAdvisors_maleDiplomatPremium'     : 'Diplomat (Premium)',
        'str_ChangeAdvisors_onePieceLuffy'           : 'Monkey D. Ruffy (One Piece)',
        'str_ChangeAdvisors_onePieceZoro'            : 'Lorenor Zorro (One Piece)',
        'str_ChangeAdvisors_onePieceUsopp'           : 'Lysop (One Piece)',
        'str_ChangeAdvisors_onePieceNami'            : 'Nami (One Piece)',
        'str_ChangeAdvisors_barbarianMayor'              : 'Barbaren-Bürgermeister',
        'str_ChangeAdvisors_barbarianMayorPremium'       : 'Barbaren-Bürgermeister (Premium)',
        'str_ChangeAdvisors_barbarianGeneral'            : 'Barbaren-General',
        'str_ChangeAdvisors_barbarianGeneralPremium'     : 'Barbaren-General (Premium)',
        'str_ChangeAdvisors_barbarianScientist'          : 'Barbaren-Wissenschaftler',
        'str_ChangeAdvisors_barbarianScientistPremium'   : 'Barbaren-Wissenschaftler (Premium)',
        'str_ChangeAdvisors_barbarianDiplomat'           : 'Barbaren-Diplomatin',
        'str_ChangeAdvisors_barbarianDiplomatPremium'    : 'Barbaren-Diplomatin (Premium)',
        'str_ChangeAdvisors_femaleMayor'                 : 'Bürgermeisterin',
        'str_ChangeAdvisors_femaleMayorPremium'          : 'Bürgermeisterin (Premium)',
        'str_ChangeAdvisors_femaleGeneral'               : 'Generalin',
        'str_ChangeAdvisors_femaleGeneralPremium'        : 'Generalin (Premium)',
        'str_ChangeAdvisors_femaleScientist'             : 'Wissenschaftlerin',
        'str_ChangeAdvisors_femaleScientistPremium'      : 'Wissenschaftlerin (Premium)',
        'str_ChangeAdvisors_femaleDiplomat'              : 'Diplomatin',
        'str_ChangeAdvisors_femaleDiplomatPremium'       : 'Diplomatin (Premium)',

        // -- MoveBuildings
        'str_MoveBuildings_name'                : 'Gebäude versetzen',
        'str_MoveBuildings_info'                : 'Ändere die Positionen Deiner Gebäude',
        'str_MoveBuildings_SavePositions'       : 'Positionen speichern',
        'str_MoveBuildings_DragDropHint'        : '(Ändere die Positionen der Gebäude per Drag&Drop)',
        'str_MoveBuildings_confirmSaveChanged'  : 'Geänderte Positionen speichern?',
        'str_MoveBuildings_restrictedPosition'  : 'Dieses Gebäude kann dort nicht platziert werden',

    });


})(window);
