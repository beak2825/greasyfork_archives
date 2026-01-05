// ==UserScript==
// @name         SFBA report
// @namespace    https://trade.aliexpress.com/
// @match      https://www.aliexpress.com/p/order/index.html*
// @match      https://www.amazon.fr/gp/css/order-history*
// @match      https://forum.hardware.fr/*
// @version      1.0
// @description  Copie les dernières commandes des sites SFBA dans le presse papier et met en forme en bbcode
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/23604/SFBA%20report.user.js
// @updateURL https://update.greasyfork.org/scripts/23604/SFBA%20report.meta.js
// ==/UserScript==


// Reécriture des liens aliexpress s'ils pointent sur le fr
if(window.location.href.indexOf("hardware") > -1)
{
    var urls = document.getElementsByTagName("a");
    for (var i = 0; i < urls.length; i++)
    {
        if (urls[i].href.startsWith("https://fr.aliexpress.com"))
        {
            var newUrl = urls[i].href.replace("https://fr.aliexpress.com", "https://aliexpress.com");
            urls[i].setAttribute("href", newUrl);
        }
    }
}
else
{
    GM_registerMenuCommand('Copier les produits', checkCurrentSite);
}

var postEntete = "[:deejayboulette:5]\n#SFBAreport\n";


function checkCurrentSite()
{
    if(window.location.href.indexOf("aliexpress") > -1)
    {
        if (window.location.href.indexOf("wishlist") > -1)
        {
            getAEWishes();
        }
        else
        {
            getAEOrders();
        }
    }
    else if (window.location.href.indexOf("amazon") > -1)
    {
        getAZOrders();
    }
}



function getAZOrders()
{
    var post = "[:sfba:5]\n\n";
    var orders = document.getElementsByClassName('order-card');
    for (var i = 0; i < orders.length; i++)
    {
        var title = [];
        var link = [];
        var img = [];
        var price;

        var items = orders[i].getElementsByClassName('item-box')
        for (var j = 0; j < items.length; j++)
        {
            try {
                title.push(items[j].querySelector(".yohtmlc-product-title").textContent.trim());
                link.push(items[j].querySelector(".product-image a").href);
                img.push(convertToLargePicture("AZ", items[j].querySelector(".product-image img").src));
            } catch (error) {
                console.log("Formattage de merde AZ")
            }
        }
        price = orders[i].querySelector(".yohtmlc-order-total").textContent.trim();
        post += formatPost(title, link, img, price);
    }
    GM_setClipboard(postEntete+post);
}

function getAEOrders()
{
    var post = "[:lugz:5]\n\n";
    var items = document.getElementsByClassName('order-item-content-body');
    for (var i = 0; i < items.length; i++)
    {
        var title = [];
        var link = [];
        var img = [];
        var price;

        try {
            link.push(items[i].querySelector(".order-item-content-body a:first-of-type").href);
            title.push(items[i].querySelector(".order-item-content-info-name span").textContent);
            var image = items[i].querySelector(".order-item-content-img");
            if (image !== null) {
                var style = window.getComputedStyle(image);
                img.push(style.backgroundImage.slice(4, -1).replace(/"/g, ""));
            }

            var p = items[i].querySelector(".order-item-content-info-number");
            if (p !== null) {
                price = p.textContent.trim();
            }
            post += formatPost(title, link, img, price);
        } catch (error) {
            console.log("Formattage de merde AE")
        }

    }
    GM_setClipboard(postEntete+post);
}

function getAEWishes()
{
    var post = "Wish list [:lugz:5]\n\n";
    var tags = document.getElementsByTagName('li');

    for (var i = 0; i < tags.length; i++)
    {
        if (tags[i].className.indexOf("product") > -1)
        {
            var title = [];
            var link = [];
            var img = [];
            var price;

            img.push(convertToLargePicture("AE", tags[i].children[0].children[1].src));
            link.push(tags[i].children[0].href);
            title.push(tags[i].children[1].children[0].innerText);
            price = tags[i].children[1].children[1].children[0].innerText;

            post += formatPost(title, link, img, price);
        }
    }
    GM_setClipboard(postEntete+post);
}

function convertToLargePicture(site, picture)
{
    var resized = picture;

    switch(site)
    {
        case "AE":
            // Picture url format is https://ae01.alicdn.com/kf/blablabla.jpg_50x50.jpg
            resized = picture.replace("50x50", "120x120");
            /* Remplace l'image en https par sa version en http */
            resized = resized.replace("https", "http");
            break;

        case "AZ":
            resized = picture.replace("SY90", "SY120");
            resized = resized.replace("SX90", "SX120");
            break;

        default:
            break;

    }

    return resized;

}

function truncate(str, n)
{
    var isTooLong = str.length > n,
    s_ = isTooLong ? str.substr(0,n-1) : str;
    s_ = isTooLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
    return isTooLong ? s_ + '...' : s_;
}

function formatPost(title, link, img, price)
{
    var post = "";

    for(var i=0; i<img.length; i++)
    {
        post += "[img]" + img[i] + "[/img]";
    }
    post += "\n";
    for (i=0; i<link.length; i++)
    {
        post += "[b][url=" + link[i] + "]" + truncate(title[i],80) + "[/url][/b]\n";
    }

    post += price + "\n";
    post += "Mon avis: \n\n";

    return post;
}