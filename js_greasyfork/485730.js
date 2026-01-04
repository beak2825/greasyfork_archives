// ==UserScript==
// @name         Luogu Favorites
// @namespace    http://tampermonkey.net/
// @version      v2.6.0
// @description  Enable a unlimited favourite list
// @author       limesarine
// @match        https://www.luogu.com.cn/*
// @license      © 2024 Limesarine. All rights reserved.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485730/Luogu%20Favorites.user.js
// @updateURL https://update.greasyfork.org/scripts/485730/Luogu%20Favorites.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let Pflag=false,Fflag=false;
    if(localStorage.limesarine_favourite){}
    else
    {
        localStorage.limesarine_favourite="{}";
    }
    let tmp=JSON.parse(localStorage.limesarine_favourite);
    delete tmp.list;
    localStorage.limesarine_favourite=JSON.stringify(tmp);
    const observer=new MutationObserver(function(mutationsList,observer){
        setTimeout(function() {
            const url=document.URL;
            let Pmatches=url.match(/problem\/([A-Z][A-Za-z0-9_]+)$/);
            if(Pmatches && !Pflag)
            {
                Pflag=true;
                let title="";
                let spanElements=document.getElementsByTagName("span");
                for(let i=0;i<spanElements.length;i++)
                {
                    let spanElement=spanElements[i];
                    let titleValue=spanElement.getAttribute("title");
                    if(titleValue && titleValue!=Pmatches[1])
                    {
                        title=titleValue;
                    }
                }
                if(title.startsWith(Pmatches[1]))
                {
                    title=title.substr(Pmatches[1].length+1);
                }
                let now=JSON.parse(localStorage.limesarine_favourite)[Pmatches[1]];
                console.log(Pmatches[1],title);
                let newScript=document.createElement("script");
                newScript.innerHTML=`
function limesarine_add_to_favourite(pid,title)
{
    let dict=JSON.parse(localStorage.limesarine_favourite);
    dict[pid]=decodeURI(title);
    localStorage.limesarine_favourite=JSON.stringify(dict);
    alert('加入成功！');
    location.reload();
}
function limesarine_delete_from_favourite(pid)
{
    let dict=JSON.parse(localStorage.limesarine_favourite);
    delete dict[pid];
    localStorage.limesarine_favourite=JSON.stringify(dict);
    alert('删除成功！');
    location.reload();
}
`;
                document.head.appendChild(newScript);
                let newButton=document.createElement("button");
                newButton.setAttribute("type","button");
                newButton.setAttribute("data-v-7ade990c", "");
                newButton.setAttribute("data-v-1fbfa3c2", "");
                newButton.setAttribute("data-v-2dfcfd35", "");
                newButton.setAttribute("class","lfe-form-sz-middle");
                if(now)
                {
                    newButton.setAttribute("style","border-color: rgba(255, 255, 255, 0.5); color: rgb(255, 255, 255); background-color: rgba(0, 0, 0, 0.5);");
                    newButton.setAttribute("onclick","limesarine_delete_from_favourite('"+Pmatches[1]+"');");
                    newButton.innerHTML="移出计划";
                }
                else
                {
                    newButton.setAttribute("style","border-color: rgb(52, 152, 219); background-color: rgb(52, 152, 219);");
                    newButton.setAttribute("onclick","limesarine_add_to_favourite(\""+Pmatches[1]+"\",\""+encodeURI(title)+"\");");
                    newButton.innerHTML="加入计划";
                }
                let element=document.getElementsByClassName('lfe-form-sz-middle')[0];
                element.parentNode.insertBefore(newButton,element.nextSibling);
            }
            else if((url=="https://www.luogu.com.cn" || url=="https://www.luogu.com.cn/") && !Fflag)
            {
                Fflag=true;
                let newArticle=document.createElement("div");
                newArticle.setAttribute("class","lg-article");
                newArticle.innerHTML="<h2>做题计划</h2>";
                let newScript=document.createElement("script");
                newScript.innerHTML=`
async function limesarine_clear()
{
    localStorage.limesarine_favourite="{}";
    alert('清空成功！')
    location.reload();
}
async function limesarine_import_from_paste()
{
    let pasteid=document.getElementById('limesarine_paste_no').value;
    let reply=await fetch('/paste/'+pasteid+'?_contentOnly');
    let content=await reply.text();
    let json=await JSON.parse(content);
    localStorage.limesarine_favourite=json.currentData.paste.data;
    alert('导入成功！')
    location.reload();
}
async function limesarine_export_to_paste()
{
    let pasteid=document.getElementById('limesarine_paste_no').value;
    let response=await fetch("/paste/edit/"+pasteid, {
        headers: [
            ["content-type", "application/json"],
            ["referer", "https://www.luogu.com.cn/"],
            ["x-csrf-token", document.querySelector("meta[name=csrf-token]").content],
        ],
        body: JSON.stringify({
            data: localStorage.limesarine_favourite,
            id: pasteid,
            public: true,
            time: Math.floor(Date.now()/1000),
        }),
        method: "POST",
    });
    response=await response.text();
    alert('导出成功！');
}
`;
                document.head.appendChild(newScript);
                let savedFavourites=JSON.parse(localStorage.limesarine_favourite);
                for(let i in savedFavourites)
                {
                    newArticle.innerHTML+='<div class="tasklist-item" data-pid="'+i+'"><a class="colored" style="padding-left: 3px" href="/problem/'+i+'" target="_blank"><b>'+i+'</b> '+savedFavourites[i]+'</a></div>';
                }
                newArticle.innerHTML+=`
<p><input type="text" class="am-form-field" placeholder="云剪贴板编号" id="limesarine_paste_no"></input></p>
<p>
    <button class="am-btn am-btn-danger am-btn-sm" onclick="limesarine_import_from_paste();">导入</button>
    <button class="am-btn am-btn-primary am-btn-sm" onclick="limesarine_export_to_paste();">导出</button>
    <button class="am-btn am-btn-sm am-btn-success" onclick="limesarine_clear();">清空</button>
</p>
<div><small>我们提供从云剪贴板导入和导出到云剪贴板的功能。注意，导入操作将覆盖当前做题计划，请谨慎使用！</small></div>
`;
                let element=document.getElementsByClassName('lg-article')[3];
                element.parentNode.insertBefore(newArticle,element);
                console.log(newArticle);
            }
        }, 750);
    });
    observer.observe(document,{childList:true,subtree:true});
})();