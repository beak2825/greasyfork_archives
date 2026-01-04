// ==UserScript==
// @name         japaneseasmr grmpy
// @namespace    http://tampermonkey.net/
// @version      2024-10-06
// @description  try to take over the worl
// @author       You
// @match        https://japaneseasmr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=japaneseasmr.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/531707/japaneseasmr%20grmpy.user.js
// @updateURL https://update.greasyfork.org/scripts/531707/japaneseasmr%20grmpy.meta.js
// ==/UserScript==

const $s = (el) => document.querySelector(el), $sa = (el) => document.querySelectorAll(el), $c = (el) => document.createElement(el),
      $a = (el) => document.body.appendChild(el)
///--------------------------------------------------------///
let favs = GM_getValue("favs", []), favTags = GM_getValue("favTags", []);
/*delete all favs*/ // favs = []; GM_setValue("favs", favs);
console.log(favs); console.log(favTags);

function mainPage(){
    let removeElm = [
        '.textwidget',
    ];
    removeElm.forEach(i =>{
        $s(i).innerHTML = ''
    });
    $sa('strong').forEach(i =>{
        if(i.textContent !== 'Tags:'){
            i.style.display = 'none'
        }
    });

    let hideElm = [
        '.post-meta.post-tags',
    ];
    hideElm.forEach(i => {
        $sa(i).forEach(el=> {
            el.style.display = 'none';
        });
    });

    // show tags
    $sa(".entry-preview-wrapper.clearfix > p").forEach(i =>{
        if(i.textContent.startsWith('CV')){
            i.onclick = e =>{
                e.target.parentElement.querySelector('.post-meta.post-tags').style.display = '';
            }
        }
    });

    //  tags function
    favTags.forEach(i =>{
        let p = $c('p')
        p.innerHTML = `<a class="del-fav-tag spaced-link">🗑️</a><a class="fav-tag" href="${i.href}">${i.tag}</a>`
        $s('.textwidget').appendChild(p);
    });
    // bookmark
    function deleteTag(){
        let wasteBaskets = document.querySelectorAll(".del-fav-tag")
        for(let wb of wasteBaskets){
            wb.onclick =()=>{
                let tagText = wb.closest('p').children[1].text,
                    deltag = favTags.findIndex(({ tag }) => tag === tagText);
                favTags.splice(deltag, 1);
                GM_setValue("favTags", favTags);
                wb.closest('p').remove()
            }
        }
    }deleteTag()
    $sa('.search_form').forEach(i =>{
        let div = $c('div')
        div.innerHTML = `<button id="saveTag">♥</button>`
        div.addEventListener("click", e =>{
            e.preventDefault();
            // add favTags
            let tagVal = e.target.closest('.search_form').querySelector('input').value,
                value
            console.log(tagVal)
            if(favTags.findIndex(({ tag }) => tag === tagVal) === -1){
                if(tagVal !== ''){
                    value = {
                        tag: tagVal,
                        href: location.href
                    }
                    console.log('1')
                    let p = $c('p')
                    p.innerHTML = `<a class="del-fav-tag spaced-link">🗑️</a><a class="fav-tag" href="${location.href}">${tagVal}</a>`
                    $s('.textwidget').appendChild(p);
                    favTags.push(value);
                    deleteTag()
                }else{
                    value = {
                        tag: decodeURI(location.href),
                        href: location.href
                    }
                    let p = $c('p')
                    p.innerHTML = `<a class="del-fav-tag spaced-link">🗑️</a><a class="fav-tag" href="${location.href}">${decodeURI(location.href)}</a>`
                    $s('.textwidget').appendChild(p);
                    favTags.push(value);
                    deleteTag()
                    console.log(value)
                }
                GM_setValue("favTags", favTags);
            }
        });
        i.appendChild(div)
    });
}
function detailPage(){
    try{
        let removeElm = [
            '#ilovewp-comments',
        ];
        removeElm.forEach(i =>{
            $s(i).innerHTML = ''
        });
        $sa(".site-column-wrapper.clearfix > p").forEach(i =>{// 'Random post'
            if(i.textContent == 'Random post') i.innerHTML = ''
        });
        $sa('.textwidget > p').forEach(i =>{// 'Featured Posts'
            i.innerHTML = ''
        });

        // improve css
        $s('.op-square').before($s('#select-id'))// player
        $s('.op-square').before($s('#cleanp_audio'))// audio
        $s('.fotorama').before($sa(".site-column-wrapper.clearfix > p")[1])// tags
    }catch{}
}
function favPage(){
    if(location.href == 'https://japaneseasmr.com/favorites/'){
        document.title = "favorite";
        $s('.site-page-content').remove()
        // create a container
        let main = $s("#site-main"),
            i = 0,
            div = $c('div')
        div.innerHTML = `
        <div class="tab-wrap">
            <div class="tags"></div>
            <div class="posts-container" style="display: flex; flex-wrap: wrap;">
            </div>
        </div>`
        main.appendChild(div)

        // class="tags"
        let addedTags = new Set();
        favs.forEach(i =>{
            if(!addedTags.has(i.tag)){
                let btn = $c("button");
                btn.textContent = i.tag;
                $s(".tags").appendChild(btn);
                addedTags.add(i.tag);
            }
        });

        $sa(".tags > button").forEach(btn =>{
            btn.onclick = e =>{
                let postsContainer = $s('.posts-container');
                while (postsContainer.firstChild) {
                    postsContainer.removeChild(postsContainer.firstChild);
                }
                favs.forEach(fav =>{
                    if(btn.innerText == fav.tag){
                        let div2 = $c('div');
                        div2.innerHTML = `
                        <div>
                            <a href="https://japaneseasmr.com/${fav.path}/" target="_blank">
                                <img src="${fav.img}" style="width: 400px;">
                            </a>
                        </div>`
                        div.querySelector('.posts-container').appendChild(div2);
                    }
                })
            }
        });

    }
}favPage()
function favorite(){
    if($s('#cleanp_audio')){// detailPage
        // favs
        let parent = document.querySelector('.post-meta-span-category'),
            a = $c('a');
        a.innerHTML = '☆';
        a.addEventListener('click', e =>{
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
                    <p class="create-new-tag">＋ Create new playlist</p>
                    <input type="text" id="new-playlist-name" placeholder="Enter playlist name" maxlength="10">
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
                  width: 500px;
                  height: 800px;
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
                  padding-bottom: 10px;
                }
                .modal-body {
                  margin-top: 10px;
                  border-bottom: 1px solid #ddd;
                  padding-bottom: 250px;
                  overflow-y: auto;
                  max-height: 500px;
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
                  margin-bottom: 10px;
                  padding-left: 15px;
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
                font-size: 30px;
                line-height: 3;
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
            document.head.insertAdjacentHTML('beforeend', styleHtml);
            document.body.insertAdjacentHTML('beforeend', modalHtml);

            // Add tags to modal-body ul
            let uniqueTags = new Set();
            favs.forEach(fav =>{
                if(!uniqueTags.has(fav.tag)){
                    uniqueTags.add(fav.tag);

                    let li = $c("li");
                    li.innerHTML = `<input type="checkbox"><label for="" class="name-label">${fav.tag}</label>`;
                    $s(".modal-body > ul").appendChild(li);
                }
            });
            // check the cheackbox, if the audio already bookmarked
            let bookmarks = favs.filter(({ path }) => path === location.pathname)
            bookmarks.forEach(b =>{
                let matchedTag = b.tag;
                console.log(b)
                $sa(".modal-body > ul > li").forEach(i =>{
                    if(matchedTag == i.textContent.trim()) i.querySelector('input').checked = true;
                });
            });
            // checkbox event
            $sa(".modal-body > ul > li > input").forEach(checkbox =>{
                checkbox.onclick = e =>{
                    let text = e.target.parentElement.childNodes[1].textContent
                    let img
                    if($s(".fotorama__stage__frame > img")){
                        img = $s(".fotorama__stage__frame > img").src
                    }else if($s(".lazy.loaded")){
                        img = $s(".lazy.loaded").src
                    }else img = $s("#img_cover > img").src
                    if(e.target.checked){// unchecked
                        let val = {
                            path: location.pathname,
                            tag:  text,
                            img:  img,
                        };
                        favs.push(val);
                        a.innerText = '★'
                        console.log(favs)
                    }else{// checked
                        let indexToRemove = favs.findIndex(item => item.tag === text && item.img === img );
                        if (indexToRemove > -1) favs.splice(indexToRemove, 1);
                        a.innerText = '☆'
                        console.log(favs)
                    }
                    GM_setValue("favs", favs);
                };
            });

            const modal = $s('#modal');
            $s('#modal').style.display = 'block';
            $s('#new-playlist-name').style.display = 'none';
            $s('#create-button').style.display = 'none';

            $s('#close-modal').addEventListener('click', () =>{
                modal.style.display = 'none';
                modal.remove();
                $s('style').remove();
            });

            let createBtn = $s('.create-new-tag')
            createBtn.addEventListener('click', e =>{
                e.stopPropagation();
                createBtn.remove()
                $s('#new-playlist-name').style.display = '';
                $s('#create-button').style.display = '';
                $s('#new-playlist-name').focus();
            });

            // add favorite
            $s('#create-button').onclick = e =>{
                let text = $s('#new-playlist-name').value
                let img
                    if($s(".fotorama__stage__frame > img")){
                        img = $s(".fotorama__stage__frame > img").src
                    }else if($s(".lazy.loaded")){
                        img = $s(".lazy.loaded").src
                    }else img = $s("#img_cover > img").src
                if(text !== ''){
                    let val = {
                        path: location.pathname,
                        tag:  text,
                        img:  img,
                    };
                    if(favs.findIndex(({ tag }) => tag === text) !== -1){
                        alert('tagが重複しています。')
                    }else{
                        favs.push(val)
                        let li = $c('li')
                        li.innerHTML = `<input type="checkbox"><label for="" class="name-label">${text}</label>`
                        $s(".modal-body > ul").appendChild(li);
                        a.innerHTML = '★';
                        modal.remove();
                        console.log(favs)
                    }
                    GM_setValue("favs", favs);
                }
            }
        });
        parent.appendChild(a);
        // if it audio already bookmerked
        if(favs.findIndex(({ path }) => location.pathname === path) !== -1) a.innerText = '♥';

        //--------------------tags----------------------///
    }else{
        // fav tags
        let tagBtns = $sa("#saveTag")
        $sa("#saveTag")[2].style.padding = '12px'

        tagBtns.forEacH(b =>{
            b.onclick = e =>{

            }
        });
    }
}
function dispatch(){
    window.onload = () =>{
        if($s('#cleanp_audio')){
            detailPage();
            favorite();
        }else if(location.href.includes('https://japaneseasmr.com/?__cf_')){
        }else{
            mainPage()
        }
        // all page
        let req = $sa(".menu-item.menu-item-type-post_type > a")[5]
        req.textContent = 'FAVS'
        req.href = 'https://japaneseasmr.com/favorites/'
    }
}dispatch()
function style(){
    GM_addStyle(`
    button#saveTag {
    padding: 12px;
}
                `)
}style()