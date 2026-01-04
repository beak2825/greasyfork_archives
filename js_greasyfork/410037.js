// ==UserScript==
// @name         H-Nexus QoL
// @version      1.0.0
// @description  H-Nexus Quality-of-Life Tools
// @author       ryousukecchi
// @include      https://hentainexus.com/*
// @grant        none
// @namespace   https://greasyfork.org/users/292830
// @downloadURL https://update.greasyfork.org/scripts/410037/H-Nexus%20QoL.user.js
// @updateURL https://update.greasyfork.org/scripts/410037/H-Nexus%20QoL.meta.js
// ==/UserScript==
// jshint esversion: 6

// site-dependant
const q_main_box = "section.section";
const q_gallery_box = "section.section>.container>div.columns";
const q_title = ".card-header-title";
let tags = {
    "netorare" : {"nick":"N", "name":"Netorare"},
    "forced": {"nick":"F", "name":"Forced"},
    "orgasm_denial": {"nick":"OD", "name":"Orgasm Denial"},
    "cheating" : {"nick":"C", "name":"Cheating"},
};
let z_tags = ["netorare", "forced", "orgasm_denial", "cheating"];

// config
const request_wait = 1500;
const hover_wait = 0;
const auto_close_interval = 500;
const pages_style = {
    "marginLeft": 10,
    "marginTop": 10,
};

// global myvar
const z_ = "z_";
const q_ = "."+z_;
let q = {
    "button": {"button": q_+"btn_"},
    "input": {"input": q_+"in_"},
    "span": {"span": q_+"lbl_"},
    "div": {"div": q_+"cnt_"},
};
let v = {};
v.input = {
    "filter": false,
    "tag": true,
    "delete": false,
};
const q_z_tags = ".caption_z_tags";
const k_gallery = "g_";

const txt_filter = " Filter";
let count_tags = {};
let shown_el_list = [];
let hidden_el_list = [];
let deleted_el_list = [];
let count_loaded_page = 1;


// global timeout / interval
let get_gallery_counter;

// global element
let el_galleries;
let el_cnt_galleries;

function readBody(xhr) {
    let data;
    if (!xhr.responseType || xhr.responseType === "text") {
        data = xhr.responseText;
    } else if (xhr.responseType === "document") {
        data = xhr.responseXML;
    } else {
        data = xhr.response;
    }
    return data;
}
function titleCase(str, delimiter=" ", joiner=null) {
    const arr = str.split(delimiter);
    let arr_out = [];
    if (joiner===null) joiner=delimiter;
    for (let i = 0; i < arr.length; i++) {
        const s = arr[i];
        arr_out.push(s.charAt(0).toUpperCase() + s.slice(1).toLowerCase());
    }
    return arr_out.join(joiner);
}
function getUrlFromDom(dom) {
    return dom.querySelector("a").href;
}
function parseUrlToId(url) {
    return url.replace(window.origin,"").replace("/view/","");
}
function checkExist(query,qid=0) {
    let el_exist = false;
    let el = query;
    if (typeof query == "string") el = document.querySelectorAll(query)[qid];
    if (el != undefined){
        if (el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0) {
            el_exist = true;
        }
    }
    return el_exist;
}
function checkEl(query,qid=0,callback=false) {
    let old_top = -1;
    let old_left = -1;
    let el = query;
    if (typeof query == "string") el = document.querySelectorAll(query)[qid];
    let loop_checkEl = setInterval(function() {
        if (checkExist(query, qid)) {
            if (old_top==el.getBoundingClientRect().top && old_left==el.getBoundingClientRect().left) {
                clearInterval(loop_checkEl);
                if (typeof callback == "function") callback();
            } else {
                old_top = el.getBoundingClientRect().top;
                old_left = el.getBoundingClientRect().left;
            }
        }
    }, 200);
}
function checkContent(callback=false){
    let checkPageLoaded = setInterval(function() {
        if (document.querySelector(q_main_box) !== null){
            if (document.querySelector(q_main_box).getBoundingClientRect().width>0){
                clearInterval(checkPageLoaded);
                if (typeof callback == "function") callback();
            }
        }
    }, 300);
}

// Set Default
function setDefaultSettings(){
    for (let i = 0; i < z_tags.length; i++) {
        const z_tag = z_tags[i];
        if (window.localStorage.getItem(q.input.input.substr(1)+z_tag)===null){
            window.localStorage.setItem(q.input.input.substr(1)+z_tag,v.input.tag);
        }
    }
    for (let key in v.input) {
        if (v.input.hasOwnProperty(key)) {
            if (key == "tag") continue;
            if (window.localStorage.getItem(q.input[key].substr(1))===null){
                window.localStorage.setItem(q.input[key].substr(1),v.input[key]);
            }
        }
    }

}

// Create DOM
function createEl(type,name) {
    let el = document.createElement(type);
    q[type][name] = q[type][type]+name;
    el.setAttribute("class", q[type][name].substr(1));
    return el;
}
function createButton(name) {
    let el = createEl("button",name);
    el.padding = "2px 5px";
    el.innerHTML = titleCase(name,"_");
    return el;
}
function createCheckbox(name,k_v=false) {
    let el = createEl("input",name);
    el.type = "checkbox";
    el.checked = window.localStorage.getItem(q.input[name].substr(1))===null ? v.input[k_v] : window.localStorage.getItem(q.input[name].substr(1))=="true";
    return el;
}
function createLabel(name,txt,type="span") {
    let el = createEl(type,name);
    el.innerHTML = txt;
    return el;
}
function createListener(query,e,func) {
    for (let i = 0; i < document.querySelectorAll(query).length; i++) {
        const el = document.querySelectorAll(query)[i];
        el.addEventListener(e, func);
    }
}
function createMyContent(){
    let el_cnt_myContent = el_cnt_galleries.parentElement;
    
    let el_myContent = createEl("div","mycontent");
    el_myContent.style.margin = "0px";
    el_myContent.style.padding = "22px 0px";
    el_myContent.style["text-align"] = "left";
    el_myContent.style.display = "flex";
    el_myContent.style["flex-flow"] = "wrap";

    let el_cnt_module = createEl("div","module");
    el_cnt_module.style.width = "100%";
    
    let el_in_load = createEl("input","load");
    el_in_load.type = "number";
    el_in_load.style.width = "50px";
    el_in_load.value = 1;


    let el_btn_load = createButton("load");
    let el_btn_refresh = createButton("refresh");
    let el_in_delete = createCheckbox("delete");
    let el_btn_delete = createButton("delete");
    let el_btn_debug = createButton("debug");
    // el_btn_debug.style.display = "none";

    el_cnt_module.appendChild(el_in_load);
    el_cnt_module.appendChild(el_btn_load);
    el_cnt_module.appendChild(document.createTextNode(" | "));
    el_cnt_module.appendChild(el_in_delete);
    el_cnt_module.appendChild(document.createTextNode(" Auto-Delete "));
    el_cnt_module.appendChild(el_btn_delete);
    el_cnt_module.appendChild(document.createTextNode(" | "));
    el_cnt_module.appendChild(el_btn_refresh);
    el_cnt_module.appendChild(el_btn_debug);
    el_myContent.appendChild(el_cnt_module);

    let el_cnt_filter = createEl("div","filter");
    el_cnt_filter.style.width = "100%";
    
    let el_in_filter = createCheckbox("filter");
    let el_lbl_filter = createLabel("filter",txt_filter);

    el_cnt_filter.appendChild(el_in_filter);
    el_cnt_filter.appendChild(el_lbl_filter);
    el_myContent.appendChild(el_cnt_filter);
    
    for (let i = 0; i < z_tags.length; i++) {
        const z_tag = z_tags[i];
        const z_tag_obj = tags[z_tag];
        let el_cnt_tag = createEl("div","tag");
        el_cnt_tag.style.width = "150px";

        let el_lbl_tag = createLabel(z_tag," "+z_tag_obj.name);

        let el_in_tag = createCheckbox(z_tag,"tag");
        el_in_tag.name = q.input.input.substr(1)+z_tag;

        el_cnt_tag.appendChild(el_in_tag);
        el_cnt_tag.appendChild(el_lbl_tag);
        el_myContent.appendChild(el_cnt_tag);
    }
    
    el_cnt_myContent.insertBefore(el_myContent, el_cnt_galleries);
    let el_myContent2 = el_myContent.cloneNode(true);
    if (el_cnt_galleries.nextElementSibling===null) {
        el_cnt_myContent.appendChild(el_cnt_myContent);
    } else {
        el_cnt_myContent.insertBefore(el_myContent2, el_cnt_galleries.nextElementSibling);
    }

    syncValueOnChange(q.input.load);

    let click_el_btn_load = function(e) {
        // e.srcElement.disabled = true;
        // syncValue(q.button.load,e,"disabled");
        // getMoreGalleries(el_in_load.value,false,function(){e.srcElement.disabled=false;syncValue(q.button.load,e,"disabled");});
        getMoreGalleries(el_in_load.value);
    };
    createListener(q.button.load,"click",click_el_btn_load);

    let click_el_btn_delete = function(e) {
        if (confirm("delete?")) {
            deleteGalleries();
        }
    };
    createListener(q.button.delete,"click",click_el_btn_delete);

    let click_el_btn_refresh = function(e) {
        refreshGalleriesSize();
    };
    createListener(q.button.refresh,"click",click_el_btn_refresh);

    // debugging
    let click_el_btn_debug = function(e) {
        console.log(deleted_el_list);
        console.log(q);
    };
    createListener(q.button.debug,"click",click_el_btn_debug);

    let change_el_in_delete = function(e) {
        syncValue(q.input.delete,e,"checked");
        if (e.srcElement.checked){
            window.localStorage.setItem(q.input.delete.substr(1),true);
        } else {
            window.localStorage.setItem(q.input.delete.substr(1),false);
        }
    };
    createListener(q.input.delete,"click",change_el_in_delete);

    let change_el_in_filter = function(e) {
        syncValue(q.input.filter,e,"checked");
        if (e.srcElement.checked){
            window.localStorage.setItem(q.input.filter.substr(1),true);
        } else {
            window.localStorage.setItem(q.input.filter.substr(1),false);
        }
        refreshGalleries();
    };
    createListener(q.input.filter,"click",change_el_in_filter);

    let change_el_in_tag = function (e){
        syncValue("."+e.srcElement.classList[0],e,"checked");
        if (e.srcElement.checked){
            window.localStorage.setItem(e.srcElement.name,true);
        } else {
            window.localStorage.setItem(e.srcElement.name,false);
        }
        refreshGalleries();
    };
    for (let i = 0; i < z_tags.length; i++) {
        const z_tag = z_tags[i];
        createListener(q.input.input+z_tag,"change",change_el_in_tag);
    }
}

function bulkDisable(el_list, val) {
    for (let i = 0; i < el_list.length; i++) {
        let el = el_list[i];
        el.disabled = val;
    }
}

function getMoreGalleries(n,next_path=false,callback=false) {
    let list_disable1 = document.querySelectorAll(q.div.mycontent+">div>input");
    let list_disable2 = document.querySelectorAll(q.div.mycontent+">div>button");
    
    n = parseInt(n);
    if (n > 0) {
        bulkDisable(list_disable1,true);
        bulkDisable(list_disable2,true);
        if (next_path === false) {
            next_path = window.location.pathname;
            if (next_path == "/") next_path = "/page/" + count_loaded_page;
        }
        next_path = "/page/" + (parseInt(next_path.replace("/page/",""))+1);
        count_loaded_page += 1;
        
        let next_url = window.location.origin + next_path + window.location.search;

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                const r = readBody(xhr);
                const body_text = r.substring(r.indexOf("<body>")+6,r.indexOf("</body>"));
                const el_body = document.createElement("body");
                el_body.innerHTML = body_text;
                let r_el_cnt_galleries = el_body.querySelector(q_gallery_box);
                
                let r_el_galleries = r_el_cnt_galleries.children;
                modifyGalleries(r_el_galleries);
                let r_galleries_obj = getGalleriesUrl(r_el_galleries);

                let rGetMoreGalleries = function() {
                    n += -1;
                    getMoreGalleries(n,next_path,callback);
                };
                el_cnt_galleries.append(...r_el_cnt_galleries.childNodes);
                getGalleriesInfo(r_galleries_obj,rGetMoreGalleries);
            } 
        };
        xhr.open("GET", next_url, true);
        xhr.send(null);
    } else {
        bulkDisable(list_disable1,false);
        bulkDisable(list_disable2,false);
        refreshGalleriesSize();
        if (typeof callback == "function") callback();
    }
}

function syncValue(query,e,key="value") {
    for (let i = 0; i < document.querySelectorAll(query).length; i++) {
        const el = document.querySelectorAll(query)[i];
        el[key] = e.srcElement[key];
    }
}

function syncValueOnChange(query) {
    let sync_value = function(e) {
        syncValue(query,e);
    };
    for (let i = 0; i < document.querySelectorAll(query).length; i++) {
        const el = document.querySelectorAll(query)[i];
        el.addEventListener("change", sync_value);
    }
}

function deleteGallery(el_gallery, bypass=false) {
    if (bypass || getMarkedTags(el_gallery).length === 0) {
        pushUniqueOnly(el_gallery,deleted_el_list);
        el_gallery.parentElement.removeChild(el_gallery);
    }
}

function deleteGalleries(list_delete=false, callback=false) {
    if (list_delete === false) {
        list_delete = [];
        for (let i = 0; i < el_galleries.length; i++) {
            const el_gallery = el_galleries[i];
            if (getMarkedTags(el_gallery).length === 0) {
                list_delete.push(el_gallery);
            }
        }
        deleteGalleries(list_delete);
    } else {
        if (list_delete.length > 0) {
            deleteGallery(list_delete[0]);
            list_delete.shift();
            deleteGalleries(list_delete);
        } else {
            refreshGalleries();
            if (typeof callback == "function") callback();
        }
    }
}

function getGalleryUrl(el_gallery) {
    const gallery_url = getUrlFromDom(el_gallery);
    return {"id":gallery_url.replace(window.origin,"").replace("/view/",""),"url":gallery_url};
}

function getGalleriesUrl(g){
    let galleries_obj = [];
    for (let i = 0; i < g.length; i++) {
        const el_gallery = g[i];
        galleries_obj.push(getGalleryUrl(el_gallery));
    }
    return galleries_obj;
}

function pushUniqueOnly(e,l) {
    if (l.indexOf(e) === -1) l.push(e);
}

function getMarkedTags(el_gallery) {
    const gallery_url = getUrlFromDom(el_gallery);
    const gallery_id = parseUrlToId(gallery_url);
    const gallery_info = JSON.parse(window.localStorage.getItem(k_gallery+gallery_id));
    let marked_tags = [];

    for (let i = 0; i < gallery_info.tags.length; i++) {
        const gallery_tag = gallery_info.tags[i].replace(/ /g,"_");
        if (window.localStorage.getItem(q.input.input.substr(1)+gallery_tag)!==null) {
            if (count_tags[gallery_tag] === undefined) count_tags[gallery_tag] = [];
            pushUniqueOnly(el_gallery,count_tags[gallery_tag]);
            let el_lbl_tags = document.querySelectorAll(q.span[gallery_tag]);
            for (let j = 0; j < el_lbl_tags.length; j++) {
                const el_lbl_tag = el_lbl_tags[j];
                el_lbl_tag.innerHTML = " "+tags[gallery_tag].name+" ("+count_tags[gallery_tag].length+")";
            }
            if (window.localStorage.getItem(q.input.input.substr(1)+gallery_tag)=="true"){
                marked_tags.push(tags[gallery_tag].nick);
            }
        }
    }
    return marked_tags;
}

function refreshGalleryContent(el_gallery) {
    const gallery_url = getUrlFromDom(el_gallery);
    const gallery_id = parseUrlToId(gallery_url);
    const el_tooltip = el_gallery.querySelector(".z_tooltip");
    const el_page_number = el_gallery.querySelector(".z_pages");
    const gallery_info = JSON.parse(window.localStorage.getItem(k_gallery+gallery_id));

    if (gallery_info !== null) {
        el_page_number.style.visibility = "";
        let marked_tags = getMarkedTags(el_gallery);
        

        let el_card = el_gallery.querySelector(".card");
        if (window.localStorage.getItem(q.input.filter.substr(1))=="true") {
            if (marked_tags.length>0) {
                el_gallery.style.display = "";
                pushUniqueOnly(el_card,shown_el_list);
            } else {
                el_gallery.style.display = "none";
                pushUniqueOnly(el_card,hidden_el_list);
            }
        } else {
            el_gallery.style.display = "";
            pushUniqueOnly(el_card,shown_el_list);
        }

        el_page_number.innerHTML = gallery_info.p;
        if (marked_tags.length>0) {
            el_gallery.querySelector(q_z_tags).innerHTML = "{"+marked_tags.join(",")+"} ";
            if (window.localStorage.getItem(q.input.filter.substr(1))=="true") {
                el_gallery.style.border = "";
            } else {
                el_gallery.style.border = "5px solid red";
            }
        } else {
            el_gallery.querySelector(q_z_tags).innerHTML = "";
            el_gallery.style.border = "";
        }

        
        let tooltip_text = gallery_info.tags.join(", ");
        el_tooltip.innerHTML = "Tags: "+tooltip_text;

    } else {
        el_tooltip.innerHTML = "Fetching info...";
    }

    let el_lbl_filters = document.querySelectorAll(q.span.filter);
    for (let i = 0; i < el_lbl_filters.length; i++) {
        let el_lbl_filter = el_lbl_filters[i];
        el_lbl_filter.innerHTML = txt_filter + " | Shown: "+(shown_el_list.length.toString())+" | Hidden: "+(hidden_el_list.length.toString())+" | Deleted: "+(deleted_el_list.length.toString())+" | Page Loaded: "+(count_loaded_page.toString());
    }
}

function refreshGallerySize(el_gallery) {
    let init_refreshGallerySize = function() {
        const el_page_number = el_gallery.querySelector(".z_pages");
        if (el_gallery.style.border == "") {
            el_page_number.style.marginLeft = pages_style.marginLeft+"px";
            el_page_number.style.marginTop = (el_gallery.offsetHeight-el_page_number.offsetHeight-pages_style.marginTop)+"px";
        } else {
            el_page_number.style.marginLeft = pages_style.marginLeft-5+"px";
            el_page_number.style.marginTop = (el_gallery.offsetHeight-el_page_number.offsetHeight-pages_style.marginTop-5)+"px";
        }
    };
    checkEl(el_gallery,0,init_refreshGallerySize);
    
    // const el_page_number = el_gallery.querySelector(".z_pages");
    // if (el_gallery.style.border == "") {
    //     el_page_number.style.marginLeft = pages_style.marginLeft+"px";
    //     el_page_number.style.marginTop = (el_gallery.offsetHeight-el_page_number.offsetHeight-pages_style.marginTop)+"px";
    // } else {
    //     el_page_number.style.marginLeft = pages_style.marginLeft-5+"px";
    //     el_page_number.style.marginTop = (el_gallery.offsetHeight-el_page_number.offsetHeight-pages_style.marginTop-5)+"px";
    // }
}

function refreshGallery(gallery_id) {
    let el_list_gallery = el_cnt_galleries.querySelectorAll("a[href='/view/"+gallery_id+"']");

    for (let i = 0; i < el_list_gallery.length; i++) {
        const el_gallery = el_list_gallery[i].parentElement;
        refreshGalleryContent(el_gallery);
        refreshGallerySize(el_gallery);
    }
}

function getGalleriesInfo(g_obj, callback=false) {
    if (g_obj.length > 0) {
        if (window.localStorage.getItem(k_gallery+g_obj[0].id)===null) {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    const r = readBody(xhr);
                    const head_text = r.substring(r.indexOf("<head>")+6,r.indexOf("</head>"));
                    const el_head = document.createElement("head");
                    el_head.innerHTML = head_text;
                    let g = {};
                    g.tags = el_head.querySelector("meta[property='og:description']").content.split(", ");
                    let temp = r.indexOf("Pages");
                    g.p = r.substring(temp,r.indexOf("</tr>",temp)).replace(/\s/g,"").replace("Pages</td><td>","").replace("</td>","");
                    window.localStorage.setItem(k_gallery+g_obj[0].id,JSON.stringify(g));
                    refreshGallery(g_obj[0].id);
                    g_obj.shift();
                    getGalleriesInfo(g_obj,callback);
                } 
            };
            xhr.open("GET", g_obj[0].url, true);
            xhr.send(null);
        } else {
            refreshGallery(g_obj[0].id);
            g_obj.shift();
            getGalleriesInfo(g_obj,callback);
        }
    } else {
        if (window.localStorage.getItem(q.input.delete.substr(1)) == "true") deleteGalleries();
        refreshGalleriesSize();
        if (typeof callback == "function") callback();
    }
}

function refreshGalleriesSize() {
    for (let i = 0; i < el_galleries.length; i++) {
        const el_gallery = el_galleries[i];
        refreshGallerySize(el_gallery);
    }
}

function refreshGalleries() {
    shown_el_list = [];
    hidden_el_list = [];
    for (let i = 0; i < el_galleries.length; i++) {
        const el_gallery = el_galleries[i];
        const gallery_url = getUrlFromDom(el_gallery);
        const gallery_id = parseUrlToId(gallery_url);
        refreshGallery(gallery_id);
    }
    refreshGalleriesSize();
}

function showTooltip(gallery_id, gallery_url, el_gallery, el_tooltip) {
    return function() {
        const offsetTop = el_gallery.parentElement.parentElement.offsetTop + el_gallery.offsetTop;
        const offsetLeft = el_gallery.parentElement.parentElement.offsetLeft + el_gallery.offsetLeft;
        el_gallery.onmousemove = function(e){
            let margin_mouse = 5;
            let marginLeft;
            let marginTop;
            if (document.documentElement.clientWidth - e.clientX >= e.clientX) {
                marginLeft = e.pageX-offsetLeft+margin_mouse;
            } else {
                marginLeft = e.pageX-offsetLeft-margin_mouse-el_tooltip.clientWidth;
            }
            if (document.documentElement.clientHeight - e.clientY >= e.clientY) {
                marginTop = e.pageY-offsetTop+margin_mouse;
            } else {
                marginTop = e.pageY-offsetTop-margin_mouse-el_tooltip.clientHeight;
            }
            el_tooltip.style.marginTop = marginTop+"px";
            el_tooltip.style.marginLeft = marginLeft+"px";
            // let allow_debug = true;
            // let printf = console.log;
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
            // printf("el_gallery.offsetLeft, el_gallery.offsetTop");
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
        };


        let autoCloseGalleryInfo = function() {
            let auto_close_counter = setInterval(function() {
                if (Array.from(document.querySelectorAll(":hover")).indexOf(el_gallery) === -1) {
                    clearInterval(auto_close_counter);
                    el_tooltip.style.visibility = "hidden";
                }
            }, auto_close_interval);

        };
        let showGalleryInfo = function () {
            el_tooltip.style.visibility = "visible";
            autoCloseGalleryInfo();
        };
        let init_request = function() {
            showGalleryInfo();
            getGalleriesInfo([{"id": gallery_id, "url": gallery_url}]);

        };
        if (window.localStorage.getItem(k_gallery+gallery_id)===null) {
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

function modifyGallery(el_gallery) {
    const gallery_url = getUrlFromDom(el_gallery);
    const gallery_id = parseUrlToId(gallery_url);

    // customize existing
    el_gallery.style.padding = "0px";

    // create DOM for title
    let span_caption_z_tags = document.createElement("span");
    span_caption_z_tags.style.color = "red";
    span_caption_z_tags.setAttribute("class", q_z_tags.substr(1));

    let el_title = el_gallery.querySelector(q_title);
    el_title.insertBefore(span_caption_z_tags, el_title.childNodes[0]);

    // create DOM for tooltip
    let el_tooltip = document.createElement("div");
    el_tooltip.style.visibility = "hidden";
    el_tooltip.setAttribute("class", "z_tooltip");
    el_tooltip.style.width = "300px";
    el_tooltip.style.backgroundColor = "rgba(0,0,0,0.7)";
    el_tooltip.style.color = "#fff";
    el_tooltip.style.textAlign = "left";
    el_tooltip.style.padding = "5px";
    el_tooltip.style.position = "absolute";
    el_tooltip.style.zIndex = "99";

    // create page number
    let el_page_number = document.createElement("div");
    el_page_number.setAttribute("class", "z_pages");
    el_page_number.style.backgroundColor = "rgba(0,0,0,0.7)";
    el_page_number.style.color = "#fff";
    el_page_number.style.textAlign = "center";
    el_page_number.style.position = "absolute";
    el_page_number.style.zIndex = "90";
    el_page_number.style.visibility = "hidden";
    el_page_number.style.borderRadius = "50%";
    // el_page_number.style.padding = "1px 1px";
    el_page_number.style.width = "25px";
    el_page_number.style.height = "25px";
    el_page_number.style.fontWeight = "bold";

    let el_page_number_parent = el_gallery.querySelector("a");
    el_page_number_parent.insertBefore(el_page_number, el_page_number_parent.childNodes[0]);
    el_gallery.insertBefore(el_tooltip, el_gallery.childNodes[0]);
    el_gallery.addEventListener("mouseover", showTooltip(gallery_id,gallery_url,el_gallery,el_tooltip));
    el_gallery.addEventListener("mouseout", hideTooltip(el_gallery,el_tooltip));
}

function modifyGalleries(el_list_gallery) {
    for (let i = 0; i < el_list_gallery.length; i++) {
        const el_gallery = el_list_gallery[i];
        modifyGallery(el_gallery);
    }
}

function resizeListener() {
    window.addEventListener("resize", refreshGalleriesSize); 
}

function main(){
    "use strict";
    if (document.querySelector(q_gallery_box) !== null){
        el_cnt_galleries = document.querySelector(q_gallery_box);
        el_galleries = el_cnt_galleries.children;
        createMyContent();
        setDefaultSettings();
        modifyGalleries(el_galleries);
        let galleries_obj = getGalleriesUrl(el_galleries);
        getGalleriesInfo(galleries_obj,resizeListener);
    }
}
checkContent(main);