// ==UserScript==
// @name         addScriptsMenu
// @namespace    https://greasyfork.org/fr/users/4324-sebiseba
// @version      2024.01.28
// @description  Add a "Scripts" section in the WME menu
// @author       Sebiseba
// @include      https://beta.waze.com/*editor*
// @include      https://www.waze.com/*editor*
// @exclude      https://www.waze.com/*user/editor/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==
 
/* global $ */
/* jshint esversion:6 */

(function addScriptsMenu() {
        if (typeof getElementsByClassName('collapsible-GROUP_SCRIPTS', getId('layer-switcher-region')) [0] != 'object') {
            var menuParent = getElementsByClassName('togglers', getId('layer-switcher-region')) [0];

            var scriptMenu = document.createElement('li');
            scriptMenu.className="group";

            var scriptMenuContent = document.createElement('div');
            scriptMenuContent.className='layer-switcher-toggler-tree-category';
            scriptMenuContent.innerHTML='<wz-button id="developScript" color="clear-icon" size="xs"><i class="toggle-category w-icon w-icon-caret-down"></i></wz-button>'+
                '<wz-toggle-switch disabled="false" checked id="layer-switcher-group_scripts_" class="layer-switcher-group_scripts_" tabindex="0" name="" value=""></wz-toggle-switch>'+
                '<label class="label-text" for="layer-switcher-group_scripts_">Scripts</label>';
            scriptMenu.appendChild(scriptMenuContent);

            var groupScripts = document.createElement('ul');
            groupScripts.className="collapsible-GROUP_SCRIPTS";
            scriptMenu.appendChild(groupScripts);

            menuParent.insertBefore(scriptMenu, menuParent.firstChild);

            getId('developScript').addEventListener('click', function(e) {
                if (groupScripts.className == 'collapsible-GROUP_SCRIPTS') {
                    groupScripts.className='collapsible-GROUP_SCRIPTS collapse-layer-switcher-group';
                    this.innerHTML='<i class="toggle-category w-icon w-icon-caret-down upside-down"></i>';
                } else {
                    groupScripts.className='collapsible-GROUP_SCRIPTS';
                    this.innerHTML='<i class="toggle-category w-icon w-icon-caret-down"></i>';
                }
            });
            getId('layer-switcher-group_scripts_').addEventListener('click', function(e) {
                if (groupScripts.className == 'collapsible-GROUP_SCRIPTS') {
                    groupScripts.className='collapsible-GROUP_SCRIPTS collapse-layer-switcher-group';
                    getId('developScript').innerHTML='<i class="toggle-category w-icon w-icon-caret-down upside-down"></i>';
                } else {
                    groupScripts.className='collapsible-GROUP_SCRIPTS';
                    getId('developScript').innerHTML='<i class="toggle-category w-icon w-icon-caret-down"></i>';
                }
            });
        }
    }
)