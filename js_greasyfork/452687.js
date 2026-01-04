// ==UserScript==
// @name         GPX+: Shelter/Lab Grabber
// @description  Gets Pokémon from the shelter/lab; also identifies Pokémon Eggs in parties and on interact pages
// @version      1.7.18
// @license      MIT
// @match        *gpx.plus*
// @match        *gpx.plus/*
// @match        *static.gpx.plus/*
// @match        *tesseract.projectnaptha.com/*
// @grant        none
// @namespace Squornshellous Beta
// @downloadURL https://update.greasyfork.org/scripts/452687/GPX%2B%3A%20ShelterLab%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/452687/GPX%2B%3A%20ShelterLab%20Grabber.meta.js
// ==/UserScript==

window.pokemon=[
    {
        evos:{
            "Bulbasaur":{
                type:["Grass","Poison"],
                color:"Green",
                from:null,
                con:true
            },
            "Bulbasaur [Shedinja]":{
                type:["Grass","Poison"],
                color:"Green",
                from:"Bulbasaur",
                con:false
            },
            "Ivysaur":{
                type:["Grass","Poison"],
                color:"Green",
                from:"Bulbasaur",
                con:true
            },
            "Venusaur":{
                type:["Grass","Poison"],
                color:"Green",
                from:"Ivysaur",
                con:true
            },
            "Mega Venusaur [Mega]":{
                type:["Grass","Poison"],
                color:"Green",
                from:"Venusaur",
                con:false
            },
            "Gmax Venusaur [Gmax]":{
                type:["Grass","Poison"],
                color:"Green",
                from:"Venusaur",
                con:true
            }
        },
        egg:"A turquoise egg with dark spots on it. Something seems vaguely familiar about it....",
        steps:"5120"
    },{
        evos:{
            "Charmander":{
                type:["Fire"],
                color:"Red",
                from:null,
                con:true
            },
            "Charmander [Cubone]":{
                type:["Fire"],
                color:"Red",
                from:"Charmander",
                con:false
            },
            "Charmeleon":{
                type:["Fire"],
                color:"Red",
                from:"Charmander",
                con:true
            },
            "Charizard":{
                type:["Fire","Flying"],
                color:"Red",
                from:"Charmeleon",
                con:true
            },
            "Mega Charizard X [Mega]":{
                type:["Dragon","Fire"],
                color:"Black",
                from:"Charizard",
                con:false
            },
            "Mega Charizard Y [Mega]":{
                type:["Fire","Flying"],
                color:"Red",
                from:"Charizard",
                con:false
            },
            "Gmax Charizard [Gmax]":{
                type:["Fire","Flying"],
                color:"Red",
                from:"Charizard",
                con:false
            }
        },
        egg:"An orange egg that radiates heat. Something seems vaguely familiar about it....",
        steps:"5120"
    },{
        evos:{
            "Squirtle":{
                type:["Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Squirtle [Yamask]":{
                type:["Water"],
                color:"Blue",
                from:"Squirtle",
                con:false
            },
            "Wartortle":{
                type:["Water"],
                color:"Blue",
                from:"Squirtle",
                con:true
            },
            "Blastoise":{
                type:["Water"],
                color:"Blue",
                from:"Wartortle",
                con:true,
                minLv:36
            },
            "Mega Blastoise [Mega]":{
                type:["Water"],
                color:"Blue",
                from:"Blastoise",
                con:false
            },
            "Gmax Blastoise [Gmax]":{
                type:["Water"],
                color:"Blue",
                from:"Blastoise",
                con:false
            }
        },
        egg:"A blue egg that is surprisingly tough. Something seems vaguely familiar about it....",
        steps:"5120"
    },{
        evos:{
            "Caterpie":{
                type:["Bug"],
                color:"Green",
                from:null,
                con:true
            },
            "Metapod":{
                type:["Bug"],
                color:"Green",
                from:"Caterpie",
                con:true
            },
            "Butterfree":{
                type:["Bug","Flying"],
                color:"White",
                from:"Metapod",
                con:true
            },
            "Gmax Butterfree [Gmax]":{
                type:["Bug","Flying"],
                color:"White",
                from:"Butterfree",
                con:false
            }
        },
        egg:"A green and orange egg. Said to be the egg of some sort of bug.",
        steps:"3840"
    },{
        evos:{
            "Weedle":{
                type:["Bug","Poison"],
                color:"Brown",
                from:null,
                con:true
            },
            "Kakuna":{
                type:["Bug","Poison"],
                color:"Yellow",
                from:"Weedle",
                con:true
            },
            "Beedrill":{
                type:["Bug","Poison"],
                color:"Yellow",
                from:"Kakuna",
                con:true
            },
            "Mega Beedrill [Mega]":{
                type:["Bug","Poison"],
                color:"Yellow",
                from:"Beedrill",
                con:false
            }
        },
        egg:"A tan egg with a red spot. Said to be the egg of some sort of bug.",
        steps:"3840"
    },{
        evos:{
            "Pidgey":{
                type:["Flying","Normal"],
                color:"Brown",
                from:null,
                con:true
            },
            "Pidgeotto":{
                type:["Flying","Normal"],
                color:"Brown",
                from:"Pidgey",
                con:true
            },
            "Pidgeot":{
                type:["Flying","Normal"],
                color:"Brown",
                from:"Pidgeotto",
                con:true
            },
            "Mega Pidgeot [Mega]":{
                type:["Flying","Normal"],
                color:"Brown",
                from:"Pidgeot",
                con:false
            }
        },
        egg:"A brown and tan egg that has a very interesting pattern on it. Said to be the egg of a common bird.",
        steps:"3840"
    },{
        evos:{
            "Alolan Rattata":{
                type:["Dark","Normal"],
                color:"Black",
                from:null,
                con:true
            },
            "Alolan Raticate":{
                type:["Dark","Normal"],
                color:"Black",
                from:"Alolan Rattata",
                con:true
            }
        },
        egg:"An egg that's coloured dark gray with a ragged, tan blotch on it. Sometimes shakes a bit if it's touched.",
        steps:"3840"
    },{
        evos:{
            "Rattata":{
                type:["Normal"],
                color:"Purple",
                from:null,
                con:true
            },
            "Raticate":{
                type:["Normal"],
                color:"Brown",
                from:"Rattata",
                con:true
            }
        },
        egg:"An egg that is coloured purple, tan, and brown. Sometimes shakes a bit if it's touched.",
        steps:"3840"
    },{
        evos:{
            "Spearow":{
                type:["Flying","Normal"],
                color:"Brown",
                from:null,
                con:true
            },
            "Fearow":{
                type:["Flying","Normal"],
                color:"Brown",
                from:"Spearow",
                con:true
            }
        },
        egg:"A brown egg with a peculiar pink beak-like marking on it. Said to be the egg of a common bird.",
        steps:"3840"
    },{
        evos:{
            "Ekans":{
                type:["Poison"],
                color:"Purple",
                from:null,
                con:true
            },
            "Arbok":{
                type:["Poison"],
                color:"Purple",
                from:"Ekans",
                con:true
            }
        },
        egg:"A purple egg with odd markings. Sometimes makes a rattle-like noise if it's touched.",
        steps:"5120"
    },{
        evos:{
            "Pichu":{
                type:["Electric"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Pikachu":{
                type:["Electric"],
                color:"Yellow",
                from:"Pichu",
                con:false
            },
            "Pikachu [Ph.D.]":{
                type:["Electric"],
                color:"Yellow",
                from:"Pikachu",
                con:false
            },
            "Pikachu [Libre]":{
                type:["Electric"],
                color:"Yellow",
                from:"Pikachu",
                con:false
            },
            "Pikachu [Pop Star]":{
                type:["Electric"],
                color:"Yellow",
                from:"Pikachu",
                con:false
            },
            "Pikachu [Rock Star]":{
                type:["Electric"],
                color:"Yellow",
                from:"Pikachu",
                con:false
            },
            "Pikachu [Belle]":{
                type:["Electric"],
                color:"Yellow",
                from:"Pikachu",
                con:false
            },
            "Pikachu [Original Cap]":{
                type:["Electric"],
                color:"Yellow",
                from:"Pikachu",
                con:false
            },
            "Pikachu [Hoenn Cap]":{
                type:["Electric"],
                color:"Yellow",
                from:"Pikachu",
                con:false
            },
            "Pikachu [Sinnoh Cap]":{
                type:["Electric"],
                color:"Yellow",
                from:"Pikachu",
                con:false
            },
            "Pikachu [Unova Cap]":{
                type:["Electric"],
                color:"Yellow",
                from:"Pikachu",
                con:false
            },
            "Pikachu [Kalos Cap]":{
                type:["Electric"],
                color:"Yellow",
                from:"Pikachu",
                con:false
            },
            "Pikachu [Alola Cap]":{
                type:["Electric"],
                color:"Yellow",
                from:"Pikachu",
                con:false
            },
            "Pikachu [Partner Cap]":{
                type:["Electric"],
                color:"Yellow",
                from:"Pikachu",
                con:false
            },
            "Detective Pikachu":{
                type:["Electric"],
                color:"Yellow",
                from:"Pikachu",
                con:false
            },
            "Pikachu [Mimikyu]":{
                type:["Electric"],
                color:"Yellow",
                from:"Pikachu",
                con:false
            },
            "Alolan Raichu":{
                type:["Electric","Psychic"],
                color:"Yellow",
                from:"Pikachu",
                con:false
            },
            "Raichu":{
                type:["Electric"],
                color:"Yellow",
                from:"Pikachu",
                con:false
            },
            "Gmax Pikachu [Gmax]":{
                type:["Electric"],
                color:"Yellow",
                from:"Pikachu",
                con:false
            },
        },
        egg:"A yellow and black egg with two small pink spots. Touching it sometimes shocks you.",
        steps:"2560"
    },{
        evos:{
            "Sandshrew":{
                type:["Ground"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Sandslash":{
                type:["Ground"],
                color:"Yellow",
                from:"Sandshrew",
                con:true
            }
        },
        egg:"A yellow and white egg. The yellow part has a brick-like pattern on it. It's covered in sand.",
        steps:"5120"
    },{
        evos:{
            "Alolan Sandshrew":{
                type:["Ice","Steel"],
                color:"White",
                from:null,
                con:true
            },
            "Alolan Sandslash":{
                type:["Ice","Steel"],
                color:"White",
                from:"Alolan Sandshrew",
                con:false
            }
        },
        egg:"A white egg with an ice blue brick-like pattern on it. It reminds you of an igloo.",
        steps:"5120"
    },{
        evos:{
            "Nidoran F":{
                type:["Poison"],
                color:"Blue",
                from:null,
                con:true
            },
            "Nidorina":{
                type:["Poison"],
                color:"Blue",
                from:"Nidoran F",
                con:false
            },
            "Nidoqueen":{
                type:["Ground","Poison"],
                color:"Blue",
                from:"Nidorina",
                con:false
            }
        },
        egg:"A blueish-purple egg. It's supposed to be part of a pair.",
        steps:"5120"
    },{
        evos:{
            "Nidoran M":{
                type:["Poison"],
                color:"Purple",
                from:null,
                con:true
            },
            "Nidorino":{
                type:["Poison"],
                color:"Purple",
                from:"Nidoran M",
                con:false
            },
            "Nidoking":{
                type:["Ground","Poison"],
                color:"Purple",
                from:"Nidorino",
                con:false
            }
        },
        egg:"A pinkish-purple egg. It's supposed to be part of a pair.",
        steps:"5120"
    },{
        evos:{
            "Cleffa":{
                type:["Fairy"],
                color:"Pink",
                from:null,
                con:true
            },
            "Clefairy":{
                type:["Fairy"],
                color:"Pink",
                from:"Cleffa",
                con:false
            },
            "Clefable":{
                type:["Fairy"],
                color:"Pink",
                from:"Clefairy",
                con:false
            }
        },
        egg:"An egg that is a pink flesh-like colour. The marking on top of it looks like a little swirl.",
        steps:"2560"
    },{
        evos:{
            "Vulpix":{
                type:["Fire"],
                color:"Brown",
                from:null,
                con:true
            },
            "Ninetales":{
                type:["Fire"],
                color:"Yellow",
                from:"Vulpix",
                con:false
            }
        },
        egg:"An egg that has a dark flesh-like colour. The top of it has an odd dark orange pattern. It radiates heat.",
        steps:"5120"
    },{
        evos:{
            "Alolan Vulpix":{
                type:["Ice"],
                color:"White",
                from:null,
                con:true
            },
            "Alolan Ninetales":{
                type:["Fairy","Ice"],
                color:"White",
                from:"Alolan Vulpix",
                con:false
            }
        },
        egg:"A light blue egg with an elegant, snowy white pattern adorning it. It's cold to the touch.",
        steps:"5120"
    },{
        evos:{
            "Igglybuff":{
                type:["Fairy","Normal"],
                color:"Pink",
                from:null,
                con:true
            },
            "Jigglypuff":{
                type:["Fairy","Normal"],
                color:"Pink",
                from:"Igglybuff",
                con:false
            },
            "Wigglytuff":{
                type:["Fairy","Normal"],
                color:"Pink",
                from:"Jigglypuff",
                con:false
            }
        },
        egg:"A pink egg. The marking on top of it looks like a little swirl. It bounces around a bit sometimes.",
        steps:"2560"
    },{
        evos:{
            "Zubat":{
                type:["Flying","Poison"],
                color:"Purple",
                from:null,
                con:true
            },
            "Golbat":{
                type:["Flying","Poison"],
                color:"Purple",
                from:"Zubat",
                con:true
            },
            "Crobat":{
                type:["Flying","Poison"],
                color:"Purple",
                from:"Golbat",
                con:false
            }
        },
        egg:"A blue and purple egg. Sometimes makes a quiet screech-like noise if it's touched.",
        steps:"3840"
    },{
        evos:{
            "Oddish":{
                type:["Grass","Poison"],
                color:"Blue",
                from:null,
                con:true
            },
            "Gloom":{
                type:["Grass","Poison"],
                color:"Blue",
                from:"Oddish",
                con:true
            },
            "Vileplume":{
                type:["Grass","Poison"],
                color:"Red",
                from:"Gloom",
                con:false
            },
            "Bellossom":{
                type:["Grass"],
                color:"Green",
                from:"Gloom",
                con:false
            }
        },
        egg:"An egg that's a dull dark blue colour. The two red spots on it almost look like eyes. It's supposed to be the egg of a plant.",
        steps:"5120"
    },{
        evos:{
            "Paras":{
                type:["Bug","Grass"],
                color:"Red",
                from:null,
                con:true
            },
            "Parasect":{
                type:["Bug","Grass"],
                color:"Red",
                from:"Paras",
                con:true
            }
        },
        egg:"An orange egg. The two white spots on it almost look like eyes. Said to be the egg of a bug.",
        steps:"5120"
    },{
        evos:{
            "Venonat":{
                type:["Bug","Poison"],
                color:"Purple",
                from:null,
                con:true
            },
            "Venomoth":{
                type:["Bug","Poison"],
                color:"Purple",
                from:"Venonat",
                con:true
            }
        },
        egg:"A dark purple egg. It has precisely three red spots on it. Said to be the egg of a bug.",
        steps:"5120"
    },{
        evos:{
            "Diglett":{
                type:["Ground"],
                color:"Brown",
                from:null,
                con:true
            },
            "Dugtrio":{
                type:["Ground"],
                color:"Brown",
                from:"Diglett",
                con:true
            }
        },
        egg:"A brown egg with a red spot on it. Sometimes struggles around like it's trying to get underground.",
        steps:"5120"
    },{
        evos:{
            "Alolan Diglett":{
                type:["Ground","Steel"],
                color:"Brown",
                from:null,
                con:true
            },
            "Alolan Dugtrio":{
                type:["Ground","Steel"],
                color:"Brown",
                from:"Alolan Diglett",
                con:true
            }
        },
        egg:"A brown egg with a bright tuft of hair. Sometimes struggles around like it's trying to get underground.",
        steps:"5120"
    },{
        evos:{
            "Meowth":{
                type:["Normal"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Persian":{
                type:["Normal"],
                color:"Yellow",
                from:"Meowth",
                con:true
            },
            "Gmax Meowth [Gmax]":{
                type:["Normal"],
                color:"Yellow",
                from:"Meowth",
                con:false
            }
        },
        egg:"A light yellow egg. The bolder yellow spot on top of it is shiny like a coin.",
        steps:"5120"
    },{
        evos:{
            "Alolan Meowth":{
                type:["Dark"],
                color:"Blue",
                from:null,
                con:true
            },
            "Alolan Persian":{
                type:["Dark"],
                color:"Blue",
                from:"Alolan Meowth",
                con:true
            }
        },
        egg:"A light grey egg with odd black markings. The bold yellow spot on top of it shines brightly in the moonlight.",
        steps:"5120"
    },{
        evos:{
            "Galarian Meowth":{
                type:["Steel"],
                color:"Brown",
                from:null,
                con:true
            },
            "Perrserker":{
                type:["Steel"],
                color:"Brown",
                from:"Galarian Meowth",
                con:true
            }
        },
        egg:"A light brown egg. The bold dark spot on top of it shines like metal.",
        steps:"5120"
    },{
        evos:{
            "Psyduck":{
                type:["Water"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Golduck":{
                type:["Water"],
                color:"Blue",
                from:"Psyduck",
                con:true
            }
        },
        egg:"A yellow egg. It has an oddly-shaped tan blotch on it that resembles a duck's bill. The egg is slightly damp.",
        steps:"5120"
    },{
        evos:{
            "Mankey":{
                type:["Fighting"],
                color:"Brown",
                from:null,
                con:true
            },
            "Primeape":{
                type:["Fighting"],
                color:"Brown",
                from:"Mankey",
                con:true
            },
            "Annihilape":{
                type:["Fighting","Ghost"],
                color:"Gray",
                from:"Primeape",
                con:false
            }
        },
        egg:"An egg that almost looks white. It has a red spot and actually looks a bit angry....",
        steps:"5120"
    },{
        evos:{
            "Growlithe":{
                type:["Fire"],
                color:"Brown",
                from:null,
                con:true
            },
            "Arcanine":{
                type:["Fire"],
                color:"Brown",
                from:"Growlithe",
                con:false
            }
        },
        egg:"An egg that is coloured white, orange, and tan. It radiates heat.",
        steps:"5120"
    },{
        evos:{
            "Hisuian Growlithe":{
                type:["Fire","Rock"],
                color:"Brown",
                from:null,
                con:true
            },
            "Hisuian Arcanine":{
                type:["Fire","Rock"],
                color:"Brown",
                from:"Hisuian Growlithe",
                con:false
            }
        },
        egg:"An egg that is coloured white, red, and tan. It radiates heat and is surprisingly tough.",
        steps:"5120"
    },{
        evos:{
            "Poliwag":{
                type:["Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Poliwhirl":{
                type:["Water"],
                color:"Blue",
                from:"Poliwag",
                con:true
            },
            "Poliwrath":{
                type:["Fighting","Water"],
                color:"Blue",
                from:"Poliwhirl",
                con:false
            },
            "Politoed":{
                type:["Water"],
                color:"Green",
                from:"Poliwhirl",
                con:false
            }
        },
        egg:"A blueish-purple egg with a big white spot. There's a spiral pattern on the spot. The egg is slightly damp.",
        steps:"5120"
    },{
        evos:{
            "Abra":{
                type:["Psychic"],
                color:"Brown",
                from:null,
                con:true
            },
            "Kadabra":{
                type:["Psychic"],
                color:"Brown",
                from:"Abra",
                con:true
            },
            "Alakazam":{
                type:["Psychic"],
                color:"Brown",
                from:"Kadabra",
                con:false
            },
            "Mega Alakazam [Mega]":{
                type:["Psychic"],
                color:"Brown",
                from:"Alakazam",
                con:false
            }
        },
        egg:"A yellow egg with a tan spot. The moment you look away from it, it moves to another space.",
        steps:"5120"
    },{
        evos:{
            "Machop":{
                type:["Fighting"],
                color:"Gray",
                from:null,
                con:true
            },
            "Machoke":{
                type:["Fighting"],
                color:"Gray",
                from:"Machop",
                con:true
            },
            "Machamp":{
                type:["Fighting"],
                color:"Gray",
                from:"Machoke",
                con:false
            },
            "Gmax Machamp [Gmax]":{
                type:["Fighting"],
                color:"Gray",
                from:"Machamp",
                con:false
            }
        },
        egg:"A dull teal egg. It has an odd tan pattern on the top of it. It's a bit on the tough side.",
        steps:"5120"
    },{
        evos:{
            "Bellsprout":{
                type:["Grass","Poison"],
                color:"Green",
                from:null,
                con:true
            },
            "Weepinbell":{
                type:["Grass","Poison"],
                color:"Green",
                from:"Bellsprout",
                con:true
            },
            "Victreebel":{
                type:["Grass","Poison"],
                color:"Green",
                from:"Weepinbell",
                con:false
            }
        },
        egg:"A pale yellow egg. It has two dark spots and a bigger pink spot. It's supposed to be the egg of a plant.",
        steps:"5120"
    },{
        evos:{
            "Tentacool":{
                type:["Poison","Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Tentacruel":{
                type:["Poison","Water"],
                color:"Blue",
                from:"Tentacool",
                con:true
            }
        },
        egg:"A bold blue egg with three red spots. The red spots are shiny like gems. The egg is slightly damp.",
        steps:"5120"
    },{
        evos:{
            "Geodude":{
                type:["Ground","Rock"],
                color:"Brown",
                from:null,
                con:true
            },
            "Graveler":{
                type:["Ground","Rock"],
                color:"Brown",
                from:"Geodude",
                con:true
            },
            "Golem":{
                type:["Ground","Rock"],
                color:"Brown",
                from:"Graveler",
                con:false
            }
        },
        egg:"A rough grey egg. It could easily be mistaken for a rock.",
        steps:"3840"
    },{
        evos:{
            "Alolan Geodude":{
                type:["Electric","Rock"],
                color:"Gray",
                from:null,
                con:true
            },
            "Alolan Graveler":{
                type:["Electric","Rock"],
                color:"Gray",
                from:"Alolan Geodude",
                con:true
            },
            "Alolan Golem":{
                type:["Electric","Rock"],
                color:"Gray",
                from:"Alolan Graveler",
                con:false
            }
        },
        egg:"A rough grey egg that could easily be mistaken for a rock. Iron is attracted to it.",
        steps:"3840"
    },{
        evos:{
            "Ponyta":{
                type:["Fire"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Rapidash":{
                type:["Fire"],
                color:"Yellow",
                from:"Ponyta",
                con:true
            }
        },
        egg:"An egg that is off-white. It has an orange blotch on the top and brown spots like eyes. It radiates heat.",
        steps:"5120"
    },{
        evos:{
            "Galarian Ponyta":{
                type:["Psychic"],
                color:"White",
                from:null,
                con:true
            },
            "Galarian Rapidash":{
                type:["Fairy","Psychic"],
                color:"White",
                from:"Galarian Ponyta",
                con:true
            }
        },
        egg:"An egg that is off-white. It has a purple blotch on the top and blue spots like eyes. It radiates life energy.",
        steps:"5120"
    },{
        evos:{
            "Galarian Slowpoke":{
                type:["Psychic"],
                color:"Pink",
                from:null,
                con:true
            },
            "Galarian Slowbro":{
                type:["Poison","Psychic"],
                color:"Pink",
                from:null,
                con:false
            },
            "Galarian Slowking":{
                type:["Poison","Psychic"],
                color:"Pink",
                from:null,
                con:false
            },
        },
        egg:"A pink egg with a big tan spot on the bottom and a big yellow spot on the top. It doesn't react to anything at all.",
        steps:"5120"
    },{
        evos:{
            "Slowpoke":{
                type:["Psychic","Water"],
                color:"Pink",
                from:null,
                con:true
            },
            "Slowbro":{
                type:["Psychic","Water"],
                color:"Pink",
                from:"Slowpoke",
                con:true
            },
            "Mega Slowbro [Mega]":{
                type:["Psychic","Water"],
                color:"Pink",
                from:"Slowbro",
                con:false
            },
            "Slowking":{
                type:["Psychic","Water"],
                color:"Pink",
                from:"Slowpoke",
                con:false
            }
        },
        egg:"A pink egg with a big tan spot on it. It doesn't react to anything at all.",
        steps:"5120"
    },{
        evos:{
            "Magnemite":{
                type:["Electric","Steel"],
                color:"Gray",
                from:null,
                con:true
            },
            "Magneton":{
                type:["Electric","Steel"],
                color:"Gray",
                from:"Magnemite",
                con:true
            },
            "Magnezone":{
                type:["Electric","Steel"],
                color:"Gray",
                from:"Magneton",
                con:false
            }
        },
        egg:"An egg that is shiny like steel and has two white spots. Iron is attracted to it.",
        steps:"5120"
    },{
        evos:{
            "Farfetch'd":{
                type:["Flying","Normal"],
                color:"Brown",
                from:null,
                con:true
            }
        },
        egg:"A brown egg with a peculiar dark marking on it. It's supposed to be the egg of a bird.",
        steps:"5120"
    },{
        evos:{
            "Doduo":{
                type:["Flying","Normal"],
                color:"Brown",
                from:null,
                con:true
            },
            "Dodrio":{
                type:["Flying","Normal"],
                color:"Brown",
                from:"Doduo",
                con:true
            }
        },
        egg:"A brown egg with two small spots that look like eyes. It's supposed to be the egg of a bird.",
        steps:"5120"
    },{
        evos:{
            "Seel":{
                type:["Water"],
                color:"White",
                from:null,
                con:true
            },
            "Dewgong":{
                type:["Ice","Water"],
                color:"White",
                from:"Seel",
                con:true
            }
        },
        egg:"A white egg with a tan blotch on it. It's cold to the touch.",
        steps:"5120"
    },{
        evos:{
            "Grimer":{
                type:["Poison"],
                color:"Purple",
                from:null,
                con:true
            },
            "Muk":{
                type:["Poison"],
                color:"Purple",
                from:"Grimer",
                con:true
            }
        },
        egg:"This thing looks more like a hardened blob of disgusting sludge than an egg....",
        steps:"5120"
    },{
        evos:{
            "Alolan Grimer":{
                type:["Dark","Poison"],
                color:"Green",
                from:null,
                con:true
            },
            "Alolan Muk":{
                type:["Dark","Poison"],
                color:"Green",
                from:"Alolan Grimer",
                con:true
            }
        },
        egg:"This thing looks more like a hardened blob of green, disgusting sludge than an egg. There's a yellow line running across it.",
        steps:"5120"
    },{
        evos:{
            "Shellder":{
                type:["Water"],
                color:"Purple",
                from:null,
                con:true
            },
            "Spiral Shellder":{
                type:["Water"],
                color:"Gray",
                from:"Shellder",
                con:false
            },
            "Cloyster":{
                type:["Ice","Water"],
                color:"Purple",
                from:"Shellder",
                con:false
            }
        },
        egg:"A purple egg with a peculiar pattern. It's surprisingly tough.",
        steps:"5120"
    },{
        evos:{
            "Gastly":{
                type:["Ghost","Poison"],
                color:"Purple",
                from:null,
                con:true
            },
            "Haunter":{
                type:["Ghost","Poison"],
                color:"Purple",
                from:"Gastly",
                con:true
            },
            "Gengar":{
                type:["Ghost","Poison"],
                color:"Purple",
                from:"Haunter",
                con:false
            },
            "Mega Gengar [Mega]":{
                type:["Ghost","Poison"],
                color:"Purple",
                from:"Gengar",
                con:false
            },
            "Gmax Gengar [Gmax]":{
                type:["Ghost","Poison"],
                color:"Purple",
                from:"Gengar",
                con:false
            }
        },
        egg:"A dark purple egg that is surprisingly light. It gives off a rather sinister vibe....",
        steps:"5120"
    },{
        evos:{
            "Onix":{
                type:["Ground","Rock"],
                color:"Gray",
                from:null,
                con:true
            },
            "Steelix":{
                type:["Ground","Steel"],
                color:"Gray",
                from:"Onix",
                con:false
            },
            "Mega Steelix [Mega]":{
                type:["Ground","Steel"],
                color:"Gray",
                from:"Steelix",
                con:false
            }
        },
        egg:"A grey egg that could easily be mistaken for a rock. It's almost impossible to lift.",
        steps:"6400"
    },{
        evos:{
            "Drowzee":{
                type:["Psychic"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Hypno":{
                type:["Psychic"],
                color:"Yellow",
                from:"Drowzee",
                con:true
            }
        },
        egg:"A yellow egg with brown pattern on the bottom. Its presence is a bit hypnotic.",
        steps:"5120"
    },{
        evos:{
            "Krabby":{
                type:["Water"],
                color:"Red",
                from:null,
                con:true
            },
            "Kingler":{
                type:["Water"],
                color:"Red",
                from:"Krabby",
                con:true
            },
            "Gmax Kingler [Gmax]":{
                type:["Water"],
                color:"Red",
                from:"Kingler",
                con:false
            }
        },
        egg:"A red-orange egg with an odd tan pattern on the bottom. It's surprisingly tough.",
        steps:"5120"
    },{
        evos:{
            "Voltorb":{
                type:["Electric"],
                color:"Red",
                from:null,
                con:true
            },
            "Electrode":{
                type:["Electric"],
                color:"Red",
                from:"Voltorb",
                con:true
            }
        },
        egg:"An egg that is half red and half white. Touching it sometimes shocks you.",
        steps:"5120"
    },{
        evos:{
            "Hisuian Voltorb":{
                type:["Electric","Grass"],
                color:"Red",
                from:null,
                con:true
            },
            "Hisuian Electrode":{
                type:["Electric","Grass"],
                color:"Red",
                from:"Hisuian Voltorb",
                con:false
            }
        },
        egg:"An egg that is half red and half tan. There is a small hole on top. Touching it sometimes shocks you.",
        steps:"5120"
    },{
        evos:{
            "Exeggcute":{
                type:["Grass","Psychic"],
                color:"Pink",
                from:null,
                con:true
            },
            "Exeggutor":{
                type:["Grass","Psychic"],
                color:"Yellow",
                from:"Exeggcute",
                con:false
            },
            "Alolan Exeggutor":{
                type:["Dragon","Grass"],
                color:"Yellow",
                from:"Exeggutor",
                con:false
            }
        },
        egg:"A plain pink egg. Not exactly the most unique thing ever....",
        steps:"5120"
    },{
        evos:{
            "Cubone":{
                type:["Ground"],
                color:"Brown",
                from:null,
                con:true
            },
            "Marowak":{
                type:["Ground"],
                color:"Brown",
                from:"Cubone",
                con:true
            },
            "Alolan Marowak":{
                type:["Fire","Ghost"],
                color:"Purple",
                from:"Marowak",
                con:true
            }
        },
        egg:"A grey egg with a brown bottom. The markings on the egg resemble a face. It is surprisingly tough.",
        steps:"5120"
    },{
        evos:{
            "Hisuian Zorua":{
                type:["Normal","Ghost"],
                color:"Gray",
                from:null,
                con:true
            },
            "Hisuian Zoroark":{
                type:["Normal","Ghost"],
                color:"Gray",
                from:"Hisuian Zorua",
                con:true
            }
        },
        egg:"A white egg with a bizarre pink marking on the front. Sometimes the marking will change its shape.",
        steps:"6400"
    },{
        evos:{
            "Tyrogue":{
                type:["Fighting"],
                color:"Purple",
                from:null,
                con:true
            },
            "Hitmonlee":{
                type:["Fighting"],
                color:"Brown",
                from:"Tyrogue",
                con:true
            },
            "Hitmonchan":{
                type:["Fighting"],
                color:"Brown",
                from:"Tyrogue",
                con:true
            },
            "Hitmontop":{
                type:["Fighting"],
                color:"Brown",
                from:"Tyrogue",
                con:true,
                minLv:20
            }
        },
        egg:"A pink egg with an odd pattern on it. This pattern resembles a face.",
        steps:"6400"
    },{
        evos:{
            "Lickitung":{
                type:["Normal"],
                color:"Pink",
                from:null,
                con:true
            },
            "Lickilicky":{
                type:["Normal"],
                color:"Pink",
                from:"Lickitung",
                con:false
            }
        },
        egg:"A pink egg with a big tan band on the front. It's covered in what appears to be saliva....",
        steps:"5120"
    },{
        evos:{
            "Koffing":{
                type:["Poison"],
                color:"Purple",
                from:null,
                con:true
            },
            "Weezing":{
                type:["Poison"],
                color:"Purple",
                from:"Koffing",
                con:true
            },
            "Galarian Weezing":{
                type:["Poison","Fairy"],
                color:"Gray",
                from:"Koffing",
                con:true
            }
        },
        egg:"A purple egg with a tan marking near the bottom. The marking resembles a skull. The egg has a horrible stench....",
        steps:"5120"
    },{
        evos:{
            "Rhyhorn":{
                type:["Ground","Rock"],
                color:"Gray",
                from:null,
                con:true
            },
            "Rhydon":{
                type:["Ground","Rock"],
                color:"Gray",
                from:"Rhyhorn",
                con:true
            },
            "Rhyperior":{
                type:["Ground","Rock"],
                color:"Gray",
                from:"Rhydon",
                con:false
            }
        },
        egg:"A grey egg that is incredibly tough. It could easily be mistaken for a rock.",
        steps:"5120"
    },{
        evos:{
            "Happiny":{
                type:["Normal"],
                color:"Pink",
                from:null,
                con:true
            },
            "Chansey":{
                type:["Normal"],
                color:"Pink",
                from:"Happiny",
                con:false
            },
            "Blissey":{
                type:["Normal"],
                color:"Pink",
                from:"Chansey",
                con:false
            }
        },
        egg:"A pink egg with two dark spots on it. It also has an odd marking near the top. It is oddly cute in a way.",
        steps:"10240"
    },{
        evos:{
            "Tangela":{
                type:["Grass"],
                color:"Blue",
                from:null,
                con:true
            },
            "Tangrowth":{
                type:["Grass"],
                color:"Blue",
                from:"Tangela",
                con:false
            }
        },
        egg:"A blue egg with an odd marking on the front. It feels like seaweed.",
        steps:"5120"
    },{
        evos:{
            "Kangaskhan":{
                type:["Normal"],
                color:"Brown",
                from:null,
                con:true
            },
            "Mega Kangaskhan [Mega]":{
                type:["Normal"],
                color:"Brown",
                from:"Kangaskhan",
                con:false
            }
        },
        egg:"An egg that is a dull dark green on the top and brown on the bottom. It's a bit on the heavy side.",
        steps:"5120"
    },{
        evos:{
            "Horsea":{
                type:["Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Seadra":{
                type:["Water"],
                color:"Blue",
                from:"Horsea",
                con:true
            },
            "Kingdra":{
                type:["Dragon","Water"],
                color:"Blue",
                from:"Seadra",
                con:false
            }
        },
        egg:"A light blue egg with an odd tan marking on the front. The egg is slightly damp.",
        steps:"5120"
    },{
        evos:{
            "Goldeen":{
                type:["Water"],
                color:"Red",
                from:null,
                con:true
            },
            "Seaking":{
                type:["Water"],
                color:"Red",
                from:"Goldeen",
                con:true
            }
        },
        egg:"A white egg with several orange splotches all over it. The egg is slightly damp.",
        steps:"5120"
    },{
        evos:{
            "Staryu":{
                type:["Water"],
                color:"Brown",
                from:null,
                con:true
            },
            "Starmie":{
                type:["Psychic","Water"],
                color:"Purple",
                from:"Staryu",
                con:false
            }
        },
        egg:"A tan and yellow egg with a red spot on it. The spot shines like a gem.",
        steps:"5120"
    },{
        evos:{
            "Mime Jr.":{
                type:["Fairy","Psychic"],
                color:"Pink",
                from:null,
                con:true
            },
            "Mr. Mime":{
                type:["Fairy","Psychic"],
                color:"Pink",
                from:"Mime Jr.",
                con:false
            },
            "Galarian Mr. Mime":{
                type:["Ice","Psychic"],
                color:"Purple",
                from:"Mime Jr.",
                con:false
            },
            "Mr. Rime":{
                type:["Ice","Psychic"],
                color:"Purple",
                from:"Galarian Mr. Mime",
                con:true
            }
        },
        egg:"A pink egg with a big blue blotch on the top and a small red spot on the front. It sometimes hops around, mimicking your movement.",
        steps:"6400"
    },{
        evos:{
            "Scyther":{
                type:["Bug","Flying"],
                color:"Green",
                from:null,
                con:true
            },
            "Scizor":{
                type:["Bug","Steel"],
                color:"Red",
                from:"Scyther",
                con:false
            },
            "Mega Scizor [Mega]":{
                type:["Bug","Steel"],
                color:"Red",
                from:"Scizor",
                con:false
            },
            "Kleavor":{
                type:["Bug","Rock"],
                color:"Brown",
                from:"Scyther",
                con:false
            }
        },
        egg:"A green egg with odd markings on it. The markings resemble a face. It's a bit on the heavy side.",
        steps:"6400"
    },{
        evos:{
            "Smoochum":{
                type:["Ice","Psychic"],
                color:"Pink",
                from:null,
                con:true
            },
            "Jynx":{
                type:["Ice","Psychic"],
                color:"Red",
                from:"Smoochum",
                con:true
            }
        },
        egg:"A pink egg with a yellow blotch on the top and a light pink spot on the front. It is cold to the touch.",
        steps:"6400"
    },{
        evos:{
            "Elekid":{
                type:["Electric"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Electabuzz":{
                type:["Electric"],
                color:"Yellow",
                from:"Elekid",
                con:true
            },
            "Electivire":{
                type:["Electric"],
                color:"Yellow",
                from:"Electabuzz",
                con:false
            }
        },
        egg:"A yellow egg with an odd black pattern on the bottom. Touching it sometimes shocks you.",
        steps:"6400"
    },{
        evos:{
            "Magby":{
                type:["Fire"],
                color:"Red",
                from:null,
                con:true
            },
            "Magmar":{
                type:["Fire"],
                color:"Red",
                from:"Magby",
                con:true
            },
            "Magmortar":{
                type:["Fire"],
                color:"Red",
                from:"Magmar",
                con:false
            }
        },
        egg:"A pale red egg with a yellow spot on the front. It radiates heat.",
        steps:"6400"
    },{
        evos:{
            "Pinsir":{
                type:["Bug"],
                color:"Brown",
                from:null,
                con:true
            },
            "Mega Pinsir [Mega]":{
                type:["Bug","Flying"],
                color:"Brown",
                from:"Pinsir",
                con:false
            }
        },
        egg:"A brown egg with an odd stripe pattern on it. It's a bit on the heavy side.",
        steps:"6400"
    },{
        evos:{
            "Tauros":{
                type:["Normal"],
                color:"Brown",
                from:null,
                con:true
            }
        },
        egg:"A brown egg with several grey spots on it. The spots form a pattern. It's a bit on the heavy side.",
        steps:"5120"
    },{
        evos:{
            "Paldean Tauros [Combat Breed]":{
                type:["Fighting"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A black egg with several grey spots on it. The spots form a pattern. It's a bit on the heavy side.",
        steps:"5120"
    },{
        evos:{
            "Paldean Tauros [Blaze Breed]":{
                type:["Fighting","Fire"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A black egg with several red spots on it. The spots form a pattern. It's a bit on the heavy side and is hot to the touch.",
        steps:"5120"
    },{
        evos:{
            "Paldean Tauros [Aqua Breed]":{
                type:["Fighting","Water"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A black egg with several blue spots on it. The spots form a pattern. It's a bit on the heavy side and is moist to the touch.",
        steps:"5120"
    },{
        evos:{
            "Magikarp":{
                type:["Water"],
                color:"Red",
                from:null,
                con:true
            },
            "Gyarados":{
                type:["Flying","Water"],
                color:"Blue",
                from:"Magikarp",
                con:true
            },
            "Mega Gyarados [Mega]":{
                type:["Dark","Water"],
                color:"Blue",
                from:"Gyarados",
                con:false
            }
        },
        egg:"An orange egg with two white spots and a peach-coloured blotch. It resembles a face. This egg looks like it'd take no time to hatch.",
        steps:"1280"
    },{
        evos:{
            "Lapras":{
                type:["Ice","Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Gmax Lapras [Gmax]":{
                type:["Ice","Water"],
                color:"Blue",
                from:"Lapras",
                con:false
            }
        },
        egg:"A blue egg with a tan blotch on the bottom. The blue part has a few small spots. It's a bit difficult to lift up.",
        steps:"10240"
    },{
        evos:{
            "Ditto":{
                type:["Normal"],
                color:"Purple",
                from:null,
                con:true
            },
            "Ditto [Book]":{
                type:["Normal"],
                color:"White",
                from:"Ditto",
                con:false
            }
        },
        egg:"A purple egg with odd markings on it. The markings resemble a face. The egg's texture is surprisingly soft.",
        steps:"5120"
    },{
        evos:{
            "Eevee":{
                type:["Normal"],
                color:"Brown",
                from:null,
                con:true
            },
            "Vaporeon":{
                type:["Water"],
                color:"Blue",
                from:"Eevee",
                con:false
            },
            "Jolteon":{
                type:["Electric"],
                color:"Yellow",
                from:"Eevee",
                con:false
            },
            "Flareon":{
                type:["Fire"],
                color:"Red",
                from:"Eevee",
                con:false
            },
            "Espeon":{
                type:["Psychic"],
                color:"Purple",
                from:"Eevee",
                con:false
            },
            "Umbreon":{
                type:["Dark"],
                color:"Black",
                from:"Eevee",
                con:false
            },
            "Leafeon":{
                type:["Grass"],
                color:"Green",
                from:"Eevee",
                con:false
            },
            "Autumn Leafeon":{
                type:["Grass"],
                color:"Red",
                from:"Leafeon",
                con:false
            },
            "Glaceon":{
                type:["Ice"],
                color:"Blue",
                from:"Eevee",
                con:false
            },
            "Sylveon":{
                type:["Fairy"],
                color:"Pink",
                from:"Eevee",
                con:false
            },
            "Gmax Eevee [Gmax]":{
                type:["Normal"],
                color:"Brown",
                from:"Eevee",
                con:false
            }
        },
        egg:"A brown egg with a tan bottom. The tan bottom has a few markings on it. This egg reacts strangely to some items.",
        steps:"8960"
    },{
        evos:{
            "Porygon":{
                type:["Normal"],
                color:"Pink",
                from:null,
                con:true
            },
            "Porygon2":{
                type:["Normal"],
                color:"Red",
                from:"Porygon",
                con:false
            },
            "Porygon-Z":{
                type:["Normal"],
                color:"Red",
                from:"Porygon2",
                con:false
            },
            "Porygon-T":{
                type:["Normal","Steel"],
                color:"Red",
                from:"Porygon2",
                con:false
            }
        },
        egg:"A pink egg with an odd blue spot on the front and several dark lines running across it. This egg doesn't look like something natural....",
        steps:"5120"
    },{
        evos:{
            "Omanyte":{
                type:["Rock","Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Omastar":{
                type:["Rock","Water"],
                color:"Blue",
                from:"Omanyte",
                con:true
            },
            "Omastar [Orchid]":{
                type:["Grass","Water"],
                color:"Purple",
                from:"Omanyte",
                con:false
            }
        },
        egg:"A tan egg with a stripe pattern on it. It is surprisingly tough.",
        steps:"7680"
    },{
        evos:{
            "Kabuto":{
                type:["Rock","Water"],
                color:"Brown",
                from:null,
                con:true
            },
            "Kabutops":{
                type:["Rock","Water"],
                color:"Brown",
                from:"Kabuto",
                con:true
            }
        },
        egg:"A brown egg with two dark marks on it. It is surprisingly tough.",
        steps:"7680"
    },{
        evos:{
            "Aerodactyl":{
                type:["Flying","Rock"],
                color:"Purple",
                from:null,
                con:true
            },
            "Mega Aerodactyl [Mega]":{
                type:["Flying","Rock"],
                color:"Purple",
                from:"Aerodactyl",
                con:false
            }
        },
        egg:"A dull purple egg that has markings on it that resemble a fierce face. It's a bit on the heavy side.",
        steps:"8960"
    },{
        evos:{
            "Munchlax":{
                type:["Normal"],
                color:"Black",
                from:null,
                con:true
            },
            "Snorlax":{
                type:["Normal"],
                color:"Black",
                from:"Munchlax",
                con:false
            },
            "Gmax Snorlax [Gmax]":{
                type:["Normal"],
                color:"Black",
                from:"Snorlax",
                con:false
            }
        },
        egg:"A dark teal egg with a single tan spot on the front. It shakes around a bit if you bring food near it.",
        steps:"10240"
    },{
        evos:{
            "Articuno":{
                type:["Flying","Ice"],
                color:"Blue",
                from:null,
                con:true
            }
        },
        egg:"A blue egg with a bizarre dark blue pattern on the top and an odd beak-like pattern on the front. The air around this egg is unbearably cold at times.",
        steps:"20480"
    },{
        evos:{
            "Zapdos":{
                type:["Electric","Flying"],
                color:"Yellow",
                from:null,
                con:true
            }
        },
        egg:"A yellow egg with a bizarre black pattern on it. It's often dangerous to touch it, because doing so might result in a really bad shock.",
        steps:"20480"
    },{
        evos:{
            "Moltres":{
                type:["Fire","Flying"],
                color:"Yellow",
                from:null,
                con:true
            }
        },
        egg:"A yellow-orange egg with a tan spot on the front and several orange flame-like markings. It's difficult to hold for extended periods of time due to being so hot.",
        steps:"20480"
    },{
        evos:{
            "Dratini":{
                type:["Dragon"],
                color:"Blue",
                from:null,
                con:true
            },
            "Dragonair":{
                type:["Dragon"],
                color:"Blue",
                from:"Dratini",
                con:true
            },
            "Dragonite":{
                type:["Dragon","Flying"],
                color:"Brown",
                from:"Dragonair",
                con:true
            }
        },
        egg:"A pale blue egg with two grey spots on it. The lower spot is larger than the top one. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Mewtwo":{
                type:["Psychic"],
                color:"Purple",
                from:null,
                con:true
            },
            "Mega Mewtwo X [Mega]":{
                type:["Fighting","Psychic"],
                color:"Purple",
                from:"Mewtwo",
                con:false
            },
            "Mega Mewtwo Y [Mega]":{
                type:["Psychic"],
                color:"Purple",
                from:"Mewtwo",
                con:false
            },
            "Armored Mewtwo [V1998]":{
                type:["Psychic"],
                color:"Purple",
                from:"Mewtwo",
                con:false
            },
            "Armored Mewtwo [V2019]":{
                type:["Psychic"],
                color:"Purple",
                from:"Mewtwo",
                con:false
            }
        },
        egg:"A grey egg with bizarre markings on the top and a purple blotch on the bottom. A mysterious power radiates from it.",
        steps:"30720"
    },{
        evos:{
            "Mew":{
                type:["Psychic"],
                color:"Pink",
                from:null,
                con:true
            }
        },
        egg:"A plain bright pink egg. It doesn't seem like the most unique thing ever....",
        steps:"30720"
    },{
        evos:{
            "Chikorita":{
                type:["Grass"],
                color:"Green",
                from:null,
                con:true
            },
            "Bayleef":{
                type:["Grass"],
                color:"Green",
                from:"Chikorita",
                con:true
            },
            "Meganium":{
                type:["Grass"],
                color:"Green",
                from:"Bayleef",
                con:true
            }
        },
        egg:"A pale green egg with a line of green dots around it. Something seems vaguely familiar about it....",
        steps:"5120"
    },{
        evos:{
            "Cyndaquil":{
                type:["Fire"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Quilava":{
                type:["Fire"],
                color:"Yellow",
                from:"Cyndaquil",
                con:true,
                minLv:14
            },
            "Hisuian Typhlosion":{
                type:["Fire","Ghost"],
                color:"Yellow",
                from:"Quilava",
                con:true
            },
            "Typhlosion":{
                type:["Fire"],
                color:"Yellow",
                from:"Quilava",
                con:true
            }
        },
        egg:"A dark blue egg with a tan bottom. Something seems vaguely familiar about it....",
        steps:"5120"
    },{
        evos:{
            "Totodile":{
                type:["Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Croconaw":{
                type:["Water"],
                color:"Blue",
                from:"Totodile",
                con:true
            },
            "Feraligatr":{
                type:["Water"],
                color:"Blue",
                from:"Croconaw",
                con:true
            }
        },
        egg:"A blue egg with a big tan mark on it and a couple dark blue spots. Something seems vaguely familiar about it....",
        steps:"5120"
    },{
        evos:{
            "Sentret":{
                type:["Normal"],
                color:"Brown",
                from:null,
                con:true
            },
            "Furret":{
                type:["Normal"],
                color:"Brown",
                from:"Sentret",
                con:true
            }
        },
        egg:"A tan egg with a big light circle marking on the front. Sometimes shakes a bit when it's touched.",
        steps:"3840"
    },{
        evos:{
            "Hoothoot":{
                type:["Flying","Normal"],
                color:"Brown",
                from:null,
                con:true
            },
            "Noctowl":{
                type:["Flying","Normal"],
                color:"Brown",
                from:"Hoothoot",
                con:true,
                minLv:20
            },
            "Noctowl [Curator]":{
                type:["Flying","Normal"],
                color:"Brown",
                from:"Hoothoot",
                con:false
            }
        },
        egg:"A brown egg with an odd black marking on the front. Its presence is a bit hypnotic.",
        steps:"3840"
    },{
        evos:{
            "Ledyba":{
                type:["Bug","Flying"],
                color:"Red",
                from:null,
                con:true
            },
            "Ledian":{
                type:["Bug","Flying"],
                color:"Red",
                from:"Ledyba",
                con:true
            }
        },
        egg:"A red-orange egg that has several black spots all over it. Said to be the egg of some sort of bug.",
        steps:"3840"
    },{
        evos:{
            "Spinarak":{
                type:["Bug","Poison"],
                color:"Green",
                from:null,
                con:true
            },
            "Ariados":{
                type:["Bug","Poison"],
                color:"Red",
                from:"Spinarak",
                con:true
            }
        },
        egg:"A bright green egg with three dark markings on it. The markings resemble a face. Said to be the egg of some sort of bug.",
        steps:"3840"
    },{
        evos:{
            "Chinchou":{
                type:["Electric","Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Lanturn":{
                type:["Electric","Water"],
                color:"Blue",
                from:"Chinchou",
                con:true
            }
        },
        egg:"A blue egg with two yellow spots on it. Touching it might shock you.",
        steps:"5120"
    },{
        evos:{
            "Togepi":{
                type:["Fairy"],
                color:"White",
                from:null,
                con:true
            },
            "Togetic":{
                type:["Fairy","Flying"],
                color:"White",
                from:"Togepi",
                con:false
            },
            "Togekiss":{
                type:["Fairy","Flying"],
                color:"White",
                from:"Togetic",
                con:false
            }
        },
        egg:"A white egg with several small red and blue marks on it. Something seems vaguely familiar about it....",
        steps:"2560"
    },{
        evos:{
            "Natu":{
                type:["Flying","Psychic"],
                color:"Green",
                from:null,
                con:true
            },
            "Xatu":{
                type:["Flying","Psychic"],
                color:"Green",
                from:"Natu",
                con:true
            }
        },
        egg:"A green egg with a red top, yellow spots, and black marks. It radiates a mysterious power.",
        steps:"5120"
    },{
        evos:{
            "Mareep":{
                type:["Electric"],
                color:"White",
                from:null,
                con:true
            },
            "Flaaffy":{
                type:["Electric"],
                color:"Pink",
                from:"Mareep",
                con:true
            },
            "Ampharos":{
                type:["Electric"],
                color:"Yellow",
                from:"Flaaffy",
                con:true,
                minLv:30
            },
            "Mega Ampharos [Mega]":{
                type:["Dragon","Electric"],
                color:"Yellow",
                from:"Ampharos",
                con:false
            },
            "Mareep [Sheared]":{
                type:["Electric"],
                color:"Blue",
                from:"Mareep",
                con:false
            },
            "Flaaffy [Sheared]":{
                type:["Electric"],
                color:"Pink",
                from:"Mareep [Sheared]",
                con:true
            },
            "Ampharos [Woolly]":{
                type:["Electric"],
                color:"Yellow",
                from:"Flaaffy [Sheared]",
                con:true
            }
        },
        egg:"A blue egg with a yellow top and a grey spot on the back. Touching it sometimes shocks you.",
        steps:"5120"
    },{
        evos:{
            "Azurill":{
                type:["Fairy","Normal"],
                color:"Blue",
                from:null,
                con:true
            },
            "Marill":{
                type:["Fairy","Water"],
                color:"Blue",
                from:"Azurill",
                con:false
            },
            "Azumarill":{
                type:["Fairy","Water"],
                color:"Blue",
                from:"Marill",
                con:true
            }
        },
        egg:"A blue egg with two light blue spots on it. It bounces around sometimes.",
        steps:"2560"
    },{
        evos:{
            "Bonsly":{
                type:["Rock"],
                color:"Brown",
                from:null,
                con:true
            },
            "Sudowoodo":{
                type:["Rock"],
                color:"Brown",
                from:"Bonsly",
                con:false
            }
        },
        egg:"A brown egg with a green top and one small tan spot. It is surprisingly tough.",
        steps:"5120"
    },{
        evos:{
            "Hoppip":{
                type:["Flying","Grass"],
                color:"Pink",
                from:null,
                con:true
            },
            "Skiploom":{
                type:["Flying","Grass"],
                color:"Green",
                from:"Hoppip",
                con:true
            },
            "Jumpluff":{
                type:["Flying","Grass"],
                color:"Blue",
                from:"Skiploom",
                con:true
            }
        },
        egg:"A red egg with a green top, two yellow spots, and a black mark. It is surprisingly light.",
        steps:"5120"
    },{
        evos:{
            "Aipom":{
                type:["Normal"],
                color:"Purple",
                from:null,
                con:true
            },
            "Ambipom":{
                type:["Normal"],
                color:"Purple",
                from:"Aipom",
                con:false
            }
        },
        egg:"A purple egg with a big tan blotch on the front. It seems to have good balance for an egg, since it never falls over.",
        steps:"5120"
    },{
        evos:{
            "Sunkern":{
                type:["Grass"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Sunflora":{
                type:["Grass"],
                color:"Yellow",
                from:"Sunkern",
                con:false
            }
        },
        egg:"A yellow egg with three vertical stripes coming from the bottom. This egg seems to be covered in what appears to be dew.",
        steps:"5120"
    },{
        evos:{
            "Yanma":{
                type:["Bug","Flying"],
                color:"Red",
                from:null,
                con:true
            },
            "Yanmega":{
                type:["Bug","Flying"],
                color:"Green",
                from:"Yanma",
                con:false
            }
        },
        egg:"A bright green egg with red on the top and bottom. It's supposed to be the egg of a bug.",
        steps:"5120"
    },{
        evos:{
            "Wooper":{
                type:["Ground","Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Quagsire":{
                type:["Ground","Water"],
                color:"Blue",
                from:"Wooper",
                con:true
            }
        },
        egg:"A blue egg with a purple spot and three wavy blue lines on the front. It's covered in slime....",
        steps:"5120"
    },{
        evos:{
            "Paldean Wooper":{
                type:["Poison","Ground"],
                color:"Brown",
                from:null,
                con:true
            },
            "Clodsire":{
                type:["Poison","Ground"],
                color:"Brown",
                from:"Paldean Wooper",
                con:true
            }
        },
        egg:"A brown egg with a pink spot and a dark brown marking on the front. It's covered in slime....",
        steps:"5120"
    },{
        evos:{
            "Murkrow":{
                type:["Dark","Flying"],
                color:"Black",
                from:null,
                con:true
            },
            "Honchkrow":{
                type:["Dark","Flying"],
                color:"Black",
                from:"Murkrow",
                con:false
            }
        },
        egg:"A dark blue egg with a yellow beak-like mark on the front. It's supposed to be the egg of some sort of bird.",
        steps:"5120"
    },{
        evos:{
            "Misdreavus":{
                type:["Ghost"],
                color:"Gray",
                from:null,
                con:true
            },
            "Mismagius":{
                type:["Ghost"],
                color:"Purple",
                from:"Misdreavus",
                con:false
            },
            "Mismagius [Master of Illusions]":{
                type:["Ghost"],
                color:"Purple",
                from:"Mismagius",
                con:false
            }
        },
        egg:"A dark blueish-purple egg with a purple top and several purple spots. It's surprisingly light.",
        steps:"6400"
    },{
        evos:{
            "Unown [A]":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Unown [B]":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Unown [C]":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Unown [D]":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Unown [E]":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Unown [F]":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Unown [G]":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Unown [H]":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Unown [I]":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Unown [J]":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Unown [K]":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Unown [L]":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Unown [M]":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Unown [N]":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Unown [O]":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Unown [P]":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Unown [Q]":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Unown [R]":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Unown [S]":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Unown [T]":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Unown [U]":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Unown [V]":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Unown [W]":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Unown [X]":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Unown [Y]":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Unown [Z]":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Unown [!]":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Unown [?]":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Wynaut":{
                type:["Psychic"],
                color:"Blue",
                from:null,
                con:true
            },
            "Wobbuffet":{
                type:["Psychic"],
                color:"Blue",
                from:"Wynaut",
                con:true
            }
        },
        egg:"A blue egg with a thin dark zig-zag line on the front. It might hop up to you if you get close to it.",
        steps:"5120"
    },{
        evos:{
            "Girafarig":{
                type:["Normal","Psychic"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Farigiraf":{
                type:["Normal","Psychic"],
                color:"Yellow",
                from:"Girafarig",
                con:true
            }
        },
        egg:"An egg with a white top, yellow middle, and dark brown bottom. It's a bit on the heavy side.",
        steps:"5120"
    },{
        evos:{
            "Pineco":{
                type:["Bug"],
                color:"Gray",
                from:null,
                con:true
            },
            "Forretress":{
                type:["Bug","Steel"],
                color:"Purple",
                from:"Pineco",
                con:true
            }
        },
        egg:"A light blue egg with several small dark marks all over it. It's surprisingly tough.",
        steps:"5120"
    },{
        evos:{
            "Dunsparce":{
                type:["Normal"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Dudunsparce [Two-Segment]":{
                type:["Normal"],
                color:"Yellow",
                from:"Dunsparce",
                con:true
            },
            "Dudunsparce [Three-Segment]":{
                type:["Normal"],
                color:"Yellow",
                from:"Dunsparce",
                con:false
            }
        },
        egg:"A tan egg with two spots and a blue bottom. The patterns form a face. Struggles around sometimes like it's trying to go underground.",
        steps:"5120"
    },{
        evos:{
            "Gligar":{
                type:["Flying","Ground"],
                color:"Purple",
                from:null,
                con:true
            },
            "Gliscor":{
                type:["Flying","Ground"],
                color:"Purple",
                from:"Gligar",
                con:false
            }
        },
        egg:"A purple egg with an odd blue mark on the back. It might suddenly hop up to you if you get closer.",
        steps:"5120"
    },{
        evos:{
            "Snubbull":{
                type:["Fairy"],
                color:"Pink",
                from:null,
                con:true
            },
            "Granbull":{
                type:["Fairy"],
                color:"Purple",
                from:"Snubbull",
                con:true
            }
        },
        egg:"A pink egg with one light blue wavy stripe on it. It seems oddly cute in a way.",
        steps:"5120"
    },{
        evos:{
            "Qwilfish":{
                type:["Poison","Water"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"An egg that is blue on the top and tan on the bottom. It is covered with pointy spikes.",
        steps:"5120"
    },{
        evos:{
            "Hisuian Qwilfish":{
                type:["Dark","Poison"],
                color:"Black",
                from:null,
                con:true
            },
            "Overqwil":{
                type:["Dark","Poison"],
                color:"Black",
                from:"Hisuian Qwilfish",
                con:true
            }
        },
        egg:"An egg that is navy on the top and white on the bottom. It is covered with pointy spikes.",
        steps:"5120"
    },{
        evos:{
            "Shuckle":{
                type:["Bug","Rock"],
                color:"Yellow",
                from:null,
                con:true
            }
        },
        egg:"A red egg with several peach-coloured spots. It is unbelievably tough.",
        steps:"5120"
    },{
        evos:{
            "Heracross":{
                type:["Bug","Fighting"],
                color:"Blue",
                from:null,
                con:true
            },
            "Mega Heracross [Mega]":{
                type:["Bug","Fighting"],
                color:"Blue",
                from:"Heracross",
                con:false
            }
        },
        egg:"A blue egg with odd markings on the bottom half. It's a bit on the heavy side.",
        steps:"6400"
    },{
        evos:{
            "Sneasel":{
                type:["Dark","Ice"],
                color:"Black",
                from:null,
                con:true
            },
            "Weavile":{
                type:["Dark","Ice"],
                color:"Black",
                from:"Sneasel",
                con:false
            }
        },
        egg:"A blue egg with two dark blotches and one small yellow spot. It has a fierce look to it and is cold to the touch.",
        steps:"5120"
    },{
        evos:{
            "Hisuian Sneasel":{
                type:["Fighting","Poison"],
                color:"Gray",
                from:null,
                con:true
            },
            "Sneasler":{
                type:["Fighting","Poison"],
                color:"Blue",
                from:"Hisuian Sneasel",
                con:false
            }
        },
        egg:"A gray egg with some purple blotches and one small yellow spot. It has a fierce look to it.",
        steps:"5120"
    },{
        evos:{
            "Teddiursa":{
                type:["Normal"],
                color:"Brown",
                from:null,
                con:true
            },
            "Ursaring":{
                type:["Normal"],
                color:"Brown",
                from:"Teddiursa",
                con:true,
                minLv:30
            },
            "Ursaluna":{
                type:["Normal","Ground"],
                color:"Brown",
                from:"Ursaring",
                con:false
            },
            "Ursaluna [Bloodmoon]":{
                type:["Normal","Ground"],
                color:"Brown",
                from:"Ursaring",
                con:false
            }
        },
        egg:"A brown egg with a tan spot on the front. There is a band on the top that resembles a crescent.",
        steps:"5120"
    },{
        evos:{
            "Slugma":{
                type:["Fire"],
                color:"Red",
                from:null,
                con:true
            },
            "Magcargo":{
                type:["Fire","Rock"],
                color:"Red",
                from:"Slugma",
                con:true
            }
        },
        egg:"A bright orange egg with two yellow spots. It's hot to the touch.",
        steps:"5120"
    },{
        evos:{
            "Swinub":{
                type:["Ground","Ice"],
                color:"Brown",
                from:null,
                con:true
            },
            "Piloswine":{
                type:["Ground","Ice"],
                color:"Brown",
                from:"Swinub",
                con:true
            },
            "Mamoswine":{
                type:["Ground","Ice"],
                color:"Brown",
                from:"Piloswine",
                con:false
            }
        },
        egg:"A brown egg with several dark stripes. It's cold to the touch.",
        steps:"5120"
    },{
        evos:{
            "Corsola":{
                type:["Rock","Water"],
                color:"Pink",
                from:null,
                con:true
            }
        },
        egg:"A pink egg with a pretty white pattern on the bottom. It also has several white spots on it. It is surprisingly tough.",
        steps:"5120"
    },{
        evos:{
            "Galarian Corsola":{
                type:["Ghost"],
                color:"White",
                from:null,
                con:true
            },
            "Cursola":{
                type:["Ghost"],
                color:"White",
                from:"Galarian Corsola",
                con:true
            }
        },
        egg:"A white egg with a pretty gray pattern on the bottom. It also has several gray spots on it. It is surprisingly light.",
        steps:"5120"
    },{
        evos:{
            "Galarian Farfetch'd":{
                type:["Fighting"],
                color:"Brown",
                from:null,
                con:true
            },
            "Sirfetch'd":{
                type:["Fighting"],
                color:"White",
                from:"Galarian Farfetch'd",
                con:false
            }
        },
        egg:"A dark brown egg with a peculiar dark marking on it. It's supposed to be the egg of a bird.",
        steps:"5120"
    },{
        evos:{
            "Remoraid":{
                type:["Water"],
                color:"Gray",
                from:null,
                con:true
            },
            "Octillery":{
                type:["Water"],
                color:"Red",
                from:"Remoraid",
                con:true
            }
        },
        egg:"A light blue egg that has a line marking and two dark blue stripes. The egg is slightly damp.",
        steps:"5120"
    },{
        evos:{
            "Delibird":{
                type:["Flying","Ice"],
                color:"Red",
                from:null,
                con:true
            }
        },
        egg:"A white egg with a red top and a yellow spot on the front. It's cold to the touch.",
        steps:"5120"
    },{
        evos:{
            "Mantyke":{
                type:["Flying","Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Mantine":{
                type:["Flying","Water"],
                color:"Purple",
                from:"Mantyke",
                con:true
            }
        },
        egg:"A blue egg with two red spots and a light line. The spots and line form a smiley face. It's a bit on the heavy side.",
        steps:"6400"
    },{
        evos:{
            "Skarmory":{
                type:["Flying","Steel"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A pale blue egg that is shiny like steel. It is incredibly tough.",
        steps:"6400"
    },{
        evos:{
            "Houndour":{
                type:["Dark","Fire"],
                color:"Black",
                from:null,
                con:true
            },
            "Houndoom":{
                type:["Dark","Fire"],
                color:"Black",
                from:"Houndour",
                con:true
            },
            "Mega Houndoom [Mega]":{
                type:["Dark","Fire"],
                color:"Black",
                from:"Houndoom",
                con:false
            }
        },
        egg:"A black egg with a brown blotch on it. It radiates heat.",
        steps:"5120"
    },{
        evos:{
            "Phanpy":{
                type:["Ground"],
                color:"Blue",
                from:null,
                con:true
            },
            "Donphan":{
                type:["Ground"],
                color:"Gray",
                from:"Phanpy",
                con:true
            }
        },
        egg:"A light blue egg with odd pink blotches on it. It's surprisingly tough.",
        steps:"5120"
    },{
        evos:{
            "Stantler":{
                type:["Normal"],
                color:"Brown",
                from:null,
                con:true
            },
            "Wyrdeer":{
                type:["Normal","Psychic"],
                color:"Gray",
                from:"Stantler",
                con:false
            }
        },
        egg:"A light brown egg with several tan blotches on it. Its presence is hypnotic.",
        steps:"5120"
    },{
        evos:{
            "Smeargle":{
                type:["Normal"],
                color:"White",
                from:null,
                con:true
            }
        },
        egg:"A dull tan egg with an odd green blotch on the top. The green top feels a bit slimy....",
        steps:"5120"
    },{
        evos:{
            "Miltank":{
                type:["Normal"],
                color:"Pink",
                from:null,
                con:true
            }
        },
        egg:"A black egg with a small pink blotch on the top and a larger one near the bottom. It's a bit difficult to lift up.",
        steps:"5120"
    },{
        evos:{
            "Raikou":{
                type:["Electric"],
                color:"Yellow",
                from:null,
                con:true
            }
        },
        egg:"An egg with a purple top, grey and white middle, and yellow bottom. Touching it is incredibly dangerous, as it may end up giving you a powerful shock.",
        steps:"20480"
    },{
        evos:{
            "Entei":{
                type:["Fire"],
                color:"Brown",
                from:null,
                con:true
            }
        },
        egg:"An egg with a bizarre pattern consisting of yellow, orange, white, and brown. The egg is very difficult to hold for very long because it radiates an incredible amount of heat.",
        steps:"20480"
    },{
        evos:{
            "Suicune":{
                type:["Water"],
                color:"Blue",
                from:null,
                con:true
            }
        },
        egg:"A purple egg with a bizarrely shaped blue blotch on the front. This blue blotch shines like a beautiful crystal. The egg emits a mysterious power.",
        steps:"20480"
    },{
        evos:{
            "Larvitar":{
                type:["Ground","Rock"],
                color:"Green",
                from:null,
                con:true
            },
            "Pupitar":{
                type:["Ground","Rock"],
                color:"Gray",
                from:"Larvitar",
                con:true
            },
            "Tyranitar":{
                type:["Dark","Rock"],
                color:"Green",
                from:"Pupitar",
                con:true,
                minLv:55
            },
            "Mega Tyranitar [Mega]":{
                type:["Dark","Rock"],
                color:"Green",
                from:"Tyranitar",
                con:false
            }
        },
        egg:"A pale green egg with a red blotch on the front and two small dark spots. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Lugia":{
                type:["Flying","Psychic"],
                color:"White",
                from:null,
                con:true
            }
        },
        egg:"A white egg with two bizarre light purple patches. It radiates a mysterious power. It sometimes seems like its presence causes the clouds in the sky to turn dark grey.",
        steps:"30720"
    },{
        evos:{
            "Ho-oh":{
                type:["Fire","Flying"],
                color:"Red",
                from:null,
                con:true
            }
        },
        egg:"An orange egg with two bizarre grey patches and an odd yellow beak-like pattern on the front. It sometimes seems like its presence causes a rainbow to appear in the sky.",
        steps:"30720"
    },{
        evos:{
            "Celebi":{
                type:["Grass","Psychic"],
                color:"Green",
                from:null,
                con:true
            }
        },
        egg:"A light pale green egg with a dark blotch on the top and side. It radiates a wondrous power....",
        steps:"30720"
    },{
        evos:{
            "Treecko":{
                type:["Grass"],
                color:"Green",
                from:null,
                con:true
            },
            "Grovyle":{
                type:["Grass"],
                color:"Green",
                from:"Treecko",
                con:true
            },
            "Sceptile":{
                type:["Grass"],
                color:"Green",
                from:"Grovyle",
                con:true
            },
            "Mega Sceptile [Mega]":{
                type:["Dragon","Grass"],
                color:"Green",
                from:"Sceptile",
                con:false
            }
        },
        egg:"A green egg with a red blotch near the bottom. Something seems vaguely familiar about it....",
        steps:"5120"
    },{
        evos:{
            "Torchic":{
                type:["Fire"],
                color:"Red",
                from:null,
                con:true
            },
            "Combusken":{
                type:["Fighting","Fire"],
                color:"Red",
                from:"Torchic",
                con:true
            },
            "Blaziken":{
                type:["Fighting","Fire"],
                color:"Red",
                from:"Combusken",
                con:true
            },
            "Mega Blaziken [Mega]":{
                type:["Fighting","Fire"],
                color:"Red",
                from:"Blaziken",
                con:false
            }
        },
        egg:"An orange egg with a yellow top and a couple of yellow spots. Something seems vaguely familiar about it....",
        steps:"5120"
    },{
        evos:{
            "Mudkip":{
                type:["Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Marshtomp":{
                type:["Ground","Water"],
                color:"Blue",
                from:"Mudkip",
                con:true
            },
            "Swampert":{
                type:["Ground","Water"],
                color:"Blue",
                from:"Marshtomp",
                con:true
            },
            "Mega Swampert [Mega]":{
                type:["Ground","Water"],
                color:"Blue",
                from:"Swampert",
                con:false
            }
        },
        egg:"An egg that is half blue and half grey with two orange spots. Something seems vaguely familiar about it....",
        steps:"5120"
    },{
        evos:{
            "Poochyena":{
                type:["Dark"],
                color:"Gray",
                from:null,
                con:true
            },
            "Mightyena":{
                type:["Dark"],
                color:"Gray",
                from:"Poochyena",
                con:true
            }
        },
        egg:"A grey egg with a big black blotch on the front. The blotch has a small red spot on it. Sometimes shakes a bit if it's touched.",
        steps:"3840"
    },{
        evos:{
            "Zigzagoon":{
                type:["Normal"],
                color:"Brown",
                from:null,
                con:true
            },
            "Linoone":{
                type:["Normal"],
                color:"White",
                from:"Zigzagoon",
                con:true
            }
        },
        egg:"A brown egg with a large tan zig-zag pattern on the middle. Sometimes shakes a bit if it's touched.",
        steps:"3840"
    },{
        evos:{
            "Galarian Zigzagoon":{
                type:["Dark","Normal"],
                color:"Gray",
                from:null,
                con:true
            },
            "Galarian Linoone":{
                type:["Dark","Normal"],
                color:"Gray",
                from:"Galarian Zigzagoon",
                con:true
            },
            "Obstagoon":{
                type:["Dark","Normal"],
                color:"Gray",
                from:"Galarian Linoone",
                con:false
            }
        },
        egg:"A black egg with a large white zig-zag pattern on the middle. It's constantly shaking.",
        steps:"3840"
    },{
        evos:{
            "Wurmple":{
                type:["Bug"],
                color:"Red",
                from:null,
                con:true
            },
            "Wurmple [Party Hat]":{
                type:["Bug"],
                color:"Red",
                from:"Wurmple",
                con:false
            },
            "Silcoon":{
                type:["Bug"],
                color:"White",
                from:"Wurmple",
                con:true
            },
            "Beautifly":{
                type:["Bug","Flying"],
                color:"Yellow",
                from:"Silcoon",
                con:true
            },
            "Cascoon":{
                type:["Bug"],
                color:"Purple",
                from:"Wurmple",
                con:true
            },
            "Dustox":{
                type:["Bug","Poison"],
                color:"Green",
                from:"Cascoon",
                con:true
            }
        },
        egg:"A pale red egg with a tan blotch on the bottom and a yellow spot near the top. It's said to be the egg of some sort of bug.",
        steps:"3840"
    },{
        evos:{
            "Lotad":{
                type:["Grass","Water"],
                color:"Green",
                from:null,
                con:true
            },
            "Lombre":{
                type:["Grass","Water"],
                color:"Green",
                from:"Lotad",
                con:true
            },
            "Ludicolo":{
                type:["Grass","Water"],
                color:"Green",
                from:"Lombre",
                con:false
            }
        },
        egg:"A blue egg with a green top and a yellow band on the front. The egg is slightly damp.",
        steps:"3840"
    },{
        evos:{
            "Seedot":{
                type:["Grass"],
                color:"Brown",
                from:null,
                con:true
            },
            "Nuzleaf":{
                type:["Dark","Grass"],
                color:"Brown",
                from:"Seedot",
                con:true
            },
            "Shiftry":{
                type:["Dark","Grass"],
                color:"Brown",
                from:"Nuzleaf",
                con:false
            }
        },
        egg:"A light brown egg with a grey top. It has a tan blotch on the front. It's supposed to be the egg of a plant.",
        steps:"3840"
    },{
        evos:{
            "Taillow":{
                type:["Flying","Normal"],
                color:"Blue",
                from:null,
                con:true
            },
            "Swellow":{
                type:["Flying","Normal"],
                color:"Blue",
                from:"Taillow",
                con:true
            }
        },
        egg:"A blue egg with a red blotch on it. The blotch also has a yellow spot on it. It's supposed to be the egg of a common bird.",
        steps:"3840"
    },{
        evos:{
            "Wingull":{
                type:["Flying","Water"],
                color:"White",
                from:null,
                con:true
            },
            "Pelipper":{
                type:["Flying","Water"],
                color:"Yellow",
                from:"Wingull",
                con:true
            }
        },
        egg:"A white egg with two blue stripes. There is a yellow and black spot on the front. It's supposed to be the egg of a common bird.",
        steps:"5120"
    },{
        evos:{
            "Ralts":{
                type:["Fairy","Psychic"],
                color:"White",
                from:null,
                con:true
            },
            "Kirlia":{
                type:["Fairy","Psychic"],
                color:"White",
                from:"Ralts",
                con:true
            },
            "Gardevoir":{
                type:["Fairy","Psychic"],
                color:"White",
                from:"Kirlia",
                con:true,
                minLv:30
            },
            "Mega Gardevoir [Mega]":{
                type:["Fairy","Psychic"],
                color:"White",
                from:"Gardevoir",
                con:false
            },
            "Gallade":{
                type:["Fighting","Psychic"],
                color:"White",
                from:"Kirlia",
                con:false
            },
            "Mega Gallade [Mega]":{
                type:["Fighting","Psychic"],
                color:"White",
                from:"Gallade",
                con:false
            }
        },
        egg:"An egg that is green on the top and white on the bottom. It also has an odd red blotch on the green top. It feels like it's trying to sense your emotions.",
        steps:"5120"
    },{
        evos:{
            "Surskit":{
                type:["Bug","Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Masquerain":{
                type:["Bug","Flying"],
                color:"Blue",
                from:"Surskit",
                con:true
            }
        },
        egg:"A blue egg that has a strange yellow blotch on the top. The egg is slightly damp.",
        steps:"3840"
    },{
        evos:{
            "Shroomish":{
                type:["Grass"],
                color:"Brown",
                from:null,
                con:true
            },
            "Breloom":{
                type:["Fighting","Grass"],
                color:"Green",
                from:"Shroomish",
                con:true
            }
        },
        egg:"A brown egg with several green spots all over it. The egg is covered with dust.",
        steps:"3840"
    },{
        evos:{
            "Slakoth":{
                type:["Normal"],
                color:"Brown",
                from:null,
                con:true
            },
            "Vigoroth":{
                type:["Normal"],
                color:"White",
                from:"Slakoth",
                con:true
            },
            "Slaking":{
                type:["Normal"],
                color:"Brown",
                from:"Vigoroth",
                con:true
            }
        },
        egg:"A brown egg with two dark spots and a small red spot. It doesn't react to anything at all.",
        steps:"3840"
    },{
        evos:{
            "Nincada":{
                type:["Bug","Ground"],
                color:"Gray",
                from:null,
                con:true
            },
            "Ninjask":{
                type:["Bug","Flying"],
                color:"Yellow",
                from:"Nincada",
                con:true
            },
            "Shedinja":{
                type:["Bug","Ghost"],
                color:"Brown",
                from:"Nincada",
                con:true
            }
        },
        egg:"A plain white egg with a thin wavy line going across it. Supposed to be the egg of some sort of bug.",
        steps:"3840"
    },{
        evos:{
            "Whismur":{
                type:["Normal"],
                color:"Pink",
                from:null,
                con:true
            },
            "Loudred":{
                type:["Normal"],
                color:"Blue",
                from:"Whismur",
                con:true
            },
            "Exploud":{
                type:["Normal"],
                color:"Blue",
                from:"Loudred",
                con:true,
                minLv:40
            }
        },
        egg:"A pink egg with several markings on the front and two yellow blotches on the sides. It makes a weird noise when touched sometimes.",
        steps:"5120"
    },{
        evos:{
            "Makuhita":{
                type:["Fighting"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Hariyama":{
                type:["Fighting"],
                color:"Brown",
                from:"Makuhita",
                con:true
            }
        },
        egg:"A yellow egg with two red circle markings on the sides. It's a bit difficult to lift up.",
        steps:"5120"
    },{
        evos:{
            "Nosepass":{
                type:["Rock"],
                color:"Gray",
                from:null,
                con:true
            },
            "Probopass":{
                type:["Rock","Steel"],
                color:"Gray",
                from:"Nosepass",
                con:false
            }
        },
        egg:"A grey egg with two dark spots and a big red blotch. The blotch resembles a nose in shape.",
        steps:"5120"
    },{
        evos:{
            "Skitty":{
                type:["Normal"],
                color:"Pink",
                from:null,
                con:true
            },
            "Delcatty":{
                type:["Normal"],
                color:"Purple",
                from:"Skitty",
                con:false
            }
        },
        egg:"A pink egg with a tan blotch on the front and bottom. It seems oddly cute in a way.",
        steps:"3840"
    },{
        evos:{
            "Sableye":{
                type:["Dark","Ghost"],
                color:"Purple",
                from:null,
                con:true
            },
            "Mega Sableye [Mega]":{
                type:["Dark","Ghost"],
                color:"Purple",
                from:"Sableye",
                con:false
            }
        },
        egg:"A purple egg with a light blue spot on the front of it. The spot shines like a pretty gem.",
        steps:"6400"
    },{
        evos:{
            "Mawile":{
                type:["Fairy","Steel"],
                color:"Black",
                from:null,
                con:true
            },
            "Mega Mawile [Mega]":{
                type:["Fairy","Steel"],
                color:"Black",
                from:"Mawile",
                con:false
            }
        },
        egg:"A grey egg with a yellow spot on the front. On the bottom, there is a band that looks like teeth. It shines like steel.",
        steps:"5120"
    },{
        evos:{
            "Aron":{
                type:["Rock","Steel"],
                color:"Gray",
                from:null,
                con:true
            },
            "Lairon":{
                type:["Rock","Steel"],
                color:"Gray",
                from:"Aron",
                con:true
            },
            "Aggron":{
                type:["Rock","Steel"],
                color:"Gray",
                from:"Lairon",
                con:true,
                minLv:42
            },
            "Mega Aggron [Mega]":{
                type:["Steel"],
                color:"Gray",
                from:"Aggron",
                con:false
            }
        },
        egg:"A grey egg that is incredibly tough. It has several markings and shines like steel.",
        steps:"8960"
    },{
        evos:{
            "Meditite":{
                type:["Fighting","Psychic"],
                color:"Blue",
                from:null,
                con:true
            },
            "Medicham":{
                type:["Fighting","Psychic"],
                color:"Red",
                from:"Meditite",
                con:true
            },
            "Mega Medicham [Mega]":{
                type:["Fighting","Psychic"],
                color:"Red",
                from:"Medicham",
                con:false
            }
        },
        egg:"An egg that is grey, blue, and dark grey from top to bottom. It shakes a bit if it's touched.",
        steps:"5120"
    },{
        evos:{
            "Electrike":{
                type:["Electric"],
                color:"Green",
                from:null,
                con:true
            },
            "Manectric":{
                type:["Electric"],
                color:"Yellow",
                from:"Electrike",
                con:true
            },
            "Mega Manectric [Mega]":{
                type:["Electric"],
                color:"Yellow",
                from:"Manectric",
                con:false
            }
        },
        egg:"A green egg with several yellow blotches on it. Touching it may shock you.",
        steps:"5120"
    },{
        evos:{
            "Plusle":{
                type:["Electric"],
                color:"Yellow",
                from:null,
                con:true
            }
        },
        egg:"A pale yellow egg with two pale red spots. It's supposed to be part of a pair.",
        steps:"5120"
    },{
        evos:{
            "Minun":{
                type:["Electric"],
                color:"Yellow",
                from:null,
                con:true
            }
        },
        egg:"A pale yellow egg with two pale blue spots. It's supposed to be part of a pair.",
        steps:"5120"
    },{
        evos:{
            "Volbeat":{
                type:["Bug"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a red band across the back. It's supposed to be part of a pair.",
        steps:"3840"
    },{
        evos:{
            "Illumise":{
                type:["Bug"],
                color:"Purple",
                from:null,
                con:true
            }
        },
        egg:"A pale blue egg with a purple band across the back. It's supposed to be part of a pair.",
        steps:"3840"
    },{
        evos:{
            "Budew":{
                type:["Grass","Poison"],
                color:"Green",
                from:null,
                con:true
            },
            "Roselia":{
                type:["Grass","Poison"],
                color:"Green",
                from:"Budew",
                con:false
            },
            "Roserade":{
                type:["Grass","Poison"],
                color:"Green",
                from:"Roselia",
                con:false
            }
        },
        egg:"An egg that is several different shades of green. It seems to enjoy sunlight.",
        steps:"5120"
    },{
        evos:{
            "Gulpin":{
                type:["Poison"],
                color:"Green",
                from:null,
                con:true
            },
            "Swalot":{
                type:["Poison"],
                color:"Purple",
                from:"Gulpin",
                con:true
            }
        },
        egg:"A pale green egg with two dark diamond-shaped spots and a yellow top. It shakes around if you bring food near it.",
        steps:"5120"
    },{
        evos:{
            "Carvanha":{
                type:["Dark","Water"],
                color:"Red",
                from:null,
                con:true
            },
            "Sharpedo":{
                type:["Dark","Water"],
                color:"Blue",
                from:"Carvanha",
                con:true
            },
            "Mega Sharpedo [Mega]":{
                type:["Dark","Water"],
                color:"Blue",
                from:"Sharpedo",
                con:false
            }
        },
        egg:"A red and blue egg with several yellow markings. It has a very rough texture that is similar to sandpaper.",
        steps:"5120"
    },{
        evos:{
            "Wailmer":{
                type:["Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Wailord":{
                type:["Water"],
                color:"Blue",
                from:"Wailmer",
                con:true
            }
        },
        egg:"An egg that is blue on top and tan on the bottom. It has a strange white marking on the front. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Numel":{
                type:["Fire","Ground"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Camerupt":{
                type:["Fire","Ground"],
                color:"Red",
                from:"Numel",
                con:true
            },
            "Mega Camerupt [Mega]":{
                type:["Fire","Ground"],
                color:"Red",
                from:"Camerupt",
                con:false
            }
        },
        egg:"An egg with a green top, yellow middle, and tan bottom. It radiates heat.",
        steps:"5120"
    },{
        evos:{
            "Torkoal":{
                type:["Fire"],
                color:"Brown",
                from:null,
                con:true
            }
        },
        egg:"A black egg covered in odd markings with a red top and two red spots. It radiates heat.",
        steps:"5120"
    },{
        evos:{
            "Spoink":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            },
            "Grumpig":{
                type:["Psychic"],
                color:"Purple",
                from:"Spoink",
                con:true
            }
        },
        egg:"A grey egg with a pink top and two pink spots. It bounces around sometimes.",
        steps:"5120"
    },{
        evos:{
            "Spinda":{
                type:["Normal"],
                color:"Brown",
                from:null,
                con:true
            }
        },
        egg:"A tan egg with a red bottom. It has a faint spiral pattern on the front. It falls over a lot as if it were dizzy.",
        steps:"3840"
    },{
        evos:{
            "Trapinch":{
                type:["Ground"],
                color:"Brown",
                from:null,
                con:true
            },
            "Vibrava":{
                type:["Dragon","Ground"],
                color:"Green",
                from:"Trapinch",
                con:true
            },
            "Flygon":{
                type:["Dragon","Ground"],
                color:"Green",
                from:"Vibrava",
                con:true
            }
        },
        egg:"An orange egg with a white band going across it. It's covered in sand.",
        steps:"5120"
    },{
        evos:{
            "Cacnea":{
                type:["Grass"],
                color:"Green",
                from:null,
                con:true
            },
            "Cacturne":{
                type:["Dark","Grass"],
                color:"Green",
                from:"Cacnea",
                con:true
            }
        },
        egg:"A green egg with several dark spots all over it. It has a bit of a prickly texture.",
        steps:"5120"
    },{
        evos:{
            "Swablu":{
                type:["Flying","Normal"],
                color:"Blue",
                from:null,
                con:true
            },
            "Altaria":{
                type:["Dragon","Flying"],
                color:"Blue",
                from:"Swablu",
                con:true
            },
            "Mega Altaria [Mega]":{
                type:["Dragon","Fairy"],
                color:"Blue",
                from:"Altaria",
                con:false
            },
            "Altaria [Constellation]":{
                type:["Dragon","Flying"],
                color:"Blue",
                from:"Altaria",
                con:false
            },
            "Altaria [Cosmic]":{
                type:["Dragon","Flying"],
                color:"Blue",
                from:"Altaria",
                con:true
            },
            "Zhenyin":{
                type:["Flying","Poison"],
                color:"Purple",
                from:"Altaria",
                con:false
            },
            "Simock":{
                type:["Dragon","Fairy"],
                color:"Blue",
                from:"Altaria",
                con:false
            },
            "Altaria [Sundae]":{
                type:["Fairy","Flying"],
                color:"White",
                from:"Altaria",
                con:false
            }
        },
        egg:"A blue egg with two white blotches on the sides. It is surprisingly light.",
        steps:"5120"
    },{
        evos:{
            "Zangoose":{
                type:["Normal"],
                color:"White",
                from:null,
                con:true
            }
        },
        egg:"A white egg with a red M-shape on it. It supposedly has a rival.",
        steps:"5120"
    },{
        evos:{
            "Seviper":{
                type:["Poison"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A dark grey egg with a purple S-shape on it. It supposedly has a rival.",
        steps:"5120"
    },{
        evos:{
            "Lunatone":{
                type:["Psychic","Rock"],
                color:"Yellow",
                from:null,
                con:true
            }
        },
        egg:"A black egg with a tan crescent moon shape on the front.",
        steps:"6400"
    },{
        evos:{
            "Solrock":{
                type:["Psychic","Rock"],
                color:"Red",
                from:null,
                con:true
            }
        },
        egg:"A light orange egg with an orange sun shape on the front.",
        steps:"6400"
    },{
        evos:{
            "Barboach":{
                type:["Ground","Water"],
                color:"Gray",
                from:null,
                con:true
            },
            "Whiscash":{
                type:["Ground","Water"],
                color:"Blue",
                from:"Barboach",
                con:true
            }
        },
        egg:"A grey egg with a dark zigzag marking. The marking could easily be mistaken for a crack. The egg is slightly damp.",
        steps:"5120"
    },{
        evos:{
            "Corphish":{
                type:["Water"],
                color:"Red",
                from:null,
                con:true
            },
            "Crawdaunt":{
                type:["Dark","Water"],
                color:"Red",
                from:"Corphish",
                con:true
            }
        },
        egg:"An orange egg with a vertical tan band running from the middle and across the bottom. It is surprisingly tough.",
        steps:"3840"
    },{
        evos:{
            "Baltoy":{
                type:["Ground","Psychic"],
                color:"Brown",
                from:null,
                con:true
            },
            "Claydol":{
                type:["Ground","Psychic"],
                color:"Black",
                from:"Baltoy",
                con:true
            }
        },
        egg:"A brown egg with a strange red pattern on it. It radiates a mysterious power.",
        steps:"5120"
    },{
        evos:{
            "Lileep":{
                type:["Grass","Rock"],
                color:"Purple",
                from:null,
                con:true
            },
            "Cradily":{
                type:["Grass","Rock"],
                color:"Green",
                from:"Lileep",
                con:true
            }
        },
        egg:"A purple egg with two odd yellow markings on it. It looks kind of creepy....",
        steps:"7680"
    },{
        evos:{
            "Anorith":{
                type:["Bug","Rock"],
                color:"Gray",
                from:null,
                con:true
            },
            "Armaldo":{
                type:["Bug","Rock"],
                color:"Gray",
                from:"Anorith",
                con:true
            }
        },
        egg:"An egg that is black on the top and dull green on the bottom. The top has two red blotches. It is incredibly tough.",
        steps:"7680"
    },{
        evos:{
            "Feebas":{
                type:["Water"],
                color:"Brown",
                from:null,
                con:true
            },
            "Milotic":{
                type:["Water"],
                color:"Pink",
                from:"Feebas",
                con:false
            }
        },
        egg:"A brown egg with several dark brown spots all over it. The egg is slightly damp.",
        steps:"5120"
    },{
        evos:{
            "Castform [Normal]":{
                type:["Normal"],
                color:"White",
                from:null,
                con:true
            },
            "Castform [Sunny]":{
                type:["Fire"],
                color:"White",
                from:"Castform [Normal]",
                con:false
            },
            "Castform [Rain]":{
                type:["Water"],
                color:"White",
                from:"Castform [Normal]",
                con:false
            },
            "Castform [Hail]":{
                type:["Ice"],
                color:"White",
                from:"Castform [Normal]",
                con:false
            }
        },
        egg:"A grey egg with an oddly-shaped white blotch on the front. It seems to react to the weather.",
        steps:"6400"
    },{
        evos:{
            "Kecleon":{
                type:["Normal"],
                color:"Green",
                from:null,
                con:true
            }
        },
        egg:"A green egg with a red zig-zag shaped band going across it. It looks like it disappears at times, if only for a second.",
        steps:"5120"
    },{
        evos:{
            "Shuppet":{
                type:["Ghost"],
                color:"Black",
                from:null,
                con:true
            },
            "Banette":{
                type:["Ghost"],
                color:"Black",
                from:"Shuppet",
                con:true
            },
            "Mega Banette [Mega]":{
                type:["Ghost"],
                color:"Black",
                from:"Banette",
                con:false
            }
        },
        egg:"A plain dull purple egg. Other than being rather light, nothing else seems very unique about it.",
        steps:"6400"
    },{
        evos:{
            "Duskull":{
                type:["Ghost"],
                color:"Black",
                from:null,
                con:true
            },
            "Dusclops":{
                type:["Ghost"],
                color:"Black",
                from:"Duskull",
                con:true
            },
            "Dusknoir":{
                type:["Ghost"],
                color:"Black",
                from:"Dusclops",
                con:false
            }
        },
        egg:"A dark grey egg that has a tan skull-like pattern on the front and a tan bone-like pattern on the back.",
        steps:"6400"
    },{
        evos:{
            "Tropius":{
                type:["Flying","Grass"],
                color:"Green",
                from:null,
                con:true
            }
        },
        egg:"An egg that is green on the top and brown on the bottom. There is a yellow blotch on the front that resembles a fruit.",
        steps:"6400"
    },{
        evos:{
            "Chingling":{
                type:["Psychic"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Chimecho":{
                type:["Psychic"],
                color:"Blue",
                from:"Chingling",
                con:false
            }
        },
        egg:"A yellow egg with a red and white band going across the top. It makes a quiet jingle sound sometimes.",
        steps:"6400"
    },{
        evos:{
            "Absol":{
                type:["Dark"],
                color:"White",
                from:null,
                con:true
            },
            "Mega Absol [Mega]":{
                type:["Dark"],
                color:"White",
                from:"Absol",
                con:false
            }
        },
        egg:"A white egg with an odd dull blue pattern on it. It seems to panic from time to time.",
        steps:"6400"
    },{
        evos:{
            "Snorunt":{
                type:["Ice"],
                color:"Gray",
                from:null,
                con:true
            },
            "Glalie":{
                type:["Ice"],
                color:"Gray",
                from:"Snorunt",
                con:true
            },
            "Mega Glalie [Mega]":{
                type:["Ice"],
                color:"Gray",
                from:"Glalie",
                con:false
            },
            "Froslass":{
                type:["Ghost","Ice"],
                color:"White",
                from:"Snorunt",
                con:false
            }
        },
        egg:"A yellow egg with a black blotch on the front that is outlined with red. It is cold to the touch.",
        steps:"5120"
    },{
        evos:{
            "Spheal":{
                type:["Ice","Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Sealeo":{
                type:["Ice","Water"],
                color:"Blue",
                from:"Spheal",
                con:true
            },
            "Walrein":{
                type:["Ice","Water"],
                color:"Blue",
                from:"Sealeo",
                con:true
            }
        },
        egg:"A blue egg with a tan blotch on the front and several white spots. It rolls around sometimes.",
        steps:"5120"
    },{
        evos:{
            "Clamperl":{
                type:["Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Huntail":{
                type:["Water"],
                color:"Blue",
                from:"Clamperl",
                con:false
            },
            "Gorebyss":{
                type:["Water"],
                color:"Pink",
                from:"Clamperl",
                con:false
            }
        },
        egg:"A pink egg with a blue bottom and top. It is surprisingly tough.",
        steps:"5120"
    },{
        evos:{
            "Relicanth":{
                type:["Rock","Water"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"An egg that is almost white. It has markings on it that resemble cracks, but it is rather tough. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Luvdisc":{
                type:["Water"],
                color:"Pink",
                from:null,
                con:true
            }
        },
        egg:"A flesh-coloured egg. It has three white spots that look similar to a little face. The egg is slightly damp.",
        steps:"5120"
    },{
        evos:{
            "Bagon":{
                type:["Dragon"],
                color:"Blue",
                from:null,
                con:true
            },
            "Shelgon":{
                type:["Dragon"],
                color:"White",
                from:"Bagon",
                con:true
            },
            "Salamence":{
                type:["Dragon","Flying"],
                color:"Blue",
                from:"Shelgon",
                con:true
            },
            "Mega Salamence [Mega]":{
                type:["Dragon","Flying"],
                color:"Blue",
                from:"Salamence",
                con:false
            }
        },
        egg:"A blue egg with an odd grey blotch on the top and a tan blotch on the bottom. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Beldum":{
                type:["Psychic","Steel"],
                color:"Blue",
                from:null,
                con:true
            },
            "Metang":{
                type:["Psychic","Steel"],
                color:"Blue",
                from:"Beldum",
                con:true
            },
            "Metagross":{
                type:["Psychic","Steel"],
                color:"Blue",
                from:"Metang",
                con:true
            },
            "Mega Metagross [Mega]":{
                type:["Psychic","Steel"],
                color:"Blue",
                from:"Metagross",
                con:false
            }
        },
        egg:"A blue egg with an oddly shaped blotch on the front. It is incredibly tough. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Regirock":{
                type:["Rock"],
                color:"Brown",
                from:null,
                con:true
            }
        },
        egg:"A tan egg with a bizarre orange dot pattern on the front. It is incredibly tough and has the texture of a rock.",
        steps:"20480"
    },{
        evos:{
            "Regice":{
                type:["Ice"],
                color:"Blue",
                from:null,
                con:true
            }
        },
        egg:"A light pale blue egg with a bizarre yellow dot pattern on the front. It is incredibly cold to the touch.",
        steps:"20480"
    },{
        evos:{
            "Registeel":{
                type:["Steel"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A dark grey egg with a bizarre pale red dot pattern on the front. It shines brightly like steel.",
        steps:"20480"
    },{
        evos:{
            "Latias":{
                type:["Dragon","Psychic"],
                color:"Red",
                from:null,
                con:true
            },
            "Mega Latias [Mega]":{
                type:["Dragon","Psychic"],
                color:"Red",
                from:"Latias",
                con:false
            }
        },
        egg:"A white egg with a bizarre pink marking on it. It radiates a mysterious power. It's supposed to be part of a pair.",
        steps:"30720"
    },{
        evos:{
            "Latios":{
                type:["Dragon","Psychic"],
                color:"Blue",
                from:null,
                con:true
            },
            "Mega Latios [Mega]":{
                type:["Dragon","Psychic"],
                color:"Blue",
                from:"Latios",
                con:false
            }
        },
        egg:"A grey egg with a bizarre blue marking on it. It radiates a mysterious power. It's supposed to be part of a pair.",
        steps:"30720"
    },{
        evos:{
            "Kyogre":{
                type:["Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Primal Kyogre [Primal]":{
                type:["Water"],
                color:"Blue",
                from:"Kyogre",
                con:false
            }
        },
        egg:"A blue egg with a bizarre red pattern on the front that glows. It seems like its presence causes it to rain lightly.",
        steps:"30720"
    },{
        evos:{
            "Groudon":{
                type:["Ground"],
                color:"Red",
                from:null,
                con:true
            },
            "Primal Groudon [Primal]":{
                type:["Fire","Ground"],
                color:"Red",
                from:"Groudon",
                con:false
            }
        },
        egg:"A red egg with a bizarre blue pattern on the front that glows. It seems like its presence causes it to become sunny.",
        steps:"30720"
    },{
        evos:{
            "Rayquaza":{
                type:["Dragon","Flying"],
                color:"Green",
                from:null,
                con:true
            },
            "Mega Rayquaza [Mega]":{
                type:["Dragon","Flying"],
                color:"Green",
                from:"Rayquaza",
                con:false
            }
        },
        egg:"A green egg with a bizarre yellow pattern on the front that glows. It seems like its presence makes the weather calm.",
        steps:"30720"
    },{
        evos:{
            "Jirachi":{
                type:["Psychic","Steel"],
                color:"Yellow",
                from:null,
                con:true
            }
        },
        egg:"A white egg with a yellow top and a blue marking. It has a brilliant sheen.",
        steps:"30720"
    },{
        evos:{
            "Deoxys [Normal]":{
                type:["Psychic"],
                color:"Red",
                from:null,
                con:true
            }
        },
        egg:"A red-orange egg with a bizarre black patch on the bottom. The blueish-purple spot on the front shines like a gem.",
        steps:"30720"
    },{
        evos:{
            "Deoxys [Attack]":{
                type:["Psychic"],
                color:"Red",
                from:null,
                con:true
            }
        },
        egg:"A black egg with a bizarre pattern that also consists of a red-orange band. The blueish-purple spot on the front shines like a gem. It feels like it is radiating an incredible power.",
        steps:"30720"
    },{
        evos:{
            "Deoxys [Defense]":{
                type:["Psychic"],
                color:"Red",
                from:null,
                con:true
            }
        },
        egg:"A red-orange egg with teal markings on it. The blueish-purple spot on the front shines like a gem. It is incredibly tough.",
        steps:"30720"
    },{
        evos:{
            "Deoxys [Speed]":{
                type:["Psychic"],
                color:"Red",
                from:null,
                con:true
            }
        },
        egg:"A black egg with a bizarre pattern. The blueish-purple spot on the front shines like a gem. It moves around sometimes like it's in a hurry to go somewhere.",
        steps:"30720"
    },{
        evos:{
            "Turtwig":{
                type:["Grass"],
                color:"Green",
                from:null,
                con:true
            },
            "Grotle":{
                type:["Grass"],
                color:"Green",
                from:"Turtwig",
                con:true
            },
            "Torterra":{
                type:["Grass","Ground"],
                color:"Green",
                from:"Grotle",
                con:true
            }
        },
        egg:"This egg is brown, pale green, and yellow from top to bottom. Something seems vaguely familiar about it....",
        steps:"5120"
    },{
        evos:{
            "Chimchar":{
                type:["Fire"],
                color:"Brown",
                from:null,
                con:true
            },
            "Monferno":{
                type:["Fighting","Fire"],
                color:"Brown",
                from:"Chimchar",
                con:true,
                minLv:14
            },
            "Infernape":{
                type:["Fighting","Fire"],
                color:"Brown",
                from:"Monferno",
                con:true
            }
        },
        egg:"An orange egg with a big tan blotch on the front. Something seems vaguely familiar about it....",
        steps:"5120"
    },{
        evos:{
            "Piplup":{
                type:["Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Prinplup":{
                type:["Water"],
                color:"Blue",
                from:"Piplup",
                con:true
            },
            "Empoleon":{
                type:["Steel","Water"],
                color:"Blue",
                from:"Prinplup",
                con:true
            }
        },
        egg:"A blue egg with white and light blue blotches on the bottom. Something seems vaguely familiar about it....",
        steps:"5120"
    },{
        evos:{
            "Starly":{
                type:["Flying","Normal"],
                color:"Brown",
                from:null,
                con:true
            },
            "Staravia":{
                type:["Flying","Normal"],
                color:"Brown",
                from:"Starly",
                con:true
            },
            "Staraptor":{
                type:["Flying","Normal"],
                color:"Brown",
                from:"Staravia",
                con:true
            }
        },
        egg:"A dark grey egg with a huge white blotch on the front and across the bottom. It's said to be the egg of a common bird.",
        steps:"3840"
    },{
        evos:{
            "Bidoof":{
                type:["Normal"],
                color:"Brown",
                from:null,
                con:true
            },
            "Bibarel":{
                type:["Normal","Water"],
                color:"Brown",
                from:"Bidoof",
                con:true
            }
        },
        egg:"A brown egg with a marking on the front that consists of tan, dark brown, red, and white. It doesn't react to anything at all.",
        steps:"3840"
    },{
        evos:{
            "Kricketot":{
                type:["Bug"],
                color:"Red",
                from:null,
                con:true
            },
            "Kricketune":{
                type:["Bug"],
                color:"Red",
                from:"Kricketot",
                con:true
            }
        },
        egg:"A dull brown egg that is pale red and pale yellow on the bottom half. Said to be the egg of some sort of bug.",
        steps:"3840"
    },{
        evos:{
            "Shinx":{
                type:["Electric"],
                color:"Blue",
                from:null,
                con:true
            },
            "Luxio":{
                type:["Electric"],
                color:"Blue",
                from:"Shinx",
                con:true
            },
            "Luxray":{
                type:["Electric"],
                color:"Blue",
                from:"Luxio",
                con:true
            }
        },
        egg:"A dull dark blue egg with a yellow x-like shape on the front. Touching it may shock you.",
        steps:"5120"
    },{
        evos:{
            "Cranidos":{
                type:["Rock"],
                color:"Blue",
                from:null,
                con:true
            },
            "Rampardos":{
                type:["Rock"],
                color:"Blue",
                from:"Cranidos",
                con:true
            }
        },
        egg:"A grey egg that has an odd blue marking on the top. The blue marking is very hard.",
        steps:"7680"
    },{
        evos:{
            "Shieldon":{
                type:["Rock","Steel"],
                color:"Gray",
                from:null,
                con:true
            },
            "Bastiodon":{
                type:["Rock","Steel"],
                color:"Gray",
                from:"Shieldon",
                con:true
            }
        },
        egg:"A black egg with odd silver markings on it. It is incredibly tough.",
        steps:"7680"
    },{
        evos:{
            "Burmy [Grass]":{
                type:["Bug"],
                color:"Gray",
                from:null,
                con:true
            },
            "Burmy [Cloakless]":{
                type:["Bug"],
                color:"Gray",
                from:"Burmy [Grass]",
                con:false
            }
        },
        egg:"An egg that is grey on the top and green on the bottom. There are supposed to be two other eggs similar to it.",
        steps:"3840"
    },{
        evos:{
            "Burmy [Ground]":{
                type:["Bug"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"An egg that is grey on the top and tan on the bottom. There are supposed to be two other eggs similar to it.",
        steps:"3840"
    },{
        evos:{
            "Burmy [Steel]":{
                type:["Bug"],
                color:"Gray",
                from:null,
                con:true
            },
            "Wormadam [Grass]":{
                type:["Bug","Grass"],
                color:"Gray",
                from:"Burmy [Grass]",
                con:false
            },
            "Wormadam [Ground]":{
                type:["Bug","Ground"],
                color:"Gray",
                from:"Burmy [Ground]",
                con:false
            },
            "Wormadam [Steel]":{
                type:["Bug","Steel"],
                color:"Gray",
                from:"Burmy [Steel]",
                con:false
            },
            "Mothim":{
                type:["Bug","Flying"],
                color:"Yellow",
                from:"Burmy [Grass]",
                con:false
            }
        },
        egg:"An egg that is grey on the top and pink on the bottom. There are supposed to be two other eggs similar to it.",
        steps:"3840"
    },{
        evos:{
            "Combee":{
                type:["Bug","Flying"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Vespiquen":{
                type:["Bug","Flying"],
                color:"Yellow",
                from:"Combee",
                con:false
            }
        },
        egg:"A gold egg with two black stripes running across it. It makes a buzzing noise sometimes.",
        steps:"3840"
    },{
        evos:{
            "Pachirisu":{
                type:["Electric"],
                color:"White",
                from:null,
                con:true
            }
        },
        egg:"A white egg with a blue blotch on the top and two yellow spots near the bottom. Touching it may shock you.",
        steps:"2560"
    },{
        evos:{
            "Buizel":{
                type:["Water"],
                color:"Brown",
                from:null,
                con:true
            },
            "Floatzel":{
                type:["Water"],
                color:"Brown",
                from:"Buizel",
                con:true
            }
        },
        egg:"An orange egg with two small tan blotches on the front. The egg is slightly damp.",
        steps:"5120"
    },{
        evos:{
            "Cherubi":{
                type:["Grass"],
                color:"Pink",
                from:null,
                con:true
            },
            "Cherrim [Bud]":{
                type:["Grass"],
                color:"Pink",
                from:"Cherubi",
                con:false
            },
            "Cherrim [Sunny]":{
                type:["Grass"],
                color:"Pink",
                from:"Cherrim [Bud]",
                con:false
            },
            "Cherrim [Damp]":{
                type:["Grass","Water"],
                color:"Blue",
                from:"Cherrim [Sunny]",
                con:false
            },
            "Cherrim [Frost]":{
                type:["Grass","Ice"],
                color:"Blue",
                from:"Cherrim [Bud]",
                con:false
            },
            "Cherrim [Heat]":{
                type:["Fire","Grass"],
                color:"Brown",
                from:"Cherrim [Sunny]",
                con:false
            }
        },
        egg:"A pink egg with a green blotch on the top. It appears to react to sunlight.",
        steps:"5120"
    },{
        evos:{
            "Shellos [West]":{
                type:["Water"],
                color:"Purple",
                from:null,
                con:true
            }
        },
        egg:"An egg with a pink top and white bottom that is divided by a yellow band. It's completely covered in slime....",
        steps:"5120"
    },{
        evos:{
            "Shellos [East]":{
                type:["Water"],
                color:"Purple",
                from:null,
                con:true
            },
            "Gastrodon [West]":{
                type:["Ground","Water"],
                color:"Purple",
                from:"Shellos [West]",
                con:true
            },
            "Gastrodon [East]":{
                type:["Ground","Water"],
                color:"Purple",
                from:"Shellos [East]",
                con:true
            }
        },
        egg:"An egg with a blue top and green bottom that is divided by a yellow band. It's completely covered in slime....",
        steps:"5120"
    },{
        evos:{
            "Drifloon":{
                type:["Flying","Ghost"],
                color:"Purple",
                from:null,
                con:true
            },
            "Drifblim":{
                type:["Flying","Ghost"],
                color:"Purple",
                from:"Drifloon",
                con:true
            }
        },
        egg:"A purple egg with a yellow x-shape on it. It is surprisingly light.",
        steps:"7680"
    },{
        evos:{
            "Buneary":{
                type:["Normal"],
                color:"Brown",
                from:null,
                con:true
            },
            "Lopunny":{
                type:["Normal"],
                color:"Brown",
                from:"Buneary",
                con:false
            },
            "Mega Lopunny [Mega]":{
                type:["Fighting","Normal"],
                color:"Brown",
                from:"Lopunny",
                con:false
            }
        },
        egg:"A brown egg with two tan blotches on the sides. It bounces around sometimes.",
        steps:"5120"
    },{
        evos:{
            "Glameow":{
                type:["Normal"],
                color:"Gray",
                from:null,
                con:true
            },
            "Purugly":{
                type:["Normal"],
                color:"Gray",
                from:"Glameow",
                con:true
            }
        },
        egg:"A pale blue egg with a few white blotches all over it. It makes an odd purring noise when touched sometimes.",
        steps:"5120"
    },{
        evos:{
            "Stunky":{
                type:["Dark","Poison"],
                color:"Purple",
                from:null,
                con:true
            },
            "Skuntank":{
                type:["Dark","Poison"],
                color:"Purple",
                from:"Stunky",
                con:true
            }
        },
        egg:"From the foul smell that comes from this purple and tan egg, you'd think it was rotten....",
        steps:"5120"
    },{
        evos:{
            "Bronzor":{
                type:["Psychic","Steel"],
                color:"Green",
                from:null,
                con:true
            },
            "Bronzong":{
                type:["Psychic","Steel"],
                color:"Green",
                from:"Bronzor",
                con:true
            }
        },
        egg:"A blue egg with an odd pattern on the front that shines like steel. It is incredibly tough.",
        steps:"5120"
    },{
        evos:{
            "Chatot":{
                type:["Flying","Normal"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"An egg that is a colourful mixture of white, blue, yellow, and green. It makes a strange noise when touched.",
        steps:"5120"
    },{
        evos:{
            "Spiritomb":{
                type:["Dark","Ghost"],
                color:"Purple",
                from:null,
                con:true
            }
        },
        egg:"A purple egg with several small green spots all over it. It glows eerily....",
        steps:"7680"
    },{
        evos:{
            "Gible":{
                type:["Dragon","Ground"],
                color:"Blue",
                from:null,
                con:true
            },
            "Gabite":{
                type:["Dragon","Ground"],
                color:"Blue",
                from:"Gible",
                con:true
            },
            "Garchomp":{
                type:["Dragon","Ground"],
                color:"Blue",
                from:"Gabite",
                con:true
            },
            "Mega Garchomp [Mega]":{
                type:["Dragon","Ground"],
                color:"Blue",
                from:"Garchomp",
                con:false
            }
        },
        egg:"An egg that is teal on the top and orange on the bottom. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Riolu":{
                type:["Fighting"],
                color:"Blue",
                from:null,
                con:true
            },
            "Lucario":{
                type:["Fighting","Steel"],
                color:"Blue",
                from:"Riolu",
                con:false
            },
            "Mega Lucario [Mega]":{
                type:["Fighting","Steel"],
                color:"Blue",
                from:"Lucario",
                con:false
            }
        },
        egg:"A bold blue egg with a dark grey pattern on it. A faint aura appears around it sometimes.",
        steps:"6400"
    },{
        evos:{
            "Hippopotas":{
                type:["Ground"],
                color:"Brown",
                from:null,
                con:true
            },
            "Hippowdon":{
                type:["Ground"],
                color:"Brown",
                from:"Hippopotas",
                con:true
            }
        },
        egg:"A tan egg with two darker spots on it. It's covered in sand.",
        steps:"7680"
    },{
        evos:{
            "Skorupi":{
                type:["Bug","Poison"],
                color:"Purple",
                from:null,
                con:true
            },
            "Drapion":{
                type:["Dark","Poison"],
                color:"Purple",
                from:"Skorupi",
                con:true
            }
        },
        egg:"A dark purple egg with two turquoise spots near the top. It might hop around a bit when touched.",
        steps:"5120"
    },{
        evos:{
            "Croagunk":{
                type:["Fighting","Poison"],
                color:"Blue",
                from:null,
                con:true
            },
            "Toxicroak":{
                type:["Fighting","Poison"],
                color:"Blue",
                from:"Croagunk",
                con:true
            }
        },
        egg:"A dark dull blue egg with a white band going across the bottom of it. It has a very dry surface.",
        steps:"2560"
    },{
        evos:{
            "Carnivine":{
                type:["Grass"],
                color:"Green",
                from:null,
                con:true
            }
        },
        egg:"A dull green egg with several darker spots on it. It shakes if it is touched sometimes. It's supposed to be the egg of a plant.",
        steps:"6400"
    },{
        evos:{
            "Finneon":{
                type:["Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Lumineon":{
                type:["Water"],
                color:"Blue",
                from:"Finneon",
                con:true
            }
        },
        egg:"An egg that is dark blue on top and light blue on the bottom. The two colours are separated by a pink line. The egg is slightly damp.",
        steps:"5120"
    },{
        evos:{
            "Snover":{
                type:["Grass","Ice"],
                color:"White",
                from:null,
                con:true
            },
            "Abomasnow":{
                type:["Grass","Ice"],
                color:"White",
                from:"Snover",
                con:true
            },
            "Mega Abomasnow [Mega]":{
                type:["Grass","Ice"],
                color:"White",
                from:"Abomasnow",
                con:false
            }
        },
        egg:"An egg that is grey on the top and brown on the bottom. It is cold to the touch.",
        steps:"5120"
    },{
        evos:{
            "Rotom [Normal]":{
                type:["Electric","Ghost"],
                color:"Red",
                from:null,
                con:true
            },
            "Rotom [Heat]":{
                type:["Electric","Fire"],
                color:"Red",
                from:"Rotom [Normal]",
                con:false
            },
            "Rotom [Wash]":{
                type:["Electric","Water"],
                color:"Red",
                from:"Rotom [Normal]",
                con:false
            },
            "Rotom [Freeze]":{
                type:["Electric","Ice"],
                color:"Red",
                from:"Rotom [Normal]",
                con:false
            },
            "Rotom [Fan]":{
                type:["Electric","Flying"],
                color:"Red",
                from:"Rotom [Normal]",
                con:false
            },
            "Rotom [Mow]":{
                type:["Electric","Grass"],
                color:"Red",
                from:"Rotom [Normal]",
                con:false
            },
            "Rotom [Dex]":{
                type:["Electric","Ghost"],
                color:"Red",
                from:"Rotom [Normal]",
                con:false
            }
        },
        egg:"A light blue egg with a big orange blotch on the front. Touching it may shock you.",
        steps:"5120"
    },{
        evos:{
            "Uxie":{
                type:["Psychic"],
                color:"Yellow",
                from:null,
                con:true
            }
        },
        egg:"A tan egg with a small red spot and a light pale blue swirl on the bottom. Said to be part of a trio.",
        steps:"20480"
    },{
        evos:{
            "Mesprit":{
                type:["Psychic"],
                color:"Pink",
                from:null,
                con:true
            }
        },
        egg:"A pink egg with a small red spot and a light pale blue blotch on the bottom. Said to be part of a trio.",
        steps:"20480"
    },{
        evos:{
            "Azelf":{
                type:["Psychic"],
                color:"Blue",
                from:null,
                con:true
            }
        },
        egg:"A blue egg with a small red spot and a light pale blue blotch on the bottom. Said to be part of a trio.",
        steps:"20480"
    },{
        evos:{
            "Dialga":{
                type:["Steel","Dragon"],
                color:"White",
                from:null,
                con:true
            },
            "Dialga [Origin]":{
                type:["Steel","Dragon"],
                color:"Blue",
                from:"Dialga",
                con:true
            }
        },
        egg:"A grey egg with a bizarre pattern. There is a blue spot in the middle that shines like a gem. It seems like time around it is being affected by its presence.",
        steps:"30720"
    },{
        evos:{
            "Palkia":{
                type:["Water","Dragon"],
                color:"Purple",
                from:null,
                con:true
            },
            "Palkia [Origin]":{
                type:["Water","Dragon"],
                color:"Purple",
                from:"Palkia",
                con:true
            }
        },
        egg:"A white and purple egg with a bizarre pattern. There is a red spot in the middle that shines like a gem. It feels like the space around it is being affected by its presence.",
        steps:"30720"
    },{
        evos:{
            "Heatran":{
                type:["Fire","Steel"],
                color:"Brown",
                from:null,
                con:true
            }
        },
        egg:"A grey egg that is shiny like steel. It has bizarre markings and two dark red spots. It's often hard to approach due to radiating an incredible amount of heat.",
        steps:"2560"
    },{
        evos:{
            "Regigigas":{
                type:["Normal"],
                color:"White",
                from:null,
                con:true
            }
        },
        egg:"A yellow egg with a green spot on the side and a bizarre black dot pattern on the front. It is incredibly heavy.",
        steps:"30720"
    },{
        evos:{
            "Giratina [Another]":{
                type:["Dragon","Ghost"],
                color:"Black",
                from:null,
                con:true
            },
            "Giratina [Origin]":{
                type:["Dragon","Ghost"],
                color:"Black",
                from:"Giratina [Another]",
                con:false
            }
        },
        egg:"A grey and yellow egg. It has bizarre markings and two red spots like eyes. It gives off a very eerie and uncomfortable vibe....",
        steps:"30720"
    },{
        evos:{
            "Cresselia":{
                type:["Psychic"],
                color:"Yellow",
                from:null,
                con:true
            }
        },
        egg:"A purple egg with a bizarre yellow band on it that resembles a crescent moon. It radiates a mysterious power.",
        steps:"30720"
    },{
        evos:{
            "Phione":{
                type:["Water"],
                color:"Blue",
                from:null,
                con:true
            }
        },
        egg:"A light blue egg with two small darker spots on it. The egg is slightly damp.",
        steps:"10240"
    },{
        evos:{
            "Manaphy":{
                type:["Water"],
                color:"Blue",
                from:null,
                con:true
            }
        },
        egg:"A transparent blue egg with many yellow spots and a red centre. It is frequently illustrated in books and said to be from the bottom of the sea.",
        steps:"2560"
    },{
        evos:{
            "Darkrai":{
                type:["Dark"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A white egg with a black pattern. The power that it radiates feels incredibly dark. Standing around it for too long can make you very drowsy....",
        steps:"30720"
    },{
        evos:{
            "Shaymin [Land]":{
                type:["Grass"],
                color:"Green",
                from:null,
                con:true
            },
            "Shaymin [Sky]":{
                type:["Flying","Grass"],
                color:"Green",
                from:"Shaymin [Land]",
                con:false
            }
        },
        egg:"A green egg with a cute little pink flower pattern on the side. Any flowers near it bloom beautifully.",
        steps:"30720"
    },{
        evos:{
            "Arceus":{
                type:["Normal"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A white egg with a bizarre golden blotch on the back. An amazing power radiates from it. It glows brilliantly.",
        steps:"30720"
    },{
        evos:{
            "Arceus [Bug]":{
                type:["Bug"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A white egg with a bizarre golden blotch on the back. An amazing power radiates from it. It glows brilliantly.",
        steps:"30720"
    },{
        evos:{
            "Arceus [Dark]":{
                type:["Dark"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A white egg with a bizarre golden blotch on the back. An amazing power radiates from it. It glows brilliantly.",
        steps:"30720"
    },{
        evos:{
            "Arceus [Dragon]":{
                type:["Dragon"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A white egg with a bizarre golden blotch on the back. An amazing power radiates from it. It glows brilliantly.",
        steps:"30720"
    },{
        evos:{
            "Arceus [Electric]":{
                type:["Electric"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A white egg with a bizarre golden blotch on the back. An amazing power radiates from it. It glows brilliantly.",
        steps:"30720"
    },{
        evos:{
            "Arceus [Fairy]":{
                type:["Fairy"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A white egg with a bizarre golden blotch on the back. An amazing power radiates from it. It glows brilliantly.",
        steps:"30720"
    },{
        evos:{
            "Arceus [Fighting]":{
                type:["Fighting"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A white egg with a bizarre golden blotch on the back. An amazing power radiates from it. It glows brilliantly.",
        steps:"30720"
    },{
        evos:{
            "Arceus [Fire]":{
                type:["Fire"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A white egg with a bizarre golden blotch on the back. An amazing power radiates from it. It glows brilliantly.",
        steps:"30720"
    },{
        evos:{
            "Arceus [Flying]":{
                type:["Flying"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A white egg with a bizarre golden blotch on the back. An amazing power radiates from it. It glows brilliantly.",
        steps:"30720"
    },{
        evos:{
            "Arceus [Ghost]":{
                type:["Ghost"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A white egg with a bizarre golden blotch on the back. An amazing power radiates from it. It glows brilliantly.",
        steps:"30720"
    },{
        evos:{
            "Arceus [Grass]":{
                type:["Grass"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A white egg with a bizarre golden blotch on the back. An amazing power radiates from it. It glows brilliantly.",
        steps:"30720"
    },{
        evos:{
            "Arceus [Ground]":{
                type:["Ground"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A white egg with a bizarre golden blotch on the back. An amazing power radiates from it. It glows brilliantly.",
        steps:"30720"
    },{
        evos:{
            "Arceus [Ice]":{
                type:["Ice"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A white egg with a bizarre golden blotch on the back. An amazing power radiates from it. It glows brilliantly.",
        steps:"30720"
    },{
        evos:{
            "Arceus [Poison]":{
                type:["Poison"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A white egg with a bizarre golden blotch on the back. An amazing power radiates from it. It glows brilliantly.",
        steps:"30720"
    },{
        evos:{
            "Arceus [Psychic]":{
                type:["Psychic"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A white egg with a bizarre golden blotch on the back. An amazing power radiates from it. It glows brilliantly.",
        steps:"30720"
    },{
        evos:{
            "Arceus [Rock]":{
                type:["Rock"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A white egg with a bizarre golden blotch on the back. An amazing power radiates from it. It glows brilliantly.",
        steps:"30720"
    },{
        evos:{
            "Arceus [Steel]":{
                type:["Steel"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A white egg with a bizarre golden blotch on the back. An amazing power radiates from it. It glows brilliantly.",
        steps:"30720"
    },{
        evos:{
            "Arceus [Water]":{
                type:["Water"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A white egg with a bizarre golden blotch on the back. An amazing power radiates from it. It glows brilliantly.",
        steps:"30720"
    },{
        evos:{
            "Victini":{
                type:["Fire","Psychic"],
                color:"Yellow",
                from:null,
                con:true
            }
        },
        egg:"A tan and bold orange egg with a unique pattern on it. It radiates a ton of heat.",
        steps:"30720"
    },{
        evos:{
            "Snivy":{
                type:["Grass"],
                color:"Green",
                from:null,
                con:true
            },
            "Servine":{
                type:["Grass"],
                color:"Green",
                from:"Snivy",
                con:true
            },
            "Serperior":{
                type:["Grass"],
                color:"Green",
                from:"Servine",
                con:true
            }
        },
        egg:"A bold green egg that is decorated with fanciful yellow swirls.",
        steps:"5120"
    },{
        evos:{
            "Tepig":{
                type:["Fire"],
                color:"Red",
                from:null,
                con:true
            },
            "Pignite":{
                type:["Fighting","Fire"],
                color:"Red",
                from:"Tepig",
                con:true
            },
            "Emboar":{
                type:["Fighting","Fire"],
                color:"Red",
                from:"Pignite",
                con:true
            }
        },
        egg:"A rather warm egg whose colours consist of yellow, black, and orange.",
        steps:"5120"
    },{
        evos:{
            "Oshawott":{
                type:["Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Dewott":{
                type:["Water"],
                color:"Blue",
                from:"Oshawott",
                con:true
            },
            "Samurott":{
                type:["Water"],
                color:"Blue",
                from:"Dewott",
                con:true
            },
            "Hisuian Samurott":{
                type:["Dark","Water"],
                color:"Blue",
                from:"Dewott",
                con:true
            }
        },
        egg:"A blue egg that, oddly enough, appears to have a seashell on it.",
        steps:"5120"
    },{
        evos:{
            "Patrat":{
                type:["Normal"],
                color:"Brown",
                from:null,
                con:true
            },
            "Watchog":{
                type:["Normal"],
                color:"Brown",
                from:"Patrat",
                con:true
            }
        },
        egg:"A brown egg with strange tan and black markings. It hops around a bit if you touch it.",
        steps:"3840"
    },{
        evos:{
            "Lillipup":{
                type:["Normal"],
                color:"Brown",
                from:null,
                con:true
            },
            "Herdier":{
                type:["Normal"],
                color:"Gray",
                from:"Lillipup",
                con:true
            },
            "Stoutland":{
                type:["Normal"],
                color:"Gray",
                from:"Herdier",
                con:true
            }
        },
        egg:"A brown egg with a big black marking on the front. It hops around if you touch it.",
        steps:"3840"
    },{
        evos:{
            "Purrloin":{
                type:["Dark"],
                color:"Purple",
                from:null,
                con:true
            },
            "Liepard":{
                type:["Dark"],
                color:"Purple",
                from:"Purrloin",
                con:true
            }
        },
        egg:"A dark purple egg covered in strange yellow spots. It keeps making weird noises.",
        steps:"5120"
    },{
        evos:{
            "Pansage":{
                type:["Grass"],
                color:"Green",
                from:null,
                con:true
            },
            "Simisage":{
                type:["Grass"],
                color:"Green",
                from:"Pansage",
                con:false
            }
        },
        egg:"A tan egg with a green print on the front. Said to be part of a trio.",
        steps:"5120"
    },{
        evos:{
            "Pansear":{
                type:["Fire"],
                color:"Red",
                from:null,
                con:true
            },
            "Simisear":{
                type:["Fire"],
                color:"Red",
                from:"Pansear",
                con:false
            }
        },
        egg:"A tan egg with an orange print on the front. Said to be part of a trio.",
        steps:"5120"
    },{
        evos:{
            "Panpour":{
                type:["Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Simipour":{
                type:["Water"],
                color:"Blue",
                from:"Panpour",
                con:false
            }
        },
        egg:"A tan egg with a blue print on the front. Said to be part of a trio.",
        steps:"5120"
    },{
        evos:{
            "Munna":{
                type:["Psychic"],
                color:"Pink",
                from:null,
                con:true
            },
            "Musharna":{
                type:["Psychic"],
                color:"Pink",
                from:"Munna",
                con:false
            }
        },
        egg:"A pink egg with a purple floral pattern on it. Being around it makes you feel sleepy.",
        steps:"2560"
    },{
        evos:{
            "Pidove":{
                type:["Flying","Normal"],
                color:"Gray",
                from:null,
                con:true
            },
            "Tranquill":{
                type:["Flying","Normal"],
                color:"Gray",
                from:"Pidove",
                con:true
            },
            "Unfezant":{
                type:["Flying","Normal"],
                color:"Gray",
                from:"Tranquill",
                con:true
            }
        },
        egg:"A grey egg with a lighter blotch on the front. It hops around if you touch it.",
        steps:"3840"
    },{
        evos:{
            "Blitzle":{
                type:["Electric"],
                color:"Black",
                from:null,
                con:true
            },
            "Zebstrika":{
                type:["Electric"],
                color:"Black",
                from:"Blitzle",
                con:true
            }
        },
        egg:"A black egg with a striking white pattern on it. It might shock you if you touch it.",
        steps:"5120"
    },{
        evos:{
            "Roggenrola":{
                type:["Rock"],
                color:"Blue",
                from:null,
                con:true
            },
            "Boldore":{
                type:["Rock"],
                color:"Blue",
                from:"Roggenrola",
                con:true
            },
            "Gigalith":{
                type:["Rock"],
                color:"Blue",
                from:"Boldore",
                con:false
            }
        },
        egg:"A dark blue egg with a yellow mark on the front. It's as hard as a rock.",
        steps:"3840"
    },{
        evos:{
            "Woobat":{
                type:["Flying","Psychic"],
                color:"Blue",
                from:null,
                con:true
            },
            "Swoobat":{
                type:["Flying","Psychic"],
                color:"Blue",
                from:"Woobat",
                con:false
            }
        },
        egg:"A light blue egg with a strange pink ball on the top. The ball has a heart shape on it.",
        steps:"3840"
    },{
        evos:{
            "Drilbur":{
                type:["Ground"],
                color:"Gray",
                from:null,
                con:true
            },
            "Excadrill":{
                type:["Ground","Steel"],
                color:"Gray",
                from:"Drilbur",
                con:true
            }
        },
        egg:"A black egg with a blue pattern going around it. It's completely covered in dirt.",
        steps:"5120"
    },{
        evos:{
            "Audino":{
                type:["Normal"],
                color:"Pink",
                from:null,
                con:true
            },
            "Mega Audino [Mega]":{
                type:["Fairy","Normal"],
                color:"Pink",
                from:"Audino",
                con:false
            }
        },
        egg:"A tan egg with a light pink pattern wrapping around it. It has an odd, comforting feel.",
        steps:"5120"
    },{
        evos:{
            "Timburr":{
                type:["Fighting"],
                color:"Gray",
                from:null,
                con:true
            },
            "Gurdurr":{
                type:["Fighting"],
                color:"Gray",
                from:"Timburr",
                con:true
            },
            "Conkeldurr":{
                type:["Fighting"],
                color:"Brown",
                from:"Gurdurr",
                con:false
            }
        },
        egg:"A brown egg that looks like it has a pink vein on its side. It's surprisingly tough.",
        steps:"5120"
    },{
        evos:{
            "Tympole":{
                type:["Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Palpitoad":{
                type:["Ground","Water"],
                color:"Blue",
                from:"Tympole",
                con:true
            },
            "Seismitoad":{
                type:["Ground","Water"],
                color:"Blue",
                from:"Palpitoad",
                con:true
            }
        },
        egg:"A bold blue egg that has a line of bumps on it. It's always making weird noises.",
        steps:"5120"
    },{
        evos:{
            "Throh":{
                type:["Fighting"],
                color:"Red",
                from:null,
                con:true
            }
        },
        egg:"A red egg with an odd black marking on the front. It's a bit on the heavy side.",
        steps:"5120"
    },{
        evos:{
            "Sawk":{
                type:["Fighting"],
                color:"Blue",
                from:null,
                con:true
            }
        },
        egg:"A blue egg with an odd black marking on the front. It's a bit on the heavy side.",
        steps:"5120"
    },{
        evos:{
            "Sewaddle":{
                type:["Bug","Grass"],
                color:"Green",
                from:null,
                con:true
            },
            "Swadloon":{
                type:["Bug","Grass"],
                color:"Green",
                from:"Sewaddle",
                con:true
            },
            "Leavanny":{
                type:["Bug","Grass"],
                color:"Green",
                from:"Swadloon",
                con:false
            }
        },
        egg:"A green egg that looks more like a curled up leaf than an actual egg.",
        steps:"3840"
    },{
        evos:{
            "Venipede":{
                type:["Bug","Poison"],
                color:"Red",
                from:null,
                con:true
            },
            "Whirlipede":{
                type:["Bug","Poison"],
                color:"Gray",
                from:"Venipede",
                con:true
            },
            "Scolipede":{
                type:["Bug","Poison"],
                color:"Red",
                from:"Whirlipede",
                con:true
            }
        },
        egg:"A red egg with a strange green pattern wrapping around it. Said to be the egg of a bug.",
        steps:"3840"
    },{
        evos:{
            "Cottonee":{
                type:["Fairy","Grass"],
                color:"Green",
                from:null,
                con:true
            },
            "Whimsicott":{
                type:["Fairy","Grass"],
                color:"Green",
                from:"Cottonee",
                con:false
            }
        },
        egg:"A white egg with a soft texture. There's a strange green protrusion on the front of the egg.",
        steps:"5120"
    },{
        evos:{
            "Petilil":{
                type:["Grass"],
                color:"Gray",
                from:null,
                con:true
            },
            "Lilligant":{
                type:["Grass"],
                color:"Green",
                from:"Petilil",
                con:false
            },
            "Hisuian Lilligant":{
                type:["Grass","Fighting"],
                color:"Green",
                from:"Petilil",
                con:false
            }
        },
        egg:"A white egg with a pretty light green pattern wrapping around it. It hops around sometimes.",
        steps:"5120"
    },{
        evos:{
            "Basculin [Red]":{
                type:["Water"],
                color:"Green",
                from:null,
                con:true
            }
        },
        egg:"A green egg with a big red stripe on it. It might hop closer to you if you touch it.",
        steps:"10240"
    },{
        evos:{
            "Basculin [Blue]":{
                type:["Water"],
                color:"Green",
                from:null,
                con:true
            }
        },
        egg:"A green egg with a big blue stripe on it. It might hop closer to you if you touch it.",
        steps:"10240"
    },{
        evos:{
            "Basculin [White]":{
                type:["Water"],
                color:"Green",
                from:null,
                con:true
            },
            "Basculegion":{
                type:["Water","Ghost"],
                color:"Green",
                from:"Basculin [White]",
                con:false
            }
        },
        egg:"A green egg with a big white stripe on it. It might hop closer to you if you touch it.",
        steps:"10240"
    },{
        evos:{
            "Sandile":{
                type:["Dark","Ground"],
                color:"Brown",
                from:null,
                con:true
            },
            "Krokorok":{
                type:["Dark","Ground"],
                color:"Brown",
                from:"Sandile",
                con:true
            },
            "Krookodile":{
                type:["Dark","Ground"],
                color:"Red",
                from:"Krokorok",
                con:true
            }
        },
        egg:"A brown egg with a strange black marking on the front. It's completely covered in sand.",
        steps:"5120"
    },{
        evos:{
            "Darumaka":{
                type:["Fire"],
                color:"Red",
                from:null,
                con:true
            },
            "Darmanitan [Normal]":{
                type:["Fire"],
                color:"Red",
                from:"Darumaka",
                con:true
            },
            "Darmanitan [Daruma]":{
                type:["Fire","Psychic"],
                color:"Blue",
                from:"Darmanitan [Normal]",
                con:false
            }
        },
        egg:"A bright red egg with yellow markings all over it. It's hot to the touch.",
        steps:"5120"
    },{
        evos:{
            "Galarian Darumaka":{
                type:["Ice"],
                color:"White",
                from:null,
                con:true
            },
            "Galarian Darmanitan [Normal]":{
                type:["Ice"],
                color:"White",
                from:"Galarian Darumaka",
                con:false
            },
            "Galarian Darmanitan [Zen Mode]":{
                type:["Fire","Ice"],
                color:"White",
                from:"Galarian Darmanitan [Normal]",
                con:false
            }
        },
        egg:"A white egg that is covered in various blue crystals. It's cold to the touch.",
        steps:"5120"
    },{
        evos:{
            "Maractus":{
                type:["Grass"],
                color:"Green",
                from:null,
                con:true
            }
        },
        egg:"A green egg with pointy yellow spikes towards the top. It's supposed to be the egg of a plant.",
        steps:"5120"
    },{
        evos:{
            "Dwebble":{
                type:["Bug","Rock"],
                color:"Red",
                from:null,
                con:true
            },
            "Crustle":{
                type:["Bug","Rock"],
                color:"Red",
                from:"Dwebble",
                con:true
            }
        },
        egg:"A brown egg that looks a lot like a chunk out of a rock. It's a bit on the heavy side.",
        steps:"5120"
    },{
        evos:{
            "Scraggy":{
                type:["Dark","Fighting"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Scrafty":{
                type:["Dark","Fighting"],
                color:"Red",
                from:"Scraggy",
                con:true
            }
        },
        egg:"A pale egg with a strange yellow film on top of it. It's harder than a rock.",
        steps:"3840"
    },{
        evos:{
            "Sigilyph":{
                type:["Flying","Psychic"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A green egg with a black marking around the middle that has two blue spots. It's like it's really staring at you.",
        steps:"5120"
    },{
        evos:{
            "Yamask":{
                type:["Ghost"],
                color:"Black",
                from:null,
                con:true
            },
            "Cofagrigus":{
                type:["Ghost"],
                color:"Yellow",
                from:"Yamask",
                con:true
            }
        },
        egg:"A shiny gold and blue egg with an elaborate pattern on it. It gives off an unsettling vibe....",
        steps:"6400"
    },{
        evos:{
            "Galarian Yamask":{
                type:["Ghost","Ground"],
                color:"Black",
                from:null,
                con:true
            },
            "Runerigus":{
                type:["Ghost","Ground"],
                color:"Gray",
                from:"Galarian Yamask",
                con:false
            }
        },
        egg:"A rough brown egg covered in a snaking red pattern. It seems to be barely held together somehow. It gives off an unsettling vibe...",
        steps:"6400"
    },{
        evos:{
            "Tirtouga":{
                type:["Rock","Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Carracosta":{
                type:["Rock","Water"],
                color:"Blue",
                from:"Tirtouga",
                con:true
            }
        },
        egg:"A dark grey egg with a very rough surface. It's as hard as a rock.",
        steps:"7680"
    },{
        evos:{
            "Archen":{
                type:["Flying","Rock"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Archeops":{
                type:["Flying","Rock"],
                color:"Yellow",
                from:"Archen",
                con:true
            }
        },
        egg:"An egg that is half blue and half yellow. It has many red feathers sticking out of it.",
        steps:"7680"
    },{
        evos:{
            "Trubbish":{
                type:["Poison"],
                color:"Green",
                from:null,
                con:true
            },
            "Garbodor":{
                type:["Poison"],
                color:"Green",
                from:"Trubbish",
                con:true
            },
            "Gmax Garbodor [Gmax]":{
                type:["Poison"],
                color:"Green",
                from:"Garbodor",
                con:false
            }
        },
        egg:"A dark green egg with a peculiar pattern on it. For some reason, it's sitting in a pile of trash.",
        steps:"5120"
    },{
        evos:{
            "Zorua":{
                type:["Dark"],
                color:"Gray",
                from:null,
                con:true
            },
            "Zoroark":{
                type:["Dark"],
                color:"Gray",
                from:"Zorua",
                con:true
            }
        },
        egg:"A black egg with a bizarre red marking on the front. Sometimes the marking will change its shape.",
        steps:"6400"
    },{
        evos:{
            "Minccino":{
                type:["Normal"],
                color:"Gray",
                from:null,
                con:true
            },
            "Cinccino":{
                type:["Normal"],
                color:"Gray",
                from:"Minccino",
                con:false
            }
        },
        egg:"A light brown egg with several white blotches on it. Its surface is completely clean.",
        steps:"3840"
    },{
        evos:{
            "Gothita":{
                type:["Psychic"],
                color:"Purple",
                from:null,
                con:true
            },
            "Gothorita":{
                type:["Psychic"],
                color:"Purple",
                from:"Gothita",
                con:true
            },
            "Gothitelle":{
                type:["Psychic"],
                color:"Purple",
                from:"Gothorita",
                con:true
            }
        },
        egg:"A black egg with a purple swirl along the back of it. It appears to be decorated with a white bow.",
        steps:"5120"
    },{
        evos:{
            "Solosis":{
                type:["Psychic"],
                color:"Green",
                from:null,
                con:true
            },
            "Duosion":{
                type:["Psychic"],
                color:"Green",
                from:"Solosis",
                con:true
            },
            "Reuniclus":{
                type:["Psychic"],
                color:"Green",
                from:"Duosion",
                con:true
            }
        },
        egg:"A translucent pale green egg. You can see what's forming inside of it.",
        steps:"5120"
    },{
        evos:{
            "Ducklett":{
                type:["Flying","Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Swanna":{
                type:["Flying","Water"],
                color:"White",
                from:"Ducklett",
                con:true,
                minLv:35
            }
        },
        egg:"A white egg with a pale blue blotch on the front. Its surface is surprisingly clean.",
        steps:"5120"
    },{
        evos:{
            "Vanillite":{
                type:["Ice"],
                color:"White",
                from:null,
                con:true
            },
            "Vanillite [Snowless]":{
                type:["Ice","Water"],
                color:"Blue",
                from:"Vanillite",
                con:false
            },
            "Vanillish":{
                type:["Ice"],
                color:"White",
                from:"Vanillite",
                con:true
            },
            "Vanilluxe":{
                type:["Ice"],
                color:"White",
                from:"Vanillish",
                con:true
            },
            "Vanillishake":{
                type:["Ice"],
                color:"White",
                from:"Vanilluxe",
                con:false
            }
        },
        egg:"A shiny blue egg with the strangest white pattern on the front of it. It's like it's really staring at you.",
        steps:"5120"
    },{
        evos:{
            "Deerling [Spring]":{
                type:["Grass","Normal"],
                color:"Yellow",
                from:null,
                con:true
            }
        },
        egg:"A pink egg with a pretty yellow pattern on it. Its colours represent spring well.",
        steps:"5120"
    },{
        evos:{
            "Deerling [Summer]":{
                type:["Grass","Normal"],
                color:"Yellow",
                from:null,
                con:true
            }
        },
        egg:"A green egg with a pretty yellow pattern on it. Its colours represent summer well.",
        steps:"5120"
    },{
        evos:{
            "Deerling [Fall]":{
                type:["Grass","Normal"],
                color:"Yellow",
                from:null,
                con:true
            }
        },
        egg:"An orange egg with a pretty yellow pattern on it. Its colours represent fall well.",
        steps:"5120"
    },{
        evos:{
            "Deerling [Winter]":{
                type:["Grass","Normal"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Sawsbuck [Spring]":{
                type:["Grass","Normal"],
                color:"Brown",
                from:"Deerling [Spring]",
                con:true
            },
            "Sawsbuck [Summer]":{
                type:["Grass","Normal"],
                color:"Brown",
                from:"Deerling [Summer]",
                con:true
            },
            "Sawsbuck [Fall]":{
                type:["Grass","Normal"],
                color:"Brown",
                from:"Deerling [Fall]",
                con:true
            },
            "Sawsbuck [Winter]":{
                type:["Grass","Normal"],
                color:"Brown",
                from:"Deerling [Winter]",
                con:true
            }
        },
        egg:"A brown egg with a pretty yellow pattern on it. Its colours represent winter well.",
        steps:"5120"
    },{
        evos:{
            "Emolga":{
                type:["Electric","Flying"],
                color:"White",
                from:null,
                con:true
            }
        },
        egg:"A black egg with a big yellow marking on the front. Touching it may shock you.",
        steps:"5120"
    },{
        evos:{
            "Karrablast":{
                type:["Bug"],
                color:"Blue",
                from:null,
                con:true
            },
            "Escavalier":{
                type:["Bug","Steel"],
                color:"Gray",
                from:"Karrablast",
                con:true
            }
        },
        egg:"A bold blue egg with a pattern on it consisting of black, cyan, and yellow. It hops around if you touch it.",
        steps:"3840"
    },{
        evos:{
            "Foongus":{
                type:["Grass","Poison"],
                color:"White",
                from:null,
                con:true
            },
            "Amoonguss":{
                type:["Grass","Poison"],
                color:"Gray",
                from:"Foongus",
                con:true,
                minLv:39
            }
        },
        egg:"An egg that is half white and half red with a big spot on the top. It's covered in dust.",
        steps:"5120"
    },{
        evos:{
            "Frillish":{
                type:["Ghost","Water"],
                color:"White",
                from:null,
                con:true
            },
            "Jellicent":{
                type:["Ghost","Water"],
                color:"White",
                from:"Frillish",
                con:true
            }
        },
        egg:"A light blue egg decorated with pink swirls. It's surprisingly light.",
        steps:"5120"
    },{
        evos:{
            "Alomomola":{
                type:["Water"],
                color:"Pink",
                from:null,
                con:true
            }
        },
        egg:"A bright pink egg with a dark teal heart shape on the front. The egg seems to be damp.",
        steps:"10240"
    },{
        evos:{
            "Joltik":{
                type:["Bug","Electric"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Galvantula":{
                type:["Bug","Electric"],
                color:"Yellow",
                from:"Joltik",
                con:true
            }
        },
        egg:"A very tiny yellow and blue egg. It might shock you if you touch it.",
        steps:"5120"
    },{
        evos:{
            "Ferroseed":{
                type:["Grass","Steel"],
                color:"Gray",
                from:null,
                con:true
            },
            "Ferrothorn":{
                type:["Grass","Steel"],
                color:"Gray",
                from:"Ferroseed",
                con:true
            }
        },
        egg:"A grey egg that's covered in pointy green spikes. It spins around sometimes.",
        steps:"5120"
    },{
        evos:{
            "Klink":{
                type:["Steel"],
                color:"Gray",
                from:null,
                con:true
            },
            "Klang":{
                type:["Steel"],
                color:"Gray",
                from:"Klink",
                con:true
            },
            "Klinklang":{
                type:["Steel"],
                color:"Gray",
                from:"Klang",
                con:true
            }
        },
        egg:"A grey egg with a dark marking on the front and two green spots. It spins around sometimes.",
        steps:"5120"
    },{
        evos:{
            "Tynamo":{
                type:["Electric"],
                color:"White",
                from:null,
                con:true
            },
            "Eelektrik":{
                type:["Electric"],
                color:"Blue",
                from:"Tynamo",
                con:true
            },
            "Eelektross":{
                type:["Electric"],
                color:"Blue",
                from:"Eelektrik",
                con:false
            }
        },
        egg:"A dark teal egg with small yellow spots on it. It keeps making weird noises.",
        steps:"5120"
    },{
        evos:{
            "Elgyem":{
                type:["Psychic"],
                color:"Blue",
                from:null,
                con:true
            },
            "Beheeyem":{
                type:["Psychic"],
                color:"Brown",
                from:"Elgyem",
                con:true
            }
        },
        egg:"A pale green egg with a strange black pattern on the front. It has an odd indent on its side.",
        steps:"5120"
    },{
        evos:{
            "Litwick":{
                type:["Fire","Ghost"],
                color:"White",
                from:null,
                con:true
            },
            "Lampent":{
                type:["Fire","Ghost"],
                color:"Black",
                from:"Litwick",
                con:true
            },
            "Chandelure":{
                type:["Fire","Ghost"],
                color:"Black",
                from:"Lampent",
                con:false
            }
        },
        egg:"A white egg that looks like it's melting. It's hot to the touch.",
        steps:"5120"
    },{
        evos:{
            "Axew":{
                type:["Dragon"],
                color:"Green",
                from:null,
                con:true
            },
            "Fraxure":{
                type:["Dragon"],
                color:"Green",
                from:"Axew",
                con:true
            },
            "Haxorus":{
                type:["Dragon"],
                color:"Yellow",
                from:"Fraxure",
                con:true
            }
        },
        egg:"A green egg with a ring around it. It hops closer to you if you touch it.",
        steps:"10240"
    },{
        evos:{
            "Cubchoo":{
                type:["Ice"],
                color:"White",
                from:null,
                con:true
            },
            "Beartic":{
                type:["Ice"],
                color:"White",
                from:"Cubchoo",
                con:true
            }
        },
        egg:"An egg that is blue on the top and white on the bottom. It's cold to the touch.",
        steps:"5120"
    },{
        evos:{
            "Cryogonal":{
                type:["Ice"],
                color:"Blue",
                from:null,
                con:true
            }
        },
        egg:"An egg with a bizarre pattern that is several different shades of blue. It's cold to the touch.",
        steps:"6400"
    },{
        evos:{
            "Shelmet":{
                type:["Bug"],
                color:"Gray",
                from:null,
                con:true
            },
            "Accelgor":{
                type:["Bug"],
                color:"Blue",
                from:"Shelmet",
                con:true
            }
        },
        egg:"A pink egg with two green stripes and a black marking on the front. It hops around if you touch it.",
        steps:"3840"
    },{
        evos:{
            "Stunfisk":{
                type:["Electric","Ground"],
                color:"Brown",
                from:null,
                con:true
            }
        },
        egg:"A brown egg with a yellow pattern on the front and bottom. Touching it may shock you.",
        steps:"5120"
    },{
        evos:{
            "Galarian Stunfisk":{
                type:["Ground","Steel"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A gray egg with three large green markings. It is incredibly tough, seemingly made of steel.",
        steps:"5120"
    },{
        evos:{
            "Mienfoo":{
                type:["Fighting"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Mienshao":{
                type:["Fighting"],
                color:"Purple",
                from:"Mienfoo",
                con:true
            }
        },
        egg:"A pale yellow egg with two black spots and a red band around it. It makes a weird noise when you touch it.",
        steps:"6400"
    },{
        evos:{
            "Druddigon":{
                type:["Dragon"],
                color:"Blue",
                from:null,
                con:true
            }
        },
        egg:"A blue egg with a wavy brown line running across it. It's covered with several pointy red spikes.",
        steps:"7680"
    },{
        evos:{
            "Golett":{
                type:["Ghost","Ground"],
                color:"Green",
                from:null,
                con:true
            },
            "Golurk":{
                type:["Ghost","Ground"],
                color:"Green",
                from:"Golett",
                con:true
            }
        },
        egg:"A blue egg that appears to have a second shell on it. The shell consists of brown, blue, and an odd yellow marking.",
        steps:"6400"
    },{
        evos:{
            "Pawniard":{
                type:["Dark","Steel"],
                color:"Red",
                from:null,
                con:true
            },
            "Bisharp":{
                type:["Dark","Steel"],
                color:"Red",
                from:"Pawniard",
                con:true
            }
        },
        egg:"An egg that is red on the top and dark grey on the bottom. It might hop closer to you if you touch it.",
        steps:"5120"
    },{
        evos:{
            "Bouffalant":{
                type:["Normal"],
                color:"Brown",
                from:null,
                con:true
            }
        },
        egg:"A dark brown egg that appears to have an afro on it. It's a bit on the heavy side.",
        steps:"5120"
    },{
        evos:{
            "Rufflet":{
                type:["Flying","Normal"],
                color:"White",
                from:null,
                con:true
            },
            "Braviary":{
                type:["Flying","Normal"],
                color:"Red",
                from:"Rufflet",
                con:true
            },
            "Hisuian Braviary":{
                type:["Psychic","Flying"],
                color:"White",
                from:"Rufflet",
                con:true
            }
        },
        egg:"A red egg with a dazzling white and blue pattern running across it. It might hop closer to you if you touch it.",
        steps:"5120"
    },{
        evos:{
            "Vullaby":{
                type:["Dark","Flying"],
                color:"Brown",
                from:null,
                con:true
            },
            "Mandibuzz":{
                type:["Dark","Flying"],
                color:"Brown",
                from:"Vullaby",
                con:true
            }
        },
        egg:"It's a plain tan egg. Not terribly exciting.",
        steps:"5120"
    },{
        evos:{
            "Heatmor":{
                type:["Fire"],
                color:"Red",
                from:null,
                con:true
            }
        },
        egg:"A red egg with several yellow stripes on it. There is an odd brown protrusion towards the bottom of the egg.",
        steps:"5120"
    },{
        evos:{
            "Durant":{
                type:["Bug","Steel"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with an odd pattern and several bumps on it. It is incredibly tough.",
        steps:"5120"
    },{
        evos:{
            "Deino":{
                type:["Dark","Dragon"],
                color:"Blue",
                from:null,
                con:true
            },
            "Zweilous":{
                type:["Dark","Dragon"],
                color:"Blue",
                from:"Deino",
                con:true
            },
            "Hydreigon":{
                type:["Dark","Dragon"],
                color:"Blue",
                from:"Zweilous",
                con:true
            }
        },
        egg:"A blue egg that is half covered in a black fuzz. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Larvesta":{
                type:["Bug","Fire"],
                color:"White",
                from:null,
                con:true
            },
            "Volcarona":{
                type:["Bug","Fire"],
                color:"White",
                from:"Larvesta",
                con:true
            }
        },
        egg:"A bold orange egg with several black spots all over it. It radiates an incredible amount of heat.",
        steps:"10240"
    },{
        evos:{
            "Cobalion":{
                type:["Fighting","Steel"],
                color:"Blue",
                from:null,
                con:true
            }
        },
        egg:"A blue egg with a light blue pattern on the bottom. It is as hard as steel, and has a strange tan protrusion coming out towards the top.",
        steps:"20480"
    },{
        evos:{
            "Terrakion":{
                type:["Fighting","Rock"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a tan pattern on the bottom. It is really heavy, and has a strange yellow protrusion coming out towards the bottom.",
        steps:"20480"
    },{
        evos:{
            "Virizion":{
                type:["Fighting","Grass"],
                color:"Green",
                from:null,
                con:true
            }
        },
        egg:"A green egg with a lighter pattern on the bottom. It has a sleek feel, and has two strange pink protrusions coming out towards the top.",
        steps:"20480"
    },{
        evos:{
            "Tornadus [Incarnate]":{
                type:["Flying"],
                color:"Green",
                from:null,
                con:true
            },
            "Tornadus [Therian]":{
                type:["Flying"],
                color:"Green",
                from:"Tornadus [Incarnate]",
                con:false
            }
        },
        egg:"A dark green egg covered in purple splotches. It's surrounded by a mysterious air.",
        steps:"30720"
    },{
        evos:{
            "Thundurus [Incarnate]":{
                type:["Electric","Flying"],
                color:"Blue",
                from:null,
                con:true
            },
            "Thundurus [Therian]":{
                type:["Electric","Flying"],
                color:"Blue",
                from:"Thundurus [Incarnate]",
                con:false
            }
        },
        egg:"A bright blue egg covered in purple splotches. Thundering sounds can be heard near it.",
        steps:"30720"
    },{
        evos:{
            "Reshiram":{
                type:["Dragon","Fire"],
                color:"White",
                from:null,
                con:true
            }
        },
        egg:"An intensely white egg of immense size. It has a wispy pattern on it and a shining ring. It radiates an incredible amount of heat.",
        steps:"30720"
    },{
        evos:{
            "Zekrom":{
                type:["Dragon","Electric"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A grey and black egg of immense size. Many blue sparks of electricity are jumping around on its surface.",
        steps:"30720"
    },{
        evos:{
            "Landorus [Incarnate]":{
                type:["Flying","Ground"],
                color:"Brown",
                from:null,
                con:true
            },
            "Landorus [Therian]":{
                type:["Flying","Ground"],
                color:"Brown",
                from:"Landorus [Incarnate]",
                con:false
            }
        },
        egg:"A bold orange egg covered in red splotches. The space around it is in pristine condition.",
        steps:"30720"
    },{
        evos:{
            "Kyurem":{
                type:["Dragon","Ice"],
                color:"Gray",
                from:null,
                con:true
            },
            "Black Kyurem":{
                type:["Dragon","Ice"],
                color:"Black",
                from:"Kyurem",
                con:false
            },
            "White Kyurem":{
                type:["Dragon","Ice"],
                color:"White",
                from:"Kyurem",
                con:false
            }
        },
        egg:"An icy blue egg of immense size. The odd pattern running along the egg makes it look like it's already cracking.",
        steps:"30720"
    },{
        evos:{
            "Keldeo [Ordinary]":{
                type:["Fighting","Water"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Keldeo [Resolute]":{
                type:["Fighting","Water"],
                color:"Yellow",
                from:"Keldeo [Ordinary]",
                con:false
            }
        },
        egg:"An egg with an intricate pattern composed of off-white, red, and blue. It has a dark blue ridge around it and looks very delicate.",
        steps:"20480"
    },{
        evos:{
            "Meloetta [Voice]":{
                type:["Normal","Psychic"],
                color:"White",
                from:null,
                con:true
            },
            "Meloetta [Step]":{
                type:["Fighting","Normal"],
                color:"White",
                from:"Meloetta [Voice]",
                con:false
            }
        },
        egg:"A light green egg with a bizarre black protrusion on the front and a single dark spot. Being around it fills your head with music.",
        steps:"30720"
    },{
        evos:{
            "Genesect":{
                type:["Bug","Steel"],
                color:"Purple",
                from:null,
                con:true
            }
        },
        egg:"A dark purple egg with a lighter band on the bottom. It is as hard as steel and has a red spot on the top that blinks like an ominous light.",
        steps:"30720"
    },{
        evos:{
            "Chespin":{
                type:["Grass"],
                color:"Green",
                from:null,
                con:true
            },
            "Snowman Chespin":{
                type:["Grass","Ice"],
                color:"Green",
                from:"Chespin",
                con:false
            },
            "Quilladin":{
                type:["Grass"],
                color:"Green",
                from:"Chespin",
                con:true
            },
            "Chesnaught":{
                type:["Fighting","Grass"],
                color:"Green",
                from:"Quilladin",
                con:true
            }
        },
        egg:"A green egg with a light brown blotch. It has some odd, triangular markings pointing towards the center.",
        steps:"5120"
    },{
        evos:{
            "Fennekin":{
                type:["Fire"],
                color:"Red",
                from:null,
                con:true
            },
            "Snowman Fennekin":{
                type:["Fire","Ice"],
                color:"Red",
                from:"Fennekin",
                con:false
            },
            "Braixen":{
                type:["Fire"],
                color:"Red",
                from:"Fennekin",
                con:true
            },
            "Delphox":{
                type:["Fire","Psychic"],
                color:"Red",
                from:"Braixen",
                con:true
            }
        },
        egg:"A pale yellow egg with a strange, dark orange blotch on the bottom. It's quite hot to the touch.",
        steps:"5120"
    },{
        evos:{
            "Froakie":{
                type:["Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Snowman Froakie":{
                type:["Ice","Water"],
                color:"Blue",
                from:"Froakie",
                con:false
            },
            "Frogadier":{
                type:["Water"],
                color:"Blue",
                from:"Froakie",
                con:true
            },
            "Greninja":{
                type:["Dark","Water"],
                color:"Blue",
                from:"Frogadier",
                con:true
            },
            "Greninja [Ash]":{
                type:["Dark","Water"],
                color:"Blue",
                from:"Greninja",
                con:false
            }
        },
        egg:"A light blue egg with a darker, vertical stripe running from the top to the center. There also appear to be two small, white bubbles on the front.",
        steps:"5120"
    },{
        evos:{
            "Bunnelby":{
                type:["Normal"],
                color:"Brown",
                from:null,
                con:true
            },
            "Diggersby":{
                type:["Ground","Normal"],
                color:"Brown",
                from:"Bunnelby",
                con:true
            }
        },
        egg:"A grey and brown egg that's covered with a thin layer of dirt.",
        steps:"3840"
    },{
        evos:{
            "Fletchling":{
                type:["Flying","Normal"],
                color:"Red",
                from:null,
                con:true
            },
            "Fletchinder":{
                type:["Fire","Flying"],
                color:"Red",
                from:"Fletchling",
                con:true
            },
            "Talonflame":{
                type:["Fire","Flying"],
                color:"Red",
                from:"Fletchinder",
                con:true
            }
        },
        egg:"A light blue and red-orange egg with a yellow spot. It's comfortably warm.",
        steps:"3840"
    },{
        evos:{
            "Scatterbug":{
                type:["Bug"],
                color:"Black",
                from:null,
                con:true
            },
            "Spewpa":{
                type:["Bug"],
                color:"Black",
                from:"Scatterbug",
                con:true
            },
            "Vivillon [Meadow]":{
                type:["Bug","Flying"],
                color:"Black",
                from:"Spewpa",
                con:true
            },
            "Vivillon [Archipelago]":{
                type:["Bug","Flying"],
                color:"Black",
                from:"Vivillon [Meadow]",
                con:false
            },
            "Vivillon [Continental]":{
                type:["Bug","Flying"],
                color:"Black",
                from:"Vivillon [Meadow]",
                con:false
            },
            "Vivillon [Elegant]":{
                type:["Bug","Flying"],
                color:"Black",
                from:"Vivillon [Meadow]",
                con:false
            },
            "Vivillon [Fancy]":{
                type:["Bug","Flying"],
                color:"Black",
                from:"Vivillon [Meadow]",
                con:false
            },
            "Vivillon [Garden]":{
                type:["Bug","Flying"],
                color:"Black",
                from:"Vivillon [Meadow]",
                con:false
            },
            "Vivillon [High Plains]":{
                type:["Bug","Flying"],
                color:"Black",
                from:"Vivillon [Meadow]",
                con:false
            },
            "Vivillon [Icy Snow]":{
                type:["Bug","Flying"],
                color:"Black",
                from:"Vivillon [Meadow]",
                con:false
            },
            "Vivillon [Jungle]":{
                type:["Bug","Flying"],
                color:"Black",
                from:"Vivillon [Meadow]",
                con:false
            },
            "Vivillon [Love]":{
                type:["Bug","Flying"],
                color:"Black",
                from:"Vivillon [Meadow]",
                con:false
            },
            "Vivillon [Marine]":{
                type:["Bug","Flying"],
                color:"Black",
                from:"Vivillon [Meadow]",
                con:false
            },
            "Vivillon [Modern]":{
                type:["Bug","Flying"],
                color:"Black",
                from:"Vivillon [Meadow]",
                con:false
            },
            "Vivillon [Monsoon]":{
                type:["Bug","Flying"],
                color:"Black",
                from:"Vivillon [Meadow]",
                con:false
            },
            "Vivillon [Ocean]":{
                type:["Bug","Flying"],
                color:"Black",
                from:"Vivillon [Meadow]",
                con:false
            },
            "Vivillon [Poke Ball]":{
                type:["Bug","Flying"],
                color:"Black",
                from:"Vivillon [Meadow]",
                con:false
            },
            "Vivillon [Polar]":{
                type:["Bug","Flying"],
                color:"Black",
                from:"Vivillon [Meadow]",
                con:false
            },
            "Vivillon [River]":{
                type:["Bug","Flying"],
                color:"Black",
                from:"Vivillon [Meadow]",
                con:false
            },
            "Vivillon [Sandstorm]":{
                type:["Bug","Flying"],
                color:"Black",
                from:"Vivillon [Meadow]",
                con:false
            },
            "Vivillon [Savannah]":{
                type:["Bug","Flying"],
                color:"Black",
                from:"Vivillon [Meadow]",
                con:false
            },
            "Vivillon [Sun]":{
                type:["Bug","Flying"],
                color:"Black",
                from:"Vivillon [Meadow]",
                con:false
            },
            "Vivillon [Tundra]":{
                type:["Bug","Flying"],
                color:"Black",
                from:"Vivillon [Meadow]",
                con:false
            }
        },
        egg:"A black egg that's mostly covered in a thick white fuzz. The fuzz is covered with several black and red specks.",
        steps:"3840"
    },{
        evos:{
            "Litleo":{
                type:["Fire","Normal"],
                color:"Brown",
                from:null,
                con:true
            },
            "Pyroar":{
                type:["Fire","Normal"],
                color:"Brown",
                from:"Litleo",
                con:true
            }
        },
        egg:"An egg that is two different shades of brown. It has a glowing red stripe at the top that emanates heat.",
        steps:"5120"
    },{
        evos:{
            "Flabebe [Orange]":{
                type:["Fairy"],
                color:"White",
                from:null,
                con:true
            },
            "Floette [Orange]":{
                type:["Fairy"],
                color:"White",
                from:"Flabebe [Orange]",
                con:true
            },
            "Florges [Orange]":{
                type:["Fairy"],
                color:"White",
                from:"Floette [Orange]",
                con:false
            }
        },
        egg:"A white and green egg with a yellow ring at the top. It had some orange flower petals on it, but they fell off at some point.",
        steps:"5120"
    },{
        evos:{
            "Flabebe [Blue]":{
                type:["Fairy"],
                color:"White",
                from:null,
                con:true
            },
            "Floette [Blue]":{
                type:["Fairy"],
                color:"White",
                from:"Flabebe [Blue]",
                con:true
            },
            "Florges [Blue]":{
                type:["Fairy"],
                color:"White",
                from:"Floette [Blue]",
                con:false
            }
        },
        egg:"A white and green egg with a yellow ring at the top. It had some blue flower petals on it, but they fell off at some point.",
        steps:"5120"
    },{
        evos:{
            "Flabebe [Red]":{
                type:["Fairy"],
                color:"White",
                from:null,
                con:true
            },
            "Floette [Red]":{
                type:["Fairy"],
                color:"White",
                from:"Flabebe [Red]",
                con:true
            },
            "Florges [Red]":{
                type:["Fairy"],
                color:"White",
                from:"Floette [Red]",
                con:false
            }
        },
        egg:"A white and green egg with a yellow ring at the top. It had some red flower petals on it, but they fell off at some point.",
        steps:"5120"
    },{
        evos:{
            "Flabebe [White]":{
                type:["Fairy"],
                color:"White",
                from:null,
                con:true
            },
            "Floette [White]":{
                type:["Fairy"],
                color:"White",
                from:"Flabebe [White]",
                con:true
            },
            "Florges [White]":{
                type:["Fairy"],
                color:"White",
                from:"Floette [White]",
                con:false
            }
        },
        egg:"A white and green egg with a yellow ring at the top. It had some white flower petals on it, but they fell off at some point.",
        steps:"5120"
    },{
        evos:{
            "Flabebe [Yellow]":{
                type:["Fairy"],
                color:"White",
                from:null,
                con:true
            },
            "Floette [Yellow]":{
                type:["Fairy"],
                color:"White",
                from:"Flabebe [Yellow]",
                con:true
            },
            "Florges [Yellow]":{
                type:["Fairy"],
                color:"White",
                from:"Floette [Yellow]",
                con:false
            }
        },
        egg:"A white and green egg with a yellow ring at the top. It had some yellow flower petals on it, but they fell off at some point.",
        steps:"5120"
    },{
        evos:{
            "Skiddo":{
                type:["Grass"],
                color:"Brown",
                from:null,
                con:true
            },
            "Gogoat":{
                type:["Grass"],
                color:"Brown",
                from:"Skiddo",
                con:true
            }
        },
        egg:"An egg that's brown on the top and white on the bottom. It's nestled in a lush bed of leaves.",
        steps:"5120"
    },{
        evos:{
            "Pancham":{
                type:["Fighting"],
                color:"White",
                from:null,
                con:true
            },
            "Pangoro":{
                type:["Dark","Fighting"],
                color:"White",
                from:"Pancham",
                con:true
            }
        },
        egg:"A patterned dark grey egg with a singular leaf on top of it. It might hop if you touched it.",
        steps:"6400"
    },{
        evos:{
            "Furfrou":{
                type:["Normal"],
                color:"White",
                from:null,
                con:true
            },
            "Furfrou [Heart Trim]":{
                type:["Normal"],
                color:"White",
                from:"Furfrou",
                con:false
            },
            "Furfrou [Diamond Trim]":{
                type:["Normal"],
                color:"White",
                from:"Furfrou",
                con:false
            },
            "Furfrou [Star Trim]":{
                type:["Normal"],
                color:"White",
                from:"Furfrou",
                con:false
            },
            "Furfrou [Pharaoh Trim]":{
                type:["Normal"],
                color:"White",
                from:"Furfrou",
                con:false
            },
            "Furfrou [Kabuki Trim]":{
                type:["Normal"],
                color:"White",
                from:"Furfrou",
                con:false
            },
            "Furfrou [La Reine Trim]":{
                type:["Normal"],
                color:"White",
                from:"Furfrou",
                con:false
            },
            "Furfrou [Matron Trim]":{
                type:["Normal"],
                color:"White",
                from:"Furfrou",
                con:false
            },
            "Furfrou [Dandy Trim]":{
                type:["Normal"],
                color:"White",
                from:"Furfrou",
                con:false
            },
            "Furfrou [Debutante Trim]":{
                type:["Normal"],
                color:"White",
                from:"Furfrou",
                con:false
            }
        },
        egg:"An egg that's absolutely covered in white fur. It makes noises if you touch it.",
        steps:"5120"
    },{
        evos:{
            "Espurr":{
                type:["Psychic"],
                color:"Gray",
                from:null,
                con:true
            },
            "Meowstic":{
                type:["Psychic"],
                color:"White",
                from:"Espurr",
                con:true
            }
        },
        egg:"A grey egg with a pair of purple markings that are undoubtedly staring at you.",
        steps:"5120"
    },{
        evos:{
            "Honedge":{
                type:["Ghost","Steel"],
                color:"Brown",
                from:null,
                con:true
            },
            "Doublade":{
                type:["Ghost","Steel"],
                color:"Brown",
                from:"Honedge",
                con:true
            },
            "Aegislash [Blade]":{
                type:["Ghost","Steel"],
                color:"Brown",
                from:"Doublade",
                con:false
            },
            "Aegislash [Shield]":{
                type:["Ghost","Steel"],
                color:"Brown",
                from:"Aegislash [Blade]",
                con:false
            }
        },
        egg:"A brown egg with an intricate pattern that wraps around itself. It has a blue segment that shines ominously.",
        steps:"5120"
    },{
        evos:{
            "Spritzee":{
                type:["Fairy"],
                color:"Pink",
                from:null,
                con:true
            },
            "Aromatisse":{
                type:["Fairy"],
                color:"Pink",
                from:"Spritzee",
                con:false
            }
        },
        egg:"A fluffy pink egg with a white protrusion on its front. It has a strong perfume scent.",
        steps:"5120"
    },{
        evos:{
            "Swirlix":{
                type:["Fairy"],
                color:"White",
                from:null,
                con:true
            },
            "Slurpuff":{
                type:["Fairy"],
                color:"White",
                from:"Swirlix",
                con:false
            }
        },
        egg:"A fluffy light pink, almost white egg with an overwhelmingly sweet scent.",
        steps:"5120"
    },{
        evos:{
            "Inkay":{
                type:["Dark","Psychic"],
                color:"Blue",
                from:null,
                con:true
            },
            "Malamar":{
                type:["Dark","Psychic"],
                color:"Blue",
                from:"Inkay",
                con:true
            }
        },
        egg:"A white, pink, and blue egg. It has several yellow spots that glow mysteriously.",
        steps:"5120"
    },{
        evos:{
            "Binacle":{
                type:["Rock","Water"],
                color:"Brown",
                from:null,
                con:true
            },
            "Barbaracle":{
                type:["Rock","Water"],
                color:"Brown",
                from:"Binacle",
                con:true
            }
        },
        egg:"A heavy grey egg that could easily be mistaken for a rock. It smells like brine.",
        steps:"5120"
    },{
        evos:{
            "Skrelp":{
                type:["Poison","Water"],
                color:"Brown",
                from:null,
                con:true
            },
            "Dragalge":{
                type:["Dragon","Poison"],
                color:"Brown",
                from:"Skrelp",
                con:true
            }
        },
        egg:"A pink egg decorated with what appears to be kelp. It smells like brine.",
        steps:"5120"
    },{
        evos:{
            "Clauncher":{
                type:["Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Clawitzer":{
                type:["Water"],
                color:"Blue",
                from:"Clauncher",
                con:true
            }
        },
        egg:"A light blue egg with a perfectly round, yellow indent. It smells like brine.",
        steps:"3840"
    },{
        evos:{
            "Helioptile":{
                type:["Electric","Normal"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Heliolisk":{
                type:["Electric","Normal"],
                color:"Yellow",
                from:"Helioptile",
                con:false
            }
        },
        egg:"An egg that's black on the top and yellow on the bottom. It has a very dry, but smooth surface.",
        steps:"5120"
    },{
        evos:{
            "Tyrunt":{
                type:["Dragon","Rock"],
                color:"Brown",
                from:null,
                con:true
            },
            "Tyrantrum":{
                type:["Dragon","Rock"],
                color:"Red",
                from:"Tyrunt",
                con:true
            }
        },
        egg:"A rugged brown egg with two orange spikes on top of it. It's heavier than it looks.",
        steps:"7680"
    },{
        evos:{
            "Amaura":{
                type:["Ice","Rock"],
                color:"Blue",
                from:null,
                con:true
            },
            "Aurorus":{
                type:["Ice","Rock"],
                color:"Blue",
                from:"Amaura",
                con:true
            }
        },
        egg:"A light blue egg with a gem and a pair of shining frills. It's heavier than it looks.",
        steps:"7680"
    },{
        evos:{
            "Hawlucha":{
                type:["Fighting","Flying"],
                color:"Green",
                from:null,
                con:true
            }
        },
        egg:"An egg comprised of teal, orange, red, and white markings. These markings somewhat resemble a face.",
        steps:"5120"
    },{
        evos:{
            "Dedenne":{
                type:["Electric","Fairy"],
                color:"Yellow",
                from:null,
                con:true
            }
        },
        egg:"An orange egg with a black segment that curls around it. Touching it might shock you.",
        steps:"5120"
    },{
        evos:{
            "Carbink":{
                type:["Fairy","Rock"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A dull purple egg encrusted with several beautiful gems. The gems shine brightly in the light.",
        steps:"6400"
    },{
        evos:{
            "Goomy":{
                type:["Dragon"],
                color:"Purple",
                from:null,
                con:true
            },
            "Sliggoo":{
                type:["Dragon"],
                color:"Purple",
                from:"Goomy",
                con:true
            },
            "Goodra":{
                type:["Dragon"],
                color:"Purple",
                from:"Sliggoo",
                con:false
            },
            "Hisuian Sliggoo":{
                type:["Steel","Dragon"],
                color:"Purple",
                from:"Goomy",
                con:true
            },
            "Hisuian Goodra":{
                type:["Steel","Dragon"],
                color:"Purple",
                from:"Hisuian Sliggoo",
                con:false
            }
        },
        egg:"An egg that's two shades of purple with two green spots. It's really sticky.",
        steps:"10240"
    },{
        evos:{
            "Klefki":{
                type:["Fairy","Steel"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A tiny silver egg that shines like steel. It sometimes makes rattling noises.",
        steps:"5120"
    },{
        evos:{
            "Phantump":{
                type:["Ghost","Grass"],
                color:"Brown",
                from:null,
                con:true
            },
            "Trevenant":{
                type:["Ghost","Grass"],
                color:"Brown",
                from:"Phantump",
                con:false
            }
        },
        egg:"This brown egg looks and feels uncannily like tree bark. It has two curling protrusions on top of it.",
        steps:"5120"
    },{
        evos:{
            "Pumpkaboo":{
                type:["Ghost","Grass"],
                color:"Brown",
                from:null,
                con:true
            },
            "Gourgeist":{
                type:["Ghost","Grass"],
                color:"Brown",
                from:"Pumpkaboo",
                con:false
            }
        },
        egg:"A large brown egg with a curled lump on top of it. It's about as heavy as you'd expect it to be.",
        steps:"5120"
    },{
        evos:{
            "Bergmite":{
                type:["Ice"],
                color:"Blue",
                from:null,
                con:true
            },
            "Avalugg":{
                type:["Ice"],
                color:"Blue",
                from:"Bergmite",
                con:true
            },
            "Hisuian Avalugg":{
                type:["Ice","Rock"],
                color:"Blue",
                from:"Bergmite",
                con:true
            }
        },
        egg:"A light blue and white egg with a sharp protrusion on the front. It's cold to the touch.",
        steps:"5120"
    },{
        evos:{
            "Noibat":{
                type:["Dragon","Flying"],
                color:"Purple",
                from:null,
                con:true
            },
            "Noivern":{
                type:["Dragon","Flying"],
                color:"Purple",
                from:"Noibat",
                con:true
            }
        },
        egg:"A purple and black egg with a dark purple marking on the front. It's constantly making noises.",
        steps:"5120"
    },{
        evos:{
            "Xerneas [Neutral]":{
                type:["Fairy"],
                color:"Blue",
                from:null,
                con:true
            },
            "Xerneas [Active]":{
                type:["Fairy"],
                color:"Blue",
                from:"Xerneas [Neutral]",
                con:false
            }
        },
        egg:"A light blue egg with an intricate pattern that wraps around itself. It emits an energising aura and glows with a mysterious light.",
        steps:"30720"
    },{
        evos:{
            "Yveltal":{
                type:["Dark","Flying"],
                color:"Red",
                from:null,
                con:true
            }
        },
        egg:"A mostly black egg whose form wraps around itself. It drains the energy of everything near it as it glows with a mysterious light.",
        steps:"30720"
    },{
        evos:{
            "Zygarde [Cell]":{
                type:["Dragon","Ground"],
                color:"Green",
                from:null,
                con:true
            }
        },
        egg:"A bright green egg with a green hexagonal pattern on the front. It shines when exposed to light.",
        steps:"8960"
    },{
        evos:{
            "Zygarde [Core]":{
                type:["Dragon","Ground"],
                color:"Green",
                from:null,
                con:true
            }
        },
        egg:"A bright green egg with a red hexagonal pattern on the front. It shines when exposed to light.",
        steps:"30720"
    },{
        evos:{
            "Zygarde [10%]":{
                type:["Dragon","Ground"],
                color:"Green",
                from:null,
                con:true
            }
        },
        egg:"A black egg with two white, hexagonal marks on the front. You feel like you're being watched.",
        steps:"30720"
    },{
        evos:{
            "Zygarde [50%]":{
                type:["Dragon","Ground"],
                color:"Green",
                from:null,
                con:true
            }
        },
        egg:"A black and green egg decorated with a hexagonal pattern. It has several white segments that glow with a mysterious light.",
        steps:"30720"
    },{
        evos:{
            "Zygarde [Complete]":{
                type:["Dragon","Ground"],
                color:"Green",
                from:null,
                con:true
            }
        },
        egg:"A black egg with several green and white hexagonal markings. You feel in tune with your surroundings when you approach it.",
        steps:"30720"
    },{
        evos:{
            "Diancie":{
                type:["Fairy","Rock"],
                color:"Gray",
                from:null,
                con:true
            },
            "Mega Diancie [Mega]":{
                type:["Fairy","Rock"],
                color:"Pink",
                from:"Diancie",
                con:false
            }
        },
        egg:"A dull pink egg encrusted with several beautiful gems. The gems shine brightly in the light.",
        steps:"30720"
    },{
        evos:{
            "Hoopa [Confined]":{
                type:["Ghost","Psychic"],
                color:"Purple",
                from:null,
                con:true
            },
            "Hoopa [Unbound]":{
                type:["Dark","Psychic"],
                color:"Purple",
                from:"Hoopa [Confined]",
                con:false
            }
        },
        egg:"A gray egg with pink blotches and a round, yellow marking on the front. There's a golden ring around the egg that emits a huge power.",
        steps:"30720"
    },{
        evos:{
            "Volcanion":{
                type:["Fire","Water"],
                color:"Brown",
                from:null,
                con:true
            }
        },
        egg:"A red egg with a cyan orb and large, round hole protruding from it. There appears to be some steam rising as you hold it...",
        steps:"30720"
    },{
        evos:{
            "Rowlet":{
                type:["Flying","Grass"],
                color:"Brown",
                from:null,
                con:true
            },
            "Dartrix":{
                type:["Flying","Grass"],
                color:"Brown",
                from:"Rowlet",
                con:true
            },
            "Decidueye":{
                type:["Ghost","Grass"],
                color:"Brown",
                from:"Dartrix",
                con:true
            },
            "Hisuian Decidueye":{
                type:["Fighting","Grass"],
                color:"Brown",
                from:"Dartrix",
                con:true
            }
        },
        egg:"A brown egg with some white blotches on the front. The two small leaves sprouting from it resemble a bowtie.",
        steps:"5120"
    },{
        evos:{
            "Litten":{
                type:["Fire"],
                color:"Red",
                from:null,
                con:true
            },
            "Torracat":{
                type:["Fire"],
                color:"Red",
                from:"Litten",
                con:true
            },
            "Incineroar":{
                type:["Dark","Fire"],
                color:"Red",
                from:"Torracat",
                con:true
            }
        },
        egg:"A black and red egg. There's a strange marking on the front. A faint purring can be heard if you hold it for a while.",
        steps:"5120"
    },{
        evos:{
            "Popplio":{
                type:["Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Brionne":{
                type:["Water"],
                color:"Blue",
                from:"Popplio",
                con:true
            },
            "Primarina":{
                type:["Fairy","Water"],
                color:"Blue",
                from:"Brionne",
                con:true
            }
        },
        egg:"A blue egg with a white and pink spot. It's slightly damp and bounces around if you touch it.",
        steps:"5120"
    },{
        evos:{
            "Pikipek":{
                type:["Flying","Normal"],
                color:"Black",
                from:null,
                con:true
            },
            "Trumbeak":{
                type:["Flying","Normal"],
                color:"Black",
                from:"Pikipek",
                con:true
            },
            "Toucannon":{
                type:["Flying","Normal"],
                color:"Black",
                from:"Trumbeak",
                con:true
            }
        },
        egg:"A black, red, and white egg. You can hear a faint pecking sound coming from the inside.",
        steps:"3840"
    },{
        evos:{
            "Yungoos":{
                type:["Normal"],
                color:"Brown",
                from:null,
                con:true
            },
            "Gumshoos":{
                type:["Normal"],
                color:"Brown",
                from:"Yungoos",
                con:true
            }
        },
        egg:"A brown egg with a tuft of yellow fur along its back. It seems to be weirdly grinning at you.",
        steps:"3840"
    },{
        evos:{
            "Grubbin":{
                type:["Bug"],
                color:"Gray",
                from:null,
                con:true
            },
            "Charjabug":{
                type:["Bug","Electric"],
                color:"Green",
                from:"Grubbin",
                con:true
            },
            "Charjabug [Sophocles Lab]":{
                type:["Bug","Electric"],
                color:"Green",
                from:"Charjabug",
                con:false
            },
            "Charjabug [Electric Princess]":{
                type:["Bug","Electric"],
                color:"Pink",
                from:"Charjabug",
                con:false
            },
            "Charjabug [Red Comet]":{
                type:["Bug","Electric"],
                color:"Red",
                from:"Charjabug",
                con:false
            },
            "Charjabug [Science Speed]":{
                type:["Bug","Electric"],
                color:"Purple",
                from:"Charjabug",
                con:false
            },
            "Charjabug [Twin Starmie]":{
                type:["Bug","Electric"],
                color:"Blue",
                from:"Charjabug",
                con:false
            },
            "Vikavolt":{
                type:["Bug","Electric"],
                color:"Blue",
                from:"Charjabug",
                con:false
            }
        },
        egg:"A small, reddish-orange egg that shakes when it's near electric power sources. It seems to be the egg of a bug.",
        steps:"3840"
    },{
        evos:{
            "Crabrawler":{
                type:["Fighting"],
                color:"Purple",
                from:null,
                con:true
            },
            "Crabominable":{
                type:["Fighting","Ice"],
                color:"White",
                from:"Crabrawler",
                con:false
            }
        },
        egg:"A purple egg with yellow and blue accents. It hops around a bit when touched.",
        steps:"5120"
    },{
        evos:{
            "Oricorio [Pom-Pom]":{
                type:["Electric","Flying"],
                color:"Yellow",
                from:null,
                con:true
            }
        },
        egg:"A pale yellow egg that's partly covered in fluffy, yellow feathers. It occasionally hops around. Touching it might shock you.",
        steps:"5120"
    },{
        evos:{
            "Oricorio [Baile]":{
                type:["Fire","Flying"],
                color:"Red",
                from:null,
                con:true
            }
        },
        egg:"This egg is completely covered in red and black feathers. It occasionally hops around. It is warm to the touch.",
        steps:"5120"
    },{
        evos:{
            "Oricorio [Pa'u]":{
                type:["Flying","Psychic"],
                color:"Pink",
                from:null,
                con:true
            }
        },
        egg:"A pink egg with a decorative ring around it. It occasionally hops around. Holding it helps to focus your mind.",
        steps:"5120"
    },{
        evos:{
            "Oricorio [Sensu]":{
                type:["Flying","Ghost"],
                color:"Purple",
                from:null,
                con:true
            }
        },
        egg:"A purple egg with a fan-shaped pattern on it. It occasionally hops around. Holding it calms your spirit.",
        steps:"5120"
    },{
        evos:{
            "Cutiefly":{
                type:["Bug","Fairy"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Ribombee":{
                type:["Bug","Fairy"],
                color:"Yellow",
                from:"Cutiefly",
                con:true
            }
        },
        egg:"A tiny, yellow egg with a white blotch on it. It shakes enthusiastically when it's near flowers or living creatures with strong emotions.",
        steps:"5120"
    },{
        evos:{
            "Rockruff":{
                type:["Rock"],
                color:"Brown",
                from:null,
                con:true
            },
            "Lycanroc [Midday]":{
                type:["Rock"],
                color:"Brown",
                from:"Rockruff",
                con:true
            },
            "Lycanroc [Midnight]":{
                type:["Rock"],
                color:"Red",
                from:"Rockruff",
                con:true
            },
            "Lycanroc [Dusk]":{
                type:["Rock"],
                color:"Brown",
                from:"Rockruff",
                con:true
            }
        },
        egg:"A light brown egg with a dark spot in the middle. It rolls towards you when touched.",
        steps:"5120"
    },{
        evos:{
            "Wishiwashi [Solo]":{
                type:["Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Wishiwashi [School]":{
                type:["Water"],
                color:"Blue",
                from:"Wishiwashi [Solo]",
                con:false
            }
        },
        egg:"A white, blue and gray egg. It's slightly damp. All by itself, it seems incredibly useless.",
        steps:"3840"
    },{
        evos:{
            "Mareanie":{
                type:["Poison","Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Toxapex":{
                type:["Poison","Water"],
                color:"Blue",
                from:"Mareanie",
                con:true
            }
        },
        egg:"A light blue egg lined with a crown of purple spikes. It requires great care when held.",
        steps:"5120"
    },{
        evos:{
            "Mudbray":{
                type:["Ground"],
                color:"Brown",
                from:null,
                con:true
            },
            "Mudsdale":{
                type:["Ground"],
                color:"Brown",
                from:"Mudbray",
                con:true
            }
        },
        egg:"A dark brown egg with a cream-colored blotch on the front. If you put it down in the mud, it will roll around.",
        steps:"5120"
    },{
        evos:{
            "Dewpider":{
                type:["Bug","Water"],
                color:"Green",
                from:null,
                con:true
            },
            "Araquanid":{
                type:["Bug","Water"],
                color:"Green",
                from:"Dewpider",
                con:true
            }
        },
        egg:"A small egg that's covered by a water bubble. Three green thin legs anchor it to the base of the egg.",
        steps:"3840"
    },{
        evos:{
            "Fomantis":{
                type:["Grass"],
                color:"Pink",
                from:null,
                con:true
            },
            "Lurantis":{
                type:["Grass"],
                color:"Pink",
                from:"Fomantis",
                con:true
            }
        },
        egg:"This egg resembles a dark green bulb with light green leaves around the bottom half. It seems to enjoy sunlight.",
        steps:"5120"
    },{
        evos:{
            "Morelull":{
                type:["Fairy","Grass"],
                color:"Purple",
                from:null,
                con:true
            },
            "Shiinotic":{
                type:["Fairy","Grass"],
                color:"Purple",
                from:"Morelull",
                con:true
            }
        },
        egg:"A pink egg with a darker ring around the base. It shakes from time to time, scattering spores.",
        steps:"5120"
    },{
        evos:{
            "Salandit":{
                type:["Fire","Poison"],
                color:"Black",
                from:null,
                con:true
            },
            "Salazzle":{
                type:["Fire","Poison"],
                color:"Black",
                from:"Salandit",
                con:false
            }
        },
        egg:"A dark grey egg with an odd orange pattern on it. It emits a strangely sweet smell.",
        steps:"5120"
    },{
        evos:{
            "Stufful":{
                type:["Fighting","Normal"],
                color:"Pink",
                from:null,
                con:true
            },
            "Bewear":{
                type:["Fighting","Normal"],
                color:"Black",
                from:"Stufful",
                con:true
            }
        },
        egg:"An adorable pink egg with a white tag on the back. When you hold it, it shakes wildly as if to escape your grip.",
        steps:"3840"
    },{
        evos:{
            "Bounsweet":{
                type:["Grass"],
                color:"Purple",
                from:null,
                con:true
            },
            "Steenee":{
                type:["Grass"],
                color:"Purple",
                from:"Bounsweet",
                con:true
            },
            "Tsareena":{
                type:["Grass"],
                color:"Purple",
                from:"Steenee",
                con:false
            }
        },
        egg:"A pink egg with a green blotch on top and a white one on the bottom. It smells deliciously sweet.",
        steps:"5120"
    },{
        evos:{
            "Comfey":{
                type:["Fairy"],
                color:"Green",
                from:null,
                con:true
            }
        },
        egg:"A light green and orange egg seemingly covered with lovely flowers. It emits a soothing scent.",
        steps:"5120"
    },{
        evos:{
            "Oranguru":{
                type:["Normal","Psychic"],
                color:"White",
                from:null,
                con:true
            }
        },
        egg:"A white egg covered with what seems to be a purple fur cape. There are some blue and orange stripes on it.",
        steps:"5120"
    },{
        evos:{
            "Passimian":{
                type:["Fighting"],
                color:"White",
                from:null,
                con:true
            }
        },
        egg:"A green egg that resembles a coconut. There's an orange blaze on the front. It's surprisingly tough.",
        steps:"5120"
    },{
        evos:{
            "Wimpod":{
                type:["Bug","Water"],
                color:"Gray",
                from:null,
                con:true
            },
            "Golisopod":{
                type:["Bug","Water"],
                color:"Gray",
                from:"Wimpod",
                con:true
            }
        },
        egg:"A purple egg that's partly covered in silver plating. It tries to hop away if you touch it.",
        steps:"5120"
    },{
        evos:{
            "Sandygast":{
                type:["Ghost","Ground"],
                color:"Brown",
                from:null,
                con:true
            },
            "Palossand":{
                type:["Ghost","Ground"],
                color:"Brown",
                from:"Sandygast",
                con:true
            }
        },
        egg:"An egg that mostly resembles a pile of sand. You feel slightly uncomfortable when holding it.",
        steps:"3840"
    },{
        evos:{
            "Pyukumuku":{
                type:["Water"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A black egg with a white marking on the front. It shakes when you try to move it from its spot.",
        steps:"3840"
    },{
        evos:{
            "Type: Null":{
                type:["Normal"],
                color:"Gray",
                from:null,
                con:true
            },
            "Silvally":{
                type:["Normal"],
                color:"Gray",
                from:"Type: Null",
                con:false
            },
            "Silvally [Bug]":{
                type:["Bug"],
                color:"Gray",
                from:"Silvally",
                con:false
            },
            "Silvally [Dark]":{
                type:["Dark"],
                color:"Gray",
                from:"Silvally",
                con:false
            },
            "Silvally [Dragon]":{
                type:["Dragon"],
                color:"Gray",
                from:"Silvally",
                con:false
            },
            "Silvally [Electric]":{
                type:["Electric"],
                color:"Gray",
                from:"Silvally",
                con:false
            },
            "Silvally [Fairy]":{
                type:["Fairy"],
                color:"Gray",
                from:"Silvally",
                con:false
            },
            "Silvally [Fighting]":{
                type:["Fighting"],
                color:"Gray",
                from:"Silvally",
                con:false
            },
            "Silvally [Fire]":{
                type:["Fire"],
                color:"Gray",
                from:"Silvally",
                con:false
            },
            "Silvally [Flying]":{
                type:["Flying"],
                color:"Gray",
                from:"Silvally",
                con:false
            },
            "Silvally [Ghost]":{
                type:["Ghost"],
                color:"Gray",
                from:"Silvally",
                con:false
            },
            "Silvally [Grass]":{
                type:["Grass"],
                color:"Gray",
                from:"Silvally",
                con:false
            },
            "Silvally [Ground]":{
                type:["Ground"],
                color:"Gray",
                from:"Silvally",
                con:false
            },
            "Silvally [Ice]":{
                type:["Ice"],
                color:"Gray",
                from:"Silvally",
                con:false
            },
            "Silvally [Poison]":{
                type:["Poison"],
                color:"Gray",
                from:"Silvally",
                con:false
            },
            "Silvally [Psychic]":{
                type:["Psychic"],
                color:"Gray",
                from:"Silvally",
                con:false
            },
            "Silvally [Rock]":{
                type:["Rock"],
                color:"Gray",
                from:"Silvally",
                con:false
            },
            "Silvally [Steel]":{
                type:["Steel"],
                color:"Gray",
                from:"Silvally",
                con:false
            },
            "Silvally [Water]":{
                type:["Water"],
                color:"Gray",
                from:"Silvally",
                con:false
            }
        },
        egg:"A black egg that is half covered in faded grey fur. Touching it almost feels unnatural. It looks like it'd take a while to hatch.",
        steps:"30720"
    },{
        evos:{
            "Minior [Meteor]":{
                type:["Flying","Rock"],
                color:"Brown",
                from:null,
                con:true
            },
            "Minior [Red Core]":{
                type:["Flying","Rock"],
                color:"Red",
                from:"Minior [Meteor]",
                con:false
            },
            "Minior [Orange Core]":{
                type:["Flying","Rock"],
                color:"Brown",
                from:"Minior [Meteor]",
                con:false
            },
            "Minior [Yellow Core]":{
                type:["Flying","Rock"],
                color:"Yellow",
                from:"Minior [Meteor]",
                con:false
            },
            "Minior [Green Core]":{
                type:["Flying","Rock"],
                color:"Green",
                from:"Minior [Meteor]",
                con:false
            },
            "Minior [Blue Core]":{
                type:["Flying","Rock"],
                color:"Blue",
                from:"Minior [Meteor]",
                con:false
            },
            "Minior [Indigo Core]":{
                type:["Flying","Rock"],
                color:"Blue",
                from:"Minior [Meteor]",
                con:false
            },
            "Minior [Violet Core]":{
                type:["Flying","Rock"],
                color:"Purple",
                from:"Minior [Meteor]",
                con:false
            }
        },
        egg:"An egg that you'd easily mistake for a regular rock, if it weren't for the strange cracks and markings. It keeps slowly spinning around.",
        steps:"6400"
    },{
        evos:{
            "Komala":{
                type:["Normal"],
                color:"Blue",
                from:null,
                con:true
            }
        },
        egg:"A gray egg with four white puffs of fur on the front. You feel slightly drowsy when holding it.",
        steps:"5120"
    },{
        evos:{
            "Turtonator":{
                type:["Dragon","Fire"],
                color:"Red",
                from:null,
                con:true
            }
        },
        egg:"A sturdy, red egg with a yellow and brown pattern on top. It smells like sulfur.",
        steps:"5120"
    },{
        evos:{
            "Togedemaru":{
                type:["Electric","Steel"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A gray and white egg with yellow and brown markings on the back. Agitating it might cause sharp spikes to stand up.",
        steps:"2560"
    },{
        evos:{
            "Mimikyu":{
                type:["Fairy","Ghost"],
                color:"Yellow",
                from:null,
                con:true
            }
        },
        egg:"The real egg seems to be hidden under a rag, decorated by red crayon scribbles. It shakes when it's left alone.",
        steps:"5120"
    },{
        evos:{
            "Bruxish":{
                type:["Psychic","Water"],
                color:"Pink",
                from:null,
                con:true
            }
        },
        egg:"A pink egg with yellow markings and light blue spots. Sometimes, a grinding noise can be heard coming from within.",
        steps:"3840"
    },{
        evos:{
            "Drampa":{
                type:["Dragon","Normal"],
                color:"White",
                from:null,
                con:true
            }
        },
        egg:"A blue-green egg with pale green markings on it. Though you feel like great power emits from the egg, it sits peacefully in your arms.",
        steps:"5120"
    },{
        evos:{
            "Dhelmise":{
                type:["Ghost","Grass"],
                color:"Green",
                from:null,
                con:true
            }
        },
        egg:"A rusty, brown egg with some green seaweed around it. It's surprisingly heavy.",
        steps:"6400"
    },{
        evos:{
            "Jangmo-o":{
                type:["Dragon"],
                color:"Gray",
                from:null,
                con:true
            },
            "Hakamo-o":{
                type:["Dragon","Fighting"],
                color:"Gray",
                from:"Jangmo-o",
                con:true
            },
            "Kommo-o":{
                type:["Dragon","Fighting"],
                color:"Gray",
                from:"Hakamo-o",
                con:true
            }
        },
        egg:"A light gray egg with a large, yellow scale on it. It rolls around, never turning its back on you. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Tapu Koko":{
                type:["Electric","Fairy"],
                color:"Yellow",
                from:null,
                con:true
            }
        },
        egg:"A yellow egg with strange black, orange and white markings. Electric energy seems to build up around it. Touching the egg causes it to shake violently.",
        steps:"20480"
    },{
        evos:{
            "Tapu Lele":{
                type:["Fairy","Psychic"],
                color:"Pink",
                from:null,
                con:true
            }
        },
        egg:"A pink egg with strange black, white and darker pink markings. When you hold it, it sometimes releases glowing scales that will heal any wounds you might have.",
        steps:"20480"
    },{
        evos:{
            "Tapu Bulu":{
                type:["Fairy","Grass"],
                color:"Red",
                from:null,
                con:true
            }
        },
        egg:"A red egg with strange black, white, and yellow markings. Touching it feels almost wooden. If held, vegetation begins to surround it and change shape as if under command.",
        steps:"20480"
    },{
        evos:{
            "Tapu Fini":{
                type:["Fairy","Water"],
                color:"Purple",
                from:null,
                con:true
            }
        },
        egg:"A purple egg with strange black, white and blue markings. It shakes lightly when you hold it, as if assessing you. If you're worthy, purifying water will seep from it.",
        steps:"20480"
    },{
        evos:{
            "Cosmog":{
                type:["Psychic"],
                color:"Blue",
                from:null,
                con:true
            },
            "Cosmoem":{
                type:["Psychic"],
                color:"Blue",
                from:"Cosmog",
                con:true
            },
            "Solgaleo":{
                type:["Psychic","Steel"],
                color:"White",
                from:"Cosmoem",
                con:false
            },
            "Solgaleo [Radiant Sun]":{
                type:["Psychic","Steel"],
                color:"White",
                from:"Solgaleo",
                con:false
            },
            "Lunala":{
                type:["Ghost","Psychic"],
                color:"Purple",
                from:"Cosmoem",
                con:false
            },
            "Lunala [Full Moon]":{
                type:["Ghost","Psychic"],
                color:"Purple",
                from:"Lunala",
                con:false
            }
        },
        egg:"A mysterious egg with a starscape pattern on it. It radiates a great, otherworldly power.",
        steps:"30720"
    },{
        evos:{
            "Nihilego":{
                type:["Poison","Rock"],
                color:"White",
                from:null,
                con:true
            },
            "Nihilego [Parasite]":{
                type:["Poison","Rock"],
                color:"Black",
                from:"Nihilego",
                con:false
            }
        },
        egg:"A beautiful white egg with a ring of star-shaped designs. Touching it makes you feel uneasy.",
        steps:"30720"
    },{
        evos:{
            "Buzzwole":{
                type:["Bug","Fighting"],
                color:"Red",
                from:null,
                con:true
            }
        },
        egg:"A strange egg that seems to be filled with red fluid. It seems to be tougher every time you hold it.",
        steps:"30720"
    },{
        evos:{
            "Pheromosa":{
                type:["Bug","Fighting"],
                color:"White",
                from:null,
                con:true
            }
        },
        egg:"A pale egg adorned with a golden crown. It vibrates occasionally, releasing a relaxing scent.",
        steps:"30720"
    },{
        evos:{
            "Xurkitree":{
                type:["Electric"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"An egg that strongly resembles a roll of black cables, including a zip tie.",
        steps:"30720"
    },{
        evos:{
            "Celesteela":{
                type:["Flying","Steel"],
                color:"Green",
                from:null,
                con:true
            }
        },
        egg:"A green egg with various layers that are reminiscent of a dress. It radiates an incredible power. It's surprisingly heavy.",
        steps:"30720"
    },{
        evos:{
            "Kartana":{
                type:["Grass","Steel"],
                color:"White",
                from:null,
                con:true
            }
        },
        egg:"A white egg with orange and yellow markings. It is incredibly light. Holding it gives you a strong sense of danger.",
        steps:"30720"
    },{
        evos:{
            "Guzzlord":{
                type:["Dark","Dragon"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A black and yellow egg with an ominous pattern on the front that reminds you of teeth. It's extremely heavy.",
        steps:"30720"
    },{
        evos:{
            "Necrozma":{
                type:["Psychic"],
                color:"Black",
                from:null,
                con:true
            },
            "Necrozma [Dusk Mane]":{
                type:["Psychic"],
                color:"Black",
                from:"Necrozma",
                con:false
            },
            "Necrozma [Dawn Wings]":{
                type:["Psychic"],
                color:"Black",
                from:"Necrozma",
                con:false
            },
            "Ultra Necrozma":{
                type:["Psychic","Dragon"],
                color:"White",
                from:"Necrozma [Dusk Mane]",
                con:false
            },
        },
        egg:"A black, crystalline egg. It refracts light like a prism and often shakes viciously.",
        steps:"30720"
    },{
        evos:{
            "Magearna":{
                type:["Fairy","Steel"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A metallic, gray and white egg with a pair of wavy, gold lines on it. It vaguely reminds you of a Pokéball. The colors seem to have faded over time.",
        steps:"30720"
    },{
        evos:{
            "Magearna [Original Color]":{
                type:["Fairy","Steel"],
                color:"Red",
                from:null,
                con:true
            }
        },
        egg:"A metallic, red and white egg with a pair of wavy, gold lines on it. It strongly reminds you of a Pokéball. The colors seem to be fresh, as if applied recently.",
        steps:"30720"
    },{
        evos:{
            "Marshadow":{
                type:["Fighting","Ghost"],
                color:"Gray",
                from:null,
                con:true
            },
            "Marshadow [Zenith]":{
                type:["Fighting","Ghost"],
                color:"Gray",
                from:"Marshadow",
                con:false
            }
        },
        egg:"A dark gray egg. Barely more than a shadow, it's easily overlooked.",
        steps:"30720"
    },{
        evos:{
            "Poipole":{
                type:["Poison"],
                color:"Purple",
                from:null,
                con:true
            },
            "Naganadel":{
                type:["Dragon","Poison"],
                color:"Black",
                from:"Poipole",
                con:false
            }
        },
        egg:"A purple egg with a fuchsia top. It looks out of place in this world.",
        steps:"30720"
    },{
        evos:{
            "Stakataka":{
                type:["Rock","Steel"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A dark gray egg made of stone with some blue marks on it. Touching the top will cause it to shake violently.",
        steps:"30720"
    },{
        evos:{
            "Blacephalon":{
                type:["Fire","Ghost"],
                color:"White",
                from:null,
                con:true
            }
        },
        egg:"A dazzling, yellow egg with pink and blue stripes. It rolls around freely.",
        steps:"30720"
    },{
        evos:{
            "Zeraora":{
                type:["Electric"],
                color:"Yellow",
                from:null,
                con:true
            }
        },
        egg:"A yellow egg with a black blotch and blue lightning bolt-shaped stripes on it. It shakes intensely when something electric is near.",
        steps:"30720"
    },{
        evos:{
            "Meltan":{
                type:["Steel"],
                color:"Gray",
                from:null,
                con:true
            },
            "Melmetal":{
                type:["Steel"],
                color:"Gray",
                from:"Meltan",
                con:false
            },
            "Gmax Melmetal [Gmax]":{
                type:["Steel"],
                color:"Gray",
                from:"Melmetal",
                con:false
            }
        },
        egg:"A shiny, silvery egg. It shakes when any type of metal is near.",
        steps:"30720"
    },{
        evos:{
            "Grookey":{
                type:["Grass"],
                color:"Green",
                from:null,
                con:true
            },
            "Thwackey":{
                type:["Grass"],
                color:"Green",
                from:"Grookey",
                con:true
            },
            "Rillaboom":{
                type:["Grass"],
                color:"Green",
                from:"Thwackey",
                con:true
            },
            "Gmax Rillaboom [Gmax]":{
                type:["Grass"],
                color:"Green",
                from:"Rillaboom",
                con:false
            }
        },
        egg:"A green egg with yellow and orange blotches on the front. You can hear a soft tapping sound coming from within.",
        steps:"5120"
    },{
        evos:{
            "Scorbunny":{
                type:["Fire"],
                color:"White",
                from:null,
                con:true
            },
            "Raboot":{
                type:["Fire"],
                color:"Gray",
                from:"Scorbunny",
                con:true
            },
            "Cinderace":{
                type:["Fire"],
                color:"White",
                from:"Raboot",
                con:true
            },
            "Gmax Cinderace [Gmax]":{
                type:["Fire"],
                color:"White",
                from:"Cinderace",
                con:false
            }
        },
        egg:"A white egg with an orange top. When it shakes, the yellow spot on the front heats up.",
        steps:"5120"
    },{
        evos:{
            "Sobble":{
                type:["Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Drizzile":{
                type:["Water"],
                color:"Blue",
                from:"Sobble",
                con:true
            },
            "Inteleon":{
                type:["Water"],
                color:"Blue",
                from:"Drizzile",
                con:true
            },
            "Gmax Inteleon [Gmax]":{
                type:["Water"],
                color:"Blue",
                from:"Inteleon",
                con:false
            }
        },
        egg:"A blue egg with a strange, circular pattern on it. When wet, it becomes difficult to see.",
        steps:"5120"
    },{
        evos:{
            "Skwovet":{
                type:["Normal"],
                color:"Brown",
                from:null,
                con:true
            },
            "Greedent":{
                type:["Normal"],
                color:"Brown",
                from:"Skwovet",
                con:true
            }
        },
        egg:"A dark brown egg with orange spots. It shakes in excitement when berries are near.",
        steps:"5120"
    },{
        evos:{
            "Rookidee":{
                type:["Flying"],
                color:"Blue",
                from:null,
                con:true
            },
            "Corvisquire":{
                type:["Flying"],
                color:"Blue",
                from:"Rookidee",
                con:true
            },
            "Corviknight":{
                type:["Flying","Steel"],
                color:"Purple",
                from:"Corvisquire",
                con:true
            },
            "Gmax Corviknight [Gmax]":{
                type:["Flying","Steel"],
                color:"Purple",
                from:"Corviknight",
                con:false
            }
        },
        egg:"An egg with a pattern of blue, black and yellow. It hops around sometimes.",
        steps:"3840"
    },{
        evos:{
            "Blipbug":{
                type:["Bug"],
                color:"Blue",
                from:null,
                con:true
            },
            "Dottler":{
                type:["Bug","Psychic"],
                color:"Yellow",
                from:"Blipbug",
                con:true
            },
            "Orbeetle":{
                type:["Bug","Psychic"],
                color:"Red",
                from:"Dottler",
                con:true
            },
            "Gmax Orbeetle [Gmax]":{
                type:["Bug","Psychic"],
                color:"Red",
                from:"Orbeetle",
                con:false
            }
        },
        egg:"A red egg with a total of seven purple spots on it. Said to be the egg of some sort of bug.",
        steps:"3840"
    },{
        evos:{
            "Nickit":{
                type:["Dark"],
                color:"Brown",
                from:null,
                con:true
            },
            "Thievul":{
                type:["Dark"],
                color:"Brown",
                from:"Nickit",
                con:true
            }
        },
        egg:"A reddish brown egg with dirt covering its bottom. Any traces or marks it leaves behind seems to get swept away somehow.",
        steps:"3840"
    },{
        evos:{
            "Gossifleur":{
                type:["Grass"],
                color:"Green",
                from:null,
                con:true
            },
            "Eldegoss":{
                type:["Grass"],
                color:"Green",
                from:"Gossifleur",
                con:true
            }
        },
        egg:"A yellow egg with some petals on top. It will whirl around when exposed to wind.",
        steps:"5120"
    },{
        evos:{
            "Wooloo":{
                type:["Normal"],
                color:"White",
                from:null,
                con:true
            },
            "Dubwool":{
                type:["Normal"],
                color:"White",
                from:"Wooloo",
                con:true
            }
        },
        egg:"A brown egg that seems to be covered with a thick layer of fluffy white wool.",
        steps:"3840"
    },{
        evos:{
            "Chewtle":{
                type:["Water"],
                color:"Green",
                from:null,
                con:true
            },
            "Drednaw":{
                type:["Water","Rock"],
                color:"Green",
                from:"Chewtle",
                con:true
            },
            "Gmax Drednaw [Gmax]":{
                type:["Water","Rock"],
                color:"Green",
                from:"Drednaw",
                con:false
            }
        },
        egg:"A light blue egg with a white protrusion at the front and two orange dots on either side of it.",
        steps:"5120"
    },{
        evos:{
            "Yamper":{
                type:["Electric"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Boltund":{
                type:["Electric"],
                color:"Yellow",
                from:"Yamper",
                con:true
            }
        },
        egg:"A tan egg with a heart patch on it. Touching it causes sparks to crackle across its surface.",
        steps:"5120"
    },{
        evos:{
            "Rolycoly":{
                type:["Rock"],
                color:"Black",
                from:null,
                con:true
            },
            "Carkol":{
                type:["Fire","Rock"],
                color:"Black",
                from:"Rolycoly",
                con:true
            },
            "Coalossal":{
                type:["Fire","Rock"],
                color:"Black",
                from:"Carkol",
                con:true
            },
            "Gmax Coalossal [Gmax]":{
                type:["Fire","Rock"],
                color:"Black",
                from:"Coalossal",
                con:false
            }
        },
        egg:"A coal-black egg. When you hold it, it radiates a comfortable heat. It rolls around sometimes.",
        steps:"3840"
    },{
        evos:{
            "Applin":{
                type:["Dragon","Grass"],
                color:"Green",
                from:null,
                con:true
            },
            "Flapple":{
                type:["Dragon","Grass"],
                color:"Green",
                from:"Applin",
                con:false
            },
            "Gmax Flapple [Gmax]":{
                type:["Dragon","Grass"],
                color:"Green",
                from:"Flapple",
                con:false
            },
            "Appletun":{
                type:["Dragon","Grass"],
                color:"Green",
                from:"Applin",
                con:false
            },
            "Gmax Appletun [Gmax]":{
                type:["Dragon","Grass"],
                color:"Green",
                from:"Appletun",
                con:false
            },
            "Dipplin":{
                type:["Dragon","Grass"],
                color:"Green",
                from:"Applin",
                con:false
            },
            "Hydrapple":{
                type:["Dragon","Grass"],
                color:"Green",
                from:"Dipplin",
                con:false
            }
        },
        egg:"An egg that looks exactly like a red apple, and nothing more.",
        steps:"5120"
    },{
        evos:{
            "Silicobra":{
                type:["Ground"],
                color:"Green",
                from:null,
                con:true
            },
            "Sandaconda":{
                type:["Ground"],
                color:"Green",
                from:"Silicobra",
                con:true
            },
            "Gmax Sandaconda [Gmax]":{
                type:["Ground"],
                color:"Green",
                from:"Sandaconda",
                con:false
            }
        },
        egg:"A green egg with a white blotch on top and several black marks. It's covered in sand.",
        steps:"5120"
    },{
        evos:{
            "Cramorant":{
                type:["Flying","Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Cramorant [Gulping]":{
                type:["Flying","Water"],
                color:"Blue",
                from:"Cramorant",
                con:true
            },
            "Cramorant [Gorging]":{
                type:["Flying","Water"],
                color:"Blue",
                from:"Cramorant",
                con:true
            }
        },
        egg:"A blue egg with two large green spots that look like eyes. It shakes when near food.",
        steps:"5120"
    },{
        evos:{
            "Arrokuda":{
                type:["Water"],
                color:"Brown",
                from:null,
                con:true
            },
            "Barraskewda":{
                type:["Water"],
                color:"Brown",
                from:"Arrokuda",
                con:true
            },
        },
        egg:"An egg that is two shades of brown. It tries to roll towards you when you approach, but it's not very good at it.",
        steps:"5120"
    },{
        evos:{
            "Toxel":{
                type:["Electric","Poison"],
                color:"Purple",
                from:null,
                con:true
            },
            "Toxtricity [Amped]":{
                type:["Electric","Poison"],
                color:"Purple",
                from:"Toxel",
                con:false
            },
            "Toxtricity [Low Key]":{
                type:["Electric","Poison"],
                color:"Purple",
                from:"Toxel",
                con:false
            },
            "Gmax Toxtricity [Gmax]":{
                type:["Electric","Poison"],
                color:"Purple",
                from:"Toxtricity [Amped]",
                con:false
            }
        },
        egg:"A violet egg with odd markings on it. Touching it gives you a tingling paralysis.",
        steps:"6400"
    },{
        evos:{
            "Sizzlipede":{
                type:["Bug","Fire"],
                color:"Red",
                from:null,
                con:true
            },
            "Centiskorch":{
                type:["Bug","Fire"],
                color:"Red",
                from:"Sizzlipede",
                con:true
            },
            "Gmax Centiskorch [Gmax]":{
                type:["Bug","Fire"],
                color:"Red",
                from:"Centiskorch",
                con:false
            }
        },
        egg:"A red egg covered with a brown shell. It has a yellow circle on it that gives off heat. It moves around when you try to hold it.",
        steps:"5120"
    },{
        evos:{
            "Clobbopus":{
                type:["Fighting"],
                color:"Brown",
                from:null,
                con:true
            },
            "Grapploct":{
                type:["Fighting"],
                color:"Blue",
                from:"Clobbopus",
                con:false
            }
        },
        egg:"An off-white egg with orange spots on top. It rolls around, bumping into you sometimes.",
        steps:"6400"
    },{
        evos:{
            "Sinistea":{
                type:["Ghost"],
                color:"Purple",
                from:null,
                con:true
            },
            "Polteageist":{
                type:["Ghost"],
                color:"Purple",
                from:"Sinistea",
                con:false
            }
        },
        egg:"A bold purple egg with gold swirls. The egg smells strangely fragrant.",
        steps:"5120"
    },{
        evos:{
            "Hatenna":{
                type:["Psychic"],
                color:"Pink",
                from:null,
                con:true
            },
            "Hattrem":{
                type:["Psychic"],
                color:"Pink",
                from:"Hatenna",
                con:true
            },
            "Hatterene":{
                type:["Psychic","Fairy"],
                color:"Pink",
                from:"Hattrem",
                con:true
            },
            "Gmax Hatterene [Gmax]":{
                type:["Psychic","Fairy"],
                color:"Pink",
                from:"Hatterene",
                con:false
            }
        },
        egg:"A blue and pink egg with several white spots. It feels like it's trying to sense your emotions.",
        steps:"5120"
    },{
        evos:{
            "Impidimp":{
                type:["Dark","Fairy"],
                color:"Pink",
                from:null,
                con:true
            },
            "Morgrem":{
                type:["Dark","Fairy"],
                color:"Pink",
                from:"Impidimp",
                con:true
            },
            "Grimmsnarl":{
                type:["Dark","Fairy"],
                color:"Purple",
                from:"Morgrem",
                con:true
            },
            "Gmax Grimmsnarl [Gmax]":{
                type:["Dark","Fairy"],
                color:"Purple",
                from:"Grimmsnarl",
                con:false
            }
        },
        egg:"A pink egg with a black mask pattern and a red mark near the bottom. It shakes uncontrollably when you are near.",
        steps:"5120"
    },{
        evos:{
            "Milcery":{
                type:["Fairy"],
                color:"White",
                from:null,
                con:true
            },
            "Alcremie [Strawberry]":{
                type:["Fairy"],
                color:"White",
                from:"Milcery",
                con:false
            },
            "Alcremie [Berry]":{
                type:["Fairy"],
                color:"White",
                from:"Milcery",
                con:false
            },
            "Alcremie [Love]":{
                type:["Fairy"],
                color:"White",
                from:"Milcery",
                con:false
            },
            "Alcremie [Star]":{
                type:["Fairy"],
                color:"White",
                from:"Milcery",
                con:false
            },
            "Alcremie [Clover]":{
                type:["Fairy"],
                color:"White",
                from:"Milcery",
                con:false
            },
            "Alcremie [Flower]":{
                type:["Fairy"],
                color:"White",
                from:"Milcery",
                con:false
            },
            "Alcremie [Ribbon]":{
                type:["Fairy"],
                color:"White",
                from:"Milcery",
                con:false
            },
            "Gmax Alcremie [Gmax]":{
                type:["Fairy"],
                color:"White",
                from:"Alcremie [Strawberry]",
                con:false
            }
        },
        egg:"A cream colored egg with two white spots that look like eyes. It spins around sometimes.",
        steps:"2560"
    },{
        evos:{
            "Falinks":{
                type:["Fighting"],
                color:"Yellow",
                from:null,
                con:true
            }
        },
        egg:"A yellow and red egg with a black blotch and a large crest in the front. The egg rocks back and forth rhythmically.",
        steps:"6400"
    },{
        evos:{
            "Pincurchin":{
                type:["Electric"],
                color:"Purple",
                from:null,
                con:true
            }
        },
        egg:"A dark egg with a yellow blotch on the front. The gray spots will give an electric shock when touched.",
        steps:"5120"
    },{
        evos:{
            "Snom":{
                type:["Bug","Ice"],
                color:"White",
                from:null,
                con:true
            },
            "Frosmoth":{
                type:["Bug","Ice"],
                color:"White",
                from:"Snom",
                con:false
            }
        },
        egg:"A white egg encased in ice. Said to be the egg of a bug.",
        steps:"5120"
    },{
        evos:{
            "Stonjourner":{
                type:["Rock"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A gray egg covered in mud. There appears to be a strange glyph protruding from its surface.",
        steps:"6400"
    },{
        evos:{
            "Eiscue [Ice Face]":{
                type:["Ice"],
                color:"Blue",
                from:null,
                con:true
            },
            "Eiscue [Noice Face]":{
                type:["Ice"],
                color:"Blue",
                from:null,
                con:false
            }
        },
        egg:"A black and white egg that somehow seems to be encased in a solid block of ice.",
        steps:"5120"
    },{
        evos:{
            "Indeedee":{
                type:["Psychic","Normal"],
                color:"Purple",
                from:null,
                con:true
            }
        },
        egg:"An egg that is colored purple and white. It emanates an odd comforting feel.",
        steps:"10240"
    },{
        evos:{
            "Morpeko [Full Belly]":{
                type:["Dark","Electric"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Morpeko [Hangry]":{
                type:["Dark","Electric"],
                color:"Purple",
                from:"Morpeko [Full Belly]",
                con:false
            }
        },
        egg:"A yellow egg with black and brown patches on it. When touched, it can suddenly switch from gently moving to shaking violently, and back again.",
        steps:"2560"
    },{
        evos:{
            "Cufant":{
                type:["Steel"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Copperajah":{
                type:["Steel"],
                color:"Green",
                from:"Cufant",
                con:true
            },
            "Gmax Copperajah [Gmax]":{
                type:["Steel"],
                color:"Green",
                from:"Copperajah",
                con:false
            }
        },
        egg:"A tangerine egg with a green pattern on it. Exposing it to rain will tarnish its surface.",
        steps:"6400"
    },{
        evos:{
            "Dracozolt":{
                type:["Electric","Dragon"],
                color:"Green",
                from:null,
                con:true
            }
        },
        egg:"A dark green egg with red and yellow markings. It seems a bit lopsided...",
        steps:"8960"
    },{
        evos:{
            "Arctozolt":{
                type:["Electric","Ice"],
                color:"Blue",
                from:null,
                con:true
            }
        },
        egg:"A blue egg with snow on top. It has one large light blue spot and two smaller yellow spots. It shakes uncomfortably.",
        steps:"8960"
    },{
        evos:{
            "Dracovish":{
                type:["Water","Dragon"],
                color:"Green",
                from:null,
                con:true
            }
        },
        egg:"A blue egg with gray, red, and green patterns. It's top-heavy and falls over often.",
        steps:"8960"
    },{
        evos:{
            "Arctovish":{
                type:["Water","Ice"],
                color:"Blue",
                from:null,
                con:true
            }
        },
        egg:"A light blue egg with gray and dark blue markings. It's cold to the touch and a bit uncomfortable to hold.",
        steps:"8960"
    },{
        evos:{
            "Duraludon":{
                type:["Dragon","Steel"],
                color:"Gray",
                from:null,
                con:true
            },
            "Gmax Duraludon [Gmax]":{
                type:["Dragon","Steel"],
                color:"Gray",
                from:"Duraludon",
                con:false
            },
            "Archaludon":{
                type:["Dragon","Steel"],
                color:"White",
                from:"Duraludon",
                con:false
            }
        },
        egg:"A silver egg that is dark blue on the bottom, and resembles polished metal. It's surprisingly light.",
        steps:"7680"
    },{
        evos:{
            "Dreepy":{
                type:["Dragon","Ghost"],
                color:"Green",
                from:null,
                con:true
            },
            "Drakloak":{
                type:["Dragon","Ghost"],
                color:"Green",
                from:"Dreepy",
                con:true
            },
            "Dragapult":{
                type:["Dragon","Ghost"],
                color:"Green",
                from:"Drakloak",
                con:true
            }
        },
        egg:"A green egg with a light green bottom and red stripes along the sides. It seems like it wants to be held.",
        steps:"10240"
    },{
        evos:{
            "Zacian [Hero of Many Battles]":{
                type:["Fairy","Steel"],
                color:"Blue",
                from:null,
                con:true
            },
            "Zacian [Crowned Sword]":{
                type:["Fairy","Steel"],
                color:"Blue",
                from:"Zacian [Hero of Many Battles]",
                con:true
            }
        },
        egg:"A beige egg with a copper-orange pattern. It sometimes makes metallic clanking noises, as if something is fighting to get out.",
        steps:"30720"
    },{
        evos:{
            "Zamazenta [Hero of Many Battles]":{
                type:["Fighting","Steel"],
                color:"Red",
                from:null,
                con:true
            },
            "Zamazenta [Crowned Shield]":{
                type:["Fighting","Steel"],
                color:"Red",
                from:"Zamazenta [Hero of Many Battles]",
                con:true
            }
        },
        egg:"A beige egg with a blood-red pattern. It is unbelievably tough, as if it could never break.",
        steps:"30720"
    },{
        evos:{
            "Glastrier":{
                type:["Ice"],
                color:"White",
                from:null,
                con:true
            }
        },
        egg:"A pale egg covered in extremely solid ice. It is heavier than it seems. It appears to freeze everything around it.",
        steps:"30720"
    },{
        evos:{
            "Spectrier":{
                type:["Ghost"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A black and purple egg with a wavy pale pattern. It gives off an eerie and uncomfortable vibe...",
        steps:"30720"
    },{
        evos:{
            "Calyrex":{
                type:["Psychic","Grass"],
                color:"Green",
                from:null,
                con:true
            },
            "Calyrex [Ice Rider]":{
                type:["Psychic","Ice"],
                color:"Green",
                from:"Calyrex",
                con:false
            },
            "Calyrex [Shadow Rider]":{
                type:["Psychic","Ghost"],
                color:"Green",
                from:"Calyrex",
                con:false
            }
        },
        egg:"A dark green egg with an odd navy triangular pattern and a mark on the top. It gives off an aura of nobility.",
        steps:"20480"
    },{
        evos:{
            "Eternatus":{
                type:["Poison","Dragon"],
                color:"Purple",
                from:null,
                con:true
            },
            "Eternatus [Eternamax]":{
                type:["Poison","Dragon"],
                color:"Purple",
                from:"Eternatus",
                con:false
            }
        },
        egg:"A pinkish-red egg with a bright, swirling center. You feel a tremendous energy emanating from it. The sky darkens as you approach.",
        steps:"30720"
    },{
        evos:{
            "Kubfu":{
                type:["Fighting"],
                color:"Gray",
                from:null,
                con:true
            },
            "Urshifu [Single Strike]":{
                type:["Fighting","Dark"],
                color:"Gray",
                from:"Kubfu",
                con:false
            },
            "Urshifu [Single Strike Gmax]":{
                type:["Fighting","Dark"],
                color:"Gray",
                from:"Urshifu [Single Strike]",
                con:false
            },
            "Urshifu [Rapid Strike]":{
                type:["Fighting","Water"],
                color:"Gray",
                from:"Kubfu",
                con:false
            },
            "Urshifu [Rapid Strike Gmax]":{
                type:["Fighting","Water"],
                color:"Gray",
                from:"Urshifu [Rapid Strike]",
                con:false
            }
        },
        egg:"A gray egg with a pale yellow blotch on the front. Being around it gets you pumped up.",
        steps:"30720"
    },{
        evos:{
            "Regidrago":{
                type:["Dragon"],
                color:"Green",
                from:null,
                con:true
            }
        },
        egg:"A magenta egg with a bizarre cyan dot pattern on the front. It radiates draconic energy.",
        steps:"20480"
    },{
        evos:{
            "Regieleki":{
                type:["Electric"],
                color:"Yellow",
                from:null,
                con:true
            }
        },
        egg:"A yellow egg with a bizarre red dot pattern on the front. It shakes rapidly while releasing electricity.",
        steps:"20480"
    },{
        evos:{
            "Galarian Articuno":{
                type:["Psychic","Flying"],
                color:"Purple",
                from:null,
                con:true
            }
        },
        egg:"A pinkish egg with a bizarre dark purple pattern on the top and an odd beak-like pattern on the front. The air around this egg is unbearably cold at times.",
        steps:"20480"
    },{
        evos:{
            "Galarian Zapdos":{
                type:["Fighting","Flying"],
                color:"Yellow",
                from:null,
                con:true
            }
        },
        egg:"An orange egg with a bizarre black pattern on it. It's often dangerous to touch it, because doing so might result in a really bad shock.",
        steps:"20480"
    },{
        evos:{
            "Galarian Moltres":{
                type:["Dark","Flying"],
                color:"Red",
                from:null,
                con:true
            }
        },
        egg:"A black with a red spot on the front and several pink flame-like markings. It's difficult to hold for extended periods of time due to being so hot.",
        steps:"20480"
    },{
        evos:{
            "Enamorus [Incarnate]":{
                type:["Fairy","Flying"],
                color:"Pink",
                from:null,
                con:true
            },
            "Enamorus [Therian]":{
                type:["Fairy","Flying"],
                color:"Pink",
                from:null,
                con:true
            }
        },
        egg:"A hot pink egg covered in red splotches. Its presence makes flowers bloom nearby.",
        steps:"30720"
    },{
        evos:{
            "Sprigatito":{
                type:["Grass"],
                color:"Green",
                from:null,
                con:true
            },
            "Floragato":{
                type:["Grass"],
                color:"Green",
                from:"Sprigatito",
                con:true
            },
            "Meowscarada":{
                type:["Grass","Dark"],
                color:"Green",
                from:"Floragato",
                con:true
            }
        },
        egg:"A green egg with a large, dark green splotch and a pink spot on the front. Something seems vaguely familiar about it...",
        steps:"5120"
    },{
        evos:{
            "Fuecoco":{
                type:["Fire"],
                color:"Red",
                from:null,
                con:true
            },
            "Crocalor":{
                type:["Fire"],
                color:"Red",
                from:"Fuecoco",
                con:true
            },
            "Skeledirge":{
                type:["Fire","Ghost"],
                color:"Red",
                from:"Crocalor",
                con:true
            }
        },
        egg:"A red egg with a cream, skull-like marking. Something seems vaguely familiar about it...",
        steps:"5120"
    },{
        evos:{
            "Quaxly":{
                type:["Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Quaxwell":{
                type:["Water"],
                color:"Blue",
                from:"Quaxly",
                con:true
            },
            "Quaquaval":{
                type:["Water","Fighting"],
                color:"Blue",
                from:"Quaxwell",
                con:true
            }
        },
        egg:"A white egg with a light blue wad of gel on top. It shakes rhythmically when it hears music. There’s something vaguely familiar about it...",
        steps:"5120"
    },{
        evos:{
            "Lechonk":{
                type:["Normal"],
                color:"Gray",
                from:null,
                con:true
            },
            "Oinkologne":{
                type:["Normal"],
                color:"Gray",
                from:"Lechonk",
                con:false
            },
            "Oinkologne":{
                type:["Normal"],
                color:"Brown",
                from:"Lechonk",
                con:false
            }
        },
        egg:"A black egg with a brown splotch and a pink spot shaped like a nose. The egg smells like herbs.",
        steps:"3840"
    },{
        evos:{
            "Tarountula":{
                type:["Bug"],
                color:"White",
                from:null,
                con:true
            },
            "Spidops":{
                type:["Bug"],
                color:"Green",
                from:"Tarountula",
            },
        },
        egg:"A white egg that looks like it's made out of string all wrapped up into a ball.",
        steps:"3840"
    },{
        evos:{
            "Pawmi":{
                type:["Electric"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Pawmo":{
                type:["Electric","Fighting"],
                color:"Yellow",
                from:"Pawmi",
                con:true
            },
            "Pawmot":{
                type:["Electric","Fighting"],
                color:"Yellow",
                from:"Pawmo",
                con:true
            }
        },
        egg:"An orange egg with a beige spot and two yellow spots. Touching it may shock you.",
        steps:"3840"
    },{
        evos:{
            "Tandemaus":{
                type:["Normal"],
                color:"White",
                from:null,
                con:true
            },
            "Maushold [Family of Three]":{
                type:["Normal"],
                color:"White",
                from:"Tandemaus",
                con:true
            },
            "Maushold [Family of Four]":{
                type:["Normal"],
                color:"White",
                from:"Tandemaus",
                con:true
            }
        },
        egg:"A white and blue egg with an interlocking jigsaw pattern.",
        steps:"3840"
    },{
        evos:{
            "Fidough":{
                type:["Fairy"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Dachsbun":{
                type:["Fairy"],
                color:"Brown",
                from:"Fidough",
                con:true
            }
        },
        egg:"A tan egg that's soft as kneaded dough. It's sticky to the touch.",
        steps:"5120"
    },{
        evos:{
            "Smoliv":{
                type:["Grass","Normal"],
                color:"Green",
                from:null,
                con:true
            },
            "Dolliv":{
                type:["Grass","Normal"],
                color:"Green",
                from:"Smoliv",
                con:true
            },
            "Arboliva":{
                type:["Grass","Normal"],
                color:"Green",
                from:"Dolliv",
                con:true
            }
        },
        egg:"A shiny green egg. It seems to be sweating fragrant oil...",
        steps:"5120"
    },{
        evos:{
            "Squawkabilly [Green Plumage]":{
                type:["Normal","Flying"],
                color:"Green",
                from:null,
                con:true
            }
        },
        egg:"An egg colored black, gold, gray, and green. It's supposed to be the egg of a bird. It shakes when near similar-looking eggs of different colors.",
        steps:"3840"
    },{
        evos:{
            "Squawkabilly [White Plumage]":{
                type:["Normal","Flying"],
                color:"White",
                from:null,
                con:true
            }
        },
        egg:"An egg colored black, gold, gray, and white. It's supposed to be the egg of a bird. It shakes when near similar-looking eggs of different colors.",
        steps:"3840"
    },{
        evos:{
            "Squawkabilly [Yellow Plumage]":{
                type:["Normal","Flying"],
                color:"Yellow",
                from:null,
                con:true
            }
        },
        egg:"An egg colored black, gold, gray, and yellow. It's supposed to be the egg of a bird. It shakes when near similar-looking eggs of different colors.",
        steps:"3840"
    },{
        evos:{
            "Squawkabilly [Blue Plumage]":{
                type:["Normal","Flying"],
                color:"Blue",
                from:null,
                con:true
            }
        },
        egg:"An egg colored black, gold, gray, and blue. It's supposed to be the egg of a bird. It shakes when near similar-looking eggs of different colors.",
        steps:"3840"
    },{
        evos:{
            "Nacli":{
                type:["Rock"],
                color:"Brown",
                from:null,
                con:true
            },
            "Naclstack":{
                type:["Rock"],
                color:"Brown",
                from:"Nacli",
                con:true
            },
            "Garganacl":{
                type:["Rock"],
                color:"Brown",
                from:"Naclstack",
                con:true
            }
        },
        egg:"A brown egg with a light brown stripe. It has a grainy cube of what appears to be salt sticking out of it.",
        steps:"5120"
    },{
        evos:{
            "Charcadet":{
                type:["Fire"],
                color:"Red",
                from:null,
                con:true
            },
            "Armarouge":{
                type:["Fire","Psychic"],
                color:"Red",
                from:"Charcadet",
                con:false
            },
            "Ceruledge":{
                type:["Fire","Ghost"],
                color:"Purple",
                from:"Charcadet",
                con:false
            }
        },
        egg:"A dark gray egg with a brown band, red notches, and three black marks. It is very hot to the touch and appears to be made of charcoal.",
        steps:"8960"
    },{
        evos:{
            "Tadbulb":{
                type:["Electric"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Bellibolt":{
                type:["Electric"],
                color:"Green",
                from:"Tadbulb",
                con:false
            }
        },
        egg:"A grey egg with a yellow top and an orange band along the bottom. The white spots on its top occasionally light up.",
        steps:"5120"
    },{
        evos:{
            "Maschiff":{
                type:["Dark"],
                color:"Brown",
                from:null,
                con:true
            },
            "Mabosstiff":{
                type:["Dark"],
                color:"Gray",
                from:"Maschiff",
                con:true
            }
        },
        egg:"A brick red egg with a yellow spot on top. It also has a purple and white patch that looks like it's snarling.",
        steps:"5120"
    },{
        evos:{
            "Shroodle":{
                type:["Poison","Normal"],
                color:"Gray",
                from:null,
                con:true
            },
            "Grafaiai":{
                type:["Poison","Normal"],
                color:"Gray",
                from:"Shroodle",
                con:true
            }
        },
        egg:"An egg that is half blue and half black. It smells like paint.",
        steps:"5120"
    },{
        evos:{
            "Bramblin":{
                type:["Grass","Ghost"],
                color:"Brown",
                from:null,
                con:true
            },
            "Brambleghast":{
                type:["Grass","Ghost"],
                color:"Brown",
                from:"Bramblin",
                con:true
            }
        },
        egg:"An egg that is half brown and half orange. The slightest breeze will send it rolling away.",
        steps:"5120"
    },{
        evos:{
            "Toedscool":{
                type:["Ground","Grass"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Toedscruel":{
                type:["Ground","Grass"],
                color:"Black",
                from:"Toedscool",
                con:true
            },
        },
        egg:"A pale pink egg with three yellow spots. The egg is squishy and looks delicious.",
        steps:"5120"
    },{
        evos:{
            "Klawf":{
                type:["Rock"],
                color:"Red",
                from:null,
                con:true
            }
        },
        egg:"A tan egg with several intricate etchings into the shell. If you place it on a wall, it sticks for a few minutes.",
        steps:"8960"
    },{
        evos:{
            "Capsakid":{
                type:["Grass"],
                color:"Green",
                from:null,
                con:true
            },
            "Scovillain":{
                type:["Grass","Fire"],
                color:"Green",
                from:"Capsakid",
                con:false
            }
        },
        egg:"A green egg with an orange blotch and a white pattern on top. It is warm to the touch.",
        steps:"5120"
    },{
        evos:{
            "Rellor":{
                type:["Bug"],
                color:"Brown",
                from:null,
                con:true
            },
            "Rabsca":{
                type:["Bug","Psychic"],
                color:"Green",
                from:"Rellor",
                con:true
            }
        },
        egg:"This looks more like a ball of mud than an egg. It rolls around freely.",
        steps:"5120"
    },{
        evos:{
            "Flittle":{
                type:["Psychic"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Espathra":{
                type:["Psychic"],
                color:"Yellow",
                from:"Flittle",
                con:true
            }
        },
        egg:"A yellow egg with purple and orange stripes on the bottom and a purple triangle on the front. It radiates a strange power.",
        steps:"5120"
    },{
        evos:{
            "Tinkatink":{
                type:["Fairy","Steel"],
                color:"Pink",
                from:null,
                con:true
            },
            "Tinkatuff":{
                type:["Fairy","Steel"],
                color:"Pink",
                from:"Tinkatink",
                con:true
            },
            "Tinkaton":{
                type:["Fairy","Steel"],
                color:"Pink",
                from:"Tinkatuff",
                con:true
            }
        },
        egg:"A dark pink egg with light pink spots on the top and sides. It has a purple gem on the front that shines like steel.",
        steps:"5120"
    },{
        evos:{
            "Wiglett":{
                type:["Water"],
                color:"White",
                from:null,
                con:true
            },
            "Wugtrio":{
                type:["Water"],
                color:"Red",
                from:"Wiglett",
                con:true
            },
        },
        egg:"A white egg with a pink spot on it. The egg is slightly damp.",
        steps:"5120"
    },{
        evos:{
            "Bombirdier":{
                type:["Flying","Dark"],
                color:"White",
                from:null,
                con:true
            }
        },
        egg:"A white egg with a gray and black feather pattern on the sides. It's supposed to be the egg of a bird.",
        steps:"8960"
    },{
        evos:{
            "Finizen":{
                type:["Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Palafin [Zero]":{
                type:["Water"],
                color:"Blue",
                from:"Finizen",
                con:true
            },
            "Palafin [Hero]":{
                type:["Water"],
                color:"Blue",
                from:"Palafin [Zero]",
                con:false
            }
        },
        egg:"A teal egg with a dark pink heart and white markings. The egg is slightly damp.",
        steps:"10240"
    },{
        evos:{
            "Varoom":{
                type:["Steel","Poison"],
                color:"Gray",
                from:null,
                con:true
            },
            "Revavroom":{
                type:["Steel","Poison"],
                color:"Gray",
                from:"Varoom",
                con:true
            },
            "Revavroom [Starmobile]":{
                type:["Steel","Poison"],
                color:"Gray",
                from:"Revavroom",
                con:true
            }
        },
        egg:"A silver and dark gray striped egg. It sometimes makes noises like a car engine.",
        steps:"5120"
    },{
        evos:{
            "Cyclizar":{
                type:["Dragon","Normal"],
                color:"Green",
                from:null,
                con:true
            }
        },
        egg:"An egg that is part green, part white, and part black with treads that look like a tire. It rolls around a lot.",
        steps:"7680"
    },{
        evos:{
            "Orthworm":{
                type:["Steel"],
                color:"Pink",
                from:null,
                con:true
            }
        },
        egg:"A half-beige, half-red egg with a blue hole on the side. It appears to be made of metal.",
        steps:"8960"
    },{
        evos:{
            "Greavard":{
                type:["Ghost"],
                color:"White",
                from:null,
                con:true
            },
            "Houndstone":{
                type:["Ghost"],
                color:"White",
                from:"Greavard",
                con:false
            }
        },
        egg:"A pale blue egg with a small black dot and what looks like shaggy fringe. It follows you around from the moment you look at it.",
        steps:"5120"
    },{
        evos:{
            "Flamigo":{
                type:["Flying","Fighting"],
                color:"Pink",
                from:null,
                con:true
            }
        },
        egg:"A bright pink egg with white and black markings. It appears to have perfect balance.",
        steps:"5120"
    },{
        evos:{
            "Veluza":{
                type:["Water","Psychic"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A gray egg with a purple stripe, pink protrusions, and gray spikes on the side. Parts of the egg flake off and then regrow occasionally.",
        steps:"5120"
    },{
        evos:{
            "Tatsugiri [Curly]":{
                type:["Dragon","Water"],
                color:"Red",
                from:null,
                con:true
            }
        },
        egg:"An orange egg with light orange and white blotches. It is resting on what appears to be a bed of rice.",
        steps:"8960"
    },{
        evos:{
            "Tatsugiri [Droopy]":{
                type:["Dragon","Water"],
                color:"Pink",
                from:null,
                con:true
            }
        },
        egg:"A hot pink egg with a white blotch. It is resting on what appears to be a bed of rice.",
        steps:"8960"
    },{
        evos:{
            "Tatsugiri [Stretchy]":{
                type:["Dragon","Water"],
                color:"Yellow",
                from:null,
                con:true
            }
        },
        egg:"A plain yellow egg. It is resting on what appears to be a bed of rice.",
        steps:"8960"
    },{
        evos:{
            "Great Tusk":{
                type:["Ground","Fighting"],
                color:"Purple",
                from:null,
                con:true
            }
        },
        egg:"A light blue egg with odd purple blotches and pink spikes on it. It's surprisingly tough. The egg seems familiar, but almost like it doesn't belong here.",
        steps:"20480"
    },{
        evos:{
            "Scream Tail":{
                type:["Fairy","Psychic"],
                color:"Pink",
                from:null,
                con:true
            }
        },
        egg:"A pink egg with a dark pink marking. It sometimes makes a loud noise. The egg seems familiar, but almost like it doesn't belong here.",
        steps:"20480"
    },{
        evos:{
            "Brute Bonnet":{
                type:["Grass","Dark"],
                color:"White",
                from:null,
                con:true
            }
        },
        egg:"An egg that is half gray and half red with some leaves sprouting at the top. It's covered in dust. The egg seems familiar, but almost like it doesn't belong here.",
        steps:"20480"
    },{
        evos:{
            "Flutter Mane":{
                type:["Ghost","Fairy"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A blueish-purple egg with a purple top and several red spots. It's surprisingly light. The egg seems familiar, but almost like it doesn't belong here.",
        steps:"20480"
    },{
        evos:{
            "Slither Wing":{
                type:["Bug","Fighting"],
                color:"White",
                from:null,
                con:true
            }
        },
        egg:"A white egg covered in thick, fluffy fur, with red horn-like protrusions on top. It's surprisingly tough. The egg seems familiar, but almost like it doesn't belong here.",
        steps:"20480"
    },{
        evos:{
            "Sandy Shocks":{
                type:["Electric","Ground"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"An egg that is shiny like steel and has a yellow spot. Iron filings are attracted to it. The egg seems familiar, but almost like it doesn't belong here.",
        steps:"20480"
    },{
        evos:{
            "Iron Treads":{
                type:["Ground","Steel"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A steel-gray egg with large black markings on it. The egg seems familiar, but almost like it doesn't belong here.",
        steps:"20480"
    },{
        evos:{
            "Iron Bundle":{
                type:["Ice","Water"],
                color:"Red",
                from:null,
                con:true
            }
        },
        egg:"A white egg with a red top, a yellow spot, and several gray etchings. The egg seems familiar, but almost like it doesn't belong here.",
        steps:"20480"
    },{
        evos:{
            "Iron Hands":{
                type:["Fighting","Electric"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A silver egg with a blue top, two metal bolts, and a dark gray spot. The egg seems familiar, but almost like it doesn't belong here.",
        steps:"20480"
    },{
        evos:{
            "Iron Jugulis":{
                type:["Dark","Flying"],
                color:"Blue",
                from:null,
                con:true
            }
        },
        egg:"A gray egg with blue sides and bright pink stripes. The egg seems familiar, but almost like it doesn't belong here.",
        steps:"20480"
    },{
        evos:{
            "Iron Moth":{
                type:["Fire","Poison"],
                color:"White",
                from:null,
                con:true
            }
        },
        egg:"This egg feels like it's made of metal. The top half is bright orange and the base has red and silver markings. The egg seems familiar, but almost like it doesn't belong here.",
        steps:"20480"
    },{
        evos:{
            "Iron Thorns":{
                type:["Rock","Electric"],
                color:"Green",
                from:null,
                con:true
            }
        },
        egg:"A shiny green egg with a large gray blotch on the front and four smaller gray blotches. The egg seems familiar, but almost like it doesn't belong here.",
        steps:"20480"
    },{
        evos:{
            "Frigibax":{
                type:["Dragon","Ice"],
                color:"Gray",
                from:null,
                con:true
            },
            "Arctibax":{
                type:["Dragon","Ice"],
                color:"Blue",
                from:"Frigibax",
                con:true
            },
            "Baxcalibur":{
                type:["Dragon","Ice"],
                color:"Blue",
                from:"Arctibax",
                con:true
            }
        },
        egg:"A gray egg with two yellow marks and a pale blue splotch in the middle. It is cold to the touch.",
        steps:"10240"
    },{
        evos:{
            "Gimmighoul [Roaming]":{
                type:["Ghost"],
                color:"Gray",
                from:null,
                con:true
            },
            "Gimmighoul [Chest]":{
                type:["Ghost"],
                color:"Red",
                from:"Gimmighoul [Roaming]",
                con:false
            },
            "Gholdengo":{
                type:["Steel","Ghost"],
                color:"Yellow",
                from:"Gimmighoul [Roaming]",
                con:false
            }
        },
        egg:"A gray egg with two yellow spots. It shakes when placed near money.",
        steps:"10240"
    },{
        evos:{
            "Roaring Moon":{
                type:["Dragon","Dark"],
                color:"Blue",
                from:null,
                con:true
            }
        },
        egg:"A blue egg with an odd gray blotch on the top some red blotches on the bottom and sides. The egg seems familiar, but almost like it doesn't belong here.",
        steps:"20480"
    },{
        evos:{
            "Iron Valiant":{
                type:["Fairy","Fighting"],
                color:"White",
                from:null,
                con:true
            }
        },
        egg:"An egg that is green and white with a teal blotch on top. The egg seems familiar, but almost like it doesn't belong here.",
        steps:"20480"
    },{
        evos:{
            "Poltchageist":{
                type:["Grass","Ghost"],
                color:"Green",
                from:null,
                con:true
            },
            "Sinistcha":{
                type:["Grass","Ghost"],
                color:"Green",
                from:"Poltchageist",
                con:false
            }
        },
        egg:"A bold green egg with yellow swirls. The egg smells like green tea.",
        steps:"5120"
    },{
        evos:{
            "Terapagos":{
                type:["Normal"],
                color:"Blue",
                from:null,
                con:true
            },
            "Terapagos [Terastal]":{
                type:["Normal"],
                color:"Blue",
                from:"Terapagos",
                con:true
            },
            "Terapagos [Stellar]":{
                type:["Normal"],
                color:"Blue",
                from:"Terapagos [Terastal]",
                con:true
            }
        },
        egg:"A green-blue egg that shines brilliantly like a gemstone. Its presence seems to make other eggs shine.",
        steps:"30720"
    },{
        evos:{
            "Pecharunt":{
                type:["Poison","Ghost"],
                color:"Purple",
                from:null,
                con:true
            },
            "Pecharunt [Closed]":{
                type:["Poison","Ghost"],
                color:"Purple",
                from:null,
                con:true
            }
        },
        egg:"A bizarre deep fuchsia egg with a small black hole in the center. It smells strongly of a certain berry.",
        steps:"20480"
    },{
        evos:{
            "Fake Groudon":{
                type:["Dark","Ground"],
                color:"Red",
                from:null,
                con:true
            }
        },
        egg:"A dark red egg with an eerie glowing pattern on the front. It looks like it's melting....",
        steps:"30720"
    },{
        evos:{
            "Dracowymsy [Regular]":{
                type:["Dragon","Fire"],
                color:"Brown",
                from:null,
                con:true
            },
            "Dracowymsy [Battlesuit]":{
                type:["Dragon","Steel"],
                color:"Brown",
                from:"Dracowymsy [Regular]",
                con:false
            },
            "Dracowymsy [Druid]":{
                type:["Dark","Dragon"],
                color:"Brown",
                from:"Dracowymsy [Regular]",
                con:false
            },
            "Dracowymsy [Kick]":{
                type:["Dragon","Fighting"],
                color:"Brown",
                from:"Dracowymsy [Regular]",
                con:false
            },
            "Dracowymsy [Winter]":{
                type:["Dragon","Ice"],
                color:"Brown",
                from:"Dracowymsy [Regular]",
                con:false
            },
            "Dracowymsy [Charge]":{
                type:["Dragon","Electric"],
                color:"Brown",
                from:"Dracowymsy [Regular]",
                con:false
            }
        },
        egg:"A strange green egg with a grey W-shaped mark on it. Nobody has any clue what might hatch from it....",
        steps:"10240"
    },{
        evos:{
            "Primal Dialga":{
                type:["Dark","Dragon"],
                color:"Blue",
                from:null,
                con:true
            }
        },
        egg:"A grey egg with a bizarre pattern. There is a red spot in the middle that shines like a gem. It radiates a very dark power....",
        steps:"30720"
    },{
        evos:{
            "MissingNo. [Glitch]":{
                type:["Normal"],
                color:"White",
                from:null,
                con:true
            },
            "MissingNo. [Kabutops Fossil]":{
                type:["Normal"],
                color:"White",
                from:"MissingNo. [Glitch]",
                con:false
            },
            "MissingNo. [Aerodactyl Fossil]":{
                type:["Normal"],
                color:"White",
                from:"MissingNo. [Glitch]",
                con:false
            },
            "MissingNo. [Ghost]":{
                type:["Normal"],
                color:"White",
                from:"MissingNo. [Glitch]",
                con:false
            }
        },
        egg:"This egg's pattern looks rather busy. It consists of black, white, purple and light orange.",
        steps:"7680"
    },{
        evos:{
            "Zergoose":{
                type:["Dark","Normal"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A dark gray egg with a blue Z-shaped mark on it. Nobody has any clue what might hatch from it....",
        steps:"5120"
    },{
        evos:{
            "Zergoose [Feral]":{
                type:["Dark","Normal"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A dark grayish-blue egg with a blue Z-shaped mark on it. The mark feels like it was carved by a sharp claw.",
        steps:"20480"
    },{
        evos:{
            "Easter Buneary":{
                type:["Grass","Normal"],
                color:"Blue",
                from:null,
                con:true
            },
            "Easter Lopunny":{
                type:["Grass","Normal"],
                color:"Blue",
                from:"Easter Buneary",
                con:false
            }
        },
        egg:"A cyan egg with two pink blotches on the sides. It bounces around sometimes",
        steps:"5120"
    },{
        evos:{
            "Crystal Onix":{
                type:["Ice","Rock"],
                color:"Blue",
                from:null,
                con:true
            },
            "Crystal Steelix":{
                type:["Ice","Steel"],
                color:"Blue",
                from:"Crystal Onix",
                con:false
            }
        },
        egg:"A light blue egg that shines beautifully like crystal. It's almost impossible to lift.",
        steps:"6400"
    },{
        evos:{
            "Shadow Lugia":{
                type:["Dark","Psychic"],
                color:"Purple",
                from:null,
                con:true
            }
        },
        egg:"A dark purple egg with two bizarre light grey patches. It radiates a dark and mysterious power. Being around this egg makes you feel slightly uneasy.",
        steps:"30720"
    },{
        evos:{
            "Bulbasaur Clone":{
                type:["Dark","Grass"],
                color:"Blue",
                from:null,
                con:true
            },
            "Ivysaur Clone":{
                type:["Dark","Grass"],
                color:"Blue",
                from:"Bulbasaur Clone",
                con:true
            },
            "Venusaur Clone":{
                type:["Dark","Grass"],
                color:"Blue",
                from:"Ivysaur Clone",
                con:true
            }
        },
        egg:"A turquoise egg with several dark markings all over it. Something seems off about it....",
        steps:"5120"
    },{
        evos:{
            "Charmander Clone":{
                type:["Dark","Fire"],
                color:"Red",
                from:null,
                con:true
            },
            "Charmeleon Clone":{
                type:["Dark","Fire"],
                color:"Red",
                from:"Charmander Clone",
                con:true
            },
            "Charizard Clone":{
                type:["Dark","Fire"],
                color:"Red",
                from:"Charmeleon Clone",
                con:true
            }
        },
        egg:"An orange egg with several dark markings all over it. Something seems off about it....",
        steps:"5120"
    },{
        evos:{
            "Squirtle Clone":{
                type:["Dark","Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Wartortle Clone":{
                type:["Dark","Water"],
                color:"Blue",
                from:"Squirtle Clone",
                con:true
            },
            "Blastoise Clone":{
                type:["Dark","Water"],
                color:"Blue",
                from:"Wartortle Clone",
                con:true
            }
        },
        egg:"A light blue egg with several dark markings all over it. Something seems off about it....",
        steps:"5120"
    },{
        evos:{
            "Spiky-Eared Pichu":{
                type:["Electric"],
                color:"Yellow",
                from:null,
                con:true
            }
        },
        egg:"A yellow and black egg with an interesting pattern. Touching it might shock you.",
        steps:"2560"
    },{
        evos:{
            "Slime Slugma":{
                type:["Poison"],
                color:"Green",
                from:null,
                con:true
            },
            "Slime Magcargo":{
                type:["Poison","Rock"],
                color:"Green",
                from:"Slime Slugma",
                con:true
            }
        },
        egg:"A black egg with several dark green spots on it. It emits a horrible smell....",
        steps:"20480"
    },{
        evos:{
            "Bidofo [Sword]":{
                type:["Normal","Steel"],
                color:"Brown",
                from:null,
                con:true
            },
            "Bidofo [Lance]":{
                type:["Fighting","Normal"],
                color:"Brown",
                from:"Bidofo [Sword]",
                con:false
            },
            "Bidofo [Axe]":{
                type:["Normal","Rock"],
                color:"Brown",
                from:"Bidofo [Sword]",
                con:false
            },
            "Bidofo [Bow]":{
                type:["Bug","Normal"],
                color:"Brown",
                from:"Bidofo [Sword]",
                con:false
            },
            "Bidofo [Wind Magic]":{
                type:["Flying","Normal"],
                color:"Brown",
                from:"Bidofo [Sword]",
                con:false
            },
            "Bidofo [Fire Magic]":{
                type:["Fire","Normal"],
                color:"Brown",
                from:"Bidofo [Sword]",
                con:false
            },
            "Bidofo [Thunder Magic]":{
                type:["Electric","Normal"],
                color:"Brown",
                from:"Bidofo [Sword]",
                con:false
            },
            "Bidofo [Light Magic]":{
                type:["Normal","Psychic"],
                color:"Brown",
                from:"Bidofo [Sword]",
                con:false
            },
            "Bidofo [Dark Magic]":{
                type:["Dark","Normal"],
                color:"Brown",
                from:"Bidofo [Sword]",
                con:false
            },
            "Bidofo [Staff]":{
                type:["Normal","Water"],
                color:"Brown",
                from:"Bidofo [Sword]",
                con:false
            }
        },
        egg:"A brown egg with a marking on the front that consists of white, red, dark brown and tan. It doesn't react to anything at all.",
        steps:"20480"
    },{
        evos:{
            "Zombidofo":{
                type:["Dark","Normal"],
                color:"Brown",
                from:null,
                con:true
            }
        },
        egg:"An eerie-looking egg with a marking on the front. It doesn't react to anything at all, but you feel uneasy around it nevertheless.",
        steps:"40960"
    },{
        evos:{
            "Remorage":{
                type:["Water"],
                color:"Gray",
                from:null,
                con:true
            },
            "Octillerage":{
                type:["Water"],
                color:"Red",
                from:"Remorage",
                con:true
            }
        },
        egg:"A light blue egg that looks incredibly angry somehow....",
        steps:"5120"
    },{
        evos:{
            "Winter Vulpix":{
                type:["Fire"],
                color:"White",
                from:null,
                con:true
            },
            "Winter Ninetales":{
                type:["Fire"],
                color:"White",
                from:"Winter Vulpix",
                con:false
            }
        },
        egg:"This light blue egg has a strange swirling pattern and shines brilliantly.",
        steps:"6400"
    },{
        evos:{
            "Summer Swinub":{
                type:["Ground","Ice"],
                color:"Gray",
                from:null,
                con:true
            },
            "Summer Piloswine":{
                type:["Ground","Ice"],
                color:"Gray",
                from:"Summer Swinub",
                con:false
            },
            "Summer Mamoswine":{
                type:["Ground","Ice"],
                color:"Gray",
                from:"Summer Piloswine",
                con:false
            }
        },
        egg:"A gray, scaly egg. It is extremely dry-feeling.",
        steps:"10240"
    },{
        evos:{
            "Shellderboy":{
                type:["Fighting","Water"],
                color:"Purple",
                from:null,
                con:true
            },
            "Cloysterman":{
                type:["Fighting","Water"],
                color:"Purple",
                from:"Shellderboy",
                con:false
            }
        },
        egg:"A purple egg with a giant fist on the front. It's surprisingly tough.",
        steps:"10240"
    },{
        evos:{
            "Pokii [Avatar]":{
                type:["Dark"],
                color:"Black",
                from:null,
                con:true
            },
            "Pokii [True]":{
                type:["Dark","Flying"],
                color:"Black",
                from:"Pokii [Avatar]",
                con:false
            }
        },
        egg:"A black egg covered in spiky fur. Sometimes shakes a bit if it's touched. Something about the egg seems foreign.",
        steps:"27648"
    },{
        evos:{
            "Valentacool":{
                type:["Fairy","Water"],
                color:"Pink",
                from:null,
                con:true
            },
            "Valentacruel":{
                type:["Fairy","Water"],
                color:"Pink",
                from:"Valentacool",
                con:true
            }
        },
        egg:"A hot pink egg that is covered in lots of hearts and spots.",
        steps:"10240"
    },{
        evos:{
            "Fossil Omanyte":{
                type:["Rock","Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Fossil Omastar":{
                type:["Rock","Water"],
                color:"Blue",
                from:"Fossil Omanyte",
                con:true
            }
        },
        egg:"A tan egg with a stripe pattern on it. It looks extremely old.",
        steps:"20480"
    },{
        evos:{
            "Fossil Kabuto":{
                type:["Rock","Water"],
                color:"Brown",
                from:null,
                con:true
            },
            "Fossil Kabutops":{
                type:["Rock","Water"],
                color:"Brown",
                from:"Fossil Kabuto",
                con:true
            }
        },
        egg:"A brown egg with two dark marks on it. It looks extremely old.",
        steps:"20480"
    },{
        evos:{
            "Fossil Aerodactyl":{
                type:["Flying","Rock"],
                color:"Purple",
                from:null,
                con:true
            }
        },
        egg:"A dull purple egg that has markings on it that resemble a fierce face. It looks extremely old.",
        steps:"20480"
    },{
        evos:{
            "Fossil Lileep":{
                type:["Grass","Rock"],
                color:"Purple",
                from:null,
                con:true
            },
            "Fossil Cradily":{
                type:["Grass","Rock"],
                color:"Green",
                from:"Fossil Lileep",
                con:true
            }
        },
        egg:"A purple egg with two odd yellow markings on it. It looks extremely old.",
        steps:"20480"
    },{
        evos:{
            "Fossil Anorith":{
                type:["Bug","Rock"],
                color:"Gray",
                from:null,
                con:true
            },
            "Fossil Armaldo":{
                type:["Bug","Rock"],
                color:"Gray",
                from:"Fossil Anorith",
                con:true
            }
        },
        egg:"An egg that is black on the top and dull green on the bottom. The top has two red blotches. It looks extremely old.",
        steps:"20480"
    },{
        evos:{
            "Fossil Relicanth":{
                type:["Rock","Water"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"An egg that is almost white. It has markings on it that resemble cracks, but it is rather tough. It looks extremely old.",
        steps:"20480"
    },{
        evos:{
            "Fossil Cranidos":{
                type:["Rock"],
                color:"Blue",
                from:null,
                con:true
            },
            "Fossil Rampardos":{
                type:["Rock"],
                color:"Blue",
                from:"Fossil Cranidos",
                con:true
            }
        },
        egg:"A grey egg that has an odd blue marking on the top. It looks extremely old.",
        steps:"20480"
    },{
        evos:{
            "Fossil Shieldon":{
                type:["Rock","Steel"],
                color:"Gray",
                from:null,
                con:true
            },
            "Fossil Bastiodon":{
                type:["Rock","Steel"],
                color:"Gray",
                from:"Fossil Shieldon",
                con:true
            }
        },
        egg:"A black egg with odd silver markings on it. It looks extremely old.",
        steps:"20480"
    },{
        evos:{
            "Fossil Tirtouga":{
                type:["Rock","Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Fossil Carracosta":{
                type:["Rock","Water"],
                color:"Blue",
                from:"Fossil Tirtouga",
                con:true
            }
        },
        egg:"A dark brown egg with a very rough surface. It's as hard as a rock. It looks extremely old.",
        steps:"20480"
    },{
        evos:{
            "Fossil Archen":{
                type:["Flying","Rock"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Fossil Archeops":{
                type:["Flying","Rock"],
                color:"Yellow",
                from:"Fossil Archen",
                con:true
            }
        },
        egg:"An egg that is half blue and half red. It has many green feathers sticking out of it. It looks extremely old.",
        steps:"20480"
    },{
        evos:{
            "Past Misdreavus":{
                type:["Ghost","Ice"],
                color:"White",
                from:null,
                con:true
            },
            "Past Mismagius":{
                type:["Ghost","Ice"],
                color:"White",
                from:"Past Misdreavus",
                con:false
            }
        },
        egg:"A bright white egg with a beautiful blue and gold pattern wrapping around it.",
        steps:"10240"
    },{
        evos:{
            "Present Drifloon":{
                type:["Ghost","Ice"],
                color:"White",
                from:null,
                con:true
            },
            "Present Drifblim":{
                type:["Ghost","Ice"],
                color:"White",
                from:"Present Drifloon",
                con:false
            }
        },
        egg:"A light purple egg with a fanciful white and blue pattern wrapping around it.",
        steps:"10240"
    },{
        evos:{
            "Future Shuppet":{
                type:["Ghost","Ice"],
                color:"White",
                from:null,
                con:true
            },
            "Future Banette":{
                type:["Ghost","Ice"],
                color:"White",
                from:"Future Shuppet",
                con:false
            }
        },
        egg:"A pitch black egg with a silly white pattern wrapping around it.",
        steps:"10240"
    },{
        evos:{
            "Flaming Zorua":{
                type:["Dark","Fire"],
                color:"Red",
                from:null,
                con:true
            },
            "Flaming Zoroark":{
                type:["Dark","Fire"],
                color:"Red",
                from:"Flaming Zorua",
                con:false
            }
        },
        egg:"A bright orange egg with a strange dark mark in the middle. It feels rather warm.",
        steps:"10240"
    },{
        evos:{
            "Icy Horsea":{
                type:["Ice","Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Icy Seadra":{
                type:["Ice","Water"],
                color:"Blue",
                from:"Icy Horsea",
                con:false
            },
            "Icy Kingdra":{
                type:["Dragon","Ice"],
                color:"Blue",
                from:"Icy Seadra",
                con:false
            }
        },
        egg:"An ice-covered egg with a strange blue mark on the front. It is extremely cold.",
        steps:"5120"
    },{
        evos:{
            "Festive Makuhita":{
                type:["Fighting","Ice"],
                color:"Green",
                from:null,
                con:true
            },
            "Santa Hariyama":{
                type:["Fighting","Ice"],
                color:"Red",
                from:"Festive Makuhita",
                con:false
            },
            "Mrs. Hariyama":{
                type:["Fighting","Ice"],
                color:"Red",
                from:"Festive Makuhita",
                con:false
            }
        },
        egg:"A green and red egg, surrounded by a leather belt. There appears to be a candy cane on its side...",
        steps:"10240"
    },{
        evos:{
            "Rustor":{
                type:["Psychic","Steel"],
                color:"Green",
                from:null,
                con:true
            },
            "Rustong":{
                type:["Psychic","Steel"],
                color:"Green",
                from:"Rustor",
                con:false
            }
        },
        egg:"An egg covered in rust. You can see the remains of a blue pattern.",
        steps:"5120"
    },{
        evos:{
            "Pudgy Pidgey":{
                type:["Flying","Normal"],
                color:"Brown",
                from:null,
                con:true
            },
            "Pudgy Pidgeotto":{
                type:["Flying","Normal"],
                color:"Brown",
                from:"Pudgy Pidgey",
                con:true
            },
            "Pudgy Pidgeot":{
                type:["Flying","Normal"],
                color:"Brown",
                from:"Pudgy Pidgeotto",
                con:false
            }
        },
        egg:"A brown and tan egg that has a very interesting pattern on it. Said to be the egg of a common bird. It feels rather heavy.",
        steps:"10240"
    },{
        evos:{
            "Roggenmorpha":{
                type:["Psychic","Rock"],
                color:"Red",
                from:null,
                con:true
            },
            "Morphore":{
                type:["Psychic","Rock"],
                color:"Red",
                from:"Roggenmorpha",
                con:true
            },
            "Gigamorph":{
                type:["Psychic","Rock"],
                color:"Red",
                from:"Morphore",
                con:true
            }
        },
        egg:"A white egg with a red mark on the front. It's as hard as a rock.",
        steps:"6400"
    },{
        evos:{
            "Autumn Tropius":{
                type:["Grass","Ground"],
                color:"Red",
                from:null,
                con:true
            }
        },
        egg:"An egg that is orange on the top and brown on the bottom. There are shapes on the front that resemble fruit.",
        steps:"10240"
    },{
        evos:{
            "Snowy Girafarig":{
                type:["Ice","Psychic"],
                color:"Blue",
                from:null,
                con:true
            },
            "Dreident":{
                type:["Fire","Steel"],
                color:"Gray",
                from:"Litwick",
                con:false
            },
            "Menoralure":{
                type:["Fire","Steel"],
                color:"Gray",
                from:"Dreident",
                con:false
            }
        },
        egg:"An egg that seems to be covered in icicles and snow. It's a bit on the heavy side and cold to the touch.",
        steps:"10240"
    },{
        evos:{
            "Mistilil":{
                type:["Grass","Ice"],
                color:"Green",
                from:null,
                con:true
            },
            "Settigant":{
                type:["Grass","Ice"],
                color:"Green",
                from:"Mistilil",
                con:false
            }
        },
        egg:"A white egg with a pretty green pattern wrapping around it. Its scent makes you feel like kissing something.",
        steps:"10240"
    },{
        evos:{
            "Spring Cyndaquil":{
                type:["Fire","Grass"],
                color:"Green",
                from:null,
                con:true
            },
            "Spring Quilava":{
                type:["Fire","Grass"],
                color:"Green",
                from:"Spring Cyndaquil",
                con:true
            },
            "Spring Typhlosion":{
                type:["Fire","Grass"],
                color:"Green",
                from:"Spring Quilava",
                con:false
            }
        },
        egg:"A green egg with a tan bottom. Nothing seems familiar about it.",
        steps:"10240"
    },{
        evos:{
            "Splash Chikorita":{
                type:["Grass","Water"],
                color:"Blue",
                from:null,
                con:true
            },
            "Splash Bayleef":{
                type:["Grass","Water"],
                color:"Blue",
                from:"Splash Chikorita",
                con:false
            },
            "Splash Meganium":{
                type:["Grass","Water"],
                color:"Blue",
                from:"Splash Bayleef",
                con:false
            }
        },
        egg:"A pale blue egg with a line of blue dots around it. Nothing seems familiar about it.",
        steps:"10240"
    },{
        evos:{
            "Magma Totodile":{
                type:["Fire","Water"],
                color:"Gray",
                from:null,
                con:true
            },
            "Magma Croconaw":{
                type:["Fire","Water"],
                color:"Gray",
                from:"Magma Totodile",
                con:false
            },
            "Magma Feraligatr":{
                type:["Fire","Water"],
                color:"Gray",
                from:"Magma Croconaw",
                con:false
            }
        },
        egg:"A grey egg with lava roaming underneath its crust. Nothing seems familiar about it.",
        steps:"10240"
    },{
        evos:{
            "Harvest Farfetch'd":{
                type:["Flying","Normal"],
                color:"Brown",
                from:null,
                con:true
            }
        },
        egg:"A golden brown egg with a peculiar dark marking on it. Oddly enough, it is surrounded by produce.",
        steps:"10240"
    },{
        evos:{
            "Deibot":{
                type:["Dragon","Steel"],
                color:"Gray",
                from:null,
                con:true
            },
            "Zweilbot":{
                type:["Dragon","Steel"],
                color:"Gray",
                from:"Deibot",
                con:true
            },
            "Hydreibot":{
                type:["Dragon","Steel"],
                color:"Gray",
                from:"Zweilbot",
                con:true
            }
        },
        egg:"This strange egg appears to be made of metal. You might hear a faint beeping sound if you touch it.",
        steps:"10240"
    },{
        evos:{
            "Ekralyp":{
                type:["Dragon","Ground"],
                color:"Blue",
                from:null,
                con:true
            },
            "Ekranko":{
                type:["Dragon","Ground"],
                color:"Blue",
                from:"Ekralyp",
                con:true
            },
            "Ekranord":{
                type:["Dragon","Ground"],
                color:"Blue",
                from:"Ekranko",
                con:false
            }
        },
        egg:"An egg that is blue on the top and red on the bottom. It seems to be weirdly grinning at you. It looks like it'd take a while to hatch.",
        steps:"10240"
    },{
        evos:{
            "Fossil Tyrunt":{
                type:["Dragon","Rock"],
                color:"Brown",
                from:null,
                con:true
            },
            "Fossil Tyrantrum":{
                type:["Dragon","Rock"],
                color:"Brown",
                from:"Fossil Tyrunt",
                con:true
            }
        },
        egg:"A rugged brown egg with two orange spikes on top of it. The colors seem to have faded over time. It looks extremely old.",
        steps:"20480"
    },{
        evos:{
            "Fossil Amaura":{
                type:["Ice","Rock"],
                color:"Blue",
                from:null,
                con:true
            },
            "Fossil Aurorus":{
                type:["Ice","Rock"],
                color:"Blue",
                from:"Fossil Amaura",
                con:true
            }
        },
        egg:"A pale blue egg with a gem and a pair of dull frills. It looks extremely old.",
        steps:"20480"
    },{
        evos:{
            "Alpine Meowth":{
                type:["Ice","Normal"],
                color:"Gray",
                from:null,
                con:true
            },
            "Alpine Persian":{
                type:["Ice","Normal"],
                color:"Gray",
                from:"Alpine Meowth",
                con:false
            }
        },
        egg:"A light grey egg with a few tiny darker dots. The blue spot on top of it glimmers like ice.",
        steps:"10240"
    },{
        evos:{
            "Painted Torchic":{
                type:["Fire"],
                color:"Red",
                from:null,
                con:true
            }
        },
        egg:"An orange egg that seems to be covered in paint splatters. It's sitting on a fancy pedestal.",
        steps:"10240"
    },{
        evos:{
            "Flabebe [Eternal Flower]":{
                type:["Fairy"],
                color:"White",
                from:null,
                con:true
            },
            "Floette [Eternal Flower]":{
                type:["Fairy"],
                color:"White",
                from:"Flabebe [Eternal Flower]",
                con:true
            },
            "Florges [Eternal Flower]":{
                type:["Fairy"],
                color:"White",
                from:"Floette [Eternal Flower]",
                con:false
            }
        },
        egg:"A white and blue egg with a burgundy ring at the top. It had some strange flower petals on it, but they fell off at some point.",
        steps:"6400"
    },{
        evos:{
            "Pinkan Rhyhorn":{
                type:["Ground","Rock"],
                color:"Pink",
                from:null,
                con:true
            },
            "Pinkan Rhydon":{
                type:["Ground","Rock"],
                color:"Pink",
                from:"Pinkan Rhyhorn",
                con:true
            },
            "Pinkan Rhyperior":{
                type:["Ground","Rock"],
                color:"Pink",
                from:"Pinkan Rhydon",
                con:false
            }
        },
        egg:"A tough egg that's sitting in a pile of Pinkan Berries. It seems to slowly absorb the juice from the pink fruit.",
        steps:"5120"
    },{
        evos:{
            "Purple Kecleon":{
                type:["Normal"],
                color:"Purple",
                from:null,
                con:true
            }
        },
        egg:"A light purple egg with a magenta zig-zag wrapping around it. It looks like it disappears at times, if only for a second.",
        steps:"10240"
    },{
        evos:{
            "Misquaza":{
                type:["Dragon","Ghost"],
                color:"Purple",
                from:null,
                con:true
            }
        },
        egg:"A purple egg with a bizarre pink pattern on the front that glows. You feel like your perception of reality may have changed.",
        steps:"30720"
    },{
        evos:{
            "Golden Bonsly":{
                type:["Rock","Steel"],
                color:"Yellow",
                from:null,
                con:true
            },
            "Golden Sudowoodo":{
                type:["Rock","Steel"],
                color:"Yellow",
                from:"Golden Bonsly",
                con:false
            }
        },
        egg:"A glossy, golden egg with some markings on it. It is surprisingly tough.",
        steps:"10240"
    },{
        evos:{
            "Valencian Oddish":{
                type:["Grass","Poison"],
                color:"Purple",
                from:null,
                con:true
            },
            "Valencian Gloom":{
                type:["Grass","Poison"],
                color:"Purple",
                from:"Valencian Oddish",
                con:true
            },
            "Valencian Vileplume":{
                type:["Grass","Poison"],
                color:"Blue",
                from:"Valencian Gloom",
                con:false
            },
            "Valencian Bellossom":{
                type:["Grass"],
                color:"Green",
                from:"Valencian Gloom",
                con:false
            }
        },
        egg:"A dull purple egg that's covered in an orange tropical pattern. It's supposed to be the egg of a plant.",
        steps:"5120"
    },{
        evos:{
            "Snowman Munchlax":{
                type:["Ice","Normal"],
                color:"Blue",
                from:null,
                con:true
            },
            "Snowman Snorlax":{
                type:["Ice","Normal"],
                color:"Blue",
                from:"Snowman Munchlax",
                con:false
            }
        },
        egg:"This egg seems to be made of snow... There's a single spot on the front. It shakes around a bit if you bring food near it.",
        steps:"10240"
    },{
        evos:{
            "Lunar Larvitar":{
                type:["Fairy","Rock"],
                color:"Green",
                from:null,
                con:true
            },
            "Stellar Pupitar":{
                type:["Psychic","Rock"],
                color:"Blue",
                from:"Lunar Larvitar",
                con:true
            },
            "Astral Tyranitar":{
                type:["Psychic","Rock"],
                color:"Gray",
                from:"Stellar Pupitar",
                con:true
            }
        },
        egg:"A pale green egg with an orange blotch on the front and two small orange spots. It pulls you towards it somehow.",
        steps:"10240"
    },{
        evos:{
            "Pink Caterpie":{
                type:["Bug","Fairy"],
                color:"Pink",
                from:null,
                con:true
            },
            "Pink Metapod":{
                type:["Bug","Fairy"],
                color:"Pink",
                from:"Pink Caterpie",
                con:false
            },
            "Pink Butterfree":{
                type:["Bug","Fairy"],
                color:"Pink",
                from:"Pink Metapod",
                con:false
            }
        },
        egg:"A pink egg with a red, heart-shaped blotch on the front. Said to be the egg of some sort of bug.",
        steps:"3840"
    },{
        evos:{
            "Chocolate Miltank":{
                type:["Normal"],
                color:"Brown",
                from:null,
                con:true
            }
        },
        egg:"A brown egg that's absolutely dripping with rich, dark chocolate. It's a bit difficult to lift up.",
        steps:"10240"
    },{
        evos:{
            "Korechu":{
                type:["Electric","Normal"],
                color:"Blue",
                from:null,
                con:true
            }
        },
        egg:"It's a light blue egg with a small, yellow blotch on the front. Is this thing even real? You feel like you're being pranked...",
        steps:"2560"
    },{
        evos:{
            "Ancient Jigglypuff":{
                type:["Fairy","Normal"],
                color:"Pink",
                from:null,
                con:true
            }
        },
        egg:"It seems to be a remainder of an ancient civilization. A soothing power is radiating from it.",
        steps:"20480"
    },{
        evos:{
            "Ancient Gengar":{
                type:["Ghost","Poison"],
                color:"Purple",
                from:null,
                con:true
            }
        },
        egg:"An ominous artifact. A shadow seems to lurk within.",
        steps:"20480"
    },{
        evos:{
            "Ancient Alakazam":{
                type:["Psychic"],
                color:"Brown",
                from:null,
                con:true
            }
        },
        egg:"An ancient artifact. Holding on to it for too long may leave you possessed.",
        steps:"20480"
    },{
        evos:{
            "Dark Ekans":{
                type:["Dark","Poison"],
                color:"Red",
                from:null,
                con:true
            },
            "Dark Arbok":{
                type:["Dark","Poison"],
                color:"Purple",
                from:"Dark Ekans",
                con:true
            }
        },
        egg:"A pale purple egg with odd markings. The glowing spot on it makes you feel exceptionally weak.",
        steps:"10240"
    },{
        evos:{
            "Floral Togepi":{
                type:["Fairy","Grass"],
                color:"Pink",
                from:null,
                con:true
            }
        },
        egg:"A beautiful, pink egg that resembles a flower bulb. You feel happy looking at it.",
        steps:"5120"
    },{
        evos:{
            "Carbink [Merrick]":{
                type:["Fairy","Rock"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A dull purple egg encrusted with several beautiful gems. When holding it, you feel a strong urge to protect something.",
        steps:"6400"
    },{
        evos:{
            "Carbink [Bort]":{
                type:["Fairy","Rock"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A dull purple egg encrusted with several beautiful gems. When holding it, you feel a strong urge to protect something.",
        steps:"6400"
    },{
        evos:{
            "Carbink [Allotrope]":{
                type:["Fairy","Rock"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A dull purple egg encrusted with several beautiful gems. When holding it, you feel a strong urge to protect something.",
        steps:"6400"
    },{
        evos:{
            "Carbink [Dace]":{
                type:["Fairy","Rock"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A dull purple egg encrusted with several beautiful gems. When holding it, you feel a strong urge to protect something.",
        steps:"6400"
    },{
        evos:{
            "Magikarp [Calico]":{
                type:["Water"],
                color:"Red",
                from:null,
                con:true
            }
        },
        egg:"An orange egg with several white spots and a peach-coloured blotch. It hops around sometimes. This egg looks like it'd take no time to hatch.",
        steps:"1280"
    },{
        evos:{
            "Magikarp [Orange]":{
                type:["Water"],
                color:"Red",
                from:null,
                con:true
            }
        },
        egg:"An orange egg with a white bottom half, two white spots, and a peach-coloured blotch. It hops around sometimes. This egg looks like it'd take no time to hatch.",
        steps:"1280"
    },{
        evos:{
            "Magikarp [Pink]":{
                type:["Water"],
                color:"Pink",
                from:null,
                con:true
            }
        },
        egg:"A pink egg with a white bottom half, two white spots, and a peach-coloured blotch. It hops around sometimes. This egg looks like it'd take no time to hatch.",
        steps:"1280"
    },{
        evos:{
            "Magikarp [Gray]":{
                type:["Water"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A gray egg with several white and dark gray spots and a peach-coloured blotch. It hops around sometimes. This egg looks like it'd take no time to hatch.",
        steps:"1280"
    },{
        evos:{
            "Magikarp [Purple]":{
                type:["Water"],
                color:"Purple",
                from:null,
                con:true
            }
        },
        egg:"A purple egg with several white and dark purple spots and a peach-coloured blotch. It hops around sometimes. This egg looks like it'd take no time to hatch.",
        steps:"1280"
    },{
        evos:{
            "Magikarp [Apricot]":{
                type:["Water"],
                color:"Brown",
                from:null,
                con:true
            }
        },
        egg:"An apricot egg with two white spots, a peach-coloured blotch, and several orange stripes. It hops around sometimes. This egg looks like it'd take no time to hatch.",
        steps:"1280"
    },{
        evos:{
            "Magikarp [Brown]":{
                type:["Water"],
                color:"Brown",
                from:null,
                con:true
            }
        },
        egg:"A brown egg with two white spots, a peach-coloured blotch and several dark brown stripes. It hops around sometimes. This egg looks like it'd take no time to hatch.",
        steps:"1280"
    },{
        evos:{
            "Magikarp [White]":{
                type:["Water"],
                color:"White",
                from:null,
                con:true
            }
        },
        egg:"A linen white egg with two lighter spots, a peach-coloured blotch, and a red top. It hops around sometimes. This egg looks like it'd take no time to hatch.",
        steps:"1280"
    },{
        evos:{
            "Magikarp [Black]":{
                type:["Water"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A gray egg with two white spots, a peach-coloured blotch, and a dark top. It hops around sometimes. This egg looks like it'd take no time to hatch.",
        steps:"1280"
    },{
        evos:{
            "Magikarp [Blue]":{
                type:["Water"],
                color:"Blue",
                from:null,
                con:true
            }
        },
        egg:"A light blue egg with two white spots, a peach-coloured blotch, and a darker blue top. It hops around sometimes. This egg looks like it'd take no time to hatch.",
        steps:"1280"
    },{
        evos:{
            "Magikarp [Violet]":{
                type:["Water"],
                color:"Purple",
                from:null,
                con:true
            }
        },
        egg:"A lilac egg with two white spots, a peach-coloured blotch, and a violet top. It hops around sometimes. This egg looks like it'd take no time to hatch.",
        steps:"1280"
    },{
        evos:{
            "Beeark":{
                type:["Grass","Poison"],
                color:"Green",
                from:null,
                con:true
            },
            "Pulian":{
                type:["Grass","Poison"],
                color:"Brown",
                from:"Beeark",
                con:false
            }
        },
        egg:"A fluffy egg that is very soft to the touch. Holding it for too long will make you sneeze.",
        steps:"5120"
    },{
        evos:{
            "Eevee [Heart]":{
                type:["Normal"],
                color:"Brown",
                from:null,
                con:true
            }
        },
        egg:"A brown egg with a tan bottom. The tan bottom has a few markings on it. This egg does not react to any item.",
        steps:"8960"
    },{
        evos:{
            "Kryduck":{
                type:["Water"],
                color:"Yellow",
                from:null,
                con:true
            }
        },
        egg:"A football. Or is it an egg? Probably not a good idea to attempt a drop kick now.",
        steps:"6400"
    },{
        evos:{
            "Platypus Psyduck":{
                type:["Poison","Water"],
                color:"Brown",
                from:null,
                con:true
            },
            "Melonait":{
                type:["Grass","Ice"],
                color:"Green",
                from:"Vanilluxe",
                con:false
            }
        },
        egg:"A brown egg. It has an oddly-shaped gray blotch on it that resembles some sort of bill. The egg is slightly damp.",
        steps:"6400"
    },{
        evos:{
            "Noothoot":{
                type:["Flying","Ice"],
                color:"Black",
                from:null,
                con:true
            }
        },
        egg:"A black egg with some odd white and red markings on the front. A persistent noise can be heard coming from within.",
        steps:"3840"
    },{
        evos:{
            "Jacnea":{
                type:["Dark","Grass"],
                color:"Brown",
                from:null,
                con:true
            }
        },
        egg:"An oddly shaped, orange egg with a green stem on top. It strongly reminds you of a pumpkin.",
        steps:"5120"
    },{
        evos:{
            "Chatotiel":{
                type:["Flying","Normal"],
                color:"Gray",
                from:null,
                con:true
            }
        },
        egg:"A yellow egg with a gray bottom. It has red blotches on the sides that resemble cheeks.",
        steps:"3840"
    },{
        evos:{
            "Noodle Ekans":{
                type:["Fairy"],
                color:"Brown",
                from:null,
                con:true
            },
            "Noodle Arbok":{
                type:["Fairy"],
                color:"Brown",
                from:"Noodle Ekans",
                con:false
            }
        },
        egg:"A golden-brown egg with odd markings and two red spots. The egg is soft and smells deliciously umami.",
        steps:"5120"
    },{
        egg:"A deep indigo egg with small purple galaxies on it. It is surprisingly light.",
        rarity:"Novelty",
        steps:5120,
        evos:{
            "Swablu [Celestial]":{
                type:["Ghost","Flying"],
                color:"Purple",
                from:null,
                con:true
            },
            "Altaria [Celestial]":{
                type:["Ghost","Flying"],
                color:"Purple",
                from:"Swablu [Celestial]",
                con:true
            }
        }
    }
];
window.indices={};
for (var i=0;i<pokemon.length;i++) {
    for (var a in pokemon[i].evos) {
        pokemon[i].evos[a].name=a;
        indices[a]=i;
    }
}

window.FuzzySet = (function () {
  'use strict';

  const FuzzySet = function(arr, useLevenshtein, gramSizeLower, gramSizeUpper) {
      var fuzzyset = {

      };

      // default options
      arr = arr || [];
      fuzzyset.gramSizeLower = gramSizeLower || 2;
      fuzzyset.gramSizeUpper = gramSizeUpper || 3;
      fuzzyset.useLevenshtein = (typeof useLevenshtein !== 'boolean') ? true : useLevenshtein;

      // define all the object functions and attributes
      fuzzyset.exactSet = {};
      fuzzyset.matchDict = {};
      fuzzyset.items = {};

      // helper functions
      var levenshtein = function(str1, str2) {
          var current = [], prev, value;

          for (var i = 0; i <= str2.length; i++)
              for (var j = 0; j <= str1.length; j++) {
              if (i && j)
                  if (str1.charAt(j - 1) === str2.charAt(i - 1))
                  value = prev;
                  else
                  value = Math.min(current[j], current[j - 1], prev) + 1;
              else
                  value = i + j;

              prev = current[j];
              current[j] = value;
              }

          return current.pop();
      };

      // return an edit distance from 0 to 1
      var _distance = function(str1, str2) {
          if (str1 === null && str2 === null) throw 'Trying to compare two null values';
          if (str1 === null || str2 === null) return 0;
          str1 = String(str1); str2 = String(str2);

          var distance = levenshtein(str1, str2);
          if (str1.length > str2.length) {
              return 1 - distance / str1.length;
          } else {
              return 1 - distance / str2.length;
          }
      };

      // u00C0-u00FF is latin characters
      // u0621-u064a is arabic letters
      // u0660-u0669 is arabic numerals
      // TODO: figure out way to do this for more languages
      var _nonWordRe = /[^a-zA-Z0-9\u00C0-\u00FF\u0621-\u064A\u0660-\u0669, ]+/g;

      var _iterateGrams = function(value, gramSize) {
          gramSize = gramSize || 2;
          var simplified = '-' + value.toLowerCase().replace(_nonWordRe, '') + '-',
              lenDiff = gramSize - simplified.length,
              results = [];
          if (lenDiff > 0) {
              for (var i = 0; i < lenDiff; ++i) {
                  simplified += '-';
              }
          }
          for (var i = 0; i < simplified.length - gramSize + 1; ++i) {
              results.push(simplified.slice(i, i + gramSize));
          }
          return results;
      };

      var _gramCounter = function(value, gramSize) {
          // return an object where key=gram, value=number of occurrences
          gramSize = gramSize || 2;
          var result = {},
              grams = _iterateGrams(value, gramSize),
              i = 0;
          for (i; i < grams.length; ++i) {
              if (grams[i] in result) {
                  result[grams[i]] += 1;
              } else {
                  result[grams[i]] = 1;
              }
          }
          return result;
      };

      // the main functions
      fuzzyset.get = function(value, defaultValue, minMatchScore) {
          // check for value in set, returning defaultValue or null if none found
          if (minMatchScore === undefined) {
              minMatchScore = .33;
          }
          var result = this._get(value, minMatchScore);
          if (!result && typeof defaultValue !== 'undefined') {
              return defaultValue;
          }
          return result;
      };

      fuzzyset._get = function(value, minMatchScore) {
          var results = [];
          // start with high gram size and if there are no results, go to lower gram sizes
          for (var gramSize = this.gramSizeUpper; gramSize >= this.gramSizeLower; --gramSize) {
              results = this.__get(value, gramSize, minMatchScore);
              if (results && results.length > 0) {
                  return results;
              }
          }
          return null;
      };

      fuzzyset.__get = function(value, gramSize, minMatchScore) {
          var normalizedValue = this._normalizeStr(value),
              matches = {},
              gramCounts = _gramCounter(normalizedValue, gramSize),
              items = this.items[gramSize],
              sumOfSquareGramCounts = 0,
              gram,
              gramCount,
              i,
              index,
              otherGramCount;

          for (gram in gramCounts) {
              gramCount = gramCounts[gram];
              sumOfSquareGramCounts += Math.pow(gramCount, 2);
              if (gram in this.matchDict) {
                  for (i = 0; i < this.matchDict[gram].length; ++i) {
                      index = this.matchDict[gram][i][0];
                      otherGramCount = this.matchDict[gram][i][1];
                      if (index in matches) {
                          matches[index] += gramCount * otherGramCount;
                      } else {
                          matches[index] = gramCount * otherGramCount;
                      }
                  }
              }
          }

          function isEmptyObject(obj) {
              for(var prop in obj) {
                  if(obj.hasOwnProperty(prop))
                      return false;
              }
              return true;
          }

          if (isEmptyObject(matches)) {
              return null;
          }

          var vectorNormal = Math.sqrt(sumOfSquareGramCounts),
              results = [],
              matchScore;
          // build a results list of [score, str]
          for (var matchIndex in matches) {
              matchScore = matches[matchIndex];
              results.push([matchScore / (vectorNormal * items[matchIndex][0]), items[matchIndex][1]]);
          }
          var sortDescending = function(a, b) {
              if (a[0] < b[0]) {
                  return 1;
              } else if (a[0] > b[0]) {
                  return -1;
              } else {
                  return 0;
              }
          };
          results.sort(sortDescending);
          if (this.useLevenshtein) {
              var newResults = [],
                  endIndex = Math.min(50, results.length);
              // truncate somewhat arbitrarily to 50
              for (var i = 0; i < endIndex; ++i) {
                  newResults.push([_distance(results[i][1], normalizedValue), results[i][1]]);
              }
              results = newResults;
              results.sort(sortDescending);
          }
          newResults = [];
          results.forEach(function(scoreWordPair) {
              if (scoreWordPair[0] >= minMatchScore) {
                  newResults.push([scoreWordPair[0], this.exactSet[scoreWordPair[1]]]);
              }
          }.bind(this));
          return newResults;
      };

      fuzzyset.add = function(value) {
          var normalizedValue = this._normalizeStr(value);
          if (normalizedValue in this.exactSet) {
              return false;
          }

          var i = this.gramSizeLower;
          for (i; i < this.gramSizeUpper + 1; ++i) {
              this._add(value, i);
          }
      };

      fuzzyset._add = function(value, gramSize) {
          var normalizedValue = this._normalizeStr(value),
              items = this.items[gramSize] || [],
              index = items.length;

          items.push(0);
          var gramCounts = _gramCounter(normalizedValue, gramSize),
              sumOfSquareGramCounts = 0,
              gram, gramCount;
          for (gram in gramCounts) {
              gramCount = gramCounts[gram];
              sumOfSquareGramCounts += Math.pow(gramCount, 2);
              if (gram in this.matchDict) {
                  this.matchDict[gram].push([index, gramCount]);
              } else {
                  this.matchDict[gram] = [[index, gramCount]];
              }
          }
          var vectorNormal = Math.sqrt(sumOfSquareGramCounts);
          items[index] = [vectorNormal, normalizedValue];
          this.items[gramSize] = items;
          this.exactSet[normalizedValue] = value;
      };

      fuzzyset._normalizeStr = function(str) {
          if (Object.prototype.toString.call(str) !== '[object String]') throw 'Must use a string as argument to FuzzySet functions';
          return str.toLowerCase();
      };

      // return length of items in set
      fuzzyset.length = function() {
          var count = 0,
              prop;
          for (prop in this.exactSet) {
              if (this.exactSet.hasOwnProperty(prop)) {
                  count += 1;
              }
          }
          return count;
      };

      // return is set is empty
      fuzzyset.isEmpty = function() {
          for (var prop in this.exactSet) {
              if (this.exactSet.hasOwnProperty(prop)) {
                  return false;
              }
          }
          return true;
      };

      // return list of values loaded into set
      fuzzyset.values = function() {
          var values = [],
              prop;
          for (prop in this.exactSet) {
              if (this.exactSet.hasOwnProperty(prop)) {
                  values.push(this.exactSet[prop]);
              }
          }
          return values;
      };


      // initialization
      var i = fuzzyset.gramSizeLower;
      for (i; i < fuzzyset.gramSizeUpper + 1; ++i) {
          fuzzyset.items[i] = [];
      }
      // add all the items to the set
      for (i = 0; i < arr.length; ++i) {
          fuzzyset.add(arr[i]);
      }

      return fuzzyset;
  };

  return FuzzySet;

}());
window.unwrap=function(name) {
    if (name==null) return undefined;
    if (typeof name=="object") return name.name;
    return name;
}
window.line=function(name) {
    name=unwrap(name);
    return pokemon[indices[name]];
}
window.baby=function(name) {
    name=unwrap(name);
    var evos=line(name);
    if (evos) return Object.keys(line(name).evos)[0];
}
window.mon=function(name) {
    name=unwrap(name);
    var evos=line(name);
    if (evos) return line(name).evos[name];
}
window.writeCookie=function(cookieName,cookieValue,today) {
    if (today) {
        var date=new Date();
        date.setHours(24,59,59);
    }
    else var date="Thu, 31 Dec 2099 29:59:59 GMT";
    document.cookie=(cookieName+'='+cookieValue).replace(/&/g,"&a").replace(/;/g,"&s")+';expires='+date+';samesite=lax;domain=gpx.plus;path=/shelter';
    document.cookie=(cookieName+'='+cookieValue).replace(/&/g,"&a").replace(/;/g,"&s")+';expires='+date+';samesite=lax;domain=gpx.plus;path=/lab';
}
window.readCookie=function(name) {
    var readcookies=document.cookie.split(";");
    for (var z=0;z<readcookies.length;z++) {
        var readcookie=readcookies[z].replace(/^ | $/g,"").replace(/ =|= /g,"=").split("=");
        if (name==readcookie[0]) return readcookie[1].replace(/&s/g,";").replace(/&a/g,"&");
    }
    return null;
}
window.deleteCookie=function(cookieName) {
    document.cookie=cookieName+'=;expires=Thu, 01 Jan 1970 00:00:00 UTC;samesite=lax;domain=gpx.plus;path=/shelter';
    document.cookie=cookieName+'=;expires=Thu, 01 Jan 1970 00:00:00 UTC;samesite=lax;domain=gpx.plus;path=/lab';
}
window.getFamilies=function(list) {
    var families=[];
    for (i=0;i<list.length;i++) {
        var evos=[list[i]];
        while (evos[0].from!=null) evos.unshift(mon(evos[0].from));
        families.push(evos);
    }
    return families;
}
window.wrapFamilies=function(list,type) {
    var out="";
    list=(getFamilies(list));
    for (i=0;i<list.length;i++) {
        out+="<div class=\""+type+"Holder\">";
        for (a=0;a<list[i].length;a++) out+="<a class=\"poke\" onContextMenu=\"rightClickDelete(event,this);\" onClick=\""+(type=="custom"?"toggleCustomPoke(this);":"this.parentNode.classList.toggle('inactive');")+"\" egg=\""+list[i][0].name+"\">"+list[i][a].name+"</a>, ";
        out=out.replace(/, $/,"")+"</div>";
    }
    return out;
}
window.rightClickDelete=function(click, link) {
    click.preventDefault();
    var parent=link.parentElement;
    link.remove();
    parent.innerHTML=parent.innerHTML.replace(/^, |, $/g,"").replace(/, , /g,"");
    syncGrabbers();
}
window.processCustom=function() {
    var customContainer=document.querySelector("#shelterGrabber #customListContainer");
    customContainer.innerHTML="";

    if (readCookie("shelterGrabberCustom")!=null) {
        var cookie=readCookie("shelterGrabberCustom").split("|||");
        var blocks=[[]];
        var i=0;
        cookie.forEach(line=>{
            if (mon(line)) {
                blocks[i].push(line);
            }
            else {
                if (blocks[i].length>0) i++;
                if (!blocks[i]) blocks[i]=[];
            }
        });
        for (var i=0;i<blocks.length;i++) {
            writeCookie("shelterGrabberCustomBlock"+i,blocks[i].join("|||"));
        }
        deleteCookie("shelterGrabberCustom");
    }

    for (var i=0;readCookie("shelterGrabberCustomBlock"+i)!=null;i++) {
        customContainer.innerHTML+="<div id=\"customList"+i+"\" num=\""+i+"\" class=\"customList\"></div>";
        addButtonRow(i);
        if (readCookie("shelterGrabberCustomBlock"+i)!=null) if (readCookie("shelterGrabberCustomBlock"+i).search("¬")!=-1) toggleCustomList(document.querySelector("#buttonRow"+i+" .customListVisibilityButton"));
        writeCustomList(i);
    }

    customContainer.innerHTML+="<div id=\"bottomButtonRow\" class=\"buttonRow\"><div id=\"addCustomButton\" class=\"userscriptButton\" onClick=\"addCustomList(0,true);\">+</div></div>";
}
window.writeCustomList=function(num) {
    makeCustomPokemonList(readCookie("shelterGrabberCustomBlock"+num).replace(/¬/g,"").split("|||"),document.querySelector("#customList"+num));
}
window.addButtonRow=function(num) {
    var buttons=document.createElement("div");
    buttons.id="buttonRow"+num;
    buttons.setAttribute("num",num);
    buttons.className="buttonRow";
    buttons.innerHTML=`<div class="addCustomListButton userscriptButton" onClick=\"addCustomList(this);\">+</div>
        <div class="customListVisibilityButton userscriptButton" onClick="toggleCustomList(this);">Disable</div>
        <div class="customListEditButton userscriptButton" onClick="openEditing(this);">Edit</div>
        <div class="deleteCustomListButton userscriptButton" onClick="swapHiddenButtons(this);">X</div>
        <div class="confirmDeleteCustomListButton hide userscriptButton" onClick="confirmDelete(this);">Delete</div>
        <div class="cancelDeleteCustomListButton hide userscriptButton" onClick="swapHiddenButtons(this);">Cancel</div>`;
    document.querySelector("#customListContainer").insertBefore(buttons,document.querySelector("#customList"+num));
}
window.toggleCustomList=function(button) {
    var listID=getListID(button);
    var list=document.querySelector("#customList"+listID);
    var buttons=document.querySelector("#buttonRow"+listID);
    if (button.innerText=="Disable") {
        button.innerHTML="Enable";
        list.classList.add("inactive");
        buttons.classList.add("inactive");
        writeCookie("shelterGrabberCustomBlock"+listID,"¬"+readCookie("shelterGrabberCustomBlock"+listID).replace(/¬+/g,"¬"));
    }
    else {
        button.innerHTML="Disable";
        list.classList.remove("inactive");
        buttons.classList.remove("inactive");
        writeCookie("shelterGrabberCustomBlock"+listID,readCookie("shelterGrabberCustomBlock"+listID).replace(/¬/g,""));
    }
}
window.addCustomList=function(list,last) {
    if (last) var listID=document.querySelectorAll("#customListContainer .customList").length;
    else var listID=getListID(list);
    if (!last) {
        for (var i=document.querySelectorAll("#shelterGrabber .custom .customList").length-1;i>=listID;i--) {
            var buttons=document.querySelector("#buttonRow"+i);
            var list=document.querySelector("#customList"+i);
            buttons.id="buttonRow"+(i+1);
            buttons.setAttribute("num",(i+1));
            list.id="customList"+(i+1);
            list.setAttribute("num",(i+1));

            writeCookie("shelterGrabberCustomBlock"+(i+1),readCookie("shelterGrabberCustomBlock"+i));
            writeCookie("shelterGrabberCustomBlock"+i,"");
        }
    }

    var newList=document.createElement("div");
    newList.id="customList"+listID;
    newList.setAttribute("num",listID);
    newList.className="customList horizontal";

    if (last) document.querySelector("#customListContainer").insertBefore(newList, document.querySelector("#bottomButtonRow"));
    else document.querySelector("#customListContainer").insertBefore(newList, document.querySelector("#buttonRow"+(listID+1)));

    addButtonRow(listID);
    openEditing(document.querySelector("#buttonRow"+listID+" .customListEditButton"));
}
window.openEditing=function(button) {
    var listID=getListID(button);
    button.innerHTML="Save";
    button.setAttribute("onclick","saveEditing(this);");
    document.querySelector("#customList"+listID).classList.add("horizontal");

    document.querySelector("#customList"+listID).innerHTML="<textarea class=\"customInput\" onKeyUp=\"processCustomList(this);\"></textarea><div class=\"customOutput\"></div>";
    if (readCookie("shelterGrabberCustomBlock"+listID)) document.querySelector("#customList"+listID+" .customInput").value=readCookie("shelterGrabberCustomBlock"+listID).replace(/¬/g,"").replace(/\|\|\|/g,"\n").replace(/~/g,"");
    processCustomList(button);
}
window.saveEditing=function(button) {
    var listID=getListID(button);
    button.innerHTML="Edit";
    button.setAttribute("onclick","openEditing(this);");
    document.querySelector("#customList"+listID).classList.remove("horizontal");

    var list=[];
    document.querySelectorAll("#customList"+listID+" a.poke:last-child").forEach(poke=>{list.push(poke.innerText)});
    writeCookie("shelterGrabberCustomBlock"+listID,(document.querySelector("#customList"+listID).classList.contains("inactive")?"¬":"")+list.join("|||"));
    writeCustomList(listID);
}
window.toggleCustomPoke=function(button) {
    button.parentElement.classList.toggle("inactive");
    recompileCustomBlockCookie(button);
}
window.recompileCustomBlockCookie=function(button) {
    var block=button.parentElement.parentElement.parentElement;
    var blockID=block.getAttribute("num");
    var blockMon=block.querySelectorAll(".customHolder");
    var newArr=[];
    blockMon.forEach(mon=>{newArr.push((mon.classList.contains("inactive")?"~":"")+mon.querySelector("a.poke:last-child").innerText)});
    writeCookie("shelterGrabberCustomBlock"+blockID,(readCookie("shelterGrabberCustomBlock"+blockID).search("¬")!=-1?"¬":"")+newArr.join("|||"));
}
window.processCustomList=function(inputContainer) {
    var listID=getListID(inputContainer);
    var inputContainer=document.querySelector("#customList"+listID+" .customInput");
    var outputContainer=document.querySelector("#customList"+listID+" .customOutput");

    inputContainer.style.height="auto";
    inputContainer.style.height=(inputContainer.scrollHeight+4)+"px";

    var input=inputContainer.value;
    makeCustomPokemonList(input.split("\n"),document.querySelector("#customList"+listID+" .customOutput"),true);
}
window.makeCustomPokemonList=function(input,element,noContainer) {
    var poke=[];
    var vis=[];
    for (i=0;i<input.length;i++) {
        var newMon=mon(input[i].replace(/~|¬/g,""));
        if (newMon) {
            poke.push(newMon);
            if (input[i].search("~")==-1) vis.push(1);
            else vis.push(0);
        }
    }
    element.innerHTML=(noContainer?"":"<div class=\"scrollContainer\">")+wrapFamilies(poke,"custom")+(noContainer?"":"</div>");
    var newMon=element.querySelectorAll(".customHolder");
    for (i=0;i<newMon.length;i++) {
        if (vis[i]==0) newMon[i].classList.add("inactive");
    }
}
window.swapHiddenButtons=function(button) {
    var parentRow=button;
    while (!parentRow.classList.contains("buttonRow")) parentRow=parentRow.parentElement;
    parentRow.querySelectorAll(".userscriptButton").forEach(button=>{button.classList.toggle("hide")});
}
window.confirmDelete=function(button) {
    var listID=getListID(button);
    document.querySelector("#customList"+listID).remove();
    document.querySelector("#buttonRow"+listID).remove();
    var listsCount=document.querySelectorAll("#shelterGrabber .custom .customList").length;

    for (var i=listID+1;i<=listsCount;i++) {
        var buttons=document.querySelector("#buttonRow"+i);
        var list=document.querySelector("#customList"+i);
        buttons.id="buttonRow"+(i-1);
        buttons.setAttribute("num",(i-1));
        list.id="customList"+(i-1);
        list.setAttribute("num",(i-1));

        writeCookie("shelterGrabberCustomBlock"+(i-1),readCookie("shelterGrabberCustomBlock"+i));
        writeCookie("shelterGrabberCustomBlock"+i,"");
    }
    deleteCookie("shelterGrabberCustomBlock"+listsCount);
}
window.getListID=function(element) {
    var parentEle=element;
    while (parentEle.hasAttribute("num")==false) parentEle=parentEle.parentElement;
    return parseInt(parentEle.getAttribute("num"));
}
window.pickOptions=function(options) {
    var btns={
        shm:"#shinyMystery",
        mlt:"#grabMultiple",
        rmv:"#removeGrabbed",
        min:"#minLevel"
    };
    Object.keys(btns).forEach(btn=>{
        var btnEle=document.querySelector(btns[btn]);
        if (options[btn]) btnEle.classList.remove("inactive");
        else btnEle.classList.add("inactive");
    });
    if (options.min) setTimeout(function() {document.querySelector("#minLevel input").value=exploreLv},0);
    //Why does this only work with a timeout. Even if it's zero.
}
window.toggleBlock=function(block,minLv) {
    writeCookie("todayBlock",block,true);
    var blocks=document.querySelectorAll("#shelterGrabber .block");
    for (var i=0;i<blocks.length;i++) blocks[i].classList.add("inactive");
    document.querySelector("#shelterGrabber ."+block+".block").classList.remove("inactive");
    var blocks={
        scavengerHunt:{
            shm:true,
            mlt:false,
            rmv:false,
            min:false
        },
        exploration:{
            shm:true,
            mlt:true,
            rmv:true,
            min:(exploreLv?exploreLv:false)
        },
        custom:{
            shm:true,
            mlt:true,
            rmv:false,
            min:false
        }
    };
    pickOptions(blocks[block]);
}
window.swapButtons=function() {
    var grab=document.querySelector("#grabButton");
    var stop=document.querySelector("#stopButton");
    grab.classList.toggle("hide");
    stop.classList.toggle("hide");
    syncGrab();
}
window.stopGrabbing=function() {
    clearInterval(grabbing);
    document.querySelector("#stopButton").classList.add("hide");
    document.querySelector("#grabButton").classList.remove("hide");
    syncGrab();
}
window.syncGrab=function() {
    syncGrabbers();
    var labFrame=document.querySelector("#labFrame");
    if (labFrame) {
        if (!document.querySelector("#includeLab").classList.contains("inactive")) setTimeout(function() {
            var grabberA=document.querySelector("#shelterGrabber");
            var grabberB=labFrame.contentDocument.querySelector("#shelterGrabber");
            var buttonA=grabberA.querySelector(".userscriptButton:not(.hide)");
            console.log("buttonA",buttonA);
            var buttonB=grabberB.querySelector(".userscriptButton:not(.hide)");
            console.log("buttonB",buttonB);
            console.log(buttonA.id,buttonB.id);
            if (buttonA.id!=buttonB.id) buttonB.click();
        },250);
    }
}
window.grabPokemon=function() {
    var url=window.location.href;
    /*!!!*/var debug=false;
    var linksSelector="#shelterGrabber .scavengerHunt:not(.inactive) .hunt.container:not(.inactive) a.poke:not(.inactive), #shelterGrabber .exploration:not(.inactive) .exploreHolder:not(.inactive) a.poke, #shelterGrabber .custom:not(.inactive) .customList:not(.inactive) .customHolder:not(.inactive) a.poke";

    if (url.search("gpx.plus/lab")!=-1) window.grabbing=setInterval(function() {
        var box=document.querySelectorAll("div.ui-widget");
        var opts=document.querySelectorAll("#shelterGrabber #options");
        if (box.length==0) {
            if (document.querySelector("#labEggs>div:is(.show3DShown, .transparent)")) {
                //document.querySelector("#labLoad").click();
                //console.log(document.querySelector("#topNotifications>div[data-notification='party']").innerText);
                //if (document.querySelector("#topNotifications>div[data-notification='party']").innerText=="6") window.location.href="https://gpx.plus/main";
                //else {
                    //if (window.self===window.top) if (!opts.querySelector("#grabMultiple").classList.contains("inactive")) writeCookie("resumeLabGrabbingCookie","resume");
                    //location.reload();
                //}
            }
            else {
                var links=document.querySelectorAll(linksSelector);

                if (links.length>0) {
                    var eggs=[];
                    for (var i=0;i<links.length;i++) {
                        var newEgg=links[i].getAttribute("egg");
                        if (!eggs.includes(newEgg)) eggs.push(newEgg);
                    }

                    var matches=false;
                    var container=document.querySelector("#labEggs");
                    for (var i=0;i<eggs.length;i++) {
                        var selector="[description='"+line(eggs[i]).egg.replace(/\n|[^a-z0-9]/gi,"")+"']";
                        var found=container.querySelector(selector);
                        if (found) {
                            matches=true;
                            if (debug) {
                                found.style.border="5px solid red";
                                stopGrabbing();
                            }
                            else {
                                found.click();
                                if (opts.querySelector("#grabMultiple").classList.contains("inactive")) stopGrabbing();
                            }
                        }
                    }
                    if (!matches) {
                        var pending=container.querySelectorAll(".pending");
                        var done=container.querySelectorAll(".done");
                        if (pending.length==0&&done.length>0) document.querySelector("#labLoad").click();
                    }
                }
            }
        }
        else {
            if (document.querySelector(".ui-widget-content").innerText.search("Your party is already full!")!=-1) stopGrabbing();
            document.querySelector(".ui-dialog-titlebar-close").click();
        }
    },1000);
    else if (url.search("gpx.plus/shelter")!=-1) {
        var honeyIcon=document.querySelector("#topNotifications [data-tooltip*='Honey+']");
        if (honeyIcon) {
            var honeyButton=document.querySelector("#shelterSweetHoney");
            if (honeyButton) honeyButton.click();
        }
        window.grabbing=setInterval(function() {
            var box=document.querySelectorAll("div.ui-widget");
            var opts=document.querySelector("#shelterGrabber #options");
            if (box.length==0) {
                if (!opts.querySelector("#shinyMystery").classList.contains("inactive")) {
                    var match=document.querySelector("img[data-tooltip='Mystery Egg'], img[data-tooltip*='Sh.']");
                    if (match) match.click();
                }
                if (!match) {
                    var links=document.querySelectorAll(linksSelector);

                    if (links.length>0) {
                        var poke=[];
                        var eggs=[];
                        for (var i=0;i<links.length;i++) {
                            var newPoke=links[i].innerText;
                            var newEgg=links[i].getAttribute("egg");
                            if (!poke.includes(newPoke)) poke.push(newPoke);
                            if (!eggs.includes(newEgg)) eggs.push(newEgg);
                        }

                        var container=document.querySelector("#tabContent>article.selected");
                        if (container.getAttribute("data-tab")=="safari") {
                            use=poke;
                            type="safari";
                        }
                        else if (container.getAttribute("data-tab")=="eggs") {
                            use=eggs;
                            type="eggs";
                        }

                        var matches=[];
                        for (var i=0;i<use.length;i++) {
                            var selector=[];
                            if (type=="safari") {
                                for (var a=0;a<10;a++) selector.push("[data-tooltip*=\""+a+" "+(!opts.querySelector("#shinyOnly").classList.contains("inactive")?"Sh. ":"")+use[i]+" (\"], [data-tooltip$=\""+a+" "+(!opts.querySelector("#shinyOnly").classList.contains("inactive")?"Sh. ":"")+use[i]+"\"]");
                                selector=":is("+selector.join(", ")+")";
                                if (!opts.querySelector("#minLevel").classList.contains("inactive")) {
                                    var levels=[];
                                    for (var a=opts.querySelector("#minLevel input").value;a<101;a++) levels.push("[data-tooltip^=\"Lv. "+a+" \"]");
                                    selector+=":is("+levels.join(", ")+")";
                                }
                            }
                            else if (type=="eggs") selector="[data-tooltip=\""+use[i]+" Egg\"]";

                            if (debug) console.log(selector);

                            var found=container.querySelectorAll(selector);
                            if (found.length>0) {
                                if (!debug) {
                                    matches.push(found[0]);
                                    break;
                                }
                                else for (var a=0;a<found.length;a++) matches.push(found[a]);
                            }
                        }

                        if (matches.length>0) {
                            for (var i=0;i<(debug?matches.length:1);i++) {
                                var match=matches[i];
                                if (!debug) match.click();
                                else {
                                    match.style.border="5px solid red";
                                    stopGrabbing();
                                }

                                if (!opts.querySelector("#removeGrabbed").classList.contains("inactive")) {
                                    var matchTip=match.getAttribute("data-tooltip").replace(/Lv. [0-9]* |^.*=' ?| \(.*| Egg|'\]$/g,"");
                                    var freshLinks=(window.location!==window.parent.location?parent.document:document).querySelectorAll(linksSelector);
                                    for (var a=0;a<freshLinks.length;a++) if (freshLinks[a].innerText==matchTip) freshLinks[a].click();
                                }
                            }
                        }
                        else document.querySelector(".shelterLoad").click();
                    }
                    else document.querySelector(".shelterLoad").click();
                }
            }
            else {
                var buttons=document.querySelectorAll("div.ui-dialog-content div.buttonGroup");
                if (buttons.length>0) {
                    var button=document.querySelector("div.buttonGroup>button");
                    var buttonText=button.innerText;
                    button.click();
                    if (opts.querySelector("#grabMultiple").classList.contains("inactive")&&buttonText.search("Sweet Honey")==-1) stopGrabbing();
                }
                else {
                    if (document.querySelector(".ui-widget-content").innerText.search("Your party is currently full!")!=-1) stopGrabbing();
                    document.querySelector(".ui-dialog-titlebar-close").click();
                }
            }

            if (document.querySelector("#labFrame")) {
                if (!debug&&document.querySelector("#topNotifications>div[data-notification='party']").innerText=="6") window.location.href="https://gpx.plus/main";
                else if (document.querySelector("#labFrame").contentWindow.location.href.search("/lab")==-1) window.location.href="https://gpx.plus/main";
                syncGrab();
            }
        },1000);
    }
}

window.grabberInit = function() {
    var textBox=getComputedStyle(document.querySelector("#content h1 aside"));
    var bg=textBox.backgroundColor;
    var border=textBox.borderTopColor;
    var color=textBox.color;
    var header=getComputedStyle(document.querySelector("#headerLogo a"));
    var btn=header.color;
    document.head.insertAdjacentHTML("beforeend",`<style>
    #content h1, #labEggs {
        margin-right:300px;
    }
    #labEggs {
        text-align:center;

        & >div {
            float:none;
            display:inline-block;
            margin:16px 18px;
        }
    }
    #content h1 aside {
        transform:translateY(-100%);
        border-bottom:0;
        right:10px;
        max-width:300px;
        border-radius:12px 12px 0 0;
        box-shadow:none;
        border-width:1px;
    }
    #shelterGrabber {
        position:absolute;
        top:0;
        right:10px;
        width:290px;
        background:`+bg+`;
        border:2px solid `+border+`;
        border-radius:12px;
        font-size:12px;
        padding:4px;
        z-index:10;
        display:flex;
        flex-wrap:wrap;

        & >* {
            width:100%;
        }
        & #grabberScroll {
            max-height:calc(100vh - 320px);
            overflow-y:auto;
            scrollbar-width:thin;
            scrollbar-color:`+color+` `+border+`;
            border-top:1px solid `+color+`;
            padding-top:5px;
        }
        & a {
            color:`+color+`;
            cursor:pointer;
        }
        & .userscriptButton {
            background:`+color+`;
            cursor:pointer;
            flex-grow:1;
            border-radius:12px;
            color:`+btn+`;
            font-weight:bold;
            font-size:150%;
            margin-bottom:5px;
            padding:10px 0
        }
        & .userscriptButton.hide {
            display:none;
        }
        & #options {
            margin:0 10px 5px 10px;

            & div {
                display:inline;
            }
        }
        & .inactive {
            opacity:0.6;
        }
        & .header {
            width:calc(100% - 10px);
            display:block;
            font-size:115%;
            font-weight:bold;
            padding:5px;
        }
        & .block:not(:first-child) .header {
            border-top:1px solid `+color+`;
        }
        & .scavengerHunt.block {
            display:flex;
            flex-direction:column;
        }
        & .block {
            width:100%;

            & .container {
                padding:2.5px 0;
            }
        }
        & .block.inactive .listContainer {
            max-height:40px;
            overflow-y:scroll;
            scrollbar-width:thin;
        }
        & .block:not(:last-child) {
            margin-bottom:5px;
        }

        & .labelHolder {
            display:flex;
            flex-direction:column;
            justify-content:center;
            cursor:pointer;
            font-weight:bold;
            padding:0 5px;
        }
        & .hunt.list {
            flex-grow:1;
            text-align:left;
        }
        & .custom {
            & .header {
                width:calc(100% - 5px);
            }
            & .horizontal {
                display:flex;
                width:100%;
            }
            & .customHolder {
                break-inside:avoid;
            }
            & .customInput {
                width:50%;
                min-height:5em;
            }
            & .customOutput {
                width:50%;
            }
            & .customList.inactive {
                max-height:15px;
                overflow-y:scroll;
                scrollbar-width:thin;
            }
            & .customList:not(.horizontal) .scrollContainer {
                column-count:2;
            }
            & .buttonRow:not(:first-child) {
                margin-top:10px;
            }
            & .buttonRow {
                padding:0 5px;
                display:flex;
                gap:5px;
            }
            & .userscriptButton {
                font-size:100%;
                padding:5px 0;
            }
            & #addCustomButton {
                font-size:125%;
            }
            & .customListEditButton, & .addCustomListButton, & .deleteCustomListButton {
                flex-grow:0;
                padding:5px 8px;
            }
        }
    }
    .contentlab #shelterGrabber {
        right:191px;
        top:57px;

        & #options a:not(#grabMultiple) {
            opacity:0.6;
            text-decoration:line-through;
        }
    }
    #main:has(a#includeLab.inactive) #labFrame {
        display:none;
    }
    #syncToggleButton, .syncCustomButton {
        background:`+color+`;
        cursor:pointer;
        border-radius:12px;
        color:`+btn+`;
        font-weight:bold;
        font-size:150%;
        margin-bottom:5px;
        padding:10px 0;
        text-align:center;

        &.hide {
            display:none;
        }

        position:absolute;
        top:10px;
    }
    #syncToggleButton {
        right:10px;
        width:290px;
    }
    #syncSaveButton {
        right:420px;
        width:100px;
    }
    #syncLoadButton {
        right:310px;
        width:100px;
    }
    </style>`);

    var notifs=document.querySelector("#topNotifications");
    var huntBtn=notifs.querySelector("*[data-notification='scavenge']");
    var exploreBtn=document.querySelector("#notification-explorations-text");
    var div=document.createElement("div");
    div.id="shelterGrabber";
    var divHTML=`<div id="grabButton" class="userscriptButton" onClick="grabPokemon(); swapButtons();">Grab</div>
    <div id="stopButton" class="userscriptButton hide" onClick="clearInterval(grabbing); swapButtons();">Stop</div>
    <div id="options">
        <a id="shinyMystery" onClick="this.classList.toggle('inactive');">Grab shinies/mystery eggs</a> |
        <a class="inactive" id="shinyOnly" onClick="this.classList.toggle('inactive');">Shiny only</a><br />
        <a id="grabMultiple" onClick="this.classList.toggle('inactive');">Grab multiple</a> |
        <a class="inactive" id="removeGrabbed" onClick="this.classList.toggle('inactive');">Remove when grabbed</a><br />
        <div class="inactive" id="minLevel"><a onClick="this.parentElement.classList.toggle('inactive');">Min lv.: </a><input type="number" min="1" max="100" value="1"></input></div>
    </div><div id="grabberScroll">`;

//var huntBtn=document.createElement("div");
    if (huntBtn) {
//huntBtn.setAttribute("data-tooltip","The Scavenger Hunt is active!   The Scavenger Hunt is active!   Your task for today is: Obtain one of the following Pokémon, at level 83 or higher: Cramorant, Palossand, Cofagrigus, Mega Medicham [Mega], Nidorino, Toxtricity [Amped]");
//huntBtn.setAttribute("data-tooltip","The Scavenger Hunt is active!   Your task for today is: Obtain a Pokémon whose colour is Green and whose type is Grass, at level 20 or higher");
//huntBtn.setAttribute("data-tooltip","The Scavenger Hunt is active!   Your task for today is: Obtain 2 rarity 1 or higher trinkets from Poke Chests");
        var hunt=huntBtn.getAttribute("data-tooltip");
        if (hunt.search(/You have already completed this task.|from Poke Chests/)==-1) {
            var huntStart=[];
            var huntList={};

            if (hunt.search("one of the following Pokémon")!=-1) {
                hunt=hunt.split(/\: |, /);
                for (i=0;i<hunt.length;i++) if (line(hunt[i])) huntStart.push(mon(hunt[i]));
            }
            else if (hunt.search("trinkets")==-1) {
                var color=null;
                var type=null;
                if (hunt.search("whose colour is")!=-1) color=hunt.replace(/.*whose colour is /,"").replace(/[ ,].*/g,"");
                if (hunt.search("whose type is")!=-1) type=hunt.replace(/.*whose type is /,"").replace(/[ ,].*/g,"");

                for (i in indices) {
                    var poke=mon(i);
                    if ((color==null||poke.color==color)&&(type==null||poke.type.includes(type))) huntStart.push(poke);
                }
            }

            for (i=0;i<huntStart.length;i++) {
                if (huntStart[i].con) {
                    var steps=line(huntStart[i]).steps;
                    if (!huntList[steps]) huntList[steps]=[];
                    huntList[steps].push(huntStart[i]);
                }
            }

            var huntOut="<div class=\"scavengerHunt block inactive\"><a class=\"header userscriptButton\" onClick=\"toggleBlock('scavengerHunt');\">Scavenger Hunt</a><div id=\"huntListContainer\" class=\"listContainer\">";
            var task=0;
            for (i in huntList) {
                huntOut+="<div class=\"hunt container steps"+i+(parseInt(i)<5500?"":" inactive")+"\"><div class=\"labelHolder\" onClick=\"document.querySelector('#shelterGrabber .scavengerHunt .container.steps"+i+"').classList.toggle('inactive');\"><a class=\"label\">"+i+":</a></div><div class=\"hunt list\">";
                for (a=0;a<huntList[i].length;a++) huntOut+="<a class=\"poke\" onClick=\"this.classList.toggle('inactive');\" egg=\""+baby(huntList[i][a])+"\">"+huntList[i][a].name+"</a>, ";
                huntOut=huntOut.replace(/, $/,"</div></div>");
                task=1;
            }
            huntOut+="</div></div>";
            if (task==1) divHTML+=huntOut;
        }
    }

//var exploreBtn=document.createElement("div");
    window.exploreLv=1;
    if (exploreBtn) {
        function getIndicesOf(searchStr, str, caseSensitive) {
            var searchStrLen = searchStr.length;
            if (searchStrLen == 0) {
                return [];
            }
            var startIndex = 0, index, indices = [];
            if (!caseSensitive) {
                str = str.toLowerCase();
                searchStr = searchStr.toLowerCase();
            }
            while ((index = str.indexOf(searchStr, startIndex)) > -1) {
                indices.push(index);
                startIndex = index + searchStrLen;
            }
            return indices;
        }
        function parseExplore(text) {
            if (text.search(/ \((Feed|Have (\d* )?people (give|feed))/)!=-1) return [];

            text=text.replace(/.* \(/,"(");
            var matches=[];
            for (var i in indices) {
                var starts=getIndicesOf(i,text,true);
                for (var a in starts) matches.push({name:i,start:starts[a],end:starts[a]+i.length,index:indices[i]});
            }
            for (var i in matches) for (var a in matches) if (matches[a]!=matches[i]) if (matches[i].start>=matches[a].start&&matches[i].end<=matches[a].end) matches[i]={};

            var finalMatches=[];
            for (var i in matches) if (matches[i].name) if (!finalMatches.includes(matches[i].name)) finalMatches.push(matches[i].name);
            return finalMatches;
        }
        exploreText=exploreBtn.innerHTML.replace("[hover for spoiler]","Liepard, Snorlax, Torterra");
//exploreText="Have an Emboar, a Noivern, a Barbaracle, an Emboar, an Altaria, and a Girafarig at level 58 in your party";
        var explore=parseExplore(exploreText);
        //console.log(explore);

        //console.log(exploreLv);
        var exploreList=[];

        for (i=0;i<explore.length;i++) {
            var poke=mon(explore[i]);
            if (poke) exploreList.push(poke);
        }

        if (exploreText.search(/ level [0-9]/i)!=-1) exploreLv=exploreText.replace(/.* level /i,"").replace(/ .*/,"").replace(/[^0-9]/g,"");
        else if (exploreList.length>0) for (var i in exploreList) if (exploreList[i].minLv) if (exploreList[i].minLv>exploreLv) exploreLv=exploreList[i].minLv;

        if (exploreList.length>0) divHTML+="<div class=\"exploration block inactive\"><a onClick=\"toggleBlock('exploration');\" class=\"header userscriptButton\">Exploration</a><div id=\"explorationListContainer\" class=\"listContainer\">"+wrapFamilies(exploreList,"explore")+"</div></div>";
    }

    divHTML+="<div class=\"custom block inactive\"><a onClick=\"toggleBlock('custom');\" class=\"header userscriptButton\">Custom</a><div id=\"customListContainer\" class=\"listContainer\"></div></div></div>";

    div.innerHTML=divHTML;
    document.querySelector("#content").append(div);
    processCustom();

    var today=readCookie("todayBlock");
    if (today) {
        if (document.querySelector("#shelterGrabber ."+today+".block")) toggleBlock(today);
        else toggleBlock("custom");
    }
    else {
        if (document.querySelector("#shelterGrabber .scavengerHunt.block")) toggleBlock("scavengerHunt");
        else if (document.querySelector("#shelterGrabber .exploration.block")) toggleBlock("exploration");
        else if (document.querySelector("#shelterGrabber .custom.block")) toggleBlock("custom");
    }

    if (window.self===window.top) if (readCookie("resumeLabGrabbingCookie")=="resume") {
        deleteCookie("resumeLabGrabbingCookie");
        document.querySelector("#shelterGrabber #grabButton").click();
    }

    if (document.querySelector("#userCard").innerText.search("Squornshellous Beta")!=-1) {
        var syncContainer=document.createElement("div");
        syncContainer.innerHTML+="<a onClick=\"document.querySelectorAll('.syncCustomButton').forEach(button=>{button.classList.toggle('hide')});\" id='syncToggleButton' class=\"userscriptButton\">Sync custom</a><a onClick=\"loadCustom();\" id='syncLoadButton' class=\"syncCustomButton userscriptButton hide\">Load</a><a onClick=\"saveCustom();\" id='syncSaveButton' class=\"syncCustomButton userscriptButton hide\">Save</a>";
        syncContainer.querySelectorAll("a").forEach(div=>document.body.append(div));
    }
}

function imgInit() {
    window.convertImageToBase64 = function(imgUrl,source) {
        const image = new Image();
        image.crossOrigin='anonymous';
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.height = image.naturalHeight;
            canvas.width = image.naturalWidth;
            ctx.drawImage(image, 0, 0);
            const dataUrl = canvas.toDataURL();

            source.postMessage({type:"data",src:imgUrl,data:dataUrl},"*");
        }
        image.src = imgUrl;
    };

    window.addEventListener("message", (event) => {if (event.data.type="egg") convertImageToBase64(event.data.data,event.source)});
}

window.saveCustom = function() {
    var saved=[];
    for (var i=0;readCookie("shelterGrabberCustomBlock"+i)!=null;i++) {
        var savedList=readCookie("shelterGrabberCustomBlock"+i);
        if (savedList!=null) saved.push(savedList);
    }
    console.log(saved);

    fetch('https://api.jsonblob.com/019a1714-1100-7e21-9731-a3cb0340b0fd', {
        method: 'PUT',
        body: JSON.stringify(saved),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    })
    .catch(error => alert("SaveCustom Error: "+error));
}
window.loadCustom = function() {
    fetch("https://api.jsonblob.com/019a1714-1100-7e21-9731-a3cb0340b0fd")
        .then((response) => response.json())
        .then((json) => {
            for (var i=0;readCookie("shelterGrabberCustomBlock"+i)!=null;i++) {if (readCookie("shelterGrabberCustomBlock"+i)!=null) deleteCookie("shelterGrabberCustomBlock"+i)};
            for (var i=0;i<json.length;i++) writeCookie("shelterGrabberCustomBlock"+i,json[i]);
            processCustom();
        })
        .catch(error => alert("LoadCustom Error: "+error));
}

window.setEggImages = function() {
    var eggs=document.querySelectorAll("#labEggs img:not(.pending):not(.done)");
    if (typeof savedDescriptions!=='undefined') var urls=Object.values(savedDescriptions);
    else var urls=[];
    for (var i=0;i<eggs.length;i++) {
        var compareSrc=eggs[i].src.replace(/https:\/\/static\.gpx\.plus\/images\/egg_descriptions\/|.png/g,"");
        if (compareSrc.search("/cache/pokemon/")==-1) if (urls.includes(compareSrc)) {
            eggs[i].setAttribute("description",Object.keys(savedDescriptions).find(key=>savedDescriptions[key]===compareSrc));
            //eggs[i].style.outline="5px solid red";
            eggs[i].classList.add("done");
        }
        else {
            imgFrame.contentWindow.postMessage({type:"egg",data:eggs[i].src},"*");
            eggs[i].classList.add("pending");
        }
    }
}

async function tessInit() {
    window.scheduleEgg = async function(event) {
        if (scheduler) {
            if (scheduler.getNumWorkers()>0) {
                await scheduler
                    .addJob('recognize', event.data.data)
                    .then(async (result) => {
                    //console.log({type:"description",src:event.data.src,description:result.data.text});
                    //console.log(event);
                    event.source.postMessage({type:"description",src:event.data.src,description:result.data.text},"*");
                });
            }
            else setTimeout(function() {scheduleEgg(event)},1000);
        }
        else {
            setTimeout(function() {scheduleEgg(event)},1000);
        }
    }

    window.addEventListener("message", async function(event) {if (event.data.type="egg") scheduleEgg(event)});

    const scheduler = Tesseract.createScheduler();

    // Creates worker and adds to scheduler
    const workerGen = async () => {
        const worker = await Tesseract.createWorker('eng');
        scheduler.addWorker(worker);
    }

    const workerN = 4;
    (async () => {
        const resArr = Array(workerN);
        for (let i=0; i<workerN; i++) {
            resArr[i] = workerGen();
        }
        await Promise.all(resArr);
        /** Add 10 recognition jobs */
        const results = await Promise.all(Array(10).fill(0).map(() => (
            scheduler.addJob('recognize', 'https://tesseract.projectnaptha.com/img/eng_bw.png')/*.then((x) => console.log(x.data.text))*/
        )))
        //await scheduler.terminate(); // It also terminates all workers.
    })();
}

function addLab() {
    var frameHolder=document.querySelector("#contentPanel");
    if (frameHolder) {
        window.labFrame=document.createElement("iframe");
        labFrame.src="https://gpx.plus/lab";
        labFrame.id="labFrame";
        labFrame.style="height:100%; width:510px; border:0;";
        frameHolder.appendChild(labFrame);

        document.querySelector("#options").innerHTML+=" | <a class=\"active\" id=\"includeLab\" onClick=\"this.classList.toggle('inactive'); writeCookie('includeLabCookie',!this.classList.contains(\'inactive\'));\">Include lab</a>";
        document.querySelector("#shelterGrabber").addEventListener("mouseup",syncGrabbers);
        document.querySelector("#shelterGrabber").addEventListener("keyup",syncGrabbers);

        if (readCookie("includeLabCookie")=="false") document.querySelector("#includeLab").click();
    }
}

function syncGrabbers() {
    if (document.querySelector("#labFrame")) setTimeout(function() {
        var grabberA=document.querySelector("#shelterGrabber");
        var grabberB=document.querySelector("#labFrame").contentDocument.querySelector("#shelterGrabber");
        var grabberAblocks=grabberA.querySelectorAll(".block");
        var grabberBblocks=grabberB.querySelectorAll(".block");
        for (var i=0;i<grabberAblocks.length;i++) grabberBblocks[i].outerHTML=grabberAblocks[i].outerHTML;
    },250);
}

function labInit() {
    fetch("https://api.jsonblob.com/1425051201862557696")
        .then((response) => response.json())
        .then((json) => {
            window.savedDescriptions=json;

            window.allDescriptions=[];
            for (var i in pokemon) allDescriptions.push(pokemon[i].egg.replace(/\n|[^a-z0-9]/gi,""));
        console.log(allDescriptions);

            if (!savedDescriptions.errors) savedDescriptions.errors={};
        })
        .catch(error => alert("LabInit Error: "+error));

    var frameHolder=document.querySelector("#contentPanel");
    var firstEgg=document.querySelector("#labEggs img");
    if (frameHolder&&firstEgg) {
        /*window.vid=document.createElement("video");
        vid.style="opacity:0; pointer-events:none;";
        vid.loop="true";
        vid.autoplay="true";
        vid.src=src="data:video/mp4;base64,AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAAAF21kYXQAAAALKAGvHYDuI4//Xo8AAAyZbW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAAACgAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAC8R0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAABAAAAAAAAACgAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAABAAAAAQAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAAoAAAAAAABAAAAAAs8bWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAAAyAAAAAgAVxwAAAAAAQWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAAAfTWFpbmNvbmNlcHQgVmlkZW8gTWVkaWEgSGFuZGxlcgAAAArTbWluZgAAABR2bWhkAAAAAQAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAAKk3N0YmwAAAovc3RzZAAAAAAAAAABAAAKH2hldjEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAEAAQAEgAAABIAAAAAAAAAAEUTGF2YzYxLjMuMTAwIGxpYngyNjUAAAAAAAAAAAAAAAAY//8AAAmYaHZjQwEBYAAAAJAAAAAAAB7wAPz9+PgAAA8EIAABABhAAQwB//8BYAAAAwCQAAADAAADAB6VmAkhAAEAKkIBAQFgAAADAJAAAAMAAAMAHqCIRZZWaryuagwMDcIAAAMAAgAAAwAyECIAAQAGRAHBc9CJJwABCR1OAQX///////////8YLKLeCbUXR9u7VaT+f8L8TngyNjUgKGJ1aWxkIDE5OSkgLSAzLjUrMS1mMGMxMDIyYjY6W0xpbnV4XVtHQ0MgMTEuMi4wXVs2NCBiaXRdIDhiaXQrMTBiaXQrMTJiaXQgLSBILjI2NS9IRVZDIGNvZGVjIC0gQ29weXJpZ2h0IDIwMTMtMjAxOCAoYykgTXVsdGljb3Jld2FyZSwgSW5jIC0gaHR0cDovL3gyNjUub3JnIC0gb3B0aW9uczogY3B1aWQ9MTExMTAzOSBmcmFtZS10aHJlYWRzPTEgbm8td3BwIG5vLXBtb2RlIG5vLXBtZSBuby1wc25yIG5vLXNzaW0gbG9nLWxldmVsPTIgYml0ZGVwdGg9OCBpbnB1dC1jc3A9MSBmcHM9MjUvMSBpbnB1dC1yZXM9MTZ4MTYgaW50ZXJsYWNlPTAgdG90YWwtZnJhbWVzPTAgbGV2ZWwtaWRjPTAgaGlnaC10aWVyPTEgdWhkLWJkPTAgcmVmPTMgbm8tYWxsb3ctbm9uLWNvbmZvcm1hbmNlIG5vLXJlcGVhdC1oZWFkZXJzIGFubmV4YiBuby1hdWQgbm8taHJkIGluZm8gaGFzaD0wIG5vLXRlbXBvcmFsLWxheWVycyBvcGVuLWdvcCBtaW4ta2V5aW50PTI1IGtleWludD0yNTAgZ29wLWxvb2thaGVhZD0wIGJmcmFtZXM9NCBiLWFkYXB0PTAgYi1weXJhbWlkIGJmcmFtZS1iaWFzPTAgcmMtbG9va2FoZWFkPTE1IGxvb2thaGVhZC1zbGljZXM9MCBzY2VuZWN1dD00MCBoaXN0LXNjZW5lY3V0PTAgcmFkbD0wIG5vLXNwbGljZSBuby1pbnRyYS1yZWZyZXNoIGN0dT0xNiBtaW4tY3Utc2l6ZT04IG5vLXJlY3Qgbm8tYW1wIG1heC10dS1zaXplPTE2IHR1LWludGVyLWRlcHRoPTEgdHUtaW50cmEtZGVwdGg9MSBsaW1pdC10dT0wIHJkb3EtbGV2ZWw9MCBkeW5hbWljLXJkPTAuMDAgbm8tc3NpbS1yZCBzaWduaGlkZSBuby10c2tpcCBuci1pbnRyYT0wIG5yLWludGVyPTAgbm8tY29uc3RyYWluZWQtaW50cmEgc3Ryb25nLWludHJhLXNtb290aGluZyBtYXgtbWVyZ2U9MiBsaW1pdC1yZWZzPTMgbm8tbGltaXQtbW9kZXMgbWU9MSBzdWJtZT0yIG1lcmFuZ2U9NTcgdGVtcG9yYWwtbXZwIG5vLWZyYW1lLWR1cCBuby1obWUgd2VpZ2h0cCBuby13ZWlnaHRiIG5vLWFuYWx5emUtc3JjLXBpY3MgZGVibG9jaz0wOjAgc2FvIG5vLXNhby1ub24tZGVibG9jayByZD0yIHNlbGVjdGl2ZS1zYW89NCBuby1lYXJseS1za2lwIHJza2lwIGZhc3QtaW50cmEgbm8tdHNraXAtZmFzdCBuby1jdS1sb3NzbGVzcyBuby1iLWludHJhIG5vLXNwbGl0cmQtc2tpcCByZHBlbmFsdHk9MCBwc3ktcmQ9Mi4wMCBwc3ktcmRvcT0wLjAwIG5vLXJkLXJlZmluZSBuby1sb3NzbGVzcyBjYnFwb2Zmcz0wIGNycXBvZmZzPTAgcmM9Y3JmIGNyZj0yOC4wIHFjb21wPTAuNjAgcXBzdGVwPTQgc3RhdHMtd3JpdGU9MCBzdGF0cy1yZWFkPTAgaXByYXRpbz0xLjQwIHBicmF0aW89MS4zMCBhcS1tb2RlPTIgYXEtc3RyZW5ndGg9MS4wMCBjdXRyZWUgem9uZS1jb3VudD0wIG5vLXN0cmljdC1jYnIgcWctc2l6ZT0xNiBuby1yYy1ncmFpbiBxcG1heD02OSBxcG1pbj0wIG5vLWNvbnN0LXZidiBzYXI9MCBvdmVyc2Nhbj0wIHZpZGVvZm9ybWF0PTUgcmFuZ2U9MCBjb2xvcnByaW09NiB0cmFuc2Zlcj02IGNvbG9ybWF0cml4PTYgY2hyb21hbG9jPTEgY2hyb21hbG9jLXRvcD0wIGNocm9tYWxvYy1ib3R0b209MCBkaXNwbGF5LXdpbmRvdz0wIGNsbD0wLDAgbWluLWx1bWE9MCBtYXgtbHVtYT0yNTUgbG9nMi1tYXgtcG9jLWxzYj04IHZ1aS10aW1pbmctaW5mbyB2dWktaHJkLWluZm8gc2xpY2VzPTEgbm8tb3B0LXFwLXBwcyBuby1vcHQtcmVmLWxpc3QtbGVuZ3RoLXBwcyBuby1tdWx0aS1wYXNzLW9wdC1ycHMgc2NlbmVjdXQtYmlhcz0wLjA1IGhpc3QtdGhyZXNob2xkPTAuMDMgbm8tb3B0LWN1LWRlbHRhLXFwIG5vLWFxLW1vdGlvbiBuby1oZHIxMCBuby1oZHIxMC1vcHQgbm8tZGhkcjEwLW9wdCBuby1pZHItcmVjb3Zlcnktc2VpIGFuYWx5c2lzLXJldXNlLWxldmVsPTAgYW5hbHlzaXMtc2F2ZS1yZXVzZS1sZXZlbD0wIGFuYWx5c2lzLWxvYWQtcmV1c2UtbGV2ZWw9MCBzY2FsZS1mYWN0b3I9MCByZWZpbmUtaW50cmE9MCByZWZpbmUtaW50ZXI9MCByZWZpbmUtbXY9MSByZWZpbmUtY3R1LWRpc3RvcnRpb249MCBuby1saW1pdC1zYW8gY3R1LWluZm89MCBuby1sb3dwYXNzLWRjdCByZWZpbmUtYW5hbHlzaXMtdHlwZT0wIGNvcHktcGljPTEgbWF4LWF1c2l6ZS1mYWN0b3I9MS4wIG5vLWR5bmFtaWMtcmVmaW5lIG5vLXNpbmdsZS1zZWkgbm8taGV2Yy1hcSBuby1zdnQgbm8tZmllbGQgcXAtYWRhcHRhdGlvbi1yYW5nZT0xLjAwIHNjZW5lY3V0LWF3YXJlLXFwPTBjb25mb3JtYW5jZS13aW5kb3ctb2Zmc2V0cyByaWdodD0wIGJvdHRvbT0wIGRlY29kZXItbWF4LXJhdGU9MCBuby12YnYtbGl2ZS1tdWx0aS1wYXNzgAAAAApmaWVsAQAAAAATY29scm5jbHgABgAGAAYAAAAAFGJ0cnQAAAAAAAALuAAAC7gAAAAYc3R0cwAAAAAAAAABAAAAAQAAAgAAAAAcc3RzYwAAAAAAAAABAAAAAQAAAAEAAAABAAAAFHN0c3oAAAAAAAAADwAAAAEAAAAUc3RjbwAAAAAAAAABAAAALAAAAGF1ZHRhAAAAWW1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAALGlsc3QAAAAkqXRvbwAAABxkYXRhAAAAAQAAAABMYXZmNjEuMS4xMDA=";
        document.body.append(vid);*/

        window.imgFrame=document.createElement("iframe");
        imgFrame.src=firstEgg.src;
        imgFrame.style.display="none";
        frameHolder.appendChild(imgFrame);

        window.tessFrame=document.createElement("iframe");
        tessFrame.src="https://tesseract.projectnaptha.com/";
        tessFrame.style.display="none";
        frameHolder.appendChild(tessFrame);

        window.addEventListener("message", (event) => {
            if (event.data.type=="data") {
                tessFrame.contentWindow.postMessage(event.data,"*");
            }
            else if (event.data.type="description") {
                if (event.data.src.search("/cache/pokemon/")==-1) {
                    console.log(event.data);
                var egg=document.querySelector("#labEggs img[src='"+event.data.src+"'].pending");
                    if (egg) {
                        var newDescription=event.data.description.replace(/\n|[^a-z0-9]/gi,"");
                        var newSrc=event.data.src.replace(/https:\/\/static\.gpx\.plus\/images\/egg_descriptions\/|.png/g,"");

                        if (typeof savedDescriptions!=='undefined') {
                            if (!savedDescriptions[newDescription]||savedDescriptions[newDescription]!=newSrc) {
                                if (!allDescriptions.includes(newDescription)) {
                                    if (!savedDescriptions.errors[newDescription]) {
                                        var search=FuzzySet();
                                        for (var i in allDescriptions) if (Math.abs(allDescriptions[i].length-newDescription.length)<=5) search.add(allDescriptions[i]);
                                        var results=search.get(newDescription,null,0.97);
                                        if (results) {
                                            newDescription=results[0][1];
                                        }
                                        else {
                                            var noDescriptionFound=true;
                                        }
                                    }
                                }
                                if (noDescriptionFound) {
                                    if (!savedDescriptions.errors[newDescription]) savedDescriptions.errors[newDescription]=newSrc;
                                }
                                else savedDescriptions[newDescription]=newSrc;

                                if (document.querySelector("#userCard").innerText.search("Squornshellous Beta")!=-1) localStorage.setItem("savedDescriptions",JSON.stringify(savedDescriptions));
                                fetch('https://api.jsonblob.com/1425051201862557696', {
                                    method: 'PUT',
                                    body: JSON.stringify(savedDescriptions),
                                    headers: {
                                        'Content-type': 'application/json; charset=UTF-8',
                                    }
                                }).catch(error => alert("SaveDescription Error: "+error));
                            }
                        }

                        egg.setAttribute("description",newDescription);
                        egg.classList.replace("pending","done");
                    }
                }
            }
        });

        setInterval(setEggImages,1000);

        if (window.self!==window.top) {
            var newStyle=document.createElement("style");
            newStyle.innerHTML=`* {
    visibility:hidden;
    user-select:none !important;
}
:not(:is(#labEggs *, #shelterGrabber, #shelterGrabber *)) {
    position:absolute;
}
#shelterGrabber {
    left:200px;
    display:none;
}
#labEggs, #labEggs *, #shelterGrabber, #shelterGrabber * {
    visibility:visible;
}
html {
    overflow-x:hidden;
}
body {
    background:transparent !important;
}
#main {
    margin:0;
}
#contentContainer {
    top:0 !important;
    bottom:0 !important;
}
#labEggs {
    display:block;
    top:0;
    left:0;
    padding:0;
}
#labEggs>div {
    display:block;
    margin:10px 0 10px 5px;
}`;
            document.head.append(newStyle);
        }
    }
    else {
        setTimeout(function() {labInit()},1000);
    }
}

function dexInit() {
    var button2=document.createElement("div");
    button2.className="button";
    button2.style="position:fixed; bottom:40px; left:10px; font-size:120%;";
    button2.innerHTML="Check shiny";
    document.body.append(button2);
    button2.addEventListener("click",function() {
        navigator.clipboard.readText().then(clipped=>{
            clipped=clipped.split("\n");
            var no=[];
            var yes=[];
            var na=[];
            var lines={};
            clipped.forEach(name=>{
                var foundLine=line(name);
                if (foundLine) lines[name]=Object.keys(foundLine.evos);
                else lines[name]=[];
            });
            var hasShiny=[];
            document.querySelectorAll("#dex>div>div:not(:has(.psIcon.pIcon0))").forEach(entry=>{hasShiny.push(entry.innerText)});

            clipped.forEach(name=>{
                if (lines[name].length==0) na.push(name);
                else {
                    var noShiny=false;
                    lines[name].forEach(nam=>{if (!hasShiny.includes(nam)) {noShiny=true}});
                    if (noShiny==true) no.push(name);
                    else yes.push(name);
                }
            });
            no=sortListActual(no);
            yes=sortListActual(yes);
            navigator.clipboard.writeText("no shiny:\n"+no.join("\n")+"\n\nshiny:\n"+yes.join("\n")+(na.length==0?"":"\n\nnot found:\n"+na.join("\n")));
        });
    });
}
window.sortList = function(list) {
    console.log(sortListActual(list).join("\n"));
}
window.sortListActual = function(list) {
    if (typeof list=="string") list=list.replace(/^\s*|\s*$/gm,"").split("\n");
    var listIn=[];
    var rejects=[];
    var listOut={};

    for (i=0;i<list.length;i++) {
        list[i]=mon(list[i]);
        if (list[i]!=undefined) listIn.push(list[i]);
        else rejects.push(list[i]);
    }

    for (i=0;i<listIn.length;i++) {
        //if (listIn[i].con) {
            var steps=line(listIn[i]).steps;
            if (!listOut[steps]) listOut[steps]=[];
            listOut[steps].push(listIn[i].name);
        //}
    }

    var listOuter=[];
    Object.keys(listOut).forEach(function(item) {listOuter.push(item+"\n"+listOut[item].join("\n")+"\n")});
    return listOuter;
}

window.identifyPokemon = function(parent,nameSpace,descSpace,tooltip) {;
    if (parent.classList) parent.classList.add("named");
    nameSpace=parent.querySelector(nameSpace);
    descSpace=parent.querySelector(descSpace);
    if (nameSpace&&descSpace) {
        var name=nameSpace.innerHTML;
        if (name.search("Pokémon Egg")!=-1) {
            if (!tooltip) var desc=descSpace.innerHTML.replace(/ ~ .*/,"");
            else var desc=descSpace.getAttribute("data-tooltip");
            desc=desc.replace(/\s+/g," ");
            for (var i=pokemon.length-1;i>-1;i--) {
                //if (desc==pokemon[i].egg) {
                if (pokemon[i].egg!=""&&desc.search(pokemon[i].egg)!=-1) {
                    var pokeName=Object.keys(pokemon[i].evos)[0];
                    if (pokeName.search("Unown")==0) pokeName="Unown";
                    else if (pokeName.search("Arceus")==0) pokeName="Arceus";
                    else if (pokeName.search("Carbink ")==0) pokeName="Carbink [Novelty]";

                    nameSpace.innerHTML=name.replace("Pokémon Egg",pokeName+" Egg");

                    if (tooltip) {
                        nameSpace.title=name.replace("Pokémon Egg",pokeName+" Egg").replace(/.*—/,"");
                        parent.style="overflow-x:hidden; text-overflow:ellipsis;";
                        nameSpace.style="white-space:nowrap;";
                    }
                    break;
                }
            }
        }
    }
}

window.checkDexEggSteps = function() {
    window.it=0;
    window.dexList=document.querySelectorAll('div:not(.transparent)>[data-tooltip-fn="dex.tip"]');
    window.checkInterval=setInterval(function() {
        //console.log(it);
        var line=pokemon[it];
        var first=Object.keys(pokemon[it].evos)[0];
        var dex=document.querySelector(".dexDialog");
        if (dex) {
            var info=dex.querySelector("#dexPokemonInfo").innerText;
            var steps=info.replace(/(.|\n)*Egg steps to hatch: /g,"").replace(/\n(.|\n)*/,"").replace(",","");
            document.querySelector(".ui-dialog-titlebar-close").click();

            if (steps!=line.steps) console.log(first+": "+steps);

            it++;
            if (!pokemon[it]/*||it>5*/) {
                console.log("complete!");
                clearInterval(checkInterval);
            }

            //console.log(steps);
        }
        else {
            for (var a=0;a<dexList.length;a++) {
                if (dexList[a].innerText==first) dexList[a].click();
            }

            //console.log(first);
        }
    },500);
}

window.checkErrors = function() {
    if (document.querySelector("#userCard").innerText.search("Squornshellous Beta")!=-1) fetch("https://api.jsonblob.com/1425051201862557696")
        .then((response) => response.json())
        .then((json) => {
            window.savedDescriptions=json;

            if (savedDescriptions.errors) if (Object.keys(savedDescriptions.errors).length>0) {
                var errorBox=document.createElement("div");
                //errorBox.innerHTML="<h3><a href='https://jsonblob.com/1425051201862557696' style='color:"+getComputedStyle(document.body).color+";'>Bad Eggs</a></h3><p>"+savedDescriptions.errors.map(function (egg) {return "<img src=\"https://static.gpx.plus/images/egg_descriptions/"+egg+".png\" />"}).join("<br />")+"</p>";
                errorBox.innerHTML="<h3><a href='https://jsonblob.com/1425051201862557696' style='color:"+getComputedStyle(document.body).color+";'>Bad Eggs</a></h3><p>"+Object.entries(savedDescriptions.errors).map(function (egg) {return egg[0]+"<br /><img src=\"https://static.gpx.plus/images/egg_descriptions/"+egg[1]+".png\" />"}).join("<br />")+"</p>";
                errorBox.style="position:absolute; top:10px; left:10px; background:"+getComputedStyle(document.querySelector("#headerUser")).backgroundColor+"; border:1px solid black; padding:10px; border-radius:10px; z-index:1000; font-size:125%;";
                document.body.append(errorBox);
            }
        })
        .catch(error => alert("CheckErrors Error: "+error));
}

var url=window.location.href;

if (document.querySelector("h1")?.innerText=="504 Gateway Time-out") setTimeout(function() {window.location.reload},60000);

if (url.search("static.gpx.plus")!=-1) imgInit();
else if (url.search("tesseract.projectnaptha.com")!=-1) tessInit();
else if (url.search("gpx.plus/shelter")!=-1) {
    grabberInit();
    addLab();

    if (document.querySelector("#userCard").innerText.search("Squornshellous Beta")!=-1) fetch("https://api.jsonblob.com/019a1714-1100-7e21-9731-a3cb0340b0fd").catch(error => alert("CheckCustom Error: "+error));
}
else if (url.search("gpx.plus/lab")!=-1) {
    grabberInit();
    labInit();
}
else if (url.search("gpx.plus/info/")!=-1) identifyPokemon(document,"#infoPokemon figcaption>em","#infoData>div:first-child");
else if (url.search("gpx.plus/main")!=-1||url.search("gpx.plus/user/")!=-1||url.search("https://gpx.plus/#")!=-1||url=="https://gpx.plus"||url=="https://gpx.plus/") {
    var renameEggs=setInterval(function() {document.querySelectorAll("li.PartyPoke:not(.named)").forEach(mon=>{identifyPokemon(mon,"div+em","section a",true)})},500);
    checkErrors();
}
else if (url.search("gpx.plus/dex")!=-1) dexInit();


/*var pkmn=document.querySelectorAll("#dex.icons > div > div:not(:has(.transparent))");
var entries=[];
var i=0;
var flag=null;
var loop=setInterval(function () {
    if (document.querySelector(".ui-dialog-titlebar-close")) var open=true;
    else var open=false;
    if (open!=flag) {
        if (open) {
            flag=true;
            //var mon=document.querySelector(".ui-dialog-title").innerText.replace(/ - .{1,}/,"");
            var dex=document.querySelector(".ui-dialog-content > section:nth-child(3)").innerText.split("\n")[0].replace("Egg description: ","");
            //var dex=document.querySelector(".ui-dialog-content").innerText;
            entries.push(dex);
            document.querySelector(".ui-dialog-titlebar-close").click();
        }
        else {
            flag=false;
            if (pkmn[i]) {
                entries.push(pkmn[i].innerText);
                pkmn[i].click();
                i++;
            }
            else {
                clearInterval(loop);
                //console.log(entries.join("\n"));
                console.log(entries);
            }
    }
	}
},1000);*/
/*
var txt=``.split("\n");
var descs={};
for (var i=0;i<txt.length;i+=2) {
	descs[txt[i]]=txt[i+1];
}
var results=[];
pokemon.forEach(mon=>{
	var poke=Object.keys(mon.evos)[0];
	if (descs[poke]&&mon.egg) if (mon.egg!=descs[poke]) results.push(poke);
});
console.log(results.join("\n"));
*/