// ==UserScript==
// @name         DF Bookmarks
// @version      1.500
// @description  Tool to let you navigate easier through DF
// @author       A Meaty Alt
// @include      /fairview\.deadfrontier\.com/
// @exclude      fairview.deadfrontier.com/onlinezombiemmo/index.php?page=21
// @exclude      https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=21
// @grant        none
// @require      https://greasyfork.org/scripts/32816-append-script/code/Append%20Script.js?version=215508
// @noframes
// @run-at       document-idle
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/32644/DF%20Bookmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/32644/DF%20Bookmarks.meta.js
// ==/UserScript==

(function() {
    var elements = {};

    var hamburgerImg = document.createElement("img");
    hamburgerImg.src = "https://puu.sh/xqhEm/facede3064.png";
    hamburgerImg.style.height = "60px";
    elements.hamburgerLink = document.createElement("span");
    elements.hamburgerLink.id = "hamburger";
    elements.hamburgerLink.appendChild(hamburgerImg);
    elements.hamburgerLink.setAttribute("onclick", "showMenu()");
    elements.hamburgerLink.style.float += " left";
    elements.hamburgerLink.style.cursor += "pointer";
    elements.hamburgerLink.style.textAlign = "center";
    
    function showMenu(){
        var menu = document.getElementById("menu_holder");
        if(menu){
            if(menu.hidden)
                menu.hidden = false;
            else
                menu.hidden = true;
        }
        else
            createMenu();
    }
    appendScript(showMenu.toString());

    function createMenu(){
        function createBookmark(name, link, id){
            var newBookmarkHolder = document.createElement("span");
            newBookmarkHolder.classList.add("newBookmark");
            newBookmarkHolder.id = id;
            newBookmarkHolder.innerHTML += "<a href='"+link+"'>"+name + "</a>";
            newBookmarkHolder.style.marginLeft = "30px";
            var removeBookmarkImg = document.createElement("img");
            removeBookmarkImg.src = "https://cdn1.iconfinder.com/data/icons/perfect-flat-icons-2/512/Erase-2.png";
            removeBookmarkImg.style.height = "15px";
            removeBookmarkImg.style.width = "15px";
            removeBookmarkImg.style.cursor = "pointer";
            removeBookmarkImg.style.marginLeft = "10px";
            removeBookmarkImg.style.verticalAlign = "middle";
            removeBookmarkImg.id = "remove_"+id;
            
            removeBookmarkImg.setAttribute("onclick", 'var bookmarks = JSON.parse(localStorage.getItem("df_bookmarks"));delete bookmarks[this.parentElement.id];localStorage.setItem("df_bookmarks", JSON.stringify(bookmarks));this.parentElement.outerHTML = ""; ');
            newBookmarkHolder.appendChild(removeBookmarkImg);
            document.getElementById("new_bookmark_holder").appendChild(newBookmarkHolder);
            var bookmarks = localStorage.getItem("df_bookmarks")? JSON.parse(localStorage.getItem("df_bookmarks")) : {};
            bookmarks[newBookmarkHolder.id] = name+"|"+link;
            localStorage.setItem("df_bookmarks", JSON.stringify(bookmarks));
        }
        appendScript(createBookmark.toString());
        function loadBookmarks(){
            if(localStorage.getItem("df_bookmarks")){
                var bookmarks = JSON.parse(localStorage.getItem("df_bookmarks"));
                for(var id in bookmarks){
                    var bookmark = bookmarks[id].split("|");
                    createBookmark(bookmark[0], bookmark[1], id);
                }
            }
        }
        function createAddBookmark(){
            function addBookmark(){
                var name = prompt("Please enter a name for the bookmark");
                if(name){
                    var link = prompt("Please enter a link for the bookmark (Don't forget the http:// or https:// at the begining of the address)", location.href);
                    if(link){
                        var amountBookmarks = localStorage.getItem("amountBookmarks");
                        if(!amountBookmarks){
                            localStorage.setItem("amountBookmarks", 0);
                        }
                        createBookmark(name, link, "bookmark_"+(amountBookmarks+1));
                        localStorage.setItem("amountBookmarks", parseInt(localStorage.getItem("amountBookmarks"))+1);
                    }
                    else{
                        alert("Error adding bookmark");
                    }
                }
                else{
                    alert("Error adding bookmark");
                }
            }
            appendScript(addBookmark.toString());
            
            var addBookmarkImg = document.createElement("img");
            addBookmarkImg.src = "https://puu.sh/xqUuv/a40853e448.png";
            addBookmarkImg.style.height = "30px";
            addBookmarkImg.style.position = "relative";
            addBookmarkImg.style.cursor = "pointer";
            addBookmarkImg.style.marginBottom = "10px";
            addBookmarkImg.style.right = "12px";
            addBookmarkImg.style.bottom = "5px";
            addBookmarkImg.style.float = "right";
            addBookmarkImg.setAttribute("onclick", "addBookmark()");
            document.getElementById("menu_holder").appendChild(addBookmarkImg);
        }
        
        var menuHolder = document.createElement("div");
        menuHolder.style.position = "relative";
        menuHolder.style.top = "10px";
        menuHolder.id = "menu_holder";
        var bookmarkHolder = document.createElement("span");
        bookmarkHolder.id = "new_bookmark_holder";
        menuHolder.appendChild(bookmarkHolder);
        var table = document.getElementsByTagName("table")[7];
        table.appendChild(menuHolder);
        loadBookmarks();
        createAddBookmark();
    }

    var outpostImg = document.createElement("img");
    outpostImg.src = "http://i.imgur.com/JBiQcYr.png";
    outpostImg.src = "http://i.imgur.com/tx2pDJl.png";
    outpostImg.height = "60";
    elements.outpostLink = document.createElement("a");
    elements.outpostLink.href = "https://fairview.deadfrontier.com/onlinezombiemmo/index.php";
    elements.outpostLink.appendChild(outpostImg);
    elements.outpostLink.style.float += " left";
    elements.outpostLink.style.textAlign = "center";
    elements.outpostLink.style.marginLeft = "-6px";

    var creditImg = document.createElement("img");
    creditImg.src = "http://i.imgur.com/0hHHAX1.png";
    creditImg.src = "http://i.imgur.com/UyeDNSv.png";
    creditImg.height = "60";
    elements.creditLink = document.createElement("a");
    elements.creditLink.href = "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=28";
    elements.creditLink.appendChild(creditImg);
    elements.creditLink.style.float += " left";
    elements.creditLink.style.textAlign = "center";
    elements.creditLink.style.marginLeft = "-13px";

    var forumImg = document.createElement("img");
    forumImg.src = "http://i.imgur.com/3LWYg6a.png";
    forumImg.src = "http://i.imgur.com/EqPoo0t.png";
    forumImg.height = "60";
    elements.forumLink = document.createElement("a");
    elements.forumLink.href = "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=forum";
    elements.forumLink.appendChild(forumImg);
    elements.forumLink.style.float += " left";
    elements.forumLink.style.textAlign = "center";
    elements.forumLink.style.marginLeft = "-13px";

    var marketImg = document.createElement("img");
    marketImg.src = "http://i.imgur.com/xgof6pH.png";
    marketImg.src = "http://i.imgur.com/EM5maHZ.png";
    marketImg.height = "60";
    elements.marketLink = document.createElement("a");
    elements.marketLink.href = "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35";
    elements.marketLink.appendChild(marketImg);
    elements.marketLink.style.float += " left";
    elements.marketLink.style.textAlign = "center";
    elements.marketLink.style.marginLeft = "-13px";

    var bankImg = document.createElement("img");
    bankImg.src = "http://i.imgur.com/P9FdoTu.png";
    bankImg.src = "http://i.imgur.com/mvVrjK5.png";
    bankImg.height = "60";
    elements.bankLink = document.createElement("a");
    elements.bankLink.href = "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=15";
    elements.bankLink.appendChild(bankImg);
    elements.bankLink.style.float += " left";
    elements.bankLink.style.textAlign = "center";
    elements.bankLink.style.marginLeft = "-13px";

    var storageImg = document.createElement("img");
    storageImg.src = "http://i.imgur.com/T5YJt8q.png";
    storageImg.src = "http://i.imgur.com/1LA73eo.png";
    storageImg.height = "60";
    elements.storageLink = document.createElement("a");
    elements.storageLink.href = "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=50";
    elements.storageLink.appendChild(storageImg);
    elements.storageLink.style.float += " left";
    elements.storageLink.style.textAlign = "center";
    elements.storageLink.style.marginLeft = "-13px";

    var logoutImg = document.createElement("img");
    logoutImg.src = "http://i.imgur.com/4vd3009.png";
    logoutImg.src = "http://i.imgur.com/xMV60fY.png";
    logoutImg.height = "60";
    elements.logoutLink = document.createElement("a");
    elements.logoutLink.href = getLogoutLink();
    elements.logoutLink.appendChild(logoutImg);
    elements.logoutLink.style.float = "right";
    elements.logoutLink.style.marginRight = "-6px";
    elements.logoutLink.style.textAlign = "center";

    var profileImg = document.createElement("img");
    profileImg.src = "http://i.imgur.com/0WasEGC.png";
    profileImg.src = "http://i.imgur.com/EWqNRos.png";
    profileImg.height = "59";
    elements.profileLink = document.createElement("a");
    elements.profileLink.href = "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=profile";
    elements.profileLink.style.float = "right";
    elements.profileLink.appendChild(profileImg);
    elements.profileLink.style.textAlign = "center";
    elements.profileLink.style.marginRight = "-13px";

    /*var inventoryImg = document.createElement("img");
    inventoryImg.src = "http://i.imgur.com/n3ZvMLR.png";
    inventoryImg.src = "http://i.imgur.com/mguv0Gp.png";
    inventoryImg.height = "60";
    elements.inventoryLink = document.createElement("a");
    elements.inventoryLink.href = "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=25";
    elements.inventoryLink.style.float = "right";
    elements.inventoryLink.appendChild(inventoryImg);
    elements.inventoryLink.style.textAlign = "center";
    elements.inventoryLink.style.marginRight = "-13px";*/

    var yardImg = document.createElement("img");
    yardImg.src = "http://i.imgur.com/7nI2BaQ.png";
    yardImg.src = "http://i.imgur.com/mn7jJJj.png";
    yardImg.height = "60";
    elements.yardLink = document.createElement("a");
    elements.yardLink.href = "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=24";
    elements.yardLink.style.float = "right";
    elements.yardLink.appendChild(yardImg);
    elements.yardLink.style.textAlign = "center";
    elements.yardLink.style.marginRight = "-13px";

    function getLogoutLink(){
        return $("img[name=logout]").parent()[0].href;
    }

    var table = document.getElementsByTagName("table")[7];
    table.innerHTML = "<div id=bookmark_holder>";
    dst = document.getElementById("bookmark_holder");
    dst.style.overflow = "hidden";

    for(var element in elements){
        if(element.indexOf("Link") > -1){
            dst.appendChild(elements[element]);
        }
    }
    table.style.backgroundImage = "url(https://puu.sh/xm1DU/7f0d182487.png)";
    table.style.transform = "scaleY(1.2)";
    table.style.position = "relative";
    table.style.top = "5px";

    var annoyingBiatch = document.getElementsByTagName("tr")[1];
    annoyingBiatch.style.height = "220px";
    
    appendScript(createMenu.toString());
})();