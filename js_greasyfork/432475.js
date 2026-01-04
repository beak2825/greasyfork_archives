// ==UserScript==
// @name         YMS_VRID_COMPLIANCE
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Check assets VRID Compliance
// @author       NOWARATN
// @match        https://trans-logistics-eu.amazon.com/yms/shipclerk/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432475/YMS_VRID_COMPLIANCE.user.js
// @updateURL https://update.greasyfork.org/scripts/432475/YMS_VRID_COMPLIANCE.meta.js
// ==/UserScript==


var linijka;
var i;
var temp_vrid2;
var kon_vrid;
var naczepa_vrid;
var error_brama;
var zly_kon;

linijka = document.getElementsByTagName("TR");

setTimeout(function() {
    setInterval(function(){

        if(document.getElementById("infobox_div") == undefined)
        {
            var infobox = document.createElement ('div');
            infobox.innerHTML = '<div id="infobox_div" style="text-align:center;border-style:solid !important;border:black;">ERROR</div>' +
                '<div id="infobox_tresc_id" ></div><input type="button" id="potwierdz_zly_vrid_id" value="Potwierdzam niezgodnosc VRID" style="padding:10px;left:0px;position:absolute;bottom:1px;"/>';
            infobox.setAttribute ('id', 'infobox_div');
            infobox.setAttribute ('style', 'position:absolute;width:250px;height:150px;background-color:silver;right:550px;top:400px;overflow:auto;color:black;display:none;');
            document.getElementsByTagName("body")[0].appendChild(infobox);

            document.getElementById ("potwierdz_zly_vrid_id").addEventListener (
                "click", ButtonZlyVrid, false
            );

            function ButtonZlyVrid (zEvent)
            {
                console.log(zly_kon);
                localStorage.setItem(zly_kon + "_yms","ok");
                document.getElementById("infobox_div").style.display = "none";
            }
        }

        for (i = 30 ; i < 70 ; i++)
        {
            if(linijka[i].children.length == 8) // koń pod naczepą54654654
            {
                if(linijka[i].children[5].innerText != "") // Pole LOAD IDENTIFIERSDFAS
                {
                    temp_vrid2 = linijka[i].children[5].innerText.slice(-9);
                    temp_vrid2 = temp_vrid2.replace(" ","");
                    temp_vrid2 = temp_vrid2.replace(" ","");

                    kon_vrid = temp_vrid2;

                    naczepa_vrid = linijka[i-1].children[7].innerText.slice(-9);
                    naczepa_vrid = naczepa_vrid.replace(" ","");
                    naczepa_vrid = naczepa_vrid.replace(" ","");

                    if(kon_vrid != "" && naczepa_vrid != "")
                    {
                        if(kon_vrid != naczepa_vrid)
                        {
                            zly_kon = kon_vrid;
                            if(localStorage.getItem(kon_vrid + "_yms") != "ok")
                            {
                                document.getElementById("infobox_div").style.display = "block";
                                error_brama = document.getElementsByTagName("TR")[i-1].children[0].children[0].children[0].children[0].innerText;
                                document.getElementById("infobox_tresc_id").innerText = "Zła kombinacja tractor/trailer na bramie: " + error_brama;
                            }
                        }
                    }
                }
            }
        }
    },5000);
},5000);