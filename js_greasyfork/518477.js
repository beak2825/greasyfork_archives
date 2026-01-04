// ==UserScript==
// @name         PGR2 Leaderboard tweaks for Insignia
// @namespace    https://insignia.live/
// @version      1.7.1
// @description  Fix the leaderboard names; format times correctly; format kudos scores; highlight yourself if logged in; separator for top 10; style tweaks
// @author       Aaron 'EmSixTeen' Gregg
// @match        https://insignia.live/games/4d53004b
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518477/PGR2%20Leaderboard%20tweaks%20for%20Insignia.user.js
// @updateURL https://update.greasyfork.org/scripts/518477/PGR2%20Leaderboard%20tweaks%20for%20Insignia.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const leaderboardNames = {
    "#001": "Xbox Live - Accumulated Kudos",
    "#002": "Xbox Live - Edinburgh - All Tracks Sum Of Best Kudos",
    "#003": "Xbox Live - Moscow - All Tracks Sum Of Best Kudos",
    "#004": "Xbox Live - Barcelona - All Tracks Sum Of Best Kudos",
    "#005": "Xbox Live - Washington DC - All Tracks Sum Of Best Kudos",
    "#006": "Xbox Live - Chicago - All Tracks Sum Of Best Kudos",
    "#007": "Xbox Live - Florence - All Tracks Sum Of Best Kudos",
    "#008": "Xbox Live - Nurburgring - Sum Of Best Kudos",
    "#009": "Xbox Live - Stockholm - All Tracks Sum Of Best Kudos",
    "#010": "Xbox Live - Hong Kong - All Tracks Sum Of Best Kudos",
    "#011": "Xbox Live - Yokohama - All Tracks Sum Of Best Kudos",
    "#012": "Xbox Live - Sydney - All Tracks Sum Of Best Kudos",
    "#013": "Xbox Live - Long Beach - All Tracks Sum Of Best Kudos",
    "#014": "Xbox Live - Paris - All Tracks Sum Of Best Kudos",
    "#015": "Geometry Wars High Score",
    "#016": "All Time Ghost Challenge - Stockholm Style",
    "#017": "All Time Ghost Challenge - Chicago Style",
    //"018": "??",
    //"019": "??",
    //"020": "??",
    //"021": "??",
    "#022": "Weekly Hot Lap Series",
    "#023": "Weekly Hot Lap Series",
    "#024": "Weekly Hot Lap Series",
    "#025": "Weekly Cone Challenge Series",
    "#026": "Weekly Cone Challenge Series",
    "#027": "Weekly Cone Challenge Series",
    "#028": "Weekly Cone Challenge Series",
    "#029": "Monthly Hot Lap",
    "#030": "Monthly Hot Lap",
    "#031": "Monthly Hot Lap",
    "#032": "Monthly Hot Lap",
    "#033": "Monthly Cone Challenge",
    "#034": "Monthly Cone Challenge",
    "#035": "Monthly Cone Challenge",
    "#036": "Monthly Cone Challenge",
    "#037": "All Time Ghost Challenge - Nurburgring Speed",
    "#038": "Kudos World Series - Compact Sport Series - Event 1 (Street Race)",
    "#039": "Kudos World Series - Compact Sport Series - Event 2 (One on One)",
    "#040":
      "Kudos World Series - Compact Sport Series - Event 3 (Cone Challenge)",
    "#041": "Kudos World Series - Compact Sport Series - Event 4 (One on One)",
    "#042": "Kudos World Series - Compact Sport Series - Event 5 (Street Race)",
    "#043":
      "Kudos World Series - Compact Sport Series - Event 6 (Speed Camera)",
    "#044": "Kudos World Series - Compact Sport Series - Event 7 (Street Race)",
    "#045":
      "Kudos World Series - Sports Convertible Series - Event 1 (Overtake)",
    "#046":
      "Kudos World Series - Sports Convertible Series - Event 2 (Street Race)",
    "#047":
      "Kudos World Series - Sports Convertible Series - Event 3 (Street Race)",
    "#048":
      "Kudos World Series - Sports Convertible Series - Event 4 (One on One)",
    "#049":
      "Kudos World Series - Sports Convertible Series - Event 5 (Cone Challenge)",
    "#050":
      "Kudos World Series - Sports Convertible Series - Event 6 (Speed Camera)",
    "#051":
      "Kudos World Series - Sports Convertible Series - Event 7 (Street Race)",
    "#052": "Kudos World Series - Coupe Series - Event 1 (Timed Run)",
    "#053": "Kudos World Series - Coupe Series - Event 2 (Street Race)",
    "#054": "Kudos World Series - Coupe Series - Event 3 (Speed Camera)",
    "#055": "Kudos World Series - Coupe Series - Event 4 (One on One)",
    "#056": "Kudos World Series - Coupe Series - Event 5 (Cone Challenge)",
    "#057": "Kudos World Series - Coupe Series - Event 6 (Overtake)",
    "#058": "Kudos World Series - Coupe Series - Event 7 (Hot Lap)",
    "#059": "Kudos World Series - Coupe Series - Event 8 (Street Race)",
    "#060": "Kudos World Series - Sport Utility Series - Event 1 (Hot Lap)",
    "#061":
      "Kudos World Series - Sport Utility Series - Event 2 (Speed Camera)",
    "#062": "Kudos World Series - Sport Utility Series - Event 3 (Street Race)",
    "#063": "Kudos World Series - Sport Utility Series - Event 4 (One on One)",
    "#064":
      "Kudos World Series - Sport Utility Series - Event 5 (Cone Challenge)",
    "#065": "Kudos World Series - Sport Utility Series - Event 6 (Overtake)",
    "#066": "Kudos World Series - Sport Utility Series - Event 7 (Street Race)",
    "#067": "Kudos World Series - Sport Utility Series - Event 8 (Street Race)",
    "#068":
      "Kudos World Series - Pacific Muscle Series - Event 1 (Street Race)",
    "#069":
      "Kudos World Series - Pacific Muscle Series - Event 2 (Street Race)",
    "#070":
      "Kudos World Series - Pacific Muscle Series - Event 3 (Street Race)",
    "#071":
      "Kudos World Series - Pacific Muscle Series - Event 4 (Cone Challenge)",
    "#072": "Kudos World Series - Pacific Muscle Series - Event 5 (Hot Lap)",
    "#073": "Kudos World Series - Pacific Muscle Series - Event 6 (One on One)",
    "#074":
      "Kudos World Series - Pacific Muscle Series - Event 7 (Street Race)",
    "#075":
      "Kudos World Series - Pacific Muscle Series - Event 8 (Street Race)",
    "#076":
      "Kudos World Series - Pacific Muscle Series - Event 9 (Speed Camera)",
    "#077":
      "Kudos World Series - Pacific Muscle Series - Event 10 (Street Race)",
    "#078": "Kudos World Series - Roadster Series - Event 1 (Timed Run)",
    "#079": "Kudos World Series - Roadster Series - Event 2 (Cone Challenge)",
    "#080": "Kudos World Series - Roadster Series - Event 3 (Street Race)",
    "#081": "Kudos World Series - Roadster Series - Event 4 (Timed Run)",
    "#082": "Kudos World Series - Roadster Series - Event 5 (Overtake)",
    "#083": "Kudos World Series - Roadster Series - Event 6 (Timed Run)",
    "#084": "Kudos World Series - Roadster Series - Event 7 (Cone Challenge)",
    "#085": "Kudos World Series - Roadster Series - Event 8 (One on One)",
    "#086": "Kudos World Series - Roadster Series - Event 9 (Street Race)",
    "#087": "Kudos World Series - Roadster Series - Event 10 (Speed Camera)",
    "#088": "Kudos World Series - Roadster Series - Event 11 (Street Race)",
    "#089": "Kudos World Series - Classics Series - Event 1 (Hot Lap)",
    "#090": "Kudos World Series - Classics Series - Event 2 (Timed Run)",
    "#091": "Kudos World Series - Classics Series - Event 3 (Street Race)",
    "#092": "Kudos World Series - Classics Series - Event 4 (One on One)",
    "#093": "Kudos World Series - Classics Series - Event 5 (Hot Lap)",
    "#094": "Kudos World Series - Classics Series - Event 6 (Cone Challenge)",
    "#095": "Kudos World Series - Classics Series - Event 7 (Overtake)",
    "#096": "Kudos World Series - Classics Series - Event 8 (One on One)",
    "#097": "Kudos World Series - Classics Series - Event 9 (Hot Lap)",
    "#098": "Kudos World Series - Classics Series - Event 10 (Speed Camera)",
    "#099": "Kudos World Series - Classics Series - Event 11 (Street Race)",
    "#100": "Kudos World Series - Sports Coupe Series - Event 1 (Timed Run)",
    "#101": "Kudos World Series - Sports Coupe Series - Event 2 (Overtake)",
    "#102": "Kudos World Series - Sports Coupe Series - Event 3 (Street Race)",
    "#103": "Kudos World Series - Sports Coupe Series - Event 4 (One on One)",
    "#104": "Kudos World Series - Sports Coupe Series - Event 5 (Overtake)",
    "#105": "Kudos World Series - Sports Coupe Series - Event 6 (Street Race)",
    "#106":
      "Kudos World Series - Sports Coupe Series - Event 7 (Cone Challenge)",
    "#107": "Kudos World Series - Sports Coupe Series - Event 8 (Speed Camera)",
    "#108": "Kudos World Series - Sports Coupe Series - Event 9 (One on One)",
    "#109": "Kudos World Series - Sports Coupe Series - Event 10 (Timed Run)",
    "#110": "Kudos World Series - Sports Coupe Series - Event 11 (Street Race)",
    "#111": "Kudos World Series - Sports Coupe Series - Event 12 (Street Race)",
    "#112": "Kudos World Series - Sports Coupe Series - Event 13 (Street Race)",
    "#113":
      "Kudos World Series - American Muscle Series - Event 1 (Street Race)",
    "#114":
      "Kudos World Series - American Muscle Series - Event 2 (Street Race)",
    "#115":
      "Kudos World Series - American Muscle Series - Event 3 (Cone Challenge)",
    "#116": "Kudos World Series - American Muscle Series - Event 4 (Hot Lap)",
    "#117":
      "Kudos World Series - American Muscle Series - Event 5 (One on One)",
    "#118":
      "Kudos World Series - American Muscle Series - Event 6 (Street Race)",
    "#119":
      "Kudos World Series - American Muscle Series - Event 7 (Cone Challenge)",
    "#120":
      "Kudos World Series - American Muscle Series - Event 8 (Street Race)",
    "#121": "Kudos World Series - American Muscle Series - Event 9 (Hot Lap)",
    "#122":
      "Kudos World Series - American Muscle Series - Event 10 (Timed Run)",
    "#123":
      "Kudos World Series - American Muscle Series - Event 11 (Street Race)",
    "#124":
      "Kudos World Series - American Muscle Series - Event 12 (Street Race)",
    "#125":
      "Kudos World Series - American Muscle Series - Event 13 (Speed Camera)",
    "#126":
      "Kudos World Series - American Muscle Series - Event 14 (Street Race)",
    "#127": "Kudos World Series - Super Car Series - Event 1 (Timed Run)",
    "#128": "Kudos World Series - Super Car Series - Event 2 (Overtake)",
    "#129": "Kudos World Series - Super Car Series - Event 3 (One on One)",
    "#130": "Kudos World Series - Super Car Series - Event 4 (Speed Camera)",
    "#131": "Kudos World Series - Super Car Series - Event 5 (Street Race)",
    "#132": "Kudos World Series - Super Car Series - Event 6 (Hot Lap)",
    "#133": "Kudos World Series - Super Car Series - Event 7 (Hot Lap)",
    "#134": "Kudos World Series - Super Car Series - Event 8 (Street Race)",
    "#135": "Kudos World Series - Super Car Series - Event 9 (One on One)",
    "#136": "Kudos World Series - Super Car Series - Event 10 (Hot Lap)",
    "#137": "Kudos World Series - Super Car Series - Event 11 (Overtake)",
    "#138": "Kudos World Series - Super Car Series - Event 12 (Street Race)",
    "#139": "Kudos World Series - Super Car Series - Event 13 (Street Race)",
    "#140": "Kudos World Series - Super Car Series - Event 14 (Street Race)",
    "#141": "Kudos World Series - Grand Touring Series - Event 1 (Timed Run)",
    "#142": "Kudos World Series - Grand Touring Series - Event 2 (Overtake)",
    "#143": "Kudos World Series - Grand Touring Series - Event 3 (Street Race)",
    "#144": "Kudos World Series - Grand Touring Series - Event 4 (One on One)",
    "#145":
      "Kudos World Series - Grand Touring Series - Event 5 (Cone Challenge)",
    "#146": "Kudos World Series - Grand Touring Series - Event 6 (Street Race)",
    "#147": "Kudos World Series - Grand Touring Series - Event 7 (Overtake)",
    "#148": "Kudos World Series - Grand Touring Series - Event 8 (Hot Lap)",
    "#149": "Kudos World Series - Grand Touring Series - Event 9 (Street Race)",
    "#150": "Kudos World Series - Grand Touring Series - Event 10 (One on One)",
    "#151": "Kudos World Series - Grand Touring Series - Event 11 (Overtake)",
    "#152": "Kudos World Series - Grand Touring Series - Event 12 (Hot Lap)",
    "#153": "Kudos World Series - Grand Touring Series - Event 13 (One on One)",
    "#154":
      "Kudos World Series - Grand Touring Series - Event 14 (Speed Camera)",
    "#155":
      "Kudos World Series - Grand Touring Series - Event 15 (Street Race)",
    "#156":
      "Kudos World Series - Grand Touring Series - Event 16 (Street Race)",
    "#157": "Kudos World Series - Track Specials Series - Event 1 (Hot Lap)",
    "#158":
      "Kudos World Series - Track Specials Series - Event 2 (Street Race)",
    "#159": "Kudos World Series - Track Specials Series - Event 3 (Hot Lap)",
    "#160": "Kudos World Series - Track Specials Series - Event 4 (Hot Lap)",
    "#161": "Kudos World Series - Track Specials Series - Event 5 (One on One)",
    "#162":
      "Kudos World Series - Track Specials Series - Event 6 (Street Race)",
    "#163": "Kudos World Series - Track Specials Series - Event 7 (Overtake)",
    "#164": "Kudos World Series - Track Specials Series - Event 8 (Timed Run)",
    "#165": "Kudos World Series - Track Specials Series - Event 9 (Hot Lap)",
    "#166":
      "Kudos World Series - Track Specials Series - Event 10 (One on One)",
    "#167": "Kudos World Series - Track Specials Series - Event 11 (Overtake)",
    "#168": "Kudos World Series - Track Specials Series - Event 12 (Timed Run)",
    "#169": "Kudos World Series - Track Specials Series - Event 13 (Hot Lap)",
    "#170":
      "Kudos World Series - Track Specials Series - Event 14 (Street Race)",
    "#171":
      "Kudos World Series - Track Specials Series - Event 15 (One on One)",
    "#172":
      "Kudos World Series - Track Specials Series - Event 16 (Speed Camera)",
    "#173":
      "Kudos World Series - Track Specials Series - Event 17 (Street Race)",
    "#174": "Kudos World Series - Extreme Series - Event 1 (Timed Run)",
    "#175": "Kudos World Series - Extreme Series - Event 2 (Overtake)",
    "#176": "Kudos World Series - Extreme Series - Event 3 (Street Race)",
    "#177": "Kudos World Series - Extreme Series - Event 4 (One on One)",
    "#178": "Kudos World Series - Extreme Series - Event 5 (One on One)",
    "#179": "Kudos World Series - Extreme Series - Event 6 (One on One)",
    "#180": "Kudos World Series - Extreme Series - Event 7 (Timed Run)",
    "#181": "Kudos World Series - Extreme Series - Event 8 (Cone Challenge)",
    "#182": "Kudos World Series - Extreme Series - Event 9 (Hot Lap)",
    "#183": "Kudos World Series - Extreme Series - Event 10 (Street Race)",
    "#184": "Kudos World Series - Extreme Series - Event 11 (Street Race)",
    "#185": "Kudos World Series - Extreme Series - Event 12 (Street Race)",
    "#186": "Kudos World Series - Extreme Series - Event 13 (Speed Camera)",
    "#187": "Kudos World Series - Extreme Series - Event 14 (One on One)",
    "#188": "Kudos World Series - Extreme Series - Event 15 (Street Race)",
    "#189": "Kudos World Series - Extreme Series - Event 16 (Street Race)",
    "#190": "Kudos World Series - Extreme Series - Event 17 (Street Race)",
    "#191": "Kudos World Series - Ultimate Series - Event 1 (Street Race)",
    "#192": "Kudos World Series - Ultimate Series - Event 2 (Street Race)",
    "#193": "Kudos World Series - Ultimate Series - Event 3 (Street Race)",
    "#194": "Kudos World Series - Ultimate Series - Event 4 (Street Race)",
    "#195": "Kudos World Series - Ultimate Series - Event 5 (Cone Challenge)",
    "#196": "Kudos World Series - Ultimate Series - Event 6 (Street Race)",
    "#197": "Kudos World Series - Ultimate Series - Event 7 (Cone Challenge)",
    "#198": "Kudos World Series - Ultimate Series - Event 8 (Street Race)",
    "#199": "Kudos World Series - Ultimate Series - Event 9 (Street Race)",
    "#200": "Kudos World Series - Ultimate Series - Event 10 (Street Race)",
    "#201": "Kudos World Series - Ultimate Series - Event 11 (Street Race)",
    "#202": "Kudos World Series - Ultimate Series - Event 12 (Cone Challenge)",
    "#203": "Kudos World Series - Ultimate Series - Event 13 (Street Race)",
    "#204": "Kudos World Series - Ultimate Series - Event 14 (Cone Challenge)",
    "#205": "Kudos World Series - Ultimate Series - Event 15 (Street Race)",
    "#206": "Kudos World Series - Ultimate Series - Event 16 (Speed Camera)",
    "#207": "Kudos World Series - Ultimate Series - Event 17 (Street Race)",
    "#208": "Kudos World Series - Ultimate Series - Event 18 (Street Race)",
    "#209": "Kudos World Series - Ultimate Series - Event 19 (Street Race)",
    "#210": "Arcade Racing - Street Race 1",
    "#211": "Arcade Racing - Street Race 2",
    "#212": "Arcade Racing - Street Race 3",
    "#213": "Arcade Racing - Street Race 4",
    "#214": "Arcade Racing - Street Race 5",
    "#215": "Arcade Racing - Street Race 6",
    "#216": "Arcade Racing - Street Race 7",
    "#217": "Arcade Racing - Street Race 8",
    "#218": "Arcade Racing - Street Race 9",
    "#219": "Arcade Racing - Street Race 10",
    "#220": "Arcade Racing - Street Race 11",
    "#221": "Arcade Racing - Street Race 12",
    "#222": "Arcade Racing - Street Race 13",
    "#223": "Arcade Racing - Street Race 14",
    "#224": "Arcade Racing - Street Race 15",
    "#225": "Arcade Racing - Street Race 16",
    "#226": "Arcade Racing - Street Race 17",
    "#227": "Arcade Racing - Street Race 18",
    "#228": "Arcade Racing - Street Race 19",
    "#229": "Arcade Racing - Street Race 20",
    "#230": "Arcade Racing - Timed Run 1",
    "#231": "Arcade Racing - Timed Run 2",
    "#232": "Arcade Racing - Timed Run 3",
    "#233": "Arcade Racing - Timed Run 4",
    "#234": "Arcade Racing - Timed Run 5",
    "#235": "Arcade Racing - Timed Run 6",
    "#236": "Arcade Racing - Timed Run 7",
    "#237": "Arcade Racing - Timed Run 8",
    "#238": "Arcade Racing - Timed Run 9",
    "#239": "Arcade Racing - Timed Run 10",
    "#240": "Arcade Racing - Timed Run 11",
    "#241": "Arcade Racing - Timed Run 12",
    "#242": "Arcade Racing - Timed Run 13",
    "#243": "Arcade Racing - Timed Run 14",
    "#244": "Arcade Racing - Timed Run 15",
    "#245": "Arcade Racing - Timed Run 16",
    "#246": "Arcade Racing - Timed Run 17",
    "#247": "Arcade Racing - Timed Run 18",
    "#248": "Arcade Racing - Timed Run 19",
    "#249": "Arcade Racing - Timed Run 20",
    "#250": "Arcade Racing - Cone Challenge 1",
    "#251": "Arcade Racing - Cone Challenge 2",
    "#252": "Arcade Racing - Cone Challenge 3",
    "#253": "Arcade Racing - Cone Challenge 4",
    "#254": "Arcade Racing - Cone Challenge 5",
    "#255": "Arcade Racing - Cone Challenge 6",
    "#256": "Arcade Racing - Cone Challenge 7",
    "#257": "Arcade Racing - Cone Challenge 8",
    "#258": "Arcade Racing - Cone Challenge 9",
    "#259": "Arcade Racing - Cone Challenge 10",
    "#260": "Arcade Racing - Cone Challenge 11",
    "#261": "Arcade Racing - Cone Challenge 12",
    "#262": "Arcade Racing - Cone Challenge 13",
    "#263": "Arcade Racing - Cone Challenge 14",
    "#264": "Arcade Racing - Cone Challenge 15",
    "#265": "Arcade Racing - Cone Challenge 16",
    "#266": "Arcade Racing - Cone Challenge 17",
    "#267": "Arcade Racing - Cone Challenge 18",
    "#268": "Arcade Racing - Cone Challenge 19",
    "#269": "Arcade Racing - Cone Challenge 20",
    //"270": "??",
    "#271":
      "Time Attack - Circuit Challenge - Washington D.C. - Capitol Thrill",
    "#272": "Time Attack - Circuit Challenge - Washington D.C. - Up and Over",
    "#273":
      "Time Attack - Circuit Challenge - Washington D.C. - Capitol Thrill 2",
    "#274":
      "Time Attack - Circuit Challenge - Washington D.C. - Square Dancin'",
    "#275": "Time Attack - Circuit Challenge - Washington D.C. - Ring Race",
    "#276": "Time Attack - Circuit Challenge - Washington D.C. - The Tour",
    "#277":
      "Time Attack - Circuit Challenge - Washington D.C. - Northside Slide",
    "#278": "Time Attack - Circuit Challenge - Chicago - Chicago River Tour",
    "#279": "Time Attack - Circuit Challenge - Chicago - The Miracle Mile",
    "#280":
      "Time Attack - Circuit Challenge - Chicago - North Wasbash Overpass",
    "#281": "Time Attack - Circuit Challenge - Chicago - River Crossing",
    "#282": "Time Attack - Circuit Challenge - Chicago - In The Loop",
    "#283": "Time Attack - Circuit Challenge - Chicago - Lower Wacker Run",
    "#284": "Time Attack - Circuit Challenge - Chicago - East Kinzie Crossover",
    "#285": "Time Attack - Circuit Challenge - Chicago - Wells & Lake",
    "#286": "Time Attack - Circuit Challenge - Chicago - East On Wacker",
    "#287": "Time Attack - Circuit Challenge - Chicago - West On Wacker",
    "#288": "Time Attack - Circuit Challenge - Edinburgh - Princes Street East",
    "#289": "Time Attack - Circuit Challenge - Edinburgh - Grassmarket East",
    "#290": "Time Attack - Circuit Challenge - Edinburgh - Grassmarket West",
    "#291": "Time Attack - Circuit Challenge - Edinburgh - Lothian Road Eight",
    "#292":
      "Time Attack - Circuit Challenge - Edinburgh - Lothian Road Eight Long",
    "#293": "Time Attack - Circuit Challenge - Edinburgh - Princes Street Loop",
    "#294": "Time Attack - Circuit Challenge - Edinburgh - Grassmarket Eight",
    "#295": "Time Attack - Circuit Challenge - Edinburgh - Princes Street Long",
    "#296": "Time Attack - Circuit Challenge - Edinburgh - Castle Eight",
    "#297": "Time Attack - Circuit Challenge - Edinburgh - Terrace Sprint",
    "#298":
      "Time Attack - Circuit Challenge - Florence - Piazza della Signoria 1",
    "#299": "Time Attack - Circuit Challenge - Florence - Ponte Vecchio",
    "#300":
      "Time Attack - Circuit Challenge - Florence - Piazza della Signoria 2",
    "#301": "Time Attack - Circuit Challenge - Florence - Duomo 1",
    "#302":
      "Time Attack - Circuit Challenge - Florence - Piazza della Repubblica",
    "#303": "Time Attack - Circuit Challenge - Florence - Arno",
    "#304": "Time Attack - Circuit Challenge - Florence - Arno 2",
    "#305": "Time Attack - Circuit Challenge - Florence - Uffizi",
    "#306": "Time Attack - Circuit Challenge - Florence - Battistero 1",
    "#307": "Time Attack - Circuit Challenge - Florence - Battistero 2",
    "#308": "Time Attack - Circuit Challenge - Florence - Duomo 2",
    "#309": "Time Attack - Circuit Challenge - Nurburgring - Nordschleife 1",
    "#310": "Time Attack - Circuit Challenge - Stockholm - Speed Freak",
    "#311": "Time Attack - Circuit Challenge - Stockholm - Island Hop",
    "#312": "Time Attack - Circuit Challenge - Stockholm - Gamla Stan Loop",
    "#313": "Time Attack - Circuit Challenge - Stockholm - Northern",
    "#314": "Time Attack - Circuit Challenge - Stockholm - Bridges",
    "#315":
      "Time Attack - Circuit Challenge - Stockholm - Gamla Island Hopping",
    "#316":
      "Time Attack - Circuit Challenge - Stockholm - Round the Riksdagshuset",
    "#317": "Time Attack - Circuit Challenge - Stockholm - Northern 2",
    "#318": "Time Attack - Circuit Challenge - Stockholm - Gamla Oval",
    "#319": "Time Attack - Circuit Challenge - Stockholm - Northern 3",
    "#320": "Time Attack - Circuit Challenge - Barcelona - Place de Jaume",
    "#321": "Time Attack - Circuit Challenge - Barcelona - Passeig de Colom",
    "#322": "Time Attack - Circuit Challenge - Barcelona - Barri Gotic",
    "#323": "Time Attack - Circuit Challenge - Barcelona - Catedral",
    "#324": "Time Attack - Circuit Challenge - Barcelona - Las Ramblas",
    "#325": "Time Attack - Circuit Challenge - Barcelona - Catalan Challenge",
    "#326": "Time Attack - Circuit Challenge - Moscow - KGB Corner",
    "#327": "Time Attack - Circuit Challenge - Moscow - St Basil's Circle",
    "#328": "Time Attack - Circuit Challenge - Moscow - Kremlin 1",
    "#329": "Time Attack - Circuit Challenge - Moscow - Lenin",
    "#330": "Time Attack - Circuit Challenge - Moscow - Kremlin 2",
    "#331": "Time Attack - Circuit Challenge - Moscow - Red Square 1",
    "#332": "Time Attack - Circuit Challenge - Moscow - Red Square 2",
    "#333": "Time Attack - Circuit Challenge - Hong Kong - Admiralty",
    "#334": "Time Attack - Circuit Challenge - Hong Kong - The Waterfront",
    "#335": "Time Attack - Circuit Challenge - Hong Kong - Wan Chai Run",
    "#336": "Time Attack - Circuit Challenge - Hong Kong - Cotton Tree Drive",
    "#337": "Time Attack - Circuit Challenge - Hong Kong - Harbour Run",
    "#338":
      "Time Attack - Circuit Challenge - Hong Kong - The Convention Centres",
    "#339": "Time Attack - Circuit Challenge - Hong Kong - Hennessey Road",
    "#340": "Time Attack - Circuit Challenge - Hong Kong - Harcourt Challenge",
    "#341": "Time Attack - Circuit Challenge - Yokohama - Yokohama Bay Tour",
    "#342": "Time Attack - Circuit Challenge - Yokohama - Yokohama Challenge",
    "#343": "Time Attack - Circuit Challenge - Yokohama - Kishamichi",
    "#344": "Time Attack - Circuit Challenge - Yokohama - Downtown",
    "#345": "Time Attack - Circuit Challenge - Yokohama - Warehouse Loop",
    "#346": "Time Attack - Circuit Challenge - Yokohama - Seaside Loop",
    "#347": "Time Attack - Circuit Challenge - Yokohama - Honcho dori",
    "#348": "Time Attack - Circuit Challenge - Yokohama - Sakuragicho",
    "#349": "Time Attack - Circuit Challenge - Yokohama - Minato Mirai",
    "#350": "Time Attack - Circuit Challenge - Yokohama - Shinko Park",
    "#351": "Time Attack - Circuit Challenge - Sydney - Argyle Street",
    "#352": "Time Attack - Circuit Challenge - Sydney - Opera House View",
    "#353": "Time Attack - Circuit Challenge - Sydney - Harbour Bridge",
    "#354": "Time Attack - Circuit Challenge - Sydney - Dawes Point Loop",
    "#355": "Time Attack - Circuit Challenge - Sydney - The Wharf",
    "#356": "Time Attack - Circuit Challenge - Sydney - Cumberland Street",
    "#357": "Time Attack - Circuit Challenge - Sydney - Hickson Run",
    "#358": "Time Attack - Circuit Challenge - Sydney - Sydney Harbour",
    "#359": "Time Attack - Circuit Challenge - Sydney - The Rocks Route",
    "#360": "Time Attack - Circuit Challenge - Sydney - George St Challenge",
    "#361": "Time Attack - Circuit Challenge - Sydney - Under the Bridge",
    "#362": "Time Attack - Circuit Challenge - Sydney - Downtown Short",
    "#363": "Time Attack - Car Challenge - Compact Sports - Mini Cooper S",
    "#364": "Time Attack - Car Challenge - Compact Sports - Seat Leon Cupra R",
    "#365": "Time Attack - Car Challenge - Compact Sports - Ford Focus RS",
    "#366":
      "Time Attack - Car Challenge - Compact Sports - Honda Civic Type-R (J)",
    "#367": "Time Attack - Car Challenge - Compact Sports - Renault Clio V6",
    "#368": "Time Attack - Car Challenge - Compact Sports - VW R32",
    "#369": "Time Attack - Car Challenge - Compact Sports - VW New Beetle RSI",
    "#370":
      "Time Attack - Car Challenge - Compact Sports - Lancia Delta Integrale Evo",
    "#371":
      "Time Attack - Car Challenge - Sports Convertible - Toyota MR2 Spyder",
    "#372":
      "Time Attack - Car Challenge - Sports Convertible - Mazda Miata MX-5",
    "#373":
      "Time Attack - Car Challenge - Sports Convertible - Porsche Boxster S",
    "#374": "Time Attack - Car Challenge - Sports Convertible - Honda S2000",
    "#375": "Time Attack - Car Challenge - Sports Convertible - BMW Z4 3.0i",
    "#376":
      "Time Attack - Car Challenge - Sports Convertible - Audi TT Roadster",
    "#377": "Time Attack - Car Challenge - Coupe - Audi TT Coupe",
    "#378": "Time Attack - Car Challenge - Coupe - Honda Integra Type-R (J)",
    "#379": "Time Attack - Car Challenge - Coupe - Mazda RX-8",
    "#380": "Time Attack - Car Challenge - Coupe - Nissan 350Z",
    "#381": "Time Attack - Car Challenge - Coupe - Audi S4",
    "#382": "Time Attack - Car Challenge - Coupe - BMW M3",
    "#383": "Time Attack - Car Challenge - Coupe - Audi TT 3.2 Quattro",
    "#384": "Time Attack - Car Challenge - Sport Utility - Volvo XC90",
    "#385": "Time Attack - Car Challenge - Sport Utility - Mercedes ML55 AMG",
    "#386":
      "Time Attack - Car Challenge - Sport Utility - Porsche Cayenne Turbo",
    "#387": "Time Attack - Car Challenge - Sport Utility - Chevrolet SSR",
    "#388": "Time Attack - Car Challenge - Sport Utility - BMW X5 4.6is",
    "#389": "Time Attack - Car Challenge - Sport Utility - Ford SVT Lightning",
    "#390": "Time Attack - Car Challenge - Sports Coupe - Audi RS6",
    "#391":
      "Time Attack - Car Challenge - Grand Touring - Bentley Continental GT",
    "#392": "Time Attack - Car Challenge - Pacific Muscle - Mazda RX-7",
    "#393":
      "Time Attack - Car Challenge - Pacific Muscle - Toyota Supra Twin-Turbo",
    "#394":
      "Time Attack - Car Challenge - Pacific Muscle - Mitsubishi 3000 GT VR4",
    "#395":
      "Time Attack - Car Challenge - Pacific Muscle - Mitsubishi Lancer Evolution VII",
    "#396":
      "Time Attack - Car Challenge - Pacific Muscle - Subaru Impreza WRX STi",
    "#397":
      "Time Attack - Car Challenge - Pacific Muscle - Nissan Skyline GT-R (R34) Nur",
    "#398": "Time Attack - Car Challenge - Roadster - Vauxhall VX220",
    "#399": "Time Attack - Car Challenge - Roadster - Lotus Elise",
    "#400": "Time Attack - Car Challenge - Sports Coupe - TVR Tamora",
    "#401": "Time Attack - Car Challenge - Roadster - Lotus 340R",
    "#402": "Time Attack - Car Challenge - Roadster - Caterham 7 Classic",
    "#403": "Time Attack - Car Challenge - Roadster - Renault Spider",
    "#404": "Time Attack - Car Challenge - Classics - Porsche 550 Spyder",
    "#405": "Time Attack - Car Challenge - Classics - Jaguar E-Type",
    "#406": "Time Attack - Car Challenge - Classics - Nissan 240Z",
    "#407": "Time Attack - Car Challenge - Classics - Mercedes 300SL Gullwing",
    "#408": "Time Attack - Car Challenge - Classics - Porsche 911 RS 2.7",
    "#409": "Time Attack - Car Challenge - Classics - Ferrari 275 GTB",
    "#410": "Time Attack - Car Challenge - Roadster - AC 427 MKIII",
    "#411": "Time Attack - Car Challenge - Classics - Ferrari Dino 246 GT",
    "#412": "Time Attack - Car Challenge - Classics - Lancia Stratos",
    "#413": "Time Attack - Car Challenge - Classics - Toyota 2000GT",
    "#414": "Time Attack - Car Challenge - Sports Coupe - Lexus SC 430",
    "#415": "Time Attack - Car Challenge - Sports Coupe - Jaguar XKR",
    "#416": "Time Attack - Car Challenge - Sports Coupe - Cadillac XLR",
    "#417": "Time Attack - Car Challenge - Sports Coupe - Morgan Aero 8",
    "#418":
      "Time Attack - Car Challenge - Sports Coupe - Porsche 911 Carrera Coupe (996)",
    "#419": "Time Attack - Car Challenge - Sports Coupe - Iceni",
    "#420":
      "Time Attack - Car Challenge - American Muscle - Chevrolet Camaro SS",
    "#421":
      "Time Attack - Car Challenge - American Muscle - Corvette Sting Ray",
    "#422":
      "Time Attack - Car Challenge - American Muscle - Ford Mustang Fastback 2+2",
    "#423":
      "Time Attack - Car Challenge - American Muscle - Ford SVT Mustang Cobra",
    "#424": "Time Attack - Car Challenge - Super Car - Chevrolet Corvette Z06",
    "#425": "Time Attack - Car Challenge - American Muscle - Pontiac GTO",
    "#426":
      "Time Attack - Car Challenge - American Muscle - Chevrolet Camaro Z28",
    "#427": "Time Attack - Car Challenge - American Muscle - Pontiac Trans Am",
    "#428": "Time Attack - Car Challenge - Super Car - Dodge Viper GTS",
    "#429": "Time Attack - Car Challenge - Super Car - Ferrari 360 Modena",
    "#430": "Time Attack - Car Challenge - Super Car - Porsche 911 Turbo (996)",
    "#431": "Time Attack - Car Challenge - Track Specials - Dodge Viper SRT-10",
    "#432": "Time Attack - Car Challenge - Super Car - Ferrari 360 Spider",
    "#433": "Time Attack - Car Challenge - Super Car - TVR Tuscan Speed 6",
    "#434": "Time Attack - Car Challenge - Grand Touring - Lotus Esprit V8",
    "#435": "Time Attack - Car Challenge - Super Car - Ferrari 355 F1",
    "#436":
      "Time Attack - Car Challenge - Grand Touring - Ferrari 550 Barchetta",
    "#437": "Time Attack - Car Challenge - Grand Touring - Mercedes SL55 AMG",
    "#438":
      "Time Attack - Car Challenge - Grand Touring - Ferrari 575M Maranello",
    "#439":
      "Time Attack - Car Challenge - Grand Touring - Aston Martin Vanquish",
    "#440": "Time Attack - Car Challenge - Grand Touring - Ferrari Testarossa",
    "#441": "Time Attack - Car Challenge - Extreme - Ascari KZ1",
    "#442":
      "Time Attack - Car Challenge - Track Specials - Honda NSX Type-R (J)",
    "#443": "Time Attack - Car Challenge - Track Specials - Lotus Exige",
    "#444": "Time Attack - Car Challenge - Track Specials - Noble M12 GTO3",
    "#445":
      "Time Attack - Car Challenge - Track Specials - Porsche 911 GT3 (996)",
    "#446":
      "Time Attack - Car Challenge - Track Specials - Ferrari Challenge Stradale",
    "#447":
      "Time Attack - Car Challenge - Track Specials - Vauxhall VX220 Turbo",
    "#448": "Time Attack - Car Challenge - Extreme - Ferrari F50",
    "#449": "Time Attack - Car Challenge - Extreme - Porsche 911 GT2 (993)",
    "#450": "Time Attack - Car Challenge - Extreme - Ford GT40",
    "#451": "Time Attack - Car Challenge - Extreme - Ferrari F40",
    "#452": "Time Attack - Car Challenge - Extreme - Porsche 959",
    "#453": "Time Attack - Car Challenge - Extreme - Jaguar XJ220",
    "#454": "Time Attack - Car Challenge - Ultimate - Saleen S7",
    "#455": "Time Attack - Car Challenge - Ultimate - Porsche Carrera GT",
    "#456": "Time Attack - Car Challenge - Ultimate - Koenigsegg CC V8S",
    "#457": "Time Attack - Car Challenge - Ultimate - Enzo Ferrari",
    "#458": "Time Attack - Car Challenge - Ultimate - Pagani Zonda S",
    "#459": "Time Attack - Car Challenge - Ultimate - Ford GT",
    "#460": "Time Attack - Car Challenge - Super Car - Delfino Feroce",
    "#461": "Time Attack - Car Challenge - Classics - Ferrari 250 GTO",
    "#462": "Time Attack - Car Challenge - Ultimate - Mercedes CLK-GTR",
    "#463": "Time Attack - Car Challenge - Ultimate - Porsche 911 GT1",
    "#464": "Time Attack - Car Challenge - Ultimate - TVR Cebera Speed 12",
    //"465": "??",
    //"466": "??",
    //"467": "??",
    "#468": "All Time Ghost Challenge - Barcelona Speed",
    "#469": "All Time Ghost Challenge - Florence Speed",
    "#470": "All Time Ghost Challenge - Hong Kong Speed",
    //"471": "??",
    //"472": "??",
    "#473": "Weekly Hot Lap Series",
    "#474": "Time Attack - Car Challenge - Paris Booster Pack - BMW M3 CSL",
    "#475": "Time Attack - Car Challenge - Long Beach Booster Pack - VW Nardo",
    "#476":
      "Time Attack - Car Challenge - Paris Booster Pack - Chevrolet Corvette C6",
    "#477":
      "Time Attack - Car Challenge - Long Beach Booster Pack - Subaru Impreza 22B STi",
    "#478": "Time Attack - Car Challenge - Paris Booster Pack - Ferrari 250TR",
    "#479":
      "Time Attack - Car Challenge - Paris Booster Pack - Porsche 356A Carrera Speedster",
    "#480":
      "Time Attack - Car Challenge - Paris Booster Pack - Ferrari 365 GTS4",
    "#481": "Time Attack - Car Challenge - Paris Booster Pack - BMW 645Ci",
    "#482":
      "Time Attack - Car Challenge - Paris Booster Pack - Ferrari 288 GTO",
    "#483":
      "Time Attack - Car Challenge - Long Beach Booster Pack - Ariel Atom 2",
    "#484":
      "Time Attack - Car Challenge - Long Beach Booster Pack - Dodge Ram SRT-10",
    "#485":
      "Time Attack - Car Challenge - Long Beach Booster Pack - Dodge Challenger R/T Hemi",
    //"486": "??",
    "#487":
      "Time Attack - Car Challenge - Long Beach Booster Pack - Ferrari 612 Scaglietti",
    //"488": "??",
    "#489":
      "Time Attack - Car Challenge - Long Beach Booster Pack - Porsche 911 GT2 Clubsport",
    "#490":
      "Time Attack - Circuit Challenge - Long Beach - Long Beach Challenge",
    "#491": "Time Attack - Circuit Challenge - Long Beach - Rainbow Lagoon",
    "#492": "Time Attack - Circuit Challenge - Long Beach - Coastal Run",
    "#493": "Time Attack - Circuit Challenge - Long Beach - Dolphin Loop",
    "#494":
      "Time Attack - Circuit Challenge - Long Beach - LBC (Long Beach City)",
    "#495": "Time Attack - Circuit Challenge - Long Beach - Aquarium",
    "#496": "Time Attack - Circuit Challenge - Long Beach - CC Circular",
    "#497": "Time Attack - Circuit Challenge - Long Beach - Ocean Boulevard",
    //"498": "??",
    //"499": "??",
    //"500": "??",
    "#501":
      "Time Attack - Car Challenge - Long Beach Booster Pack - Radical SR3 Turbo",
    "#502": "Time Attack - Circuit Challenge - Paris - Le Circuit Complet",
    "#503": "Time Attack - Circuit Challenge - Paris - Les Deux Ponts",
    "#504": "Time Attack - Circuit Challenge - Paris - Elysees Challenge",
    "#505": "Time Attack - Circuit Challenge - Paris - Les Monuments Celebres",
    "#506": "Time Attack - Circuit Challenge - Paris - L'Arc de Triomphe",
    "#507": "Time Attack - Circuit Challenge - Paris - Avenue D'lena",
    "#508": "Time Attack - Circuit Challenge - Paris - Circuit Interieur",
    "#509":
      "Time Attack - Car Challenge - Paris Booster Pack - TVR Cerbera Speed 12",
  };

  // constants
  const MAX_INT = 2147483647;
  const VALID_RANGE_MIN = MAX_INT - 3600000; // assume max time difference is 1 hour
  const VALID_RANGE_MAX = MAX_INT; // scores should be less than MAX_INT
  const excludedLeaderboards = ["15", "289"];

  // decode the leaderboard score (convert to minutes, seconds, milliseconds)
  function decodeLeaderboardTime(score) {
    const leaderboardScore = MAX_INT - score;
    const totalSeconds = Math.floor(leaderboardScore / 1000); // total s
    const milliseconds = leaderboardScore % 1000; // ms

    const minutes = Math.floor(totalSeconds / 60); // min
    const seconds = totalSeconds % 60; // remaining s

    // Format the time in MM:SS.MMM format
    const formattedTime =
      (minutes > 0 ? `${padZero(minutes)}:` : "") +
      `${padZero(seconds)}.${padZero(milliseconds, 3)}`;

    return formattedTime;
  }

  // pad numbers with leading zeros
  function padZero(num, length = 2) {
    return num.toString().padStart(length, "0");
  }

  // check if the score is valid and in the expected range
  function isValidLeaderboardScore(score) {
    return (
      !isNaN(score) && score >= VALID_RANGE_MIN && score <= VALID_RANGE_MAX
    );
  }

  // update select option texts
  function updateSelectTextsToCorrectNames() {
    const selectElement = document.querySelector("#leaderboard-select");

    if (selectElement) {
      const options = selectElement.querySelectorAll("option");

      // loop through the options and update the visible text
      options.forEach((option, index) => {
        // retrieve the correct key from leaderboardNames by checking its order
        const leaderboardKey = getLeaderboardKey(index);

        if (leaderboardKey && leaderboardNames[leaderboardKey]) {
          // prepend leaderboard key (001, 002, etc.) to option text
          option.textContent = `${leaderboardKey} - ${leaderboardNames[leaderboardKey]}`;
        }
      });
    }
  }

  // get the correct leaderboard key based on the option index
  function getLeaderboardKey(optionIndex) {
    const keys = Object.keys(leaderboardNames); // get the keys of leaderboardNames

    // if the optionIndex corresponds to a valid key in the leaderboardNames object
    // assumes keys are mapped in the same order as the options
    if (optionIndex < keys.length) {
      return keys[optionIndex]; // return the key for the current option
    }

    return null;
  }

  // highlight yourself if you're logged in
  function highlightUserCells() {
    // get the username from user profile dropdown
    const usernameElement = document.querySelector("#navbarDropdown");
    const username = usernameElement
      ? usernameElement.textContent.trim()
      : null;

    if (username) {
      // check the username cells
      const cells = document.querySelectorAll(
        ".container[wire\\:id] tbody tr td:nth-of-type(2)"
      );

      cells.forEach((cell) => {
        if (cell.textContent.trim() === username) {
          cell.classList.add("is-me");
        }
      });
    }
  }

  // process all rows in the table
  function processTable() {
    // get selected option value from dropdown
    const selectElement = document.querySelector("#leaderboard-select");
    const selectedValue = selectElement ? selectElement.value : null;

    // find the time/score cells
    const elements = document.querySelectorAll(
      ".container[wire\\:id] .table.table-striped td.text-right"
    );

    elements.forEach((el) => {
      // let us know the table's been formatted
      el.classList.add("is-formatted");

      // skip processing specific calles
      if (excludedLeaderboards.includes(selectedValue)) {
        console.log("Skipping processing for this leaderboard.");
        return; // move to next cell
      }

      // parse the text content as a number
      const score = parseInt(el.textContent.trim(), 10);

      // check if score is valid and in expected range
      if (isValidLeaderboardScore(score)) {
        // is valid, so convert the score
        const convertedTime = decodeLeaderboardTime(score);

        // update element with converted time, add 'is-time-trial' class
        el.textContent = convertedTime;
        el.classList.add("is-time-trial");
        el.classList.remove("is-kudos"); // ensure no kudos class is present
      } else {
        // is not valid, so format the number and add "kudos" to the string
        const formattedScore = isNaN(score)
          ? el.textContent.trim()
          : score.toLocaleString();
        el.textContent = `${formattedScore} kudos`;

        // add 'is-kudos' class
        el.classList.add("is-kudos");
        el.classList.remove("is-time-trial"); // ensure no time-trial class is present
      }
    });
  }

  // monitor the dropdown change and detect table updates
  function monitorDropdownAndTable() {
    const dropdown = document.getElementById("leaderboard-select");

    // listen for change events on the dropdown to detect when a new table is selected
    if (dropdown) {
      dropdown.addEventListener("change", () => {
        // wait for table to be updated
        const interval = setInterval(() => {
          const table = document.querySelector(".table.table-striped");
          if (table) {
            // once table is present, stop the interval and process it
            clearInterval(interval);
            processTable();
            updateSelectTextsToCorrectNames();

            highlightUserCells();
          }
        }, 500); // check every 500ms
      });
    }
  }

  // inject custom styles for the new classes
  function injectStyles() {
    const style = document.createElement("style");
    style.innerHTML = `
      :root {
        --gold: radial-gradient(
            ellipse farthest-corner at right bottom,
            #ffeba8 0%,
            #e5c787 8%,
            #f2d792 30%,
            #d2b360 40%,
            transparent 80%
          ),
          radial-gradient(
            ellipse farthest-corner at left top,
            #ffffff 0%,
            #ffffac 8%,
            #f2d792 25%,
            #5d4a1f 62.5%,
            #5d4a1f 100%
          );
        --silver: radial-gradient(
            ellipse farthest-corner at right bottom,
            #404040 0%,
            #848484 8%,
            #ededed 30%,
            #e2e2e2 40%,
            transparent 80%
          ),
          radial-gradient(
            ellipse farthest-corner at left top,
            #898989 0%,
            #e2e2e2 8%,
            #fdfdfd 25%,
            #a4a4a4 62.5%,
            #a8a8a8 100%
          );
        --bronze: radial-gradient(
            ellipse farthest-corner at right bottom,
            #eabaad 0%,
            #dea99e 8%,
            #d88f7a 30%,
            #b07366 60%,
            transparent 80%
          ),
          radial-gradient(
            ellipse farthest-corner at left top,
            #fff1ee 0%,
            #eabaad 8%,
            #d88f7a 25%,
            #7e3b2a 62.5%,
            #df946d 100%
          );
        --border-color: #6c757d;
      }
      .is-time-trial {
      }
      .is-kudos {
      }
      .is-formatted {
        font-family: monospace, monospace;
      }
      tr:has(.is-me) {
        outline: 3px solid red;
        outline-offset: -3px;
      }

      .container[wire\\:id] table {
        border-collapse: collapse;
      }
      .container[wire\\:id] tbody tr:nth-of-type(1) {
        border-top: 3px solid var(--border-color);
        background: var(--gold);
      }

      .container[wire\\:id] tbody tr:nth-of-type(2) {
        border-top: 3px solid var(--border-color);
        background: var(--silver);
      }

      .container[wire\\:id] tbody tr:nth-of-type(3) {
        border-top: 3px solid var(--border-color);
        background: var(--bronze);
      }

      .container[wire\\:id] tbody tr:nth-of-type(1),
      .container[wire\\:id] tbody tr:nth-of-type(2),
      .container[wire\\:id] tbody tr:nth-of-type(3) {
        color: #000;
        text-shadow: 0 0 1.5em #fff;
      }

      .container[wire\\:id] tbody tr:nth-of-type(1) td:nth-of-type(2),
      .container[wire\\:id] tbody tr:nth-of-type(2) td:nth-of-type(2),
      .container[wire\\:id] tbody tr:nth-of-type(3) td:nth-of-type(2) {
        font-weight: bold;
        letter-spacing: .05ch;
      }

      .container[wire\\:id] tr:nth-of-type(11) {
        border-top: 6px solid var(--border-color);
      }

              `;
    document.head.appendChild(style);
  }

  // initial call to monitor dropdown and table changes
  monitorDropdownAndTable();

  // also process the table initially if it's already loaded
  processTable();

  // inject the new class' styles
  injectStyles();

  // fix the leaderboard names
  updateSelectTextsToCorrectNames();

  // highlight your gamertag
  highlightUserCells();
})();
