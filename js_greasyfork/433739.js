// ==UserScript==
// @name         GITSTAT_ColorblindExtension
// @name:hu      GITSTAT_SzínvakKiegészítő
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  This is an extension for the GitStat 2021/2022, because the results are marked with color, which is a problem for colorblind people.
// @description:hu Ez egy kiegészítő az Óbudai egyetem diákjainak a prog3 GitStat 2021/2022 weboldalhoz, mert az eredmények színekkel vannak jelölve, ami a színtévesztő/színvak embereknek problémát jelent.
// @match        *://users.nik.uni-obuda.hu/kovacs.andras/hft/git*
// @icon         https://www.google.com/s2/favicons?domain=uni-obuda.hu
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/433739/GITSTAT_ColorblindExtension.user.js
// @updateURL https://update.greasyfork.org/scripts/433739/GITSTAT_ColorblindExtension.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    //English: If the comment contains a | operator it means that the left side of the operator is the comment in english and the right side is same in hungarian
    //Magyar: Ha a komment tartalmazza  | operátort, az azt jelenti hogy az operátor bal oldalán a komment angolul van a jobb oldalán meg ugyanaz a komment magyarul
    
    //English: Text colors (available colors: https://www.w3schools.com/colors/colors_names.asp) | Szöveg színek (elérhető színek: https://www.w3schools.com/colors/colors_names.asp)
    var trueColor="green"; // change this to change the color of things that are completed(default color is: green) | Változtasd meg a teljesítettek színét (alap szín: zöld)
    var falseColor="red"; // change this to change the color of things that are not completed(default color is: red) | Változtasd meg azokanak a színét, amik nem lettek teljesítve (alap szín: piros)


        var elements = document.getElementsByClassName('studenttrue'); // "studenttrue" is the class if everything is okay | "studenttrue" az osztály ha minden oké
        for(var i = 0; i < elements.length; i++){
            elements[i].style.color = trueColor;
            elements[i].firstChild.innerHTML+="   ✓";
        }
        var elements2 = document.getElementsByClassName('studentfalse'); // "studentfalse" is the class if something is wrong | "studentfalse" az osztály ha valami rossz
        for(i = 0; i < elements2.length; i++){
            elements2[i].style.color = falseColor;
            if (elements2[i].firstChild.innerHTML.includes(" 0")){ //If after the neptun code there is a 0 then we write extend it with a message | Ha a neptun kód után egy 0 van akkor kiegészítjük egy üzenettel
                if (elements2[i].parentElement.firstChild.innerHTML.includes("ENG")){ //If the course is in english we write out the english message | Ha angol a kurzus, akkor az angol üzenetet írjuk ki 
                    elements2[i].firstChild.innerHTML+=" - No github invite was sent"
                }
                else{ //If the course is in hungarian we write out the hungarian message | Ha magyar a kurzus, akkor a magyar üzenetet írjuk ki 
                    elements2[i].firstChild.innerHTML+=" - Nem lett elküldve a github meghívó"
                }

            }
            else{
                if (elements2[i].parentElement.firstChild.innerHTML.includes("ENG")){
                    elements2[i].firstChild.innerHTML+=" - Some things are not completed"
                }
                else{
                    elements2[i].firstChild.innerHTML+=" - Néhány dolog nem lett teljesítve"
                }
            }
        }
        var elements3 = document.getElementsByClassName('true'); // "true" is the class if the task is completed
        for(i = 0; i < elements3.length; i++){
            elements3[i].style.color = trueColor;
            elements3[i].innerHTML+="   ✓";
        }
        var elements4 = document.getElementsByClassName('false'); // "false" is the class if the task is not completed
        for(i = 0; i < elements4.length; i++){
            elements4[i].style.color = falseColor;
            elements4[i].innerHTML+="   X";
        }
})();