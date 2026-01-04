// ==UserScript==
// @name         [HWM] Market favourites
// @namespace    https://greasyfork.org/en/users/242258
// @description  Adds favourites section to the market page
// @version      0.1
// @author       Alex_2oo8
// @match        https://www.heroeswm.ru/auction.php*
// @downloadURL https://update.greasyfork.org/scripts/388078/%5BHWM%5D%20Market%20favourites.user.js
// @updateURL https://update.greasyfork.org/scripts/388078/%5BHWM%5D%20Market%20favourites.meta.js
// ==/UserScript==
(function(fn) {
	var newScript = document.createElement('script');
	newScript.setAttribute("type", "application/javascript");
	newScript.textContent = '(' + fn + ')();';
	(document.body || document.head || document.documentElement).appendChild(newScript);
	newScript.parentNode.removeChild(newScript);
})(function() {
    if (localStorage.getItem("MarketFavourites") === null) localStorage.setItem("MarketFavourites", "[]");

    var favList = JSON.parse(localStorage.getItem("MarketFavourites"));

    var loc = new URL(location.href);
    if (loc.searchParams.has("art_type")) {
        var art = loc.searchParams.get("art_type");

        var forms = document.getElementsByTagName("form"), selectionForm = null;
        for (var j = 0; j < forms.length; j++) {
            if (forms[j].name == "sel") {
                selectionForm = forms[j];
            }
        }

        if (selectionForm !== null) {
            var label = document.createElement("label");
            var cb = document.createElement("input");
            cb.type = "checkbox";
            cb.checked = favList.indexOf(art) != -1;
            cb.onchange = function() {
                favList = JSON.parse(localStorage.getItem("MarketFavourites"));
                var id = favList.indexOf(art);
                if (cb.checked) {
                    if (id == -1) favList.push(art);
                }
                else {
                    if (id != -1) favList.splice(id, 1);
                }

                localStorage.setItem("MarketFavourites", JSON.stringify(favList));
            };
            label.appendChild(document.createTextNode("Избранное"));
            label.appendChild(cb);
            label.style.marginLeft = "10px";
            selectionForm.appendChild(label);
        }
    }

    var elem = document.getElementById("mark_helm");

    var elems = elem.parentNode.children, cats = [];
    for (var i = 0; i < elems.length; i++) {
        if (elems[i].tagName == "DIV" && elems[i].id.startsWith("mark_info_") && elems[i].innerHTML == "") {
            cats.push(elems[i].id.substr(10));
        }
    }

    for (i = 0; i < cats.length; i++) {
        window["a_" + cats[i]]();
    }

    var as = elem.parentNode.getElementsByTagName("a"), favLinks = [];
    for (i = 0; i < as.length; i++) {
        if (as[i].parentNode.id.startsWith("mark_info_") == false) continue;

        var href = new URL(as[i].href);
        if (href.searchParams.has("art_type") && favList.indexOf(href.searchParams.get("art_type")) != -1) {
            var a = as[i].cloneNode(true);
            favLinks.push(a);
        }
    }

    for (i = 0; i < cats.length; i++) {
        window["a2_" + cats[i]]();
    }

    var infoFav = document.createElement("div");
    infoFav.style.display = "none";

    favLinks.sort(function(a1, a2) { return a1.innerHTML < a2.innerHTML ? -1 : 1; });
    for (i = 0; i < favLinks.length; i++) {
        a = favLinks[i];
        a.href += "&fav=1";
        infoFav.appendChild(document.createTextNode("\u00A0\u00A0\u00A0"));
        infoFav.appendChild(a);
        infoFav.appendChild(document.createElement("br"));
    }

    if (loc.searchParams.has("fav")) {
        infoFav.style.display = "";
        window["a2_" + loc.searchParams.get("cat")]();
    }

    var markFav = document.createElement("div");

    var title = document.createElement("a");
    title.innerHTML = "Избранное";
    title.href = "#";
    title.onclick = function() {
        infoFav.style.display = (infoFav.style.display == "" ? "none" : "");
        return false;
    };

    markFav.appendChild(title);
    markFav.appendChild(document.createTextNode(" (" + favLinks.length + ")"));

    elem.parentNode.insertBefore(markFav, elem);
    elem.parentNode.insertBefore(infoFav, elem);
    elem.parentNode.insertBefore(document.createElement("br"), elem);
});
