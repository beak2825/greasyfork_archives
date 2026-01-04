// ==UserScript==
// @name         MixMob MixBots Score
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Check the score of MixBots!
// @author       ercalote
// @include        https://magiceden.tld/marketplace/mixbots*
// @include        https://www.magiceden.tld/marketplace/mixbots*
// @include        https://magiceden.tld/u/*
// @include        https://www.magiceden.tld/u/*
// @icon         https://www.google.com/s2/favicons?domain=magiceden.io
// @grant        GM_log
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/486697/MixMob%20MixBots%20Score.user.js
// @updateURL https://update.greasyfork.org/scripts/486697/MixMob%20MixBots%20Score.meta.js
// ==/UserScript==

function findParentWithDataIndex(element) {
    if (!element) return null;
    if (element.getAttribute('data-index') !== null) {
        return element;
    }
    return findParentWithDataIndex(element.parentElement);
}

function createParagraph(text, score) {
    var paragraph = document.createElement('p');
    paragraph.textContent = text + ': ' + score;
    return paragraph;
}

(function() {
    'use strict';

    let addedDivs = new Set();
    var injectedExtraTraits = false;
    var minAcceleration = 4;
    var minMaxSpeed = 4;
    var minDurability = 4;
    var minWillpower = 4;
    var selectedFaction = 'All';
    var selectionChanged = false;
    var styles = `
    table.tw-w-full tr {
        height: 9rem;
    }

    div.tw-font-fira{
        height: 12rem;
    }
    `
    var styleSheet = document.createElement("style")
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)

    function addDivAfterImage(image) {
        var parentDivWithDataIndex = findParentWithDataIndex(image);

        var slug = (image.src.match(/SLUG/g) || []).length;
        var huntr = (image.src.match(/HUNTR/g) || []).length;
        var grnt = (image.src.match(/GRNT/g) || []).length;
        var wzrd = (image.src.match(/WZRD/g) || []).length;
        var lzrd = (image.src.match(/LZRD/g) || []).length;
        var fink = (image.src.match(/FINK/g) || []).length;
        var kng = (image.src.match(/KNG/g) || []).length;
        var mnstr = (image.src.match(/MNSTR/g) || []).length;

        var unique = (image.src.match(/Unique/g) || []).length;
        var glitch = (image.src.match(/Glitch/g) || []).length;
        var metal = (image.src.match(/Metal/g) || []).length;
        var synth = (image.src.match(/Synth/g) || []).length;
        var og = (image.src.match(/OG/g) || []).length;
        var odd = (image.src.match(/Odd/g) || []).length;
        var mixscore = unique * 10 + glitch * 10 + metal * 7 + synth * 5 + og * 2 + odd * 2;

        var acceleration = 10 - slug + huntr + fink - kng;
        var max_speed = 10 + slug - wzrd + lzrd - fink;
        var durability = 10 - huntr + grnt + kng - mnstr;
        var willpower = 10 - grnt + wzrd - lzrd + mnstr;

        var factionMatch = image.src.match(/mixbots%2F(.*?)_/);
        var faction = factionMatch ? factionMatch[1] : null;

        if (!addedDivs.has(image) && faction !== null) {

            if (!parentDivWithDataIndex) {
                parentDivWithDataIndex = image.parentElement.parentElement.parentElement.parentElement;
            }

            if (parentDivWithDataIndex) {
                var firstChildDiv = parentDivWithDataIndex.firstElementChild;
                if (firstChildDiv) {
                    var newDiv = document.createElement('div');
                    newDiv.appendChild(createParagraph('Faction', faction));
                    newDiv.appendChild(createParagraph('Acceleration', acceleration));
                    newDiv.appendChild(createParagraph('MaxSpeed', max_speed));
                    newDiv.appendChild(createParagraph('Durability', durability));
                    newDiv.appendChild(createParagraph('Willpower', willpower));
                    newDiv.appendChild(createParagraph('MixScore', mixscore));

                    firstChildDiv.lastElementChild.appendChild(newDiv);
                }
            } else {
                $(parentDivWithDataIndex).hide();
            }

            addedDivs.add(image);
        }

        if (selectionChanged) {
            if ((selectedFaction !== 'All' && selectedFaction !== faction) || acceleration < minAcceleration || max_speed < minMaxSpeed || durability < minDurability || willpower < minWillpower) {
                $(parentDivWithDataIndex).hide();
            } else {
                $(parentDivWithDataIndex).show();
            }
        }
    }

    function processImages() {
        if (!injectedExtraTraits) {
            var faction = $(
                '<div>' +
                '<select id="faction" name="faction" style="margin-right:10px;">' +
                '<option value="All" selected>All</option>' +
                '<option value="Styler">Styler</option>' +
                '<option value="Boff">Boff</option>' +
                '<option value="Tek">Tek</option>' +
                '</select><label for="faction">Faction</label></div>'
            );

            var acceleration = $(
                '<div>' +
                '<select id="minAcceleration" name="minAcceleration" style="margin-right:10px;">' +
                '<option value="4" selected>4</option>' +
                '<option value="5">5</option>' +
                '<option value="6">6</option>' +
                '<option value="7">7</option>' +
                '<option value="8">8</option>' +
                '<option value="9">9</option>' +
                '<option value="10">10</option>' +
                '<option value="11">11</option>' +
                '<option value="12">12</option>' +
                '<option value="13">13</option>' +
                '<option value="14">14</option>' +
                '<option value="15">15</option>' +
                '<option value="16">16</option>' +
                '</select><label for="minAcceleration">Min. Acceleration</label></div>'
            );

            var maxspeed = $(
                '<div>' +
                '<select id="minMaxSpeed" name="minMaxSpeed" style="margin-right:10px;">' +
                '<option value="4" selected>4</option>' +
                '<option value="5">5</option>' +
                '<option value="6">6</option>' +
                '<option value="7">7</option>' +
                '<option value="8">8</option>' +
                '<option value="9">9</option>' +
                '<option value="10">10</option>' +
                '<option value="11">11</option>' +
                '<option value="12">12</option>' +
                '<option value="13">13</option>' +
                '<option value="14">14</option>' +
                '<option value="15">15</option>' +
                '<option value="16">16</option>' +
                '</select><label for="minAcceleration">Min. MaxSpeed</label></div>'
            );

            var durability = $(
                '<div>' +
                '<select id="minDurability" name="minDurability" style="margin-right:10px;">' +
                '<option value="4" selected>4</option>' +
                '<option value="5">5</option>' +
                '<option value="6">6</option>' +
                '<option value="7">7</option>' +
                '<option value="8">8</option>' +
                '<option value="9">9</option>' +
                '<option value="10">10</option>' +
                '<option value="11">11</option>' +
                '<option value="12">12</option>' +
                '<option value="13">13</option>' +
                '<option value="14">14</option>' +
                '<option value="15">15</option>' +
                '<option value="16">16</option>' +
                '</select><label for="minDurability">Min. Durability:</label></div>'
            );

            var willpower = $(
                '<div>' +
                '<select id="minWillpower" name="minWillpower" style="margin-right:10px;">' +
                '<option value="4" selected>4</option>' +
                '<option value="5">5</option>' +
                '<option value="6">6</option>' +
                '<option value="7">7</option>' +
                '<option value="8">8</option>' +
                '<option value="9">9</option>' +
                '<option value="10">10</option>' +
                '<option value="11">11</option>' +
                '<option value="12">12</option>' +
                '<option value="13">13</option>' +
                '<option value="14">14</option>' +
                '<option value="15">15</option>' +
                '<option value="16">16</option>' +
                '</select><label for="minWillpower">Min. Willpower:</label></div>'
            );

            if ($("div[id*='panel-traits']").length > 0) {
                $("div[id*='panel-traits']").first().parent().before(faction);
                $("div[id*='panel-traits']").first().parent().before(acceleration);
                $("div[id*='panel-traits']").first().parent().before(maxspeed);
                $("div[id*='panel-traits']").first().parent().before(durability);
                $("div[id*='panel-traits']").first().parent().before(willpower);

                $(document).on('change', '#minAcceleration', function() {
                    minAcceleration = $(this).val();
                    selectionChanged = true;
                });

                $(document).on('change', '#minMaxSpeed', function() {
                    minMaxSpeed = $(this).val();
                    selectionChanged = true;
                });

                $(document).on('change', '#minDurability', function() {
                    minDurability = $(this).val();
                    selectionChanged = true;
                });

                $(document).on('change', '#minWillpower', function() {
                    minWillpower = $(this).val();
                    selectionChanged = true;
                });

                $(document).on('change', '#faction', function() {
                    selectedFaction = $(this).val();
                    selectionChanged = true;
                });

                injectedExtraTraits = true;
            }
        }

        const images = document.querySelectorAll('img');
        for (var i = 0; i < images.length; i++) {
            if (images[i].src.includes('mixbot')) {
                addDivAfterImage(images[i]);
            }
        }

        selectionChanged = false;
    }

    setInterval(processImages, 200);

})();