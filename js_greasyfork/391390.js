// ==UserScript==
// @name         Neopets Main Shop Item Filter
// @version      0.4.8
// @description  Takes in a list of profitable items, and filters out the junk.
// @author       Shoyru
// @namespace    Shoyru @ clraik
// @include      http://www.neopets.com/objects.phtml?obj_type=*&type=shop
// @include      http://www.neopets.com/objects.phtml?type=shop&obj_type=*
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391390/Neopets%20Main%20Shop%20Item%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/391390/Neopets%20Main%20Shop%20Item%20Filter.meta.js
// ==/UserScript==
var storage;
localStorage.getItem("U2hvcEZpbHRlcg==") != null ? storage = JSON.parse(localStorage.getItem("U2hvcEZpbHRlcg==")) : storage = {};

(function(){
    "use strict";
    if(document.querySelectorAll("form")[2] != null && storage.Saved != "VHJ1dGh5"){
        let posi = document.querySelector(`table[align="center"][cellpadding="4"][border="0"]`) ? document.querySelectorAll("form")[2] : document.querySelectorAll("hr")[0];
        posi.insertAdjacentHTML("beforebegin", `<section style="padding:20px 0 10px 0"><fieldset style="width:450px; margin:5px auto; padding:10px 2em 0 2em; border:1px solid #bbb"><legend style="margin:0 auto; font-size:110%; font-weight:bold">Main Shop Item Filter</legend><div style="text-align:center; padding:5px 0"> Paste in the items that you want to look for in shops.<br> Only one item per line. Hit enter before placing the next item.<br><br><textarea id="userInputVHJ1dGh5" rows="5" cols="45" placeholder="Darigan Draik Morphing Potion\nFaerie Draik Morphing Potion\nDesert Lutari Morphing Potion"></textarea></div><div style="text-align:center; padding:5px 0"> <button id="saveVHJ1dGh5" style="padding:0 25px">Save</button></div></fieldset> </section>`);
        function saveValues(){
            if(document.getElementById("userInputVHJ1dGh5").value <= 0) alert("Please enter at least one item before saving.")
            else {
                var userInput = document.getElementById("userInputVHJ1dGh5").value;
                userInput = userInput.replace(/[&\/\\#,+()$~%.":*?<>{}]/g, '');
                userInput = userInput.split(/\n/);
                for(let i = 0; i < userInput.length; i++) userInput[i] = userInput[i].trim();
                storage.stringArr = userInput;
                storage.Saved = "VHJ1dGh5";
                localStorage.setItem("U2hvcEZpbHRlcg==", JSON.stringify(storage));
                location.reload(true)
            }
        }
        document.getElementById("saveVHJ1dGh5").addEventListener("click", saveValues);
    }
    /**/
    if (storage.Saved == "VHJ1dGh5" && document.querySelectorAll("form")[2] != null){
        try {
            var profitRegex = [];
            function strToRegex(string) {
                var match = /^\/(.*)\/([a-z]*)$/.exec(string)
                return new RegExp(match[1], match[2])
            }
            let regArr = [], modalArr = [];
            for (let i = 0; i < storage.stringArr.length; i++) {
                regArr.push("/^"+storage.stringArr[i]+"$/i");
                modalArr.push(`<li style="padding-left: 5px">${storage.stringArr[i]}</li>`);
                profitRegex.push(strToRegex(regArr[i]));
            }
            modalArr = modalArr.join("");
            let posi = document.querySelector(`table[align="center"][cellpadding="4"][border="0"]`) ? document.querySelectorAll("form")[2] : document.querySelectorAll("hr")[0];
            posi.insertAdjacentHTML("beforebegin", `<section style="text-align:center"><div class="resetSavedItemList" style="display:inline-block; margin:5px 0 5px 0; padding:5px; cursor:pointer; font-weight:bold">Delete Saved Items</div>|<div id="showSavedItemsLink" style="display:inline-block; margin:5px 0 5px 0; padding:5px; cursor:pointer; font-weight:bold">Show Saved Items</div> </section> <aside id="savedItemListModal" style="display:none; position:fixed; z-index:9998; top:0; left:0; width:100vw; height:100vh; overflow:hidden; background-color:rgba(0,0,0,0.4);"><div class="modalBox" style="background-color: #fff; border:1px solid #000; padding:10px; margin:25vh auto; min-height:100px; max-height:38vh; width:350px; display:flex; flex-direction:column; justify-content:space-between;"><div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:5px"><div style="font-size:120%; font-weight:bold;">Saved Item List:</div><div id="closeSavedItemListModal" style="color:#aaa; font-size:130%; font-weight:bold; cursor:pointer">&times;</div></div><ol id="printedItemsOrderedList" style="overflow:auto; margin:5px; padding:5px 0 5px 35px; border:1px solid #000; min-height:60px; max-height:100%;">${modalArr}</ol><div style="padding-top:5px; display:flex; justify-content: space-between"><div class="resetSavedItemList" style="display:inline-block; cursor:pointer; font-weight:bold">Delete All Items</div><div id="addMoreItemsLink" style="display:inline-block; cursor:pointer; font-weight:bold">Add More Items</div></div><aside id="addMoreItemsModal" style="text-align:center; display:none; position:absolute; background-color:rgba(0,0,0,0.4); top:0; left:0; width:100vw; height:100vh; overflow:hidden; z-index:99999;"><div class="modalBox" style="background-color: #fff; border:1px solid #000; padding:7px; margin:35vh auto; width:380px; display:flex; flex-direction:column"><div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:5px"><div style="font-size:120%; font-weight:bold;">Add More Items:</div><div id="closeAddMoreItemsModal" style="color:#aaa; font-size:130%; font-weight:bold; cursor:pointer">&times;</div></div><textarea id="addMoreItemsTextarea" rows="5" cols="40" placeholder="Hit enter for every new item"></textarea><div style="margin: 7px 0 0 0"> <button id="saveAddedItems">Add Items</button></div></div> </aside></div> </aside>`)
            var modal = document.getElementById("savedItemListModal");
            document.getElementById("showSavedItemsLink").addEventListener("click", () => {modal.style.display = "block"; document.body.style.overflow = "hidden"});
            document.getElementById("closeSavedItemListModal").addEventListener("click", function(){modal.style.display = "none"; document.body.style.overflow = "auto"});
            var modal2 = document.getElementById("addMoreItemsModal");
            document.getElementById("addMoreItemsLink").addEventListener("click", function(){modal2.style.display = "block"; document.getElementById("printedItemsOrderedList").style.overflow = "hidden"});
            document.getElementById("closeAddMoreItemsModal").addEventListener("click", function(){modal2.style.display = "none"; document.getElementById("printedItemsOrderedList").style.overflow = "auto"});
            window.onclick = function(event) {
                if (event.target == modal){
                    modal.style.display = "none";
                    modal2.style.display = "none";
                    document.body.style.overflow = "auto";
                }
            }
            modal.onclick = function(event) {
                if(event.target == modal2){
                    modal2.style.display = "none";
                    document.getElementById("printedItemsOrderedList").style.overflow = "auto"
                }
            }
            function addMoreItems(){
                if(document.getElementById("addMoreItemsTextarea").value <= 0) alert("Please enter at least one item before saving.")
                else {
                    var additionalInput = document.getElementById("addMoreItemsTextarea").value;
                    additionalInput = additionalInput.replace(/[&\/\\#,+()$~%.":*?<>{}]/g, '');
                    additionalInput = additionalInput.split(/\n/);
                    for(let i = 0; i < additionalInput.length; i++) {
                        additionalInput[i] = additionalInput[i].trim();
                        storage.stringArr.push(additionalInput[i])
                    }
                    localStorage.setItem("U2hvcEZpbHRlcg==", JSON.stringify(storage));
                    location.reload(true)
                }
            }
            function resetValues(){
                if(confirm("Are you sure you want to delete ALL your saved items? (You can't recover them!)")){
                    localStorage.removeItem("U2hvcEZpbHRlcg==");
                    location.reload(true);
                }
            }
            document.getElementsByClassName("resetSavedItemList")[0].addEventListener("click", resetValues);
            document.getElementsByClassName("resetSavedItemList")[1].addEventListener("click", resetValues);
            document.getElementById("saveAddedItems").addEventListener("click", addMoreItems);
            if (document.querySelector(`table[align="center"][cellpadding="4"][border="0"]`) && profitRegex.length > 0){ // shop has items
                var table = document.querySelector(`table[align="center"][cellpadding="4"][border="0"]`).children[0],
                    shopItemText = [], shopItemCells = [], profitOnPageArr = [], keepArr = [], profitCells = [];
                for (let i = 0; i < table.rows.length; i++) {
                    for (let j = 0; j < table.rows[i].cells.length; j++){
                        shopItemText.push(table.rows[i].cells[j].childNodes[1].innerText);
                        shopItemCells.push(table.rows[i].cells[j]);
                    }
                }
                for(let i = 0; i < profitRegex.length; i++){
                    if(shopItemText.find(value => profitRegex[i].test(value) > 0)){
                        profitOnPageArr.push(shopItemText.find(value => profitRegex[i].test(value)));
                    }
                }
                for (let j = 0; j < profitOnPageArr.length; j++){
                    if(shopItemText.indexOf(profitOnPageArr[j]) >= 0){
                        keepArr.push(shopItemText.indexOf(profitOnPageArr[j]));
                        profitCells.push(shopItemCells[keepArr[j]]);
                    }
                }
                for (let i = 0; i < profitCells.length; i++) profitCells[i].firstChild.removeAttribute("onclick");
                var profitSet = new Set(profitCells),
                    removeItems = shopItemCells.filter(x => !profitSet.has(x));
                for (let i = 0; i < removeItems.length; i++) removeItems[i].remove();
                var tableHTML = document.querySelector(`table[align="center"][cellpadding="4"][border="0"]`).innerHTML;
                var newHTML = tableHTML.replace(/<tbody>/gi, `<div style="display:flex; justify-content:center; align-items:center; text-align:center; flex-wrap:wrap; width:782px;">`).replace(/<tr>/gi, ``).replace(/<\/tr>/gi, ``).replace(/<td width="120" valign="top" align="center">/gi, `<div style="width:120px">`).replace(/<td width="120" align="center" valign="top">/gi, `<div style="width:120px">`).replace(/<\/td>/gi, `</div>`).replace(/<\/tbody>/gi, `</div>`);
                // retaining the outside of the table to maintain some compatibility with other scripts
                document.querySelector(`table[align="center"][cellpadding="4"][border="0"]`).innerHTML = newHTML;
            }
        }
        catch(ex){
            localStorage.removeItem("U2hvcEZpbHRlcg==");
            alert("There was an error with the script. Tell Shoyru: "+ex);
            console.log(ex)
        }
    }
})();