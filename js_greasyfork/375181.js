// ==UserScript==
// @name         Elite chat
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add discord elite chat to game
// @author       Zimek
// @match        *://*.alis.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375181/Elite%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/375181/Elite%20chat.meta.js
// ==/UserScript==

//Chat in game
$(`
<div id="elitechat" style="float:right;margin-right: 200px;display: none;">
<iframe src="https://titanembeds.com/embed/403788350609424386" height="600" width="800" frameborder="0"></iframe>
</div>
`).insertBefore("#chatroom");

// Button under leaderboard to open chat
$(`
<div id="elitechatbutton_div">
<button id="elitechatbtn"><img id="openelitechat" src="https://i.imgur.com/QDg0u4u.png" width="35px"><img id="closeelitechat" src="https://i.imgur.com/AC8FSoh.png" width="35px" style="display: none;"></button>
</div>
`).insertBefore("#chatroom");


// Styling
$(`<style>
#elitechatbtn{background: white;border: 0px solid white;float: right;margin-right: 1px;}
#elitechatbtn:hover{border: 1px solid #63fff7;}
#elitechatbutton_div{margin-right: 250px;margin-top: 5px;}


</style>`).appendTo('head');

$(document).ready(function(){
    $("#elitechatbtn").click(function(){
        $("#elitechat").toggle();
        $("#closeelitechat").toggle();
    });
    $("#elitechatbtn").click(function(){
        $("#openelitechat").toggle();
    });
});