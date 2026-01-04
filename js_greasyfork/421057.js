// ==UserScript==
// @name         Popmundo Item Category Searcher
// @name:tr      Popmundo Eşya Kategorisi Bulma

// @description  Thanks to this script, you will be able to find the category of the items you did not know or forgot. You can also open the item automatically with a single click.
// @description:tr Bu script sayesinde, bilmediğiniz veya unuttuğunuz eşyaların kategorisini bulabileceksiniz. Ayrıca tek bir tıklama ile o eşyaları açabileceksiniz.

// @version      1.0.2
// @icon

// @author       Appriapos

// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/ShoppingAssistant*

// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue

// @license      MIT

// @run-at       document-body
// @namespace    https://greasyfork.org/users/733822
// @downloadURL https://update.greasyfork.org/scripts/421057/Popmundo%20Item%20Category%20Searcher.user.js
// @updateURL https://update.greasyfork.org/scripts/421057/Popmundo%20Item%20Category%20Searcher.meta.js
// ==/UserScript==

let jQuery = unsafeWindow.jQuery;

let db={en:{categories:{1:{n:"Musical Instrument",i:{1:"Acoustic Guitar",14:"Drums",15:"Trumpet",18:"Microphone",23:"Bass Guitar",146:"Keyboard",150:"Saxophone",151:"Violin",155:"Flute",159:"Banjo",160:"Harmonica",161:"DJ Twin-Turntable System",162:"Piano",185:"Mandolin",186:"Harp",187:"Xylophone",188:"Dobro Guitar",189:"Lute",190:"Harpsichord",191:"Goblet Drum",192:"Clarinet",193:"Ukulele",194:"Bagpipes",195:"Tuba",196:"Cello",197:"Contrabass",198:"Oboe",199:"Accordion",200:"Pan-Pipes",201:"Zither",202:"Dulcimer",476:"Electric Guitar",502:"Trombone",748:"Bell",913:"Chapman Stick"}},2:{n:"Clothes",i:{20:"Gloves",39:"Tight Women's Top",44:"Miniskirt",64:"Hooded Jacket",80:"Bulletproof Vest",279:"Polo Shirt",300:"Bridal dress",557:"Dressing gown",558:"Coat",559:"Tie",560:"Tunic",561:"Belt",562:"Scarf",563:"Outdoor jacket",564:"Skirt",565:"T-Shirt",568:"Cloak",569:"Vest top",588:"Jumper",590:"Kilt",684:"Towel",685:"Dress",690:"Souvenir T-shirt",940:"Popmundo T-Shirt",955:"Turtleneck",1050:"Kimono",1051:"Suit jacket",1053:"Vest",1065:"Racing overall",1066:"Boilersuit",1070:"Bow tie",1107:"Apron (Full-length)",1108:"Apron (Waist)",1179:"Socks",1182:"Robe",1231:"Tuxedo jacket",1296:"Cardigan",1298:"Pyjama Jacket",1299:"Nightgown",1322:"Ballet tutu",1339:"Children's costume",1343:"Costume",1354:"Shirt",1886:"T-Shirt (Ace of Spades)",1887:"T-Shirt (Spiders from Mars)",1888:"T-Shirt (When Doves Cry)",1889:"T-Shirt (On a Dark Desert Highway)",2294:"T-Shirt (Wash Your Hands!)",2323:"'Stay The F-ck Away From Me' Tuxedo Jacket",2324:"'Life On Mars?' Blue Suit Jacket",2325:"Super Mini Skirt",2326:"Denim Shorts",2327:"Lolita Dress",2328:"Silky Satin Dress"}},6:{n:"Books",i:{88:"Basic Media Manipulation",89:"Basic Make-Up",90:"Play the Acoustic Guitar",91:"Basic Percussion Instruments",92:"Play the Piano",93:"Play the Violin",94:"Play the Trumpet",95:"Basic Showmanship",96:"Basic Modelling",97:"Basic Fashion",99:"Basic Dancing",100:"Basic Lyrics & Poetry",101:"Basic Catwalking",102:"Basic Sex Appeal",106:"Basic Record Production",110:"Basic Composing",131:"Basic Kama Sutra",139:"Basic Economics",140:"Basic Law",141:"Basic Medicine",156:"Play the Flute",157:"Basic Singing",163:"Basic Electronic Instruments",164:"Play the Banjo",165:"Play the Harmonica",166:"Play the Saxophone",167:"Play the Bass Guitar",169:"Basic Woodwind Instruments",170:"Basic String Instruments",171:"Basic Brass Instruments",172:"Basic Keyboard Instruments",173:"History of Rock",174:"History of Modern Rock",175:"History of Heavy Metal",176:"History of Punk Rock",177:"History of Electronica",178:"History of Pop",179:"History of Hip Hop",180:"History of R&B",181:"History of Reggae",182:"History of World Music",183:"History of Country & Western",184:"History of Jazz",409:"History of Blues",410:"History of Classical Music",415:"Fundamentals of Rhetoric",448:"Professional Accounting",453:"Basic Yoga",454:"Basic Religion",455:"Basic Comedy",456:"Professional Public Relations",458:"Proper Drinking Habits",462:"Basic Martial Arts",463:"Mastering Jujutsu",464:"Basic Street-smartness",468:"Composing Ballads",469:"Composing Singalongs",470:"Composing Floorfillers",471:"Composing Easy Listening",472:"Composing Anthems",473:"Composing Crowdpleasers",474:"Composing Simplistic Music",475:"Composing Music for Musicians",477:"Play the Bag Pipes",478:"Play the Dobro",479:"Play the Clarinet",480:"Play the Cello",481:"Play the Contrabass",482:"Play the Drums",483:"Play the Dulcimer",484:"Play the Goblet Drums",485:"Play the Harp",486:"Play the Lute",487:"Play the Mandolin",488:"Play the Oboe",489:"Play the Pan Pipes",490:"Play the Tuba",491:"Play the Ukulele",492:"Play the Xylophone",493:"Play the Zither",494:"Play the Electric Guitar",495:"Lead Vocals",496:"Backup Vocals",499:"Basic Detective",501:"Professional Medicine",503:"Play the Trombone",505:"Pharmacology",509:"Basic Botany",519:"Play the Accordion",524:"Basic Photography",533:"Cookbook",541:"Basic Art & Design",542:"History of Latin Music",543:"History of African Music",544:"History of Flamenco",545:"Basic Acting",546:"Motion Picture Photography",547:"Professional Veterinary",549:"Graffiti Painting",551:"Rapping",596:"Image Analysis",597:"DNA Analysis",598:"Fingerprint recognition",604:"Basic Illusionism",606:"Professional Illusionism",612:"Advanced Pharmacology",623:"Basic Leadership",624:"Professional Rhetoric",625:"Basic Science",626:"Advanced Science",628:"Basic Engineering",629:"Advanced Engineering",630:"Street Lore",634:"Professional Comedy",637:"Aikido Mastery",638:"Fist Fighting Fundamentals",640:"Kung Fu Mastery",643:"Professional Poetry",645:"Basic Astrology",660:"Party Planning",661:"Basic Fire Fighting",664:"Stage Diving",665:"Secrets of Erotic Dancing",666:"Breathing Fire like a Dragon",667:"Music Improvisation",668:"Moonwalking for Dancers",669:"Breakdancing for Professionals",670:"Basic Special Effects",671:"Advanced Fireworks",672:"Lighting Wizardry",673:"Ritual Summoning",674:"Audience Awareness",675:"Folk Dancing",676:"Basic Computers",677:"Basic Chemistry",680:"Environmental Engineering",691:"Special Weapons And Tactics",693:"Undercover Operations",696:"Basic Teaching",697:"Advanced Pedagogy",709:"Stealth for Beginners",722:"Linguistics for Beginners",751:"Basic Sewing",799:"Entomology for Everyone",914:"Play the Chapman Stick",926:"Basic Fire Arms",927:"Paranormal Tracking Devices",929:"Basics of Power Tools",935:"Basic Animal Training",936:"Basic Disguise",938:"Basic Politics",939:"Basic Psychology",948:"Turntable Techniques",949:"Professional Dancing",950:"Professional Etiquette",951:"Professional Showmanship",971:"Distillation 101",1024:"Farming Today",1040:"Making Cigars",1072:"The Art of Engraving",1076:"Tobacco Chemistry",1079:"Baking - The Ultimate Guide",1156:"Parent's Handbook",1220:"Fishing for Everyone",1226:"Biochemistry 101",1227:"Cheesemaking Explained",1353:"Hatter's Bible",1534:"Mixology for Beginners",1666:"Basic Racquet Sports",1667:"Basic Volleyball",1668:"Basic Football",2178:"Basic Basketball"}},7:{n:"Jewellery",i:{573:"Watch",575:"Ring, large",576:"Ring, small",580:"Necklace",581:"Bracelet",912:"Engagement ring",2317:"Ring of Power",2318:"Lucky Charm",2319:"Diamond Choker",2320:"Time Turner Necklace",2321:"Tongue Piercing",2322:"Belly Piercing",2347:"Memorial Locket"}},10:{n:"Shoes",i:{48:"Military boots",60:"Shoes, high heel",65:"Trainers",235:"Disco shoes",236:"Cowboy boots",287:"Monkey Slippers",365:"Moon Boots",582:"Shoes, laced",583:"Sandals",584:"Boots",585:"Shoes",603:"Flip-flops",704:"Boots, knee-high",1067:"Racing boots",1324:"Ballet shoes",1335:"Wellington boots",1376:"Loafers"}},13:{n:"Toys",i:{133:"CD Album",134:"CD Single",168:"Halloween Monster Mask",206:"Small Set of Fireworks",250:"Picnic basket",297:"MP3 player",302:"Karaoke kit",303:"Whip",304:"Toy handcuffs",310:"Teddy-bear",311:"Doll (cute)",312:"Deck of cards",555:"Magnifying glass",646:"Zodiac",657:"Pi\xf1ata",689:"Tacky Souvenir Miniature",720:"Mask",1045:"Crayon",1046:"Colouring book",1181:"Clown nose",1259:"Glow Stick",1348:"Machine that goes PING!",1351:"Theatre Make-up kit",1355:"Toy sword",1356:"Toy handgun",1375:"Rubik's Cube",1377:"Hula hoop",1441:"Statue of Liberty Fireworks",1661:"Swim Ring",1662:"Floating Mattress",1663:"Beach Play Set",1870:"Children's birthday pi\xf1ata",2005:"d10 die",2118:"Placard (Save the Kraken!)",2119:"Placard (Kill the Kraken!)"}},22:{n:"Clothes (Headwear)",i:{52:"Baseball cap",73:"Bandanna",229:"Top Hat",271:"Hairband",371:"French Beret",531:"Cowboy hat",567:"Cap",708:"Wig",1044:"Racing helmet",1054:"Bowler hat",1084:"Baker's hat",1184:"Sombrero",1323:"Hard hat",1352:"Hat",1360:"Wreath",1437:"Tin Foil Hat",1647:"Straw Sun Hat",2180:"Jeanne's glorious wig"}},24:{n:"Clothes (Legwear)",i:{25:"Jeans",40:"Leggings",43:"Hotpants",272:"Biker shorts",556:"Trousers, slim fit",566:"Trousers, baggy",586:"Pedal pushers",587:"Trousers",1052:"Suit trousers",1183:"Bondage trousers",1232:"Tuxedo trousers",1297:"Pyjama Trousers",1327:"Bib overall",1334:"Boardshorts"}},25:{n:"Clothes (Underwear)",i:{58:"Tights",284:"Thong",285:"Grandad style underwear",286:"Grannie knickers",570:"Boxer shorts",571:"Briefs",636:"Corset",705:"Bra",707:"Bikini",1068:"Fishnet stockings",1180:"Knickers",1359:"Suspender belt"}},27:{n:"Pets",i:{374:"Greyhound",375:"Cat",376:"Hamster",377:"Parrot",378:"Alligator",379:"Guinea Pig",380:"Monkey",381:"Horse",382:"Cocker Spaniel",383:"Labrador",384:"Chihuahua",385:"Beagle",386:"Rottweiler",387:"Pig",388:"Rabbit",389:"Canary Bird",589:"Elephant",695:"Panda",1383:"Pygmy Jerboa"}},42:{n:"Electronics",i:{523:"Camera",525:"Camera Film (35 mm)",526:"Instant Camera",527:"Camera Film (Instant Camera)",528:"Camera Medium Format (80 mm)",529:"Camera Film (80 mm)",553:"Silent burglar alarm",659:"Fire detector",1361:"Video Camera",1385:"Laptop computer",1387:"Desktop computer",1410:"Unikon Compact Digital Camera"}},47:{n:"Medical Supplies",i:{506:"Painkillers",537:"Adrenaline Injection",608:"Blood sampler",611:"Medicine base",631:"Vaccine",632:"Nurse dress",706:"Morning after pill",906:"Pregnancy test",932:"Box of Syringes"}},49:{n:"Social Club Items",i:{622:"Peace pipe",635:"Tomahawk"}},51:{n:"Tools",i:{532:"Lasso",719:"Knife",737:"Suitcase",738:"Trunk",744:"Cane",747:"Candle",749:"Incense",759:"Sewing machine",764:"Toaster",765:"Hoover",766:"Hammer",767:"Screwdriver",768:"Iron",770:"Electric Torch",783:"Animal Cage",789:"Insect Net",890:"Pickaxe",905:"Mill",928:"Chainsaw",957:"Kettle",958:"Chemistry Lab Travel Kit",963:"Chaveta",970:"Still",1008:"Aging Barrel",1023:"Bucket",1025:"Board",1026:"Beehive",1028:"Beekeeper's hat",1029:"Jar",1037:"Pitchfork",1048:"Cooking pot",1049:"Hookah",1060:"Baby bottle",1061:"Umbrella",1089:"Butter churn",1143:"Butcher's knife",1163:"Frying pan",1164:"Food smoker",1230:"Whisk",1245:"Roaster",1246:"Thermometer",1254:"Grill",1257:"Toilet Paper",1265:"Blow Torch",1266:"Binoculars",1269:"Fishing Pole",1280:"Kitchen Syringe",1285:"Basket",1312:"Bombilla",1372:"Swiss Army Knife",1373:"Duct tape",1378:"Rolling paper",1454:"Cocktail shaker",1455:"Muddler",1456:"Bar spoon",1557:"Shovel",1565:"Torch"}},52:{n:"Utilities",i:{436:"Fire Extinguisher",678:"Petrol can",681:"Air Pollution Detector",682:"Aquifer Capacity Survey Kit",683:"Aquifer Quality Probe",746:"Rag",920:"Ear plugs",954:"Custom Paint",960:"Distilled Water",995:"Charcoal"}},55:{n:"Art Supplies",i:{67:"Can of spraypaint",71:"Screen print template"}},56:{n:"Make-up",i:{59:"Basic Make-up kit",1649:"Bottle of Sunscreen"}},58:{n:"Accessories",i:{244:"Say NO to violence badge",277:"Spiked Bracers",572:"Sunglasses",574:"Nose jewellery",577:"Earrings, small",578:"Earrings, large",579:"Earrings, tacky",700:"Badge",1059:"Blanket",1195:"Spectacles",1258:"Feather Boa",1393:"Handkerchief",1409:"Man Bag",1432:"Pom-poms",1838:"Gold Medal",1839:"Silver Medal",1840:"Bronze Medal",2293:"Face Mask"}},60:{n:"Natural Products",i:{1349:"Feather"}},61:{n:"Animals",i:{391:"Tapir",714:"Cow",716:"Crow",727:"Lion",733:"Eagle",736:"Gibbon",740:"Beaver",741:"Raccoon",742:"Bat",743:"Rat",773:"Kangaroo",774:"Possum",775:"Dingo",776:"Koala",781:"Deer",784:"Squirrel",785:"Emu",786:"Platypus",787:"Falcon",788:"Wolverine",792:"Frog",866:"Jaguar",867:"Anteater",868:"Toucan",877:"Armadillo",878:"Hedgehog",879:"Mole",880:"Seal",881:"Camel",882:"Llama",883:"Moose",885:"Ibex",1041:"Hen",1043:"Rooster",1055:"Boa constrictor",1056:"Lizard",1057:"Ocelot",1058:"Sloth",1078:"Turtle",1138:"Goat doe",1139:"Goat buck",1140:"Sheep ewe",1141:"Sheep ram",1142:"Bull",1149:"Cougar",1150:"Condor",1151:"Hummingbird",1152:"Otter",1238:"Pig Sow",1239:"Pig Hog",1286:"Ostrich",1295:"Ferret",1300:"Antelope",1302:"Fox",1303:"Newt",1321:"Wolf",2308:"Sparrowhawk"}},62:{n:"Insects",i:{731:"Mosquito",732:"Dragonfly",790:"Butterfly",791:"Spider",793:"Worm",794:"Grasshopper",795:"Beetle",796:"Bee",797:"Ant",798:"Mantis",800:"Fly",801:"Stick insect",802:"Bug",803:"Wasp",804:"Caterpillar",805:"Moth",806:"Louse",807:"Cockroach",808:"Termite",809:"Scorpion",824:"Tick",849:"Maggot",891:"Cricket",892:"Silverfish",893:"Rock crawler",894:"Earwig",895:"Caddisfly",896:"Flea",897:"Antlion",898:"Lacewing",899:"Mantidfly",900:"Centipede",2073:"Nymph"}},63:{n:"Plants",i:{782:"Lily",810:"Rose",811:"Orchid",812:"Thistle",813:"Hyacinth",814:"Basil",815:"Sunflower",817:"Eucalyptus",818:"Fern",819:"Garlic",820:"Cocoa",821:"Coca",822:"Holly",823:"Mandrake",825:"Lingonberry",826:"Chokeberry",827:"Pine cone",828:"Lotus",829:"Ceibo",830:"Birch",831:"Lily of the Valley",833:"Clover",834:"Tabebuia",835:"Heather",836:"Harebell",837:"Rue",838:"Iris",839:"Chestnut",840:"Lavender",841:"Guava",842:"Poppy",843:"Cornflower",844:"Tulip",845:"Plum",847:"Hemp",850:"Coffee Bean",851:"Pepper",852:"Laurel",853:"Hyssop",855:"Chamomile",856:"Dandelion",857:"Fennel",859:"Hibiscus",860:"Jasmine",861:"Juniper",862:"Lemongrass",863:"Liquorice",864:"Nettle",865:"Nutmeg",869:"Evening primrose",870:"Riberry",871:"Sesame",872:"Tamarind",873:"Valerian",874:"Wasabi",875:"Yarrow",965:"Tobacco",974:"Agave",975:"Grape",979:"Apple",983:"Anise",1005:"Sugar Cane",1010:"Cinnamon",1011:"Coconut",1014:"Cherry",1016:"Caraway",1017:"Maize",1031:"Hops",1035:"Sorghum",1063:"Tea leaves",1085:"Ginger",1087:"Peanut",1090:"Vanilla",1091:"Almond",1096:"Hazelnut",1102:"Walnut",1110:"Apricot",1111:"Strawberry",1114:"Raspberry",1116:"Pear",1119:"Lemon",1121:"Pecan",1125:"Pumpkin",1128:"Blueberry",1129:"Banana",1133:"Mustard seed",1134:"Ginseng",1148:"Clove",1155:"Mistletoe",1158:"Pineapple",1187:"Black pepper",1194:"Bean",1196:"Chilli Pepper",1222:"Mentha",1224:"Parsley",1240:"Orange",1250:"Pine Nut",1253:"Turnip",1256:"Aubergine",1260:"Saffron",1261:"Pea",1268:"Marjoram",1278:"Chickpea",1281:"Seaweed",1287:"Coriander",1293:"Rose Hip",1304:"Chives",1305:"Oregano",1309:"Thyme",1315:"Marula",1317:"Lime",1318:"Cabbage",1445:"Blackberry",1446:"Blackcurrant",1447:"Cranberry",1448:"Gentian root",1452:"Peat",1559:"Olive"}},64:{n:"Sports Equipment",i:{280:"Basketball",281:"Football (American)",282:"Football (Soccer)",283:"Baseball",305:"Snowboard",306:"Skateboard",591:"Roller skates",1660:"Beach Ball",1664:"Volleyball",1665:"Tennis Racquet",1672:"Scuba Gear",2405:"Magical Archery Score Card"}},65:{n:"Chemicals",i:{888:"Sodium Carbonate",1136:"Rennet",1225:"Bacteria culture",1288:"Herbal Distillate",1294:"Itching Powder"}},66:{n:"Trees",i:{816:"Myrtle",832:"Oak",858:"Ginkgo"}},67:{n:"Weapons",i:{694:"Shotgun",698:"Shotgun rounds",919:"Zombie Tracker"}},68:{n:"Groceries",i:{357:"Can of whipped cream",959:"Sesame Oil",973:"Sugar",981:"Rice",1006:"Yeast",1019:"Wheat",1020:"Rye",1021:"Barley",1022:"Malt",1027:"Honey",1042:"Egg",1047:"Syrup",1069:"Milk",1081:"Flour",1082:"Baking powder",1083:"Raisin",1086:"Oatmeal",1088:"Butter",1092:"Salt",1094:"Phyllo",1100:"Bread",1101:"Olive Oil",1105:"Marzipan",1112:"Chocolate",1120:"Gelatin",1122:"Vinegar",1123:"Food colouring",1135:"Mustard",1137:"Cheese",1146:"Suet",1153:"Peanut Butter",1154:"Hazelnut Chocolate Paste",1171:"Chilli powder",1172:"Noodles",1174:"Tofu",1175:"Garlic powder",1176:"Soy sauce",1189:"Powdered sugar",1221:"Yoghurt",1229:"Mayonnaise",1234:"Sausage",1235:"Animal intestine",1237:"Lard",1241:"Jam",1242:"Pectin",1244:"Coffee (Roasted)",1248:"Pasta",1249:"Condiment",1255:"Sour Cream",1263:"Mascarpone",1290:"Starch",1316:"Coconut milk",1319:"Sauerkraut",1330:"Sourdough",1331:"Canned fish"}},72:{n:"Meals",i:{26:"Hotdog",119:"Steak",120:"Salad",261:"Hamburger",262:"Pizza",315:"Tortilla",1131:"Sandwich",1161:"Elvis sandwich",1185:"Meal",1429:"Grilled Chicken"}},73:{n:"Snacks",i:{408:"Russian Caviar",771:"Bunch of carrots",980:"Crisps (bag of)",986:"Peanuts (salted)",987:"Peanuts (roasted)",988:"Popcorn",989:"Jerky",990:"Cracker",991:"Tortilla chips",992:"Pretzel",993:"Cheese puffs",1277:"Exotic Snack",1301:"Snack"}},74:{n:"Confectionery",i:{207:"Heart Shaped Box of Chocolates",314:"Birthday cake",760:"Ice Cream",1077:"Chewing gum",1080:"Cookie",1093:"Baklava",1098:"Shortbread",1099:"Gingerbread",1103:"Strudel",1104:"Brownie",1109:"Cake",1117:"Fruitcake",1118:"Sweet Pie",1124:"Tart",1127:"Muffin",1157:"Chocolate bar",1159:"Caramel sweets",1188:"Biscuit",1190:"Brioche",1264:"Dessert",1267:"Pastry",1289:"Sweets",1314:"Christmas dish",1443:"Lollipop",1946:"Homemade birthday cake"}},76:{n:"Liquor",i:{253:"Bottle of brandy",407:"Bottle of Stolichnaya",512:"Bottle of Absinthe",969:"Tequila",972:"Moonshine",976:"Grappa",978:"Eau-de-vie",982:"Sake",984:"Raki",985:"Sambuca",994:"Jenever",996:"Vodka",997:"Gin",1007:"Rum",1009:"J\xe4germeister",1012:"Malibu Rum",1013:"Schnapps",1015:"Akvavit",1018:"Bourbon",1032:"Calvados",1033:"Metaxa",1034:"Slivovitz",1036:"Baijiu",1095:"Amaretto",1115:"P\xe1linka",1160:"Cacha\xe7a",1233:"Grape Brandy",1243:"Liquor",1247:"Ouzo",1465:"Angostura bitters",1466:"Benedictine",1467:"Campari",1468:"Cassis",1469:"Chambord",1470:"Cherry brandy",1471:"Dark Rum",1472:"Galliano",1473:"Gentian",1474:"Irish whiskey",1475:"Kahlua",1476:"Peach schnapps",1477:"Vermouth",1478:"Rosso vermouth",1479:"Whisky",1532:"Apple Schnapps",1533:"Cointreau",2076:"Plaintain's Port Wine",2077:"Mutiny Maiz"}},77:{n:"Wine and Beer",i:{10:"Pint of Beer",109:"Bottle of Red Wine",256:"Bottle of White Wine",257:"Bottle of Champagne",264:"Breezer",403:"6-pack of Beer",977:"Cider",1030:"Mead",1144:"Gl\xfchwein",1145:"Eggnog",1236:"Bottle of Finest Champagne",1415:"Port Wine"}},78:{n:"Soft Drinks",i:{258:"Bottle of Lemonade",259:"Bottle of pink soda",260:"Bottle of mineral water",998:"Tonic water",999:"Juice",1e3:"Diet Cola",1001:"Pop Cola",1002:"Melvin Cola",1003:"Soda",1291:"Non-alcoholic Drink"}},79:{n:"Drinks (Hot)",i:{1062:"Hot chocolate",1064:"Tea",1313:"Hot drink"}},81:{n:"Tobacco Products",i:{964:"Cigar",1071:"Shisha tobacco",1292:"Snus",1374:"Cigarette"}},83:{n:"Meat",i:{1130:"Ham",1162:"Bacon",1165:"Quorn",1166:"Pork",1167:"Beef",1168:"Chicken meat",1186:"Lamb meat",1191:"Minced beef",1251:"Cured Meat",1252:"Offal",1262:"Veal",1279:"Rabbit Meat"}},84:{n:"Fruit and Vegetables",i:{937:"Tomato",1173:"Onion",1177:"Soybean",1192:"Potato",1193:"Lettuce",1223:"Cucumber",1449:"Grapefruit",1450:"Passion fruit",1451:"Peach",1453:"Pomegranate"}},85:{n:"Fish",i:{1169:"Salmon",1170:"Tuna",1197:"Shrimp",1198:"Mussel",1199:"Cuttlefish",1200:"Anchovy",1201:"Carp",1202:"Catfish",1203:"Codfish",1204:"Eel",1205:"Haddock",1206:"Herring",1207:"Mackerel",1208:"Sardine",1209:"Snapper",1210:"Trout",1211:"Halibut",1212:"Pollock",1213:"Sillaginid",1214:"Sturgeon",1215:"Turbot",1216:"Swordfish",1217:"Tilefish",1218:"Monkfish",1219:"Cobia",1270:"Zander",1271:"Pike",1272:"Grouper",1273:"Sea Bass",1274:"Tench",1275:"Perch",1282:"Sea Urchin",1283:"Yellowtail",1308:"Crayfish"}},87:{n:"Garment Materials",i:{750:"Sewing kit",1228:"Cloth",1325:"Simple fabric roll",1328:"Button",1329:"Thread",1337:"Fur",1340:"Special fabric roll",1341:"Buckle",1342:"Leather",1344:"Beads",1345:"Ribbon",1346:"Exquisite fabric roll",1347:"Lace",1357:"Woven straw",1358:"Tassel"}},93:{n:"Baby Supplies",i:{614:"Nappy"}},94:{n:"Birth Control & Protection",i:{130:"Condom pack"}},100:{n:"Cocktails",i:{1480:"Americano",1481:"Apple Manhattan",1482:"Apple Martini",1483:"Between the Sheets",1484:"Black Russian",1485:"Blood and Sand",1486:"Bloody Mary",1487:"Blueberry Martini",1488:"Bobby Burns",1489:"Bronx",1490:"Buck's Fizz",1491:"Caipirinha",1492:"Cosmopolitan",1493:"Cuba Libre",1494:"Daiquiri",1495:"Dutch Courage",1496:"Eclipse",1497:"El Diablo",1498:"French Martini",1499:"Gin and Tonic",1500:"Gimlet",1501:"Godfather",1502:"Harvey Wallbanger",1503:"Honeysuckle Daiquiri",1504:"Hot Toddy",1505:"Hurricane",1506:"Irish Coffee",1507:"Long Island Iced Tea",1508:"Manhattan",1509:"Martini",1510:"Margarita",1512:"Mint Julep",1513:"Mojito",1514:"Moscow Mule",1515:"Negroni",1516:"Old-Fashioned",1517:"Pi\xf1a Colada",1518:"Raspberry Martini",1519:"Rob Roy",1520:"Sangria",1521:"Screwdriver",1522:"Seabreeze",1523:"Sex on the Beach",1524:"Sidecar",1525:"Singapore Sling",1526:"Strawberry Daiquiri",1527:"Tequila Sunrise",1528:"Whiskey Daisy",1529:"Woo Woo",1530:"Shirley Temple",1560:"Dry Martini",2074:"Gunpowder Grog",2075:"Blackbeard's Bumboo"}},101:{n:"Drink mixers",i:{1458:"Sugar syrup",1459:"Cranberry juice",1460:"Ginger beer",1461:"Grenadine",1462:"Lime cordial",1463:"Passion fruit syrup",1464:"Worcestershire sauce"}},108:{n:"Swimwear",i:{1642:"Swim Briefs",1643:"One Piece Swimsuit",1644:"Swim Trunks",1645:"Swim Cap",1646:"Retro Swimsuit",1648:"Beach Towel"}},113:{n:"Furniture",i:{1696:"Armchair",1697:"Bedside Table",1698:"Bookcase",1699:"Bunk Bed",1701:"Chair",1703:"Chesterfield Sofa",1704:"Coffee Table",1705:"Contemporary Bed",1706:"Continental Bed",1707:"Dining Room Table",1708:"Display Cabinet",1710:"Four Poster Bed",1711:"Kitchen Table",1712:"Loveseat Sofa",1714:"Rocking Chair",1718:"Sectional Sofa",1719:"Sideboard",1720:"Sofa",1721:"Sofa Bed",1723:"Stool",1725:"Wall Shelf",1726:"Water Bed",1770:"Fireplace"}},116:{n:"Home Appliances",i:{1727:"Bathtub",1728:"Beer Fridge",1729:"Bidet",1730:"Coffee Maker",1731:"Cooker hob",1732:"Deep Fryer",1733:"Dishwasher",1734:"Airing cupboard",1735:"Freezer",1737:"Microwave Oven",1738:"Oven",1739:"Refrigerator",1740:"Shower",1741:"Cooker",1742:"Toilet",1743:"Tumble Dryer",1744:"Washing Machine",1745:"Electric Kettle"}},117:{n:"Housing Interior",i:{1700:"Ceiling Lamp",1702:"Chandelier",1709:"Floor Lamp",1713:"Oval Rug",1715:"Round Rug",1716:"Runner Rug",1717:"Seaman's Chest",1722:"Square Rug",1724:"Wall Lamp",1756:"Aquarium",1757:"Bird cage",1759:"Candelabra",1760:"Candlestick",1761:"Changing table",1762:"Chess Set",1763:"Small animal cage",1764:"Curtains",1765:"Cushion",1766:"Disco Ball",1767:"Yoga mat",1768:"Dog basket",1769:"Family Photograph",1771:"Ybox 180 Gaming Console",1772:"Flat Screen TV",1773:"Floor Plant",1775:"PrayStation Gaming Console",1776:"Home Gym 1000",1778:"Watercolour Painting",1779:"Home Theatre System",1780:"Indoor Cat Tree",1781:"Jewellery box",1782:"Lava Lamp",1785:"Oil Painting",1786:"Plant",1787:"Mirror",1788:"Pool Table",1789:"Printed Poster",1790:"Rocking Horse",1791:"Bust",1792:"Stereo System",1793:"Toy Chest",1794:"Terrarium",1835:"Big Trout Statue",2330:"GameStation 5"}},118:{n:"Housing Exterior",i:{1746:"Charcoal Barbecue",1747:"Dog Kennel",1748:"Fountain",1749:"Garden Gnome",1750:"Gas Barbecue",1752:"Lawn Mower",1754:"Patio Furniture",1755:"Wendy House"}},122:{n:"Gift Cards",i:{956:"Valentine's Day Card",1871:"Birthday Card",1872:"Musical Birthday Card",1968:"Mariachi Band",1969:"Magic Performance",1970:"Face Painter",1971:"Police Officer Stripper",1972:"Surprise Cake",1973:"Private Chef",2386:"Handwritten Card"}}}},tr:{categories:{1:{n:"Enstr\xfcmanlar",i:{1:"Akustik Gitar",14:"Davul",15:"Trompet",18:"Mikrofon",23:"Basgitar",146:"Klavye",150:"Saksafon",151:"Keman",155:"Fl\xfct",159:"Banjo",160:"Mızıka",161:"DJ İkiz-Turntable Sistemi",162:"Piyano",185:"Mandolin",186:"Arp",187:"Ksilofon",188:"Dobro Gitar",189:"Ud",190:"Klavsen",191:"Darbuka",192:"Klarnet",193:"Ukulele",194:"Gayda",195:"Tuba",196:"\xc7ello",197:"Kontrbas",198:"Obua",199:"Akordiyon",200:"Pan Fl\xfct",201:"Kanun",202:"Santur",476:"Elektrogitar",502:"Trombon",748:"\xc7an",913:"Chapman Gitarı"}},2:{n:"Kıyafetler",i:{20:"Eldiven",39:"Dar Bluz",44:"Mini Etek",64:"Kap\xfcşonlu Ceket",80:"Kurşun Ge\xe7irmez Yelek",279:"Polo G\xf6mlek",300:"Gelinlik",557:"Bornoz",558:"Palto",559:"Kravat",560:"Tunik",561:"Kemer",562:"Atkı",563:"Ceket",564:"Etek",565:"Tiş\xf6rt",568:"Pelerin",569:"Askılı Tiş\xf6rt",588:"S\xfcveter",590:"İsko\xe7 Eteği",684:"Havlu",685:"Elbise",690:"Turistik Hediyelik Tiş\xf6rt",940:"Popmundo Tiş\xf6rt\xfc",955:"Boğazlı Kazak",1050:"Kimono",1051:"Takım Ceketi",1053:"Yelek",1065:"Yarış Tulumu",1066:"Yangın Tulumu",1070:"Papyon",1107:"\xd6nl\xfck (Tam)",1108:"\xd6nl\xfck (Bel)",1179:"\xc7orap",1182:"C\xfcbbe",1231:"Smokin Ceketi",1296:"Hırka",1298:"Pijama \xdcst\xfc",1299:"Gecelik",1322:"Balerin T\xfct\xfcs\xfc",1339:"\xc7ocuk Kost\xfcm\xfc",1343:"Kost\xfcm",1354:"G\xf6mlek",1886:"Tiş\xf6rt (Ace of Spades)",1887:"Tiş\xf6rt (Spiders from Mars)",1888:"Tiş\xf6rt (When Doves Cry)",1889:"Tiş\xf6rt (On a Dark Desert Highway)",2294:"Tiş\xf6rt (Ellerini Yıka!)",2323:'"Stay The Fuck Away From Me" Tarzı Smokin',2324:'"Life On Mars?" Mavi Takım',2325:"S\xfcper Mini Etek",2326:"Kot Şort",2327:"Lolita Elbisesi",2328:"İpeksi Saten Elbise"}},6:{n:"Kitaplar",i:{88:"Temel Medya Y\xf6netimi",89:"Temel Makyaj",90:"Akustik Gitar \xc7al",91:"Temel Vurmalı Enstr\xfcmanlar",92:"Piyano \xc7al",93:"Keman \xc7al",94:"Trompet \xc7al",95:"Temel Şovmenlik",96:"Temel Mankenlik",97:"Temel Moda",99:"Temel Dans\xe7ılık",100:"Temel S\xf6z Yazımı ve Şairlik",101:"Temel Sahne Duruşu",102:"Temel Seksapel",106:"Temel Alb\xfcm Yapımcılığı",110:"Temel Bestecilik",131:"Temel Kama Sutra",139:"Temel Ekonomi",140:"Temel Hukuk",141:"Temel Tıp",156:"Fl\xfct \xc7al",157:"Temel Şarkı S\xf6yleme",163:"Temel Elektronik Enstr\xfcmanlar",164:"Banjo \xc7al",165:"Mızıka \xc7al",166:"Saksafon \xc7al",167:"Basgitar \xc7al",169:"Temel Tahta \xdcflemeli \xc7algılar",170:"Temel Telli Enstr\xfcmanlar",171:"Temel Bakır \xdcflemeli \xc7algılar",172:"Temel Klavye Enstr\xfcmanları",173:"Rock Tarihi",174:"Modern Rock Tarihi",175:"Heavy Metal Tarihi",176:"Punk Rock Tarihi",177:"Elektronika Tarihi",178:"Pop Tarihi",179:"Hip Hop Tarihi",180:"R&B Tarihi",181:"Reggae Tarihi",182:"World Music Tarihi",183:"Country & Western Tarihi",184:"Caz Tarihi",409:"Blues Tarihi",410:"Klasik M\xfczik Tarihi",415:"Hitabet Temelleri",448:"Profesyonel Muhasebecilik",453:"Temel Yoga",454:"Temel Din",455:"Temel Komedi",456:"Profesyonel Halkla İlişkiler",458:"D\xfczg\xfcn Alkol Kullanma",462:"Temel D\xf6v\xfcş Sanatları",463:"Jujutsu Ustalığı",464:"Temel Sokak Bilgisi",468:"T\xfcrk\xfc Besteleme",469:"Dile Dolanan M\xfczik Besteleme",470:"Dans M\xfcziği Besteleme",471:"Kolay Dinlenen M\xfczik Besteleme",472:"Marş Besteleme",473:"Halkı Coşturan M\xfczik Besteleme",474:"Basit M\xfczik Besteleme",475:"M\xfczisyenlere Hitap Eden M\xfczik Besteleme",477:"Gayda \xc7al",478:"Dobro \xc7al",479:"Klarnet \xc7al",480:"\xc7ello \xc7al",481:"Kontrbas \xc7al",482:"Davul \xc7al",483:"Santur \xc7al",484:"Darbuka \xc7al",485:"Arp \xc7al",486:"Ud \xc7al",487:"Mandolin \xc7al",488:"Obua \xc7al",489:"Pan Fl\xfct \xc7al",490:"Tuba \xc7al",491:"Ukulele \xc7al",492:"Ksilofon \xc7al",493:"Kanun \xc7al",494:"Elektrogitar \xc7al",495:"Solist Vokal",496:"Geri Vokal",499:"Temel Dedektiflik",501:"Profesyonel Tıp",503:"Trombon \xc7al",505:"Farmakoloji",509:"Temel Botanik",519:"Akordiyon \xc7al",524:"Temel Fotoğraf\xe7ılık",533:"Yemek Kitabı",541:"Temel Sanat ve Tasarım",542:"Latin M\xfczik Tarihi",543:"Afrika M\xfcziği Tarihi",544:"Flamenko Tarihi",545:"Temel Oyunculuk",546:"Sinemacılık",547:"Profesyonel Veterinerlik",549:"Grafiti Boyama",551:"Rap\xe7ilik",596:"G\xf6r\xfcnt\xfc Analizi",597:"DNA Analizi",598:"Parmak İzi Tanıma",604:"Temel İll\xfczyonizm",606:"Profesyonel İll\xfczyonizm",612:"İleri Farmakoloji",623:"Temel Liderlik",624:"Profesyonel Hitabet",625:"Temel Fen",626:"İleri Fen",628:"Temel M\xfchendislik",629:"İleri M\xfchendislik",630:"Sokak Bilimi",634:"Profesyonel Komedi",637:"Aikido Ustalığı",638:"Yumruk D\xf6v\xfcş\xfcn\xfcn Temelleri",640:"Kung Fu Ustalığı",643:"Profesyonel Şairlik",645:"Temel Astroloji",660:"Parti D\xfczenleme",661:"Temel İtfaiyecilik",664:"Sahne Dalışı",665:"Erotik Dansın Sırları",666:"Ejderha Gibi Ateş P\xfcsk\xfcrtmek",667:"Doğa\xe7lama M\xfczik Kitabı",668:"Dans\xe7ılar İ\xe7in Moonwalk",669:"Profesyoneller İ\xe7in Breakdans",670:"Temel \xd6zel Efektler",671:"Geliştirilmiş Havai Fişek G\xf6sterileri",672:"Işık B\xfcy\xfcs\xfc",673:"\xc7ağırma Rit\xfceli",674:"Seyirci Bilinci",675:"Halk Oyunları",676:"Temel Bilgisayar Bilgisi",677:"Temel Kimya",680:"\xc7evre M\xfchendisliği",691:"\xd6zel Silahlar ve Taktikler",693:"Gizli Operasyonlar",696:"Temel \xd6ğretmenlik",697:"İleri Pedagoji",709:"Yeni Başlayanlar İ\xe7in Gizlilik",722:"Yeni Başlayanlar i\xe7in Dilbilim",751:"Temel Dikiş",799:"Herkes İ\xe7in B\xf6cekbilim",914:"Chapman Gitarı \xc7al",926:"Temel Ateşli Silahlar",927:"Paranormal Takip Cihazları",929:"Motorlu El Aletleri Kullanmanın Temeli",935:"Temel Hayvan Eğitimi",936:"Temel Kılık Değiştirme",938:"Temel Politika",939:"Temel Psikoloji",948:"Turntable Teknikleri",949:"Profesyonel Dans\xe7ılık",950:"Profesyonel G\xf6rg\xfc Kuralları",951:"Profesyonel Şovmenlik",971:"Distilasyon 101",1024:"G\xfcn\xfcm\xfcz \xc7ift\xe7iliği",1040:"Puro \xdcretimi",1072:"Kazıma Sanatı",1076:"T\xfct\xfcn Kimyası",1079:"Pastacılığın Kutsal El Kitabı",1156:"Ebeveynin El Kitabı",1220:"Balık\xe7ılık",1226:"Biyokimya 101",1227:"Peynirciliğin \xd6z\xfc",1353:"Şapkacının Kutsal Kitabı",1534:"Yeni Başlayanlar İ\xe7in Miksoloji",1666:"Temel Raket Sporları",1667:"Temel Voleybol",1668:"Temel Futbol",2178:"Temel Basketbol"}},7:{n:"M\xfccevherat",i:{573:"Saat",575:"Y\xfcz\xfck, B\xfcy\xfck",576:"Y\xfcz\xfck, K\xfc\xe7\xfck",580:"Kolye",581:"Bilezik",912:"Nişan Y\xfcz\xfcğ\xfc",2317:"G\xfc\xe7 Y\xfcz\xfcğ\xfc",2318:"Şans Tılsımı",2319:"Elmas Choker",2320:"Zaman D\xf6nd\xfcr\xfcc\xfc Kolye",2321:"Dil Piercing'i",2322:"G\xf6bek Piercing'i",2347:"Hatıra Madalyonu"}},10:{n:"Ayakkabılar",i:{48:"Asker Botu",60:"Y\xfcksek Topuklu Ayakkabı",65:"Spor Ayakkabı",235:"Disko Ayakkabısı",236:"Kovboy \xc7izmesi",287:"Maymun Terlik",365:"Ay Botu",582:"Bağcıklı Ayakkabı",583:"Sandalet",584:"Bot",585:"Ayakkabı",603:"Parmakarası Terlik",704:"Diz Boyu \xc7izme",1067:"Yarış Ayakkabısı",1324:"Bale Ayakkabısı",1335:"Yağmur \xc7izmesi",1376:"Makosen Ayakkabı"}},13:{n:"Oyuncaklar",i:{133:"CD Alb\xfcm",134:"CD Single",168:"Cadılar Bayramı Canavar Maskesi",206:"K\xfc\xe7\xfck Havai Fişek Kutusu",250:"Piknik Sepeti",297:"MP3 \xc7alar",302:"Karaoke",303:"Kam\xe7ı",304:"Oyuncak Kelep\xe7e",310:"Ayıcık",311:"Oyuncak Bebek",312:"İskambil Kağıtları",555:"B\xfcy\xfcte\xe7",646:"Bur\xe7",657:"Pinyata",689:"Kalitesiz Hediyelik Minyat\xfcr",720:"Maske",1045:"Pastel Boya",1046:"Boyama Kitabı",1181:"Palya\xe7o Burnu",1259:"Parlayan \xc7ubuk",1348:"PİNG! Sesi \xc7ıkaran Cihaz",1351:"Sahne Makyaj Seti",1355:"Oyuncak Kılı\xe7",1356:"Oyuncak Tabanca",1375:"Rubik K\xfcp\xfc",1377:"Hulahop",1441:"\xd6zg\xfcrl\xfck Anıtı Havai Fişekleri",1661:"Şişme Simit",1662:"Şişme Yatak",1663:"Plaj Oyun Seti",1870:"\xc7ocuklar İ\xe7in Doğum G\xfcn\xfc Pinyatası",2005:"10 Y\xfczl\xfc Zar",2118:"Pankart (Kraken'i Kurtar!)",2119:"Pankart (Kraken'i \xd6ld\xfcr!)"}},22:{n:"Kıyafet (Şapka)",i:{52:"Beyzbol Şapkası",73:"Bandana",229:"Y\xfcksek Şapka",271:"Sa\xe7 Bandı",371:"Fransız Bere",531:"Kovboy Şapkası",567:"Kasket",708:"Peruk",1044:"Yarış Kaskı",1054:"Melon Şapka",1084:"Fırıncı Şapkası",1184:"Sombrero",1323:"Kask",1352:"Şapka",1360:"\xc7i\xe7ek Tacı",1437:"Folyo Şapka",1647:"Hasır Plaj Şapkası",2180:"Jeanne'in Muhteşem Peruğu"}},24:{n:"Kıyafet (Pantolon)",i:{25:"Kot Pantolon",40:"Tayt",43:"Dar, Mini Şort",272:"Bisiklet\xe7i Şortu",556:"Pantolon, Dar",566:"Pantolon, Bol",586:"Golf Pantolonu",587:"Pantolon",1052:"Takım Pantolonu",1183:"Bağcıklı Pantolon",1232:"Smokin Pantolonu",1297:"Pijama Altı",1327:"Tulum",1334:"Şort Mayo"}},25:{n:"Kıyafet (İ\xe7 \xc7amaşırı)",i:{58:"K\xfclotlu \xc7orap",284:"G-String İ\xe7 \xc7amaşırı",285:"Dede İ\xe7 \xc7amaşırı",286:"Babaanne İ\xe7 \xc7amaşırı",570:"Boxer",571:"Slip",636:"Korse",705:"S\xfctyen",707:"Bikini",1068:"File \xc7orap",1180:"K\xfclot",1359:"Jartiyer"}},27:{n:"Ev Hayvanları",i:{374:"Greyhound",375:"Kedi",376:"Hamster",377:"Papağan",378:"Timsah",379:"Gine Domuzu",380:"Maymun",381:"At",382:"Cocker Spaniel",383:"Labrador",384:"Chihuahua",385:"Beagle",386:"Rottweiler",387:"Domuz",388:"Tavşan",389:"Kanarya",589:"Fil",695:"Panda",1383:"C\xfcce Jerboa"}},42:{n:"Elektronik",i:{523:"Fotoğraf Makinesi",525:"Fotoğraf Filmi (35 mm)",526:"Polaroid Makine",527:"Fotoğraf Filmi (Polaroid Makine)",528:"Orta Format Fotoğraf Makinesi (80 mm)",529:"Fotoğraf Filmi (80 mm)",553:"Sessiz Hırsız Alarmı",659:"Yangın Alarmı",1361:"Kamera",1385:"Diz\xfcst\xfc Bilgisayar",1387:"Masa\xfcst\xfc Bilgisayarı",1410:"Unikon Tek Par\xe7a Dijital Fotoğraf Makinesi"}},47:{n:"Tıbbi Malzeme",i:{506:"Ağrı Kesici",537:"Adrenalin İğnesi",608:"Kan \xd6rneği Alıcı",611:"İla\xe7 Ham Maddesi",631:"Aşı",632:"Hemşire Elbisesi",706:"Ertesi G\xfcn Hapı",906:"Gebelik Testi",932:"Şırınga Kutusu"}},49:{n:"Sosyal Kul\xfcp Eşyaları",i:{622:"Barış \xc7ubuğu",635:"Savaş Baltası"}},51:{n:"Aletler",i:{532:"Kement",719:"Bı\xe7ak",737:"Bavul",738:"Sandık",744:"Baston",747:"Mum",749:"T\xfcts\xfc",759:"Dikiş Makinesi",764:"Ekmek Kızartma Makinesi",765:"Elektrikli S\xfcp\xfcrge",766:"\xc7eki\xe7",767:"Tornavida",768:"\xdct\xfc",770:"Fener",783:"Hayvan Kafesi",789:"B\xf6cek Ağı",890:"Kazma",905:"Değirmen",928:"Elektrikli Testere",957:"\xc7aydanlık",958:"Gezici Kimya Laboratuvarı Takımı",963:"Chaveta",970:"İmbik",1008:"Eski Fı\xe7ı",1023:"Kova",1025:"Tahta",1026:"Arı Kovanı",1028:"Arıcı Şapkası",1029:"Kavanoz",1037:"Tırmık",1048:"Sahan",1049:"Nargile",1060:"Biberon",1061:"Şemsiye",1089:"Yayık",1143:"Kasap Bı\xe7ağı",1163:"Tava",1164:"T\xfcts\xfc Kabı",1230:"\xc7ırpı",1245:"Kızartıcı",1246:"Termometre",1254:"Izgara",1257:"Tuvalet Kağıdı",1265:"P\xfcrm\xfcz",1266:"D\xfcrb\xfcn",1269:"Olta",1280:"Mutfak Şırıngası",1285:"Sepet",1312:"Bombilla",1372:"İsvi\xe7re Ordu \xc7akısı",1373:"Selobant",1378:"Sigara Sarma Kağıdı",1454:"Kokteyl \xc7alkalayıcı",1455:"Havan",1456:"Bar Kaşığı",1557:"K\xfcrek",1565:"Meşale"}},52:{n:"Ara\xe7lar",i:{436:"Yangın S\xf6nd\xfcrme T\xfcp\xfc",678:"Benzin Bidonu",681:"Hava Kirliliği Dedekt\xf6r\xfc",682:"Akifer Kapasite Sorgulama Paketi",683:"Akifer Kalite Sondası",746:"Bez",920:"Kulak Tıkacı",954:"\xd6zel Boya",960:"Distile Su",995:"K\xf6m\xfcr"}},55:{n:"Sanat Malzemeleri",i:{67:"Sprey Boya Kutusu",71:"Baskı Kalıbı"}},56:{n:"Makyaj",i:{59:"Basit Makyaj Seti",1649:"G\xfcneş Kremi"}},58:{n:"Aksesuarlar",i:{244:"Rozet (Say NO to violence)",277:"Dikenli Bileklik",572:"G\xfcneş G\xf6zl\xfcğ\xfc",574:"Burun M\xfccevheri",577:"K\xfcpe, K\xfc\xe7\xfck",578:"K\xfcpe, B\xfcy\xfck",579:"K\xfcpe, Pejm\xfcrde",700:"Rozet",1059:"Battaniye",1195:"G\xf6zl\xfck",1258:"Otriş",1393:"Mendil",1409:"Erkek \xc7antası",1432:"Ponponlar",1838:"Altın Madalya",1839:"G\xfcm\xfcş Madalya",1840:"Bronz Madalya",2293:"Y\xfcz Maskesi"}},60:{n:"Doğal \xdcr\xfcnler",i:{1349:"T\xfcy"}},61:{n:"Hayvanlar",i:{391:"Tapir",714:"İnek",716:"Karga",727:"Aslan",733:"Kartal",736:"Jibon",740:"Kunduz",741:"Rakun",742:"Yarasa",743:"Sı\xe7an",773:"Kanguru",774:"Opossum",775:"Dingo",776:"Koala",781:"Geyik",784:"Sincap",785:"Emu",786:"Ornitorenk",787:"Şahin",788:"Kutup Porsuğu",792:"Kurbağa",866:"Jaguar",867:"Karıncayiyen",868:"Tukan Papağanı",877:"Armadillo",878:"Kirpi",879:"K\xf6stebek",880:"Fok",881:"Deve",882:"Lama",883:"Amerikan Geyiği",885:"Dağ Ke\xe7isi",1041:"Tavuk",1043:"Horoz",1055:"Boa Yılanı",1056:"Kertenkele",1057:"Oselo",1058:"Tembel Hayvan",1078:"Kaplumbağa",1138:"Dişi Ke\xe7i",1139:"Teke",1140:"Dişi Koyun",1141:"Ko\xe7",1142:"Boğa",1149:"Puma",1150:"Akbaba",1151:"Sinek Kuşu",1152:"Su Samuru",1238:"Dişi Domuz",1239:"Erkek Domuz",1286:"Deve Kuşu",1295:"Gelincik",1300:"Antilop",1302:"Tilki",1303:"Semender",1321:"Kurt",2308:"Atmaca"}},62:{n:"B\xf6cekler",i:{731:"Sivrisinek",732:"Yusuf\xe7uk",790:"Kelebek",791:"\xd6r\xfcmcek",793:"Solucan",794:"\xc7ekirge",795:"Karab\xf6cek",796:"Arı",797:"Karınca",798:"Peygamberdevesi",800:"Sinek",801:"Dal B\xf6ceği",802:"B\xf6cek",803:"Eşek Arısı",804:"Tırtıl",805:"G\xfcve",806:"Bit",807:"Hamamb\xf6ceği",808:"Termit",809:"Akrep",824:"Kene",849:"Kurt\xe7uk",891:"Cırcır B\xf6ceği",892:"G\xfcm\xfcş\xe7\xfcn",893:"Su Biti",894:"Kulağaka\xe7an",895:"Su Kelebeği",896:"Pire",897:"Karıncaaslanı",898:"Dantelkanat",899:"Mantispidis",900:"Kırkayak",2073:"Nemf"}},63:{n:"Bitkiler",i:{782:"Zambak",810:"G\xfcl",811:"Orkide",812:"Devedikeni",813:"S\xfcmb\xfcl",814:"Fesleğen",815:"Ay\xe7i\xe7eği",817:"Okaliptus",818:"Eğreltiotu",819:"Sarımsak",820:"Kakao",821:"Koka",822:"G\xfclhatmi",823:"Adamotu",825:"Kırmızı Yaban \xdcz\xfcm\xfc",826:"Mor Yaban \xdcz\xfcm\xfc",827:"\xc7am Kozalağı",828:"Lotus",829:"Horoz İbik \xc7i\xe7ekli Mercan Ağacı",830:"Kayın",831:"M\xfcge",833:"Yonca",834:"Tabebuia",835:"S\xfcp\xfcrge Otu",836:"\xc7an \xc7i\xe7eği",837:"Sedef Otu",838:"S\xfcsen",839:"Kestane",840:"Lavanta",841:"Guava \xc7ileği",842:"Gelincik",843:"Peygamber \xc7i\xe7eği",844:"Lale",845:"Erik",847:"Kenevir",850:"Kahve Tohumu",851:"Biber",852:"Defne",853:"Zufa Otu",855:"Papatya",856:"Karahindiba",857:"Rezene",859:"Hatmi \xc7i\xe7eği",860:"Yasemin",861:"Ardı\xe7",862:"Limon Otu",863:"Meyan K\xf6k\xfc",864:"Isırgan Otu",865:"Muskat",869:"\xc7uha \xc7i\xe7eği",870:"Riberry",871:"Susam",872:"Soya",873:"Kedi Otu",874:"Vasabi",875:"A\xe7elya",965:"T\xfct\xfcn",974:"Sabır Otu",975:"\xdcz\xfcm",979:"Elma",983:"Anason",1005:"Şekerkamışı",1010:"Tar\xe7ın",1011:"Hindistan Cevizi",1014:"Kiraz",1016:"Karaman Kimyonu",1017:"Mısır",1031:"Şerbet\xe7iotu",1035:"S\xfcp\xfcrge Darısı",1063:"\xc7ay Yaprakları",1085:"Zencefil",1087:"Fıstık",1090:"Vanilya",1091:"Badem",1096:"Fındık",1102:"Ceviz",1110:"Kayısı",1111:"\xc7ilek",1114:"Ahududu",1116:"Armut",1119:"Limon",1121:"Pekan Cevizi",1125:"Bal Kabağı",1128:"Yaban Mersini",1129:"Muz",1133:"Hardal Tohumu",1134:"Ginseng",1148:"Karanfil",1155:"\xd6kseotu",1158:"Ananas",1187:"Karabiber",1194:"Fasulye",1196:"Acı Biber",1222:"Nane",1224:"Maydanoz",1240:"Portakal",1250:"\xc7am Fıstığı",1253:"Şalgam",1256:"Patlıcan",1260:"Safran",1261:"Bezelye",1268:"Yaban Kekiği",1278:"Nohut",1281:"Yosun",1287:"Kişniş",1293:"Kuşburnu",1304:"\xc7in Sarımsağı",1305:"Keklikotu",1309:"Kekik",1315:"Marula",1317:"Misket Limonu",1318:"Lahana",1445:"B\xf6ğ\xfcrtlen",1446:"Frenk \xdcz\xfcm\xfc",1447:"Kızılcık",1448:"Kantaron K\xf6k\xfc",1452:"Turba K\xf6m\xfcr\xfc",1559:"Zeytin"}},64:{n:"Spor Malzemeleri",i:{280:"Basket Topu",281:"Amerikan Futbolu Topu",282:"Futbol Topu",283:"Beyzbol Topu",305:"Snowboard",306:"Kaykay",591:"Paten",1660:"Plaj Topu",1664:"Voleybol Topu",1665:"Tenis Raketi",1672:"Dalış Ekipmanı",2405:"B\xfcy\xfcl\xfc Ok\xe7uluk Puan \xc7izelgesi"}},65:{n:"Kimyasallar",i:{888:"Sodyum Karbonat",1136:"Peynir Mayası",1225:"Bakteri K\xfclt\xfcr\xfc",1288:"Bitkisel Distilat",1294:"Kaşıntı Tozu"}},66:{n:"Ağa\xe7lar",i:{816:"Mersin Ağacı",832:"Meşe",858:"Mabet Yaprağı"}},67:{n:"Silahlar",i:{694:"Av T\xfcfeği",698:"T\xfcfek Kovanları",919:"Zombi Takip Cihazı"}},68:{n:"Bakkaliye",i:{357:"Pasta Kreması",959:"Susam Yağı",973:"Şeker",981:"Pirin\xe7",1006:"Maya",1019:"Buğday",1020:"\xc7avdar",1021:"Arpa",1022:"Malt",1027:"Bal",1042:"Yumurta",1047:"Şurup",1069:"S\xfct",1081:"Un",1082:"Kabartma Tozu",1083:"Kuru \xdcz\xfcm",1086:"Yulaf Unu",1088:"Tereyağı",1092:"Tuz",1094:"Yufka",1100:"Ekmek",1101:"Zeytinyağı",1105:"Badem Ezmesi",1112:"\xc7ikolata",1120:"Jelatin",1122:"Sirke",1123:"Gıda Boyası",1135:"Hardal",1137:"Peynir",1146:"İ\xe7 Yağı",1153:"Fıstık Ezmesi",1154:"Fındıklı \xc7ikolata Macunu",1171:"Pul Biber",1172:"Şehriye",1174:"Tofu",1175:"Sarımsak Sosu",1176:"Soya Sosu",1189:"Pudra şekeri",1221:"Yoğurt",1229:"Mayonez",1234:"Sosis",1235:"Hayvan Bağırsağı",1237:"Domuz Yağı",1241:"Re\xe7el",1242:"Pektin",1244:"Kahve (Kavrulmuş)",1248:"İtalyan Makarnası",1249:"\xc7eşni",1255:"Ekşi Krema",1263:"Maskarpon",1290:"Nişasta",1316:"Hindistan Cevizi S\xfct\xfc",1319:"Lahana Turşusu",1330:"Ekşi Hamur",1331:"Konserve Balık"}},72:{n:"Yemekler",i:{26:"Hotdog",119:"Biftek",120:"Salata",261:"Hamburger",262:"Pizza",315:"Tortilla",1131:"Sandvi\xe7",1161:"Elvis Sandvi\xe7i",1185:"Yemek",1429:"Izgara Tavuk"}},73:{n:"Mezeler",i:{408:"Rus Havyarı",771:"Bir Tomar Havu\xe7",980:"Bir Paket \xc7erez",986:"Tuzlu Fıstık",987:"Kavrulmuş Fıstık",988:"Popcorn",989:"Kurutulmuş Et",990:"Kraker",991:"Tortilla Cipsi",992:"\xc7ubuk Kraker",993:"Pamko",1277:"Egzotik Atıştırmalık",1301:"Abur Cubur"}},74:{n:"Şekerleme",i:{207:"Kalp Şeklinde Kutulanmış \xc7ikolata",314:"Doğum G\xfcn\xfc Pastası",760:"Dondurma",1077:"Sakız",1080:"Kurabiye",1093:"Baklava",1098:"İsko\xe7 Kurabiyesi",1099:"Zencefilli Kurabiye",1103:"Strudel",1104:"Brownie",1109:"Kek",1117:"Meyveli Pasta",1118:"Tatlı Turta",1124:"Tart",1127:"Muffin",1157:"\xc7ikolata",1159:"Karamelli Şeker",1188:"Bisk\xfcvi",1190:"Brioche",1264:"Tatlı",1267:"Hamur İşi",1289:"Şekerleme",1314:"Noel Yemeği",1443:"Lolipop",1946:"Ev Yapımı Doğum G\xfcn\xfc Pastası"}},76:{n:"Sert İ\xe7kiler",i:{253:"Brandy",407:"Stolichnaya Votka",512:"Absinthe",969:"Tekila",972:"Ka\xe7ak İ\xe7ki",976:"Grappa",978:"Eau-de-vie",982:"Sake",984:"Rakı",985:"Sambuca",994:"Jenever",996:"Votka",997:"Cin",1007:"Rom",1009:"J\xe4germeister",1012:"Malibu Rom",1013:"Schnaps",1015:"Akvavit",1018:"Burbon",1032:"Calvados",1033:"Metaksa",1034:"Slivovitz",1036:"Baijiu",1095:"İtalyan Lik\xf6r\xfc",1115:"P\xe1linka",1160:"Cacha\xe7a",1233:"\xdcz\xfcml\xfc Brandy",1243:"Lik\xf6r",1247:"Uzo",1465:"Acı Kokteyl Sosu",1466:"Benedictine",1467:"Campari",1468:"Kuş \xdcz\xfcm\xfc",1469:"Chambord",1470:"Kirazlı Brandy",1471:"Siyah Rom",1472:"Galliano",1473:"Kantaron",1474:"İrlanda Viskisi",1475:"Kahlua",1476:"Şeftalili Schnapps",1477:"Vermouth",1478:"Rosso Vermouth",1479:"Viski",1532:"Elmalı Schnapps",1533:"Fransız Portakal Lik\xf6r\xfc",2076:"Plaintain'in Porto Şarabı",2077:"Cin Darısı"}},77:{n:"Şarap ve Bira",i:{10:"Bardak Bira",109:"Kırmızı Şarap",256:"Beyaz Şarap",257:"Şampanya",264:"Breezer",403:"6'lık bira",977:"Elma Şarabı",1030:"Bal Şarabı",1144:"Gl\xfchwein",1145:"Eggnog",1236:"En M\xfckemmel Şampanya",1415:"Porto Şarabı"}},78:{n:"Alkols\xfcz İ\xe7ecekler",i:{258:"Limonata",259:"Pembe Gazoz",260:"Soda",998:"Tonik",999:"Meyve Suyu",1e3:"Diet Cola",1001:"Pop Cola",1002:"Melvin Cola",1003:"Gazoz",1291:"Alkols\xfcz İ\xe7ecek"}},79:{n:"İ\xe7ecekler (Sıcak)",i:{1062:"Sıcak \xc7ikolata",1064:"\xc7ay",1313:"Sıcak İ\xe7ecek"}},81:{n:"T\xfct\xfcn \xdcr\xfcnleri",i:{964:"Puro",1071:"Nargile T\xfct\xfcn\xfc",1292:"Snus",1374:"Sigara"}},83:{n:"Et",i:{1130:"Jambon",1162:"Domuz Pastırması",1165:"Quorn",1166:"Domuz Eti",1167:"Sığır Eti",1168:"Tavuk Eti",1186:"Kuzu eti",1191:"Sığır Eti Kıyması",1251:"Terbiyeli Et",1252:"Sakatat",1262:"S\xfct Dana Eti",1279:"Tavşan Eti"}},84:{n:"Meyve ve Sebzeler",i:{937:"Domates",1173:"Soğan",1177:"Soya Fasulyesi",1192:"Patates",1193:"Marul",1223:"Salatalık",1449:"Greyfurt",1450:"\xc7arkıfelek Meyvesi",1451:"Şeftali",1453:"Nar"}},85:{n:"Balık",i:{1169:"Somon",1170:"Ton Balığı",1197:"Karides",1198:"Midye",1199:"Kalamar",1200:"Hamsi",1201:"Aynalı Sazan",1202:"Kedi Balığı",1203:"Morina",1204:"Yılan Balığı",1205:"Mezgit",1206:"Ringa",1207:"Uskumru",1208:"Sardalya",1209:"Mercan Balığı",1210:"Alabalık",1211:"Pisi Balığı",1212:"K\xf6m\xfcr Balığı",1213:"G\xfcm\xfcş Mezgit",1214:"Mersin Balığı",1215:"Kalkan Balığı",1216:"Kılı\xe7 Balığı",1217:"Tilefish",1218:"Fenerbalığı",1219:"Kobia",1270:"Sudak Balığı",1271:"Turna Balığı",1272:"Orfoz",1273:"Levrek",1274:"Kadife Balığı",1275:"Tatlısu Levreği",1282:"Denizkestanesi",1283:"Sarı Kuyruk",1308:"Kerevit"}},87:{n:"Konfeksiyon Malzemeleri",i:{750:"Dikiş Takımı",1228:"\xc7aput",1325:"Bir Top Kumaş",1328:"D\xfcğme",1329:"İplik",1337:"K\xfcrk",1340:"Bir Top \xd6zel Kumaş",1341:"Toka",1342:"Deri",1344:"Boncuk",1345:"Kurdele",1346:"Bir Top İnce Kumaş",1347:"Dantel",1357:"\xd6r\xfclm\xfcş Kamış",1358:"P\xfcsk\xfcl"}},93:{n:"Bebek Eşyaları",i:{614:"\xc7ocuk Bezi"}},94:{n:"Doğum Kontrol\xfc ve Korunma",i:{130:"Prezervatif Kutusu"}},100:{n:"Kokteyller",i:{1480:"Americano",1481:"Elmalı Manhattan",1482:"Elmalı Martini",1483:"Between the Sheets",1484:"Black Russian",1485:"Blood and Sand",1486:"Bloody Mary",1487:"Yabanmersinli Martini",1488:"Bobby Burns",1489:"Bronx",1490:"Buck's Fizz",1491:"Caipirinha",1492:"Cosmopolitan",1493:"Cuba Libre",1494:"Daiquiri",1495:"Dutch Courage",1496:"Eclipse",1497:"El Diablo",1498:"Fransız Martinisi",1499:"Cin Tonik",1500:"Gimlet",1501:"Godfather",1502:"Harvey Wallbanger",1503:"Hanımelili Daiquiri",1504:"Hot Toddy",1505:"Hurricane",1506:"İrlanda Kahvesi",1507:"Long Island Iced Tea",1508:"Manhattan",1509:"Martini",1510:"Margarita",1512:"Naneli Şurup",1513:"Mojito",1514:"Moscow Mule",1515:"Negroni",1516:"Old-Fashioned",1517:"Pi\xf1a Colada",1518:"Ahududulu Martini",1519:"Rob Roy",1520:"Sangria",1521:"Screwdriver",1522:"Seabreeze",1523:"Sex on the Beach",1524:"Sidecar",1525:"Singapore Sling",1526:"\xc7ilekli Daiquiri",1527:"Tequila Sunrise",1528:"Whiskey Daisy",1529:"Woo Woo",1530:"Shirley Temple",1560:"Dry Martini",2074:"Ateş ve Barut",2075:"Karasakal'ın Romu"}},101:{n:"Kokteyl İ\xe7erikleri",i:{1458:"Şerbet",1459:"Kızılcık Suyu",1460:"Zencefil Birası",1461:"Nar Şurubu",1462:"Misket Limonu Lik\xf6r\xfc",1463:"\xc7arkıfelek Şurubu",1464:"Worcestershire Sosu"}},108:{n:"Mayo",i:{1642:"Slip Mayo",1643:"Tek Par\xe7a Mayo",1644:"Şort Mayo",1645:"Bone",1646:"Retro Mayo",1648:"Plaj Havlusu"}},113:{n:"Mobilya",i:{1696:"Koltuk",1697:"Komodin",1698:"Kitaplık",1699:"Ranza",1701:"Sandalye",1703:"Chesterfield Kanepe",1704:"Kahve Sehpası",1705:"Modern Yatak",1706:"İkiz Yatak",1707:"Yemek Masası",1708:"Vitrin",1710:"D\xf6rt Direkli Yatak",1711:"Mutfak Masası",1712:"İkili Kanepe",1714:"Sallanan Sandalye",1718:"Par\xe7alı Kanepe",1719:"B\xfcfe",1720:"Kanepe",1721:"\xc7ekyat",1723:"Tabure",1725:"Duvar Rafı",1726:"Su Yatağı",1770:"Ş\xf6mine"}},116:{n:"Ev Aletleri",i:{1727:"K\xfcvet",1728:"Bira Dolabı",1729:"Bide",1730:"Kahve Makinesi",1731:"Set \xdcst\xfc Ocak",1732:"Frit\xf6z",1733:"Bulaşık Makinesi",1734:"Kurutucu",1735:"Derin Dondurucu",1737:"Mikrodalga Fırın",1738:"Fırın",1739:"Buzdolabı",1740:"Duş",1741:"Ocak",1742:"Klozet",1743:"\xc7amaşır Kurutma Makinesi",1744:"\xc7amaşır Makinesi",1745:"Elektrikli Su Isıtıcısı"}},117:{n:"Konut İ\xe7i",i:{1700:"Tavan Lambası",1702:"Avize",1709:"Lambader",1713:"Oval Kilim",1715:"Yuvarlak Kilim",1716:"Yolluk",1717:"Denizcinin Sandığı",1722:"Kare Kilim",1724:"Duvar Lambası",1756:"Akvaryum",1757:"Kuş Kafesi",1759:"Şamdan",1760:"Mum",1761:"Alt Değiştirme Masası",1762:"Satran\xe7 Seti",1763:"Ufak Hayvan Kafesi",1764:"Perde",1765:"Minder",1766:"Disko Topu",1767:"Yoga Minderi",1768:"K\xf6pek Sepeti",1769:"Aile Fotoğrafı",1771:"Ybox 180 Oyun Konsolu",1772:"D\xfcz Ekran TV",1773:"Yer Bitkisi",1775:"PrayStation Oyun Konsolu",1776:"Home Gym 1000",1778:"Sulu Boya Tablo",1779:"Ev Sineması Sistemi",1780:"Kedi Ağacı",1781:"M\xfccevher Kutusu",1782:"Lav Lambası",1785:"Yağlı Boya Tablo",1786:"Bitki",1787:"Ayna",1788:"Bilardo Masası",1789:"Baskı Poster",1790:"Sallanan At",1791:"B\xfcst",1792:"Stereo Sistemi",1793:"Oyuncak Sandığı",1794:"Teraryum",1835:"B\xfcy\xfck Alabalık Heykeli",2330:"GameStation 5"}},118:{n:"Konut Dışı",i:{1746:"K\xf6m\xfcr Izgara",1747:"K\xf6pek Kul\xfcbesi",1748:"\xc7eşme",1749:"Bah\xe7e C\xfccesi",1750:"Gazlı Izgara",1752:"\xc7im Bi\xe7me Makinesi",1754:"Veranda Mobilyası",1755:"Oyun Evi"}},122:{n:"Hediye Kartları",i:{956:"Sevgililer G\xfcn\xfc Kartı",1871:"Doğum G\xfcn\xfc Kartı",1872:"M\xfczikli Doğum G\xfcn\xfc Kartı",1968:"Mariachi M\xfczisyenleri",1969:"Sihirbaz G\xf6sterisi",1970:"Y\xfcz Boyama Sanat\xe7ısı",1971:"Polis \xdcniformalı Striptizci",1972:"S\xfcrprizli Pasta",1973:"\xd6zel Aş\xe7ı",2386:"Elle Yazılmış Kart"}}}}};

let locales = {
    en: {
        boxTitle: "Item Category Searcher",
        text1: "How many items should be displayed at most:",
        text2: "Search by regular expression:",
        warning1: (a) => `You must enter at least ${a} characters...`,
        warning2: "No items are matched!",
        info1: (a) => `${a} Items are matched;`,
        info2: "Hover over the item you're looking to buy, then click on the button that will appear.",
        info3: (a, b) => `You can currently search among a total of <b>${a}</b> objects across <b>${b}</b> categories registered in the script.`,
        buyButton: "Buy",
        headerItem: "Item",
        headerCategory: "Category",
    },
    tr: {
        boxTitle: "Eşya Kategorisi Bulma",
        text1: "En fazla kaç eşya gösterilsin:",
        text2: "Düzenli ifadeye göre ara:",
        warning1: (a) => `En az ${a} karakter girmelisiniz...`,
        warning2: "Eşleşen eşya yok!",
        info1: (a) => `${a} Eşya bulundu;`,
        info2: "Satın almak için aradığınız eşyanın üzerine gelin, daha sonra belirecek olan butona tıklayınız.",
        info3: (a, b)=> `Şuan da script üzerinde kayıtlı <b>${b}</b> kategoriden toplam <b>${a}</b> nesne arasından arama yapabiliyorsunuz.`,
        buyButton: "Satın al",
        headerItem: "Eşya",
        headerCategory: "Kategori",
    },
};


const selectors = {
    "matchedItem": "matched-item",
    "shoppingData": "shopping-data"
};

jQuery(unsafeWindow.document).ready(() => {

    const [locale, localDB] = ((e) => {
        //Get locale
        if (!e.length) stopScript(new Error("Could not detect language!"));
        let langKey;
        switch (e.text().trim()) {
            case "Hoş Geldiniz!":
                langKey = "tr";
                break;
            case "Welcome":
                langKey = "en";
                break;
            default:
                stopScript(new Error("An incompatible game language is used for the script!"));
                break;
        }

        if (!locales.hasOwnProperty(langKey)) stopScript(new Error(`Only supported game languages listed are: ${Object.keys(locales)}`));

        return [locales[langKey], db[langKey]];
    })(FindElementEndsWithID("_ucMenu_lnkStart"));
    locales = db = undefined;

    ((e) => {
        if (!e.length) stopScript(new Error("Could not get required dom element!"));

        const div = jQuery('<div class="box">').html(`<h2>${locale.boxTitle}</h2>`);

        const p1 = jQuery(`<p style="margin-bottom:3px;">`);
        const catCount = Object.keys(localDB.categories).length;
        unsafeWindow.locale = locale;
        const totalItemCount = Object.values(localDB.categories).reduce((acc, cat)=> acc + Object.keys(cat.i).length, 0);
        p1.append(`<p>${locale.info3(totalItemCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), catCount.toString())}</p>`);
        p1.append(`${`${locale.text1} `}`);
        const maxMatchedItemSize = jQuery(`<input type="range" min="1" max="50" step="1" value="25" style="vertical-align:middle;" oninput="jQuery(this).next().html(this.value)">`).appendTo(p1);
        p1.append(`<font color="gray">25</font>`);
        p1.appendTo(div);

        const p2 = jQuery(`<p>`).html(`${locale.text2} `);
        const span = jQuery(`<span style="border: 1px solid black; padding: 2px; background-color: white; margin-right: 2px; user-select:none; ">`);
        span.append(`<font color="gray"><b>/</b></font>`);
        const regexString = jQuery(`<input type="text" style="border: none;">`).appendTo(span);
        span.append(`<font color="gray"><b>/</b></font>`);
        const regexFlags = jQuery(`<input type="text" value="gi" style="border: none; width:45px;">`).appendTo(span);
        span.appendTo(p2);
        p2.appendTo(div);

        const itemsList = jQuery(`<p style="display:none; margin-top:10px;">`).html(`Items are listed here`).appendTo(div);

        div.insertBefore(e.parents("div.box").first());

        regexFlags.keydown(function (e) {
            //controlling the keys entered
            let key = e.key.toLowerCase();
            if (key.length != 1) return;

            if (e.ctrlKey) {
                if (["v", "z"].includes(key)) e.preventDefault();
                return;
            }

            e.preventDefault();

            if ("gimsuy".indexOf(key) == -1) return;

            let target = e.target,
                start = target.selectionStart,
                end = target.selectionEnd,
                oldValue = target.value;

            if ((oldValue.slice(0, start) + oldValue.slice(end)).indexOf(key) != -1) return;

            target.value = oldValue.slice(0, start) + key + oldValue.slice(end);
            target.selectionStart = target.selectionEnd = start + 1;
        });

        maxMatchedItemSize.change(function () {
            searchItems();
        });

        jQuery(regexString).add(regexFlags).keyup(searchItems);

        let buyButton = jQuery(`<span style="margin-left: 3px; vertical-align: middle; cursor: pointer; display: inline-block; color: green; font-weight: bold; padding: 2px 4px; background: black; border-radius: 10px;">`).html(locale.buyButton);

        itemsList.append(buyButton);

        itemsList
            .on("mouseenter", `.${selectors.matchedItem}`, function () {
            buyButton.css({ display: "inline-block" }).detach().appendTo(jQuery('>td:last', this));
            buyButton.click(OnBuyButtonClick);
        })
            .on("mouseleave", `.${selectors.matchedItem}`, function () {
            buyButton.css({ display: "none" });
            buyButton.off("click", OnBuyButtonClick);
        });



        function searchItems() {
            try {
                let regexText = regexString.val().trim(),
                    regexFlagsText = regexFlags.val().trim(),
                    minLength = 2;

                if (regexText.length < minLength) {
                    itemsList.html(`<b><font color="#007bff">${locale.warning1(minLength)}</font></b>`).show();
                    return;
                } else {
                }

                let regex = RegExp(regexText, regexFlagsText);

                let maxItemCount = maxMatchedItemSize.val() || 25;
                if (isNaN(maxItemCount)) maxItemCount = 25;
                else maxItemCount = parseInt(maxItemCount);

                let break_loops = false,
                    foundedItems = [];
                for (let categoryId in localDB.categories) {
                    let items = localDB.categories[categoryId].i;
                    for (let itemId in items) {
                        let searchIndex = items[itemId].search(regex);
                        if (searchIndex == -1) continue;
                        foundedItems.push({
                            si: searchIndex,
                            n: items[itemId],
                            i: itemId,
                            ci: categoryId,
                            cn: localDB.categories[categoryId].n,
                        });

                        if (foundedItems.length >= maxItemCount) {
                            break_loops = true;
                            break;
                        }
                    }
                    if (break_loops) break;
                }

                if (foundedItems.length) {
                    foundedItems.sort((a, b) => a.si - b.si);

                    itemsList.html(`<b>${locale.info1(foundedItems.length)}</b><div class="box">${locale.info2}</div>`).show();
                    var table = jQuery(`<table class="data sortable">`);
                    table.html(`<thead><tr><th></th><th>${locale.headerItem}</th><th>${locale.headerCategory}</th><th>Action</th></tr></thead>`);
                    var tbody = jQuery("<tbody>").appendTo(table);
                    foundedItems.forEach((item, i) => {
                        let text = item.n.replace(regex, (match) => {
                            return `<b><font color="red">${match}</font></b>`;
                        });
                        tbody.append(
                            `<tr class="${selectors.matchedItem}" style="margin:0; height:15px;" ${selectors.shoppingData}="${item.ci}_${item.i}">`+
                            `   <td>${i+1}</td>`+
                            `   <td style="color:green">${text}</td> `+
                            `   <td style="color:darkblue">${item.cn}</td>` +
                            `   <td></td>`+
                            `</tr>`
                        );
                    });
                    table.appendTo(itemsList);

                    if(table.tablesorter == null){
                        jQuery("<script src=\"/Static/JS/jQuery/jquery.tablesorter.2.0.5.min.js\">").appendTo(document.head);
                    }
                    table.tablesorter({ widgets: ["zebra"], cssAsc: "headerAsc", cssDesc: "headerDesc", cssHeader: "header" });
                    foundedItems = undefined;
                } else itemsList.html(`<b><font color="maroon">${locale.warning2}</font></b>`).show();
            } catch (err) {
                console.error(err.message);
            }
        }

        function OnBuyButtonClick() {
            const parent = jQuery(this).parents(`.${selectors.matchedItem}:first`);
            if(!parent.hasClass(selectors.matchedItem)){
                console.error("Could not get matched item!");
                return;
            }
            let data = parent.attr(selectors.shoppingData);
            if (!data || (data = data.trim()) == "" || (data = data.split("_")).length != 2) return;

            regexString.val("");
            itemsList.html("").hide();

            let categoryId = data[0],
                itemId = data[1],
                itemName = localDB.categories[categoryId].i[itemId];

            let selectCategories = FindElementEndsWithID("_ddlShopItemCategories"),
                selectItemTypes = FindElementEndsWithID("_ddlShopItemTypes");

            if (selectCategories.val() == categoryId && selectItemTypes.length) {
                GM_setValue("data", { "next-process": "scroll-to-tables" });
                selectItemTypes.val(itemId).change();
                return;
            }
            selectItemTypes = undefined;

            GM_setValue("data", {
                "next-process": "select-item",
                categoryId: categoryId,
                itemId: itemId,
            });

            selectCategories.val(categoryId).change();
        }

    })(FindElementEndsWithID("_ddlShopItemCategories"));

    ((data) => {
        if (typeof data != "object") return;
        console.log("data: " + JSON.stringify(data));
        if (!data.hasOwnProperty("next-process")) return;

        let currentProcess = data["next-process"],
            selectCategories,
            selectItemTypes;
        switch (currentProcess) {
            case "select-item":
                selectCategories = FindElementEndsWithID("_ddlShopItemCategories");
                selectItemTypes = FindElementEndsWithID("_ddlShopItemTypes");
                if (selectCategories.length == 0 || selectItemTypes.length == 0) stopScript(new Error("Unknown status: 1"));
                if (!data.categoryId || !data.itemId) stopScript(new Error("Error: 1"));
                if (selectCategories.val() != data.categoryId) stopScript(new Error("Error: 2"));
                if (!jQuery(`>option[value="${data.itemId}"]`, selectItemTypes).length) stopScript(new Error("Error: 3"));
                selectItemTypes.val(data.itemId);

                data["next-process"] = "scroll-to-tables";
                GM_setValue("data", data);
                selectItemTypes.change();
                break;

            case "scroll-to-tables":
                jQuery("html").animate({ scrollTop: FindElementEndsWithID("_ddlShopItemCategories").parents("div.box").first().offset().top - 3 }, "fast");
                GM_deleteValue("data");
                break;

            default:
                stopScript(new Error("Unknown process: " + currentProcess));
                break;
        }
    })(GM_getValue("data", undefined));
});

function FindElementEndsWithID(end) {
    return jQuery(`[id$="${end}"]`);
}

function stopScript(err) {
    alert(err.message || err);
    GM_deleteValue("data");
    throw new Error(err);
}