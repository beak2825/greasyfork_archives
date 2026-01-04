// ==UserScript==
// @name         Steam库移除助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  快速移除Steam库中受限、正在了解和被Ban的游戏
// @author       lyzlyslyc
// @match        http*://steamcommunity.com/*/games/*
// @match        http*://help.steampowered.com/*
// @icon         https://store.steampowered.com/favicon.ico
// @resource     data https://cdn.jsdelivr.net/gh/lyzlyslyc/Scripts/SteamLimitedGames.json
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      help.steampowered.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456523/Steam%E5%BA%93%E7%A7%BB%E9%99%A4%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/456523/Steam%E5%BA%93%E7%A7%BB%E9%99%A4%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let removeList = GM_getValue("removeList");
    if(removeList===undefined)removeList={};
    if(document.domain=="help.steampowered.com"){
        let applist = [];
        let success = 0;
        let fail = 0;
        let div;
        let rows = {};
        let currentThread = 0;
        let maxThread = 5;
        let removeInterval_ms = 1000;
        let thread = null;
        initializeDiv();
        let table = document.getElementById("gameRemoveTable");
        for(let appid in removeList){
            if(removeList[appid].remove==true){
                applist.push(appid);
                rows[appid] = addGame(appid,removeList[appid].name);
            }
        }
        if(applist.length>0){
            document.getElementById("remove_gamecount").innerText=applist.length;
            div.style.display = "";
        }

        function initializeDiv(){
            div = document.createElement("div");
            div.id="gameRemoveDiv";
            div.innerHTML = `<h2 style="text-align:center; margin-bottom: 5px">检测到需要移除的游戏</h2><div style="overflow: auto;"><span>共<span id="remove_gamecount">0</span>项</span><table style="width: 100%;text-align: center;" id="gameRemoveTable"><thead><tr><th>appid</th><th>游戏名</th><th>状态</th></tr></thead><tbody></tbody></table></div><div id="btnStartRemove" class="btn_green_white_innerfade" style="margin-top: 10px;width: 100%;text-align: center;line-height: 30px;">开始移除</div>`;
            div.style.display = "none";
            document.body.append(div);
            $J('<style type="text/css">#gameRemoveDiv{padding: 10px;position: fixed;top: 20%;right: 0;background: rgb(30, 45, 64);max-height: 40%;display: flex;flex-direction: column;max-width: 30%;z-index: 999;}#gameRemoveTable,#gameRemoveTable tr th,#gameRemoveTable tr td{border:1px solid;padding: 5px;}</style>').appendTo($J("head"));
            let btnStart = document.getElementById("btnStartRemove");
            btnStart.addEventListener("click",()=>{
                if(thread!=null){
                    btnStart.innerText="开始移除";
                    clearInterval(thread);
                    thread=null;
                    return;
                }
                btnStart.innerText="停止移除";
                thread = setInterval(removeLoop,removeInterval_ms);
            })

        }

        function addGame(appid,name){
            let row = table.tBodies[0].insertRow(0);
            let appidCell=row.insertCell(0);
            let nameCell=row.insertCell(1);
            let statusCell = row.insertCell(2);
            //let deleteCell = row.insertCell(3);
            appidCell.innerText=appid;
            nameCell.innerText=name;
            statusCell.innerText="未开始";
            //deleteCell.innerText="×";
            return row;
        }

        function removeLoop(){
            while(currentThread<maxThread){
                let appid = applist.pop();
                if(appid===undefined&&thread!=null){
                    clearInterval(thread);
                    thread=null;
                    document.getElementById("btnStartRemove").innerText="移除完毕";
                    console.log("Removing stopped.");
                    return;
                }
                removeOne(appid);
            }
        }

        function removeOne(appid){
            currentThread++;
            rows[appid].style.background="#ff8c00";
            rows[appid].cells[2].innerText="请求中";
            getAjaxParams(appid).then(params=>doRemovePackage(params)).then(res=>{
                if(res.success==true){
                    rows[appid].style.background="green";
                    rows[appid].cells[2].innerText="成功";
                    delete removeList[appid];
                    GM_setValue("removeList",removeList);
                }
                else {
                    rows[appid].style.background="red";
                    rows[appid].cells[2].innerText="失败";
                    delete removeList[appid];
                    GM_setValue("removeList",removeList);
                }
            }).catch(err=>{
                console.log(err);
                rows[appid].style.background="red";
                rows[appid].cells[2].innerText=err;
            }).finally(()=>{currentThread--;})
        }
    }
    else{
        let data;
        try{
            data = JSON.parse(GM_getResourceText("data"));
        }
        catch(e){
            alert("Steam库移除助手：获取受限游戏数据失败，请刷新重试！");
            console.log(e);
        }

        //添加筛选面板
        $J(`<style type="text/css">.filtered{display:none !important}.remove_options_label{display:inline;}.remove_option_text{color:#fff}.remove_options input {vertical-align: middle;}</style>`).appendTo("head");
        $J("#gameslist_controls").after($J(`<div class="remove_options sort_options">
            <div class="remove_options_label">移除筛选</div><span>&nbsp;</span>
            <span class="remove_option_text"><input type="checkbox" id="chkShowLimited">显示受限</span><span>&nbsp;</span>
            <span class="remove_option_text"><input type="checkbox" id="chkShowLearning">显示了解中</span><span>&nbsp;</span>
            <span class="remove_option_text"><input type="checkbox" id="chkShowBanned">显示被Ban</span><span>&nbsp;</span>
            <span class="remove_option_text"><input type="checkbox" id="chkRemoveFree">选择免费</span><span>&nbsp;</span>
            <span class="remove_option_text"><input type="checkbox" id="chkRemoveCards">选择有卡</span><span>&nbsp;</span>
            <span class="remove_option_text"><input type="checkbox" id="chkRemoveAll">选择全部</span><span>&nbsp;</span>
            <span style="float:right">
                <span class="remove_option_text" style=""><input type="checkbox" id="chkShowListed">仅显示已选择</span><span>&nbsp;</span>
                <span class="remove_option_text" style="">已选择<span id="removeCount">2</span>项</span><span style="">&nbsp;</span>
                <a style="" target="_blank" href="https://help.steampowered.com/">前往客服页面移除</a>
            </span>
        </div>`));
        let chkShowLimited = document.querySelector("#chkShowLimited");
        let chkShowLearning = document.querySelector("#chkShowLearning");
        let chkShowBanned = document.querySelector("#chkShowBanned");
        let chkShowListed = document.querySelector("#chkShowListed");
        chkShowLimited.addEventListener("click",()=>handleFilterClick());
        chkShowLearning.addEventListener("click",()=>handleFilterClick());
        chkShowListed.addEventListener("click",()=>handleFilterClick());
        chkShowBanned.addEventListener("click",()=>handleFilterClick());
        //移除免费
        document.querySelector("#chkRemoveFree").addEventListener("click",(e)=>{
            document.querySelector("#games_list_row_container").style.display = "none";
            if(e.currentTarget.checked){
                document.querySelectorAll("#games_list_rows .gameListRow:not(.filtered)").forEach(row=>{
                    //如果没显示，且是勾选事件，则不显示的不会被加入列表
                    if(row.style.display=="none")return;
                    if(data.FOD[row.appid]){
                        handleRemoveButtonClick(row.btn,row.appid,row.name,true);
                    }
                })
            }
            else{
                document.querySelectorAll("#games_list_rows .gameListRow").forEach(row=>{
                    if(data.FOD[row.appid]){
                        if(row.btn.isOnList!=e.currentTarget.checked)handleRemoveButtonClick(row.btn,row.appid,row.name,false);
                    }
                });
            }
            document.querySelector("#games_list_row_container").style.display = "";
            GM_setValue("removeList",removeList);
            handleFilterClick();
            countSelectedGames();
        })
        //移除有卡
        document.querySelector("#chkRemoveCards").addEventListener("click",(e)=>{
            document.querySelector("#games_list_row_container").style.display = "none";
            if(e.currentTarget.checked){
                document.querySelectorAll("#games_list_rows .gameListRow:not(.filtered)").forEach(row=>{
                    //如果没显示，且是勾选事件，则不显示的不会被加入列表
                    if(row.style.display=="none")return;
                    if(data.cards[row.appid]){
                        handleRemoveButtonClick(row.btn,row.appid,row.name,true);
                    }
                })
            }
            else{
                document.querySelectorAll("#games_list_rows .gameListRow").forEach(row=>{
                    if(data.cards[row.appid]){
                        if(row.btn.isOnList!=e.currentTarget.checked)handleRemoveButtonClick(row.btn,row.appid,row.name,false);
                    }
                });
            }
            document.querySelector("#games_list_row_container").style.display = "";
            GM_setValue("removeList",removeList);
            handleFilterClick();
            countSelectedGames();
        })
        //移除全部
        document.querySelector("#chkRemoveAll").addEventListener("click",(e)=>{
            document.querySelector("#games_list_row_container").style.display = "none";
            if(e.currentTarget.checked){
                document.querySelectorAll("#games_list_rows .gameListRow:not(.filtered)").forEach(row=>{
                    if(row.style.display=="none")return;
                    handleRemoveButtonClick(row.btn,row.appid,row.name,true);
                })
            }
            else{
                document.querySelectorAll("#games_list_rows .gameListRow").forEach(row=>{
                    //如果列表状态和勾选状态不一致，就点击按钮
                    if(row.btn.isOnList!=e.currentTarget.checked)handleRemoveButtonClick(row.btn,row.appid,row.name,false);
                });
            }
            GM_setValue("removeList",removeList);
            document.querySelector("#games_list_row_container").style.display = "";
            handleFilterClick();
            countSelectedGames();
        })
        //添加移除按钮
        addButtons();
        //添加表格变化监视
        let observer = new MutationObserver((mutations)=>{
            console.log(mutations);
            handleFilterClick();
            countSelectedGames();
        });
        observer.observe(document.querySelector("#games_list_rows"),{attributes:true,attributeFilter: ['style'],subtree:true });
        countSelectedGames();

        function toggleText(btn){
            if(btn.isOnList)btn.innerText = "移出移除列表";
            else btn.innerText = "加入移除列表";
        }

        async function addButtons(){
            let limitedCount = 0;
            let learningCount = 0;
            let bannedCount = 0;
            let fodCount = 0;
            document.querySelector("#games_list_row_container").style.display = "none";
            document.querySelectorAll("#games_list_rows .gameListRow").forEach(row=>{
                //提取游戏appid和游戏名
                row.appid = row.id.match(/\d+/)[0];
                row.name = row.querySelector(".gameListRowItemName").innerText;
                //创建按钮
                let btn = document.createElement("a");
                btn.className = "pullup_item remove_item";
                btn.href = `javascript:void(0);`;
                btn.style = "padding:3px;";
                btn.isOnList = (removeList[row.appid]&&removeList[row.appid].remove==true);
                toggleText(btn);
                btn.addEventListener("click",()=>{handleRemoveButtonClick(btn,row.appid,row.name);GM_setValue("removeList",removeList);countSelectedGames();})
                row.querySelector(".bottom_controls").append(btn);
                row.btn=btn;

                if(data.limited[row.appid])limitedCount++;
                if(data.learning[row.appid])learningCount++;
                if(data.banned[row.appid])bannedCount++;

                let tags = $J("<span></span>");
                if(data.FOD[row.appid]){
                    tags[0].innerText+="免费 ";
                    $J(row.querySelector(".gameListRowItemName")).after(tags);
                    if(data.limited[row.appid]||data.learning[row.appid]||data.banned[row.appid])fodCount++;
                }
                if(data.cards[row.appid]){
                    tags[0].innerText+="有卡 ";
                    $J(row.querySelector(".gameListRowItemName")).after(tags);
                }
            })
            document.querySelector("#games_list_row_container").style.display = "";
            console.log(`共${limitedCount}个受限游戏，${learningCount}个正在了解游戏，${bannedCount}被Ban游戏，这些游戏中有${fodCount}个免费游戏。`);
        }

        async function handleRemoveButtonClick(btn,appid,name,isOnList){
            if(isOnList)btn.isOnList=isOnList;
            else btn.isOnList=!btn.isOnList;
            if(removeList[appid])removeList[appid].remove=btn.isOnList;
            else removeList[appid] = {name:name,remove:btn.isOnList};
            toggleText(btn,btn.isOnList);
        }

        async function handleFilterClick(){
            document.querySelector("#games_list_row_container").style.display = "none";
            document.querySelectorAll("#games_list_rows .gameListRow").forEach(row=>{
                let appid = row.id.match(/\d+/)[0];
                let name = row.querySelector(".gameListRowItemName").innerText;
                let filtered = false;
                //仅显示已选择
                if(chkShowListed.checked)filtered = !row.querySelector(".remove_item").isOnList;
                //如果都没有选择，就都不筛选
                if((!chkShowLimited.checked)&&(!chkShowLearning.checked)&&(!chkShowBanned.checked))filtered||=false;
                //如果选择至少一个，且不游戏在相应名单中，就将游戏筛选
                else filtered ||=!((chkShowLimited.checked&&data.limited[appid])||(chkShowLearning.checked&&data.learning[appid])||(chkShowBanned.checked&&data.banned[appid]));
                $J(row).toggleClass("filtered",filtered);
            });
            document.querySelector("#games_list_row_container").style.display = "";
        }

        function countSelectedGames(){
            let count = 0;
            document.querySelectorAll("#games_list_rows .gameListRow").forEach(row=>{
                if(row.btn.isOnList)count++;
            });
            document.getElementById("removeCount").innerText=count;
        }
    }

    function getAjaxParams(appid){
        return new Promise((resolve,reject)=>{
            GM_xmlhttpRequest({
                url:`https://help.steampowered.com/zh-cn/wizard/HelpWithGameIssue/?appid=${appid}&issueid=123`,
                method:"GET",
                timeout:5000,
                onload:(res)=>{
                    let text = res.responseText;
                    if(text.search("m_steamid")==-1){
                        reject("Steam客服页面未登录");
                        return;
                    }
                    let match = text.match(/g_sessionID = "([0-9a-zA-Z]+)";/);
                    if(match==null){
                        reject("未获取到Steam客服页面SessionID");
                        return;
                    }
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(text,"text/html");
                    let packageid = doc.querySelector("#packageid").value;
                    resolve({ appid:appid, packageid:packageid, sessionid: match[1], wizard_ajax: 1, gamepad: 0 });
                },
                ontimeout:()=>{reject(`获取参数超时`)},
                onerror:(err)=>{reject(`获取参数出错：`+JSON.stringify(err))}
            })
        })
    }

    function doRemovePackage(ajaxParams){
        return new Promise((resolve,reject)=>{
            $J.ajax({
                type: 'POST',
                url: 'https://help.steampowered.com/zh-cn/wizard/AjaxDoPackageRemove',
                data: `packageid=${ajaxParams.packageid}&appid=${ajaxParams.appid}&sessionid=${ajaxParams.sessionid}&wizard_ajax=1&gamepad=0`
            }).fail((xhr)=>reject(`移除出错`))
            .done((res)=>{
                resolve(res);
            })
        })
    }

})();