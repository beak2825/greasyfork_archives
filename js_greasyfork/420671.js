// ==UserScript==
// @name         AO3: [Wrangling] Tess Marie's Home Filter Fork
// @description  A fork of kaerstyne's Wrangling Home Filter Redux
//               to filter by franchise as well as shared/solo unwrangled bins
//               THIS GETS UPDATED AS I PICK UP/DROP FANDOMS, PLS FORK AND EDIT FOR YOUR OWN VERSION
// @version      1.0.2
 
// @author       Tess
// @license      GPL-3.0 <https://www.gnu.org/licenses/gpl.html>
 
// @match        *://*.archiveofourown.org/tag_wranglers/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @grant        none
// @namespace https://greasyfork.org/users/731368
// @downloadURL https://update.greasyfork.org/scripts/420671/AO3%3A%20%5BWrangling%5D%20Tess%20Marie%27s%20Home%20Filter%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/420671/AO3%3A%20%5BWrangling%5D%20Tess%20Marie%27s%20Home%20Filter%20Fork.meta.js
// ==/UserScript==
 
 
// SETTINGS //
 
// Define which of your fandom tags go to which franchise, and which are cowrangled.
// Increase or decrease the number of franchises as needed.
// Every section that needs to be EDITed to adjust for your fandoms/franchises
// will have a leading comment that says EDIT.
// Put each fandom on a separate line.
// Use the EXACT NAME of the fandom as it appears on your wrangling page.
 
var franchise1 = `
Cormoran Strike Series - Robert Galbraith
Harry Potter - J. K. Rowling
Strike (TV 2017)
Supernatural
Pirates of the Caribbean (Movies)
`;
 
var franchise2 = `
Andrew Hozier-Byrne (Musician)
As it Was - Hozier (Song)
Cherry Wine - Hozier (Song)
Florence + the Machine
From Eden - Hozier (Music Video)
In the Woods Somewhere - Hozier (Song)
It Will Come Back - Hozier (Song)
Jackie and Wilson - Hozier (Song)
Like Real People Do - Hozier (Song)
Moment's Silence - Hozier (Song)
Movement - Hozier (Song)
NFWMB - Hozier (Song)
Nina Cried Power - Hozier ft. Mavis Staples (Song)
Nobody - Hozier (Song)
Sedated - Hozier (Song)
Someone New - Hozier (Music Video)
Take Me to Church - Hozier (Music Video)
Take Me To Church - Hozier (Song)
To Be Alone - Hozier (Song)
Wasteland Baby - Hozier (Album)
Work Song - Hozier (Music Video)
Work Song - Hozier (Song)
Would That I - Hozier (Song)
`;
 
var franchise3 = `
A Futile and Stupid Gesture (2018)
About Time (2013 Curtis)
America's Funniest Cats - SNL Sketch
American Made (2017)
Archangel (2010 Short Film)
Brooklyn (2015)
Burn This - Wilson
Calvary (2014)
Career Day - SNL Sketch
Crash Pad (2017)
Fortnite Squad - SNL Sketch
Frances Ha (2012)
Frank (2014)
Gayby (2012)
Girls (TV)
Goodbye Christopher Robin (2017)
Hungry Hearts (2014)
Immaturity for Charity (2012)
Inside Llewyn Davis (2013)
J. Edgar (2011)
Logan Lucky (2017)
Man and Boy (2002)
Marriage Story (2019)
Medieval Times - SNL Sketch
Midnight Special (2016)
Never Let Me Go - Kazuo Ishiguro
Never Let Me Go (2010)
Not Waving But Drowning (2012)
Paterson (2016)
Peter Rabbit (2018)
Run (TV 2020)
Sensation (2010)
Shadow Dancer (2012)
Silence (2016)
Sleepover - SNL Sketch (2020)
Slow - SNL Sketch (2020)
Snickers "Ruined" Commercial
The Dead Don't Die (2019)
The Kitchen (2019)
The Last Duel (2020)
The Little Stranger (2018)
The Man Who Killed Don Quixote (2018)
The Report (2019)
The Revenant (2016)
The Science Room - SNL Sketch
The Tale of Thomas Burberry (2016)
This Is Where I Leave You (2014)
Tracks (2013)
True Grit (2010)
Unbroken (2014)
Undercover Boss: Starkiller Base - SNL Sketch
What If (2013 Dowse)
While We're Young (2014)
You Don't Know Jack (2010)
Your Bad Self - Papercut (Short Film 2010)
`;
 
var franchise4 = `
Diana Tregarde Investigations - Mercedes Lackey
Elemental Masters - Mercedes Lackey
Free Bards - Mercedes Lackey
Halfblood Chronicles - Andre Norton & Mercedes Lackey
Heirs of Alexandria - Eric Flint & David Freer & Mercedes Lackey
LACKEY Mercedes - Works
Shadow Grail - Mercedes Lackey & Rosemary Edghill
Tales of the Five Hundred Kingdoms - Mercedes Lackey
The Black Swan - Mercedes Lackey
The Dragon Prophecy - Mercedes Lackey & James Mallory
The Obsidian Trilogy - Mercedes Lackey & James Mallory
Valdemar Series - Mercedes Lackey
Werehunter - Mercedes Lackey
`;
 
var franchise5 = `
Alice (TV 2009)
Breakout Kings
Bunheads
Dirk Gently's Holistic Detective Agency (TV 2016)
Elementary (TV)
Firefly
Harvey Street Kids (Cartoon)
Maniac (TV 2018)
Nailed It! (TV)
Oban Star-Racers
Serenity (2005)
Timeless (TV 2016)
Wynonna Earp (TV)
Wynonna Earp (TV) RPF
`;
 
var franchise6 = `
(500) Days of Summer (2009)
13 Going On 30 (2004)
27 Dresses (2008)
50 First Dates (2004)
A Fish Called Wanda (1988)
A Walk in the Clouds (1995)
A Walk to Remember (2002)
Adventureland (2009)
Always Be My Maybe (2019)
Another Cinderella Story (2008)
Aquamarine (2006)
August Rush (2007)
Austenland (2013)
Before We Go (2014)
Begin Again (2013 Carney)
Can You Keep A Secret? (2019)
Candy Jar (2018)
Catch and Release (2006)
Chocolat (2000)
Coyote Ugly (2000)
Dirty Dancing (1987)
Eat Pray Love (2010)
Ever After (1998)
Failure to Launch (2006)
Fever Pitch (2005)
Footloose (1984)
Footloose (2011)
Forrest Gump (1994)
Four Christmases (2008)
Four Weddings and a Funeral (1994)
Ghost (1990)
Grosse Point Blank (1997)
He's Just Not That Into You (2009)
Holidate (2020)
Home Alone (Movies)
How To Lose a Guy in 10 Days (2003)
I Love You Man (2009)
I.Q. (1994)
Isn't It Romantic (2019)
It's Complicated (2010)
Julie & Julia (2009)
Just Like Heaven (2005)
Laggies (2014)
Last Christmas (2019)
Leap Year (2010)
Lemonade Mouth (2011)
Letters to Juliet (2010)
Love Actually (2003)
Love Comes Softly (Movies)
Love Rosie (2014)
Made of Honor (2008)
Maid in Manhattan (2002)
Miss Congeniality (Movies)
Music and Lyrics (2007)
Must Love Dogs (2005)
My Best Friend's Wedding (1997)
Nanny McPhee (2005)
Nerve - Jeanne Ryan
Nerve (2016)
Never Been Kissed (1999)
Not Another Happy Ending (2013)
P.S. I Love You (2007)
Penelope (2006)
Plus One (2019)
Pretty Woman (1990)
Return To Me (2000)
Romancing the Stone (Movies)
Runaway Bride (1999)
Safe Haven - Nicholas Sparks
Seeking a Friend for the End of the World (2012)
Serendipity (2001)
Set It Up (2018)
She's All That (1999)
Sierra Burgess Is a Loser (2018)
Sixteen Candles (1984)
Sleepless In Seattle (1993)
Sliding Doors (1998)
Someone Great (2019)
Something's Gotta Give (2003)
Sydney White (2007)
The Age of Adaline (2015)
The Bodyguard (1992)
The Cheetah Girls (Movies)
The Decoy Bride (2011)
The Holiday (2006)
The Jane Austen Book Club (2007)
The Lake House (2006)
The Lucky One (2012)
The Notebook (2004)
The Princess Switch (2018)
The Rebound (2009)
The Spectacular Now (2013)
The Truth About Cats & Dogs (1996)
The Way Way Back (2013)
The Wedding Singer (1998)
The Wizard Of Oz (1939)
This Beautiful Fantastic (2016)
Unicorn Store (2019)
What Women Want (2000)
Wimbledon (2004)
Working Girl (1988)
XOXO (2016)
`;
 
var franchise7 = `

`;
 
var franchise8 = `

`;
 
var franchise9 = `

`;
 
var franchise10 = `

`;
 
var franchise11 = `

`;
 
var franchise12 = `

`
 
var franchise13 = `

`;
 
var cowrangled = `
Dirk Gently's Holistic Detective Agency (TV 2016)
Firefly
Harry Potter - J. K. ROwling
Supernatural
Wynonna Earp (TV)

`;
 
// END OF SETTINGS //
 
 
// EDIT here to adjust the number of franchises you've set.
var franchise1_list = franchise1.trim().split("\n");
var franchise2_list = franchise2.trim().split("\n");
var franchise3_list = franchise3.trim().split("\n");
var franchise4_list = franchise4.trim().split("\n");
var franchise5_list = franchise5.trim().split("\n");
var franchise6_list = franchise6.trim().split("\n");
var franchise7_list = franchise7.trim().split("\n");
var franchise8_list = franchise8.trim().split("\n");
var franchise9_list = franchise9.trim().split("\n");
var franchise10_list = franchise10.trim().split("\n");
var franchise11_list = franchise11.trim().split("\n");
var franchise12_list = franchise12.trim().split("\n");
var franchise13_list = franchise13.trim().split("\n");
 
var cowrangled_list = cowrangled.trim().split("\n");
 
(function($) {
 
        var all_fandoms = $(".assigned tbody tr");

    // check if user has applied alternating row colors to the table
    let alternating_rows = false;
    if (all_fandoms.eq(0).css("background-color") !== all_fandoms.eq(1).css("background-color")) {
      alternating_rows = [
        all_fandoms.children("th[scope='row']").eq(0).css("background-color"), // odd fandom name columns
        all_fandoms.eq(0).css("background-color"), // odd tag columns
        all_fandoms.children("th[scope='row']").eq(1).css("background-color"), // even fandom name columns
        all_fandoms.eq(1).css("background-color") // even tag columns
      ];
    }
 
	// label fandoms with franchise, cowrangled, and unwrangled status
    all_fandoms.each(function() {
        var fandom_name = $(this).find("th").text();
		var unwrangled_counts = $(this).find("td").slice(3, 6).text();
 
        // EDIT here to adjust your number of franchises
		// The relevant section for each franchise
		// starts with 'else if'
		// and ends with the first '}' that follows.
		if (franchise1_list.includes(fandom_name)) {
		    $(this).addClass("franchise1-fandom");
		} else if (franchise2_list.includes(fandom_name)) {
			$(this).addClass("franchise2-fandom");
		} else if (franchise3_list.includes(fandom_name)) {
			$(this).addClass("franchise3-fandom");
		} else if (franchise4_list.includes(fandom_name)) {
			$(this).addClass("franchise4-fandom");
		} else if (franchise5_list.includes(fandom_name)) {
			$(this).addClass("franchise5-fandom");
		} else if (franchise6_list.includes(fandom_name)) {
			$(this).addClass("franchise6-fandom");
		} else if (franchise7_list.includes(fandom_name)) {
			$(this).addClass("franchise7-fandom");
		} else if (franchise8_list.includes(fandom_name)) {
			$(this).addClass("franchise8-fandom");
        } else if (franchise9_list.includes(fandom_name)) {
            $(this).addClass("franchise9-fandom");
        } else if (franchise10_list.includes(fandom_name)) {
            $(this).addClass("franchise10-fandom");
        } else if (franchise11_list.includes(fandom_name)) {
            $(this).addClass("franchise11-fandom");
        } else if (franchise12_list.includes(fandom_name)) {
            $(this).addClass("franchise12-fandom");
        } else if (franchise13_list.includes(fandom_name)) {
            $(this).addClass("franchise13-fandom");
        } else {
            $(this).addClass("other-fandom");
        }
 
		if (cowrangled_list.includes(fandom_name)) {
			$(this).addClass("shared-fandom");
		} else {
			$(this).addClass("solo-fandom");
		}
 
		if (unwrangled_counts == "   ") {
			$(this).addClass("no-unwrangled");
		}
    });
 
    // add toggle menu
	// EDIT here to adjust the code to your number of franchises
	// as well as what the toggles are to be labeled with inside the [ ].
    // To save space, I abbreviated "Shared Unwrangleds" as UW, "Solo Unwrangleds" as uw,
    // "All Unwrangleds" as New, and "All Fandoms" as All.
    $("#user-page table").before("<p id='filter-fandoms'>Filter:&nbsp; &nbsp;" +
								 "<a id='franchise1'>[Main]</a>&nbsp;&nbsp;" +
								 "<a id='franchise2'>[Hozier]</a>&nbsp;&nbsp;" +
                                 "<a id='franchise3'>[Kylux]</a>&nbsp;&nbsp;" +
                                 "<a id='franchise4'>[Lackey]</a>&nbsp;&nbsp;" +
								 "<a id='franchise5'>[TV]</a>&nbsp; &nbsp;" +
								 "<a id='franchise6'>[Rom-Coms ETC]</a>&nbsp;&nbsp;" +
								 "<a id='shared-unwrangled'>[Shared UW]</a>&nbsp;&nbsp;" +
                                 "<a id='solo-unwrangled'>[Solo UW]</a>&nbsp;&nbsp;" +
                                 "<a id='all-unwrangled'>[All UW]</a>&nbsp; &nbsp;" +
                                 "<a id='all-fandoms'>[All]</a>" +
                                 "</p>");
 
    // add toggle functions
    function add_toggle(toggle_class, ...classes_to_hide) {
        $(toggle_class).click(function() {
            all_fandoms.show();
            classes_to_hide.forEach(function(class_to_hide) {
                $(class_to_hide).hide();
            });
  // reapply alternating colors if applicable
            if (alternating_rows) {
              // fun fact, in jQuery the indexes are 0-based so the even/odd designations are backwards from vanilla CSS
              all_fandoms.children("th[scope='row']:visible:even").css("background-color", alternating_rows[0]);
              all_fandoms.filter(":visible:even").css("background-color", alternating_rows[1]);
              all_fandoms.children("th[scope='row']:visible:odd").css("background-color", alternating_rows[2]);
              all_fandoms.filter(":visible:odd").css("background-color", alternating_rows[3]);
            }
            $("#filter-fandoms").find("a").css("font-weight", "normal");
            $(this).css("font-weight", "bold");
        });
    }
 
	// EDIT here to adjust to your number of franchises
	// All the strings that start with . are the exclusion filters.
	// For each toggle you need to exclude all the other franchises,
	// meaning that they need to have all the numbered franchise-fandom labels
	// that do not have the same number as the #franchise part
	// as well as the other-fandom label.
	// Every numbered franchise-fandom label needs to be listed
	// in the exclusion filters that come after #others
	add_toggle("#franchise1", ".franchise2-fandom", ".franchise3-fandom", ".franchise4-fandom", ".franchise5-fandom", ".franchise6-fandom", ".franchise7-fandom", ".franchise8-fandom", ".franchise9-fandom", ".franchise10-fandom", ".franchise11-fandom", ".franchise12-fandom", ".franchise13-fandom", ".other-fandom");
    add_toggle("#franchise2", ".franchise1-fandom", ".franchise3-fandom", ".franchise4-fandom", ".franchise5-fandom", ".franchise6-fandom", ".franchise7-fandom", ".franchise8-fandom", ".franchise9-fandom", ".franchise10-fandom", ".franchise11-fandom", ".franchise12-fandom", ".franchise13-fandom", ".other-fandom");
	add_toggle("#franchise3", ".franchise1-fandom", ".franchise2-fandom", ".franchise4-fandom", ".franchise5-fandom", ".franchise6-fandom", ".franchise7-fandom", ".franchise8-fandom", ".franchise9-fandom", ".franchise10-fandom", ".franchise11-fandom", ".franchise12-fandom", ".franchise13-fandom", ".other-fandom");
	add_toggle("#franchise4", ".franchise1-fandom", ".franchise2-fandom", ".franchise3-fandom", ".franchise5-fandom", ".franchise6-fandom", ".franchise7-fandom", ".franchise8-fandom", ".franchise9-fandom", ".franchise10-fandom", ".franchise11-fandom", ".franchise12-fandom", ".franchise13-fandom", ".other-fandom");
	add_toggle("#franchise5", ".franchise1-fandom", ".franchise2-fandom", ".franchise3-fandom", ".franchise4-fandom", ".franchise6-fandom", ".franchise7-fandom", ".franchise8-fandom", ".franchise9-fandom", ".franchise10-fandom", ".franchise11-fandom", ".franchise12-fandom", ".franchise13-fandom", ".other-fandom");
	add_toggle("#franchise6", ".franchise1-fandom", ".franchise2-fandom", ".franchise3-fandom", ".franchise4-fandom", ".franchise5-fandom", ".franchise7-fandom", ".franchise8-fandom", ".franchise9-fandom", ".franchise10-fandom", ".franchise11-fandom", ".franchise12-fandom", ".franchise13-fandom", ".other-fandom");
	add_toggle("#franchise7", ".franchise1-fandom", ".franchise2-fandom", ".franchise3-fandom", ".franchise4-fandom", ".franchise5-fandom", ".franchise6-fandom", ".franchise8-fandom", ".franchise9-fandom", ".franchise10-fandom", ".franchise11-fandom", ".franchise12-fandom", ".franchise13-fandom", ".other-fandom");
	add_toggle("#franchise8", ".franchise1-fandom", ".franchise2-fandom", ".franchise3-fandom", ".franchise4-fandom", ".franchise5-fandom", ".franchise6-fandom", ".franchise7-fandom", ".franchise9-fandom", ".franchise10-fandom", ".franchise11-fandom", ".franchise12-fandom", ".franchise13-fandom", ".other-fandom");
    add_toggle("#franchise9", ".franchise1-fandom", ".franchise2-fandom", ".franchise3-fandom", ".franchise4-fandom", ".franchise5-fandom", ".franchise6-fandom", ".franchise7-fandom", ".franchise8-fandom", ".franchise10-fandom", ".franchise11-fandom", ".franchise12-fandom", ".franchise13-fandom", ".other-fandom");
    add_toggle("#franchise10", ".franchise1-fandom", ".franchise2-fandom", ".franchise3-fandom", ".franchise4-fandom", ".franchise5-fandom", ".franchise6-fandom", ".franchise7-fandom", ".franchise8-fandom", ".franchise9-fandom", ".franchise11-fandom", ".franchise12-fandom", ".franchise13-fandom", ".other-fandom");
    add_toggle("#franchise11", ".franchise1-fandom", ".franchise2-fandom", ".franchise3-fandom", ".franchise4-fandom", ".franchise5-fandom", ".franchise6-fandom", ".franchise7-fandom", ".franchise8-fandom", ".franchise9-fandom", ".franchise10-fandom", ".franchise12-fandom", ".franchise13-fandom", ".other-fandom");
    add_toggle("#franchise12", ".franchise1-fandom", ".franchise2-fandom", ".franchise3-fandom", ".franchise4-fandom", ".franchise5-fandom", ".franchise6-fandom", ".franchise7-fandom", ".franchise8-fandom", ".franchise9-fandom", ".franchise10-fandom", ".franchise11-fandom", ".franchise13-fandom", ".other-fandom");
    add_toggle("#franchise13", ".franchise1-fandom", ".franchise2-fandom", ".franchise3-fandom", ".franchise4-fandom", ".franchise5-fandom", ".franchise6-fandom", ".franchise7-fandom", ".franchise8-fandom", ".franchise9-fandom", ".franchise10-fandom", ".franchise11-fandom", ".franchise12-fandom", ".other-fandom");
    add_toggle("#other", ".franchise1-fandom", ".franchise2-fandom", ".franchise3-fandom", ".franchise4-fandom", ".franchise5-fandom", ".franchise6-fandom", ".franchise7-fandom", ".franchise8-fandom", ".franchise9-fandom", ".franchise10-fandom", ".franchise11-fandom", ".franchise12-fandom", ".franchise13-fandom");
    add_toggle("#shared-unwrangled", ".solo-fandom", ".no-unwrangled");
    add_toggle("#solo-unwrangled", ".shared-fandom", ".no-unwrangled");
    add_toggle("#all-unwrangled", ".no-unwrangled");
    add_toggle("#all-fandoms");
})(jQuery);