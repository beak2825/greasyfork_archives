// ==UserScript==
// @name         Torn Utilities
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Extension for calculating price
// @author       SomeoneSK[2572033]
// @include https://www.torn.com/*
// @grant       GM.xmlHttpRequest
// @grant       GM.setValue
// @grant       GM.getValue
// @connect     torn-utilities.com
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/429130/Torn%20Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/429130/Torn%20Utilities.meta.js
// ==/UserScript==


GM_addStyle ( `
.button-extension {
  margin: 10px;
  display: inline-block;
}
#table-extension {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
  font-size: larger;
}

#table-extension td, #table-extension th {
  border: 1px solid #ddd;
  padding: 4px;
}

#table-extension tr:nth-child(even){background-color: #f2f2f2;}

#table-extension tr:hover {background-color: #ddd;}

#table-extension th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #d4f1f1;
}

.input-extension {
  margin:10px;
  display: inline-block;
  font-family: sans-serif;
  width:80%;
  resize: vertical;
  padding:5px;
  border-radius:5px;
  border:0;
  box-shadow:2px 2px 5px rgba(0,0,0,0.06);
}
.prices-extension {
     padding: 5px;
     font-size: 15px;
     border-width: 1px;
     border-color: #CCCCCC;
     background-color: #FFFFFF;
     color: #000000;
     border-style: solid;
     border-radius: 0px;
     box-shadow: 0px 0px 5px rgba(66,66,66,.18);
     text-shadow: -50px 0px 0px rgba(66,66,66,.0);
     width: 50%
}
#done_msg_trade {
   padding: 5px;
   line-height: 150%;
}



.modal-extension {
  display: none;
  position: fixed;
  padding-top: 25px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index:100000;
}
.modal-content {
  position: relative;
  background-color: white;
  padding: 20px;
  margin: auto;
  width: 75%;
  -webkit-animation-name: animatetop;
  -webkit-animation-duration: 0.4s;
  animation-name: animatetop;
  animation-duration: 0.4s;
  overflow: scroll;
  max-height: 85%;
}
.close-btn {
  float: right;
  color: lightgray;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
}
.close-btn:hover {
  color: darkgray;
}
@-webkit-keyframes animatetop {
  from {top:-300px; opacity:0}
  to {top:0; opacity:1}
}
@keyframes animatetop {
  from {top:-300px; opacity:0}
  to {top:0; opacity:1}
}
` );

function now(){
    return Math.floor(Date.now() / 1000)
}
function make_popup(header, body, footer, id) {
    let text = '<div id="' + id + '" class="modal-extension"> <div class="modal-content">'
    text += '<div class="modal-header"> <span id="close_calculator" class="close-btn">&times;</span> <h2>' + header + '</h2> </div>'
    text += '<div class="modal-body">' + body + ' </div>'
    if (footer !== ""){
        text += '<div class="modal-footer"> <h3>' + footer + '</h3> </div>'
    }
    text += '</div> </div>'
    let popup = htmlToElement(text)
    if (document.getElementById(id) !== null) {document.getElementById(id).remove()}
    document.body.append(popup)
    var span = document.getElementById("close_calculator");
    span.onclick = function() {
        hide_modal()
    }
    window.onclick = function(event) {
        if (event.target == document.getElementById(id)) {
            hide_modal()
        }
    }
    return popup

}

function cssElement(url) {
    var link = document.createElement("link");
    link.href = url;
    link.rel="stylesheet";
    link.type="text/css";
    return link;
}

let itemsids =  {'hammer': '1', 'baseball bat': '2', 'crowbar': '3', 'knuckle dusters': '4', 'pen knife': '5', 'kitchen knife': '6', 'dagger': '7', 'axe': '8', 'scimitar': '9', 'chainsaw': '10', 'samurai sword': '11', 'glock 17': '12', 'raven mp25': '13', 'ruger 22/45': '14', 'beretta m9': '15', 'usp': '16', 'beretta 92fs': '17', 'fiveseven': '18', 'magnum': '19', 'desert eagle': '20', 'dual 92g berettas': '21', 'sawed-off shotgun': '22', 'benelli m1 tactical': '23', 'mp5 navy': '24', 'p90': '25', 'ak-47': '26', 'm4a1 colt carbine': '27', 'benelli m4 super': '28', 'm16 a2 rifle': '29', 'steyr aug': '30', 'm249 para lmg': '31', 'leather vest': '32', 'police vest': '33', 'bulletproof vest': '34', 'box of chocolate bars': '35', 'big box of chocolate bars': '36', 'bag of bon bons': '37', 'box of bon bons': '38', 'box of extra strong mints': '39', 'pack of music cds': '40', 'dvd player': '41', 'mp3 player': '42', 'cd player': '43', 'pack of blank cds : 100': '44', 'hard drive': '45', 'tank top': '46', 'trainers': '47', 'jacket': '48', 'full body armor': '49', 'outer tactical vest': '50', 'plain silver ring': '51', 'sapphire ring': '52', 'gold ring': '53', 'diamond ring': '54', 'pearl necklace': '55', 'silver necklace': '56', 'gold necklace': '57', 'plastic watch': '58', 'stainless steel watch': '59', 'gold watch': '60', 'personal computer': '61', 'microwave': '62', 'minigun': '63', 'pack of cuban cigars': '64', 'big tv screen': '65', 'morphine': '66', 'first aid kit': '67', 'small first aid kit': '68', 'simple virus': '69', 'polymorphic virus': '70', 'tunneling virus': '71', 'armored virus': '72', 'stealth virus': '73', "santa hat '04": '74', "christmas cracker '04": '75', 'snow cannon': '76', 'toyota mr2': '77', 'honda nsx': '78', 'audi tt quattro': '79', 'bmw m5': '80', 'bmw z8': '81', 'chevrolet corvette z06': '82', 'dodge charger': '83', 'pontiac firebird': '84', 'ford gt40': '85', 'hummer h3': '86', 'audi s4': '87', 'honda integra r': '88', 'honda accord': '89', 'honda civic': '90', 'volkswagen beetle': '91', 'chevrolet cavalier': '92', 'ford mustang': '93', 'reliant robin': '94', 'holden ss': '95', 'coat hanger': '96', 'bunch of flowers': '97', 'neutrilux 2000': '98', 'springfield 1911-a1': '99', 'egg propelled launcher': '100', 'bunny suit': '101', "chocolate egg '05": '102', 'firewalk virus': '103', 'playstation': '104', 'xbox': '105', 'parachute': '106', 'trench coat': '107', '9mm uzi': '108', 'rpg launcher': '109', 'leather bullwhip': '110', 'ninja claws': '111', 'test trophy': '112', 'pet rock': '113', 'non-anon doll': '114', 'poker doll': '115', 'yoda figurine': '116', 'trojan horse': '117', 'evil doll': '118', 'rubber ducky of doom': '119', 'teppic bear': '120', 'rockerhead doll': '121', 'mouser doll': '122', 'elite action man': '123', 'toy reactor': '124', 'royal doll': '125', 'blue dragon': '126', 'china tea set': '127', 'mufasa toy': '128', 'dozen roses': '129', 'skanky doll': '130', 'lego hurin': '131', 'mystical sphere': '132', '10 ton pacifier': '133', 'horse': '134', "uriel's speakers": '135', 'strife clown': '136', 'locked teddy': '137', "riddle's bat": '138', 'soup nazi doll': '139', 'pouncer doll': '140', 'spammer doll': '141', 'cookie jar': '142', 'vanity mirror': '143', 'banana phone': '144', 'xbox 360': '145', 'yasukuni sword': '146', 'rusty sword': '147', 'dance toy': '148', 'lucky dime': '149', 'crystal carousel': '150', 'pixie sticks': '151', 'ice sculpture': '152', 'case of whiskey': '153', 'laptop': '154', 'purple frog doll': '155', 'skeleton key': '156', 'patriot whip': '157', 'statue of aeolus': '158', 'bolt cutters': '159', 'photographs': '160', 'black unicorn': '161', 'warpaint kit': '162', 'official ninja kit': '163', 'leukaemia teddybear': '164', 'chocobo flute': '165', 'annoying man': '166', 'article on crime': '167', 'unknown': '208', 'barbie doll': '169', 'wand of destruction': '170', "jack-o-lantern '05": '171', 'gas can': '172', 'butterfly knife': '173', 'xm8 rifle': '174', 'taser': '175', 'chain mail': '176', 'cobra derringer': '177', 'flak jacket': '178', "birthday cake '05": '179', 'bottle of beer': '180', 'bottle of champagne': '181', 'soap on a rope': '182', 'single red rose': '183', 'bunch of black roses': '184', "bunch of balloons '05": '185', 'sheep plushie': '186', 'teddy bear plushie': '187', 'cracked crystal ball': '188', 's&w revolver': '189', 'c4 explosive': '190', 'memory locket': '191', 'rainbow stud earring': '192', 'hamster toy': '193', "snowflake '05": '194', "christmas tree '05": '195', 'cannabis': '196', 'ecstasy': '197', 'ketamine': '198', 'lsd': '199', 'opium': '200', 'pcp': '201', "mr torn crown '07": '202', 'shrooms': '203', 'speed': '204', 'vicodin': '205', 'xanax': '206', "ms torn crown '07": '207', 'box of sweet hearts': '209', 'bag of chocolate kisses': '210', 'crazy cow': '211', "legend's urn": '212', 'dreamcatcher': '213', 'brutus keychain': '214', 'kitten plushie': '215', 'single white rose': '216', 'claymore sword': '217', 'crossbow': '218', 'enfield sa-80': '219', 'grenade': '220', 'stick grenade': '221', 'flash grenade': '222', 'jackhammer': '223', 'swiss army knife': '224', 'mag 7': '225', 'smoke grenade': '226', 'spear': '227', 'vektor cr-21': '228', 'claymore mine': '229', 'flare gun': '230', 'heckler & koch sl8': '231', 'sig 550': '232', 'bt mp9': '233', 'chain whip': '234', 'wooden nunchakus': '235', 'kama': '236', 'kodachi': '237', 'sai': '238', 'ninja stars': '239', 'anti tank': '240', 'bushmaster carbon 15 type 21s': '241', 'heg': '242', 'taurus': '243', 'blowgun': '244', 'bo staff': '245', 'fireworks': '246', 'katana': '247', 'qsz-92': '248', 'sks carbine': '249', 'twin tiger hooks': '250', 'wushu double axes': '251', 'ithaca 37': '252', 'lorcin 380': '253', 's&w m29': '254', 'flamethrower': '255', 'tear gas': '256', 'throwing knife': '257', 'jaguar plushie': '258', 'mayan statue': '259', 'dahlia': '260', 'wolverine plushie': '261', 'hockey stick': '262', 'crocus': '263', 'orchid': '264', 'pele charm': '265', 'nessie plushie': '266', 'heather': '267', 'red fox plushie': '268', 'monkey plushie': '269', 'soccer ball': '270', 'ceibo flower': '271', 'edelweiss': '272', 'chamois plushie': '273', 'panda plushie': '274', 'jade buddha': '275', 'peony': '276', 'cherry blossom': '277', 'kabuki mask': '278', 'maneki neko': '279', 'elephant statue': '280', 'lion plushie': '281', 'african violet': '282', 'donator pack': '283', 'bronze paint brush': '284', 'silver paint brush': '285', 'gold paint brush': '286', "pand0ra's box": '287', 'mr brownstone doll': '288', 'dual axes': '289', 'dual hammers': '290', 'dual scimitars': '291', 'dual samurai swords': '292', 'japanese/english dictionary': '293', 'bottle of sake': '294', 'oriental log': '295', 'oriental log translation': '296', 'youyou yo yo': '297', 'monkey cuffs': '298', "jester's cap": '299', "gibal's dragonfly": '300', 'green ornament': '301', 'purple ornament': '302', 'blue ornament': '303', 'purple bell': '304', 'mistletoe': '305', 'mini sleigh': '306', 'snowman': '307', 'christmas gnome': '308', 'gingerbread house': '309', 'lollipop': '310', 'mardi gras beads': '311', 'devil toy': '312', 'cookie launcher': '313', 'cursed moon pendant': '314', 'apartment blueprint': '315', 'semi-detached house blueprint': '316', 'detached house blueprint': '317', 'beach house blueprint': '318', 'chalet blueprint': '319', 'villa blueprint': '320', 'penthouse blueprint': '321', 'mansion blueprint': '322', 'ranch blueprint': '323', 'palace blueprint': '324', 'castle blueprint': '325', 'printing paper': '326', 'blank tokens': '327', 'blank credit cards': '328', 'skateboard': '329', 'boxing gloves': '330', 'dumbbells': '331', 'combat vest': '332', 'liquid body armor': '333', 'flexible body armor': '334', 'stick of dynamite': '335', 'cesium-137': '336', 'dirty bomb': '337', "sh0rty's surfboard": '338', 'puzzle piece': '339', 'hunny pot': '340', 'seductive stethoscope': '341', 'dollar bill collectible': '342', 'backstage pass': '343', "chemi's magic potion": '344', 'pack of trojans': '345', 'pair of high heels': '346', 'thong': '347', 'hazmat suit': '348', 'flea collar': '349', "dunkin's donut": '350', 'amazon doll': '351', 'bbq smoker': '352', 'bag ofcheetos': '353', 'motorbike': '354', 'citrus squeezer': '355', 'superman shades': '356', 'kevlar helmet': '357', 'raw ivory': '358', 'fine chisel': '359', 'ivory walking cane': '360', 'neumune tablet': '361', "mr torn crown '08": '362', "ms torn crown '08": '363', 'box of grenades': '364', 'box of medical supplies': '365', 'erotic dvd': '366', 'feathery hotel coupon': '367', 'lawyer business card': '368', 'lottery voucher': '369', 'drug pack': '370', 'dark doll': '371', 'empty box': '372', 'parcel': '373', 'birthday present': '374', 'present': '375', 'christmas present': '376', 'birthday wrapping paper': '377', 'generic wrapping paper': '378', 'christmas wrapping paper': '379', 'small explosive device': '380', 'gold laptop': '381', 'gold plated ak-47': '382', 'platinum pda': '383', 'camel plushie': '384', 'tribulus omanense': '385', 'sports sneakers': '386', 'handbag': '387', 'pink mac-10': '388', "mr torn crown '09": '389', "ms torn crown '09": '390', 'macana': '391', 'pepper spray': '392', 'slingshot': '393', 'brick': '394', 'metal nunchakus': '395', 'business class ticket': '396', 'flail': '397', 'sig 552': '398', 'armalite m-15a4 rifle': '399', 'guandao': '400', 'lead pipe': '401', 'ice pick': '402', 'box of tissues': '403', 'bandana': '404', 'loaf of bread': '405', 'afro comb': '406', 'compass': '407', 'sextant': '408', 'yucca plant': '409', 'fire hydrant': '410', 'model space ship': '411', 'sports shades': '412', 'mountie hat': '413', 'proda sunglasses': '414', 'ship in a bottle': '415', 'paper weight': '416', 'rs232 cable': '417', 'tailors dummy': '418', 'small suitcase': '419', 'medium suitcase': '420', 'large suitcase': '421', 'vanity hand mirror': '422', 'poker chip': '423', 'rabbit foot': '424', 'voodoo doll': '425', 'bottle of tequila': '426', 'sumo doll': '427', 'casino pass': '428', 'chopsticks': '429', 'coconut bra': '430', 'dart board': '431', 'crazy straw': '432', 'sensu': '433', 'yakitori lantern': '434', 'dozen white roses': '435', 'snowboard': '436', 'glow stick': '437', 'cricket bat': '438', 'frying pan': '439', 'pillow': '440', 'khinkeh p0rnstar doll': '441', 'blow-up doll': '442', 'strawberry milkshake': '443', 'breadfan doll': '444', 'chaos man': '445', 'karate man': '446', 'burmese flag': '447', "bl0ndie's dictionary": '448', 'hydroponic grow tent': '449', 'leopard coin': '450', 'florin coin': '451', 'gold noble coin': '452', 'ganesha sculpture': '453', 'vairocana buddha sculpture': '454', 'quran script : ibn masud': '455', 'quran script : ubay ibn kab': '456', 'quran script : ali': '457', 'shabti sculpture': '458', 'egyptian amulet': '459', 'white senet pawn': '460', 'black senet pawn': '461', 'senet board': '462', 'epinephrine': '463', 'melatonin': '464', 'serotonin': '465', "snow globe '09": '466', "dancing santa claus '09": '467', "christmas stocking '09": '468', "santa's elf '09": '469', "christmas card '09": '470', "admin portrait '09": '471', 'blue easter egg': '472', 'green easter egg': '473', 'red easter egg': '474', 'yellow easter egg': '475', 'white easter egg': '476', 'black easter egg': '477', 'gold easter egg': '478', 'metal dog tag': '479', 'bronze dog tag': '480', 'silver dog tag': '481', 'gold dog tag': '482', 'mp5k': '483', 'ak74u': '484', 'skorpion': '485', 'tmp': '486', 'thompson': '487', 'mp 40': '488', 'luger': '489', 'blunderbuss': '490', 'zombie brain': '491', 'human head': '492', 'medal of honor': '493', 'citroen saxo': '494', 'classic mini': '495', 'fiat punto': '496', 'nissan micra': '497', 'peugeot 106': '498', 'renault clio': '499', 'vauxhall corsa': '500', 'volvo 850': '501', 'alfa romeo 156': '502', 'bmw x5': '503', 'seat leon cupra': '504', 'vauxhall astra gsi': '505', 'volkswagen golf gti': '506', 'audi s3': '507', 'ford focus rs': '508', 'honda s2000': '509', 'mini cooper s': '510', 'sierra cosworth': '511', 'lotus exige': '512', 'mitsubishi evo x': '513', 'porsche 911 gt3': '514', 'subaru impreza sti': '515', 'tvr sagaris': '516', 'aston martin one-77': '517', 'audi r8': '518', 'bugatti veyron': '519', 'ferrari 458': '520', 'lamborghini gallardo': '521', 'lexuslfa': '522', 'mercedes slr': '523', 'nissan gt-r': '524', "mr torn crown '10": '525', "ms torn crown '10": '526', 'bag of candy kisses': '527', 'bag of tootsie rolls': '528', 'bag of chocolate truffles': '529', 'can of munster': '530', 'bottle of pumpkin brew': '531', 'can of red cow': '532', 'can of taurine elite': '533', "witch's cauldron": '534', 'electronic pumpkin': '535', 'jack o lantern lamp': '536', 'spooky paper weight': '537', 'medieval helmet': '538', 'blood spattered sickle': '539', 'cauldron': '540', 'bottle of stinky swamp punch': '541', 'bottle of wicked witch': '542', 'deputy star': '543', 'wind proof lighter': '544', 'dual tmps': '545', 'dual bushmasters': '546', 'dual mp5s': '547', 'dual p90s': '548', 'dual uzis': '549', 'bottle of kandy kane': '550', 'bottle of minty mayhem': '551', 'bottle of mistletoe madness': '552', 'can of santa shooters': '553', 'can of rockstar rudolph': '554', 'can of x-mass': '555', 'bag of reindeer droppings': '556', 'advent calendar': '557', "santa's snot": '558', 'polar bear toy': '559', 'fruitcake': '560', 'book of carols': '561', 'sweater': '562', 'gift card': '563', 'glasses': '564', 'high-speed drive': '565', 'mountain bike': '566', 'cut-throat razor': '567', 'slim crowbar': '568', 'balaclava': '569', 'advanced driving tactics manual': '570', 'ergonomic keyboard': '571', 'tracking device': '572', 'screwdriver': '573', 'fanny pack': '574', 'tumble dryer': '575', 'chloroform': '576', 'heavy duty padlock': '577', 'duct tape': '578', 'wireless dongle': '579', "horse's head": '580', 'book': '581', 'tin foil hat': '582', 'brown easter egg': '583', 'orange easter egg': '584', 'pink easter egg': '585', 'jawbreaker': '586', 'bag of sherbet': '587', 'goodie bag': '588', 'undefined': '891', 'undefined 2': '590', 'undefined 3': '591', 'undefined 4': '592', "mr torn crown '11": '593', "ms torn crown '11": '594', 'pile of vomit': '595', 'rusty dog tag': '596', 'gold nugget': '597', "witch's hat": '598', 'golden broomstick': '599', "devil's pitchfork": '600', 'christmas lights': '601', 'gingerbread man': '602', 'golden wreath': '603', 'pair of ice skates': '604', 'diamond icicle': '605', 'santa boots': '606', 'santa gloves': '607', 'santa hat': '608', 'santa jacket': '609', 'santa trousers': '610', 'snowball': '611', 'tavor tar-21': '612', 'harpoon': '613', 'diamond bladed knife': '614', 'naval cutlass': '615', 'trout': '616', 'banana orchid': '617', 'stingray plushie': '618', 'steel drum': '619', 'nodding turtle': '620', 'snorkel': '621', 'flippers': '622', 'speedo': '623', 'bikini': '624', 'wetsuit': '625', 'diving gloves': '626', 'dog poop': '627', 'stink bombs': '628', 'toilet paper': '629', "mr torn crown '12": '630', "ms torn crown '12": '631', 'petrified humerus': '632', 'latex gloves': '633', 'bag of bloody eyeballs': '634', 'straitjacket': '635', 'cinnamon ornament': '636', 'christmas express': '637', 'bottle of christmas cocktail': '638', 'golden candy cane': '639', 'kevlar gloves': '640', 'wwii helmet': '641', 'motorcycle helmet': '642', 'construction helmet': '643', 'welding helmet': '644', 'safety boots': '645', 'hiking boots': '646', 'leather helmet': '647', 'leather pants': '648', 'leather boots': '649', 'leather gloves': '650', 'combat helmet': '651', 'combat pants': '652', 'combat boots': '653', 'combat gloves': '654', 'riot helmet': '655', 'riot body': '656', 'riot pants': '657', 'riot boots': '658', 'riot gloves': '659', 'dune helmet': '660', 'dune vest': '661', 'dune pants': '662', 'dune boots': '663', 'dune gloves': '664', 'assault helmet': '665', 'assault body': '666', 'assault pants': '667', 'assault boots': '668', 'assault gloves': '669', 'delta gas mask': '670', 'delta body': '671', 'delta pants': '672', 'delta boots': '673', 'delta gloves': '674', 'marauder face mask': '675', 'marauder body': '676', 'marauder pants': '677', 'marauder boots': '678', 'marauder gloves': '679', 'eod helmet': '680', 'eod apron': '681', 'eod pants': '682', 'eod boots': '683', 'eod gloves': '684', 'torn bible': '685', 'friendly bot guide': '686', 'egotistical bear': '687', 'brewery key': '688', 'signed jersey': '689', 'mafia kit': '690', 'octopus toy': '691', 'bear skin rug': '692', 'tractor toy': '693', "mr torn crown '13": '694', "ms torn crown '13": '695', 'piece of cake': '696', 'rotten eggs': '697', 'peg leg': '698', 'antidote': '699', 'christmas angel': '700', 'eggnog': '701', 'sprig of holly': '702', 'festive socks': '703', 'respo hoodie': '704', 'staff haxx button': '705', "birthday cake '14": '706', 'lump of coal': '707', 'gold ribbon': '708', 'silver ribbon': '709', 'bronze ribbon': '710', 'coin : factions': '711', 'coin : casino': '712', 'coin : education': '713', 'coin : hospital': '714', 'coin : jail': '715', 'coin : travel agency': '716', 'coin : companies': '717', 'coin : stock exchange': '718', 'coin : church': '719', 'coin : auction house': '720', 'coin : race track': '721', 'coin : museum': '722', 'coin : drugs': '723', 'coin : dump': '724', 'coin : estate agents': '725', "scrooge's top hat": '726', "scrooge's topcoat": '727', "scrooge's trousers": '728', "scrooge's boots": '729', "scrooge's gloves": '730', 'empty blood bag': '731', 'blood bag : a+': '732', 'blood bag : a-': '733', 'blood bag : b+': '734', 'blood bag : b-': '735', 'blood bag : ab+': '736', 'blood bag : ab-': '737', 'blood bag : o+': '738', 'blood bag : o-': '739', 'mr torn crown': '740', 'ms torn crown': '741', 'molotov cocktail': '742', "christmas sweater '15": '743', 'book : brawn over brains': '744', 'book : time is in the mind': '745', 'book : keeping your face handsome': '746', 'book : a job for your hands': '747', 'book : working 9 til 5': '748', 'book : making friends, enemies, and cakes': '749', 'book : high school for adults': '750', 'book : milk yourself sober': '751', 'book : fight like an asshole': '752', 'book : mind over matter': '753', 'book : no shame no pain': '754', 'book : run like the wind': '755', 'book : weaseling out of trouble': '756', 'book : get hard or go home': '757', 'book : gym grunting - shouting to success': '758', 'book : self defense in the workplace': '759', 'book : speed 3 - the rejected script': '760', 'book : limbo lovers 101': '761', "book : the hamburglar's guide to crime": '762', 'book : what are old folk good for anyway?': '763', 'book : medical degree schmedical degree': '764', 'book : no more soap on a rope': '765', 'book : mailing yourself abroad': '766', 'book : smuggling for beginners': '767', 'book : stealthy stealing of underwear': '768', "book : shawshank sure ain't for me!": '769', 'book : ignorance is bliss': '770', 'book : winking to win': '771', 'book : finders keepers': '772', 'book : hot turkey': '773', 'book : higher daddy, higher!': '774', 'book : the real dutch courage': '775', "book : because i'm happy - the pharrell story": '776', 'book : no more sick days': '777', 'book : duke - my story': '778', 'book : self control is for losers': '779', 'book : going back for more': '780', 'book : get drunk and lose dignity': '781', 'book : fuelling your way to failure': '782', 'book : yes please diabetes': '783', 'book : ugly energy': '784', 'book : memories and mammaries': '785', 'book : brown-nosing the boss': '786', 'book : running away from trouble': '787', 'certificate of awesome': '788', 'certificate of lame': '789', 'plastic sword': '790', 'mediocre t-shirt': '791', 'penelope': '792', 'cake frosting': '793', 'lock picking kit': '794', 'special fruitcake': '795', 'felovax': '796', 'zylkene': '797', "duke's safe": '798', "duke's selfies": '799', "duke's poetry": '800', "duke's dog's ashes": '801', "duke's will": '802', "duke's gimp mask": '803', "duke's herpes medication": '804', "duke's hammer": '805', 'old lady mask': '806', 'exotic gentleman mask': '807', 'ginger kid mask': '808', 'young lady mask': '809', 'moustache man mask': '810', 'scarred man mask': '811', 'psycho clown mask': '812', 'nun mask': '813', 'tyrosine': '814', 'keg of beer': '815', 'glass of beer': '816', 'six pack of alcohol': '817', 'six pack of energy drink': '818', 'rosary beads': '819', 'piggy bank': '820', 'empty vial': '821', 'vial of blood': '822', 'vial of urine': '823', 'vial of saliva': '824', 'questionnaire ': '825', 'agreement': '826', 'perceptron : calibrator': '827', "donald trump mask '16": '828', "yellow snowman '16": '829', 'nock gun': '830', 'beretta pico': '831', 'riding crop': '832', 'sand': '833', 'sweatpants': '834', 'string vest': '835', 'black oxfords': '836', 'rheinmetall mg 3': '837', 'homemade pocket shotgun': '838', 'madball': '839', 'nail bomb': '840', 'classic fedora': '841', 'pinstripe suit trousers': '842', 'duster': '843', 'tranquilizer gun ': '844', 'bolt gun': '845', 'scalpel': '846', 'nerve gas': '847', 'kevlar lab coat': '848', 'loupes': '849', 'sledgehammer': '850', 'wifebeater': '851', 'metal detector': '852', 'graveyard key': '853', 'questionnaire : completed': '854', 'agreement : signed': '855', 'spray can : black': '856', 'spray can : red': '857', 'spray can : pink': '858', 'spray can : purple': '859', 'spray can : blue': '860', 'spray can : green': '861', 'spray can : yellow': '862', 'spray can : orange': '863', 'salt shaker': '864', 'poison mistletoe': '865', "santa's list '17": '866', 'soapbox': '867', 'turkey baster': '868', "elon musk mask '17": '869', 'love juice': '870', 'bug swatter': '871', 'nothing': '872', 'bottle of green stout': '873', 'prototype': '874', 'rotten apple': '875', 'festering chicken': '876', 'mouldy pizza': '877', 'smelly cheese': '878', 'sour milk': '879', 'stale bread': '880', 'spoiled fish': '881', 'insurance policy ': '882', 'bank statement': '883', 'car battery': '884', 'scrap metal': '885', 'torn city times': '886', 'karma! magazine': '887', 'umbrella': '888', 'travel mug': '889', 'headphones': '890', 'mix cd': '892', 'lost and found office key': '893', 'cosmetics case': '894', 'phone card': '895', 'subway season ticket': '896', 'bottle cap': '897', 'silver coin': '898', 'silver bead': '899', 'lucky quarter': '900', 'daffodil': '901', 'bunch of carnations': '902', 'white lily': '903', 'funeral wreath': '904', 'car keys': '905', 'handkerchief': '906', 'candle': '907', 'paper bag': '908', 'tin can': '909', 'betting slip': '910', 'fidget spinner': '911', 'majestic moose': '912', 'lego wonder woman': '913', 'cr7 doll': '914', 'stretch armstrong doll': '915', 'beef femur': '916', "snake's fang": '917', 'icey igloo': '918', 'federal jail key': '919', 'halloween basket : spooky': '920', "michael myers mask '18": '921', "toast jesus '18": '922', "cheesus '18": '923', 'bottle of christmas spirit': '924', "scammer in the slammer '18": '925', "gronch mask '18": '926', 'baseball cap': '927', 'bermudas': '928', 'blouse': '929', 'boob tube': '930', 'bush hat': '931', 'camisole': '932', 'capri pants': '933', 'cardigan': '934', 'cork hat': '935', 'crop top': '936', 'fisherman hat': '937', 'gym shorts': '938', 'halterneck': '939', 'raincoat': '940', 'pantyhose': '941', 'pencil skirt': '942', 'peplum top': '943', 'polo shirt': '944', 'poncho': '945', 'puffer vest': '946', 'mackintosh': '947', 'shorts': '948', 'skirt': '949', 'travel socks': '950', 'turtleneck': '951', 'yoga pants': '952', 'bronze racing trophy': '953', 'silver racing trophy': '954', 'gold racing trophy': '955', 'pack of blank cds : 250': '956', 'pack of blank cds : 50': '957', 'chest harness': '958', 'choker': '959', 'fishnet stockings': '960', 'knee-high boots': '961', 'lingerie': '962', 'mankini': '963', 'mini skirt': '964', 'nipple tassels': '965', 'bowler hat': '966', 'fitted shirt': '967', 'bow tie': '968', 'neck tie': '969', 'waistcoat': '970', 'blazer': '971', 'suit trousers': '972', 'derby shoes': '973', 'smoking jacket': '974', 'monocle': '975', 'bronze microphone': '976', 'silver microphone': '977', 'gold microphone': '978', 'paint mask': '979', 'ladder': '980', 'wire cutters': '981', 'ripped jeans': '982', 'bandit mask': '983', 'bottle of moonshine': '984', 'can of goose juice': '985', 'can of damp valley': '986', 'can of crocozade': '987', 'fur coat': '988', 'fur scarf': '989', 'fur hat': '990', 'platform shoes': '991', 'silver flats': '992', 'crystal bracelet': '993', 'cocktail ring': '994', 'sun hat': '995', 'square sunglasses': '996', 'statement necklace': '997', 'floral dress': '998', 'shrug': '1001', 'eye patch': '1002', 'halloween basket : creepy': '1003', 'halloween basket : freaky': '1004', 'halloween basket : frightful': '1005', 'halloween basket : haunting': '1006', 'halloween basket : shocking': '1007', 'halloween basket : terrifying': '1008', 'halloween basket : horrifying': '1009', 'halloween basket : petrifying': '1010', 'halloween basket : nightmarish': '1011', 'blood bag : irradiated': '1012', "jigsaw mask '19": '1013', 'reading glasses': '1014', 'chinos': '1015', 'collared shawl': '1016', 'pleated skirt': '1017', 'flip flops': '1018', 'bingo visor': '1019', 'cover-ups': '1020', 'sandals': '1021', 'golf socks': '1022', 'flat cap': '1023', 'slippers': '1024', 'bathrobe': '1025', "party hat '19": '1026', 'badge : 15th anniversary': '1027', 'birthday cupcake': '1028', 'strippogram voucher': '1029', 'dong : thomas': '1030', 'dong : greg': '1031', 'dong : effy': '1032', 'dong : holly': '1033', 'dong : jeremy': '1034', 'anniversary present': '1035', "greta mask '19": '1036', "anatoly mask '19": '1037', 'santa beard': '1038', 'bag of humbugs': '1039', 'christmas cracker': '1040', 'special snowflake': '1041', 'concussion grenade': '1042', 'paper crown : green': '1043', 'paper crown : yellow': '1044', 'paper crown : red': '1045', 'paper crown : blue': '1046', 'denim shirt': '1047', 'denim vest': '1048', 'denim jacket': '1049', 'denim jeans': '1050', 'denim shoes': '1051', 'denim cap': '1052', 'bread knife': '1053', 'semtex': '1054', 'poison umbrella': '1055', 'millwall brick': '1056', 'gentleman cache': '1057', 'gold chain': '1058', 'snapback hat': '1059', 'saggy pants': '1060', 'oversized shirt': '1061', 'basketball shirt': '1062', 'parachute pants': '1063', 'tube dress': '1064', 'gold sneakers': '1065', 'shutter shades': '1066', 'silver hoodie': '1067', 'bucket hat': '1068', 'puffer jacket': '1069', 'durag': '1070', 'onesie': '1071', 'baseball jacket': '1072', 'braces': '1073', 'panama hat': '1074', 'pipe': '1075', 'shoulder sweater': '1076', 'sports jacket': '1077', 'old wallet': '1078', 'cardholder': '1079', 'billfold': '1080', 'coin purse': '1081', 'zip wallet': '1082', 'clutch': '1083', 'credit card': '1084', 'lipstick': '1085', 'license': '1086', 'tampon': '1087', 'receipt': '1088', 'family photo': '1089', 'lint': '1090', 'handcuffs': '1091', 'lubricant': '1092', 'hit contract': '1093', 'syringe': '1094', 'spoon': '1095', 'cell phone': '1096', 'assless chaps': '1097', 'opera gloves': '1098', 'booty shorts': '1099', 'collar': '1100', 'ball gag': '1101', 'blindfold': '1102', 'maid uniform': '1103', 'maid hat': '1104', 'ball gown': '1105', 'fascinator hat': '1106', 'wedding dress': '1107', 'wedding veil': '1108', 'head scarf': '1109', 'nightgown': '1110', 'pullover': '1111', 'elegant cache': '1112', 'naughty cache': '1113', 'elderly cache': '1114', 'denim cache': '1115', 'wannabe cache': '1116', 'cutesy cache': '1117', 'armor cache': '1118', 'melee cache': '1119', 'small arms cache': '1120', 'medium arms cache': '1121', 'heavy arms cache': '1122', 'spy camera': '1123', 'cloning device': '1124', 'card skimmer': '1125', 'tutu': '1126', 'knee socks': '1127', 'kitty shoes': '1128', 'cat ears': '1129', 'bunny ears': '1130', 'puppy ears': '1131', 'heart sunglasses': '1132', 'hair bow': '1133', 'lolita dress': '1134', 'unicorn horn': '1135', 'check skirt': '1136', 'polka dot dress': '1137', 'ballet shoes': '1138', 'dungarees': '1139', 'tights': '1140', "pennywise mask '20": '1141', "tiger king mask '20": '1142', 'medical mask': '1143', 'chin diaper': '1144', 'tighty whities': '1145', 'tangerine': '1146', 'helmet of justice': '1147', 'broken bauble': '1148', 'purple easter egg':'1149'}
let api_key = ""
let sitename = "https://torn-utilities.com"
console.log("Torn Info Userscript")

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

function effective_no_quantity(market, prices) {
	if (prices["fixed"] !== "") {
		return prices["fixed"]
	}
	let margin = 0
	if (prices["margin"] !== "") {
		margin = Math.floor(market * (100 - prices["margin"]) / 100)
	}
	if (prices["min"] !== "") {
		if (margin < prices["min"]) {
			return prices["min"]
		}
	}
	if (prices["max"] !== "") {
		if (margin > prices["max"]) {
			return prices["max"]
		}
	}
	return margin
}

function effective_price(market, prices, quantity = 1) {
	if (Object.keys(prices).includes("batches")) {
		let keys = Object.keys(prices["batches"]).sort(function(a, b){return b-a})
		for (let key of keys) {
			if (parseInt(quantity) >= parseInt(key)) {
				return 	effective_no_quantity(market, prices["batches"][key])
			}
		}
	}
	return effective_no_quantity(market, prices)
}

let data = ""
let last_trade = {}
let market_value = "market_price"

async function get_data() {
    cache = await GM.getValue("cached_data")
    if (cache !== undefined) {
        try{
            cache = JSON.parse( cache )
            data = cache["the_data"]
            market_value = data["loggedin"]["trading_options"]["market_value"]
            console.log(data["loggedin"])
            document.getElementById("last_updated").innerHTML = "Prices and market values last updated: " + (now() - cache["last_updated"]) + " seconds ago - " + Date()
        } catch(error) {console.log(error)}
        update_log()
    }
    let postData = {"which": "prices", "api_key":api_key};

    GM.xmlHttpRequest ( {
        method:     'POST',
        url:        sitename + '/getdata',
        data:       JSON.stringify(postData),
        headers: {
            "Content-Type": "application/json"
        },
        onload:     async function (responseDetails) {
            data = JSON.parse(responseDetails.responseText)
            let to_cache = JSON.stringify( { "the_data": data, "last_updated":now() } )
            await GM.setValue("cached_data", to_cache )
            console.log("data: ", data)
            if (Object.keys(data).includes("error")) {
                if (data["error"] === "wrong api") {alert("Wrong API! You need to change it."); return}
            }
            market_value = data["loggedin"]["trading_options"]["market_value"]
            document.getElementById("last_updated").innerHTML = "Prices and market values last updated: " + "0 seconds ago - " + Date()
            update_log()
            return data
        }
    });
}

function update_all() {
    for (let id of Object.keys(itemsintrade)) {
        update_totals(id)
    }

    update_total()
    update_message()
}

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function update_totals(id) {
    let q = document.getElementById("quantity" + id).innerHTML
    itemsintrade[id]["buyfor"] = document.getElementById("buyfor" + id).value

    let total = document.getElementById("total" + id)
    total.innerHTML = "$" + numberWithCommas( q.slice(0, -1) * itemsintrade[id]["buyfor"] )

}

function update_total() {
	let the_total = 0
	let profit = 0
	for (let id of Object.keys(itemsintrade)) {
		let total = document.getElementById("total" + id).innerHTML
		total = total.slice(1)
		if (!isNaN(parseInt(total.split(",").join("")))) {
			the_total += parseInt(total.split(",").join(""))
			profit += itemsintrade[id]["market_value"] * itemsintrade[id]["quantity"] - parseInt(total.split(",").join(""))
		}
	}
    last_trade["total"] = the_total
	document.getElementById("thetotal").innerHTML = "<b>$" + numberWithCommas( the_total ) + "<b>"
	document.getElementById("total_text").innerHTML = "Total: <b>$" + numberWithCommas( the_total ) + "</b><br>Total Profit: $<b>" + numberWithCommas( profit ) + "</b>"
}

function update_message() {
    let total = document.getElementById("thetotal").innerHTML.slice(3, -11)
    let text = data["loggedin"]["receipt"]
    text = text.replace("{total}", total)
    let receipt = sitename + "/r/" + data["loggedin"]["this_trade_code"]
    if (receipt === sitename + "/r/" + "") {
        receipt = "Add trade to history to generate receipt"
    }
    text = text.replace("{receipt}", receipt)
    text = text.replace("{thread}", data["users"][data["loggedin"]["id"]]["prices_thread"])
    text = text.replace("{pricelist}", sitename + "/profile/" + data["loggedin"]["id"])
    document.getElementById("themessage").value = text.split("\\n").join("\r\n")
}

let itemsintrade = {}
let notfound = 0
let name = ""
function update_log() {
    if (Object.keys(data).includes("error")) {
        if (data["error"] === "wrong api") {return}
    }
    itemsintrade = {}
    name = ""
    notfound = 0
    let logtext = document.getElementById("logtext").value
    let lines = logtext.split('\n').reverse()

    for (let line of lines) {
        if (line[0] == "$") {continue} //torntools
        if (line === "") {continue}
        let this_name = line.split(' ')[0]
        if (name === "" & this_name !== data["loggedin"]["torn_name"]) {
            name = this_name
        }
        if (this_name === data["loggedin"]["torn_name"]) {continue}

        if (line.split(' ')[1] === "says:" | line.includes("to the trade for a total of") | line.includes("from the trade leaving a total of")) {
            continue;
        }

        let linewas = line
        line = line.replace(" items from the trade.", "")
	line = line.replace(" items from the trade", "")
	line = line.replace(" items to the trade.", "")
	line = line.replace(" items to the trade", "")
	line = line.replace(" from the trade.", "")
	line = line.replace(" from the trade", "")
	line = line.replace(" to the trade.", "")
	line = line.replace(" to the trade", "")
        line = line.replace(name + " added ", "", 1)
        line = line.replace(name + " removed ", "", 1)
        let items = line.split(', ')

        for (let item of items) {
            let x = item.search('x')
            let itemname = item.slice(x+2)
            let itemid = itemsids[itemname.toLowerCase()]
            if (itemid === undefined) {
                itemid = "notfound" + notfound
            }
            let price = 0
            if (Object.keys(data["items"]).includes(itemid)) {
                price = data["items"][itemid][market_value]
            }
            let quantity = parseInt(item.slice(0, x))
            if (Object.keys(itemsintrade).includes(itemid)) {
                if (linewas.includes("added")) {
			itemsintrade[itemid]["quantity"] += quantity
		} else if (linewas.includes("removed")) {
			itemsintrade[itemid]["quantity"] -= quantity
		}
            } else {
                if (linewas.includes("added")) {
                    itemsintrade[itemid] = {"name":itemname, "quantity":quantity, "market_value": price}
                } else {
                    itemsintrade[itemid] = {"name":itemname, "quantity": -1 * quantity, "market_value": price}
                }
            }
        }
    }

    let other = {"plushiesetid": ["186", "187", "215", "258", "261", "266", "268", "269", "273", "274", "281", "384", "618"], "flowersetid": ["282", "617", "271", "277", "263", "260", "272", "267", "264", "276", "385"]}
    function check_other(item) {
        let found = 0
        for (let items_other of other[item] ) {
            if ( Object.keys(itemsintrade).includes(items_other) ) {
                if (itemsintrade[items_other]["quantity"] < found || found === 0) {
                    found = itemsintrade[items_other]["quantity"]
                }
            } else {
                found = 0
                break
            }
        }
        if (found !== 0) {
            itemsintrade[item] = {"name":data["items"][item]["name"], "quantity": found, "market_value": data["items"][item][market_value]}
            for (let item_change of other[item]) {
                itemsintrade[item_change]["quantity"] -= found
                if (itemsintrade[item_change]["quantity"] === 0) {
                    delete itemsintrade[item_change]
                }
            }
            check_other(item)
        }
    }
    for (let item of Object.keys(other) ) {
        check_other(item)
    }

    let table = document.getElementById("theitems")
    table.innerHTML = ""
    for (let item of Object.keys(itemsintrade)) {
        if ( itemsintrade[item]["quantity"] === 0) {delete itemsintrade[item]; continue}
        let thisrow = ""
        itemsintrade[item]["buyfor"] = 0
        if (item in data["users"][data["loggedin"]["id"]]["prices"]) {
            itemsintrade[item]["buyfor"] = effective_price( itemsintrade[item]["market_value"], data["loggedin"]["prices"][item]["price"], itemsintrade[item]["quantity"] )
        }
        let link = ""
        if (Object.keys(data["items"]).includes(item)) {
            link = data["items"][item]["image"]
        }
        thisrow += '<tr><td>' + '<img src="' + link + '" height=25 width=auto>' + '</td><td>' + itemsintrade[item]["name"] + '</td><td>$ ' + numberWithCommas(itemsintrade[item]["market_value"]) + '</td><td id="quantity' + item + '">' + itemsintrade[item]["quantity"] + 'x</td>'
        thisrow += '<td>' + '<div class="input-group">' + '<span class="input-group-text">$</span>' + '<input type="number" class="prices-extension" placeholder = "Fixed price" id="buyfor' + item + '" value="' + itemsintrade[item]["buyfor"] + '"/>' + '</div></td>'
        thisrow += '<td id="total' + item + '">$' + numberWithCommas( itemsintrade[item]["quantity"] * itemsintrade[item]["buyfor"] ) + '</td></tr>'


        table.innerHTML += thisrow
    }

    table.innerHTML += '<tr><td></td><td></td><td></td><td></td><td></td><td id="thetotal">' + '$9000' + '</td></tr>'

    data["loggedin"]["this_trade_code"] = ""
    update_total()
    update_message()
    for (let item of document.getElementsByClassName("prices-extension")) {
        item.addEventListener("blur", update_all, {passive: true});
    }
}
function collapse() {
    let which = "none";
    if (document.getElementById("itemsintrade").style.display === "none"){which=""};
    document.getElementById("itemsintrade").style.display = which
}

function autofill() {
    let full_log = ""
    for (let log of document.getElementsByClassName("log")[0].childNodes) {
        if (log.tagName === "LI") {
           full_log += log.childNodes[0].nextSibling.innerText + "\r\n"
        }
    }
    document.getElementById("logtext").value = full_log
    update_log()
}

function show_modal() {
    document.getElementById("calculator").style.display = "block"
    autofill()
}

function hide_modal() {
    document.getElementById("calculator").style.display = "none"
}


async function make_modal() {
    let thestring = '<div class="card" style="background-color: #f2f2f2; overflow:scroll"> <div class="form-outline"> <textarea class="input-extension" id="logtext" rows="4" placeholder="Paste the log here"></textarea> </div>'
    thestring += '<button id="autofill-button" class="torn-btn button-extension"> Fill log </button> <br> <button id="collapse_button" class="torn-btn button-extension"> The items </button>'
    thestring += '<p id="total_text" style="margin: 15px">Total: </p> <p id="last_updated" style="margin: 15px"></p>'
    thestring += '<div id="itemsintrade" style="min-width:500px;"> <table id="table-extension"> <thead> <tr> <th scope="col">#</th> <th scope="col">Item</th> <th scope="col">' + 'Market Value' + '</th> <th scope="col">Quantity</th> <th scope="col">Buying for</th> <th scope="col">Total</th> </tr> </thead> <tbody id="theitems"> </tbody> </table> </div>'
    thestring += '<textarea class="input-extension" id="themessage" rows="4" placeholder="The receipt"></textarea> <br>'
    thestring += '<button type="button" class="torn-btn button-extension" id="copy">Copy</button> <button type="button" class="torn-btn button-extension" id="copyand">Copy & Add to history</button> <br> <p id="done_msg_trade"></p>'
    thestring += '<br> <input style="resize: none" class="input-extension" id="api_text" placeholder="Change API key"></input>'
    thestring += '<button id="submit_button2" class="torn-btn button-extension"> Submit </button> </div>'

    api_key = await GM.getValue("api_key")
    
    if (api_key === undefined && document.getElementById("api_text") === null) {
        let noapi = '<br> <input style="resize: none" class="input-extension" id="api_text" placeholder="Add your api key to use extension!"></input> <button id="submit_button" class="torn-btn button-extension"> Submit </button>'
        let popup = make_popup("Calculator", noapi, "", "calculator")
        document.getElementById("submit_button").addEventListener("click", submit_api, {passive: true});
        return
    }

    let popup = make_popup("Calculator", thestring, "", "calculator")


    document.getElementById("submit_button2").addEventListener("click", submit_api, {passive: true});

    document.getElementById("collapse_button").addEventListener("click", collapse, {passive: true});

    if (data === ""){ let aaa = await get_data() }

    let table = document.getElementById("theitems")

    let logtext = document.getElementById("logtext")
    logtext.addEventListener("input", update_log, {passive: true});

    function clipboardCopy1() {
        let text = document.getElementById("themessage").value;
        navigator.clipboard.writeText(text);
        let done = document.getElementById("done_msg_trade")
        done.innerHTML = "Copied: <br>" + document.getElementById("themessage").value
    }

    function clipboardCopy2() {
		let info = {"trade": {"torn_api":data["loggedin"]["torn_api"], "with":name, "items": itemsintrade, "trader": data["loggedin"]["name"]} }
		let done = document.getElementById("done_msg_trade")
		for (let item of Object.keys(itemsintrade)) {
                    if (isNaN(itemsintrade[item]["quantity"])) {delete itemsintrade[item]}
		}
		GM.xmlHttpRequest ( {
            method:     'POST',
            url:        sitename + '/postmethodjson',
            data:       JSON.stringify(info),
            headers: {
                "Content-Type": "application/json"
            },
            onload:     function (responseDetails) {
                let result = JSON.parse(responseDetails.responseText)
                console.log(result);
                data["loggedin"]["this_trade_code"] = result["code"]
                update_message()
                done.innerHTML = "Added this trade: <br>" + document.getElementById("themessage").value + "<br>Receipt: " + sitename + "/r/" + result["code"]
                let text = document.getElementById("themessage").value;
                navigator.clipboard.writeText(text);
	  	}
        });
    }

    document.getElementById("copy").addEventListener("click", clipboardCopy1, {passive: true});
    document.getElementById("copyand").addEventListener("click", clipboardCopy2, {passive: true});

    document.getElementById("autofill-button").addEventListener("click", autofill, {passive: true});

}


document.getElementById("body").addEventListener("click", load_it, {passive: true});
window.addEventListener("mousemove", load_it, {passive: true});
window.addEventListener("scroll", load_it, {passive: true});

async function submit_api() {
    let api = document.getElementById("api_text").value
    await GM.setValue("api_key", api)
    api_key = api
    document.getElementById("api_text").value = ""
    load_it_api()
}


function add_money() {
    let input_field = document.getElementsByClassName("input-money")[0]
    if (last_trade["total"] !== undefined) {
        input_field.value = last_trade["total"]
    }
}

async function load_it() {
    if (window.location.href.includes("https://www.torn.com/trade.php") & (document.getElementById("calc_button") === null) )  {
        let button_space = document.getElementsByClassName("cancel-btn-wrap")[0]
        let trade_cont = document.getElementsByClassName("trade-cont")[0]
        if (button_space !== undefined) {
            let button_div = button_space.childNodes[1]//.childNodes[1]
            button_div.appendChild(htmlToElement('<button class="torn-btn green" id="calc_button">CALCULATOR</button>'));
        } else if (trade_cont !== undefined) {
            trade_cont.parentNode.insertBefore(htmlToElement('<button class="torn-btn green" id="calc_button">CALCULATOR</button>'), trade_cont.nextSibling);
            trade_cont.parentNode.insertBefore(htmlToElement('<br>'), trade_cont.nextSibling);
        } else if (window.location.href.includes("https://www.torn.com/trade.php") & last_trade["added"] === false & document.getElementsByClassName("input-money")[0] !== undefined) {
            last_trade["added"] = true
            add_money()
            return
        } else {return}
        await make_modal()
        document.getElementById("calc_button").addEventListener("click", show_modal, {passive: true});
        last_trade["added"] = false
    }
}

async function load_it_api() {
    api_key = await GM.getValue("api_key")
    await get_data()
    await make_modal()
    show_modal()
}