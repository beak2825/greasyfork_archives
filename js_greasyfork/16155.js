// ==UserScript==
// @name           ikarma's Penny PandAs (SET Master)
// @author         bottles
// @icon           http://i.imgur.com/7A20YB2.png
// @include        https://www.mturk.com/mturk/previewandaccept*
// @include        https://www.mturk.com/mturk/accept*
// @grant          GM_addStyle
// @description:en panda script
// @version        0.0.8
// @namespace      https://greasyfork.org/users/9054
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @description panda script
// @downloadURL https://update.greasyfork.org/scripts/16155/ikarma%27s%20Penny%20PandAs%20%28SET%20Master%29.user.js
// @updateURL https://update.greasyfork.org/scripts/16155/ikarma%27s%20Penny%20PandAs%20%28SET%20Master%29.meta.js
// ==/UserScript==

//===[Settings]===\\
mCoinSound = new Audio("http://www.denhaku.com/r_box/sr16/sr16perc/histicks.wav"); //==[This is the path to the mp3 used for the alert]==\\//===[Settings]===\\ //==[Just change the url to use whatever sound you want]==\\

var urlsToLoad  = [
    'https://www.mturk.com/mturk/previewandaccept?groupId=3H5CSD5832HNKRNN8SDJ6TWFB23E8Y' // SET Master Account: Action Sports
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3GGBYIXIHXFRVT4WCOW4P9DB5PUJ7Y' // SET Master Account: Adult
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=30VZHLSOXSOZI6XZ3LR3RSO2JRCH95' // SET Master Account: Adult
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3GGBYIXIHXFRVT4WCOW4P9DB5PUJ7Y' // SET Master Account: Adult
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=36TBNKR908NZ1MJEP0OZSLAEGX4ED6' // SET Master Account: Adventure Travel
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3UV3KC5DSFRP0BK7E30L4LMPH5UC5H' // SET Master Account: Adventure video Games
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3U1992G9GNOES7442SATMBI0W5VD7C' // SET Master Account: Alcohol
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=30DDVUIQK0JPDOB3Y1BT5LQX88VB8C' // SET Master Account: Alternative Energy
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3U1992G9GNOES7442SATMBI2UCSD7P' // SET Master Account: America's Got Talent
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3U2H1DGWNO4E740HR07C7Z1BGPPF4Q' // SET Master Account: Animated Films
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3U2H1DGWNO4E740HR07C7Z1DLMJF4N' // SET Master Account: Animation
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3TR9CMHN3N18FM9A1DV3WNGUCJGBB9' // SET Master Account: Anime
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=33CY53T7YFQBLWAGF1W5DO7SE9UHDN' // SET Master Account: Anime 2
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=35VN5BQM7U1C8PQDOVH7RPZFEKUJ5G' // SET Master Account: Appliances
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3YR6VNT5240LDA6KOWJNRLU0STOB7P' // SET Master Account: Aquariums
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3JGLGV9D6KAZ53QLEZVWOR445Z5D52' // SET Master Account: Aquariums
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=30GUUI0R316RPR1GFDRY77MIXZACBG' // SET Master Account: Arabic
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=39PLFW4P2L2YL0RNMQVCAKDMZ42H4P' // SET Master Account: AutoRacing
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3YR6VNT5240LDA6KOWJNRLUWUOKB75' // SET Master Account: Batman
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3U2H1DGWNO4E740HR07C7Z1AGGMF43' // SET Master Account: BBQ
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3IUGGYQCU2BI6QSXHP8D0795VWMD9V' // SET Master Account: Beauty
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=30GUUI0R316RPR1GFDRY77MD03ABCG' // SET Master Account: Beauty Products
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3WQX8XNVHKUK4OZ0T9I42XAEYKJDCB' // SET Master Account: Ben Affleck
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3IODFFHBTFYZ0WP94B3AR8U8Y29I8L' // SET Master Account: Big Bang Theory
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3P1CQ14RH6P1UJ7UF9M9RD4VL3QBDK' // SET Master Account: Bloopers
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3U2H1DGWNO4E740HR07C7Z1ANMQF4Q' // SET Master Account: Bloopers
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3WQX8XNVHKUK4OZ0T9I42XAEXGPCD7' // SET Master Account: Board Games/Puzzles
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3EOZAW7619KZ41EPYTLPRWTS4HXH8I' // SET Master Account: BodyBuilding
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3K8YRYAXTNKXL0F5VVENSOVWUGFGD4' // SET Master Account: Bollywood
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3PUN5J88D6BWB9229VMDW2KQXD0DA2' // SET Master Account: Breaking Bad
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3PE844HNSGY4PF8C1C800FFGGU3KA7' // SET Master Account: Breaking Bad
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3XEPRIQTWFJ8RTQRTERCJVDFAEAJ6Z' // SET Master Account: Business
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=34YHZZ9RB3K4X94LAU6GU9MO9D0E5W' // SET Master Account: Business Finance
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3TKKR4L4ZNN3WC4IVZV71CWMVVVBAZ' // SET Master Account: Camping & Outdoor Activities
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3XFOW6US4G3BQRI0TY5JABLL7RHF7C' // SET Master Account: Car Repair show
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3L8V324VIVQF4A6T8V33O7CP3H0F9G' // SET Master Account: Cartoons
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3YR6VNT5240LDA6KOWJNRLUYXMHB75' // SET Master Account: Cartoons
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3WQX8XNVHKUK4OZ0T9I42XAD1HJCD5' // SET Master Account: Cats
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3C2SAPILJD1V4N96OOTJDWXWSYTH7W' // SET Master Account: CELEBRETY GOSSIP
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=30VZHLSOXSOZI6XZ3LR3RSO7KP9H99' // SET Master Account: Chicago Bears
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3PUN5J88D6BWB9229VMDW2KQXDZDA1' // SET Master Account: Children's Clothing
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3TR9CMHN3N18FM9A1DV3WNGVII7BB6' // SET Master Account: Children's Films
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=37CCAM3CQL4BHRL0LJEQD08BERCID2' // SET Master Account: Children's Music
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3AW6PKSMT3ZY0R0QL869MIL2JMUG60' // SET Master Account: Childrens Educational Videos
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3ME56J5KH09LJFKLJMAQWR0OK3YC61' // SET Master Account: Childrens Toys
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3JGLGV9D6KAZ53QLEZVWOR45873D5L' // SET Master Account: Childrens TV
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3JGLGV9D6KAZ53QLEZVWOR40603D5V' // SET Master Account: Christianity
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3BZN229KV5SVO7QZJI51GXI41UCD6E' // SET Master Account: Cleaning Supplies
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3Z1VWDJDMCMFQ5NJ33XPOBHFI2JF8B' // SET Master Account: Climbing
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3WHJL69Y0O20GD4ZFDGLMF0P0FIE6U' // SET Master Account: Clothing
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3IUGGYQCU2BI6QSXHP8D0793P0HD9O' // SET Master Account: College Life
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=30DDVUIQK0JPDOB3Y1BT5LQUACVB8G' // SET Master Account: Comedy Films
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=372YDQ1UKEO8NT39C17OG5WELYOC8G' // SET Master Account: Compact Car
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=30DDVUIQK0JPDOB3Y1BT5LQW3DUB8E' // SET Master Account: Compact Car
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3P1CQ14RH6P1UJ7UF9M9RD4WFVNDBZ' // SET Master Account: Computers
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=30959048Z1SM6HWO9ZR2CW28CEMCA1' // SET Master Account: Consumer Electronics
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3X0K88L1Q1JCWI6LBW6C7UYFXZOI6P' // SET Master Account: Cooking & Recipes
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3IUGGYQCU2BI6QSXHP8D0796RVID9N' // SET Master Account: Credit & Lending
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3H8TR1N9M34PWUD0P4TO8FS12SQECB' // SET Master Account: CSI TV Show
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3LBF4GRVVPDU9G5ET5DFM3S0INVDDO' // SET Master Account: Dallas Mavericks
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3ME56J5KH09LJFKLJMAQWR0LM2XC6U' // SET Master Account: Dance & Electronic Music
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3S82SNMR1ZQT9TGY01H3K2NB8ZLFA1' // SET Master Account: Dancing
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3EOZAW7619KZ41EPYTLPRWTT1HUH8E' // SET Master Account: Dancing With the Stars
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3U1992G9GNOES7442SATMBIZ2CZD7Y' // SET Master Account: Dating
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=37QHTW84WZ47C25631ZQP1N9M8UJD3' // SET Master Account: Dental care
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3JGLGV9D6KAZ53QLEZVWOR445ZZD5W' // SET Master Account: Dexter
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3PUN5J88D6BWB9229VMDW2KNVIZDA3' // SET Master Account: Dining Out
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3QLL1RLFXTWKL4WC2KDUPK1POYKG4K' // SET Master Account: Disney
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3AW6PKSMT3ZY0R0QL869MIL3KPQG65' // SET Master Account: Disney
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3SFRD5IA5Z4YS3LQ6FHZFD7JXA8FBV' // SET Master Account: Disney Toys
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3VKZWROWWHEL45JEEN376WHUQJJG8S' // SET Master Account: Disney Toys
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=372YDQ1UKEO8NT39C17OG5WCQQTC86' // SET Master Account: Diving
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3RO2E92DZVPH9KML0UCMJZYP942D4T' // SET Master Account: dogs
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=30959048Z1SM6HWO9ZR2CW27GEPCA6' // SET Master Account: DOGS 2
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3Z4CV11E5D9H28DWKFDUQXDZAW5FCS' // SET Master Account: Drake
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3ME56J5KH09LJFKLJMAQWR0MF32C6W' // SET Master Account: Drawing & sketching
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3VKZWROWWHEL45JEEN376WHQQHNG8K' // SET Master Account: drugs
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3H5CSD5832HNKRNN8SDJ6TWED17E80' // SET Master Account: drugs 2
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3G26F8SQBJFV0IKQU6B4D8YBSA6I7M' // SET Master Account: Education
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3IUGGYQCU2BI6QSXHP8D0796RVKD9P' // SET Master Account: Events and listings
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3ED2P6N3JY7SMR4VAO0R4XLNJ7RF6S' // SET Master Account: Excersize
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3BJ81NIZAFF32DW9BZROKADUKBAK6E' // SET Master Account: Fashion
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=31H4HIBP9ANGHJVN0VEMFCJ01SYH5H' // SET Master Account: Film Awards
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3P1CQ14RH6P1UJ7UF9M9RD4VJWLDB1' // SET Master Account: fine arts
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3VNGVF6XFI1NG89RVZJC8IDDCD1GCX' // SET Master Account: first person shooter
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3ULU8NPOVXBM6DAEU9WGQODOGMTK79' // SET Master Account: Food and Drink
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3T063PBWYV5C0NV15EOR7IX0XN9H6X' // SET Master Account: Food and drink 2
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3WHJL69Y0O20GD4ZFDGLMF0R6AAE6M' // SET Master Account: Ford f-150
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3Z1VWDJDMCMFQ5NJ33XPOBHGIBNF8Z' // SET Master Account: France
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=375FCEJV3FBAZWTMTDNTIRSWCGGCCA' // SET Master Account: Game of Thrones
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3PUN5J88D6BWB9229VMDW2KS1I1DAL' // SET Master Account: Games
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3XFOW6US4G3BQRI0TY5JABLJEJGF7Y' // SET Master Account: Gardening
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3C6YXD2R4EZM1Q0LWPN6PHG9BFBE4T' // SET Master Account: Gardening
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3PLXPMD6WGC98PD47Q8WVQZMYCOKB2' // SET Master Account: Guitar
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3H5CSD5832HNKRNN8SDJ6TWIB73E8E' // SET Master Account: Hockey
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3YR6VNT5240LDA6KOWJNRLUZZTLB7R' // SET Master Account: Holidays
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3XFOW6US4G3BQRI0TY5JABLJ8RAF72' // SET Master Account: Home and Garden
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3BGEFHL0IGGEX57MP58KUBZ7OFNJBM' // SET Master Account: Home and Garden
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=34YHZZ9RB3K4X94LAU6GU9MP5B2E5S' // SET Master Account: Home Financing
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=36TBNKR908NZ1MJEP0OZSLAFOS1ED3' // SET Master Account: Home Improvement
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=35GRDJC92I54NFYQ2WFI250HF5OC7I' // SET Master Account: humor
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3WHJL69Y0O20GD4ZFDGLMF0MZCGE6F' // SET Master Account: Hunting/Shooting
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3R8NDUBSE5CPNQSVSBY9NCTEPK3K4P' // SET Master Account: IAB arts & entertainment
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=35VN5BQM7U1C8PQDOVH7RPZFEJZJ5J' // SET Master Account: IAB:Allergies
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3P1CQ14RH6P1UJ7UF9M9RD4TD1RDB7' // SET Master Account: IAB:Auto Racing
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3IUGGYQCU2BI6QSXHP8D0796RVOD9T' // SET Master Account: IAB:Babies & Toddlers
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3WQX8XNVHKUK4OZ0T9I42XAEXGSCDA' // SET Master Account: IAB:Biology
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3XFOW6US4G3BQRI0TY5JABLMDOHF7E' // SET Master Account: IAB:Body Art
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3C2SAPILJD1V4N96OOTJDWXWSYTH7W' // SET Master Account: IAB:Celebrity Fan/Gossip
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3WHJL69Y0O20GD4ZFDGLMF0P0FIE6U' // SET Master Account: IAB:Clothing
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=39PLFW4P2L2YL0RNMQVCAKDM1W3H4C' // SET Master Account: IAB:Cold & Flu
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3PUN5J88D6BWB9229VMDW2KQWM7DAQ' // SET Master Account: IAB:Deafness
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3DPZKFEUURGYHV27S8DXAWE119GI44' // SET Master Account: IAB:Depression
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3ACJON8MIPL13FG25QXX2K2BXPZEAU' // SET Master Account: IAB:Electric Vehicle
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3Z1VWDJDMCMFQ5NJ33XPOBHEP2KF8H' // SET Master Account: IAB:Exercise
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=35HIM1LU1G1GDE676DW7FOKF14DI59' // SET Master Account: IAB:Family & Parenting
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=323KIQYDLQ674SG70YHBZTG8K4QC4Q' // SET Master Account: IAB:Fashion
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3BGEFHL0IGGEX57MP58KUBZ7OGJJBK' // SET Master Account: IAB:Financial News
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3XFOW6US4G3BQRI0TY5JABLJEJGF7Y' // SET Master Account: IAB:Gardening
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3P1CQ14RH6P1UJ7UF9M9RD4WFVLDBX' // SET Master Account: IAB:Guitar
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3FPKONMGHM429ASF5MEVL7U22BXB66' // SET Master Account: IAB:Headaches/Migraines
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=34VDM42TPY2ZE18J939OR4PHN1OI9U' // SET Master Account: IAB:Hobbies & Interests
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3BGEFHL0IGGEX57MP58KUBZ7OFNJBM' // SET Master Account: IAB:Home & Garden
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3ED2P6N3JY7SMR4VAO0R4XLNJ8WF6Z' // SET Master Account: IAB:Hybrid
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3JGLGV9D6KAZ53QLEZVWOR445Z1D5Y' // SET Master Account: IAB:Martial Arts
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3S82SNMR1ZQT9TGY01H3K2NA7ZHFAU' // SET Master Account: IAB:Men's Health
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3DPZKFEUURGYHV27S8DXAWE119BI4Z' // SET Master Account: IAB:News
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3WQX8XNVHKUK4OZ0T9I42XAEXGOCD6' // SET Master Account: IAB:Olympics
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3BZN229KV5SVO7QZJI51GXI41U9D6B' // SET Master Account: IAB:Parenting Kids
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3G26F8SQBJFV0IKQU6B4D8YBSA8I7O' // SET Master Account: IAB:Real Estate
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=37QHTW84WZ47C25631ZQP1N7R1VJDR' // SET Master Account: IAB:Science
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=375FCEJV3FBAZWTMTDNTIRSVGI7CC7' // SET Master Account: IAB:Skiing
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=37V666AKGWODNP74VR53NNZMT6YHAM' // SET Master Account: IAB:Style & Fashion
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3WQX8XNVHKUK4OZ0T9I42XAEXGLDC4' // SET Master Account: IAB:Weddings
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3UV3KC5DSFRP0BK7E30L4LMNN2NC56' // SET Master Account: ICE T
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=323KIQYDLQ674SG70YHBZTGCN8SC4B' // SET Master Account: India
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3BZN229KV5SVO7QZJI51GXI41UDD6F' // SET Master Account: Individual Sports
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3AJ89545MPZ6MPLUB4XTXVMHF7KEBP' // SET Master Account: International News
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3MKD2J38GJNPRTUD3TH75HL6PEAB9R' // SET Master Account: Jessica Alba
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3OYVDJNTF4W463HLHZNHXY7TRW5GBV' // SET Master Account: Jewelry
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3C6YXD2R4EZM1Q0LWPN6PHGB6I6E4T' // SET Master Account: Jonny Depp
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3D343PJM05GUC6MDAQYXMXT1EN8J4I' // SET Master Account: Juicing
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3SFRD5IA5Z4YS3LQ6FHZFD7MPG2FBZ' // SET Master Account: Jurassic Park
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3T9YKFMCGXS81YMJHTD2G1RS9YAC97' // SET Master Account: Korea
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3UV3KC5DSFRP0BK7E30L4LMOQ8LC5L' // SET Master Account: Lacrosse
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3WNG995UYJ7ISL9NCX2Z0BEV7PZD8X' // SET Master Account: Latin-American Cuisine
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3VKZWROWWHEL45JEEN376WHSLKEG8G' // SET Master Account: Leonardo DiCaprio
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=30959048Z1SM6HWO9ZR2CW27GDUCA9' // SET Master Account: Live Comedy
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3T9YKFMCGXS81YMJHTD2G1RP434C90' // SET Master Account: Luxury Goods
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3MKD2J38GJNPRTUD3TH75HL2PD5B9C' // SET Master Account: Magic Tricks
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3LBF4GRVVPDU9G5ET5DFM3STGM2DDD' // SET Master Account: Marketing
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3H8TR1N9M34PWUD0P4TO8FSWVXSEC6' // SET Master Account: Marriage
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3PLXPMD6WGC98PD47Q8WVQZMYDIKBY' // SET Master Account: Metallica
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3C2SAPILJD1V4N96OOTJDWX0Q0SH75' // SET Master Account: MMO
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=372VRO63KW2I6ZCW155ZIYJW9RFHBP' // SET Master Account: Multiplayer Battle Arena Video Games
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=372VRO63KW2I6ZCW155ZIYJSBOIHBG' // SET Master Account: Music
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3AJ89545MPZ6MPLUB4XTXVMLF9REB8' // SET Master Account: New Zealand
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3YR6VNT5240LDA6KOWJNRLUYTTPB7N' // SET Master Account: News
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3X0K88L1Q1JCWI6LBW6C7UYJV2MI6Z' // SET Master Account: Nintendo Wii Games
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3G26F8SQBJFV0IKQU6B4D8YFQD6I7Y' // SET Master Account: Nintendo Wii Games
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=37QHTW84WZ47C25631ZQP1NBP40JD8' // SET Master Account: Open World Video Games
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3D343PJM05GUC6MDAQYXMXT47W4J4V' // SET Master Account: Owen Wilson
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3JGLGV9D6KAZ53QLEZVWOR4883YD5E' // SET Master Account: Pakistan
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=375FCEJV3FBAZWTMTDNTIRSWCGDCC7' // SET Master Account: Performing Arts
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3ERG9KP7KA71G442F51UTIPAT9DHCI' // SET Master Account: Personal Finance
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3ED2P6N3JY7SMR4VAO0R4XLPEAUF60' // SET Master Account: Pharrell Williams
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3P1CQ14RH6P1UJ7UF9M9RD4TC2RBD6' // SET Master Account: Photography
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=31H4HIBP9ANGHJVN0VEMFCJ0YSVH5B' // SET Master Account: Pop music
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=349I5E7LVC2V9CSPRLUO354H0FIJ9A' // SET Master Account: Pop Music
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=349I5E7LVC2V9CSPRLUO354H0FIJ9A' // SET Master Account: Pop Music 2
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=36TBNKR908NZ1MJEP0OZSLAHISWEDW' // SET Master Account: Product Reviews
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3XFOW6US4G3BQRI0TY5JABLJEIEF7U' // SET Master Account: Profanity
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3U1992G9GNOES7442SATMBIZ060D7L' // SET Master Account: Rap & Hip Hop
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3U1992G9GNOES7442SATMBIZ060D7L' // SET Master Account: Rap & Hip-Hop
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3TKKR4L4ZNN3WC4IVZV71CWRZTRBA5' // SET Master Account: Reality DocuSoap
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3S82SNMR1ZQT9TGY01H3K2NB8ZKFA0' // SET Master Account: Reality Shows
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3LBF4GRVVPDU9G5ET5DFM3SUNNXDDJ' // SET Master Account: Remodeling and construction
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3JGLGV9D6KAZ53QLEZVWOR4463ZD55' // SET Master Account: Rihanna
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3AW6PKSMT3ZY0R0QL869MIL1DVWG6C' // SET Master Account: Sci-Fi & Fantasy
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3N6I2GM9S1M6Q6S1034QT1G41NTB5A' // SET Master Account: Sci-Fi & Fantasy
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3PE844HNSGY4PF8C1C800FFEHUZKA0' // SET Master Account: Science
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=30959048Z1SM6HWO9ZR2CW28CDVCA8' // SET Master Account: Science Shows
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3XFOW6US4G3BQRI0TY5JABLP6JEF70' // SET Master Account: Screen Actors Guild Awards
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=30GUUI0R316RPR1GFDRY77MBRW7CBN' // SET Master Account: Screenwriting
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3TR9CMHN3N18FM9A1DV3WNGSDCBBBN' // SET Master Account: Sea Life
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3QLL1RLFXTWKL4WC2KDUPK1PNVIG4B' // SET Master Account: Sesame Street
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3VKZWROWWHEL45JEEN376WHQOING8K' // SET Master Account: Seth McFarland
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3WQX8XNVHKUK4OZ0T9I42XAEXGMCD4' // SET Master Account: Severe Weather
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3ED2P6N3JY7SMR4VAO0R4XLQICTF69' // SET Master Account: Shakira
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3ERG9KP7KA71G442F51UTIPFM8IHCO' // SET Master Account: Simpsons
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3RO2E92DZVPH9KML0UCMJZYP943D4U' // SET Master Account: Skate Sports
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=323KIQYDLQ674SG70YHBZTGBH9YC4B' // SET Master Account: SNL
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3ACJON8MIPL13FG25QXX2K2E3Y5EAU' // SET Master Account: soccer
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3Z4CV11E5D9H28DWKFDUQXDZ825FC2' // SET Master Account: Software
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=30VZHLSOXSOZI6XZ3LR3RSO6PWDH9U' // SET Master Account: Spanish Television
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=33CY53T7YFQBLWAGF1W5DO7XABXHD0' // SET Master Account: Steve Harvey
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3TYSWKZBELVH4REV4IB1SWLXA0AG7V' // SET Master Account: Steve Jobs
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3C6YXD2R4EZM1Q0LWPN6PHGA9G7E4R' // SET Master Account: Street style
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3PUN5J88D6BWB9229VMDW2KP1E4DAA' // SET Master Account: Street Style
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3C2SAPILJD1V4N96OOTJDWXWQ6MH73' // SET Master Account: Suits
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3LBF4GRVVPDU9G5ET5DFM3SVHG1DD5' // SET Master Account: Swimming
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=30GUUI0R316RPR1GFDRY77MHTZ8BC7' // SET Master Account: T-Pain
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3PUN5J88D6BWB9229VMDW2KO3G5DAF' // SET Master Account: Tattooing
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3U1992G9GNOES7442SATMBIXUBWD7H' // SET Master Account: Tax Planning
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3BGEFHL0IGGEX57MP58KUBZ7KNPJB0' // SET Master Account: Tech and computing
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3R8NDUBSE5CPNQSVSBY9NCTETD2K4E' // SET Master Account: Tech and Computing
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3YR6VNT5240LDA6KOWJNRLU4VTLB7X' // SET Master Account: Terrorism
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3ERG9KP7KA71G442F51UTIPFM8IHCO' // SET Master Account: The Simpsons (TV Show)
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3ED2P6N3JY7SMR4VAO0R4XLPCGVF6B' // SET Master Account: The Walking Dead
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3ED2P6N3JY7SMR4VAO0R4XLPCGVF6B' // SET Master Account: The Walking Dead
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=37V666AKGWODNP74VR53NNZQR9RHAR' // SET Master Account: Third Person Shooter
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3TR9CMHN3N18FM9A1DV3WNGVII9BB8' // SET Master Account: Thriller Films
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3FJ5S6GNL6YJKDI4YNLDST0PUQ2E70' // SET Master Account: Top Models
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3OYVDJNTF4W463HLHZNHXY7RYN8GBJ' // SET Master Account: TV Crime & Legal Shows
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3WHJL69Y0O20GD4ZFDGLMF0O57DE6C' // SET Master Account: tv dramas
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=30GUUI0R316RPR1GFDRY77MEUVECB1' // SET Master Account: Tv Shows & Programs
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3MU03ZNWUDPW3N4H55QMCR7QMIGF5T' // SET Master Account: Usher
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=33CCZ2QQZLLNYW6XDKJX6PRPX8NE9P' // SET Master Account: Vehicle shows
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3WHJL69Y0O20GD4ZFDGLMF0N76HE6E' // SET Master Account: vehicle shows
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3FJ5S6GNL6YJKDI4YNLDST0J2H1E7D' // SET Master Account: Violence
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=35GRDJC92I54NFYQ2WFI250F86PC7A' // SET Master Account: Visual Art & Design
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3MKD2J38GJNPRTUD3TH75HL2PE6B9F' // SET Master Account: Vlogging
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=37QHTW84WZ47C25631ZQP1N5N9WJD0' // SET Master Account: Weapons
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=35VN5BQM7U1C8PQDOVH7RPZFEKXJ5J' // SET Master Account: weather
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3IODFFHBTFYZ0WP94B3AR8UBZYFI8Q' // SET Master Account: Wendy Williams
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3TKKR4L4ZNN3WC4IVZV71CWMVUOBAQ' // SET Master Account: Wildlife
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3ED2P6N3JY7SMR4VAO0R4XLNJ8SF6V' // SET Master Account: Wrestling Shows
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=323KIQYDLQ674SG70YHBZTG9J8TC42' // SET Master Account: Yoga
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=323KIQYDLQ674SG70YHBZTG9J8TC42' // SET Master Account: Yoga & Pilates
];

if ((urlsToLoad.indexOf(document.referrer) > -1 ) && (!(urlsToLoad.indexOf(window.location.href) > -1 ))) { // If cleared captcha, back button is pressed to continue reloading.
    window.history.back();
}

if ((urlsToLoad.indexOf(window.location.href) > -1 ) && (!($('input[name="userCaptchaResponse"]').length > 0))) { // Checks if url is above and if not captcha.
    FireTimer ();
}

if ((urlsToLoad.indexOf(window.location.href) > -1 ) && ($('input[name="userCaptchaResponse"]').length > 0)) { // Do something on captcha such as an alert.
    alert("Captcha Alert!"); //alert
    window.open('https://www.mturk.com/mturk/preview?groupId=3T4QHDVBXBLD2A4YZC57CBG4IE9ZWF'); // -Stop the CAPTCHA madness!!! Opens Copytext, change this if you want different captcha to open
    window.location.href = 'https://www.mturk.com/mturk/previewandaccept?groupId=3H5CSD5832HNKRNN8SDJ6TWFB23E8Y'; // Stop the CAPTCHA madness!!!
}

//--- Catch new pages loaded by WELL BEHAVED ajax.
window.addEventListener ("hashchange", FireTimer,  false);

// Current link will reload if it accepts a HIT, if you have a full queue or if you hit page request error.
function FireTimer () {
    if ((document.getElementsByName("autoAcceptEnabled")[0]) || ($('span:contains("You have accepted the maximum number of HITs allowed.")').length > 0) || ($('td:contains("You have exceeded the maximum allowed page request rate for this website.")').length > 0)) {
        setTimeout(function() { location.reload(true); }, 1500); // 1000 == 1 second
        mCoinSound.play();
    } else {
        setTimeout(function() { GotoNextURL(); }, 2000); // 1000 == 1 second
    }
}

function GotoNextURL () {
    var numUrls     = urlsToLoad.length;
    var urlIdx     = urlsToLoad.indexOf (location.href);
    urlIdx++;
    if (urlIdx >= numUrls)
        urlIdx = 0;
    location.href   = urlsToLoad[urlIdx];
}