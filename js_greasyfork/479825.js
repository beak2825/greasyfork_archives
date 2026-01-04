// ==UserScript==
// @name         Idle Infinity - ShowNavBarCharacters
// @namespace
// @version      1.0
// @description  Idle Infinity
// @author       小黄不会擦屁股
// @license      MIT
// @grant        GM_addStyle
// @match        https://www.idleinfinity.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idleinfinity.cn
// @namespace https://greasyfork.org/users/1202891
// @downloadURL https://update.greasyfork.org/scripts/479825/Idle%20Infinity%20-%20ShowNavBarCharacters.user.js
// @updateURL https://update.greasyfork.org/scripts/479825/Idle%20Infinity%20-%20ShowNavBarCharacters.meta.js
// ==/UserScript==
$(document).ready(function(){
    if($(".dropdown-menu.char-switch .base").length!=0)
    {
        addCharactPanel($(".dropdown-menu.char-switch .base"));
        $(".dropdown-menu.char-switch .base").closest("li.dropdown").hide();
        console.log($(".dropdown-menu.char-switch .base").closest("li.dropdown"))
    }

});

function addCharactPanel(characts) {
    var charactContainers = '';
    for (var i = 0; i < characts.length; i++) {
        charactContainers += `<div class="col-xs-2 col-sm-2 col-md-2 skill-container">${characts[i].outerHTML}</div>`;
    }

    // 动态生成完整的 HTML 代码
    var configNode = createElementByHTML(`
    <div class="col-md-12">
        <div class="panel panel-inverse">
            <div class="panel-body charact-container">
                ${charactContainers}
            </div>
        </div>
    </div>
`);

    document.querySelector(".container > .row").prepend(configNode)
    for (const node of configNode.querySelectorAll("input")) {
        node.addEventListener('change', (event) => {
            const node = event.target
            console.log(`on change ${node.name}`)
            configStore.tips[node.name] = node.checked
            configStore.save()
        })
    }
    console.log("success");
    $(".btn.btn-xs.btn-default").click(function() {
        localStorage.removeItem("AutomaticDungeon");
        console.log('重置计数');
    });
}

function createElementByHTML(html) {
    const template = document.createElement('template')
    template.innerHTML = html.trim()
    return template.content.firstChild
}