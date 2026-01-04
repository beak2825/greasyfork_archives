// ==UserScript==
// @name         WoD Jumpbox Enhanced
// @namespace    github.com/DotIN13
// @version      0.6
// @description  Easier jumpbox search
// @author       DotIN13
// @match        http://*.world-of-dungeons.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398732/WoD%20Jumpbox%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/398732/WoD%20Jumpbox%20Enhanced.meta.js
// ==/UserScript==

(function()
 {
    'use strict';

    //get jumpboxSpan
    var jumpboxSpan = document.getElementById("jumpbox_center");

    if (jumpboxSpan){
        var addItemList = function()
        {
            var itemList = ["item", "set", "hero", "player", "skill", "npc", "post", "group", "clan", "auction", "class"],
                itemChn = ["物品", "套装", "角色", "玩家", "技能", "NPC", "帖子", "团队", "联盟", "拍卖", "职业"];
            for (var i = 0; i < itemList.length; i++)
            {
                var option = document.createElement("option");
                option.value = (itemList[i]);
                option.text = (itemChn[i]);
                jumpboxSelObj.add(option);
            }
        }

        window.jumper = function()
        {
            var jumpbox = document.querySelector('#jumpbox_center>form>input[name="link"]');
            var jumpboxValue = jumpbox.value;
            var regtest = /^\s*\[\s*([^:]+?)\s*:\s*(.+?)\s*\]\s*$/;
            var indicator = regtest.test(jumpboxValue);
            if (indicator)
            {
                wodlink(jumpboxValue);
            }
            else
            {
                var jumplink = "[" + jumpboxSelObj.value + ":" + jumpboxValue + "]";
                wodlink(jumplink);
            }
            jumpbox.value = "";
        }

        //edit tooltip
        document.querySelector('#jumpbox_center>form>span').setAttribute("onmouseover","return wodToolTip(this,'输入代码或名称，选择相应类型<br>然后点按搜索，查询详情<br>输入[*:*]时，自动无视类型选择<br><br>Jumpbox Enhanced By DotIN13');");

        //create jumpboxSelect
        var jumpboxSelect = document.createElement("select");
        jumpboxSelect.id = "jumpboxSelect";
        jumpboxSelect.style = "width: 62px;margin-left: 25px;padding: 1px;margin-top: 1px;"
        jumpboxSpan.parentElement.appendChild(jumpboxSelect);

        //add select options
        var jumpboxSelObj = document.getElementById("jumpboxSelect");

        addItemList();

        //reroute jumpbox Button
        var jumpboxBtn = document.querySelectorAll("#jumpbox_center>form>span>input");
        var jumpbox = document.querySelector('#jumpbox_center>form>input[name="link"]');
        jumpboxBtn[0].setAttribute("onclick", "window.jumper();return false;");
    }

})();
