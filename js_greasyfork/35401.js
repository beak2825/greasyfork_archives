// ==UserScript==
// @name         アズレンWiki コメントあぼーん
// @version      0.4.4
// @description  アズールレーン(アズレン)攻略 Wiki のコメント欄にNGID機能を追加します。
// @author       Shikikan
// @match        http://azurlane.wikiru.jp/index.php*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @namespace    https://greasyfork.org/users/159960
// @downloadURL https://update.greasyfork.org/scripts/35401/%E3%82%A2%E3%82%BA%E3%83%AC%E3%83%B3Wiki%20%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%81%82%E3%81%BC%E3%83%BC%E3%82%93.user.js
// @updateURL https://update.greasyfork.org/scripts/35401/%E3%82%A2%E3%82%BA%E3%83%AC%E3%83%B3Wiki%20%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%81%82%E3%81%BC%E3%83%BC%E3%82%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var NGIDs;
    var AboneMode;
    load();

    function initComments() {
        var comments = document.querySelectorAll("ul.list1 li");
        var regexId = new RegExp('\\[' + '([0-9a-zA-Z\\.\\/]{11})' + '\\]', 'gm');
        var regexBrac = new RegExp('[\\[\\]]', 'gm');
        var i=0, len;
        var elem, match, userId, tmpHtml;

        for(i=0,len=comments.length; i<len; i++) {
            tmpHtml = "";
            for(elem of comments[i].childNodes) {
                if(elem.nodeName == "#text") {
                    tmpHtml += elem.nodeValue;
                    elem.nodeValue = "";

                }else if(elem.nodeName == "INPUT" || elem.nodeName == "BR") {
                    tmpHtml += elem.outerHTML;
                    elem.classList.add("js-remove");

                }else if(elem.nodeName == "SPAN" || elem.nodeName == "A" || elem.nodeName == "STRONG") {
                    tmpHtml += elem.outerHTML;
                    elem.classList.add("js-remove");
                }
            }
            match = tmpHtml.match(regexId);
            if(match !== null) {
                userId = match[match.length-1].replace(regexBrac,"");
                tmpHtml = tmpHtml.replace(regexId, "[<span class='js-abonelinkwrap'><a href='javascript:void(0);' class='js-abonelink' data-userid='$1'>$1</a></span>]");
            }
            comments[i].insertAdjacentHTML("afterbegin", "<span class='js-comment' data-userid='"+ userId +"'>"+ tmpHtml +"</span>");
        }

        var aboneLinks = document.querySelectorAll("a.js-abonelink");
        for(i=0,len=aboneLinks.length; i<len; i++) {
            aboneLinks[i].addEventListener("click", showAboneLinkMenu, false);
        }
        var oldNodes = document.querySelectorAll(".js-remove");
        for(i=0,len=oldNodes.length; i<len; i++) {
            oldNodes[i].parentNode.removeChild(oldNodes[i]);
        }
        abone();
    }

    function initStyle() {
        var str = ""+
        "           .js-aboned > span { display:none; }"+
        "           .js-aboned:before { content:'あぼーん'; display:block; color:#ccc; }"+
        ".js-sabori .js-aboned > span { display:block; }"+
        ".js-sabori .js-aboned:before { content:none; }"+
        ".js-sabori.js-gray .js-aboned > span { color:#eee !important; }"+
        ".js-sabori.js-white .js-aboned > span { color:#fff !important; }"+
        ".js-hide   .js-aboned > span { display:none; }"+
        ".js-hide   .js-aboned:before { content:none; }"+
        ".js-hide   .js-aboned.js-notree { display:none; }"+
        ".js-rensa  .js-aboned > span { display:none; }"+
        ".js-rensa  .js-aboned > ul li > span { display:none; }"+
        ".js-rensa  .js-aboned > ul li:before { content:'あぼーん'; display:block; color:#ccc; }"+
        ".js-hide.js-rensa .js-aboned { display:none; }"+
        ".js-listcontainer { position:fixed; top:0; right:-300px; width:300px; height:100%; box-sizing:border-box; padding:36px 28px; color:#fff; font-size:14px; background-color:rgba(0,0,0,0.8); transform:translateX(0); transition:all 0.2s 0.3s ease-out; }"+
        ".js-drawer { position:fixed; top:50%; left:-60px; width:60px; height:220px; background-color:rgba(0,0,0,0.2); transform:translateY(-50%); border-radius:12px 0 0 12px; }"+
        ".js-listcontainer:hover { transform:translateX(-300px); transition:all 0.2s 0s ease-out; }"+
        ".js-listcontainer h1 { background-color:transparent; color:#fff; font-size:23px; line-height:34px; font-weight:inherit; padding:0; margin:0 0 6px 0; }"+
        ".js-listpulldown select { margin:0 0 31px 0; }"+
        ".js-listcontainer a { color:#fff; }"+
        ".js-listcontainer ::-webkit-scrollbar { width:4px; }"+
        ".js-listcontainer ::-webkit-scrollbar-track { background-color:rgba(0,0,0,0); }"+
        ".js-listcontainer ::-webkit-scrollbar-thumb { background-color:rgba(255,255,255,0.2); }"+
        ".js-listcontainer a:hover { background-color:transparent; color:#f30; text-decoration:none; }"+
        ".js-listvflex { display:flex; flex-flow:column nowrap; width:100%; height:100%; }"+
        ".js-listtablewrap { overflow-x:hidden; overflow-y:auto; width:100%; height:100%; padding-right:6px; }"+
        ".js-listtable { display:table; width:100%; }"+
        ".js-listrow { display:table-row; }"+
        ".js-listrow:hover { background-color:rgba(255,255,255,0.1); }"+
        ".js-listcell { display:table-cell; line-height:28px; }"+
        ".js-listcell:last-of-type { text-align:right; width:1em; }"+
        ".js-listbtn { }"+
        ".js-abonelinkwrap { display:inline-block; position:relative; }"+
        ".js-abonelinkmenu { display:inline-block; position:absolute; top:1.5em; left:0; z-index:100; width:10em; margin:0; padding:0.4em 0; list-style:none; background-color:rgba(255,255,255,0.9); border:1px solid #ccc; box-shadow:0 2px 2px rgba(0,0,0,0.2); }"+
        ".js-abonelinkmenu li { background-color:rgba(0,0,0,0); }"+
        ".js-abonelinkmenu li a { display:block; line-height:2em; padding:0 0 0 1em; background-color:rgba(0,0,0,0); color:#333; }"+
        ".js-abonelinkmenu li a:hover { background-color:rgba(0,0,0,0.1); text-decoration:none; }"+
        "";

        var tag = document.createElement('style');
        var textnode = document.createTextNode(str);
        if(tag.styleSheet) {
            tag.styleSheet.cssText = textnode.nodeValue;
        }else{
            tag.appendChild(textnode);
        }
        document.getElementsByTagName('head')[0].appendChild(tag);
    }

    function initList() {
        var str = ""+
            "<div class='js-listcontainer'>"+
                "<div class='js-listvflex'>"+
                    "<h1>あぼーんリスト</h1>"+
                    "<div class='js-listpulldown'><select name='abonemode'>"+
                        "<option value='normal'>ふつう</option>"+
                        "<option value='sabori'>さぼり</option>"+
                        "<option value='hide'>かくす</option>"+
                        "<option value='gray'>うすく</option>"+
                        "<option value='white'>しろく</option>"+
                        "<option value='rensa'>れんさふつう</option>"+
                        "<option value='rensahide'>れんさかくす</option>"+
                    "</select></div>"+
                    "<div class='js-listtablewrap'>"+
                        "<div class='js-listtable'></div>"+
                    "</div>"+
                "</div>"+
                "<div class='js-drawer'></div>"+
            "</div>";
        document.body.insertAdjacentHTML("afterend", str);
        printList();

        var menu = document.querySelector(".js-listpulldown select");
        var options = menu.getElementsByTagName("OPTION");
        for(var i=0,len=options.length; i<len; i++) {
            menu.options[i].selected = (menu.options[i].value == AboneMode);
        }
        setAboneMode(AboneMode);

        menu.addEventListener("change", function() {
            var i =  this.selectedIndex;
            var options = this.getElementsByTagName("OPTION");
            setAboneMode(options[i].value);
        });
    }
    function setAboneMode(mode) {
        document.body.classList.remove("js-sabori","js-hide","js-rensa","js-gray","js-white");
        switch(mode) {
            case "normal":
                break;
            case "sabori":
                document.body.classList.add("js-sabori");
                break;
            case "gray":
                document.body.classList.add("js-sabori","js-gray");
                break;
            case "white":
                document.body.classList.add("js-sabori","js-white");
                break;
            case "hide":
                document.body.classList.add("js-hide");
                break;
            case "rensa":
                document.body.classList.add("js-rensa");
                break;
            case "rensahide":
                document.body.classList.add("js-rensa","js-hide");
                break;
            default:
                break;
        }
        AboneMode = mode;
        save();
    }
    function printList() {
        var table = document.querySelector(".js-listtable");
        var tmpHtml = "";

        var i=0, len;
        for(i=0,len=NGIDs.length; i<len; i++) {
            tmpHtml += ""+
                "<div class='js-listrow'>"+
                    "<div class='js-listcell'>"+
                        NGIDs[i]+
                    "</div>"+
                    "<div class='js-listcell'>"+
                        "<a href='javascript:void(0);' class='js-listbtn' data-userid='"+ NGIDs[i] +"'>×</a>"+
                    "</div>"+
                "</div>";
        }
        table.innerHTML = tmpHtml;

        var removeLinks = document.querySelectorAll("a.js-listbtn");
        for(i=0,len=removeLinks.length; i<len; i++) {
            removeLinks[i].addEventListener("click", clickRemoveLinkEvent, false);
        }
    }

    function clickAddLinkEvent(ev) {
        var userid = ev.target.dataset.userid;
        var ans = window.confirm(userid +" をNGIDに追加します。よろしいですか？");
        if(ans){
            addNgid(userid);
        }
    }
    function clickRemoveLinkEvent(ev) {
        var userid = ev.target.dataset.userid;
        var ans = window.confirm(userid +" をNGIDから削除します。よろしいですか？");
        if(ans){
            removeNgid(userid);
        }
    }
    function clickSearchLinkEvent(ev) {
        var userId = ev.target.dataset.userid;
        var copyResult = clipboard(userId);
        console.log("copy: "+copyResult);

        var form = document.createElement("form");
        form.setAttribute("action","http://azurlane.wikiru.jp/index.php?cmd=search");
        form.setAttribute("method","post");
        form.setAttribute("target","_blank");
        form.style.position = "fixed";
        form.style.left = "-100%";

        var encode_hint = document.createElement("input");
        encode_hint.setAttribute("type","hidden");
        encode_hint.setAttribute("name","encode_hint");
        encode_hint.setAttribute("value","ぷ");
        form.appendChild(encode_hint);

        var word = document.createElement("input");
        word.setAttribute("type","hidden");
        word.setAttribute("name","word");
        word.setAttribute("value",userId);
        form.appendChild(word);

        var type = document.createElement("input");
        type.setAttribute("type","hidden");
        type.setAttribute("name","type");
        type.setAttribute("value","AND");
        form.appendChild(type);

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }
    function clipboard(str) {
        var div = document.createElement("div");
        div.appendChild(document.createElement("pre")).textContent = str;
        div.style.position = "fixed";
        div.style.left = "-100%";
        document.body.appendChild(div);
        document.getSelection().selectAllChildren(div);
        var result = document.execCommand('copy');
        document.body.removeChild(div);
        return result;
    }
    function showAboneLinkMenu(ev) {
        if(!ev.target.parentNode.querySelector(".js-abonelinkmenu")) {
            var idLink = ev.target;
            var idLinkWrap = ev.target.parentNode;
            var userId = ev.target.dataset.userid;
            var str = ""+
                "<ul class='js-abonelinkmenu'>"+
                "<li><a href='javascript:void(0);' class='js-itemabone' data-userid='"+userId+"'>NGIDに登録</a></li>"+
                "<li><a href='javascript:void(0);' class='js-itemsearch' data-userid='"+userId+"'>コピーして検索</a></li>"+
                "</ul>";
            idLink.insertAdjacentHTML("afterend",str);

            var itemAbone = idLinkWrap.querySelector(".js-itemabone");
            var itemSearch = idLinkWrap.querySelector(".js-itemsearch");
            itemAbone.addEventListener("click",clickAddLinkEvent,false);
            itemSearch.addEventListener("click",clickSearchLinkEvent,false);
        }
    }
    function hideAboneLinkMenu(ev) {
        if( ev.target.parentNode.classList.contains(".js-abonelinkmenu") ||
           ev.target.classList.contains(".js-itemabone") ||
           ev.target.classList.contains(".js-itemsearch") ) return false;
        var menus = document.querySelectorAll(".js-abonelinkmenu");
        for(var i=0,len=menus.length; i<len; i++) {
            menus[i].parentNode.removeChild(menus[i]);
        }
    }
    function initBodyClick(){
        document.body.addEventListener("click",hideAboneLinkMenu,true);
    }

    function addNgid(userid) {
        NGIDs.unshift(userid);
        NGIDs = NGIDs.filter(function (x, i, self) {
            return self.indexOf(x) === i;
        });
        save();
        printList();
        abone();
    }
    function removeNgid(userid) {
        NGIDs = NGIDs.filter(function(v){
            return v != userid;
        });
        save();
        printList();
        abone();
    }

    function save() {
        var str = NGIDs.join(',');
        GM_setValue("NGIDs", str);
        GM_setValue("AboneMode", AboneMode);
    }
    function load() {
        var str = GM_getValue("NGIDs","");
        if(str === "") {
            NGIDs = [];
            return;
        }
        NGIDs = str.split(',');
        AboneMode = GM_getValue("AboneMode","normal");
    }

    function abone() {
        var i=0, j=0, clen, ilen, alen, parent;
        var comments = document.querySelectorAll("span.js-comment");
        var aboned = document.querySelectorAll(".js-aboned");

        for(i=0,alen=aboned.length; i<alen; i++) {
            aboned[i].classList.remove("js-aboned");
        }
        for(i=0,clen=comments.length; i<clen; i++) {
            for(j=0,ilen=NGIDs.length; j<ilen; j++) {
                if(comments[i].dataset.userid == NGIDs[j]) {
                    if( ! comments[i].nextElementSibling ) {
                        comments[i].parentNode.classList.add("js-aboned","js-notree");
                    }else{
                        comments[i].parentNode.classList.add("js-aboned");
                    }
                }
            }
        }
    }
    initStyle();
    initComments();
    initList();
    initBodyClick();
})();