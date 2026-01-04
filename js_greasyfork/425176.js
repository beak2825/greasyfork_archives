// ==UserScript==
// @name         AK Edition staff
// @namespace    http://chataignehahaha.jaipasdesite/
// @version      0.2
// @description  De quoi se faciliter les choses pour l'édition de staff
// @author       Châtaigne
// @match        http://www.anime-kun.net/__zone-admin__/anime.php*
// @icon         https://www.google.com/s2/favicons?domain=anime-kun.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425176/AK%20Edition%20staff.user.js
// @updateURL https://update.greasyfork.org/scripts/425176/AK%20Edition%20staff.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let staffRegex = /.*page=Modification2&id_fiche=.*/;

    let doubleursRegex = /.*page=(Modification&id_fiche=.*|Ajout)/;

    let doubleursANNRegex = /as (.+)\n*/gm;
    let doubleursAnidbRegex = /\nas.+\n(.+)\n*/gm;

    let doubleursOK = /^(?:[^\)\(,]+\([^\(\),]+(?:\(eps?\.? [0-9-, ]+\))?(?:\(enfant\))?\)(?:, )?)+$/m;

    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    if(document.URL.match(staffRegex)) {
        let deleteOnClick = false;

        document.querySelector("#ajout_staff > div > div.overflow > input.submit").addEventListener("click", function() {
            setTimeout(function() {
                document.querySelector("#custom").value = document.querySelector("#typelive").innerText;
                deleteOnClick = true;
            }, 100);
        });

        document.querySelector("#custom").addEventListener("click", function() {
            if(deleteOnClick == true) {
                document.querySelector("#custom").value = "";
                deleteOnClick = false;
            }
        });

        let currentSelectedStaff = "";

        setInterval(function(){
            let el = document.querySelector("#ajax_business_fiche > div > a");
            if(el) {
                if(currentSelectedStaff !== el.href) {
                    currentSelectedStaff = el.href;
                    loadStaff();
                }
            }
        }, 50);

        function loadStaff() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    let el = document.createElement("div");
                    el.innerHTML = this.responseText;
                    var images = el.getElementsByTagName('img');
                    var l = images.length;
                    for (var i = 0; i < l; i++) {
                        images[0].parentNode.removeChild(images[0]);
                    }
                    var links = el.getElementsByTagName('a');
                    l = links.length;
                    for (i = 0; i < l; i++) {
                        links[i].target = "_blank";
                    }
                    document.querySelector("#ajax_business_fiche").innerHTML += '<div id="chataigne-custom-staff-preview" style="max-height: 148px;font-size: 10px;margin: 20px;padding: 12px 20px;overflow-y: scroll;border: grey 1px solid;background-color: white;"></div>';
                    document.querySelector("#chataigne-custom-staff-preview").innerHTML = el.querySelector("#tabs-relations").innerHTML;
                    console.log(el.querySelector("#tabs-relations").innerHTML);
                }
            };
            xhttp.open("GET", currentSelectedStaff, true);
            xhttp.send();
        }
    }

    if(document.URL.match(doubleursRegex)) {
        let css = '.bad-form { border: red 1px solid !important; outline-color: red; }',
            head = document.head,
            style = document.createElement('style');
        head.appendChild(style);
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));

        document.getElementById("doubleurs").addEventListener("paste", (event) => {
            Promise.resolve().then(_ => {
                setTimeout(function() {
                    let pasted = document.getElementById("doubleurs").value;
                    if(pasted.match(doubleursANNRegex)) {
                        const subst = `($1), `;
                        const result = pasted.replace(doubleursANNRegex, subst);
                        document.getElementById("doubleurs").value = result.trim().replace(/\(([0-9]+)\)/, "(ep $1)").replace("(young)", "(enfant)").slice(0, -1);
                    } else if(pasted.match(doubleursAnidbRegex)) {
                        const subst = ` ($1), `;
                        const result = pasted.replace(doubleursAnidbRegex, subst);
                        document.getElementById("doubleurs").value = result.trim().slice(0, -1);
                    }
                }, 10);
            });
        });
        document.getElementById("doubleurs").addEventListener("change", checkDoubleurs);
        function checkDoubleurs() {
            let eld = document.getElementById("doubleurs");
            let val = eld.value;
            if(val.match(doubleursOK) || val == "") {
                eld.classList.remove("bad-form");
            } else {
                eld.classList.add("bad-form");
            }
        }
        checkDoubleurs();
    }

})();