// ==UserScript==
// @name         Goatlings: Save Outfit
// @version      0.1.3
// @description  A save outfit feature for Goatlings. Written before the current save outfit feature was implemented. Merely proof of concept, now.
// @author       Felix G. "Automalix"
// @namespace    https://greasyfork.org/en/users/322117-automalix
// @match        http://www.goatlings.com/habuddy*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392155/Goatlings%3A%20Save%20Outfit.user.js
// @updateURL https://update.greasyfork.org/scripts/392155/Goatlings%3A%20Save%20Outfit.meta.js
// ==/UserScript==

/*It is not recommended to run this script, as there is official implementation of what it achieves, but you can do so without breaking site functionality.*/
(function(){
    const setStoredValue = function(key, value) {
        if (value == null || value === undefined) localStorage.removeItem(key)
        else {
            if (typeof value != "number" && typeof value != "string") value = JSON.stringify(value)
            localStorage.setItem(key, value)
        }
    },
          getStoredValue = function(key, safety) {
              let value = localStorage.getItem(key);
              if (value != null) {
                  if (typeof value == "string") {
                      try {return JSON.parse(value)}
                      catch (ex) {console.log(ex)}
                  }
                  return value;
              }
              return safety;
          },
          clothing = new Map(),

          DOM = {
              saveOutfit: document.querySelector(`input[onclick="save_outfit()"]`),
              itemArea: document.querySelector("#item_area_ajax"),
              closetItems: document.querySelector("#item_area_ajax").childNodes,
              hairButton: document.querySelector(`input[value="Hair"]`),
              facesButton: document.querySelector(`input[value="Faces"]`),
              hatsButton: document.querySelector(`input[value="Hats"]`),
              bodyButton: document.querySelector(`input[value="Body"]`),
              basesButton: document.querySelector(`input[value="Bases"]`),
              accessoriesButton: document.querySelector(`input[value="Accessories"]`),
              backgroundsButton: document.querySelector(`input[value="Backgrounds"]`),
              outfitsButton: document.querySelector(`input[onclick="load_outfits()"]`),
              reset: document.querySelector(`input[value="Reset"]`),
          },

          Outfit = function(outfit){ //constructor for new Outfits
              this.outfit = outfit;
          };

    let a = ["hair", "faces", "hats", "body", "bases", "accessories", "backgrounds"], // 0-6;
        closet = "hair"; //the page loads on the hair tab so we can assume this to be true

    const savedOutfits = getStoredValue("Saved Outfits", {});
    //DOM.reset.insertAdjacentHTML('afterend', `&nbsp;<input class="button" type="button" value="Archive My Outfit">`)
    //DOM.saveOutfit = document.querySelector('input[value="Archive My Outfit"]');

    DOM.saveOutfit.onclick = null;
    const saveList = function (){
        let [index, saveClothes] = [0, clothing]
        if(Object.keys(savedOutfits).length > 0) index = Object.keys(savedOutfits).length;
        savedOutfits[index] = new Outfit(JSON.stringify([...saveClothes]));
        setStoredValue("Saved Outfits", savedOutfits)
    }
    DOM.saveOutfit.addEventListener("click", saveList)
    DOM.outfitsButton.addEventListener("click", function(){
        const outfitImageLoadObserver = new MutationObserver(
            function(){
                let savedOutfitsArr = [], val = [];
                for(let value in savedOutfits){
                    savedOutfitsArr.push(`<li class="my-saved-outfits"><button class="button" id="${value}">Put On Outfit ${Number(value) + 1}</button></li>`)
                    val.push(value);
                }
                DOM.itemArea.firstChild.insertAdjacentHTML('afterend',
                                                           /*`<div id="testOutput" style="text-align:center; margin:10px;">
                                                               <button>Print Outfit Object to Console</button>
                                                            </div>`+*/
                                                            `<div id="testDelete" style="text-align:center; margin:10px;">
                                                               <button class="button" >Delete All Saved Outfits</button>
                                                            </div>
                                                            <div id="outfitHolderDiv" style="text-align:center; margin-bottom:10px;">
                                                                <ul style="list-style:none; margin:0; padding:0; color:white">
                                                                    ${savedOutfitsArr}
                                                                </ul>
                                                            </div>`)
                //document.querySelector("#testOutput").addEventListener("click", function(){console.log(savedOutfits)})
                document.querySelector("#testDelete").addEventListener("click", function(){
                    localStorage.removeItem("Saved Outfits");
                    document.querySelector("#outfitHolderDiv").remove()
                })
                for(let value of document.querySelectorAll(`.my-saved-outfits`)){
                    value.addEventListener("click", function(event){
                        DOM.reset.click();
                        putOnOutfit(event.originalTarget.id);
                    })
                }
                outfitImageLoadObserver.disconnect();
            })
        outfitImageLoadObserver.observe(DOM.itemArea, {childList: true})
    })

    const putOnOutfit = function(num){
        if(Object.keys(savedOutfits).length > 0){
            let ourClothes = JSON.parse(savedOutfits[num].outfit);
            ourClothes.map(function(value, index){
                setTimeout(
                    function(value){
                        clothingClicker(value)
                    }, index * 1000, value)
            })
        }
    },
          clothingClicker = function(itemArr){
              let [itemID, page] = [itemArr[0], itemArr[1]];
              const pageSwitch = function(location){
                  document.querySelector(`input[value="${location.charAt(0).toUpperCase() + location.slice(1)}"]`).click()
              }
              const clickOn = function(){
                  try {document.querySelector(`#${itemID}`).firstChild.click()} catch(ex){}
                  itemObserver.disconnect();
              }
              pageSwitch(page)
              const itemObserver = new MutationObserver(clickOn)
              itemObserver.observe(DOM.itemArea, {subtree: true, childList: true});
              //console.log(itemID, page);
          },

          clothesSaver = function(itemID, closetPage){
              if (clothing.has(itemID)) clothing.delete(itemID)
              else clothing.set(itemID, closetPage)
          },

          closetObserverInit = function(){
              const closetItemObserver = new MutationObserver(function(event){
                  let ID = event[0].target.id;
                  clothesSaver(ID, closet);
                  //console.log(clothing)
              });
              for(let value of DOM.closetItems) {
                  if(typeof value == "object") {
                      closetItemObserver.observe(value, {childList: true, attributes: true, characterData: true})
                  }
              }
          },
          pageChecker = function(element){
              let page = element.value;
              closet = page.toLowerCase();
          };
    closetObserverInit();
    const itemAjaxObserver = new MutationObserver(closetObserverInit);
    itemAjaxObserver.observe(DOM.itemArea, {childList: true, attributes: true, characterData: true})

    DOM.hairButton.addEventListener("click", function(){pageChecker(this)})
    DOM.facesButton.addEventListener("click", function(){pageChecker(this)})
    DOM.hatsButton.addEventListener("click", function(){pageChecker(this)})
    DOM.bodyButton.addEventListener("click", function(){pageChecker(this)})
    DOM.basesButton.addEventListener("click", function(){pageChecker(this)})
    DOM.accessoriesButton.addEventListener("click", function(){pageChecker(this)})
    DOM.backgroundsButton.addEventListener("click", function(){pageChecker(this)})
    DOM.reset.addEventListener("click", function(){clothing.clear()})
})()