// ==UserScript==
// @name         [hwm]_send_batch_elements
// @namespace    Transfer Elements
// @version      0.1
// @description  Allows to transfer many elements on one page in batch
// @author       Hapkoman
// @include      https://www.lordswm.com/el_transfer.php*
// @include      https://www.heroeswm.ru/el_transfer.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lordswm.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481641/%5Bhwm%5D_send_batch_elements.user.js
// @updateURL https://update.greasyfork.org/scripts/481641/%5Bhwm%5D_send_batch_elements.meta.js
// ==/UserScript==


(function() {
    'use strict';
    //initialize element lists
    let elems = JSON.parse('{ "meteorit":"0", "badgrib":"0", "wind_flower":"0", "fire_crystal":"0", "witch_flower":"0", "abrasive":"0", "snake_poison":"0", "ice_crystal":"0", "moon_stone":"0", "tiger_tusk":"0", "fern_flower":"0" }');
    //get current url and determine if .com or .ru
    let url = location.hostname;
    let isCom = url.endsWith(".com");

    //find where to put menu
    let xpath = isCom ? "//b[text()='Select the element type.']" : "//b[text()='Выберите тип элемента.']";
    let menuElementContainer = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.parentNode.parentNode.parentNode.parentNode;
    //Create list of elements and inputs string for menu
    let elemsMenuString = "";
    Object.keys(elems).forEach(e=> {elemsMenuString +="<div><label for='hap_"+e+"'>"+e+" </label><input type='number' step='1' value='0' min='0' id='hap_"+e+"' name='hap_"+e+"'></div>"});
    //Add menu to container
    menuElementContainer.innerHTML += "<tr><td><table>"
    + "<tr>"
    + "<td><label for='hap_player_name'>Player name </label><input type='text' id='hap_player_name' name='hap_player_name'></td>"
    + "<td><label for='hap_price_per_element'>Pricer per element </label><input type='number' step='1' value='1' min='0' id='hap_price_per_element' name='hap_price_per_element'></td>"
    + "<td><label for='hap_comment'>Comment </label><input type='text' id='hap_comment' name='hap_comment'></td></tr>"
    +" <tr>"
    + "<td>"+elemsMenuString+"</td>"
    + "<td><button id='hap_submit_elems'>Send</button></td>"
    + "<td><div><span>Fill out amount of elements to send and click send </span><span id='hap_msg' style='font-weight:bold'></span></div></td>"
    + "</tr>"
    + "</table></td></tr>";

    //add listener for submitting elements on submit button
    document.getElementById("hap_submit_elems").addEventListener("click", submitElements);

    function submitElements(){
        //clear msgs
        document.getElementById("hap_msg").innerHTML = "Gathering and sending...";
        //get input values
        let playerName = document.getElementById("hap_player_name").value.trim();
        let pricePerElement = document.getElementById("hap_price_per_element").value;
        let comment = document.getElementById("hap_comment").value;
        let sign = document.getElementsByName("sign")[0].value;
        //get values for each element that is more than zero
        let elemsToSend = {};
        Object.keys(elems).forEach(e=>{
            let elemCount = document.getElementById("hap_"+e).value;
            if (elemCount > 0) {
                elemsToSend[e] = elemCount;
            }
        });
        if (playerName && pricePerElement >= 0 && Object.keys(elemsToSend).length > 0){
            let delayModifier = 0;
            Object.keys(elemsToSend).forEach(e => {
                //delay execution since otherwise it crashes browser
                setTimeout(sendElement(playerName, e, elemsToSend[e], pricePerElement, comment, sign), 1500 * delayModifier);
                delayModifier++;
            });
        }
        else {
            //player name empty or price per element less than 0 or elements to send are 0 so show error and don't send elems
            document.getElementById("hap_msg").innerHTML = "Some fields are empty or not filled. e.g., player name may be empty, price per element is set less than 0, no elements selected to send";
        }
    };
    async function sendElement(name, elem, elemCount, elemPrice, comment, sign){
        const response = await fetch("\\el_transfer.php" , {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "nick="+name.replaceAll(' ', '+')+"&eltype="+elem+"&count="+elemCount+"&gold="+elemPrice+"&comment="+comment.trim().replaceAll(' ', '+')+"&sendtype=1&art_id=&sign="+sign
        }).then(resp => {
            if (resp.url.endsWith("done=1")){
                document.getElementById("hap_msg").innerHTML+= "<br>"+elem+" has been successfully sent. ";
            } else {
                document.getElementById("hap_msg").innerHTML+= "<br>Some error occurred while sending "+elem+". ";
            }
        });

    };
})();