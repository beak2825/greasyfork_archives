// ==UserScript==
// @name		Prisjakt BB-Kod
// @namespace	OTzyVGxCfaZOhDmNIFa1
// @author		LemonIllusion
// @version		1.5.4
// @match		https://www.prisjakt.nu/*
// @description	Lägger till knappar med BB-Kod på produktsidor och listor
// @downloadURL https://update.greasyfork.org/scripts/4086/Prisjakt%20BB-Kod.user.js
// @updateURL https://update.greasyfork.org/scripts/4086/Prisjakt%20BB-Kod.meta.js
// ==/UserScript==

// Definiera variabler
var currURL = window.location.href; // Nuvarande sidas URL

// Produktklass
class Product {
    constructor(name, id, category = false, price = false, retailLink = false, retailer = false) {
        this.name = name;
        this.id = id;
        this.category = category;
        this.price = price;
        this.retailLink = retailLink;
        this.retailer = retailer;
    }

    getLink() {
        return '[url="https://www.prisjakt.nu/produkt.php?p=' + this.id + '"][b]' + this.name + "[/b][/url]";
    }

    getImage() {
        return '[url="https://www.prisjakt.nu/produkt.php?p=' + this.id + '"][img]https://cdn.pji.nu/product/standard/280/' + this.id + ".jpg[/img][/url]";
    }

    getBoth() {
        return '[url="https://www.prisjakt.nu/produkt.php?p=' + this.id + '"][b]' + this.name + "[/b]\n[img]https://cdn.pji.nu/product/standard/280/" + this.id + ".jpg[/img][/url]";
    }

    getTableRow(showCat = true) {
        var result = "[tr]";
        if (showCat && this.category) {
            result += '[td valign="middle"][b]' + this.category + "[/b][/td]";
        }
        result += '[td valign="middle"][center][url="https://www.prisjakt.nu/produkt.php?p=' + this.id + '"][img static]https://cdn.pji.nu/product/standard/50/' + this.id + ".jpg[/img][/url][/center][/td]";
        result += '[td valign="middle"][url="https://www.prisjakt.nu/produkt.php?p=' + this.id + '"]' + this.name + "[/url][/td]";
        if (this.retailLink && this.price && !this.retailer) {
            result += '[td valign="middle"][url="' + this.retailLink +'"]' + intFormat(this.price) + "[/url][/td]";
        } else {
            if (this.price) {
                result += '[td valign="middle"]' + intFormat(this.price) + "[/td]";
            }
            if (this.retailLink && this.retailer) {
                result += '[td valign="middle"][url="' + this.retailLink + '"]' + this.retailer + "[/url][/td]";
            } else if (this.retailLink) {
                result += '[td valign="middle"][url="' + this.retailLink + '"]Butik[/url][/td]';
            } else if (this.retailer) {
                result += '[td valign="middle"]' + this.retailer + "[/td]";
            }
        }
        result += "[/tr]";
        return result;
    }
}

// Definiera funktioner
function copyPopup(text) {
    var textarea = document.createElement("textarea");
    textarea.id = "copyPopup";
    textarea.spellcheck = false;
    textarea.innerHTML = text;
    textarea.style.cssText = "width: 50%; height: 50%; position: fixed; top: 25%; left: 25%; box-shadow: 0px 0px 0px 2000px rgba(0,0,0,0.6);";
    document.body.appendChild(textarea);
    textarea.select();
    setTimeout(function(){
        window.addEventListener("click", closePopup);
    }, 0);
}

function closePopup(e) {
    var textarea = document.querySelector("body>#copyPopup");
    if (e.target != textarea) {
        window.removeEventListener("click", closePopup);
        document.body.removeChild(textarea);
    }
}

function createButton(buttonText, clickAction, css = "", insertBefore = document.querySelector("#page_header .fr")) { // Funktion för att skapa en knapp
    var input = document.createElement("button");
    input.className = "btn product";
    input.innerHTML = buttonText;
    input.onclick = clickAction;
    input.style.cssText = "border-radius: 4px 4px 0 0; padding-bottom: 2px;"+css;
    insertBefore.parentNode.insertBefore(input, insertBefore);
}

function intFormat(integer) {
    return integer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " :-"; // spaces are nbsp
}

function tablify(products, showCat = true, showSum = true) {
    var len = products.length;
    showSum = showSum && !!products[0].price;
    var sum = 0;

    table = "[table]";
    for (var i = 0; i < len; i++) {
        table += products[i].getTableRow(showCat);
        if (showSum) {
            sum += products[i].price;
        }
    }
    if (showSum) {
        table += "[tr][td][/td][td][/td][td][right][b]Summa:[/b][/right][/td][td]" + intFormat(sum) + "[/td][/tr]";
    }
    table += "[/table]";
    //console.log(table); //---------------------------------------------------DEBUG--DEBUG--DEBUG--DEBUG--DEBUG--DEBUG--DEBUG--DEBUG--DEBUG--DEBUG--DEBUG--DEBUG--DEBUG--DEBUG--DEBUG--DEBUG--DEBUG-----------------------------
    return table;
}

// Gör saker

if (currURL.split("?")[0] == "https://www.prisjakt.nu/produkt.php" && currURL.split("?")[1][0] != "j") { // Om nuvarande sida är en produktsida
    var product = new Product(
        document.getElementsByClassName("intro_header")[0].innerHTML, // namn
        document.getElementById("share_btn_top").getAttribute("data-page-item-id") // id
    );

    createButton("BB-Kod Länk", function(){ copyPopup(product.getLink()); }, "margin-left:31px");
    createButton("BB-Kod Bild", function(){ copyPopup(product.getImage()); }, "margin-left:6px");
    createButton("BB-Kod Länk och Bild", function(){ copyPopup(product.getBoth()); }, "margin-left:6px");
}

else if (currURL.split("?")[0] == "https://www.prisjakt.nu/list.php" || currURL.substring(0, 38) == "https://www.prisjakt.nu/produkt.php?j=" && currURL.split("https://www.prisjakt.nu/produkt.php?j=")[1] !== "") { // Om nuvarande sida är en lista eller jämförelse innehållandes produkter
    var products = [];
    var catPossible = true;

    if (currURL.substring(0, 38) == "https://www.prisjakt.nu/produkt.php?j=") { // Om sidan är en jämförelse
        var loopList = document.getElementById("div_produktegenskaper_jmf").getElementsByTagName("tr")[0].getElementsByTagName("th");
        for (i = 1; i < loopList.length; i++) { // Börja på ett för att första rutan inte innehåller någon produkt
            products.push(new Product(
                loopList[i].getElementsByTagName("h3")[0].getElementsByTagName("a")[0].innerHTML, // namn
                loopList[i].getElementsByTagName("h3")[0].innerHTML.split('<a href="/produkt.php?p=')[1].split('"')[0].split("&")[0], // id
                loopList[i].getElementsByClassName("category-name")[0].getElementsByTagName("a")[0].innerHTML // kategori
            ));
        }
    }
    else { // Om sidan är en lista
        if (document.getElementById("listviewpage-currentcontentheader").getElementsByClassName("sidebar-btn-delete")[0] !== undefined) {
            var owner = true;
        } else {
            var owner = false;
        }
        if (currURL.split("view=")[1] === undefined || currURL.split("view=")[1][0] == "l") { // Om view=l, lista, eller view inte är specificerad
            var loopList = document.getElementById("listviewpage-currentlistview").getElementsByClassName("list-row");
            if (owner) {
                for (i = 0; i < loopList.length; i++) {
                    products.push(new Product(
                        loopList[i].getElementsByClassName("span9-5")[0].getElementsByTagName("a")[0].innerHTML, // namn
                        loopList[i].getElementsByClassName("span9-5")[0].innerHTML.split('<a href="/produkt.php?p=')[1].split('"')[0].split("&")[0], // id
                        loopList[i].getElementsByClassName("muted")[0].getElementsByTagName("a")[0].innerHTML // kategori
                    ));
                }
            } else {
                for (i = 0; i < loopList.length; i++) {
                    products.push(new Product(
                        loopList[i].getElementsByClassName("prod")[0].innerHTML, // namn
                        loopList[i].getElementsByClassName("prod")[0].href.split('/produkt.php?p=')[1].split('"')[0].split("&")[0], // id
                        loopList[i].getElementsByClassName("span4")[0].innerHTML.slice(1, -1) // \n som första och sista tecken... // kategori
                    ));
                }
            }
        }
        else if (currURL.split("view=")[1][0] == "m" && owner) { // Om view=m, lista med bilder och listan är egenägd
            var loopList = document.getElementById("listviewpage-currentlistview").getElementsByClassName("list-row");
            for (i = 0; i < loopList.length; i++) {
                products.push(new Product(
                    loopList[i].getElementsByTagName("h4")[0].getElementsByTagName("a")[0].innerHTML, // namn
                    loopList[i].getElementsByTagName("h4")[0].innerHTML.split('<a href="/produkt.php?p=')[1].split('"')[0].split("&")[0], // id
                    loopList[i].getElementsByClassName("muted")[0].getElementsByTagName("a")[0].innerHTML // kategori
                ));
            }
        }
        else if (currURL.split("view=")[1][0] == "m" && !owner) { // Om view=m, lista med bilder och listan _inte_ är egenägd
            var loopList = document.getElementById("listviewpage-currentlistview").getElementsByClassName("list-row");
            for (i = 0; i < loopList.length; i++) {
                products.push(new Product(
                    loopList[i].getElementsByTagName("h4")[0].getElementsByTagName("a")[0].innerHTML, // namn
                    loopList[i].getElementsByTagName("h4")[0].innerHTML.split('<a href="/produkt.php?p=')[1].split('"')[0].split("&")[0], // id
                    loopList[i].getElementsByClassName("one-line")[0].innerHTML.split("\n")[0] // kategori
                ));
            }
        }
        else if (currURL.split("view=")[1][0] == "b" && owner) { // Om view=b, bilder och listan är egenägd
            catPossible = false;
            var loopList = document.getElementById("listviewpage-currentlistview").getElementsByClassName("list-row");
            for (i = 0; i < loopList.length; i++) {
                products.push(new Product(
                    loopList[i].getElementsByTagName("a")[0].innerHTML, // namn
                    loopList[i].getElementsByTagName("a")[0].href.split("/produkt.php?p=")[1] // id
                ));
            }
        }
        else if (currURL.split("view=")[1][0] == "b" && !owner) { // Om view=b, bilder och listan _inte_ är egenägd
            var loopList = document.getElementById("listviewpage-currentlistview").getElementsByClassName("list-row");
            for (i = 0; i < loopList.length; i++) {
                products.push(new Product(
                    loopList[i].getElementsByClassName("text_top")[0].getElementsByTagName("a")[0].innerHTML, // namn
                    loopList[i].getElementsByClassName("text_top")[0].innerHTML.split('<a href="/produkt.php?p=')[1].split('"')[0].split("&")[0], // id
                    loopList[i].getElementsByClassName("text_bottom")[0].getElementsByTagName("a")[0].innerHTML // kategori
                ));
            }
        }
        else if (currURL.split("view=")[1][0] == "c") { // Om view=c, jämför
            var loopList = document.getElementById("div_produktegenskaper_jmf").getElementsByTagName("tr")[0].getElementsByTagName("th");
            for (i = 1; i < loopList.length; i++) { // Börja på ett för att första rutan inte innehåller någon produkt
                products.push(new Product(
                    loopList[i].getElementsByTagName("h3")[0].getElementsByTagName("a")[0].innerHTML, // namn
                    loopList[i].getElementsByTagName("h3")[0].innerHTML.split('<a href="/produkt.php?p=')[1].split('"')[0].split("&")[0], // id
                    loopList[i].getElementsByClassName("category-name")[0].getElementsByTagName("a")[0].innerHTML // kategori
                ));
            }
        }
        else if (currURL.split("view=")[1][0] == "o") { // Om view=o, prisoptimering
            var loopList = document.getElementById("list_items").getElementsByTagName("tr");
            for (i = 0; i < loopList.length; i++) {
                products.push(new Product(
                    loopList[i].getElementsByTagName("a")[1].innerHTML.split("</span>\n")[1].split("\n<span")[0], // namn
                    loopList[i].innerHTML.split('<a href="/produkt.php?p=')[1].split('"')[0].split("&")[0], // id
                    loopList[i].getElementsByClassName("muted")[0].innerHTML.split("(")[1].split(")")[0] // kategori
                ));
            }
            var optiProds = [];
            var lists = document.querySelectorAll("[id^=det_]");
            for (var i = 0; i < lists.length; i++) {
                optiProds.push([]);
                var loopList = lists[i].getElementsByClassName("no-borders");
                for (var j = 0; j < products.length; j++) {
                    var id = loopList[j].querySelector("a").href.split("/produkt.php?p=")[1];
                    var index = 0;
                    while (products[index].id != id) {
                        index++;
                    }
                    var tillButiken = loopList[j].querySelector(".btn.success"),
                        retailLink = false,
                        retailer = false;
                    if (tillButiken) {
                        retailLink = tillButiken.href;
                        retailer = tillButiken.title.slice(30);
                    } else {
                        retailer = loopList[j].parentNode.parentNode.parentNode.parentNode.querySelector("a").getAttribute("data-label"); // århundradets finaste rad som säkert inte fungerar i ff heller
                    }
                    optiProds[i].push(new Product(
                        products[index].name, // name
                        products[index].id, // id
                        products[index].category, // category
                        parseInt(loopList[j].querySelector(".price").innerHTML.replace(/\D/g,'')), // price
                        retailLink,
                        retailer
                    ));
                }
                lists[i].querySelector("tr").appendChild(document.createElement("th"));
                createButton("Hämta prisoptimering som BB-Kod", function() { copyPopup(tablify(optiProds[this])); }.bind(i), "", lists[i].querySelector(".text-right.strong"));
            }
        }
    }

    var grey = ";background: rgba(128,128,128,0.5); border-color: rgba(0, 0, 0, 0);";
    if (products.length) {
        createButton("BB-Kod med kategori", function() {
            if (catPossible) {
                copyPopup(tablify(products));
            } else {
                alert("Kategori är inte tillgängligt i det nuvarande visningsläget.");
            }
        }, "margin-left: 31px" + (catPossible ? "" : grey));
        createButton("BB-Kod utan kategori", function(){ copyPopup(tablify(products, false)); }, "margin-left: 6px");
    } else {
        createButton("BB-Kod med kategori", function(){ alert("Det finns inga produkter i den här listan."); }, "margin-left:31px" + grey);
        createButton("BB-Kod utan kategori", function(){ alert("Det finns inga produkter i den här listan."); }, "margin-left:6px" + grey);
    }
}