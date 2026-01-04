// ==UserScript==
// @name         הודעות להגהות
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  מוסיף שלושה כפתורים חדשים לצד פרסום הודעה: הגהה בדרך, הגהה מוכנה והגהה מוכנה + הערות
// @author       RemixN1V - Niv
// @match        https://www.fxp.co.il/showthread.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420059/%D7%94%D7%95%D7%93%D7%A2%D7%95%D7%AA%20%D7%9C%D7%94%D7%92%D7%94%D7%95%D7%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/420059/%D7%94%D7%95%D7%93%D7%A2%D7%95%D7%AA%20%D7%9C%D7%94%D7%92%D7%94%D7%95%D7%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //window.onload = (event) => {
    let group = document.getElementsByClassName("group")[2];
    console.log("a");
    let Mahlaka = document.getElementsByClassName("navbit")[4];
    if (!Mahlaka) return;
    if (Mahlaka.innerText.includes("חדר עבודה") || Mahlaka.innerText == "הגהות לאירוחים") {
        let b = 'קוף בדרך';
        group.innerHTML += `<br>
<input style="margin-top: 3px" type="button" class="button" value="הגהה בדרך" title="הגהה בדרך" name="HBadereh" tabindex="1" id="qr_hagaha_badereh" onclick="document.querySelector('#cke_contents_vB_Editor_QR_editor > iframe').contentWindow.document.body.append(\`${b}\`); $('#qr_submit').click();">
<input type="button" class="button" value="הגהה מוכנה" title="הגהה מוכנה" name="HMuhana" tabindex="1" id="qr_hagaha_muhana">
<input type="button" class="button" value="הגהה מוכנה + הערות" title="הגהה מוכנה" name="HMuhana" tabindex="1" id="qr_hagaha_muhana_h">`;
    }
    let HMuhana = "הקופיף סיים";

    let OG = '[taguser]311246[/taguser]'//Daniellie
             +'\n[taguser]1301804[/taguser]',//אוצרות המוות

        OT = '[taguser]917499[/taguser]'//אביתר
             +'\n[taguser]927738[/taguser]',//Extends

        OC = '[taguser]1431538[/taguser]'//אלון בלון
             +'\n[taguser]1431461[/taguser]',//ariel

        OTC = '[taguser]367474[/taguser]'//itay
              +'\n[taguser]1377978[/taguser]',//philosopy of life

        OE = '[taguser]918795[/taguser]';//Bauss

    let time = 500;

    async function write(t) {
        vB_Editor["vB_Editor_QR"].write_editor_contents(t);
    }

    document.getElementById("qr_hagaha_muhana").addEventListener("click", async function() {
        //document.querySelector('#cke_contents_vB_Editor_QR_editor > iframe').contentWindow.document.body.append("סבתאל'ה סיימה להגיה");
        let Mahlaka = document.getElementsByClassName("navbit")[4];
        if (Mahlaka.innerText.includes("טכנולוגיה")) {
            write(HMuhana+"\n"+OT);
            setTimeout(function(){ $('#qr_submit').click(); }, time);
        }
        if (Mahlaka.innerText.includes("גיימינג")) {
            write(HMuhana+"\n"+OG);
            setTimeout(function(){ $('#qr_submit').click(); }, time);
        }
        if (Mahlaka.innerText.includes("קולנוע וסדרות")) {
            write(HMuhana+"\n"+OC);
            setTimeout(function(){ $('#qr_submit').click(); }, time);
        }
        if (Mahlaka.innerText.includes("תוכן כללי")) {
            write(HMuhana+"\n"+OTC);
            setTimeout(function(){ $('#qr_submit').click(); }, time);
        }
        if (Mahlaka.innerText.includes("אירוחים")) {
            write(HMuhana+"\n"+OE);
            setTimeout(function(){ $('#qr_submit').click(); }, time);
        }
    });


    document.getElementById("qr_hagaha_muhana_h").addEventListener("click", function() {
        //document.querySelector('#cke_contents_vB_Editor_QR_editor > iframe').contentWindow.document.body.append("סבתאל'ה סיימה להגיה");
        let Mahlaka = document.getElementsByClassName("navbit")[4];
        if (Mahlaka.innerText.includes("טכנולוגיה")) {
            write(HMuhana+"\n"+OT);
        }
        if (Mahlaka.innerText.includes("גיימינג")) {
            write(HMuhana+"\n"+OG);
        }
        if (Mahlaka.innerText.includes("קולנוע וסדרות")) {
            write(HMuhana+"\n"+OC);
        }
        if (Mahlaka.innerText.includes("תוכן כללי")) {
            write(HMuhana+"\n"+OTC);
        }
        if (Mahlaka.innerText.includes("אירוחים")) {
            write(HMuhana+"\n"+OE);
        }
    });
    //};
})();









a = document.getElementById('threads').children;
initialNum = 1;
try {
    s = 25;
    if (window.location.href.indexOf('pp=') > - 1) {
        s = window.location.href.substring(window.location.href.indexOf('pp=') + 3);
        i = 0;
        for (i = 0; i < s.length && s.charAt(i) != '&'; i++) {
        }
        s = parseInt(s.substring(0, i));
    }
    initialNum += (parseInt(document.getElementsByClassName('selected') [0].children[0].innerHTML) - 1) * s;
    //alert(window.location.href);
} catch (e) {
}
for (i = 0; i < a.length; i++) {
    a[i].children[0].children[0].children[0].innerHTML = (i + initialNum);
}