// ==UserScript==
// @name         GarlandTolls list to Miqo Scenario
// @namespace    Violentmonkey Scripts
// @version      0.1
// @description  Add @Lyfox code to a neat button
// @author       xivgAnon@waifu.club
// @match        http://garlandtools.org/db/
// @downloadURL https://update.greasyfork.org/scripts/389198/GarlandTolls%20list%20to%20Miqo%20Scenario.user.js
// @updateURL https://update.greasyfork.org/scripts/389198/GarlandTolls%20list%20to%20Miqo%20Scenario.meta.js
// ==/UserScript==


(function(){
  
  console.log("Nyaa");

  function rJob(val){
     var imgJob = $(val).find("span.right img.job-icon");
     return (imgJob.length ? imgJob.attr("src").replace("../files/icons/job/", "").replace("images/", "").replace(".png", "") : "");
  }
  
  function rLevel(val){
     return $(val).find("span.right span.text").text().replace("Lv. ", "");
  }
  
  function rRecipe(val){
     return $(val).find("div[data-id] span.text span.highlight, span[data-id] span.text span.highlight").text();
  }
  
  function rNeeded(val){
     var match1 = $(val).find("div[data-id] span.text").text().match(/^[0-9]+/g);
     var match2 = $(val).find("span.amounts span.text:contains(/ +)").text().match(/[0-9]+/g);
     return (match1 ? match1[0] : match2 ? match2[0] : 0);
  }
  
  function rYields(val){
     var match = $(val).find("div[data-id] span.text, span[data-id] span.text").text().match(/\([0-9]+\)/g);
     return (match ? match[0].replace(/[()]/g, "") : 1);
  }
  
  function rCount(val){
     return Math.ceil(rNeeded(val)/rYields(val));
  }
  
  function chapter(tableId){
     var reagents = $("div[data-id='Crafting List'] div[data-headername='"+tableId+"']").children("div[data-stepid]").not(".finished");
     reagents.each(function(idx){ $(this).data("order", idx); });
     reagents.sort(function(a, b){
        var lvlA = rLevel(a);
        var lvlB = rLevel(b);
        var idxA = $(a).data("order");
        var idxB = $(b).data("order");
        return (parseInt(lvlA) < parseInt(lvlB)) ? -1 : (parseInt(lvlA) > parseInt(lvlB)) ? 1 :
               (lvlA < lvlB) ? -1 : (lvlA > lvlB) ? 1 :
               (idxA - idxB);
     });
     for(var i=0; i<reagents.length; i++){
        var craftsLater = [];
        var from = -1;
        var to = -1
        $(reagents.get().reverse()).each(function(index){
           var itemId = $(this).attr("data-stepid");
           var item = gt.item.ingredients[itemId] || gt.item.index[itemId];
           var requires = item ? item.craft[0].ingredients.map(function(val){ return ""+val.id; }) : [];
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
        if(!rJob(this)){
           miqo += "//no job: "+rRecipe(this)+"\r\n";
           return;
        }
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
     miqo += "//Craft\r\n";
     miqo += "solverPreset(recommended)\r\n";
     miqo += "nqhq(balanced)\r\n";
     miqo += "reclaimOff()\r\n\r\n";
     miqo += chapter("Craft")+"\r\n";

     miqo += "//Goal\r\n";
     miqo += "solverPreset(recommended)\r\n";
     miqo += "nqhq(balanced)\r\n";
     miqo += "reclaimHQ(50)\r\n\r\n";
     miqo += chapter("goal")+"\r\n";

     miqo += "//Repair\r\n";
     miqo += "reclaimOff()\r\n";
     miqo += "repair()\r\n";
     miqo = antiDuplicate(miqo);
     //window.prompt("Copy to clipboard: Ctrl+C, Enter", miqo);
     alert(miqo)
     return miqo;
  }

  $('#list-container').append("<span id='miqobutton' class='list-item'>[^._.^]ﾉ彡</span>");
  $('#miqobutton').click(scenario);

  
}());