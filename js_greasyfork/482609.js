// ==UserScript==
// @name        Mystery Item Guesser
// @namespace   Marascripts
// @description Fills in known mystery items.
// @author      marascript
// @version     2.1.2
// @grant       none
// @match       https://www.marapets.com/icefairy.php
// @homepageURL https://github.com/marascript/userscripts
// @supportURL	https://github.com/marascript/userscripts/issues
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/482609/Mystery%20Item%20Guesser.user.js
// @updateURL https://update.greasyfork.org/scripts/482609/Mystery%20Item%20Guesser.meta.js
// ==/UserScript==

/**
 * Sources:
 * https://marapics.blogspot.com/
 * https://mara.page/Dani/tessssssssst
 * https://mara.page/Dani/MysteryItemGuide
 * https://mara.page/Dani/MysteryItemGuide2
 * https://mara.guide/mysteryitem.php
 */

;(async () => {
  'use strict'

  const knownItems = {
    'euwirywoqk.gif': '10th Birthday Cake',

    'bbjkkeyccd.gif': 'Alien Grapes',
    'iihujnbhge.gif': 'Alien Grapes',
    'fhdsflhslsdhf.gif': 'Andy',
    'sdhflfhslhdf.gif': 'Angel Hits',
    'ggyhtujfkroidfs.gif': 'Angelic Wings',
    'ffjiaogfopfjgkdo.gif': 'Anime Wig',
    'sjsososos.gif': 'Autumn Book',
    'penjhgsy.gif': 'Azul Voodoo Doll',

    'zabbafat.gif': 'Bacon',
    'jpfopjtnvdslsd.gif': 'Bacon',
    'sjdjdidosos.gif': 'Ball of Bronze Yarn',
    'swinfhgyt.gif': 'Ball of Gold Yarn',
    'dfhsdfhslfh.gif': 'Balloon Collecting Guide',
    'ttjkkpwwsbxxvfg.gif': 'Balloon Gumball',
    'krindixi.gif': 'Banana Pen',
    'sjasiiiiis.gif': 'Bat Cake',
    'gygygjgkgl.gif': 'Battle Fairy Glowing Egg',
    'kkgweertpz.gif': 'Bay Leaves',
    'dggepkkvvq.gif': 'Beach',
    'ffgffdsasd.gif': 'Beast in the Box',
    'jhgkukikyiyk.gif': 'Beebot',
    'ccpwebyqxk.gif': 'Bell',
    'vimbpork.gif': 'Bell',
    'jgjgkkkyk.gif': 'Bigne Trading Card',
    'hgjkslroswi.gif': 'Blackjack Toy',
    'shdksoisoso.gif': 'Blitzen Horns',
    'plokijuhgrfedws.gif': 'Blue Drab',
    'gjtimvnmnirewp.gif': 'Blue Fatty',
    'hervotam.gif': 'Blueberry Soda',
    'detaajoharligaoslidaa.png': 'Bone and Candy Corn Arrow',
    'yrwqkpkpnbvxxsd.gif': 'Book of Beaches',
    'ddfouybeth.gif': 'Book Of Bees',
    'ppweoofgkk.gif': 'Bop',
    'hjskkaieien.gif': 'Bounchy Plushie',
    'hjkuikjgg.gif': 'Bowling Ball',
    'hflkfhldfhlhf.gif': 'Box of Tissues',
    'miteriokondrierogandrebusker.png': 'Brown Rofling Plushie',
    'aidnklwp.gif': 'Bunny Hair Extension',

    'wsedrftgyhujkio.gif': 'Candy Corn Cake',
    'hfdlfhshfls.gif': 'Candy Floss Trading Card',
    'omaeskapaaskulenaasann.png': 'Candycane Pin Up Dress',
    'zhxjckvlbp.gif': 'Capsule Machine Token',
    'vbfghjtuyercfwd.gif': 'Cheese Potato',
    'vghbnjlkiytrqdc.gif': 'Cherry Safety Lolly',
    'hhepinbhvr.gif': 'Cherry Sugar Glass',
    'jshshshshshs.gif': 'Chibs Shield',
    'lkfhkkksksksks.gif': 'Chocolate Strawberry Treats',
    'loaitsowor.gif': 'Christmas Cake',
    'oopooioolk.gif': 'Christmas Morning',
    'vbvbxcxcsd.gif': 'Christmas Pop Up Book',
    'ghjgkydksk.gif': 'Christmas Spork',
    'qawsxcdert.gif': 'Christmas Tree',
    'jskhysueo.gif': 'Christmas Tree Yo Yo',
    'hjgkdlpqirbmxvd.gif': 'Clown Muffin',
    'nnannbnncn.gif': 'Corrupted Red Glowing Egg',
    'zzsowfnutg.gif': 'Corrupted Yellow Glowing Egg',
    'flurgoob.gif': 'Cyborg',

    'sqprotidnsoewp.gif': 'Dakota Notepad ',
    'jopoiujkio.gif': 'Decadal Whip',
    'lplpkjkjhy.gif': 'Deluxe Hot Dog',
    'fhsklfhsf.gif': 'Dentist Ticket',
    'bjgyprewqxzdtyh.gif': 'Dentist Treasure Map 09',
    'sjdjsdisoisos.gif': 'Digital Gumball',
    'yghhrupwnb.gif': 'Digital Noises',
    'ccbcchccgc.gif': 'Digital Sugar Cube',
    'xvzbxvdgsfetrsf.gif': 'Dominoes Plushie',
    'pimplsno.gif': 'Drift Wood',
    'ljkhghjpoyjnmbg.gif': 'Dukka Coin Skirt',

    'rewertytre.gif': 'Easter Pancakes',
    'sjsoisososo.gif': 'Ebi Shrimp',
    'hhgyhtyuhtu.gif': 'Elvis Wig',
    'fhslkdfhsdf.gif': 'Empty Plate',
    'zyxtcrvewb.gif': 'Enchanted Magenta Astro Plushie',
    'jsjdkdeoeoe.gif': 'Eucalyptus',
    'jghkmyikyfy.gif': 'Extra Pet Giftbox',
    'predcfvggyujhsq.gif': 'Eye Drops',
    'qbbxoprtjm.gif': 'Eye Egg',
    'swsedrfvbgyhjkl.gif': 'Eye Egg',

    'sosofefivm.gif': 'Falling Petals',
    'ylvisgamlefantaruerkrogh.png': 'Fasoro Ears',
    'ddaonncbrz.gif': 'Feta',
    'didjwawa.gif': 'Figure Skating',
    'pklzdfhgj.gif': 'Filter',
    'xmnuyrgh.gif': 'Fire Shower Charm',
    'siliofop.gif': 'Fire Spell',
    'ikkesakteikkjefort.png': 'Firefly',
    'gfjdghkkgk.gif': 'Fish Heads',
    'spsotnsiotg.gif': 'Flower Bed',
    'oknjuhvgtfxdsaw.gif': 'Flower Beetle',
    'fgskfggfssf.gif': 'Foh',
    'rtmiyghr.gif': 'Football Attack Boot',
    'ityhnfmjkhjgj.gif': 'Frozen Necklace',

    'kpyrvgwwxdppyii.gif': 'Garlic Necklace',
    'bbzxmppkuwttfdg.gif': 'Ghost Floaties',
    'zmxnbvcftghjuyt.gif': 'Ghost Stamp',
    'werfvcxzasdewqa.gif': 'Giant Pitcher',
    'jffffklfllllllllllllll.gif': 'Giant Red Apple',
    'ddasffsgddhyggf.gif': 'Giant Salad',
    'rrybyvgwee.gif': 'Giant Squash',
    'joioososo.gif': 'Gigantic Fairy Doll',
    'pptgkwwbcy.gif': 'GizmOs',
    'cnvbdhfgry.gif': 'Glass Paffuto Plushie',
    'satfdserfv.gif': 'Gold Calla Lily',
    'jiyrwdbnmm.gif': 'Gonk Voodoo Doll',
    'eenbvvioyt.gif': 'Good Witch Skirt',
    'jjkukkkytrew.gif': 'Grey Paffint',
    'iiouikmjmg.gif': 'Green Flow',
    'kkgjdjslsls.gif': 'Green Grint Foot',
    'tykkkeeeikkjedet.png': 'Green Hick Plate',
    'aslkalksjd.gif': 'Green Whisp',
    'tyjhkiskdlroytifv.gif': 'Grilled Fish',
    'einfjopms.gif': 'Grimmus',
    'hjgkfldseruyygt.gif': 'Gummy Scorpion',

    'jentnerkommeroggar.png': 'Heavy Concoction',
    'fuyjjjkjukkiyki.gif': 'Holiday Decorating Guide',
    'cxcxcvcvbv.gif': 'Homeless Fairy Wings',
    'cftyjmkopliuhbg.gif': 'Headless Wig',
    'utokglapsgehrt.gif': 'Hoop Earrings',
    'tyuwqopjnnhj.gif': 'Hula Doll',

    'bvgytokqarcxtuj.gif': 'Ice Fairy Wings',
    'gfgflglmbmiss.gif': 'Icy Cooker',
    'mnpoqwzxtj.gif': 'Injured Jam Tart',
    'kfjdkfjdhs.gif': 'Invisible Soup',
    'mthawpro.gif': 'Iris Seeds',

    'adgjloyecbtgkuz.gif': 'Jar of Bricks',
    'ykgkguicgh.gif': 'Jar of Flowers',
    'hjyukyikyyktk.gif': 'Jar of Roses',
    'bnvmgkhjyutiwpf.gif': 'Jar of Snow',
    'shsisisise.gif': 'Jasmine',
    'hjfdtyuioh.gif': 'Jenoa Wig',
    'flkhkkdkdkdkd.gif': 'Jumping Spider',

    'yfcwaxpkujjbtrf.gif': 'Kawaii Beats',
    'vvuggihhoj.gif': 'King Baspinar Beach Ball',
    'sljdiddmddmd.gif': 'King Baspinar Crown',

    'skddodoso.gif': 'Ladybird',
    'owoqmsmnfjg.gif': 'Leaf Charm',
    'jsjhdhsdsis.gif': 'Leaf Charm',
    'bopadomy.gif': 'Leather Shoes',
    'aloftisheog.gif': 'Light Up Ushunda',
    'eefeegtreg.gif': 'Lightning Shield',
    'fghjhgkkfkg.gif': 'Lump of Coal',
    'rtujtumnyy.gif': 'Lxi Trading Card',

    'uyjhmnbhjurfcde.gif': 'Memory Pets Stamp',
    'jhuukikiki.gif': 'Microphone',
    'sjsduyweyw.gif': 'Motherboard',
    'pqowieurythgnvb.gif': 'Mummy Poera Plushie',
    'hjddjkkdkgkyuky.gif': 'Mutant Food',
    'fldkdjjfjfjfjf.gif': 'Mutant Squid Soup',
    'mmecdefhop.gif': 'Melted Snowman/Snowman Pancakes?',

    'alskwieuvn.gif': 'Naga Stamp',
    'dslhfsldhflkdf.gif': 'New Male Certificate',
    'jsueosldkdkd.gif': 'Newth Book',
    'wdefvgbhytrghjk.gif': 'Newth Box Ice Cream',
    'sjsjeoeofo.gif': 'Newth Necklace',
    'zxcdsaqwerfvbgt.gif': 'Nightmare Notes',
    'ikjjeesydepaaenfinda.png': 'Nutcracker Action Figure',

    'jdhshjsis.gif': 'Obese Fairy Doll',
    'vvyjmtfcsw.gif': 'Orange Soda',
    'jkkkikikkk.gif': 'Orange Watch Battery',
    'grimpond.gif': 'Osafo Backpack',

    'zpxocidksl.gif': 'Parpy',
    'hitmotaf.gif': 'Peachie',
    'dfgdfgggh.gif': 'Peanuts',
    'jjhhgghjkk.gif': 'Peasant Fairy Gloves ',
    'dkfjghrutyvbxpq.gif': 'Peeler',
    'xxpwbyzvcj.gif': 'Peppermint Wig',
    'sanndaaaemmifeari.png': 'Pink Doyow',
    'ekalwofirt.gif': 'Pink Fertiliser',
    'aamlplplkj.gif': 'Pink Jelly Sticky Hand',
    'jigipapa.gif': 'Pistachio Nuts',
    'juiophf.gif': 'Pistachio Nuts',
    'sjddisiisis.gif': 'Plaster',
    'ttjuyyfbvvdferw.gif': 'Plate Cookies',
    'hhfyikkkituidd.gif': 'Poera Tail',
    'ikiijuhhyk.gif': 'Poop',
    'edcvfrtgbn.gif': 'Popstar Scarf',
    'iopoiuyuio.gif': 'Pork Stuffed Peppers',
    'fhjuujhjk.gif': 'Prison Songs',
    'hfklkskeows.gif': 'Psycho Destruction Ballads',
    'kslsosoos.gif': 'Pumpee',
    'ghktktyukim.gif': 'Purple Candycane',
    'jjrghgmcet.gif': 'Purple Flix',
    'yampodot.gif': 'Purple Pucu Potion',
    'sojuenhd.gif': 'Purple Striped Worm',
    'mnbvcfghjuytred.gif': 'Purple Walee Balloon',

    'dvbpuych.gif': 'Quality Trap',

    'nkjigydrawxscfv.gif': 'Radiator Cap',
    'okyhgygrdvvgbfd.gif': 'Recycled Egg',
    'daocriupos.gif': 'Recycling',
    'fbvpwtyb.gif': 'Red Pythonix Lumbar',
    'yuyugbgbvfredxz.gif': 'Rugelach',
    'topafido.gif': 'Rusty Twins Plushie',

    'popoiuyuio.gif': 'Sand Cake',
    'yyhmbjipwq.gif': 'Sea Salt Wig',
    'hjkjhgfghy.gif': 'Sea Salt Wig',
    'etetgdbcgd.gif': 'Sea Water Book',
    'peotitehnmd.gif': 'Seasonal Candycane',
    'hsgfjgcbnmc.gif': 'Seasonal Vase',
    'ertgfdxcvbhuikx.gif': 'Sewers Echlin Plushie',
    'ojiskdhhsu.gif': 'Shiver Me Timbers Scratchcard',
    'kaakjwyggf.gif': 'Silver Bean',
    'ksihfoskfi.gif': 'Silver Necklace',
    'awsedrxdcfvgftg.gif': 'Slime Ice Cream',
    'vbvnvmkioe.gif': 'Snow Skin',
    'opolokoiuj.gif': 'Snow Skin',
    'fhdgkhjgutyrswe.gif': 'Snowball Bombs',
    'lslfotoeue.gif': 'Snowflake Stamp',
    'vxcdgpujeqaxdrg.gif': 'Soda Farl',
    'riiopwttyu.gif': 'Soft Scarf',
    'ghktukutkk.gif': 'Spaghetti Pizza',
    'dsdflhldfhd.gif': 'Spanner',
    'grapmomo.gif': 'Spicy Scallop Handroll',
    'maanydemadennarmankan.png': 'Spooks',
    'zxcvbnmzxc.gif': 'Staff of the Bee',
    'nbvbvcvbnm.gif': 'Staff of Blitzen',
    'lkjlkjhghj.gif': 'Starry Blueberry Pie',
    'fgjetyujdhmvj.gif': 'Starry Viotto Potion',
    'skfjjfiem.gif': 'Strawberry Gumball',
    'sksoisoos.gif': 'Strawberry Lolly',
    'fjfjdkdksl.gif': 'Strobe Pancakes',
    'ddppddkkij.gif': 'Summer Adorab',
    'eoronbkdo.gif': 'Sword of King Baspinar V',

    'uubbnnrrgh.gif': 'Teen Party Hits',
    'hffahlksqop.gif': 'Tentacle Hors Doeuvres',
    'mjdyjtumkfm.gif': 'Test Your Strength Potato',
    'oofjgjgjgjgjg.gif': 'The Fates Scissor Book',
    'hssksksirtshs.gif': 'The Lonely Spider',
    'ytdukdukgggggggg.gif': 'Toothbrush',
    'ghfjdksleorityp.gif': 'Troll Blaster',
    'wewertrtyu.gif': 'Trotter Sword',
    'jjjdjieiwowmcm.gif': 'Trotter Sword',
    'zrtypumo.gif': 'Trowel',
    'frftfgfvfc.gif': 'Tundra Stamp',

    'uobhrdxqpkpkgyy.gif': 'UFO Stamp',

    'ifhgmsyrr.gif': "Valentine's Day",
    'ectofrog.gif': 'Vamps',
    'jfllhlhllksksksk.gif': 'Vintage Diary',

    'llpllokiol.gif': 'Well Groomed Wig',
    'djkmykmkyimkd.gif': 'Wheelee',
    'vpwygxot.gif': 'Whirlpool Treasure Map 06',
    'gjepcnusdy.gif': 'White Fly Trap',
    'xcvbgfdswertpob.gif': 'Winter Costume',

    'lorufnnsdmd.gif': 'Xor Stamp',

    'asdcvbhjkiopytr.gif': 'Yellow Osafo Marshmallow',

    'tuyiuopkhjgdfsw.gif': 'Zarplet',
    'bbjrwety.gif': 'Zetlian Figurine',
    'ggoggptyhg.gif': 'Zoink Ice Sculpture',
    'gimpwort.gif': 'Zoink Ice Sculpture',
  }

  const todaysItem = document
    .querySelector('.middleit .marapets_border')
    .src.split('/')[4]

  const itemInput = document.querySelector("input[name='item']")

  knownItems[todaysItem]
    ? (itemInput.value = knownItems[todaysItem])
    : (itemInput.value = 'Mystery') // Don't know the item., just put in "Mystery"
})()
