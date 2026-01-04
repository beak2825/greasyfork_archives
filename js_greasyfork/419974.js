// ==UserScript==
// @name         S1 User Blocker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Block certain user's content
// @author       冰箱研会长
// @match        https://bbs.saraba1st.com/2b/*
// @grant GM_getValue
// @grant GM_setValue
// @require https://greasyfork.org/scripts/420061-super-gm-setvalue-and-gm-getvalue-greasyfork-mirror-js/code/Super_GM_setValue_and_GM_getValue_greasyfork_mirrorjs.js?version=890160
// @downloadURL https://update.greasyfork.org/scripts/419974/S1%20User%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/419974/S1%20User%20Blocker.meta.js
// ==/UserScript==

function getElementByXpath(path) {
    return document.evaluate(path, document, null,
        XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}



function Blockbutton_Appender(HtmlDiv, Block_Target, Hash_Value_P) {
    HtmlDiv.innerHTML = HtmlDiv.innerHTML.concat(`
    <form method="post" autocomplete="off" name="blackform" action="home.php?mod=spacecp&amp;ac=friend&amp;op=blacklist&amp;start=">
    <table class="tfm" cellspacing="0" cellpadding="0">
    <tbody><tr>
    <td>
    <input type="hidden" name="username" value="${Block_Target}" size="0" class="px vm">
    <button type="submit" name="blacklistsubmit_btn" id="moodsubmit_btn" value="true" class="pn vm"><em>加入黑名单</em></button>
    </td>
    </tr>
    </tbody></table>
    <input type="hidden" name="blacklistsubmit" value="true">
    <input type="hidden" name="formhash" value="${Hash_Value_P}">
    </form>`);
}

function S1_Reply_Blocker(Hash_Value) {
    var PostLists = getElementByXpath(`//div[@id='postlist']`);
    console.log(PostLists)
    if (PostLists) {
        var PostCounter = 1;
        while (getElementByXpath(`//div[@id='postlist']/div[${PostCounter}]`)) {
            var PostAuthor = getElementByXpath(`//div[@id='postlist']/div[${PostCounter}]/table/tbody/tr[1]/td[1]/div/div[1]/div/a`);
            var PostAruthorColumn = getElementByXpath(`//div[@id='postlist']/div[${PostCounter}]/table[1]/tbody[1]/tr[1]/td[1]/div[1]`);
            if (PostAruthorColumn) {
                Blockbutton_Appender(PostAruthorColumn, PostAuthor.innerText, Hash_Value);
            }
            PostCounter = PostCounter + 1;
        }
    }
}

function GetNSet_FormHash() {
    if (getElementByXpath(`//input[@name='formhash']`)) {
        GM_SuperValue.set(`formhash`, getElementByXpath(`//input[@name='formhash']`).value);
        console.log(`S1用户屏蔽脚本: HASH已经获取! ${getElementByXpath(`//input[@name='formhash']`).value}`);
    } else {
        console.log(`S1用户屏蔽脚本: 当前页面无法获取HASH!`);
    }
}





//----------------main------------
GetNSet_FormHash();
var Form_Hash = GM_SuperValue.get(`formhash`, `no hash`);
S1_Reply_Blocker(Form_Hash);



