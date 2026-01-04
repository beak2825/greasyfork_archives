// ==UserScript==
// @name         Greasy Fork Bookmark
// @name:en      Greasy Fork Bookmark
// @name:ja      Greasy Fork ブックマーク
// @namespace    https://greasyfork.org/ja/users/941284-ぐらんぴ
// @version      2025-03-09
// @description       Bookmark scripts easily
// @description:en    Bookmark scripts easily
// @description:ja    Greasy Forkのブックマーク機能
// @author       ぐらんぴ
// @match        https://greasyfork.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493406/Greasy%20Fork%20Bookmark.user.js
// @updateURL https://update.greasyfork.org/scripts/493406/Greasy%20Fork%20Bookmark.meta.js
// ==/UserScript==

const $s = (el) => document.querySelector(el), $sa = (el) => document.querySelectorAll(el), $c = (el) => document.createElement(el)
let favScripts = GM_getValue("favScripts", [])
///---------------------------------------------///
// favScripts = []; GM_setValue("favScripts", favScripts);
console.log(favScripts);

function scriptPage(){
    if(location.href.match('/scripts/') && $s(".script-meta-block")){
        let title = $s("#script-info > header > h2").innerText
        let parent = $s('#script-links'),
            li = $c('li')
        li.innerHTML = `<a>☆</a>`
        const modalHtml = `
            <div id="modal" class="modal">
                <div class="modal-header">
                    <h2></h2>
                    <button id="close-modal">close</button>
                </div>
                <div class="modal-body">
                    <ul></ul>
                </div>
                <div>
                    <p class="create-new-tag">＋ Create new tag</p>
                    <input type="text" id="new-playlist-name" placeholder="Enter tag name" maxlength="10">
                    <button id="create-button">Create</button>
                </div>
            </div>`;
        const styleHtml = `
            <style>
                .modal {
                  display: none;
                  position: fixed;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  width: 300px;
                  height: 400px;
                  padding: 20px;
                  background-color: white;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                  z-index: 10;
                  border-radius: 10px;
                }
                .modal-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  border-bottom: 1px solid #ddd;
                  padding-bottom: 1px;
                }
                .modal-body {
                  margin-top: 10px;
                  border-bottom: 1px solid #ddd;
                  padding-bottom: 250px;
                  overflow-y: auto;
                  max-height: 5px;
                }
                .modal-body ul {
                  list-style: none;
                  padding-left: 0;
                  display: flex;
                  flex-direction: column;
                }
                .modal-body ul li {
                  display: flex;
                  align-items: center;
                  margin-bottom: 1px;
                  padding-left: 1px;
                }
                .modal-body ul li label {
                  font-size: 20px;
                }
                li label.name-label {
                  font-size: 20px;
                  margin-left: 15px;
                }
                .modal-body ul li input[type="checkbox"] {
                  transform: scale(1.5);
                  margin-right: 10px;
                }
                .create-new-tag {
                text-align: left;
                font-size: 20px;
                color: black;
                }
                .create-new-tag input[type="text"] {
                position: relative;
                top: 20px;
                width: 300px;
                margin-right: 10px;
                }
                .create-new-tag button {
                font-size: 20px;
                }
                input#new-playlist-name {
                top: 20px;
                }
            </style>`;
        li.addEventListener('click', e =>{
            document.head.insertAdjacentHTML('beforeend', styleHtml);
            document.body.insertAdjacentHTML('beforeend', modalHtml);

            // Add tags to modal-body ul
            let uniqueTags = new Set();
            favScripts.forEach(fav =>{
                if(!uniqueTags.has(fav.tag)){
                    uniqueTags.add(fav.tag);

                    let li = $c("li");
                    li.innerHTML = `<input type="checkbox"><label for="" class="name-label">${fav.tag}</label>`;
                    $s(".modal-body > ul").appendChild(li);
                }
            });
            // Check the checkbox of the tag if the script is already bookmarked
            let bookmarks = favScripts.filter(({ scriptTitle }) => scriptTitle === title)
            bookmarks.forEach(b =>{
                let matchedTag = b.tag;
                $sa(".modal-body > ul > li").forEach(i =>{
                    if(matchedTag == i.textContent.trim()) i.querySelector('input').checked = true;
                });
            });
            // checkbox event
            $sa(".modal-body > ul > li > input").forEach(checkbox =>{
                checkbox.onclick = e =>{
                    let text = e.target.parentElement.querySelector('.name-label').textContent
                    if(e.target.checked){
                        let val = {
                            url: location.href,
                            tag:  text,
                            scriptTitle: title,
                            description: $s(".script-description").textContent,
                        };
                        favScripts.push(val);
                        li.innerHTML = '<a>★</a>'
                        console.log("added",favScripts)
                    }else{
                        let indexToRemove = favScripts.findIndex(item => item.scriptTitle === title && item.url === location.href && item.tag === text );
                        if (indexToRemove > -1) favScripts.splice(indexToRemove, 1);
                        console.log("removed",favScripts)
                    }
                    GM_setValue("favScripts", favScripts);
                };
            });

            const modal = $s('#modal');
            $s('#modal').style.display = 'block';
            $s('#new-playlist-name').style.display = 'none';
            $s('#create-button').style.display = 'none';

            $s('#close-modal').addEventListener('click', () =>{
                modal.style.display = 'none';
                modal.remove();
                // if this script isn't bookmarked, li.innerHTML = '<a>☆</a>'
                if(favScripts.findIndex(({ scriptTitle }) => scriptTitle === title) == -1) li.innerHTML = '<a>☆</a>'
            });

            let createBtn = $s('.create-new-tag')
            createBtn.addEventListener('click', b =>{
                b.stopPropagation();
                createBtn.remove()
                $s('#new-playlist-name').style.display = '';
                $s('#create-button').style.display = '';
                $s('#new-playlist-name').focus();
                $s('#new-playlist-name').addEventListener('keydown', e => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        $s('#create-button').click();
                    }
                });
            });

            $s('#create-button').onclick = e =>{
                let text = $s('#new-playlist-name').value
                if(text !== ''){
                    let val = {
                        url: location.href,
                        tag:  text,
                        scriptTitle: title,
                        description: $s(".script-description").textContent,
                    };
                    if(favScripts.findIndex(({ tag }) => tag === text) !== -1){
                        alert('This tag name already exists.');
                    }else{
                        favScripts.push(val)
                        let li2 = $c('li')
                        li2.innerHTML = `<input type="checkbox"><label for="" class="name-label">${text}</label>`
                        $s(".modal-body > ul").appendChild(li2);
                        li.innerHTML = '<a>★</a>';
                        modal.remove();
                        console.log(favScripts)
                    }
                    GM_setValue("favScripts", favScripts);
                }
            }
        });
        parent.appendChild(li)

        // If this script already bookmarked, li.innerText = '★';
        if(favScripts.findIndex(({ scriptTitle }) => scriptTitle === title) !== -1) li.innerHTML = `<a>★</a>`;

        // close modal
        document.addEventListener('click', e =>{
            const modal = $s('#modal');
            if(modal && !modal.contains(e.target) && !e.target.closest('li')){
                modal.style.display = 'none';
                modal.remove();
                // check the bookmark
                if(favScripts.findIndex(({ scriptTitle }) => scriptTitle === title) == -1) li.innerHTML = '<a>☆</a>'
            }
        });
    }
}scriptPage()
function favPage(){
    if(location.href == "https://greasyfork.org/bookmarks"){
        document.title = 'bookmarks'
        $s("body > div > section").remove()

        $s("body > div").innerHTML = `
        <div class="sidebarred">
            <div class="sidebarred-main-content">
            <div class="open-sidebar sidebar-collapsed">☰</div>
            <ol id="browse-script-list" class="script-list ">`

        function addScripts(filter, tagFilter){
            // reset list items
            if($sa('ol > li')) $sa('ol > li').forEach(elm => elm.remove());

            // Filter and add scripts to the list
            favScripts.forEach(fav =>{
                if((!filter || filter === "All" || fav.url.startsWith(filter))){
                    let elm = $s(".script-list"),
                        li = $c("li");
                    li.innerHTML = `
                    <span style="display: flex; align-items: center;">
                        <a class="script-link" href="${fav.url}">${fav.scriptTitle}</a>
                        <button class="star" style="margin-left: auto;">★</button>
                    </span>
                    <span class="script-description description">${fav.description}</span>
                    <span class="data-tag" data-tag="${fav.tag}"></span>`
                    elm.appendChild(li);

                    // star click function
                    $sa('.star').forEach(i =>{
                        i.onclick = e =>{
                            // console.log(e.target.parentElement.querySelector('a').href)
                            // console.log(e.target.parentElement.parentElement.querySelector('.data-tag').getAttribute('data-tag'))
                            let starHref = e.target.parentElement.querySelector('a').href
                            let starTag = e.target.parentElement.parentElement.querySelector('.data-tag').getAttribute('data-tag')
                            let starTitle = e.target.parentElement.querySelector('a').textContent
                            let starDescription = e.target.parentElement.parentElement.querySelector('.description').textContent

                            if(e.target.innerHTML == '★'){
                                let indexToRemove = favScripts.findIndex(i => i.url === starHref && i.tag === starTag);
                                if (indexToRemove > -1) favScripts.splice(indexToRemove, 1);
                                console.log("removed",favScripts)
                                e.target.innerHTML = '☆'
                            }else{
                                let val = {
                                    url: starHref,
                                    tag:  starTag,
                                    scriptTitle: starTitle,
                                    description: starDescription,
                                };
                                favScripts.push(val);
                                e.target.innerHTML = '★'
                                console.log("added",favScripts)
                            }
                            GM_setValue("favScripts", favScripts);
                        }
                    });
                }
            });
        }addScripts()

        let sidebarred = $s(".sidebarred"),
            div = $c("div")
        div.innerHTML = `
        <div class="sidebar collapsed">
        <div class="close-sidebar">
        <div class="sidebar-title"></div>
        <div>☰</div>
        </div>
        <div id="script-list-option-groups" class="list-option-groups">
        <form class="sidebar-search">
        <input type="hidden" name="sort" value="created">
        <div id="script-list-sort" class="list-option-group">Sites:
        <ul>
          <li class="list-option"><a>All</a></li>
          <li class="list-option"><a>Greasyfork</a></li>
          <li class="list-option"><a>Sleazyfork</a></li>
        </ul>
        </div>
        <div id="script-language-filter" class="list-option-group">Tags:
        <ul>
        </ul>
        </div>`
        div.style.cursor = "pointer"
        sidebarred.appendChild(div);

        // Sorting by: function
        $sa('.list-option').forEach(i =>{
            i.onclick = e =>{
                $sa("#script-language-filter > ul > li").forEach(j =>{
                    j.classList.remove("list-current");
                });
                switch(i.textContent){
                    case "All":
                        addScripts();
                        break;
                    case "Greasyfork":
                        addScripts('https://greasy');
                        break;
                    case "Sleazyfork":
                        addScripts('https://sleazy');
                        break;
                }
            }
        });

        // Tags: function
        let uniqueTags = new Set();
        favScripts.forEach(fav => {
            if (!uniqueTags.has(fav.tag)) {
                uniqueTags.add(fav.tag);

                let li = $c("li");
                li.className = "list-option";
                li.innerHTML = `<a>${fav.tag}</a>`;
                $s("#script-language-filter > ul").appendChild(li);
            }
        });

        $sa("#script-language-filter > ul > li").forEach(i =>{
            i.onclick = () =>{
                $sa("#script-language-filter > ul > li").forEach(j =>{
                    j.classList.remove("list-current");
                });
                i.classList.add("list-current");
                // display
                $sa("#browse-script-list > li").forEach(k =>{
                    if(i.textContent !== k.querySelector('.data-tag').getAttribute('data-tag')){
                        k.style.display = 'none'
                    }else k.style.display = ''
                });
            }
        });

    }
}favPage()
function allPage(){
    let li = document.createElement('li');
    li.innerHTML = `<a href="https://greasyfork.org/bookmarks">Favs</a>`;
    document.querySelector("#site-nav > nav").appendChild(li.cloneNode(true));
    document.querySelector("#mobile-nav > nav").appendChild(li.cloneNode(true))// mobile
}allPage();