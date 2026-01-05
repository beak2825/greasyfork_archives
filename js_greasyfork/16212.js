// ==UserScript==
// @name            DuckDuckGo Extended Mod
// @description     Manage list of quick links to other search engines.
// @author          tumpio
// @icon            https://raw.githubusercontent.com/tumpio/gmscripts/master/DuckDuckGo_Extended/large.png
// @match           *://duckduckgo.com/*
// @exclude         *://duckduckgo.com/post2.html
// @grant           GM_addStyle
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_xmlhttpRequest
// @version         2.2.0
// @namespace https://greasyfork.org/users/24448
// @downloadURL https://update.greasyfork.org/scripts/16212/DuckDuckGo%20Extended%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/16212/DuckDuckGo%20Extended%20Mod.meta.js
// ==/UserScript==

if (window.top !== window.self) // NOTE: Do not run on iframes
    return;

var ddg_e = {

    list: document.createElement("ol"),
    engines: [],

    default: "Google==https://encrypted.google.com/search?q={searchTerms}\
;;Images==http://www.picsearch.com/index.cgi?q={searchTerms}\
;;YouTube==https://www.youtube.com/results?search_query={searchTerms}&aq=f\
;;Google Play==https://play.google.com/store/search?q={searchTerms}\
;;Translate==http://translate.google.com/translate_t#auto|es|{searchTerms}\
;;Maps==http://here.com/?cid=nokiamaps-fw-ilc-na-acq-na-opensearch-g0-na-1&plcsDl=search&q={searchTerms}\
;;IMDb==http://www.imdb.com/find?s=all&amp;q={searchTerms}\
;;Music==http://www.musicsmasher.net/#{searchTerms}\
;;Wiki==https://es.wikipedia.org/w/index.php?title=Special%3ASearch&profile=default&search={searchTerms}\
;;Kickass Torrents==https://kat.cr/usearch/?q={searchTerms}\
;;Identi.li==http://www.identi.li/index.php?action=buscador&search={searchTerms}",

    style: "\
#ddg_extented { display:table; width:100%; background:#C9481C }\
#ddg_extented ol { display:table-cell; padding-top:0.30em; padding-bottom:0 }\
#ddg_extented ol li { display:inline-block  }\
#ddg_extented ol li a { padding:1.30em }\
#ddg_extented ol li.disabled a { pointer-events: none }\
#ddg_extented a, #ddg_extented a:visited { color:#fff;font-weight:700 }\
#ddg_extented a:hover { color:#91C5EE }\
#ddg_extented #ddg_e_save { color: #6CBD6A }\
#ddg_extented #ddg_e_cancel { color: #FF8861 }\
#ddg_extented_options { background:#C9481C; display:table-cell; text-align:right }\
#ddg_extented_options > a { padding:0 5px }\
#ddg_extented_options.show ul { display:block }\
#ddg_extented_options ul { position:absolute; right:0; z-index:20; display:none; padding:.8em; background:#C9481C; text-align:left }\
",

    get: function () {
        var e = GM_getValue("engines", this.default).split(";;");
        var a = [];
        for (var i = 0; i < e.length; i++)
            a.push(e[i].split("=="));
        this.length = a.length;
        return a;
    },

    set: function () {
        var e = "";
        for (var i = 0; i < this.engines.length; i++) {
            e += ";;" + this.engines[i].textContent + "==" + this.engines[i].firstChild.getAttribute("data-engine");
        }
        GM_setValue("engines", e.substr(2));
    },

    newList: function () {
        var l = "";
        var e = this.get();
        var t = escape(document.getElementById("search_form_input").value);
        for (var i = 0; i < e.length; i++)
            l += '<li draggable="true" value=' + (i + 1) + '"><a data-engine="' + e[i][1] + '"href="' + e[i][1].replace("{searchTerms}", t) + '">' + e[i][0] + "</a></li>";
        this.list.innerHTML = l;
        this.engines = this.list.getElementsByTagName("li");
    },

    append: function () {
        var e = document.createElement("div");
        var h = document.getElementById("header_wrapper");
        if(h) {
            var b = window.getComputedStyle(h).borderTopColor;
            if (b.indexOf("255, 255, 255") < 0 && b.indexOf("#ffffff") < 0)
                this.style += "#ddg_extented, #ddg_extented_options { background:" + b + "!important }";
        }
        GM_addStyle(this.style);
        e.setAttribute("id", "ddg_extented");
        e.appendChild(this.list);
        this.newList();
        document.body.insertBefore(e, document.body.firstChild);
        options.create(e);
    }
};

var options = {

    list: [],
    strings: [
        ["Reorder", "Drag and drop search engines", enableDrag],
        ["Rename", "Click to rename search engines", enableRename],
        ["Remove", "Click to remove search engines", enableRemove],
        ["Restore all", "Restores all default search engines", restoreEngines],
        ["Save", "Saves modified search engines", saveActions],
        ["Cancel", "Cancels all recent modifications", cancelActions]
    ],

    create: function (m) {
        var o = document.createElement("div");
        var o_link = document.createElement("a");
        var ul = document.createElement("ul");
        var links = [];
        o.id = "ddg_extented_options";
        o_link.innerHTML = "✼";
        o_link.href = "#" + o.id;
        for (var i = 0; i < this.strings.length; i++) {
            var a = document.createElement("a");
            a.href = "#";
            a.innerHTML = this.strings[i][0];
            a.title = this.strings[i][1];
            a.addEventListener("click", this.strings[i][2], false);
            links.push(a);
        }
        for (var j = 0; j < links.length - 2; j++) {
            var li = document.createElement("li");
            li.appendChild(links[j]);
            ul.appendChild(li);
        }
        var o_save = links[links.length - 2];
        var o_cancel = links[links.length - 1];
        o_save.style.display = "none";
        o_cancel.style.display = "none";
        o_save.id = "ddg_e_save";
        o_cancel.id = "ddg_e_cancel";
        this.list.push(o_save);
        this.list.push(o_cancel);
        this.list.push(o_link);
        o.appendChild(o_save);
        o.appendChild(o_cancel);
        o.appendChild(o_link);
        o.appendChild(ul);
        o.addEventListener("click", function(e) {
            o.className = (o.className === "" ? "show" : "");
        });
        document.addEventListener("click", function(e) {
            if(e.target != o_link && o.className !== "")
                o.className = "";
        });
        m.appendChild(o);
    },

    toggle: function () {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].style.display === "none")
                this.list[i].style.display = "inline";
            else
                this.list[i].style.display = "none";
        }
    }

};

// FUNCTIONS
function onHashChange() {
    if (window.location.hash.indexOf("{searchTerms}") !== -1)
        window.location.hash = "";
    window.addEventListener("hashchange", function () {
        if (window.location.hash.indexOf("{searchTerms}") !== -1)
            window.location.href = window.location.hash.substr(1).replace("{searchTerms}", escape(document.getElementById("search_form_input").value));
    }, false);
}

function onColorChange(h, c) {
    if (c !== null) {
        c.addEventListener("change", function () {
            var b = window.getComputedStyle(h).backgroundColor;
            for (var i = 0; i < ddg_e.engines.length; i++)
                ddg_e.engines[i].style.background = b;
        }, false);
    }
}

function restoreEngines() {
    if (confirm("Do you want to restore the default search engines?")) {
        GM_setValue("engines", ddg_e.default);
        ddg_e.newList();
    }
}

function saveActions() {
    disableEvents();
    ddg_e.set();
}

function cancelActions() {
    disableEvents();
    ddg_e.newList();
}

function enableDrag() {
    options.toggle();
    for (var i = 0; i < ddg_e.engines.length; i++) {
        ddg_e.engines[i].style.cursor = "move";
        ddg_e.engines[i].className = "disabled";
        ddg_e.engines[i].addEventListener("dragstart", handleDragStart, false);
        ddg_e.engines[i].addEventListener("dragover", handleDragOver, false);
        ddg_e.engines[i].addEventListener("drop", handleDrop, false);
    }
}

function enableRemove() {
    options.toggle();
    for (var i = 0; i < ddg_e.engines.length; i++) {
        ddg_e.engines[i].style.cursor = "crosshair";
        ddg_e.engines[i].className = "disabled";
        ddg_e.engines[i].addEventListener("click", remove, false);
    }
}

function enableRename() {
    options.toggle();
    for (var i = 0; i < ddg_e.engines.length; i++) {
        ddg_e.engines[i].style.cursor = "text";
        ddg_e.engines[i].className = "disabled";
        ddg_e.engines[i].addEventListener("click", rename, false);
    }
}

function disableEvents() {
    options.toggle();
    for (var i = 0; i < ddg_e.engines.length; i++) {
        ddg_e.engines[i].style.cursor = "auto";
        ddg_e.engines[i].removeAttribute("class");
        ddg_e.engines[i].removeEventListener("dragstart", handleDragStart, false);
        ddg_e.engines[i].removeEventListener("dragover", handleDragOver, false);
        ddg_e.engines[i].removeEventListener("drop", handleDrop, false);
        ddg_e.engines[i].removeEventListener("click", remove, false);
        ddg_e.engines[i].removeEventListener("click", rename, false);
    }
}

function remove() {
    this.parentNode.removeChild(this);
}

function rename() {
    var n = prompt("Rename search engine", this.textContent);
    if (n && n.length > 0 && n.length < 20)
        this.firstChild.innerHTML = n;
}

/* Pure javascript and html5 drag-and-drop for an ordered list
 * source: https://gist.github.com/robophilosopher/7520460
 */
var dragSrcEl, drop_index, numLis, count, token1, token2;

function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) e.preventDefault();
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
    drop_index = this.value;
    numLis = parseInt(drop_index - dragSrcEl.value);
    count = Math.abs(numLis);
    if (dragSrcEl != this) {
        // swap data when premises are adjacent
        if (Math.abs(numLis) == 1) {
            dragSrcEl.innerHTML = this.innerHTML;
            this.innerHTML = e.dataTransfer.getData("text/html");
        }
        // propagate data from non-adjacent drops
        if (Math.abs(numLis) > 1) {
            token1 = this.innerHTML;
            this.innerHTML = e.dataTransfer.getData("text/html");
            var i, counter;
            // bring premise up list
            if (numLis < -1) {
                for (i = drop_index, counter = 0; counter < count; counter++, i++) {
                    token2 = ddg_e.engines[i].innerHTML;
                    ddg_e.engines[i].innerHTML = token1;
                    token1 = token2;
                }
            }
            // bring premise down list
            if (numLis > 1) {
                for (i = drop_index - 1, counter = 0; counter < count; counter++, i--) {
                    token2 = ddg_e.engines[i - 1].innerHTML;
                    ddg_e.engines[i - 1].innerHTML = token1;
                    token1 = token2;
                }
            }
        }
    }
    return false;
}

// START
if (window.location.href.indexOf("http://mycroftproject.com/") !== -1) {
    mycroft.addLinks(document.getElementById("plugins"));
} else {
    ddg_e.append();
    //onColorChange(header, document.getElementById("setting_kj"));
}
