// ==UserScript==
// @name			RBR Czech - Class Addendum
// @namespace 		RBRCzechScripts
// @author			Łukasz Demolin "Maggot"
// @version 		0.8.0.3
// @date         2016-08-24
// @icon         https://dl.dropboxusercontent.com/u/10106549/e-rajdy/richard_burns_rally.ico
// @description		Adds omitted class links on rbr.onlineracing.cz
// @description		Also adds missing tracks on the "Ranks" and "Record" pages everywhere. Added dropdown-menu with stage select on stagerec/stagerank pages.
// @description		Unfortunately, the times and car names are not displayed (major hurdle).
// @require     https://code.jquery.com/jquery-3.0.0.js
// @include     http://rbr.onlineracing.cz/index.php*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest

// @downloadURL https://update.greasyfork.org/scripts/20954/RBR%20Czech%20-%20Class%20Addendum.user.js
// @updateURL https://update.greasyfork.org/scripts/20954/RBR%20Czech%20-%20Class%20Addendum.meta.js
// ==/UserScript==

// Populating a handy faux-dictionary with classes and their correct ids (to avoid messing up and hardcoding).
var classesDict = { "WRC legacy": 1,
    "N4" : 3,
    "S2000" : 13,
    "S1600" : 2,
    "A8" : 4,
    "A7" : 5,
    "A6" : 6,
    "A5" : 7,
    "N3" : 8,
    "H" : 11,
    "GT" : 14,
    "RC1" : 101,
    "RC2" : 102,
    "RGT" : 103,
    "RC3" : 104,
    "RC4" : 105,
    "RC5" : 106,
    "WRC" : 111,
    "H/B" : 107,
    "H/A" : 108,
    "H/4" : 109,
    "H/2" : 110
};

// A dictionary of sorts to assign all the countries correctly (sorts the duplicates like CZ/Czech Republic and mistakes like Sweeden). Preparing for CSS classes (avoiding spaces -> using the international 2-digit codes).
var countriesDict = { "Finland" : "FI",
                    "Great Britain" : "GB",
                     "Rally School" : "GB",
                     "Rally school" : "GB",
                     "Australia" : "AU",
                     "France" : "FR",
                     "Japan" : "JP",
                     "USA": "US",
                     "CZ" : "CZ",
                     "Czech Republic" : "CZ",
                     "Netherlands" : "NL",
                     "Germany" : "DE",
                     "Ireland" : "IE",
                     "Slovakia" : "SK",
                     "Lithuania" : "LT",
                     "Poland" : "PL",
                     "Spain" : "ES",
                     "Montekland" : "Montek",
                     "Sweeden" : "SE",
                     "Sweden" : "SE",
                     "Argentina" : "AR",
                     "Estonia" : "EE",
                     "Italy" : "IT",
                     "Itally" : "IT",
                     "Slovenia" : "SI",
                     "Switzerland" : "CH",
                     "Swiss" : "CH",
                     "Ukraine" : "UA",
                     "Test":"Test"
};

// An array of helpful data related to sorting and subtitling the stages and countries.
var countriesSortOrder = [["FI", "Finland", "http://rbr.onlineracing.cz/images/flgs/FI.gif"],
                          ["SE", "Sweden", "http://rbr.onlineracing.cz/images/flgs/SE.gif"],
                          ["GB", "Great Britain", "http://rbr.onlineracing.cz/images/flgs/GB.gif"],
                          ["IE", "Ireland", "http://rbr.onlineracing.cz/images/flgs/IE.gif"],
                          ["AU", "Australia", "http://rbr.onlineracing.cz/images/flgs/AU.gif"],
                          ["FR", "France", "http://rbr.onlineracing.cz/images/flgs/FR.gif"],
                          ["JP", "Japan", "http://rbr.onlineracing.cz/images/flgs/JP.gif"],
                          ["US", "USA", "http://rbr.onlineracing.cz/images/flgs/US.gif"],
                          ["CZ", "Czech Republic", "http://rbr.onlineracing.cz/images/flgs/CZ.gif"],
                          ["SK", "Slovakia", "http://rbr.onlineracing.cz/images/flgs/SK.gif"],
                          ["PL", "Poland", "http://rbr.onlineracing.cz/images/flgs/PL.gif"],
                          ["DE", "Germany", "http://rbr.onlineracing.cz/images/flgs/DE.gif"],
                          ["NL", "Netherlands", "http://rbr.onlineracing.cz/images/flgs/NL.gif"],
                          ["LT", "Lithuania", "http://rbr.onlineracing.cz/images/flgs/LT.gif"],
                          ["EE", "Estonia", "http://rbr.onlineracing.cz/images/flgs/EE.gif"],
                          ["SI", "Slovenia", "http://rbr.onlineracing.cz/images/flgs/SI.gif"],
                          ["UA", "Ukraine", "http://rbr.onlineracing.cz/images/flgs/UA.gif"],
                          ["ES", "Spain", "http://rbr.onlineracing.cz/images/flgs/ES.gif"],
                          ["IT", "Italy", "http://rbr.onlineracing.cz/images/flgs/IT.gif"],
                          ["CH", "Switzerland", "http://rbr.onlineracing.cz/images/flgs/CH.gif"],
                          ["AR", "Argentina", "http://rbr.onlineracing.cz/images/flgs/AR.gif"],
                          ["Montek", "Montekland", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAQCAIAAACHs/j/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAD5klEQVR4Xl2TbUxbVRjHn+ee+35v29s3oGtBbZnRDChjsNE007llwsYSNbwMo0OIMca4qYnJwhKDxrlojPEDw5e4+AKZ7wlxWczitwW3IQw3MIw5ySoQMyhvZW1vL+297fUDrBn8vpxzPvx/ef455wBsAKtrilxuAZESRdLdU3Dht5DNxtsUYegqd2XoOYuF9Xjl/nMFbe1FG4PrkI1HtFjJ13322TnH3Kza3GIeOMSXBlyipL7QkSos4FU1c/KUGg6Xnflci0RWAIBhaIHndN1Yz2+wAYgSe/oTW/Nh75XfNV9JxF9qULnyXM5LEQVQgBwCNZRJux/ffZMX1Oqd1KMPmz2nycREbINFkIQ9e+1VVXaPR3mm0T0ySheXkOMncHCYSqySlIGqAaoBqkGv6iEtE44ucamMMjW9u6pKvn8mem3RVO32JPNlb+H27SV6OjowkEjE+Rvj4cV5hWFvNTaNhR/TAQHAyOIgIFptoCYaX3n50rVrybxrMyUPypf/YFMGdLxEAQAgIIXByqDdLnW9g9FlUPW1GSFl4PlfrbW7lPJypazc6vdbZVmC/FUgoiSJDENoWt67V+3/GW+Mm2ACmBCdi+q6bhjURx+YUxGMzlFbPCDJ5kOB9JH24NNP2ZAk/xoz5uc10zQBABxO57Otrh9+LF2K12m6K2VAfBU/7obCIgQAROh6m8wuEYeT1B2oa2s/sueJUFMLGf+b6j3r83gVAOpevXtwHKc4LC2HrSOjnGrAcgJ/6ieRGez7jvSeZZMZHL6+nkHAgD/Asqwkwp9j3OWr7lePbgkEFJ5nIV82m83ShCp+oHR/nd3pnCcMrCwjL+DO2lx8BRYWcFWjBi6ad++CCRCLxXK5bFMzlgWL7/y3NZ0Gmo0vLbLptAkAwDD0jmrnL+f8k1Oh29NcNEbW+r77HhNdppIZuLMIyQz88y998hTldAMiNBzCuAbdn9lEUV4vCABrT0YQBYtMmwB6xpQtpLtHqT84bSIsLeCH71MuF+Xx5hCQ41Bx5HZUZ6OzlMtFG1m/2209/ubkV2eSGV2/X7oOw5Bjxx7R0qFYgool2ZReoWYckRlqcJhEZlDVUTO4lSSd0l0Tt2RfsSMUdrzVZdlVa0fc/LsAALZts42MFXae8FZUukeuBzVDTKX3a/rzWqZVyzy5qgc13fdNn9jUvPX8hcrmVjsiIqIgCCzLbnbxPH+wwe0rlgmhfT7rwnJbLEkdfcN6c7ImZbAjo8y335dphrOz00YhJYpcRaXN7rBttuQhhORn3rdPmV2oqm+wCBL/6Rf1KcPS8aJYUCRfvFTz2uvOfESSpPx+jf8Bk4d9ASiTkI4AAAAASUVORK5CYII="],
                          ["ROW", "Rest of the World", "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAIABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAEE/8QAIRAAAQMCBwEAAAAAAAAAAAAAEQABEgITBBQhIiMxYQX/xAAUAQEAAAAAAAAAAAAAAAAAAAAH/8QAFxEBAAMAAAAAAAAAAAAAAAAAABEiQf/aAAwDAQACEQMRAD8A04FmzvO1ZL2yIXDtnLSB78U+gzZx7DVk8gELh3QjpA9eIiWpsPsf/9k="]];

// An array or array with data of all the stages available on the site.
var stagesDict = [[10,"Kaihuavaara","Finland","Snow","6.1 km","Yes","Open"],
                  [11,"Mustaselka","Finland","Snow","7.9 km","Yes","Open"],
                  [12,"Sikakama","Finland","Snow","10.2 km","Yes","Open"],
                  [13,"Autiovaara","Finland","Snow","6.1 km","Yes","Open"],
                  [14,"Kaihuavaara II","Finland","Snow","6.1 km","Yes","Open"],
                  [15,"Mustaselka II","Finland","Snow","7.7 km","Yes","Open"],
                  [16,"Sikakama II","Finland","Snow","10.2 km","Yes","Open"],
                  [17,"Autiovaara II","Finland","Snow","6.1 km","Yes","Open"],
                  [20,"Harwood Forest","Great Britain","Gravel","6.1 km","Yes","Open"],
                  [21,"Falstone","Great Britain","Gravel","6.6 km","Yes","Open"],
                  [22,"Chirdonhead","Great Britain","Gravel","7 km","Yes","Open"],
                  [23,"Shepherds Shield","Great Britain","Gravel","4.8 km","Yes","Open"],
                  [24,"Harwood Forest II","Great Britain","Gravel","5.9 km","Yes","Open"],
                  [25,"Chirdonhead II","Great Britain","Gravel","6.9 km","Yes","Open"],
                  [26,"Falstone II","Great Britain","Gravel","6.6 km","Yes","Open"],
                  [27,"Shepherds Shield II","Great Britain","Gravel","4.9 km","Yes","Open"],
                  [30,"Greenhills II","Australia","Gravel","6 km","Yes","Open"],
                  [31,"New Bobs","Australia","Gravel","10.1 km","Yes","Open"],
                  [32,"Greenhills","Australia","Gravel","6 km","Yes","Open"],
                  [33,"Mineshaft","Australia","Gravel","8.2 km","Yes","Open"],
                  [34,"East-West","Australia","Gravel","9.5 km","Yes","Open"],
                  [35,"New Bobs II","Australia","Gravel","10 km","Yes","Open"],
                  [36,"East-West II","Australia","Gravel","9.6 km","Yes","Open"],
                  [37,"Mineshaft II","Australia","Gravel","8.2 km","Yes","Open"],
                  [41,"Cote D'Arbroz","France","Tarmac","4.5 km","Yes","Open"],
                  [42,"Joux Verte","France","Tarmac","7.9 km","Yes","Open"],
                  [43,"Bisanne","France","Tarmac","5.6 km","Yes","Open"],
                  [44,"Joux Plane","France","Tarmac","11.1 km","Yes","Open"],
                  [45,"Joux Verte II","France","Tarmac","7.8 km","Yes","Open"],
                  [46,"Cote D'Arbroz II","France","Tarmac","4.3 km","Yes","Open"],
                  [47,"Bisanne II","France","Tarmac","5.6 km","Yes","Open"],
                  [48,"Joux Plane II","France","Tarmac","11.1 km","Yes","Open"],
                  [50,"Sipirkakim II","Japan","Gravel","8.7 km","Yes","Open"],
                  [51,"Noiker","Japan","Gravel","13.8 km","Yes","Open"],
                  [52,"Sipirkakim","Japan","Gravel","8.7 km","Yes","Open"],
                  [53,"Pirka Menoko","Japan","Gravel","6.7 km","Yes","Open"],
                  [54,"Tanner","Japan","Gravel","3.9 km","Yes","Open"],
                  [55,"Noiker II","Japan","Gravel","13.7 km","Yes","Open"],
                  [56,"Tanner II","Japan","Gravel","4 km","Yes","Open"],
                  [57,"Pirka Menoko II","Japan","Gravel","6.7 km","Yes","Open"],
                  [60,"Frazier Wells II","USA","Gravel","5 km","Yes","Open"],
                  [61,"Fraizer Wells","USA","Gravel","5 km","Yes","Open"],
                  [62,"Prospect Ridge","USA","Gravel","7.8 km","Yes","Open"],
                  [63,"Diamond Creek","USA","Gravel","7.1 km","Yes","Open"],
                  [64,"Hualapai Nation","USA","Gravel","8.6 km","Yes","Open"],
                  [65,"Prospect Ridge II","USA","Gravel","7.9 km","Yes","Open"],
                  [66,"Diamond Creek II","USA","Gravel","6.8 km","Yes","Open"],
                  [67,"Hualapai Nation II","USA","Gravel","8.6 km","Yes","Open"],
                  [70,"Prospect Ridge II A","USA","Gravel","7.6 km","Yes","Open"],
                  [71,"Rally School Stage","Rally school","Gravel","2.2 km","Yes","Open"],
                  [90,"Rally School Stage II","Rally school","Gravel","2.3 km","Yes","Open"],
                  [94,"Stryckovy okruh","CZ","Tarmac","9.2 km","Yes","Open"],
                  [95,"Sumburk 2007","CZ","Tarmac","12.4 km","No","Open"],
                  [96,"Sosnova","CZ","Tarmac","7.1 km","No","Open"],
                  [105,"Sosnova 2010","CZ","Tarmac","4.2 km","No","Restricted"],
                  [106,"Stryckovy - Zadni Porici","CZ","Tarmac","6.9 km","Yes","Open"],
                  [107,"PTD Rallysprint","Netherlands","Gravel","5.1 km","Yes","Open"],
                  [108,"Osli - Stryckovy","CZ","Tarmac","10.6 km","Yes","Open"],
                  [125,"Bergheim v1.1","Germany","Tarmac","8 km","Yes","Open"],
                  [131,"Lyon - Gerland","France","Tarmac","0.7 km","Yes","Restricted"],
                  [132,"Gestel","Netherlands","Tarmac","7.2 km","Yes","Open"],
                  [139,"RSI slalom Shonen","Ireland","Tarmac","1 km","Yes","Open"],
                  [140,"RSI slalom gegeWRC","Ireland","Tarmac","1.8 km","Yes","Open"],
                  [141,"Mlynky","Slovakia","Tarmac","7.1 km","Yes","Open"],
                  [142,"Mlynky Snow","Slovakia","Snow","7.1 km","Yes","Open"],
                  [143,"Peklo","Slovakia","Tarmac","8.5 km","Yes","Open"],
                  [144,"Peklo Snow","Slovakia","Snow","8.5 km","Yes","Open"],
                  [145,"Versme","Lithuania","Gravel","3.2 km","Yes","Open"],
                  [146,"Peklo II","Slovakia","Tarmac","8.5 km","Yes","Open"],
                  [147,"Peklo II Snow","Slovakia","Snow","8.5 km","Yes","Open"],
                  [148,"ROC 2008","Great Britain","Tarmac","2 km","Yes","Open"],
                  [149,"Sieversdorf V1.1","Germany","Tarmac","8 km","Yes","Open"],
                  [152,"RP 2009 Shakedown","Poland","Gravel","4.4 km","Yes","Open"],
                  [153,"RP 2009 Shakedown Reversed","Poland","Gravel","4.4 km","Yes","Open"],
                  [154,"Bruchsal-Unteroewisheim","Germany","Tarmac","8.9 km","Yes","Open"],
                  [155,"Humalamaki 1.0","Finland","Gravel","4.4 km","Yes","Open"],
                  [156,"Mlynky II","Slovakia","Tarmac","7.1 km","Yes","Open"],
                  [157,"Grand Canaria ROC 2000","Spain","Gravel","3.8 km","Yes","Open"],
                  [158,"Sweet Lamb","Great Britain","Gravel","5.1 km","Yes","Open"],
                  [159,"Sweet Lamb II","Great Britain","Gravel","5.1 km","Yes","Open"],
                  [471,"Aragona","Italy","Tarmac","6.4 km","Yes","Restricted"],
                  [472,"Muxarello","Italy","Tarmac","15.4 km","Yes","Restricted"],
                  [479,"Shomaru Pass","Japan","Tarmac","5.8 km","Yes","Open"],
                  [480,"Shomaru Pass II","Japan","Tarmac","5.8 km","Yes","Open"],
                  [481,"Karlstad","Sweeden","Snow","1.9 km","Yes","Open"],
                  [482,"Karlstad II","Sweeden","Snow","1.9 km","Yes","Open"],
                  [484,"Humalamaki Reversed","Finland","Gravel","4.4 km","Yes","Open"],
                  [488,"Jirkovicky","Montekland","Gravel","3.5 km","No","Restricted"],
                  [489,"Jirkovicky II","Montekland","Gravel","3.5 km","No","Restricted"],
                  [490,"Sourkov","Montekland","Gravel","6.2 km","No","Restricted"],
                  [491,"Lernovec","Montekland","Gravel","5 km","No","Restricted"],
                  [492,"Uzkotin","Montekland","Gravel","7.8 km","No","Restricted"],
                  [493,"Hroudovany","Montekland","Gravel","7.1 km","No","Restricted"],
                  [494,"Snekovice","Montekland","Gravel","8.6 km","No","Restricted"],
                  [495,"Lernovec II","Montekland","Gravel","5 km","No","Restricted"],
                  [496,"Uzkotin II","Montekland","Gravel","7.6 km","No","Restricted"],
                  [497,"Hroudovany II","Montekland","Gravel","7.1 km","No","Restricted"],
                  [498,"Snekovice II","Montekland","Gravel","8.6 km","No","Restricted"],
                  [499,"Sourkov 2","Montekland","Gravel","6.2 km","No","Restricted"],
                  [516,"Hradek 1","CZ","Tarmac","5.8 km","No","Open"],
                  [517,"Hradek 2","CZ","Tarmac","5.8 km","No","Open"],
                  [518,"Liptakov 1","CZ","Tarmac","6 km","No","Open"],
                  [519,"Liptakov 2","CZ","Tarmac","6 km","No","Open"],
                  [522,"Rally School Czech","Czech Republic","Tarmac","3.2 km","Yes","Open"],
                  [524,"Rally School Czech II","Czech Republic","Tarmac","3.1 km","Yes","Open"],
                  [528,"Kuadonvaara","Finland","Snow","5.7 km","Yes","Open"],
                  [533,"Karowa 2009","Poland","Tarmac","1.6 km","Yes","Open"],
                  [534,"Haugenau 2012","France","Tarmac","5.7 km","Yes","Open"],
                  [544,"Fernet Branca","Argentina","Gravel","6 km","Yes","Open"],
                  [545,"Junior Wheels I","Australia","Gravel","5.6 km","Yes","Open"],
                  [546,"Junior Wheels II","Australia","Gravel","5.6 km","Yes","Open"],
                  [550,"Foron","France","Tarmac","9.2 km","Yes","Open"],
                  [551,"Foron II","France","Tarmac","9.2 km","Yes","Open"],
                  [552,"Foron Snow","France","Snow","9.1 km","Yes","Open"],
                  [553,"Foron Snow II","France","Snow","9.1 km","Yes","Open"],
                  [555,"Maton I","France","Tarmac","3.5 km","Yes","Open"],
                  [556,"Maton II","France","Tarmac","3.5 km","Yes","Open"],
                  [557,"Red Bull HC","Italy","Gravel","14 km","Yes","Open"],
                  [558,"Maton snow","France","Snow","3.5 km","Yes","Open"],
                  [559,"Maton snow II","France","Snow","3.5 km","Yes","Open"],
                  [560,"Loch Ard","Great Britain","Gravel","8.3 km","Yes","Open"],
                  [561,"Loch Ard II","Great Britain","Gravel","8.3 km","Yes","Open"],
                  [565,"Undva Reversed","Estonia","Gravel","10 km","Yes","Open"],
                  [566,"Undva","Estonia","Gravel","10 km","Yes","Open"],
                  [570,"Peyregrosse - Mandagout","France","Tarmac","12.8 km","Yes","Open"],
                  [571,"Peyregrosse - Mandagout NIGHT","France","Tarmac","12.8 km","Yes","Open"],
                  [572,"Castrezzato","Italy","Tarmac","8.1 km","Yes","Open"],
                  [573,"SS Daniel Bonara","Italy","Tarmac","5.5 km","Yes","Open"],
                  [574,"Sorica","Slovenia","Tarmac","15.5 km","Yes","Open"],
                  [582,"Barum rally 2009 Semetin","CZ","Tarmac","11.7 km","Yes","Open"],
                  [583,"Barum rally 2010 Semetin","CZ","Tarmac","11.7 km","Yes","Open"],
                  [585,"SWISS II","Switzerland","Gravel","5.6 km","Yes","Open"],
                  [586,"SWISS I","Switzerland","Tarmac","5.6 km","Yes","Open"],
                  [587,"Swiss IV","Swiss","Gravel","8.2 km","Yes","Open"],
                  [589,"Swiss III","Swiss","Tarmac","8.2 km","Yes","Open"],
                  [590,"Blanare","France","Snow","7.6 km","Yes","Open"],
                  [591,"Blanare II","France","Snow","6.6 km","Yes","Open"],
                  [592,"Slovakia Ring 2014","Slovakia","Tarmac","11 km","Yes","Open"],
                  [593,"Slovakia Ring 2014 II","Slovakia","Tarmac","11 km","Yes","Open"],
                  [595,"Sardian","USA","Tarmac","5.1 km","Yes","Open"],
                  [596,"Sardian Night","USA","Tarmac","5.1 km","Yes","Open"],
                  [597,"Mlynky Snow II","Slovakia","Snow","7.1 km","Yes","Open"],
                  [598,"Pikes Peak 2008","USA","Tarmac","19.9 km","Yes","Open"],
                  [599,"Northumbria","Great Britain","Gravel","9 km","Yes","Open"],
                  [601,"Northumbria Tarmac","Great Britain","Tarmac","9 km","Yes","Open"],
                  [700,"Passo Valle","Italy","Tarmac","5.8 km","Yes","Open"],
                  [701, "Passo Valle Reverse", "Itally", "Tarmac", "5.8 km", "Yes", "Open"],
                  [711,"Akagi Mountain","Japan","Tarmac","3.5 km","Yes","Open"],
                  [712,"Akagi Mountain II","Japan","Tarmac","3.5 km","Yes","Open"],
                  [777,"Pian del Colle","Italy","Tarmac","8.3 km","Yes","Open"],
                  [778,"Pian del Colle Reversed","Italy","Tarmac","8.4 km","Yes","Open"],
                  [779,"Pian del Colle Snow","Italy","Snow","8.3 km","Yes","Open"],
                  [780,"Pian del Colle Snow Reversed","Italy","Snow","8.4 km","Yes","Open"],
                  [800,"Ai-Petri","Ukraine","Tarmac","17.3 km","Yes","Open"],
                  [801,"Uchan-Su","Ukraine","Tarmac","10.8 km","Yes","Open"],
                  [802,"Ai-Petri Winter","Ukraine","Snow","17.3 km","Yes","Open"],
                  [803,"Uchan-Su Winter","Ukraine","Snow","10.8 km","Yes","Open"],
                  [810,"Livadija","Ukraine","Tarmac","5.5 km","Yes","Open"],
                  [811,"Livadija II","Ukraine","Tarmac","5.5 km","Yes","Open"],
                  [830,"Azov","Ukraine","Gravel","19.1 km","Yes","Open"],
                  [831,"Azov II","Ukraine","Gravel","19.2 km","Yes","Open"],
                  [886,"Zaraso Salos Trekas - 5 laps","Lithuania","Gravel","5 km","Yes","Open"],
                  [887,"Zaraso Salos Trekas - 2 laps","Lithuania","Gravel","2 km","Yes","Open"],
                  [888,"Shakedown Rally del Salento 2014","Italy","Tarmac","3.8 km","Yes","Open"],
                  [911,"Torre Vecchia","Italy","Tarmac","9.8 km","Yes","Open"],
                  [969,"Tavia","Italy","Gravel","3.8 km","Yes","Open"],
                  [979,"Berica","Italy","Gravel","14.8 km","Yes","Open"],
                  [980,"Rally Wisla Shakedown","Poland","Tarmac","2.5 km","Yes","Open"],
                  [981,"Hyppyjulma gravel","Finland","Gravel","6.1 km","Yes","Open"],
                  [982,"Hyppyjulma gravel II","Finland","Gravel","6.1 km","Yes","Open"],
                  [983,"Hyppyjulma tarmac","Finland","Tarmac","6.1 km","Yes","Open"],
                  [984,"Hyppyjulma tarmac II","Finland","Tarmac","6.1 km","Yes","Open"],
                  [985,"Kolmenjarvet gravel","Finland","Gravel","6.1 km","Yes","Open"],
                  [986,"Kolmenjarvet gravel II","Finland","Gravel","6.1 km","Yes","Open"],
                  [987,"Kolmenjarvet tarmac","Finland","Tarmac","6.1 km","Yes","Open"],
                  [988,"Kolmenjarvet tarmac II","Finland","Tarmac","6.1 km","Yes","Open"],
                  [993,"Kormoran Shakedown","Poland","Gravel","5.2 km","Yes","Open"],
                  [994,"Kormoran I","Poland","Gravel","10.3 km","No","Open"],
                  [995,"Kormoran II","Poland","Gravel","12 km","No","Open"],
                  [996, "SSS Mikolajki I", "Poland", "Gravel", "2.6 km", "Yes", "Restricted"],
                  [997, "SSS Mikolajki II", "Poland", "Gravel", "2.6 km", "Yes", "Restricted"],
                  [1012,"Puy du Lac","France","Tarmac","5 km","Yes","Open"],
                  [1024,"GB Sprint Extreme","Great Britain","Gravel","6.7 km","Yes","Open"],
                  [1025,"FSO Zeran - Warsaw","Poland","Tarmac","7.1 km","Yes","Open"],
                  [1033,"Track Test","Test","Tarmac","1.6 km","Yes","Restricted"],
                  [1141,"Snow Cote D'Arbroz","France","Snow","4.5 km","Yes","Open"],
                  [1142,"Snow Joux Verte","France","Snow","7.9 km","Yes","Open"],
                  [1143,"Snow Bisanne","France","Snow","5.6 km","Yes","Open"],
                  [1144,"Snow Joux Plane","France","Snow","11.1 km","Yes","Open"],
                  [1145,"Snow Joux Verte II","France","Snow","7.9 km","Yes","Open"],
                  [1146,"Snow Cote D'Arbroz II","France","Snow","4.5 km","Yes","Open"],
                  [1147,"Snow Bisanne II","France","Snow","5.6 km","Yes","Open"],
                  [1148,"Snow Joux Plane II","France","Snow","11.1 km","Yes","Open"],
                  [1899,"Courcelles Val'd Esnoms","France","Tarmac","9.9 km","Yes","Open"],
                  [1900,"Vieux Moulin-Perrancey","France","Gravel","20.5 km","Yes","Open"]];

// A couple of helpful vars to make traversing the stage data easier.
var stageID = 0, stageName = 1, stageCountry = 2, stageSurface = 3, stageDistance = 4, stageIsShakedownable = 5, stageIsRestricted = 6;

// An array "with holes" of stages with the information wheter or not they are on the page (undefined -> not, "true" -> yes)
var isStageOnThePage = [];

// Reading the favourite class from local storage (if doesn't exist - 0 to know it's not there).
var favClass = GM_getValue("favClass", 0);
// Creating a progressbar object to hold information about it.
var progressBar = { requests: 0, completed: 0, location: "", increment: function(){
  this.completed ++;
  var bar = $(this.location).children("span");
  var percComplete = (this.completed/this.requests)*100;
  if (this.requests > 0) {$(bar).css("width",percComplete + "%"); $(bar).html("Loading: " + Math.round(percComplete) + "% &nbsp;");}
  if (this.completed === this.requests) {
    $(bar).addClass("meterdone");
    $(bar).html("All data loaded! &nbsp;&nbsp;");
  }
}};

// Parsing the URL looking for a certain parameter (returning a string with value, or empty string if no value found).
function parseurl( name ){
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( document.URL );
  console.log(results);
  if( results === null )
    return "";
  else{/*
      if (name == "stageid"){
          return results[0]; // results "stageid=13"
      }
      else {
          return results[1];
      }*/
      return results[1];
  }
}

// Creating a base link to display in each row of the table. Link's contents depend on the type of site we're on.
function makeLinkBase(){
	var doLinkow = [];
	if (whereAmI == "urec" || whereAmI == "urank") { doLinkow[0] = whereAmI.replace("u", "stage"); }
	else { if (whereAmI == "tstats") { switch (parseurl("type")) { case "1": doLinkow[0] = "stagerec"; break; case "3": doLinkow[0] = "stagerank"; break; default: doLinkow[0] = "stagerec"; break; }}}
	doLinkow[1] = parseurl("classid");
	doLinkow[2] = parseurl("state");
	if (doLinkow[1] === "") { doLinkow[1] = 1; }

	return doLinkow;
}

// Finding the results table, non-jquery method (legacy).
function findResultsTable(){
	var tables = document.getElementsByTagName("table");
	for (var i = 0; i < tables.length; i++) {
		if (tables[i].width == '70%'){
			return tables[i].children[0];
		}
	}
	return null;
}

// Adding a head to the results table (it's missing by default)
function addHeadAndBody(){
    console.log("Searching for the head...");
    var thead = $("thead", resultsTable);
    /*console.log(thead);*/
    if (thead.length === 0){ // To avoid adding a second thead
        console.log("No head, wrapping.");
        $("<thead></thead>").prependTo(resultsTable);
        $("tr:first", resultsTable).appendTo($("thead", resultsTable));
    }
}

// Function finding and returning results table (records/ranks) via jQuery selector.
// The only unique attribute of that table is it's hard-coded width of 70% (no special classes and/or ids.
function findResultsTableJQ(){
    return $('table[width="70%"]');
}

// Function finding the correct ID of s
function findStage(name){
    for (var i = 0, len = stagesDict.length; i < len; i++)
    {
        if (stagesDict[i][stageName] === name)
        {
            return stagesDict[i]; // Return as soon as the object is found with the matching name
        }
    }
    return 0; // If the loop does not find a matching name - return 0
}

// Function changing the contents of the stages table (Country converted to the 2digit country codes according to the dictionary
function convertStageCountries(){
    console.log("Processing stage countries (dict)...");
    var currCountry = 0; // Current, processed country.
    var targetCountry = 0; // Our target, a two-digit code.
    $.each((stagesDict), function (key, value){
        // console.log("Processing " + value);
        currCountry = value[stageCountry]; // Read from the object with 2-digit codes.
        if (currCountry !== undefined){
            targetCountry = countriesDict[currCountry];
            if (targetCountry !== undefined && targetCountry !== 0){
                value[stageCountry] = targetCountry;
            } else {value[stageCountry] = "ROW";} // Default fallback for non-defined countrynames, Rest-of-World.
        } else {value[stageCountry] = "ROW"};
        // console.log("Results: " + value + " // Country: " + currCountry + "->" + targetCountry);
    });
    console.log("Stage countries processed!");
}

// Function sorting the stagesDict alphabetically (due to automatization reasons will not be done by hand)
// NOT USED due to performance issues. Insead all list are sorted during adding to table/selector.
function sortStagesDict(){
    stagesDict.sort(function (a, b) {

            var A = a[stageName].toUpperCase();
            var B = b[stageName].toUpperCase();
            console.log(A + " i " + B);

            if(A < B) {console.log("-1"); return -1;}
            if(A > B) {console.log("1"); return 1;}
            return 0;
        });
    $.each((stagesDict), function (key, value){ console.log(key + "//" + value);});
}

// Apllying correct classes (country codes) to all rows of the table + removing empty rows (containing blank names).
function classifyStages(stagesToClassify){
    var currStage = 0;
    var stageData = 0;
    console.log(stagesToClassify);
    $.each($(stagesToClassify), function (key, value) {
        currStage = $("td:first-of-type", this).text(); // Picking the name of the stage
        if (currStage === ""){ // Checking wheter or not the name is blank to avoid unnecessary processing.
            $(this).remove();
            console.warn("Removing empty line at row " + key);
        }else {
            stageData = findStage(currStage); // Finding the data for the stage (in stagesDict)
            // console.log("Processing stage: " + currStage + " // results: [" + stageData + "]");
            if(stageData !== 0){ // Processing further only if some data is found.
                if (stageData[stageCountry] !== undefined){ // Checking if the country from stageData exists, if not -> apply ROW class)
                    $(this).addClass(stageData[stageCountry]);
                    // console.log("%cProcessing succesful, added class: " + countriesDict[stageData[stageCountry]], 'background: #B2FFB2; color: #233323');
                    $("td:first", this).append("<br/> (" + stageData[stageSurface] + ", " + stageData[stageDistance] + ")");
                }else{ // No country data found - apllying the default class (ROW)
                    console.warn("No country entry for: " + stageData[stageCountry]);
                    $(this).addClass("ROW");
                }
                // Adding a unique id to every stage to quickly find it by id later.
                $(this).attr("id", "trid" + stageData[stageID]);
                isStageOnThePage[stageData[stageID]] = "true"; // Adding the info about the stage being on the page to the array. TODO: Find out why its not applying.

            }else { // No stage data found - applying the default class (ROW)
                console.warn("No stage data for: " + currStage);
                $(this).addClass("ROW");
            }
        }
    });
    // Diagnostic - pring the list of stages visible on the page.
    console.log(isStageOnThePage);
}

// Function searching for and adding missing stages.
function addMissingStages(){
  var selectedStage;
  var tableType = parseurl("type"); // Parsing url for "type".
  if ( tableType === "3" || whereAmI == "urank" ) {
    tableType = "ranks"; // "ranks" are on "tstats" with type 3 and uranks.
  } else {
    tableType = "records"; // otherwise: default to records.
  }
  console.log("Adding missing stages...");
  var topnavBar = $(".topnav");
  $(topnavBar[0]).attr("width", "13%");
  $(topnavBar[2]).attr("width","13%");
  $(topnavBar[0]).html('<div class="meter"><span style="width: 1%"></span></div>');
  progressBar.location = $(".meter");
  for (var index = 0; index < stagesDict.length; index++){
    selectedStage = stagesDict[index];
    if (selectedStage[stageCountry] !== "Test"){ // Not adding the "test" stages.
      if ($("#trid"+selectedStage[stageID]).length === 0){
        console.log("Found missing stage. Adding info.");
        console.log(selectedStage);
        resultsTable.append(createStage(selectedStage[stageName], selectedStage[stageID], linkBase, "row2")); // Adding the row with the missing stage info + links.
        progressBar.requests++;
        getStageData(selectedStage[stageID], tableType); // Filling with data. TODO: add a switch to turn off filling with data.
      } else {
        // console.log("Stage "+ selectedStage[stageName] +" already exists. Skipping!");
      }
    }
  }
  console.log("Finished adding missing stages.");
}

// Function creatin a row for the stage in the stages table. Takes innerHTML for each column.
function createStage( nazwaos , stageid , base , rowstyl , column2 , column3 , column4 , column5 ) {
	var rowTemp = document.createElement("tr");
	var komTemp = document.createElement("td");
	rowTemp.setAttribute("class", rowstyl);
	komTemp.innerHTML = '<a href="http://rbr.onlineracing.cz/index.php?act=' + base[0] + '&stageid=' + stageid + '&classid=' + base[1] + '&state=' + base[2] + '">' + nazwaos + '</a>';
	rowTemp.appendChild(komTemp);
	var tdcount;
	var tempTD;
	if (whereAmI == "urec" || whereAmI == "urank") {tdcount = 5; } else {tdcount = 4;}
	for(var i = 1; i<tdcount; i++) {
		tempTD = document.createElement("td");
		tempTD.innerHTML = "";
		if (i === 1 && typeof column2 !== "undefined") { tempTD.innerHTML = column2; }
		if (i === 2) {
      tempTD.setAttribute("align", "center"); // 3, 4 and 5th column are aligned to the center of the cell.
      if (typeof column3 !== "undefined") { tempTD.innerHTML = column3; }; // Fill with data only if data was provided.
    }
    if (i === 3) {
      tempTD.setAttribute("align", "center");
      if (typeof column4 !== "undefined") { tempTD.innerHTML = column4; };
    }
    if (i === 4) {
      tempTD.setAttribute("align", "center");
      if (typeof column5 !== "undefined") { tempTD.innerHTML = column5; };
    }
		rowTemp.appendChild(tempTD);
	}
	return rowTemp;
}

// Function creating a "subtitle", coloured breaker in the stages list descripting the country/region.
function createSub ( subtitle , country, flag ) {
	var rowSub = document.createElement("tr");
    rowSub.setAttribute("class", country + " header");
    //Adding an option to collapse rows until next country
    $(rowSub).click(function(){
        if ($(this).next().hasClass("hidden")){
            $(this).nextUntil('tr.header').removeClass("hidden");
            countriesHidden[country] = "false";
            // $(this).nextUntil('tr.header').toggle();
        } else {
            $(this).nextUntil('tr.header').addClass("hidden");
            countriesHidden[country] = "true";
            // console.log(countriesHidden);
        }
        GM_setValue("countriesHiddenSaved", JSON.stringify(countriesHidden));
        console.log(JSON.stringify(countriesHidden));
    });
	var thSub = document.createElement("th");
	if (whereAmI === "tstats") { thSub.setAttribute("colspan", "4"); // On global stats page the table has one less column.
} else {thSub.setAttribute("colspan", "5");} // Merge 5 columns on users stat page.
	thSub.innerHTML = subtitle;
	if (flag !== undefined) {
		var flagIcon = document.createElement("IMG");
		flagIcon.src = flag;
		flagIcon.setAttribute("style", "float: left; margin-left: 3px; border: 1px solid black;");
		flagIcon.setAttribute("alt", subtitle);
		flagIcon.setAttribute("title", subtitle);
        var flagIcon2 = $(flagIcon).clone();
        flagIcon.style="float: right; margin-right: 3px; border: 1px solid black;";
		thSub.appendChild(flagIcon);
		$(thSub).append(flagIcon2);
	}
    // Appending contents to the row
	rowSub.appendChild(thSub);

	return rowSub;
}

// A simple function adding a missing GT class to filter list in results of events using legacy physics.
function addGTLink(){
	var links = document.getElementsByTagName("a");

	for (var i = 0; i < links.length; i++) {
		var isLastClass = links[i].href.indexOf("&class=11");

		if (isLastClass > -1 && links[i].text == "H"){
			var gt		= document.createElement("a");
			gt.href		= links[i].href.replace("&class=11","&class=14");
			gt.innerHTML = "GT";
			gt.style.position = "relative";
			gt.style.left = "-5px";
			gt.style.top = "0px";
            // Appending the creating link to the end of the listed classes.
            links[i].parentNode.appendChild(gt);
		}
	}
}

// Function getting the missing data for a stage.
// TODO: rewrite the function so that it returns the result instead of writing to global var.
function getStageData( idToCheck, tableType ){
  var myResult = {}; // Object with "my result", to be populated with data.
  var bestTime;
  var regexCar = /.*<br>\s*([^\n\r]*)/;
  var regexPlace = /[(](\d*)\//;
  var carCell, myTimeCell, bestTimeCell, myPlaceCell;
  var resultsTableXHR, bestTimeRow;
  var selectedClass = $("#classid").val(); // Read the value of currently selected class.
  var selectedState = $("#state").val(); // Read the value of currently selected country.
  if (selectedState === undefined) {selectedState = ""}; // If state is undefined - replace it with an empty string (for safety).
  if (tableType == "records"){
    var act = "stagerec";
  } else { var act = "stagerank"; }

  GM_xmlhttpRequest ({
    method: "GET",
    url: "http://rbr.onlineracing.cz/index.php?act="+ act + "&stageid=" + idToCheck + "&classid=" + selectedClass + "&state=" + selectedState,
    headers: {
      "User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
      "Accept": "text/xml"            // If not specified, browser defaults will be used.
    },
    timeout: 15000,
    ontimeout: function(){
      console.log("Request timed out! ID: " + idToCheck);
      progressBar.increment(); // TODO: log errors/timeouts and display info in progressbar.
    },
    onload: function(response) {
      var stageRow = {};
      // Finding the stagerow that we are processing.
      stageRow.full = $("#trid"+idToCheck, resultsTable); // Finding the row.
      // Handling the case of world rankings (not user's).
      if (whereAmI === "tstats") {
        // Finding the target cells with the car name, time and place.
        stageRow.car = $("td:nth-of-type(3)", stageRow.full);
        stageRow.myTime = null; // No place for user's time.
        stageRow.myPlace = null;
        stageRow.bestDriver = $("td:nth-of-type(2)", stageRow.full);
        stageRow.bestTime = $("td:nth-of-type(4)", stageRow.full);
      } else {
        // User rankings (non-tstats)
        // Finding the target cells with the car name, time and place.
        stageRow.car = $("td:nth-of-type(2)", stageRow.full);
        stageRow.myTime = $("td:nth-of-type(3)", stageRow.full);
        stageRow.bestTime = $("td:nth-of-type(4)", stageRow.full);
        stageRow.myPlace = $("td:nth-of-type(5)", stageRow.full);
        stageRow.bestDriver = null; // No place for the best driver on the page.
        // Finding the box with users results.
        var resultBox;
        resultBox = $('span[style="font-size:14px;"]', response.responseText); // Found by unique combination of span attributes.
        if (resultBox.length === 0) { // If user is not logged in there is no data to traverse.
          // console.log("User not logged in! ");
          myResult.car = "";
          myResult.myTime = "--:--:--";
          myResult.place = "---";
        } else { // Fill out the "My result" data only if user is logged in.
        // Finding the car name via regex (string after <br> in the span)
        myResult.carFull = regexCar.exec( resultBox[0].innerHTML ); // Holding full regex results in an object.
        if (myResult.carFull !== null) { // Add car only if a record is present. Otherwise -> skip this and the time+place steps.
          // Finding the link with the time in the resultbox
          myResult.car = myResult.carFull[1]; // Easily outputable car name (plaintext).
          myResult.myTime = $("a", resultBox); // Easily appendable link with best time.
          // Finding the place in the ranking via regex.
          myResult.place = regexPlace.exec( resultBox[0].innerHTML)[1] + ".";
        } else {
          myResult.myTime = "--:--:--";
          myResult.place = "---";
          myResult.car = "";
        }
      }
    }
    // Finding the row with the record time + cell with the time (link) itself.
    resultsTableXHR = $("#state", response.responseText).nextUntil("table").next(); // Results table, beginning with the enclosing table.
    // Cannot be done simpler, because the table we're looking for does not have any unique attributes.
    resultsTableXHR = $('table[width="100%"]', resultsTableXHR); // Finding the correct table inside it's parent.
    bestTimeRow = $("tr:nth-of-type(2)", resultsTableXHR); // Second row of the table is the one we are looking for.
    // Adding the world's best time to the myResult object.
    myResult.bestDriver = $("td:nth-of-type(2)", bestTimeRow).children();
    myResult.bestCar = $("td:nth-of-type(3)", bestTimeRow).html(); // Not children, because the car is in plaintext.
    myResult.bestTime = $("td:nth-of-type(4)", bestTimeRow).children();
    // If no best time set - fill the object with the "no time" text. The rest of the fields will just remain empty.
    if (myResult.bestTime.length === 0){ myResult.bestTime = "--:--:--";}
    console.log(myResult);
    if (myResult.myTime === null || myResult.myTime === undefined) {
      //Tstats page (world records)
      stageRow.bestDriver.append(myResult.bestDriver);
      stageRow.car.removeAttr("align");
      stageRow.car.append(myResult.bestCar);
    } else {
      // User records page.
      stageRow.myTime.append(myResult.myTime);
      stageRow.myPlace.append(myResult.place);
      stageRow.car.append(myResult.car);
    }
    stageRow.bestTime.append(myResult.bestTime); // Appending the insides of the 4th column to the cell.
    //Increment the count of coompleted requests (for visuals).
    progressBar.increment();
  }
});
}

// Changes the default "Records" and "Ranks" links to include class set as favourite. Used also to redraw the link after setting a new favourite class.
function replaceDefaultRecordLinks(){
    var leftMenuTable = $('table[style="width: 170px; vertical-align: top;"]'); // Finding the side menus-table with the links.
    var recordsLink = $('a:contains("Records")'); // Finding the "Records" links.
    // favClass = 102;
    if (recordsLink.length === 0) {recordsLink = $('a:contains("Rekordy")');} // If not found, looking for the Czech link names.
    if (recordsLink.length === 0) {return false;} // Breaking out of the function if no links found anyway.
    for (var i=0; i<recordsLink.length; i++){ // Iterating through the array of links.
      if (recordsLink[i].href.indexOf("http://rbr.onlineracing.cz/index.php?act=urec") > -1){ // Check fo left-menu link.
        if (favClass !== undefined && favClass !== 0){ // Check if favClass set.
          recordsLink[i].href = "http://rbr.onlineracing.cz/index.php?act=urec&classid=" + favClass; // Appending the favClass to the link.
        } else {recordsLink[i].href = "http://rbr.onlineracing.cz/index.php?act=urec";} // If no favClass = inserting the vanilla link.
      } else {
        if (recordsLink[i].href.indexOf("http://rbr.onlineracing.cz/index.php?act=tstats&type=1") > -1){ // Checking for the right-menu link if not left-menu.
        if (favClass !== undefined && favClass !== 0){ // favClass check.
          recordsLink[i].href = "http://rbr.onlineracing.cz/index.php?act=tstats&type=1&classid=" + favClass; // Changing to the favClass link.
        } else {recordsLink[i].href = "http://rbr.onlineracing.cz/index.php?act=tstats&type=1";} // No favClass - vanilla link.
      }
      }
    }
    // console.log(recordsLink);
}

// Function adding the newer classes to the selector. Uses JQUERY!
function appendClasses(){
    //Finding the selector with id classid
    var classBox = $("#classid");
    // Clearing the default options
	$("option", classBox).remove();
    // Populating the box with the new layout.
    classBox.append($('<option>', {value: 0,text: "Select class", disabled: true}));
    classBox.append($('<option>', {value: 0,text: "-- NGP --", disabled: true}));
    classBox.append($('<option>', {value: classesDict["RC1"],text: "RC1"}));
    classBox.append($('<option>', {value: classesDict["RC2"],text: "RC2"}));
    classBox.append($('<option>', {value: classesDict["RGT"],text: "RGT"}));
    classBox.append($('<option>', {value: classesDict["RC3"],text: "RC3"}));
    classBox.append($('<option>', {value: classesDict["RC4"],text: "RC4"}));
    classBox.append($('<option>', {value: classesDict["RC5"],text: "RC5"}));
    classBox.append($('<option>', {value: classesDict["WRC"],text: "WRC"}));
    classBox.append($('<option>', {value: classesDict["H/B"],text: "H/B"}));
    classBox.append($('<option>', {value: classesDict["H/A"],text: "H/A"}));
    classBox.append($('<option>', {value: classesDict["H/4"],text: "H/4"}));
    classBox.append($('<option>', {value: classesDict["H/2"],text: "H/2"}));
    classBox.append($('<option>', {value: 0,text: "-- Legacy --", disabled: true}));
    classBox.append($('<option>', {value: classesDict["WRC legacy"],text: "WRC legacy"}));
    classBox.append($('<option>', {value: classesDict["N4"],text: "N4"}));
    classBox.append($('<option>', {value: classesDict["S2000"],text: "S2000"}));
    classBox.append($('<option>', {value: classesDict["S1600"],text: "S1600"}));
    classBox.append($('<option>', {value: classesDict["A8"],text: "A8"}));
    classBox.append($('<option>', {value: classesDict["A7"],text: "A7"}));
    classBox.append($('<option>', {value: classesDict["A6"],text: "A6"}));
    classBox.append($('<option>', {value: classesDict["A5"],text: "A5"}));
    classBox.append($('<option>', {value: classesDict["A7"],text: "A7"}));
    classBox.append($('<option>', {value: classesDict["N3"],text: "N3"}));
    classBox.append($('<option>', {value: classesDict["H"],text: "H"}));
    classBox.append($('<option>', {value: classesDict["GT"],text: "GT"}));

    // Checking what class should be set as currently selected in the selectbox.
	var currClass = parseurl("classid");
    // If current url without a specified class - revert to the default, WRC legacy.
    // Not very efficient, as it does not break after finding a correct match (iterates through the entire list every time.
    if (currClass === "") { classBox.val(classesDict["WRC legacy"]); }
    else {
        for(var classKey in classesDict){
            if (classesDict[classKey] == currClass) {
                classBox.val(classesDict[classKey]);
            }
        }
    }
}

// Function sorting the stages according to the country code
function sortStagesByCountry(){
    console.log("Starting sorting...");
    var currentSelection = 0;
    for (var i = 0; i < countriesSortOrder.length; i++) {
        console.log("Moving " + countriesSortOrder[i][1] + "...");
        currentSelection = $("."+countriesSortOrder[i][0], resultsTable);
        currentSelection.sort(function (a, b) {

            var A = $(a).find('td').eq(0).text().toUpperCase();
            /*console.log($(a).find('td').eq(0).text().toUpperCase());*/
            var B = $(b).find('td').eq(0).text().toUpperCase();

            if(A < B) {return -1;}
            if(A > B) {return 1;}
            return 0;
        });
        resultsTable.append(currentSelection);
    }
    console.log("Sorting finished!");
}

// Inserting the colorfull "subtitles" with country names and flags in front of the stages.
// Using the rbr-czech flags to minimize overhead where possible :)
function addSubtitles(){
    console.log("Adding subtitles...");
    var newSub = 0;
    for (var i = 0; i < countriesSortOrder.length; i++) {
        console.log("Subbing " + countriesSortOrder[i][1] + "...");
        newSub = createSub(countriesSortOrder[i][1], countriesSortOrder[i][0],  countriesSortOrder[i][2]);
        $(newSub).insertBefore($("."+countriesSortOrder[i][0]+":first", resultsTable));
    }
    console.log("Subtitles added!");
}

// Applying correct classes to all the rows (row2/row3) to "paint" them the correct colour after sorting.
function reClassifyRows(){
    console.log("Repainting the rows...");
    $.each($(".row2, .row3", resultsTable), function (key, value) {
        $(this).removeClass("row2");
        $(this).removeClass("row3");
        $(this).addClass("row"+ (2+key%2));
    });
    console.log("Repainting finished!");
}

// Checking and hiding the rows according to the saved data. Done at the begining of the pageload + on demand (via a button).
function reHideStageRows(){
    console.log("Hiding the hidden rows...");
    var stagesRowsOnly = $(".row2, .row3", resultsTable); // Selecting only the inside rows with stages.
    var currentCountry = 0;
    var currentCountryName = 0;
     $.each(stagesRowsOnly, function (key, value) { // First un-hiding all the rows (resetting the field).
        $(this).removeClass("hidden");
     });
    for (var i = 0; i < countriesSortOrder.length; i++) { // Iterating through all the countries to check if they should be hidden or not.
        currentCountry = countriesSortOrder[i][0];
        currentCountryName = countriesSortOrder[i][1];
        // console.log("Current country: " + currentCountry + ". Hidden: "+ countriesHidden[currentCountry]);
        if(countriesHidden[currentCountry] === "true") { // If the country is marked as hidden - we hide it.
            $.each(stagesRowsOnly.filter("." + currentCountry), function (key, value){ // Filter the stage rows by current country
                $(this).addClass("hidden"); // Hide all rows with country class.
            });
        }
    }
    console.log("Hiding finished!");
}

// Creating a drop-down menu with full list of stages available.
function createStageDropdown(){
	var newSelect = document.createElement("select");
	newSelect.setAttribute("id", "stageid");
	newSelect.setAttribute("name", "stageid");
	newSelect.setAttribute("style", "width: 200px;");
	newSelect.setAttribute("onChange", "document.getElementById('records').submit()");
    var newSelectJQ = $(newSelect); // Just to easily use jQuery
    newSelectJQ.append($('<option>', {value: 0, text: "Choose another stage", disabled: true}));
    var currentCountry = 0;
    var currentCountryName = 0;
    var currentSelection = 0;
    for (var i = 0; i < countriesSortOrder.length; i++) {
        currentCountry = countriesSortOrder[i][0];
        currentCountryName = countriesSortOrder[i][1];
        console.log("Selector country: " + currentCountryName);
        currentSelection = $.grep(stagesDict, function( n ) {
            return ( n[stageCountry] ==  currentCountry);
        });
        if(currentSelection.length !== 0){
            newSelectJQ.append($('<option>', {value: 0, text: currentCountryName, disabled: true}));
            console.log("Found " + currentSelection.length + " stages [" + currentCountry + "]. Sorting and adding!");
        } else {
            console.log("No entries found for [" + currentCountry + "], skipping!");
        }
        currentSelection.sort(function (a, b) {
            var A = a[stageName].toUpperCase();
            var B = b[stageName].toUpperCase();
            if(A < B) {return -1;}
            if(A > B) {return 1;}
            return 0;
        });
        $.each($(currentSelection), function (key, value) {
            newSelectJQ.append($('<option>', {value: value[stageID],text: value[stageName]}));
        });
    }
    var currStage = parseurl("stageid");
    console.log("Current stage ID: " + currStage);
    // If current url without a specified track - revert to the default, "Select stage".
    // Not very efficient, as it does not break after finding a correct match (iterates through the entire list every time.
    if (currStage === "") { newSelectJQ.val(0); }
    else {
        for(var stageKey in stagesDict){
            if (stagesDict[stageKey][stageID] == currStage) {
                console.log(stagesDict[stageKey]);
                newSelectJQ.val(stagesDict[stageKey][stageID]);
            }
        }
    }
	//newSelect.selectedIndex = 0;
    console.log("Selector completed, returning!");
    var stateSelector = $("#state");
    console.log(stateSelector);
    console.log(newSelectJQ);
    $("input[name=stageid]", "#records").remove();
    $(newSelectJQ).insertBefore(stateSelector);
	//return newSelect;
}

// Injecting styling into the document's head (for new classes and to override some older ones).
function addStyling(){
    var css = document.createElement('style');
    css.type = 'text/css';

    // var styles = 'tr.FI>td:first-of-type { background-color: yellow }';
    // styles += ' tr.CZ>td:first-of-type { text-align: right; }';

    var styles = "tr.hidden { display: none }" +
        " #btnTopHolder {display: block; width: 300px; /*background-color: white;*/ min-height: 10px; overflow: hidden; margin-top: -10px;}" +
        " .btnTop { padding: 10px 5px; display:block; border: 2px solid #840000; color: white; float: left; width: calc(50% - 18px); margin: 0 2px; border-radius: 4px; cursor:pointer;}" +
        " .btnFAV { display: flex; width: 20px; height: 17px; padding: 0px 1px 2px 0px; align-items: center; justify-content: center; border: 2px solid #840000; box-sizing: border-box; -moz-box-sizing: border-box; -webkit-box-sizing: border-box;color: white; border-radius: 4px; cursor:pointer;}" +
        " #btnSetFavClass { position: relative; left: 70px; top: -17px; }" +
        " .btnFAV.selected { border-color: #840000 !important; background-color: #840000; color: gold;}" +
        " .btnTop:active, .btnFAV:active, tr.header:active { transition: all 100ms ease; transform: scale(.95); opacity: .75;}" +
        " .btnTop:hover, .btnFAV:hover { transition: all 60ms ease; opacity: .85; background-color:#840000;}" +
        " .btnFAV.selected:hover {background-color: #840000; border-color: white !important; color: white;}" +
        " tr.header>th { cursor:pointer; background-color: #840000; background-image: none !important; color: white; font-weight: normal;}" +
        " tr.header:hover { transition: all 120ms ease; opacity: .85;}" +
        " .row2:hover, .row3:hover { background-color: #404040; transition: all 120ms ease; opacity: .85;}" +
        " .meter { color: black; text-align: center; height: 15px; position: relative;background: #555; -moz-border-radius: 6px; -webkit-border-radius: 6px; border-radius: 6px; padding: 3px; margin: 0px 5px}" +
        " .meter > span { background-color: #f2b63c; border: 1px solid #f0ad24 #eba310 #c5880d; display: block; text-align: right; font-size: 11px; line-height: 15px; height: 100%; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-top-left-radius: 4px; border-bottom-left-radius: 4px; position: relative; overflow: hidden;}" +
        " span.meterdone { background-color: #85c440; border: 1px solid #78b337 #6ba031 #568128;}"
        "";


    if (css.styleSheet) css.styleSheet.cssText = styles;
    else css.appendChild(document.createTextNode(styles));

    document.getElementsByTagName("head")[0].appendChild(css); // Apppending the style to the head.
}

function addHiderButtons(){
    $("<div id=\"btnTopHolder\"/>").insertBefore(resultsTable);
    $("<br/>").insertBefore(resultsTable);
    // Creating a div that will serve as a button.
    var btnHideAll = document.createElement("div");
    btnHideAll.setAttribute("id", "btnHideAllStages"); // Unique ID for the button.
    btnHideAll.setAttribute("class", "btnTop"); // Styleable class.
    btnHideAll.setAttribute("title", "Click to collapse all countries"); // Hover text.
    btnHideAll.innerHTML = "Collapse all"; // Button text.
    var currentCountry = 0;
    // var currentCountryName = 0; // Temp vars to iterate easier.
    $(btnHideAll).click(function(){
        console.log("Collapsing all countries!");
        for (var i = 0; i < countriesSortOrder.length; i++) { // Iterating through every possible country.
            currentCountry = countriesSortOrder[i][0];
            // currentCountryName = countriesSortOrder[i][1]; // Not used ATM
            countriesHidden[currentCountry]="true"; // Changing the object parameter for each country.
        }
        GM_setValue("countriesHiddenSaved", JSON.stringify(countriesHidden)); // Saving the current state to JSON string.
        reHideStageRows(); // Basically adding the "hidden" class to all the rows.
    });
    var btnShowAll = document.createElement("div");
    btnShowAll.setAttribute("id", "btnHideAllStages"); // Unique ID for the button.
    btnShowAll.setAttribute("class", "btnTop"); // Styleable class.
    btnShowAll.setAttribute("title", "Click to expand all countries"); // Hover text.
    btnShowAll.innerHTML = "Expand all"; // Button text.
    $(btnShowAll).click(function(){ // Quick function cleaning the hide/expand data.
        console.log("Expanding all countries!");
        countriesHidden ={}; // Empty the object.
        // console.log(countriesHidden);
        GM_setValue("countriesHiddenSaved", "{}"); // Empty the saved value (replace with empty JSON string).
        reHideStageRows(); // Remove "hidden" class from all the rows.
    });
    // Inserting the buttons in front of the table, inside the holder-container..
    $("#btnTopHolder").prepend(btnHideAll);
    $("#btnTopHolder").prepend(btnShowAll);
}

// Simple function adding "set as favourite" buttons
function addFavouriteButtons(){
    var selectedClass = $("#classid").val(); // Checking the value of the selected car class.
    var btnSetFavClass = document.createElement("div");
    btnSetFavClass.setAttribute("id", "btnSetFavClass"); // Unique ID for the button.
    btnSetFavClass.setAttribute("class", "btnFAV"); // Styleable class.
    if (selectedClass == favClass) {
        $(btnSetFavClass).addClass("selected"); // If the currently selected class is set as favourite - paint the button accordingly.
        btnSetFavClass.setAttribute("title", "Click to remove favourite class"); // Hover text, favourite class.
        btnSetFavClass.innerHTML = "★"; // Button text for the selected favourite.
    } else {
        btnSetFavClass.setAttribute("title", "Click to set favourite class");// Hover text, non-favourite.
        btnSetFavClass.innerHTML = "⭐";// Button text
    }
    $(btnSetFavClass).click(function(){ // Quick function cleaning the hide/expand data.
        if (favClass != selectedClass) {
            console.log("Setting a favourite class! [" + selectedClass + "]");
            favClass = selectedClass;
            GM_setValue("favClass", favClass); // Save the favourite class value.
            $(btnSetFavClass).addClass("selected");
            btnSetFavClass.innerHTML = "★";
            btnSetFavClass.setAttribute("title", "Click to remove favourite class");
        } else {
            console.log("Removing favourite class! [" + favClass + "]");
            favClass = 0;
            GM_setValue("favClass", favClass);
            $(btnSetFavClass).removeClass("selected");
            btnSetFavClass.innerHTML = "⭐"; // Button text
            btnSetFavClass.setAttribute("title", "Click to set favourite class");
        }
        replaceDefaultRecordLinks(); // Replace the href of left- and right-side menu links.
    });
    $("#classid").after(btnSetFavClass);
    $(btnSetFavClass).next().remove();
    $(btnSetFavClass).next().remove();
}

// ************************************ END OF FUNCTIONS ************************************
// Processing the document itself
// TODO: cleanup this section and organize it better.
addStyling(); // Adding special styling
console.log("Favourite class is: " + favClass + " // " + typeof(favClass));
replaceDefaultRecordLinks();

// Checking for car class selector (drop-down). Appears on records and ranks sites.
// If exists: appending the additional car classes and add the "Favourite" button.
if (document.getElementById("classid")) {
    appendClasses();
    addFavouriteButtons();
}

// Checking the type of handled site we are on (act=).
var whereAmI = parseurl("act");

// If we are NOT on the tournament results page: proceed with finding the results table, preparing the linkbase etc.
if (whereAmI.indexOf("tourmntres") == -1 && (whereAmI === "urank" || whereAmI == "urec" || whereAmI == "stagerec" || whereAmI == "stagerank" || whereAmI == "tstats")) {
    var resultsTable = findResultsTableJQ();
    addHeadAndBody();
    convertStageCountries();
    var countriesHidden = JSON.parse(GM_getValue("countriesHiddenSaved", "{}"));
    console.log(typeof(countriesHidden));
    console.log(countriesHidden);
    var linkBase = makeLinkBase();
} else { addGTLink(); } // If on a page with records -> add the missing GT link

switch(whereAmI) {
	case "urank":
	case "tstats":
		if (parseurl("type") !="1"){
			//addMissingRanks();
		}
	case "urec":
         // Find the correct table - globally.
    classifyStages($("tr[class=row2], tr[class=row3]",resultsTable).not("[id^=trid]")); // Classify all the rows with country codes and track ids
    addMissingStages();
    classifyStages($("tr[class=row2], tr[class=row3]",resultsTable).not("[id^=trid]")); // Classify again, this time the added stages.
    sortStagesByCountry();
    addSubtitles();
		reClassifyRows();
    reHideStageRows();
    addHiderButtons();
		break;
	case "stagerec":
	case "stagerank":
        createStageDropdown();
		document.getElementById("state").parentNode.insertBefore(document.createElement("br"), document.getElementById("state"));
		document.getElementById("state").parentNode.insertBefore(document.createElement("br"), document.getElementById("state"));
		break;
	default:
		break;
}
