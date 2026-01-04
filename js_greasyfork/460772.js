// ==UserScript==
// @name     Spec.Costumer Highlighter
// @version  1.3
// @grant    none
// @namespace https://login.germandrawings.com/?page=taskEdit
// @license MIT
// @description Interal use only
// @match https://login.germandrawings.com/?page=taskEdit
// @includes https://login.germandrawings.com/?page=taskEdit
// @downloadURL https://update.greasyfork.org/scripts/460772/SpecCostumer%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/460772/SpecCostumer%20Highlighter.meta.js
// ==/UserScript==

var specialCostumers = [20062, 20095, 20120, 20172, 20533, 20570, 20599, 20705, 20853, 20895, 20994, 21007, 21164, 21181, 21247, 21330, 21652, 21669, 22189, 22279, 22297, 22468, 22470, 22480, 23117, 23473, 23482, 23493, 23494, 23517, 23942, 23963, 24027, 24091, 24096, 24153, 24154, 24183, 24277, 24281, 24389, 24391, 24403, 24483, 24483, 24643, 24806, 24940, 24993, 24999, 25027, 25110, 25184, 25207, 25323, 25332, 25391, 25558, 25560, 25586, 25603, 25659, 25682, 25791, 25802, 25803, 25963, 26069, 26098, 26099, 26190, 26266, 26337, 26463, 26475, 26631, 26745, 26765, 26899, 27009, 27011, 27352, 27500, 27504, 27586, 27592, 27759, 27789, 27872, 27947, 27998, 28086, 28233, 28237, 28307, 28374, 28595, 28633, 28823, 28946, 28979, 29124, 29269, 29546, 29683, 29855, 30157, 30920, 30926, 30927, 30928, 30980, 31546, 31802, 32453, 32813, 32893, 33098, 33554];
console.log("Skriptata za specijalen klient e inicijalizirana");
    //setTimeout(() => {   
     setInterval( function() {  
       
       console.log("Skriptata za specijalen klient e aktivirana");
           
        var planNumber = document.getElementsByClassName("mb-1")[0].innerText;
        var costumer = String(planNumber).slice(0,5);
        costumer = Number(costumer);      
      
        if (costumer>0){  
            var isSpecial = specialCostumers.includes(costumer);
            console.log('specijalec = '+isSpecial+' | brojot na klient e '+costumer);
            if (isSpecial){  
                changeBackground();
            }    
          }
      
          else {
            console.log('vlegov vo else');
            var planNumber = document.getElementsByClassName("mb-1")[0].firstElementChild.innerText;
            var costumer = String(planNumber).slice(0,5);
            costumer = Number(costumer);
            
            var isSpecial = specialCostumers.includes(costumer);
            console.log('specijalec = '+isSpecial+' | brojot na klient e '+costumer);
            if (isSpecial){  
                changeBackground();
            }          
        }	
      
        function changeBackground(){
          	
          	          
             document.getElementsByClassName("mb-1")[0].style["background-color"] = 'red'   
             
        
        }       
    
    }, 2000);