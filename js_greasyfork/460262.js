// ==UserScript==
// @name         N-H and H-Nexus QoL
// @version      1.0.8
// @description  N-H and H-Nexus Quality-of-Life Tools
// @author       Naieth
// @match        https://nhentai.net/*
// @match        https://hentainexus.com/*
// @grant        none
// @namespace    https://greasyfork.org/users/801832
// @icon         https://i.imgur.com/1lihxY2.png
// @downloadURL https://update.greasyfork.org/scripts/460262/N-H%20and%20H-Nexus%20QoL.user.js
// @updateURL https://update.greasyfork.org/scripts/460262/N-H%20and%20H-Nexus%20QoL.meta.js
// ==/UserScript==
// jshint esversion: 6


/*
pending feature
- filter by language (nh only)
- check/uncheck all filter
- improve getmoregallery & auto delete by getting tag first before loading el & image
- styling tooltip (low priority)
- shortcut nav
- enlarge image when hover
known feature
- store settings in hash
- update sessionStorage when visit g
*/

const b = {
    "filter": false,
    "delete": false,
    "z_tag": true,
    "g_tag": false,
};

let nh = {
    "q": {
        "cnt_galleries": ".container.index-container:not(.index-popular)",
        "cnt_galleries_pop": ".container.index-container.index-popular",
        "cnt_galleries_suggest": "#related-container",
        "cnt_galleries_fav": "#favcontainer",
        "gallery": ".gallery",
        "current_page": ".pagination>.current",
        "last_page": ".pagination>.last",
        "title": ".caption",
        "img_gallery": ".lazyload",
    },
    "tags": {
        "netorare" : {"nick":"N", "name":"Netorare"},
        "rape": {"nick":"R", "name":"Rape"},
        "blackmail": {"nick":"B", "name":"Blackmail"},
        "cheating" : {"nick":"C", "name":"Cheating"},
    },
    "z_tags": ["netorare", "rape", "blackmail", "cheating"],
    "s": {
        "pages_style": {
            "marginLeft": 10,
            "marginTop": 10,
        },
    },
    "f": {
        "getCurrentPage": nhGetPage,
        "getLastPage": nhGetPage,
        "getUrlFromDom": getUrlFromDom,
        "parseUrlToId": nhParseUrlToId,
        "parseGalleryHtml": nhParseGalleryHtml,
        "getListElGalleryById": nhGetListElGalleryById,
        "getGalleryOffset": nhGetGalleryOffset,
        "getNextPageUrl": nhGetNextPageUrl,
        "fixThumbnail": nhFixThumbnail,
        "sortLang": nhSortLang,
    },
};
let hn = {
    "q": {
        "cnt_galleries": "section.section>.container>div.columns",
        "gallery": ".column",
        "current_page": ".pagination-list>li>a[aria-current='page']",
        "last_page": ".pagination-list>li:nth-last-child(1)>a",
        "title": ".card-header-title",
        "img_gallery": ".card-image>.image>img",
    },
    "tags": {
        "netorare" : {"nick":"N", "name":"Netorare"},
        "forced": {"nick":"F", "name":"Forced"},
        "orgasm_denial": {"nick":"OD", "name":"Orgasm Denial"},
        "cheating" : {"nick":"C", "name":"Cheating"},
    },
    "z_tags": ["netorare", "forced", "orgasm_denial", "cheating"],
    "s": {
        "pages_style": {
            "marginLeft": 10,
            "marginTop": 10,
        },
    },
    "f": {
        "getCurrentPage": hnGetPage,
        "getLastPage": hnGetPage,
        "getUrlFromDom": getUrlFromDom,
        "parseUrlToId": hnParseUrlToId,
        "parseGalleryHtml": hnParseGalleryHtml,
        "getListElGalleryById": hnGetListElGalleryById,
        "getGalleryOffset": hnGetGalleryOffset,
        "getNextPageUrl": hnGetNextPageUrl,
        "fixThumbnail": hnFixThumbnail,
        "sortLang": hnSortLang,
    }
};

const request_wait = 1500;
const hover_wait = 0;
const auto_close_interval = 500;
const txt_filter = " Filter";
const k_gallery = "g_";
let get_gallery_counter;

let toString = Object.prototype.toString;
function deepCopy(obj) {
    var rv;

    switch (typeof obj) {
        case "object":
            if (obj === null) {
                /* null => null */
                rv = null;
            } else {
                switch (toString.call(obj)) {
                    case "[object Array]":
                        /* It's an array, create a new array with */
                        /* deep copies of the entries */
                        rv = obj.map(deepCopy);
                        break;
                    case "[object Date]":
                        /* Clone the date */
                        rv = new Date(obj);
                        break;
                    case "[object RegExp]":
                        /* Clone the RegExp */
                        rv = new RegExp(obj);
                        break;
                    /* ...probably a few others */
                    default:
                        /* Some other kind of object, deep-copy its */
                        /* properties into a new object */
                        rv = Object.keys(obj).reduce(function(prev, key) {
                            prev[key] = deepCopy(obj[key]);
                            return prev;
                        }, {});
                        break;
                }
            }
            break;
        default:
            /* It's a primitive, copy via assignment */
            rv = obj;
            break;
    }
    return rv;
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
function checkEl(query,qid=0,bypass_load=false,callback=false,p=false) {
    let old_top = -1;
    let old_left = -1;
    let el = query;
    if (typeof query == "string") el = document.querySelectorAll(query)[qid];
    let loop_checkEl = setInterval(function() {
        if (checkExist(query, qid)) {
            if (bypass_load || (old_top==el.getBoundingClientRect().top && old_left==el.getBoundingClientRect().left)) {
                clearInterval(loop_checkEl);
                if (typeof callback == "function") callback();
            } else {
                old_top = el.getBoundingClientRect().top;
                old_left = el.getBoundingClientRect().left;
            }
        }
    }, 200);
}
function parseStr(type, str, delimiter="_", joiner=null) {
    let str_out = "";
    if (type == "var") {
        str_out = str.replace(/ /g, "_").toLowerCase();
    } else {
        const arr = str.split(delimiter);
        let arr_out = [];
        if (joiner===null) joiner=delimiter;
        for (let i = 0; i < arr.length; i++) {
            const s = arr[i];
            let s_temp;
            if (type=="title") {
                s_temp = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
            } else if (type=="nick") {
                s_temp = s.charAt(0).toUpperCase();
            }
            arr_out.push(s_temp);
        }
        str_out = arr_out.join(joiner);
    }
    return str_out;
}
function isEntryUnique(e,l) {
    return l.indexOf(e) === -1;

}
function pushUniqueOnly(e,l) {
    if (isEntryUnique(e,l)) l.push(e);
    return l;
}
function syncValue(query,e,key="value") {
    for (let i = 0; i < document.querySelectorAll(query).length; i++) {
        const el = document.querySelectorAll(query)[i];
        el[key] = e.srcElement[key];
    }
}
function syncValueOnChange(query) {
    let sync_value = (e) => {
        syncValue(query,e);
    };
    for (let i = 0; i < document.querySelectorAll(query).length; i++) {
        const el = document.querySelectorAll(query)[i];
        el.addEventListener("change", sync_value);
    }
}
function nhGetPage(query) {
    let page;
    let el_page = document.querySelector(query);
    if (el_page === null) {
        page = 0;
    } else {
        page = parseInt(el_page.href.substring(el_page.href.indexOf("page=")+5));
    }
    return page;
}
function hnGetPage(query) {
    let page;
    let el_page = document.querySelector(query);
    if (el_page === null) {
        page = 0;
    } else {
        page = parseInt(el_page.innerText);
    }
    return page;
}
function nhGetNextPageUrl(count_loaded_page) {
    let current_page = nhGetPage(nh.q.current_page);
    let el_current_page = document.querySelector(nh.q.current_page);
    let url_txt = el_current_page.href.substring(0,el_current_page.href.indexOf("page=")+5);
    return url_txt + (current_page + count_loaded_page).toString();
}
function hnGetNextPageUrl(count_loaded_page) {
    let current_page = hnGetPage(hn.q.current_page);
    let el_last_page = document.querySelector(hn.q.last_page);
    let url_txt = el_last_page.href.substring(0,el_last_page.href.indexOf("/page/")+6);
    return url_txt + (current_page + count_loaded_page).toString() + window.location.search;
}
function getUrlFromDom(dom) {
    return dom.querySelector("a").href;
}
function nhParseUrlToId(url) {
    return url.replace(window.origin,"").replace("/g/","").replace(/\//g,"");
}
function hnParseUrlToId(url) {
    return url.replace(window.origin,"").replace("/view/","");
}
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
function nhParseGalleryInfoFromDom(el_body) {
    function domAttribToList(el_attribs, type=false) {
        let list_attrib = [];
        for (let i = 0; i < el_attribs.length; i++) {
            const el_attrib = el_attribs[i];
            if (type!=false) {
                el_attrib.textContent = parseStr(type, el_attrib.textContent);
            }
            list_attrib.push(el_attrib.textContent);
        }
        return list_attrib;
    }
    const el_cnt_info = el_body.querySelector("#info");
    const el_tags = el_cnt_info.querySelector("section#tags");
    let el_attrib = {};
    el_attrib.tags = el_tags.children[2].querySelectorAll("span.tags>a.tag>span.name");
    el_attrib.pages = el_tags.children[7].querySelectorAll("span.tags>a.tag>span.name");
    let g = {};
    g.tags = domAttribToList(el_attrib.tags, "var");
    g.tags.sort();
    g.p = domAttribToList(el_attrib.pages)[0];
    let el_fav = el_cnt_info.querySelector("button#favorite>span");
    g.fav = el_fav.innerHTML === "Unfavorite";
    return g;
}
function nhParseGalleryHtml(xhr) {
    const r = readBody(xhr);
    const body_text = r.substring(r.indexOf('<body>')+6,r.indexOf('</body>'));
    const el_body = document.createElement('div');
    el_body.innerHTML = body_text;
    return nhParseGalleryInfoFromDom(el_body);
}
function hnParseGalleryInfoFromDom(dom) {
    let el_head = dom.querySelector("head");
    let el_body = dom.querySelector("body");
    let r = el_body.innerHTML;
    let g = {};
    g.tags = el_head.querySelector("meta[property='og:description']").content.split(", ").join(";");
    g.tags = parseStr("var", g.tags).split(";");
    g.tags.sort();
    let temp = r.indexOf("Pages");
    g.p = r.substring(temp,r.indexOf("</tr>",temp)).replace(/\s/g,"").replace("Pages</td><td>","").replace("</td>","");
    let el_fav = el_body.querySelector(".star-button>.button-label");
    g.fav = el_fav.innerHTML === "Favorited";
    return g;
}
function hnParseGalleryHtml(xhr) {
    const r = readBody(xhr);
    const html_text = r.substring(r.indexOf("<head>"),r.indexOf("</html>"));
    const el_html = document.createElement("html");
    el_html.innerHTML = html_text;
    return hnParseGalleryInfoFromDom(el_html);
}
function nhGetListElGalleryById(gallery_id,el_cnt_galleries) {
    let list_el_gallery = el_cnt_galleries.querySelectorAll("a[href='/g/"+gallery_id+"/']");
    return list_el_gallery;
}
function hnGetListElGalleryById(gallery_id,el_cnt_galleries) {
    let list_el_gallery = el_cnt_galleries.querySelectorAll("a[href='/view/"+gallery_id+"']");
    return list_el_gallery;
}
function nhGetGalleryOffset(el_gallery) {
    let offset = {
        "top": el_gallery.offsetTop,
        "left": el_gallery.offsetLeft,
    };
    return offset;
}
function hnGetGalleryOffset(el_gallery) {
    let offset = {
        "top": el_gallery.parentElement.parentElement.offsetTop + el_gallery.offsetTop,
        "left": el_gallery.parentElement.parentElement.offsetLeft + el_gallery.offsetLeft,
    };
    return offset;
}
function nhFixThumbnail(el_list) {
    let net_el_list = [];
    for (let i = 0; i < el_list.length; i++) {
        let el = el_list[i];
        let el_img = el.querySelector("img.lazyload");
        el_img.src = el_img.attributes["data-src"].value;
        net_el_list.push(el);
    }
    return net_el_list;
}
function hnFixThumbnail(el_list) {
    return el_list;
}
function nhSortLang(el_g_lang, el_g) {
    if (el_g.querySelector(".caption").innerText.indexOf("[English]")>=0) {
        el_g_lang.en.appendChild(el_g);
    } else if (el_g.querySelector(".caption").innerText.indexOf("[Chinese]")>=0) {
        el_g_lang.cn.appendChild(el_g);
    } else {
        el_g_lang.jp.appendChild(el_g);
    }
}
function hnSortLang(el_g_lang, el_g) {
}

class cDOM {
    constructor(prefix,d) {
        this.prefix = prefix;
        this.el = {
            "cnt":{}
        };
        this.q = d.q;
        this.z_ = this.prefix;
        this.q_ = "."+this.z_;
        this.q.button = {"button": this.q_+"btn_"};
        this.q.input = {"input": this.q_+"in_"};
        this.q.span = {"span": this.q_+"lbl_"};
        this.q.div = {"div": this.q_+"cnt_"};
        this.q.mycontent = "mycontent";
    }
    createEl(type,name) {
        let el = document.createElement(type);
        this.q[type][name] = this.q[type][type]+name;
        el.setAttribute("class", this.q[type][name].substr(1));
        return el;
    }
    createButton(name) {
        let el = this.createEl("button",name);
        el.padding = "2px 5px";
        el.innerHTML = parseStr("title", name, "_");
        return el;
    }
    createCheckbox(name,check=false) {
        let el = this.createEl("input",name);
        el.type = "checkbox";
        el.name = this.q.input.input.substr(1)+name;
        if (this.v.hasOwnProperty(el.name)) {
            check = this.v[el.name];
        }
        el.checked = check;
        this.v[el.name] = check;
        return el;
    }
    createLabel(name,txt=false,type="span") {
        let el = this.createEl(type,name);
        if (typeof txt == "string") el.innerHTML = txt;
        return el;
    }
    createListener(query,e,func) {
        for (let i = 0; i < document.querySelectorAll(query).length; i++) {
            const el = document.querySelectorAll(query)[i];
            el.addEventListener(e, func);
        }
    }
}

class cGallery extends cDOM{
    constructor(prefix,d,is_side_gallery=false) {
        
        if (is_side_gallery) {
            d.q.last_page = false;
            d.q.current_page = false;
        }
        super(prefix,d);
        this.is_side_gallery = is_side_gallery;
        this.v = {};
        this.count_loaded_page = 1;
        
        if (!is_side_gallery) {
            if (window.location.hash != "") {
                if (window.location.hash.substring(0,2) == "#{" && window.location.hash.slice(-1) == "}") {
                    let a = JSON.parse(decodeURI(window.location.hash).substring(1));
                    this.v = a.v;
                    this.last_loaded_page = a.count_loaded_page;
                }
            }
        }
        this.f = d.f;
        this.s = d.s;
        this.z_tags = d.z_tags;
        this.tags = d.tags;
        this.count_tags = {};
        this.shown_el_list = [];
        this.hidden_el_list = [];
        this.deleted_el_list = [];
        this.changeFilter = (e) => {
            this.updateCheckBox(e);
            this.refreshGalleries();
            this.updateHash();
        };
        this.init();
    }
    init() {
        console.log("init: " + this.prefix);
        this.updateElGalleries();
        this.createMyContent();
        this.modifyGalleries(this.el_galleries);
        let galleries_obj = this.getGalleriesUrl(this.el_galleries);
        this.getGalleriesInfo(galleries_obj);
        this.updateHash();
        if (!this.is_side_gallery && this.last_loaded_page > 1) {
            this.getMoreGalleries(this.last_loaded_page - 1);
        }
    }
    updateElGalleries() {
        this.el_cnt_galleries = document.querySelector(this.q.cnt_galleries);
        this.el_galleries = this.el_cnt_galleries.querySelectorAll(this.q.gallery);
    }
    createMyContent() {
        let el_cnt_mycontent = this.el_cnt_galleries.parentElement;

        let el_mycontent = this.createEl("div",this.q.mycontent);
        el_mycontent.style.width = this.el_cnt_galleries.offsetWidth+"px";
        el_mycontent.style.margin = "0px auto";
        el_mycontent.style.padding = "22px 5px";
        el_mycontent.style["text-align"] = "left";
        el_mycontent.style.display = "flex";
        el_mycontent.style["flex-flow"] = "wrap";

        let el_cnt_module = this.createEl("div","module");
        el_cnt_module.style.width = "100%";

        this.current_page = this.f.getCurrentPage(this.q.current_page);
        this.last_page = this.f.getLastPage(this.q.last_page);

        let el_in_load = this.createEl("input","load");
        el_in_load.name = this.q.input.load.substr(1);
        el_in_load.type = "number";
        el_in_load.style.width = "50px";
        el_in_load.min = "0";
        this.updateInputLoad(el_in_load);

        let el_btn_load = this.createButton("load");
        el_btn_load.name = this.q.button.load.substr(1);
        this.updateButtonLoad(el_btn_load);

        let el_btn_refresh = this.createButton("refresh");
        let el_in_delete = this.createCheckbox("delete", b.delete);
        let el_btn_delete = this.createButton("delete");
        let el_btn_debug = this.createButton("debug");
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
        el_mycontent.appendChild(el_cnt_module);

        let el_cnt_filter = this.createEl("div","filter");
        el_cnt_filter.style.width = "100%";

        let el_in_filter = this.createCheckbox("filter", b.filter);
        let el_lbl_filter = this.createLabel("filter",txt_filter);

        el_cnt_filter.appendChild(el_in_filter);
        el_cnt_filter.appendChild(el_lbl_filter);
        el_mycontent.appendChild(el_cnt_filter);

        let el_cnt_z_tags = this.createEl("div","z_tags");
        el_cnt_z_tags.style.width = "100%";
        el_cnt_z_tags.style.display = "flex";

        for (let i = 0; i < this.z_tags.length; i++) {
            const z_tag = this.z_tags[i];
            const z_tag_obj = this.tags[z_tag];
            let el_cnt_z_tag = this.createEl("div","z_tag");
            el_cnt_z_tag.style.width = "150px";
            let el_lbl_tag = this.createLabel(z_tag," "+z_tag_obj.name);
            el_lbl_tag.innerHTML += " (0)";

            let el_in_tag = this.createCheckbox(z_tag, b.z_tag);

            el_cnt_z_tag.appendChild(el_in_tag);
            el_cnt_z_tag.appendChild(el_lbl_tag);
            el_cnt_z_tags.appendChild(el_cnt_z_tag);
        }
        el_mycontent.appendChild(el_cnt_z_tags);
        
        let el_cnt_g_tags = this.createEl("div","g_tags");
        el_cnt_g_tags.style.width = "100%";
        el_cnt_g_tags.style.display = "flex";
        el_cnt_g_tags.style.flexWrap = "wrap";
        el_mycontent.appendChild(el_cnt_g_tags);
        
        this.el.cnt.g_lang = {};
        this.el.cnt.g_lang.en = this.createEl("div", "g_en");
        this.el.cnt.g_lang.jp = this.createEl("div", "g_jp");
        this.el.cnt.g_lang.cn = this.createEl("div", "g_cn");
        this.el_cnt_galleries.insertBefore(this.el.cnt.g_lang.cn, this.el_cnt_galleries.firstChild);
        this.el_cnt_galleries.insertBefore(this.el.cnt.g_lang.jp, this.el_cnt_galleries.firstChild);
        this.el_cnt_galleries.insertBefore(this.el.cnt.g_lang.en, this.el_cnt_galleries.firstChild);

        el_cnt_mycontent.insertBefore(el_mycontent, this.el_cnt_galleries);
        let el_mycontent2 = el_mycontent.cloneNode(true);
        if (this.el_cnt_galleries.nextElementSibling===null) {
            el_cnt_mycontent.appendChild(el_mycontent2);
        } else {
            el_cnt_mycontent.insertBefore(el_mycontent2, this.el_cnt_galleries.nextElementSibling);
        }

        syncValueOnChange(this.q.input.load);

        let click_el_btn_load = (e) => {
            this.getMoreGalleries(el_in_load.value);
        };
        this.createListener(this.q.button.load,"click",click_el_btn_load);

        let click_el_btn_delete = (e) => {
            if (confirm("delete?")) {
                this.deleteGalleries();
            }
        };
        this.createListener(this.q.button.delete,"click",click_el_btn_delete);

        let click_el_btn_refresh = (e) => {
            this.refreshGalleriesSize();
        };
        this.createListener(this.q.button.refresh,"click",click_el_btn_refresh);

        let click_el_btn_debug = (e) => {
            console.log(e);
            console.log(this);
        };
        this.createListener(this.q.button.debug,"click",click_el_btn_debug);

        let change_el_in_delete = (e) => {
            this.updateCheckBox(e);
        };
        this.createListener(this.q.input.delete,"click",change_el_in_delete);

        this.createListener(this.q.input.filter,"click",this.changeFilter);
        
        
        for (let i = 0; i < this.z_tags.length; i++) {
            const z_tag = this.z_tags[i];
            this.createListener(this.q.input.input+z_tag,"change",this.changeFilter);
        }
    }
    updateCheckBox(e) {
        syncValue("."+e.srcElement.classList[0],e,"checked");
        this.v[e.srcElement.name] = e.srcElement.checked;
    }
    updateButtonLoad(el) {
        this.unloaded_page = (this.last_page - this.current_page + 1 - this.count_loaded_page);
        el.disabled = this.unloaded_page===0;
    }
    updateInputLoad(el) {
        this.unloaded_page = (this.last_page - this.current_page + 1 - this.count_loaded_page);
        el.max = (this.unloaded_page).toString();
        el.value = this.unloaded_page > 0 ? "1" : "0";
        el.disabled = this.unloaded_page===0;
    }
    modifyGalleries(el_list_gallery) {
        for (let i = 0; i < el_list_gallery.length; i++) {
            const el_gallery = el_list_gallery[i];
            this.modifyGallery(el_gallery);
        }
    }
    modifyGallery(el_gallery) {
        const gallery_url = this.f.getUrlFromDom(el_gallery);
        const gallery_id = this.f.parseUrlToId(gallery_url);

        /* this.f.sortLang(this.el.cnt.g_lang, el_gallery); */

        /* customize existing */
        el_gallery.style.padding = "0px";

        /* create DOM for title */
        let el_lbl_title = this.createLabel("title");
        el_lbl_title.style.color = "red";

        let el_title = el_gallery.querySelector(this.q.title);
        el_title.insertBefore(el_lbl_title, el_title.firstChild);

        /* create DOM for tooltip */
        let el_cnt_tooltip = this.createEl("div","tooltip");
        el_cnt_tooltip.style.display = "none";
        el_cnt_tooltip.style.width = "300px";
        el_cnt_tooltip.style.backgroundColor = "rgba(0,0,0,0.7)";
        el_cnt_tooltip.style.color = "#fff";
        el_cnt_tooltip.style.textAlign = "left";
        el_cnt_tooltip.style.padding = "5px";
        el_cnt_tooltip.style.position = "absolute";
        el_cnt_tooltip.style.zIndex = "99";

        /* create DOM for page number */
        let el_cnt_page_number = this.createEl("div","page_number");
        el_cnt_page_number.style.backgroundColor = "rgba(0,0,0,0.7)";
        el_cnt_page_number.style.color = "#fff";
        el_cnt_page_number.style.display = "flex";
        el_cnt_page_number.style.justifyContent = "center";
        el_cnt_page_number.style.alignItems = "center";
        el_cnt_page_number.style.position = "absolute";
        el_cnt_page_number.style.zIndex = "90";
        el_cnt_page_number.style.visibility = "hidden";
        el_cnt_page_number.style.borderRadius = "50%";
        el_cnt_page_number.style.width = "30px";
        el_cnt_page_number.style.height = "30px";
        el_cnt_page_number.style.fontWeight = "bold";

        let el_cnt_page_number_parent = el_gallery.querySelector("a");
        el_cnt_page_number_parent.insertBefore(el_cnt_page_number, el_cnt_page_number_parent.firstChild);

        /* create DOM for fav */
        let el_cnt_fav = this.createEl("div","fav");
        el_cnt_fav.style.visibility = "hidden";
        el_cnt_fav.style.color = "rgba(255,0,0,0.8)";
        el_cnt_fav.style.display = "flex";
        el_cnt_fav.style.justifyContent = "center";
        el_cnt_fav.style.alignItems = "center";
        el_cnt_fav.style.position = "absolute";
        el_cnt_fav.style.zIndex = "90";
        el_cnt_fav.style.borderRadius = "50%";
        el_cnt_fav.style.width = "40px";
        el_cnt_fav.style.height = "40px";
        el_cnt_fav.style.fontWeight = "bold";
        el_cnt_fav.style.fontSize = "30px";
        el_cnt_fav.style.fontFamily = "Lucida Sans Unicode";
        el_cnt_fav.innerHTML = "&#9829";

        let el_img_gallery_parent = el_gallery.querySelector(this.q.img_gallery).parentElement;
        el_img_gallery_parent.insertBefore(el_cnt_fav, el_img_gallery_parent.firstChild);

        el_gallery.insertBefore(el_cnt_tooltip, el_gallery.firstChild);
        el_gallery.addEventListener("mouseover", this.showTooltip(gallery_id,gallery_url,el_gallery,el_cnt_tooltip));
        el_gallery.addEventListener("mouseout", this.hideTooltip(el_gallery,el_cnt_tooltip));
    }
    showTooltip(gallery_id, gallery_url, el_gallery, el_cnt_tooltip) {
        return () => {
            const offset = this.f.getGalleryOffset(el_gallery);
            const gallery_info = JSON.parse(window.sessionStorage.getItem(k_gallery+gallery_id));
            el_gallery.onmousemove = (e) => {
                let margin_mouse = 5;
                let marginLeft;
                let marginTop;
                if (document.documentElement.clientWidth - e.clientX >= e.clientX) {
                    marginLeft = e.pageX - offset.left + margin_mouse;
                } else {
                    marginLeft = e.pageX - offset.left - margin_mouse - el_cnt_tooltip.clientWidth;
                }
                if (document.documentElement.clientHeight - e.clientY >= e.clientY) {
                    marginTop = e.pageY - offset.top + margin_mouse;
                } else {
                    marginTop = e.pageY - offset.top - margin_mouse - el_cnt_tooltip.clientHeight;
                }
                el_cnt_tooltip.style.marginTop = marginTop+"px";
                el_cnt_tooltip.style.marginLeft = marginLeft+"px";
            };


            let autoCloseGalleryInfo = function() {
                let auto_close_counter = setInterval(function() {
                    if (Array.from(document.querySelectorAll(":hover")).indexOf(el_gallery) === -1) {
                        clearInterval(auto_close_counter);
                        el_cnt_tooltip.style.display = "none";
                        el_cnt_tooltip.innerHTML = "";
                    }
                }, auto_close_interval);

            };
            let showGalleryInfo = function () {
                el_cnt_tooltip.style.display = "";
                autoCloseGalleryInfo();
            };
            let init_request = () => {
                showGalleryInfo();
                this.getGalleriesInfo([{"id": gallery_id, "url": gallery_url}]);

            };
            if (window.sessionStorage.getItem(k_gallery+gallery_id)===null) {
                el_cnt_tooltip.innerHTML = "Fetching info...";
                get_gallery_counter = setTimeout(init_request,request_wait);
            } else {
                let tooltip_text = "";
                for (let i = 0; i < gallery_info.tags.length-1; i++) {
                    const g_tag = gallery_info.tags[i];
                    tooltip_text += parseStr("title", g_tag, "_", " ")+", ";
                }
                if (gallery_info.tags.length > 0) {
                    tooltip_text += parseStr("title", gallery_info.tags[gallery_info.tags.length-1], "_", " ");
                }
                el_cnt_tooltip.innerHTML = "Tags: "+tooltip_text;
                get_gallery_counter = setTimeout(showGalleryInfo,hover_wait);
            }
        };
    }
    hideTooltip(el_gallery,el_cnt_tooltip){
        return () => {
            if (Array.from(document.querySelectorAll(":hover")).indexOf(el_gallery) === -1) {
                clearTimeout(get_gallery_counter);
                el_cnt_tooltip.style.display = "none";
                el_cnt_tooltip.innerHTML = "";
            }
        };
    }
    getGalleriesUrl(g){
        let galleries_obj = [];
        for (let i = 0; i < g.length; i++) {
            const el_gallery = g[i];
            galleries_obj.push(this.getGalleryUrl(el_gallery));
        }
        return galleries_obj;
    }
    getGalleryUrl(el_gallery) {
        const gallery_url = this.f.getUrlFromDom(el_gallery);
        return {"id":this.f.parseUrlToId(gallery_url), "url":gallery_url};
    }
    getGalleriesInfo(g_obj, callback=false) {
        if (g_obj.length > 0) {
            this.disableModule(true);
            if (window.sessionStorage.getItem(k_gallery+g_obj[0].id)===null) {
                let xhr = new XMLHttpRequest();
                xhr.onreadystatechange = () => {
                    if (xhr.readyState == 4) {
                        let g = this.f.parseGalleryHtml(xhr);
                        window.sessionStorage.setItem(k_gallery+g_obj[0].id,JSON.stringify(g));
                        this.refreshGallery(g_obj[0].id);
                        g_obj.shift();
                        this.getGalleriesInfo(g_obj,callback);
                    }
                };
                xhr.open("GET", g_obj[0].url, true);
                xhr.send(null);
            } else {
                this.refreshGallery(g_obj[0].id);
                g_obj.shift();
                this.getGalleriesInfo(g_obj,callback);
            }
        } else {
            if (this.v[this.q.input.delete.substr(1)]) this.deleteGalleries();
            this.updateContentNonGallery(true);
            this.refreshGalleriesSize();
            this.disableModule(false);
            if (typeof callback == "function") callback();
        }
    }
    refreshGalleriesSize() {
        for (let i = 0; i < this.el_galleries.length; i++) {
            const el_gallery = this.el_galleries[i];
            this.refreshGallerySize(el_gallery);
        }
    }
    refreshGallerySize(el_gallery) {
        let init_refreshGallerySize = () => {
            const el_cnt_page_number = el_gallery.querySelector(this.q.div.page_number);
            if (el_gallery.style.border == "") {
                el_cnt_page_number.style.marginLeft = this.s.pages_style.marginLeft+"px";
                el_cnt_page_number.style.marginTop = (el_gallery.offsetHeight-el_cnt_page_number.offsetHeight-this.s.pages_style.marginTop)+"px";
            } else {
                el_cnt_page_number.style.marginLeft = this.s.pages_style.marginLeft-5+"px";
                el_cnt_page_number.style.marginTop = (el_gallery.offsetHeight-el_cnt_page_number.offsetHeight-this.s.pages_style.marginTop-5)+"px";
            }
        };
        checkEl(el_gallery,0,false,init_refreshGallerySize);
    }
    refreshGallery(gallery_id) {
        let list_el_gallery = this.f.getListElGalleryById(gallery_id, this.el_cnt_galleries);

        for (let i = 0; i < list_el_gallery.length; i++) {
            const el_gallery = list_el_gallery[i].parentElement;
            this.refreshGalleryContent(el_gallery);
            this.refreshGallerySize(el_gallery);
        }
    }
    refreshGalleryContent(el_gallery) {
        const gallery_url = this.f.getUrlFromDom(el_gallery);
        const gallery_id = this.f.parseUrlToId(gallery_url);
        const gallery_info = JSON.parse(window.sessionStorage.getItem(k_gallery+gallery_id));
        const el_cnt_tooltip = el_gallery.querySelector(this.q.div.tooltip);
        const el_cnt_page_number = el_gallery.querySelector(this.q.div.page_number);
        const el_cnt_fav = el_gallery.querySelector(this.q.div.fav);

        if (gallery_info !== null) {
            el_cnt_page_number.style.visibility = "";
            if (gallery_info.fav) el_cnt_fav.style.visibility = "";
            let list_z_tag = this.getListZTags(gallery_info);
            let marked_tags = this.getMarkedTags(el_gallery);

            if (this.v[this.q.input.filter.substr(1)]) {
                if (marked_tags.tags.length>0) {
                    el_gallery.style.display = "";
                    pushUniqueOnly(gallery_id, this.shown_el_list);
                } else {
                    el_gallery.style.display = "none";
                    pushUniqueOnly(gallery_id, this.hidden_el_list);
                }
            } else {
                el_gallery.style.display = "";
                pushUniqueOnly(gallery_id, this.shown_el_list);
            }
            
            el_cnt_page_number.innerHTML = gallery_info.p;
            if (list_z_tag.nick.length > 0 || marked_tags.g_tags.length > 0) {
                let tag_title = "{";
                if (list_z_tag.nick.length > 0) tag_title += list_z_tag.nick.join(",");
                if (list_z_tag.nick.length > 0 && marked_tags.g_tags.length > 0) tag_title += "-";
                if (marked_tags.g_tags.length > 0) tag_title += marked_tags.g_tags.join(",");
                tag_title += "} ";
                el_gallery.querySelector(this.q.span.title).innerHTML = tag_title;
                if (this.v[this.q.input.filter.substr(1)]) {
                    el_gallery.style.border = "";
                } else {
                    el_gallery.style.border = "5px solid red";
                }
            } else {
                el_gallery.querySelector(this.q.span.title).innerHTML = "";
                el_gallery.style.border = "";
            }
        }
    }
    refreshGalleries(gallery_changed=false) {
        this.resetContent();
        for (let i = 0; i < this.el_galleries.length; i++) {
            const el_gallery = this.el_galleries[i];
            const gallery_url = this.f.getUrlFromDom(el_gallery);
            const gallery_id = this.f.parseUrlToId(gallery_url);
            this.refreshGallery(gallery_id);
        }
        this.updateContentNonGallery(gallery_changed);
        this.refreshGalleriesSize();
    }
    updateFilterGTags() {
        let keys = Object.keys(this.count_tags);
        keys.sort();
        for (let i=0; i < keys.length; i++) {
            const gallery_tag = keys[i];
            let count_tag = this.count_tags[gallery_tag];
            if (this.z_tags.indexOf(gallery_tag)===-1) {
                if (document.querySelector(this.q.input[gallery_tag])===null && count_tag != 0) {
                    let el_cnt_g_tag = this.createEl("div","g_tag");
                    el_cnt_g_tag.style.paddingRight = "5px";
                    let el_lbl_tag = this.createLabel(gallery_tag," "+parseStr("title", gallery_tag,"_"," "));
                    el_lbl_tag.innerHTML += " ("+count_tag.length+")";
                    let checked = this.v[this.q.input.input.substr(1)+gallery_tag];
                    if (checked===undefined) checked = b.g_tag;
                    let el_in_tag = this.createCheckbox(gallery_tag, checked);

                    el_cnt_g_tag.appendChild(el_in_tag);
                    el_cnt_g_tag.appendChild(el_lbl_tag);
                    const list_el_cnt_g_tags = document.querySelectorAll(this.q.div.g_tags);
                    let el_cnt_g_tag2 = el_cnt_g_tag.cloneNode(true);
                    list_el_cnt_g_tags[0].appendChild(el_cnt_g_tag);
                    list_el_cnt_g_tags[1].appendChild(el_cnt_g_tag2);
                    this.createListener(this.q.input.input+gallery_tag,"change",this.changeFilter,true);
                } else {
                    const el_lbl_tags = document.querySelectorAll(this.q.span[gallery_tag]);
                    for (let i = 0; i < el_lbl_tags.length; i++) {
                        const el_lbl_tag = el_lbl_tags[i];
                        let count_tag = 0;
                        if (this.count_tags[gallery_tag] != undefined) count_tag = this.count_tags[gallery_tag].length;
                        if (count_tag === 0) {
                            el_lbl_tag.parentElement.parentElement.removeChild(el_lbl_tag.parentElement);
                        } else {
                            el_lbl_tag.innerHTML = " "+parseStr("title", gallery_tag,"_"," ")+" ("+count_tag+")";
                        }
                    }
                }
            }
        }
    }
    updateLabelFilter() {
        let el_lbl_filters = document.querySelectorAll(this.q.span.filter);
        for (let i = 0; i < el_lbl_filters.length; i++) {
            let el_lbl_filter = el_lbl_filters[i];
            el_lbl_filter.innerHTML = txt_filter + " | Shown: "+(this.shown_el_list.length.toString())+" | Hidden: "+(this.hidden_el_list.length.toString())+" | Deleted: "+(this.deleted_el_list.length.toString())+" | Page Loaded: "+(this.count_loaded_page.toString());
        }
    }
    updateLabelZTag() {
        for (let i = 0; i < this.z_tags.length; i++) {
            const z_tag = this.z_tags[i];
            const el_lbl_tags = document.querySelectorAll(this.q.span[z_tag]);
            for (let i = 0; i < el_lbl_tags.length; i++) {
                const el_lbl_tag = el_lbl_tags[i];
                let count_tag = 0;
                if (this.count_tags[z_tag] != undefined) count_tag = this.count_tags[z_tag].length;
                el_lbl_tag.innerHTML = " "+this.tags[z_tag].name+" ("+count_tag+")";
            }
        }
    }
    updateContentNonGallery(gallery_changed=false) {
        this.updateLabelFilter();
        if (gallery_changed) {
            this.deleteAllGTags();
            this.updateFilterGTags();
            this.updateLabelZTag();
        }
    }
    getListZTags(gallery_info) {
        let list_z_tag = {"nick":[],"name":[]};
        for (let i = 0; i < this.z_tags.length; i++) {
            const z_tag = this.z_tags[i];
            if (gallery_info.tags.indexOf(z_tag) >= 0) {
                list_z_tag.nick.push(this.tags[z_tag].nick);
                list_z_tag.name.push(this.tags[z_tag].name);
            }
        }
        return list_z_tag;
    }
    getMarkedTags(el_gallery) {
        const gallery_url = this.f.getUrlFromDom(el_gallery);
        const gallery_id = this.f.parseUrlToId(gallery_url);
        const gallery_info = JSON.parse(window.sessionStorage.getItem(k_gallery+gallery_id));
        let marked_tags = {
            "tags": [],
            "z_tags": [],
            "g_tags": [],
        };

        for (let i = 0; i < gallery_info.tags.length; i++) {
            const gallery_tag = gallery_info.tags[i];
            if (this.count_tags[gallery_tag] === undefined) this.count_tags[gallery_tag] = [];
            pushUniqueOnly(gallery_id, this.count_tags[gallery_tag]);
            if (this.v[this.q.input.input.substr(1)+gallery_tag]) {
                if (this.z_tags.indexOf(gallery_tag)===-1) {
                    marked_tags.g_tags.push(parseStr("nick",gallery_tag,"_","").toLowerCase());
                } else {
                    marked_tags.z_tags.push(parseStr("nick",gallery_tag,"_",""));
                }
                marked_tags.tags.push(gallery_tag);
            }
        }
        return marked_tags;
    }
    disableModule(val) {
        let list_disable = document.querySelectorAll(this.q.div.mycontent+" input, "+this.q.div.mycontent+" button");
        this.bulkDisable(list_disable,val);
    }
    bulkDisable(el_list, val) {
        for (let i = 0; i < el_list.length; i++) {
            let el = el_list[i];
            if (!val && el.name == this.q.input.load.substr(1)) {
                this.updateInputLoad(el);
            } else if (!val && el.name == this.q.button.load.substr(1)) {
                this.updateButtonLoad(el);
            } else {
                el.disabled = val;
            }
        }
    }
    deleteGallery(el_gallery, bypass=false) {
        if (bypass || this.getMarkedTags(el_gallery).tags.length === 0) {
            const gallery_url = this.f.getUrlFromDom(el_gallery);
            const gallery_id = this.f.parseUrlToId(gallery_url);
            const gallery_info = JSON.parse(window.sessionStorage.getItem(k_gallery+gallery_id));
            for (let i = 0; i < gallery_info.tags.length; i++) {
                const g_tag = gallery_info.tags[i];
                this.count_tags[g_tag].splice(this.count_tags[g_tag].indexOf(gallery_id),1);
            }
            pushUniqueOnly(gallery_id,this.deleted_el_list);
            el_gallery.parentElement.removeChild(el_gallery);
        }
    }
    deleteGalleries(list_delete=false, callback=false) {
        this.updateElGalleries();
        if (list_delete === false) {
            list_delete = [];
            for (let i = 0; i < this.el_galleries.length; i++) {
                list_delete.push(this.el_galleries[i]);
            }
            this.deleteGalleries(list_delete);
        } else {
            if (list_delete.length > 0) {
                this.deleteGallery(list_delete[0]);
                list_delete.shift();
                this.deleteGalleries(list_delete);
            } else {
                this.refreshGalleries(true);
                if (typeof callback == "function") callback();
            }
        }
    }
    getMoreGalleries(n,callback=false) {
        n = parseInt(n);
        if (n > 0) {
            this.disableModule(true);
            let next_url = this.f.getNextPageUrl(this.count_loaded_page);
            this.count_loaded_page += 1;
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    const r = readBody(xhr);
                    const body_text = r.substring(r.indexOf("<body>")+6,r.indexOf("</body>"));
                    const el_body = document.createElement("body");
                    el_body.innerHTML = body_text;
                    let r_el_cnt_galleries = el_body.querySelector(this.q.cnt_galleries);
                    let r_el_galleries = r_el_cnt_galleries.querySelectorAll(this.q.gallery);
                    r_el_galleries = this.f.fixThumbnail(r_el_galleries);

                    this.modifyGalleries(r_el_galleries);
                    let r_galleries_obj = this.getGalleriesUrl(r_el_galleries);

                    let rGetMoreGalleries = () => {
                        n += -1;
                        this.getMoreGalleries(n,callback);
                    };
                    this.el_cnt_galleries.append(...r_el_cnt_galleries.childNodes);
                    this.updateElGalleries();
                    this.getGalleriesInfo(r_galleries_obj,rGetMoreGalleries);
                }
            };
            xhr.open("GET", next_url, true);
            xhr.send(null);
        } else {
            this.disableModule(false);
            this.refreshGalleriesSize();
            this.updateHash();
            if (typeof callback == "function") callback();
        }
    }
    refreshAllSize() {
        this.refreshGalleriesSize();
        let list_el_mycontent = document.querySelectorAll(this.q.div.mycontent);
        for (let i = 0; i < list_el_mycontent.length; i++) {
            const el_mycontent = list_el_mycontent[i];
            el_mycontent.style.width = this.el_cnt_galleries.offsetWidth+"px";
        }
    }
    resetContent() {
        this.shown_el_list = [];
        this.hidden_el_list = [];
    }
    deleteAllGTags() {
        const list_el_cnt_g_tags = document.querySelectorAll(this.q.div.g_tags);
        for (let i = 0; i < list_el_cnt_g_tags.length; i++) {
            const el_cnt_g_tags = list_el_cnt_g_tags[i];
            el_cnt_g_tags.innerHTML = "";
        }
    }
    updateHash() {
        if (!this.is_side_gallery) {
            window.location.hash = JSON.stringify({"v":this.v,"count_loaded_page":this.count_loaded_page});
        }
    }
    updateDataGallery() {

    }
}

function main() {
    "use strict";
    if (window.location.host == "nhentai.net") {
        if (window.localStorage.getItem("reader")==null) {
            window.localStorage.setItem("reader",JSON.stringify({"version":2,"preload":30,"turning_behavior":"left","image_scaling":"fit-horizontal","jump_on_turn":"image","scroll_speed":5,"zoom":100}));
        }
        if (window.location.pathname.substring(0,3) == "/g/" && (window.location.pathname.match(/\//g) || []).length===3) {
            let g = nhParseGalleryInfoFromDom(document);
            let g_key = k_gallery + (window.location.pathname.replace("/g/","").replace(/\//g,""));
            window.sessionStorage.setItem(g_key, JSON.stringify(g));
            let origOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function() {
                this.addEventListener('load', function() {
                    if (this.responseURL.indexOf("favorite") >= 0) {
                        if (this.responseURL.indexOf("/unfavorite") >= 0) {
                            g.fav = false;
                        } else if (this.responseURL.indexOf("/favorite") >= 0) {
                            g.fav = true;
                        }
                        window.sessionStorage.setItem(g_key, JSON.stringify(g));
                    }
                });
                origOpen.apply(this, arguments);
            };
        }
        let g;
        let g_pop;
        let g_suggest;
        let g_fav;

        if (checkExist(nh.q.cnt_galleries_suggest)) {
            let nh_suggest = deepCopy(nh);
            nh_suggest.q.cnt_galleries = nh_suggest.q.cnt_galleries_suggest;
            g_suggest = new cGallery("nh_suggest_", nh_suggest);
        } else if (checkExist(nh.q.cnt_galleries_fav)) {
            let nh_fav = deepCopy(nh);
            nh_fav.q.cnt_galleries = nh_fav.q.cnt_galleries_fav;
            g_fav = new cGallery("nh_fav_", nh_fav);
        } else {
            if (checkExist(nh.q.cnt_galleries)) g = new cGallery("nh_", nh);

            let nh_pop = deepCopy(nh);
            nh_pop.q.cnt_galleries = nh_pop.q.cnt_galleries_pop;
            if (checkExist(nh_pop.q.cnt_galleries)) g_pop = new cGallery("nh_pop_", nh_pop, true);
        }

        window.onresize = function() {
            if (checkExist(nh.q.cnt_galleries)) g.refreshAllSize();
            if (checkExist(nh.q.cnt_galleries_pop)) g_pop.refreshAllSize();
            if (checkExist(nh.q.cnt_galleries_suggest)) g_suggest.refreshAllSize();
            if (checkExist(nh.q.cnt_galleries_fav)) g_fav.refreshAllSize();
        };
    } else if (window.location.host == "hentainexus.com") {
        if (window.location.pathname.substring(0,6) == "/view/" && (window.location.pathname.match(/\//g) || []).length===2) {
            let g = hnParseGalleryInfoFromDom(document);
            let g_key = k_gallery + (window.location.pathname.replace("/view/","").replace(/\//g,""));
            window.sessionStorage.setItem(g_key, JSON.stringify(g));
            let origOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function() {
                this.addEventListener('load', function() {
                    if (this.responseURL.indexOf("/ajax/star/") >= 0) {
                        g.fav = JSON.parse(this.responseText).starred;
                        window.sessionStorage.setItem(g_key, JSON.stringify(g));
                    }
                });
                origOpen.apply(this, arguments);
            };
        }
        let g;
        if (checkExist(hn.q.cnt_galleries)) g = new cGallery("hn_",hn);

        window.onresize = function() {
            if (checkExist(hn.q.cnt_galleries)) g.refreshAllSize();
        };
    }
}

checkEl("body",0,false,main);