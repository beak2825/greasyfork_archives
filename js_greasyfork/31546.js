// ==UserScript==
// @name         FFXIVCrafting list to Miqo Scenario
// @namespace    Violentmonkey Scripts
// @version      0.3
// @description  Add @Lyfox code to a neat button
// @author       xivgAnon@waifu.club
// @match        https://ffxivcrafting.com/crafting/from-list*
// @downloadURL https://update.greasyfork.org/scripts/31546/FFXIVCrafting%20list%20to%20Miqo%20Scenario.user.js
// @updateURL https://update.greasyfork.org/scripts/31546/FFXIVCrafting%20list%20to%20Miqo%20Scenario.meta.js
// ==/UserScript==

(function() {
   function rJob(val){
       return $(val).children("td:eq(4)").children("img:eq(0)").attr("src").replace("/img/jobs","").replace("/","").replace("-inactive","").replace(".png","");
   }
   function rRecipe(val){
       return $(val).children("td:eq(0)").find("a:eq(1)").text().trim();
   }
   function rNeeded(val){
       var txt = $(val).children("td:eq(1)").children("span").text();
       var val = $(val).children("td:eq(1)").children("input").val();
       return val > 0 ? val : txt;
   }
   function rYields(val){
       return $(val).attr("data-yields");
   }
   function rCount(val){
       return Math.ceil(rNeeded(val)/rYields(val));
   }
   function chapter(tableId){
       var reagents = $("tbody#"+tableId).children("tr.reagent").not(".success");
       reagents.sort(function(a, b){
          var lvlA = parseInt( $(a).attr("data-ilvl") );
          var lvlB = parseInt( $(b).attr("data-ilvl") );
          return (lvlA < lvlB) ? -1 : (lvlA > lvlB) ? 1 : 0;
       });
       for(var i=0; i<reagents.length; i++){
          var craftsLater = [];
          var from = -1;
          var to = -1
          //console.log(reagents.get().map(rRecipe));
          $(reagents.get().reverse()).each(function(index){
             var itemId = $(this).attr("data-item-id");
             var requires = $(this).attr("data-requires").split("&").map(function(value){ return value.split("x")[1]; });
             var isCraftable = requires.reduce(function(isCraftable, requireId){
                if(!isCraftable)
                   return false;
                if(craftsLater.indexOf(requireId)>=0){
                   from = index;
                   to = craftsLater.indexOf(requireId);
                   return false;
                }
                return true;
             }, true);
             //console.log(rRecipe(this)+":"+(isCraftable?1:0));
             if(!isCraftable)
                return false;
             craftsLater.push(itemId);
          });
          if(from < 0 || to < 0)
             break;
          from = reagents.length-1 - from;
          to = reagents.length-1 - to;
          reagents.splice(to, 0, reagents.splice(from, 1)[0]);
       }
       var miqo = "";
       reagents.each(function(){
          miqo += "job("+rJob(this)+")\r\n";
          miqo += "recipe("+rRecipe(this)+")\r\n";
          miqo += "craft("+rCount(this)+")\r\n";
       });
       miqo += "//--Section crafts: "+reagents.get().reduce(function(allCount, val){ return allCount+rCount(val); },0)+"\r\n";
       return miqo;
    }
    function antiDuplicate(miqo){
       var dupList = [
          ["Kite Shield", 3],
          ["Goatskin Wristbands", 2],
          ["Hempen Breeches", 2],
          ["Copper Ring", 2],
          ["Lapis Lazuli", 2],
          ["Brass Ring", 2],
          ["Silver Ring", 2],
          ["Garnet", 2],
          ["Mythril Ring", 3],
          ["Horn Staff", 8],
          ["Electrum Ring", 2],
          ["Honey", 9],
          ["Horn Fishing Rod", 2],
          ["Ether", 8],
          ["Poisoning Potion", 2],
          ["Paralyzing Potion", 2],
          ["Blinding Potion", 2],
          ["Sleeping Potion", 2],
          ["Silencing Potion", 2],
          ["Elixir", 7],
          ["Obelisk", 2],
          ["Mailbreaker", 2],
          ["Rampager", 2],
          ["Boarskin Ring", 2],
          ["Pearl", 7],
          ["Astrolabe", 2],
          ["Rose Gold Earrings", 2],
          ["Sarnga", 2],
          ["Mortar", 22],
          ["Campfire", 2],
          ["Oasis Partition", 2],
          ["Manor Fireplace", 2],
          ["Cloche", 3],
          ["Smithing Bench", 2],
          ["Manor Harp", 2],
          ["Wall Lantern", 2],
          ["Holy Rainbow Hat", 2],
          ["Reading Glasses", 2],
          ["Archaeoskin Boots", 3],
          ["Gaganaskin Gloves", 2],
          ["Gazelleskin Ring", 4],
          ["Hedge Partition", 2],
          ["Wolfram Cuirass", 2],
          ["Wolfram Gauntlets", 2],
          ["Wolfram Sabatons", 2],
          ["Gold Ingot", 2],
          ["Serpentskin Gloves", 3],
          ["Orchestrion", 4],
          ["Camphor", 14],
          ["Cordial", 2],
          ["Survival Hat", 2],
          ["Survival Shirt", 3],
          ["Survival Halfslops", 2],
          ["Survival Boots", 2],
          ["Luminous Fiber", 2],
          ["Teahouse Bench", 2],
          ["Oden", 10],
          ["Carpeting", 2],
          ["Near Eastern Antique", 2],
          ["Coerthan Souvenir", 2],
          ["Maelstrom Materiel", 2],
          ["Heartfelt Gift", 2],
          ["Orphanage Donation", 2],
          ["Gyr Abanian Souvenir", 2],
          ["Far Eastern Antique", 2],
          ["Gold Saucer Consolation Prize", 2],
          ["Resistance Materiel", 2],
          ["Sui-no-Sato Special", 2],
          ["Cloud Pearl", 2],
          ["Signature Buuz Cookware", 2],
          ["Platinum Ingot", 2],
          ["Griffin Leather", 2],
          ["Wall Chronometer", 2],
       ];
       dupList.forEach(function(row){
          miqo = miqo.replace(new RegExp("recipe\\("+row[0]+"\\)", "g"), "recipe("+row[0]+", "+row[1]+")");
       });
       return miqo;
    }

    function scenario(){
        var miqo = "";
         miqo += "//Pre-Requisite Crafting\r\n";
         miqo += "solverPreset(recommended)\r\n";
         miqo += "nqhq(balanced)\r\n";
         miqo += "reclaimOff()\r\n\r\n";
         miqo += chapter("PreRequisiteCrafting-section")+"\r\n";

         miqo += "//Crafting List\r\n";
         miqo += "solverPreset(recommended)\r\n";
         miqo += "nqhq(balanced)\r\n";
         miqo += "reclaimHQ(50)\r\n\r\n";
         miqo += chapter("CraftingList-section")+"\r\n";

         miqo += "//Repair\r\n";
         miqo += "reclaimOff()\r\n";
         miqo += "repair()\r\n";
         miqo = antiDuplicate(miqo);
        //window.prompt("Copy to clipboard: Ctrl+C, Enter", miqo);
        alert(miqo);
        return miqo;
    }

    $("#banner .container").prepend("<span id='miqobutton' class='btn btn-default pull-right hidden-print margin-top margin-right'>[^._.^]ﾉ彡</span>")
    $('#miqobutton').click(scenario);


})();