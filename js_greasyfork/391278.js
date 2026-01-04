// ==UserScript==
// @name         Goatlings: Halloween Auto-Explorer
// @namespace    http://twitter.com/Automalix
// @version      0.9.0
// @description  Cycles through the Halloween Explore Areas to farm the Halloween baddie drops!
// @author       Felix "Automalix" G.
// @match        https://www.goatlings.com/explore*
// @match        https://www.goatlings.com/inventory*
// @match        https://www.goatlings.com/battle*
// @match        https://www.goatlings.com/index.php/explore*
// @match        https://www.goatlings.com/profile/u/*
// @match        https://www.goatlings.com/fountain*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391278/Goatlings%3A%20Halloween%20Auto-Explorer.user.js
// @updateURL https://update.greasyfork.org/scripts/391278/Goatlings%3A%20Halloween%20Auto-Explorer.meta.js
// ==/UserScript==

(function(){
    "use strict"
    function setStoredValue(key, value) {
        if (value == null || value === undefined){
            sessionStorage.removeItem(key)} // if we only pass one parameter thru the function, delete the key
        else {
            if (typeof value != "number" && typeof value != "string"){
                value = JSON.stringify(value)} // if value isnt a number/string, Stringify it for storage
            sessionStorage.setItem(key, value)}
    }
    function getStoredValue(key, safety) {
        let value = sessionStorage.getItem(key);
        if (value != null) { // makes sure our key's value exists in storage & has a value set
            if (typeof value == "string") {
                try {return JSON.parse(value)} // try to parse our value if it's currently a string & return it
                catch (ex) {console.log(ex)}}
            return value;
        }
        return safety; //returns second value as a safeguard if there's no value for the key/key doesn't exist
    }
    function getAuthToken() {
        let links = document.links, urls = [];
        for(let value in links) urls.push(links[value].href)
        let logout = urls.find(value => /\/login\/logout\/.{32}\//.test(value)),
            pos = logout.indexOf("logout");
        const TOKEN = logout.slice(pos + 7, pos + 39);
        return TOKEN;
    }
    function getWeaponURL() {
        let links = document.links, urls = [];
        for(let value in links) urls.push(links[value].href);
        const WEAPON = urls.find(value => /\/battle\/attack\/\d+/g.test(value));
        return WEAPON;
    }
    function onStart(){
        var saved = false,
            activeGoat = document.querySelector("#user-info").childNodes["3"].textContent;
        function addCSS(css) {
            if (!document.getElementsByTagName('head')[0]) return;
            let style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = css;
            document.getElementsByTagName('head')[0].appendChild(style)
        }
        addCSS(`#form {width:450px; margin:5px auto; padding:10px 2em 0 2em}
                .flex {width:85%; margin:5px auto; display:flex; align-items:center; justify-content:space-between}
                .flex20 {flex-basis:20%}
                .flex40 {flex-basis:40%}
                .flex55 {flex-basis:55%}
                .start {margin:10px auto; text-align:center}
                .large {font-size:120%; padding:7px 15px}
                .bigtext {font-weight:bold; font-size:140%; line-height:14px}
                label {font-weight:bold}
                legend {margin:0 auto; font-size:130%; font-weight:bold}
        `);
        document.querySelector("#content > center:nth-child(7)").insertAdjacentHTML("beforebegin",`
            <section>
               <fieldset id="form">
                  <legend>Goatlings Halloween Auto-Explorer</legend>
                  <div class="flex">
                     <label class="flex40">Battle (Active) Goat:</label>
                     <a class="flex55 bigtext" href="http://www.goatlings.com/mypets/">${activeGoat}</a>
                  </div>
                  <div class="flex">
                     <label class="flex40">Choose an Area:</label>
                     <label><input type="radio" name="areaRadio" id="area1" value="Eerie Estate 1">Eerie Estate 1</label>
                     <label><input type="radio" name="areaRadio" id="area2" value="Eerie Estate 2">Eerie Estate 2</label>
                  </div>
                  <div class="flex">
                     <label for="numberOfExplorations" class="flex40">Number of Explorations:</label>
                     <input type="number" class="flex55" id="numberOfExplorations" value="1">
                  </div>
                  <div class="flex" style="padding-bottom:10px;">
                     <button id="resetValues">Reset</button>
                     <button id="saveValues" class="flex20">Save</button>
                  </div>
               </fieldset>
            </section>
            <div class="start">
               <button id="startProgram" class="large">Start Auto-Exploring!</button>
            </div>
        `);
        function saveValues(){
            let numberOfExplorations = parseInt(document.getElementById("numberOfExplorations").value);
            if(document.querySelector(`input[name="areaRadio"]:checked`) // if radio button is checked
               && numberOfExplorations > 0 // AND positive number
               && numberOfExplorations % 1 === 0){ // AND whole number
                stored["Area Selection"] = document.querySelector(`input[name="areaRadio"]:checked`).value;
                stored.Explorations = numberOfExplorations;
                saved = true;
                setStoredValue("explore", stored);
                console.log(stored);
            }
            else alert("Please select some values! (And make sure exploration count is a positive whole number)")
        }
        function resetValues(){
            setStoredValue("explore");
            stored = {}; // just in case
            console.log("Reset!");
        }
        function startProgram(){
            if(saved){
                stored["Current Explore Count"] = 0;
                stored["Did we start? (explore)"] = true;
                setStoredValue("explore", stored);
                (stored["Area Selection"] == "Eerie Estate 1")
                    ? location.href = `https://www.goatlings.com/explore/create/37/${token}`
                    : location.href = `https://www.goatlings.com/explore/create/38/${token}`;
            }
            else alert("Please save some values first!")
        }
        document.querySelector("#saveValues").addEventListener("click", saveValues);
        document.querySelector("#resetValues").addEventListener("click", resetValues);
        document.querySelector("#startProgram").addEventListener("click", startProgram);
    }
    /*Uncomment for debugging*/
    //console.log(stored);
    var token = getAuthToken(),
        stored = getStoredValue("explore", {}); /* the object with all of the power */
    const delay = (Math.round(Math.random() * (2000 - 3500)) + 2000),
          content = document.body.textContent || document.body.innerText;

    if(/RANDOM EVENT/.test(content)) document.location.reload();
    if ((!stored["Area Selection"] || !stored["Did we start? (explore)"]) /* if we didn't start/didnt set explore area flag */
       && (/\/explore\/index/.test(document.URL) || /\/explore$/.test(document.URL))){ /* AND we're on explore/index */
        onStart();
    }
    else if (stored["Did we start? (explore)"] == true){
        /* Make sure we started & we have an Area Selection  picked out */
        function remove(arr, value) {
            return arr.filter(function(e){
                return e != value;
            })}
        function itemFinder(arr) {
            let itemInvent = document.getElementsByClassName("item-invent"),
                textNode = [], anchorNode = [], itemURL = "", itemName = "";

            for (let i = 0; i < itemInvent.length; i++){
                textNode.push(itemInvent[i].childNodes[2].textContent);
                anchorNode.push(itemInvent[i].childNodes[0])}

            for (let i = 0; i < arr.length; i++){
                if(textNode.filter(value => arr[i].test(value)).length > 0){
                    itemName = textNode.filter(value => arr[i].test(value));

                    for (let j of itemName){
                        for (let k = 0; k < doNotUse.length; k++) {
                            if(itemName[j] == doNotUse[k]){
                                remove(itemName,j)}
                        }
                    }
                    console.log(itemName);
                    itemURL = anchorNode.slice(textNode.indexOf(itemName[0]), textNode.indexOf(itemName[0])+1)
                }
            }
            return String(itemURL)
        }

        switch(true){
            case (/\/explore\/index/.test(document.URL) || /\/explore$/.test(document.URL)):
                /*If our current exploration count are less than our specified explorations */
                if(((stored["Current Explore Count"] < stored.Explorations) || !stored["Current Explore Count"])){
                    /*if we chose Eerie Estate 1*/
                    if(stored["Area Selection"] == "Eerie Estate 1"){
                        setTimeout(function(){location.href = `https://www.goatlings.com/explore/create/37/${token}`}, delay)
                    }
                    /*if we chose Eerie Estate 2*/
                    else if(stored["Area Selection"] == "Eerie Estate 2"){
                        setTimeout(function(){location.href = `https://www.goatlings.com/explore/create/38/${token}`}, delay)
                    }
                }
                /*If our current exploration count is (greater than or) equal to our total specified explorations*/
                else if (stored["Current Explore Count"] >= stored.Explorations){
                    alert(`Finished ${stored.Explorations} explorations!`);
                    setStoredValue("explore"); // removes sessionStorage item
                    stored = {}; // setting object empty just in case
                    onStart(); //reruns function that prompts for user input
                }
                else alert("No clue what happened here.");
                break;

            case /\/explore\/create/.test(document.URL):
                if(/You are already Exploring!/.test(content)) setTimeout(function(){location.href = "https://www.goatlings.com/explore/view"}, delay)
                break;

            case /\/explore\/view/.test(document.URL):
                var weHavePlaysLeft = /\. You have [1-9]+0* plays left\./.test(content),
                    baddieAppeared = /has appeared! Would you like to battle\?/.test(content),
                    zeroPlaysLeft = (content.search(". You have 0 plays left.") > 0); // fun booleans for the nintendo switch
                if (stored["Did we start? (explore)"] == true){ // make sure we started
                    /* if a baddie appeared, then start battle */
                    switch(true){
                            /* If a baddie appears */
                        case baddieAppeared:
                            if(zeroPlaysLeft) stored["Zero turns"] = true; //if we have 0 plays left, set a flag for it
                            setStoredValue("explore", stored);
                            setTimeout(function(){location.href = `https://www.goatlings.com/battle/create_temp`}, delay)
                            break;
                            /* If we still have plays left and no baddie */
                        case weHavePlaysLeft:
                            if(content.search(". You have 10 plays left.") > 0) stored["Current Explore Count"]+=1; // add a +1 to explore count bc we just started
                            stored["Zero turns"] = false; // we obviously have turns left
                            setStoredValue("explore", stored);
                            setTimeout(function(){location.href = `https://www.goatlings.com/explore/view/play/${token}`}, delay)
                            break;
                            /* We have no plays left, and no baddie */
                        case zeroPlaysLeft:
                            stored["Zero turns"] = true;
                            setStoredValue("explore", stored);
                            setTimeout(function(){location.href = "https://www.goatlings.com/explore/index"}, delay)
                            break;
                        default:
                            alert("Default case for explore/view");
                            break;
                    }
                }
                else { // we Probably didn't start/we ended but we got to this page somehow anyway
                    console.log("Hit error");
                    setTimeout(function(){location.href = "https://www.goatlings.com/explore/index"}, delay)}
                break;

            case /battle\/create_temp/.test(document.URL):
                switch(true){
                    case (content.search("You are already in a battle!") > 0):
                        setTimeout(function(){location.href = "https://www.goatlings.com/battle/thebattle/"}, delay);
                        break;
                    case (content.search("too hungry to battle") > 0):
                        stored["Status (explore)"] = "HUNGRY";
                        setStoredValue("explore", stored);
                        setTimeout(function(){location.href = "https://www.goatlings.com/inventory/"}, delay);
                        break;
                    case (content.search("too unhappy to battle") > 0):
                        stored["Status (explore)"] = "UNHAPPY";
                        setStoredValue("explore", stored);
                        setTimeout(function(){location.href = "https://www.goatlings.com/inventory/"}, delay);
                        break;
                    default:
                        alert("Default case for battle/create_temp. something weird happened");
                        break;
                }
                break;

            case /battle\/thebattle/.test(document.URL):
                switch(true){
                    case /^1\//.test(document.getElementsByClassName("HP")[0].innerHTML):
                        stored["Status (explore)"] = "LOW_HP";
                        setStoredValue("explore", stored);
                        setTimeout(function(){location.href ="https://www.goatlings.com/fountain"}, delay);
                        break;
                    case (content.search("too hungry to battle") > 0):
                        stored["Status (explore)"] = "HUNGRY";
                        setStoredValue("explore", stored);
                        setTimeout(function(){location.href ="https://www.goatlings.com/inventory/"}, delay);
                        break;
                    case (content.search("too unhappy to battle") > 0):
                        stored["Status (explore)"] = "UNHAPPY";
                        setStoredValue("explore", stored);
                        setTimeout(function(){location.href = "https://www.goatlings.com/inventory/"}, delay);
                        break;
                    default:
                        var links = document.getElementsByTagName("a"), documentLinks,
                            weaponURL = getWeaponURL();
                        for (let value in links) documentLinks += links[value] + "\n";
                        switch(true){
                            case (documentLinks.search(/goatlings\.com\/battle\/over/) > 0):
                                setTimeout(function(){location.href = "https://www.goatlings.com/battle/over"}, delay)
                                break;
                            case (!weaponURL || weaponURL.length < 0 || weaponURL == "undefined"):
                                stored["Status (explore)"] = "NO_WEAPON";
                                setStoredValue("explore", stored);
                                setTimeout(function(){location.href = "https://www.goatlings.com/inventory/"}, delay)
                                break;
                            default:
                                setTimeout(function(){location.href = weaponURL}, delay)
                                break;
                        }
                        break;
                }
                break;

            case /\/battle\/over/.test(document.URL):
                if(/Battle does not exist!/.test(content)){
                    setTimeout(function(){location.href = "https://goatlings.com/explore/index"}, delay);
                }
                else if(/^1\//.test(document.getElementsByClassName("HP")[0].innerHTML)){
                    stored["Status (explore)"] = "LOW_HP";
                    setStoredValue("explore", stored);
                    setTimeout(function(){location.href = "https://www.goatlings.com/fountain"}, delay)
                }
                else { //the default battle over scenario
                    if(stored["Zero turns"] == true){
                        delete stored["Zero turns"];
                        setStoredValue("explore", stored);
                        setTimeout(function(){location.href = "https://goatlings.com/explore/index"}, delay)
                    }
                    else setTimeout(function(){location.href = "https://goatlings.com/explore/view"}, delay)
                }
                break;

            case /\/inventory\/$/.test(document.URL):
                var foodArray = [ /Rainbow (Tart|Apple|Fruit)+/g,
                                 /Honey and Apples/g
                                ];
                var toyArray = [ /(Firetail Fox Plush|Luna Moth)+ Plush/g,
                                /Plush (Deer|Skunk|Bear|Unicorn|Fox)+/g,
                                /Virtual Goat/g,
                                /Love Bird/g
                               ];
                var weaponArray = [
                    /Hero Sword/g,
                    /(Bettaling|Moonicorn|Moon Dogs)+ BP/g
                ];
                var doNotUse = [
                    "Nightmare Eater Apple",
                    "Sweet Demon Apple",
                    "Sweet Demon Pop",
                    "Straw Doll Froyo",
                    "Plush Mouse",
                    "Nightmare Shake",
                    "Lovepire Ice",
                    "Jacksicle",
                    "Cinnawitch Scoop",
                    "Pumpkin Bread",
                    "Bone Apple Tea",
                    "Ghost Toast",
                    "Pumpkin Latte",
                    "Pumpkin Soup",
                    "Apple Sauce",
                    "Root Beer Scoop",
                    "Fighting Fish BP",
                    /* Retired Expensive Crap starts here */
                    "Luck Dragonling AD", "Plastic Egg IV", "Spring Bunny Stuffie", "Plastic Egg V", "Spring Basket","Plastic Egg VI", "Choco Bun", "Plastic Egg III", "Candy Beans", "Plastic Egg II", "Bunnyling AD", "Plastic Egg I", "Luckyling Stuffie", "Trileaf Clover Crispy", "Lucky Dress Up Hat", "Patty O Bear", "Lucky Clover AD", "Lucky Cat", "Fortune Snap", "Luck Dragon Stuffie", "Lucky Lantern", "Luck Dragon Mask", "Rice Take Out", "Cupid AD", "Quiver Of Cupid", "Sticky Lolly", "Bow Of Cupid", "Chalky Hearts", "Suspicious Mask", "Betaling AD", "Strength Gemdrop", "Speed Gemdrop", "Level Gemdrop", "Defense Gemdrop", "2013 Party Balloon", "Queen Snake Fiery Hair", "Queen Snake Eye 1", "Wrap Top 01", "HA Buddy Kit", "Sweetheart AD", "Text Me Candy", "Love Candy", "LOL Candy", "XOXO Candy", "True Love Candy", "Love U Candy", "Love Me Candy", "Hug Me Candy", "Crazy 4 U Candy", "Cool Candy", "Call Me Candy", "Be Mine Candy", "Angel Candy", "Sweethearts Box", "1st Anniversary Cake", "Holiday Gift Bag", "Holiday Lights", "Deluxe Mini Tree", "Candy Cane", "Reinling AD", "Surprise Gift Box", "Day Of The Dead AD", "Candy Corn Bits", "Pumpkin Lantern", "Candy Jack Apple", "Bubbles", "Summer Essence", "Watermelon Slice", "Honeycomb", "Bronze Goat Coin", "Silver Goat Coin", "Gold Goat Coin", "Pot O Goat Coins", "Sweethearts Icon", "Lil Sweetheart AD", "Indie Shirt", "Indie Hat", "Indie Hair 2", "Indie Hair 1", "Indie Face 2", "Indie Face 1", "Indie BG", "Duchess Heartthrob AD", "Shooting Star Clip", "Short Ethos Hair", "Ethos Ponytail", "Ethos HA Buddy Box", "Ethosling AD", "Year 2 Badge", "Year 1 Badge", "Ethos Gem 6", "Ethos Gem 5", "Ethos Gem 4", "Ethos Gem 3", "Ethos Gem 2", "Ethos Gem 1", "Carrot Cake Slice", "Fried Egg", "Owl Stuffie", "Xmas Tree Icon", "Indiegoatling AD", "Queen Snakeling AD", "2013 Party Goods", "2013 Party Cake", "Student Hair 13", "Student Hair 12", "Student Hair 11", "Student Hair 10", "Student Hair 9", "Student Hair 8", "Student Hair 7", "Student Hair 6", "Student Hair 5", "Student Hair 4", "Student Hair 3", "Student Hair 2", "Student Hair 1", "Student Face 6", "Student Face 5", "Student Face 4", "Student Face 3", "Student Face 2", "Student Face 1", "Student Jacket 3", "Student Jacket 2", "Student Jacket 1", "Student BG", "Brick BG", "Spring Frosted Cake", "Spring Bun Egg 4", "Spring Bun Egg 3", "Spring Bun Egg 2", "Spring Bun Egg 1", "Puddles AD", "Toy Car", "Flying Ham", "Spring Bunny Ears", "Clover Icon", "Lucky AD", "Cinnamon Bun", "Awful Sweater Box", "Pretty Paper", "Green Ribbon", "Green Bow", "Awful Sweater 6", "Awful Sweater 5", "Awful Sweater 4", "Awful Sweater 3", "Awful Sweater 2", "Awful Sweater 1", "PSL", "Graveyard Cake", "Cats Eye Cake", "Bat Bones Cake", "Mini Pumpkin", "Pumpkin Spice AD", "Chewy Pump", "Pumpkin Icon", "Cloud Cupcake", "Save the Goats", "Icelandic Sweater", "Dragon Plush", "Chili Dog", "Dolphin Plush", "Quesadilla Smoothie", "Summerling AD", "Summer Tube", "Summer Ball", "Snorkel", "Student Hair 18", "Student Hair 17", "Student Hair 16", "Student Hair 15", "Student Hair 14", "GU Hairdo 5", "GU Hairdo 4", "GU Hairdo 3", "GU Hairdo 2", "GU Hairdo 1", "GU Face 8", "GU Face 7", "GU Face 6", "GU Face 5", "GU Face 4", "GU Face 3", "GU Face 2", "GU Face 1", "GU Sweater 3", "GU Sweater 2", "GU Sweater 1", "Blue Bird Plush", "Bunny Crackers", "Sprout", "Delicious Meal", "Chocolate Tokens", "Crown Pillow", "Jestling Plush", "Old Tag", "Clover Float", "Lucky Clover", "Cherry Icon", "Cherry Leaf", "Cherries", "Blossom", "Masked Rival AD", "Rival Mask", "Tattered Cloth", "Tuft Of Fur", "Broken Horn", "Firefly Jar", "Ghost Toy", "Maple Leaf Soap", "Kitty Hair Clip", "White Fox Mask", "Pink Fox Mask", "Blue Fox Mask", "Black Fox Mask", "Phoenix Fox Feather", "Beach Playkit", "Squid Plush", "Octo Plush", "Orange Slice Icon", "Lime Slice Icon", "Lemon Slice Icon", "Grapefruit Slice Icon", "Goatlings University AD", "Rolled Diploma", "GU Diploma", "Bookshelf BG", "GU Glasses", "GU Pennant 2", "GU Pennant 1", "Graduation Cap 3", "Graduation Cap 2", "Graduation Cap 1", "GU Hairdo 14", "GU Hairdo 13", "GU Hairdo 12", "GU Hairdo 11", "GU Hairdo 10", "GU Hairdo 9", "GU Hairdo 8", "GU Hairdo 7", "GU Hairdo 6", "Lily Of The Valley AD", "Moss Pet", "Clover Top", "Old Empty Locket", "Carousel AD", "Sweet Kiss", "Love Kiss", "Pink Bow Tie", "Red Bow Tie", "Black Bow Tie", "Thin Chain", "Crystal Set 3", "Crystal Set 2", "Crystal Set 1", "Bag Of Crystals", "Thothling AD", "Snow Kid Sweater", "Snow Kid Hat", "Snow Kid Face", "Snow Kid AD", "Year 3 Badge", "Winter Friends Lucky Box", "Snow Leopard", "Snow Bunnies", "Polar Bear", "Polar Bear Cubs", "Penguin Pal", "Snowflake Hairpin", "Held Gift Box", "Pinecone", "Rune Stones", "Frost Leaf", "Frost Antlers", "Straw Bundle", "Pumpkin Seeds", "Treasure Horns", "Treasure Cord", "Found Treasure", "Jar Of Lemonade", "Short Citrus Hair", "Long Citrus Hair", "Citrus Hat", "Slice Of Life AD", "Essence Of Snowdrop", "Snowdrop Hair", "Snowdrop Hairpin", "Snowdrop Sleeves", "Snowdrop Face", "Snowdrop Accents", "Snowdrop Corset", "Snowdrop AD", "Summer Waters AD", "Sea Glass Necklace", "Summer Water Face", "Rock And Roll AD", "Rock And Roll Hair", "Rock And Roll Jacket", "Rock And Roll Star", "Florist AD", "Earth Shirt", "Sprout Shirt", "UFO Veil", "Sleepy Farm BG", "Cow Ears", "Cow Suit", "Radioactive Cow Plush", "Mended Locket", "Old Photo", "Sweet Pea AD", "Sweet Pea Flowers", "Treat Bucket", "Awful Mallow Bag", "Awful Mallows", "Cinnawitch Choco Bar", "Lovepire Choco Bar", "Treats", "Lovepire Plush", "Cinnawitch Plush", "Candy Corn Hair", "Candy Corn Sweater", "Candy Corn Cutie AD", "Team Lovepire Tag", "Team Cinnawitch Tag", "Lovepire AD", "Cinnawitch AD", "Lovepire Box", "Lovepire Cloak", "Lovepire Face", "Lovepire Hair", "Lovepire Earrings", "Lovepire Wings", "Cinnawitch Box", "Cinnawitch Hat", "Cinnawitch Face", "Cinnawitch Hair", "Cinnawitch Cloak", "Cinnawitch Staff", "Red Maple Bottle", "Red Maple Bags", "Red Maple AD", "Thread", "Scissors", "Seamstress AD", "Treasure Hunter AD", "Treasure Robe", "Tea Party Cup", "Short Tea Party Hair", "Tea Party Hair", "Tea Party AD", "Berries And Cream Earrings", "Berries And Cream Scarf", "Berries And Cream Hat", "Berries And Cream Fork", "Berries And Cream AD", "Rose Gold Cape", "Rose Gold Crown", "Rose Gold Face", "Rose Gold Hair", "Rose Gold AD", "Peaceful Cloak", "Peaceful Crown", "Peaceful Hair", "Messenger Of Peace AD", "Year 4 Badge", "Winter Fir Lucky Box", "Winter Fir Brows", "Winter Fir Face", "Winter Fir Scarf", "Winter Fir Hat", "Winter Fir Top", "Winter Fir Hair", "Winter Fir Friend AD", "Blue Icy Lips", "Blue Icy Wink", "Snowdrift Muffler", "Snowdrift AD", "Candlestick", "Book Of Poems", "Melancholy Poet AD", "Haunted Portrait AD", "Captain Ascot", "Captain Coat", "Captain Eyes", "Captain Nose", "Captain Lips", "Cloud Captain AD", "Glitch Wings", "Glitch Mark", "Coastal Cutie Top", "Coastal Cutie Shades", "Coastal Cutie Ice Pop", "Blueberry Boba Tea", "Peach Boba Tea", "Lavender Boba Tea", "Coastal Cutie AD", "Pyramid Terrarium", "Open Terrarium", "Closed Terrarium", "Gaia AD", "Glitch Eye Patch", "Glitch Face", "Star Chart", "Blue Starry Scarf", "Purple Starry Scarf", "Shooting Star Potion", "Sweet Dreams Potion", "Goodnight Potion", "Stargazer AD", "Jestling Box", "Disguise Specs", "Disguise Glasses", "Banana Peel", "Tea Party Box", "Tea Party Bow", "Tea Party Blouse", "Jack Shirt", "Lantern", "Straw Doll Overalls", "Straw Doll Bandanna", "Straw Doll Face", "Straw Doll Hair", "Straw Doll Hat", "Crow Friends", "Jack O Lantern AD", "Straw Doll AD", "Team Straw Doll Tag", "Team Jack O Lantern Tag", "Candy Jack Apple Icon", "Yarn Ball Hat", "Yarn Pom Earrings", "Yellow Yarn Sweater", "Pink Yarn Sweater", "Blue Yarn Sweater", "Green Yarn Sweater", "Yarnling AD", "Yellow All Star Stars", "Pink All Star Stars", "Blue All Star Stars", "All Star Plush", "All Star Bat", "All Star Ball", "All Star AD", "Malt Shop Fries", "Malt Shop Tray", "Malt Shop Hat", "Malt Shop Face", "Malt Shop AD", "Cloud Captain Chest", "Captain Map BG", "Captain Scimitar", "Ice Skates Scarf", "Ice Skates Face", "Ice Skates Hair", "Ice Skates Beret", "Ice Skates AD", "Sweet Dreams PJs", "Sweet Dreams Sleep Mask", "Sweet Dreams AD", "Herbalist Horns", "Herbalist Hat", "Herbalist Scarf", "Herbalist Capelet", "Herbalist AD", "Haunted Portrait Frame", "2017 Haunted Portrait RAD", "Jack O Lantern Plush", "Straw Doll Plush", "Sweet Treat Sprinkles", "Sweet Treat Horns", "Sweet Treat Ears", "Sweet Treat AD", "Ghost Toy String", "Hairy Scary AD", "Gorgon AD", "Frankengoat AD", "Eye Candy AD", "Changeling AD", "Blue Sorcerer AD", "2017 Monster Box", "Jack O Lantern Box", "Straw Doll Box", "Pumpkin Head", "Moon Veil", "Jack Cape", "Jack Jacket", "Fledgling Face", "Fledgling Nest", "Fledgling AD", "Candy Heart Box", "Candy Heart Ray", "Candy Hearts", "Candy Heart Bow", "Candy Heart Face", "Candy Heart Hair", "Candy Heart AD", "Date Night Ombre", "Date Night Top", "Date Night Face", "Date Night AD", "Sparkler Eyes", "Sparkler Ribbon", "Sparkler Feathers", "Sparkler AD", "Tiangou Treats", "Dog Bone", "Gou Flowers", "Brown Dog Tail", "Orange Dog Tail", "Floppy Dog Tail", "Brown Dog Ears", "Orange Dog Ears", "Floppy Dog Ears", "Beagle Base", "Orange Dog Base", "Gou Base", "Gou AD", "Year 5 Badge", "Ice Skates Box", "Ice Skates Base", "Ice Skates Poncho", "Western Rogue AD", "Boom Box", "Mix Tapes", "Cardio Star Top", "Cardio Star Hair", "Picture Day BG", "Cardio Star AD", "Picnic Basket", "Picnic Sandwich", "Picnic Lemonade", "Picnic Fruit", "Picnic Sub", "Picnicling AD", "Tyrannosaurus Rex Toy", "Brontosaurus Toy", "Triceratops Toy", "Pterodactyl Toy", "Dino Kid AD", "Springtime Divine Hair", "Springtime Divine Halo", "Springtime Divine Flower", "Springtime Divine AD", "Defaced Portrait", "Boatling", "Paper Fish", "Gold Plastic Egg", "Orange Plastic Egg", "Pink Plastic Egg", "Purple Plastic Egg", "Blue Plastic Egg", "Daffodil Bouquet", "Pretty Penny Bride RAD", "Karl Groom RAD", "Fledgling Wings", "Fledgling Birds", "Nightmare Eater Hair", "Nightmare Eater Friends", "Nightmare Eater Freckles", "Nightmare Eater Face", "Nightmare Eater Bow", "Nightmare Eater BG", "Sweet Demon AD", "Nightmare Eater AD", "Crow Family Box", "Crow Sunset BG", "Crow Monarch Top", "Crow Monarch Crown", "White Crow Top", "White Crow Crown", "Crow Confidants", "Black Crow Top", "Black Crow Crown", "Crow Monarch AD", "White Crow AD", "Black Crow AD", "Latte Love Drink", "Latte Love Face", "Latte Love Hat", "Latte Love Hair", "Latte Love AD", "Neapolitan Swirl Cone", "Neapolitan Sprinkles", "Neapolitan Necklace", "Neapolitan Horns", "Neapolitan Face", "Neapolitan Swirling AD", "Western Rogue Hat", "Western Rogue Hair", "Western Rogue Garb", "Western Rogue Face", "Sweet Demon Sprinkles", "Nightmare Eater Sprinkles", "Sweet Demon Blob", "Nightmare Eater Blob", "Cute Treat Bucket", "Nightmare Treat Bucket", "Sweet Treat Bucket", "Black Treat Bucket", "Yellow Treat Bucket", "Green Treat Bucket", "Blue Treat Bucket", "Purple Treat Bucket", "Pink Treat Bucket", "Orange Treat Bucket", "Team Nightmare Eater Tag", "Team Sweet Demon Tag", "Fall Leaves Icon", "2018 Monster Box", "Trickster AD", "Sea Monster AD", "Kismet Kiss AD", "Haunted Doll AD", "Ghostling AD", "Franken Bride AD", "Dragoat AD", "Sweet Demon Mascot Box", "Nightmare Eater Mascot Box", "Sweet Demon Wings", "Sweet Demon Tail", "Sweet Demon Horns", "Sweet Demon Hair", "Sweet Demon Freckles", "Sweet Demon Face", "Sweet Demon BG", "Nightmare Eater Mask", "Porcelain Base", "Porcelain AD", "Year 6 Badge", "Hot Cocoa Drink", "Hot Cocoa Base", "Melted Hot Cocoa Cream", "Fresh Hot Cocoa Cream", "Hot Cocoa AD", "Bookworm Bookmark", "Bookworm Plush", "Bookworm Sweater", "Bookworm Glasses", "Bookworm Cute Book Stack", "Bookworm Book Stack", "Bookworm AD", "Pink Ribbon Box", "Bat Labrys", "Pumpkin Bag", "Ghost Bag", "Frank Bag", "Pumpkin Drink", "Ghost Mallows", "Frank Pop", "Pumpkin Cookie", "Ghost Cookie", "Frank Cookie", "Imp BP", "Goopy BP", "Pumpkit BP", "Sweet Nightmares Plush", "Nightmare Eater Plush", "Sweet Demon Plush", "Sweet Nightmares Ribbon", "Sweet Demon Ribbon", "Nightmare Eater Ribbon", "Lucky Face", "Lucky Rabbit AD", "Mail Kid Puppy Friend", "Mail Kid Flowers", "Mail Kid Top", "Mail Kid Hat", "Mail Kid Hair", "Mail Kid Face", "Mail Kid AD", "Lovesick Casanova Bag", "Casanova Cupcake", "Casanova Tux", "Casanova Face", "Casanova Hearts", "Casanova Bear", "Lovesick Hearts", "Lovesick Hat", "Lovesick Eyepatch", "Lovesick Balloons", "Pink Lovesick Top", "Blue Lovesick Top", "Casanova AD", "Lovesick AD", "Patchwork Plush Box", "Patchwork Plush Hat", "Patchwork Plush Heart", "Patchwork Plush Top", "Patchwork Plush Hair", "Patchwork Plush Face", "Patchwork Plush Cloak", "Patchwork Plush AD", "Porcelain Teapot", "Porcelain Face", "Porcelain Bows", "Porcelain Ears", "Fish Bag", "Betta Dress", "Betta Hair", "Betta Fins", "Betta Eyes", "Plakat Betta Plush", "Veiltail Betta Plush", "Gold Koi Plush", "Koi Plush", "Mini Goldfish Plush", "Lionhead Goldfish Plush", "Goldfish Plush", "Fanny Pack", "Ticket Vendor Hat", "Ticket Vendor Hair", "Ticket Vendor Face", "Ticket Vendor Pack", "Ticket Vendor Tickets", "Clown Ears", "Clown Hat", "Clown Top", "Clown Face Paint", "Cotton Candy Clown AD", "Forget Me Not Bouquet", "Forget Me Nots", "Forget Me Not Necklace", "Forget Me Not Face", "Forget Me Not AD", "Bean Sprout AD", "Coffee Bean", "Jelly Bean", "Bean", "Lucky Bowtie", "Lucky Crown", "Lucky Laurel"
                ];
                switch(true){
                    case stored["Status (explore)"] == "HUNGRY":
                        var checkFood = itemFinder(foodArray);
                        if (checkFood.length > 0 && checkFood != "undefined"){
                            stored["Do we need an item? (explore)"] = true;
                            setStoredValue("explore", stored);
                            setTimeout(function(){location.href = checkFood}, delay)
                        }
                        else alert("No usable food in inventory!");
                        break;
                    case stored["Status (explore)"] == "UNHAPPY":
                        var checkToy = itemFinder(toyArray);
                        if(checkToy.length > 0 && checkToy != "undefined"){
                            stored["Do we need an item? (explore)"] = true;
                            setStoredValue("explore", stored);
                            setTimeout(function(){location.href = checkToy}, delay)
                        }
                        else alert("No usable toys in inventory!");
                        break;
                    case stored["Status (explore)"] == "NO_WEAPON":
                        var checkWeapon = itemFinder(weaponArray);
                        if(checkWeapon.length > 0 && checkWeapon != "undefined"){
                            stored["Do we need an item? (explore)"] = true;
                            setStoredValue("explore", stored);
                            setTimeout(function(){location.href = checkWeapon}, delay)
                        }
                        else alert("No usable weapons in inventory!");
                        break;
                    default:
                        console.log("No inventory related status set");
                        break;
                }
                break;

            case /\/inventory\/view\/\d*/.test(document.URL):
                /* Page that happens when we first click an item */
                if(stored["Do we need an item? (explore)"]){
                    let options = document.getElementById("option");
                    if (content.search("Type: collectible") > 0 || content.indexOf('Type: wearable') > 0){
                        setTimeout (function(){location.href ="https://www.goatlings.com/inventory/"}, delay)}
                    else {
                        if (options.options[9]){
                            options.options[9].selected = true;
                            setTimeout(function(){document.getElementsByTagName('form')[2].submit()}, delay)}
                        else if (options.options[8]){
                            options.options[8].selected = true;
                            setTimeout(function(){document.getElementsByTagName('form')[2].submit()}, delay)}
                        else alert("Something broke here");
                    }
                }
                else return;
                break;

            case /\/inventory\/view_action\/.*/.test(document.URL):
                /* Page that happens when we click that we want to give the item to a goat */
                if(stored["Do we need an item? (explore)"]){
                    var select = document.querySelector('select[name="petid"]'),
                        arrText = [], arrIndex = [], index = -1;
                    for(let i = 0; i<select.length; i++){
                        arrText.push(select[i].textContent); // array with goat names from selection dropdown
                        arrIndex.push(select[i].value) // array with goat's ID values from selection dropdown
                    }
                    index = arrText.indexOf(document.querySelector("#user-info").childNodes["3"].textContent); // grabs Active Goat's name
                    select.value = arrIndex[index]; //selection dropdown set to active goat's id value
                    delete stored["Do we need an item? (explore)"];
                    setStoredValue("explore", stored);
                    setTimeout(function(){document.getElementsByTagName('form')[2].submit()}, delay)
                }
                else {
                    delete stored["Status (explore)"];
                    setStoredValue("explore", stored);
                    setTimeout (function(){location.href = "https://www.goatlings.com/explore/view"}, delay)
                }
                break;

            case /\/fountain/.test(document.URL):
                if(content.search("It costs 1,000 SS to heal your pets.") == -1){
                    alert("We don't have enough Sugar Stars!")
                }
                else {
                    if (stored["Status (explore)"] == "LOW_HP"){
                        delete stored["Status (explore)"];
                        setStoredValue("explore", stored);
                        setTimeout(function(){document.getElementsByTagName('form')[1].submit()}, delay)
                    }
                    else {
                        console.log("We don't need healing");
                        if(stored["Zero turns"] == true){
                            stored["Zero turns"] = false;
                            setStoredValue("explore", stored);
                            setTimeout(function(){location.href = "https://goatlings.com/explore/index"}, delay)
                        }
                        else setTimeout(function(){location.href = "https://goatlings.com/explore/view"}, delay)
                    }
                }
                break;

            case /\/profile\/u\//.test(document.URL):
                setStoredValue("explore");
                console.log("Reset all values. (Halloween Auto-Explorer)");
                break;

            default:
                console.log("Default case (Nothing bad happened)");
                break;
        }
    }
    else return;
})();
