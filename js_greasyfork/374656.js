// ==UserScript==
// @name         Readouble Laravel Document Menu
// @namespace    https://greasyfork.org/ja/scripts/374656-readouble-laravel-document-menu
// @version      0.1
// @description  ReadDoubleのLaravel日本語ドキュメントにサイドメニューを表示する
// @author       tobigumo
// @match        https://readouble.com/laravel/*.*/*/*.html
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/374656/Readouble%20Laravel%20Document%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/374656/Readouble%20Laravel%20Document%20Menu.meta.js
// ==/UserScript==

GM_addStyle(`
.menu-button{
  width: 30px;
  height: 30px;
  display: block;
  position: fixed;
  right: 10px;
  top: 30px;
  background-color:#ffffffcc;
  display:none;
}
.menu-button i{
display: block;
width: 20px;
height: 2px;
border-radius: 3px;
background: #000;
transition: background 0.5s;
position: relative;
left: 5px;
top: 14px;
}
.menu-button i::before,
.menu-button i::after{
content: "";
display: block;
width: 20px;
height: 2px;
border-radius: 3px;
background: #000;
position: fixed;
transform: rotate(0deg);
transition: all 0.3s !important;
}
.menu-button i::before{
transform:translateY(8px);
}
.menu-button i::after{
transform:translateY(-8px);
}
.menu_container{
  float:right;
}
.menu_accordion_ul{
  height: 0;
  overflow: hidden;
}
.menu_accordion{
  display:none;
}
.current-page {
  font-weight:bold;
}
.menu_accordion:checked + .menu_accordion_ul{
  height: auto;
}
.full_screen_label{
  display:none !important;
  position:fixed;
  top:0;
  bottom:0;
  left:0;
  right:0;
  z-index:99;
}
@media screen and (max-width:1200px) {
  .menu_container {
    display: none;
  }
  .menu_switch:checked ~ .menu_container{
    display: block;
  }
  .menu_container{
    position:fixed;
    top: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;

    z-index:100;
    background-color:#000000cc;
  }
  .menu_container::-webkit-scrollbar{
    display:none;
  }
  .menu_container label{
    color:#fff;
  }
  .menu_container a{
    color:#f6c2ac;
  }
  .menu-button {
    display:block;
  }
  .menu_switch:checked ~ .full_screen_label{
    display: block !important;
  }

}
.menu_switch{
  display:none;
}
`);

(function() {
    'use strict';

    const menu_container = document.createElement('div');
    menu_container.className = 'menu_container';
    const content_container = document.getElementById('content');
    const category_blocks = document.getElementById('moveToPage').getElementsByClassName('categoryBlock');
    const ul = document.createElement('ul');

    const menu_button = document.createElement('label');
    const full_screen_label = document.createElement('label');
    full_screen_label.className = 'full_screen_label';
    full_screen_label.setAttribute('for', 'menu_switch');
    menu_button.className = 'menu-button';
    menu_button.setAttribute('for', 'menu_switch');
    const menu_button_i = document.createElement('i');
    menu_button.appendChild(menu_button_i);
    const menu_switch = document.createElement('input');
    menu_switch.type = 'checkbox';
    menu_switch.id = 'menu_switch';
    menu_switch.className = 'menu_switch';

    const url = location.origin + location.pathname;

    for(let category_block of category_blocks) {
        const li = document.createElement('li');
        const input = document.createElement('input');
        const label = document.createElement('label');
        const category_name = category_block.getElementsByClassName('categoryName')[0].textContent;
        input.type = 'checkbox';
        input.id = category_name;
        input.name = 'menu_accordion';
        input.className = 'menu_accordion';
        label.textContent = category_name;
        label.setAttribute('for', category_name);
        li.appendChild(label);
        li.appendChild(input);

        const sub_ul = document.createElement('ul');
        sub_ul.className = 'menu_accordion_ul';
        const document_pages = category_block.getElementsByClassName('chapters')[0].getElementsByTagName('a');
        for(let document_page of document_pages) {
            const sub_li = document.createElement('li');
            const a = document.createElement('a');

            a.textContent = document_page.textContent;
            a.href = document_page.href;

            if(url === a.href) {
              a.className = 'current-page';
              input.checked = true;
            }

            sub_li.appendChild(a);
            sub_ul.appendChild(sub_li);
        }
        li.appendChild(sub_ul);
        ul.appendChild(li);
    }

    menu_container.appendChild(ul);

    content_container.insertBefore(menu_container, content_container.firstChild);
    content_container.insertBefore(full_screen_label, content_container.firstChild);
    content_container.insertBefore(menu_switch, content_container.firstChild);
    content_container.insertBefore(menu_button, content_container.firstChild);
})();
