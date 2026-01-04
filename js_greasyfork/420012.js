// ==UserScript==
// @name         AA for S1
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Modify Stage1 text property for AA
// @author       冰箱研会长
// @match        https://bbs.saraba1st.com/2b/*
// @grant GM_getValue
// @grant GM_setValue
// @require http://code.jquery.com/jquery-3.5.1.min.js
// @require https://greasyfork.org/scripts/420061-super-gm-setvalue-and-gm-getvalue-greasyfork-mirror-js/code/Super_GM_setValue_and_GM_getValue_greasyfork_mirrorjs.js?version=890160
// @downloadURL https://update.greasyfork.org/scripts/420012/AA%20for%20S1.user.js
// @updateURL https://update.greasyfork.org/scripts/420012/AA%20for%20S1.meta.js
// ==/UserScript==


var AA_author_array = GM_SuperValue.get(`AA Author`, new Array());


function getElementByXpath(path) {
    return document.evaluate(path, document, null,
        XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function Reset_BlockCode(NodeRoot) {
    var CodeBlocks = NodeRoot.getElementsByClassName("blockcode");
    if (CodeBlocks) {
        for (var i = 0; i < CodeBlocks.length; i++) {
            var CodeBlock = CodeBlocks[i];
            CodeBlock.style.fontSize = "12px";
            CodeBlock.style.lineHeight = "22px";
            CodeBlock.style.fontFamily = "Monaco, Consolas, Lucida Console, Courier New, serif";
            CodeBlock.style.whiteSpace = "normal";
        }
    }

}

function Reset_BlockQuote(NodeRoot) {
    var QuoteBlocks = NodeRoot.getElementsByClassName("blockquote");
    if (QuoteBlocks) {
        for (var i = 0; i < QuoteBlocks.length; i++) {
            var QuoteBlock = QuoteBlocks[i];
            QuoteBlock.style.fontSize = "12px";
            QuoteBlock.style.lineHeight = "22px";
            QuoteBlock.style.fontFamily = "Monaco, Consolas, Lucida Console, Courier New, serif";
            QuoteBlock.style.whiteSpace = "pre-wrap";
        }
    }

}

function Blockbutton_Appender(HtmlDiv, Post_Author, Counter) {
    HtmlDiv.innerHTML = HtmlDiv.innerHTML.concat(`
        <div><button type="button" id="enable-${Counter}">标记为AA发布者</button></div>
        <div><button type="button" id="disable-${Counter}">取消标记</button></div>
        `);

    $(`#enable-${Counter}`).click({ pa: Post_Author }, function (event) {

        if (AA_author_array.includes(event.data.pa)) {
            console.log(`AA:${event.data.pa}已经被标记了!`);
        } else {
            AA_author_array.push(event.data.pa);
            console.log(`AA:${event.data.pa}标记完成!`);
        }
        GM_SuperValue.set(`AA Author`, AA_author_array);
    });

    $(`#disable-${Counter}`).click({ pa: Post_Author }, function (event) {
        if (AA_author_array.includes(event.data.pa)) {
            AA_author_array[AA_author_array.indexOf(event.data.pa)] = ``;
            console.log(`AA:${event.data.pa}标记已取消!`);
        } else {
            console.log(`AA:${event.data.pa}未被标记!`);
        }
        GM_SuperValue.set(`AA Author`, AA_author_array);
    });


}


function AAPosts_Modifier() {
    var PostLists = getElementByXpath(`//div[@id='postlist']`);
    if (PostLists) {
        var PostCounter = 1;
        while (getElementByXpath(`//div[@id='postlist']/div[${PostCounter}]`)) {
            var PostAuthor = getElementByXpath(`//div[@id='postlist']/div[${PostCounter}]/table/tbody/tr[1]/td[1]/div/div[1]/div/a`);
            var PostAruthorColumn = getElementByXpath(`//div[@id='postlist']/div[${PostCounter}]/table[1]/tbody[1]/tr[1]/td[1]/div[1]`);
            if (PostAruthorColumn) {
                Blockbutton_Appender(PostAruthorColumn, PostAuthor.innerText,PostCounter);
            }
            if (PostAuthor) {
                if (AA_author_array.includes(PostAuthor.innerText)) {
                    var ReplyBox = getElementByXpath(`//div[@id='postlist']/div[${PostCounter}]/table/tbody/tr[1]/td[2]/div[2]/div/div[1]/table/tbody/tr/td`);
                    ReplyBox.style.fontSize = "16px";
                    ReplyBox.style.lineHeight = "18px";
                    ReplyBox.style.fontFamily = "MS PGothic";
                    ReplyBox.style.whiteSpace = "normal";
                    Reset_BlockCode(ReplyBox);
                    Reset_BlockQuote(ReplyBox);
                }
            }
            PostCounter = PostCounter + 1;
        }
    }
}


AAPosts_Modifier();
