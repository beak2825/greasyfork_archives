// ==UserScript==
// @name         Liquipedia Rank Catcher
// @version      0.3
// @author       InfSein
// @description  抓取DPC积分榜
// @match        https://liquipedia.net/dota2/Dota_Pro_Circuit/*/Rankings
// @run-at       document-end
// @grant        GM_setClipboard
// @namespace https://greasyfork.org/users/325815
// @downloadURL https://update.greasyfork.org/scripts/448155/Liquipedia%20Rank%20Catcher.user.js
// @updateURL https://update.greasyfork.org/scripts/448155/Liquipedia%20Rank%20Catcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const st = 9; // 第1名的表格阵列值
    const top = 12; // 前X名直邀TI
    var res = [];

    for(var i=0;i<top;i++){
        let a = document.getElementsByTagName('tr')[st+i].children[1].children[0].children[2].children[0].innerHTML;
        const pointElement = document.getElementsByTagName('tr')[st+i].children[2]
        const isAlreadyInvited = pointElement?.style?.backgroundColor && pointElement?.style?.backgroundColor === 'rgb(221, 244, 221)'
        let b = document.getElementsByTagName('tr')[st+i].children[2].children[0].innerHTML.replace(" ","").replace(" ","");
        if (isAlreadyInvited) { b = `[color=green]${b}[/color]`; }
        if (a == 'Gaimin Gladiators') { a = "[size=80%]Gaimin Gladiators[/size]"; }
        let r = {a,b}
        res.push(r);
    }
    setTimeout(function (){
        const parent = document.getElementsByClassName('nav nav-tabs navigation-not-searchable tabs tabs3')[0];
        var copyer = document.createElement('li');
        copyer.innerHTML = `<a href="javascript:void(0)" title="复制直邀Ti的NGA表格" >复制到NGA</a>`
        copyer.addEventListener('click', () => {
            var copy = `[table][tr]
[td1][align=center][b]第1名[/b][/align][/td][td1][align=center][b]第2名[/b][/align][/td][td1][align=center][b]第3名[/b][/align][/td][td1][align=center][b]第4名[/b][/align][/td][td1][align=center][b]第5名[/b][/align][/td][td1][align=center][b]第6名[/b][/align][/td][/tr]
[tr]`
            for(var i=0;i<6;i++){
                copy += `[td][align=center]${res[i].a}
[size=80%][font=Georgia](${res[i].b})[/font][/size][/align][/td]`
            }
            copy += `[/tr]
[tr][td1][align=center][b]第7名[/b][/align][/td][td1][align=center][b]第8名[/b][/align][/td][td1][align=center][b]第9名[/b][/align][/td][td1][align=center][b]第10名[/b][/align][/td][td1][align=center][b]第11名[/b][/align][/td][td1][align=center][b]第12名[/b][/align][/td][/tr]
[tr]`;
            for(i=6;i<12;i++){
                copy += `[td][align=center]${res[i].a}
[size=80%][font=Georgia](${res[i].b})[/font][/size][/align][/td]`
            }
            var dt = new Date();
            copy += `[/tr][/table][align=center]上次更新: ${dt.toLocaleString()}[/align]`
            GM_setClipboard(copy)
            alert('复制成功')
        });
        parent.appendChild(copyer);
    },500);
    //console.log(`Top ${top} got. They are ${res.join(',')}.`);
})();