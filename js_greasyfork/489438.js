// ==UserScript==
// @name         Grundos Cafe Cliffhanger Solver
// @namespace    http://tampermonkey.net/
// @version      1.3.7
// @description  Will automatically fill in the solution for you.
// @author       Dij
// @match        https://www.grundos.cafe/games/cliffhanger/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL 3.0
// @downloadURL https://update.greasyfork.org/scripts/489438/Grundos%20Cafe%20Cliffhanger%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/489438/Grundos%20Cafe%20Cliffhanger%20Solver.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(document.querySelector('[name="solve_puzzle"]')) {
        const solutions = [
    "Happy Gadgadsbogen Day", //3
    {2:"No news is impossible", //4
     5:"Super glue is forever",
     6:"Better late than never",
     7:"Meercas despise red Neggs",
     9:"Scorchios like hot places"
    },
    {2:"Dr Frank Sloth is green", //5
     3:{5:"All roads lead to Neopia",
        8:"Koi invented the robotic fish"},
     4:{4:"Keep your broken toys clean",
        9:"Dung furniture stinks like dung"},
     5:"Today is your lucky day",
     6:"Nimmos are very spiritual beings"
    },
    {1:"A Buzz will never sting you", //6
     2:{4:"Be nice to Shoyrus or else",
        5:"Mr Black makes the best shopkeeper"},
     3:{5:"The Techo is a tree acrobat",
        6:"The beader has a beaming smile",
        7:"The Trading Post will never cheat"},
     4:{4:"Only real card sharks play cheat",
        7:"Chia bombers are mud slinging fools"},
     5:{2:"Moogi is a true Poogle racer",
        5:"Garon loves an endless challenging maze",
        7:"Great Neopets are not always wise"},
     6:{3:"Number six is on the run",
        4:"Fuzios wear the coolest red shoes"},
     7:{3:{2:"Carrots are so expensive these days",
           5:"Faeries are quite fond of reading",
           6:"Skeiths are strong but very lazy",
           9:"Korbats are creatures of the night"}},
     8:{3:{2:"Flotsams are no longer limited edition",
           3:"Chombies are shy and eat plants"}},
     10:{2:"Kacheekers is a two player game",
         4:"Tyrannians will eat everything and anything"}
    },
    {2:"An air of mystery surrounds the Acara", //7
     3:{3:{2:"The pen is mightier than the pencil",
           5:"You can never be poor on Neopets"},
        6:"You cannot teach an old Grarrl mathematics",
        7:"The Cybunny is the fastest Neopet ever",
        8:"The Snowager sleeps most of its life"},
     4:{4:{4:"Unis just love looking at their reflection",
           5:"Most wild Kikos swim in Kiko Lake"},
        5:{2:"When there is smoke there is pollution",
           4:{5:{3:{3:{9:"Some Neggs will bring you big Neopoints",
                             14:"Some Neggs will bring you big disappointment"}}}}}},
        5:{3:"Maybe the missing link is really missing",
           4:"Kyrii take special pride in their fur",
           13:"Never underestimate the power of streaky bacon"},
        6:{2:"Frolic in the snow of Happy Valley",
           4:"Faerie food is food from the heavens",
           7:"Mister pickles has a terrible tigersquash habit"},
        7:{4:{3:"Poogles look the best in frozen collars",
              6:"Uggaroo gets tricky with his coconut shells"},
           5:{2:"Kauvara mixes up potions like no other",
              3:"Tornado rings and cement mixers are unstoppable"},
           6:"Jubjubs defend themselves with their deafening screech",
           9:"Neopian inflation is a fact of life"},
        8:"Chombies hate fungus balls with a passion",
        9:"Asparagus is the food of the gods"
    },
    {1:{4:"A miss is as good as a mister", //8
        8:"A Neopoint saved is a Neopoint not enough",
        10:"A Tuskaninny named Colin lives on Terror Mountain"},
     2:{3:"Do not bathe if there is no water",
        4:{3:"An iron rod bends while it is hot",
           5:"If your hedge needs trimming call a Chomby"},
        5:"Dr Death is the keeper of disowned Neopets"},
     3:{3:"The big spender is an international jet setter",
        5:{2:"The Bruce is from Snowy Valley High School",
           4:"Pet rocks make the most playful of Petpets",
           5:"The Alien Aisha Vending Machine serves great food",
           10:"The Tatsu population was almost reduced to extinction"},
        6:{3:"You should try to raise your hit points",
           5:"The Hidden Tower is for big spenders only"},
        7:{6:"The Library Faerie tends to the crossword puzzle",
           7:"The Healing Springs mends your wounds after battle"},
        11:"The Celebration Calendar is only open in December"},
     4:{3:"Have you trained your pet for the Battledome",
        4:"Keep your pet company with a Neopet pet"},
     5:{1:"Whack a beast and win some major points",
        3:"Flame the Tame is a ferocious feline fireball"},
     6:{5:"Doctor Sloth tried to mutate Neopets but failed",
        8:"Faerie pancakes go great with crazy crisp tacos"},
     7:{2:"Scratch my back and I will scratch yours",
        3:"Kougras are said to bring very good luck"},
     8:{4:"Kacheeks have mastered the art of picking flowers",
        6:"Children should not be seen spanked or grounded"},
     10:{2:"Kikoughela is a fancy word for cough medicine",
         4:"Snowbeasts love to attack Grundos with mud snowballs"}
    },
    {2:{2:"It is always better to give than to receive", //9
        3:{3:"Do not try to talk to a shy Peophin",
           4:"Do not open a shop if you cannot smile"},
        4:"An idle mind is the best way to relax"},
     3:{3:"Put all of your neopoints on poogle number two",
        4:"The meat of a Sporkle is bitter and inedible",
        5:{5:{3:{5:{4:{3:{4:"The quick brown fox jumps over the lazy dog",
                          6:"Get three times the taste with the triple dog"}}}}},
           6:"Let every Zafara take care of its own tail"},
        7:"The barking of Lupes does not hurt the clouds",
        9:"The Tyrannian Volcano is the hottest place in Neopia",
        10:"The Battledome is near but the way is icy"},
     4:{3:{3:"Look out for the Moehog transmogrification potion lurking around",
           7:"Mika and Carassa want you to buy their junk",
           8:"Your pet deserves a nice stay at the Neolodge"},
        4:"Take your pet to Tyrammet for a fabulous time"},
     5:{2:"Stego is a baby stegosaurus that all Neopets love",
        3:"Enter the lair of the beast if you dare",
        4:"Treat your Usul well and it will be useful",
        6:"Every Neopet should have a job and a corndog"},
     6:{1:"Sticks N Stones are like the greatest band ever",
        2:"Plesio is the captain of the Tyrannian sea division",
        4:"Poogle five is very chubby but is lightning quick",
        8:"Terror Mountain is home to the infamous Ski Lodge"},
     7:{3:{2:"Meercas are to blame for all the stolen Fuzzles",
           7:"Magical ice weapons are from the ice cave walls"},
        4:"Poogles have extremely sharp teeth and they are cuddly",
        7:"Uggaroo follows footsteps to find food for his family",
       10:"Neopets Battledome is not for the weak or sensitive"},
       15:"Congratulations to everybody who helped defeat the evil Monoceraptor"
    },
    {1:"A Chia who is a mocker dances without a tamborine", //10
     2:{3:"If you live with Lupes you will learn to howl",
        4:"To know and to act are one and the same",
        5:"Oh where is the Tooth Faerie when you need her"},
     3:{3:"Yes Boy Ice Cream sell out all of their shows",
        4:{2:"The lair of the beast is cold and dark inside",
           5:{2:"The best thing to spend on your Neopet is time",
              3:"The wise Aisha has long ears and a short tongue"}},
        5:"The pound is not the place to keep streaky bacon",
        6:{2:"The Meerca is super fast making it difficult to catch",
           4:"The sunken city of Maraqua has some great hidden treasures"},
        7:"All Neopets can find a job at the Employment Agency",
        9:"The Tyrannian Jungle is full of thick muddle and mash",
        8:"Tyrannia is the prehistoric kingdom miles beneath the surface of Neopia",
        11:"The kindhearted Faerie Queen rules Faerieland with a big smile"
       },
     4:{3:{2:"Only ask of the Queen Faerie what you really need",
           5:"With the right training Tuskaninnies can become quite fearsome fighters"},
        4:"Love your Neopet but do not hug it too much",
        8:"Some Neohomes are made with mud and dung and straw"},
     5:{1:"Under a tattered cloak you will generally find Doctor Sloth",
        2:"There is nothing like a tall glass of slime potion",
        3:{2:"Store all of your Neopian trading cards in your Neodeck",
           8:"Chias are loveable little characters who are full of joy"}},
     6:{1:"Become a Battledome master by training on the Mystery Island",
        2:{2:"Better to be safe than meet up with a Monocerous",
           3:"Grarrg is the Tyrannian battle master that takes no slack"},
        4:"Please wipe your feet before you enter the Scorchio den"},
     7:{2:"Kyruggi is the grand elder in the Tyrannian town hall",
        3:"Meercas are talented pranksters that take pride in their tails",
        4:"Faeries bend down their wings to a seeker of knowledge"},
     8:"Bouncing around on its tail the Blumaroo is quite happy"
    },
    {1:"A journey of a million miles begins on the marketplace map", //11
     2:{1:"If a Pteri and Lenny were to race neither would win",
        3:{4:"Do not wake the Snowager unless you want to be eaten",
           5:"By all means trust in Neopia but tie your camel first"},
        4:"Be sure to visit the Neggery for some great magical Neggs"},
     3:{1:"Ask a lot of questions but only take what is offered",
        4:{3:{3:"You know you can create a free homepage for your pet",
              4:"You know the Soup Kitchen is a great place to go",}},
        5:"The Bluna was first sighted under the ice caps of Tyrannia",
        6:"You cannot wake a Bruce who is pretending to be asleep",
        8:{2:{1:"The Neopedia is a good place to start your Neopian Adventures",
              3:"You probably do not want to know what that odor is"}},
           11:"The Grundopedia is a good place to start your Neopian Adventures"},
        4:{3:{4:"Have you told your friends about the greatest site on earth",
              5:{2:"Give the Wheel of Excitement a spin or two or three",
                 4:"When the blind lead the blind get out of the way"},
              7:"Only mad Gelerts and Englishmen go out in the noonday sun"},
           4:"Kaus love to sing although they only know a single note",
           6:"When eating a radioactive Negg remember the pet who planted it",
           7:{3:"When friends ask about the Battledome say there is no tomorrow",
              4:"Make certain your pet is well equipped before entering the Battledome"}},
        5:{3:"Count von Roo is one of the nastier denizens of Neopia",
           4:"Every Buzz is a Kau in the eyes of its mother",
           5:"Bruce could talk under wet cement with a mouthful of marbles",
           8:"Space slushies are just the thing on a cold winter day"},
        6:{2:"Listen to your pet or your tongue will keep you deaf",
           6:"Poogle number five always wins unless he trips over a hurdle",
           8:"Faerie poachers hang out in Faerieland with their jars wide open"},
        7:{3:{3:"Jetsams are the meanest Neopets to ever swim the Neopian sea",
              9:"Grarrls are ferocious creatures or at least they try to be"}},
        8:"Tyrannia is the prehistoric kingdom miles beneath the surface of Neopia"
    },
    {1:"A Kyrii will get very upset if its hair gets messed up", //12
     2:{3:{2:"Do not be in a hurry to tie what you cannot untie",
           3:"If you see a man riding a wooden stick ask him why",
           4:"If you want to have lots of adventures then adopt a Wocky",
           5:{2:"Do not speak of an Elephante if there is no tree nearby",
              4:"By all means make Neofriends with Peophins but learn to swim first",
              5:"Do not think there are no Jetsams if the water is calm"}}},
     3:{3:"Eat all day at the giant omelette but do not be greedy",
        4:"The Snow Faerie Quest is for those that can brave the cold",
        5:"The Wheel of Mediocrity is officially the most second rate game around",
        6:{3:{5:"You should not throw baseballs up when the ceiling fan is on",
              7:"Fly around the canyons of Tyrannia shooting the evil pterodactyls and Grarrls"},
           4:"The Grarrl will roar and ten eggs will hatch into baby Grarrls"}},
     4:"When an Elephante is in trouble even a Nimmo will kick him",
     5:{2:"There is only one Ryshu and there is only one Techo Master",
        3:"Catch the halter rope and it will lead you to the Kau",
        4:{2:"Dirty snow is the best way to make your Battledome opponent mad",
           4:"Krawk have been known to be as strong as full grown Neopets"}},
     6:"Uggsul invites you to play a game or two of Tyranu Evavu",
     7:"Myncies love to hug their plushies and eat sap on a stick",
     8:{5:{2:{5:{1:"Everyone loves to drink a hot cup of borovan now and then",
                 3:"Jarbjarb likes to watch the Tyrannian sunset while eating a ransaurus steak"}},
           3:"Quiggles spend all day splashing around in the pool at the Neolodge"}},
     10:"Experience is the comb that nature gives us when we are bald",
     11:"Cliffhanger is a brilliant game that will make your pet more intelligent"
    },
    {1:"A Scorchio is a good storyteller if it can make a Skeith listen", //13
     2:{2:"If at first you do not succeed play the Ice Caves puzzle again",
        3:{2:{3:"If you go too slow try to keep your worms in a tin",
              6:"Do not be greedy and buy every single food item from the shops"}},
        4:"If your totem is made of wax do not walk in the sun",
        5:{4:"We never know the worth of items till the Wishing Well is dry",
           5:"It makes total sense to have a dung carpet in your dung Neohome"}},
     3:{3:"You can lead a Kau to water but you cannot make it drink",
        7:"The Neopian Hospital will help get your pet on the road to recovery"},
     4:"Bang and smash your way to the top in the bumper cars game",
     7:"Myncies come from large families and eat their dinner up in the trees",
     10:"Faerieland is not for pets that are afraid of heights or fluffy clouds"
    },
    {3:{3:"Why beg for stuff when you can make money at the Wheel of Excitement", //14
        4:"You know you should never talk to Bruce even when his mouth is full"},
     4:"Your Neopet will need a mint after eating a chili cheese dog with onions",
     8:"Building a Neohome is a way to build a foundation for your little pets"
    },
    {3:{5:"The beast that lives in the Tyrannian mountains welcomes all visitors with a sharp smile", //15
        6:"You really have to be well trained if you want to own a wild Reptillior",
        7:"The whisper of an Acara can be heard farther than the roar of a Wocky"},
     6:"Bronto bites are all the rage and they are meaty and very easy to carry"}
    ];

    var words = document.querySelector('.ch_puzzle').querySelectorAll('.ch_word');
    const wordlens = Array(words.length)
    for(var i = 0; i < words.length; i++) {
        wordlens[i] = words[i].children.length;
    }
    var solutionSubset = solutions[wordlens.length - 3];
    for(i = 0; i < wordlens.length+1; i++) {
        if(!solutionSubset) {
            window.onload = function() {
                alert("It looks like there's no solution saved for this puzzle! If you can find the answer, please send a neomail to Dij!");
            }
        }
        if(solutionSubset.constructor.name == "Object") {
            solutionSubset = solutionSubset[wordlens[i]];
        } else {
            document.querySelector('[name="solve_puzzle"]').value = solutionSubset;
        break;
        }
    }
    } else {
        document.querySelector('input[name="game_skill"][value="3"]').checked = true;
    }
})();