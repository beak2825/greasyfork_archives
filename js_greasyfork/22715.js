// ==UserScript==
// @name        racism to crabfax
// @namespace   meme
// @description "I'm not racist, but did you know coconut crabs are hermit crabs?"
// @include     *
// @version     0.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22715/racism%20to%20crabfax.user.js
// @updateURL https://update.greasyfork.org/scripts/22715/racism%20to%20crabfax.meta.js
// ==/UserScript==
//******* CONFIG OPTIONS ******* //

// ***************************** //
walkAndObserve(document);

function walkAndObserve(doc) {
    var docTitle = doc.getElementsByTagName('title')[0],
    observerConfig = {
        characterData: true,
        childList: true,
        subtree: true
    },
    bodyObserver, titleObserver;
	
    // Do the initial text replacements in the document body and title
    walk(doc.body);
	
	/*
    doc.title = replaceText(doc.title);

    // Observe the body so that we replace text in any added/modified nodes
    bodyObserver = new MutationObserver(observerCallback);
    bodyObserver.observe(doc.body, observerConfig);

    // Observe the title so we can handle any modifications there
    if (docTitle) {
        titleObserver = new MutationObserver(observerCallback);
        titleObserver.observe(docTitle, observerConfig);
    } */
}

function walk(rootNode)
{
    // Find all the text nodes in rootNode
    var walker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_TEXT,
        null,
        false
    ),
    node;
	
    // Modify each text node's value
    while (node = walker.nextNode()) {
        handleText(node);
    }	
}

function handleText(textNode) {
	textNode.nodeValue = replaceText(textNode.nodeValue);
}

function replaceText(v)
{
	var badText = [
		'I\'m not racist but',
		'I\'m not sexist but',
		'I\'m not racist, but',
		'I\'m not sexist, but',
		'Im not racist but',
		'Im not sexist but',
		'Im not racist, but',
		'Im not sexist, but',
		'bottom hux'
	];
	for (key in badText){
		var regex1 = RegExp('[^?!.]*'+badText[key]+'[^?!.]*[?!.]','gi');
		var regex2 = RegExp('[^?!.]*'+badText[key]+'[^?!.]*','gi');
		
		//v = v.replace(regex1, getFax(badText[key]));
		v = v.replace(regex2, getFax(badText[key])); 
	}
	return v;
}

function getFax(inpStr){
	
	var crabFax = [
		'if a coconut crab pinches you with its claws, it will not let go. It\'s like the crustacean version of a pitbull except you don\'t see it coming until it has already dropped out of the tree onto your head.',
		'coconut crabs are the memers of the crab world. They are lol shut-ins during the months of June and July, when they refuse to leave their dens, but even in the remaining ten months of the year, they are solitary creatures and do not associate with fellow coconut crabs. Scientists disagree on whether this is because they are jerks or because they are crabchildren.',
		'coconut crabs live between thirty and sixty years, and yet, if they are made mods, they never manage to be around to open a new poast on time. Carefully honed skill or submission to innate laziness? The debate rages on, up next.',
		'something else which coconut crabs and memers have in common: lol fattiness. A coconut crab spans more than three feet in length. To put it in terms that memers may understand, that is at least twice the body length of the average adult cat (tails not included). They may weigh as much as five cats stacked on top of each other. These fatty jerks are surprisingly agile, though; they can climb something like twenty feet into the air, I assume by sticking to really tall trees. When they\'re up there, they\'re liable to start throwing coconuts to the ground like the maniacs they are.',
		'crabs aren\'t very good bombs.',
		'coconut crabs make their homes in segments of rotten tree trunks. IDK how they find all these dead husks, but I suspect ecoterrorism. Their homes are called dens, but that\'s clearly just a concentrated effort to make them sound less threatening. They litter their surroundings with empty coconut shells, so beware if you ever find a beach covered in coconut remains: you\'re about to have a crab drop down on your head.',
		'the coconut crab is able to live in powdered form for up to 32 hours! Be careful if you observe a suspicious powder lurking in trees or on top of refrigerators.',
		'coconut crabs go by many names. Moast of the names allude to the shady nature of those crooked crabs. "Palm thief" is one of them; "robber crab" is another. Their latin name is Birgus latro which also sounds kind of sinister, if you ask me. Either way: no matter how frandly these crabs may appear to you -- no matter how earnestly they try to sweetclick you into doing their bidding -- do not trust them with your valuables. They\'re robber crabs! It\'s right there in the name. Punks. Car-downloading punks.',
		'coconut crabs are hermit crabs.',
		'coconut crabs can be one of two colors: dark blue and red, though if you ask me, the red leans orange. While a subsection of crab scientists have speculated otherwise, the color of a crab\'s body does not reveal its political affiliation, because all coconut crabs are, in fact, lolpublicans, though they do not have suffrage. They are quite bootstrappy in general and think that if they have managed to find a coconut shell in which to live, all other crabs and people should certainly be able to do the same, and if they don\'t, they are lazy. They usually do pay their taxes.',
		'most hermit crabs are sociable creatures as far as food is concerned: they eat together in groups, perhaps gathered around a scallop they use as a table. Coconut crabs, however, are different. Instead of eating together and conversing with their fellow crab frands, they drag their food back to their little shifty caves and eat in solitude. All by themselves. All by their lonesome. Perhaps it is true that they are the crabchildren memers of the arthropodal world. Perhaps they are just, as has been previously theorized, jerk technology 100%. Who rly knows?',
		'as we all know, a coconut crab will stoop to nearly anything. Feasting on babby turtles? Check. Stealing people\'s cutlery and silverware? Check! Cracking people\'s skulls with their gigantic, freaky claws? Maybe! In fact, a number of theories suggest that coconut crabs did this very thing to famed aviator Amelia Earhart, who tragically disappeared in 1937. It has been speculated that Earhart landed near then made her way onto the island of nikumaroro – an island filled to the brim with the icky jerks. It has been further speculated that those selfsame icky jerks not only crushed Amelia Earhart\'s skull as if it were naught but a coconut, but then also ate her remains and hid her bones in their creepy burrows.',
		'let\'s face it, though: thieving jerks and dirty malingerers though coconut crabs are, they\'re probably not dickish enough, or even smart enough, to crush skulls, dismember bodies, feast on the meat, then hide the evidence. Even I am willing to concede as much and I think they\'re both skeevy and mean. It\'s a crabspiracy >:(',
		'when a coconut crab is but a wee crab, up until it\'s about three years old, it does not have a shell of its own. Most other crabs might just roll with their shelllessness, but not coconut crabs: they steal other crabs\' shells and use them. Of course they do. When they\'re two and a half to three years old, they start growing their own exoskeletons but presumably still do not return their old stolen shells to their previous owners. :( a coconut crab can live for up to sixty years. That\'s as many as 7.5 lol_memes!',
		'at first, the coconut crab was espoused as a container of coconut milk so portable and convenient, it even walked with you places if you put it on a sideways leash, you crazy lolmerican. Imagine that! A piña colada whenever you best please, and should you crave a crab leg with that, by all means, they\'re great and they\'re eight! How much are they gonna miss one lousy leg? You\'ve got the alcohol munchies. You deserve a leg or two!',
		'I believe I have already mentioned the quite likely true theory that Amelia Earhart died in the moast tragic of manner: crashing her plane on a wee island and getting brutally murdered and eaten by those punks of the arthropodean world, coconut crabs. But do you know what else they eat? You might guess that they eat coconuts. This is rong. They just disembowel coconuts and hide in them. Some say they eat other nuts or indeed fruit. This is also rong. Hideous monster crabs hold no appreciation for nature\'s candy. Instead they eat babby turtles! They eat seahorses, if they can get them! They eat kittens! They allegedly, but rly moar like definitely, kill and feast on the corpses of female aviator pioneers and heroes! Is there anything those malicious, mendacious crabs won\'t do? There is not. They will do anything and they will do it out of pure spite and ill will and they will do it to you. >:( beware!',
		'where do they find kittens on these islands?\n\nSome kittens swim. Some kittens get brought by their clueless humans and then they all get eaten. Many coconut crabs specifically live on beaches close to cities and human populations and such so that they will have better access to purses and cutlery and kittens :(',
		'the coconut crab is eaten by the Pacific Islanders and is considered a delicacy and an aphrodisiac, with a taste similar to lobster and crab meat. The most prized parts are the eggs inside the female coconut crab and the fat in the abdomen. Coconut crabs can be cooked like other large crustaceans, by boiling or steaming. Different islands also have a variety of recipes, as for example, coconut crab cooked in coconut milk. While the coconut crab itself is not innately poisonous, it may become so depending on its diet, and cases of coconut crab poisoning have occurred. It is believed that the poison comes from plant toxins, which would explain why some animals are poisonous and others not.',
		'they rly are the memers of the crustacean world. Mildly poisonous and with fatty abdomens? Sounds right.',
		'coconut crabs have lungs. They can\'t swim. They\'d drown.',
		'should a coconut crab pinch a person, it will cause pain and be unlikely to release its grip.',
		'how weirded out would you be if you were out walking and all of a sudden a coconut crab fell out of a tree and landed on your head? What would you do?',
		'meme, did uno that coconut crabs not only steal coconuts, but also shiny objects such as cutlery, mirrors and treasure, and perhaps even purses if they\'re reflective enough? They are jerks and punks.',
		'things coconut crabs eat besides coconuts: other innocuous things like figs and berries and pineapples and leaves. Turtle eggs. Turtle hatchlings. D:',
		'meme, here\'s an interesting factoid for you. Coconut crabs use lungs to breathe, not gills. Therefore, the next time one tries to pick a fight with you, make sure to tell it that you will only accept if you can brawl in the water instead of on land.\n\nBut I use lungs to breathe :(\n\nBut it will be impressed with your bravery and leave you alone. Coconut crabs are all bluster, really.',
		'to illustrate my doint: I\'d bet at least a couple of bucks that the memer on the previous page hollering for a peecup is, in fact, a coconut crab.',
		'fuck. I finally got around to googling coconut crabs, and they look like huge spiders. DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD:',
		'IL coconut crabs.',
		'celebrate by making clicking noises all day since you are born under the sign of the coconut crab. Coconut cancer.',
		'after crabfax memer started to poast about coconut crabs, I ended up googling them at around 3am while high and then started crying out of fear once I saw the pictures.',
		'would you rather fight 50 coconut crabs or one coconut crab the size of an orca?',
		'http://i.imgur.com/qxUuN5Nh.jpg',
		'http://i.imgur.com/f0XiZQoh.jpg',
		'coconut crabs do not have heads and yet they can drive. True crabfax.',
		'wait, coconut crabs are real? I thought crab facts memer made them up DDDDD: wtf? They\'re fucking monsters.',
		'coconut crabs mate frequently and quickly on dry land from may to september, especially between early june and late august.[20] male coconut crabs deposit a mass of spermatophores on the abdomen of the female;[21] the abdomen opens at the base of the third pereiopods, and fertilisation is thought to occur on the external surface of the abdomen as the eggs pass through the spermatophore mass.[22] the extrusion of eggs occurs on land in crevices or burrows near the shore.[23] shortly thereafter, the female lays her eggs and glues them to the underside of her abdomen, carrying the fertilised eggs underneath her body for a few months. At the time of hatching, the female coconut crab releases the eggs into the ocean.[22] this usually takes place on rocky shores at dusk, especially when this coincides with high tide.[24] the empty egg cases remain on the female\'s body after the larvae have been released, and the female eats the egg cases within a few days.[24]',
		'is coconut cream the jizz from a coconut crab?',
		'I meant to poast christmas crabfax, but what does a coconut crab do during christmas? I don\'t want to resort to just making shit up. :(',
		'while the coconut crab itself is not innately poisonous, it may become so depending on its diet, and cases of coconut crab poisoning have occurred.'
	];  
	var randomNumber = Math.floor(Math.random()*crabFax.length);
	if (inpStr[0] === 'I' || inpStr[0] === 'i'){
		return inpStr +' '+ crabFax[randomNumber];
	}else{
		return 'I\'m not racist, but ' + crabFax[randomNumber];
	}
} 