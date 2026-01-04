// ==UserScript==
// @name         Melvor Idle - TODO list
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Adds a Local TODO list to the top right of the header bar.
// @author       Jessy#3869
// @match        https://*.melvoridle.com/*
// @exclude      https://wiki.melvoridle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=melvoridle.com
// @noframes
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/449677/Melvor%20Idle%20-%20TODO%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/449677/Melvor%20Idle%20-%20TODO%20list.meta.js
// ==/UserScript==

((main) => {
    var script = document.createElement('script');
    script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {
    'use strict';

    function loadTODO() {
        let css = `.todo-outer{display:flex;flex-direction:column;box-sizing:border-box}.todo-outer .dropdown-header > h1{color:#fefefe !important}.todo-input-container{width:95%;margin:auto auto 0.25rem}input.todo-input{margin:0;border:none;border-radius:3px 0 0 3px;width:75%;padding:10px;float:left;font-size:16px;background:#343c4a;color:#f5f5f5}.todo-new-btn{padding:10px;width:25%;background:#5cace5;color:#fff;float:left;text-align:center;font-size:16px;cursor:pointer;transition:0.3s;border-radius:0 3px 3px 0;border:none}.todo-new-btn:hover{background:#3b9be0}#todo{max-height:280px;padding:0;margin:0;overflow:scroll;border-radius:0 !important;flex-basis:auto !important}#todo .todo-item{cursor:pointer;position:relative;padding:8px 40px;background-color:#eee;font-size:16px;transition:0.1s;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}#todo .todo-item:nth-child(odd){background:#f9f9f9}#todo .todo-item:hover{background:#ddd}#todo .todo-item .todo-close{position:absolute;right:0;top:0;padding:8px 16px}#todo .todo-item .todo-close:hover{background:#f44336;color:white}#todo .todo-checked{background:#888 !important;color:#fff;text-decoration:line-through}#todo .todo-checked:before{content:"";position:absolute;border-color:#30c78d;border-style:solid;border-width:0 2px 2px 0;top:10px;left:16px;transform:rotate(45deg);height:15px;width:7px}`;
        let html = `<div class="d-inline-block dropdown ml-2"><button class="btn btn-dual btn-sm text-combat-smoke"aria-expanded=false aria-haspopup=true data-toggle=dropdown id=page-header-todo-dropdown type=button><svg height=18 id=eDLHqju2Xkb1 shape-rendering=geometricPrecision text-rendering=geometricPrecision viewBox="0 0 18 18"width=18 xmlns=http://www.w3.org/2000/svg xmlns:xlink=http://www.w3.org/1999/xlink><path d=M3.0041,5.348518c.668323,1.285235,1.278182,1.36164,1.572197,1.419592.878575,0,2.72894-2.113903,3.452636-2.959411 fill=none stroke=#eaeaea transform="matrix(1.26709 0 0 1.182627-2.283452 2.515579)"/><path d=M3.0041,5.348518c.668323,1.285235,1.278182,1.36164,1.572197,1.419592.878575,0,2.72894-2.113903,3.452636-2.959411 fill=none stroke=#eaeaea transform="matrix(1.26709 0 0 1.182627-2.283452-3.043489)"/><path d=""fill=none stroke=#3f5787 stroke-width=0.5 /><rect fill=#eaeaea height=1.865046 rx=0.5 ry=0.5 stroke-width=0 transform="translate(9.456201 2.278198)"width=8.061312 /><rect fill=#eaeaea height=1.865046 rx=0.5 ry=0.5 stroke-width=0 transform="translate(9.4562 7.837266)"width=8.061312 /><rect fill=#eaeaea height=1.865046 rx=0.5 ry=0.5 stroke-width=0 transform="translate(9.4562 13.428373)"width=8.061312 /><ellipse fill=#eaeaea rx=1.25 ry=1.235 stroke-width=1.5 transform="matrix(1.375561 0 0 1.269321 4.706471 14.360896)"/></svg></button><style>${css}</style><div class="border-0 dropdown-menu dropdown-menu-lg dropdown-menu-right font-size-sm p-0"id=header-todo-dropdown aria-labelledby=page-header-todo-dropdown><div class=todo-outer><div class="dropdown-header p-2 text-center"><h1 class="mb-2 mt-2">Todo List</h1></div><div class="mb-2 todo-input-container"><input class=todo-input id=todo-new-in placeholder="New Todo..."> <button class="btn btn-info todo-new-btn">Add</button></div><div id="todo" class="list-group col"></div></div></div></div>`;

        // Adds the todo dropdown to the header
        $("#header-theme > .align-items-right > div:first").before(html);

        new Sortable(todo, {
            ghostClass: 'blue-background-class'
        });

        // adds new todo item to UL
        $(".todo-new-btn").click(() => {
            let text = $("#todo-new-in").val();
            if (text === "") {
                Toastify({
                    text: '<div class="text-center"><span class="badge badge-danger">[Todo List] You must enter text before adding a new todo!</span></div>',
                    duration: 2000,
                    gravity: 'top',
                    position: 'center',
                    backgroundColor: 'transparent',
                    stopOnFocus: false,
                }).showToast();
                return;
            }
            let template = $(`<div class="todo-item list-group-item">${text}<span class="todo-close">×</span></div>`);

            let test = $("#todo").append(template);
            $("#todo-new-in").val("");
        });

        // stop the dropdown from closing when you click on it
        $("body").on("click", "#header-todo-dropdown", (event) => {
            event.stopPropagation();
        });

        // add the ability to check and remove the todo items
        $("#todo").click((event) => {
            event.stopPropagation();
            if (event.target.tagName === "DIV") {
                event.target.classList.toggle("todo-checked");
            }
            if (event.target.tagName === "SPAN") {
                event.target.closest(".todo-item").remove();
            }
        });

        // save before the page unloads
        $(window).on("beforeunload", () => {
            console.log('[JessyMods] Saving Todo List.');
            let list = btoa($("#todo").html());
            localStorage.setItem(`todo-${currentCharacter}`, list);
        });

        // ensure that we dont write to dom when there will be nothing to write.
        if (localStorage.getItem(`todo-${currentCharacter}`) === null) { return };
        if (localStorage.getItem(`todo-${currentCharacter}`) === undefined) { return };

        $("#todo").append(atob(localStorage.getItem(`todo-${currentCharacter}`)));
    }

    function loadScript() {
        if (typeof confirmedLoaded !== 'undefined' && confirmedLoaded) {
            clearInterval(interval);
            console.log('[JessyMods] Loading "TODO list" Script.');
            loadTODO();
        }
    }

    const interval = setInterval(loadScript, 500);
});
