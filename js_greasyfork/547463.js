// ==UserScript==
// @name         FlatMMO+ Pets
// @namespace    com.dounford.flatmmo.piggie
// @version      1.5.0.4
// @description  Adds custom Pets to the game
// @author       Dounford
// @license      MIT
// @match        *://flatmmo.com/play.php*
// @grant        none
// @require      https://update.greasyfork.org/scripts/544062/FlatMMOPlus.js
// @downloadURL https://update.greasyfork.org/scripts/547463/FlatMMO%2B%20Pets.user.js
// @updateURL https://update.greasyfork.org/scripts/547463/FlatMMO%2B%20Pets.meta.js
// ==/UserScript==
 
(function() {
    'use strict';

 
    class pets extends FlatMMOPlusPlugin {
        constructor() {
            super("petsBuddy", {
                about: {
                    name: "FlatMMO+ Pets",
                    version: "1.5.0.4",
                    author: "Dounford",
                    description: "Adds custom Pets to the game"
                },
                config: [
                    {
						id: "showPet",
						label: "Show Pet",
						type: "boolean",
						default: true
					},
                    {
                        id: "pet",
                        label: "Pet",
                        type: "select",
                        options: [
                            {
                                value: "pig",
                                label: "Pig"
                            },
                            {
                                value: "blackSlimeCat",
                                label: "Black Slime Cat"
                            },
                            {
                                value: "calicoSlimeCat",
                                label: "Calico Slime Cat"
                            },
                            {
                                value: "whiteSlimeCat",
                                label: "White Slime Cat"
                            },
                            {
                                value: "pumpkin",
                                label: "Pumpking"
                            },
                            {
                                value: "pizza",
                                label: "Pizza"
                            },
                            {
                                value: "capybara",
                                label: "Capybara"
                            },
                            {
                                value: "beer",
                                label: "Beer"
                            },
                            {
                                value: "gingerbreadMan",
                                label: "Gingerbread Man"
                            },
                            {
                                value: "snowman",
                                label: "Snowman"
                            },
                            {
                                value: "reindeer",
                                label: "Reindeer"
                            },
                        ]
                    },
                    {
                        id: "randomize",
                        label: "Randomize Selected Pet",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "event",
                        label: "Event Skin",
                        type: "select",
                        options: [
                            {
                                value: "",
                                label: "None"
                            },
                            {
                                value: "halloween",
                                label: "Halloween"
                            },
                            {
                                value: "christmas",
                                label: "Christmas"
                            }
                        ]
                    }
                ]
            });

            this.currentPet = "pig";
            this.currentAction = "stand";
            this.pets = {}
        }

        onConfigsChanged() {
            this.changePet(this.config["pet"]);
        }
        
        onPaint() {
            if(this.config["showPet"] === false) {return}
            if(FlatMMOPlus.loggedIn === false) {return}
            if(this.pets[this.currentPet].hasOwnProperty(this.currentAction)) {
                //Draw pig
                if (players[Globals.local_username].face_left) {
                    ctx.save();
                    ctx.scale(-1, 1);
                    ctx.drawImage(this.pets[this.currentPet][this.currentAction].get_frame(), -(players[Globals.local_username].client_x + 160), players[Globals.local_username].client_y - 25, 96, 96);
                    ctx.restore();
                } else {
                    ctx.drawImage(this.pets[this.currentPet][this.currentAction].get_frame(), players[Globals.local_username].client_x - 96, players[Globals.local_username].client_y - 25, 96, 96);
                }
                if(this.config.randomize && Math.random() < 0.0000046296296296296296) {
                    this.randomizePet();
                }
            } else {
                this.currentAction = "stand";
            }
        }
 
        
        onLogin() {
            this.addPets();
        }

        onActionChanged() {
            if(!this.pets.hasOwnProperty("pig")) {return};
            if(this.pets[this.currentPet].hasOwnProperty("stand_" + this.config.event)) {
                if(this.pets[this.currentPet].hasOwnProperty(FlatMMOPlus.currentAction + "_" + this.config.event)) {
                    this.currentAction = FlatMMOPlus.currentAction + "_" + this.config.event;
                } else {
                    this.currentAction = "stand_" + this.config.event;
                }
            } else if(this.pets[this.currentPet].hasOwnProperty(FlatMMOPlus.currentAction)) {
                this.currentAction = FlatMMOPlus.currentAction;
            }
        }
        
        changePet(pet) {
            this.currentPet = pet;
            this.currentAction = "stand";
            this.onActionChanged();
        }

        randomizePet() {
            const petArray = Object.keys(this.pets);
            const newIndex = Math.floor(Math.random() * petArray.length);
            this.changePet(petArray[newIndex])
        }

        addPets() {
            this.pets.pig = {};
            this.registerAnimation("pig","stand","2",50);
            this.registerAnimation("pig","walk","4",10);
            this.registerAnimation("pig","attack","2",20);
            this.registerAnimation("pig","fishing_net","2",25);
            this.registerAnimation("pig","fishing_rod","2",25);
            this.registerAnimation("pig","harpoon","2",25);
            this.registerAnimation("pig","mine_rock","2",15);
            this.registerAnimation("pig","chop_tree","2",20);
            //halloween
            this.registerAnimation("pig","stand_halloween","2",50);
            //christmas
            this.registerAnimation("pig","stand_christmas","2",50);
            this.registerAnimation("pig","walk_christmas","4",10);
            this.registerAnimation("pig","attack_christmas","2",20);
            this.registerAnimation("pig","fishing_net_christmas","2",25);
            this.registerAnimation("pig","fishing_rod_christmas","2",25);
            this.registerAnimation("pig","harpoon_christmas","2",25);
            this.registerAnimation("pig","mine_rock_christmas","2",15);
            this.registerAnimation("pig","chop_tree_christmas","2",20);
            
            this.pets.beer = {};
            this.registerAnimation("beer","stand","2",50);
            this.registerAnimation("beer","stand_halloween","2",50);
            this.registerAnimation("beer","stand_christmas","2",50);
            
            this.pets.capybara = {};
            this.registerAnimation("capybara","stand","2",50);
            this.registerAnimation("capybara","stand_halloween","2",50);
            this.registerAnimation("capybara","stand_christmas","2",50);
            
            this.pets.blackSlimeCat = {};
            this.registerAnimation("blackSlimeCat","stand","2",50);
            this.registerAnimation("blackSlimeCat","walk","2",10);
            this.registerAnimation("blackSlimeCat","attack","2",20);
            this.registerAnimation("blackSlimeCat","stand_christmas","2",50);
            this.registerAnimation("blackSlimeCat","walk_christmas","2",10);
            this.registerAnimation("blackSlimeCat","attack_christmas","2",20);
            
            this.pets.calicoSlimeCat = {};
            this.registerAnimation("calicoSlimeCat","stand","2",50);
            this.registerAnimation("calicoSlimeCat","walk","2",10);
            this.registerAnimation("calicoSlimeCat","attack","2",20);
            this.registerAnimation("calicoSlimeCat","stand_christmas","2",50);
            this.registerAnimation("calicoSlimeCat","walk_christmas","2",10);
            this.registerAnimation("calicoSlimeCat","attack_christmas","2",20);

            this.pets.whiteSlimeCat = {};
            this.registerAnimation("whiteSlimeCat","stand","2",50);
            this.registerAnimation("whiteSlimeCat","walk","2",10);
            this.registerAnimation("whiteSlimeCat","attack","2",20);
            this.registerAnimation("whiteSlimeCat","stand_christmas","2",50);
            this.registerAnimation("whiteSlimeCat","walk_christmas","2",10);
            this.registerAnimation("whiteSlimeCat","attack_christmas","2",20);

            this.pets.pizza = {};
            this.registerAnimation("pizza","stand","2",50);
            this.registerAnimation("pizza","stand_halloween","2",50);
            this.registerAnimation("pizza","stand_christmas","2",50);

            this.pets.pumpkin = {};
            this.registerAnimation("pumpkin","stand","2",50);
            this.registerAnimation("pumpkin","stand_christmas","2",50);
            
            this.pets.gingerbreadMan = {};
            this.registerAnimation("gingerbreadMan","stand","2",50);
            
            this.pets.snowman = {};
            this.registerAnimation("snowman","stand","2",50);
            
            this.pets.reindeer = {};
            this.registerAnimation("reindeer","stand","2",50);
        }

        registerAnimation(pet, animation, frames, speed) {
            const animations = [];
            for (let i = 0; i < frames; i++) {
                animations.push(`https://raw.githubusercontent.com/Dounford-Felipe/FlatMMO-Scripts/refs/heads/main/pets/images/${pet}/${animation}${i}.png`);
            }
            this.pets[pet][animation] = new AnimationSheetPlus(pet + animation, frames, speed, animations);
        }
    }
 
    const plugin = new pets();
    FlatMMOPlus.registerPlugin(plugin);
 
})();