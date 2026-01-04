// ==UserScript==
// @name         ParcourSimple
// @namespace    https://ypetit.net/
// @version      0.8.2
// @description  Simplification de l'affichage des voeux en attente sur ParcourSup!
// @author       ypetit
// @license      GNU GPLv3
// @match        https://dossierappel.parcoursup.fr/Candidat/admissions?ACTION=0
// @match        https://dossier.parcoursup.fr/Candidat/admissions?ACTION=0
// @icon         https://www.google.com/s2/favicons?sz=64&domain=parcoursup.fr
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/467772/ParcourSimple.user.js
// @updateURL https://update.greasyfork.org/scripts/467772/ParcourSimple.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        #psimple{
            position: absolute;
            top: 0;
            left: 0;
            display: block;
            z-index: 99999;
            height: 40px;
            padding: 4px 10px;
            background-color: var(--background-active-blue-france);
            color: #FFF;
        }
        #psimple img{
            margin: 0 10px;
        }
        #psimple .key{
            font-family: Courrier;
            background-color: lightgrey;
            color: #000;
            font-weight: bold;
            border: 1px solid black;
            border-radius: 3px;
            display: inline-block;
            padding: 0 8px 2px;
        }
        #psimple .help{
            display: inline-block;
            padding: 0 10px;
        }
        #parcoursimple {
            position:fixed;
            z-index: 9999;
            top:40px;
            max-height: 98%;
            overflow-y: auto;
            overflow-x: hidden;
            background-color: whitesmoke;
            margin: 10px;
            border: dotted dimgray 1px;
            box-shadow: 10px 8px 5px gray;
        }
        #parcoursimple table{
            background-color: #FFF;
            overflow-x: hidden;
        }
        #parcoursimple thead{
            position: sticky;
            top: 0;
            z-index:99;
        }
        #parcoursimple tr{
             line-height: 20px;
        }
        #parcoursimple tr:nth-child(even) {background: #DDF}
        #parcoursimple tr:nth-child(odd) {background: #EEE}
        #parcoursimple th{
            color: #FFF;
            background-color: var(--background-active-blue-france);
            font-weight: bold;
        }
        #parcoursimple th, #parcoursimple td{
            padding: 2px 4px;
        }
        #parcoursimple .right{
            text-align: right;
        }
        #parcoursimple .bold{
            font-weight: bold;
        }
        #parcoursimple .light{
            color: lightgrey;
        }
        #parcoursimple .ok{
            background-color: lightgreen;
            font-weight: bold;
        }
        #parcoursimple .nan{
            background-color: #CCC;
        }
        #parcoursimple .ko{
            background-color: lightpink;
            font-style: italic;
        }
        #parcoursimple .diff{
            display: inline;
            font-size: x-small;
            min-width: 30px;
        }
        #parcoursimple .indicB{
            font-size: xx-small;
        }
        #parcoursimple .indicB{
            position: relative;
            top: 0;
            height: 20px;
            z-index: 0;
        }
        #parcoursimple .indicB .bar{
            display:inline-block;
        }
        #parcoursimple .indicB .base{
            background-color: lightblue;
            border: 1px solid black;
            text-align: left;
            padding-left: 1px;
        }
        #parcoursimple .indicB .propal{
            background-color: lightgreen;
            border: 1px dashed black;
            text-align: center;
        }
        #parcoursimple .indicB .place{
            background-color: gold;
            border: 1px dashed gray;
            border-right: solid black;
            border-width: 1px 1px 1px 0;
            text-align: center;
        }
        #parcoursimple .indicB .total{
            background-color: coral;
            border: 1px dotted gray;
            text-align: right;
            padding-right: 1px;
        }
        #parcoursimple .blur{
            color: transparent;
            text-shadow: 0 0 20px #002;
        }
        #parcoursimple .arrow {
            border: solid black;
            border-width: 0 2px 2px 0;
            display: inline-block;
            padding: 3px;
        }
        #parcoursimple .arrow.up {
            position: relative;
            top: 3px;
            left: 0px;
            transform: rotate(-135deg);
        }
        #parcoursimple .arrow.down {
            top: -24px;
            position: relative;
            left: -8px;
            transform: rotate(45deg);
        }
        #parcoursimple .marker{
            position: relative;
            top: -10px;
            margin-left: -4px;
        }
        /* add other CSS here */
    `);

    document.addEventListener('keyup', function (e) {
        // if click on a
        if (65 === e.which) {
            const x = document.getElementById('parcoursimple');
            x.style.display = (x.style.display === "none") ? "block" : "none";
        } else if (66 === e.which) {
            document.querySelectorAll("#parcoursimple tbody td:first-child").forEach(x => x.classList.add('blur'));
            document.querySelectorAll("#parcoursimple tbody td:nth-child(2)").forEach(x => x.classList.add('blur'));
        }
    });

    $("body").prepend('<div id="psimple"><img src="/favicon.ico"> ' +
        'Clavier : ' +
        '<div class="help"><div class="key">a</div> affiche/cache le tableau</div>' +
        '|<div class="help"><div class="key">b</div> floute les noms des écoles et formations</div>' +
        '</div>');
    $("body").append(
        '<div id="parcoursimple" name="parcoursimple">' +
        '<table id="parcoursimple_table">' +
        '<thead><tr>' +
        ' <th>Ecole</th>' +
        ' <th>Cursus</th>' +
        ' <th>Places<br/>Dispo.</th>' +
        ' <th>Dernier<br/>2022</th>' +
        ' <th>Position au<br/>Classement</th>' +
        ' <th>Dernière<br/>Proposition</th>' +
        ' <th>Place en<br/>Liste</th>' +
        ' <th width="300px">Visualisation</th>' +
        ' <th>Total<br/>Attente</th>' +
        '</tr></thead>' +
        '<tbody id="parcoursimple_table_body"></tbody></table></div>'
    );

    // get all wishes
    const cards = Array.from(document.querySelectorAll(".psup-wish-card--info"));
    const wishes = [];

    class Wish {
        constructor(school, course, id, waiting_position, waiting_total, places, ranking, last, lastLastYear) {
            this.school = school;
            this.course = course;
            this.id = id;
            this.waiting_position = Number(waiting_position);
            this.waiting_total = Number(waiting_total);
            this.places = Number(places);
            this.ranking = Number(ranking);
            this.last = Number(last);
            this.lastLastYear = Number(lastLastYear);
            this.error = false;
        }

        setError() {
            this.error = true;
            return this;
        };

        show() {
            let ligne = "<tr>";
            ligne += "<td>" + this.school + "</td>";
            ligne += "<td>" + this.course + "</td>";
            if (this.error) {
                ligne += "<td colspan='7'>Une erreur est survenue, classement indisponible dans ParcourSimple :(</td>";
            } else {
                ligne += "<td class='right'>" + this.places + "</td>";
                ligne += "<td class='right'>" + (Number.isNaN(this.lastLastYear) ? "???" : this.lastLastYear) + "</td>";
                ligne += "<td class='right " + this.rankColor() + "'>" + this.ranking + this.rankDiff() + "</td>";
                ligne += "<td class='right'>" + this.last + "</td>";
                ligne += "<td class='right bold'>" + this.waiting_position + "</td>";
                ligne += "<td>"
                    + "<div class='indicB'>"
                    + "<div class='bar base' style='width:" + (this.places / (this.last + this.waiting_total) * 100) + "%'>" + this.places + "</div>"
                    + "<div class='bar propal' style='width:" + ((this.last - this.places) / (this.last + this.waiting_total) * 100) + "%'>" + (this.last - this.places) + "</div>"
                    + "<div class='bar place' style='width:" + (this.waiting_position / (this.last + this.waiting_total) * 100) + "%'>" + this.waiting_position + "</div>"
                    + "<div class='bar total' style='width:" + ((this.waiting_total - this.waiting_position) / (this.last + this.waiting_total) * 100) + "%'>" + (this.waiting_total - this.waiting_position) + "</div>"
                    + "<div class='marker' style='left:" + ((this.last + this.waiting_position) / (this.last + this.waiting_total) * 100) + "%'>"
                    + "<span class='arrow up'></span>"
                    + "<span class='arrow down'></span>"
                    + "</div>"
                    + "</div>"
                    + "</td>";
                ligne += "<td class='right light'>" + this.waiting_total + "</td>";
            }
            ligne += "</tr>";
            return ligne;
        }

        rankColor() {
            return isNaN(this.lastLastYear) ? "nan" : this.lastLastYear > this.ranking ? "ok" : "ko";
        }

        rankDiff() {
            return (Number.isNaN(this.lastLastYear) ? "" : " <div class='diff'>(" + (this.ranking - this.lastLastYear) + ")</div>");
        }
    }

    const promises = [];
    cards.forEach(card => {
        const school = card.querySelectorAll('.psup-wish-card__school')[0].innerHTML;
        const course = card.querySelectorAll('.psup-wish-card__course')[0].innerHTML;
        try {
            const onclick = card.querySelectorAll('button')[0].getAttribute('onclick');
            const id = onclick.substring(onclick.indexOf("&") + 1, onclick.lastIndexOf("'"));
            const URL = "admissions?ACTION=2&" + id + "&frOpened=false&frJsModalButton=true";
            promises.push($.ajax({
                url: URL,
                type: "GET",
                dataType: "html",
                success: function (h) {
                    const template = document.createElement('div');
                    template.innerHTML = h.trim();
                    const waiting_position = template.querySelector("div ul li:nth-child(1) b").innerHTML;
                    const waiting_total = template.querySelector("div ul li:nth-child(2) b").innerHTML;
                    // --------------
                    const places = template.querySelector(".fr-alert ul li:nth-child(1) b").innerHTML;
                    const ranking = template.querySelector(".fr-alert ul li:nth-child(2) p b").innerHTML;
                    const last = template.querySelector(".fr-alert ul li:nth-child(3) b").innerHTML;
                    const lastYear = template.querySelector(".fr-alert ul li:nth-child(4) b");
                    const lastLastYear = (lastYear) ? lastYear.innerHTML : "?";
                    wishes.push(new Wish(school,
                        course,
                        id,
                        waiting_position,
                        waiting_total,
                        places,
                        ranking,
                        last,
                        lastLastYear
                    ));
                },
                error: function (h) {
                    console.err(h);
                },
                complete: function () {
                }
            }));
        } catch (error) {
            // log the error in the console
            console.log(error);
            // send feedback
            console.info(card);
            // add placeholder
            wishes.push(new Wish(school, course).setError());
        }
    });
    $.when.apply($, promises).then(function () {
        wishes.sort((a, b) => a.waiting_position - b.waiting_position);
        let r = document.getElementById("parcoursimple_table_body");
        for (let w in wishes) {
            r.innerHTML += wishes[w].show().trim();
        }
    });

})();
