// ==UserScript==
// @name         ao3 rekudos remix
// @version      1.2
// @history		 1.2 - added directions
// @history		 1.1 - attempted to include rekudos? confirmation function from ao3 rekudos converter
// @history		 1.0 - first version, basic functionality
// @description  prompts you to leave a comment when you've already left kudos and provides you with a list of previously written comments ready to quickly insert. alternatively, can be configured to use traditional 'rekudos converter' mode and randomize the selection of a previously written comment. ALTERNATIVELY alternatively, can be configured to use 'comment assist' modes.
// @match        http*://archiveofourown.org/*works*
// @grant        none
// @namespace   

// @downloadURL https://update.greasyfork.org/scripts/511702/ao3%20rekudos%20remix.user.js
// @updateURL https://update.greasyfork.org/scripts/511702/ao3%20rekudos%20remix.meta.js
// ==/UserScript==

// acknowledgements: this script is almost entirely frankensteined together from a mashup of the "ao3 comment assist" and "ao3 rekudos converter" scripts, also available on greasyfork. see "ao3 rekudos converter" for additional acknowledgements.
// "ao3 comment assist" - [url]
// "ao3 rekudos converter" - https://greasyfork.org/en/scripts/427421-ao3-rekudos-converter
// I did attempt to get permission from Van Irie to post my remix but have not heard back from them as of yet. Fandom userscripts typically work by fandom rules, so hopefully this is not a terrible overstep!

// SETUP - Choose Mode //

var assist_type = 1;
    //Set rekudos mode. You can choose from 6 different options.
		//1: Lets you select from a pre-written list of comments.
		//2: Randomly selects from a pre-written list of comments. (adapted from "ao3 rekudos converter")
		//3: A commenting guide for people who have never done it before. (from "ao3 comment assist")
		//4: Randomly provides a prompt from a pre-written list of comment prompts. (from "ao3 comment assist")
		//5: Adds a simple reminder to leave a comment. (from "ao3 comment assist")

var fast_mode = false;
    //Set to "true" to turn on fast posting mode.
    //Hitting "enter" anywhere in the comment field will immediately send your comment.

//var immediate_mode = true;

var lat = 500;
    //Delay in milliseconds, waiting for reply from OTW servers. (Check with CTRL+SHIFT+K)


// DEFINITIONS - Define Variables

var work_id, kudos, banner, kudo_btn, cmnt_btn, cmnt_field, id;
		work_id = window.location.pathname;
		work_id = work_id.substring(work_id.lastIndexOf('/')+1);
		banner = document.getElementById('kudos_message');
		kudo_btn = document.getElementById('new_kudo');
		cmnt_btn = document.getElementById('comment_submit_for_'+work_id);
		cmnt_field = document.getElementById('comment_content_for_'+work_id);


//	DEFINITIONS - Define Mode Templates

var assist_msg, mode1, mode2, mode3, mode4, mode5, mode6, listofcomments, listofprompts;

//	Mode 1: Auto-populates the comment field with a pre-written list of comments.
	// keep the pre-compiled list of options or edit and make your own! see below for instructions.
	mode1 = "Kudos+  \nbut what about SECOND kudos? \nA+ have read yet again";
		// comments must be listed sequentially in the quotes following mode1 =
		// use \n to separate comments onto their own line
		// do not leave a space between \n and the beginning of the next comment, or it'll show up in the comment field with a leading blank space

//	Mode 2: Randomly selects from a pre-written list of comments. (adapted from "ao3 comment assist")
	// keep the pre-compiled list of options or edit and make your own! see below for instructions.
	mode2 = "[You've already left kudos here! Add a random comment?] \n\n";
		listofcomments = Array( 
		"Kudos+",
		"but what about SECOND kudos?",
		"A+ have read yet again"
		);
		// comments must be listed in the array inside of quotation marks, separated by commas
		// do not include a comma following the last entry in the list
		
	var rerandom1 = Math.floor(Math.random() * listofcomments.length);
	var mode2addition = listofcomments[rerandom1];

	mode2 = mode2+mode2addition+"\n\n[If you're satisfied with this comment, go ahead and hit comment to submit! If not, you can always reload the page and try again, or even write a new one!] ";

//	Mode 3: A commenting guide for people who have never done it before. (from "ao3 comment assist")
	mode3 = "[Hello from Rekudos Tools! You tried leaving a kudos when you've already left one. Comment assist mode has activated to remind you to leave a comment instead.] \n\n[If you know what kind of comment you want to leave, you can delete this message and write your own, but if you need help or this is the first time you're leaving a comment, here’s a runway to get you thinking about what you might want to say.]  \n\n[First and foremost: *commenting is a form of self-expression*. It is communication between the reader and the author, but it is also a form of communication between the reader and the work. At the foundation of every comment is an appreciation of your own taste, your own experiences with the story. Learning to validate your own enjoyment is the first hurdle to clear when learning to leave comments, whether from a purely emotional place like \"this made me feel better\", \"this was really cathartic to read\", or \"this Hurt Me, and I am Feeling\" or a more complex intellectual pleasure of \"Character A’s arc was well-structured\", \"I enjoyed this specific phrasing for all its implications\" or \"this theme came through to me in a strong, affecting way\".]  \n\n[A major piece to overcoming comment shyness is to think of your comments not as your duty towards the author, but something you do for your own enjoyment instead. People can be very reluctant to talk about their positive feelings, and may even feel like their positive comments are silly and unwelcome. Literally nobody who has ever left a negative comment has thought about their own feelings this hard, or applied such a flagrant double-standard to them.]  \n\n[You may have heard of the sandwich model of commentary – a light opening statement (usually a compliment) followed by a contrasting “filler” (usually criticism) followed by a closing statement establishing tone (usually another compliment). A good place to start with a comment is to envision it as an A-B-A structure like this.] \n\n[If you’re not interested in leaving a critical comment, you can pick a different contrast. Maybe start by talking about how you were feeling when you started reading the fic, and then pick a part of the fic that felt very engaging, and then end by talking about how you were feeling after you’d finished the story. Maybe structure your A-B-A around first talking about the world, then about the characters, or first talking about one character, then another. If you’re struggling to figure out what it is that worked in the story, often looking at the relationships between the elements will help clear things up.] \n\n[The more comments you leave, the easier it becomes to analyse your own feelings about a work. Putting into words what you liked teaches you to spot it when things don’t work out so well, which in turn strengthens your ability to verbalise what does work. You liked the work – but was there a part you liked *especially*? What were your expectations coming into this story, and how were they met? How were they surpassed? If you were surprised, how?] \n\n[Your comment doesn’t have to be long or complicated to be meaningful, either! Writing can be thankless and isolating, it can distance you from people as you’re wrapped up in your own intellectual pursuits, and hearing that you’ve affected someone in any way, can even come as somewhat of a shock when it *does* happen. Just as you as a commenter may be hesitant to express your positive feelings, authors may often overlook the value of looking at what works in their stories. A simple “thank you” can truly change the way someone feels about their own work. Singling out just one thing that made the reading experience work for you can elevate all the work that went into making that choice in the first place.] \n\n[No matter what kind of comment you decide to leave, thank you for deciding to share those feelings with the author! And remember that commenting is an acquired skill – the more you do it, the easier it gets :)]";

//	Mode 4: Randomly provides a prompt from a pre-written list of comment prompts. (from "ao3 comment assist")
	mode4 = "[You've already left kudos here! Here's a random prompt to get you started on leaving a comment:] \n\n";
	listofprompts = Array( // keep the pre-compiled list of options or edit and make your own!
	"[What was the best bit of the fic? Did you have a favourite line? Quote a part you liked back to the author. You can add explanations or reactions for flavour.]",
	"[Why did you seek this fic out? Was there something about the tags, summary, or the concept that piqued your interest? Did it meet your expectations?]",
	"[Imitation is often the sincerest form of flattery. Did you find anything about this fic something you’d like to revisit yourself in the future, in the characterisation or the style?]",
	"[Did the fic change your mind about anything regarding the source material? Did it make you rethink, or did you find yourself agreeing with the author over characterisation or plot?]",
	"[Were you entertained by the fic? Did you have fun reading it? Did it inspire any other feelings? If you’re an artist/writer yourself, did it inspire you creatively?]",
	"[What was your reading experience like? Did you take breaks, did you devour the whole thing? Did your mood or feelings change as you were reading?]",
	"[What parts of the characterisation were your favourite? Is there any moment in the fic that really felt *right* for the character?]",
	"[Is there a reason you’re rereading this fic now? Do you think you’ll do so in the future? If you feel comfortable, you can talk about your personal relationship to the story, for example add anecdotes about when and why you’ve read it.]",
	"[Sometimes it’s nice to just *vent*. How do you feel writing this comment? How did your feelings change while you were reading the fic?]",
	"[How did the themes of the story come through to you? Did you find how they were addressed surprising? Believable? Engaging?]",
	"[Was there a particular bit you connected with the strongest? Was it with a character you expected to connect with?]",
	"[Was there any part of the worldbuilding in the fic that particularly appealed to you? Any standout details that integrated well with the plot or the characterisation?]",
	"[Do you have any strong opinions about canon? How does this fic work for you, in relation to those strong opinions?]",
	"[Have you read anything else from the author? Would you like to? What in the story makes the rest of their oeuvre interesting to you?]",
	"[Did the writing feel realistic to you? Did character actions feel believable?]",
	"[How did the author succeed in capturing the characters? Did they do something you didn't expect? What did you find interesting about their interpretation?]",
	"[Was the style the fic was written in appealing to you? Was there anything in word choice or phrasing that stood out to you?]",
	"[How was the pacing of the fic? Did your level of engagement change, were you surprised or startled by any event?]",
	"[Give yourself a moment to mull it over, or maybe even reread the fic. Is there anything that pops out at you as feeling more significant in hindsight? Anything that you enjoy more on the second go?]",
	"[Did you pick up on any foreshadowing? Were you surprised by the turns the plot took?]",
	"[Has your opinion on this fic changed since you last read it? Do you remember your initial response to it?]",
	"[Writers love their metatextuality. Does this fic remind you of other stories, do you see your reaction to it reflected in other stories?]",
	"[How do you feel about the structure of the fic? Did the plot have that good sense of rollercoaster action or was it a pleasant boat ride on a calm river instead?]",
	"[Did the story feature your favourite characters? How did you like their characterisation?]",
	"[Did any of the characters stand out as your favourite, if the fic had a multitude of them? Did you like the ensemble?]",
	"[How did the relationships between the characters feel? Were they believable, did they ring authentic to you?]",
	"[Are you curious about the writing process? Is there a moment you particularly wonder how the writer approached?]",
	"[Were you left with any questions at the end of the story? Is there any ambiguity you're going to have to unpack later?]",
	"[How did you like the central conflict? Did the tension feel believable? Manageable? Overwhelming?]",
	"[Would you like to see more works like this from the author? Would you like to see the author's take on something related?]"
	);

	var rerandom2 = Math.floor(Math.random() * listofprompts.length);
	var mode4addition = listofprompts[rerandom2];

	mode4 = mode4+mode4addition+"\n\n[If you're satisfied with this comment, go ahead and hit comment to submit! If not, you can always reload the page and try again, or even write a new one!] ";

//	Mode 5: Adds a simple reminder to leave a comment. (from "ao3 comment assist")
	mode5 = "[You've already left kudos! Why not leave a comment instead? <3]";


//	Assign Mode

if (assist_type == 1) {
    assist_msg = mode1;
}
if (assist_type == 2) {
    assist_msg = mode2;
}
if (assist_type == 3) {
    assist_msg = mode3;
}
if (assist_type == 4) {
    assist_msg = mode4;
}
if (assist_type == 5) {
    assist_msg = mode5;
}


//	FUNCTION - Fast Posting Mode

function fastsend() {
    cmnt_field.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        cmnt_btn.click();}
    });
}


//	FUNCTION - Basic Functionality

function assist() {
    cmnt_field.value = assist_msg;
    cmnt_btn.focus();
    window.scrollBy(0,200);
    cmnt_field.focus();
	if (assist_type == 1) {
	cmnt_btn.value = 'Rekudos?';
	}
	if (assist_type == 2) {
	cmnt_btn.value = 'Rekudos?';
	}	
    if (fast_mode == true){
    fastsend();}
}

function makeitwork() {
	console.log("Assist Mode lat check");
	if (banner.classList.contains("kudos_error") == true) {
		assist();}
}

function delay(){
    setTimeout(makeitwork,lat);
}

(function(){
	window.AssistMode = true;
	console.log("Assist Mode On.");
})();

kudo_btn.addEventListener("click", delay);
