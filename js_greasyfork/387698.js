// ==UserScript==
// @name         ShipNameBaptism
// @namespace    https://greasyfork.org/en/scripts/387698-shipnamebaptism
// @version      1.0
// @description  Establish public and private name lists for current ships.
// @author       hijk.planets@gmail.com
// @homepage     https://greasyfork.org/en/scripts/387698-shipnamebaptism
// @resource     userscript https://greasyfork.org/en/scripts/387698-shipnamebaptism
// @license      Lesser Gnu Public License, version 3
// @include      http://planets.nu/*
// @include      https://planets.nu/*
// @include      http://*.planets.nu/*
// @include      https://*.planets.nu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387698/ShipNameBaptism.user.js
// @updateURL https://update.greasyfork.org/scripts/387698/ShipNameBaptism.meta.js
// ==/UserScript==
/*- --- --- - - --- --- ---- - - --- --- --- ---- - - - --- - -- -- ---- - - --- -
//- --- --- - - --- --- ---- - - --- --- --- ---- - - - --- - -- -- ---- - - --- -

Title: Baptismal Font of Eternal New Ship Names and Warrior Virtues of Victory

Description: ShipBaptism provides a mechanism to easily rename all of your ships.
   If you like HOST's default use of hull names, this plugin is not for you. Read
   no more. But if you would like to have the power to quickly change your ship names
   at a tactical moment (best lines from Die Hard I, II and III) or sow confusion amongst your
   enemies (best polynesian cocktails), or honor the brave who have fought before you
   (using the top leaderboard player names for the Evil Empire),
   here's what ShipBaptism does:
   (1) Allows for ships on the starmap while you are working on your turn to display
        tactical and informative labels for you. Then when your turn is complete,
        you can swap ship name lists (saving your tactical list and loading one
        of the the other warrior lists of glory and righteous vengenace).
   (2) Maintains 9 internal shipname lists that you create and can modify.
   (3) Stores 4 long lists (fully editable) to be used as name sources for ships
        - current defualt lists included by way of example:
             Russian Field Marshalls, 1700-1915
             Metallica Song titles
             Java Error Codes
        - input your own as comma separated lists
   (4) Stores 4 short lists of words that can be randomly combined into names
        - recombinatorial diversity, 3 lists of 10 words = 1,000 unique names (10^3)
        - current default lists included by way of example:
             internal organ colors
             forces of nature
             calamitous events & supernatural powers
        -input your own as comma separated lists
   (5) SPOOF your ships with other hull names and control the race (or combo
        of races) and tech levels of hulls that you want your ships to have as names.
   (6) GHOST your ship names by swapping hull names among ships at the same x,y coords.
        (This is named "ghosting" after seeing @Ghostrider do this continually through
         one game.)
   (7) All manual edits to ship names via the ship management window are saved
        to the current list that is being viewed on the star map. So no info is lost
        when switching between lists.
   (8) Add a fleet prefix to your ship names (DFF = Disunited Federation of Fascists).
        Also now includes an option to input hull-specific prefixes for your names.
   (9) Combine and mix different source lists into your saved ship name lists.
        Each turn, new ships in your fleet are given a default name "Death Has No Name"
        in all of the saved ship name lists (except the hull name list [HOST default]
        and the tactical name list [which is an abbreviated combo of hull name and
        experience, engine, beam and torp tech levels]). Use the "Only Replace Defaults" option
        when naming to only change those default entries, using a new/different source list.

IMPORTANT:
1. The "hull" list in ShipBaptism is the HOST default list of uppercase full hull
names. If you do not use this plugin at all, even though it is loaded, the default name behavior
of your ships will never change. If you manually change a ship name, that change is preserved.
The plugin will only make changes when you actively use it.

2. The ship names that will be packaged up in your turn file and will be visible to other
commanders are the ship names visible on the starmap and ship management screen when you
press "END TURN". IF YOU USE THIS PLUGIN, CHECK THAT YOUR SHIPS HAVE THE NAMES YOU INTEND
FOR THEM TO HAVE PRIOR TO CLICKING "END TURN".

3. The dashboard control page has been designed/implemented for both the LEGACY 3.x PlanetNu
client and the new v4.x client (when viewed on a laptop sized screen).

//- --- --- - - --- --- ---- - - --- --- --- ---- - - - --- - -- -- ---- - - --- -
vlog:
v1.00 - stable release                                                                 200915
v0.22 - bug fix when using plugin with multiple games and vars cross-over              200511
      - manual changes to ship names now saved across all lists
v0.21 - updated ship hull database (hard-coded)                                        200502
      - added defaults in case a ship hull is not in plugin DB (new campaign ships?)
           > avoids fatal execution error
v0.20 - bug in save/load the 4th long list fixed                                       200411
v0.19 - fix pre-abbrev name reset when None is selected                                200329
      - added two more list options: carnage and combat
      - changed note index number (hard reset)
v0.18 - fix layout for new client v4.0                                                 200316
v0.17 - bug fix loading longlists; reset note ID numbers                               191215
v0.16 - bug fix                                                                        190930
v0.15 - added a "merge" list function to combine two existing lists                    190929
      - added a 4th empty list slot for both long and short lists                      190921
v0.14 - add Ghost Naming option for ships at same x,y position                         190915
v0.13 - add option for hull-specific prefix names                                      190902
v0.12 - code revision so tactical names are updated each turn (FED refit, Crew Exp)    190825
      - add ship crew experience to tactical name.                                     190810
v0.11 - fix rare case bug in replacing default names.                                  190722
      - default showList setting now visible as buttn color change.                    190722
      - save prefix abbreviation when edited and reload on next turn.                  190721
      - when initializing for the first time, current ship names are now saved into
             the 'hull' list instead of rewriting all shipnames with a new HULL name.  190615
v0.10 - expand default short word lists;
      - revise random selection to be more equal across all list outcomes . . .
            > even distribution sampling with a random seed as opposed to
              purely random sampling;
      - do not change ship names if TurnReady == true;                                 190610
v0.09 - add saveNotes prototype function;
v0.08 - html re-organized, code cleaned, ready for beta.                               190609
v0.07 - added Spoof Name function; minor bug fixes.                                    190608
v0.06 - jscrollpane scrollTop fixed! plus beta testign controls and functions.         190526
v0.05 - Full operational plugin completed.                                             190517
v0.04 - Completed input parameter parsing.                                             190515
v0.03 - Completed dash board structure using a table to organize/present each unit
        as a row. Added the jScrollPane() function.                                    190421
v0.02 - Working Structure in place to manage lists of different ship names.            190415
v0.01 - hijk.180903: start
//- --- --- - - --- --- ---- - - --- --- --- ---- - - - --- - -- -- ---- - - --- -
//- --- --- - - --- --- ---- - - --- --- --- ---- - - - --- - -- -- ---- - - --- -*/
function wrapper() { // . . . . . . . . . . . wrapper for injection
    var debug        = true;
    var plgname      = "ShipNameBaptism";
    var plgversion   = 1.0;
    var nameNoteType = -1126535;      // Note type number code for the active shipNames saved as Notes
    var longNoteType = -1126536;      // Note type number code for the default Long Lists saved as Notes
  //var testgame     = "BIRD-043";    // Limits plugin to be active in only the named game; vgap.settings.name for development/testing
    var noteIDnamez  = 0;             // id numstr for NOTE functions
    var noteIDlistz  = 0;             // id numstr for NOTE functions
    var showList     = "hull";        // initial default shipname list to use (hull = default Host names);
    var preabrv      = "WAGB";        // a default prefix for ship names
//- --- --- - - --- --- ---- - - --- --- --- ---- - - - --- - -- -- ---- - - --- -
// Custom Long List Default Values that can be edited/replaced by USER . . . . . . . . . . . . . . . . .
// Input needs to be comma separated lists, where elements are quoted, and with no other internal quotes or apostrophes present in the names (spaces are OK).
//- --- --- - - --- --- ---- - - --- --- --- ---- - - - --- - -- -- ---- - - --- -
   // LONG default names and default long lists . . . . . . . .
    var longLists    = [ "Russian Field Marshals 1700-1915", "Metallica Songs", "Java Error Codes", "empty01"];
    var defaultLong1 = [ 'Count Fedor Golovin', 'Count Boris Sheremetev', 'Prince Alexander Menshikov', 'Prince Anikita Repnin', 'Prince Mikhail Galitzine', 'Count Jacob Bruce', 'Jan Kazimierz Sapieha', 'Prince Ivan Trubetskoy', 'Prince Vasily Vladimirovich Dolgorukov', 'Count Burkhard Christoph von Munnich', 'Count Peter von Lacy', 'Ludwig Johann Wilhelm Gruno von Hessen-Homburg', 'Stepan Apraksin', 'Nikita Yurievich Trubetskoy', 'Count Alexander Buturlin', 'Count Alexei Razumovsky', 'Count Pyotr Saltykov', 'Count Alexander Ivanovich Shuvalov', 'Count Pyotr Ivanovich Shuvalov', 'Peter August Friedrich, Duke of Schleswig-Holstein-Sonderburg-Beck', 'Prince Georg Ludwig of Holstein-Gottorp', 'Count Alexei Bestuzhev-Ruymin', 'Prince Nikita Trubetskoy', 'Count Kirill Razumovsky', 'Prince Alexander Galitzine', 'Count Pyotr Rumyantsev-Zadunaisky', 'Count Zakhar Chernyshyov', 'Prince Grigori Potemkin', 'Prince Aleksander Suvorov', 'Count Ivan Saltykov', 'Prince Nicholas Repnin', 'Prince Nikolay Saltykov', 'Count Ivan Chernyshyov', 'Count Johann Martin von Elmpt', 'Count Valentin Platonovich Musin-Pushkin', 'Count Mikhail Kamensky', 'Victor François de Broglie, 2nd duc de Brogliey', 'Prince Alexander Prozorovsky', 'Count Ivan Gudovich', 'Prince Mikhail Golenischev-Kutuzov', 'Prince Mikhail Barclay de Tolly', 'Prince Fabian Gottlieb von Osten-Sacken', 'Ludwig Adolph Peter, Prince of Sayn-Wittgenstein-Berleburg-Ludwigsburg', 'Prince Ivan Paskevich', 'Count Hans Karl von Diebitsch-Zabalkansky', 'Prince Pyotr Volkonsky', 'Prince Mikhail Vorontsov', 'Prince Alexander Baryatinsky', 'Count Friedrich Wilhelm Rembert von Berg', 'Grand Duke Nikolas Nikolaevich', 'Grand Duke Mikhail Nikolaevich', 'Count Joseph Vladimirovich Gourko', 'Count Dmitry Milyutin'];
    var defaultLong2 = [ '... and Justice For All', '2 X 4', 'All Within My Hands', 'Am I Evil?', 'Bad Attitude', 'Bad Seed', 'Battery', 'Better Than You', 'Blackened', 'Bleeding Me', 'Blitzkrieg', 'Breadfan', 'Carpe Diem Baby', 'Crash Course In Brain Surgery', 'Creeping Death', 'Cure', 'Damage Case', 'Damage Inc.', 'Devils Dance', 'Devils Dance', 'Die, Die My Darling', 'Dirty Window', 'Disposable Heroes', 'Dont Tread On Me', 'Dont Treat On Me', 'Dyers Eve', 'Enter Sandman', 'Escape', 'Eye Of The Beholder', 'Fade To Black', 'Fight Fire With Fire', 'Fixxxer', 'For Whom The Bell Tolls', 'Frantic', 'Free Speech For The Dumb', 'Fuel', 'Fuel For Fire', 'Harvester Of Sorrow', 'Helpless', 'Hero Of The Day', 'Hit The Lights', 'Holier Than Thou', 'Disappear', 'Invisible Kid', 'Its Electric', 'Jump In The Fire', 'Kenny Goes To Hell', 'Kill and Ride Medley', 'Killing Time', 'King Nothing', 'Last Caress in Green Hell', 'Leper Messiah', 'Loverman', 'Low Mans Lyric', 'Mama Said', 'Master Of Puppets', 'Memory Remains', 'Mercyful Fate', 'Metal Militia', 'Motorbreath', 'My Friend Of Misery', 'My World', 'No Leaf Clover', 'No Remorse', 'Nothing Else Matters', 'Of Wolf And Man', 'One', 'Overkill', 'Phantom Lord', 'Poor Twisted Me', 'Prince Charming', 'Purify', 'Ride The Lightning', 'Ronnie', 'Sabbra Cadabra', 'Sad But True', 'Seek And Destroy', 'Shoot Me Again', 'Slither', 'So What', 'Some Kind Of Monster', 'St. Anger', 'Stone Cold Crazy', 'Stone Dead Forever', 'Sweet Amber', 'The Ballad Of ?brain Knight?', 'The Four Horseman', 'The Four Horsemen', 'The Frayed Ends Of Sanity', 'The God That Failed', 'The House That Jack Built', 'The Mechanix', 'The Memory Remains', 'The More I See', 'The Outlaw Torn', 'The Prince', 'The Shortest Straw', 'The Small Hours', 'The Struggle Within', 'The Thing That Should Not Be', 'The Unforgiven', 'The Unforgiven II', 'The Unnamed Feeling', 'The Wait', 'Thorn Within', 'Through The Never', 'To Live Is To Die', 'Too Late Too Late', 'Trapped Under Ice', 'Tuesdays Gone', 'Turn The Page', 'Unnamed Feeling', 'Until It Sleeps', 'Wasting My Hate', 'We Did It Again', 'Welcome Home', 'Where The Wild Things Are', 'Wherever I May Roam', 'Whiplash', 'Whiskey In The Jar'];
    var defaultLong3 = [ 'AbstractMethodError', 'AssertionError', 'ClassCircularityError', 'ClassFormatError', 'Error', 'ExceptionInInitializerError', 'IllegalAccessError', 'IncompatibleClassChangeError', 'InstantiationError', 'InternalError', 'LinkageError', 'NoClassDefFoundError', 'NoSuchFieldError', 'NoSuchMethodError', 'OutOfMemoryError', 'StackOverflowError', 'ThreadDeath', 'UnknownError', 'UnsatisfiedLinkError', 'UnsupportedClassVersionError', 'VerifyError', 'VirtualMachineError', 'ArithmeticException', 'ArrayIndexOutOfBoundsException', 'ArrayStoreException', 'ClassCastException', 'ClassNotFoundException', 'CloneNotSupportedException', 'EnumConstantNotPresentException', 'Exception', 'IllegalAccessException', 'IllegalArgumentException', 'IllegalMonitorStateException', 'IllegalStateException', 'IllegalThreadStateException', 'IndexOutOfBoundsException', 'InstantiationException', 'InterruptedException', 'NegativeArraySizeException', 'NoSuchFieldException', 'NoSuchMethodException', 'NullPointerException', 'NumberFormatException', 'RuntimeException', 'SecurityException', 'StringIndexOutOfBoundsException', 'TypeNotPresentException', 'UnsupportedOperationException', 'ArithmeticException', 'ArrayIndexOutOfBoundsException', 'ArrayStoreException', 'ClassCastException', 'ClassNotFoundException', 'CloneNotSupportedException', 'IllegalAccessException', 'IllegalArgumentException', 'IllegalMonitorStateException', 'IllegalStateException', 'IllegalThreadStateException', 'IndexOutOfBoundsException', 'InstantiationException', 'InterruptedException', 'NegativeArraySizeException', 'NoSuchFieldException', 'NoSuchMethodException', 'NullPointerException', 'NumberFormatException', 'RuntimeException', 'SecurityException', 'StringIndexOutOfBoundsException', 'UnsupportedOperationException', 'ConcurrentModificationException', 'EmptyStackException', 'MissingResourceException', 'NoSuchElementException', 'TooManyListenersException', 'AWTException', 'FontFormatException', 'HeadlessException', 'IllegalComponentStateException', 'CMMException', 'ProfileDataException', 'MimeTypeParseException', 'UnsupportedFlavorException', 'IntrospectionException', 'PropertyVetoException', 'CharConversionException', 'EOFException', 'FileNotFoundException', 'InterruptedIOException', 'InvalidClassException', 'InvalidObjectException', 'IOException', 'NotActiveException', 'NotSerializableException', 'ObjectStreamException', 'OptionalDataException', 'StreamCorruptedException'];
    var defaultLong4 = [ 'EmptySoul'];
    // SHORT default names and default short lists . . . . . . . . .
    var shortLists   = [ "Cadaver Colors", "Forces of Nature", "Unfortunate Calamities", "empty02"];
    var defaultShort1= [ 'Black', 'BloodRed', 'BlueBruise', 'Midnight', 'ColdMoon', 'OrangeAnger', 'Crimson', 'Scarlet', 'FrozenLight', 'BrownBile', 'BlackFear', 'EternalBlack', 'GreenSpleen', 'LiverBruise', 'BloodClot', 'ForeverBreath', 'EmptyNight', 'MidnightTerror', 'BloodThief', 'SanguineRage', 'BlindMalice' ];
    var defaultShort2= [ 'Tide', 'Lightning', 'Blizzard', 'Wave', 'Quake', 'Hurricane', 'Typhoon', 'Tornado', 'Glacier', 'Fire', 'Wind', 'Ice', 'Volcano', 'Tsunami', 'Snow', 'Current', 'Abyss', 'QuickSand', 'Swamp', 'Cavern', 'Apocalypse', 'Armaggedon', 'Plague', 'Pestilence', 'War', 'Destruction', 'Gale' ];
    var defaultShort3= [ 'Death', 'Vengeance', 'Retribution', 'Slaughter', 'Widowmakers', 'Decapitation', 'SoulCrushers', 'Havoc', 'Chaos', 'HellHounds', 'Damnation', 'Hades', 'Orphans', 'Phantoms', 'Shadows', 'Souls', 'Specters', 'Banshees', 'Daemons', 'Revenants', 'Vengeful Shades', 'Wraiths', 'Zombies','Disease', 'Famine', 'Pestilence', 'Justice', 'Fear', 'Scorn', 'Disgust', 'Moral Turpitude', 'Armaggedon', 'Hell', 'Eternal Pain', 'DeathStink', 'Insanity', 'Daemonic Possession', 'Fallen Angels'];
    var defaultShort4= [ 'GloryDeath' ];
//- --- --- - - --- --- ---- - - --- --- --- ---- - - - --- - -- -- ---- - - --- -
//- --- --- - - --- --- ---- - - --- --- --- ---- - - - --- - -- -- ---- - - --- -
//- --- --- - - --- --- ---- - - --- --- --- ---- - - - --- - -- -- ---- - - --- -
//  .  .. .. . . .. . .. D O   N O T   D I S T U R B .. .. ...... . .. ... .. . .    .
//- --- --- - - --- --- ---- - - --- --- --- ---- - - - --- - -- -- ---- - - --- -
    // some of the vars here are also reset between games via the resetVars() function.
    var blankName    = "Death Has No Name";
    var nameLists    = ["hull", "tactical", "smack", "malign", "sublime", "sober", "historical", "combat", "carnage"]
    var baptism_namez= {"000":{ "hull":"true", "tactical":"false", "smack":"false", "malign":"false", "sublime":"false", "sober":"false", "historical":"false"}};
    //var hullNamez    = [{ "hid":1, "hn":"Outrider Class Scout", "sn":"Scout" }, { "hid":2, "hn":"Nocturne Class Destroyer", "sn":"Noct" }, { "hid":3, "hn":"Bohemian Class Survey Ship", "sn":"Bohm" }, { "hid":4, "hn":"Vendetta Class Frigate", "sn":"Vendt" }, { "hid":5, "hn":"Nebula Class Cruiser", "sn":"Nebula" }, { "hid":6, "hn":"Banshee Class Destroyer", "sn":"Bansh" }, { "hid":7, "hn":"Loki Class Destroyer", "sn":"Loki" }, { "hid":8, "hn":"Eros Class Research Vessel", "sn":"Eros" }, { "hid":9, "hn":"Brynhild Class Escort", "sn":"Bryn" }, { "hid":10, "hn":"Arkham Class Frigate", "sn":"Ark" }, { "hid":11, "hn":"Thor Class Frigate", "sn":"Thor" }, { "hid":12, "hn":"Diplomacy Class Cruiser", "sn":"Dipl" }, { "hid":13, "hn":"Missouri Class Battleship", "sn":"Miss" }, { "hid":14, "hn":"Neutronic Fuel Carrier", "sn":"NFC" }, { "hid":15, "hn":"Small Deep Space Freighter", "sn":"SDSF" }, { "hid":16, "hn":"Medium Deep Space Freighter", "sn":"MDSF" }, { "hid":17, "hn":"Large Deep Space Freighter", "sn":"LDSF" }, { "hid":18, "hn":"Super Transport Freighter", "sn":"SupTF" }, { "hid":19, "hn":"Kittyhawk Class Carrier", "sn":"Kitty" }, { "hid":20, "hn":"Nova Class Super-dreadnought", "sn":"Nova" }, { "hid":21, "hn":"Reptile Class Destroyer", "sn":"Rept" }, { "hid":22, "hn":"Lizard Class Cruiser", "sn":"LCC" }, { "hid":23, "hn":"T-Rex Class Battleship", "sn":"TRX" }, { "hid":24, "hn":"Serpent Class Escort", "sn":"Serp" }, { "hid":25, "hn":"Saurian Class Light Cruiser", "sn":"Saur" }, { "hid":26, "hn":"White Falcon Class Cruiser", "sn":"Wfal" }, { "hid":27, "hn":"Swift Heart Class Scout", "sn":"Swift" }, { "hid":28, "hn":"Fearless Wing Cruiser", "sn":"Fwing" }, { "hid":29, "hn":"Dark Wing Class Battleship", "sn":"DW" }, { "hid":30, "hn":"Valiant Wind Class Carrier", "sn":"Valnt" }, { "hid":31, "hn":"Resolute Class Battlecruiser", "sn":"RES" }, { "hid":32, "hn":"Bright Heart Class Destroyer", "sn":"Bright" }, { "hid":33, "hn":"Deth Specula Class Frigate", "sn":"Deth" }, { "hid":34, "hn":"D7a Painmaker Class Cruiser", "sn":"D7a" }, { "hid":35, "hn":"Victorious Class Battleship", "sn":"Vic" }, { "hid":36, "hn":"D7 Coldpain Class Cruiser", "sn":"D7cold" }, { "hid":37, "hn":"Ill Wind Class Battlecruiser", "sn":"Illw" }, { "hid":38, "hn":"D3 Thorn Class Destroyer", "sn":"D3" }, { "hid":39, "hn":"D19b Nefarious Class Destroyer", "sn":"D19b" }, { "hid":40, "hn":"Little Pest Class Escort", "sn":"Pest" }, { "hid":41, "hn":"Saber Class Frigate", "sn":"Saber" }, { "hid":42, "hn":"Lady Royale Class Cruiser", "sn":"Lady" }, { "hid":43, "hn":"Dwarfstar Class Transport", "sn":"Dwarf" }, { "hid":44, "hn":"Br4 Class Gunship", "sn":"Br4" }, { "hid":45, "hn":"Br5 Kaye Class Torpedo Boat", "sn":"Br5" }, { "hid":46, "hn":"Meteor Class Blockade Runner", "sn":"MCBR" }, { "hid":47, "hn":"Red Wind Class Carrier", "sn":"RedWind" }, { "hid":48, "hn":"Skyfire Class Cruiser", "sn":"SkyFire" }, { "hid":49, "hn":"Madonnzila Class Carrier", "sn":"Madon" }, { "hid":50, "hn":"Bloodfang Class Carrier", "sn":"Blood" }, { "hid":51, "hn":"B200 Class Probe", "sn":"B200" }, { "hid":52, "hn":"Biocide Class Carrier", "sn":"BIO" }, { "hid":53, "hn":"Annihilation Class Battleship", "sn":"ANN" }, { "hid":54, "hn":"B41 Explorer", "sn":"B41" }, { "hid":55, "hn":"B222 Destroyer", "sn":"B222" }, { "hid":56, "hn":"Firecloud Class Cruiser", "sn":"FCC" }, { "hid":57, "hn":"Watcher Class Scout", "sn":"Watch" }, { "hid":58, "hn":"Quietus Class Cruiser", "sn":"Quit" }, { "hid":59, "hn":"Small Transport", "sn":"SmallTrans" }, { "hid":60, "hn":"Ruby Class Light Cruiser", "sn":"Ruby" }, { "hid":61, "hn":"Emerald Class Battlecruiser", "sn":"Emerd" }, { "hid":62, "hn":"Sky Garnet Class Destroyer", "sn":"SkyGarn" }, { "hid":63, "hn":"Diamond Flame Class Battleship", "sn":"DIAM" }, { "hid":64, "hn":"Onyx Class Frigate", "sn":"Onyx" }, { "hid":65, "hn":"Topez Class Gunboat", "sn":"Topez" }, { "hid":66, "hn":"Opal Class Torpedo Boat", "sn":"Opal" }, { "hid":67, "hn":"Crystal Thunder Class Carrier", "sn":"CRYST" }, { "hid":68, "hn":"Moscow Class Star Escort", "sn":"Moscow" }, { "hid":69, "hn":"Super Star Destroyer", "sn":"SSD" }, { "hid":70, "hn":"Gorbie Class Battlecarrier", "sn":"GORB" }, { "hid":71, "hn":"Ru25 Gunboat", "sn":"RU25" }, { "hid":72, "hn":"H-ross Class Light Carrier", "sn":"Hross" }, { "hid":73, "hn":"Mig Class Scout", "sn":"Mig" }, { "hid":74, "hn":"Super Star Cruiser", "sn":"SSCruiz" }, { "hid":75, "hn":"Super Star Frigate", "sn":"SSFrig" }, { "hid":76, "hn":"Super Star Carrier", "sn":"SSTrans" }, { "hid":77, "hn":"Pl21 Probe", "sn":"PL21" }, { "hid":78, "hn":"Instrumentality Class Baseship", "sn":"INSTRM" }, { "hid":79, "hn":"Golem Class Baseship", "sn":"GOLEM" }, { "hid":80, "hn":"Automa Class Baseship", "sn":"AUTOMA" }, { "hid":81, "hn":"Cat's Paw Class Destroyer", "sn":"Cat" }, { "hid":82, "hn":"Q Tanker", "sn":"QT" }, { "hid":83, "hn":"Cybernaut Class Baseship", "sn":"Cynaut" }, { "hid":84, "hn":"Pawn Class Baseship", "sn":"Pawn" }, { "hid":85, "hn":"Iron Slave Class Baseship", "sn":"Iron" }, { "hid":86, "hn":"Tranquility Class Cruiser", "sn":"Tranq" }, { "hid":87, "hn":"Falcon Class Escort", "sn":"Falcon" }, { "hid":88, "hn":"Gaurdian Class Destroyer", "sn":"Guard" }, { "hid":89, "hn":"Iron Lady Class Frigate", "sn":"IRON" }, { "hid":90, "hn":"Sage Class Frigate", "sn":"Sage" }, { "hid":91, "hn":"Deep Space Scout", "sn":"Dscout" }, { "hid":92, "hn":"Patriot Class Light Carrier", "sn":"PAT" }, { "hid":93, "hn":"Armored Transport", "sn":"ArmTrans" }, { "hid":94, "hn":"Rush Class Heavy Carrier", "sn":"RUSH" }, { "hid":95, "hn":"Little Joe Class Escort", "sn":"Joe" }, { "hid":96, "hn":"Cobol Class Research Cruiser", "sn":"Cobol" }, { "hid":97, "hn":"Aries Class Transport", "sn":"Aries" }, { "hid":98, "hn":"Taurus Class Scout", "sn":"Taurus" }, { "hid":99, "hn":"Virgo Class Battlestar", "sn":"VIRGO" }, { "hid":100, "hn":"Sagittarius Class Transport", "sn":"SagiTrans" }, { "hid":101, "hn":"Gemini Class Transport", "sn":"GemTrans" }, { "hid":102, "hn":"Scorpius Class Light Carrier", "sn":"Scorp" }, { "hid":103, "hn":"Cygnus Class Destroyer", "sn":"Cygnus" }, { "hid":104, "hn":"Neutronic Refinery Ship", "sn":"NeutRefine" }, { "hid":105, "hn":"Merlin Class Alchemy Ship", "sn":"MERLIN" }, { "hid":107, "hn":"Armored Ore Condenser", "sn":"AOC" }, { "hid":108, "hn":"Dungeon Class Stargate", "sn":"DCS" }, { "hid":109, "hn":"Chameleon Class Freighter", "sn":"CCF" }, { "hid":110, "hn":"Sapphire Class Space Ship", "sn":"SCSS" }, { "hid":111, "hn":"Tantrum Liner", "sn":"Tantrum" }, { "hid":112, "hn":"Zilla Class Battlecarrier", "sn":"Zilla" }, { "hid":113, "hn":"Selenite Class Battlecruiser", "sn":"Selenite" }, { "hid":114, "hn":"Lorean Class Temporal Lance", "sn":"Lorean" }, { "hid":115, "hn":"Hive", "sn":"Hive" }, { "hid":117, "hn":"Brood", "sn":"Brood" }, { "hid":118, "hn":"Jacker", "sn":"Jacker" }, { "hid":119, "hn":"Soldier", "sn":"Soldier" }, { "hid":120, "hn":"D9 Usva Class Stealth Raider", "sn":"D9Usva" }, { "hid":201, "hn":"Sentry", "sn":"Sentry" }, { "hid":202, "hn":"Nest", "sn":"Nest" }, { "hid":203, "hn":"Armoured Nest", "sn":"Armoured Nest" }, { "hid":204, "hn":"Farm", "sn":"Farm" }, { "hid":205, "hn":"Accelerator", "sn":"Accelerator" }, { "hid":206, "hn":"Protofield", "sn":"Protofield" }, { "hid":207, "hn":"Duranium Rock", "sn":"DurRock" }, { "hid":208, "hn":"Tritanium Rock", "sn":"TritRock" }, { "hid":209, "hn":"Molybdenum Rock", "sn":"MolyRock" }, { "hid":210, "hn":"Stinger", "sn":"Stinger" }, { "hid":211, "hn":"Dunghill", "sn":"Dung" }, { "hid":1001, "hn":"Outrider Class Transport", "sn":"OCT" }, { "hid":1004, "hn":"Vendetta B Class Frigate", "sn":"VendettaB" }, { "hid":1006, "hn":"Banshee B Class Destroyer", "sn":"BansheeB" }, { "hid":1010, "hn":"Arkham Class Destroyer", "sn":"ArkDestroyer" }, { "hid":1011, "hn":"Thor B Class Frigate", "sn":"ThorB" }, { "hid":1012, "hn":"Diplomacy B Class Cruiser", "sn":"DiploB" }, { "hid":1021, "hn":"Reptile Class Escort", "sn":"ReptileEscort" }, { "hid":1023, "hn":"T-Rex Class Battleship", "sn":"T-RexB" }, { "hid":1025, "hn":"Saurian Class Frigate", "sn":"SaurianB" }, { "hid":1030, "hn":"Valiant Wind Storm-Carrier", "sn":"ValiantB" }, { "hid":1032, "hn":"Bright Heart Light Destroyer", "sn":"BrightB" }, { "hid":1033, "hn":"Deth Specula Armoured Frigate", "sn":"DethSpecB" }, { "hid":1034, "hn":"D7b Painmaker Class Cruiser", "sn":"D7b-B" }, { "hid":1038, "hn":"D3 Thorn Class Frigate", "sn":"D3B" }, { "hid":1039, "hn":"D19c Nefarious Class Destroyer", "sn":"D19c" }, { "hid":1040, "hn":"Little Pest Light Escort", "sn":"PestB" }, { "hid":1041, "hn":"Saber Class Shield Generator", "sn":"SabeB" }, { "hid":1043, "hn":"Dwarfstar II Class Transport", "sn":"DwarfIIB" }, { "hid":1047, "hn":"Red Wind Storm-Carrier", "sn":"RedB" }, { "hid":1048, "hn":"Skyfire Class Transport", "sn":"SkyfireB" }, { "hid":1049, "hn":"Madonnzila Class Carrier", "sn":"MadonB" }, { "hid":1054, "hn":"B41b Explorer", "sn":"B41b-B" }, { "hid":1055, "hn":"B222b Destroyer", "sn":"B222b" }, { "hid":1059, "hn":"Medium Transport", "sn":"MTb" }, { "hid":1062, "hn":"Sky Garnet Class Frigate", "sn":"SkyB" }, { "hid":1065, "hn":"Topaz Class Gunboats", "sn":"TopazB" }, { "hid":1068, "hn":"Moscow Class Star Destroyer", "sn":"MoscowB" }, { "hid":1071, "hn":"Ru25 Gunboats", "sn":"Ru25B" }, { "hid":1073, "hn":"Mig Class Transport", "sn":"MigB" }, { "hid":1074, "hn":"Super Star Cruiser II", "sn":"Cruiser II" }, { "hid":1076, "hn":"Super Star Carrier II", "sn":"Carrier II" }, { "hid":1083, "hn":"Cybernaut B Class Baseship", "sn":"CybernautB" }, { "hid":1084, "hn":"Pawn B Class Baseship", "sn":"PawnB" }, { "hid":1085, "hn":"Iron Slave Class Tug", "sn":"IronTug" }, { "hid":1088, "hn":"Gaurdian B Class Destroyer", "sn":"GaurdB" }, { "hid":1089, "hn":"Iron Lady Class Command Ship", "sn":"IronCommand" }, { "hid":1090, "hn":"Sage Class Repair Ship", "sn":"SageRepair" }, { "hid":1093, "hn":"Heavy Armored Transport", "sn":"HATb" }, { "hid":1095, "hn":"Little Joe Light Escort", "sn":"JoeB" }, { "hid":1098, "hn":"Taurus Class Transport", "sn":"TaurusB" }, { "hid":1102, "hn":"Scorpius Class Carrier", "sn":"ScorpB" }, { "hid":2004, "hn":"Vendetta C Class Frigate", "sn":"VendettaC" }, { "hid":2006, "hn":"Wild Banshee Class Destroyer", "sn":"BansheeB" }, { "hid":2010, "hn":"Arkham Class Cruiser", "sn":"ArkhamB" }, { "hid":2011, "hn":"Thor Class Heavy Frigate", "sn":"ThorHeavy" }, { "hid":2025, "hn":"Saurian Class Heavy Frigate", "sn":"SaurHeavy" }, { "hid":2033, "hn":"Deth Specula Stealth", "sn":"DethStealth" }, { "hid":2038, "hn":"D3 Thorn Class Cruiser", "sn":"D3B" }, { "hid":2065, "hn":"Imperial Topaz Class Gunboats", "sn":"ImpTopaz" }, { "hid":2071, "hn":"Ru30 Gunboats", "sn":"Ru30B" }, { "hid":2088, "hn":"Gaurdian C Class Destroyer", "sn":"GaurdC" }, { "hid":2102, "hn":"Scorpius Class Heavy Carrier", "sn":"ScorpHeavy" }, { "hid":3004, "hn":"Vendetta Stealth Class Frigate", "sn":"VendStealth" }, { "hid":3033, "hn":"Deth Specula Heavy Frigate", "sn":"DethHeavyB" }]
    var hullNamez    = [{ "hid":1064, "hn":"Pyrite Class Frigate", "sn":"Pyrite", "tech":"8", "race":["7"] }, { "hid":210, "hn":"Stinger", "sn":"Stinger", "tech":"1", "race":["12"] }, { "hid":211, "hn":"Dunghill", "sn":"Dung", "tech":"1", "race":["12"] }, { "hid":24, "hn":"Serpent Class Escort", "sn":"Serp", "tech":"1", "race":["2"] }, { "hid":25, "hn":"Saurian Class Light Cruiser", "sn":"Saur", "tech":"7", "race":["2"] }, { "hid":26, "hn":"White Falcon Class Cruiser", "sn":"WFalcon", "tech":"3", "race":["3"] }, { "hid":27, "hn":"Swift Heart Class Scout", "sn":"Swift", "tech":"1", "race":["3"] }, { "hid":20, "hn":"Nova Class Super-dreadnought", "sn":"Nova", "tech":"10", "race":["1"] }, { "hid":21, "hn":"Reptile Class Destroyer", "sn":"RepDest", "tech":"3", "race":["2"] }, { "hid":22, "hn":"Lizard Class Cruiser", "sn":"LCC", "tech":"4", "race":["2"] }, { "hid":23, "hn":"T-Rex Class Battleship", "sn":"TRex", "tech":"10", "race":["2"] }, { "hid":1076, "hn":"Super Star Carrier II", "sn":"SSCarrier II", "tech":"5", "race":["8"] }, { "hid":1074, "hn":"Super Star Cruiser II", "sn":"SSCruiser II", "tech":"9", "race":["8"] }, { "hid":28, "hn":"Fearless Wing Cruiser", "sn":"FWing", "tech":"5", "race":["3"] }, { "hid":29, "hn":"Dark Wing Class Battleship", "sn":"DWing", "tech":"10", "race":["3"] }, { "hid":1071, "hn":"Ru25 Gunboats", "sn":"Ru25B", "tech":"1", "race":["8"] }, { "hid":4, "hn":"Vendetta Class Frigate", "sn":"Vendt", "tech":"5", "race":["1","2"] }, { "hid":8, "hn":"Eros Class Research Vessel", "sn":"Eros", "tech":"4", "race":["1","2"] }, { "hid":2011, "hn":"Thor Class Heavy Frigate", "sn":"ThorHeavy", "tech":"9", "race":["1"] }, { "hid":2010, "hn":"Arkham Class Cruiser", "sn":"ArkhamB", "tech":"8", "race":["1"] }, { "hid":1025, "hn":"Saurian Class Frigate", "sn":"SaurianB", "tech":"7", "race":["2"] }, { "hid":119, "hn":"Soldier", "sn":"Soldier", "tech":"1", "race":["12"] }, { "hid":1090, "hn":"Sage Class Repair Ship", "sn":"SageRepair", "tech":"5", "race":["9","10"] }, { "hid":1093, "hn":"Heavy Armored Transport", "sn":"HATb", "tech":"4", "race":["10"] }, { "hid":1098, "hn":"Taurus Class Transport", "sn":"TaurusB", "tech":"1", "race":["10","11"] }, { "hid":120, "hn":"D9 Usva Class Stealth Raider", "sn":"D9Usva", "tech":"9", "race":["4"] }, { "hid":1021, "hn":"Reptile Class Escort", "sn":"ReptileEscort", "tech":"3", "race":["2"] }, { "hid":118, "hn":"Jacker", "sn":"Jacker", "tech":"1", "race":["12"] }, { "hid":1068, "hn":"Moscow Class Star Destroyer", "sn":"MoscowB", "tech":"3", "race":["8"] }, { "hid":59, "hn":"Small Transport", "sn":"SmallTrans", "tech":"4", "race":["3","4","5","7"] }, { "hid":58, "hn":"Quietus Class Cruiser", "sn":"Quiet", "tech":"5", "race":["6"] }, { "hid":3004, "hn":"Vendetta Stealth Class Frigate", "sn":"VendStealth", "tech":"5", "race":["2"] }, { "hid":55, "hn":"B222 Destroyer", "sn":"B222", "tech":"5", "race":["6"] }, { "hid":54, "hn":"B41 Explorer", "sn":"B41", "tech":"2", "race":["6"] }, { "hid":57, "hn":"Watcher Class Scout", "sn":"Watch", "tech":"1", "race":["6"] }, { "hid":56, "hn":"Firecloud Class Cruiser", "sn":"FCC", "tech":"6", "race":["6"] }, { "hid":51, "hn":"B200 Class Probe", "sn":"B200", "tech":"1", "race":["6"] }, { "hid":50, "hn":"Bloodfang Class Carrier", "sn":"Blood", "tech":"10", "race":["5"] }, { "hid":53, "hn":"Annihilation Class Battleship", "sn":"ANN", "tech":"10", "race":["6"] }, { "hid":52, "hn":"Biocide Class Carrier", "sn":"BIO", "tech":"9", "race":["6"] }, { "hid":1084, "hn":"Pawn B Class Baseship", "sn":"PawnB", "tech":"3", "race":["9"] }, { "hid":2065, "hn":"Imperial Topaz Class Gunboats", "sn":"ImpTopaz", "tech":"3", "race":["7"] }, { "hid":1085, "hn":"Iron Slave Class Tug", "sn":"IronTug", "tech":"2", "race":["6","9"] }, { "hid":1062, "hn":"Sky Garnet Class Frigate", "sn":"SkyB", "tech":"5", "race":["7"] }, { "hid":1083, "hn":"Cybernaut B Class Baseship", "sn":"CybernautB", "tech":"4", "race":["9"] }, { "hid":1065, "hn":"Topaz Class Gunboats", "sn":"TopazB", "tech":"3", "race":["7"] }, { "hid":1089, "hn":"Iron Lady Class Command Ship", "sn":"IronCommand", "tech":"9", "race":["10","11"] }, { "hid":1088, "hn":"Gaurdian B Class Destroyer", "sn":"GaurdB", "tech":"4", "race":["10"] }, { "hid":115, "hn":"Hive", "sn":"Hive", "tech":"1", "race":["12"] }, { "hid":114, "hn":"Lorean Class Temporal Lance", "sn":"Lorean", "tech":"7", "race":["6"] }, { "hid":88, "hn":"Gaurdian Class Destroyer", "sn":"Guard", "tech":"4", "race":["10"] }, { "hid":89, "hn":"Iron Lady Class Frigate", "sn":"IRON", "tech":"9", "race":["10","11"] }, { "hid":111, "hn":"Tantrum Liner", "sn":"Tantrum", "tech":"7", "race":["11"] }, { "hid":110, "hn":"Sapphire Class Space Ship", "sn":"SCSS", "tech":"5", "race":["7"] }, { "hid":113, "hn":"Selenite Class Battlecruiser", "sn":"Selenite", "tech":"8", "race":["7"] }, { "hid":112, "hn":"Zilla Class Battlecarrier", "sn":"Zilla", "tech":"10", "race":["2"] }, { "hid":82, "hn":"Q Tanker", "sn":"QT", "tech":"3", "race":["9"] }, { "hid":83, "hn":"Cybernaut Class Baseship", "sn":"Cynaut", "tech":"4", "race":["9"] }, { "hid":80, "hn":"Automa Class Baseship", "sn":"AUTOMA", "tech":"9", "race":["9"] }, { "hid":81, "hn":"Cat's Paw Class Destroyer", "sn":"Cat", "tech":"2", "race":["9"] }, { "hid":86, "hn":"Tranquility Class Cruiser", "sn":"Tranq", "tech":"6", "race":["10","11"] }, { "hid":87, "hn":"Falcon Class Escort", "sn":"Falcon", "tech":"2", "race":["10"] }, { "hid":84, "hn":"Pawn Class Baseship", "sn":"Pawn", "tech":"3", "race":["9"] }, { "hid":85, "hn":"Iron Slave Class Baseship", "sn":"Iron", "tech":"2", "race":["6","9"] }, { "hid":3, "hn":"Bohemian Class Survey Ship", "sn":"Bohm", "tech":"3", "race":["1"] }, { "hid":7, "hn":"Loki Class Destroyer", "sn":"Loki", "tech":"8", "race":["1","2"] }, { "hid":2071, "hn":"Ru30 Gunboats", "sn":"Ru30B", "tech":"1", "race":["8"] }, { "hid":1010, "hn":"Arkham Class Destroyer", "sn":"ArkDestroyer", "tech":"8", "race":["1"] }, { "hid":1011, "hn":"Thor B Class Frigate", "sn":"ThorB", "tech":"9", "race":["1"] }, { "hid":1012, "hn":"Diplomacy B Class Cruiser", "sn":"DiploB", "tech":"9", "race":["1"] }, { "hid":108, "hn":"Dungeon Class Stargate", "sn":"DCS", "tech":"10", "race":["6"] }, { "hid":109, "hn":"Chameleon Class Freighter ©", "sn":"CCF", "tech":"8", "race":["2"] }, { "hid":102, "hn":"Scorpius Class Light Carrier", "sn":"Scorp", "tech":"6", "race":["11"] }, { "hid":103, "hn":"Cygnus Class Destroyer", "sn":"Cygnus", "tech":"1", "race":["10","11"] }, { "hid":100, "hn":"Sagittarius Class Transport", "sn":"SagiTrans", "tech":"5", "race":["10","11"] }, { "hid":101, "hn":"Gemini Class Transport", "sn":"GemTrans", "tech":"6", "race":["10","11"] }, { "hid":107, "hn":"Armored Ore Condenser", "sn":"AOC", "tech":"4", "race":["4"] }, { "hid":104, "hn":"Neutronic Refinery Ship", "sn":"NFR", "tech":"9", "race":["1","2","3","4","5","6","7","8","9","10","11"] }, { "hid":105, "hn":"Merlin Class Alchemy Ship", "sn":"MERLIN", "tech":"10", "race":["1","2","3","4","5","6","7","8","9","10","11"] }, { "hid":39, "hn":"D19b Nefarious Class Destroyer", "sn":"D19b", "tech":"6", "race":["4"] }, { "hid":38, "hn":"D3 Thorn Class Destroyer", "sn":"D3Thorn", "tech":"5", "race":["4","5"] }, { "hid":33, "hn":"Deth Specula Class Frigate", "sn":"Deth", "tech":"6", "race":["3","4"] }, { "hid":32, "hn":"Bright Heart Class Destroyer", "sn":"Bright", "tech":"3", "race":["3"] }, { "hid":31, "hn":"Resolute Class Battlecruiser", "sn":"REZI", "tech":"7", "race":["3"] }, { "hid":30, "hn":"Valiant Wind Class Carrier", "sn":"Valnt", "tech":"6", "race":["3","4"] }, { "hid":37, "hn":"Ill Wind Class Battlecruiser", "sn":"Illw", "tech":"5", "race":["4"] }, { "hid":36, "hn":"D7 Coldpain Class Cruiser", "sn":"D7cold", "tech":"4", "race":["4"] }, { "hid":35, "hn":"Victorious Class Battleship", "sn":"VICK", "tech":"10", "race":["4"] }, { "hid":34, "hn":"D7a Painmaker Class Cruiser", "sn":"D7a", "tech":"2", "race":["4","5"] }, { "hid":1006, "hn":"Banshee B Class Destroyer", "sn":"BansheeB", "tech":"6", "race":["1"] }, { "hid":1004, "hn":"Vendetta B Class Frigate", "sn":"VendettaB", "tech":"5", "race":["1","2"] }, { "hid":1001, "hn":"Outrider Class Transport", "sn":"OCT", "tech":"1", "race":["1","5"] }, { "hid":1073, "hn":"Mig Class Transport", "sn":"MigB", "tech":"1", "race":["8"] }, { "hid":60, "hn":"Ruby Class Light Cruiser", "sn":"Ruby", "tech":"3", "race":["7"] }, { "hid":61, "hn":"Emerald Class Battlecruiser", "sn":"Emerd", "tech":"6", "race":["7"] }, { "hid":62, "hn":"Sky Garnet Class Destroyer", "sn":"SkyGarn", "tech":"5", "race":["7"] }, { "hid":63, "hn":"Diamond Flame Class Battleship", "sn":"DIAM", "tech":"9", "race":["7"] }, { "hid":64, "hn":"Onyx Class Frigate", "sn":"Onyx", "tech":"8", "race":["7"] }, { "hid":65, "hn":"Topez Class Gunboat", "sn":"Topez", "tech":"3", "race":["7"] }, { "hid":66, "hn":"Opal Class Torpedo Boat", "sn":"Opal", "tech":"2", "race":["7"] }, { "hid":67, "hn":"Crystal Thunder Class Carrier", "sn":"CRYST", "tech":"10", "race":["7"] }, { "hid":68, "hn":"Moscow Class Star Escort", "sn":"Moscow", "tech":"3", "race":["8"] }, { "hid":69, "hn":"Super Star Destroyer", "sn":"SSD", "tech":"6", "race":["8"] }, { "hid":1038, "hn":"D3 Thorn Class Frigate", "sn":"D3B", "tech":"5", "race":["4"] }, { "hid":2, "hn":"Nocturne Class Destroyer", "sn":"Noct", "tech":"2", "race":["1"] }, { "hid":6, "hn":"Banshee Class Destroyer", "sn":"Bansh", "tech":"6", "race":["1"] }, { "hid":1032, "hn":"Bright Heart Light Destroyer", "sn":"BrightB", "tech":"3", "race":["3"] }, { "hid":1033, "hn":"Deth Specula Armoured Frigate", "sn":"DethSpecB", "tech":"6", "race":["3","4"] }, { "hid":1030, "hn":"Valiant Wind Storm-Carrier", "sn":"ValiantB", "tech":"6", "race":["3"] }, { "hid":3033, "hn":"Deth Specula Heavy Frigate", "sn":"DethHeavyB", "tech":"6", "race":["3"] }, { "hid":1034, "hn":"D7b Painmaker Class Cruiser", "sn":"D7b-B", "tech":"2", "race":["4"] }, { "hid":2088, "hn":"Gaurdian C Class Destroyer", "sn":"GaurdC", "tech":"4", "race":["10"] }, { "hid":99, "hn":"Virgo Class Battlestar", "sn":"VIRGO", "tech":"10", "race":["11"] }, { "hid":98, "hn":"Taurus Class Scout", "sn":"Taurus", "tech":"1", "race":["10","11"] }, { "hid":91, "hn":"Deep Space Scout", "sn":"Dscout", "tech":"3", "race":["10"] }, { "hid":90, "hn":"Sage Class Frigate", "sn":"Sage", "tech":"5", "race":["9","10"] }, { "hid":93, "hn":"Armored Transport", "sn":"ArmTrans", "tech":"4", "race":["10"] }, { "hid":92, "hn":"Patriot Class Light Carrier", "sn":"PAT", "tech":"6", "race":["10","11"] }, { "hid":95, "hn":"Little Joe Class Escort", "sn":"Joe", "tech":"2", "race":["11"] }, { "hid":94, "hn":"Rush Class Heavy Carrier", "sn":"RUSH", "tech":"10", "race":["10"] }, { "hid":97, "hn":"Aries Class Transport", "sn":"Aries", "tech":"5", "race":["8","11"] }, { "hid":96, "hn":"Cobol Class Research Cruiser", "sn":"Cobol", "tech":"4", "race":["11"] }, { "hid":11, "hn":"Thor Class Frigate", "sn":"Thor", "tech":"9", "race":["1"] }, { "hid":10, "hn":"Arkham Class Frigate", "sn":"Ark", "tech":"8", "race":["1"] }, { "hid":13, "hn":"Missouri Class Battleship", "sn":"Miss", "tech":"8", "race":["1"] }, { "hid":12, "hn":"Diplomacy Class Cruiser", "sn":"Diplo", "tech":"9", "race":["1"] }, { "hid":15, "hn":"Small Deep Space Freighter", "sn":"SDSF", "tech":"1", "race":["2","3","4","5","6","7","8","9","10","11"] }, { "hid":14, "hn":"Neutronic Fuel Carrier", "sn":"NFC", "tech":"3", "race":["2","3","4","5","7","8","10","11"] }, { "hid":17, "hn":"Large Deep Space Freighter", "sn":"LDSF", "tech":"6", "race":["1","2","3","4","5","6","7","8","9","10","11"] }, { "hid":16, "hn":"Medium Deep Space Freighter", "sn":"MDSF", "tech":"3", "race":["1","2","3","4","5","6","7","8","9","10","11"] }, { "hid":19, "hn":"Kittyhawk Class Carrier", "sn":"Kitty", "tech":"9", "race":["1"] }, { "hid":18, "hn":"Super Transport Freighter", "sn":"SupTF", "tech":"10", "race":["1","2","3","4","5","6","7","8","9","10","11"] }, { "hid":117, "hn":"Brood", "sn":"Brood", "tech":"1", "race":["12"] }, { "hid":2025, "hn":"Saurian Class Heavy Frigate", "sn":"SaurHeavy", "tech":"7", "race":["2"] }, { "hid":1102, "hn":"Scorpius Class Carrier", "sn":"ScorpB", "tech":"6", "race":["11"] }, { "hid":1023, "hn":"T-Rex Class Battleship ©", "sn":"T-RexB", "tech":"10", "race":["2"] }, { "hid":2102, "hn":"Scorpius Class Heavy Carrier", "sn":"ScorpHeavy", "tech":"6", "race":["11"] }, { "hid":1095, "hn":"Little Joe Light Escort", "sn":"JoeB", "tech":"2", "race":["11"] }, { "hid":1039, "hn":"D19c Nefarious Class Destroyer", "sn":"D19c", "tech":"6", "race":["4"] }, { "hid":1054, "hn":"B41b Explorer", "sn":"B41b-B", "tech":"2", "race":["6"] }, { "hid":1055, "hn":"B222b Destroyer", "sn":"B222b", "tech":"5", "race":["6"] }, { "hid":48, "hn":"Skyfire Class Cruiser", "sn":"SkyFire", "tech":"5", "race":["3","5"] }, { "hid":49, "hn":"Madonnzila Class Carrier", "sn":"Madon", "tech":"9", "race":["2"] }, { "hid":46, "hn":"Meteor Class Blockade Runner", "sn":"MCBR", "tech":"5", "race":["5"] }, { "hid":47, "hn":"Red Wind Class Carrier", "sn":"RedWind", "tech":"8", "race":["3","5"] }, { "hid":44, "hn":"Br4 Class Gunship", "sn":"Br4", "tech":"1", "race":["5"] }, { "hid":45, "hn":"Br5 Kaye Class Torpedo Boat", "sn":"Br5", "tech":"3", "race":["5"] }, { "hid":42, "hn":"Lady Royale Class Cruiser", "sn":"Lady", "tech":"5", "race":["5","11"] }, { "hid":43, "hn":"Dwarfstar Class Transport", "sn":"Dwarf", "tech":"3", "race":["5"] }, { "hid":40, "hn":"Little Pest Class Escort", "sn":"Pest", "tech":"2", "race":["4","5"] }, { "hid":41, "hn":"Saber Class Frigate", "sn":"Saber", "tech":"8", "race":["4"] }, { "hid":1, "hn":"Outrider Class Scout", "sn":"Scout", "tech":"1", "race":["1","5"] }, { "hid":5, "hn":"Nebula Class Cruiser", "sn":"Nebula", "tech":"6", "race":["1"] }, { "hid":9, "hn":"Brynhild Class Escort", "sn":"Bryn", "tech":"7", "race":["1"] }, { "hid":2038, "hn":"D3 Thorn Class Cruiser", "sn":"D3B", "tech":"5", "race":["4"] }, { "hid":201, "hn":"Sentry", "sn":"Sentry", "tech":"1", "race":["12"] }, { "hid":203, "hn":"Armoured Nest", "sn":"Armoured Nest", "tech":"1", "race":["12"] }, { "hid":202, "hn":"Nest", "sn":"Nest", "tech":"1", "race":["12"] }, { "hid":205, "hn":"Accelerator", "sn":"Accelerator", "tech":"1", "race":["12"] }, { "hid":204, "hn":"Farm", "sn":"Farm", "tech":"1", "race":["12"] }, { "hid":207, "hn":"Duranium Rock", "sn":"DurRock", "tech":"1", "race":["12"] }, { "hid":206, "hn":"Protofield", "sn":"Protofield", "tech":"1", "race":["12"] }, { "hid":209, "hn":"Molybdenum Rock", "sn":"MolyRock", "tech":"1", "race":["12"] }, { "hid":208, "hn":"Tritanium Rock", "sn":"TritRock", "tech":"1", "race":["12"] }, { "hid":2033, "hn":"Deth Specula Stealth", "sn":"DethStealth", "tech":"6", "race":["4"] }, { "hid":77, "hn":"Pl21 Probe", "sn":"PL21", "tech":"1", "race":["8"] }, { "hid":76, "hn":"Super Star Carrier", "sn":"SSCarrier", "tech":"5", "race":["8"] }, { "hid":75, "hn":"Super Star Frigate", "sn":"SSFrigate", "tech":"4", "race":["8"] }, { "hid":74, "hn":"Super Star Cruiser", "sn":"SSCruiser", "tech":"9", "race":["8"] }, { "hid":73, "hn":"Mig Class Scout", "sn":"Mig", "tech":"1", "race":["8"] }, { "hid":72, "hn":"H-ross Class Light Carrier", "sn":"Hross", "tech":"2", "race":["8"] }, { "hid":71, "hn":"Ru25 Gunboat", "sn":"RU25", "tech":"1", "race":["8"] }, { "hid":70, "hn":"Gorbie Class Battlecarrier", "sn":"GORB", "tech":"10", "race":["8"] }, { "hid":79, "hn":"Golem Class Baseship", "sn":"GOLEM", "tech":"10", "race":["9"] }, { "hid":78, "hn":"Instrumentality Class Baseship", "sn":"INSTRM", "tech":"6", "race":["9"] }, { "hid":1043, "hn":"Dwarfstar II Class Transport", "sn":"DwarfIIB", "tech":"3", "race":["5"] }, { "hid":1041, "hn":"Saber Class Shield Generator", "sn":"SabeB", "tech":"8", "race":["4"] }, { "hid":1040, "hn":"Little Pest Light Escort", "sn":"PestB", "tech":"2", "race":["4","5"] }, { "hid":1047, "hn":"Red Wind Storm-Carrier", "sn":"RedB", "tech":"8", "race":["3","5"] }, { "hid":1049, "hn":"Madonnzila Class Carrier ©", "sn":"MadonB", "tech":"9", "race":["2"] }, { "hid":1048, "hn":"Skyfire Class Transport", "sn":"SkyfireB", "tech":"5", "race":["3","5"] }, { "hid":2006, "hn":"Wild Banshee Class Destroyer", "sn":"BansheeB", "tech":"6", "race":["1"] }, { "hid":2004, "hn":"Vendetta C Class Frigate", "sn":"VendettaC", "tech":"5", "race":["1"] }, { "hid":1059, "hn":"Medium Transport", "sn":"MTb", "tech":"4", "race":["3","4","5","7"] } ]
    var longNamez    = {"default":["a","b","c"]};
    var ynradio      = [1,1,0,0,0,0,1,2,0];            // position index: 0= full/undef; 1=rand/seq; 2=prefix; 3=listSource; 4=longlist; 5=short1, 6=short2, 7=short3, 8=short4 ;
    var ynlabels     = [[" Full Replacement for ALL Ships in the destination list.<br>", " Only make names for ships with the default value (\"<i>"+blankName+"</i>\") in the destination list."], [" Use current sequential order.<br>", " Randomize the order of names in each list before assigning to a ship."], [" None<br>"," Same Prefix:    "," Hull Specific: "], ["LONG: Use the Selected Long List<br>","SHORT: Use the Selected Short Lists"], ["x", "y", "z"], ["a", "b", "c"], ["d", "e", "f"], ["g", "h", "i"] ];
    var chxshort     = [1,1,1];
    var linkerz      = [[1," "], [1,"of"], [0,""]];
    var mergeListName= ["malign", "sublime", "sober"];
    var mergelink    = "<space>";
    var scrollz      = 0;
    var nextgenNames = "< no list yet >";
    var destListz    = "sober";
    var spoofListz   = "sublime";
    var ghostListz   = "sublime";
    var preHull      = "16:MDSF; 17:LDSF; 14:NFC;";      // pattern for parsing ==  hull#id colon hullprefix semicolon
    var preHullNames = {"000":"NADA"};                   // dictionary key=hull id#  value=prefix name
//- --- --- - - --- --- ---- - - --- --- --- ---- - - - --- - -- -- ---- - - --- -
// START PLUGIN ACTIVE CODE . . . . . . . . . . . . . . .
//- --- --- - - --- --- ---- - - --- --- --- ---- - - - --- - -- -- ---- - - --- -
var shipNames = {
    //- --- --- - - --- --- ---- - - --- --- --- ---- - - --- --- - - --- --- ---- - - --- --- --- ---- -
    //- --- --- - - --- --- ---- - - --- --- --- ---- - - --- --- - - --- --- ---- - - --- --- --- ---- -
    // BEGIN DashBoard HTML Construction
    //- --- --- - - --- --- ---- - - --- --- --- ---- - - --- --- - - --- --- ---- - - --- --- --- ---- -
    //- --- --- - - --- --- ---- - - --- --- --- ---- - - --- --- - - --- --- ---- - - --- --- --- ---- -
    menuMaster: function (){
        vgap.hotkeysOn = false;    // disable hotkey filters to allow for typed entries.
        vgap.dash.content.empty();
        var htmlbuild = "<div><p><h1><font color='#EF8434'><b>Baptismal Font of Eternal New Ship Names and Warrior Virtues of Victory</b></font></h1></p><hr></div>";
        $(htmlbuild).appendTo(vgap.dash.content);

    // Build the DashBoard as one large table wih each section as a row in that table. Make the whole division scrollable.
        htmlbuild  = "<div id='baptismDash' style='height: "+($("#DashboardContent").height()-100)+"px;'>";
        htmlbuild += "<table align='left' cellpadding='0' cellspacing='0' border='0'>";
        //htmlbuild += "<table align='left' cellpadding='0' cellspacing='0' border='0' style='margin-left:10px'>";

    // Display the current LIST that is VISIBLE . . . .
        htmlbuild += "<tr><td><div>";
        htmlbuild += "<table align='left' width='800' cellpadding='0' cellspacing='0' border='0'><tr><td width='50%'><h3>Current VISIBLE list of Ship Names: &nbsp</h3></td>";
        if (vgap.version >= 4.0){
            htmlbuild += "<td width='50%'><textarea name='currentList' cols=30 rows=1 style='font-size:14px' readonly> &nbsp"+showList+"</textarea></td>";
        } else {
            htmlbuild += "<td width='50%'><textarea name='currentList' cols=30 rows=1 style='font-size:16px' readonly> &nbsp"+showList+"</textarea></td>";
        }
        htmlbuild += "</tr></table></div>";
        htmlbuild += "</td></tr>";
        htmlbuild += "<tr><td>Manual edits to ship names made on the ship management screen will be saved to this current visible list.<br>";
        htmlbuild += "NOTE: The ship names visible on the starmap are the ship names that other commanders will see when you click \"END TURN\" .<hr></td></tr>";

    // 1. SELECT a list of names and your ships will all be liberated with the karma that comes from a blood warrior's naming ceremony . . . . . .
        htmlbuild += "<tr><td>";
        htmlbuild += "<p><h3><font color='#F8CE50'>1. SELECT a list of names and your ships will all be liberated with the karma that comes from a blood warrior's naming ceremony: </font></h3>";
        htmlbuild += "PRIVATE NAMES: Use a list of notes or tactical info when working on your turn file.<br>PUBLIC NAMES: Before clicking \"End Turn\", switch your ship names to the list that you want other commanders to see.</p><p>";
        for (var j=0; j<nameLists.length;j++){ htmlbuild += shipNames.buildRadioButtons("currentList", "changeShipList", nameLists[j], "yes") + " &nbsp"; }
        var current_shipNames = shipNames.getCurrentShipList(showList);
        if (debug) { console.log("   >>>          current_shipNames = \n"+current_shipNames);}
        if (vgap.version >= 4.0){
            htmlbuild += "</p><textarea name='current' cols=60 rows=12 readonly style='overflow:auto;font-size:12px'>"+current_shipNames+"</textarea>";
        } else {
            htmlbuild += "</p><textarea name='current' cols=60 rows=12 readonly style='overflow:auto'>"+current_shipNames+"</textarea>";
        }
        htmlbuild += "<hr>";
        htmlbuild += "</td></tr>";

    // 2. SELECT the default ship names that are used when you open a turn file . . . . . .
        htmlbuild += "<tr><td>";
        htmlbuild += "<p></p><p><h3><font color='#F8CE50'>2. SELECT the default ship names that are used when you open a turn file:</font></h3>";
        htmlbuild += "NOTE: The \"hull\" option is the default list of hull names used by Host and as long as this plugin setting remains \"hull\" <br>your turn file will not be affected in anyway by this Ship Baptism plugin.</p>";
        for (j=0; j<(nameLists.length); j++){ htmlbuild += shipNames.buildDefaultListSaveButtons(nameLists[j], "setDefaultList") + " &nbsp"; }
        htmlbuild += "<hr>";
        htmlbuild += "</td></tr>";

    // 3. GENERATE Custom Ship Names from defined lists of people, places, things, words and random combinations thereof . . . . .
        htmlbuild += "<tr><td><div>";
        htmlbuild += "<p><h3><font color='#F8CE50'>3. GENERATE Custom Ship Names from defined lists of people, places, things, words and random combinations thereof . . . </font></h3>";
        htmlbuild += "<i>See Section 7 below for View/Edit/Save options for working with both Long and Short source lists.</i></p>";
        htmlbuild +=    "<table cellpadding='2' cellspacing='4' border='0'>";
        // -- --- - - - BLOCK 1   -   - -    -  -- - -
        htmlbuild +=       "<tr><td><h3><font color='#FCE94E'>SOURCE LIST OPTIONS:</font></h3></td><td></td></tr>";
        htmlbuild +=       "<tr><td style='text-align:right;vertical-align:top;'><b>Select a source Long Name List:</b></td><td>";
        for (j=0; j<longLists.length;j++){ htmlbuild += shipNames.ynRadio(4, "listLongz", j); }
        htmlbuild +=       "<br></td></tr>";
        htmlbuild +=       "<tr><td style='text-align:right;vertical-align:top;'><b>Select sources and order of Short Word Lists:</b></td><td>";
        for (j=0; j<3;j++){
            htmlbuild += shipNames.ynCheck("shortz", j);
            for (var k=0; k<4;k++){  htmlbuild += shipNames.ynRadio(j+5, "shortlist"+j+"z", k, j);}
            htmlbuild += "<br>";
        }
        htmlbuild +=       "<br></td></tr>";
        htmlbuild +=       "<tr><td style='text-align:right;vertical-align:top;'><b>Linker words for Short Word Lists:</b></td><td>";
        for (j=0; j<2;j++){
            htmlbuild += shipNames.ynCheckLinkerz("linkerz", j);
            var link = linkerz[j][1];
            if (link == " "){ link = "<space>";}
            if (link == "") { link = "<null>";}
            htmlbuild += "<textarea id='linkwordz"+j+"' cols=10 rows=1 >"+link+"</textarea> &nbsp";
            htmlbuild += shipNames.buildSaveButtons("SAVE", "saveLinker", link, j) + "<br>";
        }
        htmlbuild +=       "<br></td></tr>";
        // -- --- - - - BLOCK 2    -   - -    -  -- - -
        htmlbuild +=       "<tr><td><hr></td><td></td></tr>";
        htmlbuild +=       "<tr><td><h3><font color='#FCE94E'>BUILD OPTIONS:</font></h3></td><td></td></tr>";
        htmlbuild +=       "<tr><td style='text-align:right;vertical-align:top;'><b>Mode for adding names to the destination list:</b></td><td>";
        for (j=0; j<2;j++){ htmlbuild += shipNames.ynRadio(0, "fullundefz", j); }
        htmlbuild +=       "<br></td></tr>";
        htmlbuild +=       "<tr><td style='text-align:right;vertical-align:top;'><b>List Order for ship assignments:</b></td><td>";
        for (j=0; j<2;j++){ htmlbuild += shipNames.ynRadio(1, "seqrandz", j); }
        htmlbuild +=       "<br></td></tr>";
        //preabrv   = longNamez['prefix_abvr'];
        htmlbuild +=       "<tr><td style='text-align:right;vertical-align:top;'><b>Add an abbreviation as a prefix to each ship name:</b></td><td>";
        for (j=0; j<3;j++){
            htmlbuild += shipNames.ynRadio(2, "prefixz", j);
            if (j == 1){
                htmlbuild += "== <textarea id='preFix' cols=10 rows=1> "+preabrv+" </textarea>&nbsp &nbsp" + shipNames.buildSaveButtons("SAVE", "savePREABRV", "", 0) + "<br>";
            }
            if (j == 2){
                htmlbuild += "== edit hull#id:prefix; <textarea id='HullpreFix' cols=50 rows=1> "+preHull+" </textarea>&nbsp &nbsp" + shipNames.buildSaveButtons("SAVE", "saveHULLABRV", "", 0) + "<br>";
            }
        }

        htmlbuild +=       "<br></td></tr>";
        // -- --- - - - BLOCK 3   -   - -    -  -- - -
        htmlbuild +=       "<tr><td><hr></td><td></td></tr>";
        htmlbuild +=       "<tr><td><h3><font color='#FCE94E'>COMPILE NEW LIST:</font></h3></td><td></td></tr>";
        htmlbuild +=       "<tr><td style='text-align:right;vertical-align:top;'><b>Select input LIST TYPE to be used:</b></td><td>";
        for (j=0; j<2;j++){ htmlbuild += shipNames.ynRadio(3, "listSourcez", j); }
        htmlbuild +=       "<br></td></tr>";
        htmlbuild +=       "<tr><td style='text-align:right;vertical-align:top;'><b>Select the destination list to be filled with new names:</b></td>";
        htmlbuild +=       "<td style='text-align:left'>";
        for (j=0; j<nameLists.length;j++){ htmlbuild += shipNames.buildRadioButtons("destinationList", "changeDest", nameLists[j], "yes") + " &nbsp"; }
        htmlbuild +=       "<br></td></tr>";
        htmlbuild +=       "<tr><td style='text-align:right;vertical-align:top;'><input type='button' value='     GENERATE & VIEW      ' onclick='vgap.plugins[\""+plgname+"\"].generateNames()'/><br>";
        htmlbuild +=       "<br><input type='button' value=' WRITE TO DESTINATION LIST ' onclick='vgap.plugins[\""+plgname+"\"].saveGeneratedNames()'/></td>"
        htmlbuild +=       "<td><textarea name='newList' cols=60 rows=12 readonly style='overflow:auto'>"+nextgenNames+"</textarea></td></tr>";
        // -- --- - - - -- --- - -  - --     -   - -    -  -- - -
        htmlbuild +=    "</table>";
        htmlbuild += "</div><hr></td></tr>";
        // -- --- - - - END ROWs    -   - -    -  -- - -

    // 4. SPOOFING ship names using the HULL names for a different race . . . .
        htmlbuild += "<tr><td>";
        htmlbuild += "<table><td colspan='2' style='text-align:left;vertical-align:top;'><h3><font color='#F8CE50'>4. SPOOFING ships using the HULL names from a different Race or combination of Races:</font></h3></td>";
        htmlbuild += "<tr><td style='text-align:right;vertical-align:top;'> &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp Select the Races from which hull names will be used: &nbsp &nbsp</td><td style='text-align:left;vertical-align:top;'>";
        htmlbuild += "<textarea id='racespoofz' cols=20 rows=1 >1,2,3</textarea> (<i>Enter a single race number or several race numbers separated by commas</i>)</td></tr>";
        htmlbuild += "<tr><td style='text-align:right;vertical-align:top;'>Enter the tech level range to be used: &nbsp &nbsp</td><td style='text-align:left;vertical-align:top;'>";
        htmlbuild += "Lowest: <textarea id='lotechz1' cols=5 rows=1 >1</textarea> &nbsp &nbsp Highest: <textarea id='hitechz2' cols=5 rows=1 >10</textarea> &nbsp</td></tr>";
        htmlbuild += "<tr><td style='text-align:right;vertical-align:top;'>Select the destination List: &nbsp &nbsp</td><td style='text-align:left;vertical-align:top;'>";
        for (j=0; j<nameLists.length;j++){ htmlbuild += shipNames.buildRadioButtons("spoofList", "changeDestSpoof", nameLists[j], "yes") + " &nbsp"; }
        htmlbuild += "</td></tr>";
        htmlbuild += "<tr><td></td><td style='text-align:left;vertical-align:top;'><input type='button' value='WRITE SPOOF NAMES TO LIST' onclick='vgap.plugins[\""+plgname+"\"].spoofNames()'/> </td></tr></table>";
        htmlbuild += "<hr>";
        htmlbuild += "</td></tr>";

    // 5. GHOSTING ship names by swapping HULL names for ships at same x,y position . . . .
        htmlbuild += "<tr><td>";
        htmlbuild += "<table><td colspan='2' style='text-align:left;vertical-align:top;'><h3><font color='#F8CE50'>5. GHOSTING ship names by swapping HULL names for ships at same x,y position:</font></h3></td>";
        htmlbuild += "<tr><td style='text-align:right;vertical-align:top;'> &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp Select the destination List: &nbsp &nbsp</td><td style='text-align:left;vertical-align:top;'>";
        for (j=0; j<nameLists.length;j++){ htmlbuild += shipNames.buildRadioButtons("ghostList", "changeDestGhost", nameLists[j], "yes") + " &nbsp"; }
        htmlbuild += "</td></tr>";
        htmlbuild += "<tr><td></td><td style='text-align:left;vertical-align:top;'><input type='button' value='WRITE GHOST NAMES TO LIST' onclick='vgap.plugins[\""+plgname+"\"].ghostNames()'/> </td></tr></table>";
        htmlbuild += "<hr>";
        htmlbuild += "</td></tr>";

    // 6. MERGE ship names by combining two lists . . . .
        htmlbuild += "<tr><td>";
        htmlbuild += "<table><td colspan='2' style='text-align:left;vertical-align:top;'><h3><font color='#F8CE50'>6. MERGE two name lists and save the combo ship names:</font></h3></td>";
        htmlbuild += "<tr><td style='text-align:right;vertical-align:top;'> &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp Select the FIRST NAME List: &nbsp &nbsp</td><td style='text-align:left;vertical-align:top;'>";
        for (j=0; j<nameLists.length;j++){ htmlbuild += shipNames.buildRadioButtons("mergeList1", "mergeDest1", nameLists[j], "yes") + " &nbsp"; }
        htmlbuild += "<tr><td style='text-align:right;vertical-align:top;'> &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp Select the SECOND NAME List: &nbsp &nbsp</td><td style='text-align:left;vertical-align:top;'>";
        for (j=0; j<nameLists.length;j++){ htmlbuild += shipNames.buildRadioButtons("mergeList2", "mergeDest2", nameLists[j], "yes") + " &nbsp"; }
        htmlbuild += "<tr><td style='text-align:right;vertical-align:top;'> &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp Select the destination List: &nbsp &nbsp</td><td style='text-align:left;vertical-align:top;'>";
        for (j=0; j<nameLists.length;j++){ htmlbuild += shipNames.buildRadioButtons("mergeList3", "mergeDest3", nameLists[j], "yes") + " &nbsp"; }
        htmlbuild += "<tr><td style='text-align:right;vertical-align:top;'> &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp Enter linker word (or leave as \"<NULL>\"): &nbsp &nbsp</td><td style='text-align:left;vertical-align:top;'>";
        htmlbuild += "<textarea id='mergelink01' cols=10 rows=1 >"+mergelink+"</textarea> &nbsp ";             // + shipNames.buildSaveButtons("SAVE", "saveMergeLinker", mergelink, j) + "</td></tr>";
        htmlbuild += "</td></tr>";
        htmlbuild += "<tr><td></td><td style='text-align:left;vertical-align:top;'><input type='button' value='WRITE MERGE NAMES TO LIST' onclick='vgap.plugins[\""+plgname+"\"].mergeNames()'/> </td></tr></table>";
        htmlbuild += "<hr>";
        htmlbuild += "</td></tr>";

    // 7. COPY the current ship names shown on the starmap to a different named list . . . .
        htmlbuild += "<tr><td>";
        htmlbuild += "<p></p><p><h3><font color='#F8CE50'>7. COPY the current ship names shown on the starmap to a different named list:</font></h3> Warning: This will overwrite the contents of the destination target list.</p>";
        for (j=0; j<nameLists.length;j++){ htmlbuild += shipNames.buildSaveButtons(nameLists[j], "saveShipNames", nameLists[j]) + " &nbsp"; }
        htmlbuild += "<hr>";
        htmlbuild += "</td></tr>";

    // 8. RESET a single list of ship names back to the original default name value . . . .
        htmlbuild += "<tr><td>";
        htmlbuild += "<p></p><p><h3><font color='#F8CE50'>8. RESET a single list of ship names back to the original default values:</font></h3> Warning: This will overwrite the contents of the destination target list.</p>";
        for (j=0; j<nameLists.length;j++){ htmlbuild += shipNames.buildSaveButtons(nameLists[j], "resetNameList", j) + " &nbsp"; }
        htmlbuild += "<hr>";
        htmlbuild += "</td></tr>";

        // -- --- - - - -   - -- -  -- --  - -   - - -- - - -- - -  - -  - -    -   - -    -  -- - -

    // 9a. Section for adding new Custom SHORT Lists . . . . .
        htmlbuild += "<tr><td>";
        htmlbuild += "<p><h3><font color='#F8CE50'>9. EDIT/SAVE Custom Working Lists for compiling your Virtuous Ship Names of Righteousness and Glory:</font></h3></p>";
        htmlbuild += "<h3><b>SHORT SOURCE LISTS:</b></h3> The names in each of these short lists are intended to be randomly combined to generate novel shipnames (e.g., \"adjective1 adjective2 of noun3\").<br>";
        htmlbuild += "Think recombinatorial diversity: 3 lists of 10 words each can be combined to form 1000 unique ship names.<br>";
        htmlbuild += "The text areas can be edited and saved as comma-separated lists of words (with no quotes or apostrophes).<br>";
        htmlbuild += "Note the options in section #4 above to place linker words between list entries and an option for a prefix.<br>";
        htmlbuild += "<table align='left' cellpadding='0' cellspacing='0' border='0'>";
        var displayShortLists = shipNames.makeShortTextDisplays();
        for (j=0; j<shortLists.length; j++){
            htmlbuild += "<tr><td width='10%' align='right'>"+shortLists[j]+": &nbsp</td>";
            htmlbuild += "<td width='90%'><textarea id='zbaptism"+j.toString()+"' name='xbaptism"+j.toString()+"' cols=120 rows=2 style='overflow:auto'>"+displayShortLists[j]+"</textarea></td></tr>";
            htmlbuild += "<tr><td align='right'><input type='button' value='RENAME' onclick='vgap.plugins[\""+plgname+"\"].shortlistRename(\""+j+"\")'/>&nbsp &nbsp </td>";
            htmlbuild += "<td><input type='button' value='CLEAR' onclick='vgap.plugins[\""+plgname+"\"].shortlistClear(\""+j+"\")'/> &nbsp &nbsp";
            htmlbuild += "<input type='button' value='SAVE' onclick='vgap.plugins[\""+plgname+"\"].shortlistSave(\""+j+"\")'/></td></tr>";
            htmlbuild += "<tr><td>&nbsp</td><td>&nbsp</td><td>&nbsp</td></tr>";
        }
        htmlbuild += "</table>";
        htmlbuild += "</td></tr>";

    // 9b. Section for adding new Custom LONG Lists . . . . .
        htmlbuild += "<tr><td>";
        htmlbuild += "<br><h3><b>LONG SOURCE LISTS:</b></h3> The names/words in these long lists allow one to quickly make a thematic change to your ships using defined lists.<br>";
        htmlbuild += "These entries can be applied either sequentially or randomly. If there are more ships than names in your list, the names will be repeated.<br>";
        htmlbuild += "These text areas can be edited and saved. Just clear an existing entry and copy/paste a new comma-separated string <br> of names (with no quotes or apostrophes).<br>";
        htmlbuild += "<table align='left' cellpadding='0' cellspacing='0' border='0'>";
        var displayLongLists = shipNames.makeLongTextDisplays();
        for (j=0; j<longLists.length; j++){
            htmlbuild += "<tr><td width='10%' align='right'>"+longLists[j]+": &nbsp</td>";
            htmlbuild += "<td width='90%'><textarea id='xbaptism"+j.toString()+"' name='xbaptism"+j.toString()+"' cols=120 rows=5 style='overflow:auto'>"+displayLongLists[j]+"</textarea></td></tr>";
            htmlbuild += "<tr><td align='right'><input type='button' value='RENAME' onclick='vgap.plugins[\""+plgname+"\"].listRename(\""+j+"\")'/>&nbsp &nbsp </td>";
            htmlbuild += "<td><input type='button' value='CLEAR' onclick='vgap.plugins[\""+plgname+"\"].listClear(\""+j+"\")'/> &nbsp &nbsp";
            htmlbuild += "<input type='button' value='SAVE' onclick='vgap.plugins[\""+plgname+"\"].listSave(\""+j+"\")'/></td></tr>";
            htmlbuild += "<tr><td>&nbsp</td><td>&nbsp</td><td>&nbsp</td></tr>";
        }
        htmlbuild += "</table>";
        htmlbuild += "<br>.</br><hr></td></tr>";

    // 10. Wrap-up the dashboard pane . . . . . . . . . . . . . . . . . . .
        htmlbuild += "</table></div>";
        if (debug){console.log("     > menu build completed");}
        this.pane = $(htmlbuild).appendTo(vgap.dash.content);
        this.pane.jScrollPane();
        var bdash = $('#baptismDash').data('jsp');
        bdash.scrollToY(scrollz,false);
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- - - --- --- - - --- --- ---- - - --- --- --- ---- -
    // END of DashBoard HTML Construction
    //- --- --- - - --- --- ---- - - --- --- --- ---- - - --- --- - - --- --- ---- - - --- --- --- ---- -
    //- --- --- - - --- --- ---- - - --- --- --- ---- - - --- --- - - --- --- ---- - - --- --- --- ---- -
    //- --- --- - - --- --- ---- - - --- --- --- ---- - - --- --- - - --- --- ---- - - --- --- --- ---- -
    generateNames: function(){
        // -- --- - - --- - -- - Grab Input Variables -- ---- -- - --- --- - - - -
        var listSource = "undefined";
        var radioz = document.getElementsByName('listSourcezy');
        for (var i = 0; i < radioz.length; i++)
        {   if (radioz[i].checked){   listSource = (i == 0 ? "LONG": "SHORT");  }   }
        // . ..   . .. . . ..    . .. . .. .. ..  . .. . . ... . . . .
        var listLong = 0;
        radioz = document.getElementsByName('listLongzy');
        for (i = 0; i < radioz.length; i++)
        {   if (radioz[i].checked){   listLong = i;  }   }
        // . ..   . .. . . ..    . .. . .. .. ..  . .. . . ... . . . .
        var listShort = [ 0, 0, 0];       // short word selection:  word1, word2, word3; 1/0= use or (don't use)
        var shortz    = [ 0, 0, 0];       // position of short list to be used in word1, word2 or word3 position
        for (i = 0; i < 3; i++) {
            var tagx = "shortz"+i.toString();
            var boxz = document.getElementById(tagx);
            if (boxz.checked){
                listShort[i] = 1;
                var tagz = ("shortlist"+i.toString()+"zy");
                var radiozy = document.getElementsByName(tagz);
                for (var jk=0; jk < 4; jk++){
                    if (radiozy[jk].checked){  shortz[i] = jk+1; }
        }   }   }
        if (debug) {console.log("listShort = ", listShort);}
        if (debug) {console.log("shortz = ", shortz);}
        // . ..   . .. . . ..    . .. . .. .. ..  . .. . . ... . . . .
        for (i = 0; i < 2; i++){
            var lname = "linkerz"+i.toString();
            if (document.getElementsByName(lname).checked){
                linkerz[i][0] = 1;
                var tabox = "linkwordz"+i.toString();
                linkerz[i][1] = document.getElementById(tabox).value;
        }   }
        // . ..   . .. . . ..    . .. . .. .. ..  . .. . . ... . . . .
        radioz = document.getElementsByName('prefixzy');
        var preFIX = (radioz[0].checked ? 0 : 1);
        if (preFIX == 1){ preFIX = (radioz[1].checked ? 1 : 2);}
        if (preFIX == 1){ preabrv = document.getElementById('preFix').value; }
        if (preFIX == 2){ shipNames.loadHullPrefixNames(); }
        if (debug) {console.log("preFIX = ", preFIX);}
        // . ..   . .. . . ..    . .. . .. .. ..  . .. . . ... . . . .
        radioz = document.getElementsByName('seqrandzy');
        var seqRand = (radioz[0].checked ? 0 : 1);
        // . ..   . .. . . ..    . .. . .. .. ..  . .. . . ... . . . .
        // . ..   . L  O  N  G    L  I  S  T  .. . . ..    . .. . .. .
        // . ..   . .. . . ..    . .. . .. .. ..  . .. . . ... . . . .
        // . ..   . .. . . ..    . .. . .. .. ..  . .. . . ... . . . .
        var nameList = [];
        if (listSource == "LONG"){
//             switch(listLong){
//                 case 0: nameList = defaultLong1.slice(0); break;
//                 case 1: nameList = defaultLong2.slice(0); break;
//                 case 2: nameList = defaultLong3.slice(0); break;
//                 case 3: nameList = defaultLong4.slice(0); break;
//             }
            shipNames.loadDefaultLists();                // refresh lists to load any previous edits or changes
            nameList = longNamez[longLists[listLong]]

            // Make the name list; Refresh the example textarea box . . . . . . . .
            if (preFIX == 0){ var action = "do not change nameList items";}
            if (preFIX == 1){
                for (i=0; i < nameList.length; i++){
                    nameList[i] = preabrv.trim()+" "+nameList[i]
            }   }
            if (preFIX == 2){
                for (i=0; i < nameList.length; i++){
                    nameList[i] = "<prehull> "+nameList[i]
            }   }
            if (seqRand == 1){
                for (i = nameList.length - 1; i > 0; i--) {
                    var pos = Math.floor(Math.random() * (i + 1));
                    [nameList[i], nameList[pos]] = [nameList[pos], nameList[i]];
            }    }
            nextgenNames = nameList[0];
            for (i=1; i < nameList.length; i++){  nextgenNames = nextgenNames+"\n"+nameList[i]; }
            scrollz = $('#baptismDash').data('jsp').getContentPositionY();
            shipNames.menuMaster();
        }
        // . ..   . .. . . ..    . .. . .. .. ..  . .. . . ... . . . .
        // . ..   .   S  H  O  R  T    L  I  S  T   .. . . ..    . . .
        // . ..   . .. . . ..    . .. . .. .. ..  . .. . . ... . . . .
        // . ..   . .. . . ..    . .. . .. .. ..  . .. . . ... . . . .
        if (listSource == "SHORT"){
            // Parse the list order to be used . . . .
            // var "listorder" will hold the index number of the shortlist to be used in word position 1, 2, 3 (-1 = no word)
            nextgenNames = "";
            var listorder = [-1, -1, -1, -1];
            for (i=0;i<4;i++){  // iterate through the possible short word lists . . . . . .
                for (var j=0;j<3;j++){ if (shortz[j] == (i+1)){ listorder[i] = j;} } // iterate through possible word positions
            }
            if (debug) {console.log("listorder = ", listorder);}
            var words = [["undefined"],["undefined"],["undefined"]];
            var wordz = [longNamez[shortLists[0]].slice(0), longNamez[shortLists[1]].slice(0), longNamez[shortLists[2]].slice(0), longNamez[shortLists[3]].slice(0)];
            for (i=0;i<4;i++){
                switch(listorder[i]){
                    case 0:words[0] = wordz[i];break;
                    case 1:words[1] = wordz[i];break;
                    case 2:words[2] = wordz[i];break;
                    break;
                }
            }
            if (debug) {console.log("words = ", words);}
            var wcount = 0
            for (i=0;i<4;i++){ if(listShort[i] == 1){wcount += 1;}}
            var pid = vgap.player.id;
            var scount = 0
            for (j = 0; j < vgap.ships.length; j++) {
                var ship = vgap.ships[j];
                if (ship.ownerid == pid){ scount += 1; }
            }
            var usedindex = [[],[],[],[]];
            for (var k=0;k<scount;k++){
                var namewords = "";
                if (preFIX == 1){ namewords = preabrv.trim()+" ";}
                if (preFIX == 2){ namewords = "<prehull> "; }
                for (i=0;i<wcount;i++){
                    var randz = [];
                    for (var m=0; m<10; m++){ randz.push(Math.floor(Math.random()* words[i].length));}
                    var rint  = Math.floor(Math.random()* 10);
                    var rindx = randz[rint];
                    // --- -- - ---  - -- --- -  - - - ---- -- --- --
                    var notdone = 1;
                    var rcount = 0;
                    while(notdone){
                        if (!(usedindex[i].includes(rindx))){
                            usedindex[i].push(rindx);
                            notdone = 0;
                        } else {
                            rindx += 1;
                            if (rindx == words[i].length){ rindx = 0; }
                            rcount += 1;
                            if (rcount == words[i].length){
                                usedindex[i] = [];
                            }
                        }
                    }
                    // --- -- - ---  - -- --- -  - - - ---- -- --- --
                    namewords = namewords + words[i][rindx];
                    if (linkerz[i][0] == 1 && (i+1) < wcount){  // don't use linker if last word.
                        if (linkerz[i][1] == " "){
                            namewords = namewords + linkerz[i][1];
                        }else{
                            namewords = namewords + " " + linkerz[i][1] + " ";
                }   }   }
                if (k==0){ nextgenNames = namewords;}
                else { nextgenNames = nextgenNames+"\n"+namewords;}
            }
            scrollz = $('#baptismDash').data('jsp').getContentPositionY();
            shipNames.menuMaster();
       }
       // . ..   . .. . . ..    . .. . .. .. ..  . .. . . ... . . . .
       // . ..   . .. . . ..    . .. . .. .. ..  . .. . . ... . . . .
       // . ..   . .. . . ..    . .. . .. .. ..  . .. . . ... . . . .
       // . ..   . .. . . ..    . .. . .. .. ..  . .. . . ... . . . .
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    saveGeneratedNames: function(){
        // Parse params . . . . . . . . . . . . . .
        // . ..   . .. . . ..    . .. . .. .. ..  . .. . . ... . . . .
        var destindex = 0;
        var radioz = document.getElementsByName('destinationList');
        for (var i = 0; i < radioz.length; i++)
        {   if (radioz[i].checked){   destindex = i; break; } }
        //console.log(">>> destindex = "+destindex+"; list name = "+nameLists[destindex])
        // . ..   . .. . . ..    . .. . .. .. ..  . .. . . ... . . . .
        radioz = document.getElementsByName('fullundefzy');
        var modeList = (radioz[0].checked ? 0 : 1);
        // . ..   . .. . . ..    . .. . .. .. ..  . .. . . ... . . . .
        radioz = document.getElementsByName('prefixzy');
        var preFIX = (radioz[0].checked ? 0 : 1);
        if (preFIX == 1){
            preFIX = (radioz[1].checked ? 1 : 2);
        }

        if (preFIX == 1){ preabrv = document.getElementById('preFix').value; }
        if (preFIX == 2){ preabrv = document.getElementById('preFix').value; shipNames.loadHullPrefixNames(); }
        // . ..   . .. . . ..    . .. . .. .. ..  . .. . . ... . . . .
        // Save nextgen names to the designated list . . . . .
        var namesToUse = nextgenNames.split("\n");
        var destlist   = nameLists[destindex];
        var pid = vgap.player.id;
        var nameindex = 0
        for (var j = 0; j < vgap.ships.length; j++) {
            var ship = vgap.ships[j];
            if (ship.ownerid == pid){
                var nameflag = 1;
                if (debug){console.log("mode="+modeList+", ship="+ship.name+", blank="+blankName)};
                if (modeList == 1 && baptism_namez[ship.id][destlist] !== blankName){ nameflag = 0;}
                if (nameflag == 1){
                    var newname = namesToUse[nameindex];
                    if (preFIX == 1) { newname = newname.replace(/<prehull>/, preabrv.trim());}
                    if (preFIX == 2 && newname.startsWith("<prehull>") ){
                        if (ship.hullid.toString() in preHullNames){
                            var hid = ship.hullid.toString();
                            newname = newname.replace(/<prehull>/,preHullNames[hid]);
                        } else { newname = newname.replace(/<prehull>/, preabrv.trim()); }
                    }
                    baptism_namez[ship.id][destlist] = newname;
                    if (debug){console.log("list="+destlist+", name="+newname)};
                    ship.name = baptism_namez[ship.id][destlist];
                    ship.changed = 1;
                    nameindex += 1;
                    // if at end of name list, start over at index position 0
                    if (nameindex == namesToUse.length){ nameindex = 0; }
        }   }   }
        nextgenNames = "< Names Saved >"
        showList = destlist;
        shipNames.saveNames(noteIDnamez, nameNoteType, baptism_namez);
        shipNames.changeShipList(showList);
        scrollz = 0;
        shipNames.menuMaster();
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    spoofNames: function(){
        var racenumz = document.getElementById('racespoofz').value.trim().split(",");
        var numerics = 1;
        var letters = /[a-zA-Z]+/;
        for (var i=0; i<racenumz.length; i++){
            if (racenumz[i].match(letters)){
                alert("Use only integers from 1 to 12 to designate race.");
                return;
        }    }
        var lotech   = parseInt(document.getElementById('lotechz1').value);
        var hitech   = parseInt(document.getElementById('hitechz2').value);
        var namesToUse = [];
        for (var k=0; k<hullNamez.length; k++) {
            if (parseInt(hullNamez[k].hid) < 500 && hullNamez[k].race.length < 4){
                var shiptech  = parseInt(hullNamez[k].tech);
                if (shiptech >= lotech && shiptech <= hitech){
                    var foundz = 0;
                    for (var ki=0; ki < racenumz.length; ki++){
                        var spoofrace = racenumz[ki];
                        for (var kj=0; kj<hullNamez[k].race.length; kj++){
                            var hrace = hullNamez[k].race[kj];
                            if (spoofrace == hrace){
                                foundz = 1;
                    }    }    }
                    if (foundz == 1){ namesToUse.push(hullNamez[k].hn.toUpperCase());}
        }    }   }
        if (namesToUse.length < 2){
            alert("Less than 2 ships were found.\nCheck your input filter values.\nTry again.");
            return;
        }
        // shuffle list . . . . . .
        for (var ik = namesToUse.length - 1; ik > 0; ik--) {
            var jk = Math.floor(Math.random() * (ik + 1));
            var tempxk = namesToUse[ik];
            namesToUse[ik] = namesToUse[jk];
            namesToUse[jk] = tempxk;
        }
        // rename ships . . . . . .
        var pid = vgap.player.id;
        var nameindex = 0
        for (var j = 0; j < vgap.ships.length; j++) {
            var ship = vgap.ships[j];
            if (ship.ownerid == pid){
                baptism_namez[ship.id][spoofListz] = namesToUse[nameindex];
                ship.name = baptism_namez[ship.id][spoofListz];
                ship.changed = 1;
                nameindex += 1;
                // if at end of name list, start over at index position 0
                if (nameindex == namesToUse.length){ nameindex = 0; }
        }   }   //}
        showList = spoofListz;
        shipNames.saveNames(noteIDnamez, nameNoteType, baptism_namez);
        scrollz = 0;
        shipNames.menuMaster();
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    ghostNames: function(){
        var shiplocz = {};
       // locate ships . . . . . .
        var pid = vgap.player.id;
        for (var j = 0; j < vgap.ships.length; j++) {
            var ship = vgap.ships[j];
            if (ship.ownerid == pid){
                baptism_namez[ship.id][ghostListz] = baptism_namez[ship.id]["hull"];
                var loc = ship.x+":"+ship.y;
                if (!(loc in shiplocz)){   shiplocz[loc] = ship.id.toString(); }
                else {                     shiplocz[loc] = shiplocz[loc] + ","+ship.id.toString();}
        }   }
        // rename ships . . . . . .
        var nameindex = 0
        for (var locz in shiplocz) {
            var shipidz = shiplocz[locz].split(",");
            if (shipidz.length > 1){
                var hullnamez = [];
                for (j=0; j < shipidz.length;j++){
                    var sidint = parseInt(shipidz[j]);
                    hullnamez.push(baptism_namez[sidint]["hull"]);
                }
                // scramble order of hull names . . . . . . . . . .
                var N = hullnamez.length;
                var HN = [hullnamez[N-1]];
                for (var i = 0; i < N-1; i++) {
                    HN.push(hullnamez[i]);
                }
                var scount = 0;
                for (j=0; j < shipidz.length;j++){
                    sidint = parseInt(shipidz[j]);
                    baptism_namez[sidint][ghostListz] = HN[scount];
                    scount += 1;
        }   }   }
        for (j = 0; j < vgap.ships.length; j++) {
            ship = vgap.ships[j];
            if (ship.ownerid == pid){
                ship.name = baptism_namez[ship.id][ghostListz];
                ship.changed = 1;
                nameindex += 1;
        }   }
        showList = ghostListz;
        shipNames.saveNames(noteIDnamez, nameNoteType, baptism_namez);
        scrollz = 0;
        shipNames.menuMaster();
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    mergeNames: function(){
        var pid = vgap.player.id;
        var n1 = mergeListName[0];
        var n2 = mergeListName[1];
        var d3 = mergeListName[2];
        var tabox = "mergelink01";
        var linker = document.getElementById(tabox).value
        if (linker == "<space>"){ linker = " ";}
        else if (linker == "<null>") { linker = "";}
        else { linker = " "+linker+" ";}
        for (var j = 0; j < vgap.ships.length; j++) {
            var ship = vgap.ships[j];
            if (ship.ownerid == pid){
                baptism_namez[ship.id][d3] = baptism_namez[ship.id][n1] + linker + baptism_namez[ship.id][n2];
                ship.name = baptism_namez[ship.id][d3];
                ship.changed = 1;
            }
        }
        showList = d3;
        shipNames.saveNames(noteIDnamez, nameNoteType, baptism_namez);
        scrollz = 0;
        shipNames.menuMaster();
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    listClear: function(index){
        index = parseInt(index);
        longNamez[longLists[index]] = ["<empty list>"];
        shipNames.saveNames(noteIDlistz, longNoteType, longNamez);
        shipNames.loadDefaultLists();
        scrollz = $('#baptismDash').data('jsp').getContentPositionY();
        shipNames.menuMaster();
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    listSave: function(index){
        var idx = "xbaptism"+index.toString();
        var k = parseInt(index);
        if (debug){console.log("   >>  idx="+idx+"  list="+longLists[index]);}
        var newz = document.getElementById(idx).value;
        if (newz.includes("\"") || newz.includes("\'")){
            alert("List entries cannot contain quotes or apostrophes.");
        } else {
            if (debug){console.log("   >>  newz=|"+newz+"|");}
            var news = newz.split(',');
            longNamez[longLists[k]] = [];
            for (var j=0; j < news.length; j++){ longNamez[longLists[k]].push(news[j].trim()); }
            shipNames.saveNames(noteIDlistz, longNoteType, longNamez);
            shipNames.loadDefaultLists();
            if (debug){console.log("   >> B  k =", k,"; longLists=",longLists[k],"; longNamez=",longNamez[longLists[k]]);}
            scrollz = $('#baptismDash').data('jsp').getContentPositionY();
            shipNames.menuMaster();
        }
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    shortlistClear: function(index){
        index = parseInt(index);
        longNamez[shortLists[index]] = ["<empty list>"];
        shipNames.saveNames(noteIDlistz, longNoteType, longNamez);
        shipNames.loadDefaultLists();
        scrollz = $('#baptismDash').data('jsp').getContentPositionY();
        shipNames.menuMaster();
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    shortlistSave: function(index){
        var idx = "zbaptism"+index.toString();
        var k = parseInt(index);
        if (debug){console.log("   >>  idx="+idx+"  list="+shortLists[index]);}
        var newz = document.getElementById(idx).value;
        if (newz.includes("\"") || newz.includes("\'")){
            alert("List entries cannot contain quotes or apostrophes.");
        } else {
            if (debug){console.log("   >>  newz=|"+newz+"|");}
            var news = newz.split(',');
            longNamez[shortLists[k]] = [];
            for (var j=0; j < news.length; j++){ longNamez[shortLists[k]].push(news[j].trim()); }
//             switch(k){
//                 case 0: defaultLong1 = newz; break;
//                 case 1: defaultLong2 = newz; break;
//                 case 2: defaultLong3 = newz; break;
//                 case 3: defaultLong4 = newz; break;
//             }
            shipNames.saveNames(noteIDlistz, longNoteType, longNamez);
            shipNames.loadDefaultLists();
            scrollz = $('#baptismDash').data('jsp').getContentPositionY();
            shipNames.menuMaster();
        }
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    shortlistRename: function(index){
        index = parseInt(index);
        var oldname = shortLists[index];
        var newname = prompt("Enter New List Name:", oldname);
        if (newname !== null && newname !== "" && newname !== shortLists[index]) {
            longNamez[newname] = longNamez[oldname];
            delete longNamez[oldname];
            shortLists[index] = newname;
            longNamez['shortLists'] = shortLists;
            shipNames.saveNames(noteIDlistz, longNoteType, longNamez);
            shipNames.loadDefaultLists();
            scrollz = $('#baptismDash').data('jsp').getContentPositionY();
            shipNames.menuMaster();
        }
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    listRename: function(index){
        index = parseInt(index);
        var oldname = longLists[index];
        var newname = prompt("Enter New List Name:", oldname);
        if (newname !== null && newname !== "" && newname !== longLists[index]) {
            longNamez[newname] = longNamez[oldname];
            delete longNamez[oldname];
            longLists[index] = newname;
            longNamez['longLists']  = longLists;
            shipNames.saveNames(noteIDlistz, longNoteType, longNamez);
            shipNames.loadDefaultLists();
            scrollz = $('#baptismDash').data('jsp').getContentPositionY();
            shipNames.menuMaster();
        }
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    changeDest: function(list){
        destListz = list;
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    changeDestSpoof: function(list){
        spoofListz = list;
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    changeDestGhost: function(list){
        ghostListz = list;
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    mergeDest1: function(list){
        mergeListName[0] = list;
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    mergeDest2: function(list){
        mergeListName[1] = list;
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    mergeDest3: function(list){
        mergeListName[2] = list;
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    buildRadioButtons: function(sectionName, funcall, list, showchecked){
        var checked = "";
        if (showchecked == "yes"){ checked = (list == showList ? " checked" : "");}
        if (funcall == "changeDest")      {  if (showchecked == "yes"){ checked = (list == destListz ? " checked" : "");}}
        if (funcall == "changeDestSpoof") {  if (showchecked == "yes"){ checked = (list == spoofListz ? " checked" : "");}}
        if (funcall == "changeDestGhost") {  if (showchecked == "yes"){ checked = (list == ghostListz ? " checked" : "");}}
        if (funcall == "mergeDest1")      {  if (showchecked == "yes"){ checked = (list == mergeListName[0] ? " checked" : "");}}
        if (funcall == "mergeDest2")      {  if (showchecked == "yes"){ checked = (list == mergeListName[1] ? " checked" : "");}}
        if (funcall == "mergeDest3")      {  if (showchecked == "yes"){ checked = (list == mergeListName[2] ? " checked" : "");}}
        return "<input "+checked+" type='radio' name='"+sectionName+"' onclick='vgap.plugins[\""+plgname+"\"]."+funcall+"(\""+list+"\")'>"+list+"</input>";
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    ynRadio: function(index, idName, option, cxbox=0){
        var checked = (ynradio[index] == option ? " checked" : "");
        var breakchar = "";
        if (index == 4){ynlabels[4] = longLists; breakchar = "<br>";}
        if (index ==5 && option == 2){ breakchar="";}
        if (index >=5){ breakchar=" &nbsp &nbsp "; ynlabels[index] = shortLists;}
        if (debug){ console.log("   ynradio: name="+idName+", cxbox="+chxshort[cxbox]);}
        var rg = /shortlist/;
        if (rg.test(idName) && chxshort[cxbox] == 0){
            if (option == 1){ return " - - - < word list not selected >  - - -  ";}
            else { return " &nbsp ";}
        } else {
            if (typeof ynlabels[index] !== 'undefined'){
            return "<input "+checked+" type='radio' id='"+idName+"' name='"+idName+"y' onclick='vgap.plugins[\""+plgname+"\"].ynRadioResponse("+index+","+option+")'>"+ynlabels[index][option]+breakchar+"</input>";
            }
        }
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    ynCheck: function(idName, option){
        var wnum = option + 1;
        var checked = (chxshort[option] == 1 ? " checked" : "");
        if (option == 0){ checked = " checked"; chxshort[0] = 1;}
        if (option > 0){ if (chxshort[option-1] == 0){ chxshort[option] = 0; checked = "";} }
        return "<input type='checkbox' "+checked+" id='"+idName+option+"' name='"+idName+"y"+option+"' onclick='vgap.plugins[\""+plgname+"\"].ynCheckResponse("+option+","+checked+")'> Word "+wnum+" = </input>";
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    ynCheckLinkerz: function(idName, option){
        var wnum1 = option + 1;
        var wnum2 = wnum1+1;
        var checked = (linkerz[option][0] == 1 ? " checked" : "");
        return "<input type='checkbox' "+checked+" id='"+idName+option+"' name='"+idName+"y"+option+"' onclick='vgap.plugins[\""+plgname+"\"].ynCheckLinkResponse("+option+","+checked+")'> Use linker between word"+wnum1+" and word"+wnum2+": </input>";
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    ynRadioResponse: function(index, option){
        ynradio[index] = option;
        if (debug){ console.log("       ynRadioResponse: ynradio["+index+"] = "+ynradio[index]);}
        scrollz = $('#baptismDash').data('jsp').getContentPositionY();
        shipNames.menuMaster();
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    ynCheckResponse: function(option,check){
        chxshort[option] = (chxshort[option] == 1 ? 0 : 1);
        scrollz = $('#baptismDash').data('jsp').getContentPositionY();
        if (debug){ console.log("       scrollpos: "+scrollz);}
        shipNames.menuMaster();
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    ynCheckLinkResponse: function(option,check){
        linkerz[option][0] = (linkerz[option][0] == 1 ? 0 : 1);
        scrollz = $('#baptismDash').data('jsp').getContentPositionY();
        shipNames.menuMaster();
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    buildSaveButtons: function(blabel, funcall, list, index=-1){
        if (index < 0){
            return "<input type='button' value='"+blabel+"' onclick='vgap.plugins[\""+plgname+"\"]."+funcall+"(\""+list+"\")'/>";
        } else {
            return "<input type='button' value='"+blabel+"' onclick='vgap.plugins[\""+plgname+"\"]."+funcall+"("+index+")'/>";
        }
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    buildDefaultListSaveButtons: function(blabel, funcall){
        var bcolor = ( baptism_namez['000'][blabel] == "true" ? "#F8CE50" : "#e8e5dc" );   // "#c9a44d"= gray-orange
        return "<input type='button' value='"+blabel+"' style='background-color:"+bcolor+"' onclick='vgap.plugins[\""+plgname+"\"]."+funcall+"(\""+blabel+"\")'/>";
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    makeLongTextDisplays: function(list){
        var textareaDisplay = [];
        for (var j=0; j<longLists.length;j++){
            if (longNamez[longLists[j]] == null){ longNamez[longLists[j]] = ["EmptySoul"]; }
            var strlist = longNamez[longLists[j]][0];
            for (var k=1; k<longNamez[longLists[j]].length;k++){
                strlist += ", "+longNamez[longLists[j]][k];
            }
            textareaDisplay.push(strlist);
        }
        return textareaDisplay;
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    makeShortTextDisplays: function(list){
        var textareaDisplay = [];
        for (var j=0; j<shortLists.length;j++){
            if (longNamez[shortLists[j]] == null){ longNamez[shortLists[j]] = ["GloryDeath"]; }
            var strlist = longNamez[shortLists[j]][0];
            for (var k=1; k<longNamez[shortLists[j]].length;k++){
                strlist += ", "+longNamez[shortLists[j]][k];
            }
            textareaDisplay.push(strlist);
        }
        return textareaDisplay;
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    getCurrentShipList: function(list){
        var newlist = '';
        for (var sid in baptism_namez){
            if (sid !== '000'){
                var space = " ";
                if (sid.length==1){ space += "  ";}
                if (sid.length==2){ space += " "; }
                newlist = newlist + space + sid + " " + baptism_namez[sid][list] + "\n";
        }   }
        return newlist;
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    changeShipList: function(newlist){
        // iterate through ships and change their visible names . . . . . .
        var pid = vgap.player.id;
        for (var j = 0; j < vgap.ships.length; j++) {
            var ship = vgap.ships[j];
            if (ship.ownerid == pid){
                ship.name = baptism_namez[ship.id][newlist];
                ship.changed = 1;
        }    }
        showList = newlist;
        shipNames.saveNames(noteIDnamez, nameNoteType, baptism_namez);
        if (scrollz > 0){ scrollz = $('#baptismDash').data('jsp').getContentPositionY();}
        shipNames.menuMaster();
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    saveShipNames: function (list){
        // Save the current visible names of ships to a designated list . . . . .
        var pid = vgap.player.id;
        for (var j = 0; j < vgap.ships.length; j++) {
            var ship = vgap.ships[j];
            if (ship.ownerid == pid){if (baptism_namez[ship.id][list] !== ship.name){ baptism_namez[ship.id][list] = ship.name;}}
        }
        // Safety save lists . . . . .
        shipNames.saveNames(noteIDnamez, nameNoteType, baptism_namez);
        scrollz = $('#baptismDash').data('jsp').getContentPositionY();
        shipNames.menuMaster();
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    resetNameList: function (listindex){
        var lin = parseInt(listindex);
        var pid = vgap.player.id;
        for (var j = 0; j < vgap.ships.length; j++) {
            var ship = vgap.ships[j];
            if (ship.ownerid == pid){
                var hullfound = 0;
                var hullz = 'UNK';
                var config = 'x';
                var sid = ship.id;
                for (var k=0; k<hullNamez.length; k++) {
                    if (ship.hullid == hullNamez[k].hid) {
                        hullfound = 1
                        hullz = hullNamez[k].hn;
                        break;
                }   }
                if (hullfound == 1) {
                    switch(lin){
                        case 0:
                            //var hullz = hullNamez[k].hn;
                            baptism_namez[sid][nameLists[lin]] = hullz.toUpperCase();
                            break;
                        case 1:
                            config = "-x"+ship.experience+".w"+ship.engineid;
                            if (ship.beamid > 0){ config = config+"b"+ship.beamid; };
                            if (ship.torpedoid > 0){ config = config+"mk"+String(parseInt(ship.torpedoid) - 2)};
                            //config = config+"x"+ship.experience;
                            baptism_namez[sid][nameLists[lin]] = hullNamez[k].sn+config;
                            break;
                        case 2:
                            baptism_namez[sid][nameLists[lin]] = blankName; break;  // hullNamez[k].sn
                        case 3:
                            baptism_namez[sid][nameLists[lin]] = blankName; break;
                        case 4:
                            baptism_namez[sid][nameLists[lin]] = blankName; break;
                        case 5:
                            baptism_namez[sid][nameLists[lin]] = blankName; break;
                        case 6:
                            baptism_namez[sid][nameLists[lin]] = blankName; break;   // hullNamez[k].hn
                        break;
                    }
                } else {
                    switch(lin){
                        case 0:
                            baptism_namez[sid][nameLists[lin]] = hullz.toUpperCase();
                            break;
                        case 1:
                            config = "-x"+ship.experience+".w"+ship.engineid;
                            if (ship.beamid > 0){ config = config+"b"+ship.beamid; };
                            if (ship.torpedoid > 0){ config = config+"mk"+String(parseInt(ship.torpedoid) - 2)};
                            //config = config+"x"+ship.experience;
                            baptism_namez[sid][nameLists[lin]] = hullz+config;
                            break;
                        case 2:
                            baptism_namez[sid][nameLists[lin]] = blankName; break;
                        case 3:
                            baptism_namez[sid][nameLists[lin]] = blankName; break;
                        case 4:
                            baptism_namez[sid][nameLists[lin]] = blankName; break;
                        case 5:
                            baptism_namez[sid][nameLists[lin]] = blankName; break;
                        case 6:
                            baptism_namez[sid][nameLists[lin]] = blankName; break;
                        break;
        }   }   }   }// close all
        shipNames.saveNames(noteIDnamez, nameNoteType, baptism_namez)
        shipNames.loadNames();
        scrollz = $('#baptismDash').data('jsp').getContentPositionY();
        shipNames.menuMaster();
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    savePREABRV: function (index){
        preabrv = document.getElementById('preFix').value
        longNamez['prefix_abvr'] = preabrv;
        shipNames.saveNames(noteIDlistz, longNoteType, longNamez);
        scrollz = $('#baptismDash').data('jsp').getContentPositionY();
        shipNames.menuMaster();
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    saveHULLABRV: function (index){
        var hullabrv = document.getElementById('HullpreFix').value
        var hullabrvstr = hullabrv.replace(/["'\s]/g, "");
        var hullabrvz = hullabrvstr.split(";")
        var err_count  = 0;
        var hull_count = 0;
        var name_count = 0;
        var clean_string = "";
        for (var i=0; i < hullabrvz.length; i++){
            var haze = hullabrvz[i];
            if (haze.indexOf(":") > 0){
                var ha = haze.split(":");
                var hid = ha[0].trim();
                var hnm = ha[1].trim();
                if (isNaN(parseInt(hid, 10))){
                    err_count += 1;
                } else if (parseInt(hid, 10) > 1 && parseInt(hid, 10) < 3000){
                    hull_count += 1;
                }
                if (hnm.length > 0){ name_count += 1; }
            }
        }
        // Check input names . . . . .
        if (debug) {console.log("err_count = "+err_count+";  hull = "+hull_count+";  namez = "+name_count);};
        if (err_count > 0 || (hull_count !== name_count) || (hull_count == 0)){
            alert("Danger Dr. Smith! Check the Hull Abbreviations you have entered.\n\
The correct format is:\n   - the integer hull id#\n   - a semicolon (no spaces)\n   - the prefix string for that hull\n   - a semicolon (followed by a space is ok)\n\nTry again.");
            return;
        }
        else {
            for (i=0; i < hullabrvz.length; i++){
                haze = hullabrvz[i];
                if (haze.indexOf(":") > 0){
                    ha = haze.split(":");
                    hid = ha[0].trim();
                    hnm = ha[1].trim();
                    clean_string += hid + ":" + hnm + "; ";
        }   }   }
        preHull = clean_string;
        longNamez['prefix_hull'] = preHull;
        shipNames.saveNames(noteIDlistz, longNoteType, longNamez);
        console.log(longNamez)
        scrollz = $('#baptismDash').data('jsp').getContentPositionY();
        shipNames.menuMaster();
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    loadHullPrefixNames: function (){
        if (preHull !== document.getElementById('HullpreFix').value){
            shipNames.saveHULLABRV();
        }
        preHullNames = {};
        var hullabrvz = preHull.split(";");
        for (var i=0; i < hullabrvz.length; i++){
            var haze = hullabrvz[i];
            if (haze.indexOf(":") > 0){
                var ha = haze.split(":");
                var hid = ha[0].trim();
                var hnm = ha[1].trim();
                preHullNames[hid] = hnm;
    }   }   },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    saveLinker: function (index){
        var tabox = "linkwordz"+index
        if (debug){ console.log("  saveLinker:  i="+index+", t="+tabox);}
        var text = document.getElementById(tabox).value;
        if (text == "<space>"){ text = " ";}
        if (text == "<null>") { text = "";}
        if (text == " " || text == ""){ linkerz[index][1] = text; }
        else{ linkerz[index][1] = text.trim(); }
        scrollz = $('#baptismDash').data('jsp').getContentPositionY();
        shipNames.menuMaster();
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    setDefaultList: function(list){
        baptism_namez['000'][showList] = "false"
        showList = list
        baptism_namez['000'][list] = "true"
        shipNames.saveNames(noteIDnamez, nameNoteType, baptism_namez)
        scrollz = $('#baptismDash').data('jsp').getContentPositionY();
        shipNames.menuMaster();
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    initializeNames: function (){
        var pid = vgap.player.id;
        for (var j = 0; j < vgap.ships.length; j++) {
            var ship = vgap.ships[j];
            if (ship.ownerid == pid){
                var found = 1;
                for (var k=0; k<hullNamez.length; k++) {
                    if (ship.hullid == hullNamez[k].hid) {
                        //190615: Change routine so that when initializing, current ship names are saved as the "hull" list
                        var sid = ship.id;
                        found = 1
                        //var bname = { "hull":blankName, "tactical":blankName, "smack":blankName, "malign":blankName, "sublime":blankName, "sober":blankName, "historical":blankName};
                        var bname = {};
                        for (var m=0; m<nameLists.length;m++){ bname[nameLists[m]] = blankName; }
                        if (debug) { console.log("   >>>          new ship sid = "+sid);}
                        var config = "-x"+ship.experience+".w"+ship.engineid;
                        if (ship.beamid > 0){ config = config+"b"+ship.beamid; };
                        if (ship.torpedoid > 0){ config = config+"mk"+String(parseInt(ship.torpedoid) - 2)};
                        //config = config+"x"+ship.experience;
                        bname.tactical = hullNamez[k].sn+config;
                        baptism_namez[sid] = bname;
                        ship.name = bname[showList];
                        ship.changed = 1;
                    }
                }
                if (found == 0){
                        var siduk = ship.id;
                        var bnameuk = {};
                        for (var muk=0; muk<nameLists.length;muk++){ bnameuk[nameLists[muk]] = blankName; }
                        if (debug) { console.log("   >>>          new ship sid = "+sid);}
                        var configuk = "-x"+ship.experience+".w"+ship.engineid;
                        if (ship.beamid > 0){ configuk = configuk+"b"+ship.beamid; };
                        if (ship.torpedoid > 0){ configuk = configuk+"mk"+String(parseInt(ship.torpedoid) - 2)};
                        //config = config+"x"+ship.experience;
                        bname.tactical = "UNK"+configuk;
                        baptism_namez[siduk] = bnameuk;
                        ship.name = bnameuk[showList];
                        ship.changed = 1;
                }
        }   }   // close loops . . . .
        shipNames.saveNames(noteIDnamez, nameNoteType, baptism_namez)
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    loadNames: function (){
        var pid = vgap.player.id;
        baptism_namez = shipNames.getObjectFromNote(0, nameNoteType)
        // Load exisiting names and create new names for new ships . . . . . . . .
        if (debug) { console.log("   >>>          loading ship names . . . . ");}
        var myShipsThisTurn = [];
        for (var j = 0; j < vgap.ships.length; j++) {
            var ship = vgap.ships[j];
            //- --- --- - - --- --- ---- - - --- --- --- ---- -
            if (ship.ownerid == pid){
                var found = 0;
                //for (var n = 1; n < baptism_namez.length; n++){
                myShipsThisTurn.push(ship.id);
                for(var sid in baptism_namez) {
                    if (ship.id == sid) {
                        ship.name = baptism_namez[sid][showList];
                        ship.changed = 1;
                        found = 1;
                        if (debug) { console.log("   >>>          ship name = "+ship.name);}
                }   }
                if (found==1){ shipNames.makeNewTacticalName(ship); }
                if (found==0){ shipNames.makeNewNames(ship); }
        }   } // close loops
        // Remove the name entries for ships that have been destroyed or captured  . . . .
        for (var existing_sid in baptism_namez) {
            found = 0
            for (var i=0; i < myShipsThisTurn.length; i++) {
                var shipID = myShipsThisTurn[i]
                if (shipID == existing_sid){ found = 1; }
            }
            if (found==0 & existing_sid !== "000"){ delete baptism_namez[existing_sid]; }
        }
        // Save all changes to the name lists . . . .
        shipNames.saveNames(noteIDnamez, nameNoteType, baptism_namez);
        for (var name in nameLists){
            if (baptism_namez['000'][name] == "true"){ showList = name; }
        }
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    makeNewNames: function (ship){
        for (var k=0; k<hullNamez.length; k++) {
            var found = 0
            if (ship.hullid == hullNamez[k].hid) {
                var sid = ship.id;
                found = 1
                //var bname = { "hull":blankName, "tactical":blankName, "smack":blankName, "malign":blankName, "sublime":blankName, "sober":blankName, "historical":blankName};
                var bname = {};
                for (var j=0; j<nameLists.length;j++){ bname[nameLists[j]] = blankName }
                if (debug) { console.log("   >>>          new ship sid = "+sid);}
                var hullz = hullNamez[k].hn;
                bname.hull = hullz.toUpperCase();
                var config = "-x"+ship.experience+".w"+ship.engineid;
                if (ship.beamid > 0){ config = config+"b"+ship.beamid; };
                if (ship.torpedoid > 0){ config = config+"mk"+String(parseInt(ship.torpedoid) - 2)};
                //config = config+"x"+ship.experience;
                bname.tactical = hullNamez[k].sn+config;
                baptism_namez[sid] = bname;
                ship.name = bname[showList];
                ship.changed = 1;
                break;
            }
        }
        if (found == 0) {
                var siduk = ship.id;
                var bnameuk = {};
                for (var juk=0; juk<nameLists.length;j++){ bnameuk[nameLists[juk]] = blankName }
                if (debug) { console.log("   >>>          new ship sid = "+sid);}
                bnameuk.hull = "UNKNOWN";
                var configuk = "-x"+ship.experience+".w"+ship.engineid;
                if (ship.beamid > 0){ configuk = configuk+"b"+ship.beamid; };
                if (ship.torpedoid > 0){ configuk = configuk+"mk"+String(parseInt(ship.torpedoid) - 2)};
                //config = config+"x"+ship.experience;
                bnameuk.tactical = "UNK"+configuk;
                baptism_namez[siduk] = bnameuk;
                ship.name = bnameuk[showList];
                ship.changed = 1;
        }
    }  , // close loops
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    makeNewTacticalName: function (ship){
        // Need to update a ship's tactical name with current Experience Values.
        // Also, for FEDs, need to accoount for Refit Tech changes.
        for (var k=0; k<hullNamez.length; k++) {
            var found = 0;
            if (ship.hullid == hullNamez[k].hid) {
                var sid = ship.id;
                found = 1
                var config = "-x"+ship.experience+".w"+ship.engineid;
                if (ship.beamid > 0){ config = config+"b"+ship.beamid; };
                if (ship.torpedoid > 0){ config = config+"mk"+String(parseInt(ship.torpedoid) - 2)};
                baptism_namez[sid]["tactical"] = hullNamez[k].sn+config;
                ship.changed = 1;
                break;
        }   }
        if (found == 0) {
                var siduk = ship.id;
                found = 1
                var configuk = "-x"+ship.experience+".w"+ship.engineid;
                if (ship.beamid > 0){ configuk = configuk+"b"+ship.beamid; };
                if (ship.torpedoid > 0){ configuk = configuk+"mk"+String(parseInt(ship.torpedoid) - 2)};
                baptism_namez[siduk]["tactical"] = "UNK"+config;
                ship.changed = 1;
        }
    }   , // close loops
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    saveNames: function (idnum, noteType, object){
        // Save NoteObject . . . .
        // vgaPlanets.prototype.saveObjectAsNote(nid, noteType, object);
        var note = vgap.getNote(0, noteType);
        if (note == null)
            note = vgap.addNote(0, noteType);
        note.changed = 1;
        note.body = JSON.stringify(object);
        note.targettype = noteType;
        note.color = "";
        note.targetid = 0;
        note.ownerid = vgap.player.id;
        note.id = idnum;
        vgap.save();
        if (debug) {console.log("   >>> Saving note . . . . \nNOTEstart>\n"+note.body+"\n<endNote\n");}
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    addtoCSS: function(cssString) {
        var head = document.getElementsByTagName('head')[0];
        if (head !== null) {
            var css = document.createElement('style');
            css.type = "text/css";
            css.innerHTML = cssString;
            head.appendChild(css);
        }
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    loadDefaultLists: function (){
        longNamez = shipNames.getObjectFromNote(0, longNoteType);
        preabrv   = longNamez['prefix_abvr'];

        // test for undef . . . .
        if (typeof longNamez.longLists === 'undefined'){ longNamez.longLists = longLists;}
        else { longLists = longNamez.longLists; }

        if (typeof longNamez.shortLists === 'undefined'){ longNamez.shortLists = shortLists;}
        else { shortLists = longNamez.shortLists; }

        if (typeof longNamez.prefix_hull == 'undefined'){ longNamez.prefix_hull = preHull;}
        else {preHull = longNamez.prefix_hull;}
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    initializeDefaultLists: function (){
        longNamez['longLists']   = longLists;
        longNamez['shortLists']  = shortLists;
        longNamez[longLists[0]]  = defaultLong1;
        longNamez[longLists[1]]  = defaultLong2;
        longNamez[longLists[2]]  = defaultLong3;
        longNamez[longLists[3]]  = defaultLong4;
        longNamez[shortLists[0]] = defaultShort1;
        longNamez[shortLists[1]] = defaultShort2;
        longNamez[shortLists[2]] = defaultShort3;
        longNamez[shortLists[3]] = defaultShort4;
        longNamez['prefix_abvr'] = preabrv;
        longNamez['prefix_hull'] = preHull;
        shipNames.saveNames(noteIDlistz, longNoteType, longNamez);
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    resetVars: function(){
        noteIDnamez  = 0;
        noteIDlistz  = 0;
        showList     = "hull";
        baptism_namez= {"000":{ "hull":"true", "tactical":"false", "smack":"false", "malign":"false", "sublime":"false", "sober":"false", "historical":"false", "combat":"false", "carnage":"false" }};
        preabrv      = "WAGB";
        longNamez    = {"default":["a","b","c"]};
        ynradio      = [1,1,0,0,0,0,1,2,0];            // position index: 0= full/undef; 1=rand/seq; 2=prefix; 3=listSource; 4=longlist; 5=short1, 6=short2, 7=short3, 8=short4 ;
        chxshort     = [1,1,1];
        linkerz      = [[1," "], [1,"of"], [0,""]];
        mergelink    = "<space>";
        scrollz      = 0;
        nextgenNames = "< no list yet >";
        destListz    = "sober";
        spoofListz   = "sublime";
        ghostListz   = "sublime";
        preHull      = "16:MDSF; 17:LDSF; 14:NFC;"; // pattern for parsing ==  hull#id colon hullprefix semicolon
        longLists    = [ "Russian Field Marshals 1700-1915", "Metallica Songs", "Java Error Codes", "empty01"];
        defaultLong1 = [ 'Count Fedor Golovin', 'Count Boris Sheremetev', 'Prince Alexander Menshikov', 'Prince Anikita Repnin', 'Prince Mikhail Galitzine', 'Count Jacob Bruce', 'Jan Kazimierz Sapieha', 'Prince Ivan Trubetskoy', 'Prince Vasily Vladimirovich Dolgorukov', 'Count Burkhard Christoph von Munnich', 'Count Peter von Lacy', 'Ludwig Johann Wilhelm Gruno von Hessen-Homburg', 'Stepan Apraksin', 'Nikita Yurievich Trubetskoy', 'Count Alexander Buturlin', 'Count Alexei Razumovsky', 'Count Pyotr Saltykov', 'Count Alexander Ivanovich Shuvalov', 'Count Pyotr Ivanovich Shuvalov', 'Peter August Friedrich, Duke of Schleswig-Holstein-Sonderburg-Beck', 'Prince Georg Ludwig of Holstein-Gottorp', 'Count Alexei Bestuzhev-Ruymin', 'Prince Nikita Trubetskoy', 'Count Kirill Razumovsky', 'Prince Alexander Galitzine', 'Count Pyotr Rumyantsev-Zadunaisky', 'Count Zakhar Chernyshyov', 'Prince Grigori Potemkin', 'Prince Aleksander Suvorov', 'Count Ivan Saltykov', 'Prince Nicholas Repnin', 'Prince Nikolay Saltykov', 'Count Ivan Chernyshyov', 'Count Johann Martin von Elmpt', 'Count Valentin Platonovich Musin-Pushkin', 'Count Mikhail Kamensky', 'Victor François de Broglie, 2nd duc de Brogliey', 'Prince Alexander Prozorovsky', 'Count Ivan Gudovich', 'Prince Mikhail Golenischev-Kutuzov', 'Prince Mikhail Barclay de Tolly', 'Prince Fabian Gottlieb von Osten-Sacken', 'Ludwig Adolph Peter, Prince of Sayn-Wittgenstein-Berleburg-Ludwigsburg', 'Prince Ivan Paskevich', 'Count Hans Karl von Diebitsch-Zabalkansky', 'Prince Pyotr Volkonsky', 'Prince Mikhail Vorontsov', 'Prince Alexander Baryatinsky', 'Count Friedrich Wilhelm Rembert von Berg', 'Grand Duke Nikolas Nikolaevich', 'Grand Duke Mikhail Nikolaevich', 'Count Joseph Vladimirovich Gourko', 'Count Dmitry Milyutin'];
        defaultLong2 = [ '... and Justice For All', '2 X 4', 'All Within My Hands', 'Am I Evil?', 'Bad Attitude', 'Bad Seed', 'Battery', 'Better Than You', 'Blackened', 'Bleeding Me', 'Blitzkrieg', 'Breadfan', 'Carpe Diem Baby', 'Crash Course In Brain Surgery', 'Creeping Death', 'Cure', 'Damage Case', 'Damage Inc.', 'Devils Dance', 'Devils Dance', 'Die, Die My Darling', 'Dirty Window', 'Disposable Heroes', 'Dont Tread On Me', 'Dont Treat On Me', 'Dyers Eve', 'Enter Sandman', 'Escape', 'Eye Of The Beholder', 'Fade To Black', 'Fight Fire With Fire', 'Fixxxer', 'For Whom The Bell Tolls', 'Frantic', 'Free Speech For The Dumb', 'Fuel', 'Fuel For Fire', 'Harvester Of Sorrow', 'Helpless', 'Hero Of The Day', 'Hit The Lights', 'Holier Than Thou', 'Disappear', 'Invisible Kid', 'Its Electric', 'Jump In The Fire', 'Kenny Goes To Hell', 'Kill and Ride Medley', 'Killing Time', 'King Nothing', 'Last Caress in Green Hell', 'Leper Messiah', 'Loverman', 'Low Mans Lyric', 'Mama Said', 'Master Of Puppets', 'Memory Remains', 'Mercyful Fate', 'Metal Militia', 'Motorbreath', 'My Friend Of Misery', 'My World', 'No Leaf Clover', 'No Remorse', 'Nothing Else Matters', 'Of Wolf And Man', 'One', 'Overkill', 'Phantom Lord', 'Poor Twisted Me', 'Prince Charming', 'Purify', 'Ride The Lightning', 'Ronnie', 'Sabbra Cadabra', 'Sad But True', 'Seek And Destroy', 'Shoot Me Again', 'Slither', 'So What', 'Some Kind Of Monster', 'St. Anger', 'Stone Cold Crazy', 'Stone Dead Forever', 'Sweet Amber', 'The Ballad Of ?brain Knight?', 'The Four Horseman', 'The Four Horsemen', 'The Frayed Ends Of Sanity', 'The God That Failed', 'The House That Jack Built', 'The Mechanix', 'The Memory Remains', 'The More I See', 'The Outlaw Torn', 'The Prince', 'The Shortest Straw', 'The Small Hours', 'The Struggle Within', 'The Thing That Should Not Be', 'The Unforgiven', 'The Unforgiven II', 'The Unnamed Feeling', 'The Wait', 'Thorn Within', 'Through The Never', 'To Live Is To Die', 'Too Late Too Late', 'Trapped Under Ice', 'Tuesdays Gone', 'Turn The Page', 'Unnamed Feeling', 'Until It Sleeps', 'Wasting My Hate', 'We Did It Again', 'Welcome Home', 'Where The Wild Things Are', 'Wherever I May Roam', 'Whiplash', 'Whiskey In The Jar'];
        defaultLong3 = [ 'AbstractMethodError', 'AssertionError', 'ClassCircularityError', 'ClassFormatError', 'Error', 'ExceptionInInitializerError', 'IllegalAccessError', 'IncompatibleClassChangeError', 'InstantiationError', 'InternalError', 'LinkageError', 'NoClassDefFoundError', 'NoSuchFieldError', 'NoSuchMethodError', 'OutOfMemoryError', 'StackOverflowError', 'ThreadDeath', 'UnknownError', 'UnsatisfiedLinkError', 'UnsupportedClassVersionError', 'VerifyError', 'VirtualMachineError', 'ArithmeticException', 'ArrayIndexOutOfBoundsException', 'ArrayStoreException', 'ClassCastException', 'ClassNotFoundException', 'CloneNotSupportedException', 'EnumConstantNotPresentException', 'Exception', 'IllegalAccessException', 'IllegalArgumentException', 'IllegalMonitorStateException', 'IllegalStateException', 'IllegalThreadStateException', 'IndexOutOfBoundsException', 'InstantiationException', 'InterruptedException', 'NegativeArraySizeException', 'NoSuchFieldException', 'NoSuchMethodException', 'NullPointerException', 'NumberFormatException', 'RuntimeException', 'SecurityException', 'StringIndexOutOfBoundsException', 'TypeNotPresentException', 'UnsupportedOperationException', 'ArithmeticException', 'ArrayIndexOutOfBoundsException', 'ArrayStoreException', 'ClassCastException', 'ClassNotFoundException', 'CloneNotSupportedException', 'IllegalAccessException', 'IllegalArgumentException', 'IllegalMonitorStateException', 'IllegalStateException', 'IllegalThreadStateException', 'IndexOutOfBoundsException', 'InstantiationException', 'InterruptedException', 'NegativeArraySizeException', 'NoSuchFieldException', 'NoSuchMethodException', 'NullPointerException', 'NumberFormatException', 'RuntimeException', 'SecurityException', 'StringIndexOutOfBoundsException', 'UnsupportedOperationException', 'ConcurrentModificationException', 'EmptyStackException', 'MissingResourceException', 'NoSuchElementException', 'TooManyListenersException', 'AWTException', 'FontFormatException', 'HeadlessException', 'IllegalComponentStateException', 'CMMException', 'ProfileDataException', 'MimeTypeParseException', 'UnsupportedFlavorException', 'IntrospectionException', 'PropertyVetoException', 'CharConversionException', 'EOFException', 'FileNotFoundException', 'InterruptedIOException', 'InvalidClassException', 'InvalidObjectException', 'IOException', 'NotActiveException', 'NotSerializableException', 'ObjectStreamException', 'OptionalDataException', 'StreamCorruptedException'];
        defaultLong4 = [ 'EmptySoul'];
        shortLists   = [ "Cadaver Colors", "Forces of Nature", "Unfortunate Calamities", "empty02"];
        defaultShort1= [ 'Black', 'BloodRed', 'BlueBruise', 'Midnight', 'ColdMoon', 'OrangeAnger', 'Crimson', 'Scarlet', 'FrozenLight', 'BrownBile', 'BlackFear', 'EternalBlack', 'GreenSpleen', 'LiverBruise', 'BloodClot', 'ForeverBreath', 'EmptyNight', 'MidnightTerror', 'BloodThief', 'SanguineRage', 'BlindMalice' ];
        defaultShort2= [ 'Tide', 'Lightning', 'Blizzard', 'Wave', 'Quake', 'Hurricane', 'Typhoon', 'Tornado', 'Glacier', 'Fire', 'Wind', 'Ice', 'Volcano', 'Tsunami', 'Snow', 'Current', 'Abyss', 'QuickSand', 'Swamp', 'Cavern', 'Apocalypse', 'Armaggedon', 'Plague', 'Pestilence', 'War', 'Destruction', 'Gale' ];
        defaultShort3= [ 'Death', 'Vengeance', 'Retribution', 'Slaughter', 'Widowmakers', 'Decapitation', 'SoulCrushers', 'Havoc', 'Chaos', 'HellHounds', 'Damnation', 'Hades', 'Orphans', 'Phantoms', 'Shadows', 'Souls', 'Specters', 'Banshees', 'Daemons', 'Revenants', 'Vengeful Shades', 'Wraiths', 'Zombies','Disease', 'Famine', 'Pestilence', 'Justice', 'Fear', 'Scorn', 'Disgust', 'Moral Turpitude', 'Armaggedon', 'Hell', 'Eternal Pain', 'DeathStink', 'Insanity', 'Daemonic Possession', 'Fallen Angels'];
        defaultShort4= [ 'GloryDeath' ];
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    // Helper Functions . . . . . . .
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    processload: function() {
        if (debug) { console.log(">>> ShipBaptism: plugin start");}
        vgap.plugins[plgname].addtoCSS("\
#baptismDash { \
overflow: auto; \
position: absolute; \
}");
        if (vgap.version >= 4.0){
            vgap.plugins[plgname].addtoCSS("\
h3 { \
  display: block; \
  font-size: 1rem; \
  margin-top: 1.33rem; \
  margin-bottom: 1.33rem; \
  margin-left: 0; \
  margin-right: 0; \
  font-weight: bold; \
}");}

    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- -
    loaddashboard: function() {
        //if (vgap.settings.name == testgame){ // <<< only load for the defined test game name
        if (vgap.player.turnready == false){ // <<< only load if game is NotReady
            vgap.dash.addLeftMenuItem("<font color='#F8CE50'> Ship Names »</font>", shipNames.menuMaster, $("#DashboardMenu").find("ul:eq(3)"));
            shipNames.resetVars();
            if(shipNames.checkNoteNull(nameNoteType)) {    // check if shipbaptism name data exists . . . .
                // Set the global note ID numbers . . .
                noteIDnamez = shipNames.checkNoteID(nameNoteType, 'tactical');
                noteIDlistz = shipNames.checkNoteID(longNoteType, 'longLists');
                if (debug){console.log("    Loading: noteIDnamez = "+noteIDnamez+"; noteIDlistz = "+noteIDlistz)};

                shipNames.loadNames();
                shipNames.loadDefaultLists();
                for (var j=0; j<nameLists.length;j++){
                    if (baptism_namez['000'][nameLists[j]] == "true"){
                        showList = nameLists[j];
                        shipNames.changeShipList(showList);
                }   }   }
            else {
                shipNames.initializeNames();
                shipNames.loadNames();
                shipNames.initializeDefaultLists();
                shipNames.loadDefaultLists();
        }   } // closing brace for IF control loop
    },
    //- --- --- - - --- --- ---- - - --- --- ---
    showdashboard: function() {
        if (vgap.player.turnready == false){
            // If ship names have been edited, save current names to current visible list . . . .
            var pid = vgap.player.id;
            var editz = 0;
            var ship;
            for (var j = 0; j < vgap.ships.length; j++) {
                ship = vgap.ships[j];
                if (ship.ownerid == pid){  if (ship.name !== baptism_namez[ship.id][showList]){ editz = 1;} }
            }
            //if (editz == 1){ shipNames.saveShipNames(showList);}
            //20.05.11 - add loop to save any manually edited names across all lists.
            if (editz == 1){
                if (debug){ console.log("> ship name edited");}
                for (var k = 0; k < vgap.ships.length; k++) {
                    ship = vgap.ships[k];
                    if (ship.ownerid == pid){
                        if (ship.name !== baptism_namez[ship.id][showList]){
                            // Ship Name has been edited on the ship managment window.
                            // Save that manual ship name to all lists.
                            for (var m=0; m < nameLists.length;m++){
                                if (nameLists[m] !== 'tactical'){
                                    baptism_namez[ship.id][nameLists[m]] = ship.name;
                                }
                }   }   }   }
                shipNames.saveNames(noteIDnamez, nameNoteType, baptism_namez);
        }   }
	},
    //- --- --- - - --- --- ---- - - --- --- ---
    checkNoteNull: function(type) {
        var doesExist = 0;
        for (var i = 0; i < vgap.notes.length; i++){
            var note = vgap.notes[i];
            if (note.id > 0){
                if (note.targettype == type && note.body.indexOf("tactical") !== -1) {
                //if (note.targettype == type ) {
                    doesExist = 1;              // true, ship name note already exists
        }   }   }
        return doesExist;
    },
    //- --- --- - - --- --- ---- - - --- --- ---
    checkNoteID: function(type, tagstring) {
        var noteID = 0
        for (var i = 0; i < vgap.notes.length; i++){
            var note = vgap.notes[i];
            if (note.targettype == type && note.body.indexOf(tagstring) !== -1 ) { noteID = note.id;}
        }
        return noteID;
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- - - - --- - -- -- ---- - - --- -
    getNewNoteIDnum: function() {   // Only executed when no prior shipBaptism notes are found
        var newNoteIDnum = 0;
        for (var i = 0; i < vgap.notes.length; i++){
            var note = vgap.notes[i];
            if (note.id == 0) {
                newNoteIDnum = i+1;
                break;
        }    }
        noteIDnamez = newNoteIDnum;       //set global var
        noteIDlistz = newNoteIDnum + 1;   //set global var
    },
    //- --- --- - - --- --- ---- - - --- --- --- ---- - - - --- - -- -- ---- - - --- -
    getObjectFromNote: function (targetid, targettype) {    //  targetid = 0; type is either longNotType or nameNoteType
        var note = vgap.getNote(targetid, targettype);
        if (note !== null && note.body !== ""){
            return JSON.parse(note.body);
        } else {
            return null;
        }
    },
   //- --- --- - - --- --- ---- - - --- --- --- ---- - - - --- - -- -- ---- - - --- -
}; // end of plugin block
//- --- --- - - --- --- ---- - - --- --- --- ---- - - - --- - -- -- ---- - - --- -
//- --- --- - - --- --- ---- - - --- --- --- ---- - - - --- - -- -- ---- - - --- -
//- --- --- - - --- --- ---- - - --- --- --- ---- - - - --- - -- -- ---- - - --- -
//- --- --- - - --- --- ---- - - --- --- --- ---- - - - --- - -- -- ---- - - --- -
//- --- --- - - --- --- ---- - - --- --- --- ---- - - - --- - -- -- ---- - - --- -
//- --- --- - - --- --- ---- - - --- --- --- ---- - - - --- - -- -- ---- - - --- -
// Register plugin information @ NU
vgap.registerPlugin(shipNames, plgname);
if (debug){console.log("Ship Names Baptism: v" + plgversion + " registered vgap(v"+vgap.version+")" );}

} //end wrapper for injection . . . . . . . . . . . . . . . . . . . . . .
// - --- -- --- -   -  - - --- --- - - - - - -- - --- - --- - - - -- -----  - -  -    - - -- - ---  --

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";
document.body.appendChild(script);
// - --- -- --- -   -  - - --- --- - - - - - -- - --- - --- - - - -- -----  - -  -    - - -- - ---  --
// - --- -- --- -   -  - - --- --- - - - - - -- - --- - --- - - - -- -----  - -  -    - - -- - ---  --
// - --- -- --- -   -  - - --- --- - - - - - -- - --- - --- - - - -- -----  - -  -    - - -- - ---  --
// - --- -- --- -   -  - - --- --- - - - - - -- - --- - --- - - - -- -----  - -  -    - - -- - ---  --
// - --- -- --- -   -  - - --- --- - - - - - -- - --- - --- - - - -- -----  - -  -    - - -- - ---  --
// - --- -- --- -   -  - - --- --- - - - - - -- - --- - --- - - - -- -----  - -  -    - - -- - ---  --
// - --- -- --- -   -  - - --- --- - - - - - -- - --- - --- - - - -- -----  - -  -    - - -- - ---  --
// - --- -- --- -   -  - - --- --- - - - - - -- - --- - --- - - - -- -----  - -  -    - - -- - ---  --
// EOF -----------------------------------------------------------------------------------------------
// - --- -- --- -   -  - - --- --- - - - - - -- - --- - --- - - - -- -----  - -  -    - - -- - ---  --
// - --- -- --- -   -  - - --- --- - - - - - -- - --- - --- - - - -- -----  - -  -    - - -- - ---  --
// - --- -- --- -   -  - - --- --- - - - - - -- - --- - --- - - - -- -----  - -  -    - - -- - ---  --
// - --- -- --- -   -  - - --- --- - - - - - -- - --- - --- - - - -- -----  - -  -    - - -- - ---  --







