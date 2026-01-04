// ==UserScript==
// @name         Mary T. Cusack Tarot Archives
// @namespace    http://marytcusack.com/
// @version      0.3
// @description  Fixes missing galleries and bad image names
// @author       Vexe
// @match        http://marytcusack.com/maryc/decks/html/Tarot/*
// @match        http://marytcusack.com/Decks/HTML/Tarot/*
// @match        http://www.marytcusack.com/maryc/decks/html/Tarot/*
// @match        http://www.marytcusack.com/Decks/HTML/Tarot/*
// @match        http://marytcusack.com/maryc/tarot/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marytcusack.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467123/Mary%20T%20Cusack%20Tarot%20Archives.user.js
// @updateURL https://update.greasyfork.org/scripts/467123/Mary%20T%20Cusack%20Tarot%20Archives.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(document.location.pathname.includes('tarot/index.html')){
        var sphere2 = document.querySelector("A[href*=\"SeventhSphere2\"]")
        sphere2.href = sphere2.href.replace('Oracle','Tarot');
    } else {
        // css fix for image aspect ratios
        addCss('IMG { height: auto !important }');

        // identify deck
        var theDeck = document.location.pathname.match(/[^/.]+(?=\.html)/i)[0];

        switch(theDeck) {
            case "78Doors":
            case "Adventure":
            case "Complete":
            case "Cosmic":
            case "Fountain":
            case "Pirate":
            case "Rackham":
                buildGallery(theDeck);
                break;
            case "Arcanis":
                // replace wands 1-9
                for (var i = 1; i <= 9; i++) {
                    // get missing image
                    var el = document.querySelector("IMG[src*=\"R0"+ i + "\"]");

                    el.src = fixMinorSrc(el.src, 'W');
                }
                break;
            case "ArtNouveau":
                fixAll('html/Tarot/undefined','Images/Tarot/ArtNouveau/');
                break;
            case "Connolly":
            case "Construction":
            case "Happy":
                fixSection('Wands','R');
                break;
            case "Epic":
                fixSection('Spheres','P');
                break;
            case "Morgan":
                fixSection('Batons','R');
                break;
            case "LightSeers":
                fixSection('Rods','W');
                break;
            case "GoldArt":
            case "Romantic":
                fixSection('Wands','R');
                break;
            case "Manga":
                fixCourts('C1P','C1K');
                break;
            case "Cloister":
            case "MattMeyers":
            case "Renaissance":
                fixSection('Staves','St');
                break;
            case "Norse":
                fixCourts('C2K','C2P');
                break;
            case "Sevenfold":
                fixCourts('C1V','C1L');
                fixSection('Wands','R');
                break;
            case "Silver":
                fixAll('Silver','SilverWitchcraft');
                break;
            case "Titanic":
                fixSection('Coins','P');
                break;
            case "WildWood":
                fixSection('Stones','S');
                break;
            case "Winged":
                fixSection('Spheres','Sp');
                break;
            case "Black":
                fixSection('Spheres','SP');
                break;
            case "Zillich":
                var img = document.querySelector('LABEL[for="Major20"] IMG');

                img.src = img.src.replace('Judtice','Justice');
                break;
        }

        function fixAll(oldId, newID) {
            // get sections
            var sects = document.querySelectorAll('DIV:not([id="buttonhead"])');

            // fix images in each section
            for (var i = 0; i < sects.length; i++) {
                var imgs = sects[i].getElementsByTagName('img');

                for (var j = 0; j < imgs.length; j++) {
                    imgs[j].src = imgs[j].src.replace(oldId,newID);
                }
            }
        }

        // fix minor arcana name prefixes
        function fixMinorSrc(src, id) {
            return src.replace(/(.+\/)[A-Za-z]{1,2}(\d{2}|C[1-4][A-Za-z]{1,2})/, "$1" + id + "$2");
        }

        // fix court card names
        function fixCourts(oldId, newId) {
            var els = document.querySelectorAll("IMG[src$=\"" + oldId + ".jpg\"]");

            for (var i = 0; i < els.length; i++) {
                els[i].src = els[i].src.replace(oldId, newId);
            }
        }

        // fix section of card images
        // specify entity id, replacement text
        function fixSection(div, id, qsel) {
            var sect = document.getElementById(div);
            var imgs = sect.getElementsByTagName('img');

            switch(div) {
                case "Major":
                    break;
                default:
                    for (var i=0; i < imgs.length; i++) {
                        imgs[i].src = fixMinorSrc(imgs[i].src, id);
                    }
                    break;
            }
        }

        // add css to head section
        function addCss(css){
            var head = document.getElementsByTagName('head')[0];
            var s = document.createElement('style');
            s.setAttribute('type', 'text/css');
            s.appendChild(document.createTextNode(css));
            head.appendChild(s);
        }

        // build entire card gallery
        // add before #cardtext
        function buildGallery(id) {
            // IDs and classes for main DIVs
            var idList = [ "Majors","Cups","Pentacles","Swords","Rods" ];

            var minorList = [
                "01",
                "02",
                "03",
                "04",
                "05",
                "06",
                "07",
                "08",
                "09",
                "10",
                "C1P",
                "C2K",
                "C3Q",
                "C4K"
            ];

            // Trumps
            var trumpList = [
                "00%20Fool.jpg",
                "01%20Magician.jpg",
                "02%20Priestess.jpg",
                "03%20Empress.jpg",
                "04%20Emperor.jpg",
                "05%20Hierophant.jpg",
                "06%20Lovers.jpg",
                "07%20Chariot.jpg",
                "08%20Strength.jpg",
                "09%20Hermit.jpg",
                "10%20Wheel.jpg",
                "11%20Justice.jpg",
                "12%20Hanged.jpg",
                "13%20Death.jpg",
                "14%20Temperance.jpg",
                "15%20Devil.jpg",
                "16%20Tower.jpg",
                "17%20Star.jpg",
                "18%20Moon.jpg",
                "19%20Sun.jpg",
                "20%20Judgement.jpg",
                "21%20World.jpg"
            ]

            // change suit names
            switch(id) {
                case "Adventure":
                    idList[1] = "Masks";
                    idList[2] = "Discs";
                    idList[3] = "Blades";
                    idList[4] = "Staves";
                    break;
                case 'Complete':
                case 'Cosmic':
                case 'Pirate':
                    idList[4] = "Wands";
                    break;
                case 'Fountain':
                    idList[2] = "Coins";
                    idList[4] = "Wands";
                    break;
            }

            // change court identifiers
            switch(id) {
                case 'Cosmic':
                    minorList[11] = "C2P";
                    break;
                case 'Pirate':
                    minorList[10] = "C1K";
                    break;
            }

            // swap strength and justice
            switch(id) {
                case 'Complete':
                case 'Cosmic':
                case 'Fountain':
                case 'Pirate':
                    trumpList[8] = "08%20Justice.jpg";
                    trumpList[11] = "11%20Strength.jpg";
            }

            // remove the "click on thumbnail" message
            document.getElementById("cardtext").style.display = "none";

            for (var i = 0; i < idList.length; i++) {
                // create a div and append it
                var idName = idList[i];
                var idX = idName.substr(0,1);

                switch (idName) {
                    case 'Coins':
                        idX = 'Co';
                        break;
                    case 'Masks':
                        idX = 'Ma';
                        break;
                }
                var tempDiv = document.createElement('div');
                tempDiv.id = idName;
                tempDiv.classList.add(idName);

                // make the header element
                var tempHead = document.createElement('h2');
                tempHead.style.color = "#fff;";
                tempHead.innerText = idName;

                tempDiv.appendChild(tempHead);

                switch(idName) {
                    case "Major":
                    case "Majors":
                        var prevInput;
                        for (var j = 0; j < trumpList.length; j++) {
                            // id, like Major0, Major1, etc.
                            var tempId = idName + j;

                            var imgName = trumpList[j].replace('%20',' ').replace('.jpg','');

                            // file url
                            var tempUrl = "http://www.marytcusack.com/maryc/decks/Images/Tarot/" + id + "/" + trumpList[j];

                            /*
                            // make the input element
                            var tempInput = document.createElement('input');
                            tempInput.type = "radio";
                            tempInput.name = idName;
                            tempInput.id = tempId;

                            // insert input after previous input
                            // if first input, appendChild to tempDiv

                            if (j == 0) {
                                tempDiv.appendChild(tempInput);
                            } else {
                                prevInput.insertAdjacentElement('afterend',tempInput);
                            }

                            prevInput = tempInput

                            // make the label element
                            var tempLabel = document.createElement('label');
                            tempLabel.htmlFor = tempId;
                            tempLabel.classList.add(idX + j);
                            tempLabel.setAttribute('onclick','void(0)');
                            */

                            // make the link element
                            var tempLink = document.createElement('a');
                            tempLink.href = tempUrl;
                            tempLink.target = "_blank";

                            // make the image element
                            var tempImg = document.createElement('img');
                            tempImg.src = tempUrl;
                            tempImg.alt = imgName;
                            tempImg.title = imgName;
                            tempImg.name = imgName;
                            tempImg.width = "200";
                            tempImg.style.padding = "7px";

                            /*
                            tempLabel.appendChild(tempImg);

                            // appendChild to tempDiv
                            tempDiv.appendChild(tempLabel);
                            */

                            tempLink.appendChild(tempImg);
                            tempDiv.appendChild(tempLink);
                        }
                        break;
                    default:
                        for (var n = 0; n < minorList.length; n++) {
                            var tempUrl2 = "http://www.marytcusack.com/maryc/decks/Images/Tarot/" + id + "/" + idX + minorList[n] + ".jpg";

                            // make the link element
                            var tempLink2 = document.createElement('a');
                            tempLink2.href = tempUrl2;
                            tempLink2.target = "_blank";

                            // make the image element
                            var tempImg2 = document.createElement('img');
                            tempImg2.src = tempUrl2;
                            // tempImg2.alt = imgName;
                            // tempImg2.title = imgName;
                            // tempImg2.name = imgName;
                            tempImg2.width = "200";
                            tempImg2.style.padding = "7px";

                            tempLink2.appendChild(tempImg2);
                            tempDiv.appendChild(tempLink2);
                        }
                        break;
                }

                // append tempDiv to document
                document.getElementById('cardtext').insertAdjacentElement('beforebegin',tempDiv);
            }
        }
    }
})();