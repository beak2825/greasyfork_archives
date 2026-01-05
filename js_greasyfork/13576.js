// ==UserScript==
// @name         TucaoJump
// @namespace    http://your.homepage/
// @version      0.2
// @description  吐槽网404自动跳转
// @author       lyris
// @match        *://www.tucao.tv/play/h*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13576/TucaoJump.user.js
// @updateURL https://update.greasyfork.org/scripts/13576/TucaoJump.meta.js
// ==/UserScript==
(
    function () 
    {
        function jump()
        {
            var path=document.location.pathname;
            var id=path.match("[0-9]{1,}");
            window.location.href="http://www.tucao.tv/mini/"+id+".swf";
        }
        function find()
        {
            var isExit=document.getElementById("part_lists");
            if(isExit==null)
            {
                jump();
            }
        }
        find();
    }
)();