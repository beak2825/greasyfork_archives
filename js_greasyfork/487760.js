// ==UserScript==
// @name         Rebekah's DF Bookmarks
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  Provides some handy bookmarks for easier outpost navigation.
// @author       Rebekah
// @match        *://fairview.deadfrontier.com/onlinezombiemmo/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deadfrontier.com
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/487760/Rebekah%27s%20DF%20Bookmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/487760/Rebekah%27s%20DF%20Bookmarks.meta.js
// ==/UserScript==

(function() {
    if(document.getElementById('sidebar'))
    {
        //#region Dictionaries
            const elementDictionary = [
                {
                    'outpost':'index.php',
                    'credit shop':'index.php?page=28',
                    'forum':'index.php?action=forum',
                    'marketplace':'index.php?page=35',
                    'vendor':'index.php?page=84',
                    'bank':'index.php?page=15',
                    'storage':'index.php?page=50',
                    'the yard':'index.php?page=24',
                    'crafting':'index.php?page=59'
                },
                {
                    'wiki':'https://deadfrontier.fandom.com/wiki/Dead_Frontier_Wiki',
                    'help':'index.php?page=53',
                    'logout':document.getElementById('outpostnavigationheaders').children[15].firstElementChild.href
                },
                [false, false, false, false, true, false, false, true, false]
            ];
        //#endregion

        //#region Globals
            let tradeZone = GM_getValue('tradeZone');
            if(unsafeWindow.userVars && unsafeWindow.userVars.df_tradezone)
            {
                tradeZone = unsafeWindow.userVars.df_tradezone;
                GM_setValue('tradeZone', tradeZone);
            };
        //#endregion

        //#region Page Modification
            //#region Constants
                const mainSelect = document.getElementById('outpostnavigationheaders');
            //#endregion
        
            //#region Definitions
                let i = 0;
                let container;
                let subContainer;
                let a;
                let button;
            //#endregion

            //#region Initial
                //mainSelect.children[0].remove();
                for(let i = (mainSelect.childNodes.length - 1); i >= 0; i--)
                {
                    mainSelect.childNodes[i].remove();  
                };
            //#endregion

            //#region Main
                mainSelect.style.backgroundColor = 'black';

                //#region Bookmark Bar
                    container = document.createElement('div');
                    container.setAttribute('style', 'display: grid; grid-template-columns: auto auto; padding: 2px');
                
                    //#region Left Side Buttons
                        subContainer = document.createElement('div');
                        subContainer.setAttribute('style', 'display: grid; grid-auto-flow: column; column-gap: 3px; justify-self: left');
                        for(let x in elementDictionary[0])
                        {
                            a = document.createElement('a');
                            tradeZone === '21' || tradeZone === '22' ? a.href = elementDictionary[0][x] : !elementDictionary[2][i] ? a.href = elementDictionary[0][x] : null;
                            button = document.createElement('button');
                            button.setAttribute('style', 'background-color: rgba(255, 255, 255, 0.15); border:2px solid rgb(100, 0, 0); padding:10px 5px !important; width:79.67px; font-size: 10px');
                            button.innerHTML = x.toUpperCase();
                            tradeZone !== '21' && tradeZone !== '22' ? button.disabled = elementDictionary[2][i] : null;
                            a.appendChild(button);
                            subContainer.appendChild(a);
                            i++;
                        };
                        container.appendChild(subContainer);
                    //#endregion
                
                    //#region Right Side Buttons
                        subContainer = document.createElement('div');
                        subContainer.setAttribute('style', 'display: grid; grid-auto-flow: column; column-gap: 3px; justify-self: right');
                        for(let x in elementDictionary[1])
                        {
                            a = document.createElement('a');
                            a.href = elementDictionary[1][x];
                            x === 'wiki' ? a.target = '_blank' : null;
                            button = document.createElement('button');
                            button.setAttribute('style', 'background-color: rgba(255, 255, 255, 0.15); border:2px solid rgb(100, 0, 0); padding:10px 5px !important; width:50.78px; font-size: 10px');
                            button.innerHTML = x.toUpperCase();
                            a.appendChild(button);
                            subContainer.appendChild(a);
                        };
                        container.appendChild(subContainer);
                    //#endregion
                
                    mainSelect.appendChild(container);
                //#endregion
            //#endregion
        //#endregion
    };
})();