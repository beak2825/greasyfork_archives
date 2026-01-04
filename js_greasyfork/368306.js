// ==UserScript==
// @name         Anti-410
// @namespace    Anti-410 script officiel
// @version      0.4
// @description  solution de cryptage des posts pour le 18-25
// @author       JeanMrRobot
// @match        http://www.jeuxvideo.com/forums/*
// @match        http://m.jeuxvideo.com/forums/*
// @icon         https://www.noelshack.com/2018-20-4-1526591384-no410.png
// @downloadURL https://update.greasyfork.org/scripts/368306/Anti-410.user.js
// @updateURL https://update.greasyfork.org/scripts/368306/Anti-410.meta.js
// ==/UserScript==

const data = ["XvevxEhat", "Ohzoyrorr_", "Zrapubi-Tveb", "Xiryqffnat bqbxv"];
const data2 = ["WIP_PRQEVK", "YBTNA", "NANTHAQ", "CNAGUNN", "XNNENW", "[87]", "ZEQREVI", "RCLBA", "FVYRAG_WNL",
    "PNEAORR", "XENPBH", "WNPXOENQSBEQ", "NLQRA_", "PURJOVRSE", "QNSENAF", "ZVENV_QBQB", "ZBT-XHOB", "ZNYYBQRYVP",
    "PYRZRAGBFF", "BYVIREBVQHOBPNY", "VNU", "WHAR", "VCYNL4LBH", "FHCRECNAQN", "TANC_TANC", "NYIVA_FGVPX", "ARCURAVR",
    "NAGVFGNE", "ZKTERRA", "PGUHYUHF", "QBZVAVX85", "WNPXYRNCC", "XNZVFNZNOBO", "ZRAPUBI-TVEB", "ENAQBPNA",
    "FBENAQBZCYNLRE", "JEBAQENY", "SRNE-VRY", "PREMNG43", "RGBENXRA", "[GUR]_FBEEBJ", "EVEV_15", "FCVKRY_ OELXBH",
    "4XVGB", "OVOVFYNLRE", "GEHAXF", "PNEQRYY", "XBLHX", "ORNEQB", "XRA", "OBTNEQ", "FJVSG", "YVTUGZNA", "FGBHO",
    "YRIVNGUNA", "Tanc_Tanc", "fhcrecnaqn"];

(function() {
    const encrypt = document.createElement("input");
    encrypt.type = "button";
    encrypt.value = "Chiffrer";
    encrypt.onclick = encryption;

    const blocEditor = document.getElementsByClassName('col-md-12 bloc-editor-forum');
    blocEditor[0].appendChild(encrypt);

    const posts = document.getElementsByClassName("bloc-message-forum");

    Array.from(posts).forEach(post => {
        const block = post.querySelector(".bloc-contenu");
        const login = document.getElementsByClassName("account-pseudo")[0].innerHTML;

        if(data.concat(data2).indexOf(rot13(login)) < 0) {
            const decrypt = document.createElement("input");
            decrypt.type = "button";
            decrypt.value = "Déchiffrer";
            decrypt.addEventListener('click', () => {
                decryption(block.firstElementChild);
            });

            post.appendChild(decrypt);
        }
    });
})();

function rot13(str) {
    const input     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const output    = 'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm';
    const index     = x => input.indexOf(x);
    const translate = x => index(x) > -1 ? output[index(x)] : x;

    return str.split('').map(translate).join('');
}

function encryption() {
    const message = document.getElementById('message_topic').value;
    document.getElementById('message_topic').value = rot13(message);
}

function decryption(blockToDecrypt) {
    const text = blockToDecrypt.firstElementChild;

    alert(rot13(text.textContent));
}