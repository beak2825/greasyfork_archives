// ==UserScript==
// @name         Tab sites in alwaysdata
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       Justin Martin <ToolPad>
// @match        https://admin.alwaysdata.com/site/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/418507/Tab%20sites%20in%20alwaysdata.user.js
// @updateURL https://update.greasyfork.org/scripts/418507/Tab%20sites%20in%20alwaysdata.meta.js
// ==/UserScript==

const cssContent = `.custom-multi-sites-tab {
  display: none;
}

.custom-multi-sites-tab.active {
  display: block;
}

.custom-multi-sites-nav-tab {
  display: inline-block;
  padding: 20px;
}

.custom-multi-sites-nav{
    margin-bottom: 1rem;
}

.custom-multi-sites-nav-tab.active {
  text-decoration: none;
  border-bottom: 0.2em solid #e85693;
}`
const navHTML = `<div class="custom-multi-sites-nav"></div>`;
const navItemHTML = `<a href="#" data-tab="{site_name}-custom-tab" class="custom-multi-sites-nav-tab{b-nav-active}">{site_name}</a>`
const tabItem = `<div class="table-block table-block-alt custom-multi-sites-tab{b-tab-active}" id="{site_name}-custom-tab">
  <table class="table table-striped">
    <thead>
        <tr>
            <th style="width:10%">#</th>
            <th style="width:20%">Nom</th>
            <th style="width:40%">Adresses</th>
            <th style="width:15%">Type</th>
            <th class="action" style="width:5%">Redémarrer</th>
            <th class="action" style="width:5%">Modifier</th>
            <th class="action" style="width:5%">Supprimer</th>
        </tr>
    </thead>
    <tbody>
        {table_content}
    </tbody>
  </table>
</div>`

function TabsNav(sitesList) {
    var bindAll = function() {
        var menuElements = document.querySelectorAll('[data-tab]');
        for(var i = 0; i < menuElements.length ; i++) {
            menuElements[i].addEventListener('click', change, false);
        }
    }

    var clear = function() {
        var menuElements = document.querySelectorAll('[data-tab]');
        for(var i = 0; i < menuElements.length ; i++) {
            menuElements[i].classList.remove('active');
            var id = menuElements[i].getAttribute('data-tab');
            document.getElementById(id).classList.remove('active');
        }
    }

    var change = function(e) {
        clear();
        e.target.classList.add('active');
        var id = e.currentTarget.getAttribute('data-tab');
        document.getElementById(id).classList.add('active');
    }

    document.querySelector("#content > div.block.header.well.clearfix").insertAdjacentHTML("afterend", navHTML);
    let rootNavHTMLContent = ""

    for(let site_name in sitesList){
        let navItemHTML_replaced = navItemHTML.replaceAll("{site_name}", site_name).replace("{b-nav-active}", rootNavHTMLContent !== "" ? "" : " active");
        rootNavHTMLContent += navItemHTML_replaced
    }
    document.getElementsByClassName("custom-multi-sites-nav")[0].innerHTML = rootNavHTMLContent;
    bindAll()
};

function TabsContent(sitesList){
    var clear = function(){
        document.querySelector("#content > div.table-block.table-block-alt").remove()
    }
    var createTab = function(site_name, isActive){
        let tabItem_replaced = tabItem.replace("{site_name}", site_name).replace("{b-tab-active}", isActive ? "" : " active");
        return tabItem_replaced.replace("{table_content}", createTable(site_name));
    }
    var createTable = function(site_name){
        let tableContent = "";
        sitesList[site_name].forEach((tableLine)=>{
            tableContent += tableLine.outerHTML.replace(`[${site_name}]`, "")
        });
        return tableContent;
    }

    clear()
    let rootElementHTMLContent = ""

    for(let site_name in sitesList){
        rootElementHTMLContent += createTab(site_name, rootElementHTMLContent !== "");
    }
    document.getElementById("content").insertAdjacentHTML("beforeend", rootElementHTMLContent);
}

GM_addStyle(cssContent);

let sitesList = [];
let htmlTabList = [];

let promiseArray = []
// Reading data
if(document.getElementsByClassName("pagination").length > 0){
    document.querySelectorAll(".pagination > li:not(.active):not(:last-child) > a").forEach((aNode)=>{
        const param_page = aNode.getAttribute("href");
        const url_page = `${location.protocol}//${location.host}${location.pathname}/${param_page}`;
        let promise = fetch(url_page).then(data=>data.text()).then((htlm)=>{
                var documentOtherPage = new DOMParser().parseFromString(htlm, "text/html");
                const trsOtherPage = documentOtherPage.querySelectorAll('tbody tr');
                trsOtherPage.forEach((currentValue, currentIndex, listObj)=>{
                    document.querySelector("tbody").appendChild(currentValue)
                });
            })
        promiseArray.push(promise)
    })
    document.getElementsByClassName("pagination")[0].remove()
}

Promise.all(promiseArray).then(()=>{
    var trs = document.querySelectorAll('tbody tr');
    trs.forEach((currentValue, currentIndex, listObj)=>{
        let siteTd = currentValue.getElementsByTagName("td");
        const name = siteTd[1].innerText
        const siteTag = name.match(/\[(.*)\]/).pop();

        if(!sitesList.hasOwnProperty(siteTag))
            sitesList[siteTag] = [];

        sitesList[siteTag].push(currentValue)
    });
    var tabsContent = new TabsContent(sitesList);
    var tabsNav = new TabsNav(sitesList);
})