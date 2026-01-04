// ==UserScript==
// @name         Liquipedia Group Catcher
// @version      0.7
// @author       InfSein
// @match        https://liquipedia.net/dota2/*
// @run-at       document-end
// @grant        GM_setClipboard
// @namespace    https://greasyfork.org/users/325815
// @description  抓取小组赛战绩
// @downloadURL https://update.greasyfork.org/scripts/448156/Liquipedia%20Group%20Catcher.user.js
// @updateURL https://update.greasyfork.org/scripts/448156/Liquipedia%20Group%20Catcher.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getRank(rank){
        if(rank.innerHTML == "") return "";
        let cla = rank.className;
        let num = rank.innerHTML;
        var re = `[align=center]`
        switch(cla){
            case 'bg-up': re += `[color=green]`; break;
            case 'bg-stay': re += `[color=orange]`; break;
            case 'bg-down': re += `[color=red]`; break;
            case 'bg-dq': re += `[color=gray]`; break;
            default: return num;
        }
        re += `${num}[/color][/align]`
        return re;
    }
    setTimeout(function (){
        document.getElementsByClassName('container-layout main-content-column main-content')[0].style.backgroundColor = '#F9EFD6'; // 修改背景色
        let groupNode = document.getElementById('Group_Stage');
        if (!groupNode) { groupNode = document.getElementById('Group_Stage_1'); } // DreamLeague
        if (!groupNode) { groupNode = document.getElementById('Group_Stage_2'); } // DreamLeague
        if (!groupNode) { groupNode = document.getElementById('Play-In'); } // Riyadh Master 2023
        const parent = groupNode.parentNode;
        var copyer = document.createElement('button');
        copyer.innerHTML = `<button href="javascript:void(0)" title="复制小组赛排名的NGA表格" >复制到NGA</button>`
        copyer.addEventListener('click', () => {
            const grpTables = document.getElementsByClassName('grouptable');
            var tbs = []
            for(var i=0;i<grpTables.length;i++){
                if(grpTables[i].className=='wikitable wikitable-bordered grouptable'){
                    tbs.push(grpTables[i]);
                }
            }
            const ga = tbs[0].children[0];
            const gb = tbs[1].children[0];

            var _ToggleAreaContent;
            const lent = ga.children.length;
            const sampleLine = ga.children[lent-1];
            if(sampleLine.dataset.toggleAreaContent){
                _ToggleAreaContent = sampleLine.dataset.toggleAreaContent;
            }

            var as = [], bs = [];
            for(i=1;i<ga.children.length;i++){
                const line = ga.children[i]
                if(line.dataset.toggleAreaContent){
                    if(line.dataset.toggleAreaContent != _ToggleAreaContent){
                        continue;
                    }
                }
                var t;
                try { t = line.children[1].children[0].children[2].children[0]; }
                catch { t = line.children[1].children[0].children[0].children[2].children[0]; }
                let rank = getRank(line.children[0]);
                let team = t.innerHTML;
                let bigs = line.children[2].innerHTML;
                let smas = line.children[3].innerHTML;
                let res = {rank,team,bigs,smas};
                as.push(res);
            }
            for(i=1;i<gb.children.length;i++){
                const line = gb.children[i]
                if(line.dataset.toggleAreaContent){
                    if(line.dataset.toggleAreaContent != _ToggleAreaContent){
                        continue;
                    }
                }
                try { t = line.children[1].children[0].children[2].children[0]; }
                catch { t = line.children[1].children[0].children[0].children[2].children[0]; }
                let rank = getRank(line.children[0]);
                let team = t.innerHTML;
                let bigs = line.children[2].innerHTML;
                let smas = line.children[3].innerHTML;
                let res = {rank,team,bigs,smas};
                bs.push(res);
            }

            var dt = new Date();
            var copy = `本表上次更新是在: [font=Georgia]${dt.toLocaleString()}[/font].
[table][tr][td50][align=center][color=purple][b] — Group A —[/b][/color][/align][/td][td50][align=center][color=deeppink][b] — Group B —[/b][/color][/align][/td][/tr]
[tr][td]
[table]
[tr][td][align=center][b]名次[/b][/align][/td]
[td][align=center][b]战队[/b][/align][/td]
[td][align=center][b]大分[/b][color=silver][size=60%](胜-平-负)[/size][/color][/align][/td]
[td][align=center][b]小分[/b][color=silver][size=60%](胜-负)[/size][/color][/align][/td][/tr]
`;
            for(i=0;i<as.length;i++){
                let a = as[i];
                copy += `[tr]
[td]${a.rank}[/td]
[td][align=center]${a.team}[/align][/td]
[td][align=center]${a.bigs}[/align][/td]
[td][align=center]${a.smas}[/align][/td][/tr]`
            }
            copy += `[/table]
[/td]
[td]
[table]
[tr][td][align=center][b]名次[/b][/align][/td]
[td][align=center][b]战队[/b][/align][/td]
[td][align=center][b]大分[/b][color=silver][size=60%](胜-平-负)[/size][/color][/align][/td]
[td][align=center][b]小分[/b][color=silver][size=60%](胜-负)[/size][/color][/align][/td][/tr]
`
            for(i=0;i<bs.length;i++){
                let b = bs[i];
                copy += `[tr]
[td]${b.rank}[/td]
[td][align=center]${b.team}[/align][/td]
[td][align=center]${b.bigs}[/align][/td]
[td][align=center]${b.smas}[/align][/td][/tr]`
            }
            copy += `[/table][/td][/tr][/table]`
            GM_setClipboard(copy)
            alert('复制成功')
        });
        parent.after(copyer);
    },500);
})();