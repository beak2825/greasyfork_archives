// ==UserScript==
// @name         Chickensmoothie Store Pets Renamer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Rename store pets based on their unique picture URLs
// @author       Flamy Serpent
// @match        https://www.chickensmoothie.com/accounts/viewgroup.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522042/Chickensmoothie%20Store%20Pets%20Renamer.user.js
// @updateURL https://update.greasyfork.org/scripts/522042/Chickensmoothie%20Store%20Pets%20Renamer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const urlToNamePrice = {

 //2011

        // Gryphon Dogs
        "26F5E0498043D5056816845DAC6B4184": "Gryphon Dogs: 20 old rares",
        "85521C84DE4B6C8763AFF64B5D316FFA": "Gryphon Dogs: 20 old rares",
        "8CC0151F7B7EF021EC00393A7508760B": "Gryphon Dogs: 20 old rares",
        "B4E81A0166900785CA1A3B147DACBC20": "Gryphon Dogs: 20 old rares",

        // Seahorses
        "88955A0973B02797227F05455389EE38": "Seahorse: 20 old rares",
        "8FA49FF99C7103952E11ACDE946A1E3D": "Seahorse: 20 old rares",
        "8D29E43689C7167705C487B15791B69A": "Seahorse: 20 old rares",
        "18149118A6476BE730FA81990DDDC26C": "Seahorse: 20 old rares",

        //Forest Guardians
        "E49AF8F618B14AA950C08F1D85C7F361": "Forest Guardian: 20 old rares",
        "C09010EFE8397A118A7597A092D03A7C": "Forest Guardian: 20 old rares",
        "1D9A9FE5347466699E3CC70BEEADDAA9": "Forest Guardian: 20 old rares",

        //Carousel Horses
        "02222C9360B0A350D00ED52A6A2B45DB": "Carousel Horse: 20 old rares",
        "FDE6E64786216043990E533BD6C2E6EA": "Carousel Horse: 20 old rares",
        "61F633A901C8913B37331A69EF51BE4D": "Carousel Horse: 20 old rares",
        "56393459224A31CB696B7BDD18907B67": "Carousel Horse: 20 old rares",

//2012

        // Alien Dogs
        "31AE7FB56B9225450F954AD0D3468967": "Alien Dog: 10 old rares",
        "B70BA80A1E7EF3F05D72E27F0C5E5DBA": "Alien Dog: 10 old rares",
        "4AE91E42A1B37F97788DC15807912856": "Alien Dog: 10 old rares",
        "EF5423EEB4CC793DD45E683FF28A09EC": "Alien Dog: 10 old rares",

        // Fluffy Dogs
        "00E64E6344A7B374595F8EE977457079": "Fluffy Dog: 10 old rares",
        "E6B77F687BDB5A7D6B1500D7310F3C0F": "Fluffy Dog: 10 old rares",
        "0739735E4E10579D79D1596E4EA5A296": "Fluffy Dog: 10 old rares",
        "BB2CF3DBF1D45C4C6F2598847FCF6E63": "Fluffy Dog: 10 old rares",

        // Kirins
        "90E61488624EE6F2F5DDE6947FF4CA33": "Kirin: 10 old rares",
        "EBCBB85A214D7BAE4625AE2A724AEE21": "Kirin: 10 old rares",
        "C3A2F876A06532B4A09BCECA3167BC17": "Kirin: 10 old rares",
        "2B96756DF8D49200086B9509C4E1A2C0": "Kirin: 10 old rares",

        // Fairy Goat Dogs
        "4618B25CD85943FDAFBF914419B1A12E": "Fairy Goat Dog: 10 old rares",
        "45CF0E64ECF815AA34C45DF808FFC797": "Fairy Goat Dog: 10 old rares",
        "F6D8F2A3ADE9E4DDBA15DB428F870284": "Fairy Goat Dog: 10 old rares",
        "F63A5567608CF03444B1598D0A165919": "Fairy Goat Dog: 10 old rares", // Pink one

        // Jackalopes
        "4E4AC4FA689AAAC580D818DE54712F13": "Jackalope: 10 old rares",
        "0192914ED44C5FFFDD2089656A2D0C74": "Jackalope: 10 old rares",
        "37AF822758CC178B40F3A8F6C7496730": "Jackalope: 10 old rares",

        // Wonderland Bwolves
        "9BCE47219467E117978A42D9AC2860E6": "Wonderland Bwolf: 10 old rares",
        "A3A3FEC89C7A823B12D65C611EB1FA52": "Wonderland Bwolf: 10 old rares",
        "D10C5B25FDBE3EB072EEF1F59539168A": "Wonderland Bwolf: 10 old rares",

//2013

        //Mythological Dogs
        "5F3EBA57B87AC2BA488B5356A851E0E3": "Mythological Dog: 10 old rares",
        "BB5A094CA4BBF0BE36AC14888ADF4301": "Mythological Dog: 10 old rares",
        "8FEF1DFEE176D0570E433D7CFD715B0D": "Mythological Dog: 10 old rares",
        "DC5F671D842C99202DE045632DE646E0": "Mythological Dog: 10 old rares",

        // Phoenix Dogs
        "7C3B9B11828D898D4F2B2640CA06BF7B": "Phoenix Dog: 10 old rares",
        "A1818B92C424488F4A001DB69438DACB": "Phoenix Dog: 10 old rares",
        "081F878DDDFFA7D79AF2CB4C1DCEF66C": "Phoenix Dog: 10 old rares",
        "C26A0469B7C015941CFB95157328341C": "Phoenix Dog: 10 old rares",

         // Alpacas
        "9ADA64C43826174BA41186C72BFE1184": "Alpaca: 10 old rares",
        "752C5A8DF0C257E25A21DCEFF8B584E4": "Alpaca: 10 old rares",
        "E293E51E6268729AC239EA5E1F2A6897": "Alpaca: 10 old rares",
        "90E7D0F086C9E529CDB57DD1301A071A": "Alpaca: 10 old rares",
        "371E3121EC12536AECBED009EF7E8589": "Alpaca: 10 old rares",

        //Fairy Rats
        "B5CCBEAF1698208FA859B1EF915D8388": "Fairy Rat: 10-15 old rares",
        "85FB0853286C4935F9A0B3E7A0E788C8": "Fairy Rat: 10-15 old rares",
        "096218AED061F6A1A2ABC5DF63CF5F6A": "Fairy Rat: 10-15 old rares",
        "F0E0B08524A0E0382A1F27F58A70001F": "Fairy Rat: 10-15 old rares",

        // Storgis
        "3EBE32A0BC6DBC01E687750EB2122A6C": "Storgi: 15 old rares",
        "23B0CC1C8EE1B6EDE39F07970DC1B4D0": "Storgi: 15 old rares",
        "7C292FA0BE2F3BFC3B1ACD1E9436A2C5": "Storgi: 15 old rares",
        "523799BBC43FB19C51097D56324EB983": "Storgi: 15 old rares", // Rainbow one

//2014

        //Koi Dogs
        "DFFFD68F260318F44DD1B1DD7B936E52": "Koi Dog: 7 old rares",
        "BCF8D18064EE7FB85ADBCE0A7CA77CAD": "Koi Dog: 7 old rares",
        "103C716CE829D77F2A445DD1EF86A8FA": "Koi Dog: 7 old rares",
        "F567A141E7E329024C8C6C2761A06F9D": "Koi Dog: 7 old rares",
        "63ECD4B7F2D3E24929179C430F7FB65C": "Koi Dog: 7 old rares",

        //Calgreyhounds
        "C555E8197DCA4789C2EAFC9327115005": "Calgreyhound: 5 old rares",
        "A357CC4F207343355BC6F8CBEF3FA0FE": "Calgreyhound: 5 old rares",
        "D2A8A44C13456BB3DC97006FDAE607B4": "Calgreyhound: 5 old rares",
        "7131F149D669C7BF357D89EA4D2C066A": "Calgreyhound: 5 old rares",

        //Robocats
        "B5134BA86B870DC7E7669B828C8B1C84": "Robocat: 7 old rares",
        "DB91D54F031234BBDDCC11B2677E848A": "Robocat: 7 old rares",
        "54E7B5A68629952E885EC7AF5B26D0CE": "Robocat: 7 old rares",

        // Oragami Dog, Sakura Dog, Goldfish Dogs
        "C58BC62FB2BBB798D93DD245D4465779": "Oragami Dog: 10 old rares", // Origami Dog
        "38C954E3C4559AE44FDBC86AE282E9E1": "Sakura Dog: 20 old rares", // Sakura Dog
        "0FE874BB17AE7B26013FD0E1D78400A8": "Goldfish Dog: 5 old rares",
        "78B3233246B15BFD6C7F5F7C1ECF033A": "Goldfish Dog: 5 old rares",

        // Dragoncats
        "9DBAAFD780173570B4EAE6BFD554D96F": "Dragoncat: 5 old rares",
        "D8F86F0D03062D5852877216FD1AC2EF": "Dragoncat: 5 old rares",
        "522C8BD91FE8865F18D3594A630D956F": "Dragoncat: 5 old rares",

        // Realistic Breed Dogs
        "D2D6C02A86D36D5D8027B8BAB434FD1D": "Realistic Breed Dog: 10 old rares",
        "7BC1A99B240BF0BAED0ECD5B4213F3F1": "Realistic Breed Dog: 10 old rares",
        "0719C26A4095A7EC9214548429ACF4A9": "Realistic Breed Dog: 10 old rares",
        "61E52BF799386466102F082CB4180CA2": "Realistic Breed Dog: 10 old rares",

// 2015

        // Unicorns
        "B3B1ABF23BFDB6D73821569E5DDECCDA": "Unicorn: 5 old rares",
        "E996BA0B4318BE62FA9859185F861A0B": "Unicorn: 5 old rares",
        "5216A8BA6309E585C1B5B37369EA1E91": "Unicorn: 5 old rares",
        "DB79C1251552CDFE1BA6C2D22CB54F51": "Unicorn: 5 old rares",
        "2CBB62FE74D766DCBAA8C2F5BE0F224F": "Unicorn: 5 old rares", // Alicorn

        // Environmental Deer
        "E8FB3F78759C2D7FA07D2DF81F5B8922": "Environmental Deer: 10 old rares",
        "EF8C8FF5F396C246F3780ED5A557E65A": "Environmental Deer: 10 old rares",
        "70EB78BF8E1A99B78BBE8D0B8A53E9AD": "Environmental Deer: 10 old rares",
        "C8A0EAFF135F53246A1BA35717199A07": "Environmental Deer: 10 old rares",
        "8BDD88FE21BB5C12AEF2E61C36CF6F4C": "Rainbow Bow Deer: 15 old rares", // Rainbow Bow Deer

        // Scaly PPS
        "25F38536B6576487B0D722EA24E1956E": "Scaly PPS: 5 old rares",
        "1AAA104A49BD131E0BAED8488C8D4293": "Scaly PPS: 5 old rares",
        "D21BC4DB55F5C4B06DA67DC2FB7C177C": "Scaly PPS: 5 old rares",
        "62A2747436EE60F44076B004AC97C0EC": "Scaly PPS: 5 old rares",
        "781096428736E422D0CA425390DAFD77": "Scaly PPS: 5 old rares",

        // Stripe-tail Critters
        "41E728E8413B61A830016A388E5591CF": "Stripe-tail Critter: 10 old rares",
        "9823B5C009E8EC6E1127CD3FB7827F78": "Stripe-tail Critter: 10 old rares",
        "8AA59A29345DE54AF128F1480654BF69": "Stripe-tail Critter: 10 old rares",
        "449907F4B031AA0E435F7C39BBB8FEF7": "Stripe-tail Critter: 10 old rares",

        // Manticores
        "8F94F431CF37C5AE6CB86DFE4DEDA8AC": "Manticore: 5 old rares",
        "34FE8228A3FDFE2031BC0EF5DA618232": "Manticore: 5 old rares",
        "33D0579E1AB7DD46A837365E5045BE52": "Manticore: 5 old rares",
        "2B7E74C86888FB21A5F625B3844F372C": "Manticore: 5 old rares",
        "D0F2A91DC8480C0069A698059EEC537A": "Manticore PPS: 10 old rares", // Manticore PPS

        // Halo BWolves
        "87A5E8D36EC53DE6C9E784938F13A735": "Halo BWolf: 5 old rares",
        "0C28D68FFD44D364564AB586D3A615EB": "Halo BWolf: 5 old rares",
        "E33429BC62604D00DB04CC7188F1C413": "Halo BWolf: 5 old rares",
        "DD934D5A3D7A3BCA427C58633EEEBAF6": "Halo BWolf: 5 old rares",

// 2016

        // Dinos
        "C19939980A66FF942D947A563A82F714": "Dino: 10 old rares",
        "B2DA65CFEB68A8A94C63DAD4370E9501": "Dino: 10 old rares",
        "0C01061CC1008F34B1B91619DBA7AED8": "Dino: 10 old rares",
        "4EFB10793B63BB318C1953DF22A37D20": "Dino: 10 old rares",

       // Cartoon Unicorns
        "1A06364693086F4D3219E1292FE6CFCC": "Unicorn PPS: 10 old rares", // Unicorn PPS
        "93873C65F11C306F626ED538042383D8": "Cartoon Unicorn: 5 old rares",
        "441AF189F532A010C7850F05DC507093": "Cartoon Unicorn: 5 old rares",
        "D3A9CF60D4F9FEB9780A951148AAE817": "Cartoon Unicorn: 5 old rares",
        "D26BA8C750F086840A20F8B9B2C29F3E": "Cartoon Unicorn: 5 old rares",

        // Cheetahs
        "5BCF915911A0ECBBA7A22BBDF11A7940": "Cheetah PPS: 10 old rares", //Cheetah PPS
        "A532DD9F2E6EBE6F268E7E55D03D09B8": "Cheetah: 5 old rares",
        "50E16AC2A2706B5E33BD895E40472FD0": "Cheetah: 5 old rares",
        "4AD6D0CC8CD9CD7AA5ED716E30B29664": "Cheetah: 5 old rares", // Angel Cheetah

        // Ferrets
        "BCD951A18F23B28A2C8ECC4765D006F2": "Ferret: 5 old rares",
        "042203CD9C2FE8BC1B2FB85CCFEA8FA6": "Ferret: 5 old rares",
        "ECC538C4C1C182D3D999E017A1AA6105": "Ferret: 5 old rares",
        "5D65B3DF0089CC143C2D7B67E705FDF1": "Ferret: 5 old rares",

        // Flying Dogs
        "C03ABF9A65832AF67F2EB7E2012D4BA9": "Flying Dog: 5 old rares",
        "1582EF027860DC12E5C7CD5A8DD25481": "Flying Dog: 5 old rares",
        "C3D23882B921BB74524E1D144D81C58C": "Flying Dog: 5 old rares",
        "BF6A81F97D9E0678CC734BC03CE481EF": "Flying Dog: 5 old rares",
        "1CD514A8951805806171D1BB3F2A4699": "Flying Dog: 5 old rares",

        // Tigers
        "CD60BEB8774FBC1ECDA452D48EFCC14C": "Tiger: 5 old rares",
        "D082607423E0A43B2E0F66799DF7C28E": "Tiger: 5 old rares",
        "625AE72E3AB8664C6BC9B7BE27546C07": "Tiger PPS: 10 old rares", // Tiger PPS
        "76757C75E82E945A377BB294DA5033DF": "Tiger: 5 old rares", // Tiger Mid-Stage PPS

 // 2017

        // Feather Dragons
        "6FA638D3441B7C1A3EFC1E6CDEE13DF7": "Feather Dragon: 4 old rares",
        "B1A0B9A7B4F23F509BE7E925E7DE1D49": "Feather Dragon: 4 old rares",
        "804AD633E859477451FD4516267ECE6D": "Feather Dragon: 4 old rares",
        "090729CBBF29F9C197745E0CD9D3C562": "Feather Dragon: 4 old rares",
        "24D4191F4B8975B9D71B6081A2DC0053": "Feather Dragon: 4 old rares",

        // Carnival Lions
        "2A20DE80C21705C0C0B26D460BB40A91": "Carnival Lion: 4 old rares",
        "E794C8518C26CDEE528C6D555048A68B": "Carnival Lion: 4 old rares",
        "688A5880BDCAF125B437BE6C6D9F4871": "Carnival Lion: 4 old rares",
        "65DAEB98CE2DFBA029EE6F9016809C30": "Carnival Lion: 4 old rares",

        // Fairy Foxes
        "B678893BEEB11F255639A75B0D533104": "Fairy Fox: 4 old rares",
        "141CECB1F71EF343C4431DC3D7ECB520": "Fairy Fox: 4 old rares",
        "928436B8B26D02C36CCF18D577F43482": "Fairy Fox: 4 old rares",
        "A85F4382F2457B9012A62EA95DA32F9B": "Fairy Fox PPS: 10 old rares", // Fairy Fox PPS

        // Tree Dogs
        "C7AC0C1891C6631311269DFFC443E628": "Tree Dog: 5 old rares",
        "469650D80001405BB3733209AE840B47": "Tree Dog: 5 old rares",
        "7C612CFFE409083E76F16FE6CFD20EDF": "Tree Dog: 5 old rares",
        "F95FDB225EB21EC2CE4C01EADE7D6145": "Tree Dog: 5 old rares",

        // Fluffy PPS
        "D7E839A532A362CA9ED85C5610F3A2B8": "Fluffy PPS: 4 old rares",
        "270366A2933423E825DA4D8E3BB06552": "Fluffy PPS: 4 old rares",
        "AFC5542A3D98EF7AA884F38622A0D7A9": "Fluffy PPS: 4 old rares",
        "7B8495DF1E91692EAD180F963FA01B86": "Fluffy PPS: 4 old rares",

        // Gryphons
        "7E352AD706BCE5EF213250C759108988": "Gryphon PPS: 10 old rares", // Gryphon PPS
        "1577868CD03120397308DDF186663581": "Gryphon: 4 old rares",
        "9C49867FC30806111F9BDE62D325C47A": "Gryphon: 4 old rares",
        "B0337BDEE17DF35E3E2BA46DEB493A9D": "Gryphon: 4 old rares",
        "E6563B101005392BAB05106E1F9B64E1": "Gryphon: 4 old rares",

// 2018

        // Ribbon Dragons
        "5853FC331C7C08D0B2B889A1D66559F4": "Ribbon Dragon: 3 old rares",
        "4DA3758D5900FCCEFF9923B07F3FF7E2": "Ribbon Dragon: 3 old rares",
        "00D6BDFADE2A1AD3D9079052A0C3DFF5": "Ribbon Dragon: 3 old rares",
        "83E64897BAA339BA80145EF168CEE9F4": "Ribbon Dragon: 3 old rares",

        // Seadogs
        "5F1DC4428CDF2B9C50F3B5E6FA8B5051": "Seadogs: 3 old rares",
        "D372E04D85B79117898C246BE2D00B48": "Seadogs: 3 old rares",
        "ABFCC3DBFC776F6EF3133DC0DCEF3B3D": "Seadogs: 3 old rares",
        "D14F017539F212D0754CD199A75BB316": "Seadogs: 3 old rares",

        // Pegasuses
        "8B14BA750577D18EED344541BED0E19A": "Pegasus: 3 old rares",
        "E41428E9A56A2DAD1DF774C32334CA6A": "Pegasus: 3 old rares",
        "5C3B09F5EA1125C1208A083DA697C724": "Pegasus: 3 old rares",
        "712F7B396299CAD32CA0BD1563A430EA": "Pegasus: 3 old rares", // Black Exclusive
        "42496798A0B7A0A1372B28DDEFA24076": "Pegasus: 3 old rares",

        //Fluffy Feathery Dogs
        "36236346D1BBED5C3A10BA6F0C06A700": "Fluffy Feathery PPS: 3 old rares", // Fluffy Feathery PPS
        "76A4EA4984355BE80ADA707A5DBEC388": "Fluffy Feathery Dog: 3 old rares",
        "587E622F785C3508A063277CE4A9DE81": "Fluffy Feathery Dog: 3 old rares",
        "D5ACF29AB0EB3C7C687251B7658DEC80": "Fluffy Feathery Dog: 3 old rares",
        "AF00BFAAE7342E2ECBF9E95286CFACDE": "Fluffy Feathery Dog: 3 old rares",

        // Neon Bwolves
        "68FBD321145B8212F7817A882F969FDA": "Neon Bwolf: 3 old rares",
        "618DB34981A54AF6070A7EB137389E6C": "Neon Bwolf: 3 old rares",
        "EE4837D127257BEF7D49DC05A4BBA808": "Neon Bwolf: 3 old rares",
        "A5CE7A1FD2C9FBDDD58E9872AB0646B7": "Neon Bwolf: 3 old rares",

        // Sketchi Cats
        "A64C4A9515705159275BC7C38D28586D": "Sketchi Cat: 3 old rares",
        "C8A4102A32C3263F38C44952233B9194": "Sketchi Cat: 3 old rares",
        "6C5B5E674BFA9935856083AC3A9F0B62": "Sketchi Cat: 3 old rares",
        "DBFA1406EE95783E74DF4B1C5D84E840": "Sketchi Cat: 3 old rares",

// 2019

        // Terrarium Cats
        "AE69F9C109BF4340BE48A1F07B995F0F": "Terrarium Cat: 3 old rares",
        "00A33C1AD34992CBE1CE7AC1EEC96383": "Terrarium Cat: 3 old rares",
        "B8A6F0040E50D26F13A361DB81F98BC5": "Terrarium Cat: 3 old rares",
        "2864B6AC0818C572F194C069D117670E": "Terrarium Cat: 3 old rares",

        // Mountain Lions
        "E18FDC4DEF8621EBDA842505B9B4CE64": "Mountain Lion: 3 old rares",
        "61D1DEED4B5E79223C25AEE2C5096F36": "Mountain Lion: 3 old rares",
        "4DCBF20B571FAEA2A30FC7242B60193E": "Mountain Lion PPS: 5 old rares", // Mountain Lion PPS
        "30B5145F066D6FEAD2D15A5162E4B135": "Mountain Lion: 3 old rares",
        "C72778606DDACA2482563DCAF7B6F274": "Mountain Lion: 3 old rares",

        // Avian Deer
        "BA8EE2BCED929F2768EE3A7C4E28FE8C": "Avian Deer: 3 old rares", // Red Exclusive
        "EB7F3C01A7EAE886FED7530942C5FA48": "Avian Deer: 3 old rares",
        "40BA6421C5C547253B94B3C834CFECBB": "Avian Deer: 3 old rares",
        "7CE23AECA52544DB5E6F06B02CE0C8E0": "Avian Deer: 3 old rares",
        "75C97451EE895FB088A48605319F74C5": "Avian Deer: 3 old rares",

        // Gryphon Dogs
        "16AF5C7B5D22175855937A971CF545B0": "Gryphon Dog: 3 old rares",
        "EB7551C5B6036EB2C1C4C41C66D56C10": "Gryphon Dog: 3 old rares",
        "F928F8AF7A6A76AE914CA882B6A77B52": "Gryphon Dog: 3 old rares",
        "BAF3B116AC1406FB325DD8B0A9C5088C": "Gryphon Dog: 3 old rares",

        // Friendship Dragons
        "859EE5125687CCDA2A7AEEECA36B3869": "Friendship Dragon Set Exclusive: 3 old rares", // Friendship Dragon Set Exclusive
        "3AA969C21D474EEFDA23E38EA9D30084": "Friendship Dragon: 3 old rares",
        "B12C2E85E52F2BF0AA71716CD3F944C1": "Friendship Dragon: 3 old rares",
        "D65C55CBA10DD6018F99126B24BAA8CD": "Friendship Dragon: 3 old rares",
        "C746F745A18C64352715D4115F367BD8": "Friendship Dragon: 3 old rares",

        // Sloths
        "1197A16D6BA6FA2327E2AD7A3B22AE4C": "Sloth: 3 old rares",
        "49BDF46359A2DC9E18D6D1E7366EA5D1": "Sloth: 3 old rares",
        "26923B8816E6E5CCEDAFB3697AF8C8BF": "Sloth: 3 old rares",
        "2A22609B0939CACB6934C2339581F915": "Sloth: 3 old rares",
        "EA3DC2B58FFE89D1BCE47C4A4F30ED7B": "Sloth: 3 old rares",
        "20CBB9EAFB799CC1857284204C70951C": "Sloth: 3 old rares", // Sloth PPS

// 2020

        // Beaked Horses
        "82978DF9190112CB6DF0EC738FB76592": "Beaked Horse: 2 old rares",
        "5E714560D610D703303AAE999088EF99": "Beaked Horse: 2 old rares",
        "9EC942CB958CBA532B0D210025A0AF58": "Beaked Horse: 2 old rares",
        "8B0C1AABCFED794E274D111D4A175681": "Beaked Horse: 2 old rares",

        // Celestial Dogs
        "47F7F4CA26133DC08C7651EF8A8C5D30": "Celestial Dog: 2 old rares",
        "0CF1371A8F30F817DEFA4DEEE806FE34": "Celestial Dog: 2 old rares",
        "76C9E9C379CE49294ED0D1FD455B7039": "Celestial Dog: 2 old rares",
        "8D5471B1D2EB6C82CBC966F9950B1DBB": "Celestial Dog: 2 old rares",

        // Teacup Bunnies
        "736C323561665F5F579CF35514C99538": "Teacup Bunny: 2 old rares",
        "93040718E30034015A86E9571C94A61E": "Teacup Bunny: 2 old rares",
        "5DCF4E040E38EFE8C7BAD70EFB5D59FC": "Teacup Bunny: 2 old rares",
        "9C16D46066AADC516A3AA9CD844764A7": "Teacup Bunny: 2 old rares",
        "672A34E25913B8F409EAF8EFDE74F984": "Teacup Bunny PPS: 2 old rares", // Teacup Bunny PPS

         // Long-tailed Cats
        "329C859AA3DD72C5E89D73E58CA2871C": "Long-tailed Cat: 2 old rares",
        "E6A4AAD7644967B9FCBC1F4FE14238FB": "Long-tailed Cat: 2 old rares",
        "AB32785D7F8C550823D5742D8A2E8967": "Long-tailed Cat: 2 old rares",
        "E39B20561282D5CA2524A9D96A66261E": "Long-tailed Cat: 2 old rares",

        // Ninetails Foxes
        "2714B55D79F790EBEF8D005B9BFAC534": "Ninetails Fox: 2 old rares",
        "2CB84A3DB9084A5354B9C97E59BD1610": "Ninetails Fox: 2 old rares",
        "53441263D1138462AC6DB8633C8C95AE": "Ninetails Fox: 2 old rares",
        "1CF7311BD194FFF83C54114362E77CC5": "Ninetails Fox: 2 old rares",

        // Elemental Foxes
        "2D5F2FAFFDFCB5B4011CAA373504E06A": "Elemental Fox: 2 old rares",
        "B8693C05E85C9E6B61DA0E75168ACE2A": "Elemental Fox: 2 old rares",
        "DAD188E63B6541ACB195C7AACC39EA38": "Elemental Fox: 2 old rares",
        "3033F55B8C359B5537033F7DE3F4C6CC": "Elemental Fox: 2 old rares",

//2021

        // Drink Rats
        "7F6B39AC74CF417C2B177B56440A49A8": "Drink Rat: 2 old rares",
        "17B3EE6751481A482EE1229C7D353B08": "Drink Rat: 2 old rares",
        "C354AFB2A03BCC3E06BFBD5CDD3B38A5": "Drink Rat: 2 old rares",
        "8836D9309842C6B747552FF850FCABBE": "Drink Rat: 2 old rares",

        // Giraffes
        "33EB4E31BD5AE1DB906A00C77F6DB51E": "Giraffe: 2 old rares", // Giraffe PPS
        "69BDD85D8FD08F3302A2A2921E01CA31": "Giraffe: 2 old rares",
        "BAA9EB73B1B8D0C4240A09AC92392A72": "Giraffe: 2 old rares",
        "30930FD729B91D6C92D12CAB122311F6": "Giraffe: 2 old rares",
        "EDF8C2EB585C58A6FABDB5C6D213DDFF": "Giraffe: 2 old rares",

        // Aesthetic Ponies
        "F335FC89083B9F277CB9E4A044EF841D": "Aesthetic Pony: 2 old rares",
        "AC953D60F7E87108981649516B95FE1A": "Aesthetic Pony: 2 old rares",
        "D6DD7B63ADECB8951A5BFC58548B9D86": "Aesthetic Pony: 2 old rares",
        "8F80F60FB3F0706EA10BCCB9E443D3C6": "Aesthetic Pony: 2 old rares",
        "64E560D06F6A477D09F8A6711733396E": "Aesthetic Pony PPS: 2 old rares", // Aesthetic Pony PPS

        // Peacocks
        "90E59EB40ECEDF27B97B7BF7D01E34C5": "Peacock: 2 old rares",
        "A19D3A10B0D47FF0B46D5BADCD5DCC70": "Peacock: 2 old rares",
        "698EEE50859A0DB47923A4542C3CF60E": "Peacock: 2 old rares",
        "2727C11A881D99C68E6A75A98A6D0129": "Peacock: 2 old rares",
        "96BB7971500DDBA2ECE72F42692A3BAC": "Peacock: 2 old rares",
        "C53283FABFDEA37DE7143043DAA48747": "Peacock PPS: 2 old rares", // Peacock PPS

        // Fluffy Alien Dogs
        "09496381319F279151B1BE1EA80E6F81": "Fluffy Alien Dog: 2 old rares",
        "A07F27D2828A1D298BA7CF13883F7B34": "Fluffy Alien Dog: 2 old rares",
        "BE999F9DA056A325E883A9D8AFC672C1": "Fluffy Alien Dog: 2 old rares",
        "9BD2E246DFC0E780C6C0C91DCDD0F34B": "Fluffy Alien Dog: 2 old rares",
        "499B1E72BF7930215DC7D09238B5410F": "Fluffy Alien Dog PPS: 2 old rares", // Fluffy Alien Dog PPS

        // Realistic Cats
        "C8D9E841C5AC4049120DF11B7FA58C6C": "Realistic Cat: 2 old rares",
        "A8F72BA30D67C149AF19EDE7BEDDB28C": "Realistic Cat: 2 old rares",
        "E1E68098A2B6C3BFFB3BBDF52ED0028E": "Realistic Cat: 2 old rares",
        "13D50D891ACD36A514AC49FEFF57A0EA": "Realistic Cat: 2 old rares",
        "6AE611BA7BB3D1E866705C6DC52DF652": "Realistic Cat: 2 old rares", // Calico cat

// 2022

        // Legendary Deer
        "DD71CE704C3CEEAC1336F87B3AFB9873": "Legendary Deer: 1 old rares",
        "7EECDBEDDD17C98FE9C34A86B998C33D": "Legendary Deer: 1 old rares",
        "04556C8F27E9D885F9F04C18CF42F285": "Legendary Deer: 1 old rares",
        "4A7BF0F95427DC2C65880D2CDE1147DE": "Legendary Deer: 1 old rares",

        // Celestial Angel Dogs
        "3E55A8B9F253C4A82AABB6F5DAD327A4": "Celestial Angel Dog: 1 old rares",
        "3DC790FBD5C5C0D8DDB3B6C227183FA1": "Celestial Angel Dog: 1 old rares",
        "FC49AA2AADA7EB13ED7869522117032B": "Celestial Angel Dog: 1 old rares",
        "3DDF862987832090EF275605A161DB87": "Celestial Angel Dog: 1 old rares",

        // Mythological Snakes
        "3A6DB0BD90D0FFAF8DAB1BFDB103FBD4": "Mythological Snake: 1 old rares",
        "5A69A367C34F3A87CD3088417ED068B5": "Mythological Snake: 1 old rares",
        "03E41ECADDC2D4B61F46D7110CE66D8A": "Mythological Snake: 1 old rares",
        "F5AFC8068C3C9774CD6D7A683F033D06": "Mythological Snake PPS: 1 old rares", // Mythological Snake PPS
        "F6851C909C1DB6E328DE652B4F62EC8E": "Mythological Snake: 1 old rares",

        // Legendary Unicorns
        "CFE47ACE7C9F303422369ED9CAA3EBE7": "Legendary Unicorns: 1 old rares", // Rainbow Legendary Unicorn
        "89FAE112809ACE756C444CF20582B3A1": "Legendary Unicorns: 1 old rares",
        "9ABBD3AEE89F1B06343B2637FB67BEC1": "Legendary Unicorns: 1 old rares",
        "9BBFA8D156A74407ECA2B15A4F27C8DC": "Legendary Unicorns: 1 old rares",

        // Draconix Ponies
        "C435A759C597AF63792D8BFAB50D13C5": "Draconix Ponies: 1 old rares",
        "3B4996864A76C7AE8E1389A4C443CC50": "Draconix Ponies: 1 old rares",
        "063DBFE6E39F93FA6A350FAF02E92B60": "Draconix Ponies: 1 old rares",
        "5451361E8C64E401FE6D0AD49D9F0DC1": "Draconix Ponies: 1 old rares",

        // Phoenix Stores
        "9BF2EB41B9AAAEA415DA9A7968B67642": "Phoenix Store: 1 old rares",
        "9672A77E0AE7AE9416E5F24BD4FF8D3A": "Phoenix Store: 1 old rares",
        "2CA98B4591B83EB9D3DB8CA6BC60382F": "Phoenix Store: 1 old rares", // Weird Black Bird
        "FDD153D1F05C6A8499F6AD51F08F77F9": "Phoenix Store: 1 old rares", // Uggo Doggo
        "987976825FDDA02112C059D7B4054A31": "Phoenix Store PPS: 1 old rares", // Phoenix Store PPS

// 2023

        // Loch Ness Monsters
        "EFD00E85B7197776FA5851D8599700B8": "Loch Ness Monster: 1 old rares",
        "002DAA62359B3863FE316D8265D8494A": "Loch Ness Monster: 1 old rares",
        "F2C30BF7F3390EC492D9C5504B1E717E": "Loch Ness Monster: 1 old rares",
        "21A015170F488F8FE21E81B1E2227314": "Loch Ness Monster: 1 old rares",

        // Dachshunds
        "0E90A86B5CB82BCC679BC71EFA8BFB65": "Dachshund: 1 old rares",
        "42740343853D77EFBF4CD5AE3E473F75": "Dachshund: 1 old rares",
        "95A291BBBE4D683FB03F47C0C42AC57B": "Dachshund: 1 old rares",
        "FA2F0224629085D5B50DA1CF52A222C0": "Dachshund: 1 old rares",
        "49A10D790F90A08727659ACBFD2E2D22": "Dachshund: 1 old rares",

        // Realistic Deer
        "4D4FE8AA312026C8ADEDAA392845C65A": "Realistic Deer: 1 old rares",
        "63B8F587095A0738E6C85B12FD4BAC6C": "Realistic Deer: 1 old rares",
        "09F45CBF365D62D878BB3E395CD7F64C": "Realistic Deer: 1 old rares",
        "009FE089ED4FECD3BB76519DA6C4B0BC": "Realistic Deer Set Exclusive: 1 old rares", // Realistic Deer Set Exclusive
        "3CF7DD3D509E730A371102253748AA27": "Realistic Deer: 1 old rares",

        // Lionfish
        "4DDD567DAFCE41F623A5FCFACA139F7F": "Lionfish: 1 old rares",
        "B1A66934A4752CC6A9058B6F118E66E7": "Lionfish: 1 old rares",
        "4BFC0DD135B558B8B1AE807CD337905E": "Lionfish: 1 old rares",
        "B6F6781C5639BAE95EC62A0F0C61DC21": "Lionfish: 1 old rares",
        "25D087B0F66053360C8478CB0666240A": "Lionfish: 1 old rares",

        // Aesthetic Bwolves
        "F8123AF69966A14DD05FB67124CE880D": "Aesthetic Bwolf: 1 old rares",
        "BBF84B6243E9E20DEF18420BF6245322": "Aesthetic Bwolf: 1 old rares",
        "EEB50BDDB0FBB194933F2D78C16CFFEB": "Aesthetic Bwolf: 1 old rares",
        "934284F183C7410A00D8586FDFBE9ADC": "Aesthetic Bwolf: 1 old rares",

        // Kangaroos
        "7BE0804EDC6D55E513173EE4742B4F99": "Kangaroo PPS: 1 old rares", // Kangaroo PPS
        "42840FCCBC185BBAF2B01ED1F1F57A15": "Kangaroo: 1 old rares",
        "C3D1F58FBA9FB8C062765668249AA3EF": "Kangaroo: 1 old rares",
        "61A7379AFC1A3E41B287E5A13CCA4831": "Kangaroo: 1 old rares",
        "5B86AE230C2087A481F33D7EEF02C1B6": "Kangaroo: 1 old rares",
        "665D616D6FB51B1AD631C8FBC7646485": "Kangaroo: 1 old rares",

// 2024

        // Dragon Dogs
        "00687FDBF8535494F3F6F843FE74FCB6": "Dragon Dog: 1 old rares",
        "F16B8727C7469DBD8054141F6ED73885": "Dragon Dog: 1 old rares",
        "36DF97CA8D50D153807F0C77A418DAFE": "Dragon Dog: 1 old rares",
        "F9A5CFFE081226C4F209D9123698AA61": "Dragon Dog: 1 old rares",

        // Alien Cats/Worms
        "860BD8E95A033D4E8B625523A6784FAB": "Alien Cat/Worm: 1 old rares", // Cats
        "B4765C9315D41650D5F2530FB6132E76": "Alien Cat/Worm: 1 old rares",
        "7CCC033AE92BCE93B812A08F8C89CC04": "Alien Cat/Worm: 1 old rares",
        "C87D4A3650AD67821D4BA72322228102": "Alien Cat/Worm: 1 old rares",
        "413C390EBE77E773833D7E037E00C20A": "Alien Cat/Worm: 1 old rares", // Worms
        "2AB57FDC15C25FD3BBBCC136B0BCA824": "Alien Cat/Worm: 1 old rares",
        "4F347361F4C268F3FC7D4AE0476B4CD8": "Alien Cat/Worm: 1 old rares",
        "0972B2E80BED2200C80883341EFAB63E": "Alien Cat/Worm: 1 old rares",

        // Kitty Dragons
        "15CCD61307FBA8F01B7B4DD8FA6222D1": "Kitty Dragon: 1 old rares",
        "BA0112EDB938662C34E3542AA0E2D6DA": "Kitty Dragon: 1 old rares",
        "0CB889E6C30897567E18B4DEE71C3A5A": "Kitty Dragon: 1 old rares",
        "983026F9B8C388D92909F80B158FDD05": "Kitty Dragon: 1 old rares",

        // Ostriches
        "55C9864C1EACF1E438ED2D0C9438C29B": "Ostrich: 1 old rares",
        "222D710CAECE31EA9D242CB37301E0CC": "Ostrich: 1 old rares",
        "BDA2154156F245BC261E5912607BEA7B": "Ostrich: 1 old rares",
        "A2027609EBB001FBEB1BD5FD32DECA02": "Ostrich: 1 old rares",
        "CB234DDE5FA145B0EAE239C80DDEFC9E": "Ostrich PPS: 1 old rares", // Ostrich PPS

        // Fairytale Drafts
        "E0B41CFBEB773A6069C78FCF1461B876": "Fairytale Drafts: 1 old rares",
        "11A8E649B071B901FCA359BBED97E50F": "Fairytale Drafts: 1 old rares",
        "8620A90EAD0645A924C47D8DFD9A32A8": "Fairytale Drafts: 1 old rares",
        "0BDBB74A75F4F50AEA1521CE274667E4": "Fairytale Drafts: 1 old rares",

        // Pastel Celestial B-Wolves
        "B5524BA282171A307A3EF01523D8AE38": "Pastel Celestial B-Wolf: 1 old rares",
        "60CB3130A4952DAD8B370C8473A36FD9": "Pastel Celestial B-Wolf: 1 old rares",
        "258B76D65F2445F93797CD12A2EF8EF6": "Pastel Celestial B-Wolf: 1 old rares",
        "5D8F6BAD5D8A60BFFA669B1FD02C91C0": "Pastel Celestial B-Wolf: 1 old rares",
    };

    // Function to rename store pets based on their picture URLs
    function renameStorePets() {
        const petRows = document.querySelectorAll('.pet');

        petRows.forEach((petRow) => {
            const imgElement = petRow.querySelector('img');
            const nameInput = petRow.querySelector('.pet-new-name');

            if (imgElement && nameInput) {
                const imgUrl = imgElement.src;
                const urlCodeMatch = imgUrl.match(/k=([A-Z0-9]+)&/);

                if (urlCodeMatch) {
                    const urlCode = urlCodeMatch[1];
                    const namePrice = urlToNamePrice[urlCode];

                    if (namePrice) {
                        nameInput.value = namePrice; // Set the name based on the mapping
                    }
                }
            }
        });
    }

    // Create the "Rename Store Pets" button
    function createRenameButton() {
        const buttonContainer = document.querySelector('.rename-pets-enabled');
        if (buttonContainer) {
            const renameButton = document.createElement('button');
            renameButton.className = 'btn-rename-store-pets';
            renameButton.textContent = 'Rename Store Pets';
            renameButton.style.marginLeft = '10px';
            renameButton.addEventListener('click', renameStorePets);
            buttonContainer.appendChild(renameButton);
        }
    }

    // Run the function to add the button when the page loads
    window.addEventListener('load', createRenameButton);
})();