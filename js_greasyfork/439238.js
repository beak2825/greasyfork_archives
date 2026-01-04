
// ==UserScript==
// @name         S1 User Marker
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  Mark certain user
// @origin_author       冰箱研会长、masakahaha、wugui14
// @author Nanachi
// @match        https://bbs.saraba1st.com/2b/*
// @match        https://www.saraba1st.com/2b/*
// @grant GM_getValue
// @grant GM_setValue
// @grant        GM_deleteValue
// @grant GM_listValues
// @license GPL-V3
// @downloadURL https://update.greasyfork.org/scripts/439193/S1%20User%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/439193/S1%20User%20Marker.meta.js
// ==/UserScript==
function getElementByXpath(path) {
    return document.evaluate(path, document, null,
                             XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function Blockbutton_Appender(HtmlDiv, Block_Target, Origin_Name,PostNumber) {
    var Block_status = '';
    var status_text = GM_getValue(Origin_Name,null) ? '取消标记' : '标记此人';
    if (GM_getValue(Origin_Name,null)) {
        Block_Target.style='color:#CC241D';
        Block_Target.innerText = '#' + GM_getValue(Origin_Name);
    }
    function buttonClick(){
        console.log('test');
        console.log(Origin_Name);
        if (GM_getValue(Origin_Name,null)) {
            console.log('1');
            GM_deleteValue(Origin_Name);
            window.location.reload();
        } else {
            console.log('2');
            var tag = prompt("输入自定义标签","");
            if (tag != undefined && tag != "") {
                console.log(Origin_Name);
                //                blockedList.set(Block_Target, tag);
                GM_setValue(Origin_Name, tag);
                window.location.reload();
            }
        }
    }
    var StrPostNumber = PostNumber.toString();
    HtmlDiv.innerHTML = HtmlDiv.innerHTML.concat(`
    <table class="tfm" cellspacing="0" cellpadding="0">
    <tbody><tr>
    <td>
    <button type="button" name="blacklistsubmit_btn" id="blockbtn`,StrPostNumber,`" value="true" class="pn vm" ><em>`,status_text,`</em></button>
    </td>
    </tr>
    </tbody></table>`);
    var button1 = document.getElementById("blockbtn"+PostNumber.toString());
    //console.log(button1);
    // 在js页面获取HTML的按钮函数
    button1.onclick = buttonClick;
}

function S1_Reply_Blocker() {
    var PostLists = getElementByXpath(`//div[@id='postlist']`);
    if (PostLists) {
        var PostCounter = 1;
        while (getElementByXpath(`//div[@id='postlist']/div[${PostCounter}]`)) {
            var PostAuthor = getElementByXpath(`//div[@id='postlist']/div[${PostCounter}]/table/tbody/tr[1]/td[1]/div/div[1]/div/a`);
            var MarkPosition = getElementByXpath(`//div[@id='postlist']/div[${PostCounter}]/table/tbody/tr[1]/td[1]/div/p[1]/em/a`);
            if(PostAuthor){
                if(PostAuthor.innerText){
                    var origin_author = PostAuthor.innerText;
                }
                var PostAruthorColumn = getElementByXpath(`//div[@id='postlist']/div[${PostCounter}]/table[1]/tbody[1]/tr[1]/td[1]/div[1]`);
                if (PostAruthorColumn) {
                    Blockbutton_Appender(PostAruthorColumn, MarkPosition,origin_author,PostCounter);
                }}
            PostCounter = PostCounter + 1;
        }
    }



}

function ExportButton_Appender(nvDiv) {
    nvDiv.innerHTML= nvDiv.innerHTML.concat(`
    <button type="button" name="blacklistexport_btn" id="exportbtn" value="true" style="float: right; margin: 5px 8px 0;" class="pn vm" ><em>导出标记</em></button>
    <button type="button" name="blacklistimport_btn" id="importbtn" value="true" style="float: right; margin: 5px 8px 0;" class="pn vm" ><em>从粘贴板导入</em></button>
    `);
    function exoprt() {

        var names = GM_listValues();

        if (names) {

            var exoprtJson = {};
            for (var i = 0; i < names.length; i++) {
                exoprtJson[names[i]] = GM_getValue(names[i], null)
            }

            var exoprtValue = JSON.stringify(exoprtJson)
            console.log("导出到粘贴板：", exoprtValue)
            navigator.clipboard.writeText(exoprtValue).then(() => {
                window.confirm("本地名单列表：\n" + exoprtValue + "\n已复制到粘贴板")
            })
        }
    }
    var exportBtn = document.getElementById("exportbtn");
    // console.log(button1);
    // 在js页面获取HTML的按钮函数
    exportBtn.onclick = exoprt;

    function OnImportClick() {
        navigator.clipboard.readText().then((clipText) => {
            console.log(clipText);
            if (!clipText) {
                window.confirm("未读取到数据，请先将名单复制至粘贴板")
            }else{
                try{
                    var importedJson = JSON.parse(clipText);
                    for (var item in importedJson) {
                        var localValue = GM_getValue(item, '')
                        if (!localValue || localValue.indexOf(importedJson[item]) === -1) {
                            var ResultString = ''
                            if(!localValue){
                                ResultString += importedJson[item];
                            }else{
                                let temp_name = importedJson[item].split(":")[0];
                                if(localValue.includes(temp_name)){
                                    console.log(temp_name);
                                    let regexpre = new RegExp(temp_name+":\\d\+","g");
                                    localValue = localValue.replace(regexpre,importedJson[item]);
                                }
                                else{
                                ResultString += "/" + importedJson[item];
                                }
                            }
                            localValue += ResultString;
                            GM_setValue(item, localValue);
                            console.log('导入成功', item, localValue);
                        }
                    }
                    window.confirm('导入成功');
                }catch(e) {
                    window.confirm('导入格式不正确，按照{"用户名":"标记名",...}格式导入');
                }
            }})
    }
    var importBtn = document.getElementById("importbtn");
    // console.log(button1);
    // 在js页面获取HTML的按钮函数
    importBtn.onclick = OnImportClick;
}

function ImportButton_Appender(nvDiv) {
    nvDiv.innerHTML= nvDiv.innerHTML.concat(`
    <button type="button" name="blacklistimport_btn" id="importbtn" value="true" style="float: right; margin: 5px 8px 0;" class="pn vm" ><em>从粘贴板导入</em></button>
    `);

}
if (window.location.href.startsWith('https://bbs.saraba1st.com/2b/home.php?mod=spacecp')||window.location.href.startsWith('https://www.saraba1st.com/2b/home.php?mod=spacecp')) {
    var Qmenu = getElementByXpath(`//div[@id='nv']`);
    if (Qmenu) {
        ExportButton_Appender(Qmenu)
        // ImportButton_Appender(Qmenu)
    }
} else if (window.location.href.startsWith('https://bbs.saraba1st.com/2b/thread')||window.location.href.startsWith('https://bbs.saraba1st.com/2b/forum.php?mod=viewthread')||window.location.href.startsWith('https://www.saraba1st.com/2b/thread')||window.location.href.startsWith('https://www.saraba1st.com/2b/forum.php?mod=viewthread')) {
    S1_Reply_Blocker();
}

