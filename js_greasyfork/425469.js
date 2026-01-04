// ==UserScript==
// @name         MyKirito Reincarnation PlugIn
// @namespace    https://github.com/JCxYIS/mykirito-reincarination-plugin
// @version      1.0
// @description  霸權轉生點：不要再按到手軟
// @author       JCxYIS
// @match        https://mykirito.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425469/MyKirito%20Reincarnation%20PlugIn.user.js
// @updateURL https://update.greasyfork.org/scripts/425469/MyKirito%20Reincarnation%20PlugIn.meta.js
// ==/UserScript==

(function()
{
    'use strict';


    // 參數
    const FUNC_NAME_LIST = ["+", "-"];
    const TIMES_LIST = [10, 100]
    let lastPath = ""

    // 進入點
    setInterval ( function ()
        {
            if ( lastPath != location.pathname )
            {
                lastPath = location.pathname;
                main ();
            }
        }
        , 1000
    );



    // 主函式
    function main()
    {
        if(location.pathname != "/reincarnation")
        {
            return;
        }

        console.log("insert reincar")

        // 綁按紐
        let allbuttons = Array.from( document.getElementsByTagName('button') );
        for(let i = 0; i < allbuttons.length && i < 50; i++)
        {
            for(let j = 0; j < FUNC_NAME_LIST.length; j++)
            {
                if(allbuttons[i].innerText === FUNC_NAME_LIST[j] && allbuttons[i].offsetParent !== null) /*.parentElement.style.display != "none"*/
                {

                    // 綁次數
                    for(let k = 0; k < TIMES_LIST.length; k++)
                    {
                        let newButt = allbuttons[i].cloneNode(true);
                        newButt.innerHTML += TIMES_LIST[k];

                        // func
                        newButt.onclick = ()=>
                        {
                            let t = TIMES_LIST[k];
                            function doclick()
                            {
                                // console.log(t);
                                t--;
                                allbuttons[i].click();
                                if(t > 0)
                                    setTimeout(() => {doclick()}, 0);
                            }
                            doclick();
                        };

                        // insert
                        let p = allbuttons[i].parentNode
                        if(allbuttons[i].innerHTML === "-")
                            p.insertBefore(newButt, allbuttons[i].parentNode.firstChild);
                        else
                            p.appendChild(newButt);
                        // console.log(k+" Binded "+newButt.innerHTML);
                    }
                }
            }
        }
    }

})();
