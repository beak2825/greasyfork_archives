// ==UserScript==
// @name         NH QoL
// @version      1.3.0
// @description  nhentai QoL
// @author       ryousukecchi
// @include      https://nhentai.net/*
// @grant        none
// @namespace   https://greasyfork.org/users/292830
// @downloadURL https://update.greasyfork.org/scripts/381974/NH%20QoL.user.js
// @updateURL https://update.greasyfork.org/scripts/381974/NH%20QoL.meta.js
// ==/UserScript==
// jshint esversion: 6


let q_main_box = "#content";
let q_gallery_box = ".container.index-container";
let q_gallery_suggest_box = "#related-container";
let get_gallery_counter;
let request_wait = 1500;
let hover_wait = 0;
let auto_close_interval = 500;

let tags = {
    "8653" : {"nick":"N", "name":"Netorare", "url":"netorare"},
    "27553": {"nick":"R", "name":"Rape", "url":"rape"},
    "29182": {"nick":"B", "name":"Blackmail", "url":"blackmail"},
    "9260" : {"nick":"C", "name":"Cheating", "url":"cheating"},
    "2937" : {"nick":"BB", "name":"Big Breasts", "url":"big-breast"},
};

let z_tags = ["8653", "27553", "29182", "9260", "2937"];


function global_printf(s,d=false) {
    if (d) console.log(s);
}
function nocallback(callback=false){
    console.log("no callback called");
}
function checkExist(query,qid=0) {
    let el_exist = false;
    if (document.querySelectorAll(query).length > qid){
        if (document.querySelectorAll(query)[qid].getBoundingClientRect().width > 0 && document.querySelectorAll(query)[qid].getBoundingClientRect().height > 0) {
            el_exist = true;
        }
    }
    return el_exist;
}
function checkEl(query,qid=0,callback=false) {
    let old_top = -1;
    let old_left = -1;
    let loop_checkEl = setInterval(function() {
        if (checkExist(query,qid)) {
            if (old_top==document.querySelectorAll(query)[qid].getBoundingClientRect().top && old_left==document.querySelectorAll(query)[qid].getBoundingClientRect().left) {
                clearInterval(loop_checkEl);
                if (typeof callback == "function") {
                    callback();
                }
            }else{
                old_top = document.querySelectorAll(query)[qid].getBoundingClientRect().top;
                old_left = document.querySelectorAll(query)[qid].getBoundingClientRect().left;
            }
        }
    }, 200);
}
function readBody(xhr) {
    let data;
    if (!xhr.responseType || xhr.responseType === 'text') {
        data = xhr.responseText;
    } else if (xhr.responseType === 'document') {
        data = xhr.responseXML;
    } else {
        data = xhr.response;
    }
    return data;
}
function checkContent(callback=nocallback){
    let checkPageLoaded = setInterval(function() {
        if (document.querySelector(q_main_box) !== null){
            if (document.querySelector(q_main_box).getBoundingClientRect().width>0){
                clearInterval(checkPageLoaded);
                callback();
            }
        }
    }, 300);
}

function setDefaultSettings(allow_debug=false){
    let printf = function(s) {global_printf(s,allow_debug);};
    if (window.localStorage.getItem("z_filter")===null){
        window.localStorage.setItem("z_filter",true);
    }
    printf(window.localStorage.getItem("z_filter"));
    for (let i = 0; i < z_tags.length; i++) {
        const z_tag = z_tags[i];
        if (window.localStorage.getItem("z_tag_"+z_tag)===null){
            window.localStorage.setItem("z_tag_"+z_tag,true);
        }
        printf(z_tag);
        printf(window.localStorage.getItem("z_tag_"+z_tag));
    }
}



function refreshGallery(allow_debug=false){
    let printf = function(s) {global_printf(s,allow_debug);};
    printf(refreshGallery.name);
    printf(window.location.href.indexOf('nhentai.net/g/') >= 0);
    let getMarkedTags = function(gallery_tags){
        let show_el = false;
        let marked_tags = [];
        for (let i = 0; i < gallery_tags.length; i++) {
            const gallery_tag = gallery_tags[i];
            if (window.localStorage.getItem("z_tag_"+gallery_tag)=="true"){
                show_el = true;
                marked_tags.push(tags[gallery_tag].nick);
            }
        }
        return {"show_el":show_el,"marked_tags":marked_tags};
    };
    printf(refreshGallery.name);
    let shown_count = 0;
    let hidden_count = 0;
    let z_filter = document.getElementById("z_filter");
    let el_galleries = document.getElementsByClassName("gallery");
    for (let i = 0; i < el_galleries.length; i++) {
        const el_gallery = el_galleries[i];
        let gallery_tags = el_gallery.attributes["data-tags"].value;
        gallery_tags = gallery_tags.split(" ");
        let tag_info = getMarkedTags(gallery_tags);
        printf(tag_info);
        let class_z_tags = "caption_z_tags";
        let q_z_tags = "."+class_z_tags;
        let title_query = ".caption";
        if (el_gallery.querySelector(q_z_tags) === null){
            let span_caption_z_tags = document.createElement("span");
            span_caption_z_tags.style.color = "red";
            span_caption_z_tags.setAttribute("class", class_z_tags);

            let el_title = el_gallery.querySelector(title_query);
            el_title.appendChild(span_caption_z_tags);
            el_title.insertBefore(span_caption_z_tags, el_title.childNodes[0]);
        }
        if (tag_info.marked_tags.length>0){
            el_gallery.querySelector(q_z_tags).innerHTML = "{"+tag_info.marked_tags.join(",")+"} ";
            el_gallery.style.border = "5px solid red";
        } else {
            el_gallery.querySelector(q_z_tags).innerHTML = "";
            el_gallery.style.border = "";
        }
        if (z_filter.checked){
            if(tag_info.show_el){
                el_gallery.style.display = "";
                shown_count += 1;
            } else {
                el_gallery.style.display = "none";
                hidden_count += 1;
            }
        } else {
            el_gallery.style.display = "";
            shown_count += 1;
        }
    }
    let z_filter_text = document.getElementById("z_filter_text");
    z_filter_text.innerHTML = " Z-Filter | Shown: "+(shown_count.toString())+" | Hidden: "+(hidden_count.toString());

    let highlightGalleryTags = function() {
        let q_tag_list = '#tags > div.tag-container.field-name:nth-child(3)>.tags';
        let init_highlightGalleryTags = function() {
            let el_tag_list = document.querySelector(q_tag_list).children;
            for (let i = 0; i < el_tag_list.length; i++) {
                const el_tag = el_tag_list[i];
                const el_tag_class = Array.from(el_tag.classList)[1];
                const tid = el_tag_class.replace('-','_').replace("tag_","");
                printf(tid);
                printf(window.localStorage.getItem('z_tag_'+tid));
                printf(window.localStorage.getItem('z_tag_'+tid) == "true");
                if (window.localStorage.getItem('z_tag_'+tid) == "true") {
                    el_tag.style.border = "2px solid red";
                } else if (window.localStorage.getItem('z_tag_'+tid)!=null) {
                    el_tag.style.border = "1px solid red";
                }
            }

        };
        checkEl(q_tag_list,0,init_highlightGalleryTags);
    };
    printf(window.location.href.indexOf('nhentai.net/g/') >= 0);
    if (window.location.href.indexOf('nhentai.net/g/') >= 0) {
        highlightGalleryTags();
    }
}

function createMyContent(allow_debug=false){
    let printf = function(s) {global_printf(s,allow_debug);};
    let el_content = document.getElementById("content");
    let el_myContent = document.createElement("div");
    el_myContent.id = "myContent";

    let el_br1 = document.createElement("br");
    let el_br2 = document.createElement("br");


    let el_div_z_filter = document.createElement("div");
    el_div_z_filter.id = "z_filter_container";
    let el_z_filter = document.createElement("input");
    el_z_filter.type = "checkbox";
    el_z_filter.id = "z_filter";
    if (window.localStorage.getItem("z_filter")=="false"){
        el_z_filter.checked = false;
    } else {
        el_z_filter.checked = true;
    }
    el_z_filter.addEventListener('change', function() {
        if (el_z_filter.checked){
            window.localStorage.setItem("z_filter",true);
        } else {
            window.localStorage.setItem("z_filter",false);
        }
        refreshGallery();
    });
    let span_z_filter_text = document.createElement("span");
    span_z_filter_text.id = "z_filter_text";
    let z_filter_text = document.createTextNode(" Z-Filter");
    el_div_z_filter.appendChild(el_z_filter);
    span_z_filter_text.appendChild(z_filter_text);
    el_div_z_filter.appendChild(span_z_filter_text);
    el_div_z_filter.style.width = "100%";
    el_myContent.appendChild(el_div_z_filter);
    let updateGallery = function (el_checkbox, allow_debug=false){
        return function() {
            let printf = function(s) {global_printf(s,allow_debug);};
            printf(updateGallery.name);
            printf(el_checkbox);
            if (el_checkbox.checked){
                window.localStorage.setItem(el_checkbox.id,true);
            } else {
                window.localStorage.setItem(el_checkbox.id,false);
            }
            refreshGallery();
        };
    };
    for (let i = 0; i < z_tags.length; i++) {
        const z_tag = z_tags[i];
        const z_tag_obj = tags[z_tag];
        printf(z_tag_obj);
        let el_toggle_z_tag = document.createElement("input");
        let el_div_nav_z_tag = document.createElement("div");
        el_toggle_z_tag.type = "checkbox";
        el_toggle_z_tag.id = "z_tag_"+z_tag;
        if (window.localStorage.getItem("z_tag_"+z_tag)=="true"){
            el_toggle_z_tag.checked = true;
        } else {
            el_toggle_z_tag.checked = false;
        }
        el_toggle_z_tag.addEventListener('change', updateGallery(el_toggle_z_tag));
        el_div_nav_z_tag.setAttribute("class", "toggle_z_tag_container");
        el_div_nav_z_tag.style.width = "150px";
        el_div_nav_z_tag.appendChild(el_toggle_z_tag);
        el_div_nav_z_tag.appendChild(document.createTextNode(" "+z_tag_obj.name));
        el_myContent.appendChild(el_div_nav_z_tag);
    }

    el_myContent.style.margin = "0px 8%";
    el_myContent.style["text-align"] = "left";
    el_myContent.style.display = "flex";
    el_myContent.style["flex-flow"] = "wrap";

    el_content.appendChild(el_myContent);
    el_content.appendChild(el_br1);
    el_content.appendChild(el_br2);

    if (document.querySelector(q_gallery_box)!==null){
        el_content.insertBefore(el_myContent, document.querySelector(q_gallery_box));
    }else if(document.querySelector(q_gallery_suggest_box)!==null){
        el_content.insertBefore(el_myContent, document.querySelector(q_gallery_suggest_box));
    }

    el_content.insertBefore(el_br1, el_myContent);
    el_content.insertBefore(el_br2, el_myContent);
    el_content.insertBefore(el_myContent, el_br2);
}

function addTagAsNav(tag_nick, tag_name) {
    let el_nav = document.querySelector('ul.menu.left');
    let el_dd = document.querySelector('ul.dropdown-menu');
    let tag_li = document.createElement("li");
    let tag_a = document.createElement("a");
    tag_a.setAttribute("href", "/tag/"+tag_name);
    tag_a.appendChild(document.createTextNode(tag_nick));
    tag_li.appendChild(tag_a);
    let tag_li2 = tag_li.cloneNode(true);
    tag_li.setAttribute("class", "desktop");
    el_dd.appendChild(tag_li2);
    el_nav.insertBefore(tag_li, el_nav.childNodes[el_nav.childNodes.length-1]);
}

function domAttribToList(el_attribs) {
    let list_attrib = [];
    for (let i = 0; i < el_attribs.length; i++) {
        const el_attrib = el_attribs[i];
        list_attrib.push(el_attrib.textContent);
    }
    return list_attrib;
}





function getGalleryInfo(gallery_id, gallery_url, el_gallery, el_tooltip, allow_debug=false) {
    return function() {
        let printf = function(s) {global_printf(s,allow_debug);};
        // if (allow_debug) printf = console.log;
        printf(getGalleryInfo.name);
        printf(gallery_id);
        el_gallery.onmousemove = function(e){
            // printf = function(s) {global_printf(s,true);};
            let margin_mouse = 5;
            let marginLeft;
            let marginTop;
            if (document.documentElement.clientWidth - e.clientX >= e.clientX) {
                marginLeft = e.pageX-el_gallery.offsetLeft+margin_mouse;
            } else {
                marginLeft = e.pageX-el_gallery.offsetLeft-margin_mouse-el_tooltip.clientWidth;
            }
            if (document.documentElement.clientHeight - e.clientY >= e.clientY) {
                marginTop = e.pageY-el_gallery.offsetTop+margin_mouse;
            } else {
                marginTop = e.pageY-el_gallery.offsetTop-margin_mouse-el_tooltip.clientHeight;
            }
            // if ((e.clientX + el_tooltip.clientWidth + margin_mouse+1) > document.documentElement.clientWidth) {
            //     marginLeft = e.pageX-el_gallery.offsetLeft-margin_mouse-el_tooltip.clientWidth;
            // } else {
            //     marginLeft = e.pageX-el_gallery.offsetLeft+margin_mouse;
            // }
            // if ((e.clientY + el_tooltip.clientHeight + margin_mouse+1) > document.documentElement.clientHeight) {
            //     marginTop = e.pageY-el_gallery.offsetTop-margin_mouse-el_tooltip.clientHeight;
            // } else {
            //     marginTop = e.pageY-el_gallery.offsetTop+margin_mouse;
            // }
            el_tooltip.style.marginTop = marginTop+"px";
            el_tooltip.style.marginLeft = marginLeft+"px";
            // allow_debug = true;
            // if (allow_debug) {
            //     let b_gallery = el_gallery.getBoundingClientRect();
            //     let b_tooltip = el_tooltip.getBoundingClientRect();
            //     let scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
            //     // printf("b_gallery: left, top, right, bottom");
            //     // printf([b_gallery.left, b_gallery.top, b_gallery.right, b_gallery.bottom].join(", "));
            //     printf("b_tooltip: right, bottom");
            //     printf([b_tooltip.right, b_tooltip.bottom].join(", "));
            //     printf("try: right, bottom")
            //     printf((e.clientX + el_tooltip.clientWidth + margin_mouse+1)+", "+(e.clientY + el_tooltip.clientHeight + margin_mouse+1))
            // }
            // printf("tooltip.pageX, tooltip.pageY");
            // printf(e.pageX.toString()+", "+e.pageY.toString());
            // printf("tooltip.screenX, tooltip.screenY");
            // printf(e.screenX.toString()+", "+e.screenY.toString());
            // printf("tooltip.layerX, tooltip.layerY");
            // printf(e.layerX.toString()+", "+e.layerY.toString());
            // printf("tooltip.clientX, tooltip.clientY");
            // printf(e.clientX.toString()+", "+e.clientY.toString());
            // // printf(e);
            // printf("-------------");
            // printf = function(s) {global_printf(s,allow_debug);};
        };

        let showGalleryInfo = function () {
            el_tooltip.style.visibility = "visible";
        };

        let autoCloseGalleryInfo = function() {
            let auto_close_counter = setInterval(function() {
                printf(autoCloseGalleryInfo.name);
                printf(el_gallery);
                printf(Array.from(document.querySelectorAll(":hover")).indexOf(el_gallery) === -1);
                if (Array.from(document.querySelectorAll(":hover")).indexOf(el_gallery) === -1) {
                    clearInterval(auto_close_counter);
                    // clearTimeout(get_gallery_counter);
                    printf("clearing timeout and interval, called from "+autoCloseGalleryInfo.name+", gallery_id: "+gallery_id);
                    el_tooltip.style.visibility = "hidden";
                }
            }, auto_close_interval);

        };
        let showCurrentGalleryInfo = function() {
            printf(showCurrentGalleryInfo.name);
            showGalleryInfo();
            autoCloseGalleryInfo();
        };
        let init_request = function() {
            printf(init_request.name);
            showGalleryInfo();
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    const r = readBody(xhr);
                    const body_text = r.substring(r.indexOf('<body>')+6,r.indexOf('</body>'));
                    const el_body = document.createElement('div');
                    el_body.innerHTML = body_text;
                    const el_info = el_body.querySelector("#info");
                    // const el_title1 = el_info.querySelector("h1.title");
                    // const el_title2 = el_info.querySelector("h2.title");
                    const el_tags = el_info.querySelector("section#tags");
                    let el_attrib = {};
                    // el_attrib.parodies = el_tags.children[0].querySelectorAll("span.tags>a.tag>span.name");
                    // el_attrib.characters = el_tags.children[1].querySelectorAll("span.tags>a.tag>span.name");
                    el_attrib.tags = el_tags.children[2].querySelectorAll("span.tags>a.tag>span.name");
                    // el_attrib.artists = el_tags.children[3].querySelectorAll("span.tags>a.tag>span.name");
                    // el_attrib.groups = el_tags.children[4].querySelectorAll("span.tags>a.tag>span.name");
                    // el_attrib.languages = el_tags.children[5].querySelectorAll("span.tags>a.tag>span.name");
                    // el_attrib.categories = el_tags.children[6].querySelectorAll("span.tags>a.tag>span.name");
                    el_attrib.pages = el_tags.children[7].querySelectorAll("span.tags>a.tag>span.name");
                    // el_attrib.upload_date = el_tags.children[8].querySelectorAll("span.tags");
                    let g = {};
                    // g.title1 = el_title1 === null ? "" : el_title1.textContent;
                    // g.title2 = el_title2 === null ? "" : el_title2.textContent;
                    // g.parodies = domAttribToList(el_attrib.parodies);
                    // g.characters = domAttribToList(el_attrib.characters);
                    g.tags = domAttribToList(el_attrib.tags);
                    // g.artists = domAttribToList(el_attrib.artists);
                    // g.groups = domAttribToList(el_attrib.groups);
                    // g.languages = domAttribToList(el_attrib.languages);
                    // g.categories = domAttribToList(el_attrib.categories);
                    g.pages = domAttribToList(el_attrib.pages)[0];
                    window.localStorage.setItem("gallery_"+gallery_id,JSON.stringify(g));
                    let tooltip_text = g.tags.join(", ");
                    el_tooltip.innerHTML = "Tags: "+tooltip_text+"<br>Pages: "+g.pages;
                    autoCloseGalleryInfo();
                }
            };
            xhr.open("GET", gallery_url, true);
            xhr.send(null);
        };
        if (window.localStorage.getItem("gallery_"+gallery_id)===null) {
            get_gallery_counter = setTimeout(init_request,request_wait);
        } else {
            get_gallery_counter = setTimeout(showGalleryInfo,hover_wait);
        }

    };
}

function hideTooltip(el_gallery,el_tooltip){
    return function() {
        if (Array.from(document.querySelectorAll(":hover")).indexOf(el_gallery) === -1) {
            clearTimeout(get_gallery_counter);
            el_tooltip.style.visibility = "hidden";
        }
    };
}

function insertHoverAction() {
    let el_galleries = document.getElementsByClassName("gallery");
    for (let i = 0; i < el_galleries.length; i++) {
        const el_gallery = el_galleries[i];
        const gallery_url = el_gallery.querySelector('a.cover').href;
        const gallery_id = gallery_url.replace(window.origin,"").replace("/g/","").replace("/","");
        let el_tooltip = document.createElement("div");
        // let el_tooltip_a = document.createElement("a");
        // el_tooltip_a.href = gallery_href;
        el_tooltip.setAttribute("class", "z_tooltip");
        el_tooltip.style.visibility = "hidden";
        el_tooltip.style.width = "300px";
        el_tooltip.style.backgroundColor = "rgba(0,0,0,0.7)";
        el_tooltip.style.color = "#fff";
        el_tooltip.style.textAlign = "left";
        el_tooltip.style.padding = "5px";
        el_tooltip.style.position = "absolute";
        el_tooltip.style.zIndex = "99";
        // el_tooltip_a.appendChild(el_tooltip);
        const g = JSON.parse(window.localStorage.getItem("gallery_"+gallery_id));
        if (g !== null) {
            let tooltip_text = g.tags.join(", ");
            el_tooltip.innerHTML = "Tags: "+tooltip_text+"<br>Pages: "+g.pages;
        } else {
            el_tooltip.innerHTML = "Fetching info...";
        }

        el_gallery.insertBefore(el_tooltip, el_gallery.childNodes[0]);


        el_gallery.addEventListener("mouseover", getGalleryInfo(gallery_id,gallery_url,el_gallery,el_tooltip));
        el_gallery.addEventListener("mouseout", hideTooltip(el_gallery,el_tooltip));
    }
}

function main(){
    'use strict';
    if (document.querySelector(q_gallery_box) !== null || document.querySelector(q_gallery_suggest_box) !== null){
        setDefaultSettings();
        createMyContent();
        refreshGallery();
    }
    if (checkExist('ul.menu.left')) {
        for (let i = 0; i < z_tags.length; i++) {
            const z_tag = z_tags[i];
            const z_tag_obj = tags[z_tag];
            addTagAsNav(z_tag_obj.nick, z_tag_obj.url);
        }
    }
    insertHoverAction();
}
checkContent(main);