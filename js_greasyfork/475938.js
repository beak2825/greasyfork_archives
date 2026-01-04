// ==UserScript==
// @name         OCIC encrypto
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  ocic加解密
// @author       Yao.Wu
// @match        https://*/*
// @icon         https://avatars.githubusercontent.com/u/15844103?v=4
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475938/OCIC%20encrypto.user.js
// @updateURL https://update.greasyfork.org/scripts/475938/OCIC%20encrypto.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    let url = "https://k6it7pwn.fn-boe.bytedance.net";// 内网boe
    // ControlKey: Windows-Ctrl, Mac-Command
    // action 0 Alt + , 线上加密
    //        1 Alt + . 线上解密
    //        2 Alt + Shift + , boe解密
    //        3 Alt + Shift + . boe解密
    var enKey = 188, deKey = 190;
    var getAction = (event) => {
        var res = -1;
        if (!event.altKey || (event.keyCode != enKey && event.keyCode != deKey)) return res;
        res = (event.keyCode == enKey ? 0 : 1) + (event.shiftKey ? 2 : 0);
        return res;
    }
 
    var process = async (action, text) => {
        try {
            // 解密的时候需要第一个字符是@
            if (action % 2 == 1) {
                text = text.map(it=> it.startsWith('@') ? it.substring(1): '@' )
            }
            var res = await fetch(url,{ headers:{'content-type': "application/json"},method:"POST",body:JSON.stringify({action, text})});
            var { code, data } = await res.json();
            if (code == 200) {
                // 加密的时候返回的第一个字符是@
                if (action % 2 == 0) {
                    data.forEach(it=> { if (!it.target.startsWith("=")) it.target = '@' + it.target })
                } else {
                    data.forEach(it=> { if (!it.source.startsWith("@")) it.source = '@' + it.source } )
                }
                return data
            }
        } catch(e) {
            return "------error------";
        }
    }
 
    document.addEventListener('keydown', async function(event) {
        var action = getAction(event);
        var text = document.getSelection().toString().trim();
 
        if (text && text.length >0 && action >= 0) {
            event.preventDefault();
        } else {
            return;
        }
        text = text.split('\n').map(item=>item.replace(/[\u200B-\u200D\uFEFF]/g, '').trim());
        var data = await process(action, text);
        showDialog(data);
    });
 
    // dialog标签展示下内容，方便复制和查看
    var dialog = document.createElement('dialog');
    document.body.appendChild(dialog);
    dialog.style.padding = '0';
    dialog.style.margin = 'auto';
    dialog.style['font-weight'] = '600';
 
    document.addEventListener('click', function(event) {
        if (event.target == dialog){
            dialog.close();
        }
    });
 
    var showDialog = (data) => {
        if (!(data instanceof Array)) return;
        dialog.innerHTML = `
        <div style="padding: 1rem">
            <table style="">
                <thead><tr style="border: solid 1px steelblue;padding: 5px; user-select: none;"><th class="_ocic_td0">原文</th>
                <th>处理后 &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="radio" name="_ocic_model" id="r2" value="2"/>
                    <label for="r2">隐藏原文</label>
                    <input type="radio" name="_ocic_model" checked='true' id="r3" value="3"/>
                    <label for="r3">全部可选</label>
                </th></tr></thead>
                <tbody>${
                    data.map((d,i)=>`<tr style="background: ${i%2==0 ? 'aliceblue' : 'bisque'};"><td class="_ocic_td0" style="border: solid 1px steelblue;padding: 5px;">${d.source}</td><td  style="border: solid 1px steelblue;padding: 5px;">${d.target}</td></tr>`).join(' ')
                }</tbody>
            </table>
        </div>
        `
        dialog.showModal();
        // 选择模式切换用的
        var _ocic_arr = document.getElementsByName('_ocic_model');
        var _onc = () => {
            var tds = document.querySelectorAll('._ocic_td0');
            document.querySelectorAll('._ocic_td0').forEach(it=>{
                // 隐藏原文，则0列display为none
                it.style.display = _ocic_arr[0].checked ? 'none' : 'block';
            })
        }
        _ocic_arr[0].onchange = _onc;
        _ocic_arr[1].onchange = _onc;
    };
})();