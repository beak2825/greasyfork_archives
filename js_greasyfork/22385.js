// ==UserScript==
// @name        RegexPuzli
// @namespace   http://wifi.com
// @match       https://regexcrossword.com/playerpuzzles
// @version     17.7
// @author   Hamid
// @grant    GM_getValue
// @grant    GM_setValue
// @grant    GM_xmlhttpRequest
// @grant    GM_openInTab
// @description regex puzzle helper for myself
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/22385/RegexPuzli.user.js
// @updateURL https://update.greasyfork.org/scripts/22385/RegexPuzli.meta.js
// ==/UserScript==

var script_link = "https://greasyfork.org/en/scripts/22385-regexpuzli/code/regexpuzli.user.js";

var unSolvable = ["", "", "", "", "", "Ave, maria", "Escola", "TEOCOMP - Materia Dificil", "computerscience", "qwe", "/ __ \\", "Vitor.nat"];

var Solved = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "Easy Try", "Get close", "All encompassing", "Swing", "Not a command", "Another year of Regex", "Macmillian said this? Around 1950?", "minimal suduko (2^2: four boxes of four)", "car park fun!", "You Come Find Me", "Popoi", "Teoria da computação", "They", "Fenda do biquini", "Zen Python", "the problem...", "Trabalho2TeoComp", "For all A,B in Boolean", "Old vowels", "Pioneers in Computer Science", "Difficult to tell how long it will take, umm", "Don 't", "edible economics", "6LETTERS", "Nintai", "Speller Meta", "TRAB-2-PROBL-1", "Cwaiandt26", "TEOCOMP_EPC", "ny rez", "Pequeno Príncipe", "Natural Airbourne Fertilizer.", "MPCA - Merry Xmas", "Another Sort of Challenge", "Week 9 R Homework Puzzle", "What's green on the outside and yellow on the inside?", "a hard truth", "BBM", "Daniel", "What‘s \\w and \\d ?", "MyFirstRegex", "hexi", "Who am I?", "Some love for word boundaries", "Weekend", "Matterhorn", "Starter pack", "Jazz", "mmdr0x", "mmdr0x-v2", "Mysterious Dad", "Seussisms", "Secret Council of /(\\b[plurandy]+\\b ?){2}/i", "All about you", "Just Roll With It", "GC8ECNF", "What motivates adventurers", "Searching Soul", "Paul's guide", "Zer0 Wing", "...oh!", "xoxo", "a88356", "Hacking Terms", "Timeout Tale", "Luò Shū", "C3G", "default", "sicamp.k", "Till Jenny", "IU", "Now I Know My ABCs", "A88352", "196", "Countries", "Identification", "Easy Peasy Lemon Squeezy", "Easter Eggs Hunting", "ICE ICE BABY", "Mate in 2", "Teenage Fun", "Response", "DisneyRC", "The hangman", "Walk the path", "Capture the Flag '22: Hint 5", "Louxor", "HackPack CTF 2021: Regex World!", "H 2022", "Amongla", "It's_right_here!", "For The Achievement", "VOOR MICHEL", "My First Palindromeda", "tumbler by Kelly Boothby", "Test Mob Test", "R2S Again", "Chess", "regular expressions", "I don't even know", "Sudo Ku", "Christmas Puzzle 2021", "ur the best gift i could ever wish for", "The Elvish Word for Friend", "Guess my baby", "RHDDG", "IDK", "give me five", "COINS", "help 1", "google him", "Hi", "Agile Consultants", "r2s", "Tree Again", "Eggs", "Kinda Binoxxo 10x10", "Nonogram", "biobio", "Heap", "Tree", "Nuf", "Inconspicuous Message", "testa", "FFF", "Grammarly Regex Crossword (JavaScript fwdays’21)", "On The Water", "In The Clouds", "Nothing to see here", "I'm so sorry...", "Famous Constant", "Programming Language", "Smash of a keyboard", "LITLKEBIC", "Entendedores entenderão", "Prime Time", "goldPot", "I prepared", "BIRTHDAY PUZZLE", "Indescribeable Terror", "MLEM", "How I feel about this", "White City", "WHO?", "Wilbur Soot Lyrics", "Food", "Numbers", "tt", "Yr12 Christmas Quiz 1", "Yr12 Christmas Quiz 2", "A FGA", "O que um aluno quer?", "Yr12 Christmas Quiz 3", "Let's jam!", "CompSci Christmas 2020", "2021", "mystery of life", "personal practice puzzle", "Oh man...", "No. escape", "Chasing The Pangram", "Grammarly Regex Crossword", "OOTS #3", "OOTS #1", "Q4", "State of Starcraft", "OOTS #4", "Q3", "Q8", "Q5", "Q6", "Q7", "OOTS #2", "Q2", "TT2 1", "Q1", "Mensagem", "Strange Business", "Think about it", "1789", "Basics maths (easy)", "Hello", "religious animals", "Classic Game", "Quick", "link to a song - very hard", "Tranquility base, there goes the neighborhood; Have you seen the....", "Ciao", "Romeo and Juliet", "Surprisingly Holy?", "Sneaky", "Simple Common", "Everybody knows it", "Friendly reminder", "Final minipuzzle", "Smily Face", "AB", "Brain", "HHS", "Worldwide Crisis!", "SudoRegEx", "JavaScript Bankok 1.0.0 #3", "JavaScript Bangkok 1.0.0 #5", "JavaScript Bangkok 1.0.0 #4", "JavaScript Bankok 1.0.0 #1", "JavaScript Bangkok 1.0.0 #2", "JavaScript Bangkok 1.0.0 #7", "JavaScript Bangkok 1.0.0 #6", "A Simple Refresher", "Trying it out", "Duke", "How do you create regex?", "Regex", "Commemorative", "Hex-Hex", "Swag Hunt Puzzle", "Melody transmission to Love and Freedom", "Storage #2", "Undone by the barista", "Streets of Ranges", "3D Base", "A Man Is Not Dead", "On such a winter's day", "Make mine a '99", "Binary scaling of transendentals 32 bit", "Bad english 'Vers Carte' 1 / 2", "Song Quote Bonus - Happy New Year", "SudoRegEx 2", "Bad english 'Vers Carte' 2 / 2", "Siberian Husky", "Math Lab", "frev and not frev", "KTest", "A good and old trip since 1982", "Best Piano piece ever!", "Area-51", "Ignore the commute", "Puzzle Mania for normals :)", "Heng's Nightmare", "Read it out loud", "The infinite blaze", "Tutorial #7 - Master Crosswords", "Straight Block Crosswords", "Tutorial #4 - Intermediate Crosswords", "Tutorial #6 - Advanced Crosswords", "Boss Challenge #5 - Knight of Puzzles", "League Challenge #1 - Preliminary Round 1", "League Challenge #4 - Preliminary Round 4", "Tower 1 - Entrance 4", "Tutorial #3 - Intermediate Crosswords", "League Challenge #2 - Preliminary Round 2", "Trial Challenge #1 - Basic Trials Crosswords", "Beginner #2 - Intermediate Crosswords","Definitely not an analysis aid", "Tower 2 - Entrance 1", "Tutorial #2 - Basic Crosswords", "Expert #1 - Basic Professional 1", "Tower 1 - Entrance 1", "Tower 1 - Entrance 2", "Tower 1 - Entrance 3", "Tutorial #1 - Basic Crosswords", "Boss Challenge #3 - Bishop of Puzzles", "Boss Challenge #1 - King of Puzzles", "Boss Challenge #2 - Queen of Puzzles", "Tower 2 - Entrance 2", "Boss Challenge #4 - Rook of Puzzles", "Tower 2 - Entrance 3", "Hard starter", "TTT", "Why you crying?", "Spade", "@WithYourSquad Gift Mug", "Your present is a...", "the resolution of uncertainty", "Burger", "Japanese", "Chips", "Nostalgia", "Take the sh out of it", "Batsy", "Coffee", "Apple Is So Nice", "DY First of this kind", "Old Latin Square", "Taco Cat", "Nina D's face", "Painful politics", "Walaszek", "Storage #1", "8 Hobbits", "Liberal Arts", "Be nice", "Syncron", "I'm on a boat", "Frev2", "Botany", "Hydroponics for beginners", "Easy bee", "Hobbies", "3x3 is easy", "YTCTF", "What this is. Really.", "A habitable zone within 30 years", "Lost", "Wilde opinion", "Tutorial #5 - Advanced Crosswords", "League Challenge #3 - Preliminary Round 3", "Beginner #3 - Advanced Crosswords", "Tutorial #8 - Master Crosswords", "Trial Challenge #2 - Intermediate Trials Crosswords", "Trial Challenge #3 - Advanced Trials Crosswords", "Expert #2 - Basic Professional 2", "Word and Abbreviation Crosswords", "Beginner #1 - Basic Crosswords", "psychoactive", "Wind Power", "My first puzzle","Edward III", "My square puzzle", "4BB", "The One", "HEAT", "Accident waiting to happen", "Arrhenius", "NOT NOT A Rare Earth Metal", "Rule 1", "likely to smash up nice/pretty things too", "Will it blend?", "Alphabutt", "Chromosomes", "I don't know what to put here", "^ACID$","Eva, tell me", "Tricky PHP puzzle", "6 Times", "Wind Power ", "Nani Nani", "Robert Iskasosn", "Best game ever!", "3-SAT", "Protactinium", "TWICE", "As easy as ABC", "twice2", "Easy alphabet", "Do you wear glasses?", "ALEXIS'S RARE EARTH METALS", "rare earth metals", "Smelly!", "Animal", "Arrhenius (Lucas)", "Not hard API", "OUTPUT2019", "twice3", "TWICE-NEW SONG", "OLX", "TWICE4","Only_lookaheads_(simple)", "Jumpman's on the move", "Strong", "Potherca Puzzle 1 - Ready or Not?", "HappyBirthday", "Shout of the diaspora!", "Oh WHY?", "Foggy visitors (action packed)", "QRNG", "Unseen", "Spiral with primes", "My username elsewhere v1.0 (ignore the CH when unscrambled)", "Tetromino nonogram", "Desafio", "Self-defined", "Kings Viking 2019", "Tab", "flip flop", "Challenge 1 - Puzzle 3", "NOT an instrument", "Challenge 1 - Puzzle 2", "Challenge 1 - Puzzle 1", "Easiest Puzzle Ever", "Sample Puzzle 1", "ushtutorial1", "CompSci Christmas", "icpc puzzle 0", "icpc puzzle 1", "HELP", "lol", "Artifact", "DurHack-2018-p1", "Ignis-Terra-Aer-Aqua", "Laura Krueger", "doo doodoo doooooo", "OLKA01", "Rock'n'Roll", "Greatest Puzzle", "Brazil", "sample", "achiEvEmEnt", "WIP", "Be a winner", "Slogan", "BBC Radio4 Puzzle", "Random Stuff", "Brainfuck says what we like most", "Chris Johnson has...", "&lt;ilx:hacks /&gt;", "City and also language", "aba", "Delivery courier", "From beginning.", "Flaming Chalice", "fortSQ", "Euler's Negative One", "Spycursion Challenge @ PAX West", "KW75", "Pretty good", "Phase Alternating Line --- or the maths behind old analogue TV", "U Make Me Feel So Good", "Incredibly easy and boring", "SATOR", "purple", "Lost In Space", "Bad for your sanity", "Testeyuri", "Preston park, nr clock tower, tuesdays in the summer", "Easy as...", "Testing testing lovely testing 2", "Super Hard Puzzle", "Number ?", "Max Fan Regex Crossword", "Rare Earth Metal that is not Lithium by Parker", "Rare Earth Metal", "TomomiMetal", "High-stability atomic clocks", "Singapore", "The BEST rare earth metal", "It's Henry's Rare Earth Metal!", "super powers", "Rare Earth Metals (Vaskar)", "rareearthmetals", "MaddysMetal", "ClassMay", "The Magic Word", "electrical measurement of water purity", "A draw", "failure mode analysis", "Bible basher", "Really saying something!", "Questions?", "Wunsch", "A Perfect Match", "Simple binary fun", "Triple fun", "Quick answer", "All-in", "I'm new here", "Scala Traits I Like", "Regexide Geocache", "Limerick Maths", "Shift Cryptosecurity", "Schoolboy prank for today", "Most hated in the nation (only joking)!", "Old Fortune", "2020", "Should be enough", "The Queen's Command!", "Oh oh", "Cover Your Bases", "Big Word Speaker", "Github", "One Extra Credit Please", "Movies (Unambiguous)", "Participation Puzzle", "CS 330 Puzzle!", "Ruzzle Puzzle Smuzzle Duzzle", "330 Regexp Puzzle", "compliment", "F00D", "Class", "Participate", "News", "series", "NICE", "mot-croisé", "Tester (Unambiguous)", "1l1", "On The Radio (EASY)", "Enigma", "11:11pm", "This is a puzzle", "CS 330 Participation Point", "PL2018 (Unambiguous)", "Rachel's Puzzle", "Conspiracy", "Riley Pikus", "Seven", "A Sick Puzzle, My Dudes", "Radiohead / Plastic (unambiguous)", "Question", "Trump's Promise", "Caesar", "Easy Padawan", "First tryyyyyyyyy", "λ (Unambiguous)", "Unbelievable", "Damn SIEM", "Consciousness transfer pioneer", "blue-rabbit", "Positive Look-Ahead (Unambiguous)", "De Saison (Corrected)", "Nokia T-Shirt 2018", "Crash", "Sentence Shout", "Wishes", "Like a VGA plug", "Byte-sized", "Clearly...", "TD", "LauzHack 2017 #0", "LauzHack 2017 #1", "Puzzles - unambiguous", "Happy Birthday!", "A very hard puzzle (wink wink)", "hello /sci/ (conv to lc)", "The answer is on a bridge in Dublin", "FIT LAN", "Greetings", "Screen-door effect", "Underscore", "Vowels", "Sample Puzzle", "Employee mandatory 2019", "VV Engineering Challenge #2", "four times four cells", "Childish way of talking!", "Can you give us a statement?", "Off the coast of Lancing, UK", "ASCII flowers", "regex magic!", "OLD Skool", "common street drug / industrial solvent", "Cheap date", "By any other name !", "Hurdy Gurdy", "commmon street drug", "FAV LANG", "Invisible danger", "2012", "It's a start", "KSMG", "N3C3$$4RY  ..::KNOWNLEDGE::...", "CSGO", "X-Y-Z 5x5", "X-Y-Z 6x6", "TGI Puzzle 3", "TGI Puzzle 2", "TGI Puzzle 4", "SLayer", "The best time", "X-Y-Z 4x4", "Overflow", "TGI Puzzle 5", "BBC Radio 4 - Puzzle No. 3 – Wednesday 5 July", "fino", "TGI Puzzle 1", "BBC Radio 4 (typo fixed)", "PuzzleBuild", "joeys test", "Owerflow", "Uniambiguous Sodoku", "Cutting Edge Field", "Round and round", "Circlular", "The Answer To Every AI Question", "(?:[C-Z]|[0-9])+([F-P][A-I])(?:[E-V]){1,5}([^E-V]){1}(\\2)*(?:[^A-D]|[^E-Z])([^L-S])+(?:[L-R]|[^A-E])*(\\1)?([0-9]+|[^A-F])+", "Adam Soudglas", "The End-Picross", "hvgh", "Welcome to RegEx (Redux)", "Spirit", "Named Puzzle", "solution middle row (char 2, 4 and 7 lowercase)", "42", "Binary frenzy", "Going Somewhere?", "References not available upon request", "Superimposed infinity", "Zero point of painting", "Star wars day 2017", "Leaning toothpick syndrome", "5²", "CAPITAL", "Honoretis mortuos et eorum memineritis", "SHES SO TOUGH", "Welcome To The Game", "∞", "\"Quinque\" Sodoku", "Cupid's Arrow", "3X3 Test REGEX", "3x3 Crossword", "EOC", "Capital city (2)", "Capital city", "Geocaching 2", "To Multe", "Royal Game", "GEOCACHING", "CS330","Baby Steps", "Sun destination", "Beam Me Up, Scotty!", "Quem Aguenta", "Logo", "Code", "K4", "Fibonacci", "Morse", "From 2013 MIT Mystery Hunt, by Dan Gulotta, Palmer Mebane", "The Beast", "The Matrix", "Prized Norse Possession", "I dare you","Word Character Class","Full Recursion","Checkmate, Atheists","References","This one is trivial.","Julius Caesar","Morse 2016","Mayan Calendar","[Hexagonal] Regex Math","Inception","\"5\" in Latin is \"quinque\".","Some Assembly Required","Test your Meta","Pipe Mania","Letter","A Game of Cat and Mouse","Quantum Mechanics.","Simple Crossword","Hex Recursion","O'reilly? The book might be Han(j|d)ie!","Binary","Regex Picross","What are you?","Hexagonal Tests","An Irrational Number, Part 2","An Irrational Number","Shakespeare","Boat","You('ve)? got","Trap","The Great Escape","A Culture of Death","What the hell?","An Irregular Expression","British Rock","Do you see it?","Good ol' days...","Cryptosum","Before and After","Ships","An Irrational Number, The End","Prime puzzle","Regular Express+ion","punctuation","Minicross","Song Quote 1/3","Do you want a *slurp* picross?","Invade mecross","puzzle","An Irrational Number, The Final Chapter","Brain Fucking","confession","Now you see me....... not!","Sudoku","Daddy ?!?","Wisdom from a little green man.","Like a Record","Seek and You Shall Find","GiveUp Face","From Hoban","Louss-Yeah","Programmer's source of wisdom","American Standard Code for Information Interchange","King of pop","Song Quote 3/3","Hex-Tex","Testing Initiative","███████","Love", "Days are boring","The Ethic","Zen Quote I","The worst in the universe.","Random","Just Symbols","Thue–Morse","Shapes","Pan Galactic","A Beginning","Why would anyone even try?","Any Question?","Shirt concept","Star Wars","Shinny and Precious","Interesting","Single Celled Organism","They came from... outer space.","Can you pattern match?","Exterminate","Off with his head!","Things to Watch Out For (WIP)","I Wanted Orange","Ambiguity (almost) killed the cat","The King !","SQL","Hardly ambiguous","Turning About","Shall You Name Him?","Sultana","Wordsmith Math","151","Audrey!!","Small magic square","Unlucky","Django Con Budapest 2016","Assertion and back referencing","Baby sudoku","Mitnick","Linkage","Seasonal 2","Song Quote 2/3","lettres","SO 60's","Decent","Jabberwocky","Alan Perlis","Zen Quote II","X marks the spot.","Decipher This","Simple and Odd","RPN","Is it?","4x4 from Goobix.com","First line [RERATE plz]","Nothing like Jelly","Ctrl + ←","Just do it!","Over a barrel","Double Helix","Bawth","Beehive","Doggis Puzzle","Space","I Double Dare You","Hardware Hacking","(Hello){2}","URL kokota","ghus","This will literally kill you","The reason why we are here","Glider","Tic Tac Toe","Disposition","Music time","BT and GE","Lea la consigna","Concurrency","Sapphire Red","Puzzle Is a Six Letter Word","I Am Your Father!","Revolution","I tried !","Fear","Unsafe SQL","Bunny","50%","Retro","proverb","Zero Wing","Gotta try'em all!","Bruce Lee","Binario 2","Potus","It's...","Achievement Unlocked!","The Devil","Country","Occam's razor","Beruf","Spock","Merry Christmas!","These are their...","Danger","Current affairs","You Panicked",":)","Faithful Companion","Two blondes on way to ZOO saw a sign: \"ZOO left\". So....","Do you?","Peace","Hitchhiker","Evolution","Extra Shot","Simple pzl","OH-YA!","Two swords","Be a hero","HAL o","In the advent of patch","nsVicertPuzzle","Thinking is key","Circle","Binary Bee","Beginnings","Blind","Simple","In the advent of patch 2","DNA","Talupema","Tic-Tac-Toe","My Favorite Language","Want your girl to learn regex?","Fan Favorite","Seasonal!","OS Services","The best OS for a geek...","Ted","Gimli","Warhammer 40k","gvhygh","Dr Suess","Symphonic metal","SO","Parallel","A Sunny Disposition","Nice Network Providerv1","Saddle Club","Eat it!","How Long","BSD UNIX","State 1: Beyond the Blue Horizon","A Friend","State 4: Zimmerland","State 8: Old Man Fall Down","Free source","KOBE","State 6: 2 Shades of Blue","GeoRegExp Puzzle","MYTOWN","frist try","1 field and so much pain","Bedtime Story","drink me","{{user.name}}","Say hi!","Sleep robot","Floaty","GNU Project","name of the magazine that showed the KERNELL to the world","Puzzzzzle","Showing Off","For Miss G","State 5: Find the Key","State 3: Needle in a Haystack","Regexcrossword 3X3","Pushing","Between us","Magic","Quickie","optimistic","War, war never changes ...","ANN3","SimpleRegex","State 2: How Much Fun Can You Bear?","Binario","True or false","agav","ANN2","Enjoy","State 7: Norman and Arlo","SAO","2BA Ecam 14094","FIRST PUZZLE","Hexagony","Alpha","Grilled meat","Your Reddit Gifts puzzle","Check it already!","Get the extinguisher!","Exercici 3","One","The feels","simple but hard","A martial art","BiPi","Use the force Luc","ANN1","Hi, /g/!","Snail","My simple","Who you gonna call?","Guris","Unix Sistemas Operativos","#1 First Built","Unique puzzle","Find a tour","Armen","L0v3 it","Short message","[]","Yolo !","Ecam_puzzle","Exercici 2","Simple metacharacter","Harrison","Who am I ?","just a start","The Professor","For Beginners","xkcd 1137","Take 1","ALPHABET","There can only be...","Bling","Basic Intro","gttnnn","Z|F","i/o","First test","CLIC Egg Hunt 2016 #2","ECAM 14055 2BA","xzo","XO","Easy","Test puzzle","Exercici 1", "The One and Only","First","www","Easy A","Chive","666","HELLO WORLD","My First Test","The obnoxiously easy puzzle.","1","Very Easey","Very Simple", "&lt;3","Can't make it without \\u","Regex Test No.1: Regex for test times match[次数匹配]", "seeker's weapon", "Nevermore", "Buddha", "It's All Greek To Me", "Singularity", "Perl programmer", "PageToken", "Hello Group", "Puzzle #8", "Bifronte (By Yohel Muñoz)", "Colores2", "Lanzas de combate", "Kickass Developers", "JSON", "Easy peasy", "LauzHack 2016", "'Tis The Season", "*.*", "Blue Collar Comedy", "Avatar", "Fight Club", "If you had a fast car", "Fix it now!", "Quickie 2", "Age of man"];

unsafeWindow.console.log ("Solved:" + Solved.length);

setTimeout(callFunc, 5000);

//setTimeout(calculate, 10000);
function calculate(){
   var link = document.getElementsByTagName('a');
   var summa = "";
  for (var i = 0; i < link.length; i++){
    summa+= "\""+link[i].innerHTML+"\",";
  }
  alert(summa);
}
function callFunc(){
  removeSolved(Solved);
  paintUnsolvable(unSolvable);
}

function removeSolved(arr){
  var link = document.getElementsByTagName('a');
  for (var i = link.length-1; i >=0 ; i--) {
      if(Contains(arr,link[i].innerHTML)){
           link[i].parentElement.parentElement.parentElement.removeChild(link[i].parentElement.parentElement);
       }
  }
}

function paintUnsolvable(arr){
  var link = document.getElementsByTagName('a');
  for (var i = link.length-1; i >=0 ; i--) {
      if(Contains(arr,link[i].innerHTML)){
          link[i].style.backgroundColor = "grey";
          link[i].style.color = "red";
       }
  }
}

function Contains(arr, str){
  for(var j=0;j<arr.length;j++){
    if(arr[j]==str) return true;
  }
  return false;
}


function updateCheck(forced)
{
    if ((forced) || (parseInt(GM_getValue('SUC_last_update', '0')) + 86400000 <= (new Date().getTime()))) // Checks once a day (24 h * 60 m * 60 s * 1000 ms)
    {
        try
        {
            GM_xmlhttpRequest(
                {
                    method: 'GET',
                    url: script_link,
                    headers: {'Cache-Control': 'no-cache'},
                    onload: function(resp)
                    {
                        var local_version, remote_version, rt, script_name;

                        rt=resp.responseText;
                        GM_setValue('SUC_last_update', new Date().getTime()+'');
                        var re = /@version\s*(.*?)\s/m;
                        remote_version=parseFloat(re.exec(rt)[1]);
                        local_version=parseFloat(GM_getValue('SUC_current_version', '-1'));
                        if(local_version!=-1)
                        {
                            script_name = (/@name\s*(.*?)\s*$/m.exec(rt))[1];
                            GM_setValue('SUC_target_script_name', script_name);
                            if (remote_version > local_version)
                            {
                                if(confirm('There is an update available for the Greasemonkey script "'+script_name+'."\nWould you like to go to the install page now?'))
                                {
                                    GM_openInTab(script_link);
                                    GM_setValue('SUC_current_version', remote_version);
                                }
                            }
                        }
                        else {GM_setValue('SUC_current_version', remote_version+'');}
                    }
                });
        }
        catch (err)
        {
            if (true){
                alert('An error occurred while checking for updates:\n'+err);
            }
        }
    }
}

updateCheck();