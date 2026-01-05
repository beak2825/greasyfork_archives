// ==UserScript==
// @name       XKCD Text Replacer
// @version    2.1
// @description  Replaces text (mostly) according to http://xkcd.com/1288/ , http://www.xkcd.com/1625/ , and http://www.xkcd.com/1679/ , as well as http://www.xkcd.com/821/ , http://www.xkcd.com/1004/ , http://www.xkcd.com/1025/ , http://www.xkcd.com/1031/ , and http://www.xkcd.com/1418/ . This script is just an update of https://greasyfork.org/en/scripts/1322-xkcd-text-replacer
// @match      http://*/*
// @require		http://code.jquery.com/jquery-latest.js
// @namespace https://greasyfork.org/en/users/43235-mind-combatant
// @downloadURL https://update.greasyfork.org/scripts/19606/XKCD%20Text%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/19606/XKCD%20Text%20Replacer.meta.js
// ==/UserScript==

GM_addStyle(".xkcd_replaced:hover { text-decoration:underline; }");

var array = {
    "witnesses": "dudes I know",
    "allegedly": "kinda probably",
    "new study": "Tumblr post",
    "rebuild": "avenge",
    "space": "spaaace",
    "Google Glass": "Virtual Boy",
    "smartphone": "Pokédex",
    "electric": "atomic",
    "senator": "elf-lord",
    "car": "cat",
    "election": "eating contest",
    "congressional leaders": "river spirits",
    "Homeland Security": "Homestar Runner",
    "could not be reached for comment": "is guilty and everyone knows it",
    "debate": "dance-off",
    "self driving": "uncontrollably swerving",
    "poll": "psychic reading",
    "candidate": "airbender",
    "drone": "dog",
    "vows to": "probably won't",
    "at large": "very large",
    "successfully": "suddenly",
    "expands": "physically expands",
    "first-degree": "friggin' awful",
    "second-degree": "friggin' awful",
    "third-degree": "friggin' awful",
    "an unknown number": "like hundreds",
    "front runner": "blade runner",
    "global": "spherical",
    "years": "minutes",
    "minutes": "years",
    "no indication": "lots of signs",
    "urged restraint by": "drunkenly egged on",
    "horsepower": "tons of horsemeat",
    "gaffe": "magic spell",
    "ancient": "haunted",
    "star-studded": "blood-soaked",
    "remains to be seen": "will never be known",
    "silver bullet": "way to kill werewolves",
    "subway system": "tunnels I found",
    "surprising": "surprising (but not to me)",
    "war of words": "interplanetary war",
    "tension": "sexual tension",
    "cautiously optimistic": "delusional",
    "Doctor Who": "The Big Bang Theory",
    "win votes": "find Pokémon",
    "behind the headlines": "beyond the grave",
    "email": "poem",
    "Facebook post": "poem",
    "tweet": "poem",
    "Facebook CEO": "this guy",
    "latest": "final",
    "disrupt": "destroy",
    "meeting": "ménage à trois",
    "scientists": "Channing Tatum and his friends",
    "you won't believe": "I'm really sad about",
    "I think that": "I saw a study once that said",
    "Batman": "a man dressed like a bat",
    " would be a good name for a band": ".tumblr.com",
    "keyboard": "leopard",
    "force": "horse"
};
$(function(){
    $("body")
    	.find("*")
        .contents()
        .filter(function() {
            return this.nodeType === 3; //Node.TEXT_NODE
        })
        .each(function(){
            var text = $(this).text();
            for (var val in array){
            	text = text.replace(new RegExp("\\b" + val + "\\b", "gi"), "<span class='xkcd_replaced' title='" + val + "'>" + array[val] + "</span>");
            }
            $(this).replaceWith(text);
    });
});
    