// ==UserScript==
// @name         2Random Wordlist
// @namespace    https://greasyfork.org/en/users/668074
// @version      2.3
// @description  Generates a random 2 word wordlist
// @author       Two, 𝔥𝔦𝔤𝔥
// @match        https://sketchful.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407370/2Random%20Wordlist.user.js
// @updateURL https://update.greasyfork.org/scripts/407370/2Random%20Wordlist.meta.js
// ==/UserScript==
/* global $ */

(function () {
    'use strict';
    var $ = window.$;//OR
    var newHTML = document.getElementById("gameSettings");
    //HTML by 𝔥𝔦𝔤𝔥 :)
    newHTML.insertAdjacentHTML("afterbegin", `<style>

	/* Google Font */
	@import url('https://fonts.googleapis.com/css2?family=Londrina+Shadow&display=swap');

	/* Custom Game Menu Container*/
	#gravatar {
		overflow: hidden;
	}

	/* Textarea */
	textarea {
		resize: none;
		height: 90px;
		background: #FFF;
		color: black;
		border: 3px solid #E1E1E1;
		margin-left: 5px;
		margin-right: 5px;
		border-radius: 5px;
		padding-left: 5px;
		line-height: 20px;
	}

	/* Input Fields */
	#listLength,
	#wordNum {
		background: #FFF;
		color: black;
		border: 2px solid #E1E1E1;
		border-radius: 5px;
		padding-left: 5px;
	}

	#listLength,
	#wordNum {
		padding-bottom: 10px;
	}

	/* Dashed Bottom Border*/
	.borderbottom {
		position: absolute;
		bottom: -2px;
		height: 2px;
		border-bottom: 2px dashed #E1E1E1;
		left: 0;
		width: calc(100% + 53px);
		transition: 0.2s;
	}

	/* Button Bar Container*/
	#copy {
		padding-bottom: 10px;
	}

	/* Arrow Button Container*/
	#circle {
		right: 27px;
		filter: brightness(150%) grayscale(0%);
		transition: 0.8s;
		position: absolute;
		height: 39px;
		width: 55px;
		border-radius: 20px;
		right: 10px;
		z-index: 10;
		transform: rotate(0deg);
	}

	/* Word Combiner Container*/
	#square {
		float: left;
		display: none;
		height: 0;
		width: 0;
		opacity: 0;
		display: block;
		height: auto;
		width: 100%;
		margin-top: -300px;
		text-align: center;
		transition: 0.8s;
	}

	/* Playerlist */
	#gameSettings {
		position: relative;
	}

	/* Text Placement In Textarea Boxes*/
	#rList,
	#result {
		padding-top: 3px;
	}

	/* Title Text */
	.text-styling {
		font-size: 46px;
		color: #B1B1B1;
		font-family: 'Londrina Shadow', cursive;
		width: 260px;
		margin: 0;
		padding: 0;
		margin-left: calc(50% - 130px);
		margin-bottom: 10px;
		transition: 0.2s;
		height: 60px;
	}

	/* Hover, Focus & Active Effects */
	/*Input & Textarea*/
	#listLength, #wordNum {
		transition: 0.2s;
	}

	#listLength:hover, #wordNum:hover {
		border: 2px solid #EFEFEF;
	}

	#listLength:focus, #wordNum:focus {
		border: 2px solid #BFDEFF;
	}

	textarea.rList, textarea.result {
		transition: 0.2s;
	}

	textarea.rList:hover, textarea.result:hover {
		border: 3px solid #EFEFEF;
	}

	textarea.rList:focus, textarea.result:focus {
		border: 3px solid #BFDEFF;
	}

	/* Title */
	.text-styling:hover {
		color: #BFDEFF;
	}

	.text-styling:active {
		color: #B1B1B1;
	}

	/* Word Combiner Container*/
	#square:hover {
		margin-top: 0px;
	}

	#square:hover, #circle:hover + #square {
		display: initial;
		position: relative;
		filter: invert(0%) !important;
		opacity: 1;
		width: 100%;
		height: auto;
		text-align: center;
		padding-bottom: 20px;
		margin-bottom: 20px;
		margin-top: 0px;
	}

	/* Arrow Button */
	#circle:hover {
		filter: invert(70%);
		transform: rotate(90deg);
	}

	/* Bottom Dashed Border */
	.borderbottom:hover {
		border-bottom: 2px dashed #BFDEFF;
	}

</style>

	<div id="gravatar">
		<img src="https://www.pinclipart.com/picdir/big/78-787768_right-double-arrow-icon-clipart.png"
			id="circle">
		<div id="square">
			<div id="title"><div class='text-styling'>Word Combiner</div></div>
			<div id="lengthContainer">
				<a>Length of list</a>
			</div>
			<div id="nwContainer">
				<a>No. of words</a>
			</div>
			<div id="copy">
			</div>
			<div class="borderbottom"> </div>
		</div>
	</div>` );


    $("#square,#circle").hover(
        function () {
            this.parentElement.firstElementChild.style.filter = 'brightness(200%) grayscale(100%)';
            this.parentElement.firstElementChild.style.transform = "rotate(90deg)";
        }, function () {
            this.parentElement.firstElementChild.style.filter = 'brightness(150%) grayscale(0%)';
            this.parentElement.firstElementChild.style.transform = "rotate(0deg)";
        }
    );



    const playersList = document.querySelector('#gamePlayersList');
    const gameSettings = document.querySelector(".columnRight");
    const canvas = document.querySelector("#canvas");
    const gameParent = document.querySelector(".gameParent");
    var canvasHeight;
    //thanks Bell
    new ResizeObserver(() => {
        if (!canvas.getBoundingClientRect().height) {
            canvasHeight = gameSettings.getBoundingClientRect().height;
        } else {
            canvasHeight = canvas.getBoundingClientRect().height;
        }
        playersList.style.maxHeight = `${canvasHeight}px`;
    }).observe(gameParent);

    document.getElementById("gamePlayersList").style.maxHeight = "100%";

    let space = document.createElement('span');
    space.innerHTML = `&nbsp;&nbsp;&nbsp;`
    let def = document.createElement('button');
    def.innerHTML = "Default Wordlist";
    def.setAttribute("class", "btn btn-sm btn-secondary");

    def.onclick = function () {
        rlist1.value = `alligator, alpaca, anglerfish, ant, anteater, antelope, armadillo, eagle, owl, bat, dragon, beaver, bee, beetle, Bigfoot, bird, bison, boar, bull, bulldog, butterfly, camel, cat, caterpillar, catfish, centipede, chameleon, cheetah, chicken, chihuahua, clown fish, cockroach, cow, crab, crocodile, crow, deer, dinosaur, dog, dolphin, donkey, dragonfly, duck, eagle, eel, elephant, firefly, flamingo, fly, fox, frog, gazelle, gecko, anteater, tortoise, giraffe, goat, hamster, goldfish, goose, grasshopper, shark, hamster, hedgehog, hippo, horse, hummingbird, hyena, jaguar, jellyfish, kangaroo, whale, crab, King Kong, penguin, vulture, kitten, koala, Kraken, lamb, leopard, lion, lizard, llama, lynx, meerkat, mole, monkey, moose, mosquito, moth, chicken, zebra, mouse, narwhal, octopus, orca, ostrich, otter, owl, panda, panther, parrot, peacock, pelican, penguin, pig, pigeon, piranha, platypus, polar bear, pony, poodle, porcupine, fish, puma, puppy, rabbit, raccoon, ram, rat, rattlesnake, panda, reindeer, rhinoceros, rooster, scorpion, sea lion, seagull, seal, shark, sheep, shiba, skunk, sloth, snail, snake, turtle, spider, monkey, spinosaurus, squid, squirrel, stingray, stork, sun, swan, swordfish, tadpole, tiger, beetle, fish, tortoise, toucan, triceratops, turkey, turtle, t-rex, unicorn, vulture, walrus, warthog, wasp, scorpion, snake, whale, shark, wolf, woodpecker, worm, yeti, zebra, apple, avocado, bacon, bagel, baguette, beans, potato, banana, sauce, beer, beet, bell pepper, biscuit, blackberry, blueberry, bread, broccoli, brownie, bubblegum, burrito, butter, cabbage, cake, necklace, carrot, cauliflower, celery, cereal, cheese, cheeseburger, cheesecake, cherry, burger, chicken nugget, chili, chocolate, bunny, cake, egg, milk, coffee, cookie, corn, dog, cat, cotton candy, stick, cranberry, croissant, cucumber, cupcake, curry, donut, egg, drink, burger, french fries, toast, frog, garlic, grape, grapefruit, gravy, grilled cheese, chicken, guacamole, gummy bear, gummy, ham, hamburger, brown, honey, hot chocolate, hot dog, hot sauce, ice cream, ice cube, tea, jalapeno, jam, jawbreaker, jelly, kebab, ketchup, kiwi, lasagna, lemon, lemonade, lettuce, lime, licorice, lollipop, cheese, macaroni, maple syrup, margarine, martini, mashed potatoes, mayonnaise, meatball, meatloaf, melon, milk, milkshake, brain, mushroom, mustard, nacho, noodle, olive, omelet, onion, ring, orange juice, oyster, pancake, papaya, peach, pear, peas, pepper, pepperoni, pickle, pie, pineapple, pizza, plum, pomegranate, popcorn, potato, chips, cracker, pretzel, prune, pudding, pumpkin, radish, raisin, sauce, raspberry, ravioli, relish, rice, salsa, salt, sandwich, sausage, shrimp, smoothie, soda, soup, spaghetti, sprout, steak, strawberry, waffle, sugar, sushi, taco, tea, toast, tomato, turnip, watermelon, whipped cream, whiskey, wine, yogurt, angry, barn, blood, blush, boxing glove, brick, bruise, bullseye, butcher, candy cane, lantern, China, clown, seaweed, snake, crowbar, devil, bus, fruit, dynamite, error, explosion, fire, fire alarm, fire extinguisher, fire hydrant, fire truck, flare, flare gun, finger, can, heart, hell, stamp, jello, ladybug, laser, lava, lava lamp, lighthouse, lips, lipstick, lobster, battery, leaf, mars, meat, nosebleed, picnic blanket, pimple, pokeball, poppy, button, red, sea, ribbon, roadblock, rose, ruby, santa, scar, shotgun, starfish, stoned, stop sign, sunburn, Superman, target, tongue, traffic cone, vein, light, sign, wax, Angry Birds, Cola, Deadpool, Elmo, Flash, Iron Man, KFC, Knuckles, Lightning Mcqueen, Mario, Mr Krabs, Red Riding Hood, Rudolph, Spiderman, Youtube, acorn, almond, bark, barrel, glove, basket, bear, belt, bench, bongo, bookshelf, boomerang, box, branch, bronze, broom, brown, brunette, cabin, canoe, caramel, cello, fountain, chocolate pudding, cinnamon, coconut, cola, cork, crust, dig, dirt, wood, drum, earthquake, fall, fence, flute, football, freckles, guitar, hay, hazelnut, hockey, cart, lasso, leather, log, wand, mine, mud, paper bag, peanut, peanut butter, pine cone, pirate, plank, poop, rope, seed, sewer, slug, soil, sombrero, soy sauce, ribs, stew, stool, table, tan, tea bag, teddy bear, tobacco, stump, trench, twig, ukulele, violin, volcano, Bigfoot, Chewbacca, Great Wall, Oreo, Shaggy, coyote, ballerina, ballet, belly, brain, bubble gum, cheek, cherry blossom, eggplant, elbow, eraser, eyelid, hand, lavender, perfume, piggy bank, pink, pinky, purple, heart, gold, salmon, skin, toe, tutu, Barney, bird, Cupid, Kirby, pony, Patrick, Peppa Pig, Piglet, Pink Panther, Porky Pig, Princess Bubblegum, Spyro, Toadette, Waluigi, Mario, Wario, aquarium, birdbath, blizzard, blowhole, blue, whale, blueberry, bluetooth, dam, jacket, diamond, diver, drool, fisherman, net, flood, frozen, genie, geyser, glacier, glass, ice, ice age, fishing, sculpture, icicle, igloo, ink, jeans, jet ski, surfer, lake, lightning, ocean, dart, policeman, pond, puddle, raindrop, river, saliva, sapphire, stone, sky, snorkel, spit, submarine, sweat, swimming pool, taser, tear, toothpaste, tsunami, water, balloon, bottle, cannon, gun, jet pack, park, show, slide, volleyball, waterfall, wave, whirlpool, Avatar, BMW, Blastoise, Cinderella, Cookie Monster, Discord, Donald Duck, Dory, Dropbox, Earth, Elsa, Facebook, Greece, Gumball, Herobrine, king, Stitch, Meeseeks, Sonic, Microsoft, Neptune, platypus, Playstation, Sans, Skype, Smurf, Sonic, Squidward, Twitter, Vault Boy, acid, algae, alien, backyard, bacteria, booger, bush, cactus, tree, clover, cocoon, soap, dollar, download, emerald, sign, flower, football, forest, battery, truck, garden, gnome, grass, green, green bean, green tea, greenhouse, grenade, health bar, insect, jungle, lawn, leaf, leprechaun, lily pad, mint, mold, moss, ninja turtle, nuclear waste, palm tree, park, pine tree, pistachio, plankton, plant, poison ivy, potion, radar, rainforest, rake, recycling, road, salad, seaweed, slime, soldier, spinach, spring, swamp, tank, tennis ball, tree, valley, vine, vomit, willow, bottle, x-ray, zombie, Android, Bulbasaur, Creeper, Frankenstein, Godzilla, Green Arrow, beret, card, Green Lantern, Grinch, Hulk, Joker, Kermit, Link, Loch Ness Monster, Luigi, Master Chief, Mike Wazowski, Pepe, Peter Pan, Pickle Rick, Shrek, Statue of Liberty, mask, Yoda, Yoshi, beach, bell, blonde, bulldozer, champagne, chick, coin, crane, crown, dandelion, desert, dune, earwax, emoji, eye, sand, fries, chain, egg, goose, halo, hard hat, highlighter, hive, honeycomb, hourglass, lightbulb, mango, medal, pasta, pencil, pollen, potato, pyramid, quicksand, boots, raincoat, duck, castle, sandbox, school bus, eggs, star, sponge, star, starfruit, sunflower, sunshine, tape measure, taxi, nail, treasure, trophy, tumbleweed, vanilla, ring, wheat, yellow, yolk, bee, Pikachu, Flappy Bird, Johnny Bravo, Lamborghini, Lego, Mcdonalds, Minion, Pac-Man, Spongebob, Simpson, Tweety, Wario, Winnie The Pooh, Wolverine, amber, apricot, baboon, tarantula, basketball, burger, campfire, corn, cheese, clownfish, copper, ember, flame, flamethrower, punch, life buoy, magma, cheese, prisoner, pie, wave, spider, squash, sun, sunrise, potato, syrup, torch, orange, Charizard, Charmander, Donald Trump, nachos, Garfield, Grand Canyon, pumpkin, Nemo, Puss in Boots, rock star, lion, Tails, big, small, happy, sad, cry, tear, cute, short, queen, prince, princess, king, Barack Obama, Daffy Duck, golden`
        doWork();
    }

    const copyContainer = document.getElementById("copy");
    copyContainer.appendChild(space.cloneNode(true));
    copyContainer.appendChild(space.cloneNode(true));
    copyContainer.appendChild(space.cloneNode(true));
    copyContainer.appendChild(def);

    const copyButton = document.createElement('button');
    copyButton.innerHTML = "Copy";
    copyButton.id = "copybtn";
    copyButton.setAttribute("class", "btn btn-sm btn-secondary");
    copyButton.onclick = function () {
        result.select();
        document.execCommand('copy');
    }

    let clr = document.createElement('button');
    clr.innerHTML = "Clear";
    clr.setAttribute("class", "btn btn-sm btn-secondary");
    clr.onclick = function () {
        result.value = "";
        rlist1.value = "";
        copyButton.style.backgroundColor = "";
    }

    copyContainer.appendChild(space.cloneNode(true));
    copyContainer.appendChild(clr);
    copyContainer.appendChild(space.cloneNode(true));
    copyContainer.appendChild(copyButton);

    let check1 = document.createElement('input');
    check1.setAttribute("id", "check");
    check1.setAttribute("type", "checkbox");
    check1.onchange = function () {
        doWork();
    }
    copyContainer.appendChild(space.cloneNode(true));
    copyContainer.appendChild(check1);
    copyContainer.append(" Remove Duplicates?");

    let wordNum = document.createElement("input");
    wordNum.setAttribute("placeholder", "Default: 2");
    wordNum.setAttribute("id", "wordNum");
    wordNum.setAttribute("type", "number");
    wordNum.onkeyup = function () {
        doWork();
    }
    document.getElementById("nwContainer").appendChild(wordNum);

    let listLength = document.createElement("input");
    listLength.setAttribute("placeholder", "Default: 1000");
    listLength.setAttribute("id", "listLength");
    listLength.setAttribute("type", "number");

    listLength.onkeyup = function () {
        doWork();
    }
    document.getElementById("lengthContainer").appendChild(listLength);

    const result = document.createElement("textarea");
    result.setAttribute("placeholder", "Result will show up here");
    result.setAttribute("id", "result");
    result.setAttribute("readonly", "");
    result.setAttribute("rows", "2");

    const rlist1 = document.createElement("textarea");
    rlist1.setAttribute("placeholder", "List of words to be randomized.");
    rlist1.setAttribute("id", "rList");
    rlist1.setAttribute("rows", "2");

    rlist1.onkeyup = function () {
        doWork();
    }

    const rlist2 = document.createElement("textarea");
    rlist2.setAttribute("placeholder", "List of words to be randomized. Leave blank to randomize only the first list.");
    rlist2.setAttribute("id", "rList2");
    rlist2.setAttribute("rows", "2");

    rlist2.onkeyup = function () {
        doWork();
    }

    const squareContainer = document.getElementById("square");
    squareContainer.appendChild(rlist1);
    squareContainer.appendChild(rlist2);
    squareContainer.insertAdjacentHTML("beforeend", "<br>")
    squareContainer.appendChild(result);


    function getRandomWords(no_words) {
        var now = parseInt(document.getElementById("wordNum").value) || 2;
        var temparr = [];
        console.log(no_words);
        for (var e = 0; e < now; e++) {
            temparr.push(no_words[Math.floor(Math.random() * no_words.length)]);
        }
        return temparr.join(" ");
    }

    function shorten(str, maxLen, separator = ', ') {
        if (str.length <= maxLen) return str;
        return str.substr(0, str.lastIndexOf(separator, maxLen));
    }

    function getWord(arr, list1) {
        var newWord = getRandomWords(list1);
        if (!arr) arr = [];
        arr.push(newWord);
        return arr;
    }

    function doWork() {
        var tries = 0;
        var listLength = parseInt(document.getElementById("listLength").value) || 1000;
        var l = rlist1.value;
        var l2 = rlist2.value;
        if (!l) return;

        result.value = "Loading...";

        // string to array
        l = shorten(l, 20000);
        l = l.split(",");
        l = l.map(f => f.replace(" ", ""));

        // string to array
        if(l2){
            l2 = shorten(l2, 20000);
            l2 = l2.split(",");
            l2 = l2.map(f => f.replace(" ", ""));
            var wordarr = [];
            let arrays = [l, l2];
            for (var i = 0; i < listLength; i++) {
                let str = "";
                for (var n = 0; n < (parseInt(document.getElementById("wordNum").value) || 2); n++) {
                    str += arrays[n % 2][Math.floor(Math.random() * l.length)] + " ";
                }
                wordarr.push(str);
            }
        }else {
            wordarr = getWord([], l);

            for (var i = 0; i < listLength; i++) {
                wordarr = getWord(wordarr, l);
            }
        }

        if (document.getElementsByClassName("check")[0].checked) {
            wordarr = wordarr.filter((value, index) => wordarr.indexOf(value) === index);
        }

        result.value = wordarr.toString();
        if (result.value.trim()) {
            copyButton.style.backgroundColor = "green";
        } else {
            copyButton.style.backgroundColor = "";
        }
    }
})();