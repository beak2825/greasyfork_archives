// ==UserScript==
// @name        Hide Thread for Два.ч catalog
// @namespace   hidethread
// @include     https://2ch.hk/*/catalog.html
// @version     1
// @grant       none
// @description:en  Ability to hide/unhide threads on 2ch.hk catalog.
// @description Ability to hide/unhide threads on 2ch.hk catalog.
// @downloadURL https://update.greasyfork.org/scripts/25634/Hide%20Thread%20for%20%D0%94%D0%B2%D0%B0%D1%87%20catalog.user.js
// @updateURL https://update.greasyfork.org/scripts/25634/Hide%20Thread%20for%20%D0%94%D0%B2%D0%B0%D1%87%20catalog.meta.js
// ==/UserScript==

var thumb = "thumb";
var hide_menu;
var unhide_menu;
var hidden_mode = false;
var myElem; 
var hthread;
var _counter = 0;

if(localStorage.hidden_thread_list === undefined)
    localStorage.hidden_thread_list = "";

init();
exclude_hidden_threads();

function init(){ 
       //create context menus
       hide_menu =  document.createElement('menu'); 
       hide_menu.id = "hide_thread_id";
       hide_menu.type = "context";

       unhide_menu = document.createElement('menu');
       unhide_menu.id = "unhide_thread_id";
       unhide_menu.type = "context";
       document.addEventListener("contextmenu",right_click);

       //create hide button
       var div_cent = document.getElementsByClassName("centered")[0];
       myElem = document.createElement('span');
       myElem.style.float = "left";
       myElem.innerHTML = "[<a>show hidden threads</a> ]"
       myElem.onclick=function(e){show_hidden();}
       div_cent.appendChild(myElem);
}


function exclude_hidden_threads(){
        var list = localStorage.hidden_thread_list.split(" ");
        console.log("hidden threads: " + list);
        if(list != null && list.length != 0)
           hthread = setInterval(check_elem,10,list);
}

function check_elem(list){
    for(var i = 0; i < list.length; i ++){
        if(list[i] && document.getElementById(list[i]) != null){
            document.getElementById(list[i]).parentNode.style.display = "none"; 
            _counter++;
        }
    }
    if(_counter >= list.length)
        clearInterval(hthread);
}
    

function right_click(e){
    if(e.target.classList.contains(thumb)){
        if(!hidden_mode){
            e.target.appendChild(hide_menu);
            e.target.setAttribute('contextmenu','hide_thread_id');
            hide_menu.innerHTML = "<menuitem label='Hide Thread' id='menu_item_id'></menuitem>";
            document.getElementById('menu_item_id').onclick=function(e){e.preventDefault();hide(get_parents("menu_item_id")[5])};
        }else{
            e.target.appendChild(unhide_menu);
            e.target.setAttribute('contextmenu','unhide_thread_id');
            unhide_menu.innerHTML = "<menuitem label='Unhide Thread' id='menu_item_id2'></menuitem>";
            document.getElementById('menu_item_id2').onclick=function(e){e.preventDefault();unhide(get_parents("menu_item_id2")[5])};
        }
    }
}

function get_parents(id){
    var el = document.getElementById(id)
    var ps = [];
    while(el){
        el = el.parentNode;
        ps.push(el);
    }
    return ps;
}


function hide(el){         
        localStorage.hidden_thread_list += el.childNodes[0].id + " ";
        el.style.display = "none";
}

function unhide(el){
    el.style.display = "none";
    if(localStorage.hidden_thread_list.includes(el.childNodes[0].id))
        localStorage.hidden_thread_list = localStorage.hidden_thread_list.replace(el.childNodes[0].id,"");
}

function show_hidden(){             
    hidden_mode = true;
    var box = document.getElementById('threads');
    var final_html = "";
    var list = localStorage.hidden_thread_list.split(" ");
    for(var i = 0; i < list.length; i ++){
        if(list[i].trim() && document.getElementById(list[i].trim()) != null){
            var el = document.getElementById(list[i].trim()).parentNode;
            el.style.display = "inline-block";
            final_html += el.outerHTML;     
        }
    }
    box.innerHTML = final_html;
    myElem.innerHTML = "[<a>Back</a> ]"
    myElem.onclick=function(e){show_normal();}
}

function show_normal(){
    hidden_mode = false;
    location.reload();
}