// ==UserScript==
// @name KN Paywall Killer
// @name:de KN Paywall-Entferner
// @description A script that removes the paywall from Kieler Nachrichten (KN+) articles by copying the article text from a window object into the body. As GreaseMonkey does not support unsafeWindow since version 4.0, this script only works with Tampermonkey.
// @description:de Ein Skript, das die Paywall in Artikeln der Kieler Nachrichten (KN+) entfernt, indem es den Artikeltext aus einem Objekt im window in den Body kopiert. Da GreaseMonkey unsafeWindow seit Version 4.0 nicht mehr unterstützt, funktioniert dieses Skript nur mit Tampermonkey.
// @include https://www.kn-online.de/*
// @grant unsafeWindow
// @namespace Discostu36/KN-Paywall-Killer
// @run-at document-idle
// @version 2.1
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449387/KN%20Paywall%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/449387/KN%20Paywall%20Killer.meta.js
// ==/UserScript==

var contentObject;
if (window && window.Fusion && window.Fusion.globalContent) {
    contentObject = window.Fusion.globalContent;
} else if (unsafeWindow && unsafeWindow.Fusion && unsafeWindow.Fusion.globalContent) {
    contentObject = unsafeWindow.Fusion.globalContent;
} else {
    console.error("Konnte Paywall nicht entfernen. Fusion-Objekt nicht gefunden")
}

var ersterAbsatz = true;

console.log("Starte Paywall-Killer in 10 Sekunden");

setTimeout(() => {

    const paywall = document.querySelector(".Articlestyled__FullscreenPaywallScrollContainer-sc-l1lt3q-4");
    if (paywall) {
        removePaywall(paywall);
    } else {
        console.log("Keine paywall gefunden")
    }
}, "10000");

function removePaywall(paywall) {
    const teaserContainer = document.querySelector(".ArticleHeadstyled__ArticleTeaserContainer-sc-tdzyy5-3");
    const leadP = document.querySelector(".ArticleHeadstyled__ArticleSubHeadline-sc-tdzyy5-11");
    const articleContainer = document.querySelectorAll(".Articlestyled__CenteredContentWrapper-sc-l1lt3q-5")[1];
    const cover = articleContainer.querySelector("svg");
    paywall.remove();
    if (cover) {
        cover.remove()
    }

    leadP.classList.remove("dyhfiJ");
    leadP.style.fontWeight="600";

    // Artikel-Details-Element bauen und befüllen
    const artikelDetailsContainer = document.createElement("div");
    artikelDetailsContainer.classList.add("ArticleHeadstyled__ArticleHeadDetailsContainer-sc-tdzyy5-7", "dBklbL");
    artikelDetailsContainer.style.marginTop = "16px";
    artikelDetailsContainer.style.marginBottom ="24px";
    const artikelDetails = document.createElement("div");
    artikelDetails.classList.add("ArticleDetailsstyled__ArticleDetails-sc-26x8zr-0", "cwyyPD");
    const autorContainer = document.createElement("div");
    autorContainer.classList.add("ArticleDetailsstyled__ArticleDetailsAuthor-sc-26x8zr-1", "eyoXei");
    const autorElement = document.createElement("div");
    autorElement.classList.add("ArticleDetailsstyled__ArticleMeta-sc-26x8zr-2", "bTOgSH");
    const autorSubElement = document.createElement("div");
    autorSubElement.classList.add("ArticleMetastyled__ArticleMeta-sc-q63qyk-0", "jnFLss");
    autorSubElement.style.display = "flex";
    autorSubElement.style.alignItems = "center";


    // Avatar
    const autorAvatarContainer = document.createElement("div");
    autorAvatarContainer.classList.add("ArticleMetastyled__ArticleMetaAvatar-sc-q63qyk-1", "gCtiQB");
    autorAvatarContainer.style.marginRight ="12px";
    const autorAvatarSubContainer = document.createElement("div");
    autorAvatarSubContainer.classList.add("Avatarstyled__Avatar-sc-vo9i9b-0", "bYyBgl");
    autorAvatarSubContainer.style.width = "56px";
    autorAvatarSubContainer.style.height = "56px";
    autorAvatarSubContainer.style.border = "1px solid rgba(15, 21, 26, 0.08);";
    autorAvatarSubContainer.style.borderRadius = "50%";
    autorAvatarSubContainer.style.overflow = "hidden";


    const avatarImageContainer = document.createElement("div");
    avatarImageContainer.classList.add("Imagestyled__Container-sc-1io480m-0", "hIgPBv");
    const avatarImage = document.createElement("img");
    avatarImage.src = contentObject.authors[0].imageUrl;
    avatarImage.width="56";
    avatarImage.height="56";
    avatarImageContainer.appendChild(avatarImage);
    autorAvatarSubContainer.appendChild(avatarImageContainer);
    autorAvatarContainer.appendChild(autorAvatarSubContainer);
    autorSubElement.appendChild(autorAvatarContainer);

    // Name und Datum
    const metaDataContainer = document.createElement("div");
    metaDataContainer.classList.add("Stackstyled__Stack-sc-84d39r-0", "hCHpIZ");
    const autorNameContainer = document.createElement("address");
    autorNameContainer.classList.add("ArticleAuthorsListstyled__Authors-sc-2z414t-1", "kOeZhB", "ArticleMetastyled__ArticleMetaAuthors-sc-q63qyk-2", "IytjY", "ArticleMetaAuthors");
    autorNameContainer.style.fontSize = "14px";
    autorNameContainer.style.fontWeight = "500";
    autorNameContainer.style.lineHeight = "18px";
    autorNameContainer.style.fontFamily ="Inter, Arial-adjusted-for-Inter, Roboto-adjusted-for-Inter, sans-serif"
    const autorNameLink = document.createElement("a");
    autorNameLink.classList.add("Linkstyled__Link-sc-1y4ucbg-0", "flViNw", "ArticleAuthorsListstyled__Link-sc-2z414t-0", "iQcIZi");
    autorNameLink.href = contentObject.authors[0].url;
    autorNameLink.innerText = contentObject.authors[0].name;
    const artikelDatum = document.createElement("time");
    artikelDatum.classList.add("Timestampstyled__Timestamp-sc-moipz3-0", "gTezCK");
    artikelDatum.style.fontSize = "14px";
    artikelDatum.style.fontWeight = "400";
    artikelDatum.style.lineHeight = "18px";
    artikelDatum.style.color = "var(--ldc-52)";
    artikelDatum.style.fontFamily = "Inter, Arial-adjusted-for-Inter, Roboto-adjusted-for-Inter, sans-serif";
    const artikelZeit = new Date(contentObject.displayDate);
    artikelDatum.innerText = artikelZeit.toLocaleString() + " (UTC)";
    autorNameContainer.appendChild(autorNameLink);
    metaDataContainer.appendChild(autorNameContainer);
    metaDataContainer.appendChild(artikelDatum);
    autorSubElement.appendChild(metaDataContainer);

    // Trenner
    const headTrennerContainer = document.createElement("div");
    headTrennerContainer.classList.add("ArticleHeadstyled__ArticleDivider-sc-tdzyy5-9", "kIxNgV");
    headTrennerContainer.style.marginBottom = "24px";
    headTrennerContainer.style.marginTop = "8px";
    const headTrenner = document.createElement("div");
    headTrenner.classList.add("Dividerstyled__Divider-sc-1fznxc6-1", "eeAvvG");
    headTrennerContainer.appendChild(headTrenner);

    console.log("Füge den Detail-Header hinzu")
    autorElement.appendChild(autorSubElement);
    autorContainer.appendChild(autorElement);
    artikelDetails.appendChild(autorContainer);
    artikelDetailsContainer.appendChild(artikelDetails);
    teaserContainer.appendChild(artikelDetailsContainer);
    teaserContainer.appendChild(headTrennerContainer)


    // Artikelabsätze erstellen und einfügen
    const textElemente = contentObject.elements;
    console.log("Füge jetzt alle Text-Elemente hinzu. Es sind " + textElemente.length + " Stück")
    textElemente.forEach((element => {
        if (element.type =="text") {
            createAndAddTextElement(articleContainer, element.text);
        } else if (element.type == "header") {
            createAndAddHeaderElement(articleContainer, element.text);
        }
    }));


}

function createAndAddTextElement(articleContainer, text) {
    const textElement = document.createElement("p");
    textElement.classList.add("Textstyled__Text-sc-1cqv9mi-0", "cLyiiX");
    textElement.style.paddingBottom = "8px";
    textElement.style.paddingTop = "8px";
    textElement.style.fontFamily = '"Source Serif Pro", "Noto-adjusted-for-Source", Palatino, "Droid Serif", Times-New-Roman-adjusted-for-Source, serif';
    textElement.style.fontSize = "17px";
    textElement.style.fontWeight = "400";
    textElement.style.letterSpacing = "0px";
    textElement.style.lineHeight ="26px";
    if (ersterAbsatz) {
        const locationSpan = document.createElement("span");
        locationSpan.classList.add("LocationNamestyled__LocationName-sc-1rjppsp-0", "cksxoJ");
        locationSpan.style.fontFamily = "Inter, Arial-adjusted-for-Inter, Roboto-adjusted-for-Inter, sans-serif";
        locationSpan.style.fontSize = "16px";
        locationSpan.style.fontWeight ="600";
        locationSpan.style.letterSpacing = "0px;";
        locationSpan.style.lineHeight = "20px";
        locationSpan.innerText = contentObject.location + ". ";
        textElement.appendChild(locationSpan);
    }
    const textSpan = document.createElement("span");
    textSpan.innerHTML = text;
    textElement.appendChild(textSpan);
    articleContainer.appendChild(textElement);
    ersterAbsatz = false;
}

function createAndAddHeaderElement(articleContainer, text) {
    const headerElement = document.createElement("h2");
    headerElement.classList.add("Headlinestyled__Headline-sc-mamptc-0", "ceLWQu");
    headerElement.style.paddingBottom = "4px";
    headerElement.style.paddingTop = "8px";
    headerElement.style.color = "var(--ldc-70)";
    headerElement.style.fontFamily = '"DIN Next LT Pro", Arial-adjusted-for-DIN, Roboto-adjusted-for-DIN, sans-serif';
    headerElement.style.fontWeight = "700";
    headerElement.style.letterSpacing = "-0.25px";
    headerElement.style.fontSize = "22px";
    headerElement.style.lineHeight = "26px";
    const textNode = document.createTextNode(text);
    headerElement.appendChild(textNode);
    articleContainer.appendChild(headerElement)
}
