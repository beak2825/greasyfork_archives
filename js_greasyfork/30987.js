// ==UserScript==
// @author Hate, Rexedead
// @name SteamWishListTool - Steam Wishlist Organizer
// @version 1.3.2
// @description Oranize Steam Wishlist Collection via categories and tags
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @namespace https://github.com/Rexedead/SteamWishlistTool
// @run-at document-end
// @include *steamcommunity.com/id/*/wishlist*
// @include *steamcommunity.com/profiles/*/wishlist*
// @downloadURL https://update.greasyfork.org/scripts/30987/SteamWishListTool%20-%20Steam%20Wishlist%20Organizer.user.js
// @updateURL https://update.greasyfork.org/scripts/30987/SteamWishListTool%20-%20Steam%20Wishlist%20Organizer.meta.js
// ==/UserScript==


(function () {
    'use strict';
    // Your code here...
    //ИТА ЩЕДЕВРЕЛЬНЭ! ©Hate
    // GM_deleteValue("");

    window.addEventListener("load", Greasemonkey_main, false);

    function Greasemonkey_main() {

        var DivBar = document.createElement('div');
        var addTextField = document.createElement('input');
        var addButton = document.createElement('button');
        var child = document.getElementById('wishlist_items');
        var span = document.createElement('span');
        var categoryList = document.createElement('div');
        var donBut = document.createElement('button');
        var donSpan = document.createElement('span');
        var userid = window.location.href.split('/')[4];

        console.log("ID for this page is: " + userid);

        var observer;

        span.appendChild(document.createTextNode("Add new category"));

        addButton.appendChild(span);
        addButton.className = "btnv6_blue_hoverfade btn_small ";
        addButton.type = "button";
        addButton.onclick = formcheck;
        addButton.style = "outline: none;";

        addTextField.type = "text";
        addTextField.name = "TextField";
        addTextField.onkeydown = enterf;

        DivBar.style = "margin-bottom: 13px;";
        DivBar.className = "Add_Button_Bar";
        DivBar.id = "barName";

        donSpan.appendChild(document.createTextNode("DONATE"));
        donSpan.style = "color: rgb(255, 249, 0);";

        donBut.className = "btnv6_blue_hoverfade btn_small ";
        donBut.type = "button";
        donBut.appendChild(donSpan);
        donBut.style = "outline: none;";
        donBut.id = "donate";
        donBut.onclick = donate;

        categoryList.className = "categoryList";
        categoryList.classList.add("droptarget");

        DivBar.appendChild(addTextField);
        DivBar.appendChild(addButton);
        DivBar.appendChild(donBut);
        child.parentNode.insertBefore(DivBar, child);
        child.insertBefore(categoryList, child.firstChild);
        child.classList.add("droptarget");
        restore();


        //Functions
        function enterf(e) {
            if (e.keyCode == 13) {
                formcheck();
            }
        }


        function save() {

            var stringOfSave = "";
            var arrOfDetails;

            arrOfDetails = categoryList.childNodes;
            for (var inD = 0; inD < arrOfDetails.length; inD++) {
                stringOfSave += (categoryList.childNodes[inD].className);
                var cat_items = arrOfDetails[inD].querySelectorAll('.wishlistRow');
                for (var j = 0; j < cat_items.length; j++) {
                    var item_id = cat_items[j].id; //В переменной item_id хранится id j элемента категории
                    stringOfSave += "," + item_id;
                }
                stringOfSave += "^";
            }
            stringOfSave = stringOfSave.replace(/\^$/, "");

            //console.log(stringOfSave.valueOf());

            GM_setValue(userid, stringOfSave);

        }

        function restore() {

            //DEBUG START
            var arry = [];
            arry = GM_listValues();
            var p = arry.length;
            console.log('##=## GM_listValues ' + p);
            for (p = arry.length - 1; p > -1; p--) {
                console.log('##=## ' + p + '  ' + arry[p] + ' = ' + GM_getValue(arry[p]));
            }
            //DEBUG END

            try {
                var restoreWishlistSave = GM_getValue(userid);

                if (restoreWishlistSave.length > 0) {
                    var wlitemsUns = restoreWishlistSave.valueOf().split("^");
                    var wlItemsByCat;
                    for (var cat = 0; cat < wlitemsUns.length; cat++) {
                        wlItemsByCat = wlitemsUns[cat].valueOf().split(",");
                        addTag(wlItemsByCat[0]);
                        var category = child.getElementsByClassName(wlItemsByCat[0]);
                        for (var item = 1; item < wlItemsByCat.length; item++) {
                            try {
                                var game = document.getElementById(wlItemsByCat[item]);
                                category[0].appendChild(game);
                            }
                            catch (npe) {
                                console.log("list modified");
                            }
                        }
                    }
                    //console.log(wlItemsByCat[0]);
                    // console.log(wlitems);
                }
            }
            catch (newpage) {

            }
        }

        function addGameInCategory(addInCategoryButton) {
            var activeButtons = document.querySelectorAll('.push');
            var addSpan = addInCategoryButton.firstElementChild;

            addInCategoryButton.parentNode.lastChild.onclick = cancel;
            addInCategoryButton.parentNode.lastChild.firstElementChild.textContent = "Cancel";

            for (var i = 0; i < activeButtons.length; i++) {
                activeButtons[i].firstElementChild.textContent = "Add games";
                activeButtons[i].classList.remove("push");
                var button = activeButtons[i];
                activeButtons[i].onclick = function () { addGameInCategory(button); };
            }

            function cancel() {
                addInCategoryButton.firstElementChild.textContent = "Add games";
                addInCategoryButton.onclick = again;
                addInCategoryButton.parentNode.lastChild.onclick = function () { remGames(addInCategoryButton.parentNode.lastChild); };
                addInCategoryButton.parentNode.lastChild.firstElementChild.textContent = "Remove games";
                var game = document.querySelectorAll('.selection');
                for (var i = 0; i < game.length; i++) {
                    game[i].parentNode.remove();
                }
            }

            addSpan.textContent = "Add selected games";

            addInCategoryButton.onclick = addInCurrentCategory;
            addInCategoryButton.classList.add("push");

            addCheckBox();

            function again() {
                addGameInCategory(addInCategoryButton);
            }

            function addInCurrentCategory() {
                addList(addInCategoryButton);
            }


        }

        function addList(addInCategoryButton) {
            var game = document.querySelectorAll('.selection');
            addInCategoryButton.lastChild.textContent = "Add games";
            addInCategoryButton.onclick = again;
            var games = addInCategoryButton.parentNode.parentNode.querySelectorAll('.wishlistRow');
            var col = addInCategoryButton.parentNode.parentNode.firstChild.getElementsByClassName('num')[0].firstChild;

            for (var i = 0; i < game.length; i++) {
                if (game[i].checked) {
                    observer.observe(game[i].parentNode.parentNode, {
                        attributes: true,
                    });
                    game[i].parentNode.parentNode.classList.add("inCategory");
                    addInCategoryButton.parentNode.parentNode.appendChild(game[i].parentNode.parentNode);
                    col.nodeValue = Number(col.nodeValue) + 1;
                }
                game[i].parentNode.remove();
                //addInCategoryButton.parentNode.lastChild.onclick = function () { remGames(addInCategoryButton.parentNode.lastChild); };
                addInCategoryButton.parentNode.lastChild.firstElementChild.textContent = "Remove games";
            }

            function again() {
                addGameInCategory(addInCategoryButton);
            }
            save();

        }

        function remGames(Button) {
            Button.parentNode.firstElementChild.onclick = cancel;
            Button.parentNode.firstElementChild.firstElementChild.textContent = "Cancel";
            delCheckBox(Button);
            Button.lastChild.textContent = "Remove Selected Games";
            Button.onclick = remFromList;

            function delGame() {
                remGames(Button);
            }

            function cancel() {
                Button.firstElementChild.textContent = "Remove Games";
                Button.onclick = delGame;
                Button.parentNode.firstElementChild.onclick = function () { addGameInCategory(Button.parentNode.firstElementChild); };
                Button.parentNode.firstElementChild.firstElementChild.textContent = "Add games";
                var sfrgame = Button.parentNode.parentNode.querySelectorAll('.selection');
                for (var i = 0; i < sfrgame.length; i++) {
                    sfrgame[i].parentNode.remove();
                }
            }

            function remFromList() {
                var game = Button.parentNode.parentNode.querySelectorAll('.inCategory');
                var sfrgame = Button.parentNode.parentNode.querySelectorAll('.selection');
                var col = Button.parentNode.parentNode.firstChild.getElementsByClassName('num')[0].firstChild;
                for (var i = 0; i < sfrgame.length; i++) {
                    if (sfrgame[i].checked) {
                        game[i].parentNode.parentNode.parentNode.appendChild(game[i]);
                        col.nodeValue = Number(col.nodeValue) - 1;
                        game[i].classList.remove("inCategory");
                    }
                    sfrgame[i].parentNode.remove();
                }
                Button.firstElementChild.textContent = "Remove Games";
                Button.onclick = delGame;
                Button.parentNode.firstElementChild.onclick = function () { addGameInCategory(Button.parentNode.firstElementChild); };
                Button.parentNode.firstElementChild.firstElementChild.textContent = "Add games";
                save();
            }
        }

        function formcheck() {
            if (addTextField.value === "") {
                alert("Error: empty field!");
            } else {
                if (categoryList.getElementsByClassName(addTextField.value).length > 0) {
                    alert("This category already exists");
                } else {
                    addTag(addTextField.value);
                }
            }
        }

        function addTag(cat_name) {
            var category = document.createElement('details');
            var categoryName = document.createElement('summary');
            var addInCategoryButton = document.createElement('button');
            var remInCategoryButton = document.createElement('button');
            var remGamesButton = document.createElement('button');
            var addSpan = document.createElement('span');
            var remCatSpan = document.createElement('span');
            var remGamesSpan = document.createElement('span');
            var addRemoveDiv = document.createElement('div');
            var itemsNum = document.createElement('span');
            var sortOptionBar = document.createElement('div');
            var sortByPriceButton = document.createElement('button');
            var sortByNameButton = document.createElement('button');
            var sortByRankButton = document.createElement('button');
            observer = new MutationObserver(function (mutations) {

                mutations.forEach(function (mutation) {
                    if (mutation.attributeName === "class") {
                        category.addEventListener("mouseout", handl);
                    }
                });
            });

            itemsNum.classList.add("num");
            itemsNum.appendChild(document.createTextNode("0"));

            sortOptionBar.appendChild(document.createTextNode("Sort by: "));
            sortOptionBar.appendChild(sortByRankButton);
            sortOptionBar.appendChild(sortByNameButton);
            sortOptionBar.appendChild(sortByPriceButton);
            sortOptionBar.style = "float: right; outline: none; font-size: 11px; color: #56707f; padding: 0 15px;";

            sortByRankButton.className = "btnv6_blue_hoverfade btn_small ";
            sortByRankButton.appendChild(document.createTextNode("by rank"));
            sortByRankButton.type = "button";
            sortByRankButton.onclick = sortByRankIncreas;
            sortByRankButton.style = "line-height: 22px; padding: 0 15px;";


            sortByPriceButton.className = "btnv6_blue_hoverfade btn_small ";
            sortByPriceButton.appendChild(document.createTextNode("by price"));
            sortByPriceButton.type = "button";
            sortByPriceButton.onclick = sortByPriceIncreas;
            sortByPriceButton.style = "line-height: 22px; padding: 0 15px;";
            

            sortByNameButton.className = "btnv6_blue_hoverfade btn_small ";
            sortByNameButton.appendChild(document.createTextNode("by name"));
            sortByNameButton.type = "button";
            sortByNameButton.onclick = sortByNameIncreas;
            sortByNameButton.style = "line-height: 22px; padding: 0 15px;";
            

            function handl(event) {
                var col = this.firstChild.getElementsByClassName('num')[0].firstChild;
                var drag = categoryList.querySelectorAll('.inDrag');
                if (drag.length > 0) {
                    //alert("asd");
                    drag[0].classList.remove("inCategory");
                    col.nodeValue = Number(col.nodeValue) - 1;
                    child.appendChild(drag[0]);
                    save();
                }
                category.removeEventListener("mouseout", handl);
            }

            addSpan.appendChild(document.createTextNode("Add games"));
            remCatSpan.appendChild(document.createTextNode("Remove Category"));
            remGamesSpan.appendChild(document.createTextNode("Remove Games"));

            addInCategoryButton.appendChild(addSpan);
            addInCategoryButton.className = "btnv6_blue_hoverfade btn_small ";
            addInCategoryButton.type = "button";
            addInCategoryButton.onclick = add;
            addInCategoryButton.style = "outline: none;";

            remInCategoryButton.appendChild(remCatSpan);
            remInCategoryButton.className = "btnv6_blue_hoverfade btn_small ";
            remInCategoryButton.style = "float: right; outline: none;";
            remInCategoryButton.type = "button";
            remInCategoryButton.onclick = del;

            remGamesButton.appendChild(remGamesSpan);
            remGamesButton.className = "btnv6_blue_hoverfade btn_small ";
            remGamesButton.type = "button";
            remGamesButton.onclick = delGame;
            remGamesButton.style = "outline: none;";

            addRemoveDiv.appendChild(addInCategoryButton);
            addRemoveDiv.appendChild(remGamesButton);
            addRemoveDiv.style = "margin-bottom: 2%";

            categoryName.appendChild(document.createTextNode(cat_name)); //get user text input
            categoryName.appendChild(document.createTextNode(" ("));
            categoryName.appendChild(itemsNum);
            categoryName.appendChild(document.createTextNode(")"));
            categoryName.appendChild(sortOptionBar);
            categoryName.style = "font-size: 16px; font-weight: 300; color: #ffffff; padding: 5px; cursor: default; cursor: default; cursor: -moz-default; outline: none;";
            categoryName.appendChild(remInCategoryButton);
            category.appendChild(categoryName);
            category.appendChild(addRemoveDiv);
            category.className = cat_name;

            category.style = "min-height: inherit; background-color: rgba( 84, 133, 183, 0.2); color: #56707f; padding: 8px 1%; margin-bottom: 15px; position: relative;";
            category.addEventListener("DOMNodeInserted", function (event) {
                var games = category.querySelectorAll('.wishlistRow');
                var col = category.firstChild.getElementsByClassName('num')[0].firstChild;
                for (var i = 0; i < games.length; i++) {
                    if (!games[i].classList.contains('inCategory')) {
                        observer.observe(games[i], {
                            attributes: true
                        });
                        games[i].classList.add("inCategory");
                        col.nodeValue = Number(col.nodeValue) + 1;
                        save();
                    }
                }
            });

            addTextField.value = null;

            categoryList.appendChild(category);
            save();

            function add() {
                addGameInCategory(addInCategoryButton);
            }

            function del() {
                var gamesMas = category.querySelectorAll('.inCategory');
                var cat = category.parentNode.parentNode;
                for (var i = 0; i <= gamesMas.length - 1; i++) {
                    gamesMas[i].classList.remove("inCategory");
                    cat.appendChild(gamesMas[i]);
                }
                if (category.querySelectorAll('.push').length > 0) {
                    var game = document.querySelectorAll('.selection');
                    for (var j = 0; j < game.length; j++) {
                        game[j].parentNode.remove();
                    }
                }
                category.remove();
                save();
            }

            function delGame() {
                remGames(remGamesButton);
            }

            function sortByRankIncreas() {

                var items = Array.prototype.slice.call(category.querySelectorAll('.wishlistRow'));
                for (var AllItems = items.length - 1; AllItems >= 0; AllItems--) {
                    for (var item = 0; item < AllItems; item++) {
                        if (Number(items[item].getElementsByClassName('wishlist_rank')[0].value) > Number(items[item + 1].getElementsByClassName('wishlist_rank')[0].value)) {
                            var temp = items[item];
                            items[item] = items[item + 1];
                            items[item + 1] = temp;
                        }
                    }
                }

                for (var i = 0; i < items.length; i++) {
                    category.appendChild(items[i]);
                }
                sortByRankButton.onclick = sortByRankDecreas;
            }

            function sortByRankDecreas() {

                var items = Array.prototype.slice.call(category.querySelectorAll('.wishlistRow'));
                for (var AllItems = items.length - 1; AllItems >= 0; AllItems--) {
                    for (var item = 0; item < AllItems; item++) {
                        if (Number(items[item].getElementsByClassName('wishlist_rank')[0].value) < Number(items[item + 1].getElementsByClassName('wishlist_rank')[0].value)) {
                            var temp = items[item];
                            items[item] = items[item + 1];
                            items[item + 1] = temp;
                        }
                    }
                }

                for (var i = 0; i < items.length; i++) {
                    category.appendChild(items[i]);
                }
                sortByRankButton.onclick = sortByRankIncreas;
            }

            function sortByNameIncreas() {

                var items = Array.prototype.slice.call(category.querySelectorAll('.wishlistRow'));
                for (var AllItems = items.length - 1; AllItems >= 0; AllItems--) {
                    for (var item = 0; item < AllItems; item++) {
                        if (items[item].getElementsByTagName('h4')[0].firstChild.nodeValue.charAt(0) > items[item + 1].getElementsByTagName('h4')[0].firstChild.nodeValue.charAt(0)) {
                            var temp = items[item];
                            items[item] = items[item + 1];
                            items[item + 1] = temp;
                        }
                    }
                }

                for (var i = 0; i < items.length; i++) {
                    category.appendChild(items[i]);
                }
                sortByNameButton.onclick = sortByNameDecreas;
            }

            function sortByNameDecreas() {

                var items = Array.prototype.slice.call(category.querySelectorAll('.wishlistRow'));
                for (var AllItems = items.length - 1; AllItems >= 0; AllItems--) {
                    for (var item = 0; item < AllItems; item++) {
                        if (items[item].getElementsByTagName('h4')[0].firstChild.nodeValue.charAt(0) < items[item + 1].getElementsByTagName('h4')[0].firstChild.nodeValue.charAt(0)) {
                            var temp = items[item];
                            items[item] = items[item + 1];
                            items[item + 1] = temp;
                        }
                    }
                }

                for (var i = 0; i < items.length; i++) {
                    category.appendChild(items[i]);
                }
                sortByNameButton.onclick = sortByNameIncreas;
            }

            function sortByPriceIncreas() {

                var items = Array.prototype.slice.call(category.querySelectorAll('.wishlistRow'));
                for (var AllItems = items.length - 1; AllItems >= 0; AllItems--) {
                    for (var item = 0; item < AllItems; item++) {
                        var first = select(items[item]);
                        var second = select(items[item + 1]);
                        //alert(items[item].getElementsByClassName('price').length);
                        if (first > second) {
                            var temp = items[item];
                            items[item] = items[item + 1];
                            items[item + 1] = temp;
                        }
                    }
                }

                function select(check) {
                    try {
                        return Number(check.getElementsByClassName('discount_final_price')[0].firstChild.nodeValue.substring(0, check.getElementsByClassName('discount_final_price')[0].firstChild.nodeValue.indexOf(" ")));
                    } catch (ErrEvent) {
                        return Number(check.getElementsByClassName('price')[0].firstChild.nodeValue.trim().substring(0, check.getElementsByClassName('price')[0].firstChild.nodeValue.trim().indexOf(" ")));
                    }
                }

                for (var i = 0; i < items.length; i++) {
                    category.appendChild(items[i]);
                }
                sortByPriceButton.onclick = sortByPriceDecreas;
            }

            function sortByPriceDecreas() {

                var items = Array.prototype.slice.call(category.querySelectorAll('.wishlistRow'));
                for (var AllItems = items.length - 1; AllItems >= 0; AllItems--) {
                    for (var item = 0; item < AllItems; item++) {
                        var first = select(items[item]);
                        var second = select(items[item + 1]);
                        //alert(items[item].getElementsByClassName('price').length);
                        if (first < second) {
                            var temp = items[item];
                            items[item] = items[item + 1];
                            items[item + 1] = temp;
                        }
                    }
                }

                function select(check) {
                    try {
                        return Number(check.getElementsByClassName('discount_final_price')[0].firstChild.nodeValue.substring(0, check.getElementsByClassName('discount_final_price')[0].firstChild.nodeValue.indexOf(" ")));
                    } catch (ErrEvent) {
                        return Number(check.getElementsByClassName('price')[0].firstChild.nodeValue.trim().substring(0, check.getElementsByClassName('price')[0].firstChild.nodeValue.trim().indexOf(" ")));
                    }
                }

                for (var i = 0; i < items.length; i++) {
                    category.appendChild(items[i]);
                }
                sortByPriceButton.onclick = sortByPriceIncreas;
            }


        }

        function delCheckBox(Button) {
            var game = Button.parentNode.parentNode.querySelectorAll('.inCategory');
            function check() {
                if (this.firstElementChild.checked === false) {
                    this.firstElementChild.checked = true;
                } else {
                    this.firstElementChild.checked = false;
                }
            }

            for (var i = 0; i <= game.length - 1; i++) {
                if (game[i].classList.contains('inCategory')) {
                    var checkBox = document.createElement('input');
                    var text = document.createElement('button');
                    text.appendChild(checkBox);
                    text.appendChild(document.createTextNode("Select for remove"));
                    text.className = "btnv6_blue_hoverfade btn_small ";
                    text.style = "cursor: default; cursor: pointer; cursor: -moz-default; outline: none;position: relative; display: block; padding-right: 1%; margin-top: 1%;";
                    text.type = "button";
                    text.onclick = check;
                    checkBox.type = "checkbox";
                    checkBox.className = "selection";
                    game[i].appendChild(text);
                }
            }

        }

        function addCheckBox() {
            var game = document.querySelectorAll('.wishlistRow');
            function check() {
                if (this.firstElementChild.checked === false) {
                    this.firstElementChild.checked = true;
                } else {
                    this.firstElementChild.checked = false;
                }
            }

            for (var i = 0; i <= game.length - 1; i++) { //PROBLEM PLACE
                if (!game[i].classList.contains('inCategory') && game[i].querySelectorAll('.selection').length <= 0) {
                    var checkBox = document.createElement('input');
                    var text = document.createElement('button');
                    text.appendChild(checkBox);
                    text.appendChild(document.createTextNode("Add game to category"));
                    text.className = "btnv6_blue_hoverfade btn_small ";
                    text.style = "cursor: default; cursor: pointer; cursor: -moz-default; outline: none; position: relative; display: block; padding-right: 1%; margin-top: 1%;";
                    text.type = "button";
                    text.onclick = check;
                    checkBox.type = "checkbox";
                    checkBox.className = "selection";
                    game[i].appendChild(text);
                }
            }
        }

        function donate() {
            GM_addStyle(" .donatip {  position: relative; display: inline-block;}  .donatip .donatiptext { visibility: hidden; width: 120px; background-color: #2B475E; color: #67C1F5; text-align: center; border-radius: 6px; padding: 5px 0; /* Position the donatip */ position: absolute;  z-index: 1; bottom: 100%; left: 50%; margin-left: -60px;} .donatip:hover .donatiptext {visibility: visible;}");
            donBut.firstChild.textContent = "Cancel";
            donBut.onclick = cancel;
            var help = document.createElement('span');
            help.className = 'help';
            help.innerHTML = '<a target="_blank" class="donatip" href="https://steamcommunity.com/tradeoffer/new/?partner=22861895&token=GtBPPaCq">' +
                '<img  src="/public/shared/images/header/globalheader_logo.png" height="20">' +
                ' <span class="donatiptext">Help us via items</span>' +
                '</a>' +
                '<a target="_blank" class="donatip" href="https://www.paypal.me/rexedead">' +
                '<img  src="https://www.paypalobjects.com/webstatic/i/logo/rebrand/ppcom-white.svg" height="18">' +
                '<span class="donatiptext">Help us via cent</span>' +
                '</a>';
            help.style = "position:absolute; margin-left:5px;";

            var donParent = document.getElementById("barName");
            donParent.appendChild(help);

            function cancel() {
                donParent.removeChild(help);
                donBut.firstChild.textContent = "DONATE";
                donBut.onclick = donate;
            }
        }
    }

})();
