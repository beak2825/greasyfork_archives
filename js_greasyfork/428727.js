// ==UserScript==
// @name         Bondage Club Functions
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  Suite of callable functions for bondage club!
// @author       Suzuki
// @match        https://www.bondageprojects.elementfx.com/R72/BondageClub/
// @include      /^https?://www.bondageprojects\.elementfx\.com/R72/[0-9]+/
// @include      /^https?://www.bondageprojects\.elementfx\.com/R72/BondageClub/[0-9]+/
// @include      /^https?://www.bondage-europe\.com/R72/BondageClub/[0-9]+/
// @icon         https://www.google.com/s2/favicons?domain=elementfx.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428727/Bondage%20Club%20Functions.user.js
// @updateURL https://update.greasyfork.org/scripts/428727/Bondage%20Club%20Functions.meta.js
// ==/UserScript==

// https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
// ServerSocket.on("ChatRoomSyncMemberJoin", function (data) { ChatRoomSyncMemberJoin(data); });

//InventoryGroupIsBlocked  = function (C, GroupName) { return false; }
//InventoryPrerequisiteMessage    = function (C, Prerequisit) { return ""; }

//BackgroundsList.push({ Name: "Cell", Tag: [BackgroundsTagIndoor] });
//ChatCreateBackgroundList = BackgroundsGenerateList(BackgroundsTagList);

(function() {
    'use strict';

    // Your code here...
    // Exposed Object to call from console
    var BCFunctions = window.BCFunctions = {};

    var translateGagSpeak = true;
    var autoWiggleNose = true;
    var trapActive = false;

    BCFunctions.password = "";
    BCFunctions.relockRoom = false;

    var diceVerbs = [{verb: "kiss", weight: 30, maxWeight: 30, useNoun: true},
                     {verb: "lick", weight: 30, maxWeight: 30, useNoun: true},
                     {verb: "caress", weight: 30, maxWeight: 30, useNoun: true},
                     {verb: "tickle", weight: 30, maxWeight: 30, useNoun: true},
                     {verb: "nibble", weight: 30, maxWeight: 30, useNoun: true},
                     {verb: "gag", weight: 15, maxWeight: 15, useNoun: false},
                     {verb: "bind", weight: 45, maxWeight: 45, useNoun: false},
                     {verb: "blindfold", weight: 10, maxWeight: 10, useNoun: false},
                     {verb: "strip an item off of", weight: 15, maxWeight: 20, useNoun: false},
                     {verb: "kidnap", weight: 0, maxWeight: 3, useNoun: false}];
    var diceNouns = [{noun: "arms", weight: 100, maxWeight: 100},
                     {noun: "mouth", weight: 100, maxWeight: 100},
                     {noun: "breasts", weight: 80, maxWeight: 80},
                     {noun: "hips", weight: 80, maxWeight: 80},
                     {noun: "legs", weight: 100, maxWeight: 100},
                     {noun: "ears", weight: 100, maxWeight: 100},
                     {noun: "nose", weight: 90, maxWeight: 90},
                     {noun: "pussy", weight: 70, maxWeight: 70},
                     {noun: "butt", weight: 40, maxWeight: 40},
                     {noun: "hands", weight: 90, maxWeight: 90}];
    var diceBindables = [{noun: "arms", weight: 100, maxWeight: 100},
                         {noun: "legs", weight: 100, maxWeight: 100},
                         {noun: "feet", weight: 100, maxWeight: 100},
                         {noun: "chest", weight: 100, maxWeight: 100},
                         {noun: "hands", weight: 100, maxWeight: 100}];

    var deviousDice = [{binding: "HempRope", slot:"ItemArms", weight:100, maxWeight:100, msg: "and suddenly a long coil of rope shoots out and wraps around their arms!", options: InventoryItemArmsHempRopeOptions, validOptions: ["WristElbowHarnessTie","BoxTie","WristElbowTie","Hogtied"]},
                       {binding: "LeatherArmbinder", slot:"ItemArms", weight:100, maxWeight:100, msg: "and quickly a leather armbinder straps itself around their arms tightly!", options: AssetFemale3DCGExtended.ItemArms.LeatherArmbinder.Config.Options, validOptions: null},
                       {binding: "HighSecurityStraitJacket", slot:"ItemArms", weight:10, maxWeight:10, msg: " when poof! A High Security Jacket binds itself to them strictly!", modules: AssetFemale3DCGExtended.ItemArms.HighSecurityStraitJacket.Config.Modules, validOptions: [[1,1,3],[1,2,3]]},
                       {binding: "SturdyLeatherBelts", slot:"ItemArms", weight:100, maxWeight:100, msg: "when suddenly some leather belts fly out and pin their arms to their back!", options: AssetFemale3DCGExtended.ItemArms.SturdyLeatherBelts.Config.Options},
                       {binding: "LatexBoxtieLeotard", slot:"ItemArms", weight:100, maxWeight:100, msg: "and a sheet a latex flings itself onto them, encasing them and pinning their arms behind them!"},
                       {binding: "LatexSleevelessLeotard", slot:"ItemArms", weight:100, maxWeight:100, msg: "and a sheet a latex flings itself onto them, encasing them and pinning their arms in front of them!"},
                       {binding: "StrictLeatherPetCrawler", slot:"ItemArms", weight:25, maxWeight:25, msg: "and they feel compelled to slip them selves into a strict pet crawler, the straps locking themselves in the process..."},
                       {binding: "Web", slot:"ItemArms", weight:60, maxWeight:60, msg: "when from the corner of their vision some web shoots out and starts to wrap itself around threir body wrapping them entirely!", options: AssetFemale3DCGExtended.ItemArms.Web.Config.Options, validOptions: ["Wrapped","Cocooned","KneelingSuspended"]},

                       {binding: "PaddedLeatherMittens", slot:"ItemHands", weight:100, maxWeight:100, msg: "when out of nowhere a pair of padden mittens slides and compresses onto their hands!"},
                       {binding: "DuctTape", slot:"ItemHands", weight:100, maxWeight:100, msg: "and quickly some tape comes out and encases their hands!"},

                       {binding: "HempRopeHarness", slot:"ItemTorso", weight:90, maxWeight:90, msg: "when suddenly some rope starts to snake along their body, forming a tight harness around them!", options: AssetFemale3DCGExtended.ItemTorso.HempRopeHarness.Config.Options, validOptions: ["Harness"]},

                       {binding: "SturdyLeatherBelts", slot:"ItemLegs", weight:130, maxWeight:130, msg: "and suddenly some leather belts fly out and strap their thighs together!", options: AssetFemale3DCGExtended.ItemLegs.SturdyLeatherBelts.Config.Options},
                       {binding: "DuctTape", slot:"ItemLegs", weight:130, maxWeight:130, msg: "when suddenly a roll of tape starts to wrap around their legs!", options: AssetFemale3DCGExtended.ItemLegs.DuctTape.Config.Options},
                       {binding: "LegBinder", slot:"ItemLegs", weight:110, maxWeight:110, msg: "when suddenly a legbinder yanks itself around their legs, the belt being pulled snugly across!"},

                       {binding: "SturdyLeatherBelts", slot:"ItemFeet", weight:100, maxWeight:100, msg: "when quickly some leather belts fly out and strap their calves together!", options: AssetFemale3DCGExtended.ItemArms.SturdyLeatherBelts.Config.Options},
                       {binding: "DuctTape", slot:"ItemFeet", weight:100, maxWeight:100, msg: "when suddenly a roll of tape starts to wrap around their legs!", options: AssetFemale3DCGExtended.ItemFeet.DuctTape.Config.Options},

                       {binding: "WiffleGag", slot:"ItemMouth", weight:80, maxWeight:80, msg: "and a wiffle ballgag shoots into their mouth and clips behind their head!", options: AssetFemale3DCGExtended.ItemMouth.WiffleGag.Config.Options, validOptions: ["Tight"]},
                       {binding: "BallGag", slot:"ItemMouth", weight:80, maxWeight:80, msg: "and a ballgag tightly forces itself into their mouth, clicking behind their head!", options: AssetFemale3DCGExtended.ItemMouth.BallGag.Config.Options, validOptions: ["Tight"]},
                       {binding: "LargeDildo", slot:"ItemMouth", weight:100, maxWeight:100, msg: "suddenly a dildo forces itself into their open mouth!"},
                       {binding: "ClothStuffing", slot:"ItemMouth", weight:60, maxWeight:60, msg: "when a wad of cloth poofs into their mouth?"},
                       {binding: "DuctTape", slot:"ItemMouth", weight:80, maxWeight:80, msg: "and suddenly some tape wraps around their face!", options: AssetFemale3DCGExtended.ItemMouth.DuctTape.Config.Options, validOptions: ["Small","Crossed","Double","Cover"]},
                       {binding: "PumpGag", slot:"ItemMouth", weight:80, maxWeight:80, msg: "when a pump gag presses to their face and clips behind, letting out a quiet hiss as it expands inside their mouth!", options: AssetFemale3DCGExtended.ItemMouth.PumpGag.Config.Options, validOptions: ["Bloated","Maximum"]},
                       {binding: "MuzzleGag", slot:"ItemMouth", weight:80, maxWeight:80, msg: "when a muzzle slaps onto their faces and cinches tightly in place!"},

                       {binding: "ClothBlindfold", slot:"ItemHead", weight:200, maxWeight:200, msg: "and a strip of cloth wraps around their face, covering their eyes in the process!"},
                       {binding: "PaddedBlindfold", slot:"ItemHead", weight:130, maxWeight:130, msg: "when suddenly a soft blindfold firmly presses and covers their eyes, the straps pulled tight behind their head..."},
                       {binding: "DuctTape", slot:"ItemHead", weight:130, maxWeight:130, msg: "and some tape wraps around their face covering their eyes!", options: AssetFemale3DCGExtended.ItemHead.DuctTape.Config.Options, validOptions: ["Double","Wrap"]},
                       {binding: "WebBlindfold", slot:"ItemHead", weight:130, maxWeight:130, msg: "when suddenly some web shoots out and wraps around their eyes sticking tightly to their face!", options: AssetFemale3DCGExtended.ItemHead.WebBlindfold.Config.Options, validOptions: ["Blindfold"]},

                       // TODO fix with other item conflicts
                       // Plan, don't allow ItemDevices slot until arms legs and thighs are bound
                       //{binding: "ConcealingCloak", slot:"ItemDevices", weight:5, maxWeight:5, msg: "and a black cloak floats down from above and drapes over their body softly."},
                       //{binding: "BurlapSack", slot:"ItemDevices", weight:40, maxWeight:40, msg: "when a sack shoots up around their body, cinching tightly!"},

                       {binding: "WiredEgg", slot:"ItemVulva", weight:60, maxWeight:60, msg: "when they feel a small egg inside them start to buzz around~"},
                       {binding: "VibratingEgg", slot:"ItemVulva", weight:60, maxWeight:60, msg: "when they suddenly feel a small egg slide inside them and start to buzz around~"},
                       {binding: "InflatableVibeDildo", slot:"ItemVulva", weight:40, maxWeight:40, msg: "when they suddenly feel something expanding inside their pussy and start to buzz softly!~"},];

    //Exposed Vars
    BCFunctions.wingColor = "#6C8CDB";
    BCFunctions.suzuHair = "#9FBBFF";
    BCFunctions.onlineFriendsList = [];

    BCFunctions.ToggleGagTranslation = function(){
        translateGagSpeak = !translateGagSpeak;
        console.log(translateGagSpeak)
    }

    BCFunctions.ToggleNoseWIggle = function(){
        autoWiggleNose = !autoWiggleNose;
        console.log(autoWiggleNose);
    }

    BCFunctions.ToggleTrap = function(){
        trapActive = !trapActive;
        console.log(trapActive);
    }

    // Binds the target with a strict petsuit with the given color
    BCFunctions.BindWithStrictPetSuit = function(target_name, color_string = "Default"){
        var target = FindTarget(target_name);
        if(target!=null){
            // Strip upper and lower cloth plus shoes and undies
            target.Appearance=target.Appearance.filter(x => !x.Asset.Group.Name.match(/Cloth*|Shoes|Panties|Bra|Socks/));

            //Put on seamless catsuit underneath
            InventoryWear(target, "SeethroughSuit", "Suit", color_string);
            InventoryWear(target, "SeethroughSuit", "SuitLower", color_string);
            InventoryWear(target, "SeethroughSuit", "Gloves", color_string);
            InventoryWear(target, "LatexSocks1", "Socks", color_string);
            InventoryWear(target, "LeatherStrapBra1", "Bra", color_string);

            // Next equip the items
            InventoryWear(target, "HeavyLatexCorset", "ItemTorso", color_string, SkillGetWithRatio("Bondage"));
            InventoryWear(target, "StrictLeatherPetCrawler", "ItemArms", color_string, SkillGetWithRatio("Bondage"));
            InventoryWear(target, "SciFiPleasurePanties", "ItemPelvis", color_string, SkillGetWithRatio("Bondage"));
            InventoryWear(target, "LeatherBreastBinder", "ItemBreast", color_string, SkillGetWithRatio("Bondage"));

            // Update strap types
            //InventoryGet(target,"ItemTorso").Property = {Type: "Straps"}
            SetItemProperty(target, "ItemTorso", AssetFemale3DCGExtended.ItemTorso.HeavyLatexCorset.Config.Options, "Straps");

            // Last step publish our changes
            ChatRoomCharacterUpdate(target);

            // Send a message to the chatroom
            ServerSend("ChatRoomChat", { Content: "Beep", Type: "Action", Dictionary: [{Tag: "Beep", Text: Player.Name+" wiggles her nose and lets out a soft yip, and "+target.Name+" finds themself strapped into a strict petsuit." }]});
        }
        else{
            console.log("Couldn't find target with name: "+target_name+"!");
        }
    }

    // Heavily binds the target with rope of the given color
    BCFunctions.BindWithRope = function(target_name, color_string = "#956B1C"){
        var target = FindTarget(target_name);
        if(target!=null){
            //Add the rope!
            InventoryWear(target, "HempRope", "ItemLegs", color_string, SkillGetWithRatio("Bondage"));
            InventoryWear(target, "HempRope", "ItemFeet", color_string, SkillGetWithRatio("Bondage"));
            InventoryWear(target, "HempRope", "ItemPelvis", color_string, SkillGetWithRatio("Bondage"));
            InventoryWear(target, "HempRopeHarness", "ItemTorso", color_string, SkillGetWithRatio("Bondage"));
            InventoryWear(target, "HempRope", "ItemArms", color_string, SkillGetWithRatio("Bondage"));
            InventoryWear(target, "ToeTie", "ItemBoots", color_string, SkillGetWithRatio("Bondage"));

            // Next update the bindings to the type we want
            SetItemProperty(target, "ItemLegs", AssetFemale3DCGExtended.ItemLegs.HempRope.Config.Options, "Crossed");
            SetItemProperty(target, "ItemFeet", HempRopeFeetOptions, "Link");
            SetItemProperty(target, "ItemPelvis", AssetFemale3DCGExtended.ItemPelvis.HempRope.Config.Options, "SwissSeat");
            SetItemProperty(target, "ItemTorso", AssetFemale3DCGExtended.ItemTorso.HempRopeHarness.Config.Options, "Harness");
            SetItemProperty(target, "ItemArms", InventoryItemArmsHempRopeOptions, "WristElbowHarnessTie");

            ChatRoomCharacterUpdate(target);

            ServerSend("ChatRoomChat", { Content: "Beep", Type: "Action", Dictionary: [{Tag: "Beep", Text: Player.Name+" snaps her fingers and several coils of rope shoot out, binding "+target.Name+" tightly." }]});
        }
        else{
            console.log("Couldn't find target with name: "+target_name+"!");
        }
    }

    // Mummifies the target with tape of the given color
    BCFunctions.MummifyWithTape = function(target_name, color_string = "Default"){
        var target = FindTarget(target_name);
        if(target!=null){
            // Strip upper and lower clothes
            target.Appearance=target.Appearance.filter(x => !x.Asset.Group.Name.match(/Cloth*|Shoes/));

            //Add the tape!
            InventoryWear(target, "DuctTape", "ItemLegs", color_string, SkillGetWithRatio("Bondage"));
            InventoryWear(target, "DuctTape", "ItemFeet", color_string, SkillGetWithRatio("Bondage"));
            InventoryWear(target, "DuctTape", "ItemArms", color_string, SkillGetWithRatio("Bondage"));
            InventoryWear(target, "ToeTape", "ItemBoots", color_string, SkillGetWithRatio("Bondage"));
            InventoryWear(target, "DuctTape", "ItemHands", color_string, SkillGetWithRatio("Bondage"));

            //AssetFemale3DCGExtended.ItemArms.DuctTape.Config.Options
            //https://github.com/Ben987/Bondage-College/blob/0caf3f2cd6e0b5b083b4e69dba737a4bb4452237/BondageClub/Assets/Female3DCG/Female3DCGExtended.js#L435
            //https://github.com/Ben987/Bondage-College/blob/master/BondageClub/Screens/Inventory/ItemBoots/ToeTape/ToeTape.js

            SetItemProperty(target, "ItemLegs", AssetFemale3DCGExtended.ItemLegs.DuctTape.Config.Options, "CompleteLegs");
            SetItemProperty(target, "ItemFeet", AssetFemale3DCGExtended.ItemFeet.DuctTape.Config.Options, "CompleteFeet");
            SetItemProperty(target, "ItemArms", AssetFemale3DCGExtended.ItemArms.DuctTape.Config.Options, "Complete");
            SetItemProperty(target, "ItemBoots", AssetFemale3DCGExtended.ItemBoots.ToeTape.Config.Options, "Full");

            ChatRoomCharacterUpdate(target);

            ServerSend("ChatRoomChat", { Content: "Beep", Type: "Action", Dictionary: [{Tag: "Beep", Text: Player.Name+" wiggles her fingers. Several rolls of tape spring to life, flying toward "+target.Name+" and starting to fully wrap them in several layers of tight tape." }]});
        }
        else{
            console.log("Couldn't find target with name: "+target_name+"!");
        }
    }

    BCFunctions.SitOnCushion = function(target_name, color_string = "Default"){
        var target = FindTarget(target_name);
        if(target!=null){
            InventoryWear(target, "Cushion", "ItemDevices", color_string, SkillGetWithRatio("Bondage"));
            SetItemProperty(target, "ItemDevices", AssetFemale3DCGExtended.ItemDevices.Cushion.Config.Options, "Kneel");

            ChatRoomCharacterUpdate(target);

            ServerSend("ChatRoomChat", { Content: "Beep", Type: "Action", Dictionary: [{Tag: "Beep", Text: target.Name+" grabs a comfy cushion and plops down onto it quietly." }]});
        }
    }

    BCFunctions.SuzuBed = function(target_name){
        var target = FindTarget(target_name);
        if(target!=null){
            InventoryWear(target, "Bed", "ItemDevices", "Default", SkillGetWithRatio("Bondage"));
            InventoryWear(target, "Covers", "ItemAddon", "Default", SkillGetWithRatio("Bondage"));

            InventoryGet(target, "ItemDevices").Color = [ "#523629", "#1C253F", "#1F1E33" ];
            InventoryGet(target, "ItemAddon").Color = [ "#1C253F", "#1C253F" ];

            ChatRoomCharacterUpdate(target);
        }
    }


    BCFunctions.PetBed = function(target_name, color_string = "Default"){
        var target = FindTarget(target_name);
        if(target!=null){
            InventoryWear(target, "PetBed", "ItemDevices", color_string, SkillGetWithRatio("Bondage"));
            SetItemProperty(target, "ItemDevices", AssetFemale3DCGExtended.ItemDevices.PetBed.Config.Options, "NoBlanket");

            ChatRoomCharacterUpdate(target);

            ServerSend("ChatRoomChat", { Content: "Beep", Type: "Action", Dictionary: [{Tag: "Beep", Text: Player.Name + " picks up " + target.Name+" and sets them gently into a petbed." }]});
        }
    }

    // Correctly updates an item's property to the specified one
    function SetItemProperty(target, item_slot, options, option_name){
        var item = InventoryGet(target, item_slot);
        if(item == null || options == null) return;
        item.Property = options[0];
        options.forEach(function(option){
            if(option.Name == option_name){
                item.Property = option.Property;
            }
        });
    }
    BCFunctions.SetItemProperty = SetItemProperty;

    function SetModularItemProperty(target, item_slot, modules, config){
        //ModularItemMergeModuleValues({asset: InventoryGet(Player, "ItemArms").Asset, modules: AssetFemale3DCGExtended.ItemArms.HighSecurityStraitJacket.Config.Modules}, [1,1,3])
        var item = InventoryGet(target, item_slot);
        if(item == null) return;
        item.Property = ModularItemMergeModuleValues({asset: item.Asset, modules: modules}, config);
    }

    BCFunctions.PrintApperance = function(target_name){
        var target = FindTarget(target_name);
        if(target!=null){
            var index = 0;
            target.Appearance.forEach(function(item){
                var str = index + "|" + item.Asset.Name + "|" + (item.Asset.Group!=null ? item.Asset.Group.Name : "null");
                if(item.Property!=null){
                    str+=" | "+item.Property.Type;
                }
                console.log(str);
                index++;
            });
        }
        else{
            console.log("Couldn't find target with name: "+target_name+"!");
        }
    }

    //Chat message handler
    ServerSocket.on("ChatRoomMessage", function(data){
        if ((data != null) && (typeof data === "object") && (data.Content != null) && (typeof data.Content === "string") && (data.Content != "") && (data.Sender != null) && (typeof data.Sender === "number")) {
            //Auto wiggle nose
            if(autoWiggleNose && data.Content.includes("ItemNose-Pet")){
                if(data.Dictionary.length==4){
                    if(data.Dictionary[1].Text == Player.Name){
                        setTimeout(function() {ServerSend("ChatRoomChat", { Content: "Beep", Type: "Action", Dictionary: [{Tag: "Beep", Text: Player.Name+" wiggles her nose."}]});} ,5285 + Math.random()*2700);
                    }
                }
            }
            // Handle chat commands here
            else if(data.Type == "Chat" || data.Type == "Whisper"){
                // Find sender's name
                var senders_name = "";
                ChatRoomCharacter.forEach(function(char){
                    if(char.MemberNumber == data.Sender){
                        senders_name = char.Name;
                        return;
                    }
                });
                var m = data.Content.toLowerCase().trim();
                var args = m.split(" ");
                if (m.indexOf("!kinkydice") == 0) {
                    BCFunctions.RollTheKinkyDice(senders_name);
                }
                if (m.indexOf("!deviousdice") == 0) {
                    HandleDeviousDiceCommand(args,senders_name,data.Sender);
                }
            }
        }
    });

    // Original located here (https://pastebin.com/p2fiwVtt) though this one has been modified slightly
    //Note: A /safeword command that removes everything.
    BCFunctions.SafeWord = function(removeCollar = false){
        if(removeCollar){
            Player.Appearance=Player.Appearance.filter(x => (!x.Asset.Group.Name.match(/Item.*/)));
        }
        else{
            Player.Appearance=Player.Appearance.filter(x => (!x.Asset.Group.Name.match(/Item.*/)) || (x.Asset.Group.Name.match(/ItemNeck|ItemNeckAccessories/)));
        }
        ChatRoomCharacterUpdate(Player);
    }

    // Original located here (https://pastebin.com/p2fiwVtt)
    //Note: A /safeword command that removes whichever item you're zoomed in on, such as arms.
    BCFunctions.RemoveItem = function(){
        Player.Appearance = Player.Appearance.filter(x => (Player.FocusGroup && Player.FocusGroup.Name) ? x.Asset.Group.Name != Player.FocusGroup.Name : true);
        ChatRoomCharacterUpdate(Player);
    }

    BCFunctions.AddToStore = function(){
        Asset.forEach(e => { if (e.Value < 0) e.Value = 1; });
    }

    BCFunctions.RollTheKinkyDice = function(roller_name){
        var verb = weighted_random(diceVerbs);
        var noun = null;
        if(verb.useNoun) noun = weighted_random(diceNouns);
        if(verb.verb == "bind") noun = weighted_random(diceBindables);

        // Reduce weight to reduce chance of repeat actions
        verb.weight = Math.max(verb.weight-7,0);
        if(noun!=null) noun.weight = Math.max(noun.weight-15,0);

        var diceMsg = "";
        if(noun == null){
            diceMsg = `${roller_name} rolls the kinky dice and gets... ${verb.verb} them!`;
        }
        else{
            diceMsg = `${roller_name} rolls the kinky dice and gets... ${verb.verb} their ${noun.noun}!`;
        }
        ServerSend("ChatRoomChat", { Content: "Beep", Type: "Action", Dictionary: [{Tag: "Beep", Text: diceMsg }]});

        // Increase all weights
        diceVerbs.forEach(function(d_verb){
            if(d_verb.verb!=verb.verb){ d_verb.weight = Math.min(d_verb.weight+1,d_verb.maxWeight);}
        });
        diceNouns.forEach(function(d_noun){
            if(noun==null || (noun!=null && d_noun.noun!=noun.noun)){ d_noun.weight = Math.min(d_noun.weight+2,d_noun.maxWeight);}
        });
        console.log(diceNouns);
        console.log(diceVerbs);
    }

    // TODO, should I swap to a slot based picking option?
    // var temp = AssetFemale3DCG.filter(x=>x.Group.includes("Item") && InventoryGet(Player,x.Group)==null)
    // tempdeviousDice.filter(x=> temp.some(y => y.Group == x.slot))
    function HandleDeviousDiceCommand(args, caller, caller_number){
        var rolls = 1;
        var allow_locks = true;
        var last_time = 0;
        args.forEach(function(arg){
            if(!isNaN(parseInt(arg))){rolls = parseInt(arg);}
            if(arg.indexOf("nolocks") == 0){allow_locks = false;}
        });
        if(rolls>0){ServerSend("ChatRoomChat", { Content: "Beep", Type: "Action", Dictionary: [{Tag: "Beep", Text: `${caller} starts to roll ${rolls} of the devious dice...` }]});}
        for(var x=0; x<rolls;x++){
            var next_time = last_time + 2000 + Math.random()*1500;
            setTimeout(BCFunctions.RollTheDeviousDice, next_time, caller_number, 5, allow_locks);
            last_time = next_time;
        }
    }

    // Add a random item to the target player
    BCFunctions.RollTheDeviousDice = function(roller_number, times = 3, allow_locks = false){
        var target = null;
        ChatRoomCharacter.forEach(function(char){
            if(char.MemberNumber == roller_number){
                target = char;
                return;
            }
        });
        if(target==null) return;
        var action = weighted_random(deviousDice);
        var added_item = false;
        var added_lock = false;
        var slot = action.slot; // To handle mouth subgroups since action.slot for mouth is always "ItemMouth"

        // to use - check if we can wear item (for gags)
        // InventoryAllow(Player,AssetGet("Female3DCG","ItemMouth","BallGag").Prerequisite)

        // Bind the target
        // First make sure the slot is empty
        if(action.slot == "ItemMouth"){
            // Special logic for gags~
            if(InventoryGet(target, "ItemMouth") == null){
                InventoryWear(target, action.binding, action.slot, "default", SkillGetWithRatio("Bondage"));
                added_item = true;
            }
            else{
                // Something in Mouth1 slot, try slot two
                if(InventoryGet(target, "ItemMouth2") == null && AssetGet("Female3DCG","ItemMouth",action.binding).Prerequisite!=null){
                    if(InventoryAllow(target,AssetGet("Female3DCG","ItemMouth",action.binding).Prerequisite)){
                        InventoryWear(target, action.binding, "ItemMouth2", "default", SkillGetWithRatio("Bondage"));
                        added_item = true;
                        slot = "ItemMouth2";
                    }
                }
                else{
                    // Something in Mouth2 slot, try slot three
                    if(InventoryGet(target, "ItemMouth3") == null && AssetGet("Female3DCG","ItemMouth",action.binding).Prerequisite!=null){
                        if(InventoryAllow(target,AssetGet("Female3DCG","ItemMouth",action.binding).Prerequisite)){
                            InventoryWear(target, action.binding, "ItemMouth3", "default", SkillGetWithRatio("Bondage"));
                            added_item = true;
                            slot = "ItemMouth3";
                        }
                    }
                }
            }
        }
        else if(InventoryGet(target, action.slot) == null){
            InventoryWear(target, action.binding, action.slot, "default", SkillGetWithRatio("Bondage"));
            added_item = true;
        }
        if(added_item){
            // Next pick a random option if any exist
            if(action.options && action.options != null){
                // Choose from the subset if it exists
                if(action.validOptions && action.validOptions != null){
                    var option = action.validOptions[Math.floor(Math.random() * action.validOptions.length)];
                    SetItemProperty(target, slot, action.options, option);
                }
                // otherwise pick from all options
                else{
                    var option = action.options[Math.floor(Math.random() * action.options.length)];
                    SetItemProperty(target, slot, action.options, option.Name);
                }
            }
            // Handle fancy stuff like the strict straight jacket if needed
            else if(action.modules){
                var option = action.validOptions[Math.floor(Math.random() * action.validOptions.length)];
                SetModularItemProperty(target, slot,action.modules, option);
            }
            // Handle vibes here
            if(action.slot == "ItemVulva"){
                var vibe = InventoryGet(target, "ItemVulva");
                if(vibe!=null && action.binding.includes("Egg")){VibratorModeSetProperty(vibe, VibratorModeOptions.Advanced[0].Property);}
                else if(vibe!=null && action.binding == "InflatableVibeDildo"){
                    if (vibe.Property == null) vibe.Property = { InflateLevel: 3 };
                    if (vibe.Property.InflateLevel == null) vibe.Property.InflateLevel = 3;
                    if (vibe.Property == null) vibe.Property = { Intensity: 0 };
                    if (vibe.Property.Intensity == null) vibe.Property.Intensity = 0;
                    vibe.Property.Effect = ["Egged", "Vibrating"];
                    CharacterLoadEffect(target);
                }
            }

            var diceMsg = `The devious dice roll across the floor... ${action.msg}`;
            ServerSend("ChatRoomChat", { Content: "Beep", Type: "Action", Dictionary: [{Tag: "Beep", Text: diceMsg }]});
            ChatRoomCharacterUpdate(target);

            // Update Weights
            action.weight = Math.max(action.weight-14,0);
            deviousDice.forEach(function(die){
                die.weight = Math.min(die.weight+2,die.maxWeight);
            });
        }
        else{
            // Couldn't add item for some reason... try to lock it
            if(allow_locks && Math.random()<0.45){
                var item = null;
                // Find all lockables on the target that are still not locked
                var lockables = target.Appearance.filter(x => x.Asset.AllowLock && !InventoryLocked(target, x.Asset.Group.Name));
                if(lockables.length>0){
                    // Pick a random item
                    item = lockables[Math.floor(Math.random()*lockables.length)];
                    if(item != null){
                        // 30% Metal, 70% Exclusive
                        var lock = Math.random() < 0.3 ? "MetalPadlock" : "ExclusivePadlock";
                        InventoryLock(target,item,lock,target.MemberNumber);
                        ServerSend("ChatRoomChat", { Content: "Beep", Type: "Action", Dictionary: [{Tag: "Beep", Text: `${target.Name} hears a soft click as a lock is added to their bindings!` }]});
                        added_lock = true;
                        return;
                    }
                }
            }
            // If we did nothing, do a full reroll unless we used them all up
            if(times > 1 && !added_lock) BCFunctions.RollTheDeviousDice(roller_number, times-1);
            // If we did nothing in all of our calls, let the whole world know
            else{
                var diceMsg = `The devious dice roll on the floor... but nothing happens?`;
                ServerSend("ChatRoomChat", { Content: "Beep", Type: "Action", Dictionary: [{Tag: "Beep", Text: diceMsg }]});
            }
        }
    }

    // Finds the given player in a chatroom. If two players match the first one found is returned
    function FindTarget(target_name){
        var targetfinder = new RegExp('^'+target_name+'', 'i');
        var targets = ChatRoomCharacter.filter(A => (A.Name.match(targetfinder)));
        var target = null;
        if(targets != null && targets.length>0) target = targets[0];
        return target;
    }
    function FindTargetByCode(target_code){
        var targets = ChatRoomCharacter.filter(A => (A.MemberNumber == target_code));
        var target = null;
        if(targets != null && targets.length>0) target = targets[0];
        return target;
    }

    // Friend update request code
    function RequestFriendUpdate(){
        ServerSend("AccountQuery", { Query: "OnlineFriends" });
        setTimeout(RequestFriendUpdate, 90000+Math.random()*15000);
    }
    RequestFriendUpdate();

    // Handles the query result and notifies the player of who has come online
    ServerSocket.on("AccountQueryResult", function (data) {
        //ServerAccountQueryResult(data);
        if(Player == null || Player.Name == "") {
            console.log("Not signed in, not checking friend list...");
            return;
        }
        if(data.Query == "OnlineFriends"){
            if(data.Result.length>0){
                //console.log(BCFunctions.onlineFriendsList);
                var newOnlineFriendsList = [];
                data.Result.forEach(friend => {
                    if(!BCFunctions.onlineFriendsList.includes(friend.MemberNumber)){
                        ServerSend("ChatRoomChat", { Target: Player.MemberNumber, Content: friend.MemberName + " has come online!", Type: "Whisper"});
                        console.log(friend.MemberName + " has come online!");
                        AudioPlayInstantSound("Audio/BellSmall.mp3", 1);
                    }
                    else{
                        //
                    }
                    newOnlineFriendsList.push(friend.MemberNumber);
                });
                BCFunctions.onlineFriendsList = newOnlineFriendsList;
                console.log("Updated current friends.");
            }
        }
    });

    // Handle user join requests
    ServerSocket.on("ChatRoomSyncMemberJoin", function (data) {
        // First make sure we are the admin and have the func enabled
        if(!trapActive) return;
        if(!ChatRoomData.Admin.includes(Player.MemberNumber)) return;
        var target = null;
        target = FindTargetByCode(data.SourceMemberNumber);
        // colors todo
        //InventoryGet(Player,"HairFront")
        //InventoryGet(Player,"HairBack")
        if(target!=null){
            BCFunctions.BindWithRope(target.Name);
        }
    });

    // Overwrite speech garble function
    SpeechGarble = function(C, CD, NoDeaf=false) {
        let NS = CD;

        let GagEffect = SpeechGetTotalGagLevel(C, NoDeaf);

        if (GagEffect > 0) {
            if(translateGagSpeak && !CD.includes("(")){
                console.log(CD);
            }
            NS = SpeechGarbleByGagLevel(GagEffect, CD);
        }

        // No gag effect, we return the regular text
        NS = SpeechStutter(C, NS);
        NS = SpeechBabyTalk(C, NS);

        return NS;
    }

    // Auto reconnect script
    var OldServerDisconnect = ServerDisconnect;
    ServerDisconnect = function(data, close = false){
        ///
        OldServerDisconnect(data, close);
        setTimeout(AttemptReconnect, 5000);
        console.log("Server Connection Lost.");
    }

    function AttemptReconnect(){
        console.log("Attempting auto reconnect...");
        if(BCFunctions.password == ""){
            console.log("Password not set, not attempting reconnect");
            return;
        }
        if(ElementValue("InputPassword") == "" && BCFunctions.password != "") ElementValue("InputPassword",BCFunctions.password);
        if(ServerIsConnected){
            RelogSend();
            console.log("Auto reconnect success!");
            if(BCFunctions.relockRoom){setTimeout(RelockRoom,15000);}
            return;
        }
        else{
           setTimeout(AttemptReconnect, 5000);
        }
    }

    function RelockRoom(){
        document.getElementById("InputChat").style.display = "none";
        document.getElementById("TextAreaChatLog").style.display = "none";
        CommonSetScreen("Online", "ChatAdmin");
        ChatAdminLocked = true;
        ChatAdminPrivate = false;
        ChatAdminUpdateRoom();
        setTimeout(function(){if(CurrentScreen=="ChatAdmin"){
            console.log("Returning to main chat screen");
            CommonSetScreen("Online", "ChatRoom");
        }},5000);
    }

    var OldChatRoomSendChat = ChatRoomSendChat;
    ChatRoomSendChat = function(){
        var msg = ElementValue("InputChat").trim();
        var calledFunc = false;
        if (msg != "") {
            var m = msg.toLowerCase().trim();
            var args = m.split(" ");
            if (m.indexOf("!kinkydice") == 0) {
                BCFunctions.RollTheKinkyDice(Player.Name);

                calledFunc = true;
            }
            else if (m.indexOf("!deviousdice") == 0) {
                HandleDeviousDiceCommand(args, Player.Name, Player.MemberNumber);

                calledFunc = true;
            }
            else if(m.indexOf("!strictpetsuit") == 0){
                if(args.length == 2){ BCFunctions.BindWithStrictPetSuit(args[1]);}
                else{
                    BCFunctions.BindWithStrictPetSuit(args[1],args[2]);
                }

                calledFunc = true;
            }
            else if(m.indexOf("!bindwithrope") == 0){
                if(args.length == 2){ BCFunctions.BindWithRope(args[1]);}
                else{
                    BCFunctions.BindWithRope(args[1],args[2]);
                }

                calledFunc = true;
            }
            else if(m.indexOf("!mummifywithtape") == 0){
                if(args.length == 2){ BCFunctions.MummifyWithTape(args[1]);}
                else{
                    BCFunctions.MummifyWithTape(args[1],args[2]);
                }

                calledFunc = true;
            }
            else if(m.indexOf("!safeword") == 0){
                if(args.length == 1){ BCFunctions.SafeWord(false);}
                else{
                    BCFunctions.SafeWord(args[1] == "true");
                }

                calledFunc = true;
            }
            else if(m.indexOf("!toggletrap") == 0){
                if(args.length == 1){ BCFunctions.ToggleTrap();}

                calledFunc = true;
            }
            else if(m.indexOf("!petbed") == 0){
                if(args.length == 2){ BCFunctions.PetBed(args[1]);}
                else{
                    BCFunctions.PetBed(args[1],args[2]);
                }

                calledFunc = true;
            }
            else if(m.indexOf("!suzubed") == 0){
                if(args.length == 2){ BCFunctions.SuzuBed(args[1]);}

                calledFunc = true;
            }
            else if(m.indexOf("!cushion") == 0){
                if(args.length == 1){ BCFunctions.SitOnCushion(Player.Name, "#1F1E33");}

                calledFunc = true;
            }
            else if(m.indexOf("!garble") == 0){
                if(args.length >= 3){
                    if(!isNaN(parseInt(args[1]))){
                        var gagLevel = parseInt(args[1]);
                        var msgToGarble = "";
                        for(var i = 2; i<args.length; i++){
                            msgToGarble += args[i]+" ";
                        }
                        var garbledMsg = SpeechGarbleByGagLevel(gagLevel, msgToGarble, false);

                        if(garbledMsg!=null){
                            ServerSend("ChatRoomChat", { Content: garbledMsg, Type: "Chat" });
                        }
                    }
                    calledFunc = true;
                }
            }
        }

        if(calledFunc){
            // Clear the chat message box
            ElementValue("InputChat", "");
            return;
        }

        // Call the old func if we did nothing
        OldChatRoomSendChat();
    }

    // Changes Infiltration to keep Cosplay Items
    /*
    CharacterAppearanceFullRandom = function(C, ClothOnly=false, StripAppearance=true){
        // Clear the current appearance
        if(StripAppearance){
        for (let A = C.Appearance.length - 1; A >= 0; A--)
            if (C.Appearance[A].Asset.Group.Category == "Appearance")
                if (!ClothOnly || (C.Appearance[A].Asset.Group.AllowNone)) {
                    C.Appearance.splice(A, 1);
                }
        }
        // For each item group (non default items only show at a 20% rate, if it can occasionally happen)
        for (let A = 0; A < AssetGroup.length; A++)
            if ((AssetGroup[A].Category == "Appearance") && (AssetGroup[A].IsDefault || (AssetGroup[A].Random && Math.random() < 0.2) || CharacterAppearanceRequired(C, AssetGroup[A].Name)) && (!CharacterAppearanceMustHide(C, AssetGroup[A].Name) || !AssetGroup[A].AllowNone) && (CharacterAppearanceGetCurrentValue(C, AssetGroup[A].Name, "Name") == "None")) {

                // Get the parent size
                var ParentSize = "";
                if (AssetGroup[A].ParentSize != "")
                    ParentSize = CharacterAppearanceGetCurrentValue(C, AssetGroup[A].ParentSize, "Name");

                // Check for a parent
                var R = [];
                for (let I = 0; I < CharacterAppearanceAssets.length; I++)
                    if ((CharacterAppearanceAssets[I].Group.Name == AssetGroup[A].Name) && (CharacterAppearanceAssets[I].ParentItem != null) && ((ParentSize == "") || (CharacterAppearanceAssets[I].Name == ParentSize)))
                        for (let P = 0; P < C.Appearance.length; P++)
                            if (C.Appearance[P].Asset.Name == CharacterAppearanceAssets[I].ParentItem)
                                R.push(CharacterAppearanceAssets[I]);

                // Since there was no parent, get all the possible items
                if (R.length == 0)
                    for (let I = 0; I < CharacterAppearanceAssets.length; I++)
                        if ((CharacterAppearanceAssets[I].Group.Name == AssetGroup[A].Name) && (CharacterAppearanceAssets[I].ParentItem == null) && ((ParentSize == "") || (CharacterAppearanceAssets[I].Name == ParentSize)))
                            R.push(CharacterAppearanceAssets[I]);

                // Picks a random item and color and add it
                if (R.length > 0) {
                    var SelectedAsset = InventoryGetRandom(C, AssetGroup[A].Name, R);
                    var SelectedColor = SelectedAsset.Group.ColorSchema[Math.floor(Math.random() * SelectedAsset.Group.ColorSchema.length)];
                    if ((SelectedAsset.Group.ColorSchema[0] == "Default") && (Math.random() < 0.5)) SelectedColor = "Default";
                    if (SelectedAsset.Group.InheritColor != null) SelectedColor = "Default";
                    else if (SelectedAsset.Group.ParentColor != "")
                        if (CharacterAppearanceGetCurrentValue(C, SelectedAsset.Group.ParentColor, "Color") != "None")
                            SelectedColor = CharacterAppearanceGetCurrentValue(C, SelectedAsset.Group.ParentColor, "Color");
                    // Rare chance of keeping eyes of a different color
                    if (SelectedAsset.Group.Name == "Eyes2" && Math.random() < 0.995)
                        for (let A = 0; A < C.Appearance.length; A++)
                            if (C.Appearance[A].Asset.Group.Name == "Eyes")
                                SelectedColor = C.Appearance[A].Color;
                    if (SelectedColor == "Default" && SelectedAsset.DefaultColor != null) SelectedColor = SelectedAsset.DefaultColor;
                    var NA = {
                        Asset: SelectedAsset,
                        Color: SelectedColor
                    };
                    C.Appearance.push(NA);
                }

            }

        // Refreshes the character
        CharacterRefresh(C, false);
    }
    */

    /*
    InfiltrationRandomClothes = function() {
        CharacterNaked(Player);
        CharacterAppearanceFullRandom(Player, true, false);
        CharacterRelease(Player);
        InventoryRemove(Player, "ItemHands");
        PandoraClothes = "Random";
    }
*/

    // via https://stackoverflow.com/questions/43566019/how-to-choose-a-weighted-random-array-element-in-javascript/55671924
    // credit user: "Redwolf Programs"
    function weighted_random(options) {
        var i;

        var weights = [];

        for (i = 0; i < options.length; i++)
            weights[i] = options[i].weight + (weights[i - 1] || 0);

        var random = Math.random() * weights[weights.length - 1];

        for (i = 0; i < weights.length; i++)
            if (weights[i] > random)
                break;

        return options[i];
    }

    console.log("Bondage Club Functions written by Suzuki (37969) as a fun side project. Play safe!~");

})();