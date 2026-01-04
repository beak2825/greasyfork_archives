// ==UserScript==
// @name     Dont Starve Together - Fandom - Crock Pot - Just show your favorite recipes!
// @version  5
// @grant    none
// @require https://cdn.jsdelivr.net/npm/vue@2
// @license MIT
// @match https://dontstarve.fandom.com/wiki/Crock_Pot
// @description This is a little extension for the game "Don't Starve Together". To be more specific: for the corresponding fandom.com-Page, for all ingame-recipes. This scripts filters the shown table of the page for the most important recipes. You are able to customize the shown values (little technical knowledge necessary). How to do that: 1) Open https://jsonkeeper.com/b/QVX0 2) Copy json 3) Create a new json on jsonkeeper.com 4) Copy link of your json into this script (first variable of script)
// @namespace https://greasyfork.org/users/858161
// @downloadURL https://update.greasyfork.org/scripts/437646/Dont%20Starve%20Together%20-%20Fandom%20-%20Crock%20Pot%20-%20Just%20show%20your%20favorite%20recipes%21.user.js
// @updateURL https://update.greasyfork.org/scripts/437646/Dont%20Starve%20Together%20-%20Fandom%20-%20Crock%20Pot%20-%20Just%20show%20your%20favorite%20recipes%21.meta.js
// ==/UserScript==









//------------------- CONFIGURATION -------------------
//------------------- create own list on jsonkeeper.com and replace link here or set "var urlFavoriteRecipes = null;" to show all recipes -------------------
var urlFavoriteRecipes = "https://jsonkeeper.com/b/QVX0";






//------------------- CODE -------------------
//------------------- (dont touch) -------------------

window.addEventListener("load", afterLoad);
function afterLoad(){
    // initialize app
    const app = new Vue({
      el: '#content', data: {sPreset: null, bDone: false, iDoneCounter: 0},
      created: function() {
        
        
          setTimeout(()=>{
          	app.showLoading();
          }, 100);
        
          setTimeout(()=>{
						app.init();
          }, 1000);
								
      },//created function end
      methods: {
        init: () => {

          	app.cssClear();

if (!urlFavoriteRecipes || !urlFavoriteRecipes.length) {
app.hideLoading();
return;
}
        
          
          	
						fetch(urlFavoriteRecipes).then(res => {
								res.json().then(dataObj => {
                  var lowered = dataObj.recipes.map(str => str.toLowerCase());
          				app.filterTable(lowered);
                  app.hideLoading();
                });
        		});//fetch end
          
        },
        continueLoadingAnimation: (loadingScreen, loadingText) => {
          app.iDoneCounter = app.iDoneCounter < 3 ? app.iDoneCounter+1 : 0;
          console.log(app.iDoneCounter);
          
          loadingText.textContent = "Clean and filter" + ".".repeat(app.iDoneCounter);
          setTimeout(()=>{
            if (!app.bDone) {
          		app.continueLoadingAnimation(loadingScreen, loadingText);
            } else {
              	loadingScreen.style.display = "none";
              	loadingText.style.display = "none";
            }
          }, 150);
        },
        showLoading: () => {
          
          var loadingScreen = document.createElement("div");   
          loadingScreen.setAttribute("id", "customWaitingScreen");
          var loadingText = document.createElement("div");    
          loadingText.setAttribute("id", "customWaitingText");
          document.body.appendChild(loadingText); 
          document.body.appendChild(loadingScreen); 
          
         	//thanks to https://stackoverflow-com.translate.goog/a/55120011?_x_tr_sl=en&_x_tr_tl=de&_x_tr_hl=de&_x_tr_pto=sc
          var setStyleScreen = { 
            zIndex: 10000,
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: "black",
            opacity: 0.8
          };
          for(var prop of Object.keys(setStyleScreen)){
          	loadingScreen.style[prop.toString()] = setStyleScreen[prop.toString()];
          } 
          var setStyleText = { 
            zIndex: 20000,
            position: "absolute",
            //top: 0,
            right: 0,
            //bottom: 0,
            //left: 0,
            display: "flex",
            color: "white",
            fontSize: "30px",
            fontWeight: "bold",
            textAlign: "center",
						bottom: "10%",
            left: "45%"
          };
          for(var prop of Object.keys(setStyleText)){
          	loadingText.style[prop.toString()] = setStyleText[prop.toString()];
          } 
          app.continueLoadingAnimation(loadingScreen, loadingText);
        },
        hideLoading: () => {
          
          setTimeout(()=>{
          	app.bDone = true;
          }, 2000);
        },
        cssClear: () => {
          
          
          var aCssDescriptions = [".mw-parser-output > :not(table)", "aside", ".community-header-wrapper", ".global-navigation", ".page-header", ".page-side-tools__wrapper", ".WikiaBarWrapper", ".navbox", ".page-footer" ,"#mixed-content-footer", ".wds-global-footer"];
          
          aCssDescriptions.forEach(cssDescription => {
            document.querySelectorAll(cssDescription).forEach(currentElement => {
              currentElement.style.display = "none";
            });//end cssDescription
          });//end aCssDescriptions
          
          
        },
        filterTable: (aSearchTexts) => {
          //var aSearchText = document.querySelector('#tableSearch').value.toLowerCase().split(",").map(s => s.trim());
          document.querySelectorAll('table.sortable > tbody > tr').forEach(row => {
          	app.handleRowVisibility(row, aSearchTexts);
          });
        },
        handleRowVisibility: (row, aSearchTexts) => {
          var sNewDisplay; 
          if (app.sPreset) {
            sNewDisplay = app.sPreset;
            app.sPreset = null;
          } else {
            if (app.containAny(row.textContent.toLowerCase(), aSearchTexts)) {
              sNewDisplay = "table-row"
            } else {
              sNewDisplay = "none"
            }
            if (app.hasRowSpan(row)) {
              app.sPreset = sNewDisplay;
            }
          }
          row.style.display = sNewDisplay;
        },
        hasRowSpan: (row) => {
          return row.children[0].attributes.length && row.children[0].attributes[0].name === "rowspan";
        },
        containAny: (sTextContent, aSearchTexts) => {
          
          var reduced = aSearchTexts.reduce((bResult, sCurrentSearchText) => {
            return bResult || sTextContent.includes(sCurrentSearchText);
          }, false);
          return reduced;
          
        }
      
      }//methods end
    });//new Vue end
  
}