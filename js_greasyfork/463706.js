// ==UserScript==
// @name         Sword Gale Online 切換帳號
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  優化界面
// @author       NA
// @match        https://swordgale.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=swordgale.online
// @grant        none
// @license MIT
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/463706/Sword%20Gale%20Online%20%E5%88%87%E6%8F%9B%E5%B8%B3%E8%99%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/463706/Sword%20Gale%20Online%20%E5%88%87%E6%8F%9B%E5%B8%B3%E8%99%9F.meta.js
// ==/UserScript==

(function () {
    "use strict";
    /*
      新增切換帳號(Token)
      ex: const tokenList = [
                  ["顯示名稱", "Token"],
                  ["顯示名稱2", "Token"]
              ]

      點擊資訊頭像下方名字會彈出列表, 點兩下對應帳號就可以切換帳號
    */
    const tokenList = [
                ["",""]
    ]

    setInterval ( function ()
        {
            if ( this.lastPath != location.pathname )
            {
                this.lastPath = location.pathname;
                console.log("SWITCH!："+location.pathname);
                main ();
            }
        }
        , 1000
    );


    function main()
    {
        if(location.pathname == "/profile")
        {
            ///*
            const style = document.createElement("style");
            style.innerText = `*{box-sizing:border-box}.wrapper{display:flex;align-items:center;justify-content:center;background-color:rgba(15,19,26,.8);height:100vh;position:fixed;width:100%;left:0;top:0;overflow:auto;z-index:9999}.headerS{display:flex;justify-content:space-between;margin:1rem 1rem 0 1rem}.headerS button{height:100%}.headerS h1{color:#fff}.headerS #reset-settings-btn{border:1px solid #3c3f43;margin-right:1rem}.contentS{display:flex;margin:0 1rem 1rem 1rem;flex-direction:column}.contentS hr{width:100%}.panelS{position:relative;width:100%;display:flex;flex-direction:column}.panelS input[type=checkbox]{margin:.5rem}.panelS input[type=text]{background-color:#1a1d24;background-image:none;border:1px solid #3c3f43;border-radius:6px;color:#e9ebf0;display:block;font-size:14px;line-height:1.42857143;padding:7px 11px;transition:border-color .3s ease-in-out;width:100px}.panelS+.panelS::before{border-top:1px solid #3c3f43;content:"";left:20px;position:absolute;right:20px;top:0}.panelS-header{width:100%;padding:20px}.panelS-header span{color:#fff;font-size:16px;line-height:1.25}.panelS-body{padding:0 20px 20px 20px}.panelS-body .row{margin-top:1rem;display:flex;align-items:center}.panelS-body .row label{color:#a4a9b3;margin-right:1rem}.panelS-body .row input{margin-right:1rem}.panelS-body .row a{color:#a4a9b3;margin-right:1rem;text-decoration:underline}.panelS-body .row a:hover{background-color:#3c3f43}.panelS-body .row.table{flex-direction:column;align-items:flex-start}.grid{margin-top:10px;width:100%;color:#a4a9b3;background-color:#1a1d24}.grid div{border-bottom:1px solid #292d33;width:100%;height:40px;padding:10px}.grid .grid-row{display:flex;align-items:center}.grid .grid-row:hover{background-color:#3c3f43}.grid .grid-row button{font-size:14px;border:none;background-color:rgba(0,0,0,0);color:#9146ff;margin-left:auto}.grid .grid-row button:hover{cursor:pointer}.descriptionS{margin:0px;color:#a4a9b3;line-height:1.5;font-size:8px}.dialog{width:800px;height:500px;left:0;top:0;overflow:auto;z-index:9999;background-color:#292d33;border-radius:6px;box-shadow:0 4px 4px rgba(0,0,0,.12),0 0 10px rgba(0,0,0,.06)}#open-dialog-btn{position:-webkit-sticky;position:sticky;left:0;bottom:20px;margin-right:1rem;z-index:9998;color:#7d7d7d;background-color:rgba(0,0,0,0);border:none}#open-dialog-btn:hover{color:#fff}[hidden]{display:none}#exp-bar{position:fixed;bottom:0px;width:100%;height:24px}#exp-bar-fill{position:fixed;bottom:0px;left:0px;height:24px}.exp-container{display:flex;justify-content:flex-end;position:fixed;width:100%;bottom:0px}.quick-filter-container{display:flex;margin-bottom:.5rem;align-items:center;-webkit-box-align:center}.quick-filter-container div{width:18px;height:18px;margin-right:var(--chakra-space-3);border-radius:50%;background:var(--chakra-colors-transparent);border-width:2px;border-style:solid;-o-border-image:initial;border-image:initial;cursor:pointer}.quick-filter-container .circle-red{border-color:var(--chakra-colors-red-500)}.quick-filter-container .circle-red:hover{background-color:var(--chakra-colors-red-300)}.quick-filter-container .circle-blue{border-color:var(--chakra-colors-blue-500)}.quick-filter-container .circle-blue:hover{background-color:var(--chakra-colors-blue-300)}.quick-filter-container .circle-cyan{border-color:var(--chakra-colors-cyan-500)}.quick-filter-container .circle-cyan:hover{background-color:var(--chakra-colors-cyan-300)}.quick-filter-container .circle-green{border-color:var(--chakra-colors-green-500)}.quick-filter-container .circle-green:hover{background-color:var(--chakra-colors-green-300)}.quick-filter-container .circle-teal{border-color:var(--chakra-colors-teal-500)}.quick-filter-container .circle-teal:hover{background-color:var(--chakra-colors-teal-300)}.quick-filter-container .circle-orange{border-color:var(--chakra-colors-orange-500)}.quick-filter-container .circle-orange:hover{background-color:var(--chakra-colors-orange-300)}.quick-filter-container .circle-yellow{border-color:var(--chakra-colors-yellow-500)}.quick-filter-container .circle-yellow:hover{background-color:var(--chakra-colors-yellow-300)}.quick-filter-container .circle-pink{border-color:var(--chakra-colors-pink-500)}.quick-filter-container .circle-pink:hover{background-color:var(--chakra-colors-pink-300)}.quick-filter-container .circle-purple{border-color:var(--chakra-colors-purple-500)}.quick-filter-container .circle-purple:hover{background-color:var(--chakra-colors-purple-300)}.quick-filter-container .circle-gray{border-color:var(--chakra-colors-gray-500)}.quick-filter-container .circle-gray:hover{background-color:var(--chakra-colors-gray-300)}`;
            document.body.appendChild(style);
            //*/
            idToLink();
        }
        else
        {
            // 不是的地方就滾
            return;
        }

        function idToLink(){
            const characterContainer = document.querySelectorAll(".css-smqg7t")[0];
            characterContainer.innerHTML = "<a href='#'>" + characterContainer.innerHTML + "</a>";
            characterContainer.removeEventListener("clicked", showSwitchAccount);
            characterContainer.onclick = () => {showSwitchAccount();}
            //console.log(characterContainer);
        }
        function showSwitchAccount(){

            const wrapper = document.createElement("div");
            wrapper.className = "wrapper";
            wrapper.style.display = "";
            wrapper.innerHTML = ` <div class="dialog">
                <div class="headerS">
                    <h1>切換帳號</h1>
                    <div>
                        <button id="close-dialog-btn">X</button>
                    </div>
                </div>
                <div class="contentS">
                </div>
                </div>`
            const panel = [
                {
                    category: "",
                    description: "點擊切換帳號",
                    rows:[
                        {
                            id: "watch-list",
                            type: "table",
                            label: "帳號列表",
                            header: "名字"
                        }
                    ]
                }
            ]
            function createRow(rowDiv, rowData){
                const type = {
                    table: () => {
                        const tableData = tokenList;
                        let gridRowHTML = "";
                        if(!tableData.length){
                            return;
                        }else{
                            tableData.forEach(arr => {
                                if(arr[1] == ""){
                                    return
                                }
                                const div = document.createElement("div");
                                div.innerHTML = `
                                        <label data-token="${arr[1]}" style="user-select: none;">${arr[0]}</label>
                                    `
                                div.className = "grid-row"

                                gridRowHTML += div.outerHTML;
                            });
                        }
                        rowDiv.innerHTML =  `
                                <label style="user-select: none;">${rowData.label}</label>
                                <div class="grid" id="${rowData.id}">
                                    <div class="grid-row-header" style="user-select: none;">${rowData.header}</div>
                                    ${gridRowHTML}
                                </div>`
                    }
                }
                type[rowData.type]();
            }
            const content = wrapper.querySelector(".contentS");
            panel.forEach(panel => {

                const panelDiv = document.createElement("div");
                panelDiv.className = "panelS";
                panelDiv.innerHTML = `
                        <div class="panel-header">
                            <span>${panel.category}</span>
                        </div>
                        <div class="panel-body">
                            <p class="descriptionS">${panel.description}</p>
                        </div>
                    `
                const panelBody = panelDiv.querySelector(".panel-body");
                panel.rows.forEach(row => {
                    const rowDiv = document.createElement("div");
                    rowDiv.className = row.type === "table" ? "row table" : "row";
                    createRow(rowDiv, row);
                    panelBody.appendChild(rowDiv);
                });
                content.appendChild(panelDiv);
            });
            document.body.appendChild(wrapper);
            document.querySelector("#close-dialog-btn").onclick = () => {document.querySelector(".wrapper").remove()}
            document.querySelectorAll(".grid-row").forEach(row => {
                row.onclick = (e) => {
                    let accountLabel = e.target;
                    if(e.target.tagName.toLowerCase() != "label"){
                        accountLabel = accountLabel.querySelector('label');
                    }
                    const token = accountLabel.getAttribute("data-token");
                    if(parseJwt(token)){
                        localStorage.token = token;
                        location.reload();
                    }
                    else{
                        alert("token可能錯誤!!");
                    }
                }
            });
        }

        function parseJwt (token) {
            try{
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                return JSON.parse(jsonPayload);
            }
            catch(e){
                return null;
            }
        }
    }
})();
