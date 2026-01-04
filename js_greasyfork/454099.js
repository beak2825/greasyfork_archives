// ==UserScript==
// @name        GazelleGames items crafted info
// @namespace   grasspeace
// @include     /^https:\/\/gazellegames\.net\/user\.php\?(page=[0-9]+&)?action=crafteditems(&userid=[0-9]*)?.*/
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @version     1.0.20
// @description Adds crafted/uncrafted tracking
// @author      grasspeace
// @run-at      document-start
// @inject-into content
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/454099/GazelleGames%20items%20crafted%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/454099/GazelleGames%20items%20crafted%20info.meta.js
// ==/UserScript==

(async function () {
	"use strict";
  // full item list complements of Madbudgie and kaktus
  // curl https://gazellegames.net/api.php?request=items&type=crafted_recipes&key=APIKEYHERE | jq -c '(.response | .[] |= del(.uses)) | sort_by(.id)'
  const items = [{"id":1,"name":"Garlic Tincture"},{"id":2,"name":"Download-Reduction Potion Sampler"},{"id":3,"name":"Small Download-Reduction Potion"},{"id":4,"name":"Download-Reduction Potion"},{"id":5,"name":"Large Download-Reduction Potion"},{"id":6,"name":"Small Upload Potion"},{"id":7,"name":"Upload Potion Sampler"},{"id":8,"name":"Upload Potion"},{"id":9,"name":"Large Upload Potion"},{"id":10,"name":"Glass Shards (Pile of Sand)"},{"id":11,"name":"Test Tube"},{"id":12,"name":"Vial (Glass Shards)"},{"id":13,"name":"Bowl (Glass Shards)"},{"id":16,"name":"Impure Bronze Bar (Lump of Clay)"},{"id":17,"name":"Bronze Bar (Bronze Alloy Mix)"},{"id":18,"name":"Iron Bar (Iron Ore)"},{"id":19,"name":"Gold Bar"},{"id":20,"name":"Mithril Bar"},{"id":21,"name":"Adamantium Bar"},{"id":22,"name":"Quartz Bar (Quartz Dust)"},{"id":23,"name":"Jade Bar"},{"id":24,"name":"Amethyst Bar"},{"id":25,"name":"Steel Bar (Iron Ore)"},{"id":27,"name":"Impure Bronze Claymore (Impure Bronze Bar)"},{"id":28,"name":"Impure Bronze Cuirass (Impure Bronze Bar)"},{"id":29,"name":"Bronze Cuirass (Bronze Bar)"},{"id":30,"name":"Iron Cuirass (Iron Bar)"},{"id":31,"name":"Steel Cuirass (Steel Bar)"},{"id":32,"name":"Gold Cuirass (Gold Bar)"},{"id":33,"name":"Mithril Cuirass (Mithril Bar)"},{"id":34,"name":"Adamantium Cuirass (Adamantium Bar)"},{"id":35,"name":"Quartz Chainmail (Quartz Bar)"},{"id":36,"name":"Jade Chainmail (Jade Bar)"},{"id":37,"name":"Amethyst Chainmail (Amethyst Bar)"},{"id":48,"name":"Impure Bronze Cuirass (Repair)"},{"id":50,"name":"Bronze Cuirass (Repair)"},{"id":51,"name":"Iron Cuirass (Repair)"},{"id":52,"name":"Steel Cuirass (Repair)"},{"id":53,"name":"Gold Cuirass (Repair)"},{"id":54,"name":"Mithril Cuirass (Repair)"},{"id":56,"name":"Adamantium Cuirass (Repair)"},{"id":57,"name":"Quartz Chainmail (Repair)"},{"id":58,"name":"Jade Chainmail (Repair)"},{"id":62,"name":"Amethyst Chainmail (Repair)"},{"id":68,"name":"Peppermint Hot Chocolate"},{"id":69,"name":"Snowball"},{"id":73,"name":"Hot Chocolate (Peppermint Hot Chocolate)"},{"id":74,"name":"Large Snowball"},{"id":76,"name":"Pile of Charcoal"},{"id":77,"name":"Gold Power Gloves (Repair)"},{"id":85,"name":"The Golden Throne"},{"id":86,"name":"The Biggest Banhammer"},{"id":87,"name":"The Staff Beauty Parlor"},{"id":88,"name":"The Realm of Staff"},{"id":89,"name":"Portal Gun"},{"id":90,"name":"Rick&#39;s Portal Gun"},{"id":91,"name":"Space Wormhole"},{"id":92,"name":"Interdimensional Portal"},{"id":93,"name":"Super Mushroom"},{"id":94,"name":"Fire Flower"},{"id":95,"name":"Penguin Suit"},{"id":96,"name":"Goal Pole"},{"id":97,"name":"Glass Shards (Snad)"},{"id":98,"name":"Mystery Box 1"},{"id":99,"name":"Din&#39;s Lootbox"},{"id":103,"name":"Glass Shards (Test Tube)"},{"id":104,"name":"Glass Shards x2"},{"id":105,"name":"Glass Shards x3"},{"id":106,"name":"Random Lvl2 Staff Card"},{"id":114,"name":"Steel Bar (Iron Bar)"},{"id":115,"name":"Nayru&#39;s Lootbox"},{"id":116,"name":"Farore&#39;s Lootbox"},{"id":117,"name":"Random Lootbox (Din, Farore, or Nayru)"},{"id":160,"name":"Bronze Dwarf Companion"},{"id":161,"name":"Iron Dwarf Companion (Bronze Dwarf Companion)"},{"id":162,"name":"Gold Dwarf Companion"},{"id":163,"name":"Mithril Dwarf Companion (Gold Dwarf Companion)"},{"id":164,"name":"Adamantium Dwarf Companion"},{"id":167,"name":"Carbon-Crystalline Quartz"},{"id":168,"name":"Carbon-Crystalline Quartz Necklace"},{"id":169,"name":"Quartz Loop of Fortune (Quartz Bar)"},{"id":170,"name":"Quartz Loop of Aggression (Quartz Bar)"},{"id":171,"name":"Quartz Loop of Luck (Quartz Bar)"},{"id":172,"name":"Jade Loop of Fortune (Jade Bar)"},{"id":173,"name":"Jade Loop of Aggression (Jade Bar)"},{"id":174,"name":"Jade Loop of Luck (Jade Bar)"},{"id":175,"name":"Amethyst Loop of Fortune (Amethyst Bar)"},{"id":176,"name":"Amethyst Loop of Aggression (Amethyst Bar)"},{"id":177,"name":"Amethyst Loop of Luck (Amethyst Bar)"},{"id":178,"name":"Gods Cradle"},{"id":179,"name":"Gods Pennant"},{"id":180,"name":"Unity Flame Necklet"},{"id":181,"name":"Exquisite Constellation of Rubies"},{"id":182,"name":"Exquisite Constellation of Sapphires"},{"id":183,"name":"Exquisite Constellation of Emeralds"},{"id":184,"name":"Quartz Prism of Fortune (Quartz Bar)"},{"id":185,"name":"Quartz Prism of Luck (Quartz Bar)"},{"id":186,"name":"Quartz Prism of Aggression (Quartz Bar)"},{"id":187,"name":"Jade Trifocal of Aggression (Jade Bar)"},{"id":188,"name":"Jade Trifocal of Luck (Jade Bar)"},{"id":189,"name":"Jade Trifocal of Fortune (Jade Bar)"},{"id":190,"name":"Amethyst Totality of Aggression (Amethyst Bar)"},{"id":191,"name":"Amethyst Totality of Luck (Amethyst Bar)"},{"id":192,"name":"Amethyst Totality of Fortune (Amethyst Bar)"},{"id":193,"name":"Ruby-Grained Baguette"},{"id":194,"name":"Garlic Ruby-Baguette"},{"id":198,"name":"Unity Flame Band"},{"id":199,"name":"Stormrage Pumpkin"},{"id":200,"name":"Russian Pumpkin"},{"id":201,"name":"Green Mario Pumpkin"},{"id":202,"name":"Lame Pumpkin Trio"},{"id":203,"name":"Halloween Pumpkin Badge"},{"id":229,"name":"Dwarven Disco Ball"},{"id":230,"name":"Bronze Claymore (Bronze Bar)"},{"id":231,"name":"Iron Claymore (Iron Bar)"},{"id":232,"name":"Steel Claymore (Steel Bar)"},{"id":233,"name":"Gold Claymore (Gold Bar)"},{"id":234,"name":"Mithril Claymore (Mithril Bar)"},{"id":235,"name":"Adamantium Claymore (Adamantium Bar)"},{"id":236,"name":"Quartz Khopesh (Quartz Bar)"},{"id":237,"name":"Jade Khopesh (Jade Bar)"},{"id":238,"name":"Amethyst Khopesh (Amethyst Bar)"},{"id":239,"name":"Amethyst Khopesh (Repair)"},{"id":240,"name":"Jade Khopesh (Repair)"},{"id":241,"name":"Quartz Khopesh (Repair)"},{"id":242,"name":"Adamantium Claymore (Repair)"},{"id":243,"name":"Mithril Claymore (Repair)"},{"id":244,"name":"Gold Claymore (Repair)"},{"id":245,"name":"Steel Claymore (Repair)"},{"id":246,"name":"Iron Claymore (Repair)"},{"id":247,"name":"Bronze Claymore (Repair)"},{"id":248,"name":"Impure Bronze Claymore (Repair)"},{"id":249,"name":"Impure Bronze Bar x2"},{"id":250,"name":"Iron Bar (Steel Bar)"},{"id":251,"name":"Bronze Alloy Mix"},{"id":252,"name":"Bronze Alloy Mix x2"},{"id":253,"name":"Iron Ore x2 (Iron Bar)"},{"id":254,"name":"Iron Ore x2 (Steel Bar)"},{"id":255,"name":"Gold Ore x2"},{"id":256,"name":"Mithril Ore x2"},{"id":257,"name":"Adamantium Ore x2"},{"id":258,"name":"Quartz Dust x2"},{"id":259,"name":"Jade Dust x2"},{"id":260,"name":"Amethyst Dust x2"},{"id":261,"name":"Bronze Cuirass (Impure Bronze Cuirass)"},{"id":262,"name":"Bronze Claymore (Impure Bronze Claymore)"},{"id":263,"name":"Steel Cuirass (Iron Cuirass)"},{"id":264,"name":"Steel Claymore (Iron Claymore)"},{"id":265,"name":"Iron Cuirass (Bronze Cuirass)"},{"id":266,"name":"Gold Cuirass (Steel Cuirass)"},{"id":267,"name":"Mithril Cuirass (Gold Cuirass)"},{"id":268,"name":"Adamantium Cuirass (Mithril Cuirass)"},{"id":269,"name":"Iron Claymore (Bronze Claymore)"},{"id":270,"name":"Gold Claymore (Steel Claymore)"},{"id":271,"name":"Mithril Claymore (Gold Claymore)"},{"id":272,"name":"Adamantium Claymore (Mithril Claymore)"},{"id":273,"name":"Jade Chainmail (Quartz Chainmail)"},{"id":274,"name":"Amethyst Chainmail (Jade Chainmail)"},{"id":275,"name":"Jade Khopesh (Quartz Khopesh)"},{"id":276,"name":"Amethyst Khopesh (Jade Khopesh)"},{"id":277,"name":"Impure Bronze Bar (Impure Bronze Cuirass)"},{"id":278,"name":"Bronze Bar (Bronze Cuirass)"},{"id":279,"name":"Iron Bar x2 (Iron Cuirass)"},{"id":280,"name":"Steel Bar x2 (Steel Cuirass)"},{"id":281,"name":"Gold Bar x2 (Gold Cuirass)"},{"id":282,"name":"Mithril Bar x2 (Mithril Cuirass)"},{"id":283,"name":"Adamantium Bar x2 (Adamantium Cuirass)"},{"id":284,"name":"Impure Bronze Bar (Impure Bronze Claymore)"},{"id":285,"name":"Bronze Bar (Bronze Claymore)"},{"id":286,"name":"Iron Bar x2 (Iron Claymore)"},{"id":287,"name":"Steel Bar x2 (Steel Claymore)"},{"id":288,"name":"Gold Bar x2 (Gold Claymore)"},{"id":289,"name":"Mithril Bar x2 (Mithril Claymore)"},{"id":290,"name":"Adamantium Bar x2 (Adamantium Claymore)"},{"id":291,"name":"Quartz Bar (Quartz Chainmail)"},{"id":292,"name":"Jade Bar x2 (Jade Chainmail)"},{"id":293,"name":"Amethyst Bar x2 (Amethyst Chainmail)"},{"id":294,"name":"Quartz Bar (Quartz Khopesh)"},{"id":295,"name":"Jade Bar x2 (Jade Khopesh)"},{"id":296,"name":"Amethyst Bar x2 (Amethyst Khopesh)"},{"id":297,"name":"Vial (Quartz Dust)"},{"id":298,"name":"Bowl (Jade Dust)"},{"id":299,"name":"Artisan Ruby-Baguette"},{"id":300,"name":"Small Luck Potion"},{"id":301,"name":"Large Luck Potion"},{"id":302,"name":"Hot Chocolate (Christmas Spices)"},{"id":303,"name":"Snowman"},{"id":304,"name":"Hyper Realistic Eggnog"},{"id":305,"name":"Abominable Santa"},{"id":306,"name":"Icy Kisses"},{"id":307,"name":"Sexy Santa"},{"id":308,"name":"Christmas Cheer"},{"id":309,"name":"Christmas Icy Badge"},{"id":310,"name":"Jazzier Pants"},{"id":311,"name":"Disco Pants"},{"id":312,"name":"Devil&#39;s Pantaloons"},{"id":317,"name":"Emerald-Grained Baguette"},{"id":318,"name":"Garlic Emerald-Baguette"},{"id":319,"name":"Artisan Emerald-Baguette"},{"id":320,"name":"Gazellian Emerald-Baguette"},{"id":321,"name":"Empowered Quartz Loop of Luck (Quartz Loop of Luck)"},{"id":322,"name":"Empowered Jade Loop of Luck (Jade Loop of Luck)"},{"id":323,"name":"Empowered Amethyst Loop of Luck (Amethyst Loop of Luck)"},{"id":324,"name":"Empowered Quartz Loop of Aggression (Quartz Loop of Aggression)"},{"id":325,"name":"Empowered Jade Loop of Aggression (Jade Loop of Aggression)"},{"id":326,"name":"Empowered Jade Loop of Fortune (Jade Loop of Fortune)"},{"id":327,"name":"Empowered Amethyst Loop of Aggression (Amethyst Loop of Aggression)"},{"id":328,"name":"Empowered Amethyst Loop of Fortune (Amethyst Loop of Fortune)"},{"id":329,"name":"Empowered Quartz Prism of Aggression (Quartz Prism of Aggression)"},{"id":330,"name":"Empowered Quartz Prism of Luck (Quartz Prism of Luck)"},{"id":331,"name":"Empowered Quartz Prism of Fortune (Quartz Prism of Fortune)"},{"id":332,"name":"Empowered Jade Trifocal of Aggression (Jade Trifocal of Aggression)"},{"id":333,"name":"Empowered Jade Trifocal of Luck (Jade Trifocal of Luck)"},{"id":334,"name":"Empowered Jade Trifocal of Fortune (Jade Trifocal of Fortune)"},{"id":335,"name":"Empowered Amethyst Totality of Aggression (Amethyst Totality of Aggression)"},{"id":336,"name":"Empowered Amethyst Totality of Luck (Amethyst Totality of Luck)"},{"id":337,"name":"Empowered Amethyst Totality of Fortune (Amethyst Totality of Fortune)"},{"id":338,"name":"Empowered Quartz Loop of Fortune (Quartz Loop of Fortune)"},{"id":339,"name":"Quartz Loop of Fortune (Empowered Quartz Loop of Fortune)"},{"id":340,"name":"Jade Loop of Fortune (Empowered Jade Loop of Fortune)"},{"id":341,"name":"Amethyst Loop of Fortune (Empowered Amethyst Loop of Fortune)"},{"id":342,"name":"Amethyst Loop of Aggression (Empowered Amethyst Loop of Aggression)"},{"id":343,"name":"Jade Loop of Aggression (Empowered Jade Loop of Aggression)"},{"id":344,"name":"Quartz Loop of Aggression (Empowered Quartz Loop of Aggression)"},{"id":345,"name":"Amethyst Loop of Luck (Empowered Amethyst Loop of Luck)"},{"id":346,"name":"Jade Loop of Luck (Empowered Jade Loop of Luck)"},{"id":347,"name":"Quartz Loop of Luck (Empowered Quartz Loop of Luck)"},{"id":348,"name":"Quartz Prism of Aggression (Empowered Quartz Prism of Aggression)"},{"id":349,"name":"Quartz Prism of Luck (Empowered Quartz Prism of Luck)"},{"id":350,"name":"Quartz Prism of Fortune (Empowered Quartz Prism of Fortune)"},{"id":351,"name":"Jade Trifocal of Aggression (Empowered Jade Trifocal of Aggression)"},{"id":352,"name":"Jade Trifocal of Luck (Empowered Jade Trifocal of Luck)"},{"id":353,"name":"Jade Trifocal of Fortune (Empowered Jade Trifocal of Fortune)"},{"id":354,"name":"Amethyst Totality of Aggression (Empowered Amethyst Totality of Aggression)"},{"id":355,"name":"Amethyst Totality of Luck (Empowered Amethyst Totality of Luck)"},{"id":356,"name":"Amethyst Totality of Fortune (Empowered Amethyst Totality of Fortune)"},{"id":364,"name":"Empowered Quartz Loop of Luck (Repair)"},{"id":365,"name":"Empowered Jade Loop of Luck (Repair)"},{"id":366,"name":"Empowered Amethyst Loop of Luck (Repair)"},{"id":367,"name":"Empowered Quartz Loop of Aggression (Repair)"},{"id":368,"name":"Empowered Jade Loop of Aggression (Repair)"},{"id":369,"name":"Empowered Jade Loop of Fortune (Repair)"},{"id":370,"name":"Empowered Amethyst Loop of Aggression (Repair)"},{"id":371,"name":"Empowered Amethyst Loop of Fortune (Repair)"},{"id":372,"name":"Empowered Quartz Prism of Luck (Repair)"},{"id":373,"name":"Empowered Quartz Prism of Fortune (Repair)"},{"id":374,"name":"Empowered Jade Trifocal of Aggression (Repair)"},{"id":375,"name":"Empowered Jade Trifocal of Luck (Repair)"},{"id":376,"name":"Empowered Jade Trifocal of Fortune (Repair)"},{"id":377,"name":"Empowered Amethyst Totality of Aggression (Repair)"},{"id":378,"name":"Empowered Amethyst Totality of Luck (Repair)"},{"id":379,"name":"Empowered Amethyst Totality of Fortune (Repair)"},{"id":380,"name":"Empowered Quartz Loop of Fortune (Repair)"},{"id":381,"name":"Empowered Quartz Prism of Aggression (Repair)"},{"id":383,"name":"AdventureClub Backpack 3 Slots "},{"id":384,"name":"AdventureClub Backpack 4 Slots "},{"id":385,"name":"Alien Gazelle"},{"id":386,"name":"Lucky Gazelle"},{"id":387,"name":"Future Gazelle"},{"id":388,"name":"Supreme Gazelle"},{"id":389,"name":"9th Birthday Badge"},{"id":393,"name":"AdventureClub Attack Parasite"},{"id":394,"name":"AdventureClub Attack Regenerate"},{"id":395,"name":"AdventureClub Attack Hypnosis"},{"id":396,"name":"AdventureClub Attack Muddle"},{"id":397,"name":"AdventureClub Attack Dark Orb"},{"id":398,"name":"AdventureClub Attack Burst of Light "},{"id":399,"name":"AdventureClub Equipment Scrappy Gauntlets"},{"id":400,"name":"Golden Umaro"},{"id":401,"name":"Ghost Billy"},{"id":402,"name":"[Au]zelle Pet"},{"id":403,"name":"Ghost Billie"},{"id":404,"name":"Umaro"},{"id":405,"name":"Gazelle Pet"},{"id":406,"name":"Impure Bronze Armguards"},{"id":407,"name":"Bronze Armguards"},{"id":408,"name":"Iron Armguards"},{"id":409,"name":"Steel Armguards"},{"id":410,"name":"Gold Armguards (Gold Bar)"},{"id":411,"name":"Mithril Armguards (Gold Armguards)"},{"id":412,"name":"Adamantium Armguards (Mithril Armguards)"},{"id":413,"name":"Gold Armguards (Mithril Armguards)"},{"id":414,"name":"Gold Armguards (Adamantium Armguards)"},{"id":415,"name":"Adamantium Armguards (Repair)"},{"id":416,"name":"Mithril Armguards (Repair)"},{"id":417,"name":"Impure Bronze Segmentata (Impure Bronze Bar)"},{"id":418,"name":"Bronze Segmentata (Bronze Bar)"},{"id":419,"name":"Iron Segmentata (Iron Bar)"},{"id":420,"name":"Steel Segmentata (Steel Bar)"},{"id":421,"name":"Gold Segmentata (Gold Bar)"},{"id":422,"name":"Mithril Segmentata (Mithril Bar)"},{"id":423,"name":"Adamantium Segmentata (Adamantium Bar)"},{"id":424,"name":"Quartz Lamellar (Quartz Bar)"},{"id":425,"name":"Jade Lamellar (Jade Bar)"},{"id":426,"name":"Amethyst Lamellar (Amethyst Bar)"},{"id":427,"name":"Amethyst Guandao (Amethyst Bar)"},{"id":428,"name":"Jade Guandao (Jade Bar)"},{"id":429,"name":"Quartz Guandao (Quartz Bar)"},{"id":430,"name":"Adamantium Billhook (Adamantium Bar)"},{"id":431,"name":"Mithril Billhook (Mithril Bar)"},{"id":432,"name":"Gold Billhook (Gold Bar)"},{"id":433,"name":"Steel Billhook (Steel Bar)"},{"id":434,"name":"Iron Billhook (Iron Bar)"},{"id":435,"name":"Bronze Billhook (Bronze Bar)"},{"id":436,"name":"Impure Bronze Billhook (Impure Bronze Bar)"},{"id":437,"name":"Impure Bronze Cuirass (Impure Bronze Segmentata)"},{"id":438,"name":"Bronze Cuirass (Bronze Segmentata)"},{"id":439,"name":"Iron Cuirass (Iron Segmentata)"},{"id":440,"name":"Steel Cuirass (Steel Segmentata)"},{"id":441,"name":"Gold Cuirass (Gold Segmentata)"},{"id":442,"name":"Mithril Cuirass (Mithril Segmentata)"},{"id":443,"name":"Adamantium Cuirass (Adamantium Segmentata)"},{"id":444,"name":"Quartz Chainmail (Quartz Lamellar)"},{"id":445,"name":"Jade Chainmail (Jade Lamellar)"},{"id":446,"name":"Amethyst Chainmail (Amethyst Lamellar)"},{"id":447,"name":"Amethyst Khopesh (Amethyst Guandao)"},{"id":448,"name":"Jade Khopesh (Jade Guandao)"},{"id":449,"name":"Quartz Khopesh (Quartz Guandao)"},{"id":450,"name":"Adamantium Claymore (Adamantium Billhook)"},{"id":451,"name":"Mithril Claymore (Mithril Billhook)"},{"id":452,"name":"Gold Claymore (Gold Billhook)"},{"id":453,"name":"Steel Claymore (Steel Billhook)"},{"id":454,"name":"Iron Claymore (Iron Billhook)"},{"id":455,"name":"Bronze Claymore (Bronze Billhook)"},{"id":456,"name":"Impure Bronze Claymore (Impure Bronze Billhook)"},{"id":457,"name":"Impure Bronze Segmentata (Impure Bronze Cuirass)"},{"id":458,"name":"Bronze Segmentata (Bronze Cuirass)"},{"id":459,"name":"Iron Segmentata (Iron Cuirass)"},{"id":460,"name":"Steel Segmentata (Steel Cuirass)"},{"id":461,"name":"Gold Segmentata (Gold Cuirass)"},{"id":462,"name":"Mithril Segmentata (Mithril Cuirass)"},{"id":463,"name":"Adamantium Segmentata (Adamantium Cuirass)"},{"id":464,"name":"Quartz Lamellar (Quartz Chainmail)"},{"id":465,"name":"Jade Lamellar (Jade Chainmail)"},{"id":466,"name":"Amethyst Lamellar (Amethyst Chainmail)"},{"id":467,"name":"Impure Bronze Billhook (Impure Bronze Claymore)"},{"id":468,"name":"Bronze Billhook (Bronze Claymore)"},{"id":469,"name":"Iron Billhook (Iron Claymore)"},{"id":470,"name":"Steel Billhook (Steel Claymore)"},{"id":471,"name":"Gold Billhook (Gold Claymore)"},{"id":472,"name":"Mithril Billhook (Mithril Claymore)"},{"id":473,"name":"Adamantium Billhook (Adamantium Claymore)"},{"id":474,"name":"Quartz Guandao (Quartz Khopesh)"},{"id":475,"name":"Jade Guandao (Jade Khopesh)"},{"id":476,"name":"Amethyst Guandao (Amethyst Khopesh)"},{"id":477,"name":"Pile of Sand"},{"id":478,"name":"Dwarven Disco Plate"},{"id":481,"name":"AdventureClub Backpack 6 Slots"},{"id":482,"name":"AdventureClub Attack Burning Ash Cloud"},{"id":483,"name":"AdventureClub Equipment Troll Tooth Necklace"},{"id":484,"name":"Flame Badge"},{"id":485,"name":"Impure Bronze Power Gloves"},{"id":486,"name":"Bronze Power Gloves"},{"id":487,"name":"Iron Power Gloves"},{"id":488,"name":"Steel Power Gloves"},{"id":489,"name":"Gold Power Gloves (Steel Power Gloves)"},{"id":490,"name":"Mithril Power Gloves (Gold Power Gloves)"},{"id":491,"name":"Adamantium Power Gloves (Mithril Power Gloves)"},{"id":492,"name":"Mithril Power Gloves (Repair)"},{"id":493,"name":"Adamantium Power Gloves (Repair)"},{"id":494,"name":"Quartz Dust Dwarf Companion"},{"id":495,"name":"Jade Dust Dwarf Companion"},{"id":496,"name":"Amethyst Dust Dwarf Companion"},{"id":497,"name":"Iron Dwarf Companion (Quartz Dust Dwarf Companion)"},{"id":498,"name":"Mithril Dwarf Companion (Jade Dust Dwarf Companion)"},{"id":499,"name":"Nayru&#39;s Username"},{"id":500,"name":"Farore&#39;s Username"},{"id":501,"name":"Din&#39;s Username"},{"id":502,"name":"Pets - 2x Blue Slime into 1x Green Slime"},{"id":503,"name":"Halloween Cupcake Card Memory Boost"},{"id":504,"name":"Halloween Cupcake Card Skultilla the Cake Guard"},{"id":505,"name":"Halloween Cupcake Card Who Eats Whom"},{"id":506,"name":"Halloween Cupcake Badge"},{"id":508,"name":"Christmas Gingerbread Card Doomslayer"},{"id":509,"name":"Christmas Gingerbread Card Mario Christmas"},{"id":510,"name":"Christmas Gingerbread Card Baby Yoda"},{"id":511,"name":"Valentine Dull Card Kirlia and Meloetta"},{"id":512,"name":"Valentine Dull Card Dom and Maria"},{"id":513,"name":"Valentine Dull Card Mr and Mrs Pac Man"},{"id":514,"name":"Valentine Sexy Card Angelise Reiter"},{"id":515,"name":"Valentine Sexy Card Sophitia"},{"id":516,"name":"Valentine Sexy Card Yennefer"},{"id":517,"name":"Birthday Gazelle Card A Fair Fight"},{"id":518,"name":"Birthday Gazelle Card What an Adventure"},{"id":519,"name":"Birthday Gazelle Card After Party"},{"id":520,"name":"10th Birthday Gazelle Badge"},{"id":523,"name":"April Mystery Big Pile of Metal Bars"},{"id":524,"name":"Christmas Games Card Dirt 5"},{"id":525,"name":"Christmas Games Card Gazelle"},{"id":526,"name":"Christmas Games Card Mafia"},{"id":527,"name":"Christmas Consumable Lucky Four-Leaves Holly"},{"id":528,"name":"Christmas Bauble Badge"},{"id":529,"name":"Christmas Impostor Bauble Box"},{"id":530,"name":"Christmas Impostor Bauble Badge"},{"id":531,"name":"Symbol of Love (Ruby)"},{"id":532,"name":"Symbol of Love (Valentine Rose)"},{"id":533,"name":"Cupid&#39;s Magical Feather"},{"id":534,"name":"Cupid&#39;s Winged Boots (Symbol of Love)"},{"id":535,"name":"Cupid&#39;s Winged Boots of Luck (Cupid&#39;s Winged Boots)"},{"id":536,"name":"Cupid&#39;s Winged Boots of Luck (Repair)"},{"id":537,"name":"Cupid&#39;s Winged Boots of Aggression (Cupid&#39;s Winged Boots)"},{"id":538,"name":"Cupid&#39;s Winged Boots of Aggression (Repair)"},{"id":539,"name":"Cupid&#39;s Winged Boots of Fortune (Cupid&#39;s Winged Boots)"},{"id":540,"name":"Cupid&#39;s Winged Boots of Fortune (Repair)"},{"id":541,"name":"Cupid&#39;s Winged Boots (Cupid&#39;s Winged Boots of Luck)"},{"id":542,"name":"Cupid&#39;s Winged Boots (Cupid&#39;s Winged Boots of Aggression)"},{"id":543,"name":"Cupid&#39;s Winged Boots (Cupid&#39;s Winged Boots of Fortune)"},{"id":544,"name":"11th Birthday Gazelle Badge"},{"id":545,"name":"11th Birthday Trading Cards Dr. Mario"},{"id":546,"name":"11th Birthday Trading Cards Link"},{"id":547,"name":"11th Birthday Trading Cards Kirby"},{"id":548,"name":"11th Birthday Trading Cards Black Mage"},{"id":549,"name":"Alien Baby from Dwarf"},{"id":550,"name":"UFO from Mario"},{"id":551,"name":"Pets - Blue &amp; Green Slime + Ruby + Sand into Rainbow Slime"},{"id":552,"name":"Summer Event Shake Can&#39;t Believe This is Cherry"},{"id":553,"name":"Summer Event Shake &quot;Grape&quot; Milkshake"},{"id":554,"name":"Summer Event Shake Coco-cooler Milkshake"},{"id":555,"name":"Summer Event Shake Cinnamon Milkshake"},{"id":556,"name":"Summer Event Shake Rocky Road Milkshake"},{"id":557,"name":"Summer Event Shake Neapolitan Milkshake"},{"id":558,"name":"Pets - Summer Event - Lost Garlic Dwarf Companion"},{"id":559,"name":"Pets - Summer Event - Lost Farmer Dwarf Companion"},{"id":560,"name":"Haunted Tombstone Halloween Badge 2021"},{"id":561,"name":"Ghostbusters"},{"id":562,"name":"Boo"},{"id":563,"name":"King Boo"},{"id":564,"name":"Winter 2021 - Cards - Grievous"},{"id":565,"name":"Winter 2021 - Cards - Mando"},{"id":566,"name":"Winter 2021 - Cards - Doomguy "},{"id":567,"name":"Winter 2021 - Cards - Have a Breathtaking Christmas "},{"id":568,"name":"Winter 2021 - Secret"},{"id":569,"name":"Winter 2021 - Pets - Small Snowman"},{"id":570,"name":"Winter 2021 - Pets - Medium Snowman"},{"id":571,"name":"Winter 2021 - Pets - Big Snowman"},{"id":572,"name":"Cupid&#39;s Gold Wings"},{"id":573,"name":"Cupid&#39;s Mithril Wings"},{"id":574,"name":"Cupid&#39;s Adamantium Wings"},{"id":575,"name":"Valentine&#39;s Day 2022 Badge"},{"id":576,"name":"Disassembled Adamantium Wings"},{"id":577,"name":"Disassembled Mithril Wings"},{"id":578,"name":"Disassembled Gold Wings"},{"id":579,"name":"Disassembled Cupid&#39;s Cradle"},{"id":580,"name":"Cupid&#39;s Gold Wings (Repair)"},{"id":581,"name":"Cupid&#39;s Mithril Wings (Repair)"},{"id":582,"name":"Cupid&#39;s Adamantium Wings (Repair)"},{"id":583,"name":"Special Box"},{"id":584,"name":"Cupid&#39;s Wings (Repair)"},{"id":585,"name":"Cupid&#39;s Cradle"},{"id":586,"name":"IRC Voice (8 Weeks)"},{"id":587,"name":"IRC Voice (8 Weeks)"},{"id":588,"name":"IRC Voice (1 Year) (IRC Voice (8 Weeks))"},{"id":589,"name":"Gold Dragon"},{"id":590,"name":"12th Birthday Cake Badge"},{"id":591,"name":"Red Dragon"},{"id":592,"name":"Green Dragon"},{"id":593,"name":"Blue Dragon"},{"id":594,"name":"Sacred Cuirass (B) (Adamantium Cuirass)"},{"id":595,"name":"Sacred Cuirass (B) (Repair)"},{"id":596,"name":"Sacred Cuirass (G) (Adamantium Cuirass)"},{"id":597,"name":"Sacred Cuirass (G) (Repair)"},{"id":598,"name":"Sacred Cuirass (R) (Adamantium Cuirass)"},{"id":599,"name":"Sacred Cuirass (R) (Repair)"},{"id":600,"name":"Sacred Cuirass (RG) (Adamantium Cuirass)"},{"id":601,"name":"Sacred Cuirass (RG) (Repair)"},{"id":602,"name":"Sacred Cuirass (RB) (Adamantium Cuirass)"},{"id":603,"name":"Sacred Cuirass (RB) (Repair)"},{"id":604,"name":"Sacred Cuirass (GB) (Adamantium Cuirass)"},{"id":605,"name":"Sacred Cuirass (GB) (Repair)"},{"id":606,"name":"Sacred Cuirass (RGB) (Adamantium Cuirass)"},{"id":607,"name":"Sacred Cuirass (RGB) (Repair)"},{"id":608,"name":"Halloween Boo Badge"},{"id":609,"name":"Sacred Claymore (Adamantium Claymore)"},{"id":610,"name":"Sacred Claymore (Repair)"},{"id":613,"name":"Winter 2022 - Badges - Christmas Tree Badge"}, {"id":614,"name":"Winter 2022 - Secret"},{"id":615,"name":"Superior Luck Potion"},{"id":616,"name":"13th Birthday Flaming Knife Badge"},{"id":617,"name":"Pets - Pumpkin Dwarf"},{"id":618,"name":"Summer 2023 Pirate Sledge"},{"id":619,"name":"Summer 2023 Pirate Morpho"},{"id":620,"name":"Summer 2023 Pirate Jloth &amp; Bloth"},{"id":621,"name":"Summer 2023 Secret Badge"},{"id":622,"name":"Summer 2023 Secret"},{"id":623,"name":"Halloween 2023 Elixir of the Forbidden"},{"id":624,"name":"Halloween 2023 Holy Hand Grenade Badge"},{"id":625,"name":"Halloween 2023 Ritual of The Dark Servant"},{"id":626,"name":"Winter 2023 - Prismatic Shard"},{"id":627,"name":"Winter 2023 - Rainbow Star Badge"},{"id":628,"name":"Winter 2023 - Prismatic Shard Badge"},{"id":629,"name":"Magical Fire Pit Recipe"},{"id":630,"name":"Magical De-Fusing Potion"},{"id":631,"name":"14th Birthday Black Hole Badge"},{"id":633,"name":"Halloween 2024 Eerie Orchestrion"},{"id":634,"name":"Halloween 2024 Werewolf Badge"},{"id":635,"name":"Christmas 2024 Secret Badge"},{"id":636,"name":"Christmas 2024 Rudolph Pet"},{"id":637,"name":"Black Dragon"},{"id":638,"name":"15th Birthday Balloon Badge"},{"id":639,"name":"15th Birthday (2025) Secret Dragon Badge"},{"id":640,"name":"Summer 2025 - There&#39;s No Way This Is Cherry Shake"},{"id":641,"name":"Summer 2025 - Not So Much Grape Milkshake"},{"id":642,"name":"Summer 2025 - Nut Free Coco-cooler Milkshake"},{"id":643,"name":"Summer 2025 - Half-Empty Cinnamon Milkshake"},{"id":644,"name":"Summer 2025 - Bumpy Path Milkshake"},{"id":645,"name":"Summer 2025 - Brown, White, and Pink Milkshake"},
                 {"id":646,"name":"Labubu InfoBot (L2) - 2025"},
                 {"id":647,"name":"Labubu Mario (L2) - 2025"},
                 {"id":648,"name":"Labubu Sharg (L3) - 2025"},
                 {"id":649,"name":"Halloween 2025 - Witch Hat Badge"},
                 {"id":650,"name":"Halloween 2025 - Witch Key"},
                 {"id":651,"name":"Halloween 2025 - Zombie Key"},
                 {"id":652,"name":"Halloween 2025 - Frankenstein Labubu"},
                 {"id":653,"name":"Christmas 2025 - Ghostbusters Badge"},
                 {"id":654,"name":"Christmas 2025 - Rudolph Pet - Alternate Recipe"},
                 {"id":655,"name":"Christmas 2025 - Labubu - Reindeer"},
                 {"id":656,"name":"Christmas 2025 - Labubu - Slimer"},
                 {"id":657,"name":"Christmas 2025 - Labubu - Vinz Clortho"},
                 {"id":658,"name":"Christmas 2025 - Labubu - Stay-Puft"},
                 {"id":659,"name":"Christmas 2025 - Labubu - Festive Ghostbuster"}
  ];

  const theirUserID = new URLSearchParams(location.search).get("userid");
	const ownUserID = await GM.getValue("you").then((yourID) => {
		// Own ID is cached
		if (yourID) {
			return yourID;
		}

		// Not cached, get it from page once it's loaded
		return new Promise((resolve) => {
			window.addEventListener("DOMContentLoaded", () => {
				yourID = new URLSearchParams(document.body.querySelector("#nav_userinfo a.username").search).get("id");
				GM.setValue("you", yourID);
				resolve(yourID);
			});
		});
	});


	// Only runs on your own crafted items page
	if (theirUserID && theirUserID !== ownUserID) {
		return;
	}


	let apiKey = await GM.getValue("apiKey");

	if (!apiKey) {
		if (!(apiKey = prompt("Please enter an API key with the 'Items' permission to use this script.")?.trim())) {
			return;
		}
		GM.setValue("apiKey", apiKey);
	}


	const endpoint = "https://gazellegames.net/api.php?request=items&type=crafted_recipes";
	const options = {
		method: "GET",
		mode: "same-origin",
		credentials: "omit",
		redirect: "error",
		referrerPolicy: "no-referrer",
		headers: {
			"X-API-Key": apiKey
		}
	};


	const crafted = await (await fetch(endpoint, options)).json();

	if (crafted.status !== "success") {
		if (crafted.status === 401) {
			GM.deleteValue("apiKey");
		}
		return;
	}


	function toInt(value) {
		return (typeof value === "number") ? value : parseInt(value, 10);
	}
  var craftmap = {};
  for (const craft of crafted.response) {
		craftmap[craft.name] = craft.id;
	}

  function populate(showtype){
    var out = "<br/>";
    var matched = {};
    for(const i in items) {
      const item = items[i];
      matched[item.name] = true;
      if (craftmap[item.name] && (showtype & 2)) {
        out += "<strong>" + item.id + ". " + item.name + "</strong>" + "<br/>";
      }
      if (!craftmap[item.name] && (showtype & 1)) {
        out += item.id + ". " + item.name + "<br/>";
      }

    }
    var unmatched = "";
    var unmatchedb64 = "";
    for (var key in craftmap) {
      if (!matched[key]) {
        unmatched += "<strong>" + craftmap[key] + ". " + key + "</strong>" + "<br/>";
        unmatchedb64 += " " + btoa(key);
      }
    }
    if (unmatched.length > 0) {
      out += "<h4>Crafted, unrecognized items:</h4>" + unmatched;
      out += "<p> This code may be necessary to provide an exact match for any new item(s): " + unmatchedb64;
      out += "<p><i>if you have the latest version of the script, contact grasspeace with the name and item number so he can update the script with the new or renamed item(s).</i></p>";
    }
    document.getElementById("crafted_and_uncrafted_gp").innerHTML = out;
  }

	// Try to insert our UI
	function insert() {
		var node1       = document.createElement('h3');
    node1.innerHTML = 'Crafted and uncrafted items';
    var node2       = document.createElement('div');
    for (var i = 1; i <= 3; i++){
      const k = i;
      var link = document.createElement('a');
      link.addEventListener("click", (function(){populate(k);}));
      switch(i) {
        case 1: link.innerHTML = "Show uncrafted"; break;
        case 2: link.innerHTML = "Show crafted"; break;
        default: link.innerHTML = "Show all"; break;
      }
      node2.append(link);
      var span = document.createElement('span');
      span.innerHTML = ' | ';
      node2.append(span);
    }
    var node3       = document.createElement('div');

    node3.innerHTML = "<div><strong>Spoiler</strong>: <input type=\"button\" value=\"Show\" style=\"width:45px;font-size:10px;\" onClick=\"if(this.parentNode.parentNode.getElementsByTagName('div')[1].getElementsByTagName('div')[0].style.display != ''){this.parentNode.parentNode.getElementsByTagName('div')[1].getElementsByTagName('div')[0].style.display = ''; this.innerText = ''; this.value = 'Hide'; } else { this.parentNode.parentNode.getElementsByTagName('div')[1].getElementsByTagName('div')[0].style.display = 'none'; this.innerText = ''; this.value = 'Show'; }\"></div><div class=\"spoilerbox\" ><div style=\"display:none;\" id=\"crafted_and_uncrafted_gp\"></div></div>";

    var content = document.getElementById("content");
    content?.append(node1);
    content?.append(node2);
    content?.append(node3);
    populate(3);
    return node1.connected && node2.connected && node3.connected;
 	}

	if (!insert()) {
		window.addEventListener("DOMContentLoaded", (function(){insert();}));
	}
})();