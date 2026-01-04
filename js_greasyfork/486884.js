// ==UserScript==
// @name         自动生成Lua脚本
// @namespace    http://tampermonkey.net/
// @version      2023-12-15
// @description  nothing
// @author       ???
// @match        https://store.steampowered.com/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486884/%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90Lua%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/486884/%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90Lua%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    let paneal = document.querySelector('.game_purchase_action_bg');
    let button = document.createElement('div');
    let content = document.createElement('div');
    let span = document.createElement('span');
    button.className = 'btn_addtocart';
    content.className = 'btn_green_steamui btn_medium'
    span.textContent = '正在获取清单信息';
    span.style = 'background:linear-gradient(to right, rgb(171 176 34) 5%, rgb(138 137 27) 95%);color:rgb(239 237 169);cursor:not-allowed;'
    content.appendChild(span);
    paneal.appendChild(button);
    button.appendChild(content);

    function error() {
        span.style = 'background: linear-gradient(to right, rgb(176 34 34) 5%, rgb(138 27 27) 95%); color:#efa9a9;cursor:not-allowed;'
        span.textContent = '未找到清单信息';
    }

    const userId = 'End782';
    const repoName = 'ManifestAutoUpdate';

    function genLuaCode(keyInfo, manifests) {
        let ids = [...keyInfo.matchAll(/"(\d+)"/g)].map(e=>e[1]);
        let keys = [...keyInfo.matchAll(/"DecryptionKey" "(.+?)"/g)].map(e=>e[1]);
        let gameName = document.querySelector('.game_area_purchase_game h1').textContent.split(' ').slice(1).join(' ');
        let luaCode = `-- ${gameName}\n`;
        luaCode += `addappid(${appid})\n`
        luaCode += `-- 倒入密钥\n`
        luaCode += [...Array(ids.length).keys()].map(i=>`addappid(${ids[i]}, 0, "${keys[i]}")`).join('\n');
//         luaCode += `local keys = { ${[...Array(ids.length).keys()].map(i=>`[${ids[i]}]="${keys[i]}"`).join(',')} }\n`;
//         luaCode += `for key, value in pairs(keys)
// do
//     addappid(key, 0, value)
// end\n`;
        luaCode += '\n-- 下载清单\n'
        luaCode += manifests.map(e=>`downloadFile("https://raw.githubusercontent.com/${userId}/${repoName}/${appid}/${e}","./depotcache/${e}")`).join('\n');
//         luaCode += `for manifest in ipairs(manifests)
// do
//     downloadFile("https://raw.githubusercontent.com/${userId}/${repoName}/${appid}/"..manifest,manifest)
// end`;
        const blob = new Blob([luaCode]);
        let a = document.createElement('a');
        a.style = 'display: none';
        a.download = gameName + '.lua';
        a.href = URL.createObjectURL(blob);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    const re = /app\/(\d+)/;
    const appid = re.exec(window.location.href)[1];

    GM_xmlhttpRequest({
        url: `https://api.github.com/repos/${userId}/${repoName}/git/refs/heads/${appid}`,
        method: 'GET',
        onload: function(xhr){
            if(xhr.status !== 200){
                error();
                return;
            }
            GM_xmlhttpRequest({
                url: `https://api.github.com/repos/${userId}/${repoName}/git/trees/${JSON.parse(xhr.responseText).object.sha}?recursive=1`,
                method: 'GET',
                onload: function(xhr){
                    if(xhr.status !== 200){
                        error();
                        return;
                    }
                    let paths = JSON.parse(xhr.responseText).tree.map(e=>e.path);
                    let manifests = paths.filter(s=>s.indexOf('.manifest') > 0);
                    span.textContent = '生成Lua脚本';
                    span.style = ''
                    span.innerHTML += `<span style="font-size:0.8rem">(${manifests.length}个清单)</span>`;
                    span.onclick = () => {
                        // https://codeload.github.com/End782/ManifestAutoUpdate/zip/refs/heads/1184760
                        open(`https://codeload.github.com/${userId}/${repoName}/zip/refs/heads/${appid}`)
                        GM_xmlhttpRequest({
                            url: `https://raw.githubusercontent.com/${userId}/${repoName}/${appid}/addconfig.vdf`,
                            method: 'GET',
                            onload: function(xhr){
                            if(xhr.status !== 200)
                            {
                                GM_xmlhttpRequest({
                                    url: `https://raw.githubusercontent.com/${userId}/${repoName}/${appid}/Key.vdf`,
                                    method: 'GET',
                                    onload: function(xhr){
                                        genLuaCode(xhr.responseText, manifests);
                                    }});
                                return;
                            }
                            genLuaCode(xhr.responseText, manifests);
                        }});
                    }
                }
            });
        }
    });

})();
